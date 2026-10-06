import { Audio } from "@remotion/media";
import React, { useEffect, useState } from "react";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  getStaticFiles,
  interpolate,
  Sequence,
  staticFile,
} from "remotion";
import {
  S1Logo,
  S2Contratar,
  S3Personaliza,
  S4Selector,
  S5Ahorro,
  S6Claims,
  S7Cierre,
} from "./scenes";
import { Subtitles } from "./Subtitles";
import { fontsLoaded, s } from "./theme";
import { Background, Scene } from "./ui";

export const REEL_DURATION = s(27);
const VOICE = "audio/voz.wav";

// Scene cuts follow the voice-over phrases; consecutive scenes overlap by
// 2 frames so the blur cross-fade (estilo.md §5) has both layers on screen.
const SCENES = [
  { from: 0, to: s(1.9), C: S1Logo },
  { from: s(1.86), to: s(4.93), C: S2Contratar },
  { from: s(4.9), to: s(13.93), C: S3Personaliza },
  { from: s(13.87), to: s(16.56), C: S4Selector },
  { from: s(16.5), to: s(19.04), C: S5Ahorro },
  { from: s(19.0), to: s(22.75), C: S6Claims },
  { from: s(22.7), to: REEL_DURATION, C: S7Cierre },
];

const SFX: { file: string; at: number; volume: number }[] = [
  // whoosh on every scene change
  ...SCENES.slice(1).map((sc) => ({ file: "whoosh", at: sc.from - 4, volume: 0.35 })),
  // pops on elements that land
  { file: "pop", at: s(0.05), volume: 0.5 },
  { file: "pop", at: s(2.85), volume: 0.4 },
  { file: "pop", at: s(3.57), volume: 0.45 },
  ...[7.92, 8.91, 10.36, 11.43, 12.53].map((t) => ({ file: "pop", at: s(t), volume: 0.5 })),
  { file: "click", at: s(15.25), volume: 0.7 },
  { file: "click", at: s(15.89), volume: 0.7 },
  { file: "ding", at: s(17.04), volume: 0.3 },
  ...[19.06, 20.4, 21.42].map((t) => ({ file: "pop", at: s(t), volume: 0.45 })),
  { file: "click", at: s(4.14) + 2, volume: 0.6 },
  { file: "click", at: s(24.36) + 18, volume: 0.6 },
];

export const FispalReel: React.FC = () => {
  const [handle] = useState(() => delayRender("Loading fonts"));
  useEffect(() => {
    fontsLoaded.then(() => continueRender(handle));
  }, [handle]);

  const hasVoice = getStaticFiles().some((f) => f.name === VOICE);

  return (
    <AbsoluteFill>
      <Background />
      {SCENES.map(({ from, to, C }, i) => (
        <Sequence key={i} from={from} durationInFrames={to - from} name={`Escena ${i + 1}`}>
          <Scene duration={to - from} fadeIn={i > 0} fadeOut={i < SCENES.length - 1}>
            <C from={from} />
          </Scene>
        </Sequence>
      ))}
      <Subtitles />

      {hasVoice && <Audio src={staticFile(VOICE)} />}
      <Audio
        src={staticFile("music/bed.wav")}
        // music bed sits ~13 dB under the voice, fades out with the logo
        volume={(f) =>
          interpolate(f, [0, 10, REEL_DURATION - 30, REEL_DURATION], [0, 0.22, 0.22, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
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
