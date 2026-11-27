# Mercado de gestoras de energia no ACL: contagem e tamanho

Pesquisa feita só na web em 27/11/2026. Ninguém foi contatado. Rótulos usados: **CONFIRMADO** (número lido na fonte citada), **INFERÊNCIA** (conta ou dedução nossa a partir de números confirmados, com o método descrito), **NÃO VERIFICADO** (premissa ou dado sem fonte primária).

Nota de acesso: o site da CCEE **bloqueia download direto** (curl devolve a página "Acesso bloqueado"). Os PDFs da CCEE citados abaixo foram lidos por meio de um fetcher web e tiveram o texto extraído localmente. Gráficos e tabelas em imagem (por exemplo, o Gráfico 18 "Agentes por classe" do InfoMercado) não têm texto e não foram lidos.

## Resumo

| Item | Faixa | Ponto central | Rótulo | Confiança |
|---|---|---|---|---|
| Gestoras independentes (todas, incluindo boutiques com poucos clientes) | **125 a 420** | ~250 | INFERÊNCIA (§4) | Baixa |
| Gestoras independentes com ≥ 50 UCs sob gestão (núcleo endereçável) | **60 a 150** | ~100 | INFERÊNCIA (§4) | Baixa |
| Gestoras ligadas a comercializadoras, geradoras ou distribuidoras | **30 a 60** | ~40 | INFERÊNCIA (§1b) | Baixa a média |
| Agentes consumidores na CCEE fora do varejo (livres + especiais), dez/25 | 13.374 | n/a | CONFIRMADO [MG-R1] | Alta |
| UCs no ACL, mai/26 / sob varejistas | 91.970 / 45.982 | n/a | CONFIRMADO [MG-R2] | Alta |

Conclusão prática: a premissa de **~300 gestoras independentes** fica dentro da faixa do total, mas é otimista para o público que pagaria por um SaaS. O núcleo com carteira relevante (≥ 50 UCs) deve ficar perto de **~100 empresas**. Não existe registro público de gestoras: elas não são uma classe de agente da CCEE, e **não achamos nenhuma associação de gestoras ou consultorias** (§1). Por isso nenhuma contagem direta foi possível. A melhor forma de reduzir a incerteza é medir a carteira média das gestoras nas entrevistas E2.

## 1 Contagem

### 1.0 Não há contagem direta

- **Não existe associação de gestoras ou consultorias de energia** que publique lista de associados. As buscas por "associação brasileira de gestores de energia", "associação das consultorias de energia" e termos parecidos não retornaram nenhuma entidade. NÃO VERIFICADO como inexistência absoluta, mas não há nenhuma visível na web [MG-R20].
- As siglas sugeridas não servem:
  - **ABRAGE** reúne empresas geradoras.
  - **ANACE** e **ABRACE** representam consumidores (ABRACE: grandes consumidores e consumidores livres).
  - **ABCE** representa companhias de energia elétrica.
  - Nenhuma delas é de gestoras. As naturezas de ANACE e ABRACE estão CONFIRMADAS pela lista de signatários do manifesto de abr/2026 [MG-R19]. As de ABRAGE e ABCE vêm de conhecimento geral: NÃO VERIFICADO nesta pesquisa.
- **Abraceel** (comercializadores) tem **77 associados** listados na página oficial, consultada em 27/11/2026, sem categoria separada para gestoras [MG-R3] (CONFIRMADO). Alguns associados são gestora e comercializadora ao mesmo tempo (Comerc, Ecom, Matrix, Migratio Gestão e Comercialização). A lista não serve para contar independentes.
- A CCEE não tem classe "gestora". O consumidor não varejista é ele próprio agente e contrata a gestora como prestadora de serviço ou procuradora. A CCEE publica agentes por classe e varejistas habilitados, mas não publica quem é o gestor de cada agente.

### 1.a Proxies do lado da oferta

| Proxy | Valor | Data | Rótulo | Fonte |
|---|---|---|---|---|
| Agentes comercializadores na CCEE | 497 (507 em dez/24) | dez/25 | CONFIRMADO | [MG-R1] |
| Comercializadoras "ativas" (vendas > 10 MWm no mês) | 239 | jul/24 | CONFIRMADO (Thunders, via Eixos/InfoMoney) | [MG-R4] |
| Empresas registradas como comercializadoras na CCEE | 615 | ~out/24 | CONFIRMADO (secundária) | [MG-R5] |
| Varejistas habilitados | 144 | mai/26 | CONFIRMADO | [MG-R2] |
| Varejistas cadastrados / com negociação ativa | 124 / 109 | jul/24 | CONFIRMADO (secundária) | [MG-R4] |
| Associados Abraceel | 77 | consulta em 27/11/2026 | CONFIRMADO | [MG-R3] |

