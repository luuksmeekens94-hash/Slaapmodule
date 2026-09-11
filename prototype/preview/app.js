const videos = {
  welcome: {
    id: "3bc475fe-9e56-405e-ad06-1d8faef8c8e8",
    title: "Welkom bij je slaaproute",
    text: [
      "Welkom bij je slaaproute. Als slapen lastig is, kan dat ook overdag veel van je vragen.",
      "Deze route biedt ruimte om te kijken wat er bij jou speelt, en wat je graag weer makkelijker zou willen doen.",
      "Je verkent wat jou zou kunnen helpen. Zo kun je ontdekken welke kleine stap goed voelt voor jou.",
      "Alles hoeft niet tegelijk. Je kunt de route rustig doorlopen, op een moment dat bij je past.",
    ],
  },
  awake: {
    id: "8aeba680-19d8-48b6-88fd-7abbfb8c52f0",
    title: "Als je wakker ligt",
    text: [
      "Wakker liggen kan frustrerend zijn. Als je nog slaperig bent en rustig ligt, kun je gerust blijven liggen. Je hoeft de slaap niet te forceren.",
      "Als je merkt dat je alerter of gespannener wordt, kan het prettig zijn om bij gedempt licht iets rustigs te doen. Wanneer je weer slaperig wordt, kun je terug naar bed.",
      "Daarbij hoef je geen minuten te tellen. Als opstaan lastig of onveilig is, kun je samen met je behandelaar een passend alternatief zoeken.",
    ],
  },
  worry: {
    id: "b2eed012-0fae-448f-9970-cac9d6d9d3c5",
    title: "Geef je gedachten een plek",
    text: [
      "In de stilte van de nacht kunnen zorgen groter voelen. Misschien denk je aan morgen en aan alles wat er nog moet gebeuren. Op zo’n moment kan het helpen om te bedenken dat je nog niet weet hoe morgen zal verlopen.",
      "Overdag kun je rustig de tijd nemen om op te schrijven wat je bezighoudt. Daarnaast kun je kijken of er een kleine stap mogelijk is. Bij een drukke dag zou je bijvoorbeeld kunnen kiezen wat het belangrijkst is.",
      "Niet iedere zorg hoeft meteen opgelost te worden. Als deze manier bij je past, kun je hieronder verkennen wat jou kan helpen.",
    ],
  },
};
const steps = [
  "Verkennen",
  "Inzicht & oefening",
  "Mijn weekactie",
  "Terugkijken",
];
const stepLabels = [
  "Samen verkennen",
  "Begrijpen & proberen",
  "Een haalbare stap",
  "Ervaring terug naar de praktijk",
];
const scenarios = {
  worry: {
    label: "Gedachten blijven doorgaan",
    quote:
      "“Als ik in bed lig, ben ik de volgende dag al aan het regelen. Ik wil overdag weer met meer aandacht bij mijn gezin zijn.”",
    goal: "Met meer aandacht bij mijn gezin zijn",
    title: "Geef je gedachten een plek.",
    intro:
      "Sam kiest ervoor om overdag kort aandacht te geven aan zorgen. Niet alles hoeft meteen opgelost te worden.",
    action: "Overdag kort opschrijven wat me bezighoudt",
    moments: ["Na de lunch", "Na het werk", "Aan het einde van de middag"],
    backups: [
      "Alleen één gedachte opschrijven",
      "Het op een rustiger dag proberen",
      "Bespreken wat haalbaar is",
    ],
    prompt: "Wat zou Sam kunnen doen met een volle agenda?",
    options: [
      "Kiezen wat vandaag het belangrijkst is",
      "Alles vandaag nog proberen op te lossen",
      "Een gedachte laten staan zonder oplossing",
    ],
    feedback: [
      "Eén prioriteit kiezen kan wat overzicht geven. Sam hoeft niet de hele dag in één keer op te lossen.",
      "Dat kan de druk juist groter maken. Sam kan ook één belangrijk punt kiezen en de rest laten staan.",
      "Dat mag ook. Een zorg aandacht geven betekent niet dat er meteen een oplossing moet zijn.",
    ],
    question:
      "Wat hielp om gedachten wat ruimte te geven, en wat bleef lastig?",
  },
  awake: {
    label: "Spanning bij wakker liggen",
    quote:
      "“Als ik wakker lig, probeer ik steeds harder te slapen. Ik wil minder met de nacht bezig zijn en overdag weer wat ruimte voelen.”",
    goal: "Overdag weer wat ruimte voelen",
    title: "Je hoeft slaap niet af te dwingen.",
    intro:
      "Sam verkent wat prettig is bij wakker liggen. Rustig blijven liggen kan, en bij oplopende spanning kan iets rustigs bij gedempt licht passen.",
    action: "Een rustige mogelijkheid klaarzetten voor wakker liggen",
    moments: [
      "Aan het begin van de avond",
      "Na het avondeten",
      "Tijdens een rustig moment overdag",
    ],
    backups: [
      "Een rustige optie in bed kiezen",
      "Eerst met mijn behandelaar overleggen",
      "Het op een rustiger dag proberen",
    ],
    prompt: "Welke mogelijkheid zou bij Sam kunnen passen?",
    options: [
      "Een rustig boek klaarleggen",
      "Blijven liggen als dat prettig voelt",
      "Een alternatief bespreken als opstaan onveilig is",
    ],
    feedback: [
      "Een rustig boek bij gedempt licht kan een mogelijkheid zijn. Als Sam weer slaperig wordt, kan Sam terug naar bed.",
      "Als Sam rustig en slaperig is, hoeft er niets te veranderen. Er hoeft geen aantal minuten te worden bijgehouden.",
      "Veiligheid gaat voor. Sam kan met de behandelaar zoeken naar een rustige optie die wel haalbaar is.",
    ],
    question:
      "Wat gebeurde er met de spanning, en welke rustige mogelijkheid paste?",
  },
};
const freshState = () => ({
  step: 0,
  topic: "worry",
  exercise: 0,
  moment: 0,
  backup: 0,
  planned: false,
  outcome: "",
  clinician: false,
});
let state = freshState();
const content = document.querySelector("#demo-content");
const welcome = document.querySelector("#welcome-dialog");
const videoDialog = document.querySelector("#video-dialog");
let videoTrigger;
const selected = (a, b) => (a === b ? " selected" : "");
const choice = (topic, title, copy) =>
  `<button class="choice" data-topic="${topic}" aria-pressed="${state.topic === topic}"><span class="radio" aria-hidden="true"></span><span><strong>${title}</strong><small>${copy}</small></span></button>`;
