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

De app gebruikt voor iedere videokaart een lokale MP4, Nederlandse VTT-captions en een compacte WebP-poster in `video/`. Video's hebben `preload="none"`: alleen de aangeklikte MP4 wordt geladen. De posters zijn 1280×720 en maximaal 250 KB, zodat drie kaarten op één scherm de playknoppen niet blokkeren.

De bronbestanden en reproduceerbare renderpipeline staan in `../remotion-poc/`. De oude browserstem/voorleesfunctie is uitgeschakeld; iedere serievideo bevat één doorlopende Nono-voice-over.

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
