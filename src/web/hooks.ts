import { useCallback, useEffect, useRef, useState } from "react";
import type { Page } from "./api";

interface AsyncState<T> {
  key: string;
  data: T | undefined;
  error: unknown;
}

/**
 * Carrega dados quando `key` muda. `loading` é derivado (estado guarda a chave carregada),
 * para não chamar setState de forma síncrona dentro do efeito.
 */
export function useAsync<T>(fn: () => Promise<T>, key: string) {
  const [nonce, setNonce] = useState(0);
  const fullKey = `${key}#${nonce}`;
  const [state, setState] = useState<AsyncState<T>>({ key: "", data: undefined, error: undefined });
  const fnRef = useRef(fn);
  useEffect(() => {
    fnRef.current = fn;
  });
  useEffect(() => {
    let alive = true;
    fnRef.current().then(
      (data) => alive && setState({ key: fullKey, data, error: undefined }),
      (error: unknown) => alive && setState((s) => ({ key: fullKey, data: s.data, error })),
    );
    return () => {
      alive = false;
    };
  }, [fullKey]);
  const reload = useCallback(() => setNonce((n) => n + 1), []);
  const loading = state.key !== fullKey;
  const setData = useCallback((data: T) => setState((s) => ({ ...s, data })), []);
  return { data: state.data, error: loading ? undefined : state.error, loading, reload, setData };
}

interface PagedState<T> {
  key: string;
  items: T[];
  next: string | null;
  error: unknown;
  loadingMore: boolean;
}

/** Lista paginada por cursor com "Carregar mais". Reinicia quando `key` muda. */
export function usePaged<T>(fetchPage: (cursor: string | null) => Promise<Page<T>>, key: string) {
  const [nonce, setNonce] = useState(0);
  const fullKey = `${key}#${nonce}`;
  const [state, setState] = useState<PagedState<T>>({
    key: "",
    items: [],
    next: null,
    error: undefined,
    loadingMore: false,
  });
  const fnRef = useRef(fetchPage);
  useEffect(() => {
    fnRef.current = fetchPage;
  });
  useEffect(() => {
    let alive = true;
    fnRef.current(null).then(
      (p) =>
        alive && setState({ key: fullKey, items: p.data, next: p.next_cursor, error: undefined, loadingMore: false }),
      (error: unknown) => alive && setState({ key: fullKey, items: [], next: null, error, loadingMore: false }),
    );
    return () => {
      alive = false;
    };
  }, [fullKey]);

  const loadMore = useCallback(() => {
    setState((s) => ({ ...s, loadingMore: true, error: undefined }));
    const cursor = state.next;
    const k = state.key;
    fnRef.current(cursor).then(
      (p) =>
        setState((s) =>
          s.key === k ? { ...s, items: [...s.items, ...p.data], next: p.next_cursor, loadingMore: false } : s,
        ),
      (error: unknown) => setState((s) => (s.key === k ? { ...s, error, loadingMore: false } : s)),
    );
  }, [state.next, state.key]);

  const reload = useCallback(() => setNonce((n) => n + 1), []);
  const loading = state.key !== fullKey;
  return {
    items: loading ? [] : state.items,
    hasMore: !loading && state.next !== null,
    loading,
    loadingMore: state.loadingMore,
    error: loading ? undefined : state.error,
    loadMore,
    reload,
  };
}
