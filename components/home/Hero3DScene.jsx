"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import * as THREE from "three";

/* ── Premium Holographic Soccer Ball with Cursor Tracking ── */
function SoccerBall() {
  const groupRef = useRef();
  const innerRef = useRef();
  const outerRef = useRef();

  useFrame((state) => {
    if (!groupRef.current) return;

    // Responsive scaling based on viewport width (Mobile auto-fit)
    const isMobile = state.viewport.width < 6.5;
    const baseScale = isMobile ? 1.35 : 2.1;
    groupRef.current.scale.lerp(new THREE.Vector3(baseScale, baseScale, baseScale), 0.08);

    // Smooth Cursor Parallax Tracking (Elastic Lerping)
    const targetX = state.pointer.y * 0.45;
    const targetY = state.pointer.x * 0.45;
    
    // Tilt group based on mouse position
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetX, 0.06);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetY, 0.06);

    // Continuous premium spin on the inner sphere
    if (innerRef.current) {
      innerRef.current.rotation.y += 0.004;
      innerRef.current.rotation.z += 0.001;
    }

    // Outer wireframe spins in the opposite direction for a complex cinematic feel
    if (outerRef.current) {
      outerRef.current.rotation.y -= 0.002;
      outerRef.current.rotation.x += 0.001;
      
      // Gentle breathing pulse effect
      const pulse = 1.0 + Math.sin(state.clock.elapsedTime * 2.5) * 0.015;
      outerRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={2.5} rotationIntensity={0.2} floatIntensity={0.6}>
        {/* 1. Core Sphere (Ultra-glossy space metallic core) */}
        <mesh ref={innerRef}>
          <sphereGeometry args={[1, 64, 64]} />
          <meshStandardMaterial
            color="#090d16"
            roughness={0.08}
            metalness={0.98}
            envMapIntensity={1.5}
          />
        </mesh>

        {/* 2. Holographic Geodesic Soccer Pattern Shell (Glowing seams) */}
        <mesh ref={outerRef} scale={1.015}>
          <icosahedronGeometry args={[1, 3]} /> {/* High poly geodesic pattern matches soccer seams */}
          <meshStandardMaterial
            color="#22c55e"
            emissive="#15803d"
            emissiveIntensity={1.2}
            roughness={0.1}
            metalness={0.9}
            wireframe
            transparent
            opacity={0.85}
          />
        </mesh>

        {/* 3. Glowing Emerald Gyro Ring A (Horizontal) */}
        <mesh scale={2.6} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1, 0.01, 16, 100]} />
          <meshBasicMaterial 
            color="#4ade80" 
            transparent 
            opacity={0.35} 
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* 4. Glowing Blue Gyro Ring B (Vertical) */}
        <mesh scale={2.6} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[1, 0.01, 16, 100]} />
          <meshBasicMaterial 
            color="#3b82f6" 
            transparent 
            opacity={0.25} 
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </Float>
    </group>
  );
}

/* ── GPU-Accelerated Particle Embers (120 FPS / Zero CPU Overhead) ── */
function GPUParticles({ count = 1000 }) {
  const pointsRef = useRef();

  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16;      // X
      pos[i * 3 + 1] = (Math.random() - 0.5) * 16;  // Y
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12;  // Z
      spd[i] = Math.random() * 0.15 + 0.05;
    }
    return [pos, spd];
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    
    // Smooth planetary rotation of the entire particle system
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    
    // Parallax sway relative to mouse
    const targetX = state.pointer.x * 0.15;
    const targetY = state.pointer.y * 0.15;
    pointsRef.current.position.x = THREE.MathUtils.lerp(pointsRef.current.position.x, targetX, 0.05);
    pointsRef.current.position.y = THREE.MathUtils.lerp(pointsRef.current.position.y, targetY, 0.05);
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#4ade80"
        size={0.065}
        sizeAttenuation
        transparent
        opacity={0.45}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ── Cinematic Volumetric Light Rays ── */
function LightRays() {
  const ref = useRef();
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.15) * 0.08;
      
      // Gentle pulsating light intensity
      const pulse = 0.03 + Math.sin(state.clock.elapsedTime * 1.5) * 0.01;
      ref.current.children.forEach((child) => {
        if (child.material) child.material.opacity = pulse;
      });
    }
  });

  return (
    <group ref={ref} position={[0, 4, -6]}>
      {[...Array(6)].map((_, i) => (
        <mesh
          key={i}
          position={[(i - 2.5) * 1.8, 0, 0]}
          rotation={[0, 0, (i - 2.5) * 0.12]}
        >
          <planeGeometry args={[0.1, 15]} />
          <meshBasicMaterial
            color="#22c55e"
            transparent
            opacity={0.03}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ── Glowing Tech Grid Ground ── */
function GroundPlane() {
  return (
    <group position={[0, -3.2, 0]}>
      {/* Glossy dark floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial
          color="#03070c"
          roughness={0.15}
          metalness={0.9}
          transparent
          opacity={0.9}
        />
      </mesh>
      {/* High-tech emerald grid overlay */}
      <gridHelper args={[50, 50, "#15803d", "#082f49"]} position={[0, 0.01, 0]} />
    </group>
  );
}

/* ── Main 3D Scene Export ── */
export default function Hero3DScene() {
  return (
    <div className="absolute inset-0 z-0" style={{ pointerEvents: "none" }}>
      <Canvas
        camera={{ position: [0, 0.4, 5.8], fov: 45 }}
        dpr={[1, 2]} // High precision display support
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
        }}
        style={{ background: "transparent" }}
      >
        <fog attach="fog" args={["#04060a", 6, 20]} />
        
        <ambientLight intensity={0.3} />
        <hemisphereLight args={["#ffffff", "#04060a", 0.4]} />

        {/* Cinematic Lighting System */}
        {/* Core Emerald spotlight */}
        <directionalLight
          position={[-6, 10, 6]}
          intensity={1.5}
          color="#22c55e"
        />

        {/* Ambient fill blue light */}
        <pointLight position={[6, 4, 4]} intensity={0.9} color="#2563eb" />

        {/* Under-ball uplight for massive sci-fi elevation feel */}
        <pointLight position={[0, -2.8, 1]} intensity={1.8} color="#10b981" />
        
        {/* Scene Objects */}
        <SoccerBall />
        <GPUParticles count={1200} />
        <LightRays />
        <GroundPlane />
        
        {/* Floating dust sparkles */}
        <Sparkles
          count={120}
          scale={8}
          size={2.5}
          speed={0.5}
          color="#3b82f6"
          opacity={0.35}
        />
      </Canvas>
    </div>
  );
}

