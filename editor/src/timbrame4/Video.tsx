// Timbrame #4 — "¿Eres agente de seguros…?". Same Timbrame look as
// the first edit (electric blue stage on top with white tiles, heavy Barlow,
// subtitles at the bottom) with the newer treatment: clip at 1.2× with the
// silences cut (public/timbrame4/video.mp4) and jump-cut zooms on every cut.
import { loadFont } from "@remotion/fonts";
import React, { useEffect, useState } from "react";
import { AbsoluteFill, Audio, continueRender, delayRender, Easing, Img, interpolate, OffthreadVideo, spring, staticFile, useCurrentFrame } from "remotion";

export const TIMBRAME4_DURATION = 634; // 21.14 s at 30 fps
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
const FACE = { x: 500, y: 880 };
const TARGET = { x: 540, y: 1130 };
const CUTS = [0, 7.34, 11.37, 14.84, 18.64]; // silence cuts + phrase starts

const Reframed: React.FC = () => {
  const f = useCurrentFrame();
  const sec = f / 30;
  let k = 0;
  while (k + 1 < CUTS.length && sec >= CUTS[k + 1]) k++;
  const s = (k % 2 ? 1.44 : 1.32) + Math.min(sec - CUTS[k], 6) * 0.006;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ transformOrigin: `${FACE.x}px ${FACE.y}px`, transform: `translate(${TARGET.x - FACE.x}px, ${TARGET.y - FACE.y}px) scale(${s})` }}>
        <OffthreadVideo src={staticFile("timbrame4/video.mp4")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------- subtitles (bottom) ---------- */
type W = [string, number];
const PAGES: { words: W[]; end: number }[] = [
  { words: [["¿Eres", 0.24], ["*agente", 0.48], ["*de", 0.84], ["*seguros", 1.06]], end: 1.78 },
  { words: [["y", 1.84], ["lo", 2.0], ["que", 2.12], ["quieres", 2.36], ["es", 2.54], ["enfocarte", 2.78], ["en", 3.66], ["*vender", 3.86], ["*más", 4.1], ["*pólizas", 4.34]], end: 4.74 },
  { words: [["y", 4.8], ["no", 4.92], ["perder", 5.12], ["tu", 5.32], ["*tiempo", 5.56], ["facturando", 5.8], ["electrónicamente?", 6.1]], end: 7.34 },
  { words: [["Te", 7.4], ["invito", 7.52], ["a", 7.72], ["crear", 7.86], ["una", 8.04], ["*cuenta", 8.26], ["*gratis", 8.6], ["en", 8.94], ["*app.timbrame.mx,", 9.3]], end: 11.5 },
  { words: [["donde", 11.56], ["podrás", 11.84], ["hacer", 12.3], ["*facturación", 13.04], ["*masiva", 13.48], ["a", 13.7], ["partir", 13.84], ["de", 13.98], ["un", 14.06], ["*Excel,", 14.32]], end: 14.78 },
  { words: [["*facturación", 14.84], ["*recurrente", 15.42], ["*programada", 16.24], ["de", 16.68], ["algunas", 16.86], ["facturas", 17.12], ["en", 17.34], ["específico", 17.58]], end: 18.58 },
  { words: [["y", 18.64], ["tener", 19.0], ["un", 19.54], ["*envío", 19.72], ["*automático", 20.08], ["a", 20.48], ["tus", 20.54], ["clientes.", 20.76]], end: 21.14 },
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
  shield: "M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z",
  clock: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3 2",
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
// 1 — insurance agent: sell more policies, don't lose time invoicing
const S1: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      <Tile x={490} y={170} d={IC.shield} at={t(0.48)} size={170} label="Agente de seguros" />
      {f >= t(3.86) && <Tile x={290} y={480} d={IC.doc} at={t(3.86)} size={140} label="Más pólizas" />}
      <Badge x={345} y={425} at={t(4.34)} />
      {f >= t(5.56) && <Tile x={690} y={480} d={IC.clock} at={t(5.56)} size={140} label="Tiempo facturando" phase={1} />}
      <Badge x={745} y={425} at={t(6.1)} ok={false} />
    </>
  );
};

