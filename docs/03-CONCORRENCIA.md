# 03 — Concorrência e substitutos

> **Status:** consolidado em 27/11/2026 a partir de uma frente de pesquisa (ver `docs/DECISOES.md` D-002, D-003, D-009). Conteúdo produzido por agentes de pesquisa e conferido por amostragem nas afirmações críticas (D-007).
>
> **Convenção de referências:** cada parte veio de uma frente de pesquisa independente; os identificadores têm prefixo da frente (`ACL-R1`, `RD-R3`, `CLI-R5`, `CON-R2`, `OE-R7`, `H5-R1`). A lista completa está em [`REFERENCIAS.md`](REFERENCIAS.md). Rótulos: `CONFIRMADO`, `INFERÊNCIA`, `HIPÓTESE`, `NÃO VERIFICADO`. Data de consulta de todas as fontes: 27/11/2026.


- **Data de consulta de todas as fontes:** 27/11/2026.
- **Convenção de status:** `CONFIRMADO` (lido diretamente em fonte primária/oficial ou documento da própria empresa, para o fato descrito); `INFERÊNCIA` (dedução razoável a partir de fatos confirmados); `HIPÓTESE` (a testar, sem evidência direta); `NÃO VERIFICADO` (não foi possível confirmar; apareceu só em snippet de busca, fonte inacessível ou sem data).
- **Marketing é evidência fraca.** Números autodeclarados em sites (contadores, “% de economia”, “líder”) aparecem marcados como **[autodeclarado]**. Confirmam o que a empresa *diz*, não o que aconteceu.
- Números entre colchetes `[R#]` apontam para a tabela de referências no fim do documento.
- Algumas páginas recusaram fetch automatizado (403 em bbce.com.br e brasilgestora.com.br via WebFetch; o portal da CCEE de RD também deu 403). A BBCE foi lida por download direto (HTTP 200). O que não pôde ser lido está marcado.

---

## 1. Resumo executivo

1. **H1 (marketplace/RFQ genérico de energia no ACL) entra num espaço já ocupado por infraestrutura consolidada.** A BBCE opera negociação em tela, boleta eletrônica para negócios bilaterais, leilões e um módulo de **RFQ** exposto na API. Negociou R$ 88,8 bi em 2025 [CON-R1, CON-R4, CON-R5, CON-R6] (`CONFIRMADO`). A N5X (sócia B3) também opera tela e boleta desde 2025 [CON-R9, CON-R10] (`CONFIRMADO`). Do lado do consumidor, gestoras ligadas a grupos grandes já rodam cotação entre comercializadoras: Clarke/Energisa com 60 fornecedores [CON-R19] e o hud Cotação da Esfera/Auren com mais de 130 comercializadoras cadastradas no lançamento [CON-R21, CON-R22]. **Saturação: alta.**
2. **H4 (cotador/comparador para empresas) é o segmento mais saturado e o mais ameaçado.** A ANEEL instituiu o Open Energy (REN 1.175/2026, publicada em 04/11/2026). A CCEE tem até ~04/11/2027 para lançar uma **plataforma oficial e gratuita** de comparação de produtos e preços de varejistas. As APIs de compartilhamento de dados vêm em até 24 meses [CON-R11, CON-R12] (`CONFIRMADO` para o comunicado da ANEEL; data exata da REN via imprensa). Já existem pelo menos 6 comparadores ou marketplaces privados, quase todos gratuitos para o consumidor e pagos pelo fornecedor (`INFERÊNCIA` em parte). **Saturação: muito alta.**
3. **H2 (marketplace de capacidade de RD) tem poucos compradores e um incumbente com plataforma gratuita.** A AXIA (ex-Eletrobras) tem plataforma digital de agregação de RD, gratuita por 12 meses, com oferta a partir de 1 MW. A página mostra 73 empresas representadas, 1.315 ofertas e mais de 99 mil MWh reduzidos **[autodeclarado]** [CON-R13, CON-R14]. A Agência iNFRA reportou 15 MW em ofertas agregadas, com propostas de até R$ 991/MWh [CON-R15] (`CONFIRMADO` como reporte de imprensa baseado na empresa). A Simple Energy anuncia serviços de RD, mas **não encontrei evidência de oferta liquidada** [CON-R16]. O mecanismo de disponibilidade do ONS contratou 344 MW em 12 ofertas em julho/2026 [CON-R17, CON-R18]. É um mercado pequeno e concentrado em metalurgia. **Saturação: baixa em número de players, mas a demanda também é pequena.**
4. **H3 (software de pré-qualificação de flexibilidade para agregadoras):** **não encontrei nenhum fornecedor vendendo isso como produto a terceiros no Brasil** (`NÃO VERIFICADO` como ausência; a busca foi extensa, mas não é prova). O único agregador ativo com evidência (AXIA) construiu a solução internamente sobre Google Cloud [CON-R14]. A TYR comprou a GreenAnt, cujas soluções passaram a ser **exclusivas da TYR** a partir de 2026 [CON-R25], e declara intenção de “viabilizar RD e VPPs” [CON-R26]. **Saturação: baixa. É o espaço em branco mais claro, mas com poucos compradores potenciais e risco de “build vs buy”.**
5. **Contexto de risco relevante:** em 2026, várias comercializadoras entraram em recuperação judicial: Tradener, Electra, Diferencial, Elétron e IBS. A Matrix está em reestruturação e a Safira em mediação com credores [CON-R33] (`CONFIRMADO` por imprensa). Risco de contraparte e crédito é dor real do ACL. A BBCE já vende gestão de limites bilaterais [CON-R2, CON-R3] (`CONFIRMADO`).

