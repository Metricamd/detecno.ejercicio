// Escena 3 — Revelación de marca (8–11 s).
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { CHAOS } from "./Problema";
import { useEnter, Words } from "../components/ui";
import { C, clamp, POPPINS } from "../theme";

const LOGO = staticFile("logo-venvers.png");
const LOGO_W = 760;
const LOGO_H = Math.round((LOGO_W * 364) / 1827);

export const Marca: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // cards from the problem scene get sucked into the centre
  // accelerates into the centre (ease-in on purpose: the cards get pulled)
  const suck = interpolate(frame, [4, 28], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const flash = interpolate(frame, [24, 30, 48], [0, 1, 0], clamp);
  const logo = spring({ frame: frame - 36, fps, config: { damping: 11, stiffness: 120 }, from: 0.6, to: 1 });
  const logoIn = interpolate(frame, [36, 44], [0, 1], clamp);
  const shine = interpolate(frame, [52, 80], [-0.4, 1.4], clamp);
  const sub = useEnter(56, 18);
  return (
    <AbsoluteFill>
      {suck < 1 &&
        CHAOS.map(({ x, y, r, C: Card }, i) => (
          <div key={i} style={{ position: "absolute", left: x + (540 - 185 - x) * suck, top: y + (900 - y) * suck, transform: `rotate(${r * (1 + suck * 4)}deg) scale(${1 - suck})`, opacity: 1 - suck * 0.6 }}>
            <Card w={370} />
          </div>
        ))}
      <div style={{ position: "absolute", left: 540 - 700, top: 960 - 700, width: 1400, height: 1400, borderRadius: "50%", background: `radial-gradient(circle, ${C.lilac} 0%, ${C.violet}99 30%, rgba(108,60,233,0) 65%)`, opacity: flash, transform: `scale(${0.4 + flash})` }} />
      <Words text="Hazlo con" weight={300} size={64} at={30} style={{ position: "absolute", left: 0, right: 0, top: 700, textAlign: "center" }} />
      <div style={{ position: "absolute", left: (1080 - LOGO_W) / 2, top: 820, width: LOGO_W, height: LOGO_H, transform: `scale(${logo})`, opacity: logoIn }}>
        <Img src={LOGO} style={{ width: LOGO_W, height: LOGO_H }} />
        {/* light sweep masked by the logo itself */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            WebkitMaskImage: `url(${LOGO})`,
            WebkitMaskSize: "100% 100%",
            maskImage: `url(${LOGO})`,
            maskSize: "100% 100%",
            background: `linear-gradient(105deg, rgba(255,255,255,0) ${(shine - 0.15) * 100}%, rgba(255,255,255,.95) ${shine * 100}%, rgba(255,255,255,0) ${(shine + 0.15) * 100}%)`,
          }}
        />
      </div>
      <div style={{ position: "absolute", left: 40, right: 40, top: 1060, textAlign: "center", fontFamily: POPPINS, fontWeight: 300, fontSize: 46, color: C.white, opacity: sub, transform: `translateY(${(1 - sub) * 30}px)` }}>
        El portal de proveedores de detecno
      </div>
    </AbsoluteFill>
  );
};
