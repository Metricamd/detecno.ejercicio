// Loose Venvers carousel elements, each rendered alone on a transparent
// canvas (scripts/export_venvers_assets.sh crops them to their bounds).
import React, { useEffect, useState } from "react";
import { AbsoluteFill, continueRender, delayRender } from "remotion";
import { Stage } from "../fispal/three/Stage";
import { Pop } from "../fispal/three/objects";
import { CfdiCard3D, FEATURES, FeatureIcon, MAILS, MailCard } from "./Carrusel";
import { BARLOW, GradientButton, HandArrow, Laptop, Mesh, Phone, Planet, RALEWAY, V, VBackground, venversFonts } from "./kit";
import { PortalDesktop, PortalPhone } from "./screens";

const O = 120; // origin offset so shadows are not clipped

const ASSETS: Record<string, React.FC> = {
  "fondo-oscuro": () => <VBackground />,
  "fondo-azul": () => <VBackground variant="blue" />,
  "reticula-curva": () => <Mesh x={O} y={O} w={620} h={560} opacity={0.9} />,
  "planeta": () => <Planet x={O + 120} y={O + 120} r={90} opacity={1} />,
  "planeta-anillo": () => <Planet x={O + 160} y={O + 120} r={90} ring opacity={1} />,
  "tarjeta-cfdi-3d": () => (
    <Stage top={0} left={0} width={1000} height={1000} z={9}>
      <Pop at={0} scale={0.9} spin={0} tilt={0.05} position={[0, 0.3, 0]}>
        <CfdiCard3D />
      </Pop>
    </Stage>
  ),
  "correo-1": () => <MailCard m={MAILS[0]} x={O} y={O} rot={0} />,
  "correo-2": () => <MailCard m={MAILS[1]} x={O} y={O} rot={0} />,
  "correo-3": () => <MailCard m={MAILS[2]} x={O} y={O} rot={0} />,
  "contador-47": () => (
    <div style={{ position: "absolute", left: O, top: O, width: 110, height: 110, borderRadius: "50%", background: V.bad, color: "#fff", fontFamily: BARLOW, fontWeight: 700, fontSize: 38, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 12px 30px rgba(229,72,77,.5)", border: "6px solid #fff" }}>
      +47
    </div>
  ),
  "chips-modulos": () => (
    <div style={{ position: "absolute", left: O, top: O, display: "flex", gap: 12 }}>
      {["Licitaciones", "Expedientes", "Órdenes", "CFDI", "Pagos"].map((m) => (
        <span key={m} style={{ fontFamily: RALEWAY, fontWeight: 700, fontSize: 26, color: V.white, border: `2px solid ${V.lilac}`, background: "rgba(185,166,255,.14)", borderRadius: 999, padding: "8px 22px" }}>
          {m}
        </span>
      ))}
    </div>
  ),
  "laptop-portal": () => (
    <Laptop x={O + 70} y={O} w={740}>
      <div style={{ transform: `scale(${(740 - 44) / 1000})`, transformOrigin: "0 0" }}>
        <PortalDesktop />
      </div>
    </Laptop>
  ),
  "pantalla-portal-escritorio": () => (
    <div style={{ position: "absolute", left: O, top: O }}>
      <PortalDesktop />
    </div>
  ),
  "celular-portal": () => (
    <Phone x={O} y={O} w={330}>
      <PortalPhone />
    </Phone>
  ),
  "etiqueta-antes": () => (
    <div style={{ position: "absolute", left: O, top: O, fontFamily: BARLOW, fontWeight: 700, fontSize: 22, color: "#fff", background: V.bad, borderRadius: 999, padding: "8px 18px" }}>
      Antes: aclarar rechazos por correo
    </div>
  ),
  ...Object.fromEntries(
    FEATURES.map((f, n) => [
      `icono-funcionalidad-${n + 1}`,
      () => (
        <div style={{ position: "absolute", left: O, top: O }}>
          <FeatureIcon i={f.i} />
        </div>
      ),
    ]),
  ),
  "boton-solicitar-demo": () => (
    <div style={{ position: "absolute", left: O, top: O }}>
      <GradientButton size={44}>Solicitar demo →</GradientButton>
    </div>
  ),
  "flecha-1": () => <HandArrow x={O} y={O} w={120} h={130} d="M10 6 C 80 16, 110 60, 96 118" head="M70 96 L96 122 L116 90" />,
  "flecha-2": () => <HandArrow x={O} y={O} w={150} h={110} d="M8 90 C 60 100, 110 80, 140 24" head="M110 26 L142 22 L140 56" />,
  "flecha-3": () => <HandArrow x={O} y={O} w={220} h={150} d="M10 20 C 80 140, 160 140, 210 90" head="M180 76 L212 88 L196 120" />,
};

export const VENVERS_ASSET_NAMES = Object.keys(ASSETS);

export const VenversAsset: React.FC<{ name: string }> = ({ name }) => {
  const [handle] = useState(() => delayRender("Loading fonts"));
  useEffect(() => {
    venversFonts.then(() => continueRender(handle));
  }, [handle]);
  const A = ASSETS[name];
  return <AbsoluteFill style={{ background: "transparent" }}>{A && <A />}</AbsoluteFill>;
};
