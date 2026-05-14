"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FaShieldAlt } from "react-icons/fa";
import { BLACKBOX_PROTOCOL_LABEL } from "@/lib/blackboxMicrosoftGamingProtocol";

export default function FixturesRefactorShield({ onContinuePremierLeague }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      style={{
        background:
          "radial-gradient(ellipse at center, rgba(4,6,10,0.92) 0%, rgba(0,0,0,0.97) 70%)",
        backdropFilter: "blur(10px)",
      }}
      role="alertdialog"
      aria-labelledby="fixtures-shield-title"
      aria-describedby="fixtures-shield-desc"
    >
      <motion.div
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-lg w-full rounded-[28px] border border-green-500/30 bg-zinc-950/95 p-8 shadow-[0_0_80px_rgba(34,197,94,0.15)]"
      >
        <motion.div className="flex items-center gap-3 mb-4">
          <FaShieldAlt className="text-green-500" size={22} />
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-green-500">
            {BLACKBOX_PROTOCOL_LABEL}
          </p>
        </motion.div>
        <h2
          id="fixtures-shield-title"
          className="text-2xl md:text-3xl font-black text-white uppercase leading-tight"
        >
          Match centre recovery
        </h2>
        <p id="fixtures-shield-desc" className="mt-4 text-sm text-zinc-300 leading-relaxed">
          We are rebuilding the fixtures experience to meet demo standards: clear today / upcoming /
          results states, reliable data for every league, and zero broken empty screens.
        </p>
        <p className="mt-3 text-sm text-zinc-500">
          Premier League schedules, standings, and stats remain available while the full 27-league
          surface is hardened.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={onContinuePremierLeague}
            className="flex-1 rounded-xl bg-green-500 px-5 py-3 text-[11px] font-black uppercase tracking-widest text-black hover:bg-green-400 transition"
          >
            Open Premier League hub
          </button>
          <Link
            href="/"
            className="flex-1 rounded-xl border border-zinc-700 px-5 py-3 text-center text-[11px] font-black uppercase tracking-widest text-zinc-300 hover:bg-white/5 transition"
          >
            Back to home
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
