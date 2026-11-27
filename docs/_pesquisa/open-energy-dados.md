# Open Energy, comparador CCEE e disponibilidade real de dados e integrações

> Insumo de pesquisa para `PLANO.md` §2.1-C, §2.3 (linha "Plataforma de comparação CCEE/Open Energy") e §2.4.
> Data de referência e de consulta de todas as fontes: **27/11/2026**. Códigos `[Rn]` remetem à tabela de referências (§6).
> Legenda: **CONFIRMADO** = lido em fonte primária ou em reprodução fiel do ato oficial. **INFERÊNCIA** = dedução direta de fonte confirmada. **HIPÓTESE** = precisa ser validada. **NÃO VERIFICADO** = não foi possível ler a fonte, ou só há fonte secundária.
> Este documento não é parecer jurídico. Os pontos marcados "validar com advogado" continuam pendentes.

---

## 0. Resumo executivo

1. **O ato normativo é a REN ANEEL nº 1.175, de 27/10/2026**, que "dispõe sobre a implementação do Open Energy". Foi publicada no DOU de **04/11/2026** (Seção 1, ed. 207, p. 91) e vigora desde a publicação. Junto com ela saiu o **Despacho nº 4.143/2026**, que aprova a 1ª versão do *Manual de Instruções do Open Energy*. Status: REN **CONFIRMADO** [R1][R2][R3]; despacho **NÃO VERIFICADO** em fonte primária, só em fonte secundária [R4].
2. **Cronograma oficial (art. 22), contado da publicação em 04/11/2026:**
   - em até 12 meses (**≤ 04/11/2027**): o consumidor acessa os próprios dados por interface padronizada, e a CCEE entrega a página comparativa de produtos e preços, que depende de aprovação prévia da ANEEL;
   - em até 24 meses (**≤ 04/11/2028**): compartilhamento com terceiros por API, mediante consentimento.

   Os prazos são **CONFIRMADO** [R1][R2]. As datas-limite são conta aritmética (**INFERÊNCIA**).
3. **Nada disso está operacional em 27/11/2026.** Nenhuma fonte mostra comparador, interface padronizada ou API de Open Energy em produção. O roadmap da CCEE prevê sandbox e só depois produção das APIs, entre 2027 e 2028. Status: **CONFIRMADO** que não há evidência de operação; o roadmap é indicativo [R5].
4. **O escopo padronizado de dados é estreito.**
   - Distribuidora: dados cadastrais e histórico de faturamento e pagamentos.
   - Varejista: os mesmos dados, mais informações sobre os produtos contratados.
   - Janela: 12 meses, mais o último dado disponível.

   A REN **não menciona curva de carga nem memória de massa** (**CONFIRMADO** [R2]). Outros dados dependem de requisição ou de ampliação futura do Manual (art. 6º §§6º–7º).
5. **Quem participa:**
   - Obrigatórios: CCEE (diretório central e plataforma), varejistas e distribuidoras. Varejistas e distribuidoras são obrigatoriamente *transmissoras* de dados.
   - Voluntários: **qualquer outra instituição** pode ser *receptora*, mediante registro, homologação e termo de participação com a CCEE, sem pagar pela participação.
   - **Restrição central:** a receptora não pode compartilhar nem repassar a terceiros os dados que acessar (art. 5º §3º III).

   Status: **CONFIRMADO** [R2]. Isso inviabiliza, pela via do Open Energy, um modelo em que a startup coleta dados do consumidor e os entrega a comercializadoras (**INFERÊNCIA**, validar com advogado).
6. **Comparador público.** A Lei 15.269/2025, o Decreto 13.097/2026 e a REN 1.175 exigem que a CCEE ofereça uma plataforma centralizada e gratuita de comparação de ofertas de **varejistas**, além de "produto padrão" com "preço de referência" (**CONFIRMADO** [R6][R7][R2]). Um comparador privado genérico de preços de varejo **seria redundante** e enfrentaria um concorrente gratuito e oficial (**INFERÊNCIA**). Continua havendo espaço em:
   - análise de viabilidade com dados reais (fatura, TUSD, curva);
   - consumidores do Grupo A fora do varejo (≥ 500 kW, contratação bilateral);
   - RFQ estruturado com várias comercializadoras;
   - gestão de contrato, sazonalização e flexibilidade;
   - automação de ingestão de dados (todos **HIPÓTESE**).
7. **Abertura da baixa tensão.** A Lei 15.269/2025 (art. 15 §17 da Lei 9.074/1995) fixa até 24 meses para consumidores industriais e comerciais e até 36 meses para os demais. O Decreto 13.097/2026 fixa as datas: **25/11/2027** para industriais e comerciais de BT e **25/11/2028** para os demais. Status: **CONFIRMADO** [R6][R7]. A ANEEL ainda vai regulamentar o tema em processo próprio da Agenda Regulatória 2026-2027 (**CONFIRMADO** [R1]). As datas coincidem quase exatamente com as duas fases do Open Energy (**INFERÊNCIA**).
8. **Plataforma de Integração da CCEE.** Existe, está documentada e é operacional: web services SOAP e REST para medição em 5 minutos, contratos, PLD, DRI, webhooks e outros. O acesso é restrito a **agentes e consultorias com representação total de clientes aderidos à CCEE**, com certificado digital e SSL mútuo (**CONFIRMADO** [R8][R9]). **Uma startup sem esse vínculo não tem acesso.**
9. **Caminhos de dados que existem hoje sem habilitação na CCEE:**
   - dados públicos da CCEE (CC-BY 4.0, CSV, API CKAN; inclui PLD horário e consumo horário por perfil de agente e ramo) [R11];
   - upload de faturas, CSV ou XLSX pelo próprio cliente;
   - pedido de "dados padronizados" à CCEE pelo representante legal da UC, que pode indicar terceiros, agentes ou não, para recebê-los, inclusive **dados de medição dos últimos 12 meses**, em até 5 dias úteis (PdC Submódulo 1.8, premissa 3.8; **CONFIRMADO** [R10]);
   - telemetria própria do cliente (SCADA, gateway, saída de usuário do medidor), que depende de **HIPÓTESE** por cliente.
10. **GreenAnt/TYR.** Não há evidência de API pública documentada. A GreenAnt foi adquirida pela TYR Energia em fevereiro de 2026, e as notícias dizem que as soluções passam a ser exclusivas da TYR (**NÃO VERIFICADO** em fonte primária [R15][R16]). **BBCE Connect** existe desde 01/07/2023, em módulos, com faturamento separado. Não há preço público e as páginas oficiais deram 403 (**NÃO VERIFICADO** [R13][R14]).

---

## 1. Parte A — §2.1-C: Open Energy, comparador CCEE e abertura da BT

### 1.1 Comunicado da ANEEL de 27/10/2026 (leitura do original)

Fonte: [R1]. Publicado em 27/10/2026, 18h51. A decisão saiu em reunião extraordinária da diretoria. Status geral: **CONFIRMADO**.

