// This service worker handles caching for offline support and notification clicks.

const CACHE_NAME = 'ajr-app-cache-v2';
const API_HOSTS = ['api.aladhan.com', 'api.alquran.cloud', 'api.quran.com', 'www.mp3quran.net'];

const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
];

// Install: Caches the app shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(URLS_TO_CACHE);
      })
      .then(() => self.skipWaiting()) // Activate new SW immediately
  );
});

// Activate: Cleans up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // Take control of open clients
  );
});

// Fetch: Implements network-first for APIs, cache-first for app shell
self.addEventListener('fetch', event => {
    // Ignore non-GET requests
    if (event.request.method !== 'GET') {
        return;
    }

    const requestUrl = new URL(event.request.url);

    // Network-first strategy for APIs
    if (API_HOSTS.some(host => requestUrl.hostname.includes(host))) {
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    // If the fetch is successful, cache the response and return it
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseToCache);
                        });
                    return response;
                })
                .catch(() => {
                    // If the fetch fails (offline), try to get the response from the cache
                    return caches.match(event.request);
                })
        );
    } else {
        // Cache-first strategy for local assets (app shell)
        event.respondWith(
            caches.match(event.request)
                .then(response => {
                    // Cache hit - return response. Otherwise, fetch from network.
                    return response || fetch(event.request);
                })
        );
    }
});


// Notification Click: Focuses or opens the app
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      if (clientList.length > 0) {
        let client = clientList[0];
        for (let i = 0; i < clientList.length; i++) {
          if (clientList[i].focused) {
            client = clientList[i];
          }
        }
        return client.focus();
      }
      return clients.openWindow('/');
    })
  );
});