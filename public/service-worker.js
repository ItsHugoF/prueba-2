// Este es un SW muy básico, cachea algunos archivos, etc.

// Instalar y cachear
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Instalando...');
    // Aquí puedes precachear assets si quieres
  });
  
  // Activar
  self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activando...');
    // Podrías limpiar caches antiguos
  });
  
  // Fetch
  self.addEventListener('fetch', (event) => {
    // Ejemplo: log de requests
    // event.respondWith(...) -> para respuesta custom
    console.log('[Service Worker] Fetch -> ', event.request.url);
  });
  