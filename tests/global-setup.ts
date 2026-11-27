import pg from "pg";
import { runMigrations } from "../src/server/db/migrate.js";

/** Recria o banco de teste do zero e aplica as migrações. */
export default async function setup(): Promise<void> {
  process.loadEnvFile?.(".env");
  const url = process.env.TEST_DATABASE_URL;
  if (!url) throw new Error("TEST_DATABASE_URL ausente (ver .env.example)");
  const client = new pg.Client({ connectionString: url });
  await client.connect();
  await client.query(
    "drop schema if exists public cascade; drop schema if exists drizzle cascade; create schema public;",
  );
  await client.end();
  await runMigrations(url);
}