const next = (label, step) =>
  `<div class="demo-actions"><span>Fictieve situatie · vrij uit te proberen</span><button class="button primary" data-step="${step}">${label} <span aria-hidden="true">→</span></button></div>`;

function render(focus = false) {
  const s = scenarios[state.topic];
  document.querySelector("#route-nav").innerHTML = steps
    .map(
      (label, index) =>
        `<button class="route-step" data-step="${index}" ${index === state.step ? 'aria-current="step"' : ""}><span class="step-number">0${index + 1}</span><span>${label}</span></button>`,
    )
    .join("");
  document.querySelector("#step-label").textContent =
    `0${state.step + 1} — ${stepLabels[state.step]}`;
  if (state.step === 0) {
    content.innerHTML = `<h3>Wat wil je weer makkelijker doen?</h3><p class="demo-intro">Een slaaproute begint bij het dagelijks leven. Maak kennis met Sam en kies welk voorbeeld je wilt verkennen.</p><blockquote class="quote"><p>${s.quote}</p><cite>Sam · fictieve hulpvraag</cite></blockquote><p class="choice-label">Kies een situatie</p><div class="choices">${choice("worry", "Een vol hoofd", "Gedachten over morgen blijven terugkomen.")}${choice("awake", "Wakker in bed", "De spanning loopt op als slapen niet lukt.")}</div><p class="inline-note">In de volledige route volgen ook vragen over het slaappatroon, de duur, de hinder en signalen die een gesprek met een zorgverlener vragen. Hier bekijken we twee vooraf uitgewerkte voorbeelden.</p>${next("Ontdek wat kan helpen", 1)}`;
  } else if (state.step === 1) {
    content.innerHTML = `<h3>${s.title}</h3><p class="demo-intro">${s.intro}</p><div class="insight-grid"><article class="insight-card"><p class="eyebrow">Even kijken</p><h4 style="margin-top:10px">${videos[state.topic].title}</h4><p>Een korte uitleg die je op je eigen moment kunt bekijken of lezen.</p><button class="text-button" data-video="${state.topic}"><span class="play-small" aria-hidden="true">▶</span> Bekijk de uitleg <small>${state.topic === "worry" ? "0:43" : "0:34"}</small></button></article><article class="insight-card"><p class="eyebrow">Om te onthouden</p><h4 style="margin-top:10px">Er is ruimte om te kiezen.</h4><p>${state.topic === "worry" ? "Je hoeft niet iedere gedachte op te lossen. Kijk of aandacht geven op een ander moment bij je past." : "Je hoeft geen minuten te tellen. Kies wat prettig en veilig is; bespreek een alternatief als opstaan lastig is."}</p></article></div><div class="exercise"><label for="exercise-choice">${s.prompt}</label><select id="exercise-choice">${s.options.map((x, i) => `<option value="${i}"${selected(i, state.exercise)}>${x}</option>`).join("")}</select><p class="exercise-feedback" id="exercise-feedback" aria-live="polite">${s.feedback[state.exercise]}</p></div>${next("Maak een kleine weekactie", 2)}`;
  } else if (state.step === 2) {
    content.innerHTML = `<h3>Klein genoeg om te proberen.</h3><p class="demo-intro">Sam kiest een actie voor de komende week. Pas het moment en het alternatief aan en zie hoe het voorbeeldplan vorm krijgt.</p><div class="plan-preview"><p class="eyebrow">Mijn actie voor deze week</p><h4>${s.action}</h4><p>Omdat ik wil: <strong>${s.goal.toLowerCase()}.</strong></p></div><div class="plan-fields"><div class="plan-field"><label for="moment">Wanneer past dit?</label><select id="moment">${s.moments.map((x, i) => `<option value="${i}"${selected(i, state.moment)}>${x}</option>`).join("")}</select></div><div class="plan-field"><label for="backup">Als het niet lukt, kan ik…</label><select id="backup">${s.backups.map((x, i) => `<option value="${i}"${selected(i, state.backup)}>${x}</option>`).join("")}</select></div></div><p class="inline-note">Een plan is een voorstel om uit te proberen. Of het past en iets oplevert, ontdek je samen. Je hoeft geen perfecte week te hebben.</p><p class="plan-confirmed" id="plan-status" role="status">${state.planned ? "✓ Het voorbeeldplan is gekozen. Het blijft alleen in deze geopende pagina." : ""}</p><div class="demo-actions"><span>Probeer gerust verschillende keuzes.</span><button class="button primary" id="confirm-plan">${state.planned ? "Bekijk de terugblik" : "Kies dit voorbeeldplan"} <span aria-hidden="true">→</span></button></div>`;
  } else {
    content.innerHTML = `<div class="view-switch" role="group" aria-label="Perspectief"><button data-view="patient" aria-pressed="${!state.clinician}">Als patiënt</button><button data-view="clinician" aria-pressed="${state.clinician}">Als behandelaar</button></div>${state.clinician ? clinicianView(s) : patientView(s)}`;
  }
  if (focus) content.focus({ preventScroll: true });
}
function patientView(s) {
  return `<h3>Wat neem je mee uit deze week?</h3><p class="demo-intro">Een kleine terugblik maakt zichtbaar wat haalbaar was. Kies een voorbeeldreactie van Sam en bekijk hoe die terugkomt in het behandelaarsperspectief.</p><div class="plan-preview"><p class="eyebrow">${state.planned ? "Gekozen voorbeeldplan" : "Nog geen plan gekozen · voorbeeldsuggestie"}</p><h4>${s.action}</h4><p>${s.moments[state.moment]} · Alternatief: ${s.backups[state.backup].toLowerCase()}.</p></div><div class="exercise"><label for="outcome">Hoe ging het uitproberen?</label><select id="outcome"><option value="">Kies een voorbeeldreactie…</option>${["Het paste bij me", "Het was nog te veel", "Ik heb het nog niet geprobeerd"].map((x) => `<option${selected(x, state.outcome)}>${x}</option>`).join("")}</select><p class="exercise-feedback" id="outcome-feedback" aria-live="polite" ${state.outcome ? "" : "hidden"}>${outcomeFeedback()}</p></div><div class="demo-actions"><span>Iedere ervaring is een vertrekpunt.</span><button class="button primary" data-view="clinician">Bekijk als behandelaar <span aria-hidden="true">→</span></button></div>`;
}
function outcomeFeedback() {
  return state.outcome === "Het paste bij me"
    ? "Mooi om te onderzoeken wat prettig was. Sam kan bespreken of deze stap nog een week past."
    : state.outcome === "Het was nog te veel"
      ? "Dat is bruikbare informatie. Sam kan de stap kleiner maken of samen zoeken naar een ander moment."
      : state.outcome
        ? "Ook dat mag. Sam kan bespreken wat het lastig maakte en wat er eerst nodig is."
        : "";
}
function clinicianView(s) {
  return `<div class="clinician-head"><h3>Een vertrekpunt voor het gesprek.</h3><span class="status-pill">Conceptweergave</span></div><p class="demo-intro">Zo zou een compacte terugkoppeling de fysiotherapeut kunnen ondersteunen. Deze weergave gebruikt alleen Sams fictieve keuzes in deze preview.</p><dl class="summary-grid"><div class="summary-row"><dt>Wat Sam weer wil kunnen</dt><dd>${s.goal}</dd></div><div class="summary-row"><dt>Verkend onderwerp</dt><dd>${s.label}</dd></div><div class="summary-row"><dt>${state.planned ? "Gekozen weekactie" : "Voorbeeldactie · nog niet gekozen"}</dt><dd>${s.action}</dd></div><div class="summary-row"><dt>Moment & alternatief</dt><dd>${s.moments[state.moment]}<br>${s.backups[state.backup]}</dd></div><div class="summary-row"><dt>Ervaring met de actie</dt><dd>${state.outcome || "Nog geen voorbeeldreactie ingevuld"}</dd></div><div class="summary-row"><dt>Bron van de informatie</dt><dd>Fictief voorbeeld, geen meting</dd></div></dl><div class="conversation"><strong>Mogelijke gespreksopening</strong><p>“${state.outcome === "Het was nog te veel" ? "Wat zou de stap voor jou kleiner of makkelijker maken?" : state.outcome === "Ik heb het nog niet geprobeerd" ? "Wat had je nodig om te kunnen beginnen?" : s.question}”</p></div><p class="inline-note">Concept ter bespreking: er is geen koppeling met een dossier, intakeplatform of behandelomgeving. Er wordt niets automatisch gedeeld of beoordeeld.</p>`;
}
function goToStep(step) {
  state.step = step;
  render(true);
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
document.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  if (button.hasAttribute("data-about")) welcome.showModal();
  if (button.dataset.video) openVideo(button.dataset.video, button);
  if (button.hasAttribute("data-step")) goToStep(Number(button.dataset.step));
  if (button.dataset.topic && button.dataset.topic !== state.topic) {
    state = { ...freshState(), topic: button.dataset.topic };
    render();
    content.querySelector(`[data-topic="${state.topic}"]`).focus();
  }
  if (button.dataset.view) {
    state.clinician = button.dataset.view === "clinician";
    state.step = 3;
    render(true);
  }
});
document.addEventListener("change", (event) => {
  const { id, value } = event.target;
  if (id === "exercise-choice") {
    state.exercise = Number(value);
    document.querySelector("#exercise-feedback").textContent =
      scenarios[state.topic].feedback[state.exercise];
  }
  if (id === "moment" || id === "backup") {
    state[id] = Number(value);
    state.planned = false;
    state.outcome = "";
    document.querySelector("#plan-status").textContent = "";
    document.querySelector("#confirm-plan").innerHTML =
      'Kies dit voorbeeldplan <span aria-hidden="true">→</span>';
  }
  if (id === "outcome") {
    state.outcome = value;
    const feedback = document.querySelector("#outcome-feedback");
    feedback.hidden = !value;
    feedback.textContent = outcomeFeedback();
  }
});
content.addEventListener("click", (event) => {
  if (event.target.closest("#confirm-plan")) {
    state.planned = true;
    goToStep(3);
  }
});
document
  .querySelector("#enter-preview")
  .addEventListener("click", () => welcome.close());
document
  .querySelector("#close-video")
  .addEventListener("click", () => videoDialog.close());
videoDialog.addEventListener("close", () => {
  document.querySelector("#player").replaceChildren();
  if (videoTrigger?.isConnected) videoTrigger.focus();
});
document.querySelector("#reset-demo").addEventListener("click", () => {
  state = freshState();
  render(true);
});
document.querySelector("#see-clinician").addEventListener("click", () => {
  state.step = 3;
  state.clinician = true;
  render();
  document.querySelector("#ontdekken").scrollIntoView();
  content.focus({ preventScroll: true });
});
window.addEventListener("pagehide", () => {
  document.querySelector("#player").replaceChildren();
});
window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    state = freshState();
    render();
    if (videoDialog.open) videoDialog.close();
    if (!welcome.open) welcome.showModal();
  }
});
render();
welcome.showModal();
