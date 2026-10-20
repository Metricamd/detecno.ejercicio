// Carrusel 5 · parrilla 2 — "Te piden un CFDI de hace 8 meses."
// Theme: sky (white → periwinkle blue), no ribbon. Same grid as carrusel 4
// (margins of 80, eyebrow at 180, headline below, content ends ≤1180) but
// its own compositions: a photo banner with the calendar, a source list, a
// mock search panel and a two-column close. Text verbatim from the brief.
import React from "react";
import { FONT, MONO } from "../fispal/theme";
import { Card, Carousel, Frame, Glass3D, IC, Icon, Photo, themed, THEMES, Title } from "./kit";

const t = themed(THEMES.sky);
const N = 4;
const B = "#2F6BFF";
const P = "#250E94";
const CORAL = "#F2645A";
const GREEN = "#13B57D";
const L = 80;
const CW = 1080 - 2 * L;

const ICX = {
  ...IC,
  folder: "M3 7h6l2 2h10v10H3z",
  mail: "M3 6h18v12H3zM3 6l9 7 9-7",
  sheet: "M4 4h16v16H4zM4 9h16M4 14h16M9 4v16",
  db: "M12 3c4.4 0 8 1.3 8 3s-3.6 3-8 3-8-1.3-8-3 3.6-3 8-3zM4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3",
  clock: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3 2",
  filter: "M3 5h18l-7 8v6l-4 2v-8z",
  bolt: "M13 2L4 14h7l-1 8 9-12h-7z",
};

const Eyebrow: React.FC<{ children: React.ReactNode; top?: number }> = ({ children, top = 180 }) => (
  <div style={{ position: "absolute", left: L, top, display: "flex", alignItems: "center", gap: 14, fontFamily: MONO, fontWeight: 700, fontSize: 24, letterSpacing: "0.14em", color: B }}>
    <span style={{ width: 44, height: 5, borderRadius: 3, background: B }} />
    {children}
  </div>
);

const Chip: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ position: "absolute", display: "flex", alignItems: "center", gap: 12, background: "#fff", color: P, fontFamily: FONT, fontWeight: 700, fontSize: 28, borderRadius: 999, padding: "14px 26px", boxShadow: "0 16px 36px rgba(37,14,148,.18)", whiteSpace: "nowrap", ...style }}>{children}</div>
);

/* 1 — portada: photo banner with the calendar on its corner, question below */
const S1: React.FC = () => (
  <Frame t={t} i={0} n={N} ribbon={false}>
    <Photo name="c5-busca" hint="Contadora buscando entre carpetas" position="50% 45%" radius={40} style={{ left: L, right: L, top: 170, height: 560 }} />
    <Chip style={{ left: L + 30, top: 200 }}>
      <Icon d={ICX.clock} size={30} color={CORAL} />
      <span style={{ fontFamily: MONO, color: CORAL }}>00:47:12</span>
    </Chip>
    <Glass3D name="calendario-lupa" x={860} y={600} size={300} />
    <div style={{ position: "absolute", left: L, right: L, top: 800 }}>
      <Title t={t} size={74} parts={["Te piden un CFDI de ", { hl: "hace 8 meses." }]} />
      <div style={{ marginTop: 26, fontFamily: FONT, fontWeight: 700, fontSize: 46, color: t.sub }}>
        ¿Cuánto tardas en encontrarlo? 👀
      </div>
    </div>
  </Frame>
);

/* 2 — the sources, one per row, with the illustration on the right */
const SOURCES = [
  { w: "¿Carpetas?", i: ICX.folder, c: "#F2A019" },
  { w: "¿Correo?", i: ICX.mail, c: B },
  { w: "¿Excel?", i: ICX.sheet, c: GREEN },
  { w: "¿El sistema contable?", i: ICX.db, c: "#7B61FF" },
];

