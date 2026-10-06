import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { C, FONT } from "./theme";

// Vector rebuild of the Fispal dashboard (from the client's screenshot), so it
// stays sharp at 1080 px and each block can be animated.
const SUMMARY = [
  { label: "INGRESOS", total: "$12,425,440.57", color: "#1BC47D" },
  { label: "EGRESOS", total: "$8,302,118.20", color: "#F2A019" },
  { label: "PAGOS", total: "$10,425,440.57", color: "#EC4C7A" },
  { label: "NÓMINA", total: "$4,116,753.09", color: "#2F6BFF" },
  { label: "TRASLADO", total: "$0.00", color: C.purple },
];

const ROWS = [
  ["XAXX010101000", "21/09/2026", "Ingreso", "Grupo Andino SA", "$8,450.00"],
  ["EKU9003173C9", "20/09/2026", "Egreso", "Comercial Rivas", "$2,130.00"],
  ["IIA040805DZ4", "19/09/2026", "Pago", "Servicios Lumen", "$5,900.00"],
  ["MOSR830215JK2", "18/09/2026", "Nómina", "Rosa Montes", "$14,200.00"],
];

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const Dashboard: React.FC<{ width?: number; reveal?: number }> = ({
  width = 940,
  reveal = 0,
}) => {
  const frame = useCurrentFrame();
  const k = width / 940;
  const appear = (i: number) =>
    interpolate(frame - reveal - i * 3, [0, 8], [0, 1], clamp);
  return (
    <div
      style={{
        width: 940,
        transform: `scale(${k})`,
        transformOrigin: "top left",
        background: "#F4F5F9",
        borderRadius: 22,
        overflow: "hidden",
        fontFamily: FONT,
        color: C.text,
      }}
    >
      {/* top bar */}
      <div
        style={{
          height: 78,
          background: C.white,
          display: "flex",
          alignItems: "center",
          padding: "0 30px",
          justifyContent: "space-between",
          borderBottom: "1px solid #E8E9F1",
        }}
      >
        <Img src={staticFile("brand/fispal-logo.png")} style={{ height: 36 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 22, height: 22, borderRadius: 6, background: "#E3E5EE" }} />
          <div style={{ width: 22, height: 22, borderRadius: 6, background: "#E3E5EE" }} />
          <div style={{ width: 40, height: 40, borderRadius: 20, border: "2px solid #D6D8E2", background: "#F0F1F6" }} />
          <span style={{ fontSize: 17, fontWeight: 600, color: "#55586A" }}>Usuario</span>
        </div>
      </div>

      <div style={{ padding: "18px 30px 26px" }}>
        <div style={{ fontSize: 13, color: "#8A8DA0" }}>Home / Mi grupo</div>
        <div style={{ fontSize: 32, fontWeight: 600, margin: "4px 0 16px" }}>
          Nombre de la Empresa
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          {SUMMARY.map((c, i) => (
            <div
              key={c.label}
              style={{
                flex: 1,
                background: C.white,
                borderRadius: 10,
                overflow: "hidden",
                boxShadow: "0 4px 14px rgba(37,14,148,.07)",
                opacity: appear(i),
                transform: `translateY(${(1 - appear(i)) * 20}px)`,
              }}
            >
              <div
                style={{
                  background: C.purple,
                  color: C.white,
                  fontSize: 12,
                  fontWeight: 700,
                  padding: "8px 10px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {c.label}
                <span
                  style={{
                    background: C.white,
                    color: C.purple,
                    borderRadius: 999,
                    fontSize: 9,
                    padding: "2px 7px",
                  }}
                >
                  VER
                </span>
              </div>
              <div style={{ padding: "10px 10px 12px" }}>
                {[0, 1, 2].map((r) => (
                  <div
                    key={r}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 7,
                    }}
                  >
                    <div style={{ width: 38, height: 7, borderRadius: 4, background: "#E3E5EE" }} />
                    <div style={{ width: 62, height: 7, borderRadius: 4, background: "#E3E5EE" }} />
                  </div>
                ))}
                <div style={{ fontSize: 10, color: "#9A9DB0", marginTop: 10 }}>Total</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: c.color }}>{c.total}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 13, fontWeight: 600, margin: "20px 0 8px", color: "#55586A" }}>
          Filtros activos
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {["Ingreso", "Septiembre", "Vigente"].map((f) => (
            <span
              key={f}
              style={{
                background: C.accent,
                color: C.white,
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 600,
                padding: "5px 14px",
              }}
            >
              {f} ✕
            </span>
          ))}
        </div>

        <div style={{ background: C.white, borderRadius: 10, overflow: "hidden" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.3fr 1fr 0.8fr 1.4fr 0.9fr",
              background: "#8E909E",
              color: C.white,
              fontSize: 12,
              fontWeight: 600,
              padding: "10px 16px",
            }}
          >
            <span>RFC Receptor</span>
            <span>Fecha de Emisión</span>
            <span>Tipo CFDI</span>
            <span>Razón Social</span>
            <span>Total</span>
          </div>
          {ROWS.map((r, i) => (
            <div
              key={r[0]}
              style={{
                display: "grid",
                gridTemplateColumns: "1.3fr 1fr 0.8fr 1.4fr 0.9fr",
                fontSize: 12,
                padding: "11px 16px",
                borderTop: "1px solid #EEEFF4",
                opacity: appear(5 + i),
              }}
            >
              <span style={{ color: C.purple, fontWeight: 600 }}>{r[0]}</span>
              <span>{r[1]}</span>
              <span>{r[2]}</span>
              <span>{r[3]}</span>
              <span>{r[4]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
