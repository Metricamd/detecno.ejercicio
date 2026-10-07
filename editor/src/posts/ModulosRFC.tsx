// Instagram carousel 4:5 — "Módulos por RFC en Mis contribuyentes" (brief #5).
// Same series (Poppins, green highlight, white UI cards, glossy 3D, no black
// pills) but on a dark brand-blue background so it reads as its own piece.
import React, { useEffect, useState } from "react";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  Img,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { C, FONT, MONO, fontsLoaded } from "../fispal/theme";
import { Stage } from "../fispal/three/Stage";
import { IdBadge, Pop } from "../fispal/three/objects";
import { AlertSign, CancelDoc, Shield } from "../fispal/three/objects2";
import { type Floater, PostFloaters, POST_H, POST_W, SLIDE_FRAMES, type Seg } from "./Personaliza";

const TOTAL = 3;
const WHITE = C.white;
const SOFT = "#C9C2FF"; // muted text on dark
const BLUE = C.purple;
const NAVY = "#14085C";
const CARD_SHADOW = "0 30px 70px rgba(5,0,40,.45)";

/* ---------- dark series background ---------- */
const DarkBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 50) * 30;
  return (
    <AbsoluteFill style={{ background: `linear-gradient(160deg, #2E14B8 0%, ${BLUE} 45%, ${NAVY} 100%)`, overflow: "hidden" }}>
      {/* soft glows */}
      <div style={{ position: "absolute", width: 820, height: 820, right: -300 + drift, top: -260, borderRadius: "50%", background: C.accent, filter: "blur(160px)", opacity: 0.35 }} />
      <div style={{ position: "absolute", width: 760, height: 760, left: -320, bottom: -300 - drift, borderRadius: "50%", background: "#7C6CFF", filter: "blur(150px)", opacity: 0.45 }} />
      {/* subtle grid */}
      <svg width={POST_W} height={POST_H} style={{ position: "absolute", inset: 0, opacity: 0.09 }}>
        {Array.from({ length: 13 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 90} y1={0} x2={i * 90} y2={POST_H} stroke={WHITE} strokeWidth={1.5} />
        ))}
        {Array.from({ length: 16 }).map((_, i) => (
          <line key={`h${i}`} x1={0} y1={i * 90} x2={POST_W} y2={i * 90} stroke={WHITE} strokeWidth={1.5} />
        ))}
      </svg>
    </AbsoluteFill>
  );
};

const Headline: React.FC<{ parts: Seg[]; size?: number }> = ({ parts, size = 72 }) => (
  <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: size, lineHeight: 1.06, letterSpacing: "-0.03em", color: WHITE }}>
    {parts.map((p, i) =>
      typeof p === "string" ? <span key={i}>{p}</span> : <span key={i} style={{ color: C.accent }}>{p.hl}</span>,
    )}
  </div>
);

const Sub: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 32, lineHeight: 1.35, color: SOFT, marginTop: 18 }}>{children}</div>
);

/* ---------- module icons (flat, for UI chips) ---------- */
type ModKey = "aud" | "can" | "rsg";
const MOD: Record<ModKey, { name: string; color: string }> = {
  aud: { name: "Auditoría", color: "#0E8F63" },
  can: { name: "Cancelaciones", color: "#D63C68" },
  rsg: { name: "Riesgo", color: "#C98A00" },
};

