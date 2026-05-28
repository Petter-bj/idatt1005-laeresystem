/* Lokal "bro" mellom læresystemet og Claude Code.
 *
 * Hva den gjør:
 *  - Serverer appen på http://localhost:8787
 *  - Tar imot tekstsvar fra appen og kjører `claude -p` (Claude Code, headless)
 *    for å rette dem. Bruker Claude Code-innloggingen din (abonnement), ikke API-en.
 *
 * Start:  node bridge.js     (eller dobbeltklikk start-med-retting.command)
 * Krever: Node.js + Claude Code CLI (`claude`) installert og innlogget.
 */
"use strict";
const http = require("http");
const fs = require("fs");
const path = require("path");
const { execFile } = require("child_process");

const ROOT = __dirname;
const PORT = process.env.PORT || 8787;
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png", ".jpg": "image/jpeg", ".ico": "image/x-icon"
};

function send(res, code, body, type) {
  res.writeHead(code, {
    "Content-Type": type || "text/plain; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type"
  });
  res.end(body);
}

function buildPrompt(q, model, ans) {
  return [
    "Du er sensor i emnet IDATT1005 Systemutvikling ved NTNU. Vurder studentens svar mot modellsvaret, ærlig og konstruktivt.",
    "Svar KORT på norsk, i nøyaktig dette formatet:",
    "Vurdering: <Riktig / Delvis riktig / Feil>",
    "Begrunnelse: <1-3 setninger om hva som er bra/galt>",
    "Mangler: <det viktigste studenten bør legge til, eller 'ingenting vesentlig'>",
    "",
    "Spørsmål: " + q,
    "Modellsvar: " + model,
    "Studentens svar: " + ans
  ].join("\n");
}

function buildChatPrompt(ctx, msgs) {
  const last = msgs[msgs.length - 1] || { text: "" };
  const history = msgs.slice(0, -1);
  const lines = [
    "Du er en vennlig og presis studieassistent for NTNU-emnet IDATT1005 Systemutvikling. Studenten forbereder seg til skriftlig eksamen 3. juni.",
    "Oppgaven din: svar KORT og konkret på norsk på studentens SISTE spørsmål nedenfor. Bruk gjerne punktlister, konkrete eksempler og fagbegreper (med engelsk term i parentes første gang). Hold deg til pensum i systemutvikling; si ifra hvis noe faller utenfor. Du kan quizze studenten hvis hen ber om det.",
    "Studenten er på en LÆRINGS-side (ikke en prøve), så gi gjerne fullstendige, direkte svar.",
    "",
    "KONTEKST – dette ser studenten på akkurat nå:",
    ctx || "(forsiden av læresystemet)"
  ];
  if (history.length) {
    lines.push("", "TIDLIGERE MELDINGER I SAMTALEN (bare bakgrunn):");
    history.forEach((m) => { lines.push("- " + (m.role === "user" ? "Student" : "Assistent") + ": " + String(m.text || "")); });
  }
  lines.push("", "STUDENTENS SISTE SPØRSMÅL (svar på dette):", String(last.text || ""));
  return lines.join("\n");
}

const server = http.createServer((req, res) => {
  if (req.method === "OPTIONS") return send(res, 204, "");
  const url = new URL(req.url, "http://localhost");

  if (url.pathname === "/api/health") {
    return send(res, 200, JSON.stringify({ ok: true }), TYPES[".json"]);
  }

  if (url.pathname === "/api/grade" && req.method === "POST") {
    let data = "";
    req.on("data", (c) => { data += c; if (data.length > 1e6) req.destroy(); });
    req.on("end", () => {
      let body;
      try { body = JSON.parse(data || "{}"); }
      catch (e) { return send(res, 400, JSON.stringify({ error: "Ugyldig forespørsel" }), TYPES[".json"]); }
      const q = String(body.question || "").slice(0, 4000);
      const model = String(body.modelAnswer || "").slice(0, 4000);
      const ans = String(body.userAnswer || "").slice(0, 8000);
      if (!ans.trim()) return send(res, 400, JSON.stringify({ error: "Tomt svar" }), TYPES[".json"]);

      // execFile med arg-array => trygt mot shell-injeksjon
      execFile("claude", ["-p", buildPrompt(q, model, ans)],
        { timeout: 120000, maxBuffer: 4 * 1024 * 1024, cwd: ROOT },
        (err, stdout, stderr) => {
          if (err) {
            const msg = (stderr || err.message || "claude-feil").toString().slice(0, 400);
            return send(res, 500, JSON.stringify({ error: msg }), TYPES[".json"]);
          }
          send(res, 200, JSON.stringify({ feedback: String(stdout).trim() }), TYPES[".json"]);
        });
    });
    return;
  }

  if (url.pathname === "/api/chat" && req.method === "POST") {
    let data = "";
    req.on("data", (c) => { data += c; if (data.length > 2e6) req.destroy(); });
    req.on("end", () => {
      let body;
      try { body = JSON.parse(data || "{}"); }
      catch (e) { return send(res, 400, JSON.stringify({ error: "Ugyldig forespørsel" }), TYPES[".json"]); }
      const ctx = String(body.context || "").slice(0, 6000);
      const msgs = Array.isArray(body.messages) ? body.messages.slice(-8).map((m) => ({
        role: m && m.role === "assistant" ? "assistant" : "user",
        text: String((m && m.text) || "").slice(0, 4000)
      })) : [];
      if (!msgs.length) return send(res, 400, JSON.stringify({ error: "Ingen melding" }), TYPES[".json"]);

      execFile("claude", ["-p", buildChatPrompt(ctx, msgs)],
        { timeout: 120000, maxBuffer: 4 * 1024 * 1024, cwd: ROOT },
        (err, stdout, stderr) => {
          if (err) {
            const msg = (stderr || err.message || "claude-feil").toString().slice(0, 400);
            return send(res, 500, JSON.stringify({ error: msg }), TYPES[".json"]);
          }
          send(res, 200, JSON.stringify({ reply: String(stdout).trim() }), TYPES[".json"]);
        });
    });
    return;
  }

  // Statiske filer (med vern mot path traversal)
  let p = decodeURIComponent(url.pathname);
  if (p === "/" || p === "") p = "/index.html";
  const filePath = path.normalize(path.join(ROOT, p));
  if (filePath !== ROOT && !filePath.startsWith(ROOT + path.sep)) return send(res, 403, "Forbudt");
  fs.readFile(filePath, (err, buf) => {
    if (err) return send(res, 404, "Ikke funnet");
    send(res, 200, buf, TYPES[path.extname(filePath)] || "application/octet-stream");
  });
});

server.listen(PORT, "127.0.0.1", () => {
  console.log("\n  Læresystem + Claude-retting kjører på  http://localhost:" + PORT);
  console.log("  Åpne den lenken i nettleseren. Avslutt med Ctrl+C.\n");
});
