'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Box, Sphere, Octahedron } from '@react-three/drei';
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
  
  const basePosition = [
    (Math.random() - 0.5) * 15,
    (Math.random() - 0.5) * 15,
    (Math.random() - 0.5) * 8,
  ];
  
  const speed = 0.2 + Math.random() * 0.15;
  const amplitude = 0.5;

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime;
      meshRef.current.position.y = basePosition[1] + Math.sin(time * speed + index * 0.5) * amplitude;
      meshRef.current.position.x = basePosition[0];
      meshRef.current.position.z = basePosition[2];
    }
  });

  return (
    <Sphere ref={meshRef} args={[0.25, 16, 16]} position={[basePosition[0], basePosition[1], basePosition[2]]}>
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
  
  const basePosition = [
    (Math.random() - 0.5) * 15,
    (Math.random() - 0.5) * 15,
    (Math.random() - 0.5) * 8,
  ];
  
  const speed = 0.25 + Math.random() * 0.15;
  const amplitude = 0.5;

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime;
      meshRef.current.position.y = basePosition[1] + Math.sin(time * speed + index * 0.5) * amplitude;
      meshRef.current.position.x = basePosition[0];
      meshRef.current.position.z = basePosition[2];
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <Octahedron ref={meshRef} args={[0.3]} position={[basePosition[0], basePosition[1], basePosition[2]]}>
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
  
  const basePosition = [
    (Math.random() - 0.5) * 15,
    (Math.random() - 0.5) * 15,
    (Math.random() - 0.5) * 8,
  ];
  
  const speed = 0.3 + Math.random() * 0.15;
  const amplitude = 0.5;

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime;
      meshRef.current.position.y = basePosition[1] + Math.sin(time * speed + index * 0.5) * amplitude;
      meshRef.current.position.x = basePosition[0];
      meshRef.current.position.z = basePosition[2];
      meshRef.current.rotation.y += 0.008;
      meshRef.current.rotation.x += 0.003;
    }
  });

  return (
    <Box ref={meshRef} args={[0.35, 0.35, 0.35]} position={[basePosition[0], basePosition[1], basePosition[2]]}>
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
        <SimpleGeometryParticles />

        <OrbitControls enabled={false} autoRotate autoRotateSpeed={0.15} minDistance={3} maxDistance={12} />
      </Canvas>
    </div>
  );
}

useGLTF.preload('/models/lowpoly_resistor.glb');
