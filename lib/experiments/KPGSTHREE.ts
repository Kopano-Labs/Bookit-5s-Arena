/**
 * KPGSTHREE.ts — Experiment 001 (EXPERIMENTAL / POC)
 *
 * Visual-governance lifecycle for the FivesArena epoch relaunch scene.
 * Owns experiment policy, capability detection, and disposal contracts.
 * Does NOT own page copy, business data, or network I/O.
 *
 * Kage (Meng To) is pattern inspiration only — no source/artwork reuse.
 * Thesis: single venue → platform network.
 */

export const KPGSTHREE_EXPERIMENT_ID = "001" as const;
export const KPGSTHREE_MODULE_NAME = "KPGSTHREE" as const;
export const KPGSTHREE_STATUS = "EXPERIMENTAL" as const;
export const KPGSTHREE_VISUAL_THESIS = "single venue → platform network" as const;

/** Exact canonical outbound identity for the parked public surface. */
export const CANONICAL_OUTBOUND_LINKS = Object.freeze({
  kopanoLabs: "https://KopanoLabs.com",
  krrababalela: "https://KRRababalela.com",
  linkedIn: "https://www.linkedin.com/in/kholofelorobynrababalela/",
});

/** Dated, Search Console–backed discovery evidence only. */
export const VALIDATED_DISCOVERY_METRICS = Object.freeze({
  august2026: Object.freeze({
    label: "August 2026",
    impressions: "5.71K",
    clicks: 149,
  }),
  june2026: Object.freeze({
    label: "June 2026",
    impressions: "2.57K",
    clicks: 90,
  }),
  ionosAssessment: Object.freeze({
    label: "IONOS website assessment",
    optimisation: "excellent",
  }),
});

/** Stale LinkedIn slugs that must not reappear on active transition surfaces. */
export const STALE_LINKEDIN_SLUGS = Object.freeze([
  "kholofelo-robyn-rababalela-7a26273b6",
  "kholofelo-robyn-rababalela",
]);

export type KPGSTHREETelemetryHook = (event: {
  type: "policy_resolved" | "scene_mounted" | "scene_disposed" | "fallback_engaged";
  experimentId: typeof KPGSTHREE_EXPERIMENT_ID;
  detail?: string;
}) => void;

export type KPGSTHREEPolicy = {
  experimentId: typeof KPGSTHREE_EXPERIMENT_ID;
  status: typeof KPGSTHREE_STATUS;
  enabled: boolean;
  seed: number;
  reducedMotion: boolean;
  webglAvailable: boolean;
  documentHidden: boolean;
  isMobile: boolean;
  dprCap: number;
  pauseWhenHidden: boolean;
  canvasAriaHidden: true;
  pointerEvents: "none";
};

export type ResolveKPGSTHREEPolicyInput = {
  enabled?: boolean;
  seed?: number;
  reducedMotion?: boolean;
  webglAvailable?: boolean;
  documentHidden?: boolean;
  isMobile?: boolean;
  devicePixelRatio?: number;
};

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

