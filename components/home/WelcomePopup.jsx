'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaFutbol, FaTrophy, FaUndo, FaArrowRight, FaGamepad, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import Link from 'next/link';
import { WELCOME_POPUP_STORAGE_KEY } from '@/lib/popupPreferences';

export default function WelcomePopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('game'); // 'game' | 'pitches'
  const [dontShowAgain, setDontShowAgain] = useState(false);
  
  // Game state
  const [shotState, setShotState] = useState('ready'); // 'ready', 'goal', 'miss', 'post'
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  useEffect(() => {
    const hidden = localStorage.getItem(WELCOME_POPUP_STORAGE_KEY);
    const savedBest = localStorage.getItem('fivesarena_best_streak');
    if (savedBest) setBestStreak(parseInt(savedBest, 10) || 0);

    if (!hidden) {
      // 4.5s delay so visitors see hero surface before engaging
      const timer = setTimeout(() => setIsVisible(true), 4500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    if (dontShowAgain) {
      localStorage.setItem(WELCOME_POPUP_STORAGE_KEY, '1');
    }
  };

  const handleShoot = (target) => {
    if (target === 'top-left' || target === 'top-right') {
      setShotState('goal');
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      setScore((s) => s + 3);
      if (nextStreak > bestStreak) {
        setBestStreak(nextStreak);
        localStorage.setItem('fivesarena_best_streak', String(nextStreak));
      }
    } else if (target === 'bottom-left' || target === 'bottom-right') {
      const isSaved = Math.random() < 0.25;
      if (isSaved) {
        setShotState('miss');
        setStreak(0);
      } else {
        setShotState('goal');
        const nextStreak = streak + 1;
        setStreak(nextStreak);
        setScore((s) => s + 2);
        if (nextStreak > bestStreak) {
          setBestStreak(nextStreak);
          localStorage.setItem('fivesarena_best_streak', String(nextStreak));
        }
      }
    } else if (target === 'crossbar') {
      setShotState('post');
      setStreak(0);
    } else {
      setShotState('miss');
      setStreak(0);
    }
  };

  const handleResetShot = () => {
    setShotState('ready');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-950/85 p-3 backdrop-blur-md sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-gray-800 bg-gray-900 shadow-2xl"
            initial={{ scale: 0.92, y: 25, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.92, y: 25, opacity: 0 }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ambient Background Glow */}
            <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-green-500/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-yellow-500/15 blur-3xl" />

            {/* Mobile-Friendly Close Button */}
            <button
              onClick={handleClose}
              aria-label="Close welcome minigame"
              className="absolute right-3 top-3 z-30 flex h-11 w-11 items-center justify-center rounded-full bg-gray-800/90 text-gray-300 shadow-lg transition active:scale-95 hover:bg-gray-700 hover:text-white"
            >
              <FaTimes size={16} />
            </button>

            {/* Modal Header */}
            <div className="border-b border-gray-800/80 bg-gray-950/50 px-5 pt-5 pb-3">
              <div className="flex items-center gap-2">
                <span className="rounded-full border border-green-500/40 bg-green-500/15 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-green-400">
                  APWA Interactive Warmup
                </span>
                {streak > 0 && (
                  <span className="rounded-full bg-yellow-500/20 px-2 py-0.5 text-[10px] font-black uppercase text-yellow-400 animate-pulse">
                    🔥 {streak} Streak
                  </span>
                )}
              </div>
              <h2
                className="mt-1 text-2xl font-black uppercase tracking-wider text-white sm:text-3xl"
                style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}
              >
                KICK OFF AT <span className="text-yellow-500">5S ARENA</span>
              </h2>
              <p className="text-xs text-gray-300">
                Score against the Hellenic FC keeper to test your skills before hitting the pitch!
              </p>

              {/* Mode Tabs */}
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => setActiveTab('game')}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-black uppercase tracking-wider transition ${
                    activeTab === 'game'
                      ? 'border border-green-500/50 bg-green-500/20 text-green-300'
                      : 'border border-gray-800 bg-gray-900/60 text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <FaGamepad size={13} /> Penalty Shootout
                </button>
                <button
                  onClick={() => setActiveTab('pitches')}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-black uppercase tracking-wider transition ${
                    activeTab === 'pitches'
                      ? 'border border-yellow-500/50 bg-yellow-500/20 text-yellow-300'
                      : 'border border-gray-800 bg-gray-900/60 text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <FaFutbol size={13} /> 3D Pitches & Booking
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5">
              {activeTab === 'game' ? (
                <div>
                  {/* Scoreboard */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-xl border border-gray-800 bg-gray-950/60 p-2">
                      <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">Points</span>
                      <p className="text-lg font-black text-white">{score}</p>
                    </div>
                    <div className="rounded-xl border border-green-500/30 bg-green-950/30 p-2">
                      <span className="text-[9px] font-black uppercase tracking-widest text-green-400">Streak</span>
                      <p className="text-lg font-black text-green-300">{streak} 🔥</p>
                    </div>
                    <div className="rounded-xl border border-yellow-500/30 bg-yellow-950/30 p-2">
                      <span className="text-[9px] font-black uppercase tracking-widest text-yellow-400">Best</span>
                      <p className="text-lg font-black text-yellow-300">{bestStreak} 🏆</p>
                    </div>
                  </div>

                  {/* Penalty Box Interactive Stadium View */}
                  <div className="relative mt-3 h-48 w-full overflow-hidden rounded-2xl border-2 border-white/70 bg-green-950 shadow-inner">
                    {/* Net Pattern */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)] bg-[size:14px_14px]" />
                    
                    {/* Turf Gradient */}
                    <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-green-900 to-transparent" />

                    {/* Keeper Silhouette */}
                    <div className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 text-center text-4xl select-none">
                      🧤
                      <div className="text-[9px] font-black uppercase tracking-wider text-gray-400">Hellenic GK</div>
                    </div>

                    {/* Active Shot Targets */}
                    {shotState === 'ready' && (
                      <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 gap-2 p-2">
                        <button
                          onClick={() => handleShoot('top-left')}
                          className="flex min-h-[44px] cursor-pointer items-center justify-center rounded-xl border border-dashed border-green-400/50 bg-green-900/30 text-[10px] font-black uppercase text-green-300 transition hover:bg-green-500 hover:text-black active:scale-95"
                        >
                          Top Left 🎯
                        </button>
                        <button
                          onClick={() => handleShoot('crossbar')}
                          className="flex min-h-[44px] cursor-pointer items-center justify-center rounded-xl border border-gray-700 bg-black/40 text-[9px] font-black uppercase text-gray-400 transition hover:border-yellow-500 hover:text-yellow-400 active:scale-95"
                        >
                          Crossbar
                        </button>
                        <button
                          onClick={() => handleShoot('top-right')}
                          className="flex min-h-[44px] cursor-pointer items-center justify-center rounded-xl border border-dashed border-green-400/50 bg-green-900/30 text-[10px] font-black uppercase text-green-300 transition hover:bg-green-500 hover:text-black active:scale-95"
                        >
                          Top Right 🎯
                        </button>
                        <button
                          onClick={() => handleShoot('bottom-left')}
                          className="flex min-h-[44px] cursor-pointer items-center justify-center rounded-xl border border-green-500/40 bg-black/40 text-[10px] font-black uppercase text-green-400 transition hover:bg-green-600 hover:text-white active:scale-95"
                        >
                          Bottom Left
                        </button>
                        <button
                          onClick={() => handleShoot('center')}
                          className="flex min-h-[44px] cursor-pointer items-center justify-center rounded-xl border border-gray-700 bg-black/40 text-[9px] font-black uppercase text-gray-500 transition hover:text-white active:scale-95"
                        >
                          Center
                        </button>
                        <button
                          onClick={() => handleShoot('bottom-right')}
                          className="flex min-h-[44px] cursor-pointer items-center justify-center rounded-xl border border-green-500/40 bg-black/40 text-[10px] font-black uppercase text-green-400 transition hover:bg-green-600 hover:text-white active:scale-95"
                        >
                          Bottom Right
                        </button>
                      </div>
                    )}

                    {/* Result Overlays */}
                    {shotState === 'goal' && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/85 backdrop-blur-sm p-3 text-center">
                        <span className="text-3xl">⚽🔥 GOOOAL!</span>
                        <p className="mt-1 text-xs font-black uppercase tracking-wider text-green-400">
                          Top Bins! Pure class finish!
                        </p>
                        <div className="mt-3 flex gap-2">
                          <button
                            onClick={handleResetShot}
                            className="flex items-center gap-1.5 rounded-xl bg-green-600 px-4 py-2 text-xs font-black uppercase tracking-wider text-white shadow-md transition hover:bg-green-500 active:scale-95"
                          >
                            <FaUndo size={11} /> Next Shot
                          </button>
                          <Link
                            href="/#courts"
                            onClick={handleClose}
                            className="flex items-center gap-1.5 rounded-xl bg-yellow-500 px-4 py-2 text-xs font-black uppercase tracking-wider text-black shadow-md transition hover:bg-yellow-400 active:scale-95"
                          >
                            Book Pitch ➔
                          </Link>
                        </div>
                      </div>
                    )}

                    {shotState === 'miss' && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/85 backdrop-blur-sm p-3 text-center">
                        <span className="text-3xl">🧤 SAVED!</span>
                        <p className="mt-1 text-xs font-black uppercase tracking-wider text-red-400">
                          Hellenic goalkeeper read your mind!
                        </p>
                        <button
                          onClick={handleResetShot}
                          className="mt-3 flex items-center gap-1.5 rounded-xl bg-gray-800 px-4 py-2 text-xs font-black uppercase tracking-wider text-white transition hover:bg-gray-700 active:scale-95"
                        >
                          <FaUndo size={11} /> Try Again
                        </button>
                      </div>
                    )}

                    {shotState === 'post' && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/85 backdrop-blur-sm p-3 text-center">
                        <span className="text-3xl">💥 OFF THE BAR!</span>
                        <p className="mt-1 text-xs font-black uppercase tracking-wider text-yellow-400">
                          Woodwork rattled! Inches away!
                        </p>
                        <button
                          onClick={handleResetShot}
                          className="mt-3 flex items-center gap-1.5 rounded-xl bg-gray-800 px-4 py-2 text-xs font-black uppercase tracking-wider text-white transition hover:bg-gray-700 active:scale-95"
                        >
                          <FaUndo size={11} /> Try Again
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Pitches Tab */
                <div className="space-y-3">
                  <div className="rounded-2xl border border-gray-800 bg-gray-950/60 p-4">
                    <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-green-400">
                      Hellenic FC · Milnerton
                    </span>
                    <h3 className="mt-2 text-base font-black text-white">4 Floodlit 5G Turf Courts</h3>
                    <p className="mt-1 text-xs text-gray-400">
                      Experience professional 5-a-side surfaces with verified slot availability.
                    </p>
                    <div className="mt-3 flex gap-2">
                      <Link
                        href="/#courts"
                        onClick={handleClose}
                        className="flex-1 rounded-xl bg-green-600 py-2.5 text-center text-xs font-black uppercase tracking-wider text-white transition hover:bg-green-500"
                      >
                        View Slots ➔
                      </Link>
                      <Link
                        href="/proof/apwa"
                        onClick={handleClose}
                        className="flex-1 rounded-xl border border-gray-700 bg-gray-800/80 py-2.5 text-center text-xs font-black uppercase tracking-wider text-gray-300 transition hover:text-white"
                      >
                        APWA Proof ➔
                      </Link>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-blue-900/40 bg-blue-950/20 p-3 text-center">
                    <p className="text-xs text-blue-300">
                      Team Captain? Build your starting 5 in the <strong>5v5 Tactics Lab</strong> and export directly to WhatsApp!
                    </p>
                    <Link
                      href="/#tactics"
                      onClick={handleClose}
                      className="mt-2 inline-block text-xs font-black uppercase tracking-wider text-yellow-400 hover:underline"
                    >
                      Open Tactics Lab ➔
                    </Link>
                  </div>
                </div>
              )}

              {/* Bottom Dismiss / CTA Area */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-gray-800/80 pt-3">
                <button
                  onClick={handleClose}
                  className="cursor-pointer text-xs font-bold uppercase tracking-wider text-gray-400 transition hover:text-white"
                >
                  Skip to Arena ➔
                </button>

                <label className="flex cursor-pointer select-none items-center gap-1.5 text-[10px] uppercase tracking-wider text-gray-500 hover:text-gray-400">
                  <input
                    type="checkbox"
                    checked={dontShowAgain}
                    onChange={(e) => setDontShowAgain(e.target.checked)}
                    className="h-3.5 w-3.5 accent-yellow-600"
                  />
                  Don&apos;t show again
                </label>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
