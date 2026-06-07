// BC Electric Service Worker v1.0
const CACHE_NAME = 'bc-electric-v1';
const ASSETS = ['/'];

self.addEventListener('install', e => {
    self.skipWaiting();
});

self.addEventListener('activate', e => {
    e.waitUntil(clients.claim());
});

self.addEventListener('fetch', e => {
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});

// ─── Push Notifications ───
self.addEventListener('push', e => {
    const data = e.data ? e.data.json() : {};
    const title = data.title || 'BC Electric';
    const options = {
        body: data.body || '',
        icon: data.icon || '/icon-192.png',
        badge: '/icon-72.png',
        tag: data.tag || 'bc-notif',
        data: data.url || '/',
        dir: 'rtl',
        vibrate: [200, 100, 200],
        requireInteraction: data.requireInteraction || false,
    };
    e.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', e => {
    e.notification.close();
    e.waitUntil(clients.matchAll({ type: 'window' }).then(cs => {
        if (cs.length) return cs[0].focus();
        return clients.openWindow(e.notification.data || '/');
    }));
});

// ─── Background Sync for scheduled notifications ───
self.addEventListener('message', e => {
    if (e.data && e.data.type === 'SHOW_NOTIFICATION') {
        const { title, body, tag, requireInteraction } = e.data;
        self.registration.showNotification(title, {
            body,
            icon: '/icon-192.png',
            badge: '/icon-72.png',
            tag: tag || 'bc-notif',
            dir: 'rtl',
            vibrate: [200, 100, 200],
            requireInteraction: requireInteraction || false,
        });
    }
});
