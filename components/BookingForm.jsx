'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaCalendarAlt, FaClock, FaFutbol, FaLock,
  FaWhatsapp, FaPhone, FaMapMarkerAlt,
  FaCheckCircle, FaMoneyBillWave, FaUser,
} from 'react-icons/fa';
import InfoTooltip from './InfoTooltip';
import {
  formatBookingTimeLabel,
  normalizeDuration,
} from '@/lib/bookingSlots';
import { getTodayInBookingTimeZone } from '@/lib/bookingDates';
import {
  deriveOfflineIdempotencyKey,
  enqueueOfflineEvent,
} from '@/lib/offline/kopanoOfflineQueue';

function slotOptionsForDuration(slots, duration) {
  const safeDuration = Number(duration);
  if (!Array.isArray(slots)) return [];

  return slots
    .filter((slot) => Array.isArray(slot.availableDurations) && slot.availableDurations.includes(safeDuration))
    .map((slot) => ({
      value: slot.start_time,
      label: formatBookingTimeLabel(slot.start_time),
    }));
}

const BookingForm = ({ courtId, courtName, pricePerHour }) => {
  const { data: session } = useSession();
  const router = useRouter();

  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState('1');
  const [error, setError] = useState('');
  const [reserveLoading, setReserveLoading] = useState(false);
  const [reserved, setReserved] = useState(false);
  const [showGuestForm, setShowGuestForm] = useState(true);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestReserveLoading, setGuestReserveLoading] = useState(false);
  const [reservationMode, setReservationMode] = useState('reserved');
  const [bookingReference, setBookingReference] = useState('');
  const [reservationDetails, setReservationDetails] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [availabilityState, setAvailabilityState] = useState('idle');
  const [availabilityError, setAvailabilityError] = useState('');

  const hourlyPrice = Number(pricePerHour) || 0;
  const totalPrice = hourlyPrice * Number(duration);
  const today = getTodayInBookingTimeZone();
  const slotOptions = useMemo(
    () => slotOptionsForDuration(availableSlots, duration),
    [availableSlots, duration],
  );
  const selectedStartTime = slotOptions.some((option) => option.value === startTime)
    ? startTime
    : '';
  const hasVerifiedSlot = Boolean(
    date &&
    selectedStartTime &&
    availabilityState === 'ready',
  );
  const reserveDisabled = reserveLoading || !hasVerifiedSlot;
  const guestReserveDisabled = guestReserveLoading || !hasVerifiedSlot;

  useEffect(() => {
    if (!date) return undefined;

    const controller = new AbortController();

    const loadAvailability = async () => {
      try {
        const params = new URLSearchParams({ date, courtId });
        const response = await fetch(`/api/availability?${params.toString()}`, {
          cache: 'no-store',
          signal: controller.signal,
        });
        const data = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(data?.error || 'Could not load live availability for this court.');
        }

        const courtAvailability = Array.isArray(data?.courts) ? data.courts[0] : null;
        const nextSlots = Array.isArray(courtAvailability?.slots) ? courtAvailability.slots : [];
        setAvailableSlots(nextSlots);
        setAvailabilityState(nextSlots.length > 0 ? 'ready' : 'empty');
      } catch (fetchError) {
        if (fetchError?.name === 'AbortError') return;
        setAvailableSlots([]);
        setAvailabilityState('error');
        setAvailabilityError(fetchError?.message || 'Could not load live availability for this court.');
      }
    };

    loadAvailability();
    return () => controller.abort();
  }, [courtId, date]);

  const handleDateChange = (event) => {
    const nextDate = event.target.value;
    setDate(nextDate);
    setStartTime('');
    setAvailableSlots([]);
    setAvailabilityError('');
    setAvailabilityState(nextDate ? 'loading' : 'idle');
    setError('');
  };

  const handleDurationChange = (nextDuration) => {
    const safeDuration = String(normalizeDuration(nextDuration));
    setDuration(safeDuration);

    const nextOptions = slotOptionsForDuration(availableSlots, safeDuration);
    if (!nextOptions.some((option) => option.value === startTime)) {
      setStartTime('');
    }
  };

  const validateForm = () => {
    if (!date || !startTime || !duration) {
      setError('Please fill in all fields.');
      return false;
    }
    if (availabilityState === 'loading') {
      setError('Please wait for live availability to finish loading.');
      return false;
    }
    if (availabilityState === 'error') {
      setError('Live availability could not be verified. Refresh the date before reserving.');
      return false;
    }
    if (!slotOptions.some((option) => option.value === startTime)) {
      setError('That slot is no longer available for this duration. Please choose another time.');
      return false;
    }
    return true;
  };

  const buildOfflineBookingIntent = (actorType) => {
    const safeDuration = Number(duration);
    const normalizedPhone = guestPhone.replace(/\s/g, '');
    const stableActor =
      actorType === 'guest'
        ? {
            type: 'guest',
            email: guestEmail.trim().toLowerCase(),
            phone: normalizedPhone,
          }
        : {
            type: 'user',
            id: session?.user?.id || null,
            email: session?.user?.email || null,
          };

    return {
      stableParts: {
        lane: 'bookit-court-booking',
        actor: stableActor,
        courtId,
        date,
        start_time: startTime,
        duration: safeDuration,
        payAtVenue: true,
      },
      payload: {
        source: 'bookit-court-form',
        intent: 'pay-at-venue-court-booking',
        dryRun: true,
        moneyMovement: false,
        courtId,
        courtName,
        date,
        start_time: startTime,
        duration: safeDuration,
        total_price: totalPrice,
        actor:
          actorType === 'guest'
            ? {
                type: 'guest',
                contact_present: Boolean(guestEmail && guestPhone),
                email_domain: guestEmail.includes('@') ? guestEmail.split('@').pop().toLowerCase() : null,
                phone_last4: normalizedPhone.slice(-4),
              }
            : {
                type: 'user',
                userId: session?.user?.id || null,
              },
        queued_at: new Date().toISOString(),
      },
    };
  };

  const queueOfflineBookingIntent = async (actorType) => {
    const intent = buildOfflineBookingIntent(actorType);
    const idempotencyKey = await deriveOfflineIdempotencyKey('booking', intent.stableParts);

    await enqueueOfflineEvent({
      eventType: 'booking',
      payload: intent.payload,
      idempotencyKey,
    });

    setReservationMode('queued');
    setBookingReference('');
    setReservationDetails(null);
    setReserved(true);
  };

  const handleReserve = async () => {
    setError('');
    if (!session) { router.push('/login'); return; }
    if (!validateForm()) return;
    setReserveLoading(true);
    try {
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        await queueOfflineBookingIntent('user');
        return;
      }

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courtId, date, start_time: startTime, duration: Number(duration), payAtVenue: true }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Failed to reserve. Please try again.'); return; }
      setReservationMode('reserved');
      setBookingReference(data?._id ? String(data._id).slice(-8).toUpperCase() : '');
      setReservationDetails(data);
      setReserved(true);
    } catch (reserveError) {
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        try {
          await queueOfflineBookingIntent('user');
        } catch (queueError) {
          setError(queueError?.message || 'Unable to save this booking request offline.');
        }
      } else {
        setError(reserveError?.message || 'We could not confirm if the server received this booking. Refresh availability before trying again.');
      }
    } finally {
      setReserveLoading(false);
    }
  };

  const handleGuestReserve = async () => {
    setError('');
    if (!validateForm()) return;
    if (!guestName.trim() || !guestEmail.trim() || !guestPhone.trim()) {
      setError('Please fill in your name, email and phone number.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestEmail)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!/^(\+27|0)[0-9]{9}$/.test(guestPhone.replace(/\s/g, ''))) {
      setError('Please enter a valid SA phone number (e.g. 0821234567).');
      return;
    }
    setGuestReserveLoading(true);
    try {
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        await queueOfflineBookingIntent('guest');
        return;
      }

      const res = await fetch('/api/bookings/guest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courtId, date, start_time: startTime, duration: Number(duration),
          guestName, guestEmail, guestPhone,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Failed to reserve. Please try again.'); return; }
      setReservationMode('reserved');
      setBookingReference(data?._id ? String(data._id).slice(-8).toUpperCase() : '');
      setReservationDetails(data);
      setReserved(true);
    } catch (reserveError) {
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        try {
          await queueOfflineBookingIntent('guest');
        } catch (queueError) {
          setError(queueError?.message || 'Unable to save this guest request offline.');
        }
      } else {
        setError(reserveError?.message || 'We could not confirm if the server received this booking. Refresh availability before trying again.');
      }
    } finally {
      setGuestReserveLoading(false);
    }
  };

  const inputClass =
    'w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-yellow-600 focus:border-transparent outline-none transition-all placeholder-gray-500';
  const labelClass = 'block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest';

  if (reserved) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mt-8 bg-green-900/20 border border-yellow-800/50 rounded-2xl p-6"
      >
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-900/40 border-2 border-yellow-600 mb-4"
          >
            <FaCheckCircle className="text-3xl text-yellow-500" />
          </motion.div>
          <h2 className="text-xl font-black uppercase tracking-widest text-white" style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}>
            {reservationMode === 'queued' ? 'Request Queued' : 'Reservation Received'}
          </h2>
          <p className="mt-2 text-sm font-semibold text-white" role="status">
            {reservationMode === 'queued'
              ? 'Bookit has not received this request yet.'
              : reservationDetails?.status === 'confirmed'
                ? 'Confirmed by the organiser.'
                : 'Pending organiser confirmation.'}
          </p>
          <p className="text-yellow-500 text-sm mt-1 font-semibold">
            {(reservationDetails?.courtName || courtName)} · {(reservationDetails?.date || date)} at {formatBookingTimeLabel(reservationDetails?.start_time || startTime)} · {(reservationDetails?.duration || duration)}h
          </p>
          {bookingReference && (
            <p className="mt-2 text-[11px] font-black uppercase tracking-widest text-green-300">
              Reference {bookingReference}
            </p>
          )}
        </div>

        <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-4 mb-5">
          <div className="flex items-center gap-3 mb-2">
            <FaMoneyBillWave className="text-yellow-500 flex-shrink-0" size={16} />
            <p className="text-white text-sm font-bold">
              {reservationMode === 'queued' ? 'Offline Request Saved' : `Reservation amount — R${Number(reservationDetails?.total_price ?? totalPrice)}`}
            </p>
          </div>
          <p className="text-gray-400 text-xs leading-relaxed">
            {reservationMode === 'queued'
              ? 'This device saved your booking request for sync when the connection returns. No court slot is held until the request syncs and staff confirm availability.'
              : (
                <>
                  Bookit recorded a <strong className="text-white">{reservationDetails?.status || 'pending'}</strong> reservation for <strong className="text-white">R{Number(reservationDetails?.total_price ?? totalPrice)}</strong>. Payment is <strong className="text-white">{reservationDetails?.paymentStatus || 'not recorded'}</strong>. The organiser can confirm the reservation and update payment in Bookit.
                </>
              )}
          </p>
        </div>

        <p className="text-gray-400 text-xs mb-4 text-center font-bold uppercase tracking-widest">
          Questions? Contact us via WhatsApp
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <motion.a
            href="https://wa.me/27637820245?text=Hi%2C%20I%20just%20reserved%20a%20court%20and%20would%20like%20to%20confirm%20my%20booking."
            target="_blank" rel="noopener noreferrer"
            whileHover={{ scale: 1.02, boxShadow: '0 0 20px var(--glow)' }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white uppercase tracking-widest"
            style={{ background: 'linear-gradient(135deg, var(--btn-from) 0%, var(--btn-to) 100%)' }}
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
          <FaMapMarkerAlt className="text-yellow-600 flex-shrink-0" />
          Bookit 5s Arena · Pringle Rd, Milnerton, Cape Town
        </div>
        {session && reservationMode !== 'queued' && (
          <Link href="/bookings" className="mt-4 block text-center text-xs text-yellow-500 hover:text-green-300 transition-colors">
            View My Bookings
          </Link>
        )}
      </motion.div>
    );
  }

  return (
    <div className="mt-8 bg-gray-900 border border-gray-800 rounded-2xl p-6">
      <h2 className="text-lg font-black uppercase tracking-widest text-white mb-6 flex items-center gap-2" style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}>
        <FaFutbol className="text-yellow-500" /> Book This Court
      </h2>

      {/* Physical payment notice */}
      <div className="mb-5 p-3 bg-green-900/20 border border-green-800/40 rounded-xl flex items-start gap-3">
        <FaMoneyBillWave className="text-yellow-500 flex-shrink-0 mt-0.5" size={14} />
        <p className="text-green-300 text-xs font-semibold leading-relaxed">
          Pick a date to load verified slots from Bookit. Court reservations are <strong>pay at venue</strong>.
        </p>
      </div>

      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="date" className={labelClass}><FaCalendarAlt className="inline mr-1.5 mb-0.5" />Date</label>
            <input type="date" id="date" value={date} onChange={handleDateChange} min={today} className={inputClass} required />
          </div>
          <div>
            <label htmlFor="start_time" className={labelClass}><FaClock className="inline mr-1.5 mb-0.5" />Start Time <InfoTooltip text="Courts are open 10:00 AM – 10:00 PM. Slots that already passed today are hidden." position="top" /></label>
            <select id="start_time" value={selectedStartTime} onChange={(e) => setStartTime(e.target.value)} className={inputClass} disabled={!date || availabilityState === 'loading' || slotOptions.length === 0} required>
              {!date && <option value="">Select a date first</option>}
              {date && availabilityState === 'loading' && <option value="">Checking live slots...</option>}
              {date && availabilityState !== 'loading' && slotOptions.length === 0 && <option value="">No verified slots for this duration</option>}
              {date && availabilityState !== 'loading' && slotOptions.length > 0 && <option value="">Select an hourly slot</option>}
              {slotOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="duration" className={labelClass}>Duration <InfoTooltip text="Minimum 1 hour, maximum 3 hours per booking." position="top" /></label>
            <select id="duration" value={duration} onChange={(e) => handleDurationChange(e.target.value)} className={inputClass} required>
              <option value="1">1 hour</option>
              <option value="2">2 hours</option>
              <option value="3">3 hours</option>
            </select>
          </div>
        </div>

        {date && selectedStartTime && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-green-900/20 border border-green-800/40 rounded-xl text-sm text-green-300">
            <span className="font-bold text-white">Total: R{totalPrice}</span>
            <span className="text-yellow-600 ml-2">({formatBookingTimeLabel(selectedStartTime)} · {duration} hr × R{hourlyPrice}/hr) — pay at venue</span>
          </motion.div>
        )}

        {date && availabilityState === 'loading' && (
          <p className="text-xs font-semibold uppercase tracking-widest text-yellow-500">
            Checking live availability...
          </p>
        )}

        {date && availabilityState === 'empty' && (
          <p className="rounded-xl border border-yellow-800/40 bg-yellow-950/20 p-3 text-xs font-semibold text-yellow-200">
            No verified slots are open for {courtName} on this date. Try another date or contact the venue for special arrangements.
          </p>
        )}

        {date && availabilityState === 'ready' && slotOptions.length === 0 && (
          <p className="rounded-xl border border-yellow-800/40 bg-yellow-950/20 p-3 text-xs font-semibold text-yellow-200">
            {courtName} has live availability on this date, but not for a {duration}-hour booking. Try a shorter duration or another start time.
          </p>
        )}

        {availabilityState === 'error' && (
          <p className="rounded-xl border border-red-800 bg-red-950 p-3 text-xs font-semibold text-red-300">
            {availabilityError || 'Live availability could not be verified.'}
          </p>
        )}

      {!session && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5 space-y-3"
        >
          {/* Auth options */}
          <div className="p-4 bg-gradient-to-r from-yellow-900/40 to-amber-900/40 border border-amber-500/50 rounded-xl shadow-[0_0_15px_rgba(245,158,11,0.2)] text-yellow-200 text-sm">
            <div className="flex flex-col gap-1 mb-4">
              <div className="flex items-center gap-2">
                <FaLock className="text-amber-400 flex-shrink-0" />
                <span className="font-black tracking-widest uppercase text-amber-400">Sign In for Full Access</span>
              </div>
              <p className="text-xs text-amber-200/80">Create an account to track your booking history and earn exclusive loyalty rewards.</p>
            </div>
            <div className="flex gap-2">
              <Link href="/login" className="flex-1 text-center py-2.5 px-3 rounded-lg bg-yellow-800 hover:bg-yellow-700 text-white text-xs font-black uppercase tracking-widest transition-colors shadow-lg shadow-green-900/50">
                Sign In
              </Link>
              <Link href="/register" className="flex-1 text-center py-2.5 px-3 rounded-lg bg-gray-700 hover:bg-gray-600 border border-gray-600 text-white text-xs font-bold uppercase tracking-widest transition-colors">
                Register
              </Link>
            </div>
          </div>

          {/* Guest reserve toggle */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-800" /></div>
            <div className="relative flex justify-center">
              <button
                type="button"
                onClick={() => setShowGuestForm((v) => !v)}
                className="bg-gray-900 px-3 flex items-center gap-1 text-gray-500 hover:text-yellow-500 text-xs uppercase tracking-widest transition-colors"
              >
                <FaUser size={9} /> {showGuestForm ? 'hide guest details' : 'reserve as guest (pay at venue)'}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {showGuestForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="bg-gray-800/60 border border-yellow-800/40 rounded-xl p-4 space-y-3">
                  <p className="text-green-300 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                    <FaMapMarkerAlt className="text-yellow-500" /> Guest Reservation — Pay at Venue
                    <InfoTooltip text="No account needed. The selected slot is held only after Bookit accepts the reservation." position="right" />
                  </p>
                  <p className="text-gray-500 text-xs">Choose a verified slot, then enter your details. Pay R{totalPrice} at the venue.</p>

                  <div className="space-y-2.5">
                    <input
                      type="text"
                      aria-label="Full name"
                      autoComplete="name"
                      maxLength={100}
                      placeholder="Full Name *"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-yellow-600 focus:border-transparent outline-none placeholder-gray-500"
                    />
                    <input
                      type="email"
                      aria-label="Email address"
                      autoComplete="email"
                      maxLength={254}
                      placeholder="Email Address *"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-yellow-600 focus:border-transparent outline-none placeholder-gray-500"
                    />
                    <input
                      type="tel"
                      aria-label="South African phone number"
                      autoComplete="tel"
                      placeholder="Phone Number * (e.g. 0821234567)"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-yellow-600 focus:border-transparent outline-none placeholder-gray-500"
                    />
                  </div>

                  <motion.button
                    type="button"
                    onClick={handleGuestReserve}
                    disabled={guestReserveDisabled}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full py-3 px-4 rounded-xl text-sm font-bold text-white uppercase tracking-widest transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    style={{ background: 'linear-gradient(135deg, var(--btn-from) 0%, var(--btn-to) 100%)' }}
                  >
                    {guestReserveLoading ? (
                      <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Sending reservation...</>
                    ) : (
                      <><FaMoneyBillWave size={13} /> Request Reservation · Pay R{totalPrice} at Venue</>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {error && (
        <motion.div role="alert" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-5 p-3 bg-red-950 border border-red-800 rounded-xl text-red-300 text-sm">
          {error}
        </motion.div>
      )}

        {session ? (
          <motion.button
            type="button"
            onClick={handleReserve}
            disabled={reserveDisabled}
            whileHover={{ scale: 1.02, boxShadow: '0 0 35px rgba(34,197,94,0.5)' }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-3.5 px-4 rounded-xl text-sm font-black text-white uppercase tracking-widest transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, var(--btn-from) 0%, var(--btn-to) 100%)', boxShadow: '0 0 25px var(--glow)' }}
          >
            {reserveLoading ? (
              <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Sending reservation...</>
            ) : (
              <><FaMoneyBillWave size={14} /> Request Reservation · Pay R{totalPrice} at Venue</>
            )}
          </motion.button>
        ) : (
          !showGuestForm && (
            <div className="text-center text-xs text-gray-600 pt-2">Sign in above or reserve as guest below</div>
          )
        )}

        <p className="text-center text-xs text-gray-600 flex items-center justify-center gap-1.5">
          <FaMapMarkerAlt size={10} className="text-yellow-700" /> Bookit 5s Arena · Pringle Rd, Milnerton, Cape Town
        </p>
      </div>
    </div>
  );
};

export default BookingForm;

