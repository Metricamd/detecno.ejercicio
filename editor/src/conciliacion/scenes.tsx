// Scenes of the Fispal "Conciliación de Pagos" reel (parrilla 2, reel 6).
// Light mint canvas with purple ink, a page-flip (rotateY) transition and its
// own motion language: paired documents, a looping cycle, a flood of
// documents, matching lines between invoices and payments, a donut.
// Visuals stay centred in the band y ≈ 300–1360, above the subtitles.
import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT, MONO, s } from "../fispal/theme";
import { CUE } from "./timeline";

type P = { from: number };
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);

export const M = {
  bg1: "#EFFCF6",
  bg2: "#CFF5E4",
  bg3: "#9FE8CB",
  purple: "#250E94",
  violet: "#5B3FE0",
  mint: "#20B07E",
  mintBright: "#3FD497",
  ink: "#131313",
  sub: "#566079",
  line: "#DCEFE6",
  coral: "#F2645A",
  amber: "#F2A019",
};

/* ---------- background: soft mint gradient with diagonal ribbons ---------- */
export const MintBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const a = frame / 90;
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${M.bg1} 0%, ${M.bg2} 55%, ${M.bg3} 100%)`, overflow: "hidden" }}>
      <div style={{ position: "absolute", width: 900, height: 900, right: -360 + Math.sin(a) * 70, top: -300, borderRadius: "50%", background: "radial-gradient(circle, rgba(91,63,224,.28) 0%, rgba(91,63,224,0) 65%)" }} />
      <div style={{ position: "absolute", width: 1000, height: 1000, left: -420, top: 700 + Math.cos(a) * 70, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,.9) 0%, rgba(255,255,255,0) 65%)" }} />
      {[0, 1, 2, 3].map((i) => (
        <div key={i} style={{ position: "absolute", left: -600, right: -600, top: 200 + i * 460 + Math.sin(a + i) * 30, height: 90, background: "rgba(255,255,255,.35)", transform: "rotate(-16deg)" }} />
      ))}
    </AbsoluteFill>
  );
};

/* ---------- page-flip transition ---------- */
export const FlipScene: React.FC<{ duration: number; first?: boolean; last?: boolean; overlap: number; children: React.ReactNode }> = ({ duration, first, last, overlap, children }) => {
  const frame = useCurrentFrame();
  const inP = first ? 1 : interpolate(frame, [overlap / 2, overlap], [0, 1], { ...clamp, easing: easeOut });
  const outP = last ? 0 : interpolate(frame, [duration - overlap, duration - overlap / 2], [0, 1], { ...clamp, easing: (x) => x * x });
  const ry = (1 - inP) * -90 + outP * 90;
  const visible = inP > 0 && outP < 1;
  return (
    <AbsoluteFill style={{ perspective: 2000 }}>
      <AbsoluteFill style={{ transform: `rotateY(${ry}deg) scale(${1 - 0.08 * Math.abs(ry) / 90})`, opacity: visible ? 1 : 0, backfaceVisibility: "hidden" }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------- pieces ---------- */
const Card: React.FC<{ style?: React.CSSProperties; children?: React.ReactNode }> = ({ style, children }) => (
  <div style={{ background: "#FFFFFF", borderRadius: 32, boxShadow: "0 26px 60px rgba(20,90,60,.16)", border: "1px solid rgba(0,0,0,.04)", fontFamily: FONT, color: M.ink, ...style }}>{children}</div>
);

const Icon: React.FC<{ d: string; size?: number; color?: string; sw?: number }> = ({ d, size = 40, color = M.ink, sw = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
    <path d={d} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IC = {
  doc: "M7 3h7l5 5v13H7zM14 3v5h5M10 12h6M10 16h6",
  card: "M3 7h18v10H3zM3 11h18M7 15h3",
  puzzle: "M10 3h4v3a2 2 0 1 0 4 0V3h3v7h-3a2 2 0 1 0 0 4h3v7h-7v-3a2 2 0 1 0-4 0v3H3v-7h3a2 2 0 1 0 0-4H3V3h7z",
  link: "M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1",
  check: "M5 12.5l4.5 4.5L19 7.5",
  pencil: "M4 20l4-1 11-11-3-3L5 16zM14 6l3 3",
  clock: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3 2",
  cloud: "M7 18h10a4 4 0 0 0 .5-8A6 6 0 0 0 6 9a4.5 4.5 0 0 0 1 9z",
  repeat: "M17 2l4 4-4 4M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4M21 13v2a3 3 0 0 1-3 3H3",
};

const useSpr = (at: number, damping = 12, stiffness = 170) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - at, fps, config: { damping, stiffness } });
};

const Eyes: React.FC<{ size: number }> = ({ size }) => {
  const frame = useCurrentFrame();
  const look = Math.sin(frame / 7) * size * 0.12;
  return (
    <div style={{ display: "flex", gap: size * 0.06 }}>
      {[0, 1].map((k) => (
        <div key={k} style={{ width: size * 0.46, height: size * 0.6, borderRadius: "50%", background: "#fff", position: "relative", boxShadow: "0 8px 20px rgba(20,90,60,.25)", border: `3px solid ${M.purple}` }}>
          <div style={{ position: "absolute", width: size * 0.2, height: size * 0.24, borderRadius: "50%", background: M.purple, left: size * 0.11 + look, top: size * 0.18 }} />
        </div>
      ))}
    </div>
  );
};

const DocCard: React.FC<{ title: string; kind: string; color: string; icon: string; amount: string; uuid: string; style?: React.CSSProperties }> = ({ title, kind, color, icon, amount, uuid, style }) => (
  <Card style={{ padding: "34px 30px", display: "flex", flexDirection: "column", gap: 22, ...style }}>
    <div style={{ width: 120, height: 120, borderRadius: 34, background: color, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Icon d={icon} size={70} color="#fff" sw={1.8} />
    </div>
    <div>
      <div style={{ fontWeight: 800, fontSize: 48 }}>{title}</div>
      <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 22, color: M.sub, marginTop: 6 }}>{kind}</div>
    </div>
    <div style={{ height: 2, background: M.line }} />
    <div style={{ fontFamily: MONO, fontSize: 22, color: M.sub }}>UUID {uuid}</div>
    <div style={{ fontWeight: 800, fontSize: 52, color }}>{amount}</div>
  </Card>
);

/* ---------- 1. Tienes la factura. Tienes el pago. ¿Por qué manualmente? ---------- */
export const S1Par: React.FC<P> = ({ from }) => {
  const frame = useCurrentFrame();
  const L = (t: number) => s(t) - from;
  const f = useSpr(L(CUE.factura) - 6, 12, 150);
  const p = useSpr(L(CUE.pago) - 6, 12, 150);
  const man = interpolate(frame, [L(CUE.entonces), L(CUE.cruzando) + 10], [0, 1], clamp);
  const eyes = useSpr(L(CUE.cruzando) - 4, 8, 170);
  // a shaky hand-drawn line between both documents
  const pts = Array.from({ length: 24 }, (_, i) => {
    const t = i / 23;
    return `${i ? "L" : "M"}${(280 + t * 520).toFixed(1)},${(1075 + Math.sin(t * 19 + frame / 3) * 16 - Math.sin(t * Math.PI) * 40).toFixed(1)}`;
  }).join(" ");
  const pen = { x: 280 + man * 520, y: 1075 + Math.sin(man * 19 + frame / 3) * 16 - Math.sin(man * Math.PI) * 40 };
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 60, top: 470, width: 440, transform: `translateX(${(1 - f) * -560}px) rotate(${-3 * f}deg)` }}>
        <DocCard title="Factura" kind="CFDI · INGRESO" color={M.violet} icon={IC.doc} amount="$48,500" uuid="8F2A…19C0" />
      </div>
      <div style={{ position: "absolute", right: 60, top: 470, width: 440, transform: `translateX(${(1 - p) * 560}px) rotate(${3 * p}deg)` }}>
        <DocCard title="Pago" kind="CFDI · PAGO (REP)" color={M.mint} icon={IC.card} amount="$48,500" uuid="C90A…12FF" />
      </div>
      {man > 0 && (
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          <path d={pts} fill="none" stroke={M.coral} strokeWidth={7} strokeLinecap="round" strokeDasharray={600} strokeDashoffset={600 * (1 - man)} />
        </svg>
      )}
      {man > 0 && man < 1 && (
        <div style={{ position: "absolute", left: pen.x - 10, top: pen.y - 80, transform: `rotate(${Math.sin(frame / 2) * 8}deg)` }}>
          <Icon d={IC.pencil} size={90} color={M.coral} sw={2.2} />
        </div>
      )}
      {frame >= L(CUE.cruzando) - 4 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 290, display: "flex", justifyContent: "center", transform: `scale(${eyes}) translateY(${Math.sin(frame / 4) * 6}px)` }}>
          <Eyes size={140} />
        </div>
      )}
      {/* manual checklist underneath */}
      <div style={{ position: "absolute", left: 160, right: 160, top: 1190, opacity: man }}>
        <Card style={{ padding: "22px 30px", display: "flex", gap: 22, alignItems: "center", borderRadius: 24 }}>
          <Icon d={IC.pencil} size={46} color={M.coral} />
          <span style={{ fontWeight: 700, fontSize: 34 }}>Cruce manual</span>
          <span style={{ marginLeft: "auto", fontFamily: MONO, fontWeight: 700, fontSize: 30, color: M.coral }}>{Math.floor(man * 12)}/∞</span>
        </Card>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 2. CFDI → pagos → complementos → cruces. Y repetir. (a loop) ---------- */
const LOOP: { k: keyof typeof CUE; label: string; icon: string; color: string }[] = [
  { k: "cfdi", label: "CFDI", icon: IC.doc, color: M.violet },
  { k: "pagos", label: "Pagos", icon: IC.card, color: M.mint },
  { k: "complementos", label: "Complementos", icon: IC.puzzle, color: M.amber },
  { k: "cruces", label: "Cruces", icon: IC.link, color: M.coral },
];

export const S2Ciclo: React.FC<P> = ({ from }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const L = (t: number) => s(t) - from;
  const rep = L(CUE.repetir) - 6;
  const spin = frame > rep ? (frame - rep) * 6 : 0;
  const laps = frame > rep ? 1 + Math.floor((frame - rep) / 15) : 0;
  const cx = 540;
  const cy = 830;
  const R = 360;
  const arc = interpolate(frame, [L(CUE.cfdi), L(CUE.cruces) + 12], [0, 1], clamp);
  const c = 2 * Math.PI * (R - 40);
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <circle cx={cx} cy={cy} r={R - 40} fill="none" stroke="rgba(37,14,148,.12)" strokeWidth={14} />
        <circle cx={cx} cy={cy} r={R - 40} fill="none" stroke={M.purple} strokeWidth={14} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - arc)} transform={`rotate(${-90 + spin} ${cx} ${cy})`} />
      </svg>
      {LOOP.map((n, i) => {
        const at = L(CUE[n.k]);
        const p = spring({ frame: frame - at, fps, config: { damping: 9, stiffness: 180 } });
        const ang = (-90 + i * 90 + spin) * (Math.PI / 180);
        return (
          <div key={n.k} style={{ position: "absolute", left: cx + Math.cos(ang) * R, top: cy + Math.sin(ang) * R, transform: `translate(-50%, -50%) scale(${p})` }}>
            <Card style={{ width: 300, padding: "26px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 14, borderRadius: 30 }}>
              <div style={{ width: 100, height: 100, borderRadius: 30, background: n.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon d={n.icon} size={58} color="#fff" sw={1.9} />
              </div>
              <span style={{ fontWeight: 800, fontSize: 34 }}>{n.label}</span>
            </Card>
          </div>
        );
      })}
      {/* centre: repeat counter */}
      <div style={{ position: "absolute", left: cx - 120, top: cy - 120, width: 240, height: 240, borderRadius: 120, background: M.purple, color: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: FONT, transform: `scale(${laps ? 1 + 0.06 * Math.sin(frame / 3) : arc})`, boxShadow: "0 24px 60px rgba(37,14,148,.35)" }}>
        <div style={{ transform: `rotate(${spin}deg)` }}>
          <Icon d={IC.repeat} size={90} color="#fff" sw={2} />
        </div>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 34, marginTop: 6 }}>{laps ? `×${laps}` : ""}</div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 3. Alto volumen → tiempo y trabajo operativo ---------- */
export const S3Volumen: React.FC<P> = ({ from }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const L = (t: number) => s(t) - from;
  const start = L(CUE.volumen) - 14;
  const COLS = 8;
  const ROWS = 7;
  // documents pour in faster and faster
  const shown = Math.max(0, Math.floor(Math.pow(Math.max(0, frame - start) / 3, 1.35)));
  const g1 = interpolate(frame, [L(CUE.tiempo) - 6, L(CUE.tiempo) + 30], [0.15, 0.9], { ...clamp, easing: easeOut });
  const g2 = interpolate(frame, [L(CUE.trabajo) - 6, L(CUE.trabajo) + 26], [0.15, 0.95], { ...clamp, easing: easeOut });
  const colors = [M.violet, M.mint, M.amber, M.coral];
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 80, right: 80, top: 310, display: "grid", gridTemplateColumns: `repeat(${COLS}, 1fr)`, gap: 14 }}>
        {Array.from({ length: COLS * ROWS }).map((_, i) => {
          const order = (i * 37) % (COLS * ROWS);
          const p = spring({ frame: frame - start - Math.pow(order, 1 / 1.35) * 3, fps, config: { damping: 12, stiffness: 220 } });
          const on = order < shown;
          return (
            <div key={i} style={{ height: 96, borderRadius: 16, background: "#fff", boxShadow: "0 8px 18px rgba(20,90,60,.12)", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${on ? p : 0})`, opacity: on ? 1 : 0 }}>
              <Icon d={IC.doc} size={44} color={colors[i % 4]} sw={2.2} />
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", top: 1150, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 30, color: M.purple, background: "#fff", borderRadius: 999, padding: "10px 26px", boxShadow: "0 10px 24px rgba(20,90,60,.12)" }}>{Math.min(9999, Math.floor(shown * 61)).toLocaleString("en-US")} operaciones</div>
      </div>
      {[
        { label: "Tiempo", v: g1, icon: IC.clock, at: L(CUE.tiempo) - 6 },
        { label: "Trabajo operativo", v: g2, icon: IC.pencil, at: L(CUE.trabajo) - 6 },
      ].map((g, i) => {
        const p = spring({ frame: frame - g.at, fps, config: { damping: 12, stiffness: 170 } });
        return (
          <div key={g.label} style={{ position: "absolute", left: 80 + i * 470, top: 1240, width: 450, opacity: Math.min(1, p * 1.5), transform: `translateY(${(1 - p) * 40}px)` }}>
            <Card style={{ padding: "20px 24px", borderRadius: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Icon d={g.icon} size={36} color={M.coral} />
                <span style={{ fontWeight: 700, fontSize: 28 }}>{g.label}</span>
                <span style={{ marginLeft: "auto", fontWeight: 800, fontSize: 30, color: M.coral }}>↑</span>
              </div>
              <div style={{ marginTop: 12, height: 18, borderRadius: 9, background: "#F1F3F7", overflow: "hidden" }}>
                <div style={{ width: `${g.v * 100}%`, height: "100%", background: M.coral, borderRadius: 9 }} />
              </div>
            </Card>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* ---------- 4. Conciliación de Pagos: pairs linked, results in the platform ---------- */
const PAIRS = [
  ["F-2291 · $48,500", "REP-118 · $48,500"],
  ["F-2304 · $12,300", "REP-121 · $12,300"],
  ["F-2310 · $7,980", "REP-124 · $7,980"],
  ["F-2315 · $31,200", "REP-129 · $31,200"],
];

export const S4Conciliacion: React.FC<P> = ({ from }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const L = (t: number) => s(t) - from;
  const win = useSpr(0, 13, 150);
  const sat = useSpr(L(CUE.descargados) - 6, 10, 170);
  const linkAt = L(CUE.relaciona) + 6;
  const res = useSpr(L(CUE.resultados) - 6, 12, 160);
  const donut = interpolate(frame, [L(CUE.resultados), L(CUE.resultados) + 30], [0, 0.96], { ...clamp, easing: easeOut });
  const rowY = (i: number) => 250 + i * 122;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 50, right: 50, top: 300, height: 1060, opacity: Math.min(1, win * 1.5), transform: `scale(${0.92 + 0.08 * win})` }}>
        <Card style={{ position: "absolute", inset: 0, overflow: "hidden", padding: 0 }}>
          <div style={{ height: 110, display: "flex", alignItems: "center", gap: 18, padding: "0 34px", borderBottom: `2px solid ${M.line}` }}>
            <Img src={staticFile("brand/fispal-logo.png")} style={{ height: 46 }} />
            <span style={{ marginLeft: "auto", fontWeight: 800, fontSize: 34, color: M.purple }}>Conciliación de Pagos</span>
          </div>
          <div style={{ display: "flex", padding: "26px 34px 0", fontFamily: MONO, fontWeight: 700, fontSize: 22, color: M.sub, letterSpacing: "0.06em" }}>
            <span style={{ flex: 1 }}>CFDI</span>
            <span style={{ flex: 1, textAlign: "right", display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 10 }}>
              CFDI DE PAGO
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#EEF0FF", color: M.purple, borderRadius: 999, padding: "4px 12px", transform: `scale(${sat})` }}>
                <Icon d={IC.cloud} size={22} color={M.purple} /> SAT
              </span>
            </span>
          </div>
          {/* link lines */}
          <svg width={980} height={760} style={{ position: "absolute", left: 0, top: 0 }}>
            {PAIRS.map((_, i) => {
              const p = interpolate(frame, [linkAt + i * 8, linkAt + i * 8 + 12], [0, 1], { ...clamp, easing: easeOut });
              const y = rowY(i) + 42;
              return <path key={i} d={`M440,${y} C490,${y} 490,${y} 540,${y}`} fill="none" stroke={M.mint} strokeWidth={6} strokeLinecap="round" strokeDasharray={110} strokeDashoffset={110 * (1 - p)} />;
            })}
          </svg>
          {PAIRS.map(([a, b], i) => {
            const p = spring({ frame: frame - 4 - i * 3, fps, config: { damping: 12, stiffness: 180 } });
            const ok = frame >= linkAt + i * 8 + 10;
            return (
              <React.Fragment key={i}>
                {[a, b].map((t, k) => (
                  <div key={k} style={{ position: "absolute", top: rowY(i), [k ? "right" : "left"]: 34, width: 400, height: 84, borderRadius: 20, background: ok ? "rgba(32,176,126,.1)" : "#F6F8FA", border: `2px solid ${ok ? M.mint : M.line}`, display: "flex", alignItems: "center", gap: 12, padding: "0 18px", boxSizing: "border-box", transform: `translateX(${(1 - p) * (k ? 300 : -300)}px)`, opacity: p } as React.CSSProperties}>
                    <Icon d={k ? IC.card : IC.doc} size={34} color={k ? M.mint : M.violet} />
                    <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 25 }}>{t}</span>
                  </div>
                ))}
                {ok && (
                  <div style={{ position: "absolute", left: 490 - 26, top: rowY(i) + 16, width: 52, height: 52, borderRadius: 26, background: M.mint, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${spring({ frame: frame - linkAt - i * 8 - 10, fps, config: { damping: 9, stiffness: 220 } })})` }}>
                    <Icon d={IC.check} size={30} color="#fff" sw={3.2} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
          {/* results */}
          <div style={{ position: "absolute", left: 34, right: 34, top: 760, height: 260, borderRadius: 26, background: "#F4FBF8", border: `2px solid ${M.line}`, display: "flex", alignItems: "center", gap: 40, padding: "0 40px", opacity: Math.min(1, res * 1.5), transform: `translateY(${(1 - res) * 60}px)` }}>
            <svg width={190} height={190} viewBox="0 0 190 190">
              <circle cx={95} cy={95} r={76} fill="none" stroke="#E3E8EE" strokeWidth={24} />
              <circle cx={95} cy={95} r={76} fill="none" stroke={M.mint} strokeWidth={24} strokeLinecap="round" strokeDasharray={2 * Math.PI * 76} strokeDashoffset={2 * Math.PI * 76 * (1 - donut)} transform="rotate(-90 95 95)" />
              <text x={95} y={108} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={40} fill={M.ink}>{Math.round(donut * 100)}%</text>
            </svg>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ fontWeight: 800, fontSize: 40 }}>Resultados</div>
              <div style={{ fontWeight: 600, fontSize: 30, color: M.mint }}>● 128 conciliados</div>
              <div style={{ fontWeight: 600, fontSize: 30, color: M.amber }}>● 6 pendientes</div>
            </div>
          </div>
        </Card>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 5. Menos cruces manuales / Más visibilidad (+ question) ---------- */
export const S5MenosMas: React.FC<P> = ({ from }) => {
  const frame = useCurrentFrame();
  const L = (t: number) => s(t) - from;
  const a = useSpr(0, 12, 160);
  const manual = Math.round(interpolate(frame, [6, 40], [120, 6], { ...clamp, easing: easeOut }));
  const vis = useSpr(L(CUE.visibilidad) - 6, 12, 160);
  const pct = interpolate(frame, [L(CUE.visibilidad) - 4, L(CUE.visibilidad) + 30], [0.35, 0.96], { ...clamp, easing: easeOut });
  const q = useSpr(L(CUE.todavia) - 4, 9, 170);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 70, right: 70, top: 340, opacity: Math.min(1, a * 1.5), transform: `translateX(${(1 - a) * -200}px)` }}>
        <Card style={{ padding: "52px 44px", display: "flex", alignItems: "center", gap: 30 }}>
          <div style={{ width: 130, height: 130, borderRadius: 36, background: "rgba(242,100,90,.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon d={IC.pencil} size={74} color={M.coral} />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 32, color: M.sub }}>Cruces manuales</div>
            <div style={{ fontWeight: 800, fontSize: 96, lineHeight: 1, color: M.coral }}>
              {manual} <span style={{ fontSize: 50 }}>↓</span>
            </div>
          </div>
        </Card>
      </div>
      <div style={{ position: "absolute", left: 70, right: 70, top: 750, opacity: Math.min(1, vis * 1.5), transform: `translateX(${(1 - vis) * 200}px)` }}>
        <Card style={{ padding: "52px 44px", display: "flex", alignItems: "center", gap: 30 }}>
          <svg width={150} height={150} viewBox="0 0 150 150">
            <circle cx={75} cy={75} r={58} fill="none" stroke="#E3E8EE" strokeWidth={20} />
            <circle cx={75} cy={75} r={58} fill="none" stroke={M.mint} strokeWidth={20} strokeLinecap="round" strokeDasharray={2 * Math.PI * 58} strokeDashoffset={2 * Math.PI * 58 * (1 - pct)} transform="rotate(-90 75 75)" />
          </svg>
          <div>
            <div style={{ fontWeight: 600, fontSize: 32, color: M.sub }}>Visibilidad de tu conciliación</div>
            <div style={{ fontWeight: 800, fontSize: 96, lineHeight: 1, color: M.mint }}>{Math.round(pct * 100)}%</div>
          </div>
        </Card>
      </div>
      {frame >= L(CUE.todavia) - 4 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1190, display: "flex", justifyContent: "center", transform: `scale(${q})` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20, background: M.purple, color: "#fff", borderRadius: 999, padding: "26px 44px", fontFamily: FONT, fontWeight: 800, fontSize: 44, boxShadow: "0 20px 50px rgba(37,14,148,.35)" }}>
            <Icon d={IC.pencil} size={52} color="#fff" />
            ¿Sigues a mano?
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

/* ---------- 6. CTA ---------- */
export const S6Cta: React.FC<P> = ({ from }) => {
  const frame = useCurrentFrame();
  const L = (t: number) => s(t) - from;
  const pair = useSpr(2, 11, 150);
  const link = interpolate(frame, [14, 30], [0, 1], { ...clamp, easing: easeOut });
  const logo = useSpr(8, 11, 150);
  const btn = useSpr(Math.max(10, L(CUE.gratis) - 6), 8, 170);
  const url = useSpr(L(CUE.url), 12, 170);
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      {/* invoice + payment snapping together */}
      <div style={{ position: "absolute", top: 340, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 0 }}>
        {[{ icon: IC.doc, c: M.violet, t: "Factura" }, { icon: IC.card, c: M.mint, t: "Pago" }].map((d, i) => (
          <div key={d.t} style={{ transform: `translateX(${(1 - link) * (i ? 120 : -120)}px) scale(${pair})` }}>
            <Card style={{ width: 230, height: 230, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
              <div style={{ width: 100, height: 100, borderRadius: 30, background: d.c, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon d={d.icon} size={58} color="#fff" sw={1.9} />
              </div>
              <span style={{ fontWeight: 800, fontSize: 32 }}>{d.t}</span>
            </Card>
          </div>
        ))}
        <div style={{ position: "absolute", width: 90, height: 90, borderRadius: 45, background: M.mint, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${link})`, boxShadow: "0 12px 30px rgba(32,176,126,.45)" }}>
          <Icon d={IC.check} size={54} color="#fff" sw={3.2} />
        </div>
      </div>
      <div style={{ position: "absolute", top: 700, transform: `scale(${0.85 + 0.15 * logo})`, opacity: logo }}>
        <Img src={staticFile("brand/fispal-logo.png")} style={{ width: 640 }} />
      </div>
      <div style={{ position: "absolute", top: 1010, transform: `scale(${btn})` }}>
        <div style={{ background: M.purple, color: "#fff", fontFamily: FONT, fontWeight: 800, fontSize: 52, borderRadius: 999, padding: "30px 74px", boxShadow: "0 20px 50px rgba(37,14,148,.35)" }}>
          Prueba gratis <span style={{ color: M.mintBright }}>→</span>
        </div>
      </div>
      <div style={{ position: "absolute", top: 1210, opacity: url, transform: `translateY(${(1 - url) * 20}px)` }}>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 34, color: M.purple, background: "#fff", borderRadius: 999, padding: "14px 34px", boxShadow: "0 10px 26px rgba(20,90,60,.14)" }}>fispal.mx</div>
      </div>
    </AbsoluteFill>
  );
};
