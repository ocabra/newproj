import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { cnpj, operatorAdmin, publishEvent, registerOrg, setup, type Browser, type Ctx } from "./helpers.js";

let ctx: Ctx;
let op: Browser;
let G: Browser;
const H =
  "client_cnpj,client_name,site_name,submarket,supplier_cnpj,supplier_name,start_date,end_date,volume_mwm,price_brl_per_mwh,guarantee_brl,guarantee_type";

beforeAll(async () => {
  ctx = await setup();
  op = await operatorAdmin(ctx);
  G = (await registerOrg(ctx, "manager", { approveWith: op })).browser;
});
afterAll(async () => ctx.close());

describe("importação CSV de contratos", () => {
  it("exige declaração de mandato", async () => {
    const r = await G.req("POST", "/app/imports/contracts?filename=a.csv", `${H}\n`);
    expect(r.statusCode).toBe(422);
    expect(r.json().error.details.text_version).toBe("mandato@1");
  });

  it("rejeita o arquivo inteiro se houver qualquer linha inválida, sem criar nada", async () => {
    const sup = cnpj();
    const ok = `${cnpj()},Cliente A,Planta 1,SE_CO,${sup},Forn,2026-01-01,2027-12-31,2,180,,none`;
    const bad = `${cnpj()},Cliente B,Planta 1,SE_CO,${sup},Forn,2026-01-01,2027-12-31,1825,180,,none`;
    const r = await G.req("POST", "/app/imports/contracts?filename=b.csv&mandate=accepted", `${H}\n${ok}\n${bad}\n`);
    expect(r.statusCode).toBe(200);
    expect(r.json().accepted).toBe(false);
    expect(r.json().errors[0]).toMatchObject({ line: 3, field: "volume_mwm" });
    expect((await G.get("/app/contracts")).json().data).toHaveLength(0);
  });

  it("aceita arquivo válido, agrupa clientes/unidades, registra mandato e alerta eventos já publicados", async () => {
    const sup = cnpj();
    await publishEvent(op, sup);
    const cli = cnpj();
    const lines = [
      `${cli},Cliente C,Planta 1,SE_CO,${sup},Forn,2026-01-01,2027-12-31,2,180,500000,bank_guarantee`,
      `${cli},Cliente C,Planta 2,S,${cnpj()},Outro Forn,2026-01-01,2027-12-31,1,200,,`,
    ];
    const r = await G.req(
      "POST",
      "/app/imports/contracts?filename=c.csv&mandate=accepted",
      `${H}\n${lines.join("\n")}\n`,
    );
    expect(r.json()).toMatchObject({ accepted: true, rows_ok: 2 });
    expect((await G.get("/app/clients")).json().data).toHaveLength(1);
    expect((await G.get("/app/sites")).json().data).toHaveLength(2);
    expect((await G.get(`/app/alerts?supplier_cnpj=${sup}`)).json().data).toHaveLength(1);
    const hist = (await G.get("/app/imports")).json();
    expect(hist.map((h: { rowsOk: number }) => h.rowsOk)).toEqual([2, 0]);
  });

  it("rejeita corpo acima do limite (413) e CSV malformado", async () => {
    const huge = `${H}\n` + "x".repeat(1_200_000);
    const r = await G.req("POST", "/app/imports/contracts?mandate=accepted", huge);
    expect(r.statusCode).toBe(413);
    const m = await G.req("POST", "/app/imports/contracts?mandate=accepted", `${H}\n"aberto`);
    expect(m.json().accepted).toBe(false);
  });
});

describe("importação do Fator de Alavancagem (curadoria)", () => {
  it("piora de faixa cria evento RASCUNHO para revisão; nada é publicado sozinho", async () => {
    const sup = cnpj();
    const h = "supplier_cnpj,supplier_name,week_start,band_rank,value,source_name,source_url";
    const csv = [
      h,
      `${sup},Forn FA,2026-03-02,1,,CCEE (sintético),https://exemplo.invalid/fa`,
      `${sup},Forn FA,2026-03-09,1,,CCEE (sintético),https://exemplo.invalid/fa`,
      `${sup},Forn FA,2026-03-16,3,,CCEE (sintético),https://exemplo.invalid/fa`,
    ].join("\n");
    const r = await op.req("POST", "/app/admin/imports/leverage?filename=fa.csv", csv);
    expect(r.json()).toMatchObject({ accepted: true, rows_ok: 3, drafts_created: 1 });
    const drafts = (await op.get("/app/admin/events?status=draft"))
      .json()
      .filter((e: { supplier: { cnpj: string } }) => e.supplier.cnpj === sup);
    expect(drafts).toHaveLength(1);
    expect(drafts[0]).toMatchObject({ type: "leverage_band_worsened", event_date: "2026-03-16" });
    expect(drafts[0].caveat).toMatch(/não verificada/);
    expect((await G.req("POST", "/app/admin/imports/leverage", csv)).statusCode).toBe(403);
  });
});
