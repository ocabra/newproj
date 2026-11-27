# Anexo H5 — Monitor de risco de contraparte de fornecedores de energia

> **Status:** pesquisa dedicada à hipótese H5 (ver `DECISOES.md` D-008, D-012), 27/11/2026. Referências `H5-R*` em [`../REFERENCIAS.md`](../REFERENCIAS.md). Rótulos: `CONFIRMADO`, `INFERÊNCIA`, `HIPÓTESE`, `NÃO VERIFICADO`.

> **Hipótese H5:** "monitor de risco de contraparte de fornecedores de energia (comercializadoras/varejistas) para consumidores livres, gestoras e outras contrapartes".
> **Data de consulta de todas as fontes:** 27/11/2026.
> **Rótulos:** `CONFIRMADO` = lido diretamente na fonte primária (ou na fonte indicada, para o fato que ela reporta); `INFERÊNCIA` = dedução a partir de fatos confirmados, ou fato só reportado por imprensa ou snippet de busca de fonte primária; `HIPÓTESE` = a testar; `NÃO VERIFICADO` = não foi possível confirmar.
> **Referências:** `[H5-R#]`, com a tabela completa no fim.
> **Acesso:** `ccee.org.br` bloqueia acesso automatizado. O portal `dadosabertos.ccee.org.br` devolveu a página "Acesso bloqueado" (HTTP 403), e páginas HTML da CCEE falharam. Os PDFs em `ccee.org.br/documents/...` foram baixados e convertidos em texto localmente. O que vem de PDF lido está marcado `CONFIRMADO`; o que só apareceu em snippet de busca está marcado `INFERÊNCIA` ou `NÃO VERIFICADO`.
> **Não repete** `docs/01-MERCADO.md` (ACL, PL de varejista, Tipo 1/Tipo 2) nem `docs/03-CONCORRENCIA.md` (gestoras, BBCE, Thunders como ETRM). Este documento só acrescenta.

---

## 0. Resumo executivo

1. **A dor é real e documentada, mas é desigual entre os perfis de consumidor.**
   - **Consumidor representado por varejista:** é o lado mais exposto. Na lista oficial da CCEE de inadimplentes do MCP (ref. 04/2026), há consumidores livres e especiais listados como inadimplentes **tendo como representante** varejistas em crise. Pelo menos 7 têm a IBS como representante, 4 a Elétron e 1 cada a Electra e a Tradener [H5-R2] (`CONFIRMADO`).
   - **Consequência para esse consumidor:** a CCEE pode desligá-lo e pedir à distribuidora a **suspensão física do fornecimento** em 5 a 10 dias [H5-R9] (`CONFIRMADO`). Em 01/09/2026, a CCEE determinou o desligamento de um frigorífico representado pela Elétron (em RJ), por inadimplência na liquidação de sanções [H5-R1] (`CONFIRMADO`).
   - **Consumidor agente com contrato bilateral:** perde o preço contratado e tem de recontratar num mercado mais caro. O PLD médio subiu de R$ 129 para R$ 236/MWh entre jan/2024 e mar/2026, segundo dados da Abraceel citados por terceiro [H5-R17] (`INFERÊNCIA`).
   - **Efeito da RJ do fornecedor:** a recuperação judicial pode **travar** a rescisão e a execução de garantias. Foi o que aconteceu no deferimento da RJ da Tradener [H5-R21] (`INFERÊNCIA`, imprensa).
2. **O SUI ainda não protege ninguém na prática.** A Lei 15.269/2025 e o Decreto 13.097/2026 criaram o Suprimento de Última Instância para consumidor **adimplente** com representação varejista **obrigatória**, inclusive quando o varejista é desligado ou inabilitado. Até 31/12/2030 o SUI é prestado só por distribuidoras [H5-R10, H5-R11] (`CONFIRMADO`). Tarifas, encargo e prazo máximo dependem da ANEEL, que **não publicou a regulamentação** até a data de consulta [H5-R45] (`INFERÊNCIA`; ausência não comprovada).
3. **Os sinais públicos existem, são gratuitos e mais ricos do que se supunha:**
   - Fator de Alavancagem (FA) por agente, divulgado pela CCEE (semanal para comercializadoras) [H5-R6, H5-R26];
   - deliberações de "operação balanceada", desligamentos e inabilitações nas atas da Diretoria e do Conselho, com CNPJ [H5-R1, H5-R8];
   - listas mensais de inadimplentes por tipo de liquidação [H5-R2, H5-R3];
   - processos de RJ e protestos.
   - **Antecedência:** a maioria é **reativa** (aparece junto com a RJ ou depois dela). Alguns poucos anteciparam o evento em semanas ou meses. Exemplo: a Electra pediu inabilitação voluntária como varejista em 08/01/2026 (aprovada em ata de 03/02/2026) e pediu RJ em 29/05/2026 [H5-R8, H5-R42]. **Não há evidência** de que o FA tenha antecipado os defaults de 2026 (`NÃO VERIFICADO`; exige backtest).
4. **Já existe um produto quase igual ao H5, para comercializadoras.**
   - **Central de Risco da Abraceel:** feita com o bureau **Risk3**, "especializado no mercado de energia elétrica". Monitora semanalmente 17 métricas, ampliadas para 40 em out/2026: operação balanceada, pagamento do MCP, protestos, mudança societária, processos contra administradores, pontualidade etc. O acesso é das **associadas** [H5-R28, H5-R29, H5-R30] (`CONFIRMADO`).
   - **Thunders:** publica semanalmente, com nome dos agentes, as migrações entre faixas de FA [H5-R26] (`CONFIRMADO`).
   - **Para o consumidor livre:** não encontrei produto dedicado (`NÃO VERIFICADO` como ausência).
5. **Quem paga e quanto não tem nenhuma evidência direta.**
   - **Birôs:** a Serasa vende consulta de CNPJ de R$ 29,99 a R$ 59,99 e planos de R$ 120 a R$ 270/mês [H5-R33] (`CONFIRMADO`). Esse é o "preço âncora" do substituto genérico.
   - **Concorrentes setoriais:** Risk3 e Thunders não publicam preço.
   - **O cliente mais acessível tende a ser a gestora/consultoria:** ela já faz essa diligência para vários clientes (`HIPÓTESE`). O comprador mais sofisticado (comercializadora) já é atendido pela Abraceel/Risk3.
