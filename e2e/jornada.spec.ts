import { expect, test, type Page } from "@playwright/test";

const PW = process.env.SEED_PASSWORD ?? "e2e-somente-sintetico";
const ALFA = "90000001000129"; // fornecedor sintético com pedido de RJ publicado no seed
const uniq = Date.now().toString().slice(-6);

// CNPJ válido para o cadastro
function cnpj(base8: string): string {
  let c = base8 + "0001";
  for (const len of [12, 13]) {
    const w = len === 12 ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const r = w.reduce((a, x, i) => a + x * Number(c[i]), 0) % 11;
    c += String(r < 2 ? 0 : 11 - r);
  }
  return c;
}

async function login(page: Page, email: string) {
  await page.goto("/entrar");
  await page.getByTestId("login-email").fill(email);
  await page.getByTestId("login-password").fill(PW);
  await page.getByTestId("login-submit").click();
  await expect(page).not.toHaveURL(/\/entrar/);
}

async function logout(page: Page) {
  const toggle = page.getByTestId("menu-toggle");
  if (await toggle.isVisible()) await toggle.click();
  await page.getByTestId("logout").click();
  await expect(page).toHaveURL(/\/entrar/);
}

const FORBIDDEN = [
  /integra(ção|do) oficial/i,
  /parceiro oficial/i,
  /score de crédito/i,
  /\brating\b/i,
  /previs(ão|e) (de )?fal[êe]ncia/i,
  /representamos/i,
  /registr(a|amos) (o |seu )?contrato na CCEE/i,
];

async function assertNoForbiddenClaims(page: Page) {
  const text = await page.locator("body").innerText();
  for (const re of FORBIDDEN) expect(text, `frase proibida ${re}`).not.toMatch(re);
  await expect(page.getByTestId("disclaimer")).toBeVisible();
}