Leitura: o universo de comercializadores e varejistas (~500 e ~144) é o teto do grupo "ligadas". Gestoras puras não aparecem nesses números.

### 1.b Ligadas a comercializadoras, geradoras ou distribuidoras: casos identificados

| Gestora | Controlador | Evento | Rótulo | Fonte |
|---|---|---|---|---|
| Comerc Energia | Vibra (100%) | Aquisição integral oficializada em jan/2025, R$ 7,05 bi no total | CONFIRMADO | [MG-R6] |
| Esfera Energia | Auren | Compra anunciada em jun/2024. A Esfera atendia 570 grupos e geria 1.600 contratos | CONFIRMADO | [MG-R7] |
| Clarke Energia | Energisa (70%) | Compra em mar/2024 | CONFIRMADO | [MG-R8] |
| Braços de gestão de comercializadoras e geradoras (CPFL Soluções, EDP, Engie, Matrix, Ecom, Serena e outras) | próprios | n/a | NÃO VERIFICADO caso a caso | [MG-R3] |

Estimativa do grupo (b): **30 a 60** empresas (INFERÊNCIA). Método: entre os 77 associados da Abraceel e os 144 varejistas, contamos os grupos que vendem gestão a consumidores não varejistas, de 1 em cada 5 a 1 em cada 3 dos ~150 a 200 grupos econômicos distintos. É uma premissa sem checagem nome a nome. A tendência é de **consolidação**: as três maiores gestoras independentes conhecidas de 2023 (Comerc, Esfera, Clarke) foram compradas por grupos de energia em 2024 e 2025.

## 2 Tamanho e maiores

### 2.1 Maiores gestoras com volume publicado

| Gestora | Carteira | Data | Rótulo | Fonte |
|---|---|---|---|---|
| Comerc (Vibra) | "+ de 5 mil UCs no ML, 14% de toda a carga do ACL"; +1.300 UCs em integração | Relatório Executivo 2025 | CONFIRMADO | [MG-R9] |
| Comerc (Vibra) | ≈ 4,3 a 4,5 GWm (14% de um ACL de ~31 a 32 GWm) | 2025 | INFERÊNCIA | [MG-R9], [MG-R2] |
| Comerc (Vibra) | 4,6 mil UCs ("6% da energia consumida no país") | jan/2025 | CONFIRMADO | [MG-R6] |
| Esfera (Auren) | 570 grupos empresariais, 1.600 contratos; 113 a 142 ativos de geração sob gestão | 2024 | CONFIRMADO | [MG-R7], [MG-R10] |
| Clarke (Energisa) | 714 clientes, 905 UCs, 45 MWm (meta 2025: > 1.400 clientes) | fim de 2024 | CONFIRMADO | [MG-R11] |
| Thymos, Ecom, Witzler, Electra, Mitsidi, Órigo, Solfus e outras | sem carteira publicada | n/a | NÃO VERIFICADO | [MG-R12], [MG-R20] |

Escala: a Comerc sozinha tem **~5 mil UCs**, o equivalente a ~11% das ~46 mil UCs fora do varejo (INFERÊNCIA; supõe que a maior parte da carteira Comerc é não varejista). Uma gestora "grande" de tecnologia (Clarke) tinha < 1 mil UCs.

### 2.2 Varejistas com mais UCs representadas (lado ligado)

InfoMercado nº 222 (dez/25), Tabela 8, por ordem de nº de UCs representadas: Cemig Geração, Ultragaz Com, Matrix Com, Raízen Power, CPFL Brasil Varejista, NC Energia, Enel Trading, Engie BR, Solenergias, EDP Smart [MG-R13] (CONFIRMADO; os valores ficam numa imagem e não foram extraídos). No volume varejista acumulado de 2025, a Echoenergia ficou em 6º lugar (791 GWh) [MG-R14] (CONFIRMADO, fonte da própria empresa).

### 2.3 Distribuição de tamanho: o que dá para afirmar

