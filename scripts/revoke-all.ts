/** Resposta a incidente (docs/09 §6): revoga TODAS as sessões e chaves de API. Uso: npm run revoke-all -- --confirmo */
import { loadDotEnv } from "../src/server/config.js";
import { isNull } from "drizzle-orm";
import { createDb } from "../src/server/db/client.js";
import { apiKeys, auditEvents, sessions } from "../src/server/db/schema.js";

loadDotEnv();
if (!process.argv.includes("--confirmo")) {
  console.error("Ação destrutiva. Rode com --confirmo para revogar todas as sessões e chaves.");
  process.exit(1);
}
const { db, pool } = createDb(process.env.DATABASE_URL!);
const now = new Date();
const s = await db
  .update(sessions)
  .set({ revokedAt: now })
  .where(isNull(sessions.revokedAt))
  .returning({ id: sessions.id });
const k = await db
  .update(apiKeys)
  .set({ revokedAt: now })
  .where(isNull(apiKeys.revokedAt))
  .returning({ id: apiKeys.id });
await db
  .insert(auditEvents)
  .values({ action: "incident.revoke_all", meta: { sessions: s.length, api_keys: k.length } });
console.log(`Revogadas: ${s.length} sessão(ões), ${k.length} chave(s) de API.`);
await pool.end();
