const CACHE = 'pibes-clarita-v10';
const FILES = ['./', './index.html', './manifest.webmanifest', './icons/club.svg', './icons/ios-icon.png', './icons/icon-192.png', './icons/icon-512.png', ...[1,2,3,4,5,6,7,8,11,12,13,14].map(n => './images/' + n + '.jpeg'), ...['a','b','c','d'].map(n => './images/' + n + '.jpeg'), './images/escudo-oficial.png', './images/fixture-primera-etapa.jpeg', './videos/futsal.mp4'];
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES))));
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))));
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    const copy = response.clone();
    if (response.ok) caches.open(CACHE).then(cache => cache.put(event.request, copy));
    return response;
  }).catch(() => caches.match('./index.html'))));
});