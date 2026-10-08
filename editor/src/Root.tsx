import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import { CUENTA_DURATION, CuentaReel } from "./cuenta/Reel";
import { FispalReel, REEL_DURATION } from "./fispal/Reel";
import { AlmacenamientoPost } from "./posts/Almacenamiento";
import { MODULOS_FRAMES, ModulosRfcCarousel } from "./posts/ModulosRFC";
import { VENVERS_FRAMES, VenversCard3D, VenversCarousel } from "./venvers/Carrusel";
import { VenversAsset } from "./venvers/Assets";
import { VenversIllus } from "./venvers/three";
import { calculateReelMetadata, VenversReel } from "./VenversReel";
import { calculateContraloria, ContraloriaReel } from "./contraloria/Reel";
import { TOTAL_FRAMES as CONTRALORIA_FRAMES } from "./contraloria/timings";
import { VENVERS_W_FRAMES, VenversCarouselWhite } from "./venvers/CarruselBlanco";
import { PERSONALIZA_FRAMES, PersonalizaCarousel, POST_H, POST_W } from "./posts/Personaliza";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <Composition
        id="FispalReel"
        component={FispalReel}
        durationInFrames={REEL_DURATION}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="FispalCuenta"
        component={CuentaReel}
        durationInFrames={CUENTA_DURATION}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="CarruselPersonaliza"
        component={PersonalizaCarousel}
        durationInFrames={PERSONALIZA_FRAMES}
        fps={30}
        width={POST_W}
        height={POST_H}
      />
      <Composition
        id="PostAlmacenamiento"
        component={AlmacenamientoPost}
        durationInFrames={60}
        fps={30}
        width={POST_W}
        height={POST_H}
      />
      <Composition
        id="CarruselModulosRFC"
        component={ModulosRfcCarousel}
        durationInFrames={MODULOS_FRAMES}
        fps={30}
        width={POST_W}
        height={POST_H}
      />
      <Composition
        id="CarruselVenvers"
        component={VenversCarousel}
        durationInFrames={VENVERS_FRAMES}
        fps={30}
        width={1080}
        height={1350}
      />
      <Composition
        id="CarruselVenversBlanco"
        component={VenversCarouselWhite}
        durationInFrames={VENVERS_W_FRAMES}
        fps={30}
        width={1080}
        height={1350}
      />
      <Composition
        id="VenversReel"
        component={VenversReel}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ voice: false, music: false, captions: [], extra: 0 }}
        calculateMetadata={calculateReelMetadata}
      />
      <Composition
        id="VenversContraloria"
        component={ContraloriaReel}
        durationInFrames={CONTRALORIA_FRAMES}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ voice: false, music: false }}
        calculateMetadata={calculateContraloria}
      />
      <Composition
        id="VenversIllus"
        component={VenversIllus}
        durationInFrames={60}
        fps={30}
        width={1000}
        height={1000}
        defaultProps={{ name: "planeta" }}
      />
      <Composition id="VenversCard3D" component={VenversCard3D} durationInFrames={60} fps={30} width={560} height={770} />
      <Composition
        id="VenversAsset"
        component={VenversAsset}
        durationInFrames={60}
        fps={30}
        width={1500}
        height={1350}
        defaultProps={{ name: "correo-1" }}
      />
    </>
  );
};
