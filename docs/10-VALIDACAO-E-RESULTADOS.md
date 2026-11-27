# 10 — Validação, resultados e relatório final

> **Data:** 27/11/2026. Este documento registra **resultados reais** de execução e separa o que foi verificado do que não foi (PLANO §9: nunca afirmar "teste passou" sem evidência).

## 1. Resultado das verificações técnicas (executadas nesta máquina)

Ambiente: Linux, Node 24.14.1, npm 11.11, PostgreSQL 16 (container Podman, porta 55432), Chromium headless do Playwright 1.65.

| Comando | Resultado | Observação |
|---|---|---|
| `npm run lint` | **exit 0** | ESLint sem erros; Prettier: "All matched files use Prettier code style!" |
| `npm run typecheck` | **exit 0** | servidor (`tsc`) e front (`tsc -p src/web`) |
| `npm test` | **exit 0**: 7 arquivos, **73 testes passando** | unidade (domínio, backtest) + integração contra PostgreSQL real |
| `npm run build` | **exit 0** | Vite (dist/web) + tsc (dist/node) |
| `npm run test:e2e` | **exit 0**: **7 testes passando** | desktop + viewport 360 px |
| `npm start` (smoke) | `/health` → `{"status":"ok","db":"ok"}`; SPA servida com `lang="pt-BR"`; `/api/v1/alerts` sem chave → 401; `/api/docs/` → 200 | build de produção |
| `npm run setup` (banco vazio) | migrações + seed aplicados; segunda execução do seed: "Nada a fazer" | idempotente |
| `scripts/backup-restore-test.sh` | "OK: restauração confere" (contagens iguais em 20 tabelas) | |
| `npm run backtest` (amostras sintéticas) | 2 de 4 sinalizados com ≥ 60 dias → "inconclusivo" | **sintético, não é evidência** |
| `python3 scripts/economia.py --atualizar` | tabelas de `05` regeneradas | |
| `podman build -f Containerfile` | **exit 0**, imagem de 226 MB | ver §1.1 |

### 1.1 Imagem de container

`podman build` terminou com exit 0 (imagem `radar-prototipo`, 226 MB). Rodando a imagem com `--network host` contra o PostgreSQL local, o container aplicou as migrações ("migrações aplicadas"), `/health` respondeu `{"status":"ok","db":"ok"}` e `/painel` (SPA) respondeu 200.

### 1.2 O que NÃO foi verificado

- **CI do GitHub Actions** (`.github/workflows/ci.yml`): está escrita, mas o resultado da primeira execução não foi acompanhado por mim.
- **Navegadores além do Chromium:** Firefox e Safari/WebKit não foram testados.
- **Acessibilidade:**
  - **Verificado:** navegação por teclado no login (E2E), rótulos e landmarks (revisão de código), ausência de rolagem horizontal em 360 px.
  - **Não verificado:** auditoria automática (axe) e leitor de tela.
- **Deploy em nuvem:** não foi feito, porque não contratei serviço nenhum (PLANO §1.8). A imagem existe para deploy demonstrável.
- **Carga e desempenho:** não medidos. O motor faz O(contratos do fornecedor) por evento, e não há evidência de gargalo (por isso Rust/WASM não foi usado).
- **Usuários reais:** **nenhum**. Validação com clientes **pendente**.

## 2. Critérios de aceitação do MVP (PRD `08` §6 ← PLANO §6)

