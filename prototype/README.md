# FysionAIr - Slaapmodule Prototype

Interactieve slaapmodule voor patienten met lage rugpijn. De module start met een korte slaapcheck. Daarna krijgt de patient alleen de stappen die nu passen bij zijn of haar antwoorden.

De toon is B1: korte zinnen, weinig vaktaal en veel kleine acties. De module moet voelen als begeleiding, niet als een lange cursus.

## Herbruikbare standaard

Nieuwe FysionAIr educatiemodules moeten dezelfde patientflow, stijl en video-aanpak volgen. De vaste standaard staat in:

- `../docs/fysionair-educatiemodule-standaard.md`
- `../docs/nieuwe-module-template.json`
- `../docs/video-productie-briefing-template.md`

## Huidige patientflow

1. **Welkom**
   - Korte uitleg: slaap is trainbaar.
   - Directe knop naar de slaapcheck.
   - Geen audio of "lees voor" knop in deze versie.

2. **Slaapcheck**
   - Vier groepen: inslapen, wakker worden in de nacht, te vroeg wakker worden en slaapritme.
   - Patient kiest per vraag: nooit, soms, vaak of bijna altijd.
   - Na genoeg antwoorden maakt de app "Jouw stappen".

3. **Jouw stappen**
   - De app toont alleen wat nu past.
   - Standaard stappen: Slaap & rugpijn, Hoe slaap werkt, passende onderdelen en Afsluiting.
   - Andere onderdelen blijven uit beeld met de melding "Nu niet nodig".

4. **Begeleiding per onderdeel**
   - Korte uitleg.
   - Een paar duidelijke stappen.
   - Animatie of voorbeeldvideo.
   - Oefenplan voor deze week.
   - Evaluatie na 2-3 weken.
   - Notitie voor de volgende afspraak.

## Onderdelen

- **Slaap & rugpijn** - waarom slecht slapen pijn harder kan laten voelen.
- **Hoe slaap werkt** - slaapfases, slaapdruk, slaapklok en licht.
- **Onderdeel A** - inslapen met minder spanning.
- **Onderdeel B** - wakker worden in de nacht.
- **Onderdeel C** - te vroeg wakker worden.
- **Onderdeel D** - slaapritme verbeteren.
- **Onderdeel E** - rustiger denken over slaap.
- **Onderdeel F** - slechte nachten opvangen.
- **Afsluiting** - vasthouden wat helpt.

## Media

De app gebruikt lokale MP4's in `video/` voor de belangrijkste animaties:

- `breathe.mp4` met poster `breathe.png`
- `clock.mp4` met poster `clock.png`
- `cycles.mp4` met poster `cycles.png`
- `force.mp4` met poster `force.png`
- `meter.mp4` met poster `meter.png`
- `night.mp4` met poster `night.png`
- `nightwake.mp4` met poster `nightwake.png`
- `curve.mp4` met poster `curve.png`
- `plan.mp4` met poster `plan.png`
- `pressure.mp4` met poster `pressure.png`
- `rhythm.mp4` met poster `rhythm.png`
- `sun.mp4` met poster `sun.png`
- `thought.mp4` met poster `thought.png`
- `worry.mp4` met poster `worry.png`

De meeste bronbestanden voor deze video's staan in `../remotion-poc/`. De video's `force.mp4`, `worry.mp4`, `thought.mp4`, `meter.mp4`, `cycles.mp4`, `nightwake.mp4`, `pressure.mp4`, `clock.mp4`, `sun.mp4`, `rhythm.mp4`, `breathe.mp4`, `night.mp4`, `curve.mp4` en `plan.mp4` zijn gemaakt met de Claude Code video toolkit en staan als webklare MP4's in `video/`.

De oude browserstem/voorleesfunctie is voorlopig uit de UI gehaald. Echte voice-over kan later weer worden toegevoegd als losse audio per media-item.

## Preview

Voor intern testen kun je alle onderdelen tegelijk tonen met `?preview=all`. De normale patientflow blijft intakegestuurd: zonder deze parameter ziet de patient alleen de onderdelen die bij de slaapcheck passen.

## Bestanden

- `index.html` - layout, styling en interactie.
- `data/sleep-module.json` - vragen, onderdelen, stappen, acties en evaluaties.
- `video/` - video-assets voor de module.
- `logo.png` - FysionAIr-logo.

## Techniek

- Statische app, geen build-step nodig.
- Alpine.js via CDN.
- Content wordt geladen via `fetch('data/sleep-module.json')`.
- Voortgang wordt lokaal opgeslagen met `localStorage`.
- Vercel serveert de map `prototype/` als output directory.

## Lokaal starten

Vanuit `prototype/`:

```bash
python -m http.server 4321 --bind 127.0.0.1
```

Open daarna:

```text
http://127.0.0.1:4321/
```

## Deploy

Het project staat gekoppeld aan Vercel. De productie-alias is:

```text
https://slaapmodule.vercel.app
```

Deploy vanuit de repo-root:

```bash
vercel deploy --prod --yes
```
