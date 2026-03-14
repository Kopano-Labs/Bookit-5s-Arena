'use client';

import { useState, useRef } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ReCAPTCHA from 'react-google-recaptcha';
import { FaUser, FaGoogle, FaShieldAlt } from 'react-icons/fa';
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

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    await signIn('google', { callbackUrl: '/' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (!recaptchaToken) {
      setError('Please complete the "I\'m not a robot" check.');
      return;
    }

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

    // Auto sign-in after successful registration
    const result = await signIn('credentials', { email, password, redirect: false });
    setLoading(false);
    if (result?.error) {
      setError(result.error);
    } else {
      router.push('/');
      router.refresh();
    }
  };

  const inputClass =
    'block w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all placeholder-gray-500';

  return (
    <div className="min-h-screen flex items-center justify-center py-16 px-4 relative overflow-hidden">
      <ArenaBackground />

      {/* ── Card ── */}
      <motion.div
        className="w-full max-w-md bg-gray-900/95 backdrop-blur-sm shadow-2xl rounded-2xl p-8 border border-gray-800 relative z-10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      >

        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4 shadow-lg"
            style={{ background: 'linear-gradient(135deg, #15803d 0%, #22c55e 100%)', boxShadow: '0 0 30px rgba(34,197,94,0.4)' }}
            whileHover={{ scale: 1.1, rotate: -5 }}
          >
            <FaUser className="text-white text-xl" />
          </motion.div>
          <h1
            className="text-3xl font-black uppercase tracking-tight text-white"
            style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}
          >
            Create Account
          </h1>
          <p className="text-gray-500 text-sm mt-1">Join 5s Arena today</p>
        </div>

        {error && (
          <div className="mb-5 p-3 bg-red-950 border border-red-800 rounded-xl text-red-400 text-sm">{error}</div>
        )}

        {/* Google sign-up */}
        <div className="mb-6">
          <motion.button
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-gray-800 border border-gray-700 rounded-xl text-sm font-semibold text-gray-200 hover:border-gray-600 hover:text-white transition-all disabled:opacity-50 shadow-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaGoogle className="text-red-400 text-base" />
            {googleLoading ? 'Redirecting...' : 'Continue with Google'}
          </motion.button>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-800" /></div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-gray-900 px-3 text-gray-600 text-xs uppercase tracking-widest">or register with email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
              className={inputClass} placeholder="John Doe" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              className={inputClass} placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
              className={inputClass} placeholder="Min. 6 characters" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Confirm Password</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required
              className={inputClass} placeholder="Repeat your password" />
          </div>

          {/* ── Google reCAPTCHA v2 ── */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FaShieldAlt className="text-green-500" size={13} />
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Security Verification</span>
            </div>
            <div
              className={`rounded-xl border-2 p-3 transition-all flex justify-center ${
                recaptchaToken ? 'border-green-600 bg-green-900/20' : 'border-gray-700 bg-gray-800/50'
              }`}
            >
              {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY &&
              process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY !== 'your_site_key_here' ? (
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                  onChange={(token) => setRecaptchaToken(token || '')}
                  onExpired={() => setRecaptchaToken('')}
                  theme="dark"
                />
              ) : (
                <div className="text-center py-3">
                  <p className="text-xs text-amber-500 font-semibold">⚠️ reCAPTCHA keys not configured yet</p>
                  <p className="text-xs text-gray-600 mt-1">Add NEXT_PUBLIC_RECAPTCHA_SITE_KEY to .env.local</p>
                  <button
                    type="button"
                    onClick={() => setRecaptchaToken('dev-bypass')}
                    className="mt-2 text-xs text-green-500 underline"
                  >
                    [Dev] Skip verification
                  </button>
                </div>
              )}
            </div>
            {recaptchaToken && (
              <p className="text-green-500 text-xs mt-1.5 flex items-center gap-1 font-medium">
                ✅ Verification complete
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !recaptchaToken}
            className="w-full py-3.5 px-4 rounded-xl text-sm font-black text-white uppercase tracking-widest transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] mt-1"
            style={{
              background: 'linear-gradient(135deg, #15803d 0%, #22c55e 100%)',
              boxShadow: '0 0 25px rgba(34,197,94,0.35)',
            }}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="font-bold text-green-500 hover:text-green-400">Sign in here</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
