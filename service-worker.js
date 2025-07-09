const cacheName = 'epoxy-cache-v1';
const filesToCache = [
  '/epoxy-calculator/',
  '/epoxy-calculator/index.html',
  '/epoxy-calculator/icon-192.png',
  '/epoxy-calculator/icon-512.png',
  '/epoxy-calculator/manifest.json'
];

// Установка — кэшируем необходимые файлы
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      return cache.addAll(filesToCache);
    })
  );
});

// Активация — обновляем кэш
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(
        keyList.map((key) => {
          if (key !== cacheName) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  return self.clients.claim();
});

// Перехват запросов — загружаем из кэша или сети
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
