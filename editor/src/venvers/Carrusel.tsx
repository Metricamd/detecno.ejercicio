// Venvers carousel (4:5, 5 slides) — "Cuentas por pagar básico".
import React, { useEffect, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, Img, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Stage } from "../fispal/three/Stage";
import { Glossy, Pop, RBox } from "../fispal/three/objects";
import {
  BARLOW,
  GradientButton,
  H,
  HandArrow,
  Laptop,
  Logo,
  Mesh,
  Phone,
  Planet,
  RALEWAY,
  V,
  VBackground,
  VHeadline,
  venversFonts,
  W,
} from "./kit";
import { PortalDesktop, PortalPhone } from "./screens";

export const VENVERS_SLIDE_FRAMES = 60;

/* ---------- 3D: validated CFDI card + magnifier (as in the brand's post) ---------- */
const CfdiCard3D: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <group rotation={[0.12, -0.42, 0.04]}>
      <RBox size={[3.4, 3.4, 0.35]} radius={0.3} color="#F2F3F8" />
      {[
        [0.95, 2.4, "#3B6BFF"],
        [0.15, 1.6, "#5B8BFF"],
        [-0.65, 2.0, "#3B6BFF"],
      ].map(([y, w, c], i) => (
        <RBox key={i} size={[w as number, 0.48, 0.18]} radius={0.2} color={c as string} position={[-(2.4 - (w as number)) / 2, y as number, 0.24]} />
      ))}
      {/* check badge */}
      <group position={[1.15, -1.15, 0.35]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.55, 0.55, 0.22, 48]} />
          <Glossy color="#14B37D" />
        </mesh>
        <RBox size={[0.13, 0.3, 0.1]} radius={0.04} color="#FFFFFF" position={[-0.11, -0.04, 0.14]} rotation={[0, 0, 0.75]} />
        <RBox size={[0.13, 0.58, 0.1]} radius={0.04} color="#FFFFFF" position={[0.09, 0.06, 0.14]} rotation={[0, 0, -0.65]} />
      </group>
      {/* magnifier */}
      <group position={[0.75 + Math.sin(frame / 18) * 0.08, 0.2, 1.0]} rotation={[0, 0.25, -0.6]}>
        <mesh>
          <torusGeometry args={[0.95, 0.2, 32, 96]} />
          <Glossy color="#C9CAD3" rough={0.3} metal={0.2} />
        </mesh>
        <mesh>
          <cylinderGeometry args={[0.8, 0.8, 0.05, 64]} />
          <meshPhysicalMaterial color="#EAF0FF" transparent opacity={0.35} roughness={0.05} clearcoat={1} />
        </mesh>
        <mesh position={[0, -1.75, 0]}>
          <capsuleGeometry args={[0.2, 1.1, 12, 24]} />
          <Glossy color="#E6E7EE" rough={0.35} />
        </mesh>
      </group>
    </group>
  );
};

/* ---------- Slide 1 — hook ---------- */
const MAILS = [
  { from: "Aceros del Norte", subj: "RE: Factura F-1023 rechazada", tag: "Rechazo" },
  { from: "Logística Rivas", subj: "RE: RE: ¿Ya está programado mi pago?", tag: "Pago" },
  { from: "Empaques Sol", subj: "Fwd: CFDI con RFC incorrecto", tag: "Rechazo" },
];

const MailCard: React.FC<{ m: (typeof MAILS)[number]; x: number; y: number; rot: number }> = ({ m, x, y, rot }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: 470,
      background: "#fff",
      borderRadius: 22,
      padding: "18px 20px",
      boxShadow: "0 24px 50px rgba(0,0,30,.45)",
      fontFamily: BARLOW,
      transform: `rotate(${rot}deg)`,
      display: "flex",
      gap: 14,
      alignItems: "center",
    }}
  >
    <div style={{ width: 52, height: 52, borderRadius: 14, background: `${V.bad}1A`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <svg width={28} height={22} viewBox="0 0 28 22">
        <rect x={1.5} y={1.5} width={25} height={19} rx={3} fill="none" stroke={V.bad} strokeWidth={2.6} />
        <path d="M2 3l12 9 12-9" fill="none" stroke={V.bad} strokeWidth={2.6} strokeLinejoin="round" />
      </svg>
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 19, fontWeight: 700, color: V.ink }}>{m.from}</span>
        <span style={{ fontSize: 14, fontWeight: 700, color: V.bad, background: `${V.bad}1A`, borderRadius: 999, padding: "2px 10px" }}>{m.tag}</span>
      </div>
      <div style={{ fontSize: 18, color: "#4A4F70", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.subj}</div>
    </div>
  </div>
);

