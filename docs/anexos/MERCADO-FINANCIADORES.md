# Anexo: bancos, seguradoras e outros financiadores como público do radar de risco de fornecedores

**Data da pesquisa:** 27/11/2026. Só pesquisa na web; ninguém foi contatado.

**Rótulos usados:**
- `CONFIRMADO`: li a fonte primária ou a matéria inteira nesta sessão.
- `INFERÊNCIA`: a informação vem de um trecho de busca, de fonte secundária ou de dedução minha.
- `NÃO VERIFICADO`: não encontrei a informação, ou o site bloqueou o acesso.

**Relação com o anexo H5:** este anexo complementa `H5-RISCO-CONTRAPARTE.md`. As fontes H5-R* daquele anexo são citadas só quando reaproveitadas.

---

## Resumo

**Veredito: os financiadores são um público maior? INCERTO.** Tendem a ser um público **menor em número**. Podem ser **maiores em valor por contrato**, mas não há evidência de que paguem por um produto setorial.

**Por quê:**

1. **A exposição existe e tem valores públicos.**
   - Na RJ da Tradener, três dos maiores credores são instituições financeiras ou ligadas a elas: Atlas Energia (R$ 132,37 mi), UBS Brasil Corretora (R$ 92 mi) e Bradesco (R$ 62,6 mi) [MF-R1] (`CONFIRMADO`).
   - Na RJ da Elétron aparecem a trading do Banco ABC Brasil (R$ 176 mi), o Banco do Nordeste (R$ 109 mi), a trading do BTG Pactual (R$ 53 mi) e o Bradesco (R$ 31 mi) [MF-R2] (`CONFIRMADO`).
   - Fundos estruturados pelo Credit Suisse com debêntures da 2W Ecobank e da Rio Alto perderam cerca de R$ 1,6 bi [MF-R19] (`INFERÊNCIA`, imprensa). A RJ da 2W é de 2025, não de 2026.
   - Não achei **nenhum caso público de seguradora acionada** em seguro garantia de comercializadora (`NÃO VERIFICADO`).
2. **Parte relevante dessa exposição já está "do lado das comercializadoras".** UBS, BTG e ABC aparecem como credores por meio das suas **tradings de energia** [MF-R1, MF-R2]. Essas tradings são agentes do mercado e concorrem com comercializadoras. Por isso tendem a já usar a Central de Risco da Abraceel/Risk3 ou ter área de risco própria (`INFERÊNCIA`).
3. **O público "novo" de fato é pequeno:**
   - seguradoras de seguro garantia e de crédito com apetite por energia;
   - áreas de crédito corporativo dos bancos que emitem fiança;
   - poucos FIDCs e gestoras de crédito com lastro em contratos de energia.

   A ordem de grandeza é de **dezenas** de compradores, não centenas (`INFERÊNCIA`, ver seção 4).
4. **Sinais de disposição a pagar são indiretos:**
   - a Aon (corretora de seguros) disse em 2024 que **não há dados consolidados** sobre a inadimplência de comercializadoras [MF-R11];
   - a seguradora Newe usou o Selo de Confiança da B3 para **ampliar limites** de seguro garantia [MF-R10] (2021);
   - a AXA lançou um seguro garantia para compra e venda de energia em abr/2026 [MF-R8].

   Não achei **nenhum preço público** de produto setorial vendido a esse público (`NÃO VERIFICADO`).
5. **Riscos de venda:**
   - ciclo de venda longo e due diligence de fornecedor exigida pelos bancos (`INFERÊNCIA`);
   - risco de a nota ou o score ser enquadrado na Resolução CVM 9/2020 quando o avaliado emite valores mobiliários [MF-R28] (alterada pela Resolução CVM 251/2026, em vigor a partir de 01/12/2026 [MF-R29]);
   - mais infraestrutura concorrente a caminho: colateral BBCE/Bradesco no início de 2027, contraparte central da N5X no 2º semestre de 2027 [MF-R12] e gestão de garantias do ACL atribuída à CCEE pela Lei 15.269 [MF-R13].

