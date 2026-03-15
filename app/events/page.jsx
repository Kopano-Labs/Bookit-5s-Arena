'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaBirthdayCake, FaBuilding, FaTrophy,
  FaCheck, FaStar, FaChevronDown,
  FaInfoCircle, FaCalendarCheck, FaArrowRight,
} from 'react-icons/fa';

const packages = [
  {
    id: 'birthday',
    name: 'Kids Birthday',
    icon: FaBirthdayCake,
    color: 'from-pink-500 to-rose-600',
    image: '/images/events/Birthday%20Parties.png',
    features: [
      'Action-packed party for up to 15 kids on our 5-a-side pitch',
      '2 hours of organised football fun with a dedicated coach',
      'All equipment, bibs & footballs provided — just bring the cake!',
      'Full setup & cleanup so you can focus on the celebration',
      'Access to our clubhouse & bar for parents and guests',
    ],
  },
  {
    id: 'premium-birthday',
    name: 'Premium Birthday',
    icon: FaStar,
    color: 'from-amber-500 to-orange-600',
    image: '/images/events/Birthday%20Parties.png',
    features: [
      'The ultimate birthday bash for up to 30 kids across the pitch',
      '2 hours of coached football with 2 dedicated coaches',
      'Trophies, medals & awards for every player',
      'Private party area with full setup & decorations',
      'VIP clubhouse access with food & drink options for guests',
    ],
  },
  {
    id: 'corporate',
    name: 'Corporate Team Building',
    icon: FaBuilding,
    color: 'from-blue-500 to-indigo-600',
    image: '/images/events/Corporate%20Events.png',
    features: [
      'Energise your team with 3 hours of competitive 5-a-side action',
      'Up to 20 players across 2 floodlit courts simultaneously',
      'Professional referee & tournament bracket format',
      'Equipment, bibs & custom team colours provided',
      'Bar & restaurant access for post-match networking & drinks',
    ],
  },
  {
    id: 'social',
    name: 'Social Tournament',
    icon: FaTrophy,
    color: 'from-green-500 to-emerald-600',
    image: '/images/events/Tournaments.png',
    features: [
      'Bring your squad and compete in our 5v5 tournament format',
      'Round-robin league stage followed by knockout rounds',
      'Trophies, medals & prizes for the winning team',
      'Professional referee & live scoreboard throughout',
      'Full access to bar, sound system & floodlit courts',
    ],
  },
];

const TERMS = [
  'All event bookings must be confirmed via our booking system or direct contact.',
  'A 50% deposit is required to secure your booking date.',
  'Full payment is due 48 hours before the event.',
  'Cancellations made less than 72 hours before the event are non-refundable.',
  'The venue reserves the right to reschedule in case of severe weather.',
  'All participants must sign a waiver before the event.',
  'Event times are subject to court availability.',
  'Catering and refreshments are not included unless specified.',
];

export default function EventsPage() {
  const [showTerms, setShowTerms] = useState(false);

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <motion.img
            src="/images/events/Tournaments.png"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ scale: 1 }}
            animate={{ scale: 1.15, x: [0, -20, 0], y: [0, -10, 0] }}
            transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-950/70 via-gray-950/80 to-gray-950" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative max-w-5xl mx-auto text-center"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30"
          >
            <FaStar className="text-green-400 text-2xl" />
          </motion.div>
          <h1
            className="text-5xl md:text-7xl font-black text-white uppercase tracking-widest mb-4"
            style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}
          >
            EVENTS & <span className="text-green-400">SERVICES</span>
          </h1>
          <motion.p
            className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Birthday celebrations, corporate team building, social tournaments — your next unforgettable event starts here at 5s Arena.
          </motion.p>
        </motion.div>
      </section>

      {/* Package Cards */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {packages.map((pkg, i) => {
            const Icon = pkg.icon;
            return (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 50, rotateX: 8 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.25 } }}
                className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-green-500/50 hover:shadow-[0_0_40px_rgba(34,197,94,0.15)] transition-all duration-300 group"
              >
                <div className="relative h-48 overflow-hidden">
                  <motion.img
                    src={pkg.image}
                    alt={pkg.name}
                    className="absolute inset-0 w-full h-full object-cover"
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.06, 1] }}
                    transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent" />
                  <div className="absolute bottom-4 left-5 flex items-center gap-3">
                    <motion.div
                      className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20"
                      whileHover={{ rotate: 15, scale: 1.1 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <Icon className="text-white text-xl" />
                    </motion.div>
                    <h3
                      className="text-lg font-black text-white uppercase tracking-wider drop-shadow-lg"
                      style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}
                    >
                      {pkg.name}
                    </h3>
                  </div>
                </div>

                <div className="p-6">
                  <ul className="space-y-3 mb-6">
                    {pkg.features.map((feat, j) => (
                      <motion.li
                        key={j}
                        className="flex items-center gap-3 text-gray-300"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.12 + j * 0.05 + 0.3 }}
                      >
                        <FaCheck className="text-green-400 text-sm flex-shrink-0" />
                        <span>{feat}</span>
                      </motion.li>
                    ))}
                  </ul>

                  <p className="text-gray-500 text-xs mb-4 italic">
                    Contact us for pricing — packages are customised to your needs
                  </p>

                  <Link href={`/events/book?package=${pkg.id}`}>
                    <motion.div
                      className="w-full py-3 rounded-lg bg-green-600 hover:bg-green-500 text-white font-bold uppercase tracking-wider transition-colors duration-200 cursor-pointer flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.03, boxShadow: '0 0 25px rgba(34,197,94,0.5)' }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <FaCalendarCheck size={14} /> Book Event <FaArrowRight size={10} />
                    </motion.div>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Terms & Conditions */}
      <section className="max-w-2xl mx-auto px-4 pb-20">
        <motion.div
          className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <motion.button
            onClick={() => setShowTerms(!showTerms)}
            className="w-full flex items-center justify-between p-6 text-left cursor-pointer"
            whileHover={{ backgroundColor: 'rgba(31,41,55,0.5)' }}
          >
            <div className="flex items-center gap-3">
              <FaInfoCircle className="text-gray-500" />
              <span className="text-gray-300 font-bold uppercase tracking-wider text-sm">
                Terms & Conditions — Event Bookings
              </span>
            </div>
            <motion.div animate={{ rotate: showTerms ? 180 : 0 }} transition={{ duration: 0.3 }}>
              <FaChevronDown className="text-gray-500" />
            </motion.div>
          </motion.button>

          <AnimatePresence>
            {showTerms && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-6 space-y-3">
                  {TERMS.map((term, i) => (
                    <motion.div
                      key={i}
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <span className="text-green-400 text-sm font-bold mt-0.5">{i + 1}.</span>
                      <p className="text-gray-400 text-sm">{term}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </section>
    </div>
  );
}
