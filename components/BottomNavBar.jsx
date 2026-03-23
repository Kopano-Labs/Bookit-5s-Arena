'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  FaFutbol, FaCalendarAlt, FaTrophy, FaBookOpen,
  FaStar, FaUser, FaTachometerAlt, FaChartBar,
  FaListAlt, FaEnvelope, FaPaintBrush
} from 'react-icons/fa';

const USER_ITEMS = [
  { icon: FaFutbol, label: 'Courts', href: '/#courts', color: '#22c55e' },
  { icon: FaCalendarAlt, label: 'Events', href: '/events-and-services', color: '#3b82f6' },
  { icon: FaTrophy, label: 'Tournament', href: '/tournament', color: '#eab308' },
  { icon: FaBookOpen, label: 'Rules', href: '/rules-of-the-game', color: '#f97316' },
  { icon: FaStar, label: 'Rewards', href: '/rewards', color: '#a855f7' },
  { icon: FaUser, label: 'Profile', href: '/profile', color: '#06b6d4' },
  { icon: FaPaintBrush, label: 'Creator', href: '/creator', color: '#ec4899' },
];

const ADMIN_ITEMS = [
  { icon: FaTachometerAlt, label: 'Dashboard', href: '/admin/dashboard', color: '#a855f7' },
  { icon: FaListAlt, label: 'Manage', href: '/admin/bookings', color: '#14b8a6' },
  { icon: FaChartBar, label: 'Analytics', href: '/admin/analytics', color: '#f59e0b' },
  { icon: FaEnvelope, label: 'Newsletter', href: '/admin/newsletter', color: '#f43f5e' },
  { icon: FaFutbol, label: 'Add Court', href: '/courts/add', color: '#22c55e' },
  { icon: FaTrophy, label: 'Add League', href: '/leagues/add', color: '#eab308' },
];

export default function BottomNavBar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const isAdmin = session?.user?.role === 'admin';

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Hide on mobile — too small
  if (isMobile) return null;

  const items = isAdmin ? ADMIN_ITEMS : USER_ITEMS;

  const navigate = (href) => {
    setIsExpanded(false);
    if (href.startsWith('/#')) {
      window.location.href = href;
    } else {
      router.push(href);
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-gray-900/95 backdrop-blur-xl border border-gray-700 rounded-2xl p-3 shadow-[0_8px_60px_rgba(0,0,0,0.5)]"
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <div className="flex items-end gap-2">
              {items.map((item, i) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <motion.button
                    key={item.href}
                    onClick={() => navigate(item.href)}
                    className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all cursor-pointer"
                    style={{
                      background: isActive ? `${item.color}20` : 'transparent',
                      borderBottom: isActive ? `2px solid ${item.color}` : '2px solid transparent',
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04, type: 'spring', stiffness: 400 }}
                    whileHover={{
                      scale: 1.3,
                      y: -8,
                      transition: { type: 'spring', stiffness: 500, damping: 15 },
                    }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Icon size={22} style={{ color: item.color }} />
                    <span className="text-gray-400 text-[8px] font-bold uppercase tracking-wider">
                      {item.label}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main trigger button */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-14 h-14 rounded-full bg-green-600 border-2 border-green-400 flex items-center justify-center text-white shadow-lg cursor-pointer"
        style={{ boxShadow: '0 0 25px rgba(34,197,94,0.5)' }}
        animate={{
          y: [0, -4, 0],
          rotate: isExpanded ? 180 : [0, 5, -5, 3, -3, 0],
          boxShadow: isExpanded
            ? '0 0 30px rgba(34,197,94,0.7)'
            : ['0 0 20px rgba(34,197,94,0.4)', '0 0 30px rgba(34,197,94,0.6)', '0 0 20px rgba(34,197,94,0.4)'],
        }}
        transition={{
          y: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
          rotate: { duration: isExpanded ? 0.3 : 4, repeat: isExpanded ? 0 : Infinity, ease: 'easeInOut' },
          boxShadow: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Navigation menu"
      >
        <FaFutbol size={20} />
      </motion.button>
    </div>
  );
}
