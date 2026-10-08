// Escena 4 — Recibe, valida y da seguimiento (11–16 s).
import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { CfdiCard, OrdenCard, PagoCard } from "../components/cards";
import { hasAsset, useFloat, Words } from "../components/ui";
import { Laptop } from "../venvers/kit";
import { C, clamp, EASE, SAFE } from "../theme";

const CARD_X = SAFE.side;
const CARD_W = 520;
const STEPS = [
  { y: 690, at: 30 },
  { y: 975, at: 56 },
  { y: 1235, at: 82 },
];

// Dashed connector drawn with stroke-dashoffset.
const Connector: React.FC<{ y1: number; y2: number; at: number }> = ({ y1, y2, at }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 14], [0, 1], { ...clamp, easing: EASE });
  const len = y2 - y1;
  const x = CARD_X + 70;
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
      <path d={`M ${x} ${y1} L ${x} ${y2}`} stroke={C.lilac} strokeWidth={5} strokeLinecap="round" strokeDasharray={len} strokeDashoffset={len * (1 - p)} />
      <circle cx={x} cy={y1 + len * p} r={9} fill={C.lilac} opacity={p > 0 && p < 1 ? 1 : 0} />
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
  return (
    <AbsoluteFill>
      <Words text="Recibe, valida y da seguimiento a cada factura sin perseguir información." size={80} at={2} stagger={2} highlight={["recibe", "valida", "seguimiento"]} style={{ position: "absolute", left: SAFE.side, right: SAFE.side, top: SAFE.top + 20 }} />
      {/* laptop with the portal login, entering from below with parallax */}
      <div style={{ position: "absolute", left: 0, top: 0, transform: `translateY(${lap * 700 + par}px)` }}>
        {hasAsset("laptop-portal.png") ? (
          <Img src={staticFile("laptop-portal.png")} style={{ position: "absolute", left: 420, top: 820, width: 760 }} />
        ) : (
          <Laptop x={520} y={900} w={640}>
            <Img src={staticFile("venvers/portal-login.png")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "left top" }} />
          </Laptop>
        )}
      </div>
      <Connector y1={STEPS[0].y + 250} y2={STEPS[1].y - 8} at={STEPS[1].at - 16} />
      <Connector y1={STEPS[1].y + 190} y2={STEPS[2].y - 8} at={STEPS[2].at - 16} />
      {[0, 1, 2].map((i) => {
        const p = pop(STEPS[i].at);
        const s = { position: "absolute" as const, left: CARD_X, top: STEPS[i].y + f[i], opacity: Math.min(1, p), transform: `translateX(${(1 - p) * -200}px)` };
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
