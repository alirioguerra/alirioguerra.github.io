// Configurações otimizadas para Locomotive Scroll
export const getScrollConfig = (isMobile) => {
  const baseConfig = {
    el: document.querySelector("[data-scroll-container]"),
    smooth: true,
    reloadOnContextChange: false,
    getSpeed: false, // Desabilita para melhor performance
    getDirection: false, // Desabilita para melhor performance
    resetNativeScroll: true
  };

  if (isMobile) {
    return {
      ...baseConfig,
      lerp: 0.03, // Muito baixo para responsividade
      multiplier: 0.8,
      firefoxMultiplier: 30,
      touchMultiplier: 1.5,
      scrollFromAnywhere: false, // Desabilita funcionalidade pesada
      smartphone: {
        smooth: true,
        lerp: 0.03,
        multiplier: 0.8,
        touchMultiplier: 1.5
      },
      tablet: {
        smooth: true,
        lerp: 0.05,
        multiplier: 0.9
      }
    };
  }

  return {
    ...baseConfig,
    lerp: 0.1,
    multiplier: 0.5,
    firefoxMultiplier: 50,
    touchMultiplier: 2,
    scrollFromAnywhere: true,
    smartphone: {
      smooth: true,
      lerp: 0.03,
      multiplier: 0.8,
      touchMultiplier: 1.5
    },
    tablet: {
      smooth: true,
      lerp: 0.08,
      multiplier: 1
    }
  };
};

// Função para inicializar scroll com fallback
export const initScroll = (config) => {
  try {
    const scroll = new LocomotiveScroll(config);
    scroll.update();
    return scroll;
  } catch (error) {
    console.warn('Locomotive Scroll failed to initialize:', error);
    return null;
  }
};

// Função para otimizar eventos de scroll
export const optimizeScrollEvents = (scroll) => {
  if (!scroll) return;

  // Throttle do evento de resize
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      scroll.update();
    }, 100);
  });

  // Otimização das animações de portfólio
  scroll.on('scroll', (args) => {
    requestAnimationFrame(() => {
      const portfolioItems = document.querySelectorAll('.portfolio-item');
      portfolioItems.forEach((item) => {
        const progress = args.currentElements[item.dataset.scrollId]?.progress || 0;
        
        if (progress > 0.1) {
          item.style.opacity = '1';
          item.style.transform = 'translate3d(0, 0, 0)';
        }
      });
    });
  });
}; 