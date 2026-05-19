# FysionAIr educatiemodule standaard

Deze standaard is de blauwdruk voor nieuwe FysionAIr educatiemodules. De slaapmodule is het eerste uitgewerkte voorbeeld. Nieuwe modules moeten voelen alsof ze uit dezelfde omgeving komen: rustig, betrouwbaar, persoonlijk en praktisch.

## Doel

Een educatiemodule helpt de patient in kleine stappen beter begrijpen wat er speelt en wat hij of zij vandaag kan oefenen. De module voelt als begeleiding, niet als een cursus.

Belangrijk:

- De module start met een korte check.
- De patient ziet alleen onderdelen die nu passen.
- Teksten zijn B1: korte zinnen, weinig vaktaal, concrete acties.
- Elk onderdeel heeft 2-3 korte animaties of video's.
- De fysiotherapeut kan later samen met de patient terugkijken.

## Vaste patientflow

Gebruik bij elke nieuwe module dezelfde opbouw.

1. **Welkom**
   - Benoem in 2-3 zinnen waarom dit thema belangrijk is.
   - Geef rust: het probleem is beinvloedbaar.
   - Laat de patient starten met de check.

2. **Korte check**
   - 4-6 domeinen.
   - 1-3 vragen per domein.
   - Antwoorden: `nooit`, `soms`, `vaak`, `bijna altijd`.
   - Gebruik gewone taal. Vraag naar gedrag, gevoel of situatie.

3. **Jouw stappen**
   - Toon alleen de onderdelen die passen bij de antwoorden.
   - Gebruik woorden als `Jouw stappen`, `Dit past nu bij jou` en `We starten met`.
   - Vermijd woorden als `leerpad`, `curriculum` of `cursus`.

4. **Basisuitleg**
   - Maximaal 2 korte hoofdstukken die bijna iedereen nodig heeft.
   - Leg het mechanisme simpel uit.
   - Koppel altijd aan een herkenbaar voorbeeld.

5. **Passende onderdelen**
   - Elk onderdeel behandelt een concreet probleem.
   - Elk onderdeel bevat uitleg, stappen, media, acties, evaluatie en een notitie.

6. **Afsluiting en veiligheid**
   - Vat samen wat de patient meeneemt.
   - Benoem wanneer de patient contact moet opnemen.
   - Maak duidelijk dat de fysio kan meekijken.

## Vaste opbouw per onderdeel

Elk onderdeel in `therapyModules` gebruikt dezelfde structuur.

- `id`: kort en stabiel, bijvoorbeeld `moduleA`.
- `label`: `Onderdeel A - Thema in gewone taal`.
- `title`: korte titel met eventueel `<span class="grad-text">woord</span>`.
- `intro`: 2-3 korte zinnen, herkenbaar voor de patient.
- `tags`: maximaal 3 chips.
- `whyTitle`: simpele waarom-vraag of kernzin.
- `whyBody`: 1 korte alinea.
- `keyPoints`: precies 2 punten.
- `steps`: 3-5 kleine stappen.
- `media`: 2-3 animaties of video-oefeningen.
- `actions`: 4-5 acties voor de komende week.
- `evaluation`: 4 vragen voor evaluatie na 2-3 weken.
- `reflectionPrompt`: 1 vraag voor gesprek met de fysio.
- `extraHelp`: wanneer extra hulp of overleg nodig is.

## B1-schrijfregels

Schrijf voor een patient die moe, gespannen of onzeker kan zijn.

Gebruik:

- Korte zinnen.
- Maximaal 1 boodschap per zin.
- Concrete werkwoorden: `sta op`, `schrijf op`, `kies`, `probeer`.
- Woorden uit het dagelijks leven.
- Voorbeelden die de patient direct herkent.
- Een rustige toon: duidelijk, niet streng.

Vermijd:

- Lange alinea's.
- Vaktaal zonder uitleg.
- Woorden als `interventie`, `compliance`, `psycho-educatie`, `suboptimaal`.
- Dreigende taal.
- Te veel uitleg voordat er een actie komt.

Als een medische term nodig is:

- Leg hem direct uit.
- Gebruik daarna de gewone term.

Voorbeeld:

```text
Niet: Je autonome zenuwstelsel blijft verhoogd geactiveerd.
Wel: Je lichaam blijft aan staan. Daardoor slaap je lastiger.
```

## Visuele standaard

Gebruik dezelfde visuele basis als de slaapmodule.

### Kleuren

- Blauw: `#1840A0`
- Middenblauw: `#2472C8`
- Lichtblauw vlak: `#E8F0FB`
- Teal: `#30B5BE`
- Licht teal vlak: `#E2F5F6`
- Donkere tekst: `#0E1C38`
- Zachte tekst: `#4A5878`
- Achtergrond: `#F7F9FD`
- Rand: `#DDE4F0`

