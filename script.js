gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Scroll progress */
const scrollProgress = document.querySelector(".scroll-progress");
function updateScrollProgress() {
  if (!scrollProgress) return;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const p = max > 0 ? (window.scrollY / max) * 100 : 0;
  scrollProgress.style.width = `${p}%`;
  scrollProgress.setAttribute("aria-valuenow", Math.round(p));
}
window.addEventListener("scroll", updateScrollProgress, { passive: true });
updateScrollProgress();

/* Footer year */
const yearEl = document.querySelector(".footer-year");
if (yearEl) {
  yearEl.textContent = `© ${new Date().getFullYear()} Atelier Muse`;
}

/* Mobile navigation */
const nav = document.querySelector(".nav");
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

function setNavOpen(open) {
  if (!nav || !navToggle) return;
  nav.classList.toggle("nav-open", open);
  navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    setNavOpen(!nav.classList.contains("nav-open"));
  });
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setNavOpen(false));
  });
  document.addEventListener("click", (e) => {
    if (nav.classList.contains("nav-open") && !nav.contains(e.target)) {
      setNavOpen(false);
    }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setNavOpen(false);
  });
}

/* Toast */
function showToast(message, variant = "default") {
  const region = document.getElementById("toastRegion");
  if (!region) {
    window.alert(message);
    return;
  }
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.setAttribute("role", "status");
  if (variant === "error") toast.style.borderColor = "rgba(248, 113, 113, 0.45)";
  toast.textContent = message;
  region.appendChild(toast);
  const remove = () => {
    toast.classList.add("toast-out");
    toast.addEventListener("animationend", () => toast.remove(), { once: true });
  };
  window.setTimeout(remove, 4200);
}

/* Intro timeline */
if (!prefersReducedMotion) {
  const tl = gsap.timeline();
  tl.from(".nav.gs-reveal-down", {
    y: -40,
    opacity: 0,
    duration: 0.9,
    ease: "power3.out",
  })
    .from(
      ".gs-reveal-up",
      {
        y: 28,
        opacity: 0,
        duration: 0.85,
        stagger: 0.12,
        ease: "power3.out",
      },
      "-=0.45"
    )
    .from(
      ".gs-reveal-scale",
      {
        scale: 0.94,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        clearProps: "all",
      },
      "-=0.65"
    );
} else {
  gsap.set([".nav.gs-reveal-down", ".gs-reveal-up", ".gs-reveal-scale"], { clearProps: "all" });
}

/* Scroll reveals */
if (!prefersReducedMotion) {
  gsap.utils.toArray(".gs-scroll").forEach((element) => {
    gsap.from(element, {
      scrollTrigger: {
        trigger: element,
        start: "top 88%",
        toggleActions: "play none none reverse",
      },
      y: 36,
      opacity: 0,
      duration: 0.9,
      ease: "power3.out",
    });
  });
}

/* Stat counters — single ScrollTrigger for the strip */
const statsGrid = document.querySelector(".stats-grid");
const statEls = document.querySelectorAll(".stat-value[data-count]");
if (statsGrid && statEls.length && !prefersReducedMotion) {
  const tlStats = gsap.timeline({
    scrollTrigger: {
      trigger: statsGrid,
      start: "top 82%",
      once: true,
    },
  });
  statEls.forEach((el) => {
    const target = parseInt(el.getAttribute("data-count"), 10);
    if (Number.isNaN(target)) return;
    const obj = { val: 0 };
    tlStats.to(
      obj,
      {
        val: target,
        duration: 2,
        ease: "power2.out",
        onUpdate: () => {
          el.textContent = Math.round(obj.val).toString();
        },
      },
      0
    );
  });
} else {
  statEls.forEach((el) => {
    const target = parseInt(el.getAttribute("data-count"), 10);
    if (!Number.isNaN(target)) el.textContent = String(target);
  });
}

/* Gallery filter */
const filterButtons = document.querySelectorAll(".filter-btn");
const artCards = document.querySelectorAll(".art-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedFilter = button.dataset.filter;

    filterButtons.forEach((item) => {
      item.classList.remove("active");
      item.setAttribute("aria-pressed", "false");
    });
    button.classList.add("active");
    button.setAttribute("aria-pressed", "true");

    artCards.forEach((card) => {
      const matches = selectedFilter === "all" || card.dataset.category === selectedFilter;

      if (matches) {
        card.classList.remove("hidden-filter");
        if (!prefersReducedMotion) {
          gsap.fromTo(
            card,
            { scale: 0.96, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.45, ease: "power2.out" }
          );
        } else {
          gsap.set(card, { clearProps: "all" });
        }
      } else if (!prefersReducedMotion) {
        gsap.to(card, {
          scale: 0.94,
          opacity: 0,
          duration: 0.28,
          ease: "power2.in",
          onComplete: () => card.classList.add("hidden-filter"),
        });
      } else {
        card.classList.add("hidden-filter");
      }
    });

    ScrollTrigger.refresh();
  });
});

filterButtons.forEach((btn) => {
  if (btn.classList.contains("active")) btn.setAttribute("aria-pressed", "true");
  else btn.setAttribute("aria-pressed", "false");
});

/* Visit form */
const visitForm = document.getElementById("visitForm");
if (visitForm) {
  visitForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(visitForm);
    const name = (fd.get("name") || "").toString().trim();
    const email = (fd.get("email") || "").toString().trim();
    if (name && email) {
      showToast("Thank you — your invitation request has been received. We will be in touch soon.");
      visitForm.reset();
    } else {
      showToast("Please enter your name and email so we can send your invitation.", "error");
    }
  });
}

/* Subtle parallax on atmosphere (pointer) */
const glows = document.querySelectorAll(".bg-glow");
if (!prefersReducedMotion && glows.length) {
  let tx = 0;
  let ty = 0;
  let cx = 0;
  let cy = 0;
  window.addEventListener(
    "pointermove",
    (e) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 18;
      ty = (e.clientY / window.innerHeight - 0.5) * 18;
    },
    { passive: true }
  );
  gsap.ticker.add(() => {
    cx += (tx - cx) * 0.04;
    cy += (ty - cy) * 0.04;
    glows.forEach((g, i) => {
      const m = i === 1 ? -0.6 : i === 2 ? 0.35 : 1;
      gsap.set(g, { x: cx * m, y: cy * m });
    });
  });
}
