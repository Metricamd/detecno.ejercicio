// Isometric "floating UI" illustrations (style of the client's reference):
// a tilted portal screen with purple-gradient and white cards hovering above
// it at different heights. Pure CSS 3D, so text stays crisp.
import React from "react";
import { Img, staticFile } from "remotion";
import { BARLOW, V } from "./kit";

const INK = V.navy;
const MUTED = "#7A7F9E";
const GRAD = `linear-gradient(135deg, #8E6BFF 0%, ${V.purple} 55%, #3F1DB8 100%)`;

/* ---------- stage ---------- */
export const IsoStage: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  planeW: number;
  planeH: number;
  rx?: number;
  rz?: number;
  children: React.ReactNode;
}> = ({ x, y, w, h, planeW, planeH, rx = 32, rz = -20, children }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, perspective: 3200 }}>
    <div
      style={{
        position: "absolute",
        left: (w - planeW) / 2,
        top: (h - planeH) / 2,
        width: planeW,
        height: planeH,
        transformStyle: "preserve-3d",
        transform: `rotateX(${rx}deg) rotateZ(${rz}deg)`,
      }}
    >
      {children}
    </div>
  </div>
);

// One layer of the scene, `z` px above the base plane.
export const Layer: React.FC<{ x: number; y: number; z: number; w: number; h?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  x,
  y,
  z,
  w,
  h,
  children,
  style,
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: h,
      transform: `translateZ(${z}px)`,
      fontFamily: BARLOW,
      ...style,
    }}
  >
    {children}
  </div>
);

/* ---------- building blocks ---------- */
const cardShadow = (z: number) => `${z * 0.25}px ${z * 0.45}px ${30 + z * 0.4}px rgba(43,20,140,${0.12 + Math.min(z, 200) / 1400})`;

export const WCard: React.FC<{ z?: number; children: React.ReactNode; pad?: number; style?: React.CSSProperties }> = ({ z = 60, children, pad = 24, style }) => (
  <div style={{ background: "#fff", borderRadius: 24, padding: pad, boxShadow: cardShadow(z), border: "1px solid #ECEAFB", ...style }}>{children}</div>
);

export const GCard: React.FC<{ z?: number; children: React.ReactNode; pad?: number; style?: React.CSSProperties }> = ({ z = 100, children, pad = 24, style }) => (
  <div style={{ background: GRAD, borderRadius: 24, padding: pad, color: "#fff", boxShadow: `${cardShadow(z)}, inset 0 1px 0 rgba(255,255,255,.35)`, ...style }}>{children}</div>
);

const Label: React.FC<{ c?: string; children: React.ReactNode; size?: number }> = ({ c = MUTED, children, size = 18 }) => (
  <div style={{ fontSize: size, fontWeight: 600, color: c }}>{children}</div>
);
const Big: React.FC<{ c?: string; children: React.ReactNode; size?: number }> = ({ c = INK, children, size = 40 }) => (
  <div style={{ fontSize: size, fontWeight: 700, color: c, lineHeight: 1.05 }}>{children}</div>
);

export const Chip: React.FC<{ kind: "ok" | "bad" | "warn" | "info"; children: React.ReactNode; size?: number }> = ({ kind, children, size = 16 }) => {
  const c = { ok: V.ok, bad: V.bad, warn: V.warn, info: V.violet }[kind];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: size, fontWeight: 700, color: c, background: `${c}1C`, borderRadius: 999, padding: `${size * 0.2}px ${size * 0.65}px`, whiteSpace: "nowrap" }}>
      <span style={{ width: size * 0.45, height: size * 0.45, borderRadius: "50%", background: c }} />
      {children}
    </span>
  );
};

