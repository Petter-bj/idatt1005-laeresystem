/* Quiz-motor: runder på 5 spørsmål, fasit + forklaring per spørsmål, scoring lagres. */
(function () {
  "use strict";
  var session = null;

  function pool(topicId) {
    var all = (window.APP_DATA && APP_DATA.quizzes) || [];
    if (topicId === "blandet") return all.slice();
    return all.filter(function (q) { return q.topic === topicId; });
  }

  function route(root, parts) {
    if (parts.length && (parts[0] === "evig" || parts[0] === "blandet" || App.topicById(parts[0]))) start(root, parts[0]);
    else setup(root);
  }

  /* ---- Oppsett ---- */
  function setup(root) {
    root.appendChild(App.h("h1", {}, "Quiz"));
    root.appendChild(App.h("p", { class: "lead" }, "Du får fasit og forklaring etter hvert spørsmål. Ta et enkelt tema, en blandet runde på 5, eller en endeløs drill fra alle temaer."));

    root.appendChild(App.h("button", { class: "btn block", style: "margin-bottom:10px", onclick: function () { App.navigate("#/quiz/blandet"); } },
      "🎲 Blandet runde (5 spørsmål, alle temaer)"));
    root.appendChild(App.h("button", { class: "btn block secondary", style: "margin-bottom:16px", onclick: function () { App.navigate("#/quiz/evig"); } },
      "♾️ Endeløs drill (alle temaer, til du avslutter)"));

    var grid = App.h("div", { class: "pickgrid" });
    App.TOPICS.forEach(function (t) {
      var n = pool(t.id).length;
      if (!n) return;
      var best = Progress.quizBest(t.id);
      grid.appendChild(App.h("button", { class: "pick", onclick: function () { App.navigate("#/quiz/" + t.id); } }, [
        App.h("span", { class: "p-name" }, t.name),
        App.h("span", { class: "badge" }, best != null ? "Best " + Math.round(best * 100) + "%" : n + " spm")
      ]));
    });
    root.appendChild(grid);
  }

  /* ---- Start runde ---- */
  function start(root, topicId) {
    var endless = topicId === "evig";
    var p = endless ? pool("blandet") : pool(topicId);
    if (!p.length) { setup(root); return; }
    if (endless) {
      // Endeløs drill: stokk hele banken, gå gjennom den, reshuffle når tom – aldri resultatskjerm
      session = { root: root, topicId: topicId, endless: true, qs: App.shuffle(p), idx: 0, correct: 0, answered: 0 };
    } else {
      var qs = App.shuffle(p).slice(0, Math.min(5, p.length));
      session = { root: root, topicId: topicId, qs: qs, idx: 0, correct: 0, answered: false };
    }
    renderQuestion();
  }

  /* ---- Vis gjeldende spørsmål ---- */
  function renderQuestion() {
    var root = session.root; App.clear(root);
    var q = session.qs[session.idx];

    if (session.endless) {
      root.appendChild(App.backlink("#/quiz", "Avslutt drill"));
      root.appendChild(App.h("div", { class: "qmeta" }, [
        App.h("span", {}, "Endeløs drill · " + App.topicName(q.topic)),
        App.h("span", {}, "Spørsmål " + (session.answered + 1))
      ]));
      var pct = session.answered ? Math.round(session.correct / session.answered * 100) : 0;
      root.appendChild(App.h("p", { class: "muted", style: "margin:-4px 0 18px" },
        session.answered
          ? ("✓ " + session.correct + " riktige av " + session.answered + " besvart (" + pct + "%)")
          : "Tilfeldige spørsmål fra alle temaer – kjører til du avslutter."));
    } else {
      var topicLabel = session.topicId === "blandet" ? "Blandet" : App.topicName(session.topicId);
      root.appendChild(App.backlink("#/quiz", "Avslutt quiz"));
      root.appendChild(App.h("div", { class: "qmeta" }, [
        App.h("span", {}, topicLabel + (session.topicId === "blandet" ? " · " + App.topicName(q.topic) : "")),
        App.h("span", {}, "Spørsmål " + (session.idx + 1) + " av " + session.qs.length)
      ]));
      root.appendChild(App.h("div", { class: "progress", style: "margin-bottom:18px" },
        App.h("span", { style: "width:" + ((session.idx) / session.qs.length * 100) + "%" })));
    }

    var card = App.h("div", { class: "card" });
    card.appendChild(App.h("div", { class: "quiz-q" }, q.q));

    if (q.type === "open") renderOpen(card, q);
    else renderMc(card, q);

    root.appendChild(card);
  }

  /* ---- Flervalg ---- */
  function renderMc(card, q) {
    if (!q.options || !q.options.length) { renderOpen(card, { q: q.q, model: q.explain || "(spørsmålet mangler alternativer)" }); return; }
    // Stokk alternativene tilfeldig hver gang, så fasit ikke alltid er lengst / på samme plass
    var order = App.shuffle(q.options.map(function (_, i) { return i; }));
    var correctPos = order.indexOf(q.correct);
    var selected = -1, locked = false;
    var optWrap = App.h("div", { class: "options", role: "group", "aria-label": "Svaralternativer" });
    var btns = [];
    order.forEach(function (origIdx, pos) {
      var b = App.h("button", { class: "option", "aria-pressed": "false" }, [App.h("span", { class: "mark" }, String.fromCharCode(65 + pos) + "."), q.options[origIdx]]);
      b.addEventListener("click", function () {
        if (locked) return;
        selected = pos;
        btns.forEach(function (x) { x.classList.remove("selected"); x.setAttribute("aria-pressed", "false"); });
        b.classList.add("selected");
        b.setAttribute("aria-pressed", "true");
        checkBtn.disabled = false;
      });
      btns.push(b); optWrap.appendChild(b);
    });
    card.appendChild(optWrap);

    var checkBtn = App.h("button", { class: "btn", disabled: "" }, "Sjekk svar");
    var row = App.h("div", { class: "btn-row" }, checkBtn);
    card.appendChild(row);

    checkBtn.addEventListener("click", function () {
      if (locked || selected < 0) return;
      locked = true;
      btns.forEach(function (x, pos) {
        x.disabled = true;
        if (pos === correctPos) x.classList.add("correct");
        else if (pos === selected) x.classList.add("wrong");
      });
      var ok = selected === correctPos;
      if (ok) session.correct++;
      card.appendChild(App.h("div", { class: "explain" }, [
        App.h("strong", {}, ok ? "Riktig! " : "Ikke helt. "),
        q.explain || ("Riktig svar: " + String.fromCharCode(65 + correctPos) + ".")
      ]));
      replaceWithNext(card);
    });
  }

  /* ---- Åpent spørsmål (selvrettet) ---- */
  function renderOpen(card, q) {
    var ta = App.h("textarea", { class: "answer", placeholder: "Skriv svaret ditt her (eller tenk gjennom det) …" });
    card.appendChild(ta);
    var showBtn = App.h("button", { class: "btn" }, "Vis modellsvar");
    var row = App.h("div", { class: "btn-row" }, showBtn);
    card.appendChild(row);

    if (App.bridge) {
      row.appendChild(App.makeGradeButton({
        question: q.q,
        model: App.stripHtml(q.model),
        getAnswer: function () { return ta.value; },
        mount: function (el) { card.appendChild(el); }
      }));
    }

    showBtn.addEventListener("click", function () {
      showBtn.remove();
      card.appendChild(App.h("div", { class: "explain open" }, [
        App.h("strong", {}, "Modellsvar: "), App.h("span", { html: q.model })
      ]));
      card.appendChild(App.h("p", { class: "muted", style: "margin-top:12px" }, "Hvor godt traff du?"));
      var grade = App.h("div", { class: "self-grade" }, [
        App.h("button", { class: "btn success", onclick: function () { session.correct++; next(); } }, "✓ Kunne dette"),
        App.h("button", { class: "btn secondary", onclick: function () { next(); } }, "✗ Må øve mer")
      ]);
      card.appendChild(grade);
    });
  }

  function replaceWithNext(card) {
    var isLast = !session.endless && session.idx === session.qs.length - 1;
    card.appendChild(App.h("div", { class: "btn-row" },
      App.h("button", { class: "btn", onclick: next }, isLast ? "Se resultat →" : "Neste spørsmål →")));
  }

  function next() {
    if (session.endless) {
      session.answered++;
      session.idx++;
      if (session.idx >= session.qs.length) { session.qs = App.shuffle(session.qs); session.idx = 0; } // ny stokk-runde
      renderQuestion();
      return;
    }
    if (session.idx < session.qs.length - 1) { session.idx++; renderQuestion(); }
    else result();
  }

  /* ---- Resultat ---- */
  function result() {
    var root = session.root; App.clear(root);
    var total = session.qs.length, score = session.correct;
    var pct = Math.round(score / total * 100);
    if (session.topicId !== "blandet") Progress.recordQuiz(session.topicId, score, total);

    var msg = pct >= 80 ? "Sterkt! Du sitter godt i dette." : pct >= 60 ? "Bra – litt mer drilling så er du der." : "Greit å vite nå. Ta en runde til.";
    root.appendChild(App.h("div", { class: "card result-big" }, [
      App.h("div", { class: "score", style: "color:" + (pct >= 80 ? "var(--accent)" : pct >= 60 ? "var(--warn)" : "var(--danger)") }, score + " / " + total),
      App.h("p", { class: "muted" }, pct + "% riktig · " + msg)
    ]));
    root.appendChild(App.h("div", { class: "btn-row" }, [
      App.h("button", { class: "btn", onclick: function () { start(root, session.topicId); } }, "Ny runde"),
      App.h("a", { class: "btn secondary", href: "#/quiz" }, "Bytt tema"),
      App.h("a", { class: "btn ghost", href: "#/" }, "Til forsiden")
    ]));
  }

  window.Quiz = { route: route };
})();
