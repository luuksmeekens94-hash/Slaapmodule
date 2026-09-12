import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFileSync } from "node:fs";

test("original appearance, neutral notice and real module excerpts on all three routes", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/preview/");
  await expect(
    page.getByRole("dialog", { name: "Een kijkje in de slaapmodule." }),
  ).toBeVisible();
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
  await page.getByRole("button", { name: "Bekijk de slaapmodule" }).click();
  await expect(
    page.getByRole("heading", { name: "Jouw slaaproute", exact: true }),
  ).toBeVisible();
  const colours = await page.evaluate(() => ({
    bg: getComputedStyle(document.body).backgroundColor,
    grad: getComputedStyle(document.querySelector(".hero")).backgroundImage,
    blue: getComputedStyle(document.documentElement)
      .getPropertyValue("--blue")
      .trim(),
  }));
  expect(colours).toEqual({
    bg: "rgb(247, 249, 253)",
    grad: "linear-gradient(135deg, rgb(48, 181, 190) 0%, rgb(27, 86, 184) 55%, rgb(24, 64, 160) 100%)",
    blue: "#1840A0",
  });
  const original = readFileSync("prototype/index.html", "utf8").match(
    /<style>([\s\S]*?)<\/style>/,
  )[1];
  expect(
    readFileSync("prototype/preview/original.css", "utf8").endsWith(original),
  ).toBe(true);
  for (const route of ["welkom", "wakker", "gedachten"]) {
    await page.locator(`[data-route="${route}"]`).click();
    await expect(page.locator(`[data-route="${route}"]`)).toHaveAttribute(
      "aria-current",
      "page",
    );
    await expect(page.locator(".preview-chapter:visible")).toHaveCount(1);
    await expect(
      page.locator(".preview-chapter:visible .video-cover"),
    ).toBeVisible();
    await expect(
      page.locator(".preview-chapter:visible .play-circle"),
    ).toBeVisible();
    const details = page.locator(".preview-chapter:visible details");
    for (const detail of await details.all())
      await detail.locator("summary").click();
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
    await expect(page.locator("body")).not.toContainText(
      /Geert|FysOptima|Sam, 42|fictief|fictieve|Conceptweergave/,
    );
  }
  await expect(page.locator("#gedachten")).toContainText(
    "Gedachten kunnen je lichaam wakkerder maken",
  );
  await page.goBack();
  await expect(page.locator("#wakker")).toBeVisible();
  await expect(page.locator("#wakker")).toContainText(
    "Is opstaan moeilijk of onveilig",
  );
  expect(
    await page.evaluate(() => ({
      local: localStorage.length,
      session: sessionStorage.length,
    })),
  ).toEqual({ local: 0, session: 0 });
  expect(errors).toEqual([]);
});

test("three explicit video covers load only after play and stop on close", async ({
  page,
}) => {
  const requests = [];
  await page.route(
    "https://share.synthesia.io/embeds/videos/**",
    async (route) => {
      requests.push(route.request().url());
      await route.fulfill({
        contentType: "text/html",
        body: '<html lang="nl"><title>Test player</title><body>Video</body></html>',
      });
    },
  );
  await page.goto("/preview/");
  await page.getByRole("button", { name: "Bekijk de slaapmodule" }).click();
  expect(requests).toHaveLength(0);
  for (const [route, key, id] of [
    ["welkom", "welcome", "3bc475fe-9e56-405e-ad06-1d8faef8c8e8"],
    ["wakker", "awake", "8aeba680-19d8-48b6-88fd-7abbfb8c52f0"],
    ["gedachten", "worry", "b2eed012-0fae-448f-9970-cac9d6d9d3c5"],
  ]) {
    await page.locator(`[data-route="${route}"]`).click();
    const cover = page.locator(`[data-video="${key}"]`);
    await cover.click();
    await expect(page.locator("#player iframe")).toHaveAttribute(
      "src",
      `https://share.synthesia.io/embeds/videos/${id}?language=nl`,
    );
    await page.getByText("Liever lezen? Bekijk de volledige tekst").click();
    await expect(page.locator("#transcript p").first()).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.locator("#player iframe")).toHaveCount(0);
    await expect(cover).toBeFocused();
  }
  expect(requests).toHaveLength(3);
});

test("direct links, keyboard interaction and reopening preview notice", async ({
  page,
}) => {
  await page.goto("/preview/#gedachten");
  await page.getByRole("button", { name: "Bekijk de slaapmodule" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#gedachten")).toBeVisible();
  const summary = page.locator("#gedachten .step-head").first();
  await summary.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#gedachten .step-item").first()).toHaveAttribute(
    "open",
    "",
  );
  await page
    .locator(".preview-footer")
    .getByRole("button", { name: "Over deze preview" })
    .click();
  await expect(page.locator("#preview-dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator("#preview-dialog")).not.toBeVisible();
  await page.reload();
  await expect(page.locator("#preview-dialog")).toBeVisible();
});
