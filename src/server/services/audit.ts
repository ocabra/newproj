import type { DbLike } from "../db/client.js";
import { auditEvents } from "../db/schema.js";
import type { Principal } from "./principal.js";

export async function audit(
  db: DbLike,
  p: Pick<Principal, "orgId" | "userId" | "apiKeyId" | "ip"> | null,
  action: string,
  target?: { type: string; id: string },
  meta?: Record<string, unknown>,
): Promise<void> {
  await db.insert(auditEvents).values({
    orgId: p?.orgId ?? null,
    actorUserId: p?.userId ?? null,
    actorApiKeyId: p?.apiKeyId ?? null,
    action,
    targetType: target?.type ?? null,
    targetId: target?.id ?? null,
    meta: meta ?? null,
    ip: p?.ip ?? null,
  });
}
