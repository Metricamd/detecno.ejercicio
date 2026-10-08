// 3D illustrations for the white Venvers carousel. Each one is pre-rendered
// to a transparent PNG (public/venvers/3d/*.png) through the VenversIllus
// composition, then placed as an image so slides avoid WebGL compositing.
import React, { useEffect, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, useCurrentFrame } from "remotion";
import { Stage } from "../fispal/three/Stage";
import { Glossy, Pop, RBox } from "../fispal/three/objects";

type V3 = [number, number, number];
const C = {
  violet: "#7B5CF5",
  purple: "#5B2BE0",
  lilac: "#C9BCFF",
  navy: "#14117E",
  white: "#FFFFFF",
  ok: "#14B37D",
  bad: "#E5484D",
  gold: "#FFCF4A",
};

const Check: React.FC<{ position?: V3; s?: number }> = ({ position, s = 1 }) => (
  <group position={position} scale={[s, s, s]}>
    <RBox size={[0.13, 0.3, 0.1]} radius={0.04} color={C.white} position={[-0.11, -0.04, 0]} rotation={[0, 0, 0.75]} />
    <RBox size={[0.13, 0.58, 0.1]} radius={0.04} color={C.white} position={[0.09, 0.06, 0]} rotation={[0, 0, -0.65]} />
  </group>
);

const Cross: React.FC<{ position?: V3; s?: number }> = ({ position, s = 1 }) => (
  <group position={position} scale={[s, s, s]}>
    <RBox size={[0.12, 0.5, 0.1]} radius={0.04} color={C.white} rotation={[0, 0, 0.785]} />
    <RBox size={[0.12, 0.5, 0.1]} radius={0.04} color={C.white} rotation={[0, 0, -0.785]} />
  </group>
);

const Badge: React.FC<{ position: V3; r?: number; color: string; children: React.ReactNode }> = ({ position, r = 0.55, color, children }) => (
  <group position={position}>
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[r, r, 0.22, 48]} />
      <Glossy color={color} />
    </mesh>
    <group position={[0, 0, 0.14]} scale={[r / 0.55, r / 0.55, 1]}>
      {children}
    </group>
  </group>
);

const Doc: React.FC<{ w?: number; h?: number }> = ({ w = 2.4, h = 3.1 }) => (
  <group>
    <RBox size={[w, h, 0.18]} radius={0.14} color={C.white} />
    <RBox size={[w, h * 0.17, 0.2]} radius={0.12} color={C.purple} position={[0, h * 0.415, 0.01]} />
    {[0.18, 0.02, -0.14].map((t, i) => (
      <RBox key={i} size={[w * (i === 1 ? 0.5 : 0.7), 0.12, 0.05]} radius={0.04} color={C.lilac} position={[-w * (i === 1 ? 0.17 : 0.07), h * t, 0.11]} />
    ))}
  </group>
);

const Envelope: React.FC = () => (
  <group>
    <RBox size={[2, 1.35, 0.14]} radius={0.1} color={C.white} />
    <RBox size={[1.25, 0.09, 0.05]} radius={0.03} color={C.lilac} position={[-0.47, 0.25, 0.09]} rotation={[0, 0, -0.58]} />
    <RBox size={[1.25, 0.09, 0.05]} radius={0.03} color={C.lilac} position={[0.47, 0.25, 0.09]} rotation={[0, 0, 0.58]} />
  </group>
);

/* S3 — validated CFDI: the document passes, the rejection emails fade back */
const ValidatedDoc: React.FC = () => (
  <group>
    <group position={[-1.7, 1.6, -1.2]} rotation={[0.2, 0.5, 0.25]} scale={[0.75, 0.75, 0.75]}>
      <Envelope />
      <Badge position={[0.95, 0.6, 0.15]} r={0.42} color={C.bad}>
        <Cross />
      </Badge>
    </group>
    <group position={[-2.0, -1.2, -0.8]} rotation={[0.1, 0.6, -0.2]} scale={[0.6, 0.6, 0.6]}>
      <Envelope />
      <Badge position={[0.95, 0.6, 0.15]} r={0.42} color={C.bad}>
        <Cross />
      </Badge>
    </group>
    <group rotation={[0.12, -0.38, 0.05]} position={[0.4, 0, 0]}>
      <Doc />
      <Badge position={[0.95, -1.15, 0.35]} r={0.75} color={C.ok}>
        <Check s={1.1} />
      </Badge>
    </group>
  </group>
);

/* S4 mini illustrations */
const DocCheck: React.FC = () => (
  <group rotation={[0.15, -0.45, 0.05]}>
    <Doc w={2} h={2.6} />
    <Badge position={[0.8, -0.95, 0.3]} r={0.65} color={C.ok}>
      <Check />
    </Badge>
  </group>
);

