import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Dashboard } from "./Dashboard";
import { C, FONT, MONO, s } from "./theme";
import { Card, Check, Enter, Headline, Pill, ScanCorners, useEnter } from "./ui";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Absolute voice-over time (s) -> frame local to a scene that starts at `from`.
const at = (seconds: number, from: number) => s(seconds) - from;

const Cursor: React.FC<{ x: number; y: number; clickAt: number }> = ({
  x,
  y,
  clickAt,
}) => {
  const frame = useCurrentFrame();
  const press = interpolate(frame, [clickAt - 2, clickAt, clickAt + 4], [1, 0.82, 1], clamp);
  const ring = interpolate(frame, [clickAt, clickAt + 12], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", left: x, top: y }}>
      {frame >= clickAt && ring < 1 && (
        <div
          style={{
            position: "absolute",
            left: -40 * ring,
            top: -40 * ring,
            width: 80 * ring,
            height: 80 * ring,
            borderRadius: "50%",
            border: `4px solid ${C.accent}`,
            opacity: 1 - ring,
          }}
        />
      )}
      <svg
        width={54}
        height={54}
        viewBox="0 0 24 24"
        style={{ transform: `scale(${press})`, transformOrigin: "top left" }}
      >
        <path
          d="M4 2l15 10.5-6.6 1.3 3.9 7.2-2.9 1.5-3.9-7.3L4 19.6z"
          fill={C.text}
          stroke="#fff"
          strokeWidth={1.4}
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

/* ---------- Escena 1 — Fispal evoluciona contigo ---------- */
export const S1Logo: React.FC<{ from?: number }> = () => {
  const frame = useCurrentFrame();
  const p = useEnter(0, 12);
  const dot = spring({ frame: frame - 10, fps: 30, config: { damping: 8 } });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "absolute", top: 420 }}>
        <Enter delay={4}>
          <Pill>Nueva experiencia</Pill>
        </Enter>
      </div>
      <div
        style={{
          position: "absolute",
          top: 640,
          opacity: p,
          transform: `scale(${0.85 + 0.15 * p})`,
          filter: `blur(${(1 - p) * 10}px)`,
        }}
      >
        <Img src={staticFile("brand/fispal-logo.png")} style={{ width: 760 }} />
        {/* pulse on the logo's green dot */}
        <div
          style={{
            position: "absolute",
            left: 760 * 0.098,
            top: 760 * -0.012,
            width: 66,
            height: 66,
            borderRadius: "50%",
            border: `5px solid ${C.accent}`,
            opacity: interpolate(dot, [0, 1], [0.9, 0], clamp),
            transform: `scale(${1 + dot * 1.6})`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

/* ---------- Escena 2 — Nueva forma de contratar y gestionar ---------- */
export const S2Contratar: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tPill = at(2.85, from);
  const tPanel = at(3.57, from);
  const panel = spring({ frame: frame - tPanel, fps, config: { damping: 14 } });
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 190, width: "100%", display: "flex", justifyContent: "center" }}>
        <Enter delay={tPill}>
          <Pill>Nueva forma de contratar</Pill>
        </Enter>
      </div>
      <div style={{ position: "absolute", left: 70, top: 330 }}>
        <Enter delay={0} from={0.92}>
          <div style={{ position: "relative", borderRadius: 22, boxShadow: "0 30px 80px rgba(37,14,148,.18)" }}>
            <Dashboard reveal={4} />
            <ScanCorners width={940} height={640} delay={6} />
          </div>
        </Enter>
      </div>
      {/* "Mi plan" panel slides over the dashboard on "gestionar" */}
      <div
        style={{
          position: "absolute",
          right: 40,
          top: 610,
          transform: `translateX(${(1 - panel) * 700}px)`,
          opacity: panel,
        }}
      >
        <Card style={{ width: 520, padding: 34, fontFamily: FONT }}>
          <div style={{ fontFamily: MONO, fontSize: 20, fontWeight: 700, color: "#8A8DA0", letterSpacing: "0.08em" }}>
            MI PLAN
          </div>
          <div style={{ fontSize: 40, fontWeight: 700, color: C.purple, marginTop: 6 }}>
            Fispal Empresa
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12, fontSize: 24, color: "#55586A", fontWeight: 500 }}>
            <span style={{ width: 14, height: 14, borderRadius: 7, background: C.accent }} />
            Activo · renovación automática
          </div>
          <div
            style={{
              marginTop: 26,
              background: C.accent,
              color: C.white,
              fontWeight: 700,
              fontSize: 28,
              borderRadius: 16,
              padding: "20px 0",
              textAlign: "center",
            }}
          >
            Gestionar plan
          </div>
        </Card>
      </div>
      <div style={{ opacity: interpolate(frame, [tPanel + 6, tPanel + 10], [0, 1], clamp) }}>
        <Cursor
          x={interpolate(frame, [tPanel + 6, tPanel + 18], [900, 760], clamp)}
          y={interpolate(frame, [tPanel + 6, tPanel + 18], [1180, 1000], clamp)}
          clickAt={tPanel + 20}
        />
      </div>
    </AbsoluteFill>
  );
};

