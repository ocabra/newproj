import { and, desc, eq, isNull } from "drizzle-orm";
import type { Db, DbLike } from "../db/client.js";
import { apiKeys, organizations } from "../db/schema.js";
import { invalid, notFound } from "../http/errors.js";
import { hashEquals, newApiKey, parseApiKey, sha256 } from "../security/tokens.js";
import { audit } from "./audit.js";
import { SCOPES, type Principal, type Scope } from "./principal.js";

const dto = (k: typeof apiKeys.$inferSelect) => ({
  id: k.id,
  name: k.name,
  prefix: k.prefix,
  scopes: k.scopes,
  created_at: k.createdAt.toISOString(),
  expires_at: k.expiresAt?.toISOString() ?? null,
  revoked_at: k.revokedAt?.toISOString() ?? null,
  last_used_at: k.lastUsedAt?.toISOString() ?? null,
});

export async function createApiKey(
  db: DbLike,
  p: Principal,
  input: { name: string; scopes: Scope[]; expires_in_days?: number },
) {
  const scopes = [...new Set(input.scopes)];
  if (!scopes.length || scopes.some((s) => !SCOPES.includes(s)))
    throw invalid("Escopos inválidos.", { field: "scopes" });
  const k = newApiKey();
  const [row] = await db
    .insert(apiKeys)
    .values({
      orgId: p.orgId,
      name: input.name.trim(),
      prefix: k.prefix,
      secretHash: k.secretHash,
      scopes,
      createdBy: p.userId!,
      expiresAt: input.expires_in_days ? new Date(Date.now() + input.expires_in_days * 86_400_000) : null,
    })
    .returning();
  await audit(db, p, "api_key.created", { type: "api_key", id: row!.id }, { scopes });
  return { ...dto(row!), key: k.plaintext };
}

export async function listApiKeys(db: DbLike, p: Principal) {
  const rows = await db.select().from(apiKeys).where(eq(apiKeys.orgId, p.orgId)).orderBy(desc(apiKeys.createdAt));
  return rows.map(dto);
}

export async function revokeApiKey(db: DbLike, p: Principal, id: string) {
  const [row] = await db
    .update(apiKeys)
    .set({ revokedAt: new Date() })
    .where(and(eq(apiKeys.id, id), eq(apiKeys.orgId, p.orgId), isNull(apiKeys.revokedAt)))
    .returning();
  if (!row) throw notFound("Chave de API ativa");
  await audit(db, p, "api_key.revoked", { type: "api_key", id });
}

/** Autentica uma chave `rdf_…`. Atualiza last_used_at no máximo 1x/min (registro de uso agregado). */
export async function principalFromApiKey(db: Db, raw: string, ip: string | null): Promise<Principal | null> {
  const parsed = parseApiKey(raw);
  if (!parsed) return null;
  const [row] = await db
    .select({ k: apiKeys, org: organizations })
    .from(apiKeys)
    .innerJoin(organizations, eq(organizations.id, apiKeys.orgId))
    .where(eq(apiKeys.prefix, parsed.prefix));
  if (!row || !hashEquals(row.k.secretHash, sha256(parsed.secret))) return null;
  if (row.k.revokedAt || (row.k.expiresAt && row.k.expiresAt < new Date())) return null;
  const now = new Date();
  if (!row.k.lastUsedAt || now.getTime() - row.k.lastUsedAt.getTime() > 60_000) {
    await db.update(apiKeys).set({ lastUsedAt: now }).where(eq(apiKeys.id, row.k.id));
    const day = now.toISOString().slice(0, 10);
    if (row.k.lastUsedAt?.toISOString().slice(0, 10) !== day) {
      await audit(db, { orgId: row.org.id, userId: null, apiKeyId: row.k.id, ip }, "api_key.used", undefined, { day });
    }
  }
  return {
    kind: "api_key",
    userId: null,
    apiKeyId: row.k.id,
    orgId: row.org.id,
    orgType: row.org.type,
    orgStatus: row.org.status,
    supplierId: row.org.supplierId,
    role: null,
    scopes: row.k.scopes as Scope[],
    ip,
  };
}
