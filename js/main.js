const workSingle = document.querySelectorAll(".work-single");

function addClassToElement() {
  workSingle.forEach((work) => {
    const workTop = work.getBoundingClientRect().top;
    const workBottom = work.getBoundingClientRect().bottom;
    const workHeight = work.getBoundingClientRect().height;
    const windowHeight = window.innerHeight;
    if (workTop < windowHeight && workBottom > windowHeight) {
      work.classList.add("show");
    }
  });
}

window.addEventListener("scroll", addClassToElement);

const title = document.querySelector("#title");
const typewriter = new Typewriter(title, {
  strings: title.attributes[1].value.split(","),
  loop: true,
  delay: 70,
  autoStart: true,
  pauseFor: 8000,
});
