/* UML-øvelser. Skjema:
   { id, topic:"uml", type, title, prompt, hints:[...], solution:"<mermaid>", explanation:"<html>" }
   solution = ren Mermaid-kode. Utvid fritt. */
window.APP_DATA = window.APP_DATA || {};
window.APP_DATA.umlExercises = [

{
  id:"u1", topic:"uml", type:"Use case-diagram",
  title:"Restaurant – reservasjonssystem",
  prompt:"En restaurant trenger et system der <strong>kunder</strong> kan reservere og avbestille bord. Når man reserverer, sjekker systemet <em>alltid</em> ledig kapasitet. En <strong>resepsjonist</strong> registrerer ankomst og ser oversikt over reservasjoner, mens en <strong>hovmester</strong> registrerer drop-in-gjester. Drop-in er en valgfri utvidelse av å registrere ankomst. Resepsjonist og hovmester er begge ansatte. Tegn use case-diagrammet.",
  hints:[
    "Tegn systemgrensen (rektangel) rundt alle use case-ene; aktørene står utenfor.",
    "«include» = delfunksjon som ALLTID utføres (reservere inkluderer alltid å sjekke kapasitet).",
    "«extend» = valgfri utvidelse under en betingelse (drop-in utvider ankomst).",
    "Resepsjonist og hovmester kan generaliseres til aktøren «Ansatt» (arv)."
  ],
  solution:`flowchart LR
  Kunde(("Kunde"))
  Resepsjonist(("Resepsjonist"))
  Hovmester(("Hovmester"))
  Ansatt(("Ansatt"))
  Resepsjonist -->|«er en»| Ansatt
  Hovmester -->|«er en»| Ansatt
  subgraph Restaurantsystem
    UC1(["Reservere bord"])
    UC2(["Avbestille reservasjon"])
    UC3(["Registrere ankomst"])
    UC4(["Registrere drop-in"])
    UC5(["Vise reservasjoner"])
    Cap(["Sjekke ledig kapasitet"])
  end
  Kunde --> UC1
  Kunde --> UC2
  Resepsjonist --> UC3
  Resepsjonist --> UC5
  Hovmester --> UC4
  UC1 -. "«include»" .-> Cap
  UC4 -. "«extend»" .-> UC3`,
  explanation:"Aktørene står utenfor systemgrensen. <strong>«include»</strong> peker fra basis-use casen til den inkluderte og betyr at delfunksjonen ALLTID utføres (Reservere bord inkluderer alltid å sjekke ledig kapasitet). <strong>«extend»</strong> peker fra utvidelsen til basis og er valgfri (Registrere drop-in utvider Registrere ankomst). Generaliseringen viser at resepsjonist og hovmester begge er ansatte. Merk: «logge inn» modelleres normalt som en <em>forutsetning</em>, ikke som include. (Mermaid mangler ekte use case-notasjon, så use case-ene vises som ovaler/stadion-former – på papir tegner du dem som ovaler, og generalisering som en pil med åpen trekant.)"
},

{
  id:"u2", topic:"uml", type:"Domenemodell",
  title:"Restaurant – domenemodell",
  prompt:"Lag en <strong>domenemodell</strong> (konseptuelt klassediagram) for restauranten: en restaurant har flere bord, en kunde kan ha flere reservasjoner, og hver reservasjon gjelder ett bord. Ta med sentrale attributter, men ingen ID-felter eller metoder.",
  hints:[
    "Domenemodell = entiteter + forhold, uten databasedetaljer/ID-er.",
    "Tenk på multiplisitet: hvor mange bord per restaurant? Hvor mange reservasjoner per kunde?",
    "Komposisjon (fylt diamant): bord er en del av restauranten."
  ],
  solution:`classDiagram
  class Restaurant {
    +navn
    +adresse
  }
  class Bord {
    +nummer
    +antallPlasser
  }
  class Kunde {
    +navn
    +telefon
  }
  class Reservasjon {
    +dato
    +tidspunkt
    +antallGjester
  }
  Restaurant "1" *-- "1..*" Bord : har
  Kunde "1" -- "0..*" Reservasjon : foretar
  Reservasjon "*" -- "1" Bord : gjelder`,
  explanation:"Det finnes ikke én fasit – flere modeller kan være riktige. Poenget er logiske entiteter og riktig multiplisitet. Merk komposisjonen (fylt diamant) mellom Restaurant og Bord: bordene tilhører restauranten. Ingen ID-felter eller metoder, fordi dette er en <em>konseptuell</em> modell."
},

{
  id:"u3", topic:"uml", type:"Sekvensdiagram",
  title:"Sekvensdiagram – tre klasser",
  prompt:"KlasseA har en referanse til KlasseB, som har en referanse til KlasseC. Når <code>A.start()</code> kalles, kaller A metoden <code>beregn()</code> på B, som igjen kaller <code>hentData()</code> på C. Resultatene returneres tilbake oppover. Tegn sekvensdiagrammet med returmeldinger.",
  hints:[
    "Tid går nedover. Heltrukken pil = kall, stiplet pil = retur.",
    "Husk å ta med returmeldingene (en vanlig glipp på eksamen).",
    "Aktiveringsbokser viser når et objekt er aktivt."
  ],
  solution:`sequenceDiagram
  participant A as KlasseA
  participant B as KlasseB
  participant C as KlasseC
  A->>B: beregn()
  activate B
  B->>C: hentData()
  activate C
  C-->>B: data
  deactivate C
  B-->>A: resultat
  deactivate B`,
  explanation:"Meldingene kalles nedover og returneres som stiplede piler. Nestingen (A→B→C) vises ved at C returnerer før B returnerer til A. Aktiveringsboksene (activate/deactivate) viser hvor lenge hvert objekt jobber."
},

{
  id:"u4", topic:"uml", type:"System-sekvensdiagram",
  title:"Nettbutikk – kjøpsflyt",
  prompt:"Tegn et system-sekvensdiagram for et kjøp: en <strong>kunde</strong> legger varer i handlekurven og går til kassen. Systemet sjekker beholdning for <em>hver</em> vare i lageret, og forsøker så betaling. Hvis betaling godkjennes, sendes en ordrebekreftelse; hvis ikke, vises en feilmelding.",
  hints:[
    "Bruk en <code>loop</code>-ramme for «for hver vare».",
    "Bruk en <code>alt</code>-ramme for betaling ok / feiler.",
    "På systemnivå viser du systemet som én deltaker pluss eksterne systemer."
  ],
  solution:`sequenceDiagram
  actor Kunde
  participant Butikk as Nettbutikk
  participant Lager
  participant Betaling
  Kunde->>Butikk: gåTilKasse()
  loop for hver vare
    Butikk->>Lager: sjekkBeholdning(vare)
    Lager-->>Butikk: tilgjengelig
  end
  Butikk->>Betaling: betal(beløp)
  alt betaling godkjent
    Betaling-->>Butikk: godkjent
    Butikk-->>Kunde: ordrebekreftelse
  else betaling feiler
    Betaling-->>Butikk: avvist
    Butikk-->>Kunde: feilmelding
  end`,
  explanation:"<code>loop</code>-rammen gjentar beholdningssjekken per vare. <code>alt</code>-rammen viser de to utfallene av betalingen. Eksterne systemer (Lager, Betaling) er egne deltakere – nyttig for å vise integrasjoner."
},

{
  id:"u5", topic:"uml", type:"Klassediagram",
  title:"Biblioteksystem – relasjoner",
  prompt:"Modellér et biblioteksystem som klassediagram. Et bibliotek består av hyller. En hylle inneholder materiale. Materiale er enten <strong>Bok</strong> eller <strong>Tidsskrift</strong> (arv). Et medlem kan ha flere lån, og hvert lån gjelder ett materiale. Vis arv, komposisjon og aggregering.",
  hints:[
    "Arv/generalisering: åpen trekantpil fra subklasse mot superklasse.",
    "Komposisjon (fylt diamant): hyllene dør med biblioteket.",
    "Aggregering (hvit diamant): materiale kan flyttes mellom hyller, eksisterer uavhengig."
  ],
  solution:`classDiagram
  class Materiale {
    +tittel
    +utgivelsesår
  }
  class Bok {
    +forfatter
    +isbn
  }
  class Tidsskrift {
    +utgave
  }
  class Bibliotek
  class Hylle
  class Medlem
  class Laan
  Materiale <|-- Bok
  Materiale <|-- Tidsskrift
  Bibliotek "1" *-- "*" Hylle : består av
  Hylle "1" o-- "*" Materiale : inneholder
  Medlem "1" -- "*" Laan : har
  Laan "*" -- "1" Materiale : gjelder`,
  explanation:"Arv vises med <code>&lt;|--</code> (Bok og Tidsskrift er Materiale). <strong>Komposisjon</strong> <code>*--</code> mellom Bibliotek og Hylle (sterk eierskap). <strong>Aggregering</strong> <code>o--</code> mellom Hylle og Materiale (svakere – materiale kan flyttes). Lån knytter medlem og materiale sammen."
},

{
  id:"u6", topic:"uml", type:"Use case-diagram",
  title:"Biblioteksystem – use case",
  prompt:"Tegn use case-diagram for biblioteket: et <strong>medlem</strong> kan søke etter bøker, låne, reservere og levere. En <strong>bibliotekar</strong> sender purringer. Å låne en bok inkluderer <em>alltid</em> å registrere utlånet. Mens man søker, kan man <em>valgfritt</em> reservere boka dersom den er utlånt.",
  hints:[
    "Tegn systemgrensen rundt use case-ene; aktørene (Medlem, Bibliotekar) står utenfor.",
    "«include» = utføres alltid: Låne bok inkluderer Registrere utlån.",
    "«extend» = valgfritt under en betingelse: Reservere bok utvider Søke etter bok."
  ],
  solution:`flowchart LR
  Medlem(("Medlem"))
  Bibliotekar(("Bibliotekar"))
  subgraph Biblioteksystem
    S(["Søke etter bok"])
    L(["Låne bok"])
    R(["Reservere bok"])
    Lev(["Levere bok"])
    Reg(["Registrere utlån"])
    P(["Sende purring"])
  end
  Medlem --> S
  Medlem --> L
  Medlem --> R
  Medlem --> Lev
  Bibliotekar --> P
  L -. "«include»" .-> Reg
  R -. "«extend»" .-> S`,
  explanation:"<strong>«include»</strong>: å låne en bok fører alltid til at utlånet registreres, derfor inkluderer «Låne bok» alltid «Registrere utlån» (pil fra basis til inkludert). <strong>«extend»</strong>: «Reservere bok» er en valgfri utvidelse av «Søke etter bok» (pil fra utvidelsen til basis), aktuell når boka er utlånt. Purring utføres av bibliotekaren. Tegn use case-ene som ovaler på papir."
},

{
  id:"u7", topic:"uml", type:"Aktivitetsdiagram",
  title:"Aktivitetsdiagram – netthandel",
  prompt:"Tegn et aktivitetsdiagram for handleflyten: brukeren legger varer i kurven (kan gjentas), går til kassen, logger inn hvis ikke innlogget, og betaler. Hvis betalingen feiler, går flyten tilbake til kassen. Ved suksess sendes en bekreftelse.",
  hints:[
    "Startnode (fylt sirkel), beslutninger som rombe (◇), sluttnode (sirkel med ring).",
    "En beslutning kan ha en løkke tilbake (flere varer / betaling feiler).",
    "Bruk tydelige betingelser på beslutningsgrenene."
  ],
  solution:`flowchart TD
  Start((Start)) --> A["Legg vare i kurv"]
  A --> B{"Flere varer?"}
  B -- Ja --> A
  B -- Nei --> C["Gå til kassen"]
  C --> D{"Logget inn?"}
  D -- Nei --> E["Logg inn"]
  E --> F["Betal"]
  D -- Ja --> F
  F --> G{"Betaling ok?"}
  G -- Ja --> H["Send bekreftelse"]
  G -- Nei --> C
  H --> Slutt((Slutt))`,
  explanation:"Beslutningsromber styrer flyten: løkken «Flere varer?» og feilhåndteringen «Betaling ok?» som går tilbake til kassen. Start- og sluttnode markerer flytens begynnelse og slutt. På papir tegner du beslutninger som rombe og start/slutt som henholdsvis fylt sirkel og sirkel-med-ring."
},

{
  id:"u8", topic:"uml", type:"Tilstandsdiagram",
  title:"Tilstandsdiagram – ordre",
  prompt:"Modellér livssyklusen til en ordre som tilstandsdiagram: en ordre opprettes, betales, sendes og leveres. En ordre kan kanselleres før den er sendt; en betalt ordre som kanselleres skal refunderes.",
  hints:[
    "Starttilstand fra [*]; sluttilstand til [*].",
    "Overganger merkes med hendelsen som utløser dem.",
    "Tenk på hvilke tilstander som tillater kansellering."
  ],
  solution:`stateDiagram-v2
  [*] --> Opprettet
  Opprettet --> Betalt : betaling mottatt
  Betalt --> Sendt : pakket og sendt
  Sendt --> Levert : mottatt av kunde
  Levert --> [*]
  Opprettet --> Kansellert : avbrutt
  Betalt --> Refundert : kansellert
  Kansellert --> [*]
  Refundert --> [*]`,
  explanation:"Hver pil er en overgang utløst av en hendelse. Merk at kansellering er mulig fra ulike tilstander, men en <em>betalt</em> ordre går til «Refundert» i stedet for rett til «Kansellert». Start ([*]) og to sluttilstander viser de mulige avslutningene."
}

];
