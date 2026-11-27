# ADR-0004 — Isolamento por tenant na aplicação, sem RLS no MVP

- **Status:** aceita (27/11/2026); revisar antes de dados reais.
- **Decisão:** toda consulta de domínio recebe `orgId` do principal autenticado e filtra no `WHERE`. Isso passa por uma camada de repositório que exige `orgId` como parâmetro obrigatório. Os testes de integração tentam acessar recursos de outra organização em **todas** as rotas de recurso.
- **Por que não RLS agora:**
  - exigiria `SET LOCAL` por transação e papéis de banco distintos;
  - complica o pool de conexões e as migrações;
  - num protótipo com dados sintéticos, o teste sistemático cobre o risco.
- **Gatilho para adotar RLS:** antes do primeiro piloto com dados reais (após E3), como defesa em profundidade.
