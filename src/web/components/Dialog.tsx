import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { ErrorBox } from "./ui";

/** Diálogo modal nativo (<dialog>): prende o foco, fecha com Esc e devolve o foco ao botão de origem. */
export function Modal({
  open,
  onClose,
  title,
  children,
  testId,
  wide,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  testId?: string;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      className={`dialog${wide ? " dialog--wide" : ""}`}
      aria-labelledby={titleId}
      onClose={onClose}
      data-testid={testId}
    >
      <div className="dialog__head">
        <h2 id={titleId}>{title}</h2>
        <button type="button" className="btn btn--ghost" onClick={onClose} aria-label="Fechar">
          ✕
        </button>
      </div>
      <div className="dialog__body">{open ? children : null}</div>
    </dialog>
  );
}

/**
 * Botão de ação destrutiva/irreversível com confirmação explícita.
 * Com `reasonLabel`, exige justificativa (mín. `reasonMin` caracteres) e a repassa a `onConfirm`.
 */
export function ConfirmButton({
  label,
  title,
  message,
  confirmLabel,
  onConfirm,
  danger,
  reasonLabel,
  reasonMin = 5,
  testId,
  className,
}: {
  label: string;
  title: string;
  message: ReactNode;
  confirmLabel: string;
  onConfirm: (reason: string) => Promise<void>;
  danger?: boolean;
  reasonLabel?: string;
  reasonMin?: number;
  testId?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<unknown>();
  const [reason, setReason] = useState("");
  const reasonId = useId();
  const close = () => {
    setOpen(false);
    setError(undefined);
    setReason("");
  };
  const reasonOk = !reasonLabel || reason.trim().length >= reasonMin;
  const run = async () => {
    setBusy(true);
    setError(undefined);
    try {
      await onConfirm(reason.trim());
      close();
    } catch (e) {
      setError(e);
    } finally {
      setBusy(false);
    }
  };
  return (
    <>
      <button
        type="button"
        className={className ?? `btn${danger ? " btn--danger-outline" : ""}`}
        onClick={() => setOpen(true)}
        data-testid={testId}
      >
        {label}
      </button>
      <Modal open={open} onClose={close} title={title} testId={testId ? `${testId}-dialog` : undefined}>
        <div className="stack">
          <div>{message}</div>
          {reasonLabel ? (
            <div className="field">
              <label htmlFor={reasonId}>
                {reasonLabel} <span aria-hidden="true">*</span>
              </label>
              <textarea
                id={reasonId}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                required
                minLength={reasonMin}
                data-testid="confirm-reason"
                aria-describedby={`${reasonId}-hint`}
              />
              <p className="hint" id={`${reasonId}-hint`}>
                Mínimo de {reasonMin} caracteres.
              </p>
            </div>
          ) : null}
          <ErrorBox error={error} />
          <div className="actions">
            <button
              type="button"
              className={`btn ${danger ? "btn--danger" : "btn--primary"}`}
              onClick={() => void run()}
              disabled={busy || !reasonOk}
              data-testid="confirm-ok"
            >
              {busy ? "Aguarde…" : confirmLabel}
            </button>
            <button type="button" className="btn" onClick={close} data-testid="confirm-cancel">
              Cancelar
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
