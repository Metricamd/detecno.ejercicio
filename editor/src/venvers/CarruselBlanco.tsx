// Venvers carousel, white version (4:5, 5 slides) — "Cuentas por pagar".
// Brief copy verbatim on a white canvas with soft circular purple gradients;
// each visual is an isometric floating-UI scene (iso.tsx) about its text.
import React, { useEffect, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, Sequence } from "remotion";
import { FEATURES } from "./Carrusel";
import { BARLOW, H, Logo, RALEWAY, V, VHeadline, venversFonts, W } from "./kit";
import { SceneCfdi, SceneFeatures, SceneHero, SceneInbox, ScenePortal } from "./iso";

const M = 80; // side margin
const INK = V.navy;
const SHADOW = "0 30px 70px rgba(43,20,140,.18), 0 6px 18px rgba(43,20,140,.08)";

/* ---------- background: white + circular purple gradients ---------- */
type Glow = { x: number; y: number; r: number; c?: string; o?: number };
const Ring: React.FC<{ x: number; y: number; r: number }> = ({ x, y, r }) => (
  <div style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: "50%", border: "2px solid rgba(123,92,245,.18)" }} />
);

const WBackground: React.FC<{ glows: Glow[]; rings?: { x: number; y: number; r: number }[] }> = ({ glows, rings = [] }) => (
  <AbsoluteFill style={{ background: "#FFFFFF", overflow: "hidden" }}>
    {glows.map((g, i) => (
      <div
        key={i}
        style={{
          position: "absolute",
          left: g.x - g.r,
          top: g.y - g.r,
          width: g.r * 2,
          height: g.r * 2,
          borderRadius: "50%",
          opacity: g.o ?? 1,
          background: `radial-gradient(circle, ${g.c ?? "rgba(123,92,245,.7)"} 0%, rgba(123,92,245,.18) 45%, rgba(255,255,255,0) 70%)`,
        }}
      />
    ))}
    {rings.map((r, i) => (
      <Ring key={i} {...r} />
    ))}
  </AbsoluteFill>
);


/* ---------- Slide 1 — hook: overflowing inbox ---------- */
const INBOX = [
  { from: "Aceros del Norte", subj: "RE: Factura F-1023 rechazada", tag: "Rechazo", t: "9:42" },
  { from: "Logística Rivas", subj: "RE: RE: ¿Ya está programado mi pago?", tag: "Pago", t: "9:31" },
  { from: "Empaques Sol", subj: "Fwd: CFDI con RFC incorrecto", tag: "Rechazo", t: "9:15" },
  { from: "Servicios Lumen", subj: "Aclaración de factura SL-118", tag: "Aclaración", t: "8:58" },
  { from: "Grupo Andino", subj: "RE: ¿Cuándo pagan la GA-554?", tag: "Pago", t: "8:40" },
];

