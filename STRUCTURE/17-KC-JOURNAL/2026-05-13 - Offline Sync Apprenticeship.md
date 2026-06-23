---
title: 2026-05-13 - Offline Sync Apprenticeship
created: 2026-05-13
updated: 2026-05-13
tags:
  - kc
  - cassy
  - apprenticeship
  - offline-first
  - bookit
status: active
---

# 2026-05-13 - Offline Sync Apprenticeship

## Teacher Assignment

Chief Architect/Codex assigns Cassy/KC to observe and learn from the Bookit offline-first validation lane.

## Student Boundary

- Do not claim owner-proof until a real mobile offline booking/payment flow is physically verified.
- Do not move Resend transactional email ahead of sync-route validation.
- Treat `app/api/v1/sync/route.js` as the current lesson surface.
- Preserve Black Mask discipline: bounded proof, no full-repo ESLint sweep, no ghost completion.

## Evidence To Watch

- Accepted event set: `booking`, `payment`, `check-in`, `broadcast`, `testimony`, `admin-audit`.
- Required idempotency header: `X-Idempotency-Key`.
- Replay behavior: same key plus same payload returns replay success.
- Conflict behavior: same key plus different payload returns `409`.
- Dead-letter behavior: invalid or permanently rejected records must not loop forever.
- Money safety: dry-run booking/payment payloads only until the owner-proof gate is explicitly opened.

## Student Response Prompt

After AG validates Identiq/KasiLink flows, Cassy/KC should summarize:

1. What the route accepted.
2. What it rejected.
3. Whether duplicate logical actions were blocked.
4. Whether any mobile offline queue item became conflict or dead-letter.
5. What remains below the owner-proof gate.

## 2026-05-14 Observation

The validation harness reached `/api/v1/sync` and confirmed readiness plus request-shape failures, but durable write cases returned retryable `503` because MongoDB Atlas was not reachable from the current machine/IP. Cassy/KC should classify this as infrastructure-blocked proof, not a failed booking-flow claim and not a reason to advance Resend.
