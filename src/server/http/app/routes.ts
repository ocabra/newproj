/**
 * API interna do portal (/app/*): sessão por cookie + CSRF. Não aparece no OpenAPI público (schema.hide).
 * Reaproveita os mesmos serviços de domínio da API B2B, com autorização por papel em vez de escopo.
 */
import { desc, eq } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { auditEvents, imports } from "../../db/schema.js";
import { createApiKey, listApiKeys, revokeApiKey } from "../../services/apikeys.js";
import {
  acceptInvitation,
  createInvitation,
  createSession,
  listInvitations,
  listOrganizations,
  login,
  logout,
  me,
  register,
  SESSION_TTL_MS,
  setOrganizationStatus,
} from "../../services/identity.js";
import {
  createClient,
  createContract,
  createSite,
  deleteClient,
  deleteContract,
  getContract,
  importContractsCsv,
  listClients,
  listContracts,
  listSites,
  MANDATE_TEXT,
  MANDATE_TEXT_VERSION,
  updateContract,
} from "../../services/portfolio.js";
import { authorize, PORTFOLIO_ORGS, SCOPES, type Principal } from "../../services/principal.js";
import {
  addReferencePrice,
  alertSummary,
  createEvent,
  explainContract,
  getAlert,
  importLeverageCsv,
  listAlerts,
  listEventsAboutMe,
  listEventsForOperator,
  listReferencePrices,
  listSuppliers,
  publishEvent,
  respondToEvent,
  retractEvent,
  setAlertStatus,
  supplierPublicEvents,
} from "../../services/radar.js";
import { checkCsrf, requireSession, SESSION_COOKIE } from "../auth.js";
import { notFound } from "../errors.js";
import * as S from "../v1/schemas.js";

const hide = { hide: true } as const;
const PORTFOLIO = { orgTypes: PORTFOLIO_ORGS };
const PORTFOLIO_WRITE = { orgTypes: PORTFOLIO_ORGS, roles: ["owner", "member"] as const };
const OPERATOR = { orgTypes: ["operator" as const], roles: ["admin", "curator"] as const };
const ADMIN = { orgTypes: ["operator" as const], roles: ["admin"] as const };
const SUPPLIER = { orgTypes: ["supplier" as const] };

const EventInput = z.object({
  supplier_cnpj: z.string().min(14).max(18),
  supplier_name: z.string().min(2).max(200).optional(),
  type: S.EventTypeE,
  scope: z.enum(["entity", "group"]).optional(),
  event_date: z.string(),
  source_published_on: z.string(),
  source_name: z.string().min(2).max(200),
  source_url: z.string().url().max(2000),
  summary: z.string().min(10).max(4000),
  caveat: z.string().max(2000).nullable().optional(),
});

