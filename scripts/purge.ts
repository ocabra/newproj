/**
 * Retenção (docs/09 §5): remove fisicamente carteira excluída há > 90 dias e sessões expiradas há > 30 dias.
 * Auditoria é mantida. Uso: npm run purge [-- --dry-run]
 */
import { loadDotEnv } from "../src/server/config.js";
import { sql } from "drizzle-orm";
import { createDb } from "../src/server/db/client.js";

loadDotEnv();
const dry = process.argv.includes("--dry-run");
const { db, pool } = createDb(process.env.DATABASE_URL!);
const statements = [
  sql`delete from alerts where contract_id in (select id from contracts where deleted_at < now() - interval '90 days')`,
  sql`delete from contracts where deleted_at < now() - interval '90 days'`,
  sql`delete from sites where deleted_at < now() - interval '90 days' and id not in (select site_id from contracts)`,
  sql`delete from clients where deleted_at < now() - interval '90 days' and id not in (select client_id from sites)`,
  sql`delete from sessions where expires_at < now() - interval '30 days' or revoked_at < now() - interval '30 days'`,
  sql`delete from idempotency_keys where created_at < now() - interval '1 day'`,
];
await db
  .transaction(async (tx) => {
    for (const s of statements) {
      const r = await tx.execute(s);
      console.log(
        `${r.rowCount ?? 0} linha(s): ${s.queryChunks
          .map((c) => (typeof c === "object" && "value" in c ? (c.value as string[]).join("") : ""))
          .join("")
          .slice(0, 70)}…`,
      );
    }
    if (dry) {
      console.log("--dry-run: revertendo.");
      tx.rollback();
    }
  })
  .catch((e: Error) => {
    if (!dry) throw e;
  });
await pool.end();