- **Distribuição dos clientes** (agentes consumidores livres, especiais e autoprodutores fora do varejo, dez/25, Thunders com dados CCEE) [MG-R15] (CONFIRMADO):

  | Faixa de consumo | Agentes | % dos agentes | % do volume |
  |---|---|---|---|
  | ≥ 100 MWm | 37 | 0,27% | 33,3% |
  | 10 a 100 MWm | 317 | 2,28% | 29,1% |
  | 0,1 a 3 MWm | 11.292 | 81,25% | 23,7% |
  | 0,1 a 0,3 MWm (dentro da faixa acima) | 4.772 | 34,3% | n/a |

  Total: 13.909 agentes e 44.703 UCs. Os ~2.263 restantes ficam nas outras faixas (3 a 10 MWm e < 0,1 MWm) (INFERÊNCIA, por diferença).
- **Distribuição das gestoras:** não há fonte. A faixa "> 50 UCs" do Resumo (60 a 150 empresas) é INFERÊNCIA (§4). Pelo que foi publicado, só **3 gestoras** passam de ~500 UCs (Comerc, Esfera e Clarke), e as três são hoje ligadas a grupos de energia.

## 3 Consumidores livres e especiais

| Métrica | Valor | Data ref. | Rótulo | Fonte |
|---|---|---|---|---|
| Agentes CCEE (total) | 16.425 | dez/25 | CONFIRMADO | [MG-R1] |
| Consumidores livres (agentes) | **3.721** (+7,2% a/a) | dez/25 | CONFIRMADO | [MG-R1] |
| Consumidores especiais (agentes) | **9.653** (−1,0% a/a) | dez/25 | CONFIRMADO | [MG-R1] |
| Comercializadores / PIE / autoprodutores / geradores / distribuidores | 497 / 2.263 / 159 / 42 / 90 | dez/25 | CONFIRMADO | [MG-R1] |
| UCs no ACL (total) | 83.564 | dez/25 | CONFIRMADO | [MG-R1] |
| UCs por classe: comercializador (varejo) / especial / livre / autoprodutor / distribuidor | 38.150 / 30.158 / 14.858 / 259 / 139 | dez/25 | CONFIRMADO | [MG-R1] |
| Cargas no ACL / sob varejistas | **91.970 / 45.982 (50%)** | mai/26 | CONFIRMADO | [MG-R2] |
| Cargas fora do varejo (agentes diretos) | ~45.988 | mai/26 | INFERÊNCIA (subtração) | [MG-R2] |
| Agentes CCEE (total) | 16.406 | mai/26 | CONFIRMADO | [MG-R2] |
| Agentes na contabilização | 16.377 | ago/26 | CONFIRMADO | [MG-R16] |
| Variação a/a: livres / especiais / comercializadores | +4,1% / −1,8% / −0,8% | ago/26 vs ago/25 | CONFIRMADO | [MG-R16] |
| Livres e especiais (agentes) | ~3,8 a 3,9 mil / ~9,5 mil | ago/26 | INFERÊNCIA (aplicando as variações à base de dez/25) | [MG-R1], [MG-R16] |
| UCs no ACL / em varejo (Abraceel) | 81.832 / 37.281 (46%; eram 11% em jan/24) | set/25 | CONFIRMADO (secundária) | [MG-R17] |
| Migrações em 2025 | 21.707, sendo 81% via varejista | 2025 | CONFIRMADO (secundária) | [MG-R18] |
| Migrações no 1º tri/26 | 4.827 (−36,5% a/a) | 1T26 | CONFIRMADO (secundária) | [MG-R18] |
| Participação do ACL no consumo | 42,9% (74,6 GWm SIN) | mai/26 | CONFIRMADO | [MG-R2] |

Sinais de risco no varejo, úteis para o produto (CCEE, jul/2026, acumulado desde jan/24) [MG-R2] (CONFIRMADO):

- 1.922 resoluções e 483 resilições de contrato;
- 1.271 processos de suspensão de fornecimento iniciados;
- 15 inabilitações voluntárias e 12 inabilitações compulsórias iniciadas (5 concluídas), além de 1 varejista desligado.

Em abr/2026, Abraceel, Abrace, Anace, Abiape e a Frente Nacional dos Consumidores publicaram manifesto sobre "restrição de liquidez" no ML, citando empresas "sob monitoramento ou em recuperação" [MG-R19] (CONFIRMADO; sem contagem).

