// ---------- LOGO FLICKER (neon-sign style: hard on/off, no fading) ----------
// "PLANET" and "CONTROL" each flip between fully lit and fully off at random
// intervals. The constraint below guarantees they're never both off at once.
// The 3D "A" (#aModel) is intentionally never touched here — it only rotates.

const planetLetters = document.querySelectorAll('.planet-letter');
const controlLetters = document.querySelectorAll('.control-letter');

function setWordOpacity(letters, value) {
  letters.forEach((el) => {
    el.style.opacity = value;
  });
}

let planetOn = true;
let controlOn = true;

function applyState() {
  setWordOpacity(planetLetters, planetOn ? 1 : 0);
  setWordOpacity(controlLetters, controlOn ? 1 : 0);
}

function flipWord(isPlanet) {
  const turningOn = Math.random() > 0.4; // spends a bit more time lit than dark
  if (isPlanet) {
    planetOn = turningOn;
  } else {
    controlOn = turningOn;
  }

  // Hard guarantee: never let both words be off at the same time.
  if (!planetOn && !controlOn) {
    if (isPlanet) {
      controlOn = true;
    } else {
      planetOn = true;
    }
  }

  applyState();
}

function scheduleFlicker(isPlanet) {
  // Occasionally stutter a few times fast before settling — real neon tubes do this.
  if (Math.random() < 0.3) {
    let count = 0;
    const stutters = 2 + Math.floor(Math.random() * 3);
    const stutterInterval = setInterval(() => {
      flipWord(isPlanet);
      count += 1;
      if (count >= stutters) clearInterval(stutterInterval);
    }, 70 + Math.random() * 60);
  } else {
    flipWord(isPlanet);
  }

  const nextDelay = 900 + Math.random() * 2600;
  setTimeout(() => scheduleFlicker(isPlanet), nextDelay);
}

scheduleFlicker(true);
scheduleFlicker(false);

// ---------- BOTTOM-HOVER "NEXT PAGE" TAB ----------
const nextTab = document.getElementById('nextTab');
const backTab = document.getElementById('backTab');
const pageHome = document.getElementById('page-home');

const HOVER_ZONE_PX = 110;

window.addEventListener('mousemove', (e) => {
  const nearBottom = window.innerHeight - e.clientY < HOVER_ZONE_PX;
  nextTab.classList.toggle('visible', nearBottom);
});

window.addEventListener('touchstart', (e) => {
  const touch = e.touches[0];
  if (touch && window.innerHeight - touch.clientY < HOVER_ZONE_PX) {
    nextTab.classList.add('visible');
  }
}, { passive: true });

nextTab.addEventListener('click', () => {
  pageHome.classList.add('slide-down');
});

backTab.addEventListener('click', () => {
  pageHome.classList.remove('slide-down');
});
