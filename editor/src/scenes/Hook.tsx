// Escena 1 — Hook (0–4 s).
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { hasAsset, useEnter, Words } from "../components/ui";
import { clamp, SAFE } from "../theme";

const PHOTO = hasAsset("persona-estres.jpg") ? "persona-estres.jpg" : "venvers/photos/foto1.jpg";

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = useEnter(28, 22);
  const zoom = interpolate(frame, [0, 135], [1, 1.08], clamp);
  return (
    <AbsoluteFill>
      <Words
        text="¿Necesitas ver facturas, pagos y descuentos de proveedores en un solo lugar?"
        highlight={["facturas", "pagos", "descuentos"]}
        size={92}
        at={4}
        stagger={3}
        style={{ position: "absolute", left: SAFE.side, right: SAFE.side, top: SAFE.top + 30 }}
      />
      <div
        style={{
          position: "absolute",
          left: SAFE.side,
          right: SAFE.side,
          top: 940,
          height: 400,
          borderRadius: 40,
          overflow: "hidden",
          boxShadow: "0 40px 80px rgba(10,10,60,.6)",
          border: "1px solid rgba(255,255,255,.3)",
          opacity: enter,
          transform: `translateY(${(1 - enter) * 120}px)`,
          clipPath: `inset(${(1 - enter) * 50}% 0 0 0 round 40px)`,
        }}
      >
        <Img src={staticFile(PHOTO)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoom})`, objectPosition: "35% 40%" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(10,10,60,0) 55%, rgba(10,10,60,.55) 100%)" }} />
      </div>
    </AbsoluteFill>
  );
};
