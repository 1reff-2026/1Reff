"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { RoundedBox, Sphere, Capsule, Text } from "@react-three/drei";

/**
 * Riffy — the 1Reff mascot, as real 3D geometry (no GLB required).
 *
 * npm i three @react-three/fiber @react-three/drei
 *
 * <Riffy3D mood="idle" />
 *   mood: "idle" | "thinking" | "happy"   (driven by your app/search state)
 *   waveOnMount: plays a hello-wave once when it first appears (default true)
 *   size: pixel size of the square canvas (default 260)
 *   followCursor: head/eyes track the pointer (default true)
 */

const COLORS = {
  body: "#f5f5fa",
  bodyShadow: "#e4e3ef",
  face: "#0a0a12",
  eye: "#7ecbff",
  eyeGlow: "#9fdcff",
  accent: "#7c5cff",
  accentDeep: "#5a3fe0",
  logoBlue: "#4f7dff",
  logoPurple: "#8b5cf6",
};

function Riffy({ mood, waveActive, followCursor }) {
  const head = useRef();
  const rightArm = useRef();
  const leftEye = useRef();
  const rightEye = useRef();
  const antennaTip = useRef();
  const root = useRef();
  const { pointer } = useThree();

  const t0 = useMemo(() => Math.random() * 10, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime + t0;

    // idle bob for the whole body
    if (root.current) {
      root.current.position.y = Math.sin(t * 1.4) * 0.05;
    }

    // antenna tip glow pulse
    if (antennaTip.current) {
      const pulse = mood === "thinking" ? 4 : 1.6;
      const s = 1 + Math.sin(t * pulse) * (mood === "thinking" ? 0.18 : 0.08);
      antennaTip.current.scale.setScalar(s);
    }

    // head follows cursor (subtle), overridden by look-down while "thinking"
    if (head.current) {
      let targetY = 0;
      let targetX = 0;
      if (followCursor && mood !== "thinking") {
        targetY = pointer.x * 0.35;
        targetX = -pointer.y * 0.15;
      } else if (mood === "thinking") {
        targetY = 0.25;
        targetX = 0.12;
      }
      head.current.rotation.y += (targetY - head.current.rotation.y) * Math.min(1, delta * 4);
      head.current.rotation.x += (targetX - head.current.rotation.x) * Math.min(1, delta * 4);
    }

    // eyes: happy = wider/brighter, thinking = narrowed, idle = soft blink
    const blink = mood === "idle" ? Math.max(0, Math.sin(t * 0.6)) < 0.04 ? 0.15 : 1 : 1;
    [leftEye.current, rightEye.current].forEach((eye) => {
      if (!eye) return;
      const targetScaleY = mood === "thinking" ? 0.55 : mood === "happy" ? 1.25 : blink;
      eye.scale.y += (targetScaleY - eye.scale.y) * Math.min(1, delta * 8);
      const targetScaleXY = mood === "happy" ? 1.15 : 1;
      eye.scale.x += (targetScaleXY - eye.scale.x) * Math.min(1, delta * 8);
    });

    // right arm: wave animation
    if (rightArm.current) {
      if (waveActive) {
        rightArm.current.rotation.z = -2.0 + Math.sin(t * 9) * 0.35;
      } else {
        const rest = -0.15;
        rightArm.current.rotation.z += (rest - rightArm.current.rotation.z) * Math.min(1, delta * 5);
      }
    }
  });

  const eyeEmissive = mood === "happy" ? COLORS.eyeGlow : COLORS.eye;

  return (
    <group ref={root}>
      {/* legs */}
      <Capsule args={[0.16, 0.22, 4, 8]} position={[-0.22, -1.05, 0]} castShadow>
        <meshStandardMaterial color={COLORS.body} roughness={0.4} />
      </Capsule>
      <Capsule args={[0.16, 0.22, 4, 8]} position={[0.22, -1.05, 0]} castShadow>
        <meshStandardMaterial color={COLORS.body} roughness={0.4} />
      </Capsule>

      {/* body */}
      <group position={[0, -0.35, 0]}>
        <Capsule args={[0.52, 0.55, 6, 12]} castShadow>
          <meshStandardMaterial color={COLORS.body} roughness={0.35} />
        </Capsule>
        <Text
          position={[0, -0.05, 0.5]}
          fontSize={0.32}
          anchorX="center"
          anchorY="middle"
          color={COLORS.logoPurple}
          font={undefined}
        >
          1R
        </Text>
      </group>

      {/* left arm (static, relaxed) */}
      <group position={[-0.62, -0.3, 0]} rotation={[0, 0, 0.2]}>
        <Capsule args={[0.11, 0.55, 4, 8]} castShadow>
          <meshStandardMaterial color={COLORS.body} roughness={0.4} />
        </Capsule>
      </group>

      {/* right arm (waves) */}
      <group ref={rightArm} position={[0.62, 0, 0]} rotation={[0, 0, -0.15]}>
        <Capsule args={[0.11, 0.55, 4, 8]} position={[0, -0.3, 0]} castShadow>
          <meshStandardMaterial color={COLORS.body} roughness={0.4} />
        </Capsule>
      </group>

      {/* head */}
      <group ref={head} position={[0, 0.55, 0]}>
        {/* antenna */}
        <mesh position={[0, 0.85, 0]}>
          <cylinderGeometry args={[0.015, 0.02, 0.35, 8]} />
          <meshStandardMaterial color={COLORS.accentDeep} metalness={0.3} roughness={0.4} />
        </mesh>
        <Sphere ref={antennaTip} args={[0.075, 16, 16]} position={[0, 1.05, 0]}>
          <meshStandardMaterial
            color={COLORS.accent}
            emissive={COLORS.accent}
            emissiveIntensity={1.4}
            roughness={0.2}
          />
        </Sphere>

        {/* skull */}
        <Sphere args={[0.62, 32, 32]} castShadow>
          <meshStandardMaterial color={COLORS.body} roughness={0.3} />
        </Sphere>

        {/* ears */}
        <mesh position={[-0.6, -0.05, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.1, 0.1, 0.08, 20]} />
          <meshStandardMaterial color={COLORS.accent} metalness={0.4} roughness={0.25} />
        </mesh>
        <mesh position={[0.6, -0.05, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.1, 0.1, 0.08, 20]} />
          <meshStandardMaterial color={COLORS.accent} metalness={0.4} roughness={0.25} />
        </mesh>

        {/* face screen */}
        <RoundedBox args={[0.78, 0.5, 0.12]} radius={0.16} smoothness={6} position={[0, -0.02, 0.5]}>
          <meshStandardMaterial color={COLORS.face} roughness={0.5} />
        </RoundedBox>

        {/* eyes */}
        <mesh ref={leftEye} position={[-0.16, -0.02, 0.57]}>
          <capsuleGeometry args={[0.045, 0.05, 4, 8]} />
          <meshStandardMaterial
            color={eyeEmissive}
            emissive={eyeEmissive}
            emissiveIntensity={1.6}
          />
        </mesh>
        <mesh ref={rightEye} position={[0.16, -0.02, 0.57]}>
          <capsuleGeometry args={[0.045, 0.05, 4, 8]} />
          <meshStandardMaterial
            color={eyeEmissive}
            emissive={eyeEmissive}
            emissiveIntensity={1.6}
          />
        </mesh>
      </group>
    </group>
  );
}

export default function Riffy3D({
  mood = "idle",
  waveOnMount = true,
  size = 260,
  followCursor = true,
  className = "",
}) {
  const [waveActive, setWaveActive] = useState(waveOnMount);

  useEffect(() => {
    if (!waveOnMount) return;
    const t = setTimeout(() => setWaveActive(false), 1600);
    return () => clearTimeout(t);
  }, [waveOnMount]);

  return (
    <div
      className={className}
      style={{ width: size, height: size, touchAction: "none" }}
      aria-label="Riffy, the 1Reff AI mascot"
      role="img"
    >
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 0.15, 3.4], fov: 32 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[2, 3, 4]} intensity={1.1} castShadow />
        <pointLight position={[-2, -1, 2]} intensity={0.3} color={COLORS.accent} />
        <Riffy mood={mood} waveActive={waveActive} followCursor={followCursor} />
      </Canvas>
    </div>
  );
}
