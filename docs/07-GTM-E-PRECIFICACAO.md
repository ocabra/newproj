# 07 — Estratégia comercial inicial e precificação (H5-G)

> **Status:** 27/11/2026, sob **GO CONDICIONAL** (`06`). Tudo aqui é plano de teste, não resultado. Nenhum cliente, piloto ou carta de intenção existe.

## 1. Beachhead

| Perfil | Definição | Por que este primeiro | Evidência |
|---|---|---|---|
| **Comprador principal: gestora de energia independente** | Consultoria/gestora sem comercializadora própria, com 20 a 200 unidades consumidoras de clientes no ACL, Sudeste (SP primeiro, pela densidade de consumidores livres) | (1) Um contrato cobre muitos consumidores; (2) a diligência de fornecedor já é responsabilidade dela perante o cliente; (3) não é atendida pela Central de Risco Abraceel; (4) é o primeiro comprador plausível comum a H3, H4 e H5 | Papel das gestoras: CLI §3.4 (`CONFIRMADO` como modelo; tamanho `NÃO VERIFICADO`); Abraceel/Risk3 para associadas: H5-R28 (`CONFIRMADO`); necessidade de diligência: `HIPÓTESE` (E2) |
| **Segundo perfil: consumidor agente grande** | Indústria com contratos bilaterais próprios, ≥ 1 MWm, compras/CFO responsável pela energia | Exposição de recontratação alta. Caso típico: 2 MWm × 18 meses restantes × R$ 100/MWh de diferença ≈ R$ 2,6 mi (ver §3) | Mecânica: ACL Parte A e H5 §1 (`CONFIRMADO`); valores do exemplo: `HIPÓTESE` |
| **Não priorizado** | Comercializadoras | Já atendidas pela Abraceel/Risk3 | H5-R28..R30 |
| **Não priorizado** | Bancos/seguradoras (fiança, seguro garantia) | Ciclo longo; exigiria histórico e modelo próprio | H5 §4 (`INFERÊNCIA`) |

## 2. Proposta de valor única e mensurável

> **"Saber, em até 1 dia útil após a publicação, quando o fornecedor de qualquer contrato da sua carteira aparece em um evento público de crédito, com a fonte, o contrato afetado e a exposição estimada em R$."**

- **Métrica X → Y:** hoje a gestora checa manualmente atas, listas e FA da CCEE e notícias, com X horas por semana e uma defasagem de D dias até perceber o evento. A meta é ≤ 15 min/semana de revisão de alertas e defasagem ≤ 1 dia útil após o registro do evento na curadoria.
  - **X e D são desconhecidos** e serão medidos em E2 (pergunta 3 do roteiro de gestoras em `02` §5.4).
  - Os valores 15 min e 1 dia útil são **metas**, não medições.
- **Não promete:**
  - prever falência;
  - dar nota de crédito;
  - substituir a diligência jurídica;
  - garantir completude dos eventos. A curadoria é manual, porque a CCEE bloqueia coleta automatizada.

## 3. Cálculo de exposição exibido ao cliente (transparente)

Para cada contrato ativo de um fornecedor com evento:

```
horas_restantes      = horas entre max(data_referência, início) e fim do contrato
energia_restante_MWh = volume_MWm × horas_restantes
custo_reposição_R$   = energia_restante_MWh × max(0, preço_referência_R$/MWh − preço_contrato_R$/MWh)
cobertura_garantia_% = min(100, garantia_R$ / custo_reposição_R$ × 100)   (se custo_reposição > 0)
```

- O `preço_referência` é informado pela curadoria **com fonte e data**, por exemplo uma curva forward pública ou um PLD médio recente. Quando não há referência válida, o sistema mostra "exposição não calculada: sem preço de referência" e não estima nada.
- **Exemplo (HIPÓTESE, ilustrativo):** 2 MWm, 18 meses restantes (≈ 13.140 h), contrato a R$ 180/MWh, referência a R$ 280/MWh.
  - Energia restante: 26.280 MWh.
  - Custo de reposição: 26.280 MWh × R$ 100/MWh = **R$ 2.628.000**.
  - Garantia de R$ 600 mil: cobertura de **22,8%**.

## 4. Precificação para teste (HIPÓTESE; validar em E2)

