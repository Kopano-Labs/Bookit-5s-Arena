"use client";

import { openKopanoVaultDB, VAULT_STORES } from "@/lib/offline/kopanoVaultDb";

const VAULT_STATE_KEY = "kopano_vault_state";
const MAX_OFFLINE_RECEIPTS = 40;

const VALID_RESOURCES = new Set(["meta", "matches", "featured", "standings", "stats", "news"]);

function transactionDone(transaction) {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error || new Error("IndexedDB transaction aborted."));
  });
}

function requestResult(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export function fixturesCacheKey(leagueSlug, resource, season) {
  const seasonPart = season == null ? "current" : String(season);
  return `football:${leagueSlug || "global"}:${resource}:${seasonPart}`;
}

export function validateFixturesSnapshot(snapshot) {
  if (!snapshot || typeof snapshot !== "object") {
    return false;
  }
  if (!snapshot.cacheKey || typeof snapshot.cacheKey !== "string") {
    return false;
  }
  if (!VALID_RESOURCES.has(snapshot.resource)) {
    return false;
  }
  if (!snapshot.payload || typeof snapshot.payload !== "object" || Array.isArray(snapshot.payload)) {
    return false;
  }
  if (typeof snapshot.lastUpdated !== "number" || typeof snapshot.staleAfterMs !== "number") {
    return false;
  }
  return true;
}

export function isSnapshotStale(snapshot, now = Date.now()) {
  if (!snapshot) return true;
  return now - snapshot.lastUpdated > snapshot.staleAfterMs;
}

export async function readFixturesSnapshot(cacheKey) {
  const db = await openKopanoVaultDB();
  const transaction = db.transaction(VAULT_STORES.FIXTURES_SNAPSHOTS, "readonly");
  const snapshot = await requestResult(
    transaction.objectStore(VAULT_STORES.FIXTURES_SNAPSHOTS).get(cacheKey),
  );
  await transactionDone(transaction);
  return validateFixturesSnapshot(snapshot) ? snapshot : null;
}

async function readVaultState(db) {
  const transaction = db.transaction(VAULT_STORES.VAULT_STATE, "readonly");
  const state = await requestResult(transaction.objectStore(VAULT_STORES.VAULT_STATE).get(VAULT_STATE_KEY));
  await transactionDone(transaction);
  return (
    state?.value || {
      lastSync: 0,
      blackboxMaskState: {},
      userPicks: {},
      offlineReceipts: [],
    }
  );
}

async function writeVaultState(db, value) {
  const transaction = db.transaction(VAULT_STORES.VAULT_STATE, "readwrite");
  transaction.objectStore(VAULT_STORES.VAULT_STATE).put({
    key: VAULT_STATE_KEY,
    value,
    updatedAt: Date.now(),
  });
  await transactionDone(transaction);
}

export async function appendOfflineReceipt(receipt) {
  const db = await openKopanoVaultDB();
  const state = await readVaultState(db);
  const offlineReceipts = [
    { at: Date.now(), ...receipt },
    ...(Array.isArray(state.offlineReceipts) ? state.offlineReceipts : []),
  ].slice(0, MAX_OFFLINE_RECEIPTS);

  await writeVaultState(db, {
    ...state,
    lastSync: Date.now(),
    offlineReceipts,
  });
}

export async function writeFixturesSnapshot(snapshot) {
  if (!validateFixturesSnapshot(snapshot)) {
    throw new Error("Invalid fixtures snapshot — sim.schema.json contract violated.");
  }

  const db = await openKopanoVaultDB();
  const transaction = db.transaction(
    [VAULT_STORES.FIXTURES_SNAPSHOTS, VAULT_STORES.VAULT_STATE],
    "readwrite",
  );
  const stateStore = transaction.objectStore(VAULT_STORES.VAULT_STATE);
  const existingState = await requestResult(stateStore.get(VAULT_STATE_KEY));
  const nextState = {
    ...(existingState?.value || {
      blackboxMaskState: {},
      userPicks: {},
      offlineReceipts: [],
    }),
    lastSync: Date.now(),
  };

  transaction.objectStore(VAULT_STORES.FIXTURES_SNAPSHOTS).put(snapshot);
  stateStore.put({
    key: VAULT_STATE_KEY,
    value: nextState,
    updatedAt: Date.now(),
  });
  await transactionDone(transaction);
  return snapshot;
}
