// Escena 2 — Con Venvers, recibe, valida y da seguimiento a la factura.
// An invoice travels through three stations, stamped at each one as the
// voice names it.
import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C, clamp, EASE, POPPINS, SAFE } from "../../theme";
import { Card, I, Icon, INK, LINE, localFrame, MUTED, Pill, SyncedHeadline, Tile } from "../kit";
import { SCENE_AT, wordAt, wordsBetween } from "../timings";

const T0 = SCENE_AT.recibe;
const STATIONS = [
  { k: "recibe", label: "Recibe", d: I.inbox },
  { k: "valida", label: "Valida", d: I.shield },
  { k: "seguimiento", label: "Seguimiento", d: I.route },
];
const SX = [210, 540, 870];

export const Recibe: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = STATIONS.map((s) => localFrame(wordAt(s.k), T0));
  const logo = spring({ frame: frame - localFrame(wordAt("venvers"), T0) + 4, fps, config: { damping: 12 } });
  // invoice x position: hops station to station
  const x = interpolate(frame, [at[0] - 12, at[0], at[1] - 4, at[1] + 6, at[2] - 4, at[2] + 6], [-300, SX[0], SX[0], SX[1], SX[1], SX[2]], { ...clamp, easing: EASE });
  const valid = spring({ frame: frame - at[1] - 6, fps, config: { damping: 9, stiffness: 160 } });
  const track = interpolate(frame, [at[2] + 6, at[2] + 40], [0, 1], { ...clamp, easing: EASE });
  return (
    <AbsoluteFill>
      <Img src={staticFile("venvers/logo-venvers-dark.png")} style={{ position: "absolute", left: SAFE.side, top: SAFE.top + 10, height: 74, opacity: Math.min(1, logo), transform: `scale(${0.7 + logo * 0.3})`, transformOrigin: "left center" }} />
      <SyncedHeadline words={wordsBetween(T0, SCENE_AT.visibilidad)} sceneStart={T0} size={74} highlight={["recibe,", "valida", "seguimiento"]} style={{ position: "absolute", left: SAFE.side, right: SAFE.side, top: SAFE.top + 120 }} />
      {/* rail */}
      <div style={{ position: "absolute", left: SX[0], width: SX[2] - SX[0], top: 950, height: 6, background: LINE, borderRadius: 3 }}>
        <div style={{ width: `${interpolate(x, [SX[0], SX[2]], [0, 100], clamp)}%`, height: "100%", background: C.violet, borderRadius: 3 }} />
      </div>
      {STATIONS.map((s, i) => {
        const on = spring({ frame: frame - at[i], fps, config: { damping: 12 } });
        return (
          <div key={s.k} style={{ position: "absolute", left: SX[i] - 90, top: 860, width: 180, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <div style={{ transform: `scale(${0.85 + on * 0.15})`, boxShadow: on > 0.5 ? "0 16px 40px rgba(108,60,233,.45)" : "none", borderRadius: 54 }}>
              <Tile d={s.d} size={180 * 0.6} bg={on > 0.5 ? undefined : "#E9E4FB"} color={on > 0.5 ? "#fff" : "#9C93C9"} style={{ borderRadius: 54 }} />
            </div>
            <span style={{ fontFamily: POPPINS, fontWeight: 700, fontSize: 30, color: on > 0.5 ? INK : MUTED }}>{s.label}</span>
          </div>
        );
      })}
      {/* invoice travelling */}
      <div style={{ position: "absolute", left: Math.min(x - 210, 1080 - SAFE.side - 420), top: 1120 }}>
        <Card style={{ width: 420, padding: 26 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Tile d={I.doc} size={56} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 26, fontWeight: 800 }}>Factura A-4521</div>
              <div style={{ fontSize: 19, color: MUTED }}>Aceros del Norte · $8,320.00</div>
            </div>
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: C.ok, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${valid})` }}>
              <Icon d={I.check} size={30} sw={3} />
            </div>
          </div>
          <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Pill color={C.violet} size={18}>Recibida</Pill>
            {valid > 0.3 && <Pill color={C.ok} size={18}>Validada ante SAT</Pill>}
          </div>
          <div style={{ marginTop: 16, height: 12, borderRadius: 6, background: "#EEEAFB", overflow: "hidden" }}>
            <div style={{ width: `${track * 100}%`, height: "100%", background: `linear-gradient(90deg, ${C.btnFrom}, ${C.btnTo})` }} />
          </div>
          <div style={{ marginTop: 8, fontSize: 18, color: MUTED, opacity: track }}>En seguimiento · Pago programado 15/07</div>
        </Card>
      </div>
    </AbsoluteFill>
  );
};