const Eye: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <group rotation={[0.1, -0.3 + Math.sin(frame / 30) * 0.05, 0]}>
      <mesh>
        <sphereGeometry args={[1.25, 64, 64]} />
        <Glossy color={C.white} rough={0.15} />
      </mesh>
      <mesh position={[0, 0, 1.2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.66, 0.66, 0.12, 64]} />
        <Glossy color={C.violet} />
      </mesh>
      <mesh position={[0, 0, 1.28]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.32, 0.32, 0.06, 48]} />
        <Glossy color={C.navy} />
      </mesh>
      <mesh position={[0.18, 0.2, 1.34]}>
        <sphereGeometry args={[0.1, 24, 24]} />
        <Glossy color={C.white} />
      </mesh>
      <mesh rotation={[0.3, 0.2, 0]}>
        <torusGeometry args={[1.7, 0.1, 24, 96]} />
        <Glossy color={C.purple} />
      </mesh>
    </group>
  );
};

const Coins: React.FC = () => (
  <group rotation={[0.38, -0.45, 0]}>
    {[3, 5, 7].map((h, s) =>
      Array.from({ length: h }).map((_, i) => (
        <mesh key={`${s}-${i}`} position={[s * 1.1 - 1.4, -1.3 + i * 0.22, 0]}>
          <cylinderGeometry args={[0.5, 0.5, 0.18, 48]} />
          <Glossy color={C.gold} metal={0.05} rough={0.25} />
        </mesh>
      )),
    )}
    <group position={[1.6, 0.6, 0.6]}>
      <RBox size={[0.36, 1.2, 0.36]} radius={0.12} color={C.violet} position={[0, -0.2, 0]} />
      <mesh position={[0, 0.65, 0]}>
        <coneGeometry args={[0.5, 0.6, 32]} />
        <Glossy color={C.violet} />
      </mesh>
    </group>
  </group>
);

/* S5 — the Venvers "planet": everything orbiting one portal */
const Hub: React.FC = () => {
  const frame = useCurrentFrame();
  const sats: { a: number; el: React.ReactNode }[] = [
    {
      a: -0.4,
      el: (
        <group scale={[0.32, 0.32, 0.32]}>
          <Doc />
        </group>
      ),
    },
    {
      a: 2.5,
      el: (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.38, 0.38, 0.14, 48]} />
          <Glossy color={C.gold} metal={0.05} rough={0.25} />
        </mesh>
      ),
    },
    {
      a: 1.6,
      el: (
        <Badge position={[0, 0, 0]} r={0.4} color={C.ok}>
          <Check />
        </Badge>
      ),
    },
    { a: 0.5, el: <RBox size={[0.6, 0.6, 0.6]} radius={0.14} color={C.violet} /> },
  ];
  return (
    <group rotation={[0, 0, -0.18]}>
      <mesh>
        <sphereGeometry args={[1.45, 64, 64]} />
        <Glossy color={C.purple} rough={0.2} />
      </mesh>
      <group rotation={[0.42, 0, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2.4, 0.07, 24, 128]} />
          <Glossy color={C.lilac} />
        </mesh>
        {sats.map((st, i) => {
          const a = st.a + frame * 0.01;
          return (
            <group key={i} position={[Math.cos(a) * 2.4, 0, Math.sin(a) * 2.4]} rotation={[-0.42, -0.3, 0.18]}>
              {st.el}
            </group>
          );
        })}
      </group>
    </group>
  );
};

const ILLUS: Record<string, { el: React.ReactNode; z?: number }> = {
  "cfdi-validado": { el: <ValidatedDoc />, z: 9 },
  "doc-check": { el: <DocCheck /> },
  ojo: { el: <Eye /> },
  monedas: { el: <Coins /> },
  planeta: { el: <Hub />, z: 10 },
};
export const VENVERS_ILLUS = Object.keys(ILLUS);

export const VenversIllus: React.FC<{ name: string }> = ({ name }) => {
  const [handle] = useState(() => delayRender("3D"));
  useEffect(() => {
    continueRender(handle);
  }, [handle]);
  const it = ILLUS[name];
  return (
    <AbsoluteFill style={{ background: "transparent" }}>
      {it && (
        <Stage top={0} left={0} width={1000} height={1000} z={it.z ?? 7.5}>
          <ambientLight intensity={0.9} />
          <directionalLight position={[2, 4, 6]} intensity={1.1} />
          <Pop at={0} scale={1} spin={0} tilt={0.04}>
            {it.el}
          </Pop>
        </Stage>
      )}
    </AbsoluteFill>
  );
};
