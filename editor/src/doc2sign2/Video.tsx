// doc2sign #2 — "Eres abogado de una empresa…". Same brand line as the first
// doc2sign edit (electric blue #2A1CE3, navy #17156C, lilac accents, white
// cards, Poppins, logo without ®) on the newer layout: clip at 1.2× with the
// silences cut (public/doc2sign2/video.mp4), reframed with jump-cut zooms,
// visual diagrams on a blue stage at the top and subtitles at the bottom.
import React, { useEffect, useState } from "react";
import { AbsoluteFill, Audio, continueRender, delayRender, Easing, Img, interpolate, OffthreadVideo, spring, staticFile, useCurrentFrame } from "remotion";
import { FONT, fontsLoaded } from "../fispal/theme";

export const DOC2SIGN2_DURATION = 785; // 26.16 s at 30 fps
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
const CUTS = [0, 5.22, 11.3, 17.34, 22.13];

const Reframed: React.FC = () => {
  const f = useCurrentFrame();
  const sec = f / 30;
  let k = 0;
  while (k + 1 < CUTS.length && sec >= CUTS[k + 1]) k++;
  const s = (k % 2 ? 1.42 : 1.3) + Math.min(sec - CUTS[k], 6) * 0.006;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ transformOrigin: `${FACE.x}px ${FACE.y}px`, transform: `translate(${TARGET.x - FACE.x}px, ${TARGET.y - FACE.y}px) scale(${s})` }}>
        <OffthreadVideo src={staticFile("doc2sign2/video.mp4")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------- subtitles (bottom) ---------- */
type W = [string, number];
const PAGES: { words: W[]; end: number }[] = [
  { words: [["¿Eres", 0.24], ["*abogado", 0.48], ["de", 0.88], ["una", 0.98], ["empresa", 1.28]], end: 1.75 },
  { words: [["y", 1.8], ["has", 1.96], ["visto", 2.24], ["que", 2.48], ["han", 2.58], ["transformado", 2.98], ["muchos", 3.44], ["*procesos", 3.82], ["*a", 4.46], ["*digitales?", 4.7]], end: 5.38 },
  { words: [["Pero", 5.44], ["cuando", 5.66], ["hablamos", 5.82], ["de", 6.12], ["*contratos", 6.34], ["con", 7.08], ["*clientes,", 7.3], ["*proveedores", 7.72], ["o", 8.36], ["de", 8.44], ["algún", 8.62], ["otro", 8.78], ["tipo,", 9.1]], end: 9.75 },
  { words: [["siguen", 9.82], ["firmando", 10.14], ["*a", 10.46], ["*puño", 10.58], ["*y", 10.74], ["*letra,", 10.94]], end: 11.48 },
  { words: [["gastando", 11.54], ["en", 11.86], ["*mensajerías,", 11.96], ["gastando", 12.88], ["en", 13.2], ["*archivo", 13.4], ["*muerto", 14.4]], end: 15.15 },
  { words: [["y", 15.22], ["gestionando", 15.44], ["procesos", 16.04], ["de", 16.26], ["manera", 16.44], ["*artesanal,", 16.68]], end: 17.45 },
  { words: [["te", 17.52], ["invito", 17.66], ["a", 17.88], ["crear", 18.0], ["una", 18.2], ["*cuenta", 18.4], ["*gratis", 18.76], ["en", 19.08], ["*doc2sign.com,", 19.28]], end: 20.6 },
  { words: [["doc,", 20.68], ["el", 21.06], ["número", 21.2], ["*2,", 21.48], ["sign,", 21.84]], end: 22.32 },
  { words: [["la", 22.38], ["plataforma", 22.78], ["que", 23.04], ["tiene", 23.26], ["el", 23.4], ["*respaldo", 23.6], ["*directo", 24.04], ["como", 24.38], ["*prestador", 24.6], ["*de", 24.94], ["*servicios", 25.08], ["*de", 25.24], ["*certificación.", 25.38]], end: 26.16 },
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

const Arrow: React.FC<{ x1: number; x2: number; y: number; at: number }> = ({ x1, x2, y, at }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [at, at + 10], [0, 1], clamp);
  const xe = x1 + (x2 - x1) * p;
  return (
    <svg width={980} height={730} style={{ position: "absolute", left: 0, top: 0 }}>
      <path d={`M${x1} ${y} L${xe} ${y} M${xe - 22} ${y - 22} L${xe} ${y} L${xe - 22} ${y + 22}`} stroke="#fff" strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={p > 0.02 ? 1 : 0} />
    </svg>
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
// 1 — the lawyer's company already went digital
const S1: React.FC = () => (
  <>
    <Tile x={220} y={300} d={IC.scale} at={t(0.4)} label="Legal" size={190} />
    <Arrow x1={350} x2={600} y={300} at={t(3.0)} />
    <Tile x={760} y={300} d={IC.laptop} at={t(3.3)} label="Procesos digitales" size={190} />
    <Dot x={840} y={220} at={t(4.7)} size={66} />
  </>
);

// 2 — contracts still signed by hand
const S2: React.FC = () => {
  const f = useCurrentFrame();
  const parts = [
    { l: "Clientes", at: t(7.3) },
    { l: "Proveedores", at: t(7.72) },
    { l: "Otros", at: t(9.1) },
  ];
  return (
    <>
      <div style={{ position: "absolute", left: 90, top: 70, width: 470, height: 590, borderRadius: 30, background: "#fff", boxShadow: "0 24px 50px rgba(10,6,90,.4)", transform: `scale(${bounce(f, t(5.6))})`, padding: 40, boxSizing: "border-box" }}>
        <Icon d={IC.doc} size={70} color={BLUE} />
        {[0, 1, 2, 3].map((k) => <div key={k} style={{ height: 14, borderRadius: 7, background: "#E6E5F5", marginTop: 26, width: `${90 - k * 12}%` }} />)}
        <div style={{ position: "absolute", left: 40, right: 40, bottom: 70, height: 3, background: NAVY, opacity: 0.4 }} />
      </div>
      <Signature at={t(10.58)} x={120} y={470} />
      <div style={{ position: "absolute", left: 610, top: 120, display: "flex", flexDirection: "column", gap: 22 }}>
        {parts.map((p) => (
          <span key={p.l} style={{ fontFamily: FONT, fontWeight: 700, fontSize: 36, color: NAVY, background: "#fff", borderRadius: 18, padding: "14px 26px", transform: `scale(${bounce(f, p.at)})`, opacity: f >= p.at ? 1 : 0 }}>{p.l}</span>
        ))}
      </div>
    </>
  );
};

// 3 — the costs of doing it by hand
const S3: React.FC = () => {
  const items = [
    { x: 170, d: IC.truck, l: "Mensajería", at: t(11.96) },
    { x: 490, d: IC.archive, l: "Archivo muerto", at: t(13.4) },
    { x: 810, d: IC.hand, l: "Artesanal", at: t(16.68) },
  ];
  return (
    <>
      {items.map((i, k) => (
        <React.Fragment key={i.l}>
          <Tile x={i.x} y={300} d={i.d} at={i.at} label={i.l} size={170} phase={k} />
          <Dot x={i.x + 70} y={225} at={i.at + 6} ok={false} text="$" size={60} />
        </React.Fragment>
      ))}
    </>
  );
};

// 4 — create the free account
const S4: React.FC = () => {
  const f = useCurrentFrame();
  const url = "doc2sign.com";
  const typed = Math.round(interpolate(f, [t(19.2), t(19.9)], [0, url.length], clamp));
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 110, display: "flex", justifyContent: "center", transform: `scale(${bounce(f, t(17.6))})` }}>
        <Img src={staticFile("doc2sign/logo-white.png")} style={{ width: 580 }} />
      </div>
      <div style={{ position: "absolute", left: 150, right: 150, top: 380, display: "flex", alignItems: "center", gap: 14, background: "#fff", borderRadius: 999, padding: "20px 30px", boxShadow: "0 20px 44px rgba(10,6,90,.35)", transform: `scale(${bounce(f, t(18.8))})` }}>
        <Icon d={IC.search} size={40} color={BLUE} sw={2.6} />
        <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 46, color: NAVY }}>
          {url.slice(0, typed)}
          <span style={{ opacity: typed < url.length && f % 20 < 10 ? 1 : 0, color: BLUE }}>|</span>
        </span>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 545, display: "flex", justifyContent: "center", transform: `scale(${bounce(f, t(18.76))})` }}>
        <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: NAVY, background: LILAC, borderRadius: 16, padding: "8px 28px" }}>GRATIS</span>
      </div>
    </>
  );
};

