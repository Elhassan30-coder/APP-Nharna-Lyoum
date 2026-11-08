var V = 'nharna-v1';
var CORE = ['./', 'index.html', 'mobile.js', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png'];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(V).then(function (c) {
    return Promise.all(CORE.map(function (u) { return c.add(u).catch(function () {}); }));
  }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== V; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || !/^https?:$/.test(url.protocol)) return;
  function store(res) {
    if (res && (res.ok || res.type === 'opaque')) { var copy = res.clone(); caches.open(V).then(function (c) { c.put(req, copy); }); }
    return res;
  }
  if (url.origin === location.origin) {
    // Toujours la version en ligne si possible, sinon la copie enregistrée (mode hors connexion)
    e.respondWith(fetch(req).then(store).catch(function () {
      return caches.match(req).then(function (r) { return r || caches.match('index.html') || caches.match('./'); });
    }));
  } else {
    // Polices et ressources externes : copie enregistrée d'abord, mise à jour en arrière-plan
    e.respondWith(caches.match(req).then(function (r) {
      var net = fetch(req).then(store).catch(function () { return r; });
      return r || net;
    }));
  }
});
