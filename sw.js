const CACHE = 'pibes-clarita-v13';
const FILES = ['./', './index.html', './manifest.webmanifest', './icons/club.svg', './icons/ios-icon.png', './icons/icon-192.png', './icons/icon-512.png', ...[1,2,3,4,5,6,7,8,11,12,13,14].map(n => './images/' + n + '.jpeg'), ...['a','b','c','d'].map(n => './images/' + n + '.jpeg'), './images/escudo-oficial.png', './images/fixture-primera-etapa.jpeg', './videos/futsal.mp4'];
self.addEventListener('install', event => event.waitUntil((async()=>{const cache=await caches.open(CACHE);await Promise.all(FILES.map(async file=>{const response=await fetch(file,{cache:'reload'});if(response.ok)await cache.put(file,response)}));await self.skipWaiting()})()));
self.addEventListener('activate', event => event.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)));await self.clients.claim()})()));
self.addEventListener('fetch', event => {
  if(event.request.method!=='GET'||new URL(event.request.url).origin!==self.location.origin)return;
  const url=new URL(event.request.url);
  if(url.searchParams.has('check')){event.respondWith(fetch(event.request,{cache:'no-store'}).catch(()=>caches.match('./index.html')));return}
  if(event.request.mode==='navigate'||url.pathname.endsWith('/index.html')){event.respondWith(fetch(event.request).then(response=>{if(response.ok)caches.open(CACHE).then(cache=>cache.put('./index.html',response.clone()));return response}).catch(()=>caches.match(event.request).then(cached=>cached||caches.match('./index.html'))));return}
  event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(response=>{if(response.ok)caches.open(CACHE).then(cache=>cache.put(event.request,response.clone()));return response}).catch(()=>caches.match('./index.html'))));
});