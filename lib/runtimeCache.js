const globalCache = globalThis.__bookitRuntimeCache || new Map();

if (!globalThis.__bookitRuntimeCache) {
  globalThis.__bookitRuntimeCache = globalCache;
}

export async function withRuntimeCache(namespace, key, ttlMs, loader) {
  const cacheKey = `${namespace}:${key}`;
  const cached = globalCache.get(cacheKey);

  if (cached && cached.expiresAt > Date.now()) {
    return cached.value;
  }

  const value = await loader();

  globalCache.set(cacheKey, {
    value,
    expiresAt: Date.now() + ttlMs,
  });

  return value;
}

export function clearRuntimeCache(namespace) {
  for (const key of globalCache.keys()) {
    if (key.startsWith(`${namespace}:`)) {
      globalCache.delete(key);
    }
  }
}
