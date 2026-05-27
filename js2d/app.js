(function () {
  const STORAGE_KEY = "techno-cycle-4-manager.v1";
  const LANG_STORAGE_KEY = "techno-cycle-4-manager.lang";
  const TUTORIAL_COLLAPSED_KEY = "techno-cycle-4-manager.tutorialCollapsed";
  const I18N = window.TechnoI18n;

  const icon = (name) => `./assets/idle/icons/${name}.png`;

  const ASSETS = {
    desk: icon("desk"),
    learners: icon("idea"),
    material: icon("tools"),
    teachers: icon("desk"),
    resources: icon("data"),
    mastery: icon("eco"),
    idea: icon("idea"),
    sensor: icon("sensor"),
    motor: icon("motor"),
    gear: icon("gear"),
    battery: icon("battery"),
    router: icon("router"),
    server: icon("server"),
    solar: icon("solar"),
    cart: icon("cart"),
    tools: icon("tools"),
    data: icon("data"),
    eco: icon("eco"),
    incident: icon("incident"),
    classroomHero: "./assets/home/classroom-hero.png",
    studentSprites: Array.from({ length: 16 }, (_, index) => `./assets/students/processed/student-${index + 1}.png`)
  };

  let currentLang = loadLanguage();
  let tutorialCollapsed = loadTutorialCollapsed();

  function loadLanguage() {
    try {
      return I18N?.normalizeLang(localStorage.getItem(LANG_STORAGE_KEY)) || "fr";
    } catch {
      return "fr";
    }
  }

  function loadTutorialCollapsed() {
    try {
      return localStorage.getItem(TUTORIAL_COLLAPSED_KEY) === "1";
    } catch {
      return false;
    }
  }

  function t(key, vars = {}) {
    return I18N?.t(currentLang, key, vars) || key;
  }

  function tr(collection, item, field) {
    return I18N?.entity(currentLang, collection, item.id, field, item[field]) || item[field];
  }

  function trById(collection, id, field, fallback = "") {
    return I18N?.entity(currentLang, collection, id, field, fallback) || fallback;
  }

  function resourceName(key, count = 1) {
    return I18N?.resource(currentLang, key, count) || key;
  }

  function localizeChallenge(challenge) {
    return I18N?.challenge(challenge, currentLang) || challenge;
  }

  function setLanguageChrome() {
    document.documentElement.lang = currentLang;
    document.title = t("appTitle");
  }

  const SPACES = [
    {
      id: "classroom",
      name: "Salle supplementaire",
      icon: "desk",
      description: "Ouvre une nouvelle salle quand toutes les places actuelles sont occupees.",
      baseCost: { resources: 90, material: 45 },
      maxLevel: 5,
      production: { resources: 0.18, mastery: 0.04 },
      effect: "+24 places",
      unlockMastery: 0
    },
    {
      id: "sensorBench",
      name: "Station capteurs",
      icon: "sensor",
      description: "Presence, distance, lumiere : les equipes mesurent puis interpretent.",
      baseCost: { material: 30, resources: 22 },
      maxLevel: 5,
      production: { mastery: 0.24, resources: 0.18 },
      effect: "+savoir-faire",
      unlockMastery: 0
    },
    {
      id: "energyBench",
      name: "Banc energie",
      icon: "motor",
      description: "Batteries, moteurs, engrenages : alimenter, convertir, transmettre.",
      baseCost: { material: 85, resources: 60 },
      maxLevel: 5,
      production: { mastery: 0.42, material: 0.32 },
      effect: "+composants, +savoir-faire",
      unlockMastery: 10
    },
    {
      id: "networkBay",
      name: "Poste donnees",
      icon: "router",
      description: "Postes, switch, serveur : suivre la circulation des donnees.",
      baseCost: { material: 160, resources: 130 },
      maxLevel: 5,
      production: { resources: 0.55, mastery: 0.5 },
      effect: "+documents, +savoir-faire",
      unlockMastery: 30
    },
    {
      id: "fablab",
      name: "Zone prototype",
      icon: "cart",
      description: "Reparer, prototyper, tester et ameliorer un objet technique.",
      baseCost: { material: 360, resources: 280 },
      maxLevel: 5,
      production: { mastery: 1.2, material: 0.85, resources: 0.55 },
      effect: "+projets",
      unlockMastery: 80
    }
  ];

  const RECRUITS = [
    {
      id: "learners",
      name: "Eleve explorateur",
      icon: "learners",
      description: "Un eleve rejoint l'atelier. La premiere equipe peut commencer a observer.",
      baseCost: { resources: 10 },
      firstCost: {},
      production: { resources: 0.08, mastery: 0.03, disorder: 0.005 },
      onHire: { learners: 1 },
      unlockMastery: 0
    },
    {
      id: "tutors",
      name: "Equipe entraide",
      icon: "tools",
      description: "Des eleves structurent les essais et aident les groupes bloques.",
      baseCost: { resources: 25 },
      requires: { learners: 12 },
      production: { resources: 0.28, motivation: 0.07, disorder: -0.02 },
      onHire: { learners: 2 },
      unlockMastery: 10
    },
    {
      id: "teacher",
      name: "Prof-mentor",
      icon: "teachers",
      description: "Questionne les choix, relance les groupes et stabilise la seance.",
      baseCost: { resources: 70, material: 35 },
      production: { resources: 0.9, mastery: 0.28, disorder: -0.02 },
      onHire: { teachers: 1 },
      unlockMastery: 18
    },
    {
      id: "labManager",
      name: "Regisseur atelier",
      icon: "material",
      description: "Prepare les kits, verifie les composants et limite les pertes de temps.",
      baseCost: { resources: 140, material: 120 },
      production: { material: 1.1, motivation: 0.04, disorder: -0.04 },
      onHire: { teachers: 1 },
      unlockMastery: 50
    }
  ];

  const ACTIONS = [
    { id: "observe", name: "Enquete d'usage", icon: "learners", text: "Mini-defi : 5 documents a gagner", requires: { learners: 1 }, reward: { resources: 5, motivation: 0.5 }, penalty: { disorder: 1, motivation: -1 } },
    { id: "inventory", name: "Audit des kits", icon: "material", text: "Mini-defi : 9 composants a gagner", requires: { learners: 1 }, reward: { material: 9, motivation: -0.5 }, penalty: { disorder: 1.5, motivation: -1 } },
    { id: "prepare", name: "Document d'atelier", icon: "resources", text: "Mini-defi : 8 documents a gagner", requires: { learners: 1 }, reward: { resources: 8, motivation: -0.5 }, penalty: { disorder: 1, motivation: -1 } },
    { id: "calm", name: "Retour au calme", icon: "teachers", text: "Mini-defi : -8 agitation", requires: { learners: 2 }, reward: { disorder: -8, motivation: 1 }, penalty: { disorder: 2, motivation: -1 } },
    { id: "playLab", name: "Atelier ludique", icon: "idea", text: "Mini-jeu couteux : +20 savoir-faire, +10 agitation", requires: { learners: 4 }, cost: { resources: 20, material: 8 }, reward: { mastery: 20, motivation: 6, disorder: 10 }, penalty: { disorder: 16, motivation: -4 }, preferredTypes: ["wordCatch", "definitionLink", "compare"] },
    { id: "challenge", name: "Situation-probleme", icon: "cart", text: "Defi complet : 1 jeton savoir", requires: { learners: 4 }, challenge: true }
  ];

  const SIDE_TABS = [
    { id: "teams", label: "Equipes", icon: "learners" },
    { id: "stations", label: "Stations", icon: "tools" },
    { id: "protocols", label: "Protocoles", icon: "mastery" },
    { id: "actions", label: "Actions", icon: "cart" },
    { id: "notes", label: "Notes", icon: "resources" }
  ];

  const KNOWLEDGE = [
    { id: "project", name: "Demarche de projet", icon: "desk", cost: 1, description: "+20 % savoir-faire. Les essais deviennent comparables.", multiplier: { mastery: 1.2 } },
    { id: "maintenance", name: "Reparabilite", icon: "tools", cost: 1, description: "-30 % agitation. Les pannes deviennent des enquetes.", multiplier: { disorder: 0.7 } },
    { id: "network", name: "Donnees et reseaux", icon: "router", cost: 2, description: "+25 % documents produits par les ilots numeriques.", multiplier: { resources: 1.25 } },
    { id: "energy", name: "Chaine d'energie", icon: "solar", cost: 2, description: "+25 % composants exploitables grace aux bons choix techniques.", multiplier: { material: 1.25 } },
    { id: "eco", name: "Impact environnemental", icon: "eco", cost: 3, description: "+15 motivation, +10 savoir-faire.", instant: { motivation: 15, mastery: 10 } }
  ];

  const CAMPAIGN_STAGES = [
    {
      id: "launch",
      title: "Installer le labo",
      summary: "Faire passer la salle vide a une premiere equipe autonome.",
      reward: { resources: 10, motivation: 3 },
      objectives: [
        { id: "firstLearner", text: "Accueillir le premier eleve", target: 1, value: (s) => s.resources.learners },
        { id: "firstDocuments", text: "Preparer des documents de travail", target: 20, scale: true, value: (s) => s.resources.resources },
        { id: "firstTeam", text: "Former une equipe de 4 eleves", target: 4, value: (s) => s.resources.learners }
      ]
    },
    {
      id: "activeClass",
      title: "Classe en activite",
      summary: "Entrer dans le rythme : questions, protocole et premiere station.",
      reward: { material: 12, mastery: 6 },
      objectives: [
        { id: "firstChallenge", text: "Reussir des situations-problemes", target: 2, scale: true, value: (s) => s.stats.challengesSolved },
        { id: "projectProtocol", text: "Valider la demarche de projet", target: 1, value: (s) => s.knowledge.project ? 1 : 0 },
        { id: "sensorStation", text: "Activer la station capteurs", target: 1, value: (s) => s.spaces.sensorBench?.owned ? 1 : 0 },
        { id: "componentStock", text: "Constituer un stock de composants", target: 25, scale: true, value: (s) => s.resources.material }
      ]
    },
    {
      id: "structuredWorkshop",
      title: "Atelier structure",
      summary: "Organiser la classe pour que le labo progresse meme sans clic permanent.",
      reward: { resources: 35, badges: 1 },
      objectives: [
        { id: "twelveLearners", text: "Atteindre 12 eleves actifs", target: 12, value: (s) => s.resources.learners },
        { id: "twoStations", text: "Activer 2 stations techniques", target: 2, value: (s) => ownedStationCount(s) },
        { id: "twoProtocols", text: "Valider 2 protocoles", target: 2, value: (s) => protocolCount(s) },
        { id: "documentReserve", text: "Conserver une reserve de documents", target: 120, scale: true, value: (s) => s.resources.resources }
      ]
    },
    {
      id: "connectedPrototype",
      title: "Prototype connecte",
      summary: "Croiser energie, donnees et essais pour construire une vraie demarche technique.",
      reward: { material: 40, mastery: 18 },
      objectives: [
        { id: "energyBenchReady", text: "Activer le banc energie", target: 1, value: (s) => s.spaces.energyBench?.owned ? 1 : 0 },
        { id: "networkBayReady", text: "Activer le poste donnees", target: 1, value: (s) => s.spaces.networkBay?.owned ? 1 : 0 },
        { id: "tenChallenges", text: "Reussir des defis varies", target: 10, scale: true, value: (s) => s.stats.challengesSolved },
        { id: "secondRoom", text: "Ouvrir une deuxieme salle", target: 2, value: () => classroomCount() }
      ]
    },
    {
      id: "autonomousFablab",
      title: "FabLab autonome",
      summary: "Passer d'une classe organisee a un atelier capable de prototyper.",
      reward: { resources: 60, motivation: 12, badges: 1 },
      objectives: [
        { id: "fablabReady", text: "Activer la zone prototype", target: 1, value: (s) => s.spaces.fablab?.owned ? 1 : 0 },
        { id: "fullRoom", text: "Remplir une salle complete", target: 24, value: (s) => s.resources.learners },
        { id: "fourProtocols", text: "Valider 4 protocoles", target: 4, value: (s) => protocolCount(s) },
        { id: "masteryReserve", text: "Cumuler du savoir-faire", target: 100, scale: true, value: (s) => s.resources.mastery },
        { id: "twentyChallenges", text: "Reussir une serie de defis", target: 20, scale: true, value: (s) => s.stats.challengesSolved }
      ]
    },
    {
      id: "finalExpo",
      title: "Expo Techno finale",
      summary: "Preparer une exposition de fin de cycle avec un labo complet et stable.",
      reward: { motivation: 20, mastery: 35 },
      objectives: [
        { id: "allStations", text: "Activer toutes les stations", target: 4, value: (s) => ownedStationCount(s) },
        { id: "allProtocols", text: "Valider tous les protocoles", target: 5, value: (s) => protocolCount(s) },
        { id: "largeCohort", text: "Former 36 eleves au labo", target: 36, value: (s) => s.resources.learners },
        { id: "finalChallengeSet", text: "Reussir le parcours de defis", target: 35, scale: true, value: (s) => s.stats.challengesSolved },
        { id: "motivatedClass", text: "Garder une classe motivee", target: 70, value: (s) => s.resources.motivation }
      ]
    }
  ];

  const GUIDE_TARGETS = {
    recruit: "recruit",
    action: "action",
    space: "space",
    knowledge: "knowledge"
  };

  const CLASSROOM_SEAT_COUNT = 24;
  const MAX_CLASSROOMS = 6;
  const TICK_INTERVAL_MS = 500;
  const ACTION_COOLDOWN_MS = 10000;
  const LIVE_RESOURCE_KEYS = new Set(["material", "resources", "mastery"]);
  const EQUIPMENT_CYCLE = ["computer", "tablet", "tools", "sensor", "energy", "computer"];

  function defaultState(playerName = t("defaultPlayer"), level = "5e") {
    const cleanName = String(playerName || "").trim() || t("defaultPlayer");
    const cleanLevel = ["5e", "4e", "3e"].includes(level) ? level : "5e";
    return {
      playerName: cleanName,
      level: cleanLevel,
      lang: currentLang,
      resources: { learners: 0, material: 0, teachers: 0, resources: 0, mastery: 0, motivation: 80, disorder: 0 },
      badges: 0,
      spaces: Object.fromEntries(SPACES.map((space) => [
        space.id,
        { owned: false, level: 0 }
      ])),
      recruits: Object.fromEntries(RECRUITS.map((recruit) => [recruit.id, { count: 0, level: 1 }])),
      classrooms: { unlocked: 1, active: 0 },
      students: [],
      knowledge: {},
      progression: { claimedStages: {}, finalLogged: false },
      stats: { challengesSolved: 0, challengeAttempts: 0, totalMastery: 0, recentChallenges: [] },
      gameOver: null,
      lastChallengeAt: Date.now(),
      actionCooldownUntil: 0,
      log: [t("logWelcome", { name: cleanName, level: cleanLevel })],
      createdAt: Date.now(),
      lastTickAt: Date.now()
    };
  }

  let state = loadState();
  let rates = state ? computeRates() : emptyRates();
  let toastTimer = null;
  let pendingProgressToast = null;
  let activeSideTab = "teams";
  let interactionInProgress = false;
  let resetHandledAt = 0;

  function emptyRates() {
    return { learners: 0, material: 0, teachers: 0, resources: 0, mastery: 0, motivation: 0, disorder: 0 };
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const saved = JSON.parse(raw);
      if (!saved?.playerName || !saved?.level) return null;
      const base = defaultState(saved.playerName, saved.level);
      return normalizeStudentRoster({
        ...base,
        ...saved,
        resources: { ...base.resources, ...saved.resources },
        spaces: { ...base.spaces, ...saved.spaces },
        recruits: { ...base.recruits, ...saved.recruits },
        classrooms: { ...base.classrooms, ...saved.classrooms },
        lang: currentLang,
        knowledge: { ...base.knowledge, ...saved.knowledge },
        progression: {
          ...base.progression,
          ...saved.progression,
          claimedStages: { ...base.progression.claimedStages, ...(saved.progression?.claimedStages || {}) }
        },
        stats: { ...base.stats, ...saved.stats },
        gameOver: saved.gameOver || null,
        students: sanitizeStudents(saved.students),
        log: Array.isArray(saved.log) ? saved.log : base.log
      });
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  }

  function sanitizeStudents(students) {
    if (!Array.isArray(students)) return [];
    return students.map((student, index) => ({
      id: typeof student.id === "string" ? student.id : `learner-${index + 1}`,
      variant: Number.isFinite(student.variant) ? Math.abs(Math.floor(student.variant)) % ASSETS.studentSprites.length : index % ASSETS.studentSprites.length,
      joinedAt: Number.isFinite(student.joinedAt) ? student.joinedAt : Date.now()
    }));
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function sanitizeClassrooms(classrooms, learnerCount = 0, classroomLevel = 0) {
    const rawUnlocked = Number.isFinite(classrooms?.unlocked) ? Math.floor(classrooms.unlocked) : 1;
    const savedRooms = Math.max(1, Math.floor(classroomLevel || 0) + 1);
    const neededRooms = Math.max(1, Math.ceil(Math.max(0, learnerCount) / CLASSROOM_SEAT_COUNT));
    const unlocked = clamp(Math.max(rawUnlocked, savedRooms, neededRooms), 1, MAX_CLASSROOMS);
    const rawActive = Number.isFinite(classrooms?.active) ? Math.floor(classrooms.active) : 0;
    return {
      unlocked,
      active: clamp(rawActive, 0, unlocked - 1)
    };
  }

  function normalizeStudentRoster(target) {
    if (!target) return target;
    target.students = sanitizeStudents(target.students);
    const learnerCount = Math.max(0, Math.floor(target.resources?.learners || 0));
    if (target.students.length > learnerCount) target.students = target.students.slice(0, learnerCount);
    const missing = learnerCount - target.students.length;
    if (missing > 0) addStudentSpritesTo(target, missing);
    target.classrooms = sanitizeClassrooms(target.classrooms, learnerCount, target.spaces?.classroom?.level || 0);
    if (target.spaces?.classroom) {
      target.spaces.classroom.level = Math.max(target.spaces.classroom.level || 0, target.classrooms.unlocked - 1);
      target.spaces.classroom.owned = target.spaces.classroom.level > 0;
    }
    return target;
  }

  function addStudentSpritesTo(target, count) {
    if (!target) return;
    target.students = sanitizeStudents(target.students);
    const amount = Math.max(0, Math.floor(count || 0));
    for (let index = 0; index < amount; index += 1) {
      const rosterIndex = target.students.length;
      target.students.push({
        id: `learner-${Date.now()}-${rosterIndex}`,
        variant: rosterIndex % ASSETS.studentSprites.length,
        joinedAt: Date.now()
      });
    }
  }

  function saveState() {
    if (!state) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function computeRates() {
    if (!state || state.gameOver) return emptyRates();
    const next = emptyRates();
    SPACES.forEach((space) => {
      const owned = state.spaces[space.id];
      if (!owned?.owned) return;
      Object.entries(space.production).forEach(([key, value]) => {
        next[key] += value * Math.max(1, owned.level);
      });
    });
    RECRUITS.forEach((recruit) => {
      const hired = state.recruits[recruit.id];
      Object.entries(recruit.production).forEach(([key, value]) => {
        next[key] += value * hired.count * hired.level;
      });
    });
    next.resources *= 0.75 + state.resources.motivation / 220 + state.resources.teachers * 0.025;
    next.material *= multiplier("material");
    next.resources *= multiplier("resources");
    next.mastery *= (0.7 + state.resources.motivation / 180) * multiplier("mastery");
    next.disorder = (0.018 + next.disorder) * multiplier("disorder");
    return next;
  }

  function multiplier(key) {
    if (!state) return 1;
    return KNOWLEDGE.reduce((value, item) => {
      if (state.knowledge[item.id] && item.multiplier?.[key]) return value * item.multiplier[key];
      return value;
    }, 1);
  }

  function format(value) {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
    return `${Math.floor(value)}`;
  }

  function formatLiveValue(key, value) {
    if (!LIVE_RESOURCE_KEYS.has(key)) return format(value);
    if (value > 0 && value < 1) return value.toFixed(2);
    if (value > 0 && value < 10) return value.toFixed(1);
    return format(value);
  }

  function formatRateValue(rate) {
    const absolute = Math.abs(rate);
    if (absolute === 0) return "0";
    if (absolute < 0.1) return absolute.toFixed(2);
    if (absolute < 10) return absolute.toFixed(1);
    return format(absolute);
  }

  function formatRate(rate) {
    const sign = rate >= 0 ? "+" : "-";
    return t("ratePerSecond", { value: `${sign}${formatRateValue(rate)}` });
  }

  function actionCooldownRemaining(now = Date.now()) {
    return Math.max(0, (state?.actionCooldownUntil || 0) - now);
  }

  function startActionCooldown() {
    if (!state) return;
    state.actionCooldownUntil = Date.now() + ACTION_COOLDOWN_MS;
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function canPay(cost = {}) {
    if (!state) return false;
    return Object.entries(cost).every(([key, value]) => (state.resources[key] || 0) >= value);
  }

  function canMeet(requirements = {}) {
    if (!state) return false;
    return Object.entries(requirements).every(([key, value]) => (state.resources[key] || 0) >= value);
  }

  function pay(cost = {}) {
    if (!state) return false;
    if (!canPay(cost)) return false;
    Object.entries(cost).forEach(([key, value]) => {
      state.resources[key] -= value;
    });
    return true;
  }

  function apply(effect = {}) {
    if (!state) return;
    Object.entries(effect).forEach(([key, value]) => {
      if (key === "badges") {
        state.badges += value;
      } else if (key === "motivation" || key === "disorder") {
        state.resources[key] = Math.max(0, Math.min(100, state.resources[key] + value));
      } else {
        state.resources[key] += value;
      }
    });
    rates = computeRates();
  }

  function triggerGameOver() {
    if (!state || state.gameOver) return true;
    state.resources.disorder = 100;
    state.gameOver = {
      at: Date.now(),
      level: state.level,
      learners: learnerTotal(),
      challengesSolved: state.stats.challengesSolved,
      badges: state.badges
    };
    rates = emptyRates();
    log(t("logGameOver"));
    document.querySelectorAll(".modal-backdrop").forEach((modal) => modal.remove());
    saveState();
    render({ preserveScroll: true });
    return true;
  }

  function checkGameOver() {
    if (!state) return false;
    if (state.gameOver) return true;
    if (state.resources.disorder >= 100) return triggerGameOver();
    return false;
  }

  function classroomCount() {
    return clamp(Math.floor(state?.classrooms?.unlocked || 1), 1, MAX_CLASSROOMS);
  }

  function activeClassroomIndex() {
    return clamp(Math.floor(state?.classrooms?.active || 0), 0, classroomCount() - 1);
  }

  function totalSeatCapacity() {
    return classroomCount() * CLASSROOM_SEAT_COUNT;
  }

  function learnerTotal() {
    return Math.max(0, Math.floor(state?.resources?.learners || 0));
  }

  function hasSeatCapacity(amount = 1) {
    return learnerTotal() + Math.max(0, Math.floor(amount || 0)) <= totalSeatCapacity();
  }

  function allOpenRoomsFull() {
    return learnerTotal() >= totalSeatCapacity();
  }

  function protocolCount(target = state) {
    return Object.values(target?.knowledge || {}).filter(Boolean).length;
  }

  function ownedStationCount(target = state) {
    return SPACES.filter((space) => space.id !== "classroom" && target?.spaces?.[space.id]?.owned).length;
  }

  function campaignScale() {
    return { "5e": 1, "4e": 1.25, "3e": 1.5 }[state?.level] || 1;
  }

  function campaignTarget(objective) {
    const base = typeof objective.target === "function" ? objective.target(state) : objective.target;
    return Math.max(1, Math.ceil((objective.scale ? campaignScale() : 1) * base));
  }

  function objectiveStatus(objective) {
    const target = campaignTarget(objective);
    const raw = Number(objective.value?.(state) || 0);
    const current = Math.max(0, Math.floor(raw));
    return {
      ...objective,
      target,
      current,
      done: current >= target,
      text: trById("campaignObjectives", objective.id, "text", objective.text)
    };
  }

  function campaignStageStatus(stage, index) {
    const objectives = stage.objectives.map(objectiveStatus);
    const completed = objectives.filter((objective) => objective.done).length;
    return {
      ...stage,
      index,
      title: trById("campaignStages", stage.id, "title", stage.title),
      summary: trById("campaignStages", stage.id, "summary", stage.summary),
      objectives,
      completed,
      total: objectives.length,
      done: completed === objectives.length,
      percent: objectives.length ? (completed / objectives.length) * 100 : 0
    };
  }

  function campaignStatuses() {
    return CAMPAIGN_STAGES.map(campaignStageStatus);
  }

  function currentCampaignStatus() {
    const statuses = campaignStatuses();
    return statuses.find((stage) => !stage.done) || statuses[statuses.length - 1];
  }

  function campaignComplete() {
    return campaignStatuses().every((stage) => stage.done);
  }

  function ensureProgression() {
    if (!state.progression) state.progression = { claimedStages: {}, finalLogged: false };
    if (!state.progression.claimedStages) state.progression.claimedStages = {};
    return state.progression;
  }

  function syncProgression() {
    if (!state || state.gameOver) return;
    const progression = ensureProgression();
    let changed = false;
    campaignStatuses().forEach((stage) => {
      if (!stage.done || progression.claimedStages[stage.id]) return;
      progression.claimedStages[stage.id] = true;
      changed = true;
      if (stage.reward) apply(stage.reward);
      log(t("logStageComplete", { title: stage.title, reward: effectText(stage.reward) }));
      pendingProgressToast = t("stageRewardToast", { title: stage.title });
    });
    if (campaignComplete() && !progression.finalLogged) {
      progression.finalLogged = true;
      changed = true;
      log(t("logCampaignComplete"));
      pendingProgressToast = t("campaignCompleteToast");
    }
    if (changed) saveState();
  }

  function classroomCost() {
    const openedExtraRooms = Math.max(0, classroomCount() - 1);
    const factor = Math.pow(1.72, openedExtraRooms);
    return {
      resources: Math.ceil(90 * factor),
      material: Math.ceil(45 * factor)
    };
  }

  function spaceCost(space) {
    const current = state.spaces[space.id];
    const level = current.owned ? current.level : 0;
    const factor = Math.pow(1.55, level);
    if (space.id === "classroom") return classroomCost();
    return Object.fromEntries(Object.entries(space.baseCost).map(([key, value]) => [key, Math.ceil(value * factor)]));
  }

  function recruitCost(recruit) {
    const hired = state.recruits[recruit.id];
    if (hired.count === 0 && recruit.firstCost) return recruit.firstCost;
    const factor = Math.pow(1.38, hired.count);
    return Object.fromEntries(Object.entries(recruit.baseCost).map(([key, value]) => [key, Math.ceil(value * factor)]));
  }

  function costText(cost) {
    const parts = Object.entries(cost).filter(([, value]) => value > 0).map(([key, value]) => {
      return `${format(value)} ${resourceName(key, value)}`;
    });
    return parts.length ? parts.join(" + ") : t("free");
  }

  function requirementText(requirements = {}) {
    return t("required", { value: costText(requirements) });
  }

  function effectText(effect = {}) {
    const parts = Object.entries(effect).filter(([, value]) => value !== 0).map(([key, value]) => {
      const sign = value > 0 ? "+" : "-";
      const display = Math.abs(value) < 1 ? Math.abs(value).toFixed(1) : format(Math.abs(value));
      return `${sign}${display} ${resourceName(key, Math.abs(value))}`;
    });
    return parts.length ? parts.join(" ; ") : t("noEffect");
  }

  function productionText(production) {
    return Object.entries(production).map(([key, value]) => `${value > 0 ? "+" : ""}${value}/s ${resourceName(key, value)}`).join(" - ");
  }

  function progressText(current, target) {
    if (!Number.isFinite(target) || target <= 0) return "";
    return `${format(Math.min(current, target))}/${format(target)}`;
  }

  function guideStep() {
    if (!state) return null;
    const learners = learnerTotal();
    const learnerRecruit = RECRUITS.find((item) => item.id === "learners");
    const nextLearnerCost = learnerRecruit ? recruitCost(learnerRecruit) : {};
    if (learners < 1) {
      return {
        id: "firstLearner",
        tab: "teams",
        kind: GUIDE_TARGETS.recruit,
        target: "learners",
        title: t("guide.firstTitle"),
        text: t("guide.firstText"),
        goal: t("guide.firstGoal"),
        progress: { current: learners, target: 1 }
      };
    }
    if (learners < 4 && learnerRecruit && canPay(nextLearnerCost)) {
      return {
        id: "recruitFour",
        tab: "teams",
        kind: GUIDE_TARGETS.recruit,
        target: "learners",
        title: t("guide.recruitTitle"),
        text: t("guide.recruitText"),
        goal: t("guide.recruitGoal"),
        progress: { current: learners, target: 4 }
      };
    }
    if (learners < 4) {
      const needed = nextLearnerCost.resources || 10;
      return {
        id: "collectForLearners",
        tab: "actions",
        kind: GUIDE_TARGETS.action,
        target: "observe",
        title: t("guide.collectTitle"),
        text: t("guide.collectText"),
        goal: t("guide.collectGoal", { cost: costText(nextLearnerCost) }),
        progress: { current: state.resources.resources, target: needed }
      };
    }
    if (state.stats.challengesSolved < 1) {
      return {
        id: "firstChallenge",
        tab: "actions",
        kind: GUIDE_TARGETS.action,
        target: "challenge",
        title: t("guide.challengeTitle"),
        text: t("guide.challengeText"),
        goal: t("guide.challengeGoal"),
        progress: { current: state.stats.challengesSolved, target: 1 }
      };
    }
    if (state.badges >= 1 && !state.knowledge.project) {
      return {
        id: "firstProtocol",
        tab: "protocols",
        kind: GUIDE_TARGETS.knowledge,
        target: "project",
        title: t("guide.protocolTitle"),
        text: t("guide.protocolText"),
        goal: t("guide.protocolGoal"),
        progress: { current: Object.values(state.knowledge).filter(Boolean).length, target: 1 }
      };
    }
    const sensorBench = SPACES.find((item) => item.id === "sensorBench");
    if (sensorBench && !state.spaces.sensorBench.owned) {
      const cost = spaceCost(sensorBench);
      if (canPay(cost)) {
        return {
          id: "firstStation",
          tab: "stations",
          kind: GUIDE_TARGETS.space,
          target: "sensorBench",
          title: t("guide.stationTitle"),
          text: t("guide.stationText"),
          goal: t("guide.stationGoal"),
          progress: { current: 0, target: 1 }
        };
      }
      const missingMaterial = (state.resources.material || 0) < (cost.material || 0);
      const targetAction = missingMaterial ? "inventory" : "observe";
      const targetAmount = missingMaterial ? cost.material : cost.resources;
      const currentAmount = missingMaterial ? state.resources.material : state.resources.resources;
      return {
        id: "collectForStation",
        tab: "actions",
        kind: GUIDE_TARGETS.action,
        target: targetAction,
        title: t("guide.stationPrepTitle"),
        text: t("guide.stationPrepText"),
        goal: t("guide.stationPrepGoal", { cost: costText(cost) }),
        progress: { current: currentAmount, target: targetAmount || 1 }
      };
    }
    return {
      id: "idleLoop",
      tab: activeSideTab,
      kind: null,
      target: null,
      title: t("guide.idleTitle"),
      text: t("guide.idleText"),
      goal: t("guide.idleGoal"),
      progress: { current: state.stats.challengesSolved, target: Math.max(3, state.stats.challengesSolved + 1) }
    };
  }

  function log(message) {
    if (!state) return;
    const time = new Date().toLocaleTimeString(currentLang === "en" ? "en-GB" : "fr-FR", { hour: "2-digit", minute: "2-digit" });
    state.log.push(`${time} - ${message}`);
    state.log = state.log.slice(-50);
  }

  function showToast(message) {
    const toast = document.querySelector(".toast");
    if (!toast) return;
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add("visible");
    toastTimer = setTimeout(() => toast.classList.remove("visible"), 2600);
  }

  function buySpace(id) {
    if (state?.gameOver) return;
    const space = SPACES.find((item) => item.id === id);
    if (!space) return;
    if (space.id === "classroom") {
      openClassroom();
      return;
    }
    const current = state.spaces[id];
    if (state.resources.mastery < space.unlockMastery) {
      showToast(t("needsMasteryToast"));
      return;
    }
    if (current.owned && current.level >= space.maxLevel) {
      showToast(t("maxModuleToast"));
      return;
    }
    const cost = spaceCost(space);
    if (!pay(cost)) {
      showToast(t("insufficientResources"));
      return;
    }
    current.owned = true;
    current.level += 1;
    const spaceName = tr("spaces", space, "name");
    log(current.level === 1 ? t("logInstalled", { name: spaceName }) : t("logLevel", { name: spaceName, level: current.level }));
    render({ preserveScroll: true });
  }

  function openClassroom() {
    if (state?.gameOver) return;
    const current = state.spaces.classroom;
    if (classroomCount() >= MAX_CLASSROOMS) {
      showToast(t("allRoomsOpenToast"));
      return;
    }
    if (!allOpenRoomsFull()) {
      showToast(t("fillRoomsToast"));
      return;
    }
    const cost = classroomCost();
    if (!pay(cost)) {
      showToast(t("roomCostToast"));
      return;
    }
    state.classrooms.unlocked = classroomCount() + 1;
    state.classrooms.active = state.classrooms.unlocked - 1;
    current.owned = true;
    current.level = state.classrooms.unlocked - 1;
    log(t("logRoom", { room: state.classrooms.unlocked }));
    render({ preserveScroll: true });
  }

  function hireRecruit(id) {
    if (state?.gameOver) return;
    const recruit = RECRUITS.find((item) => item.id === id);
    if (!recruit) return;
    if (state.resources.mastery < recruit.unlockMastery) {
      showToast(t("recruitMasteryToast"));
      return;
    }
    if (!canMeet(recruit.requires)) {
      showToast(t("recruitRequirementToast"));
      return;
    }
    const incomingLearners = Math.max(0, Math.floor(recruit.onHire?.learners || 0));
    if (incomingLearners > 0 && !hasSeatCapacity(incomingLearners)) {
      activeSideTab = "stations";
      showToast(t("roomFullToast"));
      render({ preserveScroll: true });
      return;
    }
    const cost = recruitCost(recruit);
    if (!pay(cost)) {
      showToast(t("insufficientResources"));
      return;
    }
    state.recruits[id].count += 1;
    apply(recruit.onHire);
    addStudentSpritesTo(state, recruit.onHire?.learners || 0);
    log(t("logRecruit", { name: tr("recruits", recruit, "name") }));
    render({ preserveScroll: true });
  }

  function useAction(id) {
    if (state?.gameOver) return;
    const action = ACTIONS.find((item) => item.id === id);
    if (!action) return;
    if (document.querySelector(".modal-backdrop")) return;
    const cooldown = actionCooldownRemaining();
    if (cooldown > 0) {
      showToast(t("actionCooldownToast", { seconds: Math.ceil(cooldown / 1000) }));
      return;
    }
    if (!canMeet(action.requires)) {
      showToast(t("actionLearnersToast"));
      return;
    }
    if (action.cost && !canPay(action.cost)) {
      showToast(t("actionStockToast"));
      return;
    }
    if (action.cost && !pay(action.cost)) return;
    let opened = false;
    if (action.challenge) {
      opened = openChallenge(true, null, { actionCooldown: true });
    } else {
      opened = openChallenge(true, action);
    }
    if (!opened && action.cost) {
      apply(action.cost);
      saveState();
    }
    if (opened && action.cost) saveState();
  }

  function buyKnowledge(id) {
    if (state?.gameOver) return;
    const item = KNOWLEDGE.find((entry) => entry.id === id);
    if (!item) return;
    if (state.knowledge[id]) {
      showToast(t("knowledgeOwnedToast"));
      return;
    }
    if (state.badges < item.cost) {
      showToast(t("knowledgeTokenToast"));
      return;
    }
    state.badges -= item.cost;
    state.knowledge[id] = true;
    if (item.instant) apply(item.instant);
    log(t("logKnowledge", { name: tr("knowledge", item, "name") }));
    render({ preserveScroll: true });
  }

  function challengeBank() {
    return window.TechnoChallengeBank?.getChallenges({ level: state.level }) || [];
  }

  function challengeStatsText() {
    const stats = window.TechnoChallengeBank?.stats?.() || [];
    if (!stats.length) return t("localBank");
    return t("challengeStats", { themes: stats.length, count: stats[0].byLevel[state.level] });
  }

  function pickChallenge(options = {}) {
    const bank = challengeBank();
    if (!bank.length) return null;
    const typeIds = window.TechnoChallengeBank?.typeIds || [];
    const preferredTypes = Array.isArray(options.preferredTypes) ? options.preferredTypes.filter(Boolean) : [];
    const cycle = preferredTypes.length ? preferredTypes : typeIds;
    const expectedType = cycle.length ? cycle[state.stats.challengeAttempts % cycle.length] : null;
    const recent = new Set(state.stats.recentChallenges || []);
    let typed = expectedType ? bank.filter((challenge) => challenge.type === expectedType) : bank;
    if (!typed.length && preferredTypes.length) typed = bank.filter((challenge) => preferredTypes.includes(challenge.type));
    const available = typed.filter((challenge) => !recent.has(challenge.id));
    const source = available.length ? available : typed.length ? typed : bank;
    const seed = Math.floor(state.stats.challengeAttempts * 17 + state.resources.mastery + Date.now() / 1000);
    return source[Math.abs(seed) % source.length];
  }

  function actionChallenge(baseChallenge, action) {
    const actionName = tr("actions", action, "name");
    return {
      ...baseChallenge,
      id: `${baseChallenge.id}-action-${action.id}`,
      sourceId: baseChallenge.sourceId || baseChallenge.id,
      actionId: action.id,
      actionLabel: actionName,
      actionCooldown: true,
      countsAsChallenge: false,
      title: t("actionQuestionTitle", { name: actionName }),
      prompt: t("actionQuestionPrompt", { name: actionName, prompt: baseChallenge.prompt }),
      reward: action.reward || {},
      penalty: action.penalty || { disorder: 1, motivation: -1 }
    };
  }

  function resolveChallenge(modal, challenge, choice) {
    if (modal.dataset.answered === "true") return;
    modal.dataset.answered = "true";
    state.stats.challengeAttempts += 1;
    const recentId = challenge.sourceId || challenge.id;
    state.stats.recentChallenges = [recentId, ...(state.stats.recentChallenges || []).filter((id) => id !== recentId)].slice(0, 48);
    if (choice.correct) {
      apply(challenge.reward);
      if (challenge.countsAsChallenge !== false) state.stats.challengesSolved += 1;
    } else {
      apply(challenge.penalty);
    }
    if (challenge.actionCooldown) startActionCooldown();
    if (challenge.actionId) {
      log(`${choice.correct ? t("actionSuccess") : t("actionMiss")} : ${challenge.actionLabel}.`);
    } else {
      log(`${choice.correct ? t("challengeSuccess") : t("challengeMiss")} : ${challenge.themeLabel} (${challenge.typeLabel}).`);
    }
    if (checkGameOver()) return;
    saveState();

    const card = modal.querySelector(".challenge-modal");
    card.classList.add(choice.correct ? "is-correct" : "is-wrong");
    card.querySelectorAll("button").forEach((button) => {
      button.disabled = true;
    });
    card.insertAdjacentHTML("beforeend", `
      <section class="challenge-result ${choice.correct ? "correct" : "wrong"}">
        <h3>${choice.correct ? escapeHtml(t("correctAnswer")) : escapeHtml(t("review"))}</h3>
        <p><strong>${escapeHtml(t("feedback"))} :</strong> ${escapeHtml(choice.feedback)}</p>
        <p><strong>${escapeHtml(t("coursePoint"))} :</strong> ${escapeHtml(challenge.coursePoint || t("fallbackCoursePoint"))}</p>
        <p><strong>${choice.correct ? escapeHtml(t("gain")) : escapeHtml(t("consequence"))} :</strong> ${escapeHtml(effectText(choice.correct ? challenge.reward : challenge.penalty))}</p>
        <button class="paper-button buy" type="button" data-continue-defi>${escapeHtml(t("continue"))}</button>
      </section>
    `);
    card.querySelector("[data-continue-defi]").addEventListener("click", () => {
      modal.remove();
      render({ preserveScroll: true });
    });
    showToast(choice.correct ? t("correctToast") : t("wrongToast"));
  }

  function challengeInteraction(challenge) {
    return challenge.interaction || challenge.type;
  }

  function renderChallengeClues(challenge) {
    if (!Array.isArray(challenge.clues) || !challenge.clues.length) return "";
    return `
      <div class="mini-clues">
        ${challenge.clues.map((clue) => `<span>${escapeHtml(clue)}</span>`).join("")}
      </div>
    `;
  }

  function renderMultiSelect(challenge) {
    return `
      <div class="mini-game mini-multiselect">
        <p class="mini-instruction">${escapeHtml(t("multiSelectHint"))}</p>
        <div class="mini-chip-grid">
          ${challenge.choices.map((choice, index) => `<button type="button" data-multi-choice="${index}">${escapeHtml(choice.label)}</button>`).join("")}
        </div>
        <div class="sequence-actions">
          <button class="paper-button buy" type="button" data-multi-validate disabled>${escapeHtml(t("validateAnswer"))}</button>
          <button class="paper-button" type="button" data-multi-reset disabled>${escapeHtml(t("restart"))}</button>
        </div>
      </div>
    `;
  }

  function renderMatching(challenge) {
    const rights = challenge.pairs.map((pair, index) => ({ label: pair.right, index }));
    const rotated = rights.slice(1).concat(rights.slice(0, 1));
    return `
      <div class="mini-game mini-matching">
        <p class="mini-instruction" data-match-status>${escapeHtml(t("matchingHint"))}</p>
        <div class="match-columns">
          <div class="match-column">
            ${challenge.pairs.map((pair, index) => `<button type="button" data-match-left="${index}">${escapeHtml(pair.left)}</button>`).join("")}
          </div>
          <div class="match-column">
            ${rotated.map((pair) => `<button type="button" data-match-right="${pair.index}">${escapeHtml(pair.label)}</button>`).join("")}
          </div>
        </div>
        <div class="sequence-actions">
          <button class="paper-button buy" type="button" data-match-validate disabled>${escapeHtml(t("validateAnswer"))}</button>
          <button class="paper-button" type="button" data-match-reset disabled>${escapeHtml(t("restart"))}</button>
        </div>
      </div>
    `;
  }

  function renderFolderSort(challenge) {
    return `
      <div class="mini-game mini-folder-sort">
        <p class="mini-instruction" data-folder-status>${escapeHtml(t("folderHint"))}</p>
        <div class="folder-board">
          <section class="folder-panel">
            <h3>${escapeHtml(t("folderDocuments"))}</h3>
            <div class="folder-items">
              ${challenge.items.map((item, index) => `
                <button type="button" data-sort-item="${index}">
                  <strong>${escapeHtml(item.label)}</strong>
                  <small data-sort-assignment="${index}">${escapeHtml(t("folderUnsorted"))}</small>
                </button>
              `).join("")}
            </div>
          </section>
          <section class="folder-panel">
            <h3>${escapeHtml(t("folderFolders"))}</h3>
            <div class="folder-targets">
              ${challenge.folders.map((folder, index) => `<button type="button" data-sort-folder="${index}">${escapeHtml(folder.label)}</button>`).join("")}
            </div>
          </section>
        </div>
        <div class="sequence-actions">
          <button class="paper-button buy" type="button" data-sort-validate disabled>${escapeHtml(t("validateAnswer"))}</button>
          <button class="paper-button" type="button" data-sort-reset disabled>${escapeHtml(t("restart"))}</button>
        </div>
      </div>
    `;
  }

  function renderWordLetterBank(letters = []) {
    return `
      <div class="letter-bank" aria-label="${escapeHtml(t("wordPuzzleLetters"))}">
        ${letters.map((letter) => `<button type="button" data-word-letter="${escapeHtml(letter)}">${escapeHtml(letter)}</button>`).join("")}
      </div>
    `;
  }

  function renderWordBank(words = []) {
    if (!words.length) return "";
    return `
      <div class="word-bank">
        <strong>${escapeHtml(t("wordPuzzleWordBank"))}</strong>
        <div>
          ${words.map((word) => `<span>${escapeHtml(word)}</span>`).join("")}
        </div>
      </div>
    `;
  }

  function renderWordGrid(challenge) {
    const grid = challenge.gridSize || { rows: 1, cols: 1 };
    const cells = (challenge.cells || []).map((cell, index) => ({ ...cell, slot: index }));
    const cellMap = new Map(cells.map((cell) => [`${cell.row}:${cell.col}`, cell]));
    const rows = [];
    for (let row = 0; row < grid.rows; row += 1) {
      for (let col = 0; col < grid.cols; col += 1) {
        const cell = cellMap.get(`${row}:${col}`);
        rows.push(cell
          ? `<button class="crossword-cell" type="button" data-word-cell="${cell.slot}" data-word-answer="${escapeHtml(cell.answer)}">
              ${cell.label ? `<span class="word-cell-index">${escapeHtml(cell.label)}</span>` : ""}
              <span class="word-cell-letter" data-word-cell-letter="${cell.slot}"></span>
            </button>`
          : `<span class="crossword-empty" aria-hidden="true"></span>`);
      }
    }
    return `
      <div class="mini-game mini-word-puzzle">
        <p class="mini-instruction">${escapeHtml(t("wordPuzzleHint"))}</p>
        <div class="crossword-layout">
          <div class="crossword-grid" style="--grid-cols:${grid.cols}; --grid-rows:${grid.rows}">
            ${rows.join("")}
          </div>
          <ol class="crossword-clues">
            ${(challenge.clues || []).map((clue) => `<li>${escapeHtml(clue)}</li>`).join("")}
          </ol>
        </div>
        ${renderWordBank(challenge.wordBank)}
        ${renderWordLetterBank(challenge.letters)}
        <div class="sequence-actions">
          <button class="paper-button buy" type="button" data-word-validate disabled>${escapeHtml(t("validateAnswer"))}</button>
          <button class="paper-button" type="button" data-word-reset disabled>${escapeHtml(t("restart"))}</button>
        </div>
      </div>
    `;
  }

  function renderArrowWords(challenge) {
    let slot = 0;
    return `
      <div class="mini-game mini-word-puzzle mini-arrow-words">
        <p class="mini-instruction">${escapeHtml(t("arrowWordHint"))}</p>
        <div class="arrow-rows">
          ${(challenge.rows || []).map((row) => `
            <div class="arrow-row">
              <div class="arrow-clue"><strong>${escapeHtml(String(row.index || ""))}</strong><span>${escapeHtml(row.clue)}</span></div>
              <div class="arrow-slots">
                ${String(row.answer || "").split("").map((letter) => {
                  const current = slot;
                  slot += 1;
                  return `<button class="crossword-cell" type="button" data-word-cell="${current}" data-word-answer="${escapeHtml(letter)}">
                    <span class="word-cell-letter" data-word-cell-letter="${current}"></span>
                  </button>`;
                }).join("")}
              </div>
            </div>
          `).join("")}
        </div>
        ${renderWordBank(challenge.wordBank)}
        ${renderWordLetterBank(challenge.letters)}
        <div class="sequence-actions">
          <button class="paper-button buy" type="button" data-word-validate disabled>${escapeHtml(t("validateAnswer"))}</button>
          <button class="paper-button" type="button" data-word-reset disabled>${escapeHtml(t("restart"))}</button>
        </div>
      </div>
    `;
  }

  function renderHotspot(challenge, mode) {
    const hotspots = challenge.hotspots || challenge.choices || [];
    return `
      <div class="mini-game mini-hotspot ${mode === "mapHotspot" ? "map-mode" : ""}">
        <div class="hotspot-scene" aria-label="${escapeHtml(challenge.sceneTitle || challenge.title)}">
          <strong>${escapeHtml(challenge.sceneTitle || challenge.title)}</strong>
          ${hotspots.map((spot, index) => `<button type="button" data-choice="${index}" style="--spot-x:${18 + (index % 2) * 58}%; --spot-y:${28 + Math.floor(index / 2) * 40}%">${escapeHtml(spot.label)}</button>`).join("")}
        </div>
      </div>
    `;
  }

  function renderDebugBlocks(challenge) {
    return `
      <div class="mini-game mini-debug">
        <div class="debug-stack">
          ${challenge.choices.map((choice, index) => `<button type="button" data-choice="${index}"><span>${escapeHtml(choice.label)}</span></button>`).join("")}
        </div>
      </div>
    `;
  }

  function renderVariableTrace(challenge) {
    const trace = challenge.trace || { variable: "x", start: 0, operations: [] };
    return `
      <div class="mini-game mini-variable">
        <div class="variable-track">
          <span>${escapeHtml(trace.variable)} = ${escapeHtml(String(trace.start))}</span>
          ${(trace.operations || []).map((operation) => `<span>${escapeHtml(operation)}</span>`).join("")}
          <span>?</span>
        </div>
        <div class="choice-list variableTrace">
          ${challenge.choices.map((choice, index) => `<button type="button" data-choice="${index}">${escapeHtml(choice.label)}</button>`).join("")}
        </div>
      </div>
    `;
  }

  function renderCloze(challenge) {
    const parts = challenge.parts || [];
    const blanks = challenge.answers || [];
    return `
      <div class="mini-game mini-cloze">
        <p class="cloze-line">
          ${blanks.map((_, index) => `${escapeHtml(parts[index] || "")}<span data-cloze-slot="${index}">...</span>`).join("")}${escapeHtml(parts[blanks.length] || "")}
        </p>
        <div class="mini-chip-grid">
          ${(challenge.wordBank || []).map((word, index) => `<button type="button" data-cloze-word="${index}">${escapeHtml(word)}</button>`).join("")}
        </div>
        <div class="sequence-actions">
          <button class="paper-button buy" type="button" data-cloze-validate disabled>${escapeHtml(t("validateAnswer"))}</button>
          <button class="paper-button" type="button" data-cloze-reset disabled>${escapeHtml(t("restart"))}</button>
        </div>
      </div>
    `;
  }

  function renderCompare(challenge) {
    const cards = challenge.cards || challenge.choices || [];
    return `
      <div class="mini-game mini-compare">
        ${cards.map((card, index) => `
          <button type="button" data-choice="${index}">
            <strong>${escapeHtml(card.label)}</strong>
            <span>${escapeHtml(card.correct ? t("bestCandidate") : t("candidate"))}</span>
          </button>
        `).join("")}
      </div>
    `;
  }

  function renderChallengeInteraction(challenge) {
    const interaction = challengeInteraction(challenge);
    if (interaction === "sequence" || interaction === "chain") {
      return `
        <div class="sequence-builder ${interaction === "chain" ? "chain-builder" : ""}">
          <div class="sequence-slots" data-seq-output>${escapeHtml(t("selectSequence"))}</div>
          <div class="sequence-pool">
            ${challenge.pool.map((step, index) => `<button type="button" data-seq-step="${index}" data-order="${step.order}">${escapeHtml(step.label)}</button>`).join("")}
          </div>
          <div class="sequence-actions">
            <button class="paper-button buy" type="button" data-seq-validate disabled>${escapeHtml(t("validateOrder"))}</button>
            <button class="paper-button" type="button" data-seq-reset disabled>${escapeHtml(t("restart"))}</button>
          </div>
        </div>
      `;
    }

    if (interaction === "classify") {
      return `
        <div class="classify-box">
          <div class="classify-item">${escapeHtml(challenge.item)}</div>
          <div class="choice-list classify">
            ${challenge.categories.map((choice, index) => `<button type="button" data-choice="${index}">${escapeHtml(choice.label)}</button>`).join("")}
          </div>
        </div>
      `;
    }

    if (interaction === "multiSelect") return renderMultiSelect(challenge);
    if (interaction === "matching") return renderMatching(challenge);
    if (interaction === "folderSort") return renderFolderSort(challenge);
    if (interaction === "wordGrid") return renderWordGrid(challenge);
    if (interaction === "arrowWords") return renderArrowWords(challenge);
    if (interaction === "hotspot" || interaction === "mapHotspot") return renderHotspot(challenge, interaction);
    if (interaction === "debugBlocks") return renderDebugBlocks(challenge);
    if (interaction === "variableTrace") return renderVariableTrace(challenge);
    if (interaction === "cloze") return renderCloze(challenge);
    if (interaction === "compare") return renderCompare(challenge);

    return `
      <div class="choice-list ${challenge.type}">
        ${challenge.choices.map((choice, index) => `<button type="button" data-choice="${index}">${escapeHtml(choice.label)}</button>`).join("")}
      </div>
    `;
  }

  function choiceListFor(challenge) {
    const interaction = challengeInteraction(challenge);
    if (interaction === "classify") return challenge.categories;
    if (interaction === "hotspot" || interaction === "mapHotspot") return challenge.hotspots || challenge.choices;
    if (interaction === "compare") return challenge.cards || challenge.choices;
    return challenge.choices;
  }

  function bindChoiceEvents(modal, challenge) {
    modal.querySelectorAll("[data-choice]").forEach((button) => {
      button.addEventListener("click", () => {
        const list = choiceListFor(challenge);
        resolveChallenge(modal, challenge, list[Number(button.dataset.choice)]);
      });
    });
  }

  function bindSequenceEvents(modal, challenge) {
    const selected = [];
    const output = modal.querySelector("[data-seq-output]");
    const validateButton = modal.querySelector("[data-seq-validate]");
    const resetButton = modal.querySelector("[data-seq-reset]");
    const updateOutput = () => {
      output.textContent = selected.length ? selected.map((step) => step.label).join(" -> ") : t("selectSequence");
      resetButton.disabled = selected.length === 0;
      validateButton.disabled = selected.length !== challenge.steps.length;
    };

    modal.querySelectorAll("[data-seq-step]").forEach((button) => {
      button.addEventListener("click", () => {
        if (button.classList.contains("picked")) return;
        button.classList.add("picked");
        selected.push({ label: button.textContent, order: Number(button.dataset.order) });
        updateOutput();
      });
    });

    resetButton.addEventListener("click", () => {
      selected.length = 0;
      modal.querySelectorAll("[data-seq-step]").forEach((button) => button.classList.remove("picked"));
      updateOutput();
    });

    validateButton.addEventListener("click", () => {
      if (selected.length !== challenge.steps.length) {
        showToast(t("sequenceMissingToast"));
        return;
      }
      const correct = selected.every((step, index) => step.order === index);
      resolveChallenge(modal, challenge, {
        correct,
        feedback: correct
          ? (challenge.successFeedback || I18N.translateChallengeText("L'ordre respecte la logique du systeme.", currentLang))
          : (challenge.failureFeedback || I18N.translateChallengeText("L'ordre contient au moins une inversion.", currentLang))
      });
    });
    updateOutput();
  }

  function bindMultiSelectEvents(modal, challenge) {
    const selected = new Set();
    const validateButton = modal.querySelector("[data-multi-validate]");
    const resetButton = modal.querySelector("[data-multi-reset]");
    const update = () => {
      validateButton.disabled = selected.size === 0;
      resetButton.disabled = selected.size === 0;
    };
    modal.querySelectorAll("[data-multi-choice]").forEach((button) => {
      button.addEventListener("click", () => {
        const index = Number(button.dataset.multiChoice);
        if (selected.has(index)) {
          selected.delete(index);
          button.classList.remove("picked");
        } else {
          selected.add(index);
          button.classList.add("picked");
        }
        update();
      });
    });
    resetButton.addEventListener("click", () => {
      selected.clear();
      modal.querySelectorAll("[data-multi-choice]").forEach((button) => button.classList.remove("picked"));
      update();
    });
    validateButton.addEventListener("click", () => {
      const correct = challenge.choices.every((choice, index) => choice.correct === selected.has(index));
      resolveChallenge(modal, challenge, {
        correct,
        feedback: correct ? challenge.successFeedback : challenge.failureFeedback
      });
    });
    update();
  }

  function bindMatchingEvents(modal, challenge) {
    let activeLeft = null;
    const matches = {};
    const status = modal.querySelector("[data-match-status]");
    const validateButton = modal.querySelector("[data-match-validate]");
    const resetButton = modal.querySelector("[data-match-reset]");
    const update = () => {
      const count = Object.keys(matches).length;
      validateButton.disabled = count !== challenge.pairs.length;
      resetButton.disabled = count === 0 && activeLeft === null;
      if (status) {
        status.textContent = activeLeft === null
          ? `${t("matchingHint")} ${count}/${challenge.pairs.length}`
          : t("matchingTarget", { item: challenge.pairs[activeLeft]?.left || "" });
      }
    };
    modal.querySelectorAll("[data-match-left]").forEach((button) => {
      button.addEventListener("click", () => {
        if (button.disabled) return;
        activeLeft = Number(button.dataset.matchLeft);
        modal.querySelectorAll("[data-match-left]").forEach((item) => item.classList.remove("active"));
        button.classList.add("active");
        update();
      });
    });
    modal.querySelectorAll("[data-match-right]").forEach((button) => {
      button.addEventListener("click", () => {
        if (button.disabled) return;
        if (activeLeft === null) {
          showToast(t("matchingPickWordToast"));
          return;
        }
        const rightIndex = Number(button.dataset.matchRight);
        matches[activeLeft] = rightIndex;
        const leftButton = modal.querySelector(`[data-match-left="${activeLeft}"]`);
        leftButton?.classList.add("picked");
        if (leftButton) leftButton.disabled = true;
        button.classList.add("picked");
        button.disabled = true;
        activeLeft = null;
        modal.querySelectorAll("[data-match-left]").forEach((item) => item.classList.remove("active"));
        update();
      });
    });
    resetButton.addEventListener("click", () => {
      activeLeft = null;
      Object.keys(matches).forEach((key) => delete matches[key]);
      modal.querySelectorAll("[data-match-left], [data-match-right]").forEach((button) => {
        button.disabled = false;
        button.classList.remove("active", "picked");
      });
      update();
    });
    validateButton.addEventListener("click", () => {
      const correct = challenge.pairs.every((_, index) => matches[index] === index);
      resolveChallenge(modal, challenge, {
        correct,
        feedback: correct ? challenge.successFeedback : challenge.failureFeedback
      });
    });
    update();
  }

  function bindFolderSortEvents(modal, challenge) {
    let activeItem = null;
    const assignments = {};
    const status = modal.querySelector("[data-folder-status]");
    const validateButton = modal.querySelector("[data-sort-validate]");
    const resetButton = modal.querySelector("[data-sort-reset]");
    const folderLabels = new Map((challenge.folders || []).map((folder) => [folder.id, folder.label]));
    const update = () => {
      const count = Object.keys(assignments).length;
      validateButton.disabled = count !== challenge.items.length;
      resetButton.disabled = count === 0 && activeItem === null;
      if (status) {
        status.textContent = activeItem === null
          ? `${t("folderHint")} ${t("folderSortedCount", { count, total: challenge.items.length })}`
          : t("folderTarget", { item: challenge.items[activeItem]?.label || "" });
      }
      challenge.items.forEach((_, index) => {
        const itemButton = modal.querySelector(`[data-sort-item="${index}"]`);
        const assignmentLabel = modal.querySelector(`[data-sort-assignment="${index}"]`);
        const assignedFolder = assignments[index];
        itemButton?.classList.toggle("picked", Boolean(assignedFolder));
        itemButton?.classList.toggle("active", activeItem === index);
        if (assignmentLabel) assignmentLabel.textContent = assignedFolder ? folderLabels.get(assignedFolder) || assignedFolder : t("folderUnsorted");
      });
    };
    modal.querySelectorAll("[data-sort-item]").forEach((button) => {
      button.addEventListener("click", () => {
        activeItem = Number(button.dataset.sortItem);
        modal.querySelectorAll("[data-sort-item]").forEach((item) => item.classList.remove("active"));
        button.classList.add("active");
        update();
      });
    });
    modal.querySelectorAll("[data-sort-folder]").forEach((button) => {
      button.addEventListener("click", () => {
        if (activeItem === null) {
          showToast(t("folderPickItemToast"));
          return;
        }
        const folder = challenge.folders[Number(button.dataset.sortFolder)];
        assignments[activeItem] = folder.id;
        activeItem = null;
        modal.querySelectorAll("[data-sort-folder]").forEach((item) => item.classList.remove("active", "picked"));
        update();
      });
    });
    resetButton.addEventListener("click", () => {
      activeItem = null;
      Object.keys(assignments).forEach((key) => delete assignments[key]);
      modal.querySelectorAll("[data-sort-item], [data-sort-folder]").forEach((button) => button.classList.remove("active", "picked"));
      update();
    });
    validateButton.addEventListener("click", () => {
      const correct = challenge.items.every((item, index) => assignments[index] === item.target);
      resolveChallenge(modal, challenge, {
        correct,
        feedback: correct ? challenge.successFeedback : challenge.failureFeedback
      });
    });
    update();
  }

  function bindWordPuzzleEvents(modal, challenge) {
    const cells = [...modal.querySelectorAll("[data-word-cell]")];
    const validateButton = modal.querySelector("[data-word-validate]");
    const resetButton = modal.querySelector("[data-word-reset]");
    const values = {};
    let activeCell = cells.length ? Number(cells[0].dataset.wordCell) : null;

    const activate = (index) => {
      activeCell = index;
      cells.forEach((cell) => cell.classList.toggle("active", Number(cell.dataset.wordCell) === activeCell));
    };

    const update = () => {
      cells.forEach((cell) => {
        const index = Number(cell.dataset.wordCell);
        const letter = values[index] || "";
        const label = modal.querySelector(`[data-word-cell-letter="${index}"]`);
        if (label) label.textContent = letter;
        cell.classList.toggle("picked", Boolean(letter));
        cell.classList.toggle("active", index === activeCell);
      });
      const filled = cells.every((cell) => values[Number(cell.dataset.wordCell)]);
      if (validateButton) validateButton.disabled = !filled || !cells.length;
      if (resetButton) resetButton.disabled = Object.keys(values).length === 0;
    };

    const moveToNextEmpty = () => {
      const currentPosition = cells.findIndex((cell) => Number(cell.dataset.wordCell) === activeCell);
      const ordered = currentPosition >= 0 ? cells.slice(currentPosition + 1).concat(cells.slice(0, currentPosition + 1)) : cells;
      const next = ordered.find((cell) => !values[Number(cell.dataset.wordCell)]);
      if (next) activate(Number(next.dataset.wordCell));
    };

    const putLetter = (letter) => {
      if (activeCell === null) {
        showToast(t("wordPuzzlePickCellToast"));
        return;
      }
      values[activeCell] = String(letter || "").toUpperCase().slice(0, 1);
      moveToNextEmpty();
      update();
    };

    cells.forEach((cell) => {
      cell.addEventListener("click", () => activate(Number(cell.dataset.wordCell)));
    });
    modal.querySelectorAll("[data-word-letter]").forEach((button) => {
      button.addEventListener("click", () => putLetter(button.dataset.wordLetter));
    });
    modal.addEventListener("keydown", (event) => {
      if (event.key === "Backspace" && activeCell !== null) {
        delete values[activeCell];
        update();
        return;
      }
      if (/^[a-z]$/i.test(event.key)) {
        putLetter(event.key);
      }
    });
    resetButton?.addEventListener("click", () => {
      Object.keys(values).forEach((key) => delete values[key]);
      activeCell = cells.length ? Number(cells[0].dataset.wordCell) : null;
      update();
    });
    validateButton?.addEventListener("click", () => {
      const correct = cells.every((cell) => {
        const index = Number(cell.dataset.wordCell);
        return values[index] === cell.dataset.wordAnswer;
      });
      resolveChallenge(modal, challenge, {
        correct,
        feedback: correct ? challenge.successFeedback : challenge.failureFeedback
      });
    });
    update();
  }

  function bindClozeEvents(modal, challenge) {
    const selected = [];
    const validateButton = modal.querySelector("[data-cloze-validate]");
    const resetButton = modal.querySelector("[data-cloze-reset]");
    const update = () => {
      (challenge.answers || []).forEach((_, index) => {
        const slot = modal.querySelector(`[data-cloze-slot="${index}"]`);
        if (slot) slot.textContent = selected[index] || "...";
      });
      validateButton.disabled = selected.length !== challenge.answers.length;
      resetButton.disabled = selected.length === 0;
    };
    modal.querySelectorAll("[data-cloze-word]").forEach((button) => {
      button.addEventListener("click", () => {
        if (selected.length >= challenge.answers.length || button.classList.contains("picked")) return;
        selected.push(button.textContent);
        button.classList.add("picked");
        update();
      });
    });
    resetButton.addEventListener("click", () => {
      selected.length = 0;
      modal.querySelectorAll("[data-cloze-word]").forEach((button) => button.classList.remove("picked"));
      update();
    });
    validateButton.addEventListener("click", () => {
      const correct = challenge.answers.every((answer, index) => selected[index] === answer);
      resolveChallenge(modal, challenge, {
        correct,
        feedback: correct ? challenge.successFeedback : challenge.failureFeedback
      });
    });
    update();
  }

  function bindChallengeEvents(modal, challenge) {
    const interaction = challengeInteraction(challenge);
    bindChoiceEvents(modal, challenge);
    if (interaction === "sequence" || interaction === "chain") bindSequenceEvents(modal, challenge);
    if (interaction === "multiSelect") bindMultiSelectEvents(modal, challenge);
    if (interaction === "matching") bindMatchingEvents(modal, challenge);
    if (interaction === "folderSort") bindFolderSortEvents(modal, challenge);
    if (interaction === "wordGrid" || interaction === "arrowWords") bindWordPuzzleEvents(modal, challenge);
    if (interaction === "cloze") bindClozeEvents(modal, challenge);
  }

  function openChallenge(forced, action = null, options = {}) {
    if (!state) return false;
    if (state.gameOver) return false;
    if (document.querySelector(".modal-backdrop")) return false;
    if (!forced && Date.now() - state.lastChallengeAt < 18000) {
      showToast(t("noChallengeToast"));
      return false;
    }
    state.lastChallengeAt = Date.now();
    const sourceChallenge = pickChallenge({ preferredTypes: action?.preferredTypes });
    if (!sourceChallenge) {
      showToast(t("challengeBankToast"));
      return false;
    }
    const challenge = action ? actionChallenge(localizeChallenge(sourceChallenge), action) : localizeChallenge(sourceChallenge);
    if (options.actionCooldown) challenge.actionCooldown = true;
    const modal = document.createElement("div");
    modal.className = "modal-backdrop";
    modal.innerHTML = `
      <section class="modal-card challenge-modal" role="dialog" aria-modal="true" aria-label="${escapeHtml(t("challengeDialog"))}">
        <div class="modal-head">
          <img src="${ASSETS[challenge.icon] || ASSETS.incident}" alt="" />
          <div>
            <p class="side-counter" style="margin:0 0 8px">${escapeHtml(challenge.themeLabel)} - ${escapeHtml(challenge.levelLabel)} - ${escapeHtml(challenge.typeLabel)}</p>
            <h2>${escapeHtml(challenge.title)}</h2>
          </div>
        </div>
        <p class="question">${escapeHtml(challenge.prompt)}</p>
        ${renderChallengeClues(challenge)}
        ${renderChallengeInteraction(challenge)}
        <p class="challenge-bank-note">${escapeHtml(challengeStatsText())}</p>
      </section>
    `;
    document.body.appendChild(modal);
    bindChallengeEvents(modal, challenge);
    return true;
  }

  function createPlayer() {
    const input = document.querySelector("[data-player-name]");
    const levelInput = document.querySelector("input[name='level']:checked");
    const name = input?.value.trim() || t("defaultPlayer");
    const level = levelInput?.value || "5e";
    activeSideTab = "teams";
    state = defaultState(name, level);
    rates = computeRates();
    saveState();
    render();
  }

  function resetGame() {
    if (state && !state.gameOver && !window.confirm(t("resetConfirm"))) return;
    activeSideTab = "teams";
    localStorage.removeItem(STORAGE_KEY);
    document.querySelectorAll(".modal-backdrop").forEach((modal) => modal.remove());
    state = null;
    rates = emptyRates();
    render();
  }

  function setLevelTheme(level) {
    const cleanLevel = ["5e", "4e", "3e"].includes(level) ? level : "5e";
    document.body.dataset.level = cleanLevel;
  }

  function setLanguage(lang) {
    const next = I18N?.normalizeLang(lang) || "fr";
    if (next === currentLang) return;
    currentLang = next;
    localStorage.setItem(LANG_STORAGE_KEY, currentLang);
    if (state) state.lang = currentLang;
    setLanguageChrome();
    render({ preserveScroll: true });
  }

  function setTutorialCollapsed(next) {
    tutorialCollapsed = Boolean(next);
    try {
      localStorage.setItem(TUTORIAL_COLLAPSED_KEY, tutorialCollapsed ? "1" : "0");
    } catch {
      // Ignore storage failures; the button should still work for this session.
    }
    render({ preserveScroll: true });
  }

  function renderLanguageSwitch(extraClass = "") {
    return `
      <div class="language-switch ${extraClass}" role="group" aria-label="${escapeHtml(t("languageSwitch"))}">
        <button class="flag-button ${currentLang === "fr" ? "active" : ""}" type="button" data-language="fr" aria-pressed="${currentLang === "fr"}" title="${escapeHtml(I18N?.t("fr", "languageName") || "Francais")}">🇫🇷 <span>FR</span></button>
        <button class="flag-button ${currentLang === "en" ? "active" : ""}" type="button" data-language="en" aria-pressed="${currentLang === "en"}" title="${escapeHtml(I18N?.t("en", "languageName") || "English")}">🇬🇧 <span>EN</span></button>
      </div>
    `;
  }

  function setSideTab(tabId) {
    if (!SIDE_TABS.some((tab) => tab.id === tabId)) return;
    activeSideTab = tabId;
    render();
  }

  function setClassroomTab(index) {
    if (!state?.classrooms) return;
    const numericIndex = Number(index);
    const nextIndex = clamp(Number.isFinite(numericIndex) ? numericIndex : 0, 0, classroomCount() - 1);
    state.classrooms.active = nextIndex;
    render({ preserveScroll: true });
  }

  function releaseInteractionSoon() {
    setTimeout(() => {
      interactionInProgress = false;
    }, 80);
  }

  function bindGlobalEvents() {
    document.addEventListener("pointerdown", (event) => {
      interactionInProgress = true;
      const resetButton = event.target.closest("[data-new-game]");
      if (!resetButton) return;
      resetHandledAt = Date.now();
      event.preventDefault();
      event.stopPropagation();
      resetGame();
    }, true);

    document.addEventListener("pointerup", releaseInteractionSoon, true);
    document.addEventListener("pointercancel", releaseInteractionSoon, true);

    document.addEventListener("click", (event) => {
      const resetButton = event.target.closest("[data-new-game]");
      if (!resetButton) return;
      event.preventDefault();
      event.stopPropagation();
      if (Date.now() - resetHandledAt > 600) {
        resetHandledAt = Date.now();
        resetGame();
      }
    }, true);
  }

  function capturePanelScroll() {
    return {
      status: document.querySelector(".status-panel")?.scrollTop || 0,
      side: document.querySelector(".side-panel")?.scrollTop || 0,
      tab: document.querySelector(".tab-section")?.scrollTop || 0,
      tabId: activeSideTab
    };
  }

  function restorePanelScroll(scrollPositions) {
    if (!scrollPositions) return;
    const statusPanel = document.querySelector(".status-panel");
    const sidePanel = document.querySelector(".side-panel");
    const tabPanel = document.querySelector(".tab-section");
    if (statusPanel) statusPanel.scrollTop = scrollPositions.status;
    if (sidePanel) sidePanel.scrollTop = scrollPositions.side;
    if (tabPanel && scrollPositions.tabId === activeSideTab) tabPanel.scrollTop = scrollPositions.tab;
  }

  function render(options = {}) {
    const app = document.querySelector("#app");
    setLanguageChrome();
    if (!state?.playerName) {
      rates = emptyRates();
      setLevelTheme("5e");
      app.innerHTML = renderWelcome();
      bindWelcomeEvents();
      return;
    }

    const scrollPositions = options.preserveScroll ? capturePanelScroll() : null;
    setLevelTheme(state.level);
    if (!state.gameOver) syncProgression();
    rates = state.gameOver ? emptyRates() : computeRates();
    app.innerHTML = `
      <main class="classroom-main" aria-label="${escapeHtml(t("classroomMain"))}">
        ${renderClassroomScene()}
        ${state.gameOver ? "" : renderTutorialPopup()}
      </main>
      <aside class="side-panel" aria-label="${escapeHtml(t("sidePanel"))}">
        ${renderSidePanel()}
      </aside>
      <section class="wide-notes" aria-label="${escapeHtml(t("notesPanel"))}">
        ${renderCampaignPanel("wide-campaign")}
        ${renderJournal()}
        <button class="reset-corner" type="button" data-new-game title="${escapeHtml(t("resetTitle"))}">${escapeHtml(t("resetButton"))}</button>
      </section>
      ${state.gameOver ? renderGameOverModal() : ""}
      <div class="toast" role="status" aria-live="polite"></div>
    `;
    bindEvents();
    restorePanelScroll(scrollPositions);
    saveState();
    if (pendingProgressToast) {
      const message = pendingProgressToast;
      pendingProgressToast = null;
      showToast(message);
    }
  }

  function renderWelcome() {
    return `
      <main class="welcome-screen" aria-label="${escapeHtml(t("playerName"))}">
        <section class="welcome-card">
          <div class="welcome-copy">
            <div class="welcome-toprow">
              <div class="welcome-kicker"><img src="${ASSETS.cart}" alt="" /> ${escapeHtml(t("welcomeKicker"))}</div>
              ${renderLanguageSwitch("welcome-lang")}
            </div>
            <h1>${escapeHtml(t("appTitle"))}</h1>
            <label class="welcome-form">
              <span>${escapeHtml(t("playerName"))}</span>
              <input data-player-name type="text" maxlength="32" autocomplete="off" placeholder="${escapeHtml(t("playerPlaceholder"))}" />
            </label>
            <fieldset class="level-select" aria-label="${escapeHtml(t("level"))}">
              <legend>${escapeHtml(t("level"))}</legend>
              <label><input type="radio" name="level" value="5e" checked /><span>5e</span></label>
              <label><input type="radio" name="level" value="4e" /><span>4e</span></label>
              <label><input type="radio" name="level" value="3e" /><span>3e</span></label>
            </fieldset>
            <button class="welcome-start" type="button" data-create-player>${escapeHtml(t("start"))}</button>
          </div>
          <div class="welcome-visual" aria-hidden="true">
            <img class="welcome-hero-image" src="${ASSETS.classroomHero}" alt="" />
            <div class="welcome-token learners"><img src="${ASSETS.learners}" alt="" /><span>0 ${escapeHtml(resourceName("learners", 1))}</span></div>
            <div class="welcome-token material"><img src="${ASSETS.material}" alt="" /><span>0 ${escapeHtml(resourceName("material", 1))}</span></div>
            <div class="welcome-token teachers"><img src="${ASSETS.teachers}" alt="" /><span>0 ${escapeHtml(resourceName("teachers", 1))}</span></div>
            <div class="welcome-token mastery"><img src="${ASSETS.mastery}" alt="" /><span>0 ${escapeHtml(resourceName("mastery", 1))}</span></div>
            <div class="welcome-path">
              <img src="${ASSETS.sensor}" alt="" />
              <img src="${ASSETS.motor}" alt="" />
              <img src="${ASSETS.router}" alt="" />
              <img src="${ASSETS.eco}" alt="" />
            </div>
          </div>
        </section>
      </main>
    `;
  }

  function renderGameOverModal() {
    const snapshot = state.gameOver || {};
    const learners = Number.isFinite(snapshot.learners) ? snapshot.learners : learnerTotal();
    const challenges = Number.isFinite(snapshot.challengesSolved) ? snapshot.challengesSolved : state.stats.challengesSolved;
    const badges = Number.isFinite(snapshot.badges) ? snapshot.badges : state.badges;
    return `
      <div class="modal-backdrop game-over-backdrop">
        <section class="modal-card game-over-card" role="dialog" aria-modal="true" aria-label="${escapeHtml(t("gameOverKicker"))}">
          <p class="game-over-kicker">${escapeHtml(t("gameOverKicker"))}</p>
          <h2>${escapeHtml(t("gameOverTitle"))}</h2>
          <p class="game-over-copy">${escapeHtml(t("gameOverText"))}</p>
          <div class="game-over-stats" aria-label="${escapeHtml(t("dashboard"))}">
            <span>${escapeHtml(t("gameOverStatLevel", { level: state.level }))}</span>
            <span>${escapeHtml(t("gameOverStatLearners", { count: learners }))}</span>
            <span>${escapeHtml(t("gameOverStatChallenges", { count: challenges }))}</span>
            <span>${escapeHtml(t("gameOverStatKnowledge", { count: badges }))}</span>
          </div>
          <button class="paper-button buy game-over-restart" type="button" data-new-game>${escapeHtml(t("gameOverRestart"))}</button>
        </section>
      </div>
    `;
  }

  function renderStatusPanel() {
    return `
      <section class="control-card player-card">
        <div class="hud-row">
          <div class="game-title"><img src="${ASSETS.cart}" alt="" /> Labo Techno <span>${escapeHtml(state.playerName)} - ${escapeHtml(state.level)}</span></div>
          <button class="hud-button quiet" type="button" data-new-game>${escapeHtml(t("resetButton"))}</button>
        </div>
      </section>
      <section class="control-card resources-card">
        <h2>${escapeHtml(t("dashboard"))}</h2>
        <div class="resource-stack">
          ${resourcePill(resourceName("learners", 2), state.resources.learners, rates.learners, "learners")}
          ${resourcePill(resourceName("material", 2), state.resources.material, rates.material, "material")}
          ${resourcePill(resourceName("teachers", 2), state.resources.teachers, rates.teachers, "teachers")}
          ${resourcePill(resourceName("resources", 2), state.resources.resources, rates.resources, "resources")}
          ${resourcePill(resourceName("mastery", 2), state.resources.mastery, rates.mastery, "mastery")}
        </div>
      </section>
      <section class="control-card gauges-card">
        <div class="bars-row">
          ${bar(t("motivation"), state.resources.motivation, "motivation")}
          ${bar(t("disorder"), state.resources.disorder, "disorder")}
          ${knowledgeBar()}
        </div>
      </section>
      <section class="control-card actions-zone" aria-label="${escapeHtml(t("workshopActions"))}">
        <h2>${escapeHtml(t("workshopActions"))}</h2>
        ${ACTIONS.map(renderAction).join("")}
      </section>
      ${renderCampaignPanel("wide-campaign")}
      ${renderJournal()}
    `;
  }

  function renderClassroomScene() {
    const students = sanitizeStudents(state.students);
    const activeRoom = activeClassroomIndex();
    const roomStart = activeRoom * CLASSROOM_SEAT_COUNT;
    const visible = students.slice(roomStart, roomStart + CLASSROOM_SEAT_COUNT);
    const overflow = Math.max(0, students.length - totalSeatCapacity());
    const roomFill = visible.length;
    return `
      <section class="classroom-scene">
        <div class="classroom-topline">
          <div>
            <span>${escapeHtml(t("labRunning"))}</span>
            <strong>${format(state.resources.learners)} ${escapeHtml(resourceName("learners", state.resources.learners))}</strong>
          </div>
          ${renderClassroomTabs(activeRoom)}
        </div>
        <div class="classroom-room">
          <div class="classroom-wall">
            <div class="whiteboard">
              <span>${escapeHtml(t("lessonPlan", { index: activeRoom + 1 }))}</span>
              <small>${escapeHtml(t("placeLine", { count: roomFill, total: CLASSROOM_SEAT_COUNT, level: state.level, stats: challengeStatsText() }))}</small>
            </div>
            ${renderTeacherDesk()}
          </div>
          <div class="classroom-floor">
            <div class="side-storage left">
              ${renderShelfProp("tools", Math.floor(state.resources.material / 12), "stock")}
              ${renderSpaceStation("sensorBench", "sensor")}
              ${renderSpaceStation("energyBench", "battery")}
            </div>
            <div class="seat-grid">
              ${Array.from({ length: CLASSROOM_SEAT_COUNT }, (_, index) => renderSeat(index, visible[index], activeRoom)).join("")}
            </div>
            <div class="side-storage right">
              ${renderSpaceStation("networkBay", "router")}
              ${renderSpaceStation("fablab", "cart")}
              ${overflow > 0 ? `<div class="overflow-learners">+${overflow}</div>` : ""}
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function renderClassroomTabs(activeRoom) {
    const rooms = classroomCount();
    const canOpenNext = allOpenRoomsFull() && rooms < MAX_CLASSROOMS;
    return `
      <nav class="room-tabs" aria-label="${escapeHtml(t("openRoomsLabel"))}">
        ${Array.from({ length: rooms }, (_, index) => {
          const start = index * CLASSROOM_SEAT_COUNT;
          const count = sanitizeStudents(state.students).slice(start, start + CLASSROOM_SEAT_COUNT).length;
          return `
            <button class="room-tab ${index === activeRoom ? "active" : ""}" type="button" data-classroom-tab="${index}" aria-pressed="${index === activeRoom}">
              <span>${escapeHtml(t("roomLabel", { index: index + 1 }))}</span>
              <small>${count}/${CLASSROOM_SEAT_COUNT}</small>
            </button>
          `;
        }).join("")}
        ${canOpenNext ? `<button class="room-tab add-room ${canPay(classroomCost()) ? "" : "blocked"}" type="button" data-open-room aria-disabled="${!canPay(classroomCost())}">${escapeHtml(t("addRoom"))}</button>` : ""}
      </nav>
    `;
  }

  function renderTeacherDesk() {
    const teacherCount = Math.floor(state.resources.teachers || 0);
    return `
      <div class="teacher-desk ${teacherCount > 0 ? "active" : ""}">
        <img src="${ASSETS.teachers}" alt="" />
        <div>
          <span>${teacherCount > 0 ? `${teacherCount} ${escapeHtml(resourceName("teachers", teacherCount))}` : escapeHtml(t("mentorStation"))}</span>
          <small>${teacherCount > 0 ? escapeHtml(t("sessionLed")) : escapeHtml(t("waiting"))}</small>
        </div>
      </div>
    `;
  }

  function renderSeat(index, student, roomIndex) {
    const equipment = deskEquipment(index, roomIndex);
    const occupied = Boolean(student);
    return `
      <figure class="class-seat ${occupied ? "occupied" : ""}" style="--seat-delay:${(index % 6) * 18}ms" aria-label="Place ${index + 1}">
        <span class="chair-back"></span>
        ${occupied ? renderStudentAtDesk(student, index) : ""}
        <span class="desk-top">
          ${equipment ? renderDeskEquipment(equipment) : ""}
        </span>
        <span class="desk-leg left"></span>
        <span class="desk-leg right"></span>
      </figure>
    `;
  }

  function renderStudentAtDesk(student, index) {
    const variant = Number.isFinite(student.variant) ? student.variant % ASSETS.studentSprites.length : index % ASSETS.studentSprites.length;
    const src = ASSETS.studentSprites[variant];
    const nudge = (index % 5) - 2;
    return `
      <span class="student-bust" style="--nudge:${nudge}px">
        <img src="${src}" alt="" />
      </span>
    `;
  }

  function visibleMaterialCount() {
    return Math.max(0, Math.floor(state.resources.material || 0));
  }

  function deskEquipment(index, roomIndex = 0) {
    const absoluteIndex = roomIndex * CLASSROOM_SEAT_COUNT + index;
    const fromStock = Math.min(totalSeatCapacity(), Math.floor(visibleMaterialCount() / 9));
    if (absoluteIndex >= fromStock) return "";
    if (state.spaces.networkBay?.owned && absoluteIndex % 3 === 0) return "computer";
    if (state.spaces.sensorBench?.owned && absoluteIndex % 4 === 1) return "sensor";
    if (state.spaces.energyBench?.owned && absoluteIndex % 4 === 2) return "energy";
    return EQUIPMENT_CYCLE[absoluteIndex % EQUIPMENT_CYCLE.length];
  }

  function renderDeskEquipment(type) {
    if (type === "computer") {
      return `<span class="desk-computer" aria-hidden="true"><span></span></span>`;
    }
    if (type === "tablet") {
      return `<span class="desk-tablet" aria-hidden="true"></span>`;
    }
    const iconName = type === "energy" ? "battery" : type;
    return `<img class="desk-equipment-icon" src="${ASSETS[iconName] || ASSETS.tools}" alt="" />`;
  }

  function renderShelfProp(iconName, count, variant) {
    const visibleCount = Math.max(0, Math.min(9, count));
    return `
      <div class="shelf-prop ${visibleCount > 0 ? "active" : ""} ${variant}">
        <img src="${ASSETS[iconName]}" alt="" />
        <span>${visibleCount > 0 ? `x${visibleCount}` : ""}</span>
      </div>
    `;
  }

  function renderSpaceStation(spaceId, iconName) {
    const current = state.spaces[spaceId];
    const active = Boolean(current?.owned);
    return `
      <div class="station-prop ${active ? "active" : ""}">
        <img src="${ASSETS[iconName]}" alt="" />
        ${active ? `<span>${escapeHtml(t("levelShort"))} ${current.level}</span>` : ""}
      </div>
    `;
  }

  function resourcePill(label, value, rate, iconName) {
    return `<div class="resource-pill"><img src="${ASSETS[iconName]}" alt="" /><span>${escapeHtml(label)}</span><strong>${escapeHtml(formatLiveValue(iconName, value))}</strong><small>${escapeHtml(formatRate(rate))}</small></div>`;
  }

  function bar(label, value, type) {
    return `
      <div class="bar-block">
        <div class="bar-label"><span>${label}</span><span>${Math.round(value)} %</span></div>
        <div class="bar-track"><div class="bar-fill ${type}" style="width:${Math.max(0, Math.min(100, value))}%"></div></div>
      </div>
    `;
  }

  function knowledgeBar() {
    const unlocked = Object.values(state.knowledge).filter(Boolean).length;
    const total = KNOWLEDGE.length;
    const percent = total ? (unlocked / total) * 100 : 0;
    return `
      <div class="bar-block knowledge-meter">
        <div class="bar-label">
          <span>${escapeHtml(t("knowledge"))}</span>
          <span>${unlocked}/${total}</span>
        </div>
        <div class="bar-track"><div class="bar-fill knowledge" style="width:${percent}%"></div></div>
      </div>
    `;
  }

  function renderCampaignPanel(extraClass = "") {
    const stages = campaignStatuses();
    const current = currentCampaignStatus();
    const completedStages = stages.filter((stage) => stage.done).length;
    const finalDone = completedStages === stages.length;
    const rewardText = current?.reward ? effectText(current.reward) : t("noEffect");
    return `
      <section class="campaign-card ${extraClass} ${finalDone ? "complete" : ""}" aria-label="${escapeHtml(t("campaignTitle"))}">
        <div class="campaign-head">
          <span>${escapeHtml(t("campaignTitle"))}</span>
          <strong>${completedStages}/${stages.length}</strong>
        </div>
        <div class="campaign-copy">
          <h3>${escapeHtml(finalDone ? t("campaignCompleteTitle") : current.title)}</h3>
          <p>${escapeHtml(finalDone ? t("campaignCompleteText") : current.summary)}</p>
        </div>
        <div class="campaign-progress">
          <span style="width:${finalDone ? 100 : current.percent}%"></span>
        </div>
        <ul class="campaign-objectives">
          ${current.objectives.map((objective) => `
            <li class="${objective.done ? "done" : ""}">
              <span>${escapeHtml(objective.text)}</span>
              <strong>${escapeHtml(progressText(objective.current, objective.target))}</strong>
            </li>
          `).join("")}
        </ul>
        <div class="campaign-reward">${escapeHtml(t(finalDone ? "campaignFinishedReward" : "stageReward", { reward: rewardText }))}</div>
        <div class="campaign-track" aria-label="${escapeHtml(t("campaignTrack"))}">
          ${stages.map((stage, index) => `<span class="${stage.done ? "done" : ""} ${stage.id === current.id ? "active" : ""}">${index + 1}</span>`).join("")}
        </div>
      </section>
    `;
  }

  function renderSpaceCard(space) {
    const current = state.spaces[space.id];
    const locked = state.resources.mastery < space.unlockMastery;
    const maxed = current.owned && current.level >= space.maxLevel;
    const cost = spaceCost(space);
    return `
      <article class="game-card ${locked ? "locked" : ""}">
        <div class="card-title">
          <img src="${ASSETS[space.icon]}" alt="" />
          <span>${escapeHtml(tr("spaces", space, "name"))}</span>
          <span class="level-badge">${current.owned ? `${escapeHtml(t("levelShort"))} ${current.level}` : escapeHtml(t("openRoom"))}</span>
        </div>
        <div class="card-body">
          ${escapeHtml(tr("spaces", space, "description"))}
          <div class="card-effects">${escapeHtml(productionText(space.production))}</div>
        </div>
        <div class="button-row">
          <button class="paper-button buy ${locked || maxed || !canPay(cost) ? "blocked" : ""}" type="button" data-space="${space.id}" aria-disabled="${locked || maxed || !canPay(cost)}">${maxed ? escapeHtml(t("stabilized")) : costText(cost)}</button>
          <button class="paper-button" type="button" disabled>${locked ? escapeHtml(t("masteryRequired", { count: space.unlockMastery })) : escapeHtml(tr("spaces", space, "effect"))}</button>
        </div>
      </article>
    `;
  }

  function renderRecruitCard(recruit) {
    const current = state.recruits[recruit.id];
    const cost = recruitCost(recruit);
    const missingRequirement = !canMeet(recruit.requires);
    return `
      <article class="game-card employee">
        <div class="card-title">
          <img src="${ASSETS[recruit.icon]}" alt="" />
          <span>${escapeHtml(tr("recruits", recruit, "name"))}</span>
          <span class="level-badge">x${current.count}</span>
        </div>
        <div class="card-body">
          ${escapeHtml(tr("recruits", recruit, "description"))}
          <div class="card-effects">${escapeHtml(productionText(recruit.production))}</div>
        </div>
        <div class="button-row">
          <button class="paper-button buy ${missingRequirement || !canPay(cost) ? "blocked" : ""}" type="button" data-recruit="${recruit.id}" aria-disabled="${missingRequirement || !canPay(cost)}">${missingRequirement ? requirementText(recruit.requires) : costText(cost)}</button>
          <button class="paper-button" type="button" disabled>${recruit.unlockMastery ? escapeHtml(t("masteryRequired", { count: recruit.unlockMastery })) : escapeHtml(t("available"))}</button>
        </div>
      </article>
    `;
  }

  function renderAction(action) {
    const missingRequirement = !canMeet(action.requires);
    const missingCost = action.cost && !canPay(action.cost);
    const cooldown = actionCooldownRemaining();
    const cooldownActive = cooldown > 0;
    const blocked = missingRequirement || missingCost || cooldownActive;
    const detail = missingRequirement
      ? requirementText(action.requires)
      : missingCost
        ? t("actionCostLabel", { cost: costText(action.cost) })
        : cooldownActive
          ? t("actionCooldownLabel", { seconds: Math.ceil(cooldown / 1000) })
          : action.cost
            ? `${costText(action.cost)} - ${tr("actions", action, "text")}`
            : tr("actions", action, "text");
    return `
      <button class="action-card ${blocked ? "blocked" : ""}" type="button" data-action="${action.id}" aria-disabled="${blocked}">
        <img src="${ASSETS[action.icon]}" alt="" />
        <span><strong>${escapeHtml(tr("actions", action, "name"))}</strong><span>${escapeHtml(detail)}</span></span>
      </button>
    `;
  }

  function renderJournal() {
    return `
      <section class="bottom-card">
        <h2>${escapeHtml(t("journal"))}</h2>
        <ul class="journal-list">
          ${state.log.slice(-5).reverse().map((line) => `<li>${escapeHtml(line)}</li>`).join("")}
        </ul>
      </section>
    `;
  }

  function renderSidePanel() {
    const activeTab = SIDE_TABS.some((tab) => tab.id === activeSideTab) ? activeSideTab : "teams";
    return `
      <section class="pilot-section dashboard-section">
        <header>
          <span>${escapeHtml(t("dashboard"))}</span>
          <div class="panel-header-actions">
            <small><img src="${ASSETS.mastery}" alt="" /> ${escapeHtml(t("knowledgeToken", { count: state.badges }))}</small>
            ${renderLanguageSwitch("panel-lang")}
          </div>
        </header>
        <div class="resource-stack">
          ${resourcePill(resourceName("learners", 2), state.resources.learners, rates.learners, "learners")}
          ${resourcePill(resourceName("material", 2), state.resources.material, rates.material, "material")}
          ${resourcePill(resourceName("teachers", 2), state.resources.teachers, rates.teachers, "teachers")}
          ${resourcePill(resourceName("resources", 2), state.resources.resources, rates.resources, "resources")}
          ${resourcePill(resourceName("mastery", 2), state.resources.mastery, rates.mastery, "mastery")}
        </div>
        <div class="bars-row">
          ${bar(t("motivation"), state.resources.motivation, "motivation")}
          ${bar(t("disorder"), state.resources.disorder, "disorder")}
          ${knowledgeBar()}
        </div>
      </section>
      ${renderSideTabs(activeTab)}
      ${renderSideTabPanel(activeTab)}
    `;
  }

  function renderSideTabs(activeTab) {
    return `
      <nav class="pilot-tabs" role="tablist" aria-label="${escapeHtml(t("sidePanel"))}">
        ${SIDE_TABS.map((tab) => `
          <button class="pilot-tab ${activeTab === tab.id ? "active" : ""}" type="button" role="tab" data-side-tab="${tab.id}" aria-selected="${activeTab === tab.id}">
            <img src="${ASSETS[tab.icon]}" alt="" />
            <span>${escapeHtml(tr("sideTabs", tab, "label"))}</span>
          </button>
        `).join("")}
      </nav>
    `;
  }

  function renderSideTabPanel(activeTab) {
    if (activeTab === "stations") {
      return renderModuleTab(t("stations"), "tools", SPACES.map(renderSideSpace).join(""), "stations-tab");
    }
    if (activeTab === "protocols") {
      return renderModuleTab(t("protocols"), "mastery", KNOWLEDGE.map(renderKnowledge).join(""), "protocols-tab");
    }
    if (activeTab === "actions") {
      return `
        <section class="pilot-section tab-section actions-tab" role="tabpanel">
          <header><span>${escapeHtml(t("workshopActions"))}</span></header>
          <div class="action-grid">
            ${ACTIONS.map(renderAction).join("")}
          </div>
        </section>
      `;
    }
    if (activeTab === "notes") {
      return `
        <section class="pilot-section tab-section notes-tab" role="tabpanel">
          <div class="notes-tab-grid">
            ${renderCampaignPanel("notes-campaign")}
            ${renderJournal()}
          </div>
        </section>
      `;
    }
    return renderModuleTab(t("teams"), "learners", RECRUITS.map(renderSideRecruit).join(""), "teams-tab");
  }

  function renderModuleTab(title, iconName, content, className = "") {
    return `
      <section class="pilot-section tab-section module-tab ${className}" role="tabpanel">
        ${renderModuleSection(title, iconName, content)}
      </section>
    `;
  }

  function renderModuleSection(title, iconName, content) {
    return `
      <section class="module-section">
        <header>
          <img src="${ASSETS[iconName]}" alt="" />
          <span>${escapeHtml(title)}</span>
        </header>
        <div class="module-lane">${content}</div>
      </section>
    `;
  }

  function renderSideRecruit(recruit) {
    const current = state.recruits[recruit.id];
    const locked = state.resources.mastery < recruit.unlockMastery;
    const cost = recruitCost(recruit);
    const missingRequirement = !canMeet(recruit.requires);
    const incomingLearners = Math.max(0, Math.floor(recruit.onHire?.learners || 0));
    const noSeats = incomingLearners > 0 && !hasSeatCapacity(incomingLearners);
    const blocked = locked || missingRequirement || noSeats || !canPay(cost);
    const buttonLabel = locked
      ? t("masteryRequired", { count: recruit.unlockMastery })
      : missingRequirement ? requirementText(recruit.requires)
      : noSeats ? t("openRoom")
      : t("mobilize", { cost: costText(cost) });
    return `
      <article class="module-node team ${locked ? "locked" : ""}">
        <span class="node-pin"></span>
        <div class="node-icon"><img src="${ASSETS[recruit.icon]}" alt="" /></div>
        <div class="node-copy">
          <h3><span>${escapeHtml(tr("recruits", recruit, "name"))}</span><em>x${current.count}</em></h3>
          <p>${escapeHtml(tr("recruits", recruit, "description"))}</p>
          <button class="paper-button buy ${blocked ? "blocked" : ""}" type="button" data-recruit="${recruit.id}" aria-disabled="${blocked}">${escapeHtml(buttonLabel)}</button>
        </div>
      </article>
    `;
  }

  function renderSideSpace(space) {
    const current = state.spaces[space.id];
    const isClassroom = space.id === "classroom";
    const locked = state.resources.mastery < space.unlockMastery;
    const cost = spaceCost(space);
    const maxed = isClassroom ? classroomCount() >= MAX_CLASSROOMS : current.owned && current.level >= space.maxLevel;
    const waitingForFullRoom = isClassroom && !maxed && !allOpenRoomsFull();
    const blocked = locked || maxed || waitingForFullRoom || !canPay(cost);
    const stateLabel = isClassroom
      ? `${classroomCount()}/${MAX_CLASSROOMS} ${currentLang === "en" ? "rooms" : "salles"}`
      : current.owned ? `${t("levelShort").toLowerCase()} ${current.level}` : t("offline");
    const buttonLabel = isClassroom
      ? maxed ? t("fullRooms") : waitingForFullRoom ? t("seatsUsed", { learners: learnerTotal(), seats: totalSeatCapacity() }) : t("open", { cost: costText(cost) })
      : maxed ? t("stabilized") : locked ? t("masteryRequired", { count: space.unlockMastery }) : t("activate", { cost: costText(cost) });
    return `
      <article class="module-node station ${current.owned ? "online" : ""} ${locked ? "locked" : ""}">
        <span class="node-pin"></span>
        <div class="node-icon"><img src="${ASSETS[space.icon]}" alt="" /></div>
        <div class="node-copy">
          <h3><span>${escapeHtml(tr("spaces", space, "name"))}</span><em>${escapeHtml(stateLabel)}</em></h3>
          <p>${escapeHtml(tr("spaces", space, "description"))}</p>
          <button class="paper-button buy ${blocked ? "blocked" : ""}" type="button" data-space="${space.id}" aria-disabled="${blocked}">${escapeHtml(buttonLabel)}</button>
        </div>
      </article>
    `;
  }

  function renderKnowledge(item) {
    const owned = state.knowledge[item.id];
    return `
      <article class="module-node protocol ${owned ? "online" : ""}">
        <span class="node-pin"></span>
        <div class="node-icon"><img src="${ASSETS[item.icon]}" alt="" /></div>
        <div class="node-copy">
          <h3><span>${escapeHtml(tr("knowledge", item, "name"))}</span><em>${owned ? escapeHtml(t("valid")) : escapeHtml(t("knowledgeToken", { count: item.cost }))}</em></h3>
          <p>${escapeHtml(tr("knowledge", item, "description"))}</p>
          <button class="paper-button buy ${owned || state.badges < item.cost ? "blocked" : ""}" type="button" data-knowledge="${item.id}" aria-disabled="${owned || state.badges < item.cost}">${owned ? escapeHtml(t("integrated")) : escapeHtml(t("validateProtocol"))}</button>
        </div>
      </article>
    `;
  }

  function guideInstruction(step) {
    if (!step?.kind || !step?.target) return "";
    if (step.kind === GUIDE_TARGETS.recruit) {
      const recruit = RECRUITS.find((item) => item.id === step.target);
      if (!recruit) return "";
      return t("guide.recruitInstruction", { name: tr("recruits", recruit, "name") });
    }
    if (step.kind === GUIDE_TARGETS.action) {
      const action = ACTIONS.find((item) => item.id === step.target);
      if (!action) return "";
      return t("guide.actionInstruction", { name: tr("actions", action, "name") });
    }
    if (step.kind === GUIDE_TARGETS.space) {
      const space = SPACES.find((item) => item.id === step.target);
      if (!space) return "";
      return t("guide.spaceInstruction", { name: tr("spaces", space, "name") });
    }
    if (step.kind === GUIDE_TARGETS.knowledge) {
      const item = KNOWLEDGE.find((entry) => entry.id === step.target);
      if (!item) return "";
      return t("guide.knowledgeInstruction", { name: tr("knowledge", item, "name") });
    }
    return "";
  }

  function guideTabHint(step) {
    if (!step?.tab) return "";
    const tab = SIDE_TABS.find((item) => item.id === step.tab);
    if (!tab) return "";
    return t("guide.panelHint", { tab: tr("sideTabs", tab, "label") });
  }

  function renderTutorialPopup() {
    const step = guideStep();
    if (!step || step.id === "idleLoop") return "";
    const percent = step.progress?.target ? clamp((step.progress.current / step.progress.target) * 100, 0, 100) : 0;
    const progress = step.progress ? progressText(step.progress.current, step.progress.target) : "";
    const goal = progress ? `${step.goal.replace(/[.!?]$/, "")} (${progress})` : step.goal;
    const instruction = guideInstruction(step);
    const tabHint = guideTabHint(step);
    if (tutorialCollapsed) {
      return `
        <section class="tutorial-popup collapsed" role="status" aria-live="polite" aria-label="${escapeHtml(t("guide.title"))}">
          <button class="tutorial-toggle" type="button" data-toggle-tutorial="open" aria-expanded="false">
            <span>${escapeHtml(t("guide.title"))}</span>
            <strong>${escapeHtml(t("guide.openCoach"))}</strong>
          </button>
        </section>
      `;
    }
    return `
      <section class="tutorial-popup" role="status" aria-live="polite" aria-label="${escapeHtml(t("guide.title"))}">
        <div class="tutorial-top">
          <div class="tutorial-badge">${escapeHtml(t("guide.title"))}</div>
          <button class="tutorial-mini" type="button" data-toggle-tutorial="close" aria-expanded="true">${escapeHtml(t("guide.minimizeCoach"))}</button>
        </div>
        <div class="tutorial-content">
          <div>
            <h2>${escapeHtml(step.title)}</h2>
            <p>${escapeHtml(step.text)}</p>
          </div>
          <div class="tutorial-progress" aria-hidden="true">
            <span style="width:${percent}%"></span>
          </div>
          <p class="tutorial-goal">${escapeHtml(goal)}</p>
          ${instruction ? `
            <div class="tutorial-instruction">
              <span>${escapeHtml(t("guide.nextStep"))}</span>
              <strong>${escapeHtml(instruction)}</strong>
              ${tabHint ? `<small>${escapeHtml(tabHint)}</small>` : ""}
            </div>
          ` : ""}
        </div>
        <div class="tutorial-loop" aria-label="${escapeHtml(t("guide.loopTitle"))}">
          ${["loopRecruit", "loopProduce", "loopUpgrade", "loopChallenge"].map((key, index) => `
            <span class="${guideLoopIndex(step) === index ? "active" : ""}">${escapeHtml(t(`guide.${key}`))}</span>
          `).join("")}
        </div>
      </section>
    `;
  }

  function guideLoopIndex(step) {
    if (!step) return 0;
    if (step.kind === GUIDE_TARGETS.recruit) return 0;
    if (step.kind === GUIDE_TARGETS.action && step.target !== "challenge") return 1;
    if (step.kind === GUIDE_TARGETS.space || step.kind === GUIDE_TARGETS.knowledge) return 2;
    return 3;
  }

  function bindWelcomeEvents() {
    const input = document.querySelector("[data-player-name]");
    document.querySelector("[data-create-player]")?.addEventListener("click", createPlayer);
    bindLanguageEvents();
    document.querySelectorAll("input[name='level']").forEach((radio) => {
      radio.addEventListener("change", () => {
        if (radio.checked) setLevelTheme(radio.value);
      });
    });
    input?.focus();
    input?.addEventListener("keydown", (event) => {
      if (event.key === "Enter") createPlayer();
    });
  }

  function bindLanguageEvents() {
    document.querySelectorAll("[data-language]").forEach((button) => {
      button.addEventListener("click", () => setLanguage(button.dataset.language));
    });
  }

  function bindEvents() {
    bindLanguageEvents();
    document.querySelectorAll("[data-space]").forEach((button) => button.addEventListener("click", () => buySpace(button.dataset.space)));
    document.querySelectorAll("[data-recruit]").forEach((button) => button.addEventListener("click", () => hireRecruit(button.dataset.recruit)));
    document.querySelectorAll("[data-action]").forEach((button) => button.addEventListener("click", () => useAction(button.dataset.action)));
    document.querySelectorAll("[data-knowledge]").forEach((button) => button.addEventListener("click", () => buyKnowledge(button.dataset.knowledge)));
    document.querySelectorAll("[data-side-tab]").forEach((button) => button.addEventListener("click", () => setSideTab(button.dataset.sideTab)));
    document.querySelectorAll("[data-classroom-tab]").forEach((button) => button.addEventListener("click", () => setClassroomTab(button.dataset.classroomTab)));
    document.querySelectorAll("[data-open-room]").forEach((button) => button.addEventListener("click", openClassroom));
    document.querySelectorAll("[data-toggle-tutorial]").forEach((button) => button.addEventListener("click", () => setTutorialCollapsed(button.dataset.toggleTutorial === "close")));
  }

  function tick() {
    if (!state?.playerName) return;
    if (state.gameOver) {
      rates = emptyRates();
      return;
    }
    const now = Date.now();
    const dt = Math.min(5, (now - state.lastTickAt) / 1000);
    state.lastTickAt = now;
    rates = computeRates();
    state.resources.learners += rates.learners * dt;
    state.resources.material += rates.material * dt;
    state.resources.teachers += rates.teachers * dt;
    state.resources.resources += rates.resources * dt;
    state.resources.mastery += rates.mastery * dt;
    state.resources.motivation = Math.max(0, Math.min(100, state.resources.motivation + rates.motivation * dt - 0.004 * dt));
    state.resources.disorder = Math.max(0, Math.min(100, state.resources.disorder + rates.disorder * dt));
    state.stats.totalMastery += Math.max(0, rates.mastery * dt);

    if (state.resources.disorder >= 100) {
      triggerGameOver();
      return;
    }

    if (state.resources.learners >= 1 && now - state.lastChallengeAt > 60000 && Math.random() < 0.12) {
      openChallenge(true);
    }

    if (interactionInProgress) {
      saveState();
      return;
    }
    render({ preserveScroll: true });
  }

  window.addEventListener("DOMContentLoaded", () => {
    bindGlobalEvents();
    render();
    setInterval(tick, TICK_INTERVAL_MS);
  });
})();
