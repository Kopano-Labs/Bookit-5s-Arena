"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import FootballFixturesHub from "@/components/fixtures/FootballFixturesHub";
import { motion } from "framer-motion";
import Link from "next/link";

const LEAGUES = [
  /* ─── 🌍 International ─── */
  { slug: "fifa-world-cup",           name: "🏆 FIFA World Cup",              country: "INT" },
  { slug: "uefa-nations-league",      name: "🌍 UEFA Nations League",          country: "EUR" },
  /* ─── 🏴󠁧󠁢󠁥󠁮󠁧󠁿 England ─── */
  { slug: "premier-league",           name: "Premier League",                  country: "EN"  },
  /* ─── 🇪🇺 UEFA Club Comps ─── */
  { slug: "uefa-champions-league",    name: "Champions League",                country: "EU"  },
  { slug: "uefa-europa-league",       name: "Europa League",                   country: "EU"  },
  { slug: "uefa-conference-league",   name: "Conference League",               country: "EU"  },
  /* ─── 🌍 Big 5 ─── */
  { slug: "la-liga",                  name: "La Liga",                         country: "ES"  },
  { slug: "serie-a",                  name: "Serie A",                         country: "IT"  },
  { slug: "bundesliga",               name: "Bundesliga",                      country: "DE"  },
  { slug: "ligue-1",                  name: "Ligue 1",                         country: "FR"  },
  /* ─── 🌍 Other Europe ─── */
  { slug: "eredivisie",               name: "Eredivisie",                      country: "NL"  },
  { slug: "primeira-liga",            name: "Primeira Liga",                   country: "PT"  },
  { slug: "belgian-pro-league",       name: "Belgian Pro League",              country: "BE"  },
  { slug: "scottish-premiership",     name: "Scottish Premiership",            country: "SCO" },
  { slug: "turkish-super-lig",        name: "Turkish Süper Lig",               country: "TR"  },
  /* ─── 🌎 Americas ─── */
  { slug: "major-league-soccer",      name: "MLS",                             country: "US"  },
  { slug: "brasileirao",              name: "Brasileirao",                     country: "BR"  },
  { slug: "argentine-primera",        name: "Argentine Primera",               country: "AR"  },
  { slug: "liga-mx",                  name: "Liga MX",                         country: "MX"  },
  /* ─── 🌍 Africa ─── */
  { slug: "psl",                      name: "PSL (South Africa)",              country: "ZA"  },
  { slug: "egyptian-premier-league",  name: "Egyptian Premier League",         country: "EG"  },
  { slug: "caf-champions-league",     name: "CAF Champions League",            country: "CAF" },
  { slug: "caf-confederation-cup",    name: "CAF Confederation Cup",           country: "CAF" },
  /* ─── 🌏 Asia & Middle East ─── */
  { slug: "saudi-pro-league",         name: "Saudi Pro League",                country: "SA"  },
  { slug: "j1-league",                name: "J1 League",                       country: "JP"  },
  { slug: "k-league-1",               name: "K League 1",                      country: "KR"  },
  { slug: "afc-champions-league-elite", name: "AFC Champions League Elite",    country: "AFC" },
];

function FixturesPageInner() {
  const searchParams = useSearchParams();
  const leagueParam = searchParams.get("league");
  const initialLeague = LEAGUES.find(l => l.slug === leagueParam)?.slug || LEAGUES[0].slug;
  const [selectedLeague, setSelectedLeague] = useState(initialLeague);

  return (
    <div className="min-h-screen pb-20 pt-10 px-4" style={{ background: "linear-gradient(180deg, #04060a 0%, #0a0f14 60%, #04060a 100%)" }}>
      <div className="mx-auto max-w-6xl space-y-10">
        {/* Header */}
        <section className="flex flex-col items-center gap-4 text-center">
          <h1
            className="text-4xl md:text-6xl font-black text-white uppercase leading-none"
            style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif", letterSpacing: "0.08em" }}
          >
            LIVE <span className="text-green-400">FIXTURES</span>
          </h1>
          <p className="text-zinc-400 text-sm max-w-xl">
            Real-time scores, schedules, and standings across 27 leagues worldwide. Powered by iSports API.
          </p>
        </section>

        {/* League Switcher */}
        <section className="flex flex-col items-center gap-6">
          <div
            className="flex flex-wrap justify-center gap-2 p-2 rounded-2xl border"
            style={{
              background: "rgba(255,255,255,0.03)",
              borderColor: "rgba(74, 222, 128, 0.1)",
              backdropFilter: "blur(12px)",
            }}
          >
            {LEAGUES.map((league) => (
              <button
                key={league.slug}
                onClick={() => setSelectedLeague(league.slug)}
                className={`px-3 py-2 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all duration-200 ${
                  selectedLeague === league.slug
                    ? "bg-green-500 text-black shadow-lg shadow-green-500/30"
                    : "text-zinc-500 hover:text-white hover:bg-white/5"
                }`}
              >
                {league.name}
              </button>
            ))}
          </div>
        </section>

        {/* Fixtures Hub */}
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

export default function FixturesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#04060a" }}>
        <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <FixturesPageInner />
    </Suspense>
  );
}
