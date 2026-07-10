#!/usr/bin/env node
import {spawn} from 'node:child_process';
import {performance} from 'node:perf_hooks';

const SERIES_SCENES = [
  'worry',
  'breathe',
  'cycles',
  'nightwake',
  'clock',
  'sun',
  'rhythm',
  'night',
  'pressure',
  'thought',
  'meter',
  'curve',
  'plan',
];
const DEFAULT_SCENES = ['force', ...SERIES_SCENES];
const ALLOWED_SCENES = new Set(DEFAULT_SCENES);
const requestedScenes = process.argv.slice(2);

function validateScenes(scenes) {
  const invalid = scenes.filter((scene) => !ALLOWED_SCENES.has(scene));
  if (invalid.length > 0) {
    console.error(`Invalid scene name(s): ${invalid.join(', ')}`);
    console.error(`Allowed scenes: ${DEFAULT_SCENES.join(', ')}`);
    process.exit(1);
  }
  return [...new Set(scenes)];
}

function run(command, args, label) {
  return new Promise((resolve, reject) => {
    const started = performance.now();
    const child = spawn(command, args, {stdio: 'inherit', shell: false});
    child.on('close', (code) => {
      const elapsed = ((performance.now() - started) / 1000).toFixed(1);
      if (code === 0) {
        console.log(`✓ ${label} in ${elapsed}s`);
        resolve();
      } else {
        reject(new Error(`${label} exited with code ${code}`));
      }
    });
    child.on('error', reject);
  });
}

const scenes = validateScenes(requestedScenes.length > 0 ? requestedScenes : DEFAULT_SCENES);
const series = scenes.filter((scene) => scene !== 'force');
const started = performance.now();
console.log(`Rendering ${scenes.length} validated production scene(s)…`);

if (scenes.includes('force')) {
  await run('node', ['scripts/render-force-production.mjs'], 'force production');
}
if (series.length > 0) {
  await run(
    'node',
    ['scripts/render-series-production.mjs', `--slugs=${series.join(',')}`],
    `${series.length} series production scene(s)`,
  );
}

console.log(`\nAll done in ${((performance.now() - started) / 1000).toFixed(1)}s.`);
