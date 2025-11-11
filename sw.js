// Service Worker - McMaster-Carr inspired caching strategy
const CACHE_VERSION = 'v6.0.1';
const CACHE_NAME = `portfolio-${CACHE_VERSION}`;

// Assets to cache immediately on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/css/theme.css',
  '/js/main.js',
  '/js/componentLoader.js',
  '/components/hero.html',
  '/components/hero-cards.html',
  '/components/work.html',
  '/components/experience.html',
  '/components/posts.html',
  '/components/volunteering.html',
  '/components/artworks.html',
  '/components/bootstrapping.html'
];

// Install event - cache core assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Precaching assets');
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => {
      return self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch event - Cache-first strategy for static assets, network-first for HTML
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // Cache-first for assets (CSS, JS, images)
  if (request.url.match(/\.(css|js|webp|png|jpg|jpeg|svg|woff2|woff)$/)) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          console.log('[SW] Serving from cache:', request.url);
          return cachedResponse;
        }

        return fetch(request).then((networkResponse) => {
          // Cache the new asset
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        });
      })
    );
  }
  // Network-first for HTML (always fresh, fallback to cache)
  else if (request.url.match(/\.html$/) || request.url === url.origin + '/') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          // Update cache with fresh HTML
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Fallback to cache if offline
          return caches.match(request);
        })
    );
  }
});

// Performance measurement
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