- **Definição.** Permite ao consumidor acessar, de forma padronizada, "dados de consumo, faturamento e medição" e, com consentimento prévio, compartilhá-los com outras instituições. O uso é gratuito, e as regras observam a LGPD.
  - **Atenção:** o comunicado fala em "medição", mas o texto da REN restringe o escopo padronizado a dados cadastrais, faturamento e pagamentos (ver §1.2). Para fins de produto, **vale o texto da REN** (**INFERÊNCIA**).
- **Prazos:**
  - 12 meses: página do Open Energy, acesso padronizado aos próprios dados e plataforma de comparação;
  - 24 meses: APIs com consentimento.
- **Consentimento.** O consumidor escolhe com quem compartilha e por quanto tempo, pode revogar e pode consultar quem acessou seus dados.
- **Comparador.** Fica a cargo da CCEE e é acessado pela página da ANEEL. As ofertas são apresentadas **voluntariamente** pelos comercializadores e devem seguir o Código de Defesa do Consumidor.
- **Origem.** Consulta Pública nº 7/2025: 1.515 contribuições de 71 participantes, cerca de 60% aceitas total ou parcialmente.
- **Baixa tensão (Grupo B).** Será tratada em "processo regulatório específico da Agenda Regulatória 2026-2027".
- **Prazo de migração.** Fontes secundárias dizem que a mesma deliberação reduziu de 180 para 90 dias o prazo de migração simplificada de A4/AS [R17]. Isso não apareceu na leitura do comunicado (**NÃO VERIFICADO** na primária).

### 1.2 REN ANEEL nº 1.175/2026: conteúdo relevante

**Fontes:**
- reprodução do DOU em Atlas Público, que traz metadados de publicação de 04/11/2026, Seção 1, ed. 207, p. 91 [R2];
- reprodução em Lex [R3].

A URL do CEDOC da ANEEL e as páginas da CCEE retornaram 403 para acesso automatizado. Status: **CONFIRMADO em reprodução do DOU**. Antes de citar em contrato, recomenda-se conferir no DOU oficial (in.gov.br).

| Tema | Dispositivo | Conteúdo | Status |
|---|---|---|---|
| Modalidades | art. 1º §1º | (I) acesso do consumidor aos próprios dados por interface padronizada; (II) acesso compartilhado mediante consentimento, por integração de sistemas via API | CONFIRMADO |
| Definições | art. 2º | Consentimento é "manifestação livre, informada, prévia e inequívoca de vontade, feita por meio eletrônico". O texto define instituição transmissora, instituição receptora e diretório | CONFIRMADO |
| Participantes obrigatórios | art. 5º | CCEE, agentes de comercialização **varejista** e distribuidoras (concessão ou permissão federal). Varejista e distribuidora atuam obrigatoriamente como **transmissores** | CONFIRMADO |
| Receptora voluntária | art. 5º §3º | Exige registro e **homologação na CCEE** e termo de participação. Acesso só com consentimento. A receptora responde por sigilo e segurança. **Vedado repassar os dados a terceiros.** Deve eliminar os dados após a revogação. **Não paga** pela participação | CONFIRMADO |
| Dados (varejista) | art. 6º | Cadastrais, histórico de faturamento e pagamentos, informações sobre produtos contratados | CONFIRMADO |
| Dados (distribuidora) | art. 6º | Cadastrais, histórico de faturamento e pagamentos | CONFIRMADO |
| Janela e latência | art. 6º §§3º–5º | Últimos 12 meses, mais o último dado disponível com a data em que foi obtido. O último faturamento deve estar disponível em até **5 dias úteis** da emissão | CONFIRMADO |
| Formato | art. 6º §§1º–2º | Formato interoperável. O dicionário de dados fica no **Manual de Instruções do Open Energy** (ANEEL) | CONFIRMADO; conteúdo do Manual NÃO VERIFICADO |
| Ampliação | art. 6º §§6º–7º | Outros dados só "mediante requisição". A ANEEL pode ampliar o escopo pelo Manual, após participação social | CONFIRMADO |
| Acesso próprio | art. 7º | Login e senha na página principal da transmissora, transferência imediata, protocolo a cada acesso, interface responsiva | CONFIRMADO [R3] |
| Prazos do consentimento | arts. 9º–13 | 30 dias, 90 dias, 180 dias, 1 ano ou indeterminado. Termo modelo da ANEEL. Vedado consentimento por adesão, por opção pré-marcada ou presumido. Cada consentimento tem protocolo. A transmissora guarda o registro por ≥ 5 anos e tem o ônus da prova. Consentimento novo é exigido ao fim do prazo, quando o contrato acaba ou quando muda a titularidade | CONFIRMADO [R3] |
| Pedido pela receptora | art. 14 | A receptora que atende o consumidor pode pedir o consentimento, inclusive por redirecionamento para o ambiente de outra instituição | CONFIRMADO |
| Revogação | arts. 15–16 | A qualquer momento. A transmissora notifica a receptora via API e plataforma. A receptora elimina os dados em até **5 dias úteis**, salvo conservação prevista na LGPD. A revogação é automática ao fim do prazo | CONFIRMADO [R3] |
| Papel da CCEE | arts. 8º, 10, 11, 19 | Diretório central, endereços e certificados, plataforma de integração, desenho e documentação das APIs, capacitação, monitoramento e **plataforma comparativa** de produtos e preços dos varejistas, acessada pela página da ANEEL | CONFIRMADO |
| Incidentes | art. 18 | Comunicar ANPD e titular, e reportar à CCEE e à ANEEL | CONFIRMADO [R3] |
| Custos | arts. 4º, 20 | Gratuito para o consumidor. Cada instituição arca com a própria implementação | CONFIRMADO [R3] |
| Sanções | arts. 17, 23 | A ANEEL ou a CCEE podem suspender ou encerrar compartilhamento em caso de fraude ou incidente. Penalidades da REN 846/2019 | CONFIRMADO [R3] |
| Prazos | art. 22 | 12 meses: acesso próprio, ações da CCEE (art. 19 I–II) e página comparativa (com aprovação prévia da ANEEL). 24 meses: APIs | CONFIRMADO |
| Vigência | art. 24 | Na data de publicação (04/11/2026) | CONFIRMADO |

**Antecedentes regulatórios** citados pela CCEE [R5]:
- REN 1.081/2023: 1ª fase da CP 28/2023;
- REN 1.110/2024: 2ª fase da CP 28/2023, com diretrizes sobre compartilhamento de dados e o PdC Submódulo 1.8;
- CP 07/2025, que deu origem à REN 1.175.

Status: **CONFIRMADO** como citação da CCEE. O texto das RENs 1.081 e 1.110 não foi lido.

**Despacho 4.143/2026** (27/10/2026), segundo [R4]:
- aprova a 1ª versão do Manual de Instruções;
- dá à CCEE 15 dias para propor a plataforma de comparação;
- dá à CCEE 30 dias para propor ajustes de Regras e Procedimentos (suspensão, religação, titularidade).

Status: **NÃO VERIFICADO** (fonte secundária: newsletter de jornalista do setor). O Manual em si não foi localizado. Por isso, o dicionário de dados, os padrões de API (OAuth, FAPI, mTLS etc.) e os campos exatos continuam **NÃO VERIFICADO**. **Não planejar endpoints antes de ler o Manual.**