6. **Risco jurídico.**
   - **CVM:** a Resolução CVM 9/2020 vale para classificação de risco de crédito **de emissor ou ativo do mercado de valores mobiliários** destinada a terceiros, "ainda que restrita a clientes" [H5-R12] (`CONFIRMADO`). Uma comercializadora com debêntures (ex.: Comerc [H5-R36]) cai nessa zona cinzenta. **Advogado obrigatório.**
   - **Mitigação:** só fatos com fonte, sem nota, reprodução das ressalvas oficiais da CCEE (débito "suspenso" ≠ inadimplência) e distribuição privada.
7. **Maior risco estratégico:** o "concorrente gratuito" já existe em parte. A CCEE publica FA, atas e listas; a Lei 15.269/2025 deu à CCEE o monitoramento dos associados e **a gestão de garantias do ACL** [H5-R11]; a CCEE estudou divulgar o "% de risco de default de cada varejista" [H5-R4]. A Abraceel/Risk3 ocupa o lado das comercializadoras. Sobra um nicho: **curadoria e alertas para o comprador final e a gestora**, cruzando o contrato do cliente com os sinais. É um nicho estreito e defensável só pela curadoria.

---

## 1. Dor e prejuízo concreto para o consumidor quando o fornecedor quebra

### 1.1 O que acontece, por tipo de consumidor

| Situação | O que acontece | Fonte | Status |
|---|---|---|---|
| **Consumidor agente da CCEE com contrato bilateral** (compra direto da comercializadora) | Não fica sem energia física. O risco é perder o contrato e o preço garantido e voltar ao mercado em condições piores ("desaparecer o contrato que garantia determinado preço"). | [H5-R17] (artigo de análise, 16/09/2026) | `INFERÊNCIA` (fonte secundária) |
| | A energia não entregue vira exposição ao PLD no MCP: o consumidor fica "descoberto" e liquida a diferença ao PLD. | Mecânica da contabilização (ver `01-MERCADO`, Parte A) | `INFERÊNCIA` |
| **Fornecedor em RJ** | Na Tradener, a decisão de deferimento suspendeu "pedidos de rescisão contratual", "vencimentos antecipados" e "execuções de garantias financeiras", e bloqueou a "zeragem" de posições na CCEE. O consumidor fica preso ao contrato e não consegue executar a garantia. | Cenário Energia, 22/05/2026 [H5-R21] | `INFERÊNCIA` (imprensa; decisão não lida) |
| **Fornecedor protegido por liminar** | O TJSP (proc. 2274888-48.2025.8.26.0000, decisão de 02/03/2026) manteve uma varejista em RJ habilitada na CCEE. Fundamento: o desligamento baseado só no pedido de RJ anularia o art. 52, II, da Lei 11.101/05. O consumidor continua representado por um varejista em RJ. | Migalhas [H5-R24] | `INFERÊNCIA` (imprensa jurídica) |
| **Consumidor representado por varejista** (modelo simplificado, o consumidor não acessa a CCEE) | Aparece **em nome próprio** na lista de inadimplentes do MCP, com o varejista em crise como "representante". Ref. 04/2026: pelo menos 7 consumidores com IBS-ENERGY, 4 com ELETRON, 1 com ELECTRA ENERGY e 1 com TRADENER (contagem mínima, porque linhas quebradas no PDF podem ter ficado fora). | Lista CCEE, 15/06/2026 [H5-R2] | `CONFIRMADO` (lista). A causa (o varejista não pagou pelo representado) é `INFERÊNCIA` |
| | **Desligamento e corte físico:** a CCEE determinou, "por unanimidade, o desligamento do agente FORTEFRIGO", "representado nesta Câmara pela Ecel Eletron Comercializadora de Energia S.A. – Em Recuperação Judicial", por inadimplência na Liquidação de Sanções. A CCEE comunica a distribuidora (CELPA), e o desligamento vale "a partir do primeiro dia do mês subsequente à efetivação da interrupção do fornecimento". | Ata 032ª Diretoria CCEE, 01/09/2026 [H5-R1] | `CONFIRMADO`. Não se sabe se a dívida é do consumidor ou do repasse que a Elétron não fez (`NÃO VERIFICADO`) |
| | **Prazos do corte:** a distribuidora tem de 5 a 10 dias corridos, a partir da notificação da CCEE, para suspender o fornecimento. A suspensão só pode ser cancelada até o 4º dia, com caução ou quitação. A CCEE **não pede religamento** de representado de varejista: cabe ao varejista reabilitar a unidade. | CCEE, CO 177/25, 07/03/2025 [H5-R9] | `CONFIRMADO` |
| | **Troca de fornecedor:** o consumidor precisa assinar um novo CCV com outro varejista ou voltar ao mercado cativo, depois de notificado pela CCEE. Unidades sem varejista habilitado "perdem o direito de operar no mercado livre". Para trocar, é preciso regularizar débitos. | Lead Energy (blog de gestora) [H5-R18]; eixos [H5-R51] | `INFERÊNCIA` (fonte de mercado, não normativa) |
| **Consumidor credor no MCP** | Toda inadimplência não coberta é **rateada** entre os credores. Na liquidação do MCP de set/2026, os credores receberam ~77% do devido. Dos R$ 491,55 mi em aberto, R$ 336,75 mi estavam suspensos pelo Despacho ANEEL 413/2026 e R$ 152,92 mi eram inadimplência efetiva. | Cenário Energia, 16/11/2026 [H5-R25] | `INFERÊNCIA` (imprensa sobre dado CCEE) |

### 1.2 Suprimento de Última Instância (SUI): o que diz a norma e o que falta

