#!/usr/bin/env python3
"""Modelo econômico reproduzível das hipóteses H1–H5 (PLANO.md §3.2).

Uso:  python3 scripts/economia.py              # imprime as tabelas em Markdown
      python3 scripts/economia.py --atualizar  # reescreve o bloco gerado em docs/05-ECONOMIA-E-MODELOS.md

Somente biblioteca padrão. Todas as entradas estão neste arquivo, cada uma com
rótulo de evidência. Preços e volumes sem fonte são HIPÓTESE e precisam de
validação comercial (ver docs/06 e docs/07). Valores em R$ nominais, mês a mês,
horizonte de 24 meses, sem inflação nem desconto.

Fórmulas (por hipótese h, cenário s, mês m = 1..24):
  clientes(m)      = 0 se m < inicio; senão alvo24 * (m - inicio + 1) / (24 - inicio + 1)   [rampa linear]
  churned(m)       = clientes(m-1) * churn_mensal
  novos_brutos(m)  = max(0, clientes(m) - clientes(m-1)) + churned(m)
  receita(m)       = clientes(m) * preco_mensal                          (modelo recorrente)
                   = unidades(m) * preco_unitario                        (modelo transacional; unidades = clientes)
  custo_var(m)     = receita(m) * (imposto + taxa_pagamento) + clientes(m) * custo_var_cliente
  custo_aquis(m)   = novos_brutos(m) * CAC
  custo_fixo(m)    = soma dos custos fixos comuns + específicos de h
  caixa(m)         = caixa(m-1) + receita - custo_var - custo_aquis - custo_fixo - custo_unico(m)
  margem_contrib   = preco * (1 - imposto - taxa) - custo_var_cliente
  payback_meses    = CAC / margem_contrib
  LTV              = margem_contrib / churn_mensal
"""
from __future__ import annotations

from dataclasses import dataclass, field

MESES = 24

# ---------------------------------------------------------------- custos comuns
# Todos HIPÓTESE (orçamentos públicos típicos não verificados; ajustar com cotações reais).
IMPOSTO = 0.11          # HIPÓTESE: Simples Nacional, faixa inicial, serviços de software (validar com contador)
TAXA_PAGAMENTO = 0.01   # HIPÓTESE: boleto/PIX/gateway

CUSTOS_FIXOS_MENSAIS = {  # R$/mês
    "infraestrutura (nuvem, domínio, e-mail, monitoramento, backups)": 1_500,
    "contabilidade": 1_000,
    "jurídico recorrente (termos, contratos, LGPD)": 2_500,
    "especialista setorial (consultor sênior meio período)": 6_000,
    "comercial (viagens, eventos setoriais, CRM)": 3_000,
}
PRO_LABORE_MENSAL = 2 * 8_000  # HIPÓTESE: mínimo para os 2 fundadores; mostrado à parte

CUSTOS_UNICOS = {  # (mês, R$)
    "abertura da empresa e certificados digitais": (1, 3_000),
    "parecer jurídico regulatório + LGPD + termos de uso": (2, 30_000),
    "infraestrutura inicial (ambientes, ferramentas, segurança)": (1, 8_000),
}
ORCAMENTO_INFRA = 60_000  # dado pelos fundadores (PLANO §0)


@dataclass
class Cenario:
    preco: float          # R$/mês por cliente (recorrente) ou R$/unidade (transacional)
    alvo24: float         # clientes (ou unidades/mês) no mês 24
    inicio: int           # mês da primeira receita (ciclo de venda + construção)
    cac: float            # R$ por cliente/unidade bruta adquirida
    churn: float          # fração mensal
    custo_var_cliente: float = 0.0  # R$/mês por cliente (suporte, dados)


@dataclass
class Hipotese:
    codigo: str
    nome: str
    quem_paga: str
    evento: str
    sam_clientes: int
    sam_fonte: str
    evidencia_preco: str
    custos_fixos_extra: dict = field(default_factory=dict)
    custos_unicos_extra: dict = field(default_factory=dict)
    cenarios: dict = field(default_factory=dict)


