# Video productie briefing template

Gebruik deze briefing voor Claude Code met de Claude Code video toolkit. Plak per batch de relevante videos onder elkaar.

## Algemene opdracht

We bouwen FysionAIr educatievideo's voor patienten binnen fysiotherapie. De video's komen in dezelfde app-stijl als de slaapmodule.

Houd deze vaste stijl aan:

- FysionAIr-logo zichtbaar.
- Formaat `1440x1080`, 4:3, 30fps.
- Rustige FysionAIr-kleuren: donkerblauw `#1840A0`, middenblauw `#2472C8`, teal `#30B5BE`, achtergrond `#F7F9FD`, tekst `#0E1C38`.
- Zelfde rustige premium stijl als `force.mp4`, `worry.mp4`, `thought.mp4`, `meter.mp4`, `cycles.mp4`, `nightwake.mp4`, `pressure.mp4`, `clock.mp4`, `sun.mp4`, `rhythm.mp4`, `breathe.mp4`, `night.mp4`, `curve.mp4` en `plan.mp4`.
- Korte B1-teksten in beeld.
- Geen drukke animatie.
- Geen stockbeelden.
- Geen lange zinnen in beeld.
- Eindbeeld met 1 duidelijke kernzin.
- Output als `.mp4` en `.png` poster.
- Houd MP4 bij voorkeur onder 4 MB.

## Batch

Module:

```text
[naam module]
```

Plaats in app:

```text
[bijvoorbeeld: Onderdeel A, media-item 1]
```

Bestanden:

```text
prototype/video/[slug].mp4
prototype/video/[slug].png
```

## Video 1

Bestandsnaam:

```text
[slug].mp4 en [slug].png
```

Duur:

```text
[bijvoorbeeld 24 seconden]
```

Doel:

```text
[wat moet de patient na deze video snappen of durven doen?]
```

B1-kernzin:

```text
[1 zin die aan het eind in beeld mag staan]
```

Context in de module:

```text
[welke tekst staat ongeveer boven/onder de video?]
```

Scene-opbouw:

```text
0-5s:
[eerste beeld]

5-12s:
[ontwikkeling]

12-20s:
[gedrag of keuze]

20-24s:
[rustig eindbeeld met kernzin]
```

Tekstlabels in beeld:

```text
- [label 1]
- [label 2]
- [label 3]
```

Let op:

```text
[wat moet Claude vermijden of extra duidelijk maken?]
```

## Video 2

Bestandsnaam:

```text
[slug].mp4 en [slug].png
```

Duur:

```text
[bijvoorbeeld 25 seconden]
```

Doel:

```text
[wat moet de patient na deze video snappen of durven doen?]
```

B1-kernzin:

```text
[1 zin die aan het eind in beeld mag staan]
```

Context in de module:

```text
[welke tekst staat ongeveer boven/onder de video?]
```

Scene-opbouw:

```text
0-5s:
[eerste beeld]

5-12s:
[ontwikkeling]

12-20s:
[gedrag of keuze]

20-25s:
[rustig eindbeeld met kernzin]
```

Tekstlabels in beeld:

```text
- [label 1]
- [label 2]
- [label 3]
```

Let op:

```text
[wat moet Claude vermijden of extra duidelijk maken?]
```

## Reviewvragen na render

Controleer na elke batch:

- Past de video bij FysionAIr?
- Is de tekst B1?
- Is de kernboodschap zonder extra uitleg duidelijk?
- Is het beeld rustig genoeg?
- Is de poster bruikbaar als stilstaand beeld?
- Is de MP4 kleiner dan ongeveer 4 MB?
- Werkt de video in de module op desktop en mobiel?
