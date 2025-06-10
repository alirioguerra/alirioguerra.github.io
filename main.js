import { initializeAnimations } from './js/animations.js';
import { initializeLanguageSystem } from './js/language.js';
import { initializeFavicon } from './js/favicon.js';

document.addEventListener('DOMContentLoaded', () => {
  initializeAnimations();
  initializeLanguageSystem();
  initializeFavicon();
}); 