export const STORAGE_KEY = "fysionair.slaaproute.v2";
export const STEPS = [
  "Mijn hulpvraag",
  "Wat past bij mij?",
  "Begrijpen",
  "Mijn kleine stap",
  "Deze week",
  "Hoe gaat het?",
];
export const TOPICS = {
  inslapen: "Rust rond het inslapen",
  wakker: "Omgaan met wakker liggen",
  vroeg: "Rust bij vroeg wakker worden",
  ritme: "Regelmaat en daglicht",
  piekeren: "Ruimte voor je gedachten",
};
export const GOALS = [
  "Meer ruimte voor mijn dag",
  "Rustiger omgaan met een slechte nacht",
  "Minder strijd in bed",
  "Energie voor wat ik belangrijk vind",
];
export const QUESTIONS = {
  inslapen: "Heb je moeite om in slaap te vallen?",
  wakker: "Lig je midden in de nacht lang wakker?",
  vroeg: "Word je eerder wakker dan je wilt?",
  ritme: "Wisselen je slaaptijden of slaap je veel overdag?",
  piekeren: "Houden zorgen of gedachten over slaap je bezig?",
};
export const SAFETY = {
  sleepy:
    "Ben je overdag erg slaperig of dommel je onbedoeld in, bijvoorbeeld in het verkeer?",
  apnea:
    "Zijn er ademstops, happen naar lucht in je slaap, of snurken samen met slaperigheid overdag?",
  health:
    "Spelen epilepsie, ernstige psychische klachten, of een slaapziekte waarvoor je behandeld wordt?",
  other:
    "Houden pijn, rusteloze benen, somberheid of zorgen over medicijnen je uit je slaap?",
  shift:
    "Werk je nachtdiensten of ligt je slaapritme sterk anders dan je wilt?",
};
export const DURATIONS = [
  "Korter dan 3 weken",
  "3 weken tot 3 maanden",
  "Langer dan 3 maanden",
  "Ik heb geen slaapproblemen",
];
export const IMPACTS = ["Nauwelijks", "Soms lastig", "Veel last overdag"];
export const MOMENTS = [
  "Bij mijn gewenste dagstart",
  "Na het ontbijt",
  "Overdag op een rustig moment",
  "Vroeg in de avond",
  "Voor het naar bed gaan",
  "Als ik wakker lig",
  "Op een werkdag tijdens openingstijden",
];
export const ACTION_MOMENTS = {
  rise: [MOMENTS[0]],
  early: [MOMENTS[5]],
  light: [MOMENTS[1], MOMENTS[2]],
  night: [MOMENTS[5]],
  breathe: [MOMENTS[2], MOMENTS[3], MOMENTS[4]],
  winddown: [MOMENTS[4]],
  worry: [MOMENTS[2], MOMENTS[3]],
  thought: [MOMENTS[2], MOMENTS[3]],
  discuss: [MOMENTS[6]],
};
export const BACKUPS = [
  "Ik maak de stap kleiner",
  "Ik probeer het op het volgende passende moment",
  "Ik vraag iemand om steun",
  "Ik bespreek een alternatief met mijn behandelaar",
];
export const FEASIBILITY = [
  "Dit is haalbaar",
  "Ik begin met de kleinere versie",
];
export const ACTIONS = {
  breathe: {
    topic: "inslapen",
    label: "Eén minuut rustig ademen",
    detail:
      "Ik adem rustig, zonder extra diep te ademen. Mijn eigen tempo is ook goed.",
    small: "Een paar rustige ademhalingen zijn genoeg.",
  },
  winddown: {
    topic: "inslapen",
    label: "Een rustig moment voor het slapen",
    detail:
      "Ik kies iets rustigs, zoals een paar bladzijden lezen. Slapen hoeft niet meteen.",
    small: "Ik lees één bladzijde.",
  },
  night: {
    topic: "wakker",
    label: "De keuzekaart gebruiken als ik wakker lig",
    detail:
      "Suf en rustig? Ik mag blijven liggen. Alert of gefrustreerd? Ik ga even iets rustigs doen en keer terug als ik slaperig ben.",
    small: "Ik leg de keuzekaart alvast klaar.",
  },
  early: {
    topic: "vroeg",
    label: "Rust houden vóór mijn gewenste dagstart",
    detail:
      "Ben ik vroeg wakker en alert? Ik doe even iets rustigs bij gedempt licht. Mijn dag begint rond mijn gewenste opsta-tijd.",
    small: "Ik leg iets rustigs om te lezen klaar.",
  },
  rise: {
    topic: "ritme",
    label: "Rond dezelfde tijd opstaan",
    detail:
      "Ik kies een haalbare opsta-tijd voor mijn gewone dagritme, ook in het weekend. Ik kort mijn nacht niet bewust in.",
    small: "Ik begin op één gewone dag.",
  },
  light: {
    topic: "ritme",
    label: "Een klein moment naar buiten",
    detail:
      "Ik ga bij daglicht even naar buiten, liefst in de ochtend na mijn dagstart. Bijvoorbeeld een kort rondje of buiten iets drinken.",
    small: "Ik ga even voor de deur zitten of staan.",
  },
  worry: {
    topic: "piekeren",
    label: "Een zorg parkeren op papier",
    detail:
      "Ik schrijf overdag of vroeg in de avond één zorg op, met één mogelijke vervolgstap. Daarna leg ik het papier weg.",
    small: "Ik schrijf alleen een trefwoord op.",
  },
  thought: {
    topic: "piekeren",
    label: "Een mildere gedachte oefenen",
    detail:
      "Ik merk mijn slaapgedachte op en zoek een zin die eerlijker en vriendelijker is. Bijvoorbeeld: een moeilijke nacht bepaalt niet mijn hele dag.",
    small: "Ik lees de voorbeeldzin rustig terug.",
  },
  discuss: {
    topic: "care",
    label: "Mijn slaapklachten bespreken met de huisarts",
    detail:
      "Ik maak een afspraak en neem mijn hulpvraag mee. Ik vraag welke behandeling past en wie mij kan begeleiden.",
    small: "Ik zoek het telefoonnummer of de afsprakenpagina op.",
  },
};
export function initialState() {
  return {
    version: 2,
    step: 1,
    wish: "",
    goal: "",
    answers: {},
    safety: {},
    duration: "",
    impact: "",
    topic: "",
    understood: false,
    actions: [],
    details: {},
    startDate: "",
    evaluation: { feasible: "", change: "", next: "" },
  };
}
export function helpReady(s) {
  return (
    (Object.hasOwn(TOPICS, s.wish) || s.wish === "weinig") &&
    GOALS.includes(s.goal)
  );
}
export function checkReady(s) {
  return (
    helpReady(s) &&
    Object.keys(QUESTIONS).every((k) => [0, 1, 2, 3].includes(s.answers[k])) &&
    Object.keys(SAFETY).every((k) =>
      ["nee", "ja", "twijfel"].includes(s.safety[k]),
    ) &&
    DURATIONS.includes(s.duration) &&
    IMPACTS.includes(s.impact)
  );
}
export function recommendations(s) {
  if (!checkReady(s)) return [];
  return Object.keys(TOPICS)
    .filter((k) => s.answers[k] > 0)
    .sort((a, b) => s.answers[b] - s.answers[a]);
}
export function careMessages(s) {
  const messages = [];
  if (s.safety.sleepy === "ja")
    messages.push(
      "Ga niet autorijden als je erg slaperig bent. Regel ander vervoer. Bespreek onbedoeld indutten met je huisarts. Werk je met machines? Bespreek veilig werken met je bedrijfsarts.",
    );
  if (s.safety.sleepy === "twijfel")
    messages.push(
      "Twijfel je of je wakker genoeg blijft? Neem geen risico in het verkeer en bespreek dit met je huisarts.",
    );
  if (["ja", "twijfel"].includes(s.safety.apnea))
    messages.push(
      "Bespreek mogelijke ademstops of slaap-apneu met je huisarts. Bel op werkdagen voor een afspraak. Deze route kan slaap-apneu niet vaststellen of uitsluiten.",
    );
  if (["ja", "twijfel"].includes(s.safety.health))
    messages.push(
      "Overleg met je arts welke slaapaanpak bij je behandeling past. Begin niet op eigen houtje met korter in bed liggen.",
    );
  if (["ja", "twijfel"].includes(s.safety.other))
    messages.push(
      "Bespreek klachten of vragen over medicijnen met je huisarts. Verander voorgeschreven medicijnen niet zelf.",
    );
  if (["ja", "twijfel"].includes(s.safety.shift))
    messages.push(
      "Bij nachtdiensten of een sterk verschoven ritme past een gewone ochtendroutine niet altijd. Bespreek je ritme met je huisarts of bedrijfsarts.",
    );
  if (s.duration === DURATIONS[2] && s.impact === IMPACTS[2])
    messages.push(
      "Je slaapt al langer slecht en hebt veel hinder. Maak een afspraak met je huisarts om passende behandeling te bespreken.",
    );
  return messages;
}
export function availableActions(s) {
  return Object.keys(ACTIONS).filter(
    (k) => ACTIONS[k].topic === s.topic || k === "discuss",
  );
}
export function planReady(s) {
  return (
    checkReady(s) &&
    Object.hasOwn(TOPICS, s.topic) &&
    s.understood === true &&
    s.actions.length > 0 &&
    s.actions.length <= 2 &&
    new Set(s.actions).size === s.actions.length &&
    s.actions.every((k) => {
      const d = s.details[k];
      return (
        availableActions(s).includes(k) &&
        d &&
        ACTION_MOMENTS[k].includes(d.moment) &&
        BACKUPS.includes(d.backup) &&
        FEASIBILITY.includes(d.feasible) &&
        ((k !== "rise" && k !== "early") ||
          /^([01]\d|2[0-3]):[0-5]\d$/.test(d.time))
      );
    })
  );
}
export function maxStep(s) {
  if (!helpReady(s)) return 1;
  if (!checkReady(s) || !Object.hasOwn(TOPICS, s.topic)) return 2;
  if (!s.understood) return 3;
  if (!planReady(s)) return 4;
  return 6;
}
export function referral(search) {
  const p = new URLSearchParams(search);
  return p.get("source") === "fysionair" &&
    ["low", "medium", "high"].includes(p.get("sleep")) &&
    ["inslapen", "wakker", "ritme", "piekeren"].includes(p.get("focus"))
    ? p.get("focus")
    : "";
}
export function resetPlan(s) {
  s.actions = [];
  s.details = {};
  s.startDate = "";
  s.evaluation = initialState().evaluation;
}
export function selectAction(s, id) {
  if (!availableActions(s).includes(id)) return false;
  if (s.actions.includes(id)) {
    s.actions = s.actions.filter((k) => k !== id);
    delete s.details[id];
  } else if (s.actions.length < 2) {
    s.actions.push(id);
    s.details[id] = { moment: "", backup: "", feasible: "", time: "" };
  } else return false;
  s.startDate = "";
  s.evaluation = initialState().evaluation;
  return true;
}
// Only allow known choices and clock times across the storage boundary; no exercise text.
export function restore(raw) {
  try {
    const v = JSON.parse(raw);
    if (v?.version !== 2) return null;
    const s = initialState();
    if (Object.hasOwn(TOPICS, v.wish) || v.wish === "weinig") s.wish = v.wish;
    if (GOALS.includes(v.goal)) s.goal = v.goal;
    for (const k of Object.keys(QUESTIONS))
      if ([0, 1, 2, 3].includes(v.answers?.[k])) s.answers[k] = v.answers[k];
    for (const k of Object.keys(SAFETY))
      if (["nee", "ja", "twijfel"].includes(v.safety?.[k]))
        s.safety[k] = v.safety[k];
    if (DURATIONS.includes(v.duration)) s.duration = v.duration;
    if (IMPACTS.includes(v.impact)) s.impact = v.impact;
    if (checkReady(s) && Object.hasOwn(TOPICS, v.topic)) s.topic = v.topic;
    s.understood = Boolean(s.topic && v.understood === true);
    s.actions = Array.isArray(v.actions)
      ? [...new Set(v.actions)]
          .filter((k) => availableActions(s).includes(k))
          .slice(0, 2)
      : [];
    for (const k of s.actions) {
      const d = v.details?.[k] || {};
      s.details[k] = {
        moment: ACTION_MOMENTS[k].includes(d.moment) ? d.moment : "",
        backup: BACKUPS.includes(d.backup) ? d.backup : "",
        feasible: FEASIBILITY.includes(d.feasible) ? d.feasible : "",
        time:
          typeof d.time === "string" && /^([01]\d|2[0-3]):[0-5]\d$/.test(d.time)
            ? d.time
            : "",
      };
    }
    if (planReady(s)) {
      if (
        typeof v.startDate === "string" &&
        /^\d{4}-\d{2}-\d{2}$/.test(v.startDate) &&
        !Number.isNaN(Date.parse(v.startDate))
      )
        s.startDate = v.startDate;
      for (const [k, values] of Object.entries(EVALUATION))
        if (values.includes(v.evaluation?.[k]))
          s.evaluation[k] = v.evaluation[k];
    }
    s.step = Math.min(
      maxStep(s),
      Number.isInteger(v.step) && v.step >= 1 && v.step <= 6 ? v.step : 1,
    );
    return s;
  } catch {
    return null;
  }
}
export const EVALUATION = {
  feasible: [
    "Nog niet geprobeerd",
    "Moeilijk vol te houden",
    "Deels gelukt",
    "Goed te doen",
  ],
  change: [
    "Nog niet te zeggen",
    "Minder goed",
    "Ongeveer hetzelfde",
    "Wat beter",
  ],
  next: [
    "Nog een week proberen",
    "Mijn stap kleiner maken",
    "Een andere stap kiezen",
    "Bespreken met mijn behandelaar",
  ],
};
export function followup(s) {
  if (!Object.values(s.evaluation).every(Boolean)) return "";
  if (s.evaluation.change === "Minder goed")
    return "Gaat het minder goed? Bespreek dit met je huisarts of behandelaar. Wacht bij erg slaperig zijn niet op het einde van de week.";
  if (s.evaluation.feasible === "Nog niet geprobeerd")
    return "Je hoeft nog geen effect te beoordelen. Kies een haalbaar eerste moment of maak je stap kleiner.";
  if (s.evaluation.feasible === "Moeilijk vol te houden")
    return "Maak de stap kleiner of vraag om hulp. Moeilijk volhouden betekent niet dat je iets fout doet.";
  return "Eén week geeft een eerste indruk. Kijk vooral of de stap bij je dag past. Blijven klachten hinderlijk? Bespreek passende hulp met je huisarts.";
}
export function planText(s) {
  if (!planReady(s))
    return "Je hebt nog geen compleet weekplan. Kies eerst een actie en maak die haalbaar.";
  return [
    "MIJN SLAAPROUTE · WEEKPLAN",
    `Mijn doel: ${s.goal}`,
    `Mijn onderwerp: ${TOPICS[s.topic]}`,
    s.startDate ? `Start: ${s.startDate}` : "",
    ...s.actions.map((k, i) => {
      const a = ACTIONS[k],
        d = s.details[k];
      return `\n${i + 1}. ${a.label}\n${a.detail}\nMoment: ${d.moment}${d.time ? ` · gewenste opsta-tijd ${d.time}` : ""}\nHaalbaar: ${d.feasible}\nKleinere versie: ${a.small}\nAls het niet lukt: ${d.backup}`;
    }),
    "\nEen slechte nacht is geen mislukking. Je mag klein beginnen en opnieuw proberen.",
    "\nTerugkijken: kijk na ongeveer een week naar haalbaarheid en hoe je je overdag voelt. Je hoeft geen slaapscore te halen.",
    ...careMessages(s).map((m) => `Let op: ${m}`),
    ...Object.entries(s.evaluation)
      .filter(([, v]) => v)
      .map(
        ([k, v]) =>
          `${{ feasible: "Uitproberen", change: "Verandering", next: "Volgende stap" }[k]}: ${v}`,
      ),
    "\nNeem dit plan zelf mee als je het wilt bespreken. Het wordt niet automatisch verstuurd.",
  ]
    .filter(Boolean)
    .join("\n");
}
