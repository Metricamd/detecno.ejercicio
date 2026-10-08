// Venvers visual kit, modelled on the brand's own posts: navy-to-purple
// gradient with grain, curved line mesh, planets, Raleway headlines mixing
// light and bold weights, hand-drawn lilac arrows, laptop / phone mockups.
import { loadFont } from "@remotion/fonts";
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";

export const W = 1080;
export const H = 1350;

export const V = {
  navy: "#0B0B4F",
  navy2: "#14117E",
  deep: "#06063A",
  purple: "#5B2BE0",
  violet: "#7B5CF5",
  lilac: "#B9A6FF",
  pink: "#EFA8F6",
  blue: "#0A3BFF",
  ink: "#0E1A5C", // portal headings
  white: "#FFFFFF",
  ok: "#14B37D",
  bad: "#E5484D",
  warn: "#F2A31B",
};

export const RALEWAY = "Raleway";
export const BARLOW = "Barlow";

const font = (family: string, file: string, weight: string) =>
  loadFont({ family, url: staticFile(`fonts/${file}-latin-${weight}-normal.woff2`), weight });

export const venversFonts = Promise.all([
  ...["300", "400", "600", "700", "800"].map((w) => font(RALEWAY, "raleway", w)),
  ...["400", "500", "600", "700"].map((w) => font(BARLOW, "barlow", w)),
]);

/* ---------- background ---------- */

// Curved line mesh (the "wave grid" in the references).
export const Mesh: React.FC<{ x: number; y: number; w: number; h: number; flip?: boolean; opacity?: number }> = ({
  x,
  y,
  w,
  h,
  flip,
  opacity = 0.35,
}) => {
  const lines = 26;
  const paths = Array.from({ length: lines }).map((_, i) => {
    const t = i / (lines - 1);
    const y0 = h * (0.15 + 0.7 * t);
    const amp = h * (0.18 + 0.25 * Math.sin(t * Math.PI));
    return `M 0 ${y0} C ${w * 0.3} ${y0 - amp}, ${w * 0.6} ${y0 + amp * 1.2}, ${w} ${y0 - amp * 0.4}`;
  });
  const cross = Array.from({ length: 16 }).map((_, i) => {
    const x0 = (w * i) / 15;
    return `M ${x0} 0 C ${x0 + w * 0.08} ${h * 0.35}, ${x0 - w * 0.08} ${h * 0.65}, ${x0 + w * 0.04} ${h}`;
  });
  return (
    <svg
      width={w}
      height={h}
      style={{ position: "absolute", left: x, top: y, opacity, transform: flip ? "scaleX(-1)" : undefined }}
    >
      {[...paths, ...cross].map((d, i) => (
        <path key={i} d={d} fill="none" stroke={V.lilac} strokeWidth={1.6} />
      ))}
    </svg>
  );
};

export const Planet: React.FC<{ x: number; y: number; r: number; ring?: boolean; opacity?: number }> = ({
  x,
  y,
  r,
  ring,
  opacity = 0.55,
}) => (
  <div style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, opacity }}>
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        background: "radial-gradient(circle at 35% 30%, #8F6BFF 0%, #4B2BB8 45%, #26105E 100%)",
        boxShadow: "0 0 80px rgba(123,92,245,.35)",
      }}
    />
    {ring && (
      <div
        style={{
          position: "absolute",
          left: -r * 0.45,
          top: r * 0.72,
          width: r * 2.9,
          height: r * 0.6,
          borderRadius: "50%",
          border: `${Math.max(3, r * 0.06)}px solid rgba(185,166,255,.45)`,
          transform: "rotate(-20deg)",
        }}
      />
    )}
  </div>
);

export const VBackground: React.FC<{ variant?: "deep" | "blue" }> = ({ variant = "deep" }) => (
  <AbsoluteFill
    style={{
      background:
        variant === "blue"
          ? `linear-gradient(170deg, #1730E6 0%, ${V.navy2} 55%, ${V.deep} 100%)`
          : `linear-gradient(165deg, ${V.navy2} 0%, ${V.navy} 50%, ${V.deep} 100%)`,
      overflow: "hidden",
    }}
  >
    <div style={{ position: "absolute", width: 900, height: 900, right: -320, bottom: -360, borderRadius: "50%", background: "#6B1F8F", filter: "blur(170px)", opacity: 0.55 }} />
    <div style={{ position: "absolute", width: 700, height: 700, left: -280, top: -260, borderRadius: "50%", background: "#3D2BD8", filter: "blur(160px)", opacity: 0.45 }} />
    {/* film grain */}
    <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity: 0.07 }}>
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain)" />
    </svg>
  </AbsoluteFill>
);

/* ---------- type ---------- */

