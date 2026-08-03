/* =========================================================================
   La Revue Cycliste — Base d'articles
   -------------------------------------------------------------------------
   POUR AJOUTER UN ARTICLE : copie un bloc ci-dessous, change les champs.
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
   Les vignettes sont générées automatiquement (aucune image à fournir).
   Remplace le contenu d'exemple ci-dessous par tes vrais articles.
   ========================================================================= */

const SITE = {
  name: "La Revue Cycliste",
  tagline: "L'actualité cycliste, décryptée.",
  author: "Mayeul",
  role: "Journaliste cycliste",
  email: "mayeulstms@gmail.com",
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

const ARTICLES = [
  {
    id: "gravel-incontournable",
    title: "Le gravel, comment une discipline de niche a conquis le peloton",
    category: "Tendances",
    excerpt: "En quelques saisons, le vélo à gros pneus est passé du garage des bricoleurs aux catalogues des plus grandes marques. Décryptage d'un basculement.",
    author: "Mayeul",
    date: "2026-07-28",
    readingTime: 6,
    featured: true,
    portfolio: true,
    tone: "gold",
    body: [
      { t: "p", x: "Il fut un temps où rouler sur des chemins avec un vélo de route relevait de l'excentricité. Aujourd'hui, le gravel occupe des rayons entiers, aligne ses propres championnats et attire des coureurs venus de tous les horizons. Comment expliquer un tel engouement en si peu de temps ?" },
      { t: "h2", x: "Une liberté retrouvée" },
      { t: "p", x: "Le gravel a d'abord séduit par ce qu'il promet : sortir du trafic, quitter le bitume, tracer sa propre route. Là où la course sur route impose ses codes, le gravel cultive une forme d'aventure décomplexée où l'important n'est pas toujours le chronomètre." },
      { t: "quote", x: "Le gravel, c'est le vélo qui redevient un terrain de jeu." },
      { t: "p", x: "Les constructeurs ne s'y sont pas trompés. Cadres polyvalents, pneus larges et tubeless, transmissions monoplateau : l'écosystème matériel s'est structuré à une vitesse fulgurante, portant la discipline vers une maturité inattendue." },
      { t: "h2", x: "Vers une professionnalisation ?" },
      { t: "p", x: "Restent les questions de fond. Faut-il des règlements unifiés ? Le gravel doit-il conserver son esprit d'ouverture ou basculer vers le sport de haut niveau ? Le débat ne fait que commencer, et il dira beaucoup de ce que le cyclisme veut devenir." },
      { t: "list", x: [
        "Un marché en croissance à deux chiffres depuis plusieurs saisons.",
        "Des épreuves longue distance qui font le plein d'inscrits.",
        "Une porte d'entrée idéale pour les nouveaux pratiquants.",
      ] },
      { t: "p", x: "Une chose est sûre : en réconciliant performance et plaisir, le gravel a rappelé à beaucoup pourquoi ils étaient montés sur un vélo." },
    ],
  },
  {
    id: "anatomie-echappee",
    title: "Anatomie d'une échappée : ce que le peloton calcule vraiment",
    category: "Tactique",
    excerpt: "Derrière l'image romantique des baroudeurs se cache une mécanique implacable. Comprendre pourquoi une échappée part, tient — ou s'effondre.",
    author: "Mayeul",
    date: "2026-07-19",
    readingTime: 7,
    featured: false,
    portfolio: true,
    tone: "red",
    body: [
      { t: "p", x: "Sur le papier, une échappée est une folie : quelques coureurs contre un peloton lancé à pleine puissance. Pourtant, certaines vont au bout. Ce n'est presque jamais un hasard." },
      { t: "h2", x: "Le bon moment, la bonne composition" },
      { t: "p", x: "Une échappée viable se construit sur deux paramètres : le profil de l'étape et la présence, ou non, d'équipes intéressées à la contrôler. Si aucune formation n'a de sprinteur à protéger, la porte s'ouvre." },
      { t: "quote", x: "Une échappée ne gagne pas parce qu'elle roule vite. Elle gagne parce que, derrière, personne n'a intérêt à la reprendre." },
      { t: "h2", x: "L'art du dosage" },
      { t: "p", x: "À l'avant, la collaboration est une négociation permanente. Trop de relais et l'on se grille avant l'arrivée ; trop peu et l'écart fond. Les meilleurs baroudeurs sont d'abord de fins tacticiens de l'effort." },
      { t: "list", x: [
        "L'écart maximal se joue souvent dans le premier tiers de course.",
        "Le peloton régule sa vitesse pour reprendre à quelques kilomètres de l'arrivée.",
        "Un vent de face rebat toutes les cartes en quelques minutes.",
      ] },
      { t: "p", x: "Comprendre l'échappée, c'est comprendre que le cyclisme est un sport d'équipe déguisé en effort solitaire." },
    ],
  },
  {
    id: "velo-acier-renaissance",
    title: "Le retour de l'acier : nostalgie ou vraie renaissance ?",
    category: "Matériel",
    excerpt: "À l'heure du carbone roi, une frange de passionnés et d'artisans remet l'acier au goût du jour. Enquête sur un matériau qu'on disait dépassé.",
    author: "Mayeul",
    date: "2026-07-08",
    readingTime: 5,
    featured: false,
    portfolio: true,
    tone: "slate",
    body: [
      { t: "p", x: "On l'a enterré cent fois. Et pourtant, l'acier n'a jamais tout à fait disparu des ateliers. Mieux : il revient, porté par une quête d'authenticité et de durabilité." },
      { t: "h2", x: "Le confort avant tout" },
      { t: "p", x: "Souple, vivant, l'acier filtre la route comme peu de matériaux. Là où le carbone privilégie la rigidité et la légèreté, l'acier propose un dialogue plus tendre avec le bitume — un argument qui pèse sur les longues distances." },
      { t: "quote", x: "Un cadre acier, ça se répare. Ça se transmet. Ça vieillit avec vous." },
      { t: "p", x: "S'ajoute la dimension artisanale : chaque cadre sur-mesure raconte une rencontre entre un coureur et un fabricant. Une valeur difficile à chiffrer, mais qui compte de plus en plus." },
      { t: "h2", x: "Un choix de raison ?" },
      { t: "p", x: "Réparabilité, longévité, empreinte réduite : à l'heure des questionnements écologiques, l'acier coche des cases que le tout-carbone peine à remplir. La renaissance est peut-être aussi une affaire de bon sens." },
    ],
  },
  {
    id: "grimper-comme-un-pro",
    title: "Grimper comme un pro : la science derrière les cols",
    category: "Entraînement",
    excerpt: "Le rapport poids-puissance, le placement, la gestion de l'effort : petit précis pour transformer les montées en terrain favorable.",
    author: "Mayeul",
    date: "2026-06-30",
    readingTime: 6,
    featured: false,
    portfolio: false,
    tone: "sky",
    body: [
      { t: "p", x: "La montagne ne pardonne pas l'improvisation. Mais grimper mieux n'est pas qu'une question de génétique : c'est aussi, et surtout, une affaire de méthode." },
      { t: "h2", x: "Le nerf de la guerre : le poids-puissance" },
      { t: "p", x: "En côte, la gravité devient l'adversaire numéro un. Le rapport entre les watts produits et le poids total détermine la vitesse ascensionnelle. D'où l'obsession des grimpeurs pour chaque gramme et chaque watt." },
      { t: "list", x: [
        "Rouler à sa propre cadence plutôt qu'à celle des autres.",
        "Anticiper les changements de pente pour lisser l'effort.",
        "Économiser en danseuse : elle coûte cher en énergie.",
      ] },
      { t: "quote", x: "En montagne, on ne bat pas la pente. On négocie avec elle." },
      { t: "p", x: "Le reste est une affaire de patience : le progrès en côte se construit sur des semaines de travail régulier, pas sur une sortie héroïque." },
    ],
  },
  {
    id: "nouvelle-generation-feminine",
    title: "La nouvelle génération qui redessine le cyclisme féminin",
    category: "Portraits",
    excerpt: "Médiatisation, budgets, calendrier : le cyclisme féminin change d'échelle, porté par une génération qui n'attend plus la permission.",
    author: "Mayeul",
    date: "2026-06-21",
    readingTime: 7,
    featured: false,
    portfolio: true,
    tone: "red",
    body: [
      { t: "p", x: "Longtemps reléguée à l'arrière-plan, la course féminine occupe désormais le devant de la scène. Derrière cette bascule, une génération de coureuses décomplexées et un écosystème qui rattrape son retard." },
      { t: "h2", x: "Un calendrier qui monte en gamme" },
      { t: "p", x: "Étapes rallongées, épreuves prestigieuses, retransmissions élargies : le calendrier féminin gagne en densité et en visibilité. Les audiences suivent, et avec elles les partenaires." },
      { t: "quote", x: "On ne demande plus une place. On la prend." },
      { t: "h2", x: "Le nerf de la guerre" },
      { t: "p", x: "Reste la question des moyens. Salaires, structures, encadrement : les écarts avec le peloton masculin demeurent, mais l'écart se réduit, poussé par une pression médiatique inédite. La dynamique, elle, semble irréversible." },
    ],
  },
  {
    id: "aerodynamisme-course-aux-watts",
    title: "Aérodynamisme : la course invisible aux watts économisés",
    category: "Matériel",
    excerpt: "À vitesse élevée, l'air est l'ennemi numéro un. Comment ingénieurs et coureurs traquent chaque watt perdu dans le vent.",
    author: "Mayeul",
    date: "2026-06-10",
    readingTime: 5,
    featured: false,
    portfolio: false,
    tone: "ink",
    body: [
      { t: "p", x: "Au-delà de 30 km/h, l'essentiel de l'énergie d'un coureur ne sert plus à avancer, mais à fendre l'air. D'où une bataille technologique menée à coups de soufflerie et de capteurs." },
      { t: "h2", x: "Le corps, premier frein" },
      { t: "p", x: "Le matériel compte, mais le poste le plus coûteux reste le coureur lui-même. La position sur le vélo pèse davantage que n'importe quel composant : un dos plus plat peut valoir plusieurs dizaines de watts." },
      { t: "list", x: [
        "La position prime sur le matériel dans la traque des watts.",
        "Cadre, roues, casque, textile : chaque détail se cumule.",
        "Le gain aéro se paie parfois en confort — tout est arbitrage.",
      ] },
      { t: "quote", x: "En contre-la-montre, on ne court pas contre les autres. On court contre l'air." },
      { t: "p", x: "L'aérodynamisme est devenu un langage à part entière, que les meilleures équipes parlent couramment." },
    ],
  },
  {
    id: "flamme-rouge-kilometre-mythique",
    title: "La flamme rouge : histoire du kilomètre le plus intense du cyclisme",
    category: "Culture",
    excerpt: "Ce triangle rouge suspendu au-dessus de la route annonce le dernier kilomètre. Petite histoire d'un symbole devenu légende.",
    author: "Mayeul",
    date: "2026-05-29",
    readingTime: 4,
    featured: false,
    portfolio: true,
    tone: "red",
    body: [
      { t: "p", x: "Il y a des symboles que tout amateur de cyclisme reconnaît instantanément. La flamme rouge en fait partie : ce fanion triangulaire marque l'entrée dans le dernier kilomètre, là où tout se joue." },
      { t: "h2", x: "Une origine militaire" },
      { t: "p", x: "L'expression trouve ses racines loin des routes de course. Le rouge, couleur de l'urgence et du signal, s'est imposé pour matérialiser l'ultime effort. Depuis, il rythme les emballages finaux de toutes les grandes épreuves." },
      { t: "quote", x: "Passé la flamme rouge, il n'y a plus de calcul. Il n'y a plus que la ligne." },
      { t: "p", x: "C'est peut-être ce que le cyclisme a de plus pur : l'instant où la stratégie s'efface devant l'engagement total, où il ne reste que la volonté d'aller au bout." },
    ],
  },
];

/* Exposé globalement pour les autres scripts */
window.SITE = SITE;
window.CATEGORIES = CATEGORIES;
window.ARTICLES = ARTICLES;