| Plano | Para quem | Preço/mês | Inclui |
|---|---|---:|---|
| Piloto | Gestoras em E2 | R$ 0 por 60 dias, condicionado a uma entrevista de saída e a uma proposta de preço | Até 50 contratos, alertas por e-mail/portal, API somente leitura |
| Gestora S | ≤ 50 contratos monitorados | R$ 490 | Portal, alertas, exposição, exportação CSV |
| Gestora M | ≤ 200 contratos | R$ 990 | + API B2B, múltiplos usuários |
| Gestora L | > 200 contratos | R$ 1.990 | + SLA de curadoria, integração assistida |
| Consumidor agente | 1 grupo econômico | R$ 290 | Portal e alertas da própria carteira |

- **Por que assinatura e não sucesso:** não há "evento de sucesso" lícito para cobrar. Cobrar por perda evitada exigiria medir contrafactual e criaria conflito de interesse com o conteúdo curado.
- **Ancoragem:**
  - O plano Consumidor fica perto da faixa do birô (R$ 120–270), porque o consumidor compara com ele.
  - Os planos de gestora se apoiam no ganho por cliente atendido: R$ 990 para 200 contratos dá **R$ 4,95 por contrato/mês**.
  - Os planos de gestora estão acima do preço médio do cenário base de `05` (R$ 600/mês). Se E2 confirmar esses preços, o cenário base de `05` fica conservador.
- **Teste de disposição a pagar em E2 (Van Westendorp simplificado):** perguntar as quatro faixas de preço (barato demais, barato, caro, caro demais) **depois** de mapear o processo atual, nunca antes.

## 5. Processo comercial do 1º ao 10º cliente

| Etapa | Responsável | Como | Meta (HIPÓTESE) |
|---|---|---|---|
| Lista de alvos | Fundador A | Gestoras listadas em associações setoriais, eventos, LinkedIn (cargos de `02` §6); **sem compra de listas, sem disparo em massa** (PLANO §1.8) | 40 gestoras qualificadas |
| Primeiro contato | Fundador A | Mensagem individual pedindo 30 min sobre "como vocês acompanham a saúde dos fornecedores dos seus clientes", sem pitch | 15 conversas |
| Entrevista (E2) | Fundadores A e B | Roteiro `02` §5.4; um conduz, outro anota | 10 entrevistas registradas |
| Demonstração | Fundador B | Protótipo com dados **sintéticos**, nunca com dados do próprio entrevistado antes do contrato e do parecer | 6 demos |
| Piloto | Fundador B | Termo de piloto (minuta revisada pelo advogado em E3); a gestora carrega a própria carteira sob seu mandato | 3 pilotos |
| Conversão | Fundador A | Proposta com preço da tabela §4; pagamento por boleto/PIX mensal | 2 pagantes até o mês 6 |
| Onboarding | Fundador B | Importação CSV assistida (≤ 2 h), validação dos CNPJs de fornecedores | ≤ 2 h por cliente |
| Suporte | Ambos | E-mail com resposta em 1 dia útil; registro de todo pedido | — |
| Curadoria de eventos | Fundador B + especialista setorial | Revisão diária de atas, listas e FA da CCEE e de notícias; cada evento com fonte e dupla checagem | Evento publicado ≤ 1 dia útil |

## 6. Quem paga primeiro

**A gestora.** Ela concentra a carteira, já tem o dever de diligência e não está coberta pelo substituto setorial. O consumidor agente direto entra depois, por indicação das gestoras ou por conteúdo. Comissão sobre receita de RD e modelos de sucesso foram descartados (`06` §4).

## 7. Métricas para continuar após o MVP (PLANO §7; metas definidas antes dos testes)

| Métrica | Meta para continuar (6 meses) | Justificativa |
|---|---|---|
| Gestoras que aceitam entrevista / contatadas | ≥ 25% | Abaixo disso, o canal direto não escala para 2 fundadores |
| Gestoras que carregam carteira real em piloto (após E3) | ≥ 3 | Prova de confiança e de acesso lícito a dados de contrato |
| Contas pagantes | ≥ 2 no mês 6; ≥ 10 no mês 12 | O break-even de `05` exige ~34 contas no preço base |
| Preço médio aceito | ≥ R$ 500/mês | HC3 |
| Eventos publicados com fonte e sem retificação | ≥ 98% | Risco jurídico e reputacional |
| Defasagem mediana evento→alerta | ≤ 1 dia útil | Proposta de valor |
| Tempo de onboarding | ≤ 2 h | Custo de atendimento |
| Incidentes de autorização/vazamento entre carteiras | 0 | Inegociável |
| CAC observado | ≤ R$ 3.000 | Premissa de `05` |
