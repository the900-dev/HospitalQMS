// sw.js - Service Worker for Background Web Push
self.addEventListener('push', function(event) {
  let data = {};
  if (event.data) {
    try { 
      data = event.data.json(); 
    } catch (e) { 
      data = { title: 'Hospital Queue System', body: event.data.text() }; 
    }
  }

  const options = {
    body: data.body || 'Your status has been updated.',
    icon: '/icon.png',
    badge: '/badge.png',
    
    // Enhanced alerts for background mode
    vibrate: [300, 100, 300, 100, 300], // Stronger vibration pulse
    requireInteraction: true,            // Keeps notification visible until dismissed
    
    data: { 
      url: data.url || '/' 
    }
  };

  const notificationTitle = data.title || 'Queue Alert';

  event.waitUntil(
    self.registration.showNotification(notificationTitle, options)
  );
});

// Handle notification click events (brings user back to the app)
self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  const targetUrl = (event.notification.data && event.notification.data.url) ? event.notification.data.url : '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      for (let i = 0; i < clientList.length; i++) {
        let client = clientList[i];
        if (client.url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
