const workSingle = document.querySelectorAll(".work-single");

function addClassToElement() {
  workSingle.forEach((work) => {
    const workTop = work.getBoundingClientRect().top;
    const workBottom = work.getBoundingClientRect().bottom;
    const windowHeight = window.innerHeight;
    if (workTop < windowHeight && workBottom > windowHeight) {
      work.classList.add("show");
    }
  });
}

window.addEventListener("scroll", addClassToElement);

const title = document.querySelector("#title");
if (title) {
  const typewriter = new Typewriter(title, {
    strings: title.attributes[1].value.split(","),
    loop: true,
    delay: 70,
    autoStart: true,
    pauseFor: 8000,
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
