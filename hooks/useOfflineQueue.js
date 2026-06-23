"use client";

import { useCallback, useEffect, useState } from "react";
import { getOfflineQueueSnapshot, processOfflineQueue } from "@/lib/offline/kopanoOfflineQueue";

const EMPTY_COUNTS = { total: 0 };

export function useOfflineQueue({ syncUrl = "/api/v1/sync" } = {}) {
  const [isOnline, setIsOnline] = useState(true);
  const [counts, setCounts] = useState(EMPTY_COUNTS);

  const refresh = useCallback(async () => {
    try {
      const snapshot = await getOfflineQueueSnapshot();
      setCounts(snapshot.counts || EMPTY_COUNTS);
    } catch {
      setCounts(EMPTY_COUNTS);
    }
  }, []);

  const flush = useCallback(async () => {
    try {
      await processOfflineQueue({ syncUrl });
    } finally {
      await refresh();
    }
  }, [refresh, syncUrl]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    setIsOnline(window.navigator.onLine);
    refresh();

    if (window.navigator.onLine) {
      flush();
    }

    const handleOnline = () => {
      setIsOnline(true);
      flush();
    };
    const handleOffline = () => setIsOnline(false);
    const handleQueueChange = () => refresh();

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    window.addEventListener("kopano:degraded-mode", handleQueueChange);

    const interval = window.setInterval(() => {
      if (window.navigator.onLine) {
        flush();
      } else {
        refresh();
      }
    }, 30_000);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("kopano:degraded-mode", handleQueueChange);
      window.clearInterval(interval);
    };
  }, [flush, refresh]);

  return {
    isOnline,
    counts,
    pendingCount: (counts.PENDING || 0) + (counts.SYNCING || 0),
    conflictCount: counts.CONFLICT || 0,
    deadLetterCount: counts.DEAD_LETTER || 0,
    refresh,
    flush,
  };
}
