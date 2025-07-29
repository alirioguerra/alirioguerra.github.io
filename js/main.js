// Importa otimizações de performance
import './performance.js';
import { getScrollConfig, initScroll, optimizeScrollEvents } from './scroll-config.js';
import { shouldUseNativeScroll, initNativeScrollOptimized } from './mobile-fallback.js';

// Detecção de dispositivo móvel
const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                 (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) ||
                 window.innerWidth < 768;

// Inicializa scroll baseado na performance do dispositivo
let scroll;

if (shouldUseNativeScroll()) {
  // Usa scroll nativo para dispositivos com baixa performance
  initNativeScrollOptimized();
} else if (!isMobile || (isMobile && getScrollConfig(isMobile).smartphone.smooth)) {
  const config = getScrollConfig(isMobile);
  scroll = initScroll(config);
  
  if (scroll) {
    optimizeScrollEvents(scroll);
  } else {
    // Fallback para scroll nativo
    initNativeScroll();
  }
} else {
  // Fallback para scroll nativo em mobile
  initNativeScroll();
}

// Função de fallback para scroll nativo otimizado
function initNativeScroll() {
  // Intersection Observer otimizado para mobile
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Usar transform3d para forçar aceleração de hardware
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translate3d(0, 0, 0)';
      }
    });
  }, observerOptions);
  
  // Observe portfolio items
  document.querySelectorAll('.portfolio-item').forEach(item => {
    observer.observe(item);
  });
  
  // Observe resume sections
  document.querySelectorAll('.resume-section, .skill-item, .resume-experience').forEach(item => {
    observer.observe(item);
  });
}

// Typewriter effect
const title = document.querySelector("#title");
if (title) {
  const typewriter = new Typewriter(title, {
    strings: title.attributes[1].value.split(","),
    loop: true,
    delay: isMobile ? 50 : 70, // Delay menor para mobile
    autoStart: true,
    pauseFor: 15000,
  });
}

// Otimização: Lazy loading de imagens para mobile
if (isMobile) {
  const images = document.querySelectorAll('img[src*=".webp"]');
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.src; // Força o carregamento
        imageObserver.unobserve(img);
      }
    });
  });
  
  images.forEach(img => imageObserver.observe(img));
}