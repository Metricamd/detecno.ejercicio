// SíConf.io #2 — "¿Eres integrador de sistemas…?" (verificación activa por API
// en listas negras del SAT). SíConf.io look from the Buen Fin reference (Barlow,
// blues #0149AC / #2F6DB5, sky #A4CDF8, red "En lista" / green "Sin
// coincidencias" statuses) on the newer layout: clip at 1.2× with the silences
// cut (public/siconfio2/video.mp4), reframed with jump-cut zooms, diagrams on a
// blue stage at the top and subtitles at the bottom.
import { loadFont } from "@remotion/fonts";
import React, { useEffect, useState } from "react";
import { AbsoluteFill, Audio, continueRender, delayRender, Easing, Img, interpolate, OffthreadVideo, spring, staticFile, useCurrentFrame } from "remotion";

export const SICONFIO2_DURATION = 1173; // 39.08 s at 30 fps
const BLUE = "#0149AC";
const NAVY = "#1D3A73";
const LILAC = "#A4CDF8"; // sky accent
const RED = "#E5484D";
const GREEN = "#1FA971";
const FONT = "Barlow";

const fontsLoaded = Promise.all(["500", "600", "700", "800"].map((w) => loadFont({ family: FONT, url: staticFile(`fonts/barlow-latin-${w}-normal.woff2`), weight: w })));

const t = (sec: number) => Math.round(sec * 30);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const bounce = (f: number, at: number) => spring({ frame: f - at, fps: 30, config: { damping: 11, stiffness: 150 } });

/* ---------- reframing with jump-cut zooms on the silence cuts ---------- */
const FACE = { x: 560, y: 900 };
const TARGET = { x: 540, y: 1150 };
const CUTS = [0, 1.715, 2.917, 5.462, 8.623, 11.919, 17.412, 19.093, 23.129, 26.163];

