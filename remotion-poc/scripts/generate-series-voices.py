#!/usr/bin/env python3
"""Generate the approved Nono voice series, exact pauses, captions and manifests."""

from __future__ import annotations

import hashlib
import json
import os
import subprocess
import sys
import tempfile
import time
from pathlib import Path

from elevenlabs import VoiceSettings
from elevenlabs.client import ElevenLabs

ROOT = Path(__file__).resolve().parents[1]
PROJECT_ROOT = ROOT.parent
CONTENT_PATH = ROOT / "series-content.json"
AUDIO_DIR = ROOT / "public" / "audio"
CAPTIONS_DIR = ROOT / "public" / "captions"
HERMES_ENV = Path.home() / ".hermes" / ".env"


def run(*args: str, capture: bool = False) -> str:
    result = subprocess.run(
        args,
        check=True,
        text=True,
        stdout=subprocess.PIPE if capture else subprocess.DEVNULL,
        stderr=subprocess.PIPE if capture else subprocess.DEVNULL,
    )
    return result.stdout.strip() if capture else ""


def duration(path: Path) -> float:
    return float(
        run(
            "ffprobe",
            "-v",
            "error",
            "-show_entries",
            "format=duration",
            "-of",
            "default=nw=1:nk=1",
            str(path),
            capture=True,
        )
    )


def timestamp(seconds: float) -> str:
    millis = max(0, round(seconds * 1000))
    hours, millis = divmod(millis, 3_600_000)
    minutes, millis = divmod(millis, 60_000)
    secs, millis = divmod(millis, 1000)
    return f"{hours:02d}:{minutes:02d}:{secs:02d}.{millis:03d}"


def api_key() -> str:
    if os.environ.get("ELEVENLABS_API_KEY"):
        return os.environ["ELEVENLABS_API_KEY"]
    if HERMES_ENV.exists():
        for line in HERMES_ENV.read_text().splitlines():
            if line.startswith("ELEVENLABS_API_KEY="):
                return line.split("=", 1)[1].strip()
    raise RuntimeError("ELEVENLABS_API_KEY is not configured")


def generate_chunk(client: ElevenLabs, voice: dict, text: str, seed: int, output: Path) -> None:
    settings = voice["settings"]
    directed_text = f"[calm, natural, conversational] {text}"
    last_error: Exception | None = None
    for attempt in range(4):
        try:
            stream = client.text_to_speech.convert(
                voice_id=voice["voiceId"],
                output_format="mp3_44100_128",
                text=directed_text,
                model_id=voice["model"],
                language_code="nl",
                seed=seed,
                voice_settings=VoiceSettings(
                    stability=settings["stability"],
                    similarity_boost=settings["similarityBoost"],
                    style=settings["style"],
                    use_speaker_boost=settings["useSpeakerBoost"],
                    speed=settings["speed"],
                ),
            )
            output.write_bytes(b"".join(stream))
            if output.stat().st_size < 2_000:
                raise RuntimeError(f"Suspiciously small ElevenLabs response: {output.stat().st_size} bytes")
            return
        except Exception as exc:  # network/API retries
            last_error = exc
            time.sleep(2**attempt)
    raise RuntimeError(f"ElevenLabs failed after retries: {last_error}")


