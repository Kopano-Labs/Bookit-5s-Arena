'use client';

import { useState, useRef } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ReCAPTCHA from 'react-google-recaptcha';
import {
  FaSignInAlt, FaGoogle, FaUserSecret, FaEnvelope, FaLock,
  FaUserPlus, FaUser, FaShieldAlt, FaTrophy, FaStar, FaBolt,
  FaGithub, FaApple, FaMicrosoft, FaGlobe, FaTicketAlt
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
    if (!recaptchaToken) { setError('Please complete the security check.'); return; }
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

  const handleProviderSignIn = async (provider) => {
    if (provider === 'google') setGoogleLoading(true);
    await signIn(provider, { callbackUrl: '/' });
  };

  const inputClass = (field) =>
    `block w-full px-4 py-3.5 bg-gray-800/40 border rounded-xl text-white text-sm focus:ring-2 focus:ring-green-500/40 focus:border-green-600/50 outline-none transition-all placeholder-gray-600 backdrop-blur-sm ${
      focusedField === field ? 'border-green-600/50 bg-gray-800/60' : 'border-gray-700/40'
    }`;

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 relative overflow-hidden bg-gray-950">
      <ParticleField />

      <div className="w-full max-w-5xl relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

        {/* ── Left: FIFA WC Ad ── */}
        <motion.div
          className="flex-1 text-center lg:text-left max-w-md relative"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Ad Badge */}
          <motion.div 
            className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-gradient-to-r from-yellow-600/20 to-amber-900/30 border border-yellow-500/30 text-yellow-500 text-[10px] font-black tracking-widest uppercase shadow-[0_0_20px_rgba(234,179,8,0.2)]"
            animate={{ boxShadow: ['0 0 10px rgba(234,179,8,0.2)', '0 0 25px rgba(234,179,8,0.5)', '0 0 10px rgba(234,179,8,0.2)'] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <FaTrophy size={11} /> Official Tournament
          </motion.div>

          <motion.div
            className="mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <h1
              className="font-black uppercase tracking-tight leading-none mb-2"
              style={{
                fontSize: 'clamp(3rem, 7vw, 4.5rem)',
                fontFamily: 'Impact, Arial Black, sans-serif',
                color: '#fff',
                filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.5))',
              }}
            >
              WORLD CUP <span className="text-green-500">'26</span>
            </h1>
            <h2 className="text-xl md:text-2xl font-bold text-gray-300 uppercase tracking-widest flex items-center gap-3 justify-center lg:justify-start mt-4">
              <FaGlobe className="text-blue-500" /> Global 5-a-side Clash
            </h2>
            <motion.div
              className="h-1 w-24 bg-gradient-to-r from-yellow-500 to-amber-400 rounded-full mt-5 mx-auto lg:mx-0"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              style={{ transformOrigin: 'left' }}
            />
          </motion.div>

          <motion.div
            className="bg-gray-900/60 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 mb-8 text-left relative overflow-hidden group shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {/* Animated gleam */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent w-[200%] -translate-x-full pointer-events-none"
              animate={{ translateX: ['-100%', '200%'] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            />
            
            <p className="text-gray-300 text-sm leading-relaxed font-medium relative z-10">
              Registrations are now open for the ultimate <strong className="text-white text-base">48-team tournament</strong>. Represent your chosen nation, compete in the UEFA format group stages, and win massive cash prizes + social rewards!
            </p>
            
            <div className="mt-5 flex flex-col gap-3 relative z-10">
              <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-gray-800 pb-2">
                <span>Start Date</span>
                <span className="text-green-400 flex items-center gap-1.5"><FaBolt /> 29 May 2026</span>
              </div>
              <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-gray-800 pb-2">
                <span>Reg. Fee</span>
                <span className="text-yellow-400">ZAR 3,000</span>
              </div>
            </div>
            
            <Link href="/tournament" className="mt-6 w-full flex items-center justify-center gap-2 py-3.5 bg-green-600 hover:bg-green-500 text-white font-black uppercase tracking-widest text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(22,163,74,0.4)] hover:shadow-[0_0_30px_rgba(34,197,94,0.6)] relative z-10 cursor-pointer">
              <FaTicketAlt /> Secure Your Team Spot
            </Link>
          </motion.div>
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

              {/* Social Login Providers */}
              <div className="mb-4">
                <motion.button
                  onClick={() => handleProviderSignIn('google')}
                  disabled={googleLoading}
                  className="w-full flex items-center justify-center gap-3 py-4 bg-white text-gray-900 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-gray-100 transition-all shadow-xl shadow-green-950/20 disabled:opacity-50 text-center"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaGoogle className="text-red-500 text-xl" />
                  Continue with Google
                </motion.button>
              </div>

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

              <div className="relative mb-8">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-800/40" /></div>
                <div className="relative flex justify-center">
                  <span className="bg-gray-900/70 px-3 text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">
                    Enterprise Security Gate
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-6 rounded-2xl bg-gray-800/20 border border-gray-700/40 backdrop-blur-xl relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <FaShieldAlt className="text-green-500 mx-auto mb-4 text-3xl" />
                  <h3 className="text-white text-sm font-black uppercase tracking-widest mb-2 text-center">Verified Identities Only</h3>
                  <p className="text-gray-500 text-[11px] leading-relaxed text-center font-medium">
                    To ensure the integrity of Squad Management and Tournament registration, all accounts must be linked to a verified Google presence.
                  </p>
                </div>
                
                <div className="p-4 flex items-center gap-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
                  <motion.div 
                    animate={{ scale: [1, 1.1, 1] }} 
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <FaBolt className="text-amber-500" size={16} />
                  </motion.div>
                  <p className="text-amber-200/70 text-[10px] uppercase font-bold tracking-wider">
                    Guest browsing is available via the link above.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
