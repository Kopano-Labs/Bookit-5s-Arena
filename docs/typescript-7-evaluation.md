# TypeScript 7 evaluation for FivesArena

## Objective

Evaluate the TypeScript 7 native compiler against the production FivesArena codebase without replacing the compiler used by Next.js or changing the production dependency graph.

## Current governed state

- Next.js continues to use the repository's existing `typescript` dependency.
- `npm run typecheck` runs the current compiler.
- `npm run typecheck:ts7` installs `typescript@7.0.2` into an isolated temporary workspace and runs the native compiler against `tsconfig.json`.
- The temporary TypeScript 7 installation is deleted after every run.
- `package-lock.json` is not modified by the TypeScript 7 evaluation.

## Commands

```bash
npm run typecheck
npm run typecheck:ts7
npm run typecheck:compare
```

Optional controls:

```bash
TYPESCRIPT_7_VERSION=7.0.2 TYPESCRIPT_7_CHECKERS=2 npm run typecheck:ts7
```

## CI receipt

The `TypeScript 7 Evaluation` workflow records diagnostics from both compiler lanes and uploads the logs as a GitHub Actions artifact.

The regression gate fails when the current compiler passes but TypeScript 7 fails. If the current compiler already reports diagnostics, the workflow preserves both logs for comparison instead of presenting the migration as clean.

## Promotion gate

TypeScript 7 must not replace the production compiler until all of the following are validated:

1. Diagnostic parity is established.
2. Next.js build compatibility is established.
3. BDD smoke tests pass.
4. Offline-sync validation passes.
5. Build-time and memory receipts show a material improvement.
6. The final dependency strategy is recorded and reviewed.

## Phase boundary

This branch implements the evaluation lane. It does not claim that FivesArena has completed a full TypeScript 7 production migration.
