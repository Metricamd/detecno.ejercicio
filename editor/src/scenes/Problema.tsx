// Escena 2 — El problema (4–8 s): conciliación en Excel y documentos sueltos.
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CfdiCard, ExcelTable, NotaCard, OrdenCard, PagoCard } from "../components/cards";
import { AssetImg, Words } from "../components/ui";
import { clamp, EASE, ISO, SAFE } from "../theme";

// Chaotic cards: [left, top, rotation, phase]. Exported so the brand reveal
// can absorb them from the same spots.
export const CHAOS: { x: number; y: number; r: number; ph: number; C: React.FC<{ w?: number }> }[] = [
  { x: 40, y: 660, r: -9, ph: 0, C: CfdiCard },
  { x: 640, y: 700, r: 7, ph: 1.3, C: OrdenCard },
  { x: 70, y: 1080, r: 6, ph: 2.1, C: PagoCard },
  { x: 650, y: 1110, r: -8, ph: 3.4, C: NotaCard },
];

export const Problema: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tableIn = interpolate(frame, [0, 24], [0, 1], { ...clamp, easing: EASE });
  return (
    <AbsoluteFill>
      <AssetImg name="excel-conciliacion.png" style={{ position: "absolute", left: -100, top: 640, width: 1280, opacity: 0.18, transform: `translateY(${-frame * 0.4}px)` }} />
      <Words text="¿Facturas por vencer? ¿Pagos sin confirmar?" size={92} at={2} highlight={["facturas", "pagos"]} style={{ position: "absolute", left: SAFE.side, right: SAFE.side, top: SAFE.top + 30 }} />
      {/* isometric table */}
      <div style={{ position: "absolute", left: 540 - 600, top: 1000 - 260, width: 1200, transform: `${ISO} scale(${0.95 + tableIn * 0.1})`, opacity: tableIn }}>
        <ExcelTable at={8} stagger={3} />
      </div>
      {/* documents floating around, shaking */}
      {CHAOS.map(({ x, y, r, ph, C }, i) => {
        const p = spring({ frame: frame - 26 - i * 6, fps, config: { damping: 12, stiffness: 120 } });
        const shake = Math.sin(frame * 1.7 + ph * 5) * 3;
        const bob = Math.sin(frame / 18 + ph) * 8;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y + bob, transform: `rotate(${r + shake * 0.6}deg) translateX(${shake}px) scale(${p})`, opacity: Math.min(1, p) }}>
            <C w={370} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
