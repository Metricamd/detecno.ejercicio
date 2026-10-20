// Carrusel 6 · parrilla 2 — "No encontramos esa factura."
// Theme: night (deep navy with blue and violet glows), no ribbon. Same grid
// as carruseles 4–5 (margins of 80, eyebrow at 180, content ends ≤1180) with
// its own compositions: a speech bubble with time bars, a stacked word list,
// a criteria toggle panel and a full-bleed photo close. Text verbatim.
import React from "react";
import { FONT, MONO } from "../fispal/theme";
import { Carousel, Frame, Glass3D, Icon, IC, Photo, themed, THEMES, Title } from "./kit";

const t = themed(THEMES.night);
const N = 4;
const BLUE = "#5FA0FF";
const MINT = "#5CF0B4";
const CORAL = "#FF7A7A";
const P = "#250E94";
const L = 80;
const CW = 1080 - 2 * L;
const GLASS: React.CSSProperties = { background: "rgba(255,255,255,.08)", border: "1.5px solid rgba(255,255,255,.2)", borderRadius: 32 };

const Eyebrow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ position: "absolute", left: L, top: 180, display: "flex", alignItems: "center", gap: 14, fontFamily: MONO, fontWeight: 700, fontSize: 24, letterSpacing: "0.14em", color: BLUE }}>
    <span style={{ width: 44, height: 5, borderRadius: 3, background: BLUE }} />
    {children}
  </div>
);

/* 1 — the phrase in a speech bubble, the speaker, and 2 vs 30 minutes */
const S1: React.FC = () => (
  <Frame t={t} i={0} n={N} ribbon={false}>
    <Eyebrow>LA FRASE</Eyebrow>
    <div style={{ position: "absolute", left: L, width: CW, top: 240, boxSizing: "border-box", background: "#fff", borderRadius: 40, padding: "40px 44px", boxShadow: "0 30px 70px rgba(0,0,0,.35)" }}>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 82, lineHeight: 1.04, letterSpacing: "-0.03em", color: P }}>“No encontramos esa factura.”</div>
      {/* bubble tail */}
      <div style={{ position: "absolute", left: 120, bottom: -34, width: 0, height: 0, borderLeft: "26px solid transparent", borderRight: "26px solid transparent", borderTop: "36px solid #fff" }} />
    </div>
    <Photo name="c6-llamada" hint="Asistente al teléfono encogiéndose de hombros" position="50% 30%" radius="50%" ring={BLUE} style={{ left: L + 20, top: 560, width: 300, height: 300 }} />
    <Glass3D name="factura-rota" x={760} y={700} size={380} />
    <div style={{ position: "absolute", left: L, right: L, top: 920 }}>
      <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 44, lineHeight: 1.2, color: t.ink }}>
        La frase que puede convertir una búsqueda de <span style={{ color: MINT }}>2 minutos</span> en una de <span style={{ color: CORAL }}>30.</span>
      </div>
      <div style={{ marginTop: 26, display: "flex", flexDirection: "column", gap: 12 }}>
        {[
          { w: 0.07, c: MINT, l: "2 min" },
          { w: 1, c: CORAL, l: "30 min" },
        ].map((b) => (
          <div key={b.l} style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 760 * b.w, minWidth: 54, height: 22, borderRadius: 11, background: b.c, boxShadow: `0 0 24px ${b.c}88` }} />
            <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 24, color: b.c }}>{b.l}</span>
          </div>
        ))}
      </div>
    </div>
  </Frame>
);

/* 2 — the stacked word list, the swirl, and the closing card */
const WORDS = ["Carpetas.", "Correos.", "Excel.", "Descargas."];