- **Lei 15.269, de 24/11/2025 (DOU 25/11/2025):** criou o art. 15-C (na Lei 9.074), segundo o qual o SUI é autorizado e fiscalizado pela ANEEL, responde "pelo atendimento aos consumidores no caso de encerramento da representação por agente varejista" e é remunerado por tarifas específicas. O déficit involuntário é rateado [H5-R11] (`CONFIRMADO`).
- **Decreto 13.097, de 12/08/2026 (DOU 13/08/2026), art. 6º** [H5-R10] (`CONFIRMADO`):
  - **Quem tem direito:** atendimento **emergencial e temporário** a consumidor **adimplente** do ACL "cuja representação varejista seja obrigatória".
  - **Hipóteses:** (I) resilição do contrato pelo varejista; (II) resolução por inexecução, com consumidor adimplente; (III) **desligamento** do varejista da CCEE ou sua **inabilitação** superveniente.
  - **O que fica de fora:** pendências do consumidor com a CCEE ou com o varejista não passam ao SUI.
  - **Quem presta:** exclusivamente as distribuidoras até 31/12/2030; outras pessoas jurídicas a partir de 01/01/2031.
  - **Remuneração (art. 7º):** tarifas "não inferiores" à tarifa de energia do subgrupo da distribuidora e **crescentes**, para incentivar a saída. A ANEEL pode fixar um prazo máximo, depois do qual o retorno ao ACR é compulsório.
  - **Custo sistêmico:** custos e déficit são rateados por encargo entre os consumidores do ACL.
  - **Art. 10:** a CCEE disponibiliza a relação de varejistas habilitados e uma ferramenta de comunicação sobre consumidores atendidos pelo SUI.
- **Leitura para H5** (`INFERÊNCIA`):
  1. O SUI **não protege o consumidor agente** que compra bilateralmente de comercializadora. Esse é justamente o maior comprador potencial de H5.
  2. Para o representado, o SUI é "rede de proteção cara": a tarifa é pelo menos a cativa e crescente. O prejuízo de perder o contrato barato continua existindo.
  3. Exigir **adimplência** deixa de fora justamente os consumidores que aparecem como inadimplentes por falha do representante (seção 1.1).
- **Status da regulamentação:** em ago/2026 a ANEEL indicou o SUI como prioridade da abertura da baixa tensão [H5-R45] (`INFERÊNCIA`). A decisão de 27/10/2026 tratou do Grupo A e do Open Energy. A baixa tensão ficou para a Agenda Regulatória 2026-2027 [H5-R45] (`INFERÊNCIA`). **Não encontrei resolução da ANEEL sobre o SUI publicada até 27/11/2026** (`NÃO VERIFICADO` como ausência). **Impacto:** hoje, se um varejista for desligado, vale o fluxo da REN 1.011/2022 e do PdC 1.6 (novo CCV ou retorno ao cativo). O SUI regulamentado ainda não está operando.

### 1.3 Casos documentados e magnitude

| Caso | Fato relevante para o consumidor | Fonte | Status |
|---|---|---|---|
| Crise agregada | Em jun/2026, segundo a CCEE: 10 comercializadoras em RJ, 580 contrapartes diretamente expostas, ~5,6 mil consumidores varejistas potencialmente afetados, < 2% do volume negociado | [H5-R17], [H5-R51] (ambos citam a CCEE) | `INFERÊNCIA` (dado CCEE não lido na fonte) |
| Electra | ~1.600 clientes, 17 permissionárias e 19 distribuidoras. Mediação "restrita a contratos bilaterais no mercado livre" com consumidores finais. Liminar de 22/04/2026 suspendeu as obrigações na CCEE por 60 dias. Garantias de ~R$ 140 mi venciam em 23/04 | Canal Solar, 23/04/2026 [H5-R19] | `INFERÊNCIA` (imprensa) |
| Electra (consumidor listado) | Ferramentaria JN, consumidor especial com ELECTRA ENERGY como representante, aparece com R$ 26,6 mil inadimplentes no MCP 04/2026. A própria Electra Comercializadora Varejista aparece com R$ 27,8 mi | [H5-R2] | `CONFIRMADO` |
| 2W, Boven, Diferencial | Na lista do MCP 04/2026: 2W Varejista R$ 32,0 mi, Boven Varejista R$ 9,5 mi, Diferencial R$ 1,0 mi | [H5-R2] | `CONFIRMADO` |
| 2W e Diferencial | Desligamento compulsório mantido. Diferencial com desligamento definitivo em 01/07/2026 e passivo de ~R$ 154,5 mi. A reportagem **não diz** o que aconteceu com os representados | Cenário Energia, 11/06/2026 [H5-R16] | `INFERÊNCIA` |
| Boven | Cortou a operação de ~1,5 GWm para ~20 MWm e rompeu mais de 300 contratos de longo prazo antes do desligamento (mar/2026) | [H5-R17], [H5-R18] | `INFERÊNCIA` (secundária) |
| Gold | ANEEL rescindiu CCEARs e contratos bilaterais por descumprimento de entrega de 232 MWm e aplicou multa de R$ 5,8 mi | Cenário Energia, 30/06/2026 [H5-R44] | `INFERÊNCIA` |
| Dívidas declaradas | 2W ~R$ 2,4 bi; Tradener R$ 1,69 bi; Electra ~R$ 1,61 bi; Elétron ~R$ 1,17 bi; Gold > R$ 1,1 bi (MtM); Safira ~R$ 357,5 mi. Há números divergentes: Tradener alegou exposição de R$ 5,4 bi na cautelar | [H5-R17], [H5-R22] | `INFERÊNCIA` |

**Lacuna crítica:** não encontrei **nenhum caso nominal e quantificado de consumidor livre** que tenha recontratado às pressas, com o preço pago, nem ação judicial de consumidor contra comercializadora quebrada (`NÃO VERIFICADO`). O único número de custo de recontratação é **ilustrativo**: uma indústria de 100.000 MWh/ano a R$ 195/MWh que recompra a R$ 300/MWh perde R$ 10,5 mi/ano [H5-R17] (`HIPÓTESE` do autor citado, não é caso real). **Consequência:** a disposição a pagar de H5 precisa ser validada em entrevista. A dor pode ser grande para poucos e pequena para muitos.

---

## 2. Sinais públicos: onde estão, formato e se antecipam o default

### 2.1 Inventário por sinal

