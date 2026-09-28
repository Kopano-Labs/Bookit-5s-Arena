import { randomUUID } from 'node:crypto';
import mongoose from 'mongoose';
import Booking from '@/models/Booking';
import BookingSlot from '@/models/BookingSlot';

let slotIndexesReady;

export class BookingSlotConflictError extends Error {
  constructor() {
    super('This court was just booked for that time. Refresh availability and choose another slot.');
    this.name = 'BookingSlotConflictError';
    this.code = 'BOOKING_SLOT_CONFLICT';
  }
}

export function bookingHourNumbers(startTime, duration) {
  if (!/^(?:[01]\d|2[0-3]):00$/.test(startTime) || !Number.isInteger(duration) || duration < 1 || duration > 3) {
    throw new TypeError('A valid hourly start time and duration are required.');
  }

  const startHour = Number(startTime.slice(0, 2));
  return Array.from({ length: duration }, (_, offset) => startHour + offset);
}

function overlapsExistingBooking(bookings, hours) {
  const first = hours[0] * 60;
  const last = (hours[hours.length - 1] + 1) * 60;

  return bookings.some((booking) => {
    const [hour, minute] = String(booking.start_time || '').split(':').map(Number);
    const start = hour * 60 + minute;
    const end = start + Number(booking.duration) * 60;
    return Number.isFinite(start) && Number.isFinite(end) && first < end && last > start;
  });
}

async function ensureSlotIndexes() {
  if (!slotIndexesReady) {
    slotIndexesReady = Promise.all([
      BookingSlot.collection.createIndex(
        { court: 1, date: 1, hour: 1 },
        { unique: true, name: 'court_date_hour_unique' },
      ),
      BookingSlot.collection.createIndex(
        { claimId: 1 },
        { name: 'booking_slot_claim_lookup' },
      ),
      BookingSlot.collection.createIndex(
        { expiresAt: 1 },
        {
          expireAfterSeconds: 0,
          name: 'unattached_booking_claim_ttl',
          partialFilterExpression: { bookingId: null },
        },
      ),
    ]).catch((error) => {
      slotIndexesReady = null;
      throw error;
    });
  }

  await slotIndexesReady;
}

function isDuplicateKeyError(error) {
  return error?.code === 11000 || error?.writeErrors?.some((writeError) => writeError?.code === 11000);
}

export async function claimBookingSlots({ courtId, date, startTime, duration, excludeBookingId }) {
  const hours = bookingHourNumbers(startTime, duration);
  await ensureSlotIndexes();
  await BookingSlot.deleteMany({ bookingId: null, expiresAt: { $lte: new Date() } });

  const bookingFilter = {
    court: courtId,
    date,
    status: { $ne: 'cancelled' },
  };
  if (excludeBookingId) bookingFilter._id = { $ne: excludeBookingId };

  const existingBookings = await Booking.find(bookingFilter)
    .select('start_time duration')
    .lean();
  if (overlapsExistingBooking(existingBookings, hours)) {
    throw new BookingSlotConflictError();
  }

  const claimId = randomUUID();
  const court = new mongoose.Types.ObjectId(String(courtId));
  const documents = hours.map((hour) => ({
    court,
    date,
    hour,
    claimId,
    bookingId: null,
    expiresAt: new Date(Date.now() + 2 * 60 * 1000),
  }));

  try {
    await BookingSlot.collection.insertMany(documents, { ordered: true });
    return claimId;
  } catch (error) {
    await BookingSlot.deleteMany({ claimId }).catch(() => {});
    if (isDuplicateKeyError(error)) throw new BookingSlotConflictError();
    throw error;
  }
}

export async function releaseBookingSlotClaim(claimId) {
  if (!claimId) return;
  await BookingSlot.deleteMany({ claimId });
}

export async function attachBookingSlotClaim(claimId, bookingId) {
  if (!claimId || !bookingId) return;
  await BookingSlot.updateMany(
    { claimId },
    {
      $set: { bookingId: new mongoose.Types.ObjectId(String(bookingId)) },
      $unset: { expiresAt: '' },
    },
  );
}
