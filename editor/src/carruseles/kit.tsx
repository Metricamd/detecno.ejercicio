// Shared kit for the Fispal carousels of parrilla 2 (1080 × 1350 stills).
// Same line as the first Fispal carousels (Poppins, brand purple + mint,
// logo, counter, "Desliza →") but with the glass illustrations of the reels,
// Magnific photos and a background theme per carousel. A ribbon runs across
// all slides so the carousel reads as one continuous panorama.
import React, { useEffect, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, getStaticFiles, Img, Sequence, staticFile } from "remotion";
import { Illus } from "../fispal/Illus";
import { C, FONT, MONO, fontsLoaded } from "../fispal/theme";

export const W = 1080;
export const H = 1350;
export const SLIDE_FRAMES = 60;
export const STILL_AT = 50;

export type Theme = {
  dark: boolean;
  bg: string; // CSS background
  glows: { x: number; y: number; r: number; color: string; o: number }[];
  ink: string;
  sub: string;
  accent: string; // highlighted words
  card: string;
  cardInk: string;
  ribbon: string;
};

export const THEMES: Record<string, Theme> = {
  mint: {
    dark: false,
    bg: "linear-gradient(160deg, #F4FFFA 0%, #D6F7E8 50%, #A9ECD0 100%)",
    glows: [
      { x: 950, y: 120, r: 460, color: "#B9AEFF", o: 0.55 },
      { x: 100, y: 1250, r: 500, color: "#FFFFFF", o: 0.8 },
    ],
    ink: "#250E94",
    sub: "#4C5A75",
    accent: "#6A3FE0",
    card: "#FFFFFF",
    cardInk: "#131313",
    ribbon: "#6A3FE0",
  },
  teal: {
    dark: true,
    bg: "linear-gradient(170deg, #0E5560 0%, #0B3550 45%, #0A1A3A 100%)",
    glows: [
      { x: 980, y: 160, r: 460, color: "#3FD497", o: 0.38 },
      { x: 60, y: 1200, r: 520, color: "#7B61FF", o: 0.4 },
    ],
    ink: "#FFFFFF",
    sub: "rgba(255,255,255,.78)",
    accent: "#5CF0B4",
    card: "#FFFFFF",
    cardInk: "#131313",
    ribbon: "#5CF0B4",
  },
  light: {
    dark: false,
    bg: "linear-gradient(165deg, #FFFFFF 0%, #F2F4FF 55%, #E6FBF2 100%)",
    glows: [
      { x: 960, y: 140, r: 480, color: "#C9C2FF", o: 0.7 },
      { x: 80, y: 1250, r: 520, color: "#9FF0CF", o: 0.6 },
    ],
    ink: "#250E94",
    sub: "#5B5F86",
    accent: "#13B57D",
    card: "#FFFFFF",
    cardInk: "#131313",
    ribbon: "#7B61FF",
  },
  purple: {
    dark: true,
    bg: "linear-gradient(160deg, #4527E0 0%, #250E94 48%, #140660 100%)",
    glows: [
      { x: 900, y: 120, r: 520, color: "#A898FF", o: 0.55 },
      { x: 80, y: 1200, r: 560, color: "#3FD497", o: 0.32 },
    ],
    ink: "#FFFFFF",
    sub: "rgba(255,255,255,.78)",
    accent: "#3FD497",
    card: "#FFFFFF",
    cardInk: "#131313",
    ribbon: "#3FD497",
  },
};

/* ---------- headline with highlighted segments ---------- */
export type Seg = string | { hl: string };
export const Title: React.FC<{ parts: Seg[]; size?: number; t: Theme; style?: React.CSSProperties }> = ({ parts, size = 74, t, style }) => (
  <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: size, lineHeight: 1.05, letterSpacing: "-0.03em", color: t.ink, ...style }}>
    {parts.map((p, i) => (typeof p === "string" ? <span key={i}>{p}</span> : <span key={i} style={{ color: t.accent }}>{p.hl}</span>))}
  </div>
);

export const Body: React.FC<{ children: React.ReactNode; t: Theme; size?: number; style?: React.CSSProperties }> = ({ children, t, size = 34, style }) => (
  <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: size, lineHeight: 1.32, color: t.sub, marginTop: 20, ...style }}>{children}</div>
);

