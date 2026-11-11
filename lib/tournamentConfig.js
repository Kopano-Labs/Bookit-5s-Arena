/**
 * Single source of truth for the completed World Cup 5s tournament.
 * Historical format: 8 groups × 6 teams; top 4 in each group (32 teams) enter knockout:
 * Round of 32 → Round of 16 → Quarter-finals → Semi-finals → Final.
 */

export const TOURNAMENT_DATES = {
  start: "29 May 2026",
  startISO: "2026-05-29T00:00:00+02:00",
  end: "31 May 2026",
  endISO: "2026-05-31T23:59:59+02:00",
  rangeShort: "29–31 May 2026",
  rangeLong: "Friday 29 May – Sunday 31 May 2026",
  rangeRSS: "May 29–31, 2026",
  signupDeadline: "22 May 2026",
  signupDeadlineISO: "2026-05-22T23:59:59+02:00",
};

export function getTournamentLifecycle(now = new Date()) {
  const registrationDeadline = new Date(TOURNAMENT_DATES.signupDeadlineISO);
  const eventStart = new Date(TOURNAMENT_DATES.startISO);
  const eventEnd = new Date(TOURNAMENT_DATES.endISO);

  if (now < registrationDeadline) return "registration";
  if (now < eventStart) return "registration-closed";
  if (now <= eventEnd) return "live";
  return "archived";
}

export const TOURNAMENT_FORMAT = {
  groupCount: 8,
  teamsPerGroup: 6,
  totalTeams: 48,
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
  knockoutMatchTotal: 31,
  groupMatchPerGroup: 15,
  groupMatchTotal: 120,
  totalMatchSummary: "120 group stage + 31 knockout = 151 matches",
};
