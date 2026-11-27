import { describe, expect, it } from "vitest";
import { cnpjFromBase, isValidCnpj, normalizeCnpj } from "./cnpj.js";
import { civilDateInSaoPaulo } from "./dates.js";
import { computeExposure } from "./exposure.js";
import { evaluate, type RuleContract, type RuleEvent } from "./rules.js";
import { parseContractsCsv, parseLeverageCsv } from "./csv.js";

const SUP = cnpjFromBase("111111110001");
const SUP_BRANCH = cnpjFromBase("111111110002");
const OTHER = cnpjFromBase("222222220001");
const CLI = cnpjFromBase("333333330001");

const contract = (o: Partial<RuleContract> = {}): RuleContract => ({
  id: "c1",
  supplierCnpj: SUP,
  startDate: "2026-01-01",
  endDate: "2027-12-31",
  deleted: false,
  orgApproved: true,
  ...o,
});
const event = (o: Partial<RuleEvent> = {}): RuleEvent => ({
  id: "e1",
  supplierCnpj: SUP,
  scope: "entity",
  type: "judicial_recovery_filed",
  eventDate: "2026-05-20",
  status: "published",
  ...o,
});

describe("CNPJ", () => {
  it("valida dígitos verificadores e rejeita sequências repetidas", () => {
    expect(isValidCnpj(SUP)).toBe(true);
    expect(isValidCnpj("11.222.333/0001-81")).toBe(true);
    expect(isValidCnpj("11.222.333/0001-82")).toBe(false);
    expect(isValidCnpj("00000000000000")).toBe(false);
    expect(normalizeCnpj("11.222.333/0001-81")).toBe("11222333000181");
  });
});

describe("motor de regras rules@1", () => {
  it("gera alerta crítico para pedido de RJ do fornecedor do contrato vigente", () => {
    const r = evaluate(contract(), event());
    expect(r.match).toBe(true);
    expect(r.severity).toBe("critical");
    expect(r.reasons).toEqual([
      "event_published",
      "supplier_match_exact",
      "contract_active_record",
      "contract_period_overlaps_or_future",
    ]);
    expect(r.ruleVersion).toBe("rules@1");
  });
  it("não gera alerta para fornecedor diferente e explica o motivo", () => {
    const r = evaluate(contract({ supplierCnpj: OTHER }), event());
    expect(r.match).toBe(false);
    expect(r.checks.find((c) => c.rule === "C2")).toMatchObject({ passed: false, reason: "supplier_mismatch" });
  });
  it("não gera alerta para contrato encerrado antes do evento", () => {
    const r = evaluate(contract({ endDate: "2026-05-19" }), event());
    expect(r.match).toBe(false);
    expect(r.checks.find((c) => c.rule === "C4")?.reason).toBe("contract_ended_before_event");
  });
  it("sobreposição parcial: contrato que começa depois do evento gera alerta", () => {
    expect(evaluate(contract({ startDate: "2026-09-01" }), event()).match).toBe(true);
  });
  it("contrato que termina no dia do evento gera alerta (limite inclusivo)", () => {
    expect(evaluate(contract({ endDate: "2026-05-20" }), event()).match).toBe(true);
  });
  it("evento de grupo alcança filial com a mesma raiz; evento de entidade não", () => {
    expect(evaluate(contract({ supplierCnpj: SUP_BRANCH }), event({ scope: "group" })).match).toBe(true);
    expect(evaluate(contract({ supplierCnpj: SUP_BRANCH }), event()).match).toBe(false);
  });
  it("evento rascunho ou retirado não gera alerta", () => {
    expect(evaluate(contract(), event({ status: "draft" })).match).toBe(false);
    expect(evaluate(contract(), event({ status: "retracted" })).match).toBe(false);
  });
  it("contrato excluído ou organização não aprovada não gera alerta", () => {
    expect(evaluate(contract({ deleted: true }), event()).match).toBe(false);
    expect(evaluate(contract({ orgApproved: false }), event()).match).toBe(false);
  });
  it("é determinístico", () => {
    expect(evaluate(contract(), event())).toEqual(evaluate(contract(), event()));
  });
});

describe("fuso horário", () => {
  it("instante após 21h em Brasília cai no mesmo dia civil local, não no dia UTC", () => {
    expect(civilDateInSaoPaulo(new Date("2026-11-28T02:30:00Z"))).toBe("2026-11-27");
    expect(civilDateInSaoPaulo(new Date("2026-11-28T03:00:00Z"))).toBe("2026-11-28");
  });
});

