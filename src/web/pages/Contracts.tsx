import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  api,
  ApiError,
  fieldErrors,
  type Contract,
  type ContractCreate,
  type ContractPatch,
  type GuaranteeType,
} from "../api";
import { ConfirmButton, Modal } from "../components/Dialog";
import { Table } from "../components/Table";
import {
  Empty,
  ErrorBox,
  Loading,
  LoadMore,
  PageHeader,
  SelectField,
  SeverityBadge,
  Success,
  TextAreaField,
  TextField,
  Warning,
} from "../components/ui";
import { fmtBRL, fmtBRLPerMWh, fmtCnpj, fmtDate, fmtMWm, parseDecimal } from "../format";
import { useAsync, usePaged } from "../hooks";
import { EVENT_TYPE_LABEL, GUARANTEE_LABEL, GUARANTEE_TYPES, RULE_TITLE, SUBMARKET_LABEL } from "../labels";
import { useMe } from "../session";
import { canWritePortfolio, useLookups } from "./Portfolio";

// ------------------------------------------------------------------ explicação

export function ExplanationView({ contractId }: { contractId: string }) {
  const { data, error, loading } = useAsync(() => api.explanation(contractId), contractId);
  if (loading) return <Loading label="Avaliando regras…" />;
  if (error || !data) return <ErrorBox error={error} />;
  return (
    <div className="stack" data-testid="explanation">
      <p data-testid="explanation-summary">
        <strong>{data.summary}</strong>
      </p>
      <p className="hint">
        Um alerta só é gerado quando as quatro condições (C1 a C4) são atendidas. Regra {data.rule_version}.
      </p>
      {data.evaluated_events.map((ev) => (
        <article key={ev.event_id} className="card card--flat" data-testid="explanation-event">
          <h3>
            {EVENT_TYPE_LABEL[ev.event_type]} — {fmtDate(ev.event_date)}
          </h3>
          <p>
            <SeverityBadge severity={ev.severity} /> CNPJ do evento {fmtCnpj(ev.supplier_cnpj)}.{" "}
            {ev.match ? (
              <strong className="ok-text">Gera alerta para este contrato.</strong>
            ) : (
              <strong className="no-text">Não gera alerta para este contrato.</strong>
            )}
          </p>
          <ul className="checks">
            {ev.checks.map((c) => (
              <li key={c.rule} className={c.passed ? "check check--pass" : "check check--fail"} data-rule={c.rule}>
                <span className="check__mark" aria-hidden="true">
                  {c.passed ? "✓" : "✗"}
                </span>
                <span>
                  <strong>
                    {c.rule}. {RULE_TITLE[c.rule]}
                  </strong>{" "}
                  <span className="check__verdict">{c.passed ? "Sim." : "Não."}</span> {c.detail}
                </span>
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}

function ExplainButton({ contract }: { contract: Contract }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className="btn btn--small" onClick={() => setOpen(true)} data-testid="contract-explain">
        Por que (não) há alerta?
      </button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={`Por que (não) há alerta? — ${contract.supplier.legal_name}`}
        testId="explanation-dialog"
        wide
      >
        <ExplanationView contractId={contract.id} />
      </Modal>
    </>
  );
}

// ------------------------------------------------------------------ lista

export function ContractsPage() {
  const me = useMe();
  const canWrite = canWritePortfolio(me.role);
  const [params, setParams] = useSearchParams();
  const clientFilter = params.get("cliente") ?? "";
  const lookups = useLookups();
  const list = usePaged(
    (cursor) => api.contracts({ cursor, client_id: clientFilter || undefined }),
    `contracts|${clientFilter}`,
  );
  const [ok, setOk] = useState("");

  const remove = async (c: Contract) => {
    await api.deleteContract(c.id);
    setOk(`Contrato com ${c.supplier.legal_name} excluído. Ele deixa de ser monitorado.`);
    list.reload();
  };

  return (
    <>
      <PageHeader title="Contratos">
        <p>Contratos de compra de energia da carteira. O fornecedor é identificado pelo CNPJ.</p>
      </PageHeader>
      <div className="toolbar">
        {canWrite ? (
          <Link className="btn btn--primary" to="/carteira/contratos/novo" data-testid="contract-new">
            Novo contrato
          </Link>
        ) : null}
        <Link className="btn" to="/carteira/importar">
          Importar CSV
        </Link>
      </div>
      {lookups.data && lookups.data.clients.length > 0 ? (
        <div className="filters">
          <SelectField
            label="Filtrar por cliente"
            value={clientFilter}
            onChange={(e) => {
              const next = new URLSearchParams(params);
              if (e.target.value) next.set("cliente", e.target.value);
              else next.delete("cliente");
              setParams(next, { replace: true });
            }}
            data-testid="contract-filter-client"
          >
            <option value="">Todos os clientes</option>
            {lookups.data.clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.legal_name}
              </option>
            ))}
          </SelectField>
        </div>
      ) : null}
      <Success>{ok}</Success>
      {list.loading ? <Loading /> : null}
      <ErrorBox error={list.error ?? lookups.error} />
      {!list.loading && !list.error && list.items.length === 0 ? (
        <Empty>
          Nenhum contrato. Crie um <Link to="/carteira/contratos/novo">novo contrato</Link> ou{" "}
          <Link to="/carteira/importar">importe um CSV</Link>.
        </Empty>
      ) : null}
      {list.items.length > 0 ? (
        <Table<Contract>
          caption="Contratos"
          testId="contract-list"
          rowTestId="contract-row"
          rows={list.items}
          rowKey={(c) => c.id}
          columns={[
            {
              header: "Cliente / unidade",
              render: (c) => (
                <>
                  {lookups.data?.clientById.get(c.client_id)?.legal_name ?? "—"}
                  <br />
                  <small>{lookups.data?.siteById.get(c.site_id)?.name ?? "—"}</small>
                </>
              ),
            },
            {
              header: "Fornecedor",
              render: (c) => (
                <>
                  {c.supplier.legal_name}
                  <br />
                  <small>CNPJ {fmtCnpj(c.supplier.cnpj)}</small>
                </>
              ),
            },
            { header: "Vigência", render: (c) => `${fmtDate(c.start_date)} a ${fmtDate(c.end_date)}` },
            { header: "Volume", render: (c) => fmtMWm(c.volume_mwm) },
            { header: "Preço", render: (c) => fmtBRLPerMWh(c.price_brl_per_mwh) },
            {
              header: "Garantia",
              render: (c) => (c.guarantee_brl === null ? GUARANTEE_LABEL[c.guarantee_type] : fmtBRL(c.guarantee_brl)),
            },
            {
              header: "Ações",
              actions: true,
              render: (c) => (
                <div className="row-actions">
                  <ExplainButton contract={c} />
                  <Link className="btn btn--small" to={`/carteira/contratos/${c.id}`} data-testid="contract-edit">
                    {canWrite ? "Editar" : "Ver"}
                  </Link>
                  {canWrite ? (
                    <ConfirmButton
                      label="Excluir"
                      className="btn btn--small btn--danger-outline"
                      title="Excluir contrato?"
                      message={
                        <p>
                          O contrato com <strong>{c.supplier.legal_name}</strong> ({fmtDate(c.start_date)} a{" "}
                          {fmtDate(c.end_date)}) deixa de aparecer nas listas, na API e no monitoramento. A trilha de
                          auditoria é mantida.
                        </p>
                      }
                      confirmLabel="Excluir contrato"
                      danger
                      onConfirm={() => remove(c)}
                      testId="contract-delete"
                    />
                  ) : null}
                </div>
              ),
            },
          ]}
        />
      ) : null}
      <LoadMore hasMore={list.hasMore} loading={list.loadingMore} onClick={list.loadMore} />
    </>
  );
}

// ------------------------------------------------------------------ formulário

interface FormState {
  client_id: string;
  site_id: string;
  supplier_cnpj: string;
  supplier_name: string;
  start_date: string;
  end_date: string;
  volume_mwm: string;
  price_brl_per_mwh: string;
  guarantee_brl: string;
  guarantee_type: GuaranteeType | "";
  notes: string;
}

const numStr = (n: number | null) => (n === null ? "" : String(n).replace(".", ","));

function fromContract(c: Contract): FormState {
  return {
    client_id: c.client_id,
    site_id: c.site_id,
    supplier_cnpj: c.supplier.cnpj,
    supplier_name: c.supplier.legal_name,
    start_date: c.start_date,
    end_date: c.end_date,
    volume_mwm: numStr(c.volume_mwm),
    price_brl_per_mwh: numStr(c.price_brl_per_mwh),
    guarantee_brl: numStr(c.guarantee_brl),
    guarantee_type: c.guarantee_type,
    notes: c.notes ?? "",
  };
}

const EMPTY: FormState = {
  client_id: "",
  site_id: "",
  supplier_cnpj: "",
  supplier_name: "",
  start_date: "",
  end_date: "",
  volume_mwm: "",
  price_brl_per_mwh: "",
  guarantee_brl: "",
  guarantee_type: "",
  notes: "",
};

function ContractForm({
  initial,
  existing,
  onSaved,
}: {
  initial: FormState;
  existing?: Contract;
  onSaved?: (c: Contract) => void;
}) {
  const me = useMe();
  const canWrite = canWritePortfolio(me.role);
  const navigate = useNavigate();
  const lookups = useLookups();
  const [f, setF] = useState<FormState>(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<unknown>();
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});
  const [overlap, setOverlap] = useState<string | null>(null);
  const fe = { ...fieldErrors(error), ...localErrors };
  const set = (k: keyof FormState) => (e: { target: { value: string } }) => setF({ ...f, [k]: e.target.value });

  const sites = lookups.data?.sites ?? [];
  const clients = lookups.data?.clients ?? [];
  const site = lookups.data?.siteById.get(f.site_id);
  const clientId = f.client_id || site?.client_id || "";
  const sitesOfClient = sites.filter((s) => !clientId || s.client_id === clientId);

  const parseNumbers = () => {
    const errs: Record<string, string> = {};
    const volume = parseDecimal(f.volume_mwm);
    const price = parseDecimal(f.price_brl_per_mwh);
    const guarantee = parseDecimal(f.guarantee_brl);
    if (volume === null || Number.isNaN(volume) || volume <= 0)
      errs.volume_mwm = "Informe o volume em MW médio (número maior que zero).";
    else if (volume > 1000) errs.volume_mwm = "Acima de 1.000 MWm: parece estar em MWh. Informe a média em MW (MWm).";
    if (price === null || Number.isNaN(price) || price < 0 || price > 5000)
      errs.price_brl_per_mwh = "Informe o preço em R$/MWh (0 a 5.000).";
    if (guarantee !== null && (Number.isNaN(guarantee) || guarantee < 0)) errs.guarantee_brl = "Valor em R$ inválido.";
    if (f.start_date && f.end_date && f.end_date < f.start_date) errs.end_date = "Fim anterior ao início.";
    setLocalErrors(errs);
    if (Object.keys(errs).length) return null;
    return { volume: volume!, price: price!, guarantee };
  };

  const submit = async (confirmOverlap = false) => {
    setError(undefined);
    const n = parseNumbers();
    if (!n) return;
    setBusy(true);
    try {
      if (existing) {
        const patch: ContractPatch = {
          start_date: f.start_date,
          end_date: f.end_date,
          volume_mwm: n.volume,
          price_brl_per_mwh: n.price,
          guarantee_brl: n.guarantee,
          notes: f.notes.trim() ? f.notes.trim() : null,
          ...(f.guarantee_type ? { guarantee_type: f.guarantee_type } : {}),
        };
        const updated = await api.updateContract(existing.id, patch);
        onSaved?.(updated);
      } else {
        const body: ContractCreate = {
          site_id: f.site_id,
          supplier_cnpj: f.supplier_cnpj,
          ...(f.supplier_name.trim() ? { supplier_name: f.supplier_name.trim() } : {}),
          start_date: f.start_date,
          end_date: f.end_date,
          volume_mwm: n.volume,
          price_brl_per_mwh: n.price,
          guarantee_brl: n.guarantee,
          ...(f.guarantee_type ? { guarantee_type: f.guarantee_type } : {}),
          notes: f.notes.trim() ? f.notes.trim() : null,
          ...(confirmOverlap ? { confirm_overlap: true } : {}),
        };
        const c = await api.createContract(body);
        setOverlap(null);
        navigate(`/carteira/contratos/${c.id}`, {
          state: { created: true, warnings: c.warnings },
        });
      }
    } catch (err) {
      if (err instanceof ApiError && err.status === 409 && !existing) {
        setOverlap(err.message);
      } else {
        setError(err);
      }
    } finally {
      setBusy(false);
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void submit(false);
  };

  if (lookups.loading) return <Loading />;
  if (lookups.error) return <ErrorBox error={lookups.error} />;
  if (!existing && sites.length === 0)
    return (
      <Empty>
        Para criar um contrato, cadastre antes um <Link to="/carteira/clientes">cliente</Link> e uma{" "}
        <Link to="/carteira/unidades">unidade</Link>.
      </Empty>
    );

  const readOnly = !canWrite;
  return (
    <form className="card form" onSubmit={onSubmit} data-testid="contract-form">
      <fieldset disabled={readOnly}>
        <legend>Onde e com quem</legend>
        {existing ? (
          <dl className="dl">
            <dt>Cliente</dt>
            <dd>{lookups.data?.clientById.get(existing.client_id)?.legal_name ?? "—"}</dd>
            <dt>Unidade</dt>
            <dd>
              {site?.name ?? "—"}
              {site ? ` (${SUBMARKET_LABEL[site.submarket]})` : ""}
            </dd>
            <dt>Fornecedor</dt>
            <dd>
              {existing.supplier.legal_name} (CNPJ {fmtCnpj(existing.supplier.cnpj)})
            </dd>
          </dl>
        ) : (
          <>
            <SelectField
              label="Cliente"
              value={clientId}
              onChange={(e) => setF({ ...f, client_id: e.target.value, site_id: "" })}
              data-testid="contract-client"
            >
              <option value="">Todos</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.legal_name}
                </option>
              ))}
            </SelectField>
            <SelectField
              label="Unidade"
              value={f.site_id}
              onChange={set("site_id")}
              required
              error={fe.site_id}
              data-testid="contract-site"
            >
              <option value="">Selecione…</option>
              {sitesOfClient.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} — {lookups.data?.clientById.get(s.client_id)?.legal_name} ({s.submarket})
                </option>
              ))}
            </SelectField>
            <TextField
              label="CNPJ do fornecedor"
              value={f.supplier_cnpj}
              onChange={set("supplier_cnpj")}
              required
              inputMode="numeric"
              hint="Com ou sem pontuação."
              error={fe.supplier_cnpj}
              data-testid="contract-supplier-cnpj"
            />
            <TextField
              label="Razão social do fornecedor"
              value={f.supplier_name}
              onChange={set("supplier_name")}
              hint="Obrigatório se o fornecedor ainda não estiver no catálogo."
              error={fe.supplier_name}
              data-testid="contract-supplier-name"
            />
          </>
        )}
      </fieldset>
      <fieldset disabled={readOnly}>
        <legend>Condições</legend>
        <div className="grid-2">
          <TextField
            label="Início"
            type="date"
            value={f.start_date}
            onChange={set("start_date")}
            required
            error={fe.start_date}
            data-testid="contract-start"
          />
          <TextField
            label="Fim (inclusivo)"
            type="date"
            value={f.end_date}
            onChange={set("end_date")}
            required
            error={fe.end_date}
            data-testid="contract-end"
          />
          <TextField
            label="Volume (MWm)"
            inputMode="decimal"
            value={f.volume_mwm}
            onChange={set("volume_mwm")}
            required
            hint="MW médio, não MWh. Ex.: 2,000 MWm."
            error={fe.volume_mwm}
            data-testid="contract-volume"
          />
          <TextField
            label="Preço (R$/MWh)"
            inputMode="decimal"
            value={f.price_brl_per_mwh}
            onChange={set("price_brl_per_mwh")}
            required
            hint="Ex.: 180,00"
            error={fe.price_brl_per_mwh}
            data-testid="contract-price"
          />
          <TextField
            label="Garantia (R$, opcional)"
            inputMode="decimal"
            value={f.guarantee_brl}
            onChange={set("guarantee_brl")}
            hint="Ex.: 600000,00"
            error={fe.guarantee_brl}
            data-testid="contract-guarantee"
          />
          <SelectField
            label="Tipo de garantia"
            value={f.guarantee_type}
            onChange={set("guarantee_type")}
            error={fe.guarantee_type}
            data-testid="contract-guarantee-type"
          >
            <option value="">Automático (sem garantia, ou "outra" se houver valor)</option>
            {GUARANTEE_TYPES.map((g) => (
              <option key={g} value={g}>
                {GUARANTEE_LABEL[g]}
              </option>
            ))}
          </SelectField>
        </div>
        <TextAreaField
          label="Observações (opcional)"
          value={f.notes}
          onChange={set("notes")}
          rows={3}
          maxLength={2000}
          data-testid="contract-notes"
        />
      </fieldset>
      {overlap ? (
        <div className="notice notice--warning" role="alert" data-testid="contract-overlap">
          <p>
            <strong>Possível duplicidade.</strong> {overlap}
          </p>
          <div className="actions">
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => void submit(true)}
              disabled={busy}
              data-testid="contract-confirm-overlap"
            >
              Confirmar mesmo assim
            </button>
            <button type="button" className="btn" onClick={() => setOverlap(null)}>
              Revisar dados
            </button>
          </div>
        </div>
      ) : null}
      <ErrorBox error={error} testId="contract-error" />
      {Object.keys(localErrors).length > 0 ? (
        <div className="notice notice--error" role="alert">
          Corrija os campos destacados.
        </div>
      ) : null}
      {canWrite ? (
        <div className="actions">
          <button type="submit" className="btn btn--primary" disabled={busy} data-testid="contract-submit">
            {busy ? "Salvando…" : existing ? "Salvar alterações" : "Criar contrato"}
          </button>
          <Link className="btn" to="/carteira/contratos">
            Cancelar
          </Link>
        </div>
      ) : null}
    </form>
  );
}

