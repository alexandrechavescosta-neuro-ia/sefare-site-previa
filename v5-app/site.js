(function () {
  var h = document.documentElement;
  h.classList.add("js");
  if (/(?:^\?|&)print=1(?:&|$)/.test(location.search || "")) h.classList.add("print-mode");
  if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) {
    h.classList.add("reduced-motion");
  }

  var btn = document.querySelector(".nav-toggle");
  var nav = document.getElementById("menu-principal");
  if (btn && nav) {
    btn.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      btn.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    });
  }

  var printMode = h.classList.contains("print-mode");
  var reduced = h.classList.contains("reduced-motion");

  var reveals = document.querySelectorAll(".reveal");
  if (printMode || reduced || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach(function (el) { io.observe(el); });
  }

  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-count") || "0");
    var prefix = el.getAttribute("data-prefix") || "";
    var suffix = el.getAttribute("data-suffix") || "";
    var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
    var format = el.getAttribute("data-format") || "";

    function formatVal(n) {
      if (format === "br") {
        return Math.round(n).toLocaleString("pt-BR");
      }
      if (decimals > 0) return n.toFixed(decimals);
      return String(Math.round(n));
    }

    if (printMode || reduced) {
      el.textContent = prefix + formatVal(target) + suffix;
      return;
    }

    var start = null;
    var dur = 900;
    function frame(ts) {
      if (!start) start = ts;
      var p = Math.min(1, (ts - start) / dur);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + formatVal(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  var counters = document.querySelectorAll("[data-count]");
  if (printMode || reduced || !("IntersectionObserver" in window)) {
    counters.forEach(animateCount);
  } else {
    var cio = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            cio.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.35 }
    );
    counters.forEach(function (el) { cio.observe(el); });
  }
})();
