// Reconstructed Venvers UI cards (Spanish, coherent sample data) so each
// piece can be animated on its own instead of living inside a flat PNG.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { C, clamp, EASE, POPPINS } from "../theme";
import { CheckBadge, Icon, ICON, IconTile, QR, StatusPill } from "./ui";

const card: React.CSSProperties = {
  background: "rgba(255,255,255,0.92)",
  borderRadius: 28,
  border: "1px solid rgba(255,255,255,0.3)",
  boxShadow: "0 30px 60px rgba(108,60,233,0.35)",
  fontFamily: POPPINS,
  color: C.ink,
  padding: 26,
  boxSizing: "border-box",
};
const label: React.CSSProperties = { fontSize: 20, fontWeight: 500, color: C.muted };
const value: React.CSSProperties = { fontSize: 32, fontWeight: 800, color: C.ink, lineHeight: 1.1 };

/* ---------- the four documents of a purchase ---------- */
export const CfdiCard: React.FC<{ w?: number; checked?: number; style?: React.CSSProperties }> = ({ w = 360, checked, style }) => (
  <div style={{ ...card, width: w, ...style }}>
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <IconTile d={ICON.docCheck} size={56} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 26, fontWeight: 800 }}>CFDI</div>
        <div style={label}>Folio A-4521</div>
      </div>
      {checked === undefined ? <QR size={70} /> : <CheckBadge size={52} p={checked} />}
    </div>
    <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
      <div>
        <div style={label}>Aceros del Norte</div>
        <div style={value}>$8,320.00</div>
      </div>
    </div>
    {checked !== undefined && (
      <div style={{ marginTop: 12, opacity: checked }}>
        <StatusPill kind="ok" size={20}>
          Validado ante SAT
        </StatusPill>
      </div>
    )}
  </div>
);

export const OrdenCard: React.FC<{ w?: number; style?: React.CSSProperties }> = ({ w = 360, style }) => (
  <div style={{ ...card, width: w, ...style }}>
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <IconTile d={ICON.cart} size={56} />
      <div>
        <div style={{ fontSize: 26, fontWeight: 800 }}>Orden de compra</div>
        <div style={label}>OC-1002</div>
      </div>
    </div>
    <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
      <div>
        <div style={label}>12/06/2024</div>
        <div style={value}>$8,320.00</div>
      </div>
    </div>
  </div>
);

export const PagoCard: React.FC<{ w?: number; checked?: number; style?: React.CSSProperties }> = ({ w = 360, checked, style }) => (
  <div style={{ ...card, width: w, ...style }}>
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <IconTile d={ICON.card} size={56} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 26, fontWeight: 800 }}>Pago</div>
        <div style={label}>Transferencia SPEI</div>
      </div>
      {checked !== undefined && <CheckBadge size={52} p={checked} />}
    </div>
    <div style={{ marginTop: 14 }}>
      <div style={label}>15/06/2024</div>
      <div style={value}>$8,320.00</div>
    </div>
    {checked !== undefined && (
      <div style={{ marginTop: 12, opacity: checked }}>
        <StatusPill kind="ok" size={20}>
          Pagado
        </StatusPill>
      </div>
    )}
  </div>
);

