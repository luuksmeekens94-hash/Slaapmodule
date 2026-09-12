import { excerpts } from "./excerpts.js";
import { videos } from "./videos.js";
const covers = {
  welcome: {
    note: "Een introductie bij het begin van de module.",
    duration: "0:32",
  },
  awake: {
    note: "Uitleg bij rustiger omgaan met wakker liggen.",
    duration: "0:34",
  },
  worry: {
    note: "Uitleg bij de oefening over slaapgedachten.",
    duration: "0:43",
  },
};
const escape = (text) =>
  text.replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ],
  );
for (const slot of document.querySelectorAll("[data-slot]")) {
  const key = slot.dataset.slot,
    video = videos[key],
    cover = covers[key];
  slot.innerHTML = `<button class="video-cover" data-video="${key}" aria-label="Speel video: ${video.title}"><span class="cover-stage"><span class="cover-label">Video · preview</span><span class="play-circle" aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 3L21 12L6 21Z"/></svg></span><strong>${video.title}</strong><small>Klik op play om te kijken</small><span class="cover-duration">${cover.duration}</span></span><span class="cover-caption"><span>${cover.note}</span><span class="cover-action">Video afspelen ↗</span></span></button>`;
}
for (const module of excerpts) {
  const headingId =
    module.id === "moduleB" ? "awake-heading" : "thought-heading";
  // The HTML fragments are trusted, versioned excerpts from the original module.
  document.querySelector(`[data-module-header="${module.id}"]`).innerHTML =
    `<span class="chip" style="margin-bottom:18px">${escape(module.label)}</span><h1 class="h-hero" id="${headingId}">${module.title}</h1><p class="lead">${escape(module.intro)}</p>`;
  document.querySelector(`[data-module-insight="${module.id}"]`).innerHTML =
    `<div class="card card-lg"><h2 class="h-block">${escape(module.whyTitle)}</h2><p class="insight-body">${escape(module.whyBody)}</p><div class="protocol-grid">${module.keyPoints.map((point) => `<div class="protocol-card"><strong>${escape(point.title)}</strong><span>${escape(point.body)}</span></div>`).join("")}</div></div>`;
  document.querySelector(`[data-module-steps="${module.id}"]`).innerHTML =
    module.steps
      .map(
        (step, index) =>
          `<details class="step-item"><summary class="step-head"><span class="step-num">${index + 1}</span><span style="min-width:0;flex:1"><span class="step-title">${escape(step.title)}</span><span class="step-hint">${escape(step.hint)}</span></span><span class="plus" aria-hidden="true">+</span></summary><div class="step-body">${step.body}</div></details>`,
      )
      .join("");
}
const dialog = document.querySelector("#preview-dialog"),
  main = document.querySelector("#main"),
  videoDialog = document.querySelector("#video-dialog");
const routes = ["welkom", "wakker", "gedachten"];
let videoTrigger;
function showRoute(focus = false) {
  const route = routes.includes(location.hash.slice(1))
    ? location.hash.slice(1)
    : "welkom";
  if (videoDialog.open) videoDialog.close();
  for (const section of document.querySelectorAll(".preview-chapter"))
    section.hidden = section.id !== route;
  for (const item of document.querySelectorAll("[data-route]")) {
    const active = item.dataset.route === route;
    item.classList.toggle("active", active);
    if (active) item.setAttribute("aria-current", "page");
    else item.removeAttribute("aria-current");
  }
  document.title = `FysionAIr · ${route === "welkom" ? "Preview van de slaapmodule" : route === "wakker" ? "Wakker in de nacht · Preview" : "Rust in je hoofd · Preview"}`;
  if (focus) {
    main.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "instant" });
  }
}
function openVideo(key, trigger) {
  const video = videos[key];
  if (!video) return;
  videoTrigger = trigger;
  document.querySelector("#video-title").textContent = video.title;
  const iframe = document.createElement("iframe");
  iframe.src = `https://share.synthesia.io/embeds/videos/${video.id}?language=nl`;
  iframe.title = video.title;
  iframe.allow = "encrypted-media; fullscreen;";
  iframe.allowFullscreen = true;
  document.querySelector("#player").replaceChildren(iframe);
  document.querySelector("#video-fallback").href =
    `https://share.synthesia.io/${video.id}`;
  document.querySelector("#transcript").replaceChildren(
    ...video.text.map((text) => {
      const p = document.createElement("p");
      p.textContent = text;
      return p;
    }),
  );
  document.querySelector("#video-dialog details").open = false;
  videoDialog.showModal();
  document.querySelector("#close-video").focus();
}
document
  .querySelectorAll("[data-video]")
  .forEach((button) =>
    button.addEventListener("click", () =>
      openVideo(button.dataset.video, button),
    ),
  );
document
  .querySelector("#close-video")
  .addEventListener("click", () => videoDialog.close());
videoDialog.addEventListener("close", () => {
  document.querySelector("#player").replaceChildren();
  if (videoTrigger?.isConnected && !videoTrigger.closest("[hidden]"))
    videoTrigger.focus();
});
window.addEventListener("hashchange", () => showRoute(true));
document.querySelector("#enter-preview").addEventListener("click", () => {
  dialog.close();
  main.focus({ preventScroll: true });
});
document
  .querySelectorAll("[data-about]")
  .forEach((button) =>
    button.addEventListener("click", () => dialog.showModal()),
  );
window.addEventListener("pagehide", () =>
  document.querySelector("#player").replaceChildren(),
);
window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    document
      .querySelectorAll("details")
      .forEach((details) => (details.open = false));
    showRoute();
    if (!dialog.open) dialog.showModal();
  }
});
showRoute();
dialog.showModal();