/* ---------- Escena 3 — Personalízalo ---------- */
// Types a line in over [start, end] so the card keeps moving while the voice
// says "a la medida de tu operación" (estilo.md §1: never > 1.5 s still).
const TypeLine: React.FC<{ text: string; start: number; end: number }> = ({
  text,
  start,
  end,
}) => {
  const frame = useCurrentFrame();
  const n = Math.round(interpolate(frame, [start, end], [0, text.length], clamp));
  const caret = frame >= start && Math.floor(frame / 8) % 2 === 0;
  return (
    <div
      style={{
        fontFamily: MONO,
        fontWeight: 500,
        fontSize: 26,
        color: C.accentDark,
        height: 36,
        marginBottom: 6,
      }}
    >
      {text.slice(0, n)}
      <span style={{ opacity: caret ? 1 : 0 }}>▍</span>
    </div>
  );
};

const ADDONS = [
  { icon: "XML", title: "Paquetes de CFDI", sub: "+1,000 timbres", t: 7.92 },
  { icon: "RFC", title: "RFC adicionales", sub: "+3 razones sociales", t: 8.91 },
  { icon: "MOD", title: "Módulos avanzados", sub: "Nómina · Conciliación", t: 10.36 },
  { icon: "USR", title: "Colaboradores", sub: "+5 usuarios", t: 11.43 },
  { icon: "API", title: "Integraciones API", sub: "REST · Webhooks", t: 12.53 },
];

export const S3Personaliza: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const active = ADDONS.filter((a) => frame >= at(a.t, from)).length;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 170, width: "100%", display: "flex", justifyContent: "center" }}>
        <Enter delay={2}>
          <Pill>Personaliza tu plan</Pill>
        </Enter>
      </div>
      <div style={{ position: "absolute", left: 90, top: 290 }}>
        <Enter delay={0} from={0.9}>
          <div style={{ position: "relative" }}>
            <Card style={{ width: 900, padding: "36px 40px", fontFamily: FONT }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                <div style={{ fontSize: 44, fontWeight: 700, color: C.text }}>Arma tu plan</div>
                <div style={{ fontFamily: MONO, fontSize: 24, fontWeight: 700, color: C.purple, background: "#EEEBFF", borderRadius: 999, padding: "8px 18px" }}>
                  {active}/5 activos
                </div>
              </div>
              <TypeLine
                text="Hecho a la medida de tu operación"
                start={at(5.68, from)}
                end={at(7.3, from)}
              />
              {ADDONS.map((a) => {
                const on = spring({ frame: frame - at(a.t, from), fps, config: { damping: 12 } });
                const lit = frame >= at(a.t, from);
                return (
                  <div
                    key={a.icon}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 26,
                      padding: "22px 20px",
                      marginTop: 12,
                      borderRadius: 18,
                      border: `3px solid ${lit ? C.accent : "#ECEDF3"}`,
                      background: lit ? "#F2FDF8" : C.white,
                      opacity: lit ? 1 : 0.4,
                      transform: `scale(${1 + 0.04 * Math.sin(Math.min(on, 1) * Math.PI)})`,
                    }}
                  >
                    <div
                      style={{
                        width: 84,
                        height: 84,
                        borderRadius: 20,
                        background: lit ? C.purple : "#E3E5EE",
                        color: C.white,
                        fontFamily: MONO,
                        fontWeight: 700,
                        fontSize: 24,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {a.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 36, fontWeight: 700, color: C.text }}>{a.title}</div>
                      <div style={{ fontSize: 26, fontWeight: 500, color: "#7A7D90" }}>{a.sub}</div>
                    </div>
                    <Check size={56} on={lit ? Math.min(on, 1) : 0} />
                  </div>
                );
              })}
            </Card>
            <ScanCorners width={900} height={1000} delay={4} />
          </div>
        </Enter>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- Escena 4 — Mensual | Anual ---------- */
