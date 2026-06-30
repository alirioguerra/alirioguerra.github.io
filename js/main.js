const LANG_KEY = "preferred-lang";
const I18N_STORAGE_KEY = `${window.location.host}-vanilla-i18n`;
const languages = ["pt-br", "en"];

const savedLang = localStorage.getItem(LANG_KEY);
const hasChosenLang = savedLang && languages.includes(savedLang);

const toggler = document.getElementById("vanilla-i18n-toggler");
const langButtons = document.querySelectorAll("[data-lang]");
const modal = document.getElementById("lang-modal");
const modalButtons = document.querySelectorAll("[data-lang-choice]");

let i18nInstance = null;

function syncLangToggle(lang) {
  langButtons.forEach((btn) => {
    const active = btn.dataset.lang === lang;
    btn.setAttribute("aria-pressed", active);
    btn.classList.toggle("text-white", active);
    btn.classList.toggle("text-white/40", !active);
    btn.classList.toggle("hover:text-white/70", !active);
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

if (hasChosenLang) {
  initI18n(savedLang);
  syncLangToggle(savedLang);
  document.documentElement.lang = savedLang;
} else {
  localStorage.removeItem(I18N_STORAGE_KEY);
  langButtons.forEach((btn) => {
    btn.setAttribute("aria-pressed", "false");
    btn.classList.add("text-white/40", "hover:text-white/70");
    btn.classList.remove("text-white");
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
