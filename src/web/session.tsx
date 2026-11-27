import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { api, ApiError, setApiHandlers, type Me } from "./api";

interface SessionValue {
  me: Me | null;
  loading: boolean;
  /** Erro de rede/servidor ao carregar a sessão (não inclui 401). */
  error: unknown;
  refresh: () => Promise<Me | null>;
  logout: () => Promise<void>;
}

const Ctx = createContext<SessionValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [state, setState] = useState<{ me: Me | null; loading: boolean; error: unknown }>({
    me: null,
    loading: true,
    error: undefined,
  });

  const refresh = useCallback(async () => {
    try {
      const me = await api.me();
      setState({ me, loading: false, error: undefined });
      return me;
    } catch (e) {
      const unauth = e instanceof ApiError && e.status === 401;
      setState({ me: null, loading: false, error: unauth ? undefined : e });
      return null;
    }
  }, []);

  useEffect(() => {
    let alive = true;
    api.me().then(
      (me) => alive && setState({ me, loading: false, error: undefined }),
      (e: unknown) =>
        alive &&
        setState({ me: null, loading: false, error: e instanceof ApiError && e.status === 401 ? undefined : e }),
    );
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    setApiHandlers({
      onUnauthenticated: () => {
        setState({ me: null, loading: false, error: undefined });
        navigate("/entrar", { replace: true, state: { expired: true } });
      },
      onNotApproved: () => {
        void refresh();
        navigate("/aguardando", { replace: true });
      },
    });
  }, [navigate, refresh]);

  const logout = useCallback(async () => {
    try {
      await api.logout();
    } finally {
      setState({ me: null, loading: false, error: undefined });
      navigate("/entrar", { replace: true });
    }
  }, [navigate]);

  const value = useMemo(() => ({ ...state, refresh, logout }), [state, refresh, logout]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSession(): SessionValue {
  const v = useContext(Ctx);
  if (!v) throw new Error("useSession fora do SessionProvider");
  return v;
}

/** Sessão garantidamente carregada e aprovada (usar só dentro de rotas protegidas). */
export function useMe(): Me {
  const { me } = useSession();
  if (!me) throw new Error("Sessão ausente");
  return me;
}

export function homePath(me: Me): string {
  if (me.organization.status !== "approved") return "/aguardando";
  switch (me.organization.type) {
    case "manager":
    case "consumer":
      return "/painel";
    case "supplier":
      return "/fornecedor/eventos";
    case "operator":
      return "/operacao/eventos";
  }
}

export const isPortfolio = (me: Me) => me.organization.type === "manager" || me.organization.type === "consumer";
export const isOperator = (me: Me) => me.organization.type === "operator";
export const isAdmin = (me: Me) => isOperator(me) && me.role === "admin";
export const canInvite = (me: Me) => me.role === "owner" || me.role === "admin";
