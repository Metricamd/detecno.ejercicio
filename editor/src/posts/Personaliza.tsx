// Instagram carousel 4:5 (1080×1350) — "Personaliza tu plan" (brief #2), v2.
// Series look (palette, Poppins, glossy 3D, Fispal UI) with the user's
// corrections: no black pills, brand blue (#250E94) instead of black, more 3D,
// livelier layouts (tilts, overlaps, colour shapes) and a photo per slide.
// Each slide is a 60-frame Sequence; stills are rendered at i * 60 + STILL_AT.
import React, { useEffect, useState } from "react";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  getStaticFiles,
  Img,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Dashboard } from "../fispal/Dashboard";
import { C, FONT, MONO, fontsLoaded } from "../fispal/theme";
import { Stage } from "../fispal/three/Stage";
import {
  ApiNodes,
  Blocks,
  CheckBadge,
  Glossy,
  IdBadge,
  Invoices,
  Modules,
  Orb,
  People,
  Pop,
} from "../fispal/three/objects";
import { InvoiceTiers } from "../fispal/three/objects2";
import { Background, Check } from "../fispal/ui";

export const POST_W = 1080;
export const POST_H = 1350;
export const SLIDE_FRAMES = 60;
export const STILL_AT = 50;

const TOTAL = 6;
const BLUE = C.purple; // brand blue replaces black everywhere
const MUTED = "#5B5F86";
const SHADOW = "0 24px 60px rgba(37,14,148,.16), 0 2px 6px rgba(37,14,148,.06)";

/* ---------- shared pieces ---------- */

type Seg = string | { hl: string };

const Headline: React.FC<{ parts: Seg[]; size?: number }> = ({ parts, size = 70 }) => (
  <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: size, lineHeight: 1.06, letterSpacing: "-0.03em", color: BLUE }}>
    {parts.map((p, i) =>
      typeof p === "string" ? <span key={i}>{p}</span> : <span key={i} style={{ color: C.accent }}>{p.hl}</span>,
    )}
  </div>
);

const Sub: React.FC<{ children: React.ReactNode; width?: number }> = ({ children, width }) => (
  <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 32, lineHeight: 1.35, color: MUTED, marginTop: 18, maxWidth: width }}>
    {children}
  </div>
);

// Photo slot: shows public/photos/<name>.jpg when it exists, otherwise a
// branded placeholder so the layout can be reviewed before the photo arrives.
const Photo: React.FC<{
  name: string;
  hint: string;
  style: React.CSSProperties;
  radius?: number | string;
  position?: string;
}> = ({ name, hint, style, radius = 36, position = "center" }) => {
  const file = `photos/${name}.jpg`;
  const has = getStaticFiles().some((f) => f.name === file);
  return (
    <div style={{ position: "absolute", overflow: "hidden", borderRadius: radius, boxShadow: SHADOW, ...style }}>
      {has ? (
        <Img src={staticFile(file)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: position }} />
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: `linear-gradient(140deg, #3B25B8, ${BLUE} 55%, #1A0A6B)`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 14,
            color: "rgba(255,255,255,.85)",
            fontFamily: FONT,
            textAlign: "center",
            padding: 30,
            boxSizing: "border-box",
          }}
        >
          <svg width={70} height={56} viewBox="0 0 70 56">
            <rect x={3} y={10} width={64} height={43} rx={10} fill="none" stroke={C.accent} strokeWidth={5} />
            <circle cx={35} cy={31} r={11} fill="none" stroke={C.accent} strokeWidth={5} />
            <rect x={22} y={3} width={26} height={10} rx={4} fill={C.accent} />
          </svg>
          <div style={{ fontWeight: 700, fontSize: 26 }}>Foto</div>
          <div style={{ fontWeight: 500, fontSize: 20, opacity: 0.8 }}>{hint}</div>
        </div>
      )}
    </div>
  );
};

// Flat colour shapes behind the content for a livelier composition.
const Blob: React.FC<{ style: React.CSSProperties; color?: string; rotate?: number; radius?: number | string }> = ({
  style,
  color = C.accent,
  rotate = 0,
  radius = "50%",
}) => <div style={{ position: "absolute", background: color, borderRadius: radius, transform: `rotate(${rotate}deg)`, ...style }} />;