export const S4Selector: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tMensual = at(15.25, from);
  const tAnual = at(15.89, from);
  const show = spring({ frame: frame - tMensual, fps, config: { damping: 14 } });
  const move = spring({ frame: frame - tAnual, fps, config: { damping: 13 } });
  const W = 860;
  const knobX = interpolate(move, [0, 1], [0, W / 2 - 12]);
  const anualOn = frame >= tAnual + 4;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 330, width: "100%" }}>
        <Enter delay={0}>
          <Headline size={78}>Elige cómo contratar.</Headline>
        </Enter>
      </div>
      <div style={{ position: "absolute", top: 600, left: (1080 - W) / 2 }}>
        <Enter delay={4}>
          <div
            style={{
              position: "relative",
              width: W,
              height: 170,
              borderRadius: 999,
              background: C.white,
              boxShadow: "0 20px 60px rgba(37,14,148,.14)",
              border: "1px solid rgba(0,0,0,.05)",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 12,
                left: 12 + knobX,
                width: W / 2 - 12,
                height: 146,
                borderRadius: 999,
                background: anualOn ? C.accent : C.purple,
                opacity: show,
                transform: `scale(${0.8 + 0.2 * show})`,
              }}
            />
            {["MENSUAL", "ANUAL"].map((label, i) => {
              const selected = show > 0.5 && (i === 0 ? !anualOn : anualOn);
              return (
                <div
                  key={label}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: i * (W / 2),
                    width: W / 2,
                    height: 170,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: MONO,
                    fontWeight: 700,
                    fontSize: 46,
                    letterSpacing: "0.06em",
                    color: selected ? C.white : "#8A8DA0",
                  }}
                >
                  {label}
                </div>
              );
            })}
          </div>
        </Enter>
      </div>
      <div style={{ position: "absolute", top: 830, left: (1080 - W) / 2, width: W, display: "flex", justifyContent: "flex-end" }}>
        <div
          style={{
            opacity: interpolate(frame, [tAnual + 6, tAnual + 12], [0, 1], clamp),
            transform: `translateY(${interpolate(frame, [tAnual + 6, tAnual + 12], [20, 0], clamp)}px)`,
            fontFamily: FONT,
            fontWeight: 700,
            fontSize: 36,
            color: C.white,
            background: C.purple,
            borderRadius: 16,
            padding: "12px 26px",
            marginRight: 110,
          }}
        >
          −20%
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- Escena 5 — Ahorra 20% ---------- */
export const S5Ahorro: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t20 = at(17.04, from);
  const p = spring({ frame: frame - t20, fps, config: { damping: 11 } });
  const count = Math.round(interpolate(frame, [t20, t20 + 14], [0, 20], clamp));
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div style={{ position: "absolute", top: 260 }}>
        <Enter delay={0}>
          <Pill>Plan anual</Pill>
        </Enter>
      </div>
      <div
        style={{
          position: "absolute",
          top: 360,
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: 380,
          letterSpacing: "-0.05em",
          lineHeight: 1,
          backgroundImage: `linear-gradient(180deg, ${C.purple}, #4B37C9)`,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          opacity: interpolate(p, [0, 0.4], [0, 1], clamp),
          transform: `scale(${0.7 + 0.3 * p})`,
        }}
      >
        {count}%
      </div>
      <div
        style={{
          position: "absolute",
          top: 760,
          fontFamily: FONT,
          fontStyle: "italic",
          fontWeight: 700,
          fontSize: 110,
          color: C.accent,
          opacity: interpolate(frame, [t20 + 8, t20 + 14], [0, 1], clamp),
          filter: `blur(${interpolate(frame, [t20 + 8, t20 + 14], [8, 0], clamp)}px)`,
        }}
      >
        de ahorro
      </div>
      <div style={{ position: "absolute", top: 1010 }}>
        <Enter delay={at(18.0, from)}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 16,
              background: C.white,
              borderRadius: 999,
              padding: "18px 34px",
              boxShadow: "0 16px 40px rgba(37,14,148,.12)",
              fontFamily: FONT,
              fontSize: 34,
              fontWeight: 600,
              color: C.text,
            }}
          >
            <Check size={44} />
            Comienza en <span style={{ color: C.purple, fontWeight: 800 }}>fispal.mx</span>
          </div>
        </Enter>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- Escena 6 — Más flexibilidad. Más control. Más Fispal. ---------- */