---

## 2. Perfis curtos

### 2.1 Infraestrutura de negociação no ACL

**BBCE (Balcão Brasileiro de Comercialização de Energia) — EHUB, Boleta Eletrônica, Leilões, Curva Forward, BBCE Connect**
- **O que é:** administradora de balcão regulada pela CVM [CON-R2] (`CONFIRMADO`, autodeclarado em página oficial). Oferece negociação em tela (EHUB), formalização de negócios fechados por voz ou fora da tela (Boleta Eletrônica, inclusive com “contraparte não cliente BBCE”), leilões abertos e fechados, contrato padrão, curva forward, gestão de limites e liquidação financeira [CON-R2, CON-R3] (`CONFIRMADO`).
- **Quem pode negociar:** o Manual de Normas do EHUB v3.0 (vigência 06/08/2026) limita as operações a Empresas Clientes credenciadas com perfil Trader, negociando com outras Empresas Clientes ou contrapartes não clientes “que sejam agentes devidamente autorizados pela CCEE e pela ANEEL para atuar no ACL”. Cada limite operacional bilateral deve ser de no mínimo R$ 70.000 ou 672 MWh [CON-R7] (`CONFIRMADO`). Uma startup não agente **não pode negociar** no EHUB (`INFERÊNCIA` direta da regra).
- **Escala:** a página do mercado livre diz que “cerca de 300 empresas utilizam os serviços da BBCE, sendo a maior parte delas comercializadoras” e que a BBCE já suportou mais de 2 mil TWh, 400 mil contratos e R$ 300 bi [CON-R3] (`CONFIRMADO` como texto oficial, **data não identificada**: rodapé “© BBCE 2024”, texto cita “dez anos de história”, portanto provavelmente desatualizado). Segundo o relatório anual 2024, foram R$ 88,4 bi negociados em 2024, cerca de 600 TWh, e mais de 60 empresas contribuindo diariamente para a curva [CON-R8] (`CONFIRMADO`). Em 2025 foram R$ 88,8 bi e 384,5 mil GWh [CON-R6] (`CONFIRMADO` pelo título e subtítulo da Brasil Energia; corpo atrás de paywall).
- **Tarifas públicas:** a Tabela EHUB Mercado Físico ACL (publicada em 01/02/2023, vigência 01/01/2023) traz [CON-R5] (`CONFIRMADO` para essa versão; **vigência atual NÃO VERIFICADA**, porque um comunicado anunciou nova tabela integrada a partir de 01/07/2023 [CON-R5b]):
  - perfil Visualizador: R$ 17.463,22/mês;
  - perfil Negociador: mínimo de R$ 4.400/mês, consumível em emolumentos;
  - emolumentos em tela de R$ 0,01 a R$ 0,35/MWh, conforme faixa de volume mensal e prazo de suprimento;
  - BBCE APIs: R$ 6.985,29/mês se o cliente não atingir 35 MWm;
  - Boleta: R$ 64,03 por contrato.
- **API:** existe um **portal do desenvolvedor público**, documentado em Postman (portaldodesenvolvedor.bbce.com.br), com autenticação, carteiras, empresas, tickers, curva forward, boleta (criar e aprovar registros), contratos, ordens (criar compra e venda, cancelar, suspender), book, limites bilaterais, MtM, **relatórios de RFQ** (criadas, participadas, contrapartes), webhooks e liquidação financeira [CON-R4] (`CONFIRMADO`). O acesso exige ser cliente BBCE com credenciais EHUB e contratar o BBCE Connect (apiKey fornecida pelo suporte). Os pacotes são Essentials, Post Trading, Trading, Risk, Market Data e Full [CON-R1, CON-R4] (`CONFIRMADO`). Preço atual dos pacotes: **não público** (formulário comercial).
- **Diferenciais comprovados:** liquidez, contrato padrão “testado no judiciário” (autodeclarado), curva forward de referência, integração por API e webhooks.
- **Fraquezas comprovadas:** atende agentes CCEE, majoritariamente comercializadoras. Não atende o consumidor final não agente nem RD (`CONFIRMADO` pelo escopo do manual). Não encontrei funcionalidade de originação de clientes finais (`NÃO VERIFICADO` como ausência).

