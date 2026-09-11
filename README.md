# Slaapmodule · FysionAIr

## V2-preview (11 september 2026)

V2 staat geïsoleerd onder `/v2/` op de featurebranch `codex/slaaproute-v2`. De bestaande hoofdpagina blijft V1. Deze bouwopdracht vervangt productie niet. GitHub gebruikt nog `master`; het afgesproken releasebeleid verlangt `main`. Die afwijking moet vóór een latere productierelease expliciet worden opgelost.

Lokaal: `npm ci`, `npm run serve`, open `http://127.0.0.1:4321/v2/`. Checks: `npm run validate`; installeer de testbrowser met `npx playwright install chromium` en voer `npm run test:browser` uit. Voor een bestaande preview: zet `PREVIEW_URL` op het preview-origin en voer dezelfde browsertests uit.

V2 gebruikt dezelfde statische basis en huisstijl, met losse modules zonder externe runtimebibliotheken. Zie [inhoudelijke keuzes](reviews/slaapmodule-v2/inhoudelijke-keuzes.md), [optionele videoscripts](reviews/slaapmodule-v2/synthesia-storyboards.md) en [patiëntgebruikstest](reviews/slaapmodule-v2/patientgebruikstest.md). Het [bouwplan](reviews/slaapmodule-audit-2026-09-11/bouwplan-v2.md) en de [analyse](reviews/slaapmodule-audit-2026-09-11/analyse-en-voorstel-v2.md) zijn in deze branch opgenomen.

Het [opleverrapport](reviews/slaapmodule-v2/opleverrapport.md) bevat de PR, preview, verificatie en beperkingen. De onderstaande documentatie beschrijft de historische V1.

Interactieve FysionAIr slaapmodule voor patiënten met lage rugpijn. De module helpt patiënten in korte B1-stappen begrijpen hoe slaap, stress/bescherming en rugpijn elkaar kunnen beïnvloeden, en welke slaapstappen zij samen met hun fysio kunnen oefenen.

## Live

- Productie: https://slaapmodule.vercel.app/
- Interne preview met alle onderdelen: https://slaapmodule.vercel.app/?preview=all
- GitHub: https://github.com/luuksmeekens94-hash/Slaapmodule

## Source of truth

Gebruik deze repo als bron:

```text
/home/luuks/projecten/slaapmodule
```

Vercel serveert de map `prototype/` als statische output. De live `index.html` is gecontroleerd gelijk aan `prototype/index.html`.

## Wat de module nu doet

1. **Welkom** — korte framing: slaap is trainbaar en relevant bij lage rugpijn.
2. **Slaapcheck** — 5 domeinen, 10 vragen, score `nooit/soms/vaak/bijna altijd`.
3. **Persoonlijk pad** — toont alleen de basisuitleg en passende onderdelen.
4. **Therapeutische onderdelen A-F** — stappen, animaties/video's, oefenplan, evaluatie en notitie.
5. **Afsluiting** — normaliseert terugval en verwijst naar overleg met fysio/huisarts waar nodig.

## Techniek

- Static HTML/CSS/JS
- Alpine.js via CDN
- GSAP + MotionPathPlugin via CDN
- Content uit `prototype/data/sleep-module.json`
- Media uit `prototype/video/`
- Voortgang via `localStorage`
- Geen backend, login of database

## Belangrijke paden

```text
prototype/index.html                    # UI, styling, Alpine-state en animatielogica
prototype/data/sleep-module.json         # vragen, modules, stappen, mediarefs
prototype/video/                         # MP4 + PNG poster per animatie
prototype/logo.png                       # FysionAIr logo
docs/fysionair-educatiemodule-standaard.md
docs/development/                        # baseline, smoke-test en professionalisering
docs/animation/                          # animatiekwaliteit en backlog
remotion-poc/                            # bestaande Remotion proof-of-concept/source voor enkele scènes
scripts/validate-module.mjs              # statische validatie
```

## Lokaal starten

```bash
cd /home/luuks/projecten/slaapmodule
python3 -m http.server 4321 --bind 127.0.0.1 --directory prototype
```

Open daarna:

```text
http://127.0.0.1:4321/
http://127.0.0.1:4321/?preview=all
```

## Valideren

```bash
cd /home/luuks/projecten/slaapmodule
npm run validate
```

Optioneel live assets checken:

```bash
npm run validate:live
```

## Deploy

De huidige Vercel-config:

```json
{
  "outputDirectory": "prototype",
  "buildCommand": "",
  "installCommand": "",
  "framework": null
}
```

Deploy normaal via GitHub/Vercel-koppeling of handmatig:

```bash
vercel deploy --prod --yes
```

Let op: op dit moment gaf een lokale `git push --dry-run` een 403 op GitHub-auth/rechten. Eerst auth fixen voordat we remote deploys claimen.

## Professionaliseringsrichting

Korte volgorde:

1. Baseline + validatie + smoke-test checklist.
2. Animatie art-direction en backlog.
3. Eerste premium animatiebatch opnieuw ontwerpen/renderen.
4. Codebase opsplitsen en testbaar maken.
5. Browser/mobile smoke tests automatiseren.
6. GitHub push/deploy/smoke herstellen.

Zie ook:

- `docs/development/PROFESSIONALISERINGSPLAN.md`
- `docs/development/DEVELOPMENT-BASELINE.md`
- `docs/development/SMOKE-TEST-CHECKLIST.md`
- `docs/animation/ANIMATION-QUALITY-STANDARD.md`
- `docs/animation/ANIMATION-IMPROVEMENT-BACKLOG.md`

## Bekende beperkingen

- `prototype/index.html` is nog monolithisch en daardoor moeilijk onderhoudbaar.
- Externe CDN's leveren Alpine/GSAP/fonts.
- Er zijn nog geen browsertests.
- Animaties zijn technisch correct, maar voelen deels nog te prototype/icoonachtig.
- Er is geen backend of fysio-dashboard; patiëntnotities blijven op het apparaat.
