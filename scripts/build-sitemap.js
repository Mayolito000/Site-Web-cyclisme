#!/usr/bin/env node
/* =========================================================================
   La Revue Cycliste — Générateur de plan de site (sitemap.xml)
   -------------------------------------------------------------------------
   Lit la base d'articles (assets/js/articles.js) et écrit un sitemap.xml
   valide à la racine du site, incluant les pages fixes ET chaque article.

   Usage :  node scripts/build-sitemap.js
   Régénéré automatiquement par GitHub Actions à chaque modification de
   articles.js — aucune action manuelle nécessaire.
   ========================================================================= */
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");
const SITE_URL = "https://larevuecycliste.fr/";
const ARTICLES_JS = path.join(ROOT, "assets", "js", "articles.js");
const OUTPUT = path.join(ROOT, "sitemap.xml");

function loadArticles() {
  const src = fs.readFileSync(ARTICLES_JS, "utf8");
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(src, sandbox, { filename: "articles.js" });
  return (sandbox.window.ARTICLES || []).filter((a) => a && a.id);
}

function xml(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

function urlEntry(loc, o) {
  let e = "  <url>\n    <loc>" + xml(loc) + "</loc>\n";
  if (o.lastmod) e += "    <lastmod>" + o.lastmod + "</lastmod>\n";
  if (o.changefreq) e += "    <changefreq>" + o.changefreq + "</changefreq>\n";
  if (o.priority) e += "    <priority>" + o.priority + "</priority>\n";
  return e + "  </url>";
}

function build(articles) {
  // Tri anti-chronologique ; la date la plus récente sert de lastmod aux
  // pages de liste (elles changent quand un article paraît). Vide → pas de
  // lastmod, pour rester déterministe (pas de commit inutile du robot).
  const sorted = [...articles].sort((a, b) => String(b.date).localeCompare(String(a.date)));
  const newest = sorted.length ? sorted[0].date : null;

  const entries = [
    urlEntry(SITE_URL, { lastmod: newest, changefreq: "weekly", priority: "1.0" }),
    urlEntry(SITE_URL + "actualites.html", { lastmod: newest, changefreq: "weekly", priority: "0.8" }),
    urlEntry(SITE_URL + "portfolio.html", { lastmod: newest, changefreq: "monthly", priority: "0.6" }),
    urlEntry(SITE_URL + "a-propos.html", { changefreq: "yearly", priority: "0.5" }),
    urlEntry(SITE_URL + "liens.html", { changefreq: "yearly", priority: "0.4" }),
  ];
  for (const a of sorted) {
    entries.push(urlEntry(SITE_URL + "article.html?id=" + encodeURIComponent(a.id),
      { lastmod: a.date, changefreq: "monthly", priority: "0.7" }));
  }

  return `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    entries.join("\n") + `\n</urlset>\n`;
}

const articles = loadArticles();
fs.writeFileSync(OUTPUT, build(articles), "utf8");
console.log(`sitemap.xml généré — pages fixes + ${articles.length} article(s).`);
