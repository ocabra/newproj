import fs from "node:fs";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { generateOpenApiYaml } from "../scripts/gen-openapi.js";
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
let G: Browser;
let H: Browser;
let full: string;
let readOnly: string;
const SUP = cnpj();

const api = (c: Ctx, method: string, url: string, key?: string, body?: unknown, headers: Record<string, string> = {}) =>
  c.app.inject({
    method: method as "GET",
    url,
    headers: { ...(key ? { authorization: `Bearer ${key}` } : {}), ...headers },
    ...(body === undefined ? {} : { payload: body as object }),
  });

beforeAll(async () => {
  ctx = await setup();
  op = await operatorAdmin(ctx);
  G = (await registerOrg(ctx, "manager", { approveWith: op })).browser;
  H = (await registerOrg(ctx, "manager", { approveWith: op })).browser;
  await seedContract(G, SUP);
  await seedContract(H, SUP);
  await publishEvent(op, SUP);
  full = (
    await G.post("/app/api-keys", {
      name: "integração",
      scopes: ["portfolio:read", "portfolio:write", "alerts:read", "alerts:write"],
    })
  ).json().key;
  readOnly = (await G.post("/app/api-keys", { name: "somente leitura", scopes: ["alerts:read"] })).json().key;
});
afterAll(async () => ctx.close());

