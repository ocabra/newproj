# PLANO.md — Pesquisa, viabilidade e MVP de uma plataforma B2B para o mercado brasileiro de energia

> **Papel deste documento:** prompt mestre para um agente de IA com acesso à internet, ao repositório e às ferramentas de desenvolvimento. Execute as etapas na ordem. A pesquisa e a decisão de negócio são pré-requisitos para qualquer implementação.
>
> **Data de referência inicial:** 27/11/2026. Verifique a data corrente e a vigência das regras antes de utilizar qualquer informação. Não trate páginas antigas como legislação atual.
>
> **Idioma de trabalho:** português do Brasil; código, identificadores e especificação OpenAPI preferencialmente em inglês. Interface para usuários em português do Brasil.

## 0. Missão e contexto

Você é simultaneamente pesquisador de mercado, especialista em produtos B2B, analista econômico-financeiro, arquiteto de software e engenheiro full-stack sênior. Sua missão é **descobrir se existe um negócio rentável e defensável** que conecte empresas consumidoras/industriais a comercializadoras ou agregadoras de energia por meio de um portal web e uma API B2B. **Não presuma que a ideia inicial seja viável.** Caso a pesquisa indique inviabilidade, proponha, compare, escolha e justifique um reposicionamento antes de desenvolver software.

Contexto conhecido:

- Operação inicialmente no Brasil, com foco comercial possível em São Paulo, mas sem restrição geográfica assumida até validação.
- Dois fundadores com forte capacidade técnica de desenvolvimento, mas sem experiência operacional comprovada no setor elétrico.
- Orçamento de referência de **R$ 60.000 para infraestrutura e recursos de implantação tecnológica**. Não interprete esse valor como capital de giro total, verba para garantias financeiras ou orçamento para contratar equipes inteiras. Demonstre separadamente os custos de operação, regulação, especialistas, comercial e aquisição de clientes.
- Ideia inicial: uma **empresa se autentica em um portal e cadastra ofertas ou oportunidades**; comercializadoras autorizadas consultam essas ofertas, filtram, fazem propostas e integram o processo por uma **API documentada**. O significado jurídico e econômico de “oferta” deve ser definido após a pesquisa.
- Fontes de medição e análise de terceiros, como GreenAnt, são integrações **candidatas**, nunca dependências presumidas. Comece com importação autorizada de dados e integrações simuladas quando necessário.
- A empresa não é uma comercializadora, agregadora habilitada, bolsa de energia, agente da CCEE ou representante de clientes **por padrão**. Não atribua a ela essas condições sem evidência documental, contratação e habilitação aplicável.

**Princípio principal:** NÃO CONSTRUA UM MARKETPLACE POR INTUIÇÃO. INVESTIGUE A CADEIA DE VALOR, IDENTIFIQUE QUEM PAGA, VALIDE PERMISSÕES E DISTRIBUIÇÃO, FAÇA A CONTA E SÓ ENTÃO ESCREVA O MENOR PRODUTO QUE RESOLVE UM PROBLEMA REAL.

## 1. Regras inegociáveis de execução

1. **Separar fatos, hipóteses e estimativas.** Cada afirmação material sobre regulação, práticas de mercado, remuneração, integração, disponibilidade de APIs ou concorrência deve ter URL, órgão/autor, data de publicação e data de consulta. Marque resultados como `CONFIRMADO`, `INFERÊNCIA`, `HIPÓTESE` ou `NÃO VERIFICADO`.
2. **Priorizar fontes primárias:** ANEEL, CCEE, ONS, MME, EPE, leis e atos oficiais. Para concorrentes, consultar também documentação, termos, produtos e APIs oficiais. Entrevistas reais têm prioridade sobre marketing para validar disposição a pagar.
3. **Não inventar:** entrevistas, clientes, autorizações, APIs, credenciais, preços praticados, disponibilidade de dados, participação de mercado, contratos, volumes despachados ou resultados de testes. Se algo não puder ser verificado, registrar a pendência e sua consequência.
4. **Não confundir os mercados:**
   - **ACL:** contratos bilaterais de compra e venda de energia entre agentes; preço, duração, volume, garantias e demais termos são negociados entre partes, com registro e regras aplicáveis na CCEE.
   - **Resposta da Demanda (RD):** oferta de redução/deslocamento de consumo de cargas elegíveis, sob regras próprias; pode envolver agregadores, habilitação, ofertas ao ONS, medição, linha de base e contabilização pela CCEE.
   - **Eficiência energética:** diminuição estrutural do consumo e desperdício; não equivale automaticamente a oferta de RD.
   - **Geração distribuída/créditos de compensação:** regime distinto; não autoriza livre transferência de energia/créditos para qualquer empresa.
