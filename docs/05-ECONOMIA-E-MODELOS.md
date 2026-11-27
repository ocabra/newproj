# 05 — Economia e modelos de negócio (H1–H5)

> **Status:** 27/11/2026. Modelo reproduzível em [`scripts/economia.py`](../scripts/economia.py) (Python 3, só biblioteca padrão). Para alterar uma premissa, edite o script e rode `python3 scripts/economia.py --atualizar`; o bloco entre `BEGIN/END GERADO` abaixo é reescrito.
>
> **Leitura obrigatória antes dos números:** **nenhum preço praticado foi validado com clientes.** Os preços, volumes, CAC e churn são `HIPÓTESE` salvo quando a tabela de premissas cita uma fonte. O modelo não serve para prever faturamento. Ele serve para (1) mostrar **o que precisaria ser verdade** para cada hipótese se pagar, e (2) comparar a ordem de grandeza desse requisito com o mercado real documentado em `01`–`04`. Decisões em `DECISOES.md` D-010 e D-011.

## 1. Método

1. **De baixo para cima:** SAM = número de organizações pagadoras identificáveis (contadas com fonte quando possível); TAM = SAM × preço × 12; SOM = clientes alcançados no mês 24 do cenário base × preço × 12.
2. **Três cenários por hipótese** (pessimista/base/otimista), mudando preço, clientes no mês 24, mês da primeira receita, CAC e churn.
3. **Fluxo de caixa mensal de 24 meses** com custos fixos comuns (jurídico, especialista setorial, contabilidade, infraestrutura, comercial), custos únicos (parecer regulatório + LGPD, abertura, infraestrutura inicial), imposto sobre receita, custo variável por cliente e CAC sobre adições brutas.
4. **Pró-labore dos fundadores** aparece em tabela separada, porque o orçamento informado (R$ 60 mil) cobre só infraestrutura e o plano exige mostrar os demais custos à parte.
5. **Sensibilidade** de ±50% em preço, clientes e CAC, e atraso de 3 meses no início da receita.

Fórmulas completas na docstring do script. Unidades: R$ nominais por mês; em H1 a "unidade" é contrato fechado por mês; em H2 é MW intermediado (potência, não energia), com preço em R$/MW/mês para a plataforma.

## 2. Quem paga, por qual evento, e o que a regulação permite

| Hipótese | Pagador | Evento | Pode ser feito por startup sem habilitação? | O que exigiria habilitação/contrato regulado | Exposição a garantias/multas |
|---|---|---|---|---|---|
| **H1** RFQ ACL | Varejista/comercializadora | Comissão por contrato fechado (modelo "parceiro de canal") | Sim, como intermediação comercial/indicação; **não** como bolsa nem contraparte (`INFERÊNCIA` a partir de ACL-R*, CON-R7) | Negociar em nome do consumidor, registrar contratos, operar na BBCE (só agentes) | Nenhuma se não for contraparte; risco reputacional se o fornecedor indicado quebrar |
| **H2** Marketplace RD | Agregador (repasse) | Fração da receita de RD | **Não** ofertar nem agregar (só agente CCEE, RD-R7) | Virar agente CCEE com perfil de agregador, garantias, adimplência | Alta se agregar: penalidade por não entrega suspende o portfólio (RD §7) |
| **H3** SaaS de pré-qualificação | Agregador/varejista habilitado | Assinatura | Sim, como software; a oferta ao ONS fica com o cliente habilitado | Nada, se a plataforma não ofertar | Baixa; responsabilidade contratual pela qualidade da análise |
| **H4** White-label para gestoras | Gestora/consultoria | Assinatura | Sim | Nada; dados do Open Energy **não** podem ser repassados (OE-R*) | Baixa |
| **H5** Risco de contraparte | Consumidor livre, gestora, comercializadora | Assinatura | Sim, como serviço de informação com dados públicos | Pontos a validar com advogado: regulação de agências de rating (CVM) se aplicável, responsabilidade civil por avaliação negativa, LGPD de sócios PF (ver `_pesquisa/h5-risco-contraparte.md`) | Responsabilidade civil; mitigar com fatos sourced, sem "nota", distribuição privada |

## 3. Defensabilidade (moat) e risco de dois lados

