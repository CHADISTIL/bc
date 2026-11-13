importScripts('config.js');
const CACHE='sp-v20';
const SHELL=['./','index.html','player.js','config.js','manifest.webmanifest','icons/icon-192.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL).catch(()=>{})).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;
  if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
  e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(CACHE).then(c=>c.put(r,cp)).catch(()=>{});return res}).catch(()=>caches.match(r).then(m=>m||caches.match('index.html'))));
});

async function hashOf(s){
  const d=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s));
  return [...new Uint8Array(d)].map(b=>b.toString(16).padStart(2,'0')).join('').slice(0,32);
}
self.addEventListener('push',e=>{
  e.waitUntil((async()=>{
    let items=[];
    try{
      const sub=await self.registration.pushManager.getSubscription();
      if(sub&&self.SP_CONFIG.push){
        const r=await fetch(self.SP_CONFIG.push+'/inbox?e='+await hashOf(sub.endpoint),{cache:'no-store'});
        items=await r.json();
      }
    }catch(_){}
    if(!items.length)items=[{title:'SP',body:'لديك تحديث جديد',url:'',tag:'sp-generic'}];
    /* التطبيق مفتوح وظاهر: صوت التطبيق فقط (الإشعار صامت). مغلق أو في الخلفية: صوت النظام فقط */
    let appOn=false;
    try{const cl=await self.clients.matchAll({type:'window',includeUncontrolled:true});const vis=cl.filter(c=>c.visibilityState==='visible');appOn=vis.length>0;vis.forEach(c=>c.postMessage({sound:1}))}catch(_){}
    for(const n of items.slice(0,6)){
      const base=self.registration.scope;
      await self.registration.showNotification(n.title||'SP',{
        body:n.body||'',icon:base+'icons/icon-192.png',badge:base+'icons/badge-96.png',image:n.img||undefined,
        tag:n.tag||undefined,actions:/#\/(movie|tv)\/\d+/.test(n.url||'')?[{action:'later',title:'مشاهدة لاحقاً'},{action:'fav',title:'للمفضلة'}]:undefined,renotify:!!n.tag,silent:appOn,vibrate:appOn?undefined:[120,60,120],lang:'ar',dir:'rtl',data:{url:n.url||''}
      });
    }
  })());
});
self.addEventListener('notificationclick',e=>{
  e.notification.close();
  const hash=(e.notification.data&&e.notification.data.url)||'';
  e.waitUntil((async()=>{
    const act=e.action||'';
    if(act==='later'||act==='fav'){
      const all=await self.clients.matchAll({type:'window',includeUncontrolled:true});
      for(const c of all){if(c.url.startsWith(self.registration.scope)){await c.focus();c.postMessage({act,url:hash});return}}
      await self.clients.openWindow(self.registration.scope+'index.html?act='+act+((hash.match(/#.*$/)||[''])[0]));return;
    }
    if(/^https?:/i.test(hash)){await self.clients.openWindow(hash);return}
    const all=await self.clients.matchAll({type:'window',includeUncontrolled:true});
    for(const c of all){
      if(c.url.startsWith(self.registration.scope)){
        await c.focus();
        if(hash)c.postMessage({go:hash});
        return;
      }
    }
    await self.clients.openWindow(self.registration.scope+'index.html'+hash);
  })());
});
