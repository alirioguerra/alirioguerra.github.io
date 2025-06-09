import data from '../pt.json' assert { type: 'json' };
import dataEn from '../en.json' assert { type: 'json' };
import { animateContentChange } from './animations.js';

const SUPPORTED_LANGUAGES = ['en', 'pt'];

/**
 * Get the current language from URL or browser settings
 * @returns {string} The current language code
 */
export function getCurrentLanguage() {
  const urlLang = new URLSearchParams(window.location.search).get('lang');
  if (urlLang && SUPPORTED_LANGUAGES.includes(urlLang)) {
    return urlLang;
  }
  
  const browserLang = navigator.language || navigator.userLanguage;
  return browserLang.startsWith('pt') ? 'pt' : 'en';
}

/**
 * Update the UI to reflect the current language
 * @param {string} lang - The language code to set
 */
function updateLanguageUI(lang) {
  const langToggles = document.querySelectorAll('.lang-toggle');
  langToggles.forEach(toggle => {
    if (toggle instanceof HTMLElement) {
      if (toggle.dataset.lang === lang) {
        toggle.classList.add('underline');
      } else {
        toggle.classList.remove('underline');
      }
    }
  });
}

/**
 * Update the content based on the selected language
 * @param {string} lang - The language code to set
 */
function updateContent(lang) {
  const content = lang === 'pt' ? data : dataEn;
  const elements = {
    name: document.getElementById('name'),
    role: document.getElementById('role'),
    experience: document.getElementById('experience')
  };

  if (!elements.name || !elements.role || !elements.experience) {
    console.error('Required elements not found');
    return;
  }

  animateContentChange(
    [elements.name, elements.role, elements.experience],
    () => {
      elements.name.textContent = content.name;
      elements.role.textContent = content.role;
      elements.experience.textContent = content.experience;
    }
  );
}

/**
 * Initialize the language system
 */
export function initializeLanguageSystem() {
  const currentLang = getCurrentLanguage();
  updateContent(currentLang);
  updateLanguageUI(currentLang);

  // Add click handlers for language toggles
  document.querySelectorAll('.lang-toggle').forEach(link => {
    if (link instanceof HTMLElement) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const lang = link.dataset.lang;
        if (SUPPORTED_LANGUAGES.includes(lang)) {
          updateContent(lang);
          updateLanguageUI(lang);
        }
      });
    }
  });
} 