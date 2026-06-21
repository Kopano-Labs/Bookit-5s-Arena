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

export function getRuntimeCacheSnapshot() {
  const namespaces = new Map();

  for (const [key, entry] of globalCache.entries()) {
    const [namespace = "unknown"] = key.split(":");

    if (!namespaces.has(namespace)) {
      namespaces.set(namespace, {
        namespace,
        entries: 0,
        nextExpiryMs: null,
      });
    }

    const snapshot = namespaces.get(namespace);
    snapshot.entries += 1;

    const ttlRemaining = Math.max((entry?.expiresAt || 0) - Date.now(), 0);
    if (snapshot.nextExpiryMs === null || ttlRemaining < snapshot.nextExpiryMs) {
      snapshot.nextExpiryMs = ttlRemaining;
    }
  }

  return {
    totalEntries: globalCache.size,
    namespaces: [...namespaces.values()].sort((left, right) =>
      left.namespace.localeCompare(right.namespace),
    ),
  };
}
