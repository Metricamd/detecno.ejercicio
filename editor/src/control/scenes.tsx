// Scenes of the Fispal "control" reel (parrilla 2, reel 2). Dark version of
// the Fispal look: deep navy, dark glass cards, the same green accent, glass
// illustrations and subtitles. Every scene gets `from` (its first reel frame).
import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Illus } from "../fispal/Illus";
import { C, FONT, MONO, s } from "../fispal/theme";
import { CUE } from "./timeline";

type P = { from: number };
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const BPM = 112;

export const D = {
  bg1: "#0A0820",
  bg2: "#15103F",
  glass: "rgba(255,255,255,.06)",
  line: "rgba(255,255,255,.12)",
  text: "#FFFFFF",
  sub: "rgba(255,255,255,.62)",
  violet: "#7B61FF",
  coral: "#FF6B6B",
};

const useBeat = () => {
  const frame = useCurrentFrame();
  const t = (frame / 30) % (60 / BPM);
  return Math.exp(-t * 9);
};

/* ---------- dark background: gradient, glows that pulse with the beat, grid ---------- */
export const DarkBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const beat = useBeat();
  const drift = Math.sin(frame / 70) * 50;
  return (
    <AbsoluteFill style={{ background: `linear-gradient(170deg, ${D.bg2} 0%, ${D.bg1} 70%)`, overflow: "hidden" }}>
      <div style={{ position: "absolute", width: 1100, height: 1100, right: -460 + drift, top: -420, borderRadius: "50%", background: C.purple, filter: "blur(170px)", opacity: 0.9, transform: `scale(${1 + 0.05 * beat})` }} />
      <div style={{ position: "absolute", width: 900, height: 900, left: -520, top: 700 - drift, borderRadius: "50%", background: C.accent, filter: "blur(220px)", opacity: 0.16, transform: `scale(${1 + 0.05 * beat})` }} />
      {/* perspective grid on the floor */}
      <div style={{ position: "absolute", left: -540, right: -540, bottom: -200, height: 900, transform: "perspective(900px) rotateX(62deg)", transformOrigin: "50% 100%", backgroundImage: `linear-gradient(${D.line} 1px, transparent 1px), linear-gradient(90deg, ${D.line} 1px, transparent 1px)`, backgroundSize: "90px 90px", backgroundPosition: `0 ${(frame * 1.5) % 90}px`, opacity: 0.35, maskImage: "linear-gradient(180deg, transparent, #000 60%)", WebkitMaskImage: "linear-gradient(180deg, transparent, #000 60%)" }} />
    </AbsoluteFill>
  );
};

/* ---------- dark glass pieces ---------- */
export const Glass: React.FC<{ style?: React.CSSProperties; children?: React.ReactNode; glow?: number }> = ({ style, children, glow = 0 }) => (
  <div
    style={{
      background: D.glass,
      border: `1.5px solid ${glow > 0 ? `rgba(32,217,157,${0.3 + 0.6 * glow})` : D.line}`,
      borderRadius: 32,
      boxShadow: `inset 0 1px 0 rgba(255,255,255,.12), 0 30px 80px rgba(0,0,0,.45)${glow > 0 ? `, 0 0 ${60 * glow}px rgba(32,217,157,${0.35 * glow})` : ""}`,
      backdropFilter: "blur(18px)",
      fontFamily: FONT,
      color: D.text,
      ...style,
    }}
  >
    {children}
  </div>
);

const Tag: React.FC<{ children: React.ReactNode; color?: string; style?: React.CSSProperties }> = ({ children, color = C.accent, style }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 12, fontFamily: MONO, fontWeight: 700, fontSize: 24, letterSpacing: "0.08em", textTransform: "uppercase", color: D.text, background: "rgba(255,255,255,.08)", border: `1px solid ${D.line}`, borderRadius: 999, padding: "12px 26px", ...style }}>
    <span style={{ width: 11, height: 11, borderRadius: 6, background: color, boxShadow: `0 0 12px ${color}` }} />
    {children}
  </div>
);

