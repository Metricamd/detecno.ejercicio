// doc2sign Flow — flujos de solicitud de datos y documentos que terminan en firma.
// Same brand line as the first
// doc2sign edit (electric blue #2A1CE3, navy #17156C, lilac accents, white
// cards, Poppins, logo without ®) on the newer layout: clip at 1.2× with the
// silences cut (public/doc2sign7/video.mp4), reframed with jump-cut zooms,
// visual diagrams on a blue stage at the top and subtitles at the bottom.
import React, { useEffect, useState } from "react";
import { AbsoluteFill, Audio, continueRender, delayRender, Easing, Img, interpolate, OffthreadVideo, spring, staticFile, useCurrentFrame } from "remotion";
import { FONT, fontsLoaded } from "../fispal/theme";

export const DOC2SIGN7_DURATION = 872; // 29.07 s at 30 fps
const BLUE = "#2A1CE3";
const NAVY = "#17156C";
const LILAC = "#B8B2FF";
const RED = "#F0506E";
const GREEN = "#12B886";

const t = (sec: number) => Math.round(sec * 30);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const bounce = (f: number, at: number) => spring({ frame: f - at, fps: 30, config: { damping: 11, stiffness: 150 } });

/* ---------- reframing with jump-cut zooms on the silence cuts ---------- */
const FACE = { x: 560, y: 920 };
const TARGET = { x: 540, y: 1150 };
const CUTS = [0, 1.633, 3.048, 9.59, 12.792, 15.011, 17.721, 22.966, 25.288, 27.253];

const Reframed: React.FC = () => {
  const f = useCurrentFrame();
  const sec = f / 30;
  let k = 0;
  while (k + 1 < CUTS.length && sec >= CUTS[k + 1]) k++;
  const s = (k % 2 ? 1.42 : 1.3) + Math.min(sec - CUTS[k], 6) * 0.006;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ transformOrigin: `${FACE.x}px ${FACE.y}px`, transform: `translate(${TARGET.x - FACE.x}px, ${TARGET.y - FACE.y}px) scale(${s})` }}>
        <OffthreadVideo src={staticFile("doc2sign7/video.mp4")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------- subtitles (bottom) ---------- */
type W = [string, number];
const PAGES: { words: W[]; end: number }[] = [
  { words: [["¿Tienes", 0.22], ["hoy", 0.64], ["día", 0.82], ["procesos", 1.18], ["donde", 2.02], ["pides", 2.44]], end: 3.25 },
  { words: [["a", 3.32], ["algún", 3.84], ["*candidato", 4.2], ["que", 4.58], ["estás", 4.72], ["contratando", 5.04], ["o", 5.66], ["algún", 5.96], ["*proveedor", 6.2], ["que", 6.98], ["estás", 7.16], ["contratando", 7.54]], end: 8.3 },
  { words: [["y", 8.36], ["le", 8.5], ["pides", 8.7], ["*datos", 9.24], ["que", 9.8], ["más", 10], ["adelante", 10.34], ["se", 10.6], ["van", 10.72], ["a", 10.82], ["*vaciar", 11], ["en", 11.46], ["uno", 11.68], ["o", 11.84], ["varios", 12.06], ["*documentos?", 12.34]], end: 11.902 },
  { words: [["Te", 12.85], ["invito", 12.98], ["a", 13.11], ["conocer", 13.45], ["*doc2sign", 13.97], ["*Flow,", 14.25]], end: 15.2 },
  { words: [["donde", 15.252], ["puedes", 15.512], ["crear", 15.792], ["*flujos", 16.172], ["de", 16.492], ["solicitud", 16.672], ["de", 16.972], ["*documentos,", 17.192]], end: 17.952 },
  { words: [["*flujos", 18.012], ["de", 18.292], ["solicitudes", 18.492], ["de", 18.872], ["*datos,", 19.152]], end: 19.732 },
  { words: [["así", 19.792], ["como", 20.052], ["*definir", 20.452], ["en", 20.812], ["dónde", 21.052], ["caen", 21.352], ["estos", 21.632], ["datos", 21.912], ["en", 22.112], ["tus", 22.212], ["*documentos", 22.512]], end: 23.192 },
  { words: [["para", 23.252], ["que", 23.372], ["*automáticamente", 23.572], ["se", 24.232], ["gestione", 24.392], ["la", 24.712], ["*firma", 24.892]], end: 25.612 },
  { words: [["con", 25.672], ["o", 25.952], ["sin", 26.132], ["una", 26.292], ["*autorización", 26.412], ["*previa.", 26.912]], end: 27.372 },
  { words: [["Te", 27.432], ["invito", 27.572], ["a", 27.772], ["conocer", 27.992], ["*doc2sign", 28.332], ["*Flow.", 28.652]], end: 29.072 },
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
  bolt: "M13 2L4 14h7l-1 8 9-12h-7z",
  send: "M4 12l16-8-6 16-3-7z",
  upload: "M12 16V5M7 10l5-5 5 5M5 20h14",
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

/* ---------- scenes (980×730 stage) ---------- */
const FIELDS = ["Nombre", "RFC", "Domicilio"];

// 1 — you ask candidates and suppliers for data
const S1: React.FC = () => (
  <>
    <Tile x={300} y={300} d={IC.user} at={t(4.2)} label="Candidato" size={190} />
    <Tile x={680} y={300} d={IC.building} at={t(6.2)} label="Proveedor" size={190} phase={1} />
  </>
);

// 2 — the data ends up in one or more documents
const S2: React.FC = () => {
  const f = useCurrentFrame();
  const flow = interpolate(f, [t(11), t(11.6)], [0, 1], clamp);
  return (
    <>
      <div style={{ position: "absolute", left: 70, top: 130, width: 380, borderRadius: 26, background: "#fff", boxShadow: "0 24px 50px rgba(10,6,90,.4)", padding: "26px 28px", transform: `scale(${bounce(f, t(8.5))})`, fontFamily: FONT }}>
        <div style={{ fontWeight: 800, fontSize: 30, color: NAVY, marginBottom: 14 }}>Datos</div>
        {FIELDS.map((l, k) => (
          <div key={l} style={{ marginTop: 12 }}>
            <div style={{ fontWeight: 600, fontSize: 20, color: "#6B6F9A" }}>{l}</div>
            <div style={{ height: 36, borderRadius: 10, background: "#EEEDFB", marginTop: 6, overflow: "hidden" }}>
              <div style={{ width: `${interpolate(f, [t(9.24) + k * 6, t(9.24) + k * 6 + 10], [0, 70 + k * 8], clamp)}%`, height: "100%", background: LILAC }} />
            </div>
          </div>
        ))}
      </div>
      <svg width={980} height={730} style={{ position: "absolute", left: 0, top: 0 }}>
        <path d="M470 330 L600 330 M575 305 L602 330 L575 355" stroke="#fff" strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={flow} />
      </svg>
      {[0, 1].map((k) => (
        <div key={k} style={{ position: "absolute", left: 625 + k * 50, top: 150 + k * 60, width: 230, height: 300, borderRadius: 22, background: "#fff", boxShadow: "0 20px 40px rgba(10,6,90,.35)", padding: 22, boxSizing: "border-box", transform: `scale(${bounce(f, t(12.06) + k * 5)})`, opacity: f >= t(12.06) + k * 5 ? 1 : 0 }}>
          <Icon d={IC.doc} size={44} color={BLUE} />
          {[0, 1, 2].map((r) => <div key={r} style={{ height: 12, borderRadius: 6, background: r === 1 ? LILAC : "#E6E5F5", marginTop: 18, width: `${88 - r * 14}%` }} />)}
        </div>
      ))}
    </>
  );
};

// 3 — doc2sign Flow
const S3: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 30 }}>
      <Img src={staticFile("doc2sign/logo-white.png")} style={{ width: 560, transform: `scale(${bounce(f, t(12.9))})` }} />
      <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 96, color: BLUE, background: "#fff", borderRadius: 26, padding: "2px 46px", transform: `scale(${bounce(f, t(14.252))})`, opacity: f >= t(14.252) ? 1 : 0 }}>Flow</span>
    </div>
  );
};