**(a) Fator de Alavancagem (FA) — Monitoramento Prudencial**
- **Base normativa:** a REN 1.072/2023 aprovou o Manual do Monitoramento Prudencial. O Manual prevê a "divulgação do FA de todos os agentes monitorados no site da Câmara". Assim, "qualquer interessado em negociar com os agentes pode acessar publicamente o resultado do FA calculado pela CCEE" [H5-R6] (`CONFIRMADO`, relatório CCEE de 30/11/2024).
- **Conteúdo divulgado:** a divulgação traz um campo que sinaliza **PLA negativo** [H5-R6] (`CONFIRMADO`).
- **Periodicidade:** semanal para geradores e comercializadores; mensal para consumidores [H5-R6] (`CONFIRMADO`).
- **Painel:** a CCEE criou um "painel interativo, online e público" de FA enviados e pendentes [H5-R6] (`CONFIRMADO`).
- **Mudanças em curso:**
  - Pela proposta da CP 33/2025, o FA **por vértice** (mês a mês) fica restrito ao agente e à CCEE; o FA agregado (M+0 a M+6) "continuará a ser divulgado" [H5-R6] (`CONFIRMADO` como proposta).
  - A ANEEL dispensou consumidores abaixo de 9 MWm até a nova REN [H5-R14] (`INFERÊNCIA`).
- **Limitação:** o FA é **autodeclarado**, com verificação amostral aleatória de até 10% dos agentes [H5-R6] (`CONFIRMADO`).
- **Leitura:** é o único indicador público **prospectivo**, porque mede a exposição dos próximos meses sobre o PL ajustado.
- **Republicação privada:** a Thunders republica semanalmente as faixas FA 0 a FA 5 com a sigla de cada agente. Na semana de 01/10/2026: 506 monitorados, 351 em FA 0 [H5-R26] (`CONFIRMADO`).

**(b) Operação balanceada**
- **O que é:** deliberação da Diretoria da CCEE que proíbe novos registros de contratos. As operações só podem ser registradas "de forma balanceada, com a prévia verificação do balanço energético a fim de evitar exposição financeira negativa" (PdC 1.7, premissa 3.10.3).
- **Onde e como aparece:** em ata pública, com razão social e CNPJ. Em 01/09/2026: Spot Energia, Mega Comercializadora (com menção a processo sob segredo de justiça), Universal Com, Thopen e quatro CNPJs da Safira [H5-R1] (`CONFIRMADO`).
- **Outros casos:**
  - Tradener, em 17/04/2026 [H5-R22] (`INFERÊNCIA`);
  - Pontoon, Pierp, Electra Varejista e Continental, em ~10/06/2026 [H5-R23] (`INFERÊNCIA`).
- **Não é declaração de insolvência:** a operação balanceada "não deve ser tratada como sinônimo de insolvência" [H5-R17].

**(c) Desligamentos, inabilitações e contestações de penalidade (atas)**
- **Onde:** atas e sumários da Diretoria e do Conselho de Administração, em PDF com URL em `ccee.org.br/documents/80415/...`.
- **O que listam:**
  - procedimentos de desligamento por descumprimento;
  - inabilitação voluntária ou compulsória de varejista;
  - contestações de **penalidade por insuficiência de lastro**;
  - operacionalização de decisões judiciais;
  - homologação de alterações societárias de comercializadoras [H5-R1, H5-R8] (`CONFIRMADO`).
- **Exemplos:**
  - Elétron (em RJ) contestando penalidade por insuficiência de lastro [H5-R1].
  - Electra pediu inabilitação varejista em 08/01/2026, aprovada em 03/02/2026 [H5-R8].
  - Agente Tipo 2 sem demonstrações auditadas levado a inabilitação compulsória (sumário de 21/07/2026) [H5-R49] (`INFERÊNCIA`).

**(d) Listas de inadimplentes por liquidação**
- **Cobertura:** listas mensais separadas para MCP, Penalidades, Energia de Reserva e Reserva de Capacidade.
- **Formato:** PDF com colunas `cnpj | agente | razão social | classe | representante | inadimplência (R$) | observação`.
- **Defasagem:** cerca de 2 meses. Exemplos: MCP ref. 04/2026 publicada em 15/06/2026; Penalidades ref. 06/2026 publicada em 14/07/2026 [H5-R2, H5-R3] (`CONFIRMADO`).
- **Ressalva oficial, a reproduzir sempre:** a lista inclui débitos "cuja exigibilidade está suspensa em virtude de decisões judiciais, ato regulatório ou ato administrativo", e a publicação "não necessariamente acarreta sanções". Agente que caucionou o débito continua na lista [H5-R2] (`CONFIRMADO`).
- **Valor para H5:** traz o **representante** de cada consumidor, o que permite mapear a carteira de cada varejista em crise.

**(e) Classificação Tipo 1 / Tipo 2 e "sem demonstrações"**
- **Fatos de 2026:** 317 agentes Tipo 1, 121 Tipo 2 e **77 sem demonstrações** (eram 126 em 2024).
- **Consequência de não entregar:** quem não entrega não pode pedir reclassificação durante o ano.
- **O que pode mudar:** a CP 33/2025 propõe envio **semestral** de demonstrações, o que pode substituir a divisão Tipo 1/Tipo 2 [H5-R15] (`INFERÊNCIA`, imprensa).
- **O que não encontrei:** a lista nominal publicada pela CCEE (`NÃO VERIFICADO`).
- **Divergência de valores:** a reportagem cita PL de R$ 11,59 mi como limite do Tipo 1, mas `01-MERCADO` registra esse valor como **PL do varejista**. **Pendente**, ler a REN 1.014/2022.

**(f) Recuperação judicial, falência e liminares**
- **Como aparecem:** em processos públicos nos tribunais estaduais. As varas especializadas encontradas foram:
  - 3ª Vara de Falências e RJ de SP (2W, proc. 1053172-54.2025.8.26.0100);
  - 1ª e 2ª Varas de Falências e RJ de Curitiba (Electra, Tradener);
  - 1ª Vara Regional Empresarial de Campinas (Gold) [H5-R1, H5-R19, H5-R21, H5-R44].
- **Acesso:** e-SAJ e PROJUDI dão consulta pública por número ou nome. A API pública **DataJud (CNJ)** traz metadados de processos [H5-R50] (`INFERÊNCIA`). Há também APIs pagas de terceiros (Escavador, Jusbrasil) (`NÃO VERIFICADO` preço).
- **Restrição:** processos **sob segredo de justiça** existem (caso Mega [H5-R1]) e não devem ser acessados.

**(g) Protestos**
- **Consulta:** gratuita por CNPJ na CENPROT/IEPTB (pesquisaprotesto.com.br), com login gov.br.
- **API:** só de terceiros (Infosimples), paga e com limite diário por login [H5-R37] (`INFERÊNCIA`).
- **Uso no setor:** a métrica Abraceel/Risk3 usa "protestos e pendências financeiras que somem mais de 50% do capital social" [H5-R28].