// 2 — create the free account
const S2: React.FC = () => {
  const f = useCurrentFrame();
  const url = "app.timbrame.mx";
  const typed = Math.round(interpolate(f, [t(9.3), t(10.6)], [0, url.length], clamp));
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 120, display: "flex", justifyContent: "center", transform: `scale(${bounce(f, t(7.5))})` }}>
        <Img src={staticFile("timbrame/logo-allwhite.png")} style={{ width: 640 }} />
      </div>
      <div style={{ position: "absolute", left: 130, right: 130, top: 430, display: "flex", alignItems: "center", gap: 14, background: "#fff", borderRadius: 999, padding: "20px 30px", boxShadow: "0 20px 44px rgba(4,30,120,.35)", transform: `scale(${bounce(f, t(8.94))})` }}>
        <Icon d={IC.search} size={40} color={BLUE} sw={2.6} />
        <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 48, color: NAVY }}>
          {url.slice(0, typed)}
          <span style={{ opacity: typed < url.length && f % 20 < 10 ? 1 : 0, color: BLUE }}>|</span>
        </span>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 590, display: "flex", justifyContent: "center", transform: `scale(${bounce(f, t(8.6))})` }}>
        <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 44, color: NAVY, background: GREEN, borderRadius: 16, padding: "8px 28px" }}>GRATIS</span>
      </div>
    </>
  );
};

// 3 — bulk invoices from an Excel
const S3: React.FC = () => {
  const f = useCurrentFrame();
  const n = Math.round(interpolate(f, [t(13.48), t(14.2)], [0, 3], clamp));
  return (
    <>
      <Tile x={230} y={320} d={IC.sheet} at={t(11.7)} color="#1D9A5B" size={200} label="Excel" />
      <svg width={980} height={730} style={{ position: "absolute", left: 0, top: 0 }}>
        <path d="M360 320 L560 320 M530 290 L562 320 L530 350" stroke="#fff" strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={pop(f, t(13.04))} />
      </svg>
      {[0, 1, 2].map((k) => (k < n ? <Tile key={k} x={740 + k * 26} y={300 + k * 26} d={IC.doc} at={t(13.48) + k * 4} size={190} phase={0} /> : null))}
      <Word at={t(13.04)} y={560} size={56}>Facturación masiva</Word>
    </>
  );
};

// 4 — scheduled recurring invoices
const S4: React.FC = () => {
  const f = useCurrentFrame();
  const spin = interpolate(f, [t(15.42), t(17.4)], [0, 360], clamp);
  return (
    <>
      <Tile x={490} y={260} d={IC.calendar} at={t(14.9)} size={230} />
      <div style={{ position: "absolute", left: 600, top: 110, transform: `rotate(${spin}deg) scale(${bounce(f, t(15.42))})` }}>
        <div style={{ width: 110, height: 110, borderRadius: 55, background: GREEN, border: "5px solid #fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon d={IC.repeat} size={62} color="#fff" sw={2.6} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 490, display: "flex", justifyContent: "center", gap: 22 }}>
        {["ENE", "FEB", "MAR", "ABR"].map((m, k) => (
          <span key={m} style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, color: NAVY, background: "#fff", borderRadius: 16, padding: "10px 20px", transform: `scale(${bounce(f, t(16.24) + k * 5)})`, display: "flex", alignItems: "center", gap: 8 }}>
            {m} <Icon d={IC.check} size={26} color={GREEN} sw={3.4} />
          </span>
        ))}
      </div>
    </>
  );
};

// 5 — automatic delivery to every client
const S5: React.FC = () => {
  const clients = [170, 490, 810];
  return (
    <>
      <Tile x={490} y={190} d={IC.mail} at={t(19.0)} size={190} label="Envío automático" />
      {clients.map((x, k) => (
        <React.Fragment key={x}>
          <Line x1={490} y1={320} x2={x} y2={500} at={t(19.9) + k * 4} />
          <Tile x={x} y={550} d={IC.user} at={t(20.08) + k * 4} size={120} phase={k} />
          <Badge x={x + 48} y={500} at={t(20.4) + k * 4} />
        </React.Fragment>
      ))}
    </>
  );
};

const SCENES: { from: number; to: number; C: React.FC }[] = [
  { from: 0.1, to: 7.36, C: S1 },
  { from: 7.36, to: 11.52, C: S2 },
  { from: 11.52, to: 14.8, C: S3 },
  { from: 14.8, to: 18.62, C: S4 },
  { from: 18.62, to: 22, C: S5 },
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
export const Timbrame4Video: React.FC = () => {
  const [handle] = useState(() => delayRender("Loading fonts"));
  useEffect(() => {
    fontsLoaded.then(() => continueRender(handle));
  }, [handle]);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Reframed />
      <Audio src={staticFile("music/timbrame4.wav")} volume={0.035} />
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
