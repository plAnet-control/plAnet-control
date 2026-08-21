// ---------- BOTTOM-HOVER "NEXT PAGE" TAB ----------
// nextTab keeps a real href to product.html (no-JS fallback, middle-click,
// etc.), but a plain click is intercepted to play the slide transition —
// see page-transition.js.

const nextTab = document.getElementById('nextTab');
const HOVER_ZONE_PX = 110;
let cursorNearBottom = false;
let scrollBoosted = false;

// Visibility depends on two independent signals (cursor position, recent
// scroll). Each one used to just toggle the class straight off its own
// condition — so if you scrolled to reveal the tab and then moved the mouse
// toward it, the mousemove handler would stomp the class back off the
// instant it ran (cursor not in the zone *yet*), then back on once it
// arrived, flickering the tab away and back. Routing both through one
// function that ORs them together fixes that.
function updateTabVisibility() {
  nextTab.classList.toggle('visible', cursorNearBottom || scrollBoosted);
}

window.addEventListener('mousemove', (e) => {
  cursorNearBottom = window.innerHeight - e.clientY < HOVER_ZONE_PX;
  updateTabVisibility();
});

window.addEventListener('touchstart', (e) => {
  const touch = e.touches[0];
  if (touch && window.innerHeight - touch.clientY < HOVER_ZONE_PX) {
    cursorNearBottom = true;
    updateTabVisibility();
  }
}, { passive: true });

// ---------- SCROLL-DOWN ALSO REVEALS THE TAB ----------
// The page itself doesn't scroll (overflow: hidden), but a downward scroll
// gesture still fires wheel events — treat it as intent to go to the next
// page and reveal the tab the same as hovering near the bottom. Auto-hides
// shortly after unless the cursor is genuinely sitting in the hover zone,
// so a single scroll doesn't leave it stuck open.
let scrollBoostTimer = null;
window.addEventListener('wheel', (e) => {
  if (e.deltaY <= 0) return;
  scrollBoosted = true;
  updateTabVisibility();
  clearTimeout(scrollBoostTimer);
  scrollBoostTimer = setTimeout(() => {
    scrollBoosted = false;
    updateTabVisibility();
  }, 1200);
}, { passive: true });

nextTab.addEventListener('click', (e) => {
  e.preventDefault();
  // Hide instantly (skip its own reveal/hide transition) rather than
  // riding along, visibly, with the page for the whole slide — it should
  // read as "gone" the moment you commit to navigating.
  nextTab.style.transition = 'none';
  nextTab.style.opacity = '0';
  slideToPage('product.html', 'forward', 'css/product.css');
});
