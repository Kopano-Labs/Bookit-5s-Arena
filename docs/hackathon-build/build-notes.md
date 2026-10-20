# Bookit build notes

## 20 October 2026 — checklist recovery

Requested deliverable: consolidate all of the owner's requirements, including those stated in frustration, into the explicitly invoked build-checklist format. Continue the existing Bookit operation; this planning turn does not execute a production migration, send notifications or submit a booking.

### Confirmed owner shaping

- “SETMORE IS THE VISUAL MOTIVATION ... REENGINEER THAT INTO WHAT WE ALREADY HAVE.” This supersedes the earlier interpretation that a Setmore link/iframe satisfies the product objective.
- “what we have is not easy” requires interaction/design repair, not simply routing existing difficult pages to native APIs.
- “visual aesthetics” and “text ... on text” apply across the website; include homepage/content hierarchy, imagery and engagement, not just a form.
- “5 months ... no data ... backend” is a reported operational failure to investigate and repair. Today's iframe bypass is not a proven five-month historical cause.
- “Show the working visual flow before launch” is the confirmed review preference. Planning/build mode: autonomous; substantive prelaunch visual review, no repeated preference interview.
- Additional confirmed outcome: “COMMUNICATION ... CUSTOMER BOOKING JOURNEY ... CLIENT ... GETTING THE BOOKING.” The plan must prove customer confirmation/next steps and venue/client receipt/actionability tied to the same saved reservation, including management updates. A saved row alone is incomplete.

### Documents created

scope.md, prd.md, spec.md, checklist.md and this journal. Requirements/spec are reconstructed from existing discussion and source evidence; no prior approved PRD/spec was found. Checklist is a draft pending the owner's completeness gut-check; no task package is marked complete.

### Skill adaptation

The invoked skill's state/PRD/spec prerequisites were absent. The owner's explicit request is a production-product checklist, so supporting documents were recovered from supplied context rather than diverting into hackathon registration or a fresh interview. The same five-field task format is used. The state file records document/workflow progress only, with no event/registration/submission assertion. The final handoff is the Bookit client/operator delivery, not Devpost. Large real-world packages are executed in 15–30 minute verified slices; total completion time has not been estimated. No script/composer was run for planning.

### Source/evidence register

- Full supplied user discussion and attached screenshot: intent, customer-reported pain, visual/copy complaints and settled direction.
- Downloads/HANDOFF.md: read this turn; October 19 historical investigation directions and Linux REA receipt. Its environment and provider direction are not current Windows connection/product proof.
- Existing REPORT.md in Documents/Codex/2026/10/19/fivesarena-booking-investigation: historical journey, screenshots, issues, provider observations and prior Setmore delivery. Source coverage was inspected, not a fresh live audit of every linked surface. Historical recommendation against broad redesign and next-step Setmore testing are superseded by the owner's current native/visual direction.
- Bookit AGENTS.md and current candidate source: native Mongo booking writes, exact-start unique index, guest route, static court candidates and source/API/UI boundaries.
- Prior-turn receipts: production `85e6e2b...`, PR #51 `1c0d9fd...`, preview `dpl_5piMZQMwXQMnCN5uVkB9FRe9svwc` READY; build/typecheck passed; lint could not start due incompatible Zod dependency resolution. Re-query before execution; these are not this turn's runtime revalidation.
- Prior-turn production courts/availability empty; separately local-env Atlas `test` had zero Court/Booking rows. Production database identity, historical absence cause and transaction persistence were not proven. Name `test` does not authorize writing as though isolated.
- Cloud/GitHub, Local OneDrive and Google Drive findings in the earlier report retain separate scope/freshness. No parity or new comprehensive scan is asserted.
- REA skill now exists locally. A skill file, past setup or target-free doctor does not prove active REA tool connection; package 1 explicitly addresses it. Source-only analysis should use normal tools; REA serves relevant public/shipped/runtime evidence.

### Open dependency record

Recover the canonical production database/owner and historical data destination; isolate test storage/recipients; verify actual court/rate/hour/closure mappings; obtain accessible active Setmore/manual ledger data for reconciliation; settle current contact/payment/hold/cancel policy from venue evidence; recover the precise relevant KPGS contract. Ask only focused questions when retrieval cannot resolve a fact that changes a dependent action.

### Review / next step

Deepening rounds: 0 (owner handed planning off). Required two planning answers received and incorporated. Completeness gut-check remains pending; do not present the whole checklist as owner-accepted yet. Next command: `$build-project`, starting with package 1 and continuing independently wherever prerequisites permit. Preserve the agreed prelaunch working-flow review.

## 20 October 2026 — supplied account-welcome email and recovered communications history

