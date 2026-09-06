# Five's Arena Adaptive Progressive Updates → #NB → CRUD → SWFUS

**Status:** application adapter / non-authoritative synchronization surface. Proof may advance only through consequences actually evidenced.
**KPGS authority:** `RobynAwesome/Introduction-to-MCP` current `master`.
**Canonical contract:** `governance/kpgs-vnext/progressive-updates/README.md`.
**Canonical machine schema:** `governance/kpgs-vnext/progressive-updates/progressive-update.schema.json`.
**Canonical runtime:** `kopano-core/kopano/swfus_engine.py`.

Five's Arena preserves its existing APWA lifecycle while adapting its mutation path to the current KPGS vNext contract.

```text
LIVE / VIRTUAL USER ACTION
        ↓
Five's Arena APU adapter
S1_IMPLEMENTED
        ↓
IndexedDB persistence consequence
S2_POC
        ↓
kpgs.progressive-update.v1
        ↓
#NB
        ↓
bounded CRUD projection
        ↓
SWFUS
State-Wide Framework Universal Synchronization
        ↓
kpgs.swfus.receipt.v1
        ↓
Five's Arena S3_SYNCED
```

`#NB` is the literal operator boundary marker defined by the canonical contract. This adapter does not invent an expansion for it.

## Canonical law

> **CRUD changes bounded state. SWFUS aligns governed system reality. Synchronization is not authority.**

Five's Arena therefore treats the synchronized Mongo projection as **non-authoritative application state**, never as canonical booking, payment, account, authentication, or governance truth.

## Adapter lifecycle

The existing Five's Arena adapter stages remain:

```text
S0_CONCEPT
  ↓
S1_IMPLEMENTED
  ↓
S2_POC
  ↓
S3_SYNCED
  ↓
S4_PSO
  ↓
S5_GOVERNED
```

The application currently proves only the `S1 → S2 → S3` slice. `S4_PSO` and `S5_GOVERNED` require separate evidence and are never manufactured by `/api/v1/sync`.

At `S1_IMPLEMENTED`, the browser holds a `progressive_draft`; it does **not** prematurely claim a canonical mutating `kpgs.progressive-update.v1`, because the canonical mutation schema itself requires POC evidence.

A successful IndexedDB queue transaction creates the POC receipt and materializes the canonical progressive update at `S2_POC` with:

- `poc_validated=true`;
- `foc_detected=false`;
- at least one evidence reference;
- `authority_effect="none"`;
- an admitted non-authoritative state class;
- the literal `#NB` boundary marker;
- the exact queue idempotency identity and payload.

## Canonical S2 → S3 path

`POST /api/v1/sync` accepts an APU envelope at `S2_POC`, requires the embedded progressive update idempotency key to match `X-Idempotency-Key`, and runs the mutation through the canonical ordering:

```text
1. TELEMETRY
2. CLASSIFICATION
3. ROUTING
4. PROTOCOL_SELECTION
5. INVARIANT_AUDIT
6. POC_FOC_CHECK
7. STATE_UPDATE
8. DISTRIBUTION
```

A `YELLOW` update is held before mutation. A rejected/FOC update cannot reach state update or distribution. A stale `expected_version` is held instead of overwriting the current projection. `CREATE`, `UPDATE`, and `DELETE` operate only against `SwfusProjection`, whose admitted state classes are `non_authoritative`, `derived_projection`, or `pending_proposal`.

Only an `APPLIED` canonical receipt with `synchronized=true` can promote the Five's Arena envelope to `S3_SYNCED`. Server persistence by itself is not enough.

## Live / virtual adaptation

The Living Organism APWA runtime may continue adapting presentation, connectivity behavior, compute/immersion lane, and offline interaction while a user is operating under degraded or changing conditions. That adaptive surface remains separate from mutation authority.

```text
USER CONTINUES INTERACTING
        ↓
local APWA projection / offline queue
        ↓
connectivity returns
        ↓
exact idempotent S2 proposal replayed
        ↓
#NB + governed CRUD membrane
        ↓
SWFUS alignment receipt
        ↓
UI may consume the synchronized projection as a live virtual view
```

Web transport, browser persistence, MongoDB, WebSocket/SSE or any future realtime layer can carry evidence and projections; none can widen the authority of the admitted update.

## Projection and rollback boundary

`models/SwfusProjection.js` is intentionally a bounded projection store. It is not canonical domain ownership.

The server evaluates the progressive update first, then applies the admitted projection using optimistic version matching. The synchronization event and receipt are persisted beside the offline event. If event/distribution evidence persistence fails after projection application, the adapter performs a compensating rollback so the local projection does not claim a synchronization consequence that was not durably recorded.

This is a bounded application consistency mechanism. It is **not** a claim of distributed consensus or cross-provider ACID semantics.

## Idempotency

The existing HTTP idempotency contract remains authoritative for this endpoint:

- same key + same exact content → replay existing receipt/evidence;
- same key + different content → `409 CONFLICT`;
- progressive update idempotency identity must match the HTTP key;
- browser queue deletion requires the matching `update_id`, `S3_SYNCED`, and an `APPLIED` synchronized canonical SWFUS receipt.

## Backwards compatibility

The HTTP APU envelope remains optional. Existing direct clients without APU data keep the previous event-only synchronization path. New browser queue writes use the progressive path by default.

Legacy persisted APU envelopes that already reached `S2_POC` can be adapted into the canonical progressive-update surface using their existing POC receipt as migration evidence. Legacy evidence is not promoted beyond what it actually proves.

## What S3 proves

`S3_SYNCED` proves that the exact POC-admitted progressive proposal passed the Five's Arena #NB/CRUD/SWFUS adapter, produced an `APPLIED` synchronization receipt, and updated the bounded non-authoritative projection.

It does **not** prove canonical booking truth, payment settlement, provider acceptance, PSO operationalization, KPGS governance promotion, or production-readiness of unrelated functionality.

## Hard laws

```text
IMPLEMENTED != POC
POC != SYNCED
S1 DRAFT != CANONICAL MUTATING PROGRESSIVE UPDATE
S3 REQUIRES APPLIED kpgs.swfus.receipt.v1
YELLOW => HOLD BEFORE MUTATION
RED / FOC => NO MUTATION OR DISTRIBUTION
STALE EXPECTED_VERSION => HOLD
DISTRIBUTION FAILURE => ROLLBACK PROJECTION
SYNCED != CANONICAL DOMAIN TRUTH
SYNCED != PSO
SYNCED != GOVERNED
TRANSPORT != AUTHORITY
CLIENT MAY NOT SELF-CLAIM S3_SYNCED
IDEMPOTENCY KEY REUSE WITH DIFFERENT CONTENT => CONFLICT
OLD SERVER RESPONSE WITHOUT APPLIED SWFUS RECEIPT => NO APU QUEUE DELETION
```
