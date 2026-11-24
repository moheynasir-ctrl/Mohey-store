const WHATSAPP_NUMBER = '201050422690';
const currency = new Intl.NumberFormat('ar-EG', { maximumFractionDigits: 0 });
const categories = [
  { id: 'all', label: 'الكل' },
  { id: 'fragrance', label: 'عطور' },
  { id: 'care', label: 'عناية وكريمات' },
  { id: 'spices', label: 'عطارة' },
  { id: 'topup', label: 'شحن' },
];
const products = [
  { id: 'oud-musk', name: 'عطر عود ومسك', category: 'fragrance', categoryLabel: 'عطور', price: 280, emoji: '🧴', color: '#e8dcc5', tag: 'اختيار مميز' },
  { id: 'amber-perfume', name: 'عطر العنبر الشرقي', category: 'fragrance', categoryLabel: 'عطور', price: 340, emoji: '✨', color: '#e7d2bd', tag: 'جديد' },
  { id: 'body-cream', name: 'كريم ترطيب يومي', category: 'care', categoryLabel: 'عناية وكريمات', price: 165, emoji: '🫙', color: '#dce8df', tag: 'عناية' },
  { id: 'shea-butter', name: 'زبدة الشيا الطبيعية', category: 'care', categoryLabel: 'عناية وكريمات', price: 210, emoji: '🌿', color: '#e5e7d4', tag: 'طبيعي' },
  { id: 'hibiscus', name: 'كركديه مجفف — 250 جم', category: 'spices', categoryLabel: 'عطارة', price: 95, emoji: '🌺', color: '#ecd9d7', tag: '250 جم' },
  { id: 'sudanese-peanuts', name: 'فول سوداني — 500 جم', category: 'spices', categoryLabel: 'عطارة', price: 120, emoji: '🥜', color: '#e9dfc9', tag: '500 جم' },
  { id: 'spice-mix', name: 'خلطة بهارات سودانية', category: 'spices', categoryLabel: 'عطارة', price: 85, emoji: '🧉', color: '#e9d8c5', tag: 'خلطة خاصة' },
  { id: 'mobile-credit', name: 'شحن رصيد — قيمة تجريبية', category: 'topup', categoryLabel: 'شحن', price: 100, emoji: '📱', color: '#dbe5e8', tag: 'قيمة تجريبية' },
];

let activeCategory = 'all';
let searchTerm = '';
let cart = loadCart();
const productGrid = document.querySelector('#productGrid');
const categoryFilters = document.querySelector('#categoryFilters');
const searchInput = document.querySelector('#searchInput');
const cartDrawer = document.querySelector('#cartDrawer');
const drawerBackdrop = document.querySelector('#drawerBackdrop');
const toast = document.querySelector('#toast');
let toastTimer;

function loadCart() {
  try { return JSON.parse(localStorage.getItem('maadi-nile-cart')) || {}; }
  catch { return {}; }
}
function saveCart() {
  try { localStorage.setItem('maadi-nile-cart', JSON.stringify(cart)); } catch { /* Storage is optional. */ }
}
function formatPrice(value) { return `${currency.format(value)} ج.م`; }

function renderCategories() {
  categoryFilters.innerHTML = categories.map(category => `
    <button class="category-button ${activeCategory === category.id ? 'active' : ''}" type="button" data-category="${category.id}" aria-pressed="${activeCategory === category.id}">${category.label}</button>
  `).join('');
}

function renderProducts() {
  const visible = products.filter(product => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    const matchesSearch = `${product.name} ${product.categoryLabel}`.toLocaleLowerCase('ar').includes(searchTerm.toLocaleLowerCase('ar'));
    return matchesCategory && matchesSearch;
  });
  productGrid.innerHTML = visible.map(product => `
    <article class="product-card">
      <div class="product-art" style="background:${product.color}">
        <span class="product-tag">${product.tag}</span><span class="product-emoji" role="img" aria-label="${product.categoryLabel}">${product.emoji}</span>
      </div>
      <div class="product-meta">
        <div class="product-category">${product.categoryLabel}</div>
        <h3 class="product-name">${product.name}</h3>
        <div class="product-bottom"><span class="product-price">${formatPrice(product.price)} <small>للوحدة</small></span><button class="add-button" type="button" data-add="${product.id}" aria-label="أضف ${product.name} إلى السلة">+</button></div>
      </div>
    </article>
  `).join('');
  document.querySelector('#emptyState').hidden = visible.length > 0;
}

