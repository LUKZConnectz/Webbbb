const AUTH_KEY = 'freal_boxser_user';
const ALERT_TIMEOUT = 4200;
const CART_KEY = 'freal_boxser_cart';
const ORDERS_KEY = 'freal_boxser_orders';
const PRODUCTS_KEY = 'freal_boxser_products';
const DONATE_KEY = 'freal_boxser_donations';
const USERS_KEY = 'freal_boxser_users';
const TOPUP_KEY = 'freal_boxser_topups';
const THEME_KEY = 'freal_boxser_theme';
// แก้ไขประกาศหน้าแรกได้ที่นี่: เพิ่ม/ลบข้อความในรายการนี้ได้ทันที
const ANNOUNCEMENTS = [
  'ยินดีต้อนรับสู่ Freal Boxser',
  'เพิ่มข้อความประกาศได้ง่ายใน script.js',
  'เติมเงินและสั่งซื้อได้ตลอด 24 ชั่วโมง',
];

// แก้ไขสินค้าเริ่มต้นได้ที่นี่: เว้น image เป็นค่าว่างเพื่อให้เป็นกล่องเปล่าสำหรับใส่รูปเองภายหลัง
const PRODUCT = { id: 'night-vision', name: 'Night Vision Goggles', description: 'อุปกรณ์มองกลางคืน เหมาะสำหรับภารกิจลับหรือดูแลเวลากลางคืน', price: 3500, stock: 4, featured: true, image: '' };

function getUser() {
  try { return JSON.parse(localStorage.getItem(AUTH_KEY)); } catch { return null; }
}

function setUser(user) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

function refreshIcons(root = document) {
  if (window.lucide) window.lucide.createIcons({ attrs: { 'aria-hidden': 'true' }, root });
}

function ensureAlertRegion() {
  let region = document.querySelector('[data-alert-region]');
  if (!region) {
    region = document.createElement('div');
    region.className = 'alert-region';
    region.dataset.alertRegion = '';
    region.setAttribute('aria-live', 'polite');
    region.setAttribute('aria-relevant', 'additions');
    document.body.appendChild(region);
  }
  return region;
}

function escapeHTML(value) {
  return String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}


function readList(key) {
  try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; }
}

