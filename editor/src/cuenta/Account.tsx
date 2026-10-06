import React from "react";
import { Img, interpolate, spring, staticFile } from "remotion";
import { Check } from "../fispal/ui";
import { C, FONT, MONO, cardShadow } from "../fispal/theme";

// Vector "Mi cuenta" screen (1000 × 1480 px), same visual language as the
// dashboard rebuilt for the first reel. Everything is driven by `frame` and
// the cue frames passed in, so the camera tour and the voice stay in sync.
export const SCREEN_W = 1000;
export const SCREEN_H = 1480;
// Vertical centre of each block, used by the camera.
export const BLOCK_Y = { header: 160, status: 395, renew: 760, plan: 1180 };

export type AccountCues = {
  activo: number;
  compruebalo: number;
  soporte: number;
  fecha: number;
  proximo: number;
  rfc: number;
  cfdi: number;
  modulos: number;
  todoClaro: number;
};

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const sp = (frame: number, at: number, damping = 12) =>
  spring({ frame: frame - at, fps: 30, config: { damping } });

const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 22, letterSpacing: "0.1em", color: "#8A8DA0" }}>
    {children}
  </div>
);

const Block: React.FC<{
  focus: number;
  done: number;
  height: number;
  children: React.ReactNode;
}> = ({ focus, done, height, children }) => (
  <div
    style={{
      position: "relative",
      height,
      background: C.white,
      borderRadius: 28,
      padding: "30px 36px",
      boxSizing: "border-box",
      boxShadow: cardShadow,
      border: `3px solid ${focus > 0.5 ? C.accent : "rgba(0,0,0,.04)"}`,
      opacity: 0.45 + 0.55 * Math.max(focus, done),
      transform: `scale(${1 + 0.015 * focus})`,
      marginBottom: 26,
    }}
  >
    {children}
    {done > 0 && (
      <div style={{ position: "absolute", top: 24, right: 28, transform: `scale(${done})` }}>
        <Check size={48} />
      </div>
    )}
  </div>
);

const Bar: React.FC<{ p: number; color?: string }> = ({ p, color = C.accent }) => (
  <div style={{ height: 16, borderRadius: 8, background: "#EEF0F6", overflow: "hidden" }}>
    <div style={{ width: `${p * 100}%`, height: "100%", borderRadius: 8, background: color }} />
  </div>
);

