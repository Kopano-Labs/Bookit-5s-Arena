---
title: Bookit 5s Arena Repo Structure Audit - 2026-04-10
created: 2026-04-10
updated: 2026-04-10
author: Codex
tags:
  - architecture
  - audit
  - structure
  - repo
priority: high
status: active
---

# Bookit 5s Arena Repo Structure Audit - 2026-04-10

> Repo-specific structure snapshot taken after mirroring the source `Schematics` vault into `STRUCTURE`.

## Audit Summary

- `STRUCTURE` was expanded from a partial vault copy to the full source schematic set
- internal markdown link audit inside `STRUCTURE` returned no unresolved relative links
- imported notes still contain Orch and KasiLink context; those remain valid as source material but are not the sole truth for this repo
- this note anchors the imported vault to the live `Bookit-5s-Arena` workspace

## Top-Level Workspace Map

| Path | State | Notes |
|------|-------|-------|
| `app/` | active | largest route surface in the repo; `140` files were present during the audit |
| `components/` | active | shared interface layer with `55` files |
| `lib/` | active | shared business logic and auth utilities with `46` files |
| `public/` | active | static delivery assets with `208` files |
| `models/` | active | data model layer with `13` files |
| `hooks/` | active | custom hook layer with `3` files |
| `context/` | active | shared state/context definitions |
| `data/` | active | source data and content assets |
| `scripts/` | active | operational scripts |
| `src/` | active | supporting code outside `app/` |
| `assets/` | active | working assets not directly served from `public/` |
| `STRUCTURE/` | active | second-brain vault and audit layer |

## Root Config Surface

- Next.js is configured through `next.config.ts`, `middleware.js`, and `next-env.d.ts`
- styling is configured through `tailwind.config.js` and `postcss.config.mjs`
- deployment/runtime support exists in `vercel.json`, `nginx.conf`, `ecosystem.config.js`, and `proxy.js`
- the repo uses `package.json` plus `package-lock.json`

## Current Caveats

- the live git worktree already contains unrelated code edits outside `STRUCTURE`; this audit did not alter them
- `.env.local` exists and should remain local-only
- `middleware.js.bak` is still present at repo root and looks like a retained backup rather than active runtime code
- source-vault notes that assume different repo-root documents should be cross-checked against [Repo Documents Index](../06-Reference/Repo%20Documents%20Index.md)

## Recommended Read Order

1. [Repo Documents Index](../06-Reference/Repo%20Documents%20Index.md)
2. [Route Inventory](Route%20Inventory.md)
3. [System Map](System%20Map.md)
4. [Project Status](../04-Updates/Project%20Status.md)

## Rule

- treat imported schematics as additive knowledge
- treat repo audits in this folder as the local source of truth for structure
