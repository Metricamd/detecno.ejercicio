// Scenes of the Fispal "información dispersa" reel (parrilla 2, reel 3).
// Same Fispal line (Poppins, green accent, glass illustrations, subtitles) on
// a blue → green gradient, with its own motion language: 3D card flips,
// cascading windows, an investigation board, a filter funnel and circle wipes.
import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Illus } from "../fispal/Illus";
import { FONT, MONO, s } from "../fispal/theme";
import { CUE } from "./timeline";

type P = { from: number };
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);

export const G = {
  green: "#3FD497", // the dot of the "i" in the Fispal logo
  teal: "#1FA6B8",
  blue: "#2F5BE0",
  navy: "#16207A",
  deep: "#0A0E36",
  white: "#FFFFFF",
  sub: "rgba(255,255,255,.7)",
  glass: "rgba(255,255,255,.12)",
  line: "rgba(255,255,255,.22)",
};

/* ---------- background: green → teal → blue → navy, slowly flowing ---------- */
export const BlueGreenBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const a = frame / 90;
  return (
    <AbsoluteFill style={{ background: `linear-gradient(160deg, ${G.green} -10%, ${G.teal} 18%, ${G.blue} 42%, ${G.navy} 70%, ${G.deep} 100%)`, overflow: "hidden" }}>
      <div style={{ position: "absolute", width: 900, height: 900, left: -300 + Math.sin(a) * 120, top: -260 + Math.cos(a) * 80, borderRadius: "50%", background: G.green, filter: "blur(180px)", opacity: 0.55 }} />
      <div style={{ position: "absolute", width: 1000, height: 1000, right: -420 + Math.cos(a * 0.8) * 100, top: 520 + Math.sin(a * 0.8) * 120, borderRadius: "50%", background: "#4C7DFF", filter: "blur(200px)", opacity: 0.45 }} />
      <div style={{ position: "absolute", width: 1100, height: 700, left: -100, bottom: -260, borderRadius: "50%", background: G.deep, filter: "blur(160px)", opacity: 0.8 }} />
      {/* soft diagonal light bands */}
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ position: "absolute", left: -400 + ((frame * 2 + i * 520) % 2000), top: -200, width: 140, height: 2400, background: "linear-gradient(180deg, transparent, rgba(255,255,255,.07), transparent)", transform: "rotate(24deg)" }} />
      ))}
    </AbsoluteFill>
  );
};

/* ---------- circle-wipe scene wrapper (instead of the zoom-blur of reels 1–2) ---------- */
export const WipeScene: React.FC<{ duration: number; first?: boolean; children: React.ReactNode; ox?: number; oy?: number }> = ({ duration, first, children, ox = 50, oy = 45 }) => {
  const frame = useCurrentFrame();
  const r = first ? 150 : interpolate(frame, [0, 12], [0, 150], { ...clamp, easing: easeOut });
  const drift = interpolate(frame, [0, duration], [1, 1.03]);
  return <AbsoluteFill style={{ clipPath: `circle(${r}% at ${ox}% ${oy}%)`, transform: `scale(${drift})` }}>{children}</AbsoluteFill>;
};

/* ---------- pieces ---------- */
const Glass: React.FC<{ style?: React.CSSProperties; children?: React.ReactNode }> = ({ style, children }) => (
  <div style={{ background: G.glass, border: `1.5px solid ${G.line}`, borderRadius: 30, boxShadow: "inset 0 1px 0 rgba(255,255,255,.25), 0 30px 70px rgba(5,10,50,.35)", backdropFilter: "blur(16px)", fontFamily: FONT, color: G.white, ...style }}>{children}</div>
);

const Icon: React.FC<{ d: string; size?: number; color?: string; sw?: number }> = ({ d, size = 40, color = G.white, sw = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
    <path d={d} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IC = {
  sheet: "M4 4h16v16H4zM4 9h16M4 14h16M9 4v16",
  folder: "M3 7h6l2 2h10v10H3z",
  code: "M8 8l-4 4 4 4M16 8l4 4-4 4M13.5 6l-3 12",
  chart: "M4 20V10M10 20V4M16 20v-7M22 20H2",
  check: "M5 12.5l4.5 4.5L19 7.5",
  eye: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  doc: "M7 3h7l5 5v13H7zM14 3v5h5M10 12h6M10 16h6",
};

const useSpr = (at: number, damping = 12, stiffness = 170) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - at, fps, config: { damping, stiffness } });
};