**N5X (bolsa de energia, com B3 como sócia)**
- Começou a negociação em tela em 23/04/2025 [CON-R9] (`CONFIRMADO` por imprensa). No primeiro ano: R$ 584 milhões, 2,83 TWh, Boleta N5X para formalização bilateral e Tela N5X com políticas de risco de contraparte. Participantes citados: Auren, Casa dos Ventos, Danske, Eletrobras, Eneva, Genco, Minerva, Newcom, Statkraft [CON-R10] (`CONFIRMADO` como texto publicado, mas é **conteúdo de marca**, evidência fraca). Pediu autorização para atuar como clearing (`NÃO VERIFICADO`: só vi snippet de Bloomberg Línea). API pública: **não verificada**.
- Importância para H1: mostra que até uma entrante com sócio B3 levou um ano para chegar a R$ 0,58 bi, contra cerca de R$ 88 bi/ano da BBCE (`INFERÊNCIA`: a barreira de liquidez é real).

### 2.2 Oficial / regulatório

**Plataforma de comparação CCEE / Open Energy (escopo e cronograma; detalhamento fica com outro agente)**
- Em 27/10/2026 a ANEEL instituiu o Open Energy para consumidores do Grupo A: acesso padronizado aos próprios dados e compartilhamento com consentimento prévio, gratuito, revogável, com histórico de acessos. Uma **plataforma de comparação de produtos e preços de comercializadores varejistas**, disponibilizada pela CCEE e acessada pela página da ANEEL, deve sair **em até 12 meses**. O compartilhamento por **APIs padronizadas** vem **em até 24 meses** [CON-R11] (`CONFIRMADO`).
- Segundo a imprensa, a norma é a REN 1.175/2026, publicada em 04/11/2026. Isso dá prazo até ~04/11/2027 para a plataforma de comparação, “sujeita à aprovação prévia da ANEEL” [CON-R12] (`CONFIRMADO` como reporte de imprensa; número da REN não conferido no texto oficial). **Hoje (27/11/2026) a plataforma não está operacional** (`INFERÊNCIA` a partir do prazo; não encontrei anúncio de lançamento).
- A CCEE administrará consentimentos, autenticação e interoperabilidade [CON-R12] (`CONFIRMADO` como reporte de imprensa).
- Um decreto de agosto/2026 manda a CCEE publicar a relação de varejistas habilitados e ferramentas de comunicação com eles [CON-R12b] (`NÃO VERIFICADO`: só snippet de busca).

### 2.3 Resposta da Demanda (RD) — agregadores

**AXIA Energia (ex-Eletrobras) — Programa Estrutural de RD e plataforma respostademanda.axia.com.br**
- **O que oferece:** a AXIA atua como **agregadora**. Na plataforma o cliente simula a receita, aceita o termo de adesão, cadastra as unidades, aprova a AXIA como agregadora no site da CCEE e agenda ofertas para a semana operativa (sábado a sexta). A AXIA define e publica o preço de oferta às terças [CON-R13] (`CONFIRMADO`, página oficial).
- **Elegibilidade:** consumidores livres, parcialmente livres, especiais e autoprodutores adimplentes na CCEE. Oferta individual de no mínimo 5 MWh/h; unidades menores entram por agregação no mesmo submercado [CON-R13] (`CONFIRMADO`). Segundo o release, oferta a partir de 1 MW [CON-R14] (`CONFIRMADO`).
- **Modelo comercial:** “o custo do serviço é gratuito” nos primeiros 12 meses do contrato de agregação. **Depois disso, não é público** [CON-R13, CON-R14] (`CONFIRMADO` / preço pós-carência `NÃO VERIFICADO`).
- **Tecnologia:** BigQuery, Vertex AI e Apigee (conexão com CCEE e ONS); Gemini previsto [CON-R14] (`CONFIRMADO`, release da empresa).
- **Indicadores de volume:** a página mostra 73 empresas representadas, 1.315 ofertas criadas, mais de 99 mil MWh reduzidos e mais de 59 milhões de kg CO₂eq **[autodeclarado]** [CON-R13]. Segundo a Agência iNFRA (26/10/2026), foram 15 MW ofertados em ofertas agregadas, as “primeiras do tipo no país”, com propostas de até R$ 991/MWh e “três ofertas agregadas” até então [CON-R15] (`CONFIRMADO` como reporte, com origem na empresa). Em 2024 a Eletrobras já havia representado um cliente com oferta de 80 MW de redução, registrada no ONS. A matéria **não** confirma acionamento nem pagamento [CON-R16b] (`CONFIRMADO` para o registro; liquidação `NÃO VERIFICADA`).
- **Leitura:** pelos próprios indicadores, a AXIA **opera de forma ativa** em RD. Não há base para dizer que atua pouco. A diferença entre MWh “reduzidos” na página e o que foi efetivamente liquidado na CCEE **não foi verificada** em fonte independente.

