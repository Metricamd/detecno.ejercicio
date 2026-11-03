// Fispal #2 — "¿Tienes un ERP, un POS, un sistema de nómina…?" (integración por
// APIs). Fispal line (Poppins, purple #250E94, green accent #20D99D, white
// tiles, glass illustrations) on the newer layout: clip at 1.2× with the
// silences cut (public/fispal2/video.mp4), reframed with jump-cut zooms,
// diagrams on a purple stage at the top and subtitles at the bottom.
import React, { useEffect, useState } from "react";
import { AbsoluteFill, Audio, continueRender, delayRender, Easing, Img, interpolate, OffthreadVideo, spring, staticFile, useCurrentFrame } from "remotion";
import { Illus } from "../fispal/Illus";
import { FONT, fontsLoaded } from "../fispal/theme";

export const FISPAL2_DURATION = 859; // 28.63 s at 30 fps
const BLUE = "#250E94";
const NAVY = "#170861";
const LILAC = "#20D99D";
const AMBER = "#F2A019";
const GREEN = "#12B886";

const t = (sec: number) => Math.round(sec * 30);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const bounce = (f: number, at: number) => spring({ frame: f - at, fps: 30, config: { damping: 11, stiffness: 150 } });

/* ---------- reframing with jump-cut zooms on the silence cuts ---------- */
const FACE = { x: 500, y: 780 };
const TARGET = { x: 540, y: 1110 };
const CUTS = [0, 1.912, 4.575, 8.089, 12.728, 15.612, 24.087];

const Reframed: React.FC = () => {
  const f = useCurrentFrame();
  const sec = f / 30;
  let k = 0;
  while (k + 1 < CUTS.length && sec >= CUTS[k + 1]) k++;
  const s = (k % 2 ? 1.56 : 1.45) + Math.min(sec - CUTS[k], 6) * 0.006;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ transformOrigin: `${FACE.x}px ${FACE.y}px`, transform: `translate(${TARGET.x - FACE.x}px, ${TARGET.y - FACE.y}px) scale(${s})` }}>
        <OffthreadVideo src={staticFile("fispal2/video.mp4")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------- subtitles (bottom) ---------- */
type W = [string, number];
const PAGES: { words: W[]; end: number }[] = [
  { words: [["¿Tienes", 0.2], ["un", 0.54], ["sistema", 0.92], ["*ERP,", 1.46], ["un", 2.18], ["sistema", 2.56], ["*POS,", 2.8], ["un", 3.5], ["sistema", 3.84], ["de", 4.0], ["*nómina", 4.12]], end: 4.8 },
  { words: [["y", 4.86], ["te", 5.02], ["interesa", 5.26], ["poder", 5.84], ["dar", 6.02], ["a", 6.12], ["tus", 6.28], ["clientes", 6.58], ["un", 7.06], ["*módulo", 7.22], ["*de", 7.42], ["*auditoría?", 7.66]], end: 8.24 },
  { words: [["Te", 8.3], ["invito", 8.4], ["a", 8.68], ["*integrarte", 8.94], ["*por", 9.52], ["*APIs", 9.7], ["a", 10.26], ["nuestro", 10.44], ["servicio", 10.82], ["llamado", 11.18], ["*fispal.mx,", 11.6]], end: 12.94 },
  { words: [["que", 13.0], ["*automáticamente", 13.42], ["está", 14.26], ["bajando", 14.42], ["las", 14.68], ["*facturas", 14.86], ["*del", 15.14], ["*SAT,", 15.36]], end: 15.84 },
  { words: [["y", 15.9], ["por", 16.08], ["APIs", 16.34], ["podemos", 16.68], ["ejecutar", 16.92], ["*compulsas", 17.32]], end: 18.36 },
  { words: [["entre", 18.42], ["lo", 18.6], ["que", 18.72], ["tú", 18.88], ["tienes", 19.08], ["en", 19.22], ["la", 19.28], ["*contabilidad", 19.42], ["y", 20.18], ["lo", 20.26], ["que", 20.36], ["está", 20.46], ["en", 20.54], ["el", 20.64], ["*SAT,", 20.82]], end: 21.32 },
  { words: [["y", 21.38], ["darle", 21.62], ["un", 21.98], ["*valor", 22.14], ["*agregado", 22.34], ["a", 22.64], ["tus", 22.72], ["clientes", 23.0]], end: 23.26 },
  { words: [["para", 23.32], ["que", 23.48], ["*nunca", 23.76], ["tengan", 24.42], ["una", 24.68], ["*diferencia", 24.94], ["con", 25.32], ["el", 25.46], ["SAT", 25.66]], end: 25.78 },
  { words: [["y,", 25.84], ["por", 26.02], ["ende,", 26.22], ["alguna", 26.78], ["*multa", 27.08], ["o", 27.52], ["*atenta", 27.88], ["*invitación.", 28.1]], end: 28.63 },
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
      <div style={{ background: "rgba(37,14,148,.9)", borderRadius: 22, padding: "16px 30px", maxWidth: 940, textAlign: "center", fontFamily: FONT, fontWeight: 500, fontSize: 40, lineHeight: 1.3, color: "#fff", boxShadow: "0 12px 30px rgba(10,8,60,.25)" }}>
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
  pos: "M5 3h14v10H5zM8 7h8M3 21h18M7 13v8M17 13v8",
  arrows: "M4 9h14l-3-3M20 15H6l3 3",
  gift: "M3 9h18v4H3zM5 13v8h14v-8M12 9v12M12 9c-1.5-3-5-3-5-1s3 1 5 1c2 0 5 0 5-1s-3.5-2-5 1",
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
// 1 — your ERP, POS or payroll system, and your clients
const S1: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      <Tile x={190} y={210} d={IC.server} at={t(1.46)} label="ERP" size={150} />
      <Tile x={490} y={210} d={IC.pos} at={t(2.8)} label="POS" size={150} phase={1} />
      <Tile x={790} y={210} d={IC.cash} at={t(4.12)} label="Nómina" size={150} phase={2} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 470, display: "flex", justifyContent: "center", transform: `scale(${bounce(f, t(7.22))})`, opacity: f >= t(7.22) ? 1 : 0 }}>
        <span style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: FONT, fontWeight: 700, fontSize: 40, color: NAVY, background: "#fff", borderRadius: 20, padding: "14px 30px" }}>
          <Icon d={IC.search} size={44} color={BLUE} sw={2.4} /> Módulo de auditoría
        </span>
      </div>
    </>
  );
};

