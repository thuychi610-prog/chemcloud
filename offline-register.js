(function () {
  function ensureOfflineBadge() {
    let badge = document.getElementById('offlineStatusBadge');
    if (!badge) {
      badge = document.createElement('div');
      badge.id = 'offlineStatusBadge';
      badge.textContent = '🔌 Offline mode';
      badge.style.cssText = [
        'position:fixed',
        'right:16px',
        'bottom:16px',
        'z-index:9999',
        'padding:10px 14px',
        'border-radius:999px',
        'font:600 14px/1.2 Segoe UI,Arial,sans-serif',
        'background:#dc2626',
        'color:#fff',
        'box-shadow:0 10px 22px rgba(0,0,0,.22)',
        'display:none'
      ].join(';');
      document.body.appendChild(badge);
    }
    return badge;
  }

  function refreshBadge() {
    const badge = ensureOfflineBadge();
    const isOnline = navigator.onLine;
    badge.style.display = isOnline ? 'none' : 'block';
  }

  window.addEventListener('online', refreshBadge);
  window.addEventListener('offline', refreshBadge);
  window.addEventListener('load', refreshBadge);

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        await navigator.serviceWorker.register('./sw.js');
        console.log('SW registered');
      } catch (err) {
        console.warn('SW register failed:', err);
      }
    });
  }
})();
