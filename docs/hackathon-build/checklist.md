# Bookit / FivesArena build checklist

Status: draft for scope gut-check, 20 October 2026. This is the execution contract for `$build-project`, adapted from the requested skill to an existing client product. Supporting requirements are in prd.md; architecture/verification boundaries are in spec.md.

## Build preferences

- **Planning:** delegated to Codex; recovered requests govern scope.
- **Build mode:** autonomous; carry supported repairs through to a working release without repeatedly asking what the owner wants.
- **Comprehension checks:** not applicable; this is product delivery, not a learning interview.
- **Git:** preserve the original dirty checkout; work in the attached clean worktree. Commit each meaningful verified slice; update the current PR or split materially different migrations when review/rollback needs it. No unrelated source cleanup or force-push.
- **Verification:** automated checks plus actual browser/API/database/dashboard/notification evidence. The owner explicitly chose **show the working visual flow before launch**. Present that review on a working sandbox flow with backend and communication evidence, not an empty page or a static mockup.
- **Check-ins:** brief findings/progress and concrete visuals at the review; no long tutorial commentary or repeated permission ceremonies.
- **Standout result:** customer books easily through a beautiful native Bookit experience; customer receives confirmation and next steps; venue receives the booking and can act on the same saved record.
- **Sizing:** these are 12 complete-scope work packages, not a claim that this whole repair takes six hours. Execute each in 15–30 minute verifiable slices and record follow-on work when a package is larger. Never mark a package done for completing only its first slice.
- **Authorization:** existing repair/deployment authorization persists. Sandbox transactions and allowlisted test recipients only. No real bookings/charges. Production data/provider actions require their concrete, source-backed plan and any genuinely missing authorization; continue independent work while a dependent action is held.
- **Baseline:** draft PR #51 / remote head `1c0d9fd9d21646835784db663508a038b6a38788` is a candidate, not completed native booking. Prior build/typecheck/preview receipts do not satisfy the checks below. Revalidate refs before execution.

## Checklist

- [ ] **1. Recover the current system and requested technical capabilities**
  Spec ref: `spec.md > 1. Context and evidence`
  What to build: Update the bounded context/evidence record from current instructions, deployment, issues, old repair candidates and receipts; preserve the original checkout. Inventory the intended coding-agent clients, verify the active REA connection, and recover relevant KPGS contracts/tasks. Retain prior setup approvals; show any materially new setup plan before executing it.
  Acceptance: R01/R02/R15. Verified source/deployed identities and evidence populations; no hotel-scope drift, stale parked-homepage override or unsupported REA/KPGS activation. Tools absent versus installed versus actively connected are distinct.
  Verify: Read `AGENTS.md`, current-state notes and referenced receipts; capture `git status --short --branch`, remotes, live PR/head and Vercel alias/SHA. Record a relevant connected REA call's evidence or the exact connection gap. Document the KPGS contract locator and bounded task, or hold only that integration if undefined.

- [ ] **2. Design the simpler visual website and full customer journey**
  Spec ref: `spec.md > 2. Experience benchmark and site design`
  What to build: Use Product Design to compare Bookit, Setmore and relevant competitors with real mobile/desktop captures. Design the homepage/entry, court/time selection, concise summary, contact, confirmation and recovery. Review the wider site for text overload and booking buried beneath secondary content; salvage useful visuals/assets and move secondary content appropriately.
  Acceptance: R03/R04/R05/R13. Image-led, engaging design, obvious booking start, short labels and one primary action per stage; no instructional wall or Setmore handoff. The design accounts for where the customer arrives and how they reach booking. Client testimony remains recorded as testimony.
  Verify: Save annotated before/after or candidate captures at 390x844 and 1440x900; inspect 360px too. Walk discovery through management; count choices/CTAs and identify absent steps. Compare actual interactions rather than search snippets alone. Record human visual acceptance at the prelaunch review, not at this research step.

- [ ] **3. Diagnose missing data and establish an isolated persistence proof**
  Spec ref: `spec.md > 3. Database identity and history`
  What to build: Trace actual configured database identity, current and historical write/read paths and admin data sources. Investigate the owner's five-month missing-data report without assuming today's iframe explains history. Establish an isolated sandbox and prove one native reservation can be written and read through the existing system.
  Acceptance: R07/R11/R12. Production and local `test` targets are either positively matched or explicitly distinct/unknown; no secret output. One sandbox reservation/customer record is retrieved by a fresh connection and visible in the real dashboard. No production transaction is used to obtain this proof.
  Verify: Inspect environment metadata/configuration without printing secrets; record redacted database/collection identity and counts. Submit a sandbox guest request, capture its native API result/reference, query that row with a fresh connection, and find the same reference in the operator view. Record the remaining historical-cause uncertainty.

