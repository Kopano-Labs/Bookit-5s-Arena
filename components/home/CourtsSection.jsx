'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaFutbol, FaArrowRight } from 'react-icons/fa';

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

function CourtCard({ court, index, mobile }) {
  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      className={mobile
        ? 'flex-shrink-0 snap-start'
        : ''
      }
      style={mobile ? { minWidth: '72vw', maxWidth: '300px' } : {}}
    >
      <Link
        href={`/courts/${court._id}`}
        className={`group bg-white overflow-hidden shadow-sm block rounded-2xl transition-all duration-300
          hover:ring-2 hover:ring-green-400
          hover:shadow-[0_0_0_2px_#4ade80,0_0_28px_rgba(74,222,128,0.4),0_12px_40px_rgba(0,0,0,0.15)]
          ${mobile ? 'w-72' : ''}`}
      >
        {court.image ? (
          <div className="relative h-52 overflow-hidden">
            <img
              src={`/images/courts/${court.image}`}
              alt={court.name}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-600"
              style={{ transitionDuration: '600ms' }}
            />
            {/* Glassmorphism shimmer on hover */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 60%)' }}
            />
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.78) 0%, transparent 60%)' }}
            />
            <div className="absolute bottom-4 left-4">
              <span className="text-white font-black text-xl uppercase" style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}>
                {court.name}
              </span>
            </div>
          </div>
        ) : (
          <div className="h-52 bg-gray-900 flex items-center justify-center">
            <motion.div whileHover={{ rotate: 20 }} transition={{ type: 'spring', stiffness: 300 }}>
              <FaFutbol className="text-green-400 text-5xl" />
            </motion.div>
          </div>
        )}

        <div className="p-5">
          {!court.image && <h3 className="font-black text-xl uppercase mb-2">{court.name}</h3>}
          {court.description && (
            <p className="text-gray-500 text-sm mb-4 line-clamp-2">{court.description}</p>
          )}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-black text-gray-900">R{court.price_per_hour}</span>
              <span className="text-gray-400 text-sm"> /hour</span>
            </div>
            <motion.span
              className="inline-flex items-center gap-2 text-white font-black px-5 py-2.5 rounded-full text-xs uppercase tracking-widest"
              whileHover={{ scale: 1.08, boxShadow: '0 0 24px rgba(34,197,94,0.65)' }}
              style={{
                background: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)',
                boxShadow: '0 0 18px rgba(34,197,94,0.45)',
              }}
            >
              BOOK NOW <FaArrowRight size={9} />
            </motion.span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function CourtsSection({ courts = [] }) {
  return (
    <section id="courts" className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div>
            <p className="text-green-600 font-bold tracking-widest uppercase text-sm mb-2">
              Ready to play?
            </p>
            <h2
              className="font-black uppercase text-gray-900"
              style={{
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                fontFamily: 'Impact, Arial Black, sans-serif',
              }}
            >
              BOOK A COURT
            </h2>
          </div>
          <p className="text-gray-500 md:text-right md:max-w-xs text-sm leading-relaxed">
            All courts are floodlit, all-weather synthetic turf pitches
            at Hellenic Football Club, Milnerton.
          </p>
        </motion.div>

        {courts.length === 0 ? (
          <p className="text-center text-gray-400 py-16 text-lg">
            No courts available right now. Check back soon.
          </p>
        ) : (
          <>
            {/* Mobile: horizontal swipe carousel */}
            <div
              className="flex md:hidden gap-4 overflow-x-auto pb-4 -mx-6 px-6 snap-x snap-mandatory scrollbar-none"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {courts.map((court, i) => (
                <CourtCard key={court._id} court={court} index={i} mobile />
              ))}
            </div>
            <p className="md:hidden text-center text-gray-400 text-xs mt-1 mb-2">
              ← Swipe to see all courts →
            </p>

            {/* Desktop grid */}
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {courts.map((court, i) => (
                <CourtCard key={court._id} court={court} index={i} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
