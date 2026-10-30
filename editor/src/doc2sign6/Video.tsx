// doc2sign Pagarés — firmar y endosar pagarés electrónicos.
// Same brand line as the first
// doc2sign edit (electric blue #2A1CE3, navy #17156C, lilac accents, white
// cards, Poppins, logo without ®) on the newer layout: clip at 1.2× with the
// silences cut (public/doc2sign6/video.mp4), reframed with jump-cut zooms,
// visual diagrams on a blue stage at the top and subtitles at the bottom.
import React, { useEffect, useState } from "react";
import { AbsoluteFill, Audio, continueRender, delayRender, Easing, Img, interpolate, OffthreadVideo, spring, staticFile, useCurrentFrame } from "remotion";
import { FONT, fontsLoaded } from "../fispal/theme";

export const DOC2SIGN6_DURATION = 753; // 25.09 s at 30 fps
const BLUE = "#2A1CE3";
const NAVY = "#17156C";
const LILAC = "#B8B2FF";
const RED = "#F0506E";
const GREEN = "#12B886";

const t = (sec: number) => Math.round(sec * 30);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const bounce = (f: number, at: number) => spring({ frame: f - at, fps: 30, config: { damping: 11, stiffness: 150 } });

/* ---------- reframing with jump-cut zooms on the silence cuts ---------- */
const FACE = { x: 560, y: 880 };
const TARGET = { x: 540, y: 1100 };
const CUTS = [0, 5.14, 10.107, 11.807, 13.629, 15.251, 17.68, 20.209, 22.722];

const Reframed: React.FC = () => {
  const f = useCurrentFrame();
  const sec = f / 30;
  let k = 0;
  while (k + 1 < CUTS.length && sec >= CUTS[k + 1]) k++;
  const s = (k % 2 ? 1.42 : 1.3) + Math.min(sec - CUTS[k], 6) * 0.006;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ transformOrigin: `${FACE.x}px ${FACE.y}px`, transform: `translate(${TARGET.x - FACE.x}px, ${TARGET.y - FACE.y}px) scale(${s})` }}>
        <OffthreadVideo src={staticFile("doc2sign6/video.mp4")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------- subtitles (bottom) ---------- */
type W = [string, number];
const PAGES: { words: W[]; end: number }[] = [
  { words: [["En", 0.3], ["tu", 0.42], ["empresa,", 0.72], ["¿ya", 1.12], ["están", 1.44], ["*firmando", 1.68]], end: 2.28 },
  { words: [["o", 2.34], ["tienen", 2.58], ["la", 2.84], ["intención", 3.2], ["de", 3.58], ["firmar", 3.74], ["*documentos", 4.26], ["*digitales?", 4.64]], end: 5.34 },
  { words: [["En", 5.4], ["*doc2sign,", 5.56], ["más", 6.96], ["allá", 7.16], ["de", 7.34], ["firmar", 7.54], ["*contratos", 7.92], ["*digitales", 8.38]], end: 8.9 },
  { words: [["o", 8.96], ["documentos", 9.22], ["*laborales,", 9.54]], end: 10.36 },
  { words: [["tenemos", 10.42], ["un", 10.68], ["módulo", 10.76], ["para", 11.14], ["*firmar", 11.36], ["y", 12.04], ["*endosar", 12.26], ["*pagarés", 12.68], ["*electrónicos.", 13.08]], end: 13.82 },
  { words: [["Si", 13.88], ["tu", 14.0], ["empresa", 14.3], ["necesita", 14.8], ["o", 15.48], ["quiere", 15.76], ["ser", 15.96], ["*más", 16.2], ["*ágil,", 16.4]], end: 16.7 },
  { words: [["firmando", 16.76], ["*pagarés", 17.16], ["y", 17.9], ["más", 18.08], ["adelante", 18.42], ["poderlos", 18.72], ["*endosar", 19.06], ["de", 19.3], ["manera", 19.42], ["*digital,", 19.86]], end: 20.34 },
  { words: [["te", 20.4], ["invito", 20.48], ["a", 20.7], ["conocer", 20.92], ["el", 21.08], ["módulo", 21.18], ["*doc2sign", 21.58], ["*Pagarés", 22.24]], end: 22.9 },
  { words: [["para", 22.96], ["*digitalizar", 23.22], ["este", 23.98], ["proceso", 24.3], ["en", 24.4], ["tu", 24.48], ["organización.", 24.56]], end: 25.09 },
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
  printer: "M7 8V3h10v5M5 8h14a2 2 0 0 1 2 2v6h-4v4H7v-4H3v-6a2 2 0 0 1 2-2zM9 16h6",
  building: "M3 21h18M5 21V9l7-5 7 5v12M9 21v-6h6v6M9 11h.01M15 11h.01",
  layers: "M12 3l9 5-9 5-9-5zM3 13l9 5 9-5M3 17l9 5 9-5",
  list: "M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01",
  bell: "M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 20a2 2 0 0 0 4 0",
  star: "M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3 6.4 20.2l1.1-6.2L3 9.6l6.2-.9z",
  spark: "M12 3v4M12 17v4M3 12h4M17 12h4M12 8l1.5 2.5L16 12l-2.5 1.5L12 16l-1.5-2.5L8 12l2.5-1.5z",
  calendar: "M4 6h16v14H4zM4 10h16M8 3v4M16 3v4",
  bolt: "M13 2L4 14h7l-1 8 9-12h-7z",
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
// a promissory note card: "PAGARÉ", amount line, signature line
const Note: React.FC<{ x: number; y: number; w?: number; at: number; signAt?: number; label?: string }> = ({ x, y, w = 440, at, signAt, label = "PAGARÉ" }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const h = w * 0.62;
  return (
    <>
      <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 24, background: "#fff", boxShadow: "0 24px 50px rgba(10,6,90,.4)", transform: `scale(${bounce(f, at)})`, padding: w * 0.07, boxSizing: "border-box", fontFamily: FONT }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontWeight: 800, fontSize: w * 0.085, color: NAVY, letterSpacing: "0.06em" }}>{label}</span>
          <span style={{ fontWeight: 800, fontSize: w * 0.085, color: BLUE }}>$</span>
        </div>
        <div style={{ height: w * 0.03, borderRadius: 6, background: "#E6E5F5", marginTop: w * 0.06, width: "80%" }} />
        <div style={{ height: w * 0.03, borderRadius: 6, background: "#E6E5F5", marginTop: w * 0.04, width: "60%" }} />
        <div style={{ position: "absolute", left: w * 0.07, right: w * 0.4, bottom: w * 0.08, height: 3, background: NAVY, opacity: 0.4 }} />
      </div>
      {signAt !== undefined && <Signature at={signAt} x={x + w * 0.06} y={y + h - w * 0.26} width={w * 0.5} color={BLUE} />}
    </>
  );
};

