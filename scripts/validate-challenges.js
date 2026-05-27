const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const i18nPath = path.join(root, "js2d", "i18n.js");
const challengePath = path.join(root, "js2d", "challenges.js");
const i18nCode = fs.readFileSync(i18nPath, "utf8");
const code = fs.readFileSync(challengePath, "utf8");
const context = { window: {} };

vm.createContext(context);
vm.runInContext(i18nCode, context, { filename: i18nPath });
vm.runInContext(code, context, { filename: challengePath });

const bank = context.window.TechnoChallengeBank;
const i18n = context.window.TechnoI18n;
const errors = [];
const warnings = [];

const validLevels = ["5e", "4e", "3e"];
const validResourceKeys = new Set(["learners", "material", "teachers", "resources", "mastery", "motivation", "disorder", "badges"]);
const englishLeftoverPattern = /\b(un|une|des|le|la|les|donnee|donnees|energie|eleve|choisir|verifier|avec|dans|pour|lors|chaine|systeme|defi|reponse|vrai|faux|classement|seance|fonction|besoin|roue|frein|programme|mesurer|traiter|communiquer|alimenter|convertir|transmettre|engrenage|frottement|vitesse|affichee|ecran|utilisateur|criteres|afficher|definir|pertes|retour|lire|envoyer|ecrire|algorithme|contraintes|argumenter|mecanisme|mais|adapte|traitement|quand|couleur|deux|fois|interne|selon|frottements|allume|eteindre|objet|inutile|besoins|repeter|jamais|declencheur|diffuser|depart|analyser|tenir|compte|reel|reelle|memoriser|recoit|mauvais|alignements|entrainement|revoir|freiner|freinage|autorisations|laisser|tout|chauffe|beaucoup|moteurs|comparaison|recue|perdue|fonctionnent|meme|multiplier|demarre|touche|augmenter|entree|fournit|marche|puis|executer|avance|tourne|vehicule|freine|sous|pluie|pneu|maniere|moyen|differents|trajet|critere|copier|sans|securite|publier|renommer|equilibrer|charger|nouvelle|courant|bouge|physiquement|consomme|stockee|transmise|panneau|ressort|vieux|calculer|peuvent|creer|classee|graphique|texte|postes)\b|l'|n'ont|s'allume|quelqu/i;

function fail(condition, message) {
  if (!condition) errors.push(message);
}

function warn(condition, message) {
  if (!condition) warnings.push(message);
}

