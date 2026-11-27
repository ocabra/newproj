import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;
const E2E_DB = process.env.E2E_DATABASE_URL ?? "postgres://radar:radar@localhost:55432/radar_e2e";

export default defineConfig({
  testDir: "e2e",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["list"]],
  use: { baseURL: `http://127.0.0.1:${PORT}`, trace: "retain-on-failure" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile-360", use: { ...devices["Pixel 5"], viewport: { width: 360, height: 740 } }, grep: /@mobile/ },
  ],
  webServer: {
    command: "npm run build && npx tsx scripts/e2e-prepare.ts && node dist/node/server/main.js",
    url: `http://127.0.0.1:${PORT}/health`,
    reuseExistingServer: false,
    timeout: 180_000,
    env: {
      DATABASE_URL: E2E_DB,
      E2E_DATABASE_URL: E2E_DB,
      PORT: String(PORT),
      API_HOST: "127.0.0.1",
      NODE_ENV: "test",
      APP_ORIGIN: `http://127.0.0.1:${PORT}`,
      SEED_PASSWORD: process.env.SEED_PASSWORD ?? "e2e-somente-sintetico",
    },
  },
});
