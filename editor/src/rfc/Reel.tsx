// Fispal reel "Múltiples RFC" (parrilla 2, reel 5): brand-purple gradient,
// lift transitions and its own motion language, visuals centred in the band
// between the safe area and the subtitles; same voice and subtitles.
import { Audio } from "@remotion/media";
import React, { useEffect, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, getStaticFiles, interpolate, Sequence, staticFile } from "remotion";
import { Subtitles } from "../fispal/Subtitles";
import { fontsLoaded, s } from "../fispal/theme";
import { buildPages } from "./captions";
import { LiftScene, PurpleBackground, S1Tres, S2Mas, S3Multiplicar, S4Cuenta, S5Hub, S6Pregunta, S7Cta } from "./scenes";
import { CUE, VOICE_DURATION } from "./timeline";

export const RFC_DURATION = s(VOICE_DURATION + 1);
const VOICE = "audio/voz-rfc.wav";
const PAGES = buildPages(RFC_DURATION / 30);
const OVERLAP = 12;

const cut = (t: number) => s(t - 0.2);
const SCENES = [
  { from: 0, to: cut(CUE.mas), C: S1Tres },
  { from: cut(CUE.mas), to: cut(CUE.pero), C: S2Mas },
  { from: cut(CUE.pero), to: cut(CUE.fispal), C: S3Multiplicar },
  { from: cut(CUE.fispal), to: cut(CUE.varias), C: S4Cuenta },
  { from: cut(CUE.varias), to: cut(CUE.tu), C: S5Hub },
  { from: cut(CUE.tu), to: cut(CUE.empieza), C: S6Pregunta },
  { from: cut(CUE.empieza), to: RFC_DURATION, C: S7Cta },
];

const SFX: { file: string; at: number; volume: number }[] = [
  ...SCENES.slice(1).map((sc) => ({ file: "whoosh", at: sc.from - 2, volume: 0.35 })),
  ...[0, 1, 2].map((i) => ({ file: "pop", at: 2 + i * 5, volume: 0.45 })),
  { file: "click", at: s(CUE.rfc), volume: 0.4 },
  { file: "whoosh", at: s(CUE.lugares), volume: 0.25 },
  { file: "pop", at: s(CUE.lugares) + 4, volume: 0.55 },
  ...[CUE.mas + 0.13, CUE.cfdi, CUE.informacion, CUE.usuarios].map((t) => ({ file: "pop", at: s(t), volume: 0.45 })),
  ...[0, 2, 4, 6, 8].map((i) => ({ file: "click", at: s(CUE.donde) - 8 + i * 3, volume: 0.3 })),
  { file: "pop", at: s(CUE.multiplicar) - 6, volume: 0.55 },
  { file: "ding", at: s(CUE.multiplicar) + 14, volume: 0.3 },
  ...[0, 1, 2].map((i) => ({ file: "click", at: s(CUE.multiples) + 4 + i * 14, volume: 0.5 })),
  { file: "pop", at: s(CUE.cuenta) - 2, volume: 0.5 },
  { file: "ding", at: s(CUE.centralizada) + 4, volume: 0.35 },
  { file: "click", at: s(CUE.rfcQ) + 2, volume: 0.6 },
  { file: "pop", at: s(CUE.gratis) - 4, volume: 0.5 },
  { file: "click", at: s(CUE.url) + 4, volume: 0.6 },
];

export const RfcReel: React.FC = () => {
  const [handle] = useState(() => delayRender("Loading fonts"));
  useEffect(() => {
    fontsLoaded.then(() => continueRender(handle));
  }, [handle]);
  const hasVoice = getStaticFiles().some((f) => f.name === VOICE);
  return (
    <AbsoluteFill>
      <PurpleBackground />
      {SCENES.map(({ from, to, C }, i) => {
        const last = i === SCENES.length - 1;
        const end = last ? to : to + OVERLAP;
        return (
          <Sequence key={i} from={from} durationInFrames={end - from} name={`Escena ${i + 1}`}>
            <LiftScene duration={end - from} first={i === 0} last={last} overlap={OVERLAP}>
              <C from={from} />
            </LiftScene>
          </Sequence>
        );
      })}
      <Subtitles pages={PAGES} color="#FFFFFF" />
      {hasVoice && <Audio src={staticFile(VOICE)} />}
      <Audio
        src={staticFile("music/rfc.wav")}
        volume={(f) => interpolate(f, [0, 4, RFC_DURATION - 30, RFC_DURATION], [0, 0.28, 0.28, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />
      {SFX.map((fx, i) => (
        <Sequence key={`sfx-${i}`} from={Math.max(0, fx.at)} durationInFrames={30} layout="none">
          <Audio src={staticFile(`sfx/${fx.file}.wav`)} volume={fx.volume} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