**(h) Demonstrações financeiras publicadas**
- **Quem publica:** S.A. publicam, conforme a Lei 6.404 e a Lei 13.818/2019. Ltda. em geral não. Grande parte das comercializadoras é Ltda. (`INFERÊNCIA`).
- **Onde encontrar:** RI de empresas com dívida listada (ex.: Comerc) e a Central de Balanços (SERPRO), que apareceu na busca (`NÃO VERIFICADO` cobertura).
- **Lacuna:** a CCEE recebe as demonstrações para classificar Tipo 1/Tipo 2, mas **não encontrei** publicação delas (`NÃO VERIFICADO`).

**(i) Ratings de agências**
- **Único encontrado:** Moody's Local, para emissões de debêntures da Comerc (AA-.br em revisão para elevação, ago/2024) [H5-R36] (`INFERÊNCIA`, snippet de PDF da agência).
- **Sem rating encontrado:** Tradener, Electra, Elétron, IBS, 2W, Gold, Diferencial e Safira. Para S&P não achei nenhuma comercializadora independente (`NÃO VERIFICADO` como ausência).
- **Leitura:** ratings cobrem quase só grupos com dívida em mercado (`INFERÊNCIA`). São irrelevantes para a cauda que quebrou.

**(j) Diário Oficial**
- **O que se encontra:**
  - outorgas e revogações da ANEEL (ex.: outorga da Gold revogada [H5-R44]);
  - despachos que suspendem débitos (Despacho 413/2026 [H5-R25]);
  - editais da Lei 11.101 nos DJE.
- **Acesso:** público e gratuito. Busca estruturada exige raspagem ou um agregador (`INFERÊNCIA`).

**(k) Dados abertos CCEE**
- **O que se sabe:** o portal existe e tem datasets por contexto de negócio, com ampliações em 2024 [H5-R52] (`INFERÊNCIA`).
- **O que não deu para confirmar:** não consegui verificar se há dataset de agentes, garantias ou inadimplência. O acesso automatizado foi bloqueado (`NÃO VERIFICADO`).
- **Impacto:** o MVP dependeria de PDFs e de um processo manual ou semiautomático, respeitando a política de acesso da CCEE.

**(l) O que a CCEE planeja divulgar**
- **Proposta antiga sobre varejistas:** em 14/03/2024, o Comitê de Implementação do Monitoramento Prudencial discutiu duas propostas:
  - (1) "Divulgação específica do risco de crédito", com "abertura do percentual de risco de default de cada varejista", publicado com o FA;
  - (2) internalizar o risco no FA, com um "FA de crédito" "sem divulgação, mas de acesso ao agente e à CCEE" [H5-R4] (`CONFIRMADO`).
- **Decisão sobre essa proposta:** não encontrei qual alternativa foi adotada (`NÃO VERIFICADO`).
- **CP 33/2025 (ANEEL):**
  - Ficou aberta de 06/11 a 22/12/2025. Recebeu 43 contribuintes e 519 contribuições; o tema mais citado foi "risco de crédito", com 96 [H5-R5] (`CONFIRMADO`).
  - Em 22/01/2026, a CCEE ainda analisava as contribuições e aguardava uma CP específica do processo sancionador [H5-R5] (`CONFIRMADO`).
  - Até 27/11/2026, **não encontrei a REN definitiva** publicada; só a cautelar de maio/2026 [H5-R14] (`INFERÊNCIA`).
- **Lei 15.269/2025:** atribui à CCEE "o monitoramento dos respectivos associados" e "a gestão de garantias de contratos de compra e venda no ambiente de contratação livre" [H5-R11] (`CONFIRMADO`). É a base legal para a CCEE oferecer, no futuro, aquilo de que H5 depende.

### 2.2 Os sinais antecipam ou só reagem? Linha do tempo dos casos de 2026

| Caso | Primeiro sinal público encontrado | Data | Evento de crédito (RJ, liminar, desligamento) | Antecedência |
|---|---|---|---|---|
| Electra | Pedido de inabilitação voluntária como varejista (ata do CAd) [H5-R8] | 08/01/2026 (pedido); 03/02/2026 (ata) | Liminar em 22/04/2026; RJ pedida em 29/05/2026 [H5-R19, H5-R42] | **~2,5 a 4 meses** (`INFERÊNCIA`: o pedido é ambíguo, pode ser só estratégia) |
| Gold | Proposta de recuperação **extrajudicial** (2,5% da dívida, até R$ 25 mi) sem adesão; documento de set/2025 no site da Agência iNFRA | ~set/2025 | RJ deferida em fev/2026 [H5-R44] | **~5 meses** (`INFERÊNCIA`) |
| Tradener | Cautelar pré-RJ (suspensão de execuções por 60 dias) | 09/04/2026 | Operação balanceada em 17/04; RJ deferida em 22/05 [H5-R22, H5-R21] | O primeiro sinal **já é o evento** (reativo) |
| Safira | Mediação com credores | 28/08/2026 (ver `03-CONCORRENCIA`, CON-R33) | Operação balanceada em 01/09/2026 [H5-R1] | Reativo (a CCEE agiu 4 dias depois) |
| IBS/Gama | Colapso da carta-fiança do Banco Master (gatilho externo) | ~abr/2026 | RJ em ~15/04/2026 [H5-R43] | Gatilho exógeno: um sinal de **qualidade da garantia** (emissor da fiança) teria ajudado (`HIPÓTESE`) |
| Boven | Cortou a operação e rompeu mais de 300 contratos [H5-R17] | antes de mar/2026 (data exata NV) | Desligamento em mar/2026 | Potencialmente antecipatório, mas o sinal é de mercado (contrapartes), não público estruturado (`INFERÊNCIA`) |
| Elétron | RJ pedida (CCEE credora de R$ 334,8 mi) [H5-R20] | jan/2026 | — | O sinal é o próprio evento |

