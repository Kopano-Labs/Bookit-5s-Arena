'use client';

import { useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';

const CONCEPT_PITCHES = [
  { id: 'concept-a', name: 'Concept Pitch A', position: [-3.7, 0, -2.5], tone: '#16a34a' },
  { id: 'concept-b', name: 'Concept Pitch B', position: [3.7, 0, -2.5], tone: '#15803d' },
  { id: 'concept-c', name: 'Concept Pitch C', position: [-3.7, 0, 3.0], tone: '#059669' },
  { id: 'concept-d', name: 'Concept Pitch D', position: [3.7, 0, 3.0], tone: '#0d9488' },
];

function ConceptPitch({ pitch, selected, onSelect }) {
  return (
    <group position={pitch.position}>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={(event) => {
          event.stopPropagation();
          onSelect(pitch.id);
        }}
      >
        <planeGeometry args={[6.1, 4.2]} />
        <meshStandardMaterial
          color={selected ? '#22c55e' : pitch.tone}
          roughness={0.68}
          metalness={0.08}
        />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, 0]}>
        <ringGeometry args={[0.72, 0.77, 40]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.7} />
      </mesh>

      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.035, 4.1]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.65} />
      </mesh>

      <mesh position={[-3.0, 0.34, 0]}>
        <boxGeometry args={[0.06, 0.7, 1.35]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[3.0, 0.34, 0]}>
        <boxGeometry args={[0.06, 0.7, 1.35]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      <Html center position={[0, 0.45, 0]} distanceFactor={12}>
        <button
          type="button"
          onClick={() => onSelect(pitch.id)}
          className={`whitespace-nowrap rounded-full border px-3 py-1 text-[9px] font-black uppercase tracking-[0.16em] backdrop-blur-md ${
            selected
              ? 'border-yellow-300/60 bg-yellow-300/15 text-yellow-100'
              : 'border-white/20 bg-black/65 text-white'
          }`}
        >
          {pitch.name}
        </button>
      </Html>
    </group>
  );
}

function ArenaConcept({ selectedId, onSelect }) {
  return (
    <>
      <ambientLight intensity={0.85} />
      <directionalLight position={[4, 10, 6]} intensity={1.25} color="#d1fae5" />
      <pointLight position={[-8, 5, -4]} intensity={1.1} color="#22c55e" />
      <pointLight position={[8, 5, 4]} intensity={0.7} color="#facc15" />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.08, 0]}>
        <planeGeometry args={[18, 15]} />
        <meshStandardMaterial color="#06110d" roughness={0.9} />
      </mesh>

      {CONCEPT_PITCHES.map((pitch) => (
        <ConceptPitch
          key={pitch.id}
          pitch={pitch}
          selected={selectedId === pitch.id}
          onSelect={onSelect}
        />
      ))}

      <OrbitControls
        enablePan={false}
        minDistance={9}
        maxDistance={18}
        minPolarAngle={0.45}
        maxPolarAngle={1.2}
        target={[0, 0, 0]}
      />
    </>
  );
}

export default function PitchStadiumScene() {
  const [selectedId, setSelectedId] = useState(CONCEPT_PITCHES[0].id);
  const selected = useMemo(
    () => CONCEPT_PITCHES.find((pitch) => pitch.id === selectedId) || CONCEPT_PITCHES[0],
    [selectedId]
  );

  return (
    <div className="overflow-hidden rounded-[2rem] border border-emerald-500/20 bg-[#030806] shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
      <div className="flex flex-col gap-4 border-b border-white/10 p-5 sm:flex-row sm:items-end sm:justify-between sm:p-7">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-amber-400/25 bg-amber-400/10 px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-amber-200">
              Concept visualization
            </span>
            <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-gray-600">
              Not a live venue map
            </span>
          </div>
          <h2 className="mt-3 text-2xl font-black uppercase tracking-tight text-white sm:text-4xl">
            Explore the arena in 3D
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-400">
            Rotate and inspect a conceptual 5-a-side layout. Pitch count, names, physical positions,
            availability and rates must come from the verified booking/venue source—not this model.
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
          <p className="text-[9px] font-black uppercase tracking-[0.18em] text-gray-500">Selected model</p>
          <p className="mt-1 text-sm font-black uppercase text-emerald-300">{selected.name}</p>
        </div>
      </div>

      <div className="h-[360px] w-full sm:h-[460px]" aria-label="Interactive conceptual arena model">
        <Canvas camera={{ position: [10, 11, 13], fov: 46 }} dpr={[1, 1.6]}>
          <ArenaConcept selectedId={selectedId} onSelect={setSelectedId} />
        </Canvas>
      </div>
    </div>
  );
}
