import { Composition } from "remotion";
import { DOC2SIGN_DURATION, Doc2SignVideo } from "./doc2sign/Video";
import { EXPPEDIFY_DURATION, ExppedifyVideo } from "./exppedify/Video";
import { MyComposition } from "./Composition";
import { CUENTA_DURATION, CuentaReel } from "./cuenta/Reel";
import { FispalReel, REEL_DURATION } from "./fispal/Reel";
import { BUSCAR_DURATION, BuscarReel } from "./buscar/Reel";
import { CONTROL_DURATION, ControlReel } from "./control/Reel";
import { DISPERSA_DURATION, DispersaReel } from "./dispersa/Reel";
import { ACCESOS_DURATION, AccesosReel } from "./accesos/Reel";
import { RFC_DURATION, RfcReel } from "./rfc/Reel";
import { CONCILIACION_DURATION, ConciliacionReel } from "./conciliacion/Reel";
import { C1_SLIDES, Carrusel1Sat, Carrusel1SatLight } from "./carruseles/C1Sat";
import { C2_SLIDES, Carrusel2Erp } from "./carruseles/C2Erp";
import { C3_SLIDES, Carrusel3Descarga } from "./carruseles/C3Descarga";
import { C4_SLIDES, Carrusel4Trabajo } from "./carruseles/C4Trabajo";
import { C5_SLIDES, Carrusel5Buscar } from "./carruseles/C5Buscar";
import { C6_SLIDES, Carrusel6Factura } from "./carruseles/C6Factura";
import { H as CAR_H, SLIDE_FRAMES as CAR_SF, W as CAR_W } from "./carruseles/kit";
import { AlmacenamientoPost } from "./posts/Almacenamiento";
import { MODULOS_FRAMES, ModulosRfcCarousel } from "./posts/ModulosRFC";
import { VENVERS_FRAMES, VenversCard3D, VenversCarousel } from "./venvers/Carrusel";
import { VenversAsset } from "./venvers/Assets";
import { VenversIllus } from "./venvers/three";
import { calculateReelMetadata, VenversReel } from "./VenversReel";
import { calculateContraloria, ContraloriaReel } from "./contraloria/Reel";
import { TOTAL_FRAMES as CONTRALORIA_FRAMES } from "./contraloria/timings";
import { VENVERS_W_FRAMES, VenversCarouselWhite } from "./venvers/CarruselBlanco";
import { BlingReel, calculateBling } from "./bling/Reel";
import { TOTAL as BLING_FRAMES } from "./bling/theme";
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
      <Composition id="Exppedify" component={ExppedifyVideo} durationInFrames={EXPPEDIFY_DURATION} fps={30} width={1080} height={1920} />
      <Composition id="Doc2Sign" component={Doc2SignVideo} durationInFrames={DOC2SIGN_DURATION} fps={30} width={1080} height={1920} />
      <Composition id="Carrusel6Factura" component={Carrusel6Factura} durationInFrames={C6_SLIDES.length * CAR_SF} fps={30} width={CAR_W} height={CAR_H} />
      <Composition id="Carrusel5Buscar" component={Carrusel5Buscar} durationInFrames={C5_SLIDES.length * CAR_SF} fps={30} width={CAR_W} height={CAR_H} />
      <Composition id="Carrusel4Trabajo" component={Carrusel4Trabajo} durationInFrames={C4_SLIDES.length * CAR_SF} fps={30} width={CAR_W} height={CAR_H} />
      <Composition id="Carrusel3Descarga" component={Carrusel3Descarga} durationInFrames={C3_SLIDES.length * CAR_SF} fps={30} width={CAR_W} height={CAR_H} />
      <Composition id="Carrusel2Erp" component={Carrusel2Erp} durationInFrames={C2_SLIDES.length * CAR_SF} fps={30} width={CAR_W} height={CAR_H} />
      <Composition id="Carrusel2SatClaro" component={Carrusel1SatLight} durationInFrames={C1_SLIDES.length * CAR_SF} fps={30} width={CAR_W} height={CAR_H} />
      <Composition id="Carrusel2Sat" component={Carrusel1Sat} durationInFrames={C1_SLIDES.length * CAR_SF} fps={30} width={CAR_W} height={CAR_H} />
      <Composition id="FispalConciliacion" component={ConciliacionReel} durationInFrames={CONCILIACION_DURATION} fps={30} width={1080} height={1920} />
      <Composition id="FispalRfc" component={RfcReel} durationInFrames={RFC_DURATION} fps={30} width={1080} height={1920} />
      <Composition id="FispalAccesos" component={AccesosReel} durationInFrames={ACCESOS_DURATION} fps={30} width={1080} height={1920} />
      <Composition id="FispalDispersa" component={DispersaReel} durationInFrames={DISPERSA_DURATION} fps={30} width={1080} height={1920} />
      <Composition id="FispalControl" component={ControlReel} durationInFrames={CONTROL_DURATION} fps={30} width={1080} height={1920} />
      <Composition id="FispalBuscar" component={BuscarReel} durationInFrames={BUSCAR_DURATION} fps={30} width={1080} height={1920} />
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
      <Composition id="BlingReel" component={BlingReel} durationInFrames={BLING_FRAMES} fps={30} width={1080} height={1920} defaultProps={{ voice: false }} calculateMetadata={calculateBling} />
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
