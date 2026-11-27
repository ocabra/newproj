import {
  useEffect,
  useId,
  useRef,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import { errorMessage, fieldErrors, type AlertStatus, type EventStatus, type Severity } from "../api";
import { fmtDateTime, TZ_LABEL } from "../format";
import { ALERT_STATUS_LABEL, EVENT_STATUS_LABEL, SEVERITY_LABEL } from "../labels";

export function PageHeader({ title, children }: { title: string; children?: ReactNode }) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    document.title = `${title} · Radar de Fornecedores`;
    ref.current?.focus();
  }, [title]);
  return (
    <div className="page-header">
      <h1 ref={ref} tabIndex={-1}>
        {title}
      </h1>
      {children ? <div className="page-header__intro">{children}</div> : null}
    </div>
  );
}

export function Loading({ label = "Carregando…" }: { label?: string }) {
  return (
    <p className="loading" role="status" data-testid="loading">
      <span className="spinner" aria-hidden="true" /> {label}
    </p>
  );
}

/** Mensagem de erro da API (aria-live assertivo). */
export function ErrorBox({ error, testId = "error" }: { error: unknown; testId?: string }) {
  if (!error) return null;
  const fields = fieldErrors(error);
  const list = Object.entries(fields).filter(([k]) => k !== "_");
  return (
    <div className="notice notice--error" role="alert" data-testid={testId}>
      <strong>Não foi possível concluir.</strong> {errorMessage(error)}
      {list.length > 0 ? (
        <ul>
          {list.map(([k, v]) => (
            <li key={k}>
              <code>{k}</code>: {v}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export function Success({ children, testId = "success" }: { children: ReactNode; testId?: string }) {
  if (!children) return null;
  return (
    <div className="notice notice--success" role="status" data-testid={testId}>
      {children}
    </div>
  );
}

export function Warning({ children, title }: { children: ReactNode; title?: string }) {
  return (
    <div className="notice notice--warning">
      {title ? <strong>{title} </strong> : null}
      {children}
    </div>
  );
}

export function Empty({ children, testId = "empty" }: { children: ReactNode; testId?: string }) {
  return (
    <div className="empty" data-testid={testId}>
      {children}
    </div>
  );
}

interface FieldProps {
  label: string;
  hint?: ReactNode;
  error?: string;
  required?: boolean;
}

function FieldWrap({ id, label, hint, error, required, children }: FieldProps & { id: string; children: ReactNode }) {
  return (
    <div className={`field${error ? " field--invalid" : ""}`}>
      <label htmlFor={id}>
        {label}
        {required ? (
          <span className="req" aria-hidden="true">
            {" "}
            *
          </span>
        ) : null}
      </label>
      {children}
      {hint ? (
        <p className="hint" id={`${id}-hint`}>
          {hint}
        </p>
      ) : null}
      {error ? (
        <p className="field-error" id={`${id}-err`}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

const describedBy = (id: string, hint: unknown, error: unknown) =>
  [hint ? `${id}-hint` : "", error ? `${id}-err` : ""].filter(Boolean).join(" ") || undefined;

export function TextField({
  label,
  hint,
  error,
  required,
  ...rest
}: FieldProps & Omit<InputHTMLAttributes<HTMLInputElement>, "id">) {
  const id = useId();
  return (
    <FieldWrap id={id} label={label} hint={hint} error={error} required={required}>
      <input
        id={id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        {...rest}
      />
    </FieldWrap>
  );
}

export function SelectField({
  label,
  hint,
  error,
  required,
  children,
  ...rest
}: FieldProps & Omit<SelectHTMLAttributes<HTMLSelectElement>, "id">) {
  const id = useId();
  return (
    <FieldWrap id={id} label={label} hint={hint} error={error} required={required}>
      <select
        id={id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        {...rest}
      >
        {children}
      </select>
    </FieldWrap>
  );
}

export function TextAreaField({
  label,
  hint,
  error,
  required,
  ...rest
}: FieldProps & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id">) {
  const id = useId();
  return (
    <FieldWrap id={id} label={label} hint={hint} error={error} required={required}>
      <textarea
        id={id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        {...rest}
      />
    </FieldWrap>
  );
}

export function SeverityBadge({ severity }: { severity: Severity }) {
  const icon = severity === "critical" ? "▲" : severity === "high" ? "●" : "i";
  return (
    <span className={`badge badge--${severity}`} data-testid="severity-badge" data-severity={severity}>
      <span aria-hidden="true">{icon} </span>
      Severidade: {SEVERITY_LABEL[severity]}
    </span>
  );
}

export function AlertStatusBadge({ status }: { status: AlertStatus }) {
  return (
    <span className={`badge badge--status badge--st-${status}`} data-testid="alert-status" data-status={status}>
      {ALERT_STATUS_LABEL[status]}
    </span>
  );
}

export function EventStatusBadge({ status }: { status: EventStatus }) {
  return (
    <span className={`badge badge--status badge--ev-${status}`} data-testid="event-status" data-status={status}>
      {EVENT_STATUS_LABEL[status]}
    </span>
  );
}

export function DateTime({ value }: { value: string | null | undefined }) {
  if (!value) return <>—</>;
  return (
    <time dateTime={value}>
      {fmtDateTime(value)} <span className="tz">({TZ_LABEL})</span>
    </time>
  );
}

export function SourceLink({ name, url }: { name: string; url: string }) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" data-testid="source-link">
      {name}
      <span className="visually-hidden"> (abre em nova aba)</span>
      <span aria-hidden="true"> ↗</span>
    </a>
  );
}

export function LoadMore({ hasMore, loading, onClick }: { hasMore: boolean; loading: boolean; onClick: () => void }) {
  if (!hasMore) return null;
  return (
    <div className="load-more">
      <button type="button" className="btn" onClick={onClick} disabled={loading} data-testid="load-more">
        {loading ? "Carregando…" : "Carregar mais"}
      </button>
    </div>
  );
}

export function CopyButton({ text, label = "Copiar", testId }: { text: string; label?: string; testId?: string }) {
  const [copied, setCopied] = useState<"" | "ok" | "fail">("");
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied("ok");
    } catch {
      setCopied("fail");
    }
  };
  return (
    <>
      <button type="button" className="btn" onClick={() => void copy()} data-testid={testId}>
        {label}
      </button>
      <span role="status" className="copy-status">
        {copied === "ok" ? "Copiado." : copied === "fail" ? "Não foi possível copiar; selecione o texto e copie." : ""}
      </span>
    </>
  );
}
