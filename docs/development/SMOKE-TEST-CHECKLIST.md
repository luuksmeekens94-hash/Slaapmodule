# Smoke-test checklist · Slaapmodule

Gebruik deze checklist na elke relevante wijziging aan content, layout, code of video.

## 1. Statische checks

```bash
cd /home/luuks/projecten/slaapmodule
npm run validate
```

Verwacht:

```text
Slaapmodule validation OK
```

## 2. Lokale preview starten

```bash
cd /home/luuks/projecten/slaapmodule
python3 -m http.server 4321 --bind 127.0.0.1 --directory prototype
```

Open:

```text
http://127.0.0.1:4321/
```

## 3. Basisflow patiënt

- [ ] Intro laadt zonder console errors.
- [ ] Logo is zichtbaar.
- [ ] Eerste CTA brengt je naar de slaapcheck.
- [ ] Progressiebalk beweegt wanneer je door hoofdstukken gaat.
- [ ] Zijbalk/mobile chapters tonen alleen relevante onderdelen.

## 4. Slaapcheck zonder duidelijke klacht

Gebruik overal `nooit` of `soms`.

- [ ] Pad wordt getoond na voldoende antwoorden.
- [ ] Tekst meldt dat er geen duidelijke slaapklacht is.
- [ ] Basisuitleg blijft zichtbaar.
- [ ] Geen willekeurige zware module wordt opgedrongen.

## 5. Slaapcheck met modulematch

Test minimaal:

- [ ] Inslapen hoog → Onderdeel A zichtbaar.
- [ ] Nachtelijk wakker hoog → Onderdeel B zichtbaar.
- [ ] Te vroeg wakker hoog → Onderdeel C zichtbaar.
- [ ] Ritme hoog → Onderdeel D zichtbaar.
- [ ] Gedachten hoog → Onderdeel E zichtbaar.

Controleer per match:

- [ ] `Jouw stappen` toont de juiste volgorde.
- [ ] Knop naar stap werkt.
- [ ] Niet-passende onderdelen blijven uit beeld.

## 6. Preview all

Open:

```text
http://127.0.0.1:4321/?preview=all
```

- [ ] Modules A-F zijn bereikbaar.
- [ ] Alle media kaarten renderen.
- [ ] Geen lege hoofdstukken.

## 7. Video/media

Per gewijzigde video:

- [ ] Poster verschijnt.
- [ ] `Start uitleg` speelt de video.
- [ ] Progress overlay loopt mee.
- [ ] `Bekijk groot` opent lightbox.
- [ ] Lightbox-video speelt.
- [ ] Sluiten werkt.
- [ ] Opnieuw starten werkt.

## 8. Oefenplan/evaluatie/notitie

- [ ] Acties afvinken werkt.
- [ ] Progressie-aantal verandert.
- [ ] Evaluatieslider werkt.
- [ ] Notitieveld slaat lokaal op.
- [ ] Reset wist antwoorden, acties, evaluaties en notities.

## 9. Mobiele check

Gebruik browser devtools of Playwright later.

Viewports:

- [ ] `390x844` iPhone-achtig
- [ ] `768x1024` tablet
- [ ] desktop breed

Check:

- [ ] Geen horizontale scroll.
- [ ] Video staat direct logisch onder kop/kaart.
- [ ] Knoppen zijn raakbaar.
- [ ] Lightbox of native fullscreen werkt acceptabel.

## 10. Live smoke na deploy

```bash
curl -sS -I https://slaapmodule.vercel.app/
curl -sS -I https://slaapmodule.vercel.app/data/sleep-module.json
curl -sS -I https://slaapmodule.vercel.app/video/force.mp4
npm run validate:live
```

Verwacht:

- [ ] status `200`
- [ ] HTML: `text/html`
- [ ] JSON: `application/json`
- [ ] MP4: `video/mp4`
- [ ] geen ontbrekende media-assets

## 11. Go/no-go

Niet deployen of claimen als klaar wanneer:

- [ ] JSON-validatie faalt.
- [ ] een mediaref ontbreekt.
- [ ] video groter is dan 4 MB zonder bewuste uitzondering.
- [ ] mobiele flow horizontale scroll heeft.
- [ ] live smoke niet is uitgevoerd.
