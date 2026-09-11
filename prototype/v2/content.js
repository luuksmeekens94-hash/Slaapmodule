export const SOURCES = {
  advice:
    "https://www.thuisarts.nl/slecht-slapen/ik-wil-beter-slapen-slaapadviezen",
  restriction:
    "https://www.thuisarts.nl/slecht-slapen/ik-ga-korter-in-bed-liggen-als-behandeling-om-beter-te-slapen",
  apnea: "https://www.thuisarts.nl/slaapapneu/ik-denk-dat-ik-slaap-apneu-heb",
  nhg: "https://richtlijnen.nhg.org/standaarden/slaapproblemen",
};
export const introArt = `<div class="intro-art"><svg viewBox="0 0 140 120" role="img" aria-label="Een rustige nacht gaat over in een nieuwe dag"><path d="M22 65a35 35 0 0 0 48-44A35 35 0 1 1 22 65" fill="#21488c"/><path d="M71 96a27 27 0 0 1 54 0" fill="#69bfc0"/><path d="M61 99h72M74 109h44" stroke="#257a87" stroke-width="3" stroke-linecap="round"/><circle cx="97" cy="28" r="3" fill="#6baeb8"/><path d="M115 43v10m-5-5h10" stroke="#6baeb8" stroke-width="2"/></svg><p><strong>Meer ruimte voor je dag</strong>Slaap en klachten kunnen elkaar beïnvloeden. Eén kleine stap kan helpen om te ontdekken wat bij jou past.</p></div>`;
export const nightCard = `<div class="split-card"><div><p class="eyebrow">Suf & rustig</p><h3>Je mag blijven liggen</h3><p>Wakker zijn hoeft niet meteen een probleem te zijn. Je hoeft slaap niet af te dwingen.</p></div><div><p class="eyebrow">Alert & gefrustreerd</p><h3>Even iets rustigs doen</h3><p>Ga zo mogelijk even uit bed, bij gedempt licht. Keer terug als je slaperig wordt. Je hoeft de minuten niet te tellen.</p></div></div><p class="subtle">Is opstaan moeilijk of onveilig door pijn of valgevaar? Bespreek een haalbaar alternatief met je behandelaar.</p>`;
export const clockDiagram = `<figure class="diagram"><div class="diagram-pair"><div><h3>Je slaapklok</h3><svg viewBox="0 0 240 110" role="img" aria-label="Daglicht en een regelmatig dagritme geven je slaapklok houvast"><circle cx="55" cy="52" r="24" fill="#62babc"/><g stroke="#25858b" stroke-width="3"><path d="M55 17v-8M55 87v8M20 52h-8M90 52h8M31 28l-6-6M79 76l6 6M31 76l-6 6M79 28l6-6"/></g><path d="M112 52h30m-8-7 8 7-8 7" fill="none" stroke="#4a5878" stroke-width="2"/><circle cx="183" cy="52" r="31" fill="#edf2fb" stroke="#21488c" stroke-width="2"/><path d="M183 30v22l15 10" fill="none" stroke="#21488c" stroke-width="3"/></svg><p>Licht en je dagritme geven je lichaam houvast bij dag en nacht.</p></div><div><h3>Je slaapdruk</h3><svg viewBox="0 0 240 110" role="img" aria-label="De behoefte aan slaap bouwt doorgaans op tijdens wakker zijn en neemt af tijdens slaap"><path d="M12 86C60 83 95 52 155 22Q180 22 191 64T227 85L227 94H12Z" fill="#d9eae9"/><path d="M12 86C60 83 95 52 155 22Q180 22 191 64T227 85" fill="none" stroke="#247d89" stroke-width="3"/><path d="M12 96h216" stroke="#697b94"/><text x="15" y="108" font-size="11" fill="#4a5878">wakker zijn</text><text x="180" y="108" font-size="11" fill="#4a5878">slaap</text></svg><p>De behoefte aan slaap neemt meestal toe zolang je wakker bent.</p></div></div><figcaption>Dit is een uitlegplaat, geen meting of voorspelling van jouw nacht.</figcaption></figure>`;
export const TOPIC_CONTENT = {
  inslapen: {
    title: "Je hoeft slaap niet te forceren.",
    text: "Steeds proberen om te slapen kan je juist alerter maken. Een rustig moment kan prettig zijn. Pijn, zorgen en andere klachten kunnen ook meespelen.",
    card: `<div class="callout"><strong>Van “ik moet slapen” naar “ik mag even rusten”</strong><p>Ontspannen is geen opdracht die moet lukken. Je hoeft na een oefening niet meteen in slaap te vallen.</p></div>`,
    question: "Wat zou je vanavond kunnen proberen?",
    options: [
      "Een rustig moment, zonder te eisen dat ik daarna slaap",
      "Extra hard mijn best doen om snel te slapen",
    ],
    feedback:
      "Een rustig moment geeft ruimte. Slaap afdwingen lukt niet. Kies straks een kleine stap die bij je past.",
  },
  wakker: {
    title: "Wakker liggen: kijk wat je nodig hebt.",
    text: "Kort wakker worden kan bij een gewone nacht horen. Lig je langer wakker? Let op hoe je je voelt, zonder steeds op de klok te kijken.",
    card: nightCard,
    question: "Je ligt wakker en wordt steeds gefrustreerder. Wat past?",
    options: [
      "Even iets rustigs doen en terug als ik slaperig ben",
      "Op de klok wachten tot precies 20 minuten voorbij zijn",
    ],
    feedback:
      "Je gevoel is het uitgangspunt. Je hoeft geen stopwatch te gebruiken. Kies een veilige, rustige plek.",
  },
  vroeg: {
    title: "Een vroege start hoeft niet vanzelf.",
    text: "Vroeg wakker worden kan onrust geven. Houd een haalbare, gewenste dagstart aan. Ben je daarvoor alert en onrustig? Doe even iets rustigs bij gedempt licht.",
    card: nightCard,
    question: "Je bent ruim vóór je gewenste dagstart wakker. Wat past?",
    options: [
      "Rustig blijven en daglicht verbinden aan mijn gewone dagstart",
      "Meteen fel licht opzoeken en mijn dag steeds vroeger starten",
    ],
    feedback:
      "Verbind daglicht aan je gewenste dagritme. Bij een blijvend sterk verschoven ritme kan je huisarts meedenken.",
  },
  ritme: {
    title: "Geef je dag een rustig anker.",
    text: "Een regelmatig dagritme en buitenlicht kunnen je slaap ondersteunen. Kies een haalbare opsta-tijd en een klein moment buiten. Je hoeft je nacht hiervoor niet bewust korter te maken.",
    card: clockDiagram,
    question: "Je slaapt in het weekend op andere tijden. Waar begin je?",
    options: [
      "Een haalbaar dagritme en een moment buitenlicht",
      "Zelf berekenen hoeveel minder uren ik in bed mag liggen",
    ],
    feedback:
      "Regelmaat is iets anders dan slaaprestrictie. V2 rekent geen kortere nacht voor je uit.",
  },
  piekeren: {
    title: "Geef gedachten een plek buiten bed.",
    text: "Een gedachte kan blijven terugkomen als je moe bent. Je hoeft die niet weg te duwen. Een kort schrijfmoment overdag kan helpen om er minder mee bezig te zijn in bed.",
    card: `<div class="split-card"><div><p class="eyebrow">Opmerken</p><h3>“Morgen lukt niets.”</h3><p>Dit is een gedachte, geen voorspelling die vaststaat.</p></div><div><p class="eyebrow">Milder maken</p><h3>“Ik kijk wat wél kan.”</h3><p>Een moeilijke nacht bepaalt niet mijn hele dag. Ik mag mijn dag aanpassen.</p></div></div>`,
    question: "Wat is een behulpzame manier om met een zorg om te gaan?",
    options: [
      "Eén zorg opschrijven met een mogelijke kleine vervolgstap",
      "Zeker proberen te weten dat morgen alles goed gaat",
    ],
    feedback:
      "Je hoeft geen zekerheid te vinden. Een klein, concreet vervolgstapje is genoeg. Bespreek aanhoudende zorgen met iemand die je vertrouwt.",
  },
};
export const treatmentCard = `<details><summary>Als gewone slaapadviezen niet genoeg helpen</summary><h3>Behandeling samen bespreken</h3><p>Bij aanhoudend slecht slapen kan gedragsmatige behandeling passen. Korter in bed liggen, ook slaaprestrictie genoemd, kan daar deel van zijn. Deze route geeft geen persoonlijk tijd-in-bed-schema.</p><p>Bespreek met je huisarts of praktijkondersteuner wat past. Neem je hulpvraag en je ervaringen met slaapadviezen mee.</p><p>Vraag wie je begeleidt, wanneer je terugkijkt, en bij welke klachten je stopt of contact opneemt. Overleg eerst bij epilepsie, ernstige psychische klachten of een behandelde slaapziekte.</p><p>Word je onbedoeld slaperig overdag? Neem contact op met je huisarts. Ga niet autorijden als je erg slaperig bent.</p><a href="${SOURCES.restriction}" target="_blank" rel="noopener noreferrer">Lees over deze behandeling bij Thuisarts (nieuw tabblad)</a></details>`;
