/* ══════════════════════════════════════════
   BASURA JAYANIDU — THE QUARTERLY
   index.js
   ══════════════════════════════════════════ */
"use strict";

/* ─── PRECISION CURSOR ─────────────────────── */
(function initCursor() {
  const c = document.getElementById("precCursor");
  const label = document.getElementById("precCursorLabel");
  if (!c) return;

  let x = 0, y = 0;
  let cx = 0, cy = 0;

  document.addEventListener("mousemove", (e) => {
    x = e.clientX; y = e.clientY;
  });

  (function tick() {
    cx += (x - cx) * 0.18;
    cy += (y - cy) * 0.18;
    c.style.transform = `translate(${cx - 20}px, ${cy - 20}px)`;
    requestAnimationFrame(tick);
  })();

  const hovers = document.querySelectorAll(
    "a, button, [data-hover], .work-item, .col-channel, .pd, .spec-row, .press-card, input, textarea, select"
  );
  hovers.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      document.body.classList.add("cur-hover");
      // umpire flair: alternate IN / OUT on hover targets
      if (label) {
        const isInteractive = el.matches("a, button, .col-channel, .pd, .work-item");
        label.textContent = isInteractive ? "in" : "•";
      }
    });
    el.addEventListener("mouseleave", () => {
      document.body.classList.remove("cur-hover");
      if (label) label.textContent = "in";
    });
  });
})();

/* ─── MASTHEAD SCROLL STATE ────────────────── */
(function initMasthead() {
  const mast = document.getElementById("masthead");
  if (!mast) return;
  let raf;
  window.addEventListener("scroll", () => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      mast.classList.toggle("scrolled", window.scrollY > 20);
      raf = null;
    });
  }, { passive: true });
})();

/* ─── MOBILE NAV ───────────────────────────── */
(function initMobileNav() {
  const btn = document.getElementById("mastMenu");
  const nav = document.getElementById("mastNav");
  if (!btn || !nav) return;

  function toggle(open) {
    btn.classList.toggle("open", open);
    nav.classList.toggle("open", open);
    document.body.style.overflow = open ? "hidden" : "";
  }

  btn.addEventListener("click", () => toggle(!nav.classList.contains("open")));
  nav.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => toggle(false))
  );
})();

/* ─── ACTIVE NAV (SCROLL-SPY) ──────────────── */
(function initScrollSpy() {
  const sections = document.querySelectorAll("section[id]");
  const links = document.querySelectorAll(".mast-nav a");
  if (!sections.length || !links.length) return;

  const linkFor = (id) =>
    Array.from(links).find((l) => l.getAttribute("href") === "#" + id);

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((l) => l.classList.remove("active"));
        const l = linkFor(entry.target.id);
        if (l) l.classList.add("active");
      });
    },
    { rootMargin: "-40% 0px -50% 0px" }
  );
  sections.forEach((s) => io.observe(s));
})();

/* ─── REVEAL ON SCROLL ─────────────────────── */
(function initReveal() {
  const targets = document.querySelectorAll(
    ".cover-name, .cover-strap, .cover-cta, .cover-eyebrow, .sec-head, .manifesto-grid, .spec-table, .counters, .work-item, .court-grid, .press-slider, .col-grid, .work-foot"
  );

  targets.forEach((el, i) => {
    el.classList.add("r-up");
    el.style.setProperty("--d", `${(i % 5) * 0.06}s`);
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-vis");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );

  targets.forEach((el) => io.observe(el));
})();

/* ─── COUNTERS ─────────────────────────────── */
(function initCounters() {
  const nums = document.querySelectorAll(".ct-num[data-count]");
  if (!nums.length) return;

  function run(el, target, ms) {
    let start = null;
    function step(t) {
      if (!start) start = t;
      const p = Math.min((t - start) / ms, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(eased * target);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          run(entry.target, parseInt(entry.target.dataset.count, 10), 1600);
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  nums.forEach((n) => io.observe(n));
})();

/* ─── PRESS SLIDER ─────────────────────────── */
(function initPressSlider() {
  const slider = document.getElementById("pressSlider");
  const dotsEl = document.getElementById("pressDots");
  if (!slider || !dotsEl) return;

  const cards = slider.querySelectorAll(".press-card");
  const dots = dotsEl.querySelectorAll(".pd");
  let cur = 0;
  let timer;

  function goto(i) {
    cards[cur].classList.remove("active");
    dots[cur].classList.remove("active");
    cur = (i + cards.length) % cards.length;
    cards[cur].classList.add("active");
    dots[cur].classList.add("active");
  }
  function start() {
    clearInterval(timer);
    timer = setInterval(() => goto(cur + 1), 5500);
  }
  dots.forEach((d) =>
    d.addEventListener("click", () => {
      goto(parseInt(d.dataset.i, 10));
      start();
    })
  );
  start();
})();

/* ─── CONTACT FORM ─────────────────────────── */
(function initForm() {
  const form = document.getElementById("colForm");
  const success = document.getElementById("formSuccess");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const required = form.querySelectorAll("[required]");
    let valid = true;
    required.forEach((f) => {
      f.style.borderColor = "";
      if (!f.value.trim()) {
        f.style.borderColor = "var(--signal)";
        valid = false;
      }
    });
    if (!valid) return;

    const btn = form.querySelector(".btn-ink");
    const txt = btn.querySelector(".btn-txt");
    const orig = txt.textContent;
    btn.disabled = true;
    txt.textContent = "Sending…";

    // Replace with real endpoint / EmailJS in production
    setTimeout(() => {
      btn.disabled = false;
      txt.textContent = orig;
      form.reset();
      if (success) {
        success.classList.add("show");
        setTimeout(() => success.classList.remove("show"), 5000);
      }
    }, 1200);
  });
})();

/* ─── COVER NAME — LETTER WIGGLE ───────────── */
/* Small editorial touch: italicised name letters fan in on load */
(function initCoverEntrance() {
  const italic = document.querySelector(".cn-italic");
  if (!italic) return;
  const text = italic.firstChild?.textContent;
  if (!text) return;
  // Skip if already processed
  if (italic.dataset.processed) return;
  italic.dataset.processed = "1";

  const dot = italic.querySelector(".cn-dot");
  const dotHTML = dot ? dot.outerHTML : "";
  italic.innerHTML = text
    .split("")
    .map(
      (ch, i) =>
        `<span style="display:inline-block;opacity:0;transform:translateY(40px) rotate(${(i % 2 ? -8 : 6)}deg);transition:opacity 0.7s cubic-bezier(0.22,1,0.36,1) ${0.4 + i * 0.05}s, transform 0.7s cubic-bezier(0.22,1,0.36,1) ${0.4 + i * 0.05}s;">${ch === " " ? "&nbsp;" : ch}</span>`
    )
    .join("") + dotHTML;

  requestAnimationFrame(() => {
    italic.querySelectorAll("span").forEach((s) => {
      if (s.classList.contains("cn-dot")) return;
      s.style.opacity = "1";
      s.style.transform = "translateY(0) rotate(0)";
    });
  });
})();

/* ─── SMOOTH ANCHOR SCROLL WITH OFFSET ─────── */
(function initAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length < 2) return;
      const tgt = document.querySelector(id);
      if (!tgt) return;
      e.preventDefault();
      const top = tgt.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });
})();