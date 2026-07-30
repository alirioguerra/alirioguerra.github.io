const LANG_KEY = "preferred-lang";
const I18N_STORAGE_KEY = `${window.location.host}-vanilla-i18n`;
const languages = ["pt-br", "en"];

const savedLang = localStorage.getItem(LANG_KEY);
const hasChosenLang = savedLang && languages.includes(savedLang);

const toggler = document.getElementById("vanilla-i18n-toggler");
const langButtons = document.querySelectorAll("[data-lang]");
const modal = document.getElementById("lang-modal");
const modalButtons = document.querySelectorAll("[data-lang-choice]");
const favicon = document.getElementById("favicon");
const inactiveFavicons = ["👀", "☕", "🚀"];
const home = document.getElementById("home");
const homeInner = document.getElementById("home-inner");
const experiencePanel = document.getElementById("experience-panel");
const experienceContent = experiencePanel?.querySelector(".experience-panel-content");
const experienceOpen = document.getElementById("experience-open");
const experienceClose = document.getElementById("experience-close");
const dateEl = document.getElementById("date");

let i18nInstance = null;
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

function syncLangToggle(lang) {
  langButtons.forEach((btn) => {
    const active = btn.dataset.lang === lang;
    btn.setAttribute("aria-pressed", active);
    btn.classList.toggle("opacity-100", active);
    btn.classList.toggle("opacity-40", !active);
    btn.classList.toggle("hover:opacity-70", !active);
  });
}

function initI18n(lang) {
  localStorage.setItem(I18N_STORAGE_KEY, lang);
  toggler.value = lang;
  i18nInstance = new vanilla_i18n(languages, {
    path: "assets/vanilla-i18n",
    debug: false,
    i18n_attr_name: "vanilla-i18n",
    toggler_id: "vanilla-i18n-toggler",
    default_language: lang,
  });
  return i18nInstance.run();
}

function setLanguage(lang) {
  if (!languages.includes(lang)) return;
  localStorage.setItem(LANG_KEY, lang);
  if (i18nInstance) {
    toggler.value = lang;
    toggler.dispatchEvent(new Event("change"));
  } else {
    initI18n(lang);
  }
  syncLangToggle(lang);
  document.documentElement.lang = lang;
}

function closeLangModal() {
  if (modal.classList.contains("opacity-0")) return;
  modal.classList.add("opacity-0", "pointer-events-none");
  modal.addEventListener(
    "transitionend",
    () => {
      modal.classList.add("hidden");
      document.body.classList.remove("overflow-hidden");
    },
    { once: true }
  );
}

function setExperienceOpenState(open) {
  isExperienceOpen = open;
  experiencePanel?.classList.toggle("is-open", open);
  experiencePanel?.setAttribute("aria-hidden", String(!open));
  experienceOpen?.setAttribute("aria-expanded", String(open));
  if (!open && experienceContent) {
    experienceContent.scrollTop = 0;
  }
}

function scrollToExperienceProgress(progress, smooth = true) {
  const st = experienceTimeline?.scrollTrigger;
  if (!st) return;
  const target = st.start + (st.end - st.start) * progress;
  window.scrollTo({ top: target, behavior: smooth ? "smooth" : "auto" });
}

function openExperience() {
  scrollToExperienceProgress(1, true);
  experienceClose?.focus();
}

function closeExperience() {
  if (experienceContent) experienceContent.scrollTop = 0;
  scrollToExperienceProgress(0, true);
  experienceOpen?.focus();
}

function initExperiencePanel() {
  if (!home || !homeInner || !experiencePanel || typeof gsap === "undefined") return;

  gsap.registerPlugin(ScrollTrigger);
  gsap.set(experiencePanel, {
    yPercent: 100,
    "--panel-opacity": 0,
    backdropFilter: "blur(0px)",
    webkitBackdropFilter: "blur(0px)",
  });
  gsap.set(experienceContent, { opacity: 0.6 });
  gsap.set(homeInner, { filter: "blur(0px)", scale: 1 });

  experienceTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: home,
      start: "top top",
      end: "+=100%",
      pin: true,
      scrub: true,
      anticipatePin: 1,
      onUpdate: (self) => {
        setExperienceOpenState(self.progress >= 0.98);
      },
      onLeave: () => setExperienceOpenState(true),
      onEnterBack: () => setExperienceOpenState(false),
    },
  });

  experienceTimeline
    .to(
      experiencePanel,
      {
        yPercent: 0,
        "--panel-opacity": 1,
        backdropFilter: "blur(18px)",
        webkitBackdropFilter: "blur(18px)",
        ease: "none",
      },
      0
    )
    .to(experienceContent, { opacity: 1, ease: "none" }, 0)
    .to(
      homeInner,
      {
        filter: "blur(12px)",
        scale: 1.04,
        ease: "none",
      },
      0
    );
}

if (dateEl) {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  dateEl.textContent = `${month}/${year}`;
}

if (hasChosenLang) {
  initI18n(savedLang);
  syncLangToggle(savedLang);
  document.documentElement.lang = savedLang;
} else {
  localStorage.removeItem(I18N_STORAGE_KEY);
  langButtons.forEach((btn) => {
    btn.setAttribute("aria-pressed", "false");
    btn.classList.add("opacity-40", "hover:opacity-70");
    btn.classList.remove("opacity-100");
  });
}

toggler?.addEventListener("change", () => {
  syncLangToggle(toggler.value);
  document.documentElement.lang = toggler.value;
});

langButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (toggler.value === btn.dataset.lang && localStorage.getItem(LANG_KEY)) return;
    setLanguage(btn.dataset.lang);
  });
});

modalButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    setLanguage(btn.dataset.langChoice);
    closeLangModal();
  });
});

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
initExperiencePanel();
