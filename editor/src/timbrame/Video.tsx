// Timbrame — talking-head edit with the layout flipped: a persistent blue
// "stage" at the top holds very visual, few-word diagrams, and the subtitles
// sit at the bottom. The clip plays at 1.2× and is reframed (scaled around
// the face and lowered) so the stage covers only the ceiling. Look from the
// Timbrame identity: electric blue #1158F0, navy #262467, white glass tiles
// joined by thin lines, heavy Barlow.
import { loadFont } from "@remotion/fonts";
import React, { useEffect, useState } from "react";
import { AbsoluteFill, Audio, continueRender, delayRender, Easing, Img, interpolate, OffthreadVideo, spring, staticFile, useCurrentFrame } from "remotion";

export const TIMBRAME_DURATION = 1064; // 35.45 s at 30 fps
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

/* ---------- reframing: face lowered so the top becomes the stage ---------- */
const FACE = { x: 620, y: 900 };
const TARGET = { x: 560, y: 1130 };
const BASE = 1.3;
const PUSHES = [5.9, 9.46, 21.8, 30.84]; // se cae · app.timbrame.mx · correo · cualquier computadora

const Reframed: React.FC = () => {
  const f = useCurrentFrame();
  let s = BASE;
  for (const p of PUSHES) {
    const a = t(p);
    s += 0.07 * interpolate(f, [a - 6, a + 10, a + 55, a + 75], [0, 1, 1, 0], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  }
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ transformOrigin: `${FACE.x}px ${FACE.y}px`, transform: `translate(${TARGET.x - FACE.x}px, ${TARGET.y - FACE.y}px) scale(${s})` }}>
        <OffthreadVideo src={staticFile("timbrame/video-1.2x.mp4")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------- subtitles (bottom) ---------- */
type W = [string, number];
const PAGES: { words: W[]; end: number }[] = [
  { words: [["¿Tienes", 0.86], ["una", 1.2], ["*empresa", 1.56], ["y", 2.08], ["actualmente", 2.32], ["estás", 2.8], ["*facturando", 3.06]], end: 3.35 },
  { words: [["en", 3.4], ["el", 3.48], ["*portal", 3.68], ["*del", 3.9], ["*SAT", 4.1], ["o", 4.48], ["en", 4.58], ["algún", 4.8], ["portal", 5.14], ["web", 5.42]], end: 5.6 },
  { words: [["que", 5.64], ["se", 5.76], ["*cae", 5.9], ["*a", 6.02], ["*cada", 6.18], ["*rato?", 6.36]], end: 7.0 },
  { words: [["Te", 7.08], ["invito", 7.22], ["a", 7.48], ["que", 7.56], ["crees", 7.74], ["una", 7.96], ["*cuenta", 8.16], ["*gratis", 8.54]], end: 9.0 },
  { words: [["en", 9.06], ["*app.timbrame.mx,", 9.46]], end: 11.75 },
  { words: [["donde", 11.82], ["podrás", 12.08], ["crear", 12.48], ["*catálogos", 12.76], ["de", 13.12], ["*clientes,", 13.28]], end: 13.95 },
  { words: [["catálogos", 14.04], ["de", 14.36], ["*productos,", 14.72], ["de", 15.16], ["*servicios,", 15.58]], end: 16.3 },
  { words: [["*facturar", 16.36], ["a", 16.68], ["partir", 16.86], ["de", 17.04], ["un", 17.08], ["*Excel,", 17.34]], end: 18.05 },
  { words: [["*programar", 18.1], ["*facturas", 18.44], ["*recurrentes", 18.8]], end: 20.6 },
  { words: [["y", 20.68], ["que", 20.68], ["todas", 20.96], ["las", 21.18], ["facturas", 21.38], ["les", 21.68], ["lleguen", 21.8], ["por", 22.06], ["*correo", 22.26], ["*electrónico", 22.44], ["a", 22.78], ["tus", 22.86], ["clientes", 23.12]], end: 24.0 },
  { words: [["y", 24.06], ["que", 24.12], ["tengas", 24.3], ["un", 24.54], ["*buscador", 24.66], ["para", 25.68], ["hacer", 25.84], ["*reportes,", 26.18], ["*descargas", 26.68]], end: 27.5 },
  { words: [["y", 27.58], ["que", 27.68], ["tengas", 27.86], ["la", 28.02], ["*información", 28.22], ["*a", 28.54], ["*la", 28.62], ["*mano", 28.82], ["cuando", 29.22], ["la", 29.34], ["necesites", 29.56]], end: 30.45 },
  { words: [["desde", 30.52], ["cualquier", 30.84], ["*computadora", 31.16], ["o", 31.62], ["*celular", 31.94], ["con", 32.42], ["internet.", 32.64]], end: 35.45 },
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
// 1 — the portal keeps going down
const S1: React.FC = () => {
  const f = useCurrentFrame();
  const fail = f >= t(5.9);
  const load = interpolate(f, [t(3.6), t(5.8)], [0.1, 0.72], clamp);
  const shake = fail ? Math.sin(f * 1.6) * interpolate(f, [t(5.9), t(6.6)], [10, 0], clamp) : 0;
  return (
    <>
      <div style={{ position: "absolute", left: 190, top: 120, width: 600, height: 400, borderRadius: 30, background: "rgba(255,255,255,.96)", boxShadow: "0 30px 60px rgba(4,30,120,.35)", transform: `translateX(${shake}px) scale(${bounce(f, t(1.0))})`, overflow: "hidden" }}>
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
      <Badge x={770} y={140} at={t(5.9)} ok={false} size={92} />
      <Word at={t(5.9)} y={570}>¿Otra vez?</Word>
    </>
  );
};

// 2 — create the free account
const S2: React.FC = () => {
  const f = useCurrentFrame();
  const url = "app.timbrame.mx";
  const typed = Math.round(interpolate(f, [t(9.4), t(10.4)], [0, url.length], clamp));
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 120, display: "flex", justifyContent: "center", transform: `scale(${bounce(f, t(7.2))})` }}>
        <Img src={staticFile("timbrame/logo-allwhite.png")} style={{ width: 640 }} />
      </div>
      <div style={{ position: "absolute", left: 130, right: 130, top: 430, display: "flex", alignItems: "center", gap: 14, background: "#fff", borderRadius: 999, padding: "20px 30px", boxShadow: "0 20px 44px rgba(4,30,120,.35)", transform: `scale(${bounce(f, t(9.0))})` }}>
        <Icon d={IC.search} size={40} color={BLUE} sw={2.6} />
        <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 48, color: NAVY }}>
          {url.slice(0, typed)}
          <span style={{ opacity: typed < url.length && f % 20 < 10 ? 1 : 0, color: BLUE }}>|</span>
        </span>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 590, display: "flex", justifyContent: "center", transform: `scale(${bounce(f, t(8.54))})` }}>
        <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 44, color: NAVY, background: GREEN, borderRadius: 16, padding: "8px 28px" }}>GRATIS</span>
      </div>
    </>
  );
};

