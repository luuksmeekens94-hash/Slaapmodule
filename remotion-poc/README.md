# Slaapmodule — Remotion PoC

Een proof-of-concept dat laat zien hoe één scene uit de slaapmodule eruit kan zien als
echte gerenderde video, gemaakt met [Remotion](https://www.remotion.dev/).

In dit project wordt de **slaapcycli-scene** uit module B (Wakker worden in de nacht)
omgezet naar een 30-seconden cinematic video op 1920×1080.

## Wat is anders dan de live-app

| | Live SVG (in `prototype/index.html`) | Remotion (deze map)            |
|--|--|--|
| Rendering | Browser tijdens afspelen | Eénmalig naar MP4              |
| Resolutie | Schaalbaar SVG          | 1920×1080 / 4K mogelijk        |
| Filter / glow | Beperkt CSS         | Echte feGaussianBlur per frame |
| Audio       | Browser-TTS / mp3     | Frame-perfect synced           |
| Aanpassen   | F5 om te zien         | `npm run render` (~1–2 min)    |

## Snel starten

```bash
cd remotion-poc
npm install            # ~3 min eerste keer (pakt ook headless Chromium)
npm start              # opent Remotion Studio op http://localhost:3000
```

In Remotion Studio kun je live door de timeline scrubben en wijzigingen direct zien.

## Renderen naar MP4

```bash
npm run render
# Output: out/cycles.mp4
```

Standaard 30 fps, 30 sec, h.264. Aanpassen kan in `src/Root.tsx`
(`durationInFrames`, `fps`, `width`, `height`).

## Hoe de scene is opgebouwd

`src/CyclesScene.tsx` rendert per frame een SVG met:

1. **Achtergrond** — gradient nachtsky (`#0E1C38` → `#1B3470` → `#3B5489`)
2. **Sterren** — twaalf statische punten met sinus-twinkle per ster (eigen fase)
3. **Diepte-banden** — vier subtiele horizontale rechthoeken die de slaapfases markeren
4. **Sleep-curve** — cubic-Bezier path met 5 segmenten, bekend uit het prototype
5. **Glow-stroke** — dezelfde curve maar met `feGaussianBlur` filter en gradient stroke
6. **Stroke-draw** — `stroke-dasharray` + `stroke-dashoffset` synced met moon-progress
7. **Maan** — halo + witte kern op positie van Bezier-formule (geen DOM-ref nodig)
8. **Wake-pulses** — twee soft cyaan ringen op 30% en 70% van het pad
9. **Tekst-overlays** — titel ("Een nacht in slaap") en caption ("Kort wakker tussen cycli is normaal")

De moon-positie wordt **wiskundig** berekend in plaats van via `getPointAtLength`, zodat
elke frame deterministisch is — handig voor headless rendering.

## Volgende stappen

Als deze scene goed valt:

1. Drie tot vijf hero-scenes uitbouwen (cycles, slaapvenster, ochtendlicht, slaapdruk).
2. ElevenLabs voice-overs synchroniseren met `<Audio src="/voiceover.mp3">`.
3. Render-pipeline: één commando dat alle scenes rendert + naar `prototype/video/`
   kopieert. De app gebruikt dan `<video src="...">` voor de featured kaart.
4. Optioneel: Remotion Lambda voor parallelle renders in de cloud.
