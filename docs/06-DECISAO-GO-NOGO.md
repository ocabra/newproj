# 06 — Decisão GO / NO-GO

> **Data:** 27/11/2026. **Decisão:** **PIVOT** do marketplace original para **H5-G: radar de risco de fornecedores para gestoras de energia**, sob **GO CONDICIONAL**. Isso permite construir só um protótipo reversível e demonstrável, sem afirmar que o negócio foi validado.
>
> Base: `01`–`05`, `anexos/H5-RISCO-CONTRAPARTE.md`. Registro das escolhas: `DECISOES.md` D-012 a D-014.

## 1. Resumo da decisão

- **O marketplace imaginado (H1 e H2) não se sustenta.**
  - No atacado do ACL, a infraestrutura já existe e é restrita a agentes (BBCE, N5X).
  - No varejo, o lead disputado já tem dono (Clarke/Energisa, Esfera/Auren, Comerc/Vibra). Um comparador oficial e gratuito chega até 04/11/2027.
  - Na Resposta da Demanda, o mercado pagante soma 344 MW e R$ 10–50 mi/ano, tem um único comprador final (o ONS), está em sandbox até 31/12/2026, e só agentes da CCEE podem agregar.
- **Sobra um padrão:** em H3, H4 e H5 o primeiro comprador plausível é a **gestora/consultoria de energia**. Ela não precisa de habilitação, atende dezenas de consumidores e faz à mão trabalho que software pode reduzir.
- **Por que H5-G entre as três:** a dor de 2026 é a mais documentada (recuperações judiciais de comercializadoras, consumidores listados como inadimplentes e desligados por causa do representante). Os dados são lícitos e públicos. O substituto setorial (Central de Risco Abraceel/Risk3) atende **comercializadoras**, não gestoras nem compradores finais. A versão H5-G tira do escopo tudo o que a CCEE já entrega de graça e fica com a parte que ninguém faz: **cruzar os contratos da carteira com os eventos públicos e calcular a exposição**.
- **Por que só GO CONDICIONAL:**
  - Não houve nenhuma entrevista.
  - Nenhum preço foi validado: a âncora pública é de R$ 120–270/mês (birô genérico).
  - Não se sabe se o FA da CCEE, que é gratuito, já antecipa os defaults.
  - O enquadramento jurídico (CVM 9/2020, responsabilidade civil) depende de advogado.

## 2. Matriz de critérios (0–5; 5 = melhor para a startup)

Os pesos refletem o estágio: sem receita e com dois fundadores técnicos, **demanda comprovada** e **viabilidade para a equipe** pesam mais. Em "risco regulatório" e "intensidade de capital", 5 = risco/capital **baixo**.

| Critério | Peso | H1 RFQ ACL | H2 Mkt RD | H3 SaaS flex. | H4 Gestoras | H5-G Radar |
|---|---:|---:|---:|---:|---:|---:|
| Demanda comprovada | 3 | 2 | 1 | 1 | 1 | 2 |
| Clareza do comprador | 2 | 3 | 1 | 2 | 2 | 3 |
| Facilidade de aquisição | 2 | 1 | 1 | 2 | 3 | 3 |
| Diferenciação | 2 | 1 | 1 | 3 | 1 | 2 |
| Acesso a dados | 2 | 3 | 2 | 2 | 3 | 3 |
| Risco regulatório | 2 | 4 | 0 | 2 | 4 | 3 |
| Time-to-value | 1 | 3 | 1 | 2 | 3 | 4 |
| Margem | 1 | 2 | 1 | 3 | 3 | 3 |
| Intensidade de capital | 1 | 3 | 2 | 4 | 4 | 5 |
| Viabilidade p/ 2 fundadores | 2 | 2 | 1 | 3 | 4 | 4 |
| **Total ponderado (máx. 90)** | | **42** | **19** | **40** | **47** | **54** |

**Justificativas das notas que decidem:**
- **Demanda comprovada.**
  - H1 e H5-G recebem 2: em H1, comercializadoras já pagam por indicação (CLI-R5); em H5-G, há prejuízos documentados (H5-R1, R2, R9).
  - H2, H3 e H4 recebem 1: não há pagamento nem dor documentada para o pagador.
  - Ninguém recebe mais de 2, porque não houve entrevistas.
