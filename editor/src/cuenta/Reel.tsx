import { Audio } from "@remotion/media";
import React, { useEffect, useState } from "react";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  Easing,
  getStaticFiles,
  Img,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Subtitles } from "../fispal/Subtitles";
import { C, fontsLoaded, s } from "../fispal/theme";
import { Stage } from "../fispal/three/Stage";
import { Floaters, Orb, Pop } from "../fispal/three/objects";
import { Magnifier, PieChart, RenewArrow, ToggleSwitch } from "../fispal/three/objects2";
import { Background, Enter, Pill } from "../fispal/ui";
import { Account, type AccountCues } from "./Account";
import { buildPages } from "./captions";
import { CUE, VOICE_DURATION } from "./timeline";

export const CUENTA_BPM = 116;
export const CUENTA_DURATION = s(VOICE_DURATION + 1);
const VOICE = "audio/voz-cuenta.wav";
const PAGES = buildPages(CUENTA_DURATION / 30);

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.65, 0, 0.35, 1);

// Section starts (frames): each one moves the camera and swaps the 3D object.
const SEC = {
  status: s(CUE.tuPlan - 0.15),
  renew: s(CUE.anticipate - 0.15),
  plan: s(CUE.revisa - 0.15),
  done: s(CUE.todoClaro - 0.15),
  cta: s(CUE.conoce - 0.15),
};

// Camera keyframes over the account screen: [frame, focusY, scale].
// The window is 1000 × 1150; focusY is the screen y that sits in its centre.
const CAM: [number, number, number][] = [
  [0, 740, 0.74],
  [SEC.status, 400, 1.06],
  [SEC.renew, 740, 1.06],
  [SEC.plan, 945, 1.1],
  [SEC.done, 740, 0.74],
];
const MOVE = 14; // frames per camera move: quick and eased (estilo: "más dinámico")

const camera = (frame: number) => {
  let [, fy, sc] = CAM[0];
  for (let i = 1; i < CAM.length; i++) {
    const [at, y, z] = CAM[i];
    const k = interpolate(frame, [at, at + MOVE], [0, 1], { ...clamp, easing: ease });
    fy = fy + (y - fy) * k;
    sc = sc + (z - sc) * k;
  }
  return { fy, sc };
};

const SLIDES = [
  { at: 0, label: "01/05 · Tu cuenta" },
  { at: SEC.status, label: "02/05 · Estado" },
  { at: SEC.renew, label: "03/05 · Renovación" },
  { at: SEC.plan, label: "04/05 · Lo contratado" },
  { at: SEC.done, label: "05/05 · Todo claro" },
];

const SlidePill: React.FC<{ frame: number }> = ({ frame }) => {
  const current = [...SLIDES].reverse().find((x) => frame >= x.at) ?? SLIDES[0];
  const p = interpolate(frame, [current.at, current.at + 6], [0, 1], clamp);
  return (
    <div
      style={{
        position: "absolute",
        left: 40,
        top: 150,
        opacity: p,
        filter: `blur(${(1 - p) * 6}px)`,
        transform: `translateY(${(1 - p) * 12}px)`,
      }}
    >
      <Pill>{current.label}</Pill>
    </div>
  );
};

const SFX: { file: string; at: number; volume: number }[] = [
  { file: "pop", at: 2, volume: 0.5 },
  ...[SEC.status, SEC.renew, SEC.plan, SEC.done].map((at) => ({ file: "whoosh", at: at - 3, volume: 0.35 })),
  { file: "click", at: s(CUE.activo), volume: 0.7 },
  { file: "pop", at: s(CUE.soporte) - 6, volume: 0.4 },
  { file: "pop", at: s(CUE.fecha), volume: 0.45 },
  ...[CUE.rfc, CUE.cfdi, CUE.modulos].map((t) => ({ file: "pop", at: s(t), volume: 0.5 })),
  { file: "ding", at: s(CUE.todoClaro), volume: 0.3 },
  { file: "whoosh", at: SEC.cta - 3, volume: 0.35 },
  { file: "click", at: s(CUE.url) + 18, volume: 0.6 },
];

