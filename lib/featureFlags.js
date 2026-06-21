/**
 * Build-time / runtime public flags (NEXT_PUBLIC_*).
 * Set in `.env.local` — never commit secrets.
 */

/** When true, home page shows the Blackbox Market Mask floater. `/creator` always mounts it after intro. */
export function showBlackboxMarketMaskOnHome() {
  if (process.env.NEXT_PUBLIC_BLACKBOX_MARKET_MASK === "false") return false;
  return process.env.NEXT_PUBLIC_BLACKBOX_MARKET_MASK === "true" || process.env.NODE_ENV === "production";
}

/** Heavy Blackbox shield on `/fixtures` while match centre is under refactor. */
export function showFixturesRefactorShield() {
  if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_BDD_TEST_HOOKS === "true") {
    const override = window.localStorage.getItem("bdd_fixtures_shield");
    if (override === "true") return true;
    if (override === "false") return false;
  }
  if (process.env.NEXT_PUBLIC_FIXTURES_REFACTOR_SHIELD === "false") return false;
  return (
    process.env.NEXT_PUBLIC_FIXTURES_REFACTOR_SHIELD === "true" ||
    process.env.NODE_ENV === "production"
  );
}

/** Blackbox floater on fixtures (lighter than full shield). */
export function showBlackboxMarketMaskOnFixtures() {
  if (process.env.NEXT_PUBLIC_BLACKBOX_MARKET_MASK === "false") return false;
  return process.env.NEXT_PUBLIC_BLACKBOX_MARKET_MASK === "true" || process.env.NODE_ENV === "production";
}
