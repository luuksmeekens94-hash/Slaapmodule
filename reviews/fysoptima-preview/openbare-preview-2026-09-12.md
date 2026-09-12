# Gewone previewlink zonder account — 12 september 2026

## Probleem en oplossing

Bij het openen van een Vercel-deellink wordt de tijdelijke toegangscode uit de adresbalk verwijderd. Het doorsturen van die gewone URL leidde voor nieuwe bezoekers tot de Vercel-login. Dit is in afzonderlijke schone browsers gereproduceerd: gewone URL → Vercel-login; URL met de oorspronkelijke code → preview. De eerste oplossing was technisch geldig maar ongeschikt voor de gewenste manier van delen.

De nieuwe gewone previewlink krijgt uitsluitend op de exacte deployment een Vercel protection exception. Een servercontrole begrenst de toegang onafhankelijk van cookies, de browserklok of de agentcomputer. Vanaf `2026-09-19T22:00:00Z` (20 september 00:00 Nederlandse tijd) geeft de preview HTTP 410 met een Nederlandse melding. Eerder gedownloade inhoud en afzonderlijke Synthesia-deellinks kunnen hiermee niet worden ingetrokken.

De controle werkt vóór het leveren van statische bestanden. Alleen de benoemde preview-HTML, JavaScript, CSS, het logo en twee fonts worden doorgelaten; V1, V2, data en onbekende bestanden krijgen 404. Alle antwoorden van deze preview krijgen no-store en noindex. Root en `/preview` leiden naar `/preview/`. Productie en andere branches worden niet door deze featurebranch-controle beperkt. De projectbrede Vercel-bescherming blijft aan.

**Gereed:** [gewone deelbare previewlink](https://slaapmodule-jvwjrwlq2-luuksmeekens94-6788s-projects.vercel.app/preview/). Deze URL heeft geen querycode nodig en werkt ook wanneer hij na het openen uit de adresbalk wordt gekopieerd. De oudere `q6iqzh7lq`-URL blijft beschermd; ontvangers moeten de nieuwe URL gebruiken.

## Kandidaat en autorisatie

Implementatiecommit `cfd2c5b7c7b359f2ea521d5d8991a0467b3e974d`, deployment `dpl_J9zG7QaeQXojjPsNMcGheHjJH41E`, domein `slaapmodule-jvwjrwlq2-luuksmeekens94-6788s-projects.vercel.app`.

De opdracht om de preview zonder account deelbaar te maken en open te houden tot 19 september dekt deze tijdelijke, omkeerbare toegang tot de preview. Geen patiëntgegevens, nieuwe accounts, berichten aan Lukas/Rob, productiepublicatie of projectbrede uitzonderingen. Governancepreflight COMPATIBLE; uitvoering als reguliere Codex-taak, zonder native Goal of achtergrondscheduler. Een onafhankelijke read-only reviewer vond geen P0/P1/P2-bezwaren bij de exacte kandidaat.

Terugdraaien kan door uitsluitend de `alias-protection-override` voor deze deployment via Vercel te revoken; de oude deployments houden hun bestaande bescherming.

## Controle

55 logica-/regressietests inclusief grensmoment, allowlist en onaangetaste productie/andere branches slagen. Tien previewbrowsergevallen slagen lokaal op desktop en mobiel. De oorspronkelijke video's, vormgeving en inhoud zijn niet gewijzigd. De Vercel-builder voert syntaxchecks uit; volledige media- en browservalidatie blijft in GitHub Actions met ffmpeg beschikbaar.

Vóór de publieke uitzondering is op de protected deployment bevestigd dat de servercontrole echt actief is: deadlineheader en no-store aanwezig, preview/assets 200 en V1/V2/data/sourcepaden 404. CI-run `34706449341` en de onafhankelijke review zijn geslaagd. Alle drie echte video's zijn op desktop en mobiel afgespeeld, de oefening werkt en zeven previewbronbestanden komen overeen met de geteste versie.

Vercel heeft de `alias-protection-override` bevestigd voor uitsluitend `dpl_J9zG7QaeQXojjPsNMcGheHjJH41E`. Daarna is de kale URL geopend in lege desktop- en mobiele browsersessies, en de adresbalk-URL opnieuw geopend in twee andere lege sessies. Steeds verschijnt de preview zonder Vercel-login. De volledige module blijft 404, ook met een `x-middleware-subrequest`-header. Zie `openbare-toegang-controle-2026-09-12.txt`. De exacte einddatum is in code getest; toekomstige kalenderdagen kunnen niet tegen de echte huidige serverklok worden gesimuleerd. De deadlineheader bevestigt dat die code op de gedeelde deployment draait.

Technische referenties: [Vercel Routing Middleware](https://vercel.com/docs/routing-middleware/getting-started), [deployment-specifieke uitzonderingen](https://vercel.com/docs/deployment-protection/methods-to-bypass-deployment-protection/deployment-protection-exceptions), [protection-bypass-API](https://vercel.com/docs/rest-api/aliases/update-the-protection-bypass-for-a-url). Gecontroleerd tegen de officiële OpenAPI-specificatie; de exception zelf heeft geen TTL, daarom staat de einddatum in de servercode.