/** Deterministic seed helper for repeatable scene state. */
export function hashSeed(input: string | number): number {
  const text = String(input);
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function detectWebGL(
  createContext?: (type: string) => unknown | null,
): boolean {
  if (typeof document === "undefined" && !createContext) return false;
  try {
    if (createContext) {
      return Boolean(createContext("webgl") || createContext("experimental-webgl"));
    }
    const canvas = document.createElement("canvas");
    return Boolean(
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl"),
    );
  } catch {
    return false;
  }
}

export function prefersReducedMotion(
  matchMedia?: (query: string) => { matches: boolean },
): boolean {
  if (matchMedia) return Boolean(matchMedia("(prefers-reduced-motion: reduce)").matches);
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function resolveDpr(devicePixelRatio = 1, isMobile = false): number {
  const raw = Number.isFinite(devicePixelRatio) ? devicePixelRatio : 1;
  const cap = isMobile ? 1.5 : 2;
  return clamp(raw, 1, cap);
}

/**
 * Feature switch: disable the WebGL scene without rewriting page copy.
 * Default ON for Experiment 001 unless explicitly set false.
 */
export function isKPGSTHREEExperimentEnabled(
  env: NodeJS.ProcessEnv | Record<string, string | undefined> = process.env,
): boolean {
  const raw = env.NEXT_PUBLIC_KPGSTHREE_EXPERIMENT;
  if (raw === "false" || raw === "0" || raw === "off") return false;
  return true;
}

export function isEpochRelaunchActive(
  env: NodeJS.ProcessEnv | Record<string, string | undefined> = process.env,
): boolean {
  const raw = env.NEXT_PUBLIC_EPOCH_RELAUNCH;
  if (raw === "false" || raw === "0" || raw === "off") return false;
  return true;
}

export function isEpochRootPath(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  return pathname === "/" || pathname === "";
}

export function resolveKPGSTHREEPolicy(
  input: ResolveKPGSTHREEPolicyInput = {},
): KPGSTHREEPolicy {
  const isMobile = Boolean(input.isMobile);
  const enabled = input.enabled ?? true;
  const reducedMotion = Boolean(input.reducedMotion);
  const webglAvailable = Boolean(input.webglAvailable);
  const documentHidden = Boolean(input.documentHidden);

  return {
    experimentId: KPGSTHREE_EXPERIMENT_ID,
    status: KPGSTHREE_STATUS,
    enabled,
    seed: input.seed ?? hashSeed("fivesarena-epoch-001"),
    reducedMotion,
    webglAvailable,
    documentHidden,
    isMobile,
    dprCap: resolveDpr(input.devicePixelRatio ?? 1, isMobile),
    pauseWhenHidden: true,
    canvasAriaHidden: true,
    pointerEvents: "none",
  };
}

export function shouldRenderKPGSTHREECanvas(policy: KPGSTHREEPolicy): boolean {
  if (!policy.enabled) return false;
  if (!policy.webglAvailable) return false;
  if (policy.reducedMotion) return false;
  return true;
}

export function assertCanonicalOutboundLinks(
  links: Record<string, string> = CANONICAL_OUTBOUND_LINKS,
): string[] {
  const expected = CANONICAL_OUTBOUND_LINKS;
  const failures: string[] = [];
  for (const key of Object.keys(expected) as Array<keyof typeof expected>) {
    if (links[key] !== expected[key]) {
      failures.push(`${key}: expected ${expected[key]}, got ${links[key]}`);
    }
  }
  return failures;
}

export function containsStaleLinkedIn(url: string): boolean {
  const lower = url.toLowerCase();
  return STALE_LINKEDIN_SLUGS.some((slug) => lower.includes(slug));
}

export function containsHellenicIdentity(text: string): boolean {
  return /hellenic/i.test(text);
}

export type SceneDisposalHandle = {
  geometries: Array<{ dispose: () => void }>;
  materials: Array<{ dispose: () => void }>;
  renderer?: { dispose: () => void; forceContextLoss?: () => void } | null;
};

/** Safe disposal contract for renderer / geometries / materials. */
export function disposeKPGSTHREEScene(handle: SceneDisposalHandle): void {
  for (const geometry of handle.geometries) {
    try {
      geometry.dispose();
    } catch {
      /* ignore */
    }
  }
  for (const material of handle.materials) {
    try {
      material.dispose();
    } catch {
      /* ignore */
    }
  }
  if (handle.renderer) {
    try {
      handle.renderer.dispose();
      handle.renderer.forceContextLoss?.();
    } catch {
      /* ignore */
    }
  }
}

export function emitKPGSTHREETelemetry(
  hook: KPGSTHREETelemetryHook | undefined,
  type: Parameters<KPGSTHREETelemetryHook>[0]["type"],
  detail?: string,
): void {
  if (!hook) return;
  try {
    hook({ type, experimentId: KPGSTHREE_EXPERIMENT_ID, detail });
  } catch {
    /* telemetry must never break the surface */
  }
}
