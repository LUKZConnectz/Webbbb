const TW_CLASS_MAP = {
  'site-header': 'sticky top-0 z-30 min-h-[84px] border-b border-zinc-200/90 bg-white/90 backdrop-blur-lg dark:border-zinc-800 dark:bg-zinc-950/90',
  'admin-header': 'bg-zinc-950 border-b-0',
  'header-inner': 'mx-auto flex min-h-[84px] w-[min(1180px,calc(100%_-_32px))] items-center justify-between gap-4 py-3 max-md:w-[calc(100%_-_24px)] max-md:flex-col max-md:items-stretch',
  'logo': 'relative grid h-16 w-24 rotate-[-10deg] skew-x-[-6deg] place-items-center rounded-2xl border-4 border-zinc-950 bg-gradient-to-br from-red-500 to-red-900 no-underline shadow-[0_5px_0_#17171a] max-md:h-14 max-md:w-20',
  'logo-main': 'text-[27px] font-black leading-none text-red-400 [text-shadow:1px_1px_0_#1a0d12] max-md:text-[23px]',
  'logo-sub': 'text-[13px] font-black leading-none text-white [text-shadow:1px_1px_0_#000] max-md:text-[11px]',
  'toolbar': 'flex flex-wrap items-center justify-end gap-2 max-md:grid max-md:w-full max-md:grid-cols-5 max-sm:grid-cols-4',
  'nav-link': 'inline-flex min-h-10 items-center gap-2 rounded-full border border-zinc-200 bg-zinc-100 px-3 text-sm font-black text-zinc-950 no-underline shadow-sm transition hover:-translate-y-0.5 hover:border-red-500 hover:bg-gradient-to-br hover:from-red-600 hover:to-red-900 hover:text-white max-md:justify-center max-md:px-2 max-md:[&>span]:hidden',
  'is-active': 'border-red-500 bg-gradient-to-br from-red-600 to-red-900 text-white',
  'pill': 'inline-flex h-10 items-center justify-center gap-2 rounded-full border border-zinc-200 bg-zinc-900 px-4 font-bold text-white no-underline shadow-sm cursor-pointer dark:border-zinc-700',
  'icon-btn': 'inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-950 shadow-sm cursor-pointer dark:border-zinc-700 dark:bg-zinc-900 dark:text-white',
  'user-pill': 'bg-zinc-900 text-white max-md:col-span-2',
  'logout-pill': 'bg-zinc-100 text-zinc-950 dark:bg-zinc-900 dark:text-white max-md:text-xs',
  'ghost-pill': 'bg-zinc-100 text-zinc-950 dark:bg-zinc-900 dark:text-white',
  'avatar': 'grid h-5 w-5 place-items-center rounded-full bg-amber-700 text-white',
  'page-shell': 'mx-auto my-6 w-[min(1080px,calc(100%_-_40px))] max-md:w-[calc(100%_-_24px)]',
  'shop-page': 'mt-6', 'orders-page': 'mt-6', 'page-title': 'mb-5 text-3xl font-black',
  'admin-page': 'bg-zinc-100', 'dark-page': 'bg-zinc-950 text-slate-50',
  'stats-grid': 'my-5 grid grid-cols-4 gap-5 max-lg:grid-cols-2 max-sm:grid-cols-1',
  'stat-card': 'relative min-h-[77px] overflow-hidden rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900',
  'stat-label': 'block text-sm text-zinc-800 dark:text-zinc-300', 'stat-icon': 'absolute right-4 top-4 h-6 w-6 text-red-700',
  'product-grid': 'grid grid-cols-5 gap-5 max-lg:grid-cols-2 max-sm:grid-cols-1',
  'product-card': 'relative flex cursor-pointer flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900',
  'product-image': 'm-3 grid min-h-[118px] place-items-center rounded-xl border-2 border-dashed border-zinc-300 bg-gradient-to-br from-zinc-100 to-white bg-cover bg-center dark:from-zinc-800 dark:to-zinc-900',
  'product-body': 'grid min-h-[118px] content-center p-4', 'price': 'text-xl font-black text-red-700',
  'badge': 'absolute left-0 top-0 z-10 rounded-br px-2 py-1 text-xs font-extrabold text-white', 'red': 'bg-red-600', 'dark': 'bg-zinc-700',
  'product-modal': 'fixed inset-0 z-50 hidden place-items-center bg-black/50 p-6 [&.is-open]:grid', 'modal-card': 'relative w-[min(514px,100%)] rounded-lg bg-white p-6 shadow-2xl dark:bg-zinc-900',
  'modal-close': 'absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-transparent text-2xl hover:bg-zinc-100 dark:hover:bg-zinc-800',
  'modal-image': 'relative h-64 overflow-hidden rounded-lg bg-gradient-to-br from-slate-900 via-slate-700 to-red-950', 'camera-tag': 'absolute left-2 top-2 inline-flex items-center gap-1 rounded bg-black px-2 py-1 text-[10px] font-extrabold text-lime-400',
  'modal-content': 'grid gap-2 pt-4', 'modal-meta': 'mt-2 flex items-end justify-between gap-4', 'modal-price': 'text-xl font-black text-red-700', 'modal-actions': 'mt-4 grid grid-cols-[1fr_auto_auto] gap-3 max-sm:grid-cols-1',
  'login-shell': 'grid min-h-screen place-items-center bg-gradient-to-b from-white to-zinc-100 p-8 font-sans', 'login-card': 'grid w-[min(430px,100%)] justify-items-center gap-5 rounded-2xl border border-zinc-200 bg-white p-8 shadow-2xl',
  'login-logo': 'h-20 w-28', 'login-heading': 'text-center', 'login-kicker': 'text-sm font-black text-red-700', 'login-form': 'grid w-full gap-3', 'form-field': 'grid gap-2', 'input-wrap': 'flex h-10 min-w-0 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 focus-within:ring-4 focus-within:ring-red-700/10', 'login-submit': 'h-11 w-full', 'login-error': 'rounded-lg bg-red-50 p-3 text-sm font-extrabold text-red-700',
  'admin-shell': 'mx-auto my-7 grid w-[min(1120px,calc(100%_-_40px))] gap-5 max-md:w-[calc(100%_-_24px)]', 'admin-hero': 'rounded-2xl border border-zinc-200 bg-gradient-to-br from-white to-red-50 p-7 shadow-sm', 'admin-metrics': 'grid grid-cols-5 gap-4 max-md:grid-cols-1', 'admin-grid': 'grid grid-cols-[1.4fr_.9fr] items-start gap-5 max-md:grid-cols-1', 'admin-panel': 'rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900', 'panel-head': 'mb-4 flex items-center justify-between gap-3', 'admin-form': 'grid gap-3', 'admin-orders': 'grid gap-3', 'admin-products-list': 'mt-4 grid gap-3', 'admin-topups': 'grid gap-3', 'admin-user-card': 'flex items-center gap-3 rounded-xl bg-zinc-100 p-4 dark:bg-zinc-800',
  'cart-list': 'grid gap-4', 'orders-list': 'grid gap-4', 'cart-item': 'grid grid-cols-[1fr_auto] items-center gap-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 max-md:grid-cols-1', 'cart-total': 'my-5 font-black', 'cart-actions': 'grid grid-cols-[auto_1fr_auto_auto] items-center gap-3 max-md:grid-cols-1',
  'order-card': 'rounded-lg border border-zinc-800 bg-zinc-900 p-4 text-white', 'order-head': 'mb-4 grid grid-cols-[1fr_auto] gap-4 max-md:grid-cols-1', 'order-lines': 'grid gap-3', 'order-line': 'grid grid-cols-[1fr_auto] items-center gap-4 rounded-lg bg-zinc-800 p-3 max-md:grid-cols-1', 'order-actions': 'mt-4 flex justify-end gap-3', 'order-detail': 'mt-4 rounded-lg bg-zinc-950 p-3 text-sm text-zinc-300',
  'profile-page': 'grid gap-5', 'profile-card': 'flex items-center gap-5 rounded-3xl border border-zinc-200 bg-gradient-to-br from-white to-red-50 p-6 shadow-sm max-md:flex-col max-md:items-stretch', 'profile-avatar': 'grid h-20 w-20 place-items-center rounded-3xl bg-zinc-900 text-white', 'profile-grid': 'grid grid-cols-3 gap-4 max-md:grid-cols-1',
  'donate-page': 'grid grid-cols-[1.1fr_.9fr] items-start gap-5 max-md:grid-cols-1', 'donate-hero': 'col-span-full grid gap-3 rounded-3xl border border-zinc-200 bg-gradient-to-br from-white to-red-50 p-6 shadow-sm', 'donate-meter': 'h-5 overflow-hidden rounded-full bg-zinc-200', 'donate-form': 'grid gap-3',
  'topup-page-shell': 'mx-auto my-8 w-[min(920px,calc(100%_-_32px))]', 'topup-heading': 'mb-6 flex items-center justify-between gap-4 max-md:grid', 'topup-layout': 'grid grid-cols-[minmax(0,1.45fr)_minmax(260px,.9fr)] items-start gap-5 max-md:grid-cols-1', 'topup-main-card': 'grid gap-5 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm', 'topup-voucher-card': 'grid gap-3 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm', 'topup-guide-card': 'rounded-2xl border border-zinc-200 bg-amber-50 p-5', 'topup-side-card': 'grid gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm', 'topup-card-title': 'flex items-start gap-3', 'topup-input-wrap': 'h-11', 'topup-help': 'text-xs text-zinc-500', 'topup-wide': 'w-full bg-gradient-to-br from-amber-200 to-amber-400 text-amber-900', 'balance-box': 'relative min-h-24 rounded-xl border border-zinc-200 bg-amber-50 p-5', 'warning-box': 'text-sm text-zinc-600',
  'announcement-bar': 'mb-6 grid min-h-20 grid-cols-[auto_minmax(0,1fr)] items-center gap-4 overflow-hidden rounded-2xl border border-zinc-200 bg-white/90 p-3 shadow max-md:grid-cols-1', 'announcement-title': 'inline-flex min-h-14 items-center gap-2 rounded-xl bg-black px-7 text-xl font-black text-white max-md:justify-center', 'announcement-viewport': 'min-w-0 overflow-hidden', 'announcement-track': 'flex w-max items-center gap-6 text-3xl font-black text-zinc-500',
  'review-scroll': 'flex snap-x gap-5 overflow-x-auto pb-4 scroll-smooth', 'tw-home-scroll': 'my-3 mb-14',
  'sr-only': 'sr-only', 'register-open': 'font-black text-red-700 underline', 'auth-modal': 'fixed inset-0 z-[60] hidden place-items-center bg-black/50 p-6 [&.is-open]:grid', 'auth-modal-card': 'relative grid w-[min(430px,100%)] gap-3 rounded-2xl border border-zinc-200 bg-white p-7 shadow-2xl',
  'alert-region': 'fixed bottom-5 right-5 z-[100] grid w-[min(380px,calc(100vw_-_36px))] gap-3 pointer-events-none', 'app-alert': 'pointer-events-auto grid grid-cols-[auto_1fr_auto] items-start gap-3 rounded-xl border border-zinc-200 bg-white p-4 text-zinc-900 shadow-2xl', 'alert-icon': 'grid h-6 w-6 place-items-center rounded-full', 'alert-copy': 'grid gap-1', 'alert-close': 'grid h-6 w-6 place-items-center rounded-full text-zinc-500 hover:bg-zinc-100',
  'app-alert-success': 'border-green-200 bg-green-50', 'app-alert-error': 'border-red-200 bg-red-50', 'app-alert-info': 'border-blue-200 bg-blue-50', 'app-alert-warning': 'border-amber-200 bg-amber-50',
  'empty-state': 'rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-6 text-center text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900', 'admin-order': 'grid grid-cols-[1fr_auto] gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-800 max-md:grid-cols-1',
  'item-price': 'whitespace-nowrap text-xl font-black text-red-700', 'order-price': 'whitespace-nowrap text-xl font-black text-red-500', 'order-meta': 'text-sm text-zinc-400', 'order-code': 'text-right text-sm text-zinc-400 max-md:text-left',
  'status': 'font-black', 'pending': 'text-blue-500', 'paid': 'text-green-500', 'cancelled': 'text-red-500', 'pay-btn': 'bg-zinc-200 text-zinc-950',
  'donate-row': 'flex justify-between gap-3 border-b border-zinc-200 py-3', 'topup-review-actions': 'flex flex-wrap items-start gap-2', 'slip-preview': 'rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-3'
};
function applyTailwindBridge(root=document){
  Object.entries(TW_CLASS_MAP).forEach(([legacy, classes]) => {
    if (root.classList?.contains(legacy)) root.classList.add(...classes.split(/\s+/));
    root.querySelectorAll ? root.querySelectorAll(`.${CSS.escape(legacy)}`).forEach(el => el.classList.add(...classes.split(/\s+/))) : null;
  });
  if(root.querySelectorAll){
    root.querySelectorAll('[data-lucide]').forEach(i=>i.classList.add('h-[18px]','w-[18px]','shrink-0','stroke-[2.6]'));
    root.querySelectorAll('input').forEach(i=>i.classList.add('min-w-0','bg-transparent','font-inherit','outline-none'));
    root.querySelectorAll('.product-image:not(.has-image)').forEach(el=>{ if(!el.textContent.trim()) el.textContent='ใส่รูปเอง'; el.classList.add('text-sm','font-black','text-zinc-400'); });
  }
}
document.addEventListener('DOMContentLoaded',()=>{
  document.documentElement.classList.add('font-sans');
  document.body.classList.add('font-sans','text-zinc-950','bg-white','dark:bg-zinc-950','dark:text-slate-50');
  if (document.body.dataset.page === 'home') document.body.classList.add('bg-[linear-gradient(rgba(255,255,255,.94),rgba(255,255,255,.94)),radial-gradient(circle_at_18%_12%,rgba(223,6,23,.16),transparent_28%)]');
  applyTailwindBridge();
  new MutationObserver(ms=>ms.forEach(m=>m.addedNodes.forEach(n=>{ if(n.nodeType===1) applyTailwindBridge(n); }))).observe(document.body,{childList:true,subtree:true});
});
