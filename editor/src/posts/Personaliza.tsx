// Instagram carousel 4:5 (1080×1350) — "Personaliza tu plan" (brief #2).
// Same series look as the reels: palette, Poppins, black pills, glossy 3D,
// Fispal UI. One main visual idea per slide. Each slide is a 60-frame
// Sequence; stills are rendered at frame i * 60 + STILL_AT.
import React, { useEffect, useState } from "react";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  Img,
  Sequence,
  staticFile,
} from "remotion";
import { Dashboard } from "../fispal/Dashboard";
import { C, FONT, MONO, cardShadow, fontsLoaded } from "../fispal/theme";
import { Stage } from "../fispal/three/Stage";
import {
  ApiNodes,
  Blocks,
  IdBadge,
  Orb,
  People,
  Pop,
} from "../fispal/three/objects";
import { InvoiceTiers } from "../fispal/three/objects2";
import { Background, Card, Check, Pill } from "../fispal/ui";

export const POST_W = 1080;
export const POST_H = 1350;
export const SLIDE_FRAMES = 60;
export const STILL_AT = 50;

const TOTAL = 6;
const GREY = "#55586A";

/* ---------- shared slide chrome ---------- */

type Seg = string | { hl: string };

const Headline: React.FC<{ parts: Seg[]; size?: number }> = ({ parts, size = 70 }) => (
  <div
    style={{
      fontFamily: FONT,
      fontWeight: 800,
      fontSize: size,
      lineHeight: 1.08,
      letterSpacing: "-0.025em",
      color: C.text,
    }}
  >
    {parts.map((p, i) =>
      typeof p === "string" ? (
        <span key={i}>{p}</span>
      ) : (
        <span key={i} style={{ color: C.accent }}>
          {p.hl}
        </span>
      ),
    )}
  </div>
);

const Sub: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 34, lineHeight: 1.35, color: GREY, marginTop: 22 }}>
    {children}
  </div>
);

const Frame: React.FC<{
  n: number;
  head: React.ReactNode;
  children: React.ReactNode;
  last?: boolean;
}> = ({ n, head, children, last }) => (
  <AbsoluteFill>
    <Background />
    <div style={{ position: "absolute", left: 70, right: 70, top: 64, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <Pill>{`0${n}/0${TOTAL} · Personaliza tu plan`}</Pill>
      <Img src={staticFile("brand/fispal-logo.png")} style={{ height: 46 }} />
    </div>
    <div style={{ position: "absolute", left: 70, right: 70, top: 170 }}>{head}</div>
    {children}
    {!last && (
      <div style={{ position: "absolute", left: 70, right: 70, bottom: 60, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 26, color: C.purple }}>fispal.mx</span>
        <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 28, color: C.white, background: C.purple, borderRadius: 999, padding: "12px 28px" }}>
          Desliza →
        </span>
      </div>
    )}
  </AbsoluteFill>
);

const IconTile: React.FC<{ code: string; on?: boolean; size?: number }> = ({ code, on = true, size = 72 }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.26,
      background: on ? C.purple : "#E3E5EE",
      color: C.white,
      fontFamily: MONO,
      fontWeight: 700,
      fontSize: size * 0.28,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }}
  >
    {code}
  </div>
);

/* ---------- Slide 1 — portada ---------- */
const FEATURES = [
  { code: "XML", label: "CFDI", x: 40, y: 560 },
  { code: "RFC", label: "RFC", x: 760, y: 560 },
  { code: "MOD", label: "Módulos", x: 20, y: 930 },
  { code: "USR", label: "Colaboradores", x: 700, y: 960 },
  { code: "API", label: "API", x: 390, y: 1080 },
];

