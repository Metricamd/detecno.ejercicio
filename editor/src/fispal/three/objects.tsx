import React, { useMemo } from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

const GREEN = "#20D99D";
const PURPLE = "#250E94";
const LAVENDER = "#C9C2FF";
const WHITE = "#FFFFFF";
const GOLD = "#FFD25A";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
type V3 = [number, number, number];

export const Glossy: React.FC<{ color: string; rough?: number; metal?: number }> = ({
  color,
  rough = 0.25,
  metal = 0.05,
}) => (
  <meshPhysicalMaterial
    color={color}
    roughness={rough}
    metalness={metal}
    clearcoat={1}
    clearcoatRoughness={0.12}
  />
);

const RBox: React.FC<{
  size: V3;
  radius?: number;
  color: string;
  position?: V3;
  rotation?: V3;
}> = ({ size, radius = 0.08, color, position, rotation }) => {
  const geo = useMemo(
    () => new RoundedBoxGeometry(size[0], size[1], size[2], 4, radius),
    [size, radius],
  );
  return (
    <mesh geometry={geo} position={position} rotation={rotation}>
      <Glossy color={color} />
    </mesh>
  );
};

// Pops an object in on `at` (spin + overshoot) and out on `out` (local frames).
// Keeps a gentle float + turn so it never sits still.
export const Pop: React.FC<{
  at: number;
  out?: number;
  position?: V3;
  scale?: number;
  spin?: number;
  tilt?: number;
  children: React.ReactNode;
}> = ({ at, out, position = [0, 0, 0], scale = 1, spin = 0.012, tilt = 0.25, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inP = spring({ frame: frame - at, fps, config: { damping: 10, stiffness: 140 } });
  const outP = out === undefined ? 0 : interpolate(frame, [out, out + 6], [0, 1], clamp);
  const s = Math.max(0, inP * (1 - outP)) * scale;
  if (s <= 0.001) return null;
  const local = frame - at;
  return (
    <group
      position={[position[0], position[1] + Math.sin(local / 14) * 0.08 + outP * 1.2, position[2]]}
      scale={[s, s, s]}
      rotation={[tilt * Math.sin(local / 40), (1 - inP) * -2.4 + local * spin, 0]}
    >
      {children}
    </group>
  );
};

/* ---- Fispal orb: the green dot of the logo, with an orbiting ring ---- */
export const Orb: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <group>
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <Glossy color={GREEN} rough={0.18} />
      </mesh>
      <group rotation={[1.15, 0.2, frame * 0.02]}>
        <mesh>
          <torusGeometry args={[1.65, 0.07, 24, 120]} />
          <Glossy color={PURPLE} />
        </mesh>
        <mesh position={[1.65, 0, 0]}>
          <sphereGeometry args={[0.18, 32, 32]} />
          <Glossy color={WHITE} />
        </mesh>
      </group>
      <group rotation={[0.4, 0, -frame * 0.015]}>
        <mesh position={[0, 2.05, 0]}>
          <sphereGeometry args={[0.13, 32, 32]} />
          <Glossy color={LAVENDER} />
        </mesh>
      </group>
    </group>
  );
};

const CheckMark: React.FC<{ color?: string; size?: number; position?: V3 }> = ({
  color = WHITE,
  size = 1,
  position = [0, 0, 0],
}) => (
  <group position={position} scale={[size, size, size]}>
    <RBox size={[0.22, 0.5, 0.12]} radius={0.05} color={color} position={[-0.2, -0.05, 0]} rotation={[0, 0, 0.75]} />
    <RBox size={[0.22, 0.95, 0.12]} radius={0.05} color={color} position={[0.17, 0.12, 0]} rotation={[0, 0, -0.65]} />
  </group>
);

/* ---- Contract with approval seal (contratar) ---- */
export const Contract: React.FC = () => (
  <group>
    <RBox size={[2.2, 2.9, 0.12]} color={WHITE} />
    <RBox size={[1.2, 0.16, 0.04]} radius={0.03} color={PURPLE} position={[-0.3, 1.05, 0.08]} />
    {[0.55, 0.2, -0.15, -0.5].map((y, i) => (
      <RBox key={y} size={[i % 2 ? 1.2 : 1.6, 0.1, 0.03]} radius={0.03} color={LAVENDER} position={[i % 2 ? -0.2 : 0, y, 0.08]} />
    ))}
    <group position={[0.7, -1.05, 0.15]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.14, 48]} />
        <Glossy color={GREEN} />
      </mesh>
      <CheckMark size={0.55} position={[0, 0, 0.1]} />
    </group>
  </group>
);

