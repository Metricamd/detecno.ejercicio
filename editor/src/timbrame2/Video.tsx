// Timbrame #2 — "¿Eres un profesionista independiente…?". Same Timbrame look as
// the first edit (electric blue stage on top with white tiles, heavy Barlow,
// subtitles at the bottom) with the newer treatment: clip at 1.2× with the
// silences cut (public/timbrame2/video.mp4) and jump-cut zooms on every cut.
import { loadFont } from "@remotion/fonts";
import React, { useEffect, useState } from "react";
import { AbsoluteFill, Audio, continueRender, delayRender, Easing, Img, interpolate, OffthreadVideo, spring, staticFile, useCurrentFrame } from "remotion";

export const TIMBRAME2_DURATION = 1018; // 33.92 s at 30 fps
const BLUE = "#1158F0";
const NAVY = "#262467";
const SKY = "#8FB6FF";
const RED = "#F0506E";
const GREEN = "#22C58B";
const FONT = "Barlow";

const fontsLoaded = Promise.all(
  ["500", "600", "700", "800", "900"].map((w) => loadFont({ family: FONT, url: staticFile(`fonts/barlow-latin-${w}-normal.woff2`), weight: w })),
);

const t = (sec: number) => Math.round(sec * 30);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const pop = (f: number, at: number) => interpolate(f, [at, at + 8], [0, 1], clamp);
const bounce = (f: number, at: number) => spring({ frame: f - at, fps: 30, config: { damping: 11, stiffness: 150 } });

/* ---------- reframing with jump-cut zooms on the silence cuts ---------- */
const FACE = { x: 620, y: 900 };
const TARGET = { x: 560, y: 1130 };
const CUTS = [0, 8.711, 10.796, 14.945, 21.365, 23.783, 26.842];

