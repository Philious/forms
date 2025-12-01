'use strict';
/// <reference lib="webworker" />
const CACHE_NAME = 'data-cache-v1';
const STATIC_ASSETS = ['/index.html', '/main.js'];
const API_URL = 'http://localhost:3000';
const sw = self;

sw.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      try {
        await cache.addAll(STATIC_ASSETS);
      } catch (err) {
        console.warn('[SW] Failed to cache some static assets', err);
      }
    })
  );
  sw.skipWaiting();
});
sw.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  sw.clients.claim();
});
sw.addEventListener('fetch', event => {
  const req = event.request;
  if (req.url.startsWith(API_URL)) {
    event.respondWith(
      (async function () {
        const { request } = event;
        // Return from cache if possible.
        const cachedResponse = await caches.match(request);
        if (cachedResponse) return cachedResponse;
        // Else go to the network.
        const response = await fetch(request);
        const responseToCache = response.clone();
        event.waitUntil(
          (async function () {
            // Cache what we fetched.
            const cache = await caches.open(CACHE_NAME);
            await cache.put(request, responseToCache);
          })()
        );
        // Return the network response.
        return response;
      })()
    );
  }
});
/*

interface SyncManager {
  getTags(): Promise<string[]>;
  register(tag: string): Promise<void>;
}

interface ServiceWorkerRegistration {
  readonly sync: SyncManager;
}

interface SyncEvent extends ExtendableEvent {
  readonly lastChance: boolean;
  readonly tag: string;
}

interface ServiceWorkerGlobalScopeEventMap {
  sync: SyncEvent;
}

// --- BACKGROUND SYNC ---
sw.addEventListener('sync', (event: SyncEvent) => {
  if (event.tag === 'retry-queue') {
    event.waitUntil(retryQueuedRequests());
  }
});

async function retryQueuedRequests() {
  
  return;
}

// --- PUSH ---
sw.addEventListener('push', (event: PushEvent) => {
  const data = event.data?.json() || {};

  event.waitUntil(
    sw.registration.showNotification(data.title ?? 'Update', {
      body: data.body ?? 'Bip bop bop bip!',
      icon: '/assets/icons/icon.png',
    })
  );
})
*/