### 1.3 Arquitetura prevista pela CCEE (apresentação de 16/07/2026)

Fonte: "O desenho do Open Energy brasileiro: impactos e próximos passos", CCEE, 16/07/2026 [R5]. O texto foi extraído do PDF. Status: **CONFIRMADO** como desenho proposto, que é **anterior à REN final** e pode ter mudado.

- **Participação voluntária** citada no slide: "Demais agentes da CCEE" e "Interessados em geral: fintechs, consultorias, etc."
- **No slide da minuta, o dado do varejista era "histórico de consumo e de pagamentos".** Na REN final, o texto passou a ser "histórico de faturamento e de pagamentos" (**INFERÊNCIA**: a redação mudou, e consumo mensal provavelmente vem embutido na fatura).
- **Processos documentados:**
  - credenciamento (obrigatório e voluntário);
  - gestão de consentimento e revogação;
  - sandbox;
  - APIs e telas para o consumidor;
  - atendimento;
  - relatórios à ANEEL;
  - monitoramento e não conformidades.
- **Manuais previstos:**
  - Manual Operacional;
  - Manual de integração do diretório central e APIs de governança (protocolo, formato, versionamento, **sandbox**, limites operacionais);
  - Manual de especificações das APIs de dados.

  Nenhum desses manuais foi localizado publicamente (**NÃO VERIFICADO**).
- **Fluxo de consentimento proposto:** o consumidor autoriza; a CCEE formaliza o consentimento com um **token de transação** e o **registro do hash dos dados** no Diretório Central; a receptora pede os dados à transmissora; a transmissora envia. Há partes síncronas e assíncronas (ver diagrama no §3).
- **Roadmap indicativo da fase de APIs:**
  - 12 meses de análise e projeto;
  - 3 meses de preparação de ambientes;
  - 8 meses de criação e homologação das APIs;
  - 3 meses de pentest e testes de performance;
  - "9 meses — CCEE oferece suporte aos varejistas/distribuidoras e disponibiliza APIs para testes em ambiente sandbox";
  - início da operação em produção no horizonte de 2028 (**CONFIRMADO** como indicativo).

### 1.4 Plataforma de comparação de produtos e preços da CCEE

| Aspecto | Achado | Status | Fonte |
|---|---|---|---|
| Base legal | Lei 9.074/1995 art. 15 §17 II "d" (incluído pela Lei 15.269/2025): "produto padrão e do respectivo preço de referência, de modo a facilitar a comparação entre ofertas". Decreto 13.097/2026 art. 10: a CCEE deve disponibilizar "plataforma centralizada que permita a comparação de ofertas de produtos e de preços" | CONFIRMADO | [R6][R7] |
| Regulamentação | REN 1.175 art. 19 V e §§1º–2º: comparativo de produtos e preços **dos comercializadores varejistas**. O consumidor pode se cadastrar ou se descadastrar para receber ofertas. Acesso pela página da ANEEL | CONFIRMADO | [R2][R3] |
| Escopo de ofertantes | Varejistas, com ofertas **voluntárias**, sujeitas ao CDC. O Decreto obriga os varejistas a divulgar modelos de contrato, preço de referência e condições do produto padrão (art. 2º §4º) | CONFIRMADO | [R1][R7] |
| Públicos | Consumidores elegíveis ao varejo: Grupo A com carga < 500 kW, que já precisa de varejista (PdC 1.8 [R10]), e consumidores de BT a partir de 25/11/2027 e 25/11/2028 | INFERÊNCIA | [R7][R10] |
| Grandes consumidores | Grupo A que contrata bilateralmente via atacadista fica **fora** do escopo literal, que se limita a "varejistas" | INFERÊNCIA | [R2] |
| Prazo | ≤ 12 meses da publicação (≤ 04/11/2027), com aprovação prévia da ANEEL. Pelo Despacho 4.143, a CCEE teria 15 dias para enviar a proposta | CONFIRMADO / NÃO VERIFICADO (despacho) | [R2][R4] |
| Situação em 27/11/2026 | **Anunciada e regulamentada, não operacional.** Não foi encontrada URL pública do comparador | CONFIRMADO (ausência de evidência) | busca em 27/11/2026 |
| Integração por API do comparador | Não há previsão encontrada de API pública de ofertas | NÃO VERIFICADO | — |
| Afirmação de "ferramenta gratuita e independente com preços fixos e dinâmicos" | Só aparece em blog jurídico; não consta do texto da REN lido | NÃO VERIFICADO | [R18] |

### 1.5 Abertura do mercado para a baixa tensão

| Item | Conteúdo | Status | Fonte |
|---|---|---|---|
| Lei | **Lei 15.269, de 24/11/2025**, que incluiu §17 no art. 15 da Lei 9.074/1995. Prazos: (a) até 24 meses da entrada em vigor do dispositivo para consumidores industriais e comerciais; (b) até 36 meses para os demais. O art. 24 IV diz que o art. 2º vigora na publicação | CONFIRMADO | [R6] |
| Pré-condições da lei | Plano de comunicação, regulamentação do **Supridor de Última Instância (SUI)**, produto padrão e preço de referência (§17 II) | CONFIRMADO | [R6] |
| Decreto | **Decreto 13.097, de 12/08/2026**, art. 1º: **25/11/2027** para industriais e comerciais; **25/11/2028** para os demais | CONFIRMADO | [R7] |
| Representação | O consumidor de BT é representado por **agente varejista** perante a CCEE, com um único varejista por unidade (art. 2º) | CONFIRMADO | [R7] |
| Medição | A migração pode ocorrer **sem substituir o medidor existente**. A troca por medidor inteligente é opcional e paga pelo consumidor (art. 3º §2º) | CONFIRMADO | [R7] |
| Aviso de migração e retorno | Mínimo de 90 dias para migrar (a ANEEL pode criar rito simplificado mais curto). Retorno ao ACR com aviso de 1 ano, reduzível (arts. 3º e 5º) | CONFIRMADO | [R7] |
| Dados | Art. 9º §2º: compartilhamento de dados pessoais só "mediante o prévio consentimento do usuário" ou com outra base legal da LGPD | CONFIRMADO | [R7] |
| Regulamentação ANEEL | Ainda pendente, em processo da Agenda Regulatória 2026-2027 | CONFIRMADO | [R1] |

**Consequência para o comparador** (**INFERÊNCIA**): sem troca de medidor, a maioria dos consumidores de BT terá apenas leitura mensal. Para essa massa de consumidores, o dado relevante para cotação é a **fatura**, e a comparação tende a ser por **produto padrão**. Isso favorece o comparador oficial e reduz o valor de análise sofisticada de curva no varejo BT. O espaço analítico fica no Grupo A, onde há medição com memória de massa.

### 1.6 Conclusão da Parte A: um comparador privado seria redundante?

