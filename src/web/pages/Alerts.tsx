import { useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { api, type Alert, type AlertStatus, type Exposure, type Severity } from "../api";
import { Table } from "../components/Table";
import {
  AlertStatusBadge,
  DateTime,
  Empty,
  ErrorBox,
  Loading,
  LoadMore,
  PageHeader,
  SelectField,
  SeverityBadge,
  SourceLink,
  Success,
  Warning,
} from "../components/ui";
import { fmtBRL, fmtBRLPerMWh, fmtCnpj, fmtDate, fmtHours, fmtMWh, fmtMWm, fmtPct } from "../format";
import { useAsync, usePaged } from "../hooks";
import {
  ALERT_DISCLAIMER,
  ALERT_STATUS_LABEL,
  ALERT_STATUSES,
  reasonLabel,
  SCOPE_LABEL,
  SEVERITIES,
  SEVERITY_LABEL,
} from "../labels";
import { useMe } from "../session";

// ------------------------------------------------------------------ painel

export function DashboardPage() {
  const me = useMe();
  const summary = useAsync(() => api.alertSummary(), "summary");
  const recent = useAsync(() => api.alerts({ status: "open", limit: 5 }), "recent-open");
  const count = (sev: Severity | null, st: AlertStatus | null) =>
    (summary.data ?? [])
      .filter((r) => (sev === null || r.severity === sev) && (st === null || r.status === st))
      .reduce((a, r) => a + r.n, 0);

  return (
    <>
      <PageHeader title="Painel">
        <p>
          Resumo dos alertas da carteira de <strong>{me.organization.name}</strong>. Alertas surgem quando a curadoria
          publica um evento público, com fonte, sobre um fornecedor de algum contrato seu.
        </p>
      </PageHeader>
      <section aria-labelledby="resumo-h" className="section">
        <h2 id="resumo-h">Alertas por severidade e status</h2>
        {summary.loading ? <Loading /> : null}
        <ErrorBox error={summary.error} />
        {summary.data ? (
          summary.data.length === 0 ? (
            <Empty>
              Nenhum alerta até agora. Cadastre <Link to="/carteira/contratos/novo">contratos</Link> ou{" "}
              <Link to="/carteira/importar">importe um CSV</Link> para que eventos publicados sejam cruzados com sua
              carteira.
            </Empty>
          ) : (
            <div className="table-wrap">
              <table className="table table--compact" data-testid="alert-summary">
                <caption className="visually-hidden">Quantidade de alertas por severidade e status</caption>
                <thead>
                  <tr>
                    <th scope="col">Severidade</th>
                    {ALERT_STATUSES.map((s) => (
                      <th scope="col" key={s}>
                        {ALERT_STATUS_LABEL[s]}
                      </th>
                    ))}
                    <th scope="col">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {SEVERITIES.map((sev) => (
                    <tr key={sev}>
                      <th scope="row" data-label="Severidade">
                        <SeverityBadge severity={sev} />
                      </th>
                      {ALERT_STATUSES.map((st) => (
                        <td key={st} data-label={ALERT_STATUS_LABEL[st]}>
                          <Link
                            to={`/alertas?severidade=${sev}&status=${st}`}
                            aria-label={`${count(sev, st)} alertas de severidade ${SEVERITY_LABEL[sev]} com status ${ALERT_STATUS_LABEL[st]}`}
                            data-testid={`summary-${sev}-${st}`}
                          >
                            {count(sev, st)}
                          </Link>
                        </td>
                      ))}
                      <td data-label="Total">
                        <strong>{count(sev, null)}</strong>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : null}
      </section>
      <section aria-labelledby="recentes-h" className="section">
        <h2 id="recentes-h">Alertas abertos mais recentes</h2>
        {recent.loading ? <Loading /> : null}
        <ErrorBox error={recent.error} />
        {recent.data ? (
          recent.data.data.length === 0 ? (
            <Empty>Nenhum alerta aberto no momento.</Empty>
          ) : (
            <>
              <AlertTable alerts={recent.data.data} />
              <p>
                <Link to="/alertas">Ver todos os alertas</Link>
              </p>
            </>
          )
        ) : null}
      </section>
    </>
  );
}

function AlertTable({ alerts }: { alerts: Alert[] }) {
  return (
    <Table
      caption="Alertas"
      testId="alert-list"
      rowTestId="alert-row"
      rows={alerts}
      rowKey={(a) => a.id}
      columns={[
        { header: "Severidade", render: (a) => <SeverityBadge severity={a.severity} /> },
        {
          header: "Evento",
          render: (a) => (
            <Link to={`/alertas/${a.id}`} data-testid="alert-link">
              {a.event.type_label}
            </Link>
          ),
        },
        {
          header: "Fornecedor",
          render: (a) => (
            <>
              {(a.contract.supplier ?? a.event.supplier).legal_name}
              <br />
              <small>CNPJ {fmtCnpj((a.contract.supplier ?? a.event.supplier).cnpj)}</small>
            </>
          ),
        },
        {
          header: "Cliente / unidade",
          render: (a) => (
            <>
              {a.contract.client_legal_name}
              <br />
              <small>{a.contract.site_name}</small>
            </>
          ),
        },
        { header: "Data do evento", render: (a) => fmtDate(a.event.event_date) },
        {
          header: "Exposição estimada",
          render: (a) => (a.exposure ? fmtBRL(a.exposure.replacement_cost_brl) : <small>não calculada</small>),
        },
        { header: "Status", render: (a) => <AlertStatusBadge status={a.status} /> },
      ]}
    />
  );
}

// ------------------------------------------------------------------ lista

export function AlertsPage() {
  const [params, setParams] = useSearchParams();
  const status = (params.get("status") ?? "") as AlertStatus | "";
  const severity = (params.get("severidade") ?? "") as Severity | "";
  const list = usePaged(
    (cursor) => api.alerts({ cursor, status: status || undefined, severity: severity || undefined }),
    `${status}|${severity}`,
  );
  const setFilter = (k: string, v: string) => {
    const next = new URLSearchParams(params);
    if (v) next.set(k, v);
    else next.delete(k);
    setParams(next, { replace: true });
  };
  return (
    <>
      <PageHeader title="Alertas" />
      <form className="filters" role="search" aria-label="Filtrar alertas" onSubmit={(e) => e.preventDefault()}>
        <SelectField
          label="Status"
          value={status}
          onChange={(e) => setFilter("status", e.target.value)}
          data-testid="filter-status"
        >
          <option value="">Todos</option>
          {ALERT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {ALERT_STATUS_LABEL[s]}
            </option>
          ))}
        </SelectField>
        <SelectField
          label="Severidade"
          value={severity}
          onChange={(e) => setFilter("severidade", e.target.value)}
          data-testid="filter-severity"
        >
          <option value="">Todas</option>
          {SEVERITIES.map((s) => (
            <option key={s} value={s}>
              {SEVERITY_LABEL[s]}
            </option>
          ))}
        </SelectField>
      </form>
      {list.loading ? <Loading /> : null}
      <ErrorBox error={list.error} />
      {!list.loading && !list.error && list.items.length === 0 ? (
        <Empty>
          {status || severity
            ? "Nenhum alerta com esses filtros. Remova um filtro para ver mais."
            : "Nenhum alerta ainda. Os alertas aparecem quando um evento público é publicado sobre um fornecedor da sua carteira."}
        </Empty>
      ) : null}
      {list.items.length > 0 ? <AlertTable alerts={list.items} /> : null}
      <LoadMore hasMore={list.hasMore} loading={list.loadingMore} onClick={list.loadMore} />
    </>
  );
}

// ------------------------------------------------------------------ detalhe

function ExposureBlock({ exposure, volumeFallback }: { exposure: Exposure; volumeFallback: number }) {
  // Volume usado no cálculo: derivado da energia/horas (o snapshot de volume não vem no DTO).
  const volume =
    exposure.remaining_hours > 0 ? exposure.remaining_energy_mwh / exposure.remaining_hours : volumeFallback;
  const delta = Math.max(0, exposure.reference_price_brl_per_mwh - exposure.contract_price_brl_per_mwh);
  return (
    <div className="stack" data-testid="exposure">
      <p className="big-number">
        Custo de reposição estimado: <strong>{fmtBRL(exposure.replacement_cost_brl)}</strong>
      </p>
      <p>
        Fórmula: <code data-testid="exposure-formula">{exposure.formula}</code>
      </p>
      <p className="formula-line">
        {fmtMWm(volume)} × {fmtHours(exposure.remaining_hours)} = {fmtMWh(exposure.remaining_energy_mwh)}
        <br />
        {fmtMWh(exposure.remaining_energy_mwh)} × max(0, {fmtBRLPerMWh(exposure.reference_price_brl_per_mwh)} −{" "}
        {fmtBRLPerMWh(exposure.contract_price_brl_per_mwh)}) = {fmtMWh(exposure.remaining_energy_mwh)} ×{" "}
        {fmtBRLPerMWh(delta)} = <strong>{fmtBRL(exposure.replacement_cost_brl)}</strong>
      </p>
      <dl className="dl">
        <dt>Data de cálculo</dt>
        <dd>{fmtDate(exposure.as_of)}</dd>
        <dt>Volume contratado</dt>
        <dd>{fmtMWm(volume)}</dd>
        <dt>Horas restantes</dt>
        <dd>{fmtHours(exposure.remaining_hours)}</dd>
        <dt>Energia restante</dt>
        <dd>{fmtMWh(exposure.remaining_energy_mwh)}</dd>
        <dt>Preço do contrato</dt>
        <dd>{fmtBRLPerMWh(exposure.contract_price_brl_per_mwh)}</dd>
        <dt>Preço de referência</dt>
        <dd>
          {fmtBRLPerMWh(exposure.reference_price_brl_per_mwh)} em {fmtDate(exposure.reference_price_date)} — fonte:{" "}
          <SourceLink name={exposure.reference_price_source} url={exposure.reference_price_url} />
        </dd>
        <dt>Garantia</dt>
        <dd>{exposure.guarantee_brl === null ? "Não informada" : fmtBRL(exposure.guarantee_brl)}</dd>
        <dt>Cobertura da garantia</dt>
        <dd>
          {exposure.guarantee_coverage_pct === null
            ? "Não calculada (garantia não informada)"
            : `${fmtPct(exposure.guarantee_coverage_pct)} do custo de reposição`}
        </dd>
      </dl>
      <p className="hint">
        Estimativa calculada na criação do alerta, com o preço de referência mais recente do submercado da unidade. Não
        é valor devido nem perda realizada.
      </p>
    </div>
  );
}

export function AlertDetailPage() {
  const { id = "" } = useParams();
  const me = useMe();
  const { data: alert, error, loading, setData } = useAsync(() => api.alert(id), id);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<unknown>();
  const [ok, setOk] = useState("");
  const canWrite = me.role === "owner" || me.role === "member";

  const setStatus = async (status: "open" | "acknowledged" | "resolved") => {
    setBusy(true);
    setActionError(undefined);
    setOk("");
    try {
      const a = await api.setAlertStatus(id, status);
      setData(a);
      setOk(`Status alterado para "${ALERT_STATUS_LABEL[a.status]}".`);
    } catch (e) {
      setActionError(e);
    } finally {
      setBusy(false);
    }
  };

  if (loading)
    return (
      <>
        <PageHeader title="Alerta" />
        <Loading />
      </>
    );
  if (error || !alert)
    return (
      <>
        <PageHeader title="Alerta" />
        <ErrorBox error={error} />
        <p>
          <Link to="/alertas">Voltar para a lista de alertas</Link>
        </p>
      </>
    );

  const ev = alert.event;
  const contractSupplier = alert.contract.supplier;
  return (
    <div data-testid="alert-detail">
      <p>
        <Link to="/alertas">← Alertas</Link>
      </p>
      <PageHeader title={`Alerta: ${ev.type_label}`} />
      <div className="badges">
        <SeverityBadge severity={alert.severity} /> <AlertStatusBadge status={alert.status} />
      </div>

      <div className="notice notice--info" data-testid="alert-disclaimer">
        <strong>Alerta não é inadimplência confirmada.</strong> {ALERT_DISCLAIMER}
      </div>

      {alert.status === "retracted" ? (
        <Warning title="Evento retirado pela curadoria.">
          Este alerta não muda mais de status. O que já foi visto ou exportado antes da retirada não é revertido.
          {ev.retraction_reason ? <> Motivo informado pela curadoria: {ev.retraction_reason}</> : null}
        </Warning>
      ) : null}

      <section className="card section" aria-labelledby="ev-h">
        <h2 id="ev-h">Evento público</h2>
        <dl className="dl">
          <dt>Tipo</dt>
          <dd>{ev.type_label}</dd>
          <dt>Fornecedor do evento</dt>
          <dd>
            {ev.supplier.legal_name} (CNPJ {fmtCnpj(ev.supplier.cnpj)})
          </dd>
          <dt>Abrangência</dt>
          <dd>{SCOPE_LABEL[ev.scope]}</dd>
          <dt>Data do evento</dt>
          <dd>{fmtDate(ev.event_date)}</dd>
          <dt>Fonte</dt>
          <dd>
            <SourceLink name={ev.source_name} url={ev.source_url} />, publicada em {fmtDate(ev.source_published_on)}
          </dd>
        </dl>
        <p className="summary">{ev.summary}</p>
        {ev.caveat ? (
          <div className="notice notice--warning caveat" data-testid="caveat">
            <strong>Ressalva da curadoria:</strong> {ev.caveat}
          </div>
        ) : null}
      </section>

      <section className="card section" aria-labelledby="resp-h">
        <h2 id="resp-h">Resposta do fornecedor</h2>
        {ev.supplier_responses.length === 0 ? (
          <p data-testid="no-supplier-response">O fornecedor ainda não registrou resposta a este evento.</p>
        ) : (
          <ul className="responses" data-testid="supplier-responses">
            {ev.supplier_responses.map((r) => (
              <li key={r.created_at}>
                <blockquote>{r.body}</blockquote>
                <small>
                  Enviada em <DateTime value={r.created_at} />
                </small>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card section" aria-labelledby="ct-h">
        <h2 id="ct-h">Contrato afetado</h2>
        <dl className="dl">
          <dt>Cliente</dt>
          <dd>{alert.contract.client_legal_name}</dd>
          <dt>Unidade</dt>
          <dd>{alert.contract.site_name}</dd>
          {contractSupplier ? (
            <>
              <dt>Fornecedor do contrato</dt>
              <dd>
                {contractSupplier.legal_name} (CNPJ {fmtCnpj(contractSupplier.cnpj)})
              </dd>
            </>
          ) : null}
          <dt>Vigência</dt>
          <dd>
            {fmtDate(alert.contract.start_date)} a {fmtDate(alert.contract.end_date)}
          </dd>
          <dt>Volume</dt>
          <dd>{fmtMWm(alert.contract.volume_mwm)}</dd>
        </dl>
        <p>
          <Link to={`/carteira/contratos/${alert.contract.id}`}>Ver contrato e explicação das regras</Link>
        </p>
      </section>

      <section className="card section" aria-labelledby="why-h">
        <h2 id="why-h">Por que este alerta existe</h2>
        <ul className="reasons" data-testid="alert-reasons">
          {alert.reasons.map((r) => (
            <li key={r}>{reasonLabel(r)}</li>
          ))}
        </ul>
        <p className="hint">
          Regra {alert.rule_version}. Alerta criado em <DateTime value={alert.created_at} />.
          {alert.status_changed_at ? (
            <>
              {" "}
              Último status alterado em <DateTime value={alert.status_changed_at} />.
            </>
          ) : null}
        </p>
      </section>

      <section className="card section" aria-labelledby="exp-h">
        <h2 id="exp-h">Exposição estimada</h2>
        {alert.exposure ? (
          <ExposureBlock exposure={alert.exposure} volumeFallback={alert.contract.volume_mwm} />
        ) : (
          <p data-testid="exposure-none">
            <strong>Exposição não calculada: sem preço de referência</strong> para o submercado da unidade na data do
            cálculo. Nada é estimado sem referência com fonte.
          </p>
        )}
      </section>

      {canWrite && alert.status !== "retracted" ? (
        <section className="section" aria-labelledby="act-h">
          <h2 id="act-h">Acompanhamento</h2>
          <div className="actions">
            {alert.status === "open" ? (
              <button
                type="button"
                className="btn btn--primary"
                disabled={busy}
                onClick={() => void setStatus("acknowledged")}
                data-testid="alert-ack"
              >
                Reconhecer
              </button>
            ) : null}
            {alert.status !== "resolved" ? (
              <button
                type="button"
                className="btn"
                disabled={busy}
                onClick={() => void setStatus("resolved")}
                data-testid="alert-resolve"
              >
                Resolver
              </button>
            ) : null}
            {alert.status !== "open" ? (
              <button
                type="button"
                className="btn"
                disabled={busy}
                onClick={() => void setStatus("open")}
                data-testid="alert-reopen"
              >
                Reabrir
              </button>
            ) : null}
          </div>
          <Success>{ok}</Success>
          <ErrorBox error={actionError} />
        </section>
      ) : null}
    </div>
  );
}