const Bars: React.FC<{ vals: number[]; w: number; h: number; light?: boolean }> = ({ vals, w, h, light }) => {
  const bw = w / vals.length;
  return (
    <svg width={w} height={h}>
      {vals.map((v, i) => (
        <rect key={i} x={i * bw + bw * 0.18} y={h - v * h} width={bw * 0.64} height={v * h} rx={bw * 0.18} fill={light ? `rgba(255,255,255,${0.45 + v * 0.5})` : i === vals.length - 1 ? V.purple : "#C9BCFF"} />
      ))}
    </svg>
  );
};

const Line: React.FC<{ pts: number[]; w: number; h: number; color?: string }> = ({ pts, w, h, color = V.purple }) => {
  const d = pts.map((p, i) => `${i ? "L" : "M"} ${(i / (pts.length - 1)) * w} ${h - p * h}`).join(" ");
  return (
    <svg width={w} height={h} style={{ overflow: "visible" }}>
      <path d={`${d} L ${w} ${h} L 0 ${h} Z`} fill={`${color}22`} />
      <path d={d} fill="none" stroke={color} strokeWidth={4} strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={w} cy={h - pts[pts.length - 1] * h} r={7} fill={color} />
    </svg>
  );
};

const Icon: React.FC<{ d: string; c?: string; s?: number; sw?: number }> = ({ d, c = "#fff", s = 26, sw = 2.2 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24">
    <path d={d} fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const I = {
  mail: "M3 6h18v12H3zM3 7l9 6 9-6",
  doc: "M7 3h7l5 5v13H7zM14 3v5h5",
  docCheck: "M7 3h7l5 5v13H7zM14 3v5h5M10 14l2 2 4-4",
  check: "M5 12.5l4.5 4.5L19 7.5",
  x: "M6 6l12 12M18 6L6 18",
  building: "M4 20h16M6 20V9l6-5 6 5v11M10 20v-6h4v6",
  folder: "M4 5h7l2 2h7v12H4z",
  receipt: "M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6",
  card: "M3 7h18v10H3zM3 11h18M7 15h3",
  clock: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3 2",
  bolt: "M13 2L4 14h7l-1 8 9-12h-7z",
};

const IconTile: React.FC<{ d: string; s?: number; bg?: string; c?: string }> = ({ d, s = 52, bg = GRAD, c = "#fff" }) => (
  <div style={{ width: s, height: s, borderRadius: s * 0.3, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
    <Icon d={d} c={c} s={s * 0.5} />
  </div>
);

/* ---------- base screen: portal with sidebar ---------- */
const MODS: [string, string][] = [
  ["Licitaciones", I.building],
  ["Expedientes", I.folder],
  ["Órdenes", I.receipt],
  ["CFDI", I.docCheck],
  ["Pagos", I.card],
];

export const Screen: React.FC<{ w: number; h: number; active?: number; title: string; children: React.ReactNode }> = ({ w, h, active = 3, title, children }) => (
  <div style={{ width: w, height: h, display: "flex", borderRadius: 30, overflow: "hidden", background: "#F7F6FD", boxShadow: "40px 70px 120px rgba(43,20,140,.22)", border: "1px solid #E6E3F7" }}>
    <div style={{ width: 210, background: `linear-gradient(180deg, ${V.navy2}, ${V.purple})`, padding: "26px 16px", boxSizing: "border-box" }}>
      <Img src={staticFile("venvers/logo-venvers.png")} style={{ height: 30, marginBottom: 30, marginLeft: 8 }} />
      {MODS.map(([m, d], i) => (
        <div key={m} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 12px", borderRadius: 14, marginBottom: 6, fontSize: 19, fontWeight: 600, color: i === active ? INK : "rgba(255,255,255,.8)", background: i === active ? "#fff" : "transparent" }}>
          <Icon d={d} c={i === active ? V.purple : "#D9CFFF"} s={22} />
          {m}
        </div>
      ))}
    </div>
    <div style={{ flex: 1, padding: "26px 30px", boxSizing: "border-box" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Big size={32}>{title}</Big>
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ width: 150, height: 40, borderRadius: 12, background: "#fff", border: "1px solid #E6E3F7" }} />
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#E2DBFF" }} />
        </div>
      </div>
      <div style={{ marginTop: 22 }}>{children}</div>
    </div>
  </div>
);

const Row: React.FC<{ cols: React.ReactNode[]; head?: boolean; tmpl: string }> = ({ cols, head, tmpl }) => (
  <div style={{ display: "grid", gridTemplateColumns: tmpl, alignItems: "center", padding: "13px 18px", fontSize: head ? 15 : 18, fontWeight: head ? 700 : 500, color: head ? "#9A9EB8" : INK, background: head ? "transparent" : "#fff", borderRadius: 14, marginBottom: 8 }}>
    {cols.map((c, i) => (
      <span key={i}>{c}</span>
    ))}
  </div>
);

const CFDI_ROWS: [string, string, string, "ok" | "warn" | "bad", string][] = [
  ["Aceros del Norte", "F-10234", "$48,500", "ok", "Validado"],
  ["Logística Rivas", "A-2291", "$12,780", "ok", "Validado"],
  ["Empaques Sol", "E-0871", "$6,320", "warn", "En revisión"],
  ["Servicios Lumen", "SL-118", "$22,100", "ok", "Programado"],
  ["Grupo Andino", "GA-554", "$9,450", "ok", "Pagado"],
];

const CfdiTable: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <div>
    <Row head tmpl="1.6fr 1fr 1fr 1.1fr" cols={["Proveedor", "Folio", "Total", "Estatus"]} />
    {CFDI_ROWS.slice(0, rows).map((r) => (
      <Row key={r[1]} tmpl="1.6fr 1fr 1fr 1.1fr" cols={[<b key="p">{r[0]}</b>, r[1], r[2], <Chip key="c" kind={r[3]}>{r[4]}</Chip>]} />
    ))}
  </div>
);

/* ================= scenes ================= */

// Slide 1 — invoices and rejections arriving by email, one by one.
const INBOX: [string, string, "bad" | "warn", string][] = [
  ["Aceros del Norte", "RE: Factura F-1023 rechazada", "bad", "Rechazo"],
  ["Logística Rivas", "RE: RE: ¿Ya está programado mi pago?", "warn", "Pago"],
  ["Empaques Sol", "Fwd: CFDI con RFC incorrecto", "bad", "Rechazo"],
  ["Servicios Lumen", "Aclaración de factura SL-118", "bad", "Aclaración"],
  ["Grupo Andino", "RE: ¿Cuándo pagan la GA-554?", "warn", "Pago"],
  ["Textiles Orión", "Factura 8812 (reenvío)", "bad", "Rechazo"],
];

export const SceneInbox: React.FC<{ x: number; y: number; w: number; h: number }> = (p) => (
  <IsoStage {...p} planeW={980} planeH={720}>
    <Layer x={0} y={0} z={0} w={980} h={720}>
      <div style={{ width: 980, height: 720, borderRadius: 30, background: "#F7F6FD", boxShadow: "40px 70px 120px rgba(43,20,140,.22)", border: "1px solid #E6E3F7", padding: "26px 30px", boxSizing: "border-box" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <IconTile d={I.mail} s={48} />
          <Big size={32}>Bandeja de entrada</Big>
          <Chip kind="bad" size={18}>47 sin leer</Chip>
        </div>
        <div style={{ marginTop: 20 }}>
          {INBOX.map(([f, s, k, t]) => (
            <div key={f} style={{ display: "flex", alignItems: "center", gap: 16, background: "#fff", borderRadius: 16, padding: "14px 18px", marginBottom: 10 }}>
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: V.violet }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <span style={{ fontSize: 20, fontWeight: 700, color: INK }}>{f}</span>
                  <Chip kind={k} size={14}>{t}</Chip>
                </div>
                <div style={{ fontSize: 17, color: MUTED }}>{s}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layer>
    <Layer x={600} y={40} z={110} w={330}>
      <GCard z={110}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <IconTile d={I.mail} s={50} bg="rgba(255,255,255,.2)" />
          <div>
            <Label c="rgba(255,255,255,.8)">Correos sin leer</Label>
            <Big c="#fff" size={52}>+47</Big>
          </div>
        </div>
        <div style={{ marginTop: 14 }}>
          <Bars vals={[0.3, 0.45, 0.4, 0.6, 0.75, 1]} w={280} h={70} light />
        </div>
      </GCard>
    </Layer>
    <Layer x={40} y={330} z={120} w={380}>
      <WCard z={120} style={{ borderLeft: `8px solid ${V.bad}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <IconTile d={I.x} s={46} bg={V.bad} />
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: INK }}>Factura rechazada</div>
            <div style={{ fontSize: 17, color: MUTED }}>F-1023 · RFC incorrecto</div>
          </div>
        </div>
      </WCard>
    </Layer>
    <Layer x={560} y={520} z={90} w={400}>
      <WCard z={90}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#E2DBFF", flexShrink: 0 }} />
          <div style={{ background: "#F1EDFF", borderRadius: "4px 18px 18px 18px", padding: "12px 16px", fontSize: 19, color: INK, fontWeight: 600 }}>¿Ya está programado mi pago?</div>
        </div>
      </WCard>
    </Layer>
  </IsoStage>
);

// Slide 2 — one portal for tenders, files, orders, CFDI and payments.
export const ScenePortal: React.FC<{ x: number; y: number; w: number; h: number }> = (p) => (
  <IsoStage {...p} planeW={1040} planeH={700}>
    <Layer x={0} y={0} z={0} w={1040} h={700}>
      <Screen w={1040} h={700} active={0} title="Mi portal">
        <div style={{ display: "flex", gap: 14 }}>
          {[
            ["Licitaciones", "12"],
            ["Órdenes", "34"],
            ["CFDI", "128"],
          ].map(([k, v]) => (
            <div key={k} style={{ flex: 1, background: "#fff", borderRadius: 16, padding: "14px 16px" }}>
              <Label>{k}</Label>
              <Big size={34}>{v}</Big>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 14 }}>
          <CfdiTable rows={4} />
        </div>
      </Screen>
    </Layer>
    <Layer x={-90} y={60} z={140} w={300}>
      <GCard z={140}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <IconTile d={I.building} s={46} bg="rgba(255,255,255,.2)" />
          <div style={{ fontSize: 22, fontWeight: 700 }}>Licitaciones</div>
        </div>
        <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <Big c="#fff" size={44}>12</Big>
          <Label c="rgba(255,255,255,.8)">activas</Label>
        </div>
      </GCard>
    </Layer>
    <Layer x={380} y={30} z={80} w={300}>
      <WCard z={80}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <IconTile d={I.folder} s={46} />
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: INK }}>Expedientes</div>
            <Chip kind="ok" size={15}>Completos</Chip>
          </div>
        </div>
      </WCard>
    </Layer>
    <Layer x={780} y={80} z={120} w={320}>
      <GCard z={120}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <IconTile d={I.card} s={46} bg="rgba(255,255,255,.2)" />
          <div style={{ fontSize: 22, fontWeight: 700 }}>Pagos</div>
        </div>
        <Big c="#fff" size={40}>$1.2M</Big>
        <Label c="rgba(255,255,255,.8)">programados este mes</Label>
        <div style={{ marginTop: 10 }}>
          <Bars vals={[0.4, 0.55, 0.5, 0.7, 0.85, 1]} w={270} h={60} light />
        </div>
      </GCard>
    </Layer>
    <Layer x={720} y={470} z={120} w={330}>
      <WCard z={120}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <IconTile d={I.receipt} s={46} />
          <div style={{ fontSize: 22, fontWeight: 700, color: INK }}>Órdenes de compra</div>
        </div>
        <div style={{ marginTop: 10 }}>
          <Line pts={[0.2, 0.35, 0.3, 0.55, 0.5, 0.8]} w={280} h={60} />
        </div>
      </WCard>
    </Layer>
    <Layer x={-40} y={520} z={100} w={300}>
      <WCard z={100}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <IconTile d={I.docCheck} s={46} bg={V.ok} />
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: INK }}>CFDI</div>
            <Label>128 recibidos</Label>
          </div>
        </div>
      </WCard>
    </Layer>
  </IsoStage>
);

// Slide 3 — validated CFDI, fewer clarification emails.
export const SceneCfdi: React.FC<{ x: number; y: number; w: number; h: number }> = (p) => (
  <IsoStage {...p} planeW={1000} planeH={680}>
    <Layer x={0} y={0} z={0} w={1000} h={680}>
      <Screen w={1000} h={680} active={3} title="CFDI recibidos">
        <CfdiTable rows={5} />
      </Screen>
    </Layer>
    <Layer x={600} y={40} z={110} w={360}>
      <GCard z={110}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 62, height: 62, borderRadius: "50%", background: V.ok, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 20px rgba(0,0,0,.2)" }}>
            <Icon d={I.check} s={36} sw={3} />
          </div>
          <div>
            <div style={{ fontSize: 26, fontWeight: 700 }}>CFDI validado</div>
            <Label c="rgba(255,255,255,.85)">Ante el SAT · F-10234</Label>
          </div>
        </div>
      </GCard>
    </Layer>
    <Layer x={-90} y={380} z={130} w={360}>
      <WCard z={130}>
        <Label>Correos de aclaración</Label>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Big size={36}>Menos correos</Big>
        </div>
        <div style={{ marginTop: 10 }}>
          <Line pts={[0.95, 0.8, 0.85, 0.55, 0.4, 0.22]} w={300} h={70} color={V.ok} />
        </div>
      </WCard>
    </Layer>
    <Layer x={660} y={470} z={100} w={340}>
      <WCard z={100}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <IconTile d={I.clock} s={46} />
          <div>
            <Label>Estatus de pago</Label>
            <div style={{ fontSize: 22, fontWeight: 700, color: INK }}>Programado · 15 oct</div>
          </div>
        </div>
      </WCard>
    </Layer>
  </IsoStage>
);

// Slide 4 — the three features, one floating card each (numbered 1-3).
const Num: React.FC<{ n: number }> = ({ n }) => (
  <div style={{ position: "absolute", top: -20, left: -20, width: 46, height: 46, borderRadius: "50%", background: "#fff", color: V.purple, fontWeight: 800, fontSize: 24, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 16px rgba(43,20,140,.25)" }}>{n}</div>
);

export const SceneFeatures: React.FC<{ x: number; y: number; w: number; h: number }> = (p) => (
  <IsoStage {...p} planeW={1000} planeH={640}>
    <Layer x={0} y={0} z={0} w={1000} h={640}>
      <Screen w={1000} h={640} active={4} title="Cuentas por pagar">
        <CfdiTable rows={4} />
      </Screen>
    </Layer>
    <Layer x={40} y={30} z={120} w={340} style={{ position: "absolute" }}>
      <WCard z={120} style={{ position: "relative" }}>
        <Num n={1} />
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <IconTile d={I.docCheck} s={50} />
          <div>
            <div style={{ fontSize: 21, fontWeight: 700, color: INK }}>CFDI recibido</div>
            <Chip kind="ok" size={15}>Validado</Chip>
          </div>
        </div>
        <div style={{ marginTop: 12, height: 10, borderRadius: 999, background: "#EEEAFE" }}>
          <div style={{ width: "100%", height: "100%", borderRadius: 999, background: V.ok }} />
        </div>
      </WCard>
    </Layer>
    <Layer x={360} y={20} z={90} w={360}>
      <WCard z={120} style={{ position: "relative" }}>
        <Num n={2} />
        <Label>Estatus visible para tu proveedor</Label>
        <div style={{ display: "flex", alignItems: "center", marginTop: 12 }}>
          {["Recibida", "Validada", "Programada", "Pagada"].map((s, i) => (
            <React.Fragment key={s}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div style={{ width: 26, height: 26, borderRadius: "50%", background: i < 3 ? V.purple : "#E2DBFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {i < 3 && <Icon d={I.check} s={16} sw={3} />}
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: i < 3 ? INK : MUTED }}>{s}</span>
              </div>
              {i < 3 && <div style={{ flex: 1, height: 4, background: i < 2 ? V.purple : "#E2DBFF", margin: "0 4px 20px" }} />}
            </React.Fragment>
          ))}
        </div>
      </WCard>
    </Layer>
    <Layer x={720} y={260} z={180} w={330}>
      <GCard z={180} style={{ position: "relative" }}>
        <Num n={3} />
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <IconTile d={I.bolt} s={46} bg="rgba(255,255,255,.2)" />
          <div style={{ fontSize: 22, fontWeight: 700 }}>Pronto pago</div>
        </div>
        <Big c="#fff" size={40}>$48,500</Big>
        <Label c="rgba(255,255,255,.85)">Conciliado · disponible hoy</Label>
        <div style={{ marginTop: 12, background: "#fff", color: V.purple, borderRadius: 12, padding: "10px 0", textAlign: "center", fontWeight: 700, fontSize: 18 }}>Solicitar</div>
      </GCard>
    </Layer>
  </IsoStage>
);

// Slide 5 — hero composition for the demo CTA.
export const SceneHero: React.FC<{ x: number; y: number; w: number; h: number }> = (p) => (
  <IsoStage {...p} planeW={1040} planeH={700}>
    <Layer x={0} y={0} z={0} w={1040} h={700}>
      <Screen w={1040} h={700} active={3} title="Panel de proveedores">
        <div style={{ display: "flex", gap: 14 }}>
          <div style={{ flex: 1.3, background: "#fff", borderRadius: 16, padding: 16 }}>
            <Label>Pagos programados</Label>
            <Big size={34}>$1,284,500</Big>
            <div style={{ marginTop: 8 }}>
              <Bars vals={[0.35, 0.5, 0.45, 0.65, 0.6, 0.8, 1]} w={380} h={110} />
            </div>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              ["CFDI validados", "121"],
              ["Proveedores activos", "86"],
            ].map(([k, v]) => (
              <div key={k} style={{ background: "#fff", borderRadius: 16, padding: "14px 16px" }}>
                <Label>{k}</Label>
                <Big size={34}>{v}</Big>
              </div>
            ))}
          </div>
        </div>
        <div style={{ marginTop: 14 }}>
          <CfdiTable rows={3} />
        </div>
      </Screen>
    </Layer>
    <Layer x={640} y={30} z={120} w={360}>
      <GCard z={120}>
        <Label c="rgba(255,255,255,.85)">Pago a proveedor</Label>
        <Big c="#fff" size={46}>$302,000</Big>
        <div style={{ marginTop: 10 }}>
          <Chip kind="ok" size={16}>Conciliado</Chip>
        </div>
      </GCard>
    </Layer>
    <Layer x={-100} y={400} z={150} w={330}>
      <GCard z={150}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <IconTile d={I.docCheck} s={50} bg="rgba(255,255,255,.2)" />
          <div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>CFDI validado</div>
            <Label c="rgba(255,255,255,.85)">Aceros del Norte</Label>
          </div>
        </div>
      </GCard>
    </Layer>
    <Layer x={760} y={420} z={120} w={320}>
      <WCard z={120}>
        <Label>Licitaciones</Label>
        <Big size={36}>12 activas</Big>
        <div style={{ marginTop: 8 }}>
          <Line pts={[0.2, 0.4, 0.35, 0.6, 0.55, 0.9]} w={270} h={60} />
        </div>
      </WCard>
    </Layer>
  </IsoStage>
);
