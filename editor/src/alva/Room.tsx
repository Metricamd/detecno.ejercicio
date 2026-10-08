import React, { useMemo } from "react";
import { Easing, interpolate, spring, useCurrentFrame } from "remotion";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { CUE } from "./timeline";

const FPS = 30;
const sec = (t: number) => Math.round(t * FPS);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.65, 0, 0.35, 1);
type V3 = [number, number, number];

export const FIX = sec(CUE.fix);
const mix = (a: string, b: string, k: number) =>
  "#" + new THREE.Color(a).lerp(new THREE.Color(b), k).getHexString();

// Deterministic randomness so every render frame agrees.
const rand = (seed: number) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

// ---------- tiny building blocks ----------
const Clay: React.FC<{ color: string; rough?: number; glow?: number }> = ({ color, rough = 0.55, glow = 0 }) => (
  <meshPhysicalMaterial color={color} roughness={rough} metalness={0.02} clearcoat={0.3} clearcoatRoughness={0.4} emissive={color} emissiveIntensity={glow} />
);

const RB: React.FC<{ size: V3; color: string; position?: V3; rotation?: V3; radius?: number; glow?: number }> = ({
  size,
  color,
  position,
  rotation,
  radius = 0.05,
  glow = 0,
}) => {
  const geo = useMemo(
    () => new RoundedBoxGeometry(size[0], size[1], size[2], 3, Math.min(radius, size[0] / 2.2, size[1] / 2.2, size[2] / 2.2)),
    [size, radius],
  );
  return (
    <mesh geometry={geo} position={position} rotation={rotation}>
      <Clay color={color} glow={glow} />
    </mesh>
  );
};