Gradient:

```css
linear-gradient(135deg, #30B5BE 0%, #1B56B8 55%, #1840A0 100%)
```

### Typografie

- Koppen: `Plus Jakarta Sans`
- Lopende tekst: `DM Sans`
- Gebruik geen negatieve letterspacing buiten de bestaande stijl.
- Maak tekst in kaarten compact en scanbaar.

### Layout

- Linker zijbalk met onderdelen.
- Grote contentkolom rechts.
- Geen marketingpagina als eerste scherm.
- Geen zwevende decoratie of losse kleurvlekken.
- Kaarten zijn rustig, functioneel en niet te rond.
- Video's staan in dezelfde media-card opzet.
- Op mobiel moet de vergrote video direct onder de kop zichtbaar zijn.

### Componenten

Gebruik bestaande patronen:

- Chips voor tijd, type en status.
- Knoppen met iconen.
- Accordions voor stappen.
- Kleine actiekaart voor `Dit ga je doen`.
- Evaluatie na 2-3 weken.
- Notitieveld voor de volgende afspraak.

## Video- en animatiestandaard

Elke video is kort, rustig en zelfstandig genoeg om te begrijpen.

Technische standaard:

- Formaat: `1440x1080`
- Aspect ratio: `4:3`
- Framerate: `30fps`
- Maximaal ongeveer `4 MB` per MP4
- Posterframe als `.png`
- Bestandsnamen: lowercase slug, bijvoorbeeld `fear-loop.mp4` en `fear-loop.png`
- Locatie in app: `prototype/video/`

Inhoudelijke standaard:

- 18-42 seconden.
- 1 kernboodschap per video.
- Maximaal 2-4 korte tekstlabels in beeld.
- B1-taal.
- FysionAIr-logo zichtbaar.
- Kleurstelling gelijk aan de module.
- Geen drukke overgangen.
- Geen stockachtige beelden.
- Eindbeeld met concrete kernzin.

Elke module krijgt bij voorkeur:

- 1 uitlegvideo: wat gebeurt er?
- 1 gedragsvideo: wat kan ik doen?
- 1 oefenvideo of voorbeeld: hoe ziet oefenen eruit?

## Claude Code video workflow

Werk in batches. Maak niet alle video's tegelijk als het thema nog niet getest is.

1. Kies 3-4 videos voor de eerste batch.
2. Geef Claude per video:
   - bestandsnaam
   - doel
   - plaats in module
   - B1-kernzin
   - scene-opbouw
   - duur
   - stijlregels
3. Laat Claude renderen naar `.mp4` en `.png`.
4. Plaats bestanden in `prototype/video/`.
5. Voeg de slug toe aan `hasVideo()` en `videoPosterUrl()` in `prototype/index.html`.
6. Koppel de slug aan het juiste media-item in de JSON.
7. Test desktop en mobiel.
8. Pas pas daarna de volgende batch aan.

Gebruik voor prompts de template in:

```text
docs/video-productie-briefing-template.md
```

## JSON-standaard

Nieuwe modules bouwen we zoveel mogelijk vanuit content in JSON. De huidige slaapmodule gebruikt:

```text
prototype/data/sleep-module.json
```

Voor nieuwe modules:

- Houd dezelfde velden aan.
- Gebruik een eigen databestand als de module zelfstandig wordt.
- Gebruik dezelfde `chapters`, `quizGroups` en `therapyModules` structuur.
- Voeg alleen nieuwe velden toe als de UI ze echt nodig heeft.

Een invulbaar voorbeeld staat in:

```text
docs/nieuwe-module-template.json
```

## Kwaliteitscheck voor nieuwe modules

Controleer elke module op deze punten voordat je live gaat.

Content:

- De check stuurt naar passende onderdelen.
- De patient ziet niet alles tegelijk.
- Alle teksten zijn B1.
- Elke stap heeft een concrete actie.
- Evaluatie staat op 2-3 weken.
- Er staat wanneer de patient contact moet opnemen.

Design:

- Kleuren en fonts zijn gelijk aan de slaapmodule.
- Geen nieuwe visuele stijl zonder reden.
- Knoppen, chips, kaarten en side-nav volgen bestaande patronen.
- Mobiel heeft geen horizontale scroll.
- Video groot bekijken werkt op desktop en mobiel.

Techniek:

- JSON laadt zonder fouten.
- Alle video- en posterbestanden bestaan.
- MP4 en PNG zijn live bereikbaar.
- Console bevat geen relevante errors.
- `?preview=all` toont alle onderdelen voor interne test.

## Beslisregel

Als er twijfel is tussen nieuw ontwerp of bestaande stijl: kies de bestaande stijl. Alleen afwijken als het nieuwe thema een echte andere interactie nodig heeft.
