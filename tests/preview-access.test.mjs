import test from "node:test";
import assert from "node:assert/strict";
import {
  previewGate,
  PREVIEW_CLOSES_AT,
  PREVIEW_BRANCH,
} from "../lib/preview-access.js";
const settings = {
  environment: "preview",
  branch: PREVIEW_BRANCH,
  now: PREVIEW_CLOSES_AT - 1,
};
const request = (path) => new Request("https://preview.example" + path);
test("only the selected preview and its assets are accessible before the deadline", () => {
  for (const path of [
    "/preview/",
    "/preview/index.html",
    "/preview/app.js",
    "/preview/style.css",
    "/preview/videos.js",
    "/logo.png",
    "/v2/fonts/dm-sans.ttf",
  ])
    assert.equal(previewGate(request(path), settings), null);
  for (const path of [
    "/v2/",
    "/data/sleep-module.json",
    "/preview/private.json",
    "/api/test",
    "/preview/%69ndex.html",
  ])
    assert.equal(previewGate(request(path), settings).status, 404);
  for (const path of ["/", "/index.html", "/preview"])
    assert.equal(
      previewGate(request(path), settings).headers.get("location"),
      "/preview/",
    );
  assert.equal(
    previewGate(
      new Request("https://preview.example/preview/", { method: "POST" }),
      settings,
    ).status,
    405,
  );
});
test("all requests close at midnight Amsterdam, even assets and requests with bypass-like input", async () => {
  for (const now of [PREVIEW_CLOSES_AT, PREVIEW_CLOSES_AT + 86400000])
    for (const path of [
      "/",
      "/preview/",
      "/preview/app.js",
      "/logo.png",
      "/preview/?now=0&_vercel_share=anything",
    ]) {
      const response = previewGate(request(path), { ...settings, now });
      assert.equal(response.status, 410);
      assert.match(response.headers.get("cache-control"), /no-store/);
      assert.match(await response.text(), /Deze preview is afgelopen/);
    }
  assert.equal(
    new Date(PREVIEW_CLOSES_AT).toISOString(),
    "2026-09-19T22:00:00.000Z",
  );
});
test("production, local development and other preview branches remain unaffected", () => {
  for (const [environment, branch] of [
    ["production", PREVIEW_BRANCH],
    ["development", PREVIEW_BRANCH],
    ["preview", "codex/other"],
  ])
    assert.equal(
      previewGate(request("/v2/"), {
        environment,
        branch,
        now: PREVIEW_CLOSES_AT + 1,
      }),
      null,
    );
});
