// Carrusel 4 · parrilla 2 — "Descargaste miles de CFDI. ¿Y ahora qué?"
// Theme: light mint with violet ink, no ribbon. Every slide sits on the same
// grid: margins of 80, an eyebrow at 180, the headline right below it, one
// visual zone and a closing block that ends above the footer (≤1180).
// Text verbatim from the brief.
import React from "react";
import { FONT, MONO } from "../fispal/theme";
import { Card, Carousel, Frame, Glass3D, IC, Icon, Photo, themed, THEMES, Title } from "./kit";

const t = themed(THEMES.mint);
const N = 4;
const V = "#6A3FE0";
const P = "#250E94";
const CORAL = "#F2645A";
const L = 80; // side margin
const CW = 1080 - 2 * L; // content width

const ICX = {
  ...IC,
  chart: "M4 20V10M10 20V4M16 20v-7M22 20H2",
  scale: "M12 3v18M5 7h14M5 7l-3 6a3 3 0 0 0 6 0zM19 7l-3 6a3 3 0 0 0 6 0zM8 21h8",
  link: "M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1",
  target: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zM12 11a1 1 0 1 0 0 2 1 1 0 0 0 0-2z",
};

const Eyebrow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ position: "absolute", left: L, top: 180, display: "flex", alignItems: "center", gap: 14, fontFamily: MONO, fontWeight: 700, fontSize: 24, letterSpacing: "0.14em", color: V }}>
    <span style={{ width: 44, height: 5, borderRadius: 3, background: V }} />
    {children}
  </div>
);

/* 1 — portada: big type left, mountain right, question below a divider */
const S1: React.FC = () => (
  <Frame t={t} i={0} n={N} ribbon={false}>
    <Eyebrow>TUS CFDI</Eyebrow>
    <div style={{ position: "absolute", left: L, top: 240, fontFamily: FONT, color: P }}>
      <div style={{ fontWeight: 700, fontSize: 54 }}>Descargaste</div>
      <div style={{ fontWeight: 800, fontSize: 200, lineHeight: 0.92, letterSpacing: "-0.05em", color: V }}>miles</div>
      <div style={{ fontWeight: 800, fontSize: 76, letterSpacing: "-0.02em" }}>de CFDI.</div>
      <span style={{ display: "inline-block", marginTop: 34, fontFamily: MONO, fontWeight: 700, fontSize: 28, background: "#fff", borderRadius: 999, padding: "12px 24px", boxShadow: "0 12px 30px rgba(37,14,148,.12)" }}>12,480 CFDI ✓</span>
    </div>
    <Glass3D name="montana-cfdi" x={815} y={560} size={470} />
    <div style={{ position: "absolute", left: L, right: L, top: 880, height: 3, borderRadius: 2, background: "rgba(37,14,148,.12)" }} />
    <div style={{ position: "absolute", left: L, right: L, top: 930 }}>
      <Title t={t} size={92} parts={["¿Y ahora qué?"]} />
      <div style={{ marginTop: 16, fontFamily: FONT, fontWeight: 700, fontSize: 42, color: t.sub }}>
        Ahí empieza el <span style={{ color: V }}>verdadero trabajo</span> →
      </div>
    </div>
  </Frame>
);

/* 2 — 2×2 verb grid + warning card with the toolbox */
const VERBS = [
  { w: "Consultar.", i: IC.search, c: V },
  { w: "Analizar.", i: ICX.chart, c: "#13B57D" },
  { w: "Comparar.", i: ICX.scale, c: "#2F6BFF" },
  { w: "Conciliar.", i: ICX.link, c: "#F2A019" },
];

