const originHeader = document.querySelector(".origin-header");
const canvas = document.getElementById("origin-canvas");
const ctx = canvas.getContext("2d");
const elementArray = ["build", "break", "secure"];
let i = 0;

setInterval(() => {
  originHeader.classList.add("glitch");
  setTimeout(() => {
    originHeader.textContent = elementArray[i];
    originHeader.classList.remove("glitch");
  }, 300);
  i = (i + 1) % elementArray.length;
}, 1550);

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const PARTICLE_COUNT = 80;

const particles = [];

for (let i = 0; i < PARTICLE_COUNT; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: Math.random() - 0.5,
    vy: Math.random() - 0.5,
  });
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0) {
      p.x = canvas.width;
    }
    if (p.x > canvas.width) {
      p.x = 0;
    }
    if (p.y < 0) {
      p.y = canvas.height;
    }
    if (p.y > canvas.height) {
      p.y = 0;
    }
    ctx.beginPath();
    ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = "#e0ffff";
    ctx.fill();
  });

  for (let a = 0; a < particles.length; a++) {
    for (let b = a + 1; b < particles.length; b++) {
      const dx = particles[b].x - particles[a].x;
      const dy = particles[b].y - particles[a].y;
      const dystans = Math.sqrt(dx * dx + dy * dy);
      if (dystans > 120) continue;
      ctx.globalAlpha = 1 - dystans / 120;
      ctx.beginPath();
      ctx.moveTo(particles[a].x, particles[a].y);
      ctx.lineTo(particles[b].x, particles[b].y);
      ctx.strokeStyle = "#e0ffff";
      ctx.lineWidth = 0.5;
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  }

  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);

function form_validator() {
  const formElement = document.querySelector("form");
  const nameVal = document.getElementById("name-input");
  const mailVal = document.getElementById("email-input");
  const messageVal = document.getElementById("message-input");

  formElement.addEventListener("submit", (e) => {
    e.preventDefault();
    if (
      nameVal.value.trim() === "" ||
      mailVal.value.trim() === "" ||
      messageVal.value.trim() === ""
    ) {
      return;
    }
  });
}

form_validator();

function mail_maker(user, domain) {
  document.getElementById("contact-email").textContent =
    user + "@" + domain + ".com";
}
mail_maker("adam", "gmail");
