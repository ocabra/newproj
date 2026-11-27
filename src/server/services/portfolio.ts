import { and, asc, eq, gt, gte, isNull, lte, or, type AnyColumn, type SQL } from "drizzle-orm";
import type { DbLike } from "../db/client.js";
import { clients, contracts, dataMandates, imports, sites, suppliers } from "../db/schema.js";
import { isValidCnpj, normalizeCnpj } from "../domain/cnpj.js";
import { parseContractsCsv, type ContractRow } from "../domain/csv.js";
import { isValidCivilDate } from "../domain/dates.js";
import { conflict, invalid, notFound } from "../http/errors.js";
import { audit } from "./audit.js";
import { rescanPublishedEvents } from "./radar.js";
import { findOrCreateSupplier } from "./suppliers.js";
import { decodeCursor, encodeCursor } from "./cursor.js";
import type { Principal } from "./principal.js";

export const MANDATE_TEXT_VERSION = "mandato@1";
export const MANDATE_TEXT =
  "Declaro que a organização tem mandato ou autorização dos clientes para tratar os dados de contratos " +
  "carregados nesta plataforma, exclusivamente para monitorar riscos de fornecedores da própria carteira.";

// ------------------------------------------------------------------ mapeamento para o contrato da API

type ContractRowDb = typeof contracts.$inferSelect;
type SupplierRowDb = typeof suppliers.$inferSelect;

export function contractDto(c: ContractRowDb, s: SupplierRowDb, clientId: string, warnings: string[] = []) {
  return {
    id: c.id,
    site_id: c.siteId,
    client_id: clientId,
    supplier: { id: s.id, cnpj: s.cnpj, legal_name: s.legalName },
    start_date: c.startDate,
    end_date: c.endDate,
    volume_mwm: c.volumeMwm,
    price_brl_per_mwh: c.priceBrlPerMwh,
    guarantee_brl: c.guaranteeBrl,
    guarantee_type: c.guaranteeType,
    notes: c.notes,
    created_at: c.createdAt.toISOString(),
    updated_at: c.updatedAt.toISOString(),
    warnings,
  };
}

const clientDto = (c: typeof clients.$inferSelect) => ({
  id: c.id,
  legal_name: c.legalName,
  cnpj: c.cnpj,
  created_at: c.createdAt.toISOString(),
});

const siteDto = (s: typeof sites.$inferSelect) => ({
  id: s.id,
  client_id: s.clientId,
  name: s.name,
  submarket: s.submarket,
  distributor: s.distributor,
  created_at: s.createdAt.toISOString(),
});

/** Cursor (created_at, id) ascendente, estável sob inserções. */
function after(cursor: string | undefined, createdCol: AnyColumn, idCol: AnyColumn) {
  const c = decodeCursor(cursor);
  if (!c) return undefined;
  return or(gt(createdCol, c.createdAt), and(eq(createdCol, c.createdAt), gt(idCol, c.id)));
}

function pageOf<T extends { createdAt: Date; id: string }, D>(rows: T[], limit: number, dto: (r: T) => D) {
  const more = rows.length > limit;
  const slice = more ? rows.slice(0, limit) : rows;
  const last = slice[slice.length - 1];
  return { data: slice.map(dto), next_cursor: more && last ? encodeCursor(last.createdAt, last.id) : null };
}

// ------------------------------------------------------------------ clientes

export async function listClients(db: DbLike, p: Principal, q: { limit: number; cursor?: string }) {
  const rows = await db
    .select()
    .from(clients)
    .where(and(eq(clients.orgId, p.orgId), isNull(clients.deletedAt), after(q.cursor, clients.createdAt, clients.id)))
    .orderBy(asc(clients.createdAt), asc(clients.id))
    .limit(q.limit + 1);
  return pageOf(rows, q.limit, clientDto);
}

export async function createClient(db: DbLike, p: Principal, input: { legal_name: string; cnpj: string }) {
  const cnpj = normalizeCnpj(input.cnpj);
  if (!isValidCnpj(cnpj)) throw invalid("CNPJ do cliente inválido.", { field: "cnpj" });
  const dup = await db
    .select({ id: clients.id })
    .from(clients)
    .where(and(eq(clients.orgId, p.orgId), eq(clients.cnpj, cnpj), isNull(clients.deletedAt)));
  if (dup.length) throw conflict("Cliente com este CNPJ já existe na carteira.", { client_id: dup[0]!.id });
  const [c] = await db.insert(clients).values({ orgId: p.orgId, legalName: input.legal_name.trim(), cnpj }).returning();
  await audit(db, p, "client.created", { type: "client", id: c!.id });
  return clientDto(c!);
}