const S2: React.FC = () => (
  <Frame t={t} i={1} n={N} ribbon={false}>
    <Eyebrow>EL SIGUIENTE PASO</Eyebrow>
    <div style={{ position: "absolute", left: L, right: L, top: 240 }}>
      <Title t={t} size={66} parts={["Porque después ", { hl: "necesitas:" }]} />
    </div>
    <div style={{ position: "absolute", left: L, width: CW, top: 360, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
      {VERBS.map((v, k) => (
        <Card key={v.w} t={t} style={{ height: 240, boxSizing: "border-box", padding: "28px 30px", display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative" }}>
          <div style={{ position: "absolute", right: 28, top: 24, fontFamily: MONO, fontWeight: 700, fontSize: 26, color: v.c }}>0{k + 1}</div>
          <div style={{ width: 88, height: 88, borderRadius: 26, background: v.c, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 14px 30px ${v.c}55` }}>
            <Icon d={v.i} size={48} />
          </div>
          <span style={{ fontWeight: 800, fontSize: 52, letterSpacing: "-0.02em", color: P }}>{v.w}</span>
        </Card>
      ))}
    </div>
    <div style={{ position: "absolute", left: L, width: CW, top: 920, height: 240, boxSizing: "border-box", background: P, borderRadius: 32, padding: "0 40px 0 270px", display: "flex", alignItems: "center", boxShadow: "0 24px 50px rgba(37,14,148,.3)" }}>
      <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 36, color: "#fff", lineHeight: 1.22 }}>
        Y hacerlo con miles de comprobantes puede convertirse en <span style={{ color: "#FF9A9A" }}>otro problema operativo.</span>
      </span>
    </div>
    <Glass3D name="caja-herramientas" x={L + 135} y={1040} size={250} />
  </Frame>
);

/* 3 — split screen: text column left, full-bleed photo right */
const S3: React.FC = () => (
  <Frame t={t} i={2} n={N} ribbon={false}>
    <Photo name="c4-decision" hint="Directora presentando datos" position="28% 40%" radius={0} style={{ left: 600, right: 0, top: 0, bottom: 0, boxShadow: "none" }} />
    <div style={{ position: "absolute", left: 540, top: 0, bottom: 0, width: 140, background: "linear-gradient(90deg, rgba(220,248,236,1), rgba(220,248,236,0))" }} />
    <Eyebrow>HERRAMIENTAS</Eyebrow>
    <div style={{ position: "absolute", left: L, width: 480, top: 240 }}>
      <Title t={t} size={52} parts={[{ hl: "Fispal" }, " reúne distintas herramientas para trabajar con tu información fiscal."]} />
    </div>
    <div style={{ position: "absolute", left: L, width: 480, top: 640, display: "flex", flexDirection: "column", gap: 18 }}>
      <Card t={t} style={{ padding: "22px 26px", display: "flex", alignItems: "center", gap: 16 }}>
        <Icon d={IC.down} size={38} color={CORAL} />
        <span style={{ fontWeight: 700, fontSize: 30, lineHeight: 1.2, color: "#5E6480", textDecoration: "line-through" }}>No solo descargues información.</span>
      </Card>
      <Card t={t} style={{ padding: "26px 26px", display: "flex", alignItems: "center", gap: 16, border: `3px solid ${V}` }}>
        <Icon d={ICX.target} size={46} color={V} />
        <span style={{ fontWeight: 800, fontSize: 38, color: P, lineHeight: 1.15 }}>Úsala para tomar decisiones.</span>
      </Card>
    </div>
    <Glass3D name="diana" x={L + 150} y={1060} size={230} />
  </Frame>
);

/* 4 — CTA, centred */
const CHIPS = ["Consulta", "Análisis", "Comparación con el SAT", "Conciliación de pagos", "Descarga automática"];

const S4: React.FC = () => (
  <Frame t={t} i={3} n={N} last ribbon={false}>
    <Glass3D name="cohete" x={540} y={370} size={380} />
    <div style={{ position: "absolute", left: L, right: L, top: 590, textAlign: "center" }}>
      <Title t={t} size={64} parts={["Descubre qué puedes hacer con tus CFDI en ", { hl: "Fispal." }]} />
    </div>
    <div style={{ position: "absolute", left: L, right: L, top: 790, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 14 }}>
      {CHIPS.map((c, k) => (
        <span key={c} style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: FONT, fontWeight: 700, fontSize: 28, color: P, background: "#fff", borderRadius: 999, padding: "12px 24px", boxShadow: "0 10px 24px rgba(37,14,148,.12)" }}>
          <Icon d={IC.check} size={26} color={k % 2 ? "#13B57D" : V} sw={3} />
          {c}
        </span>
      ))}
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1000, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
      <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 42, color: "#fff", background: P, borderRadius: 999, padding: "24px 52px", boxShadow: "0 18px 44px rgba(37,14,148,.35)" }}>Únete gratis en fispal.mx →</span>
      <span style={{ fontFamily: FONT, fontWeight: 600, fontSize: 32, color: t.sub }}>y empieza a trabajar con tu información fiscal.</span>
    </div>
  </Frame>
);

export const C4_SLIDES = [S1, S2, S3, S4];
export const Carrusel4Trabajo: React.FC = () => <Carousel slides={C4_SLIDES} theme={THEMES.mint} />;
