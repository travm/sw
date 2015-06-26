importScripts('/lib/serviceworker-cache-polyfill.js');

// Files
var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
    '/',
    '/css/site.css',
    '/js/site.js'
];

// On Install...
self.addEventListener('install', function (event) {
    // Perform Installation Steps
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                console.log("Cache Opened!");
                return cache.addAll(urlsToCache);
            })
        );
});

// On Fetch...
self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request)
            .then(function (response) {
                // Cache Hit - Return Response
                if (response) {
                    console.log("Response: ", response);
                    return response;
                }
                
                // Clone Request (Stream, Only Consumed Once)
                var fetchRequest = event.request.clone();
                
                return fetch(fetchRequest)
                    .then(function () {
                        // Check If Response Is Valid & From Same Origin
                        if(!reponse || response.status !== '200' || response.type !== 'basic') {
                            return response;
                        }
                        
                        // Clone Response (Stream, Only Consumed Once)
                        var resonseToCache = response.clone();
                        
                        caches.open(CACHE_NAME)
                            .then(function (cache) {
                                cache.put(event.request, responseToCache);
                            });
                    });
                return response;
            }
        )
    );
});