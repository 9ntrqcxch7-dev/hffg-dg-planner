// HFFG DG Planner — service worker
// Cache-first, fully offline. The app is a single self-contained HTML document
// (all data/CSS/JS inline) so the precache list is deliberately short.
// Bump CACHE_VERSION on every deploy to roll caches over cleanly.
const CACHE_VERSION = 'hffg-dgp-v12';
const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-48.png',
  './icons/icon-72.png',
  './icons/icon-96.png',
  './icons/icon-128.png',
  './icons/icon-144.png',
  './icons/icon-152.png',
  './icons/icon-192.png',
  './icons/icon-384.png',
  './icons/icon-512.png',
  './icons/icon-maskable-192.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon.ico',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if(req.method !== 'GET') return;

  // Navigations (e.g. opening the installed app) always resolve to the cached app shell.
  if(req.mode === 'navigate'){
    event.respondWith(
      caches.match('./index.html').then((cached) => cached || fetch(req).catch(() => caches.match('./index.html')))
    );
    return;
  }

  // Cache-first for same-origin assets; fall back to network, then update the cache.
  event.respondWith(
    caches.match(req).then((cached) => {
      if(cached) return cached;
      return fetch(req).then((res) => {
        if(res && res.status === 200 && res.type === 'basic'){
          const copy = res.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(req, copy));
        }
        return res;
      }).catch(() => cached);
    })
  );
});
