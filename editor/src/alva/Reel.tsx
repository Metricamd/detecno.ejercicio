import { Audio } from "@remotion/media";
import React, { useEffect, useState } from "react";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  Easing,
  Img,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { fontsLoaded } from "../fispal/theme";
import { Stage } from "../fispal/three/Stage";
import { Room, FIX } from "./Room";
import { BLOCKS, CUE, TOTAL_SECONDS, VOICE_FILE, type Run } from "./timeline";

const FPS = 30;
const sec = (t: number) => Math.round(t * FPS);
export const ALVA_DURATION = sec(TOTAL_SECONDS);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.65, 0, 0.35, 1);

// ---- palette measured on the reference (estilo-alva.md §7) ----
const PURPLE_TEXT = "#5E3F92";

const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const lerpHex = (a: string, b: string, t: number) => {
  const A = hex(a);
  const B = hex(b);
  return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(",")})`;
};

// Camera keyframes: [seconds, scale, panY]. Dolly-in during the problem, a
// punch at the reveal, then a dolly-out into the logo (estilo-alva.md §6).
const CAM: [number, number, number, number][] = [
  [0, 0.225, 0.12, 0],
  [3.2, 0.265, 0.12, 0],
  [8.15, 0.33, 0.1, -0.05],
  [8.4, 0.35, 0.1, -0.28],
  [11.2, 0.345, 0.12, -0.3],
  [13.95, 0.235, 0.1, 0],
];
const camAt = (f: number) => {
  const t = f / FPS;
  const ts = CAM.map((c) => c[0]);
  const at = (i: number) =>
    interpolate(t, ts, CAM.map((c) => c[i]), { ...clamp, easing: ease });
  return { s: at(1), y: at(2), x: at(3) };
};

const CameraRig: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  const { s, y, x } = camAt(f);
  const stress =
    interpolate(f, [sec(2.2), sec(7.9)], [0, 1], clamp) * (1 - interpolate(f, [FIX - 2, FIX + 6], [0, 1], clamp));
  const shake = stress * 0.016;
  const sx = (Math.sin(f * 2.3) + Math.sin(f * 4.1)) * shake;
  const sy = (Math.cos(f * 2.9) + Math.sin(f * 3.3)) * shake;
  // a small drift while the new room settles
  const drift = Math.sin(f / 40) * 0.01;
  return (
    <group position={[x + sx, y + sy, 0]} rotation={[0.62 + drift, 0, stress * 0.012 * Math.sin(f * 1.7)]} scale={s}>
      <group rotation={[0, -Math.PI / 4, 0]}>{children}</group>
    </group>
  );
};

const Background: React.FC = () => {
  const f = useCurrentFrame();
  const k = interpolate(f, [FIX, FIX + 36], [0, 1], { ...clamp, easing: ease });
  const dark = interpolate(f, [0, sec(7.9)], [0, 1], clamp) * (1 - k);
  // gray → lilac → peach (8,5–9,5 s of the reference, compressed)
  const midTop = k < 0.5 ? lerpHex("#5A6168", "#8D7BB5", k * 2) : lerpHex("#8D7BB5", "#F0B3A4", (k - 0.5) * 2);
  const midBot = k < 0.5 ? lerpHex("#8E949B", "#C5A8D8", k * 2) : lerpHex("#C5A8D8", "#F7DCCB", (k - 0.5) * 2);
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${midTop} 0%, ${midBot} 100%)`,
        filter: `brightness(${1 - 0.28 * dark})`,
      }}
    />
  );
};

// End card: mesh gradient with grain (estilo-alva.md §7).
const EndBackdrop: React.FC<{ opacity: number }> = ({ opacity }) => {
  const f = useCurrentFrame();
  const drift = Math.sin(f / 45) * 30;
  return (
    <AbsoluteFill style={{ opacity, background: "#F7918B", overflow: "hidden" }}>
      <div style={{ position: "absolute", width: 1300, height: 1300, left: -520 + drift, top: -380, borderRadius: "50%", background: "#FBE7DA", filter: "blur(150px)", opacity: 0.95 }} />
      <div style={{ position: "absolute", width: 1200, height: 1500, right: -560 - drift, top: -300, borderRadius: "50%", background: "#AB7FED", filter: "blur(160px)" }} />
      <div style={{ position: "absolute", width: 1500, height: 1000, left: -200, bottom: -520 + drift, borderRadius: "50%", background: "#B69AE5", filter: "blur(170px)" }} />
      <div style={{ position: "absolute", width: 900, height: 900, right: -300, bottom: 100, borderRadius: "50%", background: "#E39DB0", filter: "blur(150px)", opacity: 0.8 }} />
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0, mixBlendMode: "soft-light", opacity: 0.35 }}>
        <filter id="g">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="1080" height="1920" filter="url(#g)" />
      </svg>
    </AbsoluteFill>
  );
};

// ---- subtitles: whole block fades in, 2 lines, SemiBold tail (reference) ----
const RunView: React.FC<{ r: Run }> = ({ r }) => (
  <span style={{ fontWeight: r[1] ? 600 : 400 }}>{r[0]}</span>
);

