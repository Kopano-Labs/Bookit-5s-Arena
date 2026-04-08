import { getPremierLeagueSeasonOptions } from "@/lib/sports/isports";

export const PREMIER_LEAGUE_STANDINGS_VIEWS = [
  "overall",
  "form",
  "home",
  "away",
  "goals",
];

export const PREMIER_LEAGUE_STATS_CATEGORIES = [
  "goals",
  "assists",
  "yellowCards",
  "redCards",
];

export function normalizePremierLeagueSeason(rawSeason) {
  const seasonOptions = getPremierLeagueSeasonOptions();
  const parsedYear = Number.parseInt(String(rawSeason ?? ""), 10);
  const selectedSeason =
    seasonOptions.find((option) => option.year === parsedYear) || seasonOptions[0];

  return {
    seasonOptions,
    selectedSeason,
    seasonYear: selectedSeason.year,
  };
}

export function normalizePremierLeagueStandingsView(rawView) {
  if (PREMIER_LEAGUE_STANDINGS_VIEWS.includes(rawView)) {
    return rawView;
  }

  return "overall";
}

export function normalizePremierLeagueStatsCategory(rawCategory) {
  if (PREMIER_LEAGUE_STATS_CATEGORIES.includes(rawCategory)) {
    return rawCategory;
  }

  return "goals";
}
