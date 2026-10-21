// Yolapp reel — small animated building blocks (cards, pills, icons).
import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { POPPINS } from "../theme";
import { GRAD, Y } from "./datos";

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const EASE = Easing.bezier(0.16, 1, 0.3, 1);

// 0 → 1 pop with a little overshoot, starting at `at` (frame).
export const usePop = (at: number, damping = 11) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - at, fps, config: { damping, stiffness: 180, mass: 0.7 } });
};

// Shake offset for `len` frames after `at`.
export const useShake = (at: number, len = 10, amp = 14) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  if (t < 0 || t > len) return "translate(0px, 0px)";
  const k = amp * (1 - t / len);
  return `translate(${Math.sin(t * 2.7) * k}px, ${Math.cos(t * 3.3) * k * 0.6}px)`;
};

export const Pop: React.FC<{ at: number; children: React.ReactNode; style?: React.CSSProperties; from?: number; rotate?: number }> = ({
  at,
  children,
  style,
  from = 0.4,
  rotate = 0,
}) => {
  const p = usePop(at);
  if (useCurrentFrame() < at) return null;
  return (
    <div style={{ ...style, opacity: Math.min(1, p * 1.6), transform: `${style?.transform ?? ""} scale(${from + (1 - from) * p}) rotate(${rotate * p}deg)` }}>
      {children}
    </div>
  );
};

