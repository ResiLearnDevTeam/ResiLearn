'use client';

import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Box, Sphere, Octahedron } from '@react-three/drei';
import * as THREE from 'three';

let introSeen = false;

function ResistorParticle({ scene, index }: { scene: THREE.Group; index: number }) {
  const meshRef = useRef<THREE.Group>(null);

  const params = useMemo(() => ({
    basePosition: [
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 8,
      (Math.random() - 0.5) * 5,
    ] as [number, number, number],
    randomSpeed: 0.18 + Math.random() * 0.22,
    randomAmp: 0.35 + Math.random() * 0.35,
    randomRotationSpeedY: 0.04 + Math.random() * 0.05,
    randomRotationSpeedX: 0.015 + Math.random() * 0.02,
    randomRotationSpeedZ: 0.01 + Math.random() * 0.015,
  }), [index]);

  useEffect(() => {
    if (meshRef.current) {
      const { basePosition } = params;
      meshRef.current.position.set(basePosition[0], basePosition[1], basePosition[2]);
      meshRef.current.scale.setScalar(0.12);
    }
  }, [params]);

  useFrame((state, delta) => {
    if (meshRef.current) {
      const {
        basePosition,
        randomSpeed,
        randomAmp,
        randomRotationSpeedY,
        randomRotationSpeedX,
        randomRotationSpeedZ,
      } = params;
      const offset = index * 0.7;
      const time = state.clock.elapsedTime;

      const targetY = basePosition[1] + Math.sin(time * randomSpeed + offset) * randomAmp;
      const targetX = basePosition[0] + Math.cos(time * (randomSpeed * 0.8) + offset) * randomAmp * 0.55;
      const targetZ = basePosition[2] + Math.sin(time * (randomSpeed * 0.6) + offset) * randomAmp * 0.35;

      meshRef.current.position.x += (targetX - meshRef.current.position.x) * 0.08;
      meshRef.current.position.y += (targetY - meshRef.current.position.y) * 0.08;
      meshRef.current.position.z += (targetZ - meshRef.current.position.z) * 0.08;

      meshRef.current.rotation.y += delta * randomRotationSpeedY;
      meshRef.current.rotation.x += delta * randomRotationSpeedX;
      meshRef.current.rotation.z += delta * randomRotationSpeedZ;

      const targetScale = 0.12 + Math.sin(time * 0.4 + offset) * 0.006;
      const currentScale = meshRef.current.scale.x || 0.12;
      const dampedScale = THREE.MathUtils.lerp(currentScale, targetScale, 0.05);
      meshRef.current.scale.setScalar(dampedScale);
    }
  });

  return (
    <primitive 
      ref={meshRef} 
      object={scene.clone()} 
      scale={[0.12, 0.12, 0.12]}
    />
  );
}

function FloatingResistors() {
  const { scene } = useGLTF('/models/lowpoly_resistor.glb');
  
  return (
    <>
      {Array.from({ length: 12 }).map((_, i) => (
        <ResistorParticle key={i} scene={scene} index={i} />
      ))}
    </>
  );
}

function SimpleGeometryParticles() {
  return (
    <>
      {Array.from({ length: 20 }).map((_, i) => {
        const type = i % 3;
        if (type === 0) return <SimpleCircle key={i} index={i} />;
        if (type === 1) return <SimpleTriangle key={i} index={i} />;
        return <SimpleSquare key={i} index={i} />;
      })}
    </>
  );
}

function SimpleCircle({ index }: { index: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  const params = useMemo(() => ({
    basePosition: [
      (Math.random() - 0.5) * 14,
      (Math.random() - 0.5) * 12,
      (Math.random() - 0.5) * 7,
    ] as [number, number, number],
    speed: 0.18 + Math.random() * 0.12,
    amplitude: 0.45,
  }), []);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime;
      const offset = index * 0.4;
      const targetY = params.basePosition[1] + Math.sin(time * params.speed + offset) * params.amplitude;
      meshRef.current.position.y += (targetY - meshRef.current.position.y) * 0.06;
    }
  });

  return (
    <Sphere ref={meshRef} args={[0.25, 16, 16]} position={params.basePosition}>
      <meshStandardMaterial
        color="#f97316"
        emissive="#ea580c"
        emissiveIntensity={0.2}
        transparent
        opacity={0.15}
      />
    </Sphere>
  );
}

