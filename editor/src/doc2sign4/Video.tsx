// doc2sign #4 — "Llevas el liderazgo de transformación digital…".
// Same brand line as the first
// doc2sign edit (electric blue #2A1CE3, navy #17156C, lilac accents, white
// cards, Poppins, logo without ®) on the newer layout: clip at 1.2× with the
// silences cut (public/doc2sign4/video.mp4), reframed with jump-cut zooms,
// visual diagrams on a blue stage at the top and subtitles at the bottom.
import React, { useEffect, useState } from "react";
import { AbsoluteFill, Audio, continueRender, delayRender, Easing, Img, interpolate, OffthreadVideo, spring, staticFile, useCurrentFrame } from "remotion";
import { FONT, fontsLoaded } from "../fispal/theme";

export const DOC2SIGN4_DURATION = 1310; // 43.66 s at 30 fps
const BLUE = "#2A1CE3";
const NAVY = "#17156C";
const LILAC = "#B8B2FF";
const RED = "#F0506E";
const GREEN = "#12B886";

const t = (sec: number) => Math.round(sec * 30);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const bounce = (f: number, at: number) => spring({ frame: f - at, fps: 30, config: { damping: 11, stiffness: 150 } });

/* ---------- reframing with jump-cut zooms on the silence cuts ---------- */
const FACE = { x: 540, y: 920 };
const TARGET = { x: 540, y: 1180 };
const CUTS = [0, 1.64, 7.788, 9.597, 14.571, 17.152, 20.807, 21.981, 25.439, 28.538];

