'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  FaTrophy, FaFutbol, FaBolt, FaArrowRight,
  FaWhatsapp, FaInstagram, FaTiktok,
} from 'react-icons/fa';

/* ── Floating particle with deterministic seed ── */
function FloatingParticle({ index }) {
  const seed1 = Math.sin(index * 127.1) * 43758.5453;
  const seed2 = Math.cos(index * 311.7) * 43758.5453;
  const x = (seed1 - Math.floor(seed1)) * 100;
  const y = (seed2 - Math.floor(seed2)) * 100;
  const size = 2 + (seed1 - Math.floor(seed1)) * 4;
  const dur = 8 + (seed2 - Math.floor(seed2)) * 12;

  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        left: `${x}%`,
        top: `${y}%`,
        background: index % 3 === 0 ? '#22c55e' : index % 3 === 1 ? '#06b6d4' : '#a855f7',
      }}
      animate={{
        y: [0, -30, 0, 20, 0],
        x: [0, 15, -10, 5, 0],
        opacity: [0.2, 0.6, 0.3, 0.7, 0.2],
        scale: [1, 1.5, 1, 1.3, 1],
      }}
      transition={{
        duration: dur,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: index * 0.3,
      }}
    />
  );
}

/* ── Pulsing ring ── */
function PulsingRing({ size, delay, color }) {
  return (
    <motion.div
      className="absolute rounded-full border-2 pointer-events-none"
      style={{
        width: size,
        height: size,
        borderColor: color,
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
      }}
      animate={{
        scale: [0.8, 1.3, 0.8],
        opacity: [0.05, 0.2, 0.05],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        delay,
        ease: 'easeInOut',
      }}
    />
  );
}

