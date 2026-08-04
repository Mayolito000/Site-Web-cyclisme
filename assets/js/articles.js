/* =========================================================================
   La Revue Cycliste — Base d'articles
   -------------------------------------------------------------------------
   POUR AJOUTER UN ARTICLE : ajoute un objet dans le tableau ARTICLES plus bas
   (un modèle prêt à copier est fourni juste au-dessus du tableau).
   Champs :
     id         : identifiant unique dans l'URL (ex. article.html?id=mon-article)
     title      : titre
     category   : rubrique (doit exister dans CATEGORIES plus bas)
     excerpt    : chapô / résumé court (2 phrases)
     author     : auteur
     date       : "AAAA-MM-JJ"
     readingTime: minutes de lecture (nombre)
     featured   : true pour la une de l'accueil (un seul de préférence)
     portfolio  : true pour l'afficher dans la page Portfolio
     tone       : couleur de la vignette illustrée — "red" | "gold" | "ink" | "slate" | "sky"
     image      : (FACULTATIF) photo de l'article. Chemin local ou URL.
                    - fichier local : "assets/img/mon-article.jpg"
                    - lien direct   : "https://.../photo.jpg" (ex. Unsplash, libre de droit)
                  Si l'image manque ou ne charge pas, l'illustration colorée
                  s'affiche automatiquement à la place (jamais d'image cassée).
     body       : contenu, tableau de blocs :
                    { t:"p",  x:"paragraphe" }
                    { t:"h2", x:"sous-titre" }
                    { t:"quote", x:"citation" }
                    { t:"list", x:["point 1","point 2"] }
   Tant que le tableau ARTICLES est vide, le site affiche un état « à venir ».
   ========================================================================= */

const SITE = {
  name: "La Revue Cycliste",
  tagline: "Toute l'actualité du cyclisme.",
  author: "La rédaction",
  role: "Revue d'actualité cycliste",
  email: "larevuecycliste@gmail.com",
  location: "France",
};

const CATEGORIES = [
  "Tendances",
  "Tactique",
  "Matériel",
  "Entraînement",
  "Portraits",
  "Culture",
];

// -------------------------------------------------------------------------
// MODÈLE À COPIER dans le tableau ARTICLES ci-dessous :
//
//   {
//     id: "mon-premier-article",
//     title: "Titre de mon premier article",
//     category: "Tactique",
//     excerpt: "Un résumé en une ou deux phrases pour donner envie de lire.",
//     author: "La rédaction",
//     date: "2026-08-03",
//     readingTime: 5,
//     featured: true,
//     portfolio: true,
//     tone: "red",
//     image: "assets/img/mon-premier-article.jpg",
//     body: [
//       { t: "p", x: "Premier paragraphe de l'article." },
//       { t: "h2", x: "Un sous-titre" },
//       { t: "p", x: "La suite du texte." },
//       { t: "quote", x: "Une citation qui marque." },
//       { t: "list", x: ["un point", "un autre point"] },
//     ],
//   },
// -------------------------------------------------------------------------

const ARTICLES = [
  // Ajoute tes articles ici (voir le modèle ci-dessus).
];

/* Exposé globalement pour les autres scripts */
window.SITE = SITE;
window.CATEGORIES = CATEGORIES;
window.ARTICLES = ARTICLES;