const Reframed: React.FC = () => {
  const f = useCurrentFrame();
  const sec = f / 30;
  let k = 0;
  while (k + 1 < CUTS.length && sec >= CUTS[k + 1]) k++;
  const s = (k % 2 ? 1.42 : 1.3) + Math.min(sec - CUTS[k], 6) * 0.006;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ transformOrigin: `${FACE.x}px ${FACE.y}px`, transform: `translate(${TARGET.x - FACE.x}px, ${TARGET.y - FACE.y}px) scale(${s})` }}>
        <OffthreadVideo src={staticFile("doc2sign4/video.mp4")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------- subtitles (bottom) ---------- */
type W = [string, number];
const PAGES: { words: W[]; end: number }[] = [
  { words: [["¿Llevas", 0.48], ["el", 0.8], ["*liderazgo", 1.0], ["de", 2.14], ["algún", 2.32], ["departamento", 2.56], ["de", 3.02], ["*transformación", 3.3], ["*digital", 3.92]], end: 4.45 },
  { words: [["y", 4.52], ["has", 4.62], ["ido", 4.86], ["transformando", 5.24], ["muchos", 5.62], ["*procesos,", 5.96]], end: 6.8 },
  { words: [["pero", 6.88], ["el", 7.06], ["*legal", 7.3], ["se", 8.06], ["ha", 8.16], ["quedado", 8.3], ["*sin", 8.66], ["*mucha", 8.84], ["*evolución?", 9.02]], end: 9.8 },
  { words: [["Te", 9.88], ["invito", 10.02], ["a", 10.28], ["crear", 10.38], ["una", 10.56], ["*cuenta", 10.76], ["*gratis", 11.1], ["en", 11.4], ["*doc2sign.com,", 11.6]], end: 13.12 },
  { words: [["doc,", 13.2], ["el", 13.44], ["número", 13.62], ["*2,", 13.92], ["sign,", 14.28]], end: 14.98 },
  { words: [["donde", 15.04], ["podrás", 15.34], ["llevar", 15.6], ["a", 15.74], ["la", 15.82], ["organización", 16.02], ["a", 16.48], ["*firmar", 16.64]], end: 17.48 },
  { words: [["cualquier", 17.54], ["*documento", 18.04], ["*digital", 18.58], ["con", 18.8], ["*validez", 18.96], ["*legal:", 19.28]], end: 19.76 },
  { words: [["temas", 19.82], ["*mercantiles,", 20.16], ["temas", 21.06], ["*laborales,", 21.32], ["temas", 22.24], ["*corporativos,", 22.5]], end: 24.5 },
  { words: [["temas", 24.6], ["*civiles.", 25.0]], end: 25.64 },
  { words: [["Podrás", 25.7], ["*digitalizar", 26.12], ["muchos", 26.78], ["procesos", 27.16], ["que", 27.5], ["hoy", 27.62], ["día", 27.82], ["acaban", 28.08], ["*impresos,", 29.58]], end: 29.98 },
  { words: [["documentos", 30.04], ["en", 30.42], ["*físico,", 30.58], ["pagando", 31.26], ["*mensajerías.", 31.58]], end: 32.86 },
  { words: [["¿Qué", 32.94], ["esperas", 33.14], ["para", 33.42], ["sumarte", 33.58], ["a", 34.12], ["*doc2sign?", 34.26]], end: 35.05 },
  { words: [["La", 35.12], ["plataforma", 35.52], ["que", 35.82], ["tiene", 36.08], ["el", 36.26], ["*respaldo", 36.44], ["como", 37.32], ["*prestador", 37.54], ["*de", 37.92], ["*servicios", 38.08], ["*de", 38.18], ["*certificación,", 38.32]], end: 39.33 },
  { words: [["para", 39.4], ["que", 39.54], ["no", 39.66], ["nada", 39.8], ["más", 39.98], ["sea", 40.08], ["una", 40.18], ["*firma", 40.3], ["*bonita,", 40.56]], end: 41.14 },
  { words: [["sino", 41.2], ["que", 41.36], ["en", 41.46], ["un", 41.54], ["*juicio", 41.68], ["tu", 42.48], ["equipo", 42.62], ["la", 42.8], ["pueda", 42.92], ["*defender.", 43.2]], end: 43.66 },
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
  gavel: "M14 4l6 6M11 7l6 6M12.5 5.5l-5 5 4 4 5-5M9.5 12.5L3 19l2 2 6.5-6.5M14 21h7",
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
// 1 — many processes already digital, legal left behind
const S1: React.FC = () => {
  const f = useCurrentFrame();
  const done = [
    { x: 170, y: 200, d: IC.truck, at: t(5.24) },
    { x: 490, y: 200, d: IC.cash, at: t(5.5) },
    { x: 810, y: 200, d: IC.book, at: t(5.75) },
    { x: 170, y: 480, d: IC.user, at: t(5.96) },
    { x: 810, y: 480, d: IC.laptop, at: t(6.1) },
  ];
  const legal = f >= t(7.3);
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 40, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 44, color: "#fff", transform: `scale(${bounce(f, t(3.3))})`, opacity: f >= t(3.3) ? 1 : 0 }}>Transformación digital</div>
      {done.map((d, k) => (
        <React.Fragment key={k}>
          <Tile x={d.x} y={d.y + 40} d={d.d} at={d.at} size={140} phase={k} />
          <Dot x={d.x + 56} y={d.y - 18} at={d.at + 6} size={44} />
        </React.Fragment>
      ))}
      {legal && (
        <div style={{ position: "absolute", left: 490 - 85, top: 480 + 40 - 85, width: 170, transform: `scale(${bounce(f, t(7.3))})`, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <div style={{ width: 170, height: 170, borderRadius: 44, background: "rgba(255,255,255,.25)", border: "4px dashed #fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon d={IC.scale} size={84} color="#fff" sw={2} />
          </div>
          <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 32, color: "#fff" }}>Legal</span>
        </div>
      )}
      <Dot x={560} y={455} at={t(8.66)} ok={false} text="!" size={56} />
    </>
  );
};

// 2 — create the free account
const S2: React.FC = () => {
  const f = useCurrentFrame();
  const url = "doc2sign.com";
  const typed = Math.round(interpolate(f, [t(11.55), t(12.25)], [0, url.length], clamp));
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 110, display: "flex", justifyContent: "center", transform: `scale(${bounce(f, t(9.9))})` }}>
        <Img src={staticFile("doc2sign/logo-white.png")} style={{ width: 580 }} />
      </div>
      <div style={{ position: "absolute", left: 150, right: 150, top: 380, display: "flex", alignItems: "center", gap: 14, background: "#fff", borderRadius: 999, padding: "20px 30px", boxShadow: "0 20px 44px rgba(10,6,90,.35)", transform: `scale(${bounce(f, t(11.2))})` }}>
        <Icon d={IC.search} size={40} color={BLUE} sw={2.6} />
        <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 46, color: NAVY }}>
          {url.slice(0, typed)}
          <span style={{ opacity: typed < url.length && f % 20 < 10 ? 1 : 0, color: BLUE }}>|</span>
        </span>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 545, display: "flex", justifyContent: "center", transform: `scale(${bounce(f, t(11.1))})` }}>
        <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: NAVY, background: LILAC, borderRadius: 16, padding: "8px 28px" }}>GRATIS</span>
      </div>
    </>
  );
};

