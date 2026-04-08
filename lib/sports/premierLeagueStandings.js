import { getFplPremierLeagueFixtures, getFplTeamMap } from "@/lib/sports/fpl";
import { getPremierLeagueSeasonOptions } from "@/lib/sports/isports";
import { getFootballNewsFeed } from "@/lib/media/news";
import { getCuratedReactorVideos } from "@/lib/media/reactors";

function getActiveSeasonYear(referenceDate = new Date()) {
  const month = referenceDate.getMonth() + 1;
  return month >= 7 ? referenceDate.getFullYear() : referenceDate.getFullYear() - 1;
}

function createSplit() {
  return {
    played: 0,
    points: 0,
    won: 0,
    draw: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
  };
}

function createTeamRow(team) {
  return {
    teamId: team.id,
    team,
    points: 0,
    played: 0,
    won: 0,
    draw: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
    home: createSplit(),
    away: createSplit(),
    lastResults: [],
    recentFixtures: [],
  };
}

function getResultLabel(goalsFor, goalsAgainst) {
  if (goalsFor > goalsAgainst) {
    return "W";
  }

  if (goalsFor < goalsAgainst) {
    return "L";
  }

  return "D";
}

function applyMatchToSplit(split, goalsFor, goalsAgainst) {
  split.played += 1;
  split.goalsFor += goalsFor;
  split.goalsAgainst += goalsAgainst;
  split.goalDifference = split.goalsFor - split.goalsAgainst;

  if (goalsFor > goalsAgainst) {
    split.won += 1;
    split.points += 3;
  } else if (goalsFor < goalsAgainst) {
    split.lost += 1;
  } else {
    split.draw += 1;
    split.points += 1;
  }
}

function registerCompletedMatch(row, fixture, isHome) {
  const goalsFor = isHome ? fixture.score.home : fixture.score.away;
  const goalsAgainst = isHome ? fixture.score.away : fixture.score.home;
  const opponent = isHome ? fixture.away : fixture.home;
  const split = isHome ? row.home : row.away;

  row.played += 1;
  row.goalsFor += goalsFor;
  row.goalsAgainst += goalsAgainst;
  row.goalDifference = row.goalsFor - row.goalsAgainst;

  if (goalsFor > goalsAgainst) {
    row.won += 1;
    row.points += 3;
  } else if (goalsFor < goalsAgainst) {
    row.lost += 1;
  } else {
    row.draw += 1;
    row.points += 1;
  }

  applyMatchToSplit(split, goalsFor, goalsAgainst);

  row.lastResults.push({
    fixtureId: fixture.id,
    result: getResultLabel(goalsFor, goalsAgainst),
    goalsFor,
    goalsAgainst,
    opponent,
    kickoffTime: fixture.kickoffTime,
    isHome,
  });
}

function registerUpcomingMatch(row, fixture, isHome) {
  row.recentFixtures.push({
    fixtureId: fixture.id,
    kickoffTime: fixture.kickoffTime,
    opponent: isHome ? fixture.away : fixture.home,
    isHome,
  });
}

function sortRows(rows, view) {
  const sorted = [...rows];

  const comparators = {
    overall: (left, right) =>
      right.points - left.points ||
      right.goalDifference - left.goalDifference ||
      right.goalsFor - left.goalsFor ||
      left.team.name.localeCompare(right.team.name),
    form: (left, right) =>
      right.formPoints - left.formPoints ||
      right.formGoalDifference - left.formGoalDifference ||
      right.points - left.points ||
      left.team.name.localeCompare(right.team.name),
    home: (left, right) =>
      right.home.points - left.home.points ||
      right.home.goalDifference - left.home.goalDifference ||
      right.points - left.points,
    away: (left, right) =>
      right.away.points - left.away.points ||
      right.away.goalDifference - left.away.goalDifference ||
      right.points - left.points,
    goals: (left, right) =>
      right.goalsFor - left.goalsFor ||
      right.goalDifference - left.goalDifference ||
      right.points - left.points,
  };

  sorted.sort(comparators[view] || comparators.overall);
  return sorted;
}

function decorateRow(row, rank) {
  const lastFive = [...row.lastResults]
    .sort((left, right) => new Date(right.kickoffTime) - new Date(left.kickoffTime))
    .slice(0, 5);

  const formPoints = lastFive.reduce(
    (total, item) => total + (item.result === "W" ? 3 : item.result === "D" ? 1 : 0),
    0,
  );
  const formGoalDifference = lastFive.reduce(
    (total, item) => total + (item.goalsFor - item.goalsAgainst),
    0,
  );

  return {
    ...row,
    rank,
    lastFive,
    formPoints,
    formGoalDifference,
  };
}

function formatFixtureForPanel(fixture) {
  const kickoffTime = fixture.kickoffTime ? new Date(fixture.kickoffTime) : null;

  return {
    fixtureId: fixture.fixtureId,
    opponent: fixture.opponent,
    isHome: fixture.isHome,
    kickoffTime: fixture.kickoffTime,
    dateLabel: kickoffTime
      ? new Intl.DateTimeFormat("en-ZA", {
          weekday: "short",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }).format(kickoffTime)
      : "TBC",
  };
}

