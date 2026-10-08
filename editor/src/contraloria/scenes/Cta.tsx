// Escena 5 — Solicita una demo de Venvers.
import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C, clamp, POPPINS, SAFE } from "../../theme";
import { SyncedHeadline } from "../kit";
import { SCENE_AT, wordsBetween } from "../timings";

const T0 = SCENE_AT.cta;

export const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logo = spring({ frame, fps, config: { damping: 14 } });
  const btn = spring({ frame: frame - 34, fps, config: { damping: 12, stiffness: 140 } });
  const pulse = frame > 50 ? 1 + (Math.sin((frame - 50) / 7) * 0.5 + 0.5) * 0.04 : 1;
  const shine = interpolate((frame - 50) % 45, [0, 30], [-0.3, 1.3], clamp);
  const foot = interpolate(frame, [50, 68], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Img src={staticFile("venvers/logo-venvers-dark.png")} style={{ position: "absolute", left: (1080 - 600) / 2, top: SAFE.top + 120, width: 600, opacity: Math.min(1, logo), transform: `scale(${0.8 + logo * 0.2})` }} />
      <SyncedHeadline words={wordsBetween(T0, SCENE_AT.end)} sceneStart={T0} size={104} highlight={["demo"]} style={{ position: "absolute", left: SAFE.side, right: SAFE.side, top: 620, textAlign: "center" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1000, display: "flex", justifyContent: "center", transform: `scale(${btn * pulse})`, opacity: Math.min(1, btn) }}>
        <div style={{ position: "relative", overflow: "hidden", fontFamily: POPPINS, fontWeight: 600, fontSize: 46, color: C.white, background: `linear-gradient(90deg, ${C.btnFrom}, ${C.btnTo})`, borderRadius: 999, padding: "34px 70px", boxShadow: "0 24px 60px rgba(108,60,233,.45), inset 0 2px 0 rgba(255,255,255,.3)" }}>
          Solicitar demo →
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(105deg, rgba(255,255,255,0) ${(shine - 0.12) * 100}%, rgba(255,255,255,.45) ${shine * 100}%, rgba(255,255,255,0) ${(shine + 0.12) * 100}%)` }} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1210, textAlign: "center", fontFamily: POPPINS, fontWeight: 600, fontSize: 48, color: C.violet, opacity: foot }}>app.venvers.com</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1290, textAlign: "center", fontFamily: POPPINS, fontWeight: 300, fontSize: 32, color: "#4A4F70", opacity: foot }}>Conoce el ecosistema detecno · detecno.com</div>
    </AbsoluteFill>
  );
};
