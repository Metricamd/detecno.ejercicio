// Exppedify #3 — "Llevas un departamento fiscal… acreditar materialidad". Same
// look as the first Exppedify edit (indigo base, turquoise for emphasis,
// lavender and cyan accents, Montserrat titles with Noto Sans standing in for
// Canva Sans, the turquoise · cyan · indigo band) on the newer layout: clip at
// 1.2× with the silences cut (public/exppedify3/video.mp4), reframed with
// jump-cut zooms, visual diagrams on an indigo stage at the top and subtitles
// at the bottom.
import { loadFont } from "@remotion/fonts";
import React, { useEffect, useState } from "react";
import { AbsoluteFill, Audio, continueRender, delayRender, Easing, Img, interpolate, OffthreadVideo, spring, staticFile, useCurrentFrame } from "remotion";

export const EXPPEDIFY3_DURATION = 790; // 26.31 s at 30 fps
const BLUE = "#2815DD"; // índigo vívido
const NAVY = "#140E68"; // índigo de fondo
const LILAC = "#3DEAB7"; // turquesa: emphasis, tags and CTA
const LAVENDER = "#915CFF";
const CYAN = "#00CEFF";
const FONT = "Montserrat";
const SANS = "Noto Sans";

const fontsLoaded = Promise.all([
  ...["600", "700"].map((w) => loadFont({ family: FONT, url: staticFile(`fonts/montserrat-latin-${w}-normal.woff2`), weight: w })),
  ...["500", "600"].map((w) => loadFont({ family: SANS, url: staticFile(`fonts/noto-sans-latin-${w}-normal.woff2`), weight: w })),
]);
const RED = "#F0506E";

const t = (sec: number) => Math.round(sec * 30);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const bounce = (f: number, at: number) => spring({ frame: f - at, fps: 30, config: { damping: 11, stiffness: 150 } });

/* ---------- reframing with jump-cut zooms on the silence cuts ---------- */
const FACE = { x: 400, y: 840 };
const TARGET = { x: 500, y: 1080 };
const CUTS = [0, 1.774, 6.027, 7.09, 8.193, 12.92, 13.882, 20.024, 21.767];

