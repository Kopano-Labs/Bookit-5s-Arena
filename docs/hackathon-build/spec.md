# Bookit implementation contract

Draft technical specification reconstructed for the requested checklist. Extend existing architecture: Next.js/React pages, native booking/availability APIs, Mongoose/MongoDB models and current operator pages. No provider or database replacement is implied.

## 1. Context and evidence

Preserve dirty source. Re-query GitHub/Vercel refs and recover applicable current instructions and #158/#42 disposition. Maintain evidence status: user-reported, reproduced, source-confirmed, inferred, unknown. Establish REA active tools separately from setup; declare permitted public runtime targets and redacted artifacts. Recover KPGS purpose/contracts and describe the smallest relevant integration, or record why no supported runtime task is yet defined.

## 2. Experience benchmark and site design

Use Product Design on actual Bookit, public Setmore booking and a small set of relevant competitors. Capture mobile/desktop entry, slot picking, contact, summary and error behavior. Produce a low-copy visual direction for the wider site, keeping booking prominent and other features discoverable. Use current real photos/assets and existing design identity. Measure choice count and task time; treat provider ease as client testimony until observed.

## 3. Database identity and history

Trace environment -> connectDB -> selected database -> Court/Booking writes -> reads -> admin display. Compare permitted identifiers/metadata without printing connection secrets. Determine whether local Atlas `test` is the production target or a different store; do not assume isolation from its name. Investigate prior history/data destinations and old repair branches before assigning a five-month cause. Establish a genuinely isolated sandbox. Prove an initial native write/read/reconnect/dashboard path there.

## 4. Inventory and migration

Reconcile data/courts.json with actual venue/provider inventory, owners, rates, operating hours and closures. Map physical court IDs to external service/calendar IDs. Prepare idempotent dry-run migration, backup/rollback, counts and readback; account for active Setmore/manual bookings before changing calendar authority. Import only with established data authority and access. A static fixture never becomes authoritative through display alone.

## 5. Reservation correctness

Share strict SAST date/time/duration rules and server prices across /api/availability, authenticated and guest create, edit, cancel, admin and payment callbacks. Implement a database-enforced interval/claim invariant appropriate to the existing Mongo deployment, with safe lifecycle transitions and retry identity. Inspect earlier slot-claim candidates before reusing them; a unique exact start index alone does not enforce all overlaps. Migrations must cover existing rows and rollback. Verify failed swaps leave the previous reservation valid.

## 6. Native booking interface

Rework PR #51 as a candidate, not accepted design. Native pitch images/selection, date/duration/time choices, total and minimal contact entry form one coherent flow. Fetch real availability and submit to native APIs; preserve selection, refresh on conflicts and handle ambiguous timeouts. Do not require an account for a supported guest booking. Remove Setmore customer handoffs when the native cutover is ready. No backend explanations in the customer UI.

## 7. Confirmation, customer management and payments

Return the persisted reference and server status/price. Implement secure guest management alongside signed-in management under one recovered policy. Trace communication from discovery/entry to customer confirmation and venue booking receipt; customer and venue notifications carry the same reference and actionable details. Track/resend confirmation and venue alerts through verified configured channels without turning delivery failure into duplicate booking; separate queued, sent, delivered and read evidence. Send change/cancel notices to both sides. Test only allowlisted sandbox recipients; no real client/customer messaging in verification under this scope. Use the actual venue payment policy. Online payment work, if required, runs in sandbox and has idempotent callbacks, late-event and refund/cancel handling.

## 8. Operator dashboard and retained data

Use the same database records in /admin/bookings and related existing pages. Support searchable booking/customer history, supported state changes and manual blocks. Prove public availability sees operator changes. Gate operator and customer access; no separate demo-only store or pageview count presented as a booking count.

## 9. Quality and recovery

Exercise errors, network loss, ambiguous commits, no inventory and outage states without false success. Audit PII access/logging/retention and secret handling. Measure responsive layouts, focus, keyboard, labels, contrast, motion and performance. Repair the known lint dependency failure deliberately; retain lockfile/reproducibility evidence. Keep automated test fixtures out of production stores.

## 10. Integrated proof

Use an isolated sandbox matrix: guest/account -> availability -> create -> fresh read -> dashboard -> restart/redeploy read -> retry -> competing booking -> reschedule -> cancel -> reopened slot. Include price and payment/notification behavior where configured. Capture redacted request/reference/row/dashboard identities and exact source revisions. Record manual checks that cannot be automated and remaining physical-device/accessibility limits.

## 11. Release and cutover

Continue under existing implementation/deployment authorization. Before enabling native bookings: verified inventory and active-reservation reconciliation, passed sandbox checks, relevant CI, exact PR head, rollback/migration plan and declared calendar authority. Obtain only approvals genuinely missing for a specific data/provider action, with its concrete plan. Deploy, read back alias/SHA, and run safe production read-only checks; no real booking or charge under this scope.

## 12. Delivery and consistency

Deliver client-facing before/after captures and a short working walkthrough plus operator instructions. Record test/preview/pushed/merged/deployed/production-verified states separately, issue disposition, relevant KPGS/REA receipts, unresolved findings and next owner/action. Apply CCP before the conclusion. This product's final handoff is to the client/operator; Devpost submission is not in scope.
