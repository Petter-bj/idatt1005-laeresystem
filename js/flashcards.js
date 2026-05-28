/* Flashcards med Leitner spaced repetition (5 bokser). Svakeste kort først. */
(function () {
  "use strict";
  var session = null;
  var MAX = 25; // kort per økt

  function pool(topicId) {
    var all = (window.APP_DATA && APP_DATA.flashcards) || [];
    if (topicId === "alle") return all.slice();
    return all.filter(function (c) { return c.topic === topicId; });
  }

  function route(root, parts) {
    if (parts.length && (parts[0] === "alle" || App.topicById(parts[0]))) start(root, parts[0]);
    else setup(root);
  }

  /* ---- Oppsett ---- */
  function setup(root) {
    root.appendChild(App.h("h1", {}, "Flashcards"));
    root.appendChild(App.h("p", { class: "lead" }, "Snu kortet, vurder om du kunne det. Kort du kan flyttes oppover (Leitner-bokser 1→5); kort du bommer på går tilbake til boks 1 og dukker opp oftere."));

    root.appendChild(App.h("button", { class: "btn block", style: "margin-bottom:16px", onclick: function () { App.navigate("#/flashcards/alle"); } },
      "🃏 Alle temaer (svakeste kort først)"));

    var grid = App.h("div", { class: "pickgrid" });
    App.TOPICS.forEach(function (t) {
      var cards = pool(t.id);
      if (!cards.length) return;
      var st = Progress.cardStats(cards.map(function (c) { return c.id; }));
      grid.appendChild(App.h("button", { class: "pick", onclick: function () { App.navigate("#/flashcards/" + t.id); } }, [
        App.h("span", { class: "p-name" }, t.name),
        App.h("span", { class: "badge" }, st.mastered + "/" + st.total + " mestret")
      ]));
    });
    root.appendChild(grid);
  }

  /* ---- Start økt ---- */
  function start(root, topicId) {
    var deck = pool(topicId);
    if (!deck.length) { setup(root); return; }
    deck = deck.map(function (c) { return { c: c, box: Progress.cardBox(c.id) }; });
    deck.sort(function (a, b) { return a.box - b.box; }); // svakeste først
    var top = deck.slice(0, MAX);
    // litt tilfeldighet innen samme prioritet
    var cards = App.shuffle(top).map(function (x) { return x.c; });
    session = { root: root, topicId: topicId, cards: cards, idx: 0, up: 0, down: 0 };
    renderCard();
  }

  /* ---- Vis kort ---- */
  function renderCard() {
    var root = session.root; App.clear(root);
    var c = session.cards[session.idx];
    var box = Progress.cardBox(c.id);
    var label = session.topicId === "alle" ? App.topicName(c.topic) : App.topicName(session.topicId);

    root.appendChild(App.backlink("#/flashcards", "Avslutt"));
    root.appendChild(App.h("div", { class: "qmeta" }, [
      App.h("span", {}, label),
      App.h("span", {}, "Kort " + (session.idx + 1) + " av " + session.cards.length)
    ]));

    // boks-indikator
    var pills = App.h("div", { class: "box-pills" });
    for (var i = 1; i <= 5; i++) pills.appendChild(App.h("div", { class: "box-pill" + (i <= box ? " on" : "") }));
    root.appendChild(pills);
    root.appendChild(App.h("div", { class: "center muted", style: "font-size:12px;margin-bottom:4px" }, "Boks " + box + " / 5"));

    var scene = App.h("div", { class: "flash-scene" });
    var flash = App.h("div", { class: "flash", tabindex: "0", role: "button", "aria-pressed": "false", "aria-label": "Snu kortet for å se forklaringen" });
    flash.appendChild(App.h("div", { class: "flash-face flash-front" }, [
      App.h("span", { class: "face-label" }, "Begrep"),
      App.h("div", { class: "term", html: c.front })
    ]));
    flash.appendChild(App.h("div", { class: "flash-face flash-back" }, [
      App.h("span", { class: "face-label" }, "Forklaring"),
      App.h("div", { class: "def", html: c.back })
    ]));
    scene.appendChild(flash);
    root.appendChild(scene);

    var hint = App.h("p", { class: "flash-hint" }, "Trykk på kortet (eller Enter / mellomrom) for å snu");
    root.appendChild(hint);

    var rating = App.h("div", { class: "btn-row", style: "justify-content:center;display:none" }, [
      App.h("button", { class: "btn secondary", onclick: function () { rate(false); } }, "✗ Kunne ikke"),
      App.h("button", { class: "btn success", onclick: function () { rate(true); } }, "✓ Kunne dette")
    ]);
    root.appendChild(rating);

    var flipped = false;
    function doFlip() {
      flipped = !flipped;
      flash.classList.toggle("flipped", flipped);
      flash.setAttribute("aria-pressed", flipped ? "true" : "false");
      if (flipped) { rating.style.display = "flex"; hint.textContent = "Kunne du dette?"; }
    }
    flash.addEventListener("click", doFlip);
    flash.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") { e.preventDefault(); doFlip(); }
    });
  }

  function rate(knew) {
    var c = session.cards[session.idx];
    var box = Progress.cardBox(c.id);
    if (knew) { Progress.setCardBox(c.id, box + 1); session.up++; }
    else { Progress.setCardBox(c.id, 1); session.down++; }
    if (session.idx < session.cards.length - 1) { session.idx++; renderCard(); }
    else summary();
  }

  /* ---- Oppsummering ---- */
  function summary() {
    var root = session.root; App.clear(root);
    root.appendChild(App.h("div", { class: "card result-big" }, [
      App.h("div", { class: "score", style: "color:var(--accent)" }, "✓ " + session.up),
      App.h("p", { class: "muted" }, "Du kunne " + session.up + " av " + session.cards.length + " kort. " +
        (session.down ? session.down + " kort kom tilbake til boks 1 og dukker opp igjen snart." : "Sterkt – alt sitter!"))
    ]));
    root.appendChild(App.h("div", { class: "btn-row" }, [
      App.h("button", { class: "btn", onclick: function () { start(root, session.topicId); } }, "Ny økt"),
      App.h("a", { class: "btn secondary", href: "#/flashcards" }, "Bytt tema"),
      App.h("a", { class: "btn ghost", href: "#/" }, "Til forsiden")
    ]));
  }

  window.Flashcards = { route: route };
})();
