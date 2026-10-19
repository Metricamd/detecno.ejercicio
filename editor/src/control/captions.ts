import type { Page, Role } from "../fispal/captions";
import { WORDS } from "./timeline";

// One spoken phrase per page: [word index, role] (estilo.md, "Textos legibles").
const P = (from: number, to: number, hero: number): [number, Role][] =>
  Array.from({ length: to - from + 1 }, (_, k) => {
    const i = from + k;
    return [i, i < hero ? "ctx" : i === hero ? "hero" : "tail"];
  });

const LAYOUT: [number, Role][][] = [
  P(0, 11, 1), // ¿Cuánto tiempo pierde tu equipo revisando información que ya debería tener controlada?
  P(12, 17, 12), // CFDI, reportes, archivos, consultas y revisiones.
  P(18, 30, 21), // Cuando la información crece, también crece el trabajo necesario para mantenerla bajo control.
  P(31, 37, 32), // El reto no siempre es tener información.
  P(38, 46, 40), // Es poder consultarla, organizarla y analizarla cuando la necesitas.
  P(47, 52, 48), // Con Fispal puedes concentrar tus CFDI
  P(53, 60, 60), // y trabajar con ellos desde una misma plataforma.
  P(61, 70, 65), // Consulta, análisis y diferentes herramientas para gestionar tu información fiscal.
  P(71, 75, 72), // Más control sobre la información.
  P(76, 82, 78), // Menos trabajo operativo para encontrarla y revisarla.
  P(83, 93, 84), // ¿Cuánto tiempo dedica hoy tu equipo a controlar su información fiscal?
  P(94, 97, 95), // Empieza gratis en fispal.mx,
  P(98, 107, 101), // y empieza a gestionar tu información desde un mismo lugar.
];

const LEAD = 0.1;

export const buildPages = (end: number): Page[] =>
  LAYOUT.map((items, i) => {
    const next = LAYOUT[i + 1];
    return {
      start: WORDS[items[0][0]].start - LEAD,
      end: next ? WORDS[next[0][0]].start - LEAD : end,
      words: items.map(([idx, role]) => ({ text: WORDS[idx].text, start: WORDS[idx].start - LEAD, role })),
    };
  });
