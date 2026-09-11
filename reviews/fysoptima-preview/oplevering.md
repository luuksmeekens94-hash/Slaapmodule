# FysOptima — persoonlijke demonstratie

11 september 2026. Aparte featurepreview onder `/preview/`, branch `codex/fysoptima-preview`. Geen productierelease.

## Gepubliceerde reviewversie

- [Preview](https://slaapmodule-rlpgauyry-luuksmeekens94-6788s-projects.vercel.app/preview/), deployment `dpl_CCf7VuDmGhbNo7NBQMPafd8F6CUb`, READY, preview-target, GitHub-commit `ed561b456ddb96c829cd1fe96994da99a0b4aa03`.
- [Draft-PR #2](https://github.com/luuksmeekens94-hash/Slaapmodule/pull/2), gericht op de bestaande V2-branch; geen merge uitgevoerd.
- Bestaande Vercel-bescherming behouden. Een afzonderlijke tijdelijke reviewlink is uitgegeven, geldig tot 12 september 2026 om circa 16:11 Nederlandse tijd. De URL zonder token vraagt toegang. De token staat alleen buiten versiebeheer en is aan Luuk verstrekt.
- In twee verse browsercontexten (desktop en mobiel) werkt de tijdelijke link zonder account. De gepubliceerde interactieve route, plan en terugkoppeling zijn gecontroleerd. De drie echte embedded video's zijn gestart en hun voortgang is gemeten. Zie `remote-controle.txt`.
- HTML, CSS en JavaScript van de deployment zijn met SHA-256 gelijk bevonden aan de lokaal geteste bestanden. Previewheaders zijn aanwezig.
- GitHub Actions-run `34614698605` is geslaagd. De aanvullende documentatiecommit verandert de hierboven geteste implementatie niet.

## Wat Geert kan bekijken

- Persoonlijke welkomstmelding met expliciete previewstatus; opnieuw op te roepen vanuit header en footer.
- FysionAIr-logo, oorspronkelijke blauw/turquoise kleuren en lokaal geladen DM Sans / Plus Jakarta Sans.
- Een samenhangende presentatie van het hybride zorgpad: praktijk, kleine stap thuis, vervolggesprek.
- Twee fictieve situaties met een interactieve oefening, aanpasbare weekactie en terugblik.
- Patiënt- en behandelaarsperspectief. Het behandelaarsoverzicht volgt de werkelijke demokeuzes en onderscheidt een gekozen plan van een suggestie. Het is uitdrukkelijk een concept, zonder dossier- of intakekoppeling.
- Drie gepubliceerde Synthesia-video's: welkom (32 s), wakker liggen (34 s), gedachten een plek (43 s). Volledige leestekst en externe fallbacklink per video.

## Inhoud en privacy

De voorbeeldsituaties zijn fictief. Geen vrije invoer, persoonsgegevens, diagnostiek of claims over bewezen effectiviteit. De volledige V2-inventarisatie wordt niet verkort gebruikt om een persoonlijke conclusie te trekken; de preview laat vooraf uitgewerkte voorbeelden zien. De oorspronkelijke module blijft ongewijzigd.

Demokeuzes blijven alleen in het werkgeheugen van de geopende pagina. Geen localStorage, sessionStorage of antwoorden-API. Herladen begint opnieuw en toont de previewmelding. Bij herstel uit de browsercache wordt eveneens gereset. Video's laden pas na openen; sluiten verwijdert het iframe en stopt playback. Synthesia ontvangt bij video laden de gebruikelijke netwerkgegevens; de demokeuzes worden niet meegestuurd.

Geen zoekindexering: robots-metatag en responseheader. Dit is geen toegangsbeveiliging. Tijdelijke toegang wordt geregeld via de bestaande Vercel-deploymentbescherming en een tijdelijke reviewlink, niet via een misleidende browserklok. Deelbare toegangstokens horen niet in deze repository.

## Controle

- Bestaande modulevalidatie en 52 logica-/regressietests geslaagd.
- Zes nieuwe browsergevallen geslaagd: drie scenario's op desktop en mobiel (360 px), inclusief echte selecties, onderwerpwissel, reset na herladen, nul browseropslag, toetsenbord, modal/focusterugkeer, transcripten en stoppen bij sluiten.
- Axe: geen gevonden WCAG 2 A/AA of 2.1 AA-overtredingen in de welkomstmelding, vier routeschermen en behandelaarsperspectief op beide viewports. Geen horizontale overflow in de vier routeschermen.
- De geautomatiseerde media-lifecyclecheck vervangt Synthesia door een testspeler. Echte videoverbinding en playback worden daarnaast in de browser gecontroleerd; deze twee vormen van bewijs worden niet door elkaar gehaald.
- Visuele reviewbeelden onder `evidence/`. De behandelaarstitel op mobiel kreeg extra ruimte na beeldcontrole.

De browsercontrole is uitgevoerd in Chromium, niet op fysieke mobiele apparaten of met alle hulptechnologie. Dit is een demonstratie voor bespreking, geen klinische validatie.

## Embedbron

De iframevorm en spelercontrols volgen [Synthesia's officiële spelerdocumentatie](https://docs.synthesia.io/docs/video-player). Referrer-Policy is voor deze route `strict-origin-when-cross-origin`, zodat domeinrestricties bij Synthesia niet door een lege referrer worden geblokkeerd.
