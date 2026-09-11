# Technische oplevering — FysionAIr Slaaproute V2

11 september 2026. Technische preview; patiëntgebruik en klinische geschiktheid zijn nog niet gevalideerd.

## Resultaat

V2 staat onder `/v2/`, met zes vaste stappen: hulpvraag, volledige check, gerichte uitleg, maximaal twee concrete acties, weekplan en terugkijken/bijstellen. V1 blijft onder `/` beschikbaar. De bestaande V1-app, inhoudsconfiguratie, video's en Remotion-bronnen zijn ongewijzigd ten opzichte van basiscommit `04f2ea6a5d44f561b4b8b8c3fa629ca61db65284`.

De geïsoleerde branch is `codex/slaaproute-v2`. Beide oorspronkelijke opdrachtstukken zijn opgenomen onder `reviews/slaapmodule-audit-2026-09-11/`. Het niet-gecommitte mediawerk in de oorspronkelijke werkmap is niet gewijzigd.

## Gedrag en inhoud

- Geen uitkomst vóór alle kernvragen, duur/hinder en zorgvragen zijn ingevuld. Een verwijzing geeft alleen context. De patiënt bevestigt één onderwerp; gelijke uitkomsten hebben geen verborgen winnaar.
- Gewone regelmaat en daglicht leveren geen restrictieschema op. De behandelroute geeft een concrete gespreksstap met huisarts/praktijkondersteuner. Zorgadviezen staan bij de betreffende vraag en in het uiteindelijke plan.
- Een plan vraagt minstens één actie, een passend moment, haalbaarheid en een alternatief. Maximaal twee acties. Wijziging van hulpvraag/check vraagt een nieuwe keuze; gewijzigde acties beginnen zonder oude terugblik.
- Evaluatie start onbeantwoord. “Nog niet geprobeerd” kan. Bijstellen kan naar een kleinere stap, een nieuwe keuze, een volgende week of een gesprek.
- Bewaren is optioneel en beperkt tot vaste keuzes en tijden. Vrije oefentekst blijft in werkgeheugen. Hervatten, wissen, opslagfouten, mislukte klembordtoegang en wissen vanuit een ander tabblad zijn afgehandeld. Een terugkeer via de browsercache start als een nieuw bezoek.
- Statische nacht/dag-illustratie, slaapklok/slaapdrukdiagrammen, gedachtekaart, wakker-liggenkaart en persoonlijke plankaart. De ademcirkel start op verzoek, heeft stop/herhaal, eindigt na één minuut en stopt bij verlaten. Minder beweging houdt de cirkel stil; tekst blijft bruikbaar.
- Geen video is noodzakelijk. Er zijn geen lege videospelers of nieuwe betaalde producties. Bestaande V1-media blijven intact, maar zijn geen afhankelijkheid van V2.

## Verificatie en bewijs

De lokale controles staan in `validation.log` en `browser-tests.log`; browserbeelden en een fictief voorbeeldplan staan in `evidence/`. Er zijn 52 geslaagde logica-/regressietests en 32 browsergevallen (16 per viewport). De browser-suite draait ook via GitHub Actions bij deze branch en pull requests.

| Controle | Bewijs / resultaat |
|---|---|
| Bestaande tests en media-validatie | `npm run validate`: 42 V1-tests en 10 V2-logictests; oorspronkelijke media-validator slaagt |
| Complete browserroutes | Desktop 1440×1000 en echte browserviewport 360×800; alle vijf onderwerpvarianten leveren een volledig plan |
| Volledige hoofdroute | Start, check, uitleg, twee acties, bewaren, opnieuw laden, hervatten, kopiëren, printen, terugkijken, kleiner maken en wissen |
| Selectie/routing | Ontbrekende antwoorden, weinig klachten, gelijke antwoorden, verwijzingen en directe hashes; teruggaan en onderwerpwissel |
| Toetsenbord | Alle zes stappen met Tab, pijltjes, spatie en Enter; tevens start/stop van ademcirkel |
| Toegankelijkheid | axe WCAG 2 A/AA en 2.1 AA: geen gevonden overtredingen op zes schermen plus bronnenpagina, beide viewports |
| Beweging/media | Geen autoplay; normale/reduced-motion weergave; stop bij routewissel; einde na minuut en herhaal; afbeeldingsfouten blokkeren geen route |
| Opslag/privacy | Zonder toestemming geen writes; opt-in, opt-out, corrupte opslag, schrijffout, vrije tekst niet opgeslagen, wisfunctie en twee tabbladen |
| Export | Echte klembordtekst gecontroleerd; handmatige fallback; print-CSS en gegenereerde A4-PDF gecontroleerd en visueel bekeken |
| Visueel | Alle zes schermen plus ademcirkel vastgelegd; geen horizontaal inhoudsverlies op 360px; gerichte beelden en print visueel nagekeken |
| Runtime | Geen ongehanteerde browserfouten in de volledige hoofdroute; geen antwoorden-API of patiëntendatabron aanwezig |

Een eerste browserassertie vond dezelfde tijdtekst in de zichtbare plankaart én de verborgen printkaart; de test is op de zichtbare kaart gericht. Tijdens review zijn actieafhankelijke momenten ingevoerd zodat bijvoorbeeld “opstaan na het ontbijt” niet mogelijk is. Een extra terugkeertest reproduceerde browserherstel van een oud radiovinkje zonder overeenkomstige applicatietoestand. De weergave wordt nu na browserherstel opnieuw vanuit de werkelijke toestand opgebouwd. Daarna zijn de relevante controles opnieuw uitgevoerd.

## Releasegrens

GitHub gebruikt bij aanvang **master** als default branch. Het gebruikersbeleid schrijft **main** als enige productiebron voor. De bestaande live Vercel-deployment is `dpl_6W1ya8k6Cd2mcDRgnp3KnAuRjvyf` op commit `04f2ea6`. Dit verschil is niet stilzwijgend veranderd. Geen merge, productie-deployment, promotie of wijziging van toegangsbeleid hoort bij deze eerste V2-oplevering. Een latere release vraagt eerst een expliciet afgestemde correctie van de branch-/productieconfiguratie, daarna review/merge en verificatie van dezelfde commit op GitHub en productie.

## Onderbouwing en volgende validatie

- [Inhoudelijke keuzes en broncontrole](inhoudelijke-keuzes.md), inclusief de beperking van directe NHG-toegang.
- [Drie optionele Synthesia-scripts en storyboards](synthesia-storyboards.md).
- [Gebruikstestprotocol voor 5–8 echte patiënten](patientgebruikstest.md).

Niet uitgevoerd: onderzoek met echte patiënten, een klinische beoordeling door een behandelaar, bewijs van effectiviteit, Safari/Firefox en tests op een fysieke telefoon. De mobiele tests gebruikten een werkelijk ingestelde smalle Chromium-viewport, geen alleen verkleinde schermafbeelding. Automatische toegankelijkheidstests zijn geen volledige audit met hulptechnologie. De voorbeeld-PDF is een leesbare printuitvoer, geen apart gecertificeerd toegankelijk document.
