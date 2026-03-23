'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { FaFutbol, FaCalendarAlt, FaTrophy, FaTimes } from 'react-icons/fa';

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
    label: 'Tournament',
    href: '/tournament',
    color: '#eab308',
    desc: 'Register your team',
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
    <div className="fixed bottom-24 right-6 z-40">
      {/* Expanded menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute bottom-16 right-0 flex flex-col gap-2 mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {MENU_ITEMS.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.button
                  key={item.href}
                  onClick={() => navigate(item.href)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-900/95 backdrop-blur-xl border border-gray-700 shadow-lg cursor-pointer whitespace-nowrap"
                  initial={{ opacity: 0, x: 20, scale: 0.8 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 20, scale: 0.8 }}
                  transition={{ delay: (MENU_ITEMS.length - i) * 0.06, type: 'spring', stiffness: 300, damping: 20 }}
                  whileHover={{
                    scale: 1.05,
                    borderColor: item.color,
                    boxShadow: `0 0 20px ${item.color}30`,
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: `${item.color}20` }}
                  >
                    <Icon size={14} style={{ color: item.color }} />
                  </div>
                  <div className="text-left">
                    <p className="text-white text-xs font-bold">{item.label}</p>
                    <p className="text-gray-500 text-[10px]">{item.desc}</p>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* "Book Now" text on hover */}
      <AnimatePresence>
        {isHovered && !isOpen && (
          <motion.div
            className="absolute -top-8 left-1/2 -translate-x-1/2 bg-green-600 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-lg whitespace-nowrap"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
          >
            Book Now
          </motion.div>
        )}
      </AnimatePresence>

      {/* Soccer ball button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="w-14 h-14 rounded-full flex items-center justify-center text-white cursor-pointer border-2"
        style={{
          background: isOpen
            ? 'linear-gradient(135deg, #dc2626, #b91c1c)'
            : 'linear-gradient(135deg, #15803d, #22c55e)',
          borderColor: isOpen ? '#f87171' : '#4ade80',
          boxShadow: isOpen
            ? '0 0 20px rgba(239,68,68,0.4)'
            : '0 0 20px rgba(34,197,94,0.4)',
        }}
        animate={
          isOpen
            ? { rotate: 90 }
            : {
                y: [0, -6, 0],
                boxShadow: [
                  '0 0 15px rgba(34,197,94,0.3)',
                  '0 0 25px rgba(34,197,94,0.6)',
                  '0 0 15px rgba(34,197,94,0.3)',
                ],
              }
        }
        transition={
          isOpen
            ? { duration: 0.3 }
            : { y: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' }, boxShadow: { duration: 2, repeat: Infinity } }
        }
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label={isOpen ? 'Close menu' : 'Quick booking'}
      >
        {isOpen ? <FaTimes size={18} /> : <FaFutbol size={20} />}
      </motion.button>
    </div>
  );
}
