import {
  STORAGE_KEY,
  STEPS,
  TOPICS,
  GOALS,
  QUESTIONS,
  SAFETY,
  DURATIONS,
  IMPACTS,
  ACTION_MOMENTS,
  BACKUPS,
  FEASIBILITY,
  ACTIONS,
  EVALUATION,
  initialState,
  helpReady,
  checkReady,
  recommendations,
  careMessages,
  availableActions,
  planReady,
  maxStep,
  referral,
  resetPlan,
  selectAction,
  restore,
  followup,
  planText,
} from "./core.js";
import { SOURCES, introArt, TOPIC_CONTENT, treatmentCard } from "./content.js";

const $ = (s) => document.querySelector(s);
const escape = (value) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
let state = initialState(),
  remember = false,
  saved = null,
  exercise = { worry: "", next: "", thought: "" },
  breathTimer = null,
  breathStarted = 0,
  practiceAnswer = "";
let storageProblem = "",
  resumePrompt = false;
const hint = referral(location.search);
try {
  const raw = localStorage.getItem(STORAGE_KEY);
  saved = raw ? restore(raw) : null;
  if (raw && !saved)
    storageProblem =
      "De bewaarde keuzes konden niet worden gelezen. Je kunt opnieuw beginnen.";
} catch {
  storageProblem =
    "Bewaren is hier niet beschikbaar. Je kunt de route wel doorlopen en je plan kopiëren of printen.";
}
resumePrompt = Boolean(saved);
// URL hints never carry personal text or bypass the check, and are removed from navigation history.
history.replaceState(null, "", location.pathname + "#stap-1");
function announce(message) {
  $("#notice").textContent = message;
}
function save() {
  if (!remember) return;
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(restore(JSON.stringify(state))),
    );
    storageProblem = "";
  } catch {
    storageProblem =
      "Bewaren is niet gelukt. Je laatste wijzigingen zijn mogelijk niet bewaard. Kopieer of print je plan.";
  }
  storageStatus();
}
function storageStatus() {
  $("#remember").checked = remember;
  $("#storage-status").textContent =
    storageProblem ||
    (remember
      ? "Je keuzes worden hier bewaard. Oefentekst blijft alleen tijdens dit bezoek. Er wordt niets naar een behandelaar verstuurd."
      : saved
        ? "Er staan eerdere V2-keuzes op dit apparaat. Kies Hervatten of wis ze hieronder."
        : "Je keuzes blijven alleen tijdens dit bezoek beschikbaar.");
}
function radio(
  name,
  options,
  value,
  { horizontal = false, grid = false } = {},
) {
  return `<div class="choices ${horizontal ? "horizontal" : ""} ${grid ? "grid" : ""}">${options
    .map((o) => {
      const [v, label, sub] = Array.isArray(o) ? o : [o, o];
      return `<label class="choice"><input type="radio" name="${name}" value="${escape(v)}" ${String(value) === String(v) ? "checked" : ""}><span>${escape(label)}${sub ? `<small>${escape(sub)}</small>` : ""}</span></label>`;
    })
    .join("")}</div>`;
}
function fieldset(legend, name, options, value, opts) {
  return `<fieldset><legend>${escape(legend)}</legend>${radio(name, options, value, opts)}</fieldset>`;
}
function select(label, name, options, value) {
  return `<div class="field"><label for="${name}">${escape(label)}</label><select id="${name}" name="${name}"><option value="">Kies wat past</option>${options.map((v) => `<option ${value === v ? "selected" : ""}>${escape(v)}</option>`).join("")}</select></div>`;
}
function header(kicker, title, text) {
  return `<p class="eyebrow">${kicker}</p><h1>${title}</h1><p class="lead">${text}</p>`;
}
function nav(next, label, disabled = false) {
  return `<div class="actions">${state.step > 1 ? '<button type="button" class="text-button" data-back>← Vorige stap</button>' : ""}${next ? `<button type="button" class="primary" data-next="${next}" ${disabled ? "disabled" : ""}>${label} <span aria-hidden="true">→</span></button>` : ""}</div>`;
}
function care() {
  const messages = careMessages(state);
  return messages.length
    ? `<section class="callout care" aria-label="Aandacht voor je gezondheid"><h2>Eerst aandacht hiervoor</h2>${messages.map((m) => `<p>${escape(m)}</p>`).join("")}<p>Een weekactie vervangt dit gesprek niet.</p></section>`
    : "";
}
function start() {
  return `${resumePrompt ? `<section class="resume"><h2>Je kunt verder met je bewaarde keuzes</h2><p>Alleen hervatten als dit jouw keuzes zijn. Je kunt ze hieronder ook wissen.</p><button class="secondary" type="button" data-resume>Hervat mijn route</button></section>` : ""}
    <section class="route-hero">${header("Jouw slaaproute", "Een kleine stap.<br><em>Meer ruimte voor je dag.</em>", "Waar heb jij last van? Samen maken we daar één haalbaar experiment voor deze week van.")}
    <div class="chips"><span class="chip">6 korte stappen</span><span class="chip">Ongeveer 10 minuten</span><span class="chip">Jouw tempo</span></div></section>${introArt}
    ${hint ? `<p class="callout">Je komt vanuit FysionAIr, met aandacht voor <strong>${TOPICS[hint]}</strong>Je kiest hier zelf wat belangrijk is. We doen altijd eerst de volledige check.</p>` : ""}
    ${fieldset("Waar heb je het meeste last van?", "wish", [...Object.entries(TOPICS), ["weinig", "Weinig klachten · ik wil mijn slaap beter begrijpen"]], state.wish, { grid: true })}
    ${fieldset("Wat wil je weer makkelijker kunnen?", "goal", GOALS, state.goal)}
    <p class="subtle">Deze keuzehulp stelt geen diagnose. De route is bedoeld voor volwassenen.</p>
    ${nav(2, "Naar mijn check", !helpReady(state))}`;
}
function check() {
  const ready = checkReady(state),
    matches = recommendations(state),
    highest = matches.length ? state.answers[matches[0]] : 0;
  return `${header("Even stilstaan", "Wat past bij jou?", "Beantwoord alle vragen. Ook “geen last” en “ik twijfel” tellen mee. Daarna kies jij je belangrijkste onderwerp.")}
    <h2>Eerst: je gezondheid</h2><div id="safety-fields">${Object.entries(
      SAFETY,
    )
      .map(
        ([k, q]) =>
          fieldset(
            q,
            `safety.${k}`,
            [
              ["nee", "Nee"],
              ["ja", "Ja"],
              ["twijfel", "Ik twijfel"],
            ],
            state.safety[k],
            { horizontal: true },
          ) +
          careMessages({
            ...state,
            safety: { [k]: state.safety[k] },
            duration: "",
          })
            .map(
              (message) =>
                `<div class="callout care" id="care-${k}"><strong>Aandacht voor je gezondheid</strong><p>${escape(message)}</p></div>`,
            )
            .join(""),
      )
      .join("")}</div>
    <h2>Hoe was het de afgelopen week?</h2>${Object.entries(QUESTIONS)
      .map(([k, q]) =>
        fieldset(
          q,
          `answers.${k}`,
          [
            [0, "Geen last"],
            [1, "Soms"],
            [2, "Vaak"],
            [3, "Heel vaak"],
          ],
          state.answers[k],
          { horizontal: true },
        ),
      )
      .join("")}
    ${select("Hoelang spelen je slaapproblemen?", "duration", DURATIONS, state.duration)}${select("Hoeveel hinder heb je overdag?", "impact", IMPACTS, state.impact)}
    ${careMessages({ ...state, safety: {} })
      .map((message) => `<p class="callout care">${escape(message)}</p>`)
      .join("")}
    <div id="check-result">${
      ready
        ? `<section class="callout"><h2>Jij kiest waar je begint</h2><p>${matches.length === 0 ? "Je noemt weinig klachten in deze check. Een onderwerp verkennen mag; je hoeft geen probleem op te lossen." : matches.filter((k) => state.answers[k] === highest).length > 1 ? "Meerdere onderwerpen komen even sterk naar voren. Er is geen vaste winnaar. Kies wat jou nu het meest helpt." : "Je noemt het vaakst: " + TOPICS[matches[0]] + ". Dit is een startpunt, geen persoonlijke diagnose."}</p><p>Je hulpvraag: ${state.wish === "weinig" ? "je slaap beter begrijpen" : TOPICS[state.wish]}. Kies één onderwerp voor nu. Je kunt later wisselen.</p></section>
      ${fieldset(
        "Met welk onderwerp wil je beginnen?",
        "topic",
        Object.entries(TOPICS).map(([k, label]) => [
          k,
          label,
          state.answers[k] > 0
            ? "Past bij je antwoorden"
            : "Ook te verkennen als dit belangrijk voor je is",
        ]),
        state.topic,
      )}
      ${treatmentCard}`
        : `<p class="subtle">Nog geen persoonlijke uitkomst: beantwoord eerst alle vragen hierboven.</p>`
    }</div>
    ${nav(3, "Naar mijn uitleg", !ready || !state.topic)}`;
}
function breathing() {
  return `<section class="breathing" aria-label="Rustige ademoefening"><h2>Een minuut ruimte</h2><p>Adem rustig in en iets langer uit, bijvoorbeeld 4 tellen in en 6 uit. Adem niet extra diep. Jouw eigen tempo mag.</p><div class="breath-space"><div id="breath-circle" class="breath-circle"><span id="breath-phase">Jouw tempo</span></div></div><p id="breath-status" role="status">De oefening staat stil.</p><div class="breath-buttons"><button type="button" class="secondary" id="breath-start">Start ademcirkel</button><button type="button" class="text-button" id="breath-stop" disabled>Stop</button></div><p class="breath-static">Zonder beweging: tel rustig in · 1, 2, 3, 4. Tel uit · 1, 2, 3, 4, 5, 6.</p><p>Voelt het onprettig of word je duizelig? Stop en adem normaal. Je hoeft hier niet slaperig van te worden.</p></section>`;
}
function learning() {
  const c = TOPIC_CONTENT[state.topic];
  return `${header("Begrijpen · " + TOPICS[state.topic], c.title, c.text)}${c.card}
    ${state.topic === "inslapen" ? breathing() : ""}
    ${state.topic === "piekeren" ? `<details><summary>Probeer het alvast: één zorg, één stap</summary><p>Deze oefentekst blijft alleen tijdens dit bezoek. Schrijf geen namen of andere persoonlijke gegevens op.</p><div class="field"><label for="worry-text">Wat houdt je bezig? (optioneel)</label><textarea id="worry-text" data-exercise="worry" maxlength="400">${escape(exercise.worry)}</textarea></div><div class="field"><label for="next-text">Wat is een kleine vervolgstap? (optioneel)</label><textarea id="next-text" data-exercise="next" maxlength="400">${escape(exercise.next)}</textarea></div><div class="field"><label for="thought-text">Welke mildere zin past? (optioneel)</label><textarea id="thought-text" data-exercise="thought" maxlength="400">${escape(exercise.thought)}</textarea></div></details>` : ""}
    ${fieldset(
      c.question,
      "practice",
      c.options.map((v, i) => [String(i), v]),
      practiceAnswer,
    )}<div id="practice-feedback" class="callout" ${practiceAnswer === "" ? "hidden" : ""}>${practiceAnswer !== "" ? c.feedback : ""}</div>
    <details><summary>Meer weten over slaap en klachten</summary><p>Pijn, stemming, omstandigheden en slaap kunnen elkaar beïnvloeden. Een slechte nacht is geen bewijs dat herstel onmogelijk is. Je hoeft geen slaapstadium perfect te halen.</p><p>Deze route helpt je iets uit te proberen. Er is geen garantie op betere slaap. Bij aanhoudende klachten kun je behandeling bespreken.</p><a href="${SOURCES.advice}" target="_blank" rel="noopener noreferrer">Slaapadviezen van Thuisarts (nieuw tabblad)</a></details>
    ${nav(4, "Kies mijn kleine stap", !state.understood)}`;
}
function actionFields(k) {
  const a = ACTIONS[k],
    d = state.details[k];
  return `<section class="action-detail"><h2>${escape(a.label)}</h2><p>${a.detail}</p>${select("Wanneer probeer je dit?", `detail.${k}.moment`, ACTION_MOMENTS[k], d.moment)}
    ${["rise", "early"].includes(k) ? `<div class="field"><label for="time-${k}">Mijn gewenste opsta-tijd</label><input id="time-${k}" type="time" name="detail.${k}.time" value="${escape(d.time)}"><p class="subtle">Kies wat bij je gewone dag past. Dit is geen berekening van een kortere nacht.</p></div>` : ""}
    ${select("Wat doe je als het niet lukt?", `detail.${k}.backup`, BACKUPS, d.backup)}<p class="subtle">Kleinere versie: ${a.small}</p>${fieldset("Hoe maak je de stap haalbaar?", `detail.${k}.feasible`, FEASIBILITY, d.feasible)}</section>`;
}
function smallStep() {
  return `${header("Van weten naar proberen", "Wat wordt jouw kleine stap?", "Kies één actie die in je dag past. Een tweede mag, maar hoeft niet.")}${care()}
    <fieldset><legend>Kies maximaal twee acties</legend><div class="choices">${availableActions(
      state,
    )
      .map(
        (k) =>
          `<label class="choice"><input type="checkbox" data-action="${k}" ${state.actions.includes(k) ? "checked" : ""}><span><strong>${ACTIONS[k].label}</strong><small>${ACTIONS[k].small}</small></span></label>`,
      )
      .join("")}</div></fieldset>
    <p id="action-count" class="subtle">${state.actions.length} van maximaal 2 acties gekozen.</p>
    <div id="action-details">${state.actions.map(actionFields).join("")}</div>${state.actions.length === 0 ? '<p class="subtle">Je hebt nog geen weekplan. Kies eerst één kleine stap.</p>' : ""}
    ${nav(5, "Bekijk mijn weekplan", !planReady(state))}`;
}
function planCard() {
  return `<section class="plan-card"><p class="eyebrow">Mijn weekexperiment</p><h2>${escape(state.goal)}</h2><p class="subtle">${TOPICS[state.topic]}${state.startDate ? " · gestart op " + new Date(state.startDate + "T12:00:00").toLocaleDateString("nl-NL") : ""}</p>${state.actions
    .map((k, i) => {
      const a = ACTIONS[k],
        d = state.details[k];
      return `<section class="plan-item"><h3>${i + 1}. ${a.label}</h3><p>${a.detail}</p><dl><dt>Mijn moment</dt><dd>${d.moment}${d.time ? " · gewenste opsta-tijd " + d.time : ""}</dd><dt>Haalbaar</dt><dd>${d.feasible}</dd><dt>Kleine versie</dt><dd>${a.small}</dd><dt>Als het niet lukt</dt><dd>${d.backup}</dd></dl></section>`;
    })
    .join(
      "",
    )}<p class="plan-footer">Een slechte nacht is geen mislukking. Je mag klein beginnen en opnieuw proberen.</p></section>`;
}
function week() {
  return `${header("Deze week", "Je plan staat klaar.", "Probeer je stap op een passend moment. Kijk na ongeveer een week hoe het gaat. Er hoeft niets perfect.")}${planCard()}${care()}
    <div class="horizontal"><button class="secondary" type="button" data-copy>Kopieer mijn plan</button><button class="secondary" type="button" data-print>Print / bewaar als pdf</button></div><div id="copy-fallback"></div>
    <p class="subtle">Neem je plan zelf mee als je het wilt bespreken. Er wordt niets automatisch verstuurd. We sturen geen herinnering.</p>
    <div class="callout"><strong>Later terugkomen?</strong><p>Zet hieronder ‘Bewaar mijn keuzes’ aan op je eigen apparaat. Of kopieer of print je plan nu. Oefentekst wordt niet meegenomen.</p></div>
    ${nav(6, "Terugkijken of bijstellen")}`;
}
function review() {
  return `${header("Hoe gaat het?", "Even terugkijken. Zonder rapportcijfer.", "Kijk naar haalbaarheid en je dagelijks leven. Als je nog niet begonnen bent, kun je dat gewoon aangeven.")}
    ${state.actions.map((k) => `<p class="callout"><strong>Jouw stap: ${ACTIONS[k].label}</strong>${state.details[k].moment}</p>`).join("")}
    ${Object.entries(EVALUATION)
      .map(
        ([k, options]) =>
          `<fieldset><legend>${{ feasible: "Hoe ging het uitproberen?", change: "Wat merk je in je dagelijks leven?", next: "Hoe wil je verder?" }[k]}</legend><p class="subtle">${state.evaluation[k] ? "Ingevuld" : "Nog niet ingevuld"}</p>${radio(`evaluation.${k}`, options, state.evaluation[k])}</fieldset>`,
      )
      .join("")}
    <div id="followup" aria-live="polite">${followup(state) ? `<div class="callout">${followup(state)}</div>` : ""}</div>
    ${care()}<p class="subtle">Nieuwe klachten, ademstops of erg slaperig overdag? <button class="text-button" type="button" data-recheck>Bekijk de zorgvragen opnieuw</button></p>
    ${nav(5, "Terug naar mijn plan")}${Object.values(state.evaluation).every(Boolean) ? `<button type="button" class="secondary" data-adjust>${state.evaluation.next === "Nog een week proberen" ? "Start een nieuwe week met dit plan" : state.evaluation.next === "Bespreken met mijn behandelaar" ? "Bekijk mijn plan voor het gesprek" : "Pas mijn kleine stap aan"}</button>` : ""}`;
}
function render(focus = false) {
  stopBreath();
  state.step = Math.min(state.step, maxStep(state));
  $("#steps").innerHTML = STEPS.map(
    (v, i) =>
      `<button type="button" class="step-link" data-step="${i + 1}" ${state.step === i + 1 ? 'aria-current="step"' : ""} ${i + 1 > maxStep(state) ? "disabled" : ""}><span class="step-number">${i + 1}</span>${v}</button>`,
  ).join("");
  $("#progress").textContent =
    `Stap ${state.step} van 6 · ${STEPS[state.step - 1]}`;
  $("#progress-bar").style.width = `${(state.step / 6) * 100}%`;
  $("#main").innerHTML = [start, check, learning, smallStep, week, review][
    state.step - 1
  ]();
  document.title = `${STEPS[state.step - 1]} · FysionAIr Slaaproute V2`;
  $("#print-plan").textContent = planText(state);
  storageStatus();
  if (focus) {
    $("#main").focus();
    window.scrollTo({ top: 0, behavior: "instant" });
  }
}
function go(step, replace = false) {
  const target = Math.max(1, Math.min(6, step, maxStep(state)));
  if (target >= 5 && !state.startDate) {
    const d = new Date();
    state.startDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }
  state.step = target;
  announce("");
  save();
  history[replace ? "replaceState" : "pushState"](null, "", `#stap-${target}`);
  render(true);
}
window.addEventListener("popstate", () => {
  const step = Number(location.hash.replace("#stap-", ""));
  go(Number.isInteger(step) ? step : 1, true);
});
function invalidateCheck() {
  if (state.actions.length)
    announce(
      "Je hulpvraag of check is gewijzigd. Kies je onderwerp opnieuw en maak een passend nieuw plan.",
    );
  state.topic = "";
  state.understood = false;
  practiceAnswer = "";
  resetPlan(state);
}
function updateButtons() {
  const button = $("[data-next]");
  if (button)
    button.disabled =
      state.step === 1
        ? !helpReady(state)
        : state.step === 2
          ? !checkReady(state) || !state.topic
          : state.step === 3
            ? !state.understood
            : state.step === 4
              ? !planReady(state)
              : false;
}
document.addEventListener("change", (event) => {
  const t = event.target,
    name = t.name;
  if (t.matches("[data-action]")) {
    if (!selectAction(state, t.dataset.action)) {
      t.checked = false;
      announce(
        "Je kunt maximaal twee acties kiezen. Haal eerst een vinkje weg.",
      );
      return;
    }
    announce("");
    render();
    $(`[data-action="${t.dataset.action}"]`)?.focus();
    save();
    return;
  }
  if (!name) return;
  if (name === "wish" || name === "goal") {
    if (state[name] !== t.value) {
      state[name] = t.value;
      invalidateCheck();
    }
  } else if (name.startsWith("answers.") || name.startsWith("safety.")) {
    const [group, key] = name.split(".");
    state[group][key] = group === "answers" ? Number(t.value) : t.value;
    invalidateCheck();
    if (group === "safety")
      announce(
        careMessages({
          ...state,
          safety: { [key]: state.safety[key] },
          duration: "",
        }).join(" "),
      );
    const activeName = name,
      activeValue = t.value;
    // Once complete, changing an answer must remove the old conclusion immediately.
    render();
    const active = [...document.getElementsByName(activeName)].find(
      (el) => el.value === activeValue,
    );
    active?.focus();
  } else if (name === "duration" || name === "impact") {
    state[name] = t.value;
    invalidateCheck();
    render();
    $(`[name="${name}"]`)?.focus();
  } else if (name === "topic") {
    if (state.topic !== t.value) {
      state.topic = t.value;
      state.understood = false;
      practiceAnswer = "";
      resetPlan(state);
    }
  } else if (name === "practice") {
    practiceAnswer = t.value;
    state.understood = true;
    $("#practice-feedback").hidden = false;
    $("#practice-feedback").textContent = TOPIC_CONTENT[state.topic].feedback;
  } else if (name.startsWith("detail.")) {
    const [, k, field] = name.split(".");
    state.details[k][field] = t.value;
    state.evaluation = initialState().evaluation;
    state.startDate = "";
  } else if (name.startsWith("evaluation.")) {
    state.evaluation[name.split(".")[1]] = t.value;
    render();
    $(`[name="${name}"]:checked`)?.focus();
  }
  updateButtons();
  save();
});
document.addEventListener("input", (e) => {
  if (e.target.dataset.exercise)
    exercise[e.target.dataset.exercise] = e.target.value;
});
document.addEventListener("click", async (event) => {
  const t = event.target.closest("button");
  if (!t) return;
  if (t.dataset.next) go(Number(t.dataset.next));
  else if (t.hasAttribute("data-back")) go(state.step - 1);
  else if (t.dataset.step) go(Number(t.dataset.step));
  else if (t.hasAttribute("data-resume") && saved) {
    state = saved;
    remember = true;
    resumePrompt = false;
    saved = null;
    go(state.step, true);
    announce(
      "Je bewaarde keuzes zijn hervat. Zijn je klachten veranderd? Bekijk de zorgvragen opnieuw.",
    );
  } else if (t.hasAttribute("data-recheck")) go(2);
  else if (t.hasAttribute("data-adjust")) {
    const choice = state.evaluation.next;
    if (choice === "Bespreken met mijn behandelaar") {
      go(5);
      return;
    }
    state.evaluation = initialState().evaluation;
    state.startDate = "";
    if (choice === "Mijn stap kleiner maken")
      for (const k of state.actions) state.details[k].feasible = FEASIBILITY[1];
    go(choice === "Nog een week proberen" ? 5 : 4);
    announce("Een nieuwe week begint. De vorige terugblik is leeggemaakt.");
  } else if (t.hasAttribute("data-print")) {
    $("#print-plan").textContent = planText(state);
    window.print();
  } else if (t.hasAttribute("data-copy")) {
    try {
      await navigator.clipboard.writeText(planText(state));
      announce("Je plan is gekopieerd. Je kiest zelf waar je het plakt.");
    } catch {
      $("#copy-fallback").innerHTML =
        `<div class="field"><label for="manual-copy">Kopiëren lukte niet. Selecteer deze tekst en kopieer zelf.</label><textarea id="manual-copy" readonly>${escape(planText(state))}</textarea></div>`;
      $("#manual-copy").focus();
      $("#manual-copy").select();
      announce(
        "Automatisch kopiëren is niet beschikbaar. Je plan staat hieronder als tekst.",
      );
    }
  } else if (t.id === "breath-start") startBreath();
  else if (t.id === "breath-stop") stopBreath();
});
function stopBreath(completed = false) {
  if (breathTimer !== null) clearInterval(breathTimer);
  breathTimer = null;
  if ($("#breath-circle")) {
    $("#breath-circle").style.transform = "";
    $("#breath-circle").classList.remove("out");
    $("#breath-phase").textContent = "Jouw tempo";
    $("#breath-status").textContent = completed
      ? "De minuut is klaar. Je mag stoppen of herhalen."
      : "De oefening staat stil.";
    $("#breath-start").textContent = completed
      ? "Herhaal ademcirkel"
      : "Start ademcirkel";
    $("#breath-start").disabled = false;
    $("#breath-stop").disabled = true;
  }
}
function startBreath() {
  stopBreath();
  breathStarted = Date.now();
  $("#breath-start").disabled = true;
  $("#breath-stop").disabled = false;
  $("#breath-stop").focus();
  const tick = () => {
    const elapsed = (Date.now() - breathStarted) / 1000;
    if (elapsed >= 60) {
      stopBreath(true);
      $("#breath-start")?.focus();
      return;
    }
    const out = elapsed % 10 >= 4;
    const phase = out ? "Rustig uit" : "Rustig in";
    $("#breath-phase").textContent = phase;
    $("#breath-circle").classList.toggle("out", out);
    $("#breath-circle").style.transform = out ? "scale(1)" : "scale(1.22)";
    const text = matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "Teksttempo actief; de cirkel blijft stil."
      : "De ademcirkel loopt. Volg je eigen tempo als dat fijner voelt.";
    if ($("#breath-status").textContent !== text)
      $("#breath-status").textContent = text;
  };
  tick();
  breathTimer = setInterval(tick, 200);
}
document.addEventListener("visibilitychange", () => {
  if (document.hidden) stopBreath();
});
window.addEventListener("pagehide", () => {
  stopBreath();
  exercise = { worry: "", next: "", thought: "" };
});
// Back/forward cache is still memory: start a fresh visit instead of exposing a stale form.
window.addEventListener("pageshow", (event) => {
  if (!event.persisted) {
    // Browsers can restore form controls after pageshow, even without bfcache.
    // Reconcile on the next task so a restored radio cannot disagree with state.
    setTimeout(() => render(), 0);
    return;
  }
  state = initialState();
  remember = false;
  practiceAnswer = "";
  exercise = { worry: "", next: "", thought: "" };
  try {
    saved = restore(localStorage.getItem(STORAGE_KEY));
  } catch {
    saved = null;
  }
  resumePrompt = Boolean(saved);
  history.replaceState(null, "", location.pathname + "#stap-1");
  setTimeout(() => render(), 0);
});
window.addEventListener("beforeprint", () => {
  $("#print-plan").textContent = planText(state);
});
$("#remember").addEventListener("change", (e) => {
  remember = e.target.checked;
  if (remember) {
    saved = null;
    resumePrompt = false;
    save();
  } else {
    try {
      localStorage.removeItem(STORAGE_KEY);
      saved = null;
      resumePrompt = false;
      storageProblem = "";
    } catch {
      storageProblem =
        "Wissen van bewaarde keuzes is niet gelukt. Wis de sitegegevens via je browser.";
    }
    storageStatus();
  }
  if (state.step === 1) render();
});
$("#erase").addEventListener("click", () => {
  $("#erase-confirm").hidden = false;
  $("#erase-yes").focus();
});
$("#erase-no").addEventListener("click", () => {
  $("#erase-confirm").hidden = true;
  $("#erase").focus();
});
$("#erase-yes").addEventListener("click", () => {
  let failed = false;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    failed = true;
  }
  state = initialState();
  remember = false;
  saved = null;
  resumePrompt = false;
  practiceAnswer = "";
  exercise = { worry: "", next: "", thought: "" };
  storageProblem = failed
    ? "Wissen op het apparaat is niet gelukt. Wis de sitegegevens via je browser."
    : "";
  $("#erase-confirm").hidden = true;
  go(1, true);
  announce(
    failed
      ? "Je keuzes zijn uit dit bezoek gewist. Op het apparaat wissen lukte niet."
      : "Je V2-keuzes en oefentekst zijn gewist.",
  );
});
// A deletion in another tab must not be silently undone by this tab's next autosave.
window.addEventListener("storage", (e) => {
  if ((e.key === STORAGE_KEY || e.key === null) && e.newValue === null) {
    remember = false;
    saved = null;
    resumePrompt = false;
    storageStatus();
    announce(
      "De bewaarde keuzes zijn in een ander tabblad gewist. Dit bezoek wordt niet meer bewaard.",
    );
  }
});
render();
