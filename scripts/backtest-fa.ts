/**
 * E1 — backtest do Fator de Alavancagem (docs/06 §6).
 * Uso: npm run backtest -- --fa <fa.csv> --eventos <eventos.csv> [--saida <resultado.md>]
 *  fa.csv:      supplier_cnpj,supplier_name,week_start,band_rank,value,source_name,source_url  (baixado manualmente da CCEE)
 *  eventos.csv: supplier_cnpj,supplier_name,event_date,event_type,source_url                    (linha do tempo do anexo H5 §2.2)
 * Sem argumentos, roda com os arquivos SINTÉTICOS de scripts/samples/ (demonstração; não é evidência).
 */
import { parse } from "csv-parse/sync";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { isValidCnpj, normalizeCnpj } from "../src/server/domain/cnpj.js";
import { parseLeverageCsv } from "../src/server/domain/csv.js";
import { isValidCivilDate } from "../src/server/domain/dates.js";
import { backtestMarkdown, runBacktest, type CreditEvent } from "../src/server/tools/backtest.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const arg = (name: string) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > 0 ? process.argv[i + 1] : undefined;
};
const faFile = arg("fa") ?? path.join(here, "samples/fa-sintetico.csv");
const eventsFile = arg("eventos") ?? path.join(here, "samples/eventos-sinteticos.csv");

const fa = parseLeverageCsv(fs.readFileSync(faFile, "utf8"));
if (!fa.ok) {
  console.error("FA inválido:", fa.errors.slice(0, 20));
  process.exit(1);
}
const rawEvents = parse(fs.readFileSync(eventsFile, "utf8").replace(/^\uFEFF/, ""), {
  columns: true,
  skip_empty_lines: true,
  trim: true,
}) as Record<string, string>[];
const events: CreditEvent[] = [];
rawEvents.forEach((e, i) => {
  const cnpj = normalizeCnpj(e.supplier_cnpj ?? "");
  if (!isValidCnpj(cnpj) || !isValidCivilDate(e.event_date ?? "")) {
    console.error(`eventos.csv linha ${i + 2}: CNPJ ou data inválidos`);
    process.exit(1);
  }
  events.push({
    supplierCnpj: cnpj,
    supplierName: e.supplier_name ?? cnpj,
    eventDate: e.event_date!,
    eventType: e.event_type ?? "",
    sourceUrl: e.source_url ?? "",
  });
});
const result = runBacktest(
  fa.rows.map((r) => ({ supplierCnpj: r.supplierCnpj, weekStart: r.weekStart, bandRank: r.bandRank })),
  events,
);
const md = backtestMarkdown(result, {
  faFile: path.relative(process.cwd(), faFile),
  eventsFile: path.relative(process.cwd(), eventsFile),
});
const out = arg("saida");
if (out) fs.writeFileSync(out, md + "\n");
console.log(md);
