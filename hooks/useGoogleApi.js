"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

/**
 * Hook to check if a Google API feature is enabled and visible to the current user.
 *
 * Usage:
 *   const { enabled, visible, loading } = useGoogleApi('maps');
 *   if (visible) return <VenueMap />;
 */
export function useGoogleApi(apiKey) {
  const { data: session } = useSession();
  const [state, setState] = useState({
    enabled: false,
    visible: false,
    config: null,
    loading: true,
  });

  useEffect(() => {
    let cancelled = false;

    async function check() {
      try {
        const res = await fetch(`/api/google/check?api=${apiKey}`);
        if (!res.ok) {
          setState({ enabled: false, visible: false, config: null, loading: false });
          return;
        }
        const data = await res.json();
        if (!cancelled) {
          setState({
            enabled: data.enabled,
            visible: data.visible,
            config: data.config || null,
            loading: false,
          });
        }
      } catch {
        if (!cancelled) {
          setState({ enabled: false, visible: false, config: null, loading: false });
        }
      }
    }

    check();
    return () => { cancelled = true; };
  }, [apiKey, session?.user?.activeRole]);

  return state;
}
