// Venvers reel — scene timings in frames (30 fps). Scene `from` values are
// the moments each scene is fully on screen; neighbouring scenes overlap by
// TRANSITION frames so the total stays at REEL_FRAMES.
export const FPS = 30;
export const TRANSITION = 15;

export const SCENES = {
  hook: { from: 0, dur: 120 },
  problema: { from: 120, dur: 120 },
  marca: { from: 240, dur: 90 },
  seguimiento: { from: 330, dur: 150 },
  visibilidad: { from: 480, dur: 150 },
  beneficios: { from: 630, dur: 150 },
  cta: { from: 780, dur: 120 },
} as const;

export const REEL_FRAMES = 900;

// Voice-over (Araceli, Mexican accent) split into clips so each phrase lands
// on its scene: audio [from, to] seconds → starts at `at` seconds of the reel.
export const VO_CLIPS = [
  { from: 0.1, to: 5.9, at: 1.0 }, // ¿Sabes cuánto le debes…? → hook + problema
  { from: 6.4, to: 13.6, at: 9.0 }, // Hazlo con Venvers… en un solo lugar → marca + seguimiento
  { from: 13.5, to: 18.3, at: 20.6 }, // para que planees tu flujo… → beneficios
  { from: 18.8, to: 23.1, at: 25.6 }, // Conoce más del ecosistema detecno… → CTA
];

// Script with estimated timings, used for captions only when
// public/voiceover-timing.json is missing.
export const VO_SCRIPT =
  "¿Sabes cuánto le debes a tus proveedores, qué facturas están por vencer y cuáles ya se pagaron? Hazlo con Venvers, nuestro portal de proveedores da trazabilidad a cada factura y a cada pago en un solo lugar, para que planees tu flujo con información real y no con suposiciones. Conoce más del ecosistema detecno, visitando detecno.com";

export const VO_PHRASES: [number, number, string][] = [
  [1.0, 6.8, "¿Sabes cuánto le debes a tus proveedores, qué facturas están por vencer y cuáles ya se pagaron?"],
  [9.0, 16.2, "Hazlo con Venvers, nuestro portal de proveedores da trazabilidad a cada factura y a cada pago en un solo lugar,"],
  [20.6, 25.4, "para que planees tu flujo con información real y no con suposiciones."],
  [25.6, 29.8, "Conoce más del ecosistema detecno, visitando detecno.com"],
];
