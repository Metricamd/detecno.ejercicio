// Escena 1 — ¿Puedes auditar todo el proceso…? Evidence scattered across
// emails, files and loose signatures, with a magnifier sweeping over them
// and a broken timeline underneath.
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, clamp, EASE, POPPINS, SAFE } from "../../theme";
import { Card, I, INK, MUTED, SyncedHeadline, Tile } from "../kit";
import { SCENE_AT, wordsBetween } from "../timings";

const T0 = SCENE_AT.hook;
const PIECES: { x: number; y: number; r: number; at: number; el: React.ReactNode }[] = [
  {
    x: 70, y: 820, r: -6, at: 10,
    el: (
      <Card style={{ width: 470, padding: 22, display: "flex", gap: 16, alignItems: "center" }}>
        <Tile d={I.mail} size={56} />
        <div>
          <div style={{ fontSize: 22, fontWeight: 700 }}>RE: Fwd: Autorización OC-2231</div>
          <div style={{ fontSize: 18, color: MUTED }}>compras@proveedor.mx · hace 3 sem</div>
        </div>
      </Card>
    ),
  },
  {
    x: 560, y: 760, r: 5, at: 16,
    el: (
      <Card style={{ width: 420, padding: 20, display: "flex", gap: 14, alignItems: "center" }}>
        <Tile d={I.pdf} size={52} bg="#FDE2E2" color={C.bad} />
        <div style={{ fontSize: 21, fontWeight: 700 }}>Contrato_firmado_v3.pdf</div>
      </Card>
    ),
  },
  {
    x: 520, y: 1010, r: -4, at: 22,
    el: (
      <Card style={{ width: 450, padding: 20, display: "flex", gap: 14, alignItems: "center" }}>
        <Tile d={I.xls} size={52} bg="#DCF3E5" color="#1D6F42" />
        <div style={{ fontSize: 21, fontWeight: 700 }}>Cotización_FINAL_2.xlsx</div>
      </Card>
    ),
  },
  {
    x: 110, y: 1060, r: 7, at: 28,
    el: (
      <Card style={{ width: 360, padding: 22 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Tile d={I.pen} size={48} />
          <div style={{ fontSize: 22, fontWeight: 700 }}>Firma de autorización</div>
        </div>
        <div style={{ marginTop: 10, fontSize: 30, fontWeight: 800, color: C.bad }}>¿?</div>
      </Card>
    ),
  },
];

// Broken timeline: some links missing.
const Timeline: React.FC<{ p: number }> = ({ p }) => {
  const nodes = ["Licitación", "Contrato", "OC", "Factura", "Pago"];
  const missing = [1, 3];
  return (
    <div style={{ position: "absolute", left: SAFE.side, right: SAFE.side, top: 1340, display: "flex", alignItems: "flex-start", opacity: p }}>
      {nodes.map((n, i) => (
        <React.Fragment key={n}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: 120 }}>
            <div style={{ width: 46, height: 46, borderRadius: "50%", border: `4px ${missing.includes(i) ? "dashed" : "solid"} ${missing.includes(i) ? C.bad : C.violet}`, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: POPPINS, fontWeight: 800, fontSize: 24, color: C.bad }}>
              {missing.includes(i) ? "?" : ""}
            </div>
            <span style={{ fontFamily: POPPINS, fontSize: 20, fontWeight: 600, color: INK }}>{n}</span>
          </div>
          {i < nodes.length - 1 && <div style={{ flex: 1, height: 0, marginTop: 23, borderTop: `4px ${missing.includes(i) || missing.includes(i + 1) ? "dashed" : "solid"} ${missing.includes(i) || missing.includes(i + 1) ? "#E9B8BB" : C.lilac}` }} />}
        </React.Fragment>
      ))}
    </div>
  );
};

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // magnifier sweeps over the evidence
  const t = frame / 30;
  const mx = 540 + Math.sin(t * 1.1) * 300;
  const my = 1000 + Math.cos(t * 1.6) * 170;
  const mIn = interpolate(frame, [30, 50], [0, 1], { ...clamp, easing: EASE });
  return (
    <AbsoluteFill>
      <SyncedHeadline words={wordsBetween(0, SCENE_AT.recibe)} sceneStart={T0} size={84} highlight={["auditar", "correo?"]} style={{ position: "absolute", left: SAFE.side, right: SAFE.side, top: SAFE.top + 20 }} />
      {PIECES.map((pc, i) => {
        const p = spring({ frame: frame - pc.at, fps, config: { damping: 13, stiffness: 120 } });
        const bob = Math.sin(frame / 18 + i * 1.7) * 8;
        return (
          <div key={i} style={{ position: "absolute", left: pc.x, top: pc.y + bob, transform: `rotate(${pc.r}deg) scale(${p})`, opacity: Math.min(1, p) }}>
            {pc.el}
          </div>
        );
      })}
      <Timeline p={interpolate(frame, [40, 60], [0, 1], { ...clamp, easing: EASE })} />
      {/* magnifier */}
      <svg width={260} height={260} viewBox="0 0 260 260" style={{ position: "absolute", left: mx - 100, top: my - 100, opacity: mIn, transform: `scale(${0.6 + mIn * 0.4})`, filter: "drop-shadow(0 20px 30px rgba(108,60,233,.35))" }}>
        <circle cx={100} cy={100} r={78} fill="rgba(167,139,250,.18)" stroke={C.violet} strokeWidth={16} />
        <path d="M156 156 L230 230" stroke={INK} strokeWidth={26} strokeLinecap="round" />
        <path d="M70 70 a40 40 0 0 1 40 -16" stroke="#fff" strokeWidth={8} fill="none" strokeLinecap="round" />
      </svg>
    </AbsoluteFill>
  );
};
