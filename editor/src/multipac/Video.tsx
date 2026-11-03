// Multipac — "¿Ya conectaste tu ERP con varios PAC?". No brand kit was given,
// so the look follows detecno (navy #1F3C88, cyan #29B6F6, white tiles, Barlow)
// with a text wordmark. Newer layout: clip at 1.2× with the silences cut
// (public/multipac/video.mp4), reframed with jump-cut zooms, diagrams on a
// navy stage at the top and subtitles at the bottom.
import { loadFont } from "@remotion/fonts";
import React, { useEffect, useState } from "react";
import { AbsoluteFill, Audio, continueRender, delayRender, Easing, interpolate, OffthreadVideo, spring, staticFile, useCurrentFrame } from "remotion";

export const MULTIPAC_DURATION = 956; // 31.85 s at 30 fps
const BLUE = "#1F3C88";
const NAVY = "#0F1F4D";
const LILAC = "#29B6F6"; // cyan accent
const FONT = "Barlow";

const fontsLoaded = Promise.all(["500", "600", "700", "800"].map((w) => loadFont({ family: FONT, url: staticFile(`fonts/barlow-latin-${w}-normal.woff2`), weight: w })));

const t = (sec: number) => Math.round(sec * 30);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const bounce = (f: number, at: number) => spring({ frame: f - at, fps: 30, config: { damping: 11, stiffness: 150 } });

/* ---------- reframing with jump-cut zooms on the silence cuts ---------- */
const FACE = { x: 560, y: 960 };
const TARGET = { x: 540, y: 1180 };
const CUTS = [0, 2.52, 4.22, 5.69, 8.2, 14.22, 15.14, 23.34, 25.72, 28.87];

const Reframed: React.FC = () => {
  const f = useCurrentFrame();
  const sec = f / 30;
  let k = 0;
  while (k + 1 < CUTS.length && sec >= CUTS[k + 1]) k++;
  const s = (k % 2 ? 1.42 : 1.3) + Math.min(sec - CUTS[k], 6) * 0.006;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ transformOrigin: `${FACE.x}px ${FACE.y}px`, transform: `translate(${TARGET.x - FACE.x}px, ${TARGET.y - FACE.y}px) scale(${s})` }}>
        <OffthreadVideo src={staticFile("multipac/video.mp4")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------- subtitles (bottom) ---------- */
type W = [string, number];
const PAGES: { words: W[]; end: number }[] = [
  { words: [["¿Eres", 0.36], ["una", 0.6], ["empresa", 0.92], ["que", 1.32], ["ya", 1.52], ["tiene", 1.72], ["un", 1.86], ["*ERP", 2.12]], end: 2.68 },
  { words: [["e", 2.74], ["hiciste", 3.04], ["la", 3.34], ["conexión", 3.58], ["con", 4.5], ["diferentes", 5.0], ["*PAC", 5.36]], end: 6.1 },
  { words: [["para", 6.16], ["garantizar", 6.38], ["*continuidad", 7.0], ["*de", 7.28], ["*negocio?", 7.46]], end: 8.46 },
  { words: [["Eso", 8.52], ["implica", 8.74], ["que", 9.08], ["tengas", 9.24], ["que", 9.42], ["mantener", 9.66], ["*tres", 9.98], ["*contratos,", 10.24], ["*tres", 10.98], ["*ambientes", 11.18], ["*de", 11.52], ["*prueba,", 11.7]], end: 12.36 },
  { words: [["*actualizaciones", 12.42], ["*distintas,", 13.1], ["incluso", 13.82], ["*precios", 14.44], ["*diferentes.", 14.78]], end: 15.26 },
  { words: [["Te", 15.32], ["invito", 15.44], ["a", 15.68], ["crear", 15.84], ["una", 16.02], ["*cuenta", 16.3], ["*gratis", 16.98], ["en", 17.46], ["*multipac.ai,", 17.78]], end: 19.26 },
  { words: [["conectarte", 19.32], ["al", 19.74], ["*sandbox", 20.1], ["y", 20.54], ["conectarte", 20.74], ["a", 21.16], ["un", 21.32], ["*endpoint", 21.76], ["que", 22.1], ["está", 22.26], ["*georreplicado,", 22.48]], end: 23.56 },
  { words: [["donde", 23.62], ["tendrás", 23.9], ["la", 24.12], ["disponibilidad", 24.34], ["de", 24.96], ["*cinco", 25.24], ["*PAC", 25.52]], end: 25.92 },
  { words: [["para", 25.98], ["que", 26.14], ["no", 26.34], ["tengas", 26.58], ["que", 26.8], ["estar", 27.02], ["manteniendo", 27.36], ["*diferentes", 27.88], ["*integraciones,", 28.24]], end: 29.04 },
  { words: [["y", 29.1], ["garanticemos", 29.3], ["que", 29.94], ["*siempre", 30.5], ["*se", 30.88], ["*timbren", 31.04], ["tus", 31.28], ["CFDI.", 31.44]], end: 31.85 },
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
      <div style={{ background: "rgba(15,31,77,.9)", borderRadius: 18, padding: "14px 30px", maxWidth: 940, textAlign: "center", fontFamily: FONT, fontWeight: 600, fontSize: 46, lineHeight: 1.3, color: "#fff", boxShadow: "0 12px 30px rgba(10,8,60,.25)" }}>
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
  server: "M4 4h16v6H4zM4 14h16v6H4zM8 7h.01M8 17h.01",
  flask: "M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3M7.5 15h9",
  refresh: "M20 11a8 8 0 0 0-14.9-3M4 4v4h4M4 13a8 8 0 0 0 14.9 3M20 20v-4h-4",
  globe: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c2.5 2.5 3.8 5.5 3.8 9s-1.3 6.5-3.8 9M12 3C9.5 5.5 8.2 8.5 8.2 12s1.3 6.5 3.8 9",
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
const Wordmark: React.FC<{ size?: number; at: number }> = ({ size = 120, at }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ display: "flex", alignItems: "baseline", fontFamily: FONT, fontWeight: 800, fontSize: size, color: "#fff", letterSpacing: "-0.02em", transform: `scale(${bounce(f, at)})` }}>
      multi<span style={{ color: LILAC }}>pac</span><span style={{ fontSize: size * 0.5, color: LILAC, marginLeft: 4 }}>.ai</span>
    </div>
  );
};

