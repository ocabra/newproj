# ADR-0003 — Contrato da API B2B em Zod, gerando OpenAPI 3.1 versionado

- **Status:** aceita (27/11/2026)
- **Contexto:** o PLANO §4.5 pede "contrato antes da implementação" e OpenAPI 3.1.
- **Decisão:**
  1. Os schemas Zod de `/api/v1` são escritos **antes** dos handlers, em `src/server/http/v1/schemas.ts`.
  2. O `openapi/openapi.yaml` é gerado a partir deles (`npm run openapi`) e versionado.
  3. Um teste falha se o arquivo versionado diverge do gerado.
  4. Testes de contrato validam respostas reais contra o schema.
- **Alternativa descartada:** escrever o YAML à mão e validar a implementação contra ele. Isso cria duas fontes da verdade que divergem com o tempo.
- **Consequências:** quem integra lê o YAML ou a página `/api/docs`. Mudanças incompatíveis exigem `/api/v2`.
