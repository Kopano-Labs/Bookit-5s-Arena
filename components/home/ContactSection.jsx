'use client';

import { motion } from 'framer-motion';
import { FaPhone, FaEnvelope, FaWhatsapp, FaFacebook, FaInstagram, FaTiktok } from 'react-icons/fa';

const CONTACT_CARDS = [
  {
    icon: <FaPhone className="text-green-400 text-3xl" />,
    label: 'Phone',
    main: '063 782 0245',
    sub: 'Mashoto',
    href: 'tel:+27637820245',
    hoverBorder: '#4ade80',
  },
  {
    icon: <FaEnvelope className="text-green-400 text-3xl" />,
    label: 'Email',
    main: 'fivearena@gmail.com',
    sub: 'We reply within 24hrs',
    href: 'mailto:fivearena@gmail.com',
    hoverBorder: '#4ade80',
  },
  {
    icon: <FaWhatsapp className="text-green-400 text-3xl" />,
    label: 'WhatsApp',
    main: '063 782 0245',
    sub: 'Instant response',
    href: 'https://wa.me/27637820245',
    hoverBorder: '#25D366',
    highlight: true,
  },
];

const FOOTER_SOCIALS = [
  { icon: <FaFacebook size={20} />, href: 'https://www.facebook.com/profile.php?id=61588019843126', label: 'Facebook' },
  { icon: <FaInstagram size={20} />, href: 'https://www.instagram.com/fivesarena', label: 'Instagram' },
  { icon: <FaTiktok size={20} />, href: 'https://www.tiktok.com/@fivesarena', label: 'TikTok' },
  { icon: <FaWhatsapp size={20} />, href: 'https://wa.me/27637820245', label: 'WhatsApp' },
];

export default function ContactSection() {
  return (
    <section className="py-20 bg-black text-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-green-400 font-bold tracking-widest uppercase text-sm mb-2">
            We&apos;d love to hear from you
          </p>
          <h2
            className="font-black uppercase"
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontFamily: 'Impact, Arial Black, sans-serif',
            }}
          >
            GET IN TOUCH
          </h2>
        </motion.div>

        {/* Contact cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          {CONTACT_CARDS.map((c, i) => (
            <motion.a
              key={i}
              href={c.href}
              target={c.href.startsWith('http') ? '_blank' : undefined}
              rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className={`flex flex-col items-center gap-3 p-8 border transition-all ${
                c.highlight ? 'border-green-900 bg-green-950/20' : 'border-gray-800'
              }`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              whileHover={{
                borderColor: c.hoverBorder,
                y: -4,
                transition: { duration: 0.2 },
              }}
            >
              <motion.div
                whileHover={{ scale: 1.2, rotate: 10 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {c.icon}
              </motion.div>
              <span className="text-gray-400 text-xs uppercase tracking-widest">{c.label}</span>
              <span className="font-black text-lg">{c.main}</span>
              <span className="text-gray-500 text-sm">{c.sub}</span>
            </motion.a>
          ))}
        </div>

        {/* ── Footer ── */}
        <footer className="border-t border-gray-800 pt-12 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
            {/* Brand */}
            <motion.div
              className="flex flex-col items-center md:items-start gap-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-3">
                <motion.img
                  src="/images/logo.jpg"
                  alt="5s Arena"
                  className="w-14 h-14 rounded-full object-cover border-2 border-green-500"
                  whileHover={{ scale: 1.1, boxShadow: '0 0 30px rgba(74,222,128,0.5)' }}
                />
                <div>
                  <p className="font-black uppercase text-white text-xl tracking-wide" style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}>
                    5S <span className="text-green-400">ARENA</span>
                  </p>
                  <p className="text-gray-500 text-xs">Cape Town&apos;s Premier 5-a-Side</p>
                </div>
              </div>
              <p className="text-gray-600 text-xs leading-relaxed mt-2 text-center md:text-left max-w-xs">
                Floodlit, all-weather synthetic turf pitches at Hellenic Football Club, Milnerton. Book online 24/7.
              </p>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <p className="text-green-400 font-bold text-xs uppercase tracking-widest mb-4">Quick Links</p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 max-w-xs mx-auto">
                {[
                  { label: 'Book a Court', href: '/#courts' },
                  { label: 'Events', href: '/events' },
                  { label: 'Leagues', href: '/leagues' },
                  { label: 'Rules', href: '/rules' },
                  { label: 'Live Fixtures', href: '/fixtures' },
                  { label: 'Rewards', href: '/rewards' },
                ].map((link, i) => (
                  <motion.a
                    key={i}
                    href={link.href}
                    className="text-gray-500 hover:text-green-400 text-sm transition-colors py-0.5"
                    whileHover={{ x: 4, transition: { duration: 0.15 } }}
                  >
                    → {link.label}
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Contact + Socials */}
            <motion.div
              className="text-center md:text-right"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <p className="text-green-400 font-bold text-xs uppercase tracking-widest mb-4">Connect</p>
              <div className="space-y-2 text-sm text-gray-400 mb-5">
                <p>📞 <a href="tel:+27637820245" className="hover:text-green-400 transition-colors">063 782 0245</a></p>
                <p>✉️ <a href="mailto:fivearena@gmail.com" className="hover:text-green-400 transition-colors">fivearena@gmail.com</a></p>
                <p>📍 Pringle Rd, Milnerton, Cape Town</p>
              </div>
              <div className="flex justify-center md:justify-end gap-3">
                {FOOTER_SOCIALS.map((s, i) => (
                  <motion.a
                    key={i}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-800 text-gray-500 hover:text-green-400 hover:border-green-500 transition-all"
                    whileHover={{ scale: 1.15, y: -2, transition: { duration: 0.2 } }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {s.icon}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-gray-800/60 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-gray-600 text-xs">&copy; {new Date().getFullYear()} Bookit 5s Arena. All rights reserved.</p>
            <p className="text-gray-700 text-[10px] tracking-wider">BUILT WITH ⚽ IN CAPE TOWN</p>
          </div>
        </footer>
      </div>
    </section>
  );
}