**Conclusão (`INFERÊNCIA`):**
1. Os sinais **estruturados** da CCEE (operação balanceada, listas de inadimplentes, desligamento) chegam **junto ou depois** do evento de crédito. Servem para **reagir rápido** (avisar o cliente, acionar cláusulas, preparar a recontratação), não para prever.
2. Sinais **fracos** antecederam o evento em meses em alguns casos: inabilitação voluntária, tentativa de extrajudicial, ruptura de contratos, possivelmente FA alto e penalidade por insuficiência de lastro. Exigem curadoria e têm muitos falsos positivos.
3. Se o **FA público** antecipou os defaults é a pergunta-chave e está `NÃO VERIFICADO`. Teste barato: reconstruir a série de FA das 10 empresas em RJ (arquivo semanal da Thunders [H5-R26] e painel da CCEE) e ver se estavam em FA 3 a 5 meses antes. Se sim, H5 tem um "motor" gratuito e simples. Se não, o valor de H5 fica limitado à reação rápida e à curadoria.

### 2.3 Tabela de sinais públicos

| Sinal | Fonte | Formato | Frequência | Antecedência ao default | Acesso legal |
|---|---|---|---|---|---|
| Fator de Alavancagem por agente (+ flag de PLA negativo) | CCEE, painel do Monitoramento Prudencial [H5-R6]; republicado pela Thunders [H5-R26] | Painel web e tabelas (CCEE); post de blog e planilha (Thunders) | Semanal (comercializadoras e geradores); mensal (consumidores) | **Potencialmente antecipatório** (prospectivo M+0 a M+6), mas autodeclarado. Eficácia em 2026 `NÃO VERIFICADO` | Público por norma (REN 1.072/2023). Acesso automatizado à CCEE bloqueado: coleta manual ou parceria |
| Operação balanceada | Atas da Diretoria CCEE [H5-R1] | PDF com razão social e CNPJ | Semanal (reuniões da Diretoria) | Reativo a coincidente (em geral junto com a cautelar ou a RJ) | Público |
| Desligamento / inabilitação / contestação de penalidade de lastro | Atas e sumários da Diretoria e do CAd [H5-R1, H5-R8, H5-R49] | PDF | Semanal | Inabilitação voluntária: **semanas a meses** (fraco). Desligamento: reativo | Público |
| Lista de inadimplentes (MCP, penalidades, reserva) | CCEE [H5-R2, H5-R3] | PDF tabular (CNPJ, classe, representante, R$) | Mensal, com defasagem de ~2 meses | Reativo. Mostra **consumidores afetados** por representante | Público. Reproduzir a ressalva de "exigibilidade suspensa" |
| Tipo 1 / Tipo 2 / sem demonstrações | CCEE (lista nominal NV) [H5-R15] | NV | Anual (proposta: semestral) | Fraco: "sem demonstrações" é sinal de governança | Público em agregado; lista nominal `NÃO VERIFICADO` |
| Recuperação judicial / falência / cautelar | Tribunais (e-SAJ TJSP, PROJUDI TJPR), DJE, DataJud [H5-R50] | HTML, PDF e API (DataJud) | Contínua | Cautelar pré-RJ: dias a semanas antes do deferimento. RJ: é o evento | Público, salvo segredo de justiça |
| Recuperação extrajudicial / mediação com credores | Imprensa; tribunais (homologação) | Texto | Eventual | **Meses** (Gold) | Público quando homologada ou noticiada |
| Protestos | CENPROT/IEPTB (pesquisaprotesto.com.br) [H5-R37] | Web, com login gov.br; API de terceiros | Contínua | Fraco a moderado (`HIPÓTESE`) | Consulta pública gratuita; automação via terceiros |
| Demonstrações financeiras | RI (S.A.), Central de Balanços | PDF | Anual | Defasado (exercício anterior) | Público quando publicado |
| Ratings | Moody's Local, Fitch, S&P [H5-R36] | PDF | Eventual | Antecipatório quando existe, mas **quase nenhuma** comercializadora tem | Público (comunicados); relatórios completos pagos |
| Outorga revogada / rescisão de contratos pela ANEEL | DOU, ANEEL [H5-R44] | Texto | Eventual | Reativo | Público |
| Despachos que suspendem débitos | ANEEL (ex.: Despacho 413/2026) [H5-R25] | Texto | Eventual | Contexto: explica débitos "suspensos" | Público |
| Liquidação do MCP agregada (adimplência, rateio) | CCEE / imprensa [H5-R25] | Texto e PDF | Mensal | Termômetro sistêmico, não individual | Público |

---

## 3. Substitutos e concorrentes

