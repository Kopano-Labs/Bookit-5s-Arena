# Bookit 5s Arena Dashboard

## What This Vault Is

This `STRUCTURE/` folder is the project handoff vault for Bookit 5s Arena. It mirrors the Schematics pattern and is tailored for this repo so the next engineer can open it in Obsidian and immediately understand:

- what has been built
- what is stable
- what is protected by auth
- what still needs work
- which phase commits introduced which systems

## Current Rollout State

- Core rollout phases `0` through `14` are complete.
- The public Premier League hub is live in the codebase under `/fixtures`.
- Admin-only sandbox and integrations surfaces are implemented.
- Security hardening and BotID protections are in place.
- The handoff vault exists, but follow-up commits after the initial audit have materially changed the live state and must be read before any new work starts.

## Start Here

1. Read [Project Status](../04-Updates/Project%20Status.md).
2. Review [task-board](../04-Updates/task-board.md).
3. Open [4-Tier User Interface](../03-Architecture/4-Tier%20User%20Interface.md).
4. Check [Open Issues](../06-Reference/Open%20Issues.md).
5. Use [Page Inventory](../06-Reference/Page%20Inventory.md) when tracing routes.

## Completed Phase Commits

- `2ef7a3a` `phase-0-sports-foundation`
- `c62ddb0` `phase-1-matches`
- `2cf76e1` `phase-2-news-media`
- `0085edc` `phase-3-standings`
- `994eed6` `phase-4-stats`
- `5ce02b7` `phase-5-sandbox-integrations`
- `0c9c444` `phase-6-hardening`
- `85ad333` `phase-7-responsive-popup-repairs`
- `22659bb` `phase-8-expanded-fixtures-home-polish`
- `72c0bb8` `phase-9-regenerate-court-images`
- `d13807e` `phase-10-security-hardening`
- `8ef6b3d` `phase-11-botid-anti-bot-hardening`
- `a50416d` `phase-12-env-integrations-weather-search`
- `245907a` `phase-13-whatsapp-osint-admin-review`
- `2b0eb74` `phase-14-obsidian-structure-and-ui-audit`

## Post-Phase Follow-up Commits

- `7781658` `followup-newsletter-mongo-resilience`
- `1fdba7a` `followup-external-access-blockers`
- `3bdc468` `homepage-csp-hero-polish`

## High-Signal Current Notes

- `STRUCTURE/` is the right place for the next engineer to start, but older notes that stopped at Phase 14 have now been refreshed to include the follow-up work.
- Homepage hero, header theme control, Leaflet asset loading, and CSP were all revised after the initial handoff audit.
- Newsletter subscriptions now degrade to a local fallback store when MongoDB is unavailable locally.
- MongoDB connection logic now auto-derives a direct Atlas connection path when SRV resolution fails, but authenticated local QA is still blocked if Atlas rejects the current machine IP.
- Google Search74 and WhatsApp OSINT are wired in code, but current RapidAPI access still returns `403` until the account has the correct API subscriptions/access.
