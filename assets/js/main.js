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
      articleSection: a.category,
      image: img,
      author: { "@type": "Organization", name: SITE.name, url: base },
      publisher: {
        "@type": "Organization", name: SITE.name, url: base,
        logo: { "@type": "ImageObject", url: base + "assets/img/og-image.png" },
      },
      mainEntityOfPage: { "@type": "WebPage", "@id": artUrl },
    };
    let ldEl = document.getElementById("js-article-ld");
    if (!ldEl) {
      ldEl = document.createElement("script");
      ldEl.type = "application/ld+json";
      ldEl.id = "js-article-ld";
      document.head.appendChild(ldEl);
    }
    ldEl.textContent = JSON.stringify(ld);

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

    // Section commentaires
    renderComments(a);

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
          <input type="search" class="search-modal__input" placeholder="Rechercher un article, une rubrique…" aria-label="Rechercher" aria-controls="js-search-results" autocomplete="off" autocapitalize="off" spellcheck="false" />
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

  /* ---- Boot ----------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", () => {
    initChrome();
    initSearch();
    renderHome();
    renderNews();
    renderArticle();
    renderPortfolio();
    observeReveals();
  });
})();