| Ator | O que entrega para o problema H5 | Preço público | Status |
|---|---|---|---|
| **Abraceel, Central de Risco (com Risk3)** | Plataforma online para **associadas**, "em parceria com o bureau de crédito especializado no mercado de energia elétrica, Risk 3". Monitora 17 métricas das contrapartes (abr/2026), ampliadas para 40 (out/2026). Métricas citadas: mudança societária; ações contra administradores; condenações setoriais; obrigações com CCEE e ANEEL; **operação balanceada**; pagamento do MCP; protestos acima de 50% do capital social; regularidade fiscal; pontualidade de pagamento (alerta abaixo de 80%) [H5-R28, H5-R29, H5-R30] | Incluído na associação (valor da anuidade NV). Acesso de não associados e de consumidores `NÃO VERIFICADO` | `CONFIRMADO` (Abraceel) |
| **Abraceel, autorregulação e selo** | Código de conduta com 13 práticas monitoradas e selo para empresas sob autorregulação. Inclui cumprimento da liquidação do MCP e "apresentação de garantias nos prazos e valores". Sanções previstas a partir de abr/2027 [H5-R31, H5-R30] | — | `INFERÊNCIA` (imprensa + Abraceel). O selo não atesta solvência |
| **Risk3** | Bureau de "análise de risco e crédito para decisões comerciais, com foco em contrapartes". Produtos: Xpress, Report, **Radar** (monitoramento de contrapartes), Dossiê. Logos de Eletrobras, AES e Petrobras [H5-R32] | Não público | `CONFIRMADO` (site). **É o concorrente direto mais próximo de H5** |
| **Thunders** | Relatório semanal público com as faixas de FA de cada agente e as migrações entre faixas. Banner para "ter acesso a todas as faixas e mudanças". Também vende ETRM para comercializadoras e varejistas (ver `03`) [H5-R26, H5-R27] | Não público | `CONFIRMADO` |
| **CCEE (monitoramento prudencial)** | FA público, operação balanceada, listas de inadimplentes, desligamentos. Futuramente, gestão de garantias do ACL (Lei 15.269) [H5-R6, H5-R11] | Gratuito | `CONFIRMADO` |
| **BBCE** | Gestão de limites bilaterais (ver `03`). Com o Bradesco, **colateral com chamada diária**, opcional, a partir do início de 2027, só para contratos de prazo mais curto [H5-R35] | Emolumentos (ver `03`) | `INFERÊNCIA` (imprensa) |
| **N5X** | Busca câmara de compensação (contraparte central), com meta no 2º semestre de 2027, sujeita ao BCB [H5-R35] | — | `INFERÊNCIA`. Se vingar, **reduz a dor** de H5 no atacado |
| **B3, Plataforma de Energia / Selo de Confiança** | Regimento de 2021 com "Modelo de Riscos" e exigência de política de gerenciamento de riscos dos agentes (liquidez e crédito) [H5-R39] | NV | Regimento `CONFIRMADO`; status atual `NÃO VERIFICADO` |
| **Serasa Experian** | Consulta de CNPJ: Intermediária (score, dívidas, protestos, falências, ações) e Completa (+ societário). Monitoramento de CNPJ citado sem preço [H5-R33] | R$ 29,99 (Sob Medida, a partir de); R$ 59,99 (Decisão Completa); planos de R$ 120 e R$ 270/mês; pacotes de R$ 119,99 a R$ 1.099,99 | `CONFIRMADO` (página consultada em 27/11/2026) |
| **Boa Vista (Equifax)** | Relatórios PJ (Define, Acerta) | Sem tabela oficial. Revendedor DirectD: R$ 21,00 por consulta "Define Limite Positivo PJ" [H5-R34] | `NÃO VERIFICADO` (preço de revendedor) |
| **Quod** | Não pesquisado a fundo; birô de cadastro positivo | NV | `NÃO VERIFICADO` |
| **Seguro de crédito (Aon e outras)** | A Aon oferece seguro de crédito para carteiras de comercializadoras e diz não haver "dados consolidados sobre a inadimplência das comercializadoras" (2024) [H5-R40] | Não público | `INFERÊNCIA` |
| **Gestoras e consultorias** | Recomendam análise de crédito do fornecedor e monitoramento permanente (ex.: Lux Energia [H5-R41]). Clarke, Esfera e Comerc fazem a seleção de fornecedores (ver `03`). Não encontrei metodologia publicada | Embutido no fee de gestão | `INFERÊNCIA` |
| **CTRM/ETRM com módulo de crédito** | Thunders (exposição/book). Fornecedores internacionais (Allegro, ION, Brady etc.) costumam ter módulo de *credit risk*, mas não verifiquei a oferta no Brasil | NV | `NÃO VERIFICADO` |

**Algum produto já faz exatamente H5?**
- **Para comercializadoras como compradoras:** sim, quase. A Abraceel/Risk3 é "monitoramento semanal de métricas de contrapartes do mercado de energia" (`CONFIRMADO`).
- **Para consumidor livre e gestora:** não encontrei (`NÃO VERIFICADO` como ausência). O que existe é a gestora fazendo diligência de forma artesanal, mais o birô genérico.
- **Diferencial possível de H5** (`HIPÓTESE`): cruzar (i) o **contrato e a carteira do cliente** (quem é seu fornecedor, volume, garantia recebida, emissor da fiança) com (ii) os sinais setoriais. Daí sairiam alertas acionáveis ("seu fornecedor entrou em operação balanceada; cláusula X; prazo Y"). Nem a Abraceel nem os birôs fazem esse cruzamento.

---

## 4. Quem pagaria e quanto

| Segmento | Gatilho de compra | Alternativa atual | Evidência de disposição a pagar | Status |
|---|---|---|---|---|
| **Gestoras/consultorias de energia** (atendem centenas de clientes) | Escolher fornecedor para o cliente e responder ao cliente quando um fornecedor quebra; risco reputacional | Diligência interna + birô | Nenhuma direta. Discurso público de "monitoramento técnico permanente" [H5-R41] | `HIPÓTESE`: **primeiro pagante mais provável** (um contrato cobre muitos consumidores; compra recorrente) |
| **Consumidor livre agente** (CFO/compras de indústria) | Renovação de contrato; notícia de RJ; auditoria e compliance | Gestora, birô, intuição | Nenhuma. A dor é episódica e concentrada em 2026 | `HIPÓTESE` |
| **Consumidor varejista** (pequeno) | Ser listado como inadimplente; ameaça de corte | Comparador oficial futuro (Open Energy); gestora | Ticket baixo. A proteção principal será o SUI | `INFERÊNCIA`: mau alvo para assinatura |
| **Comercializadoras e geradores** (avaliam contrapartes) | Limite de crédito bilateral, originação de varejo | **Abraceel/Risk3**, BBCE (limites), Thunders, área de risco interna | Pagam (Risk3 tem clientes do setor [H5-R32]), mas o espaço já está ocupado | `CONFIRMADO` que existe oferta; `INFERÊNCIA` de que é difícil deslocar |
| **Bancos e seguradoras** (fiança, seguro garantia, seguro de crédito) | Emitir garantia para comercializadora ou consumidor | Análise de crédito própria, birôs, Risk3 | A Aon declara falta de dados consolidados [H5-R40]. O colateral BBCE/Bradesco virá em 2027 [H5-R35] | `HIPÓTESE`: comprador de **dados curados**, ciclo de venda longo |

**Evidência de preço:**
- **Única confirmada:** birô genérico (Serasa), com R$ 30 a R$ 60 por consulta ou R$ 120 a R$ 270/mês [H5-R33] (`CONFIRMADO`).
- **Sem preço público:** Risk3, Thunders e Abraceel (anuidade). Não encontrei **relatório setorial pago** com preço publicado sobre risco de comercializadoras (`NÃO VERIFICADO`).
- **O que o preço base de `05-ECONOMIA` pressupõe:** R$ 1.200/mês fica **5 a 10 vezes acima do birô** e precisa ser justificado pela curadoria setorial e pelos alertas vinculados a contrato (`HIPÓTESE` não testada).

---

## 5. Risco jurídico de um serviço privado que avalia empresas (pontos para advogado, não é parecer)

