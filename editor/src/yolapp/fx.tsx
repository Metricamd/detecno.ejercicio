// Shared effects for the Yolapp reels (6+): dark glass panels, floating 3D
// phone mockup and a sparkle burst.
import React from "react";
import { useCurrentFrame } from "remotion";
import { POPPINS } from "../theme";

// Dark glass, readable over any background.
export const glass: React.CSSProperties = {
  background: "rgba(22,14,52,.62)",
  backdropFilter: "blur(18px) saturate(1.3)",
  WebkitBackdropFilter: "blur(18px) saturate(1.3)",
  border: "2px solid rgba(255,255,255,.22)",
  boxShadow:
    "0 20px 50px rgba(10,6,30,.45), inset 0 1px 0 rgba(255,255,255,.18)",
  color: "#fff",
  fontFamily: POPPINS,
};
export const circle = (size: number, bg: string): React.CSSProperties => ({
  width: size,
  height: size,
  flexShrink: 0,
  borderRadius: "50%",
  background: bg,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

// Floating 3D phone; `children` is the screen.
export const Phone: React.FC<{
  w: number;
  tiltY: number;
  children: React.ReactNode;
  glow?: string;
}> = ({ w, tiltY, children, glow = "rgba(125,14,213,.55)" }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ perspective: 1400 }}>
      <div
        style={{
          width: w,
          height: w * 2.05,
          borderRadius: w * 0.16,
          background: "#120b2e",
          padding: w * 0.045,
          boxSizing: "border-box",
          transform: `rotateY(${tiltY}deg) rotateX(8deg) translateY(${Math.sin(frame / 18) * 8}px)`,
          boxShadow: `0 40px 80px rgba(10,6,30,.55), 0 0 60px ${glow}, inset 0 0 0 3px rgba(255,255,255,.12)`,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: w * 0.12,
            overflow: "hidden",
            background: "#fff",
            position: "relative",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

// Sparkle burst at `at` (frame), centered on its box.
export const Burst: React.FC<{ at: number; color?: string; size?: number }> = ({
  at,
  color = "#FFD54A",
  size = 220,
}) => {
  const t = useCurrentFrame() - at;
  if (t < 0 || t > 22) return null;
  const p = t / 22;
  return (
    <svg
      width={size}
      height={size}
      viewBox="-50 -50 100 100"
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        marginLeft: -size / 2,
        marginTop: -size / 2,
        pointerEvents: "none",
      }}
    >
      {Array.from({ length: 10 }, (_, i) => {
        const a = (i / 10) * Math.PI * 2;
        const r1 = 14 + p * 22;
        const r2 = r1 + 10 * (1 - p);
        return (
          <line
            key={i}
            x1={Math.cos(a) * r1}
            y1={Math.sin(a) * r1}
            x2={Math.cos(a) * r2}
            y2={Math.sin(a) * r2}
            stroke={color}
            strokeWidth={4}
            strokeLinecap="round"
            opacity={1 - p}
          />
        );
      })}
    </svg>
  );
};
