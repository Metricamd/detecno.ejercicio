// Bling reel (1080 × 1920, 30 fps): Pixar-style stills from Magnific for the
// problem, then the Bling app and the CTA, all cut on the voice-over.
import { linearTiming, TransitionPresentationComponentProps, TransitionSeries } from "@remotion/transitions";
import React, { useEffect, useState } from "react";
import { AbsoluteFill, Audio, CalculateMetadataFunction, continueRender, delayRender, Easing, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { hasAsset } from "../components/ui";
import { POPPINS, poppinsReady } from "../theme";
import { BlingLogo, Clock, FallingInvoices, PhoneApp, Pic, Spark, Sticker, useShake } from "./parts";
import { B, H, SCENE, sec, TOTAL, W, wordAt } from "./theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const EASE = Easing.bezier(0.22, 1, 0.36, 1);
const OVERLAP = 12;
const VOICE = "bling/voz.mp3";
const MUSIC = "bling/music.wav";

// local frame inside a scene for a reel second
const at = (scene: number, s: number) => sec(s - scene);

/* ---------- Scene 1: notebook, hand writing, invoices fall ---------- */
const Escena1: React.FC = () => {
  const frame = useCurrentFrame();
  const fall = at(SCENE.s1, 3.3);
  const zoom = interpolate(frame, [0, sec(SCENE.s2)], [1.02, 1.14]);
  return (
    <AbsoluteFill style={{ background: B.cream, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `${useShake(fall + 4, 16, 22)} scale(${zoom})` }}>
        <Pic name="escena1" label="escena1.png · cuaderno + mano" style={{ width: W, height: H }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(30,27,75,.35) 0%, rgba(30,27,75,0) 30%)" }} />
      {hasAsset("bling/facturas.png") && (
        <Img src={staticFile("bling/facturas.png")} style={{ position: "absolute", left: 90, bottom: -40, width: 900, transformOrigin: "50% 100%", transform: `scale(${interpolate(frame, [fall + 6, fall + 40], [0, 1], { ...clamp, easing: EASE })})` }} />
      )}
      <FallingInvoices at={fall} count={16} floorY={1650} />
      <Sticker lines={["¿Anotando las ventas", "en cuaderno y", "cruzando los dedos?"]} at={6} size={70} style={{ position: "absolute", top: 270, left: 0, right: 0 }} />
    </AbsoluteFill>
  );
};

/* ---------- Scene 2: overwhelmed character, paper mountain, clock ---------- */
const Escena2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const len = sec(SCENE.s3 - SCENE.s2);
  const zoom = interpolate(frame, [0, len], [1.0, 1.12]);
  // the clock spins faster and faster
  const speed = interpolate(frame, [0, len], [6, 40], { ...clamp, easing: Easing.in(Easing.quad) });
  const clockIn = spring({ frame: frame - 14, fps, config: { damping: 10, stiffness: 140 } });
  const wobble = Math.sin(frame / 2.2) * interpolate(frame, [0, len], [2, 7]);
  const pile = interpolate(frame, [0, len], [0.45, 0.95], { ...clamp, easing: Easing.out(Easing.quad) });
  return (
    <AbsoluteFill style={{ background: B.cream, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        <Pic name="escena2" label="escena2.png · personaje agobiado" style={{ width: W, height: H }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(30,27,75,.35) 0%, rgba(30,27,75,0) 28%)" }} />
      {/* growing paper mountain, bottom corners */}
      {[{ x: -120, r: -8 }, { x: 640, r: 6 }].map((p, i) =>
        hasAsset("bling/facturas.png") ? (
          <Img key={i} src={staticFile("bling/facturas.png")} style={{ position: "absolute", left: p.x, bottom: -60, width: 560, transformOrigin: "50% 100%", transform: `scale(${pile}) rotate(${p.r}deg)` }} />
        ) : null,
      )}
      <div style={{ position: "absolute", right: 70, top: 640, transform: `scale(${clockIn}) rotate(${wobble}deg)` }}>
        <Clock size={270} speed={speed} />
      </div>
      <Sticker lines={["El desorden frena", "tu negocio y", "te quita tiempo"]} at={at(SCENE.s2, 6.1)} size={72} style={{ position: "absolute", top: 270, left: 0, right: 0 }} />
    </AbsoluteFill>
  );
};

/* ---------- Scene 3: Bling app syncing ---------- */
const Glows: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: `linear-gradient(165deg, ${B.coral} 0%, #FF7B4F 45%, ${B.sun} 120%)`, overflow: "hidden" }}>
      <div style={{ position: "absolute", width: 900, height: 900, left: -300 + Math.sin(frame / 50) * 60, top: -250, borderRadius: "50%", background: "#FFD9A8", filter: "blur(160px)", opacity: 0.6 }} />
      <div style={{ position: "absolute", width: 800, height: 800, right: -320, bottom: -200 + Math.cos(frame / 60) * 60, borderRadius: "50%", background: "#FF3D6E", filter: "blur(180px)", opacity: 0.45 }} />
      {Array.from({ length: 14 }).map((_, i) => {
        const x = (i * 263) % 1000 + 40;
        const y = (i * 419) % 1800 + 60;
        const tw = 0.5 + 0.5 * Math.sin(frame / 7 + i * 1.7);
        return <Spark key={i} size={18 + (i % 4) * 12} color="#FFF5D6" style={{ position: "absolute", left: x, top: y, opacity: 0.35 + tw * 0.6, transform: `scale(${0.6 + tw * 0.5}) rotate(${frame + i * 20}deg)` }} />;
      })}
    </AbsoluteFill>
  );
};

