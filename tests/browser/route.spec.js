import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdir } from "node:fs/promises";
const evidence = "reviews/slaapmodule-v2/evidence";
const names = ["inslapen", "wakker", "vroeg", "ritme", "piekeren"];
const safety = ["sleepy", "apnea", "health", "other", "shift"];
async function choose(page, name, value) {
  await page.locator(`input[name="${name}"][value="${value}"]`).check();
}
async function start(page, wish = "ritme", url = "/v2/") {
  await page.goto(url);
  await choose(page, "wish", wish);
  await choose(page, "goal", "Meer ruimte voor mijn dag");
  await page.getByRole("button", { name: "Naar mijn check" }).click();
}
async function fillCheck(page, topic = "ritme", score = 3) {
  for (const k of safety) await choose(page, `safety.${k}`, "nee");
  for (const k of names)
    await choose(page, `answers.${k}`, String(k === topic ? score : 0));
  await page
    .getByLabel("Hoelang spelen je slaapproblemen?")
    .selectOption("Korter dan 3 weken");
  await page
    .getByLabel("Hoeveel hinder heb je overdag?")
    .selectOption("Soms lastig");
}
async function learn(page, topic = "ritme") {
  await choose(page, "topic", topic);
  await page.getByRole("button", { name: "Naar mijn uitleg" }).click();
  await choose(page, "practice", "0");
  await page.getByRole("button", { name: "Kies mijn kleine stap" }).click();
}
async function details(page, key) {
  await page
    .locator(`[name="detail.${key}.moment"]`)
    .selectOption(
      key === "rise" ? "Bij mijn gewenste dagstart" : "Na het ontbijt",
    );
  await page
    .locator(`[name="detail.${key}.backup"]`)
    .selectOption("Ik maak de stap kleiner");
  await choose(page, `detail.${key}.feasible`, "Dit is haalbaar");
  if (key === "rise" || key === "early")
    await page.locator(`[name="detail.${key}.time"]`).fill("07:30");
}
async function buildPlan(page) {
  await start(page);
  await fillCheck(page);
  await learn(page);
  await page.locator('[data-action="rise"]').check();
  await details(page, "rise");
  await page.getByRole("button", { name: "Bekijk mijn weekplan" }).click();
}
async function visual(page, label, project) {
  await mkdir(evidence, { recursive: true });
  await expect(page.locator("html")).toHaveJSProperty(
    "scrollWidth",
    await page.evaluate(() => document.documentElement.clientWidth),
  );
  await page.screenshot({
    path: `${evidence}/${project}-${label}.png`,
    fullPage: true,
  });
}

test("complete route, privacy opt-in, resume, review, adjustment, copy, print and erase", async ({
  page,
  context,
}, info) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/v2/");
  await visual(page, "1-start", info.project.name);
  await expect(
    page.getByRole("button", { name: "Naar mijn check" }),
  ).toBeDisabled();
  await start(page);
  await visual(page, "2-check", info.project.name);
  await fillCheck(page);
  await choose(page, "topic", "ritme");
  await page.getByRole("button", { name: "Naar mijn uitleg" }).click();
  await visual(page, "3-uitleg", info.project.name);
  await choose(page, "practice", "0");
  await page.getByRole("button", { name: "Kies mijn kleine stap" }).click();
  await expect(
    page.getByRole("button", { name: "Bekijk mijn weekplan" }),
  ).toBeDisabled();
  await expect(page.getByText("Je plan staat klaar.")).toHaveCount(0);
  await page.locator('[data-action="rise"]').check();
  await details(page, "rise");
  await page.locator('[data-action="light"]').check();
  await details(page, "light");
  await page.locator('[data-action="discuss"]').click();
  await expect(page.locator('[data-action="discuss"]')).not.toBeChecked();
  await expect(
    page.getByRole("status").filter({ hasText: "maximaal twee" }),
  ).toBeVisible();
  await visual(page, "4-acties", info.project.name);
  await page.getByRole("button", { name: "Bekijk mijn weekplan" }).click();
  await expect(
    page.getByRole("heading", { name: "Je plan staat klaar." }),
  ).toBeVisible();
  await visual(page, "5-plan", info.project.name);
  expect(await page.evaluate(() => localStorage.length)).toBe(0);
  await page.getByLabel("Bewaar mijn keuzes op dit apparaat").check();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Hervat mijn route" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Hervat mijn route" }).click();
  await expect(
    page.locator(".plan-card").getByText("gewenste opsta-tijd 07:30"),
  ).toBeVisible();
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.getByRole("button", { name: "Kopieer mijn plan" }).click();
  await expect(page.locator("#notice")).toContainText("gekopieerd");
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(
    "07:30",
  );
  await page.emulateMedia({ media: "print" });
  await expect(page.locator("#print-plan")).toBeVisible();
  await expect(page.locator("#main")).not.toBeVisible();
  expect(await page.locator("#print-plan").innerText()).toContain(
    "Een slechte nacht is geen mislukking",
  );
  await page.pdf({
    path: `${evidence}/${info.project.name}-weekplan.pdf`,
    format: "A4",
  });
  await page.emulateMedia({ media: "screen" });
  await page.getByRole("button", { name: "Terugkijken of bijstellen" }).click();
  await expect(
    page.getByText("Nog niet ingevuld", { exact: true }),
  ).toHaveCount(3);
  await visual(page, "6-terugblik", info.project.name);
  await choose(page, "evaluation.feasible", "Moeilijk vol te houden");
  await choose(page, "evaluation.change", "Ongeveer hetzelfde");
  await choose(page, "evaluation.next", "Mijn stap kleiner maken");
  await expect(page.locator("#followup")).toContainText("Maak de stap kleiner");
  await page.getByRole("button", { name: "Pas mijn kleine stap aan" }).click();
  await expect(
    page.locator(
      '[name="detail.rise.feasible"][value="Ik begin met de kleinere versie"]',
    ),
  ).toBeChecked();
  await page.getByRole("button", { name: "Bekijk mijn weekplan" }).click();
  await page.getByRole("button", { name: "Terugkijken of bijstellen" }).click();
  await expect(
    page.getByText("Nog niet ingevuld", { exact: true }),
  ).toHaveCount(3);
  await page
    .getByRole("button", { name: "Wis mijn V2-keuzes", exact: true })
    .click();
  await page.getByRole("button", { name: "Ja, wis mijn keuzes" }).click();
  expect(
    await page.evaluate(() => localStorage.getItem("fysionair.slaaproute.v2")),
  ).toBeNull();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Hervat mijn route" }),
  ).toHaveCount(0);
  expect(errors).toEqual([]);
});

