# Photos des articles

Dépose ici tes photos de cyclisme (format `.jpg`, `.webp` ou `.png`).

Pour associer une photo à un article, ouvre `assets/js/articles.js` et ajoute
le champ `image` à l'article concerné :

```js
{
  id: "mon-article",
  title: "…",
  image: "assets/img/mon-article.jpg",   // ← ta photo
  // …
}
```

Tu peux aussi mettre un lien direct vers une photo libre de droit (Unsplash,
Pexels, Wikimedia…) au lieu d'un fichier local :

```js
  image: "https://images.unsplash.com/photo-XXXXXXXX?w=1200&q=80",
```

Si le champ `image` est absent ou si la photo ne se charge pas, une
illustration colorée s'affiche automatiquement — il n'y a jamais d'image cassée.

## Où trouver des photos libres de droit

- **Unsplash** — https://unsplash.com/s/photos/cycling (gratuit, sans attribution)
- **Pexels** — https://www.pexels.com/search/cycling/ (gratuit, sans attribution)
- **Wikimedia Commons** — https://commons.wikimedia.org (vérifie la licence)

Conseil : des images d'environ 1200 px de large, compressées, suffisent et
gardent le site rapide.
