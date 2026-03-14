'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaSignInAlt, FaGoogle, FaFacebook, FaUserSecret } from 'react-icons/fa';

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [facebookLoading, setFacebookLoading] = useState(false);

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

  const handleFacebookSignIn = async () => {
    setFacebookLoading(true);
    await signIn('facebook', { callbackUrl: '/' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-16 px-4 relative overflow-hidden">

      {/* ── Animated background ── */}
      <div className="fixed inset-0 -z-10 overflow-hidden bg-gray-950">
        {/* Ambient green glow */}
        <div
          className="absolute rounded-full"
          style={{
            top: '20%', left: '-10%',
            width: '700px', height: '700px',
            background: 'radial-gradient(circle, rgba(22,163,74,0.18) 0%, transparent 65%)',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            bottom: '-10%', right: '-5%',
            width: '600px', height: '600px',
            background: 'radial-gradient(circle, rgba(21,128,61,0.15) 0%, transparent 65%)',
          }}
        />

        {/* ONE massive football — green & black, rolls along the bottom */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: 0,
          fontSize: '420px',
          lineHeight: 1,
          userSelect: 'none',
          pointerEvents: 'none',
          filter: 'hue-rotate(110deg) saturate(18) brightness(0.78) drop-shadow(0 0 70px rgba(34,197,94,1)) drop-shadow(0 0 140px rgba(34,197,94,0.55))',
          animation: 'rollRightMassive 22s linear infinite',
          animationDelay: '0s',
        }}>⚽</div>
      </div>

      {/* ── Card ── */}
      <div className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-2xl rounded-2xl p-8 border border-white/20">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gray-900 rounded-full mb-4 shadow-lg">
            <FaSignInAlt className="text-green-400 text-xl" />
          </div>
          <h1
            className="text-3xl font-black uppercase tracking-tight text-gray-900"
            style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}
          >
            Sign In
          </h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back to 5s Arena</p>
        </div>

        {error && (
          <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Social login buttons */}
        <div className="space-y-3 mb-6">
          <button
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50 shadow-sm"
          >
            <FaGoogle className="text-red-500 text-base" />
            {googleLoading ? 'Redirecting...' : 'Continue with Google'}
          </button>
          <button
            onClick={handleFacebookSignIn}
            disabled={facebookLoading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50 shadow-sm"
            style={{ backgroundColor: '#1877F2' }}
          >
            <FaFacebook className="text-white text-base" />
            {facebookLoading ? 'Redirecting...' : 'Continue with Facebook'}
          </button>
        </div>

        {/* Guest access */}
        <div className="mb-4">
          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-gray-500 border border-dashed border-gray-300 hover:border-gray-400 hover:text-gray-700 transition-all"
          >
            <FaUserSecret className="text-base" />
            Browse as Guest
            <span className="ml-1 text-xs font-normal text-gray-400">(limited access)</span>
          </Link>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-3 text-gray-400 text-xs uppercase tracking-widest">or sign in with email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="block w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1.5">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="block w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl text-sm font-bold text-white bg-gray-900 hover:bg-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-1"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-bold text-green-600 hover:text-green-500">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
