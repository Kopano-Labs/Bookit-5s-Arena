import {
  CRUD_OPERATIONS as KPGS_CRUD_OPERATIONS,
  KPGS_BOUNDARY_MARKER,
  KPGS_PROGRESSIVE_UPDATE_SCHEMA,
  KPGS_SWFUS_RECEIPT_SCHEMA,
  normalizeKpgsProgressiveUpdate,
} from "../governance/kpgsProgressiveUpdate.js";

const ADAPTER_SCHEMA = "fivesarena.apu.progressive-update.v1";

export const APU_SCHEMA = ADAPTER_SCHEMA;
export { KPGS_PROGRESSIVE_UPDATE_SCHEMA };

export const APU_STAGES = Object.freeze({
  CONCEPT: "S0_CONCEPT",
  IMPLEMENTED: "S1_IMPLEMENTED",
  POC: "S2_POC",
  SYNCED: "S3_SYNCED",
  PSO: "S4_PSO",
  GOVERNED: "S5_GOVERNED",
});

export const CRUD_OPERATIONS = Object.freeze(["create", "read", "update", "delete"]);

const CRUD_OPERATION_SET = new Set(CRUD_OPERATIONS);
const STAGE_ORDER = Object.freeze([
  APU_STAGES.CONCEPT,
  APU_STAGES.IMPLEMENTED,
  APU_STAGES.POC,
  APU_STAGES.SYNCED,
  APU_STAGES.PSO,
  APU_STAGES.GOVERNED,
]);
const STAGE_INDEX = new Map(STAGE_ORDER.map((stage, index) => [stage, index]));