describe("API B2B /api/v1", () => {
  it("chave é exibida uma única vez e só o prefixo aparece na listagem", async () => {
    expect(full).toMatch(/^rdf_[0-9A-Za-z]{8}_[0-9A-Za-z]{32}$/);
    const list = (await G.get("/app/api-keys")).json();
    expect(JSON.stringify(list)).not.toContain(full.split("_")[2]);
    expect(list[0]).toHaveProperty("prefix");
  });

  it("401 sem chave, com chave malformada e com cookie de sessão", async () => {
    expect((await api(ctx, "GET", "/api/v1/alerts")).statusCode).toBe(401);
    expect((await api(ctx, "GET", "/api/v1/alerts", "rdf_xxx")).statusCode).toBe(401);
    const withCookie = await ctx.app.inject({ method: "GET", url: "/api/v1/alerts", headers: { cookie: G.cookie } });
    expect(withCookie.statusCode).toBe(401);
    expect(withCookie.json().error.code).toBe("unauthenticated");
  });

  it("chave de API não autentica o portal", async () => {
    const r = await ctx.app.inject({ method: "GET", url: "/app/me", headers: { authorization: `Bearer ${full}` } });
    expect(r.statusCode).toBe(401);
  });

  it("403 com escopo insuficiente", async () => {
    expect((await api(ctx, "GET", "/api/v1/alerts", readOnly)).statusCode).toBe(200);
    const r = await api(ctx, "GET", "/api/v1/contracts", readOnly);
    expect(r.statusCode).toBe(403);
    expect(r.json().error.message).toMatch(/portfolio:read/);
    expect(
      (await api(ctx, "PATCH", "/api/v1/alerts/00000000-0000-4000-8000-000000000000", readOnly, { status: "resolved" }))
        .statusCode,
    ).toBe(403);
  });

  it("devolve só dados da própria carteira, no formato do contrato", async () => {
    const r = await api(ctx, "GET", "/api/v1/alerts", full);
    expect(r.statusCode).toBe(200);
    const body = r.json();
    expect(body.data).toHaveLength(1);
    expect(body.next_cursor).toBeNull();
    expect(body.data[0]).toMatchObject({
      severity: "critical",
      status: "open",
      contract: { volume_mwm: 2, supplier: { cnpj: SUP } },
    });
    const hAlert = (await H.get("/app/alerts")).json().data[0];
    expect((await api(ctx, "GET", `/api/v1/alerts/${hAlert.id}`, full)).statusCode).toBe(404);
    const me = (await api(ctx, "GET", "/api/v1/me", full)).json();
    expect(me.via).toBe("api_key");
    expect(me.user).toBeNull();
  });

  it("422 para corpo inválido, com caminho do campo", async () => {
    const r = await api(ctx, "POST", "/api/v1/contracts", full, { site_id: "x" });
    expect(r.statusCode).toBe(422);
    expect(r.json().error.code).toBe("validation_failed");
    expect(Array.isArray(r.json().error.details)).toBe(true);
  });

  it("fluxo de escrita: cliente → unidade → contrato com Idempotency-Key, reconhece alerta", async () => {
    const c = await api(ctx, "POST", "/api/v1/clients", full, { legal_name: "Cliente API", cnpj: cnpj() });
    expect(c.statusCode).toBe(201);
    const s = await api(ctx, "POST", "/api/v1/sites", full, {
      client_id: c.json().id,
      name: "Unidade API",
      submarket: "SE_CO",
    });
    expect(s.statusCode).toBe(201);
    const body = {
      site_id: s.json().id,
      supplier_cnpj: SUP,
      start_date: "2026-03-01",
      end_date: "2027-02-28",
      volume_mwm: 0.75,
      price_brl_per_mwh: 199.9,
    };
    const k1 = await api(ctx, "POST", "/api/v1/contracts", full, body, { "idempotency-key": "cria-contrato-0001" });
    const k2 = await api(ctx, "POST", "/api/v1/contracts", full, body, { "idempotency-key": "cria-contrato-0001" });
    expect(k1.statusCode).toBe(201);
    expect(k2.statusCode).toBe(201);
    expect(k2.headers["idempotent-replayed"]).toBe("true");
    expect(k2.json().id).toBe(k1.json().id);
    const k3 = await api(
      ctx,
      "POST",
      "/api/v1/contracts",
      full,
      { ...body, volume_mwm: 1 },
      { "idempotency-key": "cria-contrato-0001" },
    );
    expect(k3.statusCode).toBe(409);
    const contracts = (await api(ctx, "GET", "/api/v1/contracts?limit=100", full)).json().data;
    expect(contracts.filter((x: { id: string }) => x.id === k1.json().id)).toHaveLength(1);
    // o contrato novo recebeu alerta do evento já publicado
    const alerts = (await api(ctx, "GET", `/api/v1/alerts?supplier_cnpj=${SUP}`, full)).json().data;
    expect(alerts).toHaveLength(2);
    const ack = await api(ctx, "PATCH", `/api/v1/alerts/${alerts[0].id}`, full, { status: "acknowledged" });
    expect(ack.statusCode).toBe(200);
    expect(ack.json().status).toBe("acknowledged");
    const expl = await api(ctx, "GET", `/api/v1/contracts/${k1.json().id}/explanation`, full);
    expect(expl.json().evaluated_events[0].match).toBe(true);
  });

  it("chave revogada passa a 401", async () => {
    const created = (await G.post("/app/api-keys", { name: "temporária", scopes: ["alerts:read"] })).json();
    expect((await api(ctx, "GET", "/api/v1/alerts", created.key)).statusCode).toBe(200);
    expect((await G.del(`/app/api-keys/${created.id}`)).statusCode).toBe(204);
    expect((await api(ctx, "GET", "/api/v1/alerts", created.key)).statusCode).toBe(401);
  });

  it("só o titular gerencia chaves; organização fornecedora não usa a API de carteira", async () => {
    const inv = (await G.post("/app/invitations", { email: `m${Date.now()}@exemplo.invalid`, role: "member" })).json();
    const { Browser } = await import("./helpers.js");
    const m = new Browser(ctx.app);
    await m.post("/app/invitations/accept", { token: inv.token, name: "Membro", password: "senha-forte-123" });
    expect((await m.post("/app/api-keys", { name: "chave do membro", scopes: ["alerts:read"] })).statusCode).toBe(403);
  });

  it("OpenAPI versionado está sincronizado com os schemas e /api/docs responde", async () => {
    const committed = fs.readFileSync("openapi/openapi.yaml", "utf8");
    expect(committed).toBe(await generateOpenApiYaml());
    expect(committed).toContain("openapi: 3.1.0");
    expect(committed).not.toContain("/app/");
    expect((await ctx.app.inject({ method: "GET", url: "/api/docs/json" })).statusCode).toBe(200);
  });

  it("/health informa estado do banco", async () => {
    const r = await ctx.app.inject({ method: "GET", url: "/health" });
    expect(r.json()).toMatchObject({ status: "ok", db: "ok" });
  });
});

describe("limite de taxa da API", () => {
  it("429 com Retry-After acima do limite, contado por chave", async () => {
    const c = await setup({ apiPerMinute: 3, loginPerMinute: 100 });
    try {
      const o = await operatorAdmin(c);
      const g = (await registerOrg(c, "manager", { approveWith: o })).browser;
      const key = (await g.post("/app/api-keys", { name: "rl", scopes: ["alerts:read"] })).json().key;
      const codes = [];
      for (let i = 0; i < 4; i++) codes.push((await api(c, "GET", "/api/v1/alerts", key)).statusCode);
      expect(codes).toEqual([200, 200, 200, 429]);
      const r = await api(c, "GET", "/api/v1/alerts", key);
      expect(r.headers["retry-after"]).toBeDefined();
      expect(r.json().error.code).toBe("rate_limited");
    } finally {
      await c.close();
    }
  });
});
