# Phase 4 — Responsive Verification Matrix

**Date:** 2026-04-28
**Architect:** Kholofelo "Robyn" Rababalela
**Artifact:** `lib/responsiveMatrix.js`
**Main Brain ref:** `Schematics/12-PLAN MODE SESSIONS/2026-04-28 - Bookit MVP Fix - Phase 4.md`

---

## Why this exists

Bookit 5s Arena claims to be a booking platform. Most users encounter it on a 360px Android phone over a 3G/4G connection. If the platform fails on that device, the claim is unverified at the surface where it matters.

This violates three commandments simultaneously:
- **C2 Grounded Truth** — the platform's working-ness is unverified at the primary surface.
- **C3 Servant-Stewardship** — stewardship has failed where the user actually lives.
- **Pillar 2 (Community / Fellowship)** — the township user the platform exists to serve is the one being failed.

Therefore: before any responsive bug is fixed, we codify what "works on mobile" *means*. Phase 5 fixes the NavBar against this matrix. Phase 6 audits the full site against it.

This session built the measurement instrument. It did not fix anything.

---

## The six tiers (priority order, not viewport order)

| Tier | Label | Width | Priority | Tailwind | Network |
|---|---|---|---|---|---|
| 1 | Entry Android | 360px | **PRIMARY** | default | 3G intermittent |
| 2 | Mid-range Smartphone | 414px | HIGH | default | 4G/5G stable |
| 3 | Phone Landscape | 812×375 | HIGH | sm | same as device |
| 4 | Tablet | 768px | MEDIUM | md | WiFi typical |
| 5 | Laptop | 1366px | MEDIUM | lg / xl | WiFi / Ethernet |
| 6 | Desktop / Large | 1920px+ | LOW | 2xl | WiFi / Ethernet |

Per-tier behaviour contracts, failure modes, and verification flows live in [`lib/responsiveMatrix.js`](../../lib/responsiveMatrix.js). The matrix is the source of truth; this document is the audit summary.

---

## Audit data (HEAD `2c30fda`)

### Components (`components/**/*.jsx`)
- **Total component files:** 60
- **With responsive classes (`sm:` / `md:` / `lg:` / `xl:` / `2xl:`):** 41 (177 total occurrences)
- **Without responsive classes:** 19 (utility wrappers + visual components — see breakdown)
- **Components with hardcoded `min-w-[Npx]`:** 0 ✓
- **Components with hardcoded `w-[Npx]`:** 0 ✓ (no obvious horizontal-scroll forcers)

### Pages (`app/**/page.jsx`)
- **Total page files with responsive classes:** 52 (235 total occurrences)
- Several pages have ≤2 occurrences total — minimal mobile consideration: `help`, `jobs`, `security`, `fixtures`, `my-courts`, `bookings/success`, `tournament/polls`, `tournament/bracket`, `admin/security`, `admin/rights`.

---

## Components without breakpoint classes

Categorised by whether the absence is OK or a red flag.

### OK — non-visual / utility wrappers
These contain no JSX layout, only logic or single-element wrappers. Absence of breakpoints is correct.
- `AnalyticsTracker.jsx`
- `AuthProvider.jsx`
- `ClientOnly.jsx`
- `PageTransition.jsx`
- `ScrollToTop.jsx`

### Likely OK — full-bleed or absolute-positioned
- `ArenaBackground.jsx` — full-bleed background, no layout
- `Heading.jsx` — single text element, fluid by default
- `home/Hero3DScene.jsx` — three.js canvas, sized by parent
- `home/HomeLiveFixtures.jsx` — needs verification (likely uses internal child responsive classes)
- `OnlineStatus.jsx` — single dot
- `ScavengerLogo.jsx` — single SVG

### RED FLAGS — visual components likely needing tier verification
- **`BottomNavbar.jsx`** — uses fixed positioning + tap targets; must verify Tier 1 (44px tap target rule). **Phase 5 target.**
- **`InfoTooltip.jsx`** — popover positioning; risk of viewport overflow on Tier 1.
- **`NewsletterPopup.jsx`** — modal, must verify viewport bounds on Tier 1.
- **`SupportChatbot.jsx`** — floating chat panel, frequent Tier 1 overflow vector.
- **`SocialSection.jsx`** (root, NOT `home/SocialSection.jsx`) — duplicate-name component, audit which is canonical.
- **`venue/VenueMap.jsx` and `VenueMap.jsx`** — duplicate, audit for canonical map.
- **`PDFViewer.jsx`** — PDF surfaces are notorious for forcing horizontal scroll on narrow viewports.
- **`GiscusComments.jsx`** — third-party iframe, often does not respect viewport bounds.

---

## Critical components (Phase 5/6 priority)

Source of truth: `CRITICAL_COMPONENTS` in [`lib/responsiveMatrix.js`](../../lib/responsiveMatrix.js).

