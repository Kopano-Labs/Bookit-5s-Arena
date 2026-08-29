"use client";

import { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Text, Html } from "@react-three/drei";
import * as THREE from "three";

// Hellenic Football Club 4 Turf Pitches Configuration
const PITCH_DATA = [
  { id: "court-1", name: "Pitch 1 (A-Field)", type: "Outdoor 5G Turf", position: [-3.8, 0, -2.5], color: "#16a34a" },
  { id: "court-2", name: "Pitch 2 (B-Field)", type: "Outdoor 5G Turf", position: [3.8, 0, -2.5], color: "#15803d" },
  { id: "court-3", name: "Pitch 3 (Cage Pro)", type: "Enclosed Pro Turf", position: [-3.8, 0, 3.2], color: "#059669" },
  { id: "court-4", name: "Pitch 4 (Main Arena)", type: "Floodlit Championship", position: [3.8, 0, 3.2], color: "#0d9488" },
];

/* ── Individual 3D 5-a-side Pitch with Markings & Floodlight Glow ── */
function SinglePitch({ pitch, isHovered, onHover, onSelect }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (!meshRef.current) return;
    const targetScale = isHovered ? 1.04 : 1.0;
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
  });

  return (
    <group position={pitch.position}>
      {/* Turf Surface */}
      <mesh
        ref={meshRef}
        rotation={[-Math.PI / 2, 0, 0]}
        onPointerOver={(e) => { e.stopPropagation(); onHover(pitch.id); }}
        onPointerOut={() => onHover(null)}
        onClick={() => onSelect(pitch)}
      >
        <planeGeometry args={[6.2, 4.4]} />
        <meshStandardMaterial
          color={isHovered ? "#22c55e" : pitch.color}
          roughness={0.65}
          metalness={0.1}
        />
      </mesh>

      {/* White Pitch Boundary & Penalty Lines */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[0.78, 0.82, 32]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
      </mesh>

      {/* Goal Posts A & B */}
      <mesh position={[-2.95, 0.4, 0]}>
        <boxGeometry args={[0.08, 0.8, 1.4]} />
        <meshStandardMaterial color="#ffffff" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[2.95, 0.4, 0]}>
        <boxGeometry args={[0.08, 0.8, 1.4]} />
        <meshStandardMaterial color="#ffffff" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Floodlight Poles with Spotlight */}
      <mesh position={[-3.1, 1.6, -2.2]}>
        <cylinderGeometry args={[0.04, 0.04, 3.2]} />
        <meshStandardMaterial color="#334155" metalness={0.9} />
      </mesh>
      <mesh position={[3.1, 1.6, -2.2]}>
        <cylinderGeometry args={[0.04, 0.04, 3.2]} />
        <meshStandardMaterial color="#334155" metalness={0.9} />
      </mesh>

      {/* Interactive 3D HUD Tag */}
      <Html position={[0, 1.2, 0]} center distanceFactor={14}>
        <div
          onClick={() => onSelect(pitch)}
          className={`cursor-pointer rounded-lg px-3 py-1.5 text-center text-xs font-black uppercase tracking-wider backdrop-blur-md transition-all ${
            isHovered
              ? "scale-110 border border-green-400 bg-green-950/90 text-green-300 shadow-lg shadow-green-500/20"
              : "border border-gray-800 bg-gray-950/70 text-gray-300 hover:border-gray-600"
          }`}
        >
          <div className="text-[10px] text-yellow-500">{pitch.type}</div>
          <div>{pitch.name}</div>
          {isHovered && <div className="mt-1 text-[9px] text-green-400">Click to Inquire ➔</div>}
        </div>
      </Html>
    </group>
  );
}

/* ── Interactive 3D Stadium Environment ── */
export default function PitchStadiumScene({ onSelectPitch }) {
  const [hoveredPitch, setHoveredPitch] = useState(null);

  const handleSelect = (pitch) => {
    if (onSelectPitch) {
      onSelectPitch(pitch);
    } else {
      // Default fallback: direct WhatsApp inquiry
      const msg = encodeURIComponent(`Hi FivesArena! I'd like to check availability for ${pitch.name} (${pitch.type}) at Hellenic FC.`);
      window.open(`https://wa.me/27637820245?text=${msg}`, "_blank");
    }
  };

  return (
    <div className="relative h-[550px] w-full overflow-hidden rounded-3xl border border-gray-800 bg-gray-950 shadow-2xl">
      {/* Top Controls Overlay */}
      <div className="absolute left-6 top-6 z-10">
        <span className="rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-green-400">
          3D Interactive Pitch Map
        </span>
        <h3 className="mt-2 text-xl font-black uppercase tracking-tight text-white sm:text-2xl">
          Hellenic FC Arena Layout
        </h3>
        <p className="text-xs text-gray-400">Click any court to check live verified availability</p>
      </div>

      <Canvas
        camera={{ position: [0, 9.5, 11], fov: 42 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
        }}
      >
        <fog attach="fog" args={["#030712", 12, 28]} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[0, 15, 10]} intensity={1.8} color="#ffffff" />
        <pointLight position={[-4, 8, -4]} intensity={2.0} color="#22c55e" />
        <pointLight position={[4, 8, -4]} intensity={2.0} color="#3b82f6" />

        {/* Stadium Surrounding Ground */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
          <planeGeometry args={[40, 40]} />
          <meshStandardMaterial color="#0b0f17" roughness={0.9} metalness={0.2} />
        </mesh>
        <gridHelper args={[40, 40, "#1f2937", "#111827"]} position={[0, 0.001, 0]} />

        {/* The 4 Turf Pitches */}
        {PITCH_DATA.map((pitch) => (
          <SinglePitch
            key={pitch.id}
            pitch={pitch}
            isHovered={hoveredPitch === pitch.id}
            onHover={setHoveredPitch}
            onSelect={handleSelect}
          />
        ))}
      </Canvas>
    </div>
  );
}
