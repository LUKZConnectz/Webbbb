const AUTH_KEY = 'freal_boxser_user';
const ALERT_TIMEOUT = 4200;
const CART_KEY = 'freal_boxser_cart';
const ORDERS_KEY = 'freal_boxser_orders';
const PRODUCT = { name: 'Night Vision Goggles', description: 'อุปกรณ์มองกลางคืน เหมาะสำหรับภารกิจลับหรือดูแลเวลากลางคืน', price: 3500 };

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
  document.querySelectorAll('[data-username]').forEach((el) => { el.textContent = user.username; });
  return user;
}

function initLogin() {
  const form = document.querySelector('[data-login-form]');
  const error = document.querySelector('[data-login-error]');
  if (!form) return;

  if (getUser()) {
    window.location.href = 'index.html';
    return;
  }

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

    setUser({ username });
    showAlert({ title: 'เข้าสู่ระบบสำเร็จ', message: `ยินดีต้อนรับ ${username}`, type: 'success' });
    window.setTimeout(() => { window.location.href = 'index.html'; }, 450);
  });
}

function initStore() {
  if (!requireAuth()) return;
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


function initHeroSlider() {
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
  if (!requireAuth()) return;
  const list = document.querySelector('[data-admin-order-list]');
  const ordersMetric = document.querySelector('[data-admin-orders]');
  const salesMetric = document.querySelector('[data-admin-sales]');
  const refresh = document.querySelector('[data-admin-refresh]');
  const productForm = document.querySelector('[data-admin-product-form]');
  const statusText = { pending: 'รอชำระเงิน', cancelled: 'ยกเลิกแล้ว', paid: 'ชำระเงินแล้ว' };

  const render = () => {
    const orders = readList(ORDERS_KEY);
    const sales = orders.filter((order) => order.status === 'paid').reduce((sum, order) => sum + order.items.reduce((lineSum, item) => lineSum + item.price * item.quantity, 0), 0);
    ordersMetric.textContent = orders.length;
    salesMetric.textContent = formatMoney(sales);
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
    showAlert({ title: 'บันทึกสินค้าสำเร็จ', message: 'ระบบจำลองได้บันทึกข้อมูลสินค้าเรียบร้อย', type: 'success' });
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
  if (!requireAuth()) return;
  const form = document.querySelector('[data-topup-form]');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const input = form.querySelector('[name="slip-url"]');
    const value = input.value.trim();

    if (!value) {
      showAlert({ title: 'เติมเงินไม่สำเร็จ', message: 'กรุณาใส่ลิงก์อั่งเปาก่อนเติมเงิน', type: 'error' });
      input.focus();
      return;
    }

    showAlert({ title: 'ส่งข้อมูลเติมเงินแล้ว', message: 'ระบบกำลังตรวจสอบลิงก์อั่งเปาของคุณ', type: 'success' });
    form.reset();
  });
}

document.addEventListener('DOMContentLoaded', () => {
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
  }
});
