# 08 — PRD do MVP: Radar de Fornecedores (H5-G)

> **Status:** protótipo sob **GO CONDICIONAL** (`06`). Dados **sintéticos** apenas. Nome de trabalho: **Radar de Fornecedores**. Não é nome comercial nem marca registrada.

## 1. Problema e objetivo

Em 2026, consumidores do ACL foram afetados pela crise de crédito de seus fornecedores. Houve listagem como inadimplentes pelo representante, ameaça de desligamento, perda do preço contratado e garantias travadas por recuperação judicial (anexo H5 §1). Os sinais públicos existem, mas estão espalhados: atas, listas e FA da CCEE, processos e imprensa. Ninguém os cruza com a carteira de contratos de uma **gestora de energia**.

**Objetivo do MVP:** demonstrar, com dados sintéticos, que uma gestora consegue fazer três coisas:
1. cadastrar a carteira (clientes, unidades, contratos e fornecedores);
2. receber alertas explicáveis quando um fornecedor aparece em um evento público curado;
3. ver a exposição estimada em R$, pela web e por API.

O MVP também deve servir de instrumento para o backtest E1.

## 2. Personas e papéis

| Organização (`org_type`) | Papel de usuário | O que faz |
|---|---|---|
| `manager`: gestora de energia | `owner`, `member` | Cadastra clientes, unidades, contratos e fornecedores da carteira; vê alertas e exposição; gera chaves de API; convida usuários (`owner`) |
| `consumer`: consumidor agente | `owner`, `member` | O mesmo que a gestora, restrito à própria carteira (um "cliente" implícito) |
| `supplier`: comercializadora/varejista | `owner`, `member` | Depois de aprovada e vinculada ao seu CNPJ, vê os eventos publicados **sobre si mesma** e registra **resposta/contestação** (direito de resposta) |
| `operator`: operação da plataforma | `admin`, `curator` | Aprova organizações; cadastra e importa eventos públicos e séries de FA, sempre com fonte; publica e retira eventos; cadastra preços de referência com fonte; consulta auditoria |

Toda organização nasce `pending`. Só `approved` acessa dados além do próprio cadastro. A aprovação é manual, feita pelo `admin`.

## 3. Jornadas principais

1. **Cadastro:** a pessoa cria a conta e a organização (tipo gestora, consumidor ou fornecedor). A organização fica `pending` até o admin aprovar. O titular pode convidar membros por um link com token de uso único que expira em 7 dias.
2. **Carteira (gestora):**
   - criar um cliente (razão social, CNPJ validado por dígito verificador);
   - criar uma unidade (nome, submercado SE/CO, S, NE, N; distribuidora opcional);
   - criar um contrato, com:
     - fornecedor por CNPJ (cria o fornecedor no catálogo, se não existir);
     - início e fim;
     - `volume_mwm`, `price_brl_per_mwh`, `guarantee_brl` e tipo de garantia.
   - Ou importar contratos por CSV (template e validação linha a linha). Ao importar, a gestora **declara ter mandato do cliente** para tratar esses dados. A declaração fica registrada com usuário, data e versão do texto.
3. **Curadoria (operador):**
   - registrar um evento com:
     - fornecedor (CNPJ);
     - tipo (§4);
     - data do evento e data de publicação;
     - URL e nome da fonte;
     - resumo factual;
     - ressalva obrigatória quando aplicável, por exemplo "débito com exigibilidade suspensa não é inadimplência".
   - Fluxo do evento: `draft` → `published` → `retracted`.
   - Importar CSV de séries de FA (fornecedor, semana, valor/faixa, fonte).
   - Cadastrar o preço de referência (submercado, período, R$/MWh, fonte, data).
4. **Alertas:** ao publicar um evento, o motor gera alertas para todos os contratos afetados de todas as carteiras. A gestora vê a lista, filtra por severidade, status, cliente e fornecedor, abre o detalhe (razões, fonte, exposição, resposta do fornecedor) e muda o status: `open` → `acknowledged` → `resolved`.
5. **Explicação de "sem alerta":** para qualquer contrato, a gestora pode pedir "por que este contrato não tem alerta?". O sistema responde com as regras avaliadas e o resultado de cada uma.
6. **API B2B:** a gestora gera uma chave com escopos (`portfolio:read`, `portfolio:write`, `alerts:read`, `alerts:write`) e consulta alertas, contratos e exposição via `/api/v1`. A chave pode ser revogada e rotacionada.
7. **Direito de resposta (fornecedor):** o fornecedor aprovado vê os eventos publicados sobre o seu CNPJ e envia uma resposta textual. As gestoras com alertas desse evento veem a resposta. O fornecedor **nunca** vê quais carteiras têm contratos com ele.
8. **Retirada de evento:** o operador retira um evento publicado com justificativa. Alertas `open` e `acknowledged` passam a `retracted`. Nenhum alerta novo é gerado. A interface informa que dados já vistos ou exportados pelas gestoras não são "desvistos". Isso atende a PLANO §6, que pede não prometer revogação retroativa.
9. **Exclusão:** a gestora exclui logicamente cliente, unidade ou contrato. A partir daí eles somem das listas, da API e do motor. A trilha de auditoria permanece. Política de retenção: `09` §5.

## 4. Regras do motor de alertas (determinístico, versionado: `rules@1`)

Um alerta é gerado para o par (contrato, evento) quando **todas** as condições valem:

