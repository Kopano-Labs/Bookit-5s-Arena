'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { FaCalendarAlt, FaTrophy, FaTimes, FaPen, FaFutbol } from 'react-icons/fa';

const MENU_ITEMS = [
  {
    icon: FaFutbol,
    label: 'Book a Court',
    href: '/#courts',
    color: '#22c55e',
    desc: 'Reserve your pitch',
  },
  {
    icon: FaCalendarAlt,
    label: 'Book an Event',
    href: '/events-and-services',
    color: '#3b82f6',
    desc: 'Birthdays, corporate',
  },
  {
    icon: FaTrophy,
    label: 'Competitions',
    href: '/leagues',
    color: '#eab308',
    desc: 'Leagues & Tournament',
  },
];

export default function SoccerBallMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  const navigate = (href) => {
    setIsOpen(false);
    if (href.startsWith('/#')) {
      window.location.href = href;
    } else {
      router.push(href);
    }
  };

  return (
    <div className="fixed left-0 top-1/2 -translate-y-1/2 z-[100]">
      {/* Expanded menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute left-14 top-1/2 -translate-y-1/2 flex flex-col gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {MENU_ITEMS.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.button
                  key={item.href}
                  onClick={() => navigate(item.href)}
                  className="flex items-center gap-4 px-5 py-4 rounded-xl bg-gray-950/90 backdrop-blur-2xl border border-gray-800 shadow-[0_10px_40px_rgba(0,0,0,0.8)] cursor-pointer whitespace-nowrap"
                  initial={{ opacity: 0, x: -20, scale: 0.8 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -20, scale: 0.8 }}
                  transition={{ delay: i * 0.05, type: 'spring', stiffness: 300, damping: 20 }}
                  whileHover={{
                    scale: 1.05,
                    borderColor: item.color,
                    boxShadow: `0 0 30px ${item.color}40`,
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `${item.color}20` }}
                  >
                    <Icon size={18} style={{ color: item.color }} />
                  </div>
                  <div className="text-left">
                    <p className="text-white text-sm font-black uppercase tracking-widest">{item.label}</p>
                    <p className="text-gray-500 text-[10px] uppercase font-bold tracking-wider">{item.desc}</p>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main trigger button — FIXED RECTANGLE ON LEFT EDGE */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="w-14 h-20 rounded-r-2xl flex items-center justify-center text-white cursor-pointer border-2 border-l-0"
        style={{
          background: isOpen
            ? 'linear-gradient(135deg, #ef4444, #b91c1c)'
            : 'linear-gradient(135deg, #22c55e, #15803d)',
          borderColor: isOpen ? '#fca5a5' : '#4ade80',
          boxShadow: isOpen
            ? '0 0 30px rgba(239,68,68,0.5)'
            : '0 0 30px rgba(34,197,94,0.5)',
        }}
        animate={
          isOpen
            ? { x: 0 }
            : {
                x: [0, 8, 0],
                boxShadow: [
                  '0 0 15px rgba(34,197,94,0.3)',
                  '0 0 30px rgba(34,197,94,0.6)',
                  '0 0 15px rgba(34,197,94,0.3)',
                ],
              }
        }
        transition={
          isOpen
            ? { duration: 0.3 }
            : { x: { duration: 3, repeat: Infinity, ease: 'easeInOut' }, boxShadow: { duration: 2, repeat: Infinity, ease: 'easeInOut' } }
        }
        whileHover={{ scale: 1.05, x: 5 }}
        whileTap={{ scale: 0.9 }}
        aria-label={isOpen ? 'Close menu' : 'Quick booking'}
      >
        <div className="flex flex-col items-center gap-1">
          {isOpen ? <FaTimes size={20} /> : <FaPen size={20} />}
          {!isOpen && <span className="text-[8px] font-black uppercase tracking-tighter">BOOK</span>}
        </div>
      </motion.button>
    </div>
  );
}
