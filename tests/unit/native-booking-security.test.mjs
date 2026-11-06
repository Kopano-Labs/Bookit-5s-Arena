import assert from 'node:assert/strict';
import test from 'node:test';
import { bookingResponse } from '../../lib/bookings/bookingResponse.js';
import { hoursForReservation, reservationReplayIdentity, readIdempotencyKey } from '../../lib/bookings/reservationOwnership.js';

test('customer DTO excludes verifiers, retry keys, payment-provider fields and populated court owner', () => {
  const source = { _id: 'booking', date: '2030-01-01', total_price: 400, status: 'pending', paymentStatus: 'reserved',
    guestEmail: 'guest@example.invalid', guestPhone: '0712345678', guestManagementTokenHash: 'verifier',
    idempotencyKey: 'private', idempotencyFingerprint: 'private-fingerprint', externalPaymentRef: 'private-provider-ref',
    guestManagementPermissions: ['cancel'], __v: 20,
    court: { _id: 'court', name: 'Court 1', price_per_hour: 400, owner: { email: 'private@example.invalid' } } };
  const serialized = bookingResponse({ toObject: () => source });
  assert.equal(serialized.court.name, 'Court 1'); assert.equal(serialized.court.owner, undefined);
  for (const key of ['guestManagementTokenHash', 'idempotencyKey', 'idempotencyFingerprint', 'externalPaymentRef', '__v', 'guestManagementPermissions'])
    assert.equal(serialized[key], undefined);
  const replay = bookingResponse(source, { replay: true });
  assert.deepEqual(Object.keys(replay).sort(), ['_id', 'paymentStatus', 'replayed', 'status', 'total_price']);
});

test('one retry key cannot select another signed-in principal or guest identity', () => {
  const payload = ['court', '2030-01-01', '10:00', 1];
  const first = reservationReplayIdentity('opaque-retry-key-123', 'user:alice', payload);
  assert.notEqual(first.idempotencyKey, reservationReplayIdentity('opaque-retry-key-123', 'user:bob', payload).idempotencyKey);
  assert.notEqual(first.idempotencyKey, reservationReplayIdentity('opaque-retry-key-123', 'guest:alice', payload).idempotencyKey);
  assert.notEqual(first.idempotencyFingerprint, reservationReplayIdentity('opaque-retry-key-123', 'user:alice', [...payload, 'changed']).idempotencyFingerprint);
  assert(!first.idempotencyKey.includes('opaque-retry-key'));
});

test('malformed retry keys reject explicitly; valid opaque keys survive the boundary', () => {
  assert.throws(() => readIdempotencyKey(new Request('https://example.invalid', { headers: { 'idempotency-key': 'bad' } })), /Invalid/);
  assert.equal(readIdempotencyKey(new Request('https://example.invalid', { headers: { 'idempotency-key': 'valid-retry-key-00001' } })), 'valid-retry-key-00001');
});

test('hour ownership rejects impossible and out-of-hours intervals', () => {
  assert.deepEqual(hoursForReservation('10:00', 3), ['10:00', '11:00', '12:00']);
  for (const [time, duration] of [['99:00', 1], ['21:00', 2], ['10:30', 1], ['10:00', 0], ['10:00', 1.5]])
    assert.throws(() => hoursForReservation(time, duration));
});
