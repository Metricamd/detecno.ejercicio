// Yolapp reel 5 ("Déjate cuidar") — emotional cut. Each take is [from, to] in
// seconds of public/yolapp/v5/crudo.mp4 plus what is said in it. Same rules as
// reels 1–4 (public/yolapp/marca.md): only the good take of each line, no
// silences, no frames where she looks away. Cut points come from speech
// islands (−34 dB, 10 dB over this file's noise floor); text from Whisper
// re-run take by take (scripts/transcribe_segments.mjs).
export { FPS, H, W } from "../yolapp/datos";
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
    from: 0.93,
    to: 7.45,
    text: "No sé quién conecte con esto, pero hay algo profundamente humano y, al mismo tiempo, profundamente incómodo en necesitar a alguien.",
  },
  {
    from: 12.12,
    to: 15.62,
    text: "Porque es fácil para nosotros estar con las personas que queremos,",
  },
  {
    from: 20.54,
    to: 23.01,
    text: "escucharlas, sostenerlas cuando ya no pueden más.",
  },
  // 27.4–27.9: a lone "y"
  {
    from: 28.73,
    to: 31.97,
    text: "Pero qué difícil es permitir que hagan lo mismo por nosotros.",
  },
  {
    from: 37.72,
    to: 41.82,
    text: "Hace poco, una persona muy importante para mí me dijo algo que se me quedó grabado:",
  },
  // 46.4–48.4: "Cuando te sientas mal por apoyarte" (restarted); 52.6–53.3: "recuerda" (said again)
  {
    from: 50.48,
    to: 52.45,
    text: "«Cuando te sientas mal por apoyarte en mí,",
  },
  {
    from: 61.32,
    to: 64.2,
    text: "recuerda lo bien que me hace sentir cuando tú te apoyas en mí».",
  },
  { from: 71.21, to: 72.49, text: "Y tenía toda la razón," },
  {
    from: 77.09,
    to: 79.25,
    text: "porque a mí también me cuesta muchísimo pedir ayuda.",
  },
  {
    from: 84.03,
    to: 87.93,
    text: "Pero cuando mis amigos se acercan a mí a contarme algo que les duele,",
  },
  { from: 91.4, to: 93.19, text: "yo nunca pienso que son una carga." },
  {
    from: 97.6,
    to: 99.99,
    text: "Al contrario, lo vivo como acto de intimidad,",
  },
  {
    from: 102.9,
    to: 105.72,
    text: "de confianza y de saber que soy un lugar seguro para ellos.",
  },
  // 113.8–114.9: "aceptar…" (corrected to "permitirme")
  {
    from: 111.82,
    to: 115.73,
    skip: [113.8, 114.86],
    text: "Entonces, ¿por qué me cuesta tanto permitirme",
  },
  { from: 117.89, to: 119.18, text: "ser eso para alguien más?" },
  // 122.8–124.6: "Creo que muchas veces valoramos" (restarted); 132.3–133.1: "de cuidar" (said again)
  {
    from: 129.21,
    to: 132.0,
    text: "Creo que muchas veces valoramos tanto nuestra capacidad",
  },
  { from: 134.78, to: 135.99, text: "de cuidar a los demás," },
  {
    from: 139.73,
    to: 142.16,
    text: "que olvidamos nuestro propio derecho de ser cuidados.",
  },
  // 145.0–146.9: "Y había algo todavía más profundo" (restarted)
  {
    from: 152.28,
    to: 155.53,
    text: "Y hay algo todavía más profundo: cuando no dejamos que alguien nos ayude,",
  },
  { from: 157.36, to: 159.23, text: "cuando decidimos que nuestro dolor" },
  { from: 161.2, to: 162.97, text: "es demasiado para compartirlo," },
  {
    from: 167.46,
    to: 170.36,
    text: "de alguna manera estamos decidiendo por esa persona.",
  },
  {
    from: 174.23,
    to: 177.45,
    text: "Estamos asumiendo que no puede o que no quiere ayudarnos,",
  },
  { from: 179.25, to: 181.24, text: "porque no sería capaz de acompañarnos." },
  {
    from: 186.67,
    to: 189.71,
    text: "Y la verdad es que esa decisión le pertenece al otro.",
  },
  {
    from: 201.49,
    to: 207.47,
    text: "Así que, si eres esa persona que siempre está escuchando a las personas, está ayudando, está poniendo su brazo,",
  },
  { from: 207.9, to: 209.0, text: "te tengo que decir algo:" },
  // 214.25–214.65: shorter pause after "permítete"
  {
    from: 213.4,
    to: 216.42,
    skip: [214.25, 214.65],
    text: "permítete ser el lugar seguro de alguien,",
  },
  {
    from: 222.06,
    to: 225.05,
    text: "pero también permite que ese alguien sea el tuyo.",
  },
  // 233.2–235.9: "…es una forma de crecer" (she keeps only the "querer" line)
  {
    from: 238.91,
    to: 241.6,
    text: "A veces, dejarte cuidar también es una forma de querer.",
  },
  {
    from: 246.45,
    to: 249.14,
    text: "Así que la próxima vez que alguien ofrezca su mano,",
  },
  {
    from: 254.36,
    to: 256.79,
    text: "intenta no apartarla por miedo a ser una carga.",
  },
  // after 269.5 s she reaches for the camera
  {
    from: 263.26,
    to: 269.31,
    text: "Quizá esa persona necesita sentir que está para ti, así como cuando tú estás para ella.",
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
// public/yolapp/v5/final.jpg under the logo. Longer than the other reels so
// the music can breathe.
export const OUTRO = 105;
export const TAIL_END = 269.45;
export const TOTAL = SPEECH_END + OUTRO;

// Reel frame for a time in the raw file (inside a kept take).
export const srcFrame = (t: number) => {
  const c = CLIPS.find((x) => t >= x.from - 0.05 && t <= x.to + 0.05);
  if (!c) throw new Error(`${t}s is not in a kept take`);
  let s = Math.max(t, c.from) - c.from;
  if (c.skip && t >= c.skip[1]) s -= c.skip[1] - c.skip[0];
  return c.at + Math.round(s * FPS);
};

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

// Words drawn in soft pink when they are not the one being said.
export const KEYWORDS = new Set(
  [
    "humano",
    "incómodo",
    "necesitar",
    "queremos",
    "escucharlas",
    "sostenerlas",
    "permitir",
    "grabado",
    "apoyarte",
    "apoyas",
    "razón",
    "ayuda",
    "duele",
    "carga",
    "intimidad",
    "confianza",
    "seguro",
    "permitirme",
    "cuidar",
    "cuidados",
    "profundo",
    "dolor",
    "compartirlo",
    "decidiendo",
    "ayudarnos",
    "acompañarnos",
    "decisión",
    "pertenece",
    "permítete",
    "tuyo",
    "crecer",
    "querer",
    "mano",
    "miedo",
    "ti",
    "ella",
  ].map(norm),
);
export const isKeyword = (w: string) => KEYWORDS.has(norm(w));

// Graphic beats: a soft glass card sits on the lower third (below the chin)
// and the captions move above the head, from take `from` through take `to`.
export const GRAPHICS = [
  { id: "dar", from: 1, to: 2 },
  { id: "cita", from: 5, to: 6 },
  { id: "carga", from: 10, to: 12 },
  { id: "balanza", from: 15, to: 17 },
  { id: "decision", from: 21, to: 24 },
  { id: "lugar", from: 27, to: 28 },
  { id: "mano", from: 30, to: 31 },
] as const;
export type GraphicId = (typeof GRAPHICS)[number]["id"];
export const graphicSpan = (id: GraphicId) => {
  const g = GRAPHICS.find((x) => x.id === id)!;
  return { start: CLIPS[g.from].at, end: CLIPS[g.to].at + CLIPS[g.to].speech };
};

// Warm palette for the emotional cut (brand colours, softened).
export const E = {
  white: "#FFFFFF",
  cream: "#FFF4EC",
  blush: "#FFB3CF",
  peach: "#FFD2B8",
  rose: "#FF5C8A",
  plum: "#5B2A86",
  ink: "#2A1A3E",
};
export const EGRAD = {
  warm: "linear-gradient(135deg, rgba(255,92,138,.85), rgba(125,14,213,.75))",
  dusk: "linear-gradient(160deg, rgba(255,74,58,.7), rgba(255,5,102,.65) 45%, rgba(91,42,134,.75))",
  dawn: "linear-gradient(160deg, rgba(255,184,0,.55), rgba(255,92,138,.65) 55%, rgba(91,42,134,.7))",
  heart: "linear-gradient(135deg, #FF8FB1, #FF0566)",
};