5. **Não assumir que comercializadoras “negociam com a ANEEL”.** ANEEL regula e fiscaliza; descrever com precisão os papéis de ANEEL, CCEE, ONS, MME, distribuidora, gerador, consumidor, comercializadora, agente varejista, agregador, bolsa/plataforma de negociação e operador tecnológico.
6. **Não confundir kW/MW (potência) com kWh/MWh (energia)** nem preço R$/MWh com remuneração por disponibilidade R$/MW/período. Toda conta deve declarar unidade, período, hipótese e fonte.
7. **Não operar automaticamente o mercado real no MVP.** Sem autorização, representação, controles de crédito, habilitação e avaliação jurídica, o sistema é ferramenta de descoberta, qualificação, cotação e coordenação. Não enviar ofertas ao ONS/CCEE nem executar ordens na BBCE automaticamente.
8. **Não comprar serviços, contratar terceiros, utilizar dados reais sem consentimento, disparar campanhas externas ou assumir obrigações jurídicas** sem aprovação explícita dos fundadores.
9. **Minimizar custos e complexidade.** A escolha de Rust/WASM deve ser comprovada por um problema concreto de desempenho/isolamento ou reutilização, não por preferência tecnológica. Nunca construir microserviços ou blockchain como ponto de partida sem necessidade mensurável.
10. **Entregar resultados reproduzíveis:** documentos Markdown, referências, cálculo com fórmulas, software executável, migrações, testes, logs de validação e instruções para rodar localmente.

## 2. Etapa A — Pesquisa de mercado profunda (OBRIGATÓRIA; sem código de produto)

### 2.1 Mapear a cadeia de valor e os fluxos financeiros

Pesquise e documente, com diagramas Mermaid e exemplos completos, pelo menos estes fluxos:

**A. Compra/venda convencional de energia no ACL**

- Quem pode comprar/vender e sob quais condições legais e cadastrais; diferenças entre comercializadoras atacadistas e varejistas.
- Como se formam propostas e cotações: bilateral, RFQ, corretoras, leilões privados, plataformas de negociação, telefone, brokers; qual o papel dos relacionamentos comerciais, limites de crédito e garantias.
- Produtos contratados: quantidade, MW médios/MWh, perfil de entrega, submercado, fonte, sazonalização, modulação, prazo, preço, reajustes, garantias, risco de contraparte e forma de pagamento.
- Processo real de fechamento, assinatura, registro do contrato na CCEE, validações, medição, contabilização, liquidação das diferenças e PLD. Diferenciar faturamento contratual bilateral de liquidação na CCEE.
- Onde atuam ANEEL e ONS **sem descrevê-los como compradores bilaterais comuns**.
- Quais dados de consumo são suficientes para cotação e quais exigem titularidade, representação ou consentimento.

**B. Resposta da Demanda e agregação de flexibilidade industrial**

- Produtos e mecanismos vigentes **na data atual**, elegibilidade, oferta mínima, duração, antecedência, periodicidade, critérios de ativação, regras de medição/linha de base, remuneração, descontos, penalidades e suspensão.
- Quem está autorizado a agregar, registrar cargas e ofertar; papel de consumidor, agregador, comercializadora, varejista, ONS e CCEE.
- Particularidades de cargas representadas por agentes varejistas e de outras restrições à livre escolha de agregador.
- Fluxo da empresa industrial até a oferta ao ONS: dados, consentimento, avaliação técnica, contratação, disponibilidade, acionamento, medição, apuração, pagamento e repasse.
- Se há negociação bilateral de “flexibilidade” com comercializadoras fora da RD regulada, identificar base legal, formato real, compradores, contrato e liquidez. **Nunca presumir** a existência de um mercado líquido de ofertas que pode ser casado automaticamente.
- Diferenças entre receita por disponibilidade e por acionamento; custos e riscos de não entrega.

**C. Comparação de planos de energia e migração no varejo ACL**

- Investigar o **Open Energy instituído pela ANEEL em 2026**, o cronograma oficial, modelo de consentimento, APIs e a futura/atual plataforma de comparação de produtos e preços da CCEE.
- Determinar se um comparador privado seria redundante ou se existe espaço para análise, integração e automação especializada.
- Verificar se os prazos de implantação ou direitos de acesso já estão em vigor. Não afirmar que API ou plataforma está operacional apenas porque foi anunciada.

Entregável: `docs/01-MERCADO.md`, incluindo mapa de atores, fluxos comerciais, fluxos financeiros, papéis regulatórios e glossário de termos.

### 2.2 Identificar compradores, vendedores e o problema concreto

Investigar de forma separada:

- **Indústrias/consumidores:** quais dados possuem, quem decide, como fornecem autorização, quais processos têm flexibilidade comprovável, quais riscos de produção aceitam, por que cadastrariam ofertas, qual economia ou renda esperam.
- **Comercializadoras e varejistas:** quem é o comprador da solução dentro da organização (trading, originação, gestão de carteira, inovação, TI, operações), que ofertas desejam receber, critérios de análise, processos atuais, integrações e orçamentos.
- **Agregadoras habilitadas:** comprariam leads, capacidade pré-qualificada, previsão, telemetria, monitoramento de disponibilidade ou software de operação? Quais responsabilidades continuariam com elas?
- **Consultorias/gestoras energéticas:** canal de aquisição, integrador, concorrente ou primeiro cliente?

