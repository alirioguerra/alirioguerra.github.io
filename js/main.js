// Locomotive Scroll
import LocomotiveScroll from 'locomotive-scroll';

        const scroll = new LocomotiveScroll({
          el: document.querySelector('[data-scroll-container]'),
          smooth: true,
          lerp: 0.1,
          multiplier: 0.5,
          smartphone: {
            smooth: true,
            lerp: 0.05,
            multiplier: 1.2,
          },
          tablet: {
            smooth: true,
            lerp: 0.08,
            multiplier: 1.0,
          }
        });

// Update scroll on page load
scroll.update();

// Update scroll on window resize
window.addEventListener('resize', () => {
  scroll.update();
});

// Animações de entrada para elementos do portfólio
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
