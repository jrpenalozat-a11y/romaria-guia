/* La página se pide primero a la red para que los cambios lleguen al tiro; sin señal se usa la copia guardada.
   Lo demás (íconos, letras, fotos) sale de la copia guardada. */
const C='romaria-v6';const F=['./','index.html','manifest.json','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))));self.clients.claim()});
const guardar=(req,res)=>{const cp=res.clone();caches.open(C).then(c=>c.put(req,cp));return res};
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  if(r.mode==='navigate'){e.respondWith(fetch(r).then(res=>res.ok?guardar(r,res):res).catch(()=>caches.match(r).then(x=>x||caches.match('index.html'))));return}
  e.respondWith(caches.match(r).then(x=>x||fetch(r).then(res=>guardar(r,res)).catch(()=>caches.match('index.html'))));
});
