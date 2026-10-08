// Escena 7 — CTA (26–30 s).
import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { useEnter, Words } from "../components/ui";
import { C, clamp, POPPINS, SAFE } from "../theme";

export const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logo = spring({ frame, fps, config: { damping: 14 } });
  const btn = spring({ frame: frame - 34, fps, config: { damping: 12, stiffness: 140 } });
  const pulse = 1 + (Math.sin((frame - 50) / 7) * 0.5 + 0.5) * 0.04 * (frame > 50 ? 1 : 0);
  const shine = interpolate((frame - 50) % 45, [0, 30], [-0.3, 1.3], clamp);
  const url = useEnter(52, 18);
  const foot = useEnter(62, 18);
  return (
    <AbsoluteFill>
      <Img src={staticFile("logo-venvers.png")} style={{ position: "absolute", left: (1080 - 560) / 2, top: SAFE.top + 40, width: 560, opacity: Math.min(1, logo), transform: `scale(${0.8 + logo * 0.2})` }} />
      <Words text="Planea tu flujo con información real, no con suposiciones." size={92} at={8} stagger={3} highlight={["información", "real,"]} style={{ position: "absolute", left: SAFE.side, right: SAFE.side, top: 520, textAlign: "center" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1040, display: "flex", justifyContent: "center", transform: `scale(${btn * pulse})`, opacity: Math.min(1, btn) }}>
        <div style={{ position: "relative", overflow: "hidden", fontFamily: POPPINS, fontWeight: 600, fontSize: 46, color: C.white, background: `linear-gradient(90deg, ${C.btnFrom}, ${C.btnTo})`, borderRadius: 999, padding: "34px 64px", boxShadow: "0 24px 60px rgba(108,60,233,.6), inset 0 2px 0 rgba(255,255,255,.3)" }}>
          Solicita una demo de Venvers
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(105deg, rgba(255,255,255,0) ${(shine - 0.12) * 100}%, rgba(255,255,255,.45) ${shine * 100}%, rgba(255,255,255,0) ${(shine + 0.12) * 100}%)` }} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1200, textAlign: "center", fontFamily: POPPINS, fontWeight: 600, fontSize: 48, color: C.lilac, opacity: url, transform: `translateY(${(1 - url) * 20}px)` }}>app.venvers.com</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1275, textAlign: "center", fontFamily: POPPINS, fontWeight: 300, fontSize: 32, color: "rgba(255,255,255,.85)", opacity: foot }}>Conoce el ecosistema detecno · detecno.com</div>
    </AbsoluteFill>
  );
};
