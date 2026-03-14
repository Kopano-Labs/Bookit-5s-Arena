'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaTrophy,
  FaFutbol,
  FaNewspaper,
  FaPlayCircle,
  FaPlay,
  FaClock,
  FaExternalLinkAlt,
} from 'react-icons/fa';

// ─── Mock Data ──────────────────────────────────────────────
const mockMatches = [
  // Premier League
  { id: 1, league: 'PL', home: 'Arsenal', away: 'Chelsea', homeScore: 2, awayScore: 1, status: 'IN_PLAY', minute: 67 },
  { id: 2, league: 'PL', home: 'Manchester City', away: 'Liverpool', homeScore: 1, awayScore: 1, status: 'IN_PLAY', minute: 34 },
  { id: 3, league: 'PL', home: 'Tottenham', away: 'Manchester United', homeScore: 3, awayScore: 2, status: 'FINISHED' },
  { id: 4, league: 'PL', home: 'Newcastle', away: 'Aston Villa', homeScore: 1, awayScore: 0, status: 'FINISHED' },
  { id: 5, league: 'PL', home: 'Brighton', away: 'West Ham', homeScore: null, awayScore: null, status: 'TIMED', kickoff: '17:30' },
  { id: 6, league: 'PL', home: 'Everton', away: 'Wolves', homeScore: null, awayScore: null, status: 'TIMED', kickoff: '20:00' },
  // La Liga
  { id: 7, league: 'LL', home: 'Barcelona', away: 'Atletico Madrid', homeScore: 3, awayScore: 1, status: 'FINISHED' },
  { id: 8, league: 'LL', home: 'Real Madrid', away: 'Sevilla', homeScore: 2, awayScore: 0, status: 'IN_PLAY', minute: 78 },
];

const mockNews = [
  {
    id: 1,
    title: 'Arsenal Close Gap on Man City After Dominant Derby Win',
    summary: 'The Gunners produced a masterclass at the Emirates as they narrowed the gap at the top of the Premier League table.',
    date: '14 Mar 2026',
    gradient: 'from-red-900 to-red-700',
  },
  {
    id: 2,
    title: 'Barcelona Secure El Clasico Bragging Rights',
    summary: 'Lamine Yamal scored a brace as Barcelona dismantled Real Madrid at the Camp Nou in a thrilling encounter.',
    date: '13 Mar 2026',
    gradient: 'from-blue-900 to-red-800',
  },
  {
    id: 3,
    title: 'Premier League Transfer Window: Top 10 Signings Ranked',
    summary: 'We break down the most impactful transfers of the January window and how they have fared so far this season.',
    date: '12 Mar 2026',
    gradient: 'from-purple-900 to-indigo-800',
  },
  {
    id: 4,
    title: 'Liverpool Manager Addresses Champions League Ambitions',
    summary: 'With the knockout rounds approaching, the Reds boss laid out his tactical blueprint for European glory.',
    date: '11 Mar 2026',
    gradient: 'from-red-800 to-red-600',
  },
  {
    id: 5,
    title: 'La Liga Title Race: Three Teams Separated by Two Points',
    summary: 'Barcelona, Real Madrid, and Atletico Madrid are locked in the tightest title race in a decade.',
    date: '10 Mar 2026',
    gradient: 'from-orange-900 to-yellow-800',
  },
  {
    id: 6,
    title: 'VAR Controversy Overshadows North London Derby',
    summary: 'A late penalty decision has reignited the debate around VAR after a dramatic finish at the Tottenham Hotspur Stadium.',
    date: '9 Mar 2026',
    gradient: 'from-gray-800 to-gray-600',
  },
];

