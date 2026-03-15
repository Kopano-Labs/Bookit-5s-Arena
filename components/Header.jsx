'use client';

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaUser, FaSignOutAlt, FaSignInAlt, FaCalendarAlt,
  FaBars, FaTimes, FaUserEdit, FaEnvelope, FaChartBar,
  FaFutbol, FaTachometerAlt, FaListAlt, FaBookOpen,
  FaGlassCheers, FaTrophy, FaStar, FaTv,
  FaPlus, FaChevronDown, FaNewspaper,
} from 'react-icons/fa';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';

/* ── Animated nav icon wrapper ── */
const NavIcon = ({ children }) => (
  <motion.span
    className="inline-flex"
    whileHover={{ scale: 1.3, rotate: 12, transition: { type: 'spring', stiffness: 400, damping: 10 } }}
    whileTap={{ scale: 0.7, rotate: -20, transition: { duration: 0.1 } }}
  >
    {children}
  </motion.span>
);

const Header = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isAdmin = session?.user?.role === 'admin';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDashboardOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navClass = (href) => {
    const base = 'flex items-center gap-1.5 px-3 py-2 text-[10px] font-bold rounded-lg transition-all uppercase tracking-widest';
    const active = pathname === href || (href !== '/' && href !== '/#courts' && pathname?.startsWith(href))
      ? 'text-white bg-gray-800 border-b-2 border-green-500 shadow-[0_2px_8px_rgba(34,197,94,0.25)]'
      : 'text-gray-400 hover:text-white hover:bg-gray-800';
    return `${base} ${active}`;
  };

  const mobileClass = (href) => {
    const active = pathname === href || (href !== '/' && href !== '/#courts' && pathname?.startsWith(href));
    return `flex items-center gap-2.5 px-3 py-3 text-sm font-bold rounded-xl uppercase tracking-widest transition-all ${
      active
        ? 'text-white bg-gray-800 border-l-2 border-green-500'
        : 'text-gray-300 hover:text-white hover:bg-gray-800'
    }`;
  };

  /* ── Public tabs — shown to regular users only ── */
  const publicTabs = [
    { href: '/fixtures', icon: <FaTv size={11} className="text-blue-400" />,         label: 'Fixtures' },
    { href: '/leagues',  icon: <FaTrophy size={11} className="text-yellow-400" />,   label: 'Leagues' },
    { href: '/rules',    icon: <FaBookOpen size={11} className="text-orange-400" />, label: 'Rules' },
    { href: '/bookings', icon: <FaCalendarAlt size={11} className="text-cyan-400" />, label: 'Bookings' },
    { href: '/rewards',  icon: <FaStar size={11} className="text-yellow-400" />,      label: 'Rewards' },
  ];

  /* ── Auth tabs (user-only) ── */
  const userTabs = [
  ];

  /* ── Admin tabs ── */
  const adminTabs = [
    { href: '/admin/dashboard',  icon: <FaTachometerAlt size={11} className="text-purple-400" />, label: 'Dashboard' },
    { href: '/admin/bookings',   icon: <FaListAlt size={11} className="text-teal-400" />,         label: 'Manage' },
    { href: '/admin/newsletter', icon: <FaEnvelope size={11} className="text-rose-400" />,         label: 'Newsletter' },
    { href: '/admin/analytics',  icon: <FaChartBar size={11} className="text-amber-400" />,        label: 'Analytics' },
  ];

  /* ── Admin Dashboard Dropdown Items ── */
  const dashboardDropdownItems = [
    { href: '/courts/add',        icon: <FaFutbol size={12} className="text-green-400" />,       label: '+ Add Court' },
    { href: '/events/add',        icon: <FaGlassCheers size={12} className="text-pink-400" />,   label: '+ Add Events' },
    { href: '/admin/newsletter',  icon: <FaNewspaper size={12} className="text-rose-400" />,     label: '+ Add Newsletter' },
    { href: '/leagues/add',       icon: <FaTrophy size={12} className="text-yellow-400" />,      label: '+ Add League' },
  ];

  return (
    <header className="bg-gray-950 border-b border-gray-800 sticky top-0 z-50 shadow-[0_2px_20px_rgba(0,0,0,0.6)]">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <motion.div
              className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-green-500 shadow-[0_0_14px_rgba(34,197,94,0.45)]"
              whileHover={{ scale: 1.12, boxShadow: '0 0 22px rgba(34,197,94,0.75)' }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Image src="/images/logo.jpg" alt="5s Arena" fill sizes="44px" className="object-cover" priority />
            </motion.div>
            <span
              className="hidden sm:block font-black text-white uppercase leading-tight text-sm tracking-widest"
              style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}
            >
              5S<br /><span className="text-green-400">ARENA</span>
            </span>
          </Link>

          {/* ── Desktop Nav ── */}
          <div className="hidden md:flex items-center gap-0.5">
            {/* Public tabs — HIDDEN for admin, shown for regular users */}
            {!isAdmin && publicTabs.map((tab) => (
              <Link key={tab.href} href={tab.href} className={navClass(tab.href)}>
                <NavIcon>{tab.icon}</NavIcon> {tab.label}
              </Link>
            ))}

            {/* Auth tabs */}
            {session && (
              <>
                {userTabs
                  .filter((t) => !(t.hideAdmin && isAdmin))
                  .map((tab) => (
                    <Link key={tab.href} href={tab.href} className={navClass(tab.href)}>
                      <NavIcon>{tab.icon}</NavIcon> {tab.label}
                    </Link>
                  ))}

                {/* Admin tabs + Dashboard Dropdown */}
                {isAdmin && (
                  <>
                    {adminTabs.map((tab) => (
                      <Link key={tab.href} href={tab.href} className={navClass(tab.href)}>
                        <NavIcon>{tab.icon}</NavIcon> {tab.label}
                      </Link>
                    ))}

                    {/* Dashboard Dropdown replacing +Add Court */}
                    <div className="relative" ref={dropdownRef}>
                      <motion.button
                        onClick={() => setDashboardOpen(!dashboardOpen)}
                        className="flex items-center gap-1.5 px-3 py-2 text-[10px] font-bold text-green-400 hover:text-white hover:bg-green-700 rounded-lg transition-all uppercase tracking-widest"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaPlus size={10} /> Dashboard
                        <motion.span
                          animate={{ rotate: dashboardOpen ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <FaChevronDown size={8} />
                        </motion.span>
                      </motion.button>

                      <AnimatePresence>
                        {dashboardOpen && (
                          <motion.div
                            className="absolute right-0 top-full mt-2 w-56 bg-gray-900 border border-gray-700 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] overflow-hidden z-50"
                            initial={{ opacity: 0, y: -8, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -8, scale: 0.95 }}
                            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                          >
                            <div className="px-4 py-2.5 border-b border-gray-800">
                              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Quick Actions</p>
                            </div>
                            {dashboardDropdownItems.map((item, i) => (
                              <motion.div
                                key={item.href}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                              >
                                <Link
                                  href={item.href}
                                  onClick={() => setDashboardOpen(false)}
                                  className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition-all"
                                >
                                  {item.icon}
                                  <span className="font-semibold text-xs uppercase tracking-widest">{item.label}</span>
                                </Link>
                              </motion.div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </>
                )}
              </>
            )}
          </div>

          {/* ── Auth Controls ── */}
          <div className="flex items-center gap-2">
            {session ? (
              <>
                <Link
                  href="/profile"
                  className="hidden md:flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-gray-800 transition-all group border border-transparent hover:border-gray-700"
                >
                  {session.user.image ? (
                    <motion.div
                      className="w-8 h-8 rounded-full overflow-hidden border-2 border-green-500 flex-shrink-0 shadow-[0_0_10px_rgba(34,197,94,0.3)]"
                      whileHover={{ scale: 1.1 }}
                    >
                      <img src={session.user.image} alt={session.user.name || 'Profile'} className="w-full h-full object-cover" />
                    </motion.div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white text-xs font-black shadow-inner border border-green-500 flex-shrink-0">
                      {session.user.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                  )}
                  <div className="hidden lg:block text-left leading-tight">
                    <p className="text-white text-xs font-bold">{session.user.name?.split(' ')[0]}</p>
                    <p className="text-green-400 text-[10px] uppercase tracking-widest">
                      {session.user.username ? `@${session.user.username}` : 'Profile'}
                    </p>
                  </div>
                </Link>
                <motion.button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="hidden md:flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-gray-400 hover:text-white hover:bg-green-700 rounded-lg transition-all uppercase tracking-widest"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaSignOutAlt size={12} /> Out
                </motion.button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden md:flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all uppercase tracking-widest"
                >
                  <FaSignInAlt size={12} /> Login
                </Link>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/register"
                    className="hidden md:flex items-center gap-1.5 px-5 py-2 text-xs font-black text-white bg-green-600 hover:bg-green-500 rounded-lg transition-all uppercase tracking-widest shadow-[0_0_12px_rgba(34,197,94,0.4)] hover:shadow-[0_0_20px_rgba(34,197,94,0.7)]"
                  >
                    <FaUser size={11} /> Register
                  </Link>
                </motion.div>
              </>
            )}

            {/* Mobile toggle */}
            <motion.button
              className="md:hidden p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
              whileTap={{ scale: 0.85, rotate: 90 }}
            >
              {mobileOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
            </motion.button>
          </div>
        </div>
      </nav>

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="md:hidden bg-gray-900 border-t border-gray-800 px-4 pb-5 pt-3 space-y-1 overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            {/* Mobile user identity strip */}
            {session && (
              <div className="flex items-center gap-3 px-3 py-3 mb-1 border-b border-gray-800">
                {session.user.image ? (
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-green-500 flex-shrink-0">
                    <img src={session.user.image} alt={session.user.name || 'Profile'} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white text-sm font-black border border-green-500 flex-shrink-0">
                    {session.user.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                )}
                <div>
                  <p className="text-white text-sm font-bold">{session.user.name}</p>
                  {session.user.username && (
                    <p className="text-green-400 text-xs font-mono">@{session.user.username}</p>
                  )}
                </div>
              </div>
            )}

            {/* Public tabs — HIDDEN for admin on mobile too */}
            {!isAdmin && publicTabs.map((tab, i) => (
              <motion.div
                key={tab.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Link href={tab.href} onClick={() => setMobileOpen(false)} className={mobileClass(tab.href)}>
                  {tab.icon} {tab.label}
                </Link>
              </motion.div>
            ))}

            {session ? (
              <>
                {userTabs
                  .filter((t) => !(t.hideAdmin && isAdmin))
                  .map((tab, i) => (
                    <motion.div
                      key={tab.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (isAdmin ? 0 : publicTabs.length + i) * 0.04 }}
                    >
                      <Link href={tab.href} onClick={() => setMobileOpen(false)} className={mobileClass(tab.href)}>
                        {tab.icon} {tab.label}
                      </Link>
                    </motion.div>
                  ))}
                <Link href="/profile" onClick={() => setMobileOpen(false)} className={mobileClass('/profile')}>
                  <FaUserEdit className="text-emerald-400" size={13} /> Edit Profile
                </Link>
                {isAdmin && (
                  <>
                    {adminTabs.map((tab) => (
                      <Link key={tab.href} href={tab.href} onClick={() => setMobileOpen(false)} className={mobileClass(tab.href)}>
                        {tab.icon} {tab.label}
                      </Link>
                    ))}
                    {/* Mobile Dashboard dropdown items */}
                    <div className="mt-2 pt-2 border-t border-gray-800">
                      <p className="px-3 py-1.5 text-[10px] text-gray-500 uppercase tracking-widest font-bold">Quick Actions</p>
                      {dashboardDropdownItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-3 text-sm font-bold text-green-400 hover:text-white hover:bg-green-700 rounded-xl transition-all"
                        >
                          {item.icon} {item.label}
                        </Link>
                      ))}
                    </div>
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
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