const Reframed: React.FC = () => {
  const f = useCurrentFrame();
  const sec = f / 30;
  let k = 0;
  while (k + 1 < CUTS.length && sec >= CUTS[k + 1]) k++;
  const s = (k % 2 ? 1.42 : 1.3) + Math.min(sec - CUTS[k], 6) * 0.006;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ transformOrigin: `${FACE.x}px ${FACE.y}px`, transform: `translate(${TARGET.x - FACE.x}px, ${TARGET.y - FACE.y}px) scale(${s})` }}>
        <OffthreadVideo src={staticFile("siconfio2/video.mp4")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------- subtitles (bottom) ---------- */
type W = [string, number];
const PAGES: { words: W[]; end: number }[] = [
  { words: [["¿Eres", 0.22], ["un", 0.42], ["*integrador", 0.64], ["*de", 0.98], ["*sistemas?", 1.36]], end: 1.86 },
  { words: [["¿Tienes", 1.92], ["un", 2.22], ["*ERP,", 2.52], ["un", 3.16], ["sistema", 3.44], ["de", 3.6], ["*nóminas", 3.7], ["o", 4.36], ["un", 4.5], ["sistema", 4.84], ["*POS", 5.08]], end: 5.64 },
  { words: [["y", 5.7], ["te", 5.86], ["interesa", 6.08], ["*blindar", 6.7], ["a", 6.96], ["tu", 7.08], ["cliente", 7.28], ["para", 7.7], ["que", 7.88], ["nunca", 8.22], ["tenga", 8.92], ["relación", 9.36]], end: 9.56 },
  { words: [["con", 9.62], ["nadie", 9.9], ["que", 10.08], ["esté", 10.22], ["enlistado", 10.28], ["en", 10.86], ["las", 10.92], ["*listas", 11.08], ["*negras", 11.28], ["del", 11.52], ["SAT?", 11.66]], end: 12.06 },
  { words: [["Te", 12.12], ["invito", 12.24], ["a", 12.46], ["conectar", 12.62], ["tu", 12.98], ["sistema", 13.3], ["a", 13.42], ["nuestras", 13.62], ["*APIs", 13.96]], end: 14.48 },
  { words: [["para", 14.54], ["que", 14.68], ["tengas", 14.84], ["una", 15.06], ["*verificación", 15.2], ["*activa", 15.98], ["en", 16.46], ["diferentes", 16.68], ["momentos:", 17.16]], end: 17.64 },
  { words: [["desde", 17.7], ["que", 17.9], ["vas", 18.0], ["a", 18.08], ["registrar", 18.28], ["un", 18.5], ["*proveedor,", 18.66], ["desde", 19.44], ["que", 19.62], ["vas", 19.74], ["a", 19.84], ["hacer", 19.96], ["una", 20.08], ["*orden", 20.2], ["*de", 20.38], ["*compra,", 20.64]], end: 21.32 },
  { words: [["desde", 21.38], ["que", 21.58], ["vas", 21.72], ["a", 21.8], ["registrar", 22.0], ["un", 22.28], ["*cliente,", 22.44], ["desde", 23.48], ["que", 23.66], ["cargas", 23.82], ["el", 24.06], ["*CFDI", 24.18], ["antes", 25.46], ["de", 25.6], ["*pagar,", 25.86]], end: 26.36 },
  { words: [["y", 26.42], ["de", 26.52], ["esta", 26.64], ["forma", 26.9], ["*blindes", 27.32], ["a", 28.1], ["tu", 28.2], ["cliente", 28.48]], end: 29.18 },
  { words: [["para", 29.24], ["que", 29.4], ["no", 29.58], ["sea", 29.76], ["catalogado", 30.14], ["como", 30.6], ["una", 30.76], ["empresa", 31.06], ["*facturadora", 31.32], ["de", 32.34], ["operaciones", 32.48], ["*ilícitas", 32.9]], end: 33.42 },
  { words: [["o", 33.48], ["bien", 33.72], ["una", 34.36], ["empresa", 34.68], ["*deductora", 35.04], ["de", 35.76], ["operaciones", 35.92], ["*ilícitas.", 36.28]], end: 37.4 },
  { words: [["Crea", 37.46], ["una", 37.6], ["*cuenta", 37.78], ["*gratis", 38.06], ["y", 38.42], ["prueba", 38.54], ["el", 38.7], ["*servicio.", 38.82]], end: 39.08 },
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
      <div style={{ background: "rgba(29,58,115,.92)", borderRadius: 18, padding: "14px 30px", maxWidth: 940, textAlign: "center", fontFamily: FONT, fontWeight: 600, fontSize: 46, lineHeight: 1.3, color: "#fff", boxShadow: "0 12px 30px rgba(10,8,60,.25)" }}>
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
  plug: "M9 2v6M15 2v6M6 8h12v4a6 6 0 0 1-12 0zM12 18v4",
  pos: "M5 3h14v10H5zM8 7h8M3 21h18M7 13v8M17 13v8",
  alert: "M12 3l10 18H2zM12 10v5M12 18v.01",
  radar: "M12 12l6-6M12 3a9 9 0 1 0 9 9M12 7a5 5 0 1 0 5 5",
  cart: "M3 4h2l2.5 11h11L21 7H6.2M9 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM18 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2z",
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
const Status: React.FC<{ bad: boolean; at: number; label?: string }> = ({ bad, at, label }) => {
  const f = useCurrentFrame();
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: FONT, fontWeight: 700, fontSize: 26, color: bad ? RED : GREEN, background: bad ? "#FDECEC" : "#E4F6EE", borderRadius: 999, padding: "6px 16px", transform: `scale(${bounce(f, at)})`, opacity: f >= at ? 1 : 0, whiteSpace: "nowrap" }}>
      <Icon d={bad ? IC.alert : IC.check} size={24} color={bad ? RED : GREEN} sw={2.6} />
      {label ?? (bad ? "En lista" : "Sin coincidencias")}
    </span>
  );
};

// 1 — integrators: ERP, payroll, POS
const S1: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      <Tile x={490} y={150} d={IC.plug} at={t(0.64)} label="Integrador" size={140} />
      <Tile x={190} y={450} d={IC.server} at={t(2.52)} label="ERP" size={140} />
      <Tile x={490} y={450} d={IC.cash} at={t(3.7)} label="Nómina" size={140} phase={1} />
      <Tile x={790} y={450} d={IC.pos} at={t(5.08)} label="POS" size={140} phase={2} />
      <svg width={980} height={730} style={{ position: "absolute", left: 0, top: 0 }}>
        {[190, 490, 790].map((x, k) => (
          <path key={x} d={`M490 230 L${x} 370`} stroke={LILAC} strokeWidth={5} strokeLinecap="round" strokeDasharray="4 10" opacity={interpolate(f, [t(2.52) + k * 30, t(2.52) + k * 30 + 8], [0, 1], clamp)} />
        ))}
      </svg>
    </>
  );
};