/* ---------- photo slot (public/photos/<name>.jpg or a placeholder) ---------- */
export const Photo: React.FC<{ name: string; hint: string; style: React.CSSProperties; radius?: number | string; position?: string; ring?: string }> = ({
  name,
  hint,
  style,
  radius = 44,
  position = "center",
  ring,
}) => {
  const file = getStaticFiles().find((f) => f.name === `photos/${name}.jpg` || f.name === `photos/${name}.png`);
  return (
    <div style={{ position: "absolute", overflow: "hidden", borderRadius: radius, boxShadow: `0 30px 70px rgba(10,0,60,.35)${ring ? `, 0 0 0 8px ${ring}` : ""}`, ...style }}>
      {file ? (
        <Img src={staticFile(file.name)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: position }} />
      ) : (
        <div style={{ width: "100%", height: "100%", background: "linear-gradient(140deg, #6B55F0, #2A1490)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, color: "rgba(255,255,255,.85)", fontFamily: FONT, textAlign: "center", padding: 30, boxSizing: "border-box" }}>
          <div style={{ fontWeight: 700, fontSize: 28 }}>Foto</div>
          <div style={{ fontWeight: 500, fontSize: 20, opacity: 0.8 }}>{hint}</div>
        </div>
      )}
    </div>
  );
};

/* ---------- glass illustration, static for stills ---------- */
export const Glass3D: React.FC<{ name: string; x: number; y: number; size: number; rot?: number }> = ({ name, x, y, size, rot = 0 }) =>
  !getStaticFiles().some((f) => f.name === `fispal/illus/${name}.png`) ? (
    <div style={{ position: "absolute", left: x - size / 2, top: y - size / 2, width: size, height: size, borderRadius: "50%", border: "4px dashed rgba(123,97,255,.6)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, fontSize: 22, color: "#7B61FF", background: "rgba(123,97,255,.08)" }}>{name}</div>
  ) : (
  <div style={{ position: "absolute", left: x - size / 2, top: y - size / 2, transform: `rotate(${rot}deg)` }}>
    <AbsoluteFill style={{ position: "relative", width: size, height: size }}>
      <Illus name={name} at={-60} x={size / 2} y={size / 2} size={size} />
    </AbsoluteFill>
  </div>
);

export const Card: React.FC<{ t: Theme; style?: React.CSSProperties; children?: React.ReactNode }> = ({ t, style, children }) => (
  <div style={{ background: t.card, color: t.cardInk, borderRadius: 30, boxShadow: "0 26px 60px rgba(10,0,60,.3)", fontFamily: FONT, ...style }}>{children}</div>
);

export const Icon: React.FC<{ d: string; size?: number; color?: string; sw?: number }> = ({ d, size = 40, color = "#fff", sw = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
    <path d={d} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IC = {
  doc: "M7 3h7l5 5v13H7zM14 3v5h5M10 12h6M10 16h6",
  cloud: "M7 18h10a4 4 0 0 0 .5-8A6 6 0 0 0 6 9a4.5 4.5 0 0 0 1 9z",
  down: "M12 4v11M7 10l5 5 5-5M5 20h14",
  check: "M5 12.5l4.5 4.5L19 7.5",
  search: "M10.5 4a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM15.5 15.5L20 20",
  building: "M3 21h18M5 21V9l7-5 7 5v12M9 21v-6h6v6M9 11h.01M15 11h.01",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c0-4.4 3.6-8 8-8s8 3.6 8 8",
  alert: "M12 3l10 18H2zM12 10v5M12 18v.01",
  compare: "M8 3v18M16 3v18M3 8h5M16 16h5M3 16h5M16 8h5",
};

/* ---------- ribbon running across the whole carousel ---------- */
const ribbonPath = (n: number) => {
  // one smooth wave over n slides; each slide shows its own window of it
  const pts: string[] = [];
  for (let i = 0; i <= n * 40; i++) {
    const x = (i / 40) * W;
    const y = 1080 + Math.sin(i / 40 * Math.PI * 1.1 + 0.6) * 120 + Math.sin(i / 13) * 18;
    pts.push(`${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return pts.join(" ");
};

const Ribbon: React.FC<{ i: number; n: number; color: string }> = ({ i, n, color }) => (
  <svg width={W} height={H} style={{ position: "absolute", inset: 0 }} viewBox={`${i * W} 0 ${W} ${H}`}>
    <path d={ribbonPath(n)} fill="none" stroke={color} strokeWidth={34} strokeLinecap="round" opacity={0.18} />
    <path d={ribbonPath(n)} fill="none" stroke={color} strokeWidth={6} strokeLinecap="round" strokeDasharray="2 22" opacity={0.9} />
  </svg>
);

/* ---------- slide frame: background, logo, counter, footer ---------- */
export const Frame: React.FC<{ t: Theme; i: number; n: number; last?: boolean; children: React.ReactNode }> = ({ t, i, n, last, children }) => (
  <AbsoluteFill style={{ background: t.bg, overflow: "hidden" }}>
    {t.glows.map((g, k) => (
      <div key={k} style={{ position: "absolute", left: g.x - g.r, top: g.y - g.r, width: g.r * 2, height: g.r * 2, borderRadius: "50%", background: g.color, filter: "blur(150px)", opacity: g.o }} />
    ))}
    <Ribbon i={i} n={n} color={t.ribbon} />
    <div style={{ position: "absolute", left: 70, right: 70, top: 60, display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 5 }}>
      <Img src={staticFile(t.dark ? "brand/fispal-logo-white.png" : "brand/fispal-logo.png")} style={{ height: 54 }} />
      <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 26, color: t.ink, letterSpacing: "0.08em" }}>
        <span style={{ color: t.accent }}>{String(i + 1).padStart(2, "0")}</span> / {String(n).padStart(2, "0")}
      </span>
    </div>
    {children}
    {!last && (
      <div style={{ position: "absolute", left: 70, right: 70, bottom: 54, display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 5 }}>
        <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 26, color: t.ink }}>fispal.mx</span>
        <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 28, color: t.dark ? "#0F3A2A" : C.white, background: t.dark ? C.accent : C.purple, borderRadius: 999, padding: "12px 30px" }}>Desliza →</span>
      </div>
    )}
  </AbsoluteFill>
);

/* ---------- current theme: a carousel can be rendered with any theme ---------- */
let current: Theme | null = null;
export const themed = (fallback: Theme): Theme =>
  new Proxy({} as Theme, { get: (_, k: keyof Theme) => (current ?? fallback)[k] });

/* ---------- carousel wrapper: one Sequence per slide ---------- */
export const Carousel: React.FC<{ slides: React.FC[]; theme?: Theme }> = ({ slides, theme }) => {
  current = theme ?? null;
  const [handle] = useState(() => delayRender("Loading fonts"));
  useEffect(() => {
    fontsLoaded.then(() => continueRender(handle));
  }, [handle]);
  return (
    <AbsoluteFill>
      {slides.map((S, i) => (
        <Sequence key={i} from={i * SLIDE_FRAMES} durationInFrames={SLIDE_FRAMES} name={`Slide ${i + 1}`}>
          <S />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