export async function deleteClient(db: DbLike, p: Principal, id: string) {
  const [c] = await db
    .update(clients)
    .set({ deletedAt: new Date() })
    .where(and(eq(clients.id, id), eq(clients.orgId, p.orgId), isNull(clients.deletedAt)))
    .returning();
  if (!c) throw notFound("Cliente");
  const now = new Date();
  const siteRows = await db
    .update(sites)
    .set({ deletedAt: now })
    .where(and(eq(sites.clientId, id), eq(sites.orgId, p.orgId), isNull(sites.deletedAt)))
    .returning({ id: sites.id });
  for (const s of siteRows) {
    await db
      .update(contracts)
      .set({ deletedAt: now })
      .where(and(eq(contracts.siteId, s.id), eq(contracts.orgId, p.orgId), isNull(contracts.deletedAt)));
  }
  await audit(db, p, "client.deleted", { type: "client", id });
}

// ------------------------------------------------------------------ unidades

async function ownedClient(db: DbLike, p: Principal, clientId: string) {
  const [c] = await db
    .select()
    .from(clients)
    .where(and(eq(clients.id, clientId), eq(clients.orgId, p.orgId), isNull(clients.deletedAt)));
  if (!c) throw notFound("Cliente");
  return c;
}

export async function listSites(db: DbLike, p: Principal, q: { limit: number; cursor?: string; client_id?: string }) {
  const conds: (SQL | undefined)[] = [eq(sites.orgId, p.orgId), isNull(sites.deletedAt)];
  if (q.client_id) conds.push(eq(sites.clientId, q.client_id));
  conds.push(after(q.cursor, sites.createdAt, sites.id));
  const rows = await db
    .select()
    .from(sites)
    .where(and(...conds))
    .orderBy(asc(sites.createdAt), asc(sites.id))
    .limit(q.limit + 1);
  return pageOf(rows, q.limit, siteDto);
}

export async function createSite(
  db: DbLike,
  p: Principal,
  input: { client_id: string; name: string; submarket: "SE_CO" | "S" | "NE" | "N"; distributor?: string },
) {
  await ownedClient(db, p, input.client_id);
  const [s] = await db
    .insert(sites)
    .values({
      orgId: p.orgId,
      clientId: input.client_id,
      name: input.name.trim(),
      submarket: input.submarket,
      distributor: input.distributor ?? null,
    })
    .returning();
  await audit(db, p, "site.created", { type: "site", id: s!.id });
  return siteDto(s!);
}

export async function deleteSite(db: DbLike, p: Principal, id: string) {
  const [s] = await db
    .update(sites)
    .set({ deletedAt: new Date() })
    .where(and(eq(sites.id, id), eq(sites.orgId, p.orgId), isNull(sites.deletedAt)))
    .returning();
  if (!s) throw notFound("Unidade");
  await db
    .update(contracts)
    .set({ deletedAt: new Date() })
    .where(and(eq(contracts.siteId, id), eq(contracts.orgId, p.orgId), isNull(contracts.deletedAt)));
  await audit(db, p, "site.deleted", { type: "site", id });
}

async function ownedSite(db: DbLike, p: Principal, siteId: string) {
  const [s] = await db
    .select()
    .from(sites)
    .where(and(eq(sites.id, siteId), eq(sites.orgId, p.orgId), isNull(sites.deletedAt)));
  if (!s) throw notFound("Unidade");
  return s;
}

// ------------------------------------------------------------------ contratos

export interface ContractInput {
  site_id: string;
  supplier_cnpj: string;
  supplier_name?: string;
  start_date: string;
  end_date: string;
  volume_mwm: number;
  price_brl_per_mwh: number;
  guarantee_brl?: number | null;
  guarantee_type?: "none" | "bank_guarantee" | "insurance" | "deposit" | "other";
  notes?: string | null;
  confirm_overlap?: boolean;
}

function checkPeriod(start: string, end: string) {
  if (!isValidCivilDate(start)) throw invalid("Data de início inválida.", { field: "start_date" });
  if (!isValidCivilDate(end)) throw invalid("Data de fim inválida.", { field: "end_date" });
  if (end < start) throw invalid("Fim anterior ao início.", { field: "end_date" });
}

/** Contratos ativos na mesma unidade, mesmo fornecedor, com períodos que se cruzam. */
async function overlapping(
  db: DbLike,
  p: Principal,
  siteId: string,
  supplierId: string,
  start: string,
  end: string,
  exceptId?: string,
) {
  const rows = await db
    .select({ id: contracts.id })
    .from(contracts)
    .where(
      and(
        eq(contracts.orgId, p.orgId),
        eq(contracts.siteId, siteId),
        eq(contracts.supplierId, supplierId),
        isNull(contracts.deletedAt),
        lte(contracts.startDate, end),
        gte(contracts.endDate, start),
      ),
    );
  return rows.map((r) => r.id).filter((id) => id !== exceptId);
}

