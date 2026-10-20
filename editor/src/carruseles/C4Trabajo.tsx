// Carrusel 4 · parrilla 2 — "Descargaste miles de CFDI. ¿Y ahora qué?"
// Theme: light mint with violet ink. Layouts unlike carruseles 1–3: giant
// typography, a 2×2 verb grid, a split screen with a full-bleed photo and a
// centred launch CTA. New glass illustrations. Text verbatim from the brief.
import React from "react";
import { FONT, MONO } from "../fispal/theme";
import { Card, Carousel, Frame, Glass3D, IC, Icon, Photo, themed, THEMES, Title } from "./kit";

const t = themed(THEMES.mint);
const N = 4;
const V = "#6A3FE0";
const P = "#250E94";
const CORAL = "#F2645A";

const ICX = {
  ...IC,
  chart: "M4 20V10M10 20V4M16 20v-7M22 20H2",
  scale: "M12 3v18M5 7h14M5 7l-3 6a3 3 0 0 0 6 0zM19 7l-3 6a3 3 0 0 0 6 0zM8 21h8",
  link: "M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1",
  target: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zM12 11a1 1 0 1 0 0 2 1 1 0 0 0 0-2z",
};

/* 1 — giant typography */
const S1: React.FC = () => (
  <Frame t={t} i={0} n={N}>
    <div style={{ position: "absolute", left: 70, top: 170, fontFamily: FONT, color: P }}>
      <div style={{ fontWeight: 600, fontSize: 44 }}>Descargaste</div>
      <div style={{ fontWeight: 800, fontSize: 190, lineHeight: 0.95, letterSpacing: "-0.05em", color: V }}>miles</div>
      <div style={{ fontWeight: 800, fontSize: 64, letterSpacing: "-0.02em" }}>de CFDI.</div>
    </div>
    <Glass3D name="montana-cfdi" x={780} y={720} size={600} />
    <div style={{ position: "absolute", left: 70, top: 760, display: "flex", flexDirection: "column", gap: 12 }}>
      <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 28, color: P, background: "#fff", borderRadius: 999, padding: "10px 22px", boxShadow: "0 12px 30px rgba(37,14,148,.12)", alignSelf: "flex-start" }}>12,480 CFDI ✓</span>
    </div>
    <div style={{ position: "absolute", left: 70, right: 70, top: 1030 }}>
      <Title t={t} size={80} parts={["¿Y ahora qué?"]} />
      <div style={{ marginTop: 10, fontFamily: FONT, fontWeight: 700, fontSize: 40, color: t.sub }}>
        Ahí empieza el <span style={{ color: V }}>verdadero trabajo</span> →
      </div>
    </div>
  </Frame>
);

/* 2 — 2×2 verb grid */
const VERBS = [
  { w: "Consultar.", i: IC.search, c: V },
  { w: "Analizar.", i: ICX.chart, c: "#13B57D" },
  { w: "Comparar.", i: ICX.scale, c: "#2F6BFF" },
  { w: "Conciliar.", i: ICX.link, c: "#F2A019" },
];

