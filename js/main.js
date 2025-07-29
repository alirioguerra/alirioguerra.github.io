// Importa otimizações de performance
import './performance.js';

// Detecção de dispositivo móvel
const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                 (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) ||
                 window.innerWidth < 768;

// Função para inicializar scroll nativo otimizado
function initNativeScroll() {
  // Intersection Observer otimizado para animações
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Adiciona a classe show para ativar as animações
        entry.target.classList.add('show');
      }
    });
  }, observerOptions);
  
  // Observe portfolio items
  document.querySelectorAll('.portfolio-item').forEach(item => {
    observer.observe(item);
  });
  
  // Observe portfolio images
  document.querySelectorAll('.portfolio-image').forEach(item => {
    observer.observe(item);
  });
  
  // Observe portfolio content
  document.querySelectorAll('.portfolio-content').forEach(item => {
    observer.observe(item);
  });
  
  // Observe tech tags
  document.querySelectorAll('.tech-tag').forEach(item => {
    observer.observe(item);
  });
  
  // Observe resume sections
  document.querySelectorAll('.resume-section').forEach(item => {
    observer.observe(item);
  });
  
  // Observe skill items
  document.querySelectorAll('.skill-item').forEach(item => {
    observer.observe(item);
  });
  
  // Observe resume experience
  document.querySelectorAll('.resume-experience').forEach(item => {
    observer.observe(item);
  });
}

// Inicializa scroll nativo
initNativeScroll();

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