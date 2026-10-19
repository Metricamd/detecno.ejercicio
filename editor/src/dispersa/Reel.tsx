// Fispal reel "Información dispersa" (parrilla 2, reel 3): blue → green
// gradient (the green of the dot on the "i"), circle-wipe transitions and its
// own motion language; same voice, subtitles and brand elements as reels 1–2.
import { Audio } from "@remotion/media";
import React, { useEffect, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, getStaticFiles, interpolate, Sequence, staticFile } from "remotion";
import { Subtitles } from "../fispal/Subtitles";
import { fontsLoaded, s } from "../fispal/theme";
import { buildPages } from "./captions";
import { BlueGreenBackground, S1Archivos, S2Deck, S3Investigacion, S4Embudo, S5Visibilidad, S6Cta, WipeScene } from "./scenes";
import { CUE, VOICE_DURATION } from "./timeline";

export const DISPERSA_DURATION = s(VOICE_DURATION + 1);
const VOICE = "audio/voz-dispersa.wav";
const PAGES = buildPages(DISPERSA_DURATION / 30);
const OVERLAP = 12;

const cut = (t: number) => s(t - 0.2);
// each wipe opens from a different point of the screen
const SCENES = [
  { from: 0, to: cut(CUE.un), C: S1Archivos, ox: 50, oy: 45 },
  { from: cut(CUE.un), to: cut(CUE.cuando), C: S2Deck, ox: 85, oy: 15 },
  { from: cut(CUE.cuando), to: cut(CUE.fispal), C: S3Investigacion, ox: 15, oy: 50 },
  { from: cut(CUE.fispal), to: cut(CUE.menos), C: S4Embudo, ox: 50, oy: 20 },
  { from: cut(CUE.menos), to: cut(CUE.prueba), C: S5Visibilidad, ox: 85, oy: 70 },
  { from: cut(CUE.prueba), to: DISPERSA_DURATION, C: S6Cta, ox: 50, oy: 60 },
];

const SFX: { file: string; at: number; volume: number }[] = [
  ...SCENES.slice(1).map((sc) => ({ file: "whoosh", at: sc.from - 2, volume: 0.35 })),
  ...[0, 1, 2, 3, 4, 5, 6, 7].map((i) => ({ file: "click", at: s(CUE.abrir) - 6 + i * 7, volume: 0.35 })),
  { file: "pop", at: s(CUE.haz) - 4, volume: 0.5 },
  ...[CUE.excel, CUE.carpeta, CUE.xml, CUE.reporte].map((t) => ({ file: "pop", at: s(t) - 3, volume: 0.5 })),
  { file: "ding", at: s(CUE.cruzar), volume: 0.25 },
  { file: "whoosh", at: s(CUE.dispersa) - 4, volume: 0.25 },
  { file: "pop", at: s(CUE.investigacion) - 6, volume: 0.4 },
  { file: "pop", at: s(CUE.fispal), volume: 0.5 },
  ...[0, 1, 2, 3, 4].map((i) => ({ file: "click", at: s(CUE.filtros) - 10 + i * 5 + 12, volume: 0.45 })),
  { file: "ding", at: s(CUE.criterios) + 6, volume: 0.35 },
  { file: "pop", at: s(CUE.dispersos) + 8, volume: 0.45 },
  { file: "ding", at: s(CUE.visibilidad) + 10, volume: 0.25 },
  { file: "pop", at: s(CUE.gratis) - 4, volume: 0.5 },
  { file: "click", at: s(CUE.url) + 4, volume: 0.6 },
];

export const DispersaReel: React.FC = () => {
  const [handle] = useState(() => delayRender("Loading fonts"));
  useEffect(() => {
    fontsLoaded.then(() => continueRender(handle));
  }, [handle]);
  const hasVoice = getStaticFiles().some((f) => f.name === VOICE);
  return (
    <AbsoluteFill>
      <BlueGreenBackground />
      {SCENES.map(({ from, to, C, ox, oy }, i) => {
        const end = i < SCENES.length - 1 ? to + OVERLAP : to;
        return (
          <Sequence key={i} from={from} durationInFrames={end - from} name={`Escena ${i + 1}`}>
            <WipeScene duration={end - from} first={i === 0} ox={ox} oy={oy}>
              <C from={from} />
            </WipeScene>
          </Sequence>
        );
      })}
      <Subtitles pages={PAGES} color="#FFFFFF" />
      {hasVoice && <Audio src={staticFile(VOICE)} />}
      <Audio
        src={staticFile("music/dispersa.wav")}
        volume={(f) => interpolate(f, [0, 4, DISPERSA_DURATION - 30, DISPERSA_DURATION], [0, 0.28, 0.28, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />
      {SFX.map((fx, i) => (
        <Sequence key={`sfx-${i}`} from={Math.max(0, fx.at)} durationInFrames={30} layout="none">
          <Audio src={staticFile(`sfx/${fx.file}.wav`)} volume={fx.volume} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
