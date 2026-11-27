/**
 * Cliente da API interna do portal (/app/*) e tipos que espelham os DTOs do backend
 * (src/server/http/v1/schemas.ts, services/radar.ts, services/portfolio.ts, services/identity.ts).
 * Sessão por cookie HttpOnly; todo pedido leva o cabeçalho CSRF `x-requested-with: radar`.
 */

// ------------------------------------------------------------------ tipos de domínio

export type OrgType = "manager" | "consumer" | "supplier" | "operator";
export type OrgStatus = "pending" | "approved" | "rejected" | "suspended";
export type Role = "owner" | "member" | "admin" | "curator";
export type Submarket = "SE_CO" | "S" | "NE" | "N";
export type GuaranteeType = "none" | "bank_guarantee" | "insurance" | "deposit" | "other";
export type Severity = "critical" | "high" | "info";
export type AlertStatus = "open" | "acknowledged" | "resolved" | "retracted";
export type EventStatus = "draft" | "published" | "retracted";
export type EventScope = "entity" | "group";
export type Scope = "portfolio:read" | "portfolio:write" | "alerts:read" | "alerts:write";
export type EventType =
  | "judicial_recovery_filed"
  | "bankruptcy_filed"
  | "ccee_disconnection"
  | "retailer_disqualification"
  | "mcp_default_listed"
  | "extrajudicial_recovery"
  | "balanced_operation"
  | "leverage_band_worsened"
  | "protest_relevant"
  | "leverage_band_improved"
  | "governance_change"
  | "other_public_notice";

export interface Page<T> {
  data: T[];
  next_cursor: string | null;
}

export interface Me {
  user: { id: string; name: string; email: string } | null;
  role: Role | null;
  via: "session" | "api_key";
  scopes: string[] | null;
  organization: { id: string; name: string; type: OrgType; status: OrgStatus; cnpj: string | null };
}

export interface Client {
  id: string;
  legal_name: string;
  cnpj: string;
  created_at: string;
}

export interface Site {
  id: string;
  client_id: string;
  name: string;
  submarket: Submarket;
  distributor: string | null;
  created_at: string;
}

export interface Contract {
  id: string;
  site_id: string;
  client_id: string;
  supplier: { id: string; cnpj: string; legal_name: string };
  start_date: string;
  end_date: string;
  volume_mwm: number;
  price_brl_per_mwh: number;
  guarantee_brl: number | null;
  guarantee_type: GuaranteeType;
  notes: string | null;
  created_at: string;
  updated_at: string;
  warnings: string[];
}

export interface ContractCreate {
  site_id: string;
  supplier_cnpj: string;
  supplier_name?: string;
  start_date: string;
  end_date: string;
  volume_mwm: number;
  price_brl_per_mwh: number;
  guarantee_brl?: number | null;
  guarantee_type?: GuaranteeType;
  notes?: string | null;
  confirm_overlap?: boolean;
}

export type ContractPatch = Partial<
  Pick<
    ContractCreate,
    "start_date" | "end_date" | "volume_mwm" | "price_brl_per_mwh" | "guarantee_brl" | "guarantee_type" | "notes"
  >
>;

export interface RuleCheck {
  rule: "C1" | "C2" | "C3" | "C4";
  passed: boolean;
  reason: string;
  detail: string;
}

export interface Explanation {
  contract_id: string;
  rule_version: string;
  summary: string;
  evaluated_events: {
    event_id: string;
    event_type: EventType;
    event_date: string;
    supplier_cnpj: string;
    match: boolean;
    severity: Severity;
    checks: RuleCheck[];
  }[];
}

export interface Exposure {
  as_of: string;
  remaining_hours: number;
  remaining_energy_mwh: number;
  reference_price_brl_per_mwh: number;
  reference_price_date: string;
  reference_price_source: string;
  reference_price_url: string;
  contract_price_brl_per_mwh: number;
  replacement_cost_brl: number;
  guarantee_brl: number | null;
  guarantee_coverage_pct: number | null;
  formula: string;
}

export interface SupplierResponse {
  body: string;
  created_at: string;
}

