'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaSignInAlt, FaGoogle, FaUserSecret } from 'react-icons/fa';
import ArenaBackground from '@/components/ArenaBackground';
import { motion, AnimatePresence } from 'framer-motion';

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await signIn('credentials', { email, password, redirect: false });
    setLoading(false);
    if (result?.error) {
      setError(result.error);
    } else {
      router.push('/');
      router.refresh();
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    await signIn('google', { callbackUrl: '/' });
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
            <FaSignInAlt className="text-white text-xl" />
          </motion.div>
          <h1
            className="text-3xl font-black uppercase tracking-tight text-white"
            style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}
          >
            Sign In
          </h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back to 5s Arena</p>
        </div>

        {error && (
          <div className="mb-5 p-3 bg-red-950 border border-red-800 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Google button */}
        <div className="space-y-3 mb-6">
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

        {/* Guest access */}
        <div className="mb-4">
          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-gray-500 border border-dashed border-gray-700 hover:border-gray-600 hover:text-gray-400 transition-all"
          >
            <FaUserSecret className="text-base" />
            Browse as Guest
            <span className="ml-1 text-xs font-normal text-gray-600">(limited access)</span>
          </Link>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-800" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-gray-900 px-3 text-gray-600 text-xs uppercase tracking-widest">or sign in with email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={inputClass}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={inputClass}
              placeholder="••••••••"
            />
          </div>
          <motion.button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl text-sm font-black text-white uppercase tracking-widest transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-1"
            style={{
              background: 'linear-gradient(135deg, #15803d 0%, #22c55e 100%)',
              boxShadow: '0 0 25px rgba(34,197,94,0.35)',
            }}
            whileHover={{ scale: 1.02, boxShadow: '0 0 35px rgba(34,197,94,0.55)' }}
            whileTap={{ scale: 0.97 }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </motion.button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-bold text-green-500 hover:text-green-400">
            Register here
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
