// ArenaBackground — full-screen animated stadium backdrop for login/register
// No client state needed — pure HTML/CSS animations

const ArenaBackground = () => (
  <div
    className="fixed inset-0 -z-10 overflow-hidden"
    style={{ background: '#030508' }}
  >
    {/* ── Perspective football-pitch floor grid ── */}
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
          linear-gradient(rgba(34,197,94,0.22) 1px, transparent 1px),
          linear-gradient(90deg, rgba(34,197,94,0.22) 1px, transparent 1px)
        `,
        backgroundSize: '90px 90px',
        animation: 'pitchGridPulse 5s ease-in-out infinite',
        pointerEvents: 'none',
      }}
    />

    {/* ── Centre circle on the pitch ── */}
    <div
      style={{
        position: 'absolute',
        bottom: '2%',
        left: '50%',
        width: '260px',
        height: '260px',
        borderRadius: '50%',
        border: '2px solid rgba(34,197,94,0.25)',
        transform: 'translateX(-50%) perspective(650px) rotateX(68deg)',
        transformOrigin: 'center bottom',
        animation: 'pitchGridPulse 5s ease-in-out infinite',
        pointerEvents: 'none',
      }}
    />

    {/* ── Ghost "5S ARENA" background text ── */}
    <div
      style={{
        position: 'absolute',
        top: '42%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: 'clamp(70px, 16vw, 220px)',
        fontFamily: 'Impact, Arial Black, sans-serif',
        fontWeight: 900,
        letterSpacing: '-0.02em',
        color: 'transparent',
        WebkitTextStroke: '1.5px rgba(34,197,94,0.15)',
        whiteSpace: 'nowrap',
        userSelect: 'none',
        pointerEvents: 'none',
        animation: 'arenaGhostPulse 4s ease-in-out infinite',
      }}
    >
      5S ARENA
    </div>

    {/* ── Stadium spotlight LEFT ── */}
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: '-5%',
        width: '55%',
        height: '100%',
        background:
          'linear-gradient(168deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.03) 25%, transparent 55%)',
        transformOrigin: 'top left',
        animation: 'spotlightSway 8s ease-in-out infinite',
        pointerEvents: 'none',
      }}
    />

    {/* ── Stadium spotlight RIGHT ── */}
    <div
      style={{
        position: 'absolute',
        top: 0,
        right: '-5%',
        width: '55%',
        height: '100%',
        background:
          'linear-gradient(192deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.03) 25%, transparent 55%)',
        transformOrigin: 'top right',
        animation: 'spotlightSway 8s ease-in-out infinite 4s',
        pointerEvents: 'none',
      }}
    />

    {/* ── Green ambient glows ── */}
    <div
      style={{
        position: 'absolute',
        top: '5%',
        left: '-8%',
        width: '550px',
        height: '550px',
        borderRadius: '50%',
        background:
          'radial-gradient(circle, rgba(22,163,74,0.22) 0%, transparent 65%)',
        pointerEvents: 'none',
      }}
    />
    <div
      style={{
        position: 'absolute',
        bottom: '-8%',
        right: '-5%',
        width: '480px',
        height: '480px',
        borderRadius: '50%',
        background:
          'radial-gradient(circle, rgba(21,128,61,0.18) 0%, transparent 65%)',
        pointerEvents: 'none',
      }}
    />

    {/* ══ THE BALL THAT ZOOMS AT YOUR FACE ══ */}
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        fontSize: '160px',
        lineHeight: 1,
        userSelect: 'none',
        pointerEvents: 'none',
        filter:
          'hue-rotate(110deg) saturate(20) brightness(0.75) drop-shadow(0 0 60px rgba(34,197,94,1)) drop-shadow(0 0 120px rgba(34,197,94,0.5))',
        animation: 'zoomAtViewer 6s cubic-bezier(0.4, 0, 1, 0.8) infinite',
      }}
    >
      ⚽
    </div>

    {/* ── Side ball LEFT → RIGHT (large, bottom) ── */}
    <div
      style={{
        position: 'absolute',
        bottom: '18%',
        left: 0,
        fontSize: '200px',
        lineHeight: 1,
        userSelect: 'none',
        pointerEvents: 'none',
        filter:
          'hue-rotate(110deg) saturate(18) brightness(0.72) drop-shadow(0 0 50px rgba(34,197,94,0.9))',
        animation: 'arenaRollLR 14s linear infinite 3s',
      }}
    >
      ⚽
    </div>

    {/* ── Side ball RIGHT → LEFT (medium, upper) ── */}
    <div
      style={{
        position: 'absolute',
        top: '22%',
        right: 0,
        fontSize: '120px',
        lineHeight: 1,
        userSelect: 'none',
        pointerEvents: 'none',
        filter:
          'hue-rotate(110deg) saturate(18) brightness(0.65) drop-shadow(0 0 35px rgba(34,197,94,0.7))',
        animation: 'arenaRollRL 20s linear infinite 8s',
      }}
    >
      ⚽
    </div>

    {/* ── Diagonal ball TOP-LEFT → BOTTOM-RIGHT ── */}
    <div
      style={{
        position: 'absolute',
        top: '10%',
        left: '5%',
        fontSize: '90px',
        lineHeight: 1,
        userSelect: 'none',
        pointerEvents: 'none',
        filter:
          'hue-rotate(110deg) saturate(18) brightness(0.6) drop-shadow(0 0 25px rgba(34,197,94,0.6))',
        animation: 'arenaDiagTL 22s linear infinite 1s',
      }}
    >
      ⚽
    </div>
  </div>
);

export default ArenaBackground;
