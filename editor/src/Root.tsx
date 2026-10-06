import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import { FispalReel, REEL_DURATION } from "./fispal/Reel";

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
    </>
  );
};
