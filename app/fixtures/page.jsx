"use client";

import { useState } from "react";
import FootballFixturesHub from "@/components/fixtures/FootballFixturesHub";
import { motion } from "framer-motion";

const LEAGUES = [
  { slug: "premier-league", name: "Premier League", country: "EN" },
  { slug: "psl", name: "PSL (South Africa)", country: "ZA" },
  { slug: "uefa-champions-league", name: "Champions League", country: "EU" },
  { slug: "la-liga", name: "La Liga", country: "ES" },
  { slug: "serie-a", name: "Serie A", country: "IT" },
  { slug: "bundesliga", name: "Bundesliga", country: "DE" },
  { slug: "ligue-1", name: "Ligue 1", country: "FR" },
];

export default function FixturesPage() {
  const [selectedLeague, setSelectedLeague] = useState(LEAGUES[0].slug);

  return (
    <div className="min-h-screen bg-zinc-50 pb-20 pt-10 px-4">
      <div className="mx-auto max-w-6xl space-y-10">
        <section className="flex flex-col items-center gap-6">
          <div className="flex flex-wrap justify-center gap-2 p-1.5 bg-white rounded-2xl shadow-sm border border-zinc-200">
            {LEAGUES.map((league) => (
              <button
                key={league.slug}
                onClick={() => setSelectedLeague(league.slug)}
                className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                  selectedLeague === league.slug
                    ? "bg-zinc-950 text-white shadow-lg"
                    : "text-zinc-500 hover:bg-zinc-100"
                }`}
              >
                {league.name}
              </button>
            ))}
          </div>
        </section>

        <motion.div
          key={selectedLeague}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <FootballFixturesHub slug={selectedLeague} />
        </motion.div>
      </div>
    </div>
  );
}
