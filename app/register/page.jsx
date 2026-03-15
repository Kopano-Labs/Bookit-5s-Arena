'use client';

import { useState, useRef } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ReCAPTCHA from 'react-google-recaptcha';
import { FaUser, FaGoogle, FaShieldAlt, FaEnvelope, FaLock, FaUserPlus, FaFutbol } from 'react-icons/fa';
import ArenaBackground from '@/components/ArenaBackground';
import { motion, AnimatePresence } from 'framer-motion';

const RegisterPage = () => {
  const router = useRouter();
  const recaptchaRef = useRef(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    await signIn('google', { callbackUrl: '/' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (!recaptchaToken) { setError('Please complete the "I\'m not a robot" check.'); return; }

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
    if (result?.error) { setError(result.error); }
    else { router.push('/'); router.refresh(); }
  };

  const inputClass = (field) =>
    `block w-full px-4 py-3.5 bg-gray-800/50 border rounded-xl text-white text-sm focus:ring-2 focus:ring-green-500/50 focus:border-green-600/50 outline-none transition-all placeholder-gray-600 backdrop-blur-sm ${
      focusedField === field ? 'border-green-600/50' : 'border-gray-700/50'
    }`;

  return (
    <div className="min-h-screen flex items-center justify-center py-16 px-4 relative overflow-hidden">
      <ArenaBackground />

      {/* Background title watermark */}
      <motion.div
        className="absolute top-[6%] left-1/2 -translate-x-1/2 text-center pointer-events-none select-none z-0"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
          <h2 className="text-6xl md:text-8xl font-black uppercase tracking-[0.2em] opacity-[0.04]" style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}>
            5S ARENA
          </h2>
        </motion.div>
      </motion.div>

      {/* ── Card ── */}
      <motion.div
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="bg-gray-900/80 backdrop-blur-xl shadow-2xl rounded-3xl p-8 border border-gray-700/50 relative overflow-hidden">

          {/* Decorative corner */}
          <div className="absolute top-0 right-0 w-32 h-32 pointer-events-none">
            <div className="absolute top-0 right-0 w-full h-full" style={{ background: 'radial-gradient(circle at 100% 0%, rgba(34,197,94,0.1) 0%, transparent 70%)' }} />
          </div>

          {/* Header */}
          <motion.div className="text-center mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
              style={{ background: 'linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)', boxShadow: '0 0 40px rgba(16,185,129,0.4)' }}
              whileHover={{ scale: 1.1, rotate: -5 }}
              animate={{ boxShadow: ['0 0 30px rgba(16,185,129,0.3)', '0 0 50px rgba(16,185,129,0.5)', '0 0 30px rgba(16,185,129,0.3)'] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <FaUserPlus className="text-white text-2xl" />
            </motion.div>
            <h1 className="text-3xl font-black uppercase tracking-tight text-white" style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}>
              Create Account
            </h1>
            <p className="text-gray-500 text-sm mt-1">Join 5s Arena today</p>
          </motion.div>

          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="mb-5 p-3 bg-red-950/50 border border-red-800/50 rounded-xl text-red-400 text-sm backdrop-blur-sm">{error}</motion.div>
            )}
          </AnimatePresence>

          {/* Google */}
          <div className="mb-6">
            <motion.button onClick={handleGoogleSignIn} disabled={googleLoading}
              className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-gray-800/60 border border-gray-700/50 rounded-xl text-sm font-semibold text-gray-200 hover:border-green-600/40 hover:bg-gray-800 hover:text-white transition-all disabled:opacity-50 backdrop-blur-sm cursor-pointer"
              whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}>
              <FaGoogle className="text-red-400 text-base" />
              {googleLoading ? 'Redirecting...' : 'Continue with Google'}
            </motion.button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-800/50" /></div>
            <div className="relative flex justify-center"><span className="bg-gray-900/80 px-3 text-gray-600 text-xs uppercase tracking-widest">or register with email</span></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.div animate={focusedField === 'name' ? { scale: 1.02 } : { scale: 1 }} transition={{ type: 'spring', stiffness: 400 }}>
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest flex items-center gap-1.5"><FaUser size={10} className="text-green-500" /> Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required onFocus={() => setFocusedField('name')} onBlur={() => setFocusedField(null)} className={inputClass('name')} placeholder="John Doe" />
            </motion.div>
            <motion.div animate={focusedField === 'email' ? { scale: 1.02 } : { scale: 1 }} transition={{ type: 'spring', stiffness: 400 }}>
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest flex items-center gap-1.5"><FaEnvelope size={10} className="text-green-500" /> Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)} className={inputClass('email')} placeholder="you@example.com" />
            </motion.div>
            <motion.div animate={focusedField === 'password' ? { scale: 1.02 } : { scale: 1 }} transition={{ type: 'spring', stiffness: 400 }}>
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest flex items-center gap-1.5"><FaLock size={10} className="text-green-500" /> Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required onFocus={() => setFocusedField('password')} onBlur={() => setFocusedField(null)} className={inputClass('password')} placeholder="Min. 6 characters" />
            </motion.div>
            <motion.div animate={focusedField === 'confirm' ? { scale: 1.02 } : { scale: 1 }} transition={{ type: 'spring', stiffness: 400 }}>
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest flex items-center gap-1.5"><FaLock size={10} className="text-green-500" /> Confirm Password</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required onFocus={() => setFocusedField('confirm')} onBlur={() => setFocusedField(null)} className={inputClass('confirm')} placeholder="Repeat your password" />
            </motion.div>

            {/* reCAPTCHA */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FaShieldAlt className="text-green-500" size={13} />
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Security Verification</span>
              </div>
              <div className={`rounded-xl border-2 p-3 transition-all flex justify-center backdrop-blur-sm ${recaptchaToken ? 'border-green-600/50 bg-green-900/10' : 'border-gray-700/50 bg-gray-800/30'}`}>
                {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY !== 'your_site_key_here' ? (
                  <ReCAPTCHA ref={recaptchaRef} sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY} onChange={(token) => setRecaptchaToken(token || '')} onExpired={() => setRecaptchaToken('')} theme="dark" />
                ) : (
                  <div className="text-center py-3">
                    <p className="text-xs text-amber-500 font-semibold">reCAPTCHA keys not configured yet</p>
                    <p className="text-xs text-gray-600 mt-1">Add NEXT_PUBLIC_RECAPTCHA_SITE_KEY to .env.local</p>
                    <button type="button" onClick={() => setRecaptchaToken('dev-bypass')} className="mt-2 text-xs text-green-500 underline cursor-pointer">[Dev] Skip verification</button>
                  </div>
                )}
              </div>
              {recaptchaToken && <p className="text-green-500 text-xs mt-1.5 flex items-center gap-1 font-medium">Verification complete</p>}
            </div>

            <motion.button
              type="submit" disabled={loading || !recaptchaToken}
              className="w-full py-4 px-4 rounded-xl text-sm font-black text-white uppercase tracking-widest transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-2 relative overflow-hidden cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)', backgroundSize: '200% 200%' }}
              animate={{ backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'], boxShadow: ['0 0 20px rgba(16,185,129,0.3)', '0 0 40px rgba(16,185,129,0.5)', '0 0 20px rgba(16,185,129,0.3)'] }}
              transition={{ duration: 4, repeat: Infinity }}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            >
              <motion.div className="absolute inset-0" style={{ background: 'linear-gradient(110deg, transparent 25%, rgba(255,255,255,0.1) 50%, transparent 75%)', backgroundSize: '200% 100%' }} animate={{ backgroundPosition: ['-100% 0', '200% 0'] }} transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1 }} />
              <span className="relative z-10">{loading ? 'Creating account...' : 'Create Account'}</span>
            </motion.button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link href="/login" className="font-bold text-green-400 hover:text-green-300 transition-colors">Sign in here</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
