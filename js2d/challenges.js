(function () {
  const LEVELS = {
    "5e": { label: "5e", reward: { mastery: 8, resources: 4, badges: 1 }, penalty: { disorder: 4, motivation: -2 } },
    "4e": { label: "4e", reward: { mastery: 12, resources: 6, badges: 1 }, penalty: { disorder: 6, motivation: -3 } },
    "3e": { label: "3e", reward: { mastery: 16, resources: 8, badges: 1 }, penalty: { disorder: 8, motivation: -4 } }
  };

  const TYPES = [
    "single",
    "wordMystery",
    "wordCatch",
    "crossword",
    "arrowWord",
    "definitionLink",
    "cloze",
    "folderSort",
    "schemaSpot",
    "chainRepair",
    "debugBlocks",
    "variableTrace",
    "conditionLoop",
    "aiTraining",
    "specFilter",
    "mapExplore",
    "assembly",
    "compare",
    "miniInvestigation",
    "trueFalse",
    "sequence",
    "classify",
    "diagnostic",
    "decision"
  ];

  const TYPE_LABELS = {
    single: "Choix cible",
    trueFalse: "Vrai / faux",
    sequence: "Ordre logique",
    classify: "Classement",
    diagnostic: "Diagnostic",
    decision: "Decision",
    wordMystery: "Mot mystere",
    wordCatch: "Mots a attraper",
    crossword: "Mot croise",
    arrowWord: "Mot fleche",
    definitionLink: "Definitions",
    cloze: "Texte a completer",
    folderSort: "Dossier a trier",
    schemaSpot: "Erreur de schema",
    chainRepair: "Chaine a reparer",
    debugBlocks: "Debug Scratch",
    variableTrace: "Variable",
    conditionLoop: "Condition ou boucle",
    aiTraining: "Donnees d'entrainement",
    specFilter: "Cahier des charges",
    mapExplore: "Carte a explorer",
    assembly: "Table de montage",
    compare: "Comparateur",
    miniInvestigation: "Mini-enquete"
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
    "la preparation d'un document technique",
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

  function enValue(value) {
    if (typeof value === "string") {
      return window.TechnoI18n?.translateChallengeText(value, "en") || value;
    }
    if (Array.isArray(value)) return value.map(enValue);
    if (value && typeof value === "object") {
      return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, enValue(item)]));
    }
    return value;
  }

  function withEnglish(challenge) {
    const fields = [
      "title",
      "prompt",
      "coursePoint",
      "choices",
      "categories",
      "steps",
      "pool",
      "clues",
      "pairs",
      "items",
      "folders",
      "hotspots",
      "blocks",
      "trace",
      "cards",
      "components",
      "wordBank",
      "answers",
      "parts",
      "cells",
      "rows",
      "letters",
      "gridSize",
      "sceneTitle",
      "target",
      "successFeedback",
      "failureFeedback"
    ];
    const en = {};
    fields.forEach((field) => {
      if (challenge[field] !== undefined) en[field] = enValue(challenge[field]);
    });
    return { ...challenge, en: { ...en, ...(challenge.en || {}) } };
  }

  function uniqueChoices(choices) {
    const seen = new Set();
    return choices.filter((item) => {
      const key = String(item.label || item);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function concept(theme, level, index, offset = 0) {
    return pick(theme.concepts[level], index + offset);
  }

  function classification(theme, level, index, offset = 0) {
    return pick(theme.classifications[level], index + offset);
  }

  function diagnostic(theme, level, index, offset = 0) {
    return pick(theme.diagnostics[level], index + offset);
  }

  function decision(theme, level, index, offset = 0) {
    return pick(theme.decisions[level], index + offset);
  }

  function themeAssembly(theme) {
    const packs = {
      ai: ["jeu de donnees varie", "critere de test", "exemples equilibres", "moteur plus gros sans calcul", "donnees personnelles publiees"],
      energy: ["source adaptee", "moteur dimensionne", "mesure des pertes", "capteur decoratif", "voyant inutile"],
      scratch: ["evenement de depart", "condition claire", "variable utile", "batterie enorme", "roue supplementaire"],
      locomotion: ["frein adapte", "transmission coherente", "test d'usage", "serveur inutile", "donnees personnelles publiees"],
      energyChain: ["alimenter", "convertir", "transmettre", "classer des images", "envoyer un message"],
      informationChain: ["acquerir", "traiter", "communiquer", "stocker de l'energie", "faire tourner une roue"]
    };
    return packs[theme.id] || packs.scratch;
  }

  function mapTarget(theme) {
    const targets = {
      ai: "ilot donnees",
      energy: "banc energie",
      scratch: "poste programmation",
      locomotion: "piste d'essai",
      energyChain: "chaine d'energie",
      informationChain: "chaine d'information"
    };
    return targets[theme.id] || "poste de test";
  }

  function normalizePuzzleText(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toUpperCase()
      .replace(/[^A-Z]/g, " ")
      .trim();
  }

  const PUZZLE_TERMS = {
    ai: {
      "5e": [
        { word: "DONNEE", label: "donnee", clue: "Information donnee au systeme.", en: { word: "DATA", label: "data", clue: "Information given to the system." } },
        { word: "MODELE", label: "modele", clue: "Regle apprise avec des exemples.", en: { word: "MODEL", label: "model", clue: "Rule learned from examples." } },
        { word: "TEST", label: "test", clue: "Essai qui verifie une reponse.", en: { word: "TEST", label: "test", clue: "Trial used to check an answer." } },
        { word: "EXEMPLE", label: "exemple", clue: "Cas donne pour apprendre.", en: { word: "EXAMPLE", label: "example", clue: "Case used for learning." } }
      ],
      "4e": [
        { word: "BIAIS", label: "biais", clue: "Desequilibre qui peut fausser une reponse.", en: { word: "BIAS", label: "bias", clue: "Imbalance that can distort an answer." } },
        { word: "TEST", label: "test", clue: "Jeu garde pour verifier le modele.", en: { word: "TEST", label: "test", clue: "Set kept to check the model." } },
        { word: "TRI", label: "tri", clue: "Rangement dans des groupes.", en: { word: "SORT", label: "sort", clue: "Putting items into groups." } },
        { word: "SCORE", label: "score", clue: "Nombre qui resume un resultat.", en: { word: "SCORE", label: "score", clue: "Number that sums up a result." } }
      ],
      "3e": [
        { word: "DONNEE", label: "donnee", clue: "Information utilisee par le modele.", en: { word: "DATA", label: "data", clue: "Information used by the model." } },
        { word: "CRITERE", label: "critere", clue: "Point mesure pour juger un resultat.", en: { word: "CRITERIA", label: "criteria", clue: "Point measured to judge a result." } },
        { word: "MODELE", label: "modele", clue: "Systeme qui apprend a partir de donnees.", en: { word: "MODEL", label: "model", clue: "System that learns from data." } },
        { word: "PRIVE", label: "prive", clue: "A proteger quand une donnee identifie quelqu'un.", en: { word: "PRIVATE", label: "private", clue: "To protect when data identifies someone." } }
      ]
    },
    energy: {
      "5e": [
        { word: "PILE", label: "pile", clue: "Petite source d'energie electrique.", en: { word: "CELL", label: "cell", clue: "Small source of electrical energy." } },
        { word: "MOTEUR", label: "moteur", clue: "Element qui produit un mouvement.", en: { word: "MOTOR", label: "motor", clue: "Part that produces movement." } },
        { word: "LAMPE", label: "lampe", clue: "Element qui transforme l'electricite en lumiere.", en: { word: "LAMP", label: "lamp", clue: "Part that turns electricity into light." } },
        { word: "SOURCE", label: "source", clue: "Ce qui fournit l'energie.", en: { word: "SOURCE", label: "source", clue: "What supplies energy." } }
      ],
      "4e": [
        { word: "PERTE", label: "perte", clue: "Energie recue mais non utile.", en: { word: "LOSS", label: "loss", clue: "Energy received but not useful." } },
        { word: "SOURCE", label: "source", clue: "Origine de l'energie du systeme.", en: { word: "SOURCE", label: "source", clue: "Origin of the system's energy." } },
        { word: "MOTEUR", label: "moteur", clue: "Element qui convertit en mouvement.", en: { word: "MOTOR", label: "motor", clue: "Part that converts into movement." } },
        { word: "BATTERIE", label: "batterie", clue: "Element qui stocke de l'energie.", en: { word: "BATTERY", label: "battery", clue: "Part that stores energy." } }
      ],
      "3e": [
        { word: "BILAN", label: "bilan", clue: "Comparaison entre energie recue, utile et perdue.", en: { word: "AUDIT", label: "audit", clue: "Comparison of input, useful and lost energy." } },
        { word: "IMPACT", label: "impact", clue: "Effet d'un choix sur l'environnement.", en: { word: "IMPACT", label: "impact", clue: "Effect of a choice on the environment." } },
        { word: "SOBRIETE", label: "sobriete", clue: "Reduire le besoin avant d'ajouter de la puissance.", en: { word: "SAVING", label: "saving", clue: "Reducing need before adding power." } },
        { word: "SOURCE", label: "source", clue: "Origine de l'energie choisie.", en: { word: "SOURCE", label: "source", clue: "Origin of the chosen energy." } }
      ]
    },
    scratch: {
      "5e": [
        { word: "BOUCLE", label: "boucle", clue: "Bloc qui repete des instructions.", en: { word: "LOOP", label: "loop", clue: "Block that repeats instructions." } },
        { word: "TEST", label: "test", clue: "Verification avant de valider un programme.", en: { word: "TEST", label: "test", clue: "Check before accepting a program." } },
        { word: "LUTIN", label: "lutin", clue: "Objet programmable dans Scratch.", en: { word: "SPRITE", label: "sprite", clue: "Programmable object in Scratch." } },
        { word: "ACTION", label: "action", clue: "Ce que le programme fait faire.", en: { word: "ACTION", label: "action", clue: "What the program makes happen." } }
      ],
      "4e": [
        { word: "VARIABLE", label: "variable", clue: "Memoire qui change pendant le programme.", en: { word: "VARIABLE", label: "variable", clue: "Memory that changes during the program." } },
        { word: "MESSAGE", label: "message", clue: "Signal envoye entre scripts.", en: { word: "MESSAGE", label: "message", clue: "Signal sent between scripts." } },
        { word: "CAPTEUR", label: "capteur", clue: "Entree qui fournit une information.", en: { word: "SENSOR", label: "sensor", clue: "Input that provides information." } },
        { word: "TEST", label: "test", clue: "Condition qui verifie vrai ou faux.", en: { word: "TEST", label: "test", clue: "Condition that checks true or false." } }
      ],
      "3e": [
        { word: "LISTE", label: "liste", clue: "Structure qui stocke plusieurs valeurs.", en: { word: "LIST", label: "list", clue: "Structure storing several values." } },
        { word: "DEBUG", label: "debug", clue: "Recherche et correction d'une erreur.", en: { word: "DEBUG", label: "debug", clue: "Finding and fixing a mistake." } },
        { word: "TEST", label: "test", clue: "Essai pour verifier un comportement.", en: { word: "TEST", label: "test", clue: "Trial to check behavior." } },
        { word: "MODULE", label: "module", clue: "Bloc de programme reutilisable.", en: { word: "MODULE", label: "module", clue: "Reusable program block." } }
      ]
    },
    locomotion: {
      "5e": [
        { word: "ROUE", label: "roue", clue: "Piece qui facilite le roulement.", en: { word: "WHEEL", label: "wheel", clue: "Part that helps rolling." } },
        { word: "FREIN", label: "frein", clue: "Systeme qui ralentit ou arrete.", en: { word: "BRAKE", label: "brake", clue: "System that slows or stops." } },
        { word: "TRAIN", label: "train", clue: "Moyen de transport sur rails.", en: { word: "TRAIN", label: "train", clue: "Transport that runs on rails." } },
        { word: "VELO", label: "velo", clue: "Moyen de transport a pedales.", en: { word: "BIKE", label: "bike", clue: "Pedal-powered transport." } }
      ],
      "4e": [
        { word: "FREIN", label: "frein", clue: "Organe essentiel pour la securite.", en: { word: "BRAKE", label: "brake", clue: "Key part for safety." } },
        { word: "ROUE", label: "roue", clue: "Element en contact avec le sol.", en: { word: "WHEEL", label: "wheel", clue: "Part in contact with the ground." } },
        { word: "COUPLE", label: "couple", clue: "Effort de rotation d'un moteur.", en: { word: "TORQUE", label: "torque", clue: "Rotating force from a motor." } },
        { word: "SECURITE", label: "securite", clue: "Protection des usagers.", en: { word: "SAFETY", label: "safety", clue: "Protection for users." } }
      ],
      "3e": [
        { word: "USAGE", label: "usage", clue: "Maniere reelle d'utiliser un transport.", en: { word: "USE", label: "use", clue: "Real way a transport is used." } },
        { word: "IMPACT", label: "impact", clue: "Effet sur les ressources et emissions.", en: { word: "IMPACT", label: "impact", clue: "Effect on resources and emissions." } },
        { word: "VELO", label: "velo", clue: "Solution adaptee a certains trajets courts.", en: { word: "BIKE", label: "bike", clue: "Solution suited to some short trips." } },
        { word: "TRAJET", label: "trajet", clue: "Parcours realise par l'utilisateur.", en: { word: "TRIP", label: "trip", clue: "Journey made by the user." } }
      ]
    },
    energyChain: {
      "5e": [
        { word: "PILE", label: "pile", clue: "Element qui alimente le systeme.", en: { word: "CELL", label: "cell", clue: "Part that powers the system." } },
        { word: "MOTEUR", label: "moteur", clue: "Element qui convertit en mouvement.", en: { word: "MOTOR", label: "motor", clue: "Part that converts into movement." } },
        { word: "ROUE", label: "roue", clue: "Element qui recoit le mouvement.", en: { word: "WHEEL", label: "wheel", clue: "Part receiving movement." } },
        { word: "CABLE", label: "cable", clue: "Element qui conduit l'electricite.", en: { word: "WIRE", label: "wire", clue: "Part that carries electricity." } }
      ],
      "4e": [
        { word: "MOTEUR", label: "moteur", clue: "Actionneur qui produit un mouvement.", en: { word: "MOTOR", label: "motor", clue: "Actuator that creates movement." } },
        { word: "BATTERIE", label: "batterie", clue: "Stockage d'energie electrique.", en: { word: "BATTERY", label: "battery", clue: "Storage for electrical energy." } },
        { word: "RELAIS", label: "relais", clue: "Commande la puissance vers un moteur.", en: { word: "RELAY", label: "relay", clue: "Controls power sent to a motor." } },
        { word: "PERTE", label: "perte", clue: "Energie dissipee sans action utile.", en: { word: "LOSS", label: "loss", clue: "Energy dissipated without useful action." } }
      ],
      "3e": [
        { word: "SOURCE", label: "source", clue: "Origine de l'energie.", en: { word: "SOURCE", label: "source", clue: "Origin of energy." } },
        { word: "PERTES", label: "pertes", clue: "Energie non utilisee efficacement.", en: { word: "LOSSES", label: "losses", clue: "Energy not used effectively." } },
        { word: "ACTION", label: "action", clue: "Effet obtenu en fin de chaine.", en: { word: "ACTION", label: "action", clue: "Effect obtained at the end of the chain." } },
        { word: "IMPACT", label: "impact", clue: "Effet technique ou environnemental.", en: { word: "IMPACT", label: "impact", clue: "Technical or environmental effect." } }
      ]
    },
    informationChain: {
      "5e": [
        { word: "CAPTEUR", label: "capteur", clue: "Composant qui detecte ou mesure.", en: { word: "SENSOR", label: "sensor", clue: "Part that detects or measures." } },
        { word: "SIGNAL", label: "signal", clue: "Information transmise par le systeme.", en: { word: "SIGNAL", label: "signal", clue: "Information sent by the system." } },
        { word: "ECRAN", label: "ecran", clue: "Element qui affiche une information.", en: { word: "SCREEN", label: "screen", clue: "Part that displays information." } },
        { word: "CABLE", label: "cable", clue: "Liaison qui transporte une information.", en: { word: "CABLE", label: "cable", clue: "Link that carries information." } }
      ],
      "4e": [
        { word: "RESEAU", label: "reseau", clue: "Ensemble d'equipements qui communiquent.", en: { word: "NETWORK", label: "network", clue: "Set of devices that communicate." } },
        { word: "DONNEE", label: "donnee", clue: "Information stockee ou transmise.", en: { word: "DATA", label: "data", clue: "Information stored or sent." } },
        { word: "CAPTEUR", label: "capteur", clue: "Entree qui mesure une grandeur.", en: { word: "SENSOR", label: "sensor", clue: "Input that measures something." } },
        { word: "SIGNAL", label: "signal", clue: "Information qui circule dans le systeme.", en: { word: "SIGNAL", label: "signal", clue: "Information moving through the system." } }
      ],
      "3e": [
        { word: "DONNEE", label: "donnee", clue: "Information a proteger ou traiter.", en: { word: "DATA", label: "data", clue: "Information to protect or process." } },
        { word: "SERVEUR", label: "serveur", clue: "Ordinateur qui rend un service sur le reseau.", en: { word: "SERVER", label: "server", clue: "Computer providing a network service." } },
        { word: "RESEAU", label: "reseau", clue: "Liaison entre plusieurs equipements.", en: { word: "NETWORK", label: "network", clue: "Link between several devices." } },
        { word: "ACCES", label: "acces", clue: "Droit d'utiliser une donnee ou un service.", en: { word: "ACCESS", label: "access", clue: "Right to use data or a service." } }
      ]
    }
  };

  function puzzleTerms(theme, level, index, lang = "fr") {
    const source = PUZZLE_TERMS[theme.id]?.[level] || PUZZLE_TERMS[theme.id]?.["5e"] || PUZZLE_TERMS.scratch["5e"];
    return rotatedChoices(source, index).map((term) => {
      const localized = lang === "en" ? term.en || {} : {};
      const word = normalizePuzzleText(localized.word || term.word).replace(/\s+/g, "").slice(0, 10);
      return {
        word,
        label: localized.label || term.label,
        clue: localized.clue || term.clue
      };
    }).filter((term) => /^[A-Z]{3,10}$/.test(term.word));
  }

  function puzzleWord(label) {
    const tokens = normalizePuzzleText(label).split(/\s+/).filter(Boolean);
    const candidate = tokens
      .filter((token) => token.length >= 3)
      .sort((a, b) => Math.abs(6 - a.length) - Math.abs(6 - b.length) || b.length - a.length)[0]
      || tokens.join("")
      || "TECHNO";
    return candidate.slice(0, 10);
  }

  function findSharedLetter(first, second) {
    for (let firstIndex = 0; firstIndex < first.length; firstIndex += 1) {
      for (let secondIndex = 0; secondIndex < second.length; secondIndex += 1) {
        if (first[firstIndex] === second[secondIndex]) return { firstIndex, secondIndex };
      }
    }
    return null;
  }

  function puzzleLetters(words, seed) {
    const letters = [...new Set(words.join("").split(""))];
    "AEIOURSTLNMCGPDBF".split("").forEach((letter) => {
      if (letters.length < 12 && !letters.includes(letter)) letters.push(letter);
    });
    return rotatedChoices(letters, seed);
  }

  function clueWithLength(clue, word, letterLabel) {
    return `${clue} (${word.length} ${letterLabel})`;
  }

  function buildCrosswordData(terms, seed, letterLabel = "lettres") {
    const items = terms.length >= 2 ? terms : puzzleTerms(THEMES[0], "5e", seed);
    const firstItem = items[0];
    const firstWord = firstItem.word || puzzleWord(firstItem.label);
    let secondItem = items[1] || items[0];
    let secondWord = secondItem.word || puzzleWord(secondItem.label);
    let cross = findSharedLetter(firstWord, secondWord);
    for (let index = 1; index < items.length && !cross; index += 1) {
      const candidate = items[index].word || puzzleWord(items[index].label);
      const candidateCross = findSharedLetter(firstWord, candidate);
      if (candidateCross) {
        secondItem = items[index];
        secondWord = candidate;
        cross = candidateCross;
      }
    }
    if (!cross) {
      secondItem = { word: `${firstWord[0]}TEST`, label: "test", clue: "Mot de secours pour completer la grille." };
      secondWord = secondItem.word;
      cross = { firstIndex: 0, secondIndex: 0 };
    }

    const cells = [];
    const addCell = (row, col, answer, label = "") => {
      const existing = cells.find((cell) => cell.row === row && cell.col === col);
      if (existing) {
        if (label) existing.label = existing.label ? `${existing.label}/${label}` : label;
        return;
      }
      cells.push({ row, col, answer, label });
    };
    for (let col = 0; col < firstWord.length; col += 1) {
      addCell(cross.secondIndex, col, firstWord[col], col === 0 ? "1" : "");
    }
    for (let row = 0; row < secondWord.length; row += 1) {
      addCell(row, cross.firstIndex, secondWord[row], row === 0 ? "2" : "");
    }

    return {
      gridSize: { rows: secondWord.length, cols: firstWord.length },
      cells: cells.sort((a, b) => a.row - b.row || a.col - b.col),
      clues: [
        `1 -> ${clueWithLength(firstItem.clue, firstWord, letterLabel)}`,
        `2 v ${clueWithLength(secondItem.clue, secondWord, letterLabel)}`
      ],
      letters: puzzleLetters([firstWord, secondWord], seed),
      answers: [firstWord, secondWord],
      wordBank: items.slice(0, 4).map((item) => item.label)
    };
  }

  function buildArrowWordData(terms, seed, letterLabel = "lettres") {
    const items = terms.length >= 3 ? terms : puzzleTerms(THEMES[0], "5e", seed);
    const rows = items.slice(0, 3).map((item, index) => ({
      clue: clueWithLength(item.clue, item.word, letterLabel),
      label: item.label,
      answer: item.word || puzzleWord(item.label),
      index: index + 1
    }));
    return {
      rows,
      letters: puzzleLetters(rows.map((row) => row.answer), seed),
      answers: rows.map((row) => row.answer),
      wordBank: items.slice(0, 4).map((item) => item.label)
    };
  }

  function buildMiniChallenge(theme, level, type, index, context, situation, challenge) {
    if (type === "wordMystery") {
      const item = concept(theme, level, index);
      const next = concept(theme, level, index, 1);
      return withEnglish({
        ...challenge,
        interaction: "choice",
        title: `${theme.label} : mot mystere`,
        prompt: `Atelier : ${situation}. Quel mot de techno correspond a cette definition pour ${context} ?`,
        coursePoint: `A retenir : "${item[0]}" veut dire ${item[1]}. Avant de choisir une solution, on nomme d'abord ce que l'on observe.`,
        clues: [
          `Definition : ${item[1]}.`,
          `Theme : ${theme.label}.`,
          `Situation : ${situation}.`
        ],
        choices: rotatedChoices(uniqueChoices([
          choice(item[0], true, "Oui, c'est le bon mot."),
          choice(item[2], false, "Non : ce mot appartient a une autre partie du systeme."),
          choice(item[3], false, "Non : ce mot ne correspond pas a la definition."),
          choice(next[0], false, "Presque, mais la definition demandee est differente.")
        ]), index)
      });
    }

    if (type === "wordCatch") {
      const first = concept(theme, level, index);
      const second = concept(theme, level, index, 1);
      return withEnglish({
        ...challenge,
        interaction: "multiSelect",
        title: `${theme.label} : mots a attraper`,
        prompt: `Atelier : ${situation}. Selectionne seulement les deux mots utiles pour ${context}.`,
        coursePoint: `Les deux mots a garder sont "${first[0]}" et "${second[0]}". Les autres mots sont des intrus pour cette situation.`,
        successFeedback: "Bon tri : les deux mots utiles sont selectionnes.",
        failureFeedback: "Reverifie : il faut deux mots utiles, sans intrus.",
        choices: rotatedChoices(uniqueChoices([
          choice(first[0], true, "A garder."),
          choice(second[0], true, "A garder."),
          choice(first[2], false, "Intrus pour cette situation."),
          choice(second[3], false, "Intrus pour cette situation."),
          choice(first[3], false, "Intrus pour cette situation.")
        ]), index)
      });
    }

    if (type === "crossword") {
      const puzzleSeed = index + Math.floor(index / TYPES.length);
      const terms = puzzleTerms(theme, level, puzzleSeed, "fr");
      const puzzle = buildCrosswordData(terms, puzzleSeed, "lettres");
      const enTerms = puzzleTerms(theme, level, puzzleSeed, "en");
      const enPuzzle = buildCrosswordData(enTerms, puzzleSeed, "letters");
      return withEnglish({
        ...challenge,
        interaction: "wordGrid",
        title: `${theme.label} : mot croise`,
        prompt: `Atelier : ${situation}. Complete le mot croise avec la banque de mots du theme ${theme.label}.`,
        coursePoint: `Utilise les definitions, le nombre de lettres et la banque de mots pour retrouver le vocabulaire du cours.`,
        clues: puzzle.clues,
        gridSize: puzzle.gridSize,
        cells: puzzle.cells,
        letters: puzzle.letters,
        answers: puzzle.answers,
        wordBank: puzzle.wordBank,
        successFeedback: "La grille est complete.",
        failureFeedback: "Au moins une lettre ne correspond pas au mot attendu.",
        en: {
          title: `${enValue(theme.label)}: crossword`,
          prompt: `Workshop: ${enValue(situation)}. Complete the crossword with the ${enValue(theme.label)} word bank.`,
          coursePoint: "Use the clues, letter count and word bank to find the course vocabulary.",
          clues: enPuzzle.clues,
          gridSize: enPuzzle.gridSize,
          cells: enPuzzle.cells,
          letters: enPuzzle.letters,
          answers: enPuzzle.answers,
          wordBank: enPuzzle.wordBank,
          successFeedback: "The grid is complete.",
          failureFeedback: "At least one letter does not match the expected word."
        }
      });
    }

    if (type === "arrowWord") {
      const puzzleSeed = index + Math.floor(index / TYPES.length);
      const terms = puzzleTerms(theme, level, puzzleSeed, "fr");
      const puzzle = buildArrowWordData(terms, puzzleSeed, "lettres");
      const enTerms = puzzleTerms(theme, level, puzzleSeed, "en");
      const enPuzzle = buildArrowWordData(enTerms, puzzleSeed, "letters");
      return withEnglish({
        ...challenge,
        interaction: "arrowWords",
        title: `${theme.label} : mot fleche`,
        prompt: `Atelier ${theme.label} : ${situation}. Lis chaque definition, puis complete les mots fleches avec la banque de mots.`,
        coursePoint: `Le nombre de lettres et la banque de mots aident a choisir le bon vocabulaire sans deviner au hasard.`,
        rows: puzzle.rows,
        letters: puzzle.letters,
        answers: puzzle.answers,
        wordBank: puzzle.wordBank,
        successFeedback: "Les mots fleches sont completes.",
        failureFeedback: "Une ligne contient encore une mauvaise lettre.",
        en: {
          title: `${enValue(theme.label)}: arrow words`,
          prompt: `${enValue(theme.label)} workshop: ${enValue(situation)}. Read each clue, then complete the arrow words with the word bank.`,
          coursePoint: "The letter count and word bank help you choose the right vocabulary without guessing.",
          rows: enPuzzle.rows,
          letters: enPuzzle.letters,
          answers: enPuzzle.answers,
          wordBank: enPuzzle.wordBank,
          successFeedback: "The arrow words are complete.",
          failureFeedback: "One line still contains a wrong letter."
        }
      });
    }

    if (type === "definitionLink") {
      const pairs = [0, 1, 2].map((offset) => {
        const item = concept(theme, level, index, offset);
        return { left: item[0], right: item[1] };
      });
      return withEnglish({
        ...challenge,
        interaction: "matching",
        title: `${theme.label} : definitions`,
        prompt: `Contexte : ${context}. Atelier : ${situation}. Relie chaque mot a la bonne definition.`,
        coursePoint: `Quand le vocabulaire est clair, on evite de confondre une piece, une fonction et une action.`,
        successFeedback: "Les mots sont relies aux bonnes definitions.",
        failureFeedback: "Une association est a reprendre.",
        pairs
      });
    }

    if (type === "cloze") {
      const first = concept(theme, level, index);
      const second = concept(theme, level, index, 1);
      return withEnglish({
        ...challenge,
        interaction: "cloze",
        title: `${theme.label} : texte a completer`,
        prompt: `Pour ${context}, pendant ${situation}, complete la phrase avec les deux mots qui conviennent.`,
        coursePoint: `Ici, l'ordre attendu est "${first[0]}" puis "${second[0]}". Un mot mal place change le sens.`,
        parts: [`Pour ${context}, on repere d'abord `, ", puis on utilise ", " pour expliquer le choix."],
        answers: [first[0], second[0]],
        wordBank: rotatedChoices([first[0], second[0], first[2], second[3]], index),
        successFeedback: "Phrase correcte.",
        failureFeedback: "La phrase ne garde pas le bon sens technique."
      });
    }

    if (type === "folderSort") {
      const first = classification(theme, level, index);
      const second = classification(theme, level, index, 1);
      const folders = uniqueChoices([
        { id: first[1], label: first[1] },
        { id: second[1], label: second[1] },
        { id: "hors sujet", label: "hors sujet" }
      ]);
      return withEnglish({
        ...challenge,
        interaction: "folderSort",
        title: `${theme.label} : dossier a trier`,
        prompt: `Dossier de seance ${theme.label} : ${situation}. Pour ${context}, classe les trois documents dans les bons dossiers.`,
        coursePoint: `Un dossier technique doit separer ce qui releve de la fonction, du composant ou du hors sujet.`,
        folders,
        items: [
          { label: first[0], target: first[1] },
          { label: second[0], target: second[1] },
          { label: first[2], target: "hors sujet" }
        ],
        successFeedback: "Classement valide.",
        failureFeedback: "Au moins un document n'est pas dans le bon dossier.",
        en: {
          prompt: `Lesson file ${enValue(theme.label)}: ${enValue(situation)}. For ${enValue(context)}, sort the three documents into the right folders.`
        }
      });
    }

    if (type === "schemaSpot") {
      const diag = diagnostic(theme, level, index);
      return withEnglish({
        ...challenge,
        interaction: "hotspot",
        title: `${theme.label} : erreur de schema`,
        prompt: `Atelier : ${situation}. ${diag[0]} Quelle piste explique le mieux le probleme ?`,
        coursePoint: `On ne corrige pas au hasard : on part du symptome, puis on choisit une piste a verifier. Ici : ${diag[1]}.`,
        sceneTitle: "pistes du systeme",
        hotspots: rotatedChoices([
          choice(diag[1], true, "C'est la piste a verifier."),
          choice(diag[2], false, "Cette piste n'explique pas le symptome."),
          choice(diag[3], false, "Cette piste ferait chercher au mauvais endroit."),
          choice("decor de la salle", false, "Le decor n'est pas une fonction technique.")
        ], index)
      });
    }

    if (type === "chainRepair") {
      const steps = pick(theme.sequences[level], index);
      const pool = rotatedChoices(steps.map((label, order) => ({ label, order })), index + 2);
      return withEnglish({
        ...challenge,
        interaction: "chain",
        title: `${theme.label} : chaine a reparer`,
        prompt: `Pour ${context}, pendant ${situation}, remets cette chaine dans le bon ordre.`,
        coursePoint: `Ordre attendu : ${sequenceText(steps)}. On lit la chaine de ce qui entre vers ce qui sort.`,
        steps,
        pool,
        successFeedback: "La chaine est dans le bon ordre.",
        failureFeedback: "Il y a encore une inversion dans la chaine."
      });
    }

    if (type === "debugBlocks") {
      const facts = theme.truths[level];
      const wrongFact = facts.find((fact) => fact[1] === false) || facts[0];
      const rightFact = facts.find((fact) => fact[1] === true) || facts[1];
      const extra = pick(facts, index + 2);
      return withEnglish({
        ...challenge,
        interaction: "debugBlocks",
        title: `${theme.label} : debug`,
        prompt: `Atelier : ${situation}. Une affirmation est fausse dans le raisonnement. Laquelle faut-il corriger pour ${context} ?`,
        coursePoint: `Debugger, c'est reperer l'erreur precise avant d'ajouter ou de supprimer des blocs.`,
        choices: rotatedChoices(uniqueChoices([
          choice(wrongFact[0], true, "Oui, c'est cette affirmation qu'il faut corriger."),
          choice(rightFact[0], false, "Cette affirmation est correcte."),
          choice(extra[0], false, extra[1] === false ? "Elle peut etre discutee, mais ce n'est pas l'erreur demandee." : "Cette affirmation peut rester."),
          choice("Tester avant de conclure.", false, "Tester est une bonne habitude, ce n'est pas l'erreur.")
        ]), index)
      });
    }

    if (type === "variableTrace") {
      const start = (index % 4) + 2;
      const add = (level === "5e" ? 2 : level === "4e" ? 3 : 4);
      const multiply = level === "5e" ? 2 : 3;
      const afterAdd = start + add;
      const answer = afterAdd * multiply - 1;
      const values = [answer, answer + 1, afterAdd, start + multiply, answer - 2, answer + 3];
      const uniqueValues = [...new Set(values)].slice(0, 4);
      return withEnglish({
        ...challenge,
        interaction: "variableTrace",
        title: `${theme.label} : variable`,
        prompt: `Pour ${context}, pendant ${situation}, calcule la valeur finale de "scoreTest".`,
        coursePoint: `On part de ${start}, puis on applique chaque operation dans l'ordre : + ${add}, x ${multiply}, - 1.`,
        trace: {
          variable: "scoreTest",
          start,
          operations: [`+ ${add}`, `x ${multiply}`, "- 1"]
        },
        choices: rotatedChoices(uniqueValues.map((value) => choice(
          String(value),
          value === answer,
          value === answer
            ? "Oui, toutes les operations sont prises en compte."
            : value === answer + 1
              ? "Il manque la derniere operation."
              : value === afterAdd
                ? "La multiplication a ete oubliee."
                : "Les operations ne sont pas appliquees dans le bon ordre."
        )), index)
      });
    }

    if (type === "conditionLoop") {
      const options = level === "5e"
        ? ["boucle", "condition", "evenement"]
        : level === "4e"
          ? ["condition", "variable", "message"]
          : ["boucle avec condition d'arret", "liste", "affichage"];
      return withEnglish({
        ...challenge,
        interaction: "choice",
        title: `${theme.label} : condition ou boucle`,
        prompt: `Dans ${theme.label}, pour ${context}, pendant ${situation}, l'action doit recommencer jusqu'a ce que le test soit bon. Quel bloc convient ?`,
        coursePoint: `Si une action recommence tant qu'une condition n'est pas verifiee, on utilise une boucle controlee.`,
        choices: rotatedChoices([
          choice(options[0], true, "Bon choix : il permet de repeter jusqu'au bon resultat."),
          choice(options[1], false, "Ce bloc peut aider, mais il ne repete pas l'action."),
          choice(options[2], false, "Ce choix ne gere pas la repetition.")
        ], index),
        en: {
          prompt: `In ${enValue(theme.label)}, for ${enValue(context)}, during ${enValue(situation)}, the action must repeat until the test is correct. Which block fits?`
        }
      });
    }

    if (type === "aiTraining") {
      const goodOne = theme.id === "ai" ? "exemples varies" : "mesures fiables";
      const goodTwo = theme.id === "ai" ? "jeu de test separe" : "criteres de test clairs";
      return withEnglish({
        ...challenge,
        interaction: "multiSelect",
        title: `${theme.label} : donnees d'entrainement`,
        prompt: `Contexte : ${context}. Atelier : ${situation}. Que faut-il garder pour rendre l'essai plus fiable ?`,
        coursePoint: `Un test fiable repose sur des exemples varies, des mesures correctes et des criteres de test.`,
        successFeedback: "Le test devient plus fiable.",
        failureFeedback: "Il manque un element fiable ou un element fragile a ete retenu.",
        choices: rotatedChoices([
          choice(goodOne, true, "A garder : cela rend le test plus solide."),
          choice(goodTwo, true, "A garder : cela aide a verifier le resultat."),
          choice("un seul exemple", false, "Un seul exemple ne suffit pas a valider."),
          choice("resultat choisi au hasard", false, "Le hasard ne prouve pas le fonctionnement."),
          choice("donnees non verifiees", false, "Des donnees non verifiees peuvent tromper.")
        ], index)
      });
    }

    if (type === "specFilter") {
      return withEnglish({
        ...challenge,
        interaction: "multiSelect",
        title: `${theme.label} : cahier des charges`,
        prompt: `Cahier des charges : ${context}. Atelier : ${situation}. Coche les contraintes vraiment utiles.`,
        coursePoint: `Une contrainte doit aider a choisir ou verifier une solution : securite, energie, cout, usage.`,
        successFeedback: "Les contraintes utiles sont bien gardees.",
        failureFeedback: "Il manque une contrainte utile ou un detail inutile a ete garde.",
        choices: rotatedChoices([
          choice("securite de l'utilisateur", true, "A garder : c'est une vraie contrainte."),
          choice("consommation d'energie", true, "A garder : c'est une vraie contrainte."),
          choice("couleur preferee du groupe", false, "Ce n'est pas une contrainte technique prioritaire."),
          choice("nom du fichier", false, "Ce n'est pas un critere de performance."),
          choice("cout maximum", true, "A garder : c'est une vraie contrainte.")
        ], index)
      });
    }

    if (type === "mapExplore") {
      const target = mapTarget(theme);
      return withEnglish({
        ...challenge,
        interaction: "mapHotspot",
        title: `${theme.label} : carte a explorer`,
        prompt: `Atelier : ${situation}. Sur le plan du labo, touche l'endroit ou commencer l'enquete : ${context}.`,
        coursePoint: `On commence par la zone qui permet d'observer, mesurer ou tester le probleme.`,
        sceneTitle: "plan du labo",
        hotspots: rotatedChoices([
          choice(target, true, "Bon point de depart."),
          choice("armoire de rangement", false, "Utile plus tard, mais pas pour commencer."),
          choice("coin affichage", false, "Ce coin sert surtout a presenter les resultats."),
          choice("zone repos", false, "Ce n'est pas une zone de diagnostic.")
        ], index)
      });
    }

    if (type === "assembly") {
      const parts = themeAssembly(theme);
      return withEnglish({
        ...challenge,
        interaction: "multiSelect",
        title: `${theme.label} : table de montage`,
        prompt: `Atelier ${theme.label} : ${situation}. Sur la table de montage, garde seulement les composants utiles pour ${context}.`,
        coursePoint: `Un bon montage repond au besoin. Les composants decoratifs ou hors sujet font perdre du temps.`,
        successFeedback: "La table contient les composants utiles.",
        failureFeedback: "Un composant utile manque ou un intrus est reste sur la table.",
        choices: rotatedChoices([
          choice(parts[0], true, "A garder."),
          choice(parts[1], true, "A garder."),
          choice(parts[2], true, "A garder."),
          choice(parts[3], false, "Intrus pour ce besoin."),
          choice(parts[4], false, "A ecarter.")
        ], index),
        en: {
          prompt: `${enValue(theme.label)} workshop: ${enValue(situation)}. On the assembly table, keep only the useful components for ${enValue(context)}.`
        }
      });
    }

    if (type === "compare") {
      const dec = decision(theme, level, index);
      return withEnglish({
        ...challenge,
        interaction: "compare",
        title: `${theme.label} : comparateur`,
        prompt: `Besoin : ${context}. Situation : ${situation}. Choisis la solution la mieux justifiee.`,
        coursePoint: `Le choix doit repondre au besoin et s'appuyer sur un critere clair. Ici : ${dec[1]}.`,
        cards: rotatedChoices([
          choice(dec[1], true, "Choix justifie."),
          choice(dec[2], false, "Ce choix ne traite pas le besoin principal."),
          choice(dec[3], false, "Ce choix manque de critere technique.")
        ], index)
      });
    }

    if (type === "miniInvestigation") {
      const diag = diagnostic(theme, level, index);
      return withEnglish({
        ...challenge,
        interaction: "choice",
        title: `${theme.label} : mini-enquete`,
        prompt: `Pour ${context}, pendant ${situation}, lis les indices et choisis la piste a verifier en premier.`,
        coursePoint: `En diagnostic, on part des symptomes, puis on choisit une verification simple avant de modifier le systeme.`,
        clues: [
          `Probleme : ${diag[0]}`,
          `Objet : ${context}`,
          `En classe : ${situation}`
        ],
        choices: rotatedChoices([
          choice(diag[1], true, "C'est la piste a verifier d'abord."),
          choice(diag[2], false, "Cette piste ne suit pas les indices."),
          choice(diag[3], false, "Cette piste ferait corriger au hasard.")
        ], index)
      });
    }

    return null;
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
    const miniChallenge = buildMiniChallenge(theme, level, type, index, context, situation, challenge);
    if (miniChallenge) return miniChallenge;

    if (type === "single") {
      const concept = pick(theme.concepts[level], index);
      return {
        ...challenge,
        title: `${theme.label} : role d'un element`,
        prompt: `Dans ${context}, pendant ${situation}, a quoi sert "${concept[0]}" ?`,
        coursePoint: `Ici, "${concept[0]}" correspond a ${concept[1]}. En techno, on relie toujours un element a sa fonction.`,
        choices: rotatedChoices([
          choice(concept[1], true, "Oui, c'est son role ici."),
          choice(concept[2], false, "Non, cela correspond a une autre fonction."),
          choice(concept[3], false, "Non, ce n'est pas le role demande.")
        ], index)
      };
    }

    if (type === "trueFalse") {
      const fact = pick(theme.truths[level], index);
      return {
        ...challenge,
        title: `${theme.label} : vrai ou faux`,
        prompt: `Pendant ${situation}, vrai ou faux ? ${fact[0]}`,
        coursePoint: fact[1]
          ? `C'est vrai : c'est un repere important pour le theme ${theme.label.toLowerCase()}.`
          : `C'est faux : on verifie le role reel d'un element, d'une donnee ou d'une fonction avant de conclure.`,
        choices: rotatedChoices([
          choice("Vrai", fact[1] === true, fact[1] ? "Exact." : "Non, l'affirmation est fausse."),
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
        prompt: `Pour ${theme.label}, avec ${context}, pendant ${situation}, remets les etapes dans l'ordre.`,
        coursePoint: `Ordre attendu : ${sequenceText(steps)}. L'ordre aide a comprendre ce qui declenche, transforme ou produit l'action.`,
        steps,
        pool,
        choices: rotatedChoices([
          choice(sequenceText(steps), true, "L'ordre est correct."),
          choice(wrongSequences(steps)[0], false, "Deux etapes sont inversees."),
          choice(wrongSequences(steps)[1], false, "Une etape arrive trop tot ou trop tard.")
        ], index)
      };
    }

    if (type === "classify") {
      const item = pick(theme.classifications[level], index);
      return {
        ...challenge,
        title: `${theme.label} : classement rapide`,
        prompt: `Dans ${context}, pendant ${situation}, "${item[0]}" correspond surtout a quelle categorie ?`,
        coursePoint: `La bonne categorie est "${item[1]}". Le classement sert a identifier rapidement la fonction dans le systeme.`,
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
        prompt: `${diag[0]} Pendant ${situation}, quelle verification faire en premier ?`,
        coursePoint: `On commence par la cause la plus probable, pas par une modification au hasard. Ici : ${diag[1]}.`,
        choices: rotatedChoices([
          choice(diag[1], true, "Bonne premiere verification."),
          choice(diag[2], false, "Cette piste n'agit pas sur la cause probable."),
          choice(diag[3], false, "Cette action risque de masquer le probleme.")
        ], index)
      };
    }

    const decision = pick(theme.decisions[level], index);
    return {
      ...challenge,
      title: `${theme.label} : choix d'action`,
      prompt: `${decision[0]}. Situation : ${situation}. Quelle decision prendre ?`,
      coursePoint: `Un bon choix repond au besoin et s'appuie sur un critere technique. Ici : ${decision[1]}.`,
      choices: rotatedChoices([
        choice(decision[1], true, "Decision justifiee."),
        choice(decision[2], false, "Ce choix ne repond pas assez au besoin."),
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