// Slide 1 visual (inbox + unread counter). `standalone` closes the window's
// corners so it can be exported on its own.
export const InboxVisual: React.FC<{ x: number; y: number; standalone?: boolean }> = ({ x, y, standalone }) => (
  <div style={{ position: "absolute", left: x, top: y, width: standalone ? 1040 : W - x + 40, height: standalone ? 780 : H - y }}>
    {/* inbox window bleeding off the right and bottom edges */}
    <div style={{ position: "absolute", left: 0, top: 70, width: standalone ? 1000 : W - M + 40, height: standalone ? undefined : 700, background: "#fff", borderRadius: standalone ? 36 : "36px 0 0 0", boxShadow: SHADOW, fontFamily: BARLOW, overflow: "hidden", border: "1px solid #ECEAFB" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "26px 34px", borderBottom: "1px solid #EFEDFA" }}>
        <svg width={34} height={26} viewBox="0 0 28 22">
          <rect x={1.5} y={1.5} width={25} height={19} rx={3} fill="none" stroke={V.purple} strokeWidth={2.6} />
          <path d="M2 3l12 9 12-9" fill="none" stroke={V.purple} strokeWidth={2.6} strokeLinejoin="round" />
        </svg>
        <span style={{ fontSize: 32, fontWeight: 700, color: INK }}>Bandeja de entrada</span>
        <span style={{ fontSize: 22, fontWeight: 700, color: V.bad, background: `${V.bad}17`, borderRadius: 999, padding: "4px 14px" }}>47 sin leer</span>
      </div>
      {INBOX.map((m) => (
        <div key={m.from} style={{ display: "flex", alignItems: "center", gap: 20, padding: "20px 34px", borderBottom: "1px solid #F2F0FB" }}>
          <div style={{ width: 14, height: 14, borderRadius: "50%", background: V.violet, flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 28, fontWeight: 700, color: INK }}>{m.from}</span>
              <span style={{ fontSize: 19, fontWeight: 700, color: m.tag === "Pago" ? V.warn : V.bad, background: `${m.tag === "Pago" ? V.warn : V.bad}1A`, borderRadius: 999, padding: "2px 12px" }}>{m.tag}</span>
            </div>
            <div style={{ fontSize: 25, color: "#5A5F80", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.subj}</div>
          </div>
          <span style={{ fontSize: 22, color: "#9A9EB8", flexShrink: 0, marginRight: standalone ? 0 : 40 }}>{m.t}</span>
        </div>
      ))}
    </div>
    {/* unread counter */}
    <div style={{ position: "absolute", left: standalone ? 920 : 850, top: 0, width: 120, height: 120, borderRadius: "50%", background: V.bad, color: "#fff", fontFamily: BARLOW, fontWeight: 700, fontSize: 42, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 16px 36px rgba(229,72,77,.4)", border: "7px solid #fff" }}>
      +47
    </div>
  </div>
);

const S1: React.FC = () => (
  <AbsoluteFill>
    <WBackground glows={[{ x: 1000, y: 120, r: 420 }, { x: 60, y: 1250, r: 520 }]} rings={[{ x: 1000, y: 120, r: 250 }, { x: 1000, y: 120, r: 330 }]} />
    <Logo x={M} y={70} h={58} dark />
    <VHeadline
      size={86}
      width={W - M * 2}
      accent={V.purple}
      style={{ position: "absolute", left: M, top: 180, color: INK, lineHeight: 1.08 }}
      parts={["¿Sigues recibiendo ", { b: "facturas de proveedores por correo" }, " y aclarando rechazos uno por uno?"]}
    />
    <SceneInbox x={0} y={740} w={W} h={680} />
  </AbsoluteFill>
);

/* ---------- Slide 2 — one portal ---------- */

const S2: React.FC = () => (
  <AbsoluteFill>
    <WBackground glows={[{ x: 540, y: 1150, r: 640 }, { x: 1060, y: 80, r: 360, o: 0.8 }]} rings={[{ x: 540, y: 1150, r: 470 }, { x: 540, y: 1150, r: 560 }]} />
    <Logo x={M} y={70} h={58} dark />
    <VHeadline
      size={78}
      width={W - M * 2}
      accent={V.purple}
      style={{ position: "absolute", left: M, top: 180, color: INK, lineHeight: 1.1 }}
      parts={["Con Venvers, gestiona ", { b: "licitaciones, expedientes, órdenes, CFDI y pagos" }, " desde un solo portal."]}
    />
    <ScenePortal x={0} y={700} w={W} h={680} />
  </AbsoluteFill>
);

/* ---------- Slide 3 — validated CFDI, fewer emails ---------- */
const S3: React.FC = () => (
  <AbsoluteFill>
    <WBackground glows={[{ x: 850, y: 1000, r: 560 }, { x: 0, y: 60, r: 380, o: 0.8 }]} rings={[{ x: 850, y: 1000, r: 380 }, { x: 850, y: 1000, r: 470 }]} />
    <Logo x={M} y={70} h={58} dark />
    <VHeadline
      size={80}
      width={W - M * 2}
      accent={V.purple}
      style={{ position: "absolute", left: M, top: 180, color: INK, lineHeight: 1.1 }}
      parts={["Recibe ", { b: "CFDI validados" }, " y reduce correos para aclarar rechazos o preguntar por el pago."]}
    />
    <SceneCfdi x={0} y={720} w={W} h={680} />
  </AbsoluteFill>
);

/* ---------- Slide 4 — features ---------- */
const S4: React.FC = () => (
  <AbsoluteFill>
    <WBackground glows={[{ x: 880, y: 820, r: 560 }, { x: 40, y: 1300, r: 380, o: 0.8 }]} rings={[{ x: 880, y: 820, r: 400 }]} />
    <Logo x={M} y={70} h={58} dark />
    <div style={{ position: "absolute", left: M, right: M, top: 190, display: "flex", flexDirection: "column", gap: 26 }}>
      {FEATURES.map((f, n) => (
        <div key={f.t} style={{ display: "flex", alignItems: "center", gap: 26 }}>
          <div style={{ width: 76, height: 76, borderRadius: "50%", background: `linear-gradient(135deg, #8E6BFF, ${V.purple})`, color: "#fff", fontFamily: RALEWAY, fontWeight: 800, fontSize: 38, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 12px 28px rgba(91,43,224,.35)" }}>
            {n + 1}
          </div>
          <div style={{ fontFamily: RALEWAY, fontWeight: 800, fontSize: 52, color: INK, lineHeight: 1.1 }}>{f.t}</div>
        </div>
      ))}
    </div>
    <SceneFeatures x={0} y={660} w={W} h={700} />
  </AbsoluteFill>
);

/* ---------- Slide 5 — CTA ---------- */
const S5: React.FC = () => (
  <AbsoluteFill>
    <WBackground glows={[{ x: 540, y: 1150, r: 700 }, { x: 1040, y: 100, r: 380, o: 0.8 }]} rings={[{ x: 540, y: 1150, r: 520 }, { x: 540, y: 1150, r: 620 }]} />
    <Logo x={M} y={70} h={58} dark />
    <VHeadline size={124} width={W - M * 2} accent={V.purple} style={{ position: "absolute", left: M, top: 200, color: INK, lineHeight: 1.05 }} parts={["Solicita una ", { b: "demo" }, " de Venvers"]} />
    <SceneHero x={0} y={640} w={W} h={740} />
  </AbsoluteFill>
);

const SLIDES = [S1, S2, S3, S4, S5];
export const VENVERS_W_SLIDE_FRAMES = 60;
export const VENVERS_W_FRAMES = SLIDES.length * VENVERS_W_SLIDE_FRAMES;

export const VenversCarouselWhite: React.FC = () => {
  const [handle] = useState(() => delayRender("Loading fonts"));
  useEffect(() => {
    venversFonts.then(() => continueRender(handle));
  }, [handle]);
  return (
    <AbsoluteFill style={{ background: "#fff", width: W, height: H }}>
      {SLIDES.map((S, i) => (
        <Sequence key={i} from={i * VENVERS_W_SLIDE_FRAMES} durationInFrames={VENVERS_W_SLIDE_FRAMES} name={`Slide ${i + 1}`}>
          <S />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