const Reframed: React.FC = () => {
  const f = useCurrentFrame();
  const sec = f / 30;
  let k = 0;
  while (k + 1 < CUTS.length && sec >= CUTS[k + 1]) k++;
  const s = (k % 2 ? 1.42 : 1.3) + Math.min(sec - CUTS[k], 6) * 0.006;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ transformOrigin: `${FACE.x}px ${FACE.y}px`, transform: `translate(${TARGET.x - FACE.x}px, ${TARGET.y - FACE.y}px) scale(${s})` }}>
        <OffthreadVideo src={staticFile("timbrame2/video.mp4")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------- subtitles (bottom) ---------- */
type W = [string, number];
const PAGES: { words: W[]; end: number }[] = [
  { words: [["¿Eres", 0.24], ["un", 0.46], ["*profesionista", 0.64], ["*independiente", 1.26]], end: 2.1 },
  { words: [["y", 2.16], ["es", 2.28], ["una", 2.44], ["*pesadilla", 2.66], ["llegar", 3.66], ["a", 3.86], ["tu", 3.98], ["casa", 4.18], ["o", 4.36], ["a", 4.42], ["tu", 4.48], ["oficina", 4.6]], end: 4.88 },
  { words: [["y", 4.94], ["ponerte", 5.06], ["a", 5.3], ["*facturar", 5.44], ["electrónicamente", 5.84], ["en", 6.42], ["el", 6.5], ["*portal", 6.7], ["*del", 6.92], ["*SAT", 7.14]], end: 7.48 },
  { words: [["o", 7.54], ["en", 7.66], ["algún", 7.88], ["portal", 8.3], ["que", 8.94], ["*jala", 9.14], ["*a", 9.62], ["*veces", 9.8], ["y", 9.96], ["a", 10.08], ["veces", 10.28], ["*no?", 10.5]], end: 10.94 },
  { words: [["Te", 11.0], ["invito", 11.12], ["a", 11.34], ["crear", 11.44], ["una", 11.62], ["*cuenta", 11.82], ["*gratis", 12.2], ["en", 12.74], ["*app.timbrame.mx", 13.08]], end: 15.18 },
  { words: [["y", 15.24], ["que", 15.6], ["empieces", 15.76], ["a", 16.04], ["facturar", 16.2], ["con", 16.56], ["una", 16.72], ["*plataforma", 17.1], ["que", 17.32], ["tiene", 17.52]], end: 17.7 },
  { words: [["*catálogos", 17.76], ["de", 18.1], ["*clientes,", 18.3], ["catálogos", 19.02], ["de", 19.36], ["*productos,", 19.72], ["catálogos", 20.26], ["de", 20.62], ["*servicios,", 21.0]], end: 21.62 },
  { words: [["poder", 21.68], ["hacer", 21.88], ["*facturas", 22.12], ["*masivas", 22.46], ["a", 22.78], ["partir", 22.94], ["de", 23.1], ["un", 23.18], ["*Excel,", 23.42]], end: 24.08 },
  { words: [["enviar", 24.14], ["facturas", 24.56], ["electrónicamente", 24.92], ["a", 25.58], ["tus", 25.68], ["clientes", 25.96], ["por", 26.24], ["*correo", 26.48]], end: 27.1 },
  { words: [["y", 27.16], ["un", 27.48], ["*buscador", 27.66], ["para", 28.52], ["poder", 28.72], ["hacer", 28.9], ["*reportes,", 29.24], ["para", 29.98], ["ver", 30.1], ["cómo", 30.28], ["vas", 30.54]], end: 31.0 },
  { words: [["y", 31.06], ["poder", 31.26], ["*descargar", 31.92], ["los", 32.32], ["archivos", 32.5], ["cuando", 33.18], ["los", 33.32], ["necesites.", 33.54]], end: 33.92 },
];

const Subtitles: React.FC = () => {
  const f = useCurrentFrame();
  const sec = f / 30;
  const page = PAGES.find((p) => sec >= p.words[0][1] - 0.1 && sec < p.end);
  if (!page) return null;
  const start = t(page.words[0][1] - 0.1);
  const o = interpolate(f, [start, start + 4, t(page.end) - 3, t(page.end)], [0, 1, 1, 0], clamp);
  const sc = interpolate(f, [start, start + 6], [0.94, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });
  return (
    <div style={{ position: "absolute", left: 70, right: 70, top: 1640, display: "flex", justifyContent: "center", opacity: o, transform: `scale(${sc})` }}>
      <div style={{ background: "rgba(38,36,103,.9)", borderRadius: 22, padding: "16px 30px", maxWidth: 940, textAlign: "center", fontFamily: FONT, fontWeight: 700, fontSize: 48, lineHeight: 1.18, color: "#fff", boxShadow: "0 14px 34px rgba(0,0,0,.25)" }}>
        {page.words.map(([w, at], i) => {
          const key = w.startsWith("*");
          const on = sec >= at - 0.05;
          return (
            <React.Fragment key={i}>
              {i ? " " : ""}
              <span style={{ color: key ? SKY : "#fff", fontWeight: key ? 800 : 700, opacity: on ? 1 : 0.4 }}>{key ? w.slice(1) : w}</span>
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
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c0-4.4 3.6-8 8-8s8 3.6 8 8",
  box: "M12 3l8 4.5v9L12 21l-8-4.5v-9zM4 7.5l8 4.5 8-4.5M12 12v9",
  tag: "M3 12V4h8l10 10-8 8zM7.5 8.5h.01",
  gear: "M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1",
  doc: "M7 3h7l5 5v13H7zM14 3v5h5M10 12h6M10 16h6",
  sheet: "M4 4h16v16H4zM4 9h16M4 14h16M9 4v16",
  calendar: "M4 6h16v14H4zM4 10h16M8 3v4M16 3v4",
  repeat: "M17 2l4 4-4 4M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4M21 13v2a3 3 0 0 1-3 3H3",
  mail: "M3 6h18v12H3zM3 6l9 7 9-7",
  search: "M10.5 4a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM15.5 15.5L20 20",
  chart: "M4 20V10M10 20V4M16 20v-7M22 20H2",
  down: "M12 4v11M7 10l5 5 5-5M5 20h14",
  check: "M5 12.5l4.5 4.5L19 7.5",
  x: "M6 6l12 12M18 6L6 18",
  laptop: "M5 5h14v10H5zM2 19h20",
  phone: "M8 2h8a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zM11 18h2",
  home: "M3 11l9-7 9 7M5 10v10h14V10M10 20v-6h4v6",
  office: "M3 21h18M5 21V9l7-5 7 5v12M9 21v-6h6v6M9 11h.01M15 11h.01",
  wifi: "M2 8.5a15 15 0 0 1 20 0M5 12a10 10 0 0 1 14 0M8.5 15.5a5 5 0 0 1 7 0M12 19h.01",
};

// a frosted white tile with a blue icon, popping in with a bounce and floating
const Tile: React.FC<{ x: number; y: number; size?: number; d: string; at: number; label?: string; color?: string; phase?: number }> = ({ x, y, size = 170, d, at, label, color = BLUE, phase = 0 }) => {
  const f = useCurrentFrame();
  const b = bounce(f, at);
  if (f < at) return null;
  const bob = Math.sin((f - at) / 14 + phase) * 6;
  return (
    <div style={{ position: "absolute", left: x - size / 2, top: y - size / 2 + bob, width: size, transform: `scale(${b})`, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      <div style={{ width: size, height: size, borderRadius: size * 0.24, background: "linear-gradient(150deg, rgba(255,255,255,.98), rgba(225,236,255,.9))", border: "2px solid rgba(255,255,255,.9)", boxShadow: "0 24px 44px rgba(4,30,120,.35), inset 0 -6px 14px rgba(17,88,240,.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon d={d} size={size * 0.48} color={color} sw={2.2} />
      </div>
      {label && <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, color: "#fff", whiteSpace: "nowrap", textShadow: "0 4px 14px rgba(4,30,120,.4)" }}>{label}</span>}
    </div>
  );
};

// thin connector line that draws itself
const Line: React.FC<{ x1: number; y1: number; x2: number; y2: number; at: number }> = ({ x1, y1, x2, y2, at }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [at, at + 10], [0, 1], clamp);
  return (
    <svg width={980} height={730} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <line x1={x1} y1={y1} x2={x1 + (x2 - x1) * p} y2={y1 + (y2 - y1) * p} stroke="rgba(255,255,255,.75)" strokeWidth={4} strokeLinecap="round" strokeDasharray="2 12" />
    </svg>
  );
};

const Badge: React.FC<{ x: number; y: number; at: number; ok?: boolean; size?: number }> = ({ x, y, at, ok = true, size = 58 }) => {
  const f = useCurrentFrame();
  const b = bounce(f, at);
  if (f < at) return null;
  return (
    <div style={{ position: "absolute", left: x - size / 2, top: y - size / 2, width: size, height: size, borderRadius: size / 2, background: ok ? GREEN : RED, border: "4px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${b})`, boxShadow: "0 8px 18px rgba(0,0,0,.2)" }}>
      <Icon d={ok ? IC.check : IC.x} size={size * 0.55} color="#fff" sw={3.4} />
    </div>
  );
};

const Word: React.FC<{ children: React.ReactNode; at: number; y?: number; size?: number; color?: string }> = ({ children, at, y = 640, size = 64, color = "#fff" }) => {
  const f = useCurrentFrame();
  const b = bounce(f, at);
  if (f < at) return null;
  return <div style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: size, color, letterSpacing: "-0.01em", transform: `scale(${b})`, textShadow: "0 6px 18px rgba(4,30,120,.35)" }}>{children}</div>;
};

/* ---------- scenes (inside the 980×730 stage) ---------- */
// 1 — freelancer: invoicing at home or at the office is a nightmare
const S1: React.FC = () => (
  <>
    <Tile x={490} y={190} d={IC.user} at={t(0.64)} size={180} label="Independiente" />
    <Word at={t(2.66)} y={20} size={56}>Una pesadilla</Word>
    <Tile x={290} y={500} d={IC.home} at={t(4.18)} size={130} label="Casa" phase={1} />
    <Tile x={690} y={500} d={IC.office} at={t(4.6)} size={130} label="Oficina" phase={2} />
  </>
);

// 2 — the portal that works only sometimes
const S2: React.FC = () => {
  const f = useCurrentFrame();
  const fail = f >= t(10.28);
  const load = interpolate(f, [t(6.7), t(9.6)], [0.1, 0.72], clamp);
  const shake = fail ? Math.sin(f * 1.6) * interpolate(f, [t(10.28), t(10.9)], [10, 0], clamp) : 0;
  return (
    <>
      <div style={{ position: "absolute", left: 190, top: 110, width: 600, height: 400, borderRadius: 30, background: "rgba(255,255,255,.96)", boxShadow: "0 30px 60px rgba(4,30,120,.35)", transform: `translateX(${shake}px) scale(${bounce(f, t(5.5))})`, overflow: "hidden" }}>
        <div style={{ height: 60, background: "#E7EEFD", display: "flex", alignItems: "center", gap: 10, padding: "0 22px" }}>
          {["#FF6B6B", "#F7C948", "#3DDC97"].map((c) => <span key={c} style={{ width: 16, height: 16, borderRadius: 8, background: c }} />)}
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 340, gap: 26 }}>
          <Icon d={IC.wifi} size={130} color={fail ? RED : BLUE} sw={2.2} />
          <div style={{ width: 380, height: 18, borderRadius: 9, background: "#E1E8F7", overflow: "hidden" }}>
            <div style={{ width: `${load * 100}%`, height: "100%", background: fail ? RED : BLUE }} />
          </div>
        </div>
      </div>
      <Badge x={770} y={130} at={t(10.28)} ok={false} size={92} />
      <Word at={t(9.14)} y={560}>A veces sí, a veces no</Word>
    </>
  );
};

// 3 — create the free account
const S3: React.FC = () => {
  const f = useCurrentFrame();
  const url = "app.timbrame.mx";
  const typed = Math.round(interpolate(f, [t(13.08), t(14.3)], [0, url.length], clamp));
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 120, display: "flex", justifyContent: "center", transform: `scale(${bounce(f, t(11.0))})` }}>
        <Img src={staticFile("timbrame/logo-allwhite.png")} style={{ width: 640 }} />
      </div>
      <div style={{ position: "absolute", left: 130, right: 130, top: 430, display: "flex", alignItems: "center", gap: 14, background: "#fff", borderRadius: 999, padding: "20px 30px", boxShadow: "0 20px 44px rgba(4,30,120,.35)", transform: `scale(${bounce(f, t(12.74))})` }}>
        <Icon d={IC.search} size={40} color={BLUE} sw={2.6} />
        <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 48, color: NAVY }}>
          {url.slice(0, typed)}
          <span style={{ opacity: typed < url.length && f % 20 < 10 ? 1 : 0, color: BLUE }}>|</span>
        </span>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 590, display: "flex", justifyContent: "center", transform: `scale(${bounce(f, t(12.2))})` }}>
        <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 44, color: NAVY, background: GREEN, borderRadius: 16, padding: "8px 28px" }}>GRATIS</span>
      </div>
    </>
  );
};

