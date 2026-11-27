import type { ReactNode } from "react";

export interface Column<T> {
  header: string;
  render: (row: T) => ReactNode;
  /** Célula de ações: sem rótulo no modo cartão. */
  actions?: boolean;
  className?: string;
}

/**
 * Tabela no desktop; abaixo de 720 px cada linha vira um cartão com o rótulo da coluna antes do valor
 * (via data-label). Mantém a semântica de tabela para leitores de tela.
 */
export function Table<T>({
  caption,
  columns,
  rows,
  rowKey,
  testId,
  rowTestId,
}: {
  caption: string;
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  testId?: string;
  rowTestId?: string;
}) {
  return (
    <div className="table-wrap">
      <table className="table" data-testid={testId}>
        <caption className="visually-hidden">{caption}</caption>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.header} scope="col">
                {c.actions ? <span className="visually-hidden">{c.header}</span> : c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={rowKey(r)} data-testid={rowTestId}>
              {columns.map((c) => (
                <td
                  key={c.header}
                  data-label={c.actions ? undefined : c.header}
                  className={[c.actions ? "cell-actions" : "", c.className ?? ""].join(" ").trim() || undefined}
                >
                  {c.render(r)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
