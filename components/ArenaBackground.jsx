'use client';

import { useEffect, useRef } from 'react';

// DVD-screensaver style: bounces off all 4 walls, changes green shade on each hit
const COLORS = ['#22c55e', '#16a34a', '#4ade80', '#15803d', '#86efac', '#34d399'];

const ArenaBackground = () => {
  const textRef = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    // Wait one frame so offsetWidth is measured after font loads
    let x = 60;
    let y = 60;
    let colorIdx = 0;

    // Speed proportional to viewport size
    const base = Math.min(window.innerWidth, window.innerHeight) * 0.0028;
    let vx = base * 1.0;
    let vy = base * 0.72; // slightly off-45° so it hits corners rarely (true DVD effect)

    const tick = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const tw = el.offsetWidth;
      const th = el.offsetHeight;

      x += vx;
      y += vy;

      let bounced = false;

      if (x <= 0) {
        x = 0;
        vx = Math.abs(vx);
        bounced = true;
      }
      if (x + tw >= vw) {
        x = vw - tw;
        vx = -Math.abs(vx);
        bounced = true;
      }
      if (y <= 0) {
        y = 0;
        vy = Math.abs(vy);
        bounced = true;
      }
      if (y + th >= vh) {
        y = vh - th;
        vy = -Math.abs(vy);
        bounced = true;
      }

      if (bounced) {
        colorIdx = (colorIdx + 1) % COLORS.length;
        const c = COLORS[colorIdx];
        el.style.color = c;
        el.style.textShadow = `0 0 40px ${c}, 0 0 90px ${c}55, 0 0 160px ${c}22`;
        el.style.webkitTextStroke = `1px ${c}88`;
      }

      // Direct DOM transform — zero React re-renders
      el.style.transform = `translate(${x}px, ${y}px)`;

      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden"
      style={{ background: '#030508' }}
    >
      {/* ── Perspective pitch-floor grid ── */}
      <div
        style={{
          position: 'absolute',
          bottom: '-5%',
          left: '50%',
          width: '320%',
          height: '75%',
          transform: 'translateX(-50%) perspective(650px) rotateX(68deg)',
          transformOrigin: 'center bottom',
          backgroundImage: `
            linear-gradient(rgba(34,197,94,0.18) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34,197,94,0.18) 1px, transparent 1px)
          `,
          backgroundSize: '90px 90px',
          animation: 'pitchGridPulse 5s ease-in-out infinite',
          pointerEvents: 'none',
        }}
      />

      {/* ── Centre circle on pitch ── */}
      <div
        style={{
          position: 'absolute',
          bottom: '2%',
          left: '50%',
          width: '260px',
          height: '260px',
          borderRadius: '50%',
          border: '2px solid rgba(34,197,94,0.2)',
          transform: 'translateX(-50%) perspective(650px) rotateX(68deg)',
          transformOrigin: 'center bottom',
          animation: 'pitchGridPulse 5s ease-in-out infinite',
          pointerEvents: 'none',
        }}
      />

      {/* ── Stadium spotlights ── */}
      <div
        style={{
          position: 'absolute',
          top: 0, left: '-5%',
          width: '55%', height: '100%',
          background: 'linear-gradient(168deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 25%, transparent 55%)',
          animation: 'spotlightSway 8s ease-in-out infinite',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0, right: '-5%',
          width: '55%', height: '100%',
          background: 'linear-gradient(192deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 25%, transparent 55%)',
          animation: 'spotlightSway 8s ease-in-out infinite 4s',
          pointerEvents: 'none',
        }}
      />

      {/* ── Ambient green glows ── */}
      <div
        style={{
          position: 'absolute', top: '5%', left: '-8%',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(22,163,74,0.18) 0%, transparent 65%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute', bottom: '-8%', right: '-5%',
          width: '450px', height: '450px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(21,128,61,0.15) 0%, transparent 65%)',
          pointerEvents: 'none',
        }}
      />

      {/* ══ DVD-bounce "5S ARENA" ══ */}
      <div
        ref={textRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          whiteSpace: 'nowrap',
          userSelect: 'none',
          pointerEvents: 'none',
          fontFamily: "'Rubik Dirt', Impact, Arial Black, sans-serif",
          fontSize: 'clamp(42px, 7vw, 100px)',
          fontWeight: 900,
          letterSpacing: '0.04em',
          lineHeight: 1,
          color: COLORS[0],
          textShadow: `0 0 40px ${COLORS[0]}, 0 0 90px ${COLORS[0]}55, 0 0 160px ${COLORS[0]}22`,
          WebkitTextStroke: `1px ${COLORS[0]}88`,
          willChange: 'transform',
          // Start translated so rAF picks up immediately
          transform: 'translate(60px, 60px)',
        }}
      >
        5S ARENA
      </div>
    </div>
  );
};

export default ArenaBackground;
