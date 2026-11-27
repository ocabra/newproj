/**
 * Experimento E1 (docs/06 §6): o Fator de Alavancagem (FA) público teria antecipado os eventos de crédito?
 * Lógica pura, sem banco. Entrada: série semanal de FA por fornecedor + linha do tempo de eventos de crédito.
 */
import { daysBetween } from "../domain/dates.js";

export interface FaPoint {
  supplierCnpj: string;
  weekStart: string;
  bandRank: number;
}

export interface CreditEvent {
  supplierCnpj: string;
  supplierName: string;
  eventDate: string;
  eventType: string;
  sourceUrl: string;
}

export interface BacktestRow {
  supplierCnpj: string;
  supplierName: string;
  eventDate: string;
  eventType: string;
  firstSignalWeek: string | null;
  leadDays: number | null;
  flaggedWithMinLead: boolean;
  note: string;
}

export interface BacktestResult {
  rows: BacktestRow[];
  total: number;
  flagged: number;
  minLeadDays: number;
  lookbackDays: number;
  verdict: "sinais_combinados_agregam_valor" | "antecipacao_ja_gratuita" | "inconclusivo";
}

/**
 * Sinal = primeira semana, dentro da janela de `lookbackDays` antes do evento, em que a faixa do FA piora
 * em relação à semana anterior observada (maior = pior). Sem observações na janela → sem sinal.
 * Critérios de decisão definidos ANTES do experimento (docs/06 §6, E1): ≤ 40% sinalizados com ≥ 60 dias →
 * sinais combinados agregam valor; ≥ 70% → antecipação já é gratuita; entre os dois → inconclusivo.
 */
export function runBacktest(
  fa: FaPoint[],
  events: CreditEvent[],
  opts: { minLeadDays?: number; lookbackDays?: number } = {},
): BacktestResult {
  const minLead = opts.minLeadDays ?? 60;
  const lookback = opts.lookbackDays ?? 365;
  const bySupplier = new Map<string, FaPoint[]>();
  for (const p of fa) {
    const list = bySupplier.get(p.supplierCnpj) ?? [];
    list.push(p);
    bySupplier.set(p.supplierCnpj, list);
  }
  for (const list of bySupplier.values()) list.sort((a, b) => a.weekStart.localeCompare(b.weekStart));

  const rows: BacktestRow[] = events.map((e) => {
    const series = (bySupplier.get(e.supplierCnpj) ?? []).filter((p) => p.weekStart < e.eventDate);
    const base = {
      supplierCnpj: e.supplierCnpj,
      supplierName: e.supplierName,
      eventDate: e.eventDate,
      eventType: e.eventType,
    };
    if (!series.length) {
      return {
        ...base,
        firstSignalWeek: null,
        leadDays: null,
        flaggedWithMinLead: false,
        note: "sem série de FA antes do evento",
      };
    }
    let signal: FaPoint | null = null;
    for (let i = 1; i < series.length; i++) {
      const cur = series[i]!;
      const prev = series[i - 1]!;
      if (daysBetween(cur.weekStart, e.eventDate) > lookback) continue;
      if (cur.bandRank > prev.bandRank) {
        signal = cur;
        break;
      }
    }
    if (!signal) {
      return {
        ...base,
        firstSignalWeek: null,
        leadDays: null,
        flaggedWithMinLead: false,
        note: "FA não piorou na janela",
      };
    }
    const lead = daysBetween(signal.weekStart, e.eventDate);
    return {
      ...base,
      firstSignalWeek: signal.weekStart,
      leadDays: lead,
      flaggedWithMinLead: lead >= minLead,
      note: lead >= minLead ? "antecipou" : `piora com antecedência < ${minLead} dias`,
    };
  });
  const flagged = rows.filter((r) => r.flaggedWithMinLead).length;
  const share = rows.length ? flagged / rows.length : 0;
  const verdict =
    rows.length === 0
      ? "inconclusivo"
      : share <= 0.4
        ? "sinais_combinados_agregam_valor"
        : share >= 0.7
          ? "antecipacao_ja_gratuita"
          : "inconclusivo";
  return { rows, total: rows.length, flagged, minLeadDays: minLead, lookbackDays: lookback, verdict };
}

export function backtestMarkdown(r: BacktestResult, inputs: { faFile: string; eventsFile: string }): string {
  const verdictText = {
    sinais_combinados_agregam_valor:
      "FA sozinho antecipou poucos eventos → sinais combinados e curadoria podem agregar valor (sucesso de E1).",
    antecipacao_ja_gratuita:
      "FA sozinho já antecipou a maioria → antecipação é gratuita; reduzir proposta a alertas/exposição na carteira (fracasso de E1).",
    inconclusivo: "Resultado intermediário ou amostra vazia → inconclusivo; ampliar amostra antes de decidir.",
  }[r.verdict];
  const lines = [
    "# Resultado do backtest E1 (Fator de Alavancagem × eventos de crédito)",
    "",
    `- Série de FA: \`${inputs.faFile}\``,
    `- Eventos: \`${inputs.eventsFile}\``,
    `- Critério: sinal = piora de faixa em relação à semana anterior, até ${r.lookbackDays} dias antes; antecipação mínima ${r.minLeadDays} dias.`,
    `- **Sinalizados com antecedência ≥ ${r.minLeadDays} dias: ${r.flagged} de ${r.total}.**`,
    `- **Veredito pelo critério pré-definido:** ${verdictText}`,
    "",
    "| Fornecedor | CNPJ | Evento | Data do evento | 1º sinal (semana) | Antecedência (dias) | Observação |",
    "|---|---|---|---|---|---:|---|",
    ...r.rows.map(
      (x) =>
        `| ${x.supplierName} | ${x.supplierCnpj} | ${x.eventType} | ${x.eventDate} | ${x.firstSignalWeek ?? "—"} | ${x.leadDays ?? "—"} | ${x.note} |`,
    ),
    "",
    "> Gerado por `npm run backtest`. Se os arquivos de entrada forem os de `scripts/samples/`, o resultado é **sintético** e não vale como evidência.",
  ];
  return lines.join("\n");
}
