"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import * as THREE from "three";

/* ── Soccer Ball (Procedural Icosahedron with premium metallic shader) ── */
function SoccerBall() {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.003;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.8}>
      <mesh ref={meshRef} scale={2.2} position={[0, 0, 0]}>
        <icosahedronGeometry args={[1, 1]} />
        <MeshDistortMaterial
          color="#1a1a2e"
          roughness={0.15}
          metalness={0.95}
          distort={0.08}
          speed={1.5}
          envMapIntensity={2.5}
        />
      </mesh>
      {/* Wireframe overlay for pentagon pattern effect */}
      <mesh scale={2.25} position={[0, 0, 0]}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial
          color="#4ade80"
          wireframe
          transparent
          opacity={0.15}
        />
      </mesh>
      {/* Glow ring */}
      <mesh scale={2.6} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1, 0.01, 16, 64]} />
        <meshBasicMaterial color="#4ade80" transparent opacity={0.3} />
      </mesh>
    </Float>
  );
}

/* ── Particle Field (instanced emerald particles drifting upward) ── */
function ParticleField({ count = 1500 }) {
  const meshRef = useRef();
  
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const speeds = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15;
      scales[i] = Math.random() * 0.5 + 0.1;
      speeds[i] = Math.random() * 0.3 + 0.1;
    }
    
    return { positions, scales, speeds };
  }, [count]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;
    
    for (let i = 0; i < count; i++) {
      const matrix = new THREE.Matrix4();
      const x = particles.positions[i * 3] + Math.sin(time * 0.5 + i) * 0.3;
      let y = particles.positions[i * 3 + 1] + (time * particles.speeds[i]) % 20 - 10;
      const z = particles.positions[i * 3 + 2];
      
      if (y > 10) y -= 20;
      
      matrix.setPosition(x, y, z);
      matrix.scale(new THREE.Vector3(
        particles.scales[i],
        particles.scales[i],
        particles.scales[i]
      ));
      
      meshRef.current.setMatrixAt(i, matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.015, 6, 6]} />
      <meshBasicMaterial color="#4ade80" transparent opacity={0.6} />
    </instancedMesh>
  );
}

/* ── Volumetric Light Rays ── */
function LightRays() {
  const ref = useRef();
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <group ref={ref} position={[0, 3, -5]}>
      {[...Array(5)].map((_, i) => (
        <mesh
          key={i}
          position={[(i - 2) * 1.5, 0, 0]}
          rotation={[0, 0, (i - 2) * 0.15]}
        >
          <planeGeometry args={[0.08, 12]} />
          <meshBasicMaterial
            color="#4ade80"
            transparent
            opacity={0.04}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ── Ground Plane (subtle reflection) ── */
function GroundPlane() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]}>
      <planeGeometry args={[40, 40]} />
      <meshStandardMaterial
        color="#050a0e"
        roughness={0.8}
        metalness={0.2}
        transparent
        opacity={0.5}
      />
    </mesh>
  );
}

/* ── Main 3D Scene Export ── */
export default function Hero3DScene() {
  return (
    <div className="absolute inset-0 z-0" style={{ pointerEvents: "none" }}>
      <Canvas
        camera={{ position: [0, 0.5, 6], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{ background: "transparent" }}
      >
        <fog attach="fog" args={["#04060a", 5, 25]} />
        
        {/* Ambient */}
        <ambientLight intensity={0.15} />
        
        {/* Key light — top-left green accent */}
        <directionalLight
          position={[-5, 8, 5]}
          intensity={0.8}
          color="#4ade80"
        />
        
        {/* Fill light — cool blue from right */}
        <pointLight position={[5, 3, 3]} intensity={0.4} color="#3b82f6" />
        
        {/* Rim light — white backlight */}
        <pointLight position={[0, -2, -5]} intensity={0.3} color="#ffffff" />
        
        {/* Environment for reflections */}
        <Environment preset="city" environmentIntensity={0.3} />
        
        {/* Scene objects */}
        <SoccerBall />
        <ParticleField count={1500} />
        <LightRays />
        <GroundPlane />
        
        {/* Sparkles for magic dust effect */}
        <Sparkles
          count={100}
          scale={10}
          size={2}
          speed={0.4}
          color="#4ade80"
          opacity={0.3}
        />
      </Canvas>
    </div>
  );
}