| Hipótese | Vantagem possível | Por que é fraca ou forte | Dois lados? Qual primeiro? |
|---|---|---|---|
| H1 | Rede de consumidores qualificados | Fraca: Clarke/Energisa, Esfera/Auren e comparador oficial gratuito (CON-R19, OE-R*) disputam o mesmo lead | **Sim**; precisa de consumidores antes de vender a varejistas, e o consumidor não paga |
| H2 | Pool de cargas | Fraca: AXIA grátis 12 meses; varejista agrega a própria carteira sem anuência (CLI-R13) | **Sim**, com < 10 compradores; lado comprador concentrado |
| H3 | Qualidade da linha de base e do dossiê | Média, mas mercado de poucos clientes; "build vs buy" (AXIA construiu) | Não (SaaS de um lado) |
| H4 | Integração com fluxo da gestora | Fraca: software de varejo/gestora já existe (CON-R34); comparador oficial | Não |
| H5 | Base histórica curada de eventos de crédito do setor + integração com contratos do cliente | Média: dados públicos são replicáveis, mas curadoria setorial contínua e histórico acumulado não são triviais; **ameaça:** CCEE publicar indicador oficial | Não |

## 4. Resultado do modelo (gerado)

<!-- BEGIN GERADO -->
<!-- GERADO por scripts/economia.py — não editar à mão; altere as entradas no script e rode de novo. -->

### Custos comuns a todas as hipóteses (HIPÓTESE)

| Item | R$/mês |
|---|---:|
| infraestrutura (nuvem, domínio, e-mail, monitoramento, backups) | R$ 1.500 |
| contabilidade | R$ 1.000 |
| jurídico recorrente (termos, contratos, LGPD) | R$ 2.500 |
| especialista setorial (consultor sênior meio período) | R$ 6.000 |
| comercial (viagens, eventos setoriais, CRM) | R$ 3.000 |
| **total sem pró-labore** | **R$ 14.000** |
| pró-labore mínimo de 2 fundadores (cenário à parte) | R$ 16.000 |

| Custo único | Mês | R$ |
|---|---:|---:|
| abertura da empresa e certificados digitais | 1 | R$ 3.000 |
| parecer jurídico regulatório + LGPD + termos de uso | 2 | R$ 30.000 |
| infraestrutura inicial (ambientes, ferramentas, segurança) | 1 | R$ 8.000 |

Imposto sobre receita: 11% (HIPÓTESE); meios de pagamento: 1%.

**Checagem do orçamento de infraestrutura:** R$ 8.000 inicial + R$ 36.000 em 24 meses = R$ 44.000, dentro dos R$ 60.000 informados. Os demais custos (jurídico, especialista, comercial, aquisição, pró-labore) **não** cabem nesse orçamento e aparecem separados abaixo.

### Premissas por hipótese

| Hipótese | Quem paga | Evento de cobrança | SAM (nº de pagadores) | Fonte do SAM | Evidência de preço |
|---|---|---|---:|---|---|
| H1 Marketplace/RFQ de energia no ACL | comercializadora/varejista | comissão por contrato fechado | 144 | 144 varejistas habilitados (CLI-R1, mai/2026, CONFIRMADO); pagador é o varejista | Comerc paga R$ 1–2 mil por indicação de PME (CLI-R5, CONFIRMADO); valor para Grupo A ≥500 kW: HIPÓTESE |
| H2 Marketplace de capacidade de RD industrial | agregador (repasse da receita de RD) | fração da receita de RD intermediada | 12 | 12 ofertas vencedoras no 3º mecanismo (RD-R*, CONFIRMADO); agregadores ativos < 10 (INFERÊNCIA) | Disponibilidade 2026: R$ 23,4–39 mil/MW pelo período (CLI-R15, CONFIRMADO); fração de 5% para a plataforma: HIPÓTESE; produto em sandbox até 31/12/2026 |
| H3 SaaS/API de pré-qualificação de flexibilidade | agregador/varejista/comercializadora habilitado | assinatura mensal | 30 | < 10 agregadores ativos + parcela dos 144 varejistas que venham a agregar (INFERÊNCIA/HIPÓTESE) | nenhuma; AXIA oferece plataforma própria gratuita por 12 meses (CON-R13, CONFIRMADO) |
| H4 Gestão/cotação de energia (white-label para gestoras) | gestora/consultoria de energia | assinatura mensal | 300 | número de gestoras independentes NÃO VERIFICADO; 300 é HIPÓTESE de ordem de grandeza | nenhuma pública; gestoras cobram fee ou % da economia (CLI-R20); comparador oficial gratuito da CCEE até 11/2027 (OE-R*, CONFIRMADO) |
| H5 Monitor de risco de contraparte de fornecedores de energia | consumidor livre (CFO/compras), gestora, comercializadora | assinatura mensal | 5000 | ~46 mil cargas fora do varejo (91.970 − 45.982, CLI-R1, CONFIRMADO) → ~5 mil grupos compradores (HIPÓTESE: ~9 cargas por grupo) + 438 comercializadoras classificadas (CLI-R2) | nenhuma direta; dor CONFIRMADA (RJs 2026, H5-R*); birôs de crédito PJ como substituto |

