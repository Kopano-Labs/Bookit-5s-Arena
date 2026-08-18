const ADAPTER_SCHEMA = "fivesarena.apu.progressive-update.v1";

export const APU_SCHEMA = ADAPTER_SCHEMA;

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

  return {
    schema: APU_SCHEMA,
    update_id: requiredString(value.update_id, "update_id"),
    resource: requiredString(value.resource, "resource"),
    resource_id: resourceId?.trim() || null,
    operation,
    base_version: normalizeVersion(value.base_version),
    stage,
    receipts: normalizeReceipts(value.receipts),
  };
}

export function createApuProgressiveUpdate({
  updateId,
  resource,
  resourceId = null,
  operation,
  baseVersion = null,
} = {}) {
  return normalizeApuProgressiveUpdate({
    schema: APU_SCHEMA,
    update_id: updateId,
    resource,
    resource_id: resourceId,
    operation,
    base_version: baseVersion,
    stage: APU_STAGES.IMPLEMENTED,
    receipts: [],
  });
}

export function promoteApuProgressiveUpdate(value, nextStage, receipt) {
  const current = normalizeApuProgressiveUpdate(value);
  if (!STAGE_INDEX.has(nextStage)) {
    throw new Error(`Unsupported APU stage: ${nextStage}`);
  }

  const currentIndex = STAGE_INDEX.get(current.stage);
  const nextIndex = STAGE_INDEX.get(nextStage);
  if (nextIndex !== currentIndex + 1) {
    throw new Error(`APU transition must be progressive: ${current.stage} -> ${nextStage}.`);
  }

  return normalizeApuProgressiveUpdate({
    ...current,
    stage: nextStage,
    receipts: [...current.receipts, receipt],
  });
}

export function markApuQueuePoc(value, { receiptId, at = new Date().toISOString() } = {}) {
  const current = normalizeApuProgressiveUpdate(value);
  if (current.stage !== APU_STAGES.IMPLEMENTED) {
    throw new Error(`Queue persistence requires ${APU_STAGES.IMPLEMENTED}, received ${current.stage}.`);
  }

  return promoteApuProgressiveUpdate(current, APU_STAGES.POC, {
    receipt_id: requiredString(receiptId, "receiptId"),
    kind: "crud-local-persistence",
    evidence: "IndexedDB queue transaction persisted the progressive update for executable replay.",
    at,
  });
}

export function assertApuReceivableBySwfus(value) {
  const current = normalizeApuProgressiveUpdate(value);
  if (current.stage !== APU_STAGES.POC) {
    throw new Error(`SWFUS intake requires ${APU_STAGES.POC}, received ${current.stage}.`);
  }
  return current;
}

export function markApuSwfusSynced(value, { receiptId, at = new Date().toISOString() } = {}) {
  const current = assertApuReceivableBySwfus(value);
  return promoteApuProgressiveUpdate(current, APU_STAGES.SYNCED, {
    receipt_id: requiredString(receiptId, "receiptId"),
    kind: "swfus-server-persistence",
    evidence: "Server accepted the exact idempotent update envelope and persisted its synchronization receipt.",
    at,
  });
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