// 1 — your company already signs digital documents
const S1: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      <Tile x={220} y={300} d={IC.building} at={t(0.4)} label="Tu empresa" size={190} />
      <div style={{ position: "absolute", left: 470, top: 110, width: 400, height: 470, borderRadius: 28, background: "#fff", boxShadow: "0 24px 50px rgba(10,6,90,.4)", transform: `scale(${bounce(f, t(1.68))})`, opacity: f >= t(1.68) ? 1 : 0, padding: 34, boxSizing: "border-box" }}>
        <Icon d={IC.doc} size={58} color={BLUE} />
        {[0, 1, 2].map((k) => <div key={k} style={{ height: 13, borderRadius: 7, background: "#E6E5F5", marginTop: 24, width: `${90 - k * 14}%` }} />)}
        <div style={{ position: "absolute", left: 34, right: 34, bottom: 60, height: 3, background: BLUE, opacity: 0.4 }} />
      </div>
      <Signature at={t(3.74)} x={500} y={400} width={290} color={BLUE} />
      <Dot x={850} y={130} at={t(4.64)} size={64} />
    </>
  );
};

// 2 — doc2sign already signs contracts and HR documents
const S2: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 60, display: "flex", justifyContent: "center", transform: `scale(${bounce(f, t(5.5))})` }}>
        <Img src={staticFile("doc2sign/logo-white.png")} style={{ width: 460 }} />
      </div>
      <Tile x={300} y={400} d={IC.doc} at={t(7.92)} label="Contratos" size={170} />
      <Dot x={370} y={325} at={t(8.2)} size={50} />
      <Tile x={680} y={400} d={IC.user} at={t(9.22)} label="Laborales" size={170} phase={1} />
      <Dot x={750} y={325} at={t(9.5)} size={50} />
    </>
  );
};