const Icon: React.FC<{ d: string; size?: number; color?: string; sw?: number }> = ({ d, size = 40, color = D.text, sw = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
    <path d={d} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IC = {
  doc: "M7 3h7l5 5v13H7zM14 3v5h5M10 12h6M10 16h6",
  chart: "M4 20V10M10 20V4M16 20v-7M22 20H2",
  folder: "M3 7h6l2 2h10v10H3z",
  search: "M10.5 4a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM15.5 15.5L20 20",
  check: "M5 12.5l4.5 4.5L19 7.5",
  grid: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  trend: "M3 17l6-6 4 4 8-8M15 7h6v6",
  db: "M12 3c4.4 0 8 1.3 8 3s-3.6 3-8 3-8-1.3-8-3 3.6-3 8-3zM4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3",
  tools: "M14.5 6.5a4 4 0 0 0-5.3 5.3L4 17l3 3 5.2-5.2a4 4 0 0 0 5.3-5.3l-2.5 2.5-2.5-.5-.5-2.5z",
  export: "M12 3v12M7 8l5-5 5 5M4 15v5h16v-5",
  eye: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
};

const useSpring = (at: number, damping = 12, stiffness = 170) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - at, fps, config: { damping, stiffness } });
};

/* ---------- stopwatch: glowing ring + running time ---------- */
const Stopwatch: React.FC<{ size: number; seconds: number; ring: number; color?: string; label?: string }> = ({ size, seconds, ring, color = D.coral, label = "Tiempo en revisiones" }) => {
  const r = size / 2 - 24;
  const c = 2 * Math.PI * r;
  const hh = Math.floor(seconds / 3600);
  const mm = Math.floor((seconds % 3600) / 60);
  const ss = Math.floor(seconds % 60);
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="rgba(255,255,255,.04)" stroke={D.line} strokeWidth={22} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={22} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - (ring % 1))} style={{ filter: `drop-shadow(0 0 18px ${color})` }} />
      </svg>
      <div style={{ position: "absolute", left: size / 2 - 30, top: -46, width: 60, height: 40, borderRadius: 10, background: "rgba(255,255,255,.18)" }} />
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: MONO, color: D.text }}>
        <div style={{ fontSize: size * 0.17, fontWeight: 700, letterSpacing: "0.02em", fontVariantNumeric: "tabular-nums" }}>
          {pad(hh)}:{pad(mm)}:{pad(ss)}
        </div>
        <div style={{ fontFamily: FONT, fontSize: size * 0.055, fontWeight: 600, color: D.sub, marginTop: 8 }}>{label}</div>
      </div>
    </div>
  );
};

/* ---------- 1. ¿Cuánto tiempo pierde tu equipo? ---------- */
const TASKS: { k: keyof typeof CUE; label: string; icon: string; x: number; y: number }[] = [
  { k: "cfdi", label: "CFDI", icon: IC.doc, x: 200, y: 360 },
  { k: "reportes", label: "Reportes", icon: IC.chart, x: 860, y: 420 },
  { k: "archivos", label: "Archivos", icon: IC.folder, x: 160, y: 1080 },
  { k: "consultas", label: "Consultas", icon: IC.search, x: 880, y: 1050 },
  { k: "revisiones", label: "Revisiones", icon: IC.eye, x: 540, y: 1250 },
];

