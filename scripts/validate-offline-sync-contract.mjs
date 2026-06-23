#!/usr/bin/env node

const baseUrl = process.env.BOOKIT_SYNC_BASE_URL || 'http://localhost:3002';
const endpoint = new URL('/api/v1/sync', baseUrl);
const allowStoreUnavailable = process.env.BOOKIT_SYNC_ALLOW_STORE_UNAVAILABLE === 'true';
const runId =
  process.env.BOOKIT_SYNC_RUN_ID ||
  new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);

const acceptedEventTypes = [
  'booking',
  'payment',
  'check-in',
  'broadcast',
  'testimony',
  'admin-audit',
];

const cleanupKeys = new Set();
const failures = [];
const storeUnavailableCases = [];

function safeJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function keyFor(eventType, suffix) {
  return `${eventType}:validate-${runId}-${suffix}`;
}

function payloadFor(eventType, suffix) {
  const base = {
    source: 'bookit-offline-sync-validator',
    dryRun: true,
    moneyMovement: false,
    runId,
    suffix,
  };

  if (eventType === 'booking') {
    return {
      ...base,
      courtId: 'dry-run-court',
      date: '2026-05-14',
      start_time: '10:00',
      duration: 1,
      total_price: 0,
    };
  }

  if (eventType === 'payment') {
    return {
      ...base,
      bookingRef: 'dry-run-booking',
      paymentStatus: 'paid',
      amount: 0,
      currency: 'ZAR',
    };
  }

  if (eventType === 'check-in') {
    return {
      ...base,
      bookingRef: 'dry-run-booking',
      status: 'confirmed',
      checkedInBy: 'contract-validator',
    };
  }

  if (eventType === 'broadcast') {
    return {
      ...base,
      channel: 'dry-run',
      message: 'offline sync validator broadcast',
    };
  }

  if (eventType === 'testimony') {
    return {
      ...base,
      testimonyId: 'dry-run-testimony',
      rating: 5,
    };
  }

  return {
    ...base,
    action: 'contract-validator',
  };
}

async function requestCase(label, expectedStatus, init = {}) {
  const response = await fetch(endpoint, init);
  const text = await response.text();
  const body = safeJson(text);
  const expectedStatuses = Array.isArray(expectedStatus) ? expectedStatus : [expectedStatus];
  const pass = expectedStatuses.includes(response.status);
  const storeBlocked = allowStoreUnavailable && response.status === 503;

  console.log(`${pass ? (storeBlocked ? 'BLOCKED' : 'PASS') : 'FAIL'} ${label} ${response.status}`);
  if (body) {
    console.log(typeof body === 'string' ? body : JSON.stringify(body));
  }

  if (storeBlocked) {
    storeUnavailableCases.push(label);
  }

  if (!pass) {
    failures.push(`${label}: expected ${expectedStatuses.join(' or ')}, received ${response.status}`);
  }

  return { response, body };
}

function durableStatus(status) {
  return allowStoreUnavailable ? [status, 503] : status;
}

async function postCase(label, expectedStatus, { eventType, payload, idempotencyKey, body }) {
  const result = await requestCase(label, expectedStatus, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(idempotencyKey ? { 'X-Idempotency-Key': idempotencyKey } : {}),
    },
    body: JSON.stringify(body || { event_type: eventType, payload }),
  });

  if (idempotencyKey && [200, 202].includes(result.response.status)) {
    cleanupKeys.add(idempotencyKey);
  }

  return result;
}

async function cleanupLocalRows() {
  if (!['localhost', '127.0.0.1'].includes(endpoint.hostname)) {
    console.log('SKIP cleanup: target is not localhost.');
    return;
  }

  if (cleanupKeys.size === 0) {
    return;
  }

  try {
    const [{ default: connectDB }, { default: OfflineSyncEvent }] = await Promise.all([
      import('../lib/mongodb.js'),
      import('../models/OfflineSyncEvent.js'),
    ]);
    await connectDB();
    const result = await OfflineSyncEvent.deleteMany({
      idempotencyKey: { $in: Array.from(cleanupKeys) },
    });
    console.log(`CLEANUP deleted ${result.deletedCount}/${cleanupKeys.size} local rows`);
  } catch (error) {
    const message = error?.message || String(error);
    if (process.env.BOOKIT_SYNC_REQUIRE_CLEANUP === 'true') {
      failures.push(`cleanup failed: ${message}`);
    } else {
      console.warn(`WARN cleanup skipped: ${message}`);
    }
  }
}

try {
  const ready = await requestCase('GET readiness', 200);
  const eventTypes = ready.body?.eventTypes || [];
  const missing = acceptedEventTypes.filter((eventType) => !eventTypes.includes(eventType));
  if (missing.length > 0) {
    failures.push(`GET readiness missing event types: ${missing.join(', ')}`);
  }

  await postCase('missing idempotency header', 400, {
    eventType: 'admin-audit',
    payload: payloadFor('admin-audit', 'missing-header'),
  });

  await postCase('bad event type', 400, {
    idempotencyKey: keyFor('admin-audit', 'bad-event'),
    eventType: 'not-supported',
    payload: payloadFor('admin-audit', 'bad-event'),
  });

  for (const eventType of acceptedEventTypes) {
    await postCase(`accept ${eventType}`, durableStatus(202), {
      idempotencyKey: keyFor(eventType, 'accept'),
      eventType,
      payload: payloadFor(eventType, 'accept'),
    });
  }

  const replayKey = keyFor('booking', 'replay');
  const replayPayload = payloadFor('booking', 'replay');
  await postCase('replay seed', durableStatus(202), {
    idempotencyKey: replayKey,
    eventType: 'booking',
    payload: replayPayload,
  });
  await postCase('same-key replay', durableStatus(200), {
    idempotencyKey: replayKey,
    eventType: 'booking',
    payload: replayPayload,
  });
  await postCase('same-key conflict', durableStatus(409), {
    idempotencyKey: replayKey,
    eventType: 'booking',
    payload: { ...replayPayload, duration: 2 },
  });

  await postCase('legacy eventType/data body', durableStatus(202), {
    idempotencyKey: keyFor('admin-audit', 'legacy-body'),
    body: {
      eventType: 'admin-audit',
      data: payloadFor('admin-audit', 'legacy-body'),
    },
  });

  await postCase('payload size boundary', 413, {
    idempotencyKey: keyFor('admin-audit', 'size-boundary'),
    eventType: 'admin-audit',
    payload: {
      source: 'bookit-offline-sync-validator',
      dryRun: true,
      text: 'x'.repeat(34 * 1024),
    },
  });
} finally {
  await cleanupLocalRows();
}

if (failures.length > 0) {
  console.error('\nOffline sync validation failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

if (storeUnavailableCases.length > 0) {
  console.log('\nOffline sync shape validation passed with store unavailable.');
  console.log('Durable write/replay/conflict proof is still blocked until Atlas Mongoose handshake passes.');
  process.exit(0);
}

console.log('\nOffline sync validation passed.');
