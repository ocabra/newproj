import type { FastifyInstance, LightMyRequestResponse } from "fastify";
import { eq, sql } from "drizzle-orm";
import { buildApp } from "../src/server/app.js";
import { loadConfig, loadDotEnv } from "../src/server/config.js";
import { createDb, type Db } from "../src/server/db/client.js";
import { memberships, organizations, users } from "../src/server/db/schema.js";
import { cnpjFromBase } from "../src/server/domain/cnpj.js";
import { hashPassword } from "../src/server/security/passwords.js";

loadDotEnv();

export interface Ctx {
  app: FastifyInstance;
  db: Db;
  close: () => Promise<void>;
}

export async function setup(rateLimits = { apiPerMinute: 1000, loginPerMinute: 1000 }): Promise<Ctx> {
  const url = process.env.TEST_DATABASE_URL!;
  const config = loadConfig({ ...process.env, DATABASE_URL: url, NODE_ENV: "test" });
  const { db, pool } = createDb(url);
  await db.execute(sql`
    truncate table idempotency_keys, audit_events, api_keys, imports, leverage_observations, reference_prices,
      supplier_responses, alerts, events, contracts, sites, clients, data_mandates, invitations, sessions,
      memberships, users, organizations, suppliers restart identity cascade`);
  const app = await buildApp({ db, config, rateLimits, logger: process.env.TEST_LOG === "1" });
  await app.ready();
  return {
    app,
    db,
    close: async () => {
      await app.close();
      await pool.end();
    },
  };
}

let seq = 0;
/** CNPJ válido e único por chamada (dados sintéticos). */
export function cnpj(): string {
  seq += 1;
  return cnpjFromBase(String(10_000_000 + seq).padStart(8, "0") + "0001");
}

/** Cliente HTTP de portal com cookie e cabeçalho CSRF. */
export class Browser {
  cookie = "";
  constructor(private app: FastifyInstance) {}
  async req(method: string, url: string, body?: unknown, extra: Record<string, string> = {}) {
    const isCsv = typeof body === "string";
    const res: LightMyRequestResponse = await this.app.inject({
      method: method as "GET",
      url,
      headers: {
        "x-requested-with": "radar",
        ...(this.cookie ? { cookie: this.cookie } : {}),
        ...(isCsv ? { "content-type": "text/csv" } : {}),
        ...extra,
      },
      ...(body === undefined ? {} : isCsv ? { payload: body } : { payload: body as object }),
    });
    const set = res.headers["set-cookie"];
    const first = Array.isArray(set) ? set[0] : set;
    if (first?.startsWith("radar_session=")) this.cookie = first.split(";")[0]!;
    return res;
  }
  get = (u: string) => this.req("GET", u);
  post = (u: string, b?: unknown) => this.req("POST", u, b ?? {});
  patch = (u: string, b: unknown) => this.req("PATCH", u, b);
  del = (u: string) => this.req("DELETE", u);
}

export async function operatorAdmin(ctx: Ctx, role: "admin" | "curator" = "admin"): Promise<Browser> {
  const email = `op-${role}-${++seq}@exemplo.invalid`;
  const [org] = await ctx.db
    .insert(organizations)
    .values({ name: "Operação", type: "operator", status: "approved" })
    .returning();
  const [u] = await ctx.db
    .insert(users)
    .values({ email, name: "Operador", passwordHash: await hashPassword("senha-forte-123") })
    .returning();
  await ctx.db.insert(memberships).values({ userId: u!.id, orgId: org!.id, role });
  const b = new Browser(ctx.app);
  const r = await b.post("/app/auth/login", { email, password: "senha-forte-123" });
  if (r.statusCode !== 200) throw new Error(`login operador falhou: ${r.body}`);
  return b;
}

export async function registerOrg(
  ctx: Ctx,
  type: "manager" | "consumer" | "supplier",
  opts: { approveWith?: Browser; cnpj?: string; name?: string } = {},
): Promise<{ browser: Browser; orgId: string; cnpj: string }> {
  const b = new Browser(ctx.app);
  const orgCnpj = opts.cnpj ?? cnpj();
  const email = `u${++seq}@exemplo.invalid`;
  const r = await b.post("/app/auth/register", {
    name: "Pessoa Teste",
    email,
    password: "senha-forte-123",
    org: { name: opts.name ?? `Org ${type} ${seq}`, type, cnpj: orgCnpj },
  });
  if (r.statusCode !== 201) throw new Error(`registro falhou: ${r.body}`);
  const [org] = await ctx.db.select().from(organizations).where(eq(organizations.cnpj, orgCnpj));
  if (opts.approveWith) {
    const a = await opts.approveWith.post(`/app/admin/organizations/${org!.id}/status`, { status: "approved" });
    if (a.statusCode !== 200) throw new Error(`aprovação falhou: ${a.body}`);
  }
  return { browser: b, orgId: org!.id, cnpj: orgCnpj };
}

/** Cria cliente + unidade + contrato numa carteira. */
export async function seedContract(
  b: Browser,
  supplierCnpj: string,
  over: Partial<{
    start_date: string;
    end_date: string;
    volume_mwm: number;
    price_brl_per_mwh: number;
    guarantee_brl: number;
    submarket: string;
  }> = {},
) {
  const c = await b.post("/app/clients", { legal_name: "Cliente Sintético", cnpj: cnpj() });
  if (c.statusCode !== 201) throw new Error(c.body);
  const s = await b.post("/app/sites", {
    client_id: c.json().id,
    name: "Planta",
    submarket: over.submarket ?? "SE_CO",
  });
  if (s.statusCode !== 201) throw new Error(s.body);
  const k = await b.post("/app/contracts", {
    site_id: s.json().id,
    supplier_cnpj: supplierCnpj,
    supplier_name: "Fornecedor Sintético",
    start_date: over.start_date ?? "2026-01-01",
    end_date: over.end_date ?? "2027-12-31",
    volume_mwm: over.volume_mwm ?? 2,
    price_brl_per_mwh: over.price_brl_per_mwh ?? 180,
    guarantee_brl: over.guarantee_brl,
  });
  if (k.statusCode !== 201) throw new Error(k.body);
  return { clientId: c.json().id as string, siteId: s.json().id as string, contractId: k.json().id as string };
}

export async function publishEvent(
  op: Browser,
  supplierCnpj: string,
  over: Partial<{ type: string; event_date: string; scope: string }> = {},
) {
  const e = await op.post("/app/admin/events", {
    supplier_cnpj: supplierCnpj,
    supplier_name: "Fornecedor Sintético",
    type: over.type ?? "judicial_recovery_filed",
    scope: over.scope ?? "entity",
    event_date: over.event_date ?? "2026-05-20",
    source_published_on: over.event_date ?? "2026-05-20",
    source_name: "Fonte sintética de teste",
    source_url: "https://exemplo.invalid/evento",
    summary: "Evento sintético usado em teste automatizado.",
  });
  if (e.statusCode !== 201) throw new Error(e.body);
  const p = await op.post(`/app/admin/events/${e.json().id}/publish`);
  if (p.statusCode !== 200) throw new Error(p.body);
  return { eventId: e.json().id as string, result: p.json() as { evaluated: number; created: number } };
}
