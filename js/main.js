const DEFAULT_LANG = "pt-br";
const lang = document.documentElement.lang === "en" ? "en" : DEFAULT_LANG;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const favicon = document.getElementById("favicon");
const inactiveFavicons = ["👀", "☕", "🚀"];
const home = document.getElementById("home");
const homeInner = document.getElementById("home-inner");
const heroTitle = document.getElementById("hero-title");
const heroDescription = document.getElementById("hero-description");
const inkCanvas = document.getElementById("ink-canvas");
const ink = !prefersReducedMotion && inkCanvas && window.createInk ? window.createInk(inkCanvas) : null;
const experiencePanel = document.getElementById("experience-panel");
const experienceContent = experiencePanel?.querySelector(".experience-panel-content");
const experienceOpen = document.getElementById("experience-open");
const experienceClose = document.getElementById("experience-close");

let faviconInterval = null;
let faviconIndex = 0;
let experienceTimeline = null;
let isExperienceOpen = false;

function createEmojiFavicon(emoji) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">${emoji}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function setFavicon(emoji) {
  favicon.href = createEmojiFavicon(emoji);
}

function showActiveFavicon() {
  clearInterval(faviconInterval);
  faviconInterval = null;
  faviconIndex = 0;
  setFavicon("🧑‍💻");
}

function showInactiveFavicons() {
  clearInterval(faviconInterval);
  setFavicon(inactiveFavicons[faviconIndex]);
  faviconInterval = setInterval(() => {
    faviconIndex = (faviconIndex + 1) % inactiveFavicons.length;
    setFavicon(inactiveFavicons[faviconIndex]);
  }, 1500);
}

function syncFavicon() {
  if (document.hidden || !document.hasFocus()) {
    showInactiveFavicons();
    return;
  }

  showActiveFavicon();
}

function lookup(dict, key) {
  return key.split(".").reduce((node, part) => node?.[part], dict);
}

async function applyTranslations(targetLang) {
  if (targetLang === DEFAULT_LANG) return;

  try {
    const response = await fetch(`assets/i18n/${targetLang}.json`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const dict = await response.json();

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const text = lookup(dict, el.dataset.i18n);
      if (typeof text === "string") el.innerHTML = text;
    });

    if (dict.meta?.title) document.title = dict.meta.title;
    if (dict.meta?.description) {
      document
        .querySelectorAll('meta[name="description"], meta[property="og:description"]')
        .forEach((meta) => meta.setAttribute("content", dict.meta.description));
    }
  } catch {
    document.documentElement.lang = DEFAULT_LANG;
  }
}

function updateCurrentDate() {
  const dateEl = document.getElementById("date");
  if (!dateEl) return;
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  dateEl.textContent = `${month}/${now.getFullYear()}`;
}

function splitIntoChars(el) {
  const text = el.textContent.trim();
  el.setAttribute("aria-label", text);
  el.textContent = "";

  text.split(/\s+/).forEach((word, index) => {
    if (index > 0) el.append(" ");
    const wordEl = document.createElement("span");
    wordEl.className = "split-word";
    wordEl.setAttribute("aria-hidden", "true");
    for (const char of word) {
      const charEl = document.createElement("span");
      charEl.className = "split-char";
      charEl.textContent = char;
      wordEl.append(charEl);
    }
    el.append(wordEl);
  });

  return el.querySelectorAll(".split-char");
}

function playIntro() {
  const root = document.documentElement;
  const alreadyVisible = !root.classList.contains("is-loading");
  ink?.start();
  if (alreadyVisible || prefersReducedMotion || typeof gsap === "undefined" || !heroTitle) {
    root.classList.remove("is-loading");
    return;
  }

  const chars = splitIntoChars(heroTitle);
  const chrome = [
    ...document.querySelectorAll(".site-chrome li"),
    experienceOpen?.querySelector(".link-underline"),
  ].filter(Boolean);

  gsap
    .timeline({ defaults: { ease: "power4.out" } })
    .from(chars, { yPercent: 115, rotate: 6, duration: 1.2, stagger: 0.04 })
    .from(
      heroDescription,
      { y: 24, autoAlpha: 0, filter: "blur(8px)", duration: 1.1, ease: "power3.out", clearProps: "filter" },
      "-=0.85"
    )
    .from(chrome, { y: 18, autoAlpha: 0, duration: 0.8, stagger: 0.07, ease: "power3.out" }, "-=0.75");

  root.classList.remove("is-loading");
}