export const Card: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div
    style={{
      background: Y.white,
      borderRadius: 44,
      boxShadow: "0 30px 80px rgba(26,18,64,.35), 0 6px 18px rgba(26,18,64,.18)",
      padding: 36,
      fontFamily: POPPINS,
      color: Y.ink,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Chip: React.FC<{ children: React.ReactNode; bg?: string; color?: string; size?: number; style?: React.CSSProperties }> = ({
  children,
  bg = Y.ink,
  color = Y.white,
  size = 28,
  style,
}) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 12,
      background: bg,
      color,
      borderRadius: 999,
      padding: `${size * 0.4}px ${size * 0.9}px`,
      fontFamily: POPPINS,
      fontWeight: 800,
      fontSize: size,
      letterSpacing: "0.04em",
      textTransform: "uppercase",
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {children}
  </div>
);

// Big rotated sticker for key phrases on the talking-head shots.
export const Sticker: React.FC<{ at: number; text: string; bg?: string; rotate?: number; size?: number; top?: number }> = ({
  at,
  text,
  bg = GRAD.warm,
  rotate = -4,
  size = 78,
  top = 250,
}) => (
  <Pop at={at} rotate={rotate} style={{ position: "absolute", top, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
    <div
      style={{
        background: bg,
        color: Y.white,
        fontFamily: POPPINS,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1,
        padding: `${size * 0.32}px ${size * 0.5}px`,
        borderRadius: size * 0.36,
        textTransform: "uppercase",
        letterSpacing: "-0.01em",
        boxShadow: "0 18px 50px rgba(26,18,64,.45)",
        border: "6px solid #fff",
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  </Pop>
);

/* ---------- icons ---------- */
export const Star: React.FC<{ fill: number; size?: number }> = ({ fill, size = 54 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <defs>
      <linearGradient id={`st${Math.round(fill * 100)}`} x1="0" x2="1">
        <stop offset={fill} stopColor="#FFC531" />
        <stop offset={fill} stopColor="#E3E1EE" />
      </linearGradient>
    </defs>
    <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8z" fill={`url(#st${Math.round(fill * 100)})`} />
  </svg>
);

export const Stars: React.FC<{ from: number; step?: number; size?: number; count?: number }> = ({ from, step = 4, size = 54, count = 5 }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", gap: 6 }}>
      {Array.from({ length: 5 }, (_, i) => {
        const f = i < count ? interpolate(frame, [from + i * step, from + i * step + 5], [0, 1], clamp) : 0;
        return (
          <div key={i} style={{ transform: `scale(${1 + 0.35 * Math.sin(Math.PI * f)})` }}>
            <Star fill={f} size={size} />
          </div>
        );
      })}
    </div>
  );
};

export const Check: React.FC<{ at: number; size?: number; bg?: string }> = ({ at, size = 56, bg = Y.ok }) => {
  const frame = useCurrentFrame();
  const p = usePop(at, 10);
  const draw = interpolate(frame, [at + 2, at + 10], [0, 1], clamp);
  const on = frame >= at;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.32,
        flexShrink: 0,
        background: on ? bg : "transparent",
        border: on ? "none" : `5px solid #D9D6E8`,
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: `scale(${on ? 0.6 + 0.4 * p : 1})`,
      }}
    >
      {on && (
        <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 24 24">
          <path d="M4 12.5l5 5L20 6.5" fill="none" stroke="#fff" strokeWidth={3.6} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
        </svg>
      )}
    </div>
  );
};

export const Tick: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M4 12.5l5 5L20 6.5" fill="none" stroke="#fff" strokeWidth={3.6} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PlayIcon: React.FC<{ size?: number }> = ({ size = 120 }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", background: "rgba(255,255,255,.95)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 30px rgba(0,0,0,.3)" }}>
    <svg width={size * 0.42} height={size * 0.42} viewBox="0 0 24 24" style={{ marginLeft: size * 0.06 }}>
      <path d="M6 3.5v17l14-8.5z" fill={Y.pink} />
    </svg>
  </div>
);

export const ImageIcon: React.FC<{ size?: number; color?: string }> = ({ size = 90, color = "#B9B5CC" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="16" rx="3" />
    <circle cx="9" cy="10" r="2" />
    <path d="M21 16l-5-5-9 9" />
  </svg>
);

export const EyeIcon: React.FC<{ size?: number; color?: string; crossed?: boolean }> = ({ size = 64, color = Y.ink, crossed }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
    <circle cx="12" cy="12" r="3" />
    {crossed && <path d="M3 3l18 18" stroke={Y.pink} strokeWidth={2.8} />}
  </svg>
);

export const LinkIcon: React.FC<{ size?: number; color?: string }> = ({ size = 48, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.1 0l3-3a5 5 0 0 0-7.1-7.1l-1.2 1.2" />
    <path d="M14 11a5 5 0 0 0-7.1 0l-3 3a5 5 0 0 0 7.1 7.1l1.2-1.2" />
  </svg>
);

export const Heart: React.FC<{ size?: number; color?: string }> = ({ size = 60, color = Y.pink }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M12 21s-7.5-4.6-9.6-9.3C.9 8.2 3 4.5 6.7 4.5c2.2 0 3.6 1.2 5.3 3.1 1.7-1.9 3.1-3.1 5.3-3.1 3.7 0 5.8 3.7 4.3 7.2C19.5 16.4 12 21 12 21z" fill={color} />
  </svg>
);

// Simple glyph icons for the share bubbles.
export const Glyph: React.FC<{ name: "casa" | "amigos" | "redes" | "grupo" | "mundo"; size?: number }> = ({ name, size = 64 }) => {
  const p = { fill: "none", stroke: "#fff", strokeWidth: 2.2, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      {name === "casa" && <path {...p} d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" />}
      {name === "amigos" && (
        <g {...p}>
          <circle cx="9" cy="8" r="3.2" />
          <circle cx="17" cy="9" r="2.6" />
          <path d="M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6M15 14.5c3 0 6 1.8 6 5.5" />
        </g>
      )}
      {name === "redes" && (
        <g {...p}>
          <circle cx="18" cy="5" r="2.6" />
          <circle cx="6" cy="12" r="2.6" />
          <circle cx="18" cy="19" r="2.6" />
          <path d="M8.3 10.8l7.4-4.4M8.3 13.2l7.4 4.4" />
        </g>
      )}
      {name === "grupo" && <path {...p} d="M4 5h16v11H9l-5 4z M8 9.5h8 M8 12.5h5" />}
      {name === "mundo" && (
        <g {...p}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.8 3 2.8 15 0 18M12 3c-2.8 3-2.8 15 0 18" />
        </g>
      )}
    </svg>
  );
};

// Animated counter.
export const Counter: React.FC<{ from: number; to: number; start: number; end: number; style?: React.CSSProperties }> = ({ from, to, start, end, style }) => {
  const frame = useCurrentFrame();
  const v = interpolate(frame, [start, end], [from, to], { ...clamp, easing: Easing.out(Easing.cubic) });
  return <span style={{ fontVariantNumeric: "tabular-nums", ...style }}>{Math.round(v).toLocaleString("es-MX")}</span>;
};
