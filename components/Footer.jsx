'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaTiktok, FaInstagram, FaFacebook, FaWhatsapp, FaPhone, FaEnvelope, FaMapMarkerAlt, FaArrowUp, FaFutbol } from 'react-icons/fa';

const SOCIALS = [
  { icon: FaTiktok, href: 'https://www.tiktok.com/@fivesarena', label: 'TikTok', hoverColor: 'hover:text-white hover:bg-black' },
  { icon: FaInstagram, href: 'https://www.instagram.com/fivesarena', label: 'Instagram', hoverColor: 'hover:text-white hover:bg-gradient-to-tr hover:from-yellow-400 hover:via-pink-500 hover:to-purple-600' },
  { icon: FaFacebook, href: 'https://www.facebook.com/profile.php?id=61588019843126', label: 'Facebook', hoverColor: 'hover:text-white hover:bg-blue-600' },
  { icon: FaWhatsapp, href: 'https://wa.me/27637820245', label: 'WhatsApp', hoverColor: 'hover:text-white hover:bg-green-600' },
];

const QUICK_LINKS = [
  { label: 'Book a Court', href: '/#courts' },
  { label: 'Events & Parties', href: '/events' },
  { label: 'Leagues', href: '/leagues' },
  { label: 'Live Fixtures', href: '/fixtures' },
  { label: 'Rules', href: '/rules' },
  { label: 'Rewards', href: '/rewards' },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-950 border-t border-gray-800 relative overflow-hidden">
      {/* Subtle gradient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

          {/* Brand */}
          <div className="md:col-span-1">
            <motion.div
              className="flex items-center gap-3 mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <motion.img
                src="/images/logo.png"
                alt="5s Arena"
                className="w-12 h-12 rounded-full object-cover border-2 border-green-500"
                whileHover={{ scale: 1.1, boxShadow: '0 0 20px rgba(74,222,128,0.5)' }}
              />
              <div>
                <p className="font-black uppercase text-white text-lg tracking-wider" style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}>
                  5S <span className="text-green-400">ARENA</span>
                </p>
              </div>
            </motion.div>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              Cape Town&apos;s premier 5-a-side football venue. Floodlit, all-weather synthetic turf at Hellenic Football Club, Milnerton.
            </p>
            {/* Social icons */}
            <div className="flex gap-3">
              {SOCIALS.map(({ icon: Icon, href, label, hoverColor }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={`flex items-center justify-center w-10 h-10 rounded-full border border-gray-700 text-gray-400 transition-all duration-300 ${hoverColor}`}
                  whileHover={{ scale: 1.15, y: -3 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon size={16} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <motion.h4
              className="text-green-400 font-bold text-xs uppercase tracking-[0.2em] mb-5"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Quick Links
            </motion.h4>
            <ul className="space-y-2">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <motion.div whileHover={{ x: 3, scale: 1.02 }} transition={{ duration: 0.15 }}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white text-sm transition-all flex items-center gap-2 bg-gray-800/40 hover:bg-green-600/20 px-3 py-2 rounded-lg border border-gray-800/60 hover:border-green-500/30"
                    >
                      <span className="text-green-500 text-xs">→</span>
                      {link.label}
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <motion.h4
              className="text-green-400 font-bold text-xs uppercase tracking-[0.2em] mb-5"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Contact
            </motion.h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li>
                <a href="tel:+27637820245" className="flex items-center gap-3 hover:text-green-400 transition-colors group">
                  <span className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center group-hover:bg-green-600/20 transition-colors">
                    <FaPhone size={12} className="text-green-400" />
                  </span>
                  063 782 0245
                </a>
              </li>
              <li>
                <a href="mailto:fivearena@gmail.com" className="flex items-center gap-3 hover:text-green-400 transition-colors group">
                  <span className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center group-hover:bg-green-600/20 transition-colors">
                    <FaEnvelope size={12} className="text-green-400" />
                  </span>
                  fivearena@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/27637820245"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 hover:text-green-400 transition-colors group"
                >
                  <span className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center group-hover:bg-green-600/20 transition-colors">
                    <FaWhatsapp size={12} className="text-green-400" />
                  </span>
                  WhatsApp Us
                </a>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                  <FaMapMarkerAlt size={12} className="text-green-400" />
                </span>
                <span>Pringle Rd, Milnerton,<br />Cape Town, 7441</span>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <motion.h4
              className="text-green-400 font-bold text-xs uppercase tracking-[0.2em] mb-5"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Opening Hours
            </motion.h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex justify-between">
                <span>Monday – Friday</span>
                <span className="text-white font-semibold">10:00 – 22:00</span>
              </li>
              <li className="flex justify-between">
                <span>Saturday</span>
                <span className="text-white font-semibold">10:00 – 22:00</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday</span>
                <span className="text-white font-semibold">10:00 – 22:00</span>
              </li>
              <li className="mt-3 pt-3 border-t border-gray-800 flex justify-between">
                <span>Public Holidays</span>
                <span className="text-amber-400 font-semibold">Check Availability</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-gray-600 text-xs">
            <FaFutbol className="text-green-600" size={10} />
            <p>&copy; {currentYear} Bookit 5s Arena. All rights reserved.</p>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-gray-700 text-[10px] tracking-[0.15em] uppercase">Built with ⚽ in Cape Town</p>
            <motion.button
              onClick={scrollToTop}
              className="w-8 h-8 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-green-400 hover:border-green-500 transition-all cursor-pointer"
              whileHover={{ y: -3, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Scroll to top"
            >
              <FaArrowUp size={10} />
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
