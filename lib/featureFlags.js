/**
 * Build-time / runtime public flags (NEXT_PUBLIC_*).
 * Set in `.env.local` — never commit secrets.
 */

/** When true, home page shows the Blackbox Market Mask floater. `/creator` always mounts it after intro. */
export function showBlackboxMarketMaskOnHome() {
  if (process.env.NEXT_PUBLIC_BLACKBOX_MARKET_MASK === "false") return false;
  return process.env.NEXT_PUBLIC_BLACKBOX_MARKET_MASK === "true" || process.env.NODE_ENV === "production";
}
