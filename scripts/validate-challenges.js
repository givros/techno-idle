const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const challengePath = path.join(root, "js2d", "challenges.js");
const code = fs.readFileSync(challengePath, "utf8");
const context = { window: {} };

vm.createContext(context);
vm.runInContext(code, context, { filename: challengePath });

const bank = context.window.TechnoChallengeBank;
const errors = [];
const warnings = [];

const validLevels = ["5e", "4e", "3e"];
const validResourceKeys = new Set(["learners", "material", "teachers", "resources", "mastery", "motivation", "disorder", "badges"]);

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

    if (challenge.type === "classify") {
      checkText(challenge.item, "item", id);
      checkChoices(challenge.categories, "categories", id, 3);
      checkChoices(challenge.choices, "choices", id, 3);
    } else if (challenge.type === "sequence") {
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
      checkChoices(challenge.choices, "choices", id, 3);
    } else {
      checkChoices(challenge.choices, "choices", id, challenge.type === "trueFalse" ? 2 : 3);
    }
  });

  bank.themes.forEach((theme) => {
    validLevels.forEach((level) => {
      const scoped = bank.all.filter((challenge) => challenge.theme === theme.id && challenge.level === level);
      fail(scoped.length >= 100, `${theme.id}/${level}: au moins 100 defis attendus, trouve ${scoped.length}`);
      const uniquePrompts = new Set(scoped.map((challenge) => challenge.prompt));
      warn(uniquePrompts.size >= 100, `${theme.id}/${level}: seulement ${uniquePrompts.size} enonces uniques sur ${scoped.length} defis generes`);
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
