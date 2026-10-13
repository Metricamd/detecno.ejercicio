// Bling (fictional brand) — colours, timings and helpers for the reel.
import { VOZ_WORDS } from "./voz";

export const FPS = 30;
export const W = 1080;
export const H = 1920;
export const SAFE = { top: 250, bottom: H - 350, side: 70 };

export const B = {
  coral: "#FF5A36",
  coralDark: "#E0401E",
  sun: "#FFC93C",
  ink: "#1E1B4B",
  cream: "#FFF6EC",
  mint: "#22C55E",
  sky: "#5BC0FF",
  white: "#FFFFFF",
};

export const VOICE_AT = 0.3;
export const sec = (s: number) => Math.round(s * FPS);

// Scene boundaries (reel seconds), cut on the voice-over phrases.
export const SCENE = { s1: 0, s2: 5.6, s3: 13.7, s4: 24.6, end: 30 };
export const TOTAL = sec(SCENE.end);

// Reel second at which the n-th occurrence of a word is spoken.
export const wordAt = (w: string, nth = 0) => {
  const norm = (x: string) => x.toLowerCase().replace(/[¡!¿?,.]/g, "");
  const hits = VOZ_WORDS.filter(([t]) => norm(t) === norm(w));
  return (hits[nth] ?? hits[0])[1] + VOICE_AT;
};
