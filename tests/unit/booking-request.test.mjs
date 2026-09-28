import test from 'node:test';
import assert from 'node:assert/strict';
import { bookingRequest } from '../../lib/bookingRequest.js';

test('booking requests preserve server outcomes and reject failures', async (t) => {
  const original = globalThis.fetch;
  t.after(() => { globalThis.fetch = original; });
  globalThis.fetch = async (_, options) => {
    assert.equal(options.cache, 'no-store');
    return Response.json({ status: 'pending' });
  };
  assert.deepEqual(await bookingRequest('/test'), { status: 'pending' });
  globalThis.fetch = async () => Response.json({ error: 'Slot no longer available' }, { status: 409 });
  await assert.rejects(bookingRequest('/test'), /Slot no longer available/);
  globalThis.fetch = async () => new Response('upstream unavailable', { status: 502 });
  await assert.rejects(bookingRequest('/test'), /Refresh/);
  globalThis.fetch = async () => new Response('invalid json');
  await assert.rejects(bookingRequest('/test'), /unreadable/);
  globalThis.fetch = async () => { throw new Error('Network interrupted'); };
  await assert.rejects(bookingRequest('/test'), /Network interrupted/);
});