Para cada segmento responder: problema hoje, custo do problema, alternativa atual, frequência, responsável pelo orçamento, custo de aquisição, ciclo comercial, sensibilidade regulatória e confiança necessária.

Preparar roteiro de entrevista com perguntas **não indutivas** e uma lista de perfis-alvo. Se não houver acesso a pessoas reais, registrar `VALIDAÇÃO COM CLIENTES PENDENTE`; não substituir entrevistas por depoimentos inventados.

Entregável: `docs/02-CLIENTES-E-PROBLEMAS.md`.

### 2.3 Concorrentes e substitutos (obrigatoriamente)

Pesquisar diretamente produtos, documentação técnica, preço publicamente visível, diferenciais e limitações de:

- **BBCE, EHUB e BBCE Connect/APIs:** negociação e formalização de energia no ACL, integração corporativa, liquidez, barreiras e contratos. Reconhecer que um marketplace genérico competiria com infraestrutura de mercado consolidada.
- **Plataforma de comparação CCEE/Open Energy:** escopo planejado, públicos e API/consentimento, com cronograma e fontes.
- **AXIA Energia:** agregação de RD, portal, ofertas, modelo comercial e serviços oferecidos.
- **Simple Energy:** evidências de agregação de RD, produtos, clientes e funcionamento, distinguindo anúncio de liquidação efetiva.
- **GreenAnt/TYR Energia e outras empresas de medição/analytics:** funcionalidades, formas de integração, titularidade e licença de dados, distribuição e concorrência.
- Outras comercializadoras, originadoras, corretoras e plataformas de software que apareçam na investigação.

Criar **matriz de concorrência real**, não uma lista de nomes. Comparar: segmento atendido, tarefa resolvida, canal de aquisição, acesso a dados, forma de cobrar, autorizações necessárias, API, diferenciais e fraquezas comprovadas. **Não afirmar que a AXIA atua pouco sem indicadores.**

Entregável: `docs/03-CONCORRENCIA.md`.

### 2.4 Dados e integrações: disponibilidade real

Investigar quais dados existem, suas permissões e como obtê-los legalmente:

- Arquivos CSV/XLSX, histórico de faturas e curvas de carga, sistemas SCADA/MES/ERP/medidores e gateways industriais.
- APIs documentadas da CCEE, plataforma de integração, requisitos de representação, certificado digital, termos e permissões.
- Open Energy: dados compartilháveis, consentimento, etapas do cronograma, quando a interface está efetivamente disponível.
- GreenAnt e equivalentes: comprovar API pública ou acesso contratual antes de planejar integração real; não presumir endpoints, credenciais ou parceria.
- APIs de corretoras/BBCE: condições contratuais, custos e autorização de uso; não executar negociações sem autorização.

Definir campos mínimos para cotação ou flexibilidade e distinguir: **mensurável**, **declarado pelo cliente**, **inferido**, **verificado por terceiro**. Especificar qualidade, granularidade, timezone, latência, ausência de dados e trilha de auditoria.

Entregável: `docs/04-DADOS-E-INTEGRACOES.md`.

### 2.5 Fontes para começar — verificar vigência, não copiar sem análise

1. CCEE — Contratos e CCEAL: https://www.ccee.org.br/pt/web/guest/mercado/contratos
2. CCEE — Procedimentos de Comercialização: https://www.ccee.org.br/pt/web/guest/mercado/procedimentos-de-comercializacao
3. CCEE — Resposta da Demanda: https://www.ccee.org.br/pt/web/guest/resposta-demanda
4. CCEE — Plataforma de Integração e APIs: https://www.ccee.org.br/documentos/plataforma-de-integracao
5. ONS — Resposta da Demanda: https://www.ons.org.br/paginas/energia-amanha/resposta-da-demanda
6. ANEEL — Open Energy, comunicado de 27/10/2026: https://www.gov.br/aneel/pt-br/assuntos/noticias/2026/aneel-avanca-com-abertura-do-mercado-e-institui-open-energy
7. ANEEL — Convenção de Comercialização, REN 957/2021 (ver alterações posteriores): https://www2.aneel.gov.br/cedoc/ren2021957.pdf
8. EPE — Estudo do potencial de RD (2026): https://epe.gov.br/pt/imprensa/noticias/epe-estima-potencial-de-8-8-gw-de-resposta-da-demanda-no-brasil-e-propoe-aprimoramentos-para-o-mercado
9. BBCE — EHUB e mercado ACL: https://www.bbce.com.br/mercado-livre/
10. BBCE — APIs: https://www.bbce.com.br/bbce-connect-api/
11. AXIA — Plataforma de RD: https://axia.com.br/negocios/respostadademanda
12. Diário Oficial, Planalto e portal da legislação da ANEEL para confirmar texto vigente e eventuais atualizações.

Faça pesquisas adicionais com termos distintos, busque documentos oficiais originais, verifique datas e mantenha um **registro de evidências** com links e pontos não confirmados em `docs/REFERENCIAS.md`.

## 3. Etapa B — Avaliar e escolher o modelo de negócios

