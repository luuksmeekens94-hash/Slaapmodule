#!/usr/bin/env node
import {
  copyFileSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  statSync,
} from 'node:fs';
import {tmpdir} from 'node:os';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const remotionDir = resolve(scriptDir, '..');
const projectDir = resolve(remotionDir, '..');
const outDir = join(remotionDir, 'out');
const liveDir = join(projectDir, 'prototype', 'video');
const content = JSON.parse(readFileSync(join(remotionDir, 'series-content.json'), 'utf8'));
const requested = process.argv.find((arg) => arg.startsWith('--slugs='));
const slugs = requested
  ? requested.slice('--slugs='.length).split(',').filter(Boolean)
  : Object.keys(content.videos);

for (const slug of slugs) {
  if (!content.videos[slug]) throw new Error(`Unknown series slug: ${slug}`);
}

function run(command, args, {capture = false} = {}) {
  const result = spawnSync(command, args, {
    cwd: remotionDir,
    encoding: capture ? 'utf8' : undefined,
    stdio: capture ? ['ignore', 'pipe', 'pipe'] : 'inherit',
    shell: false,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    const details = capture ? `\n${result.stderr}` : '';
    throw new Error(`${command} exited with status ${result.status}${details}`);
  }
  return capture ? result.stdout : '';
}

mkdirSync(outDir, {recursive: true});
mkdirSync(liveDir, {recursive: true});
run('npx', ['tsc', '--noEmit']);

const summary = [];
for (const slug of slugs) {
  const spec = content.videos[slug];
  const workDir = mkdtempSync(join(tmpdir(), `slaapmodule-${slug}-`));
  try {
    const audioSource = join(remotionDir, 'public', 'audio', `${slug}-nono-v2.mp3`);
    const captionsSource = join(remotionDir, 'public', 'captions', `${slug}-nl-nono-v2.vtt`);
    const masterVideo = join(workDir, `${slug}-master.mp4`);
    const poster = join(workDir, `${slug}.png`);
    const outVideo = join(outDir, `${slug}.mp4`);
    const liveVideo = join(liveDir, `${slug}.mp4`);
    const livePoster = join(liveDir, `${slug}.png`);
    const liveCaptions = join(liveDir, `${slug}-nl.vtt`);
    const durationFrames = Math.round(Number(spec.durationSeconds) * 30);
    const posterFrame = Math.max(60, durationFrames - 150);

    statSync(audioSource);
    statSync(captionsSource);
    run('npx', ['remotion', 'render', slug, masterVideo, '--log=error']);
    run('npx', ['remotion', 'still', slug, poster, `--frame=${posterFrame}`, '--log=error']);
    run('ffmpeg', [
      '-y', '-loglevel', 'error', '-i', masterVideo,
      '-c:v', 'libx264', '-preset', 'slow', '-crf', '24', '-pix_fmt', 'yuv420p',
      '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', outVideo,
    ]);

    const probe = JSON.parse(run('ffprobe', [
      '-v', 'error',
      '-show_entries', 'format=duration:stream=codec_type,codec_name,width,height,r_frame_rate',
      '-of', 'json', outVideo,
    ], {capture: true}));
    const duration = Number(probe.format?.duration);
    const video = probe.streams?.find((stream) => stream.codec_type === 'video');
    const audio = probe.streams?.find((stream) => stream.codec_type === 'audio');
    const bytes = statSync(outVideo).size;
    const cueCount = (readFileSync(captionsSource, 'utf8').match(/-->/g) || []).length;

    if (Math.abs(duration - Number(spec.durationSeconds)) > 0.1) {
      throw new Error(`${slug}: unexpected duration ${duration}`);
    }
    if (video?.codec_name !== 'h264' || video.width !== 1920 || video.height !== 1080 || video.r_frame_rate !== '30/1') {
      throw new Error(`${slug}: unexpected video stream ${JSON.stringify(video)}`);
    }
    if (audio?.codec_name !== 'aac') throw new Error(`${slug}: missing AAC audio`);
    if (!(bytes > 650_000 && bytes < 6_000_000)) throw new Error(`${slug}: suspicious size ${bytes}`);
    if (cueCount !== spec.segments.length) throw new Error(`${slug}: ${cueCount} cues for ${spec.segments.length} segments`);

    copyFileSync(outVideo, liveVideo);
    copyFileSync(poster, livePoster);
    copyFileSync(captionsSource, liveCaptions);
    summary.push({slug, duration, bytes, cueCount, posterFrame});
    console.log(JSON.stringify({status: 'PASS', ...summary.at(-1)}));
  } finally {
    rmSync(workDir, {recursive: true, force: true});
  }
}

console.log(JSON.stringify({status: 'PASS', videos: summary}, null, 2));
