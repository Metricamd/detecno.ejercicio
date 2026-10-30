// doc2sign #3 — "…firmar con la FIEL, un certificado PSC, trazos o biometría".
// Same brand line as the first
// doc2sign edit (electric blue #2A1CE3, navy #17156C, lilac accents, white
// cards, Poppins, logo without ®) on the newer layout: clip at 1.2× with the
// silences cut (public/doc2sign3/video.mp4), reframed with jump-cut zooms,
// visual diagrams on a blue stage at the top and subtitles at the bottom.
import React, { useEffect, useState } from "react";
import { AbsoluteFill, Audio, continueRender, delayRender, Easing, Img, interpolate, OffthreadVideo, spring, staticFile, useCurrentFrame } from "remotion";
import { FONT, fontsLoaded } from "../fispal/theme";

export const DOC2SIGN3_DURATION = 1076; // 35.85 s at 30 fps
const BLUE = "#2A1CE3";
const NAVY = "#17156C";
const LILAC = "#B8B2FF";
const RED = "#F0506E";
const GREEN = "#12B886";
const AMBER = "#F2A019";

const t = (sec: number) => Math.round(sec * 30);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const bounce = (f: number, at: number) => spring({ frame: f - at, fps: 30, config: { damping: 11, stiffness: 150 } });

/* ---------- reframing with jump-cut zooms on the silence cuts ---------- */
const FACE = { x: 540, y: 920 };
const TARGET = { x: 540, y: 1180 };
const CUTS = [0, 1.45, 9.5, 13.269, 22.442, 25.806, 29.993, 35.081];

