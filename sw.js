const CACHE='lala-dashboard-v2-notifications';
const ASSETS=['./','./index.html','./manifest.json'];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET') return;
  e.respondWith(fetch(e.request).then(r=>{
    const copy=r.clone();
    caches.open(CACHE).then(c=>c.put(e.request,copy));
    return r;
  }).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html'))));
});

self.addEventListener('message',e=>{const d=e.data||{};if(d.type==='LALA_TEST_NOTIFICATION')e.waitUntil(self.registration.showNotification('🔔 LaLa 通知測試',{body:'成功！LaLa 已經可以在這台裝置顯示通知 ✨',tag:'lala-test'}));});
self.addEventListener('push',e=>{let d={};try{d=e.data?e.data.json():{}}catch(_){d={body:e.data?e.data.text():''}};e.waitUntil(self.registration.showNotification(d.title||'🔔 LaLa 行程提醒',{body:d.body||'你有一個行程提醒',tag:d.tag||'lala-reminder',data:{url:d.url||'./'}}));});
self.addEventListener('notificationclick',e=>{e.notification.close();e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(list=>list[0]?.focus()||(clients.openWindow&&clients.openWindow('./'))));});