- **Redundante** (**INFERÊNCIA** forte): uma vitrine de preços de varejo para BT e Grupo A < 500 kW. Ela competiria com a plataforma oficial, que é gratuita, tem acesso pela página da ANEEL e recebe ofertas obrigatórias de produto padrão. Também competiria com os próprios varejistas, que fazem aquisição de clientes diretamente.
- **Onde ainda há espaço** (**HIPÓTESE** a validar em entrevistas):
  1. **Análise de viabilidade de migração** com dados reais: fatura, TUSD e demanda contratada, curva quando houver, encargos, SUI e risco. O comparador oficial mostra preço de energia, não o custo total nem o risco de exposição.
  2. **Grupo A ≥ 500 kW e consumidores atacadistas**: RFQ estruturado com várias comercializadoras, com perfil, sazonalização, flexibilidade contratual e garantias. Esse caso fica fora do escopo literal do comparador (§1.4).
  3. **Ingestão e normalização** de faturas, CSV de memória de massa e, após 2028, APIs do Open Energy, como serviço para consultorias e gestoras.
  4. **Monitoramento pós-contratação**: consumo × contrato, sazonalização, alertas de exposição ao PLD, conferência de faturas.
  5. **Ponte para RD** (H3), que exige curva de carga. O Open Energy não resolve isso no escopo padronizado atual.
- **Restrição estrutural:** uma startup *receptora* não pode repassar dados a terceiros (art. 5º §3º III). Modelos viáveis (**HIPÓTESE**; validar com advogado):
  - (i) a ferramenta trabalha **para o consumidor**, que é o usuário e decide o que enviar a quem, por ação própria;
  - (ii) SaaS para uma comercializadora ou varejista, em que **a comercializadora é a receptora** e a startup atua como operadora de dados (LGPD art. 5º VII), sem titularidade dos dados;
  - (iii) uso dos dados que o consumidor baixou pela modalidade I e enviou voluntariamente. Nesse caso, o tratamento fica sujeito à LGPD e ao contrato, e não ao termo de receptora; mesmo assim, é preciso checar se essa via contornaria o espírito da vedação.

---

## 2. Parte B — §2.4: disponibilidade real de dados e integrações

### 2.1 Mapa de fontes de dados

| Fonte | O que contém | Granularidade e latência | Quem é dono ou custodiante | Como uma startup sem habilitação obtém | Status |
|---|---|---|---|---|---|
| **Fatura da distribuidora (PDF)** | Consumo ativo mensal (ponta e fora de ponta no Grupo A verde/azul), demanda medida e contratada, ultrapassagem, reativo, bandeira, tarifas TUSD/TE, tributos | Mensal; disponível dias após a leitura | Distribuidora emite; dados do cliente | Upload pelo cliente; OCR ou parsing por leiaute de cada distribuidora | INFERÊNCIA (prática conhecida; leiautes não catalogados aqui) |
| **Open Energy, modalidade I (acesso próprio)** | Cadastro, faturamento e pagamentos, 12 meses, em formato interoperável | Último faturamento ≤ 5 dias úteis da emissão | Transmissora custodia; consumidor é titular | Consumidor baixa e entrega à startup | CONFIRMADO o direito; **disponível só até 04/11/2027** |
| **Open Energy, modalidade II (API)** | Mesmo escopo | Por API; frequência a definir no Manual | Idem | Startup como **receptora voluntária** homologada pela CCEE, com consentimento; vedado repasse | CONFIRMADO a regra; **disponível só até 04/11/2028**; especificação NÃO VERIFICADO |
| **CCEE "dados padronizados" (PdC 1.8, premissa 3.8)** | (i) dados de medição dos últimos 12 meses disponíveis; (ii) histórico de representação varejista; (iii) histórico de suspensão | Lote; entrega em ≤ 5 dias úteis do pedido | CCEE custodia; pedido pelo **representante legal da UC** | O representante legal indica a startup como destinatária ("agentes ou não") | CONFIRMADO [R10]. INFERÊNCIA: o submódulo trata do modelo simplificado; não está confirmado se a premissa vale para todas as UCs. Formato e granularidade da entrega: NÃO VERIFICADO |
| **Medição na CCEE (SCDE / Plataforma de Integração)** | Medidas consolidadas, finais e faltantes; medidas de 5 em 5 minutos por medidor; pontos de medição | 5 minutos. No varejo simplificado, a distribuidora envia diariamente, até MS+7 du | CCEE custodia; agente de medição (distribuidora) envia | **Sem acesso**: exige agente ou consultoria com representação total, certificado e cadastro | CONFIRMADO [R8][R9][R10] |
| **Memória de massa do medidor (SMF)** | Registros de energia ativa e reativa em intervalos (tipicamente 5 ou 15 minutos) | Intervalar; coleta pela distribuidora | O sistema de medição de faturamento segue PRODIST Módulo 5. A distribuidora é o agente de medição que coleta e consiste os dados (PdC 1.8 premissas 3.27–3.30). O dado é do consumidor (titular) | Exportação pelo cliente: portais de grandes clientes de distribuidoras, relatórios do gestor ou consultoria, ou pedido à CCEE (linha acima) | INFERÊNCIA. A titularidade e os custos de adequação do SMF no ACL precisam de leitura do PRODIST Módulo 5 e da REN 1.000 (NÃO VERIFICADO) |
| **Saída de usuário do medidor, gateway ou submedição** | Pulsos ou protocolo serial com consumo em quase tempo real | Segundos a minutos | Equipamento do cliente (gateway) ligado a medidor da distribuidora | Hardware de terceiros (por exemplo, gateways como o GreenAnt GASM-GS, que guarda 30 dias offline [R15]). Requer acordo com o cliente e, às vezes, com a distribuidora | HIPÓTESE por cliente |
| **SCADA / MES / ERP / BMS** | Estado de cargas, produção, setpoints, potência por processo | Segundos a horas | Cliente | Exportação CSV, conector OPC-UA/Modbus ou API do ERP; projeto por cliente | HIPÓTESE (depende de cada cliente; custo de integração alto) |
| **Dados abertos da CCEE** | 205 conjuntos (137 da organização CCEE): PLD_HORARIO, PLD_MEDIA_DIARIA e SEMANAL, CONSUMO_HORARIO_PERFIL_AGENTE (por agente, ativo de carga, **ramo de atividade** e distribuidora), CONSUMO_HORARIO_SUBMERCADO, VAREJISTA_SUBCLASSE, MVE e outros | Horária ou mensal; latência por conjunto (NÃO VERIFICADO) | CCEE; licença **CC-BY 4.0**, CSV e API CKAN | Livre, com atribuição. **Atenção:** `curl` direto recebeu "Acesso bloqueado" pela política de segurança da CCEE em 27/11/2026; a navegação funcionou. Será preciso negociar ou respeitar a política de acesso automatizado | CONFIRMADO [R11] |
| **Linha de base de RD (CCEE)** | A CCEE divulga no site a linha de base dos potenciais participantes (dias úteis e sábados), válida para o mês seguinte; com agregador, a linha é por UC agregada | Mensal | CCEE | Publicação no site; identificação e formato NÃO VERIFICADO | INFERÊNCIA (lido só em trecho de busca do Submódulo 9.1 v1.0, vigência 28/04/2026) [R12] |
| **BBCE (EHUB / Connect API)** | Negócios próprios, boletas, histórico e negócios de mercado anonimizados (Market Data); negociação via API (Trading) | Intradiária | BBCE | Contrato comercial com a BBCE; condições e preço não públicos | NÃO VERIFICADO (páginas com 403; só fonte de 2023) [R13][R14] |
| **GreenAnt / TYR+** | Monitoramento, desagregação, gestão de energia | — | TYR Energia (adquiriu a GreenAnt em fevereiro de 2026) | Não há API pública documentada; segundo notícias, as soluções ficam exclusivas da TYR | NÃO VERIFICADO [R16] |

