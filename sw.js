const CACHE_NAME = 'chemcloud-v2';
const STATIC_ASSETS = [
  './',
  './index.html',
  './login.html',
  './module1.html',
  './module2.html',
  './module3.html',
  './module4.html',
  './module5.html',
  './module6.html',
  './module7.html',
  './module8.html',
  './offline.html',
  './manifest.webmanifest',
  './offline-register.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await Promise.allSettled(
        STATIC_ASSETS.map(async (asset) => {
          try {
            await cache.add(asset);
          } catch (e) {
            // Ignore cache misses to keep SW install successful.
          }
        })
      );
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;

      return fetch(req)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          return response;
        })
        .catch(async () => {
          const accept = req.headers.get('accept') || '';
          if (accept.includes('text/html')) {
            return caches.match('./offline.html');
          }
          return new Response('', { status: 503, statusText: 'Offline' });
        });
    })
  );
});
