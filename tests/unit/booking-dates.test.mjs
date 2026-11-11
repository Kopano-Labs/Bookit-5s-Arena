import assert from 'node:assert/strict';
import test from 'node:test';

import {
  bookingDateTimeToInstant,
  getTodayInBookingTimeZone,
  isElapsedStartTimeForDate,
  isPastBookingDate,
  isValidBookingDateValue,
} from '../../lib/bookingDates.js';
import { isAllowedBookingStartTime, parseBookingHour } from '../../lib/bookingSlots.js';

test('booking dates are validated as real YYYY-MM-DD values', () => {
  assert.equal(isValidBookingDateValue('2026-09-21'), true);
  assert.equal(isValidBookingDateValue('2026-02-29'), false);
  assert.equal(isValidBookingDateValue('2026-13-01'), false);
  assert.equal(isValidBookingDateValue('21-09-2026'), false);
});

test('booking today is calculated in Africa/Johannesburg time', () => {
  const lateUtc = new Date('2026-09-20T22:15:00.000Z');

  assert.equal(getTodayInBookingTimeZone(lateUtc), '2026-09-21');
  assert.equal(isPastBookingDate('2026-09-20', lateUtc), true);
  assert.equal(isPastBookingDate('2026-09-21', lateUtc), false);
});

test('availability hides start times that already passed today', () => {
  const now = new Date('2026-09-21T09:30:00.000Z');

  assert.equal(isElapsedStartTimeForDate('2026-09-21', 10 * 60, now), true);
  assert.equal(isElapsedStartTimeForDate('2026-09-21', 12 * 60, now), false);
  assert.equal(isElapsedStartTimeForDate('2026-09-22', 10 * 60, now), false);
});

test('booking wall time converts to the South African instant independently of host timezone', () => {
  assert.equal(bookingDateTimeToInstant('2026-09-25', '10:00').toISOString(), '2026-09-25T08:00:00.000Z');
  assert.equal(bookingDateTimeToInstant('2026-09-25', '22:00').toISOString(), '2026-09-25T20:00:00.000Z');
  assert.equal(bookingDateTimeToInstant('2026-09-25', '24:00'), null);
});

test('booking start parser rejects impossible hours and minutes', () => {
  assert.equal(parseBookingHour('10:00')?.hour, 10);
  assert.equal(parseBookingHour('99:00'), null);
  assert.equal(parseBookingHour('10:99'), null);
  assert.equal(isAllowedBookingStartTime('21:00', 1), true);
  assert.equal(isAllowedBookingStartTime('21:00', 2), false);
});
