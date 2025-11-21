const CACHE_NAME = 'snorxfit-app-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  console.log('📦 Service Worker: Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('✅ Cache abierto');
        return cache.addAll(urlsToCache).catch(err => {
          console.warn('⚠️ Algunos recursos no se pudieron cachear:', err);
        });
      })
      .then(() => self.skipWaiting()) // Activar inmediatamente
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Don't intercept API calls; let the network handle them so the app can detect online/offline properly
  const url = new URL(request.url);
  if (url.origin === self.location.origin && url.pathname.startsWith('/api')) {
    return; // no respondWith => browser default (network)
  }

  // Don't cache Firebase or external API calls
  if (!url.origin.includes(self.location.origin) || 
      url.hostname.includes('firebaseio.com') ||
      url.hostname.includes('googleapis.com') ||
      url.hostname.includes('generativelanguage.googleapis.com')) {
    return;
  }

  event.respondWith((async () => {
    try {
      // Try cache first
      const cached = await caches.match(request);
      if (cached) return cached;

      // Then try network
      const networkResponse = await fetch(request);
      
      // Cache successful responses
      if (networkResponse && networkResponse.status === 200) {
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, networkResponse.clone());
      }
      
      return networkResponse;
    } catch (err) {
      // Avoid unhandled rejections; optionally serve a fallback page for navigations
      if (request.mode === 'navigate') {
        const fallback = await caches.match('/');
        if (fallback) return fallback;
      }
      // As a last resort, rethrow to signal failure
      return Promise.reject(err);
    }
  })());
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('🔄 Service Worker: Activando...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Eliminando cache antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ Service Worker activado');
      return self.clients.claim(); // Tomar control inmediatamente
    })
  );
});

// Push notification support (para futuras notificaciones)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : '¡Tienes una nueva actualización!',
    icon: '/icon-192.png',
    badge: '/badge-72.png',
    vibrate: [200, 100, 200]
  };
  
  event.waitUntil(
    self.registration.showNotification('SnorxFit 😴', options)
  );
});