**Simple Energy (Simple Energy Assessoria e Gestão de Energia)**
- Comercializadora, geradora e consultoria (“+12 anos”). Linhas: varejista, gestão de consumidores, gestão de geradores, consultoria regulatória, tecnologia; estudo de viabilidade gratuito para contas acima de R$ 20 mil/mês [CON-R16, CON-R16c] (`CONFIRMADO` como autodeclaração).
- **RD:** a página de 29/10/2024 lista serviços de RD: habilitação do consumidor, monitoramento de oportunidades, apoio na elaboração de ofertas, estratégia, “operacionalização junto ao ONS”, relatórios e conferência de valores a receber [CON-R16] (`CONFIRMADO` como **anúncio de serviço**).
- **Evidência de agregação efetiva ou liquidação:** **nenhuma encontrada.** A página não afirma que a empresa atue como agregadora nem informa MW, clientes ou ofertas liquidadas. Nenhuma matéria sobre os mecanismos do ONS de 2024 a 2026 a cita [CON-R16, CON-R17, CON-R18] (`NÃO VERIFICADO`). Para efeito de concorrência, a Simple Energy é **prestadora de serviço consultivo/operacional de RD anunciado**, não um agregador com volume comprovado.

**Mecanismo competitivo de RD do ONS (contexto de demanda)**
- 3º mecanismo, em 15/07/2026: 344 MW em 12 ofertas vencedoras, deságio médio de 49,23%, teto de R$ 55.000/MW, receita fixa mensal de setembro a dezembro de 2026, 86% do volume em metalurgia [CON-R17, CON-R18] (`CONFIRMADO` por imprensa). As matérias não nomeiam os vencedores. Em snippet, associadas da Abrace teriam cerca de 70% da potência (`NÃO VERIFICADO`).
- Implicação: os grandes consumidores participam **diretamente**, sem agregador; a agregação é marginal em volume (`INFERÊNCIA`).

### 2.4 Medição, analytics e gestão de consumo

**GreenAnt → TYR Energia**
- A GreenAnt é SaaS de eficiência energética (fundada em 2015), com 180 empresas ativas e mais de 4.000 pontos de medição. Clientes citados: Ambev, Santander, Aeroporto de Salvador. **A TYR adquiriu a GreenAnt em fevereiro/2026 e, a partir de 2026, as soluções GreenAnt são ofertadas exclusivamente à TYR.** Valor não divulgado [CON-R25] (`CONFIRMADO` por imprensa). O site GreenAnt diz “acesso a todos os dados para integração com aplicações terceiras via API” [CON-R27] (`CONFIRMADO` como autodeclaração). **Não há documentação pública de API** (`NÃO VERIFICADO`).
- A TYR é uma energytech/comercializadora do RJ, com “Tyr Energia por Assinatura”, plataforma TYR+ e agentes de IA [CON-R28] (`CONFIRMADO` como autodeclaração). Em 07/2025, o CEO da GreenAnt disse que a parceria visava “viabilizar soluções como resposta da demanda, VPPs” [CON-R26] (`CONFIRMADO` como **declaração de intenção**; sem evidência de operação de RD).
- **Implicação para o PLANO:** a GreenAnt deixou de ser uma integração neutra candidata; virou ativo cativo de uma comercializadora concorrente (`INFERÊNCIA` forte).

**Way2 (medição)**
- Plataforma Integrada de Medição (PIM), PowerHub (medição e faturas), IntegraFlow (notificações de migração ACL usadas pela Enel) [CON-R29] (`CONFIRMADO` como autodeclaração/depoimentos). Fornece tecnologia do SCDE à CCEE desde 2012 (`NÃO VERIFICADO`: só snippet). API pública para consumidores: **não encontrada**. Atende distribuidoras, geradores e gestoras, não o comprador de flexibilidade (`INFERÊNCIA`).

### 2.5 Gestoras / comercializadoras-gestoras (canal e substituto)