const S2: React.FC = () => (
  <Frame t={t} i={1} n={N} ribbon={false}>
    <Eyebrow>¿DÓNDE ESTÁ?</Eyebrow>
    <Glass3D name="fuentes" x={820} y={500} size={440} />
    <div style={{ position: "absolute", left: L, top: 260, display: "flex", flexDirection: "column", gap: 36 }}>
      {SOURCES.map((s) => (
        <div key={s.w} style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <div style={{ width: 92, height: 92, borderRadius: 28, background: s.c, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 14px 30px ${s.c}55`, flexShrink: 0 }}>
            <Icon d={s.i} size={50} />
          </div>
          <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 58, letterSpacing: "-0.02em", color: P, maxWidth: 560, lineHeight: 1.05 }}>{s.w}</span>
        </div>
      ))}
    </div>
    <Card t={t} style={{ position: "absolute", left: L, width: CW, top: 860, boxSizing: "border-box", padding: "36px 40px 36px 44px", display: "flex", alignItems: "center", gap: 30, borderLeft: `12px solid ${CORAL}` }}>
      <Icon d={ICX.clock} size={70} color={CORAL} />
      <span style={{ fontWeight: 700, fontSize: 38, color: P, lineHeight: 1.22 }}>
        Cada fuente que tienes que revisar es <span style={{ color: CORAL }}>tiempo que tu equipo está dejando de dedicar</span> a otras tareas.
      </span>
    </Card>
  </Frame>
);

/* 3 — Fispal: headline, mock search panel + illustration, closing statement */
const CRITERIA = ["RFC", "Fecha", "UUID", "Monto", "Emisor"];

const S3: React.FC = () => (
  <Frame t={t} i={2} n={N} ribbon={false}>
    <Eyebrow>FISPAL</Eyebrow>
    <div style={{ position: "absolute", left: L, right: L, top: 240 }}>
      <Title t={t} size={54} parts={[{ hl: "Fispal" }, " concentra tus CFDI descargados del SAT y permite buscarlos utilizando distintos criterios."]} />
    </div>
    <Glass3D name="buscador" x={300} y={720} size={400} />
    <Card t={t} style={{ position: "absolute", left: 500, right: L, top: 540, padding: "26px 26px", display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, border: `2.5px solid ${B}`, borderRadius: 18, padding: "14px 18px" }}>
        <Icon d={IC.search} size={30} color={B} sw={2.5} />
        <span style={{ fontFamily: MONO, fontSize: 24, color: "#5E6480" }}>Buscar CFDI…</span>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        {CRITERIA.map((c, k) => (
          <span key={c} style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 700, fontSize: 22, color: k === 1 ? "#fff" : P, background: k === 1 ? B : "#EEF2FF", borderRadius: 999, padding: "8px 16px" }}>
            <Icon d={ICX.filter} size={18} color={k === 1 ? "#fff" : B} /> {c}
          </span>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, background: "#E9FBF3", borderRadius: 16, padding: "14px 16px" }}>
        <Icon d={ICX.bolt} size={30} color={GREEN} />
        <div>
          <div style={{ fontWeight: 800, fontSize: 26, color: GREEN }}>1 resultado · 0.4 s</div>
          <div style={{ fontFamily: MONO, fontSize: 19, color: "#5E6480" }}>Fecha: hace 8 meses</div>
        </div>
      </div>
    </Card>
    <div style={{ position: "absolute", left: L, width: CW, top: 970, boxSizing: "border-box", background: P, borderRadius: 32, padding: "34px 40px", boxShadow: "0 24px 50px rgba(37,14,148,.3)" }}>
      <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 38, color: "#fff", lineHeight: 1.22 }}>
        Cuando necesitas información fiscal, <span style={{ color: "#8FB0FF" }}>encontrarla también es parte del control.</span>
      </span>
    </div>
  </Frame>
);

/* 4 — CTA: photo + laptop on top, statement and button below */
const S4: React.FC = () => (
  <Frame t={t} i={3} n={N} last ribbon={false}>
    <Photo name="c5-encontrado" hint="Gerente feliz frente a su laptop" position="60% 50%" radius={40} style={{ left: L, width: 470, top: 170, height: 560 }} ring="#fff" />
    <Glass3D name="plataforma" x={790} y={450} size={430} />
    <div style={{ position: "absolute", left: L, right: L, top: 790 }}>
      <Title t={t} size={84} parts={["Una ", { hl: "plataforma." }]} />
      <div style={{ marginTop: 12, fontFamily: FONT, fontWeight: 700, fontSize: 42, color: t.sub, lineHeight: 1.2 }}>Diferentes herramientas para analizar tu información fiscal.</div>
    </div>
    <div style={{ position: "absolute", left: L, right: L, top: 1060, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 16 }}>
      <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: "#fff", background: P, borderRadius: 999, padding: "22px 46px", boxShadow: "0 18px 44px rgba(37,14,148,.35)" }}>Crea tu cuenta gratis en fispal.mx →</span>
      <span style={{ fontFamily: FONT, fontWeight: 600, fontSize: 30, color: t.sub }}>y consulta tu información fiscal desde un mismo lugar.</span>
    </div>
  </Frame>
);

export const C5_SLIDES = [S1, S2, S3, S4];
export const Carrusel5Buscar: React.FC = () => <Carousel slides={C5_SLIDES} theme={THEMES.sky} />;
