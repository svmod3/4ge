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

//header text glitch animation
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

//header network animation
(function initParticles() {
  const canvas = document.getElementById("origin-canvas");
  if (!canvas || prefersReducedMotion) return;

  const ctx = canvas.getContext("2d");
  const PARTICLE_COUNT = 80;
  const LINK_DISTANCE = 120;
  const particles = [];
  let animationId = null;

  function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function createParticles() {
    particles.length = 0;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: Math.random() - 0.5,
        vy: Math.random() - 0.5,
      });
    }
  }

  function animate() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    ctx.clearRect(0, 0, w, h);

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = "#e0ffff";
      ctx.fill();
    });

    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[b].x - particles[a].x;
        const dy = particles[b].y - particles[a].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance > LINK_DISTANCE) continue;
        ctx.globalAlpha = 1 - distance / LINK_DISTANCE;
        ctx.beginPath();
        ctx.moveTo(particles[a].x, particles[a].y);
        ctx.lineTo(particles[b].x, particles[b].y);
        ctx.strokeStyle = "#e0ffff";
        ctx.lineWidth = 0.5;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }

    animationId = requestAnimationFrame(animate);
  }

  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && animationId === null) {
      animationId = requestAnimationFrame(animate);
    } else if (!entry.isIntersecting && animationId !== null) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  });
  observer.observe(canvas);

  resizeCanvas();
  createParticles();
  window.addEventListener("resize", resizeCanvas);
})();

//reveal sekcji
//
(function initReveal() {
  const sections = document.querySelectorAll(".section-content");

  if (sections.length === 0) return;

  sections.forEach((s) => s.classList.add("reveal"));
  if (prefersReducedMotion) {
    sections.forEach((s) => s.classList.add("revealed"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 },
  );
  sections.forEach((s) => observer.observe(s));
})();

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
