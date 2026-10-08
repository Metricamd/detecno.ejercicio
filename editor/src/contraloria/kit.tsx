// Light kit for the "Contraloría" reel: white canvas with drifting purple
// gradient circles, synced headline and white UI cards.
import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, POPPINS } from "../theme";
import { FPS } from "./timings";

export const INK = "#16124A";
export const MUTED = "#6B6F94";
export const LINE = "#ECE8FB";
export const SOFT = "#F5F2FF";
export const GRAD = `linear-gradient(135deg, ${C.btnTo}, ${C.btnFrom})`;
export const SHADOW = "0 30px 60px rgba(108,60,233,0.18), 0 6px 18px rgba(43,20,140,.08)";

/* ---------- background ---------- */
const CIRCLES = [
  { x: 980, y: 260, r: 520, ph: 0 },
  { x: 60, y: 1500, r: 620, ph: 2 },
  { x: 900, y: 1750, r: 380, ph: 4 },
];
export const LightBackground: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#FFFFFF", overflow: "hidden" }}>
      {CIRCLES.map((c, i) => {
        const dx = Math.sin(frame / 80 + c.ph) * 60;
        const dy = Math.cos(frame / 95 + c.ph) * 50;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: c.x - c.r + dx,
              top: c.y - c.r + dy,
              width: c.r * 2,
              height: c.r * 2,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(123,79,224,.55) 0%, rgba(155,92,246,.2) 42%, rgba(255,255,255,0) 70%)",
            }}
          />
        );
      })}
      {[260, 360].map((r) => (
        <div key={r} style={{ position: "absolute", left: 980 - r, top: 260 - r, width: r * 2, height: r * 2, borderRadius: "50%", border: "2px solid rgba(108,60,233,.14)" }} />
      ))}
    </AbsoluteFill>
  );
};

/* ---------- headline whose words appear as the voice says them ---------- */
export const SyncedHeadline: React.FC<{
  words: { text: string; at: number }[];
  sceneStart: number; // reel seconds
  size: number;
  highlight?: string[];
  style?: React.CSSProperties;
}> = ({ words, sceneStart, size, highlight = [], style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const norm = (w: string) => w.toLowerCase().replace(/[¿?¡!,.]/g, "");
  return (
    <div style={{ fontFamily: POPPINS, fontWeight: 800, fontSize: size, lineHeight: 1.12, color: INK, letterSpacing: "-0.01em", ...style }}>
      {words.map((w, i) => {
        const startFrame = Math.round((w.at - sceneStart) * FPS) - 4;
        const p = spring({ frame: frame - startFrame, fps, config: { damping: 18, stiffness: 150 } });
        const hl = highlight.includes(norm(w.text));
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              marginRight: "0.26em",
              opacity: Math.min(1, p * 1.4),
              filter: `blur(${(1 - Math.min(1, p)) * 10}px)`,
              transform: `translateY(${(1 - p) * 50}px)`,
              color: hl ? C.violet : undefined,
            }}
          >
            {w.text}
          </span>
        );
      })}
    </div>
  );
};

/* ---------- cards & icons ---------- */
export const Card: React.FC<{ style?: React.CSSProperties; children: React.ReactNode }> = ({ style, children }) => (
  <div style={{ background: "#fff", borderRadius: 28, border: `1px solid ${LINE}`, boxShadow: SHADOW, fontFamily: POPPINS, color: INK, padding: 28, boxSizing: "border-box", ...style }}>{children}</div>
);

export const I = {
  mail: "M3 6h18v12H3zM3 7l9 6 9-6",
  pdf: "M7 3h7l5 5v13H7zM14 3v5h5M9 14h2a1.5 1.5 0 0 0 0-3H9v6",
  xls: "M7 3h7l5 5v13H7zM14 3v5h5M9 11l5 6M14 11l-5 6",
  pen: "M4 20l4-1 10-10-3-3L5 16zM14 7l3 3",
  inbox: "M3 13h5l1.5 2.5h5L16 13h5M5 5h14l2 8v6H3v-6z",
  shield: "M12 3l8 3v6c0 4.5-3.4 8.4-8 9-4.6-.6-8-4.5-8-9V6zM8.5 12l2.5 2.5 4.5-5",
  route: "M6 19a2 2 0 1 0 0-.01M18 5a2 2 0 1 0 0-.01M6 17V9a4 4 0 0 1 4-4h6M18 7v8a4 4 0 0 1-4 4H8",
  check: "M5 12.5l4.5 4.5L19 7.5",
  flag: "M5 21V4M5 4h11l-2 4 2 4H5",
  gavel: "M14 4l6 6M11 7l6 6M13 5l-7 7 3 3 7-7M3 21h9",
  contract: "M7 3h10v18H7zM10 8h4M10 12h4M10 16h2",
  cart: "M3 4h2l2.4 11h10.2l2-8H6.2M9 20a1 1 0 1 0 0-.01M17 20a1 1 0 1 0 0-.01",
  doc: "M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6",
  card: "M3 7h18v10H3zM3 11h18M7 15h3",
  folder: "M3 6h7l2 2h9v11H3z",
  download: "M12 4v11M7 10l5 5 5-5M5 20h14",
  clock: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3 2",
};

export const Icon: React.FC<{ d: string; size?: number; color?: string; sw?: number }> = ({ d, size = 32, color = "#fff", sw = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
    <path d={d} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Tile: React.FC<{ d: string; size?: number; bg?: string; color?: string; style?: React.CSSProperties }> = ({ d, size = 64, bg = GRAD, color = "#fff", style }) => (
  <div style={{ width: size, height: size, borderRadius: size * 0.3, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, ...style }}>
    <Icon d={d} size={size * 0.52} color={color} />
  </div>
);

export const Pill: React.FC<{ color: string; children: React.ReactNode; size?: number }> = ({ color, children, size = 20 }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: POPPINS, fontWeight: 600, fontSize: size, color: color === C.warn ? "#A07C00" : color, background: `${color}22`, borderRadius: 999, padding: `${size * 0.2}px ${size * 0.6}px`, whiteSpace: "nowrap" }}>
    <span style={{ width: size * 0.45, height: size * 0.45, borderRadius: "50%", background: color }} />
    {children}
  </span>
);

// Frame (local to a scene) at which a reel-time second happens.
export const localFrame = (reelSec: number, sceneStart: number) => Math.round((reelSec - sceneStart) * FPS);
