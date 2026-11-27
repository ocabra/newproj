import { useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api, fetchAll, fieldErrors, type Client, type Site, type Submarket } from "../api";
import { ConfirmButton } from "../components/Dialog";
import { Table } from "../components/Table";
import { Empty, ErrorBox, Loading, LoadMore, PageHeader, SelectField, Success, TextField } from "../components/ui";
import { fmtCnpj, fmtDateTime } from "../format";
import { useAsync, usePaged } from "../hooks";
import { SUBMARKET_LABEL, SUBMARKETS } from "../labels";
import { useMe } from "../session";

/** Todos os clientes e unidades da carteira (para seletores e para nomear linhas). */
export function useLookups() {
  return useAsync(async () => {
    const [clients, sites] = await Promise.all([
      fetchAll((cursor) => api.clients({ cursor, limit: 100 })),
      fetchAll((cursor) => api.sites({ cursor, limit: 100 })),
    ]);
    return {
      clients,
      sites,
      clientById: new Map(clients.map((c) => [c.id, c])),
      siteById: new Map(sites.map((s) => [s.id, s])),
    };
  }, "lookups");
}

export const canWritePortfolio = (role: string | null) => role === "owner" || role === "member";

// ------------------------------------------------------------------ clientes

export function ClientsPage() {
  const me = useMe();
  const canWrite = canWritePortfolio(me.role);
  const list = usePaged((cursor) => api.clients({ cursor }), "clients");
  const [form, setForm] = useState({ legal_name: "", cnpj: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<unknown>();
  const [ok, setOk] = useState("");
  const fe = fieldErrors(error);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(undefined);
    setOk("");
    try {
      const c = await api.createClient(form);
      setOk(`Cliente "${c.legal_name}" criado.`);
      setForm({ legal_name: "", cnpj: "" });
      list.reload();
    } catch (err) {
      setError(err);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (c: Client) => {
    await api.deleteClient(c.id);
    setOk(`Cliente "${c.legal_name}" excluído, com suas unidades e contratos.`);
    list.reload();
  };

  return (
    <>
      <PageHeader title="Clientes">
        <p>Clientes da carteira (consumidores atendidos). Cada cliente tem unidades e contratos.</p>
      </PageHeader>
      {canWrite ? (
        <form className="card form form--inline" onSubmit={(e) => void submit(e)} data-testid="client-form">
          <h2>Novo cliente</h2>
          <TextField
            label="Razão social"
            value={form.legal_name}
            onChange={(e) => setForm({ ...form, legal_name: e.target.value })}
            required
            minLength={2}
            error={fe.legal_name}
            data-testid="client-name"
          />
          <TextField
            label="CNPJ"
            value={form.cnpj}
            onChange={(e) => setForm({ ...form, cnpj: e.target.value })}
            required
            inputMode="numeric"
            hint="Com ou sem pontuação; validado por dígito verificador."
            error={fe.cnpj}
            data-testid="client-cnpj"
          />
          <div className="actions">
            <button type="submit" className="btn btn--primary" disabled={busy} data-testid="client-submit">
              {busy ? "Salvando…" : "Criar cliente"}
            </button>
          </div>
          <ErrorBox error={error} />
        </form>
      ) : null}
      <Success>{ok}</Success>
      <section className="section" aria-labelledby="cl-h">
        <h2 id="cl-h">Clientes cadastrados</h2>
        {list.loading ? <Loading /> : null}
        <ErrorBox error={list.error} />
        {!list.loading && !list.error && list.items.length === 0 ? (
          <Empty>Nenhum cliente. Crie o primeiro acima ou importe contratos por CSV.</Empty>
        ) : null}
        {list.items.length > 0 ? (
          <Table
            caption="Clientes"
            testId="client-list"
            rowTestId="client-row"
            rows={list.items}
            rowKey={(c) => c.id}
            columns={[
              { header: "Razão social", render: (c) => c.legal_name },
              { header: "CNPJ", render: (c) => fmtCnpj(c.cnpj) },
              { header: "Criado em", render: (c) => fmtDateTime(c.created_at) },
              {
                header: "Ações",
                actions: true,
                render: (c) => (
                  <div className="row-actions">
                    <Link className="btn btn--small" to={`/carteira/unidades?cliente=${c.id}`}>
                      Unidades
                    </Link>
                    <Link className="btn btn--small" to={`/carteira/contratos?cliente=${c.id}`}>
                      Contratos
                    </Link>
                    {canWrite ? (
                      <ConfirmButton
                        label="Excluir"
                        className="btn btn--small btn--danger-outline"
                        title="Excluir cliente?"
                        message={
                          <p>
                            O cliente <strong>{c.legal_name}</strong> e todas as suas unidades e contratos deixam de
                            aparecer nas listas, na API e no monitoramento. A trilha de auditoria é mantida.
                          </p>
                        }
                        confirmLabel="Excluir cliente"
                        danger
                        onConfirm={() => remove(c)}
                        testId="client-delete"
                      />
                    ) : null}
                  </div>
                ),
              },
            ]}
          />
        ) : null}
        <LoadMore hasMore={list.hasMore} loading={list.loadingMore} onClick={list.loadMore} />
      </section>
    </>
  );
}

// ------------------------------------------------------------------ unidades

export function SitesPage() {
  const me = useMe();
  const canWrite = canWritePortfolio(me.role);
  const [params, setParams] = useSearchParams();
  const clientFilter = params.get("cliente") ?? "";
  const lookups = useLookups();
  const list = usePaged(
    (cursor) => api.sites({ cursor, client_id: clientFilter || undefined }),
    `sites|${clientFilter}`,
  );
  const [form, setForm] = useState({ client_id: "", name: "", submarket: "SE_CO" as Submarket, distributor: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<unknown>();
  const [ok, setOk] = useState("");
  const fe = fieldErrors(error);
  const clients = lookups.data?.clients ?? [];
  const formClient = form.client_id || clientFilter;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(undefined);
    setOk("");
    try {
      const s = await api.createSite({
        client_id: formClient,
        name: form.name,
        submarket: form.submarket,
        ...(form.distributor.trim() ? { distributor: form.distributor.trim() } : {}),
      });
      setOk(`Unidade "${s.name}" criada.`);
      setForm({ ...form, name: "", distributor: "" });
      list.reload();
      lookups.reload();
    } catch (err) {
      setError(err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageHeader title="Unidades">
        <p>Unidades consumidoras dos clientes. O submercado define o preço de referência usado na exposição.</p>
      </PageHeader>
      {lookups.loading ? <Loading label="Carregando clientes…" /> : null}
      <ErrorBox error={lookups.error} />
      {lookups.data && clients.length === 0 ? (
        <Empty>
          Cadastre um <Link to="/carteira/clientes">cliente</Link> antes de criar unidades.
        </Empty>
      ) : null}
      {canWrite && clients.length > 0 ? (
        <form className="card form form--inline" onSubmit={(e) => void submit(e)} data-testid="site-form">
          <h2>Nova unidade</h2>
          <SelectField
            label="Cliente"
            value={formClient}
            onChange={(e) => setForm({ ...form, client_id: e.target.value })}
            required
            error={fe.client_id}
            data-testid="site-client"
          >
            <option value="">Selecione…</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.legal_name}
              </option>
            ))}
          </SelectField>
          <TextField
            label="Nome da unidade"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            error={fe.name}
            data-testid="site-name"
          />
          <SelectField
            label="Submercado"
            value={form.submarket}
            onChange={(e) => setForm({ ...form, submarket: e.target.value as Submarket })}
            required
            error={fe.submarket}
            data-testid="site-submarket"
          >
            {SUBMARKETS.map((s) => (
              <option key={s} value={s}>
                {SUBMARKET_LABEL[s]}
              </option>
            ))}
          </SelectField>
          <TextField
            label="Distribuidora (opcional)"
            value={form.distributor}
            onChange={(e) => setForm({ ...form, distributor: e.target.value })}
            error={fe.distributor}
            data-testid="site-distributor"
          />
          <div className="actions">
            <button type="submit" className="btn btn--primary" disabled={busy} data-testid="site-submit">
              {busy ? "Salvando…" : "Criar unidade"}
            </button>
          </div>
          <ErrorBox error={error} />
        </form>
      ) : null}
      <Success>{ok}</Success>
      <section className="section" aria-labelledby="st-h">
        <h2 id="st-h">Unidades cadastradas</h2>
        {clients.length > 0 ? (
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
              data-testid="site-filter-client"
            >
              <option value="">Todos os clientes</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.legal_name}
                </option>
              ))}
            </SelectField>
          </div>
        ) : null}
        {list.loading ? <Loading /> : null}
        <ErrorBox error={list.error} />
        {!list.loading && !list.error && list.items.length === 0 ? (
          <Empty>Nenhuma unidade. Crie uma acima para depois cadastrar contratos.</Empty>
        ) : null}
        {list.items.length > 0 ? (
          <Table<Site>
            caption="Unidades"
            testId="site-list"
            rowTestId="site-row"
            rows={list.items}
            rowKey={(s) => s.id}
            columns={[
              { header: "Unidade", render: (s) => s.name },
              {
                header: "Cliente",
                render: (s) => lookups.data?.clientById.get(s.client_id)?.legal_name ?? "—",
              },
              { header: "Submercado", render: (s) => SUBMARKET_LABEL[s.submarket] },
              { header: "Distribuidora", render: (s) => s.distributor ?? "—" },
              {
                header: "Ações",
                actions: true,
                render: (s) =>
                  canWrite ? (
                    <Link className="btn btn--small" to={`/carteira/contratos/novo?unidade=${s.id}`}>
                      Novo contrato
                    </Link>
                  ) : null,
              },
            ]}
          />
        ) : null}
        <LoadMore hasMore={list.hasMore} loading={list.loadingMore} onClick={list.loadMore} />
      </section>
    </>
  );
}
