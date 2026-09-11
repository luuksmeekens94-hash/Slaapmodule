# Bouwplan — FysionAIr Slaaproute V2

## Doel en oplevering

Bouw een werkende, professioneel vormgegeven V2 waarmee een patiënt van een eigen hulpvraag naar één haalbare weekactie gaat, begrijpt waarom die actie past en later kan terugkijken en bijstellen. Lever een geteste preview met een werkende complete route, inhoudelijke onderbouwing en een compact opleverrapport. Behoud V1 beschikbaar als vergelijkingspunt. De bestaande productieversie wordt in deze eerste bouwopdracht niet vervangen.

Uitgangspunt: [analyse en voorstel](analyse-en-voorstel-v2.md). Dit bouwplan vertaalt die analyse naar uitvoering; controleer bij de start de actuele repository en live situatie, want de analyse is een momentopname van GitHub-commit 04f2ea6.

## Productprincipes

- Warm, begrijpelijk Nederlands; korte zinnen zonder betutteling of slaap als prestatie.
- FysionAIr: wit/licht, navy/blauw, turquoise en subtiele gradients. Ruime maar doelmatige witruimte, heldere typografie, herkenbare knoppen.
- Eén duidelijke hoofdactie per scherm. Maximaal twee gekozen weekacties over de hele route.
- Inhoud moet ook zonder video begrijpelijk zijn. Beweging alleen bij een aantoonbaar leer- of oefendoel.
- Passende uitleg bij de persoonlijke vraag; aanvullende theorie achter ‘Meer weten’.
- Geen diagnose, slaapgarantie of onbewezen persoonlijke voorspelling suggereren.
- Geen nieuw account, patiëntendatabase, tracking of automatische berichtenservice nodig voor deze versie.

## De te bouwen route

| Stap | Wat de patiënt ziet/doet | Resultaat |
|---|---|---|
| 1. Mijn hulpvraag | Kiest belangrijkste last en gewenste verbetering in het dagelijks leven | Een herkenbaar persoonlijk doel |
| 2. Wat past bij mij? | Korte complete kerncheck, duur/hinder en relevante zorgsignalen; bevestigt prioriteit | Transparant gekozen onderwerp en passende vervolgstap |
| 3. Begrijpen | Eén korte uitleg, lezen of optioneel kijken; eenvoudige toepassingsvraag | Begrip van de eigen volgende stap |
| 4. Mijn kleine stap | Kiest één actie, moment, haalbaarheid en alternatief bij obstakels | Uitvoerbaar plan; tweede actie optioneel |
| 5. Deze week | Ziet eigen plan en rustige terugvalzin, kan het bewaren/printen | Praktische steun zonder prestatiedruk |
| 6. Hoe gaat het? | Bekijkt haalbaarheid en ervaren verandering, stelt bij of bespreekt met behandelaar | Een zinvolle vervolgkeuze |

## Werkpakket 1 — passende selectie en inhoud

1. Los het voortijdig afronden van de check op: noodzakelijke kernvragen moeten beantwoord zijn. Onbeantwoord is nooit hetzelfde als geen klachten.
2. Laat de patiënt het belangrijkste onderwerp bevestigen. Maak keuzes en eventuele gelijkwaardige alternatieven begrijpelijk; maximaal twee onderwerpen.
3. Scheid normale regelmaat/daglicht van slaaprestrictie. Wisselende slaaptijden of dutjes alleen mogen niet direct een restrictieschema opleveren.
4. Bouw voor slaaprestrictie in deze V2 een duidelijke behandelverwijzing/geschiktheidsroute. Geen zelfstandig nieuw rekenprotocol invoeren zonder passende onderbouwing en beoordeling. Bij ontbrekende klinische validatie blijft de module informatief en verwijzend.
5. Controleer actuele primaire Nederlandse bronnen zoals Thuisarts/NHG voor adviezen en zorgsignalen. Plaats relevante zorgsignalen vroeg, ook bij instroom via FysionAIr-verwijsparameters. Beschrijf vervolgstappen concreet en proportioneel.
6. Herzie absolute uitspraken over pijn, slaapstadia en kloktijden. Maak de instructies over wakker liggen, gewenste opsta-tijd en ochtendlicht onderling consistent.

## Werkpakket 2 — ontwerp en gebruik

1. Werk de route voor telefoon en desktop uit met de bestaande herkenbare huisstijl. Hergebruik goede componenten; kies geen nieuw framework tenzij de huidige basis aantoonbaar tekortschiet.
2. Verminder herhaling tussen basisuitleg, oefeningen en media. Geef de gekozen actie eerder aandacht.
3. Maak stapnummering overal gelijk. De eindmelding mag alleen een gemaakt plan bevestigen wanneer een actie gekozen is.
4. Evaluatie begint als ‘Nog niet ingevuld’; geen standaardscore 5. Houd eerste gebruik en terugkijken duidelijk uit elkaar.
5. Behoud kopiëren en printen. Maak de inhoud bruikbaar voor het gesprek met de fysio zonder te suggereren dat iets automatisch verzonden is.
6. Maak opslaggedrag en tekstbeloften consistent. Kies minimale gegevensopslag en een heldere wisfunctie. Bewaar gevoelige vrije tekst niet stilzwijgend blijvend. Hervatten werkt voor zover het gekozen opslagbeleid dat belooft.

