# Five's Arena Adaptive Progressive Update → SWFUS Contract

**Status:** implementation slice; proof may advance only through the stage actually evidenced.  
**KPGS authority:** `RobynAwesome/Introduction-to-MCP` / `Kopano-Labs/Introduction-to-MCP` guidance.  
**Canonical APU source:** `kopano-core/kopano/apu_vector_matrix.py`.  
**Canonical synchronization source:** `kopano-core/kopano/swfus_engine.py`.

## Canonical lifecycle preserved

```text
S0_CONCEPT
  ↓
S1_IMPLEMENTED   ← CRUD capability exists
  ↓
S2_POC           ← executable local consequence is persisted
  ↓
S3_SYNCED        ← SWFUS/server synchronization consequence is observed
  ↓
S4_PSO
  ↓
S5_GOVERNED
```

Five's Arena does **not** rename or collapse these stages. The application adapter is intentionally bounded to `S1 → S2 → S3`.

`S4_PSO` and `S5_GOVERNED` require separate evidence and are not emitted by `/api/v1/sync`.

## Why this sits beside the Living Organism APWA work

The existing Living Organism runtime adapts presentation and compute to the current session: province context, data truth, weather, football readiness, and the `full | balanced | lite | static` immersive lane.

Adaptive Progressive Update governance solves a different problem: **how a mutation survives degraded connectivity and proves its own progression without being silently promoted.**

```text
LIVE USER ACTION
    ↓
APU S1_IMPLEMENTED
    ↓
CRUD / local deterministic mutation semantics
    ↓
IndexedDB queue transaction
    ↓
APU S2_POC receipt
    ↓
existing /api/v1/sync transport
    ↓
server idempotency + exact-content hash
    ↓
SWFUS persistence receipt
    ↓
APU S3_SYNCED
```

The adaptive scene never receives authority over booking, payment, account, authentication, or administrative mutations.

## Five's Arena APU envelope

Schema: `fivesarena.apu.progressive-update.v1`

```json
{
  "schema": "fivesarena.apu.progressive-update.v1",
  "update_id": "booking:apu:example-001",
  "resource": "booking",
  "resource_id": "booking-001",
  "operation": "update",
  "base_version": 4,
  "stage": "S1_IMPLEMENTED",
  "receipts": []
}
```

CRUD operations are `create | read | update | delete`.

`base_version` is carried as provenance for resource-specific adapters. The generic sync endpoint does **not** claim that it has performed optimistic domain-write conflict checking merely because this field exists. A future resource adapter must enforce that comparison before claiming domain mutation safety.

## Proof transitions

### `S1_IMPLEMENTED → S2_POC`

All **new browser-queued events** are progressively wrapped by `enqueueOfflineEvent()` by default. The queue derives a stable update identity from the existing event type + idempotency key and models the queued item as creation of a bounded `<event-type>-intent` resource.

A caller may supply a more specific S1 APU envelope when it has stronger resource semantics. Either way, the existing IndexedDB queue remains the only browser persistence mechanism; no second offline transport is created.

A successful queue transaction appends a `crud-local-persistence` receipt and stores the envelope at `S2_POC`.

### `S2_POC → S3_SYNCED`

`POST /api/v1/sync` accepts only `S2_POC` APU envelopes. It:

1. validates the APU schema and CRUD operation;
2. includes the exact APU envelope in the idempotency content hash;
3. preserves existing `X-Idempotency-Key` semantics;
4. persists the event and typed APU receipt;
5. appends a `swfus-server-persistence` receipt;
6. returns the server-authored `S3_SYNCED` envelope.

The browser queue refuses to delete an APU record unless the response contains a matching `update_id` at `S3_SYNCED`. This prevents an older or partially deployed sync endpoint from accidentally being interpreted as proof of synchronization.

## Backwards compatibility

The HTTP APU envelope remains optional so existing direct sync clients and already-persisted legacy events keep their prior behavior.

The browser migration is additive and forward-moving:

```text
legacy persisted/direct event without apu
    → existing sync behavior

new browser queue event
    → default S1 APU wrapper
    → IndexedDB S2 receipt
    → SWFUS S3 receipt

explicit APU-aware caller
    → caller-specific S1 resource semantics
    → IndexedDB S2 receipt
    → SWFUS S3 receipt
```

## What S3 proves — and what it does not

`S3_SYNCED` proves that the exact idempotent progressive-update proposal was persisted by the Five's Arena synchronization boundary.

It does **not** by itself prove:

- a domain booking/payment mutation was applied;
- a payment settled;
- a remote provider accepted a write;
- PSO operationalization completed;
- KPGS governance promotion completed.

Those consequences require their own adapters and receipts.

## Hard laws

```text
IMPLEMENTED != POC
POC != SYNCED
SYNCED != DOMAIN WRITE APPLIED
SYNCED != PSO
SYNCED != GOVERNED
CLIENT MAY NOT SELF-CLAIM S3_SYNCED
IDEMPOTENCY KEY REUSE WITH DIFFERENT CONTENT => CONFLICT
OLD SERVER RESPONSE WITHOUT APU RECEIPT => NO APU QUEUE DELETION
```
