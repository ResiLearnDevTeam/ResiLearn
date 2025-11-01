'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

function ResistorParticle({ scene, index }: { scene: THREE.Group; index: number }) {
  const meshRef = useRef<THREE.Group>(null);

  const basePosition = [
    (Math.random() - 0.5) * 12,
    (Math.random() - 0.5) * 12,
    (Math.random() - 0.5) * 6,
  ];

  const randomSpeed = 0.3 + Math.random() * 0.4;
  const randomAmp = 0.4 + Math.random() * 0.6;
  const randomRotationSpeedY = 0.1 + Math.random() * 0.15;
  const randomRotationSpeedX = 0.05 + Math.random() * 0.05;
  const randomRotationSpeedZ = 0.03 + Math.random() * 0.04;

  useFrame((state, delta) => {
    if (meshRef.current) {
      const offset = index * 0.7;
      meshRef.current.rotation.y += delta * randomRotationSpeedY;
      meshRef.current.rotation.x += delta * randomRotationSpeedX;
      meshRef.current.rotation.z += delta * randomRotationSpeedZ;
      meshRef.current.position.y = basePosition[1] + Math.sin(state.clock.elapsedTime * randomSpeed + offset) * randomAmp;
      meshRef.current.position.x = basePosition[0] + Math.cos(state.clock.elapsedTime * (randomSpeed * 0.8) + offset) * randomAmp * 0.6;
      meshRef.current.position.z = basePosition[2] + Math.sin(state.clock.elapsedTime * (randomSpeed * 0.6) + offset) * randomAmp * 0.4;
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
      {Array.from({ length: 15 }).map((_, i) => (
        <ResistorParticle key={i} scene={scene} index={i} />
      ))}
    </>
  );
}

function GlowParticles() {
  const particlesRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.0003;
      particlesRef.current.rotation.x += 0.0002;
    }
  });

  const particles = Array.from({ length: 80 }, () => ({
    position: [
      (Math.random() - 0.5) * 35,
      (Math.random() - 0.5) * 35,
      (Math.random() - 0.5) * 35,
    ] as [number, number, number],
    size: Math.random() * 0.3 + 0.05,
  }));

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[new Float32Array(particles.flatMap((p) => p.position)), 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#f97316"
        size={0.08}
        transparent
        opacity={0.2}
        sizeAttenuation={true}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function Resistor3DModel() {
  return (
    <div className="absolute inset-0 z-0 h-[60vh]">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }} style={{ background: 'transparent' }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} color="#ffffff" />
        <directionalLight position={[-5, 3, 5]} intensity={0.3} color="#fffaf5" />
        <pointLight position={[4, 4, 4]} intensity={0.4} color="#ffffff" />
        <pointLight position={[-4, -4, 4]} intensity={0.2} color="#f97316" />
        <hemisphereLight intensity={0.25} color="#ffffff" groundColor="#fffaf5" />

        <FloatingResistors />
        <GlowParticles />

        <OrbitControls enabled={false} autoRotate autoRotateSpeed={0.15} minDistance={3} maxDistance={12} />
      </Canvas>
    </div>
  );
}

useGLTF.preload('/models/lowpoly_resistor.glb');
