'use client';

import { useState, useMemo } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaUser, FaGoogle, FaFacebook, FaShieldAlt } from 'react-icons/fa';
import ArenaBackground from '@/components/ArenaBackground';

// ── Captcha helpers ──────────────────────────────────────────────────────────
const GRID_EMOJIS = ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏉', '🎱', '🏓'];

const makeCaptchaGrid = () =>
  [...GRID_EMOJIS].sort(() => Math.random() - 0.5);

// ── Component ────────────────────────────────────────────────────────────────
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

  // Captcha state
  const [captchaGrid, setCaptchaGrid] = useState(() => makeCaptchaGrid());
  const [selected, setSelected] = useState(new Set());
  const [captchaPassed, setCaptchaPassed] = useState(false);
  const [captchaError, setCaptchaError] = useState('');

  const footballIndices = useMemo(
    () => captchaGrid.reduce((acc, e, i) => (e === '⚽' ? [...acc, i] : acc), []),
    [captchaGrid]
  );

  const toggleCell = (i) => {
    if (captchaPassed) return;
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
    setCaptchaError('');
  };

  const verifyCaptcha = () => {
    const correct =
      footballIndices.length === selected.size &&
      footballIndices.every((i) => selected.has(i));
    if (correct) {
      setCaptchaPassed(true);
      setCaptchaError('');
    } else {
      setCaptchaError('Incorrect — please try again.');
      setSelected(new Set());
      setCaptchaGrid(makeCaptchaGrid());
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!captchaPassed) {
      setError('Please complete the security check first.');
      return;
    }
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

  return (
    <div className="min-h-screen flex items-center justify-center py-16 px-4 relative overflow-hidden">

      <ArenaBackground />

      {/* ── Card ── */}
      <div className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-2xl rounded-2xl p-8 border border-white/20">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gray-900 rounded-full mb-4 shadow-lg">
            <FaUser className="text-green-400 text-xl" />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-gray-900" style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}>
            Create Account
          </h1>
          <p className="text-gray-500 text-sm mt-1">Join 5s Arena today</p>
        </div>

        {error && (
          <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>
        )}

        {/* Social signup */}
        <div className="space-y-3 mb-6">
          <button onClick={handleGoogleSignIn} disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50 shadow-sm">
            <FaGoogle className="text-red-500 text-base" />
            {googleLoading ? 'Redirecting...' : 'Continue with Google'}
          </button>
          <button onClick={handleFacebookSignIn} disabled={facebookLoading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50 shadow-sm"
            style={{ backgroundColor: '#1877F2' }}>
            <FaFacebook className="text-white text-base" />
            {facebookLoading ? 'Redirecting...' : 'Continue with Facebook'}
          </button>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-3 text-gray-400 text-xs uppercase tracking-widest">or register with email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
              className="block w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              placeholder="John Doe" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              className="block w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
              className="block w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              placeholder="Min. 6 characters" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required
              className="block w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              placeholder="Repeat your password" />
          </div>

          {/* ── Image Captcha ── */}
          <div className={`rounded-xl border-2 p-4 transition-all ${captchaPassed ? 'border-green-400 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
            <div className="flex items-center gap-2 mb-3">
              <FaShieldAlt className={captchaPassed ? 'text-green-500' : 'text-gray-400'} size={14} />
              <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">
                {captchaPassed ? '✅ Verified — you\'re human!' : 'Security check — click all ⚽ footballs'}
              </p>
            </div>
            {!captchaPassed && (
              <>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {captchaGrid.map((emoji, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => toggleCell(i)}
                      className={`aspect-square rounded-xl text-3xl flex items-center justify-center transition-all duration-150 border-2 select-none
                        ${selected.has(i)
                          ? 'border-green-500 bg-green-100 shadow-[0_0_10px_rgba(34,197,94,0.4)] scale-95'
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-100'
                        }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
                {captchaError && (
                  <p className="text-red-500 text-xs mb-2 text-center font-medium">{captchaError}</p>
                )}
                <button
                  type="button"
                  onClick={verifyCaptcha}
                  disabled={selected.size === 0}
                  className="w-full py-2 text-xs font-bold uppercase tracking-widest bg-gray-900 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-40"
                >
                  Verify Selection
                </button>
              </>
            )}
          </div>

          <button type="submit" disabled={loading || !captchaPassed}
            className="w-full py-3 px-4 rounded-xl text-sm font-bold text-white bg-gray-900 hover:bg-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-1">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link href="/login" className="font-bold text-green-600 hover:text-green-500">Sign in here</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