export const NotaCard: React.FC<{ w?: number; style?: React.CSSProperties }> = ({ w = 360, style }) => (
  <div style={{ ...card, width: w, ...style }}>
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <IconTile d={ICON.minusDoc} size={56} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 26, fontWeight: 800 }}>Nota de crédito</div>
        <div style={label}>NC-118</div>
      </div>
      <div style={{ width: 52, height: 52, borderRadius: "50%", background: C.bad, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon d={ICON.alert} size={30} sw={2.4} />
      </div>
    </div>
    <div style={{ marginTop: 14 }}>
      <div style={label}>Empaques Sol</div>
      <div style={{ ...value, color: C.bad }}>−$450.00</div>
    </div>
  </div>
);

/* ---------- reconciliation table (Excel-like) ---------- */
type St = "Conciliado" | "Pendiente" | "Diferencia";
export const ROWS: [string, string, string, string, string, string, St][] = [
  ["F-4521", "Aceros del Norte", "OC-1002", "$8,320", "$8,320", "—", "Conciliado"],
  ["F-4522", "Logística Rivas", "OC-1003", "$12,780", "—", "—", "Pendiente"],
  ["F-4523", "Empaques Sol", "OC-1005", "$6,320", "$5,600", "$450", "Diferencia"],
  ["F-4524", "Servicios Lumen", "OC-1007", "$22,100", "$22,100", "—", "Conciliado"],
  ["F-4525", "Grupo Andino", "OC-1008", "$9,450", "—", "—", "Pendiente"],
  ["F-4526", "Textiles Orión", "OC-1011", "$15,200", "$14,200", "$600", "Diferencia"],
  ["F-4527", "Plásticos Delta", "OC-1012", "$4,980", "$4,980", "—", "Conciliado"],
];
const HEAD = ["Folio", "Proveedor", "Orden de compra", "CFDI", "Pago", "Nota de crédito", "Estatus"];
const COLS = "0.8fr 1.5fr 1.2fr 0.9fr 0.9fr 1.1fr 1.2fr";
const kindOf = (s: St) => (s === "Conciliado" ? "ok" : s === "Pendiente" ? "warn" : "bad") as "ok" | "warn" | "bad";

export const ExcelTable: React.FC<{ at: number; stagger?: number; w?: number }> = ({ at, stagger = 3, w = 1200 }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ width: w, background: "#fff", borderRadius: 24, overflow: "hidden", fontFamily: POPPINS, boxShadow: "0 40px 80px rgba(10,10,60,.55)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 20px", background: "#1D6F42", color: "#fff", fontSize: 20, fontWeight: 600 }}>
        <div style={{ width: 28, height: 28, borderRadius: 6, background: "#fff", color: "#1D6F42", fontWeight: 800, fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>X</div>
        conciliacion_proveedores_junio.xlsx
      </div>
      <div style={{ display: "grid", gridTemplateColumns: COLS, background: "#EEF1F5", fontSize: 17, fontWeight: 600, color: "#4B5563" }}>
        {HEAD.map((h) => (
          <div key={h} style={{ padding: "10px 12px", borderRight: "1px solid #D9DEE6" }}>
            {h}
          </div>
        ))}
      </div>
      {ROWS.map((r, i) => {
        const p = interpolate(frame, [at + i * stagger, at + i * stagger + 10], [0, 1], { ...clamp, easing: EASE });
        const alert = r[6] !== "Conciliado";
        const blink = alert && frame > at + 30 && Math.floor((frame - at) / 8) % 2 === 0;
        return (
          <div
            key={r[0]}
            style={{
              display: "grid",
              gridTemplateColumns: COLS,
              alignItems: "center",
              fontSize: 18,
              color: "#1F2937",
              borderTop: "1px solid #E5E7EB",
              opacity: p,
              transform: `translateY(${(1 - p) * 30}px)`,
              background: blink ? (r[6] === "Diferencia" ? "#FDE2E2" : "#FEF7D6") : "#fff",
            }}
          >
            {r.slice(0, 6).map((c, j) => (
              <div key={j} style={{ padding: "11px 12px", borderRight: "1px solid #EEF0F3", fontWeight: j === 1 ? 600 : 400, whiteSpace: "nowrap", overflow: "hidden" }}>
                {c}
              </div>
            ))}
            <div style={{ padding: "7px 10px" }}>
              <StatusPill kind={kindOf(r[6])} size={16}>
                {r[6]}
              </StatusPill>
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ---------- operation status: donut + counters ---------- */
const STATUS = [
  { k: "Conciliado", n: 128, c: C.ok },
  { k: "Pendiente", n: 12, c: C.warn },
  { k: "Diferencia", n: 2, c: C.bad },
];
const TOTAL = STATUS.reduce((a, s) => a + s.n, 0); // 142

export const EstatusCard: React.FC<{ at: number; w?: number; style?: React.CSSProperties }> = ({ at, w = 900, style }) => {
  const frame = useCurrentFrame();
  const fill = interpolate(frame, [at, at + 40], [0, 1], { ...clamp, easing: EASE });
  const R = 110;
  const circ = 2 * Math.PI * R;
  let acc = 0;
  return (
    <div style={{ ...card, width: w, display: "flex", alignItems: "center", gap: 40, padding: 34, ...style }}>
      <svg width={280} height={280} viewBox="0 0 280 280" style={{ flexShrink: 0 }}>
        <circle cx={140} cy={140} r={R} fill="none" stroke="#ECE8FB" strokeWidth={36} />
        {STATUS.map((s) => {
          const len = (s.n / TOTAL) * circ * fill;
          const off = -acc * fill;
          acc += (s.n / TOTAL) * circ;
          return (
            <circle key={s.k} cx={140} cy={140} r={R} fill="none" stroke={s.c} strokeWidth={36} strokeDasharray={`${len} ${circ}`} strokeDashoffset={off} transform="rotate(-90 140 140)" />
          );
        })}
        <text x={140} y={136} textAnchor="middle" fontFamily={POPPINS} fontWeight={800} fontSize={54} fill={C.ink}>
          {Math.round(TOTAL * fill)}
        </text>
        <text x={140} y={172} textAnchor="middle" fontFamily={POPPINS} fontWeight={500} fontSize={22} fill={C.muted}>
          operaciones
        </text>
      </svg>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 32, fontWeight: 800, marginBottom: 18 }}>Estatus de operación</div>
        {STATUS.map((s, i) => {
          const p = interpolate(frame, [at + 6 + i * 6, at + 40 + i * 6], [0, 1], { ...clamp, easing: EASE });
          return (
            <div key={s.k} style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 0", borderTop: i ? "1px solid #EEEAFB" : undefined }}>
              <span style={{ width: 18, height: 18, borderRadius: "50%", background: s.c }} />
              <span style={{ flex: 1, fontSize: 26, fontWeight: 500, color: C.muted }}>{s.k}</span>
              <span style={{ fontSize: 40, fontWeight: 800, color: s.c === C.warn ? "#B48A00" : s.c }}>{Math.round(s.n * p)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const DiferenciasCard: React.FC<{ w?: number; style?: React.CSSProperties }> = ({ w = 900, style }) => {
  const frame = useCurrentFrame();
  const pulse = (frame % 30) / 30;
  return (
    <div style={{ ...card, width: w, display: "flex", alignItems: "center", gap: 26, padding: "26px 34px", ...style }}>
      <div style={{ position: "relative", width: 34, height: 34, flexShrink: 0 }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: C.bad, transform: `scale(${1 + pulse * 1.4})`, opacity: 0.5 * (1 - pulse) }} />
        <div style={{ position: "absolute", inset: 5, borderRadius: "50%", background: C.bad }} />
      </div>
      <div>
        <div style={{ fontSize: 30, fontWeight: 800 }}>Diferencias detectadas: 2</div>
        <div style={{ fontSize: 24, fontWeight: 500, color: C.muted }}>de 142 operaciones · Requieren revisión</div>
      </div>
    </div>
  );
};