/* ---- Card for "gestionar tu plan" ---- */
export const PlanCard: React.FC = () => (
  <group>
    <RBox size={[2.8, 1.75, 0.1]} radius={0.12} color={PURPLE} />
    <RBox size={[0.5, 0.38, 0.06]} radius={0.06} color={GOLD} position={[-0.85, 0.2, 0.07]} />
    <RBox size={[1.6, 0.12, 0.04]} radius={0.03} color={LAVENDER} position={[-0.3, -0.45, 0.07]} />
    <mesh position={[0.95, 0.5, 0.08]}>
      <sphereGeometry args={[0.2, 32, 32]} />
      <Glossy color={GREEN} />
    </mesh>
  </group>
);

/* ---- Blocks assembling (personalízalo) ---- */
export const Blocks: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pieces: { p: V3; c: string }[] = [
    { p: [-0.62, -0.62, 0], c: PURPLE },
    { p: [0.62, -0.62, 0], c: GREEN },
    { p: [-0.62, 0.62, 0], c: WHITE },
    { p: [0.62, 0.62, 0], c: LAVENDER },
  ];
  return (
    <group rotation={[0.5, 0.6, 0]}>
      {pieces.map((b, i) => {
        const k = spring({ frame: frame - at - i * 5, fps, config: { damping: 11 } });
        return (
          <group key={i} position={[b.p[0] * (1 + (1 - k) * 2), b.p[1] + (1 - k) * 3, b.p[2]]}>
            <RBox size={[1.12, 1.12, 1.12]} radius={0.16} color={b.c} />
          </group>
        );
      })}
    </group>
  );
};

/* ---- CFDI: stack of invoices ---- */
export const Invoices: React.FC = () => (
  <group rotation={[0.25, 0, 0]}>
    {[0, 1, 2].map((i) => (
      <group key={i} position={[i * 0.28 - 0.28, i * 0.22 - 0.22, i * 0.25]} rotation={[0, 0, (i - 1) * 0.08]}>
        <RBox size={[1.9, 2.4, 0.08]} color={i === 2 ? WHITE : LAVENDER} />
        {i === 2 && (
          <>
            <RBox size={[0.8, 0.32, 0.05]} radius={0.06} color={GREEN} position={[-0.38, 0.8, 0.06]} />
            {[0.3, 0, -0.3, -0.6].map((y) => (
              <RBox key={y} size={[1.3, 0.09, 0.03]} radius={0.03} color={LAVENDER} position={[0, y, 0.05]} />
            ))}
          </>
        )}
      </group>
    ))}
  </group>
);

/* ---- RFC: ID badge ---- */
export const IdBadge: React.FC = () => (
  <group>
    <RBox size={[2.6, 1.7, 0.1]} radius={0.14} color={WHITE} />
    <RBox size={[2.6, 0.42, 0.11]} radius={0.1} color={PURPLE} position={[0, 0.64, 0.01]} />
    <mesh position={[-0.75, -0.15, 0.08]} scale={[1, 1, 0.3]}>
      <sphereGeometry args={[0.42, 32, 32]} />
      <Glossy color={GREEN} />
    </mesh>
    {[0.05, -0.2, -0.45].map((y, i) => (
      <RBox key={y} size={[i === 0 ? 1.1 : 0.85, 0.11, 0.03]} radius={0.03} color={LAVENDER} position={[0.45, y, 0.07]} />
    ))}
    <RBox size={[0.5, 0.18, 0.18]} radius={0.06} color={GREEN} position={[0, 1.0, 0]} />
  </group>
);

