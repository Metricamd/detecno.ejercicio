import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, FONT, MONO, cardShadow } from "./theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// estilo.md §4: entrada con spring (damping 14, ~0,4 s), escala 0,9 → 1.
export const useEnter = (delay = 0, damping = 14) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping }, durationInFrames: 12 });
};

export const Enter: React.FC<{
  delay?: number;
  from?: number;
  y?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ delay = 0, from = 0.9, y = 30, style, children }) => {
  const p = useEnter(delay);
  return (
    <div
      style={{
        opacity: interpolate(p, [0, 0.6], [0, 1], clamp),
        transform: `translateY(${(1 - p) * y}px) scale(${from + (1 - from) * p})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// estilo.md §4: fondo #F8F9FF con dos manchas difuminadas.
export const Background: React.FC<{ bpm?: number }> = ({ bpm = BPM }) => {
  const frame = useCurrentFrame();
  const beat = useBeat(bpm);
  const drift = Math.sin(frame / 60) * 40;
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          width: 1100,
          height: 1100,
          right: -420 + drift,
          top: -380,
          borderRadius: "50%",
          background: C.lavender,
          filter: "blur(140px)",
          opacity: 0.75,
          transform: `scale(${1 + 0.06 * beat})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1000,
          height: 1000,
          left: -420,
          bottom: -360 - drift,
          borderRadius: "50%",
          background: C.mint,
          filter: "blur(140px)",
          opacity: 0.7,
          transform: `scale(${1 + 0.06 * beat})`,
        }}
      />
    </AbsoluteFill>
  );
};

// Music beat (124 BPM): 1 right on each beat, decaying to 0 before the next.
export const BPM = 124;
export const useBeat = (bpm = BPM) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const beat = (60 / bpm) * fps;
  return Math.exp(-((frame % beat) / beat) * 6);
};

// estilo.md §5 + corrección "más dinámico": cruce con desenfoque en 6
// fotogramas, la escena entrante crece 0,9 → 1 y la saliente "atraviesa" la
// cámara (1 → 1,12).
export const Scene: React.FC<{
  duration: number;
  children: React.ReactNode;
  fadeIn?: boolean;
  fadeOut?: boolean;
}> = ({ duration, children, fadeIn = true, fadeOut = true }) => {
  const frame = useCurrentFrame();
  const inP = fadeIn ? interpolate(frame, [0, 6], [0, 1], clamp) : 1;
  const outP = fadeOut
    ? interpolate(frame, [duration - 6, duration], [1, 0], clamp)
    : 1;
  const p = Math.min(inP, outP);
  // estilo.md §6: zoom lento 1,00 → 1,04 mientras la escena está en pantalla.
  const drift = interpolate(frame, [0, duration], [1, 1.04], clamp);
  const zoom = drift * (0.9 + 0.1 * inP) * (1 + 0.12 * (1 - outP));
  return (
    <AbsoluteFill
      style={{
        opacity: p,
        filter: p < 1 ? `blur(${(1 - p) * 14}px)` : undefined,
        transform: `scale(${zoom})`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const Pill: React.FC<{
  children: React.ReactNode;
  dot?: boolean;
  style?: React.CSSProperties;
}> = ({ children, dot = true, style }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 14,
      background: C.text,
      color: C.white,
      borderRadius: 999,
      padding: "14px 30px",
      fontFamily: MONO,
      fontWeight: 700,
      fontSize: 26,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      ...style,
    }}
  >
    {dot && (
      <span
        style={{
          width: 12,
          height: 12,
          borderRadius: 6,
          background: C.accent,
          boxShadow: `0 0 12px ${C.accent}`,
        }}
      />
    )}
    {children}
  </div>
);

export const Card: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => (
  <div
    style={{
      background: C.white,
      borderRadius: 24,
      boxShadow: cardShadow,
      border: "1px solid rgba(0,0,0,.05)",
      ...style,
    }}
  >
    {children}
  </div>
);

// estilo.md §4: marco de "escaneo" con esquinas en L.
export const ScanCorners: React.FC<{
  width: number;
  height: number;
  delay?: number;
}> = ({ width, height, delay = 0 }) => {
  const p = useEnter(delay, 18);
  const pad = interpolate(p, [0, 1], [60, 26]);
  const L = 70;
  const corner = (pos: React.CSSProperties, rot: number) => (
    <div
      style={{
        position: "absolute",
        width: L,
        height: L,
        borderTop: `7px solid ${C.accent}`,
        borderLeft: `7px solid ${C.accent}`,
        borderTopLeftRadius: 10,
        transform: `rotate(${rot}deg)`,
        opacity: p,
        ...pos,
      }}
    />
  );
  return (
    <div
      style={{
        position: "absolute",
        left: -pad,
        top: -pad,
        width: width + pad * 2,
        height: height + pad * 2,
        pointerEvents: "none",
      }}
    >
      {corner({ left: 0, top: 0 }, 0)}
      {corner({ right: 0, top: 0 }, 90)}
      {corner({ right: 0, bottom: 0 }, 180)}
      {corner({ left: 0, bottom: 0 }, 270)}
    </div>
  );
};

export const Check: React.FC<{ size?: number; on?: number }> = ({
  size = 44,
  on = 1,
}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      background: on > 0.5 ? C.accent : "transparent",
      border: on > 0.5 ? "none" : `3px solid ${C.inactive}`,
      boxSizing: "border-box",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transform: `scale(${0.7 + 0.3 * on})`,
    }}
  >
    {on > 0.5 && (
      <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24">
        <path
          d="M4 12.5l5 5L20 6.5"
          stroke="#fff"
          strokeWidth={3.4}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={30}
          strokeDashoffset={30 * (1 - on)}
        />
      </svg>
    )}
  </div>
);

export const Headline: React.FC<{
  children: React.ReactNode;
  size?: number;
  style?: React.CSSProperties;
}> = ({ children, size = 64, style }) => (
  <div
    style={{
      fontFamily: FONT,
      fontWeight: 700,
      fontSize: size,
      color: C.text,
      letterSpacing: "-0.02em",
      lineHeight: 1.1,
      textAlign: "center",
      ...style,
    }}
  >
    {children}
  </div>
);
