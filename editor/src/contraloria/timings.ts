// "Contraloría" reel timings. The voice starts at VOICE_AT seconds; every
// scene starts just before its phrase, so cuts follow the voice-over.
import { VOZ_WORDS } from "./voz";

export const FPS = 30;
export const VOICE_AT = 0.5;
export const OVERLAP = 12; // transition frames

// Reel-time seconds of a word (n-th occurrence of `text` in the script).
export const wordAt = (text: string, nth = 0) => {
  const hits = VOZ_WORDS.filter(([t]) => t.toLowerCase().replace(/[¿?,.]/g, "") === text.toLowerCase());
  return (hits[nth] ?? hits[0])[1] + VOICE_AT;
};

// Scene start times (reel seconds) and the phrase each one shows.
export const SCENE_AT = {
  hook: 0,
  recibe: 5.6,
  visibilidad: 12.0,
  trazabilidad: 18.6,
  historial: 22.0,
  auditoria: 25.5,
  cta: 29.2,
  end: 33.5,
};

export const sec = (s: number) => Math.round(s * FPS);
export const TOTAL_FRAMES = sec(SCENE_AT.end);

// Words of the script between two reel times, for the synced headline.
export const wordsBetween = (from: number, to: number) =>
  VOZ_WORDS.filter(([, s]) => s + VOICE_AT >= from && s + VOICE_AT < to).map(([t, s]) => ({ text: t, at: s + VOICE_AT }));
