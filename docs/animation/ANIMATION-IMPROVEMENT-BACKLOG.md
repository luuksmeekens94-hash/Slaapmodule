# Animation improvement backlog · Slaapmodule

Deze backlog bepaalt welke animaties eerst professioneel worden aangepakt.

## Prioriteit 1 — Eerste premium batch

### 1. `force` · Waarom forceren wakker maakt

**Waarom eerst:** Staat vroeg in module A en bepaalt direct het kwaliteitsgevoel.

**Huidige risico's:** Kan snel voelen als een generieke stresslijn/icoonanimatie.

**Nieuwe richting:**

- Start met herkenbaar bedmoment: moe lichaam, alert hoofd.
- Laat “hard proberen” visueel het systeem activeren.
- Keerpunt: uit de strijd stappen en wachten op slaperigheid.
- Eindzin: `Slaap kun je niet duwen. Je kunt je lichaam wel rust geven.`

**Acceptatie:** patiënt voelt minder schuld/druk.

### 2. `cycles` · Kort wakker worden is normaal

**Waarom:** Kernconcept voor nachtelijk wakker worden.

**Huidige risico's:** Slaapcurve kan als technisch grafiekje voelen.

**Nieuwe richting:**

- Nacht als rustige ronde/golf, niet als medisch diagram.
- Korte micro-wakkers als normale lichte momenten.
- Keerpunt: niet rekenen, wel geruststellen.
- Eindzin: `Kort wakker worden is normaal. Rekenen maakt het groter.`

**Acceptatie:** de animatie normaliseert zonder te simplificeren.

### 3. `rhythm` · Slaapritme / tijd in bed passend maken

**Waarom:** Inhoudelijk gevoeligste onderdeel. Moet volwassen en voorzichtig.

**Huidige risico's:** Kan lijken alsof patiënt zelf slaaprestrictie moet doen.

**Nieuwe richting:**

- Samen-met-fysio framing visueel meenemen.
- Eerst slaapdagboek/weekoverzicht, dan rustig venster.
- Kleine stapjes, geen harde opdracht.
- Eindzin: `Maak je bedtijd passend. Bouw daarna rustig op.`

**Acceptatie:** geen “doe dit streng alleen”-gevoel.

## Prioriteit 2 — Conceptuele verdieping

### 4. `pressure` · Slaapdruk opbouwen

**Risico:** Meter/beker kan kinderlijk worden.

**Nieuwe richting:** dagboog met energie/slaapdruk subtiel tonen; dutje als zachte nuance, niet als verbod.

### 5. `thought` · Gedachte of feit?

**Risico:** Te simpele teksttransformatie.

**Nieuwe richting:** gedachtekaart → vraag → helpende zin. Moet volwassen en herkenbaar voelen.

### 6. `meter` · Beschermingssysteem zakt

**Risico:** Meter is snel gimmicky.

**Nieuwe richting:** spanning/veiligheid als rustig systeemniveau; minder “dashboard”, meer lichaam dat zakt.

## Prioriteit 3 — Ondersteunend

- `worry` — piekeren parkeren
- `nightwake` — wat doe ik om 03:00?
- `clock` — vaste opsta-tijd
- `sun` — ochtendlicht
- `breathe` — adem 4-6
- `night` — later naar bed kan tijdelijk helpen
- `curve` — herstel gaat met ups en downs
- `plan` — plan voor slechte week

## Productieregels per nieuwe animatie

Voor elke animatie maken we eerst:

1. Doelzin
2. Storyboard in 4 scènes
3. Tekstlabels
4. Eindzin
5. Technische outputnaam
6. Reviewcheck

Template:

```text
Slug:
Plaats in module:
Doel:
Patiëntgevoel vóór:
Patiëntgevoel na:
0-5s:
5-14s:
14-24s:
24-30s:
Labels:
Eindzin:
Vermijden:
```

## Batch-aanpak

Eerste batch:

```text
force
cycles
rhythm
```

Daarna pas volgende batch. Niet alles tegelijk, want dan krijg je 14 halfbakken piemelvideo's in plaats van 3 goede. 🌀

## Validatie na elke batch

```bash
npm run validate
ffprobe -v error -select_streams v:0 -show_entries stream=width,height,avg_frame_rate,duration prototype/video/force.mp4
```

Daarna handmatig:

- [ ] poster ziet er premium uit
- [ ] video speelt in kaart
- [ ] lightbox werkt
- [ ] mobiel leesbaar
- [ ] eindframe blijft rustig genoeg staan
