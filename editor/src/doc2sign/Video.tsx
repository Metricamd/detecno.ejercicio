// doc2sign — talking-head edit. The source clip is played at 1.2× (pre-rendered
// to public/doc2sign/video-1.2x.mp4 with setpts + atempo). Corporate look from
// the brand reference: electric blue #2A1CE3, navy #17156C, white cards,
// Poppins. Subtitles sit at the top in a quiet navy box; diagrams live in the
// lower third so they never cover the speaker's face (y ≈ 750–1100).
import React, { useEffect, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, Img, interpolate, OffthreadVideo, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT, fontsLoaded } from "../fispal/theme";

export const DOC2SIGN_DURATION = 791; // 26.37 s at 30 fps
const BLUE = "#2A1CE3";
const NAVY = "#17156C";
const LILAC = "#B8B2FF";
const GREEN = "#12B886";
const AMBER = "#E8A317";
const t = (sec: number) => Math.round(sec * 30);

/* ---------- subtitles (top) ---------- */
type W = [string, number];
// Whisper timings at 1.2×, text corrected by hand. Key words marked with *.
const PAGES: { words: W[]; end: number }[] = [
  { words: [["Ya", 0.92], ["transformaste", 1.34], ["todo", 2.0], ["tu", 2.16], ["*proceso", 2.42], ["*laboral", 2.74], ["a", 2.94], ["*digital,", 3.22]], end: 3.9 },
  { words: [["pero", 4.08], ["sigues", 4.5], ["haciendo", 5.72], ["que", 5.96], ["los", 6.1], ["nuevos", 6.3], ["*candidatos", 6.68]], end: 7.1 },
  { words: [["firmen", 7.18], ["su", 7.44], ["*paquete", 7.62], ["*de", 7.86], ["*contratación", 8.14], ["de", 8.52], ["manera", 8.66], ["*autógrafa,", 8.96]], end: 9.75 },
  { words: [["aunque", 9.84], ["el", 9.98], ["*recibo", 10.16], ["*de", 10.42], ["*nómina", 10.6], ["lo", 10.82], ["sigan", 10.98], ["firmando", 11.22], ["de", 11.5], ["*puño", 11.6], ["*y", 11.74], ["*letra,", 11.84]], end: 12.75 },
  { words: [["te", 12.86], ["invito", 12.98], ["a", 13.22], ["crear", 13.34], ["una", 13.54], ["cuenta", 13.86], ["en", 14.2], ["nuestra", 14.34], ["plataforma", 14.9]], end: 15.35 },
  { words: [["*doc2sign.com,", 15.42]], end: 17.25 },
  { words: [["doc,", 17.36], ["el", 17.54], ["número", 17.7], ["*2,", 17.98]], end: 19.0 },
  { words: [["donde", 19.12], ["podrás", 19.48], ["crear", 19.76], ["una", 19.96], ["*cuenta", 20.14], ["*gratis", 20.5]], end: 21.0 },
  { words: [["y", 21.08], ["empezar", 21.34], ["a", 21.46], ["*firmar", 21.64], ["*digitalmente,", 22.1]], end: 22.7 },
  { words: [["cumpliendo", 22.76], ["con", 23.24], ["lo", 23.32], ["dispuesto", 23.54], ["en", 23.86], ["la", 23.9], ["*Ley", 24.04], ["*Federal", 24.16], ["*del", 24.34], ["*Trabajo.", 24.5]], end: 26.37 },
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
    <div style={{ position: "absolute", left: 90, right: 90, top: 230, display: "flex", justifyContent: "center", opacity: o, transform: `translateY(${y}px)` }}>
      <div style={{ background: "rgba(23,21,108,.86)", borderRadius: 22, padding: "18px 30px", maxWidth: 900, textAlign: "center", fontFamily: FONT, fontWeight: 500, fontSize: 40, lineHeight: 1.3, color: "#fff", boxShadow: "0 12px 30px rgba(10,8,60,.25)" }}>
        {page.words.map(([w, at], i) => {
          const key = w.startsWith("*");
          const on = sec >= at - 0.05;
          return (
            <span key={i} style={{ color: key ? LILAC : "#fff", fontWeight: key ? 600 : 500, opacity: on ? 1 : 0.45 }}>
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

const pop = (f: number, at: number) => interpolate(f, [at, at + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

const Card: React.FC<{ from: number; to: number; children: React.ReactNode; top?: number }> = ({ from, to, children, top = 1330 }) => {
  const { visible, o, y } = useIn(from, to);
  if (!visible) return null;
  return (
    <div style={{ position: "absolute", left: 90, right: 90, top, opacity: o, transform: `translateY(${y}px)`, background: "#fff", borderRadius: 32, padding: "30px 34px", boxShadow: "0 24px 60px rgba(10,8,60,.28)", fontFamily: FONT, color: NAVY }}>
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
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c0-4.4 3.6-8 8-8s8 3.6 8 8",
  folder: "M3 7h6l2 2h10v10H3z",
  cash: "M3 7h18v10H3zM12 9.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM6 12h.01M18 12h.01",
  check: "M5 12.5l4.5 4.5L19 7.5",
  doc: "M7 3h7l5 5v13H7zM14 3v5h5M10 12h6M10 16h6",
  pen: "M4 20l4-1 10-10-3-3L5 16zM14 7l3 3",
  globe: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c2.5 2.5 3.8 5.5 3.8 9s-1.3 6.5-3.8 9M12 3C9.5 5.5 8.2 8.5 8.2 12s1.3 6.5 3.8 9",
  lock: "M6 11h12v10H6zM8 11V8a4 4 0 0 1 8 0v3",
  scale: "M12 3v18M5 7h14M5 7l-3 6a3 3 0 0 0 6 0zM19 7l-3 6a3 3 0 0 0 6 0zM8 21h8",
  shield: "M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z",
};

const Badge: React.FC<{ d: string; bg?: string; size?: number }> = ({ d, bg = BLUE, size = 64 }) => (
  <div style={{ width: size, height: size, borderRadius: size * 0.3, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
    <Icon d={d} size={size * 0.55} />
  </div>
);

const Title: React.FC<{ children: React.ReactNode; sub?: string }> = ({ children, sub }) => (
  <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 22 }}>
    <span style={{ fontWeight: 600, fontSize: 36 }}>{children}</span>
    {sub && <span style={{ fontWeight: 500, fontSize: 22, color: "#6B6F9A", letterSpacing: "0.06em" }}>{sub}</span>}
  </div>
);

// a hand-drawn signature, revealed with stroke-dashoffset
const Signature: React.FC<{ at: number; color?: string; width?: number }> = ({ at, color = NAVY, width = 300 }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [at, at + 24], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <svg width={width} height={width * 0.3} viewBox="0 0 200 60">
      <path d="M6 44c10-30 22-34 20-12-1 14-8 18-6 4 3-18 18-26 22-10 2 10-4 14-2 4 3-12 14-12 16 0 1 8 6 8 12-2 5-9 10-10 12 0 2 8 8 6 14-2 6-8 14-8 18 2 3 7 10 6 18-2 8-7 16-6 26-4" fill="none" stroke={color} strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={p} />
    </svg>
  );
};

/* ---------- diagrams ---------- */
const G1: React.FC = () => {
  const f = useCurrentFrame();
  const steps = [
    { l: "Reclutamiento", i: IC.user, at: t(1.6) },
    { l: "Expediente", i: IC.folder, at: t(2.2) },
    { l: "Nómina", i: IC.cash, at: t(2.8) },
  ];
  return (
    <Card from={t(0.85)} to={t(3.95)}>
      <Title sub="100% DIGITAL">Proceso laboral</Title>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {steps.map((s, k) => (
          <React.Fragment key={s.l}>
            {k > 0 && <div style={{ flex: 1, height: 4, borderRadius: 2, background: BLUE, opacity: pop(f, s.at) }} />}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, opacity: 0.3 + 0.7 * pop(f, s.at) }}>
              <div style={{ position: "relative" }}>
                <Badge d={s.i} size={78} />
                <div style={{ position: "absolute", right: -8, bottom: -8, width: 32, height: 32, borderRadius: 16, background: GREEN, border: "3px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${pop(f, s.at + 4)})` }}>
                  <Icon d={IC.check} size={18} sw={3.2} />
                </div>
              </div>
              <span style={{ fontWeight: 500, fontSize: 24 }}>{s.l}</span>
            </div>
          </React.Fragment>
        ))}
      </div>
    </Card>
  );
};

const G2: React.FC = () => {
  const f = useCurrentFrame();
  const docs = ["Contrato individual de trabajo", "Aviso de privacidad", "Reglamento interior"];
  return (
    <Card from={t(6.5)} to={t(9.8)}>
      <Title sub="NUEVO INGRESO">Paquete de contratación</Title>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {docs.map((d, k) => (
          <div key={d} style={{ display: "flex", alignItems: "center", gap: 18, background: "#F3F2FF", borderRadius: 18, padding: "14px 18px", opacity: pop(f, t(7.4) + k * 5) }}>
            <Icon d={IC.doc} size={34} color={BLUE} />
            <span style={{ flex: 1, fontWeight: 500, fontSize: 26 }}>{d}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 600, fontSize: 20, color: AMBER, opacity: pop(f, t(8.96)) }}>
              <Icon d={IC.pen} size={22} color={AMBER} /> En papel
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};

const G3: React.FC = () => (
  <Card from={t(10.0)} to={t(12.8)}>
    <Title sub="QUINCENA 21">Recibo de nómina</Title>
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: "#5B5F86", fontWeight: 500 }}>
      <span>Percepciones</span>
      <span style={{ color: NAVY, fontWeight: 600 }}>$18,450.00</span>
    </div>
    <div style={{ height: 2, background: "#E6E5F5", margin: "16px 0 6px" }} />
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
      <div>
        <Signature at={t(11.55)} />
        <div style={{ width: 300, height: 2, background: NAVY, opacity: 0.4 }} />
        <span style={{ fontSize: 20, color: "#6B6F9A" }}>Firma del trabajador</span>
      </div>
      <span style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 600, fontSize: 22, color: AMBER }}>
        <Icon d={IC.pen} size={24} color={AMBER} /> De puño y letra
      </span>
    </div>
  </Card>
);

const G4: React.FC = () => {
  const f = useCurrentFrame();
  const url = "doc2sign.com";
  const typed = Math.round(interpolate(f, [t(15.3), t(16.1)], [0, url.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  return (
    <Card from={t(13.0)} to={t(17.3)}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#F3F2FF", borderRadius: 999, padding: "12px 20px" }}>
        {["#FF6B6B", "#F7C948", "#3DDC97"].map((c) => <span key={c} style={{ width: 12, height: 12, borderRadius: 6, background: c }} />)}
        <Icon d={IC.lock} size={22} color={GREEN} />
        <span style={{ fontWeight: 500, fontSize: 26 }}>
          {url.slice(0, typed)}
          <span style={{ opacity: typed < url.length && f % 20 < 10 ? 1 : 0, color: BLUE }}>|</span>
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 26 }}>
        <Img src={staticFile("doc2sign/logo-blue.png")} style={{ height: 70 }} />
        <span style={{ fontWeight: 600, fontSize: 24, color: "#fff", background: BLUE, borderRadius: 14, padding: "12px 22px", transform: `scale(${0.9 + 0.1 * pop(f, t(15.42))})`, opacity: 0.4 + 0.6 * pop(f, t(15.42)) }}>Crear cuenta</span>
      </div>
    </Card>
  );
};

const G5: React.FC = () => {
  const f = useCurrentFrame();
  const two = spring({ frame: f - t(17.95), fps: 30, config: { damping: 12 } });
  return (
    <Card from={t(17.3)} to={t(19.05)}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontWeight: 600, fontSize: 92, letterSpacing: "-0.03em", color: NAVY, padding: "6px 0" }}>
        <span>doc</span>
        <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 112, height: 112, borderRadius: 56, background: BLUE, color: "#fff", transform: `scale(${0.6 + 0.4 * two})` }}>2</span>
        <span>sign</span>
      </div>
      <div style={{ textAlign: "center", fontWeight: 500, fontSize: 24, color: "#6B6F9A", letterSpacing: "0.08em" }}>DOC · EL NÚMERO 2 · SIGN</div>
    </Card>
  );
};

const G6: React.FC = () => {
  const f = useCurrentFrame();
  const items = [
    { l: "Cuenta gratis", at: t(20.5) },
    { l: "Firma digital", at: t(21.64) },
  ];
  return (
    <Card from={t(19.15)} to={t(22.7)}>
      <div style={{ display: "flex", gap: 26, alignItems: "center" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
          {items.map((i) => (
            <div key={i.l} style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 46, height: 46, borderRadius: 23, background: pop(f, i.at) > 0.5 ? GREEN : "#E6E5F5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon d={IC.check} size={26} sw={3} color={pop(f, i.at) > 0.5 ? "#fff" : "#B5B3D6"} />
              </div>
              <span style={{ fontWeight: 600, fontSize: 32 }}>{i.l}</span>
            </div>
          ))}
        </div>
        <div style={{ width: 330, background: "#F3F2FF", borderRadius: 22, padding: "16px 18px", border: `2px solid ${BLUE}33` }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: BLUE, letterSpacing: "0.06em" }}>FIRMA ELECTRÓNICA</div>
          <Signature at={t(21.7)} color={BLUE} width={290} />
          <div style={{ height: 2, background: BLUE, opacity: 0.35 }} />
        </div>
      </div>
    </Card>
  );
};

const G7: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      <Card from={t(22.8)} to={DOC2SIGN_DURATION + 30} top={1290}>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <Badge d={IC.scale} size={92} bg={NAVY} />
          <div>
            <div style={{ fontWeight: 500, fontSize: 24, color: "#6B6F9A" }}>Cumpliendo con lo dispuesto en la</div>
            <div style={{ fontWeight: 600, fontSize: 40, lineHeight: 1.1, opacity: 0.35 + 0.65 * pop(f, t(24.04)) }}>Ley Federal del Trabajo</div>
          </div>
        </div>
      </Card>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1560, display: "flex", justifyContent: "center", opacity: pop(f, t(24.9)), transform: `translateY(${(1 - pop(f, t(24.9))) * 20}px)` }}>
        <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 40, color: "#fff", background: BLUE, borderRadius: 22, padding: "20px 40px", boxShadow: "0 18px 44px rgba(42,28,227,.45)", lineHeight: 1.15, textAlign: "center" }}>
          Crea tu cuenta gratis
          <br />
          en doc2sign.com
        </div>
      </div>
    </>
  );
};

/* ---------- composition ---------- */
export const Doc2SignVideo: React.FC = () => {
  const [handle] = useState(() => delayRender("Loading fonts"));
  useEffect(() => {
    fontsLoaded.then(() => continueRender(handle));
  }, [handle]);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <OffthreadVideo src={staticFile("doc2sign/video-1.2x.mp4")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      {/* logo */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 90, display: "flex", justifyContent: "center" }}>
        <div style={{ background: "rgba(255,255,255,.94)", borderRadius: 999, padding: "16px 34px", boxShadow: "0 10px 30px rgba(10,8,60,.18)" }}>
          <Img src={staticFile("doc2sign/logo-blue.png")} style={{ height: 50, display: "block" }} />
        </div>
      </div>
      <Subtitles />
      <G1 />
      <G2 />
      <G3 />
      <G4 />
      <G5 />
      <G6 />
      <G7 />
    </AbsoluteFill>
  );
};