// 4 — catalogues: hub with clients, products, services
const S4: React.FC = () => {
  const c = { x: 490, y: 330 };
  const items = [
    { x: 160, y: 200, d: IC.user, l: "Clientes", at: t(18.3) },
    { x: 820, y: 200, d: IC.box, l: "Productos", at: t(19.72) },
    { x: 490, y: 590, d: IC.tag, l: "Servicios", at: t(21.0) },
  ];
  return (
    <>
      {items.map((i) => <Line key={i.l} x1={c.x} y1={c.y} x2={i.x} y2={i.y} at={i.at - 6} />)}
      <Tile x={c.x} y={c.y} d={IC.doc} at={t(16.2)} size={190} />
      {items.map((i, k) => <Tile key={i.l} x={i.x} y={i.y - (k === 2 ? 30 : 0)} d={i.d} at={i.at} label={i.l} size={150} phase={k} />)}
    </>
  );
};

// 5 — bulk invoices from an Excel
const S5: React.FC = () => {
  const f = useCurrentFrame();
  const n = Math.round(interpolate(f, [t(22.46), t(23.2)], [0, 3], clamp));
  return (
    <>
      <Tile x={230} y={320} d={IC.sheet} at={t(21.7)} color="#1D9A5B" size={200} label="Excel" />
      <svg width={980} height={730} style={{ position: "absolute", left: 0, top: 0 }}>
        <path d="M360 320 L560 320 M530 290 L562 320 L530 350" stroke="#fff" strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={pop(f, t(22.12))} />
      </svg>
      {[0, 1, 2].map((k) => (k < n ? <Tile key={k} x={740 + k * 26} y={300 + k * 26} d={IC.doc} at={t(22.46) + k * 4} size={190} phase={0} /> : null))}
      <Word at={t(22.46)} y={560} size={56}>Facturas masivas</Word>
    </>
  );
};

