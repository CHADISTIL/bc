/* Service Worker خاص بلوحة الإدارة (نطاق admin.html فقط) */
const CACHE='sp-admin-v3';
const SHELL=['./admin.html','admin.webmanifest','config.js','icons/admin-192.png','icons/admin-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL).catch(()=>{})))});
self.addEventListener('message',e=>{if(e.data&&e.data.skip)self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x.startsWith('sp-admin-')&&x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;
  if(r.method!=='GET')return;
  const u=new URL(r.url);
  if(u.origin!==location.origin)return;               // Firebase / TMDB / Worker تمر مباشرة
  e.respondWith(fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(CACHE).then(c=>c.put(r,cp))}return res}).catch(()=>caches.match(r).then(m=>m||caches.match('./admin.html'))));
});
