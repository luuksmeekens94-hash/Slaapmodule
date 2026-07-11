# Slaapmodule Professionalisering Implementation Plan

> **For Hermes:** Use subagent-driven-development skill only for isolated review/refactor tasks. For the first execution pass, keep changes small, verify after every batch, and do not push until GitHub auth is fixed.

**Goal:** Maak van de huidige Slaapmodule een professioneel onderhoudbare FysionAIr educatiemodule met betere technische basis, vaste QA, en animaties die zorginhoudelijk premium voelen in plaats van prototype-achtig.

**Architecture:** Start met een veilige baseline zonder functionele regressie: documenteren, valideren, en smoke-testen. Daarna professionaliseren we de statische app stapsgewijs: eerst repo/QA, dan code- en designstructuur, daarna animaties batchgewijs vervangen via een duidelijke art-direction en renderpipeline. De live URL blijft `https://slaapmodule.vercel.app/`; functionele flow blijft eerst gelijk.

**Tech Stack:** Static HTML/CSS/JS, Alpine.js, GSAP, JSON-content, MP4/PNG media, Vercel static hosting. Mogelijke vervolgstap: Vite + modular JS/CSS, Playwright smoke tests, Remotion/Manim/HTML-canvas renderpipeline voor animaties.

---

## 0. Huidige feiten

- Repo: `/home/luuks/projecten/slaapmodule`
- GitHub: `https://github.com/luuksmeekens94-hash/Slaapmodule`
- Live: `https://slaapmodule.vercel.app/`
- Branch: `master`
- Laatste commit lokaal/remote: `6a3b239 Verduidelijk ritme en slaapdruk videos`
- Vercel serveert `prototype/` via `vercel.json`
- Live `index.html` is gelijk aan lokale `prototype/index.html`
- Push/auth blokkade: `git push --dry-run` geeft `403 Permission denied`
- App is nu een statisch prototype:
  - `prototype/index.html` bevat CSS, HTML, Alpine-state en animatielogica
  - `prototype/data/sleep-module.json` bevat content
  - `prototype/video/*.mp4|*.webp` bevat media
  - voortgang staat alleen in `localStorage`

## 1. Definitie van professioneel

De module is professioneel genoeg wanneer:

1. **Geen bronverwarring:** README + baseline docs leggen duidelijk uit wat live staat, hoe je lokaal test, hoe je deployt, en waar content/media zit.
2. **Geen regressie bij wijzigingen:** er is een script dat JSON, mediarefs, live assets en JS-syntax controleert.
3. **Onderhoudbare app:** monolithische `index.html` is óf opgesplitst óf minimaal geordend met duidelijke grenzen en documentatie.
4. **Premium animaties:** elke animatie heeft storyboards, visuele kwaliteitseisen, consistente motion language, en wordt batchgewijs vervangen of verbeterd.
5. **Zorgveilig taalgebruik:** content blijft B1, niet dreigend, geen onbedoelde medische claims, duidelijke overlegsignalen.
6. **Live bewijs:** na elke batch draait lokale smoke, live smoke, en Vercel deploy/smoke zodra push/deploy mogelijk is.

---

## Fase 1 — Baseline, docs en QA-fundament

### Task 1.1: Maak root README

**Objective:** Repo vanaf de root begrijpelijk maken voor Luuk, toekomstige agents en externe developers.

**Files:**
- Create: `README.md`

**Inhoud:**
- Wat de Slaapmodule is
- Live URL
- Repo/source-of-truth
- Stack
- Structuur
- Lokale preview
- Validatiecommando's
- Deploynotities
- Bekende beperkingen

**Verification:**
```bash
cd /home/luuks/projecten/slaapmodule
test -f README.md
git diff -- README.md
```

### Task 1.2: Schrijf development baseline

**Objective:** Vastleggen wat er nu feitelijk staat voordat we inhoud/code wijzigen.

**Files:**
- Create: `docs/development/DEVELOPMENT-BASELINE.md`

**Inhoud:**
- Repo/live status
- Route/asset map
- Functionele flow
- Contentmodel
- Media-inventaris
- Technische risico's
- Animatiekwaliteitsdiagnose

**Verification:**
```bash
test -f docs/development/DEVELOPMENT-BASELINE.md
git diff -- docs/development/DEVELOPMENT-BASELINE.md
```

### Task 1.3: Schrijf smoke-test checklist

**Objective:** Handmatige regressiecheck vastleggen zolang er nog geen browsertests zijn.

**Files:**
- Create: `docs/development/SMOKE-TEST-CHECKLIST.md`

**Checklist moet dekken:**
- Home/intro
- Slaapcheck zonder klachten
- Slaapcheck met module A/B/C/D/E match
- `?preview=all`
- Video groot bekijken
- Mobiel viewport
- LocalStorage reset
- Live asset responses

**Verification:**
```bash
test -f docs/development/SMOKE-TEST-CHECKLIST.md
```

