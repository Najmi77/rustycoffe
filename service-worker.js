const CACHE_NAME = "coffee-rustic-v3";
const ASSETS = [
  "/",
  "/index.html",
  "/style.css",
  "/script.js",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    )
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((res) => res || fetch(event.request))
  );
});