### 3.1 Hipóteses que devem competir entre si

Avaliar no mínimo quatro estratégias:

| Código | Estratégia | Hipótese inicial | Principal risco a testar |
|---|---|---|---|
| H1 | Marketplace/RFQ para compra e venda de energia no ACL | Empresas solicitam propostas; comercializadoras respondem via portal e API | BBCE/CCEE, acesso a liquidez, crédito, rede comercial e diferenciação insuficiente |
| H2 | Marketplace de capacidade de RD industrial | Indústrias cadastram flexibilidade; agregadoras/comercializadoras elegíveis fazem propostas de representação/gestão | Elegibilidade, continuidade de oferta, medição, confiança e poucos compradores |
| H3 | SaaS/API de pré-qualificação de flexibilidade | Comercializadoras/agregadoras compram dados validados, previsões e workflow B2B | Custo de dados, ausência de disposição a pagar e integração operacional |
| H4 | Ferramenta de gestão/cotação de energia para empresas | Empresas recebem análises/solicitações de proposta com dados autorizados e integrações com varejistas | Open Energy e comparador oficial, preço baixo, custo comercial |

Adicionar outras hipóteses somente se houver evidência de problema relevante e pagante. Não escolher H2 apenas porque é tecnicamente interessante; não escolher H1 apenas porque o termo “marketplace” parece escalável.

### 3.2 Viabilidade financeira e regulatória

Para cada hipótese, levantar e calcular:

- **Quem paga e por qual evento:** assinatura, licença SaaS por empresa/unidade, uso de API, mensalidade por MW **qualificado**, por projeto, sucesso/contrato, receita variável por operação ou modelo híbrido.
- **Unit economics:** ticket anual, margem de contribuição, despesas com dados e integração, custo de atendimento por cliente, CAC, ciclo de venda, payback, churn provável, custo de especialistas, impostos estimados e exposição a multas/garantias.
- **TAM / SAM / SOM:** estimar de baixo para cima usando número de clientes elegíveis, taxa de adoção e preço observável. Separar mercado tecnicamente possível, contratável e capturável; evitar converter automaticamente 8,8 GW de potencial técnico em faturamento de software.
- **Cenários pessimista/base/otimista**, cada um com hipóteses rastreáveis e sensibilidade a clientes pagantes, uso, ticket, custo de vendas e intervalo entre contratos de RD.
- **Fluxo de caixa para 12 e 24 meses**, necessidade real de capital e runway. O orçamento de R$ 60 mil de infraestrutura não cobre automaticamente os demais custos.
- **Regulação e risco jurídico:** quando basta vender software e quando passam a ser necessários habilitação, representação, contratação regulada, garantias, controles adicionais, registros e assessoria jurídica especializada.
- **Moat/defensabilidade:** dados autorizados difíceis de replicar, integração, qualidade da verificação, relacionamento com indústrias, especialização em um vertical, canal de distribuição ou outra vantagem mensurável.
- **Risco de marketplace de dois lados:** qual lado é adquirido primeiro, por que participa sem liquidez, concentração de compradores e alternativas de entrada sem marketplace público.

Documentar as fórmulas, dados de entrada e análise de sensibilidade em `docs/05-ECONOMIA-E-MODELOS.md`. Usar tabelas reproduzíveis ou um script de cálculos simples. Se preços forem desconhecidos, usar faixas claramente rotuladas como hipótese e deixar pendência comercial explícita.

### 3.3 Critérios de decisão e pivô

Preencher matriz com notas justificadas de 0 a 5 para: demanda comprovada, clareza de comprador, facilidade de aquisição, diferenciação, acesso a dados, risco regulatório, time-to-value, margem, intensidade de capital e viabilidade para dois fundadores. Ajustar pesos e explicar a decisão; não usar uma pontuação arbitrária para mascarar incerteza.

**GO** apenas quando houver:

1. Oferta de valor e tipo de contrato juridicamente coerentes, sem exercício indevido de atividade regulada.
2. Um comprador B2B específico e problema verificável.
3. Dados mínimos acessíveis de forma lícita, nem que inicialmente via CSV autorizado.
4. Caminho plausível para vender o serviço, com estimativas de margem e custo.
5. Produto mínimo factível com o orçamento e a equipe disponíveis.

**GO CONDICIONAL** quando faltarem entrevistas ou confirmação de intenção de compra: desenvolver somente protótipo reversível e demonstrável, sem chamar a hipótese de validada.

**PIVOT** quando o marketplace de energia ou flexibilidade exigir licenças, liquidez, garantias, parceiros ou capital incompatíveis com o estágio atual. Uma alternativa preferencial a avaliar é **software/API white-label de originação e qualificação de flexibilidade para comercializadoras/agregadoras já habilitadas**, sem intermediar juridicamente a energia e sem gerenciar liquidação.

**NO-GO** quando nenhuma estratégia apresentar comprador identificável, dados acessíveis ou rota legal e econômica plausível. Nesse caso, **não inventar um produto** para cumprir a tarefa; entregar plano enxuto de descoberta de clientes e protótipo de demonstração apenas se claramente rotulado como tal.

