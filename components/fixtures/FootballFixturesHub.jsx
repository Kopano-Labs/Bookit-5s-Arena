"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBroadcastTower,
  FaPlay,
  FaTrophy,
  FaNewspaper,
  FaCalendarAlt,
} from "react-icons/fa";

function TeamBadge({ team }) {
  return (
    <div className="flex items-center gap-3 min-w-0">
      <div className="relative h-9 w-9 shrink-0 rounded-full bg-white/10 ring-1 ring-white/10">
        {team?.logo ? (
          <Image
            src={team.logo}
            alt={`${team.name} badge`}
            fill
            unoptimized
            className="object-contain p-1"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-full bg-zinc-800 text-[10px] font-black uppercase text-white">
            {team?.shortName?.slice(0, 3) || team?.name?.slice(0, 3) || "FC"}
          </div>
        )}
      </div>
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold text-zinc-100">
          {team?.name || "Team TBD"}
        </div>
      </div>
    </div>
  );
}

function StatusPill({ status, minute }) {
  const state = status?.state || "scheduled";
  const tone = {
    live: "bg-rose-500/20 text-rose-400 border-rose-500/30",
    completed: "bg-zinc-700/40 text-zinc-400 border-zinc-600/30",
    postponed: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    cancelled: "bg-zinc-700/40 text-zinc-500 border-zinc-600/30",
    scheduled: "bg-green-500/10 text-green-400 border-green-500/20",
  }[state] || "bg-green-500/10 text-green-400 border-green-500/20";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] ${tone}`}
    >
      {state === "live" && <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />}
      {state === "live" && minute ? `${minute}'` : status?.short || "NS"}
    </span>
  );
}

function MatchCard({ match, index }) {
  const hasScore =
    match?.score?.home !== null &&
    match?.score?.home !== undefined &&
    match?.score?.away !== null &&
    match?.score?.away !== undefined;

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: index * 0.03 }}
      className="grid gap-4 border-t border-white/5 px-4 py-5 sm:grid-cols-[1fr_auto] sm:px-6 hover:bg-white/[0.02] transition-colors"
    >
      <div className="grid gap-3">
        <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-zinc-500">
          <span>{match.weekLabel}</span>
          <span className="h-1 w-1 rounded-full bg-zinc-700" />
          <span>{match.competitionPhase}</span>
        </div>
        <div className="grid gap-3">
          <div className="flex items-center justify-between gap-4">
            <TeamBadge team={match.home} />
            <div className="min-w-[52px] text-right text-lg font-black text-white">
              {hasScore ? match.score.home : "-"}
            </div>
          </div>
          <div className="flex items-center justify-between gap-4">
            <TeamBadge team={match.away} />
            <div className="min-w-[52px] text-right text-lg font-black text-white">
              {hasScore ? match.score.away : "-"}
            </div>
          </div>
        </div>
      </div>
      <div className="flex min-w-[140px] flex-col items-start justify-between gap-3 sm:items-end">
        <div className="flex flex-wrap items-center gap-2">
          <StatusPill status={match.status} minute={match.minute} />
          {match.provider === "isports" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-green-400 border border-green-500/20">
              <FaBroadcastTower size={9} />
              Live
            </span>
          )}
        </div>
        <div className="text-sm font-semibold text-zinc-200">
          {match.kickoffLabel}
        </div>
        <div className="max-w-[180px] text-xs text-zinc-500 text-right">
          {match.venue || "Venue status pending"}
        </div>
      </div>
    </motion.article>
  );
}