## 4 Método da estimativa

O método parte do lado da demanda: quantos clientes não varejistas existem e quantos deles cabem em cada gestora. O passo 1 usa números confirmados. Todas as frações dos passos 2 a 5 são premissas (NÃO VERIFICADO) e devem ser substituídas por dados das entrevistas E2.

1. **Base de clientes potenciais:** 13.374 agentes consumidores (livres + especiais) fora do varejo, com ~44,7 a 46 mil UCs [MG-R1], [MG-R2], [MG-R15]. Os consumidores em varejo (~46 mil UCs) são geridos pelo próprio varejista e ficam fora desta base.
2. **Fração que terceiriza a gestão: 75% a 90%.** Parte dos 354 agentes ≥ 10 MWm tem mesa própria. Os ~11 mil abaixo de 3 MWm quase sempre terceirizam. Resultado: **10,0 a 12,0 mil agentes** e **34 a 41 mil UCs**.
3. **Fatia das gestoras ligadas: 30% a 50% das UCs.** A Comerc sozinha tem ~5 mil UCs, ou ~11%. Somam-se Esfera/Auren, Clarke/Energisa e os braços de gestão de comercializadoras e geradoras. Resultado para as independentes: **5,0 a 8,4 mil agentes** (17 a 29 mil UCs).
4. **Carteira média por gestora independente: 20 a 40 agentes** (~65 a 130 UCs, usando ~3,3 UCs por agente, que é 44.703 / 13.909). A distribuição tem cauda longa: muitas boutiques de 5 a 15 clientes e poucas com algumas centenas.
   - Contagem: 5.000 / 40 ≈ **125** (baixa) até 8.400 / 20 ≈ **420** (alta). Ponto central ~250.
5. **Núcleo com ≥ 50 UCs.** Se cerca de 70% das UCs independentes estão em gestoras com ≥ 50 UCs, com mediana de 100 a 200 UCs nesse grupo, ficam 12 a 20 mil UCs divididas por 100 a 200. Resultado: **60 a 150** empresas.
6. **Checagem pelo lado da oferta:** a faixa é compatível com os ~500 comercializadores, os 239 ativos e os 144 varejistas. Muitas gestoras independentes de porte médio também têm comercializadora registrada. Isso não fecha a conta, porque não há registro de gestoras puras.

Sensibilidade: o resultado depende sobretudo do passo 4. Se a carteira média real for de 60 agentes, a contagem total cai para ~85 a 140. A pergunta "quantos clientes não varejistas a sua gestora atende?" na E2 reduz a incerteza mais do que qualquer outra fonte web.

## 5 Fontes

