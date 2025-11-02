const CACHE_NAME = 'carebridge-v7';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/bootstrap.min.css',
  '/css/style.css',
  'https://code.jquery.com/jquery-3.4.1.min.js',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/js/bootstrap.bundle.min.js',
  '/js/main.js',
  '/images/icons/icon-192x192.png',
  '/images/icons/icon-512x512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = ['carebridge-v7'];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

self.addEventListener('push', event => {
  const data = event.data.json();
  const title = data.title || 'CareBridge 알림';
  const options = {
    body: data.body || '새로운 메시지가 도착했습니다.',
    icon: '/images/icons/icon-192x192.png',
    data: data.link // 클릭 시 이동할 URL
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  // 알림 클릭 시 특정 페이지로 이동
  event.waitUntil(clients.openWindow(event.notification.data || '/'));
});
