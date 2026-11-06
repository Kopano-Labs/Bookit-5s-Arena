import assert from 'node:assert/strict';
import test from 'node:test';
import { courtShowcase, venueCourtPhotos } from '../../lib/venueCourtPhotos.js';
import { buildReservationEmail } from '../../lib/messaging/bookingReservationEmail.js';
import { guestManagementPath } from '../../lib/bookings/guestManagementLink.js';
import { bookitOrigin } from '../../lib/messaging/transactionalEmail.js';

test('preview receipt links return to their deployment rather than an inherited production URL', () => {
  const original = { VERCEL_ENV: process.env.VERCEL_ENV, VERCEL_URL: process.env.VERCEL_URL, NEXTAUTH_URL: process.env.NEXTAUTH_URL };
  try {
    process.env.VERCEL_ENV = 'preview'; process.env.VERCEL_URL = 'bookit-fixture.vercel.app';
    process.env.NEXTAUTH_URL = 'https://fivesarena.com';
    assert.equal(bookitOrigin(), 'https://bookit-fixture.vercel.app');
    delete process.env.VERCEL_URL;
    assert.throws(() => bookitOrigin(), /Preview deployment origin/);
    process.env.VERCEL_ENV = 'production'; assert.equal(bookitOrigin(), 'https://fivesarena.com');
  } finally {
    for (const [key, value] of Object.entries(original)) {
      if (value === undefined) delete process.env[key]; else process.env[key] = value;
    }
  }
});

test('only a guest customer receives the private fragment link', () => {
  const id = 'a'.repeat(24), token = 'b'.repeat(43);
  const path = guestManagementPath(id, token);
  assert.equal(path, `/book/manage/${id}#token=${token}`);
  assert.equal(guestManagementPath(id, 'bad&token'), null);
  assert.equal(guestManagementPath('../admin', token), null);
  const booking = { _id: id, status: 'pending', date: '2030-01-01', start_time: '10:00' };
  const args = { booking, court: { name: 'Court' }, guestManagementToken: token };
  assert(buildReservationEmail({ ...args, recipientType: 'user' }).html.includes(path));
  assert(!buildReservationEmail({ ...args, recipientType: 'business' }).html.includes(token));
  assert(!buildReservationEmail({ ...args, recipientType: 'user', booking: { ...booking, user: 'player' } }).html.includes(token));
  assert(!buildReservationEmail({ ...args, recipientType: 'user', booking: { ...booking, status: 'cancelled' } }).html.includes(token));
});

test('empty inventory retains the four original photos without fake bookable IDs, prices or slots', () => {
  const cards = courtShowcase();
  assert.equal(cards.length, 4);
  assert.deepEqual(cards.map(card => card.image), ['court-1.jpg', 'court-2.jpg', 'court-3.jpg', 'court-4.jpg']);
  assert.equal(new Set(venueCourtPhotos.map(card => card.image)).size, 4);
  for (const card of cards) {
    assert.equal(card.galleryOnly, true); assert.equal(card.price_per_hour, undefined);
    assert.equal(card.availability, undefined); assert.equal(card._id, undefined);
    assert.equal(card.bookingHref, undefined);
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
