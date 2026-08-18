import assert from "node:assert/strict";
import test from "node:test";

import {
  APU_STAGES,
  applyCrudToSnapshot,
  assertApuReceivableBySwfus,
  createApuProgressiveUpdate,
  markApuQueuePoc,
  markApuSwfusSynced,
  normalizeApuProgressiveUpdate,
  promoteApuProgressiveUpdate,
} from "../../lib/offline/apuProgressiveUpdate.js";

function implemented(overrides = {}) {
  return createApuProgressiveUpdate({
    updateId: "booking:apu:test-001",
    resource: "booking",
    resourceId: "booking-001",
    operation: "update",
    baseVersion: 4,
    ...overrides,
  });
}

test("APU starts at S1_IMPLEMENTED and executes deterministic CRUD", () => {
  const update = implemented();
  assert.equal(update.stage, APU_STAGES.IMPLEMENTED);

  const result = applyCrudToSnapshot({ status: "draft", court: 2 }, update, {
    status: "confirmed",
  });

  assert.deepEqual(result, { status: "confirmed", court: 2 });
});

test("queue persistence promotes only S1_IMPLEMENTED to S2_POC", () => {
  const poc = markApuQueuePoc(implemented(), {
    receiptId: "queue:booking:test-001",
    at: "2026-08-18T08:00:00.000Z",
  });

  assert.equal(poc.stage, APU_STAGES.POC);
  assert.equal(poc.receipts.length, 1);
  assert.equal(poc.receipts[0].kind, "crud-local-persistence");
});

test("SWFUS intake refuses unexecuted S1 updates", () => {
  assert.throws(
    () => assertApuReceivableBySwfus(implemented()),
    /SWFUS intake requires S2_POC/,
  );
});

test("server persistence promotes exact S2_POC to S3_SYNCED", () => {
  const poc = markApuQueuePoc(implemented(), {
    receiptId: "queue:booking:test-002",
    at: "2026-08-18T08:00:00.000Z",
  });
  const synced = markApuSwfusSynced(poc, {
    receiptId: "swfus:booking:test-002",
    at: "2026-08-18T08:00:01.000Z",
  });

  assert.equal(synced.stage, APU_STAGES.SYNCED);
  assert.equal(synced.receipts.length, 2);
  assert.equal(synced.receipts[1].kind, "swfus-server-persistence");
});

test("progression cannot skip proof stages", () => {
  assert.throws(
    () =>
      promoteApuProgressiveUpdate(implemented(), APU_STAGES.SYNCED, {
        receipt_id: "forged:skip",
        kind: "forged",
        evidence: "attempted stage skip",
        at: "2026-08-18T08:00:00.000Z",
      }),
    /must be progressive/,
  );
});

test("S3_SYNCED cannot be self-submitted as SWFUS input", () => {
  const poc = markApuQueuePoc(implemented(), {
    receiptId: "queue:booking:test-003",
    at: "2026-08-18T08:00:00.000Z",
  });
  const synced = markApuSwfusSynced(poc, {
    receiptId: "swfus:booking:test-003",
    at: "2026-08-18T08:00:01.000Z",
  });

  assert.throws(() => assertApuReceivableBySwfus(synced), /requires S2_POC/);
});

test("invalid CRUD operations and malformed base versions are rejected", () => {
  assert.throws(
    () => implemented({ operation: "patch" }),
    /operation must be one of/,
  );

  assert.throws(
    () => implemented({ baseVersion: -1 }),
    /base_version must be a non-negative integer/,
  );
});

test("normalization preserves backwards-compatible optional resource id", () => {
  const normalized = normalizeApuProgressiveUpdate({
    update_id: "broadcast:apu:test-004",
    resource: "broadcast",
    operation: "create",
    stage: APU_STAGES.IMPLEMENTED,
  });

  assert.equal(normalized.resource_id, null);
});
