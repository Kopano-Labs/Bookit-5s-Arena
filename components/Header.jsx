'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from 'react';
import { FaUser, FaSignOutAlt, FaSignInAlt, FaCalendarAlt, FaBars, FaTimes, FaUserEdit } from 'react-icons/fa';
import { useSession, signOut } from 'next-auth/react';

const Header = () => {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-gray-950 border-b border-gray-800 sticky top-0 z-50 shadow-[0_2px_20px_rgba(0,0,0,0.6)]">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-green-500 group-hover:border-green-400 transition-all duration-300 shadow-[0_0_14px_rgba(34,197,94,0.45)] group-hover:shadow-[0_0_22px_rgba(34,197,94,0.75)]">
              <Image
                src="/images/logo.jpg"
                alt="5s Arena"
                fill
                sizes="44px"
                className="object-cover"
                priority
              />
            </div>
            <span
              className="hidden sm:block font-black text-white uppercase leading-tight text-sm tracking-widest"
              style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}
            >
              5S<br /><span className="text-green-400">ARENA</span>
            </span>
          </Link>

          {/* ── Desktop Nav ── */}
          <div className="hidden md:flex items-center gap-0.5">
            <Link href="/#courts" className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all uppercase tracking-widest">
              Courts
            </Link>
            {session && (
              <>
                <Link href="/bookings" className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all uppercase tracking-widest">
                  <FaCalendarAlt size={11} /> Bookings
                </Link>
                {session.user.role === 'admin' && (
                  <>
                    <Link href="/admin/dashboard" className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all uppercase tracking-widest">
                      Dashboard
                    </Link>
                    <Link href="/admin/bookings" className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all uppercase tracking-widest">
                      Manage
                    </Link>
                    <Link href="/courts/add" className="flex items-center gap-1 px-4 py-2 text-xs font-bold text-green-400 hover:text-white hover:bg-green-600 rounded-lg transition-all uppercase tracking-widest">
                      + Court
                    </Link>
                  </>
                )}
              </>
            )}
          </div>

          {/* ── Auth Controls ── */}
          <div className="flex items-center gap-2">
            {session ? (
              <>
                {/* Profile avatar button */}
                <Link
                  href="/profile"
                  className="hidden md:flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-gray-800 transition-all group border border-transparent hover:border-gray-700"
                >
                  <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white text-xs font-black shadow-inner border border-green-500">
                    {session.user.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div className="hidden lg:block text-left leading-tight">
                    <p className="text-white text-xs font-bold">{session.user.name?.split(' ')[0]}</p>
                    <p className="text-green-400 text-[10px] uppercase tracking-widest">Profile</p>
                  </div>
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="hidden md:flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-gray-500 hover:text-red-400 hover:bg-gray-800 rounded-lg transition-all uppercase tracking-widest"
                >
                  <FaSignOutAlt size={12} /> Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden md:flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all uppercase tracking-widest"
                >
                  <FaSignInAlt size={12} /> Login
                </Link>
                <Link
                  href="/register"
                  className="hidden md:flex items-center gap-1.5 px-5 py-2 text-xs font-black text-white bg-green-600 hover:bg-green-500 rounded-lg transition-all uppercase tracking-widest shadow-[0_0_12px_rgba(34,197,94,0.4)] hover:shadow-[0_0_20px_rgba(34,197,94,0.7)]"
                >
                  <FaUser size={11} /> Register
                </Link>
              </>
            )}

            {/* Mobile toggle */}
            <button
              className="md:hidden p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile Drawer ── */}
      {mobileOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-800 px-4 pb-5 pt-3 space-y-1">
          <Link href="/#courts" onClick={() => setMobileOpen(false)} className="block px-3 py-3 text-sm font-bold text-gray-300 hover:text-white hover:bg-gray-800 rounded-xl uppercase tracking-widest">
            Courts
          </Link>
          {session ? (
            <>
              <Link href="/bookings" onClick={() => setMobileOpen(false)} className="block px-3 py-3 text-sm font-bold text-gray-300 hover:text-white hover:bg-gray-800 rounded-xl uppercase tracking-widest">
                <FaCalendarAlt className="inline mr-2" size={13} />Bookings
              </Link>
              <Link href="/profile" onClick={() => setMobileOpen(false)} className="block px-3 py-3 text-sm font-bold text-gray-300 hover:text-white hover:bg-gray-800 rounded-xl uppercase tracking-widest">
                <FaUserEdit className="inline mr-2" size={13} />Edit Profile
              </Link>
              {session.user.role === 'admin' && (
                <>
                  <Link href="/admin/dashboard" onClick={() => setMobileOpen(false)} className="block px-3 py-3 text-sm font-bold text-gray-300 hover:text-white hover:bg-gray-800 rounded-xl">Dashboard</Link>
                  <Link href="/admin/bookings" onClick={() => setMobileOpen(false)} className="block px-3 py-3 text-sm font-bold text-gray-300 hover:text-white hover:bg-gray-800 rounded-xl">Manage Bookings</Link>
                  <Link href="/courts/add" onClick={() => setMobileOpen(false)} className="block px-3 py-3 text-sm font-bold text-green-400 hover:text-white hover:bg-green-600 rounded-xl">+ Add Court</Link>
                </>
              )}
              <button onClick={() => signOut({ callbackUrl: '/' })} className="w-full text-left px-3 py-3 text-sm font-bold text-red-400 hover:bg-gray-800 rounded-xl uppercase tracking-widest">
                <FaSignOutAlt className="inline mr-2" size={13} />Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setMobileOpen(false)} className="block px-3 py-3 text-sm font-bold text-gray-300 hover:text-white hover:bg-gray-800 rounded-xl uppercase tracking-widest">
                <FaSignInAlt className="inline mr-2" size={13} />Login
              </Link>
              <Link href="/register" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-sm font-black text-white bg-green-600 hover:bg-green-500 rounded-xl text-center uppercase tracking-widest">
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