function SimpleTriangle({ index }: { index: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  const params = useMemo(() => ({
    basePosition: [
      (Math.random() - 0.5) * 14,
      (Math.random() - 0.5) * 12,
      (Math.random() - 0.5) * 7,
    ] as [number, number, number],
    speed: 0.22 + Math.random() * 0.12,
    amplitude: 0.45,
  }), []);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime;
      const offset = index * 0.45;
      const targetY = params.basePosition[1] + Math.sin(time * params.speed + offset) * params.amplitude;
      meshRef.current.position.y += (targetY - meshRef.current.position.y) * 0.06;
      meshRef.current.rotation.y += 0.0035;
    }
  });

  return (
    <Octahedron ref={meshRef} args={[0.3]} position={params.basePosition}>
      <meshStandardMaterial
        color="#ea580c"
        emissive="#f97316"
        emissiveIntensity={0.2}
        transparent
        opacity={0.15}
      />
    </Octahedron>
  );
}

function SimpleSquare({ index }: { index: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  const params = useMemo(() => ({
    basePosition: [
      (Math.random() - 0.5) * 14,
      (Math.random() - 0.5) * 12,
      (Math.random() - 0.5) * 7,
    ] as [number, number, number],
    speed: 0.24 + Math.random() * 0.12,
    amplitude: 0.45,
  }), []);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime;
      const offset = index * 0.5;
      const targetY = params.basePosition[1] + Math.sin(time * params.speed + offset) * params.amplitude;
      meshRef.current.position.y += (targetY - meshRef.current.position.y) * 0.06;
      meshRef.current.rotation.y += 0.0045;
      meshRef.current.rotation.x += 0.002;
    }
  });

  return (
    <Box ref={meshRef} args={[0.35, 0.35, 0.35]} position={params.basePosition}>
      <meshStandardMaterial
        color="#ff8c42"
        emissive="#f97316"
        emissiveIntensity={0.2}
        transparent
        opacity={0.15}
      />
    </Box>
  );
}

type SceneContentsProps = {
  runIntro: boolean;
};

function SceneContents({ runIntro }: SceneContentsProps) {
  const groupRef = useRef<THREE.Group>(null);
  const introRef = useRef(runIntro ? 0 : 1);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;
    introRef.current = Math.min(introRef.current + delta / 2.2, 1);
    const ease = introRef.current < 1 ? 1 - Math.pow(1 - introRef.current, 3) : 1;

    const baseTilt = Math.sin(time * 0.25) * 0.1;
    const baseHeight = Math.sin(time * 0.3) * 0.35;
    const baseRotate = time * 0.08;

    const introTilt = THREE.MathUtils.lerp(-0.35, baseTilt, ease);
    const introHeight = THREE.MathUtils.lerp(1.2, baseHeight, ease);
    const introRotate = THREE.MathUtils.lerp(-0.6, baseRotate, ease);

    groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, introTilt, 4, delta);
    groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, introRotate, 4, delta);
    groupRef.current.position.y = THREE.MathUtils.damp(groupRef.current.position.y, introHeight, 3, delta);
    const currentScale = groupRef.current.scale.x || 1;
    const targetScale = THREE.MathUtils.lerp(0.85, 1.02, ease);
    groupRef.current.scale.setScalar(THREE.MathUtils.damp(currentScale, targetScale, 6, delta));
  });

  return (
    <group ref={groupRef}>
      <FloatingResistors />
      <SimpleGeometryParticles />
    </group>
  );
}

function Resistor3DModel() {
  const [shouldRunIntro] = useState(() => !introSeen);

  useEffect(() => {
    if (!introSeen) {
      introSeen = true;
    }
  }, []);

  return (
    <div className="absolute inset-0 z-0 h-[60vh]">
      <Canvas
        camera={{ position: [0, 0, 5.8], fov: 70 }}
        dpr={[1, 1.8]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} color="#ffffff" />
        <directionalLight position={[-5, 3, 5]} intensity={0.3} color="#fffaf5" />
        <pointLight position={[4, 4, 4]} intensity={0.4} color="#ffffff" />
        <pointLight position={[-4, -4, 4]} intensity={0.2} color="#f97316" />
        <hemisphereLight intensity={0.25} color="#ffffff" groundColor="#fffaf5" />

        <SceneContents runIntro={shouldRunIntro} />

        <OrbitControls enabled={false} autoRotate autoRotateSpeed={0.08} enableDamping dampingFactor={0.04} />
      </Canvas>
    </div>
  );
}

export default memo(Resistor3DModel);

useGLTF.preload('/models/lowpoly_resistor.glb');