export async function createContract(db: DbLike, p: Principal, input: ContractInput) {
  checkPeriod(input.start_date, input.end_date);
  const site = await ownedSite(db, p, input.site_id);
  const supplier = await findOrCreateSupplier(db, input.supplier_cnpj, input.supplier_name);
  const overlaps = await overlapping(db, p, site.id, supplier.id, input.start_date, input.end_date);
  if (overlaps.length && !input.confirm_overlap) {
    throw conflict(
      "Já existe contrato com o mesmo fornecedor nesta unidade em período sobreposto. " +
        "Confirme com confirm_overlap=true se forem contratos distintos (o volume não é somado automaticamente).",
      { overlapping_contract_ids: overlaps },
    );
  }
  const [c] = await db
    .insert(contracts)
    .values({
      orgId: p.orgId,
      siteId: site.id,
      supplierId: supplier.id,
      startDate: input.start_date,
      endDate: input.end_date,
      volumeMwm: input.volume_mwm,
      priceBrlPerMwh: input.price_brl_per_mwh,
      guaranteeBrl: input.guarantee_brl ?? null,
      guaranteeType: input.guarantee_type ?? (input.guarantee_brl ? "other" : "none"),
      notes: input.notes ?? null,
    })
    .returning();
  await audit(db, p, "contract.created", { type: "contract", id: c!.id });
  await rescanPublishedEvents(db, [supplier.id]);
  const warnings = overlaps.length ? [`Sobrepõe ${overlaps.length} contrato(s) confirmado(s) pelo usuário.`] : [];
  return contractDto(c!, supplier, site.clientId, warnings);
}

async function loadContract(db: DbLike, p: Principal, id: string) {
  const rows = await db
    .select({ c: contracts, s: suppliers, clientId: sites.clientId })
    .from(contracts)
    .innerJoin(suppliers, eq(suppliers.id, contracts.supplierId))
    .innerJoin(sites, eq(sites.id, contracts.siteId))
    .where(and(eq(contracts.id, id), eq(contracts.orgId, p.orgId), isNull(contracts.deletedAt)));
  const r = rows[0];
  if (!r) throw notFound("Contrato");
  return r;
}

export async function getContract(db: DbLike, p: Principal, id: string) {
  const r = await loadContract(db, p, id);
  return contractDto(r.c, r.s, r.clientId);
}

export async function listContracts(
  db: DbLike,
  p: Principal,
  q: { limit: number; cursor?: string; client_id?: string; supplier_cnpj?: string },
) {
  const conds: (SQL | undefined)[] = [eq(contracts.orgId, p.orgId), isNull(contracts.deletedAt)];
  if (q.client_id) conds.push(eq(sites.clientId, q.client_id));
  if (q.supplier_cnpj) conds.push(eq(suppliers.cnpj, q.supplier_cnpj));
  conds.push(after(q.cursor, contracts.createdAt, contracts.id));
  const rows = await db
    .select({ c: contracts, s: suppliers, clientId: sites.clientId })
    .from(contracts)
    .innerJoin(suppliers, eq(suppliers.id, contracts.supplierId))
    .innerJoin(sites, eq(sites.id, contracts.siteId))
    .where(and(...conds))
    .orderBy(asc(contracts.createdAt), asc(contracts.id))
    .limit(q.limit + 1);
  return pageOf(
    rows.map((r) => ({ ...r, createdAt: r.c.createdAt, id: r.c.id })),
    q.limit,
    (r) => contractDto(r.c, r.s, r.clientId),
  );
}

export async function updateContract(
  db: DbLike,
  p: Principal,
  id: string,
  patch: Partial<Omit<ContractInput, "site_id" | "supplier_cnpj" | "supplier_name" | "confirm_overlap">>,
) {
  const cur = await loadContract(db, p, id);
  const start = patch.start_date ?? cur.c.startDate;
  const end = patch.end_date ?? cur.c.endDate;
  checkPeriod(start, end);
  const [c] = await db
    .update(contracts)
    .set({
      startDate: start,
      endDate: end,
      volumeMwm: patch.volume_mwm ?? cur.c.volumeMwm,
      priceBrlPerMwh: patch.price_brl_per_mwh ?? cur.c.priceBrlPerMwh,
      guaranteeBrl: patch.guarantee_brl === undefined ? cur.c.guaranteeBrl : patch.guarantee_brl,
      guaranteeType: patch.guarantee_type ?? cur.c.guaranteeType,
      notes: patch.notes === undefined ? cur.c.notes : patch.notes,
      updatedAt: new Date(),
    })
    .where(and(eq(contracts.id, id), eq(contracts.orgId, p.orgId)))
    .returning();
  await audit(db, p, "contract.updated", { type: "contract", id }, { fields: Object.keys(patch) });
  await rescanPublishedEvents(db, [cur.s.id]);
  return contractDto(c!, cur.s, cur.clientId);
}

export async function deleteContract(db: DbLike, p: Principal, id: string) {
  await loadContract(db, p, id);
  await db
    .update(contracts)
    .set({ deletedAt: new Date() })
    .where(and(eq(contracts.id, id), eq(contracts.orgId, p.orgId)));
  await audit(db, p, "contract.deleted", { type: "contract", id });
}

// ------------------------------------------------------------------ importação CSV

export async function importContractsCsv(
  db: DbLike,
  p: Principal,
  filename: string,
  text: string,
  mandateAccepted: boolean,
) {
  if (!mandateAccepted) {
    throw invalid("É preciso declarar o mandato dos clientes para importar contratos.", {
      field: "mandate",
      text_version: MANDATE_TEXT_VERSION,
      text: MANDATE_TEXT,
    });
  }
  const parsed = parseContractsCsv(text);
  const total = text.split(/\r?\n/).filter((l) => l.trim()).length - 1;
  if (!parsed.ok) {
    const [rec] = await db
      .insert(imports)
      .values({
        orgId: p.orgId,
        kind: "contracts",
        filename,
        rowsTotal: Math.max(0, total),
        rowsOk: 0,
        rowsRejected: Math.max(0, total),
        errors: parsed.errors,
        createdBy: p.userId!,
      })
      .returning();
    await audit(db, p, "import.contracts.rejected", { type: "import", id: rec!.id }, { errors: parsed.errors.length });
    return { import_id: rec!.id, accepted: false, rows_ok: 0, errors: parsed.errors };
  }
  const run = async (tx: DbLike) => {
    const created: string[] = [];
    const supplierIds = new Set<string>();
    for (const row of parsed.rows) {
      const r = await importRow(tx, p, row);
      created.push(r.contractId);
      supplierIds.add(r.supplierId);
    }
    await rescanPublishedEvents(tx, [...supplierIds]);
    const [rec] = await tx
      .insert(imports)
      .values({
        orgId: p.orgId,
        kind: "contracts",
        filename,
        rowsTotal: parsed.rows.length,
        rowsOk: parsed.rows.length,
        rowsRejected: 0,
        errors: [],
        createdBy: p.userId!,
      })
      .returning();
    await tx.insert(dataMandates).values({
      orgId: p.orgId,
      userId: p.userId!,
      textVersion: MANDATE_TEXT_VERSION,
      context: `import:${rec!.id}`,
    });
    await audit(tx, p, "import.contracts.accepted", { type: "import", id: rec!.id }, { rows: created.length });
    return { import_id: rec!.id, accepted: true, rows_ok: created.length, errors: [] };
  };
  return db.transaction(run);
}

async function importRow(db: DbLike, p: Principal, row: ContractRow) {
  let [client] = await db
    .select()
    .from(clients)
    .where(and(eq(clients.orgId, p.orgId), eq(clients.cnpj, row.clientCnpj), isNull(clients.deletedAt)));
  client ??= (
    await db.insert(clients).values({ orgId: p.orgId, legalName: row.clientName, cnpj: row.clientCnpj }).returning()
  )[0]!;
  let [site] = await db
    .select()
    .from(sites)
    .where(
      and(
        eq(sites.orgId, p.orgId),
        eq(sites.clientId, client.id),
        eq(sites.name, row.siteName),
        isNull(sites.deletedAt),
      ),
    );
  site ??= (
    await db
      .insert(sites)
      .values({ orgId: p.orgId, clientId: client.id, name: row.siteName, submarket: row.submarket })
      .returning()
  )[0]!;
  const supplier = await findOrCreateSupplier(db, row.supplierCnpj, row.supplierName);
  const [c] = await db
    .insert(contracts)
    .values({
      orgId: p.orgId,
      siteId: site.id,
      supplierId: supplier.id,
      startDate: row.startDate,
      endDate: row.endDate,
      volumeMwm: row.volumeMwm,
      priceBrlPerMwh: row.priceBrlPerMwh,
      guaranteeBrl: row.guaranteeBrl,
      guaranteeType: row.guaranteeType,
    })
    .returning({ id: contracts.id });
  return { contractId: c!.id, supplierId: supplier.id };
}
