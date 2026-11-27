import { eq } from "drizzle-orm";
import type { DbLike } from "../db/client.js";
import { suppliers } from "../db/schema.js";
import { isValidCnpj, normalizeCnpj } from "../domain/cnpj.js";
import { invalid, notFound } from "../http/errors.js";

// Catálogo público de fornecedores (fatos públicos; não é dado de tenant).

export async function findOrCreateSupplier(db: DbLike, cnpjRaw: string, legalName?: string) {
  const cnpj = normalizeCnpj(cnpjRaw);
  if (!isValidCnpj(cnpj)) throw invalid("CNPJ do fornecedor inválido.", { field: "supplier_cnpj" });
  const [found] = await db.select().from(suppliers).where(eq(suppliers.cnpj, cnpj));
  if (found) return found;
  if (!legalName) throw invalid("Fornecedor fora do catálogo: informe supplier_name.", { field: "supplier_name" });
  const [created] = await db
    .insert(suppliers)
    .values({ cnpj, legalName: legalName.trim() })
    .onConflictDoNothing()
    .returning();
  return created ?? (await db.select().from(suppliers).where(eq(suppliers.cnpj, cnpj)))[0]!;
}

export async function lookupSupplier(db: DbLike, cnpjRaw: string) {
  const [s] = await db
    .select()
    .from(suppliers)
    .where(eq(suppliers.cnpj, normalizeCnpj(cnpjRaw)));
  if (!s) throw notFound("Fornecedor");
  return { id: s.id, cnpj: s.cnpj, legal_name: s.legalName };
}
