const DEFAULT_LANG = "pt-br";
const lang = document.documentElement.lang === "en" ? "en" : DEFAULT_LANG;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const favicon = document.getElementById("favicon");
const inactiveFavicons = ["👀", "☕", "🚀"];
const home = document.getElementById("home");
const homeInner = document.getElementById("home-inner");
const heroTitle = document.getElementById("hero-title");
const heroDescription = document.getElementById("hero-description");
const experiencePanel = document.getElementById("experience-panel");
const experienceContent = experiencePanel?.querySelector(".experience-panel-content");
const experienceOpen = document.getElementById("experience-open");
const experienceClose = document.getElementById("experience-close");
const projectsPanel = document.getElementById("projects-panel");
const projectsContent = projectsPanel?.querySelector(".projects-panel-content");
const projectsOpen = document.getElementById("projects-open");
const projectsClose = document.getElementById("projects-close");

let faviconInterval = null;
let faviconIndex = 0;
let panelTimeline = null;
let openPanel = null;
let panelPosition = 0;

// Each panel takes one viewport of scroll; its position on the timeline is where it is fully open.
const panels = [
  { name: "experience", el: experiencePanel, content: experienceContent, trigger: experienceOpen, close: experienceClose },
  { name: "projects", el: projectsPanel, content: projectsContent, trigger: projectsOpen, close: projectsClose },
].filter((panel) => panel.el && panel.content);

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

const PROJECT_LABELS = {
  "pt-br": {
    status: { production: "Produção", beta: "Beta", development: "Em desenvolvimento", done: "Concluído" },
    live: "Ver online",
    repo: "Repositório",
  },
  en: {
    status: { production: "Production", beta: "Beta", development: "In development", done: "Completed" },
    live: "View live",
    repo: "Repository",
  },
};

function escapeHtml(value) {
  const el = document.createElement("span");
  el.textContent = value;
  return el.innerHTML;
}

function localized(value) {
  return typeof value === "string" ? value : value?.[lang] ?? value?.[DEFAULT_LANG] ?? "";
}

function renderProjectPreview(project) {
  const { preview = {}, url } = project;
  if (preview.image) {
    const img = `<img src="${preview.image}" alt="" width="1440" height="900" loading="lazy" decoding="async" />`;
    return url
      ? `<a class="project-preview" href="${url}" target="_blank" rel="noopener noreferrer" tabindex="-1" aria-hidden="true">${img}</a>`
      : `<div class="project-preview" aria-hidden="true">${img}</div>`;
  }
  const icon = preview.icon ? `<img class="project-icon" src="${preview.icon}" alt="" loading="lazy" decoding="async" />` : "";
  return `<div class="project-preview project-mock" aria-hidden="true">
    <div class="project-mock-inner">${icon}<span>${escapeHtml(project.name)}</span></div>
  </div>`;
}

