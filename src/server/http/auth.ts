import type { FastifyReply, FastifyRequest } from "fastify";
import { principalFromApiKey } from "../services/apikeys.js";
import { principalFromSession } from "../services/identity.js";
import { AppError } from "./errors.js";

export const SESSION_COOKIE = "radar_session";
export const CSRF_HEADER = "x-requested-with";
export const CSRF_VALUE = "radar";

/** Portal: cookie de sessão + proteção CSRF em métodos que alteram estado. Nunca aceita chave de API. */
export async function requireSession(req: FastifyRequest, _reply: FastifyReply): Promise<void> {
  if (req.headers.authorization) {
    throw new AppError("unauthenticated", "O portal não aceita chave de API; use a sessão do navegador.");
  }
  if (!["GET", "HEAD", "OPTIONS"].includes(req.method)) checkCsrf(req);
  const token = req.cookies[SESSION_COOKIE];
  const p = token ? await principalFromSession(req.server.db, token, req.ip) : null;
  if (!p) throw new AppError("unauthenticated", "Sessão ausente ou expirada.");
  req.principal = p;
}

export function checkCsrf(req: FastifyRequest): void {
  if (req.headers[CSRF_HEADER] !== CSRF_VALUE) {
    throw new AppError("csrf_failed", `Cabeçalho ${CSRF_HEADER}: ${CSRF_VALUE} obrigatório.`);
  }
  const origin = req.headers.origin;
  if (origin) {
    const allowed = new Set([req.server.config.APP_ORIGIN, `${req.protocol}://${req.headers.host}`]);
    if (!allowed.has(origin)) throw new AppError("csrf_failed", "Origem não permitida.");
  }
}

/** API B2B: somente `Authorization: Bearer rdf_…`. Nunca aceita cookie de sessão. */
export async function requireApiKey(req: FastifyRequest, _reply: FastifyReply): Promise<void> {
  const h = req.headers.authorization ?? "";
  const m = /^Bearer\s+(\S+)$/i.exec(h);
  const p = m ? await principalFromApiKey(req.server.db, m[1]!, req.ip) : null;
  if (!p) throw new AppError("unauthenticated", "Chave de API ausente, inválida, expirada ou revogada.");
  req.principal = p;
}

/** Chave do limite de taxa da API: prefixo da chave (sem tocar o segredo) ou IP. */
export function apiRateKey(req: FastifyRequest): string {
  const m = /^Bearer\s+rdf_([0-9A-Za-z]{8})_/i.exec(req.headers.authorization ?? "");
  return m ? `key:${m[1]}` : `ip:${req.ip}`;
}
