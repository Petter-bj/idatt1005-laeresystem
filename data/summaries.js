/* Temasammendrag.
   Skjema: { topic, title, examNote, html }
   - topic: må matche en id i TOPICS (app.js)
   - html: fritt HTML; legg diagrammer som <div class="mermaid">...</div>
   Utvid: legg til flere objekter i array-et. */
window.APP_DATA = window.APP_DATA || {};
window.APP_DATA.summaries = [

/* ============ METODIKK & AGILE ============ */
{
  topic: "metodikk",
  title: "Systemutviklingsmetodikk & smidig utvikling",
  examNote: "På alle 4 tidligere eksamener. Kunne fossefall vs. smidig, Scrum-roller/seremonier, Kanban, og argumentere for metodevalg.",
  html: `
<p>En <strong>metodikk (methodology)</strong> er et rammeverk av prinsipper, roller, aktiviteter og artefakter for å styre systemutvikling. Hovedskillet går mellom <em>plandrevne</em> (fossefall) og <em>smidige (agile)</em> tilnærminger.</p>

<h3>Fossefallsmodellen (waterfall)</h3>
<p>Lineær, sekvensiell modell (ca. 1970). Hver fase ferdigstilles før neste starter, med tung dokumentasjon mellom fasene.</p>
<div class="mermaid">
flowchart LR
  A[Krav] --> B[Design] --> C[Implementasjon] --> D[Verifisering/Test] --> E[Vedlikehold]
</div>
<table>
<tr><th>Fordeler</th><th>Ulemper</th></tr>
<tr><td>Enkel å forstå og styre; tydelige milepæler; god dokumentasjon</td><td>Lite fleksibel for endringer; kunden ser produktet sent; dyrt å rette feil oppdaget sent</td></tr>
</table>

<h3>Unified Process (UP/RUP)</h3>
<p>Iterativ og inkrementell, UML-sentrert. Fire <strong>faser</strong>: Inception → Elaboration → Construction → Transition, med <strong>disipliner</strong> (krav, design, implementasjon, test) som går på tvers.</p>

<h3>Det smidige manifestet (Agile Manifesto, 2001)</h3>
<p>Fire verdier — venstresiden vektes høyere, men begge har verdi:</p>
<ul>
<li><strong>Individer og samspill</strong> over prosesser og verktøy</li>
<li><strong>Fungerende programvare</strong> over omfattende dokumentasjon</li>
<li><strong>Samarbeid med kunden</strong> over kontraktsforhandling</li>
<li><strong>Respondere på endring</strong> over å følge en plan</li>
</ul>

<h3>Scrum</h3>
<p>Mest brukte smidige rammeverk. Arbeidet skjer i <strong>sprinter (sprints)</strong> på 1–4 uker.</p>
<div class="mermaid">
flowchart LR
  PB["Product Backlog"] --> SP["Sprint Planning"]
  SP --> SB["Sprint Backlog"]
  SB --> S["Sprint (1-4 uker)\\nDaglig standup"]
  S --> SR["Sprint Review"]
  SR --> RE["Retrospektiv"]
  RE --> SP
  S --> INC["Inkrement"]
</div>
<table>
<tr><th>Roller</th><th>Seremonier</th><th>Artefakter</th></tr>
<tr><td>Product Owner (prioriterer backlog)<br>Scrum Master (fasiliterer prosess)<br>Utviklingsteam</td>
<td>Sprint Planning<br>Daily Standup (15 min)<br>Sprint Review<br>Retrospektiv</td>
<td>Product Backlog<br>Sprint Backlog<br>Inkrement</td></tr>
</table>

<h3>Kanban</h3>
<p>Lean-basert flyt-metode. Visuelt board, <strong>begrenset arbeid under utførelse (WIP-limit)</strong> per kolonne for å unngå flaskehalser. Kontinuerlig flyt (ingen faste sprinter).</p>
<div class="mermaid">
flowchart LR
  T["To Do"] --> D["Doing (WIP-limit)"] --> R["Review"] --> Done["Done"]
</div>

<h3>Extreme Programming (XP)</h3>
<p>Praksiser: <strong>parprogrammering</strong>, <strong>testdrevet utvikling (TDD)</strong>, kontinuerlig integrasjon, refaktorering, enkel design, kollektivt eierskap.</p>

<h3>Lean software development</h3>
<p>Fra Toyota/lean manufacturing. 7 prinsipper: eliminer sløsing, bygg inn kvalitet, skap kunnskap, utsett beslutninger, lever raskt, respekter folk, optimaliser helheten. «Think big, act small, fail fast, learn rapidly».</p>

<h3>TDD-syklus (Red–Green–Refactor)</h3>
<div class="mermaid">
flowchart LR
  R["RED:\\nskriv test som feiler"] --> G["GREEN:\\nminimal kode som passerer"] --> F["REFACTOR:\\nrydd uten å endre oppførsel"] --> R
</div>

<div class="callout">
<strong>Eksamenstips:</strong> Du blir ofte bedt om å <em>sammenligne</em> (fossefall vs. smidig, Scrum vs. Kanban) og <em>begrunne</em> et metodevalg ut fra prosjekttype. Bruk konkrete eksempler og pek på trade-offs.
</div>
`
},

/* ============ TESTING ============ */
{
  topic: "testing",
  title: "Software-testing",
  examNote: "På alle 4 eksamener. Kunne testtyper og nivåer, black/white-box, TDD vs. BDD, automatisk vs. manuell, og CI.",
  html: `
<p><strong>Testing</strong> handler om å avdekke feil (defects) og verifisere at systemet oppfyller kravene. Mål: redusere risiko, ikke «bevise at alt er feilfritt».</p>

<h3>Testnivåer (test levels)</h3>
<div class="mermaid">
flowchart BT
  U["Enhetstest (unit) – én komponent"] --> I["Integrasjonstest – samspill mellom komponenter"]
  I --> S["Systemtest – hele systemet mot krav"]
  S --> A["Akseptansetest (acceptance) – kunden godkjenner"]
</div>
<p>Dette er ofte tegnet som en <strong>testpyramide</strong>: mange raske enhetstester nederst, færre dyre ende-til-ende-tester øverst.</p>

<h3>Black-box vs. white-box</h3>
<table>
<tr><th>Black-box</th><th>White-box</th></tr>
<tr><td>Tester mot spesifikasjon/oppførsel uten å kjenne koden. Eks.: ekvivalensklasser, grenseverdier.</td><td>Tester intern struktur/kode. Eks.: setnings- og grendekning (statement/branch coverage).</td></tr>
</table>

<h3>Andre testtyper</h3>
<ul>
<li><strong>Regresjonstest:</strong> sjekk at nye endringer ikke ødela det som virket.</li>
<li><strong>Smoke/sanity:</strong> rask sjekk av at hovedfunksjoner i det hele tatt virker.</li>
<li><strong>Utforskende test (exploratory):</strong> manuell, lærende testing uten forhåndsskrevne caser.</li>
<li><strong>Brukervennlighetstest (usability):</strong> ekte brukere løser oppgaver.</li>
<li><strong>Ytelse/last/stress (performance/load/stress)</strong> og <strong>spike-test:</strong> oppførsel under belastning.</li>
</ul>

<h3>TDD vs. BDD</h3>
<table>
<tr><th>TDD (Test-Driven Development)</th><th>BDD (Behavior-Driven Development)</th></tr>
<tr><td>Skriv test → kode → refaktorer. Fokus på funksjon/enhet. Teknisk språk.</td><td>Beskriv ønsket oppførsel i Given–When–Then. Fokus på forretningsverdi, felles språk med kunden.</td></tr>
</table>

<h3>Testspesifikasjon (struktur)</h3>
<ol>
<li>Navn/scenario og beskrivelse</li>
<li>Forhåndsbetingelser (preconditions)</li>
<li>Testdata</li>
<li>Steg (eksekvering)</li>
<li>Forventet resultat</li>
<li>Prioritet (høy/medium/lav)</li>
</ol>

<h3>Bug-rapport (struktur)</h3>
<p>Tittel · beskrivelse · <strong>steg for å reprodusere</strong> · forventet vs. faktisk resultat · vedlegg/skjermbilde · alvorlighetsgrad.</p>

<h3>Automatisert vs. manuell · CI</h3>
<p>Automatiske tester er <strong>deterministiske og repeterbare</strong> og kjøres ved hver endring i <strong>kontinuerlig integrasjon (CI)</strong> — sammen med smidig gir dette rask tilbakemelding. Manuell testing egner seg til utforskende og brukervennlighetstesting. <strong>Risk-poker</strong> brukes til å prioritere hvor mye man tester ut fra risiko.</p>

<div class="callout exam"><strong>Eksamenstips:</strong> Et klassisk spørsmål er å forklare forskjellen på enhets- og integrasjonstest, eller fordeler/utfordringer med TDD. Husk: TDD gir trygghet ved refaktorering, men krever disiplin og god testbar design.</div>
`
},

/* ============ ARKITEKTUR ============ */
{
  topic: "arkitektur",
  title: "Programvarearkitektur & design",
  examNote: "På alle 4 eksamener. Kunne arkitekturmønstre (lagdeling, mikrotjenester, MVC), samt kobling og kohesjon.",
  html: `
<p><strong>Programvarearkitektur (software architecture)</strong> er de grunnleggende, kostbare-å-endre beslutningene om struktur: hvilke hoveddeler systemet har og hvordan de samhandler. God arkitektur tas tidlig fordi den er dyr å endre senere.</p>

<h3>Kobling & kohesjon</h3>
<ul>
<li><strong>Lav kobling (low coupling):</strong> moduler er lite avhengige av hverandre → lettere å endre/teste.</li>
<li><strong>Høy kohesjon (high cohesion):</strong> en modul gjør én ting godt → lettere å forstå.</li>
</ul>
<p>Mål: <em>lav kobling, høy kohesjon</em>.</p>

<h3>Trelagsarkitektur (three-tier / layered)</h3>
<div class="mermaid">
flowchart TD
  P["Presentasjon (UI)"] --> B["Forretningslogikk (business logic)"] --> D["Datalag (persistens/DB)"]
</div>
<p>Hvert lag snakker bare med laget under. Enkelt og utbredt; kan bli en «monolitt».</p>

<h3>MVC (Model–View–Controller)</h3>
<div class="mermaid">
flowchart LR
  U["Bruker"] --> C["Controller"]
  C --> M["Model (data/logikk)"]
  M --> V["View (visning)"]
  V --> U
  C --> V
</div>
<p>Skiller data (Model), visning (View) og styring (Controller) → gjenbrukbart og testbart UI.</p>

<h3>Monolitt vs. mikrotjenester</h3>
<table>
<tr><th></th><th>Monolitt</th><th>Mikrotjenester (microservices)</th></tr>
<tr><td>Struktur</td><td>Én distribuerbar enhet</td><td>Mange små, uavhengige tjenester</td></tr>
<tr><td>Fordeler</td><td>Enkel å utvikle/deploye i starten</td><td>Skalér deler uavhengig; team-autonomi; teknologifrihet; isolert feil</td></tr>
<tr><td>Ulemper</td><td>Vanskelig å skalere/endre når stor</td><td>Kompleks drift, nettverk, distribuerte transaksjoner, krever DevOps/CI/CD</td></tr>
</table>

<h3>Andre mønstre</h3>
<ul>
<li><strong>Klient–tjener (client–server)</strong></li>
<li><strong>Hendelsesdrevet (event-driven)</strong> – komponenter reagerer på hendelser</li>
<li><strong>Plugin / mikrokjerne</strong> – kjerne + utvidelser</li>
<li><strong>Peer-to-peer</strong> – likeverdige noder</li>
<li><strong>SOA</strong> – tjenesteorientert, forløper til mikrotjenester</li>
</ul>

<div class="callout exam"><strong>Eksamenstips:</strong> «Nevn 4 fordeler og 4 ulemper med mikrotjenester» er en gjenganger. Koble alltid arkitekturvalg til kvalitetsattributter (skalerbarhet, vedlikeholdbarhet, ytelse) og til organisasjonen (Conways lov).</div>
`
},

/* ============ UNIVERSELL UTFORMING ============ */
{
  topic: "uu",
  title: "Universell utforming & tilgjengelighet",
  examNote: "På alle 4 eksamener. Kunne argumentere for UU, WCAG/POUR, og de 7 prinsippene for universell utforming.",
  html: `
<p><strong>Universell utforming (universal design / accessibility)</strong> betyr å utforme produkter slik at de kan brukes av flest mulig, uten behov for tilpasning. I Norge er det <em>lovpålagt</em> for IKT-løsninger rettet mot allmennheten.</p>

<h3>Hvorfor universell utforming?</h3>
<ul>
<li><strong>Lovkrav</strong> (likestillings- og diskrimineringsloven, WCAG-forskrift)</li>
<li><strong>Inkludering</strong> – ~15–20 % har en form for funksjonsnedsettelse</li>
<li><strong>Bedre for alle</strong> – «curb-cut effect»: undertekster, kontrast, klart språk hjelper alle</li>
<li><strong>Forretning</strong> – større marked, bedre SEO/synlighet</li>
</ul>

<h3>WCAG – POUR-prinsippene</h3>
<table>
<tr><th>Prinsipp</th><th>Betyr</th></tr>
<tr><td><strong>P</strong>erceivable (oppfattbar)</td><td>Innhold må kunne sanses – alt-tekst, kontrast, undertekster</td></tr>
<tr><td><strong>O</strong>perable (betjenbar)</td><td>Kan brukes med tastatur, nok tid, ingen blinking som gir anfall</td></tr>
<tr><td><strong>U</strong>nderstandable (forståelig)</td><td>Lesbart, forutsigbart, hjelp ved feil</td></tr>
<tr><td><strong>R</strong>obust</td><td>Virker med hjelpemidler (skjermlesere) og ulike nettlesere</td></tr>
</table>
<p>Samsvarsnivåer: <strong>A, AA, AAA</strong> (offentlig sektor i Norge krever AA).</p>

<h3>De 7 prinsippene for universell utforming</h3>
<ol>
<li>Like muligheter for bruk</li>
<li>Fleksibel i bruk</li>
<li>Enkel og intuitiv</li>
<li>Forståelig informasjon</li>
<li>Toleranse for feil</li>
<li>Lav fysisk anstrengelse</li>
<li>Størrelse og plass for tilgang og bruk</li>
</ol>

<div class="callout exam"><strong>Eksamenstips:</strong> Spørsmål ber ofte om å <em>argumentere</em> for hvorfor UU lønner seg, og å gi <em>konkrete tiltak</em> (kontrast, tastaturnavigasjon, alt-tekst, klart språk). Knytt gjerne til WCAG-nivå AA.</div>
`
},

/* ============ ETIKK & GDPR ============ */
{
  topic: "etikk",
  title: "Profesjonsetikk & personvern (GDPR)",
  examNote: "På alle 4 eksamener, ofte som case. Kunne GDPR-prinsipper/rettigheter, DPIA, og profesjonsetikk (NITO).",
  html: `
<p>Som systemutvikler har du et <strong>profesjonsetisk ansvar</strong> for konsekvensene av det du bygger – personvern, sikkerhet, rettferdighet og åpenhet.</p>

<h3>GDPR – grunnprinsipper</h3>
<ul>
<li><strong>Lovlighet, rettferdighet, åpenhet</strong></li>
<li><strong>Formålsbegrensning</strong> – data brukes bare til oppgitt formål</li>
<li><strong>Dataminimering</strong> – samle kun det nødvendige</li>
<li><strong>Riktighet</strong> – data skal være korrekte</li>
<li><strong>Lagringsbegrensning</strong> – slett når formålet er nådd</li>
<li><strong>Integritet og konfidensialitet</strong> – sikres mot uautorisert tilgang</li>
<li><strong>Ansvarlighet (accountability)</strong> – kunne dokumentere etterlevelse</li>
</ul>

<h3>Registrertes rettigheter</h3>
<p>Innsyn · retting · sletting («retten til å bli glemt») · dataportabilitet · begrensning · innsigelse · informasjon. Behandling krever et <strong>behandlingsgrunnlag</strong> (f.eks. samtykke, avtale, lovkrav).</p>

<h3>DPIA (Data Protection Impact Assessment)</h3>
<p>En <strong>personvernkonsekvensvurdering</strong> som kreves når en behandling sannsynligvis gir <em>høy risiko</em> for personvernet (f.eks. omfattende profilering, sensitive data, overvåking). Identifiserer risiko og tiltak <em>før</em> man starter.</p>

<div class="mermaid">
flowchart LR
  A["Vurder behandling"] --> B{"Høy risiko?"}
  B -- Ja --> C["Gjennomfør DPIA"]
  C --> D{"Restrisiko fortsatt høy?"}
  D -- Ja --> E["Forhåndsdrøfting med Datatilsynet"]
  D -- Nei --> F["Iverksett med tiltak"]
  B -- Nei --> F
</div>

<h3>Profesjonsetikk</h3>
<p>Retningslinjer (f.eks. <strong>NITO</strong>, ACM/IEEE) vektlegger: sett samfunnets og brukernes interesser først, vær ærlig om begrensninger, ivareta sikkerhet og kvalitet, unngå interessekonflikter. Etiske dilemmaer løses ved å veie hensyn mot hverandre og være åpen om valgene.</p>

<div class="callout exam"><strong>Eksamenstips:</strong> Case-oppgaver (f.eks. en app som samler mer data enn nødvendig) tester at du kan peke på <em>hvilke GDPR-prinsipper som brytes</em> og foreslå tiltak. Strukturer svaret: hva er problemet → hvilket prinsipp/rettighet → hva bør gjøres.</div>
`
},

/* ============ MMI / INTERAKSJONSDESIGN ============ */
{
  topic: "mmi",
  title: "Menneske–maskin-interaksjon & interaksjonsdesign",
  examNote: "På alle 4 eksamener. Kunne Don Normans designprinsipper, brukervennlighet, og prototyping.",
  html: `
<p><strong>Interaksjonsdesign (interaction design, IxD)</strong> handler om å designe interaktive produkter som støtter måten folk kommuniserer og samhandler på. <strong>MMI/HCI</strong> er det tverrfaglige feltet (psykologi, design, informatikk) rundt dette.</p>

<h3>Don Normans designprinsipper</h3>
<table>
<tr><th>Prinsipp</th><th>Betyr</th></tr>
<tr><td><strong>Synlighet (visibility)</strong></td><td>Du ser hvilke handlinger som er mulige</td></tr>
<tr><td><strong>Tilbakemelding (feedback)</strong></td><td>Systemet bekrefter hva som skjer</td></tr>
<tr><td><strong>Begrensninger (constraints)</strong></td><td>Hindrer feil ved å begrense valg</td></tr>
<tr><td><strong>Mapping</strong></td><td>Naturlig sammenheng mellom kontroll og effekt</td></tr>
<tr><td><strong>Konsistens (consistency)</strong></td><td>Like ting oppfører seg likt</td></tr>
<tr><td><strong>Affordance</strong></td><td>Utseendet antyder bruken (en knapp ser trykkbar ut)</td></tr>
</table>

<h3>Brukervennlighet (usability) – mål</h3>
<p>Effektiv (effective), effektiv ressursbruk (efficient), trygg (safe), god nytte (utility), lett å lære (learnable), lett å huske (memorable). I tillegg kommer <strong>brukeropplevelse (UX)</strong>: tilfredsstillende, morsom, motiverende.</p>

<h3>Norman: handlings- og evalueringsgapet</h3>
<div class="mermaid">
flowchart LR
  M["Mål"] --> EX["Utfør handling\\n(gulf of execution)"]
  EX --> S["Systemets tilstand endres"]
  S --> EV["Oppfatt & tolk\\n(gulf of evaluation)"]
  EV --> M
</div>
<p>God design <em>minsker begge gap</em>: gjør det lett å vite hva man skal gjøre, og lett å forstå hva som skjedde.</p>

<h3>Prototyping</h3>
<p>Formål: <strong>teste idéer tidlig, få tilbakemelding, dele forståelse, kommunisere</strong> — billig før man bygger.</p>
<ul>
<li><strong>Low-fidelity:</strong> skisser, papir, wireframes (Balsamiq) – raskt og billig</li>
<li><strong>High-fidelity:</strong> interaktivt, nær ferdig produkt – realistisk, men dyrere</li>
</ul>

<div class="callout exam"><strong>Eksamenstips:</strong> Du kan bli bedt om å vurdere et reelt grensesnitt (f.eks. en nettside) opp mot Normans prinsipper, eller forklare hva prototyping er <em>for</em>. Bruk konkrete eksempler på synlighet/feedback.</div>
`
},

/* ============ UML ============ */
{
  topic: "uml",
  title: "UML – modellering",
  examNote: "På 2 av 4 eksamener. Du må kunne tolke OG tegne use case-, domene-/klasse- og sekvensdiagram. Se også egen UML-øving.",
  html: `
<p><strong>UML (Unified Modeling Language)</strong> er et standardisert visuelt språk for å modellere systemer. Diagrammene deles i <em>strukturdiagrammer</em> (klasse, objekt, komponent) og <em>oppførselsdiagrammer</em> (use case, sekvens, aktivitet, tilstand).</p>

<h3>Use case-diagram (brukstilfeller)</h3>
<p>Viser hva systemet skal gjøre sett fra <strong>aktører (actors)</strong>. <code>«include»</code> = obligatorisk delfunksjon; <code>«extend»</code> = valgfri utvidelse under en betingelse. Aktører kan ha generalisering (arv).</p>
<div class="mermaid">
flowchart LR
  K(("Kunde"))
  subgraph System
    R(["Reservere bord"])
    A(["Sjekke ledig kapasitet"])
    Av(["Avbestille"])
  end
  K --> R
  K --> Av
  R -. "«include»" .-> A
</div>

<h3>Klassediagram & domenemodell</h3>
<p>En <strong>domenemodell (domain model)</strong> er konseptuell – entiteter og forhold, <em>uten</em> ID-er eller databasedetaljer. Et klassediagram kan også vise attributter, metoder og synlighet (<code>+</code> public, <code>-</code> private, <code>#</code> protected).</p>
<table>
<tr><th>Relasjon</th><th>Notasjon</th><th>Betydning</th></tr>
<tr><td>Assosiasjon</td><td>strek</td><td>kjenner til / bruker</td></tr>
<tr><td>Aggregering</td><td>hvit diamant ◇</td><td>«har-en», deler kan eksistere uavhengig</td></tr>
<tr><td>Komposisjon</td><td>fylt diamant ◆</td><td>«består-av», deler dør med helheten</td></tr>
<tr><td>Arv/generalisering</td><td>åpen trekantpil ▷</td><td>«er-en»</td></tr>
<tr><td>Avhengighet</td><td>stiplet pil</td><td>bruker midlertidig</td></tr>
</table>
<p><strong>Multiplisitet (multiplicity):</strong> <code>1</code>, <code>0..1</code>, <code>*</code>, <code>1..*</code>.</p>
<div class="mermaid">
classDiagram
  class Restaurant
  class Bord
  class Reservasjon
  class Kunde
  Restaurant "1" *-- "*" Bord : består av
  Kunde "1" -- "*" Reservasjon : foretar
  Reservasjon "*" -- "1" Bord : gjelder
</div>

<h3>Sekvensdiagram</h3>
<p>Viser meldinger mellom deltakere <em>over tid</em> (tid går nedover). Heltrukne piler = kall, stiplede = retur. Rammer: <code>loop</code>, <code>opt</code> (if), <code>alt</code> (if/else).</p>
<div class="mermaid">
sequenceDiagram
  actor Kunde
  participant Nettbutikk
  participant Betaling
  Kunde->>Nettbutikk: bestill(varer)
  Nettbutikk->>Betaling: betal(beløp)
  Betaling-->>Nettbutikk: ok
  Nettbutikk-->>Kunde: ordrebekreftelse
</div>

<h3>Aktivitets- og tilstandsdiagram</h3>
<ul>
<li><strong>Aktivitetsdiagram:</strong> arbeidsflyt. Startnode (●), beslutning (◇), fork/join (parallell), sluttnode (◉). Swimlanes viser hvem som gjør hva.</li>
<li><strong>Tilstandsdiagram:</strong> objektets tilstander og overganger utløst av hendelser.</li>
</ul>

<div class="callout exam"><strong>Eksamenstips:</strong> Vanlige feil: glemme systemgrense/aktør i use case, forveksle aggregering/komposisjon, glemme returmeldinger i sekvensdiagram, og blande domenemodell med implementasjon. Øv på å tegne for hånd!</div>
`
},

/* ============ BRUKERSENTRERT DESIGN ============ */
{
  topic: "brukersentrert",
  title: "Brukersentrert systemutvikling & evaluering",
  examNote: "Inngår i MMI/design-oppgaver. Kunne personas, scenarier, og evalueringsmetoder.",
  html: `
<p><strong>Brukersentrert design (user-centered design, UCD)</strong> setter brukerne i sentrum gjennom hele prosessen. Iterativt: forstå brukere → design → prototyp → evaluer → gjenta.</p>
<div class="mermaid">
flowchart LR
  A["Forstå brukere & kontekst"] --> B["Spesifiser krav"]
  B --> C["Design / prototyp"]
  C --> D["Evaluer med brukere"]
  D --> A
</div>

<h3>Personas & scenarier</h3>
<ul>
<li><strong>Persona:</strong> en oppdiktet, men realistisk brukerprofil (mål, behov, ferdigheter, frustrasjoner) som representerer en brukergruppe.</li>
<li><strong>Scenario:</strong> en fortelling om hvordan en persona bruker systemet for å nå et mål.</li>
<li><strong>Brukerhistorie (user story):</strong> «Som ⟨rolle⟩ vil jeg ⟨mål⟩ slik at ⟨verdi⟩.»</li>
</ul>

<h3>Evaluering</h3>
<p>Systematisk innsamling og vurdering av hvor godt designet fungerer. <strong>Formativ</strong> evaluering skjer underveis (forbedre), <strong>summativ</strong> til slutt (bedømme).</p>
<table>
<tr><th>Med brukere</th><th>Uten brukere (eksperter/modeller)</th></tr>
<tr><td>Brukervennlighetstest, observasjon, intervju, spørreskjema, A/B-test, feltstudie</td><td>Heuristisk evaluering, kognitiv gjennomgang (walkthrough), modeller (GOMS, HTA)</td></tr>
</table>

<h3>Heuristisk evaluering</h3>
<p>Eksperter vurderer grensesnittet mot et sett heuristikker (f.eks. <strong>Nielsens 10</strong>: synlighet av systemstatus, samsvar med virkeligheten, brukerkontroll, konsistens, feilforebygging, gjenkjenning fremfor hukommelse, fleksibilitet, minimalistisk design, hjelp ved feil, hjelp/dokumentasjon). Billig og raskt, men fanger ikke alt ekte brukere ville møtt.</p>

<div class="callout exam"><strong>Eksamenstips:</strong> Vit forskjellen på <em>brukertesting</em> (ekte brukere) og <em>heuristisk/ekspertevaluering</em>, og når hver passer. Personas + scenarier brukes for å holde fokus på brukerne i designvalg.</div>
`
},

/* ============ SYSTEMUTVIKLINGSPROSESSEN ============ */
{
  topic: "prosess",
  title: "Systemutviklingsprosessen",
  examNote: "Grunnlag for resten. Kunne fasene og hva prosjektplanlegging (visjon, risiko) innebærer.",
  html: `
<p><strong>Systemutvikling</strong> er prosessen med å analysere, designe, bygge, teste og vedlikeholde et programvaresystem som dekker et behov. Uansett metodikk gjennomgår man de samme grunnaktivitetene – forskjellen er <em>rekkefølge og iterasjon</em>.</p>
<div class="mermaid">
flowchart LR
  A["Planlegging"] --> B["Kravinnhenting & analyse"]
  B --> C["Design"] --> D["Implementasjon"]
  D --> E["Testing"] --> F["Drift & vedlikehold"]
</div>

<h3>Kravinnhenting (requirements)</h3>
<ul>
<li><strong>Funksjonelle krav:</strong> hva systemet skal gjøre.</li>
<li><strong>Ikke-funksjonelle krav:</strong> kvalitet – ytelse, sikkerhet, brukervennlighet, tilgjengelighet.</li>
<li>Teknikker: intervju, observasjon, workshops, prototyping, use cases.</li>
</ul>

<h3>Prosjektplanlegging</h3>
<ul>
<li><strong>Visjonsdokument:</strong> hvorfor prosjektet finnes, mål, omfang, interessenter.</li>
<li><strong>Risikoanalyse:</strong> identifiser risiko, vurder sannsynlighet × konsekvens, planlegg tiltak.</li>
<li><strong>Estimering:</strong> tid/ressurser; i smidig brukes story points og velocity.</li>
<li><strong>Interessenter (stakeholders):</strong> alle som påvirkes av eller påvirker systemet.</li>
</ul>

<div class="callout"><strong>Eksamenstips:</strong> Forstå at metodevalg styrer <em>hvordan</em> disse aktivitetene organiseres (alt på forhånd i fossefall vs. iterativt i smidig).</div>
`
},

/* ============ DATABASER (JDBC) ============ */
{
  topic: "databaser",
  title: "Databaser i systemutvikling (JDBC)",
  examNote: "Lavt vektet på SU-eksamen, men greit å kjenne JDBC-flyten og CRUD.",
  html: `
<p>I systemutvikling lagres data ofte i en <strong>relasjonsdatabase</strong>. Fra Java brukes <strong>JDBC (Java Database Connectivity)</strong> som standard-API for å snakke med databasen.</p>

<h3>JDBC-komponenter</h3>
<ul>
<li><strong>DriverManager</strong> – oppretter forbindelse</li>
<li><strong>Connection</strong> – selve forbindelsen til databasen</li>
<li><strong>Statement / PreparedStatement</strong> – sender SQL (bruk <code>PreparedStatement</code> for å unngå SQL-injeksjon)</li>
<li><strong>ResultSet</strong> – resultatet av en spørring, itereres rad for rad</li>
</ul>

<div class="mermaid">
sequenceDiagram
  participant App
  participant DriverManager
  participant Connection
  participant DB
  App->>DriverManager: getConnection(url, bruker, pw)
  DriverManager-->>App: Connection
  App->>Connection: prepareStatement(SQL)
  Connection-->>App: PreparedStatement
  App->>DB: executeQuery()
  DB-->>App: ResultSet
</div>

<h3>CRUD</h3>
<p><strong>C</strong>reate (INSERT) · <strong>R</strong>ead (SELECT) · <strong>U</strong>pdate (UPDATE) · <strong>D</strong>elete (DELETE). Husk å lukke ressurser (try-with-resources).</p>

<div class="callout"><strong>Eksamenstips:</strong> Hvis databaser dukker opp, handler det oftest om å koble systemdesign til lagring og å bruke <code>PreparedStatement</code> for sikkerhet.</div>
`
}

];
