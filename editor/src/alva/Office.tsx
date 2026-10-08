import React, { useMemo } from "react";
import { Easing, interpolate, spring, useCurrentFrame } from "remotion";
import * as THREE from "three";
import {
  CalendarObj,
  Cards,
  Chair,
  Coins,
  Confetti,
  FIX,
  Gift,
  Laptop,
  Person,
  RB,
  clamp,
  ease,
  makeSlide,
  mix,
  rand,
  sec,
  type V3,
} from "./Room";
import { CUE } from "./timeline";

// ------------------------------------------------------------------
// One long office floor, seen in isometric view. An employee walks the
// corridor through the departments (Diseño → RH → TI → Finanzas → Sala de
// juntas); each cost shows up in the department it belongs to. Characters are
// the same clay figures as before.
// ------------------------------------------------------------------

export const WALK_Z = 1.5;
const X0 = -1.3; // west end of the floor
const X1 = 20.4; // east end
const BOUNDS = [X0, 3.8, 8.0, 11.4, 14.0, X1];
const BACK = -2.9; // back wall z
const FRONT = 3.1;

// walker x(t): steady stroll, easing to a stop at the meeting-room door
const WALK_KEYS: [number, number][] = [
  [0, -0.4],
  [1.9, 1.7],
  [3.4, 5.2],
  [4.9, 7.6],
  [5.6, 9.0],
  [6.9, 11.6],
  [7.6, 13.0],
  [8.25, 14.3],
  [9.7, 16.0],
];
export const walkerX = (f: number) =>
  interpolate(f / 30, WALK_KEYS.map((k) => k[0]), WALK_KEYS.map((k) => k[1]), clamp);
const walkerSpeed = (f: number) => Math.abs(walkerX(f + 1) - walkerX(f - 1)) * 15; // units / s

const ZONES = [
  { label: "DISEÑO", cx: 1.3 },
  { label: "RECURSOS HUMANOS", cx: 5.9 },
  { label: "TI", cx: 9.7 },
  { label: "FINANZAS", cx: 12.7 },
  { label: "SALA DE JUNTAS", cx: 17.1 },
];

const signTexture = (label: string, bg: string) => {
  const c = document.createElement("canvas");
  c.width = 768;
  c.height = 160;
  const g = c.getContext("2d")!;
  g.fillStyle = bg;
  g.beginPath();
  g.roundRect(0, 0, 768, 160, 40);
  g.fill();
  g.fillStyle = "#FFFFFF";
  g.font = "600 70px Poppins, sans-serif";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText(label, 384, 86);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
};

const Desk: React.FC<{ x: number; z?: number; screenOn?: boolean }> = ({ x, z = -1.45, screenOn }) => (
  <group position={[x, 0, z]}>
    <RB size={[1.5, 0.08, 0.75]} color="#C99A6E" position={[0, 0.78, 0]} />
    {[[-0.65, -0.3], [0.65, -0.3], [-0.65, 0.3], [0.65, 0.3]].map(([dx, dz], i) => (
      <mesh key={i} position={[dx, 0.39, dz]}>
        <cylinderGeometry args={[0.04, 0.04, 0.78, 8]} />
        <meshStandardMaterial color="#A97B50" />
      </mesh>
    ))}
    <RB size={[0.62, 0.4, 0.05]} color="#20232A" position={[0, 1.1, -0.1]} />
    <RB size={[0.12, 0.2, 0.1]} color="#20232A" position={[0, 0.9, -0.1]} />
    {screenOn && (
      <mesh position={[0, 1.1, 0.02]}>
        <planeGeometry args={[0.55, 0.33]} />
        <meshBasicMaterial color="#8FB8FF" />
      </mesh>
    )}
  </group>
);

