# Slaapmodule — Remotion videoserie

De patiëntmodule gebruikt een intern gebouwde Remotion-serie met volwassen minimale
vectorillustraties, natuurlijke Nederlandse voice-over en frame-perfecte timing. De
publieke MP4's staan in `prototype/video/`; de bewerkbare bronnen staan hier.

## Serie-standaard

- 1920×1080, 30 fps, H.264 + AAC;
- ElevenLabs `eleven_v3`, Nederlandse stem **Nono**;
- voice-over start na 1 seconde en loopt over vrijwel de hele animatie;
- Nederlandse WebVTT-captions per gesproken zin;
- subtiele, inhoudelijk gemotiveerde camera (maximaal circa 2% push-in);
- eigen SVG-illustraties, geen stockbeelden of infographic-/PowerPointtemplates;
- één inhoudelijke kernboodschap op de eindkaart;
- native videobediening in de patiëntmodule.

De goedgekeurde referentie is `force` (`Slaap kun je niet afdwingen`). De overige
dertien composities gebruiken `src/series/SleepSeriesScene.tsx` en de inhoud uit
`series-content.json`.

## Installeren en Remotion Studio

```bash
cd remotion-poc
npm install
npm start
```

Studio opent standaard op `http://localhost:3000`.

## Voice-overs reproduceren

Installeer de Pythondependency in een eigen venv en zet de API-key alleen als
environmentvariabele. De key hoort nooit in Git.

```bash
python3 -m venv .venv
.venv/bin/pip install -r requirements-voice.txt
export ELEVENLABS_API_KEY='...'
.venv/bin/python scripts/generate-series-voices.py
```

Een beperkte selectie kan zonder dubbele API-kosten opnieuw worden gemaakt:

```bash
.venv/bin/python scripts/generate-series-voices.py --slugs=worry,cycles
```

De generator:

1. genereert elk natuurlijk zinsdeel met een vaste voice-ID en seed;
2. voegt gewogen stiltes toe zodat de uitleg niet wordt afgeraffeld;
3. normaliseert naar -16 LUFS en -1,5 dB true peak;
4. schrijft MP3, VTT en een JSON-manifest per video;
5. stopt bij te lange spraak of onnatuurlijke pauzes.

## Productierenders

Goedgekeurde referentievideo:

```bash
npm run render:force
```

Volledige overige serie:

```bash
npm run render:series
```

Een inhoudelijke selectie:

```bash
node scripts/render-series-production.mjs --slugs=worry,cycles,nightwake
```

Elke productieopdracht voert TypeScriptcontrole, Remotion-render, webencode, compacte
WebP-poster (1280×720, maximaal 250 KB), `ffprobe`-validatie en captioncontrole uit.
Alleen een geslaagde output wordt naar `prototype/video/` gekopieerd.

## Bronnen en outputs

| Pad | Functie |
|---|---|
| `src/scenes/ForceFinalScene.tsx` | goedgekeurde force-referentie |
| `src/series/SleepSeriesScene.tsx` | gedeelde illustratie- en camera-engine |
| `series-content.json` | scripts, lengtes, semantische segmenten, pauzegewichten en eindkaarten |
| `series-timing.json` | gedeelde cuegrenzen voor audio, captions en beeldbeats |
| `public/audio/*-nono-v2.mp3` | gemasterde serievoice uit één doorlopende take per video |
| `public/audio/source/*-nono-v2-source.mp3` | reproduceerbare doorlopende Nono-brontakes |
| `public/audio/*-nono-v2.json` | voice-, bronhash- en timingmanifesten |
| `public/captions/*-nl-nono-v2.vtt` | uit dezelfde cuegrenzen gemaakte broncaptions |
| `public/audio/force-nono-v1.*` | apart bewaarde, goedgekeurde force-referentie |
| `out/*.mp4` | gevalideerde lokale productierenders |
| `../prototype/video/` | moduleklare MP4, poster en VTT |

## Verificatie

Vanuit de projectroot:

```bash
npm test
```

De tests controleren onder meer alle videoslugs, native captions, bestandsgroottes,
Remotionregistratie en de productie-renderstraten.
