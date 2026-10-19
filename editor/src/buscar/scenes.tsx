// Scenes of the Fispal "¿Dónde está tu CFDI?" reel. Every scene gets `from`
// (its first reel frame) so it can place its beats on the voice-over cues.
import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Illus, IllusFloaters } from "../fispal/Illus";
import { C, FONT, MONO, s } from "../fispal/theme";
import { Card, Check, Enter, Headline, Pill } from "../fispal/ui";
import { CUE } from "./timeline";

type P = { from: number };
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const TYPES = {
  Emitido: "#1BC47D",
  Recibido: "#F2A019",
  Pago: "#EC4C7A",
  Nómina: "#2F6BFF",
} as const;
type Tipo = keyof typeof TYPES;

const useSpring = (at: number, damping = 12, stiffness = 170) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - at, fps, config: { damping, stiffness } });
};

/* ---------- small pieces ---------- */
const XmlIcon: React.FC<{ size?: number; color?: string }> = ({ size = 34, color = C.purple }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
    <path d="M6 2.5h8l4.5 4.5v14.5H6z" fill="#fff" stroke={color} strokeWidth={1.8} strokeLinejoin="round" />
    <path d="M14 2.5V7h4.5" fill="none" stroke={color} strokeWidth={1.8} strokeLinejoin="round" />
    <path d="M9 12.5l-1.6 1.7L9 16M13.5 12.5l1.6 1.7-1.6 1.8M12 12l-1.4 4.5" fill="none" stroke={color} strokeWidth={1.4} strokeLinecap="round" />
  </svg>
);

const FileChip: React.FC<{ name: string; hl?: number; style?: React.CSSProperties }> = ({ name, hl = 0, style }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 12,
      background: C.white,
      borderRadius: 16,
      padding: "14px 20px",
      boxShadow: hl > 0 ? `0 0 0 ${4 * hl}px ${C.accent}, 0 0 ${40 * hl}px rgba(32,217,157,.6)` : "0 10px 26px rgba(37,14,148,.14)",
      fontFamily: MONO,
      fontWeight: 500,
      fontSize: 24,
      color: C.text,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    <XmlIcon />
    {name}
  </div>
);

const TypeBadge: React.FC<{ t: Tipo; size?: number }> = ({ t, size = 22 }) => (
  <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: size, color: TYPES[t], background: `${TYPES[t]}1F`, borderRadius: 999, padding: `${size * 0.2}px ${size * 0.6}px` }}>{t}</span>
);

// deterministic pseudo-random
const rnd = (i: number, k = 1) => {
  const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return x - Math.floor(x);
};
const uuid = (i: number) => `${Math.floor(rnd(i, 3) * 0xffff).toString(16).toUpperCase().padStart(4, "0")}${Math.floor(rnd(i, 4) * 0xffff).toString(16).toUpperCase().padStart(4, "0")}`;

