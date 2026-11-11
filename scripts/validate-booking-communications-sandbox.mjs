// Real MongoDB + native HTTP routes + local SMTP. No production env file is read here.
import assert from 'node:assert/strict';
import net from 'node:net';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import { MongoMemoryReplSet } from 'mongodb-memory-server-core';
import { MongoClient, ObjectId } from 'mongodb';
import { encode } from 'next-auth/jwt';
import { chromium } from 'playwright';

const keep = process.argv.includes('--serve');
const output = path.resolve(process.env.BOOKIT_SANDBOX_RECEIPT_PATH || path.join(os.homedir(), '.codex', 'artifacts', 'bookit-platform-sandbox-receipt.json'));
const inbox = [];
const failures = [];
let child, mongo, client, mongooseRuntime, browser;
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
let port;
let base;
const secret = 'isolated-bookit-integration-only-not-production';
const decode = raw => raw.replace(/=\r\n/g, '').replace(/=([0-9a-f]{2})/ig, (_, n) => String.fromCharCode(parseInt(n, 16)));
const checks = [];
function pass(name) { checks.push(name); console.log(`PASS ${name}`); }
async function request(url, body, cookie, method = body ? 'POST' : 'GET', headers = {}) {
  const response = await fetch(`${base}${url}`, { method,
    headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '127.0.0.1', ...(cookie ? { cookie } : {}), ...headers },
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
async function findAvailablePort() {
  const probe = net.createServer();
  await new Promise((resolve, reject) => {
    probe.once('error', reject);
    probe.listen(0, '127.0.0.1', resolve);
  });
  const { port: selectedPort } = probe.address();
  await new Promise((resolve) => probe.close(resolve));
  return selectedPort;
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
  port = await findAvailablePort();
  base = `http://127.0.0.1:${port}`;
  mongo = await MongoMemoryReplSet.create({ instanceOpts: [{ dbPath: workDir }], replSet: { count: 1, storageEngine: 'wiredTiger' } });
  const uri = mongo.getUri('bookit_isolated');
  assert.match(uri, /^mongodb:\/\/127\.0\.0\.1:/);
  client = await new MongoClient(uri).connect();
  const db = client.db();
  const owner = new ObjectId(), otherOwner = new ObjectId(), court = new ObjectId();
  await db.collection('users').insertOne({ _id: owner, name: 'Sandbox Operator', email: 'operator@example.invalid', roles: ['user', 'admin'] });
  await db.collection('users').insertOne({ _id: otherOwner, name: 'Other Arena Operator', email: 'other-operator@example.invalid', roles: ['user', 'admin'] });
  const courts = [
    { _id: court, owner, name: 'Sandbox Court 1', sortOrder: 1 },
    { _id: new ObjectId(), owner, name: 'Sandbox Court 2', sortOrder: 2 },
    { _id: new ObjectId(), owner, name: 'Sandbox Court 3', sortOrder: 3 },
    { _id: new ObjectId(), owner, name: 'Sandbox Court 4', sortOrder: 4 },
  ];
  await db.collection('courts').insertMany(courts.map((item) => ({ ...item, price_per_hour: 400,
    image: 'court-1.jpg', address: 'Synthetic sandbox fixture', createdAt: new Date() })));
  appEnv = { ...process.env };
  for (const key of Object.keys(appEnv)) if (/^(RESEND|GMAIL|GOOGLE|FACEBOOK|WHATSAPP|SMS_|PAYSTACK|STRIPE)/.test(key)) appEnv[key] = '';
  Object.assign(appEnv, { MONGODB_URI: uri, MONGODB_DIRECT_URI: uri, MONGODB_URI_DIRECT: uri, DATABASE_URL: uri,
    NEXTAUTH_URL: base, NEXTAUTH_SECRET: secret, AUTH_SECRET: secret,
    BOOKIT_SANDBOX: 'true', BOOKIT_EMAIL_MODE: 'sandbox', BOOKIT_TEST_SMTP_PORT: String(smtp.address().port),
    BOOKIT_TEST_EMAIL_ALLOWLIST: 'customer@example.invalid,venue@example.invalid,account@example.invalid,social@example.invalid,browser@example.invalid',
    BOOKING_BUSINESS_EMAIL: 'venue@example.invalid', BOOKING_EMAIL_FROM: 'Bookit <sandbox@example.invalid>',
    BOOKING_COMMUNICATIONS_ENABLED: 'false', NEXT_TELEMETRY_DISABLED: '1' });
  // Direct helper tests use identical sandbox settings, never the project's .env.local.
  Object.assign(process.env, appEnv);
  await startApp();
  await fs.mkdir(path.dirname(output), { recursive: true });
  browser = await chromium.launch({ headless: true });
  const publicPage = await browser.newPage();
  const customerDiagnostics = [];
  publicPage.on('pageerror', (error) => customerDiagnostics.push(`PAGEERROR ${error.message}`));
  publicPage.on('console', (message) => { if (message.type() === 'error') customerDiagnostics.push(`CONSOLE ${message.text()}`); });
  await publicPage.goto(`${base}/book`, { waitUntil: 'domcontentloaded', timeout: 90_000 });
  assert.equal(await publicPage.getByRole('button', { name: /Sandbox Court/i }).count(), 4);
  await publicPage.getByRole('button', { name: /Sandbox Court 2/i }).click();
  await publicPage.locator('#booking-date').fill('2030-01-12');
  const selectedTime = publicPage.getByRole('button', { name: '3pm', exact: true });
  await selectedTime.waitFor({ state: 'visible', timeout: 30_000 });
  await selectedTime.click();
  assert.equal(await selectedTime.getAttribute('aria-pressed'), 'true', 'the chosen time must be selected');
  await publicPage.locator('#guest-name').fill('Browser Player');
  await publicPage.locator('#guest-email').fill('browser@example.invalid');
  await publicPage.locator('#guest-phone').fill('0712345678');
  const reserveButton = publicPage.getByRole('button', { name: /Reserve court/i });
  assert.equal(await reserveButton.isEnabled(), true, `reserve button disabled; formValid=${await reserveButton.evaluate((button) => button.form?.checkValidity())}; courtSelected=${await publicPage.getByRole('button', { name: /Sandbox Court 2/i }).getAttribute('aria-pressed')}; timeSelected=${await selectedTime.getAttribute('aria-pressed')}; diagnostics=${customerDiagnostics.join(' | ')}`);
  const customerBookingResponse = publicPage.waitForResponse((response) => response.url().includes('/api/bookings/guest') && response.request().method() === 'POST', { timeout: 30_000 });
  await reserveButton.click();
  const customerBookingResult = await customerBookingResponse.catch((error) => { throw new Error(`${error.message}; diagnostics: ${customerDiagnostics.join(' | ')}`); });
  assert.equal(customerBookingResult.status(), 201, `customer form response ${customerBookingResult.status()}; ${await customerBookingResult.text()}; diagnostics: ${customerDiagnostics.join(' | ')}`);
  await publicPage.getByRole('heading', { name: 'Reservation saved' }).waitFor();
  pass('native customer page renders four synthetic courts and saves a guest reservation');
  const input = { courtId: String(court), date: '2030-01-11', start_time: '18:00', duration: 2,
    guestName: 'Sandbox Player', guestEmail: 'customer@example.invalid', guestPhone: '0712345678' };
  const booked = await request('/api/bookings/guest', input);
  assert.equal(booked.status, 201, JSON.stringify(booked));
  assert.equal(booked.body.total_price, 800);
  assert.deepEqual(booked.body.communicationReceipts.map(r => r.status), ['sent', 'sent']);
  const bookingId = booked.body._id;
  assert.match(booked.body.guestManagementToken, /^[A-Za-z0-9_-]{40,}$/);
  const managed = await request(`/api/bookings/${bookingId}`, null, null, 'GET', { 'x-booking-management-token': booked.body.guestManagementToken });
  assert.equal(managed.status, 200);
  assert.equal(managed.body.guestManagementTokenHash, undefined);
  assert.equal((await request(`/api/bookings/${bookingId}`, null, null, 'GET', { 'x-booking-management-token': `${booked.body.guestManagementToken}wrong` })).status, 401);
  const customerBookingRecord = await db.collection('bookings').findOne({ guestEmail: 'browser@example.invalid' });
  assert(customerBookingRecord);
  assert.equal((await request(`/api/bookings/${customerBookingRecord._id}`, null, null, 'GET', { 'x-booking-management-token': booked.body.guestManagementToken })).status, 401);
  const concurrentInput = { courtId: String(court), date: '2030-01-13', start_time: '10:00', duration: 2,
    guestName: 'Concurrent Player', guestEmail: 'customer@example.invalid', guestPhone: '0712345678' };
  const [firstConflict, secondConflict] = await Promise.all([
    request('/api/bookings/guest', concurrentInput, null, 'POST', { 'x-forwarded-for': '127.0.0.2' }),
    request('/api/bookings/guest', { ...concurrentInput, start_time: '11:00', duration: 1 }, null, 'POST', { 'x-forwarded-for': '127.0.0.3' }),
  ]);
  assert.deepEqual([firstConflict.status, secondConflict.status].sort(), [201, 409]);
  const idempotentInput = { courtId: String(court), date: '2030-01-14', start_time: '10:00', duration: 1,
    guestName: 'Retry Player', guestEmail: 'customer@example.invalid', guestPhone: '0712345678' };
  const retryKey = 'sandbox-retry-key-0001';
  const initialRetry = await request('/api/bookings/guest', idempotentInput, null, 'POST', { 'x-forwarded-for': '127.0.0.4', 'idempotency-key': retryKey });
  const replayRetry = await request('/api/bookings/guest', idempotentInput, null, 'POST', { 'x-forwarded-for': '127.0.0.4', 'idempotency-key': retryKey });
  assert.equal(initialRetry.status, 201); assert.equal(replayRetry.status, 200); assert.equal(replayRetry.body._id, initialRetry.body._id);
  const retryToken = initialRetry.body.guestManagementToken;
  const rescheduled = await request(`/api/bookings/${initialRetry.body._id}`, { date: '2030-01-15', start_time: '11:00', duration: 1 }, null, 'PUT', { 'x-booking-management-token': retryToken });
  assert.equal(rescheduled.status, 200, JSON.stringify(rescheduled));
  assert.equal(rescheduled.body.date, '2030-01-15'); assert.equal(rescheduled.body.guestManagementTokenHash, undefined);
  const oldSlot = await request(`/api/availability?date=2030-01-14&courtId=${court}`);
  const newSlot = await request(`/api/availability?date=2030-01-15&courtId=${court}`);
  assert(oldSlot.body.courts[0].slots.some((slot) => slot.start_time === '10:00' && slot.availableDurations.includes(1)));
  assert(!newSlot.body.courts[0].slots.some((slot) => slot.start_time === '11:00'));
  const cancelled = await request(`/api/bookings/${initialRetry.body._id}`, null, null, 'DELETE', { 'x-booking-management-token': initialRetry.body.guestManagementToken });
  assert.equal(cancelled.status, 200);
  assert.equal((await request(`/api/bookings/${initialRetry.body._id}`, null, null, 'GET', { 'x-booking-management-token': retryToken })).status, 401);
  const reused = await request('/api/bookings/guest', { ...idempotentInput, date: '2030-01-15', start_time: '11:00' }, null, 'POST', { 'x-forwarded-for': '127.0.0.5', 'idempotency-key': 'sandbox-retry-key-0002' });
  assert.equal(reused.status, 201);
  pass('overlap claims reject a competing interval; retry keys replay once; cancelled capacity is reusable');
  const fresh = await new MongoClient(uri).connect();
  const saved = await fresh.db().collection('bookings').findOne({ _id: new ObjectId(bookingId) });
  assert.equal(saved.guestEmail, input.guestEmail); assert.equal(saved.total_price, 800);
  assert.equal(saved.guestManagementToken, undefined); assert.match(saved.guestManagementTokenHash, /^[a-f0-9]{64}$/);
  await fresh.close(); pass('native guest HTTP save and independent MongoDB read match');
  const initialMessages = inbox.filter((message) => decode(message.raw).includes(bookingId));
  assert.equal(initialMessages.length, 2);
  assert.deepEqual(initialMessages.map(m => m.recipient).sort(), ['customer@example.invalid', 'venue@example.invalid']);
  assert(initialMessages.every(m => !decode(m.raw).includes('Amount Paid')));
  assert(decode(initialMessages.find(m => m.recipient.startsWith('venue')).raw).includes(input.guestEmail));
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
  const otherJwt = await encode({ secret, token: { id: String(otherOwner), email: 'other-operator@example.invalid',
    name: 'Other Arena Operator', roles: ['user', 'admin'], activeRole: 'admin', role: 'admin' } });
  const otherArenaRead = await request(`/api/admin/bookings?court=${court}`, null, `next-auth.session-token=${otherJwt}`);
  assert.equal(otherArenaRead.status, 200); assert.equal(otherArenaRead.body.length, 0);
  pass('another arena admin cannot read this arena reservation');
  const adminContext = await browser.newContext();
  await adminContext.addCookies([{ name: 'next-auth.session-token', value: jwt, url: base, sameSite: 'Lax' }]);
  const adminPage = await adminContext.newPage();
  const adminRequests = [];
  adminPage.on('request', (request) => { if (request.url().includes('/api/admin/bookings')) adminRequests.push(`${request.method()} ${request.url()}`); });
  adminPage.on('pageerror', (error) => adminRequests.push(`PAGEERROR ${error.message}`));
  await adminPage.goto(`${base}/admin/bookings`, { waitUntil: 'domcontentloaded', timeout: 90_000 });
  await adminPage.getByRole('heading', { name: 'Manage bookings' }).waitFor();
  const browserSession = await adminPage.evaluate(() => fetch('/api/auth/session').then((response) => response.json()));
  assert.equal(browserSession?.user?.email, 'operator@example.invalid', `Admin browser session missing; cookies=${(await adminContext.cookies(base)).map((cookie) => cookie.name).join(',')}`);
  await adminPage.getByText('Sandbox Player').waitFor({ timeout: 45_000 }).catch((error) => {
    throw new Error(`${error.message}; Admin session=${JSON.stringify({ email: browserSession?.user?.email, role: browserSession?.user?.role })}; Admin requests: ${adminRequests.join(' | ')}`);
  });
  const sandboxPlayerRow = adminPage.locator('tbody tr').filter({ hasText: 'Sandbox Player' });
  assert.equal(await sandboxPlayerRow.count(), 1, 'Admin dashboard must show exactly one synthetic customer row');
  await Promise.all([
    adminPage.waitForResponse((response) => /\/api\/admin\/bookings\/[a-f0-9]+$/.test(new URL(response.url()).pathname) && response.request().method() === 'PATCH'),
    sandboxPlayerRow.locator('select').selectOption('confirmed'),
  ]);
  const markPaidButton = sandboxPlayerRow.getByRole('button', { name: 'Mark Paid' });
  await markPaidButton.waitFor({ state: 'visible', timeout: 30_000 });
  for (let attempt = 0; attempt < 30 && !(await markPaidButton.isEnabled()); attempt++) await delay(250);
  assert.equal(await markPaidButton.isEnabled(), true, `Mark Paid remained disabled; Admin requests: ${adminRequests.join(' | ')}`);
  const paymentResponse = adminPage.waitForResponse((response) => new URL(response.url()).pathname.endsWith('/payment') && response.request().method() === 'PATCH', { timeout: 45_000 })
    .then((response) => ({ response }), (error) => ({ error }));
  await markPaidButton.click();
  const paymentResult = await paymentResponse;
  if (paymentResult.error) {
    await adminPage.screenshot({ path: path.join(workDir, 'admin-payment-failure.png'), fullPage: true }).catch(() => {});
    throw new Error(`${paymentResult.error.message}; Admin requests: ${adminRequests.join(' | ')}`);
  }
  assert.equal((await db.collection('bookings').findOne({ _id: new ObjectId(bookingId) })).status, 'confirmed');
  assert.equal((await db.collection('bookings').findOne({ _id: new ObjectId(bookingId) })).paymentStatus, 'paid');
  assert.equal((await db.collection('bookingdeliveries').countDocuments({ booking: new ObjectId(bookingId), revision: { $gte: 2 } })), 4);
  await adminContext.close(); await browser.close(); browser = undefined;
  pass('existing Admin page confirms and marks payment while writing revision receipts');
  const signup = await request('/api/auth/register', { name: 'Sandbox Account', email: 'account@example.invalid', password: 'sandbox-only-Password123' });
  assert.equal(signup.status, 201, JSON.stringify(signup));
  assert.equal(inbox.filter(m => m.recipient === 'account@example.invalid').length, 1);
  pass('native credentials signup persists and sends one welcome');
  const { default: mongoose } = await import('mongoose');
  mongooseRuntime = mongoose;
  await mongoose.connect(uri);
  const { dispatchBookingCommunications } = await import('../lib/bookings/dispatchBookingCommunications.js');
  const args = { booking: saved, court: { name: 'Sandbox Court' }, customerName: input.guestName,
    customerEmail: input.guestEmail, customerPhone: input.guestPhone };
  const messageCount = (recipient) => inbox.filter((message) => message.recipient === recipient && decode(message.raw).includes(bookingId)).length;
  const beforeDuplicateDispatch = { customer: messageCount(input.guestEmail), venue: messageCount('venue@example.invalid') };
  await Promise.all([dispatchBookingCommunications(args), dispatchBookingCommunications(args)]);
  assert.deepEqual({ customer: messageCount(input.guestEmail), venue: messageCount('venue@example.invalid') }, beforeDuplicateDispatch);
  assert.equal(await db.collection('bookingdeliveries').countDocuments({ booking: saved._id, revision: 1, purpose: 'reservation_receipt' }), 2);
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
  const bookingCountBeforeDeliveryRetries = await db.collection('bookings').countDocuments();
  pass('explicit rejection can retry; ambiguous outcome is held; no duplicate booking');
  const simulated = await runDurableDelivery({ Model: BookingDelivery, key: { ...key, booking: new ObjectId() },
    recipientAddress: input.guestEmail, send: async () => ({ success: true, mode: 'simulation' }) });
  assert.equal(simulated.status, 'skipped');
  const { sendTransactionalEmail } = await import('../lib/messaging/transactionalEmail.js');
  const blocked = await sendTransactionalEmail({ to: 'outside@example.invalid', subject: 'Blocked', html: 'Blocked' });
  assert.equal(blocked.skipped, true);
  assert.equal(await db.collection('bookings').countDocuments(), bookingCountBeforeDeliveryRetries);
  pass('simulation and destinations outside sandbox allowlist cannot pass delivery');
  await mongoose.disconnect();
  await stopApp();
  await client.close();
  const dbPort = mongo.servers[0].instanceInfo.port;
  await mongo.stop({ doCleanup: false });
  mongo = await MongoMemoryReplSet.create({ instanceOpts: [{ dbPath: workDir, port: dbPort }], replSet: { count: 1, storageEngine: 'wiredTiger' } });
  client = await new MongoClient(uri).connect();
  assert(await client.db().collection('bookings').findOne({ _id: new ObjectId(bookingId) }));
  await startApp();
  const afterRestart = await request('/api/admin/bookings', null, `next-auth.session-token=${jwt}`);
  assert.equal(afterRestart.status, 200); assert(afterRestart.body.some(b => b._id === bookingId));
  pass('MongoDB process + Next restart retain booking and operator readback');
  await fs.writeFile(output, JSON.stringify({ observedAt: new Date().toISOString(), environment: 'isolated loopback MongoDB and SMTP',
    bookingReference: bookingId, checks, localInboxMessages: inbox.length, productionWrites: 0,
    limits: ['Local SMTP acceptance and captured inbox only; no external provider/inbox validation',
      'Automated browser exercised the existing Admin page; human visual acceptance remains pending',
      'Guest management-token self-service is API-only and is not yet integrated into customer UI or email links',
      'No production inventory reconciliation, Setmore/manual reservation import, cutover, deployment or human production acceptance'] }, null, 2) + '\n');
  console.log(`Receipt: ${output}`);
  if (keep) { console.log(`SANDBOX_READY ${base}/book`); await new Promise(resolve => process.once('SIGINT', resolve)); }
} catch (error) { failures.push(error.message); console.error(error); process.exitCode = 1; }
finally { await browser?.close().catch(() => {}); await stopApp(); await mongooseRuntime?.disconnect(); await client?.close(); await mongo?.stop(); smtp.close(); }
