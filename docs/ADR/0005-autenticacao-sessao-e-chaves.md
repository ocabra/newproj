# ADR-0005 — Sessão por cookie para pessoas; chave com escopos para máquinas

- **Status:** aceita (27/11/2026)
- **Decisão:**
  - **Portal:** sessão opaca em cookie HttpOnly. O banco guarda só o hash do token.
  - **B2B:** chave de API `rdf_<prefixo>_<segredo>`, com SHA-256 do segredo, escopos, revogação e expiração.
  - **Separação:** uma credencial nunca autentica a outra superfície.
- **Alternativas descartadas:**
  - **JWT para o portal:** a revogação imediata é difícil e não há ganho com um processo só.
  - **OAuth2 client credentials:** ninguém pediu. O PLANO diz para não implementar sem necessidade. Fica como evolução se um cliente exigir.
- **Consequências:** a rotação de chave consiste em criar uma nova e revogar a antiga, sem rotação automática. O segredo da chave é mostrado uma única vez.
