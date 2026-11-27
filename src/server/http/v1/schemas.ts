/**
 * CONTRATO da API B2B /api/v1 (ADR-0003). Escrito antes dos handlers.
 * openapi/openapi.yaml é gerado a partir daqui (`npm run openapi`).
 * Unidades sempre no nome do campo: *_mwm (MW médio), *_brl_per_mwh, *_brl, *_mwh, *_pct.
 */
import { z } from "zod";

export const API_DESCRIPTION = [
  "API B2B do protótipo **Radar de Fornecedores** (GO CONDICIONAL; dados sintéticos).",
  "",
  "Mostra eventos públicos de crédito de fornecedores de energia, curados com fonte, cruzados com os contratos da",
  "carteira da organização autenticada. **Não** é nota de crédito, não prevê falência, não tem relação oficial com",
  "CCEE, ANEEL ou Abraceel, e não negocia nem representa ninguém.",
  "",
  "Autenticação: `Authorization: Bearer rdf_<prefixo>_<segredo>` (chave gerada no portal, exibida uma única vez).",
  "Escopos: `portfolio:read`, `portfolio:write`, `alerts:read`, `alerts:write`.",
  "Paginação por cursor: `limit` (1–100) e `cursor` (opaco, devolvido em `next_cursor`).",
  "Idempotência: `POST /contracts` aceita o cabeçalho `Idempotency-Key`.",
  "Limite de taxa: 120 requisições/min por chave (`429` com `Retry-After`).",
].join("\n");

const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "AAAA-MM-DD");
const uuid = z.string().uuid();
const cnpj = z.string().regex(/^\d{14}$/, "14 dígitos, sem pontuação");
const timestamp = z.string().describe("ISO 8601 em UTC");

export const ErrorBody = z
  .object({
    error: z.object({ code: z.string(), message: z.string(), details: z.unknown().optional() }),
  })
  .meta({ id: "Error" });

export const errorResponses = {
  401: ErrorBody.describe("Credencial ausente ou inválida"),
  403: ErrorBody.describe("Sem escopo/permissão, ou organização não aprovada"),
  404: ErrorBody.describe("Não encontrado (inclui recursos de outra organização)"),
  409: ErrorBody.describe("Conflito"),
  422: ErrorBody.describe("Validação falhou"),
  429: ErrorBody.describe("Limite de taxa excedido"),
};

export const PageQuery = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(50),
  cursor: z.string().max(200).optional(),
});

export const page = <T extends z.ZodTypeAny>(item: T) =>
  z.object({ data: z.array(item), next_cursor: z.string().nullable() });

export const Submarket = z.enum(["SE_CO", "S", "NE", "N"]).describe("Submercado: SE_CO, S, NE ou N");
export const GuaranteeType = z.enum(["none", "bank_guarantee", "insurance", "deposit", "other"]);
export const SeverityE = z.enum(["critical", "high", "info"]);
export const AlertStatus = z.enum(["open", "acknowledged", "resolved", "retracted"]);
export const EventTypeE = z.enum([
  "judicial_recovery_filed",
  "bankruptcy_filed",
  "ccee_disconnection",
  "retailer_disqualification",
  "mcp_default_listed",
  "extrajudicial_recovery",
  "balanced_operation",
  "leverage_band_worsened",
  "protest_relevant",
  "leverage_band_improved",
  "governance_change",
  "other_public_notice",
]);

export const Me = z
  .object({
    user: z.object({ id: uuid, name: z.string(), email: z.string() }).nullable(),
    role: z.string().nullable(),
    via: z.enum(["session", "api_key"]),
    scopes: z.array(z.string()).nullable(),
    organization: z.object({
      id: uuid,
      name: z.string(),
      type: z.enum(["manager", "consumer", "supplier", "operator"]),
      status: z.enum(["pending", "approved", "rejected", "suspended"]),
      cnpj: z.string().nullable(),
    }),
  })
  .meta({ id: "Me" });

export const Supplier = z.object({ id: uuid, cnpj, legal_name: z.string() }).meta({ id: "Supplier" });

export const Client = z
  .object({ id: uuid, legal_name: z.string(), cnpj, created_at: timestamp })
  .meta({ id: "Client" });
export const ClientCreate = z.object({
  legal_name: z.string().min(2).max(200),
  cnpj: z.string().min(14).max(18).describe("Aceita com ou sem pontuação; validado por dígito verificador"),
});

export const Site = z
  .object({
    id: uuid,
    client_id: uuid,
    name: z.string(),
    submarket: Submarket,
    distributor: z.string().nullable(),
    created_at: timestamp,
  })
  .meta({ id: "Site" });
export const SiteCreate = z.object({
  client_id: uuid,
  name: z.string().min(1).max(200),
  submarket: Submarket,
  distributor: z.string().max(200).optional(),
});

const contractFields = {
  start_date: date,
  end_date: date.describe("Inclusivo"),
  volume_mwm: z.number().positive().max(1000).describe("Volume contratado em MW médio (MWm), não MWh"),
  price_brl_per_mwh: z.number().min(0).max(5000),
  guarantee_brl: z.number().min(0).nullable().optional(),
  guarantee_type: GuaranteeType.optional(),
  notes: z.string().max(2000).nullable().optional(),
};