function renderProjects() {
  const list = document.getElementById("projects-list");
  if (!list || !Array.isArray(window.PROJECTS)) return;
  const labels = PROJECT_LABELS[lang] ?? PROJECT_LABELS[DEFAULT_LANG];
  const link = (href, text) =>
    `<a class="project-link" href="${href}" target="_blank" rel="noopener noreferrer"><span class="link-underline">${escapeHtml(text)}</span><span aria-hidden="true">↗</span></a>`;

  list.innerHTML = window.PROJECTS.map((project, index) => {
    const links = [
      project.url && link(project.url, labels.live),
      ...(project.repos ?? []).map((repo) => link(repo.url, repo.name ? `${labels.repo} · ${repo.name}` : labels.repo)),
    ].filter(Boolean);

    return `<article class="project" data-reveal>
      ${renderProjectPreview(project)}
      <div class="project-info">
        <div class="project-meta">
          <span class="theme-muted">${String(index + 1).padStart(2, "0")}</span>
          <span class="project-status" data-status="${project.status}">${escapeHtml(labels.status[project.status] ?? project.status)}</span>
        </div>
        <h3 class="text-3xl md:text-4xl font-source-code-pro font-bold mb-2">${escapeHtml(project.name)}</h3>
        <h4 class="theme-secondary text-lg font-source-code-pro tracking-wide mb-4">${escapeHtml(localized(project.type))}</h4>
        <p class="text-lg font-source-code-pro tracking-wide leading-relaxed mb-6">${escapeHtml(localized(project.description))}</p>
        <ul class="project-stack" aria-label="Stack">${(project.stack ?? []).map((tech) => `<li>${escapeHtml(tech)}</li>`).join("")}</ul>
        ${links.length ? `<div class="project-links">${links.join("")}</div>` : ""}
      </div>
    </article>`;
  }).join("");
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
  if (alreadyVisible || prefersReducedMotion || typeof gsap === "undefined" || !heroTitle) {
    root.classList.remove("is-loading");
    return;
  }

  const chars = splitIntoChars(heroTitle);
  const chrome = [
    ...document.querySelectorAll(".site-chrome li"),
    ...document.querySelectorAll(".section-nav .link-underline"),
  ];

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

function setOpenPanel(name) {
  openPanel = name;
  panels.forEach((panel) => {
    const open = panel.name === name;
    panel.el.classList.toggle("is-open", open);
    panel.el.setAttribute("aria-hidden", String(!open));
    panel.trigger?.setAttribute("aria-expanded", String(open));
    panel.trigger?.setAttribute("aria-current", String(open));
  });
}

function syncPanelState(self) {
  const position = (self?.progress ?? 0) * panels.length;
  panelPosition = position;
  const index = Math.floor(position + 0.02);
  setOpenPanel(index > 0 ? panels[index - 1].name : null);
  panels.forEach((panel, i) => {
    if (position <= i) panel.content.scrollTop = 0;
  });
}

function scrollToPanel(index) {
  const st = panelTimeline?.scrollTrigger;
  if (!st) return;
  const target = st.start + ((st.end - st.start) * index) / panels.length;

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

function showPanel(name) {
  const index = panels.findIndex((panel) => panel.name === name);
  if (index < 0) return;
  scrollToPanel(index + 1);
  panels[index].close?.focus({ preventScroll: true });
}

function closePanels() {
  const trigger = panels.find((panel) => panel.name === openPanel)?.trigger;
  scrollToPanel(0);
  trigger?.focus({ preventScroll: true });
}

function initPanels() {
  if (!home || !homeInner || !panels.length || typeof gsap === "undefined") return;

  window.scrollTo(0, 0);

  gsap.registerPlugin(ScrollTrigger);
  if (typeof ScrollToPlugin !== "undefined") gsap.registerPlugin(ScrollToPlugin);
  ScrollTrigger.config({ ignoreMobileResize: true });
  ScrollTrigger.clearScrollMemory();

  panelTimeline = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: home,
      start: "top top",
      end: `+=${panels.length * 100}%`,
      pin: true,
      scrub: prefersReducedMotion ? true : 0.6,
      anticipatePin: 1,
      onUpdate: syncPanelState,
      onRefresh: syncPanelState,
    },
  });

  panelTimeline.fromTo(homeInner, { opacity: 1 }, { opacity: 0, duration: 0.8, ease: "power1.out" }, 0);
  if (!prefersReducedMotion) {
    panelTimeline.fromTo(
      homeInner,
      { scale: 1, filter: "blur(0px)" },
      { scale: 0.94, filter: "blur(14px)", duration: 0.8, ease: "power1.out" },
      0
    );
  }

  panels.forEach((panel, i) => {
    panelTimeline.fromTo(panel.el, { yPercent: 100 }, { yPercent: 0, duration: 1 }, i);

    const previous = panels[i - 1];
    if (previous) {
      // Opacity and scale only: a blur over a full-screen scrolling layer is too heavy on the GPU.
      panelTimeline.fromTo(
        [previous.content, previous.close],
        { opacity: 1 },
        { opacity: 0, duration: 0.8, ease: "power1.out" },
        i
      );
      if (!prefersReducedMotion) {
        panelTimeline.fromTo(previous.content, { scale: 1 }, { scale: 0.96, duration: 0.8, ease: "power1.out" }, i);
      }
    }

    if (!prefersReducedMotion) {
      panelTimeline.fromTo(
        panel.el.querySelectorAll("[data-reveal]"),
        { y: (index) => 90 + index * 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.06, ease: "power2.out" },
        i + 0.3
      );
    }
  });

  syncPanelState(panelTimeline.scrollTrigger);
  panels.forEach((panel) => panel.el.classList.remove("is-pre-init"));
}

// Hand the scroll back to the page once a panel's own content hits its top or bottom,
// so the user can keep scrolling to the previous or next panel.
function chainScroll(panel, index) {
  const { content } = panel;
  // Mid-transition the content must not scroll on its own, or it would swallow the gesture.
  const shouldChain = (delta) =>
    Math.abs(panelPosition - (index + 1)) > 0.02 ||
    (delta < 0 && content.scrollTop <= 0) ||
    (delta > 0 && content.scrollTop + content.clientHeight >= content.scrollHeight - 1);

  content.addEventListener(
    "wheel",
    (event) => {
      if (openPanel !== panel.name || !shouldChain(event.deltaY)) return;
      event.preventDefault();
      window.scrollBy(0, event.deltaY);
    },
    { passive: false }
  );

  let touchY = null;
  content.addEventListener("touchstart", (event) => (touchY = event.touches[0].clientY), { passive: true });
  content.addEventListener(
    "touchmove",
    (event) => {
      if (openPanel !== panel.name || touchY === null) return;
      const y = event.touches[0].clientY;
      const delta = touchY - y;
      touchY = y;
      if (!shouldChain(delta)) return;
      event.preventDefault();
      window.scrollBy(0, delta);
    },
    { passive: false }
  );
}

panels.forEach((panel, index) => {
  panel.trigger?.addEventListener("click", () => showPanel(panel.name));
  panel.close?.addEventListener("click", closePanels);
  chainScroll(panel, index);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && openPanel) {
    closePanels();
  }
});

window.addEventListener("focus", syncFavicon);
window.addEventListener("blur", syncFavicon);
document.addEventListener("visibilitychange", syncFavicon);

syncFavicon();
updateCurrentDate();
renderProjects();
initPanels();

const contentReady = Promise.all([applyTranslations(lang), document.fonts?.ready]).then(updateCurrentDate);
const loadTimeout = new Promise((resolve) => setTimeout(resolve, 1500));
Promise.race([contentReady, loadTimeout]).then(playIntro);
