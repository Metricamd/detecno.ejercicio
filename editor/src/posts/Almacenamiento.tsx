// Static post 4:5 (1080×1350) — "Almacenamiento gratis primer año" (brief #4).
// Same look as the carousel v2: brand blue instead of black, no black pills,
// glossy 3D and a livelier composition around a Fispal storage panel.
import React, { useEffect, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, Img, staticFile } from "remotion";
import { C, FONT, MONO, fontsLoaded } from "../fispal/theme";
import { Stage } from "../fispal/three/Stage";
import { Invoices, Pop } from "../fispal/three/objects";
import { ArchiveBox, StorageCloud } from "../fispal/three/objects2";
import { Background, Check } from "../fispal/ui";
import {
  BLUE,
  Blob,
  Dots,
  G,
  Headline,
  IconTile,
  L,
  MUTED,
  P,
  PostFloaters,
  POST_H,
  SHADOW,
  Sub,
} from "./Personaliza";

const FILES = [
  { code: "XML", name: "CFDI_F-1023.xml", meta: "Ingreso · 21 sep 2026" },
  { code: "PDF", name: "CFDI_F-1023.pdf", meta: "Representación impresa" },
  { code: "XML", name: "Nomina_SEP2026.xml", meta: "Nómina · 30 sep 2026" },
];

// Circular stamp with the text running around the edge.
const Seal: React.FC<{ size: number }> = ({ size }) => {
  const r = size / 2 - 22;
  const text = "GRATUITO DURANTE EL PRIMER AÑO ★ 1ER AÑO SIN COSTO ★ ";
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: C.accent,
        boxShadow: `0 0 0 8px ${C.white}, 0 24px 50px rgba(32,217,157,.45)`,
        position: "relative",
      }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <path id="seal-path" d={`M ${size / 2} ${size / 2} m -${r} 0 a ${r} ${r} 0 1 1 ${2 * r} 0 a ${r} ${r} 0 1 1 -${2 * r} 0`} />
        </defs>
        <text fontFamily={MONO} fontWeight={700} fontSize={17} letterSpacing={1.6} fill={BLUE}>
          <textPath href="#seal-path" textLength={2 * Math.PI * r - 4} lengthAdjust="spacing">
            {text}
          </textPath>
        </text>
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: FONT,
          color: BLUE,
          lineHeight: 1,
        }}
      >
        <div style={{ fontWeight: 800, fontSize: 24 }}>1er año</div>
        <div style={{ fontWeight: 800, fontSize: 52, color: C.white, letterSpacing: "-0.03em", margin: "2px 0" }}>GRATIS</div>
        <div style={{ fontWeight: 700, fontSize: 17 }}>almacenamiento</div>
      </div>
    </div>
  );
};

const StoragePanel: React.FC = () => (
  <div
    style={{
      width: 600,
      background: C.white,
      borderRadius: 32,
      padding: "28px 30px",
      boxShadow: SHADOW,
      fontFamily: FONT,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <svg width={46} height={34} viewBox="0 0 46 34">
        <path d="M12 32h24a10 10 0 0 0 1-20A13 13 0 0 0 12 9 11.5 11.5 0 0 0 12 32z" fill={C.accent} />
        <path d="M23 26V15m-5 4l5-5 5 5" stroke={C.white} strokeWidth={3.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div style={{ fontSize: 36, fontWeight: 800, color: BLUE }}>Almacenamiento</div>
    </div>
    <div style={{ fontSize: 22, fontWeight: 600, color: MUTED, marginTop: 14 }}>Tu información fiscal, centralizada</div>
    <div style={{ height: 16, borderRadius: 8, background: "#EEF0F6", marginTop: 12, overflow: "hidden" }}>
      <div style={{ width: "64%", height: "100%", borderRadius: 8, background: `linear-gradient(90deg, ${C.accent}, #12B886)` }} />
    </div>
    {FILES.map((f) => (
      <div
        key={f.name}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginTop: 14,
          padding: "12px 14px",
          borderRadius: 18,
          background: "#F6F7FC",
        }}
      >
        <IconTile code={f.code} size={56} color={f.code === "PDF" ? "#3A23B5" : BLUE} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: BLUE }}>{f.name}</div>
          <div style={{ fontSize: 18, fontWeight: 500, color: MUTED }}>{f.meta}</div>
        </div>
        <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 18, fontWeight: 700, color: "#0E8F63" }}>
          <Check size={30} /> Guardado
        </span>
      </div>
    ))}
  </div>
);

export const AlmacenamientoPost: React.FC = () => {
  const [handle] = useState(() => delayRender("Loading fonts"));
  useEffect(() => {
    fontsLoaded.then(() => continueRender(handle));
  }, [handle]);

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Background />
      <Blob style={{ right: -180, top: 470, width: 700, height: 700 }} color="#D6F8EC" />
      <Blob style={{ left: -140, top: 980, width: 420, height: 420 }} color="#E3E6FF" radius={110} rotate={20} />
      <Dots x={70} y={1060} cols={7} rows={2} />

      <Stage top={0} height={POST_H} z={16}>
        <PostFloaters items={[[1040, 1180, 34, P], [48, 520, 26, G, true], [560, 1300, 22, L]]} />
      </Stage>

      {/* header */}
      <div style={{ position: "absolute", left: 70, right: 70, top: 62, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Img src={staticFile("brand/fispal-logo.png")} style={{ height: 50 }} />
        <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 24, color: BLUE, letterSpacing: "0.1em" }}>
          <span style={{ color: C.accent }}>●</span> BENEFICIO
        </span>
      </div>
      <div style={{ position: "absolute", left: 70, right: 70, top: 158, zIndex: 2 }}>
        <Headline size={74} parts={["Tu primer año de almacenamiento ", { hl: "va por nuestra cuenta." }]} />
        <Sub>Almacenamiento gratuito durante el primer año.</Sub>
      </div>

      {/* Fispal storage panel */}
      <div style={{ position: "absolute", left: 60, top: 560, transform: "rotate(-2.5deg)", zIndex: 1 }}>
        <StoragePanel />
      </div>

      {/* 3D: cloud + archive with documents */}
      <Stage top={470} left={620} width={460} height={300}>
        <Pop at={0} scale={0.82} spin={0.004} tilt={0.1}>
          <StorageCloud />
        </Pop>
      </Stage>
      <Stage top={720} left={600} width={480} height={460}>
        <Pop at={0} scale={0.95} spin={0} tilt={0.05}>
          <ArchiveBox />
        </Pop>
      </Stage>
      <Stage top={1000} left={0} width={300} height={240}>
        <Pop at={0} scale={0.42} tilt={0.3}>
          <Invoices />
        </Pop>
      </Stage>

      {/* stamp */}
      <div style={{ position: "absolute", left: 520, top: 455, transform: "rotate(-12deg)", zIndex: 3 }}>
        <Seal size={240} />
      </div>

      {/* CTA */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1170, display: "flex", justifyContent: "center", alignItems: "center", gap: 22, zIndex: 3 }}>
        <div
          style={{
            background: C.accent,
            color: C.white,
            fontFamily: FONT,
            fontWeight: 800,
            fontSize: 42,
            borderRadius: 999,
            padding: "24px 52px",
            boxShadow: "0 18px 40px rgba(32,217,157,.35)",
          }}
        >
          Comienza hoy gratis →
        </div>
        <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 30, color: C.white, background: BLUE, borderRadius: 999, padding: "14px 30px" }}>
          fispal.mx
        </span>
      </div>
    </AbsoluteFill>
  );
};
