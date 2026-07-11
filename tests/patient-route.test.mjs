import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const html = readFileSync(new URL('../prototype/index.html', import.meta.url), 'utf8');
const data = JSON.parse(readFileSync(new URL('../prototype/data/sleep-module.json', import.meta.url), 'utf8'));
const remotionRoot = readFileSync(new URL('../remotion-poc/src/Root.tsx', import.meta.url), 'utf8');
const remotionPackage = JSON.parse(readFileSync(new URL('../remotion-poc/package.json', import.meta.url), 'utf8'));
const renderAllSource = readFileSync(new URL('../remotion-poc/render-all.mjs', import.meta.url), 'utf8');
const forceProductionSource = readFileSync(new URL('../remotion-poc/scripts/render-force-production.mjs', import.meta.url), 'utf8');
const seriesProductionSource = readFileSync(new URL('../remotion-poc/scripts/render-series-production.mjs', import.meta.url), 'utf8');
const seriesContent = JSON.parse(readFileSync(new URL('../remotion-poc/series-content.json', import.meta.url), 'utf8'));
const seriesTiming = JSON.parse(readFileSync(new URL('../remotion-poc/series-timing.json', import.meta.url), 'utf8'));
const seriesVoiceGenerator = readFileSync(new URL('../remotion-poc/scripts/generate-series-voices.py', import.meta.url), 'utf8');
const seriesSceneSource = readFileSync(new URL('../remotion-poc/src/series/SleepSeriesScene.tsx', import.meta.url), 'utf8');
const moduleValidatorSource = readFileSync(new URL('../scripts/validate-module.mjs', import.meta.url), 'utf8');
const vercelConfig = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'));

const functionStart = html.indexOf('function slaapModule()');
const functionEnd = html.indexOf('/* ─── SlaapMotion', functionStart);
assert.notEqual(functionStart, -1, 'slaapModule() ontbreekt');
assert.notEqual(functionEnd, -1, 'einde van slaapModule() ontbreekt');
const appSource = html.slice(functionStart, functionEnd);