export interface PublicEvent {
  id: string;
  type: EventType;
  type_label: string;
  severity: Severity;
  scope: EventScope;
  event_date: string;
  source_published_on: string;
  source_name: string;
  source_url: string;
  summary: string;
  caveat: string | null;
  status: EventStatus;
  supplier: { cnpj: string; legal_name: string };
  supplier_responses: SupplierResponse[];
  retracted_at: string | null;
  retraction_reason: string | null;
}

export interface OperatorEvent extends PublicEvent {
  alerts_count: number;
}

export interface Alert {
  id: string;
  severity: Severity;
  status: AlertStatus;
  rule_version: string;
  reasons: string[];
  created_at: string;
  status_changed_at: string | null;
  contract: {
    id: string;
    client_id: string;
    client_legal_name: string;
    site_name: string;
    start_date: string;
    end_date: string;
    volume_mwm: number;
    /** Fornecedor do contrato (pode diferir do fornecedor do evento quando o evento vale para o grupo). */
    supplier?: { cnpj: string; legal_name: string };
  };
  event: PublicEvent;
  exposure: Exposure | null;
  exposure_reason: string | null;
}

export interface AlertSummaryRow {
  severity: Severity;
  status: AlertStatus;
  n: number;
}

export interface RowError {
  line: number;
  field?: string;
  message: string;
}

export interface ImportResult {
  import_id: string;
  accepted: boolean;
  rows_ok: number;
  errors: RowError[];
}

export interface LeverageImportResult extends ImportResult {
  drafts_created: number;
}

/** Linha crua da tabela `imports` (a rota devolve camelCase). */
export interface ImportRecord {
  id: string;
  kind: "contracts" | "leverage";
  filename: string;
  rowsTotal: number;
  rowsOk: number;
  rowsRejected: number;
  errors: RowError[];
  createdAt: string;
}

export interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  scopes: Scope[];
  created_at: string;
  expires_at: string | null;
  revoked_at: string | null;
  last_used_at: string | null;
}

export interface Invitation {
  id: string;
  email: string;
  role: Role;
  expiresAt: string;
  acceptedAt?: string | null;
  token?: string;
}

/** Linha crua de `organizations` (camelCase). */
export interface Organization {
  id: string;
  name: string;
  type: OrgType;
  cnpj: string | null;
  status: OrgStatus;
  supplierId: string | null;
  approvedAt: string | null;
  createdAt: string;
}

export interface SupplierRow {
  id: string;
  cnpj: string;
  legalName: string;
}

/** Linha crua de `reference_prices` (camelCase). */
export interface ReferencePrice {
  id: string;
  submarket: Submarket;
  referenceDate: string;
  priceBrlPerMwh: number;
  sourceName: string;
  sourceUrl: string;
  createdAt: string;
}

/** Linha crua de `audit_events` (camelCase). */
export interface AuditEvent {
  id: number;
  at: string;
  orgId: string | null;
  actorUserId: string | null;
  actorApiKeyId: string | null;
  action: string;
  targetType: string | null;
  targetId: string | null;
  meta: Record<string, unknown> | null;
  ip: string | null;
}

export interface EventCreate {
  supplier_cnpj: string;
  supplier_name?: string;
  type: EventType;
  scope: EventScope;
  event_date: string;
  source_published_on: string;
  source_name: string;
  source_url: string;
  summary: string;
  caveat?: string | null;
}

// ------------------------------------------------------------------ erros

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly details?: unknown,
  ) {
    super(message);
  }
}

/**
 * Normaliza `details` de erro para um mapa campo → mensagem.
 * O backend usa dois formatos: Zod (`[{path:"/org/cnpj", message}]`) e domínio (`{field:"cnpj"}`).
 */