HIPOTESES = [
    Hipotese(
        "H1", "Marketplace/RFQ de energia no ACL",
        "comercializadora/varejista", "comissão por contrato fechado",
        sam_clientes=144,
        sam_fonte="144 varejistas habilitados (CLI-R1, mai/2026, CONFIRMADO); pagador é o varejista",
        evidencia_preco="Comerc paga R$ 1–2 mil por indicação de PME (CLI-R5, CONFIRMADO); "
                        "valor para Grupo A ≥500 kW: HIPÓTESE",
        custos_fixos_extra={"aquisição do lado consumidor (mídia/conteúdo)": 4_000},
        cenarios={  # unidades = contratos fechados por mês
            "pessimista": Cenario(preco=1_000, alvo24=2, inicio=8, cac=3_000, churn=0.0),
            "base": Cenario(preco=2_000, alvo24=8, inicio=6, cac=1_500, churn=0.0),
            "otimista": Cenario(preco=5_000, alvo24=25, inicio=5, cac=800, churn=0.0),
        },
    ),
    Hipotese(
        "H2", "Marketplace de capacidade de RD industrial",
        "agregador (repasse da receita de RD)", "fração da receita de RD intermediada",
        sam_clientes=12,
        sam_fonte="12 ofertas vencedoras no 3º mecanismo (RD-R*, CONFIRMADO); agregadores ativos < 10 (INFERÊNCIA)",
        evidencia_preco="Disponibilidade 2026: R$ 23,4–39 mil/MW pelo período (CLI-R15, CONFIRMADO); "
                        "fração de 5% para a plataforma: HIPÓTESE; produto em sandbox até 31/12/2026",
        cenarios={  # 'clientes' = MW intermediados; preço = R$/MW/mês para a plataforma (5% de R$ 30 mil/MW·ano)
            "pessimista": Cenario(preco=0, alvo24=0, inicio=13, cac=5_000, churn=0.0),
            "base": Cenario(preco=125, alvo24=10, inicio=10, cac=3_000, churn=0.0),
            "otimista": Cenario(preco=250, alvo24=40, inicio=9, cac=2_000, churn=0.0),
        },
    ),
    Hipotese(
        "H3", "SaaS/API de pré-qualificação de flexibilidade",
        "agregador/varejista/comercializadora habilitado", "assinatura mensal",
        sam_clientes=30,
        sam_fonte="< 10 agregadores ativos + parcela dos 144 varejistas que venham a agregar (INFERÊNCIA/HIPÓTESE)",
        evidencia_preco="nenhuma; AXIA oferece plataforma própria gratuita por 12 meses (CON-R13, CONFIRMADO)",
        custos_fixos_extra={"dados de medição/telemetria em pilotos": 1_000},
        cenarios={
            "pessimista": Cenario(preco=2_000, alvo24=1, inicio=9, cac=15_000, churn=0.03, custo_var_cliente=300),
            "base": Cenario(preco=4_000, alvo24=3, inicio=7, cac=12_000, churn=0.02, custo_var_cliente=400),
            "otimista": Cenario(preco=8_000, alvo24=6, inicio=6, cac=10_000, churn=0.01, custo_var_cliente=600),
        },
    ),
    Hipotese(
        "H4", "Gestão/cotação de energia (white-label para gestoras)",
        "gestora/consultoria de energia", "assinatura mensal",
        sam_clientes=300,
        sam_fonte="número de gestoras independentes NÃO VERIFICADO; 300 é HIPÓTESE de ordem de grandeza",
        evidencia_preco="nenhuma pública; gestoras cobram fee ou % da economia (CLI-R20); "
                        "comparador oficial gratuito da CCEE até 11/2027 (OE-R*, CONFIRMADO)",
        cenarios={
            "pessimista": Cenario(preco=800, alvo24=5, inicio=6, cac=5_000, churn=0.04, custo_var_cliente=150),
            "base": Cenario(preco=1_500, alvo24=15, inicio=5, cac=4_000, churn=0.03, custo_var_cliente=200),
            "otimista": Cenario(preco=3_000, alvo24=40, inicio=4, cac=3_000, churn=0.02, custo_var_cliente=250),
        },
    ),
    Hipotese(
        "H5", "Monitor de risco de contraparte de fornecedores de energia",
        "consumidor livre (CFO/compras), gestora, comercializadora", "assinatura mensal",
        sam_clientes=5_000,
        sam_fonte="~46 mil cargas fora do varejo (91.970 − 45.982, CLI-R1, CONFIRMADO) → ~5 mil grupos "
                  "compradores (HIPÓTESE: ~9 cargas por grupo) + 438 comercializadoras classificadas (CLI-R2)",
        evidencia_preco="nenhuma direta; dor CONFIRMADA (RJs 2026, H5-R*); birôs de crédito PJ como substituto",
        custos_fixos_extra={"fontes de dados (consultas judiciais/birô em escala de piloto)": 1_500,
                            "seguro de responsabilidade civil profissional": 500},
        cenarios={
            "pessimista": Cenario(preco=600, alvo24=8, inicio=5, cac=4_000, churn=0.04, custo_var_cliente=60),
            "base": Cenario(preco=1_200, alvo24=30, inicio=4, cac=3_000, churn=0.025, custo_var_cliente=80),
            "otimista": Cenario(preco=2_000, alvo24=80, inicio=3, cac=2_000, churn=0.015, custo_var_cliente=100),
        },
    ),
]