const Reframed: React.FC = () => {
  const f = useCurrentFrame();
  const sec = f / 30;
  let k = 0;
  while (k + 1 < CUTS.length && sec >= CUTS[k + 1]) k++;
  const s = (k % 2 ? 1.44 : 1.32) + Math.min(sec - CUTS[k], 6) * 0.006;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ transformOrigin: `${FACE.x}px ${FACE.y}px`, transform: `translate(${TARGET.x - FACE.x}px, ${TARGET.y - FACE.y}px) scale(${s})` }}>
        <OffthreadVideo src={staticFile("exppedify3/video.mp4")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------- subtitles (bottom) ---------- */
type W = [string, number];
const PAGES: { words: W[]; end: number }[] = [
  { words: [["¿Llevas", 0.24], ["un", 0.52], ["departamento", 0.66], ["*fiscal", 1.4]], end: 1.92 },
  { words: [["y", 1.98], ["te", 2.16], ["preocupa", 2.56], ["que", 2.98], ["los", 3.1], ["*expedientes", 3.36], ["que", 3.78], ["tienes", 4], ["de", 4.14], ["tus", 4.26], ["*proveedores", 4.48]], end: 4.96 },
  { words: [["o", 5.02], ["de", 5.08], ["sus", 5.18], ["*entregables", 5.46], ["no", 6.3], ["te", 6.46], ["permitan", 6.76], ["*acreditar", 7.13], ["*materialidad?", 7.59]], end: 8.31 },
  { words: [["Te", 8.37], ["invito", 8.47], ["a", 8.69], ["crear", 8.79], ["una", 8.93], ["cuenta", 9.11], ["en", 9.31], ["*exppedify.com,", 9.47]], end: 10.55 },
  { words: [["donde", 10.61], ["podrás", 10.91], ["*programar", 11.31], ["la", 11.59], ["gestión", 11.77], ["*recurrente", 12.17], ["o", 12.71], ["por", 13.15], ["*única", 13.35], ["*vez", 13.67]], end: 14.11 },
  { words: [["de", 14.17], ["ciertos", 14.39], ["*documentos", 14.83], ["que", 15.13], ["te", 15.23], ["permitirán", 15.55], ["*acreditar", 15.97], ["una", 16.37], ["*relación", 16.79]], end: 17.31 },
  { words: [["con", 17.37], ["cierto", 17.61], ["*proveedor", 17.89], ["o", 18.35], ["cierto", 18.53], ["*cliente", 18.83], ["o", 19.33], ["lo", 19.45], ["que", 19.55], ["fuera,", 19.77]], end: 20.33 },
  { words: [["así", 20.39], ["como", 20.61], ["de", 20.73], ["ciertos", 20.91], ["*entregables.", 21.31]], end: 22.03 },
  { words: [["Y", 22.09], ["hoy", 22.63], ["día", 22.75], ["la", 22.87], ["*autoridad", 22.99], ["está", 23.45], ["muy", 23.61], ["*exigente", 23.77], ["en", 24.13], ["estos", 24.23], ["expedientes,", 24.53]], end: 25.31 },
  { words: [["y", 25.37], ["qué", 25.45], ["mejor", 25.65], ["que", 25.77], ["*anticiparse.", 25.95]], end: 26.31 },
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
      <div style={{ background: "rgba(20,14,104,.9)", borderRadius: 20, padding: "16px 30px", maxWidth: 940, textAlign: "center", fontFamily: SANS, fontWeight: 500, fontSize: 40, lineHeight: 1.3, color: "#fff", boxShadow: "0 12px 30px rgba(10,8,60,.25)" }}>
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
  team: "M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2 20c0-3.9 3.1-7 7-7s7 3.1 7 7M16 4a3.5 3.5 0 0 1 0 7M18 13c2.4.8 4 3.3 4 6",
  mail: "M3 6h18v12H3zM3 6l9 7 9-7",
  repeat: "M17 2l4 4-4 4M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4M21 13v2a3 3 0 0 1-3 3H3",
  id: "M3 5h18v14H3zM8 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM5 17c0-1.7 1.3-3 3-3s3 1.3 3 3M14 10h5M14 14h4",
  folder: "M3 7h6l2 2h10v10H3z",
  box: "M12 3l8 4.5v9L12 21l-8-4.5v-9zM4 7.5l8 4.5 8-4.5M12 12v9",
  one: "M4 6h16v14H4zM4 10h16M8 3v4M16 3v4M11 13l2-1v6",
  lens: "M10.5 4a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM15.5 15.5L20 20",
  calc: "M6 3h12v18H6zM9 7h6M9 11h.01M12 11h.01M15 11h.01M9 14h.01M12 14h.01M15 14h.01M9 17h.01M12 17h.01M15 17h.01",
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

/* ---------- scenes (980×730 stage) ---------- */
// 1 — supplier files and deliverables that may not prove materiality
const S1: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      {f < t(3.3) && <Tile x={490} y={300} d={IC.calc} at={t(0.4)} label="Departamento fiscal" size={200} />}
      <Tile x={190} y={230} d={IC.folder} at={t(3.36)} label="Expedientes" size={160} />
      <Tile x={490} y={230} d={IC.building} at={t(4.48)} label="Proveedores" size={160} phase={1} />
      <Tile x={790} y={230} d={IC.box} at={t(5.46)} label="Entregables" size={160} phase={2} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 500, display: "flex", justifyContent: "center", transform: `scale(${bounce(f, t(7.13))})`, opacity: f >= t(7.13) ? 1 : 0 }}>
        <span style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: FONT, fontWeight: 700, fontSize: 44, color: "#fff", border: `4px solid ${RED}`, borderRadius: 18, padding: "10px 28px" }}>
          <span style={{ width: 46, height: 46, borderRadius: 23, background: RED, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>?</span>
          Materialidad
        </span>
      </div>
    </>
  );
};

// 2 — create the account
const S2: React.FC = () => {
  const f = useCurrentFrame();
  const url = "exppedify.com";
  const typed = Math.round(interpolate(f, [t(9.43), t(10.13)], [0, url.length], clamp));
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 130, display: "flex", justifyContent: "center", transform: `scale(${bounce(f, t(8.43))})` }}>
        <Img src={staticFile("exppedify/logo-white.png")} style={{ width: 580 }} />
      </div>
      <div style={{ position: "absolute", left: 150, right: 150, top: 420, display: "flex", alignItems: "center", gap: 14, background: "#fff", borderRadius: 999, padding: "20px 30px", boxShadow: "0 20px 44px rgba(0,0,0,.35)", transform: `scale(${bounce(f, t(9.13))})` }}>
        <Icon d={IC.search} size={40} color={BLUE} sw={2.6} />
        <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: 44, color: NAVY }}>
          {url.slice(0, typed)}
          <span style={{ opacity: typed < url.length && f % 20 < 10 ? 1 : 0, color: BLUE }}>|</span>
        </span>
      </div>
    </>
  );
};

// 3 — schedule recurring or one-off requests
const S3: React.FC = () => {
  const f = useCurrentFrame();
  const spin = interpolate(f, [t(12.17), t(13.93)], [0, 360], clamp);
  return (
    <>
      <div style={{ position: "absolute", left: 290 - 95, top: 290 - 95, width: 190, display: "flex", flexDirection: "column", alignItems: "center", gap: 12, transform: `scale(${bounce(f, t(12.17))})`, opacity: f >= t(12.17) ? 1 : 0 }}>
        <div style={{ width: 190, height: 190, borderRadius: 48, background: LILAC, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 22px 44px rgba(0,0,0,.35)" }}>
          <div style={{ transform: `rotate(${spin}deg)` }}><Icon d={IC.repeat} size={96} color={NAVY} sw={2.2} /></div>
        </div>
        <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 32, color: "#fff" }}>Recurrente</span>
      </div>
      <Tile x={690} y={290} d={IC.one} at={t(13.35)} label="Por única vez" size={190} phase={1} />
    </>
  );
};

