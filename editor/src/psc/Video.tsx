// detecno PSC — constancias NOM-151 por API. No brand kit was given, so the
// look follows detecno (navy, white tiles, Barlow) with an emerald "integrity"
// accent and a text wordmark. Newer layout: clip at 1.2× with the silences cut
// (public/psc/video.mp4), reframed with jump-cut zooms, diagrams on a dark
// navy stage at the top and subtitles at the bottom.
import { loadFont } from "@remotion/fonts";
import React, { useEffect, useState } from "react";
import { AbsoluteFill, Audio, continueRender, delayRender, Easing, interpolate, OffthreadVideo, spring, staticFile, useCurrentFrame } from "remotion";

export const PSC_DURATION = 799; // 26.62 s at 30 fps
const BLUE = "#1F3C88";
const NAVY = "#0B1638";
const LILAC = "#2BD4A4"; // emerald accent: integrity
const FONT = "Barlow";

const fontsLoaded = Promise.all(["500", "600", "700", "800"].map((w) => loadFont({ family: FONT, url: staticFile(`fonts/barlow-latin-${w}-normal.woff2`), weight: w })));

const t = (sec: number) => Math.round(sec * 30);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const bounce = (f: number, at: number) => spring({ frame: f - at, fps: 30, config: { damping: 11, stiffness: 150 } });

/* ---------- reframing with jump-cut zooms on the silence cuts ---------- */
const FACE = { x: 540, y: 1010 };
const TARGET = { x: 540, y: 1180 };
const CUTS = [0, 4.65, 6.97, 9.47, 10.79, 14.16, 22.82, 25.53];

const Reframed: React.FC = () => {
  const f = useCurrentFrame();
  const sec = f / 30;
  let k = 0;
  while (k + 1 < CUTS.length && sec >= CUTS[k + 1]) k++;
  const s = (k % 2 ? 1.42 : 1.3) + Math.min(sec - CUTS[k], 6) * 0.006;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ transformOrigin: `${FACE.x}px ${FACE.y}px`, transform: `translate(${TARGET.x - FACE.x}px, ${TARGET.y - FACE.y}px) scale(${s})` }}>
        <OffthreadVideo src={staticFile("psc/video.mp4")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------- subtitles (bottom) ---------- */
type W = [string, number];
const PAGES: { words: W[]; end: number }[] = [
  { words: [["¿Tienes", 0.22], ["algún", 0.68], ["proceso", 1.1], ["donde", 1.86], ["estás", 2.26], ["ya", 2.5], ["*enviando", 3.0], ["*documentos", 3.62], ["*digitales", 4.12]], end: 4.9 },
  { words: [["o", 4.96], ["*solicitando", 5.4], ["documentos", 6.04], ["digitales", 6.56]], end: 7.18 },
  { words: [["y", 7.24], ["quieres", 7.5], ["garantizar", 7.76], ["la", 8.6], ["*integridad", 8.8], ["de", 9.72], ["esos", 9.92], ["documentos?", 10.3]], end: 11.04 },
  { words: [["Como", 11.1], ["*prestador", 11.4], ["*de", 11.82], ["*servicios", 12.06], ["*de", 12.28], ["*certificación", 12.44], ["autorizado", 13.06], ["por", 13.5], ["*Economía,", 13.72]], end: 14.32 },
  { words: [["te", 14.38], ["ofrecemos", 14.48], ["la", 14.96], ["*NOM-151", 15.08]], end: 16.7 },
  { words: [["para", 16.76], ["que,", 16.92], ["de", 17.04], ["acuerdo", 17.32], ["con", 17.88], ["las", 17.98], ["diferentes", 18.28], ["*reglas,", 18.68]], end: 19.3 },
  { words: [["puedas", 19.36], ["garantizar", 19.68], ["la", 20.5], ["*integridad", 20.76], ["a", 21.64], ["partir", 21.92], ["de", 22.1], ["ese", 22.2], ["*momento.", 22.48]], end: 23.0 },
  { words: [["*Conéctate", 23.06], ["a", 23.5], ["nuestra", 23.54], ["*API,", 23.96], ["prueba", 24.28], ["el", 24.42], ["*servicio", 24.62]], end: 25.24 },
  { words: [["y", 25.3], ["*blinda", 25.92], ["tu", 26.14], ["*operación.", 26.24]], end: 26.62 },
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
      <div style={{ background: "rgba(11,22,56,.9)", borderRadius: 18, padding: "14px 30px", maxWidth: 940, textAlign: "center", fontFamily: FONT, fontWeight: 600, fontSize: 46, lineHeight: 1.3, color: "#fff", boxShadow: "0 12px 30px rgba(10,8,60,.25)" }}>
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
  lock: "M6 11h12v10H6zM8 11V8a4 4 0 0 1 8 0v3",
  code: "M8 8l-4 4 4 4M16 8l4 4-4 4M14 5l-4 14",
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
const Wordmark: React.FC<{ size?: number; at: number }> = ({ size = 110, at }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: size * 0.2, transform: `scale(${bounce(f, at)})` }}>
      <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: size, color: "#fff", letterSpacing: "-0.01em" }}>detecno</span>
      <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: size * 0.55, color: NAVY, background: LILAC, borderRadius: size * 0.14, padding: `0 ${size * 0.16}px` }}>PSC</span>
    </div>
  );
};

