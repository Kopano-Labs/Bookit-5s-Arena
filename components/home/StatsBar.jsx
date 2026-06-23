'use client';

import { motion } from 'framer-motion';

export default function StatsBar({ courtsCount = 4 }) {
  const stats = [
    { emoji: '⚽', label: 'Courts', value: courtsCount, numeric: true, suffix: '' },
    { emoji: '💰', label: 'From', value: 400, numeric: true, suffix: '/hr', prefix: 'R' },
    { emoji: '🕙', label: 'Open', value: null, display: '10AM – 10PM' },
    { emoji: '📍', label: 'Location', value: null, display: 'Milnerton, CPT' },
  ];

  return (
    <div className="bg-black text-white py-7 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              className="flex flex-col items-center gap-1"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: 'easeOut' }}
            >
              <span className="text-2xl leading-none mb-1">{s.emoji}</span>
              <span
                className="font-black text-2xl text-white leading-none"
                style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}
              >
                {s.numeric ? (
                  <>
                    {s.prefix}
                    {s.value}
                    {s.suffix}
                  </>
                ) : s.display}
              </span>
              <span className="text-gray-400 text-xs uppercase tracking-widest">
                {s.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

