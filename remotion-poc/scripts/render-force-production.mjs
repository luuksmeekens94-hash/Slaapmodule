#!/usr/bin/env node
import {copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, statSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const remotionDir = resolve(scriptDir, '..');
const projectDir = resolve(remotionDir, '..');
const outDir = join(remotionDir, 'out');
const liveDir = join(projectDir, 'prototype', 'video');
const captionsSource = join(remotionDir, 'public', 'captions', 'force-nl-nono-v1.vtt');
const audioSource = join(remotionDir, 'public', 'audio', 'force-nono-v1.mp3');
const outVideo = join(outDir, 'force.mp4');
const liveVideo = join(liveDir, 'force.mp4');
const livePoster = join(liveDir, 'force.webp');
const liveCaptions = join(liveDir, 'force-nl.vtt');
const workDir = mkdtempSync(join(tmpdir(), 'slaapmodule-force-'));
const masterVideo = join(workDir, 'force-master.mp4');
const posterPng = join(workDir, 'force.png');
const posterWebp = join(workDir, 'force.webp');

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: remotionDir,
    stdio: 'inherit',
    shell: false,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${command} exited with status ${result.status}`);
}

function capture(command, args) {
  const result = spawnSync(command, args, {
    cwd: remotionDir,
    encoding: 'utf8',
    shell: false,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${command} failed: ${result.stderr}`);
  return result.stdout;
}

try {
  mkdirSync(outDir, {recursive: true});
  mkdirSync(liveDir, {recursive: true});
  statSync(audioSource);
  statSync(captionsSource);

  run('npx', ['remotion', 'render', 'force', masterVideo, '--log=error']);
  run('npx', ['remotion', 'still', 'force', posterPng, '--frame=520', '--log=error']);
  run('ffmpeg', [
    '-y', '-loglevel', 'error', '-i', posterPng,
    '-vf', 'scale=1280:720', '-frames:v', '1',
    '-c:v', 'libwebp', '-q:v', '84', '-compression_level', '6', posterWebp,
  ]);
  run('ffmpeg', [
    '-y', '-loglevel', 'error', '-i', masterVideo,
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '24', '-pix_fmt', 'yuv420p',
    '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', outVideo,
  ]);

  const probe = JSON.parse(capture('ffprobe', [
    '-v', 'error',
    '-show_entries', 'format=duration:stream=codec_type,codec_name,width,height,r_frame_rate',
    '-of', 'json', outVideo,
  ]));
  const duration = Number(probe.format?.duration);
  const video = probe.streams?.find((stream) => stream.codec_type === 'video');
  const audio = probe.streams?.find((stream) => stream.codec_type === 'audio');
  const bytes = statSync(outVideo).size;
  const posterBytes = statSync(posterWebp).size;
  const captionCues = (readFileSync(captionsSource, 'utf8').match(/-->/g) || []).length;

  if (!(duration >= 24 && duration <= 24.1)) throw new Error(`Unexpected duration: ${duration}`);
  if (video?.codec_name !== 'h264' || video.width !== 1920 || video.height !== 1080 || video.r_frame_rate !== '30/1') {
    throw new Error(`Unexpected video stream: ${JSON.stringify(video)}`);
  }
  if (audio?.codec_name !== 'aac') throw new Error(`Missing AAC audio stream: ${JSON.stringify(audio)}`);
  if (!(bytes > 1_000_000 && bytes < 4_000_000)) throw new Error(`force.mp4 must be 1–4 MB, got ${bytes}`);
  if (!(posterBytes > 5_000 && posterBytes < 250_000)) throw new Error(`force.webp must be 5–250 KB, got ${posterBytes}`);
  if (captionCues !== 6) throw new Error(`Expected 6 caption cues, got ${captionCues}`);

  copyFileSync(outVideo, liveVideo);
  copyFileSync(posterWebp, livePoster);
  copyFileSync(captionsSource, liveCaptions);

  console.log(JSON.stringify({
    status: 'PASS',
    duration,
    bytes,
    posterBytes,
    video: `${video.codec_name} ${video.width}x${video.height} ${video.r_frame_rate}`,
    audio: audio.codec_name,
    captionCues,
    outputs: [outVideo, liveVideo, livePoster, liveCaptions],
  }, null, 2));
} finally {
  rmSync(workDir, {recursive: true, force: true});
}