def clientes_no_mes(c: Cenario, m: int) -> float:
    if m < c.inicio or c.alvo24 <= 0:
        return 0.0
    return c.alvo24 * (m - c.inicio + 1) / (MESES - c.inicio + 1)


def simular(h: Hipotese, c: Cenario, pro_labore: bool = False) -> dict:
    fixo = sum(CUSTOS_FIXOS_MENSAIS.values()) + sum(h.custos_fixos_extra.values())
    if pro_labore:
        fixo += PRO_LABORE_MENSAL
    unicos = dict(CUSTOS_UNICOS) | h.custos_unicos_extra
    caixa, minimo, prev = 0.0, 0.0, 0.0
    receita_tot = 0.0
    serie = []
    for m in range(1, MESES + 1):
        cl = clientes_no_mes(c, m)
        churned = prev * c.churn
        novos = max(0.0, cl - prev) + churned
        receita = cl * c.preco
        var = receita * (IMPOSTO + TAXA_PAGAMENTO) + cl * c.custo_var_cliente
        aquis = novos * c.cac
        unico = sum(v for (mes, v) in unicos.values() if mes == m)
        caixa += receita - var - aquis - fixo - unico
        minimo = min(minimo, caixa)
        receita_tot += receita
        serie.append((m, cl, receita, caixa))
        prev = cl
    contrib = c.preco * (1 - IMPOSTO - TAXA_PAGAMENTO) - c.custo_var_cliente
    breakeven_clientes = fixo / contrib if contrib > 0 else float("inf")
    return {
        "serie": serie,
        "mrr12": serie[11][2],
        "mrr24": serie[23][2],
        "receita24": receita_tot,
        "caixa12": serie[11][3],
        "caixa24": serie[23][3],
        "necessidade_capital": -minimo,
        "contrib": contrib,
        "payback": (c.cac / contrib) if contrib > 0 else float("inf"),
        "ltv": (contrib / c.churn) if c.churn > 0 else None,
        "fixo": fixo,
        "breakeven_clientes": breakeven_clientes,
    }


def brl(v: float) -> str:
    if v == float("inf"):
        return "∞"
    s = f"{v:,.0f}".replace(",", ".")
    return f"R$ {s}"


def num(v: float, d: int = 1) -> str:
    if v == float("inf"):
        return "∞"
    return f"{v:.{d}f}".replace(".", ",")


