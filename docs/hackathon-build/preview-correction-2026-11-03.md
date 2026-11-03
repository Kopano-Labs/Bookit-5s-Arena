# Bookit preview correction and runtime receipt — 3 November 2026

## Owner feedback

The owner rejected a preview where four court photographs were given identical booking buttons, all leading to `/book`, which then said the courts were not online. The gallery and booking handoff made an empty database look like an incomplete but usable booking path. That presentation was wrong.

## Recovered source and deployment evidence

- Issue: [Kopano-Labs/Bookit-5s-Arena #42](https://github.com/Kopano-Labs/Bookit-5s-Arena/issues/42).
- The Codex native booking branch already published as PR #51 was `codex/native-booking-flow`, commit `385c0a6fb85a75f9c24e83f2b3d443fa3f044cfb`.
- The current repair source is draft PR #55, branch `forge/native-bookit-recovery-20261102`, based on that native branch. This recovery consolidates the relevant saved October checkpoint; it is not proof that it matches the owner’s current Windows worktree.
- The 2 November Vercel email’s deployment was Dependabot commit `26f55c2`, not the native repair. The repaired candidate deployment previously inspected was `dpl_Bya8eQAMHpYrfCRbRb1ggUepaWHC`.
- In the preview that was inspected, `/api/courts` returned HTTP 200 and an empty list with `database-empty`. `/book` displayed “Courts are not online yet”. No reservation or operator-side saved booking was produced.
- The local source now available here is the previously published Codex recovery checkpoint at `373065f48b083ace004fde34064d99a4219a6ba5`, plus the correction in this document. It does not establish that this is the exact contents of the owner's Windows worktree.
- Four local image assets are presentation-only. No confirmed mapping from those photographs to current Mongo court IDs, rates, operating hours, ownership, or current offline reservations has been recovered. Existing historical data is not authority to seed or mutate live inventory.

## Correction in this candidate

- Gallery photos no longer receive synthetic database IDs, `/book` URLs, availability claims, date/price prompts, or “check booking” buttons.
- Homepage inventory/rate summary now says “UNAVAILABLE” and “NOT VERIFIED” when its database feed is unavailable, instead of telling the customer to “CHECK LIVE” or “CHECK BOOKING”.
- Empty inventory is described as an unavailable live booking path. `/book` no longer repeats the gallery.
- Setmore and WhatsApp are one collapsed “Booking help” element at the end of the court presentation and once on `/book`.
- Added `scripts/inspect-bookit-inventory.mjs`, a read-only check for database target fingerprint, replica-set topology, court/booking/slot-claim counts, sanitized current court fields and court indexes. It does not load dotenv or issue a write. It must only be run with the explicitly selected intended environment URI; compare the fingerprint to the intended target before acting on records.

## Verification boundary

Local verification on 3 November 2026: 14 focused unit tests pass, `npm run typecheck` passes, targeted ESLint passes, and `npm run build` completes. Build logs retain the expected missing MongoDB configuration diagnostic during homepage generation. A local production-server HTTP smoke returned 200 for `/` and `/book`; the homepage rendered the four original court photo names twice (responsive desktop/mobile copies), zero booking links inside the court gallery, no “CHECK BOOKING” text, one Setmore link, and an unavailable court feed. `/book` rendered no repeated gallery, one booking-help disclosure and one Setmore link; without a configured local database URI it rendered “Booking is temporarily unavailable”. This is local presentation evidence only. The local server had no MongoDB URI, so this does not establish current Vercel behavior, inventory, booking persistence, operator retrieval, or message delivery.

A deployed preview HTTP response is runtime evidence only for the pages and APIs actually exercised. Neither local rendering nor deployment metadata proves a successful customer-to-operator booking journey.

Acceptance requires all of the following receipts against the intended preview and verified isolated data target:

1. Inventory contains real court documents whose IDs, image mapping, rates, hours and owner match an authorized venue source.
2. A customer selects one of those real IDs and valid availability, submits once, and receives a server-issued reservation reference.
3. Repeating the same request does not create another booking; an overlapping request is rejected.
4. The resulting reservation is retrieved from the authenticated operator view with the same reference, court, time, amount and status.
5. Customer and venue receipts are emitted and identify that same persisted reservation; delivery status is evidenced separately from template generation.

Do not mark empty inventory, Setmore availability, seeded sample data, build metadata, deployment-ready status, or static UI rendering as a passed native booking flow. No production cutover, live inventory write, or customer message is authorized by this receipt.