const CHECKS = [at(SCENE.s3, wordAt("ventas") + 0.25), at(SCENE.s3, wordAt("inventario", 1) + 0.3), at(SCENE.s3, wordAt("facturas", 1) + 0.3)];

const Escena3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rise = spring({ frame: frame - 4, fps, config: { damping: 13, stiffness: 90 } });
  const on = interpolate(frame, [at(SCENE.s3, 15.0), at(SCENE.s3, 15.5)], [0, 1], clamp);
  const synced = interpolate(frame, [CHECKS[2] + 6, CHECKS[2] + 18], [0, 1], clamp);
  const tilt = interpolate(frame, [0, sec(2)], [-16, -6], { ...clamp, easing: EASE }) + Math.sin(frame / 30) * 2;
  const swap = at(SCENE.s3, 20.5);
  const out1 = interpolate(frame, [swap - 8, swap], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Glows />
      <div style={{ position: "absolute", left: W / 2 - 280, top: 470, perspective: 1600 }}>
        <div style={{ transform: `translateY(${(1 - rise) * 900}px) rotateY(${tilt}deg) rotateX(5deg) scale(.86)`, transformOrigin: "50% 0" }}>
          <PhoneApp on={on} checks={CHECKS} synced={synced} />
        </div>
      </div>
      <div style={{ position: "absolute", top: 260, left: 0, right: 0, opacity: out1, transform: `scale(${0.9 + out1 * 0.1})` }}>
        <Sticker lines={["¡Llegó lo nuevo de Bling!"]} at={at(SCENE.s3, 14.0)} size={66} bg={B.sun} />
      </div>
      {frame >= swap - 2 && (
        <Sticker lines={["Ventas + Inventario + Facturas", "en un solo lugar"]} at={swap} size={52} style={{ position: "absolute", top: 260, left: 0, right: 0 }} />
      )}
    </AbsoluteFill>
  );
};

