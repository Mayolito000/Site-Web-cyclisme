# La Flamme Rouge — site d'actualité cycliste & portfolio

Site web statique dédié à l'actualité cycliste, servant aussi de **portfolio de journaliste**.
Aucune dépendance, aucun build : du HTML, du CSS et un peu de JavaScript. Il se déploie
gratuitement sur **GitHub Pages**.

> **Nom & identité** : le site s'appelle « La Flamme Rouge » (le fanion du dernier
> kilomètre). Tu peux tout renommer en une minute — voir *Personnaliser* plus bas.

---

## 🚴 Aperçu

- **Accueil** (`index.html`) — une à la une + les derniers articles.
- **Actualités** (`actualites.html`) — tous les articles, avec filtres par rubrique.
- **Article** (`article.html?id=…`) — page de lecture générée automatiquement.
- **Portfolio** (`portfolio.html`) — présentation, articles sélectionnés, contact.

Les vignettes des articles sont **générées automatiquement** (dessins SVG) :
aucune image à fournir pour démarrer. Tu peux les remplacer plus tard si tu veux.

---

## ✍️ Ajouter ou modifier un article

Tout le contenu vit dans **un seul fichier** : `assets/js/articles.js`.

Pour ajouter un article, copie un bloc existant dans le tableau `ARTICLES` et adapte les champs :

```js
{
  id: "mon-nouvel-article",          // identifiant unique (apparaît dans l'URL)
  title: "Titre de l'article",
  category: "Tactique",              // doit exister dans CATEGORIES
  excerpt: "Résumé en deux phrases.",
  author: "Mayeul",
  date: "2026-08-03",                // format AAAA-MM-JJ
  readingTime: 6,                    // minutes
  featured: false,                   // true = mise en avant sur l'accueil
  portfolio: true,                   // true = affiché dans le portfolio
  tone: "red",                       // couleur de la vignette : red | gold | ink | slate | sky
  body: [
    { t: "p",     x: "Un paragraphe." },
    { t: "h2",    x: "Un sous-titre" },
    { t: "quote", x: "Une citation marquante." },
    { t: "list",  x: ["premier point", "deuxième point"] },
  ],
},
```

C'est tout : l'article apparaît automatiquement sur l'accueil, dans les actualités,
et dans les articles liés. Le contenu livré est un **exemple** à remplacer par tes vrais articles.

---

## 🎨 Personnaliser

| Ce que tu veux changer            | Où                                                        |
|-----------------------------------|-----------------------------------------------------------|
| Nom du site, tagline, e-mail      | objet `SITE` en haut de `assets/js/articles.js`           |
| Les rubriques                     | tableau `CATEGORIES` dans `assets/js/articles.js`         |
| Couleurs, typographie, style      | variables `:root` en haut de `assets/css/style.css`       |
| Textes de la page portfolio / bio | `portfolio.html`                                          |
| Textes de la page d'accueil       | `index.html`                                              |

L'e-mail de contact est repris automatiquement partout depuis `SITE.email`.

---

## 🌍 Mettre le site en ligne (GitHub Pages)

Le dépôt contient déjà un workflow de déploiement (`.github/workflows/deploy.yml`).

1. Fusionne cette branche dans `main` (ou pousse le contenu sur `main`).
2. Sur GitHub : **Settings → Pages**.
3. Dans **Build and deployment → Source**, choisis **GitHub Actions**.
4. Le site se publie automatiquement à chaque push sur `main`.

L'adresse sera de la forme :
`https://<ton-utilisateur>.github.io/<nom-du-depot>/`

> Astuce : pour une URL plus courte, tu peux ajouter un domaine personnalisé
> dans Settings → Pages (champ *Custom domain*).

---

## 🔧 Prévisualiser en local

Ouvre simplement `index.html` dans ton navigateur, ou lance un petit serveur :

```bash
# Python
python3 -m http.server 8000
# puis ouvre http://localhost:8000
```

---

## 📁 Structure

```
.
├── index.html          # Accueil
├── actualites.html     # Liste des articles + filtres
├── article.html        # Gabarit de lecture d'un article
├── portfolio.html      # Portfolio / à propos / contact
├── 404.html            # Page d'erreur
├── assets/
│   ├── css/style.css   # Tout le style (design system)
│   └── js/
│       ├── articles.js # ← Le contenu (articles, rubriques, infos du site)
│       └── main.js     # Rendu, filtres, navigation
├── .github/workflows/deploy.yml   # Déploiement GitHub Pages
└── .nojekyll
```

---

Réalisé pour Mayeul. Bonne route ! 🚴‍♂️
