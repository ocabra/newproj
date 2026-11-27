import { useState, type FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { api, fieldErrors, type OrgType } from "../api";
import { ErrorBox, PageHeader, SelectField, Success, TextField, Warning } from "../components/ui";
import { fmtCnpj } from "../format";
import { ORG_STATUS_LABEL, ORG_TYPE_LABEL } from "../labels";
import { homePath, useSession } from "../session";

export function LoginPage() {
  const { me, refresh } = useSession();
  const navigate = useNavigate();
  const location = useLocation();
  const expired = (location.state as { expired?: boolean } | null)?.expired;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<unknown>();

  if (me) return <Navigate to={homePath(me)} replace />;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(undefined);
    try {
      await api.login(email, password);
      const m = await refresh();
      navigate(m ? homePath(m) : "/", { replace: true });
    } catch (err) {
      setError(err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="narrow">
      <PageHeader title="Entrar" />
      {expired ? <Warning>Sua sessão expirou ou não existe. Entre novamente.</Warning> : null}
      <form className="card form" onSubmit={(e) => void submit(e)} data-testid="login-form">
        <TextField
          label="E-mail"
          type="email"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          data-testid="login-email"
        />
        <TextField
          label="Senha"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          data-testid="login-password"
        />
        <ErrorBox error={error} testId="login-error" />
        <div className="actions">
          <button className="btn btn--primary" type="submit" disabled={busy} data-testid="login-submit">
            {busy ? "Entrando…" : "Entrar"}
          </button>
        </div>
      </form>
      <p>
        Ainda não tem conta? <Link to="/cadastrar">Cadastre sua organização</Link>.
      </p>
    </div>
  );
}

export function RegisterPage() {
  const { me, refresh } = useSession();
  const navigate = useNavigate();
  const [f, setF] = useState({
    name: "",
    email: "",
    password: "",
    orgName: "",
    orgType: "manager" as Exclude<OrgType, "operator">,
    cnpj: "",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<unknown>();
  if (me) return <Navigate to={homePath(me)} replace />;
  const fe = fieldErrors(error);
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF({ ...f, [k]: e.target.value });

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(undefined);
    setBusy(true);
    try {
      await api.register({
        name: f.name,
        email: f.email,
        password: f.password,
        org: { name: f.orgName, type: f.orgType, cnpj: f.cnpj },
      });
      await refresh();
      navigate("/aguardando", { replace: true });
    } catch (err) {
      setError(err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="narrow">
      <PageHeader title="Cadastrar organização">
        <p>Toda organização começa aguardando aprovação manual da operação da plataforma.</p>
      </PageHeader>
      <form className="card form" onSubmit={(e) => void submit(e)} data-testid="register-form">
        <fieldset>
          <legend>Você</legend>
          <TextField
            label="Nome"
            value={f.name}
            onChange={set("name")}
            required
            minLength={2}
            autoComplete="name"
            error={fe.name}
            data-testid="register-name"
          />
          <TextField
            label="E-mail"
            type="email"
            value={f.email}
            onChange={set("email")}
            required
            autoComplete="email"
            error={fe.email}
            data-testid="register-email"
          />
          <TextField
            label="Senha"
            type="password"
            value={f.password}
            onChange={set("password")}
            required
            minLength={10}
            autoComplete="new-password"
            hint="Pelo menos 10 caracteres."
            error={fe.password}
            data-testid="register-password"
          />
        </fieldset>
        <fieldset>
          <legend>Organização</legend>
          <TextField
            label="Nome da organização"
            value={f.orgName}
            onChange={set("orgName")}
            required
            minLength={2}
            autoComplete="organization"
            error={fe["org.name"]}
            data-testid="register-org-name"
          />
          <SelectField
            label="Tipo"
            value={f.orgType}
            onChange={set("orgType")}
            required
            error={fe["org.type"]}
            data-testid="register-org-type"
          >
            <option value="manager">{ORG_TYPE_LABEL.manager}</option>
            <option value="consumer">{ORG_TYPE_LABEL.consumer}</option>
            <option value="supplier">{ORG_TYPE_LABEL.supplier}</option>
          </SelectField>
          <TextField
            label="CNPJ"
            value={f.cnpj}
            onChange={set("cnpj")}
            required
            inputMode="numeric"
            hint="Com ou sem pontuação. Validado por dígito verificador."
            error={fe["org.cnpj"]}
            data-testid="register-org-cnpj"
          />
        </fieldset>
        <ErrorBox error={error} testId="register-error" />
        <div className="actions">
          <button className="btn btn--primary" type="submit" disabled={busy} data-testid="register-submit">
            {busy ? "Enviando…" : "Cadastrar"}
          </button>
        </div>
      </form>
      <p>
        Já tem conta? <Link to="/entrar">Entrar</Link>.
      </p>
    </div>
  );
}

export function AcceptInvitePage() {
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";
  const { refresh } = useSession();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<unknown>();
  const fe = fieldErrors(error);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(undefined);
    try {
      await api.acceptInvitation({ token, name, password });
      const m = await refresh();
      navigate(m ? homePath(m) : "/", { replace: true });
    } catch (err) {
      setError(err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="narrow">
      <PageHeader title="Aceitar convite">
        <p>Crie seu acesso. O e-mail é o do convite; o link vale por 7 dias e só pode ser usado uma vez.</p>
      </PageHeader>
      {!token ? (
        <Warning title="Link incompleto.">
          O link não tem o token do convite. Peça um novo convite a quem convidou você.
        </Warning>
      ) : (
        <form className="card form" onSubmit={(e) => void submit(e)} data-testid="invite-form">
          <TextField
            label="Seu nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            minLength={2}
            autoComplete="name"
            error={fe.name}
            data-testid="invite-name"
          />
          <TextField
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={10}
            autoComplete="new-password"
            hint="Pelo menos 10 caracteres."
            error={fe.password}
            data-testid="invite-password"
          />
          <ErrorBox error={error} testId="invite-error" />
          <div className="actions">
            <button className="btn btn--primary" type="submit" disabled={busy} data-testid="invite-submit">
              {busy ? "Enviando…" : "Aceitar convite"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export function PendingPage() {
  const { me, refresh, logout } = useSession();
  const [checked, setChecked] = useState("");
  if (!me) return <Navigate to="/entrar" replace />;
  if (me.organization.status === "approved") return <Navigate to={homePath(me)} replace />;
  const st = me.organization.status;
  return (
    <div className="narrow" data-testid="pending-page">
      <PageHeader title="Aguardando aprovação" />
      <div className="card stack">
        <p>
          A organização <strong>{me.organization.name}</strong> ({ORG_TYPE_LABEL[me.organization.type]}, CNPJ{" "}
          {fmtCnpj(me.organization.cnpj)}) está com status:{" "}
          <strong data-testid="org-status">{ORG_STATUS_LABEL[st]}</strong>.
        </p>
        {st === "pending" ? (
          <p>
            A operação da plataforma revisa cada cadastro manualmente. Enquanto isso, nenhum dado de carteira, alerta ou
            evento fica disponível. Volte mais tarde ou verifique de novo.
          </p>
        ) : (
          <p>O acesso desta organização não está liberado. Fale com a operação da plataforma.</p>
        )}
        <Success>{checked}</Success>
        <div className="actions">
          <button
            type="button"
            className="btn btn--primary"
            data-testid="pending-refresh"
            onClick={() =>
              void refresh().then((m) =>
                setChecked(m?.organization.status === "pending" ? "Verificado: ainda aguardando aprovação." : ""),
              )
            }
          >
            Verificar novamente
          </button>
          <button type="button" className="btn" onClick={() => void logout()}>
            Sair
          </button>
        </div>
      </div>
    </div>
  );
}
