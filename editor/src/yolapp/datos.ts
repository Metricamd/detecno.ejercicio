// Yolapp reel — edit decision list. Each take is [from, to] in seconds of
// public/yolapp/crudo.mp4 plus what is said in it. Silences, false starts and
// repeated takes are already left out: only the good take of each line stays.
// Cut points come from silencedetect (-40 dB, 0.12 s) speech islands; the text
// from Whisper (small, q8) re-run take by take.
export const FPS = 30;
export const W = 1080;
export const H = 1920;

type Take = { from: number; to: number; text: string };
const TAKES: Take[] = [
  { from: 0.5, to: 2.25, text: "A ver, seamos honestos." },
  { from: 4.3, to: 6.1, text: "¿Tú le comprarías a un vendedor" },
  { from: 8.35, to: 10.28, text: "que solo tiene una foto de su producto?" },
  { from: 12.2, to: 13.4, text: "Cero reseñas." },
  { from: 15.88, to: 17.28, text: "¿Y ninguna prueba de que es real?" },
  // 21.3–39.4: four false starts of the next line
  { from: 45.86, to: 48.76, text: "¿O le comprarías a uno que tiene fotos desde todos los ángulos," },
  // 49.5–50.6: "desde todos los ángulos" said twice
  { from: 53.5, to: 55.62, text: "videos, reseñas y da confianza?" },
  // 58.6–60.5: "pues eso es lo que pasa exactamente" (restarted)
  { from: 63.05, to: 65.55, text: "Pues con tu causa pasa exactamente lo mismo." },
  // 67.8–69.4: "sube un video contando tu causa" (corrected to "historia")
  { from: 70.95, to: 72.48, text: "Sube un video contando tu historia," },
  // 73.9–75.2: "agrega foto de tu…" (restarted)
  { from: 76.05, to: 81.72, text: "agrega foto de tus medicamentos, de tu tratamiento o lo que sea que necesites para comprobar que tu causa es cierta." },
  // 88.6–89.5: "sea tu causa" said twice
  { from: 85.36, to: 87.9, text: "Entre más clara y transparente sea tu causa," },
  { from: 92.65, to: 93.74, text: "más fácil" },
  { from: 96.62, to: 99.0, text: "será que las personas puedan entenderte" },
  { from: 101.81, to: 103.06, text: "y que quieran ayudarte." },
  { from: 105.93, to: 106.85, text: "Pero ¡aguas!" },
  { from: 107.84, to: 110.5, text: "Puedes tener la causa más completa en Yolapp," },
  { from: 112.48, to: 116.22, text: "pero si no compartes tu link, nadie la va a ver." },
  { from: 122.55, to: 126.96, text: "Mándaselo a tu familia, amigos, compártanlo en tus redes, en tu grupo, donde sea." },
  { from: 132.14, to: 135.02, text: "Porque subir una causa y dejarla ahí no es recaudar." },
  { from: 138.28, to: 141.08, text: "Compartir el link es el primer paso para recibir." },
  { from: 148.14, to: 149.2, text: "Mejora tu causa," },
  { from: 150.38, to: 151.54, text: "genera confianza," },
  { from: 152.75, to: 153.6, text: "comparte tu link." },
  { from: 156.86, to: 158.75, text: "Y deja que las personas conozcan tu historia." },
];

// Takes placed on the reel timeline (frames).
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
export const SPEECH_END = CLIPS[CLIPS.length - 1].at + CLIPS[CLIPS.length - 1].len;
// Outro: the footage runs on to TAIL_END (after that the raw file has a
// CapCut end card), then holds on public/yolapp/final.jpg under the logo.
export const OUTRO = 60;
export const TAIL_END = 159.28;
export const TOTAL = SPEECH_END + OUTRO;

// First frame of take i, plus an offset in seconds.
export const clipAt = (i: number, s = 0) => CLIPS[i].at + Math.round(s * FPS);

// Word timings: spread each take's words over its spoken part by length.
export type Word = { text: string; start: number; end: number; clip: number };
export const WORDS: Word[] = CLIPS.flatMap((c) => {
  const words = c.text.split(" ");
  const lead = 0.06 * FPS;
  const tail = 0.1 * FPS;
  const span = c.len - lead - tail;
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
    "honestos", "foto", "cero", "reseñas", "real", "ángulos", "videos", "confianza", "causa", "historia",
    "medicamentos", "tratamiento", "cierta", "clara", "transparente", "fácil", "entenderte", "ayudarte",
    "aguas", "completa", "yolapp", "link", "nadie", "familia", "amigos", "redes", "grupo", "recaudar",
    "compartir", "recibir", "mejora", "genera", "comparte",
  ].map(norm),
);
export const isKeyword = (w: string) => KEYWORDS.has(norm(w));

// Graphic beats: a brand card sits on the lower third (below the chin) and the
// captions move above the head, from take `from` through take `to`.
export const GRAPHICS = [
  { id: "dudoso", from: 2, to: 4 },
  { id: "confiable", from: 5, to: 6 },
  { id: "causa", from: 8, to: 9 },
  { id: "invisible", from: 15, to: 16 },
  { id: "comparte", from: 17, to: 17 },
  { id: "recibir", from: 19, to: 19 },
  { id: "resumen", from: 20, to: 22 },
] as const;
export type GraphicId = (typeof GRAPHICS)[number]["id"];
export const graphicSpan = (id: GraphicId) => {
  const g = GRAPHICS.find((x) => x.id === id)!;
  return { start: CLIPS[g.from].at, end: CLIPS[g.to].at + CLIPS[g.to].len };
};

// Brand palette (from Yolapp_Logotipo.ai).
export const Y = {
  blue: "#027BEB",
  teal: "#03C7C1",
  indigo: "#3E58F8",
  purple: "#7D0ED5",
  pink: "#FF0566",
  coral: "#FF4A3A",
  ink: "#1A1240",
  muted: "#7A7698",
  white: "#FFFFFF",
  ok: "#14C38E",
};
export const GRAD = {
  main: `linear-gradient(135deg, ${Y.purple} 0%, ${Y.indigo} 45%, ${Y.blue} 75%, ${Y.teal} 100%)`,
  warm: `linear-gradient(135deg, ${Y.coral} 0%, ${Y.pink} 45%, ${Y.purple} 100%)`,
  cool: `linear-gradient(135deg, ${Y.blue} 0%, ${Y.teal} 100%)`,
  deep: `linear-gradient(160deg, ${Y.purple} 0%, ${Y.indigo} 60%, ${Y.blue} 100%)`,
  text: `linear-gradient(90deg, ${Y.purple}, ${Y.pink} 60%, ${Y.coral})`,
};
