import { environment } from './environments/environment';

export function registerCustomServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register(environment.serviceWorkerURL);
  }
}
