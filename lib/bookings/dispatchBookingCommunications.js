// Restores 73b7ce1's post-save customer/business fan-out and revision-keyed receipts.
// Only email is activated here; no simulated WhatsApp/SMS is counted as sent.
import BookingDelivery from '../../models/BookingDelivery.js';
import { getBookingBusinessContacts } from './businessContacts.js';
import { sendBookingReservationEmail } from '../messaging/bookingReservationEmail.js';
import { runDurableDelivery } from '../messaging/durableDelivery.js';

export async function dispatchBookingCommunications({ booking, court, customerName, customerEmail, customerPhone }) {
  const revision = Math.max(1, Number(booking.communicationRevision || 1));
  const business = getBookingBusinessContacts();
  const snapshot = { ...(booking.toObject ? booking.toObject() : booking),
    guestName: customerName, guestEmail: customerEmail, guestPhone: customerPhone };
  const recipients = [['user', customerEmail], ['business', business.email]];
  const results = await Promise.allSettled(recipients.map(([recipientType, recipientAddress]) =>
    runDurableDelivery({ Model: BookingDelivery,
      key: { booking: booking._id, revision, recipientType, channel: 'email', purpose: 'reservation_receipt' },
      recipientAddress, send: id => sendBookingReservationEmail({ to: recipientAddress,
        recipientName: customerName, recipientType, booking: snapshot, court,
        idempotencyKey: `booking-${id}` }) })));
  return results.map((r, i) => ({ recipientType: recipients[i][0], channel: 'email',
    ...(r.status === 'fulfilled' ? r.value : { status: 'pending' }) }));
}

export async function notifySavedBooking(args) {
  try { return await dispatchBookingCommunications(args); }
  catch { console.error('[BOOKING_RECEIPT_PENDING]'); return [{ status: 'pending' }]; }
}
