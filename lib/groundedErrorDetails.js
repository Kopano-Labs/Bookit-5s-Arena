/**
 * Protocol 13 / Grounded Truth: opt-in surfacing of error boundaries on production
 * without permanently leaking internals to all users.
 *
 * Set on Vercel (then redeploy): NEXT_PUBLIC_SHOW_ERROR_DETAILS=true
 * Legacy alias: NEXT_PUBLIC_SHOW_ADMIN_ERROR_DETAILS=true
 */
export function shouldShowClientErrorDetails() {
  if (typeof process === "undefined") return false;
  const dev = process.env.NODE_ENV === "development";
  const flag =
    process.env.NEXT_PUBLIC_SHOW_ERROR_DETAILS === "true" ||
    process.env.NEXT_PUBLIC_SHOW_ADMIN_ERROR_DETAILS === "true";
  return dev || flag;
}

export function formatErrorDetails(error) {
  if (!error) return "";
  const lines = [];
  if (error.message) lines.push(error.message);
  let c = error.cause;
  let depth = 0;
  while (c && depth < 6) {
    const msg = typeof c === "string" ? c : c?.message;
    if (msg) lines.push(`Cause: ${msg}`);
    c = typeof c === "object" && c ? c.cause : null;
    depth += 1;
  }
  if (error.stack) lines.push(error.stack);
  return lines.join("\n\n");
}
