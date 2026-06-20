const AUTH_KEY = 'freal_boxser_user';
const demoUser = { username: 'cvoppy' };

function getUser() {
  try { return JSON.parse(localStorage.getItem(AUTH_KEY)); } catch { return null; }
}

function setUser(user) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
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

  if (getUser()) window.location.href = 'index.html';

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const username = String(formData.get('username') || '').trim();
    const password = String(formData.get('password') || '').trim();

    if (!username || !password) {
      error.textContent = 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน';
      error.hidden = false;
      return;
    }

    setUser({ username });
    window.location.href = 'index.html';
  });
}

function initStore() {
  requireAuth();
  const modal = document.querySelector('[data-product-modal]');
  if (!modal) return;

  const quantity = modal.querySelector('[data-quantity]');
  const remaining = modal.querySelector('[data-remaining]');
  const closeButtons = modal.querySelectorAll('[data-close-modal]');
  const products = document.querySelectorAll('.product-card');

  const openModal = () => {
    modal.classList.add('is-open');
    modal.removeAttribute('aria-hidden');
    document.body.classList.add('modal-open');
    quantity.value = '1';
    remaining.textContent = '4';
  };

  const closeModal = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  };

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

  closeButtons.forEach((button) => button.addEventListener('click', closeModal));
  modal.addEventListener('click', (event) => { if (event.target === modal) closeModal(); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeModal(); });
}

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) window.lucide.createIcons();
  document.querySelectorAll('[data-logout]').forEach((button) => button.addEventListener('click', logout));
  if (document.body.dataset.page === 'login') initLogin();
  if (document.body.dataset.protected === 'true') initStore();
});
