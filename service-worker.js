self.addEventListener("install", (e) => {
    e.waitUntil(
        caches.open("static").then((cache) => {
          return cache.addAll([
            "/",
            "/index.html",
            "/style.css",
            "/script.js",
            "/manifest.json",
            "/icon-192x192.png",
            "/icon-512x512.png",
            "index.js"
          ]);
        })
      );
    });

    self.addEventListener("fetch", (e) => {
        e.respondWith(
            caches.match(e.request).then((response) => {
            return response || fetch(e.request);
            })
        );
        });