const S1: React.FC = () => (
  <Frame
    n={1}
    head={
      <>
        <Headline parts={["Elige lo que necesitas. Fispal ", { hl: "se adapta." }]} />
        <Sub>Configura tu plan a la medida de tu operación.</Sub>
      </>
    }
  >
    {/* Fispal screen in the middle */}
    <div
      style={{
        position: "absolute",
        left: 160,
        top: 650,
        width: 760,
        borderRadius: 22,
        boxShadow: "0 30px 80px rgba(37,14,148,.18)",
        overflow: "hidden",
        transform: "rotate(-2deg)",
      }}
    >
      <div style={{ transform: "scale(0.81)", transformOrigin: "0 0", height: 440 }}>
        <Dashboard reveal={-100} />
      </div>
    </div>
    {/* feature cards around it */}
    {FEATURES.map((f, i) => (
      <div
        key={f.code}
        style={{
          position: "absolute",
          left: f.x,
          top: f.y,
          display: "flex",
          alignItems: "center",
          gap: 16,
          background: C.white,
          borderRadius: 22,
          padding: "16px 26px 16px 16px",
          boxShadow: cardShadow,
          border: `3px solid ${C.accent}`,
          transform: `rotate(${[-4, 3, 2, -3, 1][i]}deg)`,
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: 32,
          color: C.text,
        }}
      >
        <IconTile code={f.code} size={64} />
        {f.label}
      </div>
    ))}
    <Stage top={1040} left={800} width={260} height={220}>
      <Pop at={0} scale={0.5}>
        <Blocks at={0} />
      </Pop>
    </Stage>
  </Frame>
);

/* ---------- Slide 2 — paquetes de CFDI ---------- */
const TIERS = [
  { name: "Inicial", qty: "500", unit: "CFDI / año" },
  { name: "Crecimiento", qty: "2,000", unit: "CFDI / año", picked: true },
  { name: "Volumen", qty: "10,000", unit: "CFDI / año" },
];

const S2: React.FC = () => (
  <Frame
    n={2}
    head={
      <>
        <Headline parts={["Empieza por el ", { hl: "volumen" }, " de tu operación."]} />
        <Sub>Selecciona el paquete de CFDI que necesitas.</Sub>
      </>
    }
  >
    <Stage top={470} height={440}>
      <Pop at={0} spin={0} tilt={0.05} scale={1.05}>
        <InvoiceTiers selected={1} />
      </Pop>
    </Stage>
    <div style={{ position: "absolute", left: 70, right: 70, top: 930, display: "flex", gap: 22 }}>
      {TIERS.map((t) => (
        <div
          key={t.name}
          style={{
            flex: 1,
            position: "relative",
            background: t.picked ? "#F2FDF8" : C.white,
            border: `4px solid ${t.picked ? C.accent : "#ECEDF3"}`,
            borderRadius: 26,
            padding: "26px 22px",
            boxShadow: cardShadow,
            fontFamily: FONT,
            transform: t.picked ? "translateY(-14px)" : undefined,
          }}
        >
          {t.picked && (
            <div style={{ position: "absolute", top: -22, right: 18 }}>
              <Check size={46} />
            </div>
          )}
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 20, letterSpacing: "0.08em", color: "#8A8DA0", textTransform: "uppercase" }}>
            {t.name}
          </div>
          <div style={{ fontWeight: 800, fontSize: 54, color: t.picked ? C.purple : C.text, letterSpacing: "-0.03em", marginTop: 6 }}>
            {t.qty}
          </div>
          <div style={{ fontWeight: 600, fontSize: 22, color: GREY }}>{t.unit}</div>
        </div>
      ))}
    </div>
  </Frame>
);

/* ---------- Slide 3 — RFC principal + adicionales ---------- */
const EXTRA_RFC = [
  { x: 110, y: 640, rfc: "EKU9003173C9" },
  { x: 680, y: 620, rfc: "IIA040805DZ4" },
  { x: 90, y: 1030, rfc: "MOSR830215JK" },
];