// 1 — sending and requesting digital documents
const S1: React.FC = () => {
  const f = useCurrentFrame();
  const out = interpolate(f, [t(3.0), t(3.9)], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const back = interpolate(f, [t(5.4), t(6.3)], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  return (
    <>
      <Tile x={190} y={300} d={IC.building} at={t(0.3)} label="Tu empresa" size={170} />
      <Tile x={790} y={300} d={IC.user} at={t(1.1)} label="Clientes · Proveedores" size={170} phase={1} />
      {f >= t(3.0) && <div style={{ position: "absolute", left: 300 + out * 330, top: 200, opacity: 1 - Math.max(0, out - 0.9) * 10 }}><Icon d={IC.doc} size={70} color="#fff" sw={2} /></div>}
      {f >= t(5.4) && <div style={{ position: "absolute", left: 630 - back * 330, top: 340, opacity: 1 - Math.max(0, back - 0.9) * 10 }}><Icon d={IC.doc} size={70} color={LILAC} sw={2} /></div>}
      <div style={{ position: "absolute", left: 0, right: 0, top: 560, display: "flex", justifyContent: "center", gap: 18, fontFamily: FONT, fontWeight: 700, fontSize: 32 }}>
        <span style={{ color: "#fff", opacity: f >= t(3.0) ? 1 : 0 }}>Envías →</span>
        <span style={{ color: LILAC, opacity: f >= t(5.4) ? 1 : 0 }}>← Solicitas</span>
      </div>
    </>
  );
};

// 2 — integrity of those documents
const S2: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      <div style={{ position: "absolute", left: 340, top: 70, width: 300, height: 400, borderRadius: 26, background: "#fff", boxShadow: "0 24px 50px rgba(0,0,0,.4)", padding: 30, boxSizing: "border-box", transform: `scale(${bounce(f, t(7.3))})` }}>
        <Icon d={IC.doc} size={54} color={BLUE} />
        {[0, 1, 2, 3].map((k) => <div key={k} style={{ height: 12, borderRadius: 6, background: "#E3E8F3", marginTop: 24, width: `${90 - k * 12}%` }} />)}
      </div>
      <div style={{ position: "absolute", left: 570, top: 330, transform: `scale(${bounce(f, t(8.8))})`, opacity: f >= t(8.8) ? 1 : 0 }}>
        <div style={{ width: 150, height: 150, borderRadius: 75, background: LILAC, border: "6px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 18px 40px rgba(0,0,0,.35)" }}>
          <Icon d={IC.lock} size={80} color={NAVY} sw={2.4} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 560, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 50, color: "#fff", opacity: f >= t(8.8) ? 1 : 0 }}>Integridad</div>
    </>
  );
};

// 3 — authorised PSC by Economía, offering NOM-151
const S3: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      <Tile x={490} y={170} d={IC.shield} at={t(11.4)} size={170} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center", fontFamily: FONT, fontWeight: 700, fontSize: 38, lineHeight: 1.15, color: "#fff", transform: `scale(${bounce(f, t(12.44))})`, opacity: f >= t(12.44) ? 1 : 0 }}>
        Prestador de Servicios de Certificación
        <br />
        <span style={{ color: LILAC, fontSize: 32 }}>autorizado por Economía</span>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 470, display: "flex", justifyContent: "center", transform: `scale(${bounce(f, t(15.08))})`, opacity: f >= t(15.08) ? 1 : 0 }}>
        <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 96, color: NAVY, background: "#fff", borderRadius: 26, padding: "0 40px", letterSpacing: "-0.01em" }}>NOM-151</span>
      </div>
    </>
  );
};