// 3 — catalogues: hub with clients, products, services
const S3: React.FC = () => {
  const c = { x: 490, y: 330 };
  const items = [
    { x: 160, y: 200, d: IC.user, l: "Clientes", at: t(13.28) },
    { x: 820, y: 200, d: IC.box, l: "Productos", at: t(14.72) },
    { x: 490, y: 590, d: IC.tag, l: "Servicios", at: t(15.58) },
  ];
  return (
    <>
      {items.map((i) => <Line key={i.l} x1={c.x} y1={c.y} x2={i.x} y2={i.y} at={i.at - 6} />)}
      <Tile x={c.x} y={c.y} d={IC.doc} at={t(12.4)} size={190} />
      {items.map((i, k) => <Tile key={i.l} x={i.x} y={i.y - (k === 2 ? 30 : 0)} d={i.d} at={i.at} label={i.l} size={150} phase={k} />)}
    </>
  );
};

// 4 — Excel in, invoices out
const S4: React.FC = () => {
  const f = useCurrentFrame();
  const n = Math.round(interpolate(f, [t(17.3), t(18.0)], [0, 3], clamp));
  return (
    <>
      <Tile x={230} y={320} d={IC.sheet} at={t(16.4)} color="#1D9A5B" size={200} label="Excel" />
      <svg width={980} height={730} style={{ position: "absolute", left: 0, top: 0 }}>
        <path d="M360 320 L560 320 M530 290 L562 320 L530 350" stroke="#fff" strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={pop(f, t(17.0))} />
      </svg>
      {[0, 1, 2].map((k) => (k < n ? <Tile key={k} x={740 + k * 26} y={300 + k * 26} d={IC.doc} at={t(17.3) + k * 4} size={190} phase={0} /> : null))}
      <Word at={t(17.34)} y={560} size={56}>Muchas facturas, un archivo</Word>
    </>
  );
};