### 2.2 Plataforma de Integração da CCEE (detalhe)

**Página oficial** [R8], lida em 27/11/2026:
- conecta os sistemas dos agentes aos da CCEE;
- **quem pode usar:** "agentes e consultorias com representação total de seus clientes aderidos à CCEE";
- requisitos: **certificado digital** (link para o ITI, ou seja, ICP-Brasil) e cadastro no SGP;
- documentação no Postman e no GitHub `devccee`.

Status: **CONFIRMADO**.

**Autenticação** [R9]: SSL mútuo com a chave privada do certificado cadastrado (PFX/P12/JKS), host `*.ccee.org.br` (**CONFIRMADO**). Material da CCEE indicado em busca menciona credenciais com certificado e também JWT, em XML e JSON; o certificado deve ser do tipo servidor web SSL e é renovado anualmente (**NÃO VERIFICADO**: só trecho de busca).

**Serviços** listados na coleção Postman pública [R9]. O repositório foi criado em 31/08/2020 e o último *push* foi em 07/07/2023, então a coleção pode estar desatualizada. Status: **CONFIRMADO** que os serviços constam da coleção.

| Grupo | Serviços (recurso na coleção) |
|---|---|
| Ativos | AtivoMedicaoBSv2, ModelagemAtivoBSv2, ParcelaAtivoBSv2, parcelas de carga e usina, topologias |
| Cadastros | ParticipanteMercadoBSv2, PerfilParticipanteMercadoBSv2 |
| Contratos | ImportarArquivoBSv1 (registro e validação de contratos em XML), ResultadoProcessamentoBSv1, ContratoBSv2 (listar e obter ACL/ACR), MontanteEnergiaBSv2 (médios, modulados, anual, mensal, ano contratual, obrigação de entrega) |
| DRI | Eventos contábeis, acrônimos, resultados (semanal, mensal, horário), relatórios |
| Medição | ListarMedidaBSv1 (consolidadas, faltantes, finais), **MedidaCincoMinutosBSv2**, ColetaMedicaoBSv2 (envio de coleta), SituacaoColetaMedicaoBSv2 |
| Webhook | Eventos disponíveis, preferências, resultados de notificação |
| PLD | PLDBSv1 (horário e semanal) |
| Pontos de medição | Por agente relacionado e por código |

Busca indicou limite de 60 chamadas por hora em `obterSituacaoColetaMedicao` (**NÃO VERIFICADO**).

**Conclusões:**
- Uma startup não habilitada **não pode** usar a Plataforma de Integração (**CONFIRMADO** pela regra de acesso).
- Poderia, em tese, cadastrar-se como consultoria com representação total de clientes. Isso exige procuração e cadastro na CCEE e implica responsabilidades (**HIPÓTESE**; verificar no Procedimento de Comercialização de cadastro e representação).
- O PLD está disponível sem esse vínculo pelos dados abertos.

### 2.3 Dados abertos da CCEE

Fonte: Portal de Dados Abertos [R11] (**CONFIRMADO**):
- 205 conjuntos, CSV (e 2 em GZIP), licença CC-BY-4.0, API CKAN;
- conjuntos úteis: `PLD_HORARIO`, `PLD_MEDIA_DIARIA`, `PLD_MEDIA_SEMANAL`, `CONSUMO_HORARIO_PERFIL_AGENTE` (consumo bruto, ajustado e no ponto de conexão, por agente, ativo de carga, ramo de atividade e distribuidora), `CONSUMO_HORARIO_SUBMERCADO`, `CONSUMO_MENSAL_PERFIL_AGENTE`, `VAREJISTA_SUBCLASSE`, `PENALIDADE_CONSUMO_HORARIO`.

**Pendências:**
- "InfoMercado" não foi localizado por nome no portal (**NÃO VERIFICADO**);
- frequência de atualização, timezone e se agentes aparecem por nome ou código (**NÃO VERIFICADO**).

**Usos para a startup** (**INFERÊNCIA**):
- perfis horários típicos por ramo de atividade para estimar curva quando o cliente só tem fatura;
- PLD horário para simular exposição;
- benchmarking.

Mesmo sendo agregados por agente, há riscos: o consumo por agente identifica empresas, e isso não é dado pessoal, mas pode ser dado comercialmente sensível. Respeitar a atribuição exigida pela licença.

### 2.4 GreenAnt / TYR e equivalentes

- **API pública documentada:** **não encontrada**. A busca por documentação de desenvolvedor só retornou o manual do gateway GASM-GS (rev. 1.0, julho de 2021), que envia dados à nuvem da GreenAnt, mostra os dados em painel web e guarda 30 dias offline [R15].
- **Aquisição:** a TYR Energia adquiriu a GreenAnt em fevereiro de 2026, e as soluções seriam de uso exclusivo da TYR. A carteira citada é de 180 empresas e mais de 4.000 pontos de medição [R16]. Status: **NÃO VERIFICADO** em fonte primária. É também INFERÊNCIA que a GreenAnt passa a ser uma **concorrente verticalizada**, e não uma integração neutra.
- **Regra para o MVP:** tratar qualquer fornecedor de medição como **importação de CSV autorizada pelo cliente**, até existir contrato. Não planejar endpoints.

### 2.5 BBCE Connect API

- **Página oficial:** `https://www.bbce.com.br/bbce-connect-api/` retornou **403** em 27/11/2026, assim como o PDF de comunicado [R13][R14].
- **Comunicado de junho de 2023**, conteúdo visto só por trecho de busca:
  - lançamento em **01/07/2023**;
  - seis módulos: Essentials, Post Trading, Trading (negociação via API), Risk, Market Data (negócios próprios, boletas, histórico próprio e negócios da BBCE **sem identificação de contraparte**) e Full;
  - clientes que já usavam APIs migraram automaticamente para o Full;
  - "faturas emitidas separadamente".

  Status: **NÃO VERIFICADO**.
- **Quem pode usar:** **INFERÊNCIA**: clientes ou participantes da BBCE, em geral comercializadoras e agentes do ACL.
- **Custo:** **não publicado**.
- **Regra do PLANO (§1.7):** não executar ordens. Para o MVP, a BBCE é **substituto e concorrente**, e não um insumo. Market Data só com contrato.

### 2.6 Campos mínimos

**Classes de origem:**
- **M** — mensurável: vem de medidor, fatura ou sistema;
- **D** — declarado pelo cliente;
- **I** — inferido por modelo;
- **V** — verificado por terceiro: distribuidora, CCEE, Open Energy ou cartório.