const Subtitles: React.FC = () => {
  const f = useCurrentFrame();
  const LEAD = 0.1;
  const b = BLOCKS.find((x) => f >= sec(x.start - LEAD) && f < sec(x.end));
  if (!b) return null;
  const inn = interpolate(f, [sec(b.start - LEAD), sec(b.start - LEAD) + 8], [0, 1], clamp);
  const out = interpolate(f, [sec(b.end) - 5, sec(b.end)], [1, 0], clamp);
  const onEnd = f >= sec(CUE.endCard) - 4;
  // white on the gray problem, purple on the peach solution, white on the gradient
  const k = interpolate(f, [FIX + 14, FIX + 26], [0, 1], clamp);
  const color = lerpHex("#FFFFFF", PURPLE_TEXT, k);
  const size = b.solo ? 54 : 46;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: onEnd ? 0 : 1 }}>
      <div
        style={{
          position: "absolute",
          left: 90,
          right: 90,
          top: 1690,
          transform: `translateY(calc(-50% + ${(1 - inn) * 12 - (1 - out) * 14}px))`,
          opacity: inn * out,
          filter: `blur(${(1 - inn) * 6}px)`,
          textAlign: "center",
          fontFamily: "Poppins",
          fontSize: size,
          lineHeight: 1.45,
          color,
          textShadow: k < 0.5 ? "0 2px 14px rgba(0,0,0,.18)" : "0 0 18px rgba(255,255,255,.35)",
        }}
      >
        {b.lines.map((line, i) => (
          <div key={i}>
            {line.map((r, j) => (
              <RunView key={j} r={r} />
            ))}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const SFX: { file: string; at: number; volume: number }[] = [
  { file: "pop", at: sec(CUE.sueldo), volume: 0.5 },
  { file: "pop", at: sec(CUE.prestaciones), volume: 0.5 },
  { file: "pop", at: sec(CUE.equipo), volume: 0.5 },
  { file: "pop", at: sec(CUE.licencias), volume: 0.5 },
  { file: "pop", at: sec(CUE.anio), volume: 0.5 },
  { file: "whoosh", at: FIX - 4, volume: 0.55 },
  { file: "ding", at: FIX + 14, volume: 0.45 },
  { file: "whoosh", at: sec(CUE.endCard) - 4, volume: 0.4 },
  { file: "ding", at: sec(CUE.endCard) + 14, volume: 0.35 },
];

export const AlvaReel: React.FC = () => {
  const [handle] = useState(() => delayRender("Loading fonts"));
  const [ready, setReady] = useState(false);
  useEffect(() => {
    fontsLoaded.then(() => {
      setReady(true);
      continueRender(handle);
    });
  }, [handle]);

  const f = useCurrentFrame();
  const end = sec(CUE.endCard);
  // 3D → end card: cross-fade with blur, the room pushes through the camera.
  const x = interpolate(f, [end, end + 12], [0, 1], { ...clamp, easing: ease });
  const logoIn = spring({ frame: f - (end + 6), fps: FPS, config: { damping: 14 } });
  const monoOp = 0.85 * Math.min(1, f / 10);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AbsoluteFill style={{ opacity: 1 - x, filter: x > 0 ? `blur(${x * 14}px)` : undefined, transform: `scale(${1 + x * 0.12})` }}>
        <Background />
        {ready && f < end + 12 && (
          <Stage top={0} height={1920} z={7.5}>
            <CameraRig>
              <Room />
            </CameraRig>
          </Stage>
        )}
      </AbsoluteFill>

      <EndBackdrop opacity={x} />
      <div
        style={{
          position: "absolute",
          left: 150,
          top: 700,
          opacity: logoIn,
          filter: `blur(${(1 - logoIn) * 10}px)`,
          transform: `scale(${0.88 + 0.12 * logoIn})`,
          transformOrigin: "390px 232px",
        }}
      >
        <Img src={staticFile("brand/alva-logo-white.png")} style={{ width: 780 }} />
      </div>

      {/* monogram watermark, top-right, whole video */}
      <Img
        src={staticFile("brand/alva-mono-white.png")}
        style={{ position: "absolute", left: 880, top: 70, width: 160, opacity: monoOp }}
      />

      <Subtitles />

      <Audio src={staticFile(VOICE_FILE)} />
      <Audio
        src={staticFile("music/alva.wav")}
        volume={(fr) =>
          interpolate(fr, [0, 6, ALVA_DURATION - 36, ALVA_DURATION], [0, 0.34, 0.34, 0], clamp) *
          // let the voice sit above the drop
          (fr > FIX && fr < sec(CUE.endCard) ? 0.85 : 1)
        }
      />
      {SFX.map((fx, i) => (
        <Sequence key={i} from={Math.max(0, fx.at)} durationInFrames={30} layout="none">
          <Audio src={staticFile(`sfx/${fx.file}.wav`)} volume={fx.volume} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
