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

### D-009 | 27/11/2026 | Etapa A — forma de consolidar os entregáveis
- **Dúvida:** reescrever os rascunhos dos agentes em texto novo ou promovê-los aos entregáveis oficiais?
- **Decisão:** promover o conteúdo sem reescrever (apenas reorganizar): `01-MERCADO` = síntese minha + mapa de atores + Parte A (ACL) + Parte B (RD) + Parte C (Open Energy); `02` = clientes; `03` = concorrência; `04` = dados e integrações; `REFERENCIAS.md` = todas as tabelas de fontes. As referências recebem prefixo da frente (`ACL-R1`, `RD-R1`, `CLI-R1`, `CON-R1`, `OE-R1`, `H5-R1`) porque cada agente numerou de R1 em diante. Os rascunhos em `docs/_pesquisa/` são removidos (ficam no histórico do git, commits `6df0288`…`1b533e0`).
- **Por quê:** reescrever 220 KB de pesquisa introduziria erros de transcrição e perderia rótulos de confiança; manter rascunhos e entregáveis duplicados criaria duas versões da verdade.
- **Descartado:** manter `_pesquisa/` em paralelo (duplicação); renumerar referências globalmente (trabalho manual sujeito a erro, sem ganho).
- **Script:** a reorganização foi feita por script descartável (prefixar referências, rebaixar títulos, separar seções); não versionado por ser uma transformação única e verificável pelo diff.

### D-010 | 27/11/2026 | Etapa B — forma do modelo econômico
- **Dúvida:** planilha, notebook ou script?
- **Decisão:** script Python sem dependências (`scripts/economia.py`) que gera as tabelas e reescreve um bloco marcado em `docs/05` (`--atualizar`).
- **Por quê:** PLANO §1.10 e §3.2 pedem resultado reproduzível e fórmulas explícitas; um script versionado mostra cada premissa e seu rótulo no diff; sem dependências roda em qualquer máquina com Python 3.
- **Descartado:** XLSX (não diffável, fórmulas escondidas); notebook (estado oculto, dependências).

### D-011 | 27/11/2026 | Etapa B — premissas sem fonte
- **Dúvida:** o plano proíbe inventar preços, mas exige unit economics. Que números usar?
- **Decisão:** usar faixas pessimista/base/otimista explicitamente rotuladas `HIPÓTESE`, ancoradas onde houver evidência (R$ 1–2 mil por indicação da Comerc para H1; lances de RD 2026 para H2; 144 varejistas, 438 comercializadoras e ~46 mil cargas fora do varejo para SAM). Custos fixos de mercado (jurídico, consultor, contador) também `HIPÓTESE`. A métrica usada para comparar hipóteses é **clientes necessários para cobrir o custo fixo vs. tamanho do mercado documentado**, que é muito menos sensível às premissas inventadas do que o caixa acumulado.
- **Por quê:** é a forma de fazer a conta sem fingir precisão; a comparação qualitativa (H2 precisa de 37% do mercado nacional de RD; H5 precisa de < 1% dos compradores) sobrevive a erros de 2× nas premissas.
- **Sinal de viés registrado:** as premissas de H5 (início no mês 4, CAC R$ 3 mil) são mais favoráveis que as de H3/H4 porque dados públicos encurtam a construção; se isso estiver errado, H5 se aproxima de H4. A sensibilidade "início +3 meses" e "CAC +50%" está na tabela.
- **Pró-labore:** R$ 8 mil/mês por fundador como mínimo hipotético, mostrado à parte, porque o orçamento informado é só de infraestrutura.

### D-012 | 27/11/2026 | Etapa B — revisão de H5 após pesquisa dedicada
- **Fato novo:** a Central de Risco Abraceel/Risk3 já monitora contrapartes para comercializadoras associadas; a CCEE publica de graça o Fator de Alavancagem (FA) semanal; a Thunders o republica; a única âncora de preço confirmada é birô genérico (Serasa, R$ 120–270/mês).
- **Decisão:** rebaixar H5 no modelo. Preço base de R$ 1.200 para R$ 600/mês, pessimista R$ 250 (âncora do birô), churn maior; tirar comercializadoras do SAM (já atendidas). Reescrever a defensabilidade como "fraca a média". Estreitar o escopo para **H5-G**: alertas e exposição na carteira de **gestoras e compradores finais**, sem refazer o que a CCEE já publica.
- **Efeito:** no cenário base, H5 passou de melhor caixa para equivalente a H4 (−R$ 359 mil vs −R$ 278 mil em 24 meses). Mantive os resultados revisados, mesmo piores, porque a versão anterior estava otimista sem evidência (viés que eu já tinha sinalizado em D-011).