| Tema | O que a norma diz (fato) | Ponto que exige advogado | Mitigação candidata |
|---|---|---|---|
| **Agências de rating (CVM)** | Res. CVM 9/2020, art. 1º: "classificação de risco de crédito" é "opinar sobre a qualidade de crédito de um emissor de títulos de participação ou de dívida, de uma operação estruturada, ou qualquer ativo financeiro emitido no mercado de valores mobiliários". O parágrafo único aplica a norma às classificações "destinadas à publicação, divulgação ou distribuição a terceiros, ainda que restrita a clientes". O art. 2º torna a atividade privativa de agência registrada [H5-R12] (`CONFIRMADO`). A Res. CVM 251/2026 alterou a 9/2020 (`NÃO VERIFICADO` o conteúdo) | (i) Uma avaliação de **comercializadora como contraparte comercial** fica fora do "mercado de valores mobiliários"? (ii) E se a avaliada for **emissora de debêntures** (ex.: Comerc [H5-R36])? (iii) Um "score" ou "semáforo" equivale a "opinar sobre qualidade de crédito"? (iv) Efeito da Res. 251/2026 | Não emitir nota, score ou rating. Apresentar **fatos datados com fonte** ("em 01/09/2026 a CCEE deliberou operação balanceada"). Não opinar sobre títulos. Termo de uso explícito: "não é classificação de risco de crédito" |
| **Responsabilidade civil e dano à imagem de PJ** | Código Civil, arts. 186, 187 e 927; Súmula 227/STJ (pessoa jurídica pode sofrer dano moral) (`NÃO VERIFICADO` nesta sessão, texto não relido) | Divulgar "inadimplente" quando a exigibilidade está suspensa (a CCEE alerta para isso [H5-R2]; 68,5% do saldo em aberto de set/2026 estava suspenso [H5-R25]) pode ser **informação inexata**. Rotular operação balanceada como insolvência (a CCEE e analistas dizem que não é [H5-R17]) também | Reproduzir literalmente a ressalva oficial. Sempre separar "inadimplência efetiva" de "suspensa". Linguagem factual, sem adjetivos. Canal de contestação e correção com prazo. Log de versão de cada fato. Seguro de responsabilidade profissional (E&O) |
| **Distribuição** | — | Publicar em site aberto aumenta exposição e alcance do dano. Privada também é "distribuição a terceiros" para a CVM | Distribuição **privada a assinantes** sob contrato e confidencialidade. Nada de ranking público de "piores comercializadoras" |
| **LGPD (sócios e administradores PF)** | Lei 13.709/2018: bases como legítimo interesse e **proteção do crédito** (art. 7º, IX e X); dados tornados manifestamente públicos (art. 7º, §4º) (`NÃO VERIFICADO` nesta sessão, texto não relido) | Monitorar "ações civis, criminais e trabalhistas contra administradores" (métrica da Abraceel [H5-R28]) envolve dados de **PF**, inclusive dado criminal, que é sensível em sentido amplo | Escopo inicial **só PJ (CNPJ)**, sem dados de PF. Se incluir PF: RIPD, base legal documentada, minimização, retenção limitada, atendimento a titulares, encarregado |
| **Cadastro positivo / bancos de dados de crédito** | Lei 12.414/2011 com LC 166/2019; Res. CMN 4.737/2019 exige registro de gestor de banco de dados no BCB, com diretor responsável. Fonte jornalística de 2019 cita PL mínimo de R$ 100 mi [H5-R38] (`NÃO VERIFICADO` o valor) | Montar **histórico de adimplemento** (pontualidade de pagamento) pode caracterizar banco de dados regulado. Usar dados de birô exige respeitar os termos do birô | Não formar histórico de pagamentos próprio. Usar apenas atos públicos (CCEE, tribunais, DOU). Licenciar dados de birô dentro do contrato do birô |
| **Termos de uso e acesso a fontes** | A CCEE bloqueia acesso automatizado ("acesso bloqueado por não atender às políticas de segurança") (`CONFIRMADO`, resposta HTTP de 27/11/2026). Há processos em segredo de justiça [H5-R1] | Raspagem contra a política do site; republicação de conteúdo da Thunders ou Abraceel | Coleta manual ou acordo formal com a CCEE. Nunca acessar processo em segredo. Citar, não copiar, conteúdo de terceiros |
| **Exercício de atividade regulada** | — | Recomendar "troque de fornecedor" ou indicar um fornecedor pode aproximar o serviço de consultoria ou intermediação (ver H1/H4) | Entregar informação e alertas; a decisão é do cliente; sem comissão de fornecedor (conflito de interesse) |

---

## 6. Lacunas e pendências (com impacto)

1. **Backtest do FA:** falta a série histórica do FA das empresas que entraram em RJ. **Impacto:** decide se H5 pode **antecipar** ou só **reagir**. Ação: coletar o arquivo semanal da Thunders (jul a out/2026 [H5-R26]) e o painel da CCEE (manual).
2. **Caso real de consumidor prejudicado, com valores:** `NÃO VERIFICADO`. **Impacto:** sem ele, a dor do comprador final segue anedótica. Ação: entrevistar 5 gestoras e 5 consumidores agentes que eram clientes de Tradener, Electra ou IBS.
3. **Acesso de não associados e consumidores à Central de Risco Abraceel/Risk3, e preço da Risk3:** `NÃO VERIFICADO`. **Impacto:** se a Abraceel abrir para consumidores, o espaço de H5 encolhe muito.
4. **REN definitiva do monitoramento prudencial (CP 33/2025):** não encontrada. **Impacto:** pode ampliar a divulgação (semestral de demonstrações, PLA) ou restringi-la (FA por vértice só para o agente).
5. **Regulamentação do SUI pela ANEEL:** não encontrada. **Impacto:** muda o tamanho da dor dos varejistas.
6. **Lista nominal Tipo 1/Tipo 2/sem demonstrações:** não localizada. Há também a divergência sobre o PL de R$ 11,59 mi (Tipo 1 × varejista).
7. **Catálogo de dados abertos CCEE:** bloqueado para acesso automatizado. Não sei se existem datasets de agentes, garantias ou inadimplência.
8. **Preços de Boa Vista, Quod, Escavador e Jusbrasil e de seguro garantia ou fiança para contratos de energia:** `NÃO VERIFICADO`.
9. **Status do Selo de Confiança da B3** e eventual classificação de risco de agentes: `NÃO VERIFICADO`.
10. **Res. CVM 251/2026** (altera a 9/2020): conteúdo não lido. Advogado.

---


## 7. Referências

Ver `../REFERENCIAS.md`, seção H5.
