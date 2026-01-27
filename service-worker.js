// service-worker.js - Fixed version (only caches existing files)
const CACHE_VERSION = 'v1.2';
const CACHE_NAME = 'dental-studios-' + CACHE_VERSION;

// Files to cache - ONLY include files that actually exist
const CRITICAL_ASSETS = [
    './index.html',
    './Header/header.html',
    './Footer/footer.html',
    './styles/header-navigation-complete.css',
    './scripts/mobile-menu.js',
    './scripts/components.js'
];

// Install event - cache critical assets immediately
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return Promise.all(
                CRITICAL_ASSETS.map(url => {
                    return cache.add(url).catch(err => {
                        return Promise.resolve();
                    });
                })
            );
        }).then(() => {
            return self.skipWaiting();
        })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            return self.clients.claim();
        })
    );
});

// Fetch event - serve from cache first, then network
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    
    if (url.origin !== location.origin) {
        return;
    }
    
    const isComponent = url.pathname.includes('header.html') || 
                        url.pathname.includes('footer.html');
    const isCriticalAsset = url.pathname.includes('header-navigation') || 
                           url.pathname.includes('mobile-menu.js');
    
    if (isComponent || isCriticalAsset) {
        event.respondWith(
            caches.match(event.request).then((cachedResponse) => {
                if (cachedResponse) {
                    event.waitUntil(
                        fetch(event.request).then((networkResponse) => {
                            if (networkResponse && networkResponse.status === 200) {
                                caches.open(CACHE_NAME).then((cache) => {
                                    cache.put(event.request, networkResponse);
                                });
                            }
                        }).catch(() => {})
                    );
                    return cachedResponse;
                }
                
                return fetch(event.request).then((networkResponse) => {
                    if (networkResponse && networkResponse.status === 200) {
                        const responseToCache = networkResponse.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, responseToCache);
                        });
                    }
                    return networkResponse;
                }).catch((error) => {
                    throw error;
                });
            })
        );
    }
});