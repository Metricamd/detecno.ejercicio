import React, { useMemo } from "react";
import { Easing, useCurrentFrame } from "remotion";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { CUE } from "./timeline";

const FPS = 30;
export const sec = (t: number) => Math.round(t * FPS);
export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const ease = Easing.bezier(0.65, 0, 0.35, 1);
export type V3 = [number, number, number];

export const FIX = sec(CUE.fix);
export const mix = (a: string, b: string, k: number) =>
  "#" + new THREE.Color(a).lerp(new THREE.Color(b), k).getHexString();

// Deterministic randomness so every render frame agrees.
export const rand = (seed: number) => {
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
export const Clay: React.FC<{ color: string; rough?: number; glow?: number }> = ({ color, rough = 0.55, glow = 0 }) => (
  <meshPhysicalMaterial color={color} roughness={rough} metalness={0.02} clearcoat={0.3} clearcoatRoughness={0.4} emissive={color} emissiveIntensity={glow} />
);

export const RB: React.FC<{ size: V3; color: string; position?: V3; rotation?: V3; radius?: number; glow?: number }> = ({
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
export const makeSlide = (kind: "generic" | "alva") => {
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
export const Person: React.FC<{
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
  walkPhase?: number; // radians of the gait cycle (standing people only)
  moving?: number; // 0 = standing still, 1 = full stride
}> = ({ position, rotY, shirt, skin, hair, seated, seed, stress, happy, pointing, walkPhase, moving = 0 }) => {
  const f = useCurrentFrame();
  const sh = Math.sin(f * 0.9 + seed) * 0.22 * stress; // head shake
  const walking = walkPhase !== undefined;
  const stride = walking ? Math.sin(walkPhase) * 0.75 * moving : 0;
  const bob = walking ? Math.abs(Math.sin(walkPhase)) * 0.07 * moving : Math.sin(f * 0.5 + seed * 3) * 0.03 * stress;
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
            {[-1, 1].map((sd) => (
              <group key={sd} position={[sd * 0.14, 0.9 - bob, 0]} rotation={[sd * stride, 0, 0]}>
                <RB size={[0.2, 0.9, 0.2]} color="#374151" position={[0, -0.45, 0]} />
              </group>
            ))}
          </>
        )}
        {/* torso */}
        <mesh position={[0, torsoY, 0]}>
          <capsuleGeometry args={[0.3, 0.46, 6, 14]} />
          <Clay color={shirt} />
        </mesh>
        {/* arms */}
        {[-1, 1].map((side) => {
          const raise = walking ? -side * stride * 0.8 : pointing && side === 1 && happy < 0.5 ? -1.25 : -0.15 - stress * (0.9 + 0.5 * armWave * side);
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

export const Chair: React.FC<{ position: V3; rotY: number; color: string }> = ({ position, rotY, color }) => (
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
export const Coins: React.FC = () => (
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
export const Gift: React.FC = () => (
  <group>
    <RB size={[0.55, 0.45, 0.55]} color="#E9578F" position={[0, 0.22, 0]} />
    <RB size={[0.6, 0.12, 0.6]} color="#C93C75" position={[0, 0.5, 0]} />
    <RB size={[0.12, 0.47, 0.57]} color="#FFE08A" position={[0, 0.23, 0]} />
    <RB size={[0.57, 0.47, 0.12]} color="#FFE08A" position={[0, 0.23, 0]} />
  </group>
);
export const Laptop: React.FC = () => (
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
export const Cards: React.FC = () => (
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
export const CalendarObj: React.FC = () => (
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

export const Confetti: React.FC<{ origin?: V3 }> = ({ origin = [0, 0, 0] }) => {
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
          position={[origin[0] + b.v[0] * t, Math.max(0.1, origin[1] + 0.8 + b.v[1] * t - 4.5 * t * t), origin[2] + b.v[2] * t]}
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

