// doc2sign CLM — "Más allá de la firma digital…".
// Same brand line as the first
// doc2sign edit (electric blue #2A1CE3, navy #17156C, lilac accents, white
// cards, Poppins, logo without ®) on the newer layout: clip at 1.2× with the
// silences cut (public/doc2sign5/video.mp4), reframed with jump-cut zooms,
// visual diagrams on a blue stage at the top and subtitles at the bottom.
import React, { useEffect, useState } from "react";
import { AbsoluteFill, Audio, continueRender, delayRender, Easing, Img, interpolate, OffthreadVideo, spring, staticFile, useCurrentFrame } from "remotion";
import { FONT, fontsLoaded } from "../fispal/theme";

export const DOC2SIGN5_DURATION = 853; // 28.45 s at 30 fps
const BLUE = "#2A1CE3";
const NAVY = "#17156C";
const LILAC = "#B8B2FF";
const RED = "#F0506E";
const GREEN = "#12B886";

const t = (sec: number) => Math.round(sec * 30);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const bounce = (f: number, at: number) => spring({ frame: f - at, fps: 30, config: { damping: 11, stiffness: 150 } });

/* ---------- reframing with jump-cut zooms on the silence cuts ---------- */
const FACE = { x: 520, y: 840 };
const TARGET = { x: 540, y: 1080 };
const CUTS = [0, 7.614, 17.369, 21.16, 23.277];

