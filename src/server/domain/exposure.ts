import { daysBetween, maxDate } from "./dates.js";

export interface ExposureInput {
  asOf: string; // data civil de cálculo (America/Sao_Paulo)
  startDate: string;
  endDate: string; // inclusiva
  volumeMwm: number;
  priceBrlPerMwh: number;
  guaranteeBrl: number | null;
  reference: { priceBrlPerMwh: number; referenceDate: string; sourceName: string; sourceUrl: string } | null;
}

export interface Exposure {
  as_of: string;
  remaining_hours: number;
  remaining_energy_mwh: number;
  reference_price_brl_per_mwh: number;
  reference_price_date: string;
  reference_price_source: string;
  reference_price_url: string;
  contract_price_brl_per_mwh: number;
  replacement_cost_brl: number;
  guarantee_brl: number | null;
  guarantee_coverage_pct: number | null;
  formula: string;
}

export type ExposureResult = { exposure: Exposure; reason: null } | { exposure: null; reason: string };

const round = (v: number, d: number) => Math.round(v * 10 ** d) / 10 ** d;

/**
 * Custo de reposição se o fornecedor deixar de entregar (docs/07 §3).
 * Horas = dias civis restantes × 24 (o Brasil não tem horário de verão desde 2019; ver docs/09).
 */
export function computeExposure(i: ExposureInput): ExposureResult {
  if (!i.reference) return { exposure: null, reason: "no_reference_price" };
  const from = maxDate(i.asOf, i.startDate);
  const days = i.endDate < from ? 0 : daysBetween(from, i.endDate) + 1;
  const hours = days * 24;
  const energy = i.volumeMwm * hours;
  const delta = Math.max(0, i.reference.priceBrlPerMwh - i.priceBrlPerMwh);
  const cost = energy * delta;
  const coverage = i.guaranteeBrl === null ? null : cost > 0 ? Math.min(100, (i.guaranteeBrl / cost) * 100) : 100;
  return {
    reason: null,
    exposure: {
      as_of: i.asOf,
      remaining_hours: hours,
      remaining_energy_mwh: round(energy, 3),
      reference_price_brl_per_mwh: i.reference.priceBrlPerMwh,
      reference_price_date: i.reference.referenceDate,
      reference_price_source: i.reference.sourceName,
      reference_price_url: i.reference.sourceUrl,
      contract_price_brl_per_mwh: i.priceBrlPerMwh,
      replacement_cost_brl: round(cost, 2),
      guarantee_brl: i.guaranteeBrl,
      guarantee_coverage_pct: coverage === null ? null : round(coverage, 1),
      formula: "volume_mwm × horas_restantes × max(0, preço_referência − preço_contrato)",
    },
  };
}
