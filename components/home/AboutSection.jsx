'use client';

import { motion } from 'framer-motion';
import { FaMapMarkerAlt } from 'react-icons/fa';

export default function AboutSection({ courtsCount = 4 }) {
  const stats = [
    { val: `${courtsCount}+`, label: 'Courts' },
    { val: '12h', label: 'Daily' },
    { val: 'R400', label: 'From / hr' },
  ];

  return (
    <section className="py-20 bg-gray-950 text-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">

          {/* Left — text */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-green-400 font-bold tracking-widest uppercase text-sm mb-4">
              About Us
            </p>
            <h2
              className="font-black uppercase leading-tight mb-6"
              style={{
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                fontFamily: 'Impact, Arial Black, sans-serif',
              }}
            >
              WHAT IS
              <br />
              <span className="text-green-400">5S ARENA?</span>
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-4">
              5s Arena is played on state-of-the-art, all-weather, floodlit,
              synthetic grass facilities in the heart of Milnerton, Cape Town.
              We have a bar &amp; restaurant, sound system and secure parking on site.
            </p>
            <p className="text-gray-400 leading-relaxed mb-10">
              Small pitches, urban locations, short game times and manageable
              team sizes make 5-a-side the most accessible and exciting format
              of the beautiful game. Whether you&apos;re booking a casual
              kick-about, a competitive tournament, or a corporate team day
              — 5s Arena has you covered.
            </p>

            <div className="flex gap-10">
              {stats.map((s, i) => (
                <motion.div
                  key={i}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.12 }}
                >
                  <div
                    className="font-black text-3xl text-green-400"
                    style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}
                  >
                    {s.val}
                  </div>
                  <div className="text-gray-500 text-xs uppercase tracking-widest mt-1">
                    {s.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right — map card */}
          <motion.div
            className="border border-green-900 overflow-hidden flex flex-col"
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ borderColor: 'rgba(74,222,128,0.5)', transition: { duration: 0.3 } }}
          >
            <div className="relative h-72">
              <iframe
                title="Hellenic Football Club Location"
                src="https://maps.google.com/maps?q=Hellenic+Football+Club,+Pringle+Rd,+Milnerton,+Cape+Town,+South+Africa&output=embed&z=16"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <a
                href="https://maps.google.com/?q=Hellenic+Football+Club,+Pringle+Rd,+Milnerton,+Cape+Town"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 z-10"
                aria-label="Open in Google Maps"
              />
            </div>
            <div className="bg-green-950/40 border-t border-green-900 px-6 py-5 flex items-center justify-between">
              <div>
                <p className="text-green-400 font-bold text-sm uppercase tracking-widest mb-0.5">
                  Hellenic Football Club
                </p>
                <p className="text-gray-400 text-sm">Pringle Rd, Milnerton · Cape Town 7441</p>
              </div>
              <a
                href="https://maps.google.com/?q=Hellenic+Football+Club,+Pringle+Rd,+Milnerton,+Cape+Town"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 font-bold uppercase text-xs tracking-wide transition-colors flex-shrink-0 ml-4"
              >
                <FaMapMarkerAlt /> Directions
              </a>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