// 3 — doc · 2 · sign
const S3: React.FC = () => {
  const f = useCurrentFrame();
  const two = spring({ frame: f - t(13.92), fps: 30, config: { damping: 10 } });
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 14, fontFamily: FONT, fontWeight: 700, fontSize: 140, color: "#fff", letterSpacing: "-0.03em" }}>
      <span style={{ transform: `scale(${bounce(f, t(13.2))})` }}>doc</span>
      <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 170, height: 170, borderRadius: 85, background: "#fff", color: BLUE, transform: `scale(${0.4 + 0.6 * two})` }}>2</span>
      <span style={{ transform: `scale(${bounce(f, t(14.28))})` }}>sign</span>
    </div>
  );
};

// 4 — sign any digital document with legal validity
const S4: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      <div style={{ position: "absolute", left: 255, top: 60, width: 470, height: 610, borderRadius: 30, background: "#fff", boxShadow: "0 24px 50px rgba(10,6,90,.4)", transform: `scale(${bounce(f, t(15.2))})`, padding: 40, boxSizing: "border-box" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Icon d={IC.doc} size={64} color={BLUE} />
          <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 36, color: NAVY }}>Documento</span>
        </div>
        {[0, 1, 2, 3].map((k) => <div key={k} style={{ height: 14, borderRadius: 7, background: "#E6E5F5", marginTop: 26, width: `${90 - k * 12}%` }} />)}
        <div style={{ position: "absolute", left: 40, right: 40, bottom: 70, height: 3, background: BLUE, opacity: 0.4 }} />
      </div>
      <Signature at={t(16.64)} x={300} y={480} color={BLUE} />
      <div style={{ position: "absolute", left: 590, top: 600, transform: `scale(${bounce(f, t(19.28))})`, opacity: f >= t(19.28) ? 1 : 0 }}>
        <span style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: FONT, fontWeight: 800, fontSize: 30, color: "#fff", background: GREEN, borderRadius: 999, padding: "12px 22px", border: "4px solid #fff" }}>
          <Icon d={IC.check} size={30} color="#fff" sw={3.4} /> Validez legal
        </span>
      </div>
    </>
  );
};

// 5 — any kind of matter
const S5: React.FC = () => {
  const items = [
    { x: 290, y: 170, d: IC.cash, l: "Mercantil", at: t(20.16) },
    { x: 690, y: 170, d: IC.user, l: "Laboral", at: t(21.32) },
    { x: 290, y: 480, d: IC.building, l: "Corporativo", at: t(22.5) },
    { x: 690, y: 480, d: IC.scale, l: "Civil", at: t(25.0) },
  ];
  return <>{items.map((i, k) => <Tile key={i.l} x={i.x} y={i.y} d={i.d} at={i.at} label={i.l} size={150} phase={k} />)}</>;
};

