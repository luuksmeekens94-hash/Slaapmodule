#!/usr/bin/env node
import { existsSync, readFileSync, statSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const live = process.argv.includes('--live');
const maxMp4Bytes = 4 * 1024 * 1024;
const maxPosterBytes = 250 * 1024;
const baseUrl = 'https://slaapmodule.vercel.app';
const errors = [];
const warnings = [];

function fail(message) { errors.push(message); }
function warn(message) { warnings.push(message); }
function readJson(path) {
  try { return JSON.parse(readFileSync(path, 'utf8')); }
  catch (error) { fail(`${path} is geen geldige JSON: ${error.message}`); return null; }
}
function uniqDuplicates(values) {
  return [...new Set(values.filter((value, idx) => values.indexOf(value) !== idx))];
}
function assertExists(path) {
  if (!existsSync(path)) fail(`Ontbreekt: ${path}`);
}
function isPlayableMedia(media) {
  return ['animation', 'video'].includes(media?.type);
}

const dataPath = 'prototype/data/sleep-module.json';
const htmlPath = 'prototype/index.html';
assertExists(dataPath);
assertExists(htmlPath);

const data = readJson(dataPath);
if (data) {
  const chapters = data.chapters || [];
  const quizGroups = data.quizGroups || [];
  const therapyModules = data.therapyModules || [];
  const moduleIds = new Set(therapyModules.map((mod) => mod.id));
  const chapterIds = chapters.map((chapter) => chapter.id);

  for (const id of uniqDuplicates(chapterIds)) fail(`Dubbele chapter id: ${id}`);
  for (const mod of therapyModules) {
    if (!mod.id) fail('Therapy module zonder id gevonden');
    if (!Array.isArray(mod.media)) fail(`Module ${mod.id} mist media-array`);
    if (!Array.isArray(mod.steps) || mod.steps.length < 3) warn(`Module ${mod.id} heeft weinig stappen`);
    if (!Array.isArray(mod.actions) || mod.actions.length < 4) warn(`Module ${mod.id} heeft weinig acties`);
    if (!Array.isArray(mod.evaluation) || mod.evaluation.length < 4) warn(`Module ${mod.id} heeft weinig evaluatievragen`);
  }
  for (const group of quizGroups) {
    if (!moduleIds.has(group.recommendModuleId)) fail(`Quizgroep ${group.id} verwijst naar ontbrekende module ${group.recommendModuleId}`);
    if (!Array.isArray(group.questions) || group.questions.length === 0) fail(`Quizgroep ${group.id} heeft geen vragen`);
  }

  const videoVisuals = new Set();
  for (const mod of therapyModules) {
    for (const media of mod.media || []) {
      if (!media.visual) fail(`Media in ${mod.id} mist visual: ${media.title || '(zonder titel)'}`);
      else if (isPlayableMedia(media)) videoVisuals.add(media.visual);
    }
  }

  for (const visual of [...videoVisuals].sort()) {
    const mp4 = `prototype/video/${visual}.mp4`;
    const webp = `prototype/video/${visual}.webp`;
    assertExists(mp4);
    assertExists(webp);
    if (existsSync(mp4)) {
      const size = statSync(mp4).size;
      if (size > maxMp4Bytes) fail(`${mp4} is groter dan 4 MB (${(size / 1024 / 1024).toFixed(2)} MB)`);
    }
    if (existsSync(webp)) {
      const posterBytes = statSync(webp).size;
      if (posterBytes < 5_000 || posterBytes > maxPosterBytes) fail(`${webp} moet 5–250 KB zijn (${posterBytes} bytes)`);
      const signature = readFileSync(webp);
      if (signature.subarray(0, 4).toString('ascii') !== 'RIFF' || signature.subarray(8, 12).toString('ascii') !== 'WEBP') {
        fail(`${webp} heeft geen geldige WebP-signature`);
      }
      const posterProbe = spawnSync('ffprobe', [
        '-v', 'error', '-select_streams', 'v:0',
        '-show_entries', 'stream=codec_name,width,height', '-of', 'json', webp,
      ], {encoding: 'utf8'});
      if (posterProbe.status !== 0) {
        fail(`${webp} kan niet door ffprobe worden gelezen: ${posterProbe.stderr || posterProbe.stdout}`);
      } else {
        const poster = JSON.parse(posterProbe.stdout).streams?.[0] || {};
        if (poster.codec_name !== 'webp' || poster.width !== 1280 || poster.height !== 720) {
          fail(`${webp} moet WebP 1280x720 zijn: ${JSON.stringify(poster)}`);
        }
      }
    }
  }
}

try {
  const html = readFileSync(htmlPath, 'utf8');
  const scriptMatches = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
  const scriptMatch = scriptMatches.at(-1);
  if (!scriptMatch) {
    fail('Kon inline <script> blok in prototype/index.html niet vinden');
  } else {
    const dir = mkdtempSync(join(tmpdir(), 'slaapmodule-'));
    const jsPath = join(dir, 'inline.js');
    writeFileSync(jsPath, scriptMatch[1]);
    const result = spawnSync('node', ['--check', jsPath], { encoding: 'utf8' });
    rmSync(dir, { recursive: true, force: true });
    if (result.status !== 0) fail(`Inline JS syntax check faalt:\n${result.stderr || result.stdout}`);
  }
} catch (error) {
  fail(`Kon HTML/JS niet valideren: ${error.message}`);
}

if (live && data) {
  const paths = ['/', '/data/sleep-module.json'];
  const videoVisuals = new Set();
  for (const mod of data.therapyModules || []) {
    for (const media of mod.media || []) {
      if (media.visual && isPlayableMedia(media)) videoVisuals.add(media.visual);
    }
  }
  for (const visual of [...videoVisuals].sort()) {
    paths.push(`/video/${visual}.mp4`, `/video/${visual}.webp`);
  }
  for (const path of paths) {
    try {
      const response = await fetch(`${baseUrl}${path}`, { method: 'HEAD' });
      if (!response.ok) fail(`Live asset ${path} geeft ${response.status}`);
      const type = response.headers.get('content-type') || '';
      if (path.endsWith('.json') && !type.includes('application/json')) fail(`Live ${path} heeft verkeerd content-type: ${type}`);
      if (path.endsWith('.mp4') && !type.includes('video/mp4')) fail(`Live ${path} heeft verkeerd content-type: ${type}`);
      if (path.endsWith('.webp') && !type.includes('image/webp')) fail(`Live ${path} heeft verkeerd content-type: ${type}`);
      if (path === '/' && !type.includes('text/html')) fail(`Live / heeft verkeerd content-type: ${type}`);
    } catch (error) {
      fail(`Live asset ${path} kon niet worden gecontroleerd: ${error.message}`);
    }
  }
}

for (const message of warnings) console.warn(`⚠ ${message}`);
if (errors.length) {
  console.error('Slaapmodule validation FAILED');
  for (const message of errors) console.error(`- ${message}`);
  process.exit(1);
}

console.log('Slaapmodule validation OK');
if (data) {
  console.log(`chapters=${data.chapters?.length || 0} quizGroups=${data.quizGroups?.length || 0} therapyModules=${data.therapyModules?.length || 0}`);
}
