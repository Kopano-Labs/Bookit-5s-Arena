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
  FaPaintBrush, FaBolt,
} from 'react-icons/fa';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import SearchModal from '@/components/SearchModal';

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
  const isManager = session?.user?.role === 'manager';

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
    const base = 'flex items-center gap-1.5 px-3 py-2 text-[10px] font-bold rounded-lg transition-all uppercase tracking-widest whitespace-nowrap';
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

  /* ── Interface Tabs Definitions ── */
  const publicTabs = [
    { href: '/#courts',  icon: <FaFutbol size={11} className="text-green-400" />,     label: 'Book Court' },
    { href: '/events-and-services', icon: <FaBolt size={11} className="text-cyan-400" />, label: 'Events' },
    { href: '/tournament', icon: <FaTrophy size={11} className="text-yellow-400" />,   label: 'Tournament' },
  ];

  const userTabs = [
    { href: '/fixtures', icon: <FaTv size={11} className="text-blue-400" />,         label: 'Fixtures' },
    { href: '/rules-of-the-game', icon: <FaBookOpen size={11} className="text-orange-400" />, label: 'Rules' },
    { href: '/bookings', icon: <FaBolt size={11} className="text-cyan-400" />, label: 'My Bookings' },
    { href: '/rewards',  icon: <FaStar size={11} className="text-yellow-400" />,      label: 'Rewards' },
    { href: '/creator',  icon: <FaPaintBrush size={11} className="text-pink-400" />, label: 'Creator' },
  ];

  const managerTabs = [
    { href: '/leagues', icon: <FaTrophy size={11} className="text-yellow-400" />,   label: 'Competitions' },
    { href: '/rewards', icon: <FaStar size={11} className="text-blue-400" />,         label: 'Rewards' },
    { href: '/manager/squad', icon: <FaUser size={11} className="text-green-400" />,  label: 'Squad' },
  ];

  const adminTabs = [
    { href: '/admin/dashboard',  icon: <FaTachometerAlt size={11} className="text-purple-400" />, label: 'Dashboard' },
    { href: '/admin/bookings',   icon: <FaListAlt size={11} className="text-teal-400" />,         label: 'Manage' },
    { href: '/admin/newsletter', icon: <FaEnvelope size={11} className="text-rose-400" />,         label: 'Newsletter' },
    { href: '/admin/analytics',  icon: <FaChartBar size={11} className="text-amber-400" />,        label: 'Analytics' },
  ];

  const dashboardDropdownItems = [
    { href: '/courts/add',        icon: <FaFutbol size={12} className="text-green-400" />,       label: '+ Add Court' },
    { href: '/events/add',        icon: <FaGlassCheers size={12} className="text-pink-400" />,   label: '+ Add Events' },
    { href: '/admin/newsletter',  icon: <FaNewspaper size={12} className="text-rose-400" />,     label: '+ Add Newsletter' },
    { href: '/leagues/add',       icon: <FaTrophy size={12} className="text-yellow-400" />,      label: '+ Add League' },
    { href: '/tournament',         icon: <FaTrophy size={12} className="text-green-400" />,       label: '+ Add Tournament' },
  ];

  return (
    <header className="bg-gray-950/95 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50 shadow-[0_2px_20px_rgba(0,0,0,0.6)]">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* ── Logo Container (Centered Content) ── */}
          <Link href="/#about" className="flex items-center gap-3 group flex-shrink-0">
            <motion.div
              className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-green-500 shadow-[0_0_14px_rgba(34,197,94,0.45)] flex items-center justify-center"
              whileHover={{ scale: 1.12, boxShadow: '0 0 22px rgba(34,197,94,0.75)', rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                boxShadow: ['0 0 14px rgba(34,197,94,0.45)', '0 0 20px rgba(34,197,94,0.65)', '0 0 14px rgba(34,197,94,0.45)'],
              }}
              transition={{ boxShadow: { duration: 2, repeat: Infinity, ease: 'easeInOut' } }}
            >
              <Image src="/images/logo.png" alt="5s Arena" fill sizes="44px" className="object-cover" priority />
            </motion.div>
            <span
              className="hidden sm:block font-black text-white uppercase leading-tight text-sm tracking-widest"
              style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}
            >
              5S<br /><span className="text-green-400">ARENA</span>
            </span>
          </Link>

          {/* ── Desktop Nav (Role-Based Separation) ── */}
          <div className="hidden md:flex items-center gap-0.5 justify-center flex-1 mx-4">
             {/* Search Hub */}
             <SearchModal />

             {/* GUEST: Public Tabs ONLY */}
             {!session && publicTabs.map((tab) => (
                <Link key={tab.href} href={tab.href} className={navClass(tab.href)}>
                  <NavIcon>{tab.icon}</NavIcon> {tab.label}
                </Link>
              ))}

             {/* USER: Public + User Tabs */}
             {session && !isAdmin && !isManager && (
               <>
                 {publicTabs.map((tab) => (
                    <Link key={tab.href} href={tab.href} className={navClass(tab.href)}>
                      <NavIcon>{tab.icon}</NavIcon> {tab.label}
                    </Link>
                  ))}
                  {userTabs.map((tab) => (
                    <Link key={tab.href} href={tab.href} className={navClass(tab.href)}>
                      <NavIcon>{tab.icon}</NavIcon> {tab.label}
                    </Link>
                  ))}
               </>
             )}

             {/* MANAGER: Manager Tabs ONLY */}
             {session && isManager && managerTabs.map((tab) => (
                <Link key={tab.href} href={tab.href} className={navClass(tab.href)}>
                  <NavIcon>{tab.icon}</NavIcon> {tab.label}
                </Link>
              ))}

             {/* ADMIN: Admin Tabs ONLY + God-Mode Dropdown */}
             {session && isAdmin && (
               <>
                 {adminTabs.map((tab) => (
                    <Link key={tab.href} href={tab.href} className={navClass(tab.href)}>
                      <NavIcon>{tab.icon}</NavIcon> {tab.label}
                    </Link>
                  ))}
                  
                  {/* God-Mode Quick Actions */}
                  <div className="relative" ref={dropdownRef}>
                    <motion.button
                      onClick={() => setDashboardOpen(!dashboardOpen)}
                      className="flex items-center gap-1.5 px-3 py-2 text-[10px] font-bold text-green-400 hover:text-white hover:bg-green-700/20 rounded-lg transition-all uppercase tracking-widest border border-green-500/20 ml-2"
                      whileHover={{ scale: 1.05, backgroundColor: 'rgba(34,197,94,0.1)' }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaPlus size={10} /> God-Mode
                    </motion.button>
                    <AnimatePresence>
                      {dashboardOpen && (
                        <motion.div
                          className="absolute right-0 top-full mt-2 w-60 bg-gray-950 border border-green-500/30 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden z-[60] backdrop-blur-xl"
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        >
                           <div className="px-4 py-3 bg-green-500/10 border-b border-green-500/20">
                             <p className="text-[10px] text-green-400 uppercase tracking-widest font-black">⚡ Dispatch Center</p>
                           </div>
                           <div className="p-2 grid grid-cols-1 gap-1">
                             {dashboardDropdownItems.map((item) => (
                               <Link key={item.href} href={item.href} onClick={() => setDashboardOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-xs text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-all group">
                                 <span className="group-hover:scale-125 transition-transform">{item.icon}</span>
                                 <span className="font-bold uppercase tracking-widest">{item.label}</span>
                               </Link>
                             ))}
                           </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
               </>
             )}
          </div>

          {/* ── Actions (Profile, Logout, Mobile Toggle) ── */}
          <div className="flex items-center gap-3">
            {session ? (
              <div className="flex items-center gap-3">
                <Link href="/profile" className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-gray-800 transition-all border border-transparent hover:border-gray-800">
                   <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-green-500">
                     {session.user.image ? (
                        <Image src={session.user.image} alt="Profile" fill className="object-cover" />
                     ) : (
                        <div className="w-full h-full bg-green-600 flex items-center justify-center text-white text-[10px] font-black">{session.user.name?.[0] || 'U'}</div>
                     )}
                   </div>
                   <div className="hidden lg:block text-left leading-none">
                     <p className="text-white text-[10px] font-black uppercase tracking-widest">{session.user.name?.split(' ')[0]}</p>
                     <p className="text-green-500 text-[9px] font-bold uppercase">{session.user.role || 'Player'}</p>
                   </div>
                </Link>
                <motion.button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaSignOutAlt size={14} />
                </motion.button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="px-4 py-2 text-[10px] font-bold text-gray-400 hover:text-white uppercase tracking-widest">In</Link>
                <Link href="/register" className="px-5 py-2 text-[10px] font-black text-white bg-green-600 rounded-lg shadow-[0_0_12px_rgba(34,197,94,0.4)] uppercase tracking-widest">Join</Link>
              </div>
            )}

            {/* Mobile Toggle */}
            <motion.button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg" whileTap={{ scale: 0.85 }}>
              {mobileOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
            </motion.button>
          </div>
        </div>
      </nav>

      {/* ── Mobile Sidebar (Strict Role-Based) ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="md:hidden bg-gray-950 border-t border-gray-800 px-4 py-6 space-y-2 overflow-y-auto max-h-[calc(100vh-64px)] shadow-2xl"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
             {!session && publicTabs.map(tab => (
               <Link key={tab.href} href={tab.href} onClick={() => setMobileOpen(false)} className={mobileClass(tab.href)}>
                 {tab.icon} {tab.label}
               </Link>
             ))}
             {session && !isAdmin && !isManager && [...publicTabs, ...userTabs].map(tab => (
               <Link key={tab.href} href={tab.href} onClick={() => setMobileOpen(false)} className={mobileClass(tab.href)}>
                 {tab.icon} {tab.label}
               </Link>
             ))}
             {session && isManager && managerTabs.map(tab => (
               <Link key={tab.href} href={tab.href} onClick={() => setMobileOpen(false)} className={mobileClass(tab.href)}>
                 {tab.icon} {tab.label}
               </Link>
             ))}
             {session && isAdmin && adminTabs.map(tab => (
               <Link key={tab.href} href={tab.href} onClick={() => setMobileOpen(false)} className={mobileClass(tab.href)}>
                 {tab.icon} {tab.label}
               </Link>
             ))}
             {session && (
               <div className="pt-4 border-t border-gray-800 mt-4">
                 <button onClick={() => signOut({ callbackUrl: '/' })} className="w-full text-left px-3 py-3 text-sm font-black text-red-500 uppercase tracking-widest flex items-center gap-2">
                   <FaSignOutAlt size={14} /> Log Out
                 </button>
               </div>
             )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
