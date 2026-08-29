'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaFutbol, FaArrowRight, FaMapMarkedAlt } from 'react-icons/fa';
import Link from 'next/link';
import { WELCOME_POPUP_STORAGE_KEY } from '@/lib/popupPreferences';

export default function WelcomePopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    const hidden = localStorage.getItem(WELCOME_POPUP_STORAGE_KEY);
    if (!hidden) {
      const timer = setTimeout(() => setIsVisible(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    if (dontShowAgain) {
      localStorage.setItem(WELCOME_POPUP_STORAGE_KEY, '1');
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/80 p-4 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-gray-800 bg-gray-900 p-6 shadow-2xl sm:p-8"
            initial={{ scale: 0.9, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 30, opacity: 1 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/2 rounded-full bg-yellow-600/10 blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 -translate-x-1/2 translate-y-1/2 rounded-full bg-green-500/10 blur-3xl" />

            <button
              onClick={handleClose}
              aria-label="Close welcome dialog"
              className="absolute right-3 top-3 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-gray-800/90 text-gray-300 shadow-md transition active:scale-95 hover:bg-gray-700 hover:text-white"
            >
              <FaTimes size={18} />
            </button>

            <div className="relative z-10 text-center">
              <span className="rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-green-400">
                Dumela & Welcome to Cape Town 5s
              </span>
              <h2
                className="mb-2 mt-3 text-3xl font-black uppercase tracking-widest text-white"
                style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}
              >
                PLAY AT <span className="text-yellow-500">5S ARENA</span>
              </h2>
              <p className="mx-auto mb-8 max-w-md text-sm leading-6 text-gray-300">
                Floodlit synthetic 5-a-side football at Hellenic FC, Milnerton. Build your squad, check 3D pitches, and experience South Africa&apos;s finest community football.
              </p>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Link href="/#pitches" onClick={handleClose}>
                  <motion.div
                    className="group flex h-full cursor-pointer flex-col items-center justify-center rounded-2xl border border-gray-700 bg-gray-800/50 p-6 transition-all hover:border-gray-500 hover:bg-gray-800"
                    whileHover={{ scale: 1.03, y: -5 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-900/30 text-green-400 transition-transform group-hover:scale-110">
                      <FaFutbol size={28} />
                    </div>
                    <h3 className="mb-2 text-lg font-bold uppercase tracking-wider text-white">
                      3D Pitches & Booking
                    </h3>
                    <p className="mb-4 text-xs leading-5 text-gray-400">
                      Explore our 4 floodlit courts in 3D and verify slots.
                    </p>
                    <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-green-400 transition-transform group-hover:translate-x-1">
                      View 3D pitches <FaArrowRight />
                    </span>
                  </motion.div>
                </Link>

                <Link href="/#tactics" onClick={handleClose}>
                  <motion.div
                    className="group flex h-full cursor-pointer flex-col items-center justify-center rounded-2xl border border-blue-700/30 bg-blue-900/20 p-6 transition-all hover:border-blue-500/50 hover:bg-blue-900/35"
                    whileHover={{ scale: 1.03, y: -5 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10 text-blue-300 transition-transform group-hover:scale-110">
                      <FaMapMarkedAlt size={28} />
                    </div>
                    <h3 className="mb-2 text-lg font-bold uppercase tracking-wider text-white">
                      5v5 Tactics Lab
                    </h3>
                    <p className="mb-4 text-xs leading-5 text-gray-400">
                      Pick your starting 5 formation and export team cards.
                    </p>
                    <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-blue-300 transition-transform group-hover:translate-x-1">
                      Open tactics lab <FaArrowRight />
                    </span>
                  </motion.div>
                </Link>
              </div>

              <div className="mt-6 flex flex-col items-center gap-3">
                <button
                  onClick={handleClose}
                  className="cursor-pointer text-xs font-bold uppercase tracking-widest text-gray-400 transition-colors hover:text-white"
                >
                  Enter the Arena ➔
                </button>

                <label className="group flex cursor-pointer select-none items-center gap-2">
                  <input
                    type="checkbox"
                    checked={dontShowAgain}
                    onChange={(event) => setDontShowAgain(event.target.checked)}
                    className="h-4 w-4 accent-yellow-600"
                  />
                  <span className="text-[10px] uppercase tracking-wider text-gray-500 transition-colors group-hover:text-gray-400">
                    Don&apos;t show this again
                  </span>
                </label>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
