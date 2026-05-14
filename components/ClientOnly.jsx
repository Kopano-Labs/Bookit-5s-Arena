'use client';

import { useEffect } from 'react';

export default function ClientOnly() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return undefined;
    }

    navigator.serviceWorker.register('/sw.js').catch(() => undefined);
    return undefined;
  }, []);

  return null;
}
