// This deadline is evaluated on Vercel, before cached/static content is served.
export const PREVIEW_CLOSES_AT = Date.parse("2026-09-20T00:00:00+02:00");
export const PREVIEW_BRANCH = "codex/fysoptima-preview";
const files = new Set([
  "/preview/",
  "/preview/index.html",
  "/preview/app.js",
  "/preview/style.css",
  "/preview/original.css",
  "/preview/excerpts.js",
  "/preview/videos.js",
  "/preview/thought-practice.js",
  "/logo.png",
  "/v2/fonts/dm-sans.ttf",
  "/v2/fonts/plus-jakarta-sans.ttf",
]);
export const previewHeaders = {
  "Cache-Control": "no-store, max-age=0",
  "CDN-Cache-Control": "no-store",
  "Vercel-CDN-Cache-Control": "no-store",
  "X-Robots-Tag": "noindex, nofollow",
  "X-Preview-Closes-At": "2026-09-19T22:00:00Z",
};
export function previewGate(
  request,
  { environment, branch, now = Date.now() },
) {
  if (environment !== "preview" || branch !== PREVIEW_BRANCH) return null;
  const headers = { ...previewHeaders };
  if (now >= PREVIEW_CLOSES_AT) {
    headers["Content-Type"] = "text/html; charset=utf-8";
    return new Response(
      `<!doctype html><html lang="nl"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Preview afgelopen · FysionAIr</title><style>body{margin:0;background:#F7F9FD;color:#0E1C38;font:18px/1.7 system-ui,sans-serif}main{max-width:620px;margin:12vh auto;padding:32px}h1{font-size:32px;line-height:1.3}p{color:#4c5e7c}</style><main><strong>FysionAIr · Preview</strong><h1>Deze preview is afgelopen.</h1><p>De slaapmodule was tot en met 19 september 2026 te bekijken. Neem voor een nieuwe preview contact op met degene die je de link heeft gestuurd.</p></main></html>`,
      { status: 410, headers },
    );
  }
  if (!["GET", "HEAD"].includes(request.method))
    return new Response("Niet toegestaan", {
      status: 405,
      headers: { ...headers, Allow: "GET, HEAD" },
    });
  const path = new URL(request.url).pathname;
  if (["/", "/index.html", "/preview"].includes(path))
    return new Response(null, {
      status: 307,
      headers: { ...headers, Location: "/preview/" },
    });
  if (!files.has(path))
    return new Response("Niet gevonden", { status: 404, headers });
  return null;
}
