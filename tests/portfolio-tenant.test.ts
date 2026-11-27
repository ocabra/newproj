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

let ctx: Ctx;
let op: Browser;
let A: Browser;
let B: Browser;
const SUP = cnpj();
let a: Awaited<ReturnType<typeof seedContract>>;

beforeAll(async () => {
  ctx = await setup();
  op = await operatorAdmin(ctx);
  A = (await registerOrg(ctx, "manager", { approveWith: op })).browser;
  B = (await registerOrg(ctx, "manager", { approveWith: op })).browser;
  a = await seedContract(A, SUP);
  await seedContract(B, SUP);
  await publishEvent(op, SUP);
});
afterAll(async () => ctx.close());

describe("carteira", () => {
  it("cria e lista clientes, unidades e contratos com unidades explícitas", async () => {
    const list = await A.get("/app/contracts");
    expect(list.statusCode).toBe(200);
    expect(list.json().data).toHaveLength(1);
    expect(list.json().data[0]).toMatchObject({ volume_mwm: 2, price_brl_per_mwh: 180, supplier: { cnpj: SUP } });
  });

  it("CNPJ de cliente duplicado na mesma carteira é 409; em outra carteira é permitido", async () => {
    const c = cnpj();
    expect((await A.post("/app/clients", { legal_name: "Dup", cnpj: c })).statusCode).toBe(201);
    expect((await A.post("/app/clients", { legal_name: "Dup", cnpj: c })).statusCode).toBe(409);
    expect((await B.post("/app/clients", { legal_name: "Dup", cnpj: c })).statusCode).toBe(201);
  });

  it("validações de contrato: unidade (MWm), faixa de preço, datas", async () => {
    const base = {
      site_id: a.siteId,
      supplier_cnpj: SUP,
      start_date: "2026-01-01",
      end_date: "2026-12-31",
      volume_mwm: 1,
      price_brl_per_mwh: 200,
    };
    expect((await A.post("/app/contracts", { ...base, volume_mwm: 1500 })).statusCode).toBe(422);
    expect((await A.post("/app/contracts", { ...base, volume_mwm: -1 })).statusCode).toBe(422);
    expect((await A.post("/app/contracts", { ...base, price_brl_per_mwh: 9000 })).statusCode).toBe(422);
    expect((await A.post("/app/contracts", { ...base, end_date: "2025-01-01" })).statusCode).toBe(422);
    expect((await A.post("/app/contracts", { ...base, start_date: "2026-02-30" })).statusCode).toBe(422);
  });

  it("contrato sobreposto (mesma unidade e fornecedor) exige confirmação explícita", async () => {
    const body = {
      site_id: a.siteId,
      supplier_cnpj: SUP,
      start_date: "2027-06-01",
      end_date: "2028-06-01",
      volume_mwm: 1,
      price_brl_per_mwh: 200,
    };
    const r = await A.post("/app/contracts", body);
    expect(r.statusCode).toBe(409);
    expect(r.json().error.details.overlapping_contract_ids).toContain(a.contractId);
    const ok = await A.post("/app/contracts", { ...body, confirm_overlap: true });
    expect(ok.statusCode).toBe(201);
    expect(ok.json().warnings[0]).toMatch(/Sobrepõe/);
    await A.del(`/app/contracts/${ok.json().id}`);
  });

  it("fornecedor fora do catálogo sem nome é 422", async () => {
    const r = await A.post("/app/contracts", {
      site_id: a.siteId,
      supplier_cnpj: cnpj(),
      start_date: "2026-01-01",
      end_date: "2026-12-31",
      volume_mwm: 1,
      price_brl_per_mwh: 200,
    });
    expect(r.statusCode).toBe(422);
    expect(r.json().error.details.field).toBe("supplier_name");
  });

  it("paginação por cursor não repete nem pula itens", async () => {
    for (let i = 0; i < 5; i++) await A.post("/app/clients", { legal_name: `Pag ${i}`, cnpj: cnpj() });
    const all = (await A.get("/app/clients?limit=100")).json().data.map((c: { id: string }) => c.id);
    const seen: string[] = [];
    let cursor: string | null = null;
    do {
      const r = await A.get(`/app/clients?limit=2${cursor ? `&cursor=${cursor}` : ""}`);
      seen.push(...r.json().data.map((c: { id: string }) => c.id));
      cursor = r.json().next_cursor;
    } while (cursor);
    expect(seen).toEqual(all);
    expect((await A.get("/app/clients?cursor=lixo")).statusCode).toBe(422);
  });
});

