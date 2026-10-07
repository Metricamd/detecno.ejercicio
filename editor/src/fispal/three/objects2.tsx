// 3D objects for the "Mi cuenta" reel (same material language as objects.tsx).
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Glossy, RBox } from "./objects";

const GREEN = "#20D99D";
const PURPLE = "#250E94";
const LAVENDER = "#C9C2FF";
const WHITE = "#FFFFFF";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/* ---- Lupa: consultar tu información ---- */
export const Magnifier: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <group rotation={[0.2, 0.3 + Math.sin(frame / 25) * 0.25, -0.5]}>
      <mesh>
        <torusGeometry args={[1, 0.2, 32, 96]} />
        <Glossy color={PURPLE} />
      </mesh>
      <mesh>
        <cylinderGeometry args={[0.85, 0.85, 0.06, 64]} />
        <meshPhysicalMaterial
          color="#DFFBF1"
          transmission={0.6}
          roughness={0.05}
          clearcoat={1}
          transparent
          opacity={0.55}
        />
      </mesh>
      <mesh position={[0, -1.85, 0]}>
        <capsuleGeometry args={[0.2, 1.2, 12, 24]} />
        <Glossy color={GREEN} />
      </mesh>
    </group>
  );
};

/* ---- Interruptor que se enciende: "¿tu plan está activo?" ---- */
export const ToggleSwitch: React.FC<{ onAt: number }> = ({ onAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const on = spring({ frame: frame - onAt, fps, config: { damping: 11 } });
  const color = on > 0.5 ? GREEN : LAVENDER;
  return (
    <group rotation={[0.35, -0.35, 0]}>
      <RBox size={[3.2, 1.5, 0.7]} radius={0.34} color={color} />
      <group position={[-0.85 + on * 1.7, 0, 0.35]}>
        <mesh>
          <sphereGeometry args={[0.6, 48, 48]} />
          <Glossy color={WHITE} />
        </mesh>
      </group>
    </group>
  );
};

/* ---- Flecha de renovación alrededor de una fecha ---- */
export const RenewArrow: React.FC = () => {
  const frame = useCurrentFrame();
  const arc = Math.PI * 1.6;
  return (
    <group rotation={[0.25, -0.3, 0]}>
      <RBox size={[1.5, 1.6, 0.25]} radius={0.12} color={WHITE} />
      <RBox size={[1.5, 0.42, 0.27]} radius={0.1} color={PURPLE} position={[0, 0.6, 0.01]} />
      <RBox size={[0.6, 0.5, 0.06]} radius={0.06} color={GREEN} position={[0, -0.15, 0.14]} />
      <group rotation={[0, 0, -frame * 0.05]}>
        <mesh>
          <torusGeometry args={[1.45, 0.11, 24, 96, arc]} />
          <Glossy color={GREEN} />
        </mesh>
        <mesh position={[1.45, 0, 0]} rotation={[0, 0, Math.PI]}>
          <coneGeometry args={[0.3, 0.55, 32]} />
          <Glossy color={GREEN} />
        </mesh>
      </group>
    </group>
  );
};

/* ---- Pastel que se separa: "desglose" (RFC / CFDI / módulos) ---- */
export const PieChart: React.FC<{ at: number[] }> = ({ at }) => {
  const frame = useCurrentFrame();
  const slices = [
    { start: 0, len: 2.1, color: PURPLE },
    { start: 2.1, len: 2.4, color: GREEN },
    { start: 4.5, len: Math.PI * 2 - 4.5, color: LAVENDER },
  ];
  return (
    <group rotation={[0.6, 0, 0]}>
      <group rotation={[0, frame * 0.012, 0]}>
      {slices.map((s, i) => {
        const pop = interpolate(frame, [at[i], at[i] + 8], [0, 1], clamp);
        const mid = s.start + s.len / 2;
        const out = 0.35 * pop;
        return (
          <group
            key={i}
            position={[Math.sin(mid) * out, pop * 0.25, Math.cos(mid) * out]}
            scale={[1, 1 + pop * 0.6, 1]}
          >
            <mesh>
              <cylinderGeometry args={[1.5, 1.5, 0.5, 64, 1, false, s.start, s.len]} />
              <Glossy color={s.color} />
            </mesh>
          </group>
        );
      })}
      </group>
    </group>
  );
};

/* ---- Paquetes de CFDI: three invoice stacks of growing volume ---- */
export const InvoiceTiers: React.FC<{ selected?: number }> = ({ selected = 1 }) => {
  const frame = useCurrentFrame();
  const heights = [3, 7, 12];
  return (
    <group rotation={[0.32, -0.45, 0]}>
      {heights.map((h, s) => {
        const shown = Math.floor(interpolate(frame - s * 5, [0, 20], [0, h], clamp));
        return Array.from({ length: shown }).map((_, i) => (
          <group key={`${s}-${i}`} position={[s * 1.9 - 1.9, -1.5 + i * 0.16, 0]} rotation={[0, (i % 3) * 0.04, 0]}>
            <RBox
              size={[1.4, 0.1, 1.8]}
              radius={0.04}
              color={i === shown - 1 ? (s === selected ? GREEN : PURPLE) : i % 2 ? WHITE : LAVENDER}
            />
          </group>
        ));
      })}
    </group>
  );
};

/* ---- Almacenamiento: nube con flecha de subida ---- */
export const StorageCloud: React.FC = () => {
  const frame = useCurrentFrame();
  const puffs: [number, number, number, number][] = [
    [-1.3, -0.2, 0, 0.85],
    [0, 0.35, 0.1, 1.15],
    [1.25, -0.15, 0, 0.9],
    [-0.55, -0.55, 0.35, 0.7],
    [0.65, -0.6, 0.35, 0.7],
  ];
  const bob = Math.sin(frame / 10) * 0.12;
  return (
    <group>
      {puffs.map(([x, y, z, r], i) => (
        <mesh key={i} position={[x, y, z]}>
          <sphereGeometry args={[r, 48, 48]} />
          <Glossy color="#EEEBFF" rough={0.2} />
        </mesh>
      ))}
      <group position={[0, -0.15 + bob, 1.2]}>
        <RBox size={[0.36, 0.9, 0.3]} radius={0.1} color={GREEN} position={[0, -0.2, 0]} />
        <mesh position={[0, 0.42, 0]}>
          <coneGeometry args={[0.45, 0.55, 4]} />
          <Glossy color={GREEN} />
        </mesh>
      </group>
    </group>
  );
};

/* ---- Archivero con cajón abierto y documentos ---- */
export const ArchiveBox: React.FC = () => {
  const frame = useCurrentFrame();
  const open = interpolate(frame, [0, 18], [0, 1], clamp);
  return (
    <group rotation={[0.3, -0.55, 0]}>
      <RBox size={[2.2, 2.8, 2]} radius={0.14} color={PURPLE} />
      {/* two closed drawers */}
      {[0.75, -0.2].map((y) => (
        <group key={y}>
          <RBox size={[1.9, 0.8, 0.1]} radius={0.06} color="#3A23B5" position={[0, y, 1.02]} />
          <RBox size={[0.6, 0.12, 0.12]} radius={0.05} color={GREEN} position={[0, y, 1.1]} />
        </group>
      ))}
      {/* open bottom drawer full of documents */}
      <group position={[0, -1.05, 0.3 + open * 1.1]}>
        <RBox size={[1.9, 0.75, 1.6]} radius={0.06} color={LAVENDER} />
        <RBox size={[0.6, 0.12, 0.12]} radius={0.05} color={GREEN} position={[0, 0, 0.82]} />
        {[-0.5, -0.2, 0.1, 0.4].map((z, i) => (
          <RBox
            key={z}
            size={[1.5, 0.9, 0.05]}
            radius={0.03}
            color={i === 3 ? GREEN : WHITE}
            position={[0, 0.55 + (i % 2) * 0.08, z]}
            rotation={[-0.15, 0, (i - 1.5) * 0.04]}
          />
        ))}
      </group>
    </group>
  );
};
