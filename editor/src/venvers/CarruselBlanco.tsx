// Venvers carousel, white version (4:5, 5 slides) — "Cuentas por pagar".
// Same copy as Carrusel.tsx on a white canvas with soft circular purple
// gradients; large headlines and visuals anchored to the bottom edge so no
// slide is left with empty bands.
import React, { useEffect, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, Img, Sequence, staticFile } from "remotion";
import { FEATURES } from "./Carrusel";
import { BARLOW, GradientButton, H, HandArrow, Laptop, Logo, RALEWAY, V, VHeadline, venversFonts, W } from "./kit";
import { PortalDesktop } from "./screens";

const ILLUS = (n: string) => staticFile(`venvers/3d/${n}.png`);

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

const ARROW = V.violet;

/* ---------- Slide 1 — hook: overflowing inbox ---------- */
const INBOX = [
  { from: "Aceros del Norte", subj: "RE: Factura F-1023 rechazada", tag: "Rechazo", t: "9:42" },
  { from: "Logística Rivas", subj: "RE: RE: ¿Ya está programado mi pago?", tag: "Pago", t: "9:31" },
  { from: "Empaques Sol", subj: "Fwd: CFDI con RFC incorrecto", tag: "Rechazo", t: "9:15" },
  { from: "Servicios Lumen", subj: "Aclaración de factura SL-118", tag: "Aclaración", t: "8:58" },
  { from: "Grupo Andino", subj: "RE: ¿Cuándo pagan la GA-554?", tag: "Pago", t: "8:40" },
];

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
    {/* inbox window bleeding off the right and bottom edges */}
    <div style={{ position: "absolute", left: M, top: 730, width: W - M + 40, height: 700, background: "#fff", borderRadius: "36px 0 0 0", boxShadow: SHADOW, fontFamily: BARLOW, overflow: "hidden", border: "1px solid #ECEAFB" }}>
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
          <span style={{ fontSize: 22, color: "#9A9EB8", flexShrink: 0, marginRight: 40 }}>{m.t}</span>
        </div>
      ))}
    </div>
    {/* unread counter */}
    <div style={{ position: "absolute", left: 930, top: 660, width: 120, height: 120, borderRadius: "50%", background: V.bad, color: "#fff", fontFamily: BARLOW, fontWeight: 700, fontSize: 42, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 16px 36px rgba(229,72,77,.4)", border: "7px solid #fff" }}>
      +47
    </div>
  </AbsoluteFill>
);

/* ---------- Slide 2 — one portal ---------- */
const MODS = ["Licitaciones", "Expedientes", "Órdenes", "CFDI", "Pagos"];

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
    <div style={{ position: "absolute", left: M, right: M, top: 650, display: "flex", flexWrap: "wrap", gap: 14 }}>
      {MODS.map((m) => (
        <span key={m} style={{ fontFamily: RALEWAY, fontWeight: 700, fontSize: 30, color: V.white, background: `linear-gradient(180deg, ${V.violet}, ${V.purple})`, borderRadius: 999, padding: "10px 26px", boxShadow: "0 10px 24px rgba(91,43,224,.28)" }}>
          {m}
        </span>
      ))}
    </div>
    <Laptop x={150} y={800} w={780}>
      <div style={{ transform: `scale(${(780 - 44) / 1000})`, transformOrigin: "0 0" }}>
        <PortalDesktop />
      </div>
    </Laptop>
  </AbsoluteFill>
);

