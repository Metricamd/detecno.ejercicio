// Shared building blocks for the Venvers reel: animated background, word
// reveal, glass cards, floating motion, icons and optional PNG assets.
import React from "react";
import { AbsoluteFill, getStaticFiles, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C, clamp, EASE, GLASS, H, POPPINS, W } from "../theme";

/* ---------- background: navy → indigo, drifting violet glow, grain ---------- */
export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const gx = Math.sin(frame / 90) * 120;
  const gy = Math.cos(frame / 110) * 90;
  const pulse = 0.45 + Math.sin(frame / 40) * 0.08;
  return (
    <AbsoluteFill style={{ background: `linear-gradient(160deg, ${C.bgFrom} 0%, ${C.bgTo} 100%)`, overflow: "hidden" }}>
      <div style={{ position: "absolute", width: 1100, height: 1100, right: -420 + gx, top: -380 + gy, borderRadius: "50%", background: C.glow, filter: "blur(200px)", opacity: pulse }} />
      <div style={{ position: "absolute", width: 900, height: 900, left: -460 - gx * 0.6, bottom: -420 - gy, borderRadius: "50%", background: C.violet, filter: "blur(220px)", opacity: 0.3 }} />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity: 0.06 }}>
        <filter id="reel-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" seed={Math.floor(frame / 2)} />
        </filter>
        <rect width="100%" height="100%" filter="url(#reel-grain)" />
      </svg>
    </AbsoluteFill>
  );
};

/* ---------- word-by-word reveal (spring up + blur → sharp) ---------- */
export const Words: React.FC<{
  text: string;
  at?: number;
  stagger?: number;
  size: number;
  weight?: number;
  highlight?: string[];
  color?: string;
  style?: React.CSSProperties;
}> = ({ text, at = 0, stagger = 3, size, weight = 800, highlight = [], color = C.white, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const norm = (w: string) => w.toLowerCase().replace(/[¿?¡!,.]/g, "");
  return (
    <div style={{ fontFamily: POPPINS, fontWeight: weight, fontSize: size, lineHeight: 1.12, color, letterSpacing: "-0.01em", ...style }}>
      {text.split(" ").map((w, i) => {
        const p = spring({ frame: frame - at - i * stagger, fps, config: { damping: 18, stiffness: 140 } });
        const hl = highlight.includes(norm(w));
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              marginRight: "0.26em",
              opacity: Math.min(1, p * 1.4),
              filter: `blur(${(1 - Math.min(1, p)) * 12}px)`,
              transform: `translateY(${(1 - p) * 60}px)`,
              color: hl ? C.lilac : undefined,
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

/* ---------- motion helpers ---------- */
export const useFloat = (phase: number, amp = 8, speed = 22) => {
  const frame = useCurrentFrame();
  return Math.sin(frame / speed + phase) * amp;
};

// 0 → 1 with the reel's entrance easing.
export const useEnter = (at: number, dur = 18) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [at, at + dur], [0, 1], { ...clamp, easing: EASE });
};

/* ---------- glass card ---------- */
export const Glass: React.FC<{ light?: boolean; style?: React.CSSProperties; children: React.ReactNode }> = ({ light, style, children }) => (
  <div style={{ ...(light ? GLASS.light : GLASS.dark), fontFamily: POPPINS, padding: 28, boxSizing: "border-box", ...style }}>{children}</div>
);

/* ---------- optional PNG assets from public/ ---------- */
export const hasAsset = (name: string) => getStaticFiles().some((f) => f.name === name);

export const AssetImg: React.FC<{ name: string; style?: React.CSSProperties }> = ({ name, style }) =>
  hasAsset(name) ? <Img src={staticFile(name)} style={style} /> : null;

/* ---------- icons (line, 24 × 24) ---------- */
export const ICON = {
  doc: "M7 3h7l5 5v13H7zM14 3v5h5M10 12h6M10 16h6",
  docCheck: "M7 3h7l5 5v13H7zM14 3v5h5M10 14l2 2 4-4",
  cart: "M3 4h2l2.4 11h10.2l2-8H6.2M9 20a1 1 0 1 0 0-.01M17 20a1 1 0 1 0 0-.01",
  card: "M3 7h18v10H3zM3 11h18M7 15h3",
  minusDoc: "M7 3h7l5 5v13H7zM14 3v5h5M10 15h6",
  alert: "M12 3l10 18H2zM12 10v5M12 18v.01",
  check: "M5 12.5l4.5 4.5L19 7.5",
  clock: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3 2",
  eye: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  coins: "M12 3c4.4 0 8 1.3 8 3s-3.6 3-8 3-8-1.3-8-3 3.6-3 8-3zM4 6v5c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 11v5c0 1.7 3.6 3 8 3s8-1.3 8-3v-5",
  bolt: "M13 2L4 14h7l-1 8 9-12h-7z",
};

export const Icon: React.FC<{ d: string; size?: number; color?: string; sw?: number }> = ({ d, size = 32, color = C.white, sw = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
    <path d={d} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconTile: React.FC<{ d: string; size?: number; bg?: string; color?: string }> = ({ d, size = 64, bg = `linear-gradient(135deg, ${C.btnTo}, ${C.btnFrom})`, color = C.white }) => (
  <div style={{ width: size, height: size, borderRadius: size * 0.3, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
    <Icon d={d} size={size * 0.52} color={color} />
  </div>
);

export const CheckBadge: React.FC<{ size?: number; p?: number }> = ({ size = 48, p = 1 }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", background: C.ok, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${p})`, boxShadow: "0 8px 20px rgba(34,197,94,.45)", flexShrink: 0 }}>
    <Icon d={ICON.check} size={size * 0.6} sw={3} />
  </div>
);

export const StatusPill: React.FC<{ kind: "ok" | "warn" | "bad"; children: React.ReactNode; size?: number }> = ({ kind, children, size = 22 }) => {
  const c = { ok: C.ok, warn: C.warn, bad: C.bad }[kind];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: POPPINS, fontWeight: 600, fontSize: size, color: kind === "warn" ? "#A07C00" : c, background: `${c}22`, borderRadius: 999, padding: `${size * 0.2}px ${size * 0.6}px`, whiteSpace: "nowrap" }}>
      <span style={{ width: size * 0.45, height: size * 0.45, borderRadius: "50%", background: c }} />
      {children}
    </span>
  );
};

// Simple QR-like pattern (decorative, for the CFDI card).
export const QR: React.FC<{ size: number }> = ({ size }) => {
  const n = 11;
  const cells: React.ReactNode[] = [];
  for (let y = 0; y < n; y++)
    for (let x = 0; x < n; x++) {
      const finder = (x < 3 && y < 3) || (x > 7 && y < 3) || (x < 3 && y > 7);
      const on = finder ? !(x % 8 === 1 && y % 8 === 1) : (x * 7 + y * 13 + x * y) % 3 === 0;
      if (on) cells.push(<rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} />);
    }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${n} ${n}`} style={{ flexShrink: 0 }}>
      <g fill={C.ink}>{cells}</g>
    </svg>
  );
};
