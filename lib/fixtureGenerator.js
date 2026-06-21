/**
 * Random Fixture Generator — Old UEFA Champions League Format
 * Format constants live in lib/tournamentConfig.js (single source of truth).
 */
import { TOURNAMENT_FORMAT } from './tournamentConfig.js';

/**
 * Shuffle an array using Fisher-Yates algorithm
 */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const GROUP_LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H"];

/**
 * Assign teams to groups (6 teams per group, 8 groups)
 * @param {Array} teams - Array of team objects with _id, teamName, worldCupTeam
 * @returns {Object} groups - { A: [...], B: [...], ..., H: [...] }
 */
export function assignGroups(teams) {
  const { totalTeams, teamsPerGroup } = TOURNAMENT_FORMAT;
  if (teams.length > totalTeams) throw new Error(`Maximum ${totalTeams} teams allowed`);

  const shuffled = shuffle(teams);
  const groups = {};

  GROUP_LETTERS.forEach((letter, i) => {
    groups[letter] = shuffled.slice(i * teamsPerGroup, (i + 1) * teamsPerGroup).map((team, seed) => ({
      ...team,
      groupLetter: letter,
      groupNumber: i + 1,
      seed: seed + 1,
    }));
  });

  return groups;
}

/**
 * Generate round-robin fixtures within a group
 * Each team plays every other team once
 * @param {Array} groupTeams - Array of teams in a group
 * @returns {Array} fixtures - Array of { home, away, matchday }
 */
export function generateGroupFixtures(groupTeams) {
  const fixtures = [];
  const n = groupTeams.length;

  // Round-robin: every team plays every other team
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      fixtures.push({
        home: {
          teamId: groupTeams[i]._id || groupTeams[i].teamName,
          teamName: groupTeams[i].teamName,
          worldCupTeam: groupTeams[i].worldCupTeam,
        },
        away: {
          teamId: groupTeams[j]._id || groupTeams[j].teamName,
          teamName: groupTeams[j].teamName,
          worldCupTeam: groupTeams[j].worldCupTeam,
        },
        matchday: Math.ceil((fixtures.length + 1) / Math.floor(n / 2)),
        result: null, // { homeScore: 0, awayScore: 0 }
        played: false,
      });
    }
  }

  return fixtures;
}

/**
 * Generate the entire tournament draw
 * @param {Array} teams - All registered teams
 * @returns {Object} tournament draw
 */
export function generateTournamentDraw(teams) {
  const groups = assignGroups(teams);
  const allFixtures = {};

  GROUP_LETTERS.forEach((letter) => {
    if (groups[letter] && groups[letter].length > 1) {
      allFixtures[letter] = generateGroupFixtures(groups[letter]);
    }
  });

  return {
    groups,
    fixtures: allFixtures,
    format: {
      name: "5s Arena World Cup 2026",
      totalTeams: teams.length,
      groupCount: TOURNAMENT_FORMAT.groupCount,
      teamsPerGroup: TOURNAMENT_FORMAT.teamsPerGroup,
      matchesPerGroup: (TOURNAMENT_FORMAT.teamsPerGroup * (TOURNAMENT_FORMAT.teamsPerGroup - 1)) / 2,
      totalGroupMatches:
        TOURNAMENT_FORMAT.groupCount *
        ((TOURNAMENT_FORMAT.teamsPerGroup * (TOURNAMENT_FORMAT.teamsPerGroup - 1)) / 2),
      knockoutFormat: TOURNAMENT_FORMAT.bracket.join(" → "),
      advanceFromGroup: TOURNAMENT_FORMAT.advancePerGroup,
    },
    knockoutBracket: generateKnockoutBracket(),
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Generate empty knockout bracket template (single elimination).
 * 32 qualifiers → R32 (16 games) → R16 → QF → SF → F.
 */
function generateKnockoutBracket() {
  const roundOf32 = Array.from({ length: 16 }, (_, i) => ({
    match: `R32-${i + 1}`,
    home: `Q-${2 * i + 1}`,
    away: `Q-${2 * i + 2}`,
    result: null,
  }));
  const roundOf16 = Array.from({ length: 8 }, (_, i) => ({
    match: `R16-${i + 1}`,
    home: `W-R32-${2 * i + 1}`,
    away: `W-R32-${2 * i + 2}`,
    result: null,
  }));
  const quarterFinals = Array.from({ length: 4 }, (_, i) => ({
    match: `QF-${i + 1}`,
    home: `W-R16-${2 * i + 1}`,
    away: `W-R16-${2 * i + 2}`,
    result: null,
  }));
  const semiFinals = [
    { match: "SF-1", home: "W-QF-1", away: "W-QF-2", result: null },
    { match: "SF-2", home: "W-QF-3", away: "W-QF-4", result: null },
  ];
  const final = {
    match: "FINAL",
    home: "W-SF-1",
    away: "W-SF-2",
    result: null,
  };
  return { roundOf32, roundOf16, quarterFinals, semiFinals, final };
}

/**
 * Calculate group standings from fixtures
 * @param {Array} fixtures - Completed group fixtures
 * @param {Array} teams - Teams in the group
 * @returns {Array} sorted standings
 */
export function calculateGroupStandings(fixtures, teams) {
  const standings = {};

  teams.forEach((team) => {
    const id = team._id || team.teamName;
    standings[id] = {
      teamName: team.teamName,
      worldCupTeam: team.worldCupTeam,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
    };
  });

  fixtures
    .filter((f) => f.played && f.result)
    .forEach((f) => {
      const home = standings[f.home.teamId];
      const away = standings[f.away.teamId];
      if (!home || !away) return;

      const { homeScore, awayScore } = f.result;
      home.played++;
      away.played++;
      home.goalsFor += homeScore;
      home.goalsAgainst += awayScore;
      away.goalsFor += awayScore;
      away.goalsAgainst += homeScore;

      if (homeScore > awayScore) {
        home.won++;
        home.points += 3;
        away.lost++;
      } else if (homeScore < awayScore) {
        away.won++;
        away.points += 3;
        home.lost++;
      } else {
        home.drawn++;
        away.drawn++;
        home.points++;
        away.points++;
      }

      home.goalDifference = home.goalsFor - home.goalsAgainst;
      away.goalDifference = away.goalsFor - away.goalsAgainst;
    });

  return Object.values(standings).sort(
    (a, b) =>
      b.points - a.points ||
      b.goalDifference - a.goalDifference ||
      b.goalsFor - a.goalsFor,
  );
}