/* ---------- 1. ¿Cuántos archivos…? windows cascading open + a big counter ---------- */
const WINDOWS = ["ventas_sep.xlsx", "CFDI_recibidos/", "F-2291.xml", "reporte_iva.pdf", "nomina_q2.xlsx", "proveedores.csv", "F-2304.xml", "conciliacion.xlsx"];

export const S1Archivos: React.FC<P> = ({ from }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const L = (t: number) => s(t) - from;
  const start = L(CUE.abrir) - 6;
  const every = 7;
  const opened = Math.max(0, Math.min(WINDOWS.length, Math.floor((frame - start) / every) + 1));
  const count = useSpr(L(CUE.haz) - 4, 8, 160);
  const shown = frame < start ? 0 : opened;
  return (
    <AbsoluteFill>
      {WINDOWS.map((w, i) => {
        const at = start + i * every;
        const p = spring({ frame: frame - at, fps, config: { damping: 13, stiffness: 200 } });
        if (frame < at) return null;
        const x = 90 + i * 42;
        const y = 330 + i * 64;
        return (
          <div key={w} style={{ position: "absolute", left: x, top: y, width: 640, transform: `scale(${0.6 + 0.4 * p})`, transformOrigin: "0 0", opacity: Math.min(1, p * 2) }}>
            <div style={{ borderRadius: 18, overflow: "hidden", background: "#F7F9FF", boxShadow: "0 24px 60px rgba(5,10,50,.35)" }}>
              <div style={{ height: 48, background: "#E6EBF8", display: "flex", alignItems: "center", gap: 9, padding: "0 18px" }}>
                {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
                  <span key={c} style={{ width: 14, height: 14, borderRadius: 7, background: c }} />
                ))}
                <span style={{ marginLeft: 12, fontFamily: MONO, fontSize: 20, color: "#4A5272" }}>{w}</span>
              </div>
              <div style={{ height: 150, padding: 18, display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
                {Array.from({ length: 15 }).map((_, k) => (
                  <div key={k} style={{ height: 30, borderRadius: 6, background: k % 5 === 0 ? "#D8E0F5" : "#EDF1FB" }} />
                ))}
              </div>
            </div>
          </div>
        );
      })}
      {/* big counter */}
      <div style={{ position: "absolute", right: 70, top: 270, transform: `scale(${frame >= L(CUE.haz) - 4 ? 0.8 + 0.2 * count : 0.8})`, transformOrigin: "100% 0" }}>
        <div style={{ width: 230, height: 230, borderRadius: 115, background: G.green, boxShadow: `0 0 ${50 + 30 * count}px rgba(63,212,151,.7)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: FONT, color: G.deep }}>
          <div style={{ fontWeight: 800, fontSize: 110, lineHeight: 1 }}>{shown}</div>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 20, letterSpacing: "0.08em" }}>ABIERTOS</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 2. Un Excel. Una carpeta. Un XML. Otro reporte. — 3D card flips into a fanned deck ---------- */
const DECK: { k: keyof typeof CUE; label: string; ext: string; icon: string; color: string }[] = [
  { k: "excel", label: "Excel", ext: ".xlsx", icon: IC.sheet, color: "#21A366" },
  { k: "carpeta", label: "Carpeta", ext: "/CFDI", icon: IC.folder, color: "#F2A019" },
  { k: "xml", label: "XML", ext: "<cfdi:…>", icon: IC.code, color: "#7B61FF" },
  { k: "reporte", label: "Reporte", ext: ".pdf", icon: IC.chart, color: "#EC4C7A" },
];

export const S2Deck: React.FC<P> = ({ from }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const L = (t: number) => s(t) - from;
  const cross = interpolate(frame, [L(CUE.cruzar) - 4, L(CUE.cruzar) + 16], [0, 1], clamp);
  const n = DECK.filter((d) => frame >= L(CUE[d.k]) - 3).length;
  return (
    <AbsoluteFill style={{ perspective: 1800 }}>
      {DECK.map((d, i) => {
        const at = L(CUE[d.k]) - 3;
        const flip = spring({ frame: frame - at, fps, config: { damping: 14, stiffness: 120 } });
        if (frame < at) return null;
        // newer cards push older ones back into a fan
        const depth = n - 1 - i;
        const fanX = interpolate(cross, [0, 1], [-depth * 46, (i - 1.5) * 215]);
        const fanY = interpolate(cross, [0, 1], [-depth * 40, i % 2 ? 140 : -60]);
        const rot = interpolate(cross, [0, 1], [-depth * 5, (i - 1.5) * 6]);
        const sc = interpolate(cross, [0, 1], [1 - depth * 0.07, 0.54]);
        return (
          <div key={d.k} style={{ position: "absolute", left: 540 - 260, top: 560, width: 520, height: 600, transform: `translate(${fanX}px, ${fanY}px) rotateY(${(1 - flip) * -110}deg) rotate(${rot}deg) scale(${sc})`, opacity: Math.min(1, flip * 3), zIndex: i }}>
            <div style={{ width: "100%", height: "100%", borderRadius: 40, background: "#FFFFFF", boxShadow: "0 40px 90px rgba(5,10,50,.4)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 30, fontFamily: FONT }}>
              <div style={{ width: 210, height: 210, borderRadius: 56, background: d.color, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 20px 50px ${d.color}66` }}>
                <Icon d={d.icon} size={120} sw={1.8} />
              </div>
              <div style={{ fontWeight: 800, fontSize: 84, color: G.deep, letterSpacing: "-0.02em" }}>{d.label}</div>
              <div style={{ fontFamily: MONO, fontSize: 32, color: "#6B7398" }}>{d.ext}</div>
            </div>
          </div>
        );
      })}
      {/* cross the information: dashed links + spinner */}
      {cross > 0 && (
        <>
          <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: cross }}>
            {[[0, 2], [1, 3], [0, 3], [1, 2]].map(([a, b], k) => {
              const cx = (i: number) => 540 + (i - 1.5) * 215;
              const cy = (i: number) => 860 + (i % 2 ? 140 : -60);
              return <line key={k} x1={cx(a)} y1={cy(a)} x2={cx(b)} y2={cy(b)} stroke={G.green} strokeWidth={5} strokeDasharray="14 12" strokeDashoffset={-frame * 3} />;
            })}
          </svg>
          <div style={{ position: "absolute", left: 0, right: 0, top: 380, display: "flex", justifyContent: "center", opacity: cross }}>
            <Glass style={{ display: "flex", alignItems: "center", gap: 18, padding: "18px 34px", borderRadius: 999 }}>
              <div style={{ width: 34, height: 34, borderRadius: 17, border: `5px solid ${G.line}`, borderTopColor: G.green, transform: `rotate(${frame * 14}deg)` }} />
              <span style={{ fontWeight: 700, fontSize: 34 }}>Cruzando información…</span>
            </Glass>
          </div>
        </>
      )}
    </AbsoluteFill>
  );
};

