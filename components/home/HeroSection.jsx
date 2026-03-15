'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaFutbol, FaWhatsapp } from 'react-icons/fa';

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18, delayChildren: 0.25 } },
};

const item = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-end pb-24 overflow-hidden">

      {/* Ken Burns background */}
      <div
        className="absolute inset-0 hero-bg"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1920&q=80)',
        }}
      />

      {/* Particle dot grid overlay */}
      <div className="absolute inset-0 hero-particles" />

      {/* Vignette overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, rgba(0,0,0,0.97) 0%, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0.15) 100%)',
        }}
      />

      <motion.div
        className="relative z-10 w-full max-w-6xl mx-auto px-6"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {/* Location pill */}
        <motion.p
          variants={item}
          className="text-green-400 font-bold uppercase tracking-widest text-sm mb-4"
        >
          Milnerton · Cape Town · Hellenic Football Club
        </motion.p>

        {/* Hero title — WELCOME TO + FIVES ARENA */}
        <motion.h1
          variants={item}
          className="hero-title text-white font-black uppercase leading-none mb-6 cursor-default"
          style={{
            fontSize: 'clamp(3rem, 9vw, 7.5rem)',
            fontFamily: 'Impact, Arial Black, sans-serif',
            textShadow: '0 4px 32px rgba(0,0,0,0.6)',
          }}
          whileHover={{
            textShadow: '0 0 40px rgba(34,197,94,0.6), 0 0 80px rgba(34,197,94,0.3), 0 4px 32px rgba(0,0,0,0.6)',
            transition: { duration: 0.3 },
          }}
        >
          <motion.span
            className="inline-block"
            whileHover={{
              scale: 1.05,
              color: '#4ade80',
              textShadow: '0 0 30px rgba(74,222,128,0.5)',
              transition: { type: 'spring', stiffness: 300, damping: 15 },
            }}
          >
            WELCOME TO
          </motion.span>
          <br />
          <motion.span
            className="text-green-400 inline-block"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.75, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{
              scale: 1.08,
              textShadow: '0 0 60px rgba(34,197,94,0.8), 0 0 120px rgba(34,197,94,0.4)',
              filter: 'brightness(1.3)',
              transition: { type: 'spring', stiffness: 400, damping: 12 },
            }}
          >
            FIVES ARENA
          </motion.span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={item}
          className="text-gray-300 text-xl max-w-xl mb-10 leading-relaxed"
        >
          Cape Town&apos;s premier 5-a-side football experience.
          Book a court, gather your squad, and play the beautiful game.
        </motion.p>

        {/* CTA buttons */}
        <motion.div variants={item} className="flex flex-wrap gap-4">
          <motion.div
            whileHover={{
              scale: 1.08,
              boxShadow: '0 0 50px rgba(34,197,94,0.7), 0 0 100px rgba(34,197,94,0.3)',
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          >
            <Link
              href="/bookings"
              className="inline-flex items-center gap-3 text-white font-black text-lg px-10 py-5 uppercase tracking-widest rounded-xl relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #15803d 0%, #22c55e 50%, #16a34a 100%)',
                boxShadow: '0 0 30px rgba(34,197,94,0.45)',
              }}
            >
              <motion.span
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                className="inline-flex"
              >
                <FaFutbol size={18} />
              </motion.span>
              <span>BOOK NOW</span>
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, ease: 'easeInOut' }}
              />
            </Link>
          </motion.div>
          <motion.a
            href="https://wa.me/27637820245"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border-2 border-white hover:border-green-400 hover:text-green-400 text-white font-bold text-lg px-8 py-4 uppercase tracking-wide rounded-xl transition-colors duration-300"
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(37,211,102,0.4)' }}
            whileTap={{ scale: 0.95 }}
          >
            <FaWhatsapp /> WhatsApp Us
          </a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-[-3.5rem] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 2, duration: 1 }}
        >
          <span className="text-white text-xs uppercase tracking-widest">Scroll</span>
          <motion.div
            className="w-px h-10 bg-white origin-top"
            animate={{ scaleY: [0, 1, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