// 6 — invoices emailed to every client
const S6: React.FC = () => {
  const f = useCurrentFrame();
  const fly = interpolate(f, [t(24.56), t(25.3)], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const clients = [170, 490, 810];
  return (
    <>
      <div style={{ position: "absolute", left: 120 + fly * 240, top: 120 - fly * 10, transform: `scale(${(1 - fly * 0.5) * bounce(f, t(24.14))}) rotate(${-fly * 12}deg)`, opacity: 1 - fly * 0.9 }}>
        <Tile x={90} y={90} d={IC.doc} at={t(24.14)} size={160} />
      </div>
      <Tile x={490} y={200} d={IC.mail} at={t(24.92)} size={190} />
      {clients.map((x, k) => (
        <React.Fragment key={x}>
          <Line x1={490} y1={300} x2={x} y2={500} at={t(25.6) + k * 4} />
          <Tile x={x} y={540} d={IC.user} at={t(25.96) + k * 4} size={130} phase={k} />
          <Badge x={x + 50} y={490} at={t(26.48) + k * 4} />
        </React.Fragment>
      ))}
    </>
  );
};

// 7 — search, reports and downloads
const S7: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      <div style={{ position: "absolute", left: 110, right: 110, top: 110, display: "flex", alignItems: "center", gap: 16, background: "#fff", borderRadius: 999, padding: "22px 30px", boxShadow: "0 20px 44px rgba(4,30,120,.35)", transform: `scale(${bounce(f, t(27.66))})` }}>
        <Icon d={IC.search} size={48} color={BLUE} sw={2.6} />
        <div style={{ flex: 1, height: 16, borderRadius: 8, background: "#E1E8F7", overflow: "hidden" }}>
          <div style={{ width: `${interpolate(f, [t(27.8), t(28.6)], [0, 70], clamp)}%`, height: "100%", background: SKY }} />
        </div>
      </div>
      <Tile x={300} y={420} d={IC.chart} at={t(29.24)} size={180} label="Reportes" />
      <Tile x={680} y={420} d={IC.down} at={t(31.92)} size={180} label="Descargas" phase={1} />
    </>
  );
};