const S2: React.FC = () => (
  <Frame t={t} i={1} n={N} ribbon={false}>
    <Eyebrow>EL CAOS</Eyebrow>
    <Glass3D name="torbellino" x={830} y={450} size={420} />
    <div style={{ position: "absolute", left: L, top: 240 }}>
      {WORDS.map((w, k) => (
        <div key={w} style={{ fontFamily: FONT, fontWeight: 800, fontSize: 92, lineHeight: 1.06, letterSpacing: "-0.03em", color: `rgba(255,255,255,${1 - k * 0.18})` }}>{w}</div>
      ))}
    </div>
    <div style={{ position: "absolute", left: L, right: L, top: 700 }}>
      <Title t={t} size={52} parts={["Y nadie sabe ", { hl: "exactamente dónde quedó." }]} />
    </div>
    <div style={{ position: "absolute", left: L, width: CW, top: 930, boxSizing: "border-box", padding: "34px 40px", display: "flex", alignItems: "center", gap: 28, ...GLASS }}>
      <Icon d={IC.alert} size={64} color={CORAL} />
      <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 38, color: "#fff", lineHeight: 1.22 }}>
        Cuando tienes miles de CFDI, <span style={{ color: CORAL }}>buscar manualmente deja de ser práctico.</span>
      </span>
    </div>
  </Frame>
);

/* 3 — Fispal: headline, criteria toggle panel next to the glass filters */
const CRITERIA = ["RFC", "UUID", "Fechas", "Tipo", "Estatus"];

const S3: React.FC = () => (
  <Frame t={t} i={2} n={N} ribbon={false}>
    <Eyebrow>FISPAL</Eyebrow>
    <div style={{ position: "absolute", left: L, right: L, top: 240 }}>
      <Title t={t} size={52} parts={[{ hl: "Fispal" }, " permite buscar tus CFDI utilizando diferentes criterios, como RFC, UUID, fechas, tipo o estatus."]} />
    </div>
    <Glass3D name="filtros" x={290} y={710} size={400} />
    <div style={{ position: "absolute", left: 520, right: L, top: 520, padding: "22px 24px", display: "flex", flexDirection: "column", gap: 12, ...GLASS }}>
      {CRITERIA.map((c) => (
        <div key={c} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,.08)", borderRadius: 18, padding: "12px 18px" }}>
          <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 30, color: "#fff" }}>{c}</span>
          <span style={{ width: 70, height: 38, borderRadius: 19, background: MINT, position: "relative" }}>
            <span style={{ position: "absolute", right: 4, top: 4, width: 30, height: 30, borderRadius: 15, background: "#fff" }} />
          </span>
        </div>
      ))}
    </div>
    <div style={{ position: "absolute", left: L, width: CW, top: 990, boxSizing: "border-box", background: MINT, borderRadius: 32, padding: "32px 40px", boxShadow: "0 20px 50px rgba(92,240,180,.3)" }}>
      <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 36, color: "#0B0F33", lineHeight: 1.22 }}>
        La próxima vez que te pidan una factura, que buscarla no sea el problema.
      </span>
    </div>
  </Frame>
);

/* 4 — CTA: full-bleed photo fading into the night, centred close */
const S4: React.FC = () => (
  <Frame t={t} i={3} n={N} last ribbon={false}>
    <Photo name="c6-tablet" hint="Empresaria segura con tablet" position="50% 25%" radius={0} style={{ left: 0, right: 0, top: 0, height: 760, boxShadow: "none" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 200, background: "linear-gradient(180deg, rgba(11,15,51,.75), rgba(11,15,51,0))" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 460, height: 310, background: "linear-gradient(180deg, rgba(11,15,51,0), #0B0F33 92%)" }} />
    <Glass3D name="factura-ok" x={870} y={620} size={300} />
    <div style={{ position: "absolute", left: L, right: L, top: 760, textAlign: "center" }}>
      <Title t={t} size={76} parts={["Consulta tus CFDI con ", { hl: "Fispal." }]} />
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 990, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
      <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 42, color: "#0B0F33", background: MINT, borderRadius: 999, padding: "24px 52px", boxShadow: "0 18px 44px rgba(92,240,180,.4)" }}>Empieza gratis en fispal.mx →</span>
      <span style={{ fontFamily: FONT, fontWeight: 600, fontSize: 32, color: t.sub }}>y empieza a consultar tus CFDI.</span>
    </div>
  </Frame>
);

export const C6_SLIDES = [S1, S2, S3, S4];
export const Carrusel6Factura: React.FC = () => <Carousel slides={C6_SLIDES} theme={THEMES.night} />;
