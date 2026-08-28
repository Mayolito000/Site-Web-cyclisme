/* =========================================================================
   La Revue Cycliste — Base d'articles
   -------------------------------------------------------------------------
   POUR AJOUTER UN ARTICLE : ajoute un objet dans le tableau ARTICLES plus bas
   (un modèle prêt à copier est fourni juste au-dessus du tableau).
   Champs :
     id         : identifiant unique dans l'URL (ex. article.html?id=mon-article)
     title      : titre
     category   : (FACULTATIF) rubrique de l'article. Laissez vide : il n'y a
                    pas de rubriques pour l'instant. Pour en réintroduire,
                    remplissez le tableau CATEGORIES ci-dessous.
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

// Pas de rubriques pour l'instant. Pour en ajouter, listez-les ici
// (ex. ["Tactique", "Matériel"]) : le filtre par rubrique réapparaîtra.
const CATEGORIES = [];

// -------------------------------------------------------------------------
// MODÈLE À COPIER dans le tableau ARTICLES ci-dessous :
//
//   {
//     id: "mon-premier-article",
//     title: "Titre de mon premier article",
//     category: "Tactique",
//     excerpt: "Un résumé en une ou deux phrases pour donner envie de lire.",
//     author: "Mayolito",
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
  {
    id: "pogacar-tue-lamour-du-cyclisme",
    title: "Pogačar, tue-l’amour du cyclisme ?",
    category: "",
    excerpt: "Cinq Tours de France et une domination presque sans faille. La suprématie de Tadej Pogačar est-elle en train d’user le cyclisme, ou son public en redemande-t-il malgré tout ?",
    author: "Mayolito",
    date: "2026-08-26",
    readingTime: 6,
    featured: true,
    portfolio: true,
    tone: "ink",
    image: "assets/img/pogacar-une.jpg",
    shareImage: "assets/img/pogacar-partage.jpg",
    imageAlt: "Tadej Pogačar en maillot arc-en-ciel de champion du monde",
    imageCredit: "Photo : Tugay Yurdasucu · Pexels",
    body: [
      { t: "p", x: "Après avoir remporté sans grande difficulté et sans surprise le Tour de France 2026 devant son dauphin Remco Evenepoel, avec 6 minutes et 26 secondes d’avance, Tadej Pogačar s’est adjugé un cinquième Tour de France, entrant par la même occasion dans le cercle très fermé des quintuples vainqueurs du maillot jaune (seuls Anquetil, Merckx, Hinault et Indurain l’ont fait avant lui). Pogačar entre ainsi encore un peu plus dans la légende du cyclisme. Pourtant, sa domination, d’une ampleur rare, pourrait bien nuire au cyclisme. Pogačar est-il un tue-l’amour du cyclisme ?" },

      { t: "h2", x: "Pogačar, seul au sommet" },
      { t: "p", x: "Tadej Pogačar n’a de cesse d’agrandir son palmarès, année après année. Alors que la primavera lui résistait encore, il s’est retiré cette épine du pied en début d’année." },
      { t: "p", x: "Seule Paris-Roubaix est la course majeure qui lui résiste encore, malgré deux deuxièmes places sur les deux dernières éditions, battu en 2026 au sprint par Wout Van Aert. Hormis Paris-Roubaix, Pogačar a remporté toutes les courses qu’il voulait, voire certaines à plusieurs reprises, devenant par exemple recordman du nombre de victoires sur le Tour de Lombardie avec cinq succès." },
      { t: "p", x: "Le coureur slovène domine largement son sport. En 2025, il n’a couru que 50 jours et a pourtant décroché 20 victoires, soit un taux de réussite exceptionnel de 40 %. Le Slovène règne aussi sur les records d’ascension. Le dernier en date est sans doute l’un des plus marquants : il a gravi les 21 virages de l’Alpe d’Huez en 35 minutes et 27 secondes, effaçant le record que Marco Pantani détenait depuis 1995 avec 36 minutes et 50 secondes, à une époque où le dopage était largement répandu." },
      { t: "image", src: "assets/img/pogacar-chrono.jpg", alt: "Tadej Pogačar en maillot jaune, en position aérodynamique sur son vélo de contre-la-montre", caption: "Pogačar lors du contre-la-montre du Tour de France 2026.", credit: "Denismenchov08", creditUrl: "https://commons.wikimedia.org/wiki/File:TADEJ_POGACAR.png", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/" },

      { t: "h2", x: "Un désamour qui progresse" },
      { t: "p", x: "Cette ultra-domination de Pogačar commence à susciter un désamour chez les suiveurs. Il laisse parfois un sentiment d’hyperpuissance où rien ne lui résiste, jusqu’à donner l’impression de laisser gagner son adversaire Remco Evenepoel lors de la 15e étape, tellement il était sûr de sa force." },
      { t: "image", src: "assets/img/pogacar-depart.jpg", alt: "Pogačar en maillot jaune sur la ligne de départ, aux côtés d’un coéquipier en maillot blanc, au milieu du peloton", caption: "Sur la ligne de départ, aux côtés de son coéquipier en maillot blanc.", credit: "Florian Pépellin", creditUrl: "https://commons.wikimedia.org/wiki/File:17e_étape_Tour_de_France_2026_-_Maillots_Ligne_de_départ_Chambéry.JPG", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/" },
      { t: "p", x: "Si une telle domination finit par en dégoûter certains, c’est que Pogačar gagne, certes, mais qu’il gagne sans montrer le moindre signe de difficulté et sans réelle concurrence. Il est seul au sommet de son sport. Même Vingegaard, qui pouvait encore l’embêter il y a quelques années, semblait loin de pouvoir le concurrencer avant sa chute lors de la 15e étape du Tour." },
      { t: "p", x: "Ce qui est frustrant dans sa domination, c’est l’absence de marque de fatigue. Il semble frais toute l’année, et s’est même offert le luxe de se fondre en équipier pour assurer le podium de son coéquipier Isaac Del Toro à l’arrivée du Tour. Cette suprématie entraîne une lassitude chez certains suiveurs, qui estiment que cette hégémonie nuit au sport et rappelle parfois ses pires époques." },
      { t: "p", x: "Ce qui est d’autant plus frustrant, c’est qu’il donne l’impression de pouvoir gagner sur tous les terrains. Seuls les sprints massifs restent véritablement hors de portée. Mais il ne devrait pas tarder à décrocher Paris-Roubaix, surtout s’il en fait un objectif majeur dans les saisons à venir." },
      { t: "p", x: "Le véritable problème, c’est que Pogačar tue le suspense des courses auxquelles il participe, là où c’était justement ce qui faisait l’essence des courses cyclistes. Lorsqu’il annonce vouloir gagner une course ou une étape, il met tout en œuvre pour y parvenir, tuant dans l’œuf toute autre tentative et n’hésitant pas à user ses coéquipiers autant que nécessaire. Aujourd’hui, quand Pogačar présente son programme, on sait déjà qu’il va gagner, et ses adversaires savent comment organiser leur calendrier en conséquence." },
      { t: "pull", q: "Quand Pogačar présente son programme, on sait déjà qu’il va gagner." },
      { t: "p", x: "Les organisateurs ont bien tenté de préserver un peu de suspense. Lors de la présentation du parcours, en octobre dernier, le directeur du Tour Christian Prudhomme avait prévenu :" },
      { t: "quote", x: "« L’année prochaine, à 48 heures de l’arrivée finale, je ne pense pas qu’on pourra dire que ce sera fait, quels que soient les écarts. Ce Tour est bâti pour aller crescendo. »", by: "Christian Prudhomme, directeur du Tour de France" },
      { t: "p", x: "Le suspense aura finalement été de courte durée. Pogačar a endossé la tunique jaune dès la 6e étape et n’a cessé de creuser les écarts tout au long de la course. Il aura fallu attendre l’ultime étape pour ressentir les premiers vrais frissons, lors du duel épique entre Mathieu van der Poel et Pogačar dans les trois montées successives de la Butte Montmartre, et la victoire du Néerlandais." },
      { t: "image", src: "assets/img/pogacar-montmartre.jpg", alt: "Pogačar en maillot jaune dans la montée pavée de la Butte Montmartre, entouré d’une foule de spectateurs", caption: "Dans la Butte Montmartre, lors de la dernière étape du Tour 2026.", credit: "Kiril Simeonovski", creditUrl: "https://commons.wikimedia.org/wiki/File:Tadej_Pogačar_at_2026_Tour_de_France_(Stage_21).jpg", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/" },

      { t: "h2", x: "Pourtant des audiences records" },
      { t: "p", x: "Même s’il a manqué de suspense, ce Tour de France a été le plus regardé de l’histoire en France. France Télévisions a annoncé un record de 45,6 millions de téléspectateurs pour l’édition 2026, soit 600 000 de plus que l’année précédente. Surtout, les audiences n’ont cessé d’augmenter depuis 2024 et ses 41 millions de téléspectateurs." },
      { t: "p", x: "Alors qu’une telle domination pourrait laisser penser que le public se lasse ou boude la compétition, c’est l’inverse qui se produit. En 2025 comme en 2026, les pics d’audience ont été observés lors de la dernière étape, sur les Champs-Élysées, là où l’incertitude était la plus forte. Ce que le public valorise, c’est le spectacle et l’inattendu." },

      { t: "h2", x: "Mais alors pourquoi on regarde encore ?" },
      { t: "p", x: "Si Pogačar emporte tout sur son passage, cela n’empêche pas le public de s’intéresser au vélo et de continuer à regarder. Comme on l’a vu récemment, si la course pour la première place est souvent pliée d’avance, une surprise derrière reste toujours possible." },
      { t: "p", x: "Ce qui fait aussi la beauté de ce sport, c’est que, même quand on ne regarde pas pour la victoire, il y a toujours autre chose à suivre. Qui sait ce qui peut se passer au cours d’une course cycliste ? Quand tout paraît écrit, il reste toujours une part d’incertitude." },
      { t: "p", x: "Les duels derrière Pogačar sont d’ailleurs souvent plus intéressants que la bagarre pour la première place, comme l’a montré la lutte à trois entre Del Toro, Evenepoel et Seixas. Et c’est ce dernier, le Français Paul Seixas, qui permet de garder la télévision allumée chez les supporters tricolores." },
      { t: "image", src: "assets/img/pogacar-podium.jpg", alt: "Le podium du championnat d’Europe 2025 : Evenepoel, Pogačar et Seixas, médailles autour du cou", caption: "Le podium du championnat d’Europe 2025 : Evenepoel (argent), Pogačar (or) et Seixas (bronze).", credit: "Kakoula10", creditUrl: "https://commons.wikimedia.org/wiki/File:Pogacar_-_Evenepoel_-_Seixas_-_podium_-_2025_European_road_championship.jpg", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/" },
      { t: "p", x: "Ce sont aussi les classements annexes qui donnent envie de continuer à regarder. La lutte à distance entre Valentin Paret-Peintre, Tadej Pogačar et Richard Carapaz aura assuré du spectacle tout au long de la grande boucle. Il en va de même pour le maillot vert du meilleur sprinteur, et pour la combativité d’un Mads Pedersen, qui a entretenu l’intérêt de la course." },
      { t: "p", x: "Pogačar domine sur presque tous les terrains, sans concurrence assez forte pour le gêner. Seules Paris-Roubaix et la Vuelta manquent encore à son palmarès parmi les grandes courses. Pour la première, il devra réessayer l’an prochain. Pour la seconde, l’édition 2026 ne devrait pas beaucoup lui résister, sauf si la fatigue accumulée depuis le début de saison finit par le rattraper. Réponse le 13 septembre !" },
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
