import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

async function open(page) {
  await page.goto("/preview/#gedachten");
  await page.getByRole("button", { name: "Bekijk de slaapmodule" }).click();
}
async function next(page) {
  await page.locator("[data-next]").click();
}
async function accessible(page) {
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
}

test("guided practice validates choices, offers feedback and creates an editable personal action", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.addInitScript(() => {
    window.copied = [];
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: async (text) => window.copied.push(text) },
    });
  });
  await open(page);
  await next(page);
  await expect(page.locator("#practice-error")).not.toBeEmpty();
  await expect(page.locator("input[name=thought]").first()).toBeFocused();
  for (let thought = 0; thought < 3; thought++) {
    await page.locator(`input[name=thought][value="${thought}"]`).check();
    await next(page);
    await page.locator('input[name=answer][value="2"]').check();
    await expect(page.locator(".practice-feedback")).toContainText("Dat mag.");
    await accessible(page);
    await next(page);
    await page.locator('input[name=phrase][value="0"]').check();
    await next(page);
    await next(page);
    await expect(page.locator("#practice-error")).toContainText(
      "Kies eerst een moment",
    );
    await page.locator("#practice-moment").selectOption("Na de lunch");
    await page.locator("#practice-smaller").check();
    await accessible(page);
    await next(page);
    await expect(page.locator(".practice-takeaway")).toContainText(
      "Na de lunch",
    );
    await expect(page.locator(".practice-takeaway")).toContainText(
      "ander rustig moment",
    );
    await page.locator("[data-copy]").click();
    expect((await page.evaluate(() => window.copied)).at(-1)).toContain(
      "Na de lunch: ik lees mijn zin één keer rustig terug.",
    );
    await page.locator(".practice-review summary").click();
    await page
      .getByRole("button", { name: "Het paste nog niet", exact: true })
      .click();
    await expect(page.locator("#reflection-response")).toContainText(
      "niet door te zetten",
    );
    await accessible(page);
    await page.locator("[data-edit]").click();
    await expect(page.locator('input[name=phrase][value="0"]')).toBeChecked();
    await page.locator("[data-back]").click();
    await expect(page.locator('input[name=answer][value="2"]')).toBeChecked();
    await page.locator("[data-back]").click();
  }
  // Changing the thought clears choices and the old plan.
  await page.locator('input[name=thought][value="0"]').check();
  await next(page);
  await expect(page.locator("input[name=answer]:checked")).toHaveCount(0);
  await page.locator('input[name=answer][value="0"]').check();
  await next(page);
  await expect(page.locator("input[name=phrase]:checked")).toHaveCount(0);
  await page.locator('input[name=phrase][value="1"]').check();
  await next(page);
  await expect(page.locator("#practice-moment")).toHaveValue("");
  await expect(page.locator("#practice-smaller")).not.toBeChecked();
  expect(
    await page.evaluate(() => ({
      local: localStorage.length,
      session: sessionStorage.length,
    })),
  ).toEqual({ local: 0, session: 0 });
  await page.reload();
  await page.getByRole("button", { name: "Bekijk de slaapmodule" }).click();
  await expect(page.locator("input[name=thought]:checked")).toHaveCount(0);
  expect(errors).toEqual([]);
});

test("reading is optional; discussion branch and clipboard fallback work without a forced plan", async ({
  page,
}) => {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: async () => {
          throw new Error("Clipboard unavailable");
        },
      },
    }),
  );
  await open(page);
  await page.locator("[data-reading]").click();
  await expect(page.locator("#thought-reading")).toHaveAttribute("open", "");
  await expect(page.locator("#gedachten")).toBeVisible();
  await expect(page.locator("#thought-reading summary")).toBeFocused();
  await page.locator('input[name=thought][value="1"]').check();
  await next(page);
  await page.locator('input[name=answer][value="1"]').check();
  await next(page);
  await page.locator('input[name=phrase][value="2"]').check();
  await next(page);
  await expect(page.locator("#practice-moment")).toHaveCount(0);
  await next(page);
  await expect(page.locator("#thought-practice")).toContainText(
    "Er wordt niets naar je behandelaar gestuurd",
  );
  await expect(page.locator(".practice-review")).toHaveCount(0);
  await page.locator("[data-copy]").click();
  await expect(page.locator("#copy-fallback")).toBeVisible();
  await expect(page.locator("#copy-fallback")).toHaveValue(
    /Mijn gedachte: Ik móét nu in slaap vallen/,
  );
  await accessible(page);
  await page.locator("[data-restart]").click();
  await expect(page.locator("input[name=thought]:checked")).toHaveCount(0);
});
