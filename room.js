// ---------- Toast helper ----------
function showToast(message) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove('show'), 2000);
}

// ---------- Cart ----------
const cartCount = document.getElementById('cart-count');

function addQuantityToCart(card, message) {
  const select = card.querySelector('.num');
  const value = parseInt(select.value, 10) || 1;
  const current = parseInt(cartCount.innerText, 10) || 0;
  cartCount.innerText = current + value;
  showToast(message);
}

document.querySelectorAll('.card').forEach((card) => {
  const addBtn = card.querySelector('.add');
  const buyBtn = card.querySelector('.buy');
  const title = card.querySelector('.title')?.innerText.trim() || 'Item';

  if (addBtn) {
    addBtn.addEventListener('click', () => {
      addQuantityToCart(card, `Added "${title}" to cart`);
    });
  }

  if (buyBtn) {
    buyBtn.addEventListener('click', () => {
      addQuantityToCart(card, `Proceeding to buy "${title}"`);
    });
  }
});

// ---------- Favorite ----------
document.querySelectorAll('.favorite').forEach((heart) => {
  heart.addEventListener('click', () => {
    heart.classList.toggle('active');
    const icon = heart.querySelector('i');
    if (!icon) return;
    icon.classList.toggle('fa-regular');
    icon.classList.toggle('fa-solid');
  });
});

// ---------- Search filter ----------
const searchInput = document.querySelector('.search input');
const cards = document.querySelectorAll('.card');

if (searchInput) {
  searchInput.addEventListener('input', () => {
    const value = searchInput.value.toLowerCase();
    cards.forEach((card) => {
      const title = card.querySelector('.title').innerText.toLowerCase();
      card.style.display = title.includes(value) ? 'flex' : 'none';
    });
    updateEmptyState();
  });
}

// ---------- Category filter (nav buttons) ----------
const filterLinks = document.querySelectorAll('nav a[data-filter]');
const grid = document.querySelector('.continer');

function updateEmptyState() {
  if (!grid) return;
  let existing = grid.querySelector('.empty-state');
  const anyVisible = Array.from(cards).some((c) => c.style.display !== 'none');
  if (!anyVisible) {
    if (!existing) {
      existing = document.createElement('p');
      existing.className = 'empty-state';
      existing.textContent = 'No products in this category yet — check back soon!';
      grid.appendChild(existing);
    }
  } else if (existing) {
    existing.remove();
  }
}

filterLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    filterLinks.forEach((l) => l.classList.remove('active'));
    link.classList.add('active');

    const filter = link.dataset.filter;
    cards.forEach((card) => {
      const category = card.dataset.category;
      const show = filter === 'all' || category === filter;
      card.style.display = show ? 'flex' : 'none';
    });
    updateEmptyState();
  });
});

// ---------- Scroll reveal for product cards ----------
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);
cards.forEach((card) => revealObserver.observe(card));
