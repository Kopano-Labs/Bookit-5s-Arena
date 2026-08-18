import assert from "node:assert/strict";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  APU_SCHEMA,
  APU_STAGES,
  applyCrudToSnapshot,
  createApuProgressiveUpdate,
  markApuQueuePoc,
  markApuSwfusSynced,
} from "../lib/offline/apuProgressiveUpdate.js";

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
  resource: "booking",
  resourceId: "validation-booking",
  operation: "update",
  baseVersion: 1,
});
assert.equal(implemented.stage, APU_STAGES.IMPLEMENTED);

const crudWitness = applyCrudToSnapshot(
  { status: "draft", court: 1 },
  implemented,
  { status: "confirmed" },
);
assert.deepEqual(crudWitness, { status: "confirmed", court: 1 });

const poc = markApuQueuePoc(implemented, {
  receiptId: "queue:validation:apu:001",
  at: "2026-08-18T08:00:00.000Z",
});
assert.equal(poc.stage, APU_STAGES.POC);

const synced = markApuSwfusSynced(poc, {
  receiptId: "swfus:validation:apu:001",
  at: "2026-08-18T08:00:01.000Z",
});
assert.equal(synced.stage, APU_STAGES.SYNCED);
assert.equal(synced.receipts.length, 2);

requireMarkers("lib/offline/kopanoOfflineQueue.js", [
  "markApuQueuePoc",
  "...(record.apu ? { apu: record.apu } : {})",
  "APU synchronization response is missing its server proof receipt.",
  "syncedApu.update_id !== record.apu.update_id",
]);

requireMarkers("app/api/v1/sync/route.js", [
  "assertApuReceivableBySwfus",
  "markApuSwfusSynced",
  "payload, ...(incomingApu ? { apu: incomingApu } : {})",
  "S4/S5 are not claimed by this endpoint.",
]);

requireMarkers("models/OfflineSyncEvent.js", [
  "fivesarena.apu.progressive-update.v1",
  '"apu.update_id"',
  '"apu.stage"',
  "S3_SYNCED",
]);

requireMarkers("docs/apwa/APU_PROGRESSIVE_SYNC_CONTRACT.md", [
  "S1_IMPLEMENTED",
  "S2_POC",
  "S3_SYNCED",
  "SYNCED != DOMAIN WRITE APPLIED",
]);

const receipt = {
  schema: "fivesarena.apu.validation-receipt.v1",
  adapterSchema: APU_SCHEMA,
  verdict: "PASS",
  proof: {
    crud: crudWitness,
    implementedStage: implemented.stage,
    pocStage: poc.stage,
    syncedStage: synced.stage,
    receiptKinds: synced.receipts.map((item) => item.kind),
  },
  boundaries: {
    highestClaimedStage: APU_STAGES.SYNCED,
    psoClaimed: false,
    governedClaimed: false,
    domainWriteAppliedClaimed: false,
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
