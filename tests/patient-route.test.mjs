import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const html = readFileSync(new URL('../prototype/index.html', import.meta.url), 'utf8');
const data = JSON.parse(readFileSync(new URL('../prototype/data/sleep-module.json', import.meta.url), 'utf8'));

const functionStart = html.indexOf('function slaapModule()');
const functionEnd = html.indexOf('/* ─── SlaapMotion', functionStart);
assert.notEqual(functionStart, -1, 'slaapModule() ontbreekt');
assert.notEqual(functionEnd, -1, 'einde van slaapModule() ontbreekt');
const appSource = html.slice(functionStart, functionEnd);

function createApp(search = '') {
  const storage = new Map();
  const context = vm.createContext({
    URLSearchParams,
    console,
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
    confirm: () => true,
    localStorage: {
      getItem: (key) => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, String(value)),
      removeItem: (key) => storage.delete(key),
    },
    window: {
      location: { search },
      scrollTo() {},
      SlaapMotion: null,
      speechSynthesis: null,
    },
    document: {
      querySelector() { return null; },
      querySelectorAll() { return []; },
    },
    fetch: async () => ({ ok: true, json: async () => data }),
    SpeechSynthesisUtterance: function SpeechSynthesisUtterance() {},
  });
  vm.runInContext(`${appSource}; this.__createApp = slaapModule;`, context);
  const app = context.__createApp();
  app.$nextTick = (fn) => fn();
  app.$watch = () => {};
  return app;
}

function plain(value) {
  return JSON.parse(JSON.stringify(value));
}

function collectPatientCopy(value, key = '') {
  if (Array.isArray(value)) return value.flatMap((item) => collectPatientCopy(item, key));
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([childKey, childValue]) => collectPatientCopy(childValue, childKey));
  }
  if (typeof value !== 'string' || ['id', 'icon', 'visual', 'type', 'recommendModuleId'].includes(key)) return [];
  return [value.replace(/<[^>]+>/g, ' ')];
}

