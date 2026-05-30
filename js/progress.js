/* Fremdrift lagret i localStorage. Ett objekt under én nøkkel. */
(function () {
  "use strict";
  var KEY = "sysu_progress_v1";

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }
  function save(state) {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
  }
  function defaults(s) {
    s.topicsRead = s.topicsRead || {};      // { topicId: true }
    s.quiz = s.quiz || {};                   // { topicId: { best, lastTotal, attempts } }
    s.cards = s.cards || {};                 // { cardId: { box: 1..5, seen } }
    s.exams = s.exams || {};                 // { examItemId: true }
    s.sim = s.sim || {};                     // { lastScore, attempts }
    return s;
  }

  var Progress = {
    all: function () { return defaults(load()); },

    /* ---- Tema lest ---- */
    markTopicRead: function (id) {
      var s = defaults(load());
      s.topicsRead[id] = true; save(s);
    },
    isTopicRead: function (id) { return !!defaults(load()).topicsRead[id]; },
    topicsReadCount: function () { return Object.keys(defaults(load()).topicsRead).length; },

    /* ---- Quiz ---- */
    recordQuiz: function (topicId, score, total) {
      var s = defaults(load());
      var q = s.quiz[topicId] || { best: 0, lastTotal: total, attempts: 0 };
      q.attempts += 1;
      q.lastTotal = total;
      var pct = total ? score / total : 0;
      if (pct >= (q.best || 0)) q.best = pct;
      s.quiz[topicId] = q; save(s);
    },
    quizBest: function (topicId) {
      var q = defaults(load()).quiz[topicId];
      return q ? q.best : null;
    },

    /* ---- Flashcards (Leitner 1..5) ---- */
    cardBox: function (cardId) {
      var c = defaults(load()).cards[cardId];
      return c ? c.box : 1;
    },
    setCardBox: function (cardId, box) {
      var s = defaults(load());
      box = Math.max(1, Math.min(5, box));
      s.cards[cardId] = { box: box, seen: Date.now() };
      save(s);
    },
    cardStats: function (allIds) {
      var s = defaults(load());
      var mastered = 0, seen = 0, boxSum = 0;
      allIds.forEach(function (id) {
        var c = s.cards[id];
        var box = c ? c.box : 1;
        boxSum += (box - 1);               // 0..4 per kort = læringsstyrke (boks 1 = 0)
        if (c) { seen++; if (box >= 5) mastered++; }
      });
      var total = allIds.length;
      // Finkornet fremgang: beveger seg etter HVER økt, ikke bare når et kort når boks 5
      var progress = total ? Math.round(boxSum / (total * 4) * 100) : 0;
      return { mastered: mastered, seen: seen, total: total, progress: progress };
    },

    /* ---- Eksamen ---- */
    markExamDone: function (id) {
      var s = defaults(load());
      s.exams[id] = true; save(s);
    },
    isExamDone: function (id) { return !!defaults(load()).exams[id]; },
    examDoneCount: function () { return Object.keys(defaults(load()).exams).length; },
    recordSim: function (score) {
      var s = defaults(load());
      s.sim.attempts = (s.sim.attempts || 0) + 1;
      s.sim.lastScore = score;
      save(s);
    },
    simStats: function () { return defaults(load()).sim; },

    reset: function () {
      try { localStorage.removeItem(KEY); } catch (e) {}
    }
  };

  window.Progress = Progress;
})();
