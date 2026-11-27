import { and, eq, lt } from "drizzle-orm";
import type { Db } from "../db/client.js";
import { idempotencyKeys } from "../db/schema.js";
import { conflict, invalid } from "../http/errors.js";
import { sha256 } from "../security/tokens.js";

const TTL_MS = 24 * 60 * 60 * 1000;

/**
 * Executa `fn` uma única vez por (organização, Idempotency-Key). Repetições com o mesmo corpo devolvem a resposta
 * gravada; com corpo diferente, 409.
 */
export async function withIdempotency<T>(
  db: Db,
  orgId: string,
  key: string | undefined,
  body: unknown,
  fn: () => Promise<{ status: number; body: T }>,
): Promise<{ status: number; body: T; replayed: boolean }> {
  if (!key) return { ...(await fn()), replayed: false };
  if (!/^[\w-]{8,100}$/.test(key)) throw invalid("Idempotency-Key deve ter 8–100 caracteres [A-Za-z0-9_-].");
  const hash = sha256(JSON.stringify(body ?? null));
  await db.delete(idempotencyKeys).where(lt(idempotencyKeys.createdAt, new Date(Date.now() - TTL_MS)));
  const [prev] = await db
    .select()
    .from(idempotencyKeys)
    .where(and(eq(idempotencyKeys.orgId, orgId), eq(idempotencyKeys.key, key)));
  if (prev) {
    if (prev.requestHash !== hash) throw conflict("Idempotency-Key reutilizada com corpo diferente.");
    return { status: prev.responseStatus, body: prev.responseBody as T, replayed: true };
  }
  const res = await fn();
  await db
    .insert(idempotencyKeys)
    .values({ orgId, key, requestHash: hash, responseStatus: res.status, responseBody: res.body as object })
    .onConflictDoNothing();
  return { ...res, replayed: false };
}