export function ContractNewPage() {
  const [params] = useSearchParams();
  const initial = { ...EMPTY, site_id: params.get("unidade") ?? "" };
  return (
    <>
      <p>
        <Link to="/carteira/contratos">← Contratos</Link>
      </p>
      <PageHeader title="Novo contrato" />
      <ContractForm initial={initial} />
    </>
  );
}

export function ContractEditPage() {
  const { id = "" } = useParams();
  const { data, error, loading, setData } = useAsync(() => api.contract(id), id);
  const location = useLocation();
  const state = location.state as { created?: boolean; warnings?: string[] } | null;
  const [saved, setSaved] = useState("");
  return (
    <>
      <p>
        <Link to="/carteira/contratos">← Contratos</Link>
      </p>
      <PageHeader title="Contrato" />
      {state?.created ? (
        <Success testId="contract-created">
          Contrato criado. Eventos já publicados sobre este fornecedor foram avaliados.
          {state.warnings?.length ? ` Aviso: ${state.warnings.join(" ")}` : ""}
        </Success>
      ) : null}
      {loading ? <Loading /> : null}
      <ErrorBox error={error} />
      {data ? (
        <>
          {data.warnings.length ? <Warning>{data.warnings.join(" ")}</Warning> : null}
          <ContractForm
            key={data.updated_at}
            initial={fromContract(data)}
            existing={data}
            onSaved={(c) => {
              setData(c);
              setSaved("Contrato atualizado. Eventos publicados foram reavaliados para este contrato.");
            }}
          />
          <Success testId="contract-success">{saved}</Success>
          <section className="card section" aria-labelledby="exp-h" id="por-que">
            <h2 id="exp-h">Por que (não) há alerta?</h2>
            <ExplanationView key={data.updated_at} contractId={data.id} />
          </section>
        </>
      ) : null}
    </>
  );
}
