import { cnpjRoot } from "./cnpj.js";

export const RULE_VERSION = "rules@1";

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

export type Severity = "critical" | "high" | "info";

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

export const EVENT_TYPE_LABEL_PT: Record<EventType, string> = {
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

export interface RuleContract {
  id: string;
  supplierCnpj: string;
  startDate: string;
  endDate: string;
  deleted: boolean;
  orgApproved: boolean;
}

export interface RuleEvent {
  id: string;
  supplierCnpj: string;
  scope: "entity" | "group";
  type: EventType;
  eventDate: string;
  status: "draft" | "published" | "retracted";
}

export interface RuleCheck {
  rule: "C1" | "C2" | "C3" | "C4";
  passed: boolean;
  reason: string;
  detail: string;
}

export interface RuleResult {
  match: boolean;
  severity: Severity;
  reasons: string[];
  checks: RuleCheck[];
  ruleVersion: string;
}

/** Avalia de forma determinística se um evento gera alerta para um contrato. C5 (deduplicação) é garantida pelo banco. */
export function evaluate(contract: RuleContract, event: RuleEvent): RuleResult {
  const checks: RuleCheck[] = [];

  const published = event.status === "published";
  checks.push({
    rule: "C1",
    passed: published,
    reason: published ? "event_published" : "event_not_published",
    detail: published ? "Evento publicado pela curadoria." : `Evento com status "${event.status}".`,
  });

  const exact = contract.supplierCnpj === event.supplierCnpj;
  const group = event.scope === "group" && cnpjRoot(contract.supplierCnpj) === cnpjRoot(event.supplierCnpj);
  checks.push({
    rule: "C2",
    passed: exact || group,
    reason: exact ? "supplier_match_exact" : group ? "supplier_match_group_root" : "supplier_mismatch",
    detail: exact
      ? "CNPJ do fornecedor do contrato é o mesmo do evento."
      : group
        ? "Mesma raiz de CNPJ (8 dígitos) e o evento vale para o grupo econômico."
        : "Fornecedor do contrato é diferente do fornecedor do evento.",
  });

  const active = !contract.deleted && contract.orgApproved;
  checks.push({
    rule: "C3",
    passed: active,
    reason: active ? "contract_active_record" : "contract_inactive_record",
    detail: active ? "Contrato ativo e organização aprovada." : "Contrato excluído ou organização não aprovada.",
  });

  const overlaps = contract.endDate >= event.eventDate;
  checks.push({
    rule: "C4",
    passed: overlaps,
    reason: overlaps ? "contract_period_overlaps_or_future" : "contract_ended_before_event",
    detail: overlaps
      ? `Contrato termina em ${contract.endDate}, igual ou depois da data do evento (${event.eventDate}).`
      : `Contrato terminou em ${contract.endDate}, antes da data do evento (${event.eventDate}).`,
  });

  const match = checks.every((c) => c.passed);
  return {
    match,
    severity: SEVERITY_BY_EVENT_TYPE[event.type],
    reasons: checks.filter((c) => c.passed).map((c) => c.reason),
    checks,
    ruleVersion: RULE_VERSION,
  };
}
