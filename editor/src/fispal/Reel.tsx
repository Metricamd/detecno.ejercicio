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
import { CUE, VOICE_DURATION } from "./timeline";
import { Background, Scene } from "./ui";

// Voice-over + 1 s hold on the closing logo.
export const REEL_DURATION = s(VOICE_DURATION + 1);
const VOICE = "audio/voz.wav";

// Scene cuts follow the voice-over phrases; consecutive scenes overlap by
// 2 frames so the blur cross-fade (estilo.md §5) has both layers on screen.
const cut = (t: number) => s(t - 0.15);
const SCENES = [
  { from: 0, to: cut(CUE.llego) + 2, C: S1Logo },
  { from: cut(CUE.llego), to: cut(CUE.personaliza) + 2, C: S2Contratar },
  { from: cut(CUE.personaliza), to: cut(CUE.elige) + 2, C: S3Personaliza },
  { from: cut(CUE.elige), to: cut(CUE.y) + 2, C: S4Selector },
  { from: cut(CUE.y), to: cut(CUE.masFlex) + 2, C: S5Ahorro },
  { from: cut(CUE.masFlex), to: cut(CUE.conoce) + 2, C: S6Claims },
  { from: cut(CUE.conoce), to: REEL_DURATION, C: S7Cierre },
];

const SFX: { file: string; at: number; volume: number }[] = [
  // whoosh on every scene change
  ...SCENES.slice(1).map((sc) => ({ file: "whoosh", at: sc.from - 4, volume: 0.35 })),
  // pops on elements that land
  { file: "pop", at: 2, volume: 0.5 },
  { file: "pop", at: s(CUE.contratar), volume: 0.4 },
  { file: "pop", at: s(CUE.gestionar), volume: 0.45 },
  ...[CUE.cfdi, CUE.rfc, CUE.modulos, CUE.colaboradores, CUE.integraciones].map((t) => ({
    file: "pop",
    at: s(t),
    volume: 0.5,
  })),
  { file: "ding", at: s(CUE.integraciones) + 30, volume: 0.25 },
  { file: "click", at: s(CUE.mensual), volume: 0.7 },
  { file: "click", at: s(CUE.anual), volume: 0.7 },
  { file: "ding", at: s(CUE.veinte), volume: 0.3 },
  ...[CUE.masFlex, CUE.masControl, CUE.masFispal].map((t) => ({ file: "pop", at: s(t), volume: 0.45 })),
  { file: "click", at: s(CUE.gestionar) + 20, volume: 0.6 },
  { file: "click", at: s(CUE.url) + 18, volume: 0.6 },
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
      <Subtitles end={REEL_DURATION / 30} />

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
