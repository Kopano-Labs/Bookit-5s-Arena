'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  FaUserEdit, FaEnvelope, FaArrowLeft, FaCheckCircle,
  FaCamera, FaAt,
  FaUser, FaLock, FaBell, FaBellSlash, FaTrophy, FaChevronDown, FaLink,
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import InfoTooltip from '@/components/InfoTooltip';

/* ─── Accordion section component ─── */
const AccordionSection = ({ id, icon: Icon, iconColor = 'text-green-400', title, summary, isOpen, onToggle, children }) => (
  <div
    className="bg-gray-900 border border-gray-800 rounded-2xl mb-3 overflow-hidden"
    style={{ borderLeft: `3px solid ${isOpen ? '#22c55e' : '#374151'}` }}
  >
    {/* Header */}
    <motion.button
      type="button"
      onClick={() => onToggle(id)}
      className="w-full flex items-center gap-3 px-5 py-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 rounded-2xl"
      whileHover={{ backgroundColor: 'rgba(31,41,55,0.6)' }}
      transition={{ duration: 0.15 }}
    >
      <Icon className={`flex-shrink-0 text-base ${iconColor}`} />
      <span className="flex-1 min-w-0">
        <span className="block text-white font-black text-xs uppercase tracking-widest">
          {title}
        </span>
        {!isOpen && summary && (
          <span className="block text-gray-500 text-xs mt-0.5 truncate">{summary}</span>
        )}
      </span>
      <motion.span
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="flex-shrink-0 text-gray-500"
      >
        <FaChevronDown size={12} />
      </motion.span>
    </motion.button>

    {/* Body */}
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          key="body"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          style={{ overflow: 'hidden' }}
        >
          <div className="px-5 pb-5 pt-1 space-y-4">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

/* ─── Input helper ─── */
const Field = ({ label, labelExtra, children, hint }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wide flex items-center gap-1.5 flex-wrap">
      {label}
      {labelExtra}
    </label>
    {children}
    {hint && <p className="text-gray-600 text-xs mt-1">{hint}</p>}
  </div>
);

const inputCls =
  'block w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all placeholder-gray-500';

/* ─── Page ─── */
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

  // Which accordion sections are open
  const [openSections, setOpenSections] = useState({ profile: true, security: false, comms: false, benefits: true });

  const toggleSection = (id) =>
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));

  // Redirect if unauthenticated
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

  // Avatar upload
  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target.result);
    reader.readAsDataURL(file);

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
    if (username && !/^[a-zA-Z0-9_]{3,30}$/.test(username)) {
      setError('Username: 3–30 chars, letters (upper or lower), numbers, underscores only.');
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
        await update({ name, username: username.trim(), image: avatarUrl || undefined });
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
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

  return (
    <div className="min-h-screen bg-gray-950 py-16 px-4">
      <div className="max-w-lg mx-auto">

        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-green-400 text-sm mb-8 transition-colors uppercase tracking-wide"
        >
          <FaArrowLeft size={12} /> Back to Home
        </Link>

        {/* Page header card — always visible */}
        <motion.div
          className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden shadow-2xl mb-4"
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="bg-gray-800 px-8 py-6 border-b border-gray-700">
            <div className="flex items-center gap-5">

              {/* Clickable avatar */}
              <motion.div
                className="relative flex-shrink-0 cursor-pointer group"
                onClick={() => fileInputRef.current?.click()}
                title="Click to change photo"
                whileHover={{ scale: 1.08 }}
                transition={{ duration: 0.2 }}
              >
                {displayAvatar ? (
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.4)]">
                    <img src={displayAvatar} alt="Profile" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-full bg-green-700 flex items-center justify-center text-white text-3xl font-black border-2 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.4)]">
                    {name?.[0]?.toUpperCase() || '?'}
                  </div>
                )}
                <div className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  {uploadLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <FaCamera className="text-white text-xl" />
                  )}
                </div>
              </motion.div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />

              <div className="flex-1 min-w-0">
                <h1
                  className="text-white font-black text-xl uppercase tracking-wide"
                  style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}
                >
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
        </motion.div>

        {/* Alerts — outside accordions */}
        <AnimatePresence>
          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mb-4 p-3 bg-red-950 border border-red-800 rounded-xl text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}
          {success && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mb-4 p-3 bg-green-950 border border-green-800 rounded-xl text-green-400 text-sm flex items-center gap-2"
            >
              <FaCheckCircle /> {success}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Form wrapping all accordions ── */}
        <form onSubmit={handleSubmit}>

          {/* 1. Profile Info */}
          <AccordionSection
            id="profile"
            icon={FaUser}
            iconColor="text-green-400"
            title="Profile Info"
            summary={name || username ? `${name}${username ? '  @' + username : ''}` : 'Update your details'}
            isOpen={openSections.profile}
            onToggle={toggleSection}
          >
            {/* Full Name */}
            <Field label="Full Name">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className={inputCls}
                placeholder="Your full name"
              />
            </Field>

            {/* Username */}
            <Field
              label={<><FaAt size={11} /> Username</>}
              labelExtra={
                <>
                  <span className="text-gray-600 font-normal normal-case tracking-normal text-xs ml-1">(your public handle)</span>
                  <InfoTooltip text="Your unique @handle shown on bookings and your profile. 3–30 characters. Letters, numbers and underscores only." position="right" />
                </>
              }
              hint="3–30 characters. Letters, numbers and underscores only."
            >
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-green-400 text-sm font-bold pointer-events-none">@</span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
                  className={`${inputCls} pl-9 font-mono`}
                  placeholder="YourHandle"
                  minLength={3}
                  maxLength={30}
                />
              </div>
            </Field>

            {/* Email (read-only) */}
            <Field
              label={<><FaEnvelope size={12} /> Email Address</>}
              labelExtra={
                <span className="text-gray-600 font-normal normal-case tracking-normal text-xs ml-1">(cannot be changed)</span>
              }
            >
              <input
                type="email"
                value={email}
                disabled
                className="block w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-gray-500 text-sm cursor-not-allowed"
              />
            </Field>
          </AccordionSection>

          {/* 2. Security */}
          <AccordionSection
            id="security"
            icon={FaLock}
            iconColor="text-yellow-400"
            title="Security"
            summary="Password protected"
            isOpen={openSections.security}
            onToggle={toggleSection}
          >
            <Field label="Current Password">
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className={inputCls}
                placeholder="Leave blank to keep current password"
              />
            </Field>

            <Field label="New Password">
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={inputCls}
                placeholder="Min. 6 characters"
              />
            </Field>

            <Field label="Confirm New Password">
              <input
                type="password"
                value={confirmNew}
                onChange={(e) => setConfirmNew(e.target.value)}
                className={inputCls}
                placeholder="Repeat new password"
              />
            </Field>
          </AccordionSection>

          {/* 3. Communications */}
          <AccordionSection
            id="comms"
            icon={newsletterOptIn ? FaBell : FaBellSlash}
            iconColor={newsletterOptIn ? 'text-green-400' : 'text-gray-500'}
            title="Communications"
            summary={
              newsletterOptIn ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-900/50 text-green-400 rounded-full text-[10px] font-semibold uppercase tracking-wide">
                  Subscribed
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-800 text-gray-500 rounded-full text-[10px] font-semibold uppercase tracking-wide">
                  Not subscribed
                </span>
              )
            }
            isOpen={openSections.comms}
            onToggle={toggleSection}
          >
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
          </AccordionSection>

          {/* 4. Member Benefits */}
          <AccordionSection
            id="benefits"
            icon={FaTrophy}
            iconColor="text-yellow-400"
            title="Member Benefits"
            summary="Your stats & perks"
            isOpen={openSections.benefits}
            onToggle={toggleSection}
          >
            {/* Stat cards */}
            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  label: 'Courts Booked',
                  icon: '⚽',
                  value: session?.user?.totalBookings ?? '—',
                  color: 'text-green-400',
                  tip: 'Total number of confirmed court bookings on your account.',
                },
                {
                  label: 'Hours Played',
                  icon: '⏱',
                  value: session?.user?.totalHours ? `${session.user.totalHours}h` : '—',
                  color: 'text-blue-400',
                  tip: 'Total hours booked across all your sessions.',
                },
                {
                  label: 'Loyalty Tier',
                  icon: '🏆',
                  value: session?.user?.loyaltyTier ?? 'Bronze',
                  color: 'text-yellow-400',
                  tip: 'Bronze → Silver → Gold → Diamond. Visit the Rewards page to see how to level up!',
                },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  whileHover={{ y: -2, scale: 1.02 }}
                  className="bg-gray-800 border border-gray-700 rounded-xl p-3 text-center"
                >
                  <p className="text-xl mb-1">{stat.icon}</p>
                  <p className={`text-sm font-black ${stat.color}`}>{stat.value}</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wide mt-0.5 flex items-center justify-center gap-1">
                    {stat.label} <InfoTooltip text={stat.tip} position="bottom" size={11} />
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Member Perks card */}
            <div className="bg-gradient-to-r from-green-900/30 to-gray-800/30 border border-green-800/40 rounded-xl p-4 text-sm">
              <p className="text-green-400 font-bold mb-1 flex items-center gap-2">
                <span>⭐</span> Member Perks — Active
                <InfoTooltip
                  text="These perks are active for all registered members. As you climb tiers, you'll unlock additional exclusive benefits on the Rewards page."
                  position="top"
                />
              </p>
              <ul className="text-gray-400 text-xs space-y-1">
                <li>✓ Priority court reservations</li>
                <li>✓ Booking reminders via email</li>
                <li>✓ Exclusive member-only promotions</li>
                <li>✓ 7-day advance booking window</li>
              </ul>
            </div>

            {/* View Full Rewards link */}
            <div className="flex justify-end">
              <Link
                href="/rewards"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-600/20 hover:bg-green-600/40 border border-green-700/50 text-green-400 text-xs font-bold uppercase tracking-wide rounded-full transition-colors"
              >
                <FaLink size={10} /> View Full Rewards
              </Link>
            </div>
          </AccordionSection>

          {/* Submit — outside accordions, full width */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02, boxShadow: '0 0 35px rgba(34,197,94,0.5)' }}
            whileTap={{ scale: 0.97 }}
            className="w-full mt-2 py-3.5 px-4 rounded-xl text-sm font-black text-white bg-green-600 hover:bg-green-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)]"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </motion.button>
        </form>

        <p className="text-center text-gray-600 text-xs mt-6">
          Need help?{' '}
          <a
            href="https://wa.me/27637820245"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 hover:text-green-400"
          >
            WhatsApp us
          </a>
        </p>
      </div>
    </div>
  );
};

export default ProfilePage;
