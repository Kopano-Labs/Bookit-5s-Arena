import type { Page, Route } from "@playwright/test";
import { ALL_LEAGUE_SLUGS, resolveLeague } from "./leagueCatalog.js";

export type StubMode =
  | "default"
  | "empty-all"
  | "one-league-populated"
  | "timeout"
  | "duplicate"
  | "malformed-team"
  | "malformed-venue"
  | "postponed"
  | "cancelled"
  | "invalid-kickoff";

export class FixturesStubState {
  mode: StubMode = "default";

  populatedSlug = "la-liga";

  activeSlug = "la-liga";

  timeoutAll = false;

  featuredEmpty = false;

  featuredSlow = false;

  shieldEnabled = true;

  offlineApis = false;

  setLeagueEmpty(slug: string) {
    this.activeSlug = slug;
    this.mode = "empty-all";
  }
}

function json(route: Route, body: unknown, status = 200) {
  return route.fulfill({
    status,
    contentType: "application/json",
    body: JSON.stringify(body),
  });
}

function baseMeta(slug: string) {
  const label = slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

  return {
    league: {
      slug,
      name: label,
      logo: "https://media.api-sports.io/football/leagues/140.png",
    },
    selectedSeason: new Date().getFullYear(),
    seasonOptions: [
      {
        year: new Date().getFullYear(),
        label: `${new Date().getFullYear()}-${String(new Date().getFullYear() + 1).slice(-2)}`,
      },
    ],
  };
}

function sampleMatch(overrides: Record<string, unknown> = {}) {
  return {
    id: "match-1",
    kickoffTime: new Date().toISOString(),
    dateLabel: "Today",
    kickoffLabel: "15:00",
    weekLabel: "Week 12",
    competitionPhase: "League",
    status: { state: "scheduled", short: "NS" },
    minute: null,
    home: { name: "Cape Town City", shortName: "CTC", logo: null },
    away: { name: "Durban United", shortName: "DUR", logo: null },
    score: { home: null, away: null },
    venue: "Arena Stadium",
    provider: "isports",
    ...overrides,
  };
}

function matchesPayload(slug: string, state: FixturesStubState) {
  if (state.timeoutAll) {
    return null;
  }

  const isEmpty =
    state.mode === "empty-all" ||
    (state.mode === "one-league-populated" && slug !== state.populatedSlug);

  if (isEmpty) {
    return { groups: [], season: new Date().getFullYear(), provider: "none" };
  }

  let match = sampleMatch();

  if (state.mode === "postponed") {
    match = sampleMatch({ status: { state: "postponed", short: "Postponed" } });
  } else if (state.mode === "cancelled") {
    match = sampleMatch({ status: { state: "cancelled", short: "Cancelled" } });
  } else if (state.mode === "malformed-team") {
    match = sampleMatch({ away: { name: "", shortName: "", logo: null } });
  } else if (state.mode === "malformed-venue") {
    match = sampleMatch({ venue: "" });
  } else if (state.mode === "invalid-kickoff") {
    match = sampleMatch({ kickoffLabel: "TBD", kickoffTime: "not-a-real-date" });
  }

  const groups = [
    {
      dateKey: "today",
      dateLabel: "Today",
      matches: [match],
    },
  ];

  if (state.mode === "duplicate") {
    groups[0].matches = [match, { ...match, id: "match-1-dup" }];
  }

  return { groups, season: new Date().getFullYear(), provider: "stub" };
}

function premierLeagueMatches() {
  return {
    groups: [
      {
        dateKey: "today",
        dateLabel: "Today",
        matches: [sampleMatch({ weekLabel: "Matchweek 32", competitionPhase: "Premier League" })],
      },
    ],
    season: { year: new Date().getFullYear(), label: "2025-26" },
    provider: { name: "FPL results engine", status: "fallback" },
  };
}

function premierMeta() {
  return {
    league: { slug: "premier-league", name: "Premier League", logo: "https://media.api-sports.io/football/leagues/39.png" },
    selectedSeason: String(new Date().getFullYear()),
    seasonOptions: [
      { year: 2025, label: "2025-26" },
      { year: 2026, label: "2026-27" },
    ],
  };
}

async function handleFootballRoute(route: Route, state: FixturesStubState) {
  const url = new URL(route.request().url());
  const path = url.pathname;

  if (state.offlineApis) {
    return route.abort("failed");
  }

  if (state.timeoutAll) {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return route.abort("timedout");
  }

  if (path === "/api/football/featured") {
    if (state.featuredSlow) {
      await new Promise((resolve) => setTimeout(resolve, 15_000));
    }
    if (state.featuredEmpty) {
      return json(route, []);
    }
    return json(route, [sampleMatch()]);
  }

  const leagueMatch = path.match(/^\/api\/football\/league\/([^/]+)\/(meta|matches|news|standings|stats)$/);
  if (!leagueMatch) {
    return route.continue();
  }

  const [, slug, resource] = leagueMatch;

  if (slug === "premier-league") {
    if (resource === "meta") return json(route, premierMeta());
    if (resource === "matches") {
      if (state.mode === "empty-all") {
        return json(route, { groups: [], season: { year: 2025, label: "2025-26" } });
      }
      return json(route, premierLeagueMatches());
    }
    if (resource === "news") return json(route, { articles: [], videos: [] });
    if (resource === "standings") {
      const season = url.searchParams.get("season");
      if (season === "2026") {
        return json(route, {
          rows: premierStandingsRows(),
          seasonNotice: "2026-27 standings are not published yet. Showing the live 2025-26 table.",
          provider: { name: "FPL results engine", status: "fallback" },
        });
      }
      return json(route, { rows: premierStandingsRows(), provider: { name: "FPL results engine", status: "ok" } });
    }
    if (resource === "stats") {
      const season = url.searchParams.get("season");
      if (season === "2026") {
        return json(route, {
          leaders: premierStatsLeaders(),
          seasonNotice: "2026-27 leaderboards are not published yet. Showing live 2025-26 stats.",
          category: url.searchParams.get("category") || "goals",
        });
      }
      return json(route, {
        leaders: premierStatsLeaders(),
        category: url.searchParams.get("category") || "goals",
      });
    }
  }

  if (resource === "meta") {
    return json(route, baseMeta(slug));
  }
  if (resource === "matches") {
    const payload = matchesPayload(slug, state);
    if (!payload) return route.abort("timedout");
    return json(route, payload);
  }
  if (resource === "news") {
    return json(route, { articles: [], videos: [] });
  }

  return json(route, {});
}

function premierStandingsRows() {
  return Array.from({ length: 5 }, (_, index) => ({
    rank: index + 1,
    teamId: String(index + 1),
    team: { name: `Team ${index + 1}`, shortName: `T${index + 1}` },
    played: 30,
    points: 60 - index,
  }));
}

function premierStatsLeaders() {
  return [
    { rank: 1, player: "Sample Striker", team: "Sample FC", value: 18 },
    { rank: 2, player: "Another Forward", team: "Demo United", value: 15 },
  ];
}

export async function registerFootballApiStubs(page: Page, state: FixturesStubState) {
  await page.route("**/api/football/**", (route) => handleFootballRoute(route, state));
}

export function primeOneOfTwentySevenLeagues(state: FixturesStubState) {
  state.mode = "one-league-populated";
  state.populatedSlug = "la-liga";
  for (const slug of ALL_LEAGUE_SLUGS) {
    if (slug !== state.populatedSlug) {
      // empty handled in matchesPayload
    }
  }
}