// ---------- TV slides (canvas textures) ----------
const makeSlide = (kind: "generic" | "alva") => {
  const c = document.createElement("canvas");
  c.width = 640;
  c.height = 360;
  const g = c.getContext("2d")!;
  if (kind === "generic") {
    g.fillStyle = "#FFFFFF";
    g.fillRect(0, 0, 640, 360);
    g.fillStyle = "#C8503C";
    g.fillRect(0, 0, 640, 22);
    g.fillStyle = "#B9BDC4";
    for (let i = 0; i < 12; i++) g.fillRect(24, 56 + i * 22, i % 4 === 3 ? 150 : 215, 8);
    g.fillStyle = "#F5E94A"; // stock "handshake" panel
    g.fillRect(262, 60, 210, 130);
    g.fillStyle = "#1E4E9E";
    g.beginPath();
    g.ellipse(335, 128, 52, 26, -0.3, 0, 7);
    g.ellipse(402, 128, 52, 26, 0.3, 0, 7);
    g.fill();
    g.fillStyle = "#FFFFFF";
    g.beginPath();
    g.ellipse(368, 128, 26, 14, 0, 0, 7);
    g.fill();
    [["#10B3B3", 60], ["#F07A1A", 138], ["#3FB23F", 216], ["#8E2DD1", 294]].forEach(([col, y], i) => {
      g.fillStyle = col as string;
      g.fillRect(500, 60 + i * 64, 112, 56);
    });
    g.fillStyle = "#2A6CC8";
    g.beginPath();
    g.ellipse(540, 322, 48, 17, 0, 0, 7);
    g.fill();
    g.fillStyle = "#B9BDC4";
    for (let i = 0; i < 4; i++) g.fillRect(262, 214 + i * 22, 210, 8);
  } else {
    const grad = g.createLinearGradient(0, 0, 640, 360);
    grad.addColorStop(0, "#9A78F0");
    grad.addColorStop(0.55, "#F7918B");
    grad.addColorStop(1, "#FFC38F");
    g.fillStyle = grad;
    g.fillRect(0, 0, 640, 360);
    g.fillStyle = "rgba(255,255,255,.25)";
    g.beginPath();
    g.arc(540, 60, 120, 0, 7);
    g.fill();
    g.fillStyle = "#FFFFFF";
    g.font = "700 40px Poppins, sans-serif";
    g.fillText("Tu marca,", 40, 100);
    g.fillText("bien contada.", 40, 148);
    g.font = "500 18px Poppins, sans-serif";
    g.fillStyle = "rgba(255,255,255,.85)";
    g.fillText("Diseño sin gasto fijo", 40, 186);
    g.fillStyle = "rgba(255,255,255,.95)";
    g.beginPath();
    g.roundRect(300, 170, 300, 150, 18);
    g.fill();
    g.fillStyle = "#AB7FED";
    [44, 80, 62, 112, 96].forEach((h, i) => g.fillRect(325 + i * 52, 300 - h, 34, h));
    g.strokeStyle = "#F7918B";
    g.lineWidth = 5;
    g.beginPath();
    g.moveTo(325, 280);
    g.lineTo(380, 250);
    g.lineTo(430, 262);
    g.lineTo(485, 214);
    g.lineTo(560, 196);
    g.stroke();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
};

// ---------- people ----------
const Person: React.FC<{
  position: V3;
  rotY: number;
  shirt: string;
  skin: string;
  hair: string;
  seated?: boolean;
  seed: number;
  stress: number;
  happy: number;
  pointing?: boolean;
}> = ({ position, rotY, shirt, skin, hair, seated, seed, stress, happy, pointing }) => {
  const f = useCurrentFrame();
  const sh = Math.sin(f * 0.9 + seed) * 0.22 * stress; // head shake
  const bob = Math.sin(f * 0.5 + seed * 3) * 0.03 * stress;
  const torsoY = seated ? 0.98 : 1.1;
  const headY = torsoY + 0.78;
  const armWave = Math.sin(f * 0.8 + seed * 2) * stress;
  const smile = happy > 0.5;
  return (
    <group position={position} rotation={[0, rotY, 0]}>
      <group position={[0, bob, 0]}>
        {/* legs */}
        {seated ? (
          <>
            <RB size={[0.2, 0.2, 0.62]} color="#4B5563" position={[-0.14, 0.58, 0.28]} />
            <RB size={[0.2, 0.2, 0.62]} color="#4B5563" position={[0.14, 0.58, 0.28]} />
            <RB size={[0.18, 0.55, 0.18]} color="#4B5563" position={[-0.14, 0.28, 0.58]} />
            <RB size={[0.18, 0.55, 0.18]} color="#4B5563" position={[0.14, 0.28, 0.58]} />
          </>
        ) : (
          <>
            <RB size={[0.2, 0.9, 0.2]} color="#374151" position={[-0.14, 0.45, 0]} />
            <RB size={[0.2, 0.9, 0.2]} color="#374151" position={[0.14, 0.45, 0]} />
          </>
        )}
        {/* torso */}
        <mesh position={[0, torsoY, 0]}>
          <capsuleGeometry args={[0.3, 0.46, 6, 14]} />
          <Clay color={shirt} />
        </mesh>
        {/* arms */}
        {[-1, 1].map((side) => {
          const raise = pointing && side === 1 && happy < 0.5 ? -1.25 : -0.15 - stress * (0.9 + 0.5 * armWave * side);
          return (
            <group key={side} position={[side * 0.36, torsoY + 0.28, 0]} rotation={[seated && happy > 0.5 ? -0.9 : raise, 0, side * (0.12 + stress * 0.5)]}>
              <mesh position={[0, -0.28, 0]}>
                <capsuleGeometry args={[0.085, 0.38, 4, 10]} />
                <Clay color={shirt} />
              </mesh>
              <mesh position={[0, -0.58, 0]}>
                <sphereGeometry args={[0.085, 12, 12]} />
                <Clay color={skin} />
              </mesh>
            </group>
          );
        })}
        {/* head */}
        <group position={[0, headY, 0]} rotation={[0, sh, 0]}>
          <mesh>
            <sphereGeometry args={[0.31, 24, 24]} />
            <Clay color={skin} rough={0.45} />
          </mesh>
          <mesh position={[0, 0.07, -0.03]} scale={[1.04, 0.95, 1.04]}>
            <sphereGeometry args={[0.31, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
            <Clay color={hair} />
          </mesh>
          {[-1, 1].map((s2) => (
            <mesh key={s2} position={[s2 * 0.11, 0.03, 0.28]} scale={[1, happy > 0.5 ? 0.55 : 1.15, 0.6]}>
              <sphereGeometry args={[0.04, 10, 10]} />
              <meshStandardMaterial color="#1b1b1f" />
            </mesh>
          ))}
          {/* brows: furrowed while stressed */}
          {[-1, 1].map((s2) => (
            <mesh key={`b${s2}`} position={[s2 * 0.11, 0.13 + 0.02 * happy, 0.285]} rotation={[0, 0, s2 * (0.45 * (1 - happy) * Math.max(stress, 0.2) - 0.1 * happy)]}>
              <boxGeometry args={[0.1, 0.022, 0.02]} />
              <meshStandardMaterial color="#1b1b1f" />
            </mesh>
          ))}
          {/* mouth: arc, flipped for a smile */}
          <mesh position={[0, smile ? -0.03 : -0.1, 0.285]} rotation={[0, 0, smile ? Math.PI : 0]} scale={smile ? 1.15 : 0.8}>
            <torusGeometry args={[0.07, 0.016, 8, 16, Math.PI]} />
            <meshStandardMaterial color="#7a2f2f" />
          </mesh>
          {[-1, 1].map((s2) => (
            <mesh key={`c${s2}`} position={[s2 * 0.2, -0.05, 0.23]}>
              <sphereGeometry args={[0.06, 10, 10]} />
              <meshStandardMaterial color="#F7918B" transparent opacity={0.55 * happy} />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  );
};

const Chair: React.FC<{ position: V3; rotY: number; color: string }> = ({ position, rotY, color }) => (
  <group position={position} rotation={[0, rotY, 0]}>
    <RB size={[0.62, 0.1, 0.62]} color={color} position={[0, 0.5, 0]} />
    <RB size={[0.62, 0.62, 0.09]} color={color} position={[0, 0.85, -0.3]} />
    {[[-0.25, -0.25], [0.25, -0.25], [-0.25, 0.25], [0.25, 0.25]].map(([x, z], i) => (
      <mesh key={i} position={[x, 0.25, z]}>
        <cylinderGeometry args={[0.03, 0.03, 0.5, 8]} />
        <meshStandardMaterial color="#59606b" />
      </mesh>
    ))}
  </group>
);

// ---------- cost objects that swarm the room ----------
const Coins: React.FC = () => (
  <group>
    {[0, 1, 2, 3].map((i) => (
      <mesh key={i} position={[0, i * 0.075, 0]}>
        <cylinderGeometry args={[0.26, 0.26, 0.07, 20]} />
        <meshPhysicalMaterial color="#FFC83D" metalness={0.5} roughness={0.25} clearcoat={1} />
      </mesh>
    ))}
    <RB size={[0.7, 0.03, 0.34]} color="#58C27D" position={[0.18, 0.4, 0.1]} rotation={[0.2, 0.5, 0.15]} />
  </group>
);
const Gift: React.FC = () => (
  <group>
    <RB size={[0.55, 0.45, 0.55]} color="#E9578F" position={[0, 0.22, 0]} />
    <RB size={[0.6, 0.12, 0.6]} color="#C93C75" position={[0, 0.5, 0]} />
    <RB size={[0.12, 0.47, 0.57]} color="#FFE08A" position={[0, 0.23, 0]} />
    <RB size={[0.57, 0.47, 0.12]} color="#FFE08A" position={[0, 0.23, 0]} />
  </group>
);
const Laptop: React.FC = () => (
  <group>
    <RB size={[0.8, 0.05, 0.55]} color="#B8BEC9" position={[0, 0.03, 0]} />
    <group position={[0, 0.06, -0.27]} rotation={[-0.35, 0, 0]}>
      <RB size={[0.8, 0.52, 0.04]} color="#9AA2B1" position={[0, 0.26, 0]} />
      <mesh position={[0, 0.26, 0.026]}>
        <planeGeometry args={[0.7, 0.42]} />
        <meshBasicMaterial color="#6FA8FF" />
      </mesh>
    </group>
  </group>
);
const Cards: React.FC = () => (
  <group>
    {[0, 1, 2].map((i) => (
      <group key={i} position={[i * 0.12 - 0.12, i * 0.05, i * -0.04]} rotation={[0, 0.35 * (i - 1), 0.12 * (i - 1)]}>
        <RB size={[0.72, 0.46, 0.03]} color={["#5B8DEF", "#AB7FED", "#2FC4B2"][i]} />
        <mesh position={[0, -0.06, 0.02]}>
          <planeGeometry args={[0.5, 0.05]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
        <mesh position={[-0.2, 0.1, 0.02]}>
          <circleGeometry args={[0.07, 14]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
      </group>
    ))}
  </group>
);
const CalendarObj: React.FC = () => (
  <group>
    <RB size={[0.9, 0.9, 0.08]} color="#FFFFFF" position={[0, 0.45, 0]} />
    <RB size={[0.9, 0.2, 0.1]} color="#F26B5B" position={[0, 0.82, 0]} />
    {[0, 1, 2, 3].map((r) =>
      [0, 1, 2, 3].map((c) => (
        <mesh key={`${r}${c}`} position={[-0.3 + c * 0.2, 0.55 - r * 0.15, 0.045]}>
          <planeGeometry args={[0.1, 0.07]} />
          <meshBasicMaterial color={r === 1 && c === 2 ? "#F26B5B" : "#C9CDD8"} />
        </mesh>
      )),
    )}
  </group>
);

const COSTS: { at: number; node: React.ReactNode; scale: number; r: number; a0: number; w: number; h: number }[] = [
  { at: CUE.sueldo, node: <Coins />, scale: 1, r: 2.1, a0: 0.4, w: 0.9, h: 2.4 },
  { at: CUE.sueldo + 0.12, node: <Coins />, scale: 0.8, r: 3.0, a0: 3.2, w: -0.7, h: 3.2 },
  { at: CUE.prestaciones, node: <Gift />, scale: 1.1, r: 2.5, a0: 1.6, w: 0.8, h: 2.8 },
  { at: CUE.prestaciones + 0.14, node: <Gift />, scale: 0.8, r: 3.2, a0: 4.7, w: -0.9, h: 1.9 },
  { at: CUE.equipo, node: <Laptop />, scale: 1.2, r: 2.3, a0: 2.4, w: -0.85, h: 3.4 },
  { at: CUE.equipo + 0.12, node: <Laptop />, scale: 0.9, r: 3.1, a0: 5.4, w: 0.7, h: 2.2 },
  { at: CUE.licencias, node: <Cards />, scale: 1.3, r: 2.7, a0: 0.9, w: 0.95, h: 3.0 },
  { at: CUE.licencias + 0.12, node: <Cards />, scale: 1, r: 2.2, a0: 3.9, w: -1.0, h: 2.0 },
  { at: CUE.anio, node: <CalendarObj />, scale: 1.8, r: 1.6, a0: 5.0, w: 0.55, h: 3.7 },
];

const CostObj: React.FC<{ def: (typeof COSTS)[number]; idx: number }> = ({ def, idx }) => {
  const f = useCurrentFrame();
  const t0 = sec(def.at);
  const pop = spring({ frame: f - t0, fps: FPS, config: { damping: 9, stiffness: 140 } });
  const out = interpolate(f, [FIX, FIX + 8], [1, 0], { ...clamp, easing: Easing.in(Easing.cubic) });
  if (f < t0 || f > FIX + 9) return null;
  const tt = (f - t0) / FPS;
  const ang = def.a0 + def.w * tt * 1.3 + (f - t0 < 10 ? 0 : 0);
  const drop = (1 - Math.min(1, (f - t0) / 14)) ** 2 * 4; // falls in from above
  const x = Math.cos(ang) * def.r * (1 + 0.25 * (1 - out));
  const z = Math.sin(ang) * def.r * (1 + 0.25 * (1 - out));
  const y = def.h + Math.sin(f * 0.18 + idx * 2) * 0.22 + drop + (1 - out) * 2.5;
  return (
    <group position={[x, y, z]} rotation={[tt * 1.4 + idx, tt * 2 + idx, tt * 0.8]} scale={def.scale * pop * out}>
      {def.node}
    </group>
  );
};

const Papers: React.FC = () => {
  const f = useCurrentFrame();
  const items = useMemo(() => {
    const r = rand(42);
    return Array.from({ length: 34 }, (_, i) => ({
      at: 0.9 + (i / 34) ** 0.75 * 6.9,
      r: 1.2 + r() * 2.6,
      a0: r() * 6.28,
      w: (r() < 0.5 ? -1 : 1) * (0.7 + r() * 0.9),
      h: 0.8 + r() * 3.6,
      ph: r() * 6,
    }));
  }, []);
  return (
    <>
      {items.map((p, i) => {
        const t0 = sec(p.at);
        if (f < t0 || f > FIX + 7) return null;
        const tt = (f - t0) / FPS;
        const grow = Math.min(1, (f - t0) / 8);
        const out = interpolate(f, [FIX, FIX + 7], [1, 0], clamp);
        const ang = p.a0 + p.w * tt * 1.5;
        return (
          <mesh
            key={i}
            position={[Math.cos(ang) * p.r, p.h + Math.sin(f * 0.15 + p.ph) * 0.3, Math.sin(ang) * p.r]}
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

const Confetti: React.FC = () => {
  const f = useCurrentFrame();
  const bits = useMemo(() => {
    const r = rand(9);
    return Array.from({ length: 46 }, () => ({
      v: [(r() - 0.5) * 4, 3 + r() * 3.5, (r() - 0.5) * 4] as V3,
      c: ["#F7918B", "#AB7FED", "#FBE7DA", "#FFFFFF", "#FFD25A", "#B69AE5"][Math.floor(r() * 6)],
      s: 0.08 + r() * 0.1,
      sp: (r() - 0.5) * 18,
    }));
  }, []);
  const t = (f - FIX) / FPS;
  if (t < 0 || t > 1.7) return null;
  return (
    <>
      {bits.map((b, i) => (
        <mesh
          key={i}
          position={[b.v[0] * t, Math.max(0.1, 0.8 + b.v[1] * t - 4.5 * t * t), b.v[2] * t]}
          rotation={[t * b.sp, t * b.sp * 0.7, 0]}
          scale={Math.min(1, (1.7 - t) * 2.5)}
        >
          <boxGeometry args={[b.s, b.s * 0.2, b.s * 1.5]} />
          <meshBasicMaterial color={b.c} />
        </mesh>
      ))}
    </>
  );
};

// ---------- the room ----------
export const Room: React.FC = () => {
  const f = useCurrentFrame();
  const k = interpolate(f, [FIX, FIX + 30], [0, 1], { ...clamp, easing: ease });
  const stress = interpolate(f, [sec(2.2), sec(7.4)], [0.0, 1], clamp) * (1 - interpolate(f, [FIX - 2, FIX + 8], [0, 1], clamp));
  const happy = interpolate(f, [FIX + 8, FIX + 20], [0, 1], clamp);

  const generic = useMemo(() => makeSlide("generic"), []);
  const alva = useMemo(() => makeSlide("alva"), []);
  const showAlva = f >= FIX + 14;
  const tvOn = f < FIX + 4 || f >= FIX + 14;
  const tvPop = spring({ frame: f - (FIX + 14), fps: FPS, config: { damping: 10, stiffness: 160 }, from: 0.88, to: 1 });

  const wall = mix("#9AA0A6", "#F2B8A4", k);
  const wallB = mix("#8C9298", "#F7C8B6", k);
  const floor = mix("#767C82", "#F0D2B0", k);
  const slab = mix("#6A7076", "#D7A98A", k);
  const chair = mix("#8E9AAF", "#A28FD6", k);

  // fix burst
  const ring = interpolate(f, [FIX, FIX + 22], [0, 1], clamp);

  return (
    <group>
      {/* floor slab + walls */}
      <RB size={[7, 0.3, 7]} color={slab} position={[0, -0.15, 0]} radius={0.08} />
      <RB size={[6.8, 0.06, 6.8]} color={floor} position={[0, 0.03, 0]} radius={0.02} glow={0.4} />
      <RB size={[7, 4.2, 0.22]} color={wall} position={[0, 2.1, -3.39]} radius={0.06} glow={0.5} />
      <RB size={[0.22, 4.2, 7]} color={wallB} position={[-3.39, 2.1, 0]} radius={0.06} glow={0.5} />
      {/* floor planks appear when it is rebuilt */}
      {[-2.4, -1.2, 0, 1.2, 2.4].map((x, i) => (
        <mesh key={i} position={[x, 0.07, 0]} scale={[1, 1, k]}>
          <boxGeometry args={[0.04, 0.01, 6.6]} />
          <meshBasicMaterial color="#C99A6E" transparent opacity={0.45 * k} />
        </mesh>
      ))}

      {/* TV */}
      <group position={[0.2, 2.35, -3.2]} scale={showAlva ? tvPop : 1}>
        <RB size={[2.75, 1.65, 0.14]} color="#14161B" radius={0.05} />
        {tvOn && (
          <mesh position={[0, 0, 0.075]}>
            <planeGeometry args={[2.6, 1.46]} />
            <meshBasicMaterial map={showAlva ? alva : generic} toneMapped={false} />
          </mesh>
        )}
      </group>

      {/* table + chairs */}
      <RB size={[2.7, 0.12, 1.4]} color="#C99A6E" position={[0, 0.8, 0]} />
      {[[-1.15, -0.5], [1.15, -0.5], [-1.15, 0.5], [1.15, 0.5]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.4, z]}>
          <cylinderGeometry args={[0.06, 0.06, 0.8, 10]} />
          <meshStandardMaterial color="#A97B50" />
        </mesh>
      ))}
      <Chair position={[-0.75, 0, -1.1]} rotY={0} color={chair} />
      <Chair position={[0.85, 0, -1.1]} rotY={0} color={chair} />
      <Chair position={[-2.05, 0, 0.05]} rotY={Math.PI / 2} color={chair} />
      {/* things on the table */}
      <RB size={[0.4, 0.03, 0.3]} color="#FFFFFF" position={[-0.4, 0.88, 0.2]} rotation={[0, 0.3, 0]} />
      <RB size={[0.4, 0.03, 0.3]} color="#FFFFFF" position={[0.7, 0.88, 0.1]} rotation={[0, -0.2, 0]} />
      {[[0.1, -0.1], [0.3, 0.3]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.98, z]}>
          <cylinderGeometry args={[0.07, 0.07, 0.34, 12]} />
          <meshPhysicalMaterial color="#BFE3F5" transparent opacity={0.7} roughness={0.1} />
        </mesh>
      ))}

      {/* plant */}
      <group position={[-2.7, 0, -2.6]}>
        <mesh position={[0, 0.3, 0]}>
          <cylinderGeometry args={[0.28, 0.2, 0.6, 14]} />
          <Clay color="#C97B55" />
        </mesh>
        {[[0, 0.95, 0, 0.42], [-0.2, 1.25, 0.1, 0.32], [0.22, 1.2, -0.08, 0.3]].map(([x, y, z, r], i) => (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[r, 14, 14]} />
            <Clay color="#5FA36B" />
          </mesh>
        ))}
      </group>

      {/* people */}
      <Person position={[0.2, 0, -2.45]} rotY={0} shirt={mix("#4F7FD6", "#AB7FED", k)} skin="#C98A5E" hair="#3A2A22" seed={1} stress={stress} happy={happy} pointing />
      <Person position={[-0.75, 0, -1.1]} rotY={0} shirt={mix("#C9B79C", "#F7C3B3", k)} skin="#E8B994" hair="#7A5A3C" seated seed={2} stress={stress} happy={happy} />
      <Person position={[0.85, 0, -1.1]} rotY={0} shirt={mix("#6C737D", "#7B5AA6", k)} skin="#A56E48" hair="#BDBDBD" seated seed={3} stress={stress} happy={happy} />
      <Person position={[-2.05, 0, 0.05]} rotY={Math.PI / 2} shirt={mix("#6AA37A", "#58C2A8", k)} skin="#E2B08A" hair="#4A2F22" seated seed={4} stress={stress} happy={happy} />

      {/* the mess */}
      {COSTS.map((c, i) => (
        <CostObj key={i} def={c} idx={i} />
      ))}
      <Papers />

      {/* the fix: shockwave + confetti */}
      {f >= FIX && f < FIX + 24 && (
        <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={0.3 + ring * 3.2}>
          <ringGeometry args={[0.94, 1, 64]} />
          <meshBasicMaterial color="#FFFFFF" transparent opacity={0.7 * (1 - ring)} />
        </mesh>
      )}
      <Confetti />
    </group>
  );
};