| Hipótese | Cenário | Preço | Alvo no mês 24 | 1ª receita (mês) | CAC | Churn/mês | Custo var./cliente |
|---|---|---:|---:|---:|---:|---:|---:|
| H1 | pessimista | R$ 1.000 | 2 | 8 | R$ 3.000 | 0,0% | R$ 0 |
| H1 | base | R$ 2.000 | 8 | 6 | R$ 1.500 | 0,0% | R$ 0 |
| H1 | otimista | R$ 5.000 | 25 | 5 | R$ 800 | 0,0% | R$ 0 |
| H2 | pessimista | R$ 0 | 0 | 13 | R$ 5.000 | 0,0% | R$ 0 |
| H2 | base | R$ 125 | 10 | 10 | R$ 3.000 | 0,0% | R$ 0 |
| H2 | otimista | R$ 250 | 40 | 9 | R$ 2.000 | 0,0% | R$ 0 |
| H3 | pessimista | R$ 2.000 | 1 | 9 | R$ 15.000 | 3,0% | R$ 300 |
| H3 | base | R$ 4.000 | 3 | 7 | R$ 12.000 | 2,0% | R$ 400 |
| H3 | otimista | R$ 8.000 | 6 | 6 | R$ 10.000 | 1,0% | R$ 600 |
| H4 | pessimista | R$ 800 | 5 | 6 | R$ 5.000 | 4,0% | R$ 150 |
| H4 | base | R$ 1.500 | 15 | 5 | R$ 4.000 | 3,0% | R$ 200 |
| H4 | otimista | R$ 3.000 | 40 | 4 | R$ 3.000 | 2,0% | R$ 250 |
| H5 | pessimista | R$ 600 | 8 | 5 | R$ 4.000 | 4,0% | R$ 60 |
| H5 | base | R$ 1.200 | 30 | 4 | R$ 3.000 | 2,5% | R$ 80 |
| H5 | otimista | R$ 2.000 | 80 | 3 | R$ 2.000 | 1,5% | R$ 100 |

Notas: em H1 a unidade é *contrato fechado por mês*; em H2 é *MW intermediado* e o preço é R$/MW/mês para a plataforma (5% de ~R$ 30 mil/MW·ano). Todos os preços e alvos são **HIPÓTESE** salvo indicação na tabela anterior.

### TAM / SAM / SOM (de baixo para cima, cenário base)

TAM = SAM × preço base × 12 (receita anual se *todos* os pagadores contratassem). SOM = clientes do mês 24 × preço × 12 (receita anualizada capturável no cenário base). Nenhum valor converte potencial técnico (ex.: 8,8 GW da EPE) em faturamento.

| Hipótese | TAM (R$/ano) | SOM mês 24 (R$/ano) | SOM/TAM |
|---|---:|---:|---:|
| H1 | R$ 34.560.000 | R$ 192.000 | 0,6% |
| H2 | R$ 516.000 | R$ 15.000 | 2,9% |
| H3 | R$ 1.440.000 | R$ 144.000 | 10,0% |
| H4 | R$ 5.400.000 | R$ 270.000 | 5,0% |
| H5 | R$ 72.000.000 | R$ 432.000 | 0,6% |

H1: TAM supõe 10 contratos/mês intermediados por varejista (HIPÓTESE). H2: TAM usa os 344 MW contratados em 2026, não o potencial da EPE.

### Unit economics e fluxo de caixa (sem pró-labore)

