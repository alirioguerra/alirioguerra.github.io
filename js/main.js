// Locomotive Scroll
import LocomotiveScroll from 'locomotive-scroll';

        // Detecta se é dispositivo móvel
        const isMobile = window.innerWidth <= 768;
        
        let scroll;
        
        if (!isMobile) {
          // Locomotive Scroll apenas para desktop
          scroll = new LocomotiveScroll({
            el: document.querySelector('[data-scroll-container]'),
            smooth: true,
            lerp: 0.1,
            multiplier: 0.5,
          });
        }

// Update scroll on page load
if (scroll) {
  scroll.update();
}

// Update scroll on window resize
window.addEventListener('resize', () => {
  if (scroll) {
    scroll.update();
  }
});

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
// class 'anime' for each nth-child anime in sequence
const anime = document.querySelectorAll(".anime");

function addClassToAnime() {
  anime.forEach((anime) => {
    const animeTop = anime.getBoundingClientRect().top;
    const animeBottom = anime.getBoundingClientRect().bottom;
    const windowHeight = window.innerHeight;
    if (animeTop < windowHeight && animeBottom > windowHeight) {
      anime.classList.add("show");
    }
  });
}

window.addEventListener("scroll", addClassToAnime);
