import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
  cnpj,
  operatorAdmin,
  publishEvent,
  registerOrg,
  seedContract,
  setup,
  type Browser,
  type Ctx,
} from "./helpers.js";
import { cnpjFromBase } from "../src/server/domain/cnpj.js";

let ctx: Ctx;
let op: Browser;
let G: Browser;
beforeAll(async () => {
  ctx = await setup();
  op = await operatorAdmin(ctx);
  G = (await registerOrg(ctx, "manager", { approveWith: op })).browser;
});
afterAll(async () => ctx.close());

const alertsOf = async (b: Browser, q = "") =>
  (await b.get(`/app/alerts${q}`)).json().data as Array<Record<string, any>>;

describe("motor de alertas rules@1 (ponta a ponta)", () => {
  it("publicar evento gera alerta só para contratos do fornecedor, vigentes ou futuros", async () => {
    const sup = cnpj();
    const other = cnpj();
    const hit = await seedContract(G, sup);
    const ended = await seedContract(G, sup, { start_date: "2024-01-01", end_date: "2026-05-19" });
    await seedContract(G, other);
    const { result } = await publishEvent(op, sup, { event_date: "2026-05-20" });
    expect(result).toEqual({ evaluated: 2, created: 1 });
    const list = await alertsOf(G, `?supplier_cnpj=${sup}`);
    expect(list.map((x) => x.contract.id)).toEqual([hit.contractId]);
    expect(list[0]!.severity).toBe("critical");
    expect(list[0]!.rule_version).toBe("rules@1");
    expect(list[0]!.reasons).toContain("supplier_match_exact");
    const exp = (await G.get(`/app/contracts/${ended.contractId}/explanation`)).json();
    expect(exp.evaluated_events[0].match).toBe(false);
    expect(exp.evaluated_events[0].checks.find((c: any) => c.rule === "C4").reason).toBe("contract_ended_before_event");
  });

  it("republicar não duplica alertas (idempotente)", async () => {
    const sup = cnpj();
    await seedContract(G, sup);
    const { eventId } = await publishEvent(op, sup);
    const again = await op.post(`/app/admin/events/${eventId}/publish`);
    expect(again.json()).toEqual({ evaluated: 1, created: 0 });
    expect(await alertsOf(G, `?supplier_cnpj=${sup}`)).toHaveLength(1);
  });

  it("contrato criado DEPOIS da publicação também recebe alerta", async () => {
    const sup = cnpj();
    await publishEvent(op, sup);
    await seedContract(G, sup, { start_date: "2027-01-01", end_date: "2028-12-31" });
    expect(await alertsOf(G, `?supplier_cnpj=${sup}`)).toHaveLength(1);
  });

  it("evento de grupo alcança filial (mesma raiz de CNPJ); evento de entidade não", async () => {
    const matriz = cnpjFromBase("424242420001");
    const filial = cnpjFromBase("424242420002");
    await seedContract(G, filial);
    await publishEvent(op, matriz, { scope: "entity" });
    expect(await alertsOf(G, `?supplier_cnpj=${filial}`)).toHaveLength(0);
    await publishEvent(op, matriz, { scope: "group", type: "bankruptcy_filed" });
    const l = await alertsOf(G, `?supplier_cnpj=${filial}`);
    expect(l).toHaveLength(1);
    expect(l[0]!.reasons).toContain("supplier_match_group_root");
  });

  it("sem preço de referência não estima exposição; com referência calcula com fonte e unidades", async () => {
    const sup = cnpj();
    await seedContract(G, sup, {
      submarket: "NE",
      volume_mwm: 2,
      price_brl_per_mwh: 180,
      guarantee_brl: 600_000,
      start_date: "2026-01-01",
      end_date: "2030-12-31",
    });
    await publishEvent(op, sup);
    const [noRef] = await alertsOf(G, `?supplier_cnpj=${sup}`);
    expect(noRef!.exposure).toBeNull();
    expect(noRef!.exposure_reason).toBe("no_reference_price");
    expect(noRef!.reasons).toContain("no_reference_price");

    const sup2 = cnpj();
    await op.post("/app/admin/reference-prices", {
      submarket: "S",
      reference_date: "2026-11-01",
      price_brl_per_mwh: 280,
      source_name: "Referência sintética",
      source_url: "https://exemplo.invalid/ref",
    });
    await seedContract(G, sup2, {
      submarket: "S",
      volume_mwm: 2,
      price_brl_per_mwh: 180,
      guarantee_brl: 600_000,
      start_date: "2026-01-01",
      end_date: "2030-12-31",
    });
    await publishEvent(op, sup2);
    const [withRef] = await alertsOf(G, `?supplier_cnpj=${sup2}`);
    const e = withRef!.exposure;
    expect(e.reference_price_brl_per_mwh).toBe(280);
    expect(e.reference_price_source).toBe("Referência sintética");
    expect(e.remaining_energy_mwh).toBe(2 * e.remaining_hours);
    expect(e.replacement_cost_brl).toBeCloseTo(e.remaining_energy_mwh * 100, 2);
    expect(e.guarantee_coverage_pct).toBeGreaterThan(0);
  });

  it("retirada: alertas abertos viram 'retracted', status não muda mais, e nada novo é gerado", async () => {
    const sup = cnpj();
    await seedContract(G, sup);
    const { eventId } = await publishEvent(op, sup);
    const [al] = await alertsOf(G, `?supplier_cnpj=${sup}`);
    expect((await G.patch(`/app/alerts/${al!.id}`, { status: "acknowledged" })).json().status).toBe("acknowledged");
    expect((await op.post(`/app/admin/events/${eventId}/retract`, { reason: "x" })).statusCode).toBe(422);
    const r = await op.post(`/app/admin/events/${eventId}/retract`, {
      reason: "Fonte corrigiu a publicação original.",
    });
    expect(r.json()).toEqual({ alerts_retracted: 1 });
    expect((await G.get(`/app/alerts/${al!.id}`)).json().status).toBe("retracted");
    expect((await G.patch(`/app/alerts/${al!.id}`, { status: "open" })).statusCode).toBe(409);
    await seedContract(G, sup, { start_date: "2028-01-01", end_date: "2028-12-31" });
    expect((await alertsOf(G, `?supplier_cnpj=${sup}`)).filter((x) => x.status !== "retracted")).toHaveLength(0);
    expect((await op.post(`/app/admin/events/${eventId}/publish`)).statusCode).toBe(409);
  });

  it("excluir contrato tira seus alertas das listas", async () => {
    const sup = cnpj();
    const c = await seedContract(G, sup);
    await publishEvent(op, sup);
    expect(await alertsOf(G, `?supplier_cnpj=${sup}`)).toHaveLength(1);
    await G.del(`/app/contracts/${c.contractId}`);
    expect(await alertsOf(G, `?supplier_cnpj=${sup}`)).toHaveLength(0);
  });

  it("evento em rascunho não gera alerta; curadoria exige fonte http(s)", async () => {
    const sup = cnpj();
    await seedContract(G, sup);
    const bad = await op.post("/app/admin/events", {
      supplier_cnpj: sup,
      type: "balanced_operation",
      event_date: "2026-01-01",
      source_published_on: "2026-01-01",
      source_name: "X fonte",
      source_url: "ftp://x",
      summary: "resumo de teste longo",
    });
    expect(bad.statusCode).toBe(422);
    const ok = await op.post("/app/admin/events", {
      supplier_cnpj: sup,
      type: "balanced_operation",
      event_date: "2026-01-01",
      source_published_on: "2026-01-01",
      source_name: "X fonte",
      source_url: "https://exemplo.invalid",
      summary: "resumo de teste longo",
    });
    expect(ok.json().status).toBe("draft");
    expect(await alertsOf(G, `?supplier_cnpj=${sup}`)).toHaveLength(0);
  });
});

