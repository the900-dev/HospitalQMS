// sw.js
self.addEventListener('push', function(event) {
  let data = {};
  if (event.data) {
    try { data = event.data.json(); } 
    catch (e) { data = { title: 'South Rand Hospital', body: event.data.text() }; }
  }

  self.registration.showNotification(data.title || 'Queue Alert', {
    body: data.body || 'Your status has been updated.',
    icon: '/icon.png',
    badge: '/badge.png',
    vibrate: [200, 100, 200],
    data: data.url || '/'
  });
});
