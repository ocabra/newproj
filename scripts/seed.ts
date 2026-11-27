/**
 * Dados SINTÉTICOS de demonstração (docs/08 §5). Idempotente: não faz nada se já houver organização de operação.
 * Nomes são fictícios e marcados "(sintética)". CNPJs têm dígito verificador válido por exigência do sistema e
 * PODEM coincidir com CNPJs reais por acaso; não representam nenhuma empresa.
 * Uso: npm run db:seed   (senha de todos os usuários: SEED_PASSWORD do .env)
 */
import { loadDotEnv } from "../src/server/config.js";
import { eq } from "drizzle-orm";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createDb } from "../src/server/db/client.js";
import { memberships, organizations, users } from "../src/server/db/schema.js";
import { cnpjFromBase } from "../src/server/domain/cnpj.js";
import { hashPassword } from "../src/server/security/passwords.js";
import { setOrganizationStatus } from "../src/server/services/identity.js";
import { createClient, createContract, createSite } from "../src/server/services/portfolio.js";
import type { Principal } from "../src/server/services/principal.js";
import {
  addReferencePrice,
  createEvent,
  importLeverageCsv,
  publishEvent,
  respondToEvent,
} from "../src/server/services/radar.js";

loadDotEnv();
const url = process.env.DATABASE_URL;
const password = process.env.SEED_PASSWORD ?? process.env.SEED_ADMIN_PASSWORD;
if (!url) throw new Error("DATABASE_URL ausente");
if (!password || password.length < 10) throw new Error("Defina SEED_PASSWORD (≥ 10 caracteres) no .env");

const { db, pool } = createDb(url);
const here = path.dirname(fileURLToPath(import.meta.url));

const existing = await db.select().from(organizations).where(eq(organizations.type, "operator"));
if (existing.length) {
  console.log("Seed já aplicado (existe organização de operação). Nada a fazer.");
  await pool.end();
  process.exit(0);
}

const hash = await hashPassword(password);
async function org(
  name: string,
  type: "manager" | "consumer" | "supplier" | "operator",
  cnpj: string | null,
  status: "pending" | "approved",
) {
  const [o] = await db.insert(organizations).values({ name, type, cnpj, status }).returning();
  return o!;
}
async function user(email: string, name: string, orgId: string, role: "owner" | "member" | "admin" | "curator") {
  const [u] = await db.insert(users).values({ email, name, passwordHash: hash }).returning();
  await db.insert(memberships).values({ userId: u!.id, orgId, role });
  return u!;
}
const principal = (
  o: typeof organizations.$inferSelect,
  userId: string,
  role: Principal["role"],
  supplierId: string | null = null,
): Principal => ({
  kind: "session",
  userId,
  apiKeyId: null,
  orgId: o.id,
  orgType: o.type,
  orgStatus: "approved",
  supplierId,
  role,
  scopes: null,
  ip: "seed",
});

// ---------------------------------------------------------------- organizações e usuários
const opOrg = await org("Operação da plataforma (sintética)", "operator", null, "approved");
const admin = await user("admin@radar.invalid", "Admin Sintético", opOrg.id, "admin");
const curator = await user("curadoria@radar.invalid", "Curadoria Sintética", opOrg.id, "curator");
const pAdmin = principal(opOrg, admin.id, "admin");
const pCur = principal(opOrg, curator.id, "curator");

const gestora = await org("Gestora Exemplo (sintética)", "manager", cnpjFromBase("910000010001"), "approved");
const gUser = await user("gestora@radar.invalid", "Pessoa Gestora", gestora.id, "owner");
const pG = principal(gestora, gUser.id, "owner");

const consumidor = await org("Indústria Exemplo (sintética)", "consumer", cnpjFromBase("910000020001"), "approved");
const cUser = await user("consumidor@radar.invalid", "Pessoa Compras", consumidor.id, "owner");
const pC = principal(consumidor, cUser.id, "owner");

const pend = await org("Gestora Pendente (sintética)", "manager", cnpjFromBase("910000030001"), "pending");
await user("pendente@radar.invalid", "Pessoa Pendente", pend.id, "owner");

const SUP = {
  alfa: { cnpj: "90000001000129", name: "Comercializadora Alfa (sintética)" },
  beta: { cnpj: "90000002000173", name: "Comercializadora Beta (sintética)" },
  gama: { cnpj: "90000003000118", name: "Varejista Gama (sintética)" },
  delta: { cnpj: "90000004000162", name: "Comercializadora Delta (sintética)" },
  epsilon: { cnpj: "90000005000107", name: "Comercializadora Épsilon (sintética)" },
};

// Fornecedor Alfa com acesso de direito de resposta
const fornOrg = await org(SUP.alfa.name, "supplier", SUP.alfa.cnpj, "pending");
const fUser = await user("fornecedor@radar.invalid", "Pessoa Fornecedora", fornOrg.id, "owner");
const fornApproved = await setOrganizationStatus(db, pAdmin, fornOrg.id, "approved");
const pF = principal(fornOrg, fUser.id, "owner", fornApproved.supplierId);

// ---------------------------------------------------------------- preços de referência (sintéticos)
for (const [submarket, price] of [
  ["SE_CO", 250],
  ["S", 245],
  ["NE", 230],
  ["N", 235],
] as const) {
  await addReferencePrice(db, pCur, {
    submarket,
    reference_date: "2026-11-01",
    price_brl_per_mwh: price,
    source_name: "Referência SINTÉTICA de demonstração (não é preço de mercado)",
    source_url: "https://exemplo.invalid/referencia-sintetica",
  });
}

