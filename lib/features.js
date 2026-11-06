/**
 * Server-side feature access checks.
 * Kept separate from lib/roles.js so roles.js stays Edge Runtime-safe (no mongoose).
 */
import { isSuperAdmin } from './roles.js';

function overrideFor(overrides, key) {
  if (!key || !overrides) return undefined;
  if (overrides instanceof Map) return overrides.get(key);
  return Object.hasOwn(overrides, key) ? overrides[key] : undefined;
}

export function resolveFeatureAccess(feature, { userId, activeRole, email } = {}) {
  return overrideFor(feature.userOverrides, email)
    ?? overrideFor(feature.userOverrides, userId)
    ?? overrideFor(feature.roleOverrides, activeRole)
    ?? feature.defaultEnabled;
}

// Simple in-memory cache: { cacheKey: { value, expires } }
const _featureCache = new Map();
const CACHE_TTL_MS = 60_000;

/**
 * Server-side feature check. Super admin always returns true.
 * Check order: user override → role override → defaultEnabled.
 *
 * @param {string} featureKey
 * @param {{ userId?: string, activeRole?: string, email?: string }} context
 */
export async function isFeatureEnabled(featureKey, { userId, activeRole, email } = {}, { strict = false } = {}) {
  if (isSuperAdmin(email)) return true;

  const cacheKey = JSON.stringify([featureKey, userId, activeRole, email]);
  const cached = strict ? undefined : _featureCache.get(cacheKey);
  if (cached && cached.expires > Date.now()) return cached.value;

  try {
    const { default: connectDB } = await import('./mongodb.js');
    const { default: FeatureAccess } = await import('../models/FeatureAccess.js');
    await connectDB();

    const feature = await FeatureAccess.findOne({ featureKey }).lean();
    if (!feature) return true; // unknown feature → allow by default

    const val = resolveFeatureAccess(feature, { userId, activeRole, email });
    if (!strict) _featureCache.set(cacheKey, { value: val, expires: Date.now() + CACHE_TTL_MS });
    return val;
  } catch (error) {
    if (strict) throw error;
    return true; // fail open — never block on DB error
  }
}