// Headline segments: plain text is light, { b } is bold.
export type HSeg = string | { b: string };
export const VHeadline: React.FC<{ parts: HSeg[]; size?: number; width?: number; style?: React.CSSProperties }> = ({
  parts,
  size = 72,
  width,
  style,
}) => (
  <div
    style={{
      fontFamily: RALEWAY,
      fontWeight: 300,
      fontSize: size,
      lineHeight: 1.12,
      letterSpacing: "-0.01em",
      color: V.white,
      maxWidth: width,
      ...style,
    }}
  >
    {parts.map((p, i) =>
      typeof p === "string" ? <span key={i}>{p}</span> : <span key={i} style={{ fontWeight: 800 }}>{p.b}</span>,
    )}
  </div>
);

export const Logo: React.FC<{ x: number; y: number; h?: number }> = ({ x, y, h = 66 }) => (
  <Img src={staticFile("venvers/logo-venvers.png")} style={{ position: "absolute", left: x, top: y, height: h }} />
);

// Hand-drawn arrow (lilac stroke, like the references).
export const HandArrow: React.FC<{ x: number; y: number; w: number; h: number; d: string; head: string; rotate?: number }> = ({
  x,
  y,
  w,
  h,
  d,
  head,
  rotate = 0,
}) => (
  <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ position: "absolute", left: x, top: y, transform: `rotate(${rotate}deg)`, overflow: "visible" }}>
    <path d={d} fill="none" stroke={V.lilac} strokeWidth={7} strokeLinecap="round" />
    <path d={head} fill="none" stroke={V.lilac} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ---------- devices ---------- */

export const Laptop: React.FC<{ x: number; y: number; w: number; children: React.ReactNode }> = ({ x, y, w, children }) => {
  const screenH = w * 0.6;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w }}>
      <div style={{ background: "#1B1B22", borderRadius: "26px 26px 0 0", padding: "22px 22px 30px", boxShadow: "0 40px 80px rgba(0,0,20,.55)", border: "2px solid #3A3A48" }}>
        <div style={{ height: screenH, borderRadius: 6, overflow: "hidden", background: "#fff", position: "relative" }}>{children}</div>
      </div>
      <div style={{ height: 26, margin: "0 -70px", background: "linear-gradient(180deg,#D9DAE2,#9C9DAA)", borderRadius: "0 0 40px 40px", boxShadow: "0 18px 30px rgba(0,0,20,.5)" }}>
        <div style={{ width: 160, height: 10, margin: "0 auto", background: "#8E8F9C", borderRadius: "0 0 10px 10px" }} />
      </div>
    </div>
  );
};

export const Phone: React.FC<{ x: number; y: number; w: number; children: React.ReactNode }> = ({ x, y, w, children }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: w * 2.05,
      borderRadius: w * 0.15,
      background: "#111",
      padding: w * 0.035,
      boxSizing: "border-box",
      boxShadow: "0 40px 80px rgba(0,0,20,.6)",
      border: "3px solid #4A4A55",
    }}
  >
    <div style={{ width: "100%", height: "100%", borderRadius: w * 0.12, overflow: "hidden", background: "#fff", position: "relative" }}>
      <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: w * 0.36, height: w * 0.075, background: "#111", borderRadius: "0 0 14px 14px", zIndex: 3 }} />
      {children}
    </div>
  </div>
);

/* ---------- small UI bits (Barlow, like the portal) ---------- */

export const StatusChip: React.FC<{ kind: "ok" | "bad" | "warn" | "info"; children: React.ReactNode; size?: number }> = ({
  kind,
  children,
  size = 18,
}) => {
  const c = { ok: V.ok, bad: V.bad, warn: V.warn, info: V.violet }[kind];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontFamily: BARLOW,
        fontWeight: 600,
        fontSize: size,
        color: c,
        background: `${c}1F`,
        borderRadius: 999,
        padding: `${size * 0.25}px ${size * 0.7}px`,
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ width: size * 0.45, height: size * 0.45, borderRadius: "50%", background: c }} />
      {children}
    </span>
  );
};

export const GradientButton: React.FC<{ children: React.ReactNode; size?: number; style?: React.CSSProperties }> = ({
  children,
  size = 40,
  style,
}) => (
  <div
    style={{
      display: "inline-block",
      fontFamily: RALEWAY,
      fontWeight: 800,
      fontSize: size,
      color: V.white,
      background: `linear-gradient(180deg, ${V.violet}, ${V.purple})`,
      borderRadius: 999,
      padding: `${size * 0.55}px ${size * 1.3}px`,
      boxShadow: "0 20px 50px rgba(91,43,224,.55), inset 0 2px 0 rgba(255,255,255,.25)",
      ...style,
    }}
  >
    {children}
  </div>
);