| Component | Breakpoint count | State |
|---|---|---|
| `Header.jsx` | 19 | RESPONSIVE (Phase 1+2 touched it; needs Tier 1 verification) |
| `BottomNavbar.jsx` | 0 | UNCERTAIN — RED FLAG |
| `manager/ManagerNavbar.jsx` | 5 | PARTIAL |
| `Footer.jsx` | 6 | RESPONSIVE |
| `SearchModal.jsx` | 2 | PARTIAL |
| `RoleSwitcher.jsx` | 1 | PARTIAL |
| `BookingForm.jsx` | 2 | PARTIAL |
| `CourtCard.jsx` | 5 | RESPONSIVE |
| `home/HeroSection.jsx` | 10 | RESPONSIVE |
| `home/CourtsSection.jsx` | 2 | PARTIAL (mobile carousel + desktop grid present, but only 2 breakpoint refs — verify) |
| `home/TournamentSection.jsx` | 18 | RESPONSIVE |
| `home/TournamentShowcase.jsx` | 2 | PARTIAL |
| `fixtures/ArenaFixturesExperience.jsx` | 11 | RESPONSIVE |
| `fixtures/PremierLeagueFixturesHub.jsx` | 30 | RESPONSIVE |

States:
- **RESPONSIVE** = ≥5 breakpoint references
- **PARTIAL** = 1–4 references (likely desktop-first with token mobile gestures)
- **UNCERTAIN** = 0 references AND visual component
- **DESKTOP-ONLY** = 0 references AND no internal layout (none of the critical components fall here)

---

## Phase 5 target (NavBar mobile fix)

In priority order, verified against the matrix:

1. **`components/Header.jsx`** — verify Tier 1 against `VERIFICATION_FLOWS.TIER_1_ENTRY_ANDROID`. Particular focus: hamburger drawer reachability, all 5 nav items visible without inner scroll, tap targets ≥44px, no horizontal overflow at 360px.
2. **`components/BottomNavbar.jsx`** — confirm fixed-position dock does not overlap content's bottom CTA on Tier 1. Verify role-badge legibility ≥10px font (but ≥14px for nav labels). Audit absent breakpoints.
3. **`components/manager/ManagerNavbar.jsx`** — manager portal Tier 1 verification. The mobile nav block at line 85 already uses `flex md:hidden` — confirm overflow-x scroll affordance works at 360px.
4. **`components/RoleSwitcher.jsx`** — embedded inside Header drawer; only 1 breakpoint reference. Verify dropdown trigger ≥44px tap target on Tier 1.
5. **`components/SearchModal.jsx`** — opened from header; 2 breakpoint references. Verify modal width does not exceed Tier 1 viewport.

Phase 5 must NOT touch any of:
- `BottomNavbar.jsx` mobile *layout* (fix in scope; full overhaul is Phase 6).
- Tournament / fixture / court layouts (Phase 6).
- Admin pages (Phase 6).

---

## Phase 6 target (full site audit, in priority order)

1. Modals and floating UI (`NewsletterPopup`, `SupportChatbot`, `InfoTooltip`, `WelcomePopup`).
2. Tournament surfaces (`TournamentShowcase` 2 refs, `TournamentSection` solid, `tournament/standings`, `tournament/bracket` 1 ref).
3. Forms (`BookingForm` 2 refs, `register/manager` 2 refs, login page already 5 refs).
4. Admin pages (`admin/competitions` 12 refs OK; `admin/rights` 1 ref red flag).
5. Duplicate-name components (`SocialSection.jsx` vs `home/SocialSection.jsx`; `VenueMap.jsx` vs `venue/VenueMap.jsx`) — audit which is canonical, delete or rename.
6. Pages with ≤2 breakpoint refs: `help`, `jobs`, `security`, `fixtures`, `my-courts`, `bookings/success`, `tournament/polls`, `tournament/bracket`.

---

## Patterns extracted

1. **Responsive design must be a typed verification surface, not vibes-based testing.** The matrix turns "is it mobile-friendly?" into an enumerable list of contract checks. Phases 5 and 6 are now bounded.
2. **Tier 1 is PRIMARY by mission, not by traffic.** Even if analytics showed mostly desktop today, Pillar 2 says we serve the township user first — the matrix encodes that, not measured behaviour.
3. **Breakpoint-count proxy is fast and noisy.** A component with 18 `lg:` references can still fail Tier 1. Counts surface red flags; they don't certify anything. Verification flow is the actual instrument.

---

## Out of scope (logged here, not fixed)

- All responsive bugs surfaced during audit — these belong to Phase 5 (NavBar) and Phase 6 (site-wide).
- Duplicate-name component cleanup (`SocialSection`, `VenueMap`) — Phase 6.
- `eslint-plugin-tailwindcss` rule to flag missing breakpoints in critical components — future hardening work.

---

## Files Touched

**New:** `lib/responsiveMatrix.js`, `STRUCTURE/04-Updates/2026-04-28 - Phase 4 - Responsive Matrix.md`

No source code edits, no dependency changes, no Tailwind config changes.
