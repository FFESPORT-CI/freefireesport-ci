const CACHE_NAME = "ffesci-v1";

// Liste des fichiers à mettre en cache
const FILES_TO_CACHE = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./maintenance.js",
    "./manifest.json"
    // Ne pas mettre les images ici si elles ne sont pas encore uploadées
];

// Installation — on cache les fichiers un par un sans bloquer si l'un échoue
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            const promises = FILES_TO_CACHE.map(url =>
                cache.add(url).catch(err => {
                    console.warn("SW: impossible de cacher", url, err);
                })
            );
            return Promise.all(promises);
        })
    );
    self.skipWaiting();
});

// Activation — supprime les anciens caches
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            )
        )
    );
    self.clients.claim();
});

// Fetch — sert depuis le cache si dispo, sinon réseau
self.addEventListener("fetch", event => {
    // Ignorer les requêtes non-GET et les requêtes Supabase/Google
    if (event.request.method !== "GET") return;
    if (event.request.url.includes("supabase.co")) return;
    if (event.request.url.includes("google")) return;

    event.respondWith(
        caches.match(event.request).then(cached => {
            return cached || fetch(event.request).catch(() => {
                // Si offline et pas en cache, rien à faire
                return new Response("Offline", { status: 503 });
            });
        })
    );
});
