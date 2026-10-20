// Carrusel 1 · parrilla 2 — "¿Cuántos CFDI tiene el SAT que tú no tienes?"
// Theme: brand purple. Text verbatim from the brief.
import React from "react";
import { C, FONT, MONO } from "../fispal/theme";
import { Body, Card, Carousel, Frame, Glass3D, IC, Icon, Photo, THEMES, Title } from "./kit";

const t = THEMES.purple;
const N = 5;
const MINT = "#3FD497";
const CORAL = "#FF7A7A";

const Counter: React.FC<{ who: string; n: string; icon: string; color: string; style: React.CSSProperties }> = ({ who, n, icon, color, style }) => (
  <Card t={t} style={{ position: "absolute", padding: "22px 28px", display: "flex", alignItems: "center", gap: 18, ...style }}>
    <div style={{ width: 72, height: 72, borderRadius: 22, background: color, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Icon d={icon} size={42} color="#fff" />
    </div>
    <div>
      <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 20, color: "#5E6480", letterSpacing: "0.06em" }}>{who}</div>
      <div style={{ fontWeight: 800, fontSize: 52, lineHeight: 1 }}>{n}</div>
    </div>
  </Card>
);

/* 1 — portada */
const S1: React.FC = () => (
  <Frame t={t} i={0} n={N}>
    <div style={{ position: "absolute", left: 70, right: 70, top: 170 }}>
      <Title t={t} size={78} parts={["¿Cuántos CFDI tiene el SAT de tu empresa que ", { hl: "tú no tienes?" }]} />
      <Body t={t} style={{ maxWidth: 820 }}>
        <b style={{ color: "#fff" }}>Spoiler:</b> podrías estar comparando contra una información incompleta. →
      </Body>
    </div>
    <Photo name="c1-dudas" hint="Contadora comparando facturas" style={{ left: 420, top: 640, width: 560, height: 590, transform: "rotate(3deg)" }} />
    <Counter who="SAT" n="1,284" icon={IC.building} color={C.purple} style={{ left: 70, top: 700, transform: "rotate(-4deg)" }} />
    <Counter who="TÚ" n="1,197" icon={IC.user} color="#20B07E" style={{ left: 110, top: 880, transform: "rotate(2deg)" }} />
    <div style={{ position: "absolute", left: 300, top: 1040, background: CORAL, color: "#fff", fontFamily: FONT, fontWeight: 800, fontSize: 44, borderRadius: 999, padding: "10px 30px", boxShadow: "0 16px 36px rgba(255,122,122,.5)", transform: "rotate(-6deg)" }}>−87 CFDI</div>
    <Glass3D name="lupa" x={930} y={620} size={260} rot={8} />
  </Frame>
);

/* 2 — dos fuentes que no coinciden */
const Bar: React.FC<{ label: string; n: string; h: number; color: string; x: number }> = ({ label, n, h, color, x }) => (
  <div style={{ position: "absolute", left: x, bottom: 230, width: 280, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
    <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 56, color: "#fff" }}>{n}</div>
    <div style={{ width: "100%", height: h, borderRadius: 28, background: `linear-gradient(180deg, ${color}, ${color}AA)`, boxShadow: `0 20px 50px ${color}55`, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 18, boxSizing: "border-box", gap: 10 }}>
      {Array.from({ length: Math.floor(h / 70) }).map((_, k) => (
        <div key={k} style={{ height: 40, borderRadius: 10, background: "rgba(255,255,255,.28)" }} />
      ))}
    </div>
    <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 28, color: "#fff", letterSpacing: "0.06em" }}>{label}</div>
  </div>
);

