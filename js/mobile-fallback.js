// Fallback para dispositivos móveis com baixa performance
export const shouldUseNativeScroll = () => {
  // Detecta dispositivos com baixa performance
  const isLowEndDevice = () => {
    const memory = navigator.deviceMemory || 4; // GB
    const cores = navigator.hardwareConcurrency || 4;
    const connection = navigator.connection;
    
    // Dispositivos com menos de 2GB RAM ou 2 cores
    if (memory < 2 || cores < 2) return true;
    
    // Conexão lenta
    if (connection && connection.effectiveType === 'slow-2g') return true;
    
    // Dispositivos antigos
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Android 4') || userAgent.includes('Android 5')) return true;
    
    return false;
  };

  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                   (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) ||
                   window.innerWidth < 768;

  return isMobile && isLowEndDevice();
};

// Inicializa scroll nativo otimizado
export const initNativeScrollOptimized = () => {
  // Remove classes do Locomotive Scroll
  document.documentElement.classList.remove('has-scroll-smooth');
  document.body.classList.remove('has-scroll-smooth');
  
  // Adiciona otimizações CSS
  document.body.style.webkitOverflowScrolling = 'touch';
  document.body.style.overflowScrolling = 'touch';
  
  // Intersection Observer para animações
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translate3d(0, 0, 0)';
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  // Observa elementos animados
  document.querySelectorAll('.portfolio-item, .resume-section, .skill-item, .resume-experience').forEach(item => {
    observer.observe(item);
  });
}; 