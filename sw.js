const CACHE = 'soccer101-v1';
const ASSETS = [
  '/soccer101-app/',
  '/soccer101-app/index.html',
  '/soccer101-app/manifest.json',
  '/soccer101-app/icon-192.png',
  '/soccer101-app/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = e.request.url;
  // API çağrılarını cache'leme — her zaman Railway'e git
  if (url.includes('railway.app') || url.includes('/api/')) {
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
    return;
  }
  // Statik dosyalar için cache-first
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
