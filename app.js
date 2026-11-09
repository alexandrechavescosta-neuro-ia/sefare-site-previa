(function () {
  var LEVELS = ["Semente", "Broto", "Raiz", "Folha", "Flor", "Árvore", "Floresta"];
  var reduced =
    document.documentElement.classList.contains("reduced-motion") ||
    (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
  var printMode = document.documentElement.classList.contains("print-mode");

  var xpFill = document.getElementById("xp-fill");
  var xpLevel = document.getElementById("xp-level");
  var xpPlant = document.getElementById("xp-plant");
  var live = document.getElementById("pl-live");
  var celebrate = document.getElementById("app-celebrate");
  var confettiHost = document.getElementById("confetti-layer");
  var diaRing = document.getElementById("dia-ring");
  var diaLabel = document.getElementById("dia-label");
  var plStat = document.getElementById("stat-pl");

  var pl = 0;
  try {
    var saved = localStorage.getItem("sefare-demo-pl");
    if (saved) pl = parseInt(saved, 10) || 0;
  } catch (e) {}

  function savePl() {
    try { localStorage.setItem("sefare-demo-pl", String(pl)); } catch (e) {}
  }

  function announce(msg) {
    if (!live) return;
    live.textContent = msg;
  }

  function floatPl(anchor, amount) {
    announce("+" + amount + " PL");
    if (reduced || !anchor) return;
    var f = document.createElement("span");
    f.className = "pl-float";
    f.setAttribute("aria-hidden", "true");
    f.textContent = "+" + amount + " PL";
    anchor.style.position = "relative";
    anchor.appendChild(f);
    setTimeout(function () { f.remove(); }, 420);
  }

  function addPl(n, anchor) {
    pl += n;
    savePl();
    if (plStat) plStat.setAttribute("data-count", String(pl));
    if (plStat && (plStat.classList.contains("is-counted") || printMode || reduced)) {
      plStat.textContent = String(pl);
    }
    floatPl(anchor, n);
    updateSelos();
  }

  function plantSvg(stage) {
    var stems = [
      '<path d="M12 22v-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
      '<path d="M12 22v-8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="12" r="2.2" fill="currentColor"/>',
      '<path d="M12 22v-10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M12 14c-3-1-4-3-4-5" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round"/>',
      '<path d="M12 22v-11" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M12 13c-3.5-1-5-3.5-5-6M12 13c3.5-1 5-3.5 5-6" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round"/>',
      '<path d="M12 22v-12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><ellipse cx="8" cy="10" rx="3.2" ry="4" fill="currentColor" opacity=".85"/><ellipse cx="16" cy="10" rx="3.2" ry="4" fill="currentColor" opacity=".85"/><circle cx="12" cy="8" r="2.4" fill="currentColor"/>',
      '<path d="M12 22v-13" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><path d="M12 14c-4-2-6-5-5-9M12 14c4-2 6-5 5-9" stroke="currentColor" stroke-width="1.8" fill="none"/><circle cx="12" cy="7" r="3" fill="currentColor"/>',
      '<path d="M12 22v-14" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><path d="M12 15c-5-2-7-6-6-11M12 15c5-2 7-6 6-11M7 12c2 .5 3 .5 5 0M17 12c-2 .5-3 .5-5 0" stroke="currentColor" stroke-width="1.6" fill="none"/><circle cx="12" cy="6" r="3.4" fill="currentColor"/>'
    ];
    return (
      '<svg class="app-xp-plant" viewBox="0 0 24 24" aria-hidden="true" focusable="false" style="color:#6761F0">' +
      stems[Math.min(stage, stems.length - 1)] +
      "</svg>"
    );
  }

  function setLevel(idx) {
    if (xpLevel) xpLevel.textContent = LEVELS[idx];
    if (xpPlant) xpPlant.innerHTML = plantSvg(idx);
  }

  var forestDone = false;
  function onScrollXp() {
    var doc = document.documentElement;
    var max = Math.max(1, doc.scrollHeight - window.innerHeight);
    var p = Math.min(1, window.scrollY / max);
    if (xpFill) xpFill.style.width = (p * 100).toFixed(1) + "%";
    var idx = Math.min(LEVELS.length - 1, Math.floor(p * LEVELS.length));
    if (p >= 0.995) idx = LEVELS.length - 1;
    setLevel(idx);
    if (idx === LEVELS.length - 1 && !forestDone && p >= 0.98) {
      forestDone = true;
      showCelebrate("Floresta — você chegou ao fim");
      burstConfetti();
      unlockSelo("floresta");
    }
  }

  if (printMode) {
    if (xpFill) xpFill.style.width = "100%";
    setLevel(LEVELS.length - 1);
  } else {
    setLevel(0);
    onScrollXp();
    window.addEventListener("scroll", onScrollXp, { passive: true });
  }

  /* Humor */
  var moods = {
    calmo: "Que bom te ver por aqui, com calma.",
    bem: "Legal saber que você está bem hoje.",
    neutro: "Tudo bem sentir um dia no meio.",
    cansado: "Que bom te ver de volta — descanse o que puder.",
    pesado: "Obrigado por marcar. Um passo por vez."
  };
  var moodBtns = document.querySelectorAll(".mood-btn");
  var moodReply = document.getElementById("mood-reply");
  var moodDone = false;
  moodBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      moodBtns.forEach(function (b) { b.classList.remove("is-active"); });
      btn.classList.add("is-active");
      var key = btn.getAttribute("data-mood");
      if (moodReply) moodReply.textContent = moods[key] || "";
      if (!moodDone) {
        moodDone = true;
        addPl(10, btn);
        unlockSelo("primeiro");
      }
    });
  });

  /* Missões */
  var missoes = document.querySelectorAll(".missao");
  var doneCount = 0;
  missoes.forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (btn.classList.contains("is-done")) return;
      btn.classList.add("is-done");
      btn.setAttribute("aria-pressed", "true");
      doneCount += 1;
      addPl(10, btn);
      if (diaRing) diaRing.style.setProperty("--p", String((doneCount / 3) * 100));
      if (diaLabel) diaLabel.textContent = doneCount + "/3";
      if (doneCount === 1) unlockSelo("3dias");
      if (doneCount >= 2) unlockSelo("semana");
      if (doneCount === 3) {
        unlockSelo("dia");
        showCelebrate("Selo: Dia completo");
        burstConfetti();
      }
    });
  });

  function unlockSelo(id) {
    var el = document.querySelector('.selo[data-selo="' + id + '"]');
    if (!el || el.classList.contains("is-on")) return;
    el.classList.add("is-on");
    el.classList.add("is-burst");
    el.removeAttribute("title");
    var tip = el.querySelector("small");
    if (tip) tip.textContent = "Desbloqueado";
    setTimeout(function () { el.classList.remove("is-burst"); }, 400);
  }

  function updateSelos() {
    if (pl >= 10) unlockSelo("primeiro");
  }

  function showCelebrate(text) {
    announce(text);
    if (!celebrate || reduced) return;
    celebrate.textContent = text;
    celebrate.classList.add("is-on");
    setTimeout(function () { celebrate.classList.remove("is-on"); }, 1600);
  }

  function burstConfetti() {
    if (reduced || printMode || !confettiHost) return;
    var colors = ["#6761F0", "#3C8CEE", "#F7F7FC", "#a78bfa", "#60a5fa"];
    var n = window.innerWidth < 600 ? 14 : 22;
    for (var i = 0; i < n; i++) {
      var bit = document.createElement("span");
      bit.className = "confetti-bit";
      bit.style.background = colors[i % colors.length];
      bit.style.setProperty("--x", (Math.random() * 280 - 140) + "px");
      bit.style.setProperty("--y", (Math.random() * -180 - 40) + "px");
      bit.style.left = 40 + Math.random() * 20 + "%";
      bit.style.animationDelay = (Math.random() * 0.12) + "s";
      confettiHost.appendChild(bit);
      (function (b) {
        setTimeout(function () { b.remove(); }, 1100);
      })(bit);
    }
  }

  /* Contadores da demo */
  if (plStat) {
    plStat.setAttribute("data-count", String(Math.max(pl, 30)));
  }

  if (printMode) {
    document.querySelectorAll(".selo").forEach(function (s) {
      s.classList.add("is-on");
      var tip = s.querySelector("small");
      if (tip) tip.textContent = "Desbloqueado";
    });
    if (diaRing) diaRing.style.setProperty("--p", "100");
    if (diaLabel) diaLabel.textContent = "3/3";
  }
})();