def main() -> str:
    out = []
    p = out.append
    p("<!-- GERADO por scripts/economia.py — não editar à mão; altere as entradas no script e rode de novo. -->")
    p("")
    p("### Custos comuns a todas as hipóteses (HIPÓTESE)")
    p("")
    p("| Item | R$/mês |")
    p("|---|---:|")
    for k, v in CUSTOS_FIXOS_MENSAIS.items():
        p(f"| {k} | {brl(v)} |")
    p(f"| **total sem pró-labore** | **{brl(sum(CUSTOS_FIXOS_MENSAIS.values()))}** |")
    p(f"| pró-labore mínimo de 2 fundadores (cenário à parte) | {brl(PRO_LABORE_MENSAL)} |")
    p("")
    p("| Custo único | Mês | R$ |")
    p("|---|---:|---:|")
    for k, (m, v) in CUSTOS_UNICOS.items():
        p(f"| {k} | {m} | {brl(v)} |")
    p("")
    p(f"Imposto sobre receita: {num(IMPOSTO*100,0)}% (HIPÓTESE); meios de pagamento: {num(TAXA_PAGAMENTO*100,0)}%.")
    p("")
    infra24 = CUSTOS_FIXOS_MENSAIS[next(k for k in CUSTOS_FIXOS_MENSAIS if k.startswith("infra"))] * MESES
    infra_unico = CUSTOS_UNICOS["infraestrutura inicial (ambientes, ferramentas, segurança)"][1]
    p(f"**Checagem do orçamento de infraestrutura:** {brl(infra_unico)} inicial + {brl(infra24)} em 24 meses = "
      f"{brl(infra_unico + infra24)}, dentro dos {brl(ORCAMENTO_INFRA)} informados. Os demais custos "
      "(jurídico, especialista, comercial, aquisição, pró-labore) **não** cabem nesse orçamento e aparecem separados abaixo.")
    p("")

    p("### Premissas por hipótese")
    p("")
    p("| Hipótese | Quem paga | Evento de cobrança | SAM (nº de pagadores) | Fonte do SAM | Evidência de preço |")
    p("|---|---|---|---:|---|---|")
    for h in HIPOTESES:
        p(f"| {h.codigo} {h.nome} | {h.quem_paga} | {h.evento} | {h.sam_clientes} | {h.sam_fonte} | {h.evidencia_preco} |")
    p("")
    p("| Hipótese | Cenário | Preço | Alvo no mês 24 | 1ª receita (mês) | CAC | Churn/mês | Custo var./cliente |")
    p("|---|---|---:|---:|---:|---:|---:|---:|")
    for h in HIPOTESES:
        for s, c in h.cenarios.items():
            p(f"| {h.codigo} | {s} | {brl(c.preco)} | {num(c.alvo24,0)} | {c.inicio} | {brl(c.cac)} | "
              f"{num(c.churn*100,1)}% | {brl(c.custo_var_cliente)} |")
    p("")
    p("Notas: em H1 a unidade é *contrato fechado por mês*; em H2 é *MW intermediado* e o preço é R$/MW/mês para a "
      "plataforma (5% de ~R$ 30 mil/MW·ano). Todos os preços e alvos são **HIPÓTESE** salvo indicação na tabela anterior.")
    p("")

    p("### TAM / SAM / SOM (de baixo para cima, cenário base)")
    p("")
    p("TAM = SAM × preço base × 12 (receita anual se *todos* os pagadores contratassem). "
      "SOM = clientes do mês 24 × preço × 12 (receita anualizada capturável no cenário base). "
      "Nenhum valor converte potencial técnico (ex.: 8,8 GW da EPE) em faturamento.")
    p("")
    p("| Hipótese | TAM (R$/ano) | SOM mês 24 (R$/ano) | SOM/TAM |")
    p("|---|---:|---:|---:|")
    for h in HIPOTESES:
        c = h.cenarios["base"]
        if h.codigo == "H1":
            tam = h.sam_clientes * 10 * c.preco * 12  # HIPÓTESE: 10 contratos/mês por varejista pagador
        elif h.codigo == "H2":
            tam = 344 * c.preco * 12  # 344 MW contratados em 2026 (CONFIRMADO)
        else:
            tam = h.sam_clientes * c.preco * 12
        som = c.alvo24 * c.preco * 12
        p(f"| {h.codigo} | {brl(tam)} | {brl(som)} | {num(100*som/tam if tam else 0,1)}% |")
    p("")
    p("H1: TAM supõe 10 contratos/mês intermediados por varejista (HIPÓTESE). H2: TAM usa os 344 MW contratados em 2026, "
      "não o potencial da EPE.")
    p("")

    p("### Unit economics e fluxo de caixa (sem pró-labore)")
    p("")
    p("| Hipótese | Cenário | Margem contrib./cliente·mês | Payback do CAC (meses) | LTV | Clientes p/ cobrir custo fixo | "
      "Receita mês 12 | Receita mês 24 | Caixa acum. mês 12 | Caixa acum. mês 24 | Necessidade de capital |")
    p("|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|")
    resultados = {}
    for h in HIPOTESES:
        for s, c in h.cenarios.items():
            r = simular(h, c)
            resultados[(h.codigo, s)] = r
            ltv = brl(r["ltv"]) if r["ltv"] is not None else "n/a"
            p(f"| {h.codigo} | {s} | {brl(r['contrib'])} | {num(r['payback'])} | {ltv} | "
              f"{num(r['breakeven_clientes'],0)} | {brl(r['mrr12'])} | {brl(r['mrr24'])} | {brl(r['caixa12'])} | "
              f"{brl(r['caixa24'])} | {brl(r['necessidade_capital'])} |")
    p("")
    p("### Necessidade de capital com pró-labore mínimo (R$ 16 mil/mês para os dois fundadores)")
    p("")
    p("| Hipótese | Pessimista | Base | Otimista |")
    p("|---|---:|---:|---:|")
    for h in HIPOTESES:
        vals = [brl(simular(h, h.cenarios[s], pro_labore=True)["necessidade_capital"]) for s in ("pessimista", "base", "otimista")]
        p(f"| {h.codigo} | " + " | ".join(vals) + " |")
    p("")

    p("### Sensibilidade (cenário base; caixa acumulado no mês 24, sem pró-labore)")
    p("")
    p("| Hipótese | Base | Preço −50% | Preço +50% | Clientes −50% | Clientes +50% | CAC +50% | Início +3 meses |")
    p("|---|---:|---:|---:|---:|---:|---:|---:|")
    from dataclasses import replace
    for h in HIPOTESES:
        b = h.cenarios["base"]
        variantes = [b, replace(b, preco=b.preco * 0.5), replace(b, preco=b.preco * 1.5),
                     replace(b, alvo24=b.alvo24 * 0.5), replace(b, alvo24=b.alvo24 * 1.5),
                     replace(b, cac=b.cac * 1.5), replace(b, inicio=min(MESES, b.inicio + 3))]
        p(f"| {h.codigo} | " + " | ".join(brl(simular(h, v)["caixa24"]) for v in variantes) + " |")
    p("")

    p("### Fluxo de caixa mensal do cenário base (sem pró-labore)")
    p("")
    p("| Mês | " + " | ".join(f"{h.codigo} receita | {h.codigo} caixa" for h in HIPOTESES) + " |")
    p("|---:|" + "---:|---:|" * len(HIPOTESES))
    for m in range(1, MESES + 1):
        cells = []
        for h in HIPOTESES:
            _, _, rec, cx = resultados[(h.codigo, "base")]["serie"][m - 1]
            cells += [brl(rec), brl(cx)]
        p(f"| {m} | " + " | ".join(cells) + " |")
    return "\n".join(out)


INICIO, FIM = "<!-- BEGIN GERADO -->", "<!-- END GERADO -->"


if __name__ == "__main__":
    import pathlib
    import sys

    texto = main()
    if "--atualizar" in sys.argv:
        doc = pathlib.Path(__file__).resolve().parent.parent / "docs" / "05-ECONOMIA-E-MODELOS.md"
        atual = doc.read_text()
        a, b = atual.index(INICIO) + len(INICIO), atual.index(FIM)
        doc.write_text(atual[:a] + "\n" + texto + "\n" + atual[b:])
        print(f"atualizado: {doc}")
    else:
        print(texto)
