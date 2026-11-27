import { useId, useState, type FormEvent } from "react";
import { api, ApiError, type PublicEvent } from "../api";
import {
  DateTime,
  Empty,
  ErrorBox,
  EventStatusBadge,
  Loading,
  PageHeader,
  SeverityBadge,
  SourceLink,
  Success,
  Warning,
} from "../components/ui";
import { fmtCnpj, fmtDate } from "../format";
import { useAsync } from "../hooks";
import { SCOPE_LABEL } from "../labels";

function ResponseForm({ event, onSent }: { event: PublicEvent; onSent: () => void }) {
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<unknown>();
  const [ok, setOk] = useState("");
  const id = useId();
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(undefined);
    setOk("");
    try {
      await api.respond(event.id, body);
      setBody("");
      setOk("Resposta registrada. Ela aparece para as gestoras com alertas deste evento.");
      onSent();
    } catch (err) {
      setError(err);
    } finally {
      setBusy(false);
    }
  };
  return (
    <form className="form" onSubmit={(e) => void submit(e)} data-testid="response-form">
      <div className="field">
        <label htmlFor={id}>Sua resposta ou contestação</label>
        <textarea
          id={id}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
          minLength={10}
          maxLength={4000}
          required
          aria-describedby={`${id}-hint`}
          data-testid="response-body"
        />
        <p className="hint" id={`${id}-hint`}>
          Texto factual, de 10 a 4.000 caracteres. Fica visível para as gestoras com alertas deste evento.
        </p>
      </div>
      <ErrorBox error={error} />
      <Success>{ok}</Success>
      <div className="actions">
        <button
          type="submit"
          className="btn btn--primary"
          disabled={busy || body.trim().length < 10}
          data-testid="response-submit"
        >
          {busy ? "Enviando…" : "Enviar resposta"}
        </button>
      </div>
    </form>
  );
}

export function SupplierEventsPage() {
  const { data, error, loading, reload } = useAsync(() => api.supplierEvents(), "supplier-events");
  const notLinked = error instanceof ApiError && error.status === 403;
  return (
    <>
      <PageHeader title="Eventos sobre minha empresa">
        <p>
          Eventos públicos curados e publicados sobre o CNPJ da sua empresa. Você pode registrar uma resposta ou
          contestação (direito de resposta). Você não vê quais carteiras têm contratos com sua empresa.
        </p>
      </PageHeader>
      {loading ? <Loading /> : null}
      {notLinked ? (
        <Warning title="Organização ainda não vinculada.">{(error as ApiError).message}</Warning>
      ) : (
        <ErrorBox error={error} />
      )}
      {data && data.length === 0 ? (
        <Empty>Nenhum evento publicado sobre sua empresa. Quando houver, ele aparecerá aqui.</Empty>
      ) : null}
      <div className="stack" data-testid="supplier-event-list">
        {(data ?? []).map((ev) => (
          <article key={ev.id} className="card" data-testid="supplier-event">
            <h2>{ev.type_label}</h2>
            <div className="badges">
              <SeverityBadge severity={ev.severity} /> <EventStatusBadge status={ev.status} />
            </div>
            <dl className="dl">
              <dt>CNPJ</dt>
              <dd>
                {ev.supplier.legal_name} ({fmtCnpj(ev.supplier.cnpj)})
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
            <p>{ev.summary}</p>
            {ev.caveat ? (
              <div className="notice notice--warning">
                <strong>Ressalva da curadoria:</strong> {ev.caveat}
              </div>
            ) : null}
            <h3>Respostas registradas</h3>
            {ev.supplier_responses.length === 0 ? (
              <p>Nenhuma resposta ainda.</p>
            ) : (
              <ul className="responses">
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
            {ev.status === "published" ? (
              <ResponseForm event={ev} onSent={reload} />
            ) : (
              <p className="hint">Evento retirado pela curadoria: não recebe novas respostas.</p>
            )}
          </article>
        ))}
      </div>
    </>
  );
}
