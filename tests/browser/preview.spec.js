import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.beforeEach(async ({ page }) => {
  await page.goto("/preview/");
});

test("preview notice, accessible demo and complete patient-to-clinician flow", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await expect(page.getByRole("dialog", { name: /Een kijkje/ })).toBeVisible();
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
  await page.getByRole("button", { name: "Ontdek de preview" }).click();
  const demo = page.locator("#demo-content");
  for (const step of [
    "Verkennen",
    "Inzicht & oefening",
    "Mijn weekactie",
    "Terugkijken",
  ]) {
    await page
      .getByRole("button", { name: step, exact: false })
      .first()
      .click();
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
  await page.getByRole("button", { name: "01 Verkennen" }).click();
  await page.getByRole("button", { name: /Wakker in bed De spanning/ }).click();
  await page.getByRole("button", { name: "Ontdek wat kan helpen" }).click();
  await expect(demo).toContainText("Je hoeft slaap niet af te dwingen");
  await page
    .getByLabel("Welke mogelijkheid zou bij Sam kunnen passen?")
    .selectOption("2");
  await expect(page.locator("#exercise-feedback")).toContainText(
    "Veiligheid gaat voor",
  );
  await page.getByRole("button", { name: "Maak een kleine weekactie" }).click();
  await page.getByLabel("Wanneer past dit?").selectOption("1");
  await page.getByLabel("Als het niet lukt").selectOption("1");
  await page.getByRole("button", { name: "Kies dit voorbeeldplan" }).click();
  await expect(demo).toContainText("Na het avondeten");
  await page
    .getByLabel("Hoe ging het uitproberen?")
    .selectOption({ label: "Het was nog te veel" });
  await page.getByRole("button", { name: "Bekijk als behandelaar" }).click();
  await expect(demo).toContainText("Het was nog te veel");
  await expect(demo).toContainText("Wat zou de stap voor jou kleiner");
  await expect(demo).toContainText("Eerst met mijn behandelaar overleggen");
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
  await page.getByRole("button", { name: "01 Verkennen" }).click();
  await page.getByRole("button", { name: /Een vol hoofd Gedachten/ }).click();
  await page.getByRole("button", { name: "04 Terugkijken" }).click();
  await expect(page.getByLabel("Hoe ging het uitproberen?")).toHaveValue("");
  await expect(demo).toContainText("Nog geen plan gekozen");
  expect(
    await page.evaluate(() => ({
      local: localStorage.length,
      session: sessionStorage.length,
    })),
  ).toEqual({ local: 0, session: 0 });
  await page.reload();
  await expect(page.getByRole("dialog", { name: /Een kijkje/ })).toBeVisible();
  expect(errors).toEqual([]);
});

test("all three videos load on demand, provide transcripts and stop on closing", async ({
  page,
}) => {
  const requests = [];
  await page.route(
    "https://share.synthesia.io/embeds/videos/**",
    async (route) => {
      requests.push(route.request().url());
      await route.fulfill({
        contentType: "text/html",
        body: '<html lang="nl"><title>Test player</title><body>Video player</body></html>',
      });
    },
  );
  await page.getByRole("button", { name: "Ontdek de preview" }).click();
  expect(requests).toHaveLength(0);
  for (const [key, id] of [
    ["welcome", "3bc475fe-9e56-405e-ad06-1d8faef8c8e8"],
    ["awake", "8aeba680-19d8-48b6-88fd-7abbfb8c52f0"],
    ["worry", "b2eed012-0fae-448f-9970-cac9d6d9d3c5"],
  ]) {
    const trigger = page.locator(`#videos [data-video="${key}"]`);
    await trigger.click();
    await expect(page.locator("#video-dialog")).toBeVisible();
    await expect(page.locator("#player iframe")).toHaveAttribute(
      "src",
      `https://share.synthesia.io/embeds/videos/${id}?language=nl`,
    );
    await page.getByText("Liever lezen? Bekijk de volledige tekst").click();
    await expect(page.locator("#transcript p").first()).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.locator("#player iframe")).toHaveCount(0);
    await expect(trigger).toBeFocused();
  }
  expect(requests).toHaveLength(3);
  await page.getByRole("button", { name: "Over deze preview" }).click();
  await expect(page.getByRole("dialog", { name: /Een kijkje/ })).toBeVisible();
});

test("keyboard entry and direct clinician view are honest about incomplete choices", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Ontdek de preview" }).focus();
  await page.keyboard.press("Enter");
  await page
    .getByRole("button", { name: "Bekijk het behandelaarsperspectief" })
    .click();
  await expect(page.locator("#demo-content")).toContainText("nog niet gekozen");
  await expect(page.locator("#demo-content")).toContainText(
    "Nog geen voorbeeldreactie ingevuld",
  );
  await expect(page.locator("#demo-content")).toContainText(
    "geen koppeling met een dossier",
  );
});