function buildStreak(lastFive) {
  if (!lastFive.length) {
    return "No recent results";
  }

  const first = lastFive[0].result;
  let streakLength = 0;

  for (const result of lastFive) {
    if (result.result !== first) {
      break;
    }
    streakLength += 1;
  }

  const label = first === "W" ? "win" : first === "L" ? "loss" : "draw";
  return `${streakLength}-match ${label} streak`;
}

function filterArticlesForTeam(teamName, articles) {
  const normalizedTeam = teamName.toLowerCase();
  const aliases = {
    "Manchester City": ["man city", "city"],
    "Manchester United": ["man utd", "united"],
    "Nott'm Forest": ["forest", "nottingham forest"],
    "Spurs": ["tottenham", "spurs"],
    Leeds: ["leeds united"],
  };

  const normalizedAliases = aliases[teamName] || [];

  return articles.filter((article) => {
    const haystack = `${article.title} ${article.summary}`.toLowerCase();
    return (
      haystack.includes(normalizedTeam) ||
      normalizedAliases.some((alias) => haystack.includes(alias))
    );
  });
}

async function buildBaseTable() {
  const teamMap = await getFplTeamMap();
  const fixtures = await getFplPremierLeagueFixtures();
  const rows = new Map();

  for (const team of teamMap.values()) {
    rows.set(team.id, createTeamRow(team));
  }

  for (const fixture of fixtures) {
    const homeRow = rows.get(fixture.home.id);
    const awayRow = rows.get(fixture.away.id);

    if (!homeRow || !awayRow) {
      continue;
    }

    if (fixture.finished) {
      registerCompletedMatch(homeRow, fixture, true);
      registerCompletedMatch(awayRow, fixture, false);
    } else {
      registerUpcomingMatch(homeRow, fixture, true);
      registerUpcomingMatch(awayRow, fixture, false);
    }
  }

  return [...rows.values()].map((row) => decorateRow(row, 0));
}

export async function getPremierLeagueStandings(seasonYear, view = "overall") {
  const seasonOptions = getPremierLeagueSeasonOptions();
  const activeSeasonYear = getActiveSeasonYear();
  const selectedSeason =
    seasonOptions.find((option) => option.year === Number(seasonYear)) ||
    seasonOptions[0];

  if (selectedSeason.year !== activeSeasonYear) {
    return {
      season: selectedSeason,
      view,
      rows: [],
      provider: { name: "FPL results engine", status: "coming-soon" },
      availableViews: ["overall", "form", "home", "away", "goals"],
      emptyState:
        "The next season standings are not published yet. Switch back to the active season for the live table.",
    };
  }

  const baseTable = await buildBaseTable();
  const sortedRows = sortRows(
    baseTable.map((row) => ({
      ...row,
      home: { ...row.home, goalDifference: row.home.goalsFor - row.home.goalsAgainst },
      away: { ...row.away, goalDifference: row.away.goalsFor - row.away.goalsAgainst },
    })),
    view,
  ).map((row, index) => ({ ...row, rank: index + 1 }));

  return {
    season: selectedSeason,
    view,
    rows: sortedRows,
    provider: { name: "FPL results engine", status: "ok" },
    availableViews: ["overall", "form", "home", "away", "goals"],
    emptyState: "",
  };
}

export async function getPremierLeagueTeamAnalysis(teamId, seasonYear) {
  const standings = await getPremierLeagueStandings(seasonYear, "overall");
  const selectedRow = standings.rows.find((row) => row.teamId === String(teamId));

  if (!selectedRow) {
    throw new Error("Team analysis could not be resolved");
  }

  const newsFeed = await getFootballNewsFeed({
    seasonLabel: standings.season.label,
    articleLimit: 12,
    videoLimit: 0,
  });
  const teamArticles = filterArticlesForTeam(selectedRow.team.name, newsFeed.articles).slice(0, 4);
  const relatedVideos = await getCuratedReactorVideos(
    `${selectedRow.team.name} Premier League reaction`,
    { limit: 4 },
  );

  return {
    season: standings.season,
    provider: standings.provider,
    team: selectedRow.team,
    summary: {
      rank: selectedRow.rank,
      points: selectedRow.points,
      played: selectedRow.played,
      won: selectedRow.won,
      draw: selectedRow.draw,
      lost: selectedRow.lost,
      goalsFor: selectedRow.goalsFor,
      goalsAgainst: selectedRow.goalsAgainst,
      goalDifference: selectedRow.goalDifference,
      streak: buildStreak(selectedRow.lastFive),
    },
    lastFive: selectedRow.lastFive,
    home: selectedRow.home,
    away: selectedRow.away,
    nextFixtures: [...selectedRow.recentFixtures]
      .sort((left, right) => new Date(left.kickoffTime) - new Date(right.kickoffTime))
      .slice(0, 4)
      .map(formatFixtureForPanel),
    recentResults: [...selectedRow.lastResults]
      .sort((left, right) => new Date(right.kickoffTime) - new Date(left.kickoffTime))
      .slice(0, 5)
      .map(formatFixtureForPanel),
    relatedArticles: teamArticles,
    relatedVideos,
  };
}