// 2 — shield your client from SAT blacklisted companies
const S2: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      <Tile x={250} y={260} d={IC.shield} at={t(6.7)} label="Tu cliente" size={180} />
      <Tile x={730} y={260} d={IC.building} at={t(9.9)} label="Empresa en lista negra" size={180} color={RED} phase={1} />
      <svg width={980} height={730} style={{ position: "absolute", left: 0, top: 0 }}>
        <path d="M360 260 L620 260" stroke={RED} strokeWidth={8} strokeLinecap="round" strokeDasharray="10 12" opacity={interpolate(f, [t(9.36), t(9.7)], [0, 1], clamp)} />
        <path d="M470 225 L510 295 M510 225 L470 295" stroke={RED} strokeWidth={10} strokeLinecap="round" opacity={interpolate(f, [t(11.08), t(11.3)], [0, 1], clamp)} />
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 520, display: "flex", justifyContent: "center", gap: 12 }}>
        {["Lista 69", "69-B", "No localizados"].map((l, k) => (
          <span key={l} style={{ fontFamily: FONT, fontWeight: 700, fontSize: 28, color: NAVY, background: "#fff", borderRadius: 10, padding: "8px 18px", transform: `scale(${bounce(f, t(11.08) + k * 4)})`, opacity: f >= t(11.08) + k * 4 ? 1 : 0 }}>{l}</span>
        ))}
      </div>
    </>
  );
};