function writeList(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getUsers() { return readList(USERS_KEY); }
function saveUsers(users) { writeList(USERS_KEY, users); }
function upsertUser(user) {
  const users = getUsers();
  const index = users.findIndex((item) => item.username.toLowerCase() === user.username.toLowerCase());
  if (index >= 0) users[index] = { ...users[index], ...user };
  else users.push(user);
  saveUsers(users);
}
function updateCurrentUser(patch) {
  const user = { ...getUser(), ...patch };
  setUser(user);
  upsertUser(user);
  return user;
}

function getProducts() {
  const products = readList(PRODUCTS_KEY);
  return products.length ? products : Array.from({ length: 10 }, (_, index) => ({ ...PRODUCT, id: `${PRODUCT.id}-${index + 1}`, featured: index === 0 }));
}

function saveProducts(products) { writeList(PRODUCTS_KEY, products); }

function isAdmin(user = getUser()) { return user?.role === 'admin' || String(user?.username || '').toLowerCase() === 'admin'; }

function formatMoney(value) {
  return `฿ ${Number(value || 0).toFixed(2)}`;
}

function makeId() {
  return (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`);
}

function addCartItem(quantity) {
  const cart = readList(CART_KEY);
  const current = cart.find((item) => item.name === PRODUCT.name && item.price === PRODUCT.price);
  if (current) current.quantity += quantity;
  else cart.push({ ...PRODUCT, quantity });
  writeList(CART_KEY, cart);
}

function createOrder(items) {
  const orders = readList(ORDERS_KEY);
  const order = {
    id: makeId(),
    transactionId: makeId(),
    createdAt: new Date().toISOString(),
    status: 'pending',
    items: items.map((item) => ({ ...item })),
  };
  orders.unshift(order);
  writeList(ORDERS_KEY, orders);
  return order;
}

function formatThaiDate(value) {
  const date = value ? new Date(value) : new Date();
  const buddhistYear = date.getFullYear() + 543;
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${buddhistYear} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function showAlert({ title, message = '', type = 'success' }) {
  const region = ensureAlertRegion();
  const icons = { success: 'circle-check', error: 'circle-alert', info: 'info', warning: 'triangle-alert' };
  const alert = document.createElement('div');
  alert.className = `app-alert app-alert-${type}`;
  alert.setAttribute('role', type === 'error' ? 'alert' : 'status');
  alert.innerHTML = `
    <span class="alert-icon"><i data-lucide="${icons[type] || icons.info}"></i></span>
    <span class="alert-copy">
      <strong>${escapeHTML(title)}</strong>
      ${message ? `<small>${escapeHTML(message)}</small>` : ''}
    </span>
    <button class="alert-close" type="button" aria-label="ปิดแจ้งเตือน"><i data-lucide="x"></i></button>
  `;

  const close = () => {
    alert.classList.add('is-leaving');
    window.setTimeout(() => alert.remove(), 180);
  };

  alert.querySelector('.alert-close').addEventListener('click', close);
  region.appendChild(alert);
  refreshIcons(alert);
  window.setTimeout(close, ALERT_TIMEOUT);
}

function logout() {
  localStorage.removeItem(AUTH_KEY);
  window.location.href = 'login.html';
}

function requireAuth() {
  const user = getUser();
  if (!user) {
    window.location.href = 'login.html';
    return null;
  }
  document.querySelectorAll('[data-username]').forEach((el) => { el.textContent = user.displayName || user.username; });
  document.querySelectorAll('.admin-only').forEach((el) => { el.hidden = !isAdmin(user); });
  return user;
}


function applyTheme(theme = localStorage.getItem(THEME_KEY) || 'light') {
  document.body.classList.toggle('theme-dark', theme === 'dark');
  document.querySelectorAll('[data-theme-toggle]').forEach((button) => button.setAttribute('aria-pressed', theme === 'dark'));
}

function initChrome() {
  applyTheme();
  document.querySelectorAll('[data-theme-toggle]').forEach((button) => button.addEventListener('click', () => {
    const theme = document.body.classList.contains('theme-dark') ? 'light' : 'dark';
    localStorage.setItem(THEME_KEY, theme);
    applyTheme(theme);
  }));
  const page = document.body.dataset.page;
  document.querySelectorAll(`[data-nav="${page}"]`).forEach((link) => link.classList.add('is-active'));
  const count = readList(CART_KEY).reduce((sum, item) => sum + Number(item.quantity || 1), 0);
  document.querySelectorAll('[data-cart-count]').forEach((el) => { el.textContent = count; el.hidden = count === 0; });
}

function initLogin() {
  const form = document.querySelector('[data-login-form]');
  const error = document.querySelector('[data-login-error]');
  const modal = document.querySelector('[data-register-modal]');
  const registerForm = document.querySelector('[data-register-form]');
  const registerError = document.querySelector('[data-register-error]');
  if (!form) return;

  if (getUser()) {
    window.location.href = 'index.html';
    return;
  }

  const openRegister = () => {
    modal?.classList.add('is-open');
    modal?.removeAttribute('aria-hidden');
    document.body.classList.add('modal-open');
    modal?.querySelector('input')?.focus();
  };
  const closeRegister = () => {
    modal?.classList.remove('is-open');
    modal?.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  };
  document.querySelector('[data-open-register]')?.addEventListener('click', openRegister);
  document.querySelectorAll('[data-close-register]').forEach((button) => button.addEventListener('click', closeRegister));
  modal?.addEventListener('click', (event) => { if (event.target === modal) closeRegister(); });

  registerForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const fd = new FormData(registerForm);
    const username = String(fd.get('username') || '').trim();
    const password = String(fd.get('password') || '').trim();
    const displayName = String(fd.get('displayName') || username).trim();
    const users = getUsers();
    if (!username || !password) {
      registerError.textContent = 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน';
      registerError.hidden = false;
      return showAlert({ title: 'สมัครสมาชิกไม่สำเร็จ', message: registerError.textContent, type: 'error' });
    }
    if (users.some((item) => item.username.toLowerCase() === username.toLowerCase())) {
      registerError.textContent = 'ชื่อผู้ใช้นี้ถูกใช้แล้ว';
      registerError.hidden = false;
      return showAlert({ title: 'สมัครสมาชิกไม่สำเร็จ', message: registerError.textContent, type: 'error' });
    }
    const user = { username, password, displayName, role: username.toLowerCase() === 'admin' ? 'admin' : 'user', balance: 0, createdAt: new Date().toISOString() };
    upsertUser(user);
    setUser(user);
    showAlert({ title: 'สมัครสมาชิกสำเร็จ', message: `ยินดีต้อนรับ ${displayName}`, type: 'success' });
    window.setTimeout(() => { window.location.href = 'index.html'; }, 450);
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const username = String(formData.get('username') || '').trim();
    const password = String(formData.get('password') || '').trim();

    if (!username || !password) {
      const message = 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน';
      error.textContent = message;
      error.hidden = false;
      showAlert({ title: 'เข้าสู่ระบบไม่สำเร็จ', message, type: 'error' });
      return;
    }

    const users = getUsers();
    let user = users.find((item) => item.username.toLowerCase() === username.toLowerCase());
    if (user && user.password !== password) {
      const message = 'รหัสผ่านไม่ถูกต้อง';
      error.textContent = message;
      error.hidden = false;
      return showAlert({ title: 'เข้าสู่ระบบไม่สำเร็จ', message, type: 'error' });
    }
    if (!user) {
      user = { username, password, role: username.toLowerCase() === 'admin' ? 'admin' : 'user', displayName: username, balance: 0, createdAt: new Date().toISOString() };
      upsertUser(user);
    }
    setUser(user);
    showAlert({ title: 'เข้าสู่ระบบสำเร็จ', message: `ยินดีต้อนรับ ${user.displayName || username}`, type: 'success' });
    window.setTimeout(() => { window.location.href = 'index.html'; }, 450);
  });
}

function initStore() {
  if (!requireAuth()) return;
  renderStoreProducts();
  const modal = document.querySelector('[data-product-modal]');
  if (!modal) return;

  const quantity = modal.querySelector('[data-quantity]');
  const remaining = modal.querySelector('[data-remaining]');
  const closeButtons = modal.querySelectorAll('[data-close-modal]');
  const products = document.querySelectorAll('.product-card');
  const cartButton = modal.querySelector('[data-add-cart]');
  const orderButton = modal.querySelector('[data-order-now]');

  const openModal = () => {
    modal.classList.add('is-open');
    modal.removeAttribute('aria-hidden');
    document.body.classList.add('modal-open');
    quantity.value = '1';
    remaining.textContent = '4';
    quantity.focus();
  };

  const closeModal = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  };

  const getQuantity = () => Math.min(Math.max(Number(quantity.value) || 1, 1), Number(quantity.max) || 4);

  products.forEach((card) => {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.addEventListener('click', openModal);
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openModal();
      }
    });
  });

  quantity.addEventListener('input', () => { quantity.value = getQuantity(); });
  cartButton?.addEventListener('click', () => {
    addCartItem(getQuantity());
    showAlert({ title: 'เพิ่มลงตะกร้าแล้ว', message: `Night Vision Goggles จำนวน ${getQuantity()} ชิ้น`, type: 'success' });
  });
  orderButton?.addEventListener('click', () => {
    createOrder([{ ...PRODUCT, quantity: getQuantity() }]);
    showAlert({ title: 'สั่งซื้อสำเร็จ', message: 'กำลังพาไปตรวจสอบคำสั่งซื้อ', type: 'success' });
    closeModal();
    window.setTimeout(() => { window.location.href = 'orders.html'; }, 500);
  });

  closeButtons.forEach((button) => button.addEventListener('click', closeModal));
  modal.addEventListener('click', (event) => { if (event.target === modal) closeModal(); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && modal.classList.contains('is-open')) closeModal(); });
}


function renderStoreProducts() {
  const grid = document.querySelector('.product-grid');
  if (!grid) return;
  grid.innerHTML = getProducts().map((product, index) => {
    const image = String(product.image || '').trim();
    const imageStyle = image ? ` style="background-image: url('${escapeHTML(image)}')"` : '';
    return `<article class="product-card ${product.featured || index === 0 ? 'featured' : ''}"><span class="badge ${product.featured || index === 0 ? 'red' : 'dark'}">${product.featured || index === 0 ? 'สินค้าแนะนำ' : 'สินค้ายอดนิยม'}</span><div class="product-image${image ? ' has-image' : ''}"${imageStyle} aria-label="พื้นที่รูปสินค้า ใส่รูปเองได้"></div><div class="product-body"><h2>${escapeHTML(product.name)}</h2><p>${escapeHTML(product.description)}</p><strong class="price">${formatMoney(product.price)}</strong></div></article>`;
  }).join('');
}

function renderAnnouncements() {
  const track = document.querySelector('[data-announcement-track]');
  if (!track) return;
  const items = ANNOUNCEMENTS.length ? ANNOUNCEMENTS : ['เพิ่มประกาศร้านค้าได้ที่ script.js'];
  const marqueeItems = [...items, ...items];
  track.innerHTML = marqueeItems.map((message) => `<span><i data-lucide="bell" aria-hidden="true"></i> ${escapeHTML(message)}</span>`).join('');
  refreshIcons(track);
}

function initHeroSlider() {
  renderAnnouncements();
  const slider = document.querySelector('[data-hero-slider]');
  if (!slider) return;
  const slides = Array.from(slider.querySelectorAll('[data-slide]'));
  const prev = slider.querySelector('[data-slide-prev]');
  const next = slider.querySelector('[data-slide-next]');
  if (slides.length < 2) return;
  let active = 0;
  let timer;
  const show = (index) => {
    active = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => slide.classList.toggle('is-active', slideIndex === active));
  };
  const start = () => { timer = window.setInterval(() => show(active + 1), 3600); };
  const restart = () => { window.clearInterval(timer); start(); };
  prev?.addEventListener('click', () => { show(active - 1); restart(); });
  next?.addEventListener('click', () => { show(active + 1); restart(); });
  slider.addEventListener('mouseenter', () => window.clearInterval(timer));
  slider.addEventListener('mouseleave', start);
  start();
}

function initAdmin() {
  if (document.body.dataset.page !== 'admin') return;
  const user = requireAuth();
  if (!user) return;
  if (!isAdmin(user)) { showAlert({ title: 'ไม่มีสิทธิ์เข้าระบบหลังบ้าน', message: 'หน้านี้สำหรับผู้ดูแลเท่านั้น', type: 'error' }); window.setTimeout(() => { window.location.href = 'index.html'; }, 700); return; }
  const list = document.querySelector('[data-admin-order-list]');
  const ordersMetric = document.querySelector('[data-admin-orders]');
  const salesMetric = document.querySelector('[data-admin-sales]');
  const refresh = document.querySelector('[data-admin-refresh]');
  const productForm = document.querySelector('[data-admin-product-form]');
  const productsMetric = document.querySelector('[data-admin-products]');
  const productsList = document.querySelector('[data-admin-products-list]');
  const topupMetric = document.querySelector('[data-admin-topups]');
  const topupList = document.querySelector('[data-admin-topup-list]');
  const statusText = { pending: 'รอชำระเงิน', cancelled: 'ยกเลิกแล้ว', paid: 'ชำระเงินแล้ว' };

  const render = () => {
    const orders = readList(ORDERS_KEY);
    const sales = orders.filter((order) => order.status === 'paid').reduce((sum, order) => sum + order.items.reduce((lineSum, item) => lineSum + item.price * item.quantity, 0), 0);
    ordersMetric.textContent = orders.length;
    salesMetric.textContent = formatMoney(sales);
    const products = getProducts();
    if (productsMetric) productsMetric.textContent = products.length;
    const topups = readList(TOPUP_KEY);
    if (topupMetric) topupMetric.textContent = topups.filter((item) => item.status === 'pending').length;
    if (topupList) topupList.innerHTML = topups.length ? topups.map((item) => {
      const proof = item.slip ? `<img src="${item.slip}" alt="สลิปเติมเงิน ${escapeHTML(item.id)}" />` : `<p class="order-detail">ลิงก์ซองของขวัญ: ${escapeHTML(item.voucherLink || '-')}</p>`;
      return `<article class="admin-order topup-review" data-topup-id="${escapeHTML(item.id)}"><div><h3>${escapeHTML(item.displayName || item.username)} · ${formatMoney(item.amount)}</h3><p>${formatThaiDate(item.createdAt)} · ${item.status === 'approved' ? 'อนุมัติแล้ว' : item.status === 'rejected' ? 'ปฏิเสธแล้ว' : 'รอตรวจสอบ'}</p>${proof}</div><div class="topup-review-actions"><button class="pill" type="button" data-approve-topup>ยืนยัน</button><button class="pill ghost-pill" type="button" data-reject-topup>ปฏิเสธ</button></div></article>`;
    }).join('') : '<p class="empty-state">ยังไม่มีคำขอเติมเงินให้ตรวจสอบ</p>';
    if (productsList) productsList.innerHTML = products.map((product) => `<article class="admin-order" data-product-id="${escapeHTML(product.id)}"><div><h3>${escapeHTML(product.name)}</h3><p>${formatMoney(product.price)} · คงเหลือ ${Number(product.stock || 0)} ชิ้น</p></div><button class="pill" type="button" data-delete-product>ลบ</button></article>`).join('');
    list.innerHTML = orders.length ? orders.map((order) => `
      <article class="admin-order">
        <div><h3>${escapeHTML(order.id)}</h3><p>${formatThaiDate(order.createdAt)} · ${escapeHTML(statusText[order.status] || order.status)}</p></div>
        <strong>${formatMoney(order.items.reduce((sum, item) => sum + item.price * item.quantity, 0))}</strong>
      </article>
    `).join('') : '<p class="empty-state">ยังไม่มีคำสั่งซื้อให้จัดการ</p>';
  };

  refresh?.addEventListener('click', () => { render(); showAlert({ title: 'รีเฟรชข้อมูลแล้ว', message: 'อัปเดตรายการคำสั่งซื้อในระบบหลังบ้านสำเร็จ', type: 'success' }); });
  productForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(productForm);
    const products = getProducts();
    products.unshift({ id: makeId(), name: String(formData.get('product-name') || 'สินค้าใหม่'), description: String(formData.get('product-description') || 'สินค้าในร้าน Freal Boxser'), price: Number(formData.get('product-price') || 0), stock: Number(formData.get('product-stock') || 1), featured: false, image: '' });
    saveProducts(products);
    productForm.reset();
    render();
    showAlert({ title: 'เพิ่มสินค้าสำเร็จ', message: 'สินค้าใหม่ถูกเพิ่มเข้าระบบหลังบ้านแล้ว', type: 'success' });
  });
  productsList?.addEventListener('click', (event) => {
    const card = event.target.closest('[data-product-id]');
    if (!card || !event.target.closest('[data-delete-product]')) return;
    saveProducts(getProducts().filter((product) => product.id !== card.dataset.productId));
    render();
    showAlert({ title: 'ลบสินค้าแล้ว', message: 'อัปเดตรายการสินค้าเรียบร้อย', type: 'success' });
  });

  topupList?.addEventListener('click', (event) => {
    const card = event.target.closest('[data-topup-id]');
    if (!card) return;
    const topups = readList(TOPUP_KEY);
    const topup = topups.find((item) => item.id === card.dataset.topupId);
    if (!topup || topup.status !== 'pending') return;
    if (event.target.closest('[data-approve-topup]')) {
      topup.status = 'approved';
      topup.approvedAt = new Date().toISOString();
      const target = getUsers().find((item) => item.username === topup.username) || (getUser()?.username === topup.username ? getUser() : null);
      if (target) upsertUser({ ...target, balance: Number(target.balance || 0) + Number(topup.amount || 0) });
      if (getUser()?.username === topup.username) updateCurrentUser({ balance: Number(getUser().balance || 0) + Number(topup.amount || 0) });
      writeList(TOPUP_KEY, topups);
      render();
      showAlert({ title: 'ยืนยันการเติมเงินแล้ว', message: `${topup.displayName} ได้รับ ${formatMoney(topup.amount)}`, type: 'success' });
    }
    if (event.target.closest('[data-reject-topup]')) {
      topup.status = 'rejected';
      writeList(TOPUP_KEY, topups);
      render();
      showAlert({ title: 'ปฏิเสธสลิปแล้ว', message: 'รายการนี้จะไม่ถูกเพิ่มยอดเงิน', type: 'warning' });
    }
  });
  render();
}

function initCart() {
  if (document.body.dataset.page !== 'cart') return;
  if (!requireAuth()) return;
  const list = document.querySelector('[data-cart-list]');
  const total = document.querySelector('[data-cart-total]');
  const checkout = document.querySelector('[data-checkout]');
  if (!list) return;

  const render = () => {
    const cart = readList(CART_KEY);
    list.innerHTML = cart.length ? cart.map((item) => `
      <article class="cart-item">
        <div>
          <h2>${escapeHTML(item.name)}</h2>
          <p>${escapeHTML(item.description)}</p>
          <small>จำนวน ${Number(item.quantity || 1)}</small>
        </div>
        <strong class="item-price">${formatMoney(item.price * item.quantity)}</strong>
      </article>
    `).join('') : '<p class="empty-state">ยังไม่มีสินค้าในตะกร้า กลับไปเลือกสินค้าได้ที่หน้าร้าน</p>';
    total.textContent = formatMoney(cart.reduce((sum, item) => sum + item.price * item.quantity, 0));
    checkout.disabled = !cart.length;
  };

  checkout?.addEventListener('click', () => {
    const cart = readList(CART_KEY);
    if (!cart.length) return;
    createOrder(cart);
    writeList(CART_KEY, []);
    showAlert({ title: 'สั่งซื้อสำเร็จ', message: 'ไปยังหน้ารายการคำสั่งซื้อเพื่อตรวจสอบสถานะ', type: 'success' });
    window.setTimeout(() => { window.location.href = 'orders.html'; }, 500);
  });
  render();
}

function initOrders() {
  if (document.body.dataset.page !== 'orders') return;
  if (!requireAuth()) return;
  const list = document.querySelector('[data-orders-list]');
  if (!list) return;
  const statusText = { pending: 'รอชำระเงิน', cancelled: 'ยกเลิกแล้ว', paid: 'ชำระเงินแล้ว' };
  const render = () => {
    const orders = readList(ORDERS_KEY);
    list.innerHTML = orders.length ? orders.map((order) => `
      <article class="order-card" data-order-id="${escapeHTML(order.id)}">
        <div class="order-head"><div><h2>รหัสคำสั่งซื้อ: ${escapeHTML(order.id)}</h2><p class="order-meta">วันที่: ${formatThaiDate(order.createdAt)}</p><p class="order-meta">การชำระเงิน: <span class="status ${order.status}">${statusText[order.status] || order.status}</span></p></div><p class="order-code">รหัสธุรกรรม:<br>${escapeHTML(order.transactionId)}</p></div>
        <div class="order-lines">${order.items.map((item) => `<div class="order-line"><div><h3>${escapeHTML(item.name)}</h3><small>จำนวน: ${Number(item.quantity || 1)}</small></div><strong class="order-price">${formatMoney(item.price * item.quantity)}<small>(${Number(item.price).toFixed(2)} x ${Number(item.quantity || 1)})</small></strong></div>`).join('')}</div>
        <div class="order-detail" hidden>รายละเอียดคำสั่งซื้อ: สินค้าทั้งหมด ${order.items.reduce((sum, item) => sum + Number(item.quantity || 1), 0)} ชิ้น ยอดรวม ${formatMoney(order.items.reduce((sum, item) => sum + item.price * item.quantity, 0))} สถานะ ${statusText[order.status] || order.status}</div>
        <div class="order-actions"><button class="pill" type="button" data-cancel-order>ยกเลิกคำสั่งซื้อ</button><button class="pill pay-btn" type="button" data-pay-order>ชำระเงิน</button><button class="pill" type="button" data-toggle-detail>ดูรายละเอียด</button></div>
      </article>
    `).join('') : '<p class="empty-state">ยังไม่มีคำสั่งซื้อ</p>';
    refreshIcons(list);
  };
  list.addEventListener('click', (event) => {
    const card = event.target.closest('[data-order-id]');
    if (!card) return;
    const id = card.dataset.orderId;
    const orders = readList(ORDERS_KEY);
    const order = orders.find((item) => item.id === id);
    if (event.target.closest('[data-toggle-detail]')) card.querySelector('.order-detail').hidden = !card.querySelector('.order-detail').hidden;
    if (event.target.closest('[data-cancel-order]') && order) { order.status = 'cancelled'; writeList(ORDERS_KEY, orders); render(); showAlert({ title: 'ยกเลิกคำสั่งซื้อแล้ว', message: 'อัปเดตสถานะในระบบสำเร็จ', type: 'success' }); }
    if (event.target.closest('[data-pay-order]') && order) { order.status = 'paid'; writeList(ORDERS_KEY, orders); render(); showAlert({ title: 'ยืนยันการชำระเงินสำเร็จ', message: 'คำสั่งซื้อถูกปรับเป็นชำระเงินแล้ว', type: 'success' }); }
  });
  render();
}

function initTopup() {
  const user = requireAuth();
  if (!user) return;
  const form = document.querySelector('[data-topup-form]');
  const manualForm = document.querySelector('[data-manual-topup-form]');
  const methodButtons = document.querySelectorAll('[data-topup-method]');
  const balanceEl = document.querySelector('[data-user-balance]');
  const updateBalanceText = () => {
    const current = getUser() || user;
    if (balanceEl) balanceEl.textContent = `${Number(current.balance || 0).toLocaleString('th-TH')} พอยท์`;
  };
  updateBalanceText();
  if (!form) return;

  methodButtons.forEach((button) => button.addEventListener('click', () => {
    methodButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.classList.toggle('ghost-pill', !active);
      item.setAttribute('aria-pressed', active);
    });
  }));

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const amount = Number(formData.get('amount') || 0);
    const voucherLink = String(formData.get('voucher-link') || '').trim();

    if (amount <= 0 || !voucherLink) {
      showAlert({ title: 'ส่งคำขอไม่สำเร็จ', message: 'กรุณาระบุลิงก์ซองของขวัญและจำนวนเงินก่อนยืนยัน', type: 'error' });
      return;
    }

    const topups = readList(TOPUP_KEY);
    topups.unshift({ id: makeId(), username: user.username, displayName: user.displayName || user.username, amount, voucherLink, slip: '', status: 'pending', createdAt: new Date().toISOString() });
    writeList(TOPUP_KEY, topups);
    showAlert({ title: 'ส่งคำขอเติมเงินแล้ว', message: 'รอแอดมินตรวจสอบซองของขวัญและยืนยันยอดเติมเงิน', type: 'success' });
    form.reset();
  });

  manualForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const amount = Number(new FormData(manualForm).get('amount') || 0);
    if (amount <= 0) {
      showAlert({ title: 'เติมเงินไม่สำเร็จ', message: 'กรุณาระบุยอดเงินที่ต้องการเติม', type: 'error' });
      return;
    }
    const updated = updateCurrentUser({ balance: Number(getUser().balance || 0) + amount });
    manualForm.reset();
    updateBalanceText();
    showAlert({ title: 'เติมเงินสำเร็จ', message: `ยอดคงเหลือปัจจุบัน ${formatMoney(updated.balance)}`, type: 'success' });
  });
}

function initProfile() {
  if (document.body.dataset.page !== 'profile') return;
  const user = requireAuth(); if (!user) return;
  document.querySelector('[data-profile-name]').textContent = user.displayName || user.username;
  document.querySelector('[data-wallet-balance]').textContent = formatMoney(user.balance || 0);
  document.querySelector('[data-user-role]').textContent = isAdmin(user) ? 'ADMIN' : 'USER';
  document.querySelector('[data-profile-orders]').textContent = readList(ORDERS_KEY).length;
  const form = document.querySelector('[data-profile-form]');
  form?.addEventListener('submit', (event) => { event.preventDefault(); user.displayName = new FormData(form).get('displayName') || user.displayName; updateCurrentUser(user); requireAuth(); showAlert({ title: 'บันทึกโปรไฟล์แล้ว', type: 'success' }); });
}

function initDonate() {
  if (document.body.dataset.page !== 'donate') return;
  if (!requireAuth()) return;
  const goal = 10000, form = document.querySelector('[data-donate-form]'), list = document.querySelector('[data-donate-list]');
  const render = () => { const items = readList(DONATE_KEY); const total = items.reduce((s,i)=>s+Number(i.amount||0),0); document.querySelector('[data-donate-total]').textContent = `${formatMoney(total)} / ${formatMoney(goal)}`; document.querySelector('[data-donate-bar]').style.width = `${Math.min(total / goal * 100, 100)}%`; list.innerHTML = items.length ? items.map(i => `<article class="donate-row"><strong>${escapeHTML(i.donor)}</strong><span>${formatMoney(i.amount)}</span></article>`).join('') : '<p class="empty-state">ยังไม่มีผู้โดเนท เป็นคนแรกได้เลย!</p>'; };
  form?.addEventListener('submit', (event) => { event.preventDefault(); const fd = new FormData(form); const amount = Number(fd.get('amount') || 0); if (amount <= 0) return showAlert({ title: 'กรุณาใส่ยอดโดเนท', type: 'error' }); const items = readList(DONATE_KEY); items.unshift({ donor: fd.get('donor') || getUser().username, amount, createdAt: new Date().toISOString() }); writeList(DONATE_KEY, items); form.reset(); render(); showAlert({ title: 'ขอบคุณสำหรับการโดเนท', message: formatMoney(amount), type: 'success' }); });
  render();
}

document.addEventListener('DOMContentLoaded', () => {
  initChrome();
  refreshIcons();
  document.querySelectorAll('[data-logout]').forEach((button) => button.addEventListener('click', logout));
  if (document.body.dataset.page === 'login') initLogin();
  initHeroSlider();
  if (document.body.dataset.protected === 'true') {
    initStore();
    initCart();
    initOrders();
    initTopup();
    initAdmin();
    initProfile();
    initDonate();
  }
});