export async function registerAppRoutes(
  root: FastifyInstance,
  limits: { apiPerMinute: number; loginPerMinute: number },
): Promise<void> {
  const app = root.withTypeProvider<ZodTypeProvider>();
  const db = app.db;
  const secure = app.config.NODE_ENV === "production";
  const setSession = (reply: { setCookie: (n: string, v: string, o: object) => unknown }, token: string) =>
    reply.setCookie(SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure,
      path: "/",
      maxAge: SESSION_TTL_MS / 1000,
    });
  const P = (req: { principal: Principal | null }) => req.principal!;

  // ---------------------------------------------------------------- público (sem sessão)
  app.register(async (inst) => {
    const pub = inst.withTypeProvider<ZodTypeProvider>();
    pub.addHook("preValidation", async (req) => checkCsrf(req));
    const loginLimit = { rateLimit: { max: limits.loginPerMinute, timeWindow: "1 minute" } };

    pub.post(
      "/auth/register",
      {
        config: loginLimit,
        schema: {
          ...hide,
          body: z.object({
            name: z.string().min(2).max(200),
            email: z.string().email().max(320),
            password: z.string().min(10).max(200),
            org: z.object({
              name: z.string().min(2).max(200),
              type: z.enum(["manager", "consumer", "supplier"]),
              cnpj: z.string().min(14).max(18),
            }),
          }),
        },
      },
      async (req, reply) => {
        const r = await register(db, req.body, req.ip);
        setSession(reply, await createSession(db, r.userId, r.orgId, req.ip));
        return reply.status(201).send({ ok: true, status: "pending" });
      },
    );

    pub.post(
      "/auth/login",
      {
        config: loginLimit,
        schema: { ...hide, body: z.object({ email: z.string().max(320), password: z.string().max(200) }) },
      },
      async (req, reply) => {
        setSession(reply, await login(db, req.body.email, req.body.password, req.ip));
        return { ok: true };
      },
    );

    pub.post(
      "/invitations/accept",
      {
        config: loginLimit,
        schema: {
          ...hide,
          body: z.object({ token: z.string().min(20).max(200), name: z.string().min(2), password: z.string().min(10) }),
        },
      },
      async (req, reply) => {
        const r = await acceptInvitation(db, req.body.token, req.body, req.ip);
        setSession(reply, await createSession(db, r.userId, r.orgId, req.ip));
        return reply.status(201).send({ ok: true });
      },
    );
  });

  // ---------------------------------------------------------------- autenticado
  app.register(async (inst) => {
    const s = inst.withTypeProvider<ZodTypeProvider>();
    s.addHook("preValidation", requireSession);

    s.post("/auth/logout", { schema: hide }, async (req, reply) => {
      const token = req.cookies[SESSION_COOKIE];
      if (token) await logout(db, token);
      reply.clearCookie(SESSION_COOKIE, { path: "/" });
      return { ok: true };
    });

    s.get("/me", { schema: hide }, async (req) => me(db, authorize(P(req), { allowUnapproved: true })));

    // convites
    s.get("/invitations", { schema: hide }, async (req) =>
      listInvitations(db, authorize(P(req), { roles: ["owner", "admin"] })),
    );
    s.post(
      "/invitations",
      {
        schema: {
          ...hide,
          body: z.object({ email: z.string().email(), role: z.enum(["owner", "member", "admin", "curator"]) }),
        },
      },
      async (req, reply) => {
        const p = authorize(P(req), { roles: ["owner", "admin"] });
        return reply.status(201).send(await createInvitation(db, p, req.body.email, req.body.role));
      },
    );

    // ---------------------------------------------------------------- carteira
    s.get("/clients", { schema: { ...hide, querystring: S.PageQuery } }, async (req) =>
      listClients(db, authorize(P(req), PORTFOLIO), req.query),
    );
    s.post("/clients", { schema: { ...hide, body: S.ClientCreate } }, async (req, reply) =>
      reply.status(201).send(await createClient(db, authorize(P(req), PORTFOLIO_WRITE), req.body)),
    );
    s.delete("/clients/:id", { schema: { ...hide, params: S.IdParam } }, async (req, reply) => {
      await deleteClient(db, authorize(P(req), PORTFOLIO_WRITE), req.params.id);
      return reply.status(204).send();
    });
    s.get(
      "/sites",
      { schema: { ...hide, querystring: S.PageQuery.extend({ client_id: z.string().uuid().optional() }) } },
      async (req) => listSites(db, authorize(P(req), PORTFOLIO), req.query),
    );
    s.post("/sites", { schema: { ...hide, body: S.SiteCreate } }, async (req, reply) =>
      reply.status(201).send(await createSite(db, authorize(P(req), PORTFOLIO_WRITE), req.body)),
    );
    s.get("/contracts", { schema: { ...hide, querystring: S.ContractListQuery } }, async (req) =>
      listContracts(db, authorize(P(req), PORTFOLIO), req.query),
    );
    s.post("/contracts", { schema: { ...hide, body: S.ContractCreate } }, async (req, reply) =>
      reply.status(201).send(await createContract(db, authorize(P(req), PORTFOLIO_WRITE), req.body)),
    );
    s.get("/contracts/:id", { schema: { ...hide, params: S.IdParam } }, async (req) =>
      getContract(db, authorize(P(req), PORTFOLIO), req.params.id),
    );
    s.patch("/contracts/:id", { schema: { ...hide, params: S.IdParam, body: S.ContractPatch } }, async (req) =>
      updateContract(db, authorize(P(req), PORTFOLIO_WRITE), req.params.id, req.body),
    );
    s.delete("/contracts/:id", { schema: { ...hide, params: S.IdParam } }, async (req, reply) => {
      await deleteContract(db, authorize(P(req), PORTFOLIO_WRITE), req.params.id);
      return reply.status(204).send();
    });
    s.get("/contracts/:id/explanation", { schema: { ...hide, params: S.IdParam } }, async (req) =>
      explainContract(db, authorize(P(req), PORTFOLIO), req.params.id),
    );
    s.get("/mandate", { schema: hide }, async () => ({ text_version: MANDATE_TEXT_VERSION, text: MANDATE_TEXT }));
    s.post(
      "/imports/contracts",
      {
        schema: {
          ...hide,
          querystring: z.object({
            filename: z.string().max(200).default("contratos.csv"),
            mandate: z.enum(["accepted"]).optional(),
          }),
        },
      },
      async (req) => {
        const p = authorize(P(req), PORTFOLIO_WRITE);
        const text = typeof req.body === "string" ? req.body : "";
        return importContractsCsv(db, p, req.query.filename, text, req.query.mandate === "accepted");
      },
    );
    s.get("/imports", { schema: hide }, async (req) => {
      const p = authorize(P(req), { orgTypes: [...PORTFOLIO_ORGS, "operator"] });
      return db.select().from(imports).where(eq(imports.orgId, p.orgId)).orderBy(desc(imports.createdAt)).limit(50);
    });

    // ---------------------------------------------------------------- alertas
    s.get("/alerts", { schema: { ...hide, querystring: S.AlertListQuery } }, async (req) =>
      listAlerts(db, authorize(P(req), PORTFOLIO), req.query),
    );
    s.get("/alerts/summary", { schema: hide }, async (req) => alertSummary(db, authorize(P(req), PORTFOLIO)));
    s.get("/alerts/:id", { schema: { ...hide, params: S.IdParam } }, async (req) =>
      getAlert(db, authorize(P(req), PORTFOLIO), req.params.id),
    );
    s.patch("/alerts/:id", { schema: { ...hide, params: S.IdParam, body: S.AlertPatch } }, async (req) =>
      setAlertStatus(db, authorize(P(req), PORTFOLIO_WRITE), req.params.id, req.body.status),
    );
    s.get("/suppliers/:id/events", { schema: { ...hide, params: S.IdParam } }, async (req) => {
      authorize(P(req), PORTFOLIO);
      return supplierPublicEvents(db, req.params.id);
    });

    // ---------------------------------------------------------------- chaves de API
    s.get("/api-keys", { schema: hide }, async (req) =>
      listApiKeys(db, authorize(P(req), { ...PORTFOLIO, roles: ["owner"] })),
    );
    s.post(
      "/api-keys",
      {
        schema: {
          ...hide,
          body: z.object({
            name: z.string().min(2).max(100),
            scopes: z.array(z.enum(SCOPES as [string, ...string[]])).min(1),
            expires_in_days: z.number().int().min(1).max(730).optional(),
          }),
        },
      },
      async (req, reply) => {
        const p = authorize(P(req), { ...PORTFOLIO, roles: ["owner"] });
        return reply.status(201).send(await createApiKey(db, p, req.body as Parameters<typeof createApiKey>[2]));
      },
    );
    s.delete("/api-keys/:id", { schema: { ...hide, params: S.IdParam } }, async (req, reply) => {
      await revokeApiKey(db, authorize(P(req), { ...PORTFOLIO, roles: ["owner"] }), req.params.id);
      return reply.status(204).send();
    });

    // ---------------------------------------------------------------- fornecedor (direito de resposta)
    s.get("/supplier/events", { schema: hide }, async (req) => listEventsAboutMe(db, authorize(P(req), SUPPLIER)));
    s.post(
      "/supplier/events/:id/responses",
      { schema: { ...hide, params: S.IdParam, body: z.object({ body: z.string().min(10).max(4000) }) } },
      async (req, reply) =>
        reply.status(201).send(await respondToEvent(db, authorize(P(req), SUPPLIER), req.params.id, req.body.body)),
    );

    // ---------------------------------------------------------------- operação
    s.get(
      "/admin/organizations",
      {
        schema: {
          ...hide,
          querystring: z.object({ status: z.enum(["pending", "approved", "rejected", "suspended"]).optional() }),
        },
      },
      async (req) => {
        authorize(P(req), ADMIN);
        return listOrganizations(db, req.query.status);
      },
    );
    s.post(
      "/admin/organizations/:id/status",
      {
        schema: {
          ...hide,
          params: S.IdParam,
          body: z.object({ status: z.enum(["approved", "rejected", "suspended"]) }),
        },
      },
      async (req) => setOrganizationStatus(db, authorize(P(req), ADMIN), req.params.id, req.body.status),
    );
    s.get("/admin/suppliers", { schema: hide }, async (req) => {
      authorize(P(req), OPERATOR);
      return listSuppliers(db);
    });
    s.get(
      "/admin/events",
      {
        schema: { ...hide, querystring: z.object({ status: z.enum(["draft", "published", "retracted"]).optional() }) },
      },
      async (req) => {
        authorize(P(req), OPERATOR);
        return listEventsForOperator(db, req.query.status);
      },
    );
    s.post("/admin/events", { schema: { ...hide, body: EventInput } }, async (req, reply) =>
      reply.status(201).send(await createEvent(db, authorize(P(req), OPERATOR), req.body)),
    );
    s.post("/admin/events/:id/publish", { schema: { ...hide, params: S.IdParam } }, async (req) =>
      publishEvent(db, authorize(P(req), OPERATOR), req.params.id),
    );
    s.post(
      "/admin/events/:id/retract",
      { schema: { ...hide, params: S.IdParam, body: z.object({ reason: z.string().min(5).max(2000) }) } },
      async (req) => retractEvent(db, authorize(P(req), OPERATOR), req.params.id, req.body.reason),
    );
    s.get("/admin/reference-prices", { schema: hide }, async (req) => {
      authorize(P(req), OPERATOR);
      return listReferencePrices(db);
    });
    s.post(
      "/admin/reference-prices",
      {
        schema: {
          ...hide,
          body: z.object({
            submarket: S.Submarket,
            reference_date: z.string(),
            price_brl_per_mwh: z.number().positive().max(5000),
            source_name: z.string().min(2).max(200),
            source_url: z.string().url(),
          }),
        },
      },
      async (req, reply) => reply.status(201).send(await addReferencePrice(db, authorize(P(req), OPERATOR), req.body)),
    );
    s.post(
      "/admin/imports/leverage",
      { schema: { ...hide, querystring: z.object({ filename: z.string().max(200).default("fa.csv") }) } },
      async (req) => {
        const p = authorize(P(req), OPERATOR);
        return importLeverageCsv(db, p, req.query.filename, typeof req.body === "string" ? req.body : "");
      },
    );
    s.get(
      "/admin/audit",
      { schema: { ...hide, querystring: z.object({ limit: z.coerce.number().int().min(1).max(500).default(100) }) } },
      async (req) => {
        authorize(P(req), ADMIN);
        return db.select().from(auditEvents).orderBy(desc(auditEvents.at)).limit(req.query.limit);
      },
    );
  });

  app.setNotFoundHandler(() => {
    throw notFound("Rota");
  });
}
