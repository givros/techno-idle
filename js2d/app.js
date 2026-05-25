(function () {
  const STORAGE_KEY = "techno-cycle-4-manager.v1";

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
      effect: "+pieces, +savoir-faire",
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
      effect: "+fiches, +savoir-faire",
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
      description: "Prepare les kits, verifie les pieces et limite les pertes de temps.",
      baseCost: { resources: 140, material: 120 },
      production: { material: 1.1, motivation: 0.04, disorder: -0.04 },
      onHire: { teachers: 1 },
      unlockMastery: 50
    }
  ];

  const ACTIONS = [
    { id: "observe", name: "Enquete d'usage", icon: "learners", text: "1 eleve requis, +5 fiches", requires: { learners: 1 }, effect: { resources: 5, motivation: 0.5 } },
    { id: "inventory", name: "Audit des kits", icon: "material", text: "1 eleve requis, +9 pieces", requires: { learners: 1 }, effect: { material: 9, motivation: -0.5 } },
    { id: "prepare", name: "Fiche atelier", icon: "resources", text: "1 eleve requis, +8 fiches", requires: { learners: 1 }, effect: { resources: 8, motivation: -0.5 } },
    { id: "challenge", name: "Situation-probleme", icon: "cart", text: "4 eleves requis, ouvre un defi", requires: { learners: 4 }, challenge: true }
  ];

  const SIDE_TABS = [
    { id: "teams", label: "Equipes", icon: "learners" },
    { id: "stations", label: "Stations", icon: "tools" },
    { id: "protocols", label: "Protocoles", icon: "mastery" },
    { id: "actions", label: "Actions", icon: "cart" }
  ];

  const KNOWLEDGE = [
    { id: "project", name: "Demarche de projet", icon: "desk", cost: 1, description: "+20 % savoir-faire. Les essais deviennent comparables.", multiplier: { mastery: 1.2 } },
    { id: "maintenance", name: "Reparabilite", icon: "tools", cost: 1, description: "-30 % agitation. Les pannes deviennent des enquetes.", multiplier: { disorder: 0.7 } },
    { id: "network", name: "Donnees et reseaux", icon: "router", cost: 2, description: "+25 % fiches produites par les ilots numeriques.", multiplier: { resources: 1.25 } },
    { id: "energy", name: "Chaine d'energie", icon: "solar", cost: 2, description: "+25 % pieces exploitables grace aux bons choix techniques.", multiplier: { material: 1.25 } },
    { id: "eco", name: "Impact environnemental", icon: "eco", cost: 3, description: "+15 motivation, +10 savoir-faire.", instant: { motivation: 15, mastery: 10 } }
  ];

  const MISSIONS = [
    { id: "firstRecruit", text: "Former la premiere equipe", check: (s) => s.recruits.learners.count >= 1 },
    { id: "firstLearners", text: "Installer 4 eleves en atelier", check: (s) => s.resources.learners >= 4 },
    { id: "sensorBench", text: "Activer la station capteurs", check: (s) => s.spaces.sensorBench.owned },
    { id: "firstIncident", text: "Valider une situation-probleme", check: (s) => s.stats.challengesSolved >= 1 },
    { id: "knowledge", text: "Valider 2 protocoles", check: (s) => Object.values(s.knowledge).filter(Boolean).length >= 2 }
  ];

  const CLASSROOM_SEAT_COUNT = 24;
  const MAX_CLASSROOMS = 6;
  const EQUIPMENT_CYCLE = ["computer", "tablet", "tools", "sensor", "energy", "computer"];

  function defaultState(playerName = "Eleve techno", level = "5e") {
    const cleanName = String(playerName || "").trim() || "Eleve techno";
    const cleanLevel = ["5e", "4e", "3e"].includes(level) ? level : "5e";
    return {
      playerName: cleanName,
      level: cleanLevel,
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
      stats: { challengesSolved: 0, challengeAttempts: 0, totalMastery: 0, recentChallenges: [] },
      lastChallengeAt: Date.now(),
      log: [`Bienvenue ${cleanName} : le labo techno ${cleanLevel} demarre a zero.`],
      createdAt: Date.now(),
      lastTickAt: Date.now()
    };
  }

  let state = loadState();
  let rates = state ? computeRates() : emptyRates();
  let toastTimer = null;
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
        knowledge: { ...base.knowledge, ...saved.knowledge },
        stats: { ...base.stats, ...saved.stats },
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
    if (!state) return emptyRates();
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
    const labels = {
      learners: ["eleve", "eleves"],
      material: ["piece", "pieces"],
      teachers: ["mentor", "mentors"],
      resources: ["fiche", "fiches"],
      mastery: ["savoir-faire", "savoir-faire"]
    };
    const parts = Object.entries(cost).filter(([, value]) => value > 0).map(([key, value]) => {
      const label = labels[key] ? labels[key][value > 1 ? 1 : 0] : key;
      return `${format(value)} ${label}`;
    });
    return parts.length ? parts.join(" + ") : "gratuit";
  }

  function requirementText(requirements = {}) {
    return `${costText(requirements)} requis`;
  }

  function effectText(effect = {}) {
    const labels = {
      learners: "eleves",
      material: "pieces",
      teachers: "mentors",
      resources: "fiches",
      mastery: "savoir-faire",
      motivation: "motivation",
      disorder: "agitation",
      badges: "badges"
    };
    const parts = Object.entries(effect).filter(([, value]) => value !== 0).map(([key, value]) => {
      const sign = value > 0 ? "+" : "-";
      const display = Math.abs(value) < 1 ? Math.abs(value).toFixed(1) : format(Math.abs(value));
      return `${sign}${display} ${labels[key] || key}`;
    });
    return parts.length ? parts.join(" - ") : "aucun changement";
  }

  function productionText(production) {
    const labels = { learners: "eleves", material: "pieces", teachers: "mentors", resources: "fiches", mastery: "savoir-faire", motivation: "motivation", disorder: "agitation" };
    return Object.entries(production).map(([key, value]) => `${value > 0 ? "+" : ""}${value}/s ${labels[key]}`).join(" - ");
  }

  function log(message) {
    if (!state) return;
    const time = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
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
    const space = SPACES.find((item) => item.id === id);
    if (!space) return;
    if (space.id === "classroom") {
      openClassroom();
      return;
    }
    const current = state.spaces[id];
    if (state.resources.mastery < space.unlockMastery) {
      showToast("Le labo doit gagner en savoir-faire pour activer ce module.");
      return;
    }
    if (current.owned && current.level >= space.maxLevel) {
      showToast("Ce module est deja au niveau maximum.");
      return;
    }
    const cost = spaceCost(space);
    if (!pay(cost)) {
      showToast("Ressources insuffisantes.");
      return;
    }
    current.owned = true;
    current.level += 1;
    log(current.level === 1 ? `${space.name} installe.` : `${space.name} passe niveau ${current.level}.`);
    render({ preserveScroll: true });
  }

  function openClassroom() {
    const current = state.spaces.classroom;
    if (classroomCount() >= MAX_CLASSROOMS) {
      showToast("Toutes les salles disponibles sont deja ouvertes.");
      return;
    }
    if (!allOpenRoomsFull()) {
      showToast("Remplis d'abord les places ouvertes avant d'ajouter une salle.");
      return;
    }
    const cost = classroomCost();
    if (!pay(cost)) {
      showToast("Ressources insuffisantes pour ouvrir une nouvelle salle.");
      return;
    }
    state.classrooms.unlocked = classroomCount() + 1;
    state.classrooms.active = state.classrooms.unlocked - 1;
    current.owned = true;
    current.level = state.classrooms.unlocked - 1;
    log(`Salle ${state.classrooms.unlocked} ouverte : 24 nouvelles places disponibles.`);
    render({ preserveScroll: true });
  }

  function hireRecruit(id) {
    const recruit = RECRUITS.find((item) => item.id === id);
    if (!recruit) return;
    if (state.resources.mastery < recruit.unlockMastery) {
      showToast("Cette equipe demande plus de savoir-faire.");
      return;
    }
    if (!canMeet(recruit.requires)) {
      showToast("Condition non remplie pour ce recrutement.");
      return;
    }
    const incomingLearners = Math.max(0, Math.floor(recruit.onHire?.learners || 0));
    if (incomingLearners > 0 && !hasSeatCapacity(incomingLearners)) {
      activeSideTab = "stations";
      showToast("La salle est pleine : ouvre une salle supplementaire.");
      render({ preserveScroll: true });
      return;
    }
    const cost = recruitCost(recruit);
    if (!pay(cost)) {
      showToast("Ressources insuffisantes.");
      return;
    }
    state.recruits[id].count += 1;
    apply(recruit.onHire);
    addStudentSpritesTo(state, recruit.onHire?.learners || 0);
    log(`${recruit.name} rejoint la classe.`);
    render({ preserveScroll: true });
  }

  function useAction(id) {
    const action = ACTIONS.find((item) => item.id === id);
    if (!action) return;
    if (!canMeet(action.requires)) {
      showToast("Il faut plus d'eleves pour lancer ce defi.");
      return;
    }
    if (action.challenge) {
      openChallenge(true);
      return;
    }
    if (!pay(action.cost)) {
      showToast("Action impossible : stock insuffisant.");
      return;
    }
    apply(action.effect);
    log(`Action lancee : ${action.name}.`);
    render({ preserveScroll: true });
  }

  function buyKnowledge(id) {
    const item = KNOWLEDGE.find((entry) => entry.id === id);
    if (!item) return;
    if (state.knowledge[id]) {
      showToast("Cette connaissance est deja debloquee.");
      return;
    }
    if (state.badges < item.cost) {
      showToast("Pas assez de jetons savoir.");
      return;
    }
    state.badges -= item.cost;
    state.knowledge[id] = true;
    if (item.instant) apply(item.instant);
    log(`Connaissance debloquee : ${item.name}.`);
    render({ preserveScroll: true });
  }

  function challengeBank() {
    return window.TechnoChallengeBank?.getChallenges({ level: state.level }) || [];
  }

  function challengeStatsText() {
    const stats = window.TechnoChallengeBank?.stats?.() || [];
    if (!stats.length) return "banque locale";
    return `${stats.length} themes - ${stats[0].byLevel[state.level]} defis/theme`;
  }

  function pickChallenge() {
    const bank = challengeBank();
    if (!bank.length) return null;
    const typeIds = window.TechnoChallengeBank?.typeIds || [];
    const expectedType = typeIds.length ? typeIds[state.stats.challengeAttempts % typeIds.length] : null;
    const recent = new Set(state.stats.recentChallenges || []);
    const typed = expectedType ? bank.filter((challenge) => challenge.type === expectedType) : bank;
    const available = typed.filter((challenge) => !recent.has(challenge.id));
    const source = available.length ? available : bank;
    const seed = Math.floor(state.stats.challengeAttempts * 17 + state.resources.mastery + Date.now() / 1000);
    return source[Math.abs(seed) % source.length];
  }

  function resolveChallenge(modal, challenge, choice) {
    if (modal.dataset.answered === "true") return;
    modal.dataset.answered = "true";
    state.stats.challengeAttempts += 1;
    state.stats.recentChallenges = [challenge.id, ...(state.stats.recentChallenges || [])].slice(0, 24);
    if (choice.correct) {
      apply(challenge.reward);
      state.stats.challengesSolved += 1;
    } else {
      apply(challenge.penalty);
    }
    log(`${choice.correct ? "Defi reussi" : "Defi manque"} : ${challenge.themeLabel} (${challenge.typeLabel}).`);
    saveState();

    const card = modal.querySelector(".challenge-modal");
    card.classList.add(choice.correct ? "is-correct" : "is-wrong");
    card.querySelectorAll("[data-choice], [data-seq-step], [data-seq-validate], [data-seq-reset]").forEach((button) => {
      button.disabled = true;
    });
    card.insertAdjacentHTML("beforeend", `
      <section class="challenge-result ${choice.correct ? "correct" : "wrong"}">
        <h3>${choice.correct ? "Bonne reponse" : "A revoir"}</h3>
        <p><strong>Retour :</strong> ${escapeHtml(choice.feedback)}</p>
        <p><strong>Point de cours :</strong> ${escapeHtml(challenge.coursePoint || "Relis la fonction de chaque element du systeme avant de repondre.")}</p>
        <p><strong>${choice.correct ? "Gain" : "Consequence"} :</strong> ${escapeHtml(effectText(choice.correct ? challenge.reward : challenge.penalty))}</p>
        <button class="paper-button buy" type="button" data-continue-defi>Continuer</button>
      </section>
    `);
    card.querySelector("[data-continue-defi]").addEventListener("click", () => {
      modal.remove();
      render({ preserveScroll: true });
    });
    showToast(choice.correct ? "Bonne reponse." : "Reponse a revoir.");
  }

  function renderChallengeInteraction(challenge) {
    if (challenge.type === "sequence") {
      return `
        <div class="sequence-builder">
          <div class="sequence-slots" data-seq-output>Selectionne les etapes dans l'ordre.</div>
          <div class="sequence-pool">
            ${challenge.pool.map((step, index) => `<button type="button" data-seq-step="${index}" data-order="${step.order}">${escapeHtml(step.label)}</button>`).join("")}
          </div>
          <div class="sequence-actions">
            <button class="paper-button buy" type="button" data-seq-validate>Valider l'ordre</button>
            <button class="paper-button" type="button" data-seq-reset>Recommencer</button>
          </div>
        </div>
      `;
    }

    if (challenge.type === "classify") {
      return `
        <div class="classify-box">
          <div class="classify-item">${escapeHtml(challenge.item)}</div>
          <div class="choice-list classify">
            ${challenge.categories.map((choice, index) => `<button type="button" data-choice="${index}">${escapeHtml(choice.label)}</button>`).join("")}
          </div>
        </div>
      `;
    }

    return `
      <div class="choice-list ${challenge.type}">
        ${challenge.choices.map((choice, index) => `<button type="button" data-choice="${index}">${escapeHtml(choice.label)}</button>`).join("")}
      </div>
    `;
  }

  function bindChallengeEvents(modal, challenge) {
    modal.querySelector(".modal-close").addEventListener("click", () => {
      modal.remove();
      if (modal.dataset.answered === "true") render({ preserveScroll: true });
    });
    modal.querySelectorAll("[data-choice]").forEach((button) => {
      button.addEventListener("click", () => {
        const list = challenge.type === "classify" ? challenge.categories : challenge.choices;
        resolveChallenge(modal, challenge, list[Number(button.dataset.choice)]);
      });
    });

    if (challenge.type !== "sequence") return;

    const selected = [];
    const output = modal.querySelector("[data-seq-output]");
    const updateOutput = () => {
      output.textContent = selected.length ? selected.map((step) => step.label).join(" -> ") : "Selectionne les etapes dans l'ordre.";
    };

    modal.querySelectorAll("[data-seq-step]").forEach((button) => {
      button.addEventListener("click", () => {
        if (button.classList.contains("picked")) return;
        button.classList.add("picked");
        selected.push({ label: button.textContent, order: Number(button.dataset.order) });
        updateOutput();
      });
    });

    modal.querySelector("[data-seq-reset]").addEventListener("click", () => {
      selected.length = 0;
      modal.querySelectorAll("[data-seq-step]").forEach((button) => button.classList.remove("picked"));
      updateOutput();
    });

    modal.querySelector("[data-seq-validate]").addEventListener("click", () => {
      if (selected.length !== challenge.steps.length) {
        showToast("Selectionne toutes les etapes avant de valider.");
        return;
      }
      const correct = selected.every((step, index) => step.order === index);
      resolveChallenge(modal, challenge, {
        correct,
        feedback: correct ? "L'ordre respecte la logique du systeme." : "L'ordre contient au moins une inversion."
      });
    });
  }

  function openChallenge(forced) {
    if (!state) return;
    if (document.querySelector(".modal-backdrop")) return;
    if (!forced && Date.now() - state.lastChallengeAt < 18000) {
      showToast("Aucun defi urgent pour le moment.");
      return;
    }
    state.lastChallengeAt = Date.now();
    const challenge = pickChallenge();
    if (!challenge) {
      showToast("Banque de defis indisponible.");
      return;
    }
    const modal = document.createElement("div");
    modal.className = "modal-backdrop";
    modal.innerHTML = `
      <section class="modal-card challenge-modal" role="dialog" aria-modal="true" aria-label="Defi techno">
        <button class="modal-close" type="button" aria-label="Fermer">X</button>
        <div class="modal-head">
          <img src="${ASSETS[challenge.icon] || ASSETS.incident}" alt="" />
          <div>
            <p class="side-counter" style="margin:0 0 8px">${escapeHtml(challenge.themeLabel)} - ${escapeHtml(challenge.levelLabel)} - ${escapeHtml(challenge.typeLabel)}</p>
            <h2>${escapeHtml(challenge.title)}</h2>
          </div>
        </div>
        <p class="question">${escapeHtml(challenge.prompt)}</p>
        ${renderChallengeInteraction(challenge)}
        <p class="challenge-bank-note">${escapeHtml(challengeStatsText())}</p>
      </section>
    `;
    document.body.appendChild(modal);
    bindChallengeEvents(modal, challenge);
  }

  function activeMissions() {
    if (!state) return [];
    return MISSIONS.map((mission) => ({ ...mission, done: mission.check(state) }));
  }

  function createPlayer() {
    const input = document.querySelector("[data-player-name]");
    const levelInput = document.querySelector("input[name='level']:checked");
    const name = input?.value.trim() || "Eleve techno";
    const level = levelInput?.value || "5e";
    activeSideTab = "teams";
    state = defaultState(name, level);
    rates = computeRates();
    saveState();
    render();
  }

  function resetGame() {
    if (state && !window.confirm("Recommencer une nouvelle partie a zero ?")) return;
    activeSideTab = "teams";
    localStorage.removeItem(STORAGE_KEY);
    state = null;
    rates = emptyRates();
    render();
  }

  function setLevelTheme(level) {
    const cleanLevel = ["5e", "4e", "3e"].includes(level) ? level : "5e";
    document.body.dataset.level = cleanLevel;
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
    if (!state?.playerName) {
      rates = emptyRates();
      setLevelTheme("5e");
      app.innerHTML = renderWelcome();
      bindWelcomeEvents();
      return;
    }

    const scrollPositions = options.preserveScroll ? capturePanelScroll() : null;
    setLevelTheme(state.level);
    rates = computeRates();
    app.innerHTML = `
      <main class="classroom-main" aria-label="Salle de classe">
        ${renderClassroomScene()}
      </main>
      <aside class="side-panel" aria-label="Pilotage du labo">
        ${renderSidePanel()}
      </aside>
      <section class="wide-notes" aria-label="Notes du labo">
        ${renderTodo()}
        ${renderJournal()}
        <button class="reset-corner" type="button" data-new-game title="Recommencer la partie a zero">Recommencer a zero</button>
      </section>
      <div class="toast" role="status" aria-live="polite"></div>
    `;
    bindEvents();
    restorePanelScroll(scrollPositions);
    saveState();
  }

  function renderWelcome() {
    return `
      <main class="welcome-screen" aria-label="Creation de joueur">
        <section class="welcome-card">
          <div class="welcome-copy">
            <div class="welcome-kicker"><img src="${ASSETS.cart}" alt="" /> Carnet d'atelier</div>
            <h1>Labo Techno Cycle 4</h1>
            <label class="welcome-form">
              <span>Nom du joueur</span>
              <input data-player-name type="text" maxlength="32" autocomplete="off" placeholder="Ex. Lina, Sami, Groupe 4" />
            </label>
            <fieldset class="level-select" aria-label="Niveau">
              <legend>Niveau</legend>
              <label><input type="radio" name="level" value="5e" checked /><span>5e</span></label>
              <label><input type="radio" name="level" value="4e" /><span>4e</span></label>
              <label><input type="radio" name="level" value="3e" /><span>3e</span></label>
            </fieldset>
            <button class="welcome-start" type="button" data-create-player>Commencer</button>
          </div>
          <div class="welcome-visual" aria-hidden="true">
            <img class="welcome-hero-image" src="${ASSETS.classroomHero}" alt="" />
            <div class="welcome-token learners"><img src="${ASSETS.learners}" alt="" /><span>0 eleve</span></div>
            <div class="welcome-token material"><img src="${ASSETS.material}" alt="" /><span>0 piece</span></div>
            <div class="welcome-token teachers"><img src="${ASSETS.teachers}" alt="" /><span>0 mentor</span></div>
            <div class="welcome-token mastery"><img src="${ASSETS.mastery}" alt="" /><span>0 savoir</span></div>
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

  function renderStatusPanel() {
    return `
      <section class="control-card player-card">
        <div class="hud-row">
          <div class="game-title"><img src="${ASSETS.cart}" alt="" /> Labo Techno <span>${escapeHtml(state.playerName)} - ${escapeHtml(state.level)}</span></div>
          <button class="hud-button quiet" type="button" data-new-game>Nouvelle partie</button>
        </div>
      </section>
      <section class="control-card resources-card">
        <h2>Tableau de bord</h2>
        <div class="resource-stack">
          ${resourcePill("Eleves", state.resources.learners, rates.learners, "learners")}
          ${resourcePill("Pieces", state.resources.material, rates.material, "material")}
          ${resourcePill("Mentors", state.resources.teachers, rates.teachers, "teachers")}
          ${resourcePill("Fiches", state.resources.resources, rates.resources, "resources")}
          ${resourcePill("Savoir-faire", state.resources.mastery, rates.mastery, "mastery")}
        </div>
      </section>
      <section class="control-card gauges-card">
        <div class="bars-row">
          ${bar("Motivation", state.resources.motivation, "motivation")}
          ${bar("Agitation", state.resources.disorder, "disorder")}
          ${knowledgeBar()}
        </div>
      </section>
      <section class="control-card actions-zone" aria-label="Actions rapides">
        <h2>Gestes d'atelier</h2>
        ${ACTIONS.map(renderAction).join("")}
      </section>
      ${renderTodo()}
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
            <span>Labo en cours</span>
            <strong>${format(state.resources.learners)} eleve${state.resources.learners > 1 ? "s" : ""}</strong>
          </div>
          ${renderClassroomTabs(activeRoom)}
        </div>
        <div class="classroom-room">
          <div class="classroom-wall">
            <div class="whiteboard">
              <span>SALLE ${activeRoom + 1} - PLAN DE SEANCE</span>
              <small>${roomFill}/${CLASSROOM_SEAT_COUNT} places - ${escapeHtml(state.level)} - ${escapeHtml(challengeStatsText())}</small>
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
      <nav class="room-tabs" aria-label="Salles ouvertes">
        ${Array.from({ length: rooms }, (_, index) => {
          const start = index * CLASSROOM_SEAT_COUNT;
          const count = sanitizeStudents(state.students).slice(start, start + CLASSROOM_SEAT_COUNT).length;
          return `
            <button class="room-tab ${index === activeRoom ? "active" : ""}" type="button" data-classroom-tab="${index}" aria-pressed="${index === activeRoom}">
              <span>Salle ${index + 1}</span>
              <small>${count}/${CLASSROOM_SEAT_COUNT}</small>
            </button>
          `;
        }).join("")}
        ${canOpenNext ? `<button class="room-tab add-room ${canPay(classroomCost()) ? "" : "blocked"}" type="button" data-open-room aria-disabled="${!canPay(classroomCost())}">+ salle</button>` : ""}
      </nav>
    `;
  }

  function renderTeacherDesk() {
    const teacherCount = Math.floor(state.resources.teachers || 0);
    return `
      <div class="teacher-desk ${teacherCount > 0 ? "active" : ""}">
        <img src="${ASSETS.teachers}" alt="" />
        <div>
          <span>${teacherCount > 0 ? `${teacherCount} mentor${teacherCount > 1 ? "s" : ""}` : "Poste mentor"}</span>
          <small>${teacherCount > 0 ? "Seance pilotee" : "En attente"}</small>
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
        ${active ? `<span>Niv. ${current.level}</span>` : ""}
      </div>
    `;
  }

  function resourcePill(label, value, rate, iconName) {
    return `<div class="resource-pill"><img src="${ASSETS[iconName]}" alt="" /><span>${label}</span><strong>${format(value)}</strong><small>+${rate.toFixed(1)}/s</small></div>`;
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
          <span>Connaissances</span>
          <span>${unlocked}/${total}</span>
        </div>
        <div class="bar-track"><div class="bar-fill knowledge" style="width:${percent}%"></div></div>
      </div>
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
          <span>${escapeHtml(space.name)}</span>
          <span class="level-badge">${current.owned ? `Niv. ${current.level}` : "A creer"}</span>
        </div>
        <div class="card-body">
          ${escapeHtml(space.description)}
          <div class="card-effects">${escapeHtml(productionText(space.production))}</div>
        </div>
        <div class="button-row">
          <button class="paper-button buy ${locked || maxed || !canPay(cost) ? "blocked" : ""}" type="button" data-space="${space.id}" aria-disabled="${locked || maxed || !canPay(cost)}">${maxed ? "Stabilise" : costText(cost)}</button>
          <button class="paper-button" type="button" disabled>${locked ? `${space.unlockMastery} savoir-faire` : space.effect}</button>
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
          <span>${escapeHtml(recruit.name)}</span>
          <span class="level-badge">x${current.count}</span>
        </div>
        <div class="card-body">
          ${escapeHtml(recruit.description)}
          <div class="card-effects">${escapeHtml(productionText(recruit.production))}</div>
        </div>
        <div class="button-row">
          <button class="paper-button buy ${missingRequirement || !canPay(cost) ? "blocked" : ""}" type="button" data-recruit="${recruit.id}" aria-disabled="${missingRequirement || !canPay(cost)}">${missingRequirement ? requirementText(recruit.requires) : costText(cost)}</button>
          <button class="paper-button" type="button" disabled>${recruit.unlockMastery ? `${recruit.unlockMastery} savoir-faire` : "Disponible"}</button>
        </div>
      </article>
    `;
  }

  function renderAction(action) {
    const blocked = !canMeet(action.requires) || (action.cost && !canPay(action.cost));
    return `
      <button class="action-card ${blocked ? "blocked" : ""}" type="button" data-action="${action.id}" aria-disabled="${blocked}">
        <img src="${ASSETS[action.icon]}" alt="" />
        <span><strong>${escapeHtml(action.name)}</strong><span>${escapeHtml(!canMeet(action.requires) ? requirementText(action.requires) : action.text)}</span></span>
      </button>
    `;
  }

  function renderTodo() {
    return `
      <section class="bottom-card">
        <h2>To-do</h2>
        <ul class="todo-list">
          ${activeMissions().map((mission) => `<li class="${mission.done ? "done" : ""}">${mission.done ? "OK" : "A faire"} - ${escapeHtml(mission.text)}</li>`).join("")}
        </ul>
      </section>
    `;
  }

  function renderJournal() {
    return `
      <section class="bottom-card">
        <h2>Journal</h2>
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
          <span>Suivi instantane</span>
          <small><img src="${ASSETS.mastery}" alt="" /> ${state.badges} jeton${state.badges > 1 ? "s" : ""} savoir</small>
        </header>
        <div class="resource-stack">
          ${resourcePill("Eleves", state.resources.learners, rates.learners, "learners")}
          ${resourcePill("Pieces", state.resources.material, rates.material, "material")}
          ${resourcePill("Mentors", state.resources.teachers, rates.teachers, "teachers")}
          ${resourcePill("Fiches", state.resources.resources, rates.resources, "resources")}
          ${resourcePill("Savoir-faire", state.resources.mastery, rates.mastery, "mastery")}
        </div>
        <div class="bars-row">
          ${bar("Motivation", state.resources.motivation, "motivation")}
          ${bar("Agitation", state.resources.disorder, "disorder")}
          ${knowledgeBar()}
        </div>
      </section>
      ${renderSideTabs(activeTab)}
      ${renderSideTabPanel(activeTab)}
    `;
  }

  function renderSideTabs(activeTab) {
    return `
      <nav class="pilot-tabs" role="tablist" aria-label="Pilotage du labo">
        ${SIDE_TABS.map((tab) => `
          <button class="pilot-tab ${activeTab === tab.id ? "active" : ""}" type="button" role="tab" data-side-tab="${tab.id}" aria-selected="${activeTab === tab.id}">
            <img src="${ASSETS[tab.icon]}" alt="" />
            <span>${escapeHtml(tab.label)}</span>
          </button>
        `).join("")}
      </nav>
    `;
  }

  function renderSideTabPanel(activeTab) {
    if (activeTab === "stations") {
      return renderModuleTab("Stations", "tools", SPACES.map(renderSideSpace).join(""), "stations-tab");
    }
    if (activeTab === "protocols") {
      return renderModuleTab("Protocoles", "mastery", KNOWLEDGE.map(renderKnowledge).join(""), "protocols-tab");
    }
    if (activeTab === "actions") {
      return `
        <section class="pilot-section tab-section actions-tab" role="tabpanel">
          <header><span>Gestes d'atelier</span></header>
          <div class="action-grid">
            ${ACTIONS.map(renderAction).join("")}
          </div>
        </section>
      `;
    }
    return renderModuleTab("Equipes", "learners", RECRUITS.map(renderSideRecruit).join(""), "teams-tab");
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
      ? `${recruit.unlockMastery} savoir-faire`
      : missingRequirement ? requirementText(recruit.requires)
      : noSeats ? "Ouvrir une salle"
      : `Mobiliser - ${costText(cost)}`;
    return `
      <article class="module-node team ${locked ? "locked" : ""}">
        <span class="node-pin"></span>
        <div class="node-icon"><img src="${ASSETS[recruit.icon]}" alt="" /></div>
        <div class="node-copy">
          <h3><span>${escapeHtml(recruit.name)}</span><em>x${current.count}</em></h3>
          <p>${escapeHtml(recruit.description)}</p>
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
      ? `${classroomCount()}/${MAX_CLASSROOMS} salles`
      : current.owned ? `niv. ${current.level}` : "hors ligne";
    const buttonLabel = isClassroom
      ? maxed ? "Toutes ouvertes" : waitingForFullRoom ? `${learnerTotal()}/${totalSeatCapacity()} places occupees` : `Ouvrir - ${costText(cost)}`
      : maxed ? "Stabilise" : locked ? `${space.unlockMastery} savoir-faire` : `Activer - ${costText(cost)}`;
    return `
      <article class="module-node station ${current.owned ? "online" : ""} ${locked ? "locked" : ""}">
        <span class="node-pin"></span>
        <div class="node-icon"><img src="${ASSETS[space.icon]}" alt="" /></div>
        <div class="node-copy">
          <h3><span>${escapeHtml(space.name)}</span><em>${escapeHtml(stateLabel)}</em></h3>
          <p>${escapeHtml(space.description)}</p>
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
          <h3><span>${escapeHtml(item.name)}</span><em>${owned ? "valide" : `${item.cost} jeton${item.cost > 1 ? "s" : ""}`}</em></h3>
          <p>${escapeHtml(item.description)}</p>
          <button class="paper-button buy ${owned || state.badges < item.cost ? "blocked" : ""}" type="button" data-knowledge="${item.id}" aria-disabled="${owned || state.badges < item.cost}">${owned ? "Integre" : `Valider le protocole`}</button>
        </div>
      </article>
    `;
  }

  function bindWelcomeEvents() {
    const input = document.querySelector("[data-player-name]");
    document.querySelector("[data-create-player]")?.addEventListener("click", createPlayer);
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

  function bindEvents() {
    document.querySelectorAll("[data-space]").forEach((button) => button.addEventListener("click", () => buySpace(button.dataset.space)));
    document.querySelectorAll("[data-recruit]").forEach((button) => button.addEventListener("click", () => hireRecruit(button.dataset.recruit)));
    document.querySelectorAll("[data-action]").forEach((button) => button.addEventListener("click", () => useAction(button.dataset.action)));
    document.querySelectorAll("[data-knowledge]").forEach((button) => button.addEventListener("click", () => buyKnowledge(button.dataset.knowledge)));
    document.querySelectorAll("[data-side-tab]").forEach((button) => button.addEventListener("click", () => setSideTab(button.dataset.sideTab)));
    document.querySelectorAll("[data-classroom-tab]").forEach((button) => button.addEventListener("click", () => setClassroomTab(button.dataset.classroomTab)));
    document.querySelectorAll("[data-open-room]").forEach((button) => button.addEventListener("click", openClassroom));
  }

  function tick() {
    if (!state?.playerName) return;
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
      state.resources.disorder = 70;
      openChallenge(true);
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
    setInterval(tick, 1000);
  });
})();