const Rack: React.FC<{ x: number }> = ({ x }) => {
  const f = useCurrentFrame();
  return (
    <group position={[x, 0, -2.3]}>
      <RB size={[0.8, 2.3, 0.7]} color="#252A33" position={[0, 1.15, 0]} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <group key={i}>
          <mesh position={[0, 0.35 + i * 0.35, 0.36]}>
            <planeGeometry args={[0.66, 0.2]} />
            <meshBasicMaterial color="#39414E" />
          </mesh>
          <mesh position={[0.24, 0.35 + i * 0.35, 0.37]}>
            <circleGeometry args={[0.035, 8]} />
            <meshBasicMaterial color={(f + i * 7) % 24 < 12 ? "#59F0A8" : "#FFB84A"} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

const Cabinet: React.FC<{ x: number }> = ({ x }) => (
  <group position={[x, 0, -2.45]}>
    <RB size={[0.75, 1.5, 0.55]} color="#8E98A8" position={[0, 0.75, 0]} />
    {[0.3, 0.75, 1.2].map((y) => (
      <mesh key={y} position={[0, y, 0.285]}>
        <planeGeometry args={[0.55, 0.05]} />
        <meshBasicMaterial color="#5C6573" />
      </mesh>
    ))}
  </group>
);

const Plant: React.FC<{ x: number; z: number }> = ({ x, z }) => (
  <group position={[x, 0, z]}>
    <mesh position={[0, 0.3, 0]}>
      <cylinderGeometry args={[0.28, 0.2, 0.6, 14]} />
      <meshStandardMaterial color="#C97B55" />
    </mesh>
    {[[0, 0.95, 0, 0.42], [-0.2, 1.25, 0.1, 0.32], [0.22, 1.2, -0.08, 0.3]].map(([px, py, pz, r], i) => (
      <mesh key={i} position={[px, py, pz]}>
        <sphereGeometry args={[r, 14, 14]} />
        <meshStandardMaterial color="#5FA36B" />
      </mesh>
    ))}
  </group>
);

// costs: [spoken moment, object, scale, orbit radius, phase, speed, height, zone x]
const COSTS: { at: number; node: React.ReactNode; scale: number; r: number; a0: number; w: number; h: number; cx: number }[] = [
  { at: CUE.sueldo, node: <Coins />, scale: 1.1, r: 1.1, a0: 0.4, w: 1.1, h: 2.5, cx: 5.9 },
  { at: CUE.sueldo + 0.12, node: <Coins />, scale: 0.8, r: 1.7, a0: 3.2, w: -0.9, h: 3.2, cx: 5.9 },
  { at: CUE.prestaciones, node: <Gift />, scale: 1.1, r: 1.4, a0: 1.6, w: 1.0, h: 2.9, cx: 5.9 },
  { at: CUE.prestaciones + 0.14, node: <Gift />, scale: 0.8, r: 1.9, a0: 4.7, w: -1.1, h: 2.1, cx: 5.9 },
  { at: CUE.equipo, node: <Laptop />, scale: 1.2, r: 1.2, a0: 2.4, w: -1.0, h: 3.3, cx: 9.7 },
  { at: CUE.equipo + 0.12, node: <Laptop />, scale: 0.9, r: 1.8, a0: 5.4, w: 0.9, h: 2.3, cx: 9.7 },
  { at: CUE.licencias, node: <Cards />, scale: 1.3, r: 1.5, a0: 0.9, w: 1.1, h: 3.0, cx: 9.7 },
  { at: CUE.licencias + 0.12, node: <Cards />, scale: 1, r: 1.1, a0: 3.9, w: -1.2, h: 2.1, cx: 9.7 },
  { at: CUE.anio, node: <CalendarObj />, scale: 1.9, r: 0.9, a0: 5.0, w: 0.6, h: 3.4, cx: 12.7 },
];

const CostObj: React.FC<{ def: (typeof COSTS)[number]; idx: number }> = ({ def, idx }) => {
  const f = useCurrentFrame();
  const t0 = sec(def.at);
  const pop = spring({ frame: f - t0, fps: 30, config: { damping: 9, stiffness: 140 } });
  const out = interpolate(f, [FIX, FIX + 8], [1, 0], { ...clamp, easing: Easing.in(Easing.cubic) });
  if (f < t0 || f > FIX + 9) return null;
  const tt = (f - t0) / 30;
  const ang = def.a0 + def.w * tt * 1.4;
  const drop = (1 - Math.min(1, (f - t0) / 14)) ** 2 * 4;
  return (
    <group
      position={[
        def.cx + Math.cos(ang) * def.r * (1 + 0.3 * (1 - out)),
        def.h + Math.sin(f * 0.18 + idx * 2) * 0.2 + drop + (1 - out) * 2.5,
        -0.2 + Math.sin(ang) * def.r * (1 + 0.3 * (1 - out)),
      ]}
      rotation={[tt * 1.4 + idx, tt * 2 + idx, tt * 0.8]}
      scale={def.scale * pop * out}
    >
      {def.node}
    </group>
  );
};

// A cloud of paperwork that follows the walker and thickens as costs pile up.
const Papers: React.FC = () => {
  const f = useCurrentFrame();
  const items = useMemo(() => {
    const r = rand(42);
    return Array.from({ length: 30 }, (_, i) => ({
      at: 1.0 + (i / 30) ** 0.75 * 6.8,
      r: 0.8 + r() * 1.7,
      a0: r() * 6.28,
      w: (r() < 0.5 ? -1 : 1) * (0.8 + r() * 1.0),
      h: 1.2 + r() * 2.6,
      ph: r() * 6,
    }));
  }, []);
  const wx = walkerX(f);
  return (
    <>
      {items.map((p, i) => {
        const t0 = sec(p.at);
        if (f < t0 || f > FIX + 7) return null;
        const tt = (f - t0) / 30;
        const grow = Math.min(1, (f - t0) / 8);
        const out = interpolate(f, [FIX, FIX + 7], [1, 0], clamp);
        const ang = p.a0 + p.w * tt * 1.6;
        return (
          <mesh
            key={i}
            position={[wx + Math.cos(ang) * p.r, p.h + Math.sin(f * 0.15 + p.ph) * 0.3, WALK_Z + Math.sin(ang) * p.r]}
            rotation={[tt * 3 + p.ph, tt * 2, tt * 4]}
            scale={grow * out}
          >
            <boxGeometry args={[0.5, 0.015, 0.36]} />
            <meshStandardMaterial color={i % 5 === 0 ? "#FFE08A" : "#FFFFFF"} />
          </mesh>
        );
      })}
    </>
  );
};

export const Office: React.FC = () => {
  const f = useCurrentFrame();
  const k = interpolate(f, [FIX, FIX + 30], [0, 1], { ...clamp, easing: ease });
  const stress =
    interpolate(f, [sec(2.0), sec(7.4)], [0, 1], clamp) * (1 - interpolate(f, [FIX - 2, FIX + 8], [0, 1], clamp));
  const happy = interpolate(f, [FIX + 8, FIX + 20], [0, 1], clamp);

  const generic = useMemo(() => makeSlide("generic"), []);
  const alva = useMemo(() => makeSlide("alva"), []);
  const showAlva = f >= FIX + 14;
  const tvOn = f < FIX + 4 || f >= FIX + 14;
  const tvPop = spring({ frame: f - (FIX + 14), fps: 30, config: { damping: 10, stiffness: 160 }, from: 0.88, to: 1 });
  const signs = useMemo(
    () => ZONES.map((z) => [signTexture(z.label, "#2E333B"), signTexture(z.label, "#7B5AA6")] as const),
    [],
  );

  const wall = mix("#9AA0A6", "#F2B8A4", k);
  const wallB = mix("#8C9298", "#F7C8B6", k);
  const floor = mix("#767C82", "#F0D2B0", k);
  const slab = mix("#6A7076", "#D7A98A", k);
  const chair = mix("#8E9AAF", "#A28FD6", k);
  const lane = mix("#6B7178", "#F6E1C8", k);

  const wx = walkerX(f);
  const speed = walkerSpeed(f);
  const moving = Math.min(1, speed / 1.5);
  const phase = (f / 30) * 6.5 * Math.max(0.5, Math.min(1.6, speed / 1.5));
  const turn = interpolate(f / 30, [9.7, 10.4], [Math.PI / 2, 0], clamp);
  const cx0 = (X0 + X1) / 2;
  const len = X1 - X0;

  return (
    <group>
      {/* floor, walls, corridor lane */}
      <RB size={[len + 0.4, 0.3, FRONT - BACK + 0.4]} color={slab} position={[cx0, -0.15, (FRONT + BACK) / 2]} radius={0.08} />
      <RB size={[len, 0.06, FRONT - BACK]} color={floor} position={[cx0, 0.03, (FRONT + BACK) / 2]} radius={0.02} glow={0.4} />
      <RB size={[len, 0.02, 0.9]} color={lane} position={[cx0, 0.07, WALK_Z]} radius={0.01} glow={0.3} />
      <RB size={[len + 0.2, 3.6, 0.22]} color={wall} position={[cx0, 1.8, BACK - 0.1]} radius={0.06} glow={0.5} />
      <RB size={[0.22, 3.6, FRONT - BACK]} color={wallB} position={[X0 - 0.1, 1.8, (FRONT + BACK) / 2]} radius={0.06} glow={0.5} />

      {/* glass dividers between departments */}
      {BOUNDS.slice(1, -1).map((bx) => (
        <group key={bx} position={[bx, 0, (BACK + 0.4) / 2 - 0.1]}>
          <mesh position={[0, 1.2, 0]}>
            <boxGeometry args={[0.05, 2.4, 2.6]} />
            <meshPhysicalMaterial color="#BFD9F0" transparent opacity={0.28} roughness={0.1} />
          </mesh>
          <RB size={[0.09, 0.09, 2.62]} color="#59606B" position={[0, 2.42, 0]} radius={0.02} />
          <RB size={[0.09, 2.44, 0.09]} color="#59606B" position={[0, 1.2, 1.3]} radius={0.02} />
        </group>
      ))}

      {/* department signs */}
      {ZONES.map((z, i) => (
        <mesh key={z.label} position={[z.cx, 3.0, BACK + 0.03]}>
          <planeGeometry args={[i === 1 || i === 4 ? 3.1 : 1.9, i === 1 || i === 4 ? 0.65 : 0.4]} />
          <meshBasicMaterial map={k > 0.5 ? signs[i][1] : signs[i][0]} toneMapped={false} transparent />
        </mesh>
      ))}

      {/* DISEÑO: nearly empty, a calendar with a couple of marked days */}
      <Desk x={0.2} />
      <Desk x={2.5} />
      <Chair position={[0.2, 0, -2.2]} rotY={0} color={chair} />
      <Chair position={[2.5, 0, -2.2]} rotY={0} color={chair} />
      <Person position={[0.2, 0, -2.2]} rotY={0} shirt={mix("#C9B79C", "#F7C3B3", k)} skin="#E8B994" hair="#7A5A3C" seated seed={2} stress={stress} happy={happy} />
      <group position={[1.4, 1.9, BACK + 0.04]}>
        <RB size={[0.95, 0.85, 0.05]} color="#FFFFFF" />
        <RB size={[0.95, 0.18, 0.07]} color="#F26B5B" position={[0, 0.34, 0]} />
        {[0, 1, 2, 3].map((r) =>
          [0, 1, 2, 3].map((c) => (
            <mesh key={`${r}${c}`} position={[-0.3 + c * 0.2, 0.15 - r * 0.15, 0.04]}>
              <planeGeometry args={[0.1, 0.07]} />
              <meshBasicMaterial color={(r === 0 && c === 1) || (r === 2 && c === 3) ? "#AB7FED" : "#D5D8E0"} />
            </mesh>
          )),
        )}
      </group>
      <Plant x={-0.7} z={-2.3} />

      {/* RH */}
      <Desk x={5.0} screenOn />
      <Desk x={6.8} screenOn />
      <Chair position={[5.0, 0, -2.2]} rotY={0} color={chair} />
      <Chair position={[6.8, 0, -2.2]} rotY={0} color={chair} />
      <Person position={[5.0, 0, -2.2]} rotY={0} shirt={mix("#6C737D", "#7B5AA6", k)} skin="#A56E48" hair="#BDBDBD" seated seed={3} stress={stress} happy={happy} />
      <Person position={[6.8, 0, -2.2]} rotY={0} shirt={mix("#6AA37A", "#58C2A8", k)} skin="#E2B08A" hair="#4A2F22" seated seed={4} stress={stress} happy={happy} />
      <Cabinet x={4.3} />

      {/* TI */}
      <Rack x={8.9} />
      <Rack x={9.8} />
      <Desk x={10.7} screenOn />
      <Chair position={[10.7, 0, -2.2]} rotY={0} color={chair} />
      <Person position={[10.7, 0, -2.2]} rotY={0} shirt={mix("#4F7FD6", "#AB7FED", k)} skin="#C98A5E" hair="#2D2420" seated seed={5} stress={stress} happy={happy} />

      {/* FINANZAS */}
      <Desk x={12.7} screenOn />
      <Chair position={[12.7, 0, -2.2]} rotY={0} color={chair} />
      <Person position={[12.7, 0, -2.2]} rotY={0} shirt={mix("#C9B79C", "#F7C3B3", k)} skin="#E8B994" hair="#3A2A22" seated seed={6} stress={stress} happy={happy} />
      <Cabinet x={13.6} />
      <Cabinet x={11.8} />

      {/* SALA DE JUNTAS: TV + table + three people */}
      <group position={[17.2, 2.35, BACK + 0.06]} scale={showAlva ? tvPop : 1}>
        <RB size={[2.75, 1.65, 0.14]} color="#14161B" radius={0.05} />
        {tvOn && (
          <mesh position={[0, 0, 0.075]}>
            <planeGeometry args={[2.6, 1.46]} />
            <meshBasicMaterial map={showAlva ? alva : generic} toneMapped={false} />
          </mesh>
        )}
      </group>
      <RB size={[2.7, 0.12, 1.3]} color="#C99A6E" position={[17.4, 0.8, -0.9]} />
      {[[16.3, -1.35], [18.5, -1.35], [16.3, -0.45], [18.5, -0.45]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.4, z]}>
          <cylinderGeometry args={[0.06, 0.06, 0.8, 10]} />
          <meshStandardMaterial color="#A97B50" />
        </mesh>
      ))}
      <Chair position={[16.6, 0, -2.15]} rotY={0} color={chair} />
      <Chair position={[18.2, 0, -2.15]} rotY={0} color={chair} />
      <Person position={[16.6, 0, -2.15]} rotY={0} shirt={mix("#C9B79C", "#F7C3B3", k)} skin="#E8B994" hair="#7A5A3C" seated seed={7} stress={stress} happy={happy} />
      <Person position={[18.2, 0, -2.15]} rotY={0} shirt={mix("#6C737D", "#7B5AA6", k)} skin="#A56E48" hair="#BDBDBD" seated seed={8} stress={stress} happy={happy} />
      <Plant x={19.7} z={-2.3} />

      {/* the walker: same blue-shirt character as before */}
      <Person
        position={[wx, 0, WALK_Z]}
        rotY={f / 30 > 9.7 ? turn : Math.PI / 2}
        shirt={mix("#4F7FD6", "#AB7FED", k)}
        skin="#C98A5E"
        hair="#3A2A22"
        seed={1}
        stress={stress}
        happy={happy}
        walkPhase={phase}
        moving={moving}
      />

      {/* the mess */}
      {COSTS.map((c, i) => (
        <CostObj key={i} def={c} idx={i} />
      ))}
      <Papers />

      {/* the fix: shockwave + confetti where the walker arrives */}
      {f >= FIX && f < FIX + 24 && (
        <mesh position={[wx, 0.12, WALK_Z]} rotation={[-Math.PI / 2, 0, 0]} scale={0.3 + interpolate(f, [FIX, FIX + 22], [0, 1], clamp) * 3.2}>
          <ringGeometry args={[0.94, 1, 64]} />
          <meshBasicMaterial color="#FFFFFF" transparent opacity={0.7 * (1 - interpolate(f, [FIX, FIX + 22], [0, 1], clamp))} />
        </mesh>
      )}
      <Confetti origin={[walkerX(FIX), 0, WALK_Z] as V3} />
    </group>
  );
};
