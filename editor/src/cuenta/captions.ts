import type { Page, Role } from "../fispal/captions";
import { WORDS } from "./timeline";

// One spoken phrase per page: [word index, role]. Same reading rules as the
// first reel (estilo.md, "Textos legibles"): pages last ~2 s or more.
const LAYOUT: [number, Role][][] = [
  [[0, "ctx"], [1, "ctx"], [2, "ctx"], [3, "hero"]],
  [[4, "ctx"], [5, "ctx"], [6, "ctx"], [7, "ctx"], [8, "hero"], [9, "tail"], [10, "tail"], [11, "tail"], [12, "tail"], [13, "tail"], [14, "tail"]],
  [[15, "ctx"], [16, "ctx"], [17, "ctx"], [18, "hero"], [19, "tail"], [20, "tail"]],
  [[21, "ctx"], [22, "ctx"], [23, "ctx"], [24, "ctx"], [25, "ctx"], [26, "hero"]],
  [[27, "ctx"], [28, "ctx"], [29, "ctx"], [30, "hero"]],
  [[31, "ctx"], [32, "hero"], [33, "tail"]],
  [[34, "ctx"], [35, "hero"], [36, "tail"]],
  [[37, "ctx"], [38, "ctx"], [39, "ctx"], [40, "ctx"], [41, "ctx"], [42, "hero"]],
  [[43, "ctx"], [44, "ctx"], [45, "ctx"], [46, "ctx"], [47, "hero"]],
];

const LEAD = 0.1;

export const buildPages = (end: number): Page[] =>
  LAYOUT.map((items, i) => {
    const next = LAYOUT[i + 1];
    return {
      start: WORDS[items[0][0]].start - LEAD,
      end: next ? WORDS[next[0][0]].start - LEAD : end,
      words: items.map(([idx, role]) => ({
        text: WORDS[idx].text,
        start: WORDS[idx].start - LEAD,
        role,
      })),
    };
  });