export default function LeaguesPage() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [choice, setChoice] = useState(null);

  return (
    <div className="min-h-screen bg-gray-950 text-white relative overflow-hidden">

      {/* ── Background particles ── */}
      {Array.from({ length: 30 }).map((_, i) => (
        <FloatingParticle key={i} index={i} />
      ))}

      {/* ── Pulsing rings ── */}
      <PulsingRing size={400} delay={0} color="rgba(34,197,94,0.15)" />
      <PulsingRing size={600} delay={1} color="rgba(6,182,212,0.08)" />
      <PulsingRing size={800} delay={2} color="rgba(168,85,247,0.06)" />

      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-green-950/20 via-transparent to-gray-950 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,197,94,0.06)_0%,transparent_70%)] pointer-events-none" />

      {/* ── Welcome Choice Popup ── */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            key="welcome-overlay"
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
            <motion.div
              className="relative z-10 max-w-lg w-full bg-gray-900 border border-gray-700 rounded-3xl p-8 text-center shadow-2xl"
              initial={{ scale: 0.8, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 40 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-900/40 border-2 border-green-500/50 flex items-center justify-center"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <FaTrophy className="text-green-400 text-3xl" />
              </motion.div>

              <h2
                className="font-black uppercase tracking-widest text-2xl mb-2"
                style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}
              >
                Welcome to <span className="text-green-400">Competitions</span>
              </h2>
              <p className="text-gray-400 text-sm mb-8">
                Where would you like to go?
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Competitions (Coming Soon) */}
                <motion.button
                  onClick={() => { setChoice('competitions'); setShowWelcome(false); }}
                  className="relative px-6 py-5 rounded-2xl border border-gray-700 bg-gray-800/60 text-left cursor-pointer overflow-hidden group"
                  whileHover={{ borderColor: 'rgba(6,182,212,0.5)', scale: 1.02, transition: { duration: 0.2, type: 'tween' } }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <FaFutbol className="text-cyan-400" />
                    <span className="font-black uppercase tracking-widest text-sm">Competitions</span>
                  </div>
                  <p className="text-gray-500 text-xs">Weekly 5-a-side competitions</p>
                  <motion.span
                    className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest bg-red-900/40 text-red-400 border border-red-700/40"
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    🔴 Coming Soon
                  </motion.span>
                </motion.button>

                {/* Tournament */}
                <motion.button
                  onClick={() => { setChoice('tournament'); setShowWelcome(false); }}
                  className="relative px-6 py-5 rounded-2xl border border-green-700/40 bg-green-900/20 text-left cursor-pointer overflow-hidden group"
                  whileHover={{ borderColor: 'rgba(34,197,94,0.6)', scale: 1.02, transition: { duration: 0.2, type: 'tween' } }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <FaTrophy className="text-yellow-400" />
                    <span className="font-black uppercase tracking-widest text-sm">Tournament</span>
                  </div>
                  <p className="text-gray-500 text-xs">5s Arena World Cup 2026</p>
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest bg-green-900/40 text-green-400 border border-green-700/40">
                    🟢 Open
                  </span>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MAIN CONTENT ── */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-20">

        <AnimatePresence mode="wait">
          {/* ── COMPETITIONS: COMING SOON ── */}
          {(choice === 'competitions' || !choice) && !showWelcome && (
            <motion.div
              key="coming-soon"
              className="text-center max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Blinking red dot */}
              <motion.div
                className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-red-950/40 border border-red-700/40 mb-8"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <motion.div
                  className="w-3 h-3 rounded-full bg-red-500"
                  animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
                />
                <span className="text-red-400 text-xs font-bold uppercase tracking-widest">Season 1 · Coming Soon</span>
              </motion.div>

              {/* Main title */}
              <motion.h1
                className="font-black uppercase mb-6 leading-none"
                style={{
                  fontSize: 'clamp(3.5rem, 12vw, 8rem)',
                  fontFamily: 'Impact, Arial Black, sans-serif',
                  background: 'linear-gradient(135deg, #22c55e 0%, #06b6d4 50%, #a855f7 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
                animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              >
                COMING
                <br />
                SOON
              </motion.h1>

              {/* Subtitle with animated bolt */}
              <div className="flex items-center justify-center gap-3 mb-8">
                <motion.div
                  animate={{ rotate: [0, 20, -20, 0], scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <FaBolt className="text-yellow-400 text-2xl" />
                </motion.div>
                <p className="text-gray-300 text-lg font-semibold">
                  5-a-side leagues are about to kick off
                </p>
                <motion.div
                  animate={{ rotate: [0, -20, 20, 0], scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                >
                  <FaBolt className="text-yellow-400 text-2xl" />
                </motion.div>
              </div>

              <p className="text-gray-500 text-sm max-w-md mx-auto mb-10 leading-relaxed">
                Compete with the best in Cape Town. Weekly 5-a-side leagues for every skill level.
                Monday nights, Wednesday socials, Saturday mornings — your pitch, your team, your glory.
              </p>

              {/* Feature preview cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                {[
                  { icon: '🏆', title: 'Competitive Play', desc: 'Weekly matches & standings' },
                  { icon: '📊', title: 'Live Standings', desc: 'Real-time league tables' },
                  { icon: '⚡', title: 'All Levels', desc: 'Social to competitive' },
                ].map((item, i) => (
                  <motion.div
                    key={item.title}
                    className="px-5 py-6 rounded-2xl bg-gray-900/60 border border-gray-800 backdrop-blur-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.15, duration: 0.5, ease: 'easeOut' }}
                    whileHover={{ borderColor: 'rgba(34,197,94,0.4)', y: -4, transition: { duration: 0.2, type: 'tween' } }}
                  >
                    <div className="text-4xl mb-3">{item.icon}</div>
                    <p className="text-white font-bold text-sm mb-1">{item.title}</p>
                    <p className="text-gray-500 text-xs">{item.desc}</p>
                  </motion.div>
                ))}
              </div>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/tournament">
                  <motion.div
                    className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-green-600 text-white font-black uppercase tracking-widest text-sm cursor-pointer"
                    style={{ boxShadow: '0 0 30px rgba(34,197,94,0.4)' }}
                    whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(34,197,94,0.6)', transition: { duration: 0.2, type: 'tween' } }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaTrophy size={16} /> Join the Tournament Instead <FaArrowRight size={12} />
                  </motion.div>
                </Link>
                <motion.a
                  href="https://wa.me/27637820245?text=Hi%2C%20I%27m%20interested%20in%20joining%20a%20league%20at%205s%20Arena!"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-700 text-gray-300 text-xs font-bold uppercase tracking-widest hover:border-green-700 hover:text-white transition-all"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <FaWhatsapp className="text-green-400" /> Get Notified When We Launch
                </motion.a>
              </div>

              {/* Social follow */}
              <div className="mt-12 flex items-center justify-center gap-4">
                <span className="text-gray-600 text-xs uppercase tracking-widest">Follow us</span>
                {[
                  { icon: FaInstagram, href: 'https://instagram.com/fivesarena', color: '#e1306c' },
                  { icon: FaTiktok, href: 'https://tiktok.com/@fivesarena', color: '#fff' },
                  { icon: FaWhatsapp, href: 'https://wa.me/27637820245', color: '#25d366' },
                ].map((s) => (
                  <motion.a
                    key={s.href}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center transition-colors hover:border-gray-600"
                    whileHover={{ scale: 1.15, y: -2, transition: { duration: 0.15, type: 'tween' } }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <s.icon style={{ color: s.color }} size={14} />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── TOURNAMENT: Redirect ── */}
          {choice === 'tournament' && !showWelcome && (
            <motion.div
              key="tournament-redirect"
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Redirecting />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ── Auto-redirect to tournament page ── */
function Redirecting() {
  const router = typeof window !== 'undefined' ? require('next/navigation').useRouter() : null;

  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = '/tournament';
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        className="w-16 h-16 rounded-full border-4 border-green-500 border-t-transparent"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      <p className="text-green-400 font-bold uppercase tracking-widest text-sm animate-pulse">
        Heading to the Tournament...
      </p>
    </div>
  );
}