const S3: React.FC = () => {
  const cx = 540;
  const cy = 860;
  return (
    <Frame
      n={3}
      head={
        <>
          <Headline parts={["¿Necesitas administrar ", { hl: "más RFC?" }]} />
          <Sub>Agrega RFC adicionales a tu plan de acuerdo con tu operación.</Sub>
        </>
      }
    >
      {/* connections */}
      <svg width={POST_W} height={POST_H} style={{ position: "absolute", inset: 0 }}>
        {[...EXTRA_RFC.map((r) => [r.x + 150, r.y + 50]), [830, 1080]].map(([x, y], i) => (
          <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke={C.accent} strokeWidth={5} strokeDasharray="14 12" strokeLinecap="round" />
        ))}
      </svg>
      <Stage top={cy - 210} left={cx - 260} width={520} height={420}>
        <Pop at={0} scale={1.05} spin={0} tilt={0.1}>
          <group rotation={[0.15, -0.3, 0]}>
            <IdBadge />
          </group>
        </Pop>
      </Stage>
      <div style={{ position: "absolute", left: cx - 150, top: cy + 160, width: 300, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.purple }}>
        RFC principal
      </div>
      {EXTRA_RFC.map((r) => (
        <div
          key={r.rfc}
          style={{
            position: "absolute",
            left: r.x,
            top: r.y,
            width: 300,
            background: C.white,
            borderRadius: 22,
            padding: "18px 22px",
            boxShadow: cardShadow,
            border: "1px solid rgba(0,0,0,.05)",
            fontFamily: FONT,
          }}
        >
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 18, letterSpacing: "0.08em", color: "#0E8F63" }}>RFC ADICIONAL</div>
          <div style={{ fontWeight: 700, fontSize: 28, color: C.text, marginTop: 4 }}>{r.rfc}</div>
        </div>
      ))}
      {/* "add one more" slot */}
      <div
        style={{
          position: "absolute",
          left: 700,
          top: 1030,
          width: 260,
          height: 100,
          borderRadius: 22,
          border: `4px dashed ${C.accent}`,
          background: "rgba(32,217,157,.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: 30,
          color: "#0E8F63",
        }}
      >
        <span style={{ fontSize: 44, lineHeight: 1 }}>+</span> Agregar RFC
      </div>
    </Frame>
  );
};

/* ---------- Slide 4 — módulos activables ---------- */
const MODS = [
  { code: "AUD", name: "Auditoría", desc: "Revisa y valida tus CFDI", on: true },
  { code: "RSG", name: "Riesgo", desc: "Detecta proveedores en listas del SAT", on: true },
  { code: "CAN", name: "Cancelaciones", desc: "Gestiona cancelaciones en un solo lugar", on: true },
];

const Toggle: React.FC<{ on: boolean }> = ({ on }) => (
  <div style={{ width: 92, height: 52, borderRadius: 26, background: on ? C.accent : "#D9DCE6", position: "relative", flexShrink: 0 }}>
    <div style={{ position: "absolute", top: 6, left: on ? 46 : 6, width: 40, height: 40, borderRadius: 20, background: C.white, boxShadow: "0 2px 6px rgba(0,0,0,.15)" }} />
  </div>
);

const S4: React.FC = () => (
  <Frame
    n={4}
    head={
      <>
        <Headline parts={["Suma las ", { hl: "herramientas" }, " que necesitas."]} />
        <Sub>Complementa tu plan con módulos como:</Sub>
      </>
    }
  >
    <div style={{ position: "absolute", left: 70, right: 70, top: 560, display: "flex", flexDirection: "column", gap: 22 }}>
      {MODS.map((m) => (
        <div
          key={m.code}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 26,
            background: "#F2FDF8",
            border: `4px solid ${C.accent}`,
            borderRadius: 28,
            padding: "26px 30px",
            boxShadow: cardShadow,
            fontFamily: FONT,
          }}
        >
          <IconTile code={m.code} size={88} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 42, color: C.text }}>{m.name}</div>
            <div style={{ fontWeight: 500, fontSize: 26, color: GREY }}>{m.desc}</div>
          </div>
          <Toggle on={m.on} />
        </div>
      ))}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "4px dashed #D9DCE6",
          borderRadius: 28,
          padding: "22px 30px",
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: 32,
          color: "#8A8DA0",
        }}
      >
        + y más módulos
      </div>
    </div>
  </Frame>
);

/* ---------- Slide 5 — Equipo → Fispal → Sistemas/API ---------- */
const Arrow: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <svg width={110} height={60} style={{ position: "absolute", left: x, top: y }} viewBox="0 0 110 60">
    <path d="M6 30h84" stroke={C.accent} strokeWidth={8} strokeLinecap="round" strokeDasharray="2 16" />
    <path d="M78 12l20 18-20 18" fill="none" stroke={C.accent} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const NodeLabel: React.FC<{ x: number; title: string; sub: string }> = ({ x, title, sub }) => (
  <div style={{ position: "absolute", left: x - 150, top: 1050, width: 300, textAlign: "center", fontFamily: FONT }}>
    <div style={{ fontWeight: 800, fontSize: 36, color: C.text }}>{title}</div>
    <div style={{ fontWeight: 500, fontSize: 24, color: GREY, marginTop: 2 }}>{sub}</div>
  </div>
);

