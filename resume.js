import './input.css';
import { initializeAnimations } from './js/animations.js';
import { initializeLanguageSystem } from './js/language.js';
import data from './pt.json' assert { type: 'json' };
import dataEn from './en.json' assert { type: 'json' };

/**
 * Initialize the resume page
 */
function initializeResume() {
  initializeAnimations();
  initializeLanguageSystem();
}

function animateResume() {
  const gsap = globalThis.gsap;
  if (gsap) {
    gsap.from("h1", {
      duration: 1,
      y: -50,
      opacity: 0,
      ease: "power3.out"
    });

    gsap.from("h2", {
      duration: 1,
      y: 30,
      opacity: 0,
      ease: "power3.out",
      stagger: 0.2
    });

    gsap.from(".space-y-2", {
      duration: 0.8,
      y: 20,
      opacity: 0,
      ease: "power3.out",
      stagger: 0.1,
      delay: 0.3
    });

    gsap.from(".lang-toggle", {
      duration: 0.8,
      scale: 0,
      opacity: 0,
      ease: "back.out(1.7)",
      stagger: 0.2
    });
  }
}

function renderResume(lang) {
  const resume = lang === 'en' ? dataEn.resume : data.resume;

  // Header
  document.getElementById('resume-header').innerHTML = `
    <div class="space-y-2">
      <h1 class="text-4xl md:text-6xl font-black uppercase">${resume.title}</h1>
      <p class="text-xl md:text-2xl font-bold">${resume.subtitle}</p>
      <div class="flex flex-wrap gap-4 text-sm md:text-base">
        <span>${resume.location}</span>
        <a href="mailto:${resume.email}" class="hover:underline">${resume.email}</a>
        <a href="tel:+5561994522467" class="hover:underline">${resume.phone}</a>
        <a href="https://${resume.github}" target="_blank" class="hover:underline">${resume.github}</a>
      </div>
    </div>
  `;

  // Summary
  document.getElementById('resume-summary').innerHTML = `
    <div class="space-y-2">
      <h2 class="text-2xl md:text-3xl font-bold uppercase">${lang === 'en' ? 'Summary' : 'Resumo'}</h2>
      <p class="text-base md:text-lg">${resume.summary}</p>
    </div>
  `;

  // Skills
  document.getElementById('resume-skills').innerHTML = `
    <div class="space-y-2">
      <h2 class="text-2xl md:text-3xl font-bold uppercase">${resume.skills_title}</h2>
      <ul class="list-disc list-inside text-base md:text-lg">
        ${resume.skills.map(skill => `<li>${skill}</li>`).join('')}
      </ul>
    </div>
  `;

  // Experience
  document.getElementById('resume-experience').innerHTML = `
    <div class="space-y-4">
      <h2 class="text-2xl md:text-3xl font-bold uppercase">${resume.experience_title}</h2>
      ${resume.jobs.map(job => `
        <div class="space-y-2">
          <div class="flex justify-between items-start">
            <h3 class="text-xl md:text-2xl font-bold">${job.company}</h3>
            <span class="text-sm md:text-base">${job.location}</span>
          </div>
          <p class="text-lg md:text-xl font-semibold">${job.role}</p>
          <p class="text-sm md:text-base">${job.period}</p>
          <p class="text-base md:text-lg">${job.description}</p>
        </div>
      `).join('')}
    </div>
  `;

  animateResume();
}

function getLang() {
  const lang = new URLSearchParams(window.location.search).get('lang');
  if (lang) return lang;
  const systemLang = navigator.language;
  return systemLang.startsWith('pt') ? 'pt' : 'en';
}

function setLanguage(lang) {
  renderResume(lang);
  if (lang === 'pt') {
    document.querySelector('[data-lang="pt"]').classList.add('underline');
    document.querySelector('[data-lang="en"]').classList.remove('underline');
  } else {
    document.querySelector('[data-lang="en"]').classList.add('underline');
    document.querySelector('[data-lang="pt"]').classList.remove('underline');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const lang = getLang();
  setLanguage(lang);
  document.querySelectorAll('.lang-toggle').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      setLanguage((link instanceof HTMLElement ? link.dataset.lang : undefined));
    });
  });
});

document.addEventListener('DOMContentLoaded', initializeResume); 