- [ ] **4. Restore verified court inventory and reconcile existing reservations**
  Spec ref: `spec.md > 4. Inventory and migration`
  What to build: Recover real court names/IDs/owner/rates/hours/closures and map them against source seed candidates and Setmore/manual records. Prepare an idempotent inventory/import dry-run and rollback. Reconcile active reservations and declare cutover ownership; import authorized data into the sandbox first.
  Acceptance: R06/R08/R10. Four JSON seed candidates are not silently promoted to live truth. Correct physical/provider/Bookit mapping, documented policy, stable real IDs, preserved source references, reconciled counts/conflicts and repeat-safe import. No fake availability or double-calendar ambiguity at launch.
  Verify: Run the importer in dry-run against the approved export/source; compare source/accepted/rejected/conflicting counts and owner mappings. Repeat a sandbox import and confirm no duplicates or changes to unrelated data. Read back inventory/availability. Record unavailable Setmore data/access precisely and hold the dependent production cutover only.

- [ ] **5. Repair reservation consistency and retry behavior in the existing backend**
  Spec ref: `spec.md > 5. Reservation correctness`
  What to build: Salvage valid earlier repairs; implement database-enforced overlapping-slot ownership and safe create/edit/cancel/admin/payment transitions, strict calendar/SAST validation, server prices and repeat-safe submissions. Migrate existing indexes/claims safely rather than assuming a unique start time solves overlap.
  Acceptance: R08/R10/R12. Concurrent different-start/multi-hour overlaps cannot both succeed; non-overlapping times can. Repeat submission creates one reservation. Cancel frees the slot; failed reschedule preserves the old slot; delayed callbacks cannot revive released ownership. Invalid dates and stale choices fail clearly.
  Verify: In the isolated sandbox, run parallel overlapping creates, exact retries, invalid dates, cancel-and-rebook, conflicting reschedule and late-callback tests. Inspect reservation/claim state after each. Capture HTTP outcomes and row counts; confirm no orphan claims or leaked customer information.

- [ ] **6. Build the attractive native booking interaction**
  Spec ref: `spec.md > 6. Native booking interface`
  What to build: Rework the PR #51 candidate against the visual direction: real pitch images, date/duration/live-time controls, clear total, progressive minimal contact entry, preserved selections and responsive summary. Connect directly to corrected native APIs/storage. Simplify the screenshot's homepage section and competing CTAs as part of the wider-site plan.
  Acceptance: R04/R05/R06/R07/R12. Fast, engaging booking on Bookit; no mandatory signup detour; no Setmore iframe/link-out dependency. Actual open slots, correct server total and only persisted success. No fake fixture IDs, hidden required fields or explanatory backend copy in the customer flow.
  Verify: Exercise guest and signed-in sandbox journeys in the browser with real sandbox APIs. Confirm selections survive editing, slot conflicts and server errors. Observe native requests and the saved reference. Run a first-time task toward the proposed <=60-second target and record actual time/friction rather than declaring ease from a build.

- [ ] **7. Complete customer-to-venue communication and booking management**
  Spec ref: `spec.md > 7. Confirmation, customer management and payments`
  What to build: Customer confirmation/reference/next steps and secure guest/account retrieval, cancel and reschedule; venue booking alert with actionable details and access to the same record. Send change/cancel updates to both sides through verified configured channels. Track delivery/retries and surface failures without duplicate reservations. Apply the actual payment policy; implement sandbox payment consistency only if online payment is required.
  Acceptance: R09/R10/R12. The customer knows whether the booking saved and how to manage it; the client/venue actually receives the booking and can act. Each message matches the persisted reference/status/total. Email/WhatsApp/SMS is not promised unless configured and evidenced. Sent, delivered and read are not conflated. Notification failure does not lose or duplicate the booking.
  Verify: Allowlist sandbox customer and venue recipients; capture both inbox/provider delivery evidence and matching references after create/reschedule/cancel. Force delivery failure and retry; prove one stored booking. Open secure management links in a fresh browser and reject cross-customer access. If applicable, test payment success/failure/replay/late-event/refund in sandbox only.

- [ ] **8. Make the existing dashboard useful for daily venue operations**
  Spec ref: `spec.md > 8. Operator dashboard and retained data`
  What to build: Wire operator booking/customer history, search/filter/status/contact details and supported manual block/closure/cancel/reschedule/payment actions to the same native store. Preserve necessary data so the business can operate and learn from bookings.
  Acceptance: R07/R09/R11. Public booking immediately appears in the venue dashboard; staff can find the reference/customer, distinguish pending/reserved/confirmed/paid/cancelled, and operate under correct permissions. A manual block or lifecycle change changes customer availability. Pageviews are not reported as booking counts.
  Verify: In a fresh operator session, find the browser-created sandbox booking and inspect its permitted fields/history; make a block or lifecycle change and read public availability again. Confirm unauthorized sessions cannot view/manage records. Reconnect and verify the records persist.

