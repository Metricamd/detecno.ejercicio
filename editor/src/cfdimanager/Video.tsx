// CFDI Manager — talking-head edit: clip at 1.2× with the silences cut out
// (public/cfdimanager/video.mp4), diagrams on a stage at the top and subtitles
// at the bottom. The speaker is reframed (scaled around the face and lowered)
// and every silence cut becomes a jump-cut zoom, alternating a wide and a
// close scale, plus a slow push within each take. Look from the CFDI Manager
// logo: navy #263967, cyan #00CEFF, white tiles, Montserrat.
import { loadFont } from "@remotion/fonts";
import React, { useEffect, useState } from "react";
import { AbsoluteFill, Audio, continueRender, delayRender, Easing, Img, interpolate, OffthreadVideo, spring, staticFile, useCurrentFrame } from "remotion";

export const CFDIM_DURATION = 1105; // 36.83 s at 30 fps
const NAVY = "#263967";
const DEEP = "#16224A";
const CYAN = "#00CEFF";
const RED = "#F0506E";
const GREEN = "#22C58B";
const FONT = "Montserrat";

const fontsLoaded = Promise.all(["600", "700"].map((w) => loadFont({ family: FONT, url: staticFile(`fonts/montserrat-latin-${w}-normal.woff2`), weight: w })));

const t = (sec: number) => Math.round(sec * 30);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const bounce = (f: number, at: number) => spring({ frame: f - at, fps: 30, config: { damping: 11, stiffness: 150 } });

/* ---------- reframing with jump-cut zooms on the silence cuts ---------- */
const FACE = { x: 580, y: 1020 };
const TARGET = { x: 545, y: 1180 };
const CUTS = [0, 1.398, 4.421, 7.944, 13.1, 16.877, 17.507, 22.465]; // seconds in video.mp4

