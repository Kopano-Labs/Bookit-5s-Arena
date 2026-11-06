import crypto from 'node:crypto';
import mongoose from 'mongoose';
import Booking from '@/models/Booking';
import BookingSlotClaim from '@/models/BookingSlotClaim';

const conflict = (code, message) => Object.assign(new Error(message), { code });
const digest = value => crypto.createHash('sha256').update(value).digest('hex');
export function hoursForReservation(startTime, duration) {
  if (!/^(?:[01]\d|2[0-3]):00$/.test(startTime) || !Number.isInteger(duration) || duration < 1 || duration > 3)
    throw new Error('Invalid hourly reservation');
  const hour = Number(startTime.slice(0, 2));
  if (hour < 10 || hour + duration > 22) throw new Error('Invalid hourly reservation');
  return Array.from({ length: duration }, (_, offset) => String(hour + offset).padStart(2, '0') + ':00');
}
export function readIdempotencyKey(request) {
  const key = request.headers.get('idempotency-key') || '';
  if (key && !/^[A-Za-z0-9._-]{16,128}$/.test(key))
    throw conflict('INVALID_RETRY_KEY', 'Invalid reservation retry key');
  return key || null;
}
export function reservationReplayIdentity(key, principal, payload) {
  return { idempotencyKey: key ? digest(JSON.stringify([principal, key])) : null,
    idempotencyFingerprint: digest(JSON.stringify(payload)) };
}
export async function findReservationReplay(idempotencyKey, fingerprint) {
  if (!idempotencyKey) return null;
  const booking = await Booking.findOne({ idempotencyKey }).select('+idempotencyFingerprint');
  if (booking && booking.idempotencyFingerprint !== fingerprint)
    throw conflict('BOOKING_REPLAY_CONFLICT', 'This retry key belongs to different reservation details');
  return booking;
}
export function createGuestManagementToken() {
  const token = crypto.randomBytes(32).toString('base64url');
  return { token, hash: hashGuestManagementToken(token) };
}
export function hashGuestManagementToken(token) { return digest(String(token || '')); }

let indexes;
async function transaction(work) {
  // No index deletion or legacy migration is performed during a request.
  indexes ||= Promise.all([Booking.init(), BookingSlotClaim.init()]).catch(error => { indexes = null; throw error; });
  await indexes;
  const session = await mongoose.startSession();
  try {
    return await session.withTransaction(() => work(session), {
      readConcern: { level: 'snapshot' }, writeConcern: { w: 'majority' },
    });
  } finally { await session.endSession(); }
}
async function replaceClaims(booking, session) {
  if (booking.status === 'cancelled') {
    await BookingSlotClaim.deleteMany({ booking: booking._id }, { session });
    return;
  }
  const rows = await Booking.find({ court: booking.court, date: booking.date,
    status: { $ne: 'cancelled' }, _id: { $ne: booking._id } }).session(session).select('start_time duration').lean();
  const start = Number(booking.start_time.slice(0, 2)) * 60;
  if (rows.some(row => {
    const [hour, minute] = row.start_time.split(':').map(Number);
    const otherStart = hour * 60 + minute;
    return start < otherStart + row.duration * 60 && start + booking.duration * 60 > otherStart;
  })) throw conflict('BOOKING_SLOT_TAKEN', 'This court is already booked during that time');
  const existing = await BookingSlotClaim.find({ booking: booking._id }).session(session).lean();
  const key = row => `${row.court}:${row.date}:${row.hour}`;
  const wanted = hoursForReservation(booking.start_time, booking.duration).map(hour => ({
    booking: booking._id, court: booking.court, date: booking.date, hour,
  }));
  const wantedKeys = new Set(wanted.map(key));
  const existingKeys = new Set(existing.map(key));
  const stale = existing.filter(row => !wantedKeys.has(key(row))).map(row => row._id);
  if (stale.length) await BookingSlotClaim.deleteMany({ booking: booking._id, _id: { $in: stale } }, { session });
  const additions = wanted.filter(row => !existingKeys.has(key(row)));
  if (additions.length) await BookingSlotClaim.insertMany(additions, { session, ordered: true });
}
export async function createReservationWithClaims({ court, date, start_time, duration,
  idempotencyKey, idempotencyFingerprint, bookingFields }) {
  const replay = await findReservationReplay(idempotencyKey, idempotencyFingerprint);
  if (replay) return { booking: replay, replayed: true };
  try {
    return await transaction(async session => {
      const booking = new Booking({ ...bookingFields, court: court._id, date, start_time, duration,
        ...(idempotencyKey ? { idempotencyKey, idempotencyFingerprint } : {}) });
      await booking.save({ session });
      await replaceClaims(booking, session);
      return { booking, replayed: false };
    });
  } catch (error) {
    if (error?.code === 11000) {
      const replay = await findReservationReplay(idempotencyKey, idempotencyFingerprint);
      if (replay) return { booking: replay, replayed: true };
      throw conflict('BOOKING_SLOT_TAKEN', 'This court is already booked during that time');
    }
    throw error;
  }
}
export async function updateReservation({ booking, changes, revokeGuestToken = false }) {
  const expectedVersion = Number(booking.__v || 0);
  try {
    return await transaction(async session => {
      const current = await Booking.findById(booking._id).session(session);
      if (!current || Number(current.__v || 0) !== expectedVersion)
        throw conflict('BOOKING_CHANGED', 'The booking changed. Refresh before trying again.');
      const changed = Object.entries(changes).some(([key, value]) => current[key] !== value);
      if (changed) {
        Object.assign(current, changes);
        current.__v = expectedVersion + 1;
        current.communicationRevision = Math.max(1, current.communicationRevision || 1) + 1;
        if (revokeGuestToken) current.guestManagementTokenRevokedAt = new Date();
        await current.save({ session });
        await replaceClaims(current, session);
      }
      await current.populate('court');
      return { booking: current, changed };
    });
  } catch (error) {
    if (error?.code === 11000) throw conflict('BOOKING_SLOT_TAKEN', 'This court is already booked during that time');
    throw error;
  }
}
export function reservationError(error) {
  if (['BOOKING_SLOT_TAKEN', 'BOOKING_CHANGED', 'BOOKING_REPLAY_CONFLICT'].includes(error?.code))
    return { error: error.message, status: 409 };
  if (error?.code === 'INVALID_RETRY_KEY') return { error: error.message, status: 400 };
  if (error?.code === 20 || /Transaction numbers are only allowed|replica set member or mongos/i.test(error?.message || ''))
    return { error: 'Reservations are temporarily unavailable. Please try again later.', status: 503 };
  return null;
}