function createApp(search = '', hostname = 'slaapmodule.vercel.app', initialStorage = {}, timers = {}) {
  const storage = new Map(Object.entries(initialStorage));
  const context = vm.createContext({
    URLSearchParams,
    console,
    setTimeout: timers.setTimeout || setTimeout,
    clearTimeout: timers.clearTimeout || clearTimeout,
    setInterval,
    clearInterval,
    confirm: () => true,
    localStorage: {
      getItem: (key) => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, String(value)),
      removeItem: (key) => storage.delete(key),
    },
    window: {
      location: { search, hostname },
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
  app.__storage = storage;
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

test('onvolledige FysionAIr-context wordt als geheel geweigerd', () => {
  const app = createApp('?source=fysionair&sleep=INVALID&focus=inslapen&preview=all');
  app.chapters = data.chapters;
  app.quizGroups = data.quizGroups;
  app.initRouteContext();

  assert.deepEqual(plain(app.routeContext), { source: '', sleep: '', focus: '' });
  assert.equal(app.isFysionAirReferral, false);
  assert.equal(app.previewAll, false);
  assert.deepEqual(plain(app.visibleChapters.map((step) => step.id)), ['intro', 'check']);
});

test('preview van alle stappen werkt alleen lokaal', () => {
  const production = createApp('?preview=all', 'slaapmodule.vercel.app');
  const local = createApp('?preview=all', '127.0.0.1');
  assert.equal(production.previewAll, false);
  assert.equal(local.previewAll, true);
});

test('een geldige verwijzing wint altijd van oude quizantwoorden', () => {
  const app = createApp('?source=fysionair&sleep=high&focus=inslapen');
  app.quizGroups = data.quizGroups;
  app.quiz = {
    nachtelijk: { q1: 3, q2: 3 },
    gedachten: { q1: 3, q2: 3 },
  };
  app.initRouteContext();
  assert.deepEqual(plain(app.recommendedModuleIds), ['moduleA']);
});

test('een nieuwe verwijzing bewaart geen patiëntkeuzes op dit apparaat', () => {
  const app = createApp('?source=fysionair&sleep=high&focus=inslapen');
  app.initRouteContext();
  app.persistState('moduleNotes', { moduleA: 'privénotitie' });
  assert.equal(app.__storage.size, 0);
});

test('een nieuwe verwijzing laadt geen oude patiëntgegevens', async () => {
  const app = createApp(
    '?source=fysionair&sleep=high&focus=inslapen',
    'slaapmodule.vercel.app',
    {
      'fysion.slaap.quiz': JSON.stringify({ nachtelijk: { q1: 3, q2: 3 } }),
      'fysion.slaap.moduleActions': JSON.stringify({ moduleB: [true, true, true] }),
      'fysion.slaap.moduleNotes': JSON.stringify({ moduleB: 'oude patiëntnotitie' }),
    },
  );
  await app.init();
  assert.deepEqual(plain(app.quiz), {});
  assert.deepEqual(plain(app.moduleActions), {});
  assert.deepEqual(plain(app.moduleNotes), {});
  assert.deepEqual(plain(app.recommendedModuleIds), ['moduleA']);
  assert.equal(app.__storage.size, 0);
});

test('vrije tekst wordt nooit op het apparaat bewaard', () => {
  const app = createApp();
  app.persistState('moduleNotes', { moduleA: 'privénotitie' });
  app.persistState('reflections', { h1: 'privéreflectie' });
  assert.equal(app.__storage.size, 0);
});

test('oude vrije tekst wordt bij elke start van het apparaat verwijderd', async () => {
  const savedQuiz = JSON.stringify({ inslapen: { q1: 3 } });
  const app = createApp('', 'slaapmodule.vercel.app', {
    'fysion.slaap.quiz': savedQuiz,
    'fysion.slaap.reflections': JSON.stringify({ h1: 'oude privéreflectie' }),
    'fysion.slaap.moduleNotes': JSON.stringify({ moduleA: 'oude patiëntnotitie' }),
  });
  await app.init();
  assert.equal(app.__storage.has('fysion.slaap.reflections'), false);
  assert.equal(app.__storage.has('fysion.slaap.moduleNotes'), false);
  assert.equal(app.__storage.get('fysion.slaap.quiz'), savedQuiz);
});

test('oude actiekeuzes worden beperkt tot twee passende acties', () => {
  const app = createApp('?source=fysionair&sleep=high&focus=inslapen');
  app.therapyModules = data.therapyModules;
  app.quizGroups = data.quizGroups;
  app.initRouteContext();
  app.moduleActions = app.normalizeModuleActions({
    moduleA: [true, true, true, true, true],
    moduleB: [true, true, true, true, true],
  });
  assert.equal(app.selectedPlanItems.length, 2);
  assert.deepEqual([...new Set(app.selectedPlanItems.map((item) => item.moduleId))], ['moduleA']);
});

test('een onvolledige slaapcheck is niet het einde van de route', () => {
  const app = createApp();
  app.chapters = data.chapters;
  app.quizGroups = data.quizGroups;
  app.currentChapterIdx = app.chapters.findIndex((chapter) => chapter.id === 'check');
  assert.equal(app.pathReady, false);
  assert.equal(app.isAtEndOfPath(), false);
  assert.equal(app.nextButtonLabel, 'Vul de slaapcheck in');
  app.next();
  assert.equal(app.currentChapterId, 'check');
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
  assert.match(html, /x-show="!isAtEndOfPath\(\)"[^>]*:disabled="!canGoNext"/);
  assert.match(html, /x-text="nextButtonLabel"/);
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

test('elke inhoudelijk andere videokaart heeft een eigen videobestand', () => {
  const byVisual = new Map();
  for (const module of data.therapyModules) {
    for (const media of module.media || []) {
      const existing = byVisual.get(media.visual);
      if (existing) {
        assert.equal(
          media.title,
          existing.title,
          `${media.visual}.mp4 wordt hergebruikt voor zowel "${existing.title}" als "${media.title}"`,
        );
      } else {
        byVisual.set(media.visual, {title: media.title, moduleId: module.id});
      }
    }
  }
});

test('elke serievoice komt uit één doorlopende Nono-take met gedeelde cue-timing', () => {
  assert.match(seriesVoiceGenerator, /convert_with_timestamps/);
  assert.doesNotMatch(seriesVoiceGenerator, /for chunk_index, text[\s\S]*?generate_chunk/);
  assert.match(seriesVoiceGenerator, /series-timing\.json/);
  assert.match(seriesSceneSource, /series-timing\.json/);
  assert.doesNotMatch(seriesSceneSource, /const visualFrame = kind === 'breathe' \? frame : \(frame \* 720\) \/ durationInFrames/);
  for (const [slug, video] of Object.entries(seriesContent.videos)) {
    assert.ok(Array.isArray(video.segments) && video.segments.length >= 3, `${slug} heeft semantische segmenten nodig`);
    assert.equal(video.chunks, undefined, `${slug} gebruikt nog losse TTS-chunks`);
  }
});

test('alle serievoices delen Nono-identiteit, seed en één bronopname', () => {
  assert.deepEqual(Object.keys(seriesTiming.videos).sort(), Object.keys(seriesContent.videos).sort());
  for (const [slug, spec] of Object.entries(seriesContent.videos)) {
    const manifest = JSON.parse(readFileSync(new URL(`../remotion-poc/public/audio/${slug}-nono-v2.json`, import.meta.url), 'utf8'));
    assert.equal(manifest.voice.voiceId, seriesContent.voice.voiceId, `${slug} voice-ID`);
    assert.equal(manifest.seed, 7319, `${slug} seed`);
    assert.deepEqual(manifest.voiceSettings, seriesContent.voice.settings, `${slug} voice-instellingen`);
    assert.match(manifest.sourceTake.sha256, /^[a-f0-9]{64}$/, `${slug} bronhash`);
    assert.equal(manifest.segments.length, spec.segments.length, `${slug} segmenten`);
    assert.equal(manifest.chunks, undefined, `${slug} gebruikt nog losse chunks`);
    assert.deepEqual(manifest.cues, seriesTiming.videos[slug].cues, `${slug} gedeelde cues`);
  }
});

test('elke manifestverwijzing opent de echte doorlopende brontake met dezelfde hash', () => {
  for (const slug of Object.keys(seriesContent.videos)) {
    const manifestUrl = new URL(`../remotion-poc/public/audio/${slug}-nono-v2.json`, import.meta.url);
    const manifest = JSON.parse(readFileSync(manifestUrl, 'utf8'));
    const sourceBytes = readFileSync(new URL(manifest.sourceTake.file, manifestUrl));
    const sourceHash = createHash('sha256').update(sourceBytes).digest('hex');
    assert.equal(sourceHash, manifest.sourceTake.sha256, `${slug} bronbestand en manifesthash wijken af`);
  }
});

test('elke videokaart bestaat in bron, renderbatch en webspeler', () => {
  assert.match(renderAllSource, /series-content\.json/);
  assert.match(renderAllSource, /Object\.keys\(seriesContent\.videos\)/);
  const visuals = [...new Set(data.therapyModules.flatMap((module) => (module.media || []).map((media) => media.visual)))];
  const expectedVisuals = [
    'force', 'worry', 'breathe', 'cycles', 'nightwake', 'nightphrase',
    'clock', 'sun', 'lighttiming', 'rhythm', 'night', 'pressure',
    'thought', 'factcheck', 'meter', 'curve', 'plan', 'signalaction',
  ];
  assert.deepEqual(visuals.sort(), expectedVisuals.sort(), 'de kaartset moet exact 18 unieke videoslugs bevatten');
  for (const visual of visuals) {
    assert.ok(visual === 'force' || seriesContent.videos[visual], `${visual} ontbreekt in series-content.json`);
    assert.match(html, new RegExp(`hasVideo\\(visual\\)[\\s\\S]*?'${visual}'`), `${visual} ontbreekt in hasVideo()`);
    if (visual !== 'force') {
      assert.equal(seriesTiming.videos[visual].audioFile, `audio/${visual}-nono-v2.mp3`, `${visual} audiopad wijkt af`);
      assert.equal(seriesTiming.videos[visual].captionFile, `captions/${visual}-nl-nono-v2.vtt`, `${visual} captionpad wijkt af`);
    }
  }
});

test('kaarttekst en zichtbare duur zijn gelijk aan de werkelijke serievoice', () => {
  const normalize = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  for (const module of data.therapyModules) {
    for (const media of module.media || []) {
      if (media.visual === 'force') continue;
      const spec = seriesContent.videos[media.visual];
      assert.equal(normalize(media.script), normalize(spec.segments.join(' ')), `${media.visual} script wijkt af van audio`);
      assert.match(media.label, new RegExp(`(?:^|\\D)${spec.durationSeconds}\\s*sec$`), `${media.visual} toont verkeerde duur`);
    }
  }
});

test('videokaarten laden pas na een klik en gebruiken compacte posters', () => {
  assert.match(html, /:controls="hasLoadedNativeVideo\(media, i\)" playsinline preload="none"/);
  assert.doesNotMatch(html, /preload="metadata"/);
  assert.match(html, /`video\/\$\{visual\}\.webp`/);
  const visuals = [...new Set(data.therapyModules.flatMap((module) => (module.media || []).map((media) => media.visual)))];
  for (const visual of visuals) {
    const posterBytes = readFileSync(new URL(`../prototype/video/${visual}.webp`, import.meta.url)).byteLength;
    assert.ok(posterBytes < 250_000, `${visual}.webp is te zwaar: ${posterBytes} bytes`);
  }
});

test('de app-shell ververst direct terwijl video-assets gecachet blijven', () => {
  const cacheValue = (source) => vercelConfig.headers
    .find((rule) => rule.source === source)?.headers
    .find((header) => header.key.toLowerCase() === 'cache-control')?.value || '';
  assert.match(cacheValue('/'), /no-store/);
  assert.match(cacheValue('/index.html'), /no-store/);
  assert.match(cacheValue('/data/(.*)'), /no-store/);
  assert.match(cacheValue('/video/(.*)'), /public/);
  assert.doesNotMatch(cacheValue('/video/(.*)'), /no-store/);
  assert.equal(vercelConfig.headers.some((rule) => rule.source === '/(.*)'), false);
});

test('de validator controleert lokale en live WebP-posters inhoudelijk', () => {
  assert.match(moduleValidatorSource, /path\.endsWith\('\.webp'\)[\s\S]*?image\/webp/);
  assert.doesNotMatch(moduleValidatorSource, /path\.endsWith\('\.png'\)/);
  assert.match(moduleValidatorSource, /codec_name !== 'webp'/);
  assert.match(moduleValidatorSource, /width !== 1280|height !== 720/);
});

test('een grote videoknop roept play direct vanuit dezelfde gebruikersklik aan', async () => {
  assert.match(html, /class="video-start-overlay"/);
  assert.match(html, /\.video-start-button svg\s*\{[^}]*position: static/);
  assert.match(html, /:controls="hasLoadedNativeVideo\(media, i\)"/);
  assert.doesNotMatch(html, /controls playsinline preload="none"/);
  assert.match(html, /@click\.stop="startNativeVideo\(media, i, \$event\)"/);
  assert.match(appSource, /otherVideo\.removeAttribute\('src'\)[\s\S]*?otherVideo\.load\(\)/);
  assert.match(appSource, /cloneNode\(true\)/);
  assert.doesNotMatch(html, /@(play|playing|waiting|pause|timeupdate|ended)=/);

  const app = createApp();
  app.mediaKey = () => 'breathe';
  let playCalls = 0;
  let source = null;
  let finishPlaybackStart;
  const video = {
    paused: true,
    ended: false,
    currentTime: 0,
    getAttribute(name) { return name === 'src' ? source : null; },
    set src(value) { source = value; },
    addEventListener() {},
    removeEventListener() {},
    play() {
      playCalls += 1;
      return new Promise((resolve) => { finishPlaybackStart = resolve; });
    },
  };
  const event = {currentTarget: {closest: () => ({querySelector: () => video})}};
  const start = app.startNativeVideo({visual: 'breathe'}, 2, event);

  assert.equal(source, 'video/breathe.mp4');
  assert.equal(app.loadedMediaId, 'breathe');
  assert.equal(playCalls, 1);
  assert.equal(app.loadingMediaId, 'breathe');
  finishPlaybackStart();
  await start;
  assert.equal(app.loadingMediaId, null);
});

test('videofouten ontgrendelen de knop en oude play-pogingen kunnen nieuwe state niet overschrijven', async () => {
  const makeVideo = () => {
    let source = null;
    const listeners = new Map();
    const attempts = [];
    return {
      paused: true,
      ended: false,
      currentTime: 0,
      listeners,
      attempts,
      getAttribute(name) { return name === 'src' ? source : null; },
      removeAttribute(name) { if (name === 'src') source = null; },
      set src(value) { source = value; },
      pause() { this.paused = true; },
      load() {},
      addEventListener(type, handler) { listeners.set(type, handler); },
      removeEventListener(type, handler) { if (listeners.get(type) === handler) listeners.delete(type); },
      play() {
        this.paused = false;
        return new Promise((resolve, reject) => attempts.push({resolve, reject}));
      },
    };
  };
  const eventFor = (video) => ({currentTarget: {closest: () => ({querySelector: () => video})}});

  const failedApp = createApp();
  failedApp.mediaKey = () => 'breathe';
  const failedVideo = makeVideo();
  const failedStart = failedApp.startNativeVideo({visual: 'breathe'}, 2, eventFor(failedVideo));
  assert.equal(typeof failedVideo.listeners.get('stalled'), 'function');
  assert.equal(typeof failedVideo.listeners.get('abort'), 'function');
  assert.equal(typeof failedVideo.listeners.get('emptied'), 'function');
  assert.equal(typeof failedVideo.listeners.get('error'), 'function');
  failedVideo.listeners.get('stalled')({type: 'stalled'});
  assert.equal(failedApp.loadingMediaId, 'breathe');
  failedVideo.listeners.get('error')({type: 'error', target: failedVideo});
  failedVideo.attempts[0].reject(new Error('network kapot'));
  await failedStart;
  assert.equal(failedApp.loadingMediaId, null);
  assert.equal(failedApp.loadedMediaId, null);
  assert.equal(failedApp.videoPlayErrorId, 'breathe');
  assert.equal(failedVideo.getAttribute('src'), null);

  let watchdog = null;
  const timeoutApp = createApp('', 'slaapmodule.vercel.app', {}, {
    setTimeout: (callback) => { watchdog = callback; return 1; },
    clearTimeout: () => {},
  });
  timeoutApp.mediaKey = () => 'breathe';
  const timeoutVideo = makeVideo();
  const timeoutStart = timeoutApp.startNativeVideo({visual: 'breathe'}, 2, eventFor(timeoutVideo));
  assert.equal(typeof watchdog, 'function');
  watchdog();
  timeoutVideo.attempts[0].reject(new Error('geen media-event ontvangen'));
  await timeoutStart;
  assert.equal(timeoutApp.loadingMediaId, null);
  assert.equal(timeoutApp.loadedMediaId, null);
  assert.equal(timeoutApp.videoPlayErrorId, 'breathe');
  assert.equal(timeoutVideo.getAttribute('src'), null);

  const raceApp = createApp();
  raceApp.mediaKey = () => 'breathe';
  const raceVideo = makeVideo();
  const firstStart = raceApp.startNativeVideo({visual: 'breathe'}, 2, eventFor(raceVideo));
  const staleErrorHandler = raceVideo.listeners.get('error');
  raceApp.stopMedia();
  raceVideo.paused = true;
  const secondStart = raceApp.startNativeVideo({visual: 'breathe'}, 2, eventFor(raceVideo));
  staleErrorHandler({type: 'error'});
  assert.equal(raceApp.loadingMediaId, 'breathe');
  assert.equal(raceApp.videoPlayErrorId, null);
  assert.equal(raceVideo.getAttribute('src'), 'video/breathe.mp4');
  raceVideo.attempts[0].reject(new Error('oude poging afgebroken'));
  await firstStart;
  assert.equal(raceApp.loadingMediaId, 'breathe');
  assert.equal(raceApp.videoPlayErrorId, null);
  raceVideo.attempts[1].resolve();
  await secondStart;
  assert.equal(raceApp.loadingMediaId, null);
  assert.equal(raceApp.videoPlayErrorId, null);
});

test('elke nieuwe broncyclus isoleert oude lifecycle-events op een vervangen video-element', async () => {
  const scene = {
    current: null,
    querySelector() { return this.current; },
  };
  const makeVideo = () => {
    let source = null;
    const listeners = new Map();
    const video = {
      paused: true,
      ended: false,
      currentTime: 0,
      controls: false,
      attributes: [],
      listeners,
      querySelectorAll() { return []; },
      getAttribute(name) { return name === 'src' ? source : null; },
      removeAttribute(name) { if (name === 'src') source = null; },
      set src(value) { source = value; },
      addEventListener(type, handler) { listeners.set(type, handler); },
      removeEventListener(type, handler) { if (listeners.get(type) === handler) listeners.delete(type); },
      dispatch(type) { listeners.get(type)?.({type, target: video}); },
      pause() { video.paused = true; },
      load() {},
      play() { video.paused = false; return Promise.resolve(); },
      cloneNode() {
        const clone = makeVideo();
        if (source) clone.src = source;
        return clone;
      },
      replaceWith(next) { scene.current = next; },
    };
    return video;
  };
  const event = {currentTarget: {closest: () => scene}};
  const app = createApp();
  app.mediaKey = () => 'breathe';
  const original = makeVideo();
  scene.current = original;

  await app.startNativeVideo({visual: 'breathe'}, 2, event);
  const first = scene.current;
  assert.notEqual(first, original);
  first.dispatch('play');
  first.dispatch('playing');
  assert.equal(app.activeMediaId, 'breathe');

  const firstAttempt = app.nativeVideoAttemptId;
  first.currentTime = 7;
  first.paused = true;
  first.dispatch('pause');
  assert.equal(app.pausedMediaId, 'breathe');
  assert.equal(app.nativeVideoAttemptId, firstAttempt);

  first.paused = false;
  first.dispatch('play');
  first.dispatch('playing');
  assert.equal(app.activeMediaId, 'breathe');
  assert.equal(app.pausedMediaId, null);

  first.currentTime = 42;
  first.ended = true;
  first.paused = true;
  first.dispatch('ended');
  assert.equal(app.endedMediaId, 'breathe');

  await app.startNativeVideo({visual: 'breathe'}, 2, event);
  const second = scene.current;
  assert.notEqual(second, first);
  second.dispatch('play');
  second.dispatch('playing');
  const secondAttempt = app.nativeVideoAttemptId;
  app.loadingMediaId = 'breathe';
  ['playing', 'waiting', 'pause', 'ended', 'error', 'abort', 'emptied'].forEach(type => first.dispatch(type));
  assert.equal(app.nativeVideoAttemptId, secondAttempt);
  assert.equal(app.loadingMediaId, 'breathe');
  assert.equal(app.videoPlayErrorId, null);
  assert.equal(app.endedMediaId, null);

  second.dispatch('error');
  assert.equal(app.videoPlayErrorId, 'breathe');
  second.paused = true;
  await app.startNativeVideo({visual: 'breathe'}, 2, event);
  const third = scene.current;
  assert.notEqual(third, second);
  const thirdAttempt = app.nativeVideoAttemptId;
  ['playing', 'waiting', 'pause', 'ended', 'error'].forEach(type => second.dispatch(type));
  assert.equal(app.nativeVideoAttemptId, thirdAttempt);
  assert.equal(app.videoPlayErrorId, null);
});

test('de professionele videoserie gebruikt hoorbare audio en Nederlandse captions', () => {
  const moduleA = data.therapyModules.find((module) => module.id === 'moduleA');
  const force = moduleA.media.find((media) => media.visual === 'force');
  const seriesSlugs = ['force', ...Object.keys(seriesContent.videos)];

  assert.equal(force.label, 'Animatie · 24 sec');
  assert.match(force.script, /slapen lukt niet op commando/i);
  assert.doesNotMatch(force.desc + force.script, /wakkerder/i);
  assert.doesNotMatch(html, /:muted=/);
  assert.match(html, /<track kind="captions" srclang="nl" label="Nederlands" :src="videoCaptionUrl\(media\.visual\)" default>/);
  assert.match(html, /x-show="!hasVideo\(media\.visual\)"[\s\S]*?@click\.stop="toggleMedia/);
  assert.match(html, /<div class="lesson-overlay" x-show="!hasVideo\(media\.visual\)">/);
  assert.match(html, /<div class="media-controls" x-show="!hasVideo\(media\.visual\)">/);
  assert.match(html, /<div class="media-voice" x-show="!hasVideo\(media\.visual\)">/);
  assert.match(remotionRoot, /<Composition id="force" component=\{ForceFinalScene\} \{\.\.\.SERIES\} \/>/);
  assert.match(remotionRoot, /<Composition id="force-legacy" component=\{ForceScene\} \{\.\.\.LEGACY\} \/>/);
  assert.equal(remotionPackage.scripts['render:force'], 'node scripts/render-force-production.mjs');
  assert.equal(remotionPackage.scripts['render:series'], 'node scripts/render-series-production.mjs');
  assert.match(renderAllSource, /scripts\/render-force-production\.mjs/);
  assert.match(renderAllSource, /scripts\/render-series-production\.mjs/);
  assert.match(forceProductionSource, /bytes > 1_000_000 && bytes < 4_000_000/);
  assert.match(forceProductionSource, /audio\?\.codec_name !== 'aac'/);
  assert.match(seriesProductionSource, /video\?\.codec_name !== 'h264'/);
  assert.match(seriesProductionSource, /audio\?\.codec_name !== 'aac'/);
  assert.match(seriesProductionSource, /nono-v2/);
  assert.match(seriesSceneSource, /seriesTiming/);

  for (const slug of seriesSlugs) {
    const captions = readFileSync(new URL(`../prototype/video/${slug}-nl.vtt`, import.meta.url), 'utf8');
    const videoBytes = readFileSync(new URL(`../prototype/video/${slug}.mp4`, import.meta.url)).byteLength;
    const expectedCues = slug === 'force' ? 6 : seriesContent.videos[slug].segments.length;
    assert.equal((captions.match(/-->/g) || []).length, expectedCues, `${slug} captions`);
    assert.ok(videoBytes > 650_000 && videoBytes < 6_000_000, `${slug}.mp4 is ${videoBytes} bytes`);
  }
});

test('de eigen pauzeknop bewaart de voortgang van native video', () => {
  const start = html.indexOf('toggleMedia(media, i) {');
  const end = html.indexOf('startMedia(media, i, startAt = 0)', start);
  const toggleSource = html.slice(start, end);
  assert.match(toggleSource, /activeVideo && !activeVideo\.paused/);
  assert.match(toggleSource, /activeVideo\.pause\(\);\s*return;/);
});

test('de patiënt kiest maximaal twee acties voor het weekplan', () => {
  const app = createApp('?source=fysionair&sleep=high&focus=inslapen');
  app.chapters = data.chapters;
  app.therapyModules = data.therapyModules;
  app.quizGroups = data.quizGroups;
  app.initRouteContext();
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
