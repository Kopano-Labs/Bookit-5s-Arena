'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  FaBolt,
  FaChartBar,
  FaFutbol,
  FaGavel,
  FaNewspaper,
  FaPaintBrush,
  FaPlus,
  FaSearch,
  FaStar,
  FaTimes,
  FaTrophy,
  FaUser,
  FaUsers,
} from 'react-icons/fa';

const PAGES = [
  { name: 'Courts & Booking', href: '/#courts', icon: FaFutbol, category: 'Booking', auth: 'public' },
  { name: 'Events & Services', href: '/events-and-services', icon: FaBolt, category: 'Booking', auth: 'public' },
  { name: 'World Cup 2026 Archive', href: '/tournament', icon: FaTrophy, category: 'Competition', auth: 'public' },
  { name: 'Fixtures & Match Center', href: '/fixtures', icon: FaFutbol, category: 'Competition', auth: 'public' },
  { name: 'Competitions', href: '/leagues', icon: FaTrophy, category: 'Competition', auth: 'public' },
  { name: 'Rules of the Game', href: '/rules-of-the-game', icon: FaGavel, category: 'Info', auth: 'public' },
  { name: 'Football Playground', href: '/play', icon: FaFutbol, category: 'Info', auth: 'public' },
  { name: 'Rewards', href: '/rewards', icon: FaStar, category: 'Account', auth: 'user' },
  { name: 'My Bookings', href: '/bookings', icon: FaBolt, category: 'Account', auth: 'user' },
  { name: 'Profile Settings', href: '/profile', icon: FaUser, category: 'Account', auth: 'user' },
  { name: 'Arena Creator', href: '/creator', icon: FaPaintBrush, category: 'Info', auth: 'user' },
  { name: 'Squad Management', href: '/manager/squad', icon: FaUsers, category: 'Staff', auth: 'manager' },
  { name: 'Manager Rewards', href: '/rewards', icon: FaStar, category: 'Staff', auth: 'manager' },
  { name: 'Admin Dashboard', href: '/admin/dashboard', icon: FaChartBar, category: 'Admin', auth: 'admin' },
  { name: 'Add Event', href: '/events/add', icon: FaPlus, category: 'Admin', auth: 'admin' },
  { name: 'Add Newsletter', href: '/admin/newsletter', icon: FaNewspaper, category: 'Admin', auth: 'admin' },
  { name: 'Rights Management', href: '/admin/rights', icon: FaUser, category: 'Admin', auth: 'admin' },
];

export default function SearchModal() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const inputRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();

  const userRole = session?.user?.activeRole || session?.user?.role;
  const isAuthenticated = Boolean(session);
  const isAdmin = userRole === 'admin';
  const isManager = userRole === 'manager';
  const normalizedQuery = query.trim().toLowerCase();

  const results = PAGES.filter((page) => {
    if (page.auth === 'admin' && !isAdmin) return false;
    if (page.auth === 'manager' && !isManager && !isAdmin) return false;
    if (!isAuthenticated && page.auth !== 'public') return false;
    if (!normalizedQuery) return true;
    return page.name.toLowerCase().includes(normalizedQuery) || page.category.toLowerCase().includes(normalizedQuery);
  });

  const navigate = useCallback((href) => {
    setIsOpen(false);
    if (href.startsWith('/#')) window.location.href = href;
    else router.push(href);
  }, [router]);

  const handleKeyDown = useCallback((event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      setIsOpen((value) => !value);
      return;
    }
    if (!isOpen) return;
    if (event.key === 'Escape') {
      setIsOpen(false);
      return;
    }
    if (!results.length) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setHighlightedIndex((value) => (value + 1) % results.length);
      return;
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setHighlightedIndex((value) => (value - 1 + results.length) % results.length);
      return;
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      navigate(results[Math.min(highlightedIndex, results.length - 1)].href);
    }
  }, [highlightedIndex, isOpen, navigate, results]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 80);
    setQuery('');
    setHighlightedIndex(0);
    return () => window.clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    setHighlightedIndex(0);
  }, [query]);

  const categories = [...new Set(results.map((page) => page.category))];

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-lg border border-gray-700 bg-gray-800/60 px-3 text-sm text-gray-400 transition hover:border-green-500/40 hover:text-white"
        aria-label="Open site search"
      >
        <FaSearch size={12} />
        <span className="hidden md:inline">Search…</span>
        <kbd className="hidden rounded bg-gray-700 px-1.5 py-0.5 font-mono text-[10px] text-gray-500 md:inline">⌘K</kbd>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close search"
              className="fixed inset-0 z-[9998] cursor-default bg-black/65 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Site search"
              className="fixed left-1/2 top-[10%] z-[9999] w-[94vw] max-w-lg -translate-x-1/2 overflow-hidden rounded-2xl border border-gray-700 bg-gray-950 shadow-2xl sm:top-[15%]"
              initial={{ opacity: 0, y: -18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -18, scale: 0.96 }}
            >
              <div className="flex items-center gap-3 border-b border-gray-800 px-4 py-3">
                <FaSearch className="shrink-0 text-green-400" size={14} />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search pages…"
                  className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-gray-600"
                />
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-gray-800 bg-gray-900 text-gray-400 hover:text-white"
                  aria-label="Close search"
                >
                  <FaTimes size={13} />
                </button>
              </div>

              <div className="max-h-[65vh] overflow-y-auto p-2 sm:max-h-96">
                {results.length === 0 ? (
                  <p className="py-10 text-center text-sm text-gray-500">No matching pages.</p>
                ) : (
                  categories.map((category) => (
                    <div key={category} className="mb-2">
                      <p className="px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-green-500">{category}</p>
                      {results.filter((page) => page.category === category).map((page) => {
                        const Icon = page.icon;
                        const index = results.findIndex((item) => item.href === page.href && item.name === page.name);
                        const active = index === highlightedIndex;
                        return (
                          <button
                            key={`${page.category}-${page.name}`}
                            type="button"
                            onMouseEnter={() => setHighlightedIndex(index)}
                            onClick={() => navigate(page.href)}
                            className={`flex min-h-11 w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition ${active ? 'bg-green-600/10 text-white' : 'text-gray-300 hover:bg-gray-900 hover:text-white'}`}
                          >
                            <Icon className="shrink-0 text-green-400" size={14} />
                            {page.name}
                          </button>
                        );
                      })}
                    </div>
                  ))
                )}
              </div>

              <div className="flex items-center justify-between border-t border-gray-800 px-4 py-2 text-[10px] uppercase tracking-widest text-gray-600">
                <span>↑↓ navigate · ↵ open</span>
                <span>Esc closes</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
