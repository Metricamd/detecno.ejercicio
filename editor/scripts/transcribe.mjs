// Transcribe a 16 kHz mono WAV with Whisper (local ONNX model) and write
// word-level captions in Remotion's Caption format.
// Usage: node scripts/transcribe.mjs <audio16k.wav> <out.json> [language]
import { pipeline, env } from "@huggingface/transformers";
import wavefile from "wavefile";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const [, , input, output, language = "spanish"] = process.argv;

env.localModelPath = path.resolve("models");
env.allowRemoteModels = false;

const wav = new wavefile.WaveFile(readFileSync(input));
wav.toBitDepth("32f");
wav.toSampleRate(16000);
let samples = wav.getSamples();
if (Array.isArray(samples)) samples = samples[0];

const asr = await pipeline(
  "automatic-speech-recognition",
  "Xenova/whisper-small",
  { dtype: "q8" },
);

const result = await asr(samples, {
  language,
  task: "transcribe",
  return_timestamps: "word",
  chunk_length_s: 30,
  stride_length_s: 5,
});

const captions = result.chunks.map((c) => ({
  text: " " + c.text.trim(),
  startMs: Math.round(c.timestamp[0] * 1000),
  endMs: Math.round((c.timestamp[1] ?? c.timestamp[0] + 0.3) * 1000),
  timestampMs: Math.round(c.timestamp[0] * 1000),
  confidence: null,
}));

writeFileSync(output, JSON.stringify(captions, null, 2));
console.log(result.text);
console.log(`${captions.length} words -> ${output}`);
