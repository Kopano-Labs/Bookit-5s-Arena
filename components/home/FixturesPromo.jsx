'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaTv, FaFutbol, FaTrophy, FaArrowRight } from 'react-icons/fa';

const liveMatches = [
  { home: 'Arsenal', away: 'Chelsea', score: '2 - 1', live: true },
  { home: 'Real Madrid', away: 'Man City', score: '2 - 1', live: false },
  { home: 'Barcelona', away: 'Bayern', score: '3 - 3', live: false },
];

export default function FixturesPromo() {
  return (
    <Link href="/fixtures" className="block">
      <section className="py-8 relative overflow-hidden cursor-pointer group" style={{ background: 'linear-gradient(135deg, #0c1222 0%, #1a1a2e 50%, #0c1222 100%)' }}>

        {/* Animated background elements */}
        <motion.div
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 20% 50%, rgba(129,140,248,0.08) 0%, transparent 50%)' }}
        />
        <motion.div
          className="absolute top-0 right-0 w-full h-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 80% 50%, rgba(34,197,94,0.06) 0%, transparent 50%)' }}
        />

        {/* Floating orbs */}
        <motion.div
          className="absolute top-2 left-[10%] w-2 h-2 rounded-full bg-green-500/40"
          animate={{ y: [-5, 5, -5], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-3 right-[20%] w-1.5 h-1.5 rounded-full bg-indigo-400/40"
          animate={{ y: [5, -5, 5], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-4 right-[40%] w-1 h-1 rounded-full bg-yellow-400/50"
          animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">

            {/* Left: icon + text */}
            <motion.div
              className="flex items-center gap-3 flex-shrink-0"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <motion.div
                className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <FaTv className="text-indigo-400 text-lg" />
              </motion.div>
              <div>
                <h3
                  className="text-white font-black uppercase text-sm tracking-widest"
                  style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}
                >
                  Live Fixtures
                </h3>
                <p className="text-gray-500 text-[10px] uppercase tracking-wider">
                  Scores &bull; News &bull; Highlights
                </p>
              </div>
            </motion.div>

            {/* Center: mini live scores ticker */}
            <div className="flex-1 flex items-center gap-3 overflow-x-auto scrollbar-none">
              {liveMatches.map((m, i) => (
                <motion.div
                  key={i}
                  className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg border text-[10px] ${
                    m.live
                      ? 'bg-red-900/20 border-red-800/40 text-white'
                      : 'bg-gray-800/40 border-gray-700/40 text-gray-400'
                  }`}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  {m.live && (
                    <motion.span
                      className="w-1.5 h-1.5 rounded-full bg-red-500"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}
                  <span className="font-bold">{m.home}</span>
                  <span className="text-green-400 font-black">{m.score}</span>
                  <span className="font-bold">{m.away}</span>
                </motion.div>
              ))}
            </div>

            {/* Right: CTA */}
            <motion.span
              className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white transition-all"
              style={{
                background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
                boxShadow: '0 0 15px rgba(99,102,241,0.3)',
              }}
              whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(99,102,241,0.5)' }}
            >
              Watch Now <FaArrowRight size={9} />
            </motion.span>
          </div>
        </div>
      </section>
    </Link>
  );
}
