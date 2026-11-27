/** Formatação pt-BR com unidade explícita. Datas civis (AAAA-MM-DD) não passam por fuso. */

const TZ = "America/Sao_Paulo";

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const mwm = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 3, maximumFractionDigits: 3 });
const int = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 3 });
const pct = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const dateTime = new Intl.DateTimeFormat("pt-BR", {
  timeZone: TZ,
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

/** "R$ 2.628.000,00" */
export const fmtBRL = (v: number | null | undefined): string => (v === null || v === undefined ? "—" : brl.format(v));
/** "R$ 180,00/MWh" */
export const fmtBRLPerMWh = (v: number | null | undefined): string =>
  v === null || v === undefined ? "—" : `${brl.format(v)}/MWh`;
/** "2,000 MWm" */
export const fmtMWm = (v: number): string => `${mwm.format(v)} MWm`;
/** "26.280 MWh" */
export const fmtMWh = (v: number): string => `${int.format(v)} MWh`;
/** "13.140 h" */
export const fmtHours = (v: number): string => `${int.format(v)} h`;
/** "22,8%" */
export const fmtPct = (v: number | null | undefined): string =>
  v === null || v === undefined ? "—" : `${pct.format(v)}%`;
export const fmtInt = (v: number): string => int.format(v);

/** Data civil AAAA-MM-DD → dd/mm/aaaa (sem conversão de fuso). */
export function fmtDate(d: string | null | undefined): string {
  if (!d) return "—";
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(d);
  return m ? `${m[3]}/${m[2]}/${m[1]}` : d;
}

/** Instante ISO (UTC) → "dd/mm/aaaa hh:mm" no horário de Brasília. Use com o sufixo visível {@link TZ_LABEL}. */
export function fmtDateTime(ts: string | null | undefined): string {
  if (!ts) return "—";
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return ts;
  return dateTime.format(d).replace(",", "");
}

export const TZ_LABEL = "Horário de Brasília";

/** "12.345.678/0001-90" */
export function fmtCnpj(c: string | null | undefined): string {
  if (!c) return "—";
  const d = c.replace(/\D/g, "");
  if (d.length !== 14) return c;
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`;
}

/** Aceita "180,50", "1.234,5" ou "180.5". Retorna NaN se inválido e null se vazio. */
export function parseDecimal(raw: string): number | null {
  const s = raw.trim().replace(/\s/g, "");
  if (!s) return null;
  const normalized = s.includes(",") ? s.replace(/\./g, "").replace(",", ".") : s;
  if (!/^-?\d+(\.\d+)?$/.test(normalized)) return Number.NaN;
  return Number(normalized);
}

/** Dígitos verificadores do CNPJ a partir de 12 dígitos (para gerar exemplos sintéticos válidos). */
export function cnpjFromBase(base12: string): string {
  const calc = (digits: string) => {
    const weights =
      digits.length === 12 ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const sum = digits.split("").reduce((acc, ch, i) => acc + Number(ch) * weights[i]!, 0);
    const r = sum % 11;
    return r < 2 ? 0 : 11 - r;
  };
  const d1 = calc(base12);
  const d2 = calc(base12 + d1);
  return `${base12}${d1}${d2}`;
}

/** Dispara o download de um texto gerado no navegador. */
export function downloadText(filename: string, text: string, mime = "text/csv;charset=utf-8"): void {
  const blob = new Blob(["﻿" + text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