describe("direito de resposta do fornecedor", () => {
  it("fornecedor vê só eventos sobre si, responde, e a gestora vê a resposta no alerta", async () => {
    const sup = cnpj();
    const supOrg = (await registerOrg(ctx, "supplier", { approveWith: op, cnpj: sup })).browser;
    await seedContract(G, sup);
    const { eventId } = await publishEvent(op, sup);
    await publishEvent(op, cnpj());
    const mine = (await supOrg.get("/app/supplier/events")).json();
    expect(mine.map((e: any) => e.id)).toEqual([eventId]);
    expect(JSON.stringify(mine)).not.toMatch(/org_id|contract/);
    expect((await supOrg.post(`/app/supplier/events/${eventId}/responses`, { body: "curta" })).statusCode).toBe(422);
    expect(
      (
        await supOrg.post(`/app/supplier/events/${eventId}/responses`, {
          body: "Pedido de RJ foi indeferido em 01/06/2026; ver autos.",
        })
      ).statusCode,
    ).toBe(201);
    const [al] = await alertsOf(G, `?supplier_cnpj=${sup}`);
    expect(al!.event.supplier_responses[0].body).toMatch(/indeferido/);
    const otherEvent = (await op.get("/app/admin/events?status=published"))
      .json()
      .find((e: any) => e.supplier.cnpj !== sup);
    expect(
      (
        await supOrg.post(`/app/supplier/events/${otherEvent.id}/responses`, {
          body: "tentando responder evento alheio",
        })
      ).statusCode,
    ).toBe(404);
  });
});