Registrar decisão, alternativas rejeitadas, hipóteses críticas, limitações e experimentos de validação em `docs/06-DECISAO-GO-NOGO.md`. Não ocultar riscos, mesmo que contradigam a ideia original.

### 3.4 Estratégia comercial inicial

Se houver GO ou GO CONDICIONAL:

- Definir **beachhead market**: um perfil de indústria e um perfil de comercializadora/agregadora, selecionados com evidências.
- Definir uma única proposta de valor mensurável, por exemplo: reduzir o tempo de qualificação de uma oportunidade de X horas para Y, com dados autorizados e relatório auditável. X e Y devem ser mensurados ou rotulados como metas.
- Descrever o processo comercial de 1º a 10º cliente, responsável por prospecção, onboarding, integração, suporte e pagamento.
- Recomendar testes de disposição a pagar e proposta comercial-piloto, sem afirmar fechamento inexistente.
- Decidir quem paga primeiro. Preferir SaaS B2B com preço e escopo claros se o modelo de comissão por receita de RD introduzir risco excessivo.

Entregável: `docs/07-GTM-E-PRECIFICACAO.md`.

## 4. Etapa C — Especificar o produto mínimo da estratégia vencedora

**Somente depois da decisão de viabilidade.** Este capítulo descreve a implementação de referência para H2/H3, mas **adapte o domínio** caso outra estratégia vença. Não construa módulos de hipóteses rejeitadas.

### 4.1 Proposta funcional de referência

Uma plataforma web B2B em que:

1. Uma **empresa/indústria** cria uma organização, autentica usuários, cadastra unidades consumidoras e autoriza o uso de dados.
2. Informa um intervalo temporal e uma **oportunidade de flexibilidade**: potência redutível estimada (kW), duração, antecedência, janelas disponíveis, restrições e evidências de medição. É uma **proposta de disponibilidade sujeita a validação**, não uma ordem de venda de energia.
3. Um operador autorizado da plataforma qualifica a oportunidade: dados válidos, elegibilidade a confirmar, unidade, granularidade, prazo, documentação e nível de confiança. A qualificação operacional **não substitui habilitação perante CCEE/ONS**.
4. Uma **comercializadora/agregadora aprovada** visualiza somente oportunidades autorizadas para seu perfil, usa filtros e API e envia manifestação de interesse/RFQ.
5. A indústria revisa e aceita/rejeita a proposta comercial. O sistema registra interesse e gera um resumo negociável; contrato formal, representação e oferta oficial continuam **fora da plataforma** até existir autorização jurídica e técnica.
6. O sistema audita consentimentos, alterações, consultas relevantes, mensagens e decisões.

**Se H1 vencer**, substituir entidades e nomenclatura por solicitações de cotação de fornecimento ACL com os termos contratuais corretos, sem representar o produto como bolsa, sem “match” vinculante e sem replicar a negociação formal de agentes. **Se H3 vencer**, oferecer primeiro API privada e painel de pré-qualificação, sem marketplace multilateral exposto.

### 4.2 Funcionalidades obrigatórias do MVP

**Portal da empresa (responsivo):**

- Cadastro/login, criação de organização, convite de usuário e papéis mínimos.
- Cadastro de unidade industrial e upload CSV de curva de consumo fictícia ou autorizada; assistente de validação com amostra/template.
- Cadastro, edição, pausa e exclusão lógica de oportunidades/ofertas; status `draft`, `pending_review`, `qualified`, `published`, `matched`, `closed`, `cancelled` (simplificar se o modelo exigir menos).
- Lista, detalhe, filtros de status e histórico das próprias ofertas.
- Gestão do consentimento e revogação; informação clara de quais dados são visíveis às contrapartes.

**Portal da comercializadora/agregadora:**

- Aprovação por administrador antes de acessar dados não públicos.
- Listagem filtrada das ofertas compartilhadas, apenas com dados autorizados, filtros por região/submercado quando relevante, janela, duração, MW/kW, status e nível de confiança.
- Visualização de detalhes autorizados e registro de interesse/RFQ. Ocultar identificação sensível da indústria quando a política exigir anonimização.
- Área para gerar, revogar e rotacionar credenciais API com escopos mínimos.

**Operação/admin:**

- Aprovar organizações e revisar ofertas.
- Marcar pendências de elegibilidade e qualidade de dados sem declarar habilitação regulatória não comprovada.
- Consultar auditoria, revogar publicação e lidar com solicitação de exclusão/retificação de dados.

**Não fazer no MVP:** pagamentos, corretagem/negociação financeira automatizada, carteira de trading, integração real com CCEE/ONS/BBCE sem contrato, despacho remoto de máquinas, inteligência artificial generativa para tomar decisões de compra, blockchain, aplicativos mobile nativos, previsão complexa ou faturamento com regras regulatórias não validadas.

### 4.3 Algoritmo de matching — transparente, não mágico

Implementar um **match explicável e determinístico**. Regras configuráveis por tipo de oferta escolhido na pesquisa:

