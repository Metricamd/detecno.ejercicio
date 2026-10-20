// Carrusel 2 · parrilla 2 — "Tu ERP tiene la información… ¿qué tan fácil es
// encontrarla?" Theme: light (white with lilac and mint gradients).
// Text verbatim from the brief.
import React from "react";
import { C, FONT, MONO } from "../fispal/theme";
import { Body, Card, Carousel, Frame, Glass3D, IC, Icon, Photo, themed, THEMES, Title } from "./kit";

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

/* 1 — portada */
const S1: React.FC = () => (
  <Frame t={t} i={0} n={N}>
    <div style={{ position: "absolute", left: 70, right: 70, top: 170 }}>
      <Title t={t} size={72} parts={["Tu ERP tiene la información."]} />
      <Title t={t} size={56} parts={["Pero… ¿qué tan fácil es ", { hl: "encontrarla cuando la necesitas?" }]} style={{ marginTop: 16 }} />
      <Body t={t}>Hay un detalle que puede complicarlo. →</Body>
    </div>
    <Photo name="c2-erp" hint="Contador frente a su ERP" position="50% 30%" style={{ left: 470, top: 640, width: 540, height: 590, transform: "rotate(3deg)" }} />
    {/* ERP menu maze */}
    <Card t={t} style={{ position: "absolute", left: 60, top: 700, width: 470, padding: "22px 24px", transform: "rotate(-3deg)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#F2F3F8", borderRadius: 14, padding: "12px 16px" }}>
        <Icon d={IC.search} size={28} color="#8A8FA8" />
        <span style={{ fontFamily: MONO, fontSize: 22, color: "#8A8FA8" }}>Buscar…</span>
      </div>
      {["Contabilidad", "› Reportes", "  › Fiscales", "    › Exportar a Excel"].map((m, k) => (
        <div key={k} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 6px", paddingLeft: 6 + k * 22, borderBottom: "1px solid #EEF0F6" }}>
          <Icon d={k === 3 ? ICX.sheet : ICX.folder} size={26} color={k === 3 ? GREEN : C.purple} />
          <span style={{ fontWeight: 600, fontSize: 25 }}>{m.trim()}</span>
        </div>
      ))}
      <div style={{ marginTop: 12, fontFamily: MONO, fontWeight: 700, fontSize: 22, color: CORAL }}>0 resultados</div>
    </Card>
    <Glass3D name="lupa" x={950} y={600} size={220} rot={10} />
  </Frame>
);