**Convenções** (**HIPÓTESE** de projeto):
- armazenar instantes em **UTC** (ISO-8601 com `Z`) e também o rótulo local `America/Sao_Paulo`;
- o Brasil não tem horário de verão desde 2019;
- os dados da CCEE e da medição seguem o horário de Brasília, o que precisa ser **verificado no dicionário de cada fonte**;
- intervalos sempre como `[início, fim)` com duração explícita (5 min, 15 min, 1 h);
- energia em kWh ou MWh e potência em kW, sempre com unidade no campo;
- toda série com `source`, `source_ref` (arquivo, protocolo ou ID de consentimento), `ingested_at`, `quality_flag` (medido, estimado, ajustado, ausente) e `hash` do arquivo bruto.

#### (a) Cotação ACL

| Campo | Classe | Fonte preferencial | Granularidade | Latência aceitável | Ausência / qualidade | Trilha de auditoria |
|---|---|---|---|---|---|---|
| CNPJ do titular, razão social, código da UC/instalação | V (D na entrada) | Fatura, cadastro do Open Energy, Receita | Por UC | — | Bloqueante | Documento-fonte e data |
| Distribuidora, submercado | V | Fatura; submercado derivado da distribuidora | Por UC | — | Bloqueante | Regra de mapeamento versionada |
| Grupo e subgrupo tarifário (A4, AS, A3…; B no futuro), modalidade (verde/azul) | V | Fatura | Por UC | — | Bloqueante | Página e campo da fatura |
| Demanda contratada (kW, ponta e fora de ponta) | V | Fatura, CUSD | Mensal | — | Bloqueante para Grupo A | Idem |
| Consumo ativo mensal ponta/fora de ponta (kWh), 12 meses | M/V | Fatura, Open Energy (≤ 12 meses) | Mensal | Até 5 dias úteis após a emissão (Open Energy) | Menos de 12 meses: completar com perfil setorial (I), marcado | Arquivo e hash por mês |
| Demanda medida (kW) mensal | M/V | Fatura | Mensal | Idem | Opcional para varejo | Idem |
| Curva de carga (kWh por intervalo) | M | Memória de massa, CCEE dados padronizados, gateway | 5 ou 15 min, ou 1 h | D+1 a M+7 du | Lacunas < 2%: interpolar e marcar; maiores: reprovar a curva e usar perfil (I) | Arquivo bruto, contagem de lacunas, método de preenchimento |
| Perfil horário estimado | I | `CONSUMO_HORARIO_PERFIL_AGENTE` por ramo, escalado pela fatura | 1 h | — | — | Versão do modelo e do conjunto da CCEE |
| Tarifas TUSD/TE e encargos vigentes | V | Fatura, homologação tarifária da ANEEL | Por ciclo tarifário | — | Bloqueante para o cálculo de economia | Resolução homologatória citada |
| Situação ACR/ACL atual, varejista atual, fim do contrato | D/V | Cliente; histórico de representação (CCEE dados padronizados) | Evento | — | Se ausente: "não informado" | Documento ou protocolo |
| Prazo desejado, início do suprimento, flexibilidade (±%), sazonalização, fonte (incentivada/convencional) | D | Cliente | Por pedido | — | Usar padrão explícito e informado | Versão do formulário e usuário |
| Tolerância a risco, preferência preço fixo × PLD+spread | D | Cliente | Por pedido | — | Padrão conservador | Idem |
| Capacidade de garantia, rating ou indicador de crédito | D/V | Cliente, bureau (com base legal) | Por pedido | — | Bloqueante para a proposta firme; não para a indicativa | Consentimento ou base, data |
| Geração própria ou GD na UC | D/V | Fatura (compensação), cliente | Mensal | — | Afeta o líquido; se ausente, perguntar | Idem |
| PLD horário de referência | V | Dados abertos da CCEE | 1 h | D+1 | Bloqueante para simulação | Versão do CSV e hash |

#### (b) Qualificação de flexibilidade / RD

| Campo | Classe | Fonte preferencial | Granularidade | Latência | Ausência / qualidade | Trilha de auditoria |
|---|---|---|---|---|---|---|
| Identificação da UC, ponto de medição, agente CCEE (se houver) | V | CCEE, fatura | Por UC | — | Sem condição de agente: registrar como "precisa de agregador" (Submódulo 9.1 exige UC agregada agente da CCEE [R12], NÃO VERIFICADO na íntegra) | Protocolo |
| Curva de carga histórica ≥ 12 meses | M | Memória de massa, CCEE | **5 min** (granularidade da CCEE) ou 15 min | M+7 du | Sem curva, **não qualifica**: resultado "indicativo" no máximo | Arquivo bruto e hash |
| Linha de base oficial (dia útil e sábado) | V | Publicação da CCEE (Submódulo 9.1) | Mensal, com perfil intradiário | Mensal | Se não publicada: estimar (I) e marcar como não oficial | URL e data de publicação |
| Linha de base estimada pela startup | I | Curva + método documentado | Igual à curva | — | — | Versão do método e parâmetros |
| Cargas flexíveis: descrição, potência (kW), duração máxima, antecedência mínima, frequência máxima, período de recuperação | D | Cliente (engenharia ou operação) | Por carga | — | Bloqueante | Usuário, data, versão |
| Evidência de flexibilidade: eventos passados de redução, dados SCADA/MES | M | SCADA, MES, submedição | 1 s a 15 min | Variável | Sem evidência: o declarado continua só declarado | Export bruto e hash |
| Custo de oportunidade (R$/MWh não consumido ou R$/evento) | D | Cliente | Por carga | — | Pode faltar; marcar | Idem |
| Restrições de segurança e produção, janelas proibidas | D | Cliente | Calendário | — | Bloqueante | Idem |
| Telemetria em tempo quase real disponível? (sim/não, protocolo) | D/M | Cliente, inspeção | — | — | Necessário para operação, não para pré-qualificação | Laudo |
| Representação atual (varejista ou agregador), restrições contratuais | D/V | Cliente, contrato | Evento | — | Bloqueante para a recomendação | Documento |
| Potencial estimado de redução (kW e MWh, por janela) | I | Curva + declarado | Por janela | — | Sempre com intervalo de confiança | Versão do modelo |

**Regras de produto** (**HIPÓTESE**):
- nenhum campo **I** pode ser apresentado a terceiros como **M** ou **V**;
- toda exportação leva `quality_flag` por campo;
- o relatório distingue "qualificação indicativa" (com D/I) de "qualificação com evidência" (com M/V).

### 2.7 Considerações de LGPD (não é parecer)

- **Dados de empresas.** CNPJ, consumo da UC de pessoa jurídica e faturas de PJ **não são dados pessoais** pela definição do art. 5º I da LGPD ("pessoa natural identificada ou identificável") [R19]. Podem ser, ainda assim, informação comercial sensível e devem ser protegidos por contrato e NDA (**INFERÊNCIA**).
- **Dados pessoais presentes mesmo em B2B:**
  - nome, CPF e e-mail de representantes legais e usuários (o PdC 1.8 exige o CPF do representante [R10]);
  - empresários individuais e MEI, cujo CNPJ identifica a pessoa;
  - consumidores de BT pessoa física a partir de 25/11/2028.

  Curvas de carga de residências ou pequenos estabelecimentos podem revelar hábitos (**INFERÊNCIA**).
