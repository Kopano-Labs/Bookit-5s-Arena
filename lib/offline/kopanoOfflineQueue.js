"use client";

import { openKopanoVaultDB, VAULT_STORES as STORES } from "@/lib/offline/kopanoVaultDb";

const VALID_EVENT_TYPES = new Set([
  "booking",
  "payment",
  "check-in",
  "broadcast",
  "testimony",
  "admin-audit",
]);
const MAX_RETRIES = 5;
const DEFAULT_SYNC_URL = "/api/v1/sync";

function assertIndexedDB() {
  if (typeof window === "undefined" || !window.indexedDB) {
    throw new Error("IndexedDB is not available in this runtime.");
  }
}

function requestResult(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function transactionDone(transaction) {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error || new Error("IndexedDB transaction aborted."));
  });
}

function stableJson(value) {
  if (Array.isArray(value)) {
    return `[${value.map((item) => stableJson(item)).join(",")}]`;
  }

  if (value && typeof value === "object") {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${stableJson(value[key])}`)
      .join(",")}}`;
  }

  return JSON.stringify(value);
}

async function sha256(value) {
  const input = new TextEncoder().encode(String(value));
  if (globalThis.crypto?.subtle) {
    const hash = await globalThis.crypto.subtle.digest("SHA-256", input);
    return Array.from(new Uint8Array(hash))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  }

  let hash = 0;
  const text = String(value);
  for (let index = 0; index < text.length; index += 1) {
    hash = (hash << 5) - hash + text.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(8, "0");
}

export async function deriveOfflineIdempotencyKey(eventType, stableParts) {
  if (!VALID_EVENT_TYPES.has(eventType)) {
    throw new Error(`Unsupported offline event type: ${eventType}`);
  }

  if (!stableParts || typeof stableParts !== "object" || Array.isArray(stableParts)) {
    throw new Error("stableParts must be an object tied to the user's logical action.");
  }

  const hash = await sha256(stableJson({ eventType, stableParts }));
  return `${eventType}:${hash.slice(0, 40)}`;
}

export async function openOfflineQueueDB() {
  return openKopanoVaultDB();
}

async function appendAudit(db, entry) {
  const transaction = db.transaction(STORES.AUDIT, "readwrite");
  transaction.objectStore(STORES.AUDIT).add({
    ...entry,
    at: Date.now(),
  });
  await transactionDone(transaction);
}

async function putQueueRecord(db, record, auditEntry) {
  const transaction = db.transaction([STORES.QUEUE, STORES.AUDIT], "readwrite");
  transaction.objectStore(STORES.QUEUE).put(record);
  if (auditEntry) {
    transaction.objectStore(STORES.AUDIT).add({
      ...auditEntry,
      at: Date.now(),
    });
  }
  await transactionDone(transaction);
}

export async function enqueueOfflineEvent({ eventType, payload, idempotencyKey, syncUrl = DEFAULT_SYNC_URL }) {
  if (!VALID_EVENT_TYPES.has(eventType)) {
    throw new Error(`Unsupported offline event type: ${eventType}`);
  }

  if (!idempotencyKey || typeof idempotencyKey !== "string") {
    throw new Error("A stable idempotencyKey is required for offline events.");
  }

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new Error("Offline event payload must be an object.");
  }

  const db = await openOfflineQueueDB();
  const now = Date.now();
  const record = {
    idempotency_key: idempotencyKey,
    event_type: eventType,
    payload,
    status: "PENDING",
    retry_count: 0,
    created_at: now,
    updated_at: now,
    next_retry_at: now,
    last_error: null,
    sync_url: syncUrl,
  };

  await putQueueRecord(db, record, {
    type: "enqueue",
    idempotency_key: idempotencyKey,
    event_type: eventType,
  });

  window.dispatchEvent(new CustomEvent("kopano:degraded-mode", { detail: record }));
  return record;
}

async function readQueueRecords(db) {
  const transaction = db.transaction(STORES.QUEUE, "readonly");
  const request = transaction.objectStore(STORES.QUEUE).getAll();
  const records = await requestResult(request);
  await transactionDone(transaction);
  return Array.isArray(records) ? records : [];
}

