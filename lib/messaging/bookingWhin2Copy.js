/**
 * Shared copy for Whin2 booking confirmations (webhook + internal broadcast).
 */
export function buildWhin2BookingConfirmationText({ bookingId, court, date, time }) {
  return (
    `⚽ 5s Arena Confirmation ⚽\n\n` +
    `Booking ID: ${bookingId}\n` +
    `Court: ${court}\n` +
    `Date: ${date}\n` +
    `Time: ${time}\n\n` +
    `Show this message at the Hellenic FC gate. Sharp!`
  );
}
