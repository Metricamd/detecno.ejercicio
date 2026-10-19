// Fispal reel "Conciliación de Pagos" (parrilla 2, reel 6): light mint canvas,
// page-flip transitions and its own motion language; same voice and
// subtitles (purple highlight so it reads on mint).
import { Audio } from "@remotion/media";
import React, { useEffect, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, getStaticFiles, interpolate, Sequence, staticFile } from "remotion";
import { Subtitles } from "../fispal/Subtitles";
import { fontsLoaded, s } from "../fispal/theme";
import { buildPages } from "./captions";
import { FlipScene, M, MintBackground, S1Par, S2Ciclo, S3Volumen, S4Conciliacion, S5MenosMas, S6Cta } from "./scenes";
import { CUE, VOICE_DURATION } from "./timeline";

export const CONCILIACION_DURATION = s(VOICE_DURATION + 1);
const VOICE = "audio/voz-conciliacion.wav";
const PAGES = buildPages(CONCILIACION_DURATION / 30);
const OVERLAP = 14;

const cut = (t: number) => s(t - 0.2);
const SCENES = [
  { from: 0, to: cut(CUE.cfdi), C: S1Par },
  { from: cut(CUE.cfdi), to: cut(CUE.cuando), C: S2Ciclo },
  { from: cut(CUE.cuando), to: cut(CUE.fispal), C: S3Volumen },
  { from: cut(CUE.fispal), to: cut(CUE.menos), C: S4Conciliacion },
  { from: cut(CUE.menos), to: cut(CUE.prueba), C: S5MenosMas },
  { from: cut(CUE.prueba), to: CONCILIACION_DURATION, C: S6Cta },
];

const SFX: { file: string; at: number; volume: number }[] = [
  ...SCENES.slice(1).map((sc) => ({ file: "whoosh", at: sc.from, volume: 0.35 })),
  { file: "pop", at: s(CUE.factura) - 6, volume: 0.45 },
  { file: "pop", at: s(CUE.pago) - 6, volume: 0.45 },
  { file: "pop", at: s(CUE.cruzando) - 4, volume: 0.5 },
  ...[CUE.cfdi, CUE.pagos, CUE.complementos, CUE.cruces].map((t) => ({ file: "pop", at: s(t), volume: 0.5 })),
  { file: "whoosh", at: s(CUE.repetir) - 6, volume: 0.3 },
  ...[0, 1, 2, 3, 4, 5].map((i) => ({ file: "click", at: s(CUE.volumen) - 14 + i * 6, volume: 0.25 })),
  { file: "pop", at: s(CUE.conciliacion), volume: 0.4 },
  ...[0, 1, 2, 3].map((i) => ({ file: "click", at: s(CUE.relaciona) + 16 + i * 8, volume: 0.5 })),
  { file: "pop", at: s(CUE.descargados) - 6, volume: 0.4 },
  { file: "ding", at: s(CUE.resultados), volume: 0.35 },
  { file: "pop", at: s(CUE.visibilidad) - 6, volume: 0.45 },
  { file: "pop", at: s(CUE.todavia) - 4, volume: 0.5 },
  { file: "ding", at: s(CUE.prueba) + 1, volume: 0.3 },
  { file: "click", at: s(CUE.url) + 4, volume: 0.6 },
];

export const ConciliacionReel: React.FC = () => {
  const [handle] = useState(() => delayRender("Loading fonts"));
  useEffect(() => {
    fontsLoaded.then(() => continueRender(handle));
  }, [handle]);
  const hasVoice = getStaticFiles().some((f) => f.name === VOICE);
  return (
    <AbsoluteFill>
      <MintBackground />
      {SCENES.map(({ from, to, C }, i) => {
        const last = i === SCENES.length - 1;
        const start = i === 0 ? from : from - OVERLAP / 2;
        const end = last ? to : to + OVERLAP / 2;
        return (
          <Sequence key={i} from={start} durationInFrames={end - start} name={`Escena ${i + 1}`}>
            <FlipScene duration={end - start} first={i === 0} last={last} overlap={OVERLAP}>
              <Sequence from={from - start} layout="none">
                <C from={from} />
              </Sequence>
            </FlipScene>
          </Sequence>
        );
      })}
      <Subtitles pages={PAGES} heroColor={M.purple} />
      {hasVoice && <Audio src={staticFile(VOICE)} />}
      <Audio
        src={staticFile("music/conciliacion.wav")}
        volume={(f) => interpolate(f, [0, 4, CONCILIACION_DURATION - 30, CONCILIACION_DURATION], [0, 0.28, 0.28, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />
      {SFX.map((fx, i) => (
        <Sequence key={`sfx-${i}`} from={Math.max(0, fx.at)} durationInFrames={30} layout="none">
          <Audio src={staticFile(`sfx/${fx.file}.wav`)} volume={fx.volume} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