const ModIcon: React.FC<{ k: ModKey; size?: number; color?: string }> = ({ k, size = 26, color }) => {
  const c = color ?? MOD[k].color;
  if (k === "aud")
    return (
      <svg width={size} height={size} viewBox="0 0 24 24">
        <path d="M12 2l8 3v6c0 5-3.4 9.3-8 11-4.6-1.7-8-6-8-11V5z" fill={c} />
        <path d="M8 12l3 3 5-6" stroke="#fff" strokeWidth={2.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  if (k === "can")
    return (
      <svg width={size} height={size} viewBox="0 0 24 24">
        <path d="M6 2h9l5 5v15H6z" fill={c} />
        <path d="M10 11l5 5m0-5l-5 5" stroke="#fff" strokeWidth={2.4} strokeLinecap="round" />
      </svg>
    );
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path d="M12 2.5l10 18H2z" fill={c} strokeLinejoin="round" />
      <path d="M12 9v5" stroke="#fff" strokeWidth={2.4} strokeLinecap="round" />
      <circle cx={12} cy={17.2} r={1.4} fill="#fff" />
    </svg>
  );
};

const Switch: React.FC<{ on: boolean; scale?: number }> = ({ on, scale = 1 }) => (
  <div style={{ width: 64 * scale, height: 36 * scale, borderRadius: 18 * scale, background: on ? C.accent : "#D9DCE6", position: "relative", flexShrink: 0 }}>
    <div
      style={{
        position: "absolute",
        top: 4 * scale,
        left: (on ? 32 : 4) * scale,
        width: 28 * scale,
        height: 28 * scale,
        borderRadius: 14 * scale,
        background: WHITE,
        boxShadow: "0 2px 5px rgba(0,0,0,.18)",
      }}
    />
  </div>
);

const Frame: React.FC<{ n: number; floaters: Floater[]; children: React.ReactNode; last?: boolean }> = ({ n, floaters, children, last }) => (
  <AbsoluteFill style={{ overflow: "hidden" }}>
    <DarkBackground />
    <Stage top={0} height={POST_H} z={16}>
      <PostFloaters items={floaters} />
    </Stage>
    <div style={{ position: "absolute", left: 70, right: 70, top: 62, display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 2 }}>
      <Img src={staticFile("brand/fispal-logo-white.png")} style={{ height: 50 }} />
      <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 26, color: WHITE, letterSpacing: "0.08em" }}>
        <span style={{ color: C.accent }}>{`0${n}`}</span> / 0{TOTAL}
      </span>
    </div>
    {children}
    {!last && (
      <div style={{ position: "absolute", left: 70, right: 70, bottom: 56, display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 2 }}>
        <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 26, color: WHITE }}>fispal.mx</span>
        <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 28, color: BLUE, background: C.accent, borderRadius: 999, padding: "12px 30px" }}>
          Desliza →
        </span>
      </div>
    )}
  </AbsoluteFill>
);

const G = C.accent;
const L = "#C9C2FF";
const W = "#FFFFFF";

/* ---------- Slide 1 — portada: each RFC with its own modules ---------- */
const COMPANIES: { name: string; rfc: string; mods: Record<ModKey, boolean>; rot: number; x: number; y: number }[] = [
  { name: "Comercializadora Andina", rfc: "CAN180512AB3", mods: { aud: true, can: false, rsg: true }, rot: -4, x: 50, y: 540 },
  { name: "Servicios Lumen", rfc: "SLU150301KQ9", mods: { aud: false, can: true, rsg: false }, rot: 3, x: 565, y: 650 },
  { name: "Grupo Rivas Logística", rfc: "GRL201109TT1", mods: { aud: true, can: true, rsg: true }, rot: -2, x: 150, y: 890 },
];

const RfcCard: React.FC<(typeof COMPANIES)[number]> = ({ name, rfc, mods, rot, x, y }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: 470,
      background: WHITE,
      borderRadius: 30,
      padding: "22px 22px",
      boxShadow: CARD_SHADOW,
      fontFamily: FONT,
      transform: `rotate(${rot}deg)`,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{ width: 54, height: 54, borderRadius: 16, background: BLUE, color: WHITE, fontFamily: MONO, fontWeight: 700, fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>
        RFC
      </div>
      <div>
        <div style={{ fontWeight: 800, fontSize: 26, color: BLUE, lineHeight: 1.1 }}>{name}</div>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 19, color: "#7A7D90", marginTop: 4 }}>{rfc}</div>
      </div>
    </div>
    <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
      {(Object.keys(MOD) as ModKey[]).map((k) => {
        const on = mods[k];
        return (
          <div
            key={k}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
              padding: "12px 6px",
              borderRadius: 18,
              background: on ? "#F2FDF8" : "#F4F5FA",
              border: `3px solid ${on ? C.accent : "transparent"}`,
              opacity: on ? 1 : 0.55,
            }}
          >
            <ModIcon k={k} size={30} color={on ? undefined : "#A3A6B8"} />
            <div style={{ fontWeight: 700, fontSize: 15, color: on ? BLUE : "#8A8DA0" }}>{MOD[k].name}</div>
            <Switch on={on} scale={0.8} />
          </div>
        );
      })}
    </div>
  </div>
);