function retryDelay(retryCount) {
  const base = Math.min(60_000, 1000 * 2 ** Math.max(0, retryCount));
  return base + Math.floor(Math.random() * 750);
}

async function markRecord(db, record, patch, auditType) {
  const updated = {
    ...record,
    ...patch,
    updated_at: Date.now(),
  };

  await putQueueRecord(db, updated, {
    type: auditType,
    idempotency_key: record.idempotency_key,
    event_type: record.event_type,
    status: updated.status,
    retry_count: updated.retry_count,
    last_error: updated.last_error || null,
  });

  return updated;
}

async function deleteRecord(db, record) {
  const transaction = db.transaction([STORES.QUEUE, STORES.AUDIT], "readwrite");
  transaction.objectStore(STORES.QUEUE).delete(record.idempotency_key);
  transaction.objectStore(STORES.AUDIT).add({
    type: "sync_success",
    idempotency_key: record.idempotency_key,
    event_type: record.event_type,
    at: Date.now(),
  });
  await transactionDone(transaction);
}

export async function processOfflineQueue({ syncUrl = DEFAULT_SYNC_URL, batchSize = 10 } = {}) {
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    return { attempted: 0, synced: 0, deferred: true };
  }

  const db = await openOfflineQueueDB();
  const now = Date.now();
  const records = (await readQueueRecords(db))
    .filter((record) => !["CONFLICT", "DEAD_LETTER", "RESOLVED"].includes(record.status))
    .filter((record) => !record.next_retry_at || record.next_retry_at <= now)
    .slice(0, batchSize);

  let synced = 0;

  for (const record of records) {
    if (record.retry_count >= MAX_RETRIES) {
      await markRecord(
        db,
        record,
        { status: "DEAD_LETTER", last_error: "Retry limit reached." },
        "dead_letter",
      );
      continue;
    }

    const syncTarget = record.sync_url || syncUrl;
    const syncingRecord = await markRecord(db, record, { status: "SYNCING" }, "sync_start");

    try {
      const response = await fetch(syncTarget, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Idempotency-Key": record.idempotency_key,
        },
        body: JSON.stringify({
          event_type: record.event_type,
          payload: record.payload,
          retry_count: record.retry_count,
          created_at: record.created_at,
          updated_at: record.updated_at,
        }),
      });

      if (response.ok) {
        await deleteRecord(db, syncingRecord);
        synced += 1;
        continue;
      }

      let errorBody = "";
      try {
        errorBody = JSON.stringify(await response.json()).slice(0, 500);
      } catch {
        errorBody = `HTTP ${response.status}`;
      }

      if (response.status === 409) {
        await markRecord(
          db,
          syncingRecord,
          { status: "CONFLICT", last_error: errorBody },
          "conflict",
        );
      } else if (response.status === 400) {
        await markRecord(
          db,
          syncingRecord,
          { status: "DEAD_LETTER", last_error: errorBody },
          "dead_letter",
        );
      } else {
        const retryCount = syncingRecord.retry_count + 1;
        await markRecord(
          db,
          syncingRecord,
          {
            status: "PENDING",
            retry_count: retryCount,
            next_retry_at: Date.now() + retryDelay(retryCount),
            last_error: errorBody,
          },
          "retry_scheduled",
        );
      }
    } catch (error) {
      const retryCount = syncingRecord.retry_count + 1;
      await markRecord(
        db,
        syncingRecord,
        {
          status: "PENDING",
          retry_count: retryCount,
          next_retry_at: Date.now() + retryDelay(retryCount),
          last_error: error?.message || "Network sync failed.",
        },
        "retry_scheduled",
      );
    }
  }

  await appendAudit(db, {
    type: "sync_pass",
    attempted: records.length,
    synced,
  });

  return { attempted: records.length, synced, deferred: false };
}

export async function getOfflineQueueSnapshot() {
  const db = await openOfflineQueueDB();
  const records = await readQueueRecords(db);
  const counts = records.reduce(
    (acc, record) => {
      acc.total += 1;
      acc[record.status] = (acc[record.status] || 0) + 1;
      return acc;
    },
    { total: 0 },
  );

  return {
    counts,
    records,
  };
}
