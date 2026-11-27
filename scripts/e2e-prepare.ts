/** Recria o banco do E2E do zero, aplica migrações e o seed sintético. Usado pelo webServer do Playwright. */
import pg from "pg";
import { loadDotEnv } from "../src/server/config.js";
import { runMigrations } from "../src/server/db/migrate.js";

loadDotEnv();
const url = process.env.E2E_DATABASE_URL ?? "postgres://radar:radar@localhost:55432/radar_e2e";
const admin = new pg.Client({ connectionString: url.replace(/\/[^/]+$/, "/postgres") });
const name = url.split("/").pop()!;
await admin.connect();
await admin.query(`drop database if exists ${name} with (force)`);
await admin.query(`create database ${name}`);
await admin.end();
await runMigrations(url);
process.env.DATABASE_URL = url;
await import("./seed.js");
