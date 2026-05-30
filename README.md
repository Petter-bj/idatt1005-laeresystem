# Læresystem – IDATT1005 Systemutvikling

Et offline, interaktivt læresystem for eksamensforberedelse i **IDATT1005 Systemutvikling** (NTNU).
En **lokal nettapp** i ren HTML/CSS/JS – ingen installasjon, ingen rammeverk, ingen byggesteg.

**▶ Prøv den live:** <https://petter-bj.github.io/idatt1005-laeresystem/>

> Uoffisielt studiehjelpemiddel laget av en student. Innholdet er destillert fra pensum og må ikke regnes som fasit.

## Kom i gang

**Alternativ 1 – bare åpne den:** last ned mappa og dobbeltklikk `index.html`. Funker helt offline.

**Alternativ 2 – via GitHub Pages:** åpne <https://petter-bj.github.io/idatt1005-laeresystem/>.
Merk: den hostede versjonen kjører alt **unntatt** Claude-funksjonene (se under).

## Funksjoner

- **Lær** – konsise temasammendrag for alle 10 temaer, med diagrammer (Mermaid) og eksamensrelevans
- **Quiz** – 185 spørsmål (119 flervalg + 66 åpne fritekst, rettes av Claude når broen kjører): ta en runde på 5 med fasit og forklaring, eller en **endeløs drill** med tilfeldige spørsmål fra alle temaer til du avslutter
- **Flashcards** – 187 begreper med spaced repetition (Leitner-bokser)
- **UML-øving** – scenario → tegn selv → fasit
- **Eksamenstrening** – tidligere oppgaver med modellsvar + simulert eksamen på tid
- **Fremdriftssporing** og nedtelling til eksamen (lagres i nettleseren)
- Lys/mørk modus, responsivt (mobilvennlig), tastaturnavigasjon

## AI-funksjoner (valgfritt – kun lokalt)

Appen kan kobles til **Claude Code** for å rette fritekstsvar og for en kontekst-bevisst chat-assistent.
Dette krever at du kjører den lille lokale «broen», og fungerer **ikke** på GitHub Pages (statisk hosting).

```bash
node bridge.js
# åpne http://localhost:8787
```

Krever [Claude Code](https://claude.com/claude-code) (`claude`-CLI) installert og innlogget, samt Node.js.
Broen kaller `claude -p` lokalt, så den bruker din egen Claude-innlogging – ingen API-nøkler i koden.

## Teknologi

- Frontend: vanilla **HTML/CSS/JS** (ingen rammeverk/byggesteg), single-page app
- Diagrammer: **Mermaid.js** (vendet lokalt for offline)
- Lagring: nettleserens **localStorage**
- Valgfri AI-bro: liten **Node.js**-server (kun standardbibliotek) som kaller Claude Code-CLI-en

## Struktur

```
index.html        app-skall
css/styles.css    designsystem
js/               app-logikk (app, quiz, flashcards, uml, exam, progress, chat) + mermaid
data/             alt innhold (summaries, quizzes, flashcards, uml, exams) – lett å utvide
fonts/            Space Grotesk (display-font)
bridge.js         valgfri lokal bro for Claude-retting/chat
```