// 5 — recurring invoices
const S5: React.FC = () => {
  const f = useCurrentFrame();
  const spin = interpolate(f, [t(18.8), t(20.5)], [0, 360], clamp);
  return (
    <>
      <Tile x={490} y={300} d={IC.calendar} at={t(18.1)} size={230} />
      <div style={{ position: "absolute", left: 600, top: 150, transform: `rotate(${spin}deg) scale(${bounce(f, t(18.8))})` }}>
        <div style={{ width: 110, height: 110, borderRadius: 55, background: GREEN, border: "5px solid #fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon d={IC.repeat} size={62} color="#fff" sw={2.6} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 500, display: "flex", justifyContent: "center", gap: 22 }}>
        {["ENE", "FEB", "MAR", "ABR"].map((m, k) => (
          <span key={m} style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, color: NAVY, background: "#fff", borderRadius: 16, padding: "10px 20px", transform: `scale(${bounce(f, t(19.0) + k * 5)})`, display: "flex", alignItems: "center", gap: 8 }}>
            {m} <Icon d={IC.check} size={26} color={GREEN} sw={3.4} />
          </span>
        ))}
      </div>
    </>
  );
};

// 6 — invoices emailed to every client
const S6: React.FC = () => {
  const f = useCurrentFrame();
  const fly = interpolate(f, [t(21.4), t(22.2)], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const clients = [170, 490, 810];
  return (
    <>
      <div style={{ position: "absolute", left: 120 + fly * 240, top: 120 - fly * 10, transform: `scale(${(1 - fly * 0.5) * bounce(f, t(20.7))}) rotate(${-fly * 12}deg)`, opacity: 1 - fly * 0.9 }}>
        <Tile x={90} y={90} d={IC.doc} at={t(20.7)} size={160} />
      </div>
      <Tile x={490} y={200} d={IC.mail} at={t(21.6)} size={190} />
      {clients.map((x, k) => (
        <React.Fragment key={x}>
          <Line x1={490} y1={300} x2={x} y2={500} at={t(22.4) + k * 4} />
          <Tile x={x} y={540} d={IC.user} at={t(22.8) + k * 4} size={130} phase={k} />
          <Badge x={x + 50} y={490} at={t(23.12) + k * 4} />
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
      <div style={{ position: "absolute", left: 110, right: 110, top: 110, display: "flex", alignItems: "center", gap: 16, background: "#fff", borderRadius: 999, padding: "22px 30px", boxShadow: "0 20px 44px rgba(4,30,120,.35)", transform: `scale(${bounce(f, t(24.66))})` }}>
        <Icon d={IC.search} size={48} color={BLUE} sw={2.6} />
        <div style={{ flex: 1, height: 16, borderRadius: 8, background: "#E1E8F7", overflow: "hidden" }}>
          <div style={{ width: `${interpolate(f, [t(24.8), t(25.6)], [0, 70], clamp)}%`, height: "100%", background: SKY }} />
        </div>
      </div>
      <Tile x={300} y={420} d={IC.chart} at={t(26.18)} size={180} label="Reportes" />
      <Tile x={680} y={420} d={IC.down} at={t(26.68)} size={180} label="Descargas" phase={1} />
    </>
  );
};

// 8 — available on computer and phone, then the close
const S8: React.FC = () => {
  const f = useCurrentFrame();
  const end = bounce(f, t(33.0));
  return f < t(33.0) ? (
    <>
      <Tile x={300} y={300} d={IC.laptop} at={t(31.16)} size={230} label="Computadora" />
      <Tile x={690} y={300} d={IC.phone} at={t(31.94)} size={230} label="Celular" phase={1} />
      <Word at={t(28.4)} y={20} size={58}>A la mano</Word>
    </>
  ) : (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 34, transform: `scale(${end})` }}>
      <Img src={staticFile("timbrame/logo-allwhite.png")} style={{ width: 620 }} />
      <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 50, color: NAVY, background: "#fff", borderRadius: 20, padding: "16px 36px", boxShadow: "0 20px 44px rgba(4,30,120,.35)" }}>Crea tu cuenta gratis →</span>
      <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: "#fff" }}>app.timbrame.mx</span>
    </div>
  );
};

const SCENES: { from: number; to: number; C: React.FC }[] = [
  { from: 0.8, to: 7.0, C: S1 },
  { from: 7.0, to: 11.8, C: S2 },
  { from: 11.8, to: 16.3, C: S3 },
  { from: 16.3, to: 18.05, C: S4 },
  { from: 18.05, to: 20.6, C: S5 },
  { from: 20.6, to: 24.0, C: S6 },
  { from: 24.0, to: 27.5, C: S7 },
  { from: 27.5, to: 36, C: S8 },
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
export const TimbrameVideo: React.FC = () => {
  const [handle] = useState(() => delayRender("Loading fonts"));
  useEffect(() => {
    fontsLoaded.then(() => continueRender(handle));
  }, [handle]);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Reframed />
      <Audio src={staticFile("music/timbrame.wav")} volume={0.035} />
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
