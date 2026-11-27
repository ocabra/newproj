import { migrate } from "drizzle-orm/node-postgres/migrator";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createDb } from "./client.js";

export async function runMigrations(url: string): Promise<void> {
  const { db, pool } = createDb(url);
  const here = path.dirname(fileURLToPath(import.meta.url));
  try {
    await migrate(db, { migrationsFolder: path.resolve(here, "../../../drizzle") });
  } finally {
    await pool.end();
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  process.loadEnvFile?.(".env");
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL ausente");
  await runMigrations(url);
  console.warn("migrações aplicadas");
}