| Hipótese | Cenário | Margem contrib./cliente·mês | Payback do CAC (meses) | LTV | Clientes p/ cobrir custo fixo | Receita mês 12 | Receita mês 24 | Caixa acum. mês 12 | Caixa acum. mês 24 | Necessidade de capital |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| H1 | pessimista | R$ 880 | 3,4 | n/a | 20 | R$ 588 | R$ 2.000 | R$ -257.212 | R$ -463.160 | R$ 463.160 |
| H1 | base | R$ 1.760 | 0,9 | n/a | 10 | R$ 5.895 | R$ 16.000 | R$ -240.672 | R$ -344.200 | R$ 344.200 |
| H1 | otimista | R$ 4.400 | 0,2 | n/a | 4 | R$ 50.000 | R$ 125.000 | R$ -67.000 | R$ 662.000 | R$ 137.000 |
| H2 | pessimista | R$ 0 | ∞ | n/a | ∞ | R$ 0 | R$ 0 | R$ -209.000 | R$ -377.000 | R$ 377.000 |
| H2 | base | R$ 110 | 27,3 | n/a | 127 | R$ 250 | R$ 1.250 | R$ -214.560 | R$ -398.200 | R$ 398.200 |
| H2 | otimista | R$ 220 | 9,1 | n/a | 64 | R$ 2.500 | R$ 10.000 | R$ -223.500 | R$ -382.200 | R$ 382.200 |
| H3 | pessimista | R$ 1.460 | 10,3 | R$ 48.667 | 10 | R$ 500 | R$ 2.000 | R$ -224.006 | R$ -406.965 | R$ 406.965 |
| H3 | base | R$ 3.120 | 3,8 | R$ 156.000 | 5 | R$ 4.000 | R$ 12.000 | R$ -222.680 | R$ -354.200 | R$ 354.200 |
| H3 | otimista | R$ 6.440 | 1,6 | R$ 644.000 | 2 | R$ 17.684 | R$ 48.000 | R$ -186.825 | R$ -80.000 | R$ 189.042 |
| H4 | pessimista | R$ 554 | 9,0 | R$ 13.850 | 25 | R$ 1.474 | R$ 4.000 | R$ -215.234 | R$ -383.300 | R$ 383.300 |
| H4 | base | R$ 1.120 | 3,6 | R$ 37.333 | 12 | R$ 9.000 | R$ 22.500 | R$ -205.280 | R$ -277.700 | R$ 277.700 |
| H4 | otimista | R$ 2.390 | 1,3 | R$ 119.500 | 6 | R$ 51.429 | R$ 120.000 | R$ -59.686 | R$ 530.600 | R$ 117.019 |
| H5 | pessimista | R$ 468 | 8,5 | R$ 11.700 | 34 | R$ 1.920 | R$ 4.800 | R$ -240.853 | R$ -429.848 | R$ 429.848 |
| H5 | base | R$ 976 | 3,1 | R$ 39.040 | 16 | R$ 15.429 | R$ 36.000 | R$ -212.686 | R$ -215.420 | R$ 237.221 |
| H5 | otimista | R$ 1.660 | 1,2 | R$ 110.667 | 10 | R$ 72.727 | R$ 160.000 | R$ 21.364 | R$ 917.000 | R$ 106.927 |

### Necessidade de capital com pró-labore mínimo (R$ 16 mil/mês para os dois fundadores)

| Hipótese | Pessimista | Base | Otimista |
|---|---:|---:|---:|
| H1 | R$ 847.160 | R$ 728.200 | R$ 271.500 |
| H2 | R$ 761.000 | R$ 782.200 | R$ 766.200 |
| H3 | R$ 790.965 | R$ 738.200 | R$ 469.825 |
| H4 | R$ 767.300 | R$ 661.700 | R$ 256.029 |
| H5 | R$ 813.848 | R$ 599.420 | R$ 215.509 |

### Sensibilidade (cenário base; caixa acumulado no mês 24, sem pró-labore)

| Hipótese | Base | Preço −50% | Preço +50% | Clientes −50% | Clientes +50% | CAC +50% | Início +3 meses |
|---|---:|---:|---:|---:|---:|---:|---:|
| H1 | R$ -344.200 | R$ -414.600 | R$ -273.800 | R$ -408.600 | R$ -279.800 | R$ -350.200 | R$ -365.320 |
| H2 | R$ -398.200 | R$ -402.600 | R$ -393.800 | R$ -387.600 | R$ -408.800 | R$ -413.200 | R$ -399.850 |
| H3 | R$ -354.200 | R$ -404.360 | R$ -304.040 | R$ -377.600 | R$ -330.800 | R$ -375.260 | R$ -367.160 |
| H4 | R$ -277.700 | R$ -381.650 | R$ -173.750 | R$ -327.350 | R$ -228.050 | R$ -316.250 | R$ -300.200 |
| H5 | R$ -215.420 | R$ -389.660 | R$ -41.180 | R$ -320.210 | R$ -110.630 | R$ -271.670 | R$ -255.965 |

