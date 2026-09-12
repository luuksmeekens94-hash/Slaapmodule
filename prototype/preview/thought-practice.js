const root = document.querySelector("#thought-practice");
const labels = ["Opmerken", "Onderzoeken", "Een zin kiezen", "Meenemen"];
const thoughts = [
  "Morgen kan ik niets als ik nu niet slaap.",
  "Ik móét nu in slaap vallen.",
  "Dit blijft elke nacht zo doorgaan.",
];
const questions = [
  "Weet je nu al zeker hoe morgen verloopt?",
  "Helpt het je om slaap nu van jezelf te eisen?",
  "Weet je zeker hoe de komende nachten verlopen?",
];
const answers = [
  [
    "Nee, dat weet ik nog niet.",
    "Het voelt voor mij wel zeker.",
    "Ik vind dit lastig.",
  ],
  [
    "Nee, dat geeft me juist druk.",
    "Ik weet niet hoe het anders kan.",
    "Ik vind dit lastig.",
  ],
  [
    "Nee, dat weet ik nog niet.",
    "Het voelt voor mij wel zeker.",
    "Ik vind dit lastig.",
  ],
];
const feedback = [
  [
    "Er is nog ruimte voor een andere uitkomst. Je hoeft niet te voorspellen dat morgen goed óf slecht wordt.",
    "Als je moe bent, kan een zorg heel overtuigend voelen. Je hoeft die niet weg te duwen. Kijk of een iets minder stellige zin past.",
    "Dat mag. Je hoeft hier geen antwoord op te vinden. Je kunt een zin bekijken of dit samen met je behandelaar bespreken.",
  ],
  [
    "Dan kun je proberen de druk wat los te laten. Rust is ook mogelijk zonder dat je direct in slaap valt.",
    "Dat is begrijpelijk. Je kunt een zin proberen die ruimte geeft om even te rusten. Slaap hoeft niet meteen te lukken.",
    "Dat mag. Je hoeft hier geen antwoord op te vinden. Je kunt een zin bekijken of dit samen met je behandelaar bespreken.",
  ],
  [
    "Een moeilijke periode zegt niet met zekerheid hoe elke volgende nacht zal zijn.",
    "Als het al langer speelt, is die zorg begrijpelijk. Je hoeft dit niet alleen op te lossen. Je kunt hulp bespreken.",
    "Dat mag. Je hoeft hier geen antwoord op te vinden. Je kunt een zin bekijken of dit samen met je behandelaar bespreken.",
  ],
];
const phrases = [
  [
    "Ik weet nog niet hoe morgen gaat. Dan kijk ik wat mogelijk is.",
    "Morgen kan lastiger zijn. Ik mag mijn dag aanpassen.",
  ],
  [
    "Ik mag nu even rusten. Slapen hoeft niet meteen te lukken.",
    "Ik hoef slaap niet af te dwingen.",
  ],
  [
    "Ik weet nog niet hoe de volgende nacht zal zijn.",
    "Het is nu lastig. Ik kan hulp vragen als dit blijft spelen.",
  ],
];
const moments = ["Na de lunch", "Na het werk", "Op een rustig moment overdag"];
const fresh = () => ({
  step: 0,
  thought: null,
  answer: null,
  phrase: null,
  moment: "",
  smaller: false,
  result: false,
  reflection: null,
});
let state = fresh();
const radio = (name, items, chosen) =>
  `<fieldset class="practice-options"><legend class="sr-only">${name === "thought" ? "Welke gedachte herken je?" : name === "answer" ? "Wat is jouw antwoord?" : "Welke zin voelt passend?"}</legend>${items.map((label, i) => `<label class="practice-option"><input type="radio" name="${name}" value="${i}" ${chosen === i ? "checked" : ""}><span>${label}</span></label>`).join("")}</fieldset>`;
const actions = (label = "Verder") =>
  `<p class="practice-error" id="practice-error" role="alert"></p><div class="practice-actions">${state.step ? '<button class="btn btn-ghost" data-back>← Terug</button>' : '<span class="practice-reassurance">Je hoeft niets in te typen.</span>'}<button class="btn btn-primary" data-next>${label} →</button></div>`;
