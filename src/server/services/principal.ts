import { AppError, forbidden } from "../http/errors.js";

export type OrgType = "manager" | "consumer" | "supplier" | "operator";
export type Role = "owner" | "member" | "admin" | "curator";
export type Scope = "portfolio:read" | "portfolio:write" | "alerts:read" | "alerts:write";
export const SCOPES: readonly Scope[] = ["portfolio:read", "portfolio:write", "alerts:read", "alerts:write"];

export interface Principal {
  kind: "session" | "api_key";
  userId: string | null;
  apiKeyId: string | null;
  orgId: string;
  orgType: OrgType;
  orgStatus: "pending" | "approved" | "rejected" | "suspended";
  supplierId: string | null;
  role: Role | null;
  scopes: Scope[] | null;
  ip: string | null;
}

export interface Requirement {
  orgTypes?: readonly OrgType[];
  roles?: readonly Role[];
  scope?: Scope;
  allowUnapproved?: boolean;
}

/** Ponto único de autorização: chamado por toda rota antes de tocar dados. */
export function authorize(p: Principal, req: Requirement): Principal {
  if (!req.allowUnapproved && p.orgStatus !== "approved") {
    throw new AppError("org_not_approved", "Organização ainda não aprovada pela operação da plataforma.");
  }
  if (req.orgTypes && !req.orgTypes.includes(p.orgType)) throw forbidden();
  if (p.kind === "session" && req.roles && (!p.role || !req.roles.includes(p.role))) throw forbidden();
  if (p.kind === "api_key") {
    if (!req.scope || !p.scopes?.includes(req.scope)) throw forbidden(`Escopo necessário: ${req.scope ?? "n/a"}.`);
  }
  return p;
}

export const PORTFOLIO_ORGS: OrgType[] = ["manager", "consumer"];
