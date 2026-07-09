# Development baseline · Slaapmodule

Datum nulmeting: 2026-07-09

## Bron en live status

| Onderdeel | Waarde |
|---|---|
| Lokale repo | `/home/luuks/projecten/slaapmodule` |
| GitHub | `luuksmeekens94-hash/Slaapmodule` |
| Branch | `master` |
| Live | `https://slaapmodule.vercel.app/` |
| Vercel output | `prototype/` |
| Laatste commit | `6a3b239 Verduidelijk ritme en slaapdruk videos` |
| Pushstatus | Geblokkeerd: `403 Permission denied` bij `git push --dry-run` |

Live `index.html` is gecontroleerd gelijk aan lokale `prototype/index.html`.

## Repo-structuur

```text
vercel.json
prototype/
  index.html
  data/sleep-module.json
  logo.png
  video/*.mp4
  video/*.png
remotion-poc/
  package.json
  src/scenes/*.tsx
  out/*.mp4
docs/
  fysionair-educatiemodule-standaard.md
  nieuwe-module-template.json
  video-productie-briefing-template.md
```

## Functionele flow

1. Introductie: slaap is trainbaar en relevant bij lage rugpijn.
2. Slaapcheck: 5 domeinen, 10 vragen.
3. Persoonlijk pad: basisuitleg + aanbevolen module(s) + afsluiting.
4. Modules A-F:
   - uitleg
   - stappen
   - media/video
   - oefenplan
   - evaluatie na 2-3 weken
   - notitie voor afspraak
   - extra hulp-signaal
5. Afsluiting met geruststellende boodschap en zorgdisclaimer.

## Contentmodel

`prototype/data/sleep-module.json` bevat:

- `chapters`: 11 hoofdstukken
- `quizOptions`: 4 antwoordopties
- `quizGroups`: 5 groepen / 10 vragen
- `therapyModules`: 6 modules
- `therapyModules[].media`: 18 media-items

Geverifieerd:

- alle chapter ids uniek
- alle quiz module references bestaan
- alle mediarefs hebben een MP4 + PNG

## Media-inventaris

Unieke visuals:

```text
breathe, clock, curve, cycles, force, meter, night, nightwake,
plan, pressure, rhythm, sun, thought, worry
```

Technische baseline:

- formaat: alle MP4's `1440x1080`
- framerate: `30fps`
- duur: `19–42 sec`
- bestandsgrootte: `1.66–2.98 MB`
- live assets: alle gecontroleerde assets geven `200`

## Technische risico's

1. **Monolithische index**  
   `prototype/index.html` bevat layout, CSS, app-state, content-rendering en animatielogica. Dit maakt refactors foutgevoelig.

2. **Geen automatische browsertests**  
   De flow werkt nu op basis van handmatige checks en statische validatie. Voor regressieveilig doorbouwen is Playwright-smoke gewenst.

3. **CDN-afhankelijkheden**  
   Alpine, GSAP, MotionPathPlugin en fonts komen van externe bronnen. Voor een zorgomgeving moeten die expliciet gepind/geborgd worden.

4. **Animatiebron onvolledig**  
   Niet elke live MP4 heeft een duidelijk actuele bron in `remotion-poc`. Sommige video’s lijken los gegenereerd. Dat beperkt iteratiesnelheid.

5. **Geen deploy-auth zekerheid**  
   Lezen kan, push geeft 403. Remote deploys mogen pas geclaimd worden na auth-fix + live smoke.

## Animatiekwaliteitsdiagnose

Sterk:

- consistent formaat en kleuren
- korte duur
- B1 labels
- alle assets laden live

Niet professioneel genoeg:

- sommige scènes voelen als losse SVG/iconen in plaats van premium educatieve mini-scènes
- motion language is niet overal gelijk
- licht/schaduw/diepte voelt beperkt
- sommige visuals zijn conceptueel te letterlijk of kinderlijk
- er is geen expliciete art-direction per animatie

## Source-of-truth regel

Voor verdere ontwikkeling geldt:

1. Eerst lokaal wijzigen in `/home/luuks/projecten/slaapmodule`.
2. Daarna `npm run validate`.
3. Daarna lokale smoke via `python3 -m http.server ...`.
4. Pas na GitHub-auth fix: commit pushen en live smoke doen.

## Eerstvolgende werk

1. Root README.
2. Smoke checklist.
3. Validatiescript.
4. Animatie quality standard.
5. Animatie backlog.
6. Eerste premium animatiebatch: `force`, `cycles`, `rhythm`.
