// Escena 5 — Visibilidad completa (16–21 s).
import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { DiferenciasCard, EstatusCard } from "../components/cards";
import { hasAsset, useFloat, Words } from "../components/ui";
import { SceneHero } from "../venvers/iso";
import { clamp, SAFE } from "../theme";

export const Visibilidad: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const zoom = interpolate(frame, [0, 165], [1, 1.12], clamp);
  const a = spring({ frame: frame - 18, fps, config: { damping: 15, stiffness: 120 } });
  const b = spring({ frame: frame - 46, fps, config: { damping: 15, stiffness: 120 } });
  const f1 = useFloat(0);
  const f2 = useFloat(1.6);
  return (
    <AbsoluteFill>
      {/* dashboard behind, slow camera zoom */}
      <div style={{ position: "absolute", left: 0, top: 560, width: 1080, height: 900, transform: `scale(${zoom})`, transformOrigin: "50% 40%", opacity: 0.55 }}>
        {hasAsset("dashboard-isometrico.png") ? (
          <Img src={staticFile("dashboard-isometrico.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <SceneHero x={-60} y={0} w={1200} h={900} />
        )}
      </div>
      <Words text="Detecta retrasos antes de que afecten la operación." size={88} at={2} highlight={["retrasos"]} style={{ position: "absolute", left: SAFE.side, right: SAFE.side, top: SAFE.top + 20 }} />
      <div style={{ position: "absolute", left: 90, top: 820 + f1 + (1 - a) * 200, opacity: Math.min(1, a) }}>
        <EstatusCard at={22} w={900} />
      </div>
      <div style={{ position: "absolute", left: 90, top: 1250 + f2 + (1 - b) * 200, opacity: Math.min(1, b) }}>
        <DiferenciasCard w={900} />
      </div>
    </AbsoluteFill>
  );
};