export const CuentaReel: React.FC = () => {
  const [handle] = useState(() => delayRender("Loading fonts"));
  useEffect(() => {
    fontsLoaded.then(() => continueRender(handle));
  }, [handle]);

  const frame = useCurrentFrame();
  const hasVoice = getStaticFiles().some((f) => f.name === VOICE);

  const cues: AccountCues = {
    activo: s(CUE.activo),
    compruebalo: s(CUE.compruebalo),
    soporte: s(CUE.soporte),
    fecha: s(CUE.fecha),
    proximo: s(CUE.proximo),
    rfc: s(CUE.rfc),
    cfdi: s(CUE.cfdi),
    modulos: s(CUE.modulos),
    todoClaro: s(CUE.todoClaro),
  };
  const focus =
    frame >= SEC.done ? "all" : frame >= SEC.plan ? "plan" : frame >= SEC.renew ? "renew" : frame >= SEC.status ? "status" : "all";

  const { fy, sc } = camera(frame);
  const intro = spring({ frame, fps: 30, config: { damping: 14 } });
  const outro = interpolate(frame, [SEC.cta, SEC.cta + 10], [0, 1], { ...clamp, easing: ease });

  return (
    <AbsoluteFill>
      <Background bpm={CUENTA_BPM} />

      {/* The app window with the camera tour */}
      <div
        style={{
          position: "absolute",
          left: 40,
          top: 250,
          width: 1000,
          height: 1150,
          borderRadius: 40,
          overflow: "hidden",
          background: "#F4F5FA",
          boxShadow: "0 40px 100px rgba(37,14,148,.20)",
          opacity: (1 - outro) * Math.min(1, intro * 1.5),
          transform: `perspective(1600px) rotateX(${(1 - intro) * 16}deg) scale(${(0.9 + 0.1 * intro) * (1 - 0.15 * outro)}) translateY(${outro * 260}px)`,
          filter: outro > 0 ? `blur(${outro * 12}px)` : undefined,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 500 - 500 * sc,
            top: 575 - fy * sc,
            transform: `scale(${sc})`,
            transformOrigin: "0 0",
          }}
        >
          <Account frame={frame} cues={cues} focus={focus} />
        </div>
      </div>

      {frame < SEC.cta && <SlidePill frame={frame} />}

      {/* 3D object breaking out of the window's top-right corner */}
      {frame < SEC.cta + 6 && (
        <Stage top={30} left={600} width={480} height={480}>
          <Pop at={0} out={SEC.status - 3} scale={0.9}>
            <Magnifier />
          </Pop>
          <Pop at={SEC.status} out={SEC.renew - 3} scale={0.72} spin={0} position={[-0.2, 0, 0]}>
            <ToggleSwitch onAt={s(CUE.activo)} />
          </Pop>
          <Pop at={SEC.renew} out={SEC.plan - 3} scale={0.9} spin={0.004}>
            <RenewArrow />
          </Pop>
          <Pop at={SEC.plan} out={SEC.done - 3} scale={0.72} spin={0} position={[-0.3, -0.2, 0]}>
            <PieChart at={[s(CUE.rfc), s(CUE.cfdi), s(CUE.modulos)]} />
          </Pop>
          <Pop at={SEC.done} out={SEC.cta} scale={0.9}>
            <Orb />
          </Pop>
        </Stage>
      )}

      {/* Closing / CTA */}
      <Sequence from={SEC.cta} layout="none">
        <AbsoluteFill style={{ alignItems: "center" }}>
          <Stage top={0} height={1920} z={18}>
            <Pop at={0} spin={0} tilt={0}>
              <Floaters />
            </Pop>
          </Stage>
          <Stage top={170} height={420}>
            <Pop at={2} scale={1.1}>
              <Orb />
            </Pop>
          </Stage>
          <div style={{ position: "absolute", top: 640 }}>
            <Enter delay={4} from={0.85}>
              <Img src={staticFile("brand/fispal-logo.png")} style={{ width: 640 }} />
            </Enter>
          </div>
          <div style={{ position: "absolute", top: 1000 }}>
            <Enter delay={10}>
              <div
                style={{
                  background: C.accent,
                  color: C.white,
                  fontFamily: "Poppins",
                  fontWeight: 700,
                  fontSize: 46,
                  borderRadius: 999,
                  padding: "30px 64px",
                  boxShadow: "0 18px 40px rgba(32,217,157,.35)",
                }}
              >
                Conoce lo nuevo →
              </div>
            </Enter>
          </div>
          <div style={{ position: "absolute", top: 1190 }}>
            <Enter delay={s(CUE.url) - SEC.cta}>
              <Pill style={{ textTransform: "none", fontSize: 30 }}>fispal.mx</Pill>
            </Enter>
          </div>
        </AbsoluteFill>
      </Sequence>

      <Subtitles pages={PAGES} />

      {hasVoice && <Audio src={staticFile(VOICE)} />}
      <Audio
        src={staticFile("music/cuenta.wav")}
        volume={(f) =>
          interpolate(f, [0, 4, CUENTA_DURATION - 30, CUENTA_DURATION], [0, 0.3, 0.3, 0], clamp)
        }
      />
      {SFX.map((fx, i) => (
        <Sequence key={`sfx-${i}`} from={Math.max(0, fx.at)} durationInFrames={30} layout="none">
          <Audio src={staticFile(`sfx/${fx.file}.wav`)} volume={fx.volume} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
