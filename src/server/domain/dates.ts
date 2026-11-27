/** Datas civis (YYYY-MM-DD) interpretadas no fuso de operação. */
export const OPERATION_TZ = "America/Sao_Paulo";

const civilFmt = new Intl.DateTimeFormat("en-CA", {
  timeZone: OPERATION_TZ,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** Data civil em America/Sao_Paulo de um instante. Ex.: 2026-11-28T02:30Z → "2026-11-27". */
export function civilDateInSaoPaulo(instant: Date): string {
  return civilFmt.format(instant);
}

export function isValidCivilDate(s: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d = new Date(`${s}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
}

/** Diferença em dias inteiros entre duas datas civis (b − a). */
export function daysBetween(a: string, b: string): number {
  return Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86_400_000);
}

export function maxDate(a: string, b: string): string {
  return a >= b ? a : b;
}
