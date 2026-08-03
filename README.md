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

> ⚠️ **Étape indispensable d'abord : rendre le dépôt public.**
> GitHub Pages n'est gratuit sur un dépôt **privé** qu'avec un abonnement payant.
> Va dans **Settings → General → Danger Zone → Change repository visibility → Public**.
> (Sinon, le site ne sera pas accessible « à tout le monde ».)

Ensuite, deux façons de publier — choisis la plus simple pour toi.

### Option A — La plus simple (déployer depuis la branche)

1. **Settings → Pages**.
2. **Build and deployment → Source** : choisis **Deploy from a branch**.
3. Branche : la branche qui contient le code, dossier **`/ (root)`**. Enregistre.
4. Patiente une minute : le site s'affiche à l'adresse indiquée en haut de la page Pages.

### Option B — Via GitHub Actions (workflow inclus)

Le dépôt contient déjà `.github/workflows/deploy.yml`.

1. **Settings → Pages → Source** : choisis **GitHub Actions**.
2. Le site se redéploie automatiquement à chaque push (le workflow se déclenche
   sur `main` et sur la branche de développement actuelle).

Dans les deux cas, l'adresse ressemble à :
`https://<ton-utilisateur>.github.io/<nom-du-depot>/`

> Astuce : pour une URL plus courte, ajoute un domaine personnalisé dans
> Settings → Pages (champ *Custom domain*).

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
