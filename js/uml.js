/* UML-øving: scenario → tegn selv på papir → vis fasit (Mermaid) + forklaring. */
(function () {
  "use strict";
  function list() { return (window.APP_DATA && APP_DATA.umlExercises) || []; }

  function route(root, parts) {
    if (parts.length) {
      var ex = list().filter(function (e) { return e.id === parts[0]; })[0];
      if (ex) return detail(root, ex);
    }
    overview(root);
  }

  function overview(root) {
    root.appendChild(App.h("h1", {}, "UML-øving"));
    root.appendChild(App.h("p", { class: "lead" }, "Les scenariet, tegn diagrammet selv på papir (slik eksamen krever), og sammenlign så med fasiten. Oppgavene er hentet fra øvingene i pensum."));
    var grid = App.h("div", { class: "grid grid-2" });
    list().forEach(function (ex) {
      grid.appendChild(App.h("div", { class: "card clickable", onclick: function () { App.navigate("#/uml/" + ex.id); } }, [
        App.h("span", { class: "badge" }, ex.type),
        App.h("h3", { style: "margin:8px 0 4px" }, ex.title),
        App.h("p", { class: "muted", style: "font-size:13px;margin:0" }, (ex.prompt || "").slice(0, 90) + "…")
      ]));
    });
    root.appendChild(grid);
  }

  function detail(root, ex) {
    var all = list();
    var idx = all.indexOf(ex);
    root.appendChild(App.backlink("#/uml", "Alle UML-øvelser"));
    root.appendChild(App.h("div", { class: "section-title" }, [
      App.h("h1", {}, ex.title),
      App.h("span", { class: "badge w2" }, ex.type)
    ]));

    root.appendChild(App.h("div", { class: "card" }, [
      App.h("h3", { style: "margin-top:0" }, "Oppgave"),
      App.h("p", { html: ex.prompt })
    ]));

    if (ex.hints && ex.hints.length) {
      var det = App.h("details", { class: "card", style: "margin-top:14px" });
      det.appendChild(App.h("summary", { style: "cursor:pointer;font-weight:700" }, "💡 Tips (klikk for å vise)"));
      var ul = App.h("ul", { style: "margin-top:10px" });
      ex.hints.forEach(function (hn) { ul.appendChild(App.h("li", { html: hn })); });
      det.appendChild(ul);
      root.appendChild(det);
    }

    root.appendChild(App.h("div", { class: "callout exam" }, "✏️ Tegn diagrammet selv først – så avslører du fasiten."));

    var solWrap = App.h("div", {});
    var showBtn = App.h("button", { class: "btn", onclick: function () {
      showBtn.remove();
      var sol = App.h("div", { class: "card" }, [App.h("h3", { style: "margin-top:0" }, "Fasit")]);
      var dia = App.diagram(ex.solution);
      sol.appendChild(dia);
      if (ex.explanation) sol.appendChild(App.h("div", { class: "explain", html: ex.explanation }));
      solWrap.appendChild(sol);
      App.runMermaid(sol);
    } }, "Vis fasit");
    root.appendChild(App.h("div", { class: "btn-row" }, showBtn));
    root.appendChild(solWrap);

    var nav = App.h("div", { class: "btn-row", style: "margin-top:18px" });
    if (idx > 0) nav.appendChild(App.h("a", { class: "btn secondary", href: "#/uml/" + all[idx - 1].id }, "← Forrige"));
    if (idx < all.length - 1) nav.appendChild(App.h("a", { class: "btn secondary", href: "#/uml/" + all[idx + 1].id }, "Neste →"));
    root.appendChild(nav);
  }

  window.UML = { route: route };
})();