// a small flow: node → node → node joined by arrows
const FlowRow: React.FC<{ y: number; at: number; nodes: { d: string; l: string }[] }> = ({ y, at, nodes }) => {
  const f = useCurrentFrame();
  const xs = [180, 490, 800];
  return (
    <>
      {nodes.map((n, k) => (
        <React.Fragment key={n.l}>
          {k > 0 && (
            <svg width={980} height={730} style={{ position: "absolute", left: 0, top: 0 }}>
              <path d={`M${xs[k - 1] + 80} ${y} L${xs[k] - 80} ${y}`} stroke="#fff" strokeWidth={6} strokeDasharray="4 12" strokeLinecap="round" opacity={interpolate(f, [at + k * 6, at + k * 6 + 6], [0, 1], clamp)} />
            </svg>
          )}
          <Tile x={xs[k]} y={y} d={n.d} at={at + k * 6} label={n.l} size={120} phase={k} />
        </React.Fragment>
      ))}
    </>
  );
};

// 4 — request flows for documents and for data
const S4: React.FC = () => (
  <>
    <FlowRow y={170} at={t(16.172)} nodes={[{ d: IC.send, l: "Solicitud" }, { d: IC.upload, l: "Documentos" }, { d: IC.check, l: "Recibido" }]} />
    <FlowRow y={480} at={t(18.012)} nodes={[{ d: IC.send, l: "Solicitud" }, { d: IC.list, l: "Datos" }, { d: IC.check, l: "Recibido" }]} />
  </>
);

