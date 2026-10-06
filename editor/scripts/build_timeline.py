"""Trim long pauses in a voice-over and write its word timeline.

Usage:
  python3 scripts/build_timeline.py <voice.mp3> <tts_words.json> <out.wav> <out_timeline.json>
  python3 scripts/build_timeline.py --no-audio <tts_words.json> <out_timeline.json>

Pauses longer than MAX_PAUSE are shortened (middle part removed) and the TTS
word timings are remapped onto the trimmed audio. With --no-audio the pauses are
estimated from the alignment alone (for building the edit before the audio
file is available); rerun with the real file before the final render.
"""
import json, re, subprocess, sys

MAX_PAUSE = 0.6
MERGE = [(["ce", "efe", "de", "i,"], "CFDI,"), (["ce", "efe", "de", "i"], "CFDI"),
         (["erre", "efe", "ce,"], "RFC,"), (["erre", "efe", "ce"], "RFC"),
         (["A", "P", "I."], "API."), (["veinte", "por", "ciento"], "20%"),
         (["fispal", "punto", "em", "equis."], "fispal.mx")]

no_audio = sys.argv[1] == "--no-audio"
if no_audio:
    _, _, words_json, out_json = sys.argv
else:
    _, src, words_json, out_wav, out_json = sys.argv

raw = json.load(open(words_json))["words"]
real, prefix, in_tag = [], "", False
for w in raw:
    # skip [audio tags], which the aligner splits into several tokens
    if w["text"].startswith("[") or in_tag:
        in_tag = not w["text"].endswith("]")
        continue
    if w["text"] in ("¿", "¡"):  # opening marks come as their own token
        prefix = w["text"]
        continue
    real.append({**w, "text": prefix + w["text"]})
    prefix = ""

if no_audio:
    silences = [(a["endSeconds"], b["startSeconds"]) for a, b in zip(real, real[1:])
                if b["startSeconds"] - a["endSeconds"] > 0.2]
    dur = raw[-1]["endSeconds"] + 0.3
else:
    log = subprocess.run(["ffmpeg", "-i", src, "-af", "silencedetect=n=-40dB:d=0.2", "-f", "null", "-"],
                         capture_output=True, text=True).stderr
    silences = list(zip([float(x) for x in re.findall(r"silence_start: ([\d.]+)", log)],
                        [float(x) for x in re.findall(r"silence_end: ([\d.]+)", log)]))
    dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                                "-of", "csv=p=0", src], capture_output=True, text=True).stdout)

cuts = []
for a, b in silences:
    if b - a > MAX_PAUSE:
        mid = (a + b) / 2
        cuts.append((mid - (b - a - MAX_PAUSE) / 2, mid + (b - a - MAX_PAUSE) / 2))


def remap(t):
    shift = 0.0
    for a, b in cuts:
        if t >= b:
            shift += b - a
        elif t > a:
            return a - shift
    return t - shift


if not no_audio:
    keep, cur = [], 0.0
    for a, b in cuts:
        keep.append((cur, a)); cur = b
    keep.append((cur, dur))
    parts = "".join(f"[0:a]atrim={a:.3f}:{b:.3f},asetpts=PTS-STARTPTS,afade=t=in:d=0.01,"
                    f"afade=t=out:st={b - a - 0.01:.3f}:d=0.01[s{i}];" for i, (a, b) in enumerate(keep))
    filt = parts + "".join(f"[s{i}]" for i in range(len(keep))) + \
        f"concat=n={len(keep)}:v=0:a=1,aresample=48000[out]"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", src, "-filter_complex", filt,
                    "-map", "[out]", "-ac", "2", out_wav], check=True)
new_dur = dur - sum(b - a for a, b in cuts)

words = [{"text": w["text"], "start": round(remap(w["startSeconds"]), 3),
          "end": round(remap(w["endSeconds"]), 3)} for w in real]
out, i = [], 0
while i < len(words):
    for seq, rep in MERGE:
        if [x["text"] for x in words[i:i + len(seq)]] == seq:
            out.append({"text": rep, "start": words[i]["start"], "end": words[i + len(seq) - 1]["end"]})
            i += len(seq)
            break
    else:
        out.append(words[i]); i += 1
for w in out:
    w["text"] = w["text"].replace("...", "")

print("cuts:", [(round(a, 2), round(b, 2)) for a, b in cuts], "new duration:", round(new_dur, 2))
print(" ".join(f"{k}:{w['text']}@{w['start']}" for k, w in enumerate(out)))
json.dump({"duration": round(new_dur, 3), "estimated": no_audio, "words": out},
          open(out_json, "w"), indent=1, ensure_ascii=False)
