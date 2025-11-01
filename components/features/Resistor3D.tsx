'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

function FloatingResistor() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.3;
    }
  });

  return (
    <group ref={meshRef} position={[0, 0, 0]}>
      {/* Main resistor body - cream/beige ceramic */}
      <Cylinder
        args={[0.15, 0.15, 1, 32]}
        position={[0, 0, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <meshStandardMaterial
          color="#f5f1e8"
          metalness={0.2}
          roughness={0.6}
        />
      </Cylinder>

      {/* Color bands - Brown */}
      <Cylinder
        args={[0.155, 0.155, 0.08, 32]}
        position={[-0.32, 0, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <meshStandardMaterial
          color="#8b4513"
          metalness={0.3}
          roughness={0.4}
        />
      </Cylinder>

      {/* Color bands - Black */}
      <Cylinder
        args={[0.155, 0.155, 0.08, 32]}
        position={[-0.22, 0, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <meshStandardMaterial
          color="#1a1a1a"
          metalness={0.3}
          roughness={0.4}
        />
      </Cylinder>

      {/* Color bands - Red */}
      <Cylinder
        args={[0.155, 0.155, 0.08, 32]}
        position={[-0.12, 0, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <meshStandardMaterial
          color="#dc2626"
          metalness={0.3}
          roughness={0.4}
        />
      </Cylinder>

      {/* Color bands - Gold (tolerance) */}
      <Cylinder
        args={[0.155, 0.155, 0.08, 32]}
        position={[0.25, 0, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <meshStandardMaterial
          color="#d4af37"
          metalness={0.7}
          roughness={0.3}
        />
      </Cylinder>

      {/* Wire leads - silver metallic */}
      <Cylinder
        args={[0.02, 0.02, 0.8, 16]}
        position={[-0.5, 0, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <meshStandardMaterial
          color="#c0c0c0"
          metalness={0.9}
          roughness={0.1}
        />
      </Cylinder>

      <Cylinder
        args={[0.02, 0.02, 0.8, 16]}
        position={[0.5, 0, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <meshStandardMaterial
          color="#c0c0c0"
          metalness={0.9}
          roughness={0.1}
        />
      </Cylinder>

      {/* Subtle glow effect */}
      <Sphere args={[0.2, 16, 16]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#f97316"
          transparent
          opacity={0.05}
          emissive="#f97316"
          emissiveIntensity={0.1}
        />
      </Sphere>
    </group>
  );
}

function FloatingParticles() {
  const particlesRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.001;
    }
  });

  const particles = Array.from({ length: 100 }, () => ({
    position: [
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20,
    ] as [number, number, number],
    size: Math.random() * 0.5 + 0.1,
  }));

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length}
          array={new Float32Array(particles.flatMap((p) => p.position))}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#f97316"
        size={0.15}
        transparent
        opacity={0.3}
        sizeAttenuation={true}
      />
    </points>
  );
}

export default function Resistor3D() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ background: 'transparent' }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1.2} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={0.3} color="#fff8f0" />
        <directionalLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
        <directionalLight position={[-5, 2, -5]} intensity={0.3} color="#f5f1e8" />

        {/* 3D Objects */}
        <FloatingResistor />
        <FloatingParticles />

        {/* Controls - disabled for background effect */}
        <OrbitControls
          enabled={false}
          autoRotate
          autoRotateSpeed={0.3}
          minDistance={3}
          maxDistance={8}
        />
      </Canvas>
    </div>
  );
}