const highlightVideos = [
  { id: 'video1', title: 'Arsenal vs Chelsea | Premier League Highlights', embedId: 'dQw4w9WgXcQ' },
  { id: 'video2', title: 'Barcelona vs Real Madrid | El Clasico Highlights', embedId: '3JZ_D3ELwOQ' },
  { id: 'video3', title: 'Man City vs Liverpool | Top 4 Clash Highlights', embedId: 'L_jWHffIx5E' },
  { id: 'video4', title: 'Tottenham vs Man United | 5-Goal Thriller', embedId: '2Vv-BfVoq4g' },
  { id: 'video5', title: 'La Liga Top Goals of the Week | Matchday 28', embedId: 'fJ9rUzIMcZQ' },
  { id: 'video6', title: 'Premier League Best Saves | Matchday 30', embedId: 'kJQP7kiw5Fk' },
];

// ─── Helpers ────────────────────────────────────────────────
const leagueBadge = (league) => {
  if (league === 'PL') {
    return (
      <div className="w-7 h-7 rounded-full bg-purple-700 flex items-center justify-center text-[9px] font-black text-white tracking-tight flex-shrink-0">
        PL
      </div>
    );
  }
  return (
    <div className="w-7 h-7 rounded-full bg-orange-600 flex items-center justify-center text-[9px] font-black text-white tracking-tight flex-shrink-0">
      LL
    </div>
  );
};

const statusBadge = (match) => {
  if (match.status === 'IN_PLAY') {
    return (
      <motion.div
        className="flex items-center gap-1.5"
        animate={{ opacity: [1, 0.5, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.7)]" />
        <span className="text-[10px] font-black text-red-400 uppercase tracking-wider">
          LIVE {match.minute}&apos;
        </span>
      </motion.div>
    );
  }
  if (match.status === 'FINISHED') {
    return (
      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider bg-gray-800 px-2 py-0.5 rounded">
        FT
      </span>
    );
  }
  return (
    <div className="flex items-center gap-1">
      <FaClock size={9} className="text-gray-500" />
      <span className="text-[10px] font-bold text-gray-400 tracking-wider">
        {match.kickoff}
      </span>
    </div>
  );
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4 },
  }),
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

// ─── API Helpers ────────────────────────────────────────────
const API_BASE = 'https://api.football-data.org/v4';

const mapApiStatus = (status) => {
  if (status === 'IN_PLAY' || status === 'PAUSED' || status === 'HALFTIME') return 'IN_PLAY';
  if (status === 'FINISHED') return 'FINISHED';
  return 'TIMED';
};

