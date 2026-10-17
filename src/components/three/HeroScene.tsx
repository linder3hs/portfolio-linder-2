"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const COUNT = 3500;

/**
 * Seeded PRNG. The field is deterministic, so the layout is identical on every
 * mount and the geometry build stays a pure computation.
 */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * One <points> object = one draw call for the whole field. This is what makes
 * 3500 particles cheaper than the 80-particle 2D canvas it replaced, which did
 * an O(n²) neighbour scan on the CPU every frame.
 */
function ParticleField() {
  const groupRef = useRef<THREE.Group>(null);
  const { size } = useThree();

  const { positions, colors } = useMemo(() => {
    const rand = mulberry32(0x5eed);
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);

    const near = new THREE.Color("#C084FC");
    const far = new THREE.Color("#4C1D95");
    const tint = new THREE.Color();

    for (let i = 0; i < COUNT; i++) {
      // Points on a spherical shell with jittered radius — reads as depth
      // rather than as a flat scatter.
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(2 * rand() - 1);
      const radius = 3.2 + rand() * 3.4;

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.65;
      positions[i * 3 + 2] = radius * Math.cos(phi);

      // Nearer points are brighter, so the cloud has a readable front and back.
      tint.copy(far).lerp(near, Math.pow(rand(), 2));
      colors[i * 3] = tint.r;
      colors[i * 3 + 1] = tint.g;
      colors[i * 3 + 2] = tint.b;
    }

    return { positions, colors };
  }, []);

  const pointer = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;

    // Constant slow drift.
    group.rotation.y += delta * 0.045;
    group.rotation.x += delta * 0.012;

    // Pointer parallax, eased so it never snaps.
    pointer.current.x += (state.pointer.x * 0.22 - pointer.current.x) * 0.04;
    pointer.current.y += (state.pointer.y * 0.16 - pointer.current.y) * 0.04;
    group.position.x = pointer.current.x;
    group.position.y = pointer.current.y;
  });

  // Keep the dot size stable-ish across viewport widths.
  const pointSize = size.width < 768 ? 0.022 : 0.017;

  return (
    <group ref={groupRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={pointSize}
          vertexColors
          transparent
          opacity={0.85}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

export default function HeroScene({ active = true }: { active?: boolean }) {
  return (
    <Canvas
      // `never` fully stops the render loop when the hero scrolls out of view.
      frameloop={active ? "always" : "never"}
      camera={{ position: [0, 0, 7.5], fov: 55 }}
      dpr={[1, 1.75]}
      gl={{ antialias: false, powerPreference: "high-performance" }}
      style={{ position: "absolute", inset: 0 }}
    >
      <ParticleField />
    </Canvas>
  );
}
