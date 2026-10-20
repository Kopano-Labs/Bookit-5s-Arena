'use client';

import { useEffect, useMemo, useState } from 'react';

const localDate = () => {
  const date = new Date();
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 10);
};

const formatTime = (value) => {
  const hour = Number(value.slice(0, 2));
  return `${hour % 12 || 12}${hour < 12 ? 'am' : 'pm'}`;
};

export default function QuickBookExperience({ courts, initialCourtId = '' }) {
  const [courtId, setCourtId] = useState(courts.some((item) => item.id === initialCourtId) ? initialCourtId : (courts[0]?.id || ''));
  const [date, setDate] = useState('');
  const [duration, setDuration] = useState(1);
  const [time, setTime] = useState('');
  const [slots, setSlots] = useState([]);
  const [availabilityVersion, setAvailabilityVersion] = useState(0);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotError, setSlotError] = useState('');
  const [details, setDetails] = useState({ name: '', email: '', phone: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [booking, setBooking] = useState(null);

  const court = useMemo(() => courts.find((item) => item.id === courtId), [courts, courtId]);
  const total = Number(court?.price || 0) * duration;
  const minDate = useMemo(localDate, []);

  useEffect(() => {
    setTime('');
    setSlots([]);
    setSlotError('');
    if (!courtId || !date) return undefined;

    const controller = new AbortController();
    setLoadingSlots(true);
    fetch(`/api/availability?date=${encodeURIComponent(date)}&courtId=${encodeURIComponent(courtId)}`, {
      signal: controller.signal,
      cache: 'no-store',
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Could not load times.');
        setSlots(data.courts?.[0]?.slots || []);
      })
      .catch((fetchError) => {
        if (fetchError.name !== 'AbortError') setSlotError(fetchError.message || 'Could not load times.');
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoadingSlots(false);
      });

    return () => controller.abort();
  }, [courtId, date, availabilityVersion]);

  const availableSlots = slots.filter((slot) => slot.availableDurations.includes(duration));

  const reserve = async (event) => {
    event.preventDefault();
    setError('');
    if (!court || !date || !time) return setError('Choose a court, date and time first.');
    setSaving(true);
    try {
      const response = await fetch('/api/bookings/guest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courtId,
          date,
          start_time: time,
          duration,
          guestName: details.name,
          guestEmail: details.email,
          guestPhone: details.phone,
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        if (response.status === 409) {
          setTime('');
          setAvailabilityVersion((version) => version + 1);
        }
        throw new Error(result.error || 'Booking could not be saved. Try another time.');
      }
      setBooking(result);
    } catch (saveError) {
      setError(saveError.message || 'Booking could not be saved. Try again.');
    } finally {
      setSaving(false);
    }
  };

  if (booking) {
    return (
      <section className="overflow-hidden rounded-3xl border border-green-400/30 bg-gray-900">
        <div className="relative h-40 sm:h-56">
          <img src={court.image} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 to-transparent" />
          <div className="absolute bottom-5 left-6">
            <h2 className="mt-1 text-3xl font-black uppercase">Reservation saved</h2>
          </div>
        </div>
        <div className="grid gap-3 p-6 text-sm sm:grid-cols-4">
          <p><span className="block text-xs uppercase text-gray-500">Court</span>{court.name}</p>
          <p><span className="block text-xs uppercase text-gray-500">Date</span>{date}</p>
          <p><span className="block text-xs uppercase text-gray-500">Kick-off</span>{formatTime(time)} · {duration}h</p>
          <p><span className="block text-xs uppercase text-gray-500">Due at venue</span>R{booking.total_price}</p>
          <p className="text-xs text-gray-400 sm:col-span-4">Reference {String(booking._id || '').slice(-8).toUpperCase()} · Pay at the venue.</p>
          <p role="status" className="text-xs text-gray-300 sm:col-span-4">
            {booking.communicationReceipts?.some(receipt => receipt.recipientType === 'user' && receipt.status === 'sent')
              ? 'Check your email for your reservation details.'
              : 'Your reservation is saved. Email confirmation is pending.'}
          </p>
        </div>
      </section>
    );
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
      <section aria-label="Choose a court">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-black uppercase tracking-widest">01 <span className="ml-2 text-white">Choose a court</span></h2>
          <span className="text-xs text-gray-500">{courts.length} pitches</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {courts.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => { setCourtId(item.id); setTime(''); }}
              aria-pressed={courtId === item.id}
              className={`group relative isolate flex min-h-48 items-end overflow-hidden rounded-2xl border p-4 text-left transition ${courtId === item.id ? 'border-yellow-300 ring-2 ring-yellow-300/50' : 'border-white/10 hover:border-white/40'}`}
            >
              <img src={item.image} alt="" aria-hidden="true" className="absolute inset-0 -z-20 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              <span className="absolute inset-0 -z-10 bg-gradient-to-t from-black via-black/30 to-transparent" />
              <span>
                <span className="block text-[10px] font-black uppercase tracking-[0.18em] text-yellow-300">Pitch {index + 1}</span>
                <span className="mt-1 block text-2xl font-black uppercase">{item.name}</span>
                <span className="mt-1 block text-sm text-white/80">R{item.price} / hour</span>
              </span>
              {courtId === item.id ? <span className="absolute right-3 top-3 rounded-full bg-yellow-300 px-3 py-1 text-[10px] font-black uppercase text-gray-950">Selected</span> : null}
            </button>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-black uppercase tracking-widest">02 <span className="ml-2">Pick date &amp; time</span></h2>
          <div className="flex items-center gap-2">
            <label className="sr-only" htmlFor="booking-date">Date</label>
            <input id="booking-date" type="date" min={minDate} value={date} onChange={(event) => setDate(event.target.value)} className="min-h-10 rounded-lg border border-white/10 bg-gray-900 px-3 text-sm text-white" />
            <div className="flex rounded-lg border border-white/10 bg-gray-900 p-1" aria-label="Booking duration">
              {[1, 2, 3].map((hours) => (
                <button key={hours} type="button" onClick={() => setDuration(hours)} aria-pressed={duration === hours} className={`rounded-md px-2.5 py-1.5 text-xs font-bold ${duration === hours ? 'bg-yellow-300 text-gray-950' : 'text-gray-400 hover:text-white'}`}>{hours}h</button>
              ))}
            </div>
          </div>
        </div>

        {!date ? <p className="mt-4 text-sm text-gray-500">Choose a date to see open times.</p> : null}
        {loadingSlots ? <p className="mt-4 text-sm text-gray-400" role="status">Loading open times…</p> : null}
        {slotError ? <p className="mt-4 text-sm text-red-300" role="alert">{slotError}</p> : null}
        {date && !loadingSlots && !slotError && availableSlots.length === 0 ? <p className="mt-4 text-sm text-gray-400">No {duration}-hour times open. Try another date or duration.</p> : null}
        <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
          {availableSlots.map((slot) => (
            <button key={slot.start_time} type="button" onClick={() => { setTime(slot.start_time); setError(''); }} aria-pressed={time === slot.start_time} className={`min-h-11 rounded-lg border text-sm font-bold transition ${time === slot.start_time ? 'border-yellow-300 bg-yellow-300 text-gray-950' : 'border-white/10 bg-white/[0.04] text-white hover:border-yellow-300/60'}`}>
              {formatTime(slot.start_time)}
            </button>
          ))}
        </div>
      </section>

      <form onSubmit={reserve} className="self-start rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div><h2 className="text-sm font-black uppercase tracking-widest">03 <span className="ml-2">Your details</span></h2><p className="mt-1 text-xs text-gray-500">Quick booking · no account needed</p></div>
          <span className="text-right"><strong className="block text-2xl">R{total}</strong><span className="text-[10px] uppercase text-gray-500">Pay at venue</span></span>
        </div>
        <div className="mt-5 space-y-3">
          <label className="sr-only" htmlFor="guest-name">Full name</label>
          <input id="guest-name" autoComplete="name" required minLength={2} maxLength={100} value={details.name} onChange={(event) => setDetails({ ...details, name: event.target.value })} placeholder="Your name" className="min-h-11 w-full rounded-lg border border-white/10 bg-gray-950 px-3 text-sm text-white placeholder:text-gray-600" />
          <label className="sr-only" htmlFor="guest-email">Email address</label>
          <input id="guest-email" type="email" autoComplete="email" required value={details.email} onChange={(event) => setDetails({ ...details, email: event.target.value })} placeholder="Email address" className="min-h-11 w-full rounded-lg border border-white/10 bg-gray-950 px-3 text-sm text-white placeholder:text-gray-600" />
          <label className="sr-only" htmlFor="guest-phone">Mobile number</label>
          <input id="guest-phone" type="tel" autoComplete="tel" required value={details.phone} onChange={(event) => setDetails({ ...details, phone: event.target.value })} placeholder="Mobile number" className="min-h-11 w-full rounded-lg border border-white/10 bg-gray-950 px-3 text-sm text-white placeholder:text-gray-600" />
        </div>
        {error ? <p className="mt-3 text-sm text-red-300" role="alert">{error}</p> : null}
        <button type="submit" disabled={!court || !date || !time || saving} className="mt-4 min-h-12 w-full rounded-xl bg-yellow-300 px-4 text-sm font-black uppercase tracking-wider text-gray-950 transition hover:bg-yellow-200 disabled:cursor-not-allowed disabled:opacity-40">
          {saving ? 'Saving…' : `Reserve court · R${total}`}
        </button>
        <p className="mt-3 text-center text-[11px] text-gray-500">Your slot is held when Bookit saves your booking.</p>
      </form>
    </div>
  );
}
