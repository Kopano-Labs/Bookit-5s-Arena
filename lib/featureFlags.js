/**
 * Build-time / runtime public flags (NEXT_PUBLIC_*).
 * Set in `.env.local` — never commit secrets.
 */

/** When true, home page shows the Blackbox Market Mask floater. `/creator` always mounts it after intro. */
export function showBlackboxMarketMaskOnHome() {
  if (process.env.NEXT_PUBLIC_BLACKBOX_MARKET_MASK === "false") return false;
  return process.env.NEXT_PUBLIC_BLACKBOX_MARKET_MASK === "true" || process.env.NODE_ENV === "production";
}

/** Fixtures page: strategy overlay floater (same component as home). */
export function showBlackboxMarketMaskOnFixtures() {
  if (process.env.NEXT_PUBLIC_BLACKBOX_MARKET_MASK === "false") return false;
  if (process.env.NEXT_PUBLIC_FIXTURES_BLACKBOX_MASK === "false") return false;
  return (
    process.env.NEXT_PUBLIC_FIXTURES_BLACKBOX_MASK === "true" ||
    process.env.NEXT_PUBLIC_BLACKBOX_MARKET_MASK === "true" ||
    process.env.NODE_ENV === "production"
  );
}

/** Heavy fixtures refactor banner while IA/data layer is rebuilt. Kill: NEXT_PUBLIC_FIXTURES_REFACTOR_SHIELD=false */
export function showFixturesRefactorShield() {
  if (process.env.NEXT_PUBLIC_FIXTURES_REFACTOR_SHIELD === "false") return false;
  return process.env.NEXT_PUBLIC_FIXTURES_REFACTOR_SHIELD === "true" || process.env.NODE_ENV === "production";
}