// 1 — ERP connected to several PACs
const S1: React.FC = () => {
  const f = useCurrentFrame();
  const ys = [140, 330, 520];
  return (
    <>
      <Tile x={200} y={330} d={IC.server} at={t(2.12)} label="ERP" size={180} />
      {ys.map((y, k) => (
        <React.Fragment key={y}>
          <svg width={980} height={730} style={{ position: "absolute", left: 0, top: 0 }}>
            <path d={`M300 330 L690 ${y}`} stroke={LILAC} strokeWidth={6} strokeLinecap="round" opacity={interpolate(f, [t(3.58) + k * 5, t(3.58) + k * 5 + 8], [0, 1], clamp)} />
          </svg>
          <Tile x={780} y={y} d={IC.server} at={t(5.0) + k * 4} label={`PAC ${k + 1}`} size={110} phase={k} />
        </React.Fragment>
      ))}
      <div style={{ position: "absolute", left: 380, width: 280, top: 600, textAlign: "center", fontFamily: FONT, fontWeight: 700, fontSize: 30, color: LILAC, opacity: interpolate(f, [t(7.0), t(7.3)], [0, 1], clamp) }}>Continuidad de negocio</div>
    </>
  );
};

// 2 — the cost: 3 contracts, 3 sandboxes, different updates and prices
const S2: React.FC = () => {
  const f = useCurrentFrame();
  const rows = [
    { d: IC.doc, l: "3 contratos", at: t(10.24) },
    { d: IC.flask, l: "3 ambientes de prueba", at: t(11.7) },
    { d: IC.refresh, l: "Actualizaciones distintas", at: t(13.1) },
    { d: IC.cash, l: "Precios diferentes", at: t(14.78) },
  ];
  return (
    <div style={{ position: "absolute", left: 70, right: 70, top: 60, display: "flex", flexDirection: "column", gap: 20 }}>
      {rows.map((r) => (
        <div key={r.l} style={{ display: "flex", alignItems: "center", gap: 22, background: "#fff", borderRadius: 22, padding: "14px 22px", transform: `scale(${bounce(f, r.at)})`, opacity: f >= r.at ? 1 : 0 }}>
          <div style={{ width: 72, height: 72, borderRadius: 20, background: BLUE, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon d={r.d} size={42} color="#fff" sw={2.2} />
          </div>
          <span style={{ flex: 1, fontFamily: FONT, fontWeight: 700, fontSize: 40, color: NAVY }}>{r.l}</span>
          <span style={{ width: 44, height: 44, borderRadius: 22, background: "#F0506E", color: "#fff", fontFamily: FONT, fontWeight: 800, fontSize: 30, display: "flex", alignItems: "center", justifyContent: "center" }}>!</span>
        </div>
      ))}
    </div>
  );
};

// 3 — free account at multipac.ai
const S3: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 30 }}>
      <Wordmark at={t(17.78)} size={130} />
      <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, color: NAVY, background: LILAC, borderRadius: 16, padding: "8px 32px", transform: `scale(${bounce(f, t(16.98))})`, opacity: f >= t(16.98) ? 1 : 0 }}>CUENTA GRATIS</span>
    </div>
  );
};

