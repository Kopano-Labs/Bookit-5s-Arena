# Phase 2 Update — NavBar + Tournament Constants

**Date:** 2026-04-28
**Status:** Local commits only; push pending Architect verification.
**Main Brain ref:** `Schematics/12-PLAN MODE SESSIONS/2026-04-28 - Bookit MVP Fix - Phase 1 + 2.md`

## Architecture Changes

### Role hierarchy now 5 tiers
`lib/roles.js`:
```js
ALL_ROLES = ['user', 'security_guard', 'manager', 'admin']
ROLE_HIERARCHY = { guest: 0, user: 1, security_guard: 2, manager: 3, admin: 4 }
```
Header and BottomNavbar both render dedicated SECURITY_NAV / SECURITY_ITEMS for `activeRole === 'security_guard'`.

### New: `lib/tournamentConfig.js` — single source of truth
Exports `TOURNAMENT_DATES` (start, end, ranges, signupDeadline) and `TOURNAMENT_FORMAT` (groupCount, teamsPerGroup, totalTeams, advancePerGroup, bracket array, summary). Consumed by `lib/fixtureGenerator.js`, `app/tournament/page.jsx`, `app/login/page.jsx`, `components/home/TournamentShowcase.jsx`.

Future date or format edits live in this file only.

### `eslint.config.mjs` ignores `STRUCTURE/**`
Sub-Brain mirror caused OOM on minified Obsidian plugin bundles >500KB. `npm run lint` now completes.

### New: `FOUND_BUT_OUT_OF_SCOPE.md` at repo root
Persistent register of deferred work. Each entry: Discovered / Scope reason / Suggested next session.

## Files Touched (Phase 1 + 2 net)

**Modified:** `lib/roles.js`, `lib/fixtureGenerator.js`, `components/Header.jsx`, `components/BottomNavbar.jsx`, `eslint.config.mjs`, `app/tournament/standings/page.jsx`, `app/tournament/page.jsx`, `app/tournament/manager/page.jsx`, `app/rules-of-the-game/page.jsx`, `app/help/page.jsx`, `app/api/rss/route.js`, `app/login/page.jsx`, `components/home/TournamentShowcase.jsx`

**New:** `lib/tournamentConfig.js`, `FOUND_BUT_OUT_OF_SCOPE.md`
