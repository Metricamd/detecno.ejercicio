import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame } from "remotion";
import type { Page, Word } from "./captions";
import { C, FONT, s } from "./theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// estilo.md §2: cada palabra entra con blur 8 → 0, opacidad 0 → 1 y Y +10 → 0
// en 8 fotogramas; el bloque sale con desenfoque en 6 fotogramas.
const WordView: React.FC<{ word: Word; frame: number }> = ({ word, frame }) => {
  const p = interpolate(frame, [s(word.start), s(word.start) + 8], [0, 1], clamp);
  const hero = word.role === "hero";
  // Highlighted word lands with a springy overshoot (more energy, same timing).
  const pop = spring({
    frame: frame - s(word.start),
    fps: 30,
    config: { damping: 9, stiffness: 180 },
    from: 0.7,
    to: 1,
  });
  return (
    <span
      style={{
        display: "inline-block",
        opacity: p,
        filter: `blur(${(1 - p) * 8}px)`,
        transform: hero
          ? `scale(${pop}) translateY(${(1 - p) * 18}px)`
          : `translateY(${(1 - p) * 10}px)`,
        margin: hero ? 0 : "0 0.14em",
      }}
    >
      {word.text}
    </span>
  );
};

const PageView: React.FC<{ page: Page; frame: number }> = ({ page, frame }) => {
  const out = interpolate(frame, [s(page.end) - 6, s(page.end)], [1, 0], clamp);
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

export const Subtitles: React.FC<{ centerY?: number; pages: Page[] }> = ({
  centerY = 1560,
  pages,
}) => {
  const frame = useCurrentFrame();
  const page = pages.find((p) => frame >= s(p.start) && frame < s(p.end));
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
