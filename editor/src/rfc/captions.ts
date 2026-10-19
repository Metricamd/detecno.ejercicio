import type { Page, Role } from "../fispal/captions";
import { WORDS } from "./timeline";

// One spoken phrase per page: [word index, role] (estilo.md, "Textos legibles").
const P = (from: number, to: number, hero: number): [number, Role][] =>
  Array.from({ length: to - from + 1 }, (_, k) => {
    const i = from + k;
    return [i, i < hero ? "ctx" : i === hero ? "hero" : "tail"];
  });

const LAYOUT: [number, Role][][] = [
  P(0, 3, 3), // 3 empresas. 3 RFC.
  P(4, 10, 5), // ¿3 lugares distintos para consultar su información?
  P(11, 15, 15), // Más empresas significan más CFDI.
  P(16, 19, 17), // Más información. Más usuarios.
  P(20, 25, 23), // Y potencialmente más lugares donde buscar.
  P(26, 35, 33), // Pero administrar más RFC no debería significar multiplicar el trabajo.
  P(36, 44, 39), // Fispal permite administrar múltiples RFC desde una misma cuenta.
  P(45, 50, 50), // Varias empresas. Una gestión más centralizada.
  P(51, 57, 57), // ¿Tu equipo administra más de un RFC?
  P(58, 61, 59), // Empieza gratis en fispal.mx,
  P(62, 69, 64), // y gestiona múltiples RFC desde una misma cuenta.
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