### Fluxo de caixa mensal do cenário base (sem pró-labore)

| Mês | H1 receita | H1 caixa | H2 receita | H2 caixa | H3 receita | H3 caixa | H4 receita | H4 caixa | H5 receita | H5 caixa |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 1 | R$ 0 | R$ -29.000 | R$ 0 | R$ -25.000 | R$ 0 | R$ -26.000 | R$ 0 | R$ -25.000 | R$ 0 | R$ -27.000 |
| 2 | R$ 0 | R$ -77.000 | R$ 0 | R$ -69.000 | R$ 0 | R$ -71.000 | R$ 0 | R$ -69.000 | R$ 0 | R$ -73.000 |
| 3 | R$ 0 | R$ -95.000 | R$ 0 | R$ -83.000 | R$ 0 | R$ -86.000 | R$ 0 | R$ -83.000 | R$ 0 | R$ -89.000 |
| 4 | R$ 0 | R$ -113.000 | R$ 0 | R$ -97.000 | R$ 0 | R$ -101.000 | R$ 0 | R$ -97.000 | R$ 1.714 | R$ -107.891 |
| 5 | R$ 0 | R$ -131.000 | R$ 0 | R$ -111.000 | R$ 0 | R$ -116.000 | R$ 1.125 | R$ -113.160 | R$ 3.429 | R$ -125.496 |
| 6 | R$ 842 | R$ -148.891 | R$ 0 | R$ -125.000 | R$ 0 | R$ -131.000 | R$ 2.250 | R$ -128.570 | R$ 5.143 | R$ -141.813 |
| 7 | R$ 1.684 | R$ -166.040 | R$ 0 | R$ -139.000 | R$ 667 | R$ -147.480 | R$ 3.375 | R$ -143.230 | R$ 6.857 | R$ -156.843 |
| 8 | R$ 2.526 | R$ -182.448 | R$ 0 | R$ -153.000 | R$ 1.333 | R$ -163.480 | R$ 4.500 | R$ -157.140 | R$ 8.571 | R$ -170.586 |
| 9 | R$ 3.368 | R$ -198.116 | R$ 0 | R$ -167.000 | R$ 2.000 | R$ -179.000 | R$ 5.625 | R$ -170.300 | R$ 10.286 | R$ -183.041 |
| 10 | R$ 4.211 | R$ -213.042 | R$ 83 | R$ -182.927 | R$ 2.667 | R$ -194.040 | R$ 6.750 | R$ -182.710 | R$ 12.000 | R$ -194.210 |
| 11 | R$ 5.053 | R$ -227.227 | R$ 167 | R$ -198.780 | R$ 3.333 | R$ -208.600 | R$ 7.875 | R$ -194.370 | R$ 13.714 | R$ -204.091 |
| 12 | R$ 5.895 | R$ -240.672 | R$ 250 | R$ -214.560 | R$ 4.000 | R$ -222.680 | R$ 9.000 | R$ -205.280 | R$ 15.429 | R$ -212.686 |
| 13 | R$ 6.737 | R$ -253.375 | R$ 333 | R$ -230.267 | R$ 4.667 | R$ -236.280 | R$ 10.125 | R$ -215.440 | R$ 17.143 | R$ -219.993 |
| 14 | R$ 7.579 | R$ -265.337 | R$ 417 | R$ -245.900 | R$ 5.333 | R$ -249.400 | R$ 11.250 | R$ -224.850 | R$ 18.857 | R$ -226.013 |
| 15 | R$ 8.421 | R$ -276.558 | R$ 500 | R$ -261.460 | R$ 6.000 | R$ -262.040 | R$ 12.375 | R$ -233.510 | R$ 20.571 | R$ -230.746 |
| 16 | R$ 9.263 | R$ -287.038 | R$ 583 | R$ -276.947 | R$ 6.667 | R$ -274.200 | R$ 13.500 | R$ -241.420 | R$ 22.286 | R$ -234.191 |
| 17 | R$ 10.105 | R$ -296.777 | R$ 667 | R$ -292.360 | R$ 7.333 | R$ -285.880 | R$ 14.625 | R$ -248.580 | R$ 24.000 | R$ -236.350 |
| 18 | R$ 10.947 | R$ -305.775 | R$ 750 | R$ -307.700 | R$ 8.000 | R$ -297.080 | R$ 15.750 | R$ -254.990 | R$ 25.714 | R$ -237.221 |
| 19 | R$ 11.789 | R$ -314.032 | R$ 833 | R$ -322.967 | R$ 8.667 | R$ -307.800 | R$ 16.875 | R$ -260.650 | R$ 27.429 | R$ -236.806 |
| 20 | R$ 12.632 | R$ -321.547 | R$ 917 | R$ -338.160 | R$ 9.333 | R$ -318.040 | R$ 18.000 | R$ -265.560 | R$ 29.143 | R$ -235.103 |
| 21 | R$ 13.474 | R$ -328.322 | R$ 1.000 | R$ -353.280 | R$ 10.000 | R$ -327.800 | R$ 19.125 | R$ -269.720 | R$ 30.857 | R$ -232.113 |
| 22 | R$ 14.316 | R$ -334.356 | R$ 1.083 | R$ -368.327 | R$ 10.667 | R$ -337.080 | R$ 20.250 | R$ -273.130 | R$ 32.571 | R$ -227.836 |
| 23 | R$ 15.158 | R$ -339.648 | R$ 1.167 | R$ -383.300 | R$ 11.333 | R$ -345.880 | R$ 21.375 | R$ -275.790 | R$ 34.286 | R$ -222.271 |
| 24 | R$ 16.000 | R$ -344.200 | R$ 1.250 | R$ -398.200 | R$ 12.000 | R$ -354.200 | R$ 22.500 | R$ -277.700 | R$ 36.000 | R$ -215.420 |
<!-- END GERADO -->

