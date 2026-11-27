import { useId, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { api, type ImportResult, type LeverageImportResult, type RowError } from "../api";
import { Table } from "../components/Table";
import { Empty, ErrorBox, Loading, PageHeader, Success, Warning } from "../components/ui";
import { cnpjFromBase, downloadText, fmtDateTime, TZ_LABEL } from "../format";
import { useAsync } from "../hooks";

/** Colunas de src/server/domain/csv.ts (CONTRACT_COLUMNS e LEVERAGE_COLUMNS). */
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

export const LEVERAGE_COLUMNS = [
  "supplier_cnpj",
  "supplier_name",
  "week_start",
  "band_rank",
  "value",
  "source_name",
  "source_url",
] as const;

const MAX_BYTES = 1_000_000;

function contractTemplate(): string {
  const example = [
    cnpjFromBase("111111110001"),
    "Cliente Sintético Ltda",
    "Fábrica 1",
    "SE_CO",
    cnpjFromBase("222222220001"),
    "Comercializadora Sintética S.A.",
    "2026-01-01",
    "2027-12-31",
    "2.5",
    "180.00",
    "600000.00",
    "bank_guarantee",
  ];
  return `${CONTRACT_COLUMNS.join(",")}\n${example.join(",")}\n`;
}

function leverageTemplate(): string {
  const example = [
    cnpjFromBase("222222220001"),
    "Comercializadora Sintética S.A.",
    "2026-11-02",
    "3",
    "",
    "Fonte pública (exemplo)",
    "https://exemplo.invalid/fa",
  ];
  return `${LEVERAGE_COLUMNS.join(",")}\n${example.join(",")}\n`;
}

export function RowErrors({ errors }: { errors: RowError[] }) {
  if (!errors.length) return null;
  return (
    <section className="section" aria-labelledby="err-h">
      <h2 id="err-h">Erros encontrados ({errors.length})</h2>
      <p>O arquivo é aceito inteiro ou rejeitado inteiro. Corrija as linhas abaixo e envie de novo.</p>
      <Table<RowError & { i: number }>
        caption="Erros por linha e campo"
        testId="import-errors"
        rowTestId="import-error-row"
        rows={errors.map((e, i) => ({ ...e, i }))}
        rowKey={(e) => String(e.i)}
        columns={[
          { header: "Linha", render: (e) => (e.line > 0 ? e.line : "Arquivo") },
          { header: "Campo", render: (e) => (e.field ? <code>{e.field}</code> : "—") },
          { header: "Problema", render: (e) => e.message },
        ]}
      />
    </section>
  );
}

function FilePicker({
  file,
  setFile,
  testId,
}: {
  file: File | null;
  setFile: (f: File | null) => void;
  testId: string;
}) {
  const id = useId();
  return (
    <div className="field">
      <label htmlFor={id}>Arquivo CSV</label>
      <input
        id={id}
        type="file"
        accept=".csv,text/csv"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        data-testid={testId}
        aria-describedby={`${id}-hint`}
      />
      <p className="hint" id={`${id}-hint`}>
        Separador vírgula (decimal com ponto) ou ponto e vírgula (decimal com vírgula). Datas AAAA-MM-DD. Até 1 MB e
        5.000 linhas.
        {file ? ` Selecionado: ${file.name}.` : ""}
      </p>
    </div>
  );
}

export function ImportContractsPage() {
  const mandate = useAsync(() => api.mandate(), "mandate");
  const history = useAsync(() => api.imports(), "imports");
  const [file, setFile] = useState<File | null>(null);
  const [accepted, setAccepted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<unknown>();
  const [localError, setLocalError] = useState("");
  const [result, setResult] = useState<ImportResult | null>(null);
  const mandateId = useId();

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(undefined);
    setLocalError("");
    setResult(null);
    if (!file) return setLocalError("Escolha um arquivo CSV.");
    if (file.size > MAX_BYTES) return setLocalError("Arquivo acima de 1 MB.");
    if (!accepted) return setLocalError("Marque a declaração de mandato para importar.");
    setBusy(true);
    try {
      const text = await file.text();
      const r = await api.importContracts(file.name.slice(0, 200), text);
      setResult(r);
      history.reload();
    } catch (err) {
      setError(err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageHeader title="Importar contratos (CSV)">
        <p>
          Clientes e unidades são criados automaticamente quando não existem (por CNPJ do cliente e nome da unidade).
        </p>
      </PageHeader>
      <section className="card section" aria-labelledby="tpl-h">
        <h2 id="tpl-h">1. Baixe o modelo</h2>
        <p>
          Colunas: <code>{CONTRACT_COLUMNS.join(", ")}</code>. <code>guarantee_brl</code> e <code>guarantee_type</code>{" "}
          são opcionais. Volume em MW médio (MWm), preço em R$/MWh, submercado SE_CO, S, NE ou N.
        </p>
        <button
          type="button"
          className="btn"
          onClick={() => downloadText("modelo-contratos.csv", contractTemplate())}
          data-testid="import-template"
        >
          Baixar modelo CSV
        </button>
      </section>
      <form className="card form section" onSubmit={(e) => void submit(e)} data-testid="import-form">
        <h2>2. Envie o arquivo</h2>
        <FilePicker file={file} setFile={setFile} testId="import-file" />
        <fieldset>
          <legend>Declaração de mandato</legend>
          {mandate.loading ? <Loading label="Carregando declaração…" /> : null}
          <ErrorBox error={mandate.error} />
          {mandate.data ? (
            <div className="checkbox">
              <input
                id={mandateId}
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                data-testid="import-mandate"
              />
              <label htmlFor={mandateId}>
                <span data-testid="mandate-text">{mandate.data.text}</span> <small>({mandate.data.text_version})</small>
              </label>
            </div>
          ) : null}
        </fieldset>
        {localError ? (
          <div className="notice notice--error" role="alert">
            {localError}
          </div>
        ) : null}
        <ErrorBox error={error} />
        <div className="actions">
          <button
            type="submit"
            className="btn btn--primary"
            disabled={busy || !accepted || !file}
            data-testid="import-submit"
          >
            {busy ? "Enviando…" : "Importar"}
          </button>
        </div>
      </form>
      {result?.accepted ? (
        <Success testId="import-success">
          Importação aceita: {result.rows_ok} contrato(s) criado(s). <Link to="/carteira/contratos">Ver contratos</Link>
          .
        </Success>
      ) : null}
      {result && !result.accepted ? (
        <div className="notice notice--error" role="alert" data-testid="import-rejected">
          Importação rejeitada: nenhum contrato foi criado.
        </div>
      ) : null}
      {result ? <RowErrors errors={result.errors} /> : null}
      <ImportHistory loading={history.loading} error={history.error} rows={history.data ?? []} />
    </>
  );
}

function ImportHistory({
  rows,
  loading,
  error,
}: {
  rows: { id: string; kind: string; filename: string; rowsOk: number; rowsRejected: number; createdAt: string }[];
  loading: boolean;
  error: unknown;
}) {
  return (
    <section className="section" aria-labelledby="hist-h">
      <h2 id="hist-h">Importações recentes</h2>
      {loading ? <Loading /> : null}
      <ErrorBox error={error} />
      {!loading && !error && rows.length === 0 ? <Empty>Nenhuma importação ainda.</Empty> : null}
      {rows.length > 0 ? (
        <Table
          caption="Importações recentes"
          rows={rows}
          rowKey={(r) => r.id}
          columns={[
            { header: `Quando (${TZ_LABEL})`, render: (r) => fmtDateTime(r.createdAt) },
            { header: "Arquivo", render: (r) => r.filename },
            { header: "Tipo", render: (r) => (r.kind === "contracts" ? "Contratos" : "Fator de Alavancagem") },
            { header: "Linhas aceitas", render: (r) => r.rowsOk },
            { header: "Linhas rejeitadas", render: (r) => r.rowsRejected },
          ]}
        />
      ) : null}
    </section>
  );
}

export function ImportLeveragePage() {
  const history = useAsync(() => api.imports(), "imports-fa");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<unknown>();
  const [localError, setLocalError] = useState("");
  const [result, setResult] = useState<LeverageImportResult | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(undefined);
    setLocalError("");
    setResult(null);
    if (!file) return setLocalError("Escolha um arquivo CSV.");
    if (file.size > MAX_BYTES) return setLocalError("Arquivo acima de 1 MB.");
    setBusy(true);
    try {
      const r = await api.importLeverage(file.name.slice(0, 200), await file.text());
      setResult(r);
      history.reload();
    } catch (err) {
      setError(err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageHeader title="Importar Fator de Alavancagem (CSV)">
        <p>
          Série semanal por fornecedor. Quando a faixa piora em relação à semana anterior, é criado um{" "}
          <strong>rascunho</strong> de evento para revisão humana; nada é publicado automaticamente.
        </p>
      </PageHeader>
      <Warning>A semântica oficial das faixas não foi verificada neste protótipo (maior = pior, de 0 a 20).</Warning>
      <section className="card section" aria-labelledby="tpl-fa-h">
        <h2 id="tpl-fa-h">Modelo</h2>
        <p>
          Colunas: <code>{LEVERAGE_COLUMNS.join(", ")}</code>. <code>value</code> é opcional.
        </p>
        <button
          type="button"
          className="btn"
          onClick={() => downloadText("modelo-fa.csv", leverageTemplate())}
          data-testid="fa-template"
        >
          Baixar modelo CSV
        </button>
      </section>
      <form className="card form section" onSubmit={(e) => void submit(e)} data-testid="fa-form">
        <FilePicker file={file} setFile={setFile} testId="fa-file" />
        {localError ? (
          <div className="notice notice--error" role="alert">
            {localError}
          </div>
        ) : null}
        <ErrorBox error={error} />
        <div className="actions">
          <button type="submit" className="btn btn--primary" disabled={busy || !file} data-testid="fa-submit">
            {busy ? "Enviando…" : "Importar"}
          </button>
        </div>
      </form>
      {result?.accepted ? (
        <Success testId="fa-success">
          Importação aceita: {result.rows_ok} linha(s). Rascunhos de evento criados:{" "}
          <strong data-testid="fa-drafts">{result.drafts_created}</strong>.{" "}
          {result.drafts_created > 0 ? <Link to="/operacao/eventos?status=draft">Revisar rascunhos</Link> : null}
        </Success>
      ) : null}
      {result && !result.accepted ? (
        <div className="notice notice--error" role="alert" data-testid="fa-rejected">
          Importação rejeitada: nada foi gravado.
        </div>
      ) : null}
      {result ? <RowErrors errors={result.errors} /> : null}
      <ImportHistory loading={history.loading} error={history.error} rows={history.data ?? []} />
    </>
  );
}
