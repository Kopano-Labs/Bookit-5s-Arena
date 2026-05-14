#!/usr/bin/env node
/**
 * Pre-demo fixtures API health check (production or staging base URL).
 * Usage: FIXTURES_HEALTH_BASE_URL=https://fivesarena.com npm run fixtures:health-check
 */
const base = (process.env.FIXTURES_HEALTH_BASE_URL || "https://fivesarena.com").replace(
  /\/$/,
  "",
);

const checks = [
  {
    name: "PL meta",
    url: `${base}/api/football/league/premier-league/meta`,
    assert: (j) => j?.selectedSeason && j?.seasonOptions?.length >= 2,
  },
  {
    name: "PL matches 2025",
    url: `${base}/api/football/league/premier-league/matches?season=2025`,
    assert: (j) => Array.isArray(j?.matches) && j.matches.length > 0,
  },
  {
    name: "PL standings 2025",
    url: `${base}/api/football/league/premier-league/standings?season=2025&view=overall`,
    assert: (j) => Array.isArray(j?.rows) && j.rows.length >= 10,
  },
  {
    name: "PL standings 2026 fallback",
    url: `${base}/api/football/league/premier-league/standings?season=2026&view=overall`,
    assert: (j) =>
      (Array.isArray(j?.rows) && j.rows.length > 0) ||
      Boolean(j?.seasonNotice || j?.emptyState),
  },
  {
    name: "PL stats 2025",
    url: `${base}/api/football/league/premier-league/stats?season=2025&category=goals`,
    assert: (j) => Array.isArray(j?.leaders) && j.leaders.length > 0,
  },
  {
    name: "La Liga matches",
    url: `${base}/api/football/league/la-liga/matches?season=2025`,
    assert: (j) => Array.isArray(j?.matches),
  },
];

let failed = 0;

for (const check of checks) {
  try {
    const res = await fetch(check.url, { cache: "no-store" });
    const json = await res.json();
    if (!res.ok || !check.assert(json)) {
      console.error(`FAIL  ${check.name}  ${check.url}`);
      failed += 1;
    } else {
      console.log(`OK    ${check.name}`);
    }
  } catch (err) {
    console.error(`FAIL  ${check.name}  ${err.message}`);
    failed += 1;
  }
}

if (failed) {
  console.error(`\nfixtures-health-check: ${failed} check(s) failed`);
  process.exit(1);
}

console.log("\nfixtures-health-check: all checks passed");
