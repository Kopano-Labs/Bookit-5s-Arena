# Bookit native booking — deployment checklist

Prepared 20 October 2026. **Release status: HOLD.** This is a release procedure and evidence checklist, not a deployment receipt. Codex owns implementation and release evidence; Kholofelo reviews the working visual flow before launch. Venue inventory, policy and recipient facts require verified venue sources; no additional people or deadlines are assigned here.

## Outcome and scope

Customers stay on Bookit, book through a quick visual flow, and receive truthful confirmation and management access. The venue sees the same durable booking in its dashboard and receives an actionable alert. Recover useful earlier code before rebuilding. Setmore is the ease-of-use benchmark and an existing reservation source to reconcile. No iframe or outbound booking dependency in the completed native journey.

The spreadsheet contains 24 slices mapped to checklist packages 1–12. It is a dated status snapshot; checklist.md and prd.md contain acceptance criteria. Update task status and evidence together during execution. In Progress includes recovered source or a prepared candidate; it does not mean the capability works end to end. At Risk identifies an unmet data dependency or blocked cutover. Task dates remain unassigned, so the Gantt grid is not a 20-week delivery commitment.

## Evidence baseline

| Item | Evidence and limit |
| --- | --- |
| Current production | Vercel readback this turn: `dpl_BsHZ6xKnFTpgmjW4kSZwU2h7kjGv`, READY; fivesarena.com aliases Kopano-Labs main `85e6e2b4aa2035552c396d8e7d632a706e524f2d`. Source embeds Setmore. READY does not prove a native booking. |
| Candidate | Draft [PR #51](https://github.com/Kopano-Labs/Bookit-5s-Arena/pull/51), open, unmerged; head `771b42f31517e65ad7c53365795e83f020a7751f` revalidated this turn. Two Vercel statuses report success for that head. No owner visual acceptance or integrated transaction proof. |
| Inventory/data | Earlier public GET receipts: courts `[]`, availability has no courts. Separately inspected local-env Atlas database `test` had zero Court/Booking rows. No new DB query in this planning update; exact production DB identity remains unproven. Four JSON seed candidates are not verified production inventory. |
| Communications | Current-source gaps and historical recovery at `73b7ce1` / merge `1be66ae` are documented in communication-gap-audit.md. Production mail variable names were present in earlier metadata-only inspection. Delivery and current recipient correctness remain unproven. |
| Prior checks | Earlier UI candidate build/typecheck passed. ESLint could not start because of the Zod/hooks-plugin dependency mismatch. Those checks are not a fresh full-suite pass on the eventual release head. |
| Access | Active REA call, precise KPGS contract, complete Setmore reservation export, isolated sandbox and actual customer/venue provider receipts are not established by this tracker. Source files and installation history do not substitute for them. |

## Dependency sequence

1. **1a–1b:** refresh instructions/refs and compare recovered implementations; verify active REA if used and recover the exact KPGS scope. Capability gaps hold the dependent integration, not ordinary source recovery.
2. **3a–3b + 4a:** identify storage, establish positively isolated test storage/recipients and verified inventory. **4b** reconciles active bookings before cutover. **2a–2b** visual research and **7a** source salvage can advance alongside this work.
3. **5a–5b + 6a–6b + 7a–7b + 8a–8b:** repair slot ownership, native UI, welcome/booking communications, management and operational views against the same database. Correct historical recipient defaults before dispatch.
4. **9a–9b → 10a–10b:** reproducible checks, accessible mobile interactions and integrated sandbox evidence. Reconcile inventory and payment policy before final lifecycle tests.
5. **11a → 11b → 12a–12b:** show the working flow, apply feedback, execute the proven cutover, verify production readback and hand over. Empty inventory or incomplete both-side communications prevents launch.

## Predeployment gates

All gates below remain unchecked. A gate closes only with a dated locator, exact source/release SHA, observed result and any remaining limitation recorded in build-notes.md or a linked receipt.

- [ ] **Context and source:** read applicable AGENTS.md and current-state records; record missing root NOW.md and stale nested notes. Revalidate PR/base/head, production alias and worktree status. Preserve the original dirty checkout. Current owner booking-first scope governs the historical issue #158/#42 conflict; no hotel scope.
- [ ] **Visual direction:** inspect Setmore and relevant competing journeys with Product Design on mobile and desktop. Demonstrate image-led entry, concise choices, clear total, confirmation and management. Test the whole arrival-to-booking route, including the overly verbose homepage section. Capture 360/390px and 1440px views.
- [ ] **Database identity and isolation:** record redacted actual database/collection mapping for each environment; prove sandbox is distinct from production and use synthetic customer data. Trace historical missing records separately from today's iframe. Never use the name `test` alone as isolation evidence.
- [ ] **Inventory and active reservations:** verify names/IDs/owner/rates/hours/closures and timezone. Reconcile Setmore/manual active reservations with native inventory. Dry-run import must account for accepted/rejected/conflicting rows and preserve source references. Sandbox import must be repeat-safe; no unresolved overlapping active bookings at cutover.
- [ ] **Safe migrations:** inspect existing indexes/claims and data before applying changes. Record backup/snapshot, scope, expected counts, versioned migration, repeat-run behavior, forward/backward compatibility and restoration steps. Rehearse on isolated data. No destructive migration merely to make the UI work.
- [ ] **Reservation integrity:** parallel overlapping starts and multi-hour overlaps yield one accepted reservation; exact retry yields one record/reference. Non-overlap succeeds. Cancellation releases capacity. Failed reschedule preserves the original slot. Late payment/provider callbacks cannot revive released ownership. Server controls price and calendar/SAST validation.
- [ ] **Native flow and durable save:** sandbox browser completes guest and signed-in flows on Bookit. The reference returned after a successful save must match a fresh DB read, fresh dashboard session, customer history/secure guest access and availability. Restart and preview redeployment retain that record. No fixture fallback or local-only success screen.
- [ ] **Account and customer management:** credentials signup and first social signup each trigger one welcome, repeated sign-in does not. Profile changes persist; account history and secure guest retrieval work. Verified identity is required for guest-account linkage. Cross-customer/operator authorization tests reject access.
- [ ] **Communication to both sides:** verify the actual venue recipients; historical `fivearena@gmail.com` default differs from the supplied venue address. Allowlist sandbox customer and venue inboxes. Match create/change/cancel messages to the same saved reference, status and amount. Capture provider acceptance plus actual receiving inbox evidence; delivery/read statuses remain distinct. Failed sends are durable/retryable, produce no duplicate booking, and are visible to operations. Simulation is never counted as delivery.
- [ ] **Price/payment truth:** venue policy establishes deposit, pay-at-venue or online payment behavior before enabling it. Pending/amount-due copy must not say paid. If online payment is required, prove success/failure/replay/late callback/refund in the provider sandbox. If not applicable, record the source-backed N/A decision.
- [ ] **Quality and CI:** repair lint dependency resolution without unrelated upgrades; run typecheck, applicable build/lint/tests from the lockfile on the exact release SHA. Exercise outages, invalid input, stale slots, offline and ambiguous timeout before/after commit. Keyboard/focus/errors/labels/contrast, mobile layout and reduced-motion behavior are verified. Keep PII/secrets out of logs and receipts.
- [ ] **Review and operator readiness:** show Kholofelo the working visual flow with matching saved dashboard record and both recipient receipts before launch. Record review outcome and apply feedback. Operator can find a booking, understand its true status and manage supported changes. Do not record stakeholders as notified without an actual authorized communication receipt.
- [ ] **Release manifest:** pin exact release SHA, deployment configuration metadata, migration version, reconciled counts, provider modes, notifications/retry configuration, approved cutover sequence and owner of each action. Confirm credentials exist through safe metadata and sandbox behavior; never print values.
- [ ] **Rollback rehearsal and observability:** confirm the previous deployment can be restored, schema compatibility and reservation/notification behavior after rollback. Establish actual pre-release error, latency, booking completion and delivery baselines; define numeric thresholds from those measurements. Baselines and thresholds are currently UNMEASURED/UNSET, not invented green checks.

## Cutover and deploy procedure — not yet executed

- [ ] Refresh all gates and release head after any code/configuration change. Verify the final preview points to the isolated DB/provider modes and passes the integrated matrix.
- [ ] Snapshot approved inventory/reservations and record the final Setmore/manual delta and reconciliation counts. Use one controlled booking authority during the change; document when external availability stops accepting new native-slot conflicts. Do not close existing provider access without a verified transition and recoverable records.
- [ ] Apply only approved, rehearsed data/configuration changes. Read back exact records/counts and availability before exposing native booking. If any required court or reservation mapping is absent, stop the switch.
- [ ] Deploy the pinned release through the existing Vercel project. Capture deployment ID/status and verify fivesarena.com alias resolves to the intended SHA. READY alone does not close release acceptance.
- [ ] Perform safe production GET/browser checks: homepage/CTA → native booking, real courts, date/duration availability, truthful totals, account/manage entry points and error recovery. Do not create a real reservation, account, charge or test message to production customers. Transactional proof remains the sandbox receipt until legitimate customer/operator evidence exists.

## First 15 minutes and postdeployment

These are planned checks during the eventual release session, not an installed monitor or proof of observation.

- [ ] At release, +5, +10 and +15 minutes, compare runtime error/latency, inventory responses, slot/booking consistency and communication retry/failed-delivery metrics against measured baselines and agreed thresholds. Record timestamp, environment, release SHA and observed values. If no legitimate bookings occur, record NO TRANSACTION SAMPLE rather than claiming successful live delivery.
- [ ] Escalate immediately for overlapping accepted bookings, lost acknowledged saves, cross-customer data exposure, incorrect prices/payment status or missing venue/customer communication without visible recovery. Stop further unsafe acceptance, preserve records and follow the verified recovery plan.
- [ ] Trigger rollback for the agreed measured health thresholds or critical integrity failure. Code rollback must not delete new bookings, discard queued messages or reopen occupied slots. If returning traffic to Setmore would conflict with new native reservations, reconcile/synchronize those reservations before reopening provider availability; use a truthful temporary unavailable state while unsafe.
- [ ] Read back postrollback alias/SHA, inventory and occupied slots if rollback occurs. Reconcile messages/payments separately; do not mark obligations resolved merely because old code is serving again.
- [ ] Record deployment status, unresolved incidents, customer/venue guidance and any separately authorized notifications with provider readback. No email/Slack/issue comment is sent merely because it appears on this checklist.
- [ ] Complete client/operator walkthrough and before/after consistency review. Preserve source, tested, preview, merged, deployed and actual customer/operator verification as separate states.

## Acceptance receipt required for launch

| Check | Required measurable result |
| --- | --- |
| Quick visual booking | Working mobile/desktop walkthrough; proposed first-time target ≤60 seconds measured and reported, not presumed. One obvious primary action per stage. |
| Persistent reservation | One accepted submission = one booking reference and matching durable DB/dashboard record after fresh session, restart and redeployment. |
| Overlap/retry | Every defined concurrent overlap case admits at most one booking; exact retries retain one reference/record. |
| Clear price | Displayed total matches server amount and venue-approved rates; unpaid reservations never appear paid. |
| Welcome and notifications | One welcome per new native account; each lifecycle event has matching customer and venue receipts; forced failure recovers without duplicate booking/message for the same event revision. |
| Manage afterward | Secure guest/account retrieval works; conflict-safe reschedule and cancel update stored state, capacity, dashboard and both recipient communications. |
| Release | Correct SHA/alias, non-empty verified inventory, reconciled active reservations, owner working-flow review and measured health/recovery evidence. |

## Before/after consistency review for this planning update

**Inspected:** current local checklist/spec/PRD/notes/source audit, requested skill/template sources, live PR metadata and Vercel production/commit statuses. The retained spreadsheet layout is imported, not rebuilt. Previous Cloud, Local OneDrive and Drive recovery findings remain separately scoped in the existing report; no new Drive/OneDrive sweep or parity claim was made here.

**Became known:** PR #51 is still draft/open/unmerged at `771b42f`; production still aliases `85e6e2b`; the deployment statuses for the inspected PR head report success. The repair scope now has an operational tracker, explicit dependency order and deployment gates, including welcome, venue receipt and secure management.

**Unresolved:** exact production DB identity/history, authoritative inventory/policies and Setmore active records, active REA connection/relevant KPGS contract, sandbox access, delivery proof and full native lifecycle proof. The owner has resolved product direction in favor of native booking; historical parked-homepage text cannot override that direction. No CCP acceptance, PKA admission, runtime activation, customer adoption or production transaction validation is claimed.

**Next executable scope:** package 1 source/connection refresh and historical communications comparison, then isolated persistence proof (3) and verified inventory reconciliation (4); continue visual audit (2) and recoverable communication source work (7) where independent. Actual cutover remains after the working-flow review and evidence gates.
