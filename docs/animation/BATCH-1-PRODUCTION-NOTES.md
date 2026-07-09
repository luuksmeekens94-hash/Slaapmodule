# Animation batch 1 · production notes

Datum: 2026-07-09

## Doel

Eerste zichtbare professionaliseringsbatch voor de Slaapmodule: drie centrale animaties vervangen door rustigere, meer premium FysionAIr-visuals met consistente vormtaal, minder demo-effect en duidelijke B1-boodschap.

## Vervangen animaties

| Slug | Module | Kernboodschap | Nieuwe visuele richting |
|---|---|---|---|
| `force` | Niet forceren | Slaap kun je niet afdwingen; druk activeert het beschermingssysteem | Rustige bedscene + beschermingsmeter die van alert naar rustsignaal beweegt |
| `cycles` | Nachtelijk wakker worden | Kort wakker worden tussen slaapcycli is normaal | Donkere, zachte slaaprondes met korte wakker-momenten als normale overgang |
| `rhythm` | Slaapritme aanpassen | Eerst meten, dan bedtijd passend maken en rustig opbouwen | Slaapdagboek + tijd-in-bed/slaaptijd balken, samen met fysio |

## Productiekeuzes

- Formaat blijft gelijk: `1440x1080`, 30 fps, 30 sec.
- De app blijft verwijzen naar dezelfde slugs (`force`, `cycles`, `rhythm`), zodat er geen JSON-schema of UI-flow wijzigt.
- Posters zijn opnieuw gekozen op inhoudelijk herkenbare frames:
  - `force`: rustsignaal/druk loslaten zichtbaar.
  - `cycles`: normaal wakker-moment + geruststelling zichtbaar.
  - `rhythm`: slaapdagboek + passend slaapvenster zichtbaar, zonder eindkaart-overlap.
- Motion blijft subtiel: easing, zachte fades, beperkte pulsen, geen springerige demo-animatie.

## Bronbestanden

- `remotion-poc/src/scenes/ForceScene.tsx`
- `remotion-poc/src/scenes/CyclesScene.tsx`
- `remotion-poc/src/scenes/RhythmScene.tsx`
- `remotion-poc/src/Root.tsx`
- `remotion-poc/render-all.mjs`
- `remotion-poc/package.json`

## Rendercommando's

```bash
cd /home/luuks/projecten/slaapmodule/remotion-poc
npm install
npm run render:premium
npm run still:premium
```

Voor deze batch zijn de uiteindelijke live assets gekopieerd naar:

```bash
prototype/video/force.mp4
prototype/video/force.png
prototype/video/cycles.mp4
prototype/video/cycles.png
prototype/video/rhythm.mp4
prototype/video/rhythm.png
```

## QA-notities

- TypeScript-check: `npx tsc --noEmit`
- Root validatie: `npm run validate`
- Live validatie na deploy: `npm run validate:live`
- Posterframes zijn visueel gecontroleerd op tekstoverlap en leesbaarheid.
