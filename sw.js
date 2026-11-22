// Keeps the whole app on the device so it opens with no internet.
const CACHE = "book-reader-147fbb63d0";
const FILES = ["./", "index.html", "lib/pdf.min.js", "lib/pdf.worker.min.js", "manifest.webmanifest", "icon-180.png", "icon-512.png"];
self.addEventListener("install", (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then((hit) =>
    hit || fetch(e.request).catch(() => e.request.mode === "navigate" ? caches.match("index.html") : Response.error())));
});