The owner supplied Setmore account-welcome evidence and stated these capabilities had already been built in Fives. Source recovery confirms existing Bookit profile/history features and an earlier communications implementation at merge 1be66ae (30 August) / remote branch 73b7ce1. It includes post-save guest/customer/business dispatch and durable revision-keyed receipts, but is absent from both inspected current main histories. Live production still maps to Kopano-Labs main 85e6e2b. This is an integration/lineage gap, not evidence that the owner imagined or never built the work.

The current credentials/social signup paths lack welcome dispatch; current guest create lacks notification dispatch; signed-in create attempts customer communication but lacks the recovered customer/business receipt fan-out. Vercel production email-variable names are present (metadata only), so provider credentials cannot simply be called missing. Current source also has simulated WhatsApp success and misleading confirmed/Amount Paid copy. The recovered business email default differs from the owner-supplied venue address and must be corrected/verified before reuse.

Added R16 and expanded packages 1, 7 and 8; detailed findings, exact sources, evidence limitations and recovery cautions are in communication-gap-audit.md. No real message/account/booking was submitted, no production data changed, and no delivery claim was made. User's personal email/screenshot are not copied into versioned documents.

## 20 October 2026 — Project Tracker and release checklist

Applied the requested Project Tracker retained template, build-checklist, deploy-checklist and CCP Context First. Preserved the settled autonomous build mode and working visual-flow review before launch; no repeated preference interview or invented hackathon. Created Bookit-Repair-Project-Tracker.xlsx with 24 slices across the 12 packages, 0 complete, 6 in progress and 3 at risk. In-progress includes source recovery/candidate preparation, not an end-to-end feature pass. Codex is the implementation assignee; Kholofelo is the named prelaunch reviewer. Task dates and launch date remain unassigned.

Added deploy-checklist.md with source-scoped baseline, dependencies, isolated persistence/slot/communication gates, inventory/reservation cutover, rollback obligations, safe production readback and planned first-15-minute checks. Welcome, both customer and venue lifecycle receipts, profile/history and secure guest management are mandatory. No monitor was installed and no production action was taken.

Current readbacks: PR #51 open/draft/unmerged at 771b42f31517e65ad7c53365795e83f020a7751f; its two Vercel commit statuses report success. Production Vercel dpl_BsHZ6xKnFTpgmjW4kSZwU2h7kjGv remains READY with fivesarena.com alias at 85e6e2b4aa2035552c396d8e7d632a706e524f2d. Earlier empty-inventory/Atlas counts and communication-source audits are carried forward with their original scope, not relabeled as new transaction checks. No new Local OneDrive or Drive sweep/parity claim.

Spreadsheet verification: imported the retained workbook, kept one-sheet layout, column widths, 23 merges, 655 equivalent formulas, all 11 conditional rules and four dropdown ranges; replaced synthetic assignees only. Expanded Excel shared formulas to ordinary equivalent formulas after detecting stale imported schedule caches. Tested status/date inputs, duration and Gantt responses, then restored all task dates to blank. Verified summary 24/0/6/3/17 (tasks/complete/in-progress/at-risk/P0), rendered and checked the sheet, and scanned export for formula errors. No Excel-desktop runtime claim.

Before/after consistency: scope remains native visual Bookit backed by its own store, with customer and venue communications. Product direction is settled by the owner; production DB identity/history, inventory, active reservation export, REA/KPGS connection details, sandbox and delivery evidence remain open. No CCP acceptance, PKA admission, runtime activation or release acceptance is claimed. Next command remains build-project: source/connection refresh and salvage, then isolated save/read/dashboard proof and inventory reconciliation, with visual research and communications recovery advancing where independent.

## 21 October 2026 — native persistence and communications recovery

Build mode remains autonomous and the owner review remains the working visual flow before launch. Ingress: I_AM_STATELESS_RENTER_NOT_LANDLORD. Current worktree was clean at fc89504; original checkout remains preserved. PR #51 was re-read open/draft at cdf439e; production Vercel still aliases 85e6e2b (same deployment ID as the prior receipt). Root NOW.md remains absent; stale nested notes do not define this product's current direction.

Recovered the revision-keyed BookingDelivery model and customer/business post-save fan-out pattern from 73b7ce1. Added an explicit welcome receipt for credentials and first social account creation. Native guest and signed-in create now invoke the recovered dispatcher; signup hooks invoke welcome only for a newly created account. Messages reflect pending/reserved/unpaid state, escape customer content, include a persisted reference and provide on-domain account/operator/contact links. Guest self-service management remains unfinished; guest messages honestly link to venue contact rather than pretending an account history page can retrieve guest records.