- **Bases legais possíveis** (art. 7º [R19]), que devem ser escolhidas e documentadas por finalidade:
  - **consentimento** (I): exigido pela REN 1.175 para o compartilhamento via Open Energy, e o Decreto 13.097 art. 9º §2º também prevê o consentimento ou outra base da LGPD [R7];
  - **execução de contrato** ou procedimentos preliminares a pedido do titular (V): por exemplo, o cliente que pede uma cotação;
  - **legítimo interesse** (IX): por exemplo, segurança e prevenção a fraude, com teste de balanceamento e registro (art. 37);
  - **cumprimento de obrigação legal ou regulatória** (II): por exemplo, guarda de registros exigida pela REN, se a startup for receptora.
- **Requisitos que se sobrepõem:**
  - LGPD: revogação a qualquer tempo (art. 8º §5º), portabilidade (art. 18 V), registro de operações (art. 37), segurança (art. 46), comunicação de incidente à ANPD e ao titular (art. 48);
  - REN 1.175 como receptora: eliminar os dados em ≤ 5 dias úteis após a revogação, **vedar o repasse**, reportar incidentes também à CCEE e à ANEEL.
- **Papéis** (**HIPÓTESE**):
  - quando o consumidor usa a ferramenta, a startup é **controladora** dos dados de usuários e representantes;
  - quando presta SaaS a uma comercializadora sobre os clientes dela, a startup é **operadora**.

  Definir isso em contrato (DPA) e no RIPD, se houver risco elevado.

---

## 3. Diagrama: consentimento e fluxo de dados

O fluxo do Open Energy segue o desenho da CCEE de 16/07/2026 [R5] e a REN 1.175 [R2]. Os nomes de endpoints **não existem** publicamente; o diagrama é conceitual.

```mermaid
sequenceDiagram
    autonumber
    actor C as Consumidor (titular da UC)
    participant S as Startup (receptora voluntária homologada)
    participant DC as CCEE - Diretório Central
    participant T as Transmissora (distribuidora ou varejista)
    participant CO as Comercializadora

    Note over S,DC: Pré-requisito: registro, homologação e termo de participação na CCEE (art. 5º §3º)
    C->>S: Pede análise ou cotação
    S->>C: Pede consentimento (art. 14), com redirecionamento
    C->>T: Autentica e consente: finalidade e prazo (30, 90, 180 dias, 1 ano ou indeterminado)
    T->>DC: Formaliza o consentimento (token de transação, protocolo, hash)
    DC-->>S: Notifica a autorização
    S->>T: Pede dados via API (mTLS ou certificados do diretório; padrão NÃO VERIFICADO)
    T-->>S: Cadastro, faturamento e pagamentos (12 meses)
    S->>C: Análise, simulação, comparação
    Note over S,CO: Vedado à receptora repassar dados a terceiros (art. 5º §3º III)
    C-->>CO: O próprio consumidor decide contatar ou enviar dados (fora do Open Energy)
    C->>T: Revoga (a qualquer tempo) ou o prazo expira
    T->>S: Notifica a revogação (API e plataforma)
    S->>S: Elimina os dados em ≤ 5 dias úteis (salvo conservação prevista na LGPD)
```

Caminhos de dados para uma startup **sem** habilitação, hoje e após cada marco:

```mermaid
flowchart LR
    subgraph Hoje["Hoje (27/11/2026)"]
      F[Upload de faturas PDF, CSV ou XLSX pelo cliente]
      MM[CSV de memória de massa exportado pelo cliente]
      DP[CCEE: dados padronizados, pedido do representante legal indicando a startup - PdC 1.8 premissa 3.8]
      DA[Dados abertos CCEE CC-BY 4.0: PLD e consumo por ramo]
      SC[Export SCADA/MES/gateway do cliente]
    end
    subgraph F1["≤ 04/11/2027"]
      OE1[Open Energy modalidade I: o consumidor baixa e entrega]
      CMP[Comparador CCEE - concorrente gratuito]
    end
    subgraph F2["≤ 04/11/2028"]
      OE2[Open Energy API: startup como receptora homologada, sem repasse]
    end
    X[Plataforma de Integração CCEE: NÃO acessível sem representação]
    F & MM & DP & DA & SC --> N[Normalização + quality_flag + hash + consentimento]
    OE1 --> N
    OE2 --> N
    N --> A[Análise para o consumidor: cotação indicativa ou pré-qualificação]
```

---

## 4. Implicações para as hipóteses do PLANO

**H4 — ferramenta de cotação para empresas** (**INFERÊNCIA** e **HIPÓTESE**):
- O Open Energy reduz a fricção para obter a fatura padronizada, mas só a partir de 2027 (modalidade I) e de 2028 (API).
- O comparador oficial derruba o valor de uma vitrine de preços de varejo.
- O valor residual está em três lugares:
  - (i) TCO e risco da migração, e não só o preço;
  - (ii) Grupo A ≥ 500 kW e RFQ bilateral;
  - (iii) gestão pós-contrato.
- A vedação de repasse impede o modelo "coleto dados e vendo leads qualificados às comercializadoras" sobre dados do Open Energy.

**H3 — pré-qualificação de flexibilidade** (**INFERÊNCIA**):
- O Open Energy não ajuda no escopo atual, porque não inclui curva de carga.
- A curva continua vindo de memória de massa, de dados padronizados da CCEE pedidos pelo cliente ou de telemetria própria.
- A operação em RD exige agregador ou agente da CCEE.

---

## 5. Lacunas e próximos passos

| # | Lacuna | Consequência | Ação sugerida |
|---|---|---|---|
| L1 | Texto oficial da REN 1.175 no DOU, conferido em in.gov.br | Baixo risco: já lido em reprodução | Conferir no DOU (ed. 207, 04/11/2026, p. 91) |
| L2 | Despacho 4.143/2026 e **Manual de Instruções do Open Energy** (dicionário de dados, padrão de API) | **Sem isso, não se especifica integração** | Buscar no SIGA/CEDOC da ANEEL; pedir via Fala.BR/LAI se necessário |
| L3 | Manuais técnicos da CCEE (operacional, diretório, APIs) e **sandbox** | Cronograma de integração incerto | Acompanhar o portal da CCEE e os workshops anunciados |
| L4 | Se a premissa 3.8 do PdC 1.8 (dados padronizados) vale para todas as UCs ou só para o modelo simplificado; formato e granularidade entregues | Define o canal de curva de carga mais barato hoje | Testar com um cliente real, com consentimento; ler as Regras de Comercialização |
| L5 | Titularidade e acesso à memória de massa pela distribuidora (PRODIST Módulo 5, REN 1.000/2021) | Define se o cliente pode exigir CSV da distribuidora e em quanto tempo | Leitura dirigida das normas |
| L6 | Condições da BBCE Connect (elegibilidade, preço, termos) | Não planejar integração | Contato comercial, só com aprovação dos fundadores (PLANO §1.8) |
| L7 | API da GreenAnt/TYR | Não planejar integração | Contato, só com aprovação dos fundadores |
| L8 | Submódulo 9.1 da CCEE (RD) na íntegra e REN vigente de RD (1.030/2022 × 1.080/2023 × proposta do ONS de prorrogar o sandbox até 2030) | Afeta H3 | Ler o PdC 9.1 e a Nota Técnica do ONS (escopo de outra seção do PLANO) |
| L9 | Política de acesso automatizado aos dados abertos da CCEE (bloqueio a `curl`) | A ingestão automática pode falhar | Testar com User-Agent identificado ou baixar manualmente; consultar o atendimento da CCEE |
| L10 | Possibilidade de a startup se cadastrar como "consultoria com representação total" | Abriria a Plataforma de Integração, com responsabilidades | Ler o PdC de cadastro e representação; avaliação jurídica |
| L11 | Leitura jurídica da vedação de repasse (art. 5º §3º III) aplicada a dados baixados pelo próprio consumidor (modalidade I) | Define a viabilidade dos modelos (i) a (iii) do §1.6 | Parecer jurídico |

