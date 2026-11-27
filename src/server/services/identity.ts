import { and, desc, eq, gt, isNull } from "drizzle-orm";
import type { Db } from "../db/client.js";
import { invitations, memberships, organizations, sessions, suppliers, users } from "../db/schema.js";
import { isValidCnpj, normalizeCnpj } from "../domain/cnpj.js";
import { AppError, conflict, forbidden, invalid, notFound } from "../http/errors.js";
import { dummyVerify, hashPassword, verifyPassword } from "../security/passwords.js";
import { randomToken, sha256 } from "../security/tokens.js";
import { audit } from "./audit.js";
import type { OrgType, Principal, Role } from "./principal.js";

export const SESSION_TTL_MS = 12 * 60 * 60 * 1000;
export const INVITE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  org: { name: string; type: Exclude<OrgType, "operator">; cnpj: string };
}

function checkPassword(pw: string) {
  if (pw.length < 10) throw invalid("A senha deve ter pelo menos 10 caracteres.", { field: "password" });
}

export async function register(db: Db, input: RegisterInput, ip: string | null) {
  checkPassword(input.password);
  const cnpj = normalizeCnpj(input.org.cnpj);
  if (!isValidCnpj(cnpj)) throw invalid("CNPJ da organização inválido.", { field: "org.cnpj" });
  const email = input.email.trim().toLowerCase();
  const passwordHash = await hashPassword(input.password);
  return db.transaction(async (tx) => {
    const existing = await tx.select({ id: users.id }).from(users).where(eq(users.email, email));
    if (existing.length) throw conflict("E-mail já cadastrado.");
    const [org] = await tx
      .insert(organizations)
      .values({ name: input.org.name.trim(), type: input.org.type, cnpj, status: "pending" })
      .returning();
    const [user] = await tx.insert(users).values({ email, name: input.name.trim(), passwordHash }).returning();
    await tx.insert(memberships).values({ userId: user!.id, orgId: org!.id, role: "owner" });
    await audit(tx, { orgId: org!.id, userId: user!.id, apiKeyId: null, ip }, "org.registered", {
      type: "organization",
      id: org!.id,
    });
    return { userId: user!.id, orgId: org!.id };
  });
}

export async function createSession(db: Db, userId: string, orgId: string, ip: string | null) {
  const token = randomToken();
  await db.insert(sessions).values({
    tokenHash: sha256(token),
    userId,
    orgId,
    ip,
    expiresAt: new Date(Date.now() + SESSION_TTL_MS),
  });
  return token;
}

export async function login(db: Db, emailRaw: string, password: string, ip: string | null) {
  const email = emailRaw.trim().toLowerCase();
  const rows = await db
    .select({ user: users, orgId: memberships.orgId })
    .from(users)
    .innerJoin(memberships, eq(memberships.userId, users.id))
    .where(eq(users.email, email));
  const row = rows[0];
  if (!row) {
    await dummyVerify(password);
    throw new AppError("unauthenticated", "E-mail ou senha incorretos.");
  }
  if (!(await verifyPassword(row.user.passwordHash, password))) {
    await audit(db, { orgId: row.orgId, userId: row.user.id, apiKeyId: null, ip }, "auth.login_failed");
    throw new AppError("unauthenticated", "E-mail ou senha incorretos.");
  }
  const token = await createSession(db, row.user.id, row.orgId, ip);
  await audit(db, { orgId: row.orgId, userId: row.user.id, apiKeyId: null, ip }, "auth.login");
  return token;
}

export async function principalFromSession(db: Db, token: string, ip: string | null): Promise<Principal | null> {
  const rows = await db
    .select({ s: sessions, org: organizations, role: memberships.role })
    .from(sessions)
    .innerJoin(organizations, eq(organizations.id, sessions.orgId))
    .innerJoin(memberships, and(eq(memberships.userId, sessions.userId), eq(memberships.orgId, sessions.orgId)))
    .where(and(eq(sessions.tokenHash, sha256(token)), isNull(sessions.revokedAt), gt(sessions.expiresAt, new Date())));
  const r = rows[0];
  if (!r) return null;
  return {
    kind: "session",
    userId: r.s.userId,
    apiKeyId: null,
    orgId: r.org.id,
    orgType: r.org.type,
    orgStatus: r.org.status,
    supplierId: r.org.supplierId,
    role: r.role,
    scopes: null,
    ip,
  };
}

export async function logout(db: Db, token: string) {
  await db
    .update(sessions)
    .set({ revokedAt: new Date() })
    .where(eq(sessions.tokenHash, sha256(token)));
}

