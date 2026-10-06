import { CUE, WORDS } from "./timeline";

export type Role = "ctx" | "hero" | "tail";
export type Word = { text: string; start: number; role: Role };
export type Page = { start: number; end: number; words: Word[] };

// Each page is one full spoken phrase: [word index, role]. Pages stay on screen
// until the next one starts (every page is ≥ 2 s) so they can be read calmly.
const LAYOUT: [number, Role][][] = [
  [[0, "ctx"], [1, "hero"], [2, "tail"]],
  [[3, "ctx"], [4, "ctx"], [5, "ctx"], [6, "ctx"], [7, "ctx"], [8, "hero"]],
  [[9, "ctx"], [10, "hero"], [11, "tail"], [12, "tail"]],
  [[13, "hero"], [14, "tail"], [15, "tail"], [16, "tail"], [17, "tail"], [18, "tail"], [19, "tail"]],
  [[20, "ctx"], [21, "ctx"], [22, "hero"], [23, "tail"], [24, "tail"]],
  [[25, "ctx"], [26, "ctx"], [27, "hero"]],
  [[28, "ctx"], [29, "ctx"], [30, "ctx"], [31, "hero"]],
  [[32, "ctx"], [33, "ctx"], [34, "ctx"], [35, "hero"], [36, "tail"], [37, "tail"]],
  [[38, "ctx"], [39, "ctx"], [40, "hero"], [41, "tail"], [42, "tail"], [43, "tail"]],
  // "Más flexibilidad. Más control. Más Fispal." is the on-screen headline
  // itself, so no subtitle block there.
  [[50, "ctx"], [51, "ctx"], [52, "ctx"], [53, "ctx"], [54, "ctx"], [55, "hero"]],
];

// Text shows up a little before it is spoken so the eye gets there first.
const LEAD = 0.1;

export const buildPages = (end: number): Page[] =>
  LAYOUT.map((items, i) => {
    const start = WORDS[items[0][0]].start - LEAD;
    const next = LAYOUT[i + 1];
    const pageEnd =
      i === 8 ? CUE.masFlex - 0.15 : next ? WORDS[next[0][0]].start - LEAD : end;
    return {
      start,
      end: pageEnd,
      words: items.map(([idx, role]) => ({
        text: WORDS[idx].text,
        start: WORDS[idx].start - LEAD,
        role,
      })),
    };
  });