function isText(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function checkText(value, label, id) {
  fail(isText(value), `${id}: ${label} manquant`);
  if (isText(value)) {
    fail(!/\b(undefined|null|NaN)\b/i.test(value), `${id}: ${label} contient une valeur invalide (${value})`);
  }
}

function checkEffect(effect, label, id) {
  fail(effect && typeof effect === "object" && !Array.isArray(effect), `${id}: ${label} doit etre un objet`);
  if (!effect || typeof effect !== "object" || Array.isArray(effect)) return;
  Object.entries(effect).forEach(([key, value]) => {
    fail(validResourceKeys.has(key), `${id}: ${label}.${key} n'est pas une ressource connue`);
    fail(Number.isFinite(value), `${id}: ${label}.${key} doit etre numerique`);
  });
}

function checkChoices(choices, label, id, expectedMinimum = 2) {
  fail(Array.isArray(choices), `${id}: ${label} doit etre une liste`);
  if (!Array.isArray(choices)) return;
  fail(choices.length >= expectedMinimum, `${id}: ${label} doit contenir au moins ${expectedMinimum} choix`);
  const correctCount = choices.filter((choice) => choice?.correct === true).length;
  fail(correctCount === 1, `${id}: ${label} doit contenir exactement une bonne reponse, trouve ${correctCount}`);
  const labels = new Set();
  choices.forEach((choice, index) => {
    checkText(choice?.label, `${label}[${index}].label`, id);
    checkText(choice?.feedback, `${label}[${index}].feedback`, id);
    if (isText(choice?.label)) {
      fail(!labels.has(choice.label), `${id}: ${label} contient un doublon de choix "${choice.label}"`);
      labels.add(choice.label);
    }
    fail(typeof choice?.correct === "boolean", `${id}: ${label}[${index}].correct doit etre booleen`);
  });
}

function checkChoiceFields(choices, label, id, expectedMinimum = 2) {
  fail(Array.isArray(choices), `${id}: ${label} doit etre une liste`);
  if (!Array.isArray(choices)) return;
  fail(choices.length >= expectedMinimum, `${id}: ${label} doit contenir au moins ${expectedMinimum} choix`);
  const labels = new Set();
  choices.forEach((choice, index) => {
    checkText(choice?.label, `${label}[${index}].label`, id);
    checkText(choice?.feedback, `${label}[${index}].feedback`, id);
    if (isText(choice?.label)) {
      fail(!labels.has(choice.label), `${id}: ${label} contient un doublon de choix "${choice.label}"`);
      labels.add(choice.label);
    }
    fail(typeof choice?.correct === "boolean", `${id}: ${label}[${index}].correct doit etre booleen`);
  });
}

function checkMultipleChoices(choices, label, id, expectedMinimum = 3) {
  checkChoiceFields(choices, label, id, expectedMinimum);
  if (!Array.isArray(choices)) return;
  const correctCount = choices.filter((choice) => choice?.correct === true).length;
  fail(correctCount >= 1, `${id}: ${label} doit contenir au moins une bonne reponse`);
  fail(correctCount < choices.length, `${id}: ${label} ne doit pas avoir que des bonnes reponses`);
}

function interactionOf(challenge) {
  return challenge?.interaction || challenge?.type;
}

function challengeTexts(challenge) {
  return [
    challenge?.title,
    challenge?.prompt,
    challenge?.coursePoint,
    challenge?.item,
    challenge?.sceneTitle,
    challenge?.target,
    challenge?.successFeedback,
    challenge?.failureFeedback,
    ...(challenge?.choices || []).flatMap((choice) => [choice?.label, choice?.feedback]),
    ...(challenge?.categories || []).flatMap((choice) => [choice?.label, choice?.feedback]),
    ...(challenge?.cards || []).flatMap((choice) => [choice?.label, choice?.feedback]),
    ...(challenge?.hotspots || []).flatMap((choice) => [choice?.label, choice?.feedback]),
    ...(challenge?.pairs || []).flatMap((pair) => [pair?.left, pair?.right]),
    ...(challenge?.items || []).flatMap((item) => [item?.label, item?.target]),
    ...(challenge?.folders || []).flatMap((folder) => [folder?.label, folder?.id]),
    ...(challenge?.rows || []).flatMap((row) => [row?.label, row?.clue, row?.answer]),
    ...(challenge?.cells || []).map((cell) => cell?.answer),
    ...(challenge?.letters || []),
    ...(challenge?.clues || []),
    ...(challenge?.wordBank || []),
    ...(challenge?.answers || []),
    ...(challenge?.parts || []),
    ...(challenge?.trace?.operations || []),
    challenge?.trace?.variable,
    ...(challenge?.steps || []),
    ...(challenge?.pool || []).map((step) => step?.label)
  ].filter(Boolean);
}

function checkEnglishLocalization(challenge, id) {
  fail(Boolean(i18n?.challenge), "TechnoI18n.challenge introuvable");
  if (!i18n?.challenge) return;
  const localized = i18n.challenge(challenge, "en");
  checkText(localized?.title, "title en", id);
  checkText(localized?.prompt, "prompt en", id);
  checkText(localized?.coursePoint, "coursePoint en", id);
  challengeTexts(localized).forEach((text) => {
    fail(!englishLeftoverPattern.test(text), `${id}: traduction anglaise suspecte (${text})`);
  });
}

fail(Boolean(bank), "TechnoChallengeBank introuvable");
fail(Array.isArray(bank?.all), "TechnoChallengeBank.all doit etre une liste");
fail(Array.isArray(bank?.themes), "TechnoChallengeBank.themes doit etre une liste");
fail(Array.isArray(bank?.typeIds), "TechnoChallengeBank.typeIds doit etre une liste");

if (bank?.all && bank?.themes && bank?.typeIds) {
  const ids = new Set();
  const typeIds = new Set(bank.typeIds);
  const themeIds = new Set(bank.themes.map((theme) => theme.id));

  bank.all.forEach((challenge) => {
    const id = challenge?.id || "(id manquant)";
    checkText(challenge?.id, "id", id);
    fail(!ids.has(challenge.id), `${id}: identifiant en doublon`);
    ids.add(challenge.id);

    fail(themeIds.has(challenge.theme), `${id}: theme inconnu ${challenge.theme}`);
    checkText(challenge.themeLabel, "themeLabel", id);
    checkText(challenge.icon, "icon", id);
    fail(validLevels.includes(challenge.level), `${id}: niveau inconnu ${challenge.level}`);
    checkText(challenge.levelLabel, "levelLabel", id);
    fail(typeIds.has(challenge.type), `${id}: type inconnu ${challenge.type}`);
    checkText(challenge.typeLabel, "typeLabel", id);
    checkText(challenge.title, "title", id);
    checkText(challenge.prompt, "prompt", id);
    checkText(challenge.coursePoint, "coursePoint", id);
    fail(!/^point de cours\s*:/i.test(challenge.coursePoint || ""), `${id}: coursePoint ne doit pas repeter le libelle "Point de cours :"`);
    checkEffect(challenge.reward, "reward", id);
    checkEffect(challenge.penalty, "penalty", id);

    const interaction = interactionOf(challenge);

    if (interaction === "classify") {
      checkText(challenge.item, "item", id);
      checkChoices(challenge.categories, "categories", id, 3);
      checkChoices(challenge.choices, "choices", id, 3);
    } else if (interaction === "sequence" || interaction === "chain") {
      fail(Array.isArray(challenge.steps), `${id}: steps doit etre une liste`);
      fail(Array.isArray(challenge.pool), `${id}: pool doit etre une liste`);
      if (Array.isArray(challenge.steps) && Array.isArray(challenge.pool)) {
        fail(challenge.steps.length >= 2, `${id}: sequence trop courte`);
        fail(challenge.pool.length === challenge.steps.length, `${id}: pool et steps doivent avoir la meme taille`);
        challenge.steps.forEach((step, index) => checkText(step, `steps[${index}]`, id));
        const sortedOrders = challenge.pool.map((step) => step?.order).sort((a, b) => a - b);
        const expectedOrders = challenge.steps.map((_, index) => index);
        fail(JSON.stringify(sortedOrders) === JSON.stringify(expectedOrders), `${id}: ordres de sequence invalides`);
        challenge.pool.forEach((step, index) => {
          checkText(step?.label, `pool[${index}].label`, id);
          fail(Number.isInteger(step?.order), `${id}: pool[${index}].order doit etre entier`);
        });
      }
      if (challenge.choices) checkChoices(challenge.choices, "choices", id, 3);
    } else if (interaction === "multiSelect") {
      checkMultipleChoices(challenge.choices, "choices", id, 3);
      checkText(challenge.successFeedback, "successFeedback", id);
      checkText(challenge.failureFeedback, "failureFeedback", id);
    } else if (interaction === "matching") {
      fail(Array.isArray(challenge.pairs), `${id}: pairs doit etre une liste`);
      if (Array.isArray(challenge.pairs)) {
        fail(challenge.pairs.length >= 2, `${id}: pairs doit contenir au moins 2 associations`);
        const leftLabels = new Set();
        const rightLabels = new Set();
        challenge.pairs.forEach((pair, index) => {
          checkText(pair?.left, `pairs[${index}].left`, id);
          checkText(pair?.right, `pairs[${index}].right`, id);
          if (isText(pair?.left)) {
            fail(!leftLabels.has(pair.left), `${id}: pairs contient un mot en doublon "${pair.left}"`);
            leftLabels.add(pair.left);
          }
          if (isText(pair?.right)) {
            fail(!rightLabels.has(pair.right), `${id}: pairs contient une definition en doublon "${pair.right}"`);
            rightLabels.add(pair.right);
          }
        });
      }
      checkText(challenge.successFeedback, "successFeedback", id);
      checkText(challenge.failureFeedback, "failureFeedback", id);
    } else if (interaction === "folderSort") {
      fail(Array.isArray(challenge.items), `${id}: items doit etre une liste`);
      fail(Array.isArray(challenge.folders), `${id}: folders doit etre une liste`);
      const folderIds = new Set();
      if (Array.isArray(challenge.folders)) {
        challenge.folders.forEach((folder) => {
          if (isText(folder?.id)) {
            fail(!folderIds.has(folder.id), `${id}: folders contient un id en doublon "${folder.id}"`);
            folderIds.add(folder.id);
          }
        });
      }
      if (Array.isArray(challenge.items)) {
        fail(challenge.items.length >= 2, `${id}: items doit contenir au moins 2 documents`);
        const itemLabels = new Set();
        challenge.items.forEach((item, index) => {
          checkText(item?.label, `items[${index}].label`, id);
          checkText(item?.target, `items[${index}].target`, id);
          if (isText(item?.label)) {
            fail(!itemLabels.has(item.label), `${id}: items contient un document en doublon "${item.label}"`);
            itemLabels.add(item.label);
          }
          if (isText(item?.target) && Array.isArray(challenge.folders)) {
            fail(folderIds.has(item.target), `${id}: items[${index}].target pointe vers un dossier inconnu "${item.target}"`);
          }
        });
      }
      if (Array.isArray(challenge.folders)) {
        fail(challenge.folders.length >= 2, `${id}: folders doit contenir au moins 2 dossiers`);
        const labels = new Set();
        challenge.folders.forEach((folder, index) => {
          checkText(folder?.id, `folders[${index}].id`, id);
          checkText(folder?.label, `folders[${index}].label`, id);
          if (isText(folder?.label)) {
            fail(!labels.has(folder.label), `${id}: folders contient un libelle en doublon "${folder.label}"`);
            labels.add(folder.label);
          }
        });
      }
      checkText(challenge.successFeedback, "successFeedback", id);
      checkText(challenge.failureFeedback, "failureFeedback", id);
    } else if (interaction === "wordGrid") {
      fail(challenge.gridSize && typeof challenge.gridSize === "object", `${id}: gridSize doit etre un objet`);
      fail(Array.isArray(challenge.cells), `${id}: cells doit etre une liste`);
      fail(Array.isArray(challenge.letters), `${id}: letters doit etre une liste`);
      fail(Array.isArray(challenge.wordBank), `${id}: wordBank doit etre une liste`);
      if (challenge.gridSize) {
        fail(Number.isInteger(challenge.gridSize.rows) && challenge.gridSize.rows > 0, `${id}: gridSize.rows doit etre positif`);
        fail(Number.isInteger(challenge.gridSize.cols) && challenge.gridSize.cols > 0, `${id}: gridSize.cols doit etre positif`);
      }
      if (Array.isArray(challenge.cells)) {
        fail(challenge.cells.length >= 4, `${id}: cells doit contenir au moins 4 cases`);
        const positions = new Set();
        challenge.cells.forEach((cell, index) => {
          fail(Number.isInteger(cell?.row), `${id}: cells[${index}].row doit etre entier`);
          fail(Number.isInteger(cell?.col), `${id}: cells[${index}].col doit etre entier`);
          checkText(cell?.answer, `cells[${index}].answer`, id);
          if (Number.isInteger(cell?.row) && Number.isInteger(cell?.col)) {
            const key = `${cell.row}:${cell.col}`;
            fail(!positions.has(key), `${id}: deux cases partagent la position ${key}`);
            positions.add(key);
          }
          if (isText(cell?.answer)) fail(/^[A-Z]$/.test(cell.answer), `${id}: cells[${index}].answer doit etre une lettre A-Z`);
        });
      }
      if (Array.isArray(challenge.letters)) {
        fail(challenge.letters.length >= 6, `${id}: letters doit contenir au moins 6 lettres`);
        challenge.letters.forEach((letter, index) => {
          checkText(letter, `letters[${index}]`, id);
          if (isText(letter)) fail(/^[A-Z]$/.test(letter), `${id}: letters[${index}] doit etre une lettre A-Z`);
        });
      }
      if (Array.isArray(challenge.wordBank)) {
        fail(challenge.wordBank.length >= 2, `${id}: wordBank doit contenir au moins 2 mots`);
        challenge.wordBank.forEach((word, index) => checkText(word, `wordBank[${index}]`, id));
      }
      checkText(challenge.successFeedback, "successFeedback", id);
      checkText(challenge.failureFeedback, "failureFeedback", id);
    } else if (interaction === "arrowWords") {
      fail(Array.isArray(challenge.rows), `${id}: rows doit etre une liste`);
      fail(Array.isArray(challenge.letters), `${id}: letters doit etre une liste`);
      fail(Array.isArray(challenge.wordBank), `${id}: wordBank doit etre une liste`);
      if (Array.isArray(challenge.rows)) {
        fail(challenge.rows.length >= 2, `${id}: rows doit contenir au moins 2 lignes`);
        challenge.rows.forEach((row, index) => {
          checkText(row?.clue, `rows[${index}].clue`, id);
          checkText(row?.label, `rows[${index}].label`, id);
          checkText(row?.answer, `rows[${index}].answer`, id);
          if (isText(row?.answer)) fail(/^[A-Z]{3,10}$/.test(row.answer), `${id}: rows[${index}].answer doit etre un mot A-Z de 3 a 10 lettres`);
        });
      }
      if (Array.isArray(challenge.letters)) {
        fail(challenge.letters.length >= 6, `${id}: letters doit contenir au moins 6 lettres`);
        challenge.letters.forEach((letter, index) => {
          checkText(letter, `letters[${index}]`, id);
          if (isText(letter)) fail(/^[A-Z]$/.test(letter), `${id}: letters[${index}] doit etre une lettre A-Z`);
        });
      }
      if (Array.isArray(challenge.wordBank)) {
        fail(challenge.wordBank.length >= 3, `${id}: wordBank doit contenir au moins 3 mots`);
        challenge.wordBank.forEach((word, index) => checkText(word, `wordBank[${index}]`, id));
      }
      checkText(challenge.successFeedback, "successFeedback", id);
      checkText(challenge.failureFeedback, "failureFeedback", id);
    } else if (interaction === "hotspot" || interaction === "mapHotspot") {
      checkChoices(challenge.hotspots, "hotspots", id, 3);
      checkText(challenge.sceneTitle, "sceneTitle", id);
    } else if (interaction === "cloze") {
      fail(Array.isArray(challenge.parts), `${id}: parts doit etre une liste`);
      fail(Array.isArray(challenge.answers), `${id}: answers doit etre une liste`);
      fail(Array.isArray(challenge.wordBank), `${id}: wordBank doit etre une liste`);
      if (Array.isArray(challenge.answers) && Array.isArray(challenge.parts)) {
        fail(challenge.parts.length === challenge.answers.length + 1, `${id}: parts doit contenir une entree de plus que answers`);
      }
      checkText(challenge.successFeedback, "successFeedback", id);
      checkText(challenge.failureFeedback, "failureFeedback", id);
    } else if (interaction === "compare") {
      checkChoices(challenge.cards, "cards", id, 3);
    } else if (interaction === "debugBlocks" || interaction === "variableTrace" || interaction === "choice") {
      checkChoices(challenge.choices, "choices", id, 3);
    } else {
      checkChoices(challenge.choices, "choices", id, challenge.type === "trueFalse" ? 2 : 3);
    }

    checkEnglishLocalization(challenge, id);
  });

  bank.themes.forEach((theme) => {
    validLevels.forEach((level) => {
      const scoped = bank.all.filter((challenge) => challenge.theme === theme.id && challenge.level === level);
      fail(scoped.length >= 100, `${theme.id}/${level}: au moins 100 defis attendus, trouve ${scoped.length}`);
      const uniquePrompts = new Set(scoped.map((challenge) => challenge.prompt));
      warn(uniquePrompts.size >= 100, `${theme.id}/${level}: seulement ${uniquePrompts.size} enonces uniques sur ${scoped.length} defis generes`);
    });
  });

  bank.typeIds.forEach((type) => {
    validLevels.forEach((level) => {
      const scoped = bank.all.filter((challenge) => challenge.type === type && challenge.level === level);
      fail(scoped.length > 0, `${type}/${level}: aucun defi disponible pour ce type et ce niveau`);
    });
  });
}

if (warnings.length) {
  console.warn(`Avertissements (${warnings.length})`);
  warnings.forEach((message) => console.warn(`- ${message}`));
}

if (errors.length) {
  console.error(`Erreurs (${errors.length})`);
  errors.forEach((message) => console.error(`- ${message}`));
  process.exitCode = 1;
} else {
  console.log(`Validation OK: ${bank.all.length} defis, ${bank.themes.length} themes, ${bank.typeIds.length} types.`);
}
