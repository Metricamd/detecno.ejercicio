import type { Page, Role } from "../fispal/captions";
import { WORDS } from "./timeline";

// One spoken phrase per page: [word index, role] (estilo.md, "Textos legibles").
const P = (from: number, to: number, hero: number): [number, Role][] =>
  Array.from({ length: to - from + 1 }, (_, k) => {
    const i = from + k;
    return [i, i < hero ? "ctx" : i === hero ? "hero" : "tail"];
  });

const LAYOUT: [number, Role][][] = [
  P(0, 5, 2), // Tienes la factura. Tienes el pago.
  P(6, 13, 12), // Entonces… ¿por qué todavía los estás cruzando manualmente?
  P(14, 19, 14), // CFDI, pagos, complementos, cruces. Y repetir.
  P(20, 26, 24), // Cuando tienes un alto volumen de operaciones,
  P(27, 35, 30), // hacerlo manualmente consume tiempo y aumenta el trabajo operativo.
  P(36, 41, 39), // Fispal cuenta con Conciliación de Pagos.
  P(42, 53, 42), // Relaciona los CFDI correspondientes con los CFDI de pago descargados del SAT,
  P(54, 60, 57), // y presenta los resultados en la plataforma.
  P(61, 63, 62), // Menos cruces manuales.
  P(64, 68, 65), // Más visibilidad sobre tu conciliación.
  P(69, 73, 73), // ¿Todavía haces estos cruces manualmente?
  P(74, 76, 76), // Prueba fispal.mx gratis,
  P(77, 84, 82), // y deja que haga estos cruces por ti.
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