export const Contract = z
  .object({
    id: uuid,
    site_id: uuid,
    client_id: uuid,
    supplier: Supplier,
    start_date: date,
    end_date: date,
    volume_mwm: z.number(),
    price_brl_per_mwh: z.number(),
    guarantee_brl: z.number().nullable(),
    guarantee_type: GuaranteeType,
    notes: z.string().nullable(),
    created_at: timestamp,
    updated_at: timestamp,
    warnings: z.array(z.string()).describe("Avisos não bloqueantes, ex.: possível duplicidade"),
  })
  .meta({ id: "Contract" });

export const ContractCreate = z
  .object({
    site_id: uuid,
    supplier_cnpj: z.string().min(14).max(18),
    supplier_name: z
      .string()
      .min(2)
      .max(200)
      .optional()
      .describe("Obrigatório se o fornecedor não estiver no catálogo"),
    ...contractFields,
    confirm_overlap: z
      .boolean()
      .optional()
      .describe("Confirma a criação mesmo havendo contrato sobreposto na mesma unidade e fornecedor"),
  })
  .meta({ id: "ContractCreate" });

export const ContractPatch = z
  .object({
    start_date: date.optional(),
    end_date: date.optional(),
    volume_mwm: contractFields.volume_mwm.optional(),
    price_brl_per_mwh: contractFields.price_brl_per_mwh.optional(),
    guarantee_brl: contractFields.guarantee_brl,
    guarantee_type: contractFields.guarantee_type,
    notes: contractFields.notes,
  })
  .meta({ id: "ContractPatch" });

export const ContractListQuery = PageQuery.extend({
  client_id: uuid.optional(),
  supplier_cnpj: cnpj.optional(),
});

export const RuleCheck = z.object({
  rule: z.enum(["C1", "C2", "C3", "C4"]),
  passed: z.boolean(),
  reason: z.string(),
  detail: z.string(),
});

export const Explanation = z
  .object({
    contract_id: uuid,
    rule_version: z.string(),
    summary: z.string(),
    evaluated_events: z.array(
      z.object({
        event_id: uuid,
        event_type: EventTypeE,
        event_date: date,
        supplier_cnpj: cnpj,
        match: z.boolean(),
        severity: SeverityE,
        checks: z.array(RuleCheck),
      }),
    ),
  })
  .meta({ id: "Explanation" });

export const Exposure = z
  .object({
    as_of: date,
    remaining_hours: z.number(),
    remaining_energy_mwh: z.number(),
    reference_price_brl_per_mwh: z.number(),
    reference_price_date: date,
    reference_price_source: z.string(),
    reference_price_url: z.string(),
    contract_price_brl_per_mwh: z.number(),
    replacement_cost_brl: z.number(),
    guarantee_brl: z.number().nullable(),
    guarantee_coverage_pct: z.number().nullable(),
    formula: z.string(),
  })
  .meta({ id: "Exposure" });

export const PublicEvent = z
  .object({
    id: uuid,
    type: EventTypeE,
    type_label: z.string(),
    severity: SeverityE,
    scope: z.enum(["entity", "group"]),
    event_date: date,
    source_published_on: date,
    source_name: z.string(),
    source_url: z.string(),
    summary: z.string(),
    caveat: z.string().nullable(),
    status: z.enum(["draft", "published", "retracted"]),
    supplier: z.object({ cnpj, legal_name: z.string() }),
    supplier_responses: z.array(z.object({ body: z.string(), created_at: timestamp })),
  })
  .meta({ id: "Event" });

export const Alert = z
  .object({
    id: uuid,
    severity: SeverityE,
    status: AlertStatus,
    rule_version: z.string(),
    reasons: z.array(z.string()),
    created_at: timestamp,
    status_changed_at: timestamp.nullable(),
    contract: z.object({
      id: uuid,
      client_id: uuid,
      client_legal_name: z.string(),
      site_name: z.string(),
      start_date: date,
      end_date: date,
      volume_mwm: z.number(),
      supplier: z.object({ cnpj, legal_name: z.string() }).describe("Fornecedor do contrato da carteira"),
    }),
    event: PublicEvent.describe(
      "Evento público; o fornecedor do evento pode ser a matriz/grupo do fornecedor do contrato",
    ),
    exposure: Exposure.nullable(),
    exposure_reason: z.string().nullable(),
  })
  .meta({ id: "Alert" });

export const AlertListQuery = PageQuery.extend({
  status: AlertStatus.optional(),
  severity: SeverityE.optional(),
  supplier_cnpj: cnpj.optional().describe("CNPJ do fornecedor do contrato"),
  client_id: uuid.optional(),
});

export const AlertPatch = z.object({ status: z.enum(["open", "acknowledged", "resolved"]) }).meta({ id: "AlertPatch" });

export const IdParam = z.object({ id: uuid });
