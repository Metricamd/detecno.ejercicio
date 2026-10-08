// Escena 4 — Recibe, valida y da seguimiento (11–16 s).
import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { CfdiCard, OrdenCard, PagoCard } from "../components/cards";
import { hasAsset, useFloat, Words } from "../components/ui";
import { Laptop } from "../venvers/kit";
import { C, clamp, EASE, SAFE } from "../theme";

const CARD_W = 470;
// Zig-zag so the chain fits above the captions band.
const STEPS = [
  { x: SAFE.side, y: 640, at: 30 },
  { x: 1080 - SAFE.side - CARD_W, y: 870, at: 56 },
  { x: SAFE.side, y: 1095, at: 82 },
];

// Curved connector drawn with stroke-dashoffset.
const Connector: React.FC<{ d: string; at: number }> = ({ d, at }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 16], [0, 1], { ...clamp, easing: EASE });
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
      <path d={d} fill="none" stroke={C.lilac} strokeWidth={5} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
    </svg>
  );
};

export const Seguimiento: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lap = interpolate(frame, [0, 30], [1, 0], { ...clamp, easing: EASE });
  const par = frame * -0.35;
  const f = [useFloat(0), useFloat(1.2), useFloat(2.4)];
  const pop = (at: number) => spring({ frame: frame - at, fps, config: { damping: 14, stiffness: 130 } });
  const check = (at: number) => spring({ frame: frame - at, fps, config: { damping: 9, stiffness: 160 } });
  const right = STEPS[1].x + CARD_W / 2;
  return (
    <AbsoluteFill>
      <Words text="Recibe, valida y da seguimiento a cada factura sin perseguir información." size={76} at={2} stagger={2} highlight={["recibe", "valida", "seguimiento"]} style={{ position: "absolute", left: SAFE.side, right: SAFE.side, top: SAFE.top + 10 }} />
      {/* laptop with the portal login, entering from below with parallax */}
      <div style={{ position: "absolute", left: 0, top: 0, transform: `translateY(${lap * 700 + par}px)` }}>
        {hasAsset("laptop-portal.png") ? (
          <Img src={staticFile("laptop-portal.png")} style={{ position: "absolute", left: 480, top: 1060, width: 700 }} />
        ) : (
          <Laptop x={600} y={1030} w={560}>
            <Img src={staticFile("venvers/portal-login.png")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "left top" }} />
          </Laptop>
        )}
      </div>
      <Connector d={`M ${STEPS[0].x + CARD_W} ${STEPS[0].y + 110} C ${right} ${STEPS[0].y + 110}, ${right} ${STEPS[0].y + 160}, ${right} ${STEPS[1].y - 6}`} at={STEPS[1].at - 18} />
      <Connector d={`M ${right} ${STEPS[1].y + 196} C ${right} ${STEPS[2].y + 110}, ${right} ${STEPS[2].y + 110}, ${STEPS[2].x + CARD_W + 6} ${STEPS[2].y + 110}`} at={STEPS[2].at - 18} />
      {[0, 1, 2].map((i) => {
        const p = pop(STEPS[i].at);
        const s = { position: "absolute" as const, left: STEPS[i].x, top: STEPS[i].y + f[i], opacity: Math.min(1, p), transform: `translateX(${(1 - p) * (i === 1 ? 200 : -200)}px)` };
        return (
          <div key={i} style={s}>
            {i === 0 && <CfdiCard w={CARD_W} checked={check(STEPS[0].at + 14)} />}
            {i === 1 && <OrdenCard w={CARD_W} />}
            {i === 2 && <PagoCard w={CARD_W} checked={check(STEPS[2].at + 14)} />}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
