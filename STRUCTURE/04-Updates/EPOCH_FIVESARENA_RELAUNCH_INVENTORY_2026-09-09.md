# Epoch FivesArena relaunch — Hellenic public-surface inventory

**Authority:** RobynAwesome/Introduction-to-MCP Issue #158  
**Baseline SHA (origin/main at branch cut):** `c5a4bd1978b22b36538ab690c78fe18d49a0305e`  
**Branch:** `epoch/fivesarena-relaunch`  
**Actor:** Stateless renter (Cursor) — `I_AM_STATELESS_RENTER_NOT_LANDLORD`  
**Date:** 2026-09-09

## Historical correction (locked)

The previously documented **5% transaction fee model applied to other B2B / B2O / NPO prospects. It was NOT Hellenic's commercial term.**

## Active public surfaces identified (pre-change)

| Surface | Hellenic / booking signals | Epoch action |
|---|---|---|
| `app/page.jsx` | Mounted `PitchStadiumScene` as Hellenic FC 4-pitch layout; courts/booking/events/contact | **Replaced** with parked relaunch shell |
| `components/3d/PitchStadiumScene.jsx` | Explicit Hellenic naming + WhatsApp booking | **Archived in place** (not deleted; no longer mounted on `/`) |
| `components/home/HeroSection.jsx` | Hellenic FC + WhatsApp CTA | Preserved; unmounted from `/` |
| `components/home/WelcomePopup.jsx` | Hellenic GK / booking prompts | Preserved; unmounted from `/` |
| `components/home/AboutSection.jsx` / `CourtsSection.jsx` / `ContactSection.jsx` / `SocialSection.jsx` | Venue identity + WhatsApp | Preserved; unmounted from `/` |
| `app/layout.jsx` metadata | Hellenic keywords/description | **Neutralized** for epoch SEO continuity |
| `components/Header.jsx` / `TruthFooter.jsx` / `BottomNavbar.jsx` | Book / WhatsApp / Hellenic chrome on `/` | **Soft-parked** on epoch root only |
| `app/creator/page.jsx` | Stale hyphenated LinkedIn slug | **Corrected** to current LinkedIn URL |
| `/about`, `/contact`, `/play`, `/partners`, tournament archives, admin APIs | Residual Hellenic references | **Not destroyed** this PR; out of parked-root scope; classify later |

## Preservation membrane

- Repository history retained
- Database / schemas / booking APIs retained
- Screenshots, Search Console, deployment history retained
- No mass-410 / global domain redirect

## Outbound identity (exact)

- https://KopanoLabs.com
- https://KRRababalela.com
- https://www.linkedin.com/in/kholofelorobynrababalela/

## Experiment

`lib/experiments/KPGSTHREE.ts` — Experiment 001 — EXPERIMENTAL / POC  
Kage = pattern reference only. No source/artwork copy.
