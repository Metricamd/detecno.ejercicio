import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const FPS = 30;
export const s = (seconds: number) => Math.round(seconds * FPS);

export const C = {
  bg: "#F8F9FF",
  text: "#131313",
  purple: "#250E94",
  accent: "#20D99D",
  accentDark: "#0FA877",
  white: "#FFFFFF",
  inactive: "#C9CDD8",
  lavender: "#E3E6FF",
  mint: "#D6F8EC",
};

export const FONT = "Poppins";
export const MONO = "JetBrains Mono";

const poppins = (weight: string, style = "normal") =>
  loadFont({
    family: FONT,
    url: staticFile(`fonts/poppins-latin-${weight}-${style}.woff2`),
    weight,
    style,
  });

export const fontsLoaded = Promise.all([
  poppins("500"),
  poppins("600"),
  poppins("700"),
  poppins("800"),
  poppins("600", "italic"),
  poppins("700", "italic"),
  loadFont({
    family: MONO,
    url: staticFile("fonts/jetbrains-mono-latin-500-normal.woff2"),
    weight: "500",
  }),
  loadFont({
    family: MONO,
    url: staticFile("fonts/jetbrains-mono-latin-700-normal.woff2"),
    weight: "700",
  }),
]);

export const cardShadow =
  "0 20px 60px rgba(37,14,148,.12), 0 2px 6px rgba(37,14,148,.06)";