- Elegibilidade e consentimento válidos.
- Janela de oferta e janela de interesse com sobreposição temporal.
- Potência e duração compatíveis **na mesma unidade de medida**.
- Localização/submercado, produto, restrições contratuais, requisitos de comprovação e estado da oferta quando aplicáveis.
- Unicidade: evitar dupla alocação da mesma capacidade no mesmo intervalo.
- Diferenciar disponibilidade **declarada** de **comprovada**. Sinalizar qualidade insuficiente em vez de fabricar previsão.
- Score simples opcional, explicado por atributos verificáveis; armazenar razões do match, versão da regra e dados utilizados.
- Primeiro MVP: recomendação e RFQ, **não execução automática vinculante**.

Criar testes para ofertas incompatíveis, sobreposição parcial, mudança de fuso, capacidade indisponível, cancelamento, dados ausentes e tentativa de acesso de outra organização.

### 4.4 Modelo de dados de referência

Adaptar ao domínio efetivamente selecionado. Entidades possíveis:

- `organizations` (tipo, nome, documento validado quando necessário, status de aprovação)
- `users`, `memberships`, `roles`, `invitations`
- `sites` (unidades consumidoras, características mínimas; evitar armazenamento desnecessário de dados sensíveis)
- `data_sources`, `imports`, `meter_readings` (timestamp com timezone explícito, potência/energia, unidade, qualidade, proveniência)
- `consents` (titular, finalidade, dados abrangidos, destinatários, início, vencimento, revogação e prova)
- `opportunities` (produto, potência, duração, janela, estado, evidências, restrições)
- `interest_requests` / `rfqs` / `proposals` / `matches` (estado e condições propostas)
- `api_clients`, `api_key_hashes`, `audit_events`, `outbox_events` se necessário

Dados pessoais e empresariais confidenciais exigem retenção mínima, segregação por tenant e exclusão controlada. **Não compartilhar a curva de consumo integral com toda comercializadora por padrão.**

### 4.5 API B2B — contrato antes da implementação

Projetar REST versionada ` /api/v1 ` com **OpenAPI 3.1**, exemplo de cliente TypeScript, paginação por cursor ou padrão simples consistente, filtros estáveis, respostas de erro documentadas, idempotência em operações críticas, limite de taxa e trilha de auditoria.

Conjunto ilustrativo de endpoints (reduzir/adaptar conforme escopo vencedor):

```http
POST   /api/v1/auth/login
GET    /api/v1/me
POST   /api/v1/sites
GET    /api/v1/sites
POST   /api/v1/imports/csv
POST   /api/v1/opportunities
GET    /api/v1/opportunities
GET    /api/v1/opportunities/{id}
PATCH  /api/v1/opportunities/{id}
POST   /api/v1/opportunities/{id}/publish
POST   /api/v1/opportunities/{id}/interests
GET    /api/v1/interests
POST   /api/v1/api-keys
DELETE /api/v1/api-keys/{id}
GET    /api/v1/matches
GET    /health
```

Não misturar autenticação de usuários do portal com autenticação máquina-a-máquina. Para esta, considerar chaves com prefixo identificador, segredo exibido uma única vez, **hash no banco**, expiração, escopos (`opportunities:read`, `interests:write`), revogação e quotas. Avaliar OAuth2 client credentials se clientes exigirem; não implementá-lo sem necessidade. Nunca expor credenciais da CCEE ou de outros fornecedores no frontend.

Criar exemplos de payload com unidades explícitas (`power_kw`, `duration_minutes`, timestamps ISO 8601), validação estrita, paginação, contrato OpenAPI e coleção HTTP mínima. Tratar status HTTP, `401`, `403`, `404`, `409`, `422`, `429` e `5xx` adequadamente.

## 5. Etapa D — Arquitetura e implementação

### 5.1 Escolha de tecnologia (justificada)

**Padrão sugerido: monólito modular TypeScript**, por reduzir carga operacional para dois desenvolvedores:

- Frontend **Next.js ou React + Vite**, TypeScript com `strict`, interface responsiva, acessível, boas mensagens de erro e estados de carregamento. Escolher uma única abordagem e documentar por quê.
- Backend TypeScript: rotas server-side do framework escolhido **ou** API Fastify/NestJS apenas se a integração B2B e o isolamento justificarem. Priorizar simplicidade e documentação.
- PostgreSQL, migrations e camada de acesso tipada (Prisma, Drizzle ou equivalente, escolhendo **uma**).
- Validação de schemas (por exemplo Zod), autenticação segura de sessão, RBAC com aplicação de autorização **em cada consulta**, logs estruturados e rate limiting.
- Docker Compose para desenvolvimento com PostgreSQL; `.env.example` sem segredos; seed de organizações e dados **sintéticos**.
- Testes unitários, integração de API e um teste E2E de jornada completa; CI simples.