---

## 6. Referências

Todas foram consultadas em 27/11/2026.

| # | URL | Órgão / autor | Data de publicação | Data de consulta | Status |
|---|---|---|---|---|---|
| R1 | https://www.gov.br/aneel/pt-br/assuntos/noticias/2026/aneel-avanca-com-abertura-do-mercado-e-institui-open-energy | ANEEL | 27/10/2026 | 27/11/2026 | CONFIRMADO (lido) |
| R2 | https://atlaspublico.com.br/regulacao/dou/resolucao-normativa-n-1-175-de-27-de-outubro-de-2026-892198 | Reprodução do DOU (ato da ANEEL) | DOU 04/11/2026 (ato de 27/10/2026) | 27/11/2026 | CONFIRMADO (reprodução do DOU; conferir no oficial) |
| R3 | https://www.lex.com.br/resolucao-normativa-aneel-no-1-175-de-27-de-outubro-de-2026/ | Lex (reprodução da REN ANEEL 1.175) | 27/10/2026 (ato) | 27/11/2026 | CONFIRMADO (reprodução; lida em resumo) |
| R4 | https://alexandrecanazio.substack.com/p/open-energy-vira-realidade-com-publicacao | Alexandre Canazio (newsletter Energy Mix) | 04/11/2026 | 27/11/2026 | NÃO VERIFICADO (secundária; Despacho 4.143) |
| R5 | https://www.ccee.org.br/documents/80415/35635906/2026.07.16%20-%20%5BCCEE%5D%20Projeto%20Open%20Energy%202%20(VF)%201.pdf/459f2156-de6b-da8c-3d43-ffc46871fc65 | CCEE, "O desenho do Open Energy brasileiro" | 16/07/2026 | 27/11/2026 | CONFIRMADO (PDF lido; desenho anterior à REN) |
| R6 | https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/lei/L15269.htm | Presidência da República, Lei 15.269/2025 | 24/11/2025 | 27/11/2026 | CONFIRMADO (lido) |
| R7 | https://planalto.gov.br/ccivil_03/_ato2023-2026/2026/decreto/d13097.htm | Presidência da República, Decreto 13.097/2026 | 12/08/2026 | 27/11/2026 | CONFIRMADO (lido) |
| R8 | https://www.ccee.org.br/documentos/plataforma-de-integracao | CCEE | sem data na página | 27/11/2026 | CONFIRMADO (lido) |
| R9 | https://github.com/devccee/postman-collections | CCEE (conta `devccee`) | criado em 31/08/2020; último push em 07/07/2023 | 27/11/2026 | CONFIRMADO (README e coleção lidos; pode estar desatualizado) |
| R10 | https://www.ccee.org.br/o/ccee/documentos/CCEE_1179201 | CCEE, PdC Submódulo 1.8 (Comercialização varejista, modelo simplificado), rev. 1.0, aprovado pela REN 1.110/2024 | vigência 01/07/2025 | 27/11/2026 | CONFIRMADO (PDF lido) |
| R11 | https://dadosabertos.ccee.org.br/dataset | CCEE, Portal de Dados Abertos | contínuo | 27/11/2026 | CONFIRMADO (listagem lida; `curl` bloqueado) |
| R12 | https://www.ccee.org.br/documents/80415/31255394/9.1_-_Resposta_da_demanda_v1.0.pdf/69de880d-0969-567a-5f58-a980678b13e6 | CCEE, PdC Submódulo 9.1 (Resposta da Demanda), v1.0 | vigência 28/04/2026 (segundo trecho de busca) | 27/11/2026 | NÃO VERIFICADO (só trecho de busca) |
| R13 | https://www.bbce.com.br/bbce-connect-api/ | BBCE | — | 27/11/2026 | NÃO VERIFICADO (HTTP 403) |
| R14 | https://bbce.com.br/wp-content/uploads/2023/06/Comunicado-Externo-BBCE-BBCE-Connect-1.pdf | BBCE, comunicado externo | junho de 2023 | 27/11/2026 | NÃO VERIFICADO (403; conteúdo só por trecho de busca) |
| R15 | https://www.greenant.com.br/wp-content/uploads/2022/05/MN-OP-10-Manual-do-Usuario-GASM-GS.pdf | GreenAnt, manual MN-OP-10 rev. 1.0 | julho de 2021 | 27/11/2026 | NÃO VERIFICADO (trecho de busca) |
| R16 | https://cenarioenergia.com.br/2026/02/19/tyr-energia-adquire-greenant-e-reforca-posicao-estrategica-para-abertura-total-do-mercado-livre-de-energia/ | Cenário Energia (imprensa setorial) | 19/02/2026 | 27/11/2026 | NÃO VERIFICADO (secundária, trecho de busca) |
| R17 | https://gdihub.com.br/artigos/aneel-open-energy-migracao-mercado-livre-2026/ | GDI Hub (imprensa setorial) | novembro de 2026 | 27/11/2026 | NÃO VERIFICADO (secundária; prazo de 90 dias para A4/AS) |
| R18 | https://webadvocacy.com.br/blog/2026/10/29/abertura-mercado-energia/ | WebAdvocacy (blog jurídico) | 29/10/2026 | 27/11/2026 | NÃO VERIFICADO (secundária, trecho de busca) |
| R19 | https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm | Presidência da República, Lei 13.709/2018 (LGPD) | 14/08/2018 (com alterações) | 27/11/2026 | CONFIRMADO (arts. 5º, 7º, 8º, 18, 37, 46 e 48 lidos) |
| R20 | https://tagdlaw.com.br/ons-propoe-prorrogar-sandbox-de-resposta-da-demanda-ate-2030-e-ampliar-flexibilidade/ | TAGD Law (blog jurídico) | outubro de 2026 | 27/11/2026 | NÃO VERIFICADO (proposta do ONS, não é norma) |

Tentativas sem sucesso, registradas para reprodutibilidade:
- `https://www2.aneel.gov.br/cedoc/ren20261175.pdf`: URL presumida pelo padrão do CEDOC, HTTP 403, existência não confirmada;
- `https://dadosabertos.ccee.org.br/api/3/action/package_list` via `curl`: página "Acesso bloqueado" da CCEE.
