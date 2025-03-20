// src/serviceWorkerRegistration.js

// Basado en el ejemplo oficial de Create React App, adaptado para un SW en /public

// Este archivo expone dos funciones: register() y unregister().

const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
    // [::1] es localhost para IPv6
    window.location.hostname === '[::1]' ||
    // 127.0.0.0/8 es localhost IPv4
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4]\d|[01]?\d?\d)){3}$/
    )
  );
  
  export function register(config) {
    if ('serviceWorker' in navigator) {
      // SW solo se usa en HTTPS o localhost
      window.addEventListener('load', () => {
        const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
        // process.env.PUBLIC_URL -> path base de CRA
  
        if (isLocalhost) {
          // En localhost, ver si existe SW
          checkValidServiceWorker(swUrl, config);
  
          navigator.serviceWorker.ready.then(() => {
            console.log('SW en localhost listo');
          });
        } else {
          // Registrar SW en producción
          registerValidSW(swUrl, config);
        }
      });
    }
  }
  
  function registerValidSW(swUrl, config) {
    navigator.serviceWorker
      .register(swUrl)
      .then((registration) => {
        console.log('SW registrado con scope:', registration.scope);
  
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (installingWorker == null) {
            return;
          }
          installingWorker.onstatechange = () => {
            if (
              installingWorker.state === 'installed' &&
              navigator.serviceWorker.controller
            ) {
              // Nuevo contenido disponible
              if (config && config.onUpdate) {
                config.onUpdate(registration);
              }
            } else if (installingWorker.state === 'installed') {
              // Contenido cacheado
              if (config && config.onSuccess) {
                config.onSuccess(registration);
              }
            }
          };
        };
      })
      .catch((error) => {
        console.error('Error registrando SW:', error);
      });
  }
  
  function checkValidServiceWorker(swUrl, config) {
    // Checkear si SW existe
    fetch(swUrl, {
      headers: { 'Service-Worker': 'script' },
    })
      .then((response) => {
        // No existe => 404 => desregistra SW
        const contentType = response.headers.get('content-type');
        if (
          response.status === 404 ||
          (contentType != null && !contentType.includes('javascript'))
        ) {
          navigator.serviceWorker.ready.then((registration) => {
            registration.unregister().then(() => {
              window.location.reload();
            });
          });
        } else {
          registerValidSW(swUrl, config);
        }
      })
      .catch(() => {
        console.log('App sin conexión, SW offline?');
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
  