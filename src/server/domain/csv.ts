import { parse } from "csv-parse/sync";
import { isValidCnpj, normalizeCnpj } from "./cnpj.js";
import { isValidCivilDate } from "./dates.js";

export const CSV_MAX_BYTES = 1_000_000;
export const CSV_MAX_ROWS = 5_000;

export interface RowError {
  line: number;
  field?: string;
  message: string;
}

export type CsvResult<T> = { ok: true; rows: T[] } | { ok: false; errors: RowError[] };

type Raw = Record<string, string>;

function readCsv(text: string, required: readonly string[]): { rows: Raw[]; decimalComma: boolean } | RowError[] {
  if (Buffer.byteLength(text, "utf8") > CSV_MAX_BYTES) {
    return [{ line: 0, message: `Arquivo acima do limite de ${CSV_MAX_BYTES / 1_000_000} MB.` }];
  }
  const clean = text.replace(/^\uFEFF/, "");
  const firstLine = clean.split(/\r?\n/, 1)[0] ?? "";
  if (!firstLine.trim()) return [{ line: 1, message: "Arquivo vazio ou sem cabeçalho." }];
  const delimiter = firstLine.includes(";") ? ";" : ",";
  let rows: Raw[];
  try {
    rows = parse(clean, {
      columns: (h: string[]) => h.map((c) => c.trim().toLowerCase()),
      delimiter,
      skip_empty_lines: true,
      trim: true,
      relax_column_count: false,
    }) as Raw[];
  } catch (e) {
    return [{ line: 0, message: `CSV malformado: ${(e as Error).message}` }];
  }
  const header = firstLine.split(delimiter).map((c) => c.trim().replace(/^"|"$/g, "").toLowerCase());
  const missing = required.filter((r) => !header.includes(r));
  if (missing.length) return [{ line: 1, message: `Colunas obrigatórias ausentes: ${missing.join(", ")}.` }];
  if (rows.length === 0) return [{ line: 2, message: "Nenhuma linha de dados." }];
  if (rows.length > CSV_MAX_ROWS) return [{ line: 0, message: `Mais de ${CSV_MAX_ROWS} linhas.` }];
  return { rows, decimalComma: delimiter === ";" };
}

function num(v: string | undefined, decimalComma: boolean): number | null {
  if (v === undefined || v === "") return null;
  const s = decimalComma ? v.replace(/\./g, "").replace(",", ".") : v;
  if (!/^-?\d+(\.\d+)?$/.test(s)) return Number.NaN;
  return Number(s);
}

export const CONTRACT_COLUMNS = [
  "client_cnpj",
  "client_name",
  "site_name",
  "submarket",
  "supplier_cnpj",
  "supplier_name",
  "start_date",
  "end_date",
  "volume_mwm",
  "price_brl_per_mwh",
  "guarantee_brl",
  "guarantee_type",
] as const;

export const SUBMARKETS = ["SE_CO", "S", "NE", "N"] as const;
export const GUARANTEE_TYPES = ["none", "bank_guarantee", "insurance", "deposit", "other"] as const;

export interface ContractRow {
  line: number;
  clientCnpj: string;
  clientName: string;
  siteName: string;
  submarket: (typeof SUBMARKETS)[number];
  supplierCnpj: string;
  supplierName: string;
  startDate: string;
  endDate: string;
  volumeMwm: number;
  priceBrlPerMwh: number;
  guaranteeBrl: number | null;
  guaranteeType: (typeof GUARANTEE_TYPES)[number];
}