// 6 — printing, paper and couriers, gone
const S6: React.FC = () => {
  const items = [
    { x: 170, d: IC.printer, l: "Impresión", at: t(29.58) },
    { x: 490, d: IC.archive, l: "Papel", at: t(30.58) },
    { x: 810, d: IC.truck, l: "Mensajería", at: t(31.58) },
  ];
  const f = useCurrentFrame();
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 60, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 48, color: "#fff", transform: `scale(${bounce(f, t(26.12))})`, opacity: f >= t(26.12) ? 1 : 0 }}>Digitaliza</div>
      {items.map((i, k) => (
        <React.Fragment key={i.l}>
          <Tile x={i.x} y={360} d={i.d} at={i.at} label={i.l} size={170} phase={k} />
          <Dot x={i.x + 70} y={285} at={i.at + 6} ok={false} text="✕" size={56} />
        </React.Fragment>
      ))}
    </>
  );
};

// 7 — join doc2sign, backed as a certification services provider
const S7: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 70, display: "flex", justifyContent: "center", transform: `scale(${bounce(f, t(34.2))})` }}>
        <Img src={staticFile("doc2sign/logo-white.png")} style={{ width: 480 }} />
      </div>
      <Tile x={490} y={350} d={IC.shield} at={t(36.44)} size={180} />
      <div style={{ position: "absolute", left: 60, right: 60, top: 520, textAlign: "center", fontFamily: FONT, fontWeight: 700, fontSize: 42, lineHeight: 1.15, color: "#fff", transform: `scale(${bounce(f, t(37.54))})`, opacity: f >= t(37.54) ? 1 : 0 }}>
        Prestador de Servicios
        <br />
        de Certificación
      </div>
    </>
  );
};

// 8 — not just a pretty signature: defensible in court, then the close
const S8: React.FC = () => {
  const f = useCurrentFrame();
  const pretty = f >= t(40.3) && f < t(41.6);
  return (
    <>
      <Tile x={490} y={200} d={pretty ? IC.pen : IC.gavel} at={t(39.45)} size={200} />
      {pretty && <div style={{ position: "absolute", left: 0, right: 0, top: 360, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 52, color: "#fff", textDecoration: "line-through", opacity: 0.85 }}>Una firma bonita</div>}
      <div style={{ position: "absolute", left: 0, right: 0, top: 360, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 58, color: "#fff", transform: `scale(${bounce(f, t(41.68))})`, opacity: f >= t(41.68) ? 1 : 0 }}>Defendible en juicio</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 520, display: "flex", justifyContent: "center", transform: `scale(${bounce(f, t(42.5))})`, opacity: f >= t(42.5) ? 1 : 0 }}>
        <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 34, color: BLUE, background: "#fff", borderRadius: 16, padding: "14px 30px" }}>Crea tu cuenta gratis en doc2sign.com</span>
      </div>
    </>
  );
};

const SCENES: { from: number; to: number; C: React.FC }[] = [
  { from: 0.1, to: 9.82, C: S1 },
  { from: 9.82, to: 13.15, C: S2 },
  { from: 13.15, to: 15.0, C: S3 },
  { from: 15.0, to: 19.78, C: S4 },
  { from: 19.78, to: 25.66, C: S5 },
  { from: 25.66, to: 32.9, C: S6 },
  { from: 32.9, to: 39.36, C: S7 },
  { from: 39.36, to: 45, C: S8 },
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
export const Doc2Sign4Video: React.FC = () => {
  const [handle] = useState(() => delayRender("Loading fonts"));
  useEffect(() => {
    fontsLoaded.then(() => continueRender(handle));
  }, [handle]);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Reframed />
      <Audio src={staticFile("music/doc2sign4.wav")} volume={0.07} />
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