// 5 — doc · 2 · sign
const S5: React.FC = () => {
  const f = useCurrentFrame();
  const two = spring({ frame: f - t(21.48), fps: 30, config: { damping: 10 } });
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 14, fontFamily: FONT, fontWeight: 700, fontSize: 140, color: "#fff", letterSpacing: "-0.03em" }}>
      <span style={{ transform: `scale(${bounce(f, t(20.7))})` }}>doc</span>
      <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 170, height: 170, borderRadius: 85, background: "#fff", color: BLUE, transform: `scale(${0.4 + 0.6 * two})` }}>2</span>
      <span style={{ transform: `scale(${bounce(f, t(21.84))})` }}>sign</span>
    </div>
  );
};

// 6 — backed as a certification services provider, then the close
const S6: React.FC = () => {
  const f = useCurrentFrame();
  const cta = bounce(f, t(25.6));
  return (
    <>
      <Tile x={490} y={230} d={IC.shield} at={t(23.6)} size={230} color={BLUE} />
      <div style={{ position: "absolute", left: 60, right: 60, top: 420, textAlign: "center", fontFamily: FONT, fontWeight: 700, fontSize: 44, lineHeight: 1.15, color: "#fff", transform: `scale(${bounce(f, t(24.6))})`, opacity: f >= t(24.6) ? 1 : 0 }}>
        Prestador de Servicios
        <br />
        de Certificación
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 575, display: "flex", justifyContent: "center", transform: `scale(${cta})`, opacity: f >= t(25.6) ? 1 : 0 }}>
        <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 34, color: BLUE, background: "#fff", borderRadius: 16, padding: "14px 30px" }}>Crea tu cuenta gratis en doc2sign.com</span>
      </div>
    </>
  );
};

const SCENES: { from: number; to: number; C: React.FC }[] = [
  { from: 0.1, to: 5.4, C: S1 },
  { from: 5.4, to: 11.5, C: S2 },
  { from: 11.5, to: 17.45, C: S3 },
  { from: 17.45, to: 20.62, C: S4 },
  { from: 20.62, to: 22.34, C: S5 },
  { from: 22.34, to: 27, C: S6 },
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
export const Doc2Sign2Video: React.FC = () => {
  const [handle] = useState(() => delayRender("Loading fonts"));
  useEffect(() => {
    fontsLoaded.then(() => continueRender(handle));
  }, [handle]);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Reframed />
      <Audio src={staticFile("music/doc2sign2.wav")} volume={0.07} />
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