const S2: React.FC = () => (
  <Frame t={t} i={1} n={N}>
    <div style={{ position: "absolute", left: 70, right: 70, top: 170 }}>
      <Title t={t} size={64} parts={["Tú tienes tus CFDI."]} />
      <Title t={t} size={64} parts={["El SAT tiene sus propios registros."]} style={{ marginTop: 8 }} />
      <Body t={t} size={38} style={{ color: "#fff", fontWeight: 700 }}>
        ¿Qué pasa cuando ambas cantidades <span style={{ color: MINT }}>no coinciden?</span>
      </Body>
    </div>
    <Bar label="TÚ" n="1,197" h={420} color="#20B07E" x={150} />
    <Bar label="SAT" n="1,284" h={500} color="#8C7CFF" x={650} />
    <div style={{ position: "absolute", left: 540 - 85, top: 820, width: 170, height: 170, borderRadius: 85, background: CORAL, color: "#fff", fontFamily: FONT, fontWeight: 800, fontSize: 120, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 20px 50px rgba(255,122,122,.55)" }}>≠</div>
    <Glass3D name="facturas" x={540} y={660} size={210} rot={-6} />
  </Frame>
);

/* 3 — comprobantes no identificados */
const ROWS = [
  { id: "8F2A…19C0", n: "Grupo Andino", ok: true },
  { id: "3B7D…44E1", n: "Comercial Rivas", ok: true },
  { id: "????…????", n: "No identificado", ok: false },
  { id: "C90A…12FF", n: "Servicios Lumen", ok: true },
  { id: "????…????", n: "No identificado", ok: false },
];

const S3: React.FC = () => (
  <Frame t={t} i={2} n={N}>
    <div style={{ position: "absolute", left: 70, right: 70, top: 170 }}>
      <Title t={t} size={64} parts={["La diferencia puede estar en comprobantes que ", { hl: "no tienes identificados." }]} />
      <Body t={t}>Y si no comparas ambas fuentes, es difícil saber que existe.</Body>
    </div>
    <Photo name="c3-busqueda" hint="Analista buscando entre papeles" style={{ left: 600, top: 650, width: 400, height: 560, transform: "rotate(-3deg)" }} />
    <Card t={t} style={{ position: "absolute", left: 70, top: 690, width: 600, padding: "18px 22px", transform: "rotate(-1.5deg)" }}>
      {ROWS.map((r, k) => (
        <div key={k} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 6px", borderBottom: k < ROWS.length - 1 ? "1px solid #EEF0F6" : "none", background: r.ok ? "transparent" : "rgba(255,122,122,.1)", border: r.ok ? undefined : `2px dashed ${CORAL}`, borderRadius: r.ok ? 0 : 14, margin: r.ok ? 0 : "4px 0" }}>
          <Icon d={r.ok ? IC.doc : IC.alert} size={34} color={r.ok ? C.purple : CORAL} />
          <span style={{ fontFamily: MONO, fontSize: 21, color: "#5E6480", width: 150 }}>{r.id}</span>
          <span style={{ fontWeight: 700, fontSize: 26, flex: 1, color: r.ok ? "#131313" : CORAL }}>{r.n}</span>
          {r.ok ? <Icon d={IC.check} size={30} color="#20B07E" sw={3} /> : <span style={{ fontWeight: 800, fontSize: 30, color: CORAL }}>?</span>}
        </div>
      ))}
    </Card>
    <Glass3D name="lupa" x={180} y={1150} size={200} rot={-10} />
  </Frame>
);

/* 4 — aquí entra Fispal */
const S4: React.FC = () => (
  <Frame t={t} i={3} n={N}>
    <div style={{ position: "absolute", left: 70, right: 70, top: 170 }}>
      <Title t={t} size={84} parts={["Aquí entra ", { hl: "Fispal." }]} />
      <Body t={t}>Puedes descargar y concentrar los CFDI del SAT y compararlos contra tu propia información.</Body>
    </div>
    <Card t={t} style={{ position: "absolute", left: 70, right: 70, top: 560, padding: "28px 32px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
        <div style={{ width: 60, height: 60, borderRadius: 18, background: C.purple, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon d={IC.compare} size={34} />
        </div>
        <span style={{ fontWeight: 800, fontSize: 36 }}>Comparación SAT vs. tu información</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {[
          { l: "Descargados del SAT", n: "1,284", c: C.purple, i: IC.down },
          { l: "Tu información", n: "1,197", c: "#20B07E", i: IC.user },
        ].map((b) => (
          <div key={b.l} style={{ background: "#F4F5FB", borderRadius: 22, padding: "22px 24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Icon d={b.i} size={30} color={b.c} />
              <span style={{ fontWeight: 600, fontSize: 24, color: "#5E6480" }}>{b.l}</span>
            </div>
            <div style={{ fontWeight: 800, fontSize: 62, color: b.c, marginTop: 6 }}>{b.n}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 16, background: "rgba(255,122,122,.12)", border: `2px solid ${CORAL}`, borderRadius: 20, padding: "18px 24px" }}>
        <Icon d={IC.alert} size={38} color={CORAL} />
        <span style={{ fontWeight: 800, fontSize: 34, color: CORAL }}>87 diferencias encontradas</span>
        <span style={{ marginLeft: "auto", fontWeight: 700, fontSize: 24, color: "#fff", background: C.purple, borderRadius: 999, padding: "10px 22px" }}>Ver detalle</span>
      </div>
      {[
        ["4A1C…77B2", "Recibido · Papelera Norte", "$12,480"],
        ["E93F…0C5D", "Recibido · Transportes Kal", "$8,215"],
        ["71BD…A6E0", "Emitido · Café Altura", "$3,960"],
      ].map(([id, d, m]) => (
        <div key={id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 8px", borderBottom: "1px solid #EEF0F6" }}>
          <span style={{ fontFamily: MONO, fontSize: 21, color: "#5E6480", width: 150 }}>{id}</span>
          <span style={{ fontWeight: 600, fontSize: 25, flex: 1 }}>{d}</span>
          <span style={{ fontWeight: 800, fontSize: 25 }}>{m}</span>
          <span style={{ fontWeight: 700, fontSize: 18, color: CORAL, background: "rgba(255,122,122,.12)", borderRadius: 999, padding: "6px 12px" }}>Solo en SAT</span>
        </div>
      ))}
    </Card>
    <Glass3D name="integraciones" x={950} y={455} size={170} rot={6} />
  </Frame>
);

/* 5 — cierre */
const S5: React.FC = () => (
  <Frame t={t} i={4} n={N} last>
    <div style={{ position: "absolute", left: 70, right: 70, top: 170 }}>
      <Title t={t} size={52} parts={["No se trata de tener más archivos."]} style={{ color: "rgba(255,255,255,.7)" }} />
      <Title t={t} size={66} parts={["Se trata de saber si tienes ", { hl: "la misma información que tiene el SAT." }]} style={{ marginTop: 14 }} />
    </div>
    <Photo name="c5-tranquila" hint="Gerente de finanzas satisfecha" style={{ left: 70, top: 640, width: 470, height: 520, transform: "rotate(-3deg)" }} ring={MINT} />
    <Card t={t} style={{ position: "absolute", left: 470, top: 700, padding: "18px 26px", display: "flex", alignItems: "center", gap: 14, transform: "rotate(4deg)" }}>
      <span style={{ fontWeight: 800, fontSize: 40 }}>1,284 = 1,284</span>
      <div style={{ width: 48, height: 48, borderRadius: 24, background: "#20B07E", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon d={IC.check} size={30} sw={3.2} />
      </div>
    </Card>
    <div style={{ position: "absolute", left: 580, right: 70, top: 860, fontFamily: FONT, fontWeight: 800, fontSize: 46, color: "#fff", lineHeight: 1.15 }}>¿Ya hiciste esta comparación?</div>
    <div style={{ position: "absolute", left: 570, right: 40, top: 1000, display: "flex", flexDirection: "column", gap: 16, alignItems: "flex-start" }}>
      <span style={{ fontFamily: FONT, fontWeight: 600, fontSize: 28, color: "rgba(255,255,255,.8)" }}>Empieza hoy</span>
      <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 31, color: "#0F3A2A", background: MINT, borderRadius: 999, padding: "18px 30px", whiteSpace: "nowrap", boxShadow: "0 16px 40px rgba(63,212,151,.45)" }}>Crea tu cuenta gratis →</span>
      <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 30, color: "#fff" }}>fispal.mx</span>
    </div>
    <Glass3D name="esfera" x={930} y={1220} size={170} />
  </Frame>
);

export const C1_SLIDES = [S1, S2, S3, S4, S5];
export const Carrusel1Sat: React.FC = () => <Carousel slides={C1_SLIDES} />;
