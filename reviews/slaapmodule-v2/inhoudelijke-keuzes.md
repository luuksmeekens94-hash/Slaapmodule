# Inhoudelijke keuzes — Slaaproute V2

Gecontroleerd: 11 september 2026. Status: technische preview; geen patiënt- of klinische validatie uitgevoerd.

## Bronnen en bereik van de controle

| Primaire bron | Geraadpleegd | Toepassing |
|---|---|---|
| [Thuisarts — slaapadviezen](https://www.thuisarts.nl/slecht-slapen/ik-wil-beter-slapen-slaapadviezen) | Volledige pagina; vermeldt wijziging 1 juli 2024 | Regelmaat, buitenlicht, ontspanning en hulp bij aanhoudende klachten |
| [Thuisarts — mogelijke slaap-apneu](https://www.thuisarts.nl/slaapapneu/ik-denk-dat-ik-slaap-apneu-heb) | Volledige pagina; gewijzigd 7 januari 2026 | Vroege aandacht voor ademstops en slaperigheid, geen autorijden bij ernstige slaperigheid, huisarts op werkdagen, bedrijfsarts bij machines |
| [Thuisarts — korter in bed liggen](https://www.thuisarts.nl/slecht-slapen/ik-ga-korter-in-bed-liggen-als-behandeling-om-beter-te-slapen) | Volledige pagina; vermeldt wijziging 1 juli 2024 | Onderscheid behandeling/regelmaat, geschiktheid en begeleiding bespreken |
| [NHG-Standaard Slaapproblemen](https://richtlijnen.nhg.org/standaarden/slaapproblemen) | Geïndexeerde primaire tekst via webzoekdienst; directe pagina gaf HTTP 401 en browser verwees terug naar start | Achtergrond: samenhangende anamnese, lichamelijke en psychische factoren, gedragsmatige behandeling. Geen claim van volledige richtlijnreview |

De oude richtlijntitel “Slaapproblemen en slaapmiddelen” verwijst inmiddels in zoekresultaten naar “Slaapproblemen”. De nieuwe titel en bronlink worden gebruikt. Er zijn geen externe bronpassages letterlijk overgenomen als uitgebreid patiëntenmateriaal.

## Beslissingen

- **Keuzehulp, geen score-instrument.** Vijf symptoomvragen, vijf zorg/contextvragen, duur en hinder zijn verplicht. Een ontbrekend antwoord is nooit nul. De gebruiker bevestigt zelf één onderwerp. Bij meerdere gelijke antwoorden wordt dat benoemd. Alle onderwerpen blijven bewust te verkennen; ze worden niet als uitgesloten of inferieur voorgesteld.
- **Geen problematisering van weinig klachten.** “Geen last”, “nauwelijks hinder” en “ik heb geen slaapproblemen” zijn echte antwoorden. De uitkomst zegt dat verkennen mag en niet dat behandeling nodig is.
- **Verwijzingen.** Alleen de bekende `source`, `sleep` en `focus` waarden vormen een startaanwijzing. Geen overgenomen diagnose, geen vooraf ingevulde vragen en geen vrijbrief om zorgvragen over te slaan. URL-parameters verdwijnen uit de navigatie na uitlezen; er gaat geen referrer naar bronpagina's. Inkomende URL's kunnen al door de host zijn gelogd: voeg nooit persoonsgegevens aan een verwijzing toe.
- **Gewone regelmaat.** De route bevat geen berekende bedtijd, tijd-in-bed-limiet of slaapduuradvies. Een gekozen opsta-tijd hoort bij het gewone gewenste ritme. De eerste buitenstap is een haalbaar begin, geen volledige dosering lichttherapie. Bij nachtdiensten of sterk verschoven ritme verschijnt de route naar overleg.
- **Slaaprestrictie.** V2 geeft uitleg en een concreet gesprekspad naar huisarts/praktijkondersteuner. De bron beschrijft ook zelfbehandeling; V2 kiest bewust een beperktere productscope zolang geen eigen beoordeeld protocol beschikbaar is. Vragen naar begeleiding, evaluatie en contactmomenten worden aangereikt. Er staat geen rekenvoorbeeld in V2.
- **Zorgsignalen.** Antwoorden “ja” of “ik twijfel” tonen proportionele vervolgtekst al tijdens de check. Slaperigheid en ademstops blijven in de planfase zichtbaar en worden opgenomen in de kopie/print. Vragen zijn geen gevalideerde triage en sluiten aandoeningen niet uit. Bij langdurige klachten met veel hinder wordt huisartscontact geadviseerd. De route vervangt geen acute-zorgvoorziening.
- **Wakker liggen.** Handelen vanuit alertheid/frustratie, geen timer. Terug naar bed bij slaperigheid. Bij vroeg wakker worden sluit daglicht aan op de gewenste dagstart. Bij pijn/valgevaar wordt een veilig alternatief met de behandelaar besproken.
- **Pijn en slaap.** Geen uitspraak dat pijn “niet de oorzaak” is. Geen exact hersenmechanisme, slaapstadiumdoel of individuele herstelgarantie.
- **Ademhaling.** Optionele tempo-oefening, ongeveer 4 in/6 uit, normaal ademvolume en eigen tempo toegestaan. Stop bij ongemak/duizeligheid. Het specifieke tempo wordt niet als bewezen behandeling van slapeloosheid geclaimd.
- **Gedachten.** De kaart helpt één zorg en een mogelijke stap te formuleren. Geen garantie dat schrijven piekeren stopt. Eigen tekst is optioneel en blijft uitsluitend in werkgeheugen tijdens het bezoek.
- **Terugblik.** Haalbaarheid en ervaren dagelijks functioneren, zonder vooringevulde cijfers. “Nog niet geprobeerd” en “nog niet te zeggen” zijn legitieme uitkomsten. Een nieuwe week wist de vorige terugblik; er is geen longitudinaal patiëntendossier.

## Opslag en grenzen

Zonder vinkje is alle toestand alleen in het actieve bezoek. Na expliciet aanvinken worden uitsluitend toegestane vaste antwoorden, onderwerp, acties, tijdstip, startdatum en terugblik in één lokale browserkey opgeslagen. De gebruiker kan hervatten of wissen. Vrije oefentekst wordt niet opgeslagen en niet in planexport opgenomen. Opslagfouten leiden tot een eerlijke melding en kopie/print als alternatief. Wissen vanuit een tweede tab stopt automatisch opnieuw opslaan vanuit de eerste tab.

V2 introduceert geen analytics, account, patiëntendatabase, backend of berichtenservice. Alle werkende UI-code en diagrammen zijn lokaal geserveerd. De host ontvangt normale verbindingsgegevens; de module verzendt geen antwoorden. Zelf gemaakte kopieën/prints vallen buiten de wisfunctie. V1 heeft zijn eigen historische gedrag en blijft ongewijzigd.

## Nodig vóór bredere inzet

Een bevoegde behandelaar beoordeelt taal/urgentie van de zorgvragen, stimuluscontrole bij kwetsbare patiënten, afwijkend ritme en de verwijzende behandelroute. Voer de apart beschreven patiëntgebruikstest uit. De broncontrole en softwaretests zijn daarvoor geen vervanging.