test("referrals and direct hashes cannot bypass complete safety and symptom checks", async ({
  page,
}) => {
  await start(
    page,
    "inslapen",
    "/v2/?source=fysionair&sleep=high&focus=inslapen&name=Secret#stap-5",
  );
  await expect(
    page.getByRole("heading", { name: "Eerst: je gezondheid" }),
  ).toBeVisible();
  await choose(page, "safety.sleepy", "ja");
  await expect(page.locator("#care-sleepy")).toBeVisible();
  await expect(page.getByText("Jij kiest waar je begint")).toHaveCount(0);
  for (const k of names) await choose(page, `answers.${k}`, "3");
  await expect(
    page.getByRole("button", { name: "Naar mijn uitleg" }),
  ).toBeDisabled();
  await expect(page.locator("body")).not.toContainText("Secret");
  expect(page.url()).not.toContain("Secret");
  await fillCheck(page, "ritme");
  await choose(page, "answers.piekeren", "3");
  await expect(
    page.getByText(/Meerdere onderwerpen komen even sterk/),
  ).toBeVisible();
  await choose(page, "topic", "piekeren");
  await page.getByRole("button", { name: "Naar mijn uitleg" }).click();
  await expect(
    page.getByRole("heading", { name: "Geef gedachten een plek buiten bed." }),
  ).toBeVisible();
});

test("few symptoms, topic change and browser back preserve honest route boundaries", async ({
  page,
}) => {
  await start(page, "weinig");
  await fillCheck(page, "ritme", 0);
  await expect(
    page.getByText(/Je noemt weinig klachten in deze check/),
  ).toBeVisible();
  await learn(page);
  await page.locator('[data-action="light"]').check();
  await details(page, "light");
  await page.getByRole("button", { name: "Bekijk mijn weekplan" }).click();
  await page.goBack();
  await expect(page.locator('[data-action="light"]')).toBeChecked();
  await page.getByRole("button", { name: "Vorige stap" }).click();
  await page.getByRole("button", { name: "Vorige stap" }).click();
  await choose(page, "answers.wakker", "3");
  await expect(page.locator('[name="topic"]:checked')).toHaveCount(0);
  await choose(page, "topic", "wakker");
  await page.getByRole("button", { name: "Naar mijn uitleg" }).click();
  await choose(page, "practice", "1");
  await expect(page.locator("#practice-feedback")).toContainText(
    "geen stopwatch",
  );
  await page.getByRole("button", { name: "Kies mijn kleine stap" }).click();
  await expect(page.locator("[data-action]:checked")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Bekijk mijn weekplan" }),
  ).toBeDisabled();
});