| Empresa | Fato | Status |
|---|---|---|
| **Comerc (Vibra)** | “Gestão e comercialização de energia”, migração para o ACL [CON-R30]. Vibra concluiu aquisição de 100% (jan/2025) e há relatos de busca por sócio para desconsolidar em 2026 (snippets). | Serviço `CONFIRMADO` (autodeclarado); societário `NÃO VERIFICADO` |
| **Esfera Energia (Auren)** | Auren comprou 100% (anúncio 04/06/2024). Esfera atendia 570 grupos e ~1.600 contratos [CON-R23]. Lançou o **hud Cotação** (05/2021): RFQ digital em que comercializadoras recebem pedidos (volume, tipo, período) e respondem pela plataforma. Mais de 130 comercializadoras cadastradas, mais de 100 MWm/mês na fase de testes, acesso gratuito por convite [CON-R21]. | `CONFIRMADO` (imprensa); status atual do hud `NÃO VERIFICADO` |
| **Clarke Energia (Energisa)** | Energisa comprou 70% (22/03/2024). 300 clientes ativos, ~200 GWh/ano, 60 fornecedores. Faz “concorrência” entre fornecedores e depois gestão; cobra comissão [CON-R19]. Em 2021, cobrava 30% da economia no 1º ano no serviço de adequação tarifária e comissão dos comercializadores no marketplace [CON-R20]. | `CONFIRMADO` (imprensa); percentuais atuais `NÃO VERIFICADO` |
| **Thymos Energia** | Consultoria e gestão; assessorou grande parte dos contratos de autoprodução (imprensa). | `NÃO VERIFICADO` (snippets) |
| **Ludfor** | Grupo com mais de 1,2 GWm sob gestão e 400 especialistas após integrar a Trifase (2025). | `NÃO VERIFICADO` (snippets) |
| **Tendência Energia** | Gestão e varejo para PMEs; parceria com Eletrobras (snippets). | `NÃO VERIFICADO` |
| **Safira** | Em crise. Mediação com credores (28/08/2026) [CON-R33]; manchete “Justiça defere recuperação judicial da Safira” vista no portal Brasil Energia [CON-R6b]. | Crise `CONFIRMADO`; RJ deferida `NÃO VERIFICADO` |
| **Mitsidi** | Só encontrei contribuição a consulta pública (2020). Atuação atual em ACL não confirmada. | `NÃO VERIFICADO` |

**Modelo de cobrança típico de gestoras (evidência disponível):**
- % da economia (success fee): Clarke, 30% da economia no 1º ano, em adequação tarifária (2021) [CON-R20] (`CONFIRMADO`, datado).
- Comissão paga pelo fornecedor ou comercializadora: Clarke (2021 e 2024) [CON-R19, CON-R20] (`CONFIRMADO`). UC Livre e Info Energia são “gratuitos” para o consumidor [CON-R31, CON-R32], o que sugere receita do lado do fornecedor (`INFERÊNCIA`).
- Take rate sobre a conta: Lemon (GD, PMEs) (`NÃO VERIFICADO`: snippet startups.com.br).
- Fee mensal fixo por unidade consumidora: **não encontrei nenhuma fonte pública com valores** (`NÃO VERIFICADO`). Editais públicos de “gestão de energia no ACL” existem, mas não localizei valor homologado. **Lacuna a fechar com entrevistas ou editais.**

### 2.6 Marketplaces e comparadores privados para empresas (H4)

| Nome | O que faz | Cobrança | Status |
|---|---|---|---|
| Clarke (Energisa) | Análise gratuita + concorrência entre ~60 fornecedores + gestão | Comissão (não pública) | `CONFIRMADO` [CON-R18c, CON-R19] |
| hud Cotação (Esfera/Auren) | RFQ digital para mais de 130 comercializadoras | Gratuito (2021) | `CONFIRMADO` 2021; atual `NÃO VERIFICADO` [CON-R21] |
| UC Livre | “Marketplace de energia”: upload da conta, várias propostas, contratação digital, “completamente gratuito” | Não público | `CONFIRMADO` (site) [CON-R31] |
| Info Energia | Diretório de comercializadoras, geradoras e instaladoras, “grátis”. Site com texto *lorem ipsum*, sinal de baixa maturidade | Não público | `CONFIRMADO` (site) [CON-R32] |
| WisePower (Electy + Gouvêa) | Marketplace de energia limpa para varejo e PMEs; adesão digital | Não público | `CONFIRMADO` (imprensa, 21/10/2024) [CON-R24] |
| Simple Energy, Comerc, TYR e praticamente toda comercializadora | Simuladores e estudos gratuitos de viabilidade (lead-gen próprio) | Margem na energia | `CONFIRMADO` (sites) [CON-R16c, CON-R28, CON-R30] |
| **CCEE (oficial, futuro)** | Comparação de produtos e preços de varejistas | Gratuito | `CONFIRMADO` (previsto até ~11/2027) [CON-R11, CON-R12] |

### 2.7 Software para comercializadoras (trading, gestão de carteira, varejo)

| Empresa | O que vende | API/integração | Preço | Status |
|---|---|---|---|---|
| **Thunders Tecnologia** | “10 anos… ETRM”: book, posição, exposição; módulos para comercializadora, **varejista** (do comercial à conta gráfica), **gestora de consumidores ACL**, geradoras e distribuidoras; integração com CCEE e ERPs | Integração CCEE/ERP declarada; API pública não encontrada | Não público | `CONFIRMADO` (site) [CON-R34] |
| **Dcide (Denergia)** | Curva forward, índices de preço, risco, plataforma front/middle/back office, consultoria | Não verificada | Não público | `CONFIRMADO` (site) [CON-R35] |
| **Norus** | Imeris (desktop, desde 2011): impacto de novos negócios e curvas no portfólio; Norus Summit | Não verificada | Não público | `NÃO VERIFICADO` (snippets) |
| **PSR** | Consultoria e modelos (OptFolio, OptValue) para estratégia e risco; clientes incluem comercializadoras | — | Não público | `NÃO VERIFICADO` (snippets) |
| **BBCE Curva / LSEG** | Dados de preço forward, inclusive via LSEG (fev/2026) | API BBCE | Não público | `CONFIRMADO` para a API [CON-R4]; LSEG `NÃO VERIFICADO` |

