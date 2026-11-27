# Pesquisa de clientes e problemas — Seção 2.2 do PLANO.md

> **Status:** pesquisa documental (desk research) concluída em 27/11/2026. **VALIDAÇÃO COM CLIENTES PENDENTE.** Nenhuma entrevista foi feita. Este documento não traz depoimentos, clientes ou intenções de compra. Tudo o que depende da voz do cliente está marcado como `HIPÓTESE` e precisa passar pelos roteiros da seção 5.
>
> **Data de consulta de todas as fontes:** 27/11/2026.
> **Rótulos:** `CONFIRMADO` = consta em fonte primária ou em fonte séria com dado explícito · `INFERÊNCIA` = dedução lógica a partir de fontes confirmadas · `HIPÓTESE` = suposição a testar em entrevista · `NÃO VERIFICADO` = dado não encontrado ou sem fonte confiável.
> Referências citadas como [R#] (tabela na seção 8).
> Este arquivo é insumo para o entregável `docs/02-CLIENTES-E-PROBLEMAS.md`.

---

## 1. Resumo executivo

1. **O problema mais claro, e que já gera pagamento, é a aquisição de clientes pelas comercializadoras varejistas.** O varejo cresce: são 144 varejistas habilitados e 45.982 cargas sob varejistas, de 91.970 cargas no ACL, em maio/2026 [R1] (`CONFIRMADO`). A Engie declarou que 95% das suas novas vendas vêm de parceiros [R7] (`CONFIRMADO`, 2024). A Cemig remunera parceiros de forma recorrente [R9] e a Comerc mantém um programa de indicação [R5] e uma parceria de originação com o Itaú [R10] (`CONFIRMADO`). Ou seja, já existe orçamento para originação. **O valor por cliente pequeno é baixo, porém.** O programa da Comerc paga até R$ 2.000 (um mês de taxa de gestão) ou um cupom de R$ 1.000 por indicação válida [R5] (`CONFIRMADO`). E a regra exclui leads que a Comerc já tenha prospectado nos 60 dias anteriores, o que mostra que há disputa por leads.
2. **Há uma ameaça regulatória datada a um comparador/RFQ genérico (H1/H4).** A REN ANEEL nº 1.175/2026 (publicada no DOU em 04/11/2026) cria o Open Energy [R11][R12] (`CONFIRMADO`). Em até 12 meses devem existir o acesso padronizado aos dados e a plataforma de comparação de produtos e preços de varejistas operada pela CCEE. Em até 24 meses, o compartilhamento via API com consentimento. A migração simplificada cai de 180 para 90 dias para a maior parte das unidades AS/A4 [R12]. Um portal privado que só compare preços tende a ficar redundante por volta do fim de 2027 (`INFERÊNCIA`).
3. **A Resposta da Demanda (RD) é real, mas pequena, concentrada e regulatoriamente provisória.** Em 2026 foram contratados 344 MW de 12 agentes, contra 229 MW em 2025 [R14][R15] (`CONFIRMADO`). Associadas da ABRACE ficaram com cerca de 70%; quatro grupos (Ferbasa, Gerdau, Grupo Maringá, Rima) somam 240 MW; metalurgia responde por 86% [R14][R15]. O produto "Disponibilidade" vive em sandbox autorizado até 31/12/2026 (REA 12.600/2022) [R17]. A extensão até 2030 foi **proposta** pelo ONS, mas não está aprovada [R16] (`CONFIRMADO` como proposta; aprovação `NÃO VERIFICADO`). A oferta mínima é de 5 MW por hora, com agregação [R16].
4. **Há poucos agregadores, e eles já têm ferramenta.** A Axia (ex-Eletrobras) lançou em jan/2026 uma plataforma de agregação de RD com Google Cloud, gratuita por 12 meses para os primeiros consumidores [R19]. Ela ofertou 15 MW agregados em out/2026 [R18] (`CONFIRMADO`). Pela regra da CCEE, um varejista pode ser agregador das UCs que representa **sem anuência delas** [R13] (`CONFIRMADO`, Submódulo 9.1 rev. 1.0, vigente desde 28/04/2026). Isso fecha boa parte do mercado de "leads de RD" para terceiros (`INFERÊNCIA`).
5. **As consultorias e gestoras de energia são ao mesmo tempo o canal natural e o concorrente direto.** Elas cobram fee fixo, percentual da economia ou comissão embutida paga pela comercializadora [R20] (`CONFIRMADO` como modelos). Valores públicos e independentes: `NÃO VERIFICADO`.
6. **Nenhuma das quatro hipóteses H1–H4 tem disposição a pagar comprovada.** O próximo passo obrigatório são entre 25 e 40 entrevistas, seguindo a seção 5, antes de qualquer decisão da Etapa B.

---

## 2. Fatos de mercado que sustentam a análise

| # | Fato | Status | Ref. |
|---|---|---|---|
| F1 | 91.970 cargas no ACL; 45.982 sob varejistas; 144 varejistas habilitados; 16.406 agentes na CCEE; ACL = 42,9% do consumo (dados de maio/2026) | CONFIRMADO | [R1] |
| F2 | Ciclo 2026 de classificação de comercializadoras: 317 do Tipo 1 e 121 do Tipo 2 (438 classificadas); 77 sem demonstrações obrigatórias | CONFIRMADO | [R2] |
| F3 | A CCEE manteve a exclusão de duas varejistas (2W Varejista e Diferencial) por inadimplência, com desligamento em 01/07/2026 | CONFIRMADO (manchete) | [R3] |
| F4 | Migração para o ACL caiu 36,5% no 1º tri/2026 (4.827 consumidores); preço de longo prazo subiu de R$ 147/MWh (2024) para R$ 233/MWh (2026) segundo a ABRACEEL | CONFIRMADO (fonte secundária) | [R4] |
| F5 | Garantia financeira típica do varejo (Comerc, "Desconto Garantido"): 3 vezes a fatura média prevista, incluindo ICMS, em fiança bancária ou seguro garantia. Sem garantia, o desconto pode cair até 20% | CONFIRMADO (um único contrato-padrão; não generalizável) | [R6] |
| F6 | Seguro garantia de energia custa de 0,5% a 2% ao ano do valor garantido | NÃO VERIFICADO (blog de corretora) | [R21] |
| F7 | Contratos de comercialização da Engie duram em média de 4 a 5 anos; três produtos padronizados para novos entrantes | CONFIRMADO (declaração da empresa) | [R7] |
| F8 | Unidades com menos de 500 kW precisam ser representadas por varejista; adequação de medição leva de 30 a 60 dias; flexibilidade contratual típica de 5% a 10% do volume | CONFIRMADO (texto de vendedor) | [R20] |
| F9 | EPE: potencial de RD de 5,86 / 8,79 / 13,05 GW (cenários). Indústria (aço, alumínio, alumina, cimento, cloro, papel, ferroligas, data centers) = 4,13 GW no cenário de referência; cogeração = 4,66 GW | CONFIRMADO (via imprensa; nota técnica original não lida) | [R22] |
| F10 | RD 2026: lances vencedores de R$ 23.375 a R$ 39.000 por MW pelo período (83 dias úteis, set–dez/2026); desconto médio de 49,23% sobre o teto; até 2 acionamentos por mês; região SE/CO = 61%, NE = 35% | CONFIRMADO | [R15] |
| F11 | Programa estrutural de RD: aviso D-1, ofertas semanais e confirmação diária de disponibilidade | CONFIRMADO | [R13] |

**Conta ilustrativa (`INFERÊNCIA`, unidades explícitas).** Uma oferta mínima de 5 MW no produto Disponibilidade de 2026 rende de 5 × R$ 23.375 = **R$ 116.875** a 5 × R$ 39.000 = **R$ 195.000 pelo período inteiro** (set–dez/2026), antes da fatia do agregador e dos custos de não entrega. Isso não é R$/MWh e não pode ser anualizado: não há garantia de novo certame em 2027 (ver item 3 do resumo). Para comparação, a fatura de uma carga de 5 MW médios ao preço de longo prazo de R$ 233/MWh [R4] fica perto de 5 MW × 730 h × R$ 233 ≈ **R$ 850 mil/mês só de energia** (`INFERÊNCIA`). A renda de RD equivale a cerca de 4% a 6% de um mês de energia em um ano. É relevante para eletrointensivos que conseguem cortar carga sem perder produção, e marginal para os demais.

---

## 3. Análise por segmento

### 3.1 Indústrias e consumidores

**Dados que possuem (`INFERÊNCIA`, confirmar em entrevista e em 01-MERCADO.md):**
- Faturas da distribuidora (TUSD, demanda contratada, ultrapassagem, reativos). Todo consumidor do Grupo A tem.
- Contrato de uso do sistema de distribuição (CUSD), com a demanda contratada por posto horário.
- Memória de massa (medição de 15 em 15 minutos), no caso de consumidores livres com SMF integrado ao SCDE/CCEE. Também pode vir da distribuidora, mediante pedido. O Open Energy vai padronizar o acesso a "consumo, faturamento e medição" [R12] (`CONFIRMADO` quanto ao escopo anunciado; formato `NÃO VERIFICADO`).
- Dados de processo (SCADA/MES, produção por turno): só em plantas maiores; é dado sensível.

**Quem decide (`HIPÓTESE`; não há fonte pública sistemática):**
- Grandes consumidores (ABRACE, maior que 10 MW médios): área de energia/utilidades ou suprimentos de energia, com aprovação de diretoria financeira. A ABRACE reúne quem participa da RD [R14].
- Médios (de 0,5 a 5 MW): gerente industrial/de manutenção mais compras, com aprovação do CFO ou do dono. Muitas vezes a gestora contratada é quem recomenda.
- PMEs A4 com menos de 500 kW: dono ou financeiro. Decisão por desconto na fatura, via varejista ou parceiro [R7].

**Autorização de dados:** procuração ou contrato de representação na CCEE, com renovação de procuração prevista em contrato [R6] (`CONFIRMADO`). Para RD, a anuência da UC Agregada é dada no sistema da CCEE [R13] (`CONFIRMADO`). No Open Energy, o consentimento será revogável e terá trilha de acessos [R11][R12] (`CONFIRMADO`, ainda não operacional).

**Processos com flexibilidade:**
- Comprovada em leilão: metalurgia e ferroligas (86% da RD de 2026), madeira, papel e celulose e química (4% cada) [R15] (`CONFIRMADO`). Com potencial estimado pela EPE: aço, alumínio, alumina, cimento (moagem), cloro-soda, papel e ferroligas, além de data centers [R22] (`CONFIRMADO` como estimativa).
- Sem evidência pública no Brasil: câmaras frias, saneamento e bombeamento (a busca não achou participação de saneamento na RD do ONS), mineração (fora de ferroligas) e data centers como participantes efetivos (`NÃO VERIFICADO`).

**Riscos de produção aceitos (`HIPÓTESE`):** perda de produção (fornos, eletrólise), qualidade e retrabalho, horas extras de turno, multas contratuais por atraso de entrega. O acionamento ocorre na janela das 18h às 22h em dias úteis [R23], com até 2 acionamentos por mês [R15].

**Por que cadastrariam "ofertas" (`HIPÓTESE`):** (a) reduzir o custo de energia na renovação ou na migração; (b) receita de RD; (c) comparar propostas sem depender da gestora atual. Contraponto: em 2026 a migração caiu 36,5% e os preços no ACL subiram [R4]. A economia de migrar ficou menor, e o "por que agora" ficou mais fraco (`INFERÊNCIA`).

**Economia ou renda esperada:** a ABRACEEL fala em economia média histórica de 18% frente ao cativo (via imprensa, `NÃO VERIFICADO` na fonte primária) [R24]. A renda de RD está na conta ilustrativa da seção 2.

### 3.2 Comercializadoras e varejistas

- **Número de agentes:** 438 comercializadoras classificadas em 2026 [R2]; 144 varejistas habilitados [R1] (`CONFIRMADO`).
- **Quem compra a solução internamente (`HIPÓTESE`, sustentada por vagas e notícias):** para originação e PMEs, diretoria comercial/varejo e canais. Vagas publicadas pedem "prospecção de clientes e parceiros no ACL", "elaboração de propostas comerciais" e "gestão de carteira" [R25] (`CONFIRMADO` como perfis de vaga; anúncios agregados, sem empresa identificável em todos os casos). Para dados e integração, TI e produto digital (a Engie tem canais digitais [R7]; a Axia fez parceria com o Google Cloud [R19]). Trading e portfólio decidem preço, não compram leads.
- **Como originam hoje:** força direta para os grandes; parceiros com carteira B2B para os menores (corretoras de seguros, telefonia, manutenção elétrica) [R7]; bancos (Itaú → Comerc) [R10]; programas de indicação para clientes e parceiros [R5][R9] (`CONFIRMADO`).
- **Comissões de indicação:**
  - Comerc: até R$ 2.000 de desconto em um mês de gestão, ou até 2.640 RECs, ou cupom de R$ 1.000, conforme o tipo de cliente (vigência de 15/06 a 31/12/2026) [R5] (`CONFIRMADO`).
  - Cemig Sinergia: remuneração "triplicada", 100% paga na assinatura e recorrente para parceiros exclusivos durante todo o contrato [R9] (`CONFIRMADO` qualitativamente; valores `NÃO VERIFICADO`).
  - Uma matéria fala em comissões de R$ 14 mil por contrato [R26]: `NÃO VERIFICADO`, fonte de baixa confiabilidade.
- **Crédito e cotação:** garantia de 3 vezes a fatura média [R6]; risco de inadimplência levado a sério, como mostram as exclusões de varejistas na CCEE [R3] (`CONFIRMADO`). Para cotar, entram perfil de consumo (memória de massa ou 12 faturas), submercado, prazo, flexibilidade (de 5% a 10%) [R20] e rating/balanço do cliente (`INFERÊNCIA` para os itens sem referência).
- **Custo de aquisição (CAC):** `NÃO VERIFICADO`. Piso observável: o valor do programa de indicação, de R$ 1.000 a R$ 2.000 por cliente pequeno [R5]. Para grandes contas, o custo é dominado pelo tempo de executivos (`HIPÓTESE`).

### 3.3 Agregadoras habilitadas de RD

- **Quantas existem:** não há lista pública consolidada (`NÃO VERIFICADO`). Em 2026 foram 12 agentes contratados, somando autorrepresentados e agregadores [R14]. Agregadores citados publicamente: Axia [R18][R19], Electra ("primeira agregadora", data `NÃO VERIFICADO`, página com acesso bloqueado) [R27] e 2W (plataforma de usinas virtuais) [R28] (`CONFIRMADO` como anúncios).
- **Quem pode ser agregador:** agente da CCEE como consumidor, comercializador ou gerador, adimplente, com perfil exclusivo de RD [R13]. A UC Agregada pode cancelar a representação sem anuência [R13] (`CONFIRMADO`).
- **O que comprariam (`HIPÓTESE`):** (a) leads de cargas de 1 a 5 MW com flexibilidade comprovada; (b) pré-qualificação técnica (linha de base, histórico de 15 min, teste de corte); (c) monitoramento de disponibilidade e telemetria para a confirmação diária D-1 [R13]; (d) software de operação. O item (d) concorre com a plataforma gratuita da Axia [R19] e é de baixa prioridade.
- **O que continua com o agregador (`CONFIRMADO` pela regra):** representação na CCEE, ofertas ao ONS, obrigações financeiras da RD [R13] e adimplência.

### 3.4 Consultorias e gestoras de energia

- **Modelos de remuneração:** fee fixo, percentual da economia, comissão embutida paga pela comercializadora e modelos híbridos [R20] (`CONFIRMADO` como modelos descritos; texto de uma vendedora, a Serena). A faixa de "1% a 2% do custo de energia" apareceu sem fonte identificável: `NÃO VERIFICADO`. Pelo cap do programa da Comerc, um mês de taxa de gestão de PME custa até cerca de R$ 2.000 [R5] (`INFERÊNCIA`).
- **Papel:** canal (já têm carteira, procuração e confiança), concorrente (fazem RFQ manual para os clientes), integrador (operam medição e CCEE) ou primeiro cliente (ferramentas de produtividade). As gestoras ligadas a comercializadoras (Comerc, Serena) dão gestão gratuita a quem compra energia delas [R20] (`CONFIRMADO`). Isso pressiona o preço das independentes (`INFERÊNCIA`).

### 3.5 Tabela comparativa por segmento

| Dimensão | Indústrias/consumidores | Comercializadoras/varejistas | Agregadoras de RD | Consultorias/gestoras |
|---|---|---|---|---|
| Problema hoje | Custo de energia alto e crescente; pouca transparência na renovação; RD exige 5 MW e operação D-1 [R16][R13] (CONFIRMADO). Dor percebida: HIPÓTESE | Originar clientes de forma rentável no varejo em expansão (CONFIRMADO [R1][R7]); risco de crédito (CONFIRMADO [R3][R6]) | Achar cargas flexíveis confiáveis e manter a disponibilidade diária (INFERÊNCIA [R13][R18]) | Escalar a carteira com equipe enxuta; compressão de fee pela gestão gratuita das comercializadoras (INFERÊNCIA [R20]) |
| Custo do problema | Energia ≈ R$ 850 mil/mês para 5 MWmed (INFERÊNCIA); RD perdida de R$ 117 a 195 mil por período para 5 MW (INFERÊNCIA, F10) | Pagam de R$ 1 a 2 mil por indicação de PME [R5]; comissões recorrentes [R9] (CONFIRMADO); CAC total NÃO VERIFICADO | Margem sobre R$ 23 a 39 mil/MW/período (CONFIRMADO [R15]); fatia retida NÃO VERIFICADO | Horas de analista por cotação (HIPÓTESE) |
| Alternativa atual | Gestora/consultoria; varejista direto; parceiros [R7][R20] | Força própria, parceiros, bancos, indicação [R5][R7][R10] | Carteira própria (varejista agrega sem anuência [R13]); plataforma Axia [R19] | Planilhas, e-mail, RFQ manual (HIPÓTESE) |
| Frequência | Renovação a cada 4–5 anos [R7]; RD anual (certames de 2025 e 2026); fatura mensal | Contínua (pipeline mensal) | Semanal e diária na operação de RD [R13]; anual na captação | Contínua |
| Dono do orçamento | Utilidades/energia ou CFO (HIPÓTESE) | Diretoria comercial/varejo/canais (HIPÓTESE, [R25]) | Diretoria de RD/flexibilidade ou comercial (HIPÓTESE) | Sócio/fundador (HIPÓTESE) |
| Custo de aquisição estimado (para nós) | Alto: venda consultiva, procuração, confiança (HIPÓTESE) | Médio: cerca de 438 alvos [R2], venda B2B de 3 a 9 meses (HIPÓTESE) | Baixo volume (algumas dezenas de alvos, INFERÊNCIA [R14]), venda rápida se houver certame | Baixo a médio: muitas empresas pequenas (NÃO VERIFICADO o número) |
| Ciclo comercial | 3–12 meses; migração de 90–180 dias [R12] | 3–9 meses para piloto (HIPÓTESE) | Atrelado ao calendário do ONS (inscrições em jul/2026 [R23]) | 1–3 meses (HIPÓTESE) |
| Sensibilidade regulatória | Média (consentimento, LGPD, Open Energy) | Alta: Open Energy e comparador da CCEE [R11][R12] | Muito alta: sandbox até 31/12/2026 [R17]; extensão pendente [R16] | Média |
| Confiança necessária | Muito alta (dados de produção, procuração) | Alta (qualidade e crédito do lead; não conflitar com os canais) | Muito alta (uma não entrega gera penalidade e reputação ruim) | Alta (medo de desintermediação) |

---

## 4. Leitura por hipótese (H1–H4)

| Hipótese | Evidência a favor | Evidência contra | Primeiro comprador mais plausível | Status |
|---|---|---|---|---|
| H1 RFQ ACL | Comercializadoras pagam por originação [R5][R7][R9] | Comparador oficial da CCEE em até 12 meses [R12]; valor de indicação baixo [R5]; canais já estabelecidos | Varejista independente de médio porte, sem rede de parceiros, pagando por lead qualificado ou contrato assinado | HIPÓTESE |
| H2 Marketplace RD | Mercado cresce de 229 para 344 MW [R14]; Axia agrega cargas pequenas [R18] | 12 agentes; concentração em metalurgia [R15]; sandbox expira [R17]; varejista agrega a própria carteira sem anuência [R13] | Comercializadora/varejista que queira virar agregador da própria carteira (compraria qualificação, não marketplace) | HIPÓTESE (fraca) |
| H3 SaaS de pré-qualificação | Operação D-1 e linha de base são exigentes [R13][R16] | Plataforma gratuita da Axia [R19]; poucos compradores; dependência regulatória | Gestora/consultoria com dezenas de consumidores livres querendo oferecer RD como serviço, ou varejista do item H2 | HIPÓTESE |
| H4 Gestão/cotação para empresas | Open Energy vai baratear o acesso a dados [R11]; 46 mil cargas no varejo [R1] | Gestão gratuita embutida nas comercializadoras [R20]; comparador oficial [R12]; PME paga pouco | Consultoria/gestora independente comprando a ferramenta white-label (B2B2B), e não a indústria diretamente | HIPÓTESE |

---

## 5. Roteiros de entrevista (estilo Mom Test, não indutivos)

**Regras para todos os roteiros:**
- Não apresentar a ideia antes do fim.
- Perguntar sobre o passado concreto ("da última vez..."), não sobre intenções futuras.
- Pedir números, documentos e ferramentas reais.
- Não perguntar "você usaria / pagaria?".
- Registrar compromisso real ao final: tempo, dados, introdução a um colega, piloto pago.
- Gravar só com consentimento. Anonimizar segundo a LGPD.

### 5.1 Indústrias e consumidores (gerente de utilidades/energia, compras, CFO)
1. Conte como foi a última vez que a empresa renovou ou contratou energia. Quem participou e quanto tempo levou?
2. Quantas propostas vocês receberam? Como chegaram até vocês?
3. Que dados vocês precisaram enviar? Quem os juntou e quanto tempo isso levou?
4. Hoje, quem acompanha a fatura e a medição? Que ferramenta ou planilha usa?
5. Quanto custa a energia por mês, aproximadamente, e o que aconteceu com esse valor nos últimos 2 anos?
6. Vocês pagam alguém para ajudar na gestão de energia? Como é a remuneração?
7. Nos últimos 12 meses, houve algum momento em que vocês reduziram ou deslocaram o consumo de propósito? O que motivou e o que custou?
8. Qual processo da planta poderia parar 4 horas à noite sem prejuízo? Já fizeram esse teste?
9. Alguém já ofereceu participar da resposta da demanda do ONS? O que aconteceu depois?
10. Quem precisaria aprovar compartilhar dados de medição com um terceiro? Já fizeram isso antes?
11. Qual foi o último problema com energia que fez alguém da diretoria perguntar algo?
12. (Compromisso) Vocês poderiam compartilhar uma fatura anonimizada ou um histórico de 15 minutos para análise?

### 5.2 Comercializadoras e varejistas (diretor comercial/varejo, canais, originação, produto digital)
1. Como chegaram os últimos 10 clientes que vocês fecharam? De que canais?
2. Quanto vocês pagam a um parceiro por cliente fechado? Em que momento e por quanto tempo?
3. Qual o percentual de propostas enviadas que vira contrato? Onde os leads se perdem?
4. Que informação mínima vocês precisam para cotar? Quanto tempo leva entre receber o lead e enviar a proposta?
5. Conte o último caso de cliente reprovado no crédito. O que faltou?
6. Que ferramentas vocês usam para gerenciar leads e propostas (CRM, portal, planilha)? Quem as escolheu?
7. Já compraram leads ou dados de terceiros? Como foi a experiência?
8. Como vocês veem a plataforma de comparação da CCEE prevista no Open Energy? O que já planejaram em relação a ela?
9. Vocês atuam ou pretendem atuar como agregadores de RD da própria carteira? O que falta para isso?
10. Quem tem orçamento para canais ou ferramentas comerciais? Qual foi a última compra desse tipo e de quanto?
11. Quais leads vocês não querem receber de jeito nenhum?
12. (Compromisso) Vocês topariam um piloto com X leads qualificados e preço por contrato fechado?

### 5.3 Agregadoras habilitadas de RD
1. Conte como vocês montaram a carteira ofertada no último certame. Quantas UCs, quantos MW, quanto tempo levou?
2. Onde vocês encontraram as cargas? Que proporção veio da própria carteira de energia?
3. Quantas cargas avaliadas foram descartadas, e por quê?
4. Como vocês verificam que a carga consegue reduzir de verdade? Que dado usam?
5. Como fazem a confirmação diária de disponibilidade? Quem faz e com que ferramenta?
6. Algum cliente já falhou na entrega? O que custou e como foi resolvido?
7. Como é dividida a receita com o consumidor? Fixa ou variável?
8. O que mudaria para vocês se o sandbox não for prorrogado em 2027?
9. Que parte da operação vocês já terceirizam ou gostariam de terceirizar?
10. Qual foi o último software ou serviço que compraram para RD, e por quanto?
11. (Compromisso) Vocês avaliariam uma lista de cargas pré-qualificadas e diriam quais aceitariam?

### 5.4 Consultorias e gestoras de energia
1. Quantos clientes vocês gerenciam, de que porte e em que estados?
2. Como vocês são remunerados hoje: fixo, percentual da economia ou comissão de comercializadora? O que mudou nos últimos 2 anos?
3. Conte como foi a última cotação que fizeram para um cliente. Quantas comercializadoras consultaram e como?
4. Quanto tempo da equipe vai para coletar dados, faturas e medição?
5. Que ferramentas usam (planilhas, software próprio, terceiros)? Quanto pagam?
6. Já perderam algum cliente para a gestão gratuita de uma comercializadora? O que aconteceu?
7. Algum cliente já perguntou sobre resposta da demanda? O que vocês fizeram?
8. Como veem o Open Energy e o comparador da CCEE para o negócio de vocês?
9. Recebem comissão de comercializadoras? Como isso é comunicado ao cliente?
10. O que impediria vocês de usar uma ferramenta de terceiros com dados dos seus clientes?
11. (Compromisso) Vocês poderiam testar o fluxo com 2 ou 3 clientes reais, com consentimento?

---

## 6. Perfis-alvo para entrevistas (sem nomes de pessoas)

| Segmento | Cargos | Tipo/tamanho de empresa | Região | Meta de entrevistas |
|---|---|---|---|---|
| Indústria grande | Gerente de energia/utilidades; suprimentos de energia; diretor industrial | Eletrointensivos (ferroligas, siderurgia, alumínio, cimento, cloro-soda, papel e celulose, química), carga maior que 5 MW, perfil de associada ABRACE | SE/CO e NE (96% da RD 2026 [R15]); MG, BA, SP | 6–8 |
| Indústria média | Gerente de manutenção/industrial; controller/CFO; compras | Consumidor livre ou especial de 0,5 a 5 MW; alimentos, plásticos, têxtil, câmaras frias | SP interior, PR, SC, MG | 6–8 |
| PME A4 | Dono/financeiro | Menos de 500 kW, migrando via varejista | SP | 3–4 |
| Comercializadora/varejista | Diretor comercial/varejo; gerente de canais/parceiros; head de produto digital; analista de crédito | Varejistas independentes de médio porte; braços de geradoras; comercializadoras Tipo 2 | SP, RJ, MG, SC | 6–8 |
| Agregador de RD | Gerente de flexibilidade/RD; gerente de operações de mercado | Agentes contratados em 2025/2026; varejistas com intenção de agregar | SP, RJ | 3–5 |
| Consultoria/gestora | Sócio-fundador; gerente de contas; analista de mercado | Gestoras independentes de 20 a 300 UCs | SP, MG, PR | 5–6 |

**Canais de contato (com aprovação dos fundadores, regra 8 do PLANO):** LinkedIn por cargo, eventos setoriais (ABRACEEL, ABRACE, ENASE), associações industriais regionais (FIESP/CIESP, FIEMG) e indicação a partir de entrevistados.

---

## 7. Critérios de validação e invalidação

**Hipótese de problema validada (por segmento) se:**
- ≥ 60% dos entrevistados descrevem espontaneamente o problema com um episódio recente (nos últimos 12 meses) e um custo quantificado.
- Existe uma solução de contorno paga (gestora, parceiro, ferramenta, comissão) com valor conhecido.
- ≥ 3 entrevistados por segmento assumem um compromisso real: dados anonimizados, introdução a um decisor ou carta de intenção de piloto.

**Disposição a pagar validada se:** ≥ 2 compradores do mesmo segmento aceitam piloto pago ou condicionado (por exemplo, preço por contrato fechado, ou mensalidade a partir de R$ X definido antes da entrevista), e o orçamento tem dono identificado.

**Hipótese invalidada se:**
- (H1/H4) Comercializadoras dizem que não pagam acima do programa de indicação atual, ou que vão usar o comparador da CCEE, e consultorias não veem ganho de tempo maior que 30%.
- (H2/H3) Menos de 3 agregadores interessados; o sandbox não é prorrogado até 31/12/2026, ou a regra muda a ponto de afastar terceiros; ou varejistas declaram que vão agregar a própria carteira.
- (Indústrias) Ninguém aceita compartilhar dados de medição com um terceiro sem relação prévia.

**Sinais falsos que não contam:** elogios, "parece interessante", "me manda material", ou interesse sem dados ou dinheiro envolvidos.

---

## 8. Lacunas e pendências

1. **VALIDAÇÃO COM CLIENTES PENDENTE.** Nenhuma entrevista realizada.
2. Número e lista de agregadores habilitados de RD na CCEE: `NÃO VERIFICADO`.
3. Percentual da receita de RD que fica com o agregador: `NÃO VERIFICADO`.
4. Valores do Programa Sinergia (Cemig) e de comissões típicas de parceiros: `NÃO VERIFICADO`. O PDF da Agência Minas retornou HTTP 410.
5. CAC das comercializadoras e honorários típicos de gestoras de fonte independente: `NÃO VERIFICADO`.
6. Decisão da ANEEL sobre a prorrogação do sandbox de RD após 31/12/2026: `NÃO VERIFICADO`. **Crítico para H2/H3. Reverificar em dez/2026.**
7. Formato dos dados e das APIs do Open Energy (inclui memória de massa?): `NÃO VERIFICADO`. A regulamentação das APIs ficou para a Agenda Regulatória 2026–2027.
8. Participação de saneamento, câmaras frias e data centers na RD brasileira: `NÃO VERIFICADO`.
9. Regra exata, na revisão 1.0 do Submódulo 9.1, para a UC sob varejista representada por outro agregador: a exigência de anuência do varejista consta de versões anteriores. Reconfirmar no texto vigente.
10. Os cargos decisores na indústria estão baseados em hipótese. Não foram encontradas pesquisas setoriais públicas sobre o tema.

---

## 9. Referências

| # | Título / descrição | URL | Autor | Data de publicação | Data de consulta | Status |
|---|---|---|---|---|---|---|
| R1 | Operação em Movimento: Mercado de Varejo (apresentação) | https://www.ccee.org.br/o/ccee/documentos/CCEE_1360211 | CCEE – Adriana Sambiase | 07/07/2026 | 27/11/2026 | CONFIRMADO |
| R2 | CCEE registra queda de 39% na inadimplência documental... | https://cenarioenergia.com.br/2026/06/11/ccee-registra-queda-de-39-na-inadimplencia-documental-e-prepara-transicao-para-modelo-prudencial-no-mercado-livre/ | Cenário Energia – Daniel Marques | 11/06/2026 | 27/11/2026 | CONFIRMADO |
| R3 | CCEE mantém exclusão de 2W Varejista e Diferencial | https://cenarioenergia.com.br/2026/06/11/ccee-mantem-exclusao-de-2w-varejista-e-diferencial-e-reforca-rigor-contra-inadimplencia-no-mercado-livre-de-energia/ | Cenário Energia | 11/06/2026 | 27/11/2026 | CONFIRMADO (manchete; conteúdo não lido na íntegra) |
| R4 | Entrada de consumidores no mercado livre recua 36,5% / preços ABRACEEL | https://tagdlaw.com.br/?p=10622 ; https://eixos.com.br/energia-eletrica/preco-da-energia-no-mercado-livre-dispara-em-dois-anos-aponta-abraceel/ | TAGD Advogados; eixos (citando CCEE/ABRACEEL) | 2026 (dia NÃO VERIFICADO) | 27/11/2026 | CONFIRMADO (secundário) |
| R5 | Regulamento Programa de Recompensas Comerc 2026 | https://www.comerc.com.br/hubfs/REGULAMENTO_Programa%20de%20Recompensas.pdf | Comerc Energia | Arquivo de 23/07/2026; vigência de 15/06 a 31/12/2026 | 27/11/2026 | CONFIRMADO |
| R6 | Condições Gerais – Desconto Garantido (varejista) | https://comerc.com.br/hubfs/Condi%C3%A7%C3%B5es%20Gerais%20-%20Desconto%20Garantido%20SEM%20SMF%20e%20sem%20encargos_vers%C3%A3o%20visual%20law%2020.01.2025.pdf | Comerc Energia | 20/01/2025 (versão) | 27/11/2026 | CONFIRMADO |
| R7 | Mercado livre exige força comercial próxima aos clientes (Engie) | https://eixos.com.br/energia-eletrica/mercado-livre-exige-forca-comercial-proxima-aos-clientes-diz-diretor-de-comercializacao-da-engie-brasil-energia/ | eixos – Gabriela Ruddy | 10/11/2024 | 27/11/2026 | CONFIRMADO |
| R9 | Cemig lança Programa Sinergia com remuneração triplicada | https://cenarioenergia.com.br/2025/07/15/cemig-lanca-programa-sinergia-com-remuneracao-triplicada-para-parceiros-no-mercado-livre-de-energia/ ; https://www.agenciaminas.mg.gov.br/noticia/cemig-triplica-remuneracao-de-parceiros-no-ambiente-contratacao-livre-com-o-programa-sinergia/ | Cenário Energia; Agência Minas | 15/07/2025 | 27/11/2026 | CONFIRMADO (qualitativo; vigência atual NÃO VERIFICADO) |
| R10 | Comerc fecha parceria com Itaú para crescer no mercado livre | https://braziljournal.com/comerc-fecha-parceria-com-itau-para-crescer-no-mercado-livre-de-energia/ | Brazil Journal – Pedro Arbex | 02/01/2024 (data incerta) | 27/11/2026 | CONFIRMADO |
| R11 | Resolução Normativa ANEEL nº 1.175/2026 | https://www.lex.com.br/resolucao-normativa-aneel-no-1-175-de-27-de-outubro-de-2026/ | ANEEL (reprodução Lex) | 27/10/2026 (DOU de 04/11/2026) | 27/11/2026 | CONFIRMADO (verificar no DOU/ANEEL) |
| R12 | Aneel aprova Open Energy e simplifica migração | https://cenarioenergia.com.br/2026/10/28/aneel-aprova-open-energy-e-simplifica-migracao-para-o-mercado-livre/ | Cenário Energia | 28/10/2026 | 27/11/2026 | CONFIRMADO |
| R13 | Procedimentos de Comercialização – Submódulo 9.1 Resposta da Demanda, rev. 1.0 | https://www.ccee.org.br/documents/80415/31255394/9.1_-_Resposta_da_demanda_v1.0.pdf/69de880d-0969-567a-5f58-a980678b13e6 | CCEE (aprovado pelo Despacho ANEEL nº 1.432/2026) | Vigência 28/04/2026 | 27/11/2026 | CONFIRMADO |
| R14 | Associadas da Abrace respondem por 70% da resposta da demanda | https://agenciainfra.com/blog/associadas-da-abrace-respondem-por-70-da-resposta-da-demanda/ | Agência iNFRA | 06/08/2026 | 27/11/2026 | CONFIRMADO |
| R15 | Resposta da Demanda do ONS bate recorde e contrata 344 MW | https://cenarioenergia.com.br/2026/09/21/resposta-da-demanda-do-ons-bate-recorde-e-contrata-344-mw-de-flexibilidade/ | Cenário Energia | 21/09/2026 | 27/11/2026 | CONFIRMADO |
| R16 | ONS propõe prorrogar sandbox de RD até 2030 | https://tagdlaw.com.br/?p=16141 | TAGD Advogados (origem: MegaWhat) | 05/10/2026 | 27/11/2026 | CONFIRMADO (proposta) |
| R17 | Brazil's experience with availability-based DR procurement under the sandbox (CIGRE C5-11296) | https://www.e-cigre.org/publications/detail/c5-11296-2026-brazils-experience-with-availability-based-demand-response-procurement-under-the-regulatory-sandbox-framework-lessons-learned-and-proposals-for-future-regulatory-enhancements.html | CIGRE (autores NÃO VERIFICADO) | 2026 | 27/11/2026 | CONFIRMADO (resumo; verificar a REA 12.600/2022 na ANEEL) |
| R18 | Axia oferta 15 MW agregados no programa estrutural de RD | https://agenciainfra.com/blog/?p=49353 | Agência iNFRA | 26/10/2026 | 27/11/2026 | CONFIRMADO |
| R19 | Axia lança plataforma de RD com Google Cloud | https://cenarioenergia.com.br/2026/01/29/axia-energia-lanca-plataforma-de-resposta-da-demanda-com-google-cloud-e-amplia-participacao-de-consumidores-no-horario-de-pico/ | Cenário Energia | 29/01/2026 | 27/11/2026 | CONFIRMADO (via resumo de busca) |
| R20 | Consultoria de mercado livre de energia: guia para empresas | https://srna.co/artigos/mercado-livre/consultoria-mercado-livre-energia-empresas/ | Serena Energia – André Lima | 15/11/2026 | 27/11/2026 | CONFIRMADO (fonte interessada) |
| R21 | Seguro garantia compra e venda de energia | https://www.mutuus.net/blog/seguro-garantia-compra-e-venda-de-energia-o-que-e | Mutuus – Francisco Neto | Revisado em 26/08/2026 | 27/11/2026 | NÃO VERIFICADO (fonte interessada) |
| R22 | EPE estima potencial de até 13 GW de resposta da demanda | https://canalsolar.com.br/epe-estima-potencial-ate-13gw-demanda/ | Canal Solar – Wagner Freire | 21/09/2026 | 27/11/2026 | CONFIRMADO (secundário) |
| R23 | ONS recebe inscrições para RD até 10 de julho / janelas 18h–22h | https://tagdlaw.com.br/?p=12865 ; https://canalsolar.com.br/ultimos-dias-proximo-leilao-de-resposta-da-demanda/ | TAGD; Canal Solar | 2026 / 2025 (datas inconsistentes nas páginas) | 27/11/2026 | CONFIRMADO (secundário) |
| R24 | Consumidor livre de energia já economizou R$ 43 bi em 13 anos (ABRACEEL) | https://monitormercantil.com.br/consumidor-livre-de-energia-ja-economizou-r-43-bi-nos-ultimos-13-anos-diz-abraceel/ | Monitor Mercantil | NÃO VERIFICADO | 27/11/2026 | NÃO VERIFICADO |
| R25 | Anúncios de vagas (executivo comercial, inteligência de mercado, gestão de carteira ACL) | https://www.infojobs.com.br/vaga-de-analista-inteligencia-mercado-ii-em-santa-catarina__11809186.aspx ; https://www.vagas.com.br/mapa-de-carreiras/cargos/analista-de-comercializacao | Agregadores de vagas | 2026 (NÃO VERIFICADO) | 27/11/2026 | INFERÊNCIA (resumo de busca; algumas vagas expiradas) |
| R26 | Mercado livre de energia gera comissões de R$ 14 mil... | https://monitordomercado.com.br/noticias/369919-mercado-livre-de-energia-gera-comissoes-de-r-14-mil-para-quem-negocia-contratos-do-proprio-sofa/ | Monitor do Mercado | NÃO VERIFICADO | 27/11/2026 | NÃO VERIFICADO (baixa confiabilidade) |
| R27 | Electra é a primeira agregadora de cargas do programa de redução da demanda | https://brasilenergia.com.br/energia/empresas/electra-e-a-primeira-agregadora-de-cargas-do-programa-de-reducao-da-demanda | Brasil Energia | NÃO VERIFICADO (HTTP 403) | 27/11/2026 | NÃO VERIFICADO |
| R28 | 2W Energia lança plataforma de usinas virtuais | https://brasilenergia.com.br/energia/empresas/2w-energia-lanca-plataforma-de-usinas-virtuais | Brasil Energia | NÃO VERIFICADO | 27/11/2026 | NÃO VERIFICADO (só título) |
