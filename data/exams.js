/* Eksamensoppgaver (parafrasert fra tidligere eksamener IDATT1005/1002).
   Skjema: { id, examYear, topic, question, model:"<html>", sensor:[ "<html>", ... ] }
   Utvid fritt. */
window.APP_DATA = window.APP_DATA || {};
window.APP_DATA.examItems = [

/* ===== METODIKK ===== */
{
  id:"xme1", examYear:"V2020", topic:"metodikk",
  question:"Gjør rede for de fire verdiene i Det smidige manifestet, og forklar kort hva smidig utvikling innebærer.",
  model:"Manifestet verdsetter: (1) <strong>individer og samspill</strong> over prosesser og verktøy, (2) <strong>fungerende programvare</strong> over omfattende dokumentasjon, (3) <strong>kundesamarbeid</strong> over kontraktsforhandling, (4) <strong>respons på endring</strong> over å følge en plan. Begge sider har verdi, men venstresiden vektes høyere. Smidig utvikling er iterativ og inkrementell: man leverer i korte sykluser, får tilbakemelding tidlig og tilpasser seg endrede krav.",
  sensor:["Alle fire verdiparene nevnt korrekt","Forståelse av at begge sider har verdi","Knytter til iterativ/inkrementell levering og endringshåndtering"]
},
{
  id:"xme2", examYear:"V2023", topic:"metodikk",
  question:"Beskriv rollene, seremoniene og artefaktene i Scrum.",
  model:"<strong>Roller:</strong> Product Owner (prioriterer backlog/forretningsverdi), Scrum Master (fasiliterer prosessen, fjerner hindringer), Utviklingsteam (bygger inkrementet). <strong>Seremonier:</strong> Sprint Planning, Daily Standup (~15 min), Sprint Review (demo for interessenter), Retrospektiv (forbedre arbeidsmåten). <strong>Artefakter:</strong> Product Backlog, Sprint Backlog, Inkrement.",
  sensor:["De tre rollene med riktig ansvar","De fire seremoniene og hva de er til for","De tre artefaktene"]
},
{
  id:"xme3", examYear:"V2023", topic:"metodikk",
  question:"Sammenlign Scrum og Kanban. Når egner hver seg best?",
  model:"<strong>Scrum:</strong> tidsbokset i sprinter, faste roller og seremonier, planlegging per sprint. Passer når man kan planlegge i bolker og ønsker fast rytme. <strong>Kanban:</strong> kontinuerlig flyt, WIP-grenser, ingen faste sprinter eller roller. Passer ved uforutsigbart, innkommende arbeid (drift/support) og når man vil optimalisere flyt. Begge er smidige og visualiserer arbeid på et board.",
  sensor:["Sprint/timeboxing vs. kontinuerlig flyt","WIP-grenser i Kanban","Konkret vurdering av når hver passer"]
},
{
  id:"xme4", examYear:"V2020", topic:"metodikk",
  question:"Hva er Lean software development? Forklar minst tre av prinsippene.",
  model:"Lean stammer fra lean manufacturing (Toyota) og fokuserer på å levere maksimal verdi med minst mulig sløsing. Prinsipper bl.a.: <strong>eliminer sløsing</strong> (fjern alt som ikke gir verdi), <strong>bygg inn kvalitet</strong> (forebygg feil fremfor å teste dem bort), <strong>utsett beslutninger</strong> til siste ansvarlige øyeblikk, <strong>lever raskt</strong>, <strong>respekter folk</strong> og <strong>optimaliser helheten</strong>. Tankegang: «think big, act small, fail fast, learn rapidly».",
  sensor:["Kobling til lean manufacturing/verdi","Minst tre prinsipper forklart","Forståelse av sløsing/flyt"]
},

/* ===== TESTING ===== */
{
  id:"xte1", examYear:"V2023", topic:"testing",
  question:"Forklar forskjellen på enhetstesting, integrasjonstesting og systemtesting.",
  model:"<strong>Enhetstest:</strong> tester én isolert komponent (f.eks. en metode/klasse), ofte med mock/stub for avhengigheter – rask og presis feillokalisering. <strong>Integrasjonstest:</strong> tester at flere komponenter fungerer riktig sammen (f.eks. tjeneste mot database), fanger feil i grensesnittene. <strong>Systemtest:</strong> tester hele det integrerte systemet mot kravene, ende-til-ende.",
  sensor:["Riktig nivå/omfang for hver","Isolasjon i enhetstest (mock/stub)","Forståelse av at de utfyller hverandre (testpyramide)"]
},
{
  id:"xte2", examYear:"V2023", topic:"testing",
  question:"Hva er testdrevet utvikling (TDD)? Diskuter fordeler og utfordringer.",
  model:"TDD: skriv en test som feiler (<strong>Red</strong>), skriv minimal kode som får den til å passere (<strong>Green</strong>), <strong>refaktorer</strong> uten å endre oppførsel. <strong>Fordeler:</strong> sikkerhetsnett ved refaktorering, driver fram testbar/modulær design, dokumenterer forventet oppførsel, færre feil. <strong>Utfordringer:</strong> krever disiplin og kan kjennes treigt i starten, tester må vedlikeholdes, vanskelig for UI/eksterne avhengigheter, dårlige tester kan bli skjøre.",
  sensor:["Red–Green–Refactor korrekt","Minst to konkrete fordeler","Minst to realistiske utfordringer"]
},
{
  id:"xte3", examYear:"V2023", topic:"testing",
  question:"Forklar forskjellen på TDD og BDD.",
  model:"<strong>TDD</strong> er utviklerorientert og enhetsnært: tester driver design på teknisk nivå. <strong>BDD</strong> beskriver ønsket <em>oppførsel</em> i et felles, forretningsnært språk (Given–When–Then) som også ikke-tekniske interessenter forstår. BDD bygger på TDD-tankegangen, men flytter fokus fra «virker koden» til «gjør systemet det forretningen trenger».",
  sensor:["TDD = teknisk/enhetsnært","BDD = oppførsel + felles språk (Given-When-Then)","Forståelse av målgruppe/fokus"]
},
{
  id:"xte4", examYear:"V2020", topic:"testing",
  question:"Hvorfor er kontinuerlig integrasjon (CI) viktig, og hvordan henger det sammen med smidig utvikling?",
  model:"CI betyr at kode ofte (gjerne ved hver innsjekk) bygges og testes automatisk. Det gir <strong>rask tilbakemelding</strong>, avdekker integrasjonsfeil tidlig og holder hovedgrenen i en fungerende tilstand. Dette støtter smidig utvikling, som baserer seg på hyppige, små leveranser av fungerende programvare. Forutsetter automatiske, deterministiske tester.",
  sensor:["Automatisk bygg+test ved endringer","Rask tilbakemelding / tidlig feiloppdaging","Kobling til smidig (hyppige leveranser) og automatiserte tester"]
},

/* ===== ARKITEKTUR ===== */
{
  id:"xar1", examYear:"V2023", topic:"arkitektur",
  question:"Forklar begrepene høy kohesjon (high cohesion) og lav kobling (low coupling), og hvorfor de er ønskelige.",
  model:"<strong>Kohesjon</strong> er hvor samlet og fokusert ansvaret innad i en modul er; <strong>høy kohesjon</strong> betyr at modulen gjør én ting godt. <strong>Kobling</strong> er graden av avhengighet mellom moduler; <strong>lav kobling</strong> betyr at moduler er lite avhengige av hverandre. Sammen gir de kode som er lettere å forstå, endre, teste og gjenbruke, fordi en endring i én modul får små ringvirkninger.",
  sensor:["Korrekt definisjon av begge begreper","Mål: høy kohesjon + lav kobling","Begrunnelse: vedlikeholdbarhet/testbarhet/endringsvennlighet"]
},
{
  id:"xar2", examYear:"V2023", topic:"arkitektur",
  question:"Nevn fire fordeler og fire ulemper med en mikrotjenestearkitektur.",
  model:"<strong>Fordeler:</strong> uavhengig skalering av tjenester; uavhengig deploy (raskere leveranser); teknologifrihet per tjeneste; isolerte feil; team-autonomi. <strong>Ulemper:</strong> kompleks drift/infrastruktur; nettverkskommunikasjon (latens, feil); distribuerte transaksjoner og datakonsistens; krever moden DevOps/CI/CD; vanskeligere testing/feilsøking på tvers.",
  sensor:["Minst fire reelle fordeler","Minst fire reelle ulemper","Forståelse av trade-offs (ikke bare oppramsing)"]
},
{
  id:"xar3", examYear:"V2020", topic:"arkitektur",
  question:"Beskriv trelagsarkitektur og MVC-mønsteret, og hva som er hensikten med slik lagdeling.",
  model:"<strong>Trelagsarkitektur:</strong> presentasjon (UI) → forretningslogikk → datalag (persistens); hvert lag snakker bare med laget under. <strong>MVC:</strong> Model (data/logikk), View (visning), Controller (styrer input og kobler dem). <strong>Hensikt:</strong> separasjon av ansvar gir lav kobling, høy kohesjon, gjenbrukbart og testbart UI, og gjør systemet enklere å vedlikeholde og videreutvikle.",
  sensor:["Riktige lag/komponenter i rekkefølge","Skille ansvar (separation of concerns)","Fordeler: testbarhet/vedlikeholdbarhet/gjenbruk"]
},
{
  id:"xar4", examYear:"V2020", topic:"arkitektur",
  question:"Gi minst tre grunner til at man bør gjøre arkitektur- og designarbeid tidlig i et prosjekt.",
  model:"1) Arkitektur er <strong>dyr å endre senere</strong> – tidlige valg legger rammene. 2) Sikrer at <strong>kvalitetskrav</strong> (skalerbarhet, sikkerhet, ytelse, vedlikeholdbarhet) kan oppfylles. 3) <strong>Reduserer risiko</strong> og unngår kostbar omskriving. 4) Gir <strong>felles forståelse</strong> og struktur for teamet. 5) Organisasjonen former designet – jf. <strong>Conways lov</strong>: systemet speiler organisasjonens kommunikasjonsstruktur (historisk har også maskinvare påvirket programvaredesign).",
  sensor:["Minst tre gyldige grunner","Kobling til kvalitetsattributter og risiko","Forståelse av at arkitektur er kostbar å endre"]
},

/* ===== MMI ===== */
{
  id:"xmm1", examYear:"V2020", topic:"mmi",
  question:"Gjør rede for Don Normans designprinsipper, og illustrer minst tre med eksempler.",
  model:"Prinsippene: <strong>synlighet</strong> (mulige handlinger er synlige – f.eks. tydelige knapper), <strong>tilbakemelding</strong> (systemet bekrefter handling – f.eks. en lastespinner), <strong>begrensninger</strong> (hindrer feil – gråutet «Send» til skjema er gyldig), <strong>mapping</strong> (naturlig kontroll↔effekt – komfyrbrytere plassert som platene), <strong>konsistens</strong> (like ting oppfører seg likt), <strong>affordance</strong> (formen antyder bruk – en knapp ser trykkbar ut). God design minsker gapet mellom mål og handling/forståelse.",
  sensor:["Flere prinsipper korrekt forklart","Minst tre konkrete eksempler","Eventuelt kobling til gulf of execution/evaluation"]
},
{
  id:"xmm2", examYear:"V2020", topic:"mmi",
  question:"Hva er prototyping, og hvorfor brukes det? Skill mellom low-fidelity og high-fidelity.",
  model:"Prototyping er å lage tidlige modeller av et design for å <strong>teste idéer, få tilbakemelding, dele forståelse og kommunisere</strong> – billig før man bygger. <strong>Low-fidelity</strong> (skisser/papir/wireframes): raskt og billig, fint til tidlige idéer. <strong>High-fidelity</strong> (interaktivt, nær ferdig produkt): realistisk for brukertesting, men dyrere og tregere å endre.",
  sensor:["Formålet med prototyping (≥3 grunner)","Low-fi vs high-fi med trade-offs","Forståelse av iterativ utforsking før utvikling"]
},
{
  id:"xmm3", examYear:"V2020", topic:"mmi",
  question:"Forklar forskjellen på brukertesting og evaluering uten brukere (f.eks. heuristisk evaluering), og når hver passer.",
  model:"<strong>Brukertesting:</strong> ekte brukere løser oppgaver mens man observerer – avdekker reelle problemer og brukernes mentale modeller, men er mer ressurskrevende. <strong>Heuristisk/ekspertevaluering:</strong> eksperter vurderer mot heuristikker (f.eks. Nielsens 10) – raskt og billig, fanger mange feil tidlig, men ser ikke alt ekte brukere møter. Ofte kombineres de: ekspertvurdering tidlig, brukertest før lansering.",
  sensor:["Riktig beskrivelse av begge metoder","Når hver passer (tidlig vs. validering)","Styrker/svakheter ved hver"]
},

/* ===== UNIVERSELL UTFORMING ===== */
{
  id:"xuu1", examYear:"V2020", topic:"uu",
  question:"Argumenter for hvorfor universell utforming er viktig i systemutvikling.",
  model:"<strong>Lovkrav:</strong> UU er pålagt for IKT rettet mot allmennheten. <strong>Inkludering:</strong> en stor andel har funksjonsnedsettelser (varige, midlertidige eller situasjonsbestemte) og må få tilgang. <strong>Bedre for alle:</strong> «curb-cut»-effekten – kontrast, klart språk og undertekster hjelper alle. <strong>Forretning:</strong> større marked og bedre søkemotorsynlighet (SEO). Kort sagt: etisk riktig, lovpålagt og lønnsomt.",
  sensor:["Lovkrav nevnt","Inkludering/etikk","Nytte for alle + forretningsargument"]
},
{
  id:"xuu2", examYear:"V2023", topic:"uu",
  question:"Hva er WCAG, og hva står POUR-prinsippene for?",
  model:"WCAG (Web Content Accessibility Guidelines) er den internasjonale standarden for tilgjengelig web, med samsvarsnivåene A, AA og AAA (offentlig sektor i Norge krever AA). <strong>POUR:</strong> <strong>P</strong>erceivable (oppfattbar – alt-tekst, kontrast), <strong>O</strong>perable (betjenbar – tastatur, nok tid), <strong>U</strong>nderstandable (forståelig – lesbart, forutsigbart), <strong>R</strong>obust (virker med hjelpemidler/ulike nettlesere).",
  sensor:["WCAG forklart + nivåer A/AA/AAA","Alle fire POUR-prinsipper","Minst ett konkret tiltak per prinsipp er et pluss"]
},

/* ===== ETIKK & GDPR ===== */
{
  id:"xet1", examYear:"V2023", topic:"etikk",
  question:"Forklar sentrale prinsipper i GDPR og nevn minst fire rettigheter den registrerte har.",
  model:"<strong>Prinsipper:</strong> lovlighet/rettferdighet/åpenhet, formålsbegrensning, dataminimering, riktighet, lagringsbegrensning, integritet/konfidensialitet og ansvarlighet. <strong>Rettigheter:</strong> innsyn, retting, sletting («retten til å bli glemt»), dataportabilitet, begrensning, innsigelse og informasjon. All behandling krever et behandlingsgrunnlag (samtykke, avtale, lovkrav m.fl.).",
  sensor:["Flere prinsipper korrekt (særlig dataminimering/formålsbegrensning)","Minst fire rettigheter","Nevner behandlingsgrunnlag"]
},
{
  id:"xet2", examYear:"V2020", topic:"etikk",
  question:"Hva er en DPIA (personvernkonsekvensvurdering), og når kreves den?",
  model:"En DPIA er en systematisk vurdering av personvernrisiko ved en planlagt behandling, gjennomført <em>før</em> oppstart. Den kreves når behandlingen sannsynligvis medfører <strong>høy risiko</strong> for personers rettigheter – f.eks. storskala profilering, behandling av sensitive data eller systematisk overvåking. Den identifiserer risiko og tiltak; er restrisikoen fortsatt høy, skal Datatilsynet forhåndskonsulteres.",
  sensor:["DPIA = risikovurdering før behandling","Utløses av sannsynlig høy risiko (med eksempler)","Tiltak + ev. forhåndsdrøfting med Datatilsynet"]
},
{
  id:"xet3", examYear:"V2020", topic:"etikk",
  question:"CASE: En treningsapp samler kontinuerlig nøyaktig GPS-posisjon og deler data med tredjeparter for reklame, uten tydelig informasjon til brukeren. Drøft personvern- og etiske problemstillinger, og foreslå tiltak.",
  model:"<strong>Problemer:</strong> brudd på <em>dataminimering</em> (mer data enn nødvendig), <em>formålsbegrensning</em> (deling til reklame utover appens formål) og <em>åpenhet</em> (brukeren er ikke informert). Manglende gyldig samtykke for deling. Etisk: utnytter brukernes tillit og kan skade dem (sporing). <strong>Tiltak:</strong> samle kun nødvendig posisjon og kun ved aktiv bruk; innhent eksplisitt, informert samtykke for deling; vær åpen i personvernerklæring; sett lagringsbegrensning; vurder DPIA; gi brukeren kontroll (innsyn/sletting/innsigelse).",
  sensor:["Identifiserer konkrete GDPR-prinsipper som brytes","Drøfter etisk dimensjon (tillit/skade)","Konkrete, relevante tiltak knyttet til teori"]
},

/* ===== PROSESS ===== */
{
  id:"xpr1", examYear:"V2023", topic:"prosess",
  question:"Hva bør et visjonsdokument inneholde, og hvorfor er risikoanalyse viktig i prosjektplanlegging?",
  model:"<strong>Visjonsdokument:</strong> hvorfor prosjektet finnes (mål/hensikt), omfang og avgrensning, hovedfunksjonalitet på høyt nivå, interessenter og suksesskriterier. <strong>Risikoanalyse:</strong> identifiserer mulige problemer tidlig, vurderer dem etter sannsynlighet × konsekvens, og planlegger tiltak. Dette reduserer sjansen for kostbare overraskelser og hjelper med prioritering og ressursbruk.",
  sensor:["Sentrale elementer i visjonsdokument","Risiko = sannsynlighet × konsekvens + tiltak","Hvorfor: tidlig håndtering reduserer kostnad/risiko"]
},

/* ===== UML ===== */
{
  id:"xum1", examYear:"V2023", topic:"uml",
  question:"Forklar forskjellen på et use case-diagram og en domenemodell, og hva hver brukes til.",
  model:"Et <strong>use case-diagram</strong> viser <em>hva</em> systemet skal gjøre sett fra aktørene – funksjonene og hvem som bruker dem (krav/funksjonalitet). En <strong>domenemodell</strong> er en konseptuell modell av sentrale <em>begreper/entiteter</em> i problemområdet og forholdene mellom dem (uten ID-er, metoder eller databasedetaljer). Use case beskriver atferd/krav; domenemodellen beskriver struktur/begreper.",
  sensor:["Use case = funksjoner/aktører/krav","Domenemodell = konseptuelle entiteter + forhold","Domenemodell uten implementasjonsdetaljer"]
},

/* ===== BRUKERSENTRERT ===== */
{
  id:"xbs1", examYear:"V2020", topic:"brukersentrert",
  question:"Hva er personas og scenarier, og hvordan brukes de i brukersentrert utvikling?",
  model:"En <strong>persona</strong> er en oppdiktet, men realistisk brukerprofil (mål, behov, ferdigheter, frustrasjoner) som representerer en brukergruppe. Et <strong>scenario</strong> er en fortelling om hvordan en persona bruker systemet for å nå et mål. De brukes til å holde fokus på reelle brukere gjennom design, prioritere funksjonalitet, kommunisere behov i teamet og avdekke krav – kjernen i brukersentrert design.",
  sensor:["Korrekt definisjon av persona og scenario","Hvordan de styrer designvalg/krav","Kobling til brukersentrert/iterativ prosess"]
}

];
