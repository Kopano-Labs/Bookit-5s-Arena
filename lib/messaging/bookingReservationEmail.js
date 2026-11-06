// Recovered reservation-oriented content from 73b7ce1; transport and state hardened.
import { bookitOrigin, escapeHtml as e, sendTransactionalEmail } from './transactionalEmail.js';
import { guestManagementPath } from '../bookings/guestManagementLink.js';

export function buildReservationEmail({ recipientName, recipientType, booking, court, guestManagementToken }) {
  const business = recipientType === 'business';
  const cancelled = booking.status === 'cancelled';
  const updated = Number(booking.communicationRevision || 1) > 1;
  const title = cancelled ? 'Court reservation cancelled' : updated ? 'Court reservation updated'
    : business ? 'New court reservation' : 'Your court reservation';
  const paid = booking.paymentStatus === 'paid';
  const payment = cancelled ? 'Cancelled - contact the venue about any payment'
    : paid ? 'Paid' : booking.paymentStatus === 'reserved' ? 'Pay at venue' : 'Unpaid';
  const managementPath = !business && !booking.user && !cancelled
    ? guestManagementPath(booking._id, guestManagementToken) : null;
  const href = business ? '/admin/bookings' : booking.user ? '/bookings' : managementPath || '/contact';
  const guestAdvice = managementPath
    ? 'Keep this private link: anyone with it can view, reschedule or cancel this reservation. It expires 30 days after booking.'
    : cancelled ? 'Contact the venue with your reference about any payment already made.'
      : 'For changes, use the private link in your original confirmation or contact the venue with your reference.';
  const customer = business ? `<p>Customer: ${e(booking.guestName || recipientName)}<br>
    Email: ${e(booking.guestEmail)}<br>Phone: ${e(booking.guestPhone)}</p>` : '';
  return { subject: `${title} - ${court.name} - ${booking.date} ${booking.start_time}`,
    html: `<div style="font-family:Arial,sans-serif;max-width:580px;margin:auto">
    <h1>${e(title)}</h1><p>${business ? 'A reservation is saved in Bookit.' : `Hi ${e(recipientName || 'player')}, here are your saved reservation details.`}</p>
    <p><strong>${e(court.name)}</strong><br>${e(booking.date)} · ${e(booking.start_time)} · ${e(booking.duration)}h</p>
    <p>Amount due: R${e(paid || cancelled ? 0 : booking.total_price)}<br>
    Booking total: R${e(booking.total_price)}<br>Status: ${e(booking.status)} · ${e(payment)}</p>
    <p>Reference: ${e(booking._id)}</p>${customer}
    <p><a href="${e(bookitOrigin() + href)}">${business ? 'Open bookings' : booking.user ? 'Your bookings' : managementPath ? 'Manage this reservation' : 'Contact the venue'}</a></p>
    ${!booking.user && !business ? `<p>${guestAdvice}</p>` : ''}</div>` };
}

export async function sendBookingReservationEmail({ to, recipientName, recipientType, booking, court, guestManagementToken, idempotencyKey }) {
  return sendTransactionalEmail({ to, ...buildReservationEmail({ recipientName, recipientType, booking, court, guestManagementToken }), idempotencyKey });
}