const Reframed: React.FC = () => {
  const f = useCurrentFrame();
  const sec = f / 30;
  let k = 0;
  while (k + 1 < CUTS.length && sec >= CUTS[k + 1]) k++;
  const base = k % 2 ? 1.42 : 1.3;
  const into = sec - CUTS[k];
  const s = base + Math.min(into, 6) * 0.006; // slow push inside each take
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ transformOrigin: `${FACE.x}px ${FACE.y}px`, transform: `translate(${TARGET.x - FACE.x}px, ${TARGET.y - FACE.y}px) scale(${s})` }}>
        <OffthreadVideo src={staticFile("cfdimanager/video.mp4")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------- subtitles (bottom) ---------- */
type W = [string, number];
const PAGES: { words: W[]; end: number }[] = [
  { words: [["¿Tienes", 0.19], ["un", 0.61], ["*ERP", 0.91]], end: 1.55 },
  { words: [["y", 1.63], ["quieres", 1.97], ["tener", 2.25], ["una", 2.47], ["*facturación", 2.69], ["*electrónica", 3.19], ["*confiable?", 3.77]], end: 4.5 },
  { words: [["Te", 4.59], ["invito", 4.77], ["a", 5.13], ["conocer", 5.69], ["nuestro", 5.87], ["sistema", 6.33], ["llamado", 6.75], ["*CFDI", 7.05], ["*Manager,", 7.51]], end: 8.12 },
  { words: [["con", 8.19], ["el", 8.29], ["cual", 8.41], ["podrás", 8.73], ["enviarnos", 9.59], ["un", 10.05], ["*TXT,", 10.17], ["un", 10.89], ["*XML,", 11.05]], end: 11.7 },
  { words: [["*conectarte", 11.79], ["a", 12.09], ["nuestras", 12.29], ["*APIs", 12.79]], end: 13.3 },
  { words: [["para", 13.37], ["que", 13.53], ["hagamos", 13.71], ["el", 14.05], ["proceso", 14.23], ["de", 14.41], ["*validación,", 14.61], ["*sellado", 15.57], ["del", 15.95], ["comprobante", 16.19]], end: 17.1 },
  { words: [["y", 17.19], ["*gestión", 17.89], ["*del", 18.41], ["*timbre", 18.69], ["en", 18.99], ["un", 19.11], ["modelo", 19.29], ["*multi-PAC", 19.69]], end: 20.4 },
  { words: [["para", 20.45], ["que", 20.59], ["tu", 20.71], ["operación", 20.91], ["*jamás", 21.69], ["*se", 21.95], ["*detenga.", 22.09]], end: 22.65 },
  { words: [["Con", 22.73], ["CFDI", 22.97], ["Manager", 23.39], ["podrás", 23.81], ["hacer", 24.69], ["*envíos", 24.87], ["*automáticos", 25.19], ["por", 25.67], ["correo,", 25.87]], end: 26.4 },
  { words: [["tener", 26.49], ["*PDF", 26.75], ["*personalizados,", 27.21]], end: 28.45 },
  { words: [["ver", 28.53], ["*reportería,", 28.79], ["*analizar", 29.69], ["la", 30.13], ["data", 30.31], ["que", 30.47], ["está", 30.63], ["ahí,", 30.81]], end: 31.35 },
  { words: [["ver", 31.41], ["*logs", 31.69], ["*de", 31.83], ["*auditoría;", 31.99]], end: 32.7 },
  { words: [["es", 32.77], ["decir,", 33.01], ["será", 33.33], ["tu", 33.51], ["*aliado", 33.69], ["en", 34.51], ["la", 34.57], ["facturación", 34.75], ["electrónica", 35.15], ["a", 35.55], ["clientes.", 35.73]], end: 36.83 },
];

const Subtitles: React.FC = () => {
  const f = useCurrentFrame();
  const sec = f / 30;
  const page = PAGES.find((p) => sec >= p.words[0][1] - 0.1 && sec < p.end);
  if (!page) return null;
  const start = t(page.words[0][1] - 0.1);
  const o = interpolate(f, [start, start + 4, t(page.end) - 3, t(page.end)], [0, 1, 1, 0], clamp);
  const y = interpolate(f, [start, start + 6], [14, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <div style={{ position: "absolute", left: 70, right: 70, top: 1650, display: "flex", justifyContent: "center", opacity: o, transform: `translateY(${y}px)` }}>
      <div style={{ background: "rgba(22,34,74,.9)", borderRadius: 20, borderBottom: `6px solid ${CYAN}`, padding: "16px 30px", maxWidth: 940, textAlign: "center", fontFamily: FONT, fontWeight: 600, fontSize: 42, lineHeight: 1.22, color: "#fff", boxShadow: "0 14px 34px rgba(0,0,0,.25)" }}>
        {page.words.map(([w, at], i) => {
          const key = w.startsWith("*");
          const on = sec >= at - 0.05;
          return (
            <React.Fragment key={i}>
              {i ? " " : ""}
              <span style={{ color: key ? CYAN : "#fff", fontWeight: key ? 700 : 600, opacity: on ? 1 : 0.4 }}>{key ? w.slice(1) : w}</span>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

/* ---------- stage building blocks ---------- */
const Icon: React.FC<{ d: string; size?: number; color?: string; sw?: number }> = ({ d, size = 34, color = NAVY, sw = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
    <path d={d} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IC = {
  db: "M12 3c4.4 0 8 1.3 8 3s-3.6 3-8 3-8-1.3-8-3 3.6-3 8-3zM4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3",
  doc: "M7 3h7l5 5v13H7zM14 3v5h5M10 12h6M10 16h6",
  shield: "M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6zM8.5 12l2.5 2.5 4.5-5",
  code: "M8 8l-4 4 4 4M16 8l4 4-4 4M14 5l-4 14",
  check: "M5 12.5l4.5 4.5L19 7.5",
  x: "M6 6l12 12M18 6L6 18",
  stamp: "M9 3h6v5l3 3v3H6v-3l3-3zM5 18h14v3H5z",
  seal: "M12 3l2.2 2 3-.4.8 2.9 2.6 1.6-1.2 2.8 1.2 2.8-2.6 1.6-.8 2.9-3-.4L12 21l-2.2-2-3 .4-.8-2.9-2.6-1.6L4.6 12 3.4 9.2 6 7.6l.8-2.9 3 .4zM9 12l2 2 4-4",
  lens: "M10.5 4a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM15.5 15.5L20 20M8 10.5l2 2 3.5-3.5",
  server: "M4 4h16v6H4zM4 14h16v6H4zM8 7h.01M8 17h.01",
  mail: "M3 6h18v12H3zM3 6l9 7 9-7",
  pdf: "M7 3h7l5 5v13H7zM14 3v5h5M9 13h2a1.5 1.5 0 0 1 0 3H9v-3zM9 16v2",
  chart: "M4 20V10M10 20V4M16 20v-7M22 20H2",
  pie: "M12 3v9h9A9 9 0 1 1 12 3zM15 3.5A9 9 0 0 1 20.5 9H15z",
  list: "M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01",
  hand: "M7 11l3-3 3 1 3-3 4 4-5 6-4-1-3 3-3-3zM2 13l3 3",
};

const Tile: React.FC<{ x: number; y: number; size?: number; d: string; at: number; label?: string; color?: string; phase?: number; dim?: boolean }> = ({ x, y, size = 160, d, at, label, color = NAVY, phase = 0, dim }) => {
  const f = useCurrentFrame();
  const b = bounce(f, at);
  if (f < at) return null;
  const bob = Math.sin((f - at) / 14 + phase) * 6;
  return (
    <div style={{ position: "absolute", left: x - size / 2, top: y - size / 2 + bob, width: size, transform: `scale(${b})`, display: "flex", flexDirection: "column", alignItems: "center", gap: 12, opacity: dim ? 0.45 : 1 }}>
      <div style={{ width: size, height: size, borderRadius: size * 0.22, background: "#fff", boxShadow: "0 22px 40px rgba(0,0,0,.35)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: size * 0.12, background: CYAN }} />
        <Icon d={d} size={size * 0.48} color={color} sw={2.2} />
      </div>
      {label && <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 30, color: "#fff", whiteSpace: "nowrap" }}>{label}</span>}
    </div>
  );
};

const Line: React.FC<{ x1: number; y1: number; x2: number; y2: number; at: number; color?: string }> = ({ x1, y1, x2, y2, at, color = CYAN }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [at, at + 10], [0, 1], clamp);
  return (
    <svg width={980} height={730} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <line x1={x1} y1={y1} x2={x1 + (x2 - x1) * p} y2={y1 + (y2 - y1) * p} stroke={color} strokeWidth={6} strokeLinecap="round" />
    </svg>
  );
};

const Dot: React.FC<{ x: number; y: number; at: number; ok?: boolean; size?: number }> = ({ x, y, at, ok = true, size = 56 }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  return (
    <div style={{ position: "absolute", left: x - size / 2, top: y - size / 2, width: size, height: size, borderRadius: size / 2, background: ok ? GREEN : RED, border: "4px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${bounce(f, at)})` }}>
      <Icon d={ok ? IC.check : IC.x} size={size * 0.55} color="#fff" sw={3.4} />
    </div>
  );
};

const Word: React.FC<{ children: React.ReactNode; at: number; y?: number; size?: number }> = ({ children, at, y = 600, size = 56 }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  return <div style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center", fontFamily: FONT, fontWeight: 700, fontSize: size, color: "#fff", transform: `scale(${bounce(f, at)})` }}>{children}</div>;
};

/* ---------- scenes (980×730 stage) ---------- */
// 1 — ERP → reliable e-invoicing
const S1: React.FC = () => (
  <>
    <Tile x={220} y={300} d={IC.server} at={t(0.6)} label="ERP" size={190} />
    <Line x1={330} y1={300} x2={650} y2={300} at={t(2.6)} />
    <Tile x={760} y={300} d={IC.doc} at={t(2.69)} label="CFDI" size={190} />
    <Dot x={840} y={215} at={t(3.77)} size={70} />
    <Word at={t(3.77)} y={570}>Confiable</Word>
  </>
);

// 2 — CFDI Manager
const S2: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${bounce(f, t(4.7)) * (1 + 0.06 * Math.max(0, 1 - Math.abs(f - t(7.2)) / 10))})` }}>
      <Img src={staticFile("cfdimanager/logo-white.png")} style={{ width: 700 }} />
    </div>
  );
};

// 3 — TXT, XML or APIs into the hub
const S3: React.FC = () => {
  const ins = [
    { y: 130, d: IC.doc, l: "TXT", at: t(10.17) },
    { y: 330, d: IC.doc, l: "XML", at: t(11.05) },
    { y: 530, d: IC.code, l: "API", at: t(12.79) },
  ];
  return (
    <>
      {ins.map((i) => <Line key={i.l} x1={300} y1={i.y} x2={640} y2={330} at={i.at + 4} />)}
      {ins.map((i, k) => (
        <React.Fragment key={i.l}>
          <Tile x={200} y={i.y} d={i.d} at={i.at} size={120} phase={k} />
          <span style={{ position: "absolute", left: 40, top: i.y - 20, fontFamily: FONT, fontWeight: 700, fontSize: 32, color: "#fff" }}>{i.l}</span>
        </React.Fragment>
      ))}
      <Tile x={760} y={330} d={IC.server} at={t(8.4)} size={210} color={NAVY} />
    </>
  );
};

// 4 — validation → seal → stamp pipeline
const S4: React.FC = () => {
  const steps = [
    { x: 160, d: IC.lens, l: "Validación", at: t(14.61) },
    { x: 490, d: IC.stamp, l: "Sellado", at: t(15.57) },
    { x: 820, d: IC.seal, l: "Timbre", at: t(18.69) },
  ];
  return (
    <>
      {steps.slice(1).map((s, k) => <Line key={s.l} x1={steps[k].x + 85} y1={300} x2={s.x - 85} y2={300} at={s.at - 6} />)}
      {steps.map((s, k) => (
        <React.Fragment key={s.l}>
          <Tile x={s.x} y={300} d={s.d} at={s.at} label={s.l} size={160} phase={k} />
          <Dot x={s.x + 62} y={232} at={s.at + 8} />
        </React.Fragment>
      ))}
    </>
  );
};

// 5 — multi-PAC: one PAC fails, the invoice reroutes, operation never stops
const S5: React.FC = () => {
  const f = useCurrentFrame();
  const fail = f >= t(21.1);
  const pacs = [140, 365, 590];
  return (
    <>
      <Tile x={190} y={420} d={IC.doc} at={t(19.7)} size={170} />
      {pacs.map((y, k) => {
        const down = k === 0 && fail;
        const active = fail ? k === 1 : k === 0;
        return (
          <React.Fragment key={y}>
            <Line x1={280} y1={420} x2={680} y2={y} at={t(19.75) + k * 3} color={down ? RED : active ? CYAN : "rgba(255,255,255,.3)"} />
            <Tile x={770} y={y} d={IC.server} at={t(19.69) + k * 3} size={130} dim={down} label={`PAC ${k + 1}`} />
            {down && <Dot x={830} y={y - 55} at={t(21.1)} ok={false} />}
            {active && fail && <Dot x={830} y={y - 55} at={t(21.3)} />}
          </React.Fragment>
        );
      })}
      {f >= t(21.69) && <div style={{ position: "absolute", left: 40, width: 420, top: 120, textAlign: "center", fontFamily: FONT, fontWeight: 700, fontSize: 50, lineHeight: 1.1, color: "#fff", transform: `scale(${bounce(f, t(21.69))})` }}>Jamás se detiene</div>}
    </>
  );
};

// 6 — automatic email + custom PDF
const S6: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      <Tile x={290} y={300} d={IC.mail} at={t(24.87)} label="Envío automático" size={190} />
      <Tile x={690} y={300} d={IC.pdf} at={t(26.75)} label="PDF a tu medida" size={190} phase={1} />
      <div style={{ position: "absolute", left: 600, top: 470, display: "flex", gap: 10, transform: `scale(${bounce(f, t(27.21))})` }}>
        {[CYAN, NAVY, "#FFFFFF", GREEN].map((c) => <span key={c} style={{ width: 40, height: 40, borderRadius: 10, background: c, border: "3px solid #fff" }} />)}
      </div>
    </>
  );
};

// 7 — reports, analysis, audit logs
const S7: React.FC = () => (
  <>
    <Tile x={180} y={290} d={IC.chart} at={t(28.79)} label="Reportes" size={170} />
    <Tile x={490} y={290} d={IC.pie} at={t(29.69)} label="Análisis" size={170} phase={1} />
    <Tile x={800} y={290} d={IC.list} at={t(31.69)} label="Auditoría" size={170} phase={2} />
  </>
);

// 8 — your ally
const S8: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 36 }}>
      <Img src={staticFile("cfdimanager/logo-white.png")} style={{ width: 620, transform: `scale(${bounce(f, t(32.8))})` }} />
      <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 40, color: DEEP, background: CYAN, borderRadius: 18, padding: "16px 34px", transform: `scale(${bounce(f, t(33.69))})` }}>Tu aliado en facturación</span>
    </div>
  );
};

const SCENES: { from: number; to: number; C: React.FC }[] = [
  { from: 0.1, to: 4.55, C: S1 },
  { from: 4.55, to: 8.15, C: S2 },
  { from: 8.15, to: 13.32, C: S3 },
  { from: 13.32, to: 19.65, C: S4 },
  { from: 19.65, to: 22.68, C: S5 },
  { from: 22.68, to: 28.48, C: S6 },
  { from: 28.48, to: 32.72, C: S7 },
  { from: 32.72, to: 37, C: S8 },
];

const Stage: React.FC = () => {
  const f = useCurrentFrame();
  const enter = spring({ frame: f, fps: 30, config: { damping: 200 }, durationInFrames: 14 });
  return (
    <div style={{ position: "absolute", left: 50, top: 150, width: 980, height: 730, borderRadius: 40, overflow: "hidden", background: `linear-gradient(160deg, ${NAVY} 0%, ${DEEP} 100%)`, boxShadow: "0 30px 70px rgba(0,0,0,.4)", opacity: enter, transform: `translateY(${(1 - enter) * -40}px)` }}>
      {/* cyan corner glow and the folded-corner shape from the logo */}
      <div style={{ position: "absolute", right: -160, top: -160, width: 420, height: 420, borderRadius: "50%", background: CYAN, opacity: 0.18, filter: "blur(60px)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 10, background: CYAN }} />
      {SCENES.map(({ from, to, C }) => {
        const a = t(from);
        const b = t(to);
        if (f < a || f >= b) return null;
        const o = interpolate(f, [a, a + 6, b - 6, b], [0, 1, 1, 0], clamp);
        return (
          <div key={from} style={{ position: "absolute", inset: 0, opacity: o }}>
            <C />
          </div>
        );
      })}
    </div>
  );
};

/* ---------- composition ---------- */
export const CfdiManagerVideo: React.FC = () => {
  const [handle] = useState(() => delayRender("Loading fonts"));
  useEffect(() => {
    fontsLoaded.then(() => continueRender(handle));
  }, [handle]);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Reframed />
      <Audio src={staticFile("music/cfdimanager.wav")} volume={0.035} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 36, display: "flex", justifyContent: "center" }}>
        <div style={{ background: "rgba(255,255,255,.96)", borderRadius: 999, padding: "12px 30px", boxShadow: "0 10px 26px rgba(0,0,0,.2)" }}>
          <Img src={staticFile("cfdimanager/logo.png")} style={{ height: 70, display: "block" }} />
        </div>
      </div>
      <Stage />
      <Subtitles />
    </AbsoluteFill>
  );
};
