// Glass illustrations (Magnific renders, cut out to PNG in
// public/fispal/illus) that replace the procedural 3D objects. Each one pops
// in with a spring, floats gently and can pop out again.
import React from "react";
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const Illus: React.FC<{
  name: string;
  at: number; // frame it pops in
  out?: number; // frame it starts leaving
  x: number; // centre, px
  y: number; // centre, px
  size: number;
  phase?: number;
  tilt?: number; // degrees of gentle rocking
}> = ({ name, at, out, x, y, size, phase = 0, tilt = 2 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inP = spring({ frame: frame - at, fps, config: { damping: 11, stiffness: 140 } });
  const outP = out === undefined ? 0 : interpolate(frame, [out, out + 6], [0, 1], clamp);
  const s = Math.max(0, inP * (1 - outP));
  if (s <= 0.001) return null;
  const local = frame - at;
  const bob = Math.sin(local / 16 + phase) * 10;
  const rock = Math.sin(local / 30 + phase) * tilt;
  return (
    <Img
      src={staticFile(`fispal/illus/${name}.png`)}
      style={{
        position: "absolute",
        left: x - size / 2,
        top: y - size / 2 + bob - outP * 60 + (1 - Math.min(1, inP)) * 40,
        width: size,
        height: size,
        objectFit: "contain",
        opacity: Math.min(1, inP * 1.5) * (1 - outP),
        transform: `scale(${0.6 + 0.4 * s}) rotate(${rock}deg)`,
        filter: "drop-shadow(0 30px 40px rgba(37,14,148,.18))",
      }}
    />
  );
};

// Closing-scene decoration: small illustrations drifting in the corners.
export const IllusFloaters: React.FC<{ at?: number }> = ({ at = 0 }) => (
  <>
    <Illus name="check" at={at + 6} x={150} y={300} size={220} phase={0.5} />
    <Illus name="monedas" at={at + 10} x={930} y={260} size={220} phase={2} />
    <Illus name="calendario" at={at + 14} x={150} y={1720} size={220} phase={3.4} />
    <Illus name="facturas" at={at + 18} x={930} y={1720} size={220} phase={1.2} />
  </>
);
