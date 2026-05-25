(function () {
  const LEVELS = {
    "5e": { label: "5e", reward: { mastery: 8, resources: 4, badges: 1 }, penalty: { disorder: 4, motivation: -2 } },
    "4e": { label: "4e", reward: { mastery: 12, resources: 6, badges: 1 }, penalty: { disorder: 6, motivation: -3 } },
    "3e": { label: "3e", reward: { mastery: 16, resources: 8, badges: 1 }, penalty: { disorder: 8, motivation: -4 } }
  };

  const TYPES = ["single", "trueFalse", "sequence", "classify", "diagnostic", "decision"];

  const TYPE_LABELS = {
    single: "Choix cible",
    trueFalse: "Vrai / faux",
    sequence: "Ordre logique",
    classify: "Classement",
    diagnostic: "Diagnostic",
    decision: "Decision"
  };

  const SITUATION_DETAILS = [
    "un essai rapide",
    "un travail en ilot",
    "la preparation du prototype",
    "la mise au point",
    "la comparaison de deux solutions",
    "la restitution orale",
    "un test avec capteur",
    "un bilan de fin de seance",
    "l'analyse d'une panne",
    "la recherche d'une solution durable",
    "un croquis de fonctionnement",
    "un debat sur les contraintes",
    "la verification des mesures",
    "l'amelioration du programme",
    "la lecture d'un schema",
    "la preparation d'une fiche technique",
    "un test utilisateur",
    "la correction d'une erreur",
    "la mesure d'une performance",
    "la validation par le groupe"
  ];

  const THEMES = [
    {
      id: "ai",
      label: "IA",
      icon: "data",
      contexts: {
        "5e": ["un tri de photos", "un assistant vocal", "une camera de portail", "un robot qui reconnait une ligne"],
        "4e": ["un systeme de recommandation", "une detection de defaut", "une application de traduction", "un capteur intelligent"],
        "3e": ["un service d'aide a la decision", "un modele entraine en ligne", "un systeme avec donnees personnelles", "une evaluation de performance"]
      },
      concepts: {
        "5e": [
          ["donnee d'entree", "une information fournie au systeme", "un moteur", "une batterie"],
          ["modele", "une regle apprise a partir d'exemples", "un cable reseau", "une source d'energie"],
          ["prediction", "la reponse proposee par l'IA", "un engrenage", "un interrupteur"],
          ["exemple d'apprentissage", "un cas utilise pour entrainer le systeme", "une vis", "un panneau solaire"]
        ],
        "4e": [
          ["biais", "un desequilibre dans les donnees qui influence la reponse", "une perte par frottement", "un court-circuit"],
          ["jeu de test", "des exemples gardes pour verifier le modele", "une reserve de piles", "un plan de montage"],
          ["confiance", "un indice sur la fiabilite de la prediction", "une vitesse de rotation", "un debit d'eau"],
          ["classification", "le rangement automatique dans une categorie", "un changement de tension", "une liaison mecanique"]
        ],
        "3e": [
          ["critere d'evaluation", "une mesure qui permet de juger les resultats", "un engrenage intermediaire", "un fusible"],
          ["donnee personnelle", "une information qui peut identifier une personne", "une roue libre", "un connecteur"],
          ["generalisation", "la capacite a reussir sur des cas nouveaux", "une transmission par chaine", "un stockage d'energie"],
          ["explicabilite", "la possibilite de comprendre une decision du systeme", "un capteur analogique", "une batterie externe"]
        ]
      },
      truths: {
        "5e": [
          ["Une IA utilise des donnees pour proposer une reponse.", true],
          ["Une IA comprend toujours le monde comme un humain.", false],
          ["Un exemple mal choisi peut influencer l'apprentissage.", true],
          ["Une IA n'a jamais besoin d'etre testee.", false]
        ],
        "4e": [
          ["Un modele peut se tromper si les donnees sont biaisees.", true],
          ["Le jeu de test sert a entrainer le modele une deuxieme fois.", false],
          ["La classification range une entree dans une categorie.", true],
          ["Plus de donnees suffit toujours a rendre une IA juste.", false]
        ],
        "3e": [
          ["Evaluer une IA demande des criteres mesurables.", true],
          ["Une donnee personnelle peut etre partagee sans precaution.", false],
          ["Un modele doit etre teste sur des cas qu'il ne connait pas.", true],
          ["L'explicabilite ne sert jamais dans un systeme technique.", false]
        ]
      },
      sequences: {
        "5e": [["observer", "donner des exemples", "tester", "utiliser"], ["capturer une image", "analyser", "classer", "agir"]],
        "4e": [["collecter", "entrainer", "tester", "corriger"], ["choisir des donnees", "verifier les biais", "tester", "deployer"]],
        "3e": [["definir un critere", "entrainer", "evaluer", "surveiller"], ["anonymiser", "entrainer", "controler", "documenter"]]
      },
      classifications: {
        "5e": [["photo d'un objet", "donnee d'entree", "actionneur", "source d'energie"], ["reponse chat/chien", "sortie", "capteur", "batterie"]],
        "4e": [["jeu d'images desequilibre", "biais", "rendement", "liaison mecanique"], ["pourcentage de certitude", "confiance", "tension", "couple moteur"]],
        "3e": [["nom et visage d'un eleve", "donnee personnelle", "transmission", "programme Scratch"], ["taux de bonnes reponses", "critere d'evaluation", "chaine d'energie", "capteur"]]
      },
      diagnostics: {
        "5e": [["Le robot confond deux formes proches.", "Ajouter des exemples varies", "Changer les roues", "Augmenter la batterie"], ["L'assistant vocal ne reagit pas au bruit.", "Verifier les donnees sonores", "Changer les engrenages", "Mesurer la masse"]],
        "4e": [["La camera reconnait mieux un objet clair qu'un objet sombre.", "Chercher un biais dans les donnees", "Remplacer le moteur", "Reduire la tension"], ["Le modele reussit en classe mais rate dehors.", "Tester avec des cas plus varies", "Ajouter un switch", "Changer le support"]],
        "3e": [["Le systeme refuse certains profils sans raison visible.", "Documenter et evaluer les criteres", "Supprimer le capteur", "Augmenter la vitesse"], ["Des donnees d'eleves sont utilisees pour entrainer.", "Verifier consentement et anonymisation", "Changer les roues", "Ajouter un engrenage"]]
      },
      decisions: {
        "5e": [["Pour apprendre a reconnaitre des objets", "Fournir plusieurs exemples corrects", "Brancher plus de lampes", "Retirer les capteurs"], ["Pour verifier une reponse IA", "Comparer avec une observation reelle", "Faire tourner un moteur", "Decharger la batterie"]],
        "4e": [["Pour limiter un biais", "Equilibrer les exemples", "Utiliser un seul cas", "Ignorer les erreurs"], ["Pour controler un modele", "Utiliser un jeu de test", "Supprimer les donnees de test", "Changer le nom du fichier"]],
        "3e": [["Pour respecter les donnees personnelles", "Minimiser et anonymiser", "Publier toutes les donnees", "Melanger avec des images libres"], ["Pour choisir entre deux modeles", "Comparer les resultats avec le meme critere", "Garder le plus joli logo", "Choisir au hasard"]]
      }
    },
    {
      id: "energy",
      label: "Energie",
      icon: "solar",
      contexts: {
        "5e": ["une lampe autonome", "un petit robot", "un ventilateur USB", "un eclairage de velo"],
        "4e": ["une maquette solaire", "un portail motorise", "un objet nomade", "une serre automatisee"],
        "3e": ["un systeme optimise", "un bilan energetique", "un choix de source", "un cycle de vie d'objet"]
      },
      concepts: {
        "5e": [["source d'energie", "ce qui fournit l'energie au systeme", "ce qui traite une information", "ce qui range des donnees"], ["convertir", "changer une forme d'energie en une autre", "trier une liste", "envoyer un message"], ["stocker", "garder de l'energie pour plus tard", "mesurer une distance", "classer une image"], ["alimenter", "apporter l'energie necessaire", "afficher un score", "calculer une moyenne"]],
        "4e": [["rendement", "la part utile de l'energie recue", "un ordre Scratch", "une adresse IP"], ["perte", "l'energie non utilisee efficacement", "un signal logique", "une variable"], ["puissance", "l'energie transferee par seconde", "une categorie d'image", "un message radio"], ["contrainte energetique", "une limite liee a la source ou a la consommation", "un decor", "une couleur de lutin"]],
        "3e": [["bilan energetique", "la comparaison entre energie recue, utile et perdue", "une liste de sprites", "une etiquette de donnees"], ["sobriete", "reduire le besoin avant d'augmenter la puissance", "ajouter des capteurs inutiles", "ignorer l'usage"], ["mix energetique", "l'association de plusieurs sources", "un type de boucle", "un bus de donnees"], ["impact", "l'effet du choix energetique sur l'environnement", "un style graphique", "un nom de variable"]]
      },
      truths: {
        "5e": [["Une pile peut alimenter un petit objet.", true], ["Un moteur cree de l'energie a partir de rien.", false], ["Une lampe convertit de l'energie electrique en lumiere.", true], ["Stocker l'energie signifie la perdre volontairement.", false]],
        "4e": [["Un systeme a toujours des pertes d'energie.", true], ["Un rendement de 100 % est facile a obtenir en pratique.", false], ["La puissance est liee a une quantite d'energie par seconde.", true], ["Augmenter la tension resout toujours un probleme.", false]],
        "3e": [["Un choix energetique peut etre juge avec l'usage et l'impact.", true], ["La sobriete consiste seulement a ajouter une batterie plus grosse.", false], ["Un bilan energetique aide a reperer les pertes.", true], ["Le cycle de vie n'a aucun rapport avec l'energie.", false]]
      },
      sequences: {
        "5e": [["alimenter", "convertir", "transmettre", "agir"], ["source", "cable", "moteur", "mouvement"]],
        "4e": [["mesurer", "calculer les pertes", "ameliorer", "tester"], ["source", "stockage", "conversion", "usage"]],
        "3e": [["definir le besoin", "choisir une source", "evaluer l'impact", "optimiser"], ["mesurer", "comparer", "justifier", "ameliorer"]]
      },
      classifications: {
        "5e": [["pile", "source", "capteur", "programme"], ["moteur", "convertisseur", "donnee", "serveur"]],
        "4e": [["chaleur perdue", "perte", "commande", "variable"], ["panneau solaire", "source", "condition", "liaison reseau"]],
        "3e": [["reduction de consommation", "sobriete", "acceleration", "classification"], ["analyse fabrication-usage-fin", "cycle de vie", "boucle", "capteur logique"]]
      },
      diagnostics: {
        "5e": [["Le robot ne s'allume plus.", "Verifier la source d'energie", "Changer le programme IA", "Ajouter un lutin"], ["La lampe brille faiblement.", "Controler l'alimentation", "Changer l'adresse IP", "Supprimer le moteur"]],
        "4e": [["Le moteur chauffe beaucoup.", "Chercher des pertes d'energie", "Ajouter une variable", "Changer la couleur"], ["La batterie se vide trop vite.", "Mesurer la consommation", "Ignorer l'usage", "Retirer les tests"]],
        "3e": [["Deux solutions fonctionnent mais n'ont pas le meme impact.", "Comparer cycle de vie et usage", "Choisir la plus lourde", "Choisir sans critere"], ["Le systeme consomme trop en veille.", "Travailler la sobriete", "Ajouter une batterie", "Masquer la mesure"]]
      },
      decisions: {
        "5e": [["Pour faire tourner une roue", "Utiliser un moteur alimente", "Utiliser une photo", "Utiliser un switch seul"], ["Pour economiser une pile", "Eteindre quand l'objet est inutile", "Laisser tout allume", "Ajouter une lampe"]],
        "4e": [["Pour augmenter l'autonomie", "Reduire la consommation", "Ajouter des pertes", "Supprimer les mesures"], ["Pour comparer deux moteurs", "Mesurer puissance et rendement", "Regarder seulement la couleur", "Ignorer la charge"]],
        "3e": [["Pour justifier une solution durable", "Croiser besoin, usage et impact", "Choisir le prix seul", "Choisir le plus puissant"], ["Pour ameliorer un bilan", "Reduire pertes et besoins", "Multiplier les conversions", "Ajouter un voyant inutile"]]
      }
    },
    {
      id: "scratch",
      label: "Programmation Scratch",
      icon: "gear",
      contexts: {
        "5e": ["un lutin robot", "un feu pieton", "un mini-jeu", "un compteur de passages"],
        "4e": ["un objet pilote par capteur", "un systeme avec messages", "un programme a variables", "un prototype interactif"],
        "3e": ["un algorithme a tester", "un programme modulaire", "une liste de donnees", "une simulation de systeme"]
      },
      concepts: {
        "5e": [["evenement", "ce qui declenche un script", "un moteur", "une batterie"], ["boucle", "une repetition d'instructions", "un cable", "un capteur seul"], ["condition", "un test qui choisit une action", "une roue", "un panneau"], ["lutin", "un objet programmable de la scene", "une source d'energie", "un engrenage"]],
        "4e": [["variable", "une memoire qui change pendant le programme", "une pile", "un pignon"], ["message", "un moyen de synchroniser des scripts", "une tension", "un frottement"], ["capteur", "une entree qui fournit une information", "un reservoir", "un ressort"], ["operateur", "un bloc qui calcule ou compare", "un moteur", "une coque"]],
        "3e": [["liste", "une structure pour stocker plusieurs valeurs", "un type de roue", "une pile electrique"], ["test", "une verification pour valider le comportement", "une piece decorative", "une source lumineuse"], ["fonctionnement modulaire", "decouper en blocs reutilisables", "augmenter le bruit", "changer le logo"], ["debug", "chercher et corriger une erreur", "ajouter une batterie", "retirer les capteurs"]]
      },
      truths: {
        "5e": [["Une boucle repete des instructions.", true], ["Un evenement Scratch est toujours un moteur.", false], ["Une condition peut faire choisir entre deux actions.", true], ["Un lutin ne peut jamais executer de script.", false]],
        "4e": [["Une variable peut stocker un score.", true], ["Un message Scratch sert a distribuer de l'energie.", false], ["Un capteur peut devenir une entree du programme.", true], ["Un operateur ne peut jamais comparer deux valeurs.", false]],
        "3e": [["Une liste peut stocker plusieurs mesures.", true], ["Tester un programme consiste a ne jamais le lancer.", false], ["Decouper un programme facilite la correction.", true], ["Debugger signifie ajouter des blocs au hasard.", false]]
      },
      sequences: {
        "5e": [["evenement", "condition", "action", "retour"], ["demarrer", "repeter", "tester", "agir"]],
        "4e": [["lire capteur", "stocker variable", "tester", "envoyer message"], ["evenement", "calcul", "decision", "affichage"]],
        "3e": [["ecrire algorithme", "coder", "tester", "corriger"], ["recueillir donnees", "stocker liste", "traiter", "exploiter"]]
      },
      classifications: {
        "5e": [["quand drapeau clique", "evenement", "capteur", "actionneur"], ["repeter 10 fois", "boucle", "source", "message"]],
        "4e": [["score", "variable", "moteur", "roue"], ["diffuser message depart", "communication interne", "conversion", "stockage energie"]],
        "3e": [["liste mesures", "structure de donnees", "transmission mecanique", "source"], ["corriger une erreur", "debug", "alimenter", "transmettre"]]
      },
      diagnostics: {
        "5e": [["Le lutin ne demarre jamais.", "Verifier l'evenement declencheur", "Changer la batterie", "Ajouter un engrenage"], ["Le feu reste toujours vert.", "Verifier la condition", "Changer la roue", "Supprimer la scene"]],
        "4e": [["Le score ne change pas.", "Verifier la variable", "Ajouter un moteur", "Changer le cable"], ["Deux scripts ne se synchronisent pas.", "Verifier le message diffuse", "Augmenter la puissance", "Changer le capteur de place"]],
        "3e": [["Le programme marche une fois puis bug.", "Tester plusieurs cas et corriger", "Supprimer les tests", "Ajouter des sons"], ["Les mesures sont perdues.", "Utiliser ou verifier la liste", "Changer la roue", "Ignorer les valeurs"]]
      },
      decisions: {
        "5e": [["Pour repeter un clignotement", "Utiliser une boucle", "Copier cent fois au hasard", "Ajouter une pile"], ["Pour reagir a une touche", "Utiliser un evenement", "Changer le moteur", "Ajouter un engrenage"]],
        "4e": [["Pour memoriser une distance", "Utiliser une variable", "Utiliser une roue", "Supprimer le capteur"], ["Pour prevenir un autre script", "Diffuser un message", "Augmenter la tension", "Changer la couleur"]],
        "3e": [["Pour traiter 20 mesures", "Utiliser une liste", "Creer 20 lutins inutiles", "Tout ecrire dans le titre"], ["Pour fiabiliser un programme", "Prevoir des tests", "Eviter de l'executer", "Choisir au hasard"]]
      }
    },
    {
      id: "locomotion",
      label: "Moyens de locomotion",
      icon: "cart",
      contexts: {
        "5e": ["une trottinette", "un velo", "un robot roulant", "un train miniature"],
        "4e": ["un vehicule electrique", "un systeme de freinage", "une transmission", "un objet roulant connecte"],
        "3e": ["une comparaison de mobilites", "un choix de motorisation", "un cycle de vie de transport", "une innovation de deplacement"]
      },
      concepts: {
        "5e": [["roue", "un element qui facilite le roulement", "un capteur", "un programme"], ["frein", "un systeme qui ralentit ou arrete", "une variable", "une image"], ["direction", "ce qui permet d'orienter le mouvement", "une batterie seule", "un serveur"], ["transmission", "ce qui transmet un mouvement", "un algorithme", "un son"]],
        "4e": [["adherence", "le contact utile entre roue et sol", "un message Scratch", "une donnee personnelle"], ["couple", "un effort de rotation", "une photo", "une categorie"], ["contrainte", "une limite a respecter", "un costume de lutin", "une prediction IA"], ["securite", "des choix pour proteger les usagers", "un simple decor", "une etiquette"]],
        "3e": [["usage", "la maniere reelle d'utiliser le moyen de transport", "un capteur seul", "un son"], ["impact environnemental", "les effets du transport sur les ressources et emissions", "une boucle", "un score"], ["innovation", "une solution nouvelle a un besoin", "un vieux cable", "un hasard"], ["compromis", "un choix entre plusieurs contraintes", "un bloc vert", "une vis cachee"]]
      },
      truths: {
        "5e": [["Un frein sert a ralentir ou arreter.", true], ["La direction ne sert jamais dans un vehicule.", false], ["Une transmission peut transmettre un mouvement.", true], ["Une roue est toujours un capteur.", false]],
        "4e": [["L'adherence influence la securite.", true], ["Une contrainte peut etre liee au cout ou a la masse.", true], ["Le freinage n'a aucun lien avec l'energie.", false], ["Le couple est une image affichee a l'ecran.", false]],
        "3e": [["Comparer deux transports demande de definir l'usage.", true], ["L'impact se limite toujours au prix d'achat.", false], ["Un compromis peut opposer autonomie, masse et cout.", true], ["Une innovation est forcement durable.", false]]
      },
      sequences: {
        "5e": [["besoin", "solution", "test", "amelioration"], ["pedaler", "transmettre", "faire tourner", "avancer"]],
        "4e": [["observer l'usage", "identifier contraintes", "choisir solution", "tester"], ["alimenter", "motoriser", "transmettre", "freiner"]],
        "3e": [["definir criteres", "comparer solutions", "evaluer impacts", "argumenter"], ["besoin", "innovation", "prototype", "validation"]]
      },
      classifications: {
        "5e": [["frein", "securite", "capteur IA", "donnee"], ["chaine de velo", "transmission", "programme", "source"]],
        "4e": [["pneu qui glisse", "adherence", "variable", "modele IA"], ["masse limitee", "contrainte", "boucle", "message"]],
        "3e": [["trajet court quotidien", "usage", "classification", "debug"], ["autonomie contre masse", "compromis", "capteur", "lutin"]]
      },
      diagnostics: {
        "5e": [["Le robot avance mais ne tourne pas.", "Verifier la direction", "Changer les donnees IA", "Ajouter une liste"], ["Le velo patine.", "Verifier roue et contact au sol", "Changer le programme Scratch", "Ajouter un serveur"]],
        "4e": [["Le vehicule freine mal sous la pluie.", "Analyser l'adherence", "Changer l'icone", "Supprimer la variable"], ["Le moteur force au demarrage.", "Etudier couple et transmission", "Ajouter une photo", "Ignorer le test"]],
        "3e": [["Deux solutions ont des impacts differents selon le trajet.", "Comparer selon l'usage reel", "Choisir la plus rapide seulement", "Ne pas definir de critere"], ["Une solution est pratique mais tres polluante.", "Discuter le compromis", "Masquer l'impact", "Ajouter un son"]]
      },
      decisions: {
        "5e": [["Pour rendre un robot roulant stable", "Verifier roues et appuis", "Ajouter des messages", "Changer le nom"], ["Pour ralentir en securite", "Utiliser un frein adapte", "Retirer l'adherence", "Supprimer les tests"]],
        "4e": [["Pour monter une pente", "Adapter moteur et transmission", "Changer la couleur", "Ignorer la masse"], ["Pour choisir un pneu", "Tenir compte du sol et de l'adherence", "Choisir au hasard", "Regarder seulement le prix"]],
        "3e": [["Pour comparer velo et voiture", "Definir trajet, impact et besoin", "Comparer la couleur", "Eviter les criteres"], ["Pour proposer une innovation", "Repondre a un besoin argumente", "Ajouter un gadget inutile", "Copier sans tester"]]
      }
    },
    {
      id: "energyChain",
      label: "Chaine d'energie",
      icon: "motor",
      contexts: {
        "5e": ["une porte automatique", "un robot roulant", "un store motorise", "une lampe mobile"],
        "4e": ["un portail automatise", "une maquette de convoyeur", "un bras motorise", "un systeme solaire"],
        "3e": ["un systeme pluri-technologique", "une optimisation de rendement", "une maintenance de prototype", "un choix d'actionneur"]
      },
      concepts: {
        "5e": [["alimenter", "fournir l'energie", "choisir une image", "stocker une liste"], ["distribuer", "amener l'energie aux composants", "classer une photo", "dire vrai/faux"], ["convertir", "transformer l'energie en mouvement ou lumiere", "envoyer un message", "calculer un score"], ["transmettre", "passer le mouvement jusqu'a l'action", "anonymiser", "tester un modele"]],
        "4e": [["actionneur", "un composant qui agit physiquement", "une donnee personnelle", "une condition Scratch"], ["preactionneur", "un composant qui commande la puissance", "un costume de lutin", "une etiquette"], ["rendement", "le rapport entre utile et recu", "une image classee", "un message"], ["perte mecanique", "une energie dissipee par frottements ou echauffement", "un biais IA", "une liste"]],
        "3e": [["architecture d'energie", "l'organisation des fonctions energie", "une interface graphique", "un texte"], ["dimensionnement", "adapter les composants au besoin", "renommer un fichier", "choisir une couleur"], ["maintenance", "garder la chaine efficace et sure", "supprimer les mesures", "publier les donnees"], ["efficacite globale", "prendre en compte toutes les conversions", "un score de jeu", "une police"]]
      },
      truths: {
        "5e": [["La chaine d'energie contient la fonction convertir.", true], ["Un capteur est toujours l'actionneur principal.", false], ["Un moteur peut convertir l'energie electrique en mouvement.", true], ["Transmettre signifie supprimer l'energie.", false]],
        "4e": [["Un actionneur produit une action physique.", true], ["Les frottements peuvent creer des pertes.", true], ["Un preactionneur est un personnage Scratch.", false], ["Le rendement ignore les pertes.", false]],
        "3e": [["Dimensionner consiste a adapter au besoin.", true], ["La maintenance peut limiter les pertes et les pannes.", true], ["L'efficacite globale ne regarde qu'un seul composant.", false], ["Une chaine d'energie n'a aucun lien avec la securite.", false]]
      },
      sequences: {
        "5e": [["alimenter", "distribuer", "convertir", "transmettre"], ["source", "interrupteur", "moteur", "roues"]],
        "4e": [["source", "preactionneur", "actionneur", "mecanisme"], ["mesurer besoin", "choisir actionneur", "tester", "ameliorer"]],
        "3e": [["analyser besoin", "dimensionner", "integrer", "maintenir"], ["mesurer pertes", "modifier", "valider", "documenter"]]
      },
      classifications: {
        "5e": [["pile", "alimenter", "traiter", "communiquer"], ["moteur", "convertir", "acquerir", "memoriser"]],
        "4e": [["relais moteur", "preactionneur", "capteur", "liste"], ["engrenage", "transmettre", "biais", "condition"]],
        "3e": [["choix de moteur adapte", "dimensionnement", "classification", "donnee personnelle"], ["graissage d'un axe", "maintenance", "entrainement IA", "debug Scratch"]]
      },
      diagnostics: {
        "5e": [["La porte recoit du courant mais ne bouge pas.", "Verifier la conversion par le moteur", "Changer le capteur photo", "Renommer le lutin"], ["Le moteur tourne mais la roue non.", "Verifier la transmission", "Changer la liste", "Publier les donnees"]],
        "4e": [["Le moteur ne recoit jamais la puissance.", "Verifier le preactionneur", "Changer le score", "Equilibrer les images"], ["Le mecanisme chauffe.", "Chercher des pertes par frottement", "Ajouter un costume", "Ignorer le test"]],
        "3e": [["Le systeme consomme trop pour le besoin.", "Revoir le dimensionnement", "Ajouter un moteur plus gros sans calcul", "Supprimer les criteres"], ["Les pannes reviennent souvent.", "Planifier la maintenance", "Changer la couleur", "Ignorer les mesures"]]
      },
      decisions: {
        "5e": [["Pour deplacer un objet", "Alimenter puis convertir en mouvement", "Classer une image", "Envoyer un message seul"], ["Pour transmettre un mouvement", "Utiliser un mecanisme adapte", "Ajouter une variable", "Publier un nom"]],
        "4e": [["Pour commander un moteur puissant", "Utiliser un preactionneur adapte", "Brancher directement au hasard", "Changer le decor"], ["Pour limiter les pertes", "Reduire frottements et mauvais alignements", "Ajouter des boucles", "Ignorer la temperature"]],
        "3e": [["Pour choisir un actionneur", "Partir du besoin et des contraintes", "Choisir le plus cher", "Choisir le premier venu"], ["Pour prouver une amelioration", "Mesurer avant et apres", "Dire que c'est mieux", "Eviter les essais"]]
      }
    },
    {
      id: "informationChain",
      label: "Chaine d'information",
      icon: "router",
      contexts: {
        "5e": ["une porte automatique", "un robot suiveur de ligne", "une alarme simple", "un eclairage automatique"],
        "4e": ["un systeme avec microcontroleur", "un objet connecte", "une serre automatisee", "un compteur de passages"],
        "3e": ["un systeme communicant", "une decision automatisee", "un reseau de capteurs", "une supervision de prototype"]
      },
      concepts: {
        "5e": [["acquerir", "recevoir une information avec un capteur", "faire tourner une roue", "alimenter un moteur"], ["traiter", "decider a partir des informations", "stocker de l'energie", "freiner"], ["communiquer", "envoyer ou afficher une information", "convertir en mouvement", "charger une batterie"], ["capteur", "un composant qui mesure ou detecte", "un moteur", "un engrenage"]],
        "4e": [["signal", "une information transportee", "une perte mecanique", "une source d'energie"], ["microcontroleur", "un composant qui traite un programme", "une roue", "un frein"], ["interface", "un moyen d'echange avec l'utilisateur", "un moteur", "un pignon"], ["reseau", "un ensemble d'equipements qui communiquent", "une chaine de velo", "un rendement"]],
        "3e": [["donnee", "une information stockee ou transmise", "un actionneur", "une batterie"], ["protocole", "des regles pour communiquer", "une transmission par courroie", "une lampe"], ["securite des donnees", "proteger l'acces et l'usage des informations", "augmenter la vitesse", "changer les roues"], ["decision automatisee", "une action choisie par traitement d'informations", "une perte thermique", "un couple moteur"]]
      },
      truths: {
        "5e": [["Un capteur appartient souvent a la fonction acquerir.", true], ["Traiter une information signifie fournir l'energie.", false], ["Un afficheur peut communiquer une information.", true], ["Un moteur est le meilleur capteur de presence.", false]],
        "4e": [["Un microcontroleur peut executer un programme.", true], ["Un signal transporte une information.", true], ["Un reseau sert seulement a transmettre un mouvement.", false], ["Une interface ne sert jamais a l'utilisateur.", false]],
        "3e": [["Un protocole fixe des regles de communication.", true], ["La securite des donnees concerne aussi les objets connectes.", true], ["Une decision automatisee ne depend jamais des donnees.", false], ["Une donnee ne peut jamais etre stockee.", false]]
      },
      sequences: {
        "5e": [["acquerir", "traiter", "communiquer", "agir"], ["capteur", "programme", "message", "action"]],
        "4e": [["mesurer", "coder le signal", "traiter", "afficher"], ["capteur", "microcontroleur", "interface", "utilisateur"]],
        "3e": [["collecter", "transmettre", "traiter", "securiser"], ["capteur", "reseau", "decision", "trace"]]
      },
      classifications: {
        "5e": [["detecteur de presence", "acquerir", "convertir", "transmettre energie"], ["ecran", "communiquer", "alimenter", "freiner"]],
        "4e": [["carte microcontroleur", "traiter", "transmettre mecanique", "stocker energie"], ["bouton utilisateur", "interface", "moteur", "engrenage"]],
        "3e": [["mot de passe objet connecte", "securite des donnees", "rendement", "couple"], ["message Wi-Fi", "communication", "conversion", "freinage"]]
      },
      diagnostics: {
        "5e": [["La lampe ne s'allume pas quand quelqu'un passe.", "Verifier le capteur et le traitement", "Changer les roues", "Ajouter une batterie enorme"], ["L'ecran reste vide.", "Verifier la communication de l'information", "Graisser l'axe", "Changer le pneu"]],
        "4e": [["Le capteur mesure mais rien ne change.", "Verifier le programme du microcontroleur", "Changer la chaine mecanique", "Ajouter un pignon"], ["Les donnees n'arrivent pas a l'application.", "Verifier la communication reseau", "Augmenter la masse", "Changer la courroie"]],
        "3e": [["Un objet connecte envoie des donnees sans controle.", "Verifier securite et autorisations", "Changer le moteur", "Ajouter un frein"], ["Des capteurs donnent des mesures incoherentes.", "Verifier protocole et traitement", "Peindre le boitier", "Supprimer les tests"]]
      },
      decisions: {
        "5e": [["Pour detecter une presence", "Utiliser un capteur adapte", "Utiliser un engrenage", "Ajouter une roue"], ["Pour prevenir l'utilisateur", "Afficher ou envoyer un message", "Transmettre un couple", "Charger une batterie"]],
        "4e": [["Pour traiter une mesure", "Programmer le microcontroleur", "Ajouter une poulie", "Choisir une couleur"], ["Pour relier plusieurs postes", "Utiliser un reseau adapte", "Ajouter un ressort", "Changer le moteur"]],
        "3e": [["Pour securiser un objet connecte", "Limiter acces et donnees transmises", "Publier toutes les mesures", "Ignorer les droits"], ["Pour expliquer une decision", "Relier donnees, traitement et action", "Masquer les criteres", "Choisir au hasard"]]
      }
    }
  ];

  function pick(list, index) {
    return list[index % list.length];
  }

  function rotatedChoices(choices, seed) {
    const shift = seed % choices.length;
    return choices.slice(shift).concat(choices.slice(0, shift));
  }

  function choice(label, correct, feedback) {
    return { label, correct, feedback };
  }

  function sequenceText(steps) {
    return steps.join(" -> ");
  }

  function wrongSequences(steps) {
    return [
      sequenceText([steps[1], steps[0], steps[2], steps[3]]),
      sequenceText([steps[0], steps[2], steps[1], steps[3]])
    ];
  }

  function baseChallenge(theme, level, type, index) {
    const levelData = LEVELS[level];
    const reward = { ...levelData.reward };
    if (index % 5 !== 0) delete reward.badges;
    return {
      id: `${theme.id}-${level}-${type}-${index}`,
      theme: theme.id,
      themeLabel: theme.label,
      icon: theme.icon,
      level,
      levelLabel: levelData.label,
      type,
      typeLabel: TYPE_LABELS[type],
      reward,
      penalty: { ...levelData.penalty }
    };
  }

  function buildChallenge(theme, level, index) {
    const type = TYPES[index % TYPES.length];
    const context = pick(theme.contexts[level], index);
    const situation = pick(SITUATION_DETAILS, Math.floor(index / TYPES.length));
    const challenge = baseChallenge(theme, level, type, index);

    if (type === "single") {
      const concept = pick(theme.concepts[level], index);
      return {
        ...challenge,
        title: `${theme.label} : role d'un element`,
        prompt: `Dans ${context}, lors de ${situation}, quel est le role de "${concept[0]}" ?`,
        coursePoint: `"${concept[0]}" correspond ici a ${concept[1]}. Dans un systeme technique, il faut relier chaque element a sa fonction avant de choisir une solution.`,
        choices: rotatedChoices([
          choice(concept[1], true, "C'est le role attendu dans ce systeme."),
          choice(concept[2], false, "Cette reponse melange avec une autre fonction technique."),
          choice(concept[3], false, "Ce choix ne correspond pas au role demande.")
        ], index)
      };
    }

    if (type === "trueFalse") {
      const fact = pick(theme.truths[level], index);
      return {
        ...challenge,
        title: `${theme.label} : vrai ou faux`,
        prompt: `Lors de ${situation}, on affirme : ${fact[0]}`,
        coursePoint: fact[1]
          ? `Cette affirmation est vraie. Elle fait partie des reperes a connaitre pour raisonner sur ${theme.label.toLowerCase()} en ${level}.`
          : `Cette affirmation est fausse. En technologie, on verifie toujours le role reel d'un element ou d'une donnee avant de conclure.`,
        choices: rotatedChoices([
          choice("Vrai", fact[1] === true, fact[1] ? "Exact." : "Pas cette fois."),
          choice("Faux", fact[1] === false, fact[1] ? "La phrase etait vraie." : "Exact, la phrase etait fausse.")
        ], index)
      };
    }

    if (type === "sequence") {
      const steps = pick(theme.sequences[level], index);
      const pool = rotatedChoices(steps.map((label, order) => ({ label, order })), index + 1);
      return {
        ...challenge,
        title: `${theme.label} : ordre logique`,
        prompt: `Quel ordre convient le mieux pour ${context}, lors de ${situation} ?`,
        coursePoint: `L'ordre attendu est ${sequenceText(steps)}. Respecter l'ordre des fonctions evite de confondre cause, traitement et action.`,
        steps,
        pool,
        choices: rotatedChoices([
          choice(sequenceText(steps), true, "L'ordre respecte la logique du systeme."),
          choice(wrongSequences(steps)[0], false, "Deux etapes importantes sont inversees."),
          choice(wrongSequences(steps)[1], false, "Le traitement arrive trop tot ou trop tard.")
        ], index)
      };
    }

    if (type === "classify") {
      const item = pick(theme.classifications[level], index);
      return {
        ...challenge,
        title: `${theme.label} : classement rapide`,
        prompt: `Dans ${context}, lors de ${situation}, "${item[0]}" appartient surtout a quelle categorie ?`,
        coursePoint: `"${item[0]}" se classe surtout dans "${item[1]}". Classer correctement aide a comprendre la fonction dans le systeme.`,
        item: item[0],
        categories: rotatedChoices([
          choice(item[1], true, "Classement correct."),
          choice(item[2], false, "Cette categorie correspond a une autre partie du systeme."),
          choice(item[3], false, "Ce n'est pas le meilleur classement ici.")
        ], index),
        choices: rotatedChoices([
          choice(item[1], true, "Classement correct."),
          choice(item[2], false, "Cette categorie correspond a une autre partie du systeme."),
          choice(item[3], false, "Ce n'est pas le meilleur classement ici.")
        ], index)
      };
    }

    if (type === "diagnostic") {
      const diag = pick(theme.diagnostics[level], index);
      return {
        ...challenge,
        title: `${theme.label} : diagnostic`,
        prompt: `${diag[0]} Lors de ${situation}, que faut-il verifier en priorite ?`,
        coursePoint: `Dans un diagnostic, on cherche d'abord la cause la plus probable. Ici, la bonne piste est : ${diag[1]}.`,
        choices: rotatedChoices([
          choice(diag[1], true, "Diagnostic pertinent."),
          choice(diag[2], false, "Cette piste n'agit pas sur la cause probable."),
          choice(diag[3], false, "Cette action risque de masquer le probleme.")
        ], index)
      };
    }

    const decision = pick(theme.decisions[level], index);
    return {
      ...challenge,
      title: `${theme.label} : choix d'action`,
      prompt: `${decision[0]}, lors de ${situation}, quelle decision est la plus solide ?`,
      coursePoint: `Une decision technique solide repond au besoin avec un critere clair. Ici, le meilleur choix est : ${decision[1]}.`,
      choices: rotatedChoices([
        choice(decision[1], true, "Decision justifiee par le besoin."),
        choice(decision[2], false, "Ce choix ne repond pas assez au probleme."),
        choice(decision[3], false, "Ce choix manque de critere technique.")
      ], index)
    };
  }

  function buildAllChallenges() {
    const all = [];
    THEMES.forEach((theme) => {
      Object.keys(LEVELS).forEach((level) => {
        for (let index = 0; index < 120; index += 1) {
          all.push(buildChallenge(theme, level, index));
        }
      });
    });
    return all;
  }

  const ALL_CHALLENGES = buildAllChallenges();

  function getChallenges(filters = {}) {
    return ALL_CHALLENGES.filter((challenge) => {
      if (filters.level && challenge.level !== filters.level) return false;
      if (filters.theme && challenge.theme !== filters.theme) return false;
      return true;
    });
  }

  function stats() {
    return THEMES.map((theme) => ({
      theme: theme.id,
      label: theme.label,
      total: getChallenges({ theme: theme.id }).length,
      byLevel: Object.fromEntries(Object.keys(LEVELS).map((level) => [
        level,
        getChallenges({ theme: theme.id, level }).length
      ]))
    }));
  }

  window.TechnoChallengeBank = {
    levels: LEVELS,
    themes: THEMES.map(({ id, label, icon }) => ({ id, label, icon })),
    types: TYPE_LABELS,
    typeIds: TYPES,
    all: ALL_CHALLENGES,
    getChallenges,
    stats
  };
})();
