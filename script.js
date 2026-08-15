// ---------- LOGO FLICKER ----------
// "PLANET" and "CONTROL" fade independently and semi-randomly, but the
// constraint below guarantees they are never both fully off at once.
// The 3D "A" (#aModel) is intentionally never touched here.

const planetLetters = document.querySelectorAll('.planet-letter');
const controlLetters = document.querySelectorAll('.control-letter');

const MIN_VISIBLE_OPACITY = 0.06; // "off" threshold
const FORCE_ON_OPACITY = 0.85;

function randomOpacity() {
  // Skewed so it spends more time readable than fully dim — feels dreamy, not chaotic.
  const r = Math.random();
  return Math.pow(r, 1.6);
}

function setWordOpacity(letters, value) {
  letters.forEach((el) => {
    el.style.opacity = value;
  });
}

let planetOpacity = 1;
let controlOpacity = 1;

function tickFlicker() {
  let nextPlanet = randomOpacity();
  let nextControl = randomOpacity();

  // Guarantee: never let both words dip below the "off" threshold together.
  if (nextPlanet < MIN_VISIBLE_OPACITY && nextControl < MIN_VISIBLE_OPACITY) {
    if (Math.random() > 0.5) {
      nextPlanet = FORCE_ON_OPACITY;
    } else {
      nextControl = FORCE_ON_OPACITY;
    }
  }

  planetOpacity = nextPlanet;
  controlOpacity = nextControl;

  setWordOpacity(planetLetters, planetOpacity);
  setWordOpacity(controlLetters, controlOpacity);

  // Irregular timing keeps it feeling organic rather than a metronome.
  const nextDelay = 900 + Math.random() * 1400;
  setTimeout(tickFlicker, nextDelay);
}

tickFlicker();

// ---------- BOTTOM-HOVER "NEXT PAGE" TAB ----------
const nextTab = document.getElementById('nextTab');
const backTab = document.getElementById('backTab');
const pageHome = document.getElementById('page-home');

const HOVER_ZONE_PX = 110;

window.addEventListener('mousemove', (e) => {
  const nearBottom = window.innerHeight - e.clientY < HOVER_ZONE_PX;
  nextTab.classList.toggle('visible', nearBottom);
});

// Basic touch support: show the tab if the user taps near the bottom
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
