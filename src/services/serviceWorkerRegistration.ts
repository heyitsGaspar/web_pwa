// This optional code is used to register a service worker.
// This enables the application to work offline and load faster on subsequent visits.

const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
      // [::1] is the IPv6 localhost symbol
      window.location.hostname === '[::1]' ||
      // 127.0.0.0/8 are considered localhost for IPv4
      window.location.hostname.match(/^127(?:\.\d+){0,3}\.\d+$/)
  );
  
  export function register(config?: any) {
    if ('serviceWorker' in navigator) {
      const publicUrl = new URL(window.location.href).pathname;
      const swUrl = `${publicUrl}service-worker.js`;
  
      // Crea una nueva variable para almacenar el URL modificado
      const swUrlWithParams = swUrl.includes('?') 
        ? `${swUrl}&t=${Date.now()}`
        : `${swUrl}?t=${Date.now()}`;
  
      if (isLocalhost) {
        // This is running on localhost. Let's check if a service worker still exists or not.
        checkValidServiceWorker(swUrlWithParams, config);
  
        // Add some additional logging to localhost.
        navigator.serviceWorker.ready.then(() => {
          console.log(
            'This web app is being served cache-first by a service worker.'
          );
        });
      } else {
        // Is not localhost. Just register the service worker.
        registerValidSW(swUrlWithParams, config);
      }
    }
  }
  
  function registerValidSW(swUrl: string, config?: any) {
    navigator.serviceWorker
      .register(swUrl)
      .then((registration) => {
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (installingWorker) {
            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  // At this point, the updated precached content has been fetched,
                  // but the previous service worker will still serve the older
                  // content until all tabs are closed.
                  console.log('New content is available; please refresh.');
  
                  // Execute the callback if provided.
                  if (config && config.onUpdate) {
                    config.onUpdate(registration);
                  }
                } else {
                  // No previous service worker existed. It could be a fresh install.
                  console.log('Content is cached for offline use.');
  
                  // Execute the callback if provided.
                  if (config && config.onSuccess) {
                    config.onSuccess(registration);
                  }
                }
              }
            };
          }
        };
      })
      .catch((error) => {
        console.error('Error during service worker registration:', error);
      });
  }
  
  function checkValidServiceWorker(swUrl: string, config: any) {
    // Fetch the service worker. If it exists, let it activate.
    fetch(swUrl, {
      headers: { 'Service-Worker': 'script' },
    })
      .then((response) => {
        // Ensure service worker exists.
        const contentType = response.headers.get('content-type');
        if (
          response.status === 404 ||
          (contentType != null && contentType.indexOf('javascript') === -1)
        ) {
          // No service worker found. Probably a different app.
          navigator.serviceWorker.ready.then((registration) => {
            registration.unregister().then(() => {
              window.location.reload();
            });
          });
        } else {
          // Service worker found.
          registerValidSW(swUrl, config);
        }
      })
      .catch(() => {
        console.log('No internet connection found. App is running in offline mode.');
      });
  }
  
  export function unregister() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready
        .then((registration) => {
          registration.unregister();
        })
        .catch((error) => {
          console.error(error.message);
        });
    }
  }
  