const Dots: React.FC<{ x: number; y: number; cols?: number; rows?: number; color?: string }> = ({
  x,
  y,
  cols = 6,
  rows = 4,
  color = BLUE,
}) => (
  <svg width={cols * 26} height={rows * 26} style={{ position: "absolute", left: x, top: y, opacity: 0.25 }}>
    {Array.from({ length: cols * rows }).map((_, i) => (
      <circle key={i} cx={13 + (i % cols) * 26} cy={13 + Math.floor(i / cols) * 26} r={4} fill={color} />
    ))}
  </svg>
);

const Chip: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      fontFamily: FONT,
      fontWeight: 700,
      fontSize: 26,
      color: BLUE,
      background: C.white,
      border: `3px solid ${C.accent}`,
      borderRadius: 999,
      padding: "10px 22px",
      boxShadow: "0 10px 24px rgba(37,14,148,.10)",
      ...style,
    }}
  >
    {children}
  </span>
);

const IconTile: React.FC<{ code: string; size?: number; color?: string }> = ({ code, size = 72, color = BLUE }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.26,
      background: color,
      color: C.white,
      fontFamily: MONO,
      fontWeight: 700,
      fontSize: size * 0.28,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }}
  >
    {code}
  </div>
);

// Decorative 3D floaters placed by hand (px on the 1080×1350 slide) in empty
// zones so they never cover text. Camera z=16, fov 30 → 157.5 px per unit.
type Floater = [x: number, y: number, r: number, color: string, torus?: boolean];
const PX = 157.5;
const PostFloaters: React.FC<{ items: Floater[] }> = ({ items }) => {
  const frame = useCurrentFrame();
  return (
    <>
      {items.map(([x, y, r, color, torus], i) => (
        <mesh
          key={i}
          position={[(x - POST_W / 2) / PX, (POST_H / 2 - y) / PX, 0]}
          rotation={[0.6 + i + frame * 0.02, 0.4 + frame * 0.015, i]}
        >
          {torus ? <torusGeometry args={[r / PX, (r / PX) * 0.38, 24, 64]} /> : <sphereGeometry args={[r / PX, 48, 48]} />}
          <Glossy color={color} />
        </mesh>
      ))}
    </>
  );
};

const G = C.accent;
const P = C.purple;
const L = "#C9C2FF";

const Frame: React.FC<{
  n: number;
  head: React.ReactNode;
  back?: React.ReactNode;
  floaters: Floater[];
  children: React.ReactNode;
  last?: boolean;
}> = ({ n, head, back, floaters, children, last }) => (
  <AbsoluteFill style={{ overflow: "hidden" }}>
    <Background />
    {back}
    {/* floating 3D accents in empty zones */}
    <Stage top={0} height={POST_H} z={16}>
      <PostFloaters items={floaters} />
    </Stage>
    <div style={{ position: "absolute", left: 70, right: 70, top: 62, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <Img src={staticFile("brand/fispal-logo.png")} style={{ height: 50 }} />
      <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 26, color: BLUE, letterSpacing: "0.08em" }}>
        <span style={{ color: C.accent }}>{`0${n}`}</span> / 0{TOTAL}
      </span>
    </div>
    <div style={{ position: "absolute", left: 70, right: 70, top: 158, zIndex: 2 }}>{head}</div>
    {children}
    {!last && (
      <div style={{ position: "absolute", left: 70, right: 70, bottom: 56, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 26, color: BLUE }}>fispal.mx</span>
        <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 28, color: C.white, background: BLUE, borderRadius: 999, padding: "12px 30px" }}>
          Desliza →
        </span>
      </div>
    )}
  </AbsoluteFill>
);

