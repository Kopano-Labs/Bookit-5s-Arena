import { withRuntimeCache } from "@/lib/runtimeCache";

const FPL_BOOTSTRAP_URL = "https://fantasy.premierleague.com/api/bootstrap-static/";
const FPL_FIXTURES_URL = "https://fantasy.premierleague.com/api/fixtures/";
const FPL_NAMESPACE = "fpl";

function buildBadgeUrl(code, size = 70) {
  return `https://resources.premierleague.com/premierleague/badges/${size}/t${code}.png`;
}

async function fetchFplJson(url, cacheKey, ttlMs) {
  return withRuntimeCache(FPL_NAMESPACE, cacheKey, ttlMs, async () => {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "5sArena/1.0",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`FPL request failed with ${response.status}`);
    }

    return response.json();
  });
}

export async function fetchFplBootstrap() {
  return fetchFplJson(FPL_BOOTSTRAP_URL, "bootstrap", 6 * 60 * 60 * 1000);
}

export async function fetchFplFixtures() {
  return fetchFplJson(FPL_FIXTURES_URL, "fixtures", 5 * 60 * 1000);
}

export async function getFplTeamMap() {
  const bootstrap = await fetchFplBootstrap();

  return new Map(
    (bootstrap?.teams || []).map((team) => [
      team.id,
      {
        id: String(team.id),
        name: team.name,
        shortName: team.short_name,
        code: team.code,
        logo: buildBadgeUrl(team.code),
      },
    ]),
  );
}

export function mapFplFixtureStatus(fixture) {
  if (fixture.finished) {
    return {
      state: "completed",
      short: "FT",
      long: "Full Time",
      isLive: false,
    };
  }

  if (fixture.started) {
    const minute = Number.isFinite(fixture.minutes) ? fixture.minutes : null;
    return {
      state: "live",
      short: minute ? `${minute}'` : "LIVE",
      long: "Live",
      isLive: true,
      minute,
    };
  }

  if (!fixture.kickoff_time) {
    return {
      state: "postponed",
      short: "PPD",
      long: "Postponed",
      isLive: false,
    };
  }

  return {
    state: "scheduled",
    short: "NS",
    long: "Scheduled",
    isLive: false,
  };
}

export async function getFplPremierLeagueFixtures() {
  const [teamMap, fixtures] = await Promise.all([
    getFplTeamMap(),
    fetchFplFixtures(),
  ]);

  return (fixtures || []).map((fixture) => {
    const homeTeam = teamMap.get(fixture.team_h);
    const awayTeam = teamMap.get(fixture.team_a);
    const status = mapFplFixtureStatus(fixture);

    return {
      id: String(fixture.id),
      provider: "fpl",
      week: fixture.event,
      kickoffTime: fixture.kickoff_time,
      status,
      home: homeTeam,
      away: awayTeam,
      score: {
        home: fixture.team_h_score,
        away: fixture.team_a_score,
      },
      started: fixture.started,
      finished: fixture.finished,
      finishedProvisional: fixture.finished_provisional,
      minute: status.minute || null,
    };
  });
}
