import assert from "node:assert/strict";
import test from "node:test";

import {
  APU_STAGES,
  applyCrudToSnapshot,
  assertApuReceivableBySwfus,
  bindApuProgressivePayload,
  createApuProgressiveUpdate,
  markApuQueuePoc,
  markApuSwfusSynced,
  normalizeApuProgressiveUpdate,
  promoteApuProgressiveUpdate,
} from "../../lib/offline/apuProgressiveUpdate.js";
import {
  bindSwfusReceiptProof,
  evaluateKpgsProgressiveUpdate,
} from "../../lib/governance/kpgsProgressiveUpdate.js";

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

function createIntent(updateId = "booking:apu:create-001") {
  return createApuProgressiveUpdate({
    updateId,
    resource: "booking-intent",
    operation: "create",
    idempotencyKey: `idem:${updateId}`,
  });
}

function canonicalSwfusReceipt(poc, currentProjection = null) {
  const evaluation = evaluateKpgsProgressiveUpdate(poc.progressive_update, currentProjection);
  assert.equal(evaluation.receipt.disposition, "APPLIED");
  return bindSwfusReceiptProof(evaluation.receipt, {
    receiptId: `swfus_${poc.update_id.replace(/[^a-z0-9]/gi, "").slice(0, 24).padEnd(24, "0")}`,
    stateDigest: "state-digest-test",
    createdAt: "2026-08-19T00:00:01.000Z",
  });
}

test("APU starts at S1_IMPLEMENTED with a draft, not a premature canonical mutation claim", () => {
  const update = implemented();
  assert.equal(update.stage, APU_STAGES.IMPLEMENTED);
  assert.ok(update.progressive_draft);
  assert.equal(update.progressive_update, undefined);

  const result = applyCrudToSnapshot({ status: "draft", court: 2 }, update, {
    status: "confirmed",
  });
  assert.deepEqual(result, { status: "confirmed", court: 2 });
});

test("queue persistence materializes #NB-bound canonical S2_POC evidence", () => {
  const bound = bindApuProgressivePayload(createIntent(), {
    payload: { status: "pending", court: 2 },
    idempotencyKey: "idem:booking:apu:create-001",
  });
  const poc = markApuQueuePoc(bound, {
    receiptId: "queue:booking:test-001",
    at: "2026-08-19T00:00:00.000Z",
  });

  assert.equal(poc.stage, APU_STAGES.POC);
  assert.equal(poc.receipts.length, 1);
  assert.equal(poc.receipts[0].kind, "crud-local-persistence");
  assert.equal(poc.progressive_update.schema, "kpgs.progressive-update.v1");
  assert.equal(poc.progressive_update.boundary_marker, "#NB");
  assert.equal(poc.progressive_update.poc_validated, true);
  assert.deepEqual(poc.progressive_update.value, { status: "pending", court: 2 });
  assert.equal(poc.progressive_update.idempotency_key, "idem:booking:apu:create-001");
});

test("SWFUS intake refuses unexecuted S1 updates", () => {
  assert.throws(
    () => assertApuReceivableBySwfus(implemented()),
    /SWFUS intake requires S2_POC/,
  );
});

test("S2_POC reaches S3_SYNCED only with APPLIED canonical SWFUS proof", () => {
  const bound = bindApuProgressivePayload(createIntent("booking:apu:create-002"), {
    payload: { status: "pending" },
    idempotencyKey: "idem:booking:apu:create-002",
  });
  const poc = markApuQueuePoc(bound, {
    receiptId: "queue:booking:test-002",
    at: "2026-08-19T00:00:00.000Z",
  });
  const receipt = canonicalSwfusReceipt(poc);
  const synced = markApuSwfusSynced(poc, {
    receiptId: receipt.receipt_id,
    swfusReceipt: receipt,
    at: "2026-08-19T00:00:01.000Z",
  });

  assert.equal(synced.stage, APU_STAGES.SYNCED);
  assert.equal(synced.receipts.length, 2);
  assert.equal(synced.receipts[1].kind, "swfus-governed-distribution");
  assert.equal(synced.swfus_receipt.disposition, "APPLIED");
  assert.equal(synced.swfus_receipt.synchronized, true);
});

test("server persistence alone cannot manufacture S3_SYNCED", () => {
  const poc = markApuQueuePoc(createIntent("booking:apu:create-003"), {
    receiptId: "queue:booking:test-003",
    at: "2026-08-19T00:00:00.000Z",
  });

  assert.throws(
    () =>
      markApuSwfusSynced(poc, {
        receiptId: "server-only",
        at: "2026-08-19T00:00:01.000Z",
      }),
    /requires a canonical KPGS receipt/,
  );
});

test("progression cannot skip proof stages", () => {
  assert.throws(
    () =>
      promoteApuProgressiveUpdate(implemented(), APU_STAGES.SYNCED, {
        receipt_id: "forged:skip",
        kind: "forged",
        evidence: "attempted stage skip",
        at: "2026-08-19T00:00:00.000Z",
      }),
    /must be progressive/,
  );
});

test("S3_SYNCED cannot be self-submitted as SWFUS input", () => {
  const poc = markApuQueuePoc(createIntent("booking:apu:create-004"), {
    receiptId: "queue:booking:test-004",
    at: "2026-08-19T00:00:00.000Z",
  });
  const receipt = canonicalSwfusReceipt(poc);
  const synced = markApuSwfusSynced(poc, {
    receiptId: receipt.receipt_id,
    swfusReceipt: receipt,
    at: "2026-08-19T00:00:01.000Z",
  });

  assert.throws(() => assertApuReceivableBySwfus(synced), /requires S2_POC/);
});

test("invalid CRUD operations and malformed base versions are rejected", () => {
  assert.throws(() => implemented({ operation: "patch" }), /operation must be one of/);
  assert.throws(
    () => implemented({ baseVersion: -1 }),
    /base_version must be a non-negative integer/,
  );
});

test("normalization preserves backwards-compatible optional resource id", () => {
  const normalized = normalizeApuProgressiveUpdate({
    update_id: "broadcast:apu:test-005",
    resource: "broadcast",
    operation: "create",
    stage: APU_STAGES.IMPLEMENTED,
  });

  assert.equal(normalized.resource_id, null);
  assert.ok(normalized.progressive_draft);
});