// ---------------------------------------------------------------- carteira da gestora
const carteira = [
  {
    cliente: ["Metalúrgica Aurora (sintética)", "910000100001"],
    unidades: [
      ["Planta Campinas", "SE_CO", [[SUP.alfa, "2025-01-01", "2028-12-31", 3.5, 172, 900_000, "bank_guarantee"]]],
      ["Planta Sorocaba", "SE_CO", [[SUP.delta, "2026-01-01", "2027-12-31", 1.2, 205, null, "none"]]],
    ],
  },
  {
    cliente: ["Têxtil Horizonte (sintética)", "910000110001"],
    unidades: [
      [
        "Fábrica Blumenau",
        "S",
        [
          [SUP.beta, "2026-01-01", "2029-12-31", 2.0, 188, 400_000, "insurance"],
          [SUP.epsilon, "2030-01-01", "2032-12-31", 2.0, 210, null, "none"],
        ],
      ],
    ],
  },
  {
    cliente: ["Frigorífico Serra (sintético)", "910000120001"],
    unidades: [
      ["Unidade Recife", "NE", [[SUP.gama, "2025-07-01", "2027-06-30", 0.45, 230, null, "none"]]],
      ["Unidade Belém", "N", [[SUP.alfa, "2026-03-01", "2026-04-30", 0.3, 199, null, "none"]]],
    ],
  },
] as const;

for (const c of carteira) {
  const cli = await createClient(db, pG, { legal_name: c.cliente[0], cnpj: cnpjFromBase(c.cliente[1]) });
  for (const [nome, sub, contratos] of c.unidades) {
    const site = await createSite(db, pG, { client_id: cli.id, name: nome, submarket: sub });
    for (const [s, ini, fim, mwm, preco, garantia, tipo] of contratos) {
      await createContract(db, pG, {
        site_id: site.id,
        supplier_cnpj: s.cnpj,
        supplier_name: s.name,
        start_date: ini,
        end_date: fim,
        volume_mwm: mwm,
        price_brl_per_mwh: preco,
        guarantee_brl: garantia,
        guarantee_type: tipo,
      });
    }
  }
}

// Carteira do consumidor agente (um cliente: a própria empresa)
const self = await createClient(db, pC, { legal_name: consumidor.name, cnpj: consumidor.cnpj! });
const selfSite = await createSite(db, pC, { client_id: self.id, name: "Planta única", submarket: "SE_CO" });
await createContract(db, pC, {
  site_id: selfSite.id,
  supplier_cnpj: SUP.beta.cnpj,
  supplier_name: SUP.beta.name,
  start_date: "2026-01-01",
  end_date: "2028-12-31",
  volume_mwm: 5,
  price_brl_per_mwh: 195,
  guarantee_brl: 1_500_000,
  guarantee_type: "bank_guarantee",
});

// ---------------------------------------------------------------- curadoria: FA e eventos
const fa = fs.readFileSync(path.join(here, "samples/fa-sintetico.csv"), "utf8");
const faRes = await importLeverageCsv(db, pCur, "fa-sintetico.csv", fa);

const evAlfa = await createEvent(db, pCur, {
  supplier_cnpj: SUP.alfa.cnpj,
  type: "judicial_recovery_filed",
  event_date: "2026-05-20",
  source_published_on: "2026-05-21",
  source_name: "Fonte SINTÉTICA (demonstração)",
  source_url: "https://exemplo.invalid/rj-alfa",
  summary: "Pedido de recuperação judicial protocolado (evento fictício para demonstração).",
  caveat: "Dado sintético. Pedido de RJ não equivale a inadimplência com cada cliente.",
});
await publishEvent(db, pCur, evAlfa.id);

const evBeta = await createEvent(db, pCur, {
  supplier_cnpj: SUP.beta.cnpj,
  type: "balanced_operation",
  event_date: "2026-08-12",
  source_published_on: "2026-08-14",
  source_name: "Fonte SINTÉTICA (demonstração)",
  source_url: "https://exemplo.invalid/ob-beta",
  summary: "Determinada operação balanceada (evento fictício para demonstração).",
  caveat: "Dado sintético.",
});
await publishEvent(db, pCur, evBeta.id);

await createEvent(db, pCur, {
  supplier_cnpj: SUP.gama.cnpj,
  type: "mcp_default_listed",
  event_date: "2026-09-30",
  source_published_on: "2026-10-05",
  source_name: "Fonte SINTÉTICA (demonstração)",
  source_url: "https://exemplo.invalid/mcp-gama",
  summary: "Listada como inadimplente na liquidação (evento fictício; rascunho aguardando revisão).",
  caveat: "Débito com exigibilidade suspensa não é inadimplência.",
});

await respondToEvent(
  db,
  pF,
  evAlfa.id,
  "Resposta sintética: a empresa informa que mantém entregas aos clientes durante o processo (texto de demonstração).",
);

console.log("Seed sintético aplicado.");
console.log(`FA: ${faRes.rows_ok} semanas importadas, ${faRes.drafts_created} rascunho(s) de evento gerado(s).`);
console.log("Usuários (senha = SEED_PASSWORD):");
for (const e of [
  "admin@radar.invalid (operação, admin)",
  "curadoria@radar.invalid (operação, curadoria)",
  "gestora@radar.invalid (gestora, titular)",
  "consumidor@radar.invalid (consumidor agente, titular)",
  "fornecedor@radar.invalid (fornecedor Alfa, direito de resposta)",
  "pendente@radar.invalid (gestora aguardando aprovação)",
])
  console.log(`  - ${e}`);
await pool.end();
