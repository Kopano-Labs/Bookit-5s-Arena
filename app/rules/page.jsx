'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaFutbol, FaUsers, FaClock, FaHandPaper,
  FaFlag, FaExclamationTriangle, FaTrophy, FaShieldAlt,
  FaChevronDown, FaArrowRight,
} from 'react-icons/fa';

/* ─── section data ──────────────────────────────────────────── */
const SECTIONS = [
  {
    id: 'format',
    icon: <FaFutbol />,
    title: 'Game Format',
    content: [
      '5 players per team — 4 outfield players and 1 goalkeeper.',
      'Matches are played in 2 x 20-minute halves.',
      'There is a 2-minute half-time break between halves.',
      'A coin toss determines which team kicks off first.',
    ],
  },
  {
    id: 'pitch',
    icon: <FaFlag />,
    title: 'The Pitch',
    content: [
      'Games are played on synthetic turf enclosed by perimeter nets.',
      'The ball remains in play off the side nets — no throw-ins.',
      'There is no offside rule in 5-a-side.',
      'Boundary lines are marked for goal areas and the halfway line.',
    ],
  },
  {
    id: 'kickoff',
    icon: <FaClock />,
    title: 'Kick-Off & Restarts',
    content: [
      'Kick-offs are taken from the centre spot at the start of each half and after a goal.',
      'Goal kicks are distributed from the goalkeeper\'s hands.',
      'Corners are taken from the corner of the pitch.',
      'After a foul, the restart is an indirect free kick from where the infringement occurred.',
    ],
  },
  {
    id: 'fouls',
    icon: <FaExclamationTriangle />,
    title: 'Fouls & Fair Play',
    content: [
      'Slide tackles are strictly prohibited.',
      'No shoulder charges or overly physical challenges.',
      'All fouls result in an indirect free kick to the opposing team.',
      'A yellow/red card system is in place — 2 yellows = a red.',
      'A red card results in the player being sent off for the remainder of the match; the team plays with one fewer player for 2 minutes.',
    ],
  },
  {
    id: 'goalkeeping',
    icon: <FaHandPaper />,
    title: 'Goalkeeping',
    content: [
      'The goalkeeper cannot cross the halfway line.',
      'Goalkeepers may only use their hands inside their own penalty area.',
      'Distribution can be by throw or kick, but must not cross the halfway line without bouncing.',
      'Back-passes to the keeper may not be picked up by hand.',
    ],
  },
  {
    id: 'subs',
    icon: <FaUsers />,
    title: 'Substitutions',
    content: [
      'Rolling substitutions are allowed — players can be swapped on and off at any time.',
      'There is no limit on the number of substitutions.',
      'All substitutions must be made from the designated sub zone at the halfway line.',
      'The outgoing player must leave the pitch before the incoming player enters.',
    ],
  },
  {
    id: 'scoring',
    icon: <FaTrophy />,
    title: 'Scoring',
    content: [
      'Goals can be scored from anywhere on the pitch.',
      'The ball must fully cross the goal line between the posts and under the crossbar to count.',
      'Goals directly from a kick-off or goal kick are allowed.',
      'In the event of a draw, a "golden goal" extra-time period or penalties may apply (tournament rules).',
    ],
  },
  {
    id: 'equipment',
    icon: <FaShieldAlt />,
    title: 'Equipment',
    content: [
      'Shin guards are strongly recommended for all players.',
      'Metal studs are not permitted — moulded studs, astro-turfs, or trainers only.',
      'Bibs/pinnies are provided by the venue for team identification.',
      'No jewellery, watches, or accessories that could cause injury.',
    ],
  },
];

/* ─── accordion card ────────────────────────────────────────── */
function RuleCard({ section, index, isOpen, onToggle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden"
    >
      {/* header / toggle */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 px-6 py-5 text-left cursor-pointer
                   hover:bg-gray-800/50 transition-colors duration-200"
      >
        <span className="text-green-400 text-2xl shrink-0">{section.icon}</span>
        <span className="flex-1 text-lg font-bold tracking-wide">{section.title}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="text-gray-500 text-sm"
        >
          <FaChevronDown />
        </motion.span>
      </button>

      {/* expandable body */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <ul className="px-6 pb-6 space-y-3 border-t border-gray-800 pt-4">
              {section.content.map((line, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="flex items-start gap-3 text-gray-300 text-sm leading-relaxed"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-green-500 shrink-0" />
                  {line}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── page component ────────────────────────────────────────── */
export default function RulesPage() {
  const [openId, setOpenId] = useState(null);

  const toggle = (id) => setOpenId((prev) => (prev === id ? null : id));

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* ── hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-20 px-4 text-center">
        {/* decorative gradient blob */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] rounded-full bg-green-500/5 blur-[120px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 max-w-2xl mx-auto"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <FaFutbol className="text-green-400 text-3xl" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight uppercase mb-4">
            Rules of the Game
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto leading-relaxed">
            At Bookit 5s Arena we play hard but fair. Familiarise yourself with the
            house rules so everyone has a great time on the pitch.
          </p>
        </motion.div>
      </section>

      {/* ── rules accordion ──────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-4 pb-12 space-y-4">
        {SECTIONS.map((section, i) => (
          <RuleCard
            key={section.id}
            section={section}
            index={i}
            isOpen={openId === section.id}
            onToggle={() => toggle(section.id)}
          />
        ))}
      </section>

      {/* ── bottom CTA ───────────────────────────────────────── */}
      <section className="pb-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center bg-gray-900 border border-gray-800 rounded-2xl p-10"
        >
          <h2 className="text-2xl font-bold mb-3">Ready to play?</h2>
          <p className="text-gray-400 mb-6">
            Now that you know the rules, grab your squad and book a court.
          </p>
          <Link
            href="/#courts"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400
                       text-gray-950 font-bold px-8 py-3 rounded-xl transition-colors duration-200"
          >
            Book a Court Now <FaArrowRight />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
