(function () {
  var LEVELS = ["Semente", "Broto", "Folha", "Raiz", "Galho", "Árvore", "Floresta"];
  var LEVEL_IMGS = [
    "assets/app/nivel-1-semente.png",
    "assets/app/nivel-2-broto.png",
    "assets/app/nivel-3-folha.png",
    "assets/app/nivel-4-raiz.png",
    "assets/app/nivel-5-galho.png",
    "assets/app/nivel-6-arvore.png",
    "assets/app/nivel-7-floresta.png"
  ];
  var XP_STEP = 18;
  var reduced =
    document.documentElement.classList.contains("reduced-motion") ||
    (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
  var printMode = document.documentElement.classList.contains("print-mode");

  var xpFill = document.getElementById("xp-fill");
  var xpLevel = document.getElementById("xp-level");
  var xpPlant = document.getElementById("xp-plant");
  var phoneLevel = document.getElementById("phone-level");
  var phoneBar = document.getElementById("phone-bar");
  var phonePlant = document.getElementById("phone-plant");
  var phonePl = document.getElementById("phone-pl");
  var phoneRing = document.getElementById("phone-ring");
  var live = document.getElementById("pl-live");
  var celebrate = document.getElementById("app-celebrate");
  var confettiHost = document.getElementById("confetti-layer");
  var diaRing = document.getElementById("dia-ring");
  var diaLabel = document.getElementById("dia-label");

  var pl = 0;
  var scrollXp = 0;
  var levelIdx = 0;
  var forestDone = false;
  var moodDone = false;
  var doneCount = 0;

  try {
    var saved = localStorage.getItem("sefare-demo-pl");
    if (saved && !printMode) pl = parseInt(saved, 10) || 0;
  } catch (e) {}

  function savePl() {
    try { localStorage.setItem("sefare-demo-pl", String(pl)); } catch (e) {}
  }

  function announce(msg) {
    if (live) live.textContent = msg;
  }

  function floatPl(anchor, amount) {
    announce("+" + amount + " Energias Positivas");
    if (reduced || printMode || !anchor) return;
    var f = document.createElement("span");
    f.className = "pl-float";
    f.setAttribute("aria-hidden", "true");
    f.textContent = "+" + amount;
    anchor.style.position = "relative";
    anchor.appendChild(f);
    setTimeout(function () { f.remove(); }, 420);
  }

  function plantMini(i) {
    return '<img class="app-xp-plant" src="' + LEVEL_IMGS[i] + '" width="28" height="28" alt="">';
  }

  function plantBig(i) {
    return '<img class="phone-plant-img anim-breathe" style="--i:0" src="' + LEVEL_IMGS[i] + '" width="140" height="140" alt="">';
  }

  function syncUi() {
    var total = scrollXp + pl;
    var idx = Math.min(LEVELS.length - 1, Math.floor(total / XP_STEP));
    if (total >= XP_STEP * (LEVELS.length - 1)) idx = LEVELS.length - 1;
    var within = total - idx * XP_STEP;
    var pct = idx >= LEVELS.length - 1 ? 100 : Math.min(99, (within / XP_STEP) * 100);
    levelIdx = idx;
    if (xpLevel) xpLevel.textContent = LEVELS[idx];
    if (phoneLevel) phoneLevel.textContent = LEVELS[idx];
    if (xpFill) xpFill.style.width = (idx >= LEVELS.length - 1 ? 100 : (idx + pct / 100) / (LEVELS.length - 1) * 100).toFixed(1) + "%";
    if (phoneBar) phoneBar.style.width = pct.toFixed(1) + "%";
    if (xpPlant) xpPlant.innerHTML = plantMini(idx);
    if (phonePlant) phonePlant.innerHTML = plantBig(idx);
    if (phonePl) {
      if (reduced || printMode || phonePl.classList.contains("is-counted")) {
        phonePl.textContent = String(pl);
      } else {
        phonePl.setAttribute("data-count", String(pl));
        phonePl.textContent = String(pl);
      }
    }
    if (idx === LEVELS.length - 1 && !forestDone && !printMode) {
      forestDone = true;
      showCelebrate("Floresta — você chegou ao fim");
      burstConfetti();
      unlockSelo("floresta");
    }
  }

  function addPl(n, anchor) {
    pl += n;
    savePl();
    floatPl(anchor, n);
    syncUi();
  }

  function setDayProgress(n) {
    doneCount = n;
    var p = (n / 3) * 100;
    if (diaRing) diaRing.style.setProperty("--p", String(p));
    if (diaLabel) diaLabel.textContent = n + "/3";
    if (phoneRing) phoneRing.style.setProperty("--p", String(p));
  }

  function onScrollXp() {
    var doc = document.documentElement;
    var max = Math.max(1, doc.scrollHeight - window.innerHeight);
    var p = Math.min(1, window.scrollY / max);
    scrollXp = Math.round(p * 90);
    syncUi();
    if (p >= 0.98) unlockSelo("floresta");
  }

  function unlockSelo(id) {
    var el = document.querySelector('.selo[data-selo="' + id + '"]');
    if (!el || el.classList.contains("is-on")) return;
    el.classList.add("is-on");
    if (!printMode && !reduced) el.classList.add("is-burst");
    el.removeAttribute("title");
    var tip = el.querySelector("small");
    if (tip) tip.textContent = "Desbloqueado";
    setTimeout(function () { el.classList.remove("is-burst"); }, 400);
  }

  function showCelebrate(text) {
    announce(text);
    if (!celebrate || reduced || printMode) return;
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
      bit.style.setProperty("--x", Math.random() * 280 - 140 + "px");
      bit.style.setProperty("--y", Math.random() * -180 - 40 + "px");
      bit.style.left = 40 + Math.random() * 20 + "%";
      bit.style.animationDelay = Math.random() * 0.12 + "s";
      confettiHost.appendChild(bit);
      (function (b) { setTimeout(function () { b.remove(); }, 1100); })(bit);
    }
  }

  var moods = {
    pessimo: "Obrigado por marcar. Um passo por vez.",
    ruim: "Que bom te ver de volta — descanse o que puder.",
    neutro: "Tudo bem sentir um dia no meio.",
    bom: "Legal saber que você está bem hoje.",
    otimo: "Que bom te ver por aqui, com leveza."
  };
  var moodBtns = document.querySelectorAll(".mood-btn");
  var moodReply = document.getElementById("mood-reply");
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

  var missoes = document.querySelectorAll(".missao");
  missoes.forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (btn.classList.contains("is-done")) return;
      btn.classList.add("is-done");
      btn.setAttribute("aria-pressed", "true");
      setDayProgress(doneCount + 1);
      addPl(10, btn);
      if (doneCount === 1) unlockSelo("3dias");
      if (doneCount >= 2) unlockSelo("semana");
      if (doneCount === 3) {
        unlockSelo("dia");
        showCelebrate("Selo: Dia completo");
        burstConfetti();
        var diaSelo = document.querySelector('.selo[data-selo="dia"]');
        if (diaSelo && !reduced && !printMode) {
          diaSelo.classList.add("is-pop");
          setTimeout(function () { diaSelo.classList.remove("is-pop"); }, 500);
        }
      }
    });
  });

  if (printMode) {
    pl = 30;
    scrollXp = 50;
    syncUi();
    var bem = document.querySelector('.mood-btn[data-mood="bom"]');
    if (bem) bem.classList.add("is-active");
    if (moodReply) moodReply.textContent = moods.bom;
    moodDone = true;
    missoes.forEach(function (btn, i) {
      if (i < 2) {
        btn.classList.add("is-done");
        btn.setAttribute("aria-pressed", "true");
      }
    });
    setDayProgress(2);
    unlockSelo("primeiro");
    unlockSelo("3dias");
  } else {
    syncUi();
    onScrollXp();
    window.addEventListener("scroll", onScrollXp, { passive: true });
  }
})();
