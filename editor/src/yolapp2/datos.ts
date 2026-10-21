// Yolapp reel 2 ("3 recomendaciones") — edit decision list. Each take is
// [from, to] in seconds of public/yolapp/v2/crudo.mp4 plus what is said in it.
// Same rules as reel 1 (public/yolapp/marca.md): only the good take of each
// line, no silences. Cut points come from speech islands (−32 dB, i.e. 10 dB
// over this file's noise floor); text from Whisper re-run take by take
// (scripts/transcribe_segments.mjs).
export { FPS, GRAD, H, W, Y } from "../yolapp/datos";
import { FPS } from "../yolapp/datos";

// `skip` drops a pause or stumble inside a take; `tail` keeps that many
// seconds of silent footage at the end of a take (no captions, no card).
type Take = { from: number; to: number; text: string; skip?: [number, number]; tail?: number };
const TAKES: Take[] = [
  // 0.6–1.6: "¿Sabes que puedes recibir…" (restarted)
  { from: 4.96, to: 9.25, text: "¿Sabes que puedes conseguir apoyo para tus gastos médicos gracias a una comunidad" },
  { from: 12.15, to: 13.54, text: "de personas que quieren ayudar?" },
  { from: 14.9, to: 16.29, text: "Pues eso es Yolapp:" },
  { from: 20.24, to: 21.97, text: "una red social de causas" },
  { from: 24.61, to: 26.24, text: "donde puedes contar tu historia," },
  { from: 28.09, to: 29.14, text: "recaudar fondos" },
  // 31.4–42.2: "y conectar con personas que quieren…" three times
  { from: 45.62, to: 48.27, text: "y conectar con personas que quieran sumarse a ayudarte." },
  // 52.1–55.5: "Pero si ya creaste tu causa, aguas con esto" (rephrased below)
  { from: 60.18, to: 64.69, skip: [60.56, 60.91], text: "Pero si ya subiste tu causa o estás planeando subir tu causa, te voy a dar" },
  { from: 65.05, to: 67.85, text: "3 recomendaciones para que recaudes muchísimo más" },
  // 70.6–71.2: "donativos" said twice
  { from: 68.38, to: 68.97, text: "donativos." },
  { from: 78.72, to: 79.17, text: "Uno:" },
  { from: 81.56, to: 83.33, text: "no subas solo una foto." },
  { from: 86.79, to: 88.97, text: "Graba un video contando tu historia," },
  { from: 91.71, to: 94.37, text: "que te conozcan, que conecten contigo." },
  { from: 97.55, to: 98.14, text: "Dos:" },
  { from: 100.85, to: 106.11, text: "agrega evidencia de tus medicamentos, de tu tratamiento," },
  { from: 106.47, to: 112.6, text: "de tu situación, de lo que sea. Comparte evidencia para que las personas generen confianza," },
  // 116.6–116.9: a lone "y"
  { from: 118.7, to: 121.43, text: "que se entienda por qué necesitas el apoyo." },
  // 124.7–127.4: "y 3 y el más importante de todos" (said again)
  { from: 129.14, to: 130.99, text: "Tres, y el más importante de todos:" },
  // 137.9–139.2: "comparte tu link" said twice
  { from: 141.22, to: 142.32, text: "¡comparte tu link!" },
  { from: 144.04, to: 149.45, text: "Mándaselo a tus amigos, familiares, conocidos, tus grupos, postéalo en redes, en donde sea." },
  // 154.8–155.3: "Pero por…" (restarted)
  { from: 155.9, to: 160.61, text: "Porque puedes tener la causa más bonita del mundo, pero si nadie la ve, ¿cómo te van a donar?" },
  { from: 167.1, to: 168.93, text: "Crear tu causa es el primer paso;" },
  { from: 172.37, to: 174.46, text: "moverla es lo que puede hacer la diferencia." },
  { from: 181.76, to: 183.33, text: "Muy fácil: entra a Yolapp," },
  // 183.7–184.4: "copia tu link" said twice
  { from: 185.64, to: 187.25, text: "copia tu link y compártelo." },
  { from: 189.4, to: 191.76, text: "Que tu historia llegue mucho más lejos." },
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
// Outro: the footage runs on to TAIL_END (end of the raw file), then holds on
// public/yolapp/v2/final.jpg under the logo.
export const OUTRO = 60;
export const TAIL_END = 192.55;
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
    "apoyo", "gastos", "médicos", "comunidad", "ayudar", "yolapp", "red", "causas", "historia", "recaudar",
    "fondos", "conectar", "ayudarte", "causa", "3", "recomendaciones", "donativos", "uno", "foto", "video",
    "conozcan", "conecten", "dos", "evidencia", "medicamentos", "tratamiento", "situación", "confianza",
    "apoyo", "tres", "importante", "link", "amigos", "familiares", "conocidos", "grupos", "redes", "bonita",
    "nadie", "donar", "crear", "primer", "moverla", "diferencia", "fácil", "copia", "compártelo", "lejos",
  ].map(norm),
);
export const isKeyword = (w: string) => KEYWORDS.has(norm(w));

// Graphic beats: a brand card sits on the lower third (below the chin) and the
// captions move above the head, from take `from` through take `to`.
export const GRAPHICS = [
  { id: "comunidad", from: 0, to: 1 },
  { id: "logo", from: 2, to: 2 },
  { id: "red", from: 3, to: 6 },
  { id: "tip1", from: 10, to: 13 },
  { id: "tip2", from: 14, to: 17 },
  { id: "tip3", from: 18, to: 20 },
  { id: "pasos", from: 22, to: 23 },
  { id: "app", from: 24, to: 25 },
] as const;
export type GraphicId = (typeof GRAPHICS)[number]["id"];
export const graphicSpan = (id: GraphicId) => {
  const g = GRAPHICS.find((x) => x.id === id)!;
  return { start: CLIPS[g.from].at, end: CLIPS[g.to].at + CLIPS[g.to].speech };
};