function requiredString(value, field) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${field} must be a non-empty string.`);
  }
  return value.trim();
}

function normalizeVersion(value) {
  if (value === undefined || value === null) return null;
  if (!Number.isInteger(value) || value < 0) {
    throw new Error("base_version must be a non-negative integer when provided.");
  }
  return value;
}

function normalizeReceipts(value) {
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value)) throw new Error("receipts must be an array.");

  return value.map((receipt, index) => {
    if (!receipt || typeof receipt !== "object" || Array.isArray(receipt)) {
      throw new Error(`receipts[${index}] must be an object.`);
    }

    return {
      receipt_id: requiredString(receipt.receipt_id, `receipts[${index}].receipt_id`),
      kind: requiredString(receipt.kind, `receipts[${index}].kind`),
      evidence: requiredString(receipt.evidence, `receipts[${index}].evidence`),
      at: requiredString(receipt.at, `receipts[${index}].at`),
    };
  });
}

function defaultNodeId(resource, resourceId, updateId) {
  return `${resource}:${resourceId || updateId}`;
}

function normalizeProgressiveDraft(value, fallback) {
  const source = value && typeof value === "object" && !Array.isArray(value) ? value : {};
  return {
    node_id: requiredString(
      source.node_id || defaultNodeId(fallback.resource, fallback.resourceId, fallback.updateId),
      "progressive_draft.node_id",
    ),
    operation: requiredString(source.operation || fallback.operation, "progressive_draft.operation").toUpperCase(),
    lane: requiredString(source.lane || `fivesarena.${fallback.resource}`, "progressive_draft.lane"),
    context_route: requiredString(
      source.context_route || "fivesarena.apwa.offline",
      "progressive_draft.context_route",
    ),
    protocol: requiredString(
      source.protocol || "KPGS-vNext/APU-CRUD-SWFUS",
      "progressive_draft.protocol",
    ),
    idempotency_key: requiredString(
      source.idempotency_key || fallback.updateId,
      "progressive_draft.idempotency_key",
    ),
    value: source.value ?? null,
    apu_status: typeof source.apu_status === "string" ? source.apu_status.toUpperCase() : "UNSPECIFIED",
    foc_detected: source.foc_detected === true,
    invariant_passed: source.invariant_passed !== false,
    authority_effect: "none",
    state_class: source.state_class || "pending_proposal",
    correlation_id: typeof source.correlation_id === "string" ? source.correlation_id : fallback.updateId,
    source: typeof source.source === "string" && source.source.trim() ? source.source.trim() : "fivesarena-apu",
    expected_version:
      source.expected_version === undefined ? fallback.baseVersion : normalizeVersion(source.expected_version),
    boundary_marker: KPGS_BOUNDARY_MARKER,
  };
}

function materializeLegacyProgressiveUpdate({
  updateId,
  resource,
  resourceId,
  operation,
  baseVersion,
  receipts,
}) {
  const evidenceRefs = receipts.map((receipt) => `${receipt.kind}:${receipt.receipt_id}`);
  return normalizeKpgsProgressiveUpdate({
    schema: KPGS_PROGRESSIVE_UPDATE_SCHEMA,
    update_id: updateId,
    node_id: defaultNodeId(resource, resourceId, updateId),
    operation: operation.toUpperCase(),
    lane: `fivesarena.${resource}`,
    context_route: "fivesarena.apwa.offline",
    protocol: "KPGS-vNext/APU-CRUD-SWFUS",
    idempotency_key: updateId,
    value: null,
    apu_status: "UNSPECIFIED",
    poc_validated: true,
    foc_detected: false,
    invariant_passed: true,
    authority_effect: "none",
    state_class: "pending_proposal",
    evidence_refs: evidenceRefs.length > 0 ? evidenceRefs : [`legacy-apu:${updateId}`],
    correlation_id: updateId,
    source: "fivesarena-apu-legacy-adapter",
    expected_version: baseVersion,
    boundary_marker: KPGS_BOUNDARY_MARKER,
  });
}

export function normalizeApuProgressiveUpdate(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("apu must be an object.");
  }

  const schema = value.schema || APU_SCHEMA;
  if (schema !== APU_SCHEMA) {
    throw new Error(`Unsupported APU schema: ${schema}`);
  }

  const operation = requiredString(value.operation, "operation").toLowerCase();
  if (!CRUD_OPERATION_SET.has(operation)) {
    throw new Error(`operation must be one of: ${CRUD_OPERATIONS.join(", ")}.`);
  }

  const stage = value.stage || APU_STAGES.IMPLEMENTED;
  if (!STAGE_INDEX.has(stage)) {
    throw new Error(`Unsupported APU stage: ${stage}`);
  }

  const resourceId = value.resource_id;
  if (resourceId !== undefined && resourceId !== null && typeof resourceId !== "string") {
    throw new Error("resource_id must be a string when provided.");
  }

  const updateId = requiredString(value.update_id, "update_id");
  const resource = requiredString(value.resource, "resource");
  const normalizedResourceId = resourceId?.trim() || null;
  const baseVersion = normalizeVersion(value.base_version);
  const receipts = normalizeReceipts(value.receipts);
  const fallback = {
    updateId,
    resource,
    resourceId: normalizedResourceId,
    operation,
    baseVersion,
  };

  const result = {
    schema: APU_SCHEMA,
    update_id: updateId,
    resource,
    resource_id: normalizedResourceId,
    operation,
    base_version: baseVersion,
    stage,
    receipts,
  };

  if (STAGE_INDEX.get(stage) < STAGE_INDEX.get(APU_STAGES.POC)) {
    result.progressive_draft = normalizeProgressiveDraft(value.progressive_draft, fallback);
  } else {
    const progressiveUpdate = value.progressive_update
      ? normalizeKpgsProgressiveUpdate(value.progressive_update)
      : materializeLegacyProgressiveUpdate({
          updateId,
          resource,
          resourceId: normalizedResourceId,
          operation,
          baseVersion,
          receipts,
        });
    if (progressiveUpdate.update_id !== updateId) {
      throw new Error("progressive_update.update_id must match the APU update_id.");
    }
    if (progressiveUpdate.operation !== operation.toUpperCase()) {
      throw new Error("progressive_update.operation must match the APU CRUD operation.");
    }
    result.progressive_update = progressiveUpdate;
  }

  if (value.swfus_receipt) result.swfus_receipt = value.swfus_receipt;
  return result;
}

export function createApuProgressiveUpdate({
  updateId,
  resource,
  resourceId = null,
  operation,
  baseVersion = null,
  idempotencyKey = null,
  value = null,
  lane = null,
  contextRoute = "fivesarena.apwa.offline",
  protocol = "KPGS-vNext/APU-CRUD-SWFUS",
  stateClass = "pending_proposal",
  source = "fivesarena-apu",
} = {}) {
  const normalizedOperation = requiredString(operation, "operation").toLowerCase();
  if (!CRUD_OPERATION_SET.has(normalizedOperation)) {
    throw new Error(`operation must be one of: ${CRUD_OPERATIONS.join(", ")}.`);
  }
  const normalizedUpdateId = requiredString(updateId, "updateId");
  const normalizedResource = requiredString(resource, "resource");
  const normalizedResourceId = resourceId?.trim() || null;
  const normalizedBaseVersion = normalizeVersion(baseVersion);

  return normalizeApuProgressiveUpdate({
    schema: APU_SCHEMA,
    update_id: normalizedUpdateId,
    resource: normalizedResource,
    resource_id: normalizedResourceId,
    operation: normalizedOperation,
    base_version: normalizedBaseVersion,
    stage: APU_STAGES.IMPLEMENTED,
    receipts: [],
    progressive_draft: {
      node_id: defaultNodeId(normalizedResource, normalizedResourceId, normalizedUpdateId),
      operation: normalizedOperation.toUpperCase(),
      lane: lane || `fivesarena.${normalizedResource}`,
      context_route: contextRoute,
      protocol,
      idempotency_key: idempotencyKey || normalizedUpdateId,
      value,
      apu_status: "UNSPECIFIED",
      foc_detected: false,
      invariant_passed: true,
      authority_effect: "none",
      state_class: stateClass,
      correlation_id: normalizedUpdateId,
      source,
      expected_version: normalizedBaseVersion,
      boundary_marker: KPGS_BOUNDARY_MARKER,
    },
  });
}

export function bindApuProgressivePayload(value, { payload, idempotencyKey } = {}) {
  const current = normalizeApuProgressiveUpdate(value);
  if (STAGE_INDEX.get(current.stage) >= STAGE_INDEX.get(APU_STAGES.POC)) {
    throw new Error("APU payload may only be bound before the POC persistence transition.");
  }
  return normalizeApuProgressiveUpdate({
    ...current,
    progressive_draft: {
      ...current.progressive_draft,
      value: payload,
      idempotency_key: idempotencyKey || current.progressive_draft.idempotency_key,
    },
  });
}

export function promoteApuProgressiveUpdate(value, nextStage, receipt) {
  const rawProgressiveUpdate = value?.progressive_update || null;
  const rawSwfusReceipt = value?.swfus_receipt || null;
  const current = normalizeApuProgressiveUpdate(value);
  if (!STAGE_INDEX.has(nextStage)) {
    throw new Error(`Unsupported APU stage: ${nextStage}`);
  }
  const currentIndex = STAGE_INDEX.get(current.stage);
  const nextIndex = STAGE_INDEX.get(nextStage);
  if (nextIndex !== currentIndex + 1) {
    throw new Error(`APU transition must be progressive: ${current.stage} -> ${nextStage}.`);
  }

  const promoted = {
    ...current,
    stage: nextStage,
    receipts: [...current.receipts, receipt],
  };
  if (nextIndex >= STAGE_INDEX.get(APU_STAGES.POC) && rawProgressiveUpdate) {
    promoted.progressive_update = rawProgressiveUpdate;
    delete promoted.progressive_draft;
  }
  if (rawSwfusReceipt) promoted.swfus_receipt = rawSwfusReceipt;
  return promoted;
}

export function markApuQueuePoc(value, { receiptId, at = new Date().toISOString() } = {}) {
  const current = normalizeApuProgressiveUpdate(value);
  if (current.stage !== APU_STAGES.IMPLEMENTED) {
    throw new Error(`Queue persistence requires ${APU_STAGES.IMPLEMENTED}, received ${current.stage}.`);
  }

  const normalizedReceiptId = requiredString(receiptId, "receiptId");
  const evidenceRef = `crud-local-persistence:${normalizedReceiptId}`;
  const draft = current.progressive_draft;
  const progressiveUpdate = normalizeKpgsProgressiveUpdate({
    schema: KPGS_PROGRESSIVE_UPDATE_SCHEMA,
    update_id: current.update_id,
    ...draft,
    poc_validated: true,
    evidence_refs: [evidenceRef],
  });

  return normalizeApuProgressiveUpdate(
    promoteApuProgressiveUpdate(
      {
        ...current,
        progressive_update: progressiveUpdate,
      },
      APU_STAGES.POC,
      {
        receipt_id: normalizedReceiptId,
        kind: "crud-local-persistence",
        evidence:
          "IndexedDB queue transaction persisted the exact #NB-bound progressive update for executable replay.",
        at,
      },
    ),
  );
}

export function assertApuReceivableBySwfus(value) {
  const current = normalizeApuProgressiveUpdate(value);
  if (current.stage !== APU_STAGES.POC) {
    throw new Error(`SWFUS intake requires ${APU_STAGES.POC}, received ${current.stage}.`);
  }
  const progressiveUpdate = normalizeKpgsProgressiveUpdate(current.progressive_update);
  if (!progressiveUpdate.poc_validated || progressiveUpdate.evidence_refs.length === 0) {
    throw new Error("SWFUS intake requires POC validation evidence.");
  }
  return current;
}

export function markApuSwfusSynced(
  value,
  { receiptId, swfusReceipt, at = new Date().toISOString() } = {},
) {
  const current = assertApuReceivableBySwfus(value);
  if (!swfusReceipt || swfusReceipt.schema !== KPGS_SWFUS_RECEIPT_SCHEMA) {
    throw new Error("SWFUS synchronization requires a canonical KPGS receipt.");
  }
  if (swfusReceipt.update_id !== current.update_id) {
    throw new Error("SWFUS receipt update_id does not match the APU update_id.");
  }
  if (swfusReceipt.disposition !== "APPLIED" || swfusReceipt.synchronized !== true) {
    throw new Error("APU may reach S3_SYNCED only after an APPLIED synchronized SWFUS receipt.");
  }

  return normalizeApuProgressiveUpdate(
    promoteApuProgressiveUpdate(
      { ...current, swfus_receipt: swfusReceipt },
      APU_STAGES.SYNCED,
      {
        receipt_id: requiredString(receiptId, "receiptId"),
        kind: "swfus-governed-distribution",
        evidence:
          "Canonical KPGS progressive update passed #NB, bounded CRUD, POC/FOC, state-update and distribution gates.",
        at,
      },
    ),
  );
}

export function applyCrudToSnapshot(snapshot, value, payload = {}) {
  const update = normalizeApuProgressiveUpdate(value);
  if (update.stage !== APU_STAGES.IMPLEMENTED && update.stage !== APU_STAGES.POC) {
    throw new Error("CRUD execution is only valid before SWFUS synchronization promotion.");
  }

  const source = snapshot && typeof snapshot === "object" && !Array.isArray(snapshot) ? snapshot : {};
  switch (update.operation) {
    case "create":
      return { ...source, ...payload };
    case "read":
      return { ...source };
    case "update":
      return { ...source, ...payload };
    case "delete":
      return null;
    default:
      throw new Error(`Unhandled CRUD operation: ${update.operation}`);
  }
}

export function apuStageIndex(stage) {
  if (!STAGE_INDEX.has(stage)) throw new Error(`Unsupported APU stage: ${stage}`);
  return STAGE_INDEX.get(stage);
}

export function kpgsCrudOperationForApu(value) {
  const current = normalizeApuProgressiveUpdate(value);
  const operation = current.operation.toUpperCase();
  if (!KPGS_CRUD_OPERATIONS.includes(operation)) {
    throw new Error(`Unsupported KPGS CRUD operation: ${operation}`);
  }
  return operation;
}
