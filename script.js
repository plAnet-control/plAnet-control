// ---------- COWHIDE SPOTS ----------
// One config list, rendered identically into both loop copies — that's what
// makes the drift seamless (the two halves are pixel-identical).
const spotConfigs = [
  { top: 4,  left: 3,  w: 19, h: 15, br: '42% 58% 65% 35% / 45% 40% 60% 55%', variant: 1, dur: 24, delay: -3  },
  { top: 22, left: 16, w: 11, h: 14, br: '55% 45% 60% 40% / 50% 55% 45% 50%', variant: 2, dur: 27, delay: -9  },
  { top: 8,  left: 30, w: 24, h: 10, br: '60% 40% 35% 65% / 55% 45% 65% 35%', variant: 3, dur: 21, delay: -5  },
  { top: 34, left: 5,  w: 9,  h: 8,  br: '50% 50% 55% 45% / 45% 55% 50% 50%', variant: 1, dur: 26, delay: -14 },
  { top: 48, left: 20, w: 16, h: 20, br: '38% 62% 50% 50% / 60% 35% 65% 40%', variant: 2, dur: 30, delay: -2  },
  { top: 58, left: 2,  w: 22, h: 12, br: '65% 35% 40% 60% / 40% 60% 45% 55%', variant: 3, dur: 23, delay: -11 },
  { top: 12, left: 55, w: 14, h: 18, br: '45% 55% 60% 40% / 50% 45% 55% 50%', variant: 1, dur: 29, delay: -7  },
  { top: 6,  left: 74, w: 18, h: 9,  br: '55% 45% 35% 65% / 60% 40% 60% 40%', variant: 2, dur: 25, delay: -16 },
  { top: 40, left: 62, w: 8,  h: 9,  br: '50% 50% 45% 55% / 55% 45% 50% 50%', variant: 3, dur: 22, delay: -4  },
  { top: 52, left: 45, w: 21, h: 15, br: '40% 60% 55% 45% / 45% 60% 40% 55%', variant: 1, dur: 28, delay: -19 },
  { top: 70, left: 12, w: 13, h: 11, br: '60% 40% 50% 50% / 50% 55% 45% 50%', variant: 2, dur: 24, delay: -6  },
  { top: 66, left: 68, w: 17, h: 22, br: '48% 52% 40% 60% / 55% 45% 60% 40%', variant: 3, dur: 31, delay: -13 },
  { top: 78, left: 34, w: 10, h: 9,  br: '55% 45% 60% 40% / 45% 55% 50% 50%', variant: 1, dur: 20, delay: -17 },
  { top: 80, left: 82, w: 14, h: 13, br: '42% 58% 48% 52% / 50% 45% 55% 50%', variant: 2, dur: 27, delay: -8  },
  { top: 26, left: 84, w: 9,  h: 12, br: '58% 42% 55% 45% / 45% 60% 40% 55%', variant: 3, dur: 23, delay: -21 },
];

function buildSpots(container) {
  spotConfigs.forEach((cfg) => {
    const el = document.createElement('div');
    el.className = `blob blob-${cfg.variant}`;
    el.style.top = cfg.top + '%';
    el.style.left = cfg.left + '%';
    el.style.width = cfg.w + 'vw';
    el.style.height = cfg.h + 'vw';
    el.style.borderRadius = cfg.br;
    el.style.animationDuration = cfg.dur + 's';
    el.style.animationDelay = cfg.delay + 's';
    container.appendChild(el);
  });
}

const patternA = document.getElementById('cowhidePatternA');
const patternB = document.getElementById('cowhidePatternB');
if (patternA && patternB) {
  buildSpots(patternA);
  buildSpots(patternB);
}

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
