// Building blocks for the Bling reel: Pixar-style stills (from Magnific),
// bouncy sticker titles, the Bling logo, the phone with the app and the
// falling invoices.
import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { hasAsset } from "../components/ui";
import { POPPINS } from "../theme";
import { B } from "./theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/* ---------- Magnific stills (placeholder until the PNG is in public/bling) ---------- */
export const Pic: React.FC<{ name: string; style?: React.CSSProperties; fit?: "cover" | "contain"; label?: string }> = ({ name, style, fit = "cover", label }) =>
  hasAsset(`bling/${name}.png`) ? (
    <Img src={staticFile(`bling/${name}.png`)} style={{ objectFit: fit, ...style }} />
  ) : (
    <div
      style={{
        background: "repeating-linear-gradient(45deg, #FFE3D6 0 40px, #FFD3C2 40px 80px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: POPPINS,
        fontWeight: 700,
        fontSize: 40,
        color: B.coralDark,
        textAlign: "center",
        ...style,
      }}
    >
      {label ?? name}
    </div>
  );

/* ---------- bouncy sticker title (white, chunky, ink outline) ---------- */
export const Sticker: React.FC<{
  lines: string[];
  at: number; // local frame
  size?: number;
  color?: string;
  bg?: string;
  style?: React.CSSProperties;
}> = ({ lines, at, size = 76, color = B.ink, bg = B.white, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, ...style }}>
      {lines.map((l, i) => {
        const p = spring({ frame: frame - at - i * 5, fps, config: { damping: 9, stiffness: 170 } });
        const rot = (i % 2 ? 1.5 : -1.5) * (1 - Math.min(1, p) * 0.4);
        return (
          <div
            key={i}
            style={{
              fontFamily: POPPINS,
              fontWeight: 800,
              fontSize: size,
              lineHeight: 1.08,
              color,
              background: bg,
              borderRadius: 28,
              padding: `${size * 0.16}px ${size * 0.38}px`,
              boxShadow: `0 10px 0 ${B.ink}22, 0 18px 40px rgba(30,27,75,.25)`,
              border: `5px solid ${B.ink}`,
              textAlign: "center",
              transform: `scale(${p}) rotate(${rot}deg)`,
              opacity: Math.min(1, p * 2),
            }}
          >
            {l}
          </div>
        );
      })}
    </div>
  );
};

