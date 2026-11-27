import { useState, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import {
  api,
  fieldErrors,
  type AuditEvent,
  type EventCreate,
  type EventScope,
  type EventStatus,
  type EventType,
  type OperatorEvent,
  type Organization,
  type OrgStatus,
  type ReferencePrice,
  type Submarket,
} from "../api";
import { ConfirmButton } from "../components/Dialog";
import { Table } from "../components/Table";
import {
  DateTime,
  Empty,
  ErrorBox,
  EventStatusBadge,
  Loading,
  PageHeader,
  SelectField,
  SeverityBadge,
  SourceLink,
  Success,
  TextAreaField,
  TextField,
} from "../components/ui";
import { fmtBRLPerMWh, fmtCnpj, fmtDate, fmtDateTime, parseDecimal, TZ_LABEL } from "../format";
import { useAsync } from "../hooks";
import {
  EVENT_STATUS_LABEL,
  EVENT_TYPE_LABEL,
  EVENT_TYPES,
  ORG_STATUS_LABEL,
  ORG_TYPE_LABEL,
  SCOPE_LABEL,
  SEVERITY_BY_EVENT_TYPE,
  SEVERITY_LABEL,
  SUBMARKET_LABEL,
  SUBMARKETS,
} from "../labels";

// ------------------------------------------------------------------ organizações (admin)

export function OrganizationsPage() {
  const [params, setParams] = useSearchParams();
  const status = (params.get("status") ?? "pending") as OrgStatus | "all";
  const list = useAsync(() => api.organizations(status === "all" ? undefined : status), `orgs|${status}`);
  const [ok, setOk] = useState("");
  const [error, setError] = useState<unknown>();

  const change = async (o: Organization, to: Exclude<OrgStatus, "pending">) => {
    setOk("");
    setError(undefined);
    await api.setOrgStatus(o.id, to);
    setOk(`Organização "${o.name}": ${ORG_STATUS_LABEL[to].toLowerCase()}.`);
    list.reload();
  };
  const approve = async (o: Organization) => {
    try {
      await change(o, "approved");
    } catch (e) {
      setError(e);
    }
  };

  return (
    <>
      <PageHeader title="Organizações">
        <p>Aprovação manual de cadastros. Rejeitar ou suspender encerra as sessões abertas da organização.</p>
      </PageHeader>
      <div className="filters">
        <SelectField
          label="Status"
          value={status}
          onChange={(e) => setParams({ status: e.target.value }, { replace: true })}
          data-testid="org-filter-status"
        >
          <option value="pending">{ORG_STATUS_LABEL.pending}</option>
          <option value="approved">{ORG_STATUS_LABEL.approved}</option>
          <option value="rejected">{ORG_STATUS_LABEL.rejected}</option>
          <option value="suspended">{ORG_STATUS_LABEL.suspended}</option>
          <option value="all">Todas</option>
        </SelectField>
      </div>
      <Success>{ok}</Success>
      <ErrorBox error={error ?? list.error} />
      {list.loading ? <Loading /> : null}
      {list.data && list.data.length === 0 ? (
        <Empty>
          {status === "pending" ? "Nenhum cadastro aguardando aprovação." : "Nenhuma organização com este status."}
        </Empty>
      ) : null}
      {list.data && list.data.length > 0 ? (
        <Table<Organization>
          caption="Organizações"
          testId="org-list"
          rowTestId="org-row"
          rows={list.data}
          rowKey={(o) => o.id}
          columns={[
            { header: "Nome", render: (o) => <span data-testid="org-name">{o.name}</span> },
            { header: "Tipo", render: (o) => ORG_TYPE_LABEL[o.type] },
            { header: "CNPJ", render: (o) => fmtCnpj(o.cnpj) },
            { header: "Status", render: (o) => ORG_STATUS_LABEL[o.status] },
            { header: `Cadastro (${TZ_LABEL})`, render: (o) => fmtDateTime(o.createdAt) },
            {
              header: "Ações",
              actions: true,
              render: (o) =>
                o.type === "operator" ? null : (
                  <div className="row-actions">
                    {o.status !== "approved" ? (
                      <button
                        type="button"
                        className="btn btn--small btn--primary"
                        onClick={() => void approve(o)}
                        data-testid="org-approve"
                      >
                        Aprovar
                      </button>
                    ) : null}
                    {o.status === "pending" ? (
                      <ConfirmButton
                        label="Rejeitar"
                        className="btn btn--small btn--danger-outline"
                        title="Rejeitar organização?"
                        message={
                          <p>
                            <strong>{o.name}</strong> não terá acesso à plataforma e as sessões abertas serão
                            encerradas.
                          </p>
                        }
                        confirmLabel="Rejeitar"
                        danger
                        onConfirm={() => change(o, "rejected")}
                        testId="org-reject"
                      />
                    ) : null}
                    {o.status === "approved" ? (
                      <ConfirmButton
                        label="Suspender"
                        className="btn btn--small btn--danger-outline"
                        title="Suspender organização?"
                        message={
                          <p>
                            <strong>{o.name}</strong> perde o acesso imediatamente e as sessões abertas são encerradas.
                            Os dados são mantidos.
                          </p>
                        }
                        confirmLabel="Suspender"
                        danger
                        onConfirm={() => change(o, "suspended")}
                        testId="org-suspend"
                      />
                    ) : null}
                  </div>
                ),
            },
          ]}
        />
      ) : null}
    </>
  );
}

// ------------------------------------------------------------------ eventos

const EMPTY_EVENT = {
  supplier_cnpj: "",
  supplier_name: "",
  type: "judicial_recovery_filed" as EventType,
  scope: "entity" as EventScope,
  event_date: "",
  source_published_on: "",
  source_name: "",
  source_url: "",
  summary: "",
  caveat: "",
};

function EventForm({ onCreated }: { onCreated: (msg: string) => void }) {
  const suppliers = useAsync(() => api.suppliers(), "suppliers");
  const [f, setF] = useState(EMPTY_EVENT);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<unknown>();
  const fe = fieldErrors(error);
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => {
    const v = e.target.value;
    const next = { ...f, [k]: v };
    if (k === "supplier_cnpj") {
      const digits = v.replace(/\D/g, "");
      const hit = suppliers.data?.find((s) => s.cnpj === digits);
      if (hit && !f.supplier_name) next.supplier_name = hit.legalName;
    }
    setF(next);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(undefined);
    try {
      const body: EventCreate = {
        supplier_cnpj: f.supplier_cnpj,
        ...(f.supplier_name.trim() ? { supplier_name: f.supplier_name.trim() } : {}),
        type: f.type,
        scope: f.scope,
        event_date: f.event_date,
        source_published_on: f.source_published_on,
        source_name: f.source_name,
        source_url: f.source_url,
        summary: f.summary,
        caveat: f.caveat.trim() ? f.caveat.trim() : null,
      };
      const ev = await api.createEvent(body);
      setF(EMPTY_EVENT);
      onCreated(`Rascunho criado: ${ev.type_label} — ${ev.supplier.legal_name}. Revise e publique na lista abaixo.`);
    } catch (err) {
      setError(err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="card form" onSubmit={(e) => void submit(e)} data-testid="event-form">
      <h2>Novo evento (rascunho)</h2>
      <fieldset>
        <legend>Fornecedor</legend>
        <div className="grid-2">
          <TextField
            label="CNPJ do fornecedor"
            value={f.supplier_cnpj}
            onChange={set("supplier_cnpj")}
            required
            inputMode="numeric"
            list="suppliers-list"
            hint="Com ou sem pontuação. Sugestões do catálogo."
            error={fe.supplier_cnpj}
            data-testid="event-supplier-cnpj"
          />
          <TextField
            label="Razão social do fornecedor"
            value={f.supplier_name}
            onChange={set("supplier_name")}
            hint="Obrigatório se o CNPJ ainda não estiver no catálogo."
            error={fe.supplier_name}
            data-testid="event-supplier-name"
          />
        </div>
        <datalist id="suppliers-list">
          {(suppliers.data ?? []).map((s) => (
            <option key={s.id} value={s.cnpj}>
              {s.legalName}
            </option>
          ))}
        </datalist>
      </fieldset>
      <fieldset>
        <legend>Fato</legend>
        <div className="grid-2">
          <SelectField
            label="Tipo"
            value={f.type}
            onChange={set("type")}
            required
            hint={`Severidade fixa por tipo (rules@1): ${SEVERITY_LABEL[SEVERITY_BY_EVENT_TYPE[f.type]]}.`}
            data-testid="event-type"
          >
            {EVENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {EVENT_TYPE_LABEL[t]} ({SEVERITY_LABEL[SEVERITY_BY_EVENT_TYPE[t]]})
              </option>
            ))}
          </SelectField>
          <SelectField label="Abrangência" value={f.scope} onChange={set("scope")} data-testid="event-scope">
            <option value="entity">{SCOPE_LABEL.entity}</option>
            <option value="group">{SCOPE_LABEL.group}</option>
          </SelectField>
          <TextField
            label="Data do evento"
            type="date"
            value={f.event_date}
            onChange={set("event_date")}
            required
            error={fe.event_date}
            data-testid="event-date"
          />
          <TextField
            label="Data de publicação na fonte"
            type="date"
            value={f.source_published_on}
            onChange={set("source_published_on")}
            required
            error={fe.source_published_on}
            data-testid="event-source-date"
          />
          <TextField
            label="Nome da fonte"
            value={f.source_name}
            onChange={set("source_name")}
            required
            minLength={2}
            error={fe.source_name}
            data-testid="event-source-name"
          />
          <TextField
            label="URL da fonte"
            type="url"
            value={f.source_url}
            onChange={set("source_url")}
            required
            placeholder="https://"
            error={fe.source_url}
            data-testid="event-source-url"
          />
        </div>
        <TextAreaField
          label="Resumo factual"
          value={f.summary}
          onChange={set("summary")}
          required
          minLength={10}
          maxLength={4000}
          rows={3}
          hint="Somente o fato e a fonte, sem juízo de valor. Mínimo de 10 caracteres."
          error={fe.summary}
          data-testid="event-summary"
        />
        <TextAreaField
          label="Ressalva (quando aplicável)"
          value={f.caveat}
          onChange={set("caveat")}
          maxLength={2000}
          rows={2}
          hint='Ex.: "débito com exigibilidade suspensa não é inadimplência".'
          error={fe.caveat}
          data-testid="event-caveat"
        />
      </fieldset>
      <ErrorBox error={error} />
      <div className="actions">
        <button type="submit" className="btn btn--primary" disabled={busy} data-testid="event-submit">
          {busy ? "Salvando…" : "Criar rascunho"}
        </button>
      </div>
    </form>
  );
}

function EventCard({ ev, onChanged }: { ev: OperatorEvent; onChanged: (msg: string) => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<unknown>();
  const publish = async () => {
    setBusy(true);
    setError(undefined);
    try {
      const r = await api.publishEvent(ev.id);
      onChanged(
        `Evento publicado: ${r.evaluated} contrato(s) candidato(s) avaliado(s), ${r.created} alerta(s) novo(s) gerado(s).`,
      );
    } catch (e) {
      setError(e);
    } finally {
      setBusy(false);
    }
  };
  return (
    <article className="card" data-testid="op-event" data-event-id={ev.id} data-status={ev.status}>
      <h3>
        {ev.type_label} — {ev.supplier.legal_name}
      </h3>
      <div className="badges">
        <EventStatusBadge status={ev.status} /> <SeverityBadge severity={ev.severity} />{" "}
        <span className="badge badge--status" data-testid="alerts-count">
          {ev.alerts_count} alerta(s)
        </span>
      </div>
      <dl className="dl">
        <dt>CNPJ</dt>
        <dd>{fmtCnpj(ev.supplier.cnpj)}</dd>
        <dt>Abrangência</dt>
        <dd>{SCOPE_LABEL[ev.scope]}</dd>
        <dt>Data do evento</dt>
        <dd>{fmtDate(ev.event_date)}</dd>
        <dt>Fonte</dt>
        <dd>
          <SourceLink name={ev.source_name} url={ev.source_url} />, publicada em {fmtDate(ev.source_published_on)}
        </dd>
      </dl>
      <p>{ev.summary}</p>
      {ev.caveat ? (
        <div className="notice notice--warning">
          <strong>Ressalva:</strong> {ev.caveat}
        </div>
      ) : null}
      {ev.supplier_responses.length > 0 ? (
        <details>
          <summary>Respostas do fornecedor ({ev.supplier_responses.length})</summary>
          <ul className="responses">
            {ev.supplier_responses.map((r) => (
              <li key={r.created_at}>
                <blockquote>{r.body}</blockquote>
                <small>
                  <DateTime value={r.created_at} />
                </small>
              </li>
            ))}
          </ul>
        </details>
      ) : null}
      <ErrorBox error={error} />
      <div className="actions">
        {ev.status === "draft" ? (
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => void publish()}
            disabled={busy}
            data-testid="event-publish"
          >
            {busy ? "Publicando…" : "Publicar"}
          </button>
        ) : null}
        {ev.status === "published" ? (
          <ConfirmButton
            label="Retirar"
            danger
            title="Retirar evento publicado?"
            message={
              <>
                <p>
                  Alertas abertos e reconhecidos deste evento passam a <strong>retirado</strong> e nenhum alerta novo
                  será gerado. Um evento retirado não pode ser republicado.
                </p>
                <p>
                  <strong>Atenção:</strong> o que as gestoras já viram ou exportaram não é revertido.
                </p>
              </>
            }
            reasonLabel="Justificativa da retirada"
            confirmLabel="Retirar evento"
            onConfirm={async (reason) => {
              const r = await api.retractEvent(ev.id, reason);
              onChanged(`Evento retirado. ${r.alerts_retracted} alerta(s) marcado(s) como retirado(s).`);
            }}
            testId="event-retract"
          />
        ) : null}
      </div>
    </article>
  );
}

export function EventsPage() {
  const [params, setParams] = useSearchParams();
  const status = (params.get("status") ?? "") as EventStatus | "";
  const list = useAsync(() => api.adminEvents(status || undefined), `events|${status}`);
  const [ok, setOk] = useState("");
  const done = (msg: string) => {
    setOk(msg);
    list.reload();
  };
  return (
    <>
      <PageHeader title="Eventos">
        <p>
          Curadoria de fatos públicos com fonte. Fluxo: rascunho → publicado → retirado. Ao publicar, o motor gera
          alertas para os contratos afetados de todas as carteiras.
        </p>
      </PageHeader>
      <EventForm onCreated={done} />
      <Success testId="event-success">{ok}</Success>
      <section className="section" aria-labelledby="evl-h">
        <h2 id="evl-h">Eventos cadastrados</h2>
        <div className="filters">
          <SelectField
            label="Status"
            value={status}
            onChange={(e) => setParams(e.target.value ? { status: e.target.value } : {}, { replace: true })}
            data-testid="event-filter-status"
          >
            <option value="">Todos</option>
            {(["draft", "published", "retracted"] as const).map((s) => (
              <option key={s} value={s}>
                {EVENT_STATUS_LABEL[s]}
              </option>
            ))}
          </SelectField>
        </div>
        {list.loading ? <Loading /> : null}
        <ErrorBox error={list.error} />
        {list.data && list.data.length === 0 ? (
          <Empty>Nenhum evento {status ? "com este status" : "cadastrado"}. Use o formulário acima.</Empty>
        ) : null}
        <div className="stack" data-testid="op-event-list">
          {(list.data ?? []).map((ev) => (
            <EventCard key={ev.id} ev={ev} onChanged={done} />
          ))}
        </div>
      </section>
    </>
  );
}

// ------------------------------------------------------------------ preços de referência

export function ReferencePricesPage() {
  const list = useAsync(() => api.referencePrices(), "prices");
  const [f, setF] = useState({
    submarket: "SE_CO" as Submarket,
    reference_date: "",
    price: "",
    source_name: "",
    source_url: "",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<unknown>();
  const [priceErr, setPriceErr] = useState("");
  const [ok, setOk] = useState("");
  const fe = fieldErrors(error);
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF({ ...f, [k]: e.target.value });

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(undefined);
    setOk("");
    const price = parseDecimal(f.price);
    if (price === null || Number.isNaN(price) || price <= 0 || price > 5000) {
      setPriceErr("Informe um preço entre 0 e 5.000 R$/MWh.");
      return;
    }
    setPriceErr("");
    setBusy(true);
    try {
      const r = await api.addReferencePrice({
        submarket: f.submarket,
        reference_date: f.reference_date,
        price_brl_per_mwh: price,
        source_name: f.source_name,
        source_url: f.source_url,
      });
      setOk(`Preço cadastrado: ${SUBMARKET_LABEL[r.submarket]}, ${fmtBRLPerMWh(r.priceBrlPerMwh)}.`);
      setF({ ...f, price: "", reference_date: "" });
      list.reload();
    } catch (err) {
      setError(err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageHeader title="Preços de referência">
        <p>
          Usados no cálculo da exposição: vale o preço mais recente do submercado com data de referência até a data do
          cálculo. Sem preço, a exposição não é calculada.
        </p>
      </PageHeader>
      <form className="card form" onSubmit={(e) => void submit(e)} data-testid="price-form">
        <h2>Novo preço</h2>
        <div className="grid-2">
          <SelectField label="Submercado" value={f.submarket} onChange={set("submarket")} data-testid="price-submarket">
            {SUBMARKETS.map((s) => (
              <option key={s} value={s}>
                {SUBMARKET_LABEL[s]}
              </option>
            ))}
          </SelectField>
          <TextField
            label="Data de referência"
            type="date"
            value={f.reference_date}
            onChange={set("reference_date")}
            required
            error={fe.reference_date}
            data-testid="price-date"
          />
          <TextField
            label="Preço (R$/MWh)"
            inputMode="decimal"
            value={f.price}
            onChange={set("price")}
            required
            hint="Ex.: 280,00"
            error={priceErr || fe.price_brl_per_mwh}
            data-testid="price-value"
          />
          <TextField
            label="Nome da fonte"
            value={f.source_name}
            onChange={set("source_name")}
            required
            minLength={2}
            error={fe.source_name}
            data-testid="price-source-name"
          />
          <TextField
            label="URL da fonte"
            type="url"
            value={f.source_url}
            onChange={set("source_url")}
            required
            placeholder="https://"
            error={fe.source_url}
            data-testid="price-source-url"
          />
        </div>
        <ErrorBox error={error} />
        <div className="actions">
          <button type="submit" className="btn btn--primary" disabled={busy} data-testid="price-submit">
            {busy ? "Salvando…" : "Cadastrar preço"}
          </button>
        </div>
      </form>
      <Success>{ok}</Success>
      <section className="section" aria-labelledby="pr-h">
        <h2 id="pr-h">Preços cadastrados</h2>
        {list.loading ? <Loading /> : null}
        <ErrorBox error={list.error} />
        {list.data && list.data.length === 0 ? (
          <Empty>Nenhum preço cadastrado. Sem preço, alertas mostram “exposição não calculada”.</Empty>
        ) : null}
        {list.data && list.data.length > 0 ? (
          <Table<ReferencePrice>
            caption="Preços de referência"
            testId="price-list"
            rows={list.data}
            rowKey={(r) => r.id}
            columns={[
              { header: "Submercado", render: (r) => SUBMARKET_LABEL[r.submarket] },
              { header: "Data de referência", render: (r) => fmtDate(r.referenceDate) },
              { header: "Preço", render: (r) => fmtBRLPerMWh(Number(r.priceBrlPerMwh)) },
              { header: "Fonte", render: (r) => <SourceLink name={r.sourceName} url={r.sourceUrl} /> },
              { header: `Cadastrado (${TZ_LABEL})`, render: (r) => fmtDateTime(r.createdAt) },
            ]}
          />
        ) : null}
      </section>
    </>
  );
}

// ------------------------------------------------------------------ auditoria

export function AuditPage() {
  const [limit, setLimit] = useState(100);
  const list = useAsync(() => api.audit(limit), `audit|${limit}`);
  return (
    <>
      <PageHeader title="Auditoria">
        <p>Registro das ações relevantes (mais recentes primeiro).</p>
      </PageHeader>
      <div className="filters">
        <SelectField
          label="Quantidade"
          value={String(limit)}
          onChange={(e) => setLimit(Number(e.target.value))}
          data-testid="audit-limit"
        >
          {[50, 100, 200, 500].map((n) => (
            <option key={n} value={n}>
              Últimos {n}
            </option>
          ))}
        </SelectField>
        <button type="button" className="btn" onClick={list.reload}>
          Atualizar
        </button>
      </div>
      {list.loading ? <Loading /> : null}
      <ErrorBox error={list.error} />
      {list.data && list.data.length === 0 ? <Empty>Nenhum registro.</Empty> : null}
      {list.data && list.data.length > 0 ? (
        <Table<AuditEvent>
          caption="Eventos de auditoria"
          testId="audit-list"
          rows={list.data}
          rowKey={(a) => String(a.id)}
          columns={[
            { header: `Quando (${TZ_LABEL})`, render: (a) => fmtDateTime(a.at) },
            { header: "Ação", render: (a) => <code>{a.action}</code> },
            {
              header: "Alvo",
              render: (a) => (a.targetType ? `${a.targetType} ${a.targetId?.slice(0, 8) ?? ""}` : "—"),
            },
            {
              header: "Autor",
              render: (a) =>
                a.actorUserId
                  ? `usuário ${a.actorUserId.slice(0, 8)}`
                  : a.actorApiKeyId
                    ? `chave ${a.actorApiKeyId.slice(0, 8)}`
                    : "—",
            },
            { header: "Organização", render: (a) => a.orgId?.slice(0, 8) ?? "—" },
            { header: "IP", render: (a) => a.ip ?? "—" },
            {
              header: "Detalhes",
              render: (a) => (a.meta && Object.keys(a.meta).length ? <code>{JSON.stringify(a.meta)}</code> : "—"),
            },
          ]}
        />
      ) : null}
    </>
  );
}
