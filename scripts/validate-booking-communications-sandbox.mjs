// Real MongoDB + native HTTP routes + local SMTP. No production env file is read here.
import assert from 'node:assert/strict';
import net from 'node:net';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import { MongoMemoryServer } from 'mongodb-memory-server-core';
import { MongoClient, ObjectId } from 'mongodb';
import { encode } from 'next-auth/jwt';

const keep = process.argv.includes('--serve');
const output = path.resolve('docs/hackathon-build/sandbox-communications-receipt.json');
const inbox = [];
const failures = [];
let child, mongo, client;
const smtp = net.createServer(socket => {
  let pending = '', data = false, body = '', recipient = '';
  socket.setEncoding('utf8'); socket.write('220 bookit-sandbox ESMTP\r\n');
  socket.on('data', chunk => {
    pending += chunk;
    while (pending.includes('\r\n')) {
      const end = pending.indexOf('\r\n'); const line = pending.slice(0, end); pending = pending.slice(end + 2);
      if (data) {
        if (line === '.') { inbox.push({ recipient, raw: body }); data = false; body = ''; socket.write('250 Captured locally\r\n'); }
        else body += `${line}\r\n`;
      } else if (/^(EHLO|HELO)/i.test(line)) socket.write('250 bookit-sandbox\r\n');
      else if (/^RCPT TO:/i.test(line)) { recipient = line.match(/<([^>]+)>/)?.[1] || ''; socket.write('250 OK\r\n'); }
      else if (/^DATA$/i.test(line)) { data = true; socket.write('354 End with dot\r\n'); }
      else if (/^QUIT$/i.test(line)) { socket.end('221 Bye\r\n'); }
      else socket.write('250 OK\r\n');
    }
  });
  socket.on('error', () => {});
});
await new Promise(resolve => smtp.listen(0, '127.0.0.1', resolve));
const workDir = await fs.mkdtemp(path.join(os.tmpdir(), 'bookit-isolated-'));
const port = 3107;
const base = `http://127.0.0.1:${port}`;
const secret = 'isolated-bookit-integration-only-not-production';
const decode = raw => raw.replace(/=\r\n/g, '').replace(/=([0-9a-f]{2})/ig, (_, n) => String.fromCharCode(parseInt(n, 16)));
const checks = [];
function pass(name) { checks.push(name); console.log(`PASS ${name}`); }
async function request(url, body, cookie) {
  const response = await fetch(`${base}${url}`, { method: body ? 'POST' : 'GET',
    headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '127.0.0.1', ...(cookie ? { cookie } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}) });
  return { status: response.status, body: await response.json() };
}
let appEnv;
async function startApp() {
  child = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'dev', '-p', String(port), '-H', '127.0.0.1'],
    { cwd: process.cwd(), env: appEnv, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
  const log = await fs.open(path.join(workDir, 'next.log'), 'a');
  child.stdout.on('data', b => log.write(b)); child.stderr.on('data', b => log.write(b));
  child.on('exit', () => log.close());
  for (let i = 0; i < 180; i++) {
    if (child.exitCode !== null) throw new Error(`Sandbox app exited; log at ${workDir}`);
    try { if ((await fetch(`${base}/api/courts`)).ok) return; } catch {}
    await delay(1000);
  }
  throw new Error(`Sandbox app did not start; log at ${workDir}`);
}
async function stopApp() {
  if (!child || child.exitCode !== null) return;
  // Terminate only this owned child and its Next worker tree on Windows.
  if (process.platform === 'win32') {
    const killer = spawn('taskkill', ['/PID', String(child.pid), '/T', '/F'], { windowsHide: true, stdio: 'ignore' });
    await new Promise(resolve => killer.on('exit', resolve));
  } else child.kill('SIGTERM');
  await delay(500);
}
try {
  mongo = await MongoMemoryServer.create({ instance: { dbPath: workDir, dbName: 'bookit_isolated', storageEngine: 'wiredTiger' } });
  const uri = mongo.getUri('bookit_isolated');
  assert.match(uri, /^mongodb:\/\/127\.0\.0\.1:/);
  client = await new MongoClient(uri).connect();
  const db = client.db();
  const owner = new ObjectId(), court = new ObjectId();
  await db.collection('users').insertOne({ _id: owner, name: 'Sandbox Operator', email: 'operator@example.invalid', roles: ['user', 'admin'] });
  await db.collection('courts').insertOne({ _id: court, owner, name: 'Sandbox Court', price_per_hour: 400,
    image: 'court-1.jpg', sortOrder: 1, address: 'Synthetic sandbox fixture', createdAt: new Date() });
  appEnv = { ...process.env };
  for (const key of Object.keys(appEnv)) if (/^(RESEND|GMAIL|GOOGLE|FACEBOOK|WHATSAPP|SMS_|PAYSTACK|STRIPE)/.test(key)) appEnv[key] = '';
  Object.assign(appEnv, { MONGODB_URI: uri, MONGODB_DIRECT_URI: uri, MONGODB_URI_DIRECT: uri, DATABASE_URL: uri,
    NEXTAUTH_URL: base, NEXTAUTH_SECRET: secret, AUTH_SECRET: secret,
    BOOKIT_SANDBOX: 'true', BOOKIT_EMAIL_MODE: 'sandbox', BOOKIT_TEST_SMTP_PORT: String(smtp.address().port),
    BOOKIT_TEST_EMAIL_ALLOWLIST: 'customer@example.invalid,venue@example.invalid,account@example.invalid,social@example.invalid',
    BOOKING_BUSINESS_EMAIL: 'venue@example.invalid', BOOKING_EMAIL_FROM: 'Bookit <sandbox@example.invalid>',
    BOOKING_COMMUNICATIONS_ENABLED: 'false', NEXT_TELEMETRY_DISABLED: '1' });
  // Direct helper tests use identical sandbox settings, never the project's .env.local.
  Object.assign(process.env, appEnv);
  await startApp();
  const input = { courtId: String(court), date: '2030-01-11', start_time: '18:00', duration: 2,
    guestName: 'Sandbox Player', guestEmail: 'customer@example.invalid', guestPhone: '0712345678' };
  const booked = await request('/api/bookings/guest', input);
  assert.equal(booked.status, 201, JSON.stringify(booked));
  assert.equal(booked.body.total_price, 800);
  assert.deepEqual(booked.body.communicationReceipts.map(r => r.status), ['sent', 'sent']);
  const bookingId = booked.body._id;
  const fresh = await new MongoClient(uri).connect();
  const saved = await fresh.db().collection('bookings').findOne({ _id: new ObjectId(bookingId) });
  assert.equal(saved.guestEmail, input.guestEmail); assert.equal(saved.total_price, 800);
  await fresh.close(); pass('native guest HTTP save and independent MongoDB read match');
  assert.equal(inbox.length, 2);
  assert.deepEqual(inbox.map(m => m.recipient).sort(), ['customer@example.invalid', 'venue@example.invalid']);
  assert(inbox.every(m => decode(m.raw).includes(bookingId)));
  assert(inbox.every(m => !decode(m.raw).includes('Amount Paid')));
  assert(decode(inbox.find(m => m.recipient.startsWith('venue')).raw).includes(input.guestEmail));
  pass('customer and venue inboxes receive the same saved reference and truthful payment state');
  const availability = await request(`/api/availability?date=${input.date}&courtId=${court}`);
  assert(!availability.body.courts[0].slots.some(s => s.start_time === '18:00'));
  pass('public availability reflects saved reservation');
  const jwt = await encode({ secret, token: { id: String(owner), email: 'operator@example.invalid',
    name: 'Sandbox Operator', roles: ['user', 'admin'], activeRole: 'admin', role: 'admin', picture: '/sandbox-avatar' } });
  const dashboard = await request('/api/admin/bookings', null, `next-auth.session-token=${jwt}`);
  assert.equal(dashboard.status, 200, JSON.stringify(dashboard));
  assert(dashboard.body.some(b => b._id === bookingId));
  assert.equal((await request('/api/admin/bookings')).status, 401);
  pass('authorized operator API sees same booking; anonymous access rejected');
  const signup = await request('/api/auth/register', { name: 'Sandbox Account', email: 'account@example.invalid', password: 'sandbox-only-Password123' });
  assert.equal(signup.status, 201, JSON.stringify(signup));
  assert.equal(inbox.filter(m => m.recipient === 'account@example.invalid').length, 1);
  pass('native credentials signup persists and sends one welcome');
  const { default: mongoose } = await import('mongoose');
  await mongoose.connect(uri);
  const { dispatchBookingCommunications } = await import('../lib/bookings/dispatchBookingCommunications.js');
  const args = { booking: saved, court: { name: 'Sandbox Court' }, customerName: input.guestName,
    customerEmail: input.guestEmail, customerPhone: input.guestPhone };
  await Promise.all([dispatchBookingCommunications(args), dispatchBookingCommunications(args)]);
  assert.equal(inbox.filter(m => m.recipient === input.guestEmail).length, 1);
  pass('parallel retries suppress duplicate customer and venue messages');
  const { authOptions } = await import('../lib/authOptions.js');
  const social = { token: { email: 'social@example.invalid', name: 'Sandbox Social', picture: '/sandbox-avatar' },
    account: { provider: 'google' } };
  await authOptions.callbacks.jwt(social); await authOptions.callbacks.jwt(social);
  assert.equal(inbox.filter(m => m.recipient === 'social@example.invalid').length, 1);
  pass('first social signup welcomes once; later sign-in does not');
  const { runDurableDelivery } = await import('../lib/messaging/durableDelivery.js');
  const { default: BookingDelivery } = await import('../models/BookingDelivery.js');
  const key = { booking: new ObjectId(), revision: 1, recipientType: 'user', channel: 'email', purpose: 'reservation_receipt' };
  await runDurableDelivery({ Model: BookingDelivery, key, recipientAddress: input.guestEmail,
    send: async () => ({ success: false, reason: 'Explicit sandbox rejection' }) });
  const recovered = await runDurableDelivery({ Model: BookingDelivery, key, recipientAddress: input.guestEmail,
    send: async () => ({ success: true, provider: 'test-provider', providerMessageId: 'local-only' }) });
  assert.equal(recovered.status, 'sent'); assert.equal((await BookingDelivery.findOne(key)).attempts, 2);
  const unknownKey = { ...key, booking: new ObjectId() };
  await runDurableDelivery({ Model: BookingDelivery, key: unknownKey, recipientAddress: input.guestEmail,
    send: async () => ({ uncertain: true }) });
  const held = await runDurableDelivery({ Model: BookingDelivery, key: unknownKey, recipientAddress: input.guestEmail,
    send: async () => { throw new Error('Must not blindly retry'); } });
  assert.equal(held.status, 'unknown'); assert.equal((await BookingDelivery.findOne(unknownKey)).attempts, 1);
  assert.equal(await db.collection('bookings').countDocuments(), 1);
  pass('explicit rejection can retry; ambiguous outcome is held; no duplicate booking');
  const simulated = await runDurableDelivery({ Model: BookingDelivery, key: { ...key, booking: new ObjectId() },
    recipientAddress: input.guestEmail, send: async () => ({ success: true, mode: 'simulation' }) });
  assert.equal(simulated.status, 'skipped');
  const { sendTransactionalEmail } = await import('../lib/messaging/transactionalEmail.js');
  const blocked = await sendTransactionalEmail({ to: 'outside@example.invalid', subject: 'Blocked', html: 'Blocked' });
  assert.equal(blocked.skipped, true);
  pass('simulation and destinations outside sandbox allowlist cannot pass delivery');
  await mongoose.disconnect();
  await stopApp();
  await client.close();
  const dbPort = mongo.instanceInfo.port;
  await mongo.stop({ doCleanup: false });
  mongo = await MongoMemoryServer.create({ instance: { dbPath: workDir, port: dbPort, dbName: 'bookit_isolated', storageEngine: 'wiredTiger' } });
  client = await new MongoClient(uri).connect();
  assert(await client.db().collection('bookings').findOne({ _id: new ObjectId(bookingId) }));
  await startApp();
  const afterRestart = await request('/api/admin/bookings', null, `next-auth.session-token=${jwt}`);
  assert.equal(afterRestart.status, 200); assert(afterRestart.body.some(b => b._id === bookingId));
  pass('MongoDB process + Next restart retain booking and operator readback');
  await fs.writeFile(output, JSON.stringify({ observedAt: new Date().toISOString(), environment: 'isolated loopback MongoDB and SMTP',
    bookingReference: bookingId, checks, localInboxMessages: inbox.length, productionWrites: 0,
    limits: ['Local SMTP acceptance and captured inbox only; no external provider/inbox validation',
      'Operator API verified; dashboard UI visual walkthrough pending', 'No overlap/idempotent-booking/lifecycle repair claim',
      'No production inventory, cutover, deployment or human visual acceptance'] }, null, 2) + '\n');
  console.log(`Receipt: ${output}`);
  if (keep) { console.log(`SANDBOX_READY ${base}/book`); await new Promise(resolve => process.once('SIGINT', resolve)); }
} catch (error) { failures.push(error.message); console.error(error); process.exitCode = 1; }
finally { await stopApp(); await client?.close(); await mongo?.stop(); smtp.close(); }
