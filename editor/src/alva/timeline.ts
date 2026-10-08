// Word timings of the chosen voice (Lucía López, eleven_v3, "excited" + Mexican
// accent), as reported by Magnific for the same audio file. Seconds in the mp3.
export const VOICE_FILE = "audio/alva/voz-alva-raw.mp3";
export const VOICE_SECONDS = 13.48;

export const WORDS: { text: string; start: number }[] = [
  { text: "Si", start: 0.154 },
  { text: "solo", start: 0.208 },
  { text: "necesitas", start: 0.453 },
  { text: "diseño", start: 1.017 },
  { text: "unas", start: 1.408 },
  { text: "cuantas", start: 1.627 },
  { text: "veces", start: 1.973 },
  { text: "al", start: 2.293 },
  { text: "mes,", start: 2.46 },
  { text: "¿por", start: 3.04 },
  { text: "qué", start: 3.14 },
  { text: "cargar", start: 3.257 },
  { text: "con", start: 3.64 },
  { text: "sueldo,", start: 3.84 },
  { text: "prestaciones,", start: 4.44 },
  { text: "equipo", start: 5.509 },
  { text: "y", start: 5.72 },
  { text: "licencias", start: 5.82 },
  { text: "todo", start: 6.928 },
  { text: "el", start: 7.173 },
  { text: "año?", start: 7.34 },
  { text: "Hazlo", start: 8.485 },
  { text: "con", start: 8.765 },
  { text: "ALVA,", start: 8.938 },
  { text: "y", start: 9.525 },
  { text: "ten", start: 9.825 },
  { text: "lo", start: 10.032 },
  { text: "que", start: 10.125 },
  { text: "hace", start: 10.293 },
  { text: "un", start: 10.512 },
  { text: "departamento", start: 10.62 },
  { text: "de", start: 11.312 },
  { text: "diseño", start: 11.434 },
  { text: "sin", start: 12.285 },
  { text: "el", start: 12.458 },
  { text: "gasto", start: 12.605 },
  { text: "fijo.", start: 13.005 },
];

// Moments the 3D story hangs on (seconds).
export const CUE = {
  sueldo: 3.84,
  prestaciones: 4.44,
  equipo: 5.509,
  licencias: 5.82,
  anio: 6.928,
  fix: 8.25, // chaos is swept away, the room is rebuilt
  alva: 8.938,
  endCard: 13.95,
};

export const TOTAL_SECONDS = 18.0;

// Subtitle blocks, like the reference: whole block fades in, 2 lines max,
// the closing part of the sentence in SemiBold. [text, bold?]
export type Run = [string, boolean];
export const BLOCKS: { start: number; end: number; lines: Run[][]; solo?: boolean }[] = [
  {
    start: 0.05,
    end: 3.0,
    lines: [[["Si solo necesitas diseño", false]], [["unas cuantas veces ", false], ["al mes,", true]]],
  },
  {
    start: 3.0,
    end: 6.85,
    lines: [[["¿Por qué cargar con sueldo,", false]], [["prestaciones, equipo y ", false], ["licencias", true]]],
  },
  { start: 6.85, end: 8.4, lines: [[["todo el año?", true]]], solo: true },
  { start: 8.4, end: 9.45, lines: [[["Hazlo con ", false], ["ALVA", true]]], solo: true },
  {
    start: 9.45,
    end: 12.2,
    lines: [[["y ten lo que hace", false]], [["un ", false], ["departamento de diseño,", true]]],
  },
  { start: 12.2, end: CUE.endCard, lines: [[["sin el gasto fijo.", true]]], solo: true },
];