| # | Critério | Status | Evidência |
|---|---|---|---|
| 1 | Gestora se registra, é aprovada e cria cliente, unidade e contrato sintéticos | ✅ | E2E "jornada completa"; `tests/identity.test.ts` |
| 2 | Gestora aprovada consulta via web **e API** só a própria carteira | ✅ | E2E (chave criada na UI lendo `/api/v1/alerts`); `tests/portfolio-tenant.test.ts`, `tests/api-v1.test.ts` (404 em recurso de outra organização) |
| 3 | Evento publicado gera alerta; gestora muda o status; fornecedor responde; resposta visível | ✅ | E2E (alerta crítico, "reconhecer", resposta visível); `tests/radar.test.ts` |
| 4 | Impede acesso entre organizações, alerta duplicado e sobreposição não confirmada | ✅ | `portfolio-tenant` (IDs e filtros manipulados), `radar` (republicar não duplica), 409 de sobreposição |
| 5 | Retirada impede novos alertas e marca os existentes; a UI explica a não retroatividade; exclusão tira do motor | ✅ | `radar.test.ts` (retirada, exclusão); texto na tela de detalhe e no diálogo de retirada |
| 6 | Importação rejeita malformado, unidade inconsistente, data/CNPJ inválidos e acima do limite | ✅ | `domain.test.ts`, `imports.test.ts` (413, tudo-ou-nada, "parece estar em MWh") |
| 7 | Justificativa legível de alerta e de não-alerta; nada inventado | ✅ | `/explanation` com checks C1–C4; `exposure = null` sem preço de referência |
| 8 | OpenAPI navegável, testes de contrato, exemplo com chave, 401/403/429 | ✅ | `/api/docs`; teste de sincronia do YAML; serializador Zod valida as respostas; `api-v1.test.ts` (401/403/429 com Retry-After); README |
| 9 | Responsivo em 360 px e desktop; formulários por teclado | ✅ parcial | E2E 360 px (4 telas) e login por teclado. Os demais formulários **não** têm teste de teclado automatizado |
| 10 | lint, typecheck, testes e build passam; execução reproduzível pelo README | ✅ | §1 |
| 11 | Compose sobe dependências; setup migra e semeia; fluxo completo com seeds | ✅ | `podman compose up -d` + `npm run setup` executados nesta sessão |
| 12 | Nenhuma tela afirma integração oficial, representação, nota ou previsão | ✅ | E2E varre frases proibidas; aviso fixo no rodapé |

## 3. Custo estimado de operação (de `05`, premissas `HIPÓTESE`)

| Item | R$/mês |
|---|---:|
| Infraestrutura (nuvem pequena, PostgreSQL gerenciado, domínio, e-mail, backups) | 1.500 |
| Contabilidade | 1.000 |
| Jurídico recorrente | 2.500 |
| Especialista setorial (meio período) | 6.000 |
| Comercial (viagens, eventos, CRM) | 3.000 |
| Fontes de dados + seguro RC (específicos de H5-G) | 2.000 |
| **Total sem pró-labore** | **16.000** |
| Pró-labore mínimo de 2 fundadores (à parte) | 16.000 |

Custos únicos: R$ 41 mil, dos quais R$ 30 mil são o parecer jurídico. **Infraestrutura em 24 meses: R$ 44 mil, dentro dos R$ 60 mil.** Capital necessário no cenário base de H5-G: cerca de **R$ 360 mil sem pró-labore** e cerca de **R$ 740 mil com pró-labore**. Nenhuma hipótese tem caixa positivo em 24 meses no cenário base.

## 4. Riscos e limitações

| Risco | Severidade | Mitigação/estado |
|---|---|---|
| Ninguém paga (HC3): âncora de birô a R$ 120–270/mês | Alta | E2 com critério de parada |
| CCEE publica gratuitamente o "% de risco por varejista" ou a Abraceel/Risk3 abre o serviço a gestoras | Alta | E4, E5; reposicionar para exposição na carteira |
| Demanda cíclica: some quando a crise de 2026 passar | Alta | Métricas de retenção; acompanhar câmaras de garantia de 2027 |
| Enquadramento CVM 9/2020 e responsabilidade civil por conteúdo curado | Alta | E3, antes de dados reais; só fatos com fonte, sem nota, privado, direito de resposta |
| Curadoria manual não escala; erro de curadoria gera dano | Média | Dupla checagem; retirada com justificativa; meta ≥ 98% sem retificação |
| CCEE bloqueia automação: dependência de download manual | Média | ADR-0006; reavaliar se surgir API ou termos |
| Isolamento só na aplicação (sem RLS) | Média | Testes de isolamento em todas as rotas; RLS antes de dados reais (ADR-0004) |
| Números de mercado vêm de fontes secundárias (CCEE bloqueou acesso) | Média | Rótulos de confiança; afirmações críticas conferidas (D-007) |
| Rate limit em memória (uma instância) | Baixa | Documentado; trocar por Redis se escalar |