**Rust + WebAssembly é opcional e condicionado:** só utilizar caso benchmarks demonstrem necessidade em matching intensivo, simulação estatística ou processamento local de dados, e o ganho justifique build, manutenção e deploy. Um matching SQL/TypeScript simples deve ser a implementação inicial. Não usar WebAssembly como substituto de segurança do backend.

**Arquitetura alvo do MVP:** navegador → app/API autenticada → serviços de domínio → PostgreSQL; importador CSV → validação → armazenamento de metadados/dados autorizados; cliente API B2B → endpoints limitados por escopo. Sem filas, Kubernetes, brokers ou múltiplos serviços até aparecer demanda objetiva.

### 5.2 Segurança e conformidade desde o primeiro commit

- LGPD: finalidade, base legal avaliada por especialista, minimização, transparência, gestão de consentimento quando essa for a base adequada, revogação, política de retenção, exercício de direitos e contratos com operadores/suboperadores. **Não assumir que consentimento é a única base legal aplicável.**
- Autorização multi-tenant: testes que comprovem que A não acessa registros de B mesmo manipulando IDs ou filtros. Aplicar filtros no servidor e considerar RLS no PostgreSQL se simplificar o modelo de risco.
- Credenciais: senha com algoritmo moderno por biblioteca madura; cookies seguros/HttpOnly/SameSite, proteção CSRF quando relevante, TLS em produção, rate limiting, validação de upload, limites de tamanho, proteção contra injeção, CORS restrito.
- Auditoria de criação, edição, publicação, visualização sensível, acesso via API, proposta e revogação.
- Segredos via variáveis de ambiente/gestor de secrets; não registrar tokens ou medições empresariais integrais em logs.
- Backup/restauração testáveis, migrações reversíveis quando viáveis, health check, erros observáveis e plano básico de incidente.
- Revisão de termos de uso e contratos **antes de usar dados reais ou anunciar capacidade regulatória**; não redigir parecer jurídico como se fosse aprovação definitiva.

### 5.3 UX mínima, responsiva e realmente utilizável

- Telas: entrar/cadastrar, dashboard por papel, empresas/unidades, importar CSV, criar oportunidade, lista/detalhe, propostas/interesses, API keys e documentação API, área administrativa.
- Mobile-first, mas priorizar fluxos intensivos em dados no desktop; tabelas adaptadas ao celular, sem scroll horizontal invisível, botões com área de toque adequada, contraste e navegação por teclado.
- Idioma pt-BR, moeda BRL, fuso de operação explícito, datas consistentes. No banco, salvar timestamps UTC e converter corretamente para apresentação.
- Estados vazios, erros de upload, carregamento, confirmação em ações destrutivas e mensagens que distinguem “interesse” de “contrato fechado”.
- Não gastar tempo criando identidade visual avançada antes de validar a principal jornada.

### 5.4 Plano de desenvolvimento em fatias verticais

Implementar e validar nesta sequência (adaptar após a decisão de mercado):

1. **Bootstrap:** inspeção de repositório; estrutura, scripts, `.env.example`, lint, format, typecheck, Docker e migrations.
2. **Identidade B2B:** login, organizações, papéis e isolamento entre tenants, com testes.
3. **Dados de empresa:** cadastro de unidade e importação CSV sintética, qualidade e proveniência.
4. **Oferta qualificada:** CRUD, estados, revisão, visibilidade/consentimento e auditoria.
5. **Consulta e match:** filtros server-side, correspondência explicável e RFQ/manifestação de interesse.
6. **API de comercializadora:** autenticação machine-to-machine, OpenAPI, rate limiting, exemplos e testes de autorização.
7. **Polimento do MVP:** UX responsiva, testes E2E, seed, documentação, implantação demonstrável e checklist de segurança.

Ao final de **cada fatia**, executar testes, registrar arquivos alterados, falhas e correções. Não prosseguir acumulando erros. Se existir repositório, preservar decisões e estilo existentes quando forem compatíveis; não apagar código sem justificativa.

## 6. Critérios objetivos de aceitação

O MVP só está pronto quando:

- Uma empresa consegue se registrar e criar uma unidade e uma oportunidade com dados sintéticos ou legalmente autorizados.
- Uma comercializadora previamente aprovada consegue consultar **via web e API** somente oportunidades liberadas para ela.
- A comercializadora consegue manifestar interesse/RFQ; a indústria consegue visualizar o interesse; ambos veem o status correto.
- A plataforma impede acesso entre organizações e duplicação/uso simultâneo de capacidade, segundo as regras definidas.
- Um usuário consegue revogar uma publicação/consentimento, impedindo **novas divulgações**, e a política de retenção e dados já compartilhados fica explicitada. Não prometer revogação retroativa de dados já recebidos por terceiros.
- A importação rejeita arquivo malformado, unidades inconsistentes, timestamps inválidos e dados acima do limite.
- O algoritmo oferece justificativa legível para match e no-match; não usa dados inventados.
- Existe OpenAPI navegável, testes de contrato, exemplo funcional de requisição com token e retorno correto de `401/403/429`.
- A interface é responsiva e utilizável em largura móvel e desktop; os principais formulários são acessíveis por teclado.
- `lint`, `typecheck`, testes e build passam; execução local reproduzível a partir do README.
- `docker compose up` (ou equivalente documentado) inicia dependências, aplica migrações e permite executar um fluxo completo com seeds sintéticos.
- Nenhuma tela indica que o sistema registra contratos na CCEE, negocia com a ANEEL, representa formalmente consumidores ou executa RD real se essas integrações/autorizações não existem.

