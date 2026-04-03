// sw.js - Put this in your /public folder
self.addEventListener('push', function(event) {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Clinic Update';
  const options = {
    body: data.body || 'Your appointment has been updated.',
    icon: '/logo.png', 
    badge: '/badge.png',
    data: {
      url: data.url || '/'
    }
  };
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Optional: Open the link when notification is clicked
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});

// Required for PWA: A valid service worker must have a fetch event handler. Wait, for strict PWA wrapping as an App instead of a shortcut, we're returning an active network fetch.
self.addEventListener('fetch', function(event) {
  event.respondWith(
    fetch(event.request).catch(function() {
      return new Response('App is offline.');
    })
  );
});
