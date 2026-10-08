// Generic Venvers portal screens (the client has no internal screenshots),
// drawn in the same look as the real login: Barlow, navy headings, purple
// gradient buttons, white cards.
import React from "react";
import { Img, staticFile } from "remotion";
import { BARLOW, StatusChip, V } from "./kit";

const MODULES = ["Licitaciones", "Expedientes", "Órdenes de compra", "CFDI", "Pagos"];

const Icon: React.FC<{ i: number; color: string; size?: number }> = ({ i, color, size = 22 }) => {
  const p = [
    "M4 20h16M6 20V9l6-5 6 5v11M10 20v-6h4v6", // licitaciones (building)
    "M4 5h7l2 2h7v12H4z", // expedientes (folder)
    "M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6", // órdenes (receipt)
    "M7 3h7l5 5v13H7zM14 3v5h5M10 14l2 2 4-4", // CFDI (doc check)
    "M3 7h18v10H3zM3 11h18M7 15h3", // pagos (card)
  ][i];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path d={p} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const ROWS: { prov: string; folio: string; total: string; st: "ok" | "bad" | "warn"; label: string }[] = [
  { prov: "Aceros del Norte SA", folio: "F-10234", total: "$48,500.00", st: "ok", label: "Validado" },
  { prov: "Logística Rivas", folio: "A-2291", total: "$12,780.40", st: "ok", label: "Validado" },
  { prov: "Empaques Sol", folio: "E-0871", total: "$6,320.00", st: "warn", label: "En revisión" },
  { prov: "Servicios Lumen", folio: "SL-118", total: "$22,100.00", st: "ok", label: "Programado" },
  { prov: "Grupo Andino", folio: "GA-554", total: "$9,450.00", st: "ok", label: "Pagado" },
];

// Desktop dashboard for the laptop (rendered at 1000 × 600, scaled by the parent).
export const PortalDesktop: React.FC = () => (
  <div style={{ width: 1000, height: 600, display: "flex", fontFamily: BARLOW, background: "#F5F6FB" }}>
    <div style={{ width: 230, background: `linear-gradient(180deg, ${V.navy2}, ${V.deep})`, padding: "22px 18px", boxSizing: "border-box" }}>
      <Img src={staticFile("venvers/logo-venvers.png")} style={{ height: 30, marginBottom: 30 }} />
      {MODULES.map((m, i) => (
        <div
          key={m}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "11px 12px",
            borderRadius: 12,
            marginBottom: 6,
            fontSize: 17,
            fontWeight: 600,
            color: i === 3 ? V.white : "rgba(255,255,255,.72)",
            background: i === 3 ? `linear-gradient(90deg, ${V.violet}, ${V.purple})` : "transparent",
          }}
        >
          <Icon i={i} color={i === 3 ? "#fff" : V.lilac} />
          {m}
        </div>
      ))}
    </div>
    <div style={{ flex: 1, padding: "24px 26px" }}>
      <div style={{ fontSize: 28, fontWeight: 700, color: V.ink }}>CFDI recibidos</div>
      <div style={{ fontSize: 15, color: "#7A7F9E", marginTop: 2 }}>Validación automática ante el SAT</div>
      <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
        {[
          ["Recibidos", "128", V.ink],
          ["Validados", "121", V.ok],
          ["Por pagar", "34", V.violet],
        ].map(([k, v, c]) => (
          <div key={k} style={{ flex: 1, background: "#fff", borderRadius: 14, padding: "12px 14px", boxShadow: "0 4px 14px rgba(14,26,92,.06)" }}>
            <div style={{ fontSize: 14, color: "#7A7F9E", fontWeight: 600 }}>{k}</div>
            <div style={{ fontSize: 30, fontWeight: 700, color: c }}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{ background: "#fff", borderRadius: 14, marginTop: 14, overflow: "hidden", boxShadow: "0 4px 14px rgba(14,26,92,.06)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.7fr 0.9fr 1fr 1fr", padding: "10px 16px", fontSize: 13, fontWeight: 700, color: "#8A8FAE", background: "#F0F1F8" }}>
          <span>Proveedor</span>
          <span>Folio</span>
          <span>Total</span>
          <span>Estatus</span>
        </div>
        {ROWS.map((r) => (
          <div key={r.folio} style={{ display: "grid", gridTemplateColumns: "1.7fr 0.9fr 1fr 1fr", alignItems: "center", padding: "9px 16px", fontSize: 15, color: V.ink, borderTop: "1px solid #EEF0F7" }}>
            <span style={{ fontWeight: 600 }}>{r.prov}</span>
            <span>{r.folio}</span>
            <span>{r.total}</span>
            <span>
              <StatusChip kind={r.st} size={14}>
                {r.label}
              </StatusChip>
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Supplier-side mobile view: invoice statuses + early payment.
export const PortalPhone: React.FC = () => (
  <div style={{ width: "100%", height: "100%", fontFamily: BARLOW, background: "#F5F6FB" }}>
    <div style={{ background: `linear-gradient(160deg, ${V.blue}, ${V.purple})`, padding: "54px 22px 26px" }}>
      <Img src={staticFile("venvers/logo-venvers.png")} style={{ height: 28 }} />
      <div style={{ color: "#fff", fontSize: 22, fontWeight: 700, marginTop: 16 }}>Mis facturas</div>
      <div style={{ color: "rgba(255,255,255,.8)", fontSize: 15 }}>Estatus en tiempo real</div>
    </div>
    <div style={{ padding: "14px 14px" }}>
      {[
        { f: "F-10234", t: "$48,500.00", k: "ok" as const, l: "Validada" },
        { f: "F-10235", t: "$12,780.40", k: "info" as const, l: "Pago 15 oct" },
        { f: "F-10236", t: "$6,320.00", k: "ok" as const, l: "Conciliada" },
      ].map((r) => (
        <div key={r.f} style={{ background: "#fff", borderRadius: 14, padding: "12px 14px", marginBottom: 10, boxShadow: "0 4px 12px rgba(14,26,92,.07)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 17, fontWeight: 700, color: V.ink }}>{r.f}</span>
            <StatusChip kind={r.k} size={13}>
              {r.l}
            </StatusChip>
          </div>
          <div style={{ fontSize: 15, color: "#7A7F9E", marginTop: 2 }}>{r.t}</div>
        </div>
      ))}
      <div style={{ marginTop: 6, background: `linear-gradient(90deg, ${V.violet}, ${V.purple})`, color: "#fff", borderRadius: 14, padding: "14px 14px", fontSize: 16, fontWeight: 700, textAlign: "center" }}>
        Solicitar pronto pago
      </div>
    </div>
  </div>
);
