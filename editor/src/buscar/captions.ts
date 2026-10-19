import type { Page, Role } from "../fispal/captions";
import { CUE, WORDS } from "./timeline";

// One spoken phrase per page: [word index, role] (estilo.md, "Textos legibles").
// "¿Dónde está?" is the on-screen headline itself, so it has no subtitle page.
const LAYOUT: [number, Role][][] = [
  [[0, "ctx"], [1, "ctx"], [2, "ctx"], [3, "ctx"], [4, "hero"], [5, "tail"], [6, "tail"], [7, "tail"]],
  [[8, "ctx"], [9, "ctx"], [10, "ctx"], [11, "hero"], [12, "tail"], [13, "tail"], [14, "tail"], [15, "tail"]],
  [[16, "ctx"], [17, "ctx"], [18, "ctx"], [19, "hero"]],
  [[20, "hero"], [21, "tail"], [22, "tail"], [23, "tail"], [24, "tail"]],
  [[25, "ctx"], [26, "ctx"], [27, "hero"], [28, "tail"], [29, "tail"], [30, "tail"]],
  [[31, "ctx"], [32, "ctx"], [33, "ctx"], [34, "ctx"], [35, "ctx"], [36, "hero"], [37, "tail"], [38, "tail"], [39, "tail"]],
  [[42, "ctx"], [43, "ctx"], [44, "ctx"], [45, "hero"]],
  [[46, "ctx"], [47, "ctx"], [48, "ctx"], [49, "hero"], [50, "tail"], [51, "tail"], [52, "tail"]],
  [[53, "ctx"], [54, "ctx"], [55, "ctx"], [56, "ctx"], [57, "hero"], [58, "tail"], [59, "tail"]],
  [[60, "ctx"], [61, "ctx"], [62, "ctx"], [63, "ctx"], [64, "ctx"], [65, "ctx"], [66, "hero"]],
  [[67, "ctx"], [68, "hero"], [69, "tail"], [70, "tail"]],
  [[71, "ctx"], [72, "ctx"], [73, "ctx"], [74, "ctx"], [75, "hero"], [76, "tail"], [77, "tail"], [78, "tail"], [79, "tail"]],
];

const LEAD = 0.1;

export const buildPages = (end: number): Page[] =>
  LAYOUT.map((items, i) => {
    const next = LAYOUT[i + 1];
    const pageEnd = i === 5 ? CUE.donde - 0.15 : next ? WORDS[next[0][0]].start - LEAD : end;
    return {
      start: WORDS[items[0][0]].start - LEAD,
      end: pageEnd,
      words: items.map(([idx, role]) => ({ text: WORDS[idx].text, start: WORDS[idx].start - LEAD, role })),
    };
  });