/* ---------- Scene 4: CTA ---------- */
const Escena4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const back = interpolate(frame, [0, 22], [0, 1], { ...clamp, easing: EASE });
  const logo = spring({ frame: frame - 6, fps, config: { damping: 9, stiffness: 150 } });
  const btn = spring({ frame: frame - at(SCENE.s4, 25.1), fps, config: { damping: 8, stiffness: 160 } });
  const pulse = 1 + Math.max(0, Math.sin((frame - at(SCENE.s4, 25.6)) / 5)) * 0.06 * (frame > at(SCENE.s4, 25.6) ? 1 : 0);
  const glow = 0.5 + 0.5 * Math.sin(frame / 5);
  const hand = spring({ frame: frame - at(SCENE.s4, 25.8), fps, config: { damping: 11, stiffness: 120 } });
  const bob = Math.sin(frame / 4.5) * 22;
  return (
    <AbsoluteFill style={{ background: B.cream, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${interpolate(frame, [0, sec(5.4)], [1.08, 1.0])})` }}>
        <Pic name="escena3" label="escena3.png · personaje feliz" style={{ width: W, height: H }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(255,246,236,.92) 0%, rgba(255,246,236,0) 32%, rgba(30,27,75,0) 55%, rgba(30,27,75,.55) 100%)" }} />
      {/* the app phone slides into the background */}
      <div style={{ position: "absolute", left: W / 2 - 280, top: 470, transformOrigin: "50% 50%", transform: `translate(${back * -330}px, ${back * 380}px) scale(${0.86 - back * 0.46}) rotate(${back * -10}deg)`, filter: `blur(${back * 3}px)`, opacity: 1 - back * 0.25 }}>
        <PhoneApp on={1} checks={[-99, -99, -99]} synced={1} />
      </div>
      <div style={{ position: "absolute", top: 270, left: 0, right: 0, display: "flex", justifyContent: "center", transform: `scale(${logo})` }}>
        <BlingLogo size={150} />
      </div>
      <Sticker lines={["Dale un respiro", "a tu negocio"]} at={14} size={70} style={{ position: "absolute", top: 460, left: 0, right: 0 }} />
      {/* CTA */}
      <div style={{ position: "absolute", top: 1170, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 34 }}>
        <div style={{ fontFamily: POPPINS, fontWeight: 800, fontSize: 46, color: B.white, textAlign: "center", lineHeight: 1.15, textShadow: "0 4px 18px rgba(30,27,75,.7)", opacity: btn, transform: `translateY(${(1 - btn) * 30}px)` }}>
          Haz clic en el link
          <br />y prueba Bling gratis
        </div>
        <div
          style={{
            fontFamily: POPPINS,
            fontWeight: 800,
            fontSize: 54,
            color: B.white,
            background: `linear-gradient(180deg, #FF7A52, ${B.coralDark})`,
            borderRadius: 999,
            padding: "26px 74px",
            border: `5px solid ${B.white}`,
            boxShadow: `0 10px 0 #A82A10, 0 0 ${40 + glow * 50}px ${10 + glow * 18}px rgba(255,201,60,${0.45 + glow * 0.35})`,
            transform: `scale(${btn * pulse})`,
          }}
        >
          ¡Pruébalo gratis!
        </div>
      </div>
      {/* hand pointing down at the button */}
      <div style={{ position: "absolute", right: 30, top: 900 + bob, opacity: hand, transform: `scale(${hand})` }}>
        {hasAsset("bling/mano.png") ? (
          <Img src={staticFile("bling/mano.png")} style={{ width: 170 }} />
        ) : (
          <div style={{ fontSize: 170, transform: "rotate(-15deg)" }}>👇</div>
        )}
      </div>
    </AbsoluteFill>
  );
};

/* ---------- transitions ---------- */
type P = TransitionPresentationComponentProps<Record<string, never>>;
const ZoomPush: React.FC<P> = ({ children, presentationDirection, presentationProgress }) => {
  const p = EASE(presentationProgress);
  return presentationDirection === "exiting" ? (
    <AbsoluteFill style={{ transform: `scale(${1 + p * 0.5})`, opacity: 1 - p, filter: `blur(${p * 10}px)` }}>{children}</AbsoluteFill>
  ) : (
    <AbsoluteFill style={{ transform: `scale(${0.85 + p * 0.15})`, opacity: Math.min(1, p * 2) }}>{children}</AbsoluteFill>
  );
};
const SwipeUp: React.FC<P> = ({ children, presentationDirection, presentationProgress }) => {
  const p = EASE(presentationProgress);
  return <AbsoluteFill style={{ transform: `translateY(${presentationDirection === "exiting" ? -p * H : (1 - p) * H}px)` }}>{children}</AbsoluteFill>;
};
const Fade: React.FC<P> = ({ children, presentationDirection, presentationProgress }) => (
  <AbsoluteFill style={{ opacity: presentationDirection === "exiting" ? 1 : presentationProgress }}>{children}</AbsoluteFill>
);
const pres = (component: React.FC<P>) => ({ component, props: {} as Record<string, never> });

