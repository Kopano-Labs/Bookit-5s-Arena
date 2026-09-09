/**
 * Build-time / runtime public flags (NEXT_PUBLIC_*).
 * Set in `.env.local` — never commit secrets.
 */

import {
  isEpochRelaunchActive as epochRelaunchFromExperiment,
  isEpochRootPath,
} from "@/lib/experiments/KPGSTHREE";

/** Epoch parked public root (Issue #158). Default ON; set NEXT_PUBLIC_EPOCH_RELAUNCH=false to reverse. */
export function isEpochRelaunchActive() {
  return epochRelaunchFromExperiment();
}

/** True when chrome should hide booking / Hellenic venue CTAs on the parked root. */
export function isEpochRelaunchRoot(pathname) {
  return isEpochRelaunchActive() && isEpochRootPath(pathname);
}

/** When true, home page shows the Blackbox Market Mask floater. `/creator` always mounts it after intro. */
export function showBlackboxMarketMaskOnHome() {
  if (isEpochRelaunchActive()) return false;
  return process.env.NEXT_PUBLIC_BLACKBOX_MARKET_MASK === "true";
}

/** Heavy Blackbox shield on `/fixtures` while match centre is under refactor. */
export function showFixturesRefactorShield() {
  if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_BDD_TEST_HOOKS === "true") {
    const override = window.localStorage.getItem("bdd_fixtures_shield");
    if (override === "true") return true;
    if (override === "false") return false;
  }
  return process.env.NEXT_PUBLIC_FIXTURES_REFACTOR_SHIELD === "true";
}

/** Blackbox floater on fixtures (lighter than full shield). */
export function showBlackboxMarketMaskOnFixtures() {
  return process.env.NEXT_PUBLIC_BLACKBOX_MARKET_MASK === "true";
}
