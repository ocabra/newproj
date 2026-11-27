/** Rótulos pt-BR. Espelham src/server/domain/rules.ts e csv.ts (o front não importa código do servidor). */
import type {
  AlertStatus,
  EventStatus,
  EventType,
  GuaranteeType,
  OrgStatus,
  OrgType,
  Role,
  RuleCheck,
  Scope,
  Severity,
  Submarket,
} from "./api";

export const EVENT_TYPES: EventType[] = [
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
];

export const EVENT_TYPE_LABEL: Record<EventType, string> = {
  judicial_recovery_filed: "Pedido de recuperação judicial",
  bankruptcy_filed: "Pedido de falência",
  ccee_disconnection: "Desligamento da CCEE",
  retailer_disqualification: "Inabilitação como varejista",
  mcp_default_listed: "Listado como inadimplente no MCP",
  extrajudicial_recovery: "Recuperação extrajudicial",
  balanced_operation: "Operação balanceada determinada",
  leverage_band_worsened: "Piora de faixa do Fator de Alavancagem",
  protest_relevant: "Protesto relevante",
  leverage_band_improved: "Melhora de faixa do Fator de Alavancagem",
  governance_change: "Mudança societária/governança",
  other_public_notice: "Outro comunicado público",
};

export const SEVERITY_BY_EVENT_TYPE: Record<EventType, Severity> = {
  judicial_recovery_filed: "critical",
  bankruptcy_filed: "critical",
  ccee_disconnection: "critical",
  retailer_disqualification: "critical",
  mcp_default_listed: "critical",
  extrajudicial_recovery: "high",
  balanced_operation: "high",
  leverage_band_worsened: "high",
  protest_relevant: "high",
  leverage_band_improved: "info",
  governance_change: "info",
  other_public_notice: "info",
};

export const SEVERITIES: Severity[] = ["critical", "high", "info"];
export const SEVERITY_LABEL: Record<Severity, string> = { critical: "Crítica", high: "Alta", info: "Informativa" };

export const ALERT_STATUSES: AlertStatus[] = ["open", "acknowledged", "resolved", "retracted"];
export const ALERT_STATUS_LABEL: Record<AlertStatus, string> = {
  open: "Aberto",
  acknowledged: "Reconhecido",
  resolved: "Resolvido",
  retracted: "Retirado",
};

export const EVENT_STATUS_LABEL: Record<EventStatus, string> = {
  draft: "Rascunho",
  published: "Publicado",
  retracted: "Retirado",
};

export const SCOPE_LABEL = { entity: "Somente este CNPJ", group: "Grupo econômico (mesma raiz de CNPJ)" } as const;

export const ORG_TYPE_LABEL: Record<OrgType, string> = {
  manager: "Gestora de energia",
  consumer: "Consumidor",
  supplier: "Fornecedor (comercializadora)",
  operator: "Operação da plataforma",
};

export const ORG_STATUS_LABEL: Record<OrgStatus, string> = {
  pending: "Aguardando aprovação",
  approved: "Aprovada",
  rejected: "Rejeitada",
  suspended: "Suspensa",
};

export const ROLE_LABEL: Record<Role, string> = {
  owner: "Titular",
  member: "Membro",
  admin: "Administrador",
  curator: "Curador",
};

export const SUBMARKETS: Submarket[] = ["SE_CO", "S", "NE", "N"];
export const SUBMARKET_LABEL: Record<Submarket, string> = {
  SE_CO: "Sudeste/Centro-Oeste (SE/CO)",
  S: "Sul (S)",
  NE: "Nordeste (NE)",
  N: "Norte (N)",
};

export const GUARANTEE_TYPES: GuaranteeType[] = ["none", "bank_guarantee", "insurance", "deposit", "other"];
export const GUARANTEE_LABEL: Record<GuaranteeType, string> = {
  none: "Sem garantia",
  bank_guarantee: "Fiança bancária",
  insurance: "Seguro garantia",
  deposit: "Depósito/caução",
  other: "Outra",
};

export const SCOPES: Scope[] = ["portfolio:read", "portfolio:write", "alerts:read", "alerts:write"];
export const SCOPE_DESC: Record<Scope, string> = {
  "portfolio:read": "Ler clientes, unidades e contratos",
  "portfolio:write": "Criar e alterar contratos",
  "alerts:read": "Ler alertas e exposição",
  "alerts:write": "Mudar status de alertas",
};

/** Razões registradas pelo motor rules@1 em linguagem clara. */
export const REASON_LABEL: Record<string, string> = {
  event_published: "O evento foi publicado pela curadoria, com fonte.",
  supplier_match_exact: "O CNPJ do fornecedor do contrato é o mesmo CNPJ do evento.",
  supplier_match_group_root:
    "O fornecedor do contrato tem a mesma raiz de CNPJ (8 dígitos) do fornecedor do evento, e o evento vale para o grupo econômico.",
  contract_active_record: "O contrato está ativo na carteira e a organização está aprovada.",
  contract_period_overlaps_or_future: "O contrato está vigente na data do evento ou começa depois dela.",
  no_reference_price: "Não há preço de referência para o submercado da unidade; a exposição não foi calculada.",
};
export const reasonLabel = (r: string): string => REASON_LABEL[r] ?? r;

export const RULE_TITLE: Record<RuleCheck["rule"], string> = {
  C1: "O evento está publicado?",
  C2: "É o mesmo fornecedor (CNPJ ou grupo econômico)?",
  C3: "O contrato está ativo e a organização aprovada?",
  C4: "O contrato está vigente na data do evento ou começa depois?",
};

/** Ressalva padrão exibida em todo alerta (alerta ≠ inadimplência confirmada). */
export const ALERT_DISCLAIMER =
  "Um alerta indica que um fato público, curado e com fonte, foi registrado sobre o fornecedor deste contrato. " +
  "Alerta não é inadimplência confirmada, não é juízo sobre a saúde financeira do fornecedor e não substitui a diligência jurídica.";
