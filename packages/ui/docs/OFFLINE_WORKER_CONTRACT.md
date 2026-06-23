---
title: KasiLink Offline Worker Contract
created: 2026-05-11
status: implementation-seed
---

# KasiLink Offline Worker Contract

**Database:** `kopano_vault` (IndexedDB)

**Core stores**

1. `mobile_broadcast_queue` (primary key: `idempotency_key`)
2. `local_audit_trail` (primary key: `id`, auto-increment)

**Event types:** `booking`, `payment`, `check-in`, `broadcast`, `testimony`, `admin-audit`

## Execution rules

- **Idempotency:** Every event must generate a unique key (`${eventType}_${timestamp}_${hash}`) to prevent double-charging or duplicate bookings during intermittent connectivity.
- **Sync logic:** The worker listens for the window `online` event. It flushes the queue to `/api/v1/sync` with the `X-Idempotency-Key` header.
- **Conflict & dead-letter:** `409` responses update the record status to `CONFLICT` for manual resolution. Payloads with `retry_count > 5` are dead-lettered.

## Grounded Truth addendum (implementation)

The `${eventType}_${timestamp}_${hash}` pattern is **unique per enqueue** but **not stable across retries** of the *same* user intent. For production, prefer a **stable** idempotency key derived from business identity (or server-issued draft id) so replays after a dropped connection do not create duplicate server-side effects. Keep this contract’s headers and store names; tighten the key rule at implementation time.

## 2026-05-13 implementation seed

Bookit now has a bounded implementation slice:

1. `app/api/v1/sync/route.js` accepts queue drains, validates `event_type`, requires `X-Idempotency-Key`, persists accepted events in MongoDB, and returns `409` when the same key is reused for different content.
2. `models/OfflineSyncEvent.js` stores the durable server-side inbox. It is an inbox, not full booking/payment execution.
3. `lib/offline/kopanoOfflineQueue.js` implements the browser `kopano_vault` IndexedDB queue and audit trail.
4. `hooks/useOfflineQueue.js`, `packages/ui/src/OfflineBanner.jsx`, and `packages/ui/src/PendingSyncBadge.jsx` expose degraded-mode UX and retry plumbing.
5. `components/BookingForm.jsx` saves a dry-run offline booking intent when the booking request cannot reach the server. The UI states that no court slot is held until sync and staff confirmation.
6. `npm run validate:offline-sync` runs the dry-run route matrix against a local dev server and cleans local probe rows afterward.

Owner-proof remains pending until a real offline booking/payment flow is physically tested on mobile and staff confirms the synced action. The current booking-form enqueue path is intentionally a safe offline intent, not a guaranteed booking.

## Degraded-mode UX (IONS — `packages/ui`)

Map into the shared IONS UI package:

1. **Global Offline Banner:** Fixed top banner, Savanna Gold (`#F5A623`), when `navigator.onLine === false`. Copy: *Offline Mode: Actions saved locally.*
2. **Pending Sync Badges:** For rows backed by `mobile_broadcast_queue`, pulsing Terminal Mint (`#00E676`) dot; copy: *Syncing when online*.
3. **Idempotency locks:** After enqueue, `SharedButton` disables and label becomes *Saved to Queue* to prevent panic-tapping.

## Preflight gate

Before implementation edits under `apps/bookit` or `packages/ui`, run from repo root:

```bash
git status --short --branch
git diff --stat
```

Paste output for overhead classification. No writes to hot paths without that diff review.
