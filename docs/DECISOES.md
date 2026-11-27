# Registro de decisões do agente executor

> Diário cronológico de toda dúvida enfrentada durante a execução do PLANO.md, a escolha feita e o porquê (incluindo alternativas descartadas). Instrução dos fundadores (27/11/2026): **não perguntar nada; decidir e documentar aqui.**
>
> Formato: `D-NNN | data | etapa` — Dúvida · Decisão · Por quê · Alternativas descartadas · Reversibilidade.

---

### D-001 | 27/11/2026 | Ambiente
- **Dúvida:** que ambiente está disponível (PLANO §10.1)?
- **Constatado:** Node 24.14, npm 11.11 (sem pnpm), Docker 29.4 **sem plugin `docker compose`**, Podman 5.8, PostgreSQL 18.4 local (`psql`), Python 3.13, git, internet com busca web. `ccee.org.br` responde HTTP 403 para `curl`.
- **Decisão:** usar internet para a pesquisa; para a CCEE, tentar fetch e, se bloqueado, usar fontes alternativas (ANEEL cedoc, gov.br, dados abertos, imprensa setorial) rotuladas pelo grau de confiança.
- **Impacto:** algumas afirmações sobre regras da CCEE podem ficar `NÃO VERIFICADO` na fonte primária.

### D-002 | 27/11/2026 | Etapa A — organização da pesquisa
- **Dúvida:** pesquisar sequencialmente sozinho ou paralelizar?
- **Decisão:** 5 agentes de pesquisa em paralelo (ACL; Resposta da Demanda; Open Energy + dados/integrações; concorrência; clientes/problemas), cada um escrevendo um rascunho em `docs/_pesquisa/`. Eu consolido nos entregáveis oficiais (`docs/01`–`04`, `REFERENCIAS.md`).
- **Por quê:** fundadores pediram "quantos agentes forem necessários"; as frentes são independentes; cinco é o mínimo que cobre §2.1-A/B/C, §2.2, §2.3 e §2.4 sem sobreposição. Rascunhos separados evitam que dois agentes escrevam o mesmo arquivo ao mesmo tempo.
- **Descartado:** um agente por entregável final (01-MERCADO mistura ACL, RD e Open Energy — ficaria grande demais para um único agente); mais agentes (aumentaria custo e duplicação de buscas).
- **Reversível:** sim; rascunhos ficam preservados para auditoria.

### D-003 | 27/11/2026 | Etapa A — fonte das Etapas B em diante
- **Dúvida:** usar os rascunhos dos agentes como verdade?
- **Decisão:** não. Vou reler os rascunhos, conferir por amostragem as afirmações críticas para a decisão (as que mudam GO/NO-GO) e manter os rótulos de confiança. Etapa B (economia e decisão) eu faço pessoalmente, com script reproduzível.
- **Por quê:** PLANO §1.3 (não inventar) e §9 (nunca afirmar sem evidência); resultados de subagentes podem conter erros apresentados com confiança.

### D-004 | 27/11/2026 | Interação com os fundadores
- **Dúvida:** o PLANO §10.4 manda "parar no gate" e pedir validações externas aos fundadores; os fundadores agora pedem para não perguntar nada.
- **Decisão:** não vou parar para perguntar. No gate, registro a decisão em `06-DECISAO-GO-NOGO.md` e as validações externas que **só os fundadores podem fazer** (entrevistas, contatos comerciais, assessoria jurídica) como pendências explícitas, e sigo conforme o próprio plano permite (protótipo reversível sob GO CONDICIONAL, ou plano de descoberta sob NO-GO).
- **Por quê:** a instrução mais recente dos fundadores prevalece sobre o procedimento do plano; o plano já prevê o caminho sem validação externa.
- **Mantido:** a regra §1.8 (não comprar, não contratar, não usar dados reais, não disparar contatos externos) continua valendo — não é pergunta, é limite.

