import { fetchISportsLiveScores } from "@/lib/sports/isports";

function formatScheduleDate(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function scheduleWindowDates(referenceDate = new Date(), radiusDays = 3) {
  const dates = [];
  for (let offset = -radiusDays; offset <= radiusDays; offset += 1) {
    const day = new Date(referenceDate);
    day.setDate(day.getDate() + offset);
    dates.push(formatScheduleDate(day));
  }
  return dates;
}

export function filterLeagueMatches(matches, leagueId, seasonYear) {
  return matches.filter(
    (match) =>
      String(match.league?.id) === String(leagueId) &&
      (!seasonYear || String(match.season).startsWith(String(seasonYear))),
  );
}

export async function fetchISportsLeagueLivescores(leagueId, seasonYear) {
  const rows = await fetchISportsLiveScores({ date: undefined });
  return filterLeagueMatches(rows, leagueId, seasonYear);
}

export async function fetchISportsLeagueScheduleWindow(
  leagueId,
  seasonYear,
  referenceDate = new Date(),
) {
  const seen = new Map();

  for (const date of scheduleWindowDates(referenceDate, 3)) {
    try {
      const dayMatches = await fetchISportsLiveScores({ date });
      for (const match of filterLeagueMatches(dayMatches, leagueId, seasonYear)) {
        if (!seen.has(match.id)) {
          seen.set(match.id, match);
        }
      }
    } catch {
      // Try the next day in the window.
    }
  }

  return [...seen.values()];
}

/**
 * Shared provider rule: empty livescores ≠ success — try schedule window next.
 * Premier League FPL fallback remains in premierLeague.js.
 */
export async function resolveISportsLeagueFixtures({
  leagueId,
  seasonYear,
  referenceDate = new Date(),
}) {
  try {
    const liveMatches = await fetchISportsLeagueLivescores(leagueId, seasonYear);
    if (liveMatches.length > 0) {
      return {
        status: "ok",
        provider: "iSports",
        source: "livescores",
        matches: liveMatches,
      };
    }
  } catch {
    // Fall through to schedule window.
  }

  try {
    const scheduledMatches = await fetchISportsLeagueScheduleWindow(
      leagueId,
      seasonYear,
      referenceDate,
    );
    if (scheduledMatches.length > 0) {
      return {
        status: "fallback",
        provider: "iSports schedule",
        source: "schedule",
        matches: scheduledMatches,
      };
    }
  } catch {
    // No schedule data for this league window.
  }

  return {
    status: "empty",
    provider: "none",
    source: "none",
    matches: [],
  };
}
