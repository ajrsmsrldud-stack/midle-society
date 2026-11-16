// GitHub Pages release 1: repository-scoped offline cache.
importScripts('./data.js');
const CACHE=CourtData.art.cache,FILES=['./','./index.html','./style.css','./data.js','./app.js','./scenario.js',...CourtData.art.files.map(file=>'./'+file)];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('court-shell-github-')&&k.endsWith('-'+encodeURIComponent(new URL('./',self.location.href).pathname))&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==self.location.origin||u.pathname.includes('/api/'))return;const known=FILES.map(p=>new URL(p,self.location).pathname);if(!known.includes(u.pathname))return;e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(cached=>cached||fetch(e.request)));});
