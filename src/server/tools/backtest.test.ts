import { describe, expect, it } from "vitest";
import { runBacktest } from "./backtest.js";

const fa = (cnpj: string, pts: [string, number][]) =>
  pts.map(([weekStart, bandRank]) => ({ supplierCnpj: cnpj, weekStart, bandRank }));
const ev = (cnpj: string, eventDate: string) => ({
  supplierCnpj: cnpj,
  supplierName: cnpj,
  eventDate,
  eventType: "judicial_recovery_filed",
  sourceUrl: "https://x.invalid",
});

describe("backtest E1", () => {
  it("mede antecedência da primeira piora e aplica o critério de 60 dias", () => {
    const r = runBacktest(
      [
        ...fa("A", [
          ["2026-01-05", 1],
          ["2026-01-12", 2],
          ["2026-01-19", 3],
        ]),
        ...fa("B", [
          ["2026-04-06", 1],
          ["2026-04-13", 2],
        ]),
        ...fa("C", [
          ["2026-01-05", 2],
          ["2026-01-12", 2],
        ]),
      ],
      [ev("A", "2026-05-20"), ev("B", "2026-05-20"), ev("C", "2026-05-20"), ev("D", "2026-05-20")],
    );
    expect(r.rows.map((x) => [x.firstSignalWeek, x.leadDays, x.flaggedWithMinLead])).toEqual([
      ["2026-01-12", 128, true],
      ["2026-04-13", 37, false],
      [null, null, false],
      [null, null, false],
    ]);
    expect(r.flagged).toBe(1);
    expect(r.verdict).toBe("sinais_combinados_agregam_valor");
  });
  it("ignora observações no dia do evento ou depois, e fora da janela", () => {
    const r = runBacktest(
      fa("A", [
        ["2024-01-01", 1],
        ["2024-01-08", 5],
        ["2026-05-20", 9],
      ]),
      [ev("A", "2026-05-20")],
    );
    expect(r.rows[0]!.firstSignalWeek).toBeNull();
  });
  it("veredito 'antecipação já gratuita' quando ≥ 70% antecipados", () => {
    const series = ["A", "B", "C"].flatMap((c) =>
      fa(c, [
        ["2026-01-05", 1],
        ["2026-01-12", 2],
      ]),
    );
    expect(runBacktest(series, [ev("A", "2026-06-01"), ev("B", "2026-06-01"), ev("C", "2026-06-01")]).verdict).toBe(
      "antecipacao_ja_gratuita",
    );
  });
});