Nenhum desses fornecedores declara módulo de **originação de flexibilidade/RD** ou de **pré-qualificação de cargas para agregação** (`NÃO VERIFICADO` como ausência). O módulo “gestora de consumidores ACL” da Thunders é o adjacente mais próximo de uma ferramenta de originação no varejo.

---

## 3. Matriz de concorrência real

Legenda: ✔ = evidência confirmada; (a) = autodeclarado; NP = não público; NV = não verificado.

| Player | Segmento atendido | Tarefa resolvida | Canal de aquisição | Acesso a dados | Forma de cobrar | Autorizações necessárias | API | Diferenciais | Fraquezas comprovadas |
|---|---|---|---|---|---|---|---|---|---|
| **BBCE (EHUB/Boleta/Connect)** | Agentes CCEE, majoritariamente comercializadoras (~300 empresas, dado datado) | Negociação em tela, formalização bilateral, leilões, RFQ, limites, liquidação, curva | Comercial direto, associações, mídia (MegaWhat no formulário) | Book, negócios e contratos de todo o mercado (Market Data) | Emolumentos R$/MWh + mínimos mensais + taxa de API (tabela 2023 ✔; vigente NV) | Administradora de balcão CVM; usuários devem ser agentes CCEE/ANEEL ✔ | ✔ pública e documentada (Postman); uso só para clientes com contrato | Liquidez (R$ 88,8 bi em 2025), contrato padrão, curva de referência | Não atende consumidor não agente nem RD; custo fixo alto para pequenos |
| **N5X** | Participantes institucionais do ACL | Tela + boleta bilateral, risco de contraparte | Comercial direto; sócio B3 | Própria plataforma | NP | Infraestrutura de mercado; clearing pendente (NV) | NV | Respaldo B3, plano de clearing | Liquidez baixa: R$ 584 mi no 1º ano (conteúdo de marca) |
| **CCEE – comparador Open Energy** | Consumidores Grupo A (varejo) | Comparar produtos e preços de varejistas; depois, dados por API com consentimento | Página da ANEEL; obrigação regulatória | Dados da CCEE/distribuidoras via Open Energy | Gratuito ✔ | Mandato regulatório ✔ | APIs previstas em até 24 meses ✔ (não operacionais hoje) | Oficial, neutro, gratuito, com dados | Ainda não existe; escopo limitado a varejistas; sem gestão nem serviço |
| **AXIA – RD** | Consumidores livres/especiais/autoprodutores (≥1 MW na plataforma) | Agregação e oferta de RD ao ONS, precificação, gestão operacional | Base de clientes AXIA, release, site | Histórico de consumo e ofertas (BigQuery) ✔(a) | Gratuito nos 12 primeiros meses ✔; depois NP | Agente CCEE como agregador; aprovação pelo consumidor no site da CCEE ✔ | Interna (Apigee para CCEE/ONS); API pública NV | Escala, balanço próprio, plataforma pronta, gratuidade | Dependência de um mercado pequeno (344 MW no mecanismo de disponibilidade); liquidação efetiva NV |
| **Simple Energy** | Consumidores ACL, geradores, PMEs varejo | Comercialização, gestão, consultoria; serviços de RD anunciados | Conteúdo/SEO, estudo de viabilidade gratuito | Faturas e dados do cliente (INFERÊNCIA) | NP | Comercializadora (a) | NV | Oferta integrada (a) | Sem evidência de RD liquidada |
| **TYR + GreenAnt** | Empresas, condomínios, indústrias; GreenAnt: 180 empresas | Migração, energia por assinatura, monitoramento, desagregação de carga, IA; intenção de RD/VPP | Comercial próprio, base GreenAnt | Medição própria (>4–6 mil pontos (a)) | NP (energia por assinatura) | Comercializadora (a) | GreenAnt “via API” (a), sem docs públicas | Dado de medição de alta resolução | GreenAnt exclusiva da TYR desde 2026 ✔: sai da lista de parceiros neutros |
| **Way2** | Distribuidoras, geradoras, gestoras | Coleta e gestão de medição, faturas, notificações de migração | Enterprise | Medição de fronteira, faturas | NP | — | NV | Incumbente de medição no setor | Não atende o comprador de flexibilidade |
| **Clarke (Energisa)** | Grupo A, PMEs e médias | Diagnóstico, concorrência entre ~60 fornecedores, gestão | Inbound, calculadoras, parcerias (ex.: iFood, 2021) | Faturas do cliente | Comissão do fornecedor; success fee 30% (2021) ✔ | Gestora (representação conforme o caso; NV) | NV | Marketplace + gestão + capital da Energisa | Conflito potencial (controlador é fornecedor); escala modesta (200 GWh/ano em 2024) |
| **Esfera (Auren) – hud Cotação** | Empresas ACL, comercializadoras | RFQ digital entre mais de 130 comercializadoras + gestão | Base de 570 grupos, convite | Pedidos de cotação, contratos geridos | Gratuito (2021) ✔ | Gestora/comercializadora | NV | Rede de comercializadoras, trilha de auditoria | Pertence a gerador/comercializador (Auren); status atual NV |
| **UC Livre / Info Energia / WisePower** | PMEs, Grupo A | Lead-gen: comparar ofertas, contratar | SEO, mídia | Conta de luz enviada pelo usuário | “Gratuito” para o consumidor ✔; receita NP | NV | NV | Simples | Maturidade baixa (Info Energia com lorem ipsum ✔) |
| **Thunders** | Comercializadoras, varejistas, gestoras, geradoras, distribuidoras | ETRM, book/posição, varejo até conta gráfica, integração CCEE | Enterprise | Dados operacionais do cliente + CCEE | NP | — | Integração CCEE/ERP (a); API pública NV | Foco Brasil, módulos de varejo e gestora | Sem módulo de RD/flexibilidade (NV) |
| **Dcide / Norus / PSR** | Comercializadoras, geradoras, grandes consumidores | Preço, risco, carteira, consultoria quantitativa | Enterprise, consultoria | Dados de mercado | NP | — | NV | Modelagem quantitativa | Não tocam originação de clientes nem RD (NV) |

