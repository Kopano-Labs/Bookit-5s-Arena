"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FaBolt, FaBroadcastTower, FaChevronRight, FaTrophy } from "react-icons/fa";

export default function HomeLiveFixtures() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMatches() {
      try {
        const res = await fetch("/api/football/featured");
        const data = await res.json();
        if (res.ok) setMatches(data);
      } catch (err) {
        console.error("Failed to fetch featured matches", err);
      } finally {
        setLoading(false);
      }
    }

    fetchMatches();
    const interval = setInterval(fetchMatches, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  if (loading) return (
    <div className="h-64 flex flex-col items-center justify-center bg-zinc-950 border-y border-zinc-900">
      <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin mb-4" />
      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 animate-pulse">Syncing Arena Data Feed...</span>
    </div>
  );

  if (matches.length === 0) return null;

  return (
    <section className="bg-zinc-950 border-y border-zinc-900 py-12 overflow-hidden relative">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-green-500/10 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 mb-8 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
            <FaBolt className="text-green-500" />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-tight text-white leading-none">Live Match Center</h2>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Global Coverage · PSL Tracked</p>
          </div>
        </div>
        <Link href="/fixtures" className="text-[10px] font-black uppercase tracking-widest text-green-500 hover:text-green-400 flex items-center gap-2 group transition-all">
            See All Leagues <FaChevronRight className="transition-transform group-hover:translate-x-1" size={8} />
        </Link>
      </div>

      <div className="relative z-10">
        <div className="flex gap-4 overflow-x-auto px-6 pb-6 hide-scrollbar mask-fade-edges">
          {matches.map((match, i) => (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, scale: 0.9, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex-shrink-0 w-[280px] bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-3xl p-5 hover:border-green-500/40 hover:bg-zinc-900 transition-all cursor-default group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 group-hover:text-green-400 transition-colors">
                  {match.league.shortName || match.league.name}
                </span>
                {match.isLive ? (
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20">
                    <span className="w-1 h-1 bg-rose-500 rounded-full animate-pulse" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-rose-500">{match.minute}' LIVE</span>
                  </div>
                ) : (
                  <span className="text-[8px] font-black uppercase tracking-widest text-zinc-600">{match.kickoffLabel}</span>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="relative w-6 h-6 rounded-full bg-white/10 overflow-hidden ring-1 ring-white/5">
                        {match.home.logo && <Image src={match.home.logo} alt="" fill className="object-contain p-0.5" unoptimized />}
                    </div>
                    <span className="text-xs font-bold text-zinc-300 truncate">{match.home.name}</span>
                  </div>
                  <span className={`text-sm font-black ${match.isLive ? 'text-white' : 'text-zinc-600'}`}>{match.score.home ?? 0}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="relative w-6 h-6 rounded-full bg-white/10 overflow-hidden ring-1 ring-white/5">
                        {match.away.logo && <Image src={match.away.logo} alt="" fill className="object-contain p-0.5" unoptimized />}
                    </div>
                    <span className="text-xs font-bold text-zinc-300 truncate">{match.away.name}</span>
                  </div>
                  <span className={`text-sm font-black ${match.isLive ? 'text-white' : 'text-zinc-600'}`}>{match.score.away ?? 0}</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-zinc-800/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <FaBroadcastTower className="text-zinc-600" size={10} />
                    <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">iSports Edge Feed</span>
                </div>
                <Link href={`/fixtures?league=${match.league.id}`} className="p-2 rounded-full bg-zinc-800/50 hover:bg-green-500/20 hover:text-green-400 transition-all">
                    <FaChevronRight size={8} />
                </Link>
              </div>
            </motion.div>
          ))}
          
          {/* View More Card */}
          <Link href="/fixtures" className="flex-shrink-0 w-[120px] rounded-3xl border border-dashed border-zinc-800 flex flex-col items-center justify-center gap-3 group hover:border-green-500/50 hover:bg-green-500/5 transition-all">
             <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FaArrowRight className="text-zinc-500 group-hover:text-green-500" size={12} />
             </div>
             <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600 group-hover:text-green-500">View All</span>
          </Link>
        </div>
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .mask-fade-edges {
          webkit-mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
          mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
        }
      `}</style>
    </section>
  );
}