### D-013 | 27/11/2026 | Gate de negócio — decisão
- **Dúvida:** GO, GO CONDICIONAL, PIVOT ou NO-GO? E qual estratégia?
- **Decisão:** **PIVOT** para H5-G (radar de risco de fornecedores para gestoras de energia) sob **GO CONDICIONAL**, ou seja, só um protótipo reversível com dados sintéticos. Detalhes, matriz e experimentos em `06`.
- **Por quê H5-G e não H4 (2º colocado):** (1) dor documentada em 2026 com casos concretos, contra dor apenas suposta em H4; (2) H4 está saturado e sob ameaça direta do comparador oficial; (3) o protótipo de H5-G é o próprio instrumento do experimento mais barato e decisivo (E1, backtest do FA), então construir gera evidência e não só software; (4) o motor contrato × evento se encaixa no requisito do PLANO de "match explicável e determinístico".
- **Por quê não NO-GO:** existe comprador identificável (gestora), dado lícito e rota legal plausível; o que falta é validação comercial, e o PLANO define isso como GO CONDICIONAL.
- **Riscos que contradizem a ideia original e não foram escondidos:** o marketplace original foi rejeitado; H5-G pode não sobreviver ao fim da crise; a diferença na matriz é pequena (7 pontos) e foi declarada.
- **Reversibilidade:** total. Se E2 falhar, o protótipo é abandonado e a pesquisa de `01`–`05` continua valendo para reavaliar H4/H3.

### D-014 | 27/11/2026 | Pedidos aos fundadores sem perguntar
- **Dúvida:** E2 (entrevistas), E3 (advogado) e E4 (contato com Abraceel/Risk3) exigem ação externa que eu não posso fazer (PLANO §1.8).
- **Decisão:** registrei esses itens como experimentos com dono = fundadores, prazo e critério de sucesso em `06` §6, sem bloquear o protótipo. Não fiz contato com ninguém.

### D-015 | 27/11/2026 | Fatia 1 — versões e ferramentas
- **TypeScript 6.0.x, não 7.0:** o `typescript-eslint` 8.74 exige TypeScript < 6.1. Fixei `~6.0.3`, a versão mais recente compatível.
- **PostgreSQL 16 em container na porta 55432:** já existe um PostgreSQL do sistema na 5432. Não usar o banco do sistema evita interferir em dados da máquina. A porta alternativa evita conflito.
- **`podman compose`:** o Docker da máquina não tem o plugin `compose`, mas `podman-compose` está instalado. O `compose.yaml` é padrão e funciona com os dois.
- **`npm audit`:** 4 vulnerabilidades moderadas, todas em `esbuild` antigo dentro do `drizzle-kit`, que só roda em desenvolvimento para gerar migrações. Não vão para produção. Aceito e registrado. A correção exige `--force`, com mudança incompatível no drizzle-kit.
- **Importação CSV tudo-ou-nada:** um arquivo com qualquer linha inválida é rejeitado inteiro, com a lista de erros por linha e campo. Por quê: importação parcial deixa a carteira num estado que a gestora não consegue conferir.
- **CSV com `;` aceita vírgula decimal:** é o formato padrão do Excel em pt-BR. Com `,`, só ponto decimal.
- **Volume > 1.000 MWm é rejeitado com a mensagem "parece estar em MWh":** é o erro de unidade mais provável (PLANO §1.6). Nenhum consumidor individual do ACL chega perto de 1 GW médio.
- **Horas restantes = dias civis × 24:** o Brasil não tem horário de verão desde 2019. Se voltar a ter, o erro máximo é de 1 h por ano de contrato. Está documentado em `exposure.ts`.

### D-016 | 27/11/2026 | Fatia 2 — autenticação antes da validação
- **Problema encontrado em teste:** a validação do corpo (422) rodava antes do CSRF e da sessão, então uma requisição forjada sem cabeçalho recebia 422 em vez de 403, e um anônimo recebia 422 em vez de 401. Isso revela o formato da API a quem não está autenticado.
- **Decisão:** autenticação e CSRF rodam no gancho `preValidation` do Fastify, antes da validação de schema. A ordem passa a ser 401/403 → 422 → regra de negócio.

### D-017 | 27/11/2026 | Fatia 2 — escolhas de identidade
- **Um usuário pertence a uma única organização** (índice único em `memberships.user_id`). Uma gestora com vários usuários é o caso real. Um mesmo e-mail em várias organizações não aparece no MVP e complicaria a sessão. Reversível: basta remover o índice e incluir uma troca de organização na sessão.
- **Convite sem e-mail transacional:** o link com token é devolvido a quem convidou, que o envia por conta própria. Não contratei serviço de e-mail (PLANO §1.8).
- **Senha mínima de 10 caracteres, sem regras de composição:** segue a orientação NIST 800-63B (comprimento acima de complexidade).
- **Aprovação de organização fornecedora vincula ao catálogo pelo CNPJ declarado:** se o CNPJ já existe no catálogo, usa esse registro; se não, cria. Validar a documentação da empresa fica para a curadoria humana, fora do MVP.
- **Suspender ou rejeitar uma organização revoga todas as suas sessões na hora.**

