'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { Group, Mesh } from 'three';
import {
  getExperienceProfile,
  type ExperienceProfile,
} from '@/lib/apwa/runtime';
import { SOUTH_AFRICA_PROVINCES } from '@/lib/organism/southAfrica';

function detectProfile(): ExperienceProfile {
  if (typeof window === 'undefined') {
    return {
      tier: 'static',
      runThreeJs: false,
      runPhysics: false,
      maxDpr: 1,
      targetFps: 0,
      reason: ['server-render'],
    };
  }

  const navigatorWithHints = navigator as Navigator & {
    connection?: { saveData?: boolean; effectiveType?: string };
    deviceMemory?: number;
  };
  const canvas = document.createElement('canvas');
  const webgl = Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));

  return getExperienceProfile({
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    saveData: Boolean(navigatorWithHints.connection?.saveData),
    effectiveType: navigatorWithHints.connection?.effectiveType,
    deviceMemoryGb: navigatorWithHints.deviceMemory,
    hardwareConcurrency: navigator.hardwareConcurrency,
    webgl,
    visible: document.visibilityState === 'visible',
  });
}

function ProvinceNode({
  index,
  activeIndex,
}: {
  index: number;
  activeIndex: number;
}) {
  const mesh = useRef<Mesh>(null);
  const angle = (index / SOUTH_AFRICA_PROVINCES.length) * Math.PI * 2;
  const radius = 2.35;
  const isActive = index === activeIndex;

  useFrame((state) => {
    if (!mesh.current || !isActive) return;
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 2.2) * 0.12;
    mesh.current.scale.setScalar(pulse);
  });

  return (
    <mesh
      ref={mesh}
      position={[Math.cos(angle) * radius, Math.sin(angle * 1.7) * 0.22, Math.sin(angle) * radius]}
    >
      <sphereGeometry args={[isActive ? 0.22 : 0.13, 18, 18]} />
      <meshStandardMaterial
        color={isActive ? '#f5c542' : '#39d98a'}
        emissive={isActive ? '#7a5a00' : '#0b4d31'}
        emissiveIntensity={isActive ? 1.15 : 0.35}
        roughness={0.48}
      />
    </mesh>
  );
}

function LivingCore({
  activeIndex,
  weatherCode,
  temperature,
}: {
  activeIndex: number;
  weatherCode: number | null;
  temperature: number | null;
}) {
  const group = useRef<Group>(null);
  const core = useRef<Mesh>(null);
  const weatherEnergy = weatherCode != null && weatherCode >= 51 ? 0.45 : 1;
  const heat = temperature == null ? 0.5 : Math.min(1, Math.max(0, (temperature - 8) / 28));

  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * (0.08 + weatherEnergy * 0.08);
    }
    if (core.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * (1.2 + heat)) * 0.05;
      core.current.scale.setScalar(pulse);
    }
  });

  return (
    <group ref={group}>
      <ambientLight intensity={0.85} />
      <directionalLight position={[3, 5, 2]} intensity={2.1} />
      <pointLight position={[0, 1, 0]} intensity={1.3 + heat} color="#f5c542" />

      <mesh ref={core}>
        <icosahedronGeometry args={[0.78, 2]} />
        <meshStandardMaterial
          color="#103d2b"
          emissive="#0b2b20"
          emissiveIntensity={0.8}
          metalness={0.18}
          roughness={0.38}
          wireframe
        />
      </mesh>

      {SOUTH_AFRICA_PROVINCES.map((province, index) => (
        <ProvinceNode
          key={province.slug}
          index={index}
          activeIndex={activeIndex}
        />
      ))}
    </group>
  );
}

export default function LocalityScene({
  provinceSlug,
  weatherCode,
  temperature,
}: {
  provinceSlug: string;
  weatherCode: number | null;
  temperature: number | null;
}) {
  const [profile, setProfile] = useState<ExperienceProfile>({
    tier: 'static',
    runThreeJs: false,
    runPhysics: false,
    maxDpr: 1,
    targetFps: 0,
    reason: ['hydrating'],
  });

  useEffect(() => {
    const update = () => setProfile(detectProfile());
    update();
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);

  const activeIndex = useMemo(() => {
    const index = SOUTH_AFRICA_PROVINCES.findIndex(
      (province) => province.slug === provinceSlug,
    );
    return index >= 0 ? index : 0;
  }, [provinceSlug]);

  if (!profile.runThreeJs) {
    return (
      <div
        className="grid min-h-56 place-items-center rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_center,rgba(57,217,138,0.18),rgba(4,6,10,0.96)_68%)] p-6 text-center"
        data-experience-tier={profile.tier}
      >
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-green-300">
            Adaptive organism · static lane
          </p>
          <p className="mt-3 text-sm leading-6 text-gray-300">
            Province context stays live while the 3D layer is disabled for this device or motion preference.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-64 overflow-hidden rounded-[2rem] border border-white/10 bg-[#050908]"
      data-experience-tier={profile.tier}
    >
      <Canvas
        dpr={[1, profile.maxDpr]}
        camera={{ position: [0, 4.4, 5.2], fov: 48 }}
      >
        <LivingCore
          activeIndex={activeIndex}
          weatherCode={weatherCode}
          temperature={temperature}
        />
      </Canvas>
    </div>
  );
}
