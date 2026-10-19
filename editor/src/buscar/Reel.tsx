// Fispal reel "¿Dónde está tu CFDI?" (parrilla 2): same look as the first
// Fispal reels (estilo.md) — light background, glass illustrations, Araceli's
// voice and word-by-word subtitles.
import { Audio } from "@remotion/media";
import React, { useEffect, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, getStaticFiles, interpolate, Sequence, staticFile } from "remotion";
import { Subtitles } from "../fispal/Subtitles";
import { fontsLoaded, s } from "../fispal/theme";
import { Background, Scene } from "../fispal/ui";
import { buildPages } from "./captions";
import { S1Hook, S2Tipos, S3Donde, S4Fispal, S5AntesAhora, S6Cta } from "./scenes";
import { CUE, VOICE_DURATION } from "./timeline";

export const BUSCAR_DURATION = s(VOICE_DURATION + 1);
const VOICE = "audio/voz-buscar.wav";
const PAGES = buildPages(BUSCAR_DURATION / 30);

const cut = (t: number) => s(t - 0.15);
const SCENES = [
  { from: 0, to: cut(CUE.cfdi2) + 2, C: S1Hook },
  { from: cut(CUE.cfdi2), to: cut(CUE.y) + 2, C: S2Tipos },
  { from: cut(CUE.y), to: cut(CUE.fispal) + 2, C: S3Donde },
  { from: cut(CUE.fispal), to: cut(CUE.lo) + 2, C: S4Fispal },
  { from: cut(CUE.lo), to: cut(CUE.comienza) + 2, C: S5AntesAhora },
  { from: cut(CUE.comienza), to: BUSCAR_DURATION, C: S6Cta },
];

const crit = s(CUE.distintos);
const SFX: { file: string; at: number; volume: number }[] = [
  ...SCENES.slice(1).map((sc) => ({ file: "whoosh", at: sc.from - 4, volume: 0.35 })),
  { file: "pop", at: 2, volume: 0.5 },
  { file: "pop", at: s(CUE.cfdi), volume: 0.5 },
  { file: "pop", at: s(CUE.historia) - 4, volume: 0.35 },
  ...[CUE.emitidos, CUE.recibidos, CUE.pagos, CUE.nomina].map((t) => ({ file: "pop", at: s(t), volume: 0.5 })),
  { file: "ding", at: s(CUE.crece), volume: 0.25 },
  { file: "pop", at: s(CUE.donde) - 2, volume: 0.55 },
  { file: "pop", at: s(CUE.concentra), volume: 0.4 },
  { file: "click", at: s(CUE.consultarlos), volume: 0.6 },
  ...[0, 1, 2, 3].map((i) => ({ file: "click", at: crit + i * 7, volume: 0.6 })),
  { file: "ding", at: s(CUE.criterios) + 14, volume: 0.35 },
  { file: "pop", at: s(CUE.ahora) - 2, volume: 0.5 },
  { file: "ding", at: s(CUE.lugar), volume: 0.3 },
  { file: "click", at: s(CUE.url) + 4, volume: 0.6 },
];

export const BuscarReel: React.FC = () => {
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
      <Subtitles pages={PAGES} />
      {hasVoice && <Audio src={staticFile(VOICE)} />}
      <Audio
        src={staticFile("music/buscar.wav")}
        volume={(f) => interpolate(f, [0, 4, BUSCAR_DURATION - 30, BUSCAR_DURATION], [0, 0.3, 0.3, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />
      {SFX.map((fx, i) => (
        <Sequence key={`sfx-${i}`} from={Math.max(0, fx.at)} durationInFrames={30} layout="none">
          <Audio src={staticFile(`sfx/${fx.file}.wav`)} volume={fx.volume} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