## 7. Métricas para decidir se deve continuar após o MVP

Definir valores-alvo com justificativa **antes** de iniciar testes de venda. Medir, no mínimo:

- Quantas empresas respondem a entrevistas e quantas aceitam fornecer dados autorizados.
- Número de oportunidades qualificadas versus cadastradas, MW efetivamente comprovados quando aplicável, confiabilidade e custo por oportunidade.
- Quantas comercializadoras/agregadoras aceitam usar a API ou testar um piloto; frequência de consulta e proporção de RFQs úteis.
- Tempo de onboarding, tempo de qualificação, custo de integração e tempo até primeira proposta.
- Conversão para teste pago/contrato pago, ticket, margem de contribuição, CAC e ciclo de venda.
- Incidentes de privacidade, falhas de autorização e erros de dados.

Se não houver comprador interessado ou dados utilizáveis, não acelerar o desenvolvimento: voltar à decisão de negócio e pivotar.

## 8. Entregáveis obrigatórios e organização do repositório

```text
PLANO.md                           # este documento; atualizar decisões e status
README.md                          # como rodar e o que o produto faz/não faz
docs/
  01-MERCADO.md
  02-CLIENTES-E-PROBLEMAS.md
  03-CONCORRENCIA.md
  04-DADOS-E-INTEGRACOES.md
  05-ECONOMIA-E-MODELOS.md
  06-DECISAO-GO-NOGO.md
  07-GTM-E-PRECIFICACAO.md
  08-PRD-MVP.md
  09-ARQUITETURA-E-SEGURANCA.md
  10-VALIDACAO-E-RESULTADOS.md
  REFERENCIAS.md
  ADR/                             # decisões arquiteturais concisas
openapi/
  openapi.yaml                      # somente após a escolha do produto
src/                                # ou apps/; escolha consistente
scripts/
tests/
.env.example
compose.yaml                        # ou docker-compose.yml
```

O código e os diretórios técnicos surgem **apenas após** a conclusão da pesquisa e do gate. Se a estratégia vencedora não precisar de marketplace público, não criar essas telas e entidades apenas porque constam no exemplo.

## 9. Formato obrigatório de atualização ao longo da execução

Ao encerrar cada etapa, produzir um resumo curto contendo:

1. **O que foi confirmado:** fontes e datas; separar citação de interpretação.
2. **O que não sabemos:** hipóteses, dados faltantes e impacto.
3. **Decisão:** seguir, investigar, pivotar ou parar — com argumentos e alternativas.
4. **Arquivos criados/alterados** e testes executados, com resultados reais.
5. **Próximo passo** e impedimentos que dependam dos fundadores.

**Nunca informar “teste passou”, “API funciona”, “parceria confirmada” ou “mercado validado” sem evidência concreta.**

## 10. Ordem de execução para o agente

1. Identificar o ambiente disponível (internet, repositório, execução de código). Não inventar acesso indisponível.
2. Realizar pesquisa de mercado e regulação da **Etapa A**; preencher fontes e lacunas.
3. Comparar H1–H4 e variantes; produzir números, riscos e recomendação da **Etapa B**.
4. **Parar no gate de negócio e registrar claramente a decisão GO / GO CONDICIONAL / PIVOT / NO-GO.** Se não houver evidência comercial suficiente, solicitar aos fundadores somente as validações externas impossíveis de executar; pode preparar protótipo demonstrável sob GO CONDICIONAL, sem alegar negócio validado.
5. Redigir PRD e arquitetura para **uma única estratégia selecionada**. Não transformar as quatro hipóteses em módulos de um sistema gigante.
6. Implementar o MVP por fatias, fazendo a aplicação funcionar de ponta a ponta em ambiente local.
7. Testar segurança, autorização, API, regras de domínio, responsividade e deploy demonstrável.
8. Entregar relatório final com custo estimado de operação, riscos, limitações, pendências jurídicas/comerciais, métricas de validação e plano dos próximos 90 dias.

---

## Nota final para a IA executora

O objetivo não é provar que o fundador está certo sobre o marketplace. O objetivo é **encontrar um negócio real e sustentável no mercado brasileiro de energia e construir a menor ferramenta capaz de demonstrar seu valor**.

Se as comercializadoras não precisarem de um marketplace porque já negociam via BBCE, relações bilaterais ou sistemas internos, diga isso com evidências e mude o desenho. Se o mecanismo de RD for juridicamente ou operacionalmente difícil demais para a startup, ofereça um produto de tecnologia e dados vendido a operadores habilitados. Se nenhuma alternativa for suficientemente viável, **não disfarce a ausência de mercado com uma aplicação tecnicamente sofisticada**.
