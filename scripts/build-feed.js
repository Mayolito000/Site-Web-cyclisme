#!/usr/bin/env node
/* =========================================================================
   La Revue Cycliste — Générateur de flux RSS
   -------------------------------------------------------------------------
   Lit la base d'articles (assets/js/articles.js) et écrit un flux RSS 2.0
   valide dans feed.xml, à la racine du site (https://larevuecycliste.fr/feed.xml).

   Usage :  node scripts/build-feed.js
   Le flux est régénéré automatiquement par GitHub Actions à chaque
   modification de articles.js — aucune action manuelle nécessaire.
   ========================================================================= */
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");
const SITE_URL = "https://larevuecycliste.fr/";
const ARTICLES_JS = path.join(ROOT, "assets", "js", "articles.js");
const OUTPUT = path.join(ROOT, "feed.xml");

// --- Charge SITE et ARTICLES depuis articles.js (fichier navigateur) --------
// Le fichier se termine par window.SITE = ... ; on lui fournit donc un faux
// objet window pour récupérer les données sans exécuter le reste du site.
function loadData() {
  const src = fs.readFileSync(ARTICLES_JS, "utf8");
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(src, sandbox, { filename: "articles.js" });
  return {
    SITE: sandbox.window.SITE || {},
    ARTICLES: sandbox.window.ARTICLES || [],
  };
}

// --- Échappement XML --------------------------------------------------------
function xml(str) {
  return String(str == null ? "" : str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// --- Date "AAAA-MM-JJ" -> format RFC-822 (requis par RSS) --------------------
function rfc822(dateStr) {
  // Heure fixée à 08:00 UTC : les articles n'ont qu'une date, pas d'heure.
  const d = new Date((dateStr || "") + "T08:00:00Z");
  return isNaN(d.getTime()) ? new Date().toUTCString() : d.toUTCString();
}

function articleUrl(a) {
  return SITE_URL + "article.html?id=" + encodeURIComponent(a.id);
}

function buildFeed() {
  const { SITE, ARTICLES } = loadData();
  const name = SITE.name || "La Revue Cycliste";
  const desc =
    "Un site sur le cyclisme, écrit par passion du vélo.";

  const items = [...ARTICLES]
    .filter((a) => a && a.id && a.title)
    .sort((a, b) => String(b.date).localeCompare(String(a.date)));

  // Date du dernier article. Quand le flux est vide, on fige la date de
  // lancement plutôt que l'heure courante : sinon le flux changerait à
  // chaque régénération et le robot committerait inutilement.
  const LAUNCH = "Mon, 04 Aug 2026 08:00:00 GMT";
  const lastBuild = items.length ? rfc822(items[0].date) : LAUNCH;

  const itemXml = items
    .map((a) => {
      const url = articleUrl(a);
      const cat = a.category ? `\n      <category>${xml(a.category)}</category>` : "";
      const author = a.author || SITE.author || name;
      return `    <item>
      <title>${xml(a.title)}</title>
      <link>${xml(url)}</link>
      <guid isPermaLink="true">${xml(url)}</guid>
      <pubDate>${rfc822(a.date)}</pubDate>
      <dc:creator>${xml(author)}</dc:creator>${cat}
      <description>${xml(a.excerpt || "")}</description>
    </item>`;
    })
    .join("\n");

  const body = items.length ? "\n" + itemXml + "\n  " : "\n  ";

  return `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/feed.xsl"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${xml(name)}</title>
    <link>${xml(SITE_URL)}</link>
    <atom:link href="${xml(SITE_URL)}feed.xml" rel="self" type="application/rss+xml" />
    <description>${xml(desc)}</description>
    <language>fr-FR</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <generator>build-feed.js (La Revue Cycliste)</generator>${body}</channel>
</rss>
`;
}

const feed = buildFeed();
fs.writeFileSync(OUTPUT, feed, "utf8");
const count = (feed.match(/<item>/g) || []).length;
console.log(`feed.xml généré — ${count} article(s).`);
