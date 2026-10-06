// Word timings come from the voice-over alignment (seconds). Words the TTS
// spelled out phonetically are merged back into their written form.
export type Role = "ctx" | "hero" | "tail";
export type Word = { text: string; start: number; role: Role };
export type Page = { start: number; end: number; words: Word[] };

const w = (text: string, start: number, role: Role = "ctx"): Word => ({
  text,
  start,
  role,
});

export const PAGES: Page[] = [
  { start: 0, end: 1.86, words: [w("Fispal", 0), w("evoluciona", 0.61, "hero"), w("contigo.", 1.2, "tail")] },
  { start: 1.88, end: 3.47, words: [w("Llegó", 1.88), w("una", 2.1), w("nueva", 2.2), w("forma", 2.45), w("de", 2.75), w("contratar", 2.85, "hero")] },
  { start: 3.48, end: 4.9, words: [w("y", 3.48), w("gestionar", 3.57, "hero"), w("tu", 4.03, "tail"), w("plan.", 4.14, "tail")] },
  { start: 4.92, end: 6.25, words: [w("Personalízalo", 4.92, "hero"), w("a", 5.68, "tail"), w("la", 5.79, "tail"), w("medida", 5.9, "tail")] },
  { start: 6.26, end: 7.37, words: [w("de", 6.27), w("tu", 6.35), w("operación:", 6.45, "hero")] },
  { start: 7.38, end: 8.9, words: [w("paquetes", 7.39), w("de", 7.79), w("CFDI,", 7.92, "hero")] },
  { start: 8.91, end: 10.34, words: [w("RFC", 8.91, "hero"), w("adicionales,", 9.49, "tail")] },
  { start: 10.36, end: 11.41, words: [w("módulos", 10.36), w("avanzados,", 10.71, "hero")] },
  { start: 11.43, end: 12.39, words: [w("colaboradores", 11.43, "hero")] },
  { start: 12.4, end: 13.9, words: [w("e", 12.4), w("integraciones", 12.53), w("por", 13.16), w("API.", 13.32, "hero")] },
  { start: 13.92, end: 16.52, words: [w("Elige", 13.92), w("entre", 14.69), w("plan", 15.01), w("mensual", 15.25, "hero"), w("o", 15.76, "tail"), w("anual,", 15.89, "tail")] },
  { start: 16.54, end: 17.98, words: [w("y", 16.54), w("ahorra", 16.72), w("20%", 17.04, "hero")] },
  { start: 18.0, end: 19.0, words: [w("al", 18.0), w("elegir", 18.21), w("anual.", 18.53, "hero")] },
  // 19.06–22.7: "Más flexibilidad. Más control. Más Fispal." is the on-screen
  // headline itself, so no subtitle block is drawn there.
  { start: 22.75, end: 24.2, words: [w("Conoce", 22.75), w("la", 23.15), w("nueva", 23.24), w("experiencia", 23.5, "hero")] },
  { start: 24.21, end: 27, words: [w("en", 24.21), w("fispal.mx", 24.36, "hero")] },
];
