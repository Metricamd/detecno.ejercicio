// Yolapp reel 3 ("Conviértete en Yoler") — edit decision list. Each take is
// [from, to] in seconds of public/yolapp/v3/crudo.mp4 plus what is said in it.
// Same rules as reels 1–2 (public/yolapp/marca.md): only the good take of each
// line, no silences. Cut points come from speech islands (−33 dB, 10 dB over
// this file's noise floor); text from Whisper re-run take by take
// (scripts/transcribe_segments.mjs).
export { FPS, GRAD, H, W, Y } from "../yolapp/datos";
import { FPS } from "../yolapp/datos";

// `skip` drops a pause or stumble inside a take; `tail` keeps that many
// seconds of silent footage at the end of a take (no captions, no card).
type Take = { from: number; to: number; text: string; skip?: [number, number]; tail?: number };
const TAKES: Take[] = [
  { from: 0.84, to: 5.65, text: "¿Y si te dijera que puedes ganarte una lanita compartiendo publicaciones en redes sociales? ¿Lo harías?" },
  { from: 8.22, to: 9.9, text: "Pues en Yolapp es posible." },
  { from: 11.82, to: 18.35, text: "Te cuento: hay un montón de personas que ahorita, lamentablemente, necesitan ayuda y están subiendo muchísimas causas en Yolapp." },
  // 20.2–21.6: "para perritos, para manuten…" (said again right after)
  { from: 18.5, to: 20.18, text: "Hay personas que necesitan ayuda" },
  { from: 22.48, to: 28.44, text: "para perritos, para comida, para circunstancias hospitalarias," },
  { from: 28.93, to: 31.49, text: "para muchísimas, muchísimas cosas." },
  // 35.4–40.7: "¿Y tú qué puedes hacer? Si no puedes donarles algún…" (restarted)
  { from: 43.24, to: 44.45, text: "¿Y tú qué puedes hacer?" },
  { from: 46.48, to: 48.99, text: "Muy fácil: simplemente convertirte en Yoler." },
  // 51.0–52.2: "lo único que es…" (restarted)
  { from: 56.19, to: 59.31, text: "Y en muy pocos pasos. Número uno:" },
  { from: 60.73, to: 63.36, text: "comparte la causa de Yolapp que más te interesa" },
  { from: 65.74, to: 68.77, text: "con tus amigos, en redes sociales, en tus grupos." },
  // 77.2–78.0: "por los honet…" (restarted)
  { from: 70.89, to: 72.03, text: "Y puedes ganar" },
  { from: 79.33, to: 81.15, text: "por los donativos que ayudes a generar." },
  // 85.3–85.9 and 94.7–95.3: lone "y"
  { from: 83.32, to: 84.89, text: "Sí, puedes ganar" },
  { from: 87.14, to: 89.24, text: "mientras ayudas a otras personas," },
  { from: 91.33, to: 94.0, text: "y esas personas pueden recibir su apoyo." },
  { from: 96.37, to: 99.08, text: "Así que deja de compartir por compartir" },
  { from: 103.34, to: 105.9, text: "y mejor comparte causas que pueden hacer la diferencia." },
  { from: 110.06, to: 110.9, text: "Entra a Yolapp" },
  { from: 111.36, to: 113.74, text: "y comienza a compartir las causas que conecten contigo." },
];

// Takes placed on the reel timeline (frames).
// `speech` is the spoken part (len minus the silent tail).
export type Clip = Take & { i: number; at: number; len: number; speech: number };
export const CLIPS: Clip[] = (() => {
  let at = 0;
  return TAKES.map((t, i) => {
    const skipped = t.skip ? t.skip[1] - t.skip[0] : 0;
    const len = Math.round((t.to - t.from - skipped) * FPS);
    const c = { ...t, i, at, len, speech: len - Math.round((t.tail ?? 0) * FPS) };
    at += len;
    return c;
  });
})();
export const SPEECH_END = CLIPS[CLIPS.length - 1].at + CLIPS[CLIPS.length - 1].len;
// Outro: hold on public/yolapp/v3/final.jpg under the logo (after 113.9 s the
// raw file cuts to a wider shot).
export const OUTRO = 60;
export const TAIL_END = 113.85;
export const TOTAL = SPEECH_END + OUTRO;

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
const norm = (s: string) => s.normalize("NFD").replace(/[^\p{L}\p{N}]/gu, "").toLowerCase();
export const wordAt = (i: number, word: string, n = 0) => {
  const hits = WORDS.filter((w) => w.clip === i && norm(w.text) === norm(word));
  const hit = hits[n] ?? hits[0];
  if (!hit) throw new Error(`"${word}" not in take ${i}`);
  return Math.round(hit.start);
};

// Words drawn in turquoise when they are not the one being said.
export const KEYWORDS = new Set(
  [
    "lanita", "compartiendo", "publicaciones", "redes", "posible", "yolapp", "ayuda", "causas", "perritos",
    "comida", "hospitalarias", "muchísimas", "yoler", "fácil", "pasos", "uno", "comparte", "causa", "interesa",
    "amigos", "grupos", "ganar", "donativos", "ayudas", "apoyo", "compartir", "diferencia", "conecten",
  ].map(norm),
);
export const isKeyword = (w: string) => KEYWORDS.has(norm(w));

// Graphic beats: a brand card sits on the lower band (below the chin) and the
// captions move above the head, from take `from` through take `to`.
export const GRAPHICS = [
  { id: "lanita", from: 0, to: 0 },
  { id: "logo", from: 1, to: 1 },
  { id: "causas", from: 3, to: 5 },
  { id: "yoler", from: 7, to: 7 },
  { id: "paso", from: 9, to: 10 },
  { id: "flujo", from: 11, to: 15 },
  { id: "app", from: 18, to: 19 },
] as const;
export type GraphicId = (typeof GRAPHICS)[number]["id"];
export const graphicSpan = (id: GraphicId) => {
  const g = GRAPHICS.find((x) => x.id === id)!;
  return { start: CLIPS[g.from].at, end: CLIPS[g.to].at + CLIPS[g.to].speech };
};