describe("exclusão e mensagens", () => {
  it("excluir unidade exclui seus contratos; B não exclui unidade de A", async () => {
    const x = await seedContract(A, cnpj());
    expect((await B.del(`/app/sites/${x.siteId}`)).statusCode).toBe(404);
    expect((await A.del(`/app/sites/${x.siteId}`)).statusCode).toBe(204);
    expect((await A.get(`/app/contracts/${x.contractId}`)).statusCode).toBe(404);
  });
  it("mensagens de validação em português", async () => {
    const r = await A.post("/app/clients", { legal_name: "X", cnpj: "1" });
    expect(r.statusCode).toBe(422);
    expect(JSON.stringify(r.json().error.details)).toMatch(/pequeno|caracteres/i);
  });
});

describe("isolamento entre organizações (manipulando IDs e filtros)", () => {
  it("B não lê, altera nem exclui contrato de A (404, sem vazar existência)", async () => {
    expect((await B.get(`/app/contracts/${a.contractId}`)).statusCode).toBe(404);
    expect((await B.patch(`/app/contracts/${a.contractId}`, { volume_mwm: 99 })).statusCode).toBe(404);
    expect((await B.del(`/app/contracts/${a.contractId}`)).statusCode).toBe(404);
    expect((await B.get(`/app/contracts/${a.contractId}/explanation`)).statusCode).toBe(404);
    expect((await A.get(`/app/contracts/${a.contractId}`)).json().volume_mwm).toBe(2);
  });

  it("B não cria unidade no cliente de A nem contrato na unidade de A", async () => {
    expect((await B.post("/app/sites", { client_id: a.clientId, name: "Invasão", submarket: "S" })).statusCode).toBe(
      404,
    );
    const r = await B.post("/app/contracts", {
      site_id: a.siteId,
      supplier_cnpj: SUP,
      start_date: "2026-01-01",
      end_date: "2026-12-31",
      volume_mwm: 1,
      price_brl_per_mwh: 1,
    });
    expect(r.statusCode).toBe(404);
  });

  it("filtro por client_id de outra organização devolve vazio", async () => {
    expect((await B.get(`/app/contracts?client_id=${a.clientId}`)).json().data).toEqual([]);
    expect((await B.get(`/app/alerts?client_id=${a.clientId}`)).json().data).toEqual([]);
  });

  it("cada carteira vê só os próprios alertas; B não lê alerta de A", async () => {
    const la = (await A.get("/app/alerts")).json().data;
    const lb = (await B.get("/app/alerts")).json().data;
    expect(la).toHaveLength(1);
    expect(lb).toHaveLength(1);
    expect(la[0].id).not.toBe(lb[0].id);
    expect((await B.get(`/app/alerts/${la[0].id}`)).statusCode).toBe(404);
    expect((await B.patch(`/app/alerts/${la[0].id}`, { status: "resolved" })).statusCode).toBe(404);
    expect((await A.get(`/app/alerts/${la[0].id}`)).json().status).toBe("open");
  });

  it("fornecedor não acessa carteiras; gestora não acessa área de fornecedor", async () => {
    const sup = (await registerOrg(ctx, "supplier", { approveWith: op, cnpj: SUP })).browser;
    expect((await sup.get("/app/contracts")).statusCode).toBe(403);
    expect((await sup.get("/app/alerts")).statusCode).toBe(403);
    expect((await A.get("/app/supplier/events")).statusCode).toBe(403);
  });
});