def main() -> None:
    payload = json.loads(CONTENT_PATH.read_text())
    voice = payload["voice"]
    videos = payload["videos"]
    requested_arg = next((arg for arg in sys.argv[1:] if arg.startswith("--slugs=")), None)
    requested = set(requested_arg.split("=", 1)[1].split(",")) if requested_arg else None
    client = ElevenLabs(api_key=api_key())
    AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    CAPTIONS_DIR.mkdir(parents=True, exist_ok=True)
    summary: list[dict] = []

    with tempfile.TemporaryDirectory(prefix="slaapmodule-nono-") as temp_name:
        temp = Path(temp_name)
        for video_index, (slug, spec) in enumerate(videos.items()):
            if requested is not None and slug not in requested:
                continue
            slug_dir = temp / slug
            slug_dir.mkdir()
            chunk_wavs: list[Path] = []
            chunk_meta: list[dict] = []

            for chunk_index, text in enumerate(spec["chunks"]):
                seed = 7319 + video_index * 100 + chunk_index
                chunk_mp3 = slug_dir / f"chunk-{chunk_index + 1}.mp3"
                chunk_wav = slug_dir / f"chunk-{chunk_index + 1}.wav"
                generate_chunk(client, voice, text, seed, chunk_mp3)
                run(
                    "ffmpeg", "-y", "-loglevel", "error", "-i", str(chunk_mp3),
                    "-ar", "48000", "-ac", "1", "-c:a", "pcm_s16le", str(chunk_wav),
                )
                seconds = duration(chunk_wav)
                chunk_wavs.append(chunk_wav)
                chunk_meta.append(
                    {
                        "text": text,
                        "seed": seed,
                        "durationSeconds": round(seconds, 3),
                        "sha256": hashlib.sha256(chunk_mp3.read_bytes()).hexdigest(),
                    }
                )

            target_audio = float(spec["durationSeconds"]) - 4.9
            speech_total = sum(item["durationSeconds"] for item in chunk_meta)
            if speech_total >= target_audio:
                raise RuntimeError(
                    f"{slug}: speech {speech_total:.2f}s does not fit target {target_audio:.2f}s; shorten copy"
                )

            weights = [float(value) for value in spec["pauseWeights"]]
            pause_budget = target_audio - speech_total
            weight_total = sum(weights)
            pauses = [pause_budget * weight / weight_total for weight in weights]
            if any(pause > 3.0 for pause in pauses):
                raise RuntimeError(f"{slug}: unnatural pause plan {pauses}; add or lengthen voice chunks")

            concat_entries: list[Path] = []
            cues: list[dict] = []
            cursor = 1.0  # video time; Audio sequence starts at frame 30
            for index, chunk_wav in enumerate(chunk_wavs):
                start = cursor
                end = start + chunk_meta[index]["durationSeconds"]
                cues.append({"start": start, "end": end, "text": spec["chunks"][index]})
                concat_entries.append(chunk_wav)
                cursor = end
                if index < len(pauses):
                    silence = slug_dir / f"silence-{index + 1}.wav"
                    run(
                        "ffmpeg", "-y", "-loglevel", "error",
                        "-f", "lavfi", "-i", "anullsrc=r=48000:cl=mono",
                        "-t", f"{pauses[index]:.6f}", "-c:a", "pcm_s16le", str(silence),
                    )
                    concat_entries.append(silence)
                    cursor += pauses[index]

            concat_file = slug_dir / "concat.txt"
            concat_file.write_text("".join(f"file '{entry.as_posix()}'\n" for entry in concat_entries))
            combined_wav = slug_dir / "combined.wav"
            run(
                "ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0",
                "-i", str(concat_file), "-c:a", "pcm_s16le", str(combined_wav),
            )
            output_mp3 = AUDIO_DIR / f"{slug}-nono-v1.mp3"
            run(
                "ffmpeg", "-y", "-loglevel", "error", "-i", str(combined_wav),
                "-af", "highpass=f=70,lowpass=f=14500,loudnorm=I=-16:LRA=7:TP=-1.5",
                "-ar", "48000", "-ac", "1", "-c:a", "libmp3lame", "-b:a", "128k",
                str(output_mp3),
            )
            final_duration = duration(output_mp3)
            expected = float(spec["durationSeconds"]) - 4.9
            if abs(final_duration - expected) > 0.08:
                raise RuntimeError(f"{slug}: final audio {final_duration:.3f}s != expected {expected:.3f}s")

            vtt = ["WEBVTT", ""]
            for cue in cues:
                vtt.extend(
                    [
                        f"{timestamp(cue['start'])} --> {timestamp(cue['end'])}",
                        cue["text"],
                        "",
                    ]
                )
            caption_path = CAPTIONS_DIR / f"{slug}-nl-nono-v1.vtt"
            caption_path.write_text("\n".join(vtt))

            manifest = {
                "provider": voice["provider"],
                "model": voice["model"],
                "language": "nl",
                "voice": {"name": voice["voiceName"], "voiceId": voice["voiceId"]},
                "voiceSettings": voice["settings"],
                "slug": slug,
                "title": spec["title"],
                "videoDurationSeconds": spec["durationSeconds"],
                "audioDurationSeconds": round(final_duration, 3),
                "videoAudioStartSeconds": 1.0,
                "pauseSeconds": [round(value, 3) for value in pauses],
                "chunks": chunk_meta,
                "endCard": spec["endCard"],
                "mastering": {"lufs": -16, "truePeakDb": -1.5, "sampleRateHz": 48000, "channels": 1},
            }
            manifest_path = AUDIO_DIR / f"{slug}-nono-v1.json"
            manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")
            summary.append(
                {
                    "slug": slug,
                    "audioSeconds": round(final_duration, 3),
                    "videoSeconds": spec["durationSeconds"],
                    "cues": len(cues),
                    "maxPause": round(max(pauses), 3),
                    "audioBytes": output_mp3.stat().st_size,
                }
            )
            print(json.dumps(summary[-1], ensure_ascii=False), flush=True)

    print(json.dumps({"status": "PASS", "videos": summary}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
