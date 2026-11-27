import { buildApp } from "./app.js";
import { loadConfig, loadDotEnv } from "./config.js";
import { createDb } from "./db/client.js";

loadDotEnv();
const config = loadConfig();
const { db, pool } = createDb(config.DATABASE_URL);
const app = await buildApp({ db, config, logger: true });

const shutdown = async () => {
  await app.close();
  await pool.end();
  process.exit(0);
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

await app.listen({ port: config.PORT, host: config.HOST });
