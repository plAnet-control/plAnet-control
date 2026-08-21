// ---------- CROSS-DOCUMENT SLIDE TRANSITION ----------
// index.html and product.html are separate documents (so each can be edited/
// live-reloaded independently), so a plain CSS transition can no longer
// animate across the navigation the way it did when both pages lived in one
// document. This restores that same slide by faking it: fetch the
// destination page, drop a static clone of it on top as an overlay, animate
// both the current page and the overlay with the exact transform/transition
// the single-document version used (1.1s, same easing), then hand off to a
// real navigation once the motion finishes — so the destination page's own
// scripts (3D model, flicker, modal, etc.) all initialize normally.
//
// The outgoing page starts sliding immediately on click, without waiting on
// the fetch — otherwise any network latency shows up as a dead pause before
// anything (including the nav tab riding out with the page) visibly moves.

const PAGE_TRANSITION_MS = 1100;
const PAGE_TRANSITION_EASE = 'cubic-bezier(0.65, 0, 0.35, 1)';

function slideToPage(url, direction, cssHref) {
  const current = document.querySelector('.page');
  const navigate = () => { window.location.href = url; };

  current.style.transition = `transform ${PAGE_TRANSITION_MS}ms ${PAGE_TRANSITION_EASE}`;
  requestAnimationFrame(() => {
    current.style.transform = direction === 'forward' ? 'translateY(-100%)' : 'translateY(100%)';
  });

  // Fallback in case the fetch below never resolves (e.g. offline) — the
  // outgoing slide above still played, so this just completes the handoff.
  const fallback = setTimeout(navigate, PAGE_TRANSITION_MS + 1500);

  fetch(url)
    .then((res) => res.text())
    .then((html) => {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const incoming = doc.querySelector('.page');
      if (!incoming) throw new Error('no .page element in fetched document');

      if (cssHref && !document.querySelector(`link[href="${cssHref}"]`)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = cssHref;
        document.head.appendChild(link);
      }

      const overlay = document.createElement('div');
      overlay.id = incoming.id;
      overlay.className = incoming.className;
      overlay.style.zIndex = '10';
      overlay.style.transform = direction === 'forward' ? 'translateY(100%)' : 'translateY(-100%)';
      overlay.style.transition = `transform ${PAGE_TRANSITION_MS}ms ${PAGE_TRANSITION_EASE}`;
      overlay.innerHTML = incoming.innerHTML;
      document.body.appendChild(overlay);

      // Force a layout flush so the starting transform above is committed
      // before we change it below — otherwise the browser can coalesce both
      // into one state and skip the animation entirely.
      overlay.getBoundingClientRect();

      requestAnimationFrame(() => {
        overlay.style.transform = 'translateY(0)';
      });

      clearTimeout(fallback);
      setTimeout(navigate, PAGE_TRANSITION_MS);
    })
    .catch(() => {
      clearTimeout(fallback);
      navigate();
    });
}
