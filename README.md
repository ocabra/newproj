# Radar de Fornecedores (protótipo)

> **Status: GO CONDICIONAL.** É um protótipo reversível, com **dados sintéticos**, construído depois da pesquisa de viabilidade de [`PLANO.md`](PLANO.md). **O negócio não está validado**: faltam entrevistas, preço e parecer jurídico (ver [`docs/06-DECISAO-GO-NOGO.md`](docs/06-DECISAO-GO-NOGO.md)).

## O que aconteceu com a ideia original

A ideia inicial era um marketplace para empresas cadastrarem ofertas e comercializadoras responderem via API. A pesquisa ([`docs/01`](docs/01-MERCADO.md)–[`05`](docs/05-ECONOMIA-E-MODELOS.md)) mostrou que ele **não se sustenta** no estágio atual:

- **Atacado do ACL:** a negociação já está na BBCE e na N5X, que só aceitam agentes autorizados.
- **Varejo:** o lead já é disputado por grandes grupos, e a CCEE lança um comparador oficial e gratuito até 11/2027.
- **Resposta da Demanda:** são 344 MW contratados no país em 2026, o produto está em sandbox até 31/12/2026 e só agentes da CCEE podem agregar.

A decisão foi **pivotar** para **H5-G**, um radar de risco de fornecedores para **gestoras de energia**. A decisão, as alternativas rejeitadas e os experimentos de validação (E1–E5) estão em [`docs/06`](docs/06-DECISAO-GO-NOGO.md). Toda escolha feita durante a execução está em [`docs/DECISOES.md`](docs/DECISOES.md).

## O que o protótipo faz

- **Gestora ou consumidor:**
  - cadastra a carteira de clientes, unidades e contratos com fornecedores, à mão, por CSV ou pela API;
  - recebe **alertas** quando um fornecedor aparece num **evento público curado com fonte**: pedido de RJ, desligamento da CCEE, operação balanceada, lista de inadimplentes etc.;
  - vê a **exposição estimada**: `volume_mwm × horas_restantes × max(0, preço_referência − preço_contrato)`, com a fonte do preço;
  - recebe a **explicação** de por que um contrato tem ou não tem alerta.
- **Operação/curadoria:** aprova organizações, registra, publica e retira eventos (sempre com URL da fonte), cadastra preços de referência com fonte e importa séries do Fator de Alavancagem. Uma piora de faixa vira **rascunho** para revisão.
- **Fornecedor:** vê os eventos publicados sobre si e registra **resposta** (direito de resposta). Nunca vê quais carteiras o contêm.
- **API B2B** `/api/v1`: chave com escopos, OpenAPI 3.1 em [`openapi/openapi.yaml`](openapi/openapi.yaml) e na página `/api/docs`, idempotência e limite de taxa.
- **Experimento E1:** `npm run backtest` mede se o FA público teria antecipado os eventos de crédito.

## O que o protótipo NÃO faz

- **Não** é nota ou score de crédito e **não** prevê falência.
- **Não** tem integração nem relação oficial com CCEE, ANEEL, ONS, BBCE ou Abraceel.
- **Não** coleta dados automaticamente: eventos e FA entram por curadoria ou CSV, porque a CCEE bloqueia acesso automatizado (ADR-0006).
- **Não** negocia energia, não representa consumidores e não faz RFQ nem Resposta da Demanda.
- **Não** deve receber dados reais antes do parecer jurídico (E3) e da adoção de RLS (ADR-0004).

## Como rodar localmente

Requisitos: Node ≥ 22 (testado com 24), npm, Podman ou Docker com compose, Python 3 (só para o modelo econômico).

```bash
cp .env.example .env          # ajuste SEED_PASSWORD (≥ 10 caracteres)
npm ci
podman compose up -d          # ou: docker compose up -d   → PostgreSQL 16 na porta 55432
npm run setup                 # aplica migrações e carrega dados sintéticos
npm run dev                   # API em :3000 e portal em http://localhost:5173
```

Usuários do seed (senha = `SEED_PASSWORD`):

| E-mail | Papel |
|---|---|
| `gestora@radar.invalid` | Gestora (titular): carteira com alertas |
| `consumidor@radar.invalid` | Consumidor agente |
| `fornecedor@radar.invalid` | Fornecedor "Alfa", com direito de resposta |
| `curadoria@radar.invalid` | Operação: curadoria de eventos |
| `admin@radar.invalid` | Operação: aprovação de organizações e auditoria |
| `pendente@radar.invalid` | Gestora aguardando aprovação |

Os nomes e CNPJs são **fictícios**. Os CNPJs têm dígito verificador válido e podem coincidir por acaso com empresas reais, sem relação com elas.

### Exemplo de uso da API

1. Entre como `gestora@radar.invalid`, vá em **Chaves de API**, crie uma chave com `alerts:read` e copie o segredo. Ele aparece uma única vez.
2. Rode:

```bash
curl -s -H "Authorization: Bearer rdf_XXXXXXXX_YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY" \
  "http://localhost:3000/api/v1/alerts?status=open&limit=10"
# sem chave → 401 · escopo errado → 403 · acima de 120/min → 429 (Retry-After)
```

## Verificação

```bash
npm run lint        # ESLint + Prettier
npm run typecheck   # servidor e front
npm test            # unidade + integração (PostgreSQL real; recria o banco de teste)
npm run build       # front (Vite) + servidor (tsc)
npm run test:e2e    # Playwright: jornada completa no navegador (ver e2e/)
```

Resultados reais da última execução: [`docs/10-VALIDACAO-E-RESULTADOS.md`](docs/10-VALIDACAO-E-RESULTADOS.md).

## Outros comandos

| Comando | Para quê |
|---|---|
| `npm run openapi` | Regenera `openapi/openapi.yaml` a partir dos schemas Zod. Um teste falha se o arquivo estiver desatualizado |
| `npm run economia` | Recalcula `docs/05` a partir de `scripts/economia.py` |
| `npm run backtest -- --fa fa.csv --eventos eventos.csv --saida resultado.md` | Experimento E1. Sem argumentos, usa amostras sintéticas |
| `npm run purge [-- --dry-run]` | Retenção: remove carteira excluída há > 90 dias e sessões antigas |
| `npm run revoke-all -- --confirmo` | Incidente: revoga todas as sessões e chaves |
| `scripts/backup-restore-test.sh` | Faz dump, restaura num banco temporário e confere as contagens |
| `podman build -t radar -f Containerfile .` | Imagem única. Em runtime precisa de `DATABASE_URL` e aplica as migrações ao subir |

## Direitos do titular e exclusão (procedimento manual no MVP)

O pedido chega por e-mail à operação. O admin localiza o usuário e a organização na auditoria e então:
- **exportação:** consulta SQL das tabelas da organização;
- **exclusão:** exclusão lógica da carteira pela própria gestora, seguida de `npm run purge`, ou remoção do usuário via SQL, registrando o atendimento.

Esse procedimento precisa ser revisado com advogado (E3) antes do uso com dados reais.

## Estrutura

```text
PLANO.md                 plano mestre (pesquisa → decisão → MVP)
docs/                    01–10, DECISOES.md, REFERENCIAS.md, ADR/, anexos/
openapi/openapi.yaml     contrato da API B2B (gerado)
src/server/              Fastify: domain/ (regras puras), services/, http/ (app e v1), db/
src/web/                 SPA React (pt-BR)
drizzle/                 migrações SQL
scripts/                 seed, economia.py, backtest, openapi, operação
tests/                   unidade e integração (Vitest)   ·   e2e/  Playwright
```
