// Fispal reel "Accesos, usuarios y perfiles" (parrilla 2, reel 4): white
// canvas with mint and blue gradients, card-swipe transitions and its own
// motion language; same voice, subtitles and brand elements as reels 1–3.
import { Audio } from "@remotion/media";
import React, { useEffect, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, getStaticFiles, interpolate, Sequence, staticFile } from "remotion";
import { Subtitles } from "../fispal/Subtitles";
import { fontsLoaded, s } from "../fispal/theme";
import { buildPages } from "./captions";
import { MintBlueBackground, S1Algo, S2Matriz, S3Escudo, S4Perfiles, S5Candado, S6Cta, SwipeScene } from "./scenes";
import { CUE, VOICE_DURATION } from "./timeline";

export const ACCESOS_DURATION = s(VOICE_DURATION + 1);
const VOICE = "audio/voz-accesos.wav";
const PAGES = buildPages(ACCESOS_DURATION / 30);
const OVERLAP = 12;

const cut = (t: number) => s(t - 0.2);
const SCENES = [
  { from: 0, to: cut(CUE.no1), C: S1Algo },
  { from: cut(CUE.no1), to: cut(CUE.por), C: S2Matriz },
  { from: cut(CUE.por), to: cut(CUE.fispal), C: S3Escudo },
  { from: cut(CUE.fispal), to: cut(CUE.la), C: S4Perfiles },
  { from: cut(CUE.la), to: cut(CUE.unete), C: S5Candado },
  { from: cut(CUE.unete), to: ACCESOS_DURATION, C: S6Cta },
];

const SFX: { file: string; at: number; volume: number }[] = [
  ...SCENES.slice(1).map((sc) => ({ file: "whoosh", at: sc.from - 2, volume: 0.35 })),
  ...[0, 1, 2, 3, 4].map((i) => ({ file: "pop", at: 6 + i * 4, volume: 0.3 })),
  { file: "pop", at: s(CUE.hacer) - 6, volume: 0.45 },
  { file: "pop", at: s(CUE.sabes) - 2, volume: 0.55 },
  ...[CUE.no1 + 0.13, CUE.no2 + 0.07, CUE.no3 + 0.07].flatMap((t) => [0, 1, 2, 3].map((c) => ({ file: "click", at: s(t) + 6 + c * 4, volume: 0.3 }))),
  { file: "ding", at: s(CUE.control) + 6, volume: 0.3 },
  { file: "click", at: s(CUE.control) + 10, volume: 0.6 },
  ...[0, 1, 2].map((i) => ({ file: "pop", at: s(CUE.perfiles) - 8 + i * 5, volume: 0.45 })),
  ...[0, 1, 2, 3, 4].map((i) => ({ file: "click", at: s(CUE.funciones2) + i * 5, volume: 0.4 })),
  { file: "click", at: s(CUE.acceso) + 1, volume: 0.7 },
  { file: "ding", at: s(CUE.acceso) + 3, volume: 0.3 },
  { file: "pop", at: s(CUE.gratis) - 4, volume: 0.5 },
  { file: "click", at: s(CUE.url) + 4, volume: 0.6 },
];

export const AccesosReel: React.FC = () => {
  const [handle] = useState(() => delayRender("Loading fonts"));
  useEffect(() => {
    fontsLoaded.then(() => continueRender(handle));
  }, [handle]);
  const hasVoice = getStaticFiles().some((f) => f.name === VOICE);
  return (
    <AbsoluteFill>
      <MintBlueBackground />
      {SCENES.map(({ from, to, C }, i) => {
        const last = i === SCENES.length - 1;
        const end = last ? to : to + OVERLAP;
        return (
          <Sequence key={i} from={from} durationInFrames={end - from} name={`Escena ${i + 1}`}>
            <SwipeScene duration={end - from} first={i === 0} last={last} overlap={OVERLAP}>
              <C from={from} />
            </SwipeScene>
          </Sequence>
        );
      })}
      <Subtitles pages={PAGES} />
      {hasVoice && <Audio src={staticFile(VOICE)} />}
      <Audio
        src={staticFile("music/accesos.wav")}
        volume={(f) => interpolate(f, [0, 4, ACCESOS_DURATION - 30, ACCESOS_DURATION], [0, 0.3, 0.3, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />
      {SFX.map((fx, i) => (
        <Sequence key={`sfx-${i}`} from={Math.max(0, fx.at)} durationInFrames={30} layout="none">
          <Audio src={staticFile(`sfx/${fx.file}.wav`)} volume={fx.volume} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