**Recomendação (`INFERÊNCIA`):** não trocar o público inicial. Tratar seguradoras de garantia e de crédito como **segundo segmento a validar**. O produto para elas seria um feed de eventos com fonte por CNPJ tomador, não uma nota de crédito. A validação seria com 3 a 5 subscritores, fora do escopo desta pesquisa.

---

## 1. Mapa de exposição

| Ator | Como fica exposto à comercializadora | Evidência | Rótulo |
|---|---|---|---|
| **Bancos emissores de fiança ou carta de crédito** | Garantem a comercializadora (tomadora) perante o comprador ou o vendedor de energia. Se a comercializadora quebra, o banco paga e vira credor | Caso IBS: uma carta-fiança do Banco Master emitida a favor da holding do grupo perdeu valor com a liquidação do banco. Segundo a empresa, uma nova garantia em termos parecidos "não se mostra viável no ambiente atual de mercado", porque os bancos recuaram [MF-R3] | `CONFIRMADO` (matéria lida). O valor da fiança não foi divulgado |
| **Bancos credores diretos (financiamento) e tradings de bancos** | Empréstimos, financiamento de projetos e contratos de energia via trading própria | Tradener: UBS Brasil Corretora R$ 92 mi e Bradesco R$ 62,6 mi [MF-R1]. Elétron: trading ABC Brasil R$ 176 mi, BNB R$ 109 mi, trading BTG R$ 53 mi e Bradesco R$ 31 mi [MF-R2]. 2W: debêntures e financiamentos com Darby e BNB [MF-R19] | `CONFIRMADO` (Tradener e Elétron); `INFERÊNCIA` (2W) |
| **Bancos com mesa de energia (são comercializadoras)** | Contraparte bilateral | BTG (no setor desde 2010), Santander (fim de 2018) e Itaú BBA (2020) [MF-R25]. StoneX, Macquarie e Trafigura também entraram [MF-R26] | `INFERÊNCIA` (trechos de busca) |
| **Seguradoras de seguro garantia** | Garantem o cumprimento do contrato de energia (tomador: comercializadora ou comprador) | Ramo garantia: R$ 6,27 bi de prêmios em 2025, alta de 23,2%, dados da SUSEP citados pela imprensa [MF-R6]. Pottencial lidera com R$ 1,021 bi e 16,29% [MF-R7]; a conta bate com o total de ~R$ 6,27 bi. A AXA lançou a modalidade "Compra e Venda de Energia", que protege o fornecedor da inadimplência do comprador [MF-R8]. Segundo o GESEL/UFRJ, o seguro garantia "nem sempre" cobre bem situações de RJ [MF-R30] | Totais `INFERÊNCIA` (SUSEP via imprensa; o boletim SUSEP não foi lido). AXA `CONFIRMADO`. **Fatia do ramo ligada a energia: `NÃO VERIFICADO`** |
| **Seguradoras de crédito e corretoras** | Seguro de crédito para carteiras de comercializadoras | A Aon oferece o produto e diz não haver dados consolidados [MF-R11] | `INFERÊNCIA` (fonte comercial, 2024) |
| **FIDCs, securitizadoras e gestoras de crédito** | Compram recebíveis de contratos de energia (CCEAL/PPA) ou debêntures de comercializadoras e geradoras | Bolt Energy FIDC: R$ 300 mi, gestora Riza, compra contratos originados pela comercializadora da Bolt (2021) [MF-R21]. Fundos Wave e Solar do Credit Suisse, com perda de ~R$ 1,6 bi [MF-R19]. A Resolução CVM 240/2026 facilitou a cessão de recebíveis por empresas em RJ a FIDCs [MF-R24]. Clube FIDC: R$ 4,4 bi de FIDCs expostos a cedentes em recuperação, todos os setores [MF-R22] | Bolt e Credit Suisse `CONFIRMADO` (matérias lidas). Demais `INFERÊNCIA`. **FIDC de energia exposto às RJs de 2026: `NÃO VERIFICADO`** |
| **Câmaras e infraestrutura de garantias** | Exposição própria como câmara (CCEE no MCP) ou futura contraparte central | CCEE é a maior credora da Elétron, com R$ 335 mi [MF-R2]. Lei 15.269/2025: compete à CCEE "o monitoramento dos respectivos associados" e "a gestão de garantias de contratos de compra e venda no ambiente de contratação livre" (art. 4º, §§15 e 18, da Lei 10.848, na redação dada pela Lei 15.269) [MF-R13]. BBCE e Bradesco: colateral com chamada diária, opcional, no início de 2027. N5X: contraparte central no 2º semestre de 2027, sujeita ao BCB [MF-R12] | Lei `CONFIRMADO`; BBCE e N5X `INFERÊNCIA` (imprensa lida) |
| **"CCEE discute mecanismo de garantias em 2027"** | — | Não achei consulta nem norma da CCEE ou da ANEEL com um mecanismo de garantias do ACL com data em 2027. A notícia do decreto de 12/08/2026 publicada pela CCEE fala do SUI e das datas de abertura (25/11/2027 e 25/11/2028), sem garantias [MF-R14]. Em 2019 a CCEE propôs "chamada de margem" e as comercializadoras resistiram [MF-R15]. A ANEEL tem a CP 19/2026, que eleva garantias, mas só em leilões regulados [MF-R36] | **`NÃO VERIFICADO`**. A base legal existe (§18), mas não achei o desenho nem o prazo |
| **Comercializadoras como contraparte umas das outras** | Exposição bilateral (a mais direta) | Central de Risco Abraceel/Risk3: 17 métricas, ampliadas para 40 em out/2026, acesso só de associadas [H5-R28, H5-R30 → MF-R17]. Tradener alegou R$ 5,4 bi de contratos expostos na cautelar [MF-R37]. Grandes agentes reduziram limites e passaram a pedir aportes de garantia [MF-R27] | `CONFIRMADO` (Abraceel); `INFERÊNCIA` (demais) |