| # | Condição | Razão registrada |
|---|---|---|
| C1 | Evento `published` | `event_published` |
| C2 | CNPJ do fornecedor do contrato == CNPJ do evento (14 dígitos), **ou** mesma raiz de 8 dígitos quando o evento tem `scope = group` | `supplier_match_exact` / `supplier_match_group_root` |
| C3 | Contrato não excluído e organização `approved` | `contract_active_record` |
| C4 | Contrato vigente em `event_date` ou começando depois dela (fim do contrato ≥ data do evento) | `contract_period_overlaps_or_future` |
| C5 | Não existe alerta para o mesmo (contrato, evento) | `dedupe` (unicidade no banco) |

**Severidade por tipo de evento (tabela fixa em `rules@1`):**

| Tipo (`event_type`) | Severidade |
|---|---|
| `judicial_recovery_filed` (pedido de RJ), `bankruptcy_filed`, `ccee_disconnection` (desligamento), `retailer_disqualification` (inabilitação de varejista), `mcp_default_listed` (lista de inadimplentes MCP) | `critical` |
| `extrajudicial_recovery`, `balanced_operation` (operação balanceada), `leverage_band_worsened` (FA piorou de faixa), `protest_relevant` | `high` |
| `leverage_band_improved`, `governance_change`, `other_public_notice` | `info` |

**Exposição** (fórmulas em `07` §3), calculada no momento do alerta e recalculável sob demanda:
- usa o preço de referência mais recente do submercado da unidade cuja data de referência seja ≤ a data de cálculo;
- sem referência, `exposure = null` e razão `no_reference_price`;
- unidades explícitas nos campos: `remaining_energy_mwh`, `replacement_cost_brl`, `guarantee_coverage_pct`, `reference_price_brl_per_mwh`, `reference_price_source`.

Cada alerta armazena: versão da regra, razões, snapshot dos dados usados (volume, preço, datas, CNPJ, referência) e horário do cálculo.

**Casos de teste obrigatórios** (PLANO §4.3 adaptado):
- fornecedor diferente → sem alerta;
- contrato encerrado antes do evento → sem alerta;
- sobreposição parcial (contrato começa depois do evento) → alerta;
- evento perto da meia-noite em `America/Sao_Paulo` × UTC → data correta;
- evento retirado → alertas `retracted` e nenhum novo;
- sem preço de referência → alerta com `exposure = null`;
- publicação repetida → sem duplicata;
- organização B tentando ler alerta de A por ID → `404`;
- contratos sobrepostos (mesma unidade, mesmo fornecedor, períodos que se cruzam) → aviso de possível duplicidade na criação; o volume não é somado em dobro sem confirmação.

## 5. Funcionalidades obrigatórias × fora do escopo

**Dentro:**
- autenticação de sessão;
- organizações, papéis e convites;
- aprovação pelo admin;
- clientes, unidades e contratos, com CRUD e exclusão lógica;
- importação CSV de contratos e de FA;
- catálogo de fornecedores;
- eventos (curadoria, publicação, retirada);
- preços de referência;
- motor de alertas e explicação;
- status de alertas;
- direito de resposta;
- chaves de API com escopos;
- API `/api/v1` com OpenAPI 3.1;
- auditoria;
- interface pt-BR responsiva;
- dados sintéticos de demonstração;
- ferramenta de backtest de FA (E1) em linha de comando.

**Fora:**
- pagamentos;
- nota ou score de crédito;
- previsão de default;
- coleta automática da CCEE ou de tribunais;
- integração real com CCEE, BBCE ou Abraceel;
- RFQ ou cotação;
- RD;
- e-mail transacional real: no MVP, os convites mostram o link na tela, registrado em log;
- aplicativos mobile;
- IA para decisões;
- multi-região;
- filas.

## 6. Critérios de aceitação (PLANO §6 adaptado a H5-G)

1. Uma gestora se registra, é aprovada e cria cliente, unidade e contrato com dados sintéticos.
2. Uma gestora aprovada consulta **pela web e pela API** somente alertas e contratos da própria carteira.
3. Ao publicar um evento, o operador gera alertas. A gestora vê o alerta e muda o status. O fornecedor aprovado responde, e a gestora vê a resposta. Cada lado vê o status correto.
4. A plataforma impede o acesso entre organizações. Também impede alertas duplicados e sinaliza contratos sobrepostos.
5. Retirar um evento impede novos alertas e marca os existentes. A interface explica que o que já foi visto não é revertido. Excluir um contrato o remove do motor.
6. A importação rejeita CSV malformado, unidades inconsistentes (volume negativo, MWh no lugar de MWm, preço fora de faixa plausível), datas inválidas, CNPJ inválido e arquivo acima do limite (1 MB / 5.000 linhas).
7. O alerta e o "sem alerta" vêm com justificativas legíveis. Nada é inventado: sem preço de referência, não há exposição.
8. OpenAPI navegável em `/api/docs`, testes de contrato e exemplo funcional com chave. A API retorna `401` sem chave, `403` com escopo errado e `429` acima do limite.
9. A interface é usável em 360 px e em desktop, e os formulários principais são operáveis por teclado.
10. `npm run lint`, `typecheck`, `test` e `build` passam, e a execução local é reproduzível pelo README.
11. `podman compose up` (ou `docker compose up`) sobe o PostgreSQL. `npm run setup` aplica as migrações e carrega os dados sintéticos, permitindo executar o fluxo completo.
12. Nenhuma tela afirma integração oficial com CCEE, ANEEL ou Abraceel, representação de consumidores, nota de crédito ou previsão de falência. Um teste automatizado procura essas frases na interface.