/* ---------- Slide 1 — portada ---------- */
const S1: React.FC = () => (
  <Frame
    n={1}
    floaters={[[1035, 960, 40, P], [540, 1292, 26, L, true], [1040, 430, 22, G]]}
    back={
      <>
        <Blob style={{ right: -140, top: 430, width: 640, height: 640 }} color="#D6F8EC" />
        <Dots x={70} y={1040} />
      </>
    }
    head={
      <>
        <Headline parts={["Elige lo que necesitas. Fispal ", { hl: "se adapta." }]} />
        <Sub width={620}>Configura tu plan a la medida de tu operación.</Sub>
      </>
    }
  >
    <Photo
      name="s1"
      hint="Emprendedora en su oficina"
      style={{ left: 540, top: 470, width: 470, height: 640, transform: "rotate(3deg)", border: `8px solid ${C.white}` }}
      radius="240px 240px 36px 36px"
    />
    <div style={{ position: "absolute", left: 60, top: 800, width: 600, borderRadius: 22, overflow: "hidden", boxShadow: SHADOW, transform: "rotate(-4deg)", border: `6px solid ${C.white}` }}>
      <div style={{ transform: "scale(0.625)", transformOrigin: "0 0", height: 330 }}>
        <Dashboard reveal={-100} />
      </div>
    </div>
    <Stage top={430} left={30} width={470} height={360}>
      <Pop at={0} scale={0.85}>
        <Blocks at={0} />
      </Pop>
    </Stage>
    <div style={{ position: "absolute", left: 70, right: 70, top: 1140, display: "flex", flexWrap: "wrap", gap: 12 }}>
      {["CFDI", "RFC", "Módulos", "Colaboradores", "API"].map((c) => (
        <Chip key={c} style={{ fontSize: 24, padding: "8px 20px" }}>
          <span style={{ width: 10, height: 10, borderRadius: 5, background: C.accent }} />
          {c}
        </Chip>
      ))}
    </div>
    <Stage top={380} left={860} width={220} height={220}>
      <Pop at={0} scale={0.5}>
        <Orb />
      </Pop>
    </Stage>
  </Frame>
);

/* ---------- Slide 2 — paquetes de CFDI ---------- */
const TIERS = [
  { name: "Inicial", qty: "500" },
  { name: "Crecimiento", qty: "2,000", picked: true },
  { name: "Volumen", qty: "10,000" },
];

const S2: React.FC = () => (
  <Frame
    n={2}
    floaters={[[540, 1292, 28, G, true], [36, 470, 26, P], [1045, 1000, 24, L]]}
    back={
      <>
        <Blob style={{ left: -120, top: 520, width: 520, height: 520 }} color="#E3E6FF" radius={120} rotate={18} />
        <Dots x={860} y={420} cols={5} rows={3} />
      </>
    }
    head={
      <>
        <Headline parts={["Empieza por el ", { hl: "volumen" }, " de tu operación."]} />
        <Sub>Selecciona el paquete de CFDI que necesitas.</Sub>
      </>
    }
  >
    <Photo
      name="s2"
      hint="Operación / almacén con tablet"
      style={{ left: 60, top: 480, width: 440, height: 470, transform: "rotate(-3deg)", border: `8px solid ${C.white}` }}
    />
    <Stage top={430} left={440} width={640} height={540}>
      <Pop at={0} spin={0} tilt={0.05} scale={1.05}>
        <InvoiceTiers selected={1} />
      </Pop>
    </Stage>
    <Stage top={860} left={-20} width={260} height={220}>
      <Pop at={0} scale={0.42} tilt={0.3}>
        <Invoices />
      </Pop>
    </Stage>
    <div style={{ position: "absolute", left: 70, right: 70, top: 1000, display: "flex", gap: 20 }}>
      {TIERS.map((t, i) => (
        <div
          key={t.name}
          style={{
            flex: 1,
            position: "relative",
            background: t.picked ? BLUE : C.white,
            borderRadius: 28,
            padding: "22px 22px",
            boxShadow: SHADOW,
            fontFamily: FONT,
            transform: `rotate(${[-2, 0, 2][i]}deg) translateY(${t.picked ? -18 : 0}px)`,
          }}
        >
          {t.picked && (
            <div style={{ position: "absolute", top: -20, right: 16 }}>
              <Check size={48} />
            </div>
          )}
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 19, letterSpacing: "0.08em", color: t.picked ? C.accent : "#8A8DA0", textTransform: "uppercase" }}>
            {t.name}
          </div>
          <div style={{ fontWeight: 800, fontSize: 52, color: t.picked ? C.white : BLUE, letterSpacing: "-0.03em", marginTop: 4 }}>{t.qty}</div>
          <div style={{ fontWeight: 600, fontSize: 21, color: t.picked ? "rgba(255,255,255,.8)" : MUTED }}>CFDI / año</div>
        </div>
      ))}
    </div>
  </Frame>
);

/* ---------- Slide 3 — RFC principal + adicionales ---------- */
const EXTRA_RFC = [
  { x: 80, y: 560, rfc: "EKU9003173C9", rot: -3 },
  { x: 690, y: 540, rfc: "IIA040805DZ4", rot: 3 },
];

