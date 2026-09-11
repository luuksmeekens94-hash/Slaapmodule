import { test, expect } from "@playwright/test";
test("leaving and returning starts a fresh visit without silently retaining choices", async ({
  page,
}) => {
  await page.goto("/v2/");
  await page.locator('[name="wish"][value="ritme"]').check();
  await page.goto("/v2/bronnen.html");
  await page.goBack();
  await expect(page.locator('[name="wish"]:checked')).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Naar mijn check" }),
  ).toBeDisabled();
});
test("whole route works using only Tab, arrow, space and Enter keys", async ({
  page,
}) => {
  await page.goto("/v2/");
  async function tabTo(selector) {
    for (let i = 0; i < 90; i++) {
      await page.keyboard.press("Tab");
      if (
        await page.evaluate((s) => document.activeElement.matches(s), selector)
      )
        return;
    }
    throw new Error("Unreachable by Tab: " + selector);
  }
  async function toggle(selector, key = "Space") {
    await tabTo(selector);
    await page.keyboard.press(key);
  }
  await toggle('[name="wish"]');
  await toggle('[name="goal"]');
  await toggle("[data-next]", "Enter");
  for (const k of ["sleepy", "apnea", "health", "other", "shift"])
    await toggle(`[name="safety.${k}"]`);
  for (const k of ["inslapen", "wakker", "vroeg", "ritme", "piekeren"])
    await toggle(`[name="answers.${k}"]`);
  for (const name of ["duration", "impact"]) {
    await tabTo(`[name="${name}"]`);
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
  }
  await toggle('[name="topic"]');
  await toggle("[data-next]", "Enter");
  await toggle('[name="practice"]');
  await toggle("[data-next]", "Enter");
  await toggle('[data-action="breathe"]');
  for (const name of ["detail.breathe.moment", "detail.breathe.backup"]) {
    await tabTo(`[name="${name}"]`);
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
  }
  await toggle('[name="detail.breathe.feasible"]');
  await toggle("[data-next]", "Enter");
  await expect(
    page.getByRole("heading", { name: "Je plan staat klaar." }),
  ).toBeVisible();
  await toggle("[data-next]", "Enter");
  await expect(
    page.getByText("Nog niet ingevuld", { exact: true }),
  ).toHaveCount(3);
});
test("corrupt or unavailable storage cannot crash start and opt-out really removes saved data", async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem("fysionair.slaaproute.v2", "{broken");
  });
  await page.goto("/v2/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator("#storage-status")).toContainText(
    "konden niet worden gelezen",
  );
  await page.getByLabel("Bewaar mijn keuzes op dit apparaat").check();
  expect(
    await page.evaluate(() => localStorage.getItem("fysionair.slaaproute.v2")),
  ).toContain('"version":2');
  await page.getByLabel("Bewaar mijn keuzes op dit apparaat").uncheck();
  expect(
    await page.evaluate(() => localStorage.getItem("fysionair.slaaproute.v2")),
  ).toBeNull();
});
test("cross-tab deletion does not get undone by a stale tab", async ({
  page,
  context,
}) => {
  await page.goto("/v2/");
  await page.getByLabel("Bewaar mijn keuzes op dit apparaat").check();
  const other = await context.newPage();
  await other.goto("/v2/");
  await other
    .getByRole("button", { name: "Wis mijn V2-keuzes", exact: true })
    .click();
  await other.getByRole("button", { name: "Ja, wis mijn keuzes" }).click();
  await expect(
    page.getByLabel("Bewaar mijn keuzes op dit apparaat"),
  ).not.toBeChecked();
  await page.locator('[name="wish"][value="ritme"]').check();
  expect(
    await page.evaluate(() => localStorage.getItem("fysionair.slaaproute.v2")),
  ).toBeNull();
});
