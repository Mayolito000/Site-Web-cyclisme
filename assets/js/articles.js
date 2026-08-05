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
  // ⚠️ ARTICLE DE TEST — sers-t'en pour explorer le site, puis supprime ce
  //     bloc (et l'image assets/img/article-test.jpg) quand tu veux.
  {
    id: "pourquoi-les-cols-decident-le-tour",
    title: "Pourquoi les cols décident (presque) toujours le Tour",
    category: "Tactique",
    excerpt:
      "En montagne, les écarts se creusent et les stratégies se dévoilent. Petit tour d'horizon de ce qui se joue vraiment quand la route s'élève.",
    author: "La rédaction",
    date: "2026-08-05",
    readingTime: 3,
    featured: true,
    portfolio: true,
    tone: "red",
    image: "assets/img/article-test.jpg",
    body: [
      { t: "p", x: "Sur le plat, le peloton se neutralise : l'aspiration protège, les équipes contrôlent, et les écarts se comptent en secondes. En montagne, tout change. La pente supprime l'abri de l'aspiration, isole les coureurs et transforme chaque coup de pédale en test de vérité. C'est là, presque toujours, que se joue le classement général." },
      { t: "h2", x: "La montagne, ce grand révélateur" },
      { t: "p", x: "Dès que la route s'élève durablement, la vitesse chute et l'aérodynamisme cesse de compter. Reste l'essentiel : le rapport entre la puissance et le poids. Un col long agit comme un révélateur — impossible de se cacher dans les roues, chacun roule à son propre plafond." },
      { t: "h2", x: "Le poids, le rythme et la tête" },
      { t: "p", x: "Gagner en altitude, c'est d'abord une affaire de watts par kilo. Mais la physiologie ne fait pas tout : le placement avant le pied du col, la gestion de l'effort et le sang-froid pèsent tout autant. Une attaque part rarement au hasard." },
      { t: "quote", x: "En montagne, on ne triche pas : la pente dit la vérité sur la forme du jour." },
      { t: "list", x: [
        "Le rapport poids/puissance, déterminant sur les longues ascensions.",
        "Le placement au pied du col, pour ne pas subir le tempo.",
        "La gestion de l'effort, pour ne pas exploser avant le sommet.",
      ] },
      { t: "h2", x: "Ce qu'il faut retenir" },
      { t: "p", x: "Les cols ne récompensent pas seulement le plus fort, mais le plus lucide. C'est ce mélange de puissance, de tactique et de mental qui rend la haute montagne si décisive — et si passionnante à décrypter." },
    ],
  },
];

/* Commentaires (Cusdis) — service gratuit, sans compte pour le lecteur.
   Pour ACTIVER : collez l'App ID fourni par votre tableau de bord Cusdis
   entre les guillemets de `appId`. Tant qu'il est vide, une mention
   « bientôt disponible » s'affiche sous les articles. */
const COMMENTS = {
  enabled: false,   // ← désactivés pour l'instant. Repassez à true pour réactiver.
  host: "https://cusdis.com",
  appId: "72c103d4-ca8e-41a6-be60-a9f633f44a43",
};

/* Exposé globalement pour les autres scripts */
window.SITE = SITE;
window.CATEGORIES = CATEGORIES;
window.ARTICLES = ARTICLES;
window.COMMENTS = COMMENTS;