/** Validação estrita. O arquivo é aceito inteiro ou rejeitado inteiro (com todos os erros por linha). */
export function parseContractsCsv(text: string): CsvResult<ContractRow> {
  const read = readCsv(
    text,
    CONTRACT_COLUMNS.filter((c) => c !== "guarantee_brl" && c !== "guarantee_type"),
  );
  if (Array.isArray(read)) return { ok: false, errors: read };
  const errors: RowError[] = [];
  const out: ContractRow[] = [];
  read.rows.forEach((r, idx) => {
    const line = idx + 2;
    const err = (field: string, message: string) => errors.push({ line, field, message });
    const clientCnpj = normalizeCnpj(r.client_cnpj ?? "");
    const supplierCnpj = normalizeCnpj(r.supplier_cnpj ?? "");
    if (!isValidCnpj(clientCnpj)) err("client_cnpj", "CNPJ do cliente inválido.");
    if (!isValidCnpj(supplierCnpj)) err("supplier_cnpj", "CNPJ do fornecedor inválido.");
    if (!r.client_name) err("client_name", "Obrigatório.");
    if (!r.site_name) err("site_name", "Obrigatório.");
    if (!r.supplier_name) err("supplier_name", "Obrigatório.");
    const submarket = (r.submarket ?? "").toUpperCase().replace("/", "_");
    if (!(SUBMARKETS as readonly string[]).includes(submarket)) err("submarket", "Use SE_CO, S, NE ou N.");
    const startDate = r.start_date ?? "";
    const endDate = r.end_date ?? "";
    if (!isValidCivilDate(startDate)) err("start_date", "Data inválida; use AAAA-MM-DD.");
    if (!isValidCivilDate(endDate)) err("end_date", "Data inválida; use AAAA-MM-DD.");
    if (isValidCivilDate(startDate) && isValidCivilDate(endDate) && endDate < startDate)
      err("end_date", "Fim anterior ao início.");
    const volume = num(r.volume_mwm, read.decimalComma);
    if (volume === null || Number.isNaN(volume)) err("volume_mwm", "Número obrigatório (MW médio).");
    else if (volume <= 0) err("volume_mwm", "Deve ser maior que zero.");
    else if (volume > 1000)
      err("volume_mwm", "Acima de 1.000 MWm: o valor parece estar em MWh. Informe a média em MW (MWm).");
    const price = num(r.price_brl_per_mwh, read.decimalComma);
    if (price === null || Number.isNaN(price)) err("price_brl_per_mwh", "Número obrigatório (R$/MWh).");
    else if (price < 0 || price > 5000) err("price_brl_per_mwh", "Fora da faixa plausível (0 a 5.000 R$/MWh).");
    const guarantee = num(r.guarantee_brl, read.decimalComma);
    if (guarantee !== null && (Number.isNaN(guarantee) || guarantee < 0)) err("guarantee_brl", "Valor em R$ inválido.");
    const gtype = (r.guarantee_type || (guarantee ? "other" : "none")).toLowerCase();
    if (!(GUARANTEE_TYPES as readonly string[]).includes(gtype))
      err("guarantee_type", `Use ${GUARANTEE_TYPES.join(", ")}.`);
    if (errors.some((e) => e.line === line)) return;
    out.push({
      line,
      clientCnpj,
      clientName: r.client_name!,
      siteName: r.site_name!,
      submarket: submarket as ContractRow["submarket"],
      supplierCnpj,
      supplierName: r.supplier_name!,
      startDate,
      endDate,
      volumeMwm: volume!,
      priceBrlPerMwh: price!,
      guaranteeBrl: guarantee,
      guaranteeType: gtype as ContractRow["guaranteeType"],
    });
  });
  return errors.length ? { ok: false, errors } : { ok: true, rows: out };
}

export const LEVERAGE_COLUMNS = [
  "supplier_cnpj",
  "supplier_name",
  "week_start",
  "band_rank",
  "value",
  "source_name",
  "source_url",
] as const;

export interface LeverageRow {
  line: number;
  supplierCnpj: string;
  supplierName: string;
  weekStart: string;
  bandRank: number;
  value: number | null;
  sourceName: string;
  sourceUrl: string;
}

export function parseLeverageCsv(text: string): CsvResult<LeverageRow> {
  const read = readCsv(
    text,
    LEVERAGE_COLUMNS.filter((c) => c !== "value"),
  );
  if (Array.isArray(read)) return { ok: false, errors: read };
  const errors: RowError[] = [];
  const out: LeverageRow[] = [];
  const seen = new Set<string>();
  read.rows.forEach((r, idx) => {
    const line = idx + 2;
    const err = (field: string, message: string) => errors.push({ line, field, message });
    const supplierCnpj = normalizeCnpj(r.supplier_cnpj ?? "");
    if (!isValidCnpj(supplierCnpj)) err("supplier_cnpj", "CNPJ inválido.");
    if (!r.supplier_name) err("supplier_name", "Obrigatório.");
    const weekStart = r.week_start ?? "";
    if (!isValidCivilDate(weekStart)) err("week_start", "Data inválida; use AAAA-MM-DD.");
    const band = num(r.band_rank, read.decimalComma);
    if (band === null || Number.isNaN(band) || !Number.isInteger(band) || band < 0 || band > 20)
      err("band_rank", "Inteiro de 0 a 20 (maior = pior).");
    const value = num(r.value, read.decimalComma);
    if (value !== null && Number.isNaN(value)) err("value", "Número inválido.");
    if (!r.source_name) err("source_name", "Fonte obrigatória.");
    if (!/^https?:\/\//.test(r.source_url ?? "")) err("source_url", "URL http(s) obrigatória.");
    const key = `${supplierCnpj}|${weekStart}`;
    if (seen.has(key)) err("week_start", "Semana duplicada para o mesmo fornecedor.");
    seen.add(key);
    if (errors.some((e) => e.line === line)) return;
    out.push({
      line,
      supplierCnpj,
      supplierName: r.supplier_name!,
      weekStart,
      bandRank: band!,
      value,
      sourceName: r.source_name!,
      sourceUrl: r.source_url!,
    });
  });
  return errors.length ? { ok: false, errors } : { ok: true, rows: out };
}
