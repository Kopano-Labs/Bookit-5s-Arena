import assert from "node:assert/strict";
import test from "node:test";

import {
  KPGS_BOUNDARY_MARKER,
  KPGS_PROGRESSIVE_UPDATE_SCHEMA,
  SWFUS_DISPOSITIONS,
  SWFUS_STAGE_ORDER,
  bindSwfusReceiptProof,
  evaluateKpgsProgressiveUpdate,
  normalizeKpgsProgressiveUpdate,
} from "../../lib/governance/kpgsProgressiveUpdate.js";

function mutation(overrides = {}) {
  return {
    schema: KPGS_PROGRESSIVE_UPDATE_SCHEMA,
    update_id: "booking:progressive:test-001",
    node_id: "booking-intent:test-001",
    operation: "CREATE",
    lane: "fivesarena.booking-intent",
    context_route: "fivesarena.apwa.offline",
    protocol: "KPGS-vNext/APU-CRUD-SWFUS",
    idempotency_key: "booking:test-001",
    value: { status: "pending" },
    apu_status: "UNSPECIFIED",
    poc_validated: true,
    foc_detected: false,
    invariant_passed: true,
    authority_effect: "none",
    state_class: "pending_proposal",
    evidence_refs: ["crud-local-persistence:queue:booking:test-001"],
    correlation_id: "booking:test-001",
    source: "fivesarena-apu",
    expected_version: null,
    boundary_marker: KPGS_BOUNDARY_MARKER,
    ...overrides,
  };
}

test("canonical CREATE traverses the full KPGS stage order before distribution", () => {
  const result = evaluateKpgsProgressiveUpdate(mutation(), null);

  assert.equal(result.receipt.disposition, SWFUS_DISPOSITIONS.APPLIED);
  assert.equal(result.receipt.synchronized, true);
  assert.deepEqual(
    result.receipt.stages.map((item) => item.stage),
    SWFUS_STAGE_ORDER,
  );
  assert.equal(result.nextProjection.version, 1);
  assert.equal(result.nextProjection.authority_effect, "none");
  assert.equal(result.distribution.canonical, false);
  assert.equal(result.distribution.transport_grants_authority, false);
});

test("APU YELLOW holds before state mutation and distribution", () => {
  const result = evaluateKpgsProgressiveUpdate(mutation({ apu_status: "YELLOW" }), null);

  assert.equal(result.receipt.disposition, SWFUS_DISPOSITIONS.HELD);
  assert.equal(result.nextProjection, null);
  assert.equal(result.distribution, null);
  assert.equal(
    result.receipt.stages.find((item) => item.stage === "POC_FOC_CHECK")?.status,
    "HOLD",
  );
  assert.equal(
    result.receipt.stages.find((item) => item.stage === "STATE_UPDATE")?.status,
    "NOT_REACHED",
  );
});

test("FOC mutation cannot enter the canonical progressive-update contract", () => {
  assert.throws(
    () => normalizeKpgsProgressiveUpdate(mutation({ foc_detected: true })),
    /require poc_validated=true, foc_detected=false and evidence_refs/,
  );
});

test("optimistic expected_version holds stale UPDATE instead of overwriting", () => {
  const result = evaluateKpgsProgressiveUpdate(
    mutation({
      update_id: "booking:progressive:test-002",
      operation: "UPDATE",
      expected_version: 3,
    }),
    {
      value: { status: "pending" },
      version: 4,
      state_class: "pending_proposal",
      authority_effect: "none",
      update_id: "older-update",
    },
  );

  assert.equal(result.receipt.disposition, SWFUS_DISPOSITIONS.HELD);
  assert.equal(result.nextProjection.version, 4);
  assert.equal(
    result.receipt.stages.find((item) => item.stage === "STATE_UPDATE")?.status,
    "HOLD",
  );
});

test("READ observes a projection without mutation or distribution authority", () => {
  const update = mutation({
    update_id: "booking:progressive:test-read",
    operation: "READ",
    poc_validated: false,
    evidence_refs: [],
  });
  const current = {
    value: { status: "pending" },
    version: 2,
    state_class: "pending_proposal",
    authority_effect: "none",
    update_id: "existing-update",
  };
  const result = evaluateKpgsProgressiveUpdate(update, current);

  assert.equal(result.receipt.disposition, SWFUS_DISPOSITIONS.OBSERVED);
  assert.deepEqual(result.nextProjection, current);
  assert.equal(result.distribution, null);
  assert.equal(
    result.receipt.stages.find((item) => item.stage === "DISTRIBUTION")?.status,
    "SKIP",
  );
});

test("receipt proof binding adds exact receipt identity without widening authority", () => {
  const result = evaluateKpgsProgressiveUpdate(mutation(), null);
  const receipt = bindSwfusReceiptProof(result.receipt, {
    receiptId: "swfus_0123456789abcdef01234567",
    stateDigest: "abc123",
    createdAt: "2026-08-19T00:00:00.000Z",
  });

  assert.equal(receipt.receipt_id, "swfus_0123456789abcdef01234567");
  assert.equal(receipt.state_digest, "abc123");
  assert.equal(receipt.canonical_authority_changed, false);
  assert.equal(receipt.boundary_marker, "#NB");
});