function renderCart() {
  const entries = Object.entries(cart).filter(([, quantity]) => quantity > 0);
  const count = entries.reduce((sum, [, quantity]) => sum + quantity, 0);
  const total = entries.reduce((sum, [id, quantity]) => sum + (products.find(product => product.id === id)?.price || 0) * quantity, 0);
  document.querySelector('#cartCount').textContent = count;
  document.querySelector('#drawerItemCount').textContent = `(${count})`;
  document.querySelector('#cartTotal').textContent = formatPrice(total);
  document.querySelector('#cartEmpty').hidden = count > 0;
  document.querySelector('#checkout').hidden = count === 0;
  document.querySelector('#cartItems').innerHTML = entries.map(([id, quantity]) => {
    const product = products.find(item => item.id === id);
    if (!product) return '';
    return `<div class="cart-line">
      <div class="cart-thumb" style="background:${product.color}" aria-hidden="true">${product.emoji}</div>
      <div><p class="cart-line-name">${product.name}</p><span class="cart-line-price">${formatPrice(product.price * quantity)}</span><div class="quantity-control"><button type="button" data-quantity="${id}" data-change="-1" aria-label="تقليل الكمية">−</button><span>${quantity}</span><button type="button" data-quantity="${id}" data-change="1" aria-label="زيادة الكمية">+</button></div></div>
      <button class="remove-item" type="button" data-remove="${id}" aria-label="حذف ${product.name}">×</button>
    </div>`;
  }).join('');
}

function updateCart(id, change) {
  cart[id] = Math.max(0, (cart[id] || 0) + change);
  if (!cart[id]) delete cart[id];
  saveCart();
  renderCart();
}
function openCart() {
  cartDrawer.classList.add('open');
  drawerBackdrop.classList.add('open');
  cartDrawer.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  document.querySelector('#closeDrawer').focus();
}
function closeCart() {
  cartDrawer.classList.remove('open');
  drawerBackdrop.classList.remove('open');
  cartDrawer.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
}

categoryFilters.addEventListener('click', event => {
  const button = event.target.closest('[data-category]');
  if (!button) return;
  activeCategory = button.dataset.category;
  renderCategories();
  renderProducts();
});
searchInput.addEventListener('input', event => {
  searchTerm = event.target.value.trim();
  renderProducts();
});
productGrid.addEventListener('click', event => {
  const button = event.target.closest('[data-add]');
  if (!button) return;
  updateCart(button.dataset.add, 1);
  showToast('أُضيف المنتج إلى سلتك');
});
document.querySelector('#cartItems').addEventListener('click', event => {
  const quantityButton = event.target.closest('[data-quantity]');
  const removeButton = event.target.closest('[data-remove]');
  if (quantityButton) updateCart(quantityButton.dataset.quantity, Number(quantityButton.dataset.change));
  if (removeButton) updateCart(removeButton.dataset.remove, -(cart[removeButton.dataset.remove] || 0));
});
document.querySelector('#cartTrigger').addEventListener('click', openCart);
document.querySelector('#closeDrawer').addEventListener('click', closeCart);
drawerBackdrop.addEventListener('click', closeCart);
document.querySelector('#continueShopping').addEventListener('click', () => {
  closeCart();
  document.querySelector('#products').scrollIntoView({ behavior: 'smooth' });
});
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeCart(); });
document.querySelector('#orderForm').addEventListener('submit', event => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const lines = Object.entries(cart).map(([id, quantity]) => {
    const product = products.find(item => item.id === id);
    return product ? `• ${product.name} × ${quantity} — ${formatPrice(product.price * quantity)}` : '';
  }).filter(Boolean);
  const total = Object.entries(cart).reduce((sum, [id, quantity]) => sum + (products.find(product => product.id === id)?.price || 0) * quantity, 0);
  const message = [
    'مرحبًا Maadi Nile، أريد تأكيد الطلب التالي:', '', ...lines, '',
    `الإجمالي التقريبي: ${formatPrice(total)}`,
    `اسم المحل/المستلم: ${form.get('customer')}`,
    `رقم التواصل: ${form.get('phone')}`,
    `طريقة الدفع: ${form.get('payment')}`,
    form.get('note') ? `ملاحظة: ${form.get('note')}` : '',
    '', 'أرجو تأكيد التوفر والسعر النهائي ومعلومات التوصيل.'
  ].filter(Boolean).join('\n');
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
});
document.querySelector('#currentYear').textContent = new Date().getFullYear();
renderCategories();
renderProducts();
renderCart();
