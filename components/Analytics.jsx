'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

let sessionId = null;
const getSession = () => {
  if (!sessionId) {
    sessionId = sessionStorage.getItem('_aid') || Math.random().toString(36).slice(2);
    sessionStorage.setItem('_aid', sessionId);
  }
  return sessionId;
};

export const trackEvent = (event, extra = {}) => {
  fetch('/api/analytics/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event,
      page: window.location.pathname,
      referrer: document.referrer || 'direct',
      userAgent: navigator.userAgent,
      sessionId: getSession(),
      ...extra,
    }),
  }).catch(() => {});
};

if (typeof window !== 'undefined') {
  window.trackEvent = trackEvent;
}

export default function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    trackEvent('page_view', { page: pathname, referrer: document.referrer || 'direct' });
  }, [pathname]);

  return null;
}