// 4 — integrity from that moment on: a timeline sealed from a point
const S4: React.FC = () => {
  const f = useCurrentFrame();
  const p = interpolate(f, [t(21.64), t(22.8)], [0, 1], clamp);
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 80, display: "flex", justifyContent: "center", transform: `scale(${bounce(f, t(18.68))})`, opacity: f >= t(18.68) ? 1 : 0 }}>
        <span style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: FONT, fontWeight: 700, fontSize: 36, color: "#fff" }}>
          <Icon d={IC.scale} size={44} color={LILAC} sw={2.2} /> Conforme a la regulación
        </span>
      </div>
      <svg width={980} height={730} style={{ position: "absolute", left: 0, top: 0 }}>
        <line x1={110} y1={360} x2={870} y2={360} stroke="rgba(255,255,255,.3)" strokeWidth={8} strokeLinecap="round" />
        <line x1={330} y1={360} x2={330 + 540 * p} y2={360} stroke={LILAC} strokeWidth={10} strokeLinecap="round" />
      </svg>
      <div style={{ position: "absolute", left: 330 - 50, top: 360 - 50, width: 100, height: 100, borderRadius: 50, background: LILAC, border: "6px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${bounce(f, t(20.76))})`, opacity: f >= t(20.76) ? 1 : 0 }}>
        <Icon d={IC.lock} size={52} color={NAVY} sw={2.6} />
      </div>
      <div style={{ position: "absolute", left: 230, width: 200, top: 440, textAlign: "center", fontFamily: FONT, fontWeight: 700, fontSize: 28, color: "#fff", opacity: f >= t(20.76) ? 1 : 0 }}>Constancia</div>
      <div style={{ position: "absolute", left: 470, width: 400, top: 440, textAlign: "center", fontFamily: FONT, fontWeight: 700, fontSize: 30, color: LILAC, opacity: p }}>Íntegro desde ese momento</div>
    </>
  );
};

// 5 — connect to the API, try it, shield your operation
const S5: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26 }}>
      <div style={{ display: "flex", gap: 18 }}>
        {[["API", IC.code, t(23.96)], ["Pruébalo", IC.flask, t(24.62)]].map(([l, d, at]) => (
          <span key={l as string} style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: FONT, fontWeight: 700, fontSize: 36, color: NAVY, background: "#fff", borderRadius: 16, padding: "10px 24px", transform: `scale(${bounce(f, at as number)})`, opacity: f >= (at as number) ? 1 : 0 }}>
            <Icon d={d as string} size={36} color={BLUE} sw={2.4} /> {l}
          </span>
        ))}
      </div>
      <span style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: FONT, fontWeight: 800, fontSize: 54, color: NAVY, background: LILAC, borderRadius: 18, padding: "10px 34px", transform: `scale(${bounce(f, t(25.92))})`, opacity: f >= t(25.92) ? 1 : 0 }}>
        <Icon d={IC.shield} size={52} color={NAVY} sw={2.4} /> Blinda tu operación
      </span>
      <div style={{ opacity: f >= t(23.06) ? 1 : 0 }}><Wordmark at={t(23.06)} size={70} /></div>
    </div>
  );
};

const SCENES: { from: number; to: number; C: React.FC }[] = [
  { from: 0.1, to: 7.2, C: S1 },
  { from: 7.2, to: 11.06, C: S2 },
  { from: 11.06, to: 16.72, C: S3 },
  { from: 16.72, to: 23.02, C: S4 },
  { from: 23.02, to: 28, C: S5 },
];

const Stage: React.FC = () => {
  const f = useCurrentFrame();
  const enter = spring({ frame: f, fps: 30, config: { damping: 200 }, durationInFrames: 14 });
  return (
    <div style={{ position: "absolute", left: 50, top: 150, width: 980, height: 730, borderRadius: 48, overflow: "hidden", background: `linear-gradient(155deg, #1C3474 0%, #13255A 50%, ${NAVY} 100%)`, boxShadow: "0 30px 70px rgba(10,6,90,.4)", opacity: enter, transform: `translateY(${(1 - enter) * -40}px)` }}>
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
export const PscVideo: React.FC = () => {
  const [handle] = useState(() => delayRender("Loading fonts"));
  useEffect(() => {
    fontsLoaded.then(() => continueRender(handle));
  }, [handle]);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Reframed />
      <Audio src={staticFile("music/psc.wav")} volume={0.035} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 40, display: "flex", justifyContent: "center" }}>
        <div style={{ background: "rgba(255,255,255,.96)", borderRadius: 999, padding: "14px 32px", boxShadow: "0 10px 26px rgba(10,8,60,.2)" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: FONT, fontWeight: 800, fontSize: 48, lineHeight: 1, color: NAVY }}>detecno<span style={{ fontSize: 30, color: "#fff", background: "#13A07C", borderRadius: 8, padding: "2px 10px" }}>PSC</span></span>
        </div>
      </div>
      <Stage />
      <Subtitles />
    </AbsoluteFill>
  );
};