test("jornada completa: cadastro → aprovação → carteira → alerta → API", async ({ page, request }) => {
  const email = `nova-gestora-${uniq}@exemplo.invalid`;
  const orgName = `Gestora E2E ${uniq} (sintética)`;

  // 1. cadastro: fica aguardando aprovação
  await page.goto("/cadastrar");
  await page.getByTestId("register-name").fill("Pessoa E2E");
  await page.getByTestId("register-email").fill(email);
  await page.getByTestId("register-password").fill(PW);
  await page.getByTestId("register-org-name").fill(orgName);
  await page.getByTestId("register-org-type").selectOption("manager");
  await page.getByTestId("register-org-cnpj").fill(cnpj(`77${uniq}`));
  await page.getByTestId("register-submit").click();
  await expect(page.getByTestId("pending-page")).toBeVisible();
  await assertNoForbiddenClaims(page);
  await logout(page);

  // 2. admin aprova pela tela de operação
  await login(page, "admin@radar.invalid");
  await page.goto("/operacao/organizacoes");
  const row = page.getByTestId("org-row").filter({ hasText: orgName });
  await row.getByTestId("org-approve").click();
  await expect(page.getByTestId("org-row").filter({ hasText: orgName })).toHaveCount(0);
  await logout(page);

  // 3. gestora monta a carteira pela interface
  await login(page, email);
  await page.goto("/carteira/clientes");
  await page.getByTestId("client-name").fill("Cliente E2E (sintético)");
  await page.getByTestId("client-cnpj").fill(cnpj(`66${uniq}`));
  await page.getByTestId("client-submit").click();
  await expect(page.getByTestId("client-row").filter({ hasText: "Cliente E2E" }).first()).toBeVisible();

  await page.goto("/carteira/unidades");
  await page.getByTestId("site-client").selectOption({ label: "Cliente E2E (sintético)" });
  await page.getByTestId("site-name").fill("Planta E2E");
  await page.getByTestId("site-submarket").selectOption("SE_CO");
  await page.getByTestId("site-submit").click();
  await expect(page.getByTestId("site-list")).toContainText("Planta E2E");

  await page.goto("/carteira/contratos/novo");
  await page.getByTestId("contract-site").selectOption({ index: 1 });
  await page.getByTestId("contract-supplier-cnpj").fill(ALFA);
  await page.getByTestId("contract-start").fill("2026-01-01");
  await page.getByTestId("contract-end").fill("2029-12-31");
  await page.getByTestId("contract-volume").fill("2,5");
  await page.getByTestId("contract-price").fill("180");
  await page.getByTestId("contract-submit").click();
  await expect(page.getByTestId("contract-created").or(page.getByTestId("contract-success")).first()).toBeVisible();

  // 4. o alerta aparece (evento já publicado no seed) com exposição calculada e fonte
  await page.goto("/alertas");
  const alertRow = page.getByTestId("alert-row").first();
  await expect(alertRow).toBeVisible();
  await expect(alertRow.getByTestId("severity-badge")).toHaveAttribute("data-severity", "critical");
  await alertRow.getByTestId("alert-link").click();
  await expect(page.getByTestId("alert-detail")).toBeVisible();
  await expect(page.getByTestId("alert-disclaimer")).toContainText("não é inadimplência confirmada");
  await expect(page.getByTestId("source-link").first()).toHaveAttribute("href", /^https?:\/\//);
  await expect(page.getByTestId("exposure")).toBeVisible();
  await expect(page.getByTestId("exposure-formula")).toBeVisible();
  await expect(page.getByTestId("supplier-responses")).toContainText("Resposta sintética");
  await assertNoForbiddenClaims(page);
  await page.getByTestId("alert-ack").click();
  await expect(page.getByTestId("alert-status")).toHaveAttribute("data-status", "acknowledged");

  // 5. chave de API criada na interface funciona; sem chave é 401; escopo errado é 403
  await page.goto("/chaves");
  await page.getByTestId("apikey-name").fill("integração e2e");
  await page.getByTestId("apikey-scope-alerts:read").check();
  await page.getByTestId("apikey-scope-portfolio:read").uncheck();
  await page.getByTestId("apikey-submit").click();
  const secret = (await page.getByTestId("apikey-secret").inputValue()).trim();
  expect(secret).toMatch(/^rdf_/);
  const ok = await request.get("/api/v1/alerts", { headers: { authorization: `Bearer ${secret}` } });
  expect(ok.status()).toBe(200);
  const body = await ok.json();
  expect(body.data[0].status).toBe("acknowledged");
  expect((await request.get("/api/v1/alerts")).status()).toBe(401);
  expect((await request.get("/api/v1/contracts", { headers: { authorization: `Bearer ${secret}` } })).status()).toBe(
    403,
  );
});

test("curadoria publica evento e a gestora do seed recebe novo alerta", async ({ page }) => {
  await login(page, "curadoria@radar.invalid");
  await page.goto("/operacao/eventos");
  const draft = page
    .getByTestId("op-event")
    .filter({ hasText: "Varejista Gama" })
    .filter({ hasText: /inadimplente/i })
    .first();
  await draft.getByTestId("event-publish").click();
  await expect(
    page
      .getByTestId("op-event")
      .filter({ hasText: "Varejista Gama" })
      .filter({ hasText: /inadimplente/i })
      .first(),
  ).toHaveAttribute("data-status", "published");
  await logout(page);
  await login(page, "gestora@radar.invalid");
  await page.goto("/alertas");
  await expect(page.getByTestId("alert-list")).toContainText("Varejista Gama");
});

test("fornecedor vê evento sobre si e responde", async ({ page }) => {
  await login(page, "fornecedor@radar.invalid");
  await page.goto("/fornecedor/eventos");
  await expect(page.getByTestId("supplier-event").first()).toBeVisible();
  await page
    .getByTestId("response-body")
    .first()
    .fill("Resposta E2E sintética: processo em andamento, entregas mantidas.");
  await page.getByTestId("response-submit").first().click();
  await expect(page.getByTestId("supplier-event").first()).toContainText("Resposta E2E sintética");
});

test("login operável só por teclado @mobile", async ({ page }) => {
  await page.goto("/entrar");
  await page.getByTestId("login-email").focus();
  await page.keyboard.type("gestora@radar.invalid");
  await page.keyboard.press("Tab");
  await page.keyboard.type(PW);
  await page.keyboard.press("Enter");
  await expect(page).not.toHaveURL(/\/entrar/);
});

test("layout em 360 px sem rolagem horizontal da página @mobile", async ({ page }) => {
  await login(page, "gestora@radar.invalid");
  for (const path of ["/painel", "/alertas", "/carteira/contratos", "/chaves"]) {
    await page.goto(path);
    await page.waitForLoadState("networkidle");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow, `rolagem horizontal em ${path}`).toBeLessThanOrEqual(1);
    await assertNoForbiddenClaims(page);
  }
});
