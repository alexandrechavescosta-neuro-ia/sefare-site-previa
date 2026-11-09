(function () {
  var LEVELS = ["Semente", "Broto", "Raiz", "Folha", "Flor", "Árvore", "Floresta"];
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
    announce("+" + amount + " PL");
    if (reduced || printMode || !anchor) return;
    var f = document.createElement("span");
    f.className = "pl-float";
    f.setAttribute("aria-hidden", "true");
    f.textContent = "+" + amount + " PL";
    anchor.style.position = "relative";
    anchor.appendChild(f);
    setTimeout(function () { f.remove(); }, 420);
  }

  function plantMini(i) {
    var p = [
      '<path d="M12 20v-3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><ellipse cx="12" cy="15" rx="3.2" ry="2.2" fill="currentColor"/>',
      '<path d="M12 22v-8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M12 14c-2.5-1-3.5-2.8-3.2-4.5" stroke="currentColor" stroke-width="1.7" fill="none" stroke-linecap="round"/><circle cx="12" cy="12.5" r="1.6" fill="currentColor"/>',
      '<path d="M12 22v-10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M12 16c-3.5 1.5-5 4-5.5 6M12 16c3.5 1.5 5 4 5.5 6" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/><path d="M12 13c-3-1-4.2-3-4-5" stroke="currentColor" stroke-width="1.7" fill="none"/>',
      '<path d="M12 22v-11" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M12 13c-3.8-1-5.5-3.5-5.2-6.2M12 13c3.8-1 5.5-3.5 5.2-6.2" stroke="currentColor" stroke-width="1.7" fill="none" stroke-linecap="round"/><ellipse cx="8.5" cy="9" rx="2.4" ry="3.2" fill="currentColor" opacity=".9"/><ellipse cx="15.5" cy="9" rx="2.4" ry="3.2" fill="currentColor" opacity=".9"/>',
      '<path d="M12 22v-12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="8" r="3.4" fill="currentColor"/><circle cx="8.2" cy="9.5" r="2.2" fill="currentColor" opacity=".85"/><circle cx="15.8" cy="9.5" r="2.2" fill="currentColor" opacity=".85"/><circle cx="12" cy="8" r="1.2" fill="#fff" opacity=".55"/>',
      '<path d="M12 22v-13" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><path d="M12 14c-4.5-2-6.5-5.2-5.5-9.2M12 14c4.5-2 6.5-5.2 5.5-9.2" stroke="currentColor" stroke-width="1.7" fill="none"/><ellipse cx="12" cy="7.2" rx="5" ry="4.2" fill="currentColor"/>',
      '<path d="M7 22v-8M12 22v-11M17 22v-8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><ellipse cx="7" cy="11" rx="3.2" ry="3" fill="currentColor"/><ellipse cx="12" cy="8" rx="4.2" ry="3.6" fill="currentColor"/><ellipse cx="17" cy="11.2" rx="3.2" ry="3" fill="currentColor"/>'
    ];
    return '<svg class="app-xp-plant" viewBox="0 0 24 24" focusable="false" style="color:#6761F0">' + p[i] + "</svg>";
  }

  function plantBig(i) {
    var p = [
      '<ellipse cx="60" cy="108" rx="28" ry="6" fill="#2a2a4a"/><ellipse cx="60" cy="88" rx="14" ry="10" fill="#a78bfa"/><ellipse cx="60" cy="88" rx="8" ry="6" fill="#6761F0"/>',
      '<ellipse cx="60" cy="112" rx="30" ry="5" fill="#2a2a4a"/><path d="M60 108V62" stroke="#7c9a6e" stroke-width="4" stroke-linecap="round"/><path d="M60 78c-14-6-18-16-14-26" fill="none" stroke="#8fd17a" stroke-width="5" stroke-linecap="round"/><circle cx="60" cy="68" r="5" fill="#9ae37a"/>',
      '<ellipse cx="60" cy="112" rx="32" ry="5" fill="#2a2a4a"/><path d="M60 108V48" stroke="#6f8f5e" stroke-width="4.5" stroke-linecap="round"/><path d="M60 78c-18 10-26 24-28 34M60 78c18 10 26 24 28 34" fill="none" stroke="#8b6b4a" stroke-width="3" stroke-linecap="round"/><path d="M60 62c-16-8-20-18-16-30" fill="none" stroke="#7ec86a" stroke-width="5" stroke-linecap="round"/><circle cx="48" cy="42" r="7" fill="#7ec86a"/>',
      '<ellipse cx="60" cy="112" rx="34" ry="5" fill="#2a2a4a"/><path d="M60 108V42" stroke="#5f8550" stroke-width="5" stroke-linecap="round"/><ellipse cx="42" cy="52" rx="16" ry="22" fill="#6fcf63" transform="rotate(-28 42 52)"/><ellipse cx="78" cy="52" rx="16" ry="22" fill="#5ebd55" transform="rotate(28 78 52)"/><ellipse cx="60" cy="38" rx="14" ry="18" fill="#8be07a"/>',
      '<ellipse cx="60" cy="112" rx="34" ry="5" fill="#2a2a4a"/><path d="M60 108V55" stroke="#5f8550" stroke-width="5" stroke-linecap="round"/><ellipse cx="44" cy="58" rx="12" ry="16" fill="#6fcf63" transform="rotate(-20 44 58)"/><ellipse cx="76" cy="58" rx="12" ry="16" fill="#5ebd55" transform="rotate(20 76 58)"/><circle cx="60" cy="40" r="18" fill="#f0a0d8"/><circle cx="48" cy="36" r="10" fill="#e878c0"/><circle cx="72" cy="36" r="10" fill="#e878c0"/><circle cx="60" cy="28" r="10" fill="#f5b8e4"/><circle cx="60" cy="40" r="6" fill="#ffe08a"/>',
      '<ellipse cx="60" cy="112" rx="36" ry="5" fill="#2a2a4a"/><path d="M60 108V48" stroke="#6b4f32" stroke-width="7" stroke-linecap="round"/><path d="M60 78c-10-2-18 2-22 10M60 70c8-1 16 3 20 10" fill="none" stroke="#6b4f32" stroke-width="4" stroke-linecap="round"/><ellipse cx="60" cy="42" rx="28" ry="24" fill="#4caf50"/><ellipse cx="42" cy="50" rx="16" ry="14" fill="#66bb6a"/><ellipse cx="78" cy="50" rx="16" ry="14" fill="#43a047"/><ellipse cx="60" cy="28" rx="14" ry="12" fill="#81c784"/>',
      '<ellipse cx="60" cy="112" rx="40" ry="5" fill="#2a2a4a"/><path d="M28 108V68M60 108V42M92 108V70" stroke="#6b4f32" stroke-width="5" stroke-linecap="round"/><ellipse cx="28" cy="58" rx="16" ry="14" fill="#66bb6a"/><ellipse cx="60" cy="36" rx="24" ry="20" fill="#43a047"/><ellipse cx="92" cy="60" rx="16" ry="14" fill="#4caf50"/><ellipse cx="46" cy="48" rx="12" ry="10" fill="#81c784"/><ellipse cx="74" cy="50" rx="12" ry="10" fill="#66bb6a"/><circle cx="18" cy="78" r="7" fill="#7ec86a"/><circle cx="102" cy="80" r="7" fill="#7ec86a"/>'
    ];
    return '<svg class="phone-plant-svg" viewBox="0 0 120 120" focusable="false">' + p[i] + "</svg>";
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
    calmo: "Que bom te ver por aqui, com calma.",
    bem: "Legal saber que você está bem hoje.",
    neutro: "Tudo bem sentir um dia no meio.",
    cansado: "Que bom te ver de volta — descanse o que puder.",
    pesado: "Obrigado por marcar. Um passo por vez."
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
    var bem = document.querySelector('.mood-btn[data-mood="bem"]');
    if (bem) bem.classList.add("is-active");
    if (moodReply) moodReply.textContent = moods.bem;
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