## 5. Interpretação

1. **Nenhuma hipótese tem caixa positivo acumulado em 24 meses no cenário base.** Com custos fixos de R$ 14–19 mil/mês sem pró-labore, todas precisam de R$ 240–400 mil de capital no cenário base; com pró-labore mínimo, R$ 600–780 mil. O orçamento de R$ 60 mil cobre a infraestrutura (R$ 44 mil em 24 meses) e **nada mais**. Isso é `INFERÊNCIA` derivada de premissas `HIPÓTESE`.
2. **O teste decisivo é "clientes necessários para cobrir o custo fixo" contra o mercado real:**
   - **H2** precisa de ~127 MW intermediados com fee de 5% contra **344 MW contratados no país inteiro** em 2026, num produto que expira em 31/12/2026, e a startup não pode agregar. **Inviável.**
   - **H3** precisa de ~5 clientes a R$ 4 mil/mês, mas há menos de 10 agregadores ativos, e o maior já tem ferramenta própria e gratuita. Possível só como nicho; frágil a uma única decisão regulatória.
   - **H1** precisa de ~10 contratos fechados/mês pagos pelo varejista, competindo pelo mesmo lead com grupos que já têm distribuição e com o comparador oficial; o consumidor (lado que precisa ser adquirido primeiro) não paga.
   - **H4** precisa de ~12 gestoras a R$ 1,5 mil/mês num mercado de tamanho não verificado e com software existente.
   - **H5** precisa de ~16 assinantes a R$ 1,2 mil/mês dentro de alguns milhares de compradores corporativos, com dor documentada em 2026. É o requisito mais folgado em relação ao mercado, **mas o preço não tem nenhuma evidência**.
3. **Sensibilidade:** em H4 e H5 o resultado depende principalmente de **preço** e **número de clientes** (±R$ 100–175 mil no caixa de 24 meses); o CAC e o atraso pesam menos. Em H2 e H3 nada salva o caixa, porque o mercado endereçável é pequeno demais.
4. **Conclusão da Etapa B (insumo para `06`):** H2 descartada por regulação e tamanho; H1 descartada como marketplace (sobra como canal de indicação de baixo valor); H3 e H4 viáveis só como nichos; **H5 é a única com dor recente documentada, SAM compatível e sem dependência de habilitação**, mas sem validação de disposição a pagar. A decisão e os experimentos estão em `06-DECISAO-GO-NOGO.md`.
