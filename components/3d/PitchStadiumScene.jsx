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

/* ── Interactive 3D Stadium Environment with Mobile Progressive Disclosure ── */
export default function PitchStadiumScene({ onSelectPitch }) {
  const [hoveredPitch, setHoveredPitch] = useState(null);
  const [is3DActiveOnMobile, setIs3DActiveOnMobile] = useState(false);

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
    <div className="relative overflow-hidden rounded-3xl border border-gray-800 bg-gray-950 p-6 shadow-2xl sm:p-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-800 pb-6">
        <div>
          <span className="rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-green-400">
            Venue Map
          </span>
          <h3 className="mt-2 text-2xl font-black uppercase tracking-tight text-white sm:text-3xl">
            Hellenic FC Arena Courts
          </h3>
          <p className="text-xs text-gray-400">4 Floodlit synthetic turf pitches in Milnerton, Cape Town</p>
        </div>

        {/* Mobile 3D Toggle */}
        <button
          onClick={() => setIs3DActiveOnMobile((prev) => !prev)}
          className="rounded-xl border border-gray-700 bg-gray-900 px-4 py-2 text-xs font-black uppercase tracking-wider text-green-400 transition hover:border-green-500 sm:hidden"
        >
          {is3DActiveOnMobile ? "View 2D Grid" : "🎮 Launch 3D Stadium"}
        </button>
      </div>

      {/* 2D Mobile Fallback Grid (Fast, lightweight, 0 CPU overhead) */}
      <div className={`mt-6 grid gap-3 sm:hidden ${is3DActiveOnMobile ? "hidden" : "grid-cols-1"}`}>
        {PITCH_DATA.map((pitch) => (
          <div
            key={pitch.id}
            onClick={() => handleSelect(pitch)}
            className="flex items-center justify-between rounded-2xl border border-gray-800 bg-gray-900/60 p-4 transition active:scale-98 hover:border-green-500/50"
          >
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-yellow-400">{pitch.type}</span>
              <h4 className="text-base font-black text-white">{pitch.name}</h4>
            </div>
            <button className="rounded-lg bg-green-600 px-3 py-1.5 text-[11px] font-black uppercase tracking-wider text-white">
              Enquire ➔
            </button>
          </div>
        ))}
      </div>

      {/* Full 3D Stadium WebGL Canvas (Desktop by default, opt-in on mobile) */}
      <div className={`relative mt-6 h-[480px] w-full overflow-hidden rounded-2xl border border-gray-800/80 bg-black/40 ${is3DActiveOnMobile ? "block" : "hidden sm:block"}`}>
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

          {/* Stadium Ground Plane */}
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
    </div>
  );
}
