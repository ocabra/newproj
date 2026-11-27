import { useId, useState, type FormEvent } from "react";
import { api, fieldErrors, type ApiKey, type Invitation, type Role, type Scope } from "../api";
import { ConfirmButton } from "../components/Dialog";
import { Table } from "../components/Table";
import {
  CopyButton,
  DateTime,
  Empty,
  ErrorBox,
  Loading,
  PageHeader,
  SelectField,
  Success,
  TextField,
} from "../components/ui";
import { fmtDateTime, TZ_LABEL } from "../format";
import { useAsync } from "../hooks";
import { ROLE_LABEL, SCOPE_DESC, SCOPES } from "../labels";
import { useMe } from "../session";

// ------------------------------------------------------------------ chaves de API

export function ApiKeysPage() {
  const keys = useAsync(() => api.apiKeys(), "api-keys");
  const [name, setName] = useState("");
  const [scopes, setScopes] = useState<Scope[]>(["portfolio:read", "alerts:read"]);
  const [days, setDays] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<unknown>();
  const [created, setCreated] = useState<(ApiKey & { key: string }) | null>(null);
  const [ok, setOk] = useState("");
  const fe = fieldErrors(error);
  const secretId = useId();

  const toggle = (s: Scope) => setScopes((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(undefined);
    setOk("");
    setCreated(null);
    try {
      const d = days.trim() ? Number(days) : undefined;
      const k = await api.createApiKey({ name, scopes, ...(d ? { expires_in_days: d } : {}) });
      setCreated(k);
      setName("");
      keys.reload();
    } catch (err) {
      setError(err);
    } finally {
      setBusy(false);
    }
  };

  const revoke = async (k: ApiKey) => {
    await api.revokeApiKey(k.id);
    setOk(`Chave "${k.name}" revogada. Requisições com ela passam a receber 401.`);
    keys.reload();
  };

  return (
    <>
      <PageHeader title="Chaves de API">
        <p>
          Chaves para a API B2B (<code>/api/v1</code>), com escopos.{" "}
          <a href="/api/docs" target="_blank" rel="noopener noreferrer" data-testid="api-docs-link">
            Documentação da API (OpenAPI)<span className="visually-hidden"> (abre em nova aba)</span>
          </a>
          .
        </p>
      </PageHeader>
      <form className="card form" onSubmit={(e) => void submit(e)} data-testid="apikey-form">
        <h2>Nova chave</h2>
        <TextField
          label="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          minLength={2}
          hint="Ex.: Integração planilha de risco"
          error={fe.name}
          data-testid="apikey-name"
        />
        <fieldset>
          <legend>Escopos</legend>
          {SCOPES.map((s) => (
            <div className="checkbox" key={s}>
              <input
                type="checkbox"
                id={`scope-${s}`}
                checked={scopes.includes(s)}
                onChange={() => toggle(s)}
                data-testid={`apikey-scope-${s}`}
              />
              <label htmlFor={`scope-${s}`}>
                <code>{s}</code> — {SCOPE_DESC[s]}
              </label>
            </div>
          ))}
          {fe.scopes ? <p className="field-error">{fe.scopes}</p> : null}
        </fieldset>
        <TextField
          label="Expira em (dias, opcional)"
          type="number"
          min={1}
          max={730}
          value={days}
          onChange={(e) => setDays(e.target.value)}
          hint="Vazio = sem expiração. Máximo 730."
          error={fe.expires_in_days}
          data-testid="apikey-days"
        />
        <ErrorBox error={error} />
        <div className="actions">
          <button
            type="submit"
            className="btn btn--primary"
            disabled={busy || scopes.length === 0}
            data-testid="apikey-submit"
          >
            {busy ? "Gerando…" : "Gerar chave"}
          </button>
        </div>
      </form>
      {created ? (
        <div className="notice notice--warning secret" role="status" data-testid="apikey-created">
          <p>
            <strong>Copie a chave agora: ela é exibida uma única vez.</strong> Depois de sair desta tela, só será
            possível revogá-la e gerar outra.
          </p>
          <label htmlFor={secretId}>Chave “{created.name}”</label>
          <input
            id={secretId}
            readOnly
            value={created.key}
            className="mono"
            onFocus={(e) => e.target.select()}
            data-testid="apikey-secret"
          />
          <div className="actions">
            <CopyButton text={created.key} label="Copiar chave" testId="apikey-copy" />
            <button type="button" className="btn" onClick={() => setCreated(null)}>
              Já copiei; ocultar
            </button>
          </div>
        </div>
      ) : null}
      <Success>{ok}</Success>
      <section className="section" aria-labelledby="keys-h">
        <h2 id="keys-h">Chaves existentes</h2>
        {keys.loading ? <Loading /> : null}
        <ErrorBox error={keys.error} />
        {keys.data && keys.data.length === 0 ? <Empty>Nenhuma chave. Gere a primeira acima.</Empty> : null}
        {keys.data && keys.data.length > 0 ? (
          <Table<ApiKey>
            caption="Chaves de API"
            testId="apikey-list"
            rowTestId="apikey-row"
            rows={keys.data}
            rowKey={(k) => k.id}
            columns={[
              { header: "Nome", render: (k) => k.name },
              { header: "Prefixo", render: (k) => <code>rdf_{k.prefix}_…</code> },
              { header: "Escopos", render: (k) => k.scopes.join(", ") },
              { header: `Criada (${TZ_LABEL})`, render: (k) => fmtDateTime(k.created_at) },
              { header: "Expira", render: (k) => (k.expires_at ? fmtDateTime(k.expires_at) : "Não expira") },
              { header: "Último uso", render: (k) => (k.last_used_at ? fmtDateTime(k.last_used_at) : "Nunca") },
              {
                header: "Situação",
                render: (k) =>
                  k.revoked_at ? (
                    <span className="badge badge--status badge--st-retracted">Revogada</span>
                  ) : k.expires_at && new Date(k.expires_at) < new Date() ? (
                    <span className="badge badge--status badge--st-resolved">Expirada</span>
                  ) : (
                    <span className="badge badge--status badge--st-open">Ativa</span>
                  ),
              },
              {
                header: "Ações",
                actions: true,
                render: (k) =>
                  k.revoked_at ? null : (
                    <ConfirmButton
                      label="Revogar"
                      className="btn btn--small btn--danger-outline"
                      title="Revogar chave de API?"
                      message={
                        <p>
                          A chave <strong>{k.name}</strong> deixa de funcionar imediatamente. Integrações que a usam
                          passam a receber erro 401. Esta ação não pode ser desfeita.
                        </p>
                      }
                      confirmLabel="Revogar chave"
                      danger
                      onConfirm={() => revoke(k)}
                      testId="apikey-revoke"
                    />
                  ),
              },
            ]}
          />
        ) : null}
      </section>
    </>
  );
}

// ------------------------------------------------------------------ usuários e convites

export function UsersPage() {
  const me = useMe();
  const roles: Role[] = me.organization.type === "operator" ? ["curator", "admin"] : ["member", "owner"];
  const list = useAsync(() => api.invitations(), "invitations");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>(roles[0]!);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<unknown>();
  const [link, setLink] = useState<{ url: string; email: string } | null>(null);
  const fe = fieldErrors(error);
  const linkId = useId();

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(undefined);
    setLink(null);
    try {
      const inv = await api.invite(email, role);
      setLink({ url: `${window.location.origin}/convite?token=${encodeURIComponent(inv.token)}`, email: inv.email });
      setEmail("");
      list.reload();
    } catch (err) {
      setError(err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageHeader title="Usuários e convites">
        <p>
          Convide pessoas para <strong>{me.organization.name}</strong>. Neste protótipo não há envio de e-mail: copie o
          link gerado e envie você mesmo. O link vale por 7 dias e pode ser usado uma vez.
        </p>
      </PageHeader>
      <form className="card form form--inline" onSubmit={(e) => void submit(e)} data-testid="invite-create-form">
        <h2>Novo convite</h2>
        <TextField
          label="E-mail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          error={fe.email}
          data-testid="invite-email"
        />
        <SelectField
          label="Papel"
          value={role}
          onChange={(e) => setRole(e.target.value as Role)}
          error={fe.role}
          data-testid="invite-role"
        >
          {roles.map((r) => (
            <option key={r} value={r}>
              {ROLE_LABEL[r]}
            </option>
          ))}
        </SelectField>
        <div className="actions">
          <button type="submit" className="btn btn--primary" disabled={busy} data-testid="invite-create-submit">
            {busy ? "Gerando…" : "Gerar convite"}
          </button>
        </div>
        <ErrorBox error={error} />
      </form>
      {link ? (
        <div className="notice notice--success" role="status" data-testid="invite-link-box">
          <p>
            Convite criado para <strong>{link.email}</strong>. Envie este link (é exibido só agora):
          </p>
          <label htmlFor={linkId}>Link do convite</label>
          <input
            id={linkId}
            readOnly
            value={link.url}
            className="mono"
            onFocus={(e) => e.target.select()}
            data-testid="invite-link"
          />
          <div className="actions">
            <CopyButton text={link.url} label="Copiar link" testId="invite-copy" />
          </div>
        </div>
      ) : null}
      <section className="section" aria-labelledby="inv-h">
        <h2 id="inv-h">Convites emitidos</h2>
        {list.loading ? <Loading /> : null}
        <ErrorBox error={list.error} />
        {list.data && list.data.length === 0 ? <Empty>Nenhum convite emitido.</Empty> : null}
        {list.data && list.data.length > 0 ? (
          <Table<Invitation>
            caption="Convites"
            testId="invite-list"
            rows={list.data}
            rowKey={(i) => i.id}
            columns={[
              { header: "E-mail", render: (i) => i.email },
              { header: "Papel", render: (i) => ROLE_LABEL[i.role] },
              { header: "Expira", render: (i) => <DateTime value={i.expiresAt} /> },
              {
                header: "Situação",
                render: (i) =>
                  i.acceptedAt ? (
                    <>
                      Aceito em <DateTime value={i.acceptedAt} />
                    </>
                  ) : new Date(i.expiresAt) < new Date() ? (
                    "Expirado"
                  ) : (
                    "Pendente"
                  ),
              },
            ]}
          />
        ) : null}
      </section>
    </>
  );
}