**Nota sobre o efeito da RJ:** na Tradener, o deferimento da RJ suspendeu "execuções de garantias financeiras" e vencimentos antecipados [MF-R31] (`INFERÊNCIA`, imprensa). Para bancos e seguradoras que emitiram garantias, isso tende a tornar o momento do sinistro e a recuperação mais incertos (`INFERÊNCIA`).

---

## 2. Perdas públicas em 2026 (e o caso 2W de 2025)

| Caso | Ator financeiro | Valor | Data | Rótulo |
|---|---|---|---|---|
| RJ da Tradener (passivo ~R$ 1,69 bi) | UBS Brasil Corretora | R$ 92 mi | 20/05/2026 [MF-R1] | `CONFIRMADO` |
| RJ da Tradener | Bradesco | R$ 62,6 mi | 20/05/2026 [MF-R1] | `CONFIRMADO` |
| RJ da Elétron (> R$ 1,1 bi) | Trading do Banco ABC Brasil | R$ 176 mi | 22/01/2026 [MF-R2] | `CONFIRMADO` |
| RJ da Elétron | Banco do Nordeste | R$ 109 mi | 22/01/2026 [MF-R2] | `CONFIRMADO` |
| RJ da Elétron | Trading do BTG Pactual | R$ 53 mi | 22/01/2026 [MF-R2] | `CONFIRMADO` |
| RJ da Elétron | Bradesco | R$ 31 mi | 22/01/2026 [MF-R2] | `CONFIRMADO` |
| RJ da Elétron | CCEE (não é financiador; é o mercado) | R$ 335 mi | 22/01/2026 [MF-R2] | `CONFIRMADO` |
| RJ da IBS | Fiança do Banco Master (emissor liquidado; a perda é da IBS e dos beneficiários) | Não divulgado | 15/04/2026 [MF-R3] | `CONFIRMADO` (sem valor) |
| 2W Ecobank (RJ em abr/2025) e Rio Alto (RE em mai/2025) | Cotistas dos fundos Wave e Solar (Credit Suisse, hoje UBS) | ~R$ 1,6 bi (Metrópoles); "até R$ 1,7 bi" (blog) | 07/08/2025 [MF-R19, MF-R20] | `INFERÊNCIA`. 2W e Rio Alto são geradoras eólicas e não só comercializadoras |
| Electra (~R$ 1,3 bi) e Gold (> R$ 1 bi) | Credores financeiros não identificados | — | 29/05/2026 e 13/07/2026 [MF-R5] | `NÃO VERIFICADO` |
| Seguradoras de garantia | Nenhum sinistro público achado | — | — | `NÃO VERIFICADO` |