function setExperienceOpenState(open) {
  isExperienceOpen = open;
  experiencePanel?.classList.toggle("is-open", open);
  experiencePanel?.setAttribute("aria-hidden", String(!open));
  experienceOpen?.setAttribute("aria-expanded", String(open));
}

function syncExperienceState(self) {
  const progress = self?.progress ?? 0;
  setExperienceOpenState(progress >= 0.98);
  ink?.setActive(progress < 0.98);
  if (experienceOpen) experienceOpen.style.visibility = progress > 0.5 ? "hidden" : "";
  if (progress === 0 && experienceContent) experienceContent.scrollTop = 0;
}

function scrollToExperienceProgress(progress) {
  const st = experienceTimeline?.scrollTrigger;
  if (!st) return;
  const target = st.start + (st.end - st.start) * progress;

  if (typeof ScrollToPlugin !== "undefined" && !prefersReducedMotion) {
    gsap.to(window, {
      scrollTo: { y: target, autoKill: true },
      duration: 1.1,
      ease: "power3.inOut",
      overwrite: true,
    });
    return;
  }

  window.scrollTo({ top: target, behavior: prefersReducedMotion ? "auto" : "smooth" });
}

function openExperience() {
  scrollToExperienceProgress(1);
  experienceClose?.focus({ preventScroll: true });
}

function closeExperience() {
  scrollToExperienceProgress(0);
  experienceOpen?.focus({ preventScroll: true });
}

function initExperiencePanel() {
  if (!home || !homeInner || !experiencePanel || typeof gsap === "undefined") return;

  window.scrollTo(0, 0);

  gsap.registerPlugin(ScrollTrigger);
  if (typeof ScrollToPlugin !== "undefined") gsap.registerPlugin(ScrollToPlugin);
  ScrollTrigger.config({ ignoreMobileResize: true });
  ScrollTrigger.clearScrollMemory();

  experienceTimeline = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: home,
      start: "top top",
      end: "+=100%",
      pin: true,
      scrub: prefersReducedMotion ? true : 0.6,
      anticipatePin: 1,
      onUpdate: syncExperienceState,
      onRefresh: syncExperienceState,
    },
  });

  experienceTimeline
    .fromTo(experiencePanel, { yPercent: 100 }, { yPercent: 0, duration: 1 }, 0)
    .fromTo(homeInner, { opacity: 1 }, { opacity: 0, duration: 0.8, ease: "power1.out" }, 0)
    .fromTo(inkCanvas, { opacity: 1 }, { opacity: 0, duration: 0.5, ease: "power1.out" }, 0)
    .fromTo(experienceOpen, { opacity: 1 }, { opacity: 0, duration: 0.3 }, 0);

  if (!prefersReducedMotion) {
    experienceTimeline
      .fromTo(
        homeInner,
        { scale: 1, filter: "blur(0px)" },
        { scale: 0.94, filter: "blur(14px)", duration: 0.8, ease: "power1.out" },
        0
      )
      .fromTo(
        experiencePanel.querySelectorAll("[data-reveal]"),
        { y: (index) => 90 + index * 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.06, ease: "power2.out" },
        0.3
      );
  }

  syncExperienceState(experienceTimeline.scrollTrigger);
  experiencePanel.classList.remove("is-pre-init");
}

experienceOpen?.addEventListener("click", openExperience);
experienceClose?.addEventListener("click", closeExperience);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && isExperienceOpen) {
    closeExperience();
  }
});

experienceContent?.addEventListener(
  "wheel",
  (event) => {
    if (!isExperienceOpen) return;
    if (experienceContent.scrollTop <= 0 && event.deltaY < 0) {
      event.preventDefault();
      window.scrollBy(0, event.deltaY);
    }
  },
  { passive: false }
);

window.addEventListener("focus", syncFavicon);
window.addEventListener("blur", syncFavicon);
document.addEventListener("visibilitychange", syncFavicon);

syncFavicon();
updateCurrentDate();
initExperiencePanel();

const contentReady = Promise.all([applyTranslations(lang), document.fonts?.ready]).then(updateCurrentDate);
const loadTimeout = new Promise((resolve) => setTimeout(resolve, 1500));
Promise.race([contentReady, loadTimeout]).then(playIntro);
