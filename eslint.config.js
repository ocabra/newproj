import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";

export default tseslint.config(
  { ignores: ["dist", "node_modules", "drizzle", "playwright-report", "test-results", "coverage"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["src/server/**/*.ts", "scripts/**/*.ts", "tests/**/*.ts", "e2e/**/*.ts", "*.config.ts"],
    languageOptions: { globals: globals.node },
  },
  {
    files: ["src/web/**/*.{ts,tsx}"],
    languageOptions: { globals: globals.browser },
    plugins: { "react-hooks": reactHooks },
    rules: { ...reactHooks.configs.recommended.rules },
  },
  {
    rules: {
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "no-console": ["error", { allow: ["warn", "error"] }],
    },
  },
  { files: ["scripts/**/*.ts"], rules: { "no-console": "off" } },
  // Testes inspecionam JSON de resposta arbitrário.
  { files: ["tests/**/*.ts", "e2e/**/*.ts"], rules: { "@typescript-eslint/no-explicit-any": "off" } },
);
