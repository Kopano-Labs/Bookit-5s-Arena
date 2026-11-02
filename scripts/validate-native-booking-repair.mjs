// Exercises the real Next routes and database engine using only disposable local data.
import assert from 'node:assert/strict';
import { MongoMemoryReplSet } from 'mongodb-memory-server-core';
import { MongoClient, ObjectId } from 'mongodb';
import { encode } from 'next-auth/jwt';
import { spawn } from 'node:child_process';
import net from 'node:net';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';

const output = process.env.BOOKIT_REPAIR_RECEIPT || 'docs/hackathon-build/native-repair-receipt.json';
const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'bookit-native-regression-'));
const checks = [];
const pass = name => { checks.push(name); console.log('PASS ' + name); };
let mongo, client, app, helperMongo;
const inbox = [];
const smtp = net.createServer(socket => {
  let pending = '', data = false, body = '', recipient = '';
  socket.setEncoding('utf8'); socket.write('220 bookit-test ESMTP\r\n');
  socket.on('data', chunk => {
    pending += chunk;
    while (pending.includes('\r\n')) {
      const end = pending.indexOf('\r\n'), line = pending.slice(0, end); pending = pending.slice(end + 2);
      if (data) {
        if (line === '.') { inbox.push({ recipient, raw: body }); data = false; body = ''; socket.write('250 Captured\r\n'); }
        else body += line + '\r\n';
      } else if (/^(EHLO|HELO)/i.test(line)) socket.write('250 bookit-test\r\n');
      else if (/^RCPT TO:/i.test(line)) { recipient = line.match(/<([^>]+)>/)?.[1] || ''; socket.write('250 OK\r\n'); }
      else if (/^DATA$/i.test(line)) { data = true; socket.write('354 Send data\r\n'); }
      else if (/^QUIT$/i.test(line)) socket.end('221 Bye\r\n');
      else socket.write('250 OK\r\n');
    }
  }); socket.on('error', () => {});
});
await new Promise(resolve => smtp.listen(0, '127.0.0.1', resolve));

