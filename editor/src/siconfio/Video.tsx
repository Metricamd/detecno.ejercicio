// SíConf.io — talking-head edit. Same base as the other brand edits (clip at
// 1.2×, subtitles on top, diagrams below the face) but its own look, taken
// from the Buen Fin reference: Barlow, SíConf.io blues on a light sky
// gradient, white subtitle card with highlighter key words, tabbed cards with
// the SAT list statuses. The speaker sat low in the frame, so the clip is
// reframed (scaled around the face and lifted) and gets gentle push-ins on
// the key moments.
import { loadFont } from "@remotion/fonts";
import React, { useEffect, useState } from "react";
import { AbsoluteFill, Audio, continueRender, delayRender, Easing, Img, interpolate, OffthreadVideo, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

export const SICONFIO_DURATION = 1447; // 48.23 s at 30 fps
const BLUE = "#2F6DB5";
const DEEP = "#0149AC";
const NAVY = "#1D3A73";
const SKY = "#A4CDF8";
const ICE = "#EEF6FF";
const RED = "#E5484D";
const GREEN = "#1FA971";
const GRAY = "#5A6B85";
const FONT = "Barlow";

const fontsLoaded = Promise.all(
  ["400", "500", "600", "700"].map((w) => loadFont({ family: FONT, url: staticFile(`fonts/barlow-latin-${w}-normal.woff2`), weight: w })),
);

const t = (sec: number) => Math.round(sec * 30);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const pop = (f: number, at: number) => interpolate(f, [at, at + 8], [0, 1], clamp);

/* ---------- reframing: scale around the face, lift it, push in on key beats ---------- */
const FACE = { x: 583, y: 920 }; // face centre in the 1080×1920 source
const TARGET = { x: 560, y: 720 }; // where the face sits after reframing
const BASE = 1.35;
const PUSHES = [8.9, 13.2, 37.6, 39.08]; // listas negras · siconf.io · cambia de estatus · te avisamos

const Reframed: React.FC = () => {
  const f = useCurrentFrame();
  let s = BASE;
  for (const p of PUSHES) {
    const a = t(p);
    s += 0.08 * interpolate(f, [a - 6, a + 10, a + 60, a + 80], [0, 1, 1, 0], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  }
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ transformOrigin: `${FACE.x}px ${FACE.y}px`, transform: `translate(${TARGET.x - FACE.x}px, ${TARGET.y - FACE.y}px) scale(${s})` }}>
        <OffthreadVideo src={staticFile("siconfio/video-1.2x.mp4")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------- subtitles (top) ---------- */
type W = [string, number];
// Whisper timings at 1.2×, text corrected by hand. Key words marked with *.
const PAGES: { words: W[]; end: number }[] = [
  { words: [["¿Has", 0.78], ["visto", 1.6], ["que", 2.08], ["el", 2.24], ["*SAT", 2.34], ["ha", 2.56], ["publicado", 2.74], ["muchas", 3.34], ["reglas", 3.68], ["relacionadas", 4.34], ["a", 5.02], ["la", 5.1], ["*materialidad?", 5.4]], end: 6.3 },
  { words: [["Y", 6.4], ["al", 6.52], ["tener", 6.74], ["relaciones", 7.0], ["con", 7.64], ["empresas", 7.96], ["listadas", 8.28], ["en", 8.68], ["las", 8.74], ["*listas", 8.94], ["*negras", 9.18], ["del", 9.42], ["SAT,", 9.64]], end: 10.4 },
  { words: [["te", 10.5], ["invito", 10.64], ["a", 10.9], ["crear", 11.02], ["una", 11.22], ["*cuenta", 11.42], ["*gratis", 11.78], ["en", 12.36], ["la", 12.44], ["página", 12.76]], end: 13.15 },
  { words: [["*siconf.io,", 13.22], ["*siconf.io,", 14.26]], end: 16.35 },
  { words: [["donde", 16.42], ["podrás", 16.68], ["*registrar", 17.56], ["*manualmente", 18.04], ["algunos", 18.98], ["RFC", 19.24], ["de", 19.92], ["tus", 20.04], ["proveedores", 20.22], ["o", 20.62], ["clientes,", 20.82]], end: 21.65 },
  { words: [["*cargar", 21.72], ["*un", 22.12], ["*Excel", 22.5], ["con", 22.74], ["la", 22.84], ["información", 23.04], ["de", 23.44], ["RFC", 23.58], ["de", 24.42], ["tus", 24.56], ["proveedores", 24.76], ["o", 25.04], ["clientes,", 25.22]], end: 26.45 },
  { words: [["o", 26.52], ["también", 26.6], ["*conectarte", 26.86], ["a", 27.16], ["nuestras", 27.38], ["*APIs", 27.76]], end: 28.35 },
  { words: [["para", 28.4], ["automatizar", 28.74], ["un", 29.58], ["proceso", 29.88], ["de", 30.08], ["*verificación", 30.24], ["*activo", 31.1], ["en", 31.7], ["las", 31.78], ["listas", 31.94], ["negras.", 32.14]], end: 32.9 },
  { words: [["Si", 32.98], ["alguno", 33.24], ["de", 33.4], ["tus", 33.56], ["proveedores,", 33.78], ["clientes", 34.5], ["o", 35.28], ["RFC", 35.56], ["que", 36.06], ["te", 36.2], ["interese", 36.34], ["validar", 36.76]], end: 37.5 },
  { words: [["*cambia", 37.6], ["*de", 37.78], ["*estatus", 37.98], ["en", 38.24], ["el", 38.36], ["SAT,", 38.52], ["*nosotros", 39.08], ["*te", 39.36], ["*avisamos.", 39.5]], end: 40.4 },
  { words: [["De", 40.48], ["igual", 40.62], ["forma", 40.9], ["podrás,", 41.16], ["dentro", 41.7], ["de", 41.86], ["la", 41.94], ["página,", 42.2], ["*buscar", 42.72], ["en", 42.9], ["las", 43.0], ["diferentes", 43.2], ["*listas", 43.6], ["*del", 43.84], ["*SAT,", 44.08]], end: 44.6 },
  { words: [["por", 44.64], ["si", 44.78], ["te", 44.84], ["da", 44.94], ["curiosidad", 45.14], ["buscar", 45.72], ["algún", 45.96], ["*RFC.", 46.1]], end: 48.23 },
];

const Subtitles: React.FC = () => {
  const f = useCurrentFrame();
  const sec = f / 30;
  const page = PAGES.find((p) => sec >= p.words[0][1] - 0.1 && sec < p.end);
  if (!page) return null;
  const start = t(page.words[0][1] - 0.1);
  const o = interpolate(f, [start, start + 5, t(page.end) - 4, t(page.end)], [0, 1, 1, 0], clamp);
  const x = interpolate(f, [start, start + 7], [-16, 0], clamp);
  return (
    <div style={{ position: "absolute", left: 70, right: 70, top: 190, display: "flex", justifyContent: "flex-start", opacity: o, transform: `translateX(${x}px)` }}>
      <div style={{ background: "rgba(255,255,255,.95)", borderRadius: 18, borderLeft: `10px solid ${DEEP}`, padding: "16px 28px", maxWidth: 940, fontFamily: FONT, fontWeight: 600, fontSize: 44, lineHeight: 1.22, color: NAVY, boxShadow: "0 14px 36px rgba(1,73,172,.18)" }}>
        {page.words.map(([w, at], i) => {
          const key = w.startsWith("*");
          const on = sec >= at - 0.05;
          return (
            <React.Fragment key={i}>
              {i ? " " : ""}
              <span style={{ color: key ? DEEP : NAVY, fontWeight: key ? 700 : 600, opacity: on ? 1 : 0.4, background: key && on ? `linear-gradient(transparent 58%, ${SKY}AA 58%)` : "none" }}>{key ? w.slice(1) : w}</span>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

/* ---------- shared bits ---------- */
const useIn = (from: number, to: number) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = spring({ frame: f - from, fps, config: { damping: 200 }, durationInFrames: 14 });
  const out = interpolate(f, [to - 8, to], [1, 0], clamp);
  return { visible: f >= from && f < to, o: Math.min(sp, out), y: (1 - sp) * 50 };
};

// tabbed card: a deep-blue tab with the step label sits on top of a light sky panel
const Card: React.FC<{ from: number; to: number; tab: string; children: React.ReactNode; top?: number }> = ({ from, to, tab, children, top = 1300 }) => {
  const { visible, o, y } = useIn(from, to);
  if (!visible) return null;
  return (
    <div style={{ position: "absolute", left: 70, right: 70, top, opacity: o, transform: `translateY(${y}px)`, fontFamily: FONT, color: NAVY }}>
      <div style={{ display: "inline-block", background: DEEP, color: "#fff", fontWeight: 700, fontSize: 24, letterSpacing: "0.08em", borderRadius: "16px 16px 0 0", padding: "10px 24px" }}>{tab}</div>
      <div style={{ background: `linear-gradient(160deg, #FFFFFF 0%, ${ICE} 55%, #D6E9FD 100%)`, borderRadius: "0 26px 26px 26px", padding: "26px 30px", boxShadow: "0 26px 60px rgba(1,40,110,.28)", border: "2px solid #fff" }}>{children}</div>
    </div>
  );
};

const Icon: React.FC<{ d: string; size?: number; color?: string; sw?: number }> = ({ d, size = 34, color = "#fff", sw = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
    <path d={d} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IC = {
  bank: "M3 21h18M5 21V10M19 21V10M9 21v-7M15 21v-7M12 3l9 5H3z",
  doc: "M7 3h7l5 5v13H7zM14 3v5h5M10 12h6M10 16h6",
  building: "M3 21h18M5 21V9l7-5 7 5v12M9 21v-6h6v6M9 11h.01M15 11h.01",
  link: "M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1",
  alert: "M12 3l10 18H2zM12 10v5M12 18v.01",
  check: "M5 12.5l4.5 4.5L19 7.5",
  pen: "M4 20l4-1 10-10-3-3L5 16zM14 7l3 3",
  sheet: "M4 4h16v16H4zM4 9h16M4 14h16M9 4v16",
  code: "M8 8l-4 4 4 4M16 8l4 4-4 4M14 5l-4 14",
  bell: "M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 20a2 2 0 0 0 4 0",
  search: "M10.5 4a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM15.5 15.5L20 20",
  radar: "M12 12l6-6M12 3a9 9 0 1 0 9 9M12 7a5 5 0 1 0 5 5",
};

const Badge: React.FC<{ d: string; bg?: string; size?: number }> = ({ d, bg = DEEP, size = 60 }) => (
  <div style={{ width: size, height: size, borderRadius: size * 0.28, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
    <Icon d={d} size={size * 0.55} />
  </div>
);

// status pill styled like the reference UI: red "En lista" / green "Sin coincidencias"
const Status: React.FC<{ bad: boolean; label?: string; scale?: number }> = ({ bad, label, scale = 1 }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: 22, color: bad ? RED : GREEN, background: bad ? "#FDECEC" : "#E4F6EE", borderRadius: 999, padding: "6px 14px", transform: `scale(${scale})`, whiteSpace: "nowrap" }}>
    <Icon d={bad ? IC.alert : IC.check} size={20} color={bad ? RED : GREEN} sw={2.6} />
    {label ?? (bad ? "En lista" : "Sin coincidencias")}
  </span>
);

const LISTS = ["Lista 69", "69-B", "No localizados"];

/* ---------- diagrams ---------- */
// 1 — the SAT keeps publishing materiality rules
const G1: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Card from={t(1.4)} to={t(6.3)} tab="SAT · MATERIALIDAD">
      <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
        <Badge d={IC.bank} size={84} bg={NAVY} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
          {[0, 1, 2].map((k) => (
            <div key={k} style={{ display: "flex", alignItems: "center", gap: 14, background: "#fff", borderRadius: 14, padding: "12px 16px", opacity: pop(f, t(3.3) + k * 6), transform: `translateX(${(1 - pop(f, t(3.3) + k * 6)) * 40}px)` }}>
              <Icon d={IC.doc} size={30} color={BLUE} />
              <div style={{ flex: 1, height: 10, borderRadius: 5, background: "#D9E6F7" }} />
              <span style={{ fontWeight: 700, fontSize: 20, color: DEEP }}>NUEVA REGLA</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

// 2 — doing business with companies on the SAT blacklists
const G2: React.FC = () => {
  const f = useCurrentFrame();
  const bad = pop(f, t(8.94));
  return (
    <Card from={t(6.45)} to={t(10.45)} tab="LISTAS NEGRAS DEL SAT">
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <Badge d={IC.building} size={72} />
          <span style={{ fontWeight: 600, fontSize: 24 }}>Tu empresa</span>
        </div>
        <div style={{ flex: 1, height: 4, background: bad > 0.5 ? RED : SKY, borderRadius: 2 }} />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <Badge d={IC.building} size={72} bg={bad > 0.5 ? RED : BLUE} />
          <span style={{ fontWeight: 600, fontSize: 24 }}>Proveedor</span>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 18 }}>
        {LISTS.map((l, k) => (
          <span key={l} style={{ fontWeight: 700, fontSize: 22, color: k === 1 && bad > 0.5 ? "#fff" : NAVY, background: k === 1 && bad > 0.5 ? RED : "#fff", borderRadius: 10, padding: "8px 16px", opacity: pop(f, t(8.94) + k * 4) }}>{l}</span>
        ))}
      </div>
    </Card>
  );
};

// 3 — create the free account
const G3: React.FC = () => {
  const f = useCurrentFrame();
  const url = "siconf.io";
  const typed = Math.round(interpolate(f, [t(13.2), t(13.9)], [0, url.length], clamp));
  return (
    <Card from={t(10.55)} to={t(16.4)} tab="CUENTA GRATIS">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
        <Img src={staticFile("siconfio/logo.png")} style={{ height: 92 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 14, width: "100%" }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 10, background: "#fff", borderRadius: 14, padding: "14px 20px", border: `2px solid ${SKY}` }}>
            <Icon d={IC.search} size={26} color={BLUE} />
            <span style={{ fontWeight: 600, fontSize: 30 }}>
              {url.slice(0, typed)}
              <span style={{ opacity: typed < url.length && f % 20 < 10 ? 1 : 0, color: DEEP }}>|</span>
            </span>
          </div>
          <span style={{ fontWeight: 700, fontSize: 28, color: "#fff", background: DEEP, borderRadius: 14, padding: "16px 22px", transform: `scale(${0.92 + 0.08 * pop(f, t(11.78))})` }}>Crea tu cuenta →</span>
        </div>
      </div>
    </Card>
  );
};

// 4 — three ways to load RFCs, then active verification
const G4: React.FC = () => {
  const f = useCurrentFrame();
  const ways = [
    { l: "Registro manual", sub: "Captura algunos RFC", d: IC.pen, at: t(17.56) },
    { l: "Carga de Excel", sub: "Clientes y proveedores", d: IC.sheet, at: t(21.72) },
    { l: "Conexión por API", sub: "Desde tu sistema", d: IC.code, at: t(26.86) },
  ];
  const active = pop(f, t(30.24));
  const spin = interpolate(f, [t(30.24), t(32.9)], [0, 540], clamp);
  return (
    <Card from={t(16.5)} to={t(32.95)} tab="AGREGA TUS RFC" top={1240}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {ways.map((w, k) => {
          const on = pop(f, w.at);
          return (
            <div key={w.l} style={{ display: "flex", alignItems: "center", gap: 16, background: "#fff", borderRadius: 16, padding: "12px 16px", border: `3px solid ${on > 0.5 ? DEEP : "transparent"}`, opacity: 0.35 + 0.65 * on }}>
              <span style={{ fontWeight: 700, fontSize: 28, color: SKY, width: 30 }}>{k + 1}</span>
              <Badge d={w.d} size={54} bg={on > 0.5 ? DEEP : "#9DB7DA"} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 30 }}>{w.l}</div>
                <div style={{ fontWeight: 500, fontSize: 21, color: GRAY }}>{w.sub}</div>
              </div>
              {on > 0.5 && <Icon d={IC.check} size={30} color={GREEN} sw={3} />}
            </div>
          );
        })}
        <div style={{ display: "flex", alignItems: "center", gap: 14, background: NAVY, borderRadius: 16, padding: "14px 18px", opacity: active, transform: `translateY(${(1 - active) * 16}px)` }}>
          <div style={{ transform: `rotate(${spin}deg)` }}>
            <Icon d={IC.radar} size={38} color={SKY} sw={2.4} />
          </div>
          <span style={{ fontWeight: 700, fontSize: 28, color: "#fff" }}>Verificación activa en las listas negras</span>
        </div>
      </div>
    </Card>
  );
};

// 5 — a status change triggers an alert
const G5: React.FC = () => {
  const f = useCurrentFrame();
  const changed = f >= t(37.6);
  const flip = spring({ frame: f - t(37.6), fps: 30, config: { damping: 10 } });
  const toast = spring({ frame: f - t(39.08), fps: 30, config: { damping: 14 } });
  return (
    <Card from={t(33.05)} to={t(40.45)} tab="MONITOREO">
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {[
          { n: "Proveedor A", watch: false },
          { n: "Proveedor B", watch: true },
          { n: "Cliente C", watch: false },
        ].map((r) => (
          <div key={r.n} style={{ display: "flex", alignItems: "center", gap: 14, background: "#fff", borderRadius: 14, padding: "12px 16px" }}>
            <Icon d={IC.building} size={30} color={BLUE} />
            <span style={{ flex: 1, fontWeight: 600, fontSize: 27 }}>{r.n}</span>
            {r.watch && changed ? <Status bad label="69-B" scale={0.8 + 0.2 * flip} /> : <Status bad={false} />}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 14, background: DEEP, borderRadius: 16, padding: "14px 18px", opacity: Math.min(1, toast), transform: `translateY(${(1 - Math.min(1, toast)) * 20}px)` }}>
        <Icon d={IC.bell} size={34} color="#fff" sw={2.2} />
        <span style={{ fontWeight: 700, fontSize: 28, color: "#fff" }}>Te avisamos: Proveedor B cambió de estatus</span>
      </div>
    </Card>
  );
};

// 6 — search any RFC across the SAT lists, then the close
const G6: React.FC = () => {
  const f = useCurrentFrame();
  const rfc = "XAXX010101000";
  const typed = Math.round(interpolate(f, [t(45.72), t(46.6)], [0, rfc.length], clamp));
  const tab = Math.min(2, Math.floor(interpolate(f, [t(43.2), t(44.4)], [0, 2.99], clamp)));
  const cta = pop(f, t(46.8));
  return (
    <>
      <Card from={t(40.55)} to={SICONFIO_DURATION + 30} tab="BUSCA EN LAS LISTAS DEL SAT" top={1240}>
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          {LISTS.map((l, k) => (
            <span key={l} style={{ flex: 1, textAlign: "center", fontWeight: 700, fontSize: 22, color: k === tab ? "#fff" : NAVY, background: k === tab ? DEEP : "#fff", borderRadius: 10, padding: "10px 0" }}>{l}</span>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, background: "#fff", borderRadius: 14, padding: "14px 18px", border: `2px solid ${SKY}` }}>
          <Icon d={IC.search} size={30} color={BLUE} sw={2.4} />
          <span style={{ flex: 1, fontWeight: 600, fontSize: 30, letterSpacing: "0.04em", color: typed ? NAVY : "#9DB0C9" }}>
            {typed ? rfc.slice(0, typed) : "Buscar RFC…"}
          </span>
          {typed === rfc.length && <Status bad={false} scale={pop(f, t(46.65))} />}
        </div>
      </Card>
      <div style={{ position: "absolute", left: 70, right: 70, top: 1600, display: "flex", alignItems: "center", justifyContent: "space-between", background: DEEP, borderRadius: 24, padding: "20px 26px", fontFamily: FONT, opacity: cta, transform: `translateY(${(1 - cta) * 20}px)`, boxShadow: "0 20px 46px rgba(1,73,172,.4)" }}>
        <span style={{ fontWeight: 700, fontSize: 40, color: "#fff", lineHeight: 1.05 }}>
          Crea tu cuenta gratis
          <br />
          <span style={{ color: SKY }}>siconf.io</span>
        </span>
        <div style={{ background: "#fff", borderRadius: 14, padding: "12px 16px" }}>
          <Img src={staticFile("siconfio/detecno.png")} style={{ height: 30, display: "block" }} />
        </div>
      </div>
    </>
  );
};

/* ---------- composition ---------- */
export const SiconfioVideo: React.FC = () => {
  const [handle] = useState(() => delayRender("Loading fonts"));
  useEffect(() => {
    fontsLoaded.then(() => continueRender(handle));
  }, [handle]);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Reframed />
      <Audio src={staticFile("music/siconfio.wav")} volume={0.035} />
      {/* top wash so the logo and subtitles sit on a calm area */}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(234,244,255,.55) 0%, rgba(234,244,255,0) 22%)" }} />
      {/* logo */}
      <div style={{ position: "absolute", left: 70, top: 60, background: "rgba(255,255,255,.96)", borderRadius: 20, padding: "14px 22px", boxShadow: "0 10px 28px rgba(1,73,172,.16)" }}>
        <Img src={staticFile("siconfio/logo.png")} style={{ height: 60, display: "block" }} />
      </div>
      <Subtitles />
      <G1 />
      <G2 />
      <G3 />
      <G4 />
      <G5 />
      <G6 />
    </AbsoluteFill>
  );
};