const Reframed: React.FC = () => {
  const f = useCurrentFrame();
  const sec = f / 30;
  let k = 0;
  while (k + 1 < CUTS.length && sec >= CUTS[k + 1]) k++;
  const s = (k % 2 ? 1.42 : 1.3) + Math.min(sec - CUTS[k], 6) * 0.006;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ transformOrigin: `${FACE.x}px ${FACE.y}px`, transform: `translate(${TARGET.x - FACE.x}px, ${TARGET.y - FACE.y}px) scale(${s})` }}>
        <OffthreadVideo src={staticFile("doc2sign5/video.mp4")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------- subtitles (bottom) ---------- */
type W = [string, number];
const PAGES: { words: W[]; end: number }[] = [
  { words: [["Más", 0.58], ["allá", 0.86], ["de", 1.02], ["la", 1.14], ["*firma", 1.32], ["*digital", 1.84], ["de", 1.98], ["documentos", 2.26]], end: 3.2 },
  { words: [["que", 3.26], ["hacemos", 3.62], ["como", 3.94], ["un", 4.1], ["*PSC", 4.32], ["*autorizado", 4.74], ["por", 5.12], ["*Economía", 5.32]], end: 5.92 },
  { words: [["con", 5.98], ["nuestro", 6.12], ["producto", 6.5], ["*doc2sign,", 6.86]], end: 7.76 },
  { words: [["te", 7.82], ["invitamos", 7.98], ["a", 8.34], ["conocer", 8.66], ["nuestro", 9.08], ["*CLM,", 9.68]], end: 10.4 },
  { words: [["donde", 10.46], ["podrás", 10.84], ["gestionar", 11.24], ["*versiones", 12.56], ["*de", 12.82], ["*contratos,", 13.06], ["*cláusulas,", 13.96]], end: 15.08 },
  { words: [["*avisos", 15.14], ["de", 16.24], ["temas", 16.46], ["*faltantes", 16.76]], end: 17.78 },
  { words: [["con", 17.84], ["base", 17.96], ["en", 18.08], ["las", 18.16], ["*mejores", 18.38], ["*prácticas,", 18.62]], end: 19.84 },
  { words: [["*recomendaciones", 19.9], ["de", 20.5], ["la", 20.62], ["*IA,", 20.74]], end: 21.52 },
  { words: [["*recordatorios", 21.58], ["ante", 22.32], ["*vencimientos.", 22.46]], end: 23.42 },
  { words: [["¿Qué", 23.48], ["esperas", 23.7], ["para", 23.96], ["conocer", 24.22], ["*doc2sign", 24.56], ["*CLM", 25.3]], end: 25.92 },
  { words: [["y", 25.98], ["*transformar", 26.36], ["por", 26.7], ["completo", 27.14], ["tu", 27.64], ["*proceso", 27.88], ["*jurídico?", 28.08]], end: 28.45 },
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
      <div style={{ background: "rgba(23,21,108,.88)", borderRadius: 22, padding: "16px 30px", maxWidth: 940, textAlign: "center", fontFamily: FONT, fontWeight: 500, fontSize: 40, lineHeight: 1.3, color: "#fff", boxShadow: "0 12px 30px rgba(10,8,60,.25)" }}>
        {page.words.map(([w, at], i) => {
          const key = w.startsWith("*");
          const on = sec >= at - 0.05;
          return (
            <React.Fragment key={i}>
              {i ? " " : ""}
              <span style={{ color: key ? LILAC : "#fff", fontWeight: key ? 600 : 500, opacity: on ? 1 : 0.45 }}>{key ? w.slice(1) : w}</span>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

/* ---------- stage building blocks ---------- */
const Icon: React.FC<{ d: string; size?: number; color?: string; sw?: number }> = ({ d, size = 34, color = BLUE, sw = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
    <path d={d} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IC = {
  scale: "M12 3v18M5 7h14M5 7l-3 6a3 3 0 0 0 6 0zM19 7l-3 6a3 3 0 0 0 6 0zM8 21h8",
  laptop: "M5 5h14v10H5zM2 19h20",
  doc: "M7 3h7l5 5v13H7zM14 3v5h5M10 12h6M10 16h6",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c0-4.4 3.6-8 8-8s8 3.6 8 8",
  truck: "M3 7h11v9H3zM14 10h4l3 3v3h-7M7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM17 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  archive: "M3 4h18v4H3zM5 8v12h14V8M10 12h4",
  hand: "M8 13V5a2 2 0 0 1 4 0v6M12 11V4a2 2 0 0 1 4 0v7M16 11V6a2 2 0 0 1 4 0v8a7 7 0 0 1-7 7h-1a7 7 0 0 1-6-3l-3-5a2 2 0 0 1 3-2l2 2",
  check: "M5 12.5l4.5 4.5L19 7.5",
  search: "M10.5 4a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM15.5 15.5L20 20",
  shield: "M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6zM8.5 12l2.5 2.5 4.5-5",
  cash: "M3 7h18v10H3zM12 9.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM6 12h.01M18 12h.01",
  book: "M4 4h11a3 3 0 0 1 3 3v13H7a3 3 0 0 1-3-3zM18 20H7a3 3 0 0 1 0-6h11",
  pen: "M4 20l4-1 10-10-3-3L5 16zM14 7l3 3",
  key: "M15 7a4 4 0 1 0-3.5 6L4 20.5V23h3v-2h2v-2h2l1.5-1.5A4 4 0 0 0 15 7zM16 7h.01",
  cert: "M4 4h16v12H4zM8 8h8M8 11h5M15 16l-1 6 3-2 3 2-1-6M17 13a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z",
  printer: "M7 8V3h10v5M5 8h14a2 2 0 0 1 2 2v6h-4v4H7v-4H3v-6a2 2 0 0 1 2-2zM9 16h6",
  building: "M3 21h18M5 21V9l7-5 7 5v12M9 21v-6h6v6M9 11h.01M15 11h.01",
  layers: "M12 3l9 5-9 5-9-5zM3 13l9 5 9-5M3 17l9 5 9-5",
  list: "M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01",
  bell: "M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 20a2 2 0 0 0 4 0",
  star: "M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3 6.4 20.2l1.1-6.2L3 9.6l6.2-.9z",
  spark: "M12 3v4M12 17v4M3 12h4M17 12h4M12 8l1.5 2.5L16 12l-2.5 1.5L12 16l-1.5-2.5L8 12l2.5-1.5z",
  calendar: "M4 6h16v14H4zM4 10h16M8 3v4M16 3v4",
};

const Tile: React.FC<{ x: number; y: number; size?: number; d: string; at: number; label?: string; color?: string; phase?: number }> = ({ x, y, size = 160, d, at, label, color = BLUE, phase = 0 }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const bob = Math.sin((f - at) / 14 + phase) * 6;
  return (
    <div style={{ position: "absolute", left: x - size / 2, top: y - size / 2 + bob, width: size, transform: `scale(${bounce(f, at)})`, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <div style={{ width: size, height: size, borderRadius: size * 0.26, background: "#fff", boxShadow: "0 22px 44px rgba(10,6,90,.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon d={d} size={size * 0.5} color={color} sw={2} />
      </div>
      {label && <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 30, color: "#fff", whiteSpace: "nowrap" }}>{label}</span>}
    </div>
  );
};

const Dot: React.FC<{ x: number; y: number; at: number; ok?: boolean; size?: number; text?: string }> = ({ x, y, at, ok = true, size = 54, text }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  return (
    <div style={{ position: "absolute", left: x - size / 2, top: y - size / 2, width: size, height: size, borderRadius: size / 2, background: ok ? GREEN : RED, border: "4px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${bounce(f, at)})`, fontFamily: FONT, fontWeight: 800, fontSize: size * 0.5, color: "#fff" }}>
      {text ?? <Icon d={IC.check} size={size * 0.55} color="#fff" sw={3.4} />}
    </div>
  );
};

// hand-drawn signature revealed with stroke-dashoffset
const Signature: React.FC<{ at: number; x: number; y: number; width?: number; color?: string }> = ({ at, x, y, width = 360, color = NAVY }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [at, at + 22], [1, 0], clamp);
  return (
    <svg width={width} height={width * 0.3} viewBox="0 0 200 60" style={{ position: "absolute", left: x, top: y }}>
      <path d="M6 44c10-30 22-34 20-12-1 14-8 18-6 4 3-18 18-26 22-10 2 10-4 14-2 4 3-12 14-12 16 0 1 8 6 8 12-2 5-9 10-10 12 0 2 8 8 6 14-2 6-8 14-8 18 2 3 7 10 6 18-2 8-7 16-6 26-4" fill="none" stroke={color} strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={p} />
    </svg>
  );
};

/* ---------- scenes (980×730 stage) ---------- */
// 1 — beyond the digital signature we already do as an authorised PSC
const S1: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      <div style={{ position: "absolute", left: 120, top: 90, width: 400, height: 520, borderRadius: 28, background: "#fff", boxShadow: "0 24px 50px rgba(10,6,90,.4)", transform: `scale(${bounce(f, t(0.5))})`, padding: 34, boxSizing: "border-box" }}>
        <Icon d={IC.doc} size={58} color={BLUE} />
        {[0, 1, 2].map((k) => <div key={k} style={{ height: 13, borderRadius: 7, background: "#E6E5F5", marginTop: 24, width: `${90 - k * 14}%` }} />)}
        <div style={{ position: "absolute", left: 34, right: 34, bottom: 60, height: 3, background: BLUE, opacity: 0.4 }} />
      </div>
      <Signature at={t(1.32)} x={150} y={420} width={300} color={BLUE} />
      <Tile x={740} y={250} d={IC.shield} at={t(4.32)} size={190} />
      <div style={{ position: "absolute", left: 560, width: 360, top: 400, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 38, lineHeight: 1.15, color: "#fff", transform: `scale(${bounce(f, t(4.74))})`, opacity: f >= t(4.74) ? 1 : 0 }}>
        PSC autorizado
        <br />
        <span style={{ color: LILAC, fontWeight: 700, fontSize: 30 }}>por Economía</span>
      </div>
    </>
  );
};

// 2 — doc2sign CLM
const S2: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 30 }}>
      <Img src={staticFile("doc2sign/logo-white.png")} style={{ width: 560, transform: `scale(${bounce(f, t(7.8))})` }} />
      <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 96, color: BLUE, background: "#fff", borderRadius: 26, padding: "4px 44px", letterSpacing: "0.04em", transform: `scale(${bounce(f, t(9.68))})`, opacity: f >= t(9.68) ? 1 : 0 }}>CLM</span>
    </div>
  );
};

// 3 — versions, clauses, missing-topic alerts
const S3: React.FC = () => {
  const f = useCurrentFrame();
  const items = [
    { x: 170, d: IC.layers, l: "Versiones", at: t(12.56) },
    { x: 490, d: IC.list, l: "Cláusulas", at: t(13.96) },
    { x: 810, d: IC.bell, l: "Avisos", at: t(15.14) },
  ];
  return (
    <>
      {items.map((i, k) => <Tile key={i.l} x={i.x} y={280} d={i.d} at={i.at} label={i.l} size={170} phase={k} />)}
      <div style={{ position: "absolute", left: 0, right: 0, top: 520, display: "flex", justifyContent: "center", transform: `scale(${bounce(f, t(16.76))})`, opacity: f >= t(16.76) ? 1 : 0 }}>
        <span style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: FONT, fontWeight: 700, fontSize: 32, color: NAVY, background: "#fff", borderRadius: 999, padding: "12px 26px" }}>
          <span style={{ width: 34, height: 34, borderRadius: 17, background: RED, color: "#fff", fontWeight: 800, fontSize: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>!</span>
          Falta una cláusula
        </span>
      </div>
    </>
  );
};

// 4 — best practices and AI recommendations
const S4: React.FC = () => (
  <>
    <Tile x={290} y={300} d={IC.star} at={t(18.38)} label="Mejores prácticas" size={190} />
    <Tile x={690} y={300} d={IC.spark} at={t(19.9)} label="Recomendaciones IA" size={190} phase={1} />
  </>
);

// 5 — expiry reminders
const S5: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      <Tile x={490} y={260} d={IC.calendar} at={t(21.6)} size={220} label="Recordatorios" />
      <Dot x={580} y={170} at={t(22.0)} ok={false} text="!" size={64} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 560, display: "flex", justifyContent: "center", transform: `scale(${bounce(f, t(22.46))})`, opacity: f >= t(22.46) ? 1 : 0 }}>
        <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, color: NAVY, background: LILAC, borderRadius: 14, padding: "8px 26px" }}>Contrato por vencer</span>
      </div>
    </>
  );
};

