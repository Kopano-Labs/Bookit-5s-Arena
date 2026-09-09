"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  disposeKPGSTHREEScene,
  emitKPGSTHREETelemetry,
  isKPGSTHREEExperimentEnabled,
  prefersReducedMotion,
  resolveKPGSTHREEPolicy,
  shouldRenderKPGSTHREECanvas,
  type KPGSTHREETelemetryHook,
} from "@/lib/experiments/KPGSTHREE";

/**
 * Abstract five-a-side grid → multi-venue network topology.
 * No venue marks, no booking CTAs, no proprietary Kage assets.
 */

const GRID_NODES = [
  [-1.6, 0, -1.0],
  [1.6, 0, -1.0],
  [-1.6, 0, 1.0],
  [1.6, 0, 1.0],
  [0, 0, 0],
] as const;

const NETWORK_NODES = [
  [-2.4, 0.4, -1.6],
  [2.2, 0.2, -1.2],
  [-2.0, 0.6, 1.4],
  [2.4, 0.3, 1.6],
  [0.0, 0.8, 0.0],
  [-0.8, 0.5, -2.2],
  [1.0, 0.55, 2.1],
] as const;

function seededNoise(seed: number, i: number): number {
  const x = Math.sin(seed * 0.0001 + i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function VenueToNetworkScene({
  seed,
  paused,
  progress,
}: {
  seed: number;
  paused: boolean;
  progress: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const pitchRef = useRef<THREE.Mesh>(null);
  const nodeRefs = useRef<THREE.Mesh[]>([]);

  const networkPositions = useMemo(
    () =>
      NETWORK_NODES.map((pos, i) => {
        const jitter = (seededNoise(seed, i) - 0.5) * 0.15;
        return new THREE.Vector3(pos[0] + jitter, pos[1], pos[2] - jitter);
      }),
    [seed],
  );

  useFrame((state, delta) => {
    if (paused || !groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.08;
    if (pitchRef.current) {
      const scale = THREE.MathUtils.lerp(1, 0.15, progress);
      pitchRef.current.scale.setScalar(scale);
      const mat = pitchRef.current.material as THREE.MeshStandardMaterial;
      mat.opacity = THREE.MathUtils.lerp(0.92, 0.08, progress);
    }
    nodeRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const start = new THREE.Vector3(
        GRID_NODES[i % GRID_NODES.length][0],
        0.12,
        GRID_NODES[i % GRID_NODES.length][2],
      );
      const target = networkPositions[i];
      mesh.position.lerpVectors(start, target, progress);
      mesh.scale.setScalar(THREE.MathUtils.lerp(0.35, 0.85, progress));
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.4 + i) * 0.04 * progress;
      mesh.scale.multiplyScalar(pulse);
    });
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 8, 2]} intensity={1.1} color="#c8facc" />
      <pointLight position={[-3, 2, 2]} intensity={0.45} color="#f5c542" />

      {/* Abstract pitch plane — deconstructs as network emerges */}
      <mesh ref={pitchRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[4.2, 2.8]} />
        <meshStandardMaterial
          color="#15803d"
          transparent
          opacity={0.9}
          roughness={0.7}
          metalness={0.05}
        />
      </mesh>

      {/* Pitch boundary lines */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[0.55, 0.6, 48]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.55} />
      </mesh>

      {/* Network nodes */}
      {networkPositions.map((_, i) => (
        <mesh
          key={`node-${i}`}
          ref={(el) => {
            if (el) nodeRefs.current[i] = el;
          }}
          position={[
            GRID_NODES[i % GRID_NODES.length][0],
            0.12,
            GRID_NODES[i % GRID_NODES.length][2],
          ]}
        >
          <sphereGeometry args={[0.18, 20, 20]} />
          <meshStandardMaterial
            color={i === 4 ? "#f5c542" : "#34d399"}
            emissive={i === 4 ? "#a16207" : "#065f46"}
            emissiveIntensity={0.35}
            roughness={0.35}
            metalness={0.4}
          />
        </mesh>
      ))}

      {/* Soft connecting edges */}
      {networkPositions.slice(0, 5).map((from, i) => {
        const to = networkPositions[(i + 1) % 5];
        const mid = from.clone().lerp(to, 0.5);
        const dir = to.clone().sub(from);
        const len = dir.length();
        const quat = new THREE.Quaternion().setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          dir.clone().normalize(),
        );
        return (
          <mesh key={`edge-${i}`} position={mid.toArray()} quaternion={quat}>
            <cylinderGeometry args={[0.015, 0.015, len, 8]} />
            <meshBasicMaterial color="#86efac" transparent opacity={0.35 + progress * 0.4} />
          </mesh>
        );
      })}
    </group>
  );
}

type Props = {
  scrollProgress?: number;
  onTelemetry?: KPGSTHREETelemetryHook;
};

export default function KPGSTHREEScene({ scrollProgress = 0, onTelemetry }: Props) {
  const [policy, setPolicy] = useState(() =>
    resolveKPGSTHREEPolicy({
      enabled: false,
      webglAvailable: false,
      reducedMotion: true,
    }),
  );
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const isMobile =
      typeof window !== "undefined" &&
      (window.innerWidth < 768 || /Mobi|Android/i.test(navigator.userAgent));
    const canvas = document.createElement("canvas");
    const webglAvailable = Boolean(
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl"),
    );
    const next = resolveKPGSTHREEPolicy({
      enabled: isKPGSTHREEExperimentEnabled(),
      reducedMotion: prefersReducedMotion(),
      webglAvailable,
      documentHidden: document.hidden,
      isMobile,
      devicePixelRatio: window.devicePixelRatio || 1,
    });
    setPolicy(next);
    setReady(true);
    emitKPGSTHREETelemetry(onTelemetry, "policy_resolved", next.enabled ? "on" : "off");
    if (!shouldRenderKPGSTHREECanvas(next)) {
      emitKPGSTHREETelemetry(onTelemetry, "fallback_engaged", "canvas-disabled");
    }
  }, [onTelemetry]);

  useEffect(() => {
    const onVisibility = () => {
      setPolicy((prev) => ({ ...prev, documentHidden: document.hidden }));
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    if (!ready || !shouldRenderKPGSTHREECanvas(policy)) return;
    emitKPGSTHREETelemetry(onTelemetry, "scene_mounted");
    return () => {
      emitKPGSTHREETelemetry(onTelemetry, "scene_disposed");
      disposeKPGSTHREEScene({ geometries: [], materials: [], renderer: null });
    };
  }, [ready, policy, onTelemetry]);

  const showCanvas = ready && shouldRenderKPGSTHREECanvas(policy);
  const paused = policy.pauseWhenHidden && policy.documentHidden;
  const progress = Math.min(1, Math.max(0, scrollProgress));

  if (!showCanvas) {
    return (
      <div
        data-testid="kpgsthree-fallback"
        className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(34,197,94,0.18),transparent_42%),radial-gradient(circle_at_70%_80%,rgba(245,197,66,0.12),transparent_40%),linear-gradient(160deg,#04120a_0%,#0a1a12_55%,#030506_100%)]"
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      data-testid="kpgsthree-canvas-shell"
      className="absolute inset-0"
      style={{ pointerEvents: "none" }}
      aria-hidden="true"
    >
      <Canvas
        dpr={[1, policy.dprCap]}
        gl={{ antialias: !policy.isMobile, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 4.2, 6.2], fov: 42 }}
        style={{ pointerEvents: "none" }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <VenueToNetworkScene seed={policy.seed} paused={paused} progress={progress} />
      </Canvas>
    </div>
  );
}