// 2 — integrate with fispal.mx through APIs
const S2: React.FC = () => {
  const f = useCurrentFrame();
  const p = interpolate(f, [t(9.52), t(10.0)], [0, 1], clamp);
  return (
    <>
      <Tile x={190} y={300} d={IC.server} at={t(8.4)} label="Tu sistema" size={180} />
      <svg width={980} height={730} style={{ position: "absolute", left: 0, top: 0 }}>
        <path d="M300 300 L560 300" stroke={LILAC} strokeWidth={8} strokeLinecap="round" strokeDasharray="10 14" opacity={p} />
      </svg>
      <div style={{ position: "absolute", left: 380, top: 220, fontFamily: FONT, fontWeight: 800, fontSize: 34, color: LILAC, opacity: p }}>API</div>
      <div style={{ position: "absolute", left: 590, top: 210, width: 330, height: 180, borderRadius: 40, background: "#fff", boxShadow: "0 24px 50px rgba(0,0,0,.35)", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${bounce(f, t(11.6))})`, opacity: f >= t(11.6) ? 1 : 0 }}>
        <Img src={staticFile("brand/fispal-logo.png")} style={{ width: 250 }} />
      </div>
      <Illus name="integraciones" at={t(9.7)} x={490} y={560} size={230} />
    </>
  );
};

// 3 — automatic download of the SAT invoices
const S3: React.FC = () => {
  const f = useCurrentFrame();
  const n = Math.round(interpolate(f, [t(14.4), t(15.7)], [0, 1248], clamp));
  return (
    <>
      <Illus name="nube-descarga" at={t(13.1)} x={300} y={330} size={330} />
      <div style={{ position: "absolute", left: 540, top: 220, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, background: "#fff", borderRadius: 30, padding: "26px 40px", boxShadow: "0 24px 50px rgba(0,0,0,.35)", transform: `scale(${bounce(f, t(14.86))})`, opacity: f >= t(14.86) ? 1 : 0 }}>
        <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 84, color: BLUE }}>{n.toLocaleString("en-US")}</span>
        <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 30, color: NAVY }}>CFDI del SAT</span>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 600, textAlign: "center", fontFamily: FONT, fontWeight: 700, fontSize: 36, color: LILAC, opacity: interpolate(f, [t(13.42), t(13.7)], [0, 1], clamp) }}>Descarga automática</div>
    </>
  );
};

// 4 — reconciliation: your books vs the SAT
const S4: React.FC = () => {
  const f = useCurrentFrame();
  const rows = ["F-2291", "F-2304", "F-2310"];
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 50, display: "flex", justifyContent: "center", gap: 60, fontFamily: FONT, fontWeight: 800, fontSize: 36, color: "#fff" }}>
        <span style={{ opacity: pop(f, t(19.42)) }}>Contabilidad</span>
        <span style={{ color: LILAC, opacity: pop(f, t(17.32)) }}>vs</span>
        <span style={{ opacity: pop(f, t(20.82)) }}>SAT</span>
      </div>
      <div style={{ position: "absolute", left: 120, right: 120, top: 150, display: "flex", flexDirection: "column", gap: 18 }}>
        {rows.map((r, k) => {
          const at = t(19.6) + k * 8;
          return (
            <div key={r} style={{ display: "flex", alignItems: "center", gap: 20, background: "#fff", borderRadius: 20, padding: "16px 24px", opacity: f >= at ? 1 : 0.3, fontFamily: FONT }}>
              <span style={{ fontWeight: 800, fontSize: 30, color: BLUE, width: 150 }}>{r}</span>
              <div style={{ flex: 1, height: 12, borderRadius: 6, background: "#E6E5F5" }} />
              <Icon d={IC.arrows} size={36} color="#B5B3D6" sw={2.2} />
              <div style={{ flex: 1, height: 12, borderRadius: 6, background: "#E6E5F5" }} />
              <div style={{ width: 46, height: 46, borderRadius: 23, background: GREEN, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${bounce(f, at + 4)})` }}>
                <Icon d={IC.check} size={28} color="#fff" sw={3.4} />
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 560, textAlign: "center", fontFamily: FONT, fontWeight: 700, fontSize: 36, color: LILAC, opacity: pop(f, t(17.32)) }}>Compulsa automática</div>
    </>
  );
};

