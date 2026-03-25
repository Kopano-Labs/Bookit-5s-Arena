'use client';

import { motion } from 'framer-motion';
import {
  FaShieldAlt,
  FaDatabase,
  FaCalendarCheck,
  FaCookieBite,
  FaCreditCard,
  FaUserLock,
  FaEnvelope,
  FaWhatsapp,
  FaPhone,
} from 'react-icons/fa';

const SECTIONS = [
  {
    title: 'Data We Collect',
    icon: FaDatabase,
    description:
      'When you use Bookit 5s Arena, we may collect personal details such as your name, email address, phone number, account login details, and information you provide when contacting us or creating a booking.',
  },
  {
    title: 'Bookings & Account Data',
    icon: FaCalendarCheck,
    description:
      'We store booking details like selected courts, dates, times, payment status, and booking history so we can manage reservations, provide customer support, and keep your account accurate and up to date.',
  },
  {
    title: 'Analytics & Cookies',
    icon: FaCookieBite,
    description:
      'We may use cookies and basic analytics tools to understand site traffic, improve performance, remember preferences, and make the booking experience smoother. These tools help us improve the platform without selling your personal data.',
  },
  {
    title: 'Payments',
    icon: FaCreditCard,
    description:
      'Card payments are processed through secure payment providers. We do not store full card details on our own systems. Payment-related records may be kept for transaction verification, fraud prevention, and accounting purposes.',
  },
  {
    title: 'Your Rights',
    icon: FaUserLock,
    description:
      'You can request access to the personal information we hold about you, ask us to correct inaccurate details, or request deletion where legally permitted. You may also contact us about how your information is used.',
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white pt-24 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        <section className="text-center mb-14">
          <motion.div
            className="w-20 h-20 mx-auto bg-green-900/30 border-2 border-green-500/40 rounded-2xl flex items-center justify-center mb-6"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <FaShieldAlt className="text-green-400 text-4xl" />
          </motion.div>

          <motion.h1
            className="text-4xl md:text-6xl font-black uppercase tracking-widest mb-4"
            style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Privacy <span className="text-green-400">Policy</span>
          </motion.h1>

          <motion.p
            className="text-gray-400 text-lg max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            We respect your privacy and handle your information carefully. This page explains what data we collect,
            why we collect it, and how it supports your football arena booking experience.
          </motion.p>

          <motion.p
            className="text-xs uppercase tracking-[0.3em] text-gray-500 mt-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Last updated: March 2026
          </motion.p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {SECTIONS.map((section, index) => {
            const Icon = section.icon;

            return (
              <motion.div
                key={section.title}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-6"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
              >
                <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-4">
                  <Icon className="text-green-400 text-xl" />
                </div>
                <h2
                  className="text-xl font-black uppercase tracking-widest mb-3"
                  style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}
                >
                  {section.title}
                </h2>
                <p className="text-sm text-gray-400 leading-relaxed">{section.description}</p>
              </motion.div>
            );
          })}
        </section>

        <section className="bg-gray-900 border border-gray-800 rounded-2xl p-8 mb-12">
          <h2
            className="text-2xl font-black uppercase tracking-widest mb-4"
            style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}
          >
            How We <span className="text-green-400">Use</span> Information
          </h2>
          <div className="space-y-3 text-sm text-gray-400 leading-relaxed">
            <p>We use your information to confirm bookings, manage your account, process payments, communicate important updates, prevent abuse, and improve the reliability of our website and services.</p>
            <p>We only share information with trusted service providers where necessary to operate the platform, such as payment processors, hosting providers, and essential analytics services.</p>
            <p>We do not sell your personal information to third parties.</p>
          </div>
        </section>

        <section className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          <h2
            className="text-2xl font-black uppercase tracking-widest mb-3"
            style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}
          >
            Contact <span className="text-green-400">Us</span>
          </h2>
          <p className="text-sm text-gray-400 mb-6 max-w-2xl">
            If you have questions about this privacy policy or want to make a request about your personal data, contact us directly.
          </p>

          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3">
            <a
              href="mailto:fivearena@gmail.com"
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-purple-600/15 border border-purple-500/30 text-purple-300 text-sm font-bold"
            >
              <FaEnvelope /> fivearena@gmail.com
            </a>
            <a
              href="tel:+27637820245"
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600/15 border border-blue-500/30 text-blue-300 text-sm font-bold"
            >
              <FaPhone /> 063 782 0245
            </a>
            <a
              href="https://wa.me/27637820245"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-green-600/15 border border-green-500/30 text-green-300 text-sm font-bold"
            >
              <FaWhatsapp /> WhatsApp
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}