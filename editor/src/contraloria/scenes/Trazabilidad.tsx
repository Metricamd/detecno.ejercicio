// Escena 4a — Trazabilidad desde la licitación hasta el pago: a journey
// that lights node by node, from tender to payment.
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, clamp, EASE, POPPINS, SAFE } from "../../theme";
import { Card, I, Icon, INK, localFrame, MUTED, SyncedHeadline, Tile } from "../kit";
import { SCENE_AT, wordAt, wordsBetween } from "../timings";

const T0 = SCENE_AT.trazabilidad;
const STEPS = [
  { k: "Licitación", d: I.gavel, f: "LP-0214 · 02/05/2024" },
  { k: "Contrato", d: I.contract, f: "CT-118 · Firmado 20/05" },
  { k: "Orden de compra", d: I.cart, f: "OC-1002 · 12/06" },
  { k: "Factura", d: I.doc, f: "CFDI A-4521 · Validada" },
  { k: "Pago", d: I.card, f: "SPEI · 15/07 · $8,320.00" },
];
const TOP = 600;
const GAP = 172;

export const Trazabilidad: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = localFrame(wordAt("licitación"), T0) - 6;
  const b = localFrame(wordAt("pago"), T0) + 6;
  const line = interpolate(frame, [a, b], [0, 1], { ...clamp, easing: EASE });
  return (
    <AbsoluteFill>
      <SyncedHeadline words={wordsBetween(T0, SCENE_AT.historial)} sceneStart={T0} size={80} highlight={["licitación", "pago."]} style={{ position: "absolute", left: SAFE.side, right: SAFE.side, top: SAFE.top + 20 }} />
      <div style={{ position: "absolute", left: 160, top: TOP + 40, width: 8, height: GAP * 4, background: "#E9E4FB", borderRadius: 4 }}>
        <div style={{ width: "100%", height: `${line * 100}%`, background: `linear-gradient(180deg, ${C.btnFrom}, ${C.btnTo})`, borderRadius: 4 }} />
      </div>
      {STEPS.map((s, i) => {
        const on = line >= i / (STEPS.length - 1) - 0.001;
        const p = spring({ frame: frame - (a + ((b - a) * i) / (STEPS.length - 1)), fps, config: { damping: 12 } });
        return (
          <div key={s.k} style={{ position: "absolute", left: 124, top: TOP + i * GAP, display: "flex", alignItems: "center", gap: 30 }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: on ? `linear-gradient(135deg, ${C.btnTo}, ${C.btnFrom})` : "#fff", border: `4px solid ${on ? "#fff" : "#E9E4FB"}`, boxShadow: on ? "0 12px 30px rgba(108,60,233,.4)" : "none", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${on ? 0.9 + p * 0.1 : 0.9})` }}>
              <Icon d={on ? I.check : s.d} size={38} color={on ? "#fff" : "#B7AEE0"} sw={2.6} />
            </div>
            <Card style={{ width: 640, padding: "20px 26px", display: "flex", alignItems: "center", gap: 18, opacity: 0.35 + Math.min(1, p) * 0.65, transform: `translateX(${(1 - Math.min(1, p)) * 40}px)` }}>
              <Tile d={s.d} size={58} />
              <div style={{ fontFamily: POPPINS }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: INK }}>{s.k}</div>
                <div style={{ fontSize: 20, color: MUTED }}>{s.f}</div>
              </div>
            </Card>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
