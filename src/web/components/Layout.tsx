import { useState, type ReactNode } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import type { Me } from "../api";
import { ORG_TYPE_LABEL, ROLE_LABEL } from "../labels";
import { canInvite, isAdmin, isOperator, isPortfolio, useSession } from "../session";

export const DISCLAIMER =
  "Protótipo com dados sintéticos. Mostra fatos públicos curados com fonte; não é nota de crédito, " +
  "não prevê falência e não tem relação oficial com CCEE, ANEEL ou Abraceel.";

interface NavItem {
  to: string;
  label: string;
  testId: string;
}

function navFor(me: Me): NavItem[] {
  if (me.organization.status !== "approved") return [];
  if (isPortfolio(me)) {
    const items: NavItem[] = [
      { to: "/painel", label: "Painel", testId: "nav-painel" },
      { to: "/alertas", label: "Alertas", testId: "nav-alertas" },
      { to: "/carteira/clientes", label: "Clientes", testId: "nav-clientes" },
      { to: "/carteira/unidades", label: "Unidades", testId: "nav-unidades" },
      { to: "/carteira/contratos", label: "Contratos", testId: "nav-contratos" },
      { to: "/carteira/importar", label: "Importar CSV", testId: "nav-importar" },
    ];
    if (me.role === "owner") items.push({ to: "/chaves", label: "Chaves de API", testId: "nav-chaves" });
    if (canInvite(me)) items.push({ to: "/usuarios", label: "Usuários", testId: "nav-usuarios" });
    return items;
  }
  if (me.organization.type === "supplier") {
    const items: NavItem[] = [
      { to: "/fornecedor/eventos", label: "Eventos sobre minha empresa", testId: "nav-fornecedor-eventos" },
    ];
    if (canInvite(me)) items.push({ to: "/usuarios", label: "Usuários", testId: "nav-usuarios" });
    return items;
  }
  if (isOperator(me)) {
    const items: NavItem[] = [];
    if (isAdmin(me)) items.push({ to: "/operacao/organizacoes", label: "Organizações", testId: "nav-op-organizacoes" });
    items.push(
      { to: "/operacao/eventos", label: "Eventos", testId: "nav-op-eventos" },
      { to: "/operacao/precos", label: "Preços de referência", testId: "nav-op-precos" },
      { to: "/operacao/importar-fa", label: "Importar FA", testId: "nav-op-fa" },
    );
    if (isAdmin(me)) {
      items.push({ to: "/operacao/auditoria", label: "Auditoria", testId: "nav-op-auditoria" });
      items.push({ to: "/usuarios", label: "Usuários", testId: "nav-usuarios" });
    }
    return items;
  }
  return [];
}

export function Footer() {
  return (
    <footer className="site-footer" role="contentinfo">
      <p data-testid="disclaimer">{DISCLAIMER}</p>
    </footer>
  );
}

/** Esqueleto comum: cabeçalho, navegação, conteúdo principal e rodapé fixo com o aviso. */
export function Layout({ children }: { children: ReactNode }) {
  const { me, logout } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const [lastPath, setLastPath] = useState(location.pathname);
  if (lastPath !== location.pathname) {
    // Fecha o menu móvel ao navegar (ajuste de estado durante a renderização, padrão recomendado pelo React).
    setLastPath(location.pathname);
    setMenuOpen(false);
  }
  const items = me ? navFor(me) : [];
  return (
    <div className="app">
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <header className="site-header">
        <div className="site-header__bar">
          <Link to="/" className="brand">
            Radar de Fornecedores <span className="brand__tag">protótipo</span>
          </Link>
          {me ? (
            <>
              <div className="who" data-testid="who">
                <span className="who__org">{me.organization.name}</span>
                <span className="who__meta">
                  {ORG_TYPE_LABEL[me.organization.type]}
                  {me.role ? ` · ${ROLE_LABEL[me.role]}` : ""}
                  {me.user ? ` · ${me.user.name}` : ""}
                </span>
              </div>
              <div className="header-actions">
                {items.length > 0 ? (
                  <button
                    type="button"
                    className="btn menu-toggle"
                    aria-expanded={menuOpen}
                    aria-controls="menu-principal"
                    onClick={() => setMenuOpen((o) => !o)}
                    data-testid="menu-toggle"
                  >
                    Menu
                  </button>
                ) : null}
                <button type="button" className="btn" onClick={() => void logout()} data-testid="logout">
                  Sair
                </button>
              </div>
            </>
          ) : null}
        </div>
        {items.length > 0 ? (
          <nav aria-label="Principal" id="menu-principal" className={`site-nav${menuOpen ? " is-open" : ""}`}>
            <ul>
              {items.map((i) => (
                <li key={i.to}>
                  <NavLink to={i.to} data-testid={i.testId} end={i.to === "/painel"}>
                    {i.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </header>
      <main id="conteudo" className="site-main" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
