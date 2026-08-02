// ==========================================
// ALWAYS START PAGE FROM THE TOP
// ==========================================

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

window.scrollTo(0, 0);

window.addEventListener("load", () => {
  window.scrollTo(0, 0);
});


// ==========================================
// ELEMENTS
// ==========================================

const intro = document.getElementById("envelopeIntro");
const openButton = document.getElementById("openInvitation");
const skipButton = document.getElementById("skipIntro");

const siteShell = document.getElementById("siteShell");

const replayButton = document.getElementById("replayIntro");

const weddingMusic = document.getElementById("weddingMusic");
const musicToggle = document.getElementById("musicToggle");

let introStarted = false;
let fadeInterval = null;


// ==========================================
// SHOW MAIN WEBSITE
// ==========================================

function showWebsite() {

  // Always begin from hero
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

    // Prevent browser from restoring old scroll position
    window.scrollTo(0, 0);

    document
      .querySelector(".hero .reveal")
      ?.classList.add("visible");

  }, 50);
}


// ==========================================
// START MUSIC
// ==========================================

function startWeddingMusic() {

  if (!weddingMusic) return;

  // Clear an old fade interval if one exists
  if (fadeInterval) {
    clearInterval(fadeInterval);
  }

  weddingMusic.muted = false;
  weddingMusic.volume = 0;

  weddingMusic
    .play()
    .then(() => {

      let volume = 0;

      fadeInterval = setInterval(() => {

        // If user pauses while fade is happening,
        // STOP increasing volume.
        if (weddingMusic.paused) {
          clearInterval(fadeInterval);
          fadeInterval = null;
          return;
        }

        volume += 0.02;

        if (volume >= 0.5) {
          volume = 0.5;

          clearInterval(fadeInterval);
          fadeInterval = null;
        }

        weddingMusic.volume = volume;

      }, 80);

      updateMusicButton();

    })
    .catch((error) => {

      console.log(
        "Music could not start:",
        error
      );

    });
}


// ==========================================
// MUSIC BUTTON
// ==========================================

function updateMusicButton() {

  if (!musicToggle || !weddingMusic) return;

  if (weddingMusic.paused) {

    // Music is OFF
    musicToggle.textContent = "▶";
    musicToggle.classList.add("muted");

    musicToggle.setAttribute(
      "aria-label",
      "Play music"
    );

  } else {

    // Music is ON
    musicToggle.textContent = "♫";
    musicToggle.classList.remove("muted");

    musicToggle.setAttribute(
      "aria-label",
      "Pause music"
    );
  }
}


if (musicToggle && weddingMusic) {

  musicToggle.addEventListener("click", async (event) => {

    // Prevent anything behind the button
    // from receiving this click.
    event.preventDefault();
    event.stopPropagation();

    // -------------------------------
    // MUSIC IS PLAYING → PAUSE
    // -------------------------------

    if (!weddingMusic.paused) {

      // Stop fade-in interval first.
      // This is important.
      if (fadeInterval) {
        clearInterval(fadeInterval);
        fadeInterval = null;
      }

      weddingMusic.pause();

      updateMusicButton();

      return;
    }


    // -------------------------------
    // MUSIC IS PAUSED → PLAY
    // -------------------------------

    try {

      weddingMusic.muted = false;

      // Restore normal volume
      weddingMusic.volume = 0.5;

      await weddingMusic.play();

      updateMusicButton();

    } catch (error) {

      console.error(
        "Unable to play music:",
        error
      );

    }

  });


  // Keep icon synchronized with actual audio state

  weddingMusic.addEventListener(
    "play",
    updateMusicButton
  );

  weddingMusic.addEventListener(
    "pause",
    updateMusicButton
  );

  weddingMusic.addEventListener(
    "ended",
    updateMusicButton
  );
}


// ==========================================
// OPEN ENVELOPE
// ==========================================

function openEnvelope() {

  if (introStarted) return;

  introStarted = true;

  // Start music immediately from user's click.
  startWeddingMusic();

  // Start envelope animation
  intro.classList.add("opening");

  // Show website after envelope animation
  window.setTimeout(
    showWebsite,
    5000
  );
}


if (openButton) {

  openButton.addEventListener(
    "click",
    openEnvelope
  );

}


// ==========================================
// SKIP INTRO
// ==========================================

if (skipButton) {

  skipButton.addEventListener(
    "click",
    () => {

      introStarted = true;

      // You can remove this line if you
      // DON'T want music when Skip is clicked.
      startWeddingMusic();

      showWebsite();

    }
  );

}


// ==========================================
// REPLAY ENVELOPE
// ==========================================

if (replayButton) {

  replayButton.addEventListener(
    "click",
    () => {

      introStarted = false;

      intro.classList.remove(
        "dismissed",
        "opening"
      );

      siteShell.classList.remove(
        "visible"
      );

      siteShell.setAttribute(
        "aria-hidden",
        "true"
      );

      document.body.classList.add(
        "intro-active"
      );

      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto"
      });

    }
  );

}


// ==========================================
// COUNTDOWN
// ==========================================

const weddingDate =
  new Date(
    "2026-08-26T11:16:00-04:00"
  ).getTime();


function updateCountdown() {

  const distance =
    weddingDate - Date.now();


  const values =
    distance > 0

      ? {

          days:
            Math.floor(
              distance / 86400000
            ),

          hours:
            Math.floor(
              (distance % 86400000) /
              3600000
            ),

          minutes:
            Math.floor(
              (distance % 3600000) /
              60000
            ),

          seconds:
            Math.floor(
              (distance % 60000) /
              1000
            )

        }

      : {

          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0

        };


  Object.entries(values)
    .forEach(([id, value]) => {

      const element =
        document.getElementById(id);

      if (element) {

        element.textContent =
          String(value)
            .padStart(2, "0");

      }

    });

}


updateCountdown();

setInterval(
  updateCountdown,
  1000
);


// ==========================================
// SCROLL REVEAL ANIMATIONS
// ==========================================

const revealObserver =
  new IntersectionObserver(

    (entries) => {

      entries.forEach((entry) => {

        if (entry.isIntersecting) {

          entry.target
            .classList
            .add("visible");

          revealObserver
            .unobserve(entry.target);

        }

      });

    },

    {
      threshold: 0.14
    }

  );


document
  .querySelectorAll(".reveal")
  .forEach((element) => {

    revealObserver.observe(element);

  });


// ==========================================
// INITIAL MUSIC BUTTON STATE
// ==========================================

updateMusicButton();