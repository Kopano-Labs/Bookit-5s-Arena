export const KPGS_PROGRESSIVE_UPDATE_SCHEMA = "kpgs.progressive-update.v1";
export const KPGS_SWFUS_RECEIPT_SCHEMA = "kpgs.swfus.receipt.v1";
export const KPGS_SWFUS_DISTRIBUTION_SCHEMA = "kpgs.swfus.distribution.v1";
export const KPGS_BOUNDARY_MARKER = "#NB";

export const CRUD_OPERATIONS = Object.freeze(["CREATE", "READ", "UPDATE", "DELETE"]);
export const APU_STATUSES = Object.freeze(["GREEN", "YELLOW", "RED", "UNSPECIFIED"]);
export const STATE_CLASSES = Object.freeze([
  "non_authoritative",
  "derived_projection",
  "pending_proposal",
]);
export const SWFUS_STAGE_ORDER = Object.freeze([
  "TELEMETRY",
  "CLASSIFICATION",
  "ROUTING",
  "PROTOCOL_SELECTION",
  "INVARIANT_AUDIT",
  "POC_FOC_CHECK",
  "STATE_UPDATE",
  "DISTRIBUTION",
]);
export const SWFUS_DISPOSITIONS = Object.freeze({
  APPLIED: "APPLIED",
  OBSERVED: "OBSERVED",
  HELD: "HELD",
  REJECTED: "REJECTED",
});

const CRUD_SET = new Set(CRUD_OPERATIONS);
const APU_SET = new Set(APU_STATUSES);
const STATE_CLASS_SET = new Set(STATE_CLASSES);

