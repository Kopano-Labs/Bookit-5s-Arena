---
title: Repo Documents Index
created: 2026-04-09
updated: 2026-04-10
author: Codex
tags:
  - reference
  - docs
  - repo-root
  - index
priority: high
status: active
---

# Repo Documents Index

> Map of the actual loose root files in `Bookit-5s-Arena`.
> This replaces the imported source-vault assumptions with the files that are really present in this workspace.

## Root Markdown And Policy Files

| File | Purpose | Keep At Root |
|------|---------|--------------|
| `README.md` | project overview and startup guidance | yes |
| `LICENSE` | licensing terms | yes |
| `.gitignore` | repo hygiene and local exclusion rules | yes |
| `.gitattributes` | git normalization rules | yes |

## Runtime And Framework Configuration

| File | Purpose | Keep At Root |
|------|---------|--------------|
| `package.json` | dependency graph and npm scripts | yes |
| `package-lock.json` | locked dependency graph | yes |
| `tsconfig.json` | TypeScript project settings | yes |
| `next.config.ts` | Next.js runtime and build configuration | yes |
| `next-env.d.ts` | Next.js TypeScript ambient types | yes |
| `tailwind.config.js` | design token and utility config | yes |
| `postcss.config.mjs` | CSS processing pipeline | yes |
| `eslint.config.mjs` | lint rules | yes |
| `vercel.json` | Vercel platform configuration | yes |
| `nginx.conf` | reverse-proxy or deployment reference | yes |
| `ecosystem.config.js` | process manager deployment config | yes |

## Runtime Entry And Infra Helpers

| File | Purpose | Keep At Root |
|------|---------|--------------|
| `middleware.js` | Next.js request guarding and route enforcement | yes |
| `middleware.js.bak` | retained backup snapshot | review before removal |
| `proxy.js` | proxy/runtime bridge logic | yes |
| `instrumentation-client.ts` | client instrumentation entry point | yes |
| `fix-sort-order.js` | maintenance helper script | yes |
| `.env.local` | local environment values and secrets | local-only |

## Primary Top-Level Code Areas

| Path | Purpose |
|------|---------|
| `app/` | App Router routes, layouts, and route handlers |
| `components/` | shared UI building blocks |
| `context/` | shared React context and app state wiring |
| `data/` | data fixtures and content sources |
| `hooks/` | custom hooks |
| `lib/` | shared utilities, auth, and platform helpers |
| `models/` | data models |
| `public/` | static assets |
| `scripts/` | operational scripts |
| `src/` | supporting source modules not kept under `app/` |
| `assets/` | non-public design or working assets |
| `STRUCTURE/` | imported and re-engineered schematics vault |

## Current Root Truth

- root files were audited against the live repo on `2026-04-10`
- imported `Schematics` notes that mention missing root docs from another workspace should be treated as archival context, not live truth for this repo
- use [Bookit 5s Arena Repo Structure Audit - 2026-04-10](../03-Architecture/Bookit%205s%20Arena%20Repo%20Structure%20Audit%20-%202026-04-10.md) for the current architecture-facing snapshot

## Organization Rule

- keep runtime and deployment files at the repo root when framework tooling expects them there
- do not move files only to make the tree look tidier
- index and explain them inside `STRUCTURE` instead
