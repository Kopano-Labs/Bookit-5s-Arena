import assert from 'node:assert/strict';
import test from 'node:test';
import { courtShowcase, venueCourtPhotos } from '../../lib/venueCourtPhotos.js';
import { buildReservationEmail } from '../../lib/messaging/bookingReservationEmail.js';

test('empty inventory retains the four original photos without fake bookable IDs, prices or slots', () => {
  const cards = courtShowcase();
  assert.equal(cards.length, 4);
  assert.deepEqual(cards.map(card => card.image), ['court-1.jpg', 'court-2.jpg', 'court-3.jpg', 'court-4.jpg']);
  assert.equal(new Set(venueCourtPhotos.map(card => card.image)).size, 4);
  for (const card of cards) {
    assert.equal(card.galleryOnly, true); assert.equal(card.price_per_hour, undefined);
    assert.equal(card.availability, undefined); assert.equal(card.bookingHref, '/book');
  }
});

test('real court cards keep their database identity and enter native booking for that court', () => {
  const id = 'a'.repeat(24);
  const cards = courtShowcase([{ _id: id, name: 'Actual Court', image: 'court-1.jpg', price_per_hour: 450 }]);
  assert.equal(cards[0].bookingHref, '/book?courtId=' + id);
  assert.equal(cards[0].price_per_hour, 450); assert.equal(cards[0].galleryOnly, undefined);
});

test('customer and venue email agree on the saved reference, court, amount and payment state', () => {
  const booking = { _id: 'saved-server-reference', date: '2030-01-01', start_time: '18:00', duration: 2,
    total_price: 800, status: 'pending', paymentStatus: 'reserved', guestName: '<Guest>',
    guestEmail: 'guest@example.invalid', guestPhone: '0712345678' };
  for (const recipientType of ['user', 'business']) {
    const result = buildReservationEmail({ recipientName: '<Guest>', recipientType, booking, court: { name: 'Premier Court' } });
    for (const text of ['saved-server-reference', 'Premier Court', 'R800', 'pending', 'Pay at venue']) assert(result.html.includes(text));
    assert(!result.html.includes('<Guest>'));
  }
  const venue = buildReservationEmail({ recipientType: 'business', booking, court: { name: 'Premier Court' } });
  assert(venue.html.includes('guest@example.invalid')); assert(venue.html.includes('/admin/bookings'));
  const cancelled = buildReservationEmail({ recipientType: 'user', booking: { ...booking, status: 'cancelled' }, court: { name: 'Premier Court' } });
  assert(cancelled.subject.includes('cancelled')); assert(cancelled.html.includes('Amount due: R0'));
});
