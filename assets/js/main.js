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
    red:   { a: "#bd4633", b: "#7a2a1d", ink: "#f7ece6" },  /* terracotta */
    gold:  { a: "#c9a86a", b: "#8a6a38", ink: "#241a08" },  /* sable */
    ink:   { a: "#26374f", b: "#132239", ink: "#eee7d9" },  /* marine */
    slate: { a: "#4c586b", b: "#2a3242", ink: "#eef1f4" },
    sky:   { a: "#3f6c8f", b: "#1f3d5c", ink: "#eef6ff" },
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
    const chip = a.category
      ? `<span class="chip">${escapeHTML(a.category)}</span>\n      <span class="sep"></span>\n      `
      : "";
    return `<span class="meta">
      ${chip}<time datetime="${a.date}">${formatDate(a.date)}</time>
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
    const svg = thumbSVG({ id: "soon-hero", category: "À venir", tone: "ink" });
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
          <span class="chip chip--gold">À la une${featured.category ? " · " + escapeHTML(featured.category) : ""}</span>
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

    // Construire les filtres (seulement s'il existe des rubriques utilisées)
    const usedCats = CATEGORIES.filter((c) => sorted.some((a) => a.category === c));
    if (filterBox) {
      if (!usedCats.length) {
        filterBox.style.display = "none";
      } else {
        const cats = ["Tout", ...usedCats];
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

    // SEO dynamique : canonical, Open Graph et données structurées de l'article
    const base = "https://larevuecycliste.fr/";
    const artUrl = base + "article.html?id=" + encodeURIComponent(a.id);
    const img = (a.image && /^https?:/.test(a.image)) ? a.image : base + "assets/img/og-image.png";
    const setMeta = (sel, attr, val) => { const el = document.querySelector(sel); if (el) el.setAttribute(attr, val); };
    setMeta('link[rel="canonical"]', "href", artUrl);
    setMeta('meta[property="og:type"]', "content", "article");
    setMeta('meta[property="og:title"]', "content", a.title);
    setMeta('meta[property="og:description"]', "content", a.excerpt);
    setMeta('meta[property="og:url"]', "content", artUrl);
    setMeta('meta[property="og:image"]', "content", img);
    setMeta('meta[name="twitter:title"]', "content", a.title);
    setMeta('meta[name="twitter:description"]', "content", a.excerpt);
    setMeta('meta[name="twitter:image"]', "content", img);

    const ld = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: a.title,
      description: a.excerpt,
      datePublished: a.date,
      dateModified: a.date,
      inLanguage: "fr-FR",
      image: img,
      author: { "@type": "Organization", name: SITE.name, url: base },
      publisher: {
        "@type": "Organization", name: SITE.name, url: base,
        logo: { "@type": "ImageObject", url: base + "assets/img/og-image.png" },
      },
      mainEntityOfPage: { "@type": "WebPage", "@id": artUrl },
    };
    if (a.category) ld.articleSection = a.category;
    let ldEl = document.getElementById("js-article-ld");
    if (!ldEl) {
      ldEl = document.createElement("script");
      ldEl.type = "application/ld+json";
      ldEl.id = "js-article-ld";
      document.head.appendChild(ldEl);
    }
    ldEl.textContent = JSON.stringify(ld);

    // Fil d'Ariane structuré (Google) — la rubrique n'est incluse que si elle existe
    const crumbItems = [
      { "@type": "ListItem", position: 1, name: "Accueil", item: base },
      { "@type": "ListItem", position: 2, name: "Actualités", item: base + "actualites.html" },
    ];
    if (a.category) crumbItems.push({ "@type": "ListItem", position: 3, name: a.category, item: base + "actualites.html" });
    crumbItems.push({ "@type": "ListItem", position: crumbItems.length + 1, name: a.title, item: artUrl });
    const crumbs = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: crumbItems };
    let bcEl = document.getElementById("js-breadcrumb-ld");
    if (!bcEl) {
      bcEl = document.createElement("script");
      bcEl.type = "application/ld+json";
      bcEl.id = "js-breadcrumb-ld";
      document.head.appendChild(bcEl);
    }
    bcEl.textContent = JSON.stringify(crumbs);

    // Corps + collecte des titres pour le sommaire (avec ancres)
    const headings = [];
    const usedIds = {};
    const bodyHTML = (a.body || []).map((blk) => {
      switch (blk.t) {
        case "h2": {
          let id = slugify(blk.x) || "section";
          while (usedIds[id]) id += "-b";
          usedIds[id] = true;
          headings.push({ id, text: blk.x });
          return `<h2 id="${id}">${escapeHTML(blk.x)}</h2>`;
        }
        case "quote": return `<blockquote>${escapeHTML(blk.x)}</blockquote>`;
        case "list":  return `<ul class="bullets">${(blk.x || []).map((li) => `<li>${escapeHTML(li)}</li>`).join("")}</ul>`;
        default:      return `<p>${escapeHTML(blk.x)}</p>`;
      }
    }).join("");

    // Sommaire automatique (articles longs : au moins 3 sous-titres)
    const tocHTML = headings.length >= 3
      ? `<div class="wrap"><nav class="toc" aria-label="Sommaire">
           <div class="toc__title">Sommaire</div>
           <ol>${headings.map((h) => `<li><a href="#${h.id}">${escapeHTML(h.text)}</a></li>`).join("")}</ol>
         </nav></div>`
      : "";

    const initial = (a.author || "?").trim().charAt(0).toUpperCase();

    root.innerHTML = `
      <div class="wrap article-hero">
        <p class="breadcrumb"><a href="index.html">Accueil</a> / <a href="actualites.html">Actualités</a>${a.category ? " / " + escapeHTML(a.category) : ""}</p>
        ${a.category ? `<span class="chip">${escapeHTML(a.category)}</span>` : ""}
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
        ${listenHTML()}
      </div>
      <div class="wrap article-cover"><div class="thumb">${mediaHTML(a)}</div></div>
      ${tocHTML}
      <div class="wrap"><div class="prose">${bodyHTML}</div></div>
      <div class="wrap">${shareHTML(a, artUrl)}</div>
      <div class="wrap">
        <div class="article-foot">
          <div class="tags">
            ${a.category ? `<span class="tag">#${escapeHTML(a.category)}</span>` : ""}
            <span class="tag">#cyclisme</span>
          </div>
          <a class="btn btn--ghost" href="actualites.html">← Tous les articles</a>
        </div>
      </div>`;

    // Boutons de partage + écoute vocale
    initArticleShare(a, artUrl);
    initListen(a);

    // Section commentaires
    renderComments(a);

    // À lire ensuite : même rubrique si elle existe, sinon les plus récents
    const related = $("#js-related");
    if (related) {
      const pool = a.category
        ? ARTICLES.filter((x) => x.category === a.category && x.id !== a.id)
        : ARTICLES.filter((x) => x.id !== a.id);
      const rel = pool.sort(byDateDesc).slice(0, 3);
      if (rel.length) {
        $("#js-related-grid").innerHTML = rel.map(cardHTML).join("");
      } else {
        related.remove();
      }
    }
  }

  /* ---- Commentaires (Cusdis) ------------------------------------------
     Service externe gratuit, sans compte pour le lecteur. Le script n'est
     chargé que si un App ID est configuré (articles.js → COMMENTS), et
     seulement quand la zone approche de l'écran (respect vie privée/perf). */
  function loadCusdisWhenVisible(target, host) {
    const src = String(host).replace(/\/+$/, "") + "/js/cusdis.es.js";
    let done = false;
    const inject = () => {
      if (done) return;
      done = true;
      const s = document.createElement("script");
      s.async = true;
      s.src = src;
      document.body.appendChild(s);
    };
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) { inject(); io.disconnect(); }
      }, { rootMargin: "600px 0px" });
      io.observe(target);
    } else {
      inject();
    }
  }

  function renderComments(a) {
    const box = $("#js-comments");
    if (!box) return;
    const cfg = window.COMMENTS || {};
    // Commentaires désactivés : on retire la section (rien ne s'affiche, aucun script chargé).
    if (!cfg.enabled) { box.remove(); return; }
    box.innerHTML = `
      <div class="section-head"><div>
        <span class="eyebrow">Réagir</span>
        <h2>Commentaires</h2>
      </div></div>
      <p class="comments-note">Exprimez-vous librement, sans créer de compte — un pseudo suffit. Les commentaires sont relus avant d'être publiés.</p>
      <div class="comments-slot" id="js-comments-slot"></div>`;
    const slot = $("#js-comments-slot", box);
    if (!cfg.appId) {
      slot.innerHTML = `<p class="comments-note comments-note--muted">💬 Les commentaires seront activés très prochainement.</p>`;
      return;
    }
    const host = cfg.host || "https://cusdis.com";
    const thread = document.createElement("div");
    thread.id = "cusdis_thread";
    thread.setAttribute("data-host", host);
    thread.setAttribute("data-app-id", cfg.appId);
    thread.setAttribute("data-page-id", a.id);
    thread.setAttribute("data-page-url", "https://larevuecycliste.fr/article.html?id=" + encodeURIComponent(a.id));
    thread.setAttribute("data-page-title", a.title);
    thread.setAttribute("data-theme", "light");
    slot.appendChild(thread);
    loadCusdisWhenVisible(slot, host);
  }

  /* ---- Page : PORTFOLIO ---------------------------------------------- */
  function renderPortfolio() {
    const grid = $("#js-portfolio-grid");
    if (!grid) return;

    if (!ARTICLES.length) {
      grid.innerHTML = comingSoonHTML(
        "Notre sélection arrive bientôt",
        "Nos articles à retenir s'afficheront ici dès leur publication."
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

  /* ---- Recherche interne (overlay global) ----------------------------
     100 % côté client : les articles sont déjà chargés en mémoire.
     Insensible aux accents et à la casse, cherche dans le titre, la
     rubrique, le chapô, le corps et l'auteur, avec surlignage.            */
  function deburr(s) {
    // Décompose puis retire les signes diacritiques (é→e, č→c, ñ→n…).
    // La longueur est conservée pour les caractères précomposés, ce qui
    // garde le surlignage aligné sur le texte d'origine.
    return String(s).normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
  const norm = (s) => deburr(s).toLowerCase();
  const bodyText = (a) => (a.body || []).map((b) => Array.isArray(b.x) ? b.x.join(" ") : (b.x || "")).join(" ");

  function searchArticles(query) {
    const tokens = norm(query).trim().split(/\s+/).filter(Boolean);
    if (!tokens.length) return [];
    return ARTICLES.map((a) => {
      const t = norm(a.title), c = norm(a.category), e = norm(a.excerpt),
            b = norm(bodyText(a)), au = norm(a.author || "");
      const hay = [t, c, e, b, au].join("  ");
      if (!tokens.every((tk) => hay.includes(tk))) return null;
      let score = 0;
      for (const tk of tokens) {
        if (t.includes(tk)) score += 10;
        if (c.includes(tk)) score += 6;
        if (e.includes(tk)) score += 4;
        if (au.includes(tk)) score += 3;
        if (b.includes(tk)) score += 1;
      }
      if (t.startsWith(tokens[0])) score += 5;
      return { a, score };
    }).filter(Boolean)
      .sort((x, y) => y.score - x.score || byDateDesc(x.a, y.a))
      .map((r) => r.a);
  }

  function highlight(orig, tokens) {
    orig = String(orig);
    if (!tokens.length) return escapeHTML(orig);
    const n = norm(orig); // aligné caractère par caractère avec orig
    const ranges = [];
    for (const tk of tokens) {
      if (!tk) continue;
      let i = 0;
      while ((i = n.indexOf(tk, i)) !== -1) { ranges.push([i, i + tk.length]); i += tk.length; }
    }
    if (!ranges.length) return escapeHTML(orig);
    ranges.sort((a, b) => a[0] - b[0]);
    const merged = [];
    for (const r of ranges) {
      const last = merged[merged.length - 1];
      if (last && r[0] <= last[1]) last[1] = Math.max(last[1], r[1]);
      else merged.push(r.slice());
    }
    let out = "", pos = 0;
    for (const seg of merged) {
      out += escapeHTML(orig.slice(pos, seg[0])) + "<mark>" + escapeHTML(orig.slice(seg[0], seg[1])) + "</mark>";
      pos = seg[1];
    }
    return out + escapeHTML(orig.slice(pos));
  }

  function resultRow(a, tokens) {
    const href = `article.html?id=${encodeURIComponent(a.id)}`;
    return `<a class="search-result" href="${href}" role="option">
      <span class="search-result__cat">${escapeHTML(a.category || "")}</span>
      <span class="search-result__title">${highlight(a.title || "", tokens)}</span>
      <span class="search-result__excerpt">${highlight(a.excerpt || "", tokens)}</span>
      <span class="search-result__meta"><time datetime="${a.date}">${formatDate(a.date)}</time>${a.readingTime ? " · " + a.readingTime + " min" : ""}</span>
    </a>`;
  }

  function initSearch() {
    const nav = $(".nav");
    if (!nav) return;

    // Bouton loupe dans l'en-tête (toujours visible, desktop + mobile)
    if (!$(".nav__search")) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "nav__search";
      btn.setAttribute("aria-label", "Rechercher sur le site");
      btn.setAttribute("aria-haspopup", "dialog");
      btn.setAttribute("data-search-open", "");
      btn.innerHTML = `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.6-3.6"/></svg>`;
      const toggle = $(".nav__toggle");
      if (toggle) nav.insertBefore(btn, toggle); else nav.appendChild(btn);
    }

    // Overlay (construit une seule fois)
    const modal = document.createElement("div");
    modal.className = "search-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-label", "Recherche");
    modal.hidden = true;
    modal.innerHTML = `
      <div class="search-modal__backdrop" data-search-close></div>
      <div class="search-modal__panel">
        <div class="search-modal__bar">
          <svg class="search-modal__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.6-3.6"/></svg>
          <input type="search" class="search-modal__input" placeholder="Rechercher un article…" aria-label="Rechercher" aria-controls="js-search-results" autocomplete="off" autocapitalize="off" spellcheck="false" />
          <button type="button" class="search-modal__close" data-search-close aria-label="Fermer la recherche">Échap</button>
        </div>
        <div class="search-modal__results" id="js-search-results" role="listbox" aria-label="Résultats"></div>
      </div>`;
    document.body.appendChild(modal);

    const input = $(".search-modal__input", modal);
    const results = $("#js-search-results", modal);
    let lastFocus = null, sel = -1;

    const rows = () => $$(".search-result", results);
    function setSel(i) {
      const r = rows();
      if (!r.length) { sel = -1; return; }
      sel = (i + r.length) % r.length;
      r.forEach((el, k) => el.classList.toggle("is-sel", k === sel));
      r[sel].scrollIntoView({ block: "nearest" });
    }

    function render() {
      const q = input.value;
      const tokens = norm(q).trim().split(/\s+/).filter(Boolean);
      sel = -1;
      if (!ARTICLES.length) {
        results.innerHTML = `<p class="search-msg">Aucun article publié pour l'instant. La recherche s'activera dès la première publication.</p>`;
        return;
      }
      if (!tokens.length) {
        const recent = [...ARTICLES].sort(byDateDesc).slice(0, 5);
        results.innerHTML = `<p class="search-msg">Tapez pour rechercher parmi ${ARTICLES.length} article${ARTICLES.length > 1 ? "s" : ""}.<span class="search-msg__hint">Articles récents</span></p>` + recent.map((a) => resultRow(a, [])).join("");
        return;
      }
      const hits = searchArticles(q);
      results.innerHTML = hits.length
        ? `<p class="search-count">${hits.length} résultat${hits.length > 1 ? "s" : ""}</p>` + hits.map((a) => resultRow(a, tokens)).join("")
        : `<p class="search-msg">Aucun résultat pour « ${escapeHTML(q.trim())} ».</p>`;
    }

    function open() {
      lastFocus = document.activeElement;
      modal.hidden = false;
      document.documentElement.classList.add("search-open");
      render();
      requestAnimationFrame(() => { modal.classList.add("is-open"); input.focus(); });
    }
    function close() {
      modal.classList.remove("is-open");
      document.documentElement.classList.remove("search-open");
      setTimeout(() => { modal.hidden = true; }, 250);
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    document.addEventListener("click", (e) => {
      if (e.target.closest("[data-search-open]")) { e.preventDefault(); open(); }
      else if (e.target.closest("[data-search-close]")) { e.preventDefault(); close(); }
    });

    input.addEventListener("input", render);
    input.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") { e.preventDefault(); setSel(sel + 1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setSel(sel - 1); }
      else if (e.key === "Enter") {
        const r = rows();
        const target = (sel >= 0 && r[sel]) || r[0];
        if (target) { e.preventDefault(); window.location.href = target.getAttribute("href"); }
      }
    });

    // Raccourcis : Échap ferme ; Ctrl/⌘+K bascule ; « / » ouvre
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !modal.hidden) { e.preventDefault(); close(); return; }
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName || "") || e.target.isContentEditable;
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) { e.preventDefault(); modal.hidden ? open() : close(); }
      else if (e.key === "/" && !e.metaKey && !e.ctrlKey && !e.altKey && !typing && modal.hidden) { e.preventDefault(); open(); }
    });

    // Piège à focus minimal : Tab reste dans le panneau
    modal.addEventListener("keydown", (e) => {
      if (e.key !== "Tab") return;
      const f = [input].concat(rows(), [$(".search-modal__close", modal)]).filter(Boolean);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  /* ---- Partage d'article ---------------------------------------------- */
  function slugify(s) {
    return "sec-" + deburr(String(s)).toLowerCase()
      .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 48);
  }

  const SHARE_ICONS = {
    native: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/></svg>`,
    wa: `<svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22c5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2zm5.52 12.99c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.17-.47-.29z"/></svg>`,
    x: `<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
    fb: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z"/></svg>`,
    link: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
  };

  function shareHTML(a, url) {
    const u = encodeURIComponent(url);
    const t = encodeURIComponent(a.title);
    return `<div class="share">
      <span class="share__label">Partager</span>
      <div class="share__btns">
        <button type="button" class="share__btn" data-share-native hidden>${SHARE_ICONS.native}<span>Partager</span></button>
        <a class="share__btn" href="https://wa.me/?text=${t}%20${u}" target="_blank" rel="noopener" aria-label="Partager sur WhatsApp">${SHARE_ICONS.wa}</a>
        <a class="share__btn" href="https://twitter.com/intent/tweet?text=${t}&url=${u}" target="_blank" rel="noopener" aria-label="Partager sur X">${SHARE_ICONS.x}</a>
        <a class="share__btn" href="https://www.facebook.com/sharer/sharer.php?u=${u}" target="_blank" rel="noopener" aria-label="Partager sur Facebook">${SHARE_ICONS.fb}</a>
        <button type="button" class="share__btn" data-share-copy data-url="${escapeHTML(url)}">${SHARE_ICONS.link}<span>Copier le lien</span></button>
      </div>
    </div>`;
  }

  function initArticleShare(a, url) {
    const nativeBtn = $("[data-share-native]");
    if (nativeBtn && navigator.share) {
      nativeBtn.hidden = false;
      nativeBtn.addEventListener("click", () => {
        navigator.share({ title: a.title, text: a.title, url: url }).catch(() => {});
      });
    }
    const copyBtn = $("[data-share-copy]");
    if (copyBtn) {
      copyBtn.addEventListener("click", () => {
        const label = copyBtn.querySelector("span");
        const prev = label ? label.textContent : "";
        const flash = () => {
          copyBtn.classList.add("is-copied");
          if (label) label.textContent = "Lien copié !";
          setTimeout(() => { copyBtn.classList.remove("is-copied"); if (label) label.textContent = prev; }, 1800);
        };
        const fallback = () => {
          const ta = document.createElement("textarea");
          ta.value = url; ta.style.position = "fixed"; ta.style.opacity = "0";
          document.body.appendChild(ta); ta.focus(); ta.select();
          try { document.execCommand("copy"); flash(); } catch (e) {}
          document.body.removeChild(ta);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(url).then(flash).catch(fallback);
        } else { fallback(); }
      });
    }
  }

  /* ---- Écouter l'article (synthèse vocale du navigateur) -------------- */
  function listenHTML() {
    return `<button type="button" class="listen-btn" data-listen hidden aria-label="Écouter l'article à voix haute">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-5a9 9 0 0 1 18 0v5"/><path d="M18 19a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1zM6 19a2 2 0 0 1-2-2v-1a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1z"/></svg>
      <span data-listen-label>Écouter</span>
    </button>`;
  }

  function articleSpeechChunks(a) {
    const raw = [a.title, a.excerpt];
    (a.body || []).forEach((b) => {
      if (b.t === "list") { (b.x || []).forEach((li) => raw.push(li)); }
      else if (typeof b.x === "string") { raw.push(b.x); }
    });
    // Découpage en phrases courtes : évite les coupures des navigateurs sur
    // les longues énonciations, et permet une lecture plus fluide.
    const out = [];
    raw.filter(Boolean).forEach((s) => {
      String(s).split(/(?<=[.!?…])\s+/).forEach((seg) => {
        const t = seg.trim();
        if (t) out.push(t);
      });
    });
    return out;
  }

  function initListen(a) {
    const btn = $("[data-listen]");
    if (!btn) return;
    const synth = window.speechSynthesis;
    if (!synth || typeof SpeechSynthesisUtterance === "undefined") return; // non supporté : reste caché
    btn.hidden = false;

    const label = btn.querySelector("[data-listen-label]");
    const setLabel = (t) => { if (label) label.textContent = t; };
    const chunks = articleSpeechChunks(a);
    let state = "idle"; // idle | playing | paused

    const frVoice = () => {
      const vs = synth.getVoices() || [];
      return vs.find((v) => /^fr(-|_|$)/i.test(v.lang)) || vs.find((v) => /fr/i.test(v.lang)) || null;
    };
    const reset = () => { state = "idle"; btn.classList.remove("is-playing"); setLabel("Écouter"); };

    function speakAll() {
      synth.cancel();
      const voice = frVoice();
      chunks.forEach((text, i) => {
        const u = new SpeechSynthesisUtterance(text);
        u.lang = "fr-FR";
        if (voice) u.voice = voice;
        if (i === chunks.length - 1) u.onend = reset;
        synth.speak(u);
      });
    }

    btn.addEventListener("click", () => {
      if (state === "idle") { speakAll(); state = "playing"; btn.classList.add("is-playing"); setLabel("Pause"); }
      else if (state === "playing") { synth.pause(); state = "paused"; setLabel("Reprendre"); }
      else { synth.resume(); state = "playing"; setLabel("Pause"); }
    });

    // Couper la lecture quand on quitte la page
    ["pagehide", "beforeunload"].forEach((ev) => window.addEventListener(ev, () => synth.cancel()));
  }

  /* ---- Bascule de thème (clair / sombre) ------------------------------ */
  function initTheme() {
    const KEY = "lrc-theme";
    const root = document.documentElement;
    const meta = document.querySelector('meta[name="theme-color"]');
    const apply = (t) => {
      root.setAttribute("data-theme", t);
      if (meta) meta.setAttribute("content", t === "dark" ? "#0f131b" : "#16273f");
    };
    // Le thème initial est déjà posé par le script en <head> ; on s'aligne.
    apply(root.getAttribute("data-theme") === "dark" ? "dark" : "light");

    const nav = $(".nav");
    if (!nav || $(".theme-toggle")) return;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "theme-toggle";
    btn.setAttribute("aria-label", "Basculer entre le thème clair et sombre");
    btn.innerHTML =
      `<svg class="icon-moon" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>` +
      `<svg class="icon-sun" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M6.3 17.7l-1.4 1.4M19.1 4.9l-1.4 1.4"/></svg>`;
    nav.insertBefore(btn, $(".nav__search") || $(".nav__toggle") || null);
    btn.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      apply(next);
      try { localStorage.setItem(KEY, next); } catch (e) {}
    });
  }

  /* ---- Aides à la lecture (progression + retour en haut) -------------- */
  function initReadingAids() {
    const article = $("#js-article");
    let bar = null;
    if (article) {
      bar = document.createElement("div");
      bar.className = "read-progress";
      bar.setAttribute("aria-hidden", "true");
      document.body.appendChild(bar);
    }
    const top = document.createElement("button");
    top.type = "button";
    top.className = "to-top";
    top.setAttribute("aria-label", "Revenir en haut de la page");
    top.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>`;
    document.body.appendChild(top);
    top.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
    });

    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop;
      if (bar) {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = (h > 0 ? Math.min(100, Math.max(0, (y / h) * 100)) : 0) + "%";
      }
      top.classList.toggle("is-visible", y > 600);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
  }

  /* ---- Boot ----------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", () => {
    initChrome();
    initTheme();
    initSearch();
    initReadingAids();
    renderHome();
    renderNews();
    renderArticle();
    renderPortfolio();
    observeReveals();
  });

  /* ---- Désinstallation de l'ancien service worker --------------------
     La lecture hors-ligne a été retirée : on désinstalle le service worker
     et on vide son cache, pour que les mises à jour du site apparaissent
     immédiatement (fini le « recharger deux fois »).                      */
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistrations()
      .then((regs) => regs.forEach((r) => r.unregister()))
      .catch(() => {});
  }
  if (window.caches && caches.keys) {
    caches.keys().then((keys) => keys.forEach((k) => caches.delete(k))).catch(() => {});
  }
})();