### Task 1.4: Voeg validatiescript toe

**Objective:** Eén commando maken dat de statische module controleert.

**Files:**
- Create: `package.json`
- Create: `scripts/validate-module.mjs`

**Script moet controleren:**
- `prototype/data/sleep-module.json` parsebaar
- alle `chapters[].id` uniek
- alle `quizGroups[].recommendModuleId` bestaan
- alle media `visual` refs hebben `.mp4` en `.png`
- alle MP4's kleiner dan 4 MB
- `prototype/index.html` inline JS syntax check via tijdelijke extractie

**Command:**
```bash
npm run validate
```

**Expected:**
```text
Slaapmodule validation OK
```

### Task 1.5: Checkpoint commit

**Objective:** Baseline- en QA-laag veilig vastleggen.

**Commands:**
```bash
git status -sb
npm run validate
git add README.md docs/development package.json scripts/validate-module.mjs
git commit -m "docs: add slaapmodule professionalization baseline"
```

**Note:** Push is geblokkeerd tot GitHub auth/rechten zijn gefixt.

---

## Fase 2 — Animaties professionaliseren zonder functionele chaos

### Task 2.1: Maak animatie art-direction document

**Objective:** Eerst bepalen wat professioneel betekent voordat we renderen.

**Files:**
- Create: `docs/animation/ANIMATION-QUALITY-STANDARD.md`

**Criteria:**
- 4:3 `1440x1080`, 30fps, <4 MB
- FysionAIr logo subtiel aanwezig
- rustiger tempo, minder losse iconen, meer betekenisvolle beweging
- minder “template/SVG-demo”, meer zorgeducatieve mini-scène
- maximaal 1 kernboodschap per animatie
- maximaal 2-4 korte labels
- eindbeeld met duidelijke B1-zin
- consistent licht, schaduw, typografie en easing

### Task 2.2: Maak animatie-inventaris met prioriteit

**Objective:** Niet alle 14 video's tegelijk aanpakken; eerst de zwakste/zichtbaarste.

**Files:**
- Create: `docs/animation/ANIMATION-IMPROVEMENT-BACKLOG.md`

**Prioriteit voorstel:**
1. `force` — hero in module A; moet emotioneel/professioneel kloppen
2. `cycles` — kernuitleg nachtelijk wakker worden
3. `rhythm` — inhoudelijk risicovol; moet heel helder en rustig
4. `pressure` — belangrijk concept, visueel snel kinderlijk
5. `thought`/`meter` — cognitieve component moet niet gimmicky voelen
6. resterende ondersteunende video's

### Task 2.3: Kies renderpipeline per batch

**Objective:** Per video beslissen: verbeteren binnen huidige MP4-set, opnieuw renderen met Remotion, of alternatief.

**Files:**
- Modify: `remotion-poc/README.md`
- Possibly create: `remotion-poc/src/scenes/<NewScene>.tsx`

**Beslisregel:**
- Als bestaande Remotion-scene al bestaat: verbeteren in Remotion.
- Als video alleen als MP4 bestaat zonder bron: storyboard maken en opnieuw bouwen.
- Geen nieuwe toolchain introduceren als Remotion voldoende is.

### Task 2.4: Produceer eerste animatiebatch

**Objective:** Vervang 2-3 meest zichtbare animaties met premium versies.

**Files likely:**
- Modify/Create: `remotion-poc/src/scenes/ForceScene.tsx`
- Modify/Create: `remotion-poc/src/scenes/CyclesScene.tsx`
- Modify/Create: `remotion-poc/src/scenes/RhythmScene.tsx`
- Output: `prototype/video/force.mp4`, `prototype/video/force.webp`, etc.

**Verification:**
```bash
cd remotion-poc
npm install
npm run render:all
cd ..
npm run validate
ffprobe -v error -show_entries stream=width,height,avg_frame_rate,duration prototype/video/force.mp4
```

### Task 2.5: Review animaties visueel

**Objective:** Niet alleen technisch OK; ook visueel beoordelen.

**Checks:**
- screenshot/still per video
- 10 sec playback check
- mobiel lightbox check
- geen drukke beweging
- geen kinderachtige iconenshow
- tekst leesbaar zonder audio

---

## Fase 3 — Codebase onderhoudbaar maken

### Task 3.1: Splits validatievrij CSS/JS uit de monolith

**Objective:** `index.html` kleiner en onderhoudbaar maken zonder gedrag te wijzigen.

**Files likely:**
- Create: `prototype/assets/styles.css`
- Create: `prototype/assets/app.js`
- Modify: `prototype/index.html`

**Approach:**
- Eerst CSS verplaatsen.
- Valideer live/local.
- Daarna JS verplaatsen.
- Geen inhoudelijke refactor tegelijk.

