// Transcribe many [start, end] segments of one 16 kHz mono WAV with a single
// Whisper load. Used to read each take on its own when picking good takes.
// Usage: node scripts/transcribe_segments.mjs <audio16k.wav> <segments.json> <out.json> [language]
// segments.json: [[startSec, endSec], ...]
import { pipeline, env } from "@huggingface/transformers";
import wavefile from "wavefile";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const [, , input, segFile, output, language = "spanish"] = process.argv;

env.localModelPath = path.resolve("models");
env.allowRemoteModels = false;

const wav = new wavefile.WaveFile(readFileSync(input));
wav.toBitDepth("32f");
wav.toSampleRate(16000);
let samples = wav.getSamples();
if (Array.isArray(samples)) samples = samples[0];

const asr = await pipeline("automatic-speech-recognition", "Xenova/whisper-small", { dtype: "q8" });

const out = [];
for (const [a, b] of JSON.parse(readFileSync(segFile, "utf8"))) {
  // half a second of silence on each side helps Whisper with short takes
  const pad = new Float32Array(8000);
  const clip = samples.slice(Math.floor(a * 16000), Math.ceil(b * 16000));
  const buf = new Float32Array(pad.length * 2 + clip.length);
  buf.set(clip, pad.length);
  const r = await asr(buf, { language, task: "transcribe" });
  out.push({ start: a, end: b, text: r.text.trim() });
  console.log(`${a.toFixed(2)}-${b.toFixed(2)}  ${r.text.trim()}`);
}
writeFileSync(output, JSON.stringify(out, null, 2));
