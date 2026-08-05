<?xml version="1.0" encoding="UTF-8"?>
<!--
  La Revue Cycliste — Habillage du flux RSS.
  Ouvert dans un navigateur, feed.xml s'affiche comme une vraie page grâce à
  cette feuille de style XSLT. Les applications de lecture RSS l'ignorent et
  continuent de lire le XML normalement.
-->
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:dc="http://purl.org/dc/elements/1.1/">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/rss/channel">
    <html lang="fr">
    <head>
      <meta charset="UTF-8"/>
      <meta name="viewport" content="width=device-width, initial-scale=1"/>
      <title><xsl:value-of select="title"/> — Flux RSS</title>
      <link rel="stylesheet" href="/assets/css/fonts.css"/>
      <style>
        :root{--bg:#f3ede1;--surface:#fff;--ink:#16273f;--ink-soft:#35435a;--muted:#6d7486;--line:#e3dccd;--accent:#bd4633;--serif:"Fraunces",Georgia,serif;--sans:"Inter",system-ui,-apple-system,sans-serif;--mono:"Space Mono",ui-monospace,monospace}
        @media (prefers-color-scheme:dark){:root{--bg:#0f131b;--surface:#191d27;--ink:#ece5d7;--ink-soft:#c3cad6;--muted:#8b93a3;--line:#2a303c;--accent:#e0715a}}
        *{box-sizing:border-box;margin:0}
        body{background:var(--bg);color:var(--ink);font-family:var(--sans);line-height:1.6;padding:clamp(1.2rem,5vw,3rem) 1.2rem}
        .wrap{max-width:720px;margin:0 auto}
        .brand{display:flex;align-items:center;gap:.7rem;margin-bottom:1.6rem}
        .brand svg{width:44px;height:44px;flex:none}
        .brand b{font-family:var(--serif);font-weight:600;font-size:1.3rem;letter-spacing:-.01em;line-height:1}
        .brand small{display:block;font-family:var(--mono);font-size:.56rem;letter-spacing:.28em;text-transform:uppercase;color:var(--muted);margin-top:3px}
        .tag{display:inline-block;font-family:var(--mono);font-size:.66rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--accent);background:color-mix(in srgb,var(--accent) 12%,transparent);padding:.3rem .6rem;border-radius:6px}
        h1{font-family:var(--serif);font-weight:560;font-size:clamp(1.8rem,6vw,2.6rem);letter-spacing:-.02em;line-height:1.05;margin:.7rem 0 .4rem}
        .lede{color:var(--ink-soft);font-size:1.05rem;max-width:56ch}
        .info{background:var(--surface);border:1px solid var(--line);border-left:3px solid var(--accent);border-radius:10px;padding:1.1rem 1.3rem;margin:1.6rem 0 2.2rem;font-size:.95rem;color:var(--ink-soft)}
        .info b{color:var(--ink)}
        .info code{font-family:var(--mono);font-size:.85em;background:color-mix(in srgb,var(--accent) 10%,transparent);color:var(--accent);padding:.1em .4em;border-radius:5px;word-break:break-all}
        h2{font-family:var(--mono);font-size:.72rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);margin-bottom:1rem}
        ul{list-style:none;padding:0;display:grid;gap:1rem}
        li{background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:1.1rem 1.3rem}
        .cat{font-family:var(--mono);font-size:.62rem;letter-spacing:.1em;text-transform:uppercase;color:var(--accent);margin-bottom:.3rem}
        .t{font-family:var(--serif);font-weight:560;font-size:1.25rem;line-height:1.2;color:var(--ink);text-decoration:none;display:inline-block}
        .t:hover{color:var(--accent)}
        .meta{font-size:.75rem;color:var(--muted);margin:.35rem 0 .5rem}
        li p{color:var(--ink-soft);font-size:.92rem}
        .empty{background:var(--surface);border:1px dashed var(--line);border-radius:12px;padding:2rem;text-align:center;color:var(--muted);font-family:var(--serif);font-size:1.1rem}
        .back{margin-top:2.4rem}
        .back a{color:var(--accent);text-decoration:none;font-weight:500}
        .back a:hover{text-decoration:underline}
      </style>
    </head>
    <body>
      <div class="wrap">
        <div class="brand">
          <svg viewBox="0 0 100 100" fill="none" aria-hidden="true"><circle cx="50" cy="50" r="46" stroke="currentColor" stroke-width="3"/><circle cx="50" cy="50" r="39.5" stroke="currentColor" stroke-width="7" stroke-dasharray="3.4 3.55"/><circle cx="50" cy="50" r="32.5" stroke="currentColor" stroke-width="2.4"/><text x="50" y="50" text-anchor="middle" dominant-baseline="central" font-family="Inter, system-ui, sans-serif" font-weight="800" font-size="26" fill="var(--accent)">LRC</text></svg>
          <span><b><xsl:value-of select="title"/></b><small>Actualité cycliste</small></span>
        </div>

        <span class="tag">Flux RSS</span>
        <h1>Suivez La Revue Cycliste</h1>
        <p class="lede"><xsl:value-of select="description"/></p>

        <div class="info">
          <p>📡 <b>Vous êtes sur le flux RSS du site.</b> Il permet de recevoir automatiquement les nouveaux articles dans une application de lecture (Feedly, Inoreader, etc.), sans réseau social ni newsletter.</p>
          <p style="margin-top:.7rem">Pour vous abonner, copiez cette adresse dans votre lecteur&#160;:<br/>
          <code><xsl:value-of select="atom:link/@href"/></code></p>
        </div>

        <h2>Derniers articles</h2>
        <xsl:choose>
          <xsl:when test="item">
            <ul>
              <xsl:for-each select="item">
                <li>
                  <xsl:if test="category"><div class="cat"><xsl:value-of select="category"/></div></xsl:if>
                  <a class="t" href="{link}"><xsl:value-of select="title"/></a>
                  <div class="meta">
                    <xsl:variable name="d" select="substring(pubDate,6,2)"/>
                    <xsl:variable name="mEn" select="substring(pubDate,9,3)"/>
                    <xsl:variable name="y" select="substring(pubDate,13,4)"/>
                    <xsl:variable name="mFr">
                      <xsl:choose>
                        <xsl:when test="$mEn='Jan'">janvier</xsl:when>
                        <xsl:when test="$mEn='Feb'">février</xsl:when>
                        <xsl:when test="$mEn='Mar'">mars</xsl:when>
                        <xsl:when test="$mEn='Apr'">avril</xsl:when>
                        <xsl:when test="$mEn='May'">mai</xsl:when>
                        <xsl:when test="$mEn='Jun'">juin</xsl:when>
                        <xsl:when test="$mEn='Jul'">juillet</xsl:when>
                        <xsl:when test="$mEn='Aug'">août</xsl:when>
                        <xsl:when test="$mEn='Sep'">septembre</xsl:when>
                        <xsl:when test="$mEn='Oct'">octobre</xsl:when>
                        <xsl:when test="$mEn='Nov'">novembre</xsl:when>
                        <xsl:when test="$mEn='Dec'">décembre</xsl:when>
                      </xsl:choose>
                    </xsl:variable>
                    <xsl:value-of select="concat($d,' ',$mFr,' ',$y)"/>
                  </div>
                  <p><xsl:value-of select="description"/></p>
                </li>
              </xsl:for-each>
            </ul>
          </xsl:when>
          <xsl:otherwise>
            <div class="empty">Les premiers articles arrivent bientôt.</div>
          </xsl:otherwise>
        </xsl:choose>

        <p class="back"><a href="/">← Retour sur larevuecycliste.fr</a></p>
      </div>
    </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
