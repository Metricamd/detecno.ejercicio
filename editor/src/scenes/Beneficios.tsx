// Escena 6 — Beneficios (21–26 s).
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Glass, ICON, IconTile, useFloat } from "../components/ui";
import { C, clamp, POPPINS, SAFE } from "../theme";

const ITEMS = [
  { d: ICON.eye, t: "Visibilidad de facturas, pagos y descuentos" },
  { d: ICON.clock, t: "Seguimiento del proceso y sus retrasos" },
  { d: ICON.coins, t: "Opciones de pronto pago para proveedores" },
];

export const Beneficios: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fl = [useFloat(0), useFloat(1.4), useFloat(2.8)];
  return (
    <AbsoluteFill>
      {ITEMS.map((it, i) => {
        const at = 8 + i * 16;
        const p = spring({ frame: frame - at, fps, config: { damping: 16, stiffness: 120 } });
        const glow = interpolate(frame, [at + 4, at + 14, at + 40], [0, 1, 0.35], clamp);
        return (
          <Glass
            key={i}
            style={{
              position: "absolute",
              left: SAFE.side,
              right: SAFE.side,
              top: 420 + i * 330 + fl[i],
              height: 280,
              display: "flex",
              alignItems: "center",
              gap: 36,
              padding: "0 44px",
              transform: `translateX(${(1 - p) * 1000}px)`,
              border: `2px solid rgba(167,139,250,${0.3 + glow * 0.7})`,
              boxShadow: `0 30px 60px rgba(108,60,233,${0.35 + glow * 0.3}), 0 0 ${glow * 60}px rgba(167,139,250,${glow * 0.6})`,
            }}
          >
            <IconTile d={it.d} size={130} />
            <div style={{ fontFamily: POPPINS, fontWeight: 800, fontSize: 52, lineHeight: 1.12, color: C.white }}>{it.t}</div>
          </Glass>
        );
      })}
    </AbsoluteFill>
  );
};
