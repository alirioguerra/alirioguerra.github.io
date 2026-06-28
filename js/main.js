const title = document.querySelector("#title");
if (title) {
  new Typewriter(title, {
    strings: title.attributes[1].value.split(","),
    loop: true,
    delay: 70,
    autoStart: true,
    pauseFor: 15000,
  });
}