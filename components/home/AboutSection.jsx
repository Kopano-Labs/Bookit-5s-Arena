"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import {
  FaMapMarkerAlt,
  FaClock,
  FaParking,
  FaMusic,
  FaUtensils,
  FaBolt,
  FaDirections,
} from "react-icons/fa";

const VenueMap = dynamic(() => import("@/components/VenueMap"), { ssr: false });

const AMENITIES = [
  { icon: FaBolt, label: "Floodlit Pitches", color: "#facc15" },
  { icon: FaUtensils, label: "Bar & Restaurant", color: "#f97316" },
  { icon: FaMusic, label: "Sound System", color: "#a855f7" },
  { icon: FaParking, label: "Secure Parking", color: "#3b82f6" },
];

const HOURS = [
  { day: "Mon – Fri", time: "10:00 – 22:00" },
  { day: "Saturday", time: "10:00 – 22:00" },
  { day: "Sunday", time: "10:00 – 22:00" },
];

export default function AboutSection({ courtsCount = null, minPrice = null, courtFeedReady = false }) {
  const hasCourtCount = courtFeedReady && Number.isInteger(courtsCount) && courtsCount > 0;
  const hasPrice = courtFeedReady && Number.isFinite(minPrice) && minPrice > 0;

  const stats = [
    { val: hasCourtCount ? String(courtsCount) : "CHECK", label: hasCourtCount ? "Courts in booking" : "Court feed" },
    { val: "SITE", label: "Stated hours" },
    { val: hasPrice ? `R${minPrice}` : "CHECK", label: hasPrice ? "From / hr" : "Current rate" },
  ];

  return (
    <section id="about" className="py-20 bg-gray-950 text-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-yellow-500 font-bold tracking-widest uppercase text-sm mb-4">About Us</p>
            <h2
              className="font-black uppercase leading-tight mb-6"
              style={{
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                fontFamily: "Impact, Arial Black, sans-serif",
              }}
            >
              WHAT IS
              <br />
              <span className="text-yellow-500">5S ARENA?</span>
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-4">
              5s Arena is played on all-weather, floodlit, synthetic grass facilities in Milnerton,
              Cape Town. The venue also lists a bar &amp; restaurant, sound system and secure parking.
            </p>
            <p className="text-gray-400 leading-relaxed mb-10">
              Small pitches, urban locations, short game times and manageable team sizes make
              5-a-side accessible for casual games, competitions and group events. Current booking
              inventory, rates and slot availability are only presented as transactional when the
              booking source is available.
            </p>

            <div className="flex flex-wrap gap-8 sm:gap-10">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.12 }}
                >
                  <div
                    className="font-black text-3xl text-yellow-500"
                    style={{ fontFamily: "Impact, Arial Black, sans-serif" }}
                  >
                    {stat.val}
                  </div>
                  <div className="text-gray-500 text-xs uppercase tracking-widest mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="rounded-2xl border border-green-900/60 overflow-hidden bg-linear-to-br from-gray-900 via-gray-900 to-yellow-950/40 relative"
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{
              borderColor: "rgba(74,222,128,0.5)",
              transition: { duration: 0.3, type: "tween" },
            }}
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-yellow-600/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-600/5 rounded-full blur-2xl pointer-events-none" />

            <div className="relative px-6 pt-6 pb-4 border-b border-green-900/40">
              <div className="flex items-start gap-4">
                <motion.div
                  className="w-12 h-12 rounded-xl bg-yellow-700/20 border border-yellow-800/40 flex items-center justify-center shrink-0"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <FaMapMarkerAlt className="text-yellow-500 text-xl" />
                </motion.div>
                <div>
                  <h3
                    className="text-white font-black text-lg uppercase tracking-widest"
                    style={{ fontFamily: "Impact, Arial Black, sans-serif" }}
                  >
                    Hellenic Football Club
                  </h3>
                  <p className="text-gray-400 text-sm mt-0.5">Pringle Rd, Milnerton · Cape Town 7441</p>
                  <p className="text-gray-500 text-xs mt-1">Western Cape, South Africa 🇿🇦</p>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden" style={{ height: "220px" }}>
              <VenueMap />
            </div>

            <div className="px-6 py-5 border-b border-green-900/30">
              <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold mb-3">Venue-listed amenities</p>
              <div className="grid grid-cols-2 gap-3">
                {AMENITIES.map((amenity, index) => (
                  <motion.div
                    key={amenity.label}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-gray-800/60 border border-gray-700/40"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.4 + index * 0.08, ease: "easeOut" }}
                    whileHover={{
                      borderColor: `${amenity.color}50`,
                      backgroundColor: `${amenity.color}08`,
                      x: 4,
                      transition: { duration: 0.2, type: "tween" },
                    }}
                  >
                    <amenity.icon style={{ color: amenity.color }} size={14} />
                    <span className="text-gray-300 text-xs font-semibold">{amenity.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="px-6 py-5 border-b border-green-900/30">
              <div className="flex items-center gap-2 mb-3">
                <FaClock className="text-emerald-400" size={12} />
                <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold">Site-stated hours</p>
                <span className="ml-auto px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-amber-900/30 text-amber-300 border border-amber-700/30">
                  Confirm availability
                </span>
              </div>
              <div className="space-y-2">
                {HOURS.map((hour) => (
                  <div key={hour.day} className="flex items-center justify-between">
                    <span className="text-gray-400 text-xs font-medium">{hour.day}</span>
                    <span className="text-white text-xs font-bold tabular-nums">{hour.time}</span>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[10px] leading-5 text-gray-600">
                These hours are site-stated reference information, not a real-time open/closed signal.
              </p>
            </div>

            <div className="px-6 py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-yellow-600" />
                <span className="text-yellow-500 text-xs font-bold uppercase tracking-widest">
                  All-Weather · Synthetic Turf
                </span>
              </div>
              <motion.a
                href="https://maps.google.com/?q=Hellenic+Football+Club,+Pringle+Rd,+Milnerton,+Cape+Town"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-700/20 border border-yellow-800/50 text-yellow-500 text-xs font-bold uppercase tracking-widest hover:bg-yellow-700/30 transition-colors shrink-0"
                whileHover={{ scale: 1.05, transition: { duration: 0.15, type: "tween" } }}
                whileTap={{ scale: 0.95 }}
              >
                <FaDirections size={12} /> Directions
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
