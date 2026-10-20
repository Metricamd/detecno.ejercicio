// Carrusel 3 · parrilla 2 — "¿Tu equipo todavía descarga CFDI uno por uno?"
// Theme: deep teal → navy. A stricter layout grid than carruseles 1–2:
// header (60) · kicker (170) · headline (220–520) · visual zone (560–1200,
// two columns of 460 with a 20 gap) · footer. New glass illustrations.
// Text verbatim from the brief.
import React from "react";
import { FONT, MONO } from "../fispal/theme";
import { Card, Carousel, Frame, Glass3D, IC, Icon, Photo, themed, THEMES, Title } from "./kit";

const t = themed(THEMES.teal);
const N = 5;
const MINT = "#5CF0B4";
const VIOLET = "#8C7CFF";
const L = 70; // left margin
const R = 1010; // right edge
const COL = 460;
const COL2 = L + COL + 20; // second column x

const Kicker: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ position: "absolute", left: L, top: 160, display: "inline-flex", alignItems: "center", gap: 12, fontFamily: MONO, fontWeight: 700, fontSize: 22, letterSpacing: "0.12em", color: MINT, border: `2px solid ${MINT}55`, borderRadius: 999, padding: "8px 20px" }}>
    <span style={{ width: 10, height: 10, borderRadius: 5, background: MINT }} />
    {children}
  </div>
);

const Head: React.FC<{ children: React.ReactNode }> = ({ children }) => <div style={{ position: "absolute", left: L, right: 1080 - R, top: 220 }}>{children}</div>;

const ICX = {
  ...IC,
  send: "M4 12l16-8-6 16-3-7z",
  folder: "M3 7h6l2 2h10v10H3z",
  repeat: "M17 2l4 4-4 4M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4M21 13v2a3 3 0 0 1-3 3H3",
  bolt: "M13 2L4 14h7l-1 8 9-12h-7z",
  hand: "M8 13V5a2 2 0 0 1 4 0v6M12 11V4a2 2 0 0 1 4 0v7M16 11V6a2 2 0 0 1 4 0v8a7 7 0 0 1-7 7h-1a7 7 0 0 1-6-3l-3-5a2 2 0 0 1 3-2l2 2",
  chart: "M4 20V10M10 20V4M16 20v-7M22 20H2",
  calendar: "M4 6h16v14H4zM4 10h16M8 3v4M16 3v4",
};

/* 1 — portada */
const S1: React.FC = () => (
  <Frame t={t} i={0} n={N}>
    <Kicker>DESCARGA DE CFDI</Kicker>
    <Head>
      <Title t={t} size={78} parts={["¿Tu equipo todavía descarga CFDI ", { hl: "uno por uno?" }]} />
    </Head>
    <Photo name="c3-repetitivo" hint="Contadora aburrida descargando" position="50% 42%" radius={36} style={{ left: L, top: 520, width: COL, height: 570 }} />
    {/* stack of single-download rows */}
    <div style={{ position: "absolute", left: COL2, top: 520, width: COL, display: "flex", flexDirection: "column", gap: 14 }}>
      {[1, 2, 3, 4].map((k) => (
        <Card key={k} t={t} style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 14, opacity: 1 - k * 0.12, transform: `translateX(${k * 10}px)` }}>
          <Icon d={IC.doc} size={32} color="#250E94" />
          <span style={{ fontFamily: MONO, fontSize: 22, flex: 1 }}>CFDI {k} de 1,248</span>
          <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 46, height: 46, borderRadius: 14, background: "#250E94" }}>
            <Icon d={IC.down} size={26} />
          </span>
        </Card>
      ))}
    </div>
    <Glass3D name="nube-descarga" x={COL2 + COL / 2} y={985} size={280} />
    <div style={{ position: "absolute", left: L, right: 1080 - R, top: 1125, fontFamily: FONT, fontWeight: 600, fontSize: 34, color: t.sub }}>
      <b style={{ color: t.ink }}>Spoiler:</b> esa no es la única forma de hacerlo. →
    </div>
  </Frame>
);

/* 2 — el ciclo */
const LOOP = [
  { w: "Solicitar.", i: ICX.send },
  { w: "Descargar.", i: IC.down },
  { w: "Organizar.", i: ICX.folder },
  { w: "Repetir.", i: ICX.repeat },
];

const S2: React.FC = () => (
  <Frame t={t} i={1} n={N}>
    <Kicker>EL CICLO</Kicker>
    <div style={{ position: "absolute", left: L, top: 230, width: 600, display: "flex", flexDirection: "column", gap: 22 }}>
      {LOOP.map((l, k) => (
        <div key={l.w} style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 26, color: MINT, width: 44 }}>0{k + 1}</span>
          <div style={{ width: 92, height: 92, borderRadius: 28, background: k === 3 ? MINT : "rgba(255,255,255,.12)", border: "1.5px solid rgba(255,255,255,.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon d={l.i} size={48} color={k === 3 ? "#0A1A3A" : "#fff"} />
          </div>
          <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 84, color: k === 3 ? MINT : t.ink, letterSpacing: "-0.03em" }}>{l.w}</span>
        </div>
      ))}
    </div>
    <Glass3D name="ciclo" x={800} y={860} size={300} />
    <Card t={t} style={{ position: "absolute", left: L, right: 1080 - R, top: 1030, padding: "30px 36px", display: "flex", alignItems: "center", gap: 24, background: "rgba(255,255,255,.1)", color: "#fff", border: "1.5px solid rgba(255,255,255,.25)", boxShadow: "none" }}>
      <Icon d={ICX.repeat} size={60} color={MINT} />
      <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 40, lineHeight: 1.2 }}>Y volver a hacerlo cada vez que necesitas información.</span>
    </Card>
  </Frame>
);

