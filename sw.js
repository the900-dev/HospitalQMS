// sw.js
self.addEventListener('push', function(event) {
  let data = {};
  if (event.data) {
    try { data = event.data.json(); } 
    catch (e) { data = { title: 'South Rand Hospital', body: event.data.text() }; }
  }

  const options = {
    body: data.body || 'Your status has been updated.',
    icon: '/icon.png',
    badge: '/badge.png',
    
    // Enhanced alerts for background mode
    vibrate: [300, 100, 300, 100, 300], // Stronger vibration pulse
    sound: 'default',                    // Triggers native system sound
    requireInteraction: true,            // Keeps notification visible until dismissed
    
    data: data.url || '/'
  };

  self.registration.showNotification(data.title || 'Queue Alert', options);
});

// Handle notification click events (brings user back to the app)
self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      for (let i = 0; i < clientList.length; i++) {
        let client = clientList[i];
        if (client.url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.url || '/');
      }
    })
  );
});