### D-018 | 27/11/2026 | Fatias 3–6 — defeitos encontrados pelos testes e correções
- **`updated_at` de contratos nascia com o nome `created_at`** (erro meu no esquema): o insert falhava com "column specified more than once". Corrigido com a migração `0003`, que adiciona `updated_at`.
- **Contrato criado depois do evento não recebia alerta:** o motor só rodava na publicação. Agora roda de novo para os eventos publicados do fornecedor sempre que um contrato é criado, alterado ou importado (`rescanPublishedEvents`). É idempotente pela unicidade contrato×evento.
- **Filtro `supplier_cnpj` dos alertas usava o fornecedor do evento:** num evento de grupo (matriz), a gestora que filtrava pelo CNPJ da filial da carteira não via nada. Agora filtra pelo fornecedor do **contrato**, e o DTO do alerta traz os dois (`contract.supplier` e `event.supplier`).
- **Limite de taxa da API não era aplicado:** o gancho `onRoute` que injetava a configuração rodava depois do plugin. Agora cada rota da v1 declara `config.rateLimit`. Um teste garante o 429 com `Retry-After`.
- **Paginação:** timestamps passaram a ter precisão de milissegundos (migração `0001`), para o cursor `(created_at, id)` não repetir itens. Um teste percorre todas as páginas e compara com a lista completa.

### D-019 | 27/11/2026 | Fatias 3–6 — escolhas de comportamento
- **Contrato sobreposto (mesma unidade, mesmo fornecedor, períodos que se cruzam) → 409 com os IDs conflitantes.** Só é criado com `confirm_overlap: true`, e nesse caso volta com aviso. Atende ao requisito do PLANO de evitar dupla contagem sem impedir casos legítimos, como dois contratos distintos com o mesmo fornecedor.
- **Retirada de evento:** alertas `open` e `acknowledged` viram `retracted` e não mudam mais de status. Alertas `resolved` ficam como estão, porque a gestora já encerrou o assunto. Um evento retirado não pode ser republicado; é preciso criar um novo, para que a trilha não seja reescrita.
- **Importação de FA cria evento em rascunho, nunca publicado:** uma piora de faixa vira rascunho `leverage_band_worsened` para revisão humana (ADR-0006). A semântica das faixas da CCEE não foi verificada e aparece como ressalva no próprio evento.
- **OpenAPI:** só `/api/v1` aparece. A API do portal (`/app`) fica oculta porque não é contrato público. Esquemas nomeados vão para `components`. Um teste falha se `openapi/openapi.yaml` divergir do gerado.
- **Testes:** o ESLint permite `any` só em `tests/` e `e2e/`, para inspecionar JSON de resposta. O código de produção continua estrito.

### D-020 | 27/11/2026 | Seed, backtest e operação
- **CNPJs sintéticos com dígito verificador válido:** o sistema rejeita CNPJ inválido, então os dados de demonstração precisam de DV correto. Um CNPJ gerado pode coincidir por acaso com uma empresa real. Mitigação: todo nome leva "(sintética)", as fontes apontam para `exemplo.invalid` e o aviso está no cabeçalho do seed e no README. Descartado: CNPJs de raiz conhecida (como 00000000), que pertencem a empresas reais.
- **Ferramenta do E1 em lógica pura com CLI:** `npm run backtest -- --fa … --eventos …`. Não depende de banco, para os fundadores rodarem sobre o CSV baixado à mão da CCEE. Os critérios de veredito (≤ 40% / ≥ 70%) estão no código e correspondem aos limiares de `06` (≤ 4/10 e ≥ 7/10), definidos antes do experimento. Sem argumentos, roda com amostras sintéticas, e a saída avisa que não vale como evidência.
- **Backup/restauração:** `scripts/backup-restore-test.sh` faz dump, restaura num banco temporário e compara contagens de todas as tabelas. Foi preciso filtrar `SET transaction_timeout`, porque o `pg_dump` 18 da máquina emite um parâmetro que o servidor 16 não conhece.
- **`.env` opcional:** `process.loadEnvFile` lança erro quando o arquivo não existe, o que quebraria a CI e o container. Centralizei em `loadDotEnv()`, que ignora apenas ENOENT.
- **Migrações localizadas subindo a árvore até `drizzle/`:** o caminho relativo fixo funcionava em `src/`, mas não em `dist/node/`. Isso foi visto ao escrever o `Containerfile`, antes de causar falha.
- **CI (GitHub Actions) escrita, mas não executada por mim:** não disparo workflows. Ela roda no próximo push; o resultado real ainda não foi verificado.