/* ---------- 1. Hook: the SAT has it all, your company… not so easy ---------- */
export const S1Hook: React.FC<P> = ({ from }) => {
  const frame = useCurrentFrame();
  const L = (t: number) => s(t) - from;
  const box = useSpring(2, 13, 150);
  const shrink = interpolate(frame, [L(CUE.pero) - 4, L(CUE.pero) + 10], [0, 1], { ...clamp, easing: (x) => 1 - Math.pow(1 - x, 3) });
  const target = L(CUE.cfdi);
  const buried = interpolate(frame, [L(CUE.historia) - 6, L(CUE.historia) + 10], [0, 1], clamp);
  const hl = interpolate(frame, [target, target + 8], [0, 1], clamp) * (1 - buried);
  // CFDI chips streaming into the SAT block
  const stream = Array.from({ length: 10 }).map((_, i) => {
    const t = ((frame + i * 9) % 60) / 60;
    const side = i % 2 ? 1 : -1;
    return { x: 540 + side * (520 - t * 300), y: 380 + (i % 5) * 70 - 140 + t * 120, o: Math.sin(t * Math.PI) * (1 - shrink) };
  });
  const N = 26;
  return (
    <AbsoluteFill>
      {stream.map((p, i) => (
        <div key={i} style={{ position: "absolute", left: p.x - 30, top: p.y + 260, opacity: p.o, transform: `scale(.8)` }}>
          <XmlIcon size={56} color={i % 3 ? C.purple : "#1BC47D"} />
        </div>
      ))}
      {/* SAT block */}
      <div
        style={{
          position: "absolute",
          left: 540 - 260,
          top: interpolate(shrink, [0, 1], [520, 250]),
          width: 520,
          transformOrigin: "50% 0",
          transform: `scale(${box * (1 - 0.42 * shrink)})`,
        }}
      >
        <div style={{ borderRadius: 40, padding: "44px 40px", background: `linear-gradient(150deg, #3A22C4, ${C.purple})`, boxShadow: "0 40px 90px rgba(37,14,148,.35)", textAlign: "center", color: C.white, fontFamily: FONT }}>
          <svg width={110} height={110} viewBox="0 0 24 24">
            <path d="M3 9.5L12 4l9 5.5M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18" fill="none" stroke="#fff" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div style={{ fontWeight: 800, fontSize: 110, lineHeight: 1, letterSpacing: "-0.02em" }}>SAT</div>
          <div style={{ marginTop: 18, fontWeight: 600, fontSize: 30, opacity: 0.85 }}>Todas tus operaciones</div>
        </div>
      </div>
      {/* "Tu empresa": files piling up with no order */}
      {frame >= L(CUE.pero) - 2 && (
        <>
          <div style={{ position: "absolute", top: 560, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: shrink }}>
            <Pill>Tu empresa</Pill>
          </div>
          {Array.from({ length: N }).map((_, i) => {
            const isTarget = i === 9;
            const late = i >= 20; // these fall on top of the target at "historia"
            const at = late ? L(CUE.historia) - 4 + (i - 20) * 2 : L(CUE.pero) + 2 + i * 2;
            const p = spring({ frame: frame - at, fps: 30, config: { damping: 10, stiffness: 120, mass: 0.7 } });
            if (frame < at) return null;
            const x = 70 + rnd(i) * 620 + (late ? 40 : 0);
            const y = 700 + rnd(i, 2) * 560 - (late ? 120 : 0);
            const yy = isTarget ? 960 : y;
            const xx = isTarget ? 330 : x;
            const rot = (rnd(i, 5) - 0.5) * 34;
            return (
              <div key={i} style={{ position: "absolute", left: xx, top: interpolate(p, [0, 1], [-200, yy]), transform: `rotate(${rot * p}deg) scale(${isTarget ? 1 + 0.08 * hl : 1})`, zIndex: isTarget ? 5 : late ? 10 : 1 }}>
                <FileChip name={isTarget ? `${uuid(i)}.xml` : `cfdi_${uuid(i)}.xml`} hl={isTarget ? hl : 0} />
                {isTarget && hl > 0.05 && (
                  <div style={{ position: "absolute", right: -26, top: -30, width: 56, height: 56, borderRadius: 28, background: C.accent, color: C.white, fontFamily: FONT, fontWeight: 800, fontSize: 36, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${hl * (1 + Math.sin(frame / 4) * 0.08)})` }}>?</div>
                )}
              </div>
            );
          })}
        </>
      )}
    </AbsoluteFill>
  );
};

/* ---------- 2. CFDI types, growing every day ---------- */
const CATS: { t: Tipo; label: string; cue: keyof typeof CUE; base: number; icon: string }[] = [
  { t: "Emitido", label: "Emitidos", cue: "emitidos", base: 4280, icon: "M12 19V5M6 11l6-6 6 6" },
  { t: "Recibido", label: "Recibidos", cue: "recibidos", base: 6115, icon: "M12 5v14M6 13l6 6 6-6" },
  { t: "Pago", label: "Pagos", cue: "pagos", base: 1932, icon: "M3 7h18v10H3zM3 11h18M7 15h3" },
  { t: "Nómina", label: "Nómina", cue: "nomina", base: 2408, icon: "M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M16 4.5a3.5 3.5 0 0 1 0 6.5M18 14.5c1.9.8 3 2.8 3 5.5" },
];

export const S2Tipos: React.FC<P> = ({ from }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const L = (t: number) => s(t) - from;
  const grow = L(CUE.crece);
  // counters tick slowly, then race once "crece" is said
  const speed = (f: number) => (f < grow ? f * 0.6 : grow * 0.6 + Math.pow(f - grow, 1.6) * 1.4);
  return (
    <AbsoluteFill>
      <Illus name="facturas" at={2} out={grow - 3} x={540} y={420} size={400} />
      <Illus name="calendario" at={grow} x={540} y={420} size={380} />
      {grow <= frame && (
        <div style={{ position: "absolute", top: 640, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <Enter>
            <Pill>+ CFDI todos los días</Pill>
          </Enter>
        </div>
      )}
      <div style={{ position: "absolute", left: 60, right: 60, top: 740, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
        {CATS.map((c, i) => {
          const at = L(CUE[c.cue]);
          const p = spring({ frame: frame - at, fps, config: { damping: 9, stiffness: 180 } });
          const n = Math.floor(c.base + speed(Math.max(0, frame - at)) * (1 + i * 0.3));
          const jiggle = frame > grow ? Math.sin(frame / 2 + i) * 1.2 : 0;
          return (
            <div key={c.t} style={{ opacity: Math.min(1, p * 2), transform: `scale(${0.7 + 0.3 * p}) rotate(${jiggle}deg)` }}>
              <Card style={{ padding: "30px 30px 26px", fontFamily: FONT }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ width: 68, height: 68, borderRadius: 20, background: `${TYPES[c.t]}22`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width={38} height={38} viewBox="0 0 24 24">
                      <path d={c.icon} fill="none" stroke={TYPES[c.t]} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 36, color: C.text }}>{c.label}</div>
                </div>
                <div style={{ marginTop: 18, fontWeight: 800, fontSize: 64, color: C.text, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>{n.toLocaleString("en-US")}</div>
                <div style={{ fontFamily: MONO, fontSize: 22, color: "#6B6F86", marginTop: 2 }}>CFDI</div>
              </Card>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 3. ¿Dónde está? ---------- */
const NAMES = ["Grupo Andino SA", "Comercial Rivas", "Servicios Lumen", "Rosa Montes", "Transportes Kal", "Papelera Norte", "Agrícola Sierra", "Distribuidora Mar", "Taller Ocampo", "Farmacia Lúa", "Constructora Vía", "Hotel Brisa", "Café Altura", "Logística Nube"];
const tipoOf = (i: number): Tipo => (["Emitido", "Recibido", "Pago", "Nómina"] as Tipo[])[i % 4];

const Row: React.FC<{ i: number; style?: React.CSSProperties; hl?: number }> = ({ i, style, hl = 0 }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 18,
      padding: "18px 26px",
      background: hl > 0 ? `rgba(32,217,157,${0.14 * hl})` : C.white,
      borderBottom: "1px solid #EEF0F6",
      fontFamily: FONT,
      fontSize: 26,
      color: C.text,
      ...style,
    }}
  >
    <span style={{ fontFamily: MONO, fontSize: 22, color: "#6B6F86", width: 150 }}>{uuid(i + 40)}</span>
    <span style={{ flex: 1, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden" }}>{NAMES[i % NAMES.length]}</span>
    <TypeBadge t={tipoOf(i)} size={20} />
    <span style={{ fontWeight: 700, width: 150, textAlign: "right" }}>${(1200 + rnd(i, 7) * 18000).toLocaleString("en-US", { maximumFractionDigits: 0 })}</span>
  </div>
);

export const S3Donde: React.FC<P> = ({ from }) => {
  const frame = useCurrentFrame();
  const L = (t: number) => s(t) - from;
  const ask = L(CUE.donde);
  const q = useSpring(ask - 2, 8, 170);
  const scroll = frame * 14 + Math.max(0, frame - ask) * 20;
  const blur = interpolate(frame, [0, ask, ask + 10], [1.5, 3, 7], clamp);
  const ghost = interpolate(frame, [L(CUE.especifico), L(CUE.especifico) + 8], [0, 1], clamp);
  // the magnifier sweeps the list
  const t = frame / 18;
  const lx = 540 + Math.sin(t) * 260 + (frame > ask ? Math.sin(frame * 1.7) * 14 : 0);
  const ly = 760 + Math.sin(t * 1.6) * 220;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 60, right: 60, top: 300, height: 1040, borderRadius: 28, overflow: "hidden", boxShadow: "0 30px 80px rgba(37,14,148,.15)", background: C.white }}>
        <div style={{ transform: `translateY(${-(scroll % (90 * 28))}px)`, filter: `blur(${blur}px)` }}>
          {Array.from({ length: 56 }).map((_, i) => (
            <Row key={i} i={i % 28} />
          ))}
        </div>
        <div style={{ position: "absolute", inset: 0, background: `rgba(248,249,255,${interpolate(frame, [ask, ask + 10], [0, 0.55], clamp)})` }} />
      </div>
      {/* the one we are looking for, as a dashed ghost */}
      <div style={{ position: "absolute", left: 160, right: 160, top: 470, opacity: ghost * (1 - q), transform: `scale(${0.9 + 0.1 * ghost})` }}>
        <div style={{ border: `4px dashed ${C.accent}`, borderRadius: 22, padding: "22px 28px", background: "rgba(255,255,255,.9)", fontFamily: MONO, fontSize: 28, color: C.text, textAlign: "center" }}>UUID 8F2A…  ·  ¿?</div>
      </div>
      <Illus name="lupa" at={4} x={lx} y={ly} size={360} tilt={6} />
      {frame >= ask - 2 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 720, transform: `scale(${0.6 + 0.4 * q}) rotate(${(1 - Math.min(1, q)) * -6}deg)`, opacity: Math.min(1, q * 2) }}>
          <Headline size={124} style={{ fontWeight: 800 }}>
            ¿Dónde <span style={{ color: C.purple }}>está?</span>
          </Headline>
        </div>
      )}
    </AbsoluteFill>
  );
};

/* ---------- 4. Fispal: all your CFDI, searchable by criteria ---------- */
const CRITERIA = [
  { k: "RFC", v: "XAXX010101000" },
  { k: "Fecha", v: "Sep 2026" },
  { k: "Tipo", v: "Recibido" },
  { k: "Monto", v: "> $5,000" },
  { k: "UUID", v: "" },
];
const MATCH = 5; // row index that survives the filters

export const S4Fispal: React.FC<P> = ({ from }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const L = (t: number) => s(t) - from;
  const win = useSpring(0, 14, 140);
  const conc = L(CUE.concentra);
  const typing = L(CUE.consultarlos);
  const crit = L(CUE.distintos);
  const chipAt = (i: number) => crit + i * 7;
  const filtered = interpolate(frame, [chipAt(2), chipAt(2) + 12], [0, 1], clamp);
  const found = L(CUE.criterios) + 14;
  const hl = interpolate(frame, [found, found + 8], [0, 1], clamp);
  const query = "XAXX010101000";
  const typed = query.slice(0, Math.max(0, Math.floor((frame - typing) / 1.3)));
  const total = Math.floor(interpolate(frame, [conc, conc + 30], [0, 14735], clamp));
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 50, right: 50, top: 290, height: 1060, opacity: Math.min(1, win * 1.5), transform: `perspective(1600px) rotateX(${(1 - win) * 14}deg) scale(${0.9 + 0.1 * win})` }}>
        <Card style={{ position: "absolute", inset: 0, overflow: "hidden", background: "#F4F5F9" }}>
          {/* top bar */}
          <div style={{ height: 96, background: C.white, display: "flex", alignItems: "center", padding: "0 32px", gap: 18, borderBottom: "1px solid #E6E8F0" }}>
            <Img src={staticFile("brand/fispal-logo.png")} style={{ height: 44 }} />
            <div style={{ flex: 1 }} />
            <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 26, color: C.text, background: C.mint, borderRadius: 999, padding: "8px 20px", fontVariantNumeric: "tabular-nums" }}>{total.toLocaleString("en-US")} CFDI</div>
          </div>
          {/* search */}
          <div style={{ margin: "28px 32px 0", background: C.white, borderRadius: 18, height: 86, display: "flex", alignItems: "center", gap: 16, padding: "0 26px", boxShadow: frame > typing ? `0 0 0 3px ${C.accent}` : "0 4px 14px rgba(37,14,148,.06)" }}>
            <svg width={36} height={36} viewBox="0 0 24 24">
              <path d="M10.5 4a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM15.5 15.5L20 20" fill="none" stroke={C.purple} strokeWidth={2.2} strokeLinecap="round" />
            </svg>
            <span style={{ fontFamily: MONO, fontSize: 30, color: typed ? C.text : "#A3A7BA" }}>
              {typed || "Buscar CFDI…"}
              {frame > typing && frame < found && Math.floor(frame / 8) % 2 === 0 && <span style={{ color: C.accent }}>|</span>}
            </span>
          </div>
          {/* criteria chips */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14, margin: "22px 32px" }}>
            {CRITERIA.map((c, i) => {
              const on = spring({ frame: frame - chipAt(i), fps, config: { damping: 10, stiffness: 200 } });
              const active = i < 4 && frame >= chipAt(i);
              return (
                <div key={c.k} style={{ fontFamily: FONT, fontWeight: 600, fontSize: 26, borderRadius: 999, padding: "12px 22px", background: active ? C.purple : C.white, color: active ? C.white : C.text, border: `2px solid ${active ? C.purple : "#E1E3EC"}`, transform: `scale(${active ? 1 + 0.08 * Math.sin(Math.min(1, on) * Math.PI) : 1})` }}>
                  {c.k}
                  {active && c.v && <span style={{ fontFamily: MONO, fontSize: 22, opacity: 0.8 }}> · {c.v}</span>}
                </div>
              );
            })}
          </div>
          {/* table */}
          <div style={{ margin: "0 32px", borderRadius: 20, overflow: "hidden", background: C.white, boxShadow: "0 4px 14px rgba(37,14,148,.06)" }}>
            {Array.from({ length: 9 }).map((_, i) => {
              const fly = spring({ frame: frame - conc - i * 2, fps, config: { damping: 13, stiffness: 150 } });
              const keep = i === MATCH;
              const h = keep ? 1 : 1 - filtered;
              return (
                <div key={i} style={{ maxHeight: 84 * h, overflow: "hidden", opacity: Math.min(1, fly * 1.5) * (keep ? 1 : h), transform: `translateX(${(1 - fly) * (i % 2 ? 900 : -900)}px)` }}>
                  <Row i={i} hl={keep ? hl : 0} />
                </div>
              );
            })}
          </div>
          {hl > 0 && (
            <div style={{ margin: "26px 32px", display: "flex", alignItems: "center", gap: 18, fontFamily: FONT, fontWeight: 700, fontSize: 32, color: C.text, opacity: hl }}>
              <Check size={52} on={hl} /> CFDI encontrado
            </div>
          )}
        </Card>
      </div>
      <Illus name="check" at={found} x={820} y={1080} size={300} />
    </AbsoluteFill>
  );
};

/* ---------- 5. Antes / Ahora ---------- */
export const S5AntesAhora: React.FC<P> = ({ from }) => {
  const frame = useCurrentFrame();
  const L = (t: number) => s(t) - from;
  const now = L(CUE.ahora);
  const ahora = useSpring(now - 2, 11, 160);
  const dim = interpolate(frame, [now - 2, now + 8], [0, 1], clamp);
  return (
    <AbsoluteFill>
      {/* ANTES */}
      <div style={{ position: "absolute", left: 60, right: 60, top: 280, height: 470, opacity: 1 - 0.55 * dim, filter: `grayscale(${0.3 + 0.7 * dim})` }}>
        <div style={{ position: "absolute", left: 0, top: 0 }}>
          <Pill dot={false} style={{ background: "#8A8EA3" }}>Antes</Pill>
        </div>
        {Array.from({ length: 9 }).map((_, i) => {
          const at = 3 + i * 3;
          const p = interpolate(frame, [at, at + 8], [0, 1], clamp);
          const wob = Math.sin(frame / 5 + i) * 3;
          return (
            <div key={i} style={{ position: "absolute", left: 20 + (i % 3) * 300 + rnd(i, 9) * 40, top: 100 + Math.floor(i / 3) * 120 + rnd(i, 8) * 30, opacity: p, transform: `rotate(${(rnd(i, 6) - 0.5) * 20 + wob}deg) scale(${0.8 + 0.2 * p})` }}>
              <FileChip name={`${["factura", "pago", "nomina"][i % 3]}_${uuid(i + 70).slice(0, 4)}.xml`} style={{ fontSize: 20, padding: "10px 14px" }} />
            </div>
          );
        })}
        {/* searching between files: a little magnifier going back and forth */}
        <div style={{ position: "absolute", left: 420 + Math.sin(frame / 7) * 300, top: 200 + Math.cos(frame / 9) * 90, opacity: 1 - dim }}>
          <svg width={90} height={90} viewBox="0 0 24 24">
            <path d="M10.5 4a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM15.5 15.5L20 20" fill="rgba(255,255,255,.5)" stroke={C.text} strokeWidth={2} strokeLinecap="round" />
          </svg>
        </div>
      </div>
      {/* AHORA */}
      <div style={{ position: "absolute", left: 60, right: 60, top: 820, opacity: Math.min(1, ahora * 1.5), transform: `translateY(${(1 - ahora) * 80}px) scale(${0.9 + 0.1 * ahora})` }}>
        <Pill>Ahora</Pill>
        <Card style={{ marginTop: 24, padding: "34px 36px", display: "flex", alignItems: "center", gap: 28, border: `4px solid ${C.accent}` }}>
          <div style={{ width: 120, height: 120, borderRadius: 32, background: C.mint, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Img src={staticFile("brand/fispal-logo.png")} style={{ width: 96, objectFit: "contain" }} />
          </div>
          <div style={{ fontFamily: FONT }}>
            <div style={{ fontWeight: 800, fontSize: 48, color: C.text, lineHeight: 1.05 }}>Todos tus CFDI</div>
            <div style={{ fontWeight: 600, fontSize: 32, color: C.purple, marginTop: 8 }}>en un mismo lugar</div>
          </div>
          <div style={{ marginLeft: "auto" }}>
            <Check size={64} on={interpolate(frame, [L(CUE.lugar) - 4, L(CUE.lugar) + 6], [0, 1], clamp)} />
          </div>
        </Card>
      </div>
      <Illus name="modulos" at={now + 4} x={900} y={1230} size={240} />
    </AbsoluteFill>
  );
};

/* ---------- 6. CTA ---------- */
export const S6Cta: React.FC<P> = ({ from }) => {
  const L = (t: number) => s(t) - from;
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <IllusFloaters />
      <Illus name="esfera" at={2} x={540} y={380} size={440} />
      <div style={{ position: "absolute", top: 640 }}>
        <Enter delay={4} from={0.85}>
          <Img src={staticFile("brand/fispal-logo.png")} style={{ width: 640 }} />
        </Enter>
      </div>
      <div style={{ position: "absolute", top: 1000 }}>
        <Enter delay={Math.max(6, L(CUE.gratis) - 4)}>
          <div style={{ background: C.accent, color: C.white, fontFamily: FONT, fontWeight: 700, fontSize: 50, borderRadius: 999, padding: "30px 68px", boxShadow: "0 18px 40px rgba(32,217,157,.35)" }}>Comienza gratis →</div>
        </Enter>
      </div>
      <div style={{ position: "absolute", top: 1200 }}>
        <Enter delay={L(CUE.url)}>
          <Pill style={{ textTransform: "none", fontSize: 32 }}>fispal.mx</Pill>
        </Enter>
      </div>
    </AbsoluteFill>
  );
};
