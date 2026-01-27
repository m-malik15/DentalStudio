// register-sw.js - Register service worker for instant page loads
// Place this file in your scripts folder and load it on every page

(function() {
    'use strict';
    
    // Check if service workers are supported
    if ('serviceWorker' in navigator) {
        // Register service worker when page loads
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./service-worker.js')
                .then((registration) => {
                    // Check for updates periodically
                    setInterval(() => {
                        registration.update();
                    }, 60000); // Check every minute
                })
                .catch((error) => {
                    // Fail silently
                });
            
            // Listen for service worker updates
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                window.location.reload();
            });
        });
        
        // Listen for messages from service worker
        navigator.serviceWorker.addEventListener('message', (event) => {
            // Handle messages silently
        });
    }
})();