Transport chooses one configured email provider; it never falls back after an ambiguous send. Real sending requires BOOKING_COMMUNICATIONS_ENABLED=true and an explicitly verified BOOKING_BUSINESS_EMAIL (no historical misspelled fallback). Sandbox mode is restricted to a loopback SMTP server and allowlisted test destinations and never falls through to provider credentials. Unique receipt claims suppress concurrent duplicate dispatch. Explicit rejected sends can retry; ambiguous sends are held unknown, and abandoned sending claims require review rather than blind replay. Simulation cannot count as sent. Provider acceptance is not delivered/read evidence. SMS/WhatsApp are not activated by this slice.

The existing guest save API was already capable of writing to its configured database. The missing production inventory and external provider route remain separate issues; these changes do not establish why historical records are absent. Improved the existing operator table to show guest name/email/phone/reference instead of Unknown. The customer confirmation uses the saved server total and reports pending email honestly. A browser walkthrough reproduced a newsletter modal interrupting booking after its timer; NewsletterPopup now excludes /book and descendants.

Verification:
- npm run test:booking:sandbox executed real native HTTP endpoints against a newly created loopback MongoDB 7.0.24 and local SMTP inbox (no Atlas writes). Ten checks passed: native guest create + independent connection read; both inboxes matching reference and unpaid copy; changed public availability; same record in authorized operator API and 401 without session; credentials account + welcome; concurrent notification duplicate suppression; first-social-create callback welcome + repeat-sign-in suppression; explicit send rejection/retry and ambiguous-outcome hold; simulation/allowlist rejection; retained DB data after MongoDB and Next process restarts. Social OAuth provider login itself was not tested; the actual JWT callback was invoked against the sandbox.
- Actual in-app browser guest booking produced reference 47DBC86B. Independent MongoDB read found 6ad7fb6f8e00a01a47dbc86b and separate user/business sandbox-smtp receipts. The 390px confirmation capture is evidence/reservation-saved.png. Desktop viewport override/screenshot behavior was inconsistent, so no complete desktop or accessibility pass is claimed. Native keyboard date input worked; locator fill alone did not trigger the controlled date state in this browser tooling.
- Targeted ESLint completed with zero errors and three warnings (two pre-existing img optimization warnings and an unused disable directive). Added Zod 3.25.76 as an explicit dev dependency so hooks lint can resolve its v4/core export without upgrading v3 API consumers. Typecheck passed before final UI-only tweaks; final typecheck and production build receipts are recorded below when complete.
- The first sandbox attempt collided with a simultaneous Next build in .next. Stopped the owned build; added a dedicated .next-bookit-sandbox directory and ignored it, then reran sandbox successfully. The final build runs separately. MongoDB/Next/SMTP sandbox processes were stopped after evidence capture; the screenshot is not a claim of an online preview.

REA: no REA MCP tools are exposed in this session. The registered pinned 6.7.0 doctor failed to launch because @modelcontextprotocol/client/dist/index.mjs was missing. The latest CLI doctor runs and reports the Codex registration aligned, but that does not establish an active connection or repair the pinned launch error. No setup/config/provider installations were performed and no REA runtime investigation is claimed. Relevant source recovery uses ordinary repository tools. Precise KPGS contract remains unresolved; no activation or invented integration.

Remaining release-critical work: positively identify production storage/history; verify real inventory/rates/policies and active Setmore/manual reservations; recover/adapt slot-claim migration and atomic create/edit/cancel/payment transitions; submission idempotency; secure guest/account management; durable outbox reconciliation for a crash between saving and queuing; operational retry/escalation and external provider/inbox proof; customer/venue reschedule/cancel notices; full mobile/desktop/accessibility/visual-flow review. Do not enable native production on empty inventory or enable live messages from this slice alone. A sender helper and durable receipt are not a complete background delivery service.

CCP before/after review: current local source, historical 73b7ce1 files, plan/PRD/spec/checklist, PR metadata, Vercel production readback, sandbox routes/storage/SMTP and actual browser were inspected. The prior Cloud/Local OneDrive/Drive evidence keeps its own population and date; no new full sweep/parity claim. Newly known: native sandbox saves survive restart and both local inboxes receive correct reservations; the earlier communications design is recoverable and now partially restored. Unresolved storage/inventory/production delivery and connection gaps remain explicit. Owner native-booking scope continues to resolve historical parked-homepage wording for this operation. No CCP acceptance, PKA admission, runtime activation, production transaction or human visual acceptance is claimed.

Final checks for this slice: production build exited 0 (72 static pages; expected missing-database diagnostic during homepage generation in the unconfigured build environment). Final npm run typecheck exited 0. Targeted lint exited 0 with the three recorded warnings. Full repository lint, external providers, production data and human acceptance were not validated. No whole checklist package is checked off.