export const S1Tiempo: React.FC<P> = ({ from }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const L = (t: number) => s(t) - from;
  const pop = useSpring(2, 11, 140);
  // hours fly by faster with every new task
  const tasksIn = TASKS.filter((t) => frame >= L(CUE[t.k])).length;
  const secs = 2 * 3600 + 47 * 60 + frame * (14 + tasksIn * 22);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 540 - 270, top: 470, transform: `scale(${0.6 + 0.4 * pop})`, opacity: Math.min(1, pop * 1.5) }}>
        <Stopwatch size={540} seconds={secs} ring={frame / 45} />
      </div>
      {TASKS.map((t, i) => {
        const at = L(CUE[t.k]);
        const p = spring({ frame: frame - at, fps, config: { damping: 9, stiffness: 170 } });
        if (frame < at) return null;
        const bob = Math.sin((frame + i * 20) / 16) * 8;
        return (
          <div key={t.k} style={{ position: "absolute", left: t.x, top: t.y + bob, transform: `translate(-50%, -50%) scale(${p})` }}>
            <Glass style={{ display: "flex", alignItems: "center", gap: 16, padding: "20px 30px", borderRadius: 999 }}>
              <Icon d={t.icon} size={38} color={C.accent} />
              <span style={{ fontWeight: 700, fontSize: 36 }}>{t.label}</span>
            </Glass>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* ---------- 2. information grows → work grows ---------- */
export const S2Crece: React.FC<P> = ({ from }) => {
  const frame = useCurrentFrame();
  const L = (t: number) => s(t) - from;
  const card = useSpring(0, 14, 140);
  const W = 860;
  const H = 520;
  const info = interpolate(frame, [L(CUE.crece) - 6, L(CUE.crece) + 30], [0, 1], { ...clamp, easing: (x) => 1 - Math.pow(1 - x, 2) });
  const work = interpolate(frame, [L(CUE.crece2) - 4, L(CUE.trabajo) + 40], [0, 1], clamp);
  const ctrl = interpolate(frame, [L(CUE.control) - 6, L(CUE.control) + 8], [0, 1], clamp);
  const curve = (k: number, steep: number) =>
    Array.from({ length: 40 }, (_, i) => {
      const x = (i / 39) * W;
      const y = H - 40 - Math.pow(i / 39, steep) * (H - 80) * k;
      return `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(" ");
  const len = 1400;
  const warn = ctrl > 0 && frame % 20 < 12;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 60, top: 520, width: 960, opacity: Math.min(1, card * 1.5), transform: `translateY(${(1 - card) * 60}px)` }}>
        <Glass style={{ padding: "36px 50px 40px" }}>
          <div style={{ display: "flex", gap: 30, marginBottom: 20 }}>
            <Tag color={C.accent}>Información</Tag>
            <Tag color={D.coral} style={{ opacity: work > 0 ? 1 : 0.35 }}>Trabajo</Tag>
          </div>
          <svg width={W} height={H}>
            {[0.25, 0.5, 0.75].map((g) => (
              <line key={g} x1={0} x2={W} y1={H * g} y2={H * g} stroke={D.line} strokeWidth={1} />
            ))}
            {/* "bajo control" threshold */}
            <line x1={0} x2={W} y1={H * 0.45} y2={H * 0.45} stroke={C.accent} strokeWidth={3} strokeDasharray="10 10" opacity={ctrl} />
            <path d={curve(1, 1.4)} fill="none" stroke={C.accent} strokeWidth={8} strokeLinecap="round" strokeDasharray={len} strokeDashoffset={len * (1 - info)} style={{ filter: `drop-shadow(0 0 10px ${C.accent})` }} />
            <path d={curve(1.05, 2.4)} fill="none" stroke={D.coral} strokeWidth={8} strokeLinecap="round" strokeDasharray={len} strokeDashoffset={len * (1 - work)} style={{ filter: `drop-shadow(0 0 10px ${D.coral})` }} />
          </svg>
          {ctrl > 0 && (
            <div style={{ position: "absolute", left: 60, top: 140 + H * 0.45 - 50, opacity: ctrl, fontFamily: MONO, fontSize: 24, fontWeight: 700, color: warn ? D.coral : D.sub }}>
              ⚠ FUERA DE CONTROL
            </div>
          )}
        </Glass>
      </div>
      <Illus name="perilla" at={L(CUE.control) - 2} x={830} y={380} size={300} />
    </AbsoluteFill>
  );
};

/* ---------- 3. having info vs. consult / organize / analyze ---------- */
const VERBS: { k: keyof typeof CUE; label: string; icon: string }[] = [
  { k: "consultarla", label: "Consultar", icon: IC.search },
  { k: "organizarla", label: "Organizar", icon: IC.grid },
  { k: "analizarla", label: "Analizar", icon: IC.trend },
];

export const S3Reto: React.FC<P> = ({ from }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const L = (t: number) => s(t) - from;
  const db = useSpring(L(CUE.tener) - 8, 12, 150);
  const lift = interpolate(frame, [L(CUE.es) - 4, L(CUE.es) + 12], [0, 1], { ...clamp, easing: (x) => 1 - Math.pow(1 - x, 3) });
  return (
    <AbsoluteFill>
      {/* "tener información" — not the real challenge */}
      <div style={{ position: "absolute", left: 0, right: 0, top: interpolate(lift, [0, 1], [640, 300]), display: "flex", justifyContent: "center", transform: `scale(${(0.6 + 0.4 * db) * (1 - 0.35 * lift)})`, opacity: Math.min(1, db * 1.5) * (1 - 0.45 * lift) }}>
        <Glass style={{ display: "flex", alignItems: "center", gap: 26, padding: "34px 48px" }}>
          <Icon d={IC.db} size={84} color={D.violet} sw={1.6} />
          <div>
            <div style={{ fontWeight: 800, fontSize: 52 }}>Información</div>
            <div style={{ fontFamily: MONO, fontSize: 24, color: D.sub, marginTop: 4 }}>14,735 CFDI · 2.3 GB</div>
          </div>
          <div style={{ marginLeft: 16, width: 54, height: 54, borderRadius: 27, background: "rgba(255,255,255,.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon d={IC.check} size={30} color={D.sub} sw={3} />
          </div>
        </Glass>
      </div>
      {/* the three verbs, wired to the info block */}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {VERBS.map((v, i) => {
          const x = 200 + i * 340;
          const on = interpolate(frame, [L(CUE[v.k]) - 4, L(CUE[v.k]) + 8], [0, 1], clamp);
          return <path key={v.k} d={`M540,470 C540,620 ${x},620 ${x},820`} fill="none" stroke={C.accent} strokeWidth={4} strokeDasharray="10 10" strokeDashoffset={-frame * 2} opacity={on * 0.8} />;
        })}
      </svg>
      {VERBS.map((v, i) => {
        const at = L(CUE[v.k]);
        const p = spring({ frame: frame - at, fps, config: { damping: 9, stiffness: 180 } });
        const glow = interpolate(frame, [at, at + 6, at + 30], [0, 1, 0.5], clamp);
        return (
          <div key={v.k} style={{ position: "absolute", left: 200 + i * 340, top: 990, transform: `translate(-50%, -50%) scale(${0.5 + 0.5 * p})`, opacity: Math.min(1, p * 2) }}>
            <Glass glow={glow} style={{ width: 290, height: 300, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 22 }}>
              <div style={{ width: 120, height: 120, borderRadius: 36, background: `linear-gradient(145deg, ${C.accent}, ${C.accentDark})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 16px 40px rgba(32,217,157,.4)` }}>
                <Icon d={v.icon} size={64} color={C.white} sw={2.2} />
              </div>
              <div style={{ fontWeight: 700, fontSize: 38 }}>{v.label}</div>
            </Glass>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* ---------- 4. Fispal: one platform, tools ---------- */
const TOOLS: { k: keyof typeof CUE; label: string; icon: string; x: number; y: number }[] = [
  { k: "consulta", label: "Consulta", icon: IC.search, x: 300, y: 1060 },
  { k: "analisis", label: "Análisis", icon: IC.trend, x: 780, y: 1060 },
  { k: "herramientas", label: "Reportes", icon: IC.chart, x: 300, y: 1260 },
  { k: "herramientas", label: "Exportar", icon: IC.export, x: 780, y: 1260 },
];

export const S4Plataforma: React.FC<P> = ({ from }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const L = (t: number) => s(t) - from;
  const hub = useSpring(L(CUE.fispal) - 4, 11, 150);
  const conc = L(CUE.concentrar);
  const plat = interpolate(frame, [L(CUE.plataforma) - 4, L(CUE.plataforma) + 10], [0, 1], clamp);
  const beat = useBeat();
  // CFDI particles pulled into the hub
  const parts = Array.from({ length: 22 }).map((_, i) => {
    const start = conc + (i % 11) * 3 + Math.floor(i / 11) * 18;
    const t = interpolate(frame, [start, start + 26], [0, 1], { ...clamp, easing: (x) => x * x });
    const ang = (i / 22) * Math.PI * 2 + 0.3;
    const rad = 620 * (1 - t);
    return { x: 540 + Math.cos(ang) * rad, y: 600 + Math.sin(ang) * rad * 0.9, o: t > 0 && t < 1 ? 1 : 0, s: 1 - 0.6 * t };
  });
  const count = Math.floor(interpolate(frame, [conc, conc + 50], [0, 14735], clamp));
  return (
    <AbsoluteFill>
      {parts.map((p, i) => (
        <div key={i} style={{ position: "absolute", left: p.x - 26, top: p.y - 26, opacity: p.o, transform: `scale(${p.s})` }}>
          <div style={{ width: 52, height: 64, borderRadius: 10, background: "rgba(255,255,255,.12)", border: `1.5px solid ${C.accent}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, fontSize: 13, fontWeight: 700, color: C.accent }}>XML</div>
        </div>
      ))}
      {/* hub */}
      <div style={{ position: "absolute", left: 540 - 230, top: 600 - 230, width: 460, height: 460, transform: `scale(${(0.5 + 0.5 * hub) * (1 + 0.025 * beat)})`, opacity: Math.min(1, hub * 1.5) }}>
        <div style={{ position: "absolute", inset: -40, borderRadius: "50%", border: `2px solid rgba(32,217,157,.35)`, transform: `rotate(${frame}deg)`, borderTopColor: C.accent }} />
        <Glass glow={0.6 + 0.4 * plat} style={{ position: "absolute", inset: 0, borderRadius: "50%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18 }}>
          <Img src={staticFile("brand/fispal-logo-white.png")} style={{ width: 300 }} />
          <div style={{ fontFamily: MONO, fontSize: 30, fontWeight: 700, color: C.accent, fontVariantNumeric: "tabular-nums", opacity: frame >= conc ? 1 : 0 }}>{count.toLocaleString("en-US")} CFDI</div>
        </Glass>
      </div>
      {frame >= L(CUE.plataforma) - 4 && (
        <div style={{ position: "absolute", top: 905, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: plat, transform: `translateY(${(1 - plat) * 20}px)` }}>
          <Tag>Una misma plataforma</Tag>
        </div>
      )}
      {TOOLS.map((t, i) => {
        const at = L(CUE[t.k]) + (i === 3 ? 6 : 0);
        const p = spring({ frame: frame - at, fps, config: { damping: 10, stiffness: 180 } });
        if (frame < at) return null;
        return (
          <div key={t.label} style={{ position: "absolute", left: t.x, top: t.y, transform: `translate(-50%, -50%) scale(${p})` }}>
            <Glass style={{ width: 440, boxSizing: "border-box", display: "flex", alignItems: "center", gap: 20, padding: "26px 30px" }}>
              <div style={{ width: 84, height: 84, borderRadius: 24, background: "rgba(32,217,157,.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon d={t.icon} size={46} color={C.accent} sw={2.2} />
              </div>
              <span style={{ fontWeight: 700, fontSize: 38 }}>{t.label}</span>
            </Glass>
          </div>
        );
      })}
      <Illus name="modulos" at={L(CUE.herramientas) + 10} x={900} y={300} size={260} />
    </AbsoluteFill>
  );
};

/* ---------- 5. Más control / Menos trabajo operativo ---------- */
const Meter: React.FC<{ label: string; sign: string; value: number; color: string; at: number }> = ({ label, sign, value, color, at }) => {
  const p = useSpring(at, 12, 150);
  return (
    <div style={{ opacity: Math.min(1, p * 1.5), transform: `translateX(${(1 - p) * -80}px)` }}>
      <Glass style={{ padding: "38px 44px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
          <span style={{ fontWeight: 800, fontSize: 96, color, lineHeight: 1 }}>{sign}</span>
          <span style={{ fontWeight: 800, fontSize: 58 }}>{label}</span>
        </div>
        <div style={{ marginTop: 26, height: 30, borderRadius: 15, background: "rgba(255,255,255,.08)", overflow: "hidden" }}>
          <div style={{ width: `${value * 100}%`, height: "100%", borderRadius: 15, background: color, boxShadow: `0 0 24px ${color}` }} />
        </div>
        <div style={{ marginTop: 12, fontFamily: MONO, fontSize: 26, color: D.sub, textAlign: "right" }}>{Math.round(value * 100)}%</div>
      </Glass>
    </div>
  );
};

export const S5MasMenos: React.FC<P> = ({ from }) => {
  const frame = useCurrentFrame();
  const L = (t: number) => s(t) - from;
  const ctrl = interpolate(frame, [6, 40], [0.32, 0.94], { ...clamp, easing: (x) => 1 - Math.pow(1 - x, 3) });
  const menos = L(CUE.menos);
  const work = interpolate(frame, [menos, menos + 40], [0.86, 0.24], { ...clamp, easing: (x) => 1 - Math.pow(1 - x, 3) });
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 70, right: 70, top: 520, display: "flex", flexDirection: "column", gap: 50 }}>
        <Meter label="control" sign="+" value={ctrl} color={C.accent} at={0} />
        {frame >= menos - 6 && <Meter label="trabajo operativo" sign="−" value={work} color={D.coral} at={menos - 6} />}
      </div>
      <Illus name="perilla" at={4} x={870} y={300} size={260} />
    </AbsoluteFill>
  );
};

/* ---------- 6. the question, with the stopwatch back ---------- */
export const S6Pregunta: React.FC<P> = () => {
  const frame = useCurrentFrame();
  const pop = useSpring(0, 11, 140);
  const secs = 2 * 3600 + 47 * 60 + 40 + frame * 30;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 540 - 300, top: 470, transform: `scale(${0.6 + 0.4 * pop})`, opacity: Math.min(1, pop * 1.5) }}>
        <Stopwatch size={600} seconds={secs} ring={frame / 60} color={D.violet} label="¿Y tu equipo?" />
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 7. CTA ---------- */
export const S7Cta: React.FC<P> = ({ from }) => {
  const L = (t: number) => s(t) - from;
  const btn = useSpring(Math.max(6, L(CUE.gratis) - 4), 9, 170);
  const url = useSpring(L(CUE.url), 12, 170);
  const frame = useCurrentFrame();
  const glow = 0.5 + 0.5 * Math.sin(frame / 6);
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <Illus name="check" at={8} x={170} y={330} size={220} phase={0.5} />
      <Illus name="calendario" at={12} x={920} y={300} size={220} phase={2} />
      <Illus name="esfera" at={2} x={540} y={420} size={440} />
      <div style={{ position: "absolute", top: 700, opacity: useSpring(4), transform: `scale(${0.85 + 0.15 * useSpring(4)})` }}>
        <Img src={staticFile("brand/fispal-logo-white.png")} style={{ width: 640 }} />
      </div>
      <div style={{ position: "absolute", top: 1010, transform: `scale(${btn})` }}>
        <div style={{ background: C.accent, color: D.bg1, fontFamily: FONT, fontWeight: 800, fontSize: 50, borderRadius: 999, padding: "30px 70px", boxShadow: `0 0 ${40 + 40 * glow}px rgba(32,217,157,${0.35 + 0.3 * glow})` }}>Empieza gratis →</div>
      </div>
      <div style={{ position: "absolute", top: 1210, opacity: url, transform: `translateY(${(1 - url) * 20}px)` }}>
        <Tag style={{ textTransform: "none", fontSize: 32 }}>fispal.mx</Tag>
      </div>
    </AbsoluteFill>
  );
};
