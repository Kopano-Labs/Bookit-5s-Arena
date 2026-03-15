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
          className="hero-title text-white font-black uppercase leading-none mb-6"
          style={{
            fontSize: 'clamp(3rem, 9vw, 7.5rem)',
            fontFamily: 'Impact, Arial Black, sans-serif',
            textShadow: '0 4px 32px rgba(0,0,0,0.6)',
          }}
        >
          WELCOME TO
          <br />
          <motion.span
            className="text-green-400 inline-block"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.75, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
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
          <Link
            href="#courts"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold text-lg px-8 py-4 uppercase tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-[0_0_35px_rgba(34,197,94,0.55)]"
          >
            <FaFutbol /> Book A Court
          </Link>
          <a
            href="https://wa.me/27637820245"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border-2 border-white hover:border-green-400 hover:text-green-400 text-white font-bold text-lg px-8 py-4 uppercase tracking-wide transition-all duration-300 hover:scale-105"
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
