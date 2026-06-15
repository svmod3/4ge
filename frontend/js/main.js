const originHeader = document.querySelector(".origin-header");
const elementArray = ["BUILD", "BREAK", "SECURE"];
let i = 0;

setInterval(() => {
  originHeader.textContent = elementArray[i];
  i = (i + 1) % elementArray.length;
}, 750);
