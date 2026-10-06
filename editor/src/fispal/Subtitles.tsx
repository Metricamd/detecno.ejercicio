import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { PAGES, type Page, type Word } from "./captions";
import { C, FONT, s } from "./theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// estilo.md §2: cada palabra entra con blur 8 → 0, opacidad 0 → 1 y Y +10 → 0
// en 6 fotogramas; el bloque sale con desenfoque en 5 fotogramas.
const WordView: React.FC<{ word: Word; frame: number }> = ({ word, frame }) => {
  const p = interpolate(frame, [s(word.start), s(word.start) + 6], [0, 1], clamp);
  const hero = word.role === "hero";
  return (
    <span
      style={{
        display: "inline-block",
        opacity: p,
        filter: `blur(${(1 - p) * 8}px)`,
        transform: `translateY(${(1 - p) * (hero ? 18 : 10)}px)`,
        margin: hero ? 0 : "0 0.14em",
      }}
    >
      {word.text}
    </span>
  );
};

const PageView: React.FC<{ page: Page; frame: number }> = ({ page, frame }) => {
  const out = interpolate(frame, [s(page.end) - 5, s(page.end)], [1, 0], clamp);
  const line = (role: Word["role"]) => page.words.filter((w) => w.role === role);
  const ctx = line("ctx");
  const hero = line("hero");
  const tail = line("tail");
  return (
    <div
      style={{
        opacity: out,
        filter: out < 1 ? `blur(${(1 - out) * 10}px)` : undefined,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: FONT,
        textAlign: "center",
      }}
    >
      {ctx.length > 0 && (
        <div style={{ fontSize: 46, fontWeight: 600, color: C.text, lineHeight: 1.25 }}>
          {ctx.map((w) => (
            <WordView key={w.start} word={w} frame={frame} />
          ))}
        </div>
      )}
      {hero.length > 0 && (
        <div
          style={{
            fontSize: 108,
            fontWeight: 800,
            color: C.accent,
            letterSpacing: "-0.02em",
            lineHeight: 1.08,
          }}
        >
          {hero.map((w) => (
            <WordView key={w.start} word={w} frame={frame} />
          ))}
        </div>
      )}
      {tail.length > 0 && (
        <div style={{ fontSize: 40, fontWeight: 600, color: C.text, lineHeight: 1.3 }}>
          {tail.map((w) => (
            <WordView key={w.start} word={w} frame={frame} />
          ))}
        </div>
      )}
    </div>
  );
};

export const Subtitles: React.FC<{ centerY?: number }> = ({ centerY = 1560 }) => {
  const frame = useCurrentFrame();
  const page = PAGES.find((p) => frame >= s(p.start) && frame < s(p.end));
  if (!page) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: 60,
          right: 60,
          top: centerY,
          transform: "translateY(-50%)",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <PageView page={page} frame={frame} />
      </div>
    </AbsoluteFill>
  );
};
