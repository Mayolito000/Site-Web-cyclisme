/* =========================================================================
   La Revue Cycliste — Service worker DÉSACTIVÉ (auto-désinstallation)
   -------------------------------------------------------------------------
   La lecture hors-ligne a été retirée. Ce fichier ne met plus rien en cache :
   il se désinstalle tout seul et vide les anciens caches, pour que les
   mises à jour du site apparaissent immédiatement. Il est conservé (plutôt
   que supprimé) afin que les appareils ayant déjà l'ancien service worker
   récupèrent cette version et se nettoient automatiquement.
   ========================================================================= */
"use strict";

self.addEventListener("install", function () {
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  event.waitUntil((async function () {
    try {
      var keys = await caches.keys();
      await Promise.all(keys.map(function (k) { return caches.delete(k); }));
      await self.registration.unregister();
      var clients = await self.clients.matchAll();
      clients.forEach(function (c) { if ("navigate" in c) c.navigate(c.url); });
    } catch (e) { /* rien à faire */ }
  })());
});

// Ne rien intercepter : le navigateur charge tout depuis le réseau normalement.
