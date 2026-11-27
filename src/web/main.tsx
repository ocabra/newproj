import { StrictMode, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Link, Navigate, Route, Routes } from "react-router-dom";
import type { Me } from "./api";
import { Layout } from "./components/Layout";
import { ErrorBox, Loading, PageHeader } from "./components/ui";
import { AlertDetailPage, AlertsPage, DashboardPage } from "./pages/Alerts";
import { ApiKeysPage, UsersPage } from "./pages/Access";
import { AcceptInvitePage, LoginPage, PendingPage, RegisterPage } from "./pages/Auth";
import { ContractEditPage, ContractNewPage, ContractsPage } from "./pages/Contracts";
import { ImportContractsPage, ImportLeveragePage } from "./pages/Import";
import { AuditPage, EventsPage, OrganizationsPage, ReferencePricesPage } from "./pages/Operator";
import { ClientsPage, SitesPage } from "./pages/Portfolio";
import { SupplierEventsPage } from "./pages/Supplier";
import { canInvite, homePath, isAdmin, isOperator, isPortfolio, SessionProvider, useSession } from "./session";
import "./styles.css";

/** Rota protegida: exige sessão, organização aprovada e (opcionalmente) um perfil. */
function Guard({ allow, children }: { allow?: (me: Me) => boolean; children: ReactNode }) {
  const { me, loading, error } = useSession();
  if (loading) return <Loading label="Carregando sessão…" />;
  if (error) return <ErrorBox error={error} />;
  if (!me) return <Navigate to="/entrar" replace />;
  if (me.organization.status !== "approved") return <Navigate to="/aguardando" replace />;
  if (allow && !allow(me)) return <Forbidden />;
  return <>{children}</>;
}

function Forbidden() {
  const { me } = useSession();
  return (
    <>
      <PageHeader title="Sem acesso a esta tela" />
      <p data-testid="forbidden">Seu perfil não tem permissão para esta tela.</p>
      {me ? (
        <p>
          <Link to={homePath(me)}>Ir para a página inicial</Link>
        </p>
      ) : null}
    </>
  );
}

function Home() {
  const { me, loading, error } = useSession();
  if (loading) return <Loading label="Carregando sessão…" />;
  if (error) return <ErrorBox error={error} />;
  return <Navigate to={me ? homePath(me) : "/entrar"} replace />;
}

function NotFound() {
  return (
    <>
      <PageHeader title="Página não encontrada" />
      <p>
        <Link to="/">Voltar ao início</Link>
      </p>
    </>
  );
}

const portfolio = isPortfolio;
const owner = (me: Me) => isPortfolio(me) && me.role === "owner";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/entrar" element={<LoginPage />} />
        <Route path="/cadastrar" element={<RegisterPage />} />
        <Route path="/convite" element={<AcceptInvitePage />} />
        <Route path="/aguardando" element={<PendingPage />} />

        <Route
          path="/painel"
          element={
            <Guard allow={portfolio}>
              <DashboardPage />
            </Guard>
          }
        />
        <Route
          path="/alertas"
          element={
            <Guard allow={portfolio}>
              <AlertsPage />
            </Guard>
          }
        />
        <Route
          path="/alertas/:id"
          element={
            <Guard allow={portfolio}>
              <AlertDetailPage />
            </Guard>
          }
        />
        <Route
          path="/carteira/clientes"
          element={
            <Guard allow={portfolio}>
              <ClientsPage />
            </Guard>
          }
        />
        <Route
          path="/carteira/unidades"
          element={
            <Guard allow={portfolio}>
              <SitesPage />
            </Guard>
          }
        />
        <Route
          path="/carteira/contratos"
          element={
            <Guard allow={portfolio}>
              <ContractsPage />
            </Guard>
          }
        />
        <Route
          path="/carteira/contratos/novo"
          element={
            <Guard allow={portfolio}>
              <ContractNewPage />
            </Guard>
          }
        />
        <Route
          path="/carteira/contratos/:id"
          element={
            <Guard allow={portfolio}>
              <ContractEditPage />
            </Guard>
          }
        />
        <Route
          path="/carteira/importar"
          element={
            <Guard allow={portfolio}>
              <ImportContractsPage />
            </Guard>
          }
        />
        <Route
          path="/chaves"
          element={
            <Guard allow={owner}>
              <ApiKeysPage />
            </Guard>
          }
        />
        <Route
          path="/usuarios"
          element={
            <Guard allow={canInvite}>
              <UsersPage />
            </Guard>
          }
        />

        <Route
          path="/fornecedor/eventos"
          element={
            <Guard allow={(me) => me.organization.type === "supplier"}>
              <SupplierEventsPage />
            </Guard>
          }
        />

        <Route
          path="/operacao/organizacoes"
          element={
            <Guard allow={isAdmin}>
              <OrganizationsPage />
            </Guard>
          }
        />
        <Route
          path="/operacao/eventos"
          element={
            <Guard allow={isOperator}>
              <EventsPage />
            </Guard>
          }
        />
        <Route
          path="/operacao/precos"
          element={
            <Guard allow={isOperator}>
              <ReferencePricesPage />
            </Guard>
          }
        />
        <Route
          path="/operacao/importar-fa"
          element={
            <Guard allow={isOperator}>
              <ImportLeveragePage />
            </Guard>
          }
        />
        <Route
          path="/operacao/auditoria"
          element={
            <Guard allow={isAdmin}>
              <AuditPage />
            </Guard>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(
    <StrictMode>
      <BrowserRouter>
        <SessionProvider>
          <App />
        </SessionProvider>
      </BrowserRouter>
    </StrictMode>,
  );
}