export function fieldErrors(err: unknown): Record<string, string> {
  if (!(err instanceof ApiError) || err.status !== 422) return {};
  const out: Record<string, string> = {};
  const d = err.details;
  if (Array.isArray(d)) {
    for (const item of d as { path?: string; message?: string }[]) {
      const key = (item.path ?? "").replace(/^\//, "").replace(/\//g, ".") || "_";
      out[key] = item.message ?? "Valor inválido.";
    }
  } else if (d && typeof d === "object" && "field" in d) {
    const field = String((d as { field: unknown }).field);
    out[field] = err.message;
  }
  return out;
}

export function errorMessage(err: unknown): string {
  if (err instanceof ApiError) return err.message;
  if (err instanceof Error) return `Falha de comunicação com o servidor: ${err.message}`;
  return "Erro inesperado.";
}

// ------------------------------------------------------------------ cliente HTTP

type Handlers = { onUnauthenticated: () => void; onNotApproved: () => void };
let handlers: Handlers = { onUnauthenticated: () => {}, onNotApproved: () => {} };
export function setApiHandlers(h: Handlers): void {
  handlers = h;
}

interface RequestOptions {
  body?: unknown;
  csv?: string;
  query?: Record<string, string | number | undefined | null>;
  /** Não redireciona em 401 (ex.: tela de login, onde 401 = senha errada; carga inicial do /me). */
  silentAuth?: boolean;
}

function buildUrl(path: string, query?: RequestOptions["query"]): string {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(query ?? {})) {
    if (v !== undefined && v !== null && v !== "") qs.set(k, String(v));
  }
  const s = qs.toString();
  return `/app${path}${s ? `?${s}` : ""}`;
}

export async function request<T>(method: string, path: string, opts: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = { "x-requested-with": "radar", accept: "application/json" };
  let body: string | undefined;
  if (opts.csv !== undefined) {
    headers["content-type"] = "text/csv";
    body = opts.csv;
  } else if (opts.body !== undefined) {
    // Só envia content-type JSON quando há corpo: o Fastify rejeita JSON vazio.
    headers["content-type"] = "application/json";
    body = JSON.stringify(opts.body);
  }
  const res = await fetch(buildUrl(path, opts.query), { method, headers, body, credentials: "same-origin" });
  if (res.status === 204) return undefined as T;
  const text = await res.text();
  let json: unknown;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = null;
  }
  if (!res.ok) {
    const e = (json as { error?: { code?: string; message?: string; details?: unknown } } | null)?.error;
    const err = new ApiError(
      res.status,
      e?.code ?? "http_error",
      e?.message ?? `Erro ${res.status} do servidor.`,
      e?.details,
    );
    if (res.status === 401 && !opts.silentAuth) handlers.onUnauthenticated();
    if (res.status === 403 && err.code === "org_not_approved") handlers.onNotApproved();
    throw err;
  }
  return json as T;
}

const get = <T>(path: string, query?: RequestOptions["query"], silentAuth = false) =>
  request<T>("GET", path, { query, silentAuth });
const post = <T>(path: string, body?: unknown, query?: RequestOptions["query"]) =>
  request<T>("POST", path, { body, query });
const patch = <T>(path: string, body: unknown) => request<T>("PATCH", path, { body });
const del = (path: string) => request<void>("DELETE", path);

type PageQ = { cursor?: string | null; limit?: number };

/** Percorre todas as páginas (para montar mapas id → nome). Limitado para não travar a tela. */
export async function fetchAll<T>(fn: (cursor: string | null) => Promise<Page<T>>, maxPages = 20): Promise<T[]> {
  const out: T[] = [];
  let cursor: string | null = null;
  for (let i = 0; i < maxPages; i++) {
    const p: Page<T> = await fn(cursor);
    out.push(...p.data);
    if (!p.next_cursor) break;
    cursor = p.next_cursor;
  }
  return out;
}