// 3 — sign and endorse electronic promissory notes
const S3: React.FC = () => {
  const f = useCurrentFrame();
  const endorse = f >= t(12.26);
  return (
    <>
      <Note x={270} y={110} w={440} at={t(10.5)} signAt={t(11.36)} />
      <div style={{ position: "absolute", left: 600, top: 330, transform: `rotate(-12deg) scale(${bounce(f, t(12.26))})`, opacity: endorse ? 1 : 0 }}>
        <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: GREEN, border: `5px solid ${GREEN}`, borderRadius: 14, padding: "4px 18px", background: "rgba(255,255,255,.95)", letterSpacing: "0.06em" }}>ENDOSADO</span>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 520, display: "flex", justifyContent: "center", gap: 18 }}>
        {[["Firmar", t(11.36)], ["Endosar", t(12.26)]].map(([l, at]) => (
          <span key={l as string} style={{ fontFamily: FONT, fontWeight: 800, fontSize: 36, color: NAVY, background: LILAC, borderRadius: 14, padding: "8px 26px", transform: `scale(${bounce(f, at as number)})`, opacity: f >= (at as number) ? 1 : 0 }}>{l}</span>
        ))}
      </div>
    </>
  );
};

// 4 — faster: sign the note, endorse it to the next holder, all digital
const S4: React.FC = () => {
  const f = useCurrentFrame();
  const p = interpolate(f, [t(19.06), t(19.7)], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 40, display: "flex", justifyContent: "center", transform: `scale(${bounce(f, t(16.2))})`, opacity: f >= t(16.2) ? 1 : 0 }}>
        <span style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: FONT, fontWeight: 800, fontSize: 46, color: "#fff" }}>
          <Icon d={IC.bolt} size={50} color={LILAC} sw={2.4} /> Más ágil
        </span>
      </div>
      <Tile x={170} y={380} d={IC.building} at={t(16.76)} label="Emisor" size={150} />
      <Tile x={830} y={380} d={IC.user} at={t(18.72)} label="Nuevo tenedor" size={150} phase={1} />
      <div style={{ position: "absolute", left: 290 + p * 210, top: 300, transform: `rotate(${-6 + p * 12}deg)` }}>
        <Note x={0} y={0} w={240} at={t(17.16)} />
      </div>
      <svg width={980} height={730} style={{ position: "absolute", left: 0, top: 0 }}>
        <path d="M270 560 L710 560 M685 535 L712 560 L685 585" stroke="#fff" strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={interpolate(f, [t(19.06), t(19.3)], [0, 1], clamp)} />
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 600, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 36, color: LILAC, opacity: interpolate(f, [t(19.3), t(19.6)], [0, 1], clamp) }}>Endoso digital</div>
    </>
  );
};

// 5 — doc2sign Pagarés
const S5: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 28 }}>
      <Img src={staticFile("doc2sign/logo-white.png")} style={{ width: 520, transform: `scale(${bounce(f, t(21.5))})` }} />
      <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 80, color: BLUE, background: "#fff", borderRadius: 24, padding: "2px 40px", transform: `scale(${bounce(f, t(22.24))})`, opacity: f >= t(22.24) ? 1 : 0 }}>Pagarés</span>
      <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 40, color: "#fff", transform: `scale(${bounce(f, t(23.22))})`, opacity: f >= t(23.22) ? 1 : 0 }}>Digitaliza el proceso en tu organización</span>
    </div>
  );
};

const SCENES: { from: number; to: number; C: React.FC }[] = [
  { from: 0.1, to: 5.36, C: S1 },
  { from: 5.36, to: 10.38, C: S2 },
  { from: 10.38, to: 13.84, C: S3 },
  { from: 13.84, to: 20.36, C: S4 },
  { from: 20.36, to: 26, C: S5 },
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
export const Doc2Sign6Video: React.FC = () => {
  const [handle] = useState(() => delayRender("Loading fonts"));
  useEffect(() => {
    fontsLoaded.then(() => continueRender(handle));
  }, [handle]);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Reframed />
      <Audio src={staticFile("music/doc2sign6.wav")} volume={0.07} />
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
