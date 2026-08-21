// ---------- LOGO GLOW FLICKER (neon-sign style: hard on/off, no fading) ----------
// Every individual letter keeps its own independent flicker schedule, so the
// silver halo cuts in and out letter by letter rather than the whole word
// glowing as one unit. Letters themselves always stay fully visible — only
// the glow flickers. The 3D "A" (#aModel) is never touched here — it only
// rotates.

const letters = document.querySelectorAll('.planet-letter, .control-letter');

function setGlow(el, on) {
  el.classList.toggle('glowing', on);
}

function flipGlow(el) {
  const turningOn = Math.random() > 0.4; // spends a bit more time glowing than dark
  setGlow(el, turningOn);
}

function scheduleFlicker(el) {
  // Occasionally stutter a few times fast before settling — real neon tubes do this.
  if (Math.random() < 0.3) {
    let count = 0;
    const stutters = 2 + Math.floor(Math.random() * 3);
    const stutterInterval = setInterval(() => {
      flipGlow(el);
      count += 1;
      if (count >= stutters) clearInterval(stutterInterval);
    }, 70 + Math.random() * 60);
  } else {
    flipGlow(el);
  }

  const nextDelay = 900 + Math.random() * 2600;
  setTimeout(() => scheduleFlicker(el), nextDelay);
}

letters.forEach((el) => {
  setGlow(el, true);
  // Stagger each letter's very first flip so they don't all start in lockstep.
  setTimeout(() => scheduleFlicker(el), Math.random() * 2000);
});
