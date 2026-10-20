// Carrusel 2 · parrilla 2 — "Tu ERP tiene la información… ¿qué tan fácil es
// encontrarla?" Theme: light (white with lilac and mint gradients).
// Its own compositions so it doesn't repeat carrusel 1: a big new glass
// illustration as the hero of every slide, round photos, a photo banner,
// centred layouts. Text verbatim from the brief.
import React from "react";
import { C, FONT, MONO } from "../fispal/theme";
import { Card, Carousel, Frame, Glass3D, IC, Icon, Photo, themed, THEMES, Title } from "./kit";

const t = themed(THEMES.light);
const N = 5;
const CORAL = "#F2645A";
const GREEN = "#13B57D";

const ICX = {
  ...IC,
  grid: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  folder: "M3 7h6l2 2h10v10H3z",
  sheet: "M4 4h16v16H4zM4 9h16M4 14h16M9 4v16",
  chat: "M4 5h16v11H9l-5 4z",
  clock: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3 2",
  bolt: "M13 2L4 14h7l-1 8 9-12h-7z",
  chart: "M4 20V10M10 20V4M16 20v-7M22 20H2",
  filter: "M3 5h18l-7 8v6l-4 2v-8z",
};

const Pill: React.FC<{ children: React.ReactNode; bg?: string; color?: string; style?: React.CSSProperties }> = ({ children, bg = "#fff", color = "#131313", style }) => (
  <div style={{ position: "absolute", display: "flex", alignItems: "center", gap: 12, background: bg, color, fontFamily: FONT, fontWeight: 700, fontSize: 28, borderRadius: 999, padding: "14px 26px", boxShadow: "0 16px 36px rgba(37,14,148,.16)", whiteSpace: "nowrap", ...style }}>{children}</div>
);

/* 1 — portada: centred, the glass labyrinth as hero, round photo */
const S1: React.FC = () => (
  <Frame t={t} i={0} n={N}>
    <div style={{ position: "absolute", left: 70, right: 70, top: 160, textAlign: "center" }}>
      <Title t={t} size={70} parts={["Tu ERP tiene la información."]} />
      <Title t={t} size={52} parts={["Pero… ¿qué tan fácil es ", { hl: "encontrarla cuando la necesitas?" }]} style={{ marginTop: 14 }} />
    </div>
    <Glass3D name="erp-laberinto" x={600} y={820} size={560} />
    <Photo name="c2-erp" hint="Contador frente a su ERP" position="50% 28%" radius="50%" ring="#fff" style={{ left: 60, top: 700, width: 330, height: 330 }} />
    <Pill style={{ left: 70, top: 1060 }}>
      <Icon d={IC.search} size={30} color={C.purple} />
      <span style={{ fontFamily: MONO, fontSize: 24, color: CORAL }}>0 resultados</span>
    </Pill>
    <Pill bg={C.purple} color="#fff" style={{ right: 70, top: 1120, fontSize: 30 }}>
      Hay un detalle que puede complicarlo. →
    </Pill>
  </Frame>
);

/* 2 — más pasos: big glass staircase + a vertical step list */
const STEPS = [
  { l: "Abrir el ERP", i: ICX.grid },
  { l: "Entrar al módulo", i: ICX.folder },
  { l: "Generar reporte", i: ICX.chart },
  { l: "Exportar a Excel", i: ICX.sheet },
  { l: "Buscar el XML", i: IC.doc },
  { l: "Cruzar fuentes", i: IC.compare },
];

const S2: React.FC = () => (
  <Frame t={t} i={1} n={N}>
    <div style={{ position: "absolute", left: 70, right: 70, top: 160 }}>
      <Title t={t} size={50} parts={["Entre reportes, módulos, archivos y diferentes fuentes, encontrar un dato específico puede requerir ", { hl: "más pasos de los que debería." }]} />
    </div>
    <Glass3D name="pasos" x={790} y={860} size={520} />
    <div style={{ position: "absolute", left: 70, top: 560, width: 470, display: "flex", flexDirection: "column", gap: 0 }}>
      {STEPS.map((s, k) => (
        <div key={s.l} style={{ display: "flex", alignItems: "center", gap: 18, position: "relative", paddingBottom: 26 }}>
          {k < STEPS.length - 1 && <div style={{ position: "absolute", left: 27, top: 56, bottom: 0, width: 4, background: "rgba(37,14,148,.18)" }} />}
          <div style={{ width: 58, height: 58, borderRadius: 29, background: k === STEPS.length - 1 ? CORAL : C.purple, color: "#fff", fontFamily: FONT, fontWeight: 800, fontSize: 28, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 10px 22px rgba(37,14,148,.25)" }}>{k + 1}</div>
          <Icon d={s.i} size={32} color={C.purple} />
          <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 30, color: t.ink }}>{s.l}</span>
        </div>
      ))}
    </div>
    <Pill bg={CORAL} color="#fff" style={{ right: 90, top: 1130, fontSize: 32, transform: "rotate(-4deg)" }}>¿Y el dato?</Pill>
  </Frame>
);