// 4 — sandbox → one geo-replicated endpoint → 5 PACs
const S4: React.FC = () => {
  const f = useCurrentFrame();
  const xs = [130, 310, 490, 670, 850];
  return (
    <>
      <Tile x={200} y={170} d={IC.flask} at={t(20.1)} label="Sandbox" size={140} />
      <Tile x={780} y={170} d={IC.globe} at={t(21.76)} label="Endpoint georreplicado" size={140} phase={1} />
      <svg width={980} height={730} style={{ position: "absolute", left: 0, top: 0 }}>
        <path d="M290 170 L690 170" stroke="#fff" strokeWidth={6} strokeDasharray="4 12" strokeLinecap="round" opacity={interpolate(f, [t(20.74), t(21.2)], [0, 1], clamp)} />
        {xs.map((x, k) => (
          <path key={x} d={`M780 280 L${x} 480`} stroke={LILAC} strokeWidth={4} strokeLinecap="round" opacity={interpolate(f, [t(25.24) + k * 3, t(25.24) + k * 3 + 6], [0, 1], clamp)} />
        ))}
      </svg>
      {xs.map((x, k) => <Tile key={x} x={x} y={540} d={IC.server} at={t(25.24) + k * 3} label={`PAC ${k + 1}`} size={100} phase={k} />)}
    </>
  );
};

// 5 — one integration, always stamped
const S5: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 28 }}>
      <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 64, color: "#fff", transform: `scale(${bounce(f, t(26.0))})`, opacity: f >= t(26.0) ? 1 : 0 }}>Una sola integración</span>
      <span style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: FONT, fontWeight: 800, fontSize: 48, color: NAVY, background: LILAC, borderRadius: 18, padding: "10px 32px", transform: `scale(${bounce(f, t(30.5))})`, opacity: f >= t(30.5) ? 1 : 0 }}>
        <Icon d={IC.check} size={46} color={NAVY} sw={3.4} /> Tus CFDI siempre timbrados
      </span>
      <div style={{ opacity: interpolate(f, [t(31.0), t(31.3)], [0, 1], clamp) }}><Wordmark at={t(31.0)} size={70} /></div>
    </div>
  );
};

const SCENES: { from: number; to: number; C: React.FC }[] = [
  { from: 0.1, to: 8.48, C: S1 },
  { from: 8.48, to: 15.28, C: S2 },
  { from: 15.28, to: 19.28, C: S3 },
  { from: 19.28, to: 25.94, C: S4 },
  { from: 25.94, to: 33, C: S5 },
];

const Stage: React.FC = () => {
  const f = useCurrentFrame();
  const enter = spring({ frame: f, fps: 30, config: { damping: 200 }, durationInFrames: 14 });
  return (
    <div style={{ position: "absolute", left: 50, top: 150, width: 980, height: 730, borderRadius: 48, overflow: "hidden", background: `linear-gradient(155deg, #2A4FA8 0%, ${BLUE} 50%, ${NAVY} 100%)`, boxShadow: "0 30px 70px rgba(10,6,90,.4)", opacity: enter, transform: `translateY(${(1 - enter) * -40}px)` }}>
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
export const MultipacVideo: React.FC = () => {
  const [handle] = useState(() => delayRender("Loading fonts"));
  useEffect(() => {
    fontsLoaded.then(() => continueRender(handle));
  }, [handle]);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Reframed />
      <Audio src={staticFile("music/multipac.wav")} volume={0.035} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 40, display: "flex", justifyContent: "center" }}>
        <div style={{ background: "rgba(255,255,255,.96)", borderRadius: 999, padding: "14px 32px", boxShadow: "0 10px 26px rgba(10,8,60,.2)" }}>
          <span style={{ display: "block", fontFamily: FONT, fontWeight: 800, fontSize: 50, lineHeight: 1, color: NAVY }}>multi<span style={{ color: "#1A9AD6" }}>pac</span></span>
        </div>
      </div>
      <Stage />
      <Subtitles />
    </AbsoluteFill>
  );
};
