'use client';

import { motion } from 'framer-motion';

export default function StatsBar({ courtsCount = null, minPrice = null, courtFeedReady = false }) {
  const hasCourtCount = courtFeedReady && Number.isInteger(courtsCount) && courtsCount > 0;
  const hasPrice = courtFeedReady && Number.isFinite(minPrice) && minPrice > 0;

  const stats = [
    {
      emoji: '⚽',
      label: hasCourtCount ? 'Courts in booking' : 'Court feed',
      display: hasCourtCount ? String(courtsCount) : 'CHECK LIVE',
    },
    {
      emoji: '💰',
      label: hasPrice ? 'From / hr' : 'Current rate',
      display: hasPrice ? `R${minPrice}` : 'CHECK BOOKING',
    },
    {
      emoji: '🕙',
      label: 'Hours',
      display: 'SITE-STATED',
    },
    {
      emoji: '📍',
      label: 'Location',
      display: 'Milnerton, CPT',
    },
  ];

  return (
    <div className="bg-black text-white py-7 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="flex flex-col items-center gap-1"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
            >
              <span className="text-2xl leading-none mb-1">{stat.emoji}</span>
              <span
                className="font-black text-xl sm:text-2xl text-white leading-none"
                style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}
              >
                {stat.display}
              </span>
              <span className="text-gray-400 text-xs uppercase tracking-widest">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
