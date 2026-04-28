# Out-of-Scope Findings — Bookit 5s Arena

Persistent register of items surfaced during MVP fix sessions that were intentionally deferred. Each entry records why it was deferred and what would unblock it next session.

---

## Admin UI to grant `security_guard` role

**Discovered:** 2026-04-27 (Phase 1)
**Scope reason:** Phase 1 brief explicitly excluded auth/admin/rights/database changes. Adding the role enum was in scope; building the UI/API to assign it was not. A super-admin currently has no way to grant `security_guard` to a user except by direct DB write.
**Suggested next session:** Audit `app/admin/rights/page.jsx` and the supporting API route. Extend the role-grant flow to expose `security_guard` alongside `manager` and `admin`. Verify `lib/authOptions.js` propagates the role into the session.

---

## `lib/authOptions.js` may filter out `security_guard`

**Discovered:** 2026-04-27 (Phase 1)
**Scope reason:** NextAuth session callback was not inspected during Phase 1 fix. If the callback hardcodes role validation against an allowlist, a user with `security_guard` in the DB may have it stripped from `session.user.role` / `activeRole`. This would silently route them to `USER_NAV` despite the new tier existing.
**Suggested next session:** Read `lib/authOptions.js` end-to-end. Confirm the JWT and session callbacks pass `security_guard` through. Add a test user, grant the role, log in, and confirm `useSession()` returns the role intact.

---

## Pre-existing ESLint issues across app code

**Discovered:** 2026-04-28 (Phase 2, after `STRUCTURE/` ignore unblocked lint)
**Scope reason:** With OOM fixed, ESLint now reports 138 problems (15 errors, 123 warnings) in app code untouched by the MVP fix sessions. These predate this work and would balloon scope if addressed inline.
**Suggested next session:** Triage the 15 errors first (concentrated in `components/home/Hero3D.jsx` purity violations, `components/home/SocialSection.jsx` `<img>` swap, `lib/sports/football.js` unused imports). Then sweep warnings by category. Consider running `npm run lint -- --fix` for the 5 auto-fixable ones.

---

## Browser verification of all 5 navbar tiers

**Discovered:** 2026-04-27 (Phase 1)
**Scope reason:** Bug 1 was diagnosed by static reading + UEFA-format/role-tier code reasoning. Live runtime confirmation (clicking through guest/user/manager/admin/security_guard headers in a browser) was deferred to the Architect. Tier 5 specifically is blocked by the role-grant gap above.
**Suggested next session (or now, by Architect):**
1. `npm run dev`, open `http://localhost:3002`
2. Test as guest (logged out): Book / Fixtures / Leagues / Events / About
3. Test as user: Book / Bookings / Leagues / Fixtures / About
4. Test as manager: navigate `/manager/*`, confirm `ManagerNavbar` swaps in
5. Test as admin: primary nav + ⚙️ More dropdown
6. Test as security_guard: requires DB role grant first (deferred — see top entry)

---

## Remaining tournament-constant duplication

**Discovered:** 2026-04-28 (Phase 2)
**Scope reason:** Phase 2 refactored the highest-drift surfaces (date strings, knockout format) to consume `lib/tournamentConfig.js`. Several lower-drift mentions remain inline because their copy is unique or the literal is incidental:
- `components/SoccerBallMenu.jsx:29` — "World Cup 5s · May 2026" (month-only string)
- `components/home/TournamentShowcase.jsx:241` — partially refactored; surrounding marketing copy still bespoke
- `app/leagues/page.jsx` — multiple "May 2026" mentions in CTAs
- `app/blog/page.jsx:55,57` — historical post date (do not change)
- `app/api/tournament/route.js:25` — `totalSlots: 48` numeric (low risk)
- `lib/worldCupTeams.js:7` — comment string (no behavior)

**Suggested next session:** Sweep these in a single dedicated commit if dates ever change again. Low priority while the May 29 dates are locked.
