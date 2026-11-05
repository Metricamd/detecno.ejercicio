// Yolapp reel 8 ("¿Ya activaste tu modo Yoler?") — a two-person dialogue:
// she explains, he asks. Each take is [from, to] in seconds of
// public/yolapp/v8/crudo.mp4 (720×1280), who speaks ("ella"/"el", found by
// pitch: ≈ 230 Hz vs ≈ 130 Hz) and what is said. Same rules as reels 1–7
// (public/yolapp/marca.md): no silences, no retakes, clean mastered voice.
// They look at each other and at the phone on purpose, so the "look at camera"
// rule does not apply here. Take ends checked on the envelope.
export { FPS, GRAD, H, W, Y } from "../yolapp/datos";
import { FPS } from "../yolapp/datos";

export type Who = "ella" | "el";
type Take = { from: number; to: number; who: Who; text: string };
const TAKES: Take[] = [
  {
    from: 2.88,
    to: 4.52,
    who: "ella",
    text: "Oye, ¿tú ya activaste tu modo Yoler?",
  },
  { from: 5.02, to: 5.72, who: "el", text: "¿Modo qué?" },
  {
    from: 6.06,
    to: 9.74,
    who: "ella",
    text: "Tu modo Yoler es la nueva forma de ganar comisiones a través de Yolapp.",
  },
  { from: 10.62, to: 12.2, who: "el", text: "¿Comisiones? ¿A través de ella?" },
  { from: 12.6, to: 14.22, who: "el", text: "Ok, explícame." },
  { from: 14.62, to: 15.46, who: "ella", text: "Súper sencillo." },
  {
    from: 16.13,
    to: 19.5,
    who: "ella",
    text: "Yolapp es la nueva aplicación de causas en México.",
  },
  {
    from: 20.42,
    to: 25.12,
    who: "ella",
    text: "Tú nada más te metes, ves la causa que tenga la opción de monetizar, compartes el link,",
  },
  {
    from: 25.55,
    to: 29.7,
    who: "ella",
    text: "y de las personas que lleguen a donar a partir de tu link, tú te llevas una comisión.",
  },
  {
    from: 30.7,
    to: 33.32,
    who: "el",
    text: "¿Recibir comisiones por compartir links",
  },
  {
    from: 34.22,
    to: 37.55,
    who: "el",
    text: "y ayudar a los demás? Un ganar-ganar.",
  },
  // 40.3–40.55: a stray word over the next line
  {
    from: 38.35,
    to: 40.24,
    who: "el",
    text: "Eso me gusta. Cuéntame más, ¿cómo me registro?",
  },
  {
    from: 40.78,
    to: 43.58,
    who: "ella",
    text: "Súper sencillo: mira, te metes a la aplicación de Yolapp",
  },
  {
    from: 44.27,
    to: 47.1,
    who: "ella",
    text: "y la descargas desde tu tienda de aplicaciones.",
  },
  {
    from: 47.76,
    to: 52.78,
    who: "ella",
    text: "Te registras, activas tu modo Yoler y empiezas a buscar la causa que más conecte contigo.",
  },
  {
    from: 53.19,
    to: 56.5,
    who: "ella",
    text: "¡Ojo! Necesita tener la opción de monetizable.",
  },
  {
    from: 57.24,
    to: 61.62,
    who: "ella",
    text: "Así lo compartes ya en tus redes, con tus amigos, en tus grupos, en donde sea.",
  },
  {
    from: 62.24,
    to: 64.58,
    who: "el",
    text: "¡Qué genial! Quiero ser Yoler, ayúdame a registrarme.",
  },
  { from: 64.68, to: 65.28, who: "ella", text: "¡Claro que sí!" },
  {
    from: 69.4,
    to: 74.9,
    who: "el",
    text: "¡Padrísimo! Empezaré a compartir para ayudar a las causas que encuentre",
  },
  // 75.7–76.4: "mmm"
  {
    from: 76.67,
    to: 77.9,
    who: "el",
    text: "y yo ganar una comisión sobre eso.",
  },
  {
    from: 78.2,
    to: 83.02,
    who: "ella",
    text: "¡Claro que sí! Comienza a ganar comisiones. ¿Y sabes qué es lo más padre? No hay tope.",
  },
  // 86–89: "adiós, goza" and laughs
  { from: 83.55, to: 85.6, who: "el", text: "¡Muchas gracias!" },
];

export type Clip = Take & { i: number; at: number; len: number };
export const CLIPS: Clip[] = (() => {
  let at = 0;
  return TAKES.map((t, i) => {
    const len = Math.round((t.to - t.from) * FPS);
    const c = { ...t, i, at, len };
    at += len;
    return c;
  });
})();
export const SPEECH_END =
  CLIPS[CLIPS.length - 1].at + CLIPS[CLIPS.length - 1].len;
// Outro: hold on public/yolapp/v8/final.jpg (85.55 s) under the logo.
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
    "yoler",
    "comisiones",
    "yolapp",
    "causas",
    "méxico",
    "monetizar",
    "link",
    "comisión",
    "ganarganar",
    "registro",
    "descargas",
    "registras",
    "monetizable",
    "redes",
    "amigos",
    "grupos",
    "tope",
    "padre",
    "sencillo",
  ].map(norm),
);
export const isKeyword = (w: string) => KEYWORDS.has(norm(w));

// Graphic beats on the top band (wall above their heads).
export const GRAPHICS = [
  { id: "modo", from: 0, to: 2 },
  { id: "app", from: 5, to: 6 },
  { id: "flujo", from: 7, to: 8 },
  { id: "ganar", from: 9, to: 10 },
  { id: "pasos", from: 12, to: 14 },
  { id: "monetizable", from: 15, to: 15 },
  { id: "comparte", from: 16, to: 16 },
  { id: "tope", from: 21, to: 21 },
] as const;
export type GraphicId = (typeof GRAPHICS)[number]["id"];
export const graphicSpan = (id: GraphicId) => {
  const g = GRAPHICS.find((x) => x.id === id)!;
  return { start: CLIPS[g.from].at, end: CLIPS[g.to].at + CLIPS[g.to].len };
};
