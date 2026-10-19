// Scenes of the Fispal "múltiples RFC" reel (parrilla 2, reel 5). Brand
// purple gradient with mint and lilac glows and a radar-ring pattern; a lift
// (3D rise) transition. Every scene keeps its visual centred in the band
// between the top safe area and the subtitles (y ≈ 290–1360) and fills it.
import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Illus } from "../fispal/Illus";
import { FONT, MONO, s } from "../fispal/theme";
import { CUE } from "./timeline";

type P = { from: number };
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);

const V = {
  p1: "#4326D9",
  p2: "#250E94",
  p3: "#160758",
  mint: "#3FD497",
  lilac: "#A898FF",
  coral: "#FF7A7A",
  white: "#FFFFFF",
  sub: "rgba(255,255,255,.7)",
  glass: "rgba(255,255,255,.1)",
  line: "rgba(255,255,255,.2)",
};

export const CENTER_Y = 830;

/* ---------- background ---------- */
export const PurpleBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const a = frame / 80;
  return (
    <AbsoluteFill style={{ background: `linear-gradient(165deg, ${V.p1} 0%, ${V.p2} 45%, ${V.p3} 100%)`, overflow: "hidden" }}>
      <div style={{ position: "absolute", width: 900, height: 900, right: -380 + Math.sin(a) * 80, top: -300, borderRadius: "50%", background: V.lilac, filter: "blur(170px)", opacity: 0.55 }} />
      <div style={{ position: "absolute", width: 800, height: 800, left: -420, top: 900 + Math.cos(a) * 80, borderRadius: "50%", background: V.mint, filter: "blur(200px)", opacity: 0.28 }} />
      {/* radar rings centred on the visual band */}
      {[0, 1, 2, 3, 4].map((i) => {
        const r = ((frame * 2 + i * 180) % 900) + 100;
        return <div key={i} style={{ position: "absolute", left: 540 - r, top: CENTER_Y - r, width: r * 2, height: r * 2, borderRadius: "50%", border: "1.5px solid rgba(255,255,255,.08)", opacity: 1 - r / 1000 }} />;
      })}
    </AbsoluteFill>
  );
};