const S5: React.FC = () => (
  <Frame
    n={5}
    head={
      <>
        <Headline size={64} parts={["Haz que Fispal ", { hl: "se integre" }, " a tu forma de trabajar."]} />
        <Sub>Agrega licencias para colaboradores e integraciones por API según las necesidades de tu empresa.</Sub>
      </>
    }
  >
    <Stage top={700} height={360}>
      <Pop at={0} position={[-3.3, 0, 0]} scale={0.62} spin={0.004}>
        <People />
      </Pop>
      <Pop at={0} position={[3.3, 0, 0]} scale={0.55}>
        <ApiNodes />
      </Pop>
    </Stage>
    {/* Fispal in the middle */}
    <div
      style={{
        position: "absolute",
        left: 540 - 140,
        top: 760,
        width: 280,
        height: 240,
        borderRadius: 36,
        background: C.white,
        boxShadow: "0 30px 70px rgba(37,14,148,.18)",
        border: `4px solid ${C.accent}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Img src={staticFile("brand/fispal-logo.png")} style={{ width: 210 }} />
    </div>
    <Arrow x={290} y={850} />
    <Arrow x={680} y={850} />
    <NodeLabel x={185} title="Equipo" sub="Licencias para colaboradores" />
    <NodeLabel x={540} title="Fispal" sub="Tu centro fiscal" />
    <NodeLabel x={895} title="Sistemas" sub="Integraciones por API" />
  </Frame>
);

/* ---------- Slide 6 — CTA ---------- */
const PLAN = [
  { code: "XML", title: "Paquete de CFDI", sub: "2,000 CFDI / año" },
  { code: "RFC", title: "RFC adicionales", sub: "+3 RFC" },
  { code: "MOD", title: "Módulos", sub: "Auditoría · Riesgo · Cancelaciones" },
  { code: "USR", title: "Colaboradores", sub: "+5 licencias" },
  { code: "API", title: "Integraciones API", sub: "REST · Webhooks" },
];

const S6: React.FC = () => (
  <Frame n={6} last head={<Headline size={92} parts={[{ hl: "Personaliza" }, " tu plan"]} />}>
    <div style={{ position: "absolute", left: 110, top: 330 }}>
      <Card style={{ width: 860, padding: "30px 36px", fontFamily: FONT }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <div style={{ fontSize: 38, fontWeight: 700 }}>Arma tu plan</div>
          <div style={{ fontFamily: MONO, fontSize: 22, fontWeight: 700, color: C.purple, background: "#EEEBFF", borderRadius: 999, padding: "8px 18px" }}>
            5/5 activos
          </div>
        </div>
        {PLAN.map((p) => (
          <div
            key={p.code}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 22,
              padding: "16px 18px",
              marginTop: 12,
              borderRadius: 18,
              border: `3px solid ${C.accent}`,
              background: "#F2FDF8",
            }}
          >
            <IconTile code={p.code} size={66} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 30, fontWeight: 700 }}>{p.title}</div>
              <div style={{ fontSize: 22, fontWeight: 500, color: "#7A7D90" }}>{p.sub}</div>
            </div>
            <Check size={46} />
          </div>
        ))}
      </Card>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1110, display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
      <div
        style={{
          background: C.accent,
          color: C.white,
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: 44,
          borderRadius: 999,
          padding: "26px 64px",
          boxShadow: "0 18px 40px rgba(32,217,157,.35)",
        }}
      >
        Personaliza tu plan →
      </div>
      <Pill style={{ textTransform: "none", fontSize: 30 }}>fispal.mx</Pill>
    </div>
    <Stage top={1070} left={0} width={270} height={260}>
      <Pop at={0} scale={0.5}>
        <Orb />
      </Pop>
    </Stage>
  </Frame>
);

const SLIDES = [S1, S2, S3, S4, S5, S6];
export const PERSONALIZA_FRAMES = SLIDES.length * SLIDE_FRAMES;

export const PersonalizaCarousel: React.FC = () => {
  const [handle] = useState(() => delayRender("Loading fonts"));
  useEffect(() => {
    fontsLoaded.then(() => continueRender(handle));
  }, [handle]);
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      {SLIDES.map((S, i) => (
        <Sequence key={i} from={i * SLIDE_FRAMES} durationInFrames={SLIDE_FRAMES} name={`Slide ${i + 1}`}>
          <S />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
