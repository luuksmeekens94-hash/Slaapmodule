# Slaapmodule — analyse vanuit de patiënt en voorstel V2

11 september 2026

## Mijn oordeel

De module heeft een bruikbare basis: een rustige FysionAIr-huisstijl, herkenbare klachten, korte zinnen, geruststelling en een persoonlijk plan met maximaal twee acties. Die basis zou ik behouden. Ik zou wel een gerichte V2 maken waarin de patiënt sneller een passende stap kiest en daarna hulp krijgt bij het daadwerkelijk uitvoeren daarvan.

De grootste kwaliteitswinst zit in de route en inhoudelijke precisie. Betere video's kunnen daarna vertrouwen en begrip versterken. Een complete videoles bij ieder onderwerp zou de module langer maken en bestaande herhaling versterken.

Dit is een product- en inhoudsreview, geen bewijs van klinische effectiviteit. Mijn verwachte voordelen van V2 moeten met patiënten worden getoetst.

## Wat ik daadwerkelijk heb onderzocht

- De [live module](https://slaapmodule.vercel.app/): start, slaapcheck, basisuitleg, oefenpagina's, videoweergave en afsluiting, met tijdelijke fictieve antwoorden.
- De actuele [GitHub-repository](https://github.com/luuksmeekens94-hash/Slaapmodule), standaardbranch `master`, commit `04f2ea6`. GitHub-toegang is bevestigd. De lokale werkmap liep achter; de beoordeling gebruikt de nieuwere GitHub-versie.
- De volledige actuele inhoudsconfiguratie en de relevante navigatie-, selectie-, opslag- en mediafuncties. De live inhoudsconfiguratie komt overeen met GitHub.
- Visuele steekproeven van de video's over forceren en tijd in bed. Niet iedere video is integraal op beeld én geluid beoordeeld. Dit is dus geen volledige audiovisuele eindcontrole.
- Mobiele CSS en alternatieve mobiele beeldkaarten. De aangevraagde telefoonweergave werd door de browser niet werkelijk toegepast; een echte telefooncontrole blijft nodig.

De huidige versie is al rustiger dan oudere bestanden doen vermoeden: er zijn **vier videoverwijzingen en vijf statische kaarten** in de oefeningen. Oudere video's staan nog in de code/mediaverzameling, maar zijn daardoor niet automatisch onderdeel van de huidige patiëntenroute.

## Wat goed is en moet blijven

**De toon.** Zinnen als ‘Je hoeft niet perfect te slapen’ en ‘Een slechte nacht is geen mislukking’ halen prestatiedruk weg. De herkenbare situaties zijn een betere ingang dan een theoretische les over slaapstadia.

**De vormgeving.** Blauw, turquoise, lichte achtergronden en consistente knoppen geven een herkenbaar geheel. De videobeelden ogen in de bekeken voorbeelden eenvoudiger en meer als een prototype dan de website eromheen. Een cartoon is op zichzelf niet onprofessioneel; vooral de uitwerking en aansluiting op het leerdoel bepalen de kwaliteit.

**De begrenzing.** De actuele code beperkt aanbevelingen tot twee oefenonderwerpen en het plan tot twee acties. Kopiëren, printen, tekstalternatieven bij video's, Nederlandse ondertiteling en ondersteuning voor minder beweging zijn al aanwezig. Die hoeven niet opnieuw te worden uitgevonden.

**Het terugvalperspectief.** De afsluiting helpt de patiënt een mindere nacht te relativeren. Dat past goed bij een module waarin slapen geen nieuwe prestatieopdracht moet worden.

## Eerst verbeteren: selectie en inhoud

### 1. De slaapcheck kan te vroeg een conclusie geven

Live gereproduceerd: na vijf van tien antwoorden verschijnt de persoonlijke route. De vragen over ritme en gedachten kunnen dan nog helemaal leeg zijn. Toch staat er dat andere stappen minder goed passen.

De code gebruikt de hoogste antwoordscore per onderwerp, kiest maximaal twee onderwerpen en vraagt niet eerst welk probleem de patiënt zelf het belangrijkst vindt. Bij gelijke scores bepaalt de oorspronkelijke volgorde mede de keuze.

**Voorstel:** beantwoord eerst alle noodzakelijke kernvragen, of toon expliciet een voorlopige route met de nog ontbrekende onderwerpen. Voeg toe: ‘Waar heb jij het meeste last van?’ en ‘Wat wil je overdag weer makkelijker kunnen?’ Vraag naar duur en hinder overdag. Benoem dit als een keuzehulp, niet als een diagnostische uitkomst.

### 2. ‘Een vast slaapritme’ bevat slaaprestrictie

Een antwoord over wisselende weekendtijden kan nu leiden naar een onderdeel waarin de patiënt gemiddelde slaapuren berekent en daar een nieuwe bedtijd van afleidt. Dat zijn verschillende behoeften: regelmaat verbeteren en tijd in bed beperken.

De module zegt wel dat dit samen met de fysio moet. Toch staan de rekenstappen direct klaar. Bovendien rekent het voorbeeld met gemiddelde slaapduur zonder extra marge. De geraadpleegde Thuisarts-instructie telt een half uur op, noemt situaties waarin eerst artsenoverleg nodig is en geeft duidelijke contactmomenten. Dit verschil vraagt om een bewust gekozen, klinisch beoordeeld protocol. Het betekent niet dat elke andere behandelvariant fout is. [Thuisarts: korter in bed liggen](https://www.thuisarts.nl/slecht-slapen/ik-ga-korter-in-bed-liggen-als-behandeling-om-beter-te-slapen).

**Voorstel:** maak ‘regelmaat en daglicht’ de gewone zelfzorgroute. Geef tijd-in-bed-behandeling een eigen, passend geselecteerde route met geschiktheidscheck, duidelijke begeleiding, controle van slaperigheid en afspraken over evaluatie/stoppen. Een algemeen zinnetje onderaan is daarvoor onvoldoende productondersteuning.

### 3. Verplaats relevante zorgsignalen naar voren

Er staat al informatie over snurken, ademstops en indutten tijdens autorijden, maar pas onderaan de basisuitleg. Maak hiervan een korte vroege check met een concrete vervolgstap. Laat een behandelaar de formulering en urgentie vaststellen. Ook een directe FysionAIr-verwijzing naar een onderwerp moet deze afweging niet onbedoeld overslaan.

### 4. Maak de uitleg minder absoluut

- ‘Sta op na 15–20 minuten’ naast ‘kijk niet op de klok’ kan patiënten laten timen. Formuleer primair op het merken van aanhoudend alert of gefrustreerd wakker liggen, met een eventuele tijd als grove inschatting.
- ‘Spanning maakt inslapen moeilijker, niet jouw rug’ is te stellig. Pijn en andere factoren kunnen óók een rol spelen. Vermijd dat de patiënt hoort dat zijn klachten uitsluitend door spanning ontstaan.
- ‘Diepe slaap = herstel’ en ‘droomslaap = verwerken’ zijn begrijpelijke vereenvoudigingen, maar kunnen onbedoeld suggereren dat andere slaap niet herstellend is. De patiënt heeft vooral geruststelling en een bruikbare keuze nodig, geen slaapstadia die perfect gehaald moeten worden.
- Bij vroeg wakker worden: verbind opstaan en daglicht aan het gewenste dagritme. ‘Begin je dag, ook als het vroeg is’ en ‘vaste opsta-tijd’ vragen om een duidelijke onderlinge uitleg. Laat de route voor afwijkende slaapfasen inhoudelijk beoordelen.

## Welke animaties en beelden ik zou behouden

Dit is de inventaris van de actuele inhoud, niet van alle oude mediabestanden.

| Plaats / beeld | Huidige vorm | Mijn keuze en reden |
|---|---|---|
| Slaap en herstel: slaap → brein → klachten | Schema met resterende bewegende signaalpunten | Maak één rustige illustratie. De bewegende signalen zijn niet nodig om de boodschap te begrijpen. Vermijd alarmachtige nadruk en schijnprecisie over hersenprocessen. |
| Slaap en herstel: vicieuze cirkel | Schema | Behouden, kleiner en zonder nogmaals dezelfde alinea's. Laat vooral zien waar één kleine stap mogelijk is. |
| Hoe slaap werkt: slaapfasen en dag/nacht | Schema's / visuele uitleg | Korter maken. Eén overzicht volstaat; de gedetailleerde faseverdeling kan onder ‘Meer weten’. |
| A: Waarom forceren wakker maakt (`force`, 24 sec) | Video | De boodschap behouden. Standaard een korte herkenningskaart; optioneel een goede korte scène of uitlegvideo. Alleen tekst langzaam in beeld laten komen rechtvaardigt geen grote videokaart. |
| A: Piekeren parkeren (`worry-plan`) | Stappenkaart | Behouden. Laat de patiënt meteen één zorg en eventueel één vervolgstap formuleren. De handeling is waardevoller dan extra beweging. |
| A: Adem 4–6 (`breathe`, 50 sec) | Oefenvideo | Beweging heeft hier een functie: tempo aangeven. Liever een rustige, zelf te starten ademcirkel met optionele stem, herhalen en stoppen. Geen belofte dat de patiënt hiervan móét ontspannen of slapen. |
| B: Slaapcycli (`cycles`, 26 sec) | Video | Optioneel behouden als één heldere uitleg waarom kort wakker worden normaal kan zijn. Voorkom duplicatie met de basisuitleg. Geen exact ogend persoonlijk slaapverloop. |
| B: Wat doe ik als ik wakker lig? (`night-plan`) | Keuzekaart | Sterk onderdeel, behouden. Maak de keuze ‘suf en ontspannen / alert en gefrustreerd’ direct bruikbaar. Een video is niet noodzakelijk. |
| C: Licht en vaste opsta-tijd (`light-rhythm`) | Dagritmekaart | Behouden en persoonlijk maken: gewenste opsta-tijd en haalbaar moment voor buitenlicht. Geen draaiende klok toevoegen om de pagina levendiger te maken. |
| D: Tijd in bed passend maken (`rhythm`, 28 sec) | Video | Alleen in de passende behandelroute. Vervang het eenvoudige bed/poppetje door heldere tijdsbalken die werkelijk tijd in bed versus slaap uitleggen. |
| D: Slaapdruk (`pressure-curve`) | Dagcurve | Behouden. Eventueel één korte beweging die opbouw over de dag en afname tijdens slaap laat zien. Een simpele interactie kan iets toevoegen, zonder persoonlijke voorspelling te suggereren. |
| E: Gedachte naar eerlijkere zin (`thought-check`) | Oefenkaart | Behouden; maak dit een kleine oefening met een eigen zin en een voorbeeld. Een denkend hoofd of bewegende hersenen voegt weinig toe. |
| F / afsluiting: plan vasthouden | Geen eigen video's meer; hersteladvies in afsluiting | Zo houden. Een terugvalkaart met de eigen actie is bruikbaarder dan een geanimeerde checklist. |

Oude filmpjes zoals bewegende beschermingsmeters, losse ochtendlichtvarianten, piekerwolkjes en geanimeerde plannen zou ik niet opnieuw standaard invoegen. De huidige statische vervangingen gaan in de goede richting.

In de bekeken ritmevideo zag ik een zeer eenvoudig getekend bed en persoon. Daar begrijp ik je kwaliteitsbezwaar. Een herkenbaar mens is zinvol als menselijk gedrag wordt voorgedaan; voor een abstract principe zijn strak ontworpen diagrammen vaak duidelijker. Een realistisch AI-hoofd met onbetrouwbare anatomie zou ik hier vermijden.

Bij de bekeken forceren-video bedekte de knop ‘Opnieuw afspelen’ de afsluitende tekst. Zet die bediening buiten de kernboodschap. Stem ondertitels, kaders, lettergrootte en witruimte op de website af, met leesbaarheid voorop.

## Waar de patiëntenroute nog te veel vraagt

De oefenpagina A bevat achtereenvolgens uitleg, twee kernpunten, vijf stappen, drie mediaonderdelen, vijf mogelijke acties, vier evaluatieschuiven en een notitie. Alles afzonderlijk is begrijpelijk, maar samen is het veel voordat de patiënt een eigen uitvoerbare keuze heeft gemaakt.

De evaluatie staat bovendien meteen op de eerste bezoekpagina en begint visueel op vier keer 5. Dat oogt alsof er al een beoordeling is, terwijl nog niet is geoefend. Toon eerst ‘Nog niet ingevuld’ en bied de evaluatie op het juiste moment aan.

De afsluiting toont bij nul gekozen acties zowel ‘Je hebt nog geen stap gekozen’ als ‘Je hebt jouw plan gemaakt’. Dat is live bevestigd. Maak de eindboodschap afhankelijk van de echte keuze en bied bij een leeg plan één duidelijke knop terug naar de actie.

Ook de stapnummering verschilt: de navigatie noemt bijvoorbeeld ‘Slaap en herstel — Stap 2’, terwijl bovenaan ‘Stap 3 van 6’ staat. Gebruik één betekenis van voortgang.

Een opslagtekst bij de reflectie zegt dat de tekst op dit apparaat wordt opgeslagen. De actuele code bewaart vrije reflecties en notities juist niet blijvend. Corrigeer die belofte en maak duidelijk wat na sluiten behouden blijft. Het gekopieerde plan bevat de gekozen acties, maar niet automatisch alle reflecties of een overdracht naar de behandelaar.

## Mijn voorstel voor V2

**1. Een korte start met een persoonlijk doel.** ‘Wat wil je weer makkelijker kunnen?’ Bijvoorbeeld energie voor werk, minder strijd in bed of rustiger omgaan met wakker worden. Geef één zin over de relatie tussen slaap en klachten; uitgebreide uitleg is beschikbaar op verzoek.

**2. Een compacte, volledige keuzehulp.** Vragen over belangrijkste hinder, duur, dagfunctioneren en relevante zorgsignalen. Leg uit waarom een route past en laat de patiënt de prioriteit bevestigen. Wisselende slaaptijden leiden niet automatisch naar slaaprestrictie.

**3. Eén relevante uitleg.** Kies lezen of kijken. Eén boodschap en één passend beeld. Daarna bijvoorbeeld: ‘Wat zou je in deze situatie kunnen proberen?’ Geen toetsgevoel, wel nagaan of de uitleg bruikbaar was.

**4. Eén uitvoerbaar experiment.** Niet alleen ‘ik zoek ochtendlicht’, maar bijvoorbeeld: ‘Na het ontbijt ga ik een kort rondje buiten lopen.’ Laat de patiënt tijd/moment, haalbaarheid en een alternatief bij een obstakel kiezen. Een tweede actie is optioneel.

**5. Mijn week.** Een compacte kaart met de gekozen actie en terugvalzin. Optioneel een eenvoudige check: gelukt, deels gelukt, niet gelukt. Geen slaapscore of dagelijkse prestatiedruk als standaard.

**6. Kijken hoe het gaat.** Na ongeveer een week: is het uitvoerbaar, wat hielp of zat in de weg? Bij de afgesproken vervolgevaluatie: hoe gaat het met spanning, dagelijks functioneren en de eigen hulpvraag? Laat passende vervolgstappen en het moment voor overleg afhangen van de inhoud van de route.

De huidige inhoud kan grotendeels achter deze route blijven bestaan als verdiepingsbibliotheek. Ik adviseer dus een andere volgorde en dosering, niet alles weggooien.

Test een eerste versie met bijvoorbeeld vijf tot acht verschillende patiënten, ook mensen die moeite hebben met lezen of digitaal gebruik. Laat hen zonder hulp een actie kiezen en in eigen woorden vertellen wat ze thuis gaan doen. Dat sluit aan bij de terugvraagmethode van [Pharos](https://www.pharos.nl/infosheets/laaggeletterdheid-en-beperkte-gezondheidsvaardigheden-de-terugvraagmethode/). Zo'n kleine gebruikstest laat knelpunten zien; hij bewijst geen behandelwerking.

## De rol van Synthesia

Ik zou eerst drie optionele videotypen ontwerpen en daarna pas produceren:

1. **Welkom en geruststelling, 20–30 seconden.** Een herkenbare spreker, korte FysionAIr-intro en een concrete verwachting: je kiest één haalbare stap. Een echte behandelaar kan hier ook sterk werken.
2. **Slaapklok en slaapdruk, ongeveer 45–75 seconden.** Eén rustige uitleg met twee goed ontworpen diagrammen. De bestaande langere slaap-waakvideo kan als verdieping dienen; de kernroute krijgt een kortere montage.
3. **Wat doe je als je alert wakker blijft?, ongeveer 30–45 seconden.** Alleen als een demonstratie meer duidelijkheid biedt dan de keuzekaart. Gebruik echte of gecontroleerde beelden met continuïteit van persoon, kamer, bed en kussen.

Voor Synthesia: Claire Nederlands Friendly als uitgangspunt, natuurlijke zinnen en uitspraakcontrole per scène. Het juiste tempo bepalen we aan begrip, niet aan een vaste snelheidsinstelling. Een klein logo, subtiele gradientaccenten, rustige ondertitels en één stijl voor diagrammen geven samenhang. Muziek is optioneel en ondergeschikt aan spraak; 12% is geen universele maat voor verstaanbaarheid.

Geen autoplay en geen verplichte videowachttijd. Lezen moet een volwaardig alternatief zijn. Ademtempo en eenvoudige keuzes kunnen beter rechtstreeks in de module werken dan als vooraf opgenomen avatarvideo.

## Volgorde waarin ik het zou aanpakken

1. **Voor bredere inzet:** routekeuze en slaaprestrictie uit elkaar halen, relevante zorgsignalen tijdig tonen, onjuiste/stellige formuleringen en de lege-planmelding corrigeren.
2. **Daarna:** één kort V2-traject uitwerken van hulpvraag naar weekactie en evaluatie. De bestaande begrenzing van twee acties behouden.
3. **Vervolgens:** dat traject met patiënten op een echte telefoon testen; aandacht voor leesbaarheid, ondertitels, begrip, terugkomen en bewaren van het plan.
4. **Pas daarna:** de noodzakelijke video's professioneel produceren. Begin met één video waarvan de meerwaarde tegenover een statische kaart echt zichtbaar is.

De website, productiecode en Synthesia-video zijn tijdens deze review niet aangepast. GitHub is gelezen en de nieuwste remote-informatie is opgehaald; de bestaande lokale wijzigingen zijn behouden.
