// Fispal reel "Control de tu información fiscal" (parrilla 2, reel 2): dark
// take on the Fispal look, Araceli's voice and a different, darker track.
import { Audio } from "@remotion/media";
import React, { useEffect, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, getStaticFiles, interpolate, Sequence, staticFile } from "remotion";
import { Subtitles } from "../fispal/Subtitles";
import { fontsLoaded, s } from "../fispal/theme";
import { Scene } from "../fispal/ui";
import { buildPages } from "./captions";
import { DarkBackground, S1Tiempo, S2Crece, S3Reto, S4Plataforma, S5MasMenos, S6Pregunta, S7Cta } from "./scenes";
import { CUE, VOICE_DURATION } from "./timeline";

export const CONTROL_DURATION = s(VOICE_DURATION + 1);
const VOICE = "audio/voz-control.wav";
const PAGES = buildPages(CONTROL_DURATION / 30);

const cut = (t: number) => s(t - 0.15);
const SCENES = [
  { from: 0, to: cut(CUE.cuando) + 2, C: S1Tiempo },
  { from: cut(CUE.cuando), to: cut(CUE.el) + 2, C: S2Crece },
  { from: cut(CUE.el), to: cut(CUE.con) + 2, C: S3Reto },
  { from: cut(CUE.con), to: cut(CUE.mas) + 2, C: S4Plataforma },
  { from: cut(CUE.mas), to: cut(CUE.pregunta) + 2, C: S5MasMenos },
  { from: cut(CUE.pregunta), to: cut(CUE.empieza) + 2, C: S6Pregunta },
  { from: cut(CUE.empieza), to: CONTROL_DURATION, C: S7Cta },
];

const SFX: { file: string; at: number; volume: number }[] = [
  ...SCENES.slice(1).map((sc) => ({ file: "whoosh", at: sc.from - 4, volume: 0.35 })),
  { file: "pop", at: 2, volume: 0.45 },
  ...[CUE.cfdi, CUE.reportes, CUE.archivos, CUE.consultas, CUE.revisiones].map((t) => ({ file: "pop", at: s(t), volume: 0.45 })),
  { file: "ding", at: s(CUE.control), volume: 0.25 },
  { file: "pop", at: s(CUE.tener) - 8, volume: 0.4 },
  ...[CUE.consultarla, CUE.organizarla, CUE.analizarla].map((t) => ({ file: "click", at: s(t), volume: 0.6 })),
  { file: "pop", at: s(CUE.fispal) - 4, volume: 0.5 },
  { file: "ding", at: s(CUE.plataforma), volume: 0.3 },
  ...[CUE.consulta, CUE.analisis, CUE.herramientas].map((t) => ({ file: "pop", at: s(t), volume: 0.45 })),
  { file: "ding", at: s(CUE.mas) + 30, volume: 0.25 },
  { file: "click", at: s(CUE.menos), volume: 0.5 },
  { file: "pop", at: s(CUE.pregunta), volume: 0.4 },
  { file: "pop", at: s(CUE.gratis) - 4, volume: 0.5 },
  { file: "click", at: s(CUE.url) + 4, volume: 0.6 },
];

export const ControlReel: React.FC = () => {
  const [handle] = useState(() => delayRender("Loading fonts"));
  useEffect(() => {
    fontsLoaded.then(() => continueRender(handle));
  }, [handle]);
  const hasVoice = getStaticFiles().some((f) => f.name === VOICE);
  return (
    <AbsoluteFill>
      <DarkBackground />
      {SCENES.map(({ from, to, C }, i) => (
        <Sequence key={i} from={from} durationInFrames={to - from} name={`Escena ${i + 1}`}>
          <Scene duration={to - from} fadeIn={i > 0} fadeOut={i < SCENES.length - 1}>
            <C from={from} />
          </Scene>
        </Sequence>
      ))}
      <Subtitles pages={PAGES} color="#FFFFFF" />
      {hasVoice && <Audio src={staticFile(VOICE)} />}
      <Audio
        src={staticFile("music/control.wav")}
        volume={(f) => interpolate(f, [0, 4, CONTROL_DURATION - 30, CONTROL_DURATION], [0, 0.28, 0.28, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />
      {SFX.map((fx, i) => (
        <Sequence key={`sfx-${i}`} from={Math.max(0, fx.at)} durationInFrames={30} layout="none">
          <Audio src={staticFile(`sfx/${fx.file}.wav`)} volume={fx.volume} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
