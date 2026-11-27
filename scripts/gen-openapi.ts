/** Gera openapi/openapi.yaml a partir dos schemas Zod da API v1 (ADR-0003). */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildApp } from "../src/server/app.js";
import { createDb } from "../src/server/db/client.js";

export async function generateOpenApiYaml(): Promise<string> {
  // O banco não é consultado: só os schemas das rotas são lidos.
  const { db, pool } = createDb("postgres://unused:unused@127.0.0.1:1/unused");
  const app = await buildApp({
    db,
    config: {
      DATABASE_URL: "postgres://x",
      PORT: 0,
      API_HOST: "127.0.0.1",
      NODE_ENV: "test",
      APP_ORIGIN: "http://localhost",
    },
  });
  await app.ready();
  const yaml = app.swagger({ yaml: true });
  await app.close();
  await pool.end();
  return `# GERADO por scripts/gen-openapi.ts a partir de src/server/http/v1/schemas.ts — não editar à mão.\n${yaml}`;
}

const out = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../openapi/openapi.yaml");
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  fs.writeFileSync(out, await generateOpenApiYaml());
  console.log(`escrito: ${out}`);
}
