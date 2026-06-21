"use client";

import { useEffect, useState } from "react";
import { hydrateFromVaultThenFetch } from "@/lib/offline/fixturesVaultClient";

export function useFixturesVaultFetch({
  url,
  cacheKey,
  resource,
  leagueSlug = "global",
  season = null,
  ttlMs,
  enabled = true,
}) {
  const [data, setData] = useState(null);
  const [vault, setVault] = useState(null);
  const [loading, setLoading] = useState(Boolean(enabled));
  const [error, setError] = useState("");

  useEffect(() => {
    if (!enabled) return undefined;

    let cancelled = false;
    const controller = new AbortController();

    async function run() {
      setLoading(true);
      setError("");
      try {
        const result = await hydrateFromVaultThenFetch({
          url,
          cacheKey,
          resource,
          leagueSlug,
          season,
          ttlMs,
          signal: controller.signal,
        });
        if (cancelled) return;
        setData(result.data);
        setVault(result.vault);
      } catch (err) {
        if (cancelled || err?.name === "AbortError") return;
        setError(err.message || "Failed to load fixtures data.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [url, cacheKey, resource, leagueSlug, season, ttlMs, enabled]);

  return { data, vault, loading, error };
}
