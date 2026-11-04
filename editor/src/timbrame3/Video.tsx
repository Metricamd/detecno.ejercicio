// Timbrame #3 — "¿Emprendiste…?" (facturación, sellos, asesoría). Same Timbrame look as
// the first edit (electric blue stage on top with white tiles, heavy Barlow,
// subtitles at the bottom) with the newer treatment: clip at 1.2× with the
// silences cut (public/timbrame3/video.mp4) and jump-cut zooms on every cut.
import { loadFont } from "@remotion/fonts";
import React, { useEffect, useState } from "react";
import { AbsoluteFill, Audio, continueRender, delayRender, Easing, Img, interpolate, OffthreadVideo, spring, staticFile, useCurrentFrame } from "remotion";

export const TIMBRAME3_DURATION = 740; // 24.66 s at 30 fps
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
const bounce = (f: number, at: number) => spring({ frame: f - at, fps: 30, config: { damping: 11, stiffness: 150 } });

/* ---------- reframing with jump-cut zooms on the silence cuts ---------- */
const FACE = { x: 460, y: 860 };
const TARGET = { x: 540, y: 1120 };
const CUTS = [0, 1.12, 5.88, 10.95, 17.56];

const Reframed: React.FC = () => {
  const f = useCurrentFrame();
  const sec = f / 30;
  let k = 0;
  while (k + 1 < CUTS.length && sec >= CUTS[k + 1]) k++;
  const s = (k % 2 ? 1.46 : 1.34) + Math.min(sec - CUTS[k], 6) * 0.006;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ transformOrigin: `${FACE.x}px ${FACE.y}px`, transform: `translate(${TARGET.x - FACE.x}px, ${TARGET.y - FACE.y}px) scale(${s})` }}>
        <OffthreadVideo src={staticFile("timbrame3/video.mp4")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------- subtitles (bottom) ---------- */
type W = [string, number];
const PAGES: { words: W[]; end: number }[] = [
  { words: [["*¿Emprendiste", 0.4]], end: 1.26 },
  { words: [["y", 1.32], ["te", 1.46], ["diste", 1.66], ["cuenta", 2.0], ["de", 2.52], ["que", 2.6], ["no", 2.68], ["solamente", 3.08], ["era", 3.32], ["*emprender,", 3.52]], end: 3.92 },
  { words: [["sino", 3.98], ["que", 4.14], ["tienes", 4.32], ["que", 4.48], ["*facturar", 4.7], ["*electrónicamente,", 5.08]], end: 5.82 },
  { words: [["que", 5.88], ["tienes", 6.12], ["que", 6.26], ["tramitar", 6.44], ["tus", 6.84], ["*sellos", 6.98], ["*digitales,", 7.36]], end: 7.78 },
  { words: [["que", 7.84], ["tienes", 8.08], ["que", 8.2], ["llevar", 8.38], ["una", 8.56], ["*contabilidad,", 8.78]], end: 9.62 },
  { words: [["que", 9.68], ["tienes", 9.86], ["que", 9.98], ["hacer", 10.1], ["*muchas", 10.3], ["*cosas?", 10.64]], end: 11.06 },
  { words: [["Te", 11.12], ["invito", 11.26], ["a", 11.5], ["crear", 11.68], ["una", 11.88], ["*cuenta", 12.06], ["*gratis", 12.46], ["en", 13.22], ["*app.timbrame.mx", 13.7]], end: 15.82 },
  { words: [["y", 15.88], ["que", 15.96], ["empieces", 16.1], ["a", 16.4], ["*facturar", 16.56], ["*electrónicamente.", 16.9]], end: 17.78 },
  { words: [["Si", 17.84], ["necesitas", 18.1], ["*ayuda", 18.66], ["con", 19.26], ["el", 19.4], ["trámite", 19.5], ["de", 19.84], ["tus", 19.94], ["*sellos,", 20.22]], end: 20.66 },
  { words: [["con", 20.72], ["alguna", 20.98], ["*asesoría", 21.12], ["relacionada", 21.7], ["con", 22.32], ["tu", 22.38], ["*cumplimiento", 22.62], ["*fiscal,", 23.14]], end: 23.92 },
  { words: [["estamos", 23.98], ["a", 24.12], ["tus", 24.22], ["*órdenes.", 24.34]], end: 24.66 },
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
  key: "M15 7a4 4 0 1 0-3.5 6L4 20.5V23h3v-2h2v-2h2l1.5-1.5A4 4 0 0 0 15 7zM16 7h.01",
  chat: "M4 5h16v11H9l-5 4z",
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
// 1 — you started a business… and then came all the paperwork
const TODO = [
  { x: 190, y: 360, d: IC.doc, l: "Facturar", at: t(4.7) },
  { x: 490, y: 360, d: IC.key, l: "Sellos digitales", at: t(6.98) },
  { x: 790, y: 360, d: IC.chart, l: "Contabilidad", at: t(8.78) },
];
const S1: React.FC = () => {
  const f = useCurrentFrame();
  const many = f >= t(10.3);
  return (
    <>
      <Word at={t(0.4)} y={30} size={60}>¡Emprendiste!</Word>
      {TODO.map((i, k) => <Tile key={i.l} x={i.x} y={i.y} d={i.d} at={i.at} label={i.l} size={150} phase={k} />)}
      {many && <Word at={t(10.3)} y={600} size={46} color="#FFD27A">…y muchas cosas más</Word>}
    </>
  );
};

// 2 — create the free account
const S2: React.FC = () => {
  const f = useCurrentFrame();
  const url = "app.timbrame.mx";
  const typed = Math.round(interpolate(f, [t(13.7), t(14.9)], [0, url.length], clamp));
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 120, display: "flex", justifyContent: "center", transform: `scale(${bounce(f, t(11.2))})` }}>
        <Img src={staticFile("timbrame/logo-allwhite.png")} style={{ width: 640 }} />
      </div>
      <div style={{ position: "absolute", left: 130, right: 130, top: 430, display: "flex", alignItems: "center", gap: 14, background: "#fff", borderRadius: 999, padding: "20px 30px", boxShadow: "0 20px 44px rgba(4,30,120,.35)", transform: `scale(${bounce(f, t(13.22))})` }}>
        <Icon d={IC.search} size={40} color={BLUE} sw={2.6} />
        <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 48, color: NAVY }}>
          {url.slice(0, typed)}
          <span style={{ opacity: typed < url.length && f % 20 < 10 ? 1 : 0, color: BLUE }}>|</span>
        </span>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 590, display: "flex", justifyContent: "center", transform: `scale(${bounce(f, t(12.46))})` }}>
        <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 44, color: NAVY, background: GREEN, borderRadius: 16, padding: "8px 28px" }}>GRATIS</span>
      </div>
    </>
  );
};

