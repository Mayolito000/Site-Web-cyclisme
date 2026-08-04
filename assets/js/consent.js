/* =========================================================================
   La Revue Cycliste — Consentement cookies
   -------------------------------------------------------------------------
   Microsoft Clarity (mesure d'audience) n'est chargé QU'APRÈS acceptation.
   Le choix est mémorisé (localStorage). Un lien « Gérer les cookies »
   (attribut data-cookie-settings) permet de revenir sur son choix.
   ========================================================================= */
(function () {
  "use strict";

  var KEY = "lrc-cookie-consent";      // "granted" | "denied"
  var CLARITY_ID = "xx89ldai1u";

  function getChoice() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function setChoice(v) {
    try { localStorage.setItem(KEY, v); } catch (e) {}
  }

  // Charge Microsoft Clarity (snippet officiel), une seule fois.
  function loadClarity() {
    if (window.__clarityLoaded) return;
    window.__clarityLoaded = true;
    (function (c, l, a, r, i, t, y) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
      t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i + "?ref=bwt";
      y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, "clarity", "script", CLARITY_ID);
  }

  function removeBanner(b) {
    b.classList.remove("is-visible");
    setTimeout(function () { if (b.parentNode) b.parentNode.removeChild(b); }, 350);
  }

  function showBanner() {
    if (document.querySelector(".cookie-banner")) return;
    var b = document.createElement("div");
    b.className = "cookie-banner";
    b.setAttribute("role", "dialog");
    b.setAttribute("aria-label", "Consentement aux cookies");
    b.innerHTML =
      '<div class="cookie-banner__inner">' +
        '<p class="cookie-banner__txt">🍪 Nous utilisons un outil de mesure d\'audience (Microsoft Clarity) ' +
        'pour comprendre comment le site est utilisé et l\'améliorer. Vous pouvez accepter ou refuser ces cookies.</p>' +
        '<div class="cookie-banner__actions">' +
          '<button type="button" class="cookie-btn cookie-btn--ghost" data-consent="denied">Refuser</button>' +
          '<button type="button" class="cookie-btn cookie-btn--primary" data-consent="granted">Accepter</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(b);
    requestAnimationFrame(function () { b.classList.add("is-visible"); });

    b.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-consent]");
      if (!btn) return;
      var choice = btn.getAttribute("data-consent");
      setChoice(choice);
      if (choice === "granted") loadClarity();
      removeBanner(b);
    });
  }

  function init() {
    var choice = getChoice();
    if (choice === "granted") { loadClarity(); return; }
    if (choice === "denied") { return; }
    showBanner();
  }

  // Lien « Gérer les cookies » : réinitialise le choix et rouvre le bandeau.
  document.addEventListener("click", function (e) {
    var link = e.target.closest("[data-cookie-settings]");
    if (!link) return;
    e.preventDefault();
    try { localStorage.removeItem(KEY); } catch (err) {}
    showBanner();
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
