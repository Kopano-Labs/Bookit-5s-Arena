"use client";

export const VAULT_DB_NAME = "kopano_vault";
export const VAULT_DB_VERSION = 3;

export const VAULT_STORES = {
  QUEUE: "mobile_broadcast_queue",
  AUDIT: "local_audit_trail",
  FIXTURES_SNAPSHOTS: "fixtures_snapshots",
  VAULT_STATE: "vault_state",
};

function assertIndexedDB() {
  if (typeof window === "undefined" || !window.indexedDB) {
    throw new Error("IndexedDB is not available in this runtime.");
  }
}

function ensureQueueStore(db, transaction) {
  let queue;
  if (!db.objectStoreNames.contains(VAULT_STORES.QUEUE)) {
    queue = db.createObjectStore(VAULT_STORES.QUEUE, { keyPath: "idempotency_key" });
  } else {
    queue = transaction.objectStore(VAULT_STORES.QUEUE);
  }

  if (!queue.indexNames.contains("status")) {
    queue.createIndex("status", "status", { unique: false });
  }
  if (!queue.indexNames.contains("next_retry_at")) {
    queue.createIndex("next_retry_at", "next_retry_at", { unique: false });
  }
  if (!queue.indexNames.contains("event_type")) {
    queue.createIndex("event_type", "event_type", { unique: false });
  }
}

function ensureAuditStore(db) {
  if (!db.objectStoreNames.contains(VAULT_STORES.AUDIT)) {
    db.createObjectStore(VAULT_STORES.AUDIT, { keyPath: "id", autoIncrement: true });
  }
}

function ensureFixturesStores(db) {
  if (!db.objectStoreNames.contains(VAULT_STORES.FIXTURES_SNAPSHOTS)) {
    const store = db.createObjectStore(VAULT_STORES.FIXTURES_SNAPSHOTS, { keyPath: "cacheKey" });
    store.createIndex("leagueSlug", "leagueSlug", { unique: false });
    store.createIndex("resource", "resource", { unique: false });
    store.createIndex("lastUpdated", "lastUpdated", { unique: false });
  }

  if (!db.objectStoreNames.contains(VAULT_STORES.VAULT_STATE)) {
    db.createObjectStore(VAULT_STORES.VAULT_STATE, { keyPath: "key" });
  }
}

export async function openKopanoVaultDB() {
  assertIndexedDB();

  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(VAULT_DB_NAME, VAULT_DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = request.result;
      const transaction = event.target.transaction;
      ensureQueueStore(db, transaction);
      ensureAuditStore(db);
      ensureFixturesStores(db);
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