const S1: React.FC = () => (
  <Frame n={1} floaters={[[60, 1180, 30, G], [540, 1290, 24, L, true], [1040, 480, 26, W]]}>
    <div style={{ position: "absolute", left: 70, right: 70, top: 158, zIndex: 2 }}>
      <Headline parts={["Cada RFC, con ", { hl: "las herramientas que necesita." }]} />
      <Sub>Activa los módulos para cada razón social y mantén tu operación organizada.</Sub>
    </div>
    {COMPANIES.map((c) => (
      <RfcCard key={c.rfc} {...c} />
    ))}
    <Stage top={890} left={680} width={400} height={330}>
      <Pop at={0} scale={0.7} tilt={0.15}>
        <IdBadge />
      </Pop>
    </Stage>
  </Frame>
);

/* ---------- Slide 2 — the three modules ---------- */
const ROWS: { k: ModKey; title: string; desc: string; Obj: React.FC }[] = [
  { k: "aud", title: "Auditoría", desc: "Revisa tus CFDI antes de que lo haga el SAT.", Obj: Shield },
  { k: "can", title: "Cancelaciones", desc: "Da seguimiento a cada CFDI que cancelas.", Obj: CancelDoc },
  { k: "rsg", title: "Riesgo", desc: "Identifica alertas fiscales a tiempo.", Obj: AlertSign },
];