/* ---------- lift transition: incoming rises tilted, outgoing lifts away ---------- */
export const LiftScene: React.FC<{ duration: number; first?: boolean; last?: boolean; overlap: number; children: React.ReactNode }> = ({ duration, first, last, overlap, children }) => {
  const frame = useCurrentFrame();
  const inP = first ? 1 : interpolate(frame, [0, overlap], [0, 1], { ...clamp, easing: easeOut });
  const outP = last ? 0 : interpolate(frame, [duration - overlap, duration], [0, 1], { ...clamp, easing: (x) => x * x });
  const y = (1 - inP) * 500 - outP * 380;
  const rx = (1 - inP) * 28 - outP * 20;
  const sc = (0.9 + 0.1 * inP) * (1 - 0.1 * outP);
  return (
    <AbsoluteFill style={{ perspective: 1600 }}>
      <AbsoluteFill style={{ transform: `translateY(${y}px) rotateX(${rx}deg) scale(${sc})`, opacity: Math.min(inP * 1.4, 1 - outP) }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------- pieces ---------- */
const Glass: React.FC<{ style?: React.CSSProperties; children?: React.ReactNode; glow?: number }> = ({ style, children, glow = 0 }) => (
  <div style={{ background: V.glass, border: `1.5px solid ${glow ? `rgba(63,212,151,${0.4 + 0.6 * glow})` : V.line}`, borderRadius: 34, boxShadow: `inset 0 1px 0 rgba(255,255,255,.2), 0 30px 70px rgba(10,0,60,.4)${glow ? `, 0 0 ${50 * glow}px rgba(63,212,151,${0.4 * glow})` : ""}`, backdropFilter: "blur(16px)", fontFamily: FONT, color: V.white, ...style }}>{children}</div>
);

const Icon: React.FC<{ d: string; size?: number; color?: string; sw?: number }> = ({ d, size = 40, color = V.white, sw = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
    <path d={d} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IC = {
  building: "M4 21V5l8-3v19M12 8l8 3v10M2 21h20M7 9h2M7 13h2M7 17h2M15 13h2M15 17h2",
  doc: "M7 3h7l5 5v13H7zM14 3v5h5M10 12h6M10 16h6",
  db: "M12 3c4.4 0 8 1.3 8 3s-3.6 3-8 3-8-1.3-8-3 3.6-3 8-3zM4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3",
  users: "M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M16 4.5a3.5 3.5 0 0 1 0 6.5M18 14.5c1.9.8 3 2.8 3 5.5",
  search: "M10.5 4a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM15.5 15.5L20 20",
  globe: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c2.5 2.5 3.8 5.5 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.5-3.8-9S9.5 5.5 12 3z",
  check: "M5 12.5l4.5 4.5L19 7.5",
  chev: "M6 9l6 6 6-6",
};

const COMPANIES = [
  { n: "Grupo Andino", rfc: "GAN150312KL4", c: "#3FD497" },
  { n: "Comercial Rivas", rfc: "CRI180704P92", c: "#FFC14D" },
  { n: "Servicios Lumen", rfc: "SLU201119HT6", c: "#FF7A7A" },
];

const useSpr = (at: number, damping = 12, stiffness = 170) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - at, fps, config: { damping, stiffness } });
};

/* ---------- 👀 drawn eyes (emoji fonts are not reliable in the renderer) ---------- */
const Eyes: React.FC<{ size: number }> = ({ size }) => {
  const frame = useCurrentFrame();
  const look = Math.sin(frame / 7) * size * 0.12;
  const eye = (k: number) => (
    <div key={k} style={{ width: size * 0.46, height: size * 0.6, borderRadius: "50%", background: "#fff", position: "relative", boxShadow: "0 8px 20px rgba(0,0,0,.3)" }}>
      <div style={{ position: "absolute", width: size * 0.2, height: size * 0.24, borderRadius: "50%", background: "#1A1A2E", left: size * 0.13 + look, top: size * 0.2 }} />
    </div>
  );
  return <div style={{ display: "flex", gap: size * 0.06 }}>{[0, 1].map(eye)}</div>;
};

/* ---------- 1. 3 empresas. 3 RFC. ¿3 lugares distintos? ---------- */
export const S1Tres: React.FC<P> = ({ from }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const L = (t: number) => s(t) - from;
  const rfcAt = L(CUE.rfc);
  const split = interpolate(frame, [L(CUE.lugares), L(CUE.lugares) + 14], [0, 1], { ...clamp, easing: easeOut });
  const eyes = useSpr(L(CUE.lugares) + 4, 8, 170);
  return (
    <AbsoluteFill>
      {COMPANIES.map((c, i) => {
        const p = spring({ frame: frame - 2 - i * 5, fps, config: { damping: 12, stiffness: 160 } });
        const typed = c.rfc.slice(0, Math.max(0, Math.floor((frame - rfcAt - i * 4) / 1.2)));
        const y = 400 + i * 300;
        // on "3 lugares" each card slides left and gets its own portal on the right
        return (
          <React.Fragment key={c.n}>
            <div style={{ position: "absolute", left: 80 - split * 40, top: y, width: 920 - split * 330, opacity: Math.min(1, p * 1.5), transform: `translateX(${(1 - p) * (i % 2 ? 300 : -300)}px)` }}>
              <Glass style={{ height: 240, boxSizing: "border-box", padding: "0 36px", display: "flex", alignItems: "center", gap: 28 }}>
                <div style={{ width: 130, height: 130, borderRadius: 36, background: c.c, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon d={IC.building} size={74} color="#1A0A6B" sw={1.8} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 800, fontSize: 44, whiteSpace: "nowrap" }}>{c.n}</div>
                  <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 32, color: V.mint, marginTop: 8, minHeight: 40 }}>{typed}</div>
                </div>
              </Glass>
            </div>
            {split > 0 && (
              <div style={{ position: "absolute", left: 680 + (1 - split) * 200, top: y + 30, width: 300, opacity: split }}>
                <svg width={120} height={40} style={{ position: "absolute", left: -110, top: 70 }}>
                  <line x1={0} y1={20} x2={110} y2={20} stroke={V.lilac} strokeWidth={4} strokeDasharray="10 8" strokeDashoffset={-frame * 2} />
                </svg>
                <div style={{ background: "#FFFFFF", borderRadius: 24, padding: "22px 22px", height: 180, boxSizing: "border-box", boxShadow: "0 20px 50px rgba(10,0,60,.4)", fontFamily: FONT }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Icon d={IC.globe} size={30} color={V.p2} />
                    <span style={{ fontFamily: MONO, fontSize: 20, color: "#5E6480" }}>portal-{["a", "b", "c"][i]}.mx</span>
                  </div>
                  {[0.9, 0.6].map((w, k) => (
                    <div key={k} style={{ height: 30, width: `${w * 100}%`, borderRadius: 8, border: "2px solid #E1E3EC", marginTop: 14 }} />
                  ))}
                </div>
              </div>
            )}
          </React.Fragment>
        );
      })}
      {frame >= L(CUE.lugares) + 4 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 270, display: "flex", justifyContent: "center", transform: `scale(${eyes}) translateY(${Math.sin(frame / 4) * 6}px)` }}>
          <Eyes size={130} />
        </div>
      )}
    </AbsoluteFill>
  );
};

