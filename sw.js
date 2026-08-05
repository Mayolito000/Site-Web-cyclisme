/* =========================================================================
   La Revue Cycliste — Service worker (lecture hors-ligne)
   -------------------------------------------------------------------------
   Stratégie :
   • Pages et scripts (HTML/JS)  → réseau d'abord, cache en secours (offline).
     Le contenu reste donc frais quand on est en ligne.
   • Autres fichiers same-origin (CSS, polices, images, manifeste)
                                 → cache d'abord, mise à jour en arrière-plan.
   • Requêtes vers d'autres domaines (ex. mesure d'audience) → réseau normal.
   ========================================================================= */
"use strict";

var CACHE = "lrc-cache-v1";

// Fichiers du « socle » précachés à l'installation (tous existent à coup sûr :
// on évite les polices/images ici car un seul 404 ferait échouer addAll).
var CORE = [
  "/",
  "/index.html",
  "/actualites.html",
  "/article.html",
  "/portfolio.html",
  "/a-propos.html",
  "/mentions-legales.html",
  "/confidentialite.html",
  "/404.html",
  "/assets/css/style.css",
  "/assets/css/fonts.css",
  "/assets/js/articles.js",
  "/assets/js/main.js",
  "/assets/js/consent.js",
  "/site.webmanifest",
];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) { return c.addAll(CORE); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) {
        if (k !== CACHE) return caches.delete(k);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;

  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // tiers : réseau normal

  var dynamic = req.mode === "navigate" || /\.(html|js)$/.test(url.pathname);

  if (dynamic) {
    // Réseau d'abord, cache en secours.
    e.respondWith(
      fetch(req).then(function (res) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(req, copy); });
        return res;
      }).catch(function () {
        return caches.match(req, { ignoreSearch: true }).then(function (r) {
          return r || caches.match("/index.html");
        });
      })
    );
  } else {
    // Cache d'abord, mise à jour en arrière-plan.
    e.respondWith(
      caches.match(req).then(function (cached) {
        var network = fetch(req).then(function (res) {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(req, copy); });
          return res;
        }).catch(function () { return cached; });
        return cached || network;
      })
    );
  }
});