// 8 — close
const S8: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 34, transform: `scale(${bounce(f, t(32.9))})` }}>
      <Img src={staticFile("timbrame/logo-allwhite.png")} style={{ width: 620 }} />
      <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 50, color: NAVY, background: "#fff", borderRadius: 20, padding: "16px 36px", boxShadow: "0 20px 44px rgba(4,30,120,.35)" }}>Crea tu cuenta gratis →</span>
      <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: "#fff" }}>app.timbrame.mx</span>
    </div>
  );
};

const SCENES: { from: number; to: number; C: React.FC }[] = [
  { from: 0.1, to: 5.4, C: S1 },
  { from: 5.4, to: 10.96, C: S2 },
  { from: 10.96, to: 15.2, C: S3 },
  { from: 15.2, to: 21.64, C: S4 },
  { from: 21.64, to: 24.1, C: S5 },
  { from: 24.1, to: 27.12, C: S6 },
  { from: 27.12, to: 32.85, C: S7 },
  { from: 32.85, to: 35, C: S8 },
];

const Stage: React.FC = () => {
  const f = useCurrentFrame();
  const enter = spring({ frame: f - 6, fps: 30, config: { damping: 200 }, durationInFrames: 16 });
  return (
    <div style={{ position: "absolute", left: 50, top: 150, width: 980, height: 730, borderRadius: 44, overflow: "hidden", background: `radial-gradient(120% 90% at 50% 0%, #3D7BFF 0%, ${BLUE} 55%, #0A45C9 100%)`, boxShadow: "0 30px 70px rgba(4,30,120,.4)", opacity: enter, transform: `translateY(${(1 - enter) * -40}px)` }}>
      {/* soft orbit arcs echoing the logo */}
      <svg width={980} height={730} style={{ position: "absolute", inset: 0, opacity: 0.18 }}>
        <path d="M120 140 A 470 470 0 0 1 860 140" stroke="#fff" strokeWidth={10} fill="none" strokeLinecap="round" />
        <path d="M120 620 A 470 470 0 0 0 860 620" stroke="#fff" strokeWidth={10} fill="none" strokeLinecap="round" />
      </svg>
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
export const Timbrame2Video: React.FC = () => {
  const [handle] = useState(() => delayRender("Loading fonts"));
  useEffect(() => {
    fontsLoaded.then(() => continueRender(handle));
  }, [handle]);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Reframed />
      <Audio src={staticFile("music/timbrame2.wav")} volume={0.035} />
      {/* logo */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 40, display: "flex", justifyContent: "center" }}>
        <div style={{ background: "rgba(255,255,255,.96)", borderRadius: 999, padding: "12px 30px", boxShadow: "0 10px 26px rgba(4,30,120,.2)" }}>
          <Img src={staticFile("timbrame/logo.png")} style={{ height: 62, display: "block" }} />
        </div>
      </div>
      <Stage />
      <Subtitles />
    </AbsoluteFill>
  );
};