const S1: React.FC = () => (
  <AbsoluteFill>
    <VBackground />
    <Mesh x={560} y={-60} w={620} h={560} opacity={0.3} />
    <Planet x={960} y={600} r={70} ring opacity={0.5} />
    <Logo x={110} y={100} />
    <VHeadline
      size={68}
      width={860}
      style={{ position: "absolute", left: 110, top: 230 }}
      parts={["¿Sigues recibiendo ", { b: "facturas de proveedores por correo" }, " y aclarando rechazos uno por uno?"]}
    />
    {/* photo with rounded top-right corner, anchored bottom-left like the reference */}
    <div style={{ position: "absolute", left: 0, top: 790, width: 700, height: 470, borderTopRightRadius: 70, overflow: "hidden", boxShadow: "0 30px 70px rgba(0,0,30,.5)" }}>
      <Img src={staticFile("venvers/photos/foto1.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "30% 40%" }} />
    </div>
    <MailCard m={MAILS[0]} x={520} y={760} rot={-3} />
    <MailCard m={MAILS[1]} x={560} y={900} rot={2} />
    <MailCard m={MAILS[2]} x={500} y={1040} rot={-1.5} />
    {/* unread counter */}
    <div style={{ position: "absolute", left: 455, top: 712, width: 96, height: 96, borderRadius: "50%", background: V.bad, color: "#fff", fontFamily: BARLOW, fontWeight: 700, fontSize: 32, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 12px 30px rgba(229,72,77,.5)", border: "5px solid #fff" }}>
      +47
    </div>
  </AbsoluteFill>
);

/* ---------- Slide 2 — one portal ---------- */
const MODS = ["Licitaciones", "Expedientes", "Órdenes", "CFDI", "Pagos"];

const S2: React.FC = () => (
  <AbsoluteFill>
    <VBackground variant="blue" />
    <Mesh x={-80} y={720} w={520} h={520} opacity={0.35} />
    <Mesh x={640} y={430} w={520} h={620} flip opacity={0.3} />
    <Logo x={110} y={100} h={58} />
    <VHeadline
      size={64}
      width={880}
      style={{ position: "absolute", left: 110, top: 210 }}
      parts={["Con Venvers, gestiona ", { b: "licitaciones, expedientes, órdenes, CFDI y pagos" }, " desde un solo portal."]}
    />
    {/* module chips */}
    <div style={{ position: "absolute", left: 110, right: 110, top: 600, display: "flex", flexWrap: "wrap", gap: 12 }}>
      {MODS.map((m) => (
        <span key={m} style={{ fontFamily: RALEWAY, fontWeight: 700, fontSize: 26, color: V.white, border: `2px solid ${V.lilac}`, background: "rgba(185,166,255,.14)", borderRadius: 999, padding: "8px 22px" }}>
          {m}
        </span>
      ))}
    </div>
    <HandArrow x={880} y={665} w={120} h={130} d="M10 6 C 80 16, 110 60, 96 118" head="M70 96 L96 122 L116 90" />
    <Laptop x={170} y={790} w={740}>
      <div style={{ transform: `scale(${(740 - 44) / 1000})`, transformOrigin: "0 0" }}>
        <PortalDesktop />
      </div>
    </Laptop>
  </AbsoluteFill>
);

/* ---------- Slide 3 — validated CFDI, fewer emails ---------- */
const S3: React.FC = () => (
  <AbsoluteFill>
    <VBackground />
    <Mesh x={-120} y={420} w={700} h={360} opacity={0.22} />
    <Planet x={640} y={130} r={56} opacity={0.6} />
    <Planet x={470} y={210} r={26} opacity={0.6} />
    <Logo x={110} y={100} h={58} />
    {/* "before": photo + rejection tag */}
    <div style={{ position: "absolute", left: 110, top: 250, width: 380, height: 300, borderRadius: 28, overflow: "hidden", boxShadow: "0 24px 50px rgba(0,0,30,.45)", transform: "rotate(-3deg)", border: "6px solid rgba(255,255,255,.9)" }}>
      <Img src={staticFile("venvers/photos/foto2.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "70% 30%", filter: "saturate(.85)" }} />
    </div>
    <div style={{ position: "absolute", left: 130, top: 520, fontFamily: BARLOW, fontWeight: 700, fontSize: 22, color: "#fff", background: V.bad, borderRadius: 999, padding: "8px 18px", transform: "rotate(-3deg)" }}>
      Antes: aclarar rechazos por correo
    </div>
    <div style={{ position: "absolute", left: 120, top: 610, fontFamily: RALEWAY, fontWeight: 400, fontSize: 30, color: V.white, lineHeight: 1.2 }}>
      Con Venvers, cada CFDI
      <br />
      llega <b style={{ fontWeight: 800 }}>validado</b>
    </div>
    <HandArrow x={420} y={560} w={150} h={110} d="M8 90 C 60 100, 110 80, 140 24" head="M110 26 L142 22 L140 56" />
    {/* "after": 3D card (pre-rendered by the VenversCard3D composition to avoid
        WebGL compositing glitches on this slide) */}
    <Img src={staticFile("venvers/cfdi-card-3d.png")} style={{ position: "absolute", left: 520, top: 110, width: 560, height: 770 }} />
    <VHeadline
      size={68}
      width={860}
      style={{ position: "absolute", left: 110, top: 880 }}
      parts={["Recibe ", { b: "CFDI validados" }, " y reduce correos para aclarar rechazos o preguntar por el pago."]}
    />
  </AbsoluteFill>
);

/* ---------- Slide 4 — features ---------- */
const FEATURES = [
  { t: "Recepción y validación de CFDI", d: "Cada factura se valida al recibirse.", i: 3 },
  { t: "Estatus visible para proveedores", d: "Consultan su pago sin escribirte.", i: 4 },
  { t: "Conciliación y opciones de pronto pago", d: "Concilia y ofrece liquidez anticipada.", i: 1 },
];

const FeatureIcon: React.FC<{ i: number }> = ({ i }) => {
  const d = [
    "M7 3h7l5 5v13H7zM14 3v5h5M10 14l2 2 4-4",
    "M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0M12 7v5l3 2",
    "M4 7h16M4 12h10M4 17h7M17 15l2 2 3-4",
  ];
  const k = i === 3 ? 0 : i === 4 ? 1 : 2;
  return (
    <div style={{ width: 84, height: 84, borderRadius: 24, background: `linear-gradient(160deg, ${V.violet}, ${V.purple})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 12px 30px rgba(91,43,224,.5)" }}>
      <svg width={44} height={44} viewBox="0 0 24 24">
        <path d={d[k]} fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
};

const S4: React.FC = () => (
  <AbsoluteFill>
    <VBackground variant="blue" />
    <Mesh x={620} y={-40} w={560} h={520} opacity={0.3} />
    <Planet x={90} y={1230} r={80} ring opacity={0.45} />
    <Logo x={110} y={100} h={58} />
    <VHeadline size={64} width={600} style={{ position: "absolute", left: 110, top: 210 }} parts={["Todo el ciclo, ", { b: "en un solo portal" }]} />
    <div style={{ position: "absolute", left: 110, top: 420, width: 560, display: "flex", flexDirection: "column", gap: 26 }}>
      {FEATURES.map((f) => (
        <div key={f.t} style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <FeatureIcon i={f.i} />
          <div>
            <div style={{ fontFamily: RALEWAY, fontWeight: 800, fontSize: 34, color: V.white, lineHeight: 1.12 }}>{f.t}</div>
            <div style={{ fontFamily: RALEWAY, fontWeight: 400, fontSize: 24, color: "rgba(255,255,255,.78)", marginTop: 4 }}>{f.d}</div>
          </div>
        </div>
      ))}
    </div>
    <HandArrow x={430} y={900} w={220} h={150} d="M10 20 C 80 140, 160 140, 210 90" head="M180 76 L212 88 L196 120" />
    <Phone x={690} y={440} w={330}>
      <PortalPhone />
    </Phone>
  </AbsoluteFill>
);

/* ---------- Slide 5 — CTA ---------- */
const S5: React.FC = () => (
  <AbsoluteFill>
    <VBackground />
    <Mesh x={600} y={-60} w={580} h={520} opacity={0.3} />
    <Mesh x={-140} y={980} w={620} h={420} flip opacity={0.25} />
    <Planet x={960} y={1180} r={90} ring opacity={0.5} />
    <Logo x={110} y={100} h={58} />
    <VHeadline size={92} width={860} style={{ position: "absolute", left: 110, top: 220 }} parts={["Solicita una ", { b: "demo" }, " de Venvers"]} />
    <div style={{ position: "absolute", left: 110, top: 470, width: 820, fontFamily: RALEWAY, fontWeight: 400, fontSize: 32, color: "rgba(255,255,255,.85)", lineHeight: 1.35 }}>
      Transforma la forma en que interactúas con tus proveedores.
    </div>
    <div style={{ position: "absolute", left: 110, top: 600, width: 860, height: 470, borderRadius: 40, overflow: "hidden", boxShadow: "0 30px 70px rgba(0,0,30,.5)", border: "6px solid rgba(255,255,255,.9)" }}>
      <Img src={staticFile("venvers/photos/foto3.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "60% 45%" }} />
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1030, display: "flex", justifyContent: "center" }}>
      <GradientButton size={44}>Solicitar demo →</GradientButton>
    </div>
  </AbsoluteFill>
);

// Standalone 3D card, rendered once to public/venvers/cfdi-card-3d.png.
export const VenversCard3D: React.FC = () => (
  <AbsoluteFill style={{ background: "transparent" }}>
    <Stage top={0} left={0} width={560} height={770}>
      <Pop at={0} scale={0.9} spin={0} tilt={0.05} position={[0, 0.45, 0]}>
        <CfdiCard3D />
      </Pop>
    </Stage>
  </AbsoluteFill>
);

const SLIDES = [S1, S2, S3, S4, S5];
export const VENVERS_FRAMES = SLIDES.length * VENVERS_SLIDE_FRAMES;

export const VenversCarousel: React.FC = () => {
  const [handle] = useState(() => delayRender("Loading fonts"));
  useEffect(() => {
    venversFonts.then(() => continueRender(handle));
  }, [handle]);
  return (
    <AbsoluteFill style={{ background: V.navy, width: W, height: H }}>
      {SLIDES.map((S, i) => (
        <Sequence key={i} from={i * VENVERS_SLIDE_FRAMES} durationInFrames={VENVERS_SLIDE_FRAMES} name={`Slide ${i + 1}`}>
          <S />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
