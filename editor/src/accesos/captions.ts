import type { Page, Role } from "../fispal/captions";
import { WORDS } from "./timeline";

// One spoken phrase per page: [word index, role] (estilo.md, "Textos legibles").
const P = (from: number, to: number, hero: number): [number, Role][] =>
  Array.from({ length: to - from + 1 }, (_, k) => {
    const i = from + k;
    return [i, i < hero ? "ctx" : i === hero ? "hero" : "tail"];
  });

const LAYOUT: [number, Role][][] = [
  P(0, 12, 6), // Hay algo que no todos en Finanzas deberían poder hacer. ¿Sabes qué es?
  P(13, 17, 16), // No todos necesitan administrar usuarios.
  P(18, 23, 21), // No todos necesitan consultar lo mismo.
  P(24, 29, 29), // No todos necesitan las mismas funciones.
  P(30, 42, 33), // Por eso los accesos también forman parte del control de la información fiscal.
  P(43, 49, 43), // Fispal permite trabajar con usuarios y perfiles.
  P(50, 58, 53), // Puedes definir las funciones disponibles según el perfil asignado.
  P(59, 66, 64), // La información fiscal también necesita control de acceso.
  P(67, 70, 68), // Únete gratis a fispal.mx,
  P(71, 78, 74), // y empieza a gestionar tus usuarios y perfiles.
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
