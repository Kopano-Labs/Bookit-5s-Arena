'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaTrophy,
  FaCalendarAlt,
  FaUsers,
  FaListOl,
  FaQuestionCircle,
  FaWhatsapp,
  FaChevronDown,
  FaChevronUp,
  FaMedal,
} from 'react-icons/fa';

// ─── mock data ──────────────────────────────────────────────
const leagues = [
  {
    id: 1,
    name: 'Monday Night League',
    day: 'Monday',
    time: '7pm – 10pm',
    level: 'Competitive',
    price: 'R800',
    teamsRegistered: 8,
    totalSlots: 10,
    startDate: '7 April 2026',
    accent: 'green',
  },
  {
    id: 2,
    name: 'Wednesday Social League',
    day: 'Wednesday',
    time: '6pm – 9pm',
    level: 'Social / Mixed',
    price: 'R600',
    teamsRegistered: 6,
    totalSlots: 10,
    startDate: '9 April 2026',
    accent: 'cyan',
  },
  {
    id: 3,
    name: 'Saturday Morning League',
    day: 'Saturday',
    time: '9am – 12pm',
    level: 'All Levels',
    price: 'R700',
    teamsRegistered: 10,
    totalSlots: 10,
    startDate: '12 April 2026',
    accent: 'yellow',
  },
];

const standings = [
  { pos: 1, team: 'West Coast Warriors', p: 14, w: 11, d: 2, l: 1, gf: 42, ga: 14 },
  { pos: 2, team: 'Parklands United',    p: 14, w: 10, d: 2, l: 2, gf: 38, ga: 18 },
  { pos: 3, team: 'Table Bay FC',        p: 14, w: 9,  d: 3, l: 2, gf: 35, ga: 19 },
  { pos: 4, team: 'Milnerton FC',        p: 14, w: 7,  d: 4, l: 3, gf: 29, ga: 22 },
  { pos: 5, team: 'Blouberg Strikers',   p: 14, w: 6,  d: 3, l: 5, gf: 25, ga: 24 },
  { pos: 6, team: 'Cape Crusaders',      p: 14, w: 4,  d: 3, l: 7, gf: 20, ga: 30 },
  { pos: 7, team: 'Durbanville Dynamos', p: 14, w: 2,  d: 4, l: 8, gf: 16, ga: 33 },
  { pos: 8, team: 'Bellville City',      p: 14, w: 1,  d: 1, l: 12, gf: 10, ga: 45 },
];

const faqItems = [
  {
    q: 'How long are matches?',
    a: 'Each match consists of two 20-minute halves with a 5-minute half-time break.',
  },
  {
    q: 'What if we can\'t make a week?',
    a: 'Teams can request a reschedule up to 48 hours before the match. Otherwise the fixture will count as a forfeit (0-3 loss).',
  },
  {
    q: 'Can individuals join without a team?',
    a: 'Yes! Post an ad on our Find Players page and we\'ll help match you with a team looking for players.',
  },
  {
    q: 'When is the registration deadline?',
    a: 'Registration closes one week before each league\'s start date. Payment must be received in full before the first match.',
  },
];

// ─── helpers ────────────────────────────────────────────────
const accentMap = {
  green:  { border: 'border-green-700',  bg: 'bg-green-900/20', text: 'text-green-400',  dot: 'bg-green-400' },
  cyan:   { border: 'border-cyan-700',   bg: 'bg-cyan-900/20',  text: 'text-cyan-400',   dot: 'bg-cyan-400' },
  yellow: { border: 'border-yellow-700', bg: 'bg-yellow-900/20', text: 'text-yellow-400', dot: 'bg-yellow-400' },
};

const posColour = (pos) => {
  if (pos === 1) return 'text-yellow-400';
  if (pos === 2) return 'text-gray-300';
  if (pos === 3) return 'text-amber-600';
  return 'text-gray-500';
};

const posIcon = (pos) => {
  if (pos <= 3) return <FaMedal size={12} className={posColour(pos)} />;
  return <span className="text-gray-600 text-xs font-bold">{pos}</span>;
};

const rowBg = (pos) => {
  if (pos === 1) return 'bg-yellow-900/10 border-yellow-800/40';
  if (pos === 2) return 'bg-gray-800/30 border-gray-700/40';
  if (pos === 3) return 'bg-amber-900/10 border-amber-800/40';
  return 'border-gray-800/40';
};

const cardVariants = {
  hidden:  { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4 },
  }),
};

