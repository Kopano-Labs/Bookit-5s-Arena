'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaUserEdit, FaLock, FaEnvelope, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';

const ProfilePage = () => {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNew, setConfirmNew] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isOAuthUser, setIsOAuthUser] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

  // Load profile data
  useEffect(() => {
    const loadProfile = async () => {
      const res = await fetch('/api/profile');
      if (res.ok) {
        const data = await res.json();
        setName(data.name || '');
        setEmail(data.email || '');
        // OAuth users won't have a password
        setIsOAuthUser(!session?.user?.email?.includes('@') || data.role === 'oauth');
      }
    };
    if (status === 'authenticated') loadProfile();
  }, [status, session]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-green-400 text-xl animate-pulse">Loading...</div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword && newPassword !== confirmNew) {
      setError('New passwords do not match.');
      return;
    }
    if (newPassword && newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, currentPassword: currentPassword || undefined, newPassword: newPassword || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Something went wrong.');
      } else {
        setSuccess(data.message);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNew('');
        // Update session name
        await update({ name });
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 py-16 px-4">
      <div className="max-w-lg mx-auto">

        {/* Back link */}
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-green-400 text-sm mb-8 transition-colors uppercase tracking-wide">
          <FaArrowLeft size={12} /> Back to Home
        </Link>

        {/* Card */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden shadow-2xl">

          {/* Header strip */}
          <div className="bg-gray-800 px-8 py-6 border-b border-gray-700 flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-green-600 flex items-center justify-center text-white text-2xl font-black shadow-inner border-2 border-green-400">
              {name?.[0]?.toUpperCase() || '?'}
            </div>
            <div>
              <h1 className="text-white font-black text-xl uppercase tracking-wide" style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}>
                Edit Profile
              </h1>
              <p className="text-gray-400 text-sm mt-0.5">{email}</p>
            </div>
            <FaUserEdit className="ml-auto text-green-400" size={22} />
          </div>

          <div className="px-8 py-7">
            {error && (
              <div className="mb-5 p-3 bg-red-950 border border-red-800 rounded-xl text-red-400 text-sm">{error}</div>
            )}
            {success && (
              <div className="mb-5 p-3 bg-green-950 border border-green-800 rounded-xl text-green-400 text-sm flex items-center gap-2">
                <FaCheckCircle /> {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wide">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="block w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all placeholder-gray-500"
                  placeholder="Your full name"
                />
              </div>

              {/* Email (read-only) */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wide flex items-center gap-1.5">
                  <FaEnvelope size={12} /> Email Address
                  <span className="text-gray-600 font-normal normal-case tracking-normal text-xs ml-1">(cannot be changed)</span>
                </label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="block w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-gray-500 text-sm cursor-not-allowed"
                />
              </div>

              {/* Divider */}
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-700" /></div>
                <div className="relative flex justify-center">
                  <span className="bg-gray-900 px-3 text-gray-500 text-xs uppercase tracking-widest flex items-center gap-1.5">
                    <FaLock size={10} /> Change Password <span className="text-gray-600">(optional)</span>
                  </span>
                </div>
              </div>

              {/* Current password */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wide">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="block w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all placeholder-gray-500"
                  placeholder="Leave blank to keep current password"
                />
              </div>

              {/* New password */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wide">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="block w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all placeholder-gray-500"
                  placeholder="Min. 6 characters"
                />
              </div>

              {/* Confirm new password */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wide">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmNew}
                  onChange={(e) => setConfirmNew(e.target.value)}
                  className="block w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all placeholder-gray-500"
                  placeholder="Repeat new password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl text-sm font-black text-white bg-green-600 hover:bg-green-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)]"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>

        <p className="text-center text-gray-600 text-xs mt-6">
          Need help?{' '}
          <a href="https://wa.me/27637820245" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-400">
            WhatsApp us
          </a>
        </p>
      </div>
    </div>
  );
};

export default ProfilePage;
