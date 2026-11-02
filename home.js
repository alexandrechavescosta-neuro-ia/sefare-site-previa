/* Sefare home — JS leve, sem libs */
(function () {
  "use strict";

  var doc = document.documentElement;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isPrint = /(?:\?|&)print=1(?:&|$)/.test(location.search);

  doc.classList.add("js");
  if (reduced) doc.classList.add("reduced-motion");
  if (isPrint) doc.classList.add("print-mode");

  /* ——— Menu móvel (igual às outras páginas) ——— */
  (function navToggle() {
    var btn = document.querySelector(".nav-toggle");
    var nav = document.getElementById("menu-principal");
    if (!btn || !nav) return;
    btn.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      btn.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    });
  })();

  /* ——— Reveal ——— */
  function revealAll() {
    document.querySelectorAll(".reveal").forEach(function (el) {
      el.classList.add("is-in");
    });
    document.querySelectorAll(".draw-line").forEach(function (el) {
      el.classList.add("is-drawn");
    });
    document.querySelectorAll(".chart-grow").forEach(function (el) {
      el.classList.add("is-grown");
    });
    document.querySelectorAll(".pulse-path").forEach(function (el) {
      el.classList.add("is-pulsing");
    });
  }

  if (isPrint || reduced) {
    revealAll();
  } else if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var delay = el.getAttribute("data-delay");
          if (delay) el.style.transitionDelay = delay + "ms";
          el.classList.add("is-in");
          if (el.classList.contains("draw-line") || el.querySelector(".draw-line")) {
            (el.classList.contains("draw-line") ? el : el.querySelector(".draw-line")).classList.add("is-drawn");
          }
          if (el.classList.contains("chart-grow") || el.querySelector(".chart-grow")) {
            var charts = el.classList.contains("chart-grow")
              ? [el]
              : el.querySelectorAll(".chart-grow");
            charts.forEach(function (c) {
              c.classList.add("is-grown");
            });
          }
          if (el.classList.contains("pulse-path") || el.querySelector(".pulse-path")) {
            var pulses = el.classList.contains("pulse-path")
              ? [el]
              : el.querySelectorAll(".pulse-path");
            pulses.forEach(function (p) {
              p.classList.add("is-pulsing");
            });
          }
          io.unobserve(el);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    document.querySelectorAll(".reveal, .draw-trigger, .chart-trigger").forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealAll();
  }

  /* ——— Hero network stroke lengths ——— */
  (function initNetwork() {
    var paths = document.querySelectorAll(".hero-net-path");
    paths.forEach(function (p) {
      try {
        var len = p.getTotalLength();
        p.style.setProperty("--dash", String(len));
        p.style.strokeDasharray = String(len);
        if (isPrint || reduced) {
          p.style.strokeDashoffset = "0";
          p.classList.add("is-drawn");
        } else {
          p.style.strokeDashoffset = String(len);
          requestAnimationFrame(function () {
            p.classList.add("is-drawn");
          });
        }
      } catch (e) {
        /* SVG length unavailable */
      }
    });
  })();

  /* ——— Parallax mouse + scroll (desktop) ——— */
  if (!reduced && !isPrint && window.matchMedia("(pointer: fine)").matches) {
    var hero = document.querySelector(".home-hero");
    var glow = document.querySelector(".cursor-glow");
    var layers = document.querySelectorAll("[data-parallax]");

    if (hero && glow) {
      hero.addEventListener("mousemove", function (e) {
        var r = hero.getBoundingClientRect();
        var x = ((e.clientX - r.left) / r.width) * 100;
        var y = ((e.clientY - r.top) / r.height) * 100;
        glow.style.setProperty("--gx", x + "%");
        glow.style.setProperty("--gy", y + "%");
        glow.classList.add("is-on");
      });
      hero.addEventListener("mouseleave", function () {
        glow.classList.remove("is-on");
      });
    }

    var ticking = false;
    function updateParallax() {
      ticking = false;
      var sy = window.scrollY || 0;
      layers.forEach(function (layer) {
        var speed = parseFloat(layer.getAttribute("data-parallax")) || 0.08;
        var mx = parseFloat(layer.getAttribute("data-mx")) || 0;
        var my = parseFloat(layer.getAttribute("data-my")) || 0;
        var y = sy * speed;
        layer.style.transform =
          "translate3d(" + mx + "px," + (my + y) + "px,0)";
      });
    }

    if (hero) {
      hero.addEventListener("mousemove", function (e) {
        var r = hero.getBoundingClientRect();
        var dx = (e.clientX - r.left) / r.width - 0.5;
        var dy = (e.clientY - r.top) / r.height - 0.5;
        layers.forEach(function (layer) {
          var depth = parseFloat(layer.getAttribute("data-depth")) || 12;
          layer.setAttribute("data-mx", String((-dx * depth).toFixed(2)));
          layer.setAttribute("data-my", String((-dy * depth).toFixed(2)));
        });
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(updateParallax);
        }
      });
    }

    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(updateParallax);
        }
      },
      { passive: true }
    );
    updateParallax();
  }

  /* ——— Steps line draw length ——— */
  (function initStepsLine() {
    var line = document.querySelector(".steps-draw-path");
    if (!line) return;
    try {
      var len = line.getTotalLength();
      line.style.setProperty("--dash", String(len));
      line.style.strokeDasharray = String(len);
      if (isPrint || reduced) {
        line.style.strokeDashoffset = "0";
        line.classList.add("is-drawn");
      } else {
        line.style.strokeDashoffset = String(len);
      }
    } catch (e) {
      /* ignore */
    }
  })();
})();
