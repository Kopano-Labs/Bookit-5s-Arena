import mongoose from 'mongoose';
import { config as loadEnvFile } from 'dotenv';
import Booking from '../models/Booking.js';
import BookingSlot from '../models/BookingSlot.js';
import { isValidBookingDateValue } from '../lib/bookingDates.js';

loadEnvFile({ path: '.env.local' });

function hoursFor(startTime, duration) {
  if (!/^(?:[01]\d|2[0-3]):00$/.test(startTime) || !Number.isInteger(duration) || duration < 1 || duration > 3) {
    throw new TypeError('Invalid booking time or duration.');
  }
  const start = Number(startTime.slice(0, 2));
  return Array.from({ length: duration }, (_, offset) => start + offset);
}

const apply = process.argv.includes('--apply');
const uri =
  process.env.MONGODB_URI ||
  process.env.MONGODB_DIRECT_URI ||
  process.env.MONGODB_URI_DIRECT ||
  process.env.DATABASE_URL;

if (!uri) throw new Error('Set MONGODB_URI or MONGODB_DIRECT_URI before running this migration.');

await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000, maxPoolSize: 5 });

try {
  const bookings = await Booking.find({ status: { $ne: 'cancelled' } })
    .select('_id court date start_time duration +slotClaimId')
    .sort({ date: 1, start_time: 1, _id: 1 })
    .lean();

  const occupiedHours = new Map();
  const conflicts = [];
  for (const booking of bookings) {
    if (!booking.court || !isValidBookingDateValue(booking.date)) {
      throw new Error('An active booking has no court or a malformed date; resolve it before migration.');
    }
    for (const hour of hoursFor(booking.start_time, booking.duration)) {
      const key = String(booking.court) + ':' + booking.date + ':' + hour;
      const previousBookingId = occupiedHours.get(key);
      if (previousBookingId && previousBookingId !== String(booking._id)) {
        conflicts.push(key + ' (' + previousBookingId + ' conflicts with ' + booking._id + ')');
      } else {
        occupiedHours.set(key, String(booking._id));
      }
    }
  }

  if (conflicts.length > 0) {
    throw new Error('Overlapping active legacy bookings must be resolved before migration: ' + conflicts.join('; '));
  }

  console.log('Found ' + bookings.length + ' active bookings.');
  if (!apply) {
    console.log('Dry run only. Use --apply to seed hourly claims and replace the legacy start-time index.');
  } else {
    await BookingSlot.collection.createIndex(
      { court: 1, date: 1, hour: 1 },
      { unique: true, name: 'court_date_hour_unique' },
    );
    await BookingSlot.collection.createIndex({ claimId: 1 }, { name: 'booking_slot_claim_lookup' });
    await BookingSlot.collection.createIndex(
      { expiresAt: 1 },
      {
        expireAfterSeconds: 0,
        name: 'unattached_booking_claim_ttl',
        partialFilterExpression: { bookingId: null },
      },
    );

    for (const booking of bookings) {
      const claimId = booking.slotClaimId || 'legacy-' + String(booking._id);
      for (const hour of hoursFor(booking.start_time, booking.duration)) {
        try {
          const row = await BookingSlot.collection.findOneAndUpdate(
            { court: booking.court, date: booking.date, hour },
            { $setOnInsert: { court: booking.court, date: booking.date, hour, claimId, bookingId: booking._id } },
            { upsert: true, returnDocument: 'after' },
          );
          const claimed = row?.value || row;
          if (claimed?.claimId !== claimId) {
            throw new Error('Conflicting active bookings exist for court ' + booking.court + ', date ' + booking.date + ', hour ' + hour + '.');
          }
        } catch (error) {
          if (error?.code === 11000) {
            throw new Error('Conflicting active bookings exist for court ' + booking.court + ', date ' + booking.date + ', hour ' + hour + '.', { cause: error });
          }
          throw error;
        }
      }
      await Booking.collection.updateOne(
        { _id: booking._id, $or: [{ slotClaimId: { $exists: false } }, { slotClaimId: null }] },
        { $set: { slotClaimId: claimId } },
      );
    }

    const indexes = await Booking.collection.indexes();
    const oldIndex = indexes.find(
      (index) => index.unique && index.key?.court === 1 && index.key?.date === 1 && index.key?.start_time === 1,
    );
    if (oldIndex) {
      await Booking.collection.dropIndex(oldIndex.name);
      console.log('Dropped legacy index ' + oldIndex.name + '.');
    }
    console.log('Seeded hourly claims for ' + bookings.length + ' active bookings.');
  }
} finally {
  await mongoose.disconnect();
}
