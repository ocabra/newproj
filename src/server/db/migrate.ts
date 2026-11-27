import { loadDotEnv } from "../config.js";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createDb } from "./client.js";

/** Sobe a árvore a partir deste arquivo até achar drizzle/ (funciona em src/ e em dist/node/). */
function migrationsFolder(): string {
  let dir = path.dirname(fileURLToPath(import.meta.url));
  for (let i = 0; i < 6; i++) {
    const cand = path.join(dir, "drizzle");
    if (fs.existsSync(path.join(cand, "meta", "_journal.json"))) return cand;
    dir = path.dirname(dir);
  }
  throw new Error("Pasta drizzle/ de migrações não encontrada");
}

export async function runMigrations(url: string): Promise<void> {
  const { db, pool } = createDb(url);
  try {
    await migrate(db, { migrationsFolder: migrationsFolder() });
  } finally {
    await pool.end();
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  loadDotEnv();
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL ausente");
  await runMigrations(url);
  console.warn("migrações aplicadas");
}