const Reframed: React.FC = () => {
  const f = useCurrentFrame();
  const sec = f / 30;
  let k = 0;
  while (k + 1 < CUTS.length && sec >= CUTS[k + 1]) k++;
  const s = (k % 2 ? 1.42 : 1.3) + Math.min(sec - CUTS[k], 6) * 0.006;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ transformOrigin: `${FACE.x}px ${FACE.y}px`, transform: `translate(${TARGET.x - FACE.x}px, ${TARGET.y - FACE.y}px) scale(${s})` }}>
        <OffthreadVideo src={staticFile("doc2sign3/video.mp4")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------- subtitles (bottom) ---------- */
type W = [string, number];
const PAGES: { words: W[]; end: number }[] = [
  { words: [["¿Eres", 0.26], ["*abogado", 0.42], ["de", 0.74], ["una", 0.82], ["empresa", 1.12]], end: 1.65 },
  { words: [["y", 1.7], ["has", 1.86], ["visto", 2.12], ["que", 2.34], ["muchos", 2.62], ["procesos", 2.98], ["en", 3.26], ["la", 3.32], ["organización", 3.5]], end: 4.22 },
  { words: [["se", 4.28], ["han", 4.38], ["venido", 4.5], ["*digitalizando,", 4.92]], end: 5.8 },
  { words: [["desde", 5.86], ["procesos", 6.14], ["*logísticos,", 6.46], ["procesos", 7.4], ["*financieros,", 7.84], ["procesos", 8.46], ["*contables?", 8.9]], end: 9.68 },
  { words: [["Pero", 9.74], ["cuando", 9.94], ["hablamos", 10.08], ["de", 10.38], ["*contratos,", 10.66], ["seguimos", 11.54], ["firmando", 11.94], ["*a", 12.38], ["*puño", 12.5], ["*y", 12.64], ["*letra.", 12.8]], end: 13.4 },
  { words: [["Te", 13.46], ["invito", 13.6], ["a", 14.16], ["crear", 14.68], ["una", 14.88], ["*cuenta", 15.08], ["*gratis", 15.42], ["en", 16.02], ["*doc2sign.com,", 16.36]], end: 18.08 },
  { words: [["doc,", 18.14], ["el", 18.32], ["número", 18.48], ["*2,", 18.8], ["sign,", 19.12]], end: 19.88 },
  { words: [["la", 19.94], ["plataforma", 20.34], ["que", 20.82], ["además", 21.16], ["de", 21.32], ["tener", 21.54], ["el", 21.68], ["*respaldo", 21.9], ["*de", 22.76], ["*Economía", 23.02]], end: 23.4 },
  { words: [["como", 23.44], ["*prestador", 23.74], ["*de", 24.36], ["*servicios", 24.7], ["*de", 24.86], ["*certificación,", 25.04]], end: 25.95 },
  { words: [["te", 26.02], ["permite", 26.3], ["firmar", 26.58], ["ya", 27.1], ["sea", 27.22], ["con", 27.36], ["la", 27.48], ["*FIEL", 27.58], ["del", 27.74], ["SAT,", 27.96]], end: 28.55 },
  { words: [["con", 28.62], ["un", 28.76], ["*certificado", 28.98], ["*PSC,", 29.48], ["con", 30.26], ["*trazos,", 30.52]], end: 31.2 },
  { words: [["con", 31.28], ["*evidencias", 31.52], ["*biométricas,", 31.92]], end: 33.2 },
  { words: [["siempre", 33.3], ["con", 33.78], ["la", 33.86], ["*NOM-151.", 34.0]], end: 35.15 },
  { words: [["¿Qué", 35.24], ["*esperas?", 35.5]], end: 35.85 },
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
  finger: "M12 3a8 8 0 0 0-8 8M12 7a4 4 0 0 0-4 4v3M12 11v6M16 11a4 4 0 0 0-4-4M20 11a8 8 0 0 0-8-8M16 11v4a6 6 0 0 1-1 3M8 17c0 1.5.4 2.8 1 4",
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
// 1 — the organisation went digital: logistics, finance, accounting
const S1: React.FC = () => {
  const items = [
    { x: 170, d: IC.truck, l: "Logística", at: t(6.46) },
    { x: 490, d: IC.cash, l: "Finanzas", at: t(7.84) },
    { x: 810, d: IC.book, l: "Contabilidad", at: t(8.9) },
  ];
  return (
    <>
      <Tile x={490} y={150} d={IC.scale} at={t(0.4)} size={140} label="Legal" />
      {items.map((i, k) => (
        <React.Fragment key={i.l}>
          <Tile x={i.x} y={450} d={i.d} at={i.at} label={i.l} size={160} phase={k} />
          <Dot x={i.x + 64} y={380} at={i.at + 6} />
        </React.Fragment>
      ))}
    </>
  );
};

// 2 — contracts still signed by hand
const S2: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      <div style={{ position: "absolute", left: 255, top: 60, width: 470, height: 610, borderRadius: 30, background: "#fff", boxShadow: "0 24px 50px rgba(10,6,90,.4)", transform: `scale(${bounce(f, t(9.9))})`, padding: 40, boxSizing: "border-box" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Icon d={IC.doc} size={64} color={BLUE} />
          <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 36, color: NAVY }}>Contrato</span>
        </div>
        {[0, 1, 2, 3].map((k) => <div key={k} style={{ height: 14, borderRadius: 7, background: "#E6E5F5", marginTop: 26, width: `${90 - k * 12}%` }} />)}
        <div style={{ position: "absolute", left: 40, right: 40, bottom: 70, height: 3, background: NAVY, opacity: 0.4 }} />
      </div>
      <Signature at={t(12.5)} x={300} y={480} />
      <div style={{ position: "absolute", left: 640, top: 90, transform: `scale(${bounce(f, t(12.5))})`, opacity: f >= t(12.5) ? 1 : 0 }}>
        <div style={{ width: 96, height: 96, borderRadius: 48, background: AMBER, border: "5px solid #fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon d={IC.pen} size={50} color="#fff" sw={2.6} />
        </div>
      </div>
    </>
  );
};

// 3 — create the free account
const S3: React.FC = () => {
  const f = useCurrentFrame();
  const url = "doc2sign.com";
  const typed = Math.round(interpolate(f, [t(16.3), t(17.0)], [0, url.length], clamp));
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 110, display: "flex", justifyContent: "center", transform: `scale(${bounce(f, t(13.5))})` }}>
        <Img src={staticFile("doc2sign/logo-white.png")} style={{ width: 580 }} />
      </div>
      <div style={{ position: "absolute", left: 150, right: 150, top: 380, display: "flex", alignItems: "center", gap: 14, background: "#fff", borderRadius: 999, padding: "20px 30px", boxShadow: "0 20px 44px rgba(10,6,90,.35)", transform: `scale(${bounce(f, t(15.9))})` }}>
        <Icon d={IC.search} size={40} color={BLUE} sw={2.6} />
        <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 46, color: NAVY }}>
          {url.slice(0, typed)}
          <span style={{ opacity: typed < url.length && f % 20 < 10 ? 1 : 0, color: BLUE }}>|</span>
        </span>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 545, display: "flex", justifyContent: "center", transform: `scale(${bounce(f, t(15.42))})` }}>
        <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: NAVY, background: LILAC, borderRadius: 16, padding: "8px 28px" }}>GRATIS</span>
      </div>
    </>
  );
};