// 5 — map where each field lands in the document
const S5: React.FC = () => {
  const f = useCurrentFrame();
  const ys = [190, 330, 470];
  return (
    <>
      {FIELDS.map((l, k) => (
        <div key={l} style={{ position: "absolute", left: 80, top: ys[k] - 34, width: 270, height: 68, borderRadius: 16, background: LILAC, display: "flex", alignItems: "center", paddingLeft: 22, fontFamily: FONT, fontWeight: 700, fontSize: 28, color: NAVY, transform: `scale(${bounce(f, t(19.952) + k * 4)})` }}>{l}</div>
      ))}
      <div style={{ position: "absolute", left: 600, top: 90, width: 300, height: 540, borderRadius: 26, background: "#fff", boxShadow: "0 24px 50px rgba(10,6,90,.4)", transform: `scale(${bounce(f, t(20.152))})` }}>
        <div style={{ position: "absolute", left: 30, top: 26 }}><Icon d={IC.doc} size={48} color={BLUE} /></div>
        {ys.map((y, k) => (
          <div key={k} style={{ position: "absolute", left: 30, right: 30, top: y - 90 - 20, height: 40, borderRadius: 10, border: `3px dashed ${BLUE}`, background: f >= t(21.352) + k * 6 ? "#E9E7FF" : "transparent" }} />
        ))}
      </div>
      <svg width={980} height={730} style={{ position: "absolute", left: 0, top: 0 }}>
        {ys.map((y, k) => {
          const p = interpolate(f, [t(21.352) + k * 6 - 6, t(21.352) + k * 6], [0, 1], clamp);
          return <path key={k} d={`M350 ${y} C 470 ${y}, 500 ${y}, ${350 + 280 * p} ${y}`} stroke="#fff" strokeWidth={5} fill="none" strokeLinecap="round" opacity={p > 0.02 ? 1 : 0} />;
        })}
      </svg>
    </>
  );
};

// 6 — signature handled automatically, with or without prior approval
const S6: React.FC = () => {
  const f = useCurrentFrame();
  const on = f >= t(25.672) && f < t(26.132);
  return (
    <>
      <Tile x={180} y={260} d={IC.doc} at={t(23.352)} label="Documento" size={150} />
      <svg width={980} height={730} style={{ position: "absolute", left: 0, top: 0 }}>
        <path d="M270 260 L410 260 M570 260 L710 260" stroke="#fff" strokeWidth={6} strokeLinecap="round" opacity={interpolate(f, [t(23.572), t(23.852)], [0, 1], clamp)} />
      </svg>
      <div style={{ position: "absolute", left: 490 - 75, top: 260 - 75, width: 150, height: 150, borderRadius: 40, border: "4px dashed #fff", display: "flex", alignItems: "center", justifyContent: "center", opacity: on || f >= t(26.412) ? 1 : 0.35 }}>
        <Icon d={IC.shield} size={70} color="#fff" sw={2} />
      </div>
      <span style={{ position: "absolute", left: 360, width: 260, top: 350, textAlign: "center", fontFamily: FONT, fontWeight: 700, fontSize: 24, color: "#fff" }}>Autorización (opcional)</span>
      <Tile x={800} y={260} d={IC.pen} at={t(24.892)} label="Firma" size={150} phase={1} />
      <Dot x={860} y={195} at={t(25.152)} size={50} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 520, display: "flex", justifyContent: "center", gap: 18 }}>
        {[["Con autorización", t(25.672)], ["Sin autorización", t(26.132)]].map(([l, at]) => (
          <span key={l as string} style={{ fontFamily: FONT, fontWeight: 700, fontSize: 30, color: NAVY, background: LILAC, borderRadius: 14, padding: "8px 22px", transform: `scale(${bounce(f, at as number)})`, opacity: f >= (at as number) ? 1 : 0 }}>{l}</span>
        ))}
      </div>
    </>
  );
};

// 7 — close
const S7: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 30 }}>
      <Img src={staticFile("doc2sign/logo-white.png")} style={{ width: 520, transform: `scale(${bounce(f, t(27.552))})` }} />
      <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 90, color: BLUE, background: "#fff", borderRadius: 26, padding: "2px 46px", transform: `scale(${bounce(f, t(28.332))})` }}>Flow</span>
    </div>
  );
};

const SCENES: { from: number; to: number; C: React.FC }[] = [
  { from: 0.1, to: 8.32, C: S1 },
  { from: 8.32, to: 12.8, C: S2 },
  { from: 12.8, to: 15.222, C: S3 },
  { from: 15.222, to: 19.752, C: S4 },
  { from: 19.752, to: 23.212, C: S5 },
  { from: 23.212, to: 27.392, C: S6 },
  { from: 27.392, to: 29.952, C: S7 },
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
export const Doc2Sign7Video: React.FC = () => {
  const [handle] = useState(() => delayRender("Loading fonts"));
  useEffect(() => {
    fontsLoaded.then(() => continueRender(handle));
  }, [handle]);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Reframed />
      <Audio src={staticFile("music/doc2sign7.wav")} volume={0.07} />
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
