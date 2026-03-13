'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaUser, FaGoogle, FaFacebook, FaApple } from 'react-icons/fa';

const RegisterPage = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [facebookLoading, setFacebookLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);

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

    setLoading(true);

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || 'Something went wrong.');
      setLoading(false);
      return;
    }

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

  const handleAppleSignIn = async () => {
    setAppleLoading(true);
    await signIn('apple', { callbackUrl: '/' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-16 px-4 relative overflow-hidden bg-gray-950">

      {/* ── Animated background ── */}
      <div className="fixed inset-0 -z-10 overflow-hidden bg-gray-950">
        {/* Orb 1 */}
        <div
          className="absolute rounded-full"
          style={{
            top: '5%', left: '10%',
            width: '600px', height: '600px',
            background: 'radial-gradient(circle, rgba(34,197,94,0.28) 0%, transparent 70%)',
            animation: 'authFloat1 9s ease-in-out infinite',
          }}
        />
        {/* Orb 2 */}
        <div
          className="absolute rounded-full"
          style={{
            bottom: '0%', right: '5%',
            width: '500px', height: '500px',
            background: 'radial-gradient(circle, rgba(16,185,129,0.22) 0%, transparent 70%)',
            animation: 'authFloat2 13s ease-in-out infinite',
          }}
        />
        {/* Orb 3 */}
        <div
          className="absolute rounded-full"
          style={{
            top: '40%', right: '20%',
            width: '380px', height: '380px',
            background: 'radial-gradient(circle, rgba(74,222,128,0.14) 0%, transparent 70%)',
            animation: 'authFloat3 16s ease-in-out infinite',
          }}
        />
        {/* Subtle football grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* ── Card ── */}
      <div className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-2xl rounded-2xl p-8 border border-white/20">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gray-900 rounded-full mb-4 shadow-lg">
            <FaUser className="text-green-400 text-xl" />
          </div>
          <h1
            className="text-3xl font-black uppercase tracking-tight text-gray-900"
            style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}
          >
            Create Account
          </h1>
          <p className="text-gray-500 text-sm mt-1">Join 5s Arena today</p>
        </div>

        {error && (
          <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Social signup buttons */}
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
          <button
            onClick={handleAppleSignIn}
            disabled={appleLoading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-black hover:bg-gray-800 transition-all disabled:opacity-50 shadow-sm"
          >
            <FaApple className="text-white text-base" />
            {appleLoading ? 'Redirecting...' : 'Continue with Apple'}
          </button>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-3 text-gray-400 text-xs uppercase tracking-widest">or register with email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="block w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              placeholder="John Doe"
            />
          </div>
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
              placeholder="Min. 6 characters"
            />
          </div>
          <div>
            <label htmlFor="confirm_password" className="block text-sm font-semibold text-gray-700 mb-1.5">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirm_password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link href="/login" className="font-bold text-green-600 hover:text-green-500">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
