/**
 * Shared copy for Whin2 / Evolution booking confirmations (no PII beyond what SMS already carries).
 */
export function buildBookingConfirmationWhatsappText({ bookingId, court, date, time }) {
  return (
    `⚽ 5s Arena Confirmation ⚽\n\n` +
    `Booking ID: ${bookingId}\n` +
    `Court: ${court}\n` +
    `Date: ${date}\n` +
    `Time: ${time}\n\n` +
    `Show this message at the Hellenic FC gate. Sharp!`
  );
}
