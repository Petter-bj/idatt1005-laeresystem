/* Kontekst-bevisst chat-panel.
   - Vises kun når broen kjører OG du er på en lærings-side (forsiden, Lær, flashcards).
   - Leser det som faktisk står på skjermen, så Claude vet hvilken side/tema du er på.
   - Flerveis: husker samtalen. Krever bridge.js (samme abonnement som retting). */
(function () {
  "use strict";
  if (!window.App) return;

  var ALLOWED = ["", "laer", "flashcards"]; // seksjoner der chatten vises
  var enabled = false;     // broen tilkoblet?
  var panelOpen = false;
  var pending = false;
  var msgs = [];           // { role:"user"|"assistant", text }

  /* ---- Kontekst ---- */
  function section() {
    return (location.hash || "").replace(/^#\//, "").split("/").filter(Boolean);
  }
  function allowedHere() {
    var p = section();
    return ALLOWED.indexOf(p[0] || "") >= 0;
  }
  function shortContext() {
    var p = section(), sec = p[0] || "";
    if (sec === "laer" && p[1]) return App.topicName(p[1]);
    if (sec === "laer") return "Temaoversikt";
    if (sec === "flashcards" && p[1]) return "Flashcards · " + App.topicName(p[1]);
    if (sec === "flashcards") return "Flashcards";
    if (!sec) return "Forsiden";
    return "Læresystemet";
  }
  function fullContext() {
    var p = section(), sec = p[0] || "", parts = [];
    var topic = p[1] && App.topicById(p[1]) ? App.topicName(p[1]) : null;
    var content = document.querySelector("#app .content");
    var h1 = document.querySelector("#app h1");
    if (topic) parts.push("Tema: " + topic);
    if (sec === "laer" && content) {
      if (h1) parts.push("Sidetittel: " + h1.textContent.trim());
      parts.push("Sammendraget studenten leser nå:\n" + content.textContent.replace(/\s+/g, " ").trim().slice(0, 1800));
    } else if (sec === "flashcards") {
      var term = document.querySelector(".flash-front .term");
      var def = document.querySelector(".flash-back .def");
      if (term) parts.push("Flashcard – begrep: " + term.textContent.trim());
      if (def) parts.push("Flashcard – forklaring: " + def.textContent.trim());
    } else if (!sec) {
      parts.push("Studenten er på forsiden/dashbordet i læresystemet for IDATT1005 Systemutvikling.");
    }
    if (!parts.length && content) parts.push(content.textContent.replace(/\s+/g, " ").trim().slice(0, 800));
    return parts.join("\n") || "Forsiden av læresystemet.";
  }

  /* ---- DOM ---- */
  var fab = App.h("button", { class: "chat-fab", type: "button", hidden: "", "aria-label": "Spør Claude om denne siden" },
    [App.h("span", { class: "cf-icon", "aria-hidden": "true" }, "💬"), App.h("span", { class: "cf-label" }, "Spør Claude")]);
  fab.addEventListener("click", openPanel);

  var ctxLabel = App.h("span", { class: "chat-ctx" }, "");
  var msgsEl = App.h("div", { class: "chat-msgs" });
  var ta = App.h("textarea", { class: "chat-ta", rows: "1", placeholder: "Spør om det du ser på …", "aria-label": "Skriv melding til Claude" });
  var sendBtn = App.h("button", { class: "btn chat-send", type: "submit" }, "Send");
  var form = App.h("form", { class: "chat-form" }, [ta, sendBtn]);
  var panel = App.h("aside", { class: "chat-panel", hidden: "", role: "dialog", "aria-label": "Chat med Claude" }, [
    App.h("div", { class: "chat-head" }, [
      App.h("div", { class: "chat-head-main" }, [App.h("strong", {}, "Spør Claude"), ctxLabel]),
      App.h("div", { class: "chat-head-btns" }, [
        App.h("button", { class: "chat-mini", type: "button", title: "Tøm samtalen", onclick: clearChat }, "Tøm"),
        App.h("button", { class: "chat-mini", type: "button", "aria-label": "Lukk chat", onclick: closePanel }, "✕")
      ])
    ]),
    msgsEl, form
  ]);

  form.addEventListener("submit", function (e) { e.preventDefault(); doSend(); });
  ta.addEventListener("keydown", function (e) { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); doSend(); } });
  ta.addEventListener("input", function () { ta.style.height = "auto"; ta.style.height = Math.min(ta.scrollHeight, 120) + "px"; });

  if (document.body) { document.body.appendChild(fab); document.body.appendChild(panel); }

  /* ---- Endre bredde (dra i venstre kant) ---- */
  var MINW = 320;
  function maxW() { return Math.min(900, Math.round(window.innerWidth * 0.92)); }
  function clampW(w) { return Math.max(MINW, Math.min(maxW(), w)); }
  (function () {
    var saved = parseInt((function () { try { return localStorage.getItem("sysu_chat_w"); } catch (e) { return ""; } })() || "", 10);
    if (saved) panel.style.setProperty("--chat-w", clampW(saved) + "px");
    var handle = App.h("div", { class: "chat-resize", title: "Dra for å endre bredde", "aria-hidden": "true" });
    panel.insertBefore(handle, panel.firstChild);
    var dragging = false;
    handle.addEventListener("pointerdown", function (e) {
      dragging = true; e.preventDefault();
      try { handle.setPointerCapture(e.pointerId); } catch (x) {}
      document.body.classList.add("chat-resizing");
    });
    handle.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      panel.style.setProperty("--chat-w", clampW(window.innerWidth - e.clientX) + "px");
    });
    function end() {
      if (!dragging) return;
      dragging = false;
      document.body.classList.remove("chat-resizing");
      var cur = parseInt(panel.style.getPropertyValue("--chat-w"), 10);
      try { if (cur) localStorage.setItem("sysu_chat_w", cur); } catch (x) {}
    }
    handle.addEventListener("pointerup", end);
    handle.addEventListener("pointercancel", end);
  })();

  /* ---- Visning ---- */
  function updateVisibility() {
    var show = enabled && allowedHere();
    fab.hidden = !show;
    if (!show && panelOpen) closePanel();
    if (panelOpen) updateLabel();
  }
  function updateLabel() { ctxLabel.textContent = "Kontekst: " + shortContext(); }

  function openPanel() {
    panelOpen = true; panel.hidden = false;
    requestAnimationFrame(function () { panel.classList.add("open"); });
    updateLabel(); renderMsgs(); setTimeout(function () { ta.focus(); }, 60);
  }
  function closePanel() {
    panelOpen = false; panel.classList.remove("open");
    setTimeout(function () { if (!panelOpen) panel.hidden = true; }, 220);
    try { fab.focus(); } catch (e) {}
  }
  function clearChat() { msgs = []; renderMsgs(); ta.focus(); }

  /* ---- Meldinger ---- */
  function renderMsgs() {
    App.clear(msgsEl);
    if (!msgs.length && !pending) {
      msgsEl.appendChild(App.h("div", { class: "chat-empty" }, [
        App.h("p", {}, "Hei! Spør meg om «" + shortContext() + "»."),
        App.h("p", { class: "muted", style: "font-size:12.5px;margin:0" }, "F.eks. «oppsummer dette kort», «forklar forskjellen på X og Y», eller «lag 3 quizspørsmål om dette».")
      ]));
    }
    msgs.forEach(function (m) {
      var b = App.h("div", { class: "chat-msg " + (m.role === "user" ? "me" : "ai") });
      if (m.role === "user") b.textContent = m.text; else b.innerHTML = App.mdLight(m.text);
      msgsEl.appendChild(b);
    });
    if (pending) msgsEl.appendChild(App.h("div", { class: "chat-msg ai typing" },
      [App.h("span", { class: "tdot" }), App.h("span", { class: "tdot" }), App.h("span", { class: "tdot" })]));
    msgsEl.scrollTop = msgsEl.scrollHeight;
  }

  function doSend() {
    var text = (ta.value || "").trim();
    if (!text || pending) return;
    msgs.push({ role: "user", text: text });
    ta.value = ""; ta.style.height = "auto";
    pending = true; renderMsgs();
    fetch("/api/chat", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ context: fullContext(), messages: msgs })
    }).then(function (r) {
      return r.json().then(function (d) { if (!r.ok) throw new Error(d.error || "Bro-feil"); return d; });
    }).then(function (d) {
      pending = false; msgs.push({ role: "assistant", text: d.reply || "(tomt svar)" }); renderMsgs();
    }).catch(function (e) {
      pending = false; msgs.push({ role: "assistant", text: "⚠️ Kunne ikke hente svar: " + (e.message || e) }); renderMsgs();
    });
  }

  /* ---- Oppstart ---- */
  window.addEventListener("hashchange", updateVisibility);
  enabled = !!App.bridge; // i tilfelle broen ble oppdaget før denne fila lastet
  updateVisibility();

  window.Chat = {
    setEnabled: function (v) { enabled = !!v; updateVisibility(); },
    refresh: updateVisibility
  };
})();
