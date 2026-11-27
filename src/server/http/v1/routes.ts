import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { me } from "../../services/identity.js";
import { withIdempotency } from "../../services/idempotency.js";
import {
  createClient,
  createContract,
  createSite,
  deleteContract,
  getContract,
  listClients,
  listContracts,
  listSites,
  updateContract,
} from "../../services/portfolio.js";
import { authorize, PORTFOLIO_ORGS, type Scope } from "../../services/principal.js";
import { explainContract, getAlert, listAlerts, setAlertStatus } from "../../services/radar.js";
import { lookupSupplier } from "../../services/suppliers.js";
import { apiRateKey, requireApiKey } from "../auth.js";
import * as S from "./schemas.js";

const auth = (scope: Scope) => ({ orgTypes: PORTFOLIO_ORGS, scope });

export async function registerV1Routes(
  root: FastifyInstance,
  limits: { apiPerMinute: number; loginPerMinute: number },
): Promise<void> {
  const app = root.withTypeProvider<ZodTypeProvider>();
  // Limite por chave de API (prefixo), declarado em cada rota.
  const config = { rateLimit: { max: limits.apiPerMinute, timeWindow: "1 minute", keyGenerator: apiRateKey } };
  app.addHook("preValidation", requireApiKey);
  const db = app.db;

  app.get(
    "/me",
    {
      config,
      schema: { tags: ["conta"], summary: "Identidade da chave", response: { 200: S.Me, ...S.errorResponses } },
    },
    async (req) => me(db, req.principal!),
  );

  app.get(
    "/suppliers/:cnpj",
    {
      config,
      schema: {
        tags: ["carteira"],
        summary: "Consulta fornecedor no catálogo por CNPJ",
        params: z.object({ cnpj: z.string().regex(/^\d{14}$/) }),
        response: { 200: S.Supplier, ...S.errorResponses },
      },
    },
    async (req) => {
      authorize(req.principal!, auth("portfolio:read"));
      return lookupSupplier(db, req.params.cnpj);
    },
  );

  app.get(
    "/clients",
    {
      config,
      schema: {
        tags: ["carteira"],
        summary: "Lista clientes da carteira",
        querystring: S.PageQuery,
        response: { 200: S.page(S.Client), ...S.errorResponses },
      },
    },
    async (req) => listClients(db, authorize(req.principal!, auth("portfolio:read")), req.query),
  );

  app.post(
    "/clients",
    {
      config,
      schema: {
        tags: ["carteira"],
        summary: "Cria cliente",
        body: S.ClientCreate,
        response: { 201: S.Client, ...S.errorResponses },
      },
    },
    async (req, reply) => {
      const p = authorize(req.principal!, auth("portfolio:write"));
      return reply.status(201).send(await createClient(db, p, req.body));
    },
  );

  app.get(
    "/sites",
    {
      config,
      schema: {
        tags: ["carteira"],
        summary: "Lista unidades",
        querystring: S.PageQuery.extend({ client_id: z.string().uuid().optional() }),
        response: { 200: S.page(S.Site), ...S.errorResponses },
      },
    },
    async (req) => listSites(db, authorize(req.principal!, auth("portfolio:read")), req.query),
  );

  app.post(
    "/sites",
    {
      config,
      schema: {
        tags: ["carteira"],
        summary: "Cria unidade",
        body: S.SiteCreate,
        response: { 201: S.Site, ...S.errorResponses },
      },
    },
    async (req, reply) => {
      const p = authorize(req.principal!, auth("portfolio:write"));
      return reply.status(201).send(await createSite(db, p, req.body));
    },
  );

  app.get(
    "/contracts",
    {
      config,
      schema: {
        tags: ["carteira"],
        summary: "Lista contratos",
        querystring: S.ContractListQuery,
        response: { 200: S.page(S.Contract), ...S.errorResponses },
      },
    },
    async (req) => listContracts(db, authorize(req.principal!, auth("portfolio:read")), req.query),
  );

  app.post(
    "/contracts",
    {
      config,
      schema: {
        tags: ["carteira"],
        summary: "Cria contrato (idempotente com Idempotency-Key)",
        headers: z.object({ "idempotency-key": z.string().optional() }).passthrough(),
        body: S.ContractCreate,
        response: { 201: S.Contract, ...S.errorResponses },
      },
    },
    async (req, reply) => {
      const p = authorize(req.principal!, auth("portfolio:write"));
      const key = req.headers["idempotency-key"] as string | undefined;
      const res = await withIdempotency(db, p.orgId, key, req.body, async () => ({
        status: 201,
        body: await createContract(db, p, req.body),
      }));
      if (res.replayed) reply.header("idempotent-replayed", "true");
      return reply.status(res.status).send(res.body);
    },
  );

  app.get(
    "/contracts/:id",
    {
      config,
      schema: {
        tags: ["carteira"],
        summary: "Detalhe do contrato",
        params: S.IdParam,
        response: { 200: S.Contract, ...S.errorResponses },
      },
    },
    async (req) => getContract(db, authorize(req.principal!, auth("portfolio:read")), req.params.id),
  );

  app.patch(
    "/contracts/:id",
    {
      config,
      schema: {
        tags: ["carteira"],
        summary: "Altera contrato",
        params: S.IdParam,
        body: S.ContractPatch,
        response: { 200: S.Contract, ...S.errorResponses },
      },
    },
    async (req) => updateContract(db, authorize(req.principal!, auth("portfolio:write")), req.params.id, req.body),
  );

  app.delete(
    "/contracts/:id",
    {
      config,
      schema: {
        tags: ["carteira"],
        summary: "Exclui contrato (lógica; deixa de gerar e exibir alertas)",
        params: S.IdParam,
        response: { 204: z.null().describe("Excluído"), ...S.errorResponses },
      },
    },
    async (req, reply) => {
      await deleteContract(db, authorize(req.principal!, auth("portfolio:write")), req.params.id);
      return reply.status(204).send(null);
    },
  );

  app.get(
    "/contracts/:id/explanation",
    {
      config,
      schema: {
        tags: ["alertas"],
        summary: "Por que este contrato tem (ou não tem) alerta",
        params: S.IdParam,
        response: { 200: S.Explanation, ...S.errorResponses },
      },
    },
    async (req) => explainContract(db, authorize(req.principal!, auth("alerts:read")), req.params.id),
  );

  app.get(
    "/alerts",
    {
      config,
      schema: {
        tags: ["alertas"],
        summary: "Lista alertas da carteira (mais recentes primeiro)",
        querystring: S.AlertListQuery,
        response: { 200: S.page(S.Alert), ...S.errorResponses },
      },
    },
    async (req) => listAlerts(db, authorize(req.principal!, auth("alerts:read")), req.query),
  );

  app.get(
    "/alerts/:id",
    {
      config,
      schema: {
        tags: ["alertas"],
        summary: "Detalhe do alerta, com fonte, razões, exposição e resposta do fornecedor",
        params: S.IdParam,
        response: { 200: S.Alert, ...S.errorResponses },
      },
    },
    async (req) => getAlert(db, authorize(req.principal!, auth("alerts:read")), req.params.id),
  );

  app.patch(
    "/alerts/:id",
    {
      config,
      schema: {
        tags: ["alertas"],
        summary: "Muda o status do alerta",
        params: S.IdParam,
        body: S.AlertPatch,
        response: { 200: S.Alert, ...S.errorResponses },
      },
    },
    async (req) => setAlertStatus(db, authorize(req.principal!, auth("alerts:write")), req.params.id, req.body.status),
  );
}