export const api = {
  // identidade
  me: () => get<Me>("/me", undefined, true),
  login: (email: string, password: string) =>
    request<{ ok: true }>("POST", "/auth/login", { body: { email, password }, silentAuth: true }),
  register: (input: {
    name: string;
    email: string;
    password: string;
    org: { name: string; type: Exclude<OrgType, "operator">; cnpj: string };
  }) => request<{ ok: true; status: "pending" }>("POST", "/auth/register", { body: input, silentAuth: true }),
  acceptInvitation: (input: { token: string; name: string; password: string }) =>
    request<{ ok: true }>("POST", "/invitations/accept", { body: input, silentAuth: true }),
  logout: () => request<{ ok: true }>("POST", "/auth/logout", { silentAuth: true }),
  invitations: () => get<Invitation[]>("/invitations"),
  invite: (email: string, role: Role) => post<Invitation & { token: string }>("/invitations", { email, role }),

  // carteira
  clients: (q: PageQ = {}) => get<Page<Client>>("/clients", { limit: q.limit ?? 50, cursor: q.cursor }),
  createClient: (input: { legal_name: string; cnpj: string }) => post<Client>("/clients", input),
  deleteClient: (id: string) => del(`/clients/${id}`),
  sites: (q: PageQ & { client_id?: string } = {}) =>
    get<Page<Site>>("/sites", { limit: q.limit ?? 50, cursor: q.cursor, client_id: q.client_id }),
  createSite: (input: { client_id: string; name: string; submarket: Submarket; distributor?: string }) =>
    post<Site>("/sites", input),
  contracts: (q: PageQ & { client_id?: string; supplier_cnpj?: string } = {}) =>
    get<Page<Contract>>("/contracts", {
      limit: q.limit ?? 50,
      cursor: q.cursor,
      client_id: q.client_id,
      supplier_cnpj: q.supplier_cnpj,
    }),
  contract: (id: string) => get<Contract>(`/contracts/${id}`),
  createContract: (input: ContractCreate) => post<Contract>("/contracts", input),
  updateContract: (id: string, input: ContractPatch) => patch<Contract>(`/contracts/${id}`, input),
  deleteContract: (id: string) => del(`/contracts/${id}`),
  explanation: (id: string) => get<Explanation>(`/contracts/${id}/explanation`),
  mandate: () => get<{ text_version: string; text: string }>("/mandate"),
  importContracts: (filename: string, csv: string) =>
    request<ImportResult>("POST", "/imports/contracts", { csv, query: { filename, mandate: "accepted" } }),
  imports: () => get<ImportRecord[]>("/imports"),

  // alertas
  alerts: (q: PageQ & { status?: AlertStatus; severity?: Severity; client_id?: string; supplier_cnpj?: string }) =>
    get<Page<Alert>>("/alerts", {
      limit: q.limit ?? 25,
      cursor: q.cursor,
      status: q.status,
      severity: q.severity,
      client_id: q.client_id,
      supplier_cnpj: q.supplier_cnpj,
    }),
  alertSummary: () => get<AlertSummaryRow[]>("/alerts/summary"),
  alert: (id: string) => get<Alert>(`/alerts/${id}`),
  setAlertStatus: (id: string, status: Exclude<AlertStatus, "retracted">) => patch<Alert>(`/alerts/${id}`, { status }),

  // chaves de API
  apiKeys: () => get<ApiKey[]>("/api-keys"),
  createApiKey: (input: { name: string; scopes: Scope[]; expires_in_days?: number }) =>
    post<ApiKey & { key: string }>("/api-keys", input),
  revokeApiKey: (id: string) => del(`/api-keys/${id}`),

  // fornecedor
  supplierEvents: () => get<PublicEvent[]>("/supplier/events"),
  respond: (eventId: string, body: string) =>
    post<{ id: string; body: string; created_at: string }>(`/supplier/events/${eventId}/responses`, { body }),

  // operação
  organizations: (status?: OrgStatus) => get<Organization[]>("/admin/organizations", { status }),
  setOrgStatus: (id: string, status: Exclude<OrgStatus, "pending">) =>
    post<Organization>(`/admin/organizations/${id}/status`, { status }),
  suppliers: () => get<SupplierRow[]>("/admin/suppliers"),
  adminEvents: (status?: EventStatus) => get<OperatorEvent[]>("/admin/events", { status }),
  createEvent: (input: EventCreate) => post<PublicEvent>("/admin/events", input),
  publishEvent: (id: string) => post<{ evaluated: number; created: number }>(`/admin/events/${id}/publish`),
  retractEvent: (id: string, reason: string) =>
    post<{ alerts_retracted: number }>(`/admin/events/${id}/retract`, { reason }),
  referencePrices: () => get<ReferencePrice[]>("/admin/reference-prices"),
  addReferencePrice: (input: {
    submarket: Submarket;
    reference_date: string;
    price_brl_per_mwh: number;
    source_name: string;
    source_url: string;
  }) => post<ReferencePrice>("/admin/reference-prices", input),
  importLeverage: (filename: string, csv: string) =>
    request<LeverageImportResult>("POST", "/admin/imports/leverage", { csv, query: { filename } }),
  audit: (limit: number) => get<AuditEvent[]>("/admin/audit", { limit }),
};
