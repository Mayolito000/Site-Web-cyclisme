/* =========================================================================
   La Revue Cycliste — Logique du site
   Rendu des articles, vignettes générées, filtres, navigation.
   ========================================================================= */
(function () {
  "use strict";

  const ARTICLES = window.ARTICLES || [];
  const CATEGORIES = window.CATEGORIES || [];
  const SITE = window.SITE || {};

  /* ---- Utilitaires ---------------------------------------------------- */
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const byDateDesc = (a, b) => new Date(b.date) - new Date(a.date);

  function formatDate(iso) {
    try {
      return new Date(iso + "T00:00:00").toLocaleDateString("fr-FR", {
        day: "numeric", month: "long", year: "numeric",
      });
    } catch (e) { return iso; }
  }

  function escapeHTML(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[c]));
  }

  /* ---- Vignettes générées (SVG) --------------------------------------
     Aucune image externe : chaque article reçoit une vignette dessinée,
     déclinée selon son "tone". Motif : profil de col + roue stylisée.    */
  const TONES = {
    red:   { a: "#e23a26", b: "#7d1a10", ink: "#fff2ee" },
    gold:  { a: "#f2c230", b: "#b8860b", ink: "#2a2200" },
    ink:   { a: "#2b2a26", b: "#0f0e0b", ink: "#f2c230" },
    slate: { a: "#5b6b74", b: "#2c363c", ink: "#eaf1f4" },
    sky:   { a: "#3d8fb0", b: "#1d4a5e", ink: "#eefaff" },
  };

  function thumbSVG(article) {
    const t = TONES[article.tone] || TONES.red;
    const label = escapeHTML((article.category || "").toUpperCase());
    const gid = "g" + Math.abs(hashStr(article.id)) % 100000;
    // Profil de montagne pseudo-aléatoire mais stable par article
    const seed = Math.abs(hashStr(article.id));
    const pts = [];
    for (let i = 0; i <= 8; i++) {
      const x = (i / 8) * 400;
      const h = 120 + ((seed >> i) % 90) - ((i === 4) ? 40 : 0);
      pts.push(`${x},${230 - (h - 60)}`);
    }
    const ridge = `0,250 ${pts.join(" ")} 400,250`;
    return `
<svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${label}">
  <defs>
    <linearGradient id="${gid}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${t.a}"/>
      <stop offset="1" stop-color="${t.b}"/>
    </linearGradient>
  </defs>
  <rect width="400" height="250" fill="url(#${gid})"/>
  <g opacity="0.16" fill="none" stroke="${t.ink}" stroke-width="1.4">
    <circle cx="330" cy="70" r="34"/><circle cx="330" cy="70" r="20"/>
    <path d="M330 36 L330 104 M296 70 L364 70 M306 46 L354 94 M354 46 L306 94"/>
  </g>
  <polygon points="${ridge}" fill="${t.ink}" opacity="0.14"/>
  <polyline points="${pts.join(" ")}" fill="none" stroke="${t.ink}" stroke-width="2" opacity="0.55" stroke-linejoin="round"/>
  <text x="24" y="220" fill="${t.ink}" opacity="0.9"
        font-family="'Space Mono', monospace" font-size="15" letter-spacing="3" font-weight="700">${label}</text>
</svg>`;
  }

  function hashStr(s) {
    let h = 0;
    for (let i = 0; i < String(s).length; i++) {
      h = (h << 5) - h + String(s).charCodeAt(i);
      h |= 0;
    }
    return h;
  }

  /* Contenu d'une vignette : la photo (si `image` est défini) posée sur
     l'illustration SVG. Si la photo ne charge pas, elle s'efface et
     l'illustration reste visible — jamais d'image cassée.                 */
  function mediaHTML(a) {
    const svg = thumbSVG(a);
    if (a.image) {
      return svg +
        `<img class="thumb-img" src="${escapeHTML(a.image)}" alt="${escapeHTML(a.title)}"` +
        ` loading="lazy" decoding="async" onerror="this.style.display='none'">`;
    }
    return svg;
  }

  /* ---- Fabriques de fragments ---------------------------------------- */
  function metaHTML(a) {
    return `<span class="meta">
      <span class="chip">${escapeHTML(a.category)}</span>
      <span class="sep"></span>
      <time datetime="${a.date}">${formatDate(a.date)}</time>
      <span class="sep"></span>
      <span class="rt">${a.readingTime} min</span>
    </span>`;
  }

  function cardHTML(a) {
    const href = `article.html?id=${encodeURIComponent(a.id)}`;
    return `<article class="card reveal">
      <a class="card__link" href="${href}" aria-label="${escapeHTML(a.title)}">
        <div class="thumb">${mediaHTML(a)}</div>
      </a>
      <div class="card__body">
        <h3 class="card__title"><a class="stretch" href="${href}">${escapeHTML(a.title)}</a></h3>
        <p>${escapeHTML(a.excerpt)}</p>
        ${metaHTML(a)}
      </div>
    </article>`;
  }

  function miniHTML(a) {
    const href = `article.html?id=${encodeURIComponent(a.id)}`;
    return `<a class="mini" href="${href}">
      <span class="thumb">${mediaHTML(a)}</span>
      <span>
        <h4>${escapeHTML(a.title)}</h4>
        <span class="meta"><time datetime="${a.date}">${formatDate(a.date)}</time>
        <span class="sep"></span><span class="rt">${a.readingTime} min</span></span>
      </span>
    </a>`;
  }

  /* ---- État « à venir » (aucun article) ------------------------------ */
  function comingSoonHTML(title, text) {
    return `<div class="soon">
      <div class="soon__mark" aria-hidden="true">
        <svg width="26" height="26" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="8">
          <circle cx="30" cy="66" r="16"/><circle cx="72" cy="66" r="16"/>
          <path d="M30 66 L52 40 L72 66 M52 40 L44 40 M52 40 L60 66" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <h3>${escapeHTML(title)}</h3>
      <p>${escapeHTML(text)}</p>
    </div>`;
  }

  function featurePlaceholderHTML() {
    const svg = thumbSVG({ id: "soon-hero", category: "À venir", tone: "slate" });
    return `<div class="thumb">${svg}</div>
      <div class="feature__body">
        <span class="chip chip--gold">À venir</span>
        <h3>La une arrive bientôt</h3>
        <p>Le premier article mis en avant s'affichera ici.</p>
        <div class="meta">La Revue Cycliste · Actualité cycliste</div>
      </div>`;
  }

  /* ---- Page : ACCUEIL ------------------------------------------------- */
  function renderHome() {
    const featBox = $("#js-featured");
    const grid = $("#js-latest-grid");
    if (!featBox && !grid) return; // pas la page d'accueil

    const sorted = [...ARTICLES].sort(byDateDesc);

    if (!sorted.length) {
      if (featBox) featBox.innerHTML = featurePlaceholderHTML();
      const latest = $("#js-latest");
      if (latest) latest.innerHTML = comingSoonHTML(
        "Les premiers articles arrivent bientôt",
        "La Revue Cycliste se prépare. Reviens très vite pour lire les premières analyses et décryptages du peloton."
      );
      const more = $("#js-latest-more");
      if (more) more.style.display = "none";
      return;
    }

    const featured = sorted.find((a) => a.featured) || sorted[0];

    if (featBox && featured) {
      const href = `article.html?id=${encodeURIComponent(featured.id)}`;
      featBox.innerHTML = `
        <a href="${href}" class="thumb" aria-label="${escapeHTML(featured.title)}">${mediaHTML(featured)}</a>
        <div class="feature__body">
          <span class="chip chip--gold">À la une · ${escapeHTML(featured.category)}</span>
          <h3><a href="${href}">${escapeHTML(featured.title)}</a></h3>
          <p>${escapeHTML(featured.excerpt)}</p>
          <div class="meta">
            <time datetime="${featured.date}">${formatDate(featured.date)}</time>
            <span class="sep"></span><span class="rt">${featured.readingTime} min de lecture</span>
          </div>
        </div>`;
    }

    const rest = sorted.filter((a) => a.id !== (featured && featured.id));

    if (grid) grid.innerHTML = rest.slice(0, 3).map(cardHTML).join("");

    const stack = $("#js-latest-stack");
    if (stack) stack.innerHTML = rest.slice(3, 7).map(miniHTML).join("");
  }

  /* ---- Page : ACTUALITÉS --------------------------------------------- */
  function renderNews() {
    const grid = $("#js-news-grid");
    const filterBox = $("#js-filters");
    if (!grid) return;

    const sorted = [...ARTICLES].sort(byDateDesc);

    if (!sorted.length) {
      if (filterBox) filterBox.style.display = "none";
      grid.innerHTML = comingSoonHTML(
        "Les premiers articles arrivent bientôt",
        "Aucun article n'est encore publié. Reviens vite : les analyses, décryptages et récits cyclistes arrivent."
      );
      return;
    }

    // Construire les filtres
    if (filterBox) {
      const cats = ["Tout", ...CATEGORIES.filter((c) => sorted.some((a) => a.category === c))];
      filterBox.innerHTML = cats.map((c, i) =>
        `<button class="filter${i === 0 ? " is-active" : ""}" data-cat="${escapeHTML(c)}">${escapeHTML(c)}</button>`
      ).join("");
      filterBox.addEventListener("click", (e) => {
        const btn = e.target.closest(".filter");
        if (!btn) return;
        $$(".filter", filterBox).forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        paint(btn.dataset.cat);
      });
    }

    function paint(cat) {
      const list = (!cat || cat === "Tout") ? sorted : sorted.filter((a) => a.category === cat);
      grid.innerHTML = list.length
        ? list.map(cardHTML).join("")
        : `<p class="empty-state">Aucun article dans cette rubrique pour l'instant.</p>`;
      observeReveals();
    }
    paint("Tout");
  }

  /* ---- Page : ARTICLE ------------------------------------------------- */
  function renderArticle() {
    const root = $("#js-article");
    if (!root) return;

    const params = new URLSearchParams(location.search);
    const id = params.get("id");
    const a = ARTICLES.find((x) => x.id === id) || [...ARTICLES].sort(byDateDesc)[0];

    if (!a) {
      root.innerHTML = `<div class="wrap section"><p class="empty-state">Article introuvable. <a href="actualites.html">Retour aux actualités</a>.</p></div>`;
      return;
    }

    document.title = `${a.title} — ${SITE.name}`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", a.excerpt);

    const bodyHTML = (a.body || []).map((blk) => {
      switch (blk.t) {
        case "h2":    return `<h2>${escapeHTML(blk.x)}</h2>`;
        case "quote": return `<blockquote>${escapeHTML(blk.x)}</blockquote>`;
        case "list":  return `<ul class="bullets">${(blk.x || []).map((li) => `<li>${escapeHTML(li)}</li>`).join("")}</ul>`;
        default:      return `<p>${escapeHTML(blk.x)}</p>`;
      }
    }).join("");

    const initial = (a.author || "?").trim().charAt(0).toUpperCase();

    root.innerHTML = `
      <div class="wrap article-hero">
        <p class="breadcrumb"><a href="index.html">Accueil</a> / <a href="actualites.html">Actualités</a> / ${escapeHTML(a.category)}</p>
        <span class="chip">${escapeHTML(a.category)}</span>
        <h1 class="article-title">${escapeHTML(a.title)}</h1>
        <p class="article-standfirst">${escapeHTML(a.excerpt)}</p>
        <div class="article-byline">
          <span class="avatar">${initial}</span>
          <span class="meta">
            <strong style="color:var(--ink)">${escapeHTML(a.author)}</strong>
            <span class="sep"></span><time datetime="${a.date}">${formatDate(a.date)}</time>
            <span class="sep"></span><span class="rt">${a.readingTime} min de lecture</span>
          </span>
        </div>
      </div>
      <div class="wrap article-cover"><div class="thumb">${mediaHTML(a)}</div></div>
      <div class="wrap"><div class="prose">${bodyHTML}</div></div>
      <div class="wrap">
        <div class="article-foot">
          <div class="tags">
            <span class="tag">#${escapeHTML(a.category)}</span>
            <span class="tag">#cyclisme</span>
          </div>
          <a class="btn btn--ghost" href="actualites.html">← Tous les articles</a>
        </div>
      </div>`;

    // Articles liés (même rubrique)
    const related = $("#js-related");
    if (related) {
      const rel = ARTICLES.filter((x) => x.category === a.category && x.id !== a.id)
        .sort(byDateDesc).slice(0, 3);
      if (rel.length) {
        $("#js-related-grid").innerHTML = rel.map(cardHTML).join("");
      } else {
        related.remove();
      }
    }
  }

  /* ---- Page : PORTFOLIO ---------------------------------------------- */
  function renderPortfolio() {
    const grid = $("#js-portfolio-grid");
    if (!grid) return;

    if (!ARTICLES.length) {
      grid.innerHTML = comingSoonHTML(
        "Ma sélection arrive bientôt",
        "Mes articles à retenir s'afficheront ici dès leur publication."
      );
      const more = $("#js-portfolio-more");
      if (more) more.style.display = "none";
      return;
    }

    const picks = ARTICLES.filter((a) => a.portfolio).sort(byDateDesc);
    grid.innerHTML = (picks.length ? picks : [...ARTICLES].sort(byDateDesc).slice(0, 4))
      .map(cardHTML).join("");
  }

  /* ---- Reveal on scroll ----------------------------------------------
     Scroll-based plutôt qu'IntersectionObserver seul : garantit qu'aucun
     contenu ne reste invisible, même lors d'un défilement très rapide ou
     d'un saut d'ancre (#contact). Un filet de sécurité révèle tout au bout
     de quelques secondes si quoi que ce soit tourne mal.                  */
  let revealBound = false;
  const prefersReducedMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function revealScan() {
    const vh = window.innerHeight || document.documentElement.clientHeight;
    $$(".reveal:not(.in)").forEach((el) => {
      if (el.getBoundingClientRect().top < vh - 40) el.classList.add("in");
    });
  }

  function observeReveals() {
    if (prefersReducedMotion) {
      $$(".reveal").forEach((el) => el.classList.add("in"));
      return;
    }
    revealScan();
    if (!revealBound) {
      revealBound = true;
      window.addEventListener("scroll", revealScan, { passive: true });
      window.addEventListener("resize", revealScan);
      // Filet de sécurité : rien ne doit rester caché.
      setTimeout(() => $$(".reveal").forEach((el) => el.classList.add("in")), 4000);
    }
  }

  /* ---- Chrome global (header, menu, année) --------------------------- */
  function initChrome() {
    // Année du footer
    $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

    // Injecter le nom du site / email là où c'est demandé
    $$("[data-site-name]").forEach((el) => (el.textContent = SITE.name));
    $$("[data-site-email]").forEach((el) => {
      el.textContent = SITE.email;
      if (el.tagName === "A") el.href = "mailto:" + SITE.email;
    });
    $$("a[data-mailto]").forEach((el) => (el.href = "mailto:" + SITE.email));

    // Header collant : ombre au scroll
    const header = $(".site-header");
    if (header) {
      const onScroll = () => header.classList.toggle("is-stuck", window.scrollY > 8);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    // Menu mobile
    const toggle = $(".nav__toggle");
    const links = $(".nav__links");
    if (toggle && links) {
      toggle.addEventListener("click", () => {
        const open = links.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", String(open));
      });
      $$("a", links).forEach((a) => a.addEventListener("click", () => {
        links.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }));
    }

    // Marquer le lien de nav actif
    const page = document.body.dataset.page;
    if (page) {
      const active = $(`.nav__links a[data-nav="${page}"]`);
      if (active) active.classList.add("is-active");
    }
  }

  /* ---- Boot ----------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", () => {
    initChrome();
    renderHome();
    renderNews();
    renderArticle();
    renderPortfolio();
    observeReveals();
  });
})();
