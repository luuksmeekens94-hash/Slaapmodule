#!/usr/bin/env python3
"""Generate one continuous approved Nono take per video, then align audio, captions and visuals."""

from __future__ import annotations

import base64
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
CONTENT_PATH = ROOT / "series-content.json"
TIMING_PATH = ROOT / "series-timing.json"
AUDIO_DIR = ROOT / "public" / "audio"
SOURCE_DIR = AUDIO_DIR / "source"
CAPTIONS_DIR = ROOT / "public" / "captions"
HERMES_ENV = Path.home() / ".hermes" / ".env"
VOICE_PREFIX = "[calm, natural, close-mic, conversational] "
SEGMENT_SEPARATOR = " [short pause] "
VERSION = "v2"


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


def generate_continuous_take(client: ElevenLabs, voice: dict, text: str, seed: int):
    settings = voice["settings"]
    last_error: Exception | None = None
    for attempt in range(4):
        try:
            return client.text_to_speech.convert_with_timestamps(
                voice_id=voice["voiceId"],
                output_format="mp3_44100_128",
                text=text,
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
        except Exception as exc:  # network/API retries
            last_error = exc
            time.sleep(2**attempt)
    raise RuntimeError(f"ElevenLabs failed after retries: {last_error}")


def alignment_dict(response) -> dict:
    alignment = response.alignment
    if hasattr(alignment, "model_dump"):
        return alignment.model_dump()
    return dict(alignment)


def locate_segments(source_text: str, segments: list[str], alignment: dict) -> list[dict]:
    characters = "".join(alignment["characters"])
    if characters != source_text:
        raise RuntimeError("ElevenLabs alignment characters differ from source text")
    starts = alignment["character_start_times_seconds"]
    ends = alignment["character_end_times_seconds"]
    located: list[dict] = []
    cursor = 0
    for text in segments:
        index = characters.find(text, cursor)
        if index < 0:
            raise RuntimeError(f"Cannot locate segment in timestamp alignment: {text}")
        last = index + len(text) - 1
        located.append(
            {
                "text": text,
                "characterStart": index,
                "characterEnd": last,
                "sourceStartSeconds": float(starts[index]),
                "sourceEndSeconds": float(ends[last]),
            }
        )
        cursor = last + 1
    return located


def main() -> None:
    payload = json.loads(CONTENT_PATH.read_text())
    voice = payload["voice"]
    videos = payload["videos"]
    requested_arg = next((arg for arg in sys.argv[1:] if arg.startswith("--slugs=")), None)
    requested = requested_arg.split("=", 1)[1].split(",") if requested_arg else list(videos)
    unknown = sorted(set(requested) - set(videos))
    if unknown:
        raise RuntimeError(f"Unknown series slugs: {', '.join(unknown)}")

    client = ElevenLabs(api_key=api_key())
    AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    SOURCE_DIR.mkdir(parents=True, exist_ok=True)
    CAPTIONS_DIR.mkdir(parents=True, exist_ok=True)
    timing = json.loads(TIMING_PATH.read_text()) if TIMING_PATH.exists() else {"version": 2, "videos": {}}
    timing["version"] = 2
    timing.setdefault("videos", {})
    summary: list[dict] = []

    with tempfile.TemporaryDirectory(prefix="slaapmodule-nono-") as temp_name:
        temp = Path(temp_name)
        for slug, spec in videos.items():
            if slug not in requested:
                continue
            slug_dir = temp / slug
            slug_dir.mkdir()
            segments = [str(value) for value in spec["segments"]]
            weights = [float(value) for value in spec["pauseWeights"]]
            if len(weights) != len(segments) - 1:
                raise RuntimeError(f"{slug}: pauseWeights must have one value between every segment")

            seed = 7319
            source_text = VOICE_PREFIX + SEGMENT_SEPARATOR.join(segments)
            response = generate_continuous_take(client, voice, source_text, seed)
            source_mp3 = SOURCE_DIR / f"{slug}-nono-{VERSION}-source.mp3"
            source_mp3.write_bytes(base64.b64decode(response.audio_base_64))
            if source_mp3.stat().st_size < 2_000:
                raise RuntimeError(f"{slug}: suspiciously small ElevenLabs response")

            source_wav = slug_dir / "source.wav"
            run(
                "ffmpeg", "-y", "-loglevel", "error", "-i", str(source_mp3),
                "-ar", "48000", "-ac", "1", "-c:a", "pcm_s16le", str(source_wav),
            )
            source_seconds = duration(source_wav)
            located = locate_segments(source_text, segments, alignment_dict(response))

            segment_wavs: list[Path] = []
            segment_meta: list[dict] = []
            for index, item in enumerate(located):
                clip_start = max(0.0, item["sourceStartSeconds"] - 0.035)
                clip_end = min(source_seconds, item["sourceEndSeconds"] + 0.055)
                segment_wav = slug_dir / f"segment-{index + 1}.wav"
                run(
                    "ffmpeg", "-y", "-loglevel", "error", "-i", str(source_wav),
                    "-ss", f"{clip_start:.6f}", "-to", f"{clip_end:.6f}",
                    "-af", "afade=t=in:st=0:d=0.008,areverse,afade=t=in:st=0:d=0.012,areverse",
                    "-c:a", "pcm_s16le", str(segment_wav),
                )
                seconds = duration(segment_wav)
                segment_wavs.append(segment_wav)
                segment_meta.append(
                    {
                        **item,
                        "clipStartSeconds": round(clip_start, 3),
                        "clipEndSeconds": round(clip_end, 3),
                        "durationSeconds": round(seconds, 3),
                    }
                )

            target_audio = float(spec["durationSeconds"]) - 4.9
            speech_total = sum(item["durationSeconds"] for item in segment_meta)
            if speech_total >= target_audio:
                raise RuntimeError(
                    f"{slug}: continuous speech {speech_total:.2f}s does not fit target {target_audio:.2f}s"
                )
            pause_budget = target_audio - speech_total
            weight_total = sum(weights)
            pauses = [pause_budget * weight / weight_total for weight in weights]
            if any(pause > 3.0 for pause in pauses):
                raise RuntimeError(f"{slug}: unnatural pause plan {pauses}; adjust duration or copy")

            concat_entries: list[Path] = []
            cues: list[dict] = []
            cursor = 1.0
            for index, segment_wav in enumerate(segment_wavs):
                start = cursor
                end = start + segment_meta[index]["durationSeconds"]
                cue = {"start": round(start, 3), "end": round(end, 3), "text": segments[index]}
                cues.append(cue)
                segment_meta[index]["videoStartSeconds"] = cue["start"]
                segment_meta[index]["videoEndSeconds"] = cue["end"]
                concat_entries.append(segment_wav)
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
            output_mp3 = AUDIO_DIR / f"{slug}-nono-{VERSION}.mp3"
            run(
                "ffmpeg", "-y", "-loglevel", "error", "-i", str(combined_wav),
                "-af", "highpass=f=70,lowpass=f=14500,loudnorm=I=-16:LRA=7:TP=-1.5",
                "-ar", "48000", "-ac", "1", "-c:a", "libmp3lame", "-b:a", "128k",
                str(output_mp3),
            )
            final_duration = duration(output_mp3)
            if abs(final_duration - target_audio) > 0.08:
                raise RuntimeError(f"{slug}: final audio {final_duration:.3f}s != target {target_audio:.3f}s")

            vtt = ["WEBVTT", ""]
            for cue in cues:
                vtt.extend([f"{timestamp(cue['start'])} --> {timestamp(cue['end'])}", cue["text"], ""])
            caption_path = CAPTIONS_DIR / f"{slug}-nl-nono-{VERSION}.vtt"
            caption_path.write_text("\n".join(vtt))

            source_hash = hashlib.sha256(source_mp3.read_bytes()).hexdigest()
            manifest = {
                "provider": voice["provider"],
                "model": voice["model"],
                "language": "nl",
                "voice": {"name": voice["voiceName"], "voiceId": voice["voiceId"]},
                "voiceSettings": voice["settings"],
                "seed": seed,
                "slug": slug,
                "title": spec["title"],
                "videoDurationSeconds": spec["durationSeconds"],
                "audioDurationSeconds": round(final_duration, 3),
                "videoAudioStartSeconds": 1.0,
                "pauseSeconds": [round(value, 3) for value in pauses],
                "sourceTake": {
                    "file": (Path("source") / source_mp3.name).as_posix(),
                    "durationSeconds": round(source_seconds, 3),
                    "sha256": source_hash,
                    "sourceText": source_text,
                },
                "segments": segment_meta,
                "cues": cues,
                "endCard": spec["endCard"],
                "mastering": {"lufs": -16, "truePeakDb": -1.5, "sampleRateHz": 48000, "channels": 1},
            }
            manifest_path = AUDIO_DIR / f"{slug}-nono-{VERSION}.json"
            manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")
            timing["videos"][slug] = {
                "durationSeconds": spec["durationSeconds"],
                "audioFile": f"audio/{slug}-nono-{VERSION}.mp3",
                "captionFile": f"captions/{slug}-nl-nono-{VERSION}.vtt",
                "cues": cues,
            }
            summary.append(
                {
                    "slug": slug,
                    "sourceTakeSeconds": round(source_seconds, 3),
                    "audioSeconds": round(final_duration, 3),
                    "videoSeconds": spec["durationSeconds"],
                    "cues": len(cues),
                    "maxPause": round(max(pauses), 3),
                    "audioBytes": output_mp3.stat().st_size,
                }
            )
            print(json.dumps(summary[-1], ensure_ascii=False), flush=True)

    TIMING_PATH.write_text(json.dumps(timing, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"status": "PASS", "videos": summary}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
