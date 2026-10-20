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