// ─── component ──────────────────────────────────────────────
const LeaguesPage = () => {
  const [tab, setTab] = useState('season');
  const [openFaq, setOpenFaq] = useState(null);

  const tabs = [
    { key: 'season',   label: 'CURRENT SEASON', icon: <FaCalendarAlt size={12} /> },
    { key: 'standings', label: 'STANDINGS',       icon: <FaListOl size={12} /> },
    { key: 'join',     label: 'HOW TO JOIN',     icon: <FaQuestionCircle size={12} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-950 py-10 px-4">
      <div className="max-w-5xl mx-auto">

        {/* ── Hero ──────────────────────────────────────────── */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-900/30 border border-yellow-800/50 mb-5">
            <FaTrophy className="text-2xl text-yellow-400" />
          </div>

          {/* Coming Soon badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-900/30 border border-red-700/50 text-red-400 text-xs font-bold uppercase tracking-widest mb-4"
            animate={{
              opacity: [1, 0.5, 1],
              boxShadow: ['0 0 0px rgba(239,68,68,0)', '0 0 15px rgba(239,68,68,0.4)', '0 0 0px rgba(239,68,68,0)'],
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
            Coming Soon — Season 1
          </motion.div>

          <h1
            className="text-4xl md:text-5xl font-black uppercase tracking-widest text-white"
            style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}
          >
            Leagues &amp; Tournaments
          </h1>
          <p className="text-gray-500 text-sm mt-2 max-w-md mx-auto">
            Compete with the best in Cape Town. Weekly 5-a-side leagues for every skill level.
          </p>
        </motion.div>

        {/* ── Tabs ──────────────────────────────────────────── */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all cursor-pointer ${
                tab === t.key
                  ? 'bg-green-900/40 text-green-400 border border-green-700'
                  : 'bg-gray-900 text-gray-400 border border-gray-800 hover:border-gray-700 hover:text-gray-300'
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* ── Tab Content ───────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {/* ─ CURRENT SEASON ─ */}
          {tab === 'season' && (
            <motion.div
              key="season"
              className="grid gap-5 md:grid-cols-3"
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -16, transition: { duration: 0.2 } }}
            >
              {leagues.map((league, i) => {
                const a = accentMap[league.accent];
                const full = league.teamsRegistered >= league.totalSlots;
                return (
                  <motion.div
                    key={league.id}
                    custom={i}
                    variants={cardVariants}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    className={`bg-gray-900 border ${a.border} rounded-2xl p-5 shadow-lg`}
                  >
                    {/* dot + name */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`w-2.5 h-2.5 rounded-full ${a.dot}`} />
                      <h3 className="text-white font-bold text-sm">{league.name}</h3>
                    </div>

                    <div className="space-y-2 text-xs text-gray-400 mb-4">
                      <p className="flex items-center gap-2">
                        <FaCalendarAlt size={10} className={a.text} />
                        {league.day} &middot; {league.time}
                      </p>
                      <p className="flex items-center gap-2">
                        <FaTrophy size={10} className={a.text} />
                        {league.level}
                      </p>
                      <p className="flex items-center gap-2">
                        <FaUsers size={10} className={a.text} />
                        {league.teamsRegistered}/{league.totalSlots} teams registered
                      </p>
                    </div>

                    {/* price + start */}
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-lg font-black text-white">{league.price}</p>
                        <p className="text-[10px] text-gray-600 uppercase tracking-wider">per team / season</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-gray-600 uppercase tracking-wider">Starts</p>
                        <p className={`text-xs font-bold ${a.text}`}>{league.startDate}</p>
                      </div>
                    </div>

                    {full && (
                      <div className="mt-3 text-center py-1.5 rounded-lg bg-red-900/30 border border-red-800/50 text-red-400 text-[10px] font-bold uppercase tracking-wider">
                        League Full
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {/* ─ STANDINGS ─ */}
          {tab === 'standings' && (
            <motion.div
              key="standings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16, transition: { duration: 0.2 } }}
              transition={{ duration: 0.45 }}
            >
              <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-lg overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-800 flex items-center gap-2">
                  <FaTrophy size={14} className="text-yellow-400" />
                  <h2
                    className="text-sm font-black uppercase tracking-widest text-white"
                    style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}
                  >
                    Monday Night League — Season 3
                  </h2>
                </div>

                {/* desktop table */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-gray-500 uppercase tracking-wider border-b border-gray-800">
                        <th className="px-4 py-3 text-left w-10">#</th>
                        <th className="px-4 py-3 text-left">Team</th>
                        <th className="px-3 py-3 text-center">P</th>
                        <th className="px-3 py-3 text-center">W</th>
                        <th className="px-3 py-3 text-center">D</th>
                        <th className="px-3 py-3 text-center">L</th>
                        <th className="px-3 py-3 text-center">GF</th>
                        <th className="px-3 py-3 text-center">GA</th>
                        <th className="px-3 py-3 text-center">GD</th>
                        <th className="px-3 py-3 text-center font-black">Pts</th>
                      </tr>
                    </thead>
                    <tbody>
                      {standings.map((row) => (
                        <motion.tr
                          key={row.pos}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: row.pos * 0.05 }}
                          className={`border-b ${rowBg(row.pos)} hover:bg-gray-800/40 transition-colors`}
                        >
                          <td className="px-4 py-3">{posIcon(row.pos)}</td>
                          <td className={`px-4 py-3 font-bold ${row.pos <= 3 ? 'text-white' : 'text-gray-400'}`}>
                            {row.team}
                          </td>
                          <td className="px-3 py-3 text-center text-gray-400">{row.p}</td>
                          <td className="px-3 py-3 text-center text-gray-400">{row.w}</td>
                          <td className="px-3 py-3 text-center text-gray-400">{row.d}</td>
                          <td className="px-3 py-3 text-center text-gray-400">{row.l}</td>
                          <td className="px-3 py-3 text-center text-gray-400">{row.gf}</td>
                          <td className="px-3 py-3 text-center text-gray-400">{row.ga}</td>
                          <td className="px-3 py-3 text-center text-gray-400">
                            {row.gf - row.ga > 0 ? '+' : ''}{row.gf - row.ga}
                          </td>
                          <td className={`px-3 py-3 text-center font-black ${row.pos <= 3 ? 'text-green-400' : 'text-gray-300'}`}>
                            {row.w * 3 + row.d}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* mobile cards */}
                <div className="sm:hidden divide-y divide-gray-800">
                  {standings.map((row) => (
                    <motion.div
                      key={row.pos}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: row.pos * 0.05 }}
                      className={`px-4 py-3 flex items-center gap-3 ${row.pos <= 3 ? 'bg-gray-800/20' : ''}`}
                    >
                      <div className="w-7 flex-shrink-0 text-center">{posIcon(row.pos)}</div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-bold truncate ${row.pos <= 3 ? 'text-white' : 'text-gray-400'}`}>
                          {row.team}
                        </p>
                        <p className="text-[10px] text-gray-600">
                          {row.p}P &middot; {row.w}W {row.d}D {row.l}L &middot; GD {row.gf - row.ga > 0 ? '+' : ''}{row.gf - row.ga}
                        </p>
                      </div>
                      <div className={`text-sm font-black ${row.pos <= 3 ? 'text-green-400' : 'text-gray-300'}`}>
                        {row.w * 3 + row.d}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ─ HOW TO JOIN ─ */}
          {tab === 'join' && (
            <motion.div
              key="join"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16, transition: { duration: 0.2 } }}
              transition={{ duration: 0.45 }}
              className="space-y-8"
            >
              {/* Steps */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { step: 1, title: 'Register Your Team', desc: 'Gather a squad of at least 7 players and pick a team name.' },
                  { step: 2, title: 'Choose Your League', desc: 'Pick the day and level that suits your team best.' },
                  { step: 3, title: 'Pay League Fee', desc: 'Secure your spot with a once-off season fee per team.' },
                  { step: 4, title: 'Show Up & Play', desc: 'Turn up on match day and compete for the title!' },
                ].map((s, i) => (
                  <motion.div
                    key={s.step}
                    custom={i}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    className="bg-gray-900 border border-gray-800 rounded-2xl p-5 text-center"
                  >
                    <div className="w-10 h-10 mx-auto rounded-full bg-green-900/30 border border-green-800/50 flex items-center justify-center text-green-400 font-black text-sm mb-3">
                      {s.step}
                    </div>
                    <h3 className="text-white font-bold text-sm mb-1">{s.title}</h3>
                    <p className="text-gray-500 text-xs leading-relaxed">{s.desc}</p>
                  </motion.div>
                ))}
              </div>

              {/* WhatsApp CTA */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="bg-gray-900 border border-green-800/50 rounded-2xl p-6 text-center"
              >
                <h3
                  className="text-lg font-black uppercase tracking-widest text-white mb-2"
                  style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}
                >
                  Ready to Register?
                </h3>
                <p className="text-gray-400 text-xs mb-5 max-w-sm mx-auto">
                  Send us a WhatsApp with your team name, captain contact details, and preferred league.
                </p>
                <a
                  href="https://wa.me/27612345678?text=Hi%2C%20we%27d%20like%20to%20register%20our%20team%20for%20the%20league"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 py-3 px-7 rounded-xl text-sm font-black text-white uppercase tracking-widest transition-all hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, #15803d 0%, #22c55e 100%)',
                    boxShadow: '0 0 24px rgba(34,197,94,0.35)',
                  }}
                >
                  <FaWhatsapp size={16} /> Register via WhatsApp
                </a>
              </motion.div>

              {/* FAQ */}
              <div>
                <h3
                  className="text-sm font-black uppercase tracking-widest text-white mb-4"
                  style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}
                >
                  Frequently Asked Questions
                </h3>

                <div className="space-y-2">
                  {faqItems.map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + idx * 0.07 }}
                      className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden"
                    >
                      <button
                        onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                        className="w-full flex items-center justify-between px-5 py-3.5 text-left cursor-pointer"
                      >
                        <span className="text-sm font-bold text-gray-300">{item.q}</span>
                        {openFaq === idx ? (
                          <FaChevronUp size={12} className="text-green-400 flex-shrink-0" />
                        ) : (
                          <FaChevronDown size={12} className="text-gray-600 flex-shrink-0" />
                        )}
                      </button>
                      <AnimatePresence>
                        {openFaq === idx && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                          >
                            <p className="px-5 pb-4 text-xs text-gray-400 leading-relaxed">
                              {item.a}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LeaguesPage;
