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

// Voice-over script with estimated word timings (seconds). Replace with the
// real transcription (public/captions.json) once voiceover.mp3 exists.
export const VO_SCRIPT =
  "¿Sabes cuánto le debes a tus proveedores, qué facturas están por vencer y cuáles ya se pagaron? Hazlo con Venvers, nuestro portal de proveedores da trazabilidad a cada factura y a cada pago en un solo lugar, para que planees tu flujo con información real y no con suposiciones. Conoce más del ecosistema detecno, visitando detecno.com";

// Phrase anchors (seconds) used to spread the estimated word timings.
export const VO_PHRASES: [number, number, string][] = [
  [0.4, 6.8, "¿Sabes cuánto le debes a tus proveedores, qué facturas están por vencer y cuáles ya se pagaron?"],
  [8.2, 10.6, "Hazlo con Venvers,"],
  [11.0, 20.6, "nuestro portal de proveedores da trazabilidad a cada factura y a cada pago en un solo lugar,"],
  [21.0, 25.8, "para que planees tu flujo con información real y no con suposiciones."],
  [26.2, 29.6, "Conoce más del ecosistema detecno, visitando detecno.com"],
];