/* ---------- Slide 3 — validated CFDI, fewer emails ---------- */
const CompareCard: React.FC<{ y: number; kind: "bad" | "ok"; title: string; lines: string[] }> = ({ y, kind, title, lines }) => {
  const c = kind === "ok" ? V.ok : V.bad;
  return (
    <div style={{ position: "absolute", left: M, top: y, width: 500, background: "#fff", borderRadius: 30, padding: "28px 30px", boxShadow: SHADOW, fontFamily: BARLOW, border: `2px solid ${c}33`, boxSizing: "border-box" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 54, height: 54, borderRadius: "50%", background: c, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width={28} height={28} viewBox="0 0 24 24">
            <path d={kind === "ok" ? "M5 12.5l4.5 4.5L19 7.5" : "M6 6l12 12M18 6L6 18"} fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <span style={{ fontSize: 34, fontWeight: 700, color: INK }}>{title}</span>
      </div>
      {lines.map((l) => (
        <div key={l} style={{ fontSize: 27, color: "#4A4F70", marginTop: 12, paddingLeft: 68 }}>
          {l}
        </div>
      ))}
    </div>
  );
};

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
    <CompareCard y={720} kind="bad" title="Antes" lines={["Rechazos por correo", "“¿Ya me pagaron?”"]} />
    <HandArrow x={250} y={958} w={120} h={110} d="M20 6 C 0 50, 20 80, 60 100" head="M30 96 L62 102 L60 70" color={ARROW} />
    <CompareCard y={1060} kind="ok" title="Con Venvers" lines={["CFDI validado al recibirlo", "Estatus de pago visible"]} />
    <Img src={ILLUS("cfdi-validado")} style={{ position: "absolute", left: 610, top: 780, width: 450, height: 440 }} />
  </AbsoluteFill>
);

/* ---------- Slide 4 — features ---------- */
const S4: React.FC = () => (
  <AbsoluteFill>
    <WBackground glows={[{ x: 880, y: 820, r: 560 }, { x: 40, y: 1300, r: 380, o: 0.8 }]} rings={[{ x: 880, y: 820, r: 400 }]} />
    <Logo x={M} y={70} h={58} dark />
    <VHeadline size={88} width={W - M * 2} accent={V.purple} style={{ position: "absolute", left: M, top: 180, color: INK }} parts={["Todo el ciclo, ", { b: "en un solo portal" }]} />
    <div style={{ position: "absolute", left: M, right: M, top: 440, height: 840, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      {FEATURES.map((f, n) => (
        <div key={f.t} style={{ background: "#fff", borderRadius: 34, padding: "18px 40px 18px 18px", boxShadow: SHADOW, display: "flex", gap: 22, alignItems: "center", border: "1px solid #ECEAFB" }}>
          <div style={{ width: 220, height: 220, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, borderRadius: 26, background: "radial-gradient(circle, rgba(123,92,245,.22) 0%, rgba(123,92,245,0) 70%)" }}>
            <Img src={ILLUS(["doc-check", "ojo", "monedas"][n])} style={{ maxWidth: 190, maxHeight: 190 }} />
          </div>
          <div>
            <div style={{ fontFamily: RALEWAY, fontWeight: 800, fontSize: 42, color: INK, lineHeight: 1.12 }}>{f.t}</div>
            <div style={{ fontFamily: RALEWAY, fontWeight: 500, fontSize: 31, color: "#5A5F80", marginTop: 10 }}>{f.d}</div>
          </div>
        </div>
      ))}
    </div>
  </AbsoluteFill>
);

/* ---------- Slide 5 — CTA ---------- */
const S5: React.FC = () => (
  <AbsoluteFill>
    <WBackground glows={[{ x: 540, y: 1150, r: 700 }, { x: 1040, y: 100, r: 380, o: 0.8 }]} rings={[{ x: 540, y: 1150, r: 520 }, { x: 540, y: 1150, r: 620 }]} />
    <Logo x={M} y={70} h={58} dark />
    <VHeadline size={104} width={W - M * 2} accent={V.purple} style={{ position: "absolute", left: M, top: 180, color: INK, lineHeight: 1.05 }} parts={["Solicita una ", { b: "demo" }, " de Venvers"]} />
    <div style={{ position: "absolute", left: M, top: 430, width: 880, fontFamily: RALEWAY, fontWeight: 500, fontSize: 38, color: "#4A4F70", lineHeight: 1.3 }}>
      Transforma la forma en que interactúas con tus proveedores.
    </div>
    <div style={{ position: "absolute", left: M, top: 580 }}>
      <GradientButton size={46}>Solicitar demo →</GradientButton>
    </div>
    <Img src={ILLUS("planeta")} style={{ position: "absolute", left: 40, top: 720, width: 1000, height: 615 }} />
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