const S3: React.FC = () => {
  const cx = 560;
  const cy = 860;
  return (
    <Frame
      n={3}
      floaters={[[1040, 790, 38, L, true], [540, 1292, 24, P], [40, 780, 28, G]]}
      back={
        <>
          <Blob style={{ left: 300, top: 600, width: 520, height: 520 }} color="#D6F8EC" />
          <Dots x={820} y={1080} cols={6} rows={3} />
        </>
      }
      head={
        <>
          <Headline parts={["¿Necesitas administrar ", { hl: "más RFC?" }]} />
          <Sub>Agrega RFC adicionales a tu plan de acuerdo con tu operación.</Sub>
        </>
      }
    >
      <svg width={POST_W} height={POST_H} style={{ position: "absolute", inset: 0 }}>
        {[[230, 640], [840, 620], [240, 1000], [850, 1080]].map(([x, y], i) => (
          <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke={C.accent} strokeWidth={6} strokeDasharray="14 12" strokeLinecap="round" />
        ))}
      </svg>
      <Stage top={cy - 230} left={cx - 280} width={560} height={460}>
        <Pop at={0} scale={1.15} spin={0} tilt={0.1}>
          <group rotation={[0.15, -0.3, 0]}>
            <IdBadge />
          </group>
        </Pop>
      </Stage>
      <div style={{ position: "absolute", left: cx - 140, top: cy + 175, width: 280, textAlign: "center" }}>
        <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 28, color: C.white, background: BLUE, borderRadius: 999, padding: "10px 26px" }}>
          RFC principal
        </span>
      </div>
      {EXTRA_RFC.map((r) => (
        <div
          key={r.rfc}
          style={{
            position: "absolute",
            left: r.x,
            top: r.y,
            width: 300,
            background: C.white,
            borderRadius: 24,
            padding: "18px 22px",
            boxShadow: SHADOW,
            fontFamily: FONT,
            transform: `rotate(${r.rot}deg)`,
          }}
        >
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 18, letterSpacing: "0.08em", color: "#0E8F63" }}>RFC ADICIONAL</div>
          <div style={{ fontWeight: 700, fontSize: 28, color: BLUE, marginTop: 4 }}>{r.rfc}</div>
        </div>
      ))}
      {/* photo node: the business owner behind the extra RFCs */}
      <Photo
        name="s3"
        hint="Empresario revisando datos"
        style={{ left: 70, top: 900, width: 330, height: 330, border: `8px solid ${C.white}` }}
        radius="50%"
      />
      <Chip style={{ position: "absolute", left: 150, top: 1185, fontSize: 22, padding: "6px 18px" }}>+ 3 RFC</Chip>
      <div
        style={{
          position: "absolute",
          left: 720,
          top: 1020,
          width: 270,
          height: 110,
          borderRadius: 26,
          border: `4px dashed ${C.accent}`,
          background: "rgba(255,255,255,.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: 30,
          color: "#0E8F63",
          transform: "rotate(-2deg)",
        }}
      >
        <span style={{ fontSize: 46, lineHeight: 1 }}>+</span> Agregar RFC
      </div>
    </Frame>
  );
};

/* ---------- Slide 4 — módulos activables ---------- */
const MODS = [
  { code: "AUD", name: "Auditoría", desc: "Revisa y valida tus CFDI" },
  { code: "RSG", name: "Riesgo", desc: "Detecta proveedores en listas del SAT" },
  { code: "CAN", name: "Cancelaciones", desc: "Gestiona cancelaciones en un solo lugar" },
];

const Toggle: React.FC = () => (
  <div style={{ width: 84, height: 48, borderRadius: 24, background: C.accent, position: "relative", flexShrink: 0 }}>
    <div style={{ position: "absolute", top: 5, left: 41, width: 38, height: 38, borderRadius: 19, background: C.white, boxShadow: "0 2px 6px rgba(0,0,0,.15)" }} />
  </div>
);

