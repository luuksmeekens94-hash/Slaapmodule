#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { performance } from 'node:perf_hooks';

const SCENES = ['cycles', 'breathe', 'night', 'clock', 'sun', 'rhythm', 'pressure'];

async function render(scene) {
  return new Promise((resolve, reject) => {
    const t0 = performance.now();
    const proc = spawn(
      `npx remotion render ${scene} out/${scene}.mp4 --log=error`,
      { stdio: 'inherit', shell: true }
    );
    proc.on('close', (code) => {
      const elapsed = ((performance.now() - t0) / 1000).toFixed(1);
      if (code === 0) {
        console.log(`✓ ${scene}.mp4 rendered in ${elapsed}s`);
        resolve();
      } else {
        reject(new Error(`${scene} exited with code ${code}`));
      }
    });
    proc.on('error', reject);
  });
}

console.log(`Rendering ${SCENES.length} scenes…`);
const t0 = performance.now();
for (const scene of SCENES) {
  await render(scene);
}
const elapsed = ((performance.now() - t0) / 1000).toFixed(1);
console.log(`\nAll done in ${elapsed}s.`);
