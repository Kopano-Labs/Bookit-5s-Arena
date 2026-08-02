/**
 * BotID route protection configuration.
 *
 * The explicit JSDoc keeps `checkLevel` narrowed to BotID's supported
 * literal values when this JavaScript module is consumed by TypeScript.
 *
 * @type {Array<{
 *   path: string;
 *   method: string;
 *   advancedOptions: { checkLevel: "basic" | "deepAnalysis" };
 * }>}
 */
export const BOTID_PROTECTED_ROUTES = [
  {
    path: "/api/auth/register",
    method: "POST",
    advancedOptions: { checkLevel: "deepAnalysis" },
  },
  {
    path: "/api/bookings",
    method: "POST",
    advancedOptions: { checkLevel: "basic" },
  },
  {
    path: "/api/bookings/guest",
    method: "POST",
    advancedOptions: { checkLevel: "deepAnalysis" },
  },
  {
    path: "/api/events",
    method: "POST",
    advancedOptions: { checkLevel: "deepAnalysis" },
  },
  {
    path: "/api/support",
    method: "POST",
    advancedOptions: { checkLevel: "basic" },
  },
  {
    path: "/api/chat",
    method: "POST",
    advancedOptions: { checkLevel: "basic" },
  },
];