/* 2 — más pasos de los que debería */
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
    <div style={{ position: "absolute", left: 70, right: 70, top: 170 }}>
      <Title t={t} size={52} parts={["Entre reportes, módulos, archivos y diferentes fuentes, encontrar un dato específico puede requerir ", { hl: "más pasos de los que debería." }]} />
    </div>
    <svg width={1080} height={1350} style={{ position: "absolute", inset: 0 }}>
      <path d="M250,610 C700,610 830,640 830,740 C830,840 250,820 250,930 C250,1040 830,1020 830,1130" fill="none" stroke={C.purple} strokeWidth={6} strokeDasharray="14 12" opacity={0.35} />
    </svg>
    {STEPS.map((s, k) => {
      const x = k % 2 === 0 ? 90 : 570;
      const y = 560 + k * 100;
      return (
        <Card key={s.l} t={t} style={{ position: "absolute", left: x, top: y, width: 420, padding: "16px 20px", display: "flex", alignItems: "center", gap: 16, transform: `rotate(${k % 2 ? 2 : -2}deg)` }}>
          <div style={{ width: 52, height: 52, borderRadius: 26, background: C.purple, color: "#fff", fontFamily: FONT, fontWeight: 800, fontSize: 26, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{k + 1}</div>
          <Icon d={s.i} size={34} color={C.purple} />
          <span style={{ fontWeight: 700, fontSize: 28 }}>{s.l}</span>
        </Card>
      );
    })}
    <div style={{ position: "absolute", left: 640, top: 1150, display: "flex", alignItems: "center", gap: 12, background: CORAL, color: "#fff", fontFamily: FONT, fontWeight: 800, fontSize: 32, borderRadius: 999, padding: "12px 28px", boxShadow: "0 14px 34px rgba(242,100,90,.4)", transform: "rotate(-4deg)" }}>
      ¿Y el dato?
    </div>
    <Glass3D name="bloques" x={330} y={1150} size={150} rot={-8} />
  </Frame>
);

/* 3 — responder rápido */
const S3: React.FC = () => (
  <Frame t={t} i={2} n={N}>
    <div style={{ position: "absolute", left: 70, right: 70, top: 170 }}>
      <Title t={t} size={52} parts={["Y cuando necesitas responder rápido una pregunta fiscal, depender de búsquedas manuales puede convertirse en ", { hl: "un problema operativo." }]} />
    </div>
    <Photo name="c2-urgente" hint="Analista al teléfono con prisa" position="50% 28%" style={{ left: 70, top: 640, width: 500, height: 590, transform: "rotate(-3deg)" }} />
    <Card t={t} style={{ position: "absolute", left: 500, top: 660, width: 510, padding: "22px 24px", transform: "rotate(2deg)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 52, height: 52, borderRadius: 26, background: C.purple, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon d={ICX.chat} size={28} />
        </div>
        <span style={{ fontWeight: 700, fontSize: 24, color: "#5E6480" }}>Dirección · ahora</span>
      </div>
      <div style={{ marginTop: 14, fontWeight: 700, fontSize: 32, lineHeight: 1.2 }}>¿Cuánto le facturamos a Grupo Andino en septiembre?</div>
    </Card>
    <Card t={t} style={{ position: "absolute", left: 560, top: 950, width: 430, padding: "20px 24px", transform: "rotate(-2deg)", border: `2px solid ${CORAL}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Icon d={ICX.clock} size={38} color={CORAL} />
        <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 36, color: CORAL }}>00:47:12</span>
      </div>
      <div style={{ fontWeight: 600, fontSize: 24, color: "#5E6480", marginTop: 6 }}>Buscando manualmente…</div>
      <div style={{ marginTop: 12, height: 14, borderRadius: 7, background: "#F1F3F7", overflow: "hidden" }}>
        <div style={{ width: "28%", height: "100%", background: CORAL, borderRadius: 7 }} />
      </div>
    </Card>
    <Glass3D name="calendario" x={930} y={1210} size={170} rot={8} />
  </Frame>
);

/* 4 — Fispal: criterios y filtros */
const FILTERS = [
  ["RFC", "GAN150312KL4"],
  ["Fecha", "Sep 2026"],
  ["Tipo", "Emitido"],
  ["Monto", "Todos"],
  ["Estatus", "Vigente"],
];

const S4: React.FC = () => (
  <Frame t={t} i={3} n={N}>
    <div style={{ position: "absolute", left: 70, right: 70, top: 170 }}>
      <Title t={t} size={60} parts={[{ hl: "Fispal" }, " concentra tu información fiscal y permite consultarla utilizando diferentes criterios y filtros."]} />
    </div>
    <Card t={t} style={{ position: "absolute", left: 60, right: 60, top: 560, padding: "26px 30px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, background: "#F4F5FB", border: `3px solid ${GREEN}`, borderRadius: 18, padding: "16px 20px" }}>
        <Icon d={IC.search} size={34} color={C.purple} />
        <span style={{ fontFamily: MONO, fontSize: 26 }}>Grupo Andino · septiembre</span>
        <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, fontFamily: MONO, fontWeight: 700, fontSize: 22, color: GREEN }}>
          <Icon d={ICX.bolt} size={24} color={GREEN} /> al instante
        </span>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, margin: "20px 0" }}>
        {FILTERS.map(([k, v], i) => (
          <span key={k} style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: 24, borderRadius: 999, padding: "10px 18px", background: i < 3 ? C.purple : "#fff", color: i < 3 ? "#fff" : "#131313", border: `2px solid ${i < 3 ? C.purple : "#E1E3EC"}` }}>
            <Icon d={ICX.filter} size={20} color={i < 3 ? "#fff" : C.purple} />
            {k}
            <span style={{ fontFamily: MONO, fontSize: 19, opacity: 0.8 }}>· {v}</span>
          </span>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        {[
          ["Total facturado", "$184,250"],
          ["CFDI encontrados", "23"],
        ].map(([l, v]) => (
          <div key={l} style={{ background: "rgba(19,181,125,.1)", borderRadius: 22, padding: "20px 24px" }}>
            <div style={{ fontWeight: 600, fontSize: 24, color: "#5E6480" }}>{l}</div>
            <div style={{ fontWeight: 800, fontSize: 58, color: GREEN }}>{v}</div>
          </div>
        ))}
      </div>
      {["8F2A…19C0 · 02/09 · $8,450", "3B7D…44E1 · 11/09 · $12,300"].map((r) => (
        <div key={r} style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 6px", borderBottom: "1px solid #EEF0F6" }}>
          <Icon d={IC.doc} size={30} color={C.purple} />
          <span style={{ fontFamily: MONO, fontSize: 23, flex: 1 }}>{r}</span>
          <Icon d={IC.check} size={28} color={GREEN} sw={3} />
        </div>
      ))}
    </Card>
    <Glass3D name="modulos" x={950} y={520} size={180} rot={6} />
  </Frame>
);

/* 5 — cierre */
const S5: React.FC = () => (
  <Frame t={t} i={4} n={N} last>
    <div style={{ position: "absolute", left: 70, right: 70, top: 170 }}>
      <Title t={t} size={56} parts={["Menos tiempo buscando información."]} style={{ color: t.sub }} />
      <Title t={t} size={66} parts={["Más facilidad para ", { hl: "consultarla y analizarla." }]} style={{ marginTop: 14 }} />
    </div>
    <Photo name="c2-relax" hint="Gerente relajado con su laptop" position="55% 30%" style={{ left: 70, top: 600, width: 480, height: 560, transform: "rotate(-3deg)" }} ring={GREEN} />
    <Card t={t} style={{ position: "absolute", left: 470, top: 640, padding: "16px 24px", display: "flex", alignItems: "center", gap: 12, transform: "rotate(4deg)" }}>
      <div style={{ width: 46, height: 46, borderRadius: 23, background: GREEN, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon d={IC.check} size={28} sw={3.2} />
      </div>
      <span style={{ fontWeight: 800, fontSize: 34 }}>Consulta lista</span>
    </Card>
    <div style={{ position: "absolute", left: 590, right: 50, top: 820, display: "flex", flexDirection: "column", gap: 18, alignItems: "flex-start" }}>
      <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 32, color: "#fff", background: C.purple, borderRadius: 999, padding: "18px 30px", boxShadow: "0 16px 40px rgba(37,14,148,.3)", whiteSpace: "nowrap" }}>Crea tu cuenta gratis →</span>
      <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 34, color: t.ink }}>fispal.mx</span>
      <span style={{ fontFamily: FONT, fontWeight: 600, fontSize: 30, color: t.sub, lineHeight: 1.3 }}>y empieza a consultar tu información fiscal.</span>
    </div>
    <Glass3D name="esfera" x={930} y={1220} size={170} />
  </Frame>
);

export const C2_SLIDES = [S1, S2, S3, S4, S5];
export const Carrusel2Erp: React.FC = () => <Carousel slides={C2_SLIDES} theme={THEMES.light} />;
