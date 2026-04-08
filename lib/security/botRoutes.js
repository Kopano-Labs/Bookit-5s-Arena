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