export async function me(db: Db, p: Principal) {
  const [org] = await db.select().from(organizations).where(eq(organizations.id, p.orgId));
  const user = p.userId
    ? (
        await db
          .select({ id: users.id, name: users.name, email: users.email })
          .from(users)
          .where(eq(users.id, p.userId))
      )[0]
    : null;
  return {
    user: user ?? null,
    role: p.role,
    via: p.kind,
    scopes: p.scopes,
    organization: { id: org!.id, name: org!.name, type: org!.type, status: org!.status, cnpj: org!.cnpj },
  };
}

// ------------------------------------------------------------------ convites

export async function createInvitation(db: Db, p: Principal, email: string, role: Role) {
  const allowed: Role[] = p.orgType === "operator" ? ["admin", "curator"] : ["owner", "member"];
  if (!allowed.includes(role)) throw invalid(`Papel inválido para esta organização: use ${allowed.join(" ou ")}.`);
  const token = randomToken();
  const [inv] = await db
    .insert(invitations)
    .values({
      orgId: p.orgId,
      email: email.trim().toLowerCase(),
      role,
      tokenHash: sha256(token),
      expiresAt: new Date(Date.now() + INVITE_TTL_MS),
      createdBy: p.userId!,
    })
    .returning();
  await audit(db, p, "invitation.created", { type: "invitation", id: inv!.id }, { role });
  // MVP sem e-mail transacional: o link é devolvido a quem convidou (docs/08 §5).
  return { id: inv!.id, email: inv!.email, role, expiresAt: inv!.expiresAt, token };
}

export async function listInvitations(db: Db, p: Principal) {
  return db
    .select({
      id: invitations.id,
      email: invitations.email,
      role: invitations.role,
      expiresAt: invitations.expiresAt,
      acceptedAt: invitations.acceptedAt,
    })
    .from(invitations)
    .where(eq(invitations.orgId, p.orgId))
    .orderBy(desc(invitations.createdAt));
}

export async function acceptInvitation(
  db: Db,
  token: string,
  input: { name: string; password: string },
  ip: string | null,
) {
  checkPassword(input.password);
  const passwordHash = await hashPassword(input.password);
  return db.transaction(async (tx) => {
    const [inv] = await tx
      .select()
      .from(invitations)
      .where(
        and(
          eq(invitations.tokenHash, sha256(token)),
          isNull(invitations.acceptedAt),
          gt(invitations.expiresAt, new Date()),
        ),
      );
    if (!inv) throw notFound("Convite válido");
    const exists = await tx.select({ id: users.id }).from(users).where(eq(users.email, inv.email));
    if (exists.length) throw conflict("Já existe uma conta com este e-mail.");
    const [user] = await tx
      .insert(users)
      .values({ email: inv.email, name: input.name.trim(), passwordHash })
      .returning();
    await tx.insert(memberships).values({ userId: user!.id, orgId: inv.orgId, role: inv.role });
    await tx.update(invitations).set({ acceptedAt: new Date() }).where(eq(invitations.id, inv.id));
    await audit(tx, { orgId: inv.orgId, userId: user!.id, apiKeyId: null, ip }, "invitation.accepted", {
      type: "invitation",
      id: inv.id,
    });
    return { userId: user!.id, orgId: inv.orgId };
  });
}

// ------------------------------------------------------------------ operação: aprovação de organizações

export async function listOrganizations(db: Db, status?: "pending" | "approved" | "rejected" | "suspended") {
  const q = db.select().from(organizations).orderBy(desc(organizations.createdAt));
  return status ? q.where(eq(organizations.status, status)) : q;
}

export async function setOrganizationStatus(
  db: Db,
  p: Principal,
  orgId: string,
  status: "approved" | "rejected" | "suspended",
) {
  return db.transaction(async (tx) => {
    const [org] = await tx.select().from(organizations).where(eq(organizations.id, orgId));
    if (!org) throw notFound("Organização");
    if (org.type === "operator") throw forbidden("Organizações de operação não são alteradas por aqui.");
    let supplierId = org.supplierId;
    if (status === "approved" && org.type === "supplier" && !supplierId) {
      // Vincula a organização fornecedora ao catálogo pelo CNPJ declarado no cadastro.
      const cnpj = org.cnpj!;
      const [found] = await tx.select().from(suppliers).where(eq(suppliers.cnpj, cnpj));
      supplierId = found?.id ?? (await tx.insert(suppliers).values({ cnpj, legalName: org.name }).returning())[0]!.id;
    }
    const [updated] = await tx
      .update(organizations)
      .set({
        status,
        supplierId,
        approvedAt: status === "approved" ? new Date() : org.approvedAt,
        approvedBy: status === "approved" ? p.userId : org.approvedBy,
      })
      .where(eq(organizations.id, orgId))
      .returning();
    if (status !== "approved") {
      await tx.update(sessions).set({ revokedAt: new Date() }).where(eq(sessions.orgId, orgId));
    }
    await audit(tx, p, `org.${status}`, { type: "organization", id: orgId });
    return updated!;
  });
}