// 4 — doc · 2 · sign
const S4: React.FC = () => {
  const f = useCurrentFrame();
  const two = spring({ frame: f - t(18.8), fps: 30, config: { damping: 10 } });
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 14, fontFamily: FONT, fontWeight: 700, fontSize: 140, color: "#fff", letterSpacing: "-0.03em" }}>
      <span style={{ transform: `scale(${bounce(f, t(18.14))})` }}>doc</span>
      <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 170, height: 170, borderRadius: 85, background: "#fff", color: BLUE, transform: `scale(${0.4 + 0.6 * two})` }}>2</span>
      <span style={{ transform: `scale(${bounce(f, t(19.12))})` }}>sign</span>
    </div>
  );
};

// 5 — backed by Economía as a certification services provider
const S5: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      <Tile x={490} y={220} d={IC.shield} at={t(21.9)} size={230} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 400, display: "flex", justifyContent: "center", transform: `scale(${bounce(f, t(23.02))})`, opacity: f >= t(23.02) ? 1 : 0 }}>
        <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, color: NAVY, background: LILAC, borderRadius: 14, padding: "8px 24px", letterSpacing: "0.04em" }}>RESPALDO DE ECONOMÍA</span>
      </div>
      <div style={{ position: "absolute", left: 60, right: 60, top: 500, textAlign: "center", fontFamily: FONT, fontWeight: 700, fontSize: 44, lineHeight: 1.15, color: "#fff", transform: `scale(${bounce(f, t(23.74))})`, opacity: f >= t(23.74) ? 1 : 0 }}>
        Prestador de Servicios
        <br />
        de Certificación
      </div>
    </>
  );
};

// 6 — four ways to sign
const S6: React.FC = () => {
  const ways = [
    { x: 290, y: 190, d: IC.key, l: "FIEL del SAT", at: t(27.58) },
    { x: 690, y: 190, d: IC.cert, l: "Certificado PSC", at: t(28.98) },
    { x: 290, y: 500, d: IC.pen, l: "Trazo", at: t(30.52) },
    { x: 690, y: 500, d: IC.finger, l: "Biometría", at: t(31.52) },
  ];
  return (
    <>
      {ways.map((w, k) => (
        <React.Fragment key={w.l}>
          <Tile x={w.x} y={w.y - 20} d={w.d} at={w.at} label={w.l} size={150} phase={k} />
          <Dot x={w.x + 60} y={w.y - 85} at={w.at + 6} size={46} />
        </React.Fragment>
      ))}
    </>
  );
};

// 7 — always NOM-151, then the close
const S7: React.FC = () => {
  const f = useCurrentFrame();
  const b = bounce(f, t(34.0));
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 80, display: "flex", justifyContent: "center", transform: `scale(${b})` }}>
        <div style={{ background: "#fff", borderRadius: 30, padding: "26px 44px", display: "flex", alignItems: "center", gap: 22, boxShadow: "0 24px 50px rgba(10,6,90,.4)" }}>
          <Icon d={IC.shield} size={86} color={BLUE} sw={2} />
          <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 84, color: NAVY, letterSpacing: "-0.02em" }}>NOM-151</span>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 360, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 76, color: "#fff", transform: `scale(${bounce(f, t(35.24))})`, opacity: f >= t(35.24) ? 1 : 0 }}>¿Qué esperas?</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 520, display: "flex", justifyContent: "center", transform: `scale(${bounce(f, t(35.3))})`, opacity: f >= t(35.3) ? 1 : 0 }}>
        <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 34, color: BLUE, background: "#fff", borderRadius: 16, padding: "14px 30px" }}>Crea tu cuenta gratis en doc2sign.com</span>
      </div>
    </>
  );
};

const SCENES: { from: number; to: number; C: React.FC }[] = [
  { from: 0.1, to: 9.68, C: S1 },
  { from: 9.68, to: 13.42, C: S2 },
  { from: 13.42, to: 18.1, C: S3 },
  { from: 18.1, to: 19.9, C: S4 },
  { from: 19.9, to: 25.98, C: S5 },
  { from: 25.98, to: 33.25, C: S6 },
  { from: 33.25, to: 37, C: S7 },
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
export const Doc2Sign3Video: React.FC = () => {
  const [handle] = useState(() => delayRender("Loading fonts"));
  useEffect(() => {
    fontsLoaded.then(() => continueRender(handle));
  }, [handle]);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Reframed />
      <Audio src={staticFile("music/doc2sign3.wav")} volume={0.07} />
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
