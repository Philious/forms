export function registerCustomServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/custom-sw/custom-sw.js', {
      scope: '/custom-sw/',
    });
  }
}
