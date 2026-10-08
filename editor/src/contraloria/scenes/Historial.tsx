// Escena 4b — Historial de documentos, validaciones y firmas: an audit log
// that fills entry by entry, with an electronic signature being drawn.
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, clamp, EASE, POPPINS, SAFE } from "../../theme";
import { Card, I, Icon, INK, LINE, localFrame, MUTED, Pill, SyncedHeadline, Tile } from "../kit";
import { SCENE_AT, wordAt, wordsBetween } from "../timings";

const T0 = SCENE_AT.historial;
const LOG = [
  { who: "LM", name: "Laura Méndez", act: "Firmó el contrato CT-118", when: "20/05 · 11:04", d: I.pen, kind: "firma" },
  { who: "SAT", name: "Validación automática", act: "CFDI A-4521 válido ante SAT", when: "12/06 · 10:42", d: I.shield, kind: "validación" },
  { who: "JR", name: "Jorge Ruiz", act: "Aprobó la OC-1002", when: "12/06 · 09:15", d: I.check, kind: "validación" },
  { who: "AN", name: "Aceros del Norte", act: "Subió opinión de cumplimiento", when: "10/06 · 17:30", d: I.doc, kind: "documento" },
];

export const Historial: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const firmasAt = localFrame(wordAt("firmas"), T0);
  const sign = interpolate(frame, [firmasAt - 6, firmasAt + 26], [0, 1], { ...clamp, easing: EASE });
  return (
    <AbsoluteFill>
      <SyncedHeadline words={wordsBetween(T0, SCENE_AT.auditoria)} sceneStart={T0} size={80} highlight={["documentos,", "validaciones", "firmas."]} style={{ position: "absolute", left: SAFE.side, right: SAFE.side, top: SAFE.top + 20 }} />
      <Card style={{ position: "absolute", left: SAFE.side, right: SAFE.side, top: 640, padding: 30 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div style={{ fontSize: 30, fontWeight: 800 }}>Historial · Aceros del Norte</div>
          <Tile d={I.clock} size={54} />
        </div>
        {LOG.map((l, i) => {
          const p = spring({ frame: frame - 4 - i * 9, fps, config: { damping: 15 } });
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 18, padding: "18px 0", borderTop: `1px solid ${LINE}`, opacity: Math.min(1, p), transform: `translateY(${(1 - p) * 30}px)` }}>
              <div style={{ width: 62, height: 62, borderRadius: "50%", background: i === 1 ? "#DCF7E6" : "#EDE7FF", color: i === 1 ? "#15803D" : C.violet, fontWeight: 800, fontSize: l.who.length > 2 ? 18 : 22, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{l.who}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: INK }}>{l.act}</div>
                <div style={{ fontSize: 19, color: MUTED }}>
                  {l.name} · {l.when}
                </div>
              </div>
              <Pill color={l.kind === "firma" ? C.violet : l.kind === "validación" ? C.ok : C.btnTo} size={17}>
                {l.kind}
              </Pill>
            </div>
          );
        })}
      </Card>
      {/* e-signature being drawn */}
      <Card style={{ position: "absolute", left: 220, top: 1260, width: 640, padding: "20px 28px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: POPPINS }}>
          <Icon d={I.pen} size={30} color={C.violet} />
          <span style={{ fontSize: 22, fontWeight: 700 }}>Firma electrónica</span>
          <span style={{ marginLeft: "auto", opacity: sign > 0.95 ? 1 : 0 }}>
            <Pill color={C.ok} size={17}>Registrada</Pill>
          </span>
        </div>
        <svg width={580} height={110} viewBox="0 0 580 110">
          <line x1={0} y1={96} x2={580} y2={96} stroke={LINE} strokeWidth={3} />
          <path d="M20 80 C 60 10, 90 10, 80 70 S 130 100, 160 40 S 200 20, 210 70 C 220 95, 260 30, 290 50 S 340 90, 370 40 C 390 10, 420 80, 450 60 S 520 40, 560 55" fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - sign} />
        </svg>
      </Card>
    </AbsoluteFill>
  );
};