// 5 — added value for your clients: no differences, no fines
const S5: React.FC = () => {
  const f = useCurrentFrame();
  const fines = [["Multas", t(27.08)], ["Cartas invitación", t(28.1)]] as const;
  return (
    <>
      <Tile x={490} y={170} d={IC.gift} at={t(22.14)} label="Valor agregado para tus clientes" size={150} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 400, display: "flex", justifyContent: "center", transform: `scale(${bounce(f, t(23.76))})`, opacity: f >= t(23.76) ? 1 : 0 }}>
        <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, color: NAVY, background: LILAC, borderRadius: 18, padding: "10px 34px" }}>Cero diferencias con el SAT</span>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 540, display: "flex", justifyContent: "center", gap: 20 }}>
        {fines.map(([l, at]) => (
          <span key={l} style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: FONT, fontWeight: 700, fontSize: 32, color: "#fff", border: `3px solid ${AMBER}`, borderRadius: 16, padding: "8px 22px", textDecoration: "line-through", textDecorationColor: AMBER, transform: `scale(${bounce(f, at)})`, opacity: f >= at ? 1 : 0 }}>{l}</span>
        ))}
      </div>
    </>
  );
};

const pop = (f: number, at: number) => interpolate(f, [at, at + 8], [0, 1], clamp);

const SCENES: { from: number; to: number; C: React.FC }[] = [
  { from: 0.1, to: 8.26, C: S1 },
  { from: 8.26, to: 12.96, C: S2 },
  { from: 12.96, to: 15.86, C: S3 },
  { from: 15.86, to: 21.34, C: S4 },
  { from: 21.34, to: 29.5, C: S5 },
];

const Stage: React.FC = () => {
  const f = useCurrentFrame();
  const enter = spring({ frame: f, fps: 30, config: { damping: 200 }, durationInFrames: 14 });
  return (
    <div style={{ position: "absolute", left: 50, top: 150, width: 980, height: 730, borderRadius: 48, overflow: "hidden", background: `linear-gradient(155deg, #3A1FC0 0%, ${BLUE} 55%, ${NAVY} 100%)`, boxShadow: "0 30px 70px rgba(10,6,90,.4)", opacity: enter, transform: `translateY(${(1 - enter) * -40}px)` }}>
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
export const Fispal2Video: React.FC = () => {
  const [handle] = useState(() => delayRender("Loading fonts"));
  useEffect(() => {
    fontsLoaded.then(() => continueRender(handle));
  }, [handle]);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Reframed />
      <Audio src={staticFile("music/fispal2.wav")} volume={0.035} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 40, display: "flex", justifyContent: "center" }}>
        <div style={{ background: "rgba(255,255,255,.96)", borderRadius: 999, padding: "14px 32px", boxShadow: "0 10px 26px rgba(10,8,60,.2)" }}>
          <Img src={staticFile("brand/fispal-logo.png")} style={{ height: 52, display: "block" }} />
        </div>
      </div>
      <Stage />
      <Subtitles />
    </AbsoluteFill>
  );
};
