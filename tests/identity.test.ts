import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { Browser, cnpj, operatorAdmin, registerOrg, setup, type Ctx } from "./helpers.js";

let ctx: Ctx;
beforeAll(async () => {
  ctx = await setup();
});
afterAll(async () => ctx.close());

describe("identidade B2B", () => {
  it("organização recém-registrada fica pendente e não acessa a carteira até aprovação", async () => {
    const op = await operatorAdmin(ctx);
    const { browser, orgId } = await registerOrg(ctx, "manager");
    const me = await browser.get("/app/me");
    expect(me.statusCode).toBe(200);
    expect(me.json().organization.status).toBe("pending");
    const blocked = await browser.get("/app/clients");
    expect(blocked.statusCode).toBe(403);
    expect(blocked.json().error.code).toBe("org_not_approved");
    await op.post(`/app/admin/organizations/${orgId}/status`, { status: "approved" });
    expect((await browser.get("/app/clients")).statusCode).toBe(200);
  });

  it("login com senha errada é 401 com mensagem genérica; sem sessão é 401", async () => {
    const b = new Browser(ctx.app);
    const r = await b.post("/app/auth/login", { email: "ninguem@exemplo.invalid", password: "x".repeat(12) });
    expect(r.statusCode).toBe(401);
    expect(r.json().error.message).toBe("E-mail ou senha incorretos.");
    expect((await new Browser(ctx.app).get("/app/me")).statusCode).toBe(401);
  });

  it("rejeita senha curta e CNPJ inválido com 422", async () => {
    const b = new Browser(ctx.app);
    const base = {
      name: "X Y",
      email: "a@exemplo.invalid",
      org: { name: "Org", type: "manager", cnpj: "11222333000181" },
    };
    expect((await b.post("/app/auth/register", { ...base, password: "curta" })).statusCode).toBe(422);
    const r = await b.post("/app/auth/register", {
      ...base,
      password: "senha-forte-123",
      org: { ...base.org, cnpj: "11222333000182" },
    });
    expect(r.statusCode).toBe(422);
  });

  it("e-mail duplicado é 409", async () => {
    const b = new Browser(ctx.app);
    const body = {
      name: "X Y",
      email: "dup@exemplo.invalid",
      password: "senha-forte-123",
      org: { name: "Org", type: "manager", cnpj: "11222333000181" },
    };
    expect((await b.post("/app/auth/register", body)).statusCode).toBe(201);
    expect((await new Browser(ctx.app).post("/app/auth/register", body)).statusCode).toBe(409);
  });

  it("CSRF: requisição que altera estado sem o cabeçalho é 403; origem estranha é 403", async () => {
    const op = await operatorAdmin(ctx);
    const { browser } = await registerOrg(ctx, "manager", { approveWith: op });
    const noHeader = await ctx.app.inject({
      method: "POST",
      url: "/app/clients",
      headers: { cookie: browser.cookie },
      payload: { legal_name: "X", cnpj: "11222333000181" },
    });
    expect(noHeader.statusCode).toBe(403);
    expect(noHeader.json().error.code).toBe("csrf_failed");
    const evil = await browser.req(
      "POST",
      "/app/clients",
      { legal_name: "X", cnpj: "11222333000181" },
      { origin: "https://malicioso.invalid" },
    );
    expect(evil.statusCode).toBe(403);
  });

  it("cookie de sessão é HttpOnly e SameSite=Lax; logout revoga a sessão", async () => {
    const op = await operatorAdmin(ctx);
    const { browser } = await registerOrg(ctx, "manager", { approveWith: op });
    const login = await ctx.app.inject({
      method: "POST",
      url: "/app/auth/login",
      headers: { "x-requested-with": "radar" },
      payload: { email: "nao@exemplo.invalid", password: "senha-forte-123" },
    });
    expect(login.statusCode).toBe(401);
    const cookieHeader = (await operatorAdmin(ctx)).cookie;
    expect(cookieHeader).toMatch(/^radar_session=/);
    const reg = await ctx.app.inject({
      method: "POST",
      url: "/app/auth/register",
      headers: { "x-requested-with": "radar" },
      payload: {
        name: "A B",
        email: "cookie@exemplo.invalid",
        password: "senha-forte-123",
        org: { name: "Org Cookie", type: "manager", cnpj: cnpj() },
      },
    });
    expect(reg.statusCode, reg.body).toBe(201);
    expect(String(reg.headers["set-cookie"])).toMatch(/HttpOnly/i);
    expect(String(reg.headers["set-cookie"])).toMatch(/SameSite=Lax/i);
    expect((await browser.post("/app/auth/logout")).statusCode).toBe(200);
    expect((await browser.get("/app/me")).statusCode).toBe(401);
  });

  it("convite: titular convida membro, membro entra na mesma organização; membro não convida", async () => {
    const op = await operatorAdmin(ctx);
    const { browser, orgId } = await registerOrg(ctx, "manager", { approveWith: op });
    const inv = await browser.post("/app/invitations", { email: "membro@exemplo.invalid", role: "member" });
    expect(inv.statusCode).toBe(201);
    const member = new Browser(ctx.app);
    const acc = await member.post("/app/invitations/accept", {
      token: inv.json().token,
      name: "Membro",
      password: "senha-forte-123",
    });
    expect(acc.statusCode).toBe(201);
    const me = await member.get("/app/me");
    expect(me.json().organization.id).toBe(orgId);
    expect(me.json().role).toBe("member");
    expect((await member.post("/app/invitations", { email: "x@exemplo.invalid", role: "member" })).statusCode).toBe(
      403,
    );
    // token de uso único
    expect(
      (
        await new Browser(ctx.app).post("/app/invitations/accept", {
          token: inv.json().token,
          name: "Outro",
          password: "senha-forte-123",
        })
      ).statusCode,
    ).toBe(404);
  });

  it("gestora não acessa rotas de operação; curador não aprova organizações", async () => {
    const op = await operatorAdmin(ctx);
    const { browser } = await registerOrg(ctx, "manager", { approveWith: op });
    expect((await browser.get("/app/admin/organizations")).statusCode).toBe(403);
    const curator = await operatorAdmin(ctx, "curator");
    expect((await curator.get("/app/admin/organizations")).statusCode).toBe(403);
    expect((await curator.get("/app/admin/events")).statusCode).toBe(200);
  });

  it("suspender organização revoga suas sessões", async () => {
    const op = await operatorAdmin(ctx);
    const { browser, orgId } = await registerOrg(ctx, "manager", { approveWith: op });
    await op.post(`/app/admin/organizations/${orgId}/status`, { status: "suspended" });
    expect((await browser.get("/app/me")).statusCode).toBe(401);
  });
});

describe("limite de taxa do login", () => {
  it("retorna 429 acima do limite", async () => {
    const limited = await setup({ apiPerMinute: 1000, loginPerMinute: 3 });
    try {
      const b = new Browser(limited.app);
      const codes: number[] = [];
      for (let i = 0; i < 5; i++)
        codes.push((await b.post("/app/auth/login", { email: "a@b.invalid", password: "x".repeat(12) })).statusCode);
      expect(codes.slice(0, 3)).toEqual([401, 401, 401]);
      expect(codes[3]).toBe(429);
    } finally {
      await limited.close();
    }
  });
});
