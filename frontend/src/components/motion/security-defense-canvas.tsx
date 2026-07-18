"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import type { Group } from "three";

function DefenseLayers() {
  const groupRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    const group = groupRef.current;

    if (!group) {
      return;
    }

    const elapsed = clock.getElapsedTime();
    group.rotation.x = -0.18 + Math.sin(elapsed * 0.28) * 0.035;
    group.rotation.y = elapsed * 0.075;
  });

  return (
    <group ref={groupRef} rotation={[-0.18, -0.35, 0.08]}>
      {[0.72, 1, 1.28].map((scale, index) => (
        <mesh key={scale} rotation={[0, index * 0.22, index * 0.08]} scale={scale}>
          <boxGeometry args={[2.7, 1.65, 1.05]} />
          <meshBasicMaterial
            color={index === 1 ? "#aebbb5" : "#67e8c2"}
            opacity={0.2 + index * 0.08}
            transparent
            wireframe
          />
        </mesh>
      ))}
      <mesh>
        <octahedronGeometry args={[0.42, 0]} />
        <meshStandardMaterial color="#67e8c2" metalness={0.25} roughness={0.34} wireframe />
      </mesh>
    </group>
  );
}

export function SecurityDefenseCanvas() {
  return (
    <Canvas
      aria-hidden="true"
      camera={{ fov: 38, position: [0, 0.2, 5.6] }}
      dpr={[1, 1.35]}
      gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
    >
      <ambientLight intensity={1.1} />
      <directionalLight color="#d9fff3" intensity={2.4} position={[3, 4, 5]} />
      <DefenseLayers />
    </Canvas>
  );
}
