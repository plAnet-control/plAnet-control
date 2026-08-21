// ---------- PRODUCT DETAIL WINDOW ----------

const productModal = document.getElementById('productModal');
const modalClose = document.getElementById('modalClose');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const modalMediaLabel = document.getElementById('modalMediaLabel');
const blobs = document.querySelectorAll('.blob');

// ---------- HOVER REACTION ----------
// While the cursor is actually over a blob (not before), its outline leans
// toward wherever inside it the cursor sits — the corner nearest the cursor
// sharpens while the opposite one rounds off. Pairs with the CSS :hover
// scale-up in product.css.
const MAX_SHIFT = 22; // max percentage a corner can shift from its 50% rest
const SQRT1_2 = Math.SQRT1_2;
const CORNER_DIRS = [
  { x: -SQRT1_2, y: -SQRT1_2 }, // top-left
  { x: SQRT1_2, y: -SQRT1_2 },  // top-right
  { x: SQRT1_2, y: SQRT1_2 },   // bottom-right
  { x: -SQRT1_2, y: SQRT1_2 },  // bottom-left
];

blobs.forEach((blob) => {
  blob.addEventListener('mousemove', (e) => {
    const rect = blob.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.hypot(dx, dy) || 0.001;
    const halfDiagonal = Math.hypot(rect.width, rect.height) / 2;
    const pull = Math.min(dist / halfDiagonal, 1);
    const dirX = dx / dist;
    const dirY = dy / dist;

    const corners = CORNER_DIRS.map(({ x, y }) => {
      const align = dirX * x + dirY * y; // -1..1
      const radius = 50 - align * pull * MAX_SHIFT;
      return `${radius}%`;
    });
    blob.style.borderRadius = corners.join(' ');
    blob.style.animationPlayState = 'paused';
  });

  blob.addEventListener('mouseleave', () => {
    blob.style.borderRadius = '';
    blob.style.animationPlayState = '';
  });
});

function openProductModal(blob) {
  modalTitle.textContent = blob.dataset.title || '';
  modalDesc.textContent = blob.dataset.desc || '';
  modalMediaLabel.textContent = blob.dataset.title || '';
  productModal.classList.add('visible');
  productModal.setAttribute('aria-hidden', 'false');
}

function closeProductModal() {
  productModal.classList.remove('visible');
  productModal.setAttribute('aria-hidden', 'true');
}

blobs.forEach((blob) => {
  blob.addEventListener('click', () => openProductModal(blob));
  blob.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openProductModal(blob);
    }
  });
});

modalClose.addEventListener('click', closeProductModal);

productModal.addEventListener('click', (e) => {
  if (e.target === productModal) closeProductModal();
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && productModal.classList.contains('visible')) {
    closeProductModal();
  }
});
