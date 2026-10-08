// Venvers reel (1080 × 1920, 30 fps): Portal de proveedores.
import { Caption } from "@remotion/captions";
import { getAudioDurationInSeconds } from "@remotion/media-utils";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { springTiming, TransitionPresentation, TransitionPresentationComponentProps, TransitionSeries } from "@remotion/transitions";
import React, { useEffect, useState } from "react";
import { AbsoluteFill, Audio, CalculateMetadataFunction, continueRender, delayRender, interpolate, staticFile } from "remotion";
import { Captions, estimateCaptions } from "./components/Captions";
import { Background, hasAsset } from "./components/ui";
import { Beneficios } from "./scenes/Beneficios";
import { Cta } from "./scenes/Cta";
import { Hook } from "./scenes/Hook";
import { Marca } from "./scenes/Marca";
import { Problema } from "./scenes/Problema";
import { Seguimiento } from "./scenes/Seguimiento";
import { Visibilidad } from "./scenes/Visibilidad";
import { poppinsReady } from "./theme";
import { FPS, REEL_FRAMES, SCENES, TRANSITION } from "./timings";

export type ReelProps = { voice: boolean; music: boolean; captions: Caption[]; extra: number };

/* zoom-through: the outgoing scene scales up and blurs away */
const ZoomThrough: React.FC<TransitionPresentationComponentProps<Record<string, never>>> = ({ children, presentationDirection, presentationProgress: p }) => {
  const out = presentationDirection === "exiting";
  const style: React.CSSProperties = out
    ? { transform: `scale(${1 + p * 0.2})`, filter: `blur(${p * 18}px)`, opacity: 1 - p }
    : { opacity: interpolate(p, [0, 0.35], [0, 1], { extrapolateRight: "clamp" }) };
  return <AbsoluteFill style={style}>{children}</AbsoluteFill>;
};
const zoomThrough = () => ({ component: ZoomThrough, props: {} as Record<string, never> });

// Vertical short slide + fade between regular scenes.
const FadeSlide: React.FC<TransitionPresentationComponentProps<Record<string, never>>> = ({ children, presentationDirection, presentationProgress: p }) => {
  const out = presentationDirection === "exiting";
  const style: React.CSSProperties = out ? { opacity: 1 - p, transform: `translateY(${-p * 80}px)` } : { opacity: p, transform: `translateY(${(1 - p) * 80}px)` };
  return <AbsoluteFill style={style}>{children}</AbsoluteFill>;
};
const fadeSlide = () => ({ component: FadeSlide, props: {} as Record<string, never> });

// Transition after scene i: zoom-through into the brand reveal, otherwise
// short vertical slides / fades.
type AnyPresentation = TransitionPresentation<Record<string, unknown>>;
const presentationFor = (i: number): AnyPresentation =>
  (i === 1 ? zoomThrough() : i === 4 ? fade() : i === 5 ? slide({ direction: "from-bottom" }) : fadeSlide()) as unknown as AnyPresentation;

const timing = springTiming({ config: { damping: 200 }, durationInFrames: TRANSITION });

const ORDER = [
  { C: Hook, d: SCENES.hook.dur },
  { C: Problema, d: SCENES.problema.dur },
  { C: Marca, d: SCENES.marca.dur },
  { C: Seguimiento, d: SCENES.seguimiento.dur },
  { C: Visibilidad, d: SCENES.visibilidad.dur },
  { C: Beneficios, d: SCENES.beneficios.dur },
  { C: Cta, d: SCENES.cta.dur },
];

export const VenversReel: React.FC<ReelProps> = ({ voice, music, captions, extra }) => {
  const [handle] = useState(() => delayRender("Poppins"));
  useEffect(() => {
    poppinsReady().then(() => continueRender(handle));
  }, [handle]);
  return (
    <AbsoluteFill>
      <Background />
      <TransitionSeries>
        {ORDER.map(({ C, d }, i) => {
          const last = i === ORDER.length - 1;
          return (
            <React.Fragment key={i}>
              <TransitionSeries.Sequence durationInFrames={d + (last ? extra : TRANSITION)} name={C.name}>
                <C />
              </TransitionSeries.Sequence>
              {!last && <TransitionSeries.Transition timing={timing} presentation={presentationFor(i)} />}
            </React.Fragment>
          );
        })}
      </TransitionSeries>
      {voice && <Captions captions={captions} />}
      {voice && <Audio src={staticFile("voiceover.mp3")} />}
      {music && <Audio src={staticFile("music.mp3")} volume={(f) => interpolate(f, [0, 10, REEL_FRAMES + extra - 30, REEL_FRAMES + extra], [0, voice ? 0.15 : 0.5, voice ? 0.15 : 0.5, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />}
    </AbsoluteFill>
  );
};

// Fit the duration to voiceover.mp3 when it exists and pick up a real
// transcription from public/captions.json if present.
export const calculateReelMetadata: CalculateMetadataFunction<ReelProps> = async () => {
  const voice = hasAsset("voiceover.mp3");
  const music = hasAsset("music.mp3");
  let extra = 0;
  let captions = estimateCaptions();
  if (voice) {
    const sec = await getAudioDurationInSeconds(staticFile("voiceover.mp3"));
    extra = Math.max(0, Math.ceil((sec + 0.8) * FPS) - REEL_FRAMES);
    if (hasAsset("captions.json")) captions = await fetch(staticFile("captions.json")).then((r) => r.json());
  }
  return { durationInFrames: REEL_FRAMES + extra, props: { voice, music, captions, extra } };
};
