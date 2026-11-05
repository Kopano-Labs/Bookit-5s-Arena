import assert from "node:assert/strict";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  APU_SCHEMA,
  APU_STAGES,
  bindApuProgressivePayload,
  createApuProgressiveUpdate,
  markApuQueuePoc,
  markApuSwfusSynced,
} from "../lib/offline/apuProgressiveUpdate.js";
import {
  SWFUS_STAGE_ORDER,
  bindSwfusReceiptProof,
  evaluateKpgsProgressiveUpdate,
} from "../lib/governance/kpgsProgressiveUpdate.js";

const ROOT = resolve(import.meta.dirname, "..");

function source(path) {
  return readFileSync(resolve(ROOT, path), "utf8");
}

function requireMarkers(path, markers) {
  const text = source(path);
  for (const marker of markers) {
    assert.ok(text.includes(marker), `${path} is missing required APU marker: ${marker}`);
  }
}

const implemented = createApuProgressiveUpdate({
  updateId: "validation:apu:001",
  resource: "booking-intent",
  operation: "create",
  idempotencyKey: "validation:apu:001",
});
assert.equal(implemented.stage, APU_STAGES.IMPLEMENTED);
assert.ok(implemented.progressive_draft);
assert.equal(implemented.progressive_update, undefined);

const bound = bindApuProgressivePayload(implemented, {
  payload: { status: "confirmed", court: 1 },
  idempotencyKey: "validation:apu:001",
});

const poc = markApuQueuePoc(bound, {
  receiptId: "queue:validation:apu:001",
  at: "2026-08-19T00:00:00.000Z",
});
assert.equal(poc.stage, APU_STAGES.POC);
assert.equal(poc.progressive_update.schema, "kpgs.progressive-update.v1");
assert.equal(poc.progressive_update.boundary_marker, "#NB");
assert.equal(poc.progressive_update.poc_validated, true);
assert.equal(poc.progressive_update.foc_detected, false);
assert.deepEqual(poc.progressive_update.value, { status: "confirmed", court: 1 });

const evaluation = evaluateKpgsProgressiveUpdate(poc.progressive_update, null);
assert.equal(evaluation.receipt.disposition, "APPLIED");
assert.equal(evaluation.receipt.synchronized, true);
assert.deepEqual(
  evaluation.receipt.stages.map((item) => item.stage),
  SWFUS_STAGE_ORDER,
);
assert.deepEqual(evaluation.nextProjection.value, { status: "confirmed", court: 1 });
assert.equal(evaluation.nextProjection.version, 1);
assert.equal(evaluation.nextProjection.authority_effect, "none");
assert.equal(evaluation.distribution.canonical, false);
assert.equal(evaluation.distribution.transport_grants_authority, false);

const canonicalReceipt = bindSwfusReceiptProof(evaluation.receipt, {
  receiptId: "swfus_validation_apu_001",
  stateDigest: "validation-state-digest",
  createdAt: "2026-08-19T00:00:01.000Z",
});
const synced = markApuSwfusSynced(poc, {
  receiptId: canonicalReceipt.receipt_id,
  swfusReceipt: canonicalReceipt,
  at: "2026-08-19T00:00:01.000Z",
});
assert.equal(synced.stage, APU_STAGES.SYNCED);
assert.equal(synced.receipts.length, 2);
assert.equal(synced.swfus_receipt.schema, "kpgs.swfus.receipt.v1");
assert.equal(synced.swfus_receipt.disposition, "APPLIED");
assert.equal(synced.swfus_receipt.synchronized, true);

requireMarkers("lib/offline/kopanoOfflineQueue.js", [
  "bindApuProgressivePayload",
  "markApuQueuePoc",
  "APU synchronization response is missing its server proof receipt.",
  "syncedApu.update_id !== record.apu.update_id",
  'syncedApu.swfus_receipt?.disposition !== "APPLIED"',
]);

requireMarkers("lib/governance/kpgsProgressiveUpdate.js", [
  'KPGS_PROGRESSIVE_UPDATE_SCHEMA = "kpgs.progressive-update.v1"',
  'KPGS_BOUNDARY_MARKER = "#NB"',
  '"POC_FOC_CHECK"',
  'transport_grants_authority: false',
]);

requireMarkers("lib/governance/swfusProjectionStore.js", [
  "loadSwfusProjection",
  "applySwfusProjection",
  "rollbackSwfusProjection",
  "SwfusProjectionConflictError",
]);

requireMarkers("app/api/v1/sync/route.js", [
  "assertApuReceivableBySwfus",
  "evaluateKpgsProgressiveUpdate",
  "loadSwfusProjection",
  "applySwfusProjection",
  "rollbackSwfusProjection",
  "markApuSwfusSynced",
  'boundaryMarker: "#NB"',
  "SWFUS_DISPOSITIONS.APPLIED",
]);

requireMarkers("models/OfflineSyncEvent.js", [
  "fivesarena.apu.progressive-update.v1",
  "kpgs.progressive-update.v1",
  "kpgs.swfus.receipt.v1",
  'enum: ["#NB"]',
  "swfusDistribution",
]);

requireMarkers("models/SwfusProjection.js", [
  "non_authoritative",
  "pending_proposal",
  'enum: ["none"]',
]);

requireMarkers("docs/apwa/APU_PROGRESSIVE_SYNC_CONTRACT.md", [
  "kpgs.progressive-update.v1",
  "#NB",
  "bounded CRUD",
  "State-Wide Framework Universal Synchronization",
  "SYNCED != CANONICAL DOMAIN TRUTH",
]);

const receipt = {
  schema: "fivesarena.apu.validation-receipt.v2",
  adapterSchema: APU_SCHEMA,
  canonicalProgressiveUpdateSchema: poc.progressive_update.schema,
  canonicalSwfusReceiptSchema: canonicalReceipt.schema,
  verdict: "PASS",
  proof: {
    implementedStage: implemented.stage,
    pocStage: poc.stage,
    syncedStage: synced.stage,
    boundaryMarker: poc.progressive_update.boundary_marker,
    canonicalStages: evaluation.receipt.stages.map((item) => ({
      stage: item.stage,
      status: item.status,
    })),
    disposition: canonicalReceipt.disposition,
    synchronized: canonicalReceipt.synchronized,
    projectionVersion: evaluation.nextProjection.version,
    distributionCanonical: evaluation.distribution.canonical,
    transportGrantsAuthority: evaluation.distribution.transport_grants_authority,
    receiptKinds: synced.receipts.map((item) => item.kind),
  },
  boundaries: {
    highestAdapterStageClaimed: APU_STAGES.SYNCED,
    boundedProjectionApplied: true,
    canonicalDomainTruthClaimed: false,
    psoClaimed: false,
    governedClaimed: false,
    synchronizationGrantsAuthority: false,
  },
};

const receiptDir = resolve(ROOT, ".kpgs", "receipts");
mkdirSync(receiptDir, { recursive: true });
writeFileSync(
  resolve(receiptDir, "apu-progressive-sync.json"),
  `${JSON.stringify(receipt, null, 2)}\n`,
  "utf8",
);

console.log(JSON.stringify(receipt, null, 2));