const S2: React.FC = () => (
  <Frame n={2} floaters={[[1045, 470, 26, G, true], [540, 1290, 24, W], [36, 1180, 30, L]]}>
    <div style={{ position: "absolute", left: 70, right: 70, top: 158, zIndex: 2 }}>
      <Headline parts={["Elige qué activar ", { hl: "en cada RFC." }]} />
    </div>
    {ROWS.map((r, i) => {
      const top = 360 + i * 285;
      return (
        <React.Fragment key={r.k}>
          <div
            style={{
              position: "absolute",
              left: i % 2 ? 110 : 70,
              width: 900,
              top,
              height: 240,
              background: WHITE,
              borderRadius: 36,
              boxShadow: CARD_SHADOW,
              display: "flex",
              alignItems: "center",
              paddingLeft: 280,
              paddingRight: 40,
              boxSizing: "border-box",
              fontFamily: FONT,
              transform: `rotate(${[-1.5, 1.2, -1][i]}deg)`,
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <ModIcon k={r.k} size={34} />
                <div style={{ fontWeight: 800, fontSize: 46, color: BLUE, letterSpacing: "-0.02em" }}>{r.title}</div>
              </div>
              <div style={{ fontWeight: 500, fontSize: 28, color: "#5B5F86", marginTop: 8, lineHeight: 1.3 }}>{r.desc}</div>
            </div>
            <Switch on scale={1.2} />
          </div>
          {/* 3D icon breaking out of the card's left edge */}
          <Stage top={top - 40} left={i % 2 ? 60 : 20} width={330} height={320}>
            <Pop at={i * 4} scale={0.95} spin={0.006} tilt={0.2}>
              <r.Obj />
            </Pop>
          </Stage>
        </React.Fragment>
      );
    })}
  </Frame>
);

/* ---------- Slide 3 — "Mis contribuyentes" + CTA ---------- */
const TABLE: { name: string; rfc: string; mods: Record<ModKey, boolean> }[] = [
  { name: "Comercializadora Andina", rfc: "CAN180512AB3", mods: { aud: true, can: false, rsg: true } },
  { name: "Servicios Lumen", rfc: "SLU150301KQ9", mods: { aud: false, can: true, rsg: false } },
  { name: "Grupo Rivas Logística", rfc: "GRL201109TT1", mods: { aud: true, can: true, rsg: true } },
  { name: "Inmobiliaria Sol", rfc: "ISO190827MN4", mods: { aud: true, can: false, rsg: false } },
];

const MisContribuyentes: React.FC = () => (
  <div style={{ width: 940, background: WHITE, borderRadius: 30, overflow: "hidden", boxShadow: CARD_SHADOW, fontFamily: FONT }}>
    <div style={{ height: 70, background: "#F7F7FC", borderBottom: "1px solid #E8E9F1", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px" }}>
      <Img src={staticFile("brand/fispal-logo.png")} style={{ height: 30 }} />
      <div style={{ display: "flex", gap: 8 }}>
        {[0, 1, 2].map((i) => (
          <span key={i} style={{ width: 12, height: 12, borderRadius: 6, background: "#D9DCE6" }} />
        ))}
      </div>
    </div>
    <div style={{ padding: "22px 28px 26px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 38, fontWeight: 800, color: BLUE }}>Mis contribuyentes</div>
        <span style={{ fontSize: 20, fontWeight: 700, color: WHITE, background: BLUE, borderRadius: 999, padding: "10px 20px" }}>+ Agregar RFC</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "2.4fr 1fr 1fr 1fr", alignItems: "center", marginTop: 18, padding: "12px 16px", borderRadius: 14, background: "#F4F5FA", fontSize: 18, fontWeight: 700, color: "#7A7D90" }}>
        <span>Contribuyente</span>
        {(Object.keys(MOD) as ModKey[]).map((k) => (
          <span key={k} style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center" }}>
            <ModIcon k={k} size={20} /> {MOD[k].name === "Cancelaciones" ? "Cancel." : MOD[k].name}
          </span>
        ))}
      </div>
      {TABLE.map((r, i) => (
        <div
          key={r.rfc}
          style={{
            display: "grid",
            gridTemplateColumns: "2.4fr 1fr 1fr 1fr",
            alignItems: "center",
            padding: "14px 16px",
            borderBottom: i < TABLE.length - 1 ? "1px solid #EEEFF4" : "none",
            background: i === 2 ? "#F2FDF8" : "transparent",
            borderRadius: i === 2 ? 14 : 0,
          }}
        >
          <div>
            <div style={{ fontSize: 23, fontWeight: 700, color: BLUE }}>{r.name}</div>
            <div style={{ fontFamily: MONO, fontSize: 16, fontWeight: 700, color: "#8A8DA0" }}>{r.rfc}</div>
          </div>
          {(Object.keys(MOD) as ModKey[]).map((k) => (
            <div key={k} style={{ display: "flex", justifyContent: "center" }}>
              <Switch on={r.mods[k]} scale={0.9} />
            </div>
          ))}
        </div>
      ))}
    </div>
  </div>
);

const S3: React.FC = () => (
  <Frame n={3} last floaters={[[1040, 1020, 30, G], [50, 1250, 36, L, true], [1045, 420, 22, W]]}>
    <div style={{ position: "absolute", left: 70, right: 70, top: 158, zIndex: 2 }}>
      <Headline size={68} parts={["Configura hoy. ", { hl: "Ajusta cuando lo necesites." }]} />
      <Sub>Administra tus RFCs y sus módulos desde “Mis contribuyentes”.</Sub>
    </div>
    <div style={{ position: "absolute", left: 70, top: 500, transform: "rotate(-1.5deg)" }}>
      <MisContribuyentes />
    </div>
    <Stage top={380} left={800} width={280} height={240}>
      <Pop at={0} scale={0.45} tilt={0.2}>
        <Shield />
      </Pop>
    </Stage>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1160, display: "flex", justifyContent: "center", alignItems: "center", gap: 22 }}>
      <div style={{ background: C.accent, color: BLUE, fontFamily: FONT, fontWeight: 800, fontSize: 44, borderRadius: 999, padding: "24px 56px", boxShadow: "0 18px 40px rgba(32,217,157,.4)" }}>
        Conoce lo nuevo →
      </div>
      <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 30, color: BLUE, background: WHITE, borderRadius: 999, padding: "14px 30px" }}>fispal.mx</span>
    </div>
  </Frame>
);

const SLIDES = [S1, S2, S3];
export const MODULOS_FRAMES = SLIDES.length * SLIDE_FRAMES;

export const ModulosRfcCarousel: React.FC = () => {
  const [handle] = useState(() => delayRender("Loading fonts"));
  useEffect(() => {
    fontsLoaded.then(() => continueRender(handle));
  }, [handle]);
  return (
    <AbsoluteFill style={{ background: BLUE }}>
      {SLIDES.map((S, i) => (
        <Sequence key={i} from={i * SLIDE_FRAMES} durationInFrames={SLIDE_FRAMES} name={`Slide ${i + 1}`}>
          <S />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