function render(focus = false) {
  document.querySelector("#practice-progress").innerHTML = labels
    .map(
      (label, i) =>
        `<li ${state.step === i ? 'aria-current="step"' : ""} class="${state.step > i ? "visited" : ""}"><span>${i + 1}</span><small>${label}</small></li>`,
    )
    .join("");
  if (state.result) {
    renderResult();
    if (focus) root.focus({ preventScroll: true });
    return;
  }
  if (state.step === 0)
    root.innerHTML = `<h2>Welke gedachte herken je?</h2><p class="practice-lead">Kies één zin om mee te oefenen. Je hoeft niet alles te herkennen.</p>${radio("thought", thoughts, state.thought)}<button class="practice-link" data-reading>Geen van deze zinnen past bij mij</button>${actions()}`;
  if (state.step === 1)
    root.innerHTML = `<p class="practice-selected">Jouw gekozen gedachte<span>“${thoughts[state.thought]}”</span></p><h2>${questions[state.thought]}</h2><p class="practice-lead">Kies wat je nu denkt. Dit is geen toets.</p>${radio("answer", answers[state.thought], state.answer)}<div class="practice-feedback" role="status" ${state.answer === null ? "hidden" : ""}>${state.answer === null ? "" : feedback[state.thought][state.answer]}</div>${actions("Bekijk een andere zin")}`;
  if (state.step === 2)
    root.innerHTML = `<h2>Welke zin voelt passend?</h2><p class="practice-lead">Een zin mag rustiger zijn én kloppen voor jou. Je hoeft jezelf nergens van te overtuigen.</p>${radio("phrase", [...phrases[state.thought], "Deze zinnen passen niet. Ik wil dit liever bespreken."], state.phrase)}${actions("Maak het klein")}`;
  if (state.step === 3) {
    const discussion = state.phrase === 2;
    root.innerHTML = `<p class="practice-selected">${discussion ? "Jouw keuze" : "Jouw gekozen zin"}<span>${discussion ? "Ik wil dit liever bespreken." : `“${phrases[state.thought][state.phrase]}”`}</span></p><h2>${discussion ? "Je hoeft dit niet alleen te doen." : "Wanneer kun je dit rustig proberen?"}</h2><p class="practice-lead">${discussion ? "Je kunt de gedachte en wat je lastig vindt meenemen naar je huisarts of behandelaar. De kaart hieronder kan je helpen het gesprek te beginnen." : "Lees je gekozen zin overdag één keer rustig terug. Je hoeft er niet direct rustiger van te worden."}</p>${discussion ? "" : `<label class="practice-field" for="practice-moment">Kies een moment<select id="practice-moment"><option value="">Kies wat bij je dag past…</option>${moments.map((m) => `<option ${state.moment === m ? "selected" : ""}>${m}</option>`).join("")}</select></label><label class="practice-small"><input type="checkbox" id="practice-smaller" ${state.smaller ? "checked" : ""}><span>Als dit niet lukt, kies ik een ander rustig moment.</span></label>`}${actions("Bekijk mijn kaart")}`;
  }
  if (focus) root.focus({ preventScroll: true });
}
function cardText() {
  return state.phrase === 2
    ? `Om te bespreken\nMijn gedachte: ${thoughts[state.thought]}\nIk vond nog geen zin die bij me past. Kunnen we hier samen naar kijken?`
    : `Mijn kleine stap\nMijn zin: ${phrases[state.thought][state.phrase]}\n${state.moment}: ik lees mijn zin één keer rustig terug.${state.smaller ? "\nAls dit niet lukt, kies ik een ander rustig moment." : ""}\nLater kijk ik of dit bij me paste. Het hoeft niet direct iets aan mijn slaap te veranderen.`;
}
function renderResult() {
  const discussion = state.phrase === 2;
  root.innerHTML = `<p class="eyebrow">${discussion ? "Om samen te bespreken" : "Jouw kleine stap"}</p><h2>${discussion ? "Neem je vraag mee." : "Eén keer proberen is een begin."}</h2><div class="practice-takeaway"><span class="takeaway-icon" aria-hidden="true">${discussion ? "?" : "↗"}</span><div><h3>${discussion ? "Ik wil hier samen naar kijken." : phrases[state.thought][state.phrase]}</h3><p>${discussion ? `Mijn gedachte: “${thoughts[state.thought]}”` : `${state.moment} lees ik mijn zin één keer rustig terug.`}</p>${state.smaller && !discussion ? '<p class="takeaway-backup">Als dit niet lukt, kies ik een ander rustig moment.</p>' : ""}</div></div><p class="practice-lead">${discussion ? "Er wordt niets naar je behandelaar gestuurd. Je kunt de kaart zelf meenemen naar een gesprek." : "Het doel is te ontdekken of dit bij je past. Je hoeft hiermee niet meteen beter te slapen."}</p><div class="practice-actions"><button class="btn btn-ghost" data-edit>← Mijn keuze aanpassen</button><button class="btn btn-primary" data-copy>Kopieer mijn kaart</button></div><p id="copy-status" class="practice-copy-status" role="status"></p><textarea id="copy-fallback" aria-label="Mijn kaart om zelf te kopiëren" readonly hidden></textarea>${discussion ? "" : `<details class="practice-review"><summary>Na het proberen: hoe ging het? <span aria-hidden="true">+</span></summary><p>Kies dit pas als je wilt terugkijken.</p><div class="review-options">${["Het paste bij me", "Het paste nog niet", "Nog niet geprobeerd"].map((label, i) => `<button data-reflect="${i}" aria-pressed="${state.reflection === i}">${label}</button>`).join("")}</div><p id="reflection-response" role="status">${reflectionText()}</p></details>`}<button class="practice-link" data-restart>Opnieuw beginnen</button>`;
}
function reflectionText() {
  return state.reflection === 0
    ? "Wat maakte het passend? Je kunt kijken of je dit nog eens wilt proberen."
    : state.reflection === 1
      ? "Je hoeft niet door te zetten met iets dat niet past. Kies een andere zin of bespreek wat je nodig hebt."
      : state.reflection === 2
        ? "Dat mag. Kijk of een ander moment past, of bespreek wat het lastig maakt."
        : "";
}
function reading() {
  const details = document.querySelector("#thought-reading");
  details.open = true;
  details.querySelector("summary").focus();
  details.scrollIntoView({ block: "start", behavior: "instant" });
}
root.addEventListener("change", (event) => {
  const input = event.target;
  if (input.name === "thought") {
    state.thought = Number(input.value);
    state.answer = null;
    state.phrase = null;
    state.moment = "";
    state.smaller = false;
    state.reflection = null;
  }
  if (input.name === "answer") {
    state.answer = Number(input.value);
    const box = root.querySelector(".practice-feedback");
    box.hidden = false;
    box.textContent = feedback[state.thought][state.answer];
  }
  if (input.name === "phrase") {
    state.phrase = Number(input.value);
    state.reflection = null;
  }
  if (input.id === "practice-moment") {
    state.moment = input.value;
    state.reflection = null;
  }
  if (input.id === "practice-smaller") state.smaller = input.checked;
  const error = root.querySelector("#practice-error");
  if (error) error.textContent = "";
});
root.addEventListener("click", async (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  if (button.hasAttribute("data-next")) {
    const missing =
      state.step === 0
        ? state.thought === null
        : state.step === 1
          ? state.answer === null
          : state.step === 2
            ? state.phrase === null
            : state.phrase !== 2 && !state.moment;
    if (missing) {
      root.querySelector("#practice-error").textContent =
        state.step === 3
          ? "Kies eerst een moment dat bij je past."
          : "Kies een antwoord, of lees de uitleg onder de oefening.";
      root.querySelector("input,select")?.focus();
      return;
    }
    if (state.step === 3) state.result = true;
    else state.step++;
    render(true);
    root.scrollIntoView({ block: "start", behavior: "instant" });
  }
  if (button.hasAttribute("data-back")) {
    state.step--;
    render(true);
  }
  if (button.hasAttribute("data-reading")) reading();
  if (button.hasAttribute("data-edit")) {
    state.result = false;
    state.step = 2;
    render(true);
  }
  if (button.hasAttribute("data-restart")) {
    resetPractice();
    root.focus({ preventScroll: true });
  }
  if (button.hasAttribute("data-copy")) {
    const text = cardText(),
      status = root.querySelector("#copy-status"),
      fallback = root.querySelector("#copy-fallback");
    try {
      await navigator.clipboard.writeText(text);
      if (status.isConnected)
        status.textContent =
          "Je kaart is gekopieerd. Je kunt hem zelf bewaren.";
    } catch {
      if (!fallback.isConnected) return;
      fallback.hidden = false;
      fallback.value = text;
      fallback.focus();
      fallback.select();
      status.textContent =
        "Automatisch kopiëren lukt hier niet. Je kunt de tekst hieronder zelf kopiëren.";
    }
  }
  if (button.hasAttribute("data-reflect")) {
    state.reflection = Number(button.dataset.reflect);
    root
      .querySelectorAll("[data-reflect]")
      .forEach((b) =>
        b.setAttribute(
          "aria-pressed",
          String(Number(b.dataset.reflect) === state.reflection),
        ),
      );
    root.querySelector("#reflection-response").textContent = reflectionText();
  }
});
document.querySelector("#reading-link").addEventListener("click", (event) => {
  event.preventDefault();
  reading();
});
export function resetPractice() {
  state = fresh();
  render();
}
resetPractice();
