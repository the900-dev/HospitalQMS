// HospitalQMS - Background Web Push Service Worker

const APP_URL = '/HospitalQMS/';

self.addEventListener('push', function(event) {
let data = {};

```
if (event.data) {
    try {
        data = event.data.json();
    } catch (e) {
        data = {
            title: 'Hospital Queue System',
            body: event.data.text()
        };
    }
}

const options = {
    body: data.body || 'Your queue status has been updated.',
    icon: APP_URL + 'icon-192.png',
    badge: APP_URL + 'icon-192.png',
    vibrate: [300, 100, 300, 100, 300],
    requireInteraction: true,

    data: {
        url: data.url || APP_URL
    }
};

event.waitUntil(
    self.registration.showNotification(
        data.title || 'Hospital Queue Alert',
        options
    )
);
```

});

self.addEventListener('notificationclick', function(event) {
event.notification.close();

```
const targetUrl = new URL(
    event.notification.data?.url || APP_URL,
    self.location.origin
).href;

event.waitUntil(
    clients.matchAll({
        type: 'window',
        includeUncontrolled: true
    }).then(function(clientList) {

        for (const client of clientList) {
            if (client.url.startsWith(self.location.origin)) {
                return client.navigate(targetUrl).then(function(navigatedClient) {
                    return navigatedClient.focus();
                });
            }
        }

        return clients.openWindow(targetUrl);
    })
);
```

});