describe("exposição", () => {
  const ref = {
    priceBrlPerMwh: 280,
    referenceDate: "2026-11-20",
    sourceName: "Fonte sintética",
    sourceUrl: "https://exemplo.invalid/ref",
  };
  it("reproduz o exemplo de docs/07 (2 MWm, 18 meses ≈ 548 dias, Δ R$ 100/MWh)", () => {
    const r = computeExposure({
      asOf: "2026-12-01",
      startDate: "2026-01-01",
      endDate: "2028-05-31",
      volumeMwm: 2,
      priceBrlPerMwh: 180,
      guaranteeBrl: 600_000,
      reference: ref,
    });
    expect(r.exposure).not.toBeNull();
    const e = r.exposure!;
    expect(e.remaining_hours).toBe(548 * 24);
    expect(e.remaining_energy_mwh).toBe(2 * 548 * 24);
    expect(e.replacement_cost_brl).toBe(2 * 548 * 24 * 100);
    expect(e.guarantee_coverage_pct).toBeCloseTo((600_000 / (2 * 548 * 24 * 100)) * 100, 1);
  });
  it("sem preço de referência não estima nada", () => {
    const r = computeExposure({
      asOf: "2026-12-01",
      startDate: "2026-01-01",
      endDate: "2027-01-01",
      volumeMwm: 1,
      priceBrlPerMwh: 100,
      guaranteeBrl: null,
      reference: null,
    });
    expect(r).toEqual({ exposure: null, reason: "no_reference_price" });
  });
  it("contrato futuro conta a partir do início; preço acima da referência dá custo zero e cobertura 100%", () => {
    const r = computeExposure({
      asOf: "2026-12-01",
      startDate: "2027-01-01",
      endDate: "2027-01-10",
      volumeMwm: 1,
      priceBrlPerMwh: 300,
      guaranteeBrl: 10,
      reference: ref,
    });
    expect(r.exposure?.remaining_hours).toBe(240);
    expect(r.exposure?.replacement_cost_brl).toBe(0);
    expect(r.exposure?.guarantee_coverage_pct).toBe(100);
  });
  it("contrato encerrado tem energia restante zero", () => {
    const r = computeExposure({
      asOf: "2026-12-01",
      startDate: "2025-01-01",
      endDate: "2026-11-30",
      volumeMwm: 1,
      priceBrlPerMwh: 100,
      guaranteeBrl: null,
      reference: ref,
    });
    expect(r.exposure?.remaining_energy_mwh).toBe(0);
  });
});

describe("importação CSV de contratos", () => {
  const header =
    "client_cnpj,client_name,site_name,submarket,supplier_cnpj,supplier_name,start_date,end_date,volume_mwm,price_brl_per_mwh,guarantee_brl,guarantee_type";
  const good = `${CLI},Cliente Sintético,Planta 1,SE_CO,${SUP},Fornecedor Sintético,2026-01-01,2027-12-31,2.5,210.50,500000,bank_guarantee`;
  it("aceita arquivo válido", () => {
    const r = parseContractsCsv(`${header}\n${good}\n`);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.rows[0]).toMatchObject({ volumeMwm: 2.5, priceBrlPerMwh: 210.5, submarket: "SE_CO" });
  });
  it("aceita ponto e vírgula com vírgula decimal (Excel pt-BR)", () => {
    const line = good.replace(/,/g, ";").replace("2.5", "2,5").replace("210.50", "210,50");
    const r = parseContractsCsv(`${header.replace(/,/g, ";")}\n${line}`);
    expect(r.ok && r.rows[0]?.volumeMwm).toBe(2.5);
  });
  it("rejeita colunas ausentes", () => {
    const r = parseContractsCsv("client_cnpj,client_name\n1,2");
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors[0]?.message).toMatch(/Colunas obrigatórias ausentes/);
  });
  it("rejeita MWh no lugar de MWm, data inválida, CNPJ inválido e fim antes do início, com linha e campo", () => {
    const bad = [
      good.replace("2.5", "1825"),
      good.replace("2026-01-01", "2026-02-30"),
      good.replace(SUP, "11111111000100"),
      good.replace("2027-12-31", "2025-12-31"),
    ].join("\n");
    const r = parseContractsCsv(`${header}\n${bad}`);
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.errors).toContainEqual(
        expect.objectContaining({ line: 2, field: "volume_mwm", message: expect.stringMatching(/MWh/) }),
      );
      expect(r.errors).toContainEqual(expect.objectContaining({ line: 3, field: "start_date" }));
      expect(r.errors).toContainEqual(expect.objectContaining({ line: 4, field: "supplier_cnpj" }));
      expect(r.errors).toContainEqual(expect.objectContaining({ line: 5, field: "end_date" }));
    }
  });
  it("rejeita arquivo malformado e acima do limite", () => {
    expect(parseContractsCsv(`${header}\n"aberto,sem fechar`).ok).toBe(false);
    const big = `${header}\n` + `${good}\n`.repeat(6000);
    const r = parseContractsCsv(big);
    expect(r.ok).toBe(false);
  });
});

describe("importação CSV de Fator de Alavancagem", () => {
  it("rejeita semana duplicada e faixa não inteira", () => {
    const h = "supplier_cnpj,supplier_name,week_start,band_rank,value,source_name,source_url";
    const l = `${SUP},Forn,2026-01-05,2,,CCEE,https://exemplo.invalid/fa`;
    const r = parseLeverageCsv(`${h}\n${l}\n${l}\n${l.replace(",2,", ",2.5,")}`);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.map((e) => e.field)).toEqual(expect.arrayContaining(["week_start", "band_rank"]));
  });
});
