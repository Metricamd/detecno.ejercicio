// Escena 3 — Obtén visibilidad del proceso completo y detecta retrasos.
// A Gantt of one supplier's process; the invoice bar slips and is flagged
// before the payment date.
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, clamp, EASE, POPPINS, SAFE } from "../../theme";
import { Card, I, Icon, INK, LINE, localFrame, MUTED, SyncedHeadline, Tile } from "../kit";
import { SCENE_AT, wordAt, wordsBetween } from "../timings";

const T0 = SCENE_AT.visibilidad;
const ROWS = [
  { k: "Licitación", s: 0, e: 2 },
  { k: "Contrato", s: 1.6, e: 3.2 },
  { k: "Orden de compra", s: 3, e: 4.2 },
  { k: "Recepción", s: 4, e: 5.4 },
  { k: "Factura", s: 5.2, e: 6.4, late: 1.6 },
  { k: "Pago", s: 6.6, e: 7.6 },
];
const WEEKS = 8;
const LABEL_W = 230;
const CHART_W = 880 - 56 - LABEL_W;
const TODAY = 6.2;

export const Visibilidad: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lateAt = localFrame(wordAt("retrasos"), T0);
  const slip = interpolate(frame, [lateAt - 4, lateAt + 10], [0, 1], { ...clamp, easing: EASE });
  const alert = spring({ frame: frame - lateAt - 6, fps, config: { damping: 12 } });
  const pulse = (frame % 30) / 30;
  const wx = (w: number) => (w / WEEKS) * CHART_W;
  return (
    <AbsoluteFill>
      <SyncedHeadline words={wordsBetween(T0, SCENE_AT.trazabilidad)} sceneStart={T0} size={76} highlight={["visibilidad", "retrasos"]} style={{ position: "absolute", left: SAFE.side, right: SAFE.side, top: SAFE.top + 20 }} />
      <Card style={{ position: "absolute", left: 100, top: 780, width: 880, padding: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 28, fontWeight: 800 }}>Proceso del proveedor</div>
            <div style={{ fontSize: 20, color: MUTED }}>Aceros del Norte · Licitación LP-0214</div>
          </div>
          <Tile d={I.clock} size={56} />
        </div>
        <div style={{ position: "relative", marginTop: 22 }}>
          {/* week grid */}
          <div style={{ position: "absolute", left: LABEL_W, top: 0, width: CHART_W, height: ROWS.length * 66, display: "flex" }}>
            {Array.from({ length: WEEKS }).map((_, i) => (
              <div key={i} style={{ flex: 1, borderLeft: `1px dashed ${LINE}` }} />
            ))}
          </div>
          {ROWS.map((r, i) => {
            const grow = interpolate(frame, [6 + i * 5, 22 + i * 5], [0, 1], { ...clamp, easing: EASE });
            const end = r.e + (r.late ?? 0) * slip;
            const late = r.late && slip > 0.5;
            return (
              <div key={r.k} style={{ display: "flex", alignItems: "center", height: 66 }}>
                <div style={{ width: LABEL_W, fontSize: 21, fontWeight: 600, color: INK }}>{r.k}</div>
                <div style={{ position: "relative", width: CHART_W, height: 30 }}>
                  <div style={{ position: "absolute", left: wx(r.s), width: wx((end - r.s) * grow), height: 30, borderRadius: 15, background: late ? `linear-gradient(90deg, ${C.btnTo}, ${C.warn})` : `linear-gradient(90deg, ${C.btnFrom}, ${C.btnTo})` }} />
                </div>
              </div>
            );
          })}
          {/* today marker */}
          <div style={{ position: "absolute", left: LABEL_W + wx(TODAY), top: -14, height: ROWS.length * 66 + 14, borderLeft: `3px solid ${INK}` }}>
            <span style={{ position: "absolute", top: -26, left: -24, fontSize: 16, fontWeight: 700, color: INK }}>Hoy</span>
          </div>
        </div>
      </Card>
      {/* early alert */}
      <div style={{ position: "absolute", left: 140, top: 1310 + (1 - alert) * 60, opacity: Math.min(1, alert) }}>
        <Card style={{ width: 800, padding: "22px 28px", display: "flex", alignItems: "center", gap: 20, border: `2px solid ${C.warn}` }}>
          <div style={{ position: "relative", width: 56, height: 56, flexShrink: 0 }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: C.warn, opacity: 0.4 * (1 - pulse), transform: `scale(${1 + pulse * 0.7})` }} />
            <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: C.warn, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon d={I.flag} size={30} color={INK} sw={2.4} />
            </div>
          </div>
          <div style={{ fontFamily: POPPINS }}>
            <div style={{ fontSize: 26, fontWeight: 800 }}>Retraso detectado · Factura</div>
            <div style={{ fontSize: 20, color: MUTED }}>Validación pendiente · 9 días antes del pago</div>
          </div>
        </Card>
      </div>
    </AbsoluteFill>
  );
};
