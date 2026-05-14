"use client";

import { motion } from "framer-motion";
import { getLeagueBySlug } from "@/lib/sports/leaguesCatalog";

export default function FavoriteLeaguesRail({ favorites = [], activeSlug, onSelect, onEdit }) {
  if (!favorites.length) return null;

  return (
    <section className="space-y-4">
      <motion.div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.32em] text-green-400">
            Your leagues
          </p>
          <h2 className="mt-1 text-2xl font-black uppercase text-white">
            Jump back in
          </h2>
        </motion.div>
        <button
          type="button"
          onClick={onEdit}
          className="rounded-full border border-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-300 transition hover:border-green-500/40 hover:text-white"
        >
          Change leagues
        </button>
      </motion.div>

      <div className="grid gap-3 md:grid-cols-3">
        {favorites.map((slug, index) => {
          const league = getLeagueBySlug(slug);
          if (!league) return null;
          const active = activeSlug === slug;
          return (
            <motion.button
              key={slug}
              type="button"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onSelect(slug)}
              className={`rounded-[28px] border px-5 py-5 text-left transition ${
                active
                  ? "border-green-500/50 bg-green-500/10 shadow-[0_0_40px_rgba(34,197,94,0.12)]"
                  : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]"
              }`}
            >
              <motion.div className="text-2xl">{league.emoji}</motion.div>
              <motion.div className="mt-3 text-lg font-black text-white">{league.shortName}</motion.div>
              <p className="mt-1 text-xs text-zinc-400">Live scores, tables, and headlines</p>
            </motion.button>
          );
        })}
      </motion.div>
    </section>
  );
}