function NewsGrid({ articles, videos }) {
  return (
    <div className="space-y-10 px-4 py-8">
      {videos?.length > 0 && (
        <section>
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-green-400 mb-6">Trending Highlights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <a key={video.id} href={video.url} target="_blank" rel="noreferrer" className="group block space-y-3">
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-zinc-900 border border-white/5">
                  <Image src={video.thumbnail} alt={video.title} fill className="object-cover opacity-80 transition group-hover:scale-105 group-hover:opacity-100" unoptimized />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition flex items-center justify-center">
                    <div className="w-12 h-12 bg-green-500/90 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition">
                      <FaPlay className="text-black ml-1" size={16} />
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-200 line-clamp-2 leading-snug group-hover:text-green-400 transition-colors">{video.title}</h4>
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mt-1">{video.reactor?.name || video.channelName}</p>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {articles?.length > 0 && (
        <section>
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-green-400 mb-6">Latest Intelligence</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {articles.map((article) => (
              <a key={article.url} href={article.url} target="_blank" rel="noreferrer" className="flex gap-4 p-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-green-500/20 hover:bg-white/[0.04] transition group">
                {article.image && (
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-zinc-900">
                    <Image src={article.image} alt="" fill className="object-cover" unoptimized />
                  </div>
                )}
                <div className="flex flex-col justify-between py-1">
                  <div>
                    <h4 className="text-sm font-bold text-zinc-200 line-clamp-2 leading-snug group-hover:text-green-400 transition">{article.title}</h4>
                    <p className="text-[11px] text-zinc-500 line-clamp-2 mt-1">{article.summary}</p>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mt-2">{article.source}</span>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default function FootballFixturesHub({ slug = "premier-league" }) {
  const [meta, setMeta] = useState(null);
  const [matchesPayload, setMatchesPayload] = useState(null);
  const [newsPayload, setNewsPayload] = useState(null);
  const [activeTab, setActiveTab] = useState("matches");
  const [loading, setLoading] = useState(true);
  const [newsLoading, setNewsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    async function loadData() {
      try {
        const metaRes = await fetch(`/api/football/league/${slug}/meta`);
        const metaData = await metaRes.json();
        if (!metaRes.ok) throw new Error(metaData.error || "Failed to load league");

        const matchesRes = await fetch(`/api/football/league/${slug}/matches`);
        const matchesData = await matchesRes.json();
        if (!matchesRes.ok) throw new Error(matchesData.error || "Failed to load matches");

        if (!cancelled) {
          setMeta(metaData);
          setMatchesPayload(matchesData);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      }
    }

    loadData();
    return () => { cancelled = true; };
  }, [slug]);

  useEffect(() => {
    if (activeTab !== "news" || newsPayload || !meta) return;
    
    let cancelled = false;
    setNewsLoading(true);
    
    fetch(`/api/football/league/${slug}/news`)
      .then(r => r.json())
      .then(data => {
        if (!cancelled) {
          setNewsPayload(data);
          setNewsLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setNewsLoading(false);
      });

    return () => { cancelled = true; };
  }, [activeTab, slug, meta, newsPayload]);

  if (loading) {
    return (
      <div
        className="min-h-[400px] flex flex-col items-center justify-center gap-4 rounded-[32px] border"
        style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(74,222,128,0.08)" }}
      >
        <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
        <div className="text-zinc-500 text-xs font-black uppercase tracking-widest animate-pulse">
          Synchronizing Hub...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="p-8 text-center rounded-[32px] border"
        style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.05)" }}
      >
        <h3 className="text-lg font-black text-white uppercase tracking-widest mb-2">Network Isolated</h3>
        <p className="text-zinc-500 text-sm mb-6">{error}</p>
        <button onClick={() => window.location.reload()} className="px-6 py-3 bg-green-500 text-black font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-green-400 transition">
          Retry Sync
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between px-2">
        <div className="flex items-center gap-5">
          <div
            className="relative h-16 w-16 overflow-hidden rounded-[22px] p-3 shadow-lg"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            {meta?.league?.logo && (
              <Image src={meta.league.logo} alt={meta.league.name} fill className="object-contain p-2" unoptimized />
            )}
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white uppercase">{meta?.league?.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-green-400/60">Powered by iSports</span>
            </div>
          </div>
        </div>
        
        <div
          className="flex p-1 rounded-2xl border self-start"
          style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.06)" }}
        >
          {[
            { key: "matches", label: "Matches", icon: FaCalendarAlt },
            { key: "news", label: "News & Clips", icon: FaNewspaper }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                activeTab === tab.key
                  ? "bg-green-500 text-black shadow-sm shadow-green-500/30"
                  : "text-zinc-500 hover:text-white"
              }`}
            >
              <tab.icon size={11} />
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <div
        className="overflow-hidden rounded-[32px] border shadow-2xl"
        style={{
          background: "rgba(255,255,255,0.02)",
          borderColor: "rgba(74,222,128,0.06)",
          boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
        }}
      >
        <AnimatePresence mode="wait">
          {activeTab === "matches" ? (
            <motion.div
              key="matches"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div
                className="px-6 py-4 border-b flex items-center justify-between"
                style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.05)" }}
              >
                  <h2 className="text-sm font-black uppercase tracking-widest text-white">Active Match Window</h2>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-green-400 uppercase tracking-widest bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                      Live Hub Active
                  </div>
              </div>
              
              {matchesPayload?.groups?.length ? (
                <div className="divide-y divide-white/5">
                  {matchesPayload.groups.map((group) => (
                    <div key={group.dateKey}>
                      <div
                        className="px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-green-400/60 sm:px-6"
                        style={{ background: "rgba(255,255,255,0.01)" }}
                      >
                        {group.dateLabel}
                      </div>
                      <div>
                        {group.matches.map((match, idx) => (
                          <MatchCard key={match.id} match={match} index={idx} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center">
                  <FaTrophy className="mx-auto text-zinc-700 mb-4" size={48} />
                  <p className="text-zinc-500 text-sm font-black uppercase tracking-widest">No fixtures found for this window</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="news"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {newsLoading ? (
                <div className="py-20 flex flex-col items-center gap-4">
                  <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 animate-pulse">Scanning Global Feeds...</p>
                </div>
              ) : (
                <NewsGrid articles={newsPayload?.articles} videos={newsPayload?.videos} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
