/** Validação de CNPJ numérico (14 dígitos) por dígitos verificadores. */
export function normalizeCnpj(input: string): string {
  return input.replace(/[.\-/\s]/g, "");
}

export function isValidCnpj(input: string): boolean {
  const c = normalizeCnpj(input);
  if (!/^\d{14}$/.test(c) || /^(\d)\1{13}$/.test(c)) return false;
  const digit = (len: number) => {
    const weights = len === 12 ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const sum = weights.reduce((acc, w, i) => acc + w * Number(c[i]), 0);
    const r = sum % 11;
    return r < 2 ? 0 : 11 - r;
  };
  return digit(12) === Number(c[12]) && digit(13) === Number(c[13]);
}

export function cnpjRoot(cnpj: string): string {
  return normalizeCnpj(cnpj).slice(0, 8);
}

export function formatCnpj(cnpj: string): string {
  const c = normalizeCnpj(cnpj);
  return `${c.slice(0, 2)}.${c.slice(2, 5)}.${c.slice(5, 8)}/${c.slice(8, 12)}-${c.slice(12)}`;
}

/** Gera um CNPJ válido a partir de 12 dígitos-base (usado só para dados sintéticos e testes). */
export function cnpjFromBase(base12: string): string {
  if (!/^\d{12}$/.test(base12)) throw new Error("base deve ter 12 dígitos");
  let c = base12;
  for (const len of [12, 13]) {
    const weights = len === 12 ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const sum = weights.reduce((acc, w, i) => acc + w * Number(c[i]), 0);
    const r = sum % 11;
    c += String(r < 2 ? 0 : 11 - r);
  }
  return c;
}