/* ---------- 3. Información dispersa → una pequeña investigación (board with strings) ---------- */
const NOTES = [
  { t: "F-2291.xml", x: 170, y: 420, r: -6 },
  { t: "IVA sep?", x: 760, y: 380, r: 5 },
  { t: "RFC proveedor", x: 450, y: 640, r: -3 },
  { t: "pago parcial", x: 150, y: 900, r: 4 },
  { t: "nómina Q2", x: 820, y: 860, r: -5 },
  { t: "¿cancelado?", x: 480, y: 1120, r: 6 },
];
const LINKS = [[0, 2], [1, 2], [2, 3], [2, 4], [3, 5], [4, 5], [0, 3]];

export const S3Investigacion: React.FC<P> = ({ from }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const L = (t: number) => s(t) - from;
  const scatter = interpolate(frame, [L(CUE.dispersa) - 4, L(CUE.dispersa) + 14], [0, 1], { ...clamp, easing: easeOut });
  const strings = interpolate(frame, [L(CUE.consulta), L(CUE.investigacion) + 6], [0, 1], clamp);
  const pos = (i: number) => {
    const n = NOTES[i];
    // notes start bunched in the middle and fly apart on "dispersa"
    return { x: 540 + (n.x - 540) * (0.25 + 0.75 * scatter), y: 780 + (n.y - 780) * (0.25 + 0.75 * scatter) };
  };
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {LINKS.map(([a, b], k) => {
          const A = pos(a);
          const B = pos(b);
          const len = Math.hypot(B.x - A.x, B.y - A.y);
          const p = interpolate(strings, [k / LINKS.length, (k + 1) / LINKS.length], [0, 1], clamp);
          return <line key={k} x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke="#FF6B6B" strokeWidth={4} strokeDasharray={len} strokeDashoffset={len * (1 - p)} />;
        })}
      </svg>
      {NOTES.map((n, i) => {
        const p = spring({ frame: frame - 2 - i * 3, fps, config: { damping: 11, stiffness: 160 } });
        const { x, y } = pos(i);
        const sway = Math.sin((frame + i * 13) / 18) * 2;
        return (
          <div key={n.t} style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) rotate(${n.r + sway}deg) scale(${p})` }}>
            <div style={{ position: "absolute", left: "50%", top: -12, width: 26, height: 26, marginLeft: -13, borderRadius: 13, background: "#FF6B6B", boxShadow: "0 4px 10px rgba(0,0,0,.3)", zIndex: 2 }} />
            <div style={{ background: "#FFF9E6", borderRadius: 10, padding: "26px 28px 22px", boxShadow: "0 18px 40px rgba(5,10,50,.35)", fontFamily: MONO, fontWeight: 700, fontSize: 28, color: G.deep, whiteSpace: "nowrap" }}>{n.t}</div>
          </div>
        );
      })}
      <Illus name="lupa" at={L(CUE.investigacion) - 6} x={760} y={1180} size={330} tilt={8} />
    </AbsoluteFill>
  );
};

/* ---------- 4. Fispal concentra + filtros y criterios (funnel) ---------- */
const FILTERS = ["RFC", "Fecha", "Tipo", "Monto", "Estatus"];

export const S4Embudo: React.FC<P> = ({ from }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const L = (t: number) => s(t) - from;
  const logo = useSpr(0, 11, 150);
  const conc = L(CUE.concentra);
  const funnel = useSpr(L(CUE.consultarlos) - 6, 13, 150);
  const fAt = L(CUE.filtros) - 10;
  const out = L(CUE.criterios) + 6;
  // files sucked into the Fispal badge
  const files = Array.from({ length: 14 }).map((_, i) => {
    const t = interpolate(frame, [conc + i * 2, conc + i * 2 + 18], [0, 1], { ...clamp, easing: (x) => x * x });
    const ang = (i / 14) * Math.PI * 2;
    return { x: 540 + Math.cos(ang) * 560 * (1 - t), y: 400 + Math.sin(ang) * 420 * (1 - t), o: t > 0 && t < 1 ? 1 : 0 };
  });
  return (
    <AbsoluteFill>
      {files.map((f, i) => (
        <div key={i} style={{ position: "absolute", left: f.x - 28, top: f.y - 34, opacity: f.o }}>
          <div style={{ width: 56, height: 68, borderRadius: 10, background: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon d={IC.doc} size={34} color={G.blue} />
          </div>
        </div>
      ))}
      {/* Fispal badge on top */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", justifyContent: "center", transform: `scale(${0.6 + 0.4 * logo})`, opacity: Math.min(1, logo * 1.5) }}>
        <div style={{ background: "#FFFFFF", borderRadius: 40, padding: "34px 60px", boxShadow: `0 0 0 ${frame > conc ? 6 : 0}px rgba(63,212,151,.6), 0 30px 70px rgba(5,10,50,.35)` }}>
          <Img src={staticFile("brand/fispal-logo.png")} style={{ width: 360 }} />
        </div>
      </div>
      {/* funnel */}
      <div style={{ position: "absolute", left: 540 - 380, top: 640, width: 760, opacity: Math.min(1, funnel * 1.5), transform: `translateY(${(1 - funnel) * 80}px)` }}>
        <svg width={760} height={420} viewBox="0 0 760 420">
          <defs>
            <linearGradient id="fun" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="rgba(255,255,255,.28)" />
              <stop offset="1" stopColor="rgba(63,212,151,.55)" />
            </linearGradient>
          </defs>
          <path d="M20 20 H740 L470 270 V400 H290 V270 Z" fill="url(#fun)" stroke="rgba(255,255,255,.6)" strokeWidth={3} strokeLinejoin="round" />
        </svg>
        {FILTERS.map((f, i) => {
          const at = fAt + i * 5;
          const p = interpolate(frame, [at, at + 14], [0, 1], { ...clamp, easing: (x) => x * x });
          if (frame < at) return null;
          const x0 = 70 + i * 140;
          const x = x0 + (380 - 60 - x0) * p;
          const y = -110 + 330 * p;
          return (
            <div key={f} style={{ position: "absolute", left: x, top: y, opacity: 1 - interpolate(p, [0.85, 1], [0, 1], clamp), transform: `scale(${1 - 0.4 * p})` }}>
              <div style={{ background: G.green, color: G.deep, fontFamily: FONT, fontWeight: 700, fontSize: 30, borderRadius: 999, padding: "12px 24px", whiteSpace: "nowrap", boxShadow: "0 10px 24px rgba(5,10,50,.3)" }}>{f}</div>
            </div>
          );
        })}
      </div>
      {/* results coming out */}
      {[0, 1, 2].map((i) => {
        const p = spring({ frame: frame - out - i * 5, fps, config: { damping: 12, stiffness: 170 } });
        if (frame < out + i * 5) return null;
        return (
          <div key={i} style={{ position: "absolute", left: 140, right: 140, top: 1080 + i * 96, opacity: Math.min(1, p * 2), transform: `translateY(${(1 - p) * -60}px) scale(${0.8 + 0.2 * p})` }}>
            <div style={{ background: "#FFFFFF", borderRadius: 20, padding: "16px 22px", display: "flex", alignItems: "center", gap: 16, fontFamily: FONT, color: G.deep, boxShadow: "0 14px 30px rgba(5,10,50,.3)" }}>
              <div style={{ width: 44, height: 44, borderRadius: 22, background: G.green, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon d={IC.check} size={26} sw={3} />
              </div>
              <span style={{ fontFamily: MONO, fontSize: 22, color: "#6B7398" }}>{["8F2A19C0", "3B7D44E1", "C90A12FF"][i]}</span>
              <span style={{ fontWeight: 700, fontSize: 28, flex: 1 }}>{["Grupo Andino SA", "Comercial Rivas", "Servicios Lumen"][i]}</span>
              <span style={{ fontWeight: 800, fontSize: 28 }}>{["$8,450", "$2,130", "$5,900"][i]}</span>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* ---------- 5. Menos archivos dispersos / Más visibilidad ---------- */
export const S5Visibilidad: React.FC<P> = ({ from }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const L = (t: number) => s(t) - from;
  const merge = interpolate(frame, [L(CUE.dispersos) - 6, L(CUE.dispersos) + 14], [0, 1], { ...clamp, easing: easeOut });
  const vis = L(CUE.visibilidad);
  const panel = useSpr(vis - 4, 12, 150);
  const icons = [IC.sheet, IC.folder, IC.code, IC.chart, IC.doc, IC.sheet, IC.code, IC.folder];
  const count = Math.round(interpolate(merge, [0, 1], [8, 1]));
  return (
    <AbsoluteFill>
      {/* scattered icons collapse into one */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 260, height: 420, opacity: 1 - 0.35 * panel }}>
        {icons.map((d, i) => {
          const p = spring({ frame: frame - i * 2, fps, config: { damping: 12, stiffness: 170 } });
          const ang = (i / icons.length) * Math.PI * 2;
          const x = 540 + Math.cos(ang) * 330 * (1 - merge);
          const y = 210 + Math.sin(ang) * 150 * (1 - merge);
          return (
            <div key={i} style={{ position: "absolute", left: x - 55, top: y - 55, transform: `scale(${p})`, opacity: i === 0 ? 1 : 1 - merge }}>
              <div style={{ width: 110, height: 110, borderRadius: 30, background: i === 0 && merge > 0.9 ? G.green : G.glass, border: `1.5px solid ${G.line}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon d={i === 0 && merge > 0.9 ? IC.check : d} size={58} color={i === 0 && merge > 0.9 ? G.deep : G.white} sw={i === 0 && merge > 0.9 ? 3 : 2} />
              </div>
            </div>
          );
        })}
        <div style={{ position: "absolute", right: 90, top: 0, fontFamily: MONO, fontWeight: 700, fontSize: 28, color: G.white, background: "rgba(10,14,54,.45)", borderRadius: 999, padding: "10px 22px" }}>archivos: {count}</div>
      </div>
      {/* visibility panel: a dashboard lit by a sweeping light */}
      <div style={{ position: "absolute", left: 80, right: 80, top: 740, opacity: Math.min(1, panel * 1.5), transform: `translateY(${(1 - panel) * 80}px)` }}>
        <Glass style={{ padding: "34px 40px", overflow: "hidden", position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Icon d={IC.eye} size={52} color={G.green} />
            <span style={{ fontWeight: 800, fontSize: 48 }}>Visibilidad</span>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 22, height: 260, marginTop: 30 }}>
            {[0.45, 0.7, 0.55, 0.9, 0.65, 1].map((h, i) => {
              const g = interpolate(frame, [vis + i * 3, vis + i * 3 + 16], [0, 1], { ...clamp, easing: easeOut });
              return <div key={i} style={{ flex: 1, height: `${h * g * 100}%`, borderRadius: 14, background: i === 5 ? G.green : "rgba(255,255,255,.55)" }} />;
            })}
          </div>
          <div style={{ position: "absolute", top: 0, bottom: 0, width: 160, left: interpolate(frame, [vis + 10, vis + 40], [-200, 1000], clamp), background: "linear-gradient(90deg, transparent, rgba(255,255,255,.35), transparent)", transform: "skewX(-18deg)" }} />
        </Glass>
      </div>
      <Illus name="esfera" at={vis + 8} x={900} y={720} size={240} />
    </AbsoluteFill>
  );
};