- **Diferenciação.**
  - H3 recebe 3: nenhum fornecedor a terceiros foi encontrado.
  - H5-G recebe 2, e não 3, porque o FA é gratuito e a Abraceel/Risk3 existe.
  - H4 recebe 1: o segmento é saturado.
- **Risco regulatório.**
  - H2 recebe 0: a startup não pode agregar.
  - H5-G recebe 3, por causa da zona cinzenta CVM e da responsabilidade civil.
  - H4 recebe 4.
- **Margem de incerteza:** a diferença entre H5-G (54) e H4 (47) é de 7 pontos. Uma variação de 1 ponto em "demanda comprovada" (peso 3) e outra em "diferenciação" (peso 2) já a eliminam. **A matriz não decide sozinha.** O desempate vem da dor documentada e de uma vantagem prática: o protótipo de H5-G serve como **instrumento do experimento E1** (backtest).

## 3. Checagem dos critérios de GO (PLANO §3.3)

| # | Critério | H5-G | Situação |
|---|---|---|---|
| 1 | Oferta e contrato juridicamente coerentes, sem atividade regulada | Software de informação privada para a carteira do cliente: fatos com fonte, sem nota de crédito, sem intermediar energia | **Condicional:** parecer sobre CVM 9/2020 e responsabilidade civil (E3) |
| 2 | Comprador B2B específico e problema verificável | Gestora de energia independente; problema verificado em 2026 (eventos de crédito afetando consumidores) | **Parcial:** comprador `HIPÓTESE`, problema `CONFIRMADO` |
| 3 | Dados mínimos lícitos | Sinais públicos (atas, listas e FA da CCEE, processos de RJ), carregados por curadoria/CSV; contratos da carteira enviados pela gestora sob mandato do cliente | **Atendido**, com ressalva: a CCEE bloqueia acesso automatizado, então a importação é manual |
| 4 | Caminho plausível de venda, com margem | Venda direta dos fundadores a gestoras; margem de contribuição > 75% | **Não validado:** o preço é `HIPÓTESE` |
| 5 | Produto mínimo factível com orçamento e equipe | Monólito TypeScript + PostgreSQL; infraestrutura de R$ 44 mil em 24 meses | **Atendido** |

Os critérios 1, 2 e 4 não foram plenamente atendidos. Pelo PLANO, isso dá **GO CONDICIONAL**, não GO.

## 4. Alternativas rejeitadas e por quê

| Hipótese | Decisão | Motivo principal | O que a reabriria |
|---|---|---|---|
| H1 Marketplace/RFQ ACL | **Rejeitada** | Concorre com a BBCE, a N5X e os RFQs de grandes grupos; o consumidor não paga; comparador oficial em 2027 | Varejistas médios aceitarem pagar ≥ R$ 5 mil por contrato de Grupo A ≥ 500 kW originado |
| H2 Marketplace de RD | **Rejeitada (NO-GO)** | Startup não pode agregar; mercado de 344 MW; sandbox expira em 31/12/2026 | Regulamentação do mecanismo ERCAP com contratos longos **e** a startup virando agente da CCEE (fora do estágio atual) |
| H3 SaaS de pré-qualificação de flexibilidade | **Em reserva** | < 10 compradores; a AXIA já construiu a dela; regulação provisória | Regras de 2027 publicadas (nova linha de base, contratos de 3 meses a 5 anos) e 2 agregadores dispostos a pagar piloto |
| H4 Gestão/cotação white-label | **Em reserva** | Saturado; o comparador oficial reduz o valor | Gestoras validadas em E2 pedirem cotação de contingência junto com o radar (módulo futuro, não no MVP) |

## 5. Hipóteses críticas de H5-G (o que precisa ser verdade)

1. **HC1 Dor recorrente:** gestoras verificam fornecedores da carteira manualmente, com frequência pelo menos mensal, e isso custa horas (HIPÓTESE).
2. **HC2 Valor além do gratuito:** cruzar contrato e evento, calcular a exposição e alertar vale mais que consultar o FA e as atas da CCEE (HIPÓTESE).
3. **HC3 Disposição a pagar:** ≥ R$ 500/mês por gestora (HIPÓTESE; a âncora do birô é R$ 120–270).
4. **HC4 Enquadramento jurídico:** fatos com fonte, sem nota e com distribuição privada não configuram atividade de agência de rating nem geram risco civil desproporcional (precisa de parecer).
5. **HC5 Durabilidade:** a demanda não desaparece com o fim da crise de 2026, nem quando a CCEE publicar o "% de risco por varejista" ou quando entrarem as câmaras de garantia de 2027 (HIPÓTESE; risco alto).