// 3 — connect your system to the SíConf.io APIs
const S3: React.FC = () => {
  const f = useCurrentFrame();
  const p = interpolate(f, [t(13.6), t(14.1)], [0, 1], clamp);
  return (
    <>
      <Tile x={200} y={300} d={IC.server} at={t(12.62)} label="Tu sistema" size={180} />
      <svg width={980} height={730} style={{ position: "absolute", left: 0, top: 0 }}>
        <path d="M310 300 L560 300" stroke={LILAC} strokeWidth={8} strokeLinecap="round" strokeDasharray="10 14" opacity={p} />
      </svg>
      <div style={{ position: "absolute", left: 385, top: 230, fontFamily: FONT, fontWeight: 800, fontSize: 34, color: LILAC, opacity: p }}>API</div>
      <div style={{ position: "absolute", left: 580, top: 220, width: 340, height: 160, borderRadius: 30, background: "#fff", boxShadow: "0 24px 50px rgba(0,0,0,.35)", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${bounce(f, t(13.96))})`, opacity: f >= t(13.96) ? 1 : 0 }}>
        <Img src={staticFile("siconfio/logo.png")} style={{ width: 280 }} />
      </div>
    </>
  );
};

// 4 — active verification at every moment
const MOMENTS: { d: string; l: string; at: number; bad?: boolean }[] = [
  { d: IC.building, l: "Alta de proveedor", at: t(18.66) },
  { d: IC.cart, l: "Orden de compra", at: t(20.64) },
  { d: IC.user, l: "Alta de cliente", at: t(22.44) },
  { d: IC.doc, l: "CFDI antes de pagar", at: t(25.86), bad: true },
];
const S4: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 30, display: "flex", justifyContent: "center", transform: `scale(${bounce(f, t(15.2))})` }}>
        <span style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: FONT, fontWeight: 800, fontSize: 40, color: "#fff" }}>
          <Icon d={IC.radar} size={46} color={LILAC} sw={2.4} /> Verificación activa
        </span>
      </div>
      <div style={{ position: "absolute", left: 60, right: 60, top: 120, display: "flex", flexDirection: "column", gap: 14 }}>
        {MOMENTS.map((m) => (
          <div key={m.l} style={{ display: "flex", alignItems: "center", gap: 18, background: "#fff", borderRadius: 20, padding: "12px 20px", transform: `scale(${bounce(f, m.at - 10)})`, opacity: f >= m.at - 10 ? 1 : 0 }}>
            <div style={{ width: 60, height: 60, borderRadius: 16, background: BLUE, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon d={m.d} size={34} color="#fff" sw={2.2} />
            </div>
            <span style={{ flex: 1, fontFamily: FONT, fontWeight: 700, fontSize: 34, color: NAVY }}>{m.l}</span>
            <Status bad={!!m.bad} at={m.at + 6} />
          </div>
        ))}
      </div>
    </>
  );
};

// 5 — so your client is never flagged as EFOS / EDOS
const S5: React.FC = () => {
  const f = useCurrentFrame();
  const tags = [
    { l: "EFOS", sub: "Empresa facturadora de operaciones ilícitas", at: t(31.32) },
    { l: "EDOS", sub: "Empresa deductora de operaciones ilícitas", at: t(35.04) },
  ];
  return (
    <>
      <Tile x={490} y={150} d={IC.shield} at={t(27.32)} label="Cliente blindado" size={140} />
      <div style={{ position: "absolute", left: 60, right: 60, top: 330, display: "flex", flexDirection: "column", gap: 16 }}>
        {tags.map((g) => (
          <div key={g.l} style={{ display: "flex", alignItems: "center", gap: 18, background: "rgba(255,255,255,.1)", border: "2px solid rgba(255,255,255,.3)", borderRadius: 20, padding: "12px 20px", transform: `scale(${bounce(f, g.at)})`, opacity: f >= g.at ? 1 : 0 }}>
            <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: RED, textDecoration: "line-through", width: 120 }}>{g.l}</span>
            <span style={{ flex: 1, fontFamily: FONT, fontWeight: 600, fontSize: 26, color: "#fff", lineHeight: 1.15 }}>{g.sub}</span>
            <Icon d={IC.check} size={40} color={GREEN} sw={3.4} />
          </div>
        ))}
      </div>
    </>
  );
};

// 6 — create a free account and try it
const S6: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 30 }}>
      <div style={{ background: "#fff", borderRadius: 30, padding: "24px 40px", transform: `scale(${bounce(f, t(37.5))})` }}>
        <Img src={staticFile("siconfio/logo.png")} style={{ width: 460, display: "block" }} />
      </div>
      <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 46, color: NAVY, background: LILAC, borderRadius: 18, padding: "10px 34px", transform: `scale(${bounce(f, t(38.06))})`, opacity: f >= t(38.06) ? 1 : 0 }}>Crea tu cuenta gratis →</span>
    </div>
  );
};

const SCENES: { from: number; to: number; C: React.FC }[] = [
  { from: 0.1, to: 5.66, C: S1 },
  { from: 5.66, to: 12.08, C: S2 },
  { from: 12.08, to: 14.5, C: S3 },
  { from: 14.5, to: 26.4, C: S4 },
  { from: 26.4, to: 37.42, C: S5 },
  { from: 37.42, to: 40, C: S6 },
];

const Stage: React.FC = () => {
  const f = useCurrentFrame();
  const enter = spring({ frame: f, fps: 30, config: { damping: 200 }, durationInFrames: 14 });
  return (
    <div style={{ position: "absolute", left: 50, top: 150, width: 980, height: 730, borderRadius: 48, overflow: "hidden", background: `linear-gradient(155deg, #2F6DB5 0%, ${BLUE} 55%, ${NAVY} 100%)`, boxShadow: "0 30px 70px rgba(10,6,90,.4)", opacity: enter, transform: `translateY(${(1 - enter) * -40}px)` }}>
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
export const Siconfio2Video: React.FC = () => {
  const [handle] = useState(() => delayRender("Loading fonts"));
  useEffect(() => {
    fontsLoaded.then(() => continueRender(handle));
  }, [handle]);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Reframed />
      <Audio src={staticFile("music/siconfio2.wav")} volume={0.035} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 40, display: "flex", justifyContent: "center" }}>
        <div style={{ background: "rgba(255,255,255,.96)", borderRadius: 999, padding: "14px 32px", boxShadow: "0 10px 26px rgba(10,8,60,.2)" }}>
          <Img src={staticFile("siconfio/logo.png")} style={{ height: 58, display: "block" }} />
        </div>
      </div>
      <Stage />
      <Subtitles />
    </AbsoluteFill>
  );
};
