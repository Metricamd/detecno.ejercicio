import type { Page, Role } from "../fispal/captions";
import { WORDS } from "./timeline";

// One spoken phrase per page: [word index, role] (estilo.md, "Textos legibles").
const P = (from: number, to: number, hero: number): [number, Role][] =>
  Array.from({ length: to - from + 1 }, (_, k) => {
    const i = from + k;
    return [i, i < hero ? "ctx" : i === hero ? "hero" : "tail"];
  });

const LAYOUT: [number, Role][][] = [
  P(0, 9, 1), // ¿Cuántos archivos necesitas abrir para responder una sola pregunta fiscal?
  P(10, 15, 12), // Haz la cuenta antes de seguir.
  P(16, 19, 17), // Un Excel. Una carpeta.
  P(20, 23, 21), // Un XML. Otro reporte.
  P(24, 29, 27), // Y todavía falta cruzar la información.
  P(30, 42, 34), // Cuando la información está dispersa, cada consulta se convierte en una pequeña investigación.
  P(43, 46, 43), // Fispal concentra tus CFDI
  P(47, 54, 52), // y permite consultarlos utilizando diferentes filtros y criterios.
  P(55, 57, 57), // Menos archivos dispersos.
  P(58, 63, 59), // Más visibilidad sobre tu información fiscal.
  P(64, 67, 65), // Prueba gratis en fispal.mx,
  P(68, 72, 69), // y concentra tu información fiscal.
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
