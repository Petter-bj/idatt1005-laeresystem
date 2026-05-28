/* Eksamenstrening: tidligere oppgaver m/ modellsvar + simulert eksamen på tid. */
(function () {
  "use strict";
  var timerId = null;
  function clearTimer() { if (timerId) { clearInterval(timerId); timerId = null; } }
  function items() { return (window.APP_DATA && APP_DATA.examItems) || []; }

  function route(root, parts) {
    clearTimer();
    if (parts[0] === "simulert") return sim(root);
    home(root);
  }

  /* ---- Hjem ---- */
  function home(root) {
    root.appendChild(App.h("h1", {}, "Eksamenstrening"));
    root.appendChild(App.h("p", { class: "lead" }, "Ekte oppgavetyper fra tidligere eksamener (IDATT1005/1002) med modellsvar og hva sensor ser etter. Øv tema for tema, eller ta en simulert eksamen på tid."));

    root.appendChild(App.h("div", { class: "card", style: "border-left:4px solid var(--warn)" }, [
      App.h("h3", { style: "margin-top:0" }, "⏱ Eksamensteknikk (3 timer, 5 oppgaver)"),
      App.h("ul", {}, [
        App.h("li", {}, App.h("span", { html: "<strong>Tidsbruk:</strong> ~36 min per oppgave. Sett av 10–15 min på slutten til gjennomlesing." })),
        App.h("li", {}, App.h("span", { html: "<strong>Drøftingssvar:</strong> definer begrepet → forklar → gi konkret eksempel → vei fordeler/ulemper → konkluder." })),
        App.h("li", {}, App.h("span", { html: "<strong>«Fordeler/ulemper»-oppgaver:</strong> bruk punktliste og vær konkret – sensor teller poeng." })),
        App.h("li", {}, App.h("span", { html: "<strong>Case-oppgaver:</strong> knytt svaret til teori (f.eks. konkret GDPR-prinsipp), ikke bare synsing." })),
        App.h("li", {}, App.h("span", { html: "<strong>UML:</strong> tegn ryddig, ta med systemgrense, multiplisitet og pilretninger." }))
      ])
    ]));

    root.appendChild(App.h("div", { class: "btn-row" },
      App.h("a", { class: "btn", href: "#/eksamen/simulert" }, "⏱ Start simulert eksamen (3 t)")));

    var byTopic = {};
    items().forEach(function (it) { (byTopic[it.topic] = byTopic[it.topic] || []).push(it); });

    App.TOPICS.forEach(function (t) {
      var list = byTopic[t.id];
      if (!list || !list.length) return;
      root.appendChild(App.h("h2", {}, t.name + " "));
      list.forEach(function (it) { root.appendChild(examCard(it)); });
    });
  }

  function examCard(it) {
    var card = App.h("div", { class: "card exam-item" });
    var done = Progress.isExamDone(it.id);
    card.appendChild(App.h("div", { class: "qmeta" }, [
      App.h("span", {}, "Tidligere eksamen · " + (it.examYear || "")),
      done ? App.h("span", { class: "badge done" }, "✓ Øvd") : App.h("span", {})
    ]));
    card.appendChild(App.h("div", { class: "exam-q", html: it.question }));

    var ans = App.h("div", { class: "model-answer" });
    ans.appendChild(App.h("h3", { style: "margin-top:0" }, "Modellsvar"));
    ans.appendChild(App.h("div", { html: it.model }));
    if (it.sensor && it.sensor.length) {
      ans.appendChild(App.h("p", { style: "font-weight:700;margin:14px 0 6px" }, "Sensor ser etter:"));
      var ul = App.h("ul", { class: "sensor-list" });
      it.sensor.forEach(function (s) { ul.appendChild(App.h("li", { html: s })); });
      ans.appendChild(ul);
    }

    var ta = null;
    if (App.bridge) {
      ta = App.h("textarea", { class: "answer", placeholder: "Skriv svaret ditt her, så kan Claude rette det …" });
      card.appendChild(ta);
    }

    var btn = App.h("button", { class: "btn secondary" }, "Vis modellsvar");
    btn.addEventListener("click", function () {
      var show = ans.classList.toggle("show");
      btn.textContent = show ? "Skjul modellsvar" : "Vis modellsvar";
      if (show && !done) { Progress.markExamDone(it.id); }
    });
    var btnRow = App.h("div", { class: "btn-row" }, btn);
    if (ta) {
      btnRow.appendChild(App.makeGradeButton({
        question: App.stripHtml(it.question),
        model: App.stripHtml(it.model),
        getAnswer: function () { return ta.value; },
        mount: function (el) { card.appendChild(el); }
      }));
    }
    card.appendChild(btnRow);
    card.appendChild(ans);
    return card;
  }

  /* ---- Simulert eksamen ---- */
  function pickSet() {
    var wanted = ["metodikk", "testing", "arkitektur", "mmi", "etikk"];
    var all = items();
    var chosen = [];
    wanted.forEach(function (top) {
      var pool = all.filter(function (it) { return it.topic === top; });
      if (pool.length) chosen.push(pool[Math.floor(Math.random() * pool.length)]);
    });
    // fyll opp til 5 hvis noe mangler
    while (chosen.length < 5 && chosen.length < all.length) {
      var c = all[Math.floor(Math.random() * all.length)];
      if (chosen.indexOf(c) === -1) chosen.push(c);
    }
    return chosen;
  }

  function sim(root) {
    var set = pickSet();
    var DURATION = 3 * 60 * 60; // sekunder
    var remaining = DURATION;

    root.appendChild(App.backlink("#/eksamen", "Avbryt"));
    root.appendChild(App.h("h1", {}, "Simulert eksamen"));
    root.appendChild(App.h("p", { class: "lead" }, "5 oppgaver · 3 timer · ingen hjelpemidler. Skriv svarene dine, lever når du er ferdig, og vurder mot modellsvarene."));

    var timeEl = App.h("span", { class: "time" }, fmt(remaining));
    var bar = App.h("div", { class: "timer-bar" }, [
      timeEl,
      App.h("span", { class: "muted" }, "av 3:00:00 · ~36 min per oppgave"),
      App.h("button", { class: "btn success", style: "margin-left:auto", onclick: function () { finish(); } }, "Lever & se fasit")
    ]);
    root.appendChild(bar);

    var answersWrap = App.h("div", {});
    set.forEach(function (it, i) {
      var card = App.h("div", { class: "card" }, [
        App.h("div", { class: "qmeta" }, [App.h("span", {}, "Oppgave " + (i + 1) + " · " + App.topicName(it.topic)), App.h("span", {}, "20 %")]),
        App.h("div", { class: "exam-q", html: it.question }),
        App.h("textarea", { class: "answer", id: "sim-ans-" + i, placeholder: "Skriv svaret ditt …" })
      ]);
      answersWrap.appendChild(card);
    });
    root.appendChild(answersWrap);

    var finished = false;
    function finish() {
      if (finished) return;
      finished = true;
      clearTimer();
      Progress.recordSim(0);
      var resWrap = App.h("div", {});
      resWrap.appendChild(App.h("h2", {}, "Modellsvar – vurder deg selv"));
      set.forEach(function (it, i) {
        var yours = "";
        var ta = document.getElementById("sim-ans-" + i);
        if (ta) yours = ta.value;
        var card = App.h("div", { class: "card" }, [
          App.h("div", { class: "qmeta" }, [App.h("span", {}, "Oppgave " + (i + 1) + " · " + App.topicName(it.topic)), App.h("span", {})]),
          App.h("div", { class: "exam-q", html: it.question })
        ]);
        if (yours.trim()) card.appendChild(App.h("div", { class: "explain", style: "border-left-color:var(--text-soft)" }, [App.h("strong", {}, "Ditt svar: "), yours]));
        if (App.bridge && yours.trim()) {
          card.appendChild(App.h("div", { class: "btn-row" }, App.makeGradeButton({
            question: App.stripHtml(it.question),
            model: App.stripHtml(it.model),
            getAnswer: function () { return yours; },
            mount: function (el) { card.appendChild(el); }
          })));
        }
        card.appendChild(App.h("div", { class: "explain", html: "<strong>Modellsvar:</strong> " + it.model }));
        if (it.sensor && it.sensor.length) {
          var ul = App.h("ul", { class: "sensor-list", style: "margin-top:10px" });
          it.sensor.forEach(function (s) { ul.appendChild(App.h("li", { html: s })); });
          card.appendChild(App.h("p", { style: "font-weight:700;margin:12px 0 6px" }, "Sensor ser etter:"));
          card.appendChild(ul);
        }
        resWrap.appendChild(card);
      });
      resWrap.appendChild(App.h("div", { class: "btn-row" }, [
        App.h("a", { class: "btn", href: "#/eksamen/simulert", onclick: function () { App.navigate("#/eksamen/simulert"); } }, "Ny simulert eksamen"),
        App.h("a", { class: "btn ghost", href: "#/eksamen" }, "Tilbake")
      ]));
      App.clear(root); root.appendChild(resWrap); window.scrollTo(0, 0);
    }

    clearTimer();
    timerId = setInterval(function () {
      remaining--;
      timeEl.textContent = fmt(remaining);
      if (remaining <= 300) timeEl.classList.add("low");
      if (remaining <= 0) { finish(); }
    }, 1000);
  }

  function fmt(s) {
    if (s < 0) s = 0;
    var h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
    function p(n) { return (n < 10 ? "0" : "") + n; }
    return h + ":" + p(m) + ":" + p(sec);
  }

  window.Exam = { route: route, cleanup: clearTimer };
})();
