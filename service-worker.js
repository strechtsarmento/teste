const CACHE_NAME = "master-dashboard-bb-shell-v2";
const SHELL_FILES = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./assets/icon.svg",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
  "./css/base.css",
  "./css/navigation.css",
  "./css/layout.css",
  "./css/components.css",
  "./css/exercises.css",
  "./css/help.css",
  "./css/responsive.css",
  "./css/web.css",
  "./js/app.js",
  "./js/auth.js",
  "./js/config.js",
  "./js/exercicios.js",
  "./js/progresso.js",
  "./js/revisoes.js",
  "./js/state.js",
  "./js/storage.js",
  "./js/ui.js",
  "./js/utils.js",
  "./firebase/firebase-config.js"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) =>
    cache.addAll(SHELL_FILES.map((file) => new URL(file, self.registration.scope)))
  ).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(
    keys.filter((key) => key.startsWith("master-dashboard-bb-shell-") && key !== CACHE_NAME)
      .map((key) => caches.delete(key))
  )).then(() => self.clients.claim()));
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET") return;

  // Firebase's versioned browser SDK is needed to start the cached app shell.
  if (url.origin === "https://www.gstatic.com" && url.pathname.startsWith("/firebasejs/10.12.2/")) {
    event.respondWith(caches.match(request).then((cached) => cached || fetch(request).then((response) => {
      if (response.ok) {
        const copy = response.clone();
        return caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)).catch(() => {}).then(() => response);
      }
      return response;
    })));
    return;
  }

  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(fetch(request).then((response) => {
      const copy = response.clone();
      return caches.open(CACHE_NAME).then((cache) => cache.put(new URL("./index.html", self.registration.scope), copy))
        .catch(() => {}).then(() => response);
    }).catch(async () => (await caches.match(new URL("./index.html", self.registration.scope))) || Response.error()));
    return;
  }

  event.respondWith(caches.match(request).then((cached) => cached || fetch(request).then((response) => {
    if (response.ok) {
      const copy = response.clone();
      return caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)).catch(() => {}).then(() => response);
    }
    return response;
  })));
});
