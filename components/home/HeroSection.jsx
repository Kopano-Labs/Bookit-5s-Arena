"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaFutbol, FaWhatsapp } from "react-icons/fa";

/* ── Lazy-load 3D scene (heavy Three.js bundle) ── */
const Hero3DScene = dynamic(() => import("@/components/home/Hero3DScene"), {
  ssr: false,
  loading: () => null,
});

const whatsappPulse = {
  animate: {
    scale: [1, 1.08, 1],
    rotate: [0, -8, 8, 0],
  },
  transition: {
    duration: 2.2,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18, delayChildren: 0.25 } },
};

const item = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function HeroSection() {
  return (
    <section className="relative z-0 flex min-h-screen items-center justify-center overflow-hidden px-0 pt-20 pb-20 sm:pt-24 sm:pb-24">
      {/* ── 3D Three.js Scene (background layer) ── */}
      <Suspense fallback={null}>
        <Hero3DScene />
      </Suspense>

      {/* ── Gradient underlay for 3D scene ── */}
      <div
        className="absolute inset-0 z-[-1]"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(74,222,128,0.06) 0%, transparent 70%), linear-gradient(180deg, #04060a 0%, #080d14 50%, #04060a 100%)",
        }}
      />

      {/* Particle dot grid overlay */}
      <div className="absolute inset-0 hero-particles read:opacity-30" />

      {/* Bottom gradient fade */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(4,6,10,1) 0%, rgba(4,6,10,0.8) 20%, transparent 50%)",
        }}
      />

      <motion.div
        className="relative z-10 mx-auto grid w-full max-w-6xl max-w-[100vw] items-center gap-8 overflow-hidden px-5 text-center sm:px-6 md:grid-cols-[minmax(0,1.05fr)_minmax(280px,0.95fr)] md:gap-10 md:text-left"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        <div className="mx-auto w-full max-w-xl md:mx-0 md:max-w-2xl">
          <motion.p
            variants={item}
            className="mb-4 text-[8px] font-bold uppercase leading-relaxed tracking-[0.18em] text-green-400 sm:text-sm sm:tracking-[0.35em]"
            style={{ textWrap: "balance" }}
          >
            Milnerton · Cape Town · Hellenic Football Club
          </motion.p>

          <motion.h1
            variants={item}
            className="hero-title mb-6 cursor-default font-black uppercase leading-[0.9] text-white"
            style={{
              fontSize: "clamp(2.2rem, 11vw, 6rem)",
              fontFamily: "'Bebas Neue', Impact, Arial Black, sans-serif",
              textShadow: "0 4px 32px rgba(0,0,0,0.55)",
              textWrap: "balance",
            }}
          >
            <span className="block text-white/95">Welcome to</span>
            <motion.span
              className="mt-2 block text-green-400"
              initial={{ opacity: 0, x: -28 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: 0.55,
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              Five&apos;s Arena
            </motion.span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mb-10 max-w-xl text-base leading-relaxed text-gray-200 sm:text-xl"
          >
            Cape Town&apos;s premier 5-a-side football experience. Book a court,
            gather your squad, and play the beautiful game under the lights.
          </motion.p>

          <motion.div
            variants={item}
            className="mx-auto flex w-full flex-col items-center justify-center gap-4 sm:flex-row md:mx-0 md:justify-start"
          >
            <Link
              href="/#courts"
              className="w-full sm:w-auto px-8 py-4 bg-green-600 text-white rounded-xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(34,197,94,0.4)] hover:bg-green-500 hover:scale-105 active:scale-95 transition-all text-center"
            >
              <motion.span
                animate={{ rotate: [0, 20, -20, 0] }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <FaFutbol size={16} />
              </motion.span>
              Book Now
            </Link>
            <a
              href="https://wa.me/27637820245"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-white/80 text-white rounded-xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 hover:bg-white hover:text-black transition-all text-center"
            >
              <motion.span
                animate={whatsappPulse.animate}
                transition={whatsappPulse.transition}
              >
                <FaWhatsapp size={16} />
              </motion.span>
              Whatsapp Us
            </a>
          </motion.div>
        </div>

        <motion.div
          variants={item}
          className="hidden justify-self-end md:block"
        >
          <div className="rounded-[32px] border border-white/12 bg-black/20 p-5 backdrop-blur-sm shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
            <div className="w-[min(34vw,390px)] rounded-[26px] border border-white/10 bg-black/10 p-5 text-left">
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-green-300">
                Open Daily
              </p>
              <p
                className="mt-3 text-3xl font-black uppercase text-white"
                style={{ fontFamily: "'Bebas Neue', Impact, Arial Black, sans-serif" }}
              >
                Floodlit 5-A-Side
              </p>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-gray-200">
                Premium synthetic turf, quick bookings, fixtures, and competition play from the heart of Milnerton.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 opacity-50 sm:flex"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 2, duration: 1 }}
        >
          <span className="text-white text-[10px] uppercase tracking-[0.3em]">
            Scroll
          </span>
          <motion.div
            className="w-px h-10 bg-green-500 origin-top"
            animate={{ scaleY: [0, 1, 0] }}
            transition={{
              duration: 1.4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
