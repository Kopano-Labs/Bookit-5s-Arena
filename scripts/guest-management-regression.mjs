import assert from 'node:assert/strict';
import { ObjectId } from 'mongodb';

// Called only by the disposable native regression harness, never a deployed DB.
export async function validateGuestManagement({ browser, request, db, inbox, origin, courtId, cookie, input, pass }) {
  const bookingInput = { ...input, date: '2030-02-01', start_time: '12:00', duration: 1 };
  let context, page, saved;
  const newContext = async () => {
    const result = await browser.newContext({ serviceWorkers: 'block', viewport: { width: 390, height: 844 } });
    await result.addInitScript(() => {
      localStorage.setItem('cookie_consent', 'declined');
      window.bookitTestFetch = window.fetch.bind(window);
    });
    await result.route('**/*', route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
    return result;
  };
  try {
    if (browser) {
      context = await newContext(); page = await context.newPage();
      await page.goto(origin + '/book?courtId=' + courtId);
      await page.getByLabel('Date', { exact: true }).fill(bookingInput.date);
      await page.getByRole('button', { name: '12pm', exact: true }).click();
      await page.getByLabel('Full name', { exact: true }).fill(bookingInput.guestName);
      await page.getByLabel('Email address', { exact: true }).fill(bookingInput.guestEmail);
      await page.getByLabel('Mobile number', { exact: true }).fill(bookingInput.guestPhone);
      await page.evaluate(() => { window.fetch = window.bookitTestFetch; });
      const [response] = await Promise.all([
        page.waitForResponse(r => r.request().method() === 'POST' && new URL(r.url()).pathname === '/api/bookings/guest'),
        page.getByRole('button', { name: /Reserve court/ }).click(),
      ]);
      saved = { status: response.status(), body: await response.json() };
      await page.getByRole('link', { name: 'Manage this reservation' }).waitFor();
    } else saved = await request('/api/bookings/guest', bookingInput);
    assert.equal(saved.status, 201);
    const id = saved.body._id, token = saved.body.guestManagementToken;
    const objectId = new ObjectId(id);
    const privatePath = `/book/manage/${id}#token=${token}`;
    const headers = { 'x-booking-management-token': token };
    const decode = raw => raw.replace(/=\r?\n/g, '').replace(/=([0-9A-F]{2})/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
    const mail = inbox.find(m => m.recipient === 'guest@example.invalid' && m.raw.includes(id));
    assert(mail && decode(mail.raw).includes(origin + privatePath));
    assert(!inbox.filter(m => m.recipient === 'venue@example.invalid').some(m => decode(m.raw).includes(token)));
    assert(!JSON.stringify(await db.collection('bookings').findOne({ _id: objectId })).includes(token));
    assert(!JSON.stringify(await db.collection('bookingdeliveries').find({ booking: objectId }).toArray()).includes(token));
    pass('Private management link appears only in customer SMTP; no bearer token is persisted in booking or delivery records');
    const response = await fetch(origin + '/api/bookings/' + id, { headers });
    assert.equal(response.status, 200); assert.match(response.headers.get('cache-control'), /private.*no-store/);
    const deny = async badHeaders => {
      for (const method of ['GET', 'PUT', 'DELETE'])
        assert.equal((await request('/api/bookings/' + id, method === 'PUT' ? bookingInput : null, null, method, badHeaders)).status, 401);
    };
    await deny({}); await deny({ 'x-booking-management-token': 'wrong-token' });
    // An independently saved guest's valid token must not grant access here.
    const other = await request('/api/bookings/guest', { ...bookingInput, date: '2030-02-03' });
    assert.equal(other.status, 201);
    await deny({ 'x-booking-management-token': other.body.guestManagementToken });
    const stored = await db.collection('bookings').findOne({ _id: objectId });
    await db.collection('bookings').updateOne({ _id: objectId }, { $set: { guestManagementTokenExpiresAt: new Date(0) } });
    await deny(headers);
    await db.collection('bookings').updateOne({ _id: objectId }, { $set: { guestManagementTokenExpiresAt: stored.guestManagementTokenExpiresAt, guestManagementPermissions: ['read'] } });
    assert.equal((await request('/api/bookings/' + id, null, null, 'GET', headers)).status, 200);
    assert.equal((await request('/api/bookings/' + id, bookingInput, null, 'PUT', headers)).status, 401);
    assert.equal((await request('/api/bookings/' + id, null, null, 'DELETE', headers)).status, 401);
    await db.collection('bookings').updateOne({ _id: objectId }, { $set: { guestManagementPermissions: stored.guestManagementPermissions } });
    pass('Missing, incorrect, cross-booking, expired and permission-limited tokens cannot make unauthorized changes');
    if (page) {
      assert.equal(await page.getByRole('link', { name: 'Manage this reservation' }).getAttribute('href'), privatePath);
      await page.getByRole('link', { name: 'Manage this reservation' }).click();
      await page.getByLabel('Saved reservation').waitFor();
      assert.equal(new URL(page.url()).hash, '');
      await page.reload(); await page.getByLabel('Saved reservation').waitFor();
      await context.close(); context = await newContext(); page = await context.newPage();
      const urls = []; page.on('request', r => urls.push(r.url()));
      const emailUrl = decode(mail.raw).match(/href="([^"]*\/book\/manage\/[^\"]+)"/)?.[1];
      assert.equal(emailUrl, origin + privatePath);
      await page.goto(emailUrl); await page.getByLabel('Saved reservation').waitFor();
      assert.equal(new URL(page.url()).hash, '');
      assert(urls.every(url => !url.includes(token)));
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
      pass('Mobile guest opens confirmation, reloads and returns through emailed link in a new browser context without login or token in HTTP URLs');
    }
    const conflict = { date: '2030-02-03', start_time: '12:00', duration: 1 };
    assert.equal((await request('/api/bookings/' + id, conflict, null, 'PUT', headers)).status, 409);
    assert.equal((await db.collection('bookings').findOne({ _id: objectId })).date, bookingInput.date);
    const change = { date: '2030-02-02', start_time: '15:00', duration: 1 };
    if (page) {
      await page.getByLabel('Date', { exact: true }).fill(conflict.date);
      await page.getByRole('button', { name: 'Save changes' }).click();
      await page.getByRole('alert').filter({ hasText: 'already booked' }).waitFor();
      assert((await page.getByLabel('Saved reservation').innerText()).includes(bookingInput.date));
      await page.getByLabel('Date', { exact: true }).fill(change.date);
      await page.getByLabel('Start time', { exact: true }).fill(change.start_time);
      await page.getByRole('button', { name: 'Save changes' }).click();
      await page.getByText('Reservation updated. Your saved details are shown below.').waitFor();
    } else assert.equal((await request('/api/bookings/' + id, change, null, 'PUT', headers)).status, 200);
    const moved = await db.collection('bookings').findOne({ _id: objectId });
    assert.equal(moved.date, change.date); assert.equal(moved.start_time, change.start_time);
    assert((await request('/api/admin/bookings', null, cookie)).body.some(row => row._id === id && row.date === change.date));
    if (page) {
      await page.getByRole('button', { name: 'Cancel reservation', exact: true }).click();
      await page.getByRole('button', { name: 'Confirm cancellation' }).click();
      await page.getByText('Reservation cancelled. Contact the venue about any payment already made.').waitFor();
      assert((await page.getByLabel('Saved reservation').innerText()).includes('cancelled'));
    } else assert.equal((await request('/api/bookings/' + id, null, null, 'DELETE', headers)).status, 200);
    assert.equal((await db.collection('bookings').findOne({ _id: objectId })).status, 'cancelled');
    assert.equal(await db.collection('bookingslotclaims').countDocuments({ booking: objectId }), 0);
    await deny(headers);
    pass('Conflicts preserve saved guest state; rescheduling reaches the operator; cancellation releases claims and revokes all token access');
    return id;
  } finally { await context?.close(); }
}
