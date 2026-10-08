// Escena 4c — Información disponible para revisión y auditoría: the
// supplier file opens, every item is checked and it is ready to export.
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, clamp, EASE, POPPINS, SAFE } from "../../theme";
import { Card, GRAD, I, Icon, INK, LINE, localFrame, MUTED, SyncedHeadline } from "../kit";
import { SCENE_AT, wordAt, wordsBetween } from "../timings";

const T0 = SCENE_AT.auditoria;
const ITEMS = ["Licitación y propuestas", "Contrato firmado", "Órdenes de compra", "CFDI validados", "Comprobantes de pago", "Firmas y aprobaciones"];

export const Auditoria: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const open = interpolate(frame, [4, 22], [0, 1], { ...clamp, easing: EASE });
  const auditAt = localFrame(wordAt("auditoría"), T0);
  const ready = spring({ frame: frame - auditAt, fps, config: { damping: 10, stiffness: 150 } });
  return (
    <AbsoluteFill>
      <SyncedHeadline words={wordsBetween(T0, SCENE_AT.cta)} sceneStart={T0} size={80} highlight={["revisión", "auditoría."]} style={{ position: "absolute", left: SAFE.side, right: SAFE.side, top: SAFE.top + 20 }} />
      {/* folder */}
      <div style={{ position: "absolute", left: 120, top: 640, width: 840, height: 840, perspective: 1600 }}>
        <div style={{ position: "absolute", left: 0, top: 30, width: 300, height: 70, borderRadius: "26px 26px 0 0", background: GRAD }} />
        <div style={{ position: "absolute", left: 0, top: 80, width: 840, height: 760, borderRadius: "0 30px 30px 30px", background: GRAD, boxShadow: "0 40px 80px rgba(108,60,233,.35)" }} />
        <div style={{ position: "absolute", left: 40, top: 60 - open * 40, width: 760 }}>
          <Card style={{ padding: 30 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
              <Icon d={I.folder} size={40} color={C.violet} />
              <div>
                <div style={{ fontSize: 28, fontWeight: 800 }}>Expediente · Aceros del Norte</div>
                <div style={{ fontSize: 19, color: MUTED }}>LP-0214 · CT-118 · OC-1002</div>
              </div>
            </div>
            {ITEMS.map((it, i) => {
              const p = spring({ frame: frame - 14 - i * 6, fps, config: { damping: 11, stiffness: 160 } });
              return (
                <div key={it} style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 0", borderTop: `1px solid ${LINE}` }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: C.ok, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${p})` }}>
                    <Icon d={I.check} size={24} sw={3} />
                  </div>
                  <span style={{ fontFamily: POPPINS, fontSize: 25, fontWeight: 600, color: INK }}>{it}</span>
                </div>
              );
            })}
          </Card>
        </div>
      </div>
      {/* ready badge + export */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1350, display: "flex", justifyContent: "center", gap: 18, opacity: Math.min(1, ready), transform: `scale(${0.8 + ready * 0.2})` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, background: "#fff", borderRadius: 999, padding: "16px 30px", boxShadow: "0 20px 40px rgba(34,197,94,.3)", border: `2px solid ${C.ok}`, fontFamily: POPPINS, fontWeight: 700, fontSize: 28, color: "#15803D" }}>
          <Icon d={I.shield} size={34} color={C.ok} sw={2.4} />
          Listo para auditoría
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: GRAD, borderRadius: 999, padding: "16px 30px", fontFamily: POPPINS, fontWeight: 700, fontSize: 28, color: "#fff", boxShadow: "0 20px 40px rgba(108,60,233,.4)" }}>
          <Icon d={I.download} size={32} />
          Exportar
        </div>
      </div>
    </AbsoluteFill>
  );
};