// 6 — close
const S6: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 22, transform: `scale(${bounce(f, t(24.56))})` }}>
        <Img src={staticFile("doc2sign/logo-white.png")} style={{ width: 460 }} />
        <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 72, color: BLUE, background: "#fff", borderRadius: 22, padding: "0 30px" }}>CLM</span>
      </div>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 52, color: "#fff", textAlign: "center", lineHeight: 1.1, transform: `scale(${bounce(f, t(26.36))})`, opacity: f >= t(26.36) ? 1 : 0 }}>
        Transforma tu
        <br />
        proceso jurídico
      </div>
    </div>
  );
};

const SCENES: { from: number; to: number; C: React.FC }[] = [
  { from: 0.1, to: 7.72, C: S1 },
  { from: 7.72, to: 10.42, C: S2 },
  { from: 10.42, to: 17.8, C: S3 },
  { from: 17.8, to: 21.54, C: S4 },
  { from: 21.54, to: 23.44, C: S5 },
  { from: 23.44, to: 30, C: S6 },
];

const Stage: React.FC = () => {
  const f = useCurrentFrame();
  const enter = spring({ frame: f, fps: 30, config: { damping: 200 }, durationInFrames: 14 });
  return (
    <div style={{ position: "absolute", left: 50, top: 150, width: 980, height: 730, borderRadius: 48, overflow: "hidden", background: `linear-gradient(155deg, #4636F0 0%, ${BLUE} 50%, #1B10B8 100%)`, boxShadow: "0 30px 70px rgba(10,6,90,.4)", opacity: enter, transform: `translateY(${(1 - enter) * -40}px)` }}>
      {/* the rounded blob shapes of the doc2sign layouts */}
      <div style={{ position: "absolute", right: -120, top: -140, width: 420, height: 420, borderRadius: 140, background: "rgba(255,255,255,.08)", transform: "rotate(18deg)" }} />
      <div style={{ position: "absolute", left: -140, bottom: -160, width: 420, height: 420, borderRadius: 140, background: "rgba(255,255,255,.06)", transform: "rotate(-12deg)" }} />
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
export const Doc2Sign5Video: React.FC = () => {
  const [handle] = useState(() => delayRender("Loading fonts"));
  useEffect(() => {
    fontsLoaded.then(() => continueRender(handle));
  }, [handle]);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Reframed />
      <Audio src={staticFile("music/doc2sign5.wav")} volume={0.07} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 40, display: "flex", justifyContent: "center" }}>
        <div style={{ background: "rgba(255,255,255,.96)", borderRadius: 999, padding: "14px 32px", boxShadow: "0 10px 26px rgba(10,8,60,.2)" }}>
          <Img src={staticFile("doc2sign/logo-blue.png")} style={{ height: 52, display: "block" }} />
        </div>
      </div>
      <Stage />
      <Subtitles />
    </AbsoluteFill>
  );
};
