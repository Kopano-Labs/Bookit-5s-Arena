'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FaTrophy, FaArrowRight, FaFutbol } from 'react-icons/fa';

/* World Cup team logos from the tournament assets */
const TEAMS = [
  { name: 'Lionel Messi', logo: '/images/tournment/worldcup-logos/lionel-messi-team.jpg' },
  { name: 'Cristiano Ronaldo', logo: '/images/tournment/worldcup-logos/cristiano-ronaldo-team.jpg' },
  { name: 'Kylian Mbappé', logo: '/images/tournment/worldcup-logos/kylian-mbappe-team.jpg' },
  { name: 'Vinícius Jr', logo: '/images/tournment/worldcup-logos/vinícius-jr-team.jpg' },
  { name: 'Lamine Yamal', logo: '/images/tournment/worldcup-logos/lamine-yamal-team.jpg' },
  { name: 'Harry Kane', logo: '/images/tournment/worldcup-logos/harry-kane-team.jpg' },
  { name: 'Florian Wirtz', logo: '/images/tournment/worldcup-logos/florian-wirtz-team.jpg' },
  { name: 'Son Heung-Min', logo: '/images/tournment/worldcup-logos/son-heung-min-team.jpg' },
];

export default function TournamentSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background Banner */}
      <div className="absolute inset-0 relative">
        <Image
          src="/images/tournment/backgrounds/homepage-background-banner.jpg"
          alt="Tournament Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950/80 via-gray-950/60 to-gray-950/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/20 via-transparent to-green-900/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 md:py-32">
        <div className="text-center mb-16">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-600/20 border border-green-500/30 text-green-400 text-xs font-bold uppercase tracking-widest mb-6"
              animate={{ boxShadow: ['0 0 0px rgba(34,197,94,0)', '0 0 20px rgba(34,197,94,0.3)', '0 0 0px rgba(34,197,94,0)'] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <FaTrophy size={10} /> NEW — INAUGURAL TOURNAMENT
            </motion.div>

            <h2
              className="font-black uppercase leading-tight mb-6"
              style={{ fontSize: 'clamp(2rem, 6vw, 4.5rem)', fontFamily: 'Impact, Arial Black, sans-serif' }}
            >
              <span className="text-white">5s ARENA</span>{' '}
              <span className="text-green-400">WORLD CUP</span>
            </h2>

            <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-2">
              Choose your nation. Build your squad. Compete for glory.
            </p>
            <p className="text-gray-500 text-sm">
              May 26 – 31, 2026 · Hellenic Football Club, Milnerton · 8 Groups × 6 Teams
            </p>
          </motion.div>
        </div>

        {/* Team Logos Grid */}
        <motion.div
          className="grid grid-cols-4 md:grid-cols-8 gap-4 mb-16 max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {TEAMS.map((team, i) => (
            <motion.div
              key={team.name}
              className="relative aspect-square rounded-xl overflow-hidden border border-gray-700/50 bg-gray-800/30 backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + i * 0.05, type: 'spring', stiffness: 200 }}
              whileHover={{
                scale: 1.15,
                zIndex: 10,
                borderColor: 'rgba(74,222,128,0.6)',
                boxShadow: '0 0 30px rgba(34,197,94,0.3)',
              }}
            >
              <Image
                src={team.logo}
                alt={team.name}
                fill
                className="object-cover"
                sizes="100px"
              />
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end justify-center p-1"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              >
                <span className="text-white text-[8px] font-bold uppercase tracking-wider text-center">
                  {team.name}
                </span>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <Link href="/tournament">
            <motion.button
              className="flex items-center gap-2 px-8 py-4 rounded-xl bg-green-600 text-white font-black uppercase tracking-widest text-sm cursor-pointer"
              style={{ fontFamily: 'Impact, Arial Black, sans-serif', boxShadow: '0 0 30px rgba(34,197,94,0.4)' }}
              whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(34,197,94,0.6)' }}
              whileTap={{ scale: 0.95 }}
            >
              <FaFutbol size={16} /> Register Your Team <FaArrowRight size={12} />
            </motion.button>
          </Link>
          <Link href="/rules-of-the-game">
            <motion.button
              className="flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-600 text-gray-300 hover:text-white hover:border-green-500 font-bold uppercase tracking-widest text-xs transition-all cursor-pointer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Read the Rules
            </motion.button>
          </Link>
        </motion.div>

        {/* Floating decorative footballs */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-green-500/10 pointer-events-none"
            style={{
              top: `${20 + i * 15}%`,
              left: i % 2 === 0 ? `${5 + i * 3}%` : 'auto',
              right: i % 2 !== 0 ? `${5 + i * 3}%` : 'auto',
            }}
            animate={{
              y: [0, -15, 0],
              rotate: [0, 360],
            }}
            transition={{
              y: { duration: 3 + i, repeat: Infinity, ease: 'easeInOut' },
              rotate: { duration: 8 + i * 2, repeat: Infinity, ease: 'linear' },
            }}
          >
            <FaFutbol size={20 + i * 5} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
