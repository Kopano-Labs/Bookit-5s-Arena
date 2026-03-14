'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  FaBirthdayCake,
  FaBuilding,
  FaTrophy,
  FaUsers,
  FaWhatsapp,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaCheck,
  FaStar,
} from 'react-icons/fa';

const packages = [
  {
    id: 'birthday',
    type: 'birthday',
    name: 'Kids Birthday',
    price: 'R2,500',
    icon: FaBirthdayCake,
    color: 'from-pink-500 to-rose-600',
    features: [
      'Up to 15 kids',
      '2hrs court time',
      '1 coach',
      'Equipment + bibs',
      'Setup included',
    ],
  },
  {
    id: 'premium-birthday',
    type: 'birthday',
    name: 'Premium Birthday',
    price: 'R3,500',
    icon: FaStar,
    color: 'from-amber-500 to-orange-600',
    features: [
      'Up to 30 kids',
      '2hrs court time',
      '2 coaches',
      'Equipment + bibs + trophies',
      'Setup + party area',
    ],
  },
  {
    id: 'corporate',
    type: 'corporate',
    name: 'Corporate Team Building',
    price: 'R4,500',
    icon: FaBuilding,
    color: 'from-blue-500 to-indigo-600',
    features: [
      'Up to 20 players',
      '3hrs',
      '2 courts',
      'Referee + bibs',
      'Tournament format',
    ],
  },
  {
    id: 'social',
    type: 'social',
    name: 'Social Tournament',
    price: 'R1,200',
    icon: FaTrophy,
    color: 'from-green-500 to-emerald-600',
    features: [
      'Per team entry',
      'League format',
      'Prizes',
      'Referee included',
    ],
  },
];

const WHATSAPP_NUMBER = '27600000000'; // Replace with actual number