**Verification:**
```bash
npm run validate
python3 -m http.server 4321 --bind 127.0.0.1 --directory prototype
curl -I http://127.0.0.1:4321/assets/styles.css
curl -I http://127.0.0.1:4321/assets/app.js
```

### Task 3.2: Centraliseer media-manifest

**Objective:** Hardcoded video arrays in `index.html` verminderen.

**Files likely:**
- Create: `prototype/data/media-manifest.json`
- Modify: `prototype/index.html` or `prototype/assets/app.js`
- Modify: `scripts/validate-module.mjs`

**Outcome:**
- `hasVideo()` baseert zich op manifest
- `videoUrl()` en `videoPosterUrl()` blijven voorspelbaar
- validatiescript checkt manifest ↔ JSON ↔ bestanden

### Task 3.3: Add browser smoke tests

**Objective:** Essentiële flow geautomatiseerd controleren.

**Files likely:**
- Add dependency: `@playwright/test`
- Create: `tests/smoke.spec.ts`
- Modify: `package.json`

**Tests:**
- page loads
- sleepcheck answers unlock path
- preview all shows modules A-F
- media lightbox opens
- reset button clears local state

---

## Fase 4 — Zorginhoudelijke polish

### Task 4.1: Content review op B1 en medisch risico

**Objective:** Slaapadviezen scherp houden zonder claims of onveiligheid.

**Files:**
- Modify: `prototype/data/sleep-module.json`
- Create: `docs/content/CONTENT-REVIEW-NOTES.md`

**Focus:**
- module D: slaapritme/slaapvenster is potentieel gevoelig
- extraHelp teksten consequent maken
- huisarts/arts-signalen toevoegen waar passend
- minder absolute taal rond pijnvermindering

### Task 4.2: Fysio-begeleidingslaag toevoegen

**Objective:** Module bruikbaar maken in behandelcontext.

**Possible content additions:**
- korte instructie voor fysio: wanneer welke module bespreken
- print/export-samenvatting voorlopig als tekstblok
- “bespreek met je fysio” notities consistenter

---

## Fase 5 — Deployment, auth en continuïteit

### Task 5.1: Fix GitHub push access

**Objective:** Zorgen dat lokale professionele wijzigingen naar GitHub kunnen.

**Commands to diagnose:**
```bash
cd /home/luuks/projecten/slaapmodule
git remote -v
GIT_TERMINAL_PROMPT=0 git push --dry-run origin HEAD:master
```

**Known current result:**
```text
remote: Permission to luuksmeekens94-hash/Slaapmodule.git denied to luuksmeekens94-hash.
fatal: unable to access ... 403
```

**Likely fix:**
- GitHub token/repo permission corrigeren
- of remote/auth herzetten met juiste account
- daarna opnieuw dry-run

### Task 5.2: Deploy smoke

**Objective:** Na push/deploy bewijzen dat live goed is.

**Checks:**
```bash
curl -sS -I https://slaapmodule.vercel.app/
curl -sS -I https://slaapmodule.vercel.app/data/sleep-module.json
curl -sS -I https://slaapmodule.vercel.app/video/force.mp4
```

**Expected:** `200`, juiste content-types, geen ontbrekende assets.

---

## Startvolgorde

Begin niet met animaties renderen voordat de baseline/validatie staat. De juiste volgorde:

1. Fase 1: README + baseline + smoke checklist + validate script
2. Commit lokaal
3. Fase 2.1-2.2: animatie quality standard + backlog
4. Eerste animatiebatch ontwerpen/renderen
5. Browser/mobile smoke
6. GitHub auth fix
7. Push/deploy/smoke

## Eerste concrete uitvoerbatch

Voer nu uit:

1. `README.md`
2. `docs/development/DEVELOPMENT-BASELINE.md`
3. `docs/development/SMOKE-TEST-CHECKLIST.md`
4. `docs/animation/ANIMATION-QUALITY-STANDARD.md`
5. `docs/animation/ANIMATION-IMPROVEMENT-BACKLOG.md`
6. `package.json`
7. `scripts/validate-module.mjs`
8. `npm run validate`
9. lokale commit als validatie groen is

## Risico's

- GitHub push is nu geblokkeerd; lokale commits kunnen wel, remote niet.
- Animaties kunnen veel tijd kosten als bronbestanden ontbreken; daarom eerst backlog + storyboard.
- Te snel naar Next.js migreren kan onnodige complexiteit geven. Eerst statisch professioneel maken.
- Module D rond slaapritme moet zorginhoudelijk voorzichtig blijven; geen harde zelfzorg-slaaprestrictie zonder fysio-context.

## Open vragen voor later

- Moet deze module uiteindelijk patiëntdata delen met een fysio-dashboard?
- Moet dit onderdeel worden van Fy-Fit Academy/LMS?
- Moeten video’s voice-over krijgen of bewust stil/ondertiteld blijven?
- Wil Luuk per animatie een meer “klinisch premium” stijl of juist warme illustratieve stijl?
