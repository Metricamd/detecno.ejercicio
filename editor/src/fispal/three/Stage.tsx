import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import React, { useEffect } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

// Procedural studio reflections (no HDR download needed) so the glossy
// materials read as 3D instead of flat.
const StudioEnv: React.FC = () => {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const tex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = tex;
    return () => {
      tex.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);
  return null;
};

// A transparent 3D layer positioned absolutely on the 1080×1920 canvas.
export const Stage: React.FC<{
  top: number;
  height: number;
  left?: number;
  width?: number;
  fov?: number;
  z?: number;
  children: React.ReactNode;
}> = ({ top, height, left = 0, width = 1080, fov = 30, z = 7.5, children }) => (
  <div style={{ position: "absolute", top, left, width, height, pointerEvents: "none" }}>
    <ThreeCanvas
      width={width}
      height={height}
      camera={{ position: [0, 0, z], fov }}
      gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
      style={{ background: "transparent" }}
    >
      <StudioEnv />
      <ambientLight intensity={0.95} />
      <directionalLight position={[4, 6, 8]} intensity={1.6} />
      <directionalLight position={[-6, -2, 4]} intensity={0.5} color="#C9C2FF" />
      {children}
    </ThreeCanvas>
  </div>
);