export default function EventsPage() {
  const formRef = useRef(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    preferredDate: '',
    preferredTime: '',
    guestCount: '',
    message: '',
  });

  const handleSelectPackage = (pkg) => {
    setSelectedPackage(pkg);
    setSubmitted(false);
    setError('');
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: selectedPackage.type,
          packageName: selectedPackage.name,
          contactName: form.contactName,
          contactEmail: form.contactEmail,
          contactPhone: form.contactPhone,
          preferredDate: form.preferredDate,
          preferredTime: form.preferredTime || null,
          guestCount: parseInt(form.guestCount, 10),
          message: form.message,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        return;
      }

      setSubmitted(true);
      setForm({
        contactName: '',
        contactEmail: '',
        contactPhone: '',
        preferredDate: '',
        preferredTime: '',
        guestCount: '',
        message: '',
      });
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappMessage = selectedPackage
    ? encodeURIComponent(
        `Hi! I'd like to enquire about the ${selectedPackage.name} package at 5s Arena.`
      )
    : encodeURIComponent("Hi! I'd like to enquire about event packages at 5s Arena.");

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-green-900/20 to-gray-950" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative max-w-5xl mx-auto text-center"
        >
          <h1
            className="text-5xl md:text-7xl font-black text-white uppercase tracking-widest mb-4"
            style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}
          >
            Events & Parties
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
            From kids birthdays to corporate team building — we have the perfect package for your next event at 5s Arena.
          </p>
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
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-green-500/50 transition-all duration-300 group"
              >
                {/* Card header */}
                <div
                  className={`bg-gradient-to-r ${pkg.color} p-6 flex items-center gap-4`}
                >
                  <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                    <Icon className="text-white text-2xl" />
                  </div>
                  <div>
                    <h3
                      className="text-xl font-black text-white uppercase tracking-wider"
                      style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}
                    >
                      {pkg.name}
                    </h3>
                    <p className="text-white/90 text-2xl font-bold">{pkg.price}</p>
                  </div>
                </div>

                {/* Features */}
                <div className="p-6">
                  <ul className="space-y-3 mb-6">
                    {pkg.features.map((feat, j) => (
                      <li key={j} className="flex items-center gap-3 text-gray-300">
                        <FaCheck className="text-green-400 text-sm flex-shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleSelectPackage(pkg)}
                    className="w-full py-3 rounded-lg bg-green-600 hover:bg-green-500 text-white font-bold uppercase tracking-wider transition-colors duration-200 cursor-pointer"
                  >
                    Book This Package
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Booking Form */}
      {selectedPackage && (
        <section ref={formRef} className="max-w-2xl mx-auto px-4 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-900 border border-gray-800 rounded-2xl p-8"
          >
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-20 h-20 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaCheck className="text-green-400 text-3xl" />
                </div>
                <h3
                  className="text-2xl font-black text-white uppercase tracking-wider mb-3"
                  style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}
                >
                  Booking Request Sent!
                </h3>
                <p className="text-gray-400 mb-6">
                  Thank you for your interest in our {selectedPackage.name} package. Our team will be in touch within 24 hours to confirm your booking.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-lg font-bold transition-colors"
                  >
                    <FaWhatsapp className="text-xl" />
                    Chat on WhatsApp
                  </a>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setSelectedPackage(null);
                    }}
                    className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-bold transition-colors cursor-pointer"
                  >
                    Browse Packages
                  </button>
                </div>
              </motion.div>
            ) : (
              <>
                <h2
                  className="text-2xl font-black text-white uppercase tracking-wider mb-2"
                  style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}
                >
                  Book: {selectedPackage.name}
                </h2>
                <p className="text-gray-400 text-sm mb-6">
                  Fill in your details and we will get back to you within 24 hours to confirm availability.
                </p>

                {error && (
                  <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Package type (read-only) */}
                  <div>
                    <label className="flex items-center gap-2 text-gray-400 text-sm font-semibold mb-1">
                      <FaCalendarAlt />
                      Package
                    </label>
                    <input
                      type="text"
                      value={`${selectedPackage.name} — ${selectedPackage.price}`}
                      readOnly
                      className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-300 cursor-not-allowed"
                    />
                  </div>

                  {/* Contact Name */}
                  <div>
                    <label className="flex items-center gap-2 text-gray-400 text-sm font-semibold mb-1">
                      <FaUsers />
                      Your Name
                    </label>
                    <input
                      type="text"
                      name="contactName"
                      value={form.contactName}
                      onChange={handleChange}
                      required
                      minLength={2}
                      maxLength={100}
                      placeholder="Full name"
                      className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-colors"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="flex items-center gap-2 text-gray-400 text-sm font-semibold mb-1">
                      <FaEnvelope />
                      Email
                    </label>
                    <input
                      type="email"
                      name="contactEmail"
                      value={form.contactEmail}
                      onChange={handleChange}
                      required
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-colors"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="flex items-center gap-2 text-gray-400 text-sm font-semibold mb-1">
                      <FaPhone />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="contactPhone"
                      value={form.contactPhone}
                      onChange={handleChange}
                      required
                      placeholder="082 123 4567"
                      className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-colors"
                    />
                  </div>

                  {/* Date & Time row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center gap-2 text-gray-400 text-sm font-semibold mb-1">
                        <FaCalendarAlt />
                        Preferred Date
                      </label>
                      <input
                        type="date"
                        name="preferredDate"
                        value={form.preferredDate}
                        onChange={handleChange}
                        required
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm font-semibold mb-1 block">
                        Preferred Time
                      </label>
                      <input
                        type="time"
                        name="preferredTime"
                        value={form.preferredTime}
                        onChange={handleChange}
                        min="08:00"
                        max="20:00"
                        className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Guest Count */}
                  <div>
                    <label className="text-gray-400 text-sm font-semibold mb-1 block">
                      Number of Guests
                    </label>
                    <input
                      type="number"
                      name="guestCount"
                      value={form.guestCount}
                      onChange={handleChange}
                      required
                      min={1}
                      max={100}
                      placeholder="e.g. 15"
                      className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-colors"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="text-gray-400 text-sm font-semibold mb-1 block">
                      Additional Message (optional)
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Any special requests or questions..."
                      className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 rounded-lg bg-green-600 hover:bg-green-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold uppercase tracking-wider text-lg transition-colors duration-200 cursor-pointer"
                  >
                    {submitting ? 'Sending...' : 'Submit Booking Request'}
                  </button>
                </form>

                {/* WhatsApp fallback */}
                <div className="mt-6 pt-6 border-t border-gray-800 text-center">
                  <p className="text-gray-500 text-sm mb-3">
                    Prefer to chat? Reach us directly on WhatsApp:
                  </p>
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 font-semibold transition-colors"
                  >
                    <FaWhatsapp className="text-xl" />
                    WhatsApp Us
                  </a>
                </div>
              </>
            )}
          </motion.div>
        </section>
      )}
    </div>
  );
}