export const Account: React.FC<{
  frame: number;
  cues: AccountCues;
  focus: "all" | "status" | "renew" | "plan" | "none";
}> = ({ frame, cues, focus }) => {
  const done = sp(frame, cues.todoClaro, 10);
  const f = (k: typeof focus) => (focus === k ? 1 : focus === "all" ? 1 : 0);
  const active = sp(frame, cues.activo, 10);
  const verified = sp(frame, cues.compruebalo + 10);
  const noTicket = sp(frame, cues.soporte - 6);
  const date = sp(frame, cues.fecha);
  const countdown = interpolate(frame, [cues.proximo, cues.proximo + 20], [0, 1], clamp);
  const rfc = interpolate(frame, [cues.rfc, cues.rfc + 14], [0, 1], clamp);
  const cfdi = interpolate(frame, [cues.cfdi, cues.cfdi + 24], [0, 1], clamp);
  const cfdiCount = Math.round(8420 * cfdi).toLocaleString("en-US");

  return (
    <div
      style={{
        width: SCREEN_W,
        height: SCREEN_H,
        background: "#F4F5FA",
        borderRadius: 36,
        overflow: "hidden",
        fontFamily: FONT,
        color: C.text,
      }}
    >
      {/* top bar */}
      <div
        style={{
          height: 96,
          background: C.white,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 36px",
          borderBottom: "1px solid #E8E9F1",
        }}
      >
        <Img src={staticFile("brand/fispal-logo.png")} style={{ height: 40 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 22, fontWeight: 600, color: "#55586A" }}>Mi cuenta</span>
          <div style={{ width: 46, height: 46, borderRadius: 23, background: C.purple, color: C.white, fontWeight: 700, fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
            MR
          </div>
        </div>
      </div>

      <div style={{ padding: "28px 36px" }}>
        <div style={{ fontSize: 46, fontWeight: 700, marginBottom: 6 }}>Mi cuenta</div>
        <div style={{ display: "flex", gap: 10, marginBottom: 26 }}>
          {["Estado", "Renovación", "Paquetes contratados"].map((t) => (
            <span key={t} style={{ fontSize: 20, fontWeight: 600, color: C.purple, background: "#EEEBFF", borderRadius: 999, padding: "6px 16px" }}>
              {t}
            </span>
          ))}
        </div>

        {/* ESTADO */}
        <Block focus={f("status")} done={done} height={300}>
          <Label>ESTADO DE LA SUSCRIPCIÓN</Label>
          <div style={{ display: "flex", alignItems: "center", gap: 22, marginTop: 22 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 14,
                fontSize: 44,
                fontWeight: 800,
                color: active > 0.5 ? "#0E8F63" : "#8A8DA0",
                background: active > 0.5 ? "#DDFBEF" : "#EEF0F6",
                borderRadius: 999,
                padding: "12px 32px",
                transform: `scale(${1 + 0.12 * Math.sin(Math.min(active, 1) * Math.PI)})`,
              }}
            >
              <span style={{ width: 22, height: 22, borderRadius: 11, background: active > 0.5 ? C.accent : C.inactive, boxShadow: active > 0.5 ? `0 0 0 ${8 * active}px rgba(32,217,157,.25)` : "none" }} />
              {active > 0.5 ? "Activa" : "Verificando…"}
            </div>
            <div style={{ opacity: verified, transform: `translateX(${(1 - verified) * 20}px)`, fontSize: 24, fontWeight: 600, color: "#55586A" }}>
              <svg width={24} height={24} viewBox="0 0 24 24" style={{ verticalAlign: -4, marginRight: 8 }}>
                <circle cx={12} cy={13} r={8} fill="none" stroke="#0E8F63" strokeWidth={2.6} />
                <path d="M12 9v4l3 2M9 2h6" stroke="#0E8F63" strokeWidth={2.6} strokeLinecap="round" fill="none" />
              </svg>
              Verificado en 2 s
            </div>
          </div>
          <div style={{ marginTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 30, fontWeight: 700, color: C.purple }}>Fispal Empresa</div>
              <div style={{ fontSize: 22, color: "#7A7D90", fontWeight: 500 }}>Plan anual</div>
            </div>
            <div
              style={{
                opacity: noTicket,
                transform: `scale(${0.8 + 0.2 * noTicket})`,
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontSize: 22,
                fontWeight: 700,
                color: C.text,
                background: "#F4F5FA",
                borderRadius: 14,
                padding: "10px 16px",
              }}
            >
              <svg width={34} height={30} viewBox="0 0 34 30">
                <path d="M4 4h22a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H13l-6 5v-5H4a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3z" fill="none" stroke="#8A8DA0" strokeWidth={2.6} strokeLinejoin="round" />
                <path d="M3 27L31 2" stroke="#EC4C7A" strokeWidth={3.4} strokeLinecap="round" />
              </svg>
              Sin tickets a soporte
            </div>
          </div>
        </Block>

        {/* RENOVACIÓN */}
        <Block focus={f("renew")} done={done} height={330}>
          <Label>PRÓXIMA RENOVACIÓN</Label>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 26, marginTop: 18 }}>
            <div
              style={{
                fontSize: 74,
                fontWeight: 800,
                letterSpacing: "-0.03em",
                color: C.purple,
                padding: "0 18px",
                borderRadius: 18,
                outline: `4px solid rgba(32,217,157,${date})`,
                background: `rgba(32,217,157,${0.1 * date})`,
              }}
            >
              15 ENE 2027
            </div>
          </div>
          <div style={{ marginTop: 22, display: "flex", justifyContent: "space-between", fontSize: 24, fontWeight: 600 }}>
            <span>Próximo cargo</span>
            <span style={{ color: "#0E8F63", opacity: countdown }}>Faltan {Math.round(98 * countdown)} días</span>
          </div>
          <div style={{ marginTop: 12 }}>
            <Bar p={0.73 * countdown} />
          </div>
          <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 12, fontSize: 22, color: "#55586A", fontWeight: 500 }}>
            <span style={{ width: 52, height: 30, borderRadius: 15, background: C.accent, position: "relative" }}>
              <span style={{ position: "absolute", right: 4, top: 4, width: 22, height: 22, borderRadius: 11, background: C.white }} />
            </span>
            Renovación automática
          </div>
        </Block>

        {/* LO QUE TIENES CONTRATADO */}
        <Block focus={f("plan")} done={done} height={470}>
          <Label>LO QUE TIENES CONTRATADO</Label>
          <div style={{ marginTop: 22 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 28, fontWeight: 700 }}>
              <span>RFC activos</span>
              <span style={{ color: C.purple }}>{Math.round(3 * rfc)} de 5</span>
            </div>
            <div style={{ marginTop: 10 }}>
              <Bar p={0.6 * rfc} color={C.purple} />
            </div>
          </div>
          <div style={{ marginTop: 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 28, fontWeight: 700 }}>
              <span>CFDI disponibles</span>
              <span style={{ color: "#0E8F63" }}>{cfdiCount} / 10,000</span>
            </div>
            <div style={{ marginTop: 10 }}>
              <Bar p={0.842 * cfdi} />
            </div>
          </div>
          <div style={{ marginTop: 28, fontSize: 28, fontWeight: 700 }}>Módulos activos</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 14 }}>
            {["Nómina", "Conciliación", "Complementos de pago", "Contabilidad"].map((m, i) => {
              const p = sp(frame, cues.modulos + i * 4, 11);
              return (
                <span
                  key={m}
                  style={{
                    fontSize: 24,
                    fontWeight: 600,
                    color: C.white,
                    background: C.purple,
                    borderRadius: 999,
                    padding: "10px 22px",
                    opacity: p,
                    transform: `scale(${0.6 + 0.4 * p})`,
                  }}
                >
                  ✓ {m}
                </span>
              );
            })}
          </div>
        </Block>
      </div>
    </div>
  );
};
