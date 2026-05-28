/* Kjerne: ruting, hjem/dashboard, Lær-visning, tema, nedtelling, delte verktøy. */
(function () {
  "use strict";

  /* ===== Temaregister (vekt 3=høy/eksamensfavoritt, 2=medium, 1=lav) ===== */
  var TOPICS = [
    { id: "metodikk",     name: "Metodikk & Agile",        short: "Fossefall, Scrum, Kanban, XP, Lean, TDD", weight: 3 },
    { id: "testing",      name: "Testing",                 short: "Testtyper, TDD/BDD, black/white-box, CI", weight: 3 },
    { id: "arkitektur",   name: "Programvarearkitektur",   short: "Lagdeling, mikrotjenester, MVC, kobling/kohesjon", weight: 3 },
    { id: "uu",           name: "Universell utforming",    short: "WCAG, 7 prinsipper, tilgjengelighet", weight: 3 },
    { id: "etikk",        name: "Etikk & GDPR",            short: "Personvern, DPIA, profesjonsetikk", weight: 3 },
    { id: "mmi",          name: "Interaksjonsdesign (MMI)",short: "Don Norman, brukervennlighet, prototyping", weight: 3 },
    { id: "uml",          name: "UML",                     short: "Use case, klasse, sekvens, aktivitet, tilstand", weight: 2 },
    { id: "brukersentrert", name: "Brukersentrert design", short: "Personas, scenarier, evaluering", weight: 2 },
    { id: "prosess",      name: "Systemutviklingsprosessen", short: "Faser, krav, prosjektplanlegging", weight: 1 },
    { id: "databaser",    name: "Databaser (JDBC)",        short: "JDBC, CRUD, SQL i Java", weight: 1 }
  ];
  var EXAM_DATE = new Date("2026-06-03T09:00:00");

  /* ===== DOM-hjelper ===== */
  function append(el, c) {
    if (c == null || c === false) return;
    if (Array.isArray(c)) { c.forEach(function (x) { append(el, x); }); return; }
    if (c.nodeType) { el.appendChild(c); return; }
    el.appendChild(document.createTextNode(String(c)));
  }
  function h(tag, attrs, children) {
    var el = document.createElement(tag);
    if (attrs) {
      for (var k in attrs) {
        var v = attrs[k];
        if (v == null) continue;
        if (k === "class") el.className = v;
        else if (k === "html") el.innerHTML = v;
        else if (k === "text") el.textContent = v;
        else if (k === "dataset") { for (var d in v) el.dataset[d] = v[d]; }
        else if (k.slice(0, 2) === "on" && typeof v === "function") el.addEventListener(k.slice(2).toLowerCase(), v);
        else el.setAttribute(k, v);
      }
    }
    append(el, children);
    return el;
  }
  function clear(el) { while (el.firstChild) el.removeChild(el.firstChild); }
  function escapeHtml(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function mdLight(s) { s = escapeHtml(s); s = s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>"); s = s.replace(/\n/g, "<br>"); return s; }
  function stripHtml(html) { var d = document.createElement("div"); d.innerHTML = html || ""; return (d.textContent || "").trim(); }

  /* ===== Mermaid ===== */
  function initMermaid() {
    if (!window.mermaid) return;
    try {
      window.mermaid.initialize({
        startOnLoad: false,
        theme: document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "default",
        securityLevel: "loose",
        flowchart: { useMaxWidth: true },
        sequence: { useMaxWidth: true }
      });
    } catch (e) {}
  }
  function runMermaid(container) {
    if (!window.mermaid) return;
    var nodes = container.querySelectorAll(".mermaid:not([data-processed])");
    if (!nodes.length) return;
    try { window.mermaid.run({ nodes: nodes }); }
    catch (e) { /* ignorer enkeltdiagram-feil */ }
  }
  function diagram(code, caption) {
    var box = h("div", { class: "mermaid-wrap" });
    var d = h("div", { class: "mermaid" });
    d.textContent = code;
    box.appendChild(d);
    if (caption) box.appendChild(h("div", { class: "muted", style: "font-size:12.5px;margin-top:6px" }, caption));
    return box;
  }

  /* ===== Verktøy eksponert til andre moduler ===== */
  var App = {
    TOPICS: TOPICS,
    EXAM_DATE: EXAM_DATE,
    h: h, clear: clear, append: append,
    diagram: diagram, runMermaid: runMermaid,
    topicById: function (id) { return TOPICS.filter(function (t) { return t.id === id; })[0]; },
    topicName: function (id) { var t = App.topicById(id); return t ? t.name : id; },
    navigate: function (hash) { if (location.hash === hash) render(); else location.hash = hash; },
    weightBadge: function (w) {
      var cls = "badge w" + w;
      var label = w === 3 ? "Eksamensfavoritt" : w === 2 ? "Middels" : "Lav vekt";
      return h("span", { class: cls }, label);
    },
    backlink: function (hash, label) {
      return h("a", { class: "backlink", href: hash }, "← " + (label || "Tilbake"));
    },
    shuffle: function (arr) {
      var a = arr.slice();
      for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
      return a;
    },

    /* ---- Claude-retting via lokal bro (kun når servert av bridge.js) ---- */
    bridge: false,
    stripHtml: stripHtml,
    mdLight: mdLight,
    gradeAnswer: function (question, model, answer) {
      return fetch("/api/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: question, modelAnswer: model, userAnswer: answer })
      }).then(function (r) {
        return r.json().then(function (d) { if (!r.ok) throw new Error(d.error || "Bro-feil"); return d; });
      }).then(function (d) { return d.feedback || "(tomt svar fra Claude)"; });
    },
    makeGradeButton: function (opts) {
      var btn = h("button", { class: "btn" }, "✨ Få retting fra Claude");
      var box = null;
      btn.addEventListener("click", function () {
        var ans = (opts.getAnswer() || "").trim();
        if (!ans) { alert("Skriv et svar først, så retter Claude det."); return; }
        btn.disabled = true; btn.textContent = "Claude retter …";
        App.gradeAnswer(opts.question, opts.model, ans).then(function (fb) {
          if (box) box.remove();
          box = h("div", { class: "explain", style: "border-left-color:var(--primary)" },
            [h("strong", {}, "Claudes retting:"), h("div", { html: mdLight(fb) })]);
          opts.mount(box);
          btn.disabled = false; btn.textContent = "✨ Rett på nytt";
        }).catch(function (e) {
          if (box) box.remove();
          box = h("div", { class: "explain", style: "border-left-color:var(--danger)" }, "Kunne ikke hente retting: " + (e.message || e));
          opts.mount(box);
          btn.disabled = false; btn.textContent = "✨ Prøv igjen";
        });
      });
      return btn;
    }
  };
  window.App = App;

  /* ===== Nedtelling ===== */
  function updateCountdown() {
    var el = document.getElementById("countdown");
    if (!el) return;
    var now = new Date();
    var ms = EXAM_DATE - now;
    if (ms <= 0) { el.textContent = "Eksamen i gang – lykke til!"; return; }
    var days = Math.floor(ms / 86400000);
    var hrs = Math.floor((ms % 86400000) / 3600000);
    el.textContent = days + " d " + hrs + " t til eksamen";
  }

  /* ===== Bro-status (Claude-retting) ===== */
  function updateBridgeStatus() {
    var el = document.getElementById("bridgeStatus");
    if (!el) return;
    var label = el.querySelector(".bs-label");
    if (App.bridge) {
      el.className = "bridge-status on";
      el.title = "Claude-retting er PÅ – «Få retting fra Claude» vises på tekstoppgaver";
      if (label) label.textContent = "Claude på";
    } else {
      el.className = "bridge-status off";
      el.title = "Claude-retting er av – klikk for å se hvordan du slår den på";
      if (label) label.textContent = "Claude av";
    }
  }

  /* ===== Tema ===== */
  function applyTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    try { localStorage.setItem("sysu_theme", t); } catch (e) {}
    initMermaid();
  }
  function initTheme() {
    var t = "light";
    try { t = localStorage.getItem("sysu_theme") || "light"; } catch (e) {}
    document.documentElement.setAttribute("data-theme", t);
  }

  /* ===== HJEM / DASHBOARD ===== */
  function renderHome(root) {
    var read = Progress.topicsReadCount();
    var allCardIds = (window.APP_DATA && APP_DATA.flashcards || []).map(function (c) { return c.id; });
    var cs = Progress.cardStats(allCardIds);
    var examTotal = (window.APP_DATA && APP_DATA.examItems || []).length;
    var examDone = Progress.examDoneCount();

    root.appendChild(h("div", {}, [
      h("h1", {}, "Læresystem – Systemutvikling"),
      h("p", { class: "lead" }, "Alt pensum for IDATT1005 samlet i én læringsløype: lær stoffet, drill det, og øv på ekte eksamensoppgaver. Vektet mot det som faktisk kommer på eksamen.")
    ]));

    /* KPI-er */
    var kpi = h("div", { class: "card" }, [
      h("div", { class: "kpi" }, [
        h("div", {}, [h("div", { class: "num" }, read + "/" + TOPICS.length), h("div", { class: "lbl" }, "temaer lest")]),
        h("div", {}, [h("div", { class: "num" }, cs.mastered + "/" + cs.total), h("div", { class: "lbl" }, "flashcards mestret")]),
        h("div", {}, [h("div", { class: "num" }, cs.seen), h("div", { class: "lbl" }, "kort sett")]),
        h("div", {}, [h("div", { class: "num" }, examDone + "/" + examTotal), h("div", { class: "lbl" }, "eksamensoppgaver øvd")])
      ]),
      h("div", { class: "progress lg", style: "margin-top:10px" }, h("span", { style: "width:" + Math.round(read / TOPICS.length * 100) + "%" }))
    ]);
    root.appendChild(kpi);

    /* 3-stegs løype */
    root.appendChild(h("h2", {}, "Læringsløype"));
    var steps = h("div", { class: "grid grid-3" }, [
      stepCard(1, "Lær", "Les konsise temasammendrag med diagrammer. Start her for å forstå stoffet.", "#/laer", "Til temaene"),
      stepCard(2, "Øv", "Drill med quiz (5 om gangen) og flashcards med spaced repetition.", "#/quiz", "Start quiz"),
      stepCard(3, "Eksamenstrening", "Ekte tidligere oppgaver med modellsvar, og simulert eksamen på tid.", "#/eksamen", "Til eksamen")
    ]);
    root.appendChild(steps);

    root.appendChild(h("div", { class: "btn-row", style: "margin-top:10px" }, [
      h("a", { class: "btn secondary", href: "#/flashcards" }, "🃏 Flashcards"),
      h("a", { class: "btn secondary", href: "#/uml" }, "📐 UML-øving"),
      h("a", { class: "btn ghost", href: "#/eksamen/simulert" }, "⏱ Simulert eksamen (3 t)")
    ]));

    /* Temaoversikt */
    root.appendChild(h("h2", {}, "Temaer & fremdrift"));
    var list = h("div", {});
    TOPICS.forEach(function (t) {
      var done = Progress.isTopicRead(t.id);
      var best = Progress.quizBest(t.id);
      list.appendChild(h("div", { class: "topic-row", onclick: function () { App.navigate("#/laer/" + t.id); } }, [
        App.weightBadge(t.weight),
        h("div", { class: "t-main" }, [
          h("div", { class: "t-name" }, t.name),
          h("div", { class: "t-sub" }, t.short)
        ]),
        best != null ? h("span", { class: "badge", title: "Beste quiz" }, "Quiz: " + Math.round(best * 100) + "%") : null,
        done ? h("span", { class: "badge done" }, "✓ Lest") : h("span", { class: "badge" }, "Ikke lest")
      ]));
    });
    root.appendChild(list);
  }
  function stepCard(num, title, desc, href, cta) {
    return h("div", { class: "card clickable step-card", onclick: function () { App.navigate(href); } }, [
      h("div", { class: "step-num" }, String(num)),
      h("h3", {}, title),
      h("p", {}, desc),
      h("div", { style: "margin-top:10px" }, h("span", { class: "btn", style: "pointer-events:none" }, cta))
    ]);
  }

  /* ===== LÆR: temaliste ===== */
  function renderLaerList(root) {
    root.appendChild(h("h1", {}, "Lær – temasammendrag"));
    root.appendChild(h("p", { class: "lead" }, "Konsise sammendrag av hvert tema med diagrammer og eksamensrelevans. Marker som lest når du har vært gjennom det."));
    var summaries = (window.APP_DATA && APP_DATA.summaries) || [];
    var byTopic = {};
    summaries.forEach(function (s) { byTopic[s.topic] = s; });
    TOPICS.forEach(function (t) {
      var has = !!byTopic[t.id];
      var done = Progress.isTopicRead(t.id);
      root.appendChild(h("div", { class: "topic-row", onclick: has ? function () { App.navigate("#/laer/" + t.id); } : null, style: has ? "" : "opacity:.55;cursor:default" }, [
        App.weightBadge(t.weight),
        h("div", { class: "t-main" }, [
          h("div", { class: "t-name" }, t.name),
          h("div", { class: "t-sub" }, has ? byTopic[t.id].title : "Kommer snart")
        ]),
        done ? h("span", { class: "badge done" }, "✓ Lest") : null,
        has ? h("span", { class: "badge" }, "Les →") : null
      ]));
    });
  }

  /* ===== LÆR: detalj ===== */
  function renderLaerDetail(root, topicId) {
    var summaries = (window.APP_DATA && APP_DATA.summaries) || [];
    var s = summaries.filter(function (x) { return x.topic === topicId; })[0];
    var t = App.topicById(topicId);
    root.appendChild(App.backlink("#/laer", "Alle temaer"));
    if (!s) { root.appendChild(h("div", { class: "content" }, "Sammendrag mangler for dette temaet.")); return; }

    root.appendChild(h("div", { class: "section-title" }, [
      h("h1", {}, s.title),
      App.weightBadge(t ? t.weight : 1)
    ]));
    if (s.examNote) root.appendChild(h("div", { class: "callout exam" }, [h("strong", {}, "Eksamensrelevans: "), s.examNote]));

    var content = h("div", { class: "content" });
    content.innerHTML = s.html;
    root.appendChild(content);
    runMermaid(content);

    var read = Progress.isTopicRead(topicId);
    var btnRow = h("div", { class: "btn-row" });
    var markBtn = h("button", { class: read ? "btn success" : "btn" }, read ? "✓ Lest" : "Marker som lest");
    markBtn.addEventListener("click", function () {
      Progress.markTopicRead(topicId);
      markBtn.className = "btn success"; markBtn.textContent = "✓ Lest";
    });
    btnRow.appendChild(markBtn);
    btnRow.appendChild(h("a", { class: "btn secondary", href: "#/quiz/" + topicId }, "Quiz dette temaet"));
    btnRow.appendChild(h("a", { class: "btn secondary", href: "#/flashcards/" + topicId }, "Flashcards"));
    root.appendChild(btnRow);
  }

  /* ===== Ruter ===== */
  function parseHash() {
    var hash = location.hash || "#/";
    var parts = hash.replace(/^#\//, "").split("/").filter(Boolean);
    return parts; // f.eks. ["laer","uml"]
  }
  function setActiveNav(section) {
    var links = document.querySelectorAll(".mainnav a");
    links.forEach(function (a) { a.classList.toggle("active", a.getAttribute("data-match") === section); });
  }
  function render() {
    var root = document.getElementById("app");
    clear(root);
    if (window.Exam && Exam.cleanup) Exam.cleanup(); // stopp ev. eksamenstimer
    var p = parseHash();
    var section = p[0] || "";
    setActiveNav(section);
    window.scrollTo(0, 0);

    try {
      if (!section) return renderHome(root);
      if (section === "laer") return p[1] ? renderLaerDetail(root, p[1]) : renderLaerList(root);
      if (section === "quiz" && window.Quiz) return Quiz.route(root, p.slice(1));
      if (section === "flashcards" && window.Flashcards) return Flashcards.route(root, p.slice(1));
      if (section === "uml" && window.UML) return UML.route(root, p.slice(1));
      if (section === "eksamen" && window.Exam) return Exam.route(root, p.slice(1));
      renderHome(root);
    } catch (e) {
      root.appendChild(h("div", { class: "content" }, [
        h("h2", {}, "Beklager, noe gikk galt"),
        h("p", { class: "muted" }, String(e && e.message || e)),
        h("a", { class: "btn", href: "#/" }, "Til forsiden")
      ]));
    }
  }

  /* ===== Oppstart ===== */
  function boot() {
    initTheme();
    initMermaid();
    updateCountdown();
    setInterval(updateCountdown, 60000);

    document.getElementById("themeToggle").addEventListener("click", function () {
      var cur = document.documentElement.getAttribute("data-theme");
      applyTheme(cur === "dark" ? "light" : "dark");
      render();
    });
    document.getElementById("menuBtn").addEventListener("click", function () {
      document.getElementById("mainnav").classList.toggle("open");
    });
    document.querySelectorAll(".mainnav a").forEach(function (a) {
      a.addEventListener("click", function () { document.getElementById("mainnav").classList.remove("open"); });
    });
    document.querySelector(".brand").addEventListener("click", function () { App.navigate("#/"); });
    document.getElementById("resetBtn").addEventListener("click", function () {
      if (confirm("Nullstille all fremdrift (lest, quiz, flashcards, eksamen)?")) { Progress.reset(); render(); }
    });
    document.getElementById("bridgeStatus").addEventListener("click", function () {
      if (App.bridge) {
        alert("Claude-retting er PÅ ✓\n\nGå til et tekstspørsmål – åpne quiz-spørsmål, eksamenstrening eller simulert eksamen – og bruk knappen «✨ Få retting fra Claude».");
      } else {
        alert("Claude-retting er AV.\n\nSlik slår du den på:\n1) Dobbeltklikk «start-med-retting.command» (eller kjør «node bridge.js» i laeresystem-mappen).\n2) Åpne http://localhost:8787 i nettleseren.\n\nDa dukker «✨ Få retting fra Claude» opp på alle tekstoppgaver.\n\n(Åpner du index.html direkte med dobbeltklikk, kjører appen offline uten retting.)");
      }
    });

    window.addEventListener("hashchange", render);
    render();

    // Oppdag om Claude-broen kjører (kun når appen serveres av bridge.js)
    fetch("/api/health").then(function (r) { return r.json(); }).then(function (d) {
      if (d && d.ok) { App.bridge = true; updateBridgeStatus(); if (window.Chat) Chat.setEnabled(true); render(); }
    }).catch(function () { /* ingen bro – stille degradering, status forblir "av" */ });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