const mapApiMatch = (m) => ({
  id: m.id,
  league: m.competition?.code === 'PD' ? 'LL' : 'PL',
  home: m.homeTeam?.shortName || m.homeTeam?.name || 'Home',
  away: m.awayTeam?.shortName || m.awayTeam?.name || 'Away',
  homeScore: m.score?.fullTime?.home ?? m.score?.halfTime?.home ?? null,
  awayScore: m.score?.fullTime?.away ?? m.score?.halfTime?.away ?? null,
  status: mapApiStatus(m.status),
  minute: m.minute || null,
  kickoff: m.utcDate
    ? new Date(m.utcDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : null,
});

async function fetchLiveMatches(apiKey) {
  const headers = { 'X-Auth-Token': apiKey };
  const [plRes, llRes] = await Promise.allSettled([
    fetch(`${API_BASE}/competitions/PL/matches?status=LIVE,SCHEDULED,FINISHED&matchday=`, { headers }),
    fetch(`${API_BASE}/competitions/PD/matches?status=LIVE,SCHEDULED,FINISHED&matchday=`, { headers }),
  ]);

  const results = [];

  if (plRes.status === 'fulfilled' && plRes.value.ok) {
    const data = await plRes.value.json();
    if (data.matches) results.push(...data.matches.map(mapApiMatch));
  }
  if (llRes.status === 'fulfilled' && llRes.value.ok) {
    const data = await llRes.value.json();
    if (data.matches) results.push(...data.matches.map(mapApiMatch));
  }

  return results.length > 0 ? results : null;
}

// ─── Component ──────────────────────────────────────────────
const FixturesPage = () => {
  const [tab, setTab] = useState('scores');
  const [matches, setMatches] = useState(mockMatches);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isLiveApi, setIsLiveApi] = useState(false);

  const loadMatches = useCallback(async () => {
    const apiKey = typeof window !== 'undefined'
      ? process.env.NEXT_PUBLIC_FOOTBALL_API_KEY
      : null;

    if (!apiKey) {
      setMatches(mockMatches);
      setLastUpdated(new Date());
      return;
    }

    try {
      const liveData = await fetchLiveMatches(apiKey);
      if (liveData) {
        setMatches(liveData);
        setIsLiveApi(true);
      } else {
        setMatches(mockMatches);
      }
    } catch {
      setMatches(mockMatches);
    }
    setLastUpdated(new Date());
  }, []);

  useEffect(() => {
    loadMatches();
    const interval = setInterval(loadMatches, 60000);
    return () => clearInterval(interval);
  }, [loadMatches]);

  const tabs = [
    { key: 'scores', label: 'LIVE SCORES', icon: <FaFutbol size={12} /> },
    { key: 'news', label: 'NEWS', icon: <FaNewspaper size={12} /> },
    { key: 'highlights', label: 'HIGHLIGHTS', icon: <FaPlayCircle size={12} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-950 py-10 px-4">
      <div className="max-w-5xl mx-auto">

        {/* ── Hero ──────────────────────────────────────────── */}
        <motion.div
          className="text-center mb-10 relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Animated gradient blob */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-32 rounded-full blur-3xl pointer-events-none"
            style={{ background: 'radial-gradient(ellipse, rgba(34,197,94,0.15), transparent 70%)' }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />

          <div className="relative z-10">
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-900/30 border border-green-800/50 mb-5"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <FaTrophy className="text-2xl text-green-400" />
            </motion.div>
            <h1
              className="text-4xl md:text-5xl font-black uppercase tracking-widest text-white"
              style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}
            >
              Live Fixtures
            </h1>
            <p className="text-gray-500 text-sm mt-2 max-w-md mx-auto">
              Stay up to date with Premier League &amp; La Liga action
            </p>

            {/* Last updated */}
            <motion.div
              className="mt-4 flex items-center justify-center gap-2 text-[10px] text-gray-600 uppercase tracking-wider"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <FaClock size={9} />
              <span>
                Last updated: {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                {isLiveApi && (
                  <span className="ml-2 text-green-500 font-bold">LIVE API</span>
                )}
                {!isLiveApi && (
                  <span className="ml-2 text-gray-600">MOCK DATA</span>
                )}
              </span>
            </motion.div>
          </div>
        </motion.div>

        {/* ── Tabs ──────────────────────────────────────────── */}
        <motion.div
          className="flex flex-wrap justify-center gap-2 mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          {tabs.map((t) => (
            <motion.button
              key={t.key}
              onClick={() => setTab(t.key)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all cursor-pointer ${
                tab === t.key
                  ? 'bg-green-900/40 text-green-400 border border-green-700'
                  : 'bg-gray-900 text-gray-400 border border-gray-800 hover:border-gray-700 hover:text-gray-300'
              }`}
            >
              {t.icon} {t.label}
            </motion.button>
          ))}
        </motion.div>

        {/* ── Tab Content ───────────────────────────────────── */}
        <AnimatePresence mode="wait">

          {/* ── LIVE SCORES ──────────────────────────────────── */}
          {tab === 'scores' && (
            <motion.div
              key="scores"
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -16, transition: { duration: 0.2 } }}
              variants={staggerContainer}
              className="space-y-3"
            >
              {matches.map((match, i) => (
                <motion.div
                  key={match.id}
                  custom={i}
                  variants={cardVariants}
                  whileHover={{ scale: 1.015, transition: { duration: 0.2 } }}
                  className={`bg-gray-900 border rounded-2xl p-4 md:p-5 shadow-lg transition-colors ${
                    match.status === 'IN_PLAY'
                      ? 'border-red-800/50 bg-gray-900/80'
                      : 'border-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-3 md:gap-4">
                    {/* League badge */}
                    {leagueBadge(match.league)}

                    {/* Match details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        {/* Home team */}
                        <div className="flex-1 text-right">
                          <p className="text-sm md:text-base font-bold text-white truncate">
                            {match.home}
                          </p>
                        </div>

                        {/* Score */}
                        <div className="flex-shrink-0 mx-2 md:mx-4">
                          {match.status === 'TIMED' ? (
                            <motion.span
                              className="text-sm font-bold text-gray-500"
                              animate={{ opacity: [0.5, 1, 0.5] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              vs
                            </motion.span>
                          ) : (
                            <motion.div
                              className="flex items-center gap-1.5"
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ delay: i * 0.05, type: 'spring', stiffness: 300 }}
                            >
                              <span className="text-2xl md:text-3xl font-black text-green-400 tabular-nums">
                                {match.homeScore}
                              </span>
                              <span className="text-lg text-gray-600 font-bold">-</span>
                              <span className="text-2xl md:text-3xl font-black text-green-400 tabular-nums">
                                {match.awayScore}
                              </span>
                            </motion.div>
                          )}
                        </div>

                        {/* Away team */}
                        <div className="flex-1 text-left">
                          <p className="text-sm md:text-base font-bold text-white truncate">
                            {match.away}
                          </p>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="text-center mt-1.5">
                        {statusBadge(match)}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* ── NEWS ─────────────────────────────────────────── */}
          {tab === 'news' && (
            <motion.div
              key="news"
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -16, transition: { duration: 0.2 } }}
              variants={staggerContainer}
              className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
            >
              {mockNews.map((article, i) => (
                <motion.div
                  key={article.id}
                  custom={i}
                  variants={staggerItem}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-lg group cursor-pointer"
                >
                  {/* Gradient thumbnail */}
                  <div className={`h-32 bg-gradient-to-br ${article.gradient} relative overflow-hidden`}>
                    <motion.div
                      className="absolute inset-0 bg-black/20"
                      whileHover={{ opacity: 0 }}
                    />
                    <div className="absolute bottom-3 left-3">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-white/70 bg-black/30 px-2 py-1 rounded">
                        {article.date}
                      </span>
                    </div>
                    <motion.div
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      whileHover={{ scale: 1.2 }}
                    >
                      <FaExternalLinkAlt size={10} className="text-green-400" />
                    </motion.div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="text-sm font-bold text-white mb-2 leading-snug line-clamp-2 group-hover:text-green-400 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-3">
                      {article.summary}
                    </p>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-green-500 group-hover:text-green-400 transition-colors">
                      Read More &rarr;
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* ── HIGHLIGHTS ───────────────────────────────────── */}
          {tab === 'highlights' && (
            <motion.div
              key="highlights"
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -16, transition: { duration: 0.2 } }}
              variants={staggerContainer}
              className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
            >
              {highlightVideos.map((video, i) => (
                <motion.div
                  key={video.id}
                  custom={i}
                  variants={staggerItem}
                  whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                  className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-lg group"
                >
                  {/* Video embed */}
                  <div className="relative aspect-video bg-gray-800">
                    <iframe
                      src={`https://www.youtube.com/embed/${video.embedId}`}
                      title={video.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                      loading="lazy"
                    />
                    {/* Play overlay (visible until hover) */}
                    <motion.div
                      className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none group-hover:opacity-0 transition-opacity duration-300"
                    >
                      <motion.div
                        className="w-14 h-14 rounded-full bg-green-500/80 flex items-center justify-center"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                      >
                        <FaPlay size={18} className="text-white ml-1" />
                      </motion.div>
                    </motion.div>
                  </div>

                  {/* Title */}
                  <div className="p-3">
                    <h3 className="text-xs font-bold text-gray-300 leading-snug group-hover:text-green-400 transition-colors">
                      {video.title}
                    </h3>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FixturesPage;
