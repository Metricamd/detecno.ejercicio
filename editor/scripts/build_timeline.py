"""Trim long pauses in the voice-over and write src/fispal/timeline.ts.

Usage: python3 scripts/build_timeline.py <voice.mp3> <magnific_words.json>
Pauses longer than MAX_PAUSE are shortened (middle part removed); word
timings from the TTS alignment are remapped onto the trimmed audio.
"""
import json, re, subprocess, sys

MAX_PAUSE = 0.6
src, words_json = sys.argv[1], sys.argv[2]

log = subprocess.run(
    ["ffmpeg", "-i", src, "-af", "silencedetect=n=-40dB:d=0.2", "-f", "null", "-"],
    capture_output=True, text=True).stderr
starts = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", log)]
ends = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", log)]
cuts = []  # (from, to) removed from the source
for a, b in zip(starts, ends):
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

# Keep segments -> ffmpeg filter
dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                            "-of", "csv=p=0", src], capture_output=True, text=True).stdout)
keep, cur = [], 0.0
for a, b in cuts:
    keep.append((cur, a)); cur = b
keep.append((cur, dur))
parts = "".join(f"[0:a]atrim={a:.3f}:{b:.3f},asetpts=PTS-STARTPTS,afade=t=in:d=0.01,afade=t=out:st={b-a-0.01:.3f}:d=0.01[s{i}];"
                for i, (a, b) in enumerate(keep))
filt = parts + "".join(f"[s{i}]" for i in range(len(keep))) + f"concat=n={len(keep)}:v=0:a=1,aresample=48000[out]"
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", src, "-filter_complex", filt, "-map", "[out]",
                "-ac", "2", "public/audio/voz.wav"], check=True)
new_dur = dur - sum(b - a for a, b in cuts)

# Words: drop [tags], merge phonetic spellings back into written form.
raw = [w for w in json.load(open(words_json))["words"]]
words, skip = [], False
for w in raw:
    t = w["text"]
    if t.startswith("[") or skip:
        skip = not t.endswith("]")
        continue
    words.append({"text": t, "start": round(remap(w["startSeconds"]), 3),
                  "end": round(remap(w["endSeconds"]), 3)})

MERGE = [(["ce", "efe", "de", "i,"], "CFDI,"), (["erre", "efe", "ce"], "RFC"),
         (["A", "P", "I."], "API."), (["veinte", "por", "ciento"], "20%"),
         (["fispal", "punto", "em", "equis."], "fispal.mx")]
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
json.dump({"duration": round(new_dur, 3), "words": out}, open("src/fispal/voice-timeline.json", "w"), indent=1, ensure_ascii=False)
