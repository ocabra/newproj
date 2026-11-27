import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/server/**/*.test.ts", "tests/**/*.test.ts"],
    globalSetup: ["tests/global-setup.ts"],
    fileParallelism: false,
    testTimeout: 20_000,
  },
});