---

## 4. Análise por hipótese

### H1 — Marketplace/RFQ genérico de energia no ACL
- **Com quem compete:**
  1. **BBCE**, no atacado: tela, Boleta para negócios fechados fora da tela, Leilões, e um módulo de RFQ que aparece na API pública (endpoints `rfq/report/*`) [CON-R4] (`CONFIRMADO` que existe; funcionamento comercial do RFQ `NÃO VERIFICADO`).
  2. **N5X**: tela e boleta [CON-R10].
  3. **Gestoras com RFQ próprio** no lado do consumidor: hud Cotação (Esfera/Auren) e Clarke (Energisa) [CON-R19, CON-R21].
  4. **Substituto dominante:** relacionamento bilateral, telefone, e-mail e brokers. A própria Esfera descrevia a cotação como “manual, por e-mail, telefone ou Skype” (snippet) (`NÃO VERIFICADO`).
- **Barreiras:** contraparte precisa ser agente CCEE/ANEEL e ter limite bilateral mínimo de R$ 70 mil ou 672 MWh [CON-R7]. Crédito e garantias são o gargalo real, e a onda de recuperações judiciais de 2026 [CON-R33] reforça a seletividade de contraparte (`INFERÊNCIA`).
- **Veredito:** **saturação alta.** Um marketplace genérico seria uma 3ª ou 4ª camada de cotação sem liquidez, sem crédito e sem autorização. Só faz sentido como **ferramenta de workflow que alimenta a BBCE** (via Boleta/API) ou como software de RFQ para gestoras, nunca como bolsa paralela (`INFERÊNCIA`).

### H2 — Marketplace de capacidade de RD industrial
- **Com quem compete:** a AXIA (agregadora com plataforma gratuita por 12 meses, ≥1 MW) [CON-R13, CON-R14]; outras comercializadoras que anunciam serviço de RD, como a Simple Energy, sem volume comprovado [CON-R16]; e a **participação direta** dos grandes consumidores nos mecanismos do ONS [CON-R17, CON-R18].
- **Liquidez de compradores:** pouquíssimos agregadores ativos com evidência pública: AXIA e, antes dela, a Eletrobras em 2024 [CON-R15, CON-R16b]. O mecanismo de disponibilidade de 2026 teve 12 ofertas vencedoras [CON-R17].
- **Veredito:** **saturação baixa em número de concorrentes, mas o mercado endereçável é estreito.** O incumbente oferece de graça o que o marketplace faria (simulação, adesão, oferta). Um marketplace “indústria → várias agregadoras” não tem agregadoras suficientes para leiloar (`INFERÊNCIA`).

### H3 — SaaS/API de pré-qualificação de flexibilidade para agregadoras/comercializadoras
- **Existe alguém vendendo isso?** **Não encontrei** fornecedor brasileiro com produto de originação/pré-qualificação de flexibilidade vendido a terceiros (`NÃO VERIFICADO` como ausência). Adjacências:
  - AXIA: solução **própria**, interna [CON-R14];
  - TYR+GreenAnt: medição com intenção de RD/VPP, agora **cativa** de uma comercializadora [CON-R25, CON-R26];
  - Thunders: varejo e gestora, sem RD declarado [CON-R34];
  - Way2: medição [CON-R29].
  Agregadores internacionais (Voltus, CPower) aparecem só como referência em artigo de opinião (`NÃO VERIFICADO`).
