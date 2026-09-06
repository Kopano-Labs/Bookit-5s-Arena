'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import InfoTooltip from '@/components/InfoTooltip';

const CookieBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only show if not yet accepted
    const accepted = localStorage.getItem('cookie_consent');
    if (!accepted) {
      // Slight delay so it doesn't flash on load
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem('cookie_consent', 'declined');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-20 sm:bottom-4 left-3 right-3 sm:left-auto sm:right-4 z-[9999] sm:max-w-sm"
      style={{ backdropFilter: 'blur(12px)' }}
    >
      <div className="max-w-4xl mx-auto">
        <div
          className="bg-gray-950/95 border border-gray-700 rounded-2xl p-4 sm:p-5 shadow-[0_10px_40px_rgba(0,0,0,0.8)] flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4"
          style={{ boxShadow: '0 -4px 40px rgba(0,0,0,0.7), 0 0 0 1px rgba(34,197,94,0.2)' }}
        >
          {/* Icon */}
          <div className="text-2xl sm:text-3xl flex-shrink-0">🍪</div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <p className="text-white font-bold text-sm mb-1 flex items-center gap-2">
              We use cookies{' '}
              <InfoTooltip
                position="top"
                size={13}
                text="Essential cookies: keep you logged in and save preferences. Analytics cookies: anonymous usage data to improve the app. No personal data is sold."
              />
            </p>
            <p className="text-gray-400 text-xs leading-relaxed">
              5S Arena uses essential cookies for your session and preferences, plus anonymous analytics to improve the pitch experience.{' '}
              <Link href="/privacy" className="text-green-400 hover:text-green-300 underline font-bold">
                Privacy Policy
              </Link>
            </p>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto flex-shrink-0 pt-2 sm:pt-0">
            <button
              onClick={decline}
              className="flex-1 sm:flex-initial flex items-center justify-center min-h-[44px] px-4 py-2 text-xs font-bold text-gray-400 hover:text-white bg-gray-900 hover:bg-gray-800 border border-gray-700 rounded-xl transition-all uppercase tracking-widest cursor-pointer"
            >
              Decline
            </button>
            <button
              onClick={accept}
              className="flex-1 sm:flex-initial flex items-center justify-center min-h-[44px] px-5 py-2 text-xs font-black text-white rounded-xl transition-all hover:scale-105 uppercase tracking-widest cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #15803d 0%, #22c55e 100%)',
                boxShadow: '0 0 15px rgba(34,197,94,0.4)',
              }}
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;

