"use client";

import {
  appendOfflineReceipt,
  fixturesCacheKey,
  isSnapshotStale,
  readFixturesSnapshot,
  writeFixturesSnapshot,
} from "@/lib/offline/fixturesVault";

const DEFAULT_TTL = {
  meta: 60 * 60 * 1000,
  matches: 5 * 60 * 1000,
  featured: 2 * 60 * 1000,
  standings: 10 * 60 * 1000,
  stats: 10 * 60 * 1000,
  news: 15 * 60 * 1000,
};

function isOffline() {
  return typeof navigator !== "undefined" && navigator.onLine === false;
}

async function fetchJson(url, init) {
  const response = await fetch(url, init);
  const contentType = response.headers.get("content-type") || "";
  let data;
  if (contentType.includes("application/json")) {
    data = await response.json();
  } else {
    const text = await response.text();
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(`Unexpected response from ${url}`);
    }
  }
  if (!response.ok) {
    throw new Error(data?.error || `Request failed (${response.status})`);
  }
  return data;
}

/**
 * Vault-first read: serve IndexedDB immediately, refresh network in background.
 * APIs are optimistic caches — vault is the user-facing source of truth.
 */
export async function hydrateFromVaultThenFetch({
  url,
  cacheKey,
  resource,
  leagueSlug = "global",
  season = null,
  ttlMs,
  signal,
  onVaultHit,
}) {
  const staleAfterMs = ttlMs ?? DEFAULT_TTL[resource] ?? DEFAULT_TTL.matches;
  const cached = await readFixturesSnapshot(cacheKey);

  if (cached && typeof onVaultHit === "function") {
    onVaultHit({
      data: cached.payload,
      vault: {
        fromVault: true,
        stale: isSnapshotStale(cached),
        refreshing: !isOffline(),
        offline: isOffline(),
        lastUpdated: cached.lastUpdated,
      },
    });
  }

  const vaultMeta = {
    fromVault: Boolean(cached),
    stale: isSnapshotStale(cached),
    refreshing: false,
    offline: isOffline(),
    lastUpdated: cached?.lastUpdated ?? null,
  };

  if (cached) {
    vaultMeta.refreshing = !vaultMeta.offline;
  }

  if (vaultMeta.offline && cached) {
    await appendOfflineReceipt({
      kind: "fixtures_offline_read",
      cacheKey,
      note: "Served saved market data while offline.",
    });
    return { data: cached.payload, vault: { ...vaultMeta, stale: true, refreshing: false } };
  }

  try {
    const fresh = await fetchJson(url, { cache: "no-store", signal });
    await writeFixturesSnapshot({
      cacheKey,
      resource,
      leagueSlug,
      season,
      payload: fresh,
      lastUpdated: Date.now(),
      staleAfterMs,
      source: "network",
    });
    return {
      data: fresh,
      vault: {
        fromVault: false,
        stale: false,
        refreshing: false,
        offline: false,
        lastUpdated: Date.now(),
      },
    };
  } catch (error) {
    if (cached) {
      await appendOfflineReceipt({
        kind: "fixtures_network_fallback",
        cacheKey,
        note: error?.message || "Network refresh failed — using vault snapshot.",
      });
      return {
        data: cached.payload,
        vault: {
          fromVault: true,
          stale: true,
          refreshing: false,
          offline: isOffline(),
          lastUpdated: cached.lastUpdated,
        },
        error: null,
      };
    }
    throw error;
  }
}

export async function loadLeagueHubBundle(slug, { season = null, signal, onPartial } = {}) {
  const metaKey = fixturesCacheKey(slug, "meta");
  const cachedMeta = await readFixturesSnapshot(metaKey);
  let seasonYear =
    season ??
    cachedMeta?.payload?.selectedSeason ??
    cachedMeta?.payload?.seasonOptions?.[0]?.year ??
    new Date().getFullYear();

  const cachedMatches = await readFixturesSnapshot(fixturesCacheKey(slug, "matches", seasonYear));
  if (cachedMeta && typeof onPartial === "function") {
    onPartial({
      meta: cachedMeta.payload,
      matches: cachedMatches?.payload || null,
      vault: {
        meta: {
          fromVault: true,
          stale: isSnapshotStale(cachedMeta),
          refreshing: true,
          offline: isOffline(),
          lastUpdated: cachedMeta.lastUpdated,
        },
        matches: cachedMatches
          ? {
              fromVault: true,
              stale: isSnapshotStale(cachedMatches),
              refreshing: true,
              offline: isOffline(),
              lastUpdated: cachedMatches.lastUpdated,
            }
          : null,
      },
    });
  }

  const metaResult = await hydrateFromVaultThenFetch({
    url: `/api/football/league/${slug}/meta`,
    cacheKey: metaKey,
    resource: "meta",
    leagueSlug: slug,
    signal,
  });

  seasonYear =
    season ??
    metaResult.data?.selectedSeason ??
    metaResult.data?.seasonOptions?.[0]?.year ??
    seasonYear;

  const matchesResult = await hydrateFromVaultThenFetch({
    url: `/api/football/league/${slug}/matches?season=${seasonYear}`,
    cacheKey: fixturesCacheKey(slug, "matches", seasonYear),
    resource: "matches",
    leagueSlug: slug,
    season: seasonYear,
    signal,
  });

  return {
    meta: metaResult.data,
    matches: matchesResult.data,
    vault: {
      meta: metaResult.vault,
      matches: matchesResult.vault,
    },
  };
}

export async function loadFeaturedMatches({ signal } = {}) {
  const cacheKey = fixturesCacheKey("global", "featured");
  const result = await hydrateFromVaultThenFetch({
    url: "/api/football/featured",
    cacheKey,
    resource: "featured",
    leagueSlug: "global",
    signal,
  });
  const rows = Array.isArray(result.data) ? result.data : result.data?.matches || [];
  return { matches: rows, vault: result.vault };
}

export { fixturesCacheKey, DEFAULT_TTL };
