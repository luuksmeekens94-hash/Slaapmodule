# FysionAIr — Slaapmodule Prototype

Standalone interactieve slaapmodule voor patiënten met lage rugpijn. Gebaseerd op CGT-I, met een korte slaapcheck en passende vervolgstappen per patiënt.

## Wat is nieuw in deze versie

**Cleaner mediakaarten + audio-slot**
- Kleine kaarten zijn nu rustige preview-tegels met topic-icoon + label en "Bekijk"-knop
- Klik op een preview promoot deze naar de hoofdspeler (featured) en start de animatie automatisch
- Per `media[]`-item kun je een `audioUrl` opgeven (mp3/opus); dan wordt die afgespeeld als de patiënt op "Lees voor" klikt — anders valt het terug op browser-TTS (Web Speech API)
- Voorbeeld JSON-extensie: `{ "type": "animation", "visual": "breathe", "audioUrl": "audio/inslapen-adem.mp3", ... }`
- Voor productie-audio: genereer mp3's via ElevenLabs Dutch (≈€5/maand) en zet ze in `prototype/audio/`. De app pakt ze automatisch op.

**Persoonlijk pad (Spoor 1)**
- Vóór de slaapcheck zie je alleen Welkom + Slaapcheck in de navigatie
- Na de slaapcheck wordt de navigatie gefilterd op jouw antwoorden — alleen relevante onderdelen verschijnen
- Persoonlijk pad-overzicht direct na de slaapcheck (genummerde stappen)
- Niet-relevante onderdelen worden vermeld als "niet voor jou nodig nu" met optie voor je therapeut om ze later te openen
- Voortgangsbalk telt alleen jouw stappen

**Echte motion design (Spoor 2)**
- GSAP 3.12 timelines per visual met juiste easing en timing (40+ sec micro-lessen)
- Twaalf nieuwe SVG-scenes met motion-paths, draw-animaties, stagger en physics-based easing
- Animaties pauzeren netjes en kunnen worden gerestart of doorgespoeld naar de volgende stap
- Inhoud: ademhaling (4-6 cycles), forceren (waakstandcurve + bed-tossing), slaapcycli (depth-wave + wake markers), nachtroute (motionPath bed↔chair), 24u-klok (orbiting sun/moon), zonsopgang (rays + beam), slaapdruk (bars + dutje + recovery), gedachten (morphing thought-cards), beschermingsmeter (sweep needle), herstelcurve (drawing line + setbacks), persoonlijk plan (stagger checklist).

## Hoe te bekijken

**Optie 1 — Direct openen:**
Dubbelklik `index.html`. Werkt in elke moderne browser.

**Optie 2 — Lokale server (aanbevolen):**
```
npx http-server . -p 4321
```
Open vervolgens http://localhost:4321

## Inhoud

- `index.html` — prototype layout, interactie en animated SVG
- `data/sleep-module.json` — alle moduleteksten, slaapcheck-vragen, adviezen en acties
- `logo.png` — FysionAIr logo

## Hoofdstukken in prototype

1. Welkom — intro met stats en doelen
2. Slaap & rugpijn — gevarensignaal-uitleg met animated SVG pathway
3. Slaapcheck — 4-groeps quiz (0–3 schaal) met live aanbeveling
4. Hoe slaap werkt — slaapstadia, circadiaan ritme, slaapdruk, melatonine/cortisol
5. Module A — Moeite met inslapen & spanning
6. Module B — Nachtelijk wakker worden
7. Module C — Te vroeg wakker worden
8. Module D — Slaapefficiëntie & slaaprestrictie
9. Module E — Gedachten over slaap en veiligheid
10. Module F — Terugvalpreventie
11. Afsluiting — Van gevarensignaal naar veiligheidssignaal

Elke module bevat:

- korte uitleg waarom dit onderdeel relevant is
- concrete stappen
- media-/animatievoorstellen
- 7-dagen actieplan
- evaluatievragen
- reflectievak voor bespreking met de fysiotherapeut

## Tech

- Alpine.js 3.14.1 (via CDN) — reactieve state
- Plus Jakarta Sans + DM Sans (Google Fonts)
- Inline SVG icons + animated SVG visualisaties
- JSON content via `fetch()` vanaf `data/sleep-module.json`
- Premium micro-animaties in HTML/CSS, aangestuurd via `media[].visual` en `media[].script`
- localStorage voor quiz-antwoorden, modulechecklists, evaluaties en reflecties

## Localhost

Vanuit de workspace:

```
node tools/static-server.mjs
```

Open daarna http://localhost:4321

## Deploy

Drop `slaapmodule-prototype/` naar Vercel of Netlify als static site — geen build-step nodig.
