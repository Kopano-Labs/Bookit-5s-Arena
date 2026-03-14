'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  FaUserEdit, FaLock, FaEnvelope, FaArrowLeft, FaCheckCircle,
  FaCamera, FaAt, FaBell, FaBellSlash,
} from 'react-icons/fa';

const ProfilePage = () => {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [newsletterOptIn, setNewsletterOptIn] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNew, setConfirmNew] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

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
        setUsername(data.username || '');
        setNewsletterOptIn(data.newsletterOptIn || false);
        setAvatarUrl(data.image || '');
      }
    };
    if (status === 'authenticated') loadProfile();
  }, [status]);

  // Handle avatar file selection
  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview immediately
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target.result);
    reader.readAsDataURL(file);

    // Upload to server
    setUploadLoading(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/profile/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Upload failed.');
        setAvatarPreview('');
      } else {
        setAvatarUrl(data.imageUrl);
        setSuccess('Profile picture updated!');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch {
      setError('Upload failed. Please try again.');
    } finally {
      setUploadLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-green-400 text-xl animate-pulse">Loading...</div>
      </div>
    );
  }

  const displayAvatar = avatarPreview || avatarUrl;

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
    if (username && !/^[a-z0-9_]{3,30}$/.test(username)) {
      setError('Username: 3–30 chars, lowercase letters / numbers / underscores only.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          username: username.trim(),
          newsletterOptIn,
          currentPassword: currentPassword || undefined,
          newPassword: newPassword || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Something went wrong.');
      } else {
        setSuccess(data.message);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNew('');
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

          {/* ── Header strip with avatar ── */}
          <div className="bg-gray-800 px-8 py-6 border-b border-gray-700">
            <div className="flex items-center gap-5">

              {/* Clickable avatar */}
              <div
                className="relative flex-shrink-0 cursor-pointer group"
                onClick={() => fileInputRef.current?.click()}
                title="Click to change photo"
              >
                {displayAvatar ? (
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.4)]">
                    <img
                      src={displayAvatar}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-full bg-green-700 flex items-center justify-center text-white text-3xl font-black border-2 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.4)]">
                    {name?.[0]?.toUpperCase() || '?'}
                  </div>
                )}
                {/* Camera overlay on hover */}
                <div className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  {uploadLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <FaCamera className="text-white text-xl" />
                  )}
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />

              <div className="flex-1 min-w-0">
                <h1 className="text-white font-black text-xl uppercase tracking-wide" style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}>
                  Edit Profile
                </h1>
                <p className="text-gray-400 text-sm mt-0.5 truncate">{email}</p>
                {username && (
                  <p className="text-green-400 text-xs mt-0.5 font-mono">@{username}</p>
                )}
              </div>
              <FaUserEdit className="flex-shrink-0 text-green-400" size={22} />
            </div>
            <p className="text-gray-500 text-xs mt-3">Click your photo to upload a new one (max 3 MB)</p>
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

              {/* Full Name */}
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

              {/* Username */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wide flex items-center gap-1.5">
                  <FaAt size={11} /> Username
                  <span className="text-gray-600 font-normal normal-case tracking-normal text-xs ml-1">(your public handle)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-green-400 text-sm font-bold pointer-events-none">@</span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    className="block w-full pl-9 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all placeholder-gray-500 font-mono"
                    placeholder="your_handle"
                    minLength={3}
                    maxLength={30}
                  />
                </div>
                <p className="text-gray-600 text-xs mt-1">3–30 characters. Letters, numbers and underscores only.</p>
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

              {/* Password change divider */}
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

              {/* Newsletter opt-in divider */}
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-700" /></div>
                <div className="relative flex justify-center">
                  <span className="bg-gray-900 px-3 text-gray-500 text-xs uppercase tracking-widest">Communications</span>
                </div>
              </div>

              {/* Newsletter toggle */}
              <div
                className="flex items-center justify-between bg-gray-800 border border-gray-700 rounded-xl px-5 py-4 cursor-pointer hover:border-green-700 transition-colors"
                onClick={() => setNewsletterOptIn((v) => !v)}
              >
                <div className="flex items-center gap-3">
                  {newsletterOptIn ? (
                    <FaBell className="text-green-400 text-lg flex-shrink-0" />
                  ) : (
                    <FaBellSlash className="text-gray-500 text-lg flex-shrink-0" />
                  )}
                  <div>
                    <p className="text-white text-sm font-semibold">Newsletter &amp; Promotions</p>
                    <p className="text-gray-500 text-xs mt-0.5">
                      {newsletterOptIn
                        ? "You'll receive offers, fixtures & arena news."
                        : 'Subscribe to get deals, fixtures & arena news.'}
                    </p>
                  </div>
                </div>
                {/* Toggle pill */}
                <div
                  className="relative flex-shrink-0 w-12 h-6 rounded-full transition-colors duration-300"
                  style={{ background: newsletterOptIn ? '#16a34a' : '#374151' }}
                >
                  <div
                    className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300"
                    style={{ left: newsletterOptIn ? '26px' : '2px' }}
                  />
                </div>
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
