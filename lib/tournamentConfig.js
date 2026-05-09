/**
 * Single source of truth for World Cup 5s tournament structure and dates.
 * Format: 8 groups × 6 teams; top 4 in each group (32 teams) enter knockout:
 * Round of 32 → Round of 16 → Quarter-finals → Semi-finals → Final (1 winner).
 */

export const TOURNAMENT_DATES = {
  /** First matchday (live play window opens) */
  start: "29 May 2026",
  /** Trophy / final day */
  end: "31 May 2026",
  /** Primary public string — use everywhere UI mentions live dates */
  rangeShort: "29–31 May 2026",
  rangeLong: "Thursday 29 May – Saturday 31 May 2026",
  rangeRSS: "May 29–31, 2026",
  /** Registration / roster lock before the live window */
  signupDeadline: "22 May 2026",
  /** SAST end-of-day — must match POST registration gate in `app/api/tournament/route.js` */
  signupDeadlineISO: "2026-05-22T23:59:59+02:00",
};

export const TOURNAMENT_FORMAT = {
  groupCount: 8,
  teamsPerGroup: 6,
  totalTeams: 48,
  /** Four best records per group qualify for the Round of 32 (8×4 = 32). */
  advancePerGroup: 4,
  knockoutTeams: 32,
  bracket: [
    "Round of 32",
    "Round of 16",
    "Quarter-finals",
    "Semi-finals",
    "Final",
  ],
  bracketSummary:
    "8 groups × 6 teams → top 4 per group → Round of 32 → Round of 16 → Quarter-finals → Semi-finals → Final",
  qualificationLegend:
    "Top 4 in each group qualify for the Round of 32 (32 teams total)",
  /** Single-elimination games after the group stage (16+8+4+2+1). */
  knockoutMatchTotal: 31,
  /** Round-robin pairs per group: n(n-1)/2 for n=6 → 15. */
  groupMatchPerGroup: 15,
  groupMatchTotal: 120,
  /** Shown on stats / marketing: group + knockout. */
  totalMatchSummary: "120 group stage + 31 knockout = 151 matches",
};