- **Riscos:** poucos compradores (dá para contá-los nos dedos, `INFERÊNCIA`), “build vs buy” (a AXIA já construiu), dependência de dados de medição de 15 min/horários que hoje vêm de medidores próprios ou do SCDE, e de consentimento. As APIs do Open Energy só chegam em até 24 meses [CON-R11].
- **Veredito:** **espaço em branco real, mas estreito.** O potencial EPE de 8,8 GW (pv magazine, 22/09/2026, `NÃO VERIFICADO` neste documento) contrasta com cerca de 344 MW contratados. O valor estaria em: (i) diagnóstico de flexibilidade a partir de curva de carga e faturas; (ii) linha de base e simulação de receita; (iii) dossiê padronizado para o agregador. É preciso validar a disposição a pagar com AXIA, comercializadoras médias e gestoras antes de construir (`HIPÓTESE`).

### H4 — Ferramenta de gestão/cotação de energia para empresas
- **Existe comparador/cotador? Quão saturado?** Sim, e **muito saturado**:
  - privados: Clarke/Energisa, hud/Esfera/Auren, UC Livre, Info Energia, WisePower;
  - simuladores gratuitos em praticamente toda comercializadora e gestora (Simple, Comerc, TYR);
  - **comparador oficial gratuito da CCEE** previsto até ~11/2027 [CON-R11, CON-R12].
  A distribuição já foi capturada por grupos de geração e distribuição: Energisa→Clarke, Auren→Esfera, Vibra→Comerc [CON-R19, CON-R23] (`CONFIRMADO`).
- **Modelo de receita disponível:** comissão do fornecedor e/ou % da economia [CON-R19, CON-R20]. Quando o comparador oficial for gratuito e neutro, a comissão por lead tende a cair (`INFERÊNCIA`).
- **Veredito:** **saturação muito alta para “comparar preço”.** Sobra espaço apenas para camadas que o comparador oficial não cobre (`HIPÓTESE`): análise de risco de contraparte do fornecedor (pós-crise 2026), modelagem de flexibilidade contratual e consumo, e automação para gestoras usando as APIs do Open Energy quando existirem.

### Saturação resumida

| Hipótese | Concorrentes diretos com evidência | Substitutos | Saturação | Espaço em branco |
|---|---|---|---|---|
| H1 | BBCE, N5X, hud/Esfera, Clarke | Bilateral/brokers | **Alta** | Workflow pré-BBCE para gestoras (fraco) |
| H2 | AXIA (gratuita 12 meses), participação direta | Consultorias de RD | **Baixa em players, mercado pequeno** | Pouco: o incumbente cobre |
| H3 | Nenhum produto vendido a terceiros encontrado | Soluções internas (AXIA), TYR+ cativa | **Baixa** | **Maior espaço**, mas com poucos compradores |
| H4 | ≥6 privados + CCEE oficial (2027) | Simuladores gratuitos | **Muito alta** | Risco de contraparte; automação pós-APIs (≥2028) |

---

## 5. Lacunas e pendências

1. **Tabela de preços BBCE vigente (2026):** só a versão de 2023 foi lida. Consequência: o custo de integração BBCE para um cliente comercializador está estimado com dados de 3 anos atrás.
2. **Número atual de participantes da BBCE e do EHUB:** os contadores da página EHUB são renderizados por JavaScript e vieram como “0” no HTML. O “~300 empresas” é antigo.
3. **Funcionamento comercial do módulo RFQ da BBCE:** só os endpoints de relatório foram vistos. É preciso confirmar se o RFQ aceita consumidores não agentes.
4. **Liquidação efetiva de RD agregada (AXIA) e qualquer atuação da Simple Energy:** é preciso cruzar com dados da CCEE (contabilização do Módulo 25) e do ONS. O portal CCEE de RD deu 403.
5. **Lista de agregadores cadastrados na CCEE:** não encontrada.
6. **Preço pós-carência da AXIA (revenue share?):** não público. Perguntar em entrevista.
7. **Modelo de cobrança de gestoras (fee mensal por UC, % da economia atual):** sem fonte pública recente. Buscar editais com valor homologado e fazer entrevistas.
8. **APIs Way2, Thunders, GreenAnt/TYR:** sem documentação pública. Não planejar integração.
9. **Status atual do hud Cotação (Esfera) e da operação de marketplace da Clarke após as aquisições.**
10. **Texto oficial da REN 1.175/2026:** número e data de publicação vieram da imprensa.
11. **Empresas citadas na encomenda e não confirmadas:** “Migra”, “Energês” (busca sem resultado) e Mitsidi (atuação atual). Tradener existe, mas está em recuperação judicial [CON-R33]; não foi perfilada como concorrente de software.
12. O site safira.com.br retornou conteúdo de spam (anúncio de relógio) no download. Pode ter sido comprometido ou redirecionado. Sem conclusão.

---


## Referências

Ver `REFERENCIAS.md`, seção CON.