/* ---------- Bling logo (fictional brand) ---------- */
export const Spark: React.FC<{ size: number; color?: string; style?: React.CSSProperties }> = ({ size, color = B.sun, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={style}>
    <path d="M12 0 C13 8 16 11 24 12 C16 13 13 16 12 24 C11 16 8 13 0 12 C8 11 11 8 12 0Z" fill={color} />
  </svg>
);

export const BlingLogo: React.FC<{ size?: number; light?: boolean }> = ({ size = 160, light }) => {
  const frame = useCurrentFrame();
  const tw = 0.85 + Math.sin(frame / 6) * 0.15;
  return (
    <div style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: size * 0.12 }}>
      <div style={{ width: size * 0.82, height: size * 0.82, borderRadius: size * 0.24, background: `linear-gradient(145deg, ${B.coral}, ${B.coralDark})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 14px 30px rgba(224,64,30,.45), inset 0 3px 0 rgba(255,255,255,.35)" }}>
        <span style={{ fontFamily: POPPINS, fontWeight: 800, fontSize: size * 0.62, color: B.white, marginTop: -size * 0.04 }}>b</span>
      </div>
      <span style={{ fontFamily: POPPINS, fontWeight: 800, fontSize: size * 0.78, color: light ? B.white : B.ink, letterSpacing: "-0.03em" }}>bling</span>
      <Spark size={size * 0.34 * tw} style={{ position: "absolute", left: size * 0.62, top: -size * 0.16 }} />
    </div>
  );
};

/* ---------- falling invoices (cut-out pile from Magnific, or drawn sheets) ---------- */
const Sheet: React.FC<{ w: number }> = ({ w }) => (
  <div style={{ width: w, height: w * 1.3, background: "#FFFDF7", borderRadius: 10, boxShadow: "0 12px 24px rgba(0,0,0,.25)", padding: w * 0.1, boxSizing: "border-box", border: "2px solid #EADFCB" }}>
    <div style={{ height: w * 0.08, width: "55%", background: B.coral, borderRadius: 4, marginBottom: w * 0.08 }} />
    {[90, 70, 85, 60, 75].map((p, i) => (
      <div key={i} style={{ height: w * 0.04, width: `${p}%`, background: "#D6CDBE", borderRadius: 3, marginBottom: w * 0.06 }} />
    ))}
    <div style={{ marginTop: w * 0.06, fontFamily: POPPINS, fontWeight: 800, fontSize: w * 0.12, color: B.ink }}>$ ---</div>
  </div>
);

export const FallingInvoices: React.FC<{ at: number; count?: number; floorY?: number }> = ({ at, count = 14, floorY = 1500 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const usePile = hasAsset("bling/facturas.png");
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: count }).map((_, i) => {
        const seed = (i * 7919) % 101;
        const x = 40 + ((seed * 9.7) % 920);
        const delay = at + (i % 7) * 2 + Math.floor(i / 7) * 3;
        const p = spring({ frame: frame - delay, fps, config: { damping: 9, stiffness: 90, mass: 0.8 } });
        if (frame < delay) return null;
        const y = interpolate(p, [0, 1], [-500, floorY - (seed % 5) * 70 - Math.floor(i / 5) * 60]);
        const rot = ((seed % 60) - 30) * (0.4 + p * 0.6);
        const w = 210 + (seed % 4) * 30;
        return (
          <div key={i} style={{ position: "absolute", left: x - w / 2, top: y - w * 0.65, transform: `rotate(${rot}deg)` }}>
            {usePile && i % 3 === 0 ? <Img src={staticFile("bling/facturas.png")} style={{ width: w * 1.5 }} /> : <Sheet w={w} />}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* ---------- screen shake helper ---------- */
export const useShake = (at: number, dur = 14, amp = 18) => {
  const frame = useCurrentFrame();
  const k = interpolate(frame, [at, at + dur], [1, 0], clamp);
  if (frame < at) return "none";
  return `translate(${Math.sin(frame * 2.7) * amp * k}px, ${Math.cos(frame * 3.3) * amp * k}px)`;
};

/* ---------- clock: Magnific face + spinning hands ---------- */
export const Clock: React.FC<{ size: number; speed: number }> = ({ size, speed }) => {
  const frame = useCurrentFrame();
  const min = frame * speed;
  const hour = min / 12;
  const hand = (deg: number, len: number, w: number, c: string) => (
    <div style={{ position: "absolute", left: size / 2 - w / 2, top: size / 2 - len, width: w, height: len, background: c, borderRadius: w, transformOrigin: `50% ${len}px`, transform: `rotate(${deg}deg)` }} />
  );
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      {hasAsset("bling/reloj.png") ? (
        <Img src={staticFile("bling/reloj.png")} style={{ width: size, height: size, objectFit: "contain" }} />
      ) : (
        <div style={{ width: size, height: size, borderRadius: "50%", background: B.white, border: `${size * 0.07}px solid ${B.coral}`, boxSizing: "border-box", boxShadow: "0 16px 30px rgba(0,0,0,.25)" }} />
      )}
      {hand(hour, size * 0.24, size * 0.05, B.ink)}
      {hand(min, size * 0.34, size * 0.032, B.coralDark)}
      <div style={{ position: "absolute", left: size / 2 - size * 0.04, top: size / 2 - size * 0.04, width: size * 0.08, height: size * 0.08, borderRadius: "50%", background: B.ink }} />
    </div>
  );
};

/* ---------- phone with the Bling app ---------- */
const ROWS = [
  { k: "ventas", t: "Ventas", v: "$12,480", s: "38 ventas hoy", c: B.coral, d: "M4 17l5-5 4 4 7-8M15 8h5v5" },
  { k: "inventario", t: "Inventario", v: "248", s: "productos al día", c: B.sky, d: "M3 7l9-4 9 4-9 4zM3 7v10l9 4 9-4V7M12 11v10" },
  { k: "facturas", t: "Facturas", v: "36", s: "emitidas este mes", c: B.sun, d: "M6 3h9l4 4v14H6zM15 3v4h4M9 12h7M9 16h5" },
];

export const PhoneApp: React.FC<{ on: number; checks: number[]; synced: number }> = ({ on, checks, synced }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ width: 560, height: 1140, borderRadius: 86, background: "linear-gradient(160deg, #2B2850, #15132E)", padding: 22, boxSizing: "border-box", boxShadow: "0 50px 90px rgba(30,27,75,.45), inset 0 2px 0 rgba(255,255,255,.2)", border: "4px solid #3D3A6B" }}>
      <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 66, overflow: "hidden", background: "#0E0C22" }}>
        <div style={{ position: "absolute", inset: 0, background: B.cream, opacity: on }}>
          {/* header */}
          <div style={{ background: `linear-gradient(150deg, ${B.coral}, ${B.coralDark})`, padding: "70px 34px 34px", color: B.white, fontFamily: POPPINS }}>
            <div style={{ transform: "scale(.5)", transformOrigin: "0 50%", height: 80, marginLeft: -6 }}>
              <BlingLogo size={150} light />
            </div>
            <div style={{ fontSize: 26, fontWeight: 500, opacity: 0.9, marginTop: 6 }}>Hola, Lupita 👋</div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 16, background: "rgba(255,255,255,.2)", borderRadius: 999, padding: "8px 16px", width: "fit-content", fontSize: 21, fontWeight: 600 }}>
              <span style={{ width: 12, height: 12, borderRadius: "50%", background: synced > 0.5 ? "#7CFFB2" : B.sun }} />
              {synced > 0.5 ? "Todo sincronizado" : "Sincronizando…"}
            </div>
          </div>
          {/* rows */}
          <div style={{ padding: "26px 24px", display: "flex", flexDirection: "column", gap: 20 }}>
            {ROWS.map((r, i) => {
              const ck = spring({ frame: frame - checks[i], fps, config: { damping: 9, stiffness: 180 } });
              const fill = interpolate(frame, [checks[i] - 18, checks[i]], [0.15, 1], clamp);
              return (
                <div key={r.k} style={{ background: B.white, borderRadius: 30, padding: "22px 22px", display: "flex", alignItems: "center", gap: 18, boxShadow: "0 8px 22px rgba(30,27,75,.08)", fontFamily: POPPINS }}>
                  <div style={{ width: 74, height: 74, borderRadius: 22, background: `${r.c}26`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width={42} height={42} viewBox="0 0 24 24">
                      <path d={r.d} fill="none" stroke={r.c === B.sun ? "#C99000" : r.c} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 24, fontWeight: 600, color: "#6B678F" }}>{r.t}</div>
                    <div style={{ fontSize: 40, fontWeight: 800, color: B.ink, lineHeight: 1.1 }}>{r.v}</div>
                    <div style={{ marginTop: 8, height: 10, borderRadius: 5, background: "#EEE9F6", overflow: "hidden" }}>
                      <div style={{ width: `${fill * 100}%`, height: "100%", background: r.c, borderRadius: 5 }} />
                    </div>
                  </div>
                  <div style={{ width: 58, height: 58, borderRadius: "50%", background: B.mint, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${ck})`, boxShadow: "0 8px 18px rgba(34,197,94,.45)", flexShrink: 0 }}>
                    <svg width={34} height={34} viewBox="0 0 24 24">
                      <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#fff" strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              );
            })}
            <div style={{ marginTop: 6, background: B.ink, color: B.white, borderRadius: 26, padding: "22px 26px", fontFamily: POPPINS, fontSize: 24, fontWeight: 600, display: "flex", justifyContent: "space-between", alignItems: "center", opacity: synced }}>
              <span>Todo en un solo lugar</span>
              <Spark size={32} />
            </div>
          </div>
        </div>
        {/* notch */}
        <div style={{ position: "absolute", top: 18, left: "50%", transform: "translateX(-50%)", width: 150, height: 40, borderRadius: 20, background: "#0E0C22" }} />
        {/* power-on flash */}
        <div style={{ position: "absolute", inset: 0, background: B.white, opacity: interpolate(on, [0, 0.4, 1], [0, 0.9, 0]) }} />
      </div>
    </div>
  );
};