/* ---- Módulos: modular cubes snapping together ---- */
export const Modules: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cubes: { p: V3; c: string }[] = [
    { p: [-0.6, -0.6, 0], c: PURPLE },
    { p: [0.6, -0.6, 0], c: PURPLE },
    { p: [0, -0.6, 1.2], c: GREEN },
    { p: [0, 0.6, 0.6], c: GREEN },
  ];
  return (
    <group rotation={[0.45, 0.7, 0]}>
      {cubes.map((c, i) => {
        const k = spring({ frame: frame - at - i * 4, fps, config: { damping: 12 } });
        return (
          <group key={i} position={[c.p[0], c.p[1] + (1 - k) * 2.5, c.p[2]]} scale={[k, k, k]}>
            <RBox size={[1.1, 1.1, 1.1]} radius={0.14} color={c.c} />
          </group>
        );
      })}
    </group>
  );
};

/* ---- Colaboradores: three people ---- */
const Person: React.FC<{ color: string; position: V3; s?: number }> = ({ color, position, s = 1 }) => (
  <group position={position} scale={[s, s, s]}>
    <mesh position={[0, 0.75, 0]}>
      <sphereGeometry args={[0.38, 48, 48]} />
      <Glossy color={color} />
    </mesh>
    <mesh position={[0, -0.25, 0]}>
      <capsuleGeometry args={[0.5, 0.5, 12, 32]} />
      <Glossy color={color} />
    </mesh>
  </group>
);
export const People: React.FC = () => (
  <group rotation={[0.15, 0, 0]}>
    <Person color={LAVENDER} position={[-1.3, -0.2, -0.4]} s={0.82} />
    <Person color={GREEN} position={[1.3, -0.2, -0.4]} s={0.82} />
    <Person color={PURPLE} position={[0, 0, 0.3]} />
  </group>
);

