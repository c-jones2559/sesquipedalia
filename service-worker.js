self.addEventListener('install', e => {
  console.log('Service Worker installed');
});

self.addEventListener('fetch', e => {
  // Let requests go through normally for now
});