// 4 — documents that prove the relationship with a supplier or client, and deliverables
const S4: React.FC = () => {
  const f = useCurrentFrame();
  const link = interpolate(f, [t(16.79), t(17.23)], [0, 1], clamp);
  return (
    <>
      <svg width={980} height={730} style={{ position: "absolute", left: 0, top: 0 }}>
        <path d="M250 200 L730 200" stroke={LILAC} strokeWidth={8} strokeLinecap="round" strokeDasharray="480" strokeDashoffset={480 * (1 - link)} />
      </svg>
      <Tile x={170} y={200} d={IC.building} at={t(17.89)} label="Proveedor" size={150} />
      <Tile x={810} y={200} d={IC.user} at={t(18.83)} label="Cliente" size={150} phase={1} />
      <Tile x={490} y={200} d={IC.shield} at={t(15.97)} size={140} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center", fontFamily: FONT, fontWeight: 700, fontSize: 32, color: LILAC, opacity: link }}>Relación acreditada</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 420, display: "flex", justifyContent: "center", gap: 20 }}>
        {[["Documentos", IC.doc, t(14.83)], ["Entregables", IC.box, t(21.31)]].map(([l, d, at]) => (
          <span key={l as string} style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: FONT, fontWeight: 700, fontSize: 32, color: NAVY, background: "#fff", borderRadius: 18, padding: "14px 24px", transform: `scale(${bounce(f, at as number)})`, opacity: f >= (at as number) ? 1 : 0 }}>
            <Icon d={d as string} size={38} color={BLUE} sw={2.2} /> {l}
          </span>
        ))}
      </div>
    </>
  );
};

// 5 — the authority is demanding: get ahead of it
const S5: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      <Tile x={490} y={170} d={IC.lens} at={t(22.99)} label="Autoridad exigente" size={170} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 400, display: "flex", justifyContent: "center", transform: `scale(${bounce(f, t(25.95))})`, opacity: f >= t(25.95) ? 1 : 0 }}>
        <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 52, color: NAVY, background: LILAC, padding: "12px 40px" }}>Anticípate →</span>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 540, display: "flex", justifyContent: "center", opacity: interpolate(f, [t(26.03), t(26.23)], [0, 1], clamp) }}>
        <Img src={staticFile("exppedify/logo-white.png")} style={{ width: 340 }} />
      </div>
    </>
  );
};

const SCENES: { from: number; to: number; C: React.FC }[] = [
  { from: 0.1, to: 8.33, C: S1 },
  { from: 8.33, to: 10.57, C: S2 },
  { from: 10.57, to: 14.13, C: S3 },
  { from: 14.13, to: 22.05, C: S4 },
  { from: 22.05, to: 27.53, C: S5 },
];

const Stage: React.FC = () => {
  const f = useCurrentFrame();
  const enter = spring({ frame: f, fps: 30, config: { damping: 200 }, durationInFrames: 14 });
  return (
    <div style={{ position: "absolute", left: 50, top: 150, width: 980, height: 730, borderRadius: 48, overflow: "hidden", background: `linear-gradient(160deg, #1C1580 0%, ${NAVY} 55%, #0B0845 100%)`, boxShadow: "0 30px 70px rgba(10,6,90,.4)", opacity: enter, transform: `translateY(${(1 - enter) * -40}px)` }}>
      {/* the rounded blob shapes of the doc2sign layouts */}
      <div style={{ position: "absolute", right: -120, bottom: -140, width: 520, height: 520, borderRadius: "50%", background: `radial-gradient(circle, ${LAVENDER}88 0%, ${LILAC}33 45%, transparent 70%)`, filter: "blur(30px)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 12, display: "flex" }}><div style={{ flex: 1, background: LILAC }} /><div style={{ flex: 1, background: CYAN }} /><div style={{ flex: 1, background: BLUE }} /></div>
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
export const Exppedify3Video: React.FC = () => {
  const [handle] = useState(() => delayRender("Loading fonts"));
  useEffect(() => {
    fontsLoaded.then(() => continueRender(handle));
  }, [handle]);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Reframed />
      <Audio src={staticFile("music/exppedify3.wav")} volume={0.035} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 40, display: "flex", justifyContent: "center" }}>
        <div style={{ background: "rgba(255,255,255,.96)", borderRadius: 999, padding: "14px 32px", boxShadow: "0 10px 26px rgba(10,8,60,.2)" }}>
          <Img src={staticFile("exppedify/logo.png")} style={{ height: 52, display: "block" }} />
        </div>
      </div>
      <Stage />
      <Subtitles />
    </AbsoluteFill>
  );
};
