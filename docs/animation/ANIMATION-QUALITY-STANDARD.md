# Animation quality standard · FysionAIr Slaapmodule

Doel: de animaties moeten voelen als rustige, premium zorgeducatie — niet als een technische demo, losse iconenset of generieke AI-video.

## Kernprincipe

Elke animatie beantwoordt één vraag:

> Wat moet de patiënt na 20-40 seconden snappen, durven of anders doen?

Als een animatie vooral decoratief is, hoort hij niet in de module.

## Technische standaard

- Resolutie: `1440x1080`
- Aspect ratio: `4:3`
- Framerate: `30fps`
- Duur: `18–42 sec`
- Bestand: MP4 + WebP-poster (1280×720, maximaal 250 KB)
- Streefbestandsgrootte: `<4 MB`
- Locatie: `prototype/video/<slug>.mp4` en `.webp`
- Moet stil te begrijpen zijn: tekst/beeld dragen de kernboodschap

## Visuele standaard

Gebruik FysionAIr-rust:

- Donkerblauw: `#1840A0`
- Middenblauw: `#2472C8`
- Teal: `#30B5BE`
- Achtergrond: `#F7F9FD`
- Tekst: `#0E1C38`
- Zacht donker: `#0E1C38`
- Geen felle rood/oranje dreiging tenzij functioneel en gedempt

Typografie:

- Koppen: Plus Jakarta Sans
- Korte labels: DM Sans of dezelfde appstijl
- Maximaal 2-4 labels in beeld
- Geen lange zinnen in beeld

## Motion language

Professioneel betekent hier:

- rustig tempo
- zachte easing
- weinig beweging tegelijk
- duidelijke visuele focus
- pauze op het eindbeeld
- geen stuiterende iconen
- geen stockachtige personen
- geen drukke transities
- geen overdreven glow/neon

Goede beweging:

- één object dat een oorzaak-gevolg laat zien
- subtiele progressie van spanning naar rust
- heldere vergelijking vóór/na
- eindbeeld dat 2-3 seconden blijft staan

Slechte beweging:

- losse pictogrammen die toevallig bewegen
- te veel tekstkaartjes
- grafiekjes zonder verhaal
- onrustige camera/zoom
- decoratie zonder uitlegwaarde

## Zorginhoudelijke regels

- Normaliseer zonder te bagatelliseren.
- Vermijd angstversterkende beelden.
- Vermijd claims als “dit lost je pijn op”.
- Maak gedrag concreet: opstaan, licht zoeken, klok wegleggen, piekeren parkeren.
- Bij module D altijd voorzichtig: slaapritme aanpassen gebeurt samen met fysio.

## Vaste opbouw per video

1. **Herkenning** — dit is het probleem of gevoel.
2. **Mechanisme** — wat gebeurt er simpel uitgelegd?
3. **Keerpunt** — welke kleine keuze helpt?
4. **Eindzin** — één B1-kernzin.

Voorbeeldstructuur 30 sec:

```text
0-5s    herkenbaar startbeeld
5-14s   mechanisme zichtbaar maken
14-24s  alternatief gedrag of rustsignaal
24-30s  rustig eindbeeld met kernzin
```

## Reviewcriteria

Een animatie is pas goed als alle checks groen zijn:

- [ ] Ik snap de boodschap zonder audio.
- [ ] De patiënt voelt zich rustiger, niet schuldiger.
- [ ] De animatie past visueel bij de app.
- [ ] Er is één duidelijke kernboodschap.
- [ ] Tekst is leesbaar op mobiel.
- [ ] De laatste frame/poster ziet er professioneel uit.
- [ ] MP4 en PNG bestaan, laden live, en blijven onder 4 MB.

## Eerste kwaliteitsrichting

Voor de eerste professionele batch gaan we niet “meer animatie” maken, maar **betere uitlegbeelden**:

- meer compositie
- meer rust
- betere eindframes
- minder iconen
- duidelijkere patiëntkeuze
- minder technisch/grafisch speelgoed