## 5. Pendências que dependem dos fundadores (não executadas por regra, PLANO §1.8)

1. **E2:** 10 entrevistas com gestoras + 5 com consumidores ex-clientes de fornecedores em RJ (roteiro em `02` §5).
2. **E3:** contratar parecer jurídico (CVM 9/2020, responsabilidade civil, LGPD, cadastro positivo, termos de uso e minuta de piloto).
3. **E4:** contato comercial com Abraceel/Risk3 sobre preço e acesso para não associadas.
4. **E1:** baixar à mão o histórico do Fator de Alavancagem da CCEE e montar a linha do tempo real dos eventos (anexo H5 §2.2). Depois, rodar `npm run backtest -- --fa … --eventos … --saida docs/anexos/E1-resultado.md`.
5. Ler no DOU oficial o texto integral das RENs 1.174 e 1.175/2026 (hoje lidas em reprodução).
6. Decidir sobre o pró-labore e o capital (R$ 360–740 mil no cenário base) antes de qualquer contratação.

## 6. Métricas para continuar (definidas antes dos testes; ver `07` §7)

Contatadas → entrevistadas ≥ 25%. ≥ 3 pilotos com carteira real (após E3). ≥ 2 pagantes no mês 6 e ≥ 10 no mês 12. Preço médio ≥ R$ 500/mês. ≥ 98% dos eventos sem retificação. Defasagem mediana ≤ 1 dia útil. Onboarding ≤ 2 h. Zero incidentes entre carteiras. CAC ≤ R$ 3.000.

## 7. Plano dos próximos 90 dias

| Semanas | Foco | Saída esperada | Gate |
|---|---|---|---|
| 1–2 | E1 (backtest real) e E4 (Abraceel/Risk3) | `docs/anexos/E1-resultado.md`; nota sobre o substituto | Se FA antecipa ≥ 7/10 **e** Risk3 atende gestoras por ≤ R$ 300 → **parar H5-G** e reavaliar H4 |
| 1–6 | E2: 15 entrevistas, sem pitch nos primeiros 20 min | Notas brutas em `docs/entrevistas/` (sem dados pessoais), síntese com contagens | < 2 gestoras dispostas a pagar ≥ R$ 500 → **NO-GO H5-G** |
| 3–6 | E3: parecer jurídico | Formato permitido; minuta de termo de piloto | Exige registro CVM ou risco alto → limitar a ferramenta interna ou parar |
| 6–8 | Se os gates passarem: RLS, e-mail transacional, curadoria com dupla checagem, termos de uso | Plataforma apta a dados reais de piloto | — |
| 8–12 | 3 pilotos com carteira real; medir as métricas do §6 | Relatório de piloto com números reais | ≥ 2 pagantes → buscar capital/receita para o 2º semestre; senão, pivotar com a base de `01`–`05` |

**Regra geral:** nenhuma linha nova de produto (RFQ de contingência, RD, H4) antes de E2 passar.

## 8. Resumo final (formato PLANO §9)

1. **Confirmado (com fonte):**
   - O ACL tem infraestrutura de negociação consolidada e restrita a agentes.
   - O comparador oficial da CCEE e as APIs do Open Energy têm prazos legais (REN 1.175/2026).
   - A RD é pequena (344 MW), temporária (sandbox até 31/12/2026) e restrita a agentes.
   - A crise de crédito das comercializadoras em 2026 afetou consumidores.
   - Sinais públicos de crédito existem e são gratuitos.
2. **Não sabemos:**
   - disposição a pagar, nas faixas de preço testadas;
   - número de gestoras;
   - se o FA antecipa defaults;
   - enquadramento jurídico;
   - durabilidade da demanda depois da crise.
3. **Decisão:** PIVOT para H5-G sob **GO CONDICIONAL**. Protótipo pronto. **Parar e decidir** após E1, E2, E3 e E4.
4. **Arquivos e testes:**
   - 10 documentos + DECISOES (D-001…D-023), REFERENCIAS, 6 ADRs e o anexo H5;
   - modelo econômico;
   - protótipo completo, com 73 testes de unidade e integração e 7 E2E, todos passando nesta máquina.
5. **Próximo passo:** os itens 1–4 de §5, que dependem dos fundadores.