/* ---------- 6. CTA ---------- */
export const S6Cta: React.FC<P> = ({ from }) => {
  const frame = useCurrentFrame();
  const L = (t: number) => s(t) - from;
  const logo = useSpr(4, 11, 150);
  const btn = useSpr(Math.max(8, L(CUE.gratis) - 4), 8, 170);
  const url = useSpr(L(CUE.url), 12, 170);
  const ring = (frame % 40) / 40;
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <Illus name="check" at={8} x={180} y={330} size={220} phase={0.5} />
      <Illus name="facturas" at={12} x={910} y={310} size={230} phase={2} />
      <Illus name="esfera" at={2} x={540} y={430} size={420} />
      <div style={{ position: "absolute", top: 700, transform: `scale(${0.85 + 0.15 * logo})`, opacity: logo }}>
        <Img src={staticFile("brand/fispal-logo-white.png")} style={{ width: 640 }} />
      </div>
      <div style={{ position: "absolute", top: 1010, transform: `scale(${btn})` }}>
        {/* ripple rings behind the button */}
        <div style={{ position: "absolute", inset: 0, borderRadius: 999, border: `4px solid ${G.green}`, transform: `scale(${1 + ring * 0.35})`, opacity: 1 - ring }} />
        <div style={{ position: "relative", background: "#FFFFFF", color: G.navy, fontFamily: FONT, fontWeight: 800, fontSize: 52, borderRadius: 999, padding: "30px 72px", boxShadow: "0 20px 50px rgba(5,10,50,.35)" }}>
          Prueba gratis <span style={{ color: "#20B07E" }}>→</span>
        </div>
      </div>
      <div style={{ position: "absolute", top: 1210, opacity: url, transform: `translateY(${(1 - url) * 20}px)` }}>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 34, color: G.white, background: "rgba(10,14,54,.45)", border: `1px solid ${G.line}`, borderRadius: 999, padding: "14px 34px" }}>fispal.mx</div>
      </div>
    </AbsoluteFill>
  );
};