/* ---------- 2. Más empresas → más CFDI, información, usuarios, lugares ---------- */
const STATS: { k: keyof typeof CUE; label: string; to: number; fmt: (n: number) => string; icon: string }[] = [
  { k: "mas", label: "Empresas", to: 3, fmt: (n) => String(Math.round(n)), icon: IC.building },
  { k: "cfdi", label: "CFDI", to: 42180, fmt: (n) => Math.round(n).toLocaleString("en-US"), icon: IC.doc },
  { k: "informacion", label: "Información", to: 18.4, fmt: (n) => `${n.toFixed(1)} GB`, icon: IC.db },
  { k: "usuarios", label: "Usuarios", to: 24, fmt: (n) => String(Math.round(n)), icon: IC.users },
];

export const S2Mas: React.FC<P> = ({ from }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const L = (t: number) => s(t) - from;
  const pins = L(CUE.donde) - 8;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 70, right: 70, top: 330, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30 }}>
        {STATS.map((st, i) => {
          const at = L(CUE[st.k]) + (i === 0 ? 4 : 0);
          const p = spring({ frame: frame - at, fps, config: { damping: 10, stiffness: 170 } });
          const n = interpolate(frame, [at, at + 24], [0, st.to], { ...clamp, easing: easeOut });
          const bump = interpolate(frame, [at + 20, at + 26, at + 34], [0, 1, 0], clamp);
          return (
            <div key={st.label} style={{ opacity: Math.min(1, p * 1.5), transform: `scale(${0.7 + 0.3 * p})` }}>
              <Glass style={{ height: 330, boxSizing: "border-box", padding: "34px 34px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ width: 84, height: 84, borderRadius: 24, background: "rgba(63,212,151,.18)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon d={st.icon} size={46} color={V.mint} />
                  </div>
                  <div style={{ fontWeight: 800, fontSize: 44, color: V.mint, transform: `scale(${1 + bump * 0.4})` }}>+</div>
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: st.to > 1000 ? 66 : 82, lineHeight: 1, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>{st.fmt(n)}</div>
                  <div style={{ fontWeight: 600, fontSize: 32, color: V.sub, marginTop: 10 }}>{st.label}</div>
                </div>
              </Glass>
            </div>
          );
        })}
      </div>
      {/* more and more places to search */}
      <div style={{ position: "absolute", left: 70, right: 70, top: 1080, height: 250 }}>
        {Array.from({ length: 9 }).map((_, i) => {
          const at = pins + i * 3;
          const p = spring({ frame: frame - at, fps, config: { damping: 9, stiffness: 200 } });
          if (frame < at) return null;
          const x = (i % 5) * 205 + 18 + (i >= 5 ? 102 : 0);
          const y = i >= 5 ? 130 : 0;
          return (
            <div key={i} style={{ position: "absolute", left: x, top: y + Math.sin((frame + i * 10) / 10) * 5, transform: `scale(${p})` }}>
              <div style={{ width: 110, height: 110, borderRadius: 32, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 14px 30px rgba(10,0,60,.35)" }}>
                <Icon d={IC.search} size={56} color={V.p2} sw={2.4} />
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 3. no debería multiplicar el trabajo — ×3 stacks, crossed out ---------- */
export const S3Multiplicar: React.FC<P> = ({ from }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const L = (t: number) => s(t) - from;
  const grow = interpolate(frame, [4, L(CUE.multiplicar) + 10], [0, 1], clamp);
  const x3 = useSpr(L(CUE.multiplicar) - 6, 8, 170);
  const strike = interpolate(frame, [L(CUE.multiplicar) + 14, L(CUE.multiplicar) + 24], [0, 1], { ...clamp, easing: easeOut });
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 80, right: 80, top: 640, height: 700, display: "flex", gap: 40, alignItems: "flex-end" }}>
        {COMPANIES.map((c, ci) => {
          const n = Math.max(1, Math.round(grow * 8));
          return (
            <div key={c.n} style={{ flex: 1, display: "flex", flexDirection: "column-reverse", alignItems: "center", gap: 10 }}>
              <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 22, color: V.sub, marginTop: 14 }}>{c.rfc.slice(0, 3)}…</div>
              {Array.from({ length: n }).map((_, k) => {
                const p = spring({ frame: frame - 4 - k * 4 - ci * 2, fps, config: { damping: 12, stiffness: 200 } });
                return (
                  <div key={k} style={{ width: "100%", height: 62, borderRadius: 16, background: k % 2 ? "rgba(255,255,255,.16)" : "rgba(255,255,255,.24)", border: `1.5px solid ${V.line}`, transform: `translateY(${(1 - p) * -120}px)`, opacity: p, display: "flex", alignItems: "center", gap: 10, padding: "0 16px", boxSizing: "border-box" }}>
                    <div style={{ width: 22, height: 22, borderRadius: 6, border: `3px solid ${c.c}` }} />
                    <div style={{ flex: 1, height: 12, borderRadius: 6, background: "rgba(255,255,255,.4)" }} />
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      {/* ×3 */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", justifyContent: "center", transform: `scale(${x3})` }}>
        <div style={{ position: "relative", fontFamily: FONT, fontWeight: 800, fontSize: 260, color: V.coral, lineHeight: 1, textShadow: "0 20px 60px rgba(255,122,122,.45)" }}>
          ×3
          <div style={{ position: "absolute", left: -20, top: "52%", height: 22, width: `${strike * 120}%`, borderRadius: 11, background: V.mint, transform: "rotate(-12deg)", boxShadow: "0 0 30px rgba(63,212,151,.7)" }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 4. Fispal: múltiples RFC desde una misma cuenta ---------- */
const NUMS = [
  ["14,735", "$12.4 M", "36"],
  ["9,208", "$6.1 M", "21"],
  ["18,237", "$15.8 M", "44"],
];

export const S4Cuenta: React.FC<P> = ({ from }) => {
  const frame = useCurrentFrame();
  const L = (t: number) => s(t) - from;
  const win = useSpr(0, 13, 150);
  const open = interpolate(frame, [L(CUE.multiples) - 10, L(CUE.multiples) + 2], [0, 1], { ...clamp, easing: easeOut });
  const cycleStart = L(CUE.multiples) + 4;
  const sel = frame < cycleStart ? 0 : Math.min(2, Math.floor((frame - cycleStart) / 14));
  const closed = interpolate(frame, [L(CUE.cuenta) - 6, L(CUE.cuenta) + 4], [0, 1], clamp);
  const menu = open * (1 - closed);
  const one = useSpr(L(CUE.cuenta) - 2, 9, 170);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 70, right: 70, top: 300, height: 1060, opacity: Math.min(1, win * 1.5), transform: `scale(${0.9 + 0.1 * win})` }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 40, background: "#F6F7FC", boxShadow: "0 40px 100px rgba(10,0,60,.5)", overflow: "hidden", fontFamily: FONT, color: "#131313" }}>
          {/* header */}
          <div style={{ height: 110, background: "#fff", display: "flex", alignItems: "center", padding: "0 36px", borderBottom: "1px solid #E6E8F0" }}>
            <Img src={staticFile("brand/fispal-logo.png")} style={{ height: 50 }} />
            <span style={{ marginLeft: "auto", fontFamily: MONO, fontWeight: 700, fontSize: 22, color: "#5E6480", letterSpacing: "0.06em" }}>MI CUENTA</span>
          </div>
          {/* RFC switcher */}
          <div style={{ margin: "30px 36px 0", position: "relative", zIndex: 3 }}>
            <div style={{ background: "#fff", borderRadius: 22, border: `3px solid ${V.p2}`, padding: "22px 26px", display: "flex", alignItems: "center", gap: 18 }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: COMPANIES[sel].c, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon d={IC.building} size={34} color="#1A0A6B" />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 34 }}>{COMPANIES[sel].n}</div>
                <div style={{ fontFamily: MONO, fontSize: 24, color: "#5E6480" }}>{COMPANIES[sel].rfc}</div>
              </div>
              <div style={{ marginLeft: "auto", transform: `rotate(${menu * 180}deg)` }}>
                <Icon d={IC.chev} size={40} color={V.p2} sw={2.6} />
              </div>
            </div>
            {menu > 0.02 && (
              <div style={{ position: "absolute", left: 0, right: 0, top: 128, background: "#fff", borderRadius: 22, boxShadow: "0 30px 60px rgba(10,0,60,.25)", overflow: "hidden", transformOrigin: "50% 0", transform: `scaleY(${menu})`, opacity: menu }}>
                {COMPANIES.map((c, i) => (
                  <div key={c.rfc} style={{ display: "flex", alignItems: "center", gap: 16, padding: "20px 26px", background: i === sel ? "rgba(63,212,151,.16)" : "#fff", borderBottom: i < 2 ? "1px solid #EEF0F6" : "none" }}>
                    <div style={{ width: 20, height: 20, borderRadius: 10, background: c.c }} />
                    <span style={{ fontWeight: 700, fontSize: 30 }}>{c.n}</span>
                    <span style={{ marginLeft: "auto", fontFamily: MONO, fontSize: 22, color: "#5E6480" }}>{c.rfc}</span>
                    {i === sel && <Icon d={IC.check} size={30} color="#20B07E" sw={3} />}
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* dashboard tiles: numbers follow the selected RFC */}
          <div style={{ margin: "34px 36px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}>
            {["CFDI", "Facturado", "Usuarios", "Estatus"].map((lab, i) => (
              <div key={lab} style={{ background: "#fff", borderRadius: 24, padding: "28px 28px", boxShadow: "0 8px 22px rgba(37,14,148,.06)", height: i < 2 ? 170 : 150, boxSizing: "border-box" }}>
                <div style={{ fontWeight: 600, fontSize: 26, color: "#5E6480" }}>{lab}</div>
                <div key={sel} style={{ fontWeight: 800, fontSize: 52, marginTop: 10, color: i === 3 ? "#20B07E" : "#131313" }}>{i === 3 ? "Al día" : NUMS[sel][i]}</div>
              </div>
            ))}
          </div>
          <div style={{ margin: "0 36px", background: "#fff", borderRadius: 24, height: 250, padding: 28, boxSizing: "border-box", display: "flex", alignItems: "flex-end", gap: 16 }}>
            {[0.5, 0.75, 0.6, 0.9, 0.7, 1, 0.8].map((h, i) => (
              <div key={i} style={{ flex: 1, height: `${h * (0.7 + 0.1 * sel) * 100}%`, borderRadius: 10, background: i === 5 ? COMPANIES[sel].c : "#DCDFF0" }} />
            ))}
          </div>
        </div>
        {/* "1 cuenta" badge */}
        <div style={{ position: "absolute", right: -20, top: -30, transform: `scale(${one}) rotate(8deg)` }}>
          <div style={{ background: V.mint, color: "#0F3A2A", fontFamily: FONT, fontWeight: 800, fontSize: 38, borderRadius: 999, padding: "16px 32px", boxShadow: "0 16px 40px rgba(63,212,151,.5)" }}>1 cuenta · 3 RFC</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 5. Varias empresas. Una gestión más centralizada (hub & spokes) ---------- */
export const S5Hub: React.FC<P> = ({ from }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const L = (t: number) => s(t) - from;
  const hub = useSpr(L(CUE.centralizada) - 30, 10, 150);
  const link = interpolate(frame, [L(CUE.centralizada) - 20, L(CUE.centralizada) + 4], [0, 1], { ...clamp, easing: easeOut });
  const nodes = [
    { x: 260, y: 470 },
    { x: 820, y: 470 },
    { x: 540, y: 1250 },
  ];
  const cx = 540;
  const cy = 800;
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {nodes.map((n, i) => {
          const len = Math.hypot(cx - n.x, cy - n.y);
          return (
            <g key={i}>
              <line x1={n.x} y1={n.y} x2={cx} y2={cy} stroke={V.mint} strokeWidth={6} strokeDasharray={len} strokeDashoffset={len * (1 - link)} strokeLinecap="round" />
              {link >= 1 &&
                [0, 1, 2].map((k) => {
                  const t = ((frame / 30 + k / 3) % 1);
                  return <circle key={k} cx={n.x + (cx - n.x) * t} cy={n.y + (cy - n.y) * t} r={9} fill="#fff" opacity={1 - t * 0.5} />;
                })}
            </g>
          );
        })}
      </svg>
      {COMPANIES.map((c, i) => {
        const p = spring({ frame: frame - 2 - i * 5, fps, config: { damping: 11, stiffness: 170 } });
        const n = nodes[i];
        return (
          <div key={c.n} style={{ position: "absolute", left: n.x, top: n.y, transform: `translate(-50%, -50%) scale(${p})` }}>
            <Glass style={{ width: 330, padding: "26px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
              <div style={{ width: 100, height: 100, borderRadius: 30, background: c.c, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon d={IC.building} size={58} color="#1A0A6B" sw={1.8} />
              </div>
              <div style={{ fontWeight: 800, fontSize: 32, whiteSpace: "nowrap" }}>{c.n}</div>
              <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 22, color: V.mint }}>{c.rfc}</div>
            </Glass>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: cx - 175, top: cy - 175, width: 350, height: 350, transform: `scale(${hub})` }}>
        <div style={{ position: "absolute", inset: -30, borderRadius: "50%", border: `3px solid rgba(63,212,151,.5)`, transform: `scale(${1 + 0.05 * Math.sin(frame / 6)})` }} />
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 80px rgba(63,212,151,.55), 0 30px 70px rgba(10,0,60,.45)" }}>
          <Img src={staticFile("brand/fispal-logo.png")} style={{ width: 250 }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 6. ¿Tu equipo administra más de un RFC? ---------- */
export const S6Pregunta: React.FC<P> = ({ from }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const L = (t: number) => s(t) - from;
  const pick = L(CUE.rfcQ) + 2;
  const opts = ["1 RFC", "2 a 3 RFC", "4 RFC o más"];
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 100, right: 100, top: 380, display: "flex", flexDirection: "column", gap: 56 }}>
        {opts.map((o, i) => {
          const p = spring({ frame: frame - 2 - i * 5, fps, config: { damping: 12, stiffness: 170 } });
          const chosen = i === 1 && frame >= pick;
          const ck = spring({ frame: frame - pick, fps, config: { damping: 9, stiffness: 200 } });
          return (
            <div key={o} style={{ opacity: Math.min(1, p * 1.5), transform: `translateX(${(1 - p) * 200}px) scale(${chosen ? 1 + 0.04 * Math.min(1, ck) : 1})` }}>
              <Glass glow={chosen ? 1 : 0} style={{ height: 240, boxSizing: "border-box", padding: "0 50px", display: "flex", alignItems: "center", gap: 30 }}>
                <div style={{ width: 70, height: 70, borderRadius: 20, border: `4px solid ${chosen ? V.mint : V.line}`, background: chosen ? V.mint : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {chosen && <div style={{ transform: `scale(${ck})` }}><Icon d={IC.check} size={46} color="#0F3A2A" sw={3.4} /></div>}
                </div>
                <span style={{ fontWeight: 800, fontSize: 64 }}>{o}</span>
              </Glass>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 7. CTA ---------- */
export const S7Cta: React.FC<P> = ({ from }) => {
  const frame = useCurrentFrame();
  const L = (t: number) => s(t) - from;
  const logo = useSpr(4, 11, 150);
  const btn = useSpr(Math.max(8, L(CUE.gratis) - 4), 8, 170);
  const url = useSpr(L(CUE.url), 12, 170);
  const pulse = 1 + 0.04 * Math.max(0, Math.sin(frame / 5));
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <Illus name="esfera" at={2} x={540} y={470} size={420} />
      {COMPANIES.map((c, i) => {
        const ang = (i / 3) * Math.PI * 2 + frame / 50;
        return (
          <div key={c.rfc} style={{ position: "absolute", left: 540 + Math.cos(ang) * 330, top: 470 + Math.sin(ang) * 150, transform: `translate(-50%, -50%) scale(${logo})`, zIndex: Math.sin(ang) > 0 ? 2 : 0 }}>
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 24, color: "#1A0A6B", background: c.c, borderRadius: 999, padding: "10px 20px" }}>{c.rfc}</div>
          </div>
        );
      })}
      <div style={{ position: "absolute", top: 760, transform: `scale(${0.85 + 0.15 * logo})`, opacity: logo }}>
        <Img src={staticFile("brand/fispal-logo-white.png")} style={{ width: 640 }} />
      </div>
      <div style={{ position: "absolute", top: 1060, transform: `scale(${btn * pulse})` }}>
        <div style={{ background: V.mint, color: "#0F3A2A", fontFamily: FONT, fontWeight: 800, fontSize: 52, borderRadius: 999, padding: "30px 74px", boxShadow: "0 20px 50px rgba(63,212,151,.45)" }}>Empieza gratis →</div>
      </div>
      <div style={{ position: "absolute", top: 1260, opacity: url, transform: `translateY(${(1 - url) * 20}px)` }}>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 34, color: V.white, background: "rgba(255,255,255,.12)", border: `1px solid ${V.line}`, borderRadius: 999, padding: "14px 34px" }}>fispal.mx</div>
      </div>
    </AbsoluteFill>
  );
};
