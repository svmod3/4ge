"use strict";

const spanNameError = document.getElementById("name-error");
const spanEmailError = document.getElementById("email-error");
const spanMessageError = document.getElementById("message-error");
const originHeader = document.querySelector(".origin-header");
const canvas = document.getElementById("origin-canvas");
const ctx = canvas.getContext("2d");
let i = 0;

const prefersReducedMotion = window.matchMedia(
  "(prefersReducedMotion)",
).matches;
//main header animation
(function initRotator() {
  const rotator = document.getElementById("origin-rotator");
  if (!rotator || prefersReducedMotion) return;

  const words = ["build", "break", "secure", "repeat"];
  let wordIndex = 0;

  setInterval(() => {
    rotator.classList.add("glitch");
    setTimeout(() => {
      rotator.textContent = words[wordIndex];
      rotator.classList.remove("glitch");
    }, 300);
    wordIndex = (wordIndex + 1) % words.length;
  }, 1550);
})();

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//main background animation start
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

//canvas resize
//
function resizeCanvas() {
  // Pobieramy realne wymiary z CSS (np. jeśli canvas ma width: 100vw, height: 100vh)
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Jeśli po resecie cząsteczki uciekają poza ekran, można je zresetować lub zaktualizować ich pozycje,
  // ale standardowo ponowne przypisanie width/height czyści canvas i resetuje jego kontekst.
}

// Wywołaj raz na starcie
resizeCanvas();

// I na każdy resize okna
window.addEventListener("resize", resizeCanvas);

//form validation

function form_validator() {
  const formElement = document.querySelector("form");
  const nameVal = document.getElementById("name-input");
  const mailVal = document.getElementById("email-input");
  const messageVal = document.getElementById("message-input");
  const spans = [spanNameError, spanEmailError, spanMessageError];
  const mailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  formElement.addEventListener("submit", (e) => {
    e.preventDefault();
    spans.forEach((span) => {
      span.textContent = "";
    });
    document.getElementById("success-message").textContent = "";

    let isValid = true;

    if (nameVal.value.trim() === "") {
      spanNameError.textContent = "Please enter your name";
      isValid = false;
    } else if (nameVal.value.trim().length > 50) {
      spanNameError.textContent = "Name is too long (max 50 characters)";
      isValid = false;
    }

    if (mailVal.value.trim() === "") {
      spanEmailError.textContent = "Please enter your email address";
      isValid = false;
    } else if (mailVal.value.trim().length > 60) {
      spanEmailError.textContent = "Email is too long (max 60 characters)";
      isValid = false;
    } else if (!mailRegex.test(mailVal.value.trim())) {
      spanEmailError.textContent =
        "Please enter a valid email (e.g. name@domain.com)";
      isValid = false;
    }

    if (messageVal.value.trim() === "") {
      spanMessageError.textContent = "Please write your message";
      isValid = false;
    } else if (messageVal.value.trim().length > 500) {
      spanMessageError.textContent = "Message is too long (max 500 characters)";
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    formElement.reset();
    document.getElementById("success-message").textContent = "Message sent!";
  });
}

form_validator();

function mail_maker(user, domain) {
  document.getElementById("contact-email").textContent =
    user + "@" + domain + ".com";
}
mail_maker("in8sy", "proton");
