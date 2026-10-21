// Recovered reservation-oriented content from 73b7ce1; transport and state hardened.
import { bookitOrigin, escapeHtml as e, sendTransactionalEmail } from './transactionalEmail.js';

export function buildReservationEmail({ recipientName, recipientType, booking, court }) {
  const business = recipientType === 'business';
  const cancelled = booking.status === 'cancelled';
  const updated = Number(booking.communicationRevision || 1) > 1;
  const title = cancelled ? 'Court reservation cancelled' : updated ? 'Court reservation updated'
    : business ? 'New court reservation' : 'Your court reservation';
  const paid = booking.paymentStatus === 'paid';
  const payment = cancelled ? 'Cancelled â€” contact the venue about any payment'
    : paid ? 'Paid' : booking.paymentStatus === 'reserved' ? 'Pay at venue' : 'Unpaid';
  const href = business ? '/admin/bookings' : booking.user ? '/bookings' : '/contact';
  const customer = business ? `<p>Customer: ${e(booking.guestName || recipientName)}<br>
    Email: ${e(booking.guestEmail)}<br>Phone: ${e(booking.guestPhone)}</p>` : '';
  return { subject: `${title} â€” ${court.name} â€” ${booking.date} ${booking.start_time}`,
    html: `<div style="font-family:Arial,sans-serif;max-width:580px;margin:auto">
    <h1>${e(title)}</h1><p>${business ? 'A reservation is saved in Bookit.' : `Hi ${e(recipientName || 'player')}, here are your saved reservation details.`}</p>
    <p><strong>${e(court.name)}</strong><br>${e(booking.date)} Â· ${e(booking.start_time)} Â· ${e(booking.duration)}h</p>
    <p>Amount due: R${e(paid || cancelled ? 0 : booking.total_price)}<br>
    Booking total: R${e(booking.total_price)}<br>Status: ${e(booking.status)} Â· ${e(payment)}</p>
    <p>Reference: ${e(booking._id)}</p>${customer}
    <p><a href="${bookitOrigin()}${href}">${business ? 'Open bookings' : booking.user ? 'Your bookings' : 'Contact the venue'}</a></p>
    ${!booking.user && !business ? '<p>Use your reference when contacting the venue about changes.</p>' : ''}</div>` };
}

export async function sendBookingReservationEmail({ to, recipientName, recipientType, booking, court, idempotencyKey }) {
  return sendTransactionalEmail({ to, ...buildReservationEmail({ recipientName, recipientType, booking, court }), idempotencyKey });
}