## 6. Experimentos de validação (metas definidas antes de executar)

| # | Experimento | Quem executa | Prazo | Sucesso | Fracasso → ação |
|---|---|---|---|---|---|
| **E1** | **Backtest do FA:** baixar manualmente o histórico do Fator de Alavancagem da CCEE e cruzar com a linha do tempo dos ~10 eventos de crédito de 2026 (anexo H5 §2.2), usando o importador do protótipo | Fundadores (download manual; a CCEE bloqueia automação) + protótipo | 2 semanas | FA sinalizou ≤ 4 de 10 eventos com ≥ 60 dias de antecedência → sinais combinados agregam valor | FA antecipou ≥ 7 de 10 → antecipação já é gratuita; reduzir a proposta a "alerta e exposição na carteira" e o preço à faixa do birô; reavaliar contra H4 |
| **E2** | **Entrevistas:** 10 gestoras independentes + 5 consumidores que tinham Tradener, Electra, IBS ou Elétron como fornecedor, com o roteiro de `02` §5 (sem mostrar o produto nos primeiros 20 min) | Fundadores | 4–6 semanas | ≥ 6/10 gestoras descrevem diligência manual recorrente **e** ≥ 3 aceitam piloto pago ≥ R$ 500/mês ou assinam carta de intenção com preço | < 2 aceitam pagar → **NO-GO H5-G**; testar H4 com as mesmas gestoras |
| **E3** | **Parecer jurídico:** CVM 9/2020, responsabilidade civil, LGPD (só CNPJ), cadastro positivo | Advogado contratado pelos fundadores (exige aprovação de custo, PLANO §1.8) | 3–4 semanas | Formato "fatos com fonte, sem nota, privado" aceito com ajustes | Exige registro na CVM ou o risco civil é alto → limitar a ferramenta interna da gestora, sem conteúdo curado pela startup, ou parar |
| **E4** | **Substituto Abraceel/Risk3:** confirmar preço e regras de acesso para não associadas e para gestoras | Fundadores (contato comercial) | 2 semanas | Inacessível a gestoras ou > R$ 1.500/mês | Acessível a gestoras por ≤ R$ 300/mês → H5-G perde diferenciação; parar ou integrar como fonte |
| **E5** | **Regulação:** acompanhar a resolução da CP ANEEL 33/2025 (monitoramento prudencial) e uma eventual publicação do "% de risco por varejista" | Agente/fundadores | contínuo | CCEE não publica indicador por agente no horizonte de 12 meses | CCEE publica → reposicionar para "exposição na carteira", que a CCEE não calcula |

**Regra de parada:** se E2 falhar, o desenvolvimento para, seja qual for o resultado dos outros experimentos (PLANO §7: "se não houver comprador interessado, não acelerar o desenvolvimento").

## 7. Limitações desta decisão

- Todos os números de mercado vêm de fontes públicas, muitas secundárias, porque a CCEE bloqueou o acesso automatizado. As principais afirmações foram conferidas (D-007).
- O número de gestoras de energia no Brasil é **NÃO VERIFICADO**. O SAM de H5-G pode ser bem menor que o suposto.
- A análise de concorrência não encontrou produto igual para gestoras, mas **ausência de evidência não é evidência de ausência**. E2 também serve para descobrir concorrentes.
- A crise de 2026 pode ser um pico. Um produto que nasce de uma crise corre o risco de perder demanda quando ela passa (HC5).

## 8. O que será construído (e o que não)

- **Protótipo GO CONDICIONAL:**
  - portal da gestora (carteira de clientes, unidades, contratos com fornecedores);
  - área de curadoria/admin (registrar e importar eventos públicos com fonte, e séries de FA);
  - motor de alertas determinístico e explicável (contrato × evento × regra versionada) com cálculo de exposição em unidades explícitas;
  - API B2B somente leitura e escrita da própria carteira;
  - importador CSV e a ferramenta de backtest de E1.
  - Os dados são **sintéticos**.
- **Fora do escopo:**
  - marketplace, RFQ, negociação, ofertas de RD;
  - nota ou score de crédito;
  - coleta automatizada da CCEE;
  - dados reais de clientes;
  - qualquer tela que sugira que a plataforma representa consumidores, negocia energia ou tem relação oficial com a CCEE, a ANEEL ou a Abraceel.
