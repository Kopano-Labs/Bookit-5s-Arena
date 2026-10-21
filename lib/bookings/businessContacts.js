// No historical default: release must explicitly verify the venue recipient.
export function getBookingBusinessContacts() {
  return { email: String(process.env.BOOKING_BUSINESS_EMAIL || process.env.BUSINESS_EMAIL || '').trim() || null };
}