**Agregados do setor:**
- **CNN, via Canal Solar:** ~R$ 8,6 bi em dívidas das principais comercializadoras, "com geradores, consumidores, instituições financeiras e outros agentes" [MF-R4].
- **Folha:** mais de R$ 6 bi em ao menos 11 empresas [MF-R5].
- **Fatia financeira:** nenhum dos dois separa quanto é devido a instituições financeiras (`NÃO VERIFICADO`).

**Leitura:** as perdas nominais de bancos em cada caso ficam na faixa de **dezenas de milhões a ~R$ 180 mi** por credor. Para bancos grandes, isso é imaterial no balanço; para tradings e seguradoras médias, é relevante (`INFERÊNCIA`).

---

## 3. Como monitoram hoje e concorrentes

| Ferramenta | O que faz | Para quem | Preço público | Rótulo |
|---|---|---|---|---|
| **Central de Risco Abraceel (com Risk3)** | Monitoramento semanal de 17 métricas, ampliadas para 40 em out/2026: operação balanceada, MCP, protestos etc. | Associadas da Abraceel | Incluído na anuidade, que não é pública | `CONFIRMADO` [MF-R17] |
| **Risk3** | Xpress (Light/Full/Quanti/Financial), Report, **Radar**, Cobrança, Dossiê. Logos de Eletrobras, AES, Petrobras e Genial Energia | Setor elétrico e médias e grandes empresas. Não cita bancos nem seguradoras | Não | `CONFIRMADO` (site lido) [MF-R18] |
| **Serasa Experian** (e Quod e Boa Vista, por analogia) | Alertas de pedido de recuperação judicial e score de PJ, sem camada setorial | Generalista | Não achei | `INFERÊNCIA` [MF-R33]; Quod e Boa Vista `NÃO VERIFICADO` |
| **Escavador, Jusbrasil e Digesto** | Monitoramento de processos e nomes | Generalista e jurídico | Escavador: plano Básico R$ 9,90/mês (10 acessos, 3 processos monitorados), segundo trecho de busca; a página de preços bloqueou o acesso (403). Jusbrasil e Digesto: não achei | `INFERÊNCIA` (Escavador) [MF-R32]; demais `NÃO VERIFICADO` |
| **Thunders** | Aparece como ETRM integrado à N5X, não como plataforma de crédito | Comercializadoras | — | `INFERÊNCIA` (trecho de busca sobre a N5X; ver MF-R40) |
| **Ratings (Fitch, Moody's, S&P)** | Rating de algumas comercializadoras grandes (ex.: a Fitch retirou o rating da Matrix; a empresa diz ter rating S&P) | Investidores | — | `NÃO VERIFICADO` (trecho sem data) [MF-R35]. Para as quebradas de 2026, o H5 não achou rating |
| **B3, Selo de Confiança e parceria Newe** | Seguradora consulta o selo do agente para ampliar o limite de seguro garantia | Seguradoras e agentes | — | `CONFIRMADO` (2021) [MF-R10]. Status atual `NÃO VERIFICADO` |
| **BBCE e Bradesco (colateral) e N5X (contraparte central)** | Reduzem o risco bilateral na origem | Agentes de atacado | Emolumentos | `INFERÊNCIA` [MF-R12] |
| **CCEE** | Monitoramento prudencial, listas públicas e, no futuro, gestão de garantias do ACL | Todos | Gratuito | `CONFIRMADO` (lei) [MF-R13] |
| **Análise interna** (subscrição e crédito) | Governança, estrutura de capital, ambiente judicial | Seguradoras e bancos | — | `INFERÊNCIA` (artigo de opinião de diretor da Newe) [MF-R9] |

**Lacuna que sobra (`INFERÊNCIA`):** nenhum desses produtos vende **eventos setoriais com fonte, por CNPJ tomador ou contraparte**, a bancos e seguradoras fora da Abraceel. A Risk3 seria o concorrente natural se decidisse atender esse público. Para bancos grandes, o mais provável é preferirem integrar dados à análise interna a comprar uma tela.

---

## 4. Tamanho (ordem de grandeza)

| Categoria | Quantos atores relevantes | Base | Rótulo |
|---|---|---|---|
| Seguradoras de seguro garantia com apetite por energia | ~10 a 20 | Ramo de R$ 6,27 bi, concentrado: líder com 16%. AXA, Pottencial, Junto e Newe citadas com produtos ou atuação no tema [MF-R6, MF-R7, MF-R8, MF-R10] | `INFERÊNCIA` (contagem não verificada na SUSEP) |
| Corretoras e seguradoras de crédito | < 10 | Aon [MF-R11] e outras não identificadas | `INFERÊNCIA` |
| Bancos emissores de fiança e credores corporativos de comercializadoras | ~10 a 30 | Grandes bancos, mais bancos médios (ABC, BNB, BTG) que aparecem nas listas [MF-R1, MF-R2] | `INFERÊNCIA` |
| Tradings de bancos e financeiras | ~5 a 10 | BTG, Santander, Itaú BBA, ABC, UBS, StoneX, Macquarie [MF-R2, MF-R25, MF-R26] | `INFERÊNCIA`. Já são "comercializadoras" |
| FIDCs e gestoras com lastro em energia | Poucas unidades a ~10 | Bolt/Riza [MF-R21] e Credit Suisse [MF-R19]. O universo total é de 4.270 classes de FIDC e R$ 902 bi (set/2026) [MF-R23], mas quase nenhuma com energia | `INFERÊNCIA` |
| Câmaras e plataformas (CCEE, BBCE, N5X, B3) | 3 a 4 | [MF-R12, MF-R13] | `CONFIRMADO`. São parceiros ou concorrentes, não clientes típicos |
| Comparação: comercializadoras | Centenas (317 empresas "Tipo 1" no monitoramento prudencial da CCEE) | [MF-R34] | `INFERÊNCIA` |

**Total de financiadores-alvo realistas:** cerca de **30 a 70 organizações** (`INFERÊNCIA`). É o mesmo número das gestoras de energia ou menos. A vantagem está no valor por contrato: bancos e seguradoras costumam pagar mais por dado de risco. Mas **não achei nenhum preço público** de produto setorial para eles (`NÃO VERIFICADO`).

**Sinais de disposição a pagar** (todos indiretos):
1. A Aon declarou a falta de dados consolidados (2024) [MF-R11].
2. A Newe usou um dado setorial (Selo B3) para decidir limite (2021) [MF-R10].
3. A AXA lançou produto específico para energia em 2026 [MF-R8]. Quem subscreve precisa de informação.
4. A Neoenergia e outros pedem garantias mais rígidas [MF-R16], o que aumenta a demanda por seguro e fiança e, por tabela, por subscrição.
5. Os bancos endureceram a concessão de crédito: na IBS, não houve como substituir a fiança [MF-R3]; grandes agentes cortaram limites [MF-R27].

**Contra-sinal:** a contraparte central, o colateral BBCE e a gestão de garantias pela CCEE, se forem adiante em 2027, **reduzem** a necessidade de monitoramento bilateral no atacado [MF-R12, MF-R13] (`INFERÊNCIA`).

---

## 5. Riscos de vender a esse público

| Risco | Norma ou fato | Implicação | Rótulo |
|---|---|---|---|
| **Atividade privativa de agência de rating** | Res. CVM 9/2020, arts. 1º e 2º: classificação de risco de crédito é "opinar sobre a qualidade de crédito de um emissor de títulos [...] ou qualquer ativo financeiro emitido no mercado de valores mobiliários", e é "atividade privativa" de agência registrada [MF-R28]. A Res. CVM 251/2026 reorganiza as definições (novo art. 1º-A) e entra em vigor em 01/12/2026 [MF-R29] | Comercializadoras com debêntures, ou cotas de FIDC lastreadas em energia, são "emissores". Uma **nota ou score** vendido a investidor sobre elas pode cair na norma. Alertas factuais com fonte, sem opinião de crédito, reduzem o risco. Exige parecer | Texto `CONFIRMADO`; aplicação `INFERÊNCIA` |
| **LGPD** | Dados de PJ ficam em geral fora da LGPD. Dados de sócios e administradores (pessoa física), como processos contra administradores (métrica da Abraceel), ficam dentro | Base legal (legítimo interesse ou proteção do crédito), minimização e canal do titular | `INFERÊNCIA` (lei não relida nesta sessão) |
| **Sigilo bancário** (LC 105/2001) | Se o banco enviar ao SaaS a carteira de exposições (quem garante e quanto), isso envolve dados de clientes do banco | Exige contrato de terceirização e segurança no padrão do regulador (regras CMN/BCB de contratação de serviços de processamento e nuvem), ou um modelo em que o banco só recebe o feed de eventos e cruza internamente | `NÃO VERIFICADO` (normas não lidas nesta sessão) |
| **Due diligence de fornecedor (bancos e seguradoras)** | Exigências de segurança, continuidade e auditoria | Ciclo de venda de meses; startup sem histórico tem dificuldade | `INFERÊNCIA` |
| **Responsabilidade por informação inexata** | Ver H5, seção 5: RJ suspende exigibilidade; operação balanceada não é insolvência | Para um financiador, um falso positivo pode virar corte de limite e, depois, ação judicial | `INFERÊNCIA` |
| **Concorrência de infraestrutura** | Lei 15.269 (CCEE: monitoramento e gestão de garantias) [MF-R13]; BBCE/Bradesco e N5X em 2027 [MF-R12] | O espaço pode ser ocupado por entes com dados primários | `INFERÊNCIA` |
| **Concentração do público** | Poucas dezenas de compradores | Perder 2 ou 3 contas pesa muito | `INFERÊNCIA` |

---

## 6. Fontes

Todas acessadas em 27/11/2026.

| ID | URL | Veículo / autor | Data da fonte | Rótulo |
|---|---|---|---|---|
| MF-R1 | https://www.cnnbrasil.com.br/infra/tradener-entra-em-recuperacao-judicial-com-divida-de-r-17-bilhao/ | CNN Brasil | 20/05/2026 | CONFIRMADO (lida) |
| MF-R2 | https://braziljournal.com/exclusivo-comercializadora-de-energia-pede-rj-com-divida-de-r-1-bilhao/ | Brazil Journal | 22/01/2026 | CONFIRMADO (lida) |
| MF-R3 | https://braziljournal.com/carta-fianca-do-master-vira-po-disparando-mais-uma-rj-no-setor-eletrico/ | Brazil Journal | 15/04/2026 | CONFIRMADO (lida) |
| MF-R4 | https://canalsolar.com.br/por-que-comercializadoras-estao-com-pedidos-de-recuperacao-judicial/ | Canal Solar (citando CNN) | 03/06/2026 | CONFIRMADO (lida; o total é de terceiros) |
| MF-R5 | https://www.bahianoticias.com.br/folha/noticia/400515-comercializadoras-de-energia-entram-em-crise-com-rombo-de-mais-de-r-6-bi | Folhapress (André Borges) | 13/07/2026 | CONFIRMADO (lida) |
| MF-R6 | https://cqcs.com.br/noticia/seguro-garantia-cresce-mais-de-23-e-setor-privado-surge-como-oportunidade-para-corretores-destaca-seguradora-alm/ | CQCS (citando SUSEP) | 22/05/2026 | INFERÊNCIA (dado SUSEP de segunda mão) |
| MF-R7 | https://revistaapolice.com.br/2026/02/pottencial-lidera-no-seguro-garantia-em-2025/ | Revista Apólice (relatório SUSEP de 16/02) | 19/02/2026 | INFERÊNCIA (SUSEP de segunda mão) |
| MF-R8 | https://revistaapolice.com.br/2026/04/axa-aposta-em-seguro-garantia-para-energia-renovavel/ | Revista Apólice | 23/04/2026 | CONFIRMADO (lida) |
| MF-R9 | https://revistaapolice.com.br/2026/04/recuperacoes-judiciais-em-alta-acendem-alerta-no-seguro-garantia/ | Revista Apólice (opinião de M. V. Pereira, Newe) | 30/04/2026 | INFERÊNCIA (opinião) |
| MF-R10 | https://monitormercantil.com.br/bolsa-paulista-fecha-parceria-com-seguradora-newe/ | Monitor Mercantil | 08/07/2021 | CONFIRMADO (lida; antiga) |
| MF-R11 | https://legismap.com.br/conteudos/artigos-e-noticias/novos-desafios-das-comercializadoras-de-energia-como-o-seguro-de-credito-pode-apoiar-empresas-no-setor | Aon Brasil, via Legismap (= H5-R40) | 20/06/2024 | INFERÊNCIA (fonte comercial; não relida nesta sessão) |
| MF-R12 | https://braziljournal.com/no-mercado-de-energia-risco-maior-movimenta-derivativos-colateral-e-ate-bolsa | Brazil Journal (= H5-R35) | 17/09/2026 | INFERÊNCIA (imprensa, lida) |
| MF-R13 | https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/lei/L15269.htm | Lei 15.269/2025 | 24/11/2025 | CONFIRMADO (lida) |
| MF-R14 | https://www.ccee.org.br/en/web/guest/-/ricardo-simabuku-decreto-da-abertura-do-mercado-traz-confianca-para-agentes-e-protecao-ao-consumidor | CCEE | 17/08/2026 | CONFIRMADO (lida) |
| MF-R15 | https://agenciainfra.com/blog/monitoramento-prudencial-no-mercado-livre-deve-reacender-discussao-sobre-garantias/ | Agência iNFRA | 05/09/2023 | CONFIRMADO (lida; antiga) |
| MF-R16 | https://agenciainfra.com/blog/?p=44553 | Agência iNFRA (Neoenergia) | 20/07/2026 | CONFIRMADO (lida) |
| MF-R17 | https://abraceel.com.br/destaques/2025/12/abraceel-adotara-autorregulacao-em-2026-para-reforcar-seguranca-do-mercado-de-energia/ ; https://abraceel.com.br/destaques/2026/10/abraceel-inaugura-autorregulacao-para-reforcar-seguranca-na-comercializacao-de-energia/ | Abraceel (= H5-R28, H5-R30) | 15/12/2025; 26/10/2026 | CONFIRMADO (sessão H5) |
| MF-R18 | https://risk3.com.br/ | Risk3 | — | CONFIRMADO (site lido) |
| MF-R19 | https://www.metropoles.com/negocios/empresas-rombo-faria-lima-bilhoes | Metrópoles (Luiz Vassallo) | 07/08/2025 | INFERÊNCIA (imprensa, lida) |
| MF-R20 | https://www.meelion.com/blog/?p=3246 | Meelion (blog) | NV | NÃO VERIFICADO (trecho de busca) |
| MF-R21 | https://braziljournal.com/bolt-levanta-fidc-de-r-300-milhoes-para-securitizar-contratos-de-energia/ | Brazil Journal | 21/10/2021 | CONFIRMADO (lida; antiga) |
| MF-R22 | https://capitalaberto.com.br/insights/clube-fidc/2026/10/fid-cs-tem-r-4-4-bilhoes-expostos-a-cedentes-em-recuperacao | Capital Aberto / Clube FIDC | 10/2026 | INFERÊNCIA (trecho de busca) |
| MF-R23 | https://euqueroinvestir.com/mercados/fidcs-registram-captacao-liquida-de-r-56-bilhoes-ate-setembro | Eu Quero Investir (citando ANBIMA) | ~10/2026 | INFERÊNCIA (trecho de busca) |
| MF-R24 | https://monitordomercado.com.br/noticias/361923-nova-regra-da-cvm-facilita-acesso-de-empresas-em-recuperacao-judicial-a-financiamento-com-fidcs/ | Monitor do Mercado (Res. CVM 240, 05/03/2026) | 03/2026 | INFERÊNCIA (trecho de busca) |
| MF-R25 | https://forbes.com.br/negocios/2020/01/itau-e-banco-indusval-entram-em-comercializacao-de-energia-eletrica/ | Forbes Brasil | 01/2020 | INFERÊNCIA (trecho de busca) |
| MF-R26 | https://diariodocomercio.com.br/?p=616785 | Diário do Comércio | NV | INFERÊNCIA (trecho de busca) |
| MF-R27 | https://www.cnnbrasil.com.br/infra/comercializadoras-avaliam-acionar-cade-contra-geradoras-apurou-cnn/ | CNN Brasil | NV (2026) | INFERÊNCIA (trecho de busca) |
| MF-R28 | https://www.legisweb.com.br/legislacao/?id=403297 (oficial: https://conteudo.cvm.gov.br/export/sites/cvm/legislacao/resolucoes/anexos/001/resol009.pdf) | Res. CVM 9/2020 | 27/10/2020 | CONFIRMADO (arts. 1º e 2º lidos na Legisweb; PDF da CVM ilegível pela ferramenta) |
| MF-R29 | https://www.contadores.cnt.br/legislacoes/resolucao-cvm-no-251-de-05-11-2026.html | Res. CVM 251/2026 (reprodução) | 05/11/2026 | INFERÊNCIA (fonte secundária, lida; o site da Cescon Barrieu bloqueou com 403) |
| MF-R30 | https://gesel.ie.ufrj.br/wp-content/uploads/2025/10/Artigo-Crise-Insolvencia-Comercializadoras-13.10.2025.pdf | GESEL/UFRJ (reprodução de artigo do CanalEnergia) | 13/10/2025 | INFERÊNCIA (trecho de busca; PDF ilegível pela ferramenta) |
| MF-R31 | https://cenarioenergia.com.br/2026/05/22/justica-defere-recuperacao-judicial-da-tradener-e-barra-rescisao-em-massa-de-contratos-de-energia/ | Cenário Energia (= H5-R21) | 22/05/2026 | INFERÊNCIA (imprensa) |
| MF-R32 | https://www.escavador.com/precos | Escavador | NV | INFERÊNCIA (403 na leitura; valor visto em trecho de busca) |
| MF-R33 | https://www.serasaexperian.com.br/conteudos/tm1-recuperacao-judicial/ | Serasa Experian | NV | INFERÊNCIA (trecho de busca) |
| MF-R34 | https://cenarioenergia.com.br/2026/06/11/ccee-registra-queda-de-39-na-inadimplencia-documental-e-prepara-transicao-para-modelo-prudencial-no-mercado-livre/ | Cenário Energia | 11/06/2026 | INFERÊNCIA (trecho de busca) |
| MF-R35 | https://monitormercantil.com.br/?p=249416 | Monitor Mercantil (Matrix/Fitch) | NV | NÃO VERIFICADO (trecho sem data) |
| MF-R36 | https://canalsolar.com.br/aneel-consulta-publica-primeiro-leilao-de-baterias/ (e outros resultados sobre a CP 19/2026) | Canal Solar e outros | 07/2026 | INFERÊNCIA (trecho de busca) |
| MF-R37 | https://agenciainfra.com/blog/tradener-alega-exposicao-de-r-5-bi-para-obter-liminar-contra-dividas/ | Agência iNFRA (= H5-R22) | 10/04/2026 | INFERÊNCIA |
| MF-R40 | https://eixos.com.br/energia-eletrica/risco-sistemico-no-mercado-livre-de-energia-ainda-e-consideravel-diz-ceo-da-n5x/ | eixos (N5X) | 23/04/2025 | CONFIRMADO (lida). A integração da Thunders com a N5X veio de trecho de busca (`INFERÊNCIA`) |

**Bloqueios e limitações:**
- Escavador e Cescon Barrieu responderam 403.
- Os PDFs da CVM e do GESEL não puderam ser lidos (a ferramenta não extraiu o texto e não havia `pdftotext` nem `pypdf`).
- Os boletins da SUSEP não foram abertos: o total do ramo garantia é dado de segunda mão.
- Não achei listas completas de credores da Electra, da Gold nem da IBS.
