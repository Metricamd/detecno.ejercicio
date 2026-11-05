// Yolapp reel 6 ("Modo Yoler: gana comisiones") — edit decision list. Each
// take is [from, to] in seconds of public/yolapp/v6/crudo.mp4 (720×1280) plus
// what is said in it. Same rules as reels 1–5 (public/yolapp/marca.md): only
// the good take of each line, no silences, no frames looking away from camera.
// Cut points come from speech islands (−29 dB, 10 dB over this file's noise
// floor); text from Whisper re-run take by take.
export { FPS, GRAD, H, W, Y } from "../yolapp/datos";
import { FPS } from "../yolapp/datos";

// `skip` drops a pause or stumble inside a take.
type Take = { from: number; to: number; text: string; skip?: [number, number] };
const TAKES: Take[] = [
  {
    from: 0.45,
    to: 3.05,
    text: "¿Y si te dijera que estás dejando pasar comisiones",
  },
  { from: 5.41, to: 7.28, text: "por no compartir un simple link?" },
  // 10.3–10.6: looks down mid-sentence
  {
    from: 9.45,
    to: 12.05,
    skip: [10.3, 10.62],
    text: "Sí, en Yolapp puedes convertirte en Yoler.",
  },
  { from: 15.61, to: 16.54, text: "¿Cómo funciona?" },
  { from: 19.87, to: 21.05, text: "Encuentras una causa," },
  { from: 22.95, to: 23.88, text: "compartes su link" },
  {
    from: 27.03,
    to: 30.01,
    text: "y, si alguien hace un donativo a partir de tu link,",
  },
  // 36.0–36.3: closes her eyes and drops her head after "comisión"
  { from: 35.04, to: 36.02, text: "recibes una comisión." },
  {
    from: 39.23,
    to: 43.31,
    text: "Ojo: la causa tiene que tener activada la opción de monetizar.",
  },
  // 47.7–49.4: "Así que, ¡deja de compartir!" (restarted); 53.2: a lone "de"
  { from: 50.0, to: 52.38, text: "Así que deja de compartir links gratis" },
  { from: 53.93, to: 55.37, text: "y activa tu modo Yoler." },
  { from: 56.98, to: 58.91, text: "Súper fácil: descarga Yolapp," },
  {
    from: 59.6,
    to: 64.03,
    text: "regístrate, activa tu modo Yoler y comienza a compartir la causa que más conecte contigo.",
  },
];

export type Clip = Take & { i: number; at: number; len: number };
export const CLIPS: Clip[] = (() => {
  let at = 0;
  return TAKES.map((t, i) => {
    const skipped = t.skip ? t.skip[1] - t.skip[0] : 0;
    const len = Math.round((t.to - t.from - skipped) * FPS);
    const c = { ...t, i, at, len };
    at += len;
    return c;
  });
})();
export const SPEECH_END =
  CLIPS[CLIPS.length - 1].at + CLIPS[CLIPS.length - 1].len;
// Outro: hold on public/yolapp/v6/final.jpg (64.0 s) under the logo.
export const OUTRO = 60;
export const TOTAL = SPEECH_END + OUTRO;

export const clipAt = (i: number, s = 0) => CLIPS[i].at + Math.round(s * FPS);

// Word timings: spread each take's words over its spoken part by length.
export type Word = { text: string; start: number; end: number; clip: number };
export const WORDS: Word[] = CLIPS.flatMap((c) => {
  const words = c.text.split(" ");
  const lead = 0.06 * FPS;
  const span = c.len - lead - 0.1 * FPS;
  const weight = (w: string) => w.replace(/[^\p{L}\p{N}]/gu, "").length + 1.5;
  const total = words.reduce((a, w) => a + weight(w), 0);
  let t = c.at + lead;
  return words.map((w) => {
    const d = (weight(w) / total) * span;
    const word = { text: w, start: t, end: t + d, clip: c.i };
    t += d;
    return word;
  });
});

const norm = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[^\p{L}\p{N}]/gu, "")
    .toLowerCase();
export const wordAt = (i: number, word: string, n = 0) => {
  const hits = WORDS.filter((w) => w.clip === i && norm(w.text) === norm(word));
  const hit = hits[n] ?? hits[0];
  if (!hit) throw new Error(`"${word}" not in take ${i}`);
  return Math.round(hit.start);
};

// Every "Yolapp" said: the gradient logo pops in there.
export const YOLAPP_AT = WORDS.filter((w) => norm(w.text) === "yolapp").map(
  (w) => Math.round(w.start),
);

export const KEYWORDS = new Set(
  [
    "comisiones",
    "link",
    "yolapp",
    "yoler",
    "funciona",
    "causa",
    "compartes",
    "donativo",
    "comisión",
    "ojo",
    "monetizar",
    "gratis",
    "modo",
    "fácil",
    "descarga",
    "regístrate",
    "activa",
    "compartir",
    "conecte",
  ].map(norm),
);
export const isKeyword = (w: string) => KEYWORDS.has(norm(w));

// Graphic beats on the lower band, from take `from` through take `to`.
export const GRAPHICS = [
  { id: "link", from: 0, to: 1 },
  { id: "pasos", from: 4, to: 7 },
  { id: "monetizar", from: 8, to: 8 },
  { id: "app", from: 12, to: 12 },
] as const;
export type GraphicId = (typeof GRAPHICS)[number]["id"];
export const graphicSpan = (id: GraphicId) => {
  const g = GRAPHICS.find((x) => x.id === id)!;
  return { start: CLIPS[g.from].at, end: CLIPS[g.to].at + CLIPS[g.to].len };
};
