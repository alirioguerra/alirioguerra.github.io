const languages = ["pt-br", "en"];

new vanilla_i18n(languages, {
  path: "assets/vanilla-i18n",
  debug: false,
  i18n_attr_name: "vanilla-i18n",
  toggler_id: "vanilla-i18n-toggler",
  default_language: languages[0],
}).run();

const toggler = document.getElementById("vanilla-i18n-toggler");
const langButtons = document.querySelectorAll("[data-lang]");

function syncLangToggle(lang) {
  langButtons.forEach((btn) => {
    const active = btn.dataset.lang === lang;
    btn.setAttribute("aria-pressed", active);
    btn.classList.toggle("text-white", active);
    btn.classList.toggle("text-white/40", !active);
    btn.classList.toggle("hover:text-white/70", !active);
  });
}

toggler?.addEventListener("change", () => syncLangToggle(toggler.value));

langButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (toggler.value === btn.dataset.lang) return;
    toggler.value = btn.dataset.lang;
    toggler.dispatchEvent(new Event("change"));
  });
});

syncLangToggle(toggler?.value || languages[0]);