const CLAIMS = [
  { word: "flexibilidad.", t: 19.06 },
  { word: "control.", t: 20.4 },
  { word: "Fispal.", t: 21.42 },
];

export const S6Claims: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 54 }}>
        {CLAIMS.map((c, i) => {
          const t = at(c.t, from);
          const p = interpolate(frame, [t, t + 6], [0, 1], clamp);
          const last = i === CLAIMS.length - 1;
          return (
            <div
              key={c.word}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 34,
                opacity: 0.22 + 0.78 * p,
                filter: `blur(${(1 - p) * 4}px)`,
                transform: `translateX(${(1 - p) * 20}px)`,
              }}
            >
              <Check size={78} on={p} />
              <div
                style={{
                  fontFamily: FONT,
                  fontWeight: 800,
                  fontSize: 100,
                  letterSpacing: "-0.03em",
                  color: C.text,
                }}
              >
                Más{" "}
                <span style={{ color: last ? C.purple : C.accent }}>{c.word}</span>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ---------- Escena 7 — Cierre ---------- */
export const S7Cierre: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const tCta = at(23.5, from);
  const tUrl = at(24.36, from);
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div style={{ position: "absolute", top: 420 }}>
        <Enter delay={0} from={0.85}>
          <Img src={staticFile("brand/fispal-logo.png")} style={{ width: 700 }} />
        </Enter>
      </div>
      <div style={{ position: "absolute", top: 820 }}>
        <Enter delay={tCta}>
          <div
            style={{
              background: C.accent,
              color: C.white,
              fontFamily: FONT,
              fontWeight: 700,
              fontSize: 44,
              borderRadius: 999,
              padding: "30px 60px",
              boxShadow: "0 18px 40px rgba(32,217,157,.35)",
              transform: `scale(${interpolate(frame, [tUrl + 18, tUrl + 20, tUrl + 24], [1, 0.95, 1], clamp)})`,
            }}
          >
            Conoce la nueva experiencia →
          </div>
        </Enter>
      </div>
      <div style={{ position: "absolute", top: 1010 }}>
        <Enter delay={tUrl}>
          <Pill style={{ textTransform: "none", fontSize: 30 }}>fispal.mx</Pill>
        </Enter>
      </div>
      <div style={{ opacity: interpolate(frame, [tUrl + 4, tUrl + 8], [0, 1], clamp) }}>
        <Cursor
          x={interpolate(frame, [tUrl + 4, tUrl + 16], [900, 700], clamp)}
          y={interpolate(frame, [tUrl + 4, tUrl + 16], [1180, 900], clamp)}
          clickAt={tUrl + 18}
        />
      </div>
    </AbsoluteFill>
  );
};
