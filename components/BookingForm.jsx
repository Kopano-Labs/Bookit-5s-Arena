'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaCalendarAlt, FaClock, FaFutbol, FaLock,
  FaCreditCard, FaWhatsapp, FaPhone, FaMapMarkerAlt,
  FaCheckCircle, FaChevronDown,
} from 'react-icons/fa';

const BookingForm = ({ courtId, courtName, pricePerHour }) => {
  const { data: session } = useSession();
  const router = useRouter();

  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState('1');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [reserveLoading, setReserveLoading] = useState(false);
  const [reserved, setReserved] = useState(false);
  const [showPayOptions, setShowPayOptions] = useState(false);

  const totalPrice = pricePerHour * Number(duration);

  const validateForm = () => {
    if (!date || !startTime || !duration) {
      setError('Please fill in all fields.');
      return false;
    }
    return true;
  };

  const handlePayOnline = async (e) => {
    e.preventDefault();
    setError('');
    if (!session) { router.push('/login'); return; }
    if (!validateForm()) return;
    setLoading(true);
    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courtId, date, start_time: startTime, duration: Number(duration) }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error || 'Failed to initiate payment.'); setLoading(false); return; }
    window.location.href = data.url;
  };

  const handleReserve = async () => {
    setError('');
    if (!session) { router.push('/login'); return; }
    if (!validateForm()) return;
    setReserveLoading(true);
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courtId, date, start_time: startTime, duration: Number(duration), payAtVenue: true }),
    });
    const data = await res.json();
    setReserveLoading(false);
    if (!res.ok) { setError(data.error || 'Failed to reserve. Please try again.'); return; }
    setReserved(true);
  };

  const inputClass =
    'w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all placeholder-gray-500';
  const labelClass = 'block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest';

  if (reserved) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mt-8 bg-green-900/20 border border-green-700/50 rounded-2xl p-6"
      >
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-900/40 border-2 border-green-500 mb-4"
          >
            <FaCheckCircle className="text-3xl text-green-400" />
          </motion.div>
          <h2 className="text-xl font-black uppercase tracking-widest text-white" style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}>
            Court Reserved!
          </h2>
          <p className="text-green-400 text-sm mt-1 font-semibold">
            {courtName} · {date} at {startTime} · {duration}h
          </p>
        </div>
        <div className="bg-amber-900/20 border border-amber-700/40 rounded-xl p-4 mb-5 text-sm text-amber-300">
          <p className="font-bold mb-1">Payment required on arrival — R{totalPrice}</p>
          <p className="text-amber-400/80 text-xs">
            Your slot is held. Please contact us to finalise your reservation.
          </p>
        </div>
        <p className="text-gray-400 text-xs mb-4 text-center font-bold uppercase tracking-widest">
          Contact us to confirm
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <motion.a
            href="https://wa.me/27637820245?text=Hi%2C%20I%20just%20reserved%20a%20court%20and%20would%20like%20to%20confirm%20my%20booking."
            target="_blank" rel="noopener noreferrer"
            whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(34,197,94,0.4)' }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white uppercase tracking-widest"
            style={{ background: 'linear-gradient(135deg, #15803d 0%, #22c55e 100%)' }}
          >
            <FaWhatsapp size={16} /> WhatsApp Us
          </motion.a>
          <motion.a
            href="tel:+27637820245"
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-gray-300 bg-gray-800 border border-gray-700 hover:text-white transition-all"
          >
            <FaPhone size={13} /> Call Us
          </motion.a>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-800 flex items-center gap-2 text-xs text-gray-500">
          <FaMapMarkerAlt className="text-green-500 flex-shrink-0" />
          Bookit 5s Arena · Pringle Rd, Milnerton, Cape Town
        </div>
        <Link href="/bookings" className="mt-4 block text-center text-xs text-green-400 hover:text-green-300 transition-colors">
          View My Bookings
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="mt-8 bg-gray-900 border border-gray-800 rounded-2xl p-6">
      <h2 className="text-lg font-black uppercase tracking-widest text-white mb-6 flex items-center gap-2" style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}>
        <FaFutbol className="text-green-400" /> Book This Court
      </h2>

      {!session && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5 p-4 bg-yellow-900/30 border border-yellow-700/40 rounded-xl text-yellow-300 text-sm"
        >
          <div className="flex items-center gap-2 mb-2">
            <FaLock className="flex-shrink-0" />
            <span className="font-bold">Sign in to book or reserve this court.</span>
          </div>
          <div className="flex gap-2 mt-3">
            <Link href="/login" className="flex-1 text-center py-2 px-3 rounded-lg bg-green-700 text-white text-xs font-bold uppercase tracking-widest hover:bg-green-600 transition-colors">
              Sign In
            </Link>
            <Link href="/register" className="flex-1 text-center py-2 px-3 rounded-lg bg-gray-700 text-white text-xs font-semibold hover:bg-gray-600 transition-colors">
              Create Account
            </Link>
          </div>
        </motion.div>
      )}

      {error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-5 p-3 bg-red-950 border border-red-800 rounded-xl text-red-400 text-sm">
          {error}
        </motion.div>
      )}

      <form onSubmit={handlePayOnline} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="date" className={labelClass}><FaCalendarAlt className="inline mr-1.5 mb-0.5" />Date</label>
            <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} min={new Date().toISOString().split('T')[0]} className={inputClass} required />
          </div>
          <div>
            <label htmlFor="start_time" className={labelClass}><FaClock className="inline mr-1.5 mb-0.5" />Start Time</label>
            <input type="time" id="start_time" value={startTime} onChange={(e) => setStartTime(e.target.value)} min="10:00" max="21:00" className={inputClass} required />
          </div>
          <div>
            <label htmlFor="duration" className={labelClass}>Duration</label>
            <select id="duration" value={duration} onChange={(e) => setDuration(e.target.value)} className={inputClass} required>
              <option value="1">1 hour</option>
              <option value="2">2 hours</option>
              <option value="3">3 hours</option>
            </select>
          </div>
        </div>

        {date && startTime && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-green-900/20 border border-green-800/40 rounded-xl text-sm text-green-300">
            <span className="font-bold text-white">Total: R{totalPrice}</span>
            <span className="text-green-500 ml-2">({duration} hr x R{pricePerHour}/hr)</span>
          </motion.div>
        )}

        {session ? (
          <div className="space-y-3">
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02, boxShadow: '0 0 35px rgba(34,197,94,0.5)' }}
              whileTap={{ scale: 0.97 }}
              className="w-full py-3.5 px-4 rounded-xl text-sm font-black text-white uppercase tracking-widest transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #15803d 0%, #22c55e 100%)', boxShadow: '0 0 25px rgba(34,197,94,0.35)' }}
            >
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Redirecting to Payment...</>
              ) : (
                <><FaCreditCard size={14} /> Pay Online Now — R{totalPrice}</>
              )}
            </motion.button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-800" /></div>
              <div className="relative flex justify-center">
                <button type="button" onClick={() => setShowPayOptions((v) => !v)}
                  className="bg-gray-900 px-3 flex items-center gap-1 text-gray-500 hover:text-gray-300 text-xs uppercase tracking-widest transition-colors">
                  or reserve and pay at venue
                  <motion.span animate={{ rotate: showPayOptions ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <FaChevronDown size={9} />
                  </motion.span>
                </button>
              </div>
            </div>

            <AnimatePresence>
              {showPayOptions && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <FaMapMarkerAlt className="text-amber-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-white text-sm font-bold">Reserve and Pay at Venue</p>
                        <p className="text-gray-400 text-xs mt-0.5">
                          Hold your slot now — bring R{totalPrice} cash or card on arrival.
                          WhatsApp or call us to lock in your time.
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <a href="https://wa.me/27637820245" target="_blank" rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-green-800/40 border border-green-700/50 text-green-400 text-xs font-semibold hover:bg-green-800/60 transition-colors">
                        <FaWhatsapp size={13} /> WhatsApp
                      </a>
                      <a href="tel:+27637820245"
                        className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-gray-700/50 border border-gray-600 text-gray-300 text-xs font-semibold hover:bg-gray-700 transition-colors">
                        <FaPhone size={11} /> Call Us
                      </a>
                    </div>
                    <motion.button
                      type="button"
                      onClick={handleReserve}
                      disabled={reserveLoading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      className="w-full py-3 px-4 rounded-xl text-sm font-bold text-white uppercase tracking-widest transition-all disabled:opacity-50 bg-amber-700 hover:bg-amber-600 flex items-center justify-center gap-2"
                    >
                      {reserveLoading ? (
                        <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Reserving...</>
                      ) : (
                        <>Reserve Slot — Pay R{totalPrice} at Venue</>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center text-xs text-gray-600 pt-2">Sign in above to book or reserve this court</div>
        )}

        {session && !showPayOptions && (
          <p className="text-center text-xs text-gray-600 flex items-center justify-center gap-1.5">
            <span>Lock</span> Secured by Stripe · Your card details are never stored on our servers
          </p>
        )}
      </form>
    </div>
  );
};

export default BookingForm;
