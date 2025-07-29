// Performance optimizations for mobile devices
class MobilePerformanceOptimizer {
  constructor() {
    this.isMobile = this.detectMobile();
    this.init();
  }

  detectMobile() {
    return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
           (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) ||
           window.innerWidth < 768;
  }

  init() {
    if (this.isMobile) {
      this.optimizeScroll();
      this.optimizeImages();
      this.optimizeAnimations();
      this.optimizeTouchEvents();
    }
  }

  optimizeScroll() {
    // Otimiza scroll nativo em mobile
    let ticking = false;
    let lastScrollY = window.pageYOffset;

    const updateScroll = () => {
      // Otimizações específicas para scroll
      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };

    window.addEventListener('scroll', requestTick, { passive: true });
  }

  optimizeImages() {
    // Lazy loading otimizado para mobile
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });

    images.forEach(img => imageObserver.observe(img));
  }

  optimizeAnimations() {
    // Reduz complexidade das animações em mobile
    const animatedElements = document.querySelectorAll('[data-scroll], .portfolio-item, .resume-section');
    
    animatedElements.forEach(element => {
      element.style.willChange = 'transform, opacity';
      
      // Remove will-change após animação
      setTimeout(() => {
        element.style.willChange = 'auto';
      }, 1000);
    });
  }

  optimizeTouchEvents() {
    // Otimiza eventos de touch
    let touchStartY = 0;
    let touchEndY = 0;

    document.addEventListener('touchstart', (e) => {
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
      touchEndY = e.changedTouches[0].clientY;
      this.handleSwipe();
    }, { passive: true });
  }

  handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartY - touchEndY;

    if (Math.abs(diff) > swipeThreshold) {
      // Swipe detectado - pode ser usado para navegação
      if (diff > 0) {
        // Swipe para cima
        this.handleSwipeUp();
      } else {
        // Swipe para baixo
        this.handleSwipeDown();
      }
    }
  }

  handleSwipeUp() {
    // Implementar navegação para próxima seção
    const currentSection = this.getCurrentSection();
    const nextSection = currentSection?.nextElementSibling;
    
    if (nextSection && nextSection.tagName === 'SECTION') {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  handleSwipeDown() {
    // Implementar navegação para seção anterior
    const currentSection = this.getCurrentSection();
    const prevSection = currentSection?.previousElementSibling;
    
    if (prevSection && prevSection.tagName === 'SECTION') {
      prevSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  getCurrentSection() {
    const sections = document.querySelectorAll('section');
    const windowMiddle = window.innerHeight / 2;
    
    for (let section of sections) {
      const rect = section.getBoundingClientRect();
      if (rect.top <= windowMiddle && rect.bottom >= windowMiddle) {
        return section;
      }
    }
    
    return null;
  }
}

// Inicializa otimizações quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new MobilePerformanceOptimizer();
  });
} else {
  new MobilePerformanceOptimizer();
} 