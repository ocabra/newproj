import { and, asc, desc, eq, inArray, isNull, lte, or, sql, type SQL } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import type { DbLike } from "../db/client.js";
import {
  alerts,
  clients,
  contracts,
  events,
  imports,
  leverageObservations,
  organizations,
  referencePrices,
  sites,
  supplierResponses,
  suppliers,
} from "../db/schema.js";
import { cnpjRoot } from "../domain/cnpj.js";
import { parseLeverageCsv } from "../domain/csv.js";
import { civilDateInSaoPaulo, isValidCivilDate } from "../domain/dates.js";
import { computeExposure } from "../domain/exposure.js";
import {
  EVENT_TYPE_LABEL_PT,
  evaluate,
  RULE_VERSION,
  SEVERITY_BY_EVENT_TYPE,
  type EventType,
} from "../domain/rules.js";
import { AppError, conflict, invalid, notFound } from "../http/errors.js";
import { audit } from "./audit.js";
import { decodeCursor, encodeCursor } from "./cursor.js";
import { findOrCreateSupplier } from "./suppliers.js";
import type { Principal } from "./principal.js";

type EventRow = typeof events.$inferSelect;
type SupplierRow = typeof suppliers.$inferSelect;

// ------------------------------------------------------------------ DTOs

async function responsesFor(db: DbLike, eventIds: string[]) {
  if (!eventIds.length) return new Map<string, { body: string; created_at: string }[]>();
  const rows = await db
    .select()
    .from(supplierResponses)
    .where(inArray(supplierResponses.eventId, eventIds))
    .orderBy(asc(supplierResponses.createdAt));
  const m = new Map<string, { body: string; created_at: string }[]>();
  for (const r of rows) {
    const list = m.get(r.eventId) ?? [];
    list.push({ body: r.body, created_at: r.createdAt.toISOString() });
    m.set(r.eventId, list);
  }
  return m;
}

export function eventDto(e: EventRow, s: SupplierRow, responses: { body: string; created_at: string }[] = []) {
  return {
    id: e.id,
    type: e.type,
    type_label: EVENT_TYPE_LABEL_PT[e.type],
    severity: SEVERITY_BY_EVENT_TYPE[e.type],
    scope: e.scope,
    event_date: e.eventDate,
    source_published_on: e.sourcePublishedOn,
    source_name: e.sourceName,
    source_url: e.sourceUrl,
    summary: e.summary,
    caveat: e.caveat,
    status: e.status,
    supplier: { cnpj: s.cnpj, legal_name: s.legalName },
    supplier_responses: responses,
    retracted_at: e.retractedAt?.toISOString() ?? null,
    retraction_reason: e.retractionReason,
  };
}

// ------------------------------------------------------------------ preços de referência

export async function addReferencePrice(
  db: DbLike,
  p: Principal,
  input: {
    submarket: "SE_CO" | "S" | "NE" | "N";
    reference_date: string;
    price_brl_per_mwh: number;
    source_name: string;
    source_url: string;
  },
) {
  if (!isValidCivilDate(input.reference_date)) throw invalid("Data inválida.", { field: "reference_date" });
  const [r] = await db
    .insert(referencePrices)
    .values({
      submarket: input.submarket,
      referenceDate: input.reference_date,
      priceBrlPerMwh: input.price_brl_per_mwh,
      sourceName: input.source_name,
      sourceUrl: input.source_url,
      createdBy: p.userId!,
    })
    .returning();
  await audit(db, p, "reference_price.created", { type: "reference_price", id: r!.id });
  return r!;
}

export async function listReferencePrices(db: DbLike) {
  return db.select().from(referencePrices).orderBy(desc(referencePrices.referenceDate)).limit(200);
}

async function latestReference(db: DbLike, submarket: "SE_CO" | "S" | "NE" | "N", asOf: string) {
  const [r] = await db
    .select()
    .from(referencePrices)
    .where(and(eq(referencePrices.submarket, submarket), lte(referencePrices.referenceDate, asOf)))
    .orderBy(desc(referencePrices.referenceDate), desc(referencePrices.createdAt))
    .limit(1);
  return r
    ? {
        priceBrlPerMwh: r.priceBrlPerMwh,
        referenceDate: r.referenceDate,
        sourceName: r.sourceName,
        sourceUrl: r.sourceUrl,
      }
    : null;
}

// ------------------------------------------------------------------ curadoria de eventos

export interface EventInput {
  supplier_cnpj: string;
  supplier_name?: string;
  type: EventType;
  scope?: "entity" | "group";
  event_date: string;
  source_published_on: string;
  source_name: string;
  source_url: string;
  summary: string;
  caveat?: string | null;
}

export async function createEvent(db: DbLike, p: Principal, input: EventInput) {
  for (const f of ["event_date", "source_published_on"] as const) {
    if (!isValidCivilDate(input[f])) throw invalid("Data inválida.", { field: f });
  }
  if (!/^https?:\/\//.test(input.source_url)) throw invalid("Fonte deve ser URL http(s).", { field: "source_url" });
  const supplier = await findOrCreateSupplier(db, input.supplier_cnpj, input.supplier_name);
  const [e] = await db
    .insert(events)
    .values({
      supplierId: supplier.id,
      type: input.type,
      scope: input.scope ?? "entity",
      eventDate: input.event_date,
      sourcePublishedOn: input.source_published_on,
      sourceName: input.source_name.trim(),
      sourceUrl: input.source_url.trim(),
      summary: input.summary.trim(),
      caveat: input.caveat ?? null,
      createdBy: p.userId!,
    })
    .returning();
  await audit(db, p, "event.created", { type: "event", id: e!.id });
  return eventDto(e!, supplier);
}

export async function listEventsForOperator(db: DbLike, status?: "draft" | "published" | "retracted") {
  const rows = await db
    .select({ e: events, s: suppliers })
    .from(events)
    .innerJoin(suppliers, eq(suppliers.id, events.supplierId))
    .where(status ? eq(events.status, status) : undefined)
    .orderBy(desc(events.createdAt))
    .limit(500);
  const ids = rows.map((r) => r.e.id);
  const resp = await responsesFor(db, ids);
  const counts = ids.length
    ? await db
        .select({ eventId: alerts.eventId, n: sql<number>`count(*)::int` })
        .from(alerts)
        .where(inArray(alerts.eventId, ids))
        .groupBy(alerts.eventId)
    : [];
  const byEvent = new Map(counts.map((c) => [c.eventId, c.n]));
  // Só a contagem agregada: a operação não precisa saber quais carteiras foram alertadas.
  return rows.map((r) => ({ ...eventDto(r.e, r.s, resp.get(r.e.id)), alerts_count: byEvent.get(r.e.id) ?? 0 }));
}

/** Contratos candidatos de um evento: mesmo CNPJ, ou mesma raiz se o evento é de grupo. */
async function candidateContracts(db: DbLike, e: EventRow, s: SupplierRow) {
  const supplierCond =
    e.scope === "group" ? sql`substring(${suppliers.cnpj} from 1 for 8) = ${cnpjRoot(s.cnpj)}` : eq(suppliers.id, s.id);
  return db
    .select({ c: contracts, supplierCnpj: suppliers.cnpj, orgStatus: organizations.status, submarket: sites.submarket })
    .from(contracts)
    .innerJoin(suppliers, eq(suppliers.id, contracts.supplierId))
    .innerJoin(organizations, eq(organizations.id, contracts.orgId))
    .innerJoin(sites, eq(sites.id, contracts.siteId))
    .where(and(supplierCond, isNull(contracts.deletedAt)));
}

function ruleEvent(e: EventRow, s: SupplierRow) {
  return {
    id: e.id,
    supplierCnpj: s.cnpj,
    scope: e.scope,
    type: e.type,
    eventDate: e.eventDate,
    status: e.status,
  };
}

/** Executa o motor rules@1 para um evento publicado. Idempotente (unicidade contrato×evento). */
export async function runEngine(db: DbLike, eventId: string, now = new Date()) {
  const [row] = await db
    .select({ e: events, s: suppliers })
    .from(events)
    .innerJoin(suppliers, eq(suppliers.id, events.supplierId))
    .where(eq(events.id, eventId));
  if (!row) throw notFound("Evento");
  const asOf = civilDateInSaoPaulo(now);
  const cands = await candidateContracts(db, row.e, row.s);
  let created = 0;
  for (const cand of cands) {
    const result = evaluate(
      {
        id: cand.c.id,
        supplierCnpj: cand.supplierCnpj,
        startDate: cand.c.startDate,
        endDate: cand.c.endDate,
        deleted: cand.c.deletedAt !== null,
        orgApproved: cand.orgStatus === "approved",
      },
      ruleEvent(row.e, row.s),
    );
    if (!result.match) continue;
    const ref = await latestReference(db, cand.submarket, asOf);
    const exp = computeExposure({
      asOf,
      startDate: cand.c.startDate,
      endDate: cand.c.endDate,
      volumeMwm: cand.c.volumeMwm,
      priceBrlPerMwh: cand.c.priceBrlPerMwh,
      guaranteeBrl: cand.c.guaranteeBrl,
      reference: ref,
    });
    const reasons = exp.reason ? [...result.reasons, exp.reason] : result.reasons;
    const inserted = await db
      .insert(alerts)
      .values({
        orgId: cand.c.orgId,
        contractId: cand.c.id,
        eventId: row.e.id,
        ruleVersion: result.ruleVersion,
        severity: result.severity,
        reasons,
        snapshot: {
          supplier_cnpj: cand.supplierCnpj,
          event_supplier_cnpj: row.s.cnpj,
          event_type: row.e.type,
          event_date: row.e.eventDate,
          event_scope: row.e.scope,
          contract_start_date: cand.c.startDate,
          contract_end_date: cand.c.endDate,
          volume_mwm: cand.c.volumeMwm,
          price_brl_per_mwh: cand.c.priceBrlPerMwh,
          guarantee_brl: cand.c.guaranteeBrl,
          submarket: cand.submarket,
          computed_at: now.toISOString(),
        },
        exposure: exp.exposure,
      })
      .onConflictDoNothing()
      .returning({ id: alerts.id });
    created += inserted.length;
  }
  return { evaluated: cands.length, created };
}

export async function publishEvent(db: DbLike, p: Principal, id: string) {
  return db.transaction(async (tx) => {
    const [e] = await tx.select().from(events).where(eq(events.id, id)).for("update");
    if (!e) throw notFound("Evento");
    if (e.status === "retracted") throw conflict("Evento retirado não pode ser republicado; crie um novo.");
    if (e.status === "draft") {
      await tx
        .update(events)
        .set({ status: "published", publishedAt: new Date(), publishedBy: p.userId })
        .where(eq(events.id, id));
    }
    const r = await runEngine(tx, id);
    await audit(tx, p, "event.published", { type: "event", id }, r);
    return r;
  });
}

export async function retractEvent(db: DbLike, p: Principal, id: string, reason: string) {
  if (reason.trim().length < 5) throw invalid("Informe a justificativa da retirada.", { field: "reason" });
  return db.transaction(async (tx) => {
    const [e] = await tx.select().from(events).where(eq(events.id, id)).for("update");
    if (!e) throw notFound("Evento");
    if (e.status !== "published") throw conflict("Só eventos publicados podem ser retirados.");
    await tx
      .update(events)
      .set({ status: "retracted", retractedAt: new Date(), retractedBy: p.userId, retractionReason: reason.trim() })
      .where(eq(events.id, id));
    const changed = await tx
      .update(alerts)
      .set({ status: "retracted", statusChangedAt: new Date(), statusChangedBy: p.userId })
      .where(and(eq(alerts.eventId, id), inArray(alerts.status, ["open", "acknowledged"])))
      .returning({ id: alerts.id });
    await audit(tx, p, "event.retracted", { type: "event", id }, { alerts_retracted: changed.length });
    return { alerts_retracted: changed.length };
  });
}

/** Reaplica o motor a eventos publicados (ex.: após criar contratos novos). Idempotente. */
export async function rescanPublishedEvents(db: DbLike, supplierIds?: string[]) {
  const rows = await db
    .select({ id: events.id })
    .from(events)
    .where(
      and(eq(events.status, "published"), supplierIds?.length ? inArray(events.supplierId, supplierIds) : undefined),
    );
  let created = 0;
  for (const r of rows) created += (await runEngine(db, r.id)).created;
  return created;
}

// ------------------------------------------------------------------ alertas (tenant)

// Fornecedor do CONTRATO (pode diferir do fornecedor do evento quando o evento vale para o grupo econômico).
const contractSupplier = alias(suppliers, "contract_supplier");

const alertSelect = {
  a: alerts,
  e: events,
  s: suppliers,
  c: contracts,
  cs: contractSupplier,
  siteName: sites.name,
  clientId: clients.id,
  clientName: clients.legalName,
};

function alertQuery(db: DbLike) {
  return db
    .select(alertSelect)
    .from(alerts)
    .innerJoin(events, eq(events.id, alerts.eventId))
    .innerJoin(suppliers, eq(suppliers.id, events.supplierId))
    .innerJoin(contracts, eq(contracts.id, alerts.contractId))
    .innerJoin(contractSupplier, eq(contractSupplier.id, contracts.supplierId))
    .innerJoin(sites, eq(sites.id, contracts.siteId))
    .innerJoin(clients, eq(clients.id, sites.clientId));
}

type AlertJoin = Awaited<ReturnType<ReturnType<typeof alertQuery>["where"]>>[number];

function alertDto(r: AlertJoin, responses: { body: string; created_at: string }[]) {
  return {
    id: r.a.id,
    severity: r.a.severity,
    status: r.a.status,
    rule_version: r.a.ruleVersion,
    reasons: r.a.reasons,
    created_at: r.a.createdAt.toISOString(),
    status_changed_at: r.a.statusChangedAt?.toISOString() ?? null,
    contract: {
      id: r.c.id,
      client_id: r.clientId,
      client_legal_name: r.clientName,
      site_name: r.siteName,
      start_date: r.c.startDate,
      end_date: r.c.endDate,
      volume_mwm: r.c.volumeMwm,
      supplier: { cnpj: r.cs.cnpj, legal_name: r.cs.legalName },
    },
    event: eventDto(r.e, r.s, responses),
    exposure: (r.a.exposure as ReturnType<typeof computeExposure>["exposure"]) ?? null,
    exposure_reason: r.a.exposure ? null : "no_reference_price",
  };
}

export async function listAlerts(
  db: DbLike,
  p: Principal,
  q: {
    limit: number;
    cursor?: string;
    status?: "open" | "acknowledged" | "resolved" | "retracted";
    severity?: "critical" | "high" | "info";
    supplier_cnpj?: string;
    client_id?: string;
  },
) {
  const conds: (SQL | undefined)[] = [eq(alerts.orgId, p.orgId), isNull(contracts.deletedAt)];
  if (q.status) conds.push(eq(alerts.status, q.status));
  if (q.severity) conds.push(eq(alerts.severity, q.severity));
  if (q.supplier_cnpj) conds.push(eq(contractSupplier.cnpj, q.supplier_cnpj));
  if (q.client_id) conds.push(eq(clients.id, q.client_id));
  // Mais recentes primeiro: cursor (created_at, id) descendente.
  const cur = decodeCursor(q.cursor);
  if (cur) {
    conds.push(
      or(
        sql`${alerts.createdAt} < ${cur.createdAt}`,
        and(eq(alerts.createdAt, cur.createdAt), sql`${alerts.id} < ${cur.id}`),
      ),
    );
  }
  const rows = await alertQuery(db)
    .where(and(...conds))
    .orderBy(desc(alerts.createdAt), desc(alerts.id))
    .limit(q.limit + 1);
  const more = rows.length > q.limit;
  const slice = more ? rows.slice(0, q.limit) : rows;
  const resp = await responsesFor(
    db,
    slice.map((r) => r.e.id),
  );
  const last = slice[slice.length - 1];
  return {
    data: slice.map((r) => alertDto(r, resp.get(r.e.id) ?? [])),
    next_cursor: more && last ? encodeCursor(last.a.createdAt, last.a.id) : null,
  };
}

export async function getAlert(db: DbLike, p: Principal, id: string) {
  const [r] = await alertQuery(db).where(
    and(eq(alerts.id, id), eq(alerts.orgId, p.orgId), isNull(contracts.deletedAt)),
  );
  if (!r) throw notFound("Alerta");
  const resp = await responsesFor(db, [r.e.id]);
  return alertDto(r, resp.get(r.e.id) ?? []);
}

export async function setAlertStatus(
  db: DbLike,
  p: Principal,
  id: string,
  status: "open" | "acknowledged" | "resolved",
) {
  const cur = await getAlert(db, p, id);
  if (cur.status === "retracted") throw conflict("Alerta de evento retirado não muda de status.");
  await db
    .update(alerts)
    .set({ status, statusChangedAt: new Date(), statusChangedBy: p.userId })
    .where(and(eq(alerts.id, id), eq(alerts.orgId, p.orgId)));
  await audit(db, p, "alert.status_changed", { type: "alert", id }, { from: cur.status, to: status });
  return getAlert(db, p, id);
}

export async function alertSummary(db: DbLike, p: Principal) {
  const rows = await db
    .select({ severity: alerts.severity, status: alerts.status, n: sql<number>`count(*)::int` })
    .from(alerts)
    .innerJoin(contracts, eq(contracts.id, alerts.contractId))
    .where(and(eq(alerts.orgId, p.orgId), isNull(contracts.deletedAt)))
    .groupBy(alerts.severity, alerts.status);
  return rows;
}

/** "Por que este contrato (não) tem alerta?": avalia rules@1 contra todos os eventos do fornecedor. */
export async function explainContract(db: DbLike, p: Principal, contractId: string) {
  const [row] = await db
    .select({ c: contracts, s: suppliers, org: organizations })
    .from(contracts)
    .innerJoin(suppliers, eq(suppliers.id, contracts.supplierId))
    .innerJoin(organizations, eq(organizations.id, contracts.orgId))
    .where(and(eq(contracts.id, contractId), eq(contracts.orgId, p.orgId), isNull(contracts.deletedAt)));
  if (!row) throw notFound("Contrato");
  const evs = await db
    .select({ e: events, s: suppliers })
    .from(events)
    .innerJoin(suppliers, eq(suppliers.id, events.supplierId))
    .where(
      or(
        eq(events.supplierId, row.s.id),
        and(eq(events.scope, "group"), sql`substring(${suppliers.cnpj} from 1 for 8) = ${cnpjRoot(row.s.cnpj)}`),
      ),
    )
    .orderBy(desc(events.eventDate));
  const evaluated = evs.map(({ e, s }) => {
    const r = evaluate(
      {
        id: row.c.id,
        supplierCnpj: row.s.cnpj,
        startDate: row.c.startDate,
        endDate: row.c.endDate,
        deleted: false,
        orgApproved: row.org.status === "approved",
      },
      ruleEvent(e, s),
    );
    return {
      event_id: e.id,
      event_type: e.type,
      event_date: e.eventDate,
      supplier_cnpj: s.cnpj,
      match: r.match,
      severity: r.severity,
      checks: r.checks,
    };
  });
  const matches = evaluated.filter((x) => x.match).length;
  const summary =
    evaluated.length === 0
      ? `Nenhum evento público curado para o fornecedor ${row.s.legalName} (CNPJ ${row.s.cnpj}). Ausência de evento não significa ausência de risco.`
      : matches === 0
        ? `${evaluated.length} evento(s) do fornecedor avaliado(s); nenhum atende a todas as regras (veja os checks).`
        : `${matches} de ${evaluated.length} evento(s) do fornecedor geram alerta para este contrato.`;
  return { contract_id: row.c.id, rule_version: RULE_VERSION, summary, evaluated_events: evaluated };
}

// ------------------------------------------------------------------ fornecedor: direito de resposta

function requireSupplierLink(p: Principal) {
  if (!p.supplierId)
    throw new AppError("forbidden", "Organização fornecedora ainda não vinculada a um CNPJ do catálogo.");
  return p.supplierId;
}

export async function listEventsAboutMe(db: DbLike, p: Principal) {
  const supplierId = requireSupplierLink(p);
  const rows = await db
    .select({ e: events, s: suppliers })
    .from(events)
    .innerJoin(suppliers, eq(suppliers.id, events.supplierId))
    .where(and(eq(events.supplierId, supplierId), inArray(events.status, ["published", "retracted"])))
    .orderBy(desc(events.eventDate));
  const resp = await responsesFor(
    db,
    rows.map((r) => r.e.id),
  );
  // Nunca revela quais carteiras contêm o fornecedor.
  return rows.map((r) => eventDto(r.e, r.s, resp.get(r.e.id)));
}

export async function respondToEvent(db: DbLike, p: Principal, eventId: string, body: string) {
  const supplierId = requireSupplierLink(p);
  if (body.trim().length < 10) throw invalid("Resposta muito curta.", { field: "body" });
  const [e] = await db
    .select()
    .from(events)
    .where(and(eq(events.id, eventId), eq(events.supplierId, supplierId), eq(events.status, "published")));
  if (!e) throw notFound("Evento");
  const [r] = await db
    .insert(supplierResponses)
    .values({ eventId, supplierOrgId: p.orgId, authorUserId: p.userId!, body: body.trim() })
    .returning();
  await audit(db, p, "supplier_response.created", { type: "event", id: eventId });
  return { id: r!.id, body: r!.body, created_at: r!.createdAt.toISOString() };
}

// ------------------------------------------------------------------ Fator de Alavancagem (curadoria)

/**
 * Importa série de FA. Quando a faixa piora em relação à semana anterior do mesmo fornecedor, cria um evento
 * RASCUNHO `leverage_band_worsened` para revisão humana (nunca publica sozinho).
 */
export async function importLeverageCsv(db: DbLike, p: Principal, filename: string, text: string) {
  const parsed = parseLeverageCsv(text);
  if (!parsed.ok) {
    const [rec] = await db
      .insert(imports)
      .values({
        orgId: p.orgId,
        kind: "leverage",
        filename,
        rowsTotal: 0,
        rowsOk: 0,
        rowsRejected: parsed.errors.length,
        errors: parsed.errors,
        createdBy: p.userId!,
      })
      .returning();
    return { import_id: rec!.id, accepted: false, rows_ok: 0, drafts_created: 0, errors: parsed.errors };
  }
  return db.transaction(async (tx) => {
    let drafts = 0;
    const rows = [...parsed.rows].sort((a, b) => a.weekStart.localeCompare(b.weekStart));
    for (const r of rows) {
      const supplier = await findOrCreateSupplier(tx, r.supplierCnpj, r.supplierName);
      const [prev] = await tx
        .select()
        .from(leverageObservations)
        .where(
          and(
            eq(leverageObservations.supplierId, supplier.id),
            sql`${leverageObservations.weekStart} < ${r.weekStart}`,
          ),
        )
        .orderBy(desc(leverageObservations.weekStart))
        .limit(1);
      await tx
        .insert(leverageObservations)
        .values({
          supplierId: supplier.id,
          weekStart: r.weekStart,
          bandRank: r.bandRank,
          value: r.value,
          sourceName: r.sourceName,
          sourceUrl: r.sourceUrl,
        })
        .onConflictDoUpdate({
          target: [leverageObservations.supplierId, leverageObservations.weekStart],
          set: { bandRank: r.bandRank, value: r.value, sourceName: r.sourceName, sourceUrl: r.sourceUrl },
        });
      if (prev && r.bandRank > prev.bandRank) {
        await tx.insert(events).values({
          supplierId: supplier.id,
          type: "leverage_band_worsened",
          eventDate: r.weekStart,
          sourcePublishedOn: r.weekStart,
          sourceName: r.sourceName,
          sourceUrl: r.sourceUrl,
          summary: `Faixa do Fator de Alavancagem passou de ${prev.bandRank} para ${r.bandRank} (maior = pior), semana de ${r.weekStart}. Rascunho gerado na importação; revisar antes de publicar.`,
          caveat: "Semântica oficial das faixas da CCEE não verificada neste protótipo.",
          createdBy: p.userId!,
        });
        drafts++;
      }
    }
    const [rec] = await tx
      .insert(imports)
      .values({
        orgId: p.orgId,
        kind: "leverage",
        filename,
        rowsTotal: rows.length,
        rowsOk: rows.length,
        rowsRejected: 0,
        errors: [],
        createdBy: p.userId!,
      })
      .returning();
    await audit(tx, p, "import.leverage.accepted", { type: "import", id: rec!.id }, { rows: rows.length, drafts });
    return { import_id: rec!.id, accepted: true, rows_ok: rows.length, drafts_created: drafts, errors: [] };
  });
}

export async function listSuppliers(db: DbLike) {
  return db.select().from(suppliers).orderBy(asc(suppliers.legalName)).limit(1000);
}

/** Dados de um fornecedor para a gestora: eventos publicados (sem revelar outras carteiras). */
export async function supplierPublicEvents(db: DbLike, supplierId: string) {
  const rows = await db
    .select({ e: events, s: suppliers })
    .from(events)
    .innerJoin(suppliers, eq(suppliers.id, events.supplierId))
    .where(and(eq(events.supplierId, supplierId), eq(events.status, "published")))
    .orderBy(desc(events.eventDate));
  const resp = await responsesFor(
    db,
    rows.map((r) => r.e.id),
  );
  return rows.map((r) => eventDto(r.e, r.s, resp.get(r.e.id)));
}