const SCENES: { C: React.FC; from: number; to: number; next?: ReturnType<typeof pres> }[] = [
  { C: Escena1, from: SCENE.s1, to: SCENE.s2, next: pres(ZoomPush) },
  { C: Escena2, from: SCENE.s2, to: SCENE.s3, next: pres(SwipeUp) },
  { C: Escena3, from: SCENE.s3, to: SCENE.s4, next: pres(Fade) },
  { C: Escena4, from: SCENE.s4, to: SCENE.end },
];

/* ---------- sound effects (reel seconds) ---------- */
const ticks: number[] = [];
for (let t = SCENE.s2 + 0.2, gap = 0.5; t < SCENE.s3 - 0.15; t += gap, gap = Math.max(0.11, gap * 0.93)) ticks.push(t);
const SFX: [string, number, number][] = [
  ["crumple", 3.3, 0.9],
  ["error", 3.55, 0.7],
  ...ticks.map((t) => ["tick", t, 0.45] as [string, number, number]),
  ["swipe", SCENE.s3 - 0.15, 0.7],
  ["pop", SCENE.s3 + 0.35, 0.6],
  ["sparkle", 15.0, 0.6],
  ["sparkle", wordAt("bling"), 0.55],
  ["pop", wordAt("ventas") + 0.25, 0.6],
  ["pop", wordAt("inventario", 1) + 0.3, 0.6],
  ["pop", wordAt("facturas", 1) + 0.3, 0.6],
  ["sparkle", 20.5, 0.5],
  ["pop", SCENE.s4 + 0.2, 0.55],
  ["sparkle", 25.1, 0.6],
];

export type BlingProps = { voice: boolean };

export const BlingReel: React.FC<BlingProps> = ({ voice }) => {
  const [handle] = useState(() => delayRender("Poppins"));
  useEffect(() => {
    poppinsReady().then(() => continueRender(handle));
  }, [handle]);
  const duck = voice ? 0.16 : 0.4;
  return (
    <AbsoluteFill style={{ background: B.cream }}>
      <TransitionSeries>
        {SCENES.map(({ C, from, to, next }, i) => (
          <React.Fragment key={i}>
            <TransitionSeries.Sequence durationInFrames={sec(to) - sec(from) + (next ? OVERLAP : 0)} name={`Escena ${i + 1}`}>
              <C />
            </TransitionSeries.Sequence>
            {next && <TransitionSeries.Transition timing={linearTiming({ durationInFrames: OVERLAP })} presentation={next} />}
          </React.Fragment>
        ))}
      </TransitionSeries>
      {voice && (
        <Sequence from={sec(0.3)} layout="none">
          <Audio src={staticFile(VOICE)} />
        </Sequence>
      )}
      <Audio
        src={staticFile(MUSIC)}
        volume={(f) => interpolate(f, [0, 8, sec(26.3), sec(27), TOTAL - 20, TOTAL], [0, duck, duck, 0.55, 0.55, 0], clamp)}
      />
      {SFX.map(([name, t, v], i) => (
        <Sequence key={i} from={sec(t)} durationInFrames={sec(1.5)} layout="none">
          <Audio src={staticFile(`bling/sfx/${name}.wav`)} volume={v} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export const calculateBling: CalculateMetadataFunction<BlingProps> = async () => ({ props: { voice: hasAsset(VOICE) } });