test('de patiënttekst voldoet aan de vaste B1-basisregels', () => {
  const snippets = collectPatientCopy(data);
  const copy = snippets.join('\n');
  assert.doesNotMatch(copy, /\b(daadwerkelijk|evaluatie|gefunctioneerd|realistisch|optimaliseren|interventie|protocol|compliance|herstelbelemmerend|hoofdstuk|onderdeel)\b/i);
  const longSentences = snippets
    .flatMap((snippet) => snippet.split(/(?<=[.!?])\s+/))
    .map((sentence) => ({ sentence, words: sentence.match(/[A-Za-zÀ-ÿ0-9'-]+/g)?.length || 0 }))
    .filter(({ words }) => words > 20);
  assert.deepEqual(longSentences, []);
});

test('de zichtbare producttaal gebruikt slaaproute en geen interne lesnamen', () => {
  assert.match(html, /<title>FysionAIr Slaaproute<\/title>/);
  assert.doesNotMatch(html, /<div class="eyebrow">Hoofdstuk/);
  assert.equal(data.chapters.some((chapter) => /^Onderdeel\b/.test(chapter.title)), false);
  assert.equal(data.chapters.some((chapter) => /Hoofdstuk|Interactieve/i.test(chapter.kicker)), false);
  assert.equal(data.quizGroups.some((group) => /^Onderdeel\b/.test(group.recommendsTitle)), false);
  assert.equal(data.therapyModules.some((module) => /^Onderdeel\b/.test(module.label)), false);
});

test('FysionAIr-context gebruikt alleen veilige waarden en geeft B1-starttekst', () => {
  const app = createApp('?source=fysionair&sleep=high&focus=inslapen&name=NietGebruiken');
  app.initRouteContext();

  assert.deepEqual(plain(app.routeContext), {
    source: 'fysionair',
    sleep: 'high',
    focus: 'inslapen',
  });
  assert.equal(app.isFysionAirReferral, true);
  assert.equal(app.startKicker, 'Aanbevolen vanuit FysionAIr');
  assert.match(app.startMessage, /^Je antwoorden laten zien/);
  assert.match(app.startFocusMessage, /inslapen/i);
  assert.doesNotMatch(app.startMessage + app.startFocusMessage, /NietGebruiken/);
});

test('onbekende URL-waarden worden niet overgenomen', () => {
  const app = createApp('?source=anders&sleep=extreem&focus=bsn&name=Jan');
  app.initRouteContext();
  assert.deepEqual(plain(app.routeContext), { source: '', sleep: '', focus: '' });
  assert.equal(app.isFysionAirReferral, false);
  assert.equal(app.startKicker, 'Jouw slaaproute');
});

test('een veilige focus uit FysionAIr maakt direct een passende route', () => {
  const app = createApp('?source=fysionair&sleep=high&focus=inslapen');
  app.chapters = data.chapters;
  app.quizGroups = data.quizGroups;
  app.therapyModules = data.therapyModules;
  app.initRouteContext();

  assert.deepEqual(plain(app.recommendedModuleIds), ['moduleA']);
  assert.equal(app.pathReady, true);
  assert.deepEqual(plain(app.visibleChapters.map((step) => step.id)), ['intro', 'gevaar', 'educatie', 'moduleA', 'afsluiting']);
  assert.deepEqual(plain(app.personalPath.map((step) => step.id)), ['gevaar', 'educatie', 'moduleA', 'afsluiting']);
  app.currentChapterIdx = app.chapters.findIndex((chapter) => chapter.id === 'gevaar');
  assert.equal(app.routeStepLabel, 'Stap 2 van 5');
});

test('de voortgang gebruikt een duidelijke staptekst', () => {
  const app = createApp('?preview=all');
  app.chapters = data.chapters;
  app.previewAll = true;
  app.currentChapterIdx = 0;
  assert.equal(app.routeStepLabel, `Stap 1 van ${data.chapters.length}`);
});

test('mobiel toont één startactie en houdt de staptekst zichtbaar', () => {
  assert.match(html, /<div class="chapter-nav" x-show="currentChapterIdx !== 0">/);
  assert.match(html, /x-show="!isAtEndOfPath\(\)"[^>]*>\s*Volgende/s);
  assert.match(html, /@media \(max-width: 960px\)[\s\S]*?\.chapter-nav \{[\s\S]*?position: fixed;/);
  assert.match(html, /@media \(max-width: 560px\)[\s\S]*?\.nav-progress > span \{ display: inline;/);
  assert.match(html, /@media \(max-width: 560px\)[\s\S]*?\.mobile-chapters \{ display: none !important;/);
});

test('het eindscherm doet geen stellige pijnbelofte', () => {
  const closing = html.slice(html.indexOf('<!-- ─ 5 · AFSLUITING'), html.indexOf('<!-- Chapter nav -->'));
  assert.doesNotMatch(closing, /Slechte slaap|Goede slaap|Meer pijn|Minder pijn|Pijn komt harder binnen/i);
});

test('weekkeuzes blijven bereikbaar met toetsenbord', () => {
  assert.match(html, /<input type="checkbox" class="plan-input"/);
  assert.doesNotMatch(html, /<input type="checkbox"[^>]*style="display:none;"/);
  assert.match(html, /\.plan-item:focus-within/);
});

test('de patiënt kiest maximaal twee acties voor het weekplan', () => {
  const app = createApp();
  app.chapters = data.chapters;
  app.therapyModules = data.therapyModules;
  app.currentChapterIdx = 4;
  app.moduleActions = {
    moduleA: [true, true, false, false, false],
  };

  assert.equal(app.selectedPlanItems.length, 2);
  app.toggleModuleAction(2);
  assert.equal(app.currentModuleActions[2], false);
  assert.match(app.planNotice, /maximaal twee/i);
  assert.match(app.planText, /Je plan/);
  assert.match(app.planText, /Bespreek dit met je fysio/);
});