/* 3 — responder rápido: photo banner on top, text below */
const S3: React.FC = () => (
  <Frame t={t} i={2} n={N}>
    <Photo name="c2-urgente" hint="Analista al teléfono con prisa" position="50% 30%" radius={40} style={{ left: 70, right: 70, top: 150, height: 560 }} />
    <Card t={t} style={{ position: "absolute", left: 110, top: 560, width: 560, padding: "20px 24px", transform: "rotate(-2deg)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 46, height: 46, borderRadius: 23, background: C.purple, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon d={ICX.chat} size={24} />
        </div>
        <span style={{ fontWeight: 700, fontSize: 22, color: "#5E6480" }}>Dirección · ahora</span>
      </div>
      <div style={{ marginTop: 10, fontWeight: 700, fontSize: 30, lineHeight: 1.2 }}>¿Cuánto le facturamos a Grupo Andino en septiembre?</div>
    </Card>
    <div style={{ position: "absolute", left: 70, right: 330, top: 820 }}>
      <Title t={t} size={46} parts={["Y cuando necesitas responder rápido una pregunta fiscal, depender de búsquedas manuales puede convertirse en ", { hl: "un problema operativo." }]} />
    </div>
    <Glass3D name="reloj-alerta" x={890} y={960} size={330} />
    <Pill style={{ right: 70, top: 1130, border: `2px solid ${CORAL}` }}>
      <Icon d={ICX.clock} size={30} color={CORAL} />
      <span style={{ fontFamily: MONO, color: CORAL }}>00:47:12</span>
    </Pill>
  </Frame>
);

/* 4 — Fispal: funnel hero in the centre, filters around it, result below */
const FILTERS: [string, number, number][] = [
  ["RFC", 110, 600],
  ["Fecha", 760, 560],
  ["Tipo", 70, 820],
  ["Monto", 820, 790],
  ["Estatus", 130, 1010],
];

const S4: React.FC = () => (
  <Frame t={t} i={3} n={N}>
    <div style={{ position: "absolute", left: 80, right: 80, top: 160, textAlign: "center" }}>
      <Title t={t} size={54} parts={[{ hl: "Fispal" }, " concentra tu información fiscal y permite consultarla utilizando diferentes criterios y filtros."]} />
    </div>
    <Glass3D name="embudo" x={540} y={790} size={640} />
    {FILTERS.map(([k, x, y], i) => (
      <Pill key={k} bg={i % 2 ? C.purple : "#fff"} color={i % 2 ? "#fff" : "#131313"} style={{ left: x, top: y, transform: `rotate(${i % 2 ? 4 : -4}deg)` }}>
        <Icon d={ICX.filter} size={24} color={i % 2 ? "#fff" : C.purple} />
        {k}
      </Pill>
    ))}
    <Card t={t} style={{ position: "absolute", left: 520, right: 70, top: 1010, padding: "18px 24px", display: "flex", alignItems: "center", gap: 14, border: `3px solid ${GREEN}` }}>
      <Icon d={ICX.bolt} size={36} color={GREEN} />
      <div>
        <div style={{ fontWeight: 600, fontSize: 22, color: "#5E6480" }}>23 CFDI · Grupo Andino · sep</div>
        <div style={{ fontWeight: 800, fontSize: 44, color: GREEN }}>$184,250</div>
      </div>
    </Card>
  </Frame>
);

/* 5 — cierre: dashboard hero, round photo, centred CTA */
const S5: React.FC = () => (
  <Frame t={t} i={4} n={N} last>
    <div style={{ position: "absolute", left: 70, right: 420, top: 170 }}>
      <Title t={t} size={48} parts={["Menos tiempo buscando información."]} style={{ color: t.sub }} />
      <Title t={t} size={58} parts={["Más facilidad para ", { hl: "consultarla y analizarla." }]} style={{ marginTop: 14 }} />
    </div>
    <Glass3D name="dashboard" x={850} y={400} size={420} />
    <Photo name="c2-relax" hint="Gerente relajado con su laptop" position="55% 28%" radius="50%" ring={GREEN} style={{ left: 330, top: 640, width: 420, height: 420 }} />
    <Pill style={{ left: 640, top: 700 }}>
      <Icon d={IC.check} size={30} color={GREEN} sw={3} /> Consulta lista
    </Pill>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1100, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
      <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 36, color: "#fff", background: C.purple, borderRadius: 999, padding: "20px 44px", boxShadow: "0 16px 40px rgba(37,14,148,.3)" }}>Crea tu cuenta gratis en fispal.mx →</span>
      <span style={{ fontFamily: FONT, fontWeight: 600, fontSize: 28, color: t.sub }}>y empieza a consultar tu información fiscal.</span>
    </div>
  </Frame>
);

export const C2_SLIDES = [S1, S2, S3, S4, S5];
export const Carrusel2Erp: React.FC = () => <Carousel slides={C2_SLIDES} theme={THEMES.light} />;
