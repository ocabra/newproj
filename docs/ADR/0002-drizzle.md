# ADR-0002 — Drizzle ORM com migrações SQL versionadas

- **Status:** aceita (27/11/2026)
- **Decisão:** usar Drizzle ORM com drizzle-kit para gerar migrações SQL, versionadas em `drizzle/`.
- **Por quê:**
  - os tipos são inferidos do esquema TypeScript;
  - as consultas ficam próximas do SQL, o que facilita revisar os filtros de tenant;
  - não há binário de engine;
  - as migrações são SQL legível, onde dá para adicionar `CHECK` e índices à mão.
- **Alternativa descartada:** Prisma. Funciona bem, mas tem um engine separado, migrações menos editáveis e expressa `CHECK` constraints de forma pior.
- **Consequências:** as migrações são geradas e **revisadas** antes do commit. O banco de teste é recriado do zero a cada execução de integração.