- **MG-R1:** CCEE, *Balanço 2025: Consumo e Geração* (Gerência de Análise e Informações ao Mercado, 15/01/2026), seção "Agentes e Ativos", p. 43 a 47. https://www.ccee.org.br/documents/80415/37286350/Balanco_Consumo_e_Geracao_2025.pdf/8ae796a1-ea63-b280-908b-2740a71c7d5a
- **MG-R2:** CCEE, Adriana Sambiase, *Operação em Movimento: Mercado de Varejo* (apresentação, 07/07/2026; dados de mai/26), slides 2 e 10. https://www.ccee.org.br/o/ccee/documentos/CCEE_1360211
- **MG-R3:** Abraceel, página "Associados" (consulta em 27/11/2026). https://abraceel.com.br/associados/
- **MG-R4:** InfoMoney / Agência Eixos, "Mercado livre de energia no Brasil está concentrado em 20 comercializadoras" (24/10/2024; dados Thunders/CCEE, jul/24). https://www.infomoney.com.br/mercados/mercado-livre-de-energia-no-brasil-esta-concentrado-em-20-comercializadoras/
- **MG-R5:** Cenário Energia, "Mercado Livre de Energia: 20 gigantes controlam mais da metade das transações" (25/10/2024). https://cenarioenergia.com.br/2024/10/25/mercado-livre-de-energia-20-gigantes-controlam-mais-da-metade-das-transacoes/
- **MG-R6:** Canal Solar, "Vibra conclui aquisição da Comerc Energia" (17/01/2025, atualizado em 12/02/2026). https://canalsolar.com.br/vibra-conclui-aquisicao-comerc-energia/
- **MG-R7:** Exame, "Após AES, Auren compra Esfera para avançar em comercialização no varejo" (jun/2024). https://exame.com/exame-in/apos-aes-auren-compra-esfera-para-avancar-em-comercializacao-no-varejo/
- **MG-R8:** Brazil Journal, "Energisa compra a Clarke, um corretor e contador do mercado livre de energia" (22/03/2024). https://braziljournal.com/energisa-compra-a-clarke-um-corretor-e-contador-do-mercado-livre-de-energia/
- **MG-R9:** Comerc Energia, *Relatório Executivo 2025* (PDF, p. "Gestão de energia"). https://www.comerc.com.br/hubfs/RS_2025_Comerc_Final.pdf
- **MG-R10:** InfoMoney, "Esfera avança na gestão de usinas e define plano para ganhar escala no varejo" (14/03/2024). https://www.infomoney.com.br/business/esfera-avanca-na-gestao-de-usinas-e-define-plano-para-ganhar-escala-no-varejo/
- **MG-R11:** Canal Solar, "Clarke Energia registra crescimento de 70% no faturamento em 2024" (2025; data exata não exibida). https://canalsolar.com.br/clarke-energia-registra-crescimento-de-70-no-faturamento-em-2024/
- **MG-R12:** Eixos, "Varejo mudou dinâmica do mercado livre de energia, diz CEO da Ecom" (data não verificada). https://eixos.com.br/energia-eletrica/varejo-mudou-dinamica-do-mercado-livre-de-energia-diz-ceo-da-ecom/
- **MG-R13:** CCEE, *InfoMercado mensal nº 222*, contabilização de dez/2025 (gerado em 18/02/2026), Tabelas 6 a 8 e seção 12. https://www.ccee.org.br/documents/80415/31068587/InfoMercado-mensal_dez_25_222.pdf/2ce37d90-eed6-7173-e6c2-a357571fdcff
- **MG-R14:** Cenário Energia, "Echoenergia alcança 6ª posição entre comercializadoras varejistas…" (04/03/2026). https://cenarioenergia.com.br/2026/03/04/echoenergia-alcanca-6a-posicao-entre-comercializadoras-varejistas-e-avanca-no-mercado-livre-de-energia-em-2025/
- **MG-R15:** Thunders, "Ranking nacional de consumidores livres, especiais e autoprodutores, dados referentes a dezembro/25" (13/02/2026). A fonte tem inconsistências internas (MWm de dez/25 aparece como 26.756 num trecho e 28.170 em outro). https://www.thunders.com.br/2026/02/13/ranking-nacional-de-consumidores-livres-especiais-e-autoprodutores-de-energia-dados-referente-a-dezembro-25/
- **MG-R16:** CCEE, *InfoMercado mensal nº 230*, contabilização de ago/2026, seção 11 "Agentes". https://www.ccee.org.br/documents/80415/37594170/InfoMercado-mensal_AGO_26_230.pdf/a6abc2ef-7f4f-7d10-6be9-ca7451fd50dc
- **MG-R17:** Monitor Mercantil (citando o Boletim da Energia Livre da Abraceel), "Consumidor varejista representa 46% do mercado livre de energia" (02/12/2025). https://monitormercantil.com.br/consumidor-varejista-representa-46-do-mercado-livre-de-energia/
- **MG-R18:** Canal Solar, "Mercado livre soma 21,7 mil migrações em 2025…" (2026) e TAGD Law, "Entrada de consumidores no mercado livre recua 36,5% no início de 2026" (2026). https://canalsolar.com.br/mercado-livre-soma-migracoes-2025/ e https://tagdlaw.com.br/entrada-de-consumidores-no-mercado-livre-recua-365-no-inicio-de-2026/
- **MG-R19:** Canal Solar, "Associações lançam manifesto sobre crise no Mercado Livre de Energia" (27/04/2026). https://canalsolar.com.br/associacoes-lancam-manifesto-crise-mercado-livre/
- **MG-R20:** Buscas web, em 27/11/2026, por associações de gestoras e consultorias e por carteiras de Thymos, Witzler, Electra, Mitsidi e outras, sem resultado. Aparecem só sites institucionais de gestoras (ex.: https://origoenergia.com.br/solucoes/mercado-livre/, https://solfus.com.br/crise-no-mercado-livre-de-energia/).
