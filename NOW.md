# Bookit correction handoff — 3 November 2026

Owner rejected the current candidate preview: gallery photo cards looked bookable even though `/api/courts` returned an empty inventory and `/book` could not proceed. The preview was misleading. Do not present deployment-ready metadata as a completed booking path.

The correction is published to draft PR #55 at commit `91c50703a9f6e0891be034878b165fa46814fe02`, based on the recovered native Codex branch. The Vercel preview for that exact commit reached READY. Its gallery photos have no synthetic database IDs or fake booking links; live court records alone carry native booking actions and their stored address. The empty `/book` state no longer duplicates the photo gallery.

Local verification on 3 November: 14 focused unit tests, TypeScript, targeted ESLint and production build pass. The production build reports its expected missing MongoDB configuration diagnostic at homepage generation. Local production-server HTTP returned 200 for `/` and `/book`; it showed the four original court photo names, no booking links inside the gallery, no “CHECK BOOKING” text, and one Setmore fallback per page. `/book` showed “Booking is temporarily unavailable” because this local process had no MongoDB URI. This verifies the corrected presentation only.

Runtime receipt for preview alias `https://bookit-5s-arena-git-forge-native-c6ebd3-robynawesomes-projects.vercel.app`, deployment `dpl_GDEUvfTXJsceRd7jsskH5opajmUz`, commit `91c5070`: homepage and `/book` return 200; homepage renders the four original court photos, no card booking links or “CHECK BOOKING” text, one Setmore link and one booking-help disclosure. `/book` renders “Online booking is not available yet”, no gallery, one Setmore link and one booking-help disclosure. `GET /api/courts` returns 200 with `[]` and `database-empty`; valid-date availability returns 200 with no courts; impossible date returns 400; unauthenticated `GET /api/admin/bookings` returns 401. No reservation submission was made because the preview has no court ID to select. No saved operator booking or delivery receipt exists.

Google Contacts returned no matching Five's Arena contact. The current public Arena page lists WhatsApp `063 782 0245` and `fivearena@gmail.com`; no message was sent. Do not claim a native journey pass without real intended court records, an idempotent customer reservation, an authenticated operator retrieval with matching fields, and evidence of both customer and venue delivery. No production cutover, live inventory write, sample seed, or external customer message.

Read-only inventory preflight: `node scripts/inspect-bookit-inventory.mjs`. It uses only the explicitly provided process environment URI, issues reads only, prints no credentials/raw owner ID/guest booking data, and refuses to connect if none is configured. Do not run it on an unverified production target.

---

# Native Bookit recovery — 2 November 2026

Owner direction: finish the native Bookit system rebuilt after Setmore, preserving the native redesign and arena operations backend. This candidate restores the later October repair checkpoint onto PR #51's published base, rather than starting another booking UI.

Actor: Codex Forge, stateless renter in the owner-directed repair task. `I_AM_STATELESS_RENTER_NOT_LANDLORD`.

Recovered input: published native head `385c0a6fb85a75f9c24e83f2b3d443fa3f044cfb` plus the October 26 evidence packet's relevant patch and four new source files. Packet SHA-256: `443dad2cdd835a229fed80773693260283041a0f9cba6085a3205632dd734bb5`. All 33 manifest entries were checked. This reconstructs that preserved checkpoint; it does not establish the present contents of the owner's Windows worktree.

Implemented candidate: canonical court creation; real calendar and Johannesburg-time validation; safe booking responses; principal/payload-bound retry identities; transactional booking plus hourly claims and revision-guarded edits; transactional cancellation, reactivation and payment state; recovered arena scoping and native UI continuity.

Validation: 11 focused date/court/security tests pass locally; TypeScript check passes; production build passes (expected missing-DB diagnostic in this unconfigured checkout). Local MongoDB replica-set integration could not start: MongoDB reports `open: Operation not permitted` in this execution environment. No database integration pass is claimed. A dedicated hosted native regression workflow exercises actual HTTP routes and a disposable MongoDB replica set, including operator inventory, concurrent overlap/edit, replay security and cancel/rebook/reactivation.

Next: inspect hosted checks on the published candidate, repair failures, then review the native preview and intended production data mapping. Existing court records, owner IDs, hours/rates and historical reservations still require reconciliation before live activation. Never invent live courts or silently mutate legacy indexes. MongoDB transactions require a replica set; unavailable transactions return a service error rather than a weaker write path. No merge, production migration, inventory seed or customer message has been performed by this recovery.

Final local checks at implementation commit `21373d96c71418b6a8b5249b38afed1ebb0aa774`: 11/11 focused tests, typecheck, targeted backend ESLint (zero warnings/errors), public-surface validation and production build passed. The missing MongoDB configuration diagnostic during homepage generation is preserved; this is not live inventory proof. Database regression could not start because local mongod reports `open: Operation not permitted`; it is not counted as passed.

Publication boundary: automatic approval review rejected the push to `Kopano-Labs/Bookit-5s-Arena`, stating that explicit authorization for uploading source to that destination was missing. No remote recovery branch was found in the subsequent read-only check. Do not bypass that rejection through a different upload tool. Present the locally committed candidate and patch for explicit approval of that destination and draft PR; then run the hosted regression workflow. The production release gate remains separate.


Owner clarification: restore the four original court photographs/cards and native booking as the primary path; retain Setmore as a backup because the venue reports increased bookings and receives its booking emails. The candidate now preserves photo presentation even without database inventory, while only live court records supply booking IDs/prices. Bookit customer and venue email paths are separate revisioned records; the operator communications endpoint is tenant-scoped. Signed-in customer notices now recover account contact details. Metadata inspection found Resend/Gmail credentials but no BOOKING_COMMUNICATIONS_ENABLED or BOOKING_BUSINESS_EMAIL/BUSINESS_EMAIL settings; values were not decrypted and no real test message was sent. Configuration and external inbox delivery are still unverified.

The owner explicitly authorized branch publication and a draft PR. Shell Git push could not authenticate. The connected GitHub service successfully created the recovery branch from the native base; publication continues through that authorized service. This supersedes the earlier publication block only; production activation is still separate.