### D-005 | 27/11/2026 | Versionamento
- **Dúvida:** como organizar os commits pedidos pelos fundadores ("crie commits para tudo")?
- **Decisão:** um commit por unidade lógica de trabalho (cada rascunho de pesquisa, cada entregável consolidado, cada decisão de gate, cada fatia vertical do MVP), direto na `main`, com mensagem descritiva em português. Rascunhos dos agentes são commitados só quando o agente termina (nunca arquivo pela metade). Commits locais; **não faço `push`** automaticamente.
- **Por quê:** commits pequenos tornam cada decisão auditável e reversível com `git revert`. Push é ação externa (publica no GitHub) e o pedido foi só de commits; vocês podem dar `git push` quando quiserem.
- **Descartado:** branch por etapa + PR (o repositório é novo, de dois fundadores, sem CI nem revisão — overhead sem benefício agora); commit único no final (perde a rastreabilidade pedida).

### D-006 | 27/11/2026 | Versionamento (revisão de D-005)
- **Mudança:** fundadores autorizaram `push` ("pode comitar e empurrar", com bom senso).
- **Decisão:** após cada commit lógico, `git push origin main`. Antes de cada push confiro que não há segredos (`.env`, chaves, credenciais) nem dados reais de clientes no diff; nunca uso `--force`.
- **Por quê:** o GitHub passa a ser o backup e permite acompanhar o progresso de outro dispositivo.

### D-007 | 27/11/2026 | Etapa A — verificação independente (D-003)
- **Feito:** conferi por busca própria as 4 afirmações que mais pesam no gate: (1) REN ANEEL 1.175/2026 (Open Energy) publicada em 04/11/2026, comparador CCEE em até 12 meses mediante aprovação; (2) 3º mecanismo de RD Disponibilidade contratou 344 MW (12 ofertas, 86% metalurgia) em sandbox; (3) AXIA oferece plataforma agregadora de RD gratuita por 12 meses; (4) Decreto 13.097/2026 abre BT em 25/11/2027 (indústria/comércio) e 25/11/2028 (demais), com varejista obrigatório.
- **Resultado:** todas consistentes com os rascunhos. Divergência menor: um agente tratou "REN 1.174/1.175" como INFERÊNCIA, outro como CONFIRMADO via reprodução do DOU. Mantenho **CONFIRMADO para a 1.175 (Open Energy)** e INFERÊNCIA para o conteúdo da 1.174 até leitura do DOU oficial.

### D-008 | 27/11/2026 | Etapa B — incluir hipótese H5 (risco de contraparte)
- **Dúvida:** PLANO §3.1 só permite hipóteses extras "se houver evidência de problema relevante e pagante". Dois agentes independentes (ACL e concorrência) apontaram a crise de crédito das comercializadoras em 2026 como espaço em branco.
- **Evidência:** ≥11 comercializadoras com > R$ 6 bi em dívidas; recuperações judiciais (Tradener R$ 1,7 bi, Electra R$ 1,3 bi, Elétron, IBS, 2W); liminar da Tradener que alterava a entrega aos clientes; geradores evitando comercializadoras independentes; CCEE migrando para monitoramento prudencial; GESEL: exposição líquida de um agente não é visível de fora; nenhuma ferramenta padronizada de risco de contraparte para o consumidor encontrada.
- **Decisão:** incluir **H5 — monitor de risco de contraparte de fornecedores de energia** na comparação, como hipótese (dor CONFIRMADA por fatos públicos; disposição a pagar NÃO VERIFICADA). Lanço um agente de pesquisa dedicado (fontes de dados públicas, substitutos como birôs de crédito e CCEE, risco jurídico de publicar avaliações sobre empresas).
- **Por quê:** é a única dor com evidência pública forte e recente que não colide com o comparador oficial nem exige habilitação CCEE.
- **Descartado:** ignorar por não estar na lista original (o plano manda não presumir viabilidade da ideia inicial); adotá-la sem pesquisa (viés de novidade).
