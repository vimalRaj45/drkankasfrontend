// sw.js - Put this in your /public folder
// sw.js - Advanced Push Handling
self.addEventListener('push', function(event) {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Clinic Update';
  
  const options = {
    body: data.body || 'Your appointment has been updated.',
    icon: data.icon || '/icon-192.png', 
    badge: data.badge || '/badge.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || 'https://drkanaks.com/profile',
      ...data.data // Extra metadata if any
    },
    actions: data.actions || [] // Custom buttons
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Handle notification click and action buttons
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  
  let targetUrl = event.notification.data.url;
  
  // Handle action button clicks
  if (event.action === 'view-profile') {
    targetUrl = 'https://drkanaks.com/profile';
  } else if (event.action === 'book-new') {
    targetUrl = 'https://drkanaks.com/book';
  }

  // Ensure absolute URL
  const urlToOpen = new URL(targetUrl, self.location.origin).href;

  const promiseChain = clients.matchAll({
    type: 'window',
    includeUncontrolled: true
  }).then((windowClients) => {
    let matchingClient = null;

    // Professional window matching: match any client from the same origin
    const targetOrigin = new URL(urlToOpen).origin;
    for (let i = 0; i < windowClients.length; i++) {
        const windowClient = windowClients[i];
        const clientOrigin = new URL(windowClient.url).origin;
        if (clientOrigin === targetOrigin) {
            matchingClient = windowClient;
            break;
        }
    }

    if (matchingClient) {
        // Navigate the existing tab to the correct sub-route and focus it
        return matchingClient.navigate(urlToOpen).then(client => client.focus());
    } else {
        // If no tab is open, open a new window
        return clients.openWindow(urlToOpen);
    }
  });

  event.waitUntil(promiseChain);
});

// Required for PWA: A valid service worker must have a fetch event handler.
self.addEventListener('fetch', function(event) {
  event.respondWith(
    fetch(event.request).catch(function() {
      return new Response('App is offline.');
    })
  );
});