const S4: React.FC = () => (
  <Frame
    n={4}
    floaters={[[590, 1292, 26, L, true], [1045, 420, 28, G]]}
    back={
      <>
        <Blob style={{ right: -100, top: 450, width: 520, height: 760 }} color="#E3E6FF" radius={80} rotate={8} />
        <Dots x={70} y={1110} cols={8} rows={2} />
      </>
    }
    head={
      <>
        <Headline parts={["Suma las ", { hl: "herramientas" }, " que necesitas."]} />
        <Sub>Complementa tu plan con módulos como:</Sub>
      </>
    }
  >
    <Photo
      name="s4"
      hint="Analista revisando reportes"
      style={{ left: 660, top: 470, width: 370, height: 540, transform: "rotate(3deg)", border: `8px solid ${C.white}` }}
    />
    <div style={{ position: "absolute", left: 60, top: 500, width: 570, display: "flex", flexDirection: "column", gap: 18 }}>
      {MODS.map((m, i) => (
        <div
          key={m.code}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            background: C.white,
            border: `4px solid ${C.accent}`,
            borderRadius: 28,
            padding: "20px 24px",
            boxShadow: SHADOW,
            fontFamily: FONT,
            transform: `translateX(${[0, 24, 0][i]}px) rotate(${[-1.5, 1, -1][i]}deg)`,
          }}
        >
          <IconTile code={m.code} size={70} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 34, color: BLUE }}>{m.name}</div>
            <div style={{ fontWeight: 500, fontSize: 21, color: MUTED }}>{m.desc}</div>
          </div>
          <Toggle />
        </div>
      ))}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: `4px dashed ${BLUE}`,
          borderRadius: 28,
          padding: "18px 24px",
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: 30,
          color: BLUE,
          background: "rgba(255,255,255,.6)",
          opacity: 0.7,
        }}
      >
        + y más módulos
      </div>
    </div>
    <Stage top={900} left={600} width={480} height={360}>
      <Pop at={0} scale={0.7}>
        <Modules at={0} />
      </Pop>
    </Stage>
    <Stage top={400} left={520} width={200} height={200}>
      <Pop at={0} scale={0.35} spin={0.003}>
        <CheckBadge />
      </Pop>
    </Stage>
  </Frame>
);

/* ---------- Slide 5 — Equipo → Fispal → Sistemas/API ---------- */
const Arrow: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <svg width={100} height={60} style={{ position: "absolute", left: x, top: y }} viewBox="0 0 100 60">
    <path d="M6 30h76" stroke={C.accent} strokeWidth={8} strokeLinecap="round" strokeDasharray="2 16" />
    <path d="M70 12l20 18-20 18" fill="none" stroke={C.accent} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const NodeLabel: React.FC<{ x: number; title: string; sub: string }> = ({ x, title, sub }) => (
  <div style={{ position: "absolute", left: x - 150, top: 1120, width: 300, textAlign: "center", fontFamily: FONT }}>
    <div style={{ fontWeight: 800, fontSize: 34, color: BLUE }}>{title}</div>
    <div style={{ fontWeight: 500, fontSize: 22, color: MUTED, marginTop: 2 }}>{sub}</div>
  </div>
);

