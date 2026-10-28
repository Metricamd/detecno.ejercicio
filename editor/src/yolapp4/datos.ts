// Yolapp reel 4 ("No cometas este error") — edit decision list. Each take is
// [from, to] in seconds of public/yolapp/v4/crudo.mp4 plus what is said in it.
// Same rules as reels 1–3 (public/yolapp/marca.md): only the good take of each
// line, no silences, no frames where she looks away. Cut points come from
// speech islands (−34 dB, 10 dB over this file's noise floor); text from
// Whisper re-run take by take (scripts/transcribe_segments.mjs).
export { FPS, GRAD, H, W, Y } from "../yolapp/datos";
import { FPS } from "../yolapp/datos";

// `skip` drops a pause or stumble inside a take; `tail` keeps that many
// seconds of silent footage at the end of a take (no captions, no card).
type Take = {
  from: number;
  to: number;
  text: string;
  skip?: [number, number];
  tail?: number;
};
const TAKES: Take[] = [
  {
    from: 0.56,
    to: 4.39,
    text: "¿Necesitas dinero y ya creaste tu causa en Yolapp? Entonces no cometas este error:",
  },
  { from: 7.57, to: 9.72, text: "crear tu causa es solo el primer paso." },
  {
    from: 15.07,
    to: 18.05,
    text: "Si nadie conoce tu historia, ¿cómo van a saber que necesitas ayuda?",
  },
  { from: 20.65, to: 22.35, text: "Aquí viene lo importante:" },
  {
    from: 26.24,
    to: 31.61,
    text: "copia el link de tu causa y compártelo por Facebook, por WhatsApp, por todas tus redes sociales,",
  },
  { from: 32.49, to: 34.52, text: "por tus grupos, por donde quieras." },
  { from: 39.3, to: 41.4, text: "Cuantas más personas conozcan tu causa," },
  {
    from: 45.41,
    to: 48.27,
    text: "más oportunidades tendrás de recibir donativos",
  },
  { from: 50.94, to: 52.01, text: "y encontrar apoyo." },
  {
    from: 55.94,
    to: 58.04,
    text: "No te quedes esperando a que estos lleguen solos.",
  },
  // 63.8–64.1: pause after "súper fácil"
  {
    from: 63.05,
    to: 64.92,
    skip: [63.8, 64.1],
    text: "Súper fácil: copia tu link,",
  },
  { from: 66.69, to: 68.48, text: "compártelo hoy mismo" },
  {
    from: 70.83,
    to: 72.92,
    text: "y haz que tu causa llegue mucho más lejos.",
  },
  // 76.9–81.9: "Porque alguien querría… / Porque alguien quería…" (restarted twice)
  // 86.27–86.43: pause after "ayudarte"
  {
    from: 84.12,
    to: 88.36,
    skip: [86.27, 86.43],
    text: "Porque alguien podría querer ayudarte, pero primero tiene que conocer tu causa.",
  },
  // after 97.6 s the raw file cuts to a wider shot
  {
    from: 94.41,
    to: 97.35,
    text: "Ingresa a Yolapp, copia tu link y comienza a recibir más donativos.",
  },
];

// Takes placed on the reel timeline (frames).
// `speech` is the spoken part (len minus the silent tail).
export type Clip = Take & {
  i: number;
  at: number;
  len: number;
  speech: number;
};
export const CLIPS: Clip[] = (() => {
  let at = 0;
  return TAKES.map((t, i) => {
    const skipped = t.skip ? t.skip[1] - t.skip[0] : 0;
    const len = Math.round((t.to - t.from - skipped) * FPS);
    const c = {
      ...t,
      i,
      at,
      len,
      speech: len - Math.round((t.tail ?? 0) * FPS),
    };
    at += len;
    return c;
  });
})();
export const SPEECH_END =
  CLIPS[CLIPS.length - 1].at + CLIPS[CLIPS.length - 1].len;
// Outro: the footage runs on to TAIL_END, then holds on
// public/yolapp/v4/final.jpg under the logo.
export const OUTRO = 60;
export const TAIL_END = 97.45;
export const TOTAL = SPEECH_END + OUTRO;

// Reel frame for a time in the raw file (inside a kept take).
export const srcFrame = (t: number) => {
  const c = CLIPS.find((x) => t >= x.from - 0.05 && t <= x.to + 0.05);
  if (!c) throw new Error(`${t}s is not in a kept take`);
  let s = Math.max(t, c.from) - c.from;
  if (c.skip && t >= c.skip[1]) s -= c.skip[1] - c.skip[0];
  return c.at + Math.round(s * FPS);
};

// Full-screen cutaways (raw-file seconds) over the moments where she looks
// away mid-sentence: the audio keeps playing underneath.
export const CUTAWAYS = [{ id: "importante", from: 21.85, to: 22.35 }] as const;

// First frame of take i, plus an offset in seconds.
export const clipAt = (i: number, s = 0) => CLIPS[i].at + Math.round(s * FPS);

// Word timings: spread each take's words over its spoken part by length.
export type Word = { text: string; start: number; end: number; clip: number };
export const WORDS: Word[] = CLIPS.flatMap((c) => {
  const words = c.text.split(" ");
  const lead = 0.06 * FPS;
  const tail = 0.1 * FPS;
  const span = c.speech - lead - tail;
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

// Frame where the n-th occurrence of a word (accents/punctuation ignored)
// starts inside take i.
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

// Words drawn in turquoise when they are not the one being said.
export const KEYWORDS = new Set(
  [
    "dinero",
    "causa",
    "yolapp",
    "error",
    "primer",
    "paso",
    "nadie",
    "historia",
    "ayuda",
    "importante",
    "link",
    "compártelo",
    "facebook",
    "whatsapp",
    "redes",
    "grupos",
    "personas",
    "oportunidades",
    "donativos",
    "apoyo",
    "esperando",
    "solos",
    "fácil",
    "copia",
    "hoy",
    "lejos",
    "ayudarte",
    "conocer",
    "ingresa",
    "recibir",
  ].map(norm),
);
export const isKeyword = (w: string) => KEYWORDS.has(norm(w));

// Graphic beats: a brand card sits on the lower third (below the chin) and the
// captions move above the head, from take `from` through take `to`.
export const GRAPHICS = [
  { id: "paso", from: 1, to: 1 },
  { id: "nadie", from: 2, to: 2 },
  { id: "comparte", from: 4, to: 5 },
  { id: "mas", from: 6, to: 8 },
  { id: "app", from: 10, to: 12 },
  { id: "final", from: 14, to: 14 },
] as const;
export type GraphicId = (typeof GRAPHICS)[number]["id"];
export const graphicSpan = (id: GraphicId) => {
  const g = GRAPHICS.find((x) => x.id === id)!;
  return { start: CLIPS[g.from].at, end: CLIPS[g.to].at + CLIPS[g.to].speech };
};