/* 3 — volumen */
const S3: React.FC = () => (
  <Frame t={t} i={2} n={N}>
    <Kicker>VOLUMEN</Kicker>
    <Head>
      <Title t={t} size={60} parts={["Cuando el volumen crece, el problema deja de ser descargar un CFDI."]} />
    </Head>
    <div style={{ position: "absolute", left: L, top: 600, width: 560 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 24 }}>
        <span style={{ position: "relative", fontFamily: FONT, fontWeight: 800, fontSize: 150, color: "rgba(255,255,255,.35)", lineHeight: 1 }}>
          1
          <span style={{ position: "absolute", left: -10, right: -10, top: "52%", height: 12, background: "#FF7A7A", borderRadius: 6, transform: "rotate(-12deg)" }} />
        </span>
        <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 70, color: "rgba(255,255,255,.5)" }}>→</span>
      </div>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 210, color: MINT, lineHeight: 0.95, letterSpacing: "-0.04em", textShadow: "0 20px 60px rgba(92,240,180,.35)" }}>1,000+</div>
      <Title t={t} size={56} parts={["Es descargar ", { hl: "cientos o miles." }]} style={{ marginTop: 26 }} />
    </div>
    <Glass3D name="pila-xml" x={860} y={850} size={620} />
  </Frame>
);

/* 4 — Fispal automatiza */
const S4: React.FC = () => (
  <Frame t={t} i={3} n={N}>
    <Kicker>FISPAL</Kicker>
    <Head>
      <Title t={t} size={64} parts={[{ hl: "Fispal" }, " automatiza la descarga de CFDI del SAT."]} />
    </Head>
    {/* two modes, two columns */}
    {[
      { x: L, title: "Automática", sub: "Programada y continua", icon: ICX.calendar, accent: MINT, cta: "Activa" },
      { x: COL2, title: "Manual", sub: "También puedes solicitar descargas manuales cuando las necesites.", icon: ICX.hand, accent: VIOLET, cta: "Solicitar descarga" },
    ].map((m) => (
      <Card key={m.title} t={t} style={{ position: "absolute", left: m.x, top: 500, width: COL, height: 380, boxSizing: "border-box", padding: "30px 30px", display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ width: 80, height: 80, borderRadius: 24, background: m.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon d={m.icon} size={44} color="#0A1A3A" />
        </div>
        <div style={{ fontWeight: 800, fontSize: 44 }}>{m.title}</div>
        <div style={{ fontWeight: 500, fontSize: 25, color: "#5E6480", lineHeight: 1.3, flex: 1 }}>{m.sub}</div>
        <span style={{ alignSelf: "flex-start", fontWeight: 700, fontSize: 24, color: "#fff", background: "#250E94", borderRadius: 999, padding: "10px 22px" }}>{m.cta}</span>
      </Card>
    ))}
    <Glass3D name="engranes" x={960} y={480} size={190} />
    {/* outcome strip */}
    {[
      { x: L, t1: "Menos trabajo repetitivo.", i: ICX.repeat, c: "#FF9A9A" },
      { x: COL2, t1: "Más tiempo para analizar la información.", i: ICX.chart, c: MINT },
    ].map((o) => (
      <div key={o.t1} style={{ position: "absolute", left: o.x, top: 920, width: COL, height: 230, boxSizing: "border-box", borderRadius: 30, padding: "26px 28px", background: "rgba(255,255,255,.1)", border: "1.5px solid rgba(255,255,255,.25)", display: "flex", flexDirection: "column", gap: 16 }}>
        <Icon d={o.i} size={50} color={o.c} />
        <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 36, color: "#fff", lineHeight: 1.15 }}>{o.t1}</span>
      </div>
    ))}
  </Frame>
);

/* 5 — cierre */
const S5: React.FC = () => (
  <Frame t={t} i={4} n={N} last>
    <div style={{ position: "absolute", left: L, right: 1080 - R, top: 170, textAlign: "center" }}>
      <Title t={t} size={74} parts={["¿Todavía lo hacen ", { hl: "manualmente?" }]} />
    </div>
    <Photo name="c3-equipo" hint="Equipo de finanzas feliz" position="50% 45%" radius={40} style={{ left: L, right: 1080 - R, top: 400, height: 520 }} ring={MINT} />
    <Glass3D name="reloj-arena" x={900} y={880} size={250} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 990, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
      <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: "#0A1A3A", background: MINT, borderRadius: 999, padding: "22px 48px", boxShadow: "0 18px 44px rgba(92,240,180,.4)" }}>Prueba Fispal gratis →</span>
      <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 36, color: "#fff" }}>fispal.mx</span>
      <span style={{ fontFamily: FONT, fontWeight: 600, fontSize: 32, color: t.sub }}>y automatiza tu tiempo.</span>
    </div>
  </Frame>
);

export const C3_SLIDES = [S1, S2, S3, S4, S5];
export const Carrusel3Descarga: React.FC = () => <Carousel slides={C3_SLIDES} theme={THEMES.teal} />;
