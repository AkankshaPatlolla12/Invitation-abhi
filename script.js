if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

window.scrollTo(0, 0);

window.addEventListener("load", () => {
  window.scrollTo(0, 0);
});

const intro = document.getElementById("envelopeIntro");
const openButton = document.getElementById("openInvitation");
const skipButton = document.getElementById("skipIntro");
const siteShell = document.getElementById("siteShell");
const replayButton = document.getElementById("replayIntro");

let introStarted = false;

function showWebsite() {
  // Make absolutely sure the website begins at the hero
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "auto"
  });

  intro.classList.add("dismissed");
  siteShell.classList.add("visible");
  siteShell.setAttribute("aria-hidden", "false");
  document.body.classList.remove("intro-active");

  window.setTimeout(() => {
    window.scrollTo(0, 0);

    document
      .querySelector(".hero .reveal")
      ?.classList.add("visible");
  }, 50);
}

function openEnvelope() {
  if (introStarted) return;
  introStarted = true;
  intro.classList.add("opening");

  window.setTimeout(showWebsite, 5000);
}

openButton.addEventListener("click", openEnvelope);
skipButton.addEventListener("click", showWebsite);

replayButton.addEventListener("click", () => {
  introStarted = false;
  intro.classList.remove("dismissed", "opening");
  siteShell.classList.remove("visible");
  siteShell.setAttribute("aria-hidden", "true");
  document.body.classList.add("intro-active");
  window.scrollTo({ top: 0, behavior: "auto" });
});

// Countdown: update this date if needed.
const weddingDate = new Date("2026-08-26T11:16:00-04:00").getTime();

function updateCountdown() {
  const distance = weddingDate - Date.now();
  const values = distance > 0
    ? {
        days: Math.floor(distance / 86400000),
        hours: Math.floor((distance % 86400000) / 3600000),
        minutes: Math.floor((distance % 3600000) / 60000),
        seconds: Math.floor((distance % 60000) / 1000),
      }
    : { days: 0, hours: 0, minutes: 0, seconds: 0 };

  Object.entries(values).forEach(([id, value]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = String(value).padStart(2, "0");
  });
}

updateCountdown();
setInterval(updateCountdown, 1000);

// Scroll reveal animations.
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

// Mobile navigation.
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

menuToggle.addEventListener("click", () => {
  const expanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!expanded));
  mainNav.classList.toggle("open", !expanded);
});

mainNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

// Demo RSVP behavior. Connect this form to Formspree, Google Apps Script,
// Firebase, Supabase, or your own backend to save responses permanently.
const rsvpForm = document.getElementById("rsvpForm");
const formStatus = document.getElementById("formStatus");

rsvpForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = new FormData(rsvpForm).get("name")?.toString().trim();
  formStatus.textContent = `Thank you${name ? `, ${name}` : ""}! Your response has been recorded on this page.`;
  rsvpForm.reset();
});