- [ ] **9. Fix recovery, privacy, accessibility, mobile behavior and relevant CI**
  Spec ref: `spec.md > 9. Quality and recovery`
  What to build: Address observed UI/error/data-access issues and the relevant lint dependency blocker. Handle empty inventory, outages, ambiguous save/timeouts, stale slots, invalid contact and offline behavior. Refine mobile/keyboard/focus/labels/errors/contrast/reduced motion and remove unnecessary performance-heavy distractions from booking.
  Acceptance: R12/R13/R14. Clear recoverable states without false success; no duplicate retry or PII/secret leakage. Booking controls fit supported screens, touch targets are usable and keyboard/focus/error behavior works. CI is reproducible from the lockfile; no passing-lint claim while lint cannot start.
  Verify: Run `npm run typecheck`, targeted ESLint and `npm run build` after relevant changes; capture exits. Test 360/390px mobile and 1440px desktop, keyboard-only selection and announced errors. Simulate offline, API/DB failures and timeout-before/after-commit. Record accessibility/performance measurements and remaining device/assistive-tech limits.

- [ ] **10. Prove the complete journey, persistence and communications together**
  Spec ref: `spec.md > 10. Integrated proof`
  What to build: Create a repeatable isolated-sandbox browser/API/database/dashboard/notification test matrix and receipts, including recovery, concurrency, management and payment only if applicable. Verify retention across fresh sessions, process restart and preview redeployment against the same sandbox database.
  Acceptance: R05/R07/R08/R09/R10/R11/R14. One customer journey is tied to one durable booking/customer record, correct changed availability, customer confirmation and venue receipt. Every required case has evidence; no compilation/screenshot substituted for runtime proof. No production bookings, charges or real client test messages.
  Verify: Execute discovery -> select -> submit -> fresh DB read -> venue dashboard/alert -> customer confirmation/management -> restart/redeploy -> read -> retry/conflict -> reschedule -> cancel -> reopened slot. Correlate exact reference, sanitized requests, row counts and both recipient receipts. Verify protected access and capture all failing/unknown cases.

- [ ] **11. Show the working flow, then cut over and deploy with readback**
  Spec ref: `spec.md > 11. Release and cutover`
  What to build: Present the working visual flow for the owner's chosen prelaunch review, including actual sandbox saved data and communication to both sides. Apply feedback. Prepare source-backed inventory/reservation migration, notification configuration, exact release/rollback plan and health checks; complete the authorized deployment when its prerequisites are satisfied.
  Acceptance: R04/R06/R09/R14. Human visual-flow review is recorded; relevant checks pass on the exact release head; active reservations/inventory are reconciled. Production never switches to an empty calendar. Vercel READY and domain alias/SHA readback match the release; safe production checks confirm entry/inventory/availability. Real customer transaction/adoption remains a separate evidence level.
  Verify: Re-query PR head/checks, provider configuration metadata and migration dry-run/readback. Run the review in browser; record decisions. Deploy after prerequisites and any specifically missing data-action authorization. Read `fivesarena.com` alias/deployment SHA and public API results; verify rollback is executable. Do not create a production test booking or charge.

- [ ] **12. Deliver the client/operator handoff and before/after consistency review**
  Spec ref: `spec.md > 12. Delivery and consistency`
  What to build: Deliver concise customer/venue walkthroughs, before/after visuals, evidence-based findings/journey map and technical receipts. Record source populations, issue disposition, reused/new work, relevant REA/KPGS evidence, outstanding access gaps, ownership and next executable scope. Adapt the skill's final Devpost handoff to this actual client delivery; no Devpost submission is requested.
  Acceptance: R01/R02/R03/R15. The owner/client can see what changed, use the booking/dashboard flow, understand both communication paths and identify genuine remaining gaps. Source, tested, preview, merged, deployed and production/human-verified states are distinct. No invented CCP acceptance, PKA admission, runtime activation or conversion outcome.
  Verify: Reapply CCP against this scope/PRD/checklist and actual receipts. Review each R01–R15 acceptance against evidence. Read back saved handoff files and any separately authorized issue/Drive delivery. Mark checklist boxes only for fully evidenced packages; identify the exact next action/owner for every incomplete one.

## Requirement coverage

R01: 1/12; R02: 1/12; R03: 2/12; R04: 2/6/11; R05: 2/6/10; R06: 4/6/11; R07: 3/6/8/10; R08: 4/5/10; R09: 7/8/10/11; R10: 4/5/7/10; R11: 3/8/10; R12: 3/5/6/7/9; R13: 2/9; R14: 9/10/11; R15: 1/12.

## Completion discipline

All packages remain unchecked. Existing PR #51 proves a prepared UI/API-wiring candidate and successful build/typecheck/preview receipts, not successful persistence, communication, management, operational adoption or production cutover. Record every completed slice and blocker in build-notes.md. Scope gut-check is the owner's chance to add an omitted request; do not make them repeat settled requirements.
