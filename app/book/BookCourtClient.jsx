'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { FaClock, FaMapMarkerAlt, FaMoneyBillWave } from 'react-icons/fa';
import BookingForm from '@/components/BookingForm';
import { normalizeAvailabilityLabel } from '@/lib/bookingSlots';

export default function BookCourtClient({ courts = [] }) {
  const [selectedCourtId, setSelectedCourtId] = useState(courts[0]?._id || '');
  const selectedCourt = useMemo(
    () => courts.find((court) => court._id === selectedCourtId) || courts[0] || null,
    [courts, selectedCourtId],
  );

  if (courts.length === 0) {
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="mb-3 text-[10px] font-black uppercase tracking-[0.3em] text-green-400">
          Bookit court reservations
        </p>
        <h1
          className="text-4xl font-black uppercase leading-none text-white sm:text-6xl"
          style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}
        >
          Book a Court
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-300 sm:text-base">
          Choose a court, pick a date, then Bookit checks live availability before you can hold a slot.
          Payment is handled at the venue.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-start">
        <div className="space-y-3">
          <p className="text-xs font-black uppercase tracking-widest text-gray-500">
            Courts
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {courts.map((court) => {
              const selected = selectedCourt?._id === court._id;
              return (
                <motion.button
                  key={court._id}
                  type="button"
                  onClick={() => setSelectedCourtId(court._id)}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full rounded-xl border p-4 text-left transition ${
                    selected
                      ? 'border-green-500 bg-green-500/10 shadow-[0_0_24px_rgba(34,197,94,0.18)]'
                      : 'border-gray-800 bg-gray-900/70 hover:border-gray-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-black uppercase tracking-wide text-white">
                        {court.name}
                      </p>
                      <p className="mt-2 flex items-center gap-2 text-xs text-gray-400">
                        <FaClock className="text-yellow-600" size={11} />
                        {normalizeAvailabilityLabel(court.availability)}
                      </p>
                      {court.address && (
                        <p className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                          <FaMapMarkerAlt className="text-yellow-700" size={10} />
                          {court.address}
                        </p>
                      )}
                    </div>
                    <span className="rounded-full border border-yellow-700/60 bg-yellow-900/20 px-3 py-1 text-xs font-black text-yellow-400">
                      R{court.price_per_hour}/hr
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>

          <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-4 text-xs leading-6 text-gray-400">
            <p className="mb-2 flex items-center gap-2 font-bold text-gray-200">
              <FaMoneyBillWave className="text-yellow-500" /> Venue payment
            </p>
            Bookit records pending reservations and the organiser console confirms payment and attendance.
            WhatsApp stays available for help, but the booking workflow starts here.
          </div>
        </div>

        <div>
          {selectedCourt && (
            <BookingForm
              key={selectedCourt._id}
              courtId={selectedCourt._id}
              courtName={selectedCourt.name}
              pricePerHour={selectedCourt.price_per_hour}
            />
          )}
        </div>
      </div>
    </div>
  );
}
