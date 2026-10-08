// Venvers reel — colors, fonts and layout constants.
import { loadFont } from "@remotion/fonts";
import { Easing, staticFile } from "remotion";

// Poppins is bundled in public/fonts (same files Google Fonts serves) so the
// render never depends on fonts.gstatic.com. With network access you can swap
// this for `loadFont` from "@remotion/google-fonts/Poppins".
export const POPPINS = "Poppins";
const fontsLoaded = Promise.all(
  ["300", "500", "600", "800"].map((weight) =>
    loadFont({ family: POPPINS, url: staticFile(`fonts/poppins-latin-${weight}-normal.woff2`), weight }),
  ),
);
export const poppinsReady = () => fontsLoaded;

export const W = 1080;
export const H = 1920;

// Instagram / TikTok UI: keep content inside these bounds.
export const SAFE = { top: 250, bottom: H - 350, side: 80 };

export const C = {
  bgFrom: "#0A0A3C",
  bgTo: "#1B1464",
  glow: "#7B4FE0",
  violet: "#6C3CE9",
  lilac: "#A78BFA",
  btnFrom: "#5B2EE0",
  btnTo: "#9B5CF6",
  white: "#FFFFFF",
  ok: "#22C55E",
  warn: "#FACC15",
  bad: "#EF4444",
  ink: "#16124A", // text on light cards
  muted: "#6B6F94",
};

export const GLASS = {
  dark: {
    background: "rgba(255,255,255,0.12)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.3)",
    borderRadius: 28,
    boxShadow: "0 30px 60px rgba(108,60,233,0.35)",
  },
  light: {
    background: "rgba(255,255,255,0.85)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.3)",
    borderRadius: 28,
    boxShadow: "0 30px 60px rgba(108,60,233,0.35)",
  },
} as const;

export const ISO = "perspective(2000px) rotateX(55deg) rotateZ(-35deg)";

// Entrance easing (never linear).
export const EASE = Easing.bezier(0.16, 1, 0.3, 1);
export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