## Werkpakket 3 — beeld en video

| Onderwerp | Te bouwen vorm |
|---|---|
| Slaap en klachten | Eén rustige illustratie met korte, genuanceerde uitleg |
| Slaapklok en slaapdruk | Heldere diagrammen; eventueel korte functionele beweging |
| Ademhaling | Zelf te starten rustige ademcirkel met stop/herhaal en begrijpelijke instructie |
| Piekeren / gedachte onderzoeken | Direct bruikbare oefenkaart |
| Wakker liggen | Keuzekaart met herkenbare situaties |
| Weekplan / terugval | Persoonlijke statische kaart |

Alle interactieve of bewegende onderdelen krijgen toetsenbordbediening waar relevant, een statisch/tekstueel alternatief en ondersteuning voor verminderde beweging. Geen autoplay. Videoherhaling mag geen eindtekst bedekken. Controleer contrast, tekstgrootte en onderschriften.

Synthesia is een latere gerichte productiestap. Lever nu een concreet storyboard en script voor maximaal drie optionele fragmenten: welkom (20–30 sec), slaapklok/slaapdruk (45–75 sec), omgaan met wakker liggen (30–45 sec). Claire Nederlands Friendly, klein logo, subtiele gradients, natuurlijke uitspraak en consistente beelden. Bestaande bruikbare media mogen worden hergebruikt. Geen nep-anatomie of ongecontroleerde AI-bewegingen; geen lege video-elementen als noodzakelijke stap. Ontbrekende nieuwe Synthesia-productie mag de volledig bruikbare tekst/beeldroute niet blokkeren.

## Werkpakket 4 — verificatie

Test betekenisvolle routes, geen tests die alleen implementatiedetails herhalen:

- Onvolledige check geeft geen definitieve persoonlijke conclusie.
- Weinig klachten, één hoofdprobleem, meerdere problemen en gelijke scores hebben begrijpelijke uitkomsten.
- Alleen onregelmatige slaaptijden leidt niet naar een automatisch restrictieschema.
- Zorgsignalen worden tijdig zichtbaar, ook bij directe verwijzing.
- Maximaal twee acties; wijzigen, teruggaan en hervatten behouden een consistent plan.
- Leeg plan heeft geen succesmelding; volledig plan is kopieerbaar en printbaar.
- Evaluatie onderscheidt onbeantwoord van een echte score; afspraken over opslag/wissen kloppen.
- Hele route werkt op een werkelijke smalle viewport en desktop, zonder horizontaal verlies van inhoud, met toetsenbord en verminderde beweging.
- Media starten alleen op verzoek, stoppen bij verlaten en blokkeren de route niet bij laadfouten.

Controleer relevante bestaande tests, nieuwe gedragstests, browserconsole en visueel de volledige patiëntenroute. Leg beperkingen eerlijk vast. Schrijf daarnaast een beknopt gebruikstestprotocol voor 5–8 echte patiënten; voer geen verzonnen patiëntvalidatie op.

## Technische uitvoering en grenzen

Werk in een geïsoleerde worktree en aparte codex-branch vanaf de actuele bron. Behoud de bestaande lokale, niet-gecommitte wijzigingen in het oorspronkelijke project. Lees AGENTS.md en geldende projectinstructies. Neem dit bouwplan en de analyse op in de nieuwe branch.

Lever commits, een reviewbare PR waar mogelijk en een werkende preview. Geen directe productiepublicatie in deze eerste V2-opdracht. Het gebruikersbeleid verlangt voor eventuele latere productie een GitHub-main-release; de repository had tijdens de review master als standaardbranch. Documenteer deze discrepantie, verander de standaardbranch niet stilzwijgend en omzeil het releasebeleid niet.

## Definitie van klaar voor het goal

De V2-route is volledig geïmplementeerd en getest, de preview is toegankelijk (of een concrete externe blokkade is aantoonbaar vastgelegd), de inhoudelijke keuzes zijn onderbouwd, media/alternatieven werken, er zijn geen bekende ernstige routefouten en een kort rapport vermeldt resultaat, bewijs en resterende patiënt-/klinische validatie. Storyboards en een patiënttestprotocol zijn opgeleverd. Zet het goal pas op voltooid als de afgesproken technische oplevering echt gereed is; presenteer dit niet als bewezen klinische effectiviteit.