/* ---- API: connected nodes with data pulses ---- */
const Link: React.FC<{ from: V3; to: V3 }> = ({ from, to }) => {
  const a = new THREE.Vector3(...from);
  const b = new THREE.Vector3(...to);
  const mid = a.clone().add(b).multiplyScalar(0.5);
  const len = a.distanceTo(b);
  const q = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    b.clone().sub(a).normalize(),
  );
  return (
    <mesh position={mid} quaternion={q}>
      <cylinderGeometry args={[0.05, 0.05, len, 12]} />
      <Glossy color={LAVENDER} />
    </mesh>
  );
};
export const ApiNodes: React.FC = () => {
  const frame = useCurrentFrame();
  const outer: V3[] = [
    [1.7, 0.9, 0],
    [-1.7, 0.9, 0.3],
    [1.4, -1.1, 0.4],
    [-1.4, -1.1, -0.2],
  ];
  return (
    <group>
      <mesh>
        <sphereGeometry args={[0.65, 48, 48]} />
        <Glossy color={GREEN} />
      </mesh>
      {outer.map((p, i) => {
        const t = ((frame + i * 9) % 30) / 30;
        return (
          <group key={i}>
            <Link from={[0, 0, 0]} to={p} />
            <mesh position={p}>
              <sphereGeometry args={[0.36, 32, 32]} />
              <Glossy color={PURPLE} />
            </mesh>
            <mesh position={[p[0] * t, p[1] * t, p[2] * t]}>
              <sphereGeometry args={[0.1, 16, 16]} />
              <meshStandardMaterial color={GREEN} emissive={GREEN} emissiveIntensity={0.8} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

/* ---- Big check badge (plan listo / control) ---- */
export const CheckBadge: React.FC = () => (
  <group>
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[1.2, 1.2, 0.3, 64]} />
      <Glossy color={GREEN} />
    </mesh>
    <CheckMark size={1.15} position={[0, 0, 0.2]} />
  </group>
);

/* ---- Calendar (mensual / anual) ---- */
export const Calendar: React.FC<{ annual: number }> = ({ annual }) => {
  const header = annual > 0.5 ? GREEN : PURPLE;
  const cells = annual > 0.5 ? 12 : 30;
  const cols = annual > 0.5 ? 4 : 6;
  const cw = 1.9 / cols;
  return (
    <group rotation={[0, annual * Math.PI * 2, 0]}>
      <RBox size={[2.4, 2.5, 0.22]} radius={0.14} color={WHITE} />
      <RBox size={[2.4, 0.6, 0.24]} radius={0.12} color={header} position={[0, 0.95, 0.01]} />
      {[-0.6, 0.6].map((x) => (
        <mesh key={x} position={[x, 1.3, 0]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.16, 0.05, 12, 32]} />
          <Glossy color={LAVENDER} metal={0.4} />
        </mesh>
      ))}
      {Array.from({ length: cells }).map((_, i) => {
        const r = Math.floor(i / cols);
        const c = i % cols;
        const rows = Math.ceil(cells / cols);
        return (
          <RBox
            key={i}
            size={[cw * 0.7, (1.5 / rows) * 0.62, 0.04]}
            radius={0.02}
            color={i === cells - 1 ? GREEN : LAVENDER}
            position={[-0.95 + cw / 2 + c * cw, 0.45 - (r + 0.5) * (1.5 / rows), 0.13]}
          />
        );
      })}
    </group>
  );
};

/* ---- Coins stacking (ahorra 20%) ---- */
export const CoinStacks: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const heights = [3, 5, 7, 10];
  return (
    <group rotation={[0.35, -0.4, 0]}>
      {heights.map((h, s) => {
        const shown = Math.floor(interpolate(frame - at - s * 4, [0, 18], [0, h], clamp));
        return Array.from({ length: shown }).map((_, i) => (
          <mesh key={`${s}-${i}`} position={[s * 1.15 - 1.7, -1.4 + i * 0.2, 0]}>
            <cylinderGeometry args={[0.48, 0.48, 0.16, 40]} />
            <Glossy color={i === shown - 1 && s === 3 ? GREEN : GOLD} metal={0.25} rough={0.3} />
          </mesh>
        ));
      })}
    </group>
  );
};

/* ---- Flexibilidad: twisting knot ---- */
export const Knot: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <mesh rotation={[frame * 0.02, frame * 0.03, 0]} scale={[1, 1 + 0.12 * Math.sin(frame / 6), 1]}>
      <torusKnotGeometry args={[0.9, 0.3, 160, 24, 2, 3]} />
      <Glossy color={GREEN} />
    </mesh>
  );
};

/* ---- Control: dial ---- */
export const Dial: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const turn = spring({ frame: frame - at - 4, fps, config: { damping: 9 } });
  return (
    <group rotation={[0.9, 0, 0]}>
      <mesh>
        <cylinderGeometry args={[1.5, 1.5, 0.25, 64]} />
        <Glossy color={WHITE} />
      </mesh>
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return (
          <RBox
            key={i}
            size={[0.08, 0.06, 0.22]}
            radius={0.02}
            color={i < 1 + turn * 8 ? GREEN : LAVENDER}
            position={[Math.sin(a) * 1.3, 0.14, Math.cos(a) * 1.3]}
            rotation={[0, a, 0]}
          />
        );
      })}
      <group rotation={[0, -turn * Math.PI * 1.3, 0]} position={[0, 0.3, 0]}>
        <mesh>
          <cylinderGeometry args={[0.9, 1.0, 0.4, 64]} />
          <Glossy color={PURPLE} />
        </mesh>
        <RBox size={[0.16, 0.12, 0.6]} radius={0.04} color={GREEN} position={[0, 0.22, 0.45]} />
      </group>
    </group>
  );
};

/* ---- Decorative floaters for the closing ---- */
export const Floaters: React.FC = () => {
  const frame = useCurrentFrame();
  const items: { p: V3; r: number; c: string; torus?: boolean }[] = [
    { p: [-2.6, 3.6, -1], r: 0.5, c: GREEN },
    { p: [2.7, 2.6, -2], r: 0.35, c: PURPLE },
    { p: [-2.4, -3.2, -1.5], r: 0.4, c: LAVENDER, torus: true },
    { p: [2.5, -3.8, -0.5], r: 0.55, c: GREEN, torus: true },
    { p: [0.4, 5, -3], r: 0.25, c: PURPLE },
  ];
  return (
    <group>
      {items.map((it, i) => (
        <mesh
          key={i}
          position={[it.p[0], it.p[1] + Math.sin((frame + i * 20) / 20) * 0.2, it.p[2]]}
          rotation={[frame * 0.02 + i, frame * 0.015, 0]}
        >
          {it.torus ? (
            <torusGeometry args={[it.r, it.r * 0.35, 24, 64]} />
          ) : (
            <sphereGeometry args={[it.r, 48, 48]} />
          )}
          <Glossy color={it.c} />
        </mesh>
      ))}
    </group>
  );
};