// 3 — start invoicing: an invoice gets stamped
const S3: React.FC = () => {
  return (
    <>
      <Tile x={490} y={280} d={IC.doc} at={t(15.95)} size={230} />
      <Badge x={590} y={185} at={t(16.9)} size={80} />
      <Word at={t(16.56)} y={500} size={58}>Factura electrónica</Word>
    </>
  );
};

// 4 — help with your seals and tax advice: we're here for you
const S4: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      <Tile x={290} y={250} d={IC.key} at={t(20.22)} label="Trámite de sellos" size={170} />
      <Tile x={690} y={250} d={IC.chat} at={t(21.12)} label="Asesoría fiscal" size={170} phase={1} />
      {f >= t(23.98) && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 520, display: "flex", justifyContent: "center", transform: `scale(${bounce(f, t(23.98))})` }}>
          <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 46, color: NAVY, background: "#fff", borderRadius: 20, padding: "14px 34px", boxShadow: "0 20px 44px rgba(4,30,120,.35)" }}>Estamos a tus órdenes</span>
        </div>
      )}
    </>
  );
};

const SCENES: { from: number; to: number; C: React.FC }[] = [
  { from: 0.1, to: 11.08, C: S1 },
  { from: 11.08, to: 15.84, C: S2 },
  { from: 15.84, to: 17.8, C: S3 },
  { from: 17.8, to: 26, C: S4 },
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
export const Timbrame3Video: React.FC = () => {
  const [handle] = useState(() => delayRender("Loading fonts"));
  useEffect(() => {
    fontsLoaded.then(() => continueRender(handle));
  }, [handle]);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Reframed />
      <Audio src={staticFile("music/timbrame3.wav")} volume={0.035} />
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
