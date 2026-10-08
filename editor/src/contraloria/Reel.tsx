// Venvers "Contraloría" reel (1080 × 1920): white canvas, purple gradient
// circles, Araceli's voice-over driving every cut and headline word.
import { linearTiming, TransitionPresentationComponentProps, TransitionSeries } from "@remotion/transitions";
import React, { useEffect, useState } from "react";
import { AbsoluteFill, Audio, CalculateMetadataFunction, continueRender, delayRender, interpolate, Sequence, staticFile } from "remotion";
import { hasAsset } from "../components/ui";
import { EASE, poppinsReady } from "../theme";
import { LightBackground } from "./kit";
import { Auditoria } from "./scenes/Auditoria";
import { Cta } from "./scenes/Cta";
import { Historial } from "./scenes/Historial";
import { Hook } from "./scenes/Hook";
import { Recibe } from "./scenes/Recibe";
import { Trazabilidad } from "./scenes/Trazabilidad";
import { Visibilidad } from "./scenes/Visibilidad";
import { OVERLAP, SCENE_AT, sec, TOTAL_FRAMES, VOICE_AT } from "./timings";

const VOICE = "contraloria/voz.mp3";
const MUSIC = "contraloria/music.mp3";

const SCENES: { C: React.FC; from: number; to: number }[] = [
  { C: Hook, from: SCENE_AT.hook, to: SCENE_AT.recibe },
  { C: Recibe, from: SCENE_AT.recibe, to: SCENE_AT.visibilidad },
  { C: Visibilidad, from: SCENE_AT.visibilidad, to: SCENE_AT.trazabilidad },
  { C: Trazabilidad, from: SCENE_AT.trazabilidad, to: SCENE_AT.historial },
  { C: Historial, from: SCENE_AT.historial, to: SCENE_AT.auditoria },
  { C: Auditoria, from: SCENE_AT.auditoria, to: SCENE_AT.cta },
  { C: Cta, from: SCENE_AT.cta, to: SCENE_AT.end },
];

// Short vertical slide + fade between scenes.
const FadeSlide: React.FC<TransitionPresentationComponentProps<Record<string, never>>> = ({ children, presentationDirection, presentationProgress }) => {
  const p = EASE(presentationProgress);
  const out = presentationDirection === "exiting";
  return <AbsoluteFill style={out ? { opacity: 1 - p, transform: `translateY(${-p * 70}px)` } : { opacity: p, transform: `translateY(${(1 - p) * 70}px)` }}>{children}</AbsoluteFill>;
};
const fadeSlide = { component: FadeSlide, props: {} as Record<string, never> };
const timing = linearTiming({ durationInFrames: OVERLAP });

export type ContraloriaProps = { voice: boolean; music: boolean };

export const ContraloriaReel: React.FC<ContraloriaProps> = ({ voice, music }) => {
  const [handle] = useState(() => delayRender("Poppins"));
  useEffect(() => {
    poppinsReady().then(() => continueRender(handle));
  }, [handle]);
  return (
    <AbsoluteFill>
      <LightBackground />
      <TransitionSeries>
        {SCENES.map(({ C, from, to }, i) => {
          const last = i === SCENES.length - 1;
          return (
            <React.Fragment key={i}>
              {/* scenes are lengthened by OVERLAP so each one starts at its SCENE_AT time */}
              <TransitionSeries.Sequence durationInFrames={sec(to) - sec(from) + (last ? 0 : OVERLAP)} name={C.name}>
                <C />
              </TransitionSeries.Sequence>
              {!last && <TransitionSeries.Transition timing={timing} presentation={fadeSlide} />}
            </React.Fragment>
          );
        })}
      </TransitionSeries>
      {voice && (
        <Sequence from={sec(VOICE_AT)} layout="none">
          <Audio src={staticFile(VOICE)} />
        </Sequence>
      )}
      {music && (
        <Audio
          src={staticFile(MUSIC)}
          volume={(f) => interpolate(f, [0, 10, TOTAL_FRAMES - 30, TOTAL_FRAMES], [0, voice ? 0.15 : 0.45, voice ? 0.15 : 0.45, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
        />
      )}
    </AbsoluteFill>
  );
};

export const calculateContraloria: CalculateMetadataFunction<ContraloriaProps> = async () => ({
  props: { voice: hasAsset(VOICE), music: hasAsset(MUSIC) },
});