test("breathing is user-started, keyboard operable, reduced-motion safe and stops on leave", async ({
  page,
}, info) => {
  await start(page, "inslapen");
  await fillCheck(page, "inslapen");
  await choose(page, "topic", "inslapen");
  await page.getByRole("button", { name: "Naar mijn uitleg" }).click();
  await expect(page.locator("#breath-status")).toHaveText(
    "De oefening staat stil.",
  );
  await page.getByRole("button", { name: "Start ademcirkel" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#breath-status")).toContainText(
    info.project.name === "mobile" ? "cirkel blijft stil" : "ademcirkel loopt",
  );
  if (info.project.name === "mobile")
    expect(
      await page
        .locator("#breath-circle")
        .evaluate((el) => getComputedStyle(el).transform),
    ).toBe("none");
  await page.keyboard.press("Enter");
  await expect(page.locator("#breath-status")).toHaveText(
    "De oefening staat stil.",
  );
  await page.getByRole("button", { name: "Start ademcirkel" }).click();
  await choose(page, "practice", "0");
  await page.getByRole("button", { name: "Kies mijn kleine stap" }).click();
  await page.getByRole("button", { name: "Vorige stap" }).click();
  await expect(page.locator("#breath-status")).toHaveText(
    "De oefening staat stil.",
  );
  await visual(page, "ademcirkel", info.project.name);
  await page.clock.install();
  await page.getByRole("button", { name: "Start ademcirkel" }).click();
  await page.clock.fastForward(61000);
  await expect(page.locator("#breath-status")).toContainText(
    "De minuut is klaar",
  );
  await page.getByRole("button", { name: "Herhaal ademcirkel" }).click();
  await expect(
    page.getByRole("button", { name: "Stop", exact: true }),
  ).toBeEnabled();
});

for (const [topic, action] of Object.entries({
  inslapen: "winddown",
  wakker: "night",
  vroeg: "early",
  ritme: "rise",
  piekeren: "thought",
})) {
  test(`the ${topic} topic produces its own complete, usable plan`, async ({
    page,
  }) => {
    await start(page, topic);
    await fillCheck(page, topic);
    await learn(page, topic);
    await page.locator(`[data-action="${action}"]`).check();
    await page
      .locator(`[name="detail.${action}.moment"]`)
      .selectOption({ index: 1 });
    await page
      .locator(`[name="detail.${action}.backup"]`)
      .selectOption({ index: 1 });
    await choose(page, `detail.${action}.feasible`, "Dit is haalbaar");
    if (["rise", "early"].includes(action))
      await page.locator(`[name="detail.${action}.time"]`).fill("07:30");
    await page.getByRole("button", { name: "Bekijk mijn weekplan" }).click();
    await expect(
      page.getByRole("heading", { name: "Je plan staat klaar." }),
    ).toBeVisible();
    await expect(page.locator(".plan-item")).toHaveCount(1);
  });
}

test("exercise text is escaped, stays transient and missing images do not block route", async ({
  page,
}) => {
  await page.route("**/*.png", (r) => r.abort());
  await start(page, "piekeren");
  await fillCheck(page, "piekeren");
  await choose(page, "topic", "piekeren");
  await page.getByRole("button", { name: "Naar mijn uitleg" }).click();
  await page.getByText("Probeer het alvast: één zorg, één stap").click();
  await page
    .getByLabel("Wat houdt je bezig? (optioneel)")
    .fill("<script>Secret</script>");
  await page.getByLabel("Bewaar mijn keuzes op dit apparaat").check();
  expect(
    await page.evaluate(() => localStorage.getItem("fysionair.slaaproute.v2")),
  ).not.toContain("Secret");
  await choose(page, "practice", "0");
  await page.getByRole("button", { name: "Kies mijn kleine stap" }).click();
  await page.getByRole("button", { name: "Vorige stap" }).click();
  await page.getByText("Probeer het alvast: één zorg, één stap").click();
  await expect(page.getByLabel("Wat houdt je bezig? (optioneel)")).toHaveValue(
    "<script>Secret</script>",
  );
  await page.reload();
  await page.getByRole("button", { name: "Hervat mijn route" }).click();
  await page.getByText("Probeer het alvast: één zorg, één stap").click();
  await expect(page.getByLabel("Wat houdt je bezig? (optioneel)")).toHaveValue(
    "",
  );
});

test("storage denial and clipboard failure have usable fallbacks", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new Error("Storage blocked");
    };
    navigator.clipboard.writeText = async () => {
      throw new Error("Clipboard blocked");
    };
  });
  await buildPlan(page);
  await page.getByLabel("Bewaar mijn keuzes op dit apparaat").check();
  await expect(page.locator("#storage-status")).toContainText(
    "Bewaren is niet gelukt",
  );
  await page.getByRole("button", { name: "Kopieer mijn plan" }).click();
  await expect(page.getByLabel(/Kopiëren lukte niet/)).toContainText(
    "MIJN SLAAPROUTE",
  );
});

test("accessibility checks across all six screens and sources", async ({
  page,
}) => {
  const audit = async () => {
    const r = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(r.violations).toEqual([]);
  };
  await page.goto("/v2/");
  await audit();
  await start(page);
  await audit();
  await fillCheck(page);
  await choose(page, "topic", "ritme");
  await page.getByRole("button", { name: "Naar mijn uitleg" }).click();
  await audit();
  await choose(page, "practice", "0");
  await page.getByRole("button", { name: "Kies mijn kleine stap" }).click();
  await audit();
  await page.locator('[data-action="light"]').check();
  await details(page, "light");
  await page.getByRole("button", { name: "Bekijk mijn weekplan" }).click();
  await audit();
  await page.getByRole("button", { name: "Terugkijken of bijstellen" }).click();
  await audit();
  await page.goto("/v2/bronnen.html");
  await audit();
});
