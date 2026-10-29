// Fispal — talking-head edit, same treatment as the doc2sign and Exppedify
// pieces (clip at 1.2×, quiet subtitles on top, diagrams in the lower third so
// the face at y ≈ 680–1040 stays clear) in Fispal's own line: Poppins, purple
// #250E94 with the green accent, white cards and the glass illustrations of
// the reels popping in beside each card.
import React, { useEffect, useState } from "react";
import { AbsoluteFill, Audio, continueRender, delayRender, Img, interpolate, OffthreadVideo, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Illus } from "../fispal/Illus";
import { C, FONT, fontsLoaded, MONO } from "../fispal/theme";

export const FISPAL_VIDEO_DURATION = 1070; // 35.65 s at 30 fps
const P = C.purple;
const G = C.accent;
const AMBER = "#F2A019";
const t = (sec: number) => Math.round(sec * 30);
const pop = (f: number, at: number) => interpolate(f, [at, at + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

/* ---------- subtitles (top) ---------- */
type W = [string, number];
// Whisper timings at 1.2×, text corrected by hand. Key words marked with *.
const PAGES: { words: W[]; end: number }[] = [
  { words: [["¿Llevas", 0.98], ["un", 1.26], ["departamento", 1.44], ["*fiscal", 2.16], ["o", 2.52], ["*contable", 2.72], ["en", 2.98], ["una", 3.08], ["empresa", 3.38]], end: 3.85 },
  { words: [["y", 3.9], ["te", 4.06], ["preocupa", 4.4], ["saber", 4.86], ["si", 5.3], ["la", 5.42], ["información", 5.68], ["que", 5.96], ["tiene", 6.14], ["el", 6.3], ["*SAT", 6.5]], end: 7.2 },
  { words: [["*cuadra", 7.28], ["contra", 7.7], ["lo", 7.84], ["que", 7.92], ["tiene", 8.06], ["su", 8.22], ["*contabilidad?", 8.46]], end: 9.5 },
  { words: [["Y", 9.56], ["hoy", 9.72], ["día", 9.94], ["estás", 10.14], ["bajando", 10.4], ["*reportes", 10.82], ["*de", 11.12], ["*Excel", 11.3], ["del", 11.48], ["buzón", 11.58], ["tributario", 11.82]], end: 12.45 },
  { words: [["o", 12.52], ["haciendo", 12.76], ["*compulsas", 13.1], ["*manualmente,", 13.98]], end: 15.05 },
  { words: [["te", 15.12], ["invito", 15.24], ["a", 15.46], ["crear", 15.6], ["una", 15.8], ["*cuenta", 16.0], ["*gratis", 16.34], ["en", 16.74], ["*fispal.mx,", 17.04]], end: 18.6 },
  { words: [["donde", 18.66], ["de", 18.84], ["manera", 18.98], ["*automática", 19.34], ["el", 19.82], ["sistema", 20.08], ["*baja", 20.46], ["*las", 20.66], ["*facturas", 20.84], ["que", 21.08], ["están", 21.2], ["en", 21.34], ["el", 21.44], ["SAT", 21.64]], end: 22.25 },
  { words: [["y", 22.34], ["ya", 22.5], ["sea", 22.68], ["por", 23.02], ["un", 23.14], ["*Excel", 23.45], ["o", 24.0], ["que", 24.1], ["te", 24.22], ["conectes", 24.4], ["a", 24.64], ["nuestras", 24.76], ["*APIs,", 25.24]], end: 25.85 },
  { words: [["podrás", 25.9], ["*automatizar", 26.4], ["el", 26.92], ["proceso", 27.08], ["de", 27.32], ["*compulsa", 27.58]], end: 28.45 },
  { words: [["entre", 28.54], ["lo", 28.68], ["que", 28.76], ["está", 28.88], ["en", 28.96], ["el", 29.04], ["*SAT", 29.24], ["y", 29.82], ["lo", 29.92], ["que", 30.04], ["está", 30.24], ["en", 30.56], ["tu", 30.72], ["*sistema", 31.02], ["*contable.", 31.26]], end: 31.85 },
  { words: [["Y", 31.92], ["*anticiparte", 32.28], ["y", 32.86], ["*corregir", 33.04], ["cualquier", 33.92], ["*diferencia", 34.26], ["que", 34.52], ["pueda", 34.66], ["existir.", 34.82]], end: 35.65 },
];

const Subtitles: React.FC = () => {
  const f = useCurrentFrame();
  const sec = f / 30;
  const page = PAGES.find((p) => sec >= p.words[0][1] - 0.1 && sec < p.end);
  if (!page) return null;
  const start = t(page.words[0][1] - 0.1);
  const o = interpolate(f, [start, start + 5, t(page.end) - 4, t(page.end)], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const y = interpolate(f, [start, start + 6], [10, 0], { extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: 90, right: 90, top: 240, display: "flex", justifyContent: "center", opacity: o, transform: `translateY(${y}px)` }}>
      <div style={{ background: "rgba(37,14,148,.88)", borderRadius: 22, padding: "18px 30px", maxWidth: 900, textAlign: "center", fontFamily: FONT, fontWeight: 500, fontSize: 40, lineHeight: 1.3, color: "#fff", boxShadow: "0 12px 30px rgba(20,8,90,.25)" }}>
        {page.words.map(([w, at], i) => {
          const key = w.startsWith("*");
          const on = sec >= at - 0.05;
          return (
            <span key={i} style={{ color: key ? G : "#fff", fontWeight: key ? 600 : 500, opacity: on ? 1 : 0.45 }}>
              {(i ? " " : "") + (key ? w.slice(1) : w)}
            </span>
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
  const out = interpolate(f, [to - 8, to], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return { visible: f >= from && f < to, o: Math.min(sp, out), y: (1 - sp) * 40 };
};

const Card: React.FC<{ from: number; to: number; children: React.ReactNode; top?: number; illus?: string }> = ({ from, to, children, top = 1360, illus }) => {
  const { visible, o, y } = useIn(from, to);
  if (!visible) return null;
  return (
    <>
      <div style={{ position: "absolute", left: 90, right: 90, top, opacity: o, transform: `translateY(${y}px)`, background: "#fff", borderRadius: 32, padding: "30px 34px", boxShadow: "0 24px 60px rgba(37,14,148,.25)", fontFamily: FONT, color: C.text }}>
        {children}
      </div>
      {illus && <Illus name={illus} at={from + 4} out={to - 8} x={900} y={top - 60} size={210} />}
    </>
  );
};

const Icon: React.FC<{ d: string; size?: number; color?: string; sw?: number }> = ({ d, size = 34, color = "#fff", sw = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
    <path d={d} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IC = {
  bank: "M3 21h18M5 21V10M19 21V10M9 21v-7M15 21v-7M12 3l9 5H3z",
  book: "M4 4h11a3 3 0 0 1 3 3v13H7a3 3 0 0 1-3-3zM18 20H7a3 3 0 0 1 0-6h11",
  sheet: "M4 4h16v16H4zM4 9h16M4 14h16M9 4v16",
  clock: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3 2",
  check: "M5 12.5l4.5 4.5L19 7.5",
  down: "M12 4v11M7 10l5 5 5-5M5 20h14",
  code: "M8 8l-4 4 4 4M16 8l4 4-4 4M14 5l-4 14",
  doc: "M7 3h7l5 5v13H7zM14 3v5h5M10 12h6M10 16h6",
  alert: "M12 3l10 18H2zM12 10v5M12 18v.01",
  arrow: "M4 12h15M13 6l6 6-6 6",
};

const Badge: React.FC<{ d: string; bg?: string; size?: number }> = ({ d, bg = P, size = 64 }) => (
  <div style={{ width: size, height: size, borderRadius: size * 0.3, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
    <Icon d={d} size={size * 0.55} />
  </div>
);

const Title: React.FC<{ children: React.ReactNode; tag?: string }> = ({ children, tag }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
    <span style={{ fontWeight: 700, fontSize: 34, color: P }}>{children}</span>
    {tag && <span style={{ fontWeight: 600, fontSize: 20, color: C.accentDark, background: C.mint, borderRadius: 999, padding: "6px 16px", letterSpacing: "0.04em" }}>{tag}</span>}
  </div>
);

const Tick: React.FC<{ on: number; size?: number; color?: string; d?: string }> = ({ on, size = 38, color = G, d = IC.check }) => (
  <div style={{ width: size, height: size, borderRadius: size / 2, background: color, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${on})`, flexShrink: 0 }}>
    <Icon d={d} size={size * 0.6} sw={3} />
  </div>
);

/* ---------- diagrams ---------- */
// 1 — does the SAT information match your books?
const G1: React.FC = () => {
  const f = useCurrentFrame();
  const q = spring({ frame: f - t(7.28), fps: 30, config: { damping: 10 } });
  const Side: React.FC<{ d: string; l: string; at: number }> = ({ d, l, at }) => (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 12, background: C.bg, borderRadius: 24, padding: "22px 10px", opacity: 0.3 + 0.7 * pop(f, at) }}>
      <Badge d={d} size={76} />
      <span style={{ fontWeight: 600, fontSize: 27, color: P }}>{l}</span>
    </div>
  );
  return (
    <Card from={t(1.0)} to={t(9.5)} illus="lupa">
      <Title tag="FISCAL · CONTABLE">¿La información cuadra?</Title>
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <Side d={IC.bank} l="SAT" at={t(6.5)} />
        <div style={{ width: 84, height: 84, borderRadius: 42, background: G, color: "#fff", fontWeight: 800, fontSize: 46, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${q})`, flexShrink: 0 }}>?</div>
        <Side d={IC.book} l="Contabilidad" at={t(8.46)} />
      </div>
    </Card>
  );
};

// 2 — manual reports and reconciliations
const G2: React.FC = () => {
  const f = useCurrentFrame();
  const files = ["Reporte buzón tributario", "Emitidos del mes", "Recibidos del mes"];
  return (
    <Card from={t(9.6)} to={t(15.05)} illus="reloj-alerta">
      <Title tag="MANUAL">Hoy</Title>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {files.map((l, k) => (
          <div key={l} style={{ display: "flex", alignItems: "center", gap: 16, background: C.bg, borderRadius: 16, padding: "12px 18px", opacity: pop(f, t(10.8) + k * 5), transform: `translateX(${(1 - pop(f, t(10.8) + k * 5)) * 30}px)` }}>
            <Badge d={IC.sheet} size={44} bg="#1D9A5B" />
            <span style={{ flex: 1, fontWeight: 500, fontSize: 25 }}>{l}.xlsx</span>
            <Icon d={IC.down} size={26} color={C.inactive} sw={2.4} />
          </div>
        ))}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 4, opacity: pop(f, t(13.1)) }}>
          <Tick on={pop(f, t(13.1))} size={38} color={AMBER} d={IC.clock} />
          <span style={{ fontWeight: 600, fontSize: 27, color: AMBER }}>Compulsa manual, renglón por renglón</span>
        </div>
      </div>
    </Card>
  );
};

// 3 — create the free account
const G3: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Card from={t(15.15)} to={t(18.6)}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
        <Img src={staticFile("brand/fispal-logo.png")} style={{ height: 96 }} />
        <span style={{ fontWeight: 700, fontSize: 34, color: "#fff", background: G, borderRadius: 999, padding: "16px 40px", boxShadow: "0 14px 34px rgba(32,217,157,.45)", transform: `scale(${0.9 + 0.1 * pop(f, t(16.34))})` }}>Crea tu cuenta gratis →</span>
        <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 28, color: P, opacity: pop(f, t(17.04)) }}>● fispal.mx</span>
      </div>
    </Card>
  );
};

// 4 — invoices downloaded automatically from the SAT
const G4: React.FC = () => {
  const f = useCurrentFrame();
  const n = Math.round(interpolate(f, [t(20.5), t(22.1)], [0, 1248], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  return (
    <Card from={t(18.7)} to={t(22.3)} illus="nube-descarga">
      <Title tag="AUTOMÁTICO">Descarga del SAT</Title>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <Badge d={IC.bank} size={72} />
        <div style={{ flex: 1, position: "relative", height: 72, overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 34, left: 0, right: 0, height: 4, background: C.lavender, borderRadius: 2 }} />
          {[0, 1, 2, 3].map((k) => {
            const x = ((f - t(20.4) + k * 9) % 36) / 36;
            return f >= t(20.4) ? (
              <div key={k} style={{ position: "absolute", top: 14, left: `${x * 88}%` }}>
                <Icon d={IC.doc} size={40} color={P} />
              </div>
            ) : null;
          })}
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", background: C.mint, borderRadius: 20, padding: "10px 18px" }}>
          <span style={{ fontWeight: 800, fontSize: 34, color: C.accentDark }}>{n.toLocaleString("en-US")}</span>
          <span style={{ fontWeight: 600, fontSize: 18, color: C.accentDark }}>CFDI</span>
        </div>
      </div>
    </Card>
  );
};

// 5 — via Excel or the APIs
const G5: React.FC = () => {
  const f = useCurrentFrame();
  const opts = [
    { l: "Excel", sub: "Carga tu archivo", d: IC.sheet, bg: "#1D9A5B", at: t(23.45) },
    { l: "APIs", sub: "Conecta tu sistema", d: IC.code, bg: P, at: t(25.24) },
  ];
  return (
    <Card from={t(22.4)} to={t(25.9)} illus="integraciones">
      <Title>Tu sistema contable</Title>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {opts.map((o, k) => (
          <React.Fragment key={o.l}>
            {k > 0 && <span style={{ fontWeight: 600, fontSize: 24, color: C.inactive }}>o</span>}
            <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 14, background: C.bg, borderRadius: 22, padding: "18px 18px", border: `3px solid ${pop(f, o.at) > 0.5 ? G : "transparent"}`, opacity: 0.35 + 0.65 * pop(f, o.at) }}>
              <Badge d={o.d} size={60} bg={o.bg} />
              <div>
                <div style={{ fontWeight: 700, fontSize: 30, color: P }}>{o.l}</div>
                <div style={{ fontWeight: 500, fontSize: 20, color: "#5E6480" }}>{o.sub}</div>
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </Card>
  );
};

// 6 + 7 — automatic reconciliation SAT vs books, then fix the difference
const ROWS = ["F-2291", "F-2304", "F-2310", "F-2315"];
const G6: React.FC = () => {
  const f = useCurrentFrame();
  const diff = 2; // the row that does not match
  const fixed = pop(f, t(33.04));
  return (
    <>
      <Card from={t(25.95)} to={FISPAL_VIDEO_DURATION + 30} top={1290} illus="engranes">
        <Title tag="COMPULSA">SAT vs. sistema contable</Title>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {ROWS.map((r, k) => {
            const at = t(29.24) + k * 6;
            const bad = k === diff && f >= t(34.26) - 30;
            const isDiff = k === diff;
            const ok = !isDiff || fixed > 0.5;
            return (
              <div key={r} style={{ display: "flex", alignItems: "center", gap: 14, background: isDiff && !ok ? "#FFF4E0" : C.bg, borderRadius: 14, padding: "10px 16px", opacity: 0.35 + 0.65 * pop(f, at), border: `2px solid ${isDiff && bad && !ok ? AMBER : "transparent"}` }}>
                <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 22, color: P, width: 110 }}>{r}</span>
                <span style={{ flex: 1, fontWeight: 500, fontSize: 21, color: "#5E6480" }}>SAT</span>
                <Icon d={IC.arrow} size={24} color={C.inactive} />
                <span style={{ flex: 1, fontWeight: 500, fontSize: 21, color: "#5E6480", textAlign: "right" }}>Contabilidad</span>
                {isDiff && !ok ? <Tick on={pop(f, at + 4)} size={34} color={AMBER} d={IC.alert} /> : <Tick on={pop(f, at + 4)} size={34} />}
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 14, fontWeight: 600, fontSize: 24, color: fixed > 0.5 ? C.accentDark : AMBER, opacity: pop(f, t(32.28)) }}>
          {fixed > 0.5 ? "Diferencia corregida a tiempo" : "1 diferencia detectada"}
        </div>
      </Card>
    </>
  );
};

/* ---------- composition ---------- */
export const FispalTalkVideo: React.FC = () => {
  const [handle] = useState(() => delayRender("Loading fonts"));
  useEffect(() => {
    fontsLoaded.then(() => continueRender(handle));
  }, [handle]);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <OffthreadVideo src={staticFile("fispal-video/video-1.2x.mp4")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      <Audio src={staticFile("music/fispal-video.wav")} volume={0.035} />
      {/* logo */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 90, display: "flex", justifyContent: "center" }}>
        <div style={{ background: "rgba(255,255,255,.95)", borderRadius: 999, padding: "14px 34px", boxShadow: "0 10px 30px rgba(37,14,148,.18)" }}>
          <Img src={staticFile("brand/fispal-logo.png")} style={{ height: 56, display: "block" }} />
        </div>
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
