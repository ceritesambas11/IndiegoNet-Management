const CACHE_NAME = 'indiego-cache-v1';
const urlsToCache = [
    '/',
    '/indiego.html',
    '/favicon.png',
    '/manifest.json'
];

// Event "install" untuk menginstal service worker
// dan menyimpan aset-aset penting ke dalam cache
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache berhasil dibuka');
                return cache.addAll(urlsToCache);
            })
    );
});

// Event "fetch" untuk mencegat permintaan jaringan
// dan melayani konten dari cache jika tersedia
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Jika aset ditemukan di cache, kembalikan respons dari cache
                if (response) {
                    return response;
                }
                // Jika tidak, lanjutkan dengan permintaan jaringan normal
                return fetch(event.request);
            })
    );
});