function requiredString(value, field) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${field} must be a non-empty string.`);
  }
  return value.trim();
}

function normalizeEvidenceRefs(value) {
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value)) throw new Error("evidence_refs must be an array.");
  const refs = value.map((item, index) => requiredString(item, `evidence_refs[${index}]`));
  if (new Set(refs).size !== refs.length) {
    throw new Error("evidence_refs must contain unique values.");
  }
  return refs;
}

function normalizeExpectedVersion(value) {
  if (value === undefined || value === null) return null;
  if (!Number.isInteger(value) || value < 0) {
    throw new Error("expected_version must be a non-negative integer when provided.");
  }
  return value;
}

export function normalizeKpgsProgressiveUpdate(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("progressive_update must be an object.");
  }

  const schema = value.schema || KPGS_PROGRESSIVE_UPDATE_SCHEMA;
  if (schema !== KPGS_PROGRESSIVE_UPDATE_SCHEMA) {
    throw new Error(`Unsupported progressive update schema: ${schema}`);
  }

  const operation = requiredString(value.operation, "operation").toUpperCase();
  if (!CRUD_SET.has(operation)) {
    throw new Error(`operation must be one of: ${CRUD_OPERATIONS.join(", ")}.`);
  }

  const apuStatus = requiredString(value.apu_status ?? "UNSPECIFIED", "apu_status").toUpperCase();
  if (!APU_SET.has(apuStatus)) {
    throw new Error(`apu_status must be one of: ${APU_STATUSES.join(", ")}.`);
  }

  const stateClass = requiredString(value.state_class, "state_class");
  if (!STATE_CLASS_SET.has(stateClass)) {
    throw new Error(`state_class must be one of: ${STATE_CLASSES.join(", ")}.`);
  }

  if (value.authority_effect !== "none") {
    throw new Error('authority_effect must equal "none".');
  }
  if (value.boundary_marker !== KPGS_BOUNDARY_MARKER) {
    throw new Error(`${KPGS_BOUNDARY_MARKER} boundary marker is required.`);
  }
  if (typeof value.poc_validated !== "boolean") {
    throw new Error("poc_validated must be boolean.");
  }
  if (typeof value.foc_detected !== "boolean") {
    throw new Error("foc_detected must be boolean.");
  }
  if (typeof value.invariant_passed !== "boolean") {
    throw new Error("invariant_passed must be boolean.");
  }

  const evidenceRefs = normalizeEvidenceRefs(value.evidence_refs);
  if (operation !== "READ") {
    if (!value.poc_validated || value.foc_detected || evidenceRefs.length === 0) {
      throw new Error(
        "Mutating progressive updates require poc_validated=true, foc_detected=false and evidence_refs.",
      );
    }
  }

  return {
    schema: KPGS_PROGRESSIVE_UPDATE_SCHEMA,
    update_id: requiredString(value.update_id, "update_id"),
    node_id: requiredString(value.node_id, "node_id"),
    operation,
    lane: requiredString(value.lane, "lane"),
    context_route: requiredString(value.context_route, "context_route"),
    protocol: requiredString(value.protocol, "protocol"),
    idempotency_key: requiredString(value.idempotency_key, "idempotency_key"),
    value: value.value ?? null,
    apu_status: apuStatus,
    poc_validated: value.poc_validated,
    foc_detected: value.foc_detected,
    invariant_passed: value.invariant_passed,
    authority_effect: "none",
    state_class: stateClass,
    evidence_refs: evidenceRefs,
    correlation_id: typeof value.correlation_id === "string" ? value.correlation_id : "",
    source: typeof value.source === "string" && value.source.trim() ? value.source.trim() : "apu",
    expected_version: normalizeExpectedVersion(value.expected_version),
    boundary_marker: KPGS_BOUNDARY_MARKER,
  };
}

function stage(stageName, status, reason) {
  return { stage: stageName, status, reason };
}

function completeStages(stages) {
  const seen = new Set(stages.map((item) => item.stage));
  for (const stageName of SWFUS_STAGE_ORDER) {
    if (!seen.has(stageName)) {
      stages.push(
        stage(stageName, "NOT_REACHED", "prior governance gate stopped progression"),
      );
    }
  }
  return stages;
}

function finish(update, disposition, stages, { synchronized = false } = {}) {
  return {
    schema: KPGS_SWFUS_RECEIPT_SCHEMA,
    receipt_id: null,
    update_id: update.update_id,
    node_id: update.node_id,
    operation: update.operation,
    disposition,
    stages: completeStages(stages),
    synchronized,
    canonical_authority_changed: false,
    state_digest: null,
    evidence_refs: [...update.evidence_refs],
    correlation_id: update.correlation_id,
    boundary_marker: update.boundary_marker,
    replayed: false,
    created_at: null,
  };
}

export function bindSwfusReceiptProof(
  receipt,
  { receiptId, stateDigest = null, createdAt = new Date().toISOString() } = {},
) {
  if (!receipt || receipt.schema !== KPGS_SWFUS_RECEIPT_SCHEMA) {
    throw new Error("A canonical SWFUS receipt is required.");
  }
  if (stateDigest !== null && (typeof stateDigest !== "string" || !stateDigest.trim())) {
    throw new Error("stateDigest must be null or a non-empty string.");
  }
  return {
    ...receipt,
    receipt_id: requiredString(receiptId, "receiptId"),
    state_digest: stateDigest,
    created_at: requiredString(createdAt, "createdAt"),
  };
}

function finiteIfNumber(value) {
  if (typeof value !== "number") return true;
  return Number.isFinite(value);
}

export function evaluateKpgsProgressiveUpdate(value, currentProjection = null) {
  const update = normalizeKpgsProgressiveUpdate(value);
  const stages = [];

  stages.push(stage("TELEMETRY", "PASS", "update identity accepted"));
  stages.push(
    stage("CLASSIFICATION", "PASS", `lane=${update.lane}; apu=${update.apu_status}`),
  );
  stages.push(stage("ROUTING", "PASS", `route=${update.context_route}`));

  if (update.operation === "READ") {
    stages.push(stage("PROTOCOL_SELECTION", "SKIP", "read requires no mutation protocol"));
    stages.push(stage("INVARIANT_AUDIT", "SKIP", "observation is not mutation"));
    stages.push(stage("POC_FOC_CHECK", "SKIP", "read cannot promote state"));
    stages.push(stage("STATE_UPDATE", "OBSERVE", "projection read only"));
    stages.push(stage("DISTRIBUTION", "SKIP", "reads are not synchronized mutations"));
    return {
      update,
      receipt: finish(update, SWFUS_DISPOSITIONS.OBSERVED, stages),
      nextProjection: currentProjection,
      distribution: null,
    };
  }

  stages.push(stage("PROTOCOL_SELECTION", "PASS", `protocol=${update.protocol}`));

  const invariantFailures = [];
  if (!update.invariant_passed) invariantFailures.push("caller-declared invariant audit failed");
  if (update.authority_effect !== "none") invariantFailures.push("authority_effect must remain none");
  if (update.boundary_marker !== KPGS_BOUNDARY_MARKER) invariantFailures.push("#NB boundary marker is required");
  if (!finiteIfNumber(update.value)) invariantFailures.push("numeric value must be finite");
  if (invariantFailures.length > 0) {
    stages.push(stage("INVARIANT_AUDIT", "REJECT", invariantFailures.join("; ")));
    return {
      update,
      receipt: finish(update, SWFUS_DISPOSITIONS.REJECTED, stages),
      nextProjection: currentProjection,
      distribution: null,
    };
  }
  stages.push(stage("INVARIANT_AUDIT", "PASS", "authority and update invariants preserved"));

  if (update.apu_status === "RED" || update.foc_detected) {
    stages.push(stage("POC_FOC_CHECK", "REJECT", "FOC/RED update cannot mutate or distribute"));
    return {
      update,
      receipt: finish(update, SWFUS_DISPOSITIONS.REJECTED, stages),
      nextProjection: currentProjection,
      distribution: null,
    };
  }
  if (update.apu_status === "YELLOW") {
    stages.push(stage("POC_FOC_CHECK", "HOLD", "APU YELLOW requires review before mutation"));
    return {
      update,
      receipt: finish(update, SWFUS_DISPOSITIONS.HELD, stages),
      nextProjection: currentProjection,
      distribution: null,
    };
  }
  stages.push(stage("POC_FOC_CHECK", "PASS", "POC evidence admitted; FOC absent"));

  const currentVersion = currentProjection?.version ?? 0;
  if (update.expected_version !== null && currentVersion !== update.expected_version) {
    stages.push(stage("STATE_UPDATE", "HOLD", "expected_version does not match projection"));
    return {
      update,
      receipt: finish(update, SWFUS_DISPOSITIONS.HELD, stages),
      nextProjection: currentProjection,
      distribution: null,
    };
  }

  let nextProjection;
  if (update.operation === "CREATE") {
    if (currentProjection !== null) {
      stages.push(stage("STATE_UPDATE", "HOLD", "CREATE target already exists"));
      return {
        update,
        receipt: finish(update, SWFUS_DISPOSITIONS.HELD, stages),
        nextProjection: currentProjection,
        distribution: null,
      };
    }
    nextProjection = {
      value: update.value,
      version: 1,
      state_class: update.state_class,
      authority_effect: "none",
      update_id: update.update_id,
    };
  } else if (update.operation === "UPDATE") {
    if (currentProjection === null) {
      stages.push(stage("STATE_UPDATE", "HOLD", "UPDATE target does not exist"));
      return {
        update,
        receipt: finish(update, SWFUS_DISPOSITIONS.HELD, stages),
        nextProjection: null,
        distribution: null,
      };
    }
    nextProjection = {
      value: update.value,
      version: currentVersion + 1,
      state_class: update.state_class,
      authority_effect: "none",
      update_id: update.update_id,
    };
  } else {
    if (currentProjection === null) {
      stages.push(stage("STATE_UPDATE", "HOLD", "DELETE target does not exist"));
      return {
        update,
        receipt: finish(update, SWFUS_DISPOSITIONS.HELD, stages),
        nextProjection: null,
        distribution: null,
      };
    }
    nextProjection = null;
  }

  stages.push(stage("STATE_UPDATE", "PASS", "bounded non-authoritative projection updated"));
  const distribution = {
    schema: KPGS_SWFUS_DISTRIBUTION_SCHEMA,
    update_id: update.update_id,
    node_id: update.node_id,
    operation: update.operation,
    state_digest: null,
    evidence_refs: [...update.evidence_refs],
    correlation_id: update.correlation_id,
    authority_effect: "none",
    canonical: false,
    transport_grants_authority: false,
  };
  stages.push(
    stage(
      "DISTRIBUTION",
      "PASS",
      "framework alignment event prepared without authority widening",
    ),
  );

  return {
    update,
    receipt: finish(update, SWFUS_DISPOSITIONS.APPLIED, stages, { synchronized: true }),
    nextProjection,
    distribution,
  };
}
