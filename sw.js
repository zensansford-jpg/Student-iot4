/* Neural Core service worker
 * Safe update strategy: versioned cache for static assets only.
 * Never caches Supabase API responses as authoritative real-time data.
 * No arbitrary remote code execution.
 */
const CACHE_NAME = 'neural-core-v1.0.0';
const STATIC_ASSETS = [
  './',
  './index.html',
  './styles.css',
  './version.json',
  './manifest.webmanifest',
  './js/config.js',
  './js/store.js',
  './js/supabase-client.js',
  './js/analytics.js',
  './js/neural-viz.js',
  './js/software-center.js',
  './js/ui.js',
  './js/main.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('neural-core-') && k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  // Do not cache Supabase/API calls or external dynamic data.
  if (url.origin.includes('supabase.co') || url.origin.includes('api.github.com')) return;
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cached => {
      const fetchPromise = fetch(event.request).then(response => {
        if (response && response.status === 200 && response.type === 'basic') {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy)).catch(() => {});
        }
        return response;
      }).catch(() => cached);
      return cached || fetchPromise;
    })
  );
});
