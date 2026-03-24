'use client';

import { useState, useRef } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ReCAPTCHA from 'react-google-recaptcha';
import {
  FaSignInAlt, FaGoogle, FaUserSecret, FaEnvelope, FaLock,
  FaUserPlus, FaUser, FaShieldAlt, FaTrophy, FaStar, FaBolt,
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Animated background (no footballs — geometric particles + scanning lines) ─

function ParticleField() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 20% 50%, rgba(34,197,94,0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(59,130,246,0.06) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(168,85,247,0.05) 0%, transparent 50%)',
      }} />

      {/* Floating geometric shapes */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${8 + (i * 8) % 85}%`,
            top: `${5 + (i * 13) % 90}%`,
            width: `${4 + (i % 4) * 3}px`,
            height: `${4 + (i % 4) * 3}px`,
            borderRadius: i % 3 === 0 ? '50%' : i % 3 === 1 ? '2px' : '0',
            transform: i % 3 === 2 ? 'rotate(45deg)' : 'none',
            background: i % 2 === 0 ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.1)',
          }}
          animate={{
            y: [0, -20 - (i * 5), 0],
            x: [0, (i % 2 === 0 ? 10 : -10), 0],
            opacity: [0.15, 0.5, 0.15],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 4 + i * 0.7, repeat: Infinity, delay: i * 0.3, ease: 'easeInOut' }}
        />
      ))}

      {/* Horizontal scanning line */}
      <motion.div
        className="absolute left-0 right-0 h-[1px]"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(34,197,94,0.15), transparent)' }}
        animate={{ top: ['0%', '100%'] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />

      {/* Pulsing rings */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-green-500/5"
        animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.05, 0.15, 0.05] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-green-500/5"
        animate={{ scale: [1.2, 0.8, 1.2], opacity: [0.03, 0.1, 0.03] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      {/* Retro "5S ARENA" background text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <motion.div
          className="font-black uppercase text-center leading-none"
          style={{
            fontSize: 'clamp(8rem, 20vw, 18rem)',
            fontFamily: 'Impact, Arial Black, sans-serif',
            color: 'transparent',
            WebkitTextStroke: '2px rgba(34,197,94,0.06)',
            letterSpacing: '0.1em',
          }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [0.98, 1.02, 0.98],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        >
          5S
          <br />
          ARENA
        </motion.div>
      </div>
      {/* Additional retro tilted text layers */}
      <motion.div
        className="absolute top-[15%] left-[-5%] font-black uppercase pointer-events-none select-none"
        style={{
          fontSize: '6rem',
          fontFamily: 'Impact, Arial Black, sans-serif',
          color: 'transparent',
          WebkitTextStroke: '1px rgba(34,197,94,0.04)',
          transform: 'rotate(-12deg)',
        }}
        animate={{ x: [0, 30, 0], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      >
        5S ARENA
      </motion.div>
      <motion.div
        className="absolute bottom-[10%] right-[-5%] font-black uppercase pointer-events-none select-none"
        style={{
          fontSize: '5rem',
          fontFamily: 'Impact, Arial Black, sans-serif',
          color: 'transparent',
          WebkitTextStroke: '1px rgba(34,197,94,0.03)',
          transform: 'rotate(8deg)',
        }}
        animate={{ x: [0, -20, 0], opacity: [0.15, 0.35, 0.15] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      >
        5S ARENA
      </motion.div>
    </div>
  );
}

// ─── Feature badge ───────────────────────────────────────────────────────────

function FeatureBadge({ icon, text, delay }) {
  return (
    <motion.div
      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-800/40 border border-gray-700/30 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <span className="text-green-400">{icon}</span>
      <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">{text}</span>
    </motion.div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function AuthPage() {
  const router = useRouter();
  const recaptchaRef = useRef(null);

  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await signIn('credentials', { email, password, redirect: false });
    setLoading(false);
    if (result?.error) setError(result.error);
    else { router.push('/'); router.refresh(); }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (!recaptchaToken) { setError('Please complete the verification check.'); return; }

    setLoading(true);
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, recaptchaToken }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Something went wrong.');
      recaptchaRef.current?.reset();
      setRecaptchaToken('');
      setLoading(false);
      return;
    }
    const result = await signIn('credentials', { email, password, redirect: false });
    setLoading(false);
    if (result?.error) setError(result.error);
    else { router.push('/'); router.refresh(); }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    await signIn('google', { callbackUrl: '/' });
  };

  const inputClass = (field) =>
    `block w-full px-4 py-3.5 bg-gray-800/40 border rounded-xl text-white text-sm focus:ring-2 focus:ring-green-500/40 focus:border-green-600/50 outline-none transition-all placeholder-gray-600 backdrop-blur-sm ${
      focusedField === field ? 'border-green-600/50 bg-gray-800/60' : 'border-gray-700/40'
    }`;

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 relative overflow-hidden bg-gray-950">
      <ParticleField />

      <div className="w-full max-w-5xl relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

        {/* ── Left: Branding ── */}
        <motion.div
          className="flex-1 text-center lg:text-left max-w-md"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <h1
              className="font-black uppercase"
              style={{
                fontSize: 'clamp(3rem, 8vw, 5rem)',
                fontFamily: 'Impact, Arial Black, sans-serif',
                background: 'linear-gradient(135deg, #ffffff 0%, #4ade80 40%, #22c55e 70%, #16a34a 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 30px rgba(34,197,94,0.3))',
                lineHeight: 1,
              }}
            >
              5S ARENA
            </h1>
            <motion.div
              className="h-1 w-16 lg:w-24 bg-gradient-to-r from-green-500 to-emerald-400 rounded-full mt-3 mx-auto lg:mx-0"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              style={{ transformOrigin: 'left' }}
            />
          </motion.div>

          <motion.p
            className="text-gray-400 text-lg leading-relaxed mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {mode === 'login'
              ? 'Welcome back to the pitch. Sign in to manage your bookings and unlock rewards.'
              : 'Join the arena. Create your account and start booking courts today.'}
          </motion.p>

          <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
            <FeatureBadge icon={<FaTrophy size={11} />} text="Loyalty Rewards" delay={0.5} />
            <FeatureBadge icon={<FaBolt size={11} />} text="Instant Booking" delay={0.6} />
            <FeatureBadge icon={<FaStar size={11} />} text="Member Perks" delay={0.7} />
          </div>
        </motion.div>

        {/* ── Right: Auth card ── */}
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="bg-gray-900/70 backdrop-blur-2xl shadow-2xl rounded-3xl border border-gray-700/40 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 pointer-events-none" style={{ background: 'radial-gradient(circle at 100% 0%, rgba(34,197,94,0.08) 0%, transparent 70%)' }} />

            {/* Tabs */}
            <div className="flex border-b border-gray-800/50">
              {[
                { key: 'login', label: 'Sign In', icon: <FaSignInAlt size={12} /> },
                { key: 'register', label: 'Register', icon: <FaUserPlus size={12} /> },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => { setMode(tab.key); setError(''); }}
                  className={`flex-1 py-4 text-sm font-bold uppercase tracking-widest transition-all relative cursor-pointer flex items-center justify-center gap-2 ${
                    mode === tab.key ? 'text-green-400' : 'text-gray-600 hover:text-gray-400'
                  }`}
                >
                  {tab.icon} {tab.label}
                  {mode === tab.key && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-green-500 to-emerald-400"
                      layoutId="authTab"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>

            <div className="p-8">
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-5 p-3 bg-red-950/50 border border-red-800/50 rounded-xl text-red-400 text-sm"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Google */}
              <motion.button
                onClick={handleGoogleSignIn}
                disabled={googleLoading}
                className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-gray-800/50 border border-gray-700/40 rounded-xl text-sm font-semibold text-gray-200 hover:border-green-600/40 hover:bg-gray-800/80 hover:text-white transition-all disabled:opacity-50 backdrop-blur-sm cursor-pointer mb-4"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaGoogle className="text-red-400" />
                {googleLoading ? 'Redirecting...' : 'Continue with Google'}
              </motion.button>

              {mode === 'login' && (
                <Link href="/">
                  <motion.div
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-gray-500 border border-dashed border-gray-700/40 hover:border-gray-600 hover:text-gray-400 transition-all cursor-pointer mb-4"
                    whileHover={{ scale: 1.02 }}
                  >
                    <FaUserSecret /> Browse as Guest <span className="text-xs text-gray-600">(limited)</span>
                  </motion.div>
                </Link>
              )}

              <div className="relative mb-5">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-800/40" /></div>
                <div className="relative flex justify-center">
                  <span className="bg-gray-900/70 px-3 text-gray-600 text-[10px] uppercase tracking-widest">
                    or {mode === 'login' ? 'sign in' : 'register'} with email
                  </span>
                </div>
              </div>

              {/* Form */}
              <AnimatePresence mode="wait">
                <motion.form
                  key={mode}
                  onSubmit={mode === 'login' ? handleLogin : handleRegister}
                  className="space-y-4"
                  initial={{ opacity: 0, x: mode === 'login' ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: mode === 'login' ? 20 : -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {mode === 'register' && (
                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest flex items-center gap-1.5">
                        <FaUser size={10} className="text-green-500" /> Full Name
                      </label>
                      <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
                        onFocus={() => setFocusedField('name')} onBlur={() => setFocusedField(null)}
                        className={inputClass('name')} placeholder="John Doe" />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest flex items-center gap-1.5">
                      <FaEnvelope size={10} className="text-green-500" /> Email
                    </label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                      onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)}
                      className={inputClass('email')} placeholder="you@example.com" />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest flex items-center gap-1.5">
                      <FaLock size={10} className="text-green-500" /> Password
                    </label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                      onFocus={() => setFocusedField('password')} onBlur={() => setFocusedField(null)}
                      className={inputClass('password')} placeholder={mode === 'register' ? 'Min. 6 characters' : '••••••••'} />
                  </div>

                  {mode === 'register' && (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest flex items-center gap-1.5">
                          <FaLock size={10} className="text-green-500" /> Confirm Password
                        </label>
                        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required
                          onFocus={() => setFocusedField('confirm')} onBlur={() => setFocusedField(null)}
                          className={inputClass('confirm')} placeholder="Repeat password" />
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <FaShieldAlt className="text-green-500" size={12} />
                          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Security Check</span>
                        </div>
                        <div className={`rounded-xl border p-3 transition-all flex justify-center backdrop-blur-sm ${recaptchaToken ? 'border-green-600/40 bg-green-900/10' : 'border-gray-700/40 bg-gray-800/20'}`}>
                          {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY !== 'your_site_key_here' ? (
                            <ReCAPTCHA ref={recaptchaRef} sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY} onChange={(token) => setRecaptchaToken(token || '')} onExpired={() => setRecaptchaToken('')} theme="dark" />
                          ) : (
                            <div className="text-center py-2">
                              <p className="text-xs text-amber-500 font-semibold">reCAPTCHA not configured</p>
                              <button type="button" onClick={() => setRecaptchaToken('dev-bypass')} className="mt-1.5 text-xs text-green-500 underline cursor-pointer">[Dev] Skip verification</button>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  <motion.button
                    type="submit"
                    disabled={loading || (mode === 'register' && !recaptchaToken)}
                    className="w-full py-4 px-4 rounded-xl text-sm font-black text-white uppercase tracking-widest transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-2 relative overflow-hidden cursor-pointer"
                    style={{ background: 'linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)', backgroundSize: '200% 200%' }}
                    animate={{
                      backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
                      boxShadow: ['0 0 20px rgba(16,185,129,0.3)', '0 0 40px rgba(16,185,129,0.5)', '0 0 20px rgba(16,185,129,0.3)'],
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <motion.div
                      className="absolute inset-0"
                      style={{ background: 'linear-gradient(110deg, transparent 25%, rgba(255,255,255,0.1) 50%, transparent 75%)', backgroundSize: '200% 100%' }}
                      animate={{ backgroundPosition: ['-100% 0', '200% 0'] }}
                      transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1 }}
                    />
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {mode === 'login' ? <FaSignInAlt /> : <FaUserPlus />}
                      {loading
                        ? (mode === 'login' ? 'Signing in...' : 'Creating account...')
                        : (mode === 'login' ? 'Sign In' : 'Create Account')
                      }
                    </span>
                  </motion.button>
                </motion.form>
              </AnimatePresence>

              <p className="mt-6 text-center text-sm text-gray-500">
                {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                <button
                  onClick={() => { setMode(m => m === 'login' ? 'register' : 'login'); setError(''); }}
                  className="font-bold text-green-400 hover:text-green-300 transition-colors cursor-pointer"
                >
                  {mode === 'login' ? 'Register here' : 'Sign in here'}
                </button>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
