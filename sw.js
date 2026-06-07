// BC Electric Service Worker v2.0
const CACHE_NAME = 'bc-electric-v2';

self.addEventListener('install', e => { self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(clients.claim()); });

self.addEventListener('fetch', e => {
    // فقط للملفات المحلية
    if (e.request.url.includes('firebase') || e.request.url.includes('googleapis')) return;
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});

// ─── استقبال Push من Cloudflare Worker ───
self.addEventListener('push', e => {
    let data = {};
    try { data = e.data ? e.data.json() : {}; } catch(err) {}

    const title = data.title || 'BC Electric';
    const options = {
        body: data.body || '',
        icon: 'icon-192.png',
        badge: 'icon-72.png',
        tag: data.tag || 'bc-notif-' + Date.now(),
        data: { url: data.url || './' },
        dir: 'rtl',
        vibrate: [200, 100, 200, 100, 200],
        requireInteraction: data.requireInteraction || false,
        silent: false,
    };
    e.waitUntil(
        self.registration.showNotification(title, options)
    );
});

// ─── عند الضغط على الإشعار ───
self.addEventListener('notificationclick', e => {
    e.notification.close();
    const targetUrl = (e.notification.data && e.notification.data.url) || './';
    e.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cs => {
            // إذا التطبيق مفتوح — فقط ركّز عليه
            for (const c of cs) {
                if (c.url.includes('BCElectric') || c.url.includes('sw/')) {
                    return c.focus();
                }
            }
            // إذا مغلق — افتحه
            return clients.openWindow(targetUrl);
        })
    );
});

// ─── استقبال رسائل من الصفحة الرئيسية ───
self.addEventListener('message', e => {
    if (!e.data) return;
    if (e.data.type === 'SHOW_NOTIFICATION') {
        const { title, body, tag, requireInteraction } = e.data;
        self.registration.showNotification(title, {
            body: body || '',
            icon: 'icon-192.png',
            badge: 'icon-72.png',
            tag: tag || 'bc-notif',
            dir: 'rtl',
            vibrate: [200, 100, 200],
            requireInteraction: requireInteraction || false,
        });
    }
    if (e.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
