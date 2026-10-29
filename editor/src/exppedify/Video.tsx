// Exppedify — talking-head edit, same treatment as the doc2sign piece: the
// clip plays at 1.2× (pre-rendered to public/exppedify/video-1.2x.mp4), quiet
// subtitles at the top, diagrams in the lower third so the face (y ≈ 690–1020)
// stays clear. Look from the Exppedify Brand Toolkit: indigo base, white cards
// with soft borders, turquoise for emphasis and CTA, lavender accents,
// Montserrat for titles and Noto Sans standing in for Canva Sans, and the
// indigo · cyan · turquoise band closing the frame.
import { loadFont } from "@remotion/fonts";
import React, { useEffect, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, Img, interpolate, OffthreadVideo, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

export const EXPPEDIFY_DURATION = 961; // 32.04 s at 30 fps

const INDIGO = "#140E68";
const VIVID = "#2815DD";
const LAVENDER = "#915CFF";
const CYAN = "#00CEFF";
const TURQ = "#3DEAB7";
const INK = "#16155C";
const GRAY = "#4C4A66";
const ICE = "#F4F3FC";
const RED = "#E5484D";
const TITLE = "Montserrat";
const SANS = "Noto Sans";

const fontsLoaded = Promise.all([
  ...["600", "700"].map((w) => loadFont({ family: TITLE, url: staticFile(`fonts/montserrat-latin-${w}-normal.woff2`), weight: w })),
  ...["400", "500", "600"].map((w) => loadFont({ family: SANS, url: staticFile(`fonts/noto-sans-latin-${w}-normal.woff2`), weight: w })),
]);

const t = (sec: number) => Math.round(sec * 30);
const pop = (f: number, at: number) => interpolate(f, [at, at + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

/* ---------- subtitles (top) ---------- */
type W = [string, number];
// Whisper timings at 1.2×, text corrected by hand. Key words marked with *.
const PAGES: { words: W[]; end: number }[] = [
  { words: [["¿Llevas", 0.8], ["un", 1.04], ["departamento", 1.18], ["de", 1.62], ["*Contraloría", 1.82]], end: 2.6 },
  { words: [["y", 2.68], ["estás", 2.94], ["gestionando", 3.24], ["*muchos", 4.16], ["*documentos", 4.52], ["que", 5.68], ["te", 5.8], ["llegan", 5.92], ["por", 6.18], ["*correo?", 6.42]], end: 7.0 },
  { words: [["Te", 7.08], ["invito", 7.18], ["a", 7.38], ["crear", 7.48], ["una", 7.66], ["cuenta", 7.8], ["en", 7.98], ["*exppedify.com,", 8.2]], end: 9.05 },
  { words: [["donde", 9.14], ["podrás", 9.42], ["*programar", 9.9], ["de", 10.2], ["manera", 10.34], ["*recurrente", 10.72]], end: 11.5 },
  { words: [["que", 11.6], ["los", 11.7], ["expedientes", 11.94], ["siempre", 12.74], ["estén", 12.9], ["*actualizados.", 13.1]], end: 14.0 },
  { words: [["Hemos", 14.1], ["visto", 14.34], ["muchos", 14.58], ["casos", 14.88], ["donde", 15.14], ["piden", 15.36], ["en", 15.62], ["procesos", 15.8], ["de", 16.06], ["*onboarding", 16.24], ["documentos", 16.64]], end: 17.7 },
  { words: [["que", 17.82], ["se", 18.3], ["*olvida", 18.46], ["pedirlos", 18.84], ["de", 19.08], ["nuevo", 19.22], ["en", 19.36], ["los", 19.42], ["*siguientes", 19.54], ["*años.", 19.9]], end: 20.6 },
  { words: [["Con", 20.68], ["*Exppedify", 20.9], ["podrás", 21.38], ["garantizar", 21.68], ["que", 22.12], ["tu", 22.24], ["departamento", 22.48], ["tenga", 23.02]], end: 23.5 },
  { words: [["siempre", 23.58], ["*expedientes", 23.95], ["*actualizados", 24.35], ["de", 24.9], ["*clientes,", 25.5], ["de", 26.32], ["*proveedores,", 26.48], ["de", 27.22], ["*colaboradores", 27.44]], end: 28.5 },
  { words: [["y", 28.6], ["que", 28.86], ["finalmente", 29.1], ["*nunca", 29.54], ["*pongas", 29.8], ["*en", 30.0], ["*riesgo", 30.14], ["la", 30.32], ["organización.", 30.48]], end: 32.04 },
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
    <div style={{ position: "absolute", left: 90, right: 90, top: 250, display: "flex", justifyContent: "center", opacity: o, transform: `translateY(${y}px)` }}>
      <div style={{ background: "rgba(20,14,104,.88)", borderRadius: 20, padding: "18px 30px", maxWidth: 900, textAlign: "center", fontFamily: SANS, fontWeight: 500, fontSize: 40, lineHeight: 1.3, color: "#fff", boxShadow: "0 12px 30px rgba(10,8,60,.25)" }}>
        {page.words.map(([w, at], i) => {
          const key = w.startsWith("*");
          const on = sec >= at - 0.05;
          return (
            <span key={i} style={{ color: key ? TURQ : "#fff", fontWeight: key ? 600 : 500, opacity: on ? 1 : 0.45 }}>
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

const Card: React.FC<{ from: number; to: number; children: React.ReactNode; top?: number }> = ({ from, to, children, top = 1330 }) => {
  const { visible, o, y } = useIn(from, to);
  if (!visible) return null;
  return (
    <div style={{ position: "absolute", left: 90, right: 90, top, opacity: o, transform: `translateY(${y}px)`, background: "#fff", border: "2px solid #E4E1FA", borderRadius: 30, padding: "30px 34px", boxShadow: "0 24px 60px rgba(20,14,104,.25)", fontFamily: SANS, color: INK }}>
      {children}
    </div>
  );
};

const Icon: React.FC<{ d: string; size?: number; color?: string; sw?: number }> = ({ d, size = 34, color = "#fff", sw = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
    <path d={d} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IC = {
  mail: "M3 6h18v12H3zM3 6l9 7 9-7",
  clip: "M20 11l-8 8a5 5 0 0 1-7-7l8-8a3.5 3.5 0 0 1 5 5l-8 8a2 2 0 0 1-3-3l7-7",
  check: "M5 12.5l4.5 4.5L19 7.5",
  repeat: "M17 2l4 4-4 4M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4M21 13v2a3 3 0 0 1-3 3H3",
  folder: "M3 7h6l2 2h10v10H3z",
  alert: "M12 3l10 18H2zM12 10v5M12 18v.01",
  lock: "M6 11h12v10H6zM8 11V8a4 4 0 0 1 8 0v3",
  shield: "M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z",
  calendar: "M4 6h16v14H4zM4 10h16M8 3v4M16 3v4",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c0-4.4 3.6-8 8-8s8 3.6 8 8",
  truck: "M3 7h11v9H3zM14 10h4l3 3v3h-7M7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM17 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  team: "M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2 20c0-3.9 3.1-7 7-7s7 3.1 7 7M16 4a3.5 3.5 0 0 1 0 7M18 13c2.4.8 4 3.3 4 6",
};

const Badge: React.FC<{ d: string; bg?: string; size?: number; color?: string }> = ({ d, bg = VIVID, size = 64, color = "#fff" }) => (
  <div style={{ width: size, height: size, borderRadius: size * 0.3, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
    <Icon d={d} size={size * 0.55} color={color} />
  </div>
);

const Title: React.FC<{ children: React.ReactNode; tag?: string }> = ({ children, tag }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
    <span style={{ fontFamily: TITLE, fontWeight: 700, fontSize: 34, color: INK }}>{children}</span>
    {tag && <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: 20, color: INK, background: TURQ, padding: "6px 14px", letterSpacing: "0.04em" }}>{tag}</span>}
  </div>
);

const Check: React.FC<{ on: number; size?: number }> = ({ on, size = 40 }) => (
  <div style={{ width: size, height: size, borderRadius: size / 2, background: TURQ, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${on})`, flexShrink: 0 }}>
    <Icon d={IC.check} size={size * 0.6} sw={3} color={INK} />
  </div>
);

/* ---------- diagrams ---------- */
// 1 — documents arriving by email
const G1: React.FC = () => {
  const f = useCurrentFrame();
  const mails = [
    { l: "Constancia de situación fiscal", at: t(4.5) },
    { l: "Opinión de cumplimiento", at: t(5.0) },
    { l: "Acta constitutiva", at: t(5.5) },
  ];
  const n = Math.round(interpolate(f, [t(4.2), t(6.6)], [3, 27], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  return (
    <Card from={t(1.7)} to={t(7.0)}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Badge d={IC.mail} size={56} />
          <span style={{ fontFamily: TITLE, fontWeight: 700, fontSize: 32 }}>Contraloría · Correo</span>
        </div>
        <span style={{ fontFamily: TITLE, fontWeight: 700, fontSize: 24, color: "#fff", background: LAVENDER, borderRadius: 999, padding: "6px 16px", minWidth: 44, textAlign: "center" }}>{n}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {mails.map((m, k) => (
          <div key={m.l} style={{ display: "flex", alignItems: "center", gap: 16, background: ICE, borderRadius: 16, padding: "14px 18px", opacity: pop(f, m.at), transform: `translateX(${(1 - pop(f, m.at)) * 30}px)` }}>
            <Icon d={IC.clip} size={28} color={LAVENDER} />
            <span style={{ flex: 1, fontWeight: 500, fontSize: 26 }}>{m.l}.pdf</span>
            <span style={{ fontSize: 20, color: GRAY }}>{["Hoy", "Hoy", "Ayer"][k]}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

// 2 — create the account
const G2: React.FC = () => {
  const f = useCurrentFrame();
  const url = "exppedify.com";
  const typed = Math.round(interpolate(f, [t(8.1), t(8.8)], [0, url.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  return (
    <Card from={t(7.05)} to={t(9.1)}>
      <Img src={staticFile("exppedify/logo.png")} style={{ height: 74, display: "block", margin: "0 auto 22px" }} />
      <div style={{ display: "flex", alignItems: "center", gap: 12, background: ICE, borderRadius: 999, padding: "12px 22px" }}>
        <Icon d={IC.lock} size={24} color={TURQ} sw={2.4} />
        <span style={{ flex: 1, fontWeight: 500, fontSize: 28 }}>
          {url.slice(0, typed)}
          <span style={{ opacity: typed < url.length && f % 20 < 10 ? 1 : 0, color: VIVID }}>|</span>
        </span>
        <span style={{ fontWeight: 600, fontSize: 22, color: INK, background: TURQ, padding: "8px 16px", opacity: pop(f, t(8.7)) }}>Crea tu cuenta</span>
      </div>
    </Card>
  );
};

// 3 — recurring request keeps the file up to date
const G3: React.FC = () => {
  const f = useCurrentFrame();
  const spin = interpolate(f, [t(10.7), t(11.6)], [0, 360], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cycles = ["Solicitud", "Recepción", "Expediente"];
  return (
    <Card from={t(9.2)} to={t(14.0)}>
      <Title tag="RECURRENTE">Solicitud programada</Title>
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{ transform: `rotate(${spin}deg)` }}>
          <Badge d={IC.repeat} size={86} bg={VIVID} />
        </div>
        <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
          {cycles.map((c, k) => (
            <React.Fragment key={c}>
              {k > 0 && <div style={{ flex: 1, height: 3, background: `linear-gradient(90deg, ${LAVENDER}, ${CYAN})`, opacity: pop(f, t(10.4) + k * 6) }} />}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: 0.35 + 0.65 * pop(f, t(10.4) + k * 6) }}>
                <div style={{ width: 22, height: 22, borderRadius: 11, background: k === 2 ? TURQ : LAVENDER }} />
                <span style={{ fontWeight: 500, fontSize: 21, color: GRAY }}>{c}</span>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 22, opacity: pop(f, t(13.1)) }}>
        <Check on={pop(f, t(13.1))} size={38} />
        <span style={{ fontFamily: TITLE, fontWeight: 700, fontSize: 28 }}>Expedientes siempre actualizados</span>
      </div>
    </Card>
  );
};

// 4 — onboarding documents never requested again
const G4: React.FC = () => {
  const f = useCurrentFrame();
  const years = [
    { y: "Onboarding", ok: true, at: t(16.2) },
    { y: "Año 2", ok: false, at: t(19.0) },
    { y: "Año 3", ok: false, at: t(19.6) },
  ];
  return (
    <Card from={t(14.1)} to={t(20.6)}>
      <Title>Documentos por año</Title>
      <div style={{ display: "flex", gap: 16 }}>
        {years.map((y) => (
          <div key={y.y} style={{ flex: 1, background: ICE, borderRadius: 20, padding: "18px 12px", display: "flex", flexDirection: "column", alignItems: "center", gap: 12, opacity: 0.35 + 0.65 * pop(f, y.at), border: `2px solid ${y.ok ? TURQ : pop(f, y.at) > 0.5 ? RED : "transparent"}` }}>
            <Icon d={IC.folder} size={46} color={y.ok ? VIVID : GRAY} />
            <span style={{ fontFamily: TITLE, fontWeight: 600, fontSize: 22 }}>{y.y}</span>
            {y.ok ? (
              <Check on={pop(f, y.at)} size={34} />
            ) : (
              <span style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 600, fontSize: 19, color: RED, opacity: pop(f, y.at) }}>
                <Icon d={IC.alert} size={20} color={RED} /> Sin solicitar
              </span>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

// 5 — up-to-date files for clients, suppliers and staff
const G5: React.FC = () => {
  const f = useCurrentFrame();
  const groups = [
    { l: "Clientes", i: IC.user, at: t(25.5) },
    { l: "Proveedores", i: IC.truck, at: t(26.48) },
    { l: "Colaboradores", i: IC.team, at: t(27.44) },
  ];
  return (
    <Card from={t(20.7)} to={t(28.55)}>
      <Title tag="ACTUALIZADOS">Expedientes</Title>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {groups.map((g) => (
          <div key={g.l} style={{ display: "flex", alignItems: "center", gap: 18, background: ICE, borderRadius: 18, padding: "14px 18px", opacity: 0.4 + 0.6 * pop(f, g.at) }}>
            <Badge d={g.i} size={52} bg={pop(f, g.at) > 0.5 ? VIVID : "#B9B4E8"} />
            <span style={{ flex: 1, fontFamily: TITLE, fontWeight: 600, fontSize: 28 }}>{g.l}</span>
            <Check on={pop(f, g.at + 4)} size={38} />
          </div>
        ))}
      </div>
    </Card>
  );
};

// 6 — close: no risk for the organisation + CTA
const G6: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      <Card from={t(28.6)} to={EXPPEDIFY_DURATION + 30} top={1300}>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ position: "relative" }}>
            <Badge d={IC.shield} size={96} bg={INDIGO} />
            <div style={{ position: "absolute", right: -6, bottom: -6 }}>
              <Check on={pop(f, t(30.1))} size={40} />
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 500, fontSize: 24, color: GRAY }}>Expedientes completos,</div>
            <div style={{ fontFamily: TITLE, fontWeight: 700, fontSize: 38, lineHeight: 1.12 }}>sin poner en riesgo a la organización</div>
          </div>
        </div>
      </Card>
      <div style={{ position: "absolute", left: 90, right: 90, top: 1560, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, background: INDIGO, borderRadius: 30, padding: "24px 30px", boxShadow: "0 20px 50px rgba(20,14,104,.4)", opacity: pop(f, t(30.6)), transform: `translateY(${(1 - pop(f, t(30.6))) * 20}px)` }}>
        <Img src={staticFile("exppedify/logo-white.png")} style={{ height: 62 }} />
        <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: 26, color: INK, background: TURQ, padding: "14px 20px", lineHeight: 1.15, textAlign: "center" }}>
          Crea tu cuenta en
          <br />
          exppedify.com
        </span>
      </div>
    </>
  );
};

/* ---------- composition ---------- */
export const ExppedifyVideo: React.FC = () => {
  const [handle] = useState(() => delayRender("Loading fonts"));
  useEffect(() => {
    fontsLoaded.then(() => continueRender(handle));
  }, [handle]);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <OffthreadVideo src={staticFile("exppedify/video-1.2x.mp4")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      {/* logo */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 90, display: "flex", justifyContent: "center" }}>
        <div style={{ background: "rgba(255,255,255,.95)", borderRadius: 999, padding: "16px 34px", boxShadow: "0 10px 30px rgba(20,14,104,.18)" }}>
          <Img src={staticFile("exppedify/logo.png")} style={{ height: 56, display: "block" }} />
        </div>
      </div>
      <Subtitles />
      <G1 />
      <G2 />
      <G3 />
      <G4 />
      <G5 />
      <G6 />
      {/* brand band */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 14, display: "flex" }}>
        <div style={{ flex: 1, background: TURQ }} />
        <div style={{ flex: 1, background: CYAN }} />
        <div style={{ flex: 1, background: VIVID }} />
      </div>
    </AbsoluteFill>
  );
};
