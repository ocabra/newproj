import { sql } from "drizzle-orm";
import {
  bigserial,
  check,
  date,
  index,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

const id = () => uuid("id").primaryKey().defaultRandom();
// Precisão de milissegundos: igual ao Date do JS, para cursores de paginação exatos.
const createdAt = () => timestamp("created_at", { withTimezone: true, precision: 3 }).notNull().defaultNow();
const tsz = (name: string) => timestamp(name, { withTimezone: true, precision: 3 });

export const orgType = pgEnum("org_type", ["manager", "consumer", "supplier", "operator"]);
export const orgStatus = pgEnum("org_status", ["pending", "approved", "rejected", "suspended"]);
export const memberRole = pgEnum("member_role", ["owner", "member", "admin", "curator"]);
export const submarket = pgEnum("submarket", ["SE_CO", "S", "NE", "N"]);
export const guaranteeType = pgEnum("guarantee_type", ["none", "bank_guarantee", "insurance", "deposit", "other"]);
export const eventType = pgEnum("event_type", [
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
export const eventScope = pgEnum("event_scope", ["entity", "group"]);
export const eventStatus = pgEnum("event_status", ["draft", "published", "retracted"]);
export const severity = pgEnum("severity", ["critical", "high", "info"]);
export const alertStatus = pgEnum("alert_status", ["open", "acknowledged", "resolved", "retracted"]);
export const importKind = pgEnum("import_kind", ["contracts", "leverage"]);

export const suppliers = pgTable("suppliers", {
  id: id(),
  cnpj: text("cnpj").notNull().unique(),
  legalName: text("legal_name").notNull(),
  createdAt: createdAt(),
});

export const organizations = pgTable("organizations", {
  id: id(),
  name: text("name").notNull(),
  type: orgType("type").notNull(),
  cnpj: text("cnpj"),
  status: orgStatus("status").notNull().default("pending"),
  // Para organizações do tipo `supplier`: vínculo com o fornecedor do catálogo, definido pelo admin na aprovação.
  supplierId: uuid("supplier_id").references(() => suppliers.id),
  approvedAt: tsz("approved_at"),
  approvedBy: uuid("approved_by"),
  createdAt: createdAt(),
});

export const users = pgTable("users", {
  id: id(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull(),
  createdAt: createdAt(),
});

// MVP: cada usuário pertence a exatamente uma organização (unique em user_id).
export const memberships = pgTable(
  "memberships",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    orgId: uuid("org_id")
      .notNull()
      .references(() => organizations.id),
    role: memberRole("role").notNull(),
    createdAt: createdAt(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.orgId] }), uniqueIndex("memberships_user_unique").on(t.userId)],
);

export const sessions = pgTable("sessions", {
  id: id(),
  tokenHash: text("token_hash").notNull().unique(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  orgId: uuid("org_id")
    .notNull()
    .references(() => organizations.id),
  expiresAt: tsz("expires_at").notNull(),
  revokedAt: tsz("revoked_at"),
  ip: text("ip"),
  createdAt: createdAt(),
});

export const invitations = pgTable("invitations", {
  id: id(),
  orgId: uuid("org_id")
    .notNull()
    .references(() => organizations.id),
  email: text("email").notNull(),
  role: memberRole("role").notNull(),
  tokenHash: text("token_hash").notNull().unique(),
  expiresAt: tsz("expires_at").notNull(),
  acceptedAt: tsz("accepted_at"),
  createdBy: uuid("created_by").notNull(),
  createdAt: createdAt(),
});

export const dataMandates = pgTable("data_mandates", {
  id: id(),
  orgId: uuid("org_id")
    .notNull()
    .references(() => organizations.id),
  userId: uuid("user_id").notNull(),
  textVersion: text("text_version").notNull(),
  context: text("context").notNull(),
  declaredAt: createdAt(),
});

export const clients = pgTable(
  "clients",
  {
    id: id(),
    orgId: uuid("org_id")
      .notNull()
      .references(() => organizations.id),
    legalName: text("legal_name").notNull(),
    cnpj: text("cnpj").notNull(),
    createdAt: createdAt(),
    deletedAt: tsz("deleted_at"),
  },
  (t) => [
    uniqueIndex("clients_org_cnpj_active")
      .on(t.orgId, t.cnpj)
      .where(sql`deleted_at is null`),
    index("clients_org").on(t.orgId),
  ],
);

export const sites = pgTable(
  "sites",
  {
    id: id(),
    orgId: uuid("org_id")
      .notNull()
      .references(() => organizations.id),
    clientId: uuid("client_id")
      .notNull()
      .references(() => clients.id),
    name: text("name").notNull(),
    submarket: submarket("submarket").notNull(),
    distributor: text("distributor"),
    createdAt: createdAt(),
    deletedAt: tsz("deleted_at"),
  },
  (t) => [index("sites_org").on(t.orgId)],
);

export const contracts = pgTable(
  "contracts",
  {
    id: id(),
    orgId: uuid("org_id")
      .notNull()
      .references(() => organizations.id),
    siteId: uuid("site_id")
      .notNull()
      .references(() => sites.id),
    supplierId: uuid("supplier_id")
      .notNull()
      .references(() => suppliers.id),
    startDate: date("start_date").notNull(),
    endDate: date("end_date").notNull(),
    volumeMwm: numeric("volume_mwm", { precision: 10, scale: 4, mode: "number" }).notNull(),
    priceBrlPerMwh: numeric("price_brl_per_mwh", { precision: 10, scale: 2, mode: "number" }).notNull(),
    guaranteeBrl: numeric("guarantee_brl", { precision: 14, scale: 2, mode: "number" }),
    guaranteeType: guaranteeType("guarantee_type").notNull().default("none"),
    notes: text("notes"),
    createdAt: createdAt(),
    updatedAt: timestamp("updated_at", { withTimezone: true, precision: 3 }).notNull().defaultNow(),
    deletedAt: tsz("deleted_at"),
  },
  (t) => [
    check("contracts_period", sql`${t.endDate} >= ${t.startDate}`),
    check("contracts_volume", sql`${t.volumeMwm} > 0 and ${t.volumeMwm} <= 1000`),
    check("contracts_price", sql`${t.priceBrlPerMwh} >= 0 and ${t.priceBrlPerMwh} <= 5000`),
    check("contracts_guarantee", sql`${t.guaranteeBrl} is null or ${t.guaranteeBrl} >= 0`),
    index("contracts_org").on(t.orgId),
    index("contracts_supplier").on(t.supplierId),
  ],
);

export const events = pgTable(
  "events",
  {
    id: id(),
    supplierId: uuid("supplier_id")
      .notNull()
      .references(() => suppliers.id),
    type: eventType("type").notNull(),
    scope: eventScope("scope").notNull().default("entity"),
    eventDate: date("event_date").notNull(),
    sourcePublishedOn: date("source_published_on").notNull(),
    sourceUrl: text("source_url").notNull(),
    sourceName: text("source_name").notNull(),
    summary: text("summary").notNull(),
    caveat: text("caveat"),
    status: eventStatus("status").notNull().default("draft"),
    createdBy: uuid("created_by").notNull(),
    publishedAt: tsz("published_at"),
    publishedBy: uuid("published_by"),
    retractedAt: tsz("retracted_at"),
    retractedBy: uuid("retracted_by"),
    retractionReason: text("retraction_reason"),
    createdAt: createdAt(),
  },
  (t) => [index("events_supplier").on(t.supplierId)],
);

export const supplierResponses = pgTable("supplier_responses", {
  id: id(),
  eventId: uuid("event_id")
    .notNull()
    .references(() => events.id),
  supplierOrgId: uuid("supplier_org_id")
    .notNull()
    .references(() => organizations.id),
  authorUserId: uuid("author_user_id").notNull(),
  body: text("body").notNull(),
  createdAt: createdAt(),
});

export const alerts = pgTable(
  "alerts",
  {
    id: id(),
    orgId: uuid("org_id")
      .notNull()
      .references(() => organizations.id),
    contractId: uuid("contract_id")
      .notNull()
      .references(() => contracts.id),
    eventId: uuid("event_id")
      .notNull()
      .references(() => events.id),
    ruleVersion: text("rule_version").notNull(),
    severity: severity("severity").notNull(),
    status: alertStatus("status").notNull().default("open"),
    reasons: jsonb("reasons").$type<string[]>().notNull(),
    snapshot: jsonb("snapshot").$type<Record<string, unknown>>().notNull(),
    exposure: jsonb("exposure").$type<object | null>(),
    statusChangedAt: tsz("status_changed_at"),
    statusChangedBy: uuid("status_changed_by"),
    createdAt: createdAt(),
  },
  (t) => [uniqueIndex("alerts_contract_event").on(t.contractId, t.eventId), index("alerts_org").on(t.orgId)],
);

export const referencePrices = pgTable(
  "reference_prices",
  {
    id: id(),
    submarket: submarket("submarket").notNull(),
    referenceDate: date("reference_date").notNull(),
    priceBrlPerMwh: numeric("price_brl_per_mwh", { precision: 10, scale: 2, mode: "number" }).notNull(),
    sourceName: text("source_name").notNull(),
    sourceUrl: text("source_url").notNull(),
    createdBy: uuid("created_by").notNull(),
    createdAt: createdAt(),
  },
  (t) => [check("reference_prices_price", sql`${t.priceBrlPerMwh} > 0 and ${t.priceBrlPerMwh} <= 5000`)],
);

export const leverageObservations = pgTable(
  "leverage_observations",
  {
    id: id(),
    supplierId: uuid("supplier_id")
      .notNull()
      .references(() => suppliers.id),
    weekStart: date("week_start").notNull(),
    // Faixa ordinal informada no CSV: maior = pior. Semântica oficial das faixas da CCEE NÃO VERIFICADA (anexo H5).
    bandRank: integer("band_rank").notNull(),
    value: numeric("value", { precision: 12, scale: 4, mode: "number" }),
    sourceName: text("source_name").notNull(),
    sourceUrl: text("source_url").notNull(),
    importId: uuid("import_id"),
    createdAt: createdAt(),
  },
  (t) => [uniqueIndex("leverage_supplier_week").on(t.supplierId, t.weekStart)],
);

export const imports = pgTable("imports", {
  id: id(),
  orgId: uuid("org_id")
    .notNull()
    .references(() => organizations.id),
  kind: importKind("kind").notNull(),
  filename: text("filename").notNull(),
  rowsTotal: integer("rows_total").notNull(),
  rowsOk: integer("rows_ok").notNull(),
  rowsRejected: integer("rows_rejected").notNull(),
  errors: jsonb("errors").$type<{ line: number; field?: string; message: string }[]>().notNull(),
  createdBy: uuid("created_by").notNull(),
  createdAt: createdAt(),
});

export const apiKeys = pgTable("api_keys", {
  id: id(),
  orgId: uuid("org_id")
    .notNull()
    .references(() => organizations.id),
  name: text("name").notNull(),
  prefix: text("prefix").notNull().unique(),
  secretHash: text("secret_hash").notNull(),
  scopes: text("scopes").array().notNull(),
  createdBy: uuid("created_by").notNull(),
  expiresAt: tsz("expires_at"),
  revokedAt: tsz("revoked_at"),
  lastUsedAt: tsz("last_used_at"),
  createdAt: createdAt(),
});

export const auditEvents = pgTable(
  "audit_events",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    at: createdAt(),
    orgId: uuid("org_id"),
    actorUserId: uuid("actor_user_id"),
    actorApiKeyId: uuid("actor_api_key_id"),
    action: text("action").notNull(),
    targetType: text("target_type"),
    targetId: text("target_id"),
    meta: jsonb("meta").$type<Record<string, unknown>>(),
    ip: text("ip"),
  },
  (t) => [index("audit_org_at").on(t.orgId, t.at)],
);

/** Idempotência de POSTs críticos da API B2B (chave por organização; expira em 24 h). */
export const idempotencyKeys = pgTable(
  "idempotency_keys",
  {
    orgId: uuid("org_id")
      .notNull()
      .references(() => organizations.id),
    key: text("key").notNull(),
    requestHash: text("request_hash").notNull(),
    responseStatus: integer("response_status").notNull(),
    responseBody: jsonb("response_body").notNull(),
    createdAt: createdAt(),
  },
  (t) => [primaryKey({ columns: [t.orgId, t.key] })],
);
