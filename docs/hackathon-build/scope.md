# Bookit / FivesArena — recovered scope

Drafted 20 October 2026 from the owner's complete supplied conversation. This is an existing court-booking product and client delivery, not a hackathon entry. The build-checklist format is adapted accordingly.

## Outcome

A beautiful, engaging, low-copy Bookit website where customers can quickly choose a real court and open time, understand the total, book confidently, and manage the reservation. Bookit must retain customer and booking records in its existing backend and make them usable by venue staff.

## Settled owner decisions

- Setmore is the benchmark for visual clarity, speed and ease. Rebuild those qualities in Bookit. A link, iframe, or external calendar is not the requested final product.
- Improve the existing system and salvage useful prior work, assets, backend, dashboard and repair candidates. Do not replace the product with a disconnected mockup.
- Simplify the whole public experience: imagery and interaction first; short labels, one clear action at a time. The complaint covers the wider website as well as booking.
- Client-reported failures, increased Setmore bookings and reports of Setmore being easier are accepted customer testimony. Record them without requiring the owner to find a public issue proving them.
- Current scope is court booking. Historical hotel-reservation descriptions and the older parked-homepage direction must not override the owner's current booking-first instruction.
- The owner authorized continued repair and deployment. Continue supported preparation without repeated permission requests. Test transactions only in an isolated sandbox; no real bookings or charges. Production data changes require a concrete migration/cutover plan consistent with that authorization.
- Use CCP Context First before investigation and reporting; Product Design for the journey/visual audit; REA where shipped/runtime evidence adds value. Include the requested KPGS work only against recovered relevant contracts, without invented capabilities.

## Scope that must remain visible

Discovery; venue/court; date/time/duration; real availability; clear price; minimal account/contact friction; payment if applicable; durable save; confirmation; guest and account management; cancellation/rescheduling; operator dashboard; customer history; retries, overlap protection and recovery; privacy; accessibility; mobile/desktop usability; production rollout and evidence.

## Evidence boundaries

- The October 20 production receipt identified Kopano-Labs/Bookit-5s-Arena main at `85e6e2b4aa2035552c396d8e7d632a706e524f2d`, Vercel `dpl_BsHZ6xKnFTpgmjW4kSZwU2h7kjGv`. Re-query before implementation or release claims.
- Original local checkout is dirty on `feat/boat-3d-tactics-experience`; preserve it. Planning and candidate work live in the managed `native-booking-repair` worktree.
- Root NOW.md was absent in the inspected Bookit tree. STRUCTURE/00-Home/Now.md describes April Orch/KasiLink work and is not current Bookit status.
- Latest prior-turn production GET /api/courts returned `200 []`, data-state `database-empty`; availability returned no courts.
- A separate read-only connection using the original checkout's local environment reached Atlas database `test`: 0 courts and 0 bookings, alongside other existing application collections. A database named `test` is not proof it is an isolated sandbox. Exact production database identity was not established by decrypting configuration.
- Current Setmore handoff bypasses Bookit's native POST. This does not establish the historical cause of five months of missing booking data, prove deletion, or prove that every environment is empty.
- data/courts.json contains four candidate definitions at R400/hour and 10:00–22:00, with legacy IDs. These are not verified live inventory or a production ownership mapping.
- PR #51 is a draft native UI/API-wiring candidate. Its preview build passed; end-to-end save, lifecycle, accessibility and visual acceptance were not established. It is not the finished solution.
- Earlier HANDOFF.md and REPORT.md describe superseded investigation/Setmore stages. They remain historical evidence, not current product direction.
- Cloud/GitHub, Local OneDrive and Google Drive remain distinct evidence populations. No parity or complete cross-estate audit is claimed.

## Outstanding factual decisions

Recover rather than ask the owner to restate retrievable facts: canonical production database/owner; actual court identities/rates/hours/closures; active reservation ledger and Setmore mapping; payment policy; hold expiry; cancellation/reschedule cutoff; guest contact minimum; relevant KPGS contract. Hold only dependent migration, policy or integration work when these remain unknown.

## Standout outcome

Confirmed by the owner: a customer completes an attractive, fast Bookit booking, and the exact persisted reservation immediately appears in the real operator dashboard. Communication is part of the complete journey: customers must find the real booking entry, receive confirmation/next steps and management updates; the venue/client must receive the booking and be able to act on it. A database row alone does not satisfy delivery. Customer ease and adoption require later observation; a passing build is not that evidence.

The owner selected a working visual-flow review before launch. Planning is delegated to Codex; keep independent implementation/verification moving and use this substantive review rather than repeated permission prompts.