const S5: React.FC = () => (
  <Frame
    n={5}
    floaters={[[40, 480, 30, G, true], [540, 1292, 24, P], [1045, 480, 22, L]]}
    head={
      <>
        <Headline size={62} parts={["Haz que Fispal ", { hl: "se integre" }, " a tu forma de trabajar."]} />
        <Sub>Agrega licencias para colaboradores e integraciones por API según las necesidades de tu empresa.</Sub>
      </>
    }
  >
    <Photo
      name="s5"
      hint="Equipo trabajando en laptop"
      style={{ left: 60, top: 530, width: 960, height: 330, transform: "rotate(-1.5deg)", border: `8px solid ${C.white}` }}
      position="center 35%"
    />
    {/* "tu equipo" tag on the photo */}
    <Chip style={{ position: "absolute", left: 100, top: 790, fontSize: 24 }}>Tu equipo</Chip>
    <Stage top={880} height={300}>
      <Pop at={0} position={[-4.4, 0, 0]} scale={0.75} spin={0.004}>
        <People />
      </Pop>
      <Pop at={0} position={[4.4, 0, 0]} scale={0.68}>
        <ApiNodes />
      </Pop>
    </Stage>
    <div
      style={{
        position: "absolute",
        left: 540 - 130,
        top: 900,
        width: 260,
        height: 200,
        borderRadius: 34,
        background: C.white,
        boxShadow: SHADOW,
        border: `4px solid ${C.accent}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Img src={staticFile("brand/fispal-logo.png")} style={{ width: 196 }} />
    </div>
    <Stage top={840} left={600} width={160} height={160}>
      <Pop at={0} scale={0.3}>
        <Orb />
      </Pop>
    </Stage>
    <Arrow x={300} y={970} />
    <Arrow x={690} y={970} />
    <NodeLabel x={190} title="Equipo" sub="Licencias para colaboradores" />
    <NodeLabel x={540} title="Fispal" sub="Tu centro fiscal" />
    <NodeLabel x={890} title="Sistemas" sub="Integraciones por API" />
  </Frame>
);

/* ---------- Slide 6 — CTA ---------- */
const PLAN = [
  { code: "XML", title: "Paquete de CFDI", sub: "2,000 CFDI / año" },
  { code: "RFC", title: "RFC adicionales", sub: "+3 RFC" },
  { code: "MOD", title: "Módulos", sub: "Auditoría · Riesgo · Cancelaciones" },
  { code: "USR", title: "Colaboradores", sub: "+5 licencias" },
  { code: "API", title: "Integraciones API", sub: "REST · Webhooks" },
];

const S6: React.FC = () => (
  <Frame
    n={6}
    floaters={[[1040, 1010, 34, P], [70, 1250, 40, G, true]]}
    last
    back={
      <>
        <Blob style={{ left: -160, top: 640, width: 620, height: 620 }} color="#D6F8EC" />
        <Dots x={860} y={180} cols={6} rows={3} />
      </>
    }
    head={<Headline size={96} parts={[{ hl: "Personaliza" }, " tu plan"]} />}
  >
    <Photo
      name="s6"
      hint="Persona celebrando frente a su laptop"
      style={{ left: 60, top: 330, width: 400, height: 560, transform: "rotate(-3deg)", border: `8px solid ${C.white}` }}
      radius="200px 200px 36px 36px"
    />
    <div
      style={{
        position: "absolute",
        left: 400,
        top: 360,
        width: 620,
        background: C.white,
        borderRadius: 30,
        padding: "26px 28px",
        boxShadow: SHADOW,
        fontFamily: FONT,
        transform: "rotate(2deg)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <div style={{ fontSize: 34, fontWeight: 800, color: BLUE }}>Arma tu plan</div>
        <div style={{ fontFamily: MONO, fontSize: 20, fontWeight: 700, color: C.white, background: C.accent, borderRadius: 999, padding: "6px 16px" }}>5/5</div>
      </div>
      {PLAN.map((p) => (
        <div
          key={p.code}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "12px 14px",
            marginTop: 10,
            borderRadius: 16,
            border: `3px solid ${C.accent}`,
            background: "#F2FDF8",
          }}
        >
          <IconTile code={p.code} size={56} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 26, fontWeight: 700, color: BLUE }}>{p.title}</div>
            <div style={{ fontSize: 19, fontWeight: 500, color: "#7A7D90" }}>{p.sub}</div>
          </div>
          <Check size={40} />
        </div>
      ))}
    </div>
    <Stage top={860} left={0} width={420} height={320}>
      <Pop at={0} scale={0.75}>
        <Blocks at={0} />
      </Pop>
    </Stage>
    <Stage top={180} left={860} width={220} height={220}>
      <Pop at={0} scale={0.5}>
        <Orb />
      </Pop>
    </Stage>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1110, display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
      <div
        style={{
          background: C.accent,
          color: C.white,
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: 46,
          borderRadius: 999,
          padding: "26px 66px",
          boxShadow: "0 18px 40px rgba(32,217,157,.35)",
        }}
      >
        Personaliza tu plan →
      </div>
      <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 30, color: C.white, background: BLUE, borderRadius: 999, padding: "10px 30px" }}>
        fispal.mx
      </span>
    </div>
  </Frame>
);

const SLIDES = [S1, S2, S3, S4, S5, S6];
export const PERSONALIZA_FRAMES = SLIDES.length * SLIDE_FRAMES;

export const PersonalizaCarousel: React.FC = () => {
  const [handle] = useState(() => delayRender("Loading fonts"));
  useEffect(() => {
    fontsLoaded.then(() => continueRender(handle));
  }, [handle]);
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      {SLIDES.map((S, i) => (
        <Sequence key={i} from={i * SLIDE_FRAMES} durationInFrames={SLIDE_FRAMES} name={`Slide ${i + 1}`}>
          <S />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
