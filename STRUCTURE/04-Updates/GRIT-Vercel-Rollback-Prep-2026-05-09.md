---
title: GRIT — Vercel rollback prep (Bookit 5s Arena)
created: 2026-05-09
updated: 2026-05-09
tags: [grit, vercel, rollback, bookit]
status: active
---

# GRIT — Vercel rollback prep

> **Grounded production surfaces (repo):** `https://fivesarena.com`, `https://www.fivesarena.com` (see `STRUCTURE/06-Reference/Domain Registry.md`, `lib/security/sanitize.js`, `app/api/rss/route.js`).  
> **Symptom URL (Blackbox):** `[BLACKBOX_MASK_SYMPTOM_URL]` — paste the exact broken preview or production URL here when known.  
> **Last stable deployment (Blackbox):** `[BLACKBOX_MASK_VERCEL_ID]` — paste `dpl_…` or full deployment URL from Vercel → Project → Deployments.

## Prep — do not run until IDs exist

From PowerShell (repo root):

```powershell
cd "C:\Users\rkhol\Bookit-5s-Arena"
# Ensure Vercel CLI is linked to the correct scope/project (Owner once):
# npx vercel login
# npx vercel link

# List recent deployments (pick the last GREEN before UI bleed):
npx vercel ls --yes

# Roll back PROMOTION to a known-good deployment (replace placeholder):
npx vercel rollback [BLACKBOX_MASK_VERCEL_ID] --yes
```

Alternative (same effect, dashboard-first): Vercel → **Deployments** → open the last stable deployment → **Promote to Production** (or **Instant Rollback** if your plan shows it).

## Post-rollback smoke (manual)

1. Open production: `https://www.fivesarena.com` (and `[BLACKBOX_MASK_SYMPTOM_URL]` if different).  
2. Walk booking path + navbar; capture console + network if anything fails.  
3. Update parent brain: `Schematics/06-Reference/Open Issues.md`, `Schematics/04-Updates/Project Status.md`, `00-Home/Now.md`.

---

*Cursor: no cloud execution without Owner-supplied deployment ID and authenticated CLI.*
