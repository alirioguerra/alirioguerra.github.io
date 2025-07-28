
// Animações de entrada para elementos do portfólio
if (scroll) {
  // Desktop: Locomotive Scroll animations
  scroll.on('scroll', (args) => {
    // Animar elementos do portfólio quando entram na viewport
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    portfolioItems.forEach((item, index) => {
      const progress = args.currentElements[item.dataset.scrollId]?.progress || 0;
      
      if (progress > 0.1) {
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
      }
    });
  });
} else {
  // Mobile: Native scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
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

const title = document.querySelector("#title");
if (title) {
  const typewriter = new Typewriter(title, {
    strings: title.attributes[1].value.split(","),
    loop: true,
    delay: 70,
    autoStart: true,
    pauseFor: 15000,
  });
}