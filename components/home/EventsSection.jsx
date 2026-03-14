'use client';

import { motion } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';

const EVENTS = [
  {
    image: '/images/events/Birthday%20Parties.png',
    title: 'Birthday Parties',
    desc: 'Private court hire with full access to our bar & clubhouse. Catering options available. Perfect for groups of all sizes — book the pitch, celebrate in style.',
    border: 'border-t-green-500',
    glow: 'rgba(34,197,94,0.25)',
  },
  {
    image: '/images/events/Tournaments.png',
    title: 'Tournaments',
    desc: 'Organise your own 5v5 tournament on our floodlit courts. We provide the venue, sound system and bar — you bring the teams and the competitive spirit.',
    border: 'border-t-yellow-500',
    glow: 'rgba(234,179,8,0.25)',
  },
  {
    image: '/images/events/Corporate%20Events.png',
    title: 'Corporate Events',
    desc: 'The ultimate team-building day out. Use our courts, clubhouse bar and restaurant to host a full corporate event your team will never forget.',
    border: 'border-t-blue-500',
    glow: 'rgba(59,130,246,0.25)',
  },
  {
    image: '/images/events/Holiday%20Clinics.png',
    title: 'Holiday Clinics',
    desc: 'Coached football clinics for all ages and skill levels during school holidays. Great way to keep the kids active, improving and having fun.',
    border: 'border-t-purple-500',
    glow: 'rgba(168,85,247,0.25)',
  },
];

export default function EventsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-green-600 font-bold tracking-widest uppercase text-sm mb-2">
            More than just football
          </p>
          <h2
            className="font-black uppercase text-gray-900"
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontFamily: 'Impact, Arial Black, sans-serif',
            }}
          >
            EVENTS &amp; SERVICES
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {EVENTS.map((e, i) => (
            <motion.div
              key={i}
              className={`group bg-white overflow-hidden border-t-4 ${e.border} flex flex-col shadow-sm rounded-2xl`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{
                y: -8,
                boxShadow: `0 20px 50px -10px ${e.glow}, 0 8px 20px rgba(0,0,0,0.1)`,
                transition: { duration: 0.25 },
              }}
            >
              <div className="p-6">
                <h3
                  className="font-black uppercase text-xl mb-3 text-gray-900"
                  style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}
                >
                  {e.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">{e.desc}</p>
              </div>
              <div className="h-48 overflow-hidden mt-auto rounded-b-2xl">
                <img
                  src={e.image}
                  alt={e.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="text-center mt-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <motion.a
            href="https://wa.me/27637820245"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border-2 border-gray-900 hover:bg-gray-900 hover:text-white text-gray-900 font-bold px-8 py-4 uppercase tracking-wide transition-all"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            <FaWhatsapp /> Contact Us for More Info
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
