// Yolapp reel 7 ("¿Ganar comisiones por compartir un link?") — edit decision
// list. Each take is [from, to] in seconds of public/yolapp/v7/crudo.mp4
// (720×1280) plus what is said in it. Same rules as reels 1–6
// (public/yolapp/marca.md): only the good take of each line, no silences, no
// frames looking away. Cut points come from speech islands (−31 dB, 10 dB over
// this file's noise floor) and each take end was checked on the envelope so no
// syllable gets clipped. Text from Whisper re-run take by take.
export { FPS, GRAD, H, W, Y } from "../yolapp/datos";
import { FPS } from "../yolapp/datos";

// `skip` drops a pause inside a take.
type Take = { from: number; to: number; text: string; skip?: [number, number] };
const TAKES: Take[] = [
  // 1.0–1.3: pause after "¿Qué?"
  {
    from: 0.62,
    to: 5.66,
    skip: [1.0, 1.3],
    text: "¿Qué? ¿Me estás diciendo que puedo ganar comisiones por solamente compartir un link?",
  },
  { from: 6.93, to: 9.11, text: "Pues así es, y te voy a explicar cómo." },
  { from: 15.75, to: 18.23, text: "En Yolapp puedes activar tu modo Yoler." },
  {
    from: 18.58,
    to: 21.8,
    text: "Elige una causa que tenga la opción de monetizable",
  },
  {
    from: 22.94,
    to: 27.1,
    text: "y comienza a compartirla con tus amigos, con tus familiares o en tus redes sociales.",
  },
  { from: 28.22, to: 30.29, text: "¿Alguien dona a través de tu enlace?" },
  // 35.16–35.36: pause between "y esa" and "es tu comisión"
  {
    from: 31.7,
    to: 36.08,
    skip: [35.16, 35.36],
    text: "Pues ya está: ya ganaste un porcentaje de ese donativo, y esa es tu comisión.",
  },
  {
    from: 37.37,
    to: 41.37,
    text: "Así de fácil: tú compartes, alguien apoya y tú recibes la comisión.",
  },
  { from: 42.17, to: 44.18, text: "¿Qué esperas para activar tu modo Yoler?" },
  {
    from: 44.48,
    to: 50.96,
    text: "Súper sencillo: descarga la aplicación de Yolapp, regístrate activando tu modo Yoler y comienza a compartir los links.",
  },
  { from: 51.35, to: 53.03, text: "No hay tope de comisión." },
  {
    from: 54.48,
    to: 57.0,
    text: "No dejes pasar esta oportunidad para ganar.",
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
// Outro: hold on public/yolapp/v7/final.jpg (56.95 s) under the logo.
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
    "causa",
    "monetizable",
    "amigos",
    "familiares",
    "redes",
    "dona",
    "enlace",
    "porcentaje",
    "donativo",
    "comisión",
    "fácil",
    "compartes",
    "apoya",
    "recibes",
    "sencillo",
    "descarga",
    "regístrate",
    "tope",
    "oportunidad",
    "ganar",
  ].map(norm),
);
export const isKeyword = (w: string) => KEYWORDS.has(norm(w));

// Graphic beats on the chest band, from take `from` through take `to`.
export const GRAPHICS = [
  { id: "ganar", from: 0, to: 0 },
  { id: "modo", from: 2, to: 2 },
  { id: "elige", from: 3, to: 4 },
  { id: "porcentaje", from: 5, to: 6 },
  { id: "ciclo", from: 7, to: 7 },
  { id: "app", from: 9, to: 9 },
  { id: "tope", from: 10, to: 10 },
] as const;
export type GraphicId = (typeof GRAPHICS)[number]["id"];
export const graphicSpan = (id: GraphicId) => {
  const g = GRAPHICS.find((x) => x.id === id)!;
  return { start: CLIPS[g.from].at, end: CLIPS[g.to].at + CLIPS[g.to].len };
};
