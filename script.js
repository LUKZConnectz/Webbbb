const AUTH_KEY = 'freal_boxser_user';
const ALERT_TIMEOUT = 4200;

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
  cartButton?.addEventListener('click', () => showAlert({ title: 'เพิ่มลงตะกร้าแล้ว', message: `Night Vision Goggles จำนวน ${getQuantity()} ชิ้น`, type: 'success' }));
  orderButton?.addEventListener('click', () => {
    showAlert({ title: 'สั่งซื้อสำเร็จ', message: 'ระบบได้รับคำสั่งซื้อของคุณแล้ว', type: 'success' });
    closeModal();
  });

  closeButtons.forEach((button) => button.addEventListener('click', closeModal));
  modal.addEventListener('click', (event) => { if (event.target === modal) closeModal(); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && modal.classList.contains('is-open')) closeModal(); });
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
  if (document.body.dataset.protected === 'true') {
    initStore();
    initTopup();
  }
});
