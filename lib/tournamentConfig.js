/**
 * Single source of truth for World Cup 5s tournament structure and dates.
 * Format: Old UEFA Champions League — 8 groups × 6 teams, top 2 advance.
 */

export const TOURNAMENT_DATES = {
  start: '29 May 2026',
  end: '31 May 2026',
  rangeShort: '29–31 May 2026',
  rangeLong: 'May 29 – 31, 2026',
  rangeRSS: 'May 29–31, 2026',
  signupDeadline: '22 May 2026',
};

export const TOURNAMENT_FORMAT = {
  groupCount: 8,
  teamsPerGroup: 6,
  totalTeams: 48,
  advancePerGroup: 2,
  bracket: ['Round of 16', 'Quarter-finals', 'Semi-finals', 'Final'],
  bracketSummary:
    '8 groups × 6 teams → Round of 16 → Quarter-finals → Semi-finals → Final',
  qualificationLegend: 'Top 2 advance to Round of 16',
};