const S2: React.FC = () => (
  <Frame t={t} i={1} n={N}>
    <div style={{ position: "absolute", left: 70, right: 70, top: 170 }}>
      <Title t={t} size={60} parts={["Porque después necesitas:"]} />
    </div>
    <div style={{ position: "absolute", left: 70, right: 70, top: 280, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
      {VERBS.map((v, k) => (
        <Card key={v.w} t={t} style={{ height: 290, boxSizing: "border-box", padding: "30px 30px", display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", right: -30, bottom: -40, fontFamily: FONT, fontWeight: 800, fontSize: 220, color: `${v.c}14`, lineHeight: 1 }}>{k + 1}</div>
          <div style={{ width: 96, height: 96, borderRadius: 28, background: v.c, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 14px 30px ${v.c}55` }}>
            <Icon d={v.i} size={54} />
          </div>
          <span style={{ fontWeight: 800, fontSize: 54, letterSpacing: "-0.02em", color: P }}>{v.w}</span>
        </Card>
      ))}
    </div>
    <Glass3D name="caja-herramientas" x={540} y={985} size={230} />
    <div style={{ position: "absolute", left: 70, right: 70, top: 1090, display: "flex", alignItems: "center", gap: 20, background: P, borderRadius: 28, padding: "24px 30px" }}>
      <Icon d={IC.alert} size={52} color="#FF9A9A" />
      <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 31, color: "#fff", lineHeight: 1.2 }}>Y hacerlo con miles de comprobantes puede convertirse en otro problema operativo.</span>
    </div>
  </Frame>
);

/* 3 — split screen: text left, full-bleed photo right */
const S3: React.FC = () => (
  <Frame t={t} i={2} n={N}>
    <Photo name="c4-decision" hint="Directora presentando datos" position="28% 40%" radius={0} style={{ left: 600, right: 0, top: 0, bottom: 0, boxShadow: "none" }} />
    <div style={{ position: "absolute", left: 560, top: 0, bottom: 0, width: 120, background: "linear-gradient(90deg, rgba(214,247,232,1), rgba(214,247,232,0))" }} />
    <div style={{ position: "absolute", left: 70, width: 500, top: 190 }}>
      <Title t={t} size={54} parts={[{ hl: "Fispal" }, " reúne distintas herramientas para trabajar con tu información fiscal."]} />
    </div>
    <div style={{ position: "absolute", left: 70, width: 520, top: 760, display: "flex", flexDirection: "column", gap: 18 }}>
      <Card t={t} style={{ padding: "20px 24px", display: "flex", alignItems: "center", gap: 16 }}>
        <Icon d={IC.down} size={40} color={CORAL} />
        <span style={{ fontWeight: 700, fontSize: 32, color: "#5E6480", textDecoration: "line-through" }}>No solo descargues información.</span>
      </Card>
      <Card t={t} style={{ padding: "24px 26px", display: "flex", alignItems: "center", gap: 16, border: `3px solid ${V}` }}>
        <Icon d={ICX.target} size={46} color={V} />
        <span style={{ fontWeight: 800, fontSize: 38, color: P, lineHeight: 1.15 }}>Úsala para tomar decisiones.</span>
      </Card>
    </div>
    <Glass3D name="diana" x={760} y={1110} size={260} />
  </Frame>
);

/* 4 — CTA */
const CHIPS = ["Consulta", "Análisis", "Comparación con el SAT", "Conciliación de pagos", "Descarga automática"];

const S4: React.FC = () => (
  <Frame t={t} i={3} n={N} last>
    <Glass3D name="cohete" x={540} y={420} size={420} />
    <div style={{ position: "absolute", left: 70, right: 70, top: 640, textAlign: "center" }}>
      <Title t={t} size={60} parts={["Descubre qué puedes hacer con tus CFDI en ", { hl: "Fispal." }]} />
    </div>
    <div style={{ position: "absolute", left: 90, right: 90, top: 840, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 14 }}>
      {CHIPS.map((c, k) => (
        <span key={c} style={{ fontFamily: FONT, fontWeight: 700, fontSize: 26, color: k % 2 ? P : "#fff", background: k % 2 ? "#fff" : V, borderRadius: 999, padding: "12px 24px", boxShadow: "0 10px 24px rgba(37,14,148,.12)" }}>{c}</span>
      ))}
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1040, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
      <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: "#fff", background: P, borderRadius: 999, padding: "22px 48px", boxShadow: "0 18px 44px rgba(37,14,148,.35)" }}>Únete gratis en fispal.mx →</span>
      <span style={{ fontFamily: FONT, fontWeight: 600, fontSize: 30, color: t.sub }}>y empieza a trabajar con tu información fiscal.</span>
    </div>
  </Frame>
);

export const C4_SLIDES = [S1, S2, S3, S4];
export const Carrusel4Trabajo: React.FC = () => <Carousel slides={C4_SLIDES} theme={THEMES.mint} />;