const probe = net.createServer();
await new Promise(resolve => probe.listen(0, '127.0.0.1', resolve));
const port = probe.address().port;
await new Promise(resolve => probe.close(resolve));
const origin = 'http://127.0.0.1:' + port;
const secret = 'disposable-native-bookit-regression-secret';
let ip = 0;
async function request(url, body, cookie, method = body ? 'POST' : 'GET', headers = {}) {
  const response = await fetch(origin + url, { method, headers: { 'Content-Type': 'application/json',
    'x-forwarded-for': '127.1.0.' + (++ip), ...(cookie ? { cookie } : {}), ...headers },
    ...(body ? { body: JSON.stringify(body) } : {}) });
  const text = await response.text();
  return { status: response.status, body: JSON.parse(text) };
}
try {
  mongo = await MongoMemoryReplSet.create({ replSet: { count: 1, storageEngine: 'wiredTiger' } });
  const uri = mongo.getUri('bookit_native_regression');
  assert.match(uri, /^mongodb:\/\/127\.0\.0\.1:/);
  client = await new MongoClient(uri).connect();
  const db = client.db();
  const owner = new ObjectId(), stranger = new ObjectId();
  await db.collection('users').insertMany([
    { _id: owner, name: 'Isolated Operator', email: 'owner@example.invalid', roles: ['user', 'admin'] },
    { _id: stranger, name: 'Other Operator', email: 'other@example.invalid', roles: ['user', 'admin'] },
  ]);
  const env = { ...process.env };
  for (const key of Object.keys(env)) if (/^(RESEND|GMAIL|GOOGLE|FACEBOOK|WHATSAPP|SMS_|PAYSTACK|STRIPE)/.test(key)) env[key] = '';
  Object.assign(env, { MONGODB_URI: uri, MONGODB_DIRECT_URI: uri, MONGODB_URI_DIRECT: uri, DATABASE_URL: uri,
    NEXTAUTH_URL: origin, NEXTAUTH_SECRET: secret, AUTH_SECRET: secret, BOOKIT_SANDBOX: 'true',
    BOOKING_COMMUNICATIONS_ENABLED: 'false', NEXT_TELEMETRY_DISABLED: '1',
    BOOKIT_EMAIL_MODE: 'sandbox', BOOKIT_TEST_SMTP_PORT: String(smtp.address().port),
    BOOKIT_TEST_EMAIL_ALLOWLIST: 'guest@example.invalid,other@example.invalid,owner@example.invalid,venue@example.invalid',
    BOOKING_BUSINESS_EMAIL: 'venue@example.invalid', BOOKING_EMAIL_FROM: 'Bookit <test@example.invalid>' });
  const log = await fs.open(path.join(dir, 'next.log'), 'a');
  app = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'dev', '-p', String(port), '-H', '127.0.0.1'],
    { env, stdio: ['ignore', 'pipe', 'pipe'] });
  app.stdout.on('data', data => log.write(data)); app.stderr.on('data', data => log.write(data));
  let ready = false;
  for (let i = 0; i < 90; i++) {
    if (app.exitCode !== null) throw new Error('App exited; ' + dir);
    try { if ((await fetch(origin + '/api/courts')).ok) { ready = true; break; } } catch {}
    await delay(1000);
  }
  assert(ready, 'Native app did not start; ' + dir);
  const jwt = await encode({ token: { sub: String(owner), id: String(owner), email: 'owner@example.invalid',
    name: 'Isolated Operator', roles: ['user', 'admin'], activeRole: 'admin', role: 'admin' }, secret });
  const cookie = 'next-auth.session-token=' + jwt;
  const otherJwt = await encode({ token: { sub: String(stranger), id: String(stranger),
    email: 'other@example.invalid', roles: ['user', 'admin'], activeRole: 'admin', role: 'admin' }, secret });
  const createdCourt = await request('/api/courts', { name: 'Native Test Court', price_per_hour: 400,
    amenities: ['Floodlights'], address: 'Isolated fixture only' }, cookie);
  assert.equal(createdCourt.status, 201, JSON.stringify(createdCourt));
  assert.equal(createdCourt.body.price_per_hour, 400);
  const courtId = createdCourt.body._id;
  assert.equal((await request('/api/courts')).body.length, 1);
  pass('Admin Add Court payload persists and is visible in native court inventory');
  const input = { courtId, date: '2030-01-11', start_time: '10:00', duration: 2,
    guestName: 'Native Guest', guestEmail: 'guest@example.invalid', guestPhone: '0712345678' };
  assert.equal((await request('/api/availability?date=2027-02-30')).status, 400);
  assert.equal((await request('/api/bookings/guest', { ...input, date: '2027-02-30' })).status, 400);
  pass('Availability and reservation reject impossible calendar dates');
  const key = { 'idempotency-key': 'native-retry-00000001' };
  const saved = await request('/api/bookings/guest', input, null, 'POST', key);
  assert.equal(saved.status, 201, JSON.stringify(saved));
  const id = saved.body._id, token = saved.body.guestManagementToken;
  assert.deepEqual(saved.body.communicationReceipts.map(row => row.status), ['sent', 'sent']);
  for (const recipient of ['guest@example.invalid', 'venue@example.invalid'])
    assert(inbox.some(mail => mail.recipient === recipient && mail.raw.includes(id)));
  pass('Customer and venue SMTP captures contain the identical saved booking reference');

  assert(token);
  for (const internal of ['guestManagementTokenHash', 'idempotencyKey', 'idempotencyFingerprint']) assert.equal(saved.body[internal], undefined);
  const stored = await db.collection('bookings').findOne({ _id: new ObjectId(id) });
  assert.equal(stored.total_price, 800);
  assert.equal(await db.collection('bookingslotclaims').countDocuments({ booking: stored._id }), 2);
  const operator = await request('/api/admin/bookings', null, cookie);
  assert.equal(operator.status, 200); assert(operator.body.some(row => row._id === id));
  pass('Guest saves native reservation; independent DB, hour ownership and operator records match');
  const replay = await request('/api/bookings/guest', input, null, 'POST', key);
  assert.equal(replay.status, 200, JSON.stringify(replay)); assert.equal(replay.body._id, id);
  for (const field of ['guestEmail', 'guestPhone', 'guestManagementToken', 'guestManagementTokenHash', 'idempotencyKey']) assert.equal(replay.body[field], undefined);
  assert.equal((await request('/api/bookings/guest', { ...input, start_time: '14:00' }, null, 'POST', key)).status, 409);
  const otherIdentity = await request('/api/bookings/guest', { ...input, guestEmail: 'other@example.invalid', start_time: '14:00' }, null, 'POST', key);
  assert.equal(otherIdentity.status, 201, JSON.stringify(otherIdentity)); assert.notEqual(otherIdentity.body._id, id);
  pass('Retry identity and payload are bound; replay exposes no contact or internal token fields');
  const attempts = await Promise.all([
    request('/api/bookings/guest', { ...input, date: '2030-01-12' }),
    request('/api/bookings/guest', { ...input, date: '2030-01-12', start_time: '11:00', duration: 1 }),
  ]);
  assert.deepEqual(attempts.map(r => r.status).sort(), [201, 409], JSON.stringify(attempts));
  assert.equal(await db.collection('bookings').countDocuments({ date: '2030-01-12' }), 1);
  pass('Concurrent overlapping creates commit exactly one booking');
  const headers = { 'x-booking-management-token': token };
  assert.equal((await request('/api/bookings/' + id, null, null, 'GET', headers)).status, 200);
  assert.equal((await request('/api/bookings/' + id, null, null, 'GET', { 'x-booking-management-token': token + 'bad' })).status, 401);
  assert.equal((await request('/api/admin/bookings/' + id, { status: 'confirmed' }, 'next-auth.session-token=' + otherJwt, 'PATCH')).status, 404);
  pass('Guest management requires its token and other arena operators cannot change the booking');
  const timeline = await request('/api/admin/bookings/' + id + '/communications', null, cookie);
  assert.equal(timeline.status, 200); assert.equal(timeline.body.deliveries.length, 2);
  assert(timeline.body.deliveries.every(row => row.status === 'sent'));
  assert.equal((await request('/api/admin/bookings/' + id + '/communications', null, 'next-auth.session-token=' + otherJwt)).status, 404);
  pass('Only the correct arena operator can inspect customer and venue communication receipts');

  const changes = await Promise.all(['14:00', '16:00'].map(start_time => request('/api/bookings/' + id,
    { date: '2030-01-13', start_time, duration: 1 }, null, 'PUT', headers)));
  assert(changes.every(result => [200, 409].includes(result.status)), JSON.stringify(changes));
  assert(changes.some(result => result.status === 200), JSON.stringify(changes));
  const moved = await db.collection('bookings').findOne({ _id: new ObjectId(id) });
  const claims = await db.collection('bookingslotclaims').find({ booking: moved._id }).toArray();
  assert.deepEqual(claims.map(row => row.hour), [moved.start_time]);
  assert(claims.every(row => row.date === moved.date));
  pass('Concurrent edits leave only claims matching the final saved reservation');
  const { default: mongoose } = await import('mongoose');
  helperMongo = mongoose;
  await mongoose.connect(uri);
  const { default: Booking } = await import('../models/Booking.js');
  const { updateReservation } = await import('../lib/bookings/reservationOwnership.js');
  const snapshots = await Promise.all([Booking.findById(id), Booking.findById(id)]);
  const edits = await Promise.allSettled(snapshots.map((booking, index) => updateReservation({ booking,
    changes: { date: '2030-01-14', start_time: index ? '16:00' : '14:00', duration: 1, total_price: 400 } })));
  assert.equal(edits.filter(result => result.status === 'fulfilled').length, 1);
  assert.equal(edits.find(result => result.status === 'rejected').reason.code, 'BOOKING_CHANGED');
  const winner = await db.collection('bookings').findOne({ _id: new ObjectId(id) });
  const owned = await db.collection('bookingslotclaims').find({ booking: winner._id }).toArray();
  assert.deepEqual(owned.map(row => [row.date, row.hour]), [[winner.date, winner.start_time]]);
  Object.assign(moved, winner);
  await mongoose.disconnect();
  pass('Two edits from the same revision accept one winner with no ghost hour claims');

  const paid = await request('/api/admin/bookings/' + id + '/payment', { paymentStatus: 'paid' }, cookie, 'PATCH');
  assert.equal(paid.status, 200, JSON.stringify(paid)); assert.equal(paid.body.booking.paymentStatus, 'paid');
  const cancelled = await request('/api/admin/bookings/' + id, { status: 'cancelled' }, cookie, 'PATCH');
  assert.equal(cancelled.status, 200, JSON.stringify(cancelled));
  const replacement = await request('/api/bookings/guest', { ...input, date: moved.date, start_time: moved.start_time, duration: 1 });
  assert.equal(replacement.status, 201, JSON.stringify(replacement));
  assert.equal((await request('/api/admin/bookings/' + id, { status: 'confirmed' }, cookie, 'PATCH')).status, 409);
  assert.equal((await db.collection('bookings').findOne({ _id: moved._id })).status, 'cancelled');
  assert.equal(await db.collection('bookingslotclaims').countDocuments({ booking: moved._id }), 0);
  pass('Operator payment persists; cancellation releases capacity; conflicting reactivation rolls back');
  await fs.mkdir(path.dirname(output), { recursive: true });
  await fs.writeFile(output, JSON.stringify({ observedAt: new Date().toISOString(), checks,
    environment: 'disposable local MongoDB replica set and real Next HTTP routes', productionWrites: 0,
    limits: ['Local SMTP acceptance only; no external inbox delivery, production inventory, browser visual or production deployment proof'] }, null, 2) + '\n');
  console.log('Receipt: ' + output);
} finally {
  app?.kill('SIGTERM');
  if (app && app.exitCode === null) await Promise.race([new Promise(resolve => app.once('exit', resolve)), delay(3000)]);
  await helperMongo?.disconnect(); await client?.close(); await mongo?.stop(); smtp.